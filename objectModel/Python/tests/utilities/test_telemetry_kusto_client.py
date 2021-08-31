# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import time
import unittest
from datetime import datetime
from typing import cast
from tests.common import async_test, TestHelper

from cdm.enums import CdmObjectType, CdmStatusLevel, EnvironmentType
from cdm.objectmodel import CdmCorpusDefinition
from cdm.utilities.logging.telemetry_kusto_client import TelemetryKustoClient
from cdm.utilities.logging.telemetry_config import TelemetryConfig
from cdm.utilities import time_utils

# Environment variables for Kusto configuration.
TENANT_ID = os.environ.get('KUSTO_TENANTID')
CLIENT_ID = os.environ.get('KUSTO_CLIENTID')
SECRET = os.environ.get('KUSTO_SECRET')
CLUSTER_NAME = os.environ.get('KUSTO_CLUSTER')
DATABASE_NAME = os.environ.get('KUSTO_DATABASE')
INFO_TABLE = os.environ.get('KUSTO_INFOTABLE')
WARNING_TABLE = os.environ.get('KUSTO_WARNINGTABLE')
ERROR_TABLE = os.environ.get('KUSTO_ERRORTABLE')

# The path between TestDataPath and TestName.
TEST_SUB_PATH = 'Utilities'


def check_kusto_environment():
    """Check if the environment variable for telemetry is set."""
    return (os.environ.get('KUSTO_RUNTESTS') is None)


def event_callback(status_level: 'CdmStatusLevel', message: str):
    """Declare a blackhole callback."""


