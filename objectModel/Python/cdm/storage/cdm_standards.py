# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import datetime
import json
from typing import Dict, List, Optional

from cdm.storage.network import NetworkAdapter
from cdm.utilities.network.cdm_http_client import CdmHttpClient

from .base import StorageAdapterBase


class CdmStandardsAdapter(NetworkAdapter, StorageAdapterBase):
    """An adapter pre-configured to read the standard schema files published by CDM."""

    _STANDARDS_ENDPOINT = 'https://cdm-schema.microsoft.com';  # type: str

    def __init__(self, root: str = '/logical') -> None:
        """"Constructs a CdmStandardsAdapter.
            # Parameters:
            #   root: The root path specifies either to read the standard files in logical or resolved form.
        """
        super().__init__()
        super(NetworkAdapter, self).__init__()
        super(StorageAdapterBase, self).__init__()

        self.root = root

        # --- internal ---
        self._type = 'cdm-standards'
        self._http_client = CdmHttpClient(self._STANDARDS_ENDPOINT)  # type: CdmHttpClient

    def can_read(self) -> bool:
        return True

    def create_adapter_path(self, corpus_path: str) -> str:
        return self._absolutePath + corpus_path

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        if not adapter_path or not adapter_path.startswith(self._absolutePath):
            return None
        return adapter_path[len(self._absolutePath):]

    def fetch_config(self) -> str:
        result_config = {'type': self._type}

        # construct network configs.
        config_object = {}

        config_object.update(self.fetch_network_config())

        if self.location_hint:
            config_object['locationHint'] = self.location_hint
        
        if self.root:
            config_object['root'] = self.root

        result_config['config'] = config_object

        return json.dumps(result_config)

    async def read_async(self, corpus_path: str) -> str:
        request = self._set_up_cdm_request(self.root + corpus_path, None, 'GET')
        return await super()._read(request)

    def update_config(self, config) -> None:
        if not config:
            return

        self.update_network_config(config)

        config_json = json.loads(config)

        if config_json.get('locationHint'):
            self.location_hint = config_json['locationHint']
        
        if config_json.get('root'):
            self.root = config_json['root']

    @property
    def _absolutePath(self):
        """The combinating of the standards endpoint and the root path."""
        return self._STANDARDS_ENDPOINT + self.root
