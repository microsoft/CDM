# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import asyncio
import threading
import time
import random
import uuid
from queue import Empty, Full, Queue
from typing import Dict, Optional, TYPE_CHECKING

from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition
from cdm.enums import CdmStatusLevel, CdmLogCode, EnvironmentType
from cdm.utilities import logger, TelemetryClient
from cdm.utilities.network.cdm_http_client import CdmHttpClient
from cdm.utilities.network.cdm_http_request import CdmHttpRequest

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.utilities.network.cdm_http_response import CdmHttpResponse
    from .telemetry_config import TelemetryConfig


class TelemetryKustoClient(TelemetryClient):
    """ 
    Telemetry client interface for ingesting logs into database.
    """
    # The time in millisecond to pause sending http request when throttling.
    BACKOFF_FOR_THROTTLING = 200

    # Kusto data ingestion command.
    INGESTION_COMMAND = '.ingest inline into table '

    # The frequency in millisecond by which to check and ingest the request queue.
    INGESTION_FREQUENCY = 500

    # A list of methods whose execution time info to be logged into Kusto database.
    LOG_EXEC_TIME_METHODS = [CdmEntityDefinition.create_resolved_entity_async.__name__,
                            CdmCorpusDefinition.calculate_entity_graph_async.__name__,
                            CdmCorpusDefinition.calculate_entity_graph_async.__name__ + 'perEntity']

    def __init__(self, ctx: 'CdmCorpusContext', telemetry_config: 'TelemetryConfig'):
        # Maximum number of retries allowed for an HTTP request
        self.max_num_retries = 5

        # Maximum timeout for completing an HTTP request including retries.
        self.max_timeout_milliseconds = 10000

        # Maximum timeout for a single HTTP request.
        self.timeout_milliseconds = 1000

        # --- internal ---

        # The CDM corpus context.
        self._ctx = ctx  # type: CdmCorpusContext

        # The Kusto configuration.
        self._config = telemetry_config  # type: TelemetryConfig

        # Queuing all log ingestion request to Kusto.
        self._request_queue = Queue()  # type: Queue[tuple[CdmStatusLevel, str]]

        # An HTTP client for post requests which ingests data into Kusto.
        self._http_client = CdmHttpClient()  # type: CdmHttpClient

    def add_to_ingestion_queue(self, timestamp: str, level: 'CdmStatusLevel', class_name: str, method: str,
                                corpus_path: str, message: str, require_ingestion: bool, code: 'CdmLogCode') -> None:
        """
        Enqueue the request queue with the information to be logged.
        :param timestamp: The log timestamp.
        :param level: Logging status level.
        :param class_name: Usually the class that is calling the method.
        :param method: Usually denotes method calling this method.
        :param corpus_path: Usually denotes corpus path of document.
        :param message: Informational message.
        :param require_ingestion: Whether the log needs to be ingested.
        :param code: Error or warning code.
        """
        # Check if the Kusto config and the concurrent queue has been initialized
        if self._config is None or self._request_queue is None:
            return

        # Not ingest logs from telemetry client to avoid cycling
        if class_name == TelemetryKustoClient.__name__:
            return

        # If ingestion is not required and the level is Progress
        if level == CdmStatusLevel.PROGRESS and not require_ingestion:
            if method in self.LOG_EXEC_TIME_METHODS:
                # Check if the log contains execution time info
                exec_time_message = 'Leaving scope. Time elapsed:'

                # Skip if the log is not for execution time
                if not message.startswith(exec_time_message):
                    return

            # Skip if the method execution time doesn't need to be logged
            else:
                return

        # Configured in case no user-created content can be ingested into Kusto due to compliance issue
        # Note: The remove_user_content property could be deleted in the if the compliance issue gets resolved
        if self._config.remove_user_content:
            corpus_path = None

            if level == CdmStatusLevel.WARNING or level == CdmStatusLevel.ERROR:
                message = None

        log_entry = self._process_log_entry(timestamp, class_name, method, message, code, corpus_path,
                        self._ctx.correlation_id, self._ctx.events.api_correlation_id, self._ctx.corpus.app_id)

        # Add the status level and log entry to the queue to be ingested
        try:
            self._request_queue.put_nowait((level, log_entry))
        except Full:
            logger.warning(self._ctx, TelemetryKustoClient.__name__, self.add_to_ingestion_queue.__name__,
                            None, CdmLogCode.WARN_TELEMETRY_INGESTION_FAILED, 'The request queue is full.')

    def check_request_queue_is_empty(self) -> bool:
        """
        Check if all the requests have been ingested.
        :return: A Boolean indicating whether the queue is empty or not.
        """
        if self._request_queue is None or self._request_queue.empty():
            return True

        return False

    def enable(self) -> None:
        """
        Enable the telemetry client by starting a thread for ingestion.
        """
        # Check if the Kusto config and the concurrent queue has been initialized
        if self._config is None or self._request_queue is None:
            message = 'The telemetry client has not been initialized.'
            logger.info(self._ctx, TelemetryKustoClient.__name__, self.enable.__name__, None, message)
            return

        # Starts a separate thread to ingest telemetry logs into Kusto
        ingestion_thread = threading.Thread(target=self._ingest_request_queue, daemon=True)

        ingestion_thread.start()

    async def post_kusto_query(self, query: str) -> None:
        """
        Get an authorization token and send the query to Kusto.
        :param query: The Kusto query command to be posted to the cluster.
        """
        auth_token = self._config._get_authentication_token()

        query_endpoint = 'https://{0}.kusto.windows.net/v1/rest/mgmt'.format(self._config.kusto_cluster_name)
        kusto_host = '{0}.kusto.windows.net'.format(self._config.kusto_cluster_name)
        query_body = '{{"db":"{0}","csl":"{1}"}}'.format(self._config.kusto_database_name, query)

        headers = {'Accept': 'application/json',
                   'Authorization': auth_token,
                   'Host': kusto_host}  # type: Dict[str, str]

        http_request = CdmHttpRequest(query_endpoint)

        http_request.method = 'POST'
        http_request.headers = headers
        http_request.content = query_body
        http_request.content_type = 'application/json'

        http_request.number_of_retries = self.max_num_retries
        http_request.timeout = self.timeout_milliseconds
        http_request.maximum_timeout = self.max_timeout_milliseconds

        response = await self._http_client._send_async(http_request, self._get_retry_wait_time, self._ctx)

        if response is None:
            raise Exception('Kusto query post failed. The result of a request is undefined.')

        if not response.is_successful:
            raise Exception('Kusto query post failed. HTTP {0} - {1}.'.format(response.status_code, response.reason))

    def _get_retry_wait_time(self, response: 'CdmHttpResponse', has_failed: bool, retry_number: int) -> Optional[int]:
        """
        A callback function for http request retries.
        :param response: CDM Http response.
        :param hasFailed: Indicates whether the request has failed.
        :param retryNumber: The number of retries happened.
        :return: The wait time before starting the next retry.
        """
        if response and (response.is_successful and not has_failed):
            return None

        return random.randint(0, 2**retry_number) * self.BACKOFF_FOR_THROTTLING

    async def _ingest_into_table(self, log_table: str, log_entries: str) -> None:
        """
        Ingest log entries into the table specified.
        :param log_table: The table to be ingested into.
        :param log_entries: The batched log entries.
        """
        # Ingest only if the entries are not empty
        if log_entries:
            query = '{0}{1} <|\n{2}'.format(self.INGESTION_COMMAND, log_table, log_entries)

        try:
            await self.post_kusto_query(query)
        except Exception as ex:
            logger.warning(self._ctx, TelemetryKustoClient.__name__, self._ingest_into_table.__name__,
                            None, CdmLogCode.WARN_TELEMETRY_INGESTION_FAILED, ex)

    async def _ingest_request_queue_async(self):
        """
        Check periodically and ingest all the logs existing in the request queue.
        """
        while True:
            if not self._request_queue.empty():
                # Batch log entries for each table
                info_log_entries = ''  # type: str
                warning_log_entries = ''  # type: str
                error_log_entries = ''  # type: str

                # Dequeue and batch the requests
                while not self._request_queue.empty():
                    try:
                        # Try to dequeue the first request in the queue
                        request = self._request_queue.get_nowait()
                        log_entry = request[1]

                        if request[0] == CdmStatusLevel.PROGRESS:
                            info_log_entries += log_entry
                        elif request[0] == CdmStatusLevel.WARNING:
                            warning_log_entries += log_entry
                        elif request[0] == CdmStatusLevel.ERROR:
                            error_log_entries += log_entry

                    except Empty:
                        break

                # Ingest logs into corresponding tables in the Kusto database
                if self._ctx and self._config:
                    if info_log_entries:
                        await self._ingest_into_table(self._config.kusto_info_log_table, info_log_entries)

                    if warning_log_entries:
                        await self._ingest_into_table(self._config.kusto_warning_log_table, warning_log_entries)

                    if error_log_entries:
                        await self._ingest_into_table(self._config.kusto_error_log_table, error_log_entries)

            # Check the queue at some frequency
            time.sleep(self.INGESTION_FREQUENCY / 1000)

    def _ingest_request_queue(self) -> None:
        """
        Check periodically and ingest all the logs existing in the request queue.
        """
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(self._ingest_request_queue_async())
        loop.close()

    def _process_log_entry(self, timestamp: str, class_name: str, method: str, message: str, log_code: 'CdmLogCode',
                            corpus_path: str, correlation_id: str, api_correlation_id: uuid, app_id: str):
        """
        Process the input log information to remove all unauthorized information.
        :param timestamp: Usually the class that is calling the method.
        :param class_name: Usually the class that is calling the method.
        :param method: Usually denotes method calling this method.
        :param message: Informational message.
        :param log_code: Error code, usually empty.
        :param corpus_path: Usually denotes corpus path of document.
        :param correlation_id: The corpus correlation id.
        :param api_correlation_id: The method correlation id.
        :param app_id: The app id assigned by user.
        :return: A complete log entry.
        """
        # Remove user created contents
        if self._config.ingest_at_level == EnvironmentType.TEST \
            or self._config.ingest_at_level == EnvironmentType.PROD:
            corpus_path = None

        if message is None:
            message = ''

        # Remove all commas from message to ensure the correct syntax of Kusto query
        message = message.replace(',', ';')
        code = log_code.name

        # Additional properties associated with the log
        property = {'Environment': self._config.ingest_at_level.name,
                    'SDKLanguage': 'Python',
                    'Region': self._config.region}  # type: Dict[str, str]
        property_json = self._serialize_dictionary(property)

        return '{0},{1},{2},{3},{4},{5},{6},{7},{8},{9}\n'.format(timestamp, class_name, method,
                message, code, corpus_path, correlation_id, api_correlation_id, app_id, property_json)

    def _serialize_dictionary(self, dictionary: Dict[str, str]):
        """
        Serialize the map and return a string.
        :param dictionary: The dictionary to be serialized.
        :return: The serialized dictionary.
        """
        dict_str = ''

        for key, val in dictionary.items():
            if not val:
                val = 'None'
            dict_str += key + ':' + val + ';'

        return dict_str
