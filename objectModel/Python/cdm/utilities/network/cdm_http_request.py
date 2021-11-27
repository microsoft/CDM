﻿# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import time
from typing import Dict, Optional
import uuid


class CdmHttpRequest:
    """
    Represents the CDM HTTP request.
    """

    def __init__(self, url: str, number_of_retries: int = 0, method: str = None) -> None:
        self.headers = {}  # type: Dict[str, str]
        self.requested_url = url  # type : str
        self.request_id = str(uuid.uuid4())  # type: str
        self.number_of_retries = number_of_retries  # type : int
        self.content = None  # type : Optional[str]
        self.content_type = None # type: Optional[str]
        self.maximum_timeout = None  # type: Optional[int]
        self.timeout = None  # type: Optional[int]

        if method is None:
            self.method = 'GET'
        else:
            self.method = method

        # --- internal ---
        self._start_time = None  # type: Optional[int]

    @property
    def _time_for_maximum_timeout(self) -> int:
        return max(self.maximum_timeout - (time.time() - self._start_time) * 1000, 0)

    @property
    def _maximum_timeout_exceeded(self) -> bool:
        return self._time_for_maximum_timeout == 0

    def _start(self):
        self._start_time = time.time()

    def _strip_sas_sig(self) -> str:
        """
        Strips the value of sas token parameter 'sig'.
        Returns the requested url with the value of 'sig' replaced with 'REMOVED'.
        """
        sig_start_index = self.requested_url.find('sig=')
        if sig_start_index == -1:
            return self.requested_url
        
        sig_end_index = self.requested_url.find('&', sig_start_index + 1)
        sig_end_index = sig_end_index if sig_end_index != -1 else len(self.requested_url)
        return self.requested_url[0:sig_start_index + 4] + 'REMOVED' + self.requested_url[sig_end_index:]