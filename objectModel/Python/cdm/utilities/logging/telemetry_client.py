# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import abc

from cdm.enums import CdmStatusLevel, CdmLogCode


class TelemetryClient:
    """ 
    Telemetry client interface for ingesting logs into database.
    """

    @abc.abstractmethod
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
        raise NotImplementedError()

    @abc.abstractmethod
    def enable(self) -> None:
        """
        Enable the telemetry client by starting a thread for ingestion.
        """
        raise NotImplementedError()