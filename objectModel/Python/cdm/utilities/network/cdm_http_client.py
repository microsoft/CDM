# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import asyncio
import json
import urllib
import urllib.request
import urllib.parse
from datetime import datetime
from typing import Optional, TYPE_CHECKING

from cdm.utilities.network.cdm_http_response import CdmHttpResponse
from cdm.utilities.network.cdm_number_of_retries_exceeded_exception import CdmNumberOfRetriesExceededException
from cdm.utilities.network.cdm_timed_out_exception import CdmTimedOutException
from cdm.utilities import logger


if TYPE_CHECKING:
    from cdm.utilities.network.cdm_http_request import CdmHttpRequest
    from cdm.objectmodel import CdmCorpusContext

def urlopen_wrapper(request, timeout):
    return urllib.request.urlopen(request, timeout=timeout)
    

async def in_thread_urlopen(request, timeout):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
            None, urlopen_wrapper, request, timeout)


class CdmHttpClient:
    """
    CDM Http Client is an HTTP client which implements retry logic to execute retries in
    the case of failed requests. A user can specify API endpoint when creating the client
    and additional path in the CDM HTTP request. Alternatively, if a user doesn't specify
    API endpoint in the client, it has to specify the full path in the request.
    The client also expects a user to specify callback function which will
    be used in the case of a failure (4xx or 5xx HTTP standard status codes).
    """

    def __init__(self, api_endpoint: str = None) -> None:
        self._TAG = CdmHttpClient.__name__
        self.headers = {}  # type : Dict[str, str]
        self._api_endpoint = api_endpoint  # type : str

    async def _send_async(self, cdm_request: 'CdmHttpRequest', callback=None, ctx: Optional['CdmCorpusContext'] = None) -> 'CdmHttpResponse':
        """
        Sends a CDM request with the retry logic.
        :param cdm_request: The CDM Http request.
        :param callback: An optional parameter which specifies a callback
        function that gets executed after we try to execute the HTTP request.
        :return: The Cdm Http response.
        """

        # Merge headers first.
        for key in self.headers:
            cdm_request.headers[key] = self.headers[key]

        cdm_request._start()

        try:
            return await self._send_async_helper(cdm_request, callback, ctx)
        except Exception as exc:
            if isinstance(exc, CdmTimedOutException) and cdm_request._maximum_timeout_exceeded:
                raise CdmTimedOutException('Maximum timeout exceeded.')
            raise exc

    async def _send_async_helper(self, cdm_request: 'CdmHttpRequest', callback, ctx: Optional['CdmCorpusContext']) -> 'CdmHttpResponse':
        """
        Sends a CDM request with the retry logic helper function.
        :param cdm_request: The CDM Http request.
        :param callback: An optional parameter which specifies a callback
        function that gets executed after we try to execute the HTTP request.
        :return: The Cdm Http response.
        """

        full_url = None  # type : str

        if self._api_endpoint is not None:
            full_url = self._combine_urls(self._api_endpoint, cdm_request.requested_url)
        else:
            full_url = cdm_request.requested_url

        data = None  # type: json

        # Set the content to be in the proper form and headers to denote
        # the content type.
        if cdm_request.content is not None:
            data = cdm_request.content
            cdm_request.headers['Content-Type'] = cdm_request.content_type

        # urllib.request.Request() expects 'data' to be in bytes, so we convert to bytes here.
        if data is not None:
            data = data.encode('utf-8')
        request = urllib.request.Request(full_url, method=cdm_request.method, data=data)

        for key in cdm_request.headers:
            request.add_header(key, cdm_request.headers[key])

        # If the number of retries is 0, we only try once, otherwise we retry the specified
        # number of times.
        for retry_number in range(cdm_request.number_of_retries + 1):
            cdm_response = None  # type: CdmHttpResponse
            has_failed = False  # type: bool

            try:
                start_time = datetime.now()
                if ctx is not None:
                    logger.debug(ctx, self._TAG, self._send_async_helper, None,
                                'Sending request: {}, request type: {}, request url: {}, retry number: {}.'.format(
                                    cdm_request.request_id, request.method, cdm_request._strip_sas_sig(), retry_number))

                if cdm_request._maximum_timeout_exceeded:
                    raise Exception('timed out')

                # Calculate how much longer we have before hitting the maximum timout.
                max_timeout = cdm_request._time_for_maximum_timeout

                # The request should timeout either for its own timeout or if maximum timeout is reached.
                timeout = min(max_timeout, cdm_request.timeout) / 1000

                # Send the request and convert timeout to seconds from milliseconds.
                with await in_thread_urlopen(request, timeout=timeout) as response:
                    if response is not None:
                        end_time = datetime.now()
                        if ctx is not None:
                            logger.debug(ctx, self._TAG, self._send_async_helper, None,
                                        'Response for request {} received with elapsed time: {} ms.'.format(
                                            cdm_request.request_id, (end_time - start_time).total_seconds() * 1000.0))
                        cdm_response = CdmHttpResponse()
                        encoded_content = response.read()

                        # Check whether we have appropriate attributes on the object.
                        if hasattr(encoded_content, 'decode'):
                            cdm_response.content = encoded_content.decode('utf-8')

                        if hasattr(response, 'status'):
                            cdm_response.reason = response.reason
                            cdm_response.status_code = response.status

                            # Successful requests have HTTP standard status codes in the 2xx form.
                            cdm_response.is_successful = response.status // 100 == 2

                        if hasattr(response, 'getheaders'):
                            cdm_response.response_headers = dict(response.getheaders())
            except Exception as exception:
                end_time = datetime.now()
                has_failed = True

                if exception.args and exception.args[0].args and exception.args[0].args[0] == 'timed out' and ctx is not None:
                    logger.debug(ctx, self._TAG, self._send_async_helper, None,
                                        'Request {} timeout after {} ms.'.format(
                                            cdm_request.request_id,
                                            (end_time - start_time).total_seconds() * 1000.0))

                # If the server returned an error like, 404, 500...
                if isinstance(exception, urllib.error.URLError):
                    if ctx is not None:
                        logger.debug(ctx, self._TAG, self._send_async_helper, None,
                                    'Response for request {} received with elapsed time: {} ms.'.format(
                                        cdm_request.request_id, (end_time - start_time).total_seconds() * 1000.0))

                    cdm_response = CdmHttpResponse()
                    if hasattr(exception, 'reason'):
                        cdm_response.reason = exception.reason
                    if hasattr(exception, 'status'):
                        cdm_response.status_code = exception.status
                    cdm_response.is_successful = False

                if callback is None or retry_number == cdm_request.number_of_retries:
                    if retry_number != 0 and not cdm_request._maximum_timeout_exceeded:
                        raise CdmNumberOfRetriesExceededException(exception)
                
                    if exception.args and exception.args[0].args and exception.args[0].args[0] == 'timed out':
                        raise CdmTimedOutException('Request timeout.')

                    raise exception

            # Check whether we have a callback function set and whether this is not our last retry.
            if callback is not None and retry_number != cdm_request.number_of_retries and not cdm_request._maximum_timeout_exceeded:
                # Call the callback function with the retry numbers starting from 1.
                wait_time = callback(cdm_response, has_failed, retry_number + 1)  # type: int

                if wait_time is None:
                    return cdm_response

                # Convert from milliseconds to seconds and wait the time specified by the callback.
                await asyncio.sleep(wait_time / 1000)
            else:
                # CDM Http Response exists, could be successful or bad (e.g. 403/404), it is up to caller to deal with it.
                if cdm_response is not None:
                    return cdm_response

                if retry_number < cdm_request.number_of_retries or cdm_request._maximum_timeout_exceeded:
                    raise CdmTimedOutException('Request timeout.')

                # If response doesn't exist repeatedly, just throw that the number of retries has exceeded (we don't have any other information).
                raise CdmNumberOfRetriesExceededException()

        #  Should never come here, but just in case throw this exception.
        raise CdmNumberOfRetriesExceededException()

    def _combine_urls(self, url1: str, url2: str) -> str:
        """
        Combines two parts of the URL.
        :param url1: The first url.
        :param url2: The second url.
        :return: The combined URL.
        """
        return url1.rstrip('/\\') + '/' + url2.lstrip('/\\')
