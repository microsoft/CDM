# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import msal
from typing import Optional, TYPE_CHECKING

from cdm.enums import EnvironmentType, AzureCloudEndpoint

if TYPE_CHECKING:
    from cdm.utilities.network.token_provider import TokenProvider


class TelemetryConfig:
    """
    Configuration information to establish a connection with the database for telemetry collection.
    """

    # Default Kusto database log table names
    CDM_INFOLOG_TABLE = 'infoLogs'
    CDM_WARNINGLOG_TABLE = 'warningLogs'
    CDM_ERRORLOG_TABLE = 'errorLogs'

    def __init__(self, ingest_at_level: 'EnvironmentType', region: Optional[str] = None, **kwargs) -> None:
        self.ingest_at_level = ingest_at_level  # type: EnvironmentType
        self.region = region  # type: Optional[str]

        self.tenant_id = kwargs.get('tenant_id', None)  # type: Optional[str]
        self.client_id = kwargs.get('client_id', None)  # type: Optional[str]
        self.secret = kwargs.get('secret', None)  # type: Optional[str]
        self.remove_user_content = kwargs.get('remove_user_content', True)  # type: Optional[bool]

        self.kusto_cluster_name = kwargs.get('cluster_name', None)  # type: Optional[str]
        self.kusto_database_name = kwargs.get('database_name', None)  # type: Optional[str]
        self.kusto_info_log_table = kwargs.get('info_table', self.CDM_INFOLOG_TABLE)  # type: str
        self.kusto_warning_log_table = kwargs.get('warning_table', self.CDM_WARNINGLOG_TABLE)  # type: str
        self.kusto_error_log_table = kwargs.get('error_table', self.CDM_ERRORLOG_TABLE)  # type: str
        
        self.cloud_instance = kwargs.get('cloud_instance', AzureCloudEndpoint.AZURE_PUBLIC)  # type: AzureCloudEndpoint
        self.token_provider = kwargs.get('token_provider', None)  # type: Optional[TokenProvider]

        # --- internal ---
        self._context = None

    def _get_authentication_token(self) -> Optional[str]:
        """
        Get the authentication token either using AAD App credentials or user-defined token provider.
        """
        # User-defined token provider
        if self.token_provider:
            return self.token_provider.get_token()

        # Get token by supplying AAD App credentials
        elif self.tenant_id and self.client_id and self.secret \
            and self.kusto_cluster_name and self.kusto_database_name \
            and self.kusto_info_log_table and self.kusto_warning_log_table and self.kusto_error_log_table:
            
            result = self._generate_kusto_token()
            return result['token_type'] + ' ' + result['access_token']
        
        # Throw an exception if neither method is configured
        else:
            raise Exception('Failed to get authentication token: No method configured to provide a token.')

    def _build_context(self):
        """
        Build context when users make the first call.
        Need to ensure client Id, tenant and secret are not null.
        """
        if self._context is None:
            self._context = msal.ConfidentialClientApplication(
                self.client_id, 
                authority=self.cloud_instance.value + self.tenant_id, 
                client_credential=self.secret)

    def _generate_kusto_token(self) -> Optional[dict]:
        """
        Generate a Bearer token for accessing the Kusto resource using MSAL.
        """
        # Define the resource scope to be the current Kusto cluster
        scope = ['https://{0}.kusto.windows.net/.default'.format(self.kusto_cluster_name)]

        # Authenticate with AAD App credentials
        self._build_context()

        # Acquire token using MSAL
        result = self._context.acquire_token_for_client(scopes=scope)

        if result and 'error' in result:
            error_description = result['error']

            if 'error_description' in result:
                error_description += ' error_description: ' + result['error_description']

            raise Exception('There was an error while acquiring Kusto authorization Token with client ID/secret authentication. '
                            'Exception: ' + error_description)

        if result is None or 'access_token' not in result or 'token_type' not in result:
            raise Exception('Received invalid Kusto authentication result. '
                            'The result may be None, or missing access_toke and/or token_type authorization header from the authentication result.')

        return result
