# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from .cdm_custom_package import CdmCustomPackageAdapter


class CdmStandardsAdapter(CdmCustomPackageAdapter):
    """An adapter pre-configured to read the standard schema files published by CDM."""

    def __init__(self) -> None:
        """Constructs a CdmStandardsAdapter.
            # Parameters:
            #   root: The root path specifies either to read the standard files in logical or resolved form.
        """
        super().__init__('commondatamodel_objectmodel_cdmstandards', 'schema_documents')

        # --- internal ---
        self._type = 'cdm-standards'

    def fetch_config(self):
        return '{"config":{},"type":"cdm-standards"}'
