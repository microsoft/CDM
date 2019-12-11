import asyncio
import urllib
import urllib.parse
from typing import TYPE_CHECKING

from cdm.utilities.network.cdm_http_response import CdmHttpResponse
from cdm.utilities.network.cdm_number_of_retries_exceeded_exception import CdmNumberOfRetriesExceededException
from cdm.utilities.network.cdm_timed_out_exception import CdmTimedOutException

if TYPE_CHECKING:
    from cdm.utilities.network.cdm_http_request import CdmHttpRequest


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
        self.headers = {}  # type : Dict[str, str]
        self._api_endpoint = api_endpoint  # type : str

    async def send_async(self, cdm_request: 'CdmHttpRequest', callback=None) -> 'CdmHttpResponse':
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

        # TODO: Figure out how to set maximum timeout on the whole method.
        return await self._send_async_helper(cdm_request, callback)

    async def _send_async_helper(self, cdm_request: 'CdmHttpRequest', callback=None) -> 'CdmHttpResponse':
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

        request = urllib.request.Request(full_url, method=cdm_request.method, data=data)

        for key in cdm_request.headers:
            request.add_header(key, cdm_request.headers[key])

        # If the number of retries is 0, we only try once, otherwise we retry the specified
        # number of times.
        for retry_number in range(cdm_request.number_of_retries + 1):
            cdm_response = None  # type: CdmHttpResponse
            has_failed = False  # type: bool

            try:
                # Send the request and convert timeout to seconds from milliseconds.
                with urllib.request.urlopen(request, timeout=cdm_request.timeout / 1000) as response:  # type: http.client.HTTPResponse
                    if response is not None:
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
                            cdm_response.response_headers = response.getheaders()
            except urllib.error.URLError:
                has_failed = True
                raise
            except Exception as exception:

                has_failed = True

                if callback is None or retry_number == cdm_request.number_of_retries:
                    if retry_number != 0:
                        raise CdmNumberOfRetriesExceededException
                    else:
                        if exception.args and exception.args[0].args and exception.args[0].args[0] == 'timed out':
                            raise CdmTimedOutException
                        else:
                            raise exception

            # Check whether we have a callback function set and whether this is not our last retry.
            if callback is not None and retry_number != cdm_request.number_of_retries:
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

                if retry_number == 0:
                    return None

                raise CdmNumberOfRetriesExceededException

        raise CdmNumberOfRetriesExceededException

    def _combine_urls(self, url1: str, url2: str) -> str:
        """
        Combines two parts of the URL.
        :param url1: The first url.
        :param url2: The second url.
        :return: The combined URL.
        """
        return url1.rstrip('/\\') + '/' + url2.lstrip('/\\')