class TestTelemetryKustoClient(unittest.TestCase):

    @async_test
    @unittest.skipIf(check_kusto_environment(), 'KUSTO_RUNTESTS environment variable not set.')
    async def test_initialize_client_with_default_database(self):
        """
        Test for ingesting logs into default CDM Kusto database.
        """
        corpus = self._initialize_client_with_default_database()
        corpus.telemetry_client.enable()

        await self._call_resolve_manifest_with_an_entity(corpus)

        # Wait until all the logs are ingested
        while not cast('TelemetryKustoClient', corpus.telemetry_client).check_request_queue_is_empty():
            time.sleep(cast('TelemetryKustoClient', corpus.telemetry_client).timeout_milliseconds / 1000)

    @async_test
    @unittest.skipIf(check_kusto_environment(), "KUSTO_RUNTESTS environment variable not set.")
    async def test_initialize_client_with_user_database(self):
        """
        Test for ingesting logs into user-defined Kusto database.
        """
        corpus = self._initialize_client_with_user_database()
        corpus.telemetry_client.enable()

        await self._call_resolve_manifest_with_an_entity(corpus)

        # Wait until all the logs are ingested
        while not cast('TelemetryKustoClient', corpus.telemetry_client).check_request_queue_is_empty():
            time.sleep(cast('TelemetryKustoClient', corpus.telemetry_client).timeout_milliseconds / 1000)

    @async_test
    @unittest.skipIf(check_kusto_environment(), 'KUSTO_RUNTESTS environment variable not set.')
    async def test_aad_app_authorization_exception(self):
        """
        Test with invalid AAD App credentials, which should fail the authorization.
        """
        corpus = CdmCorpusDefinition()

        # Initialize with some dummy credentials
        tenant_id = os.environ.get('KUSTO_TENANTID')
        kusto_config = TelemetryConfig(tenant_id=tenant_id, client_id='client_id', secret='secret', 
                                        cluster_name='cluster_name', database_name='database_name', 
                                        ingest_at_level=EnvironmentType.DEV, remove_user_content=False)

        corpus.telemetry_client = TelemetryKustoClient(corpus.ctx, kusto_config)
        
        try:
            await cast('TelemetryKustoClient', corpus.telemetry_client).post_kusto_query("some random query")
        except Exception as ex:
            self.assertTrue(str(ex).startswith('There was an error while acquiring Kusto authorization Token with client ID/secret authentication.'))

    @async_test
    @unittest.skipIf(check_kusto_environment(), "KUSTO_RUNTESTS environment variable not set.")
    async def test_maximum_timeout_and_retries(self):
        """
        Test retry policy with max timeout set to be a small value
        """
        # Initialize credentials
        corpus = self._initialize_client_with_default_database()  # type: CdmCorpusDefinition

        # Set timeout to 1 millisecond so the function will reach max retries and fail
        cast('TelemetryKustoClient', corpus.telemetry_client).timeout_milliseconds = 1

        query = '.ingest inline into table infoLogs<|\n{0},'.format(time_utils._get_formatted_date_string(datetime.utcnow())) \
            + 'class name,method name,some message,None,corpus path,correlation id,api correlation id,app id,property'

        try:
            await cast('TelemetryKustoClient', corpus.telemetry_client).post_kusto_query(query)
        except Exception as ex:
            self.assertTrue('error timed out' in str(ex))

    def _initialize_client_with_default_database(self) -> 'CdmCorpusDefinition':
        corpus = TestHelper.get_local_corpus('Utilities', 'TestTelemetryKustoClient')  # type: CdmCorpusDefinition

        self.assertIsNotNone(TENANT_ID)
        self.assertIsNotNone(CLIENT_ID)
        self.assertIsNotNone(SECRET)
        self.assertIsNotNone(CLUSTER_NAME)
        self.assertIsNotNone(DATABASE_NAME)

        kusto_config = TelemetryConfig(tenant_id=TENANT_ID, client_id=CLIENT_ID, secret=SECRET, 
                                        cluster_name=CLUSTER_NAME, database_name=DATABASE_NAME, 
                                        ingest_at_level=EnvironmentType.DEV, remove_user_content=False)
        
        corpus.telemetry_client = TelemetryKustoClient(corpus.ctx, kusto_config)
        corpus.app_id = 'CDM Integration Test'
        corpus.set_event_callback(event_callback, CdmStatusLevel.PROGRESS)

        return corpus

    def _initialize_client_with_user_database(self) -> 'CdmCorpusDefinition':
        corpus = TestHelper.get_local_corpus('Utilities', 'TestTelemetryKustoClient')  # type: CdmCorpusDefinition

        self.assertIsNotNone(TENANT_ID)
        self.assertIsNotNone(CLIENT_ID)
        self.assertIsNotNone(SECRET)
        self.assertIsNotNone(CLUSTER_NAME)
        self.assertIsNotNone(DATABASE_NAME)
        self.assertIsNotNone(INFO_TABLE)
        self.assertIsNotNone(WARNING_TABLE)
        self.assertIsNotNone(ERROR_TABLE)

        kusto_config = TelemetryConfig(tenant_id=TENANT_ID, client_id=CLIENT_ID, secret=SECRET, 
                                        cluster_name=CLUSTER_NAME, database_name=DATABASE_NAME,
                                        info_table=INFO_TABLE, warning_table=WARNING_TABLE, error_table=ERROR_TABLE,
                                        ingest_at_level=EnvironmentType.DEV, remove_user_content=False)
        
        corpus.telemetry_client = TelemetryKustoClient(corpus.ctx, kusto_config)
        corpus.app_id = 'CDM Integration Test'
        corpus.set_event_callback(event_callback, CdmStatusLevel.PROGRESS)

        return corpus

    async def _call_resolve_manifest_with_an_entity(self, corpus: 'CdmCorpusDefinition') -> None:
        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'dummy')

        corpus.storage.fetch_root_folder('local').documents.append(manifest, 'default.manifest.cdm.json')
        entity1 = corpus.make_object(CdmObjectType.ENTITY_DEF, 'MyEntity')

        some_attrib1 = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'MyAttribute', False)
        some_attrib1.data_type = corpus.make_ref(CdmObjectType.DATA_TYPE_REF, 'entityId', True)
        entity1.attributes.append(some_attrib1)

        entity1_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, 'MyEntity.cdm.json')
        entity1_doc.definitions.append(entity1)
        corpus.storage.fetch_root_folder('local').documents.append(entity1_doc)

        manifest.entities.append(entity1)
        await manifest.create_resolved_manifest_async('new dummy', None)
