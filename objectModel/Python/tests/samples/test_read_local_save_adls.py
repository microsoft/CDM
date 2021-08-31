# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from datetime import datetime

from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition
from cdm.storage import LocalAdapter

from tests.common import async_test, TestHelper
from tests.adls_model_json_test_helper import AdlsModelJsonTestHelper
from tests.adls_test_helper import AdlsTestHelper


def IfRunTestsFlagNotSet():
    return (os.environ.get("SAMPLE_RUNTESTS") is None or os.environ.get("ADLS_RUNTESTS") is None)

class ReadLocalSaveAdlsTest(unittest.TestCase):
    tests_subpath = 'Samples'
    test_name = 'test_read_local_save_adls'
    root_relative_path = ''

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), "SAMPLE_RUNTESTS environment variable not set.")
    async def test_read_local_save_adls(self):
        TestHelper.delete_files_from_actual_output(TestHelper.get_actual_output_folder_path(self.tests_subpath, self.test_name))
        self.root_relative_path = 'Samples/TestReadLocalSaveAdls/' + os.environ.get("USERNAME") + '_' + os.environ.get('COMPUTERNAME') + '_Python'
        # Modify partition.location in model.json and save it into actual output
        AdlsModelJsonTestHelper.update_input_and_expected_and_save_to_actual_sub_folder(self.tests_subpath, self.test_name, self.root_relative_path, 'model.json', 'OrdersProductsCustomersLinked', str(datetime.utcnow))
        cdmCorpus = self.setup_cdm_corpus()
        await self.read_local_save_adls(cdmCorpus)
        
        # Check the model.json file in ADLS and delete it.
        actualContent = await cdmCorpus.storage.fetch_adapter("adls").read_async("model.json")
        AdlsModelJsonTestHelper.save_model_json_to_actual_output(self.tests_subpath, self.test_name, 'model.json', actualContent)

        expectedContent = AdlsModelJsonTestHelper.get_expected_file_content(self.tests_subpath, self.test_name, 'model.json')
        TestHelper.compare_same_object(expectedContent, actualContent)


    def setup_cdm_corpus(self) -> CdmCorpusDefinition:
        corpus = CdmCorpusDefinition()
        corpus.default_namespace = 'local'
        corpus.storage.mount('cdm', LocalAdapter(TestHelper.sample_schema_folder_path))
        corpus.storage.mount('local', LocalAdapter(AdlsModelJsonTestHelper.get_actual_sub_folder_path(self.tests_subpath, self.test_name, AdlsModelJsonTestHelper.input_folder_name)))
        corpus.storage.mount('adls', AdlsTestHelper.create_adapter_with_client_id(self.root_relative_path))
        return corpus

    async def read_local_save_adls(self, corpus: CdmCorpusDefinition):
        # ---------------------------------------------------------------------------------------------
        # Create manifest from a local model.json file

        manifest = await corpus.fetch_object_async('local:/model.json')

        # ------------------------------------------------------------------------------------------------------------
        # Explore entities and partitions defined in the model

        print('Listing entity declarations:')
        for decl in manifest.entities:
            print('  ' + decl.entity_name)

            if decl.object_type == CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF:
                for data_part in decl.data_partitions:
                    print('    ' + data_part.location)

        # ---------------------------------------------------------------------------------------------
        # Make a few changes to the model

        # Create a new document where the new entity's definition will be stored
        new_entity_doc = corpus.make_object(CdmObjectType.DOCUMENT_DEF, 'NewEntity.cdm.json')  # type: CdmDocumentDefinition
        new_entity_doc.imports.append('cdm:/foundations.cdm.json')
        corpus.storage.fetch_root_folder('local').documents.append(new_entity_doc)

        new_entity = new_entity_doc.definitions.append('NewEntity', CdmObjectType.ENTITY_DEF, False)  # type: CdmEntityDefinition

        # Define new string attribute and add it to the entity definition
        new_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'NewAttribute')  # type: CdmTypeAttributeDefinition
        new_attribute.data_format = CdmDataFormat.STRING
        new_entity.attributes.append(new_attribute)

        # Call will create entity_declaration_definition based on entity definition and add it to manifest.entities
        new_entity_decl = manifest.entities.append(new_entity)  # type: CdmLocalEntityDeclaration

        # Define a partition and add it to the local declaration
        new_partition = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, 'NewPartition', False)  # type: CdmDataPartitionDefinition
        new_partition.location = 'adls:/NewPartition.csv'
        new_entity_decl.data_partitions.append(new_partition)

        # ---------------------------------------------------------------------------------------------
        # Save the file to ADLSg2 - we achieve that by adding the manifest to the root folder of
        # the ADLS file-system and performing a save on the manifest

        adls_folder = corpus.storage.fetch_root_folder('adls')  # type: CdmFolderDefinition
        adls_folder.documents.append(manifest)
        await manifest.save_as_async('model.json', True)
 