# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from typing import cast

from cdm.enums import CdmStatusLevel, CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmEntityDefinition, CdmLocalEntityDeclarationDefinition, \
    CdmManifestDefinition
from cdm.storage import LocalAdapter

from tests.common import async_test, TestHelper


def IfRunTestsFlagNotSet():
    return (os.environ.get("SAMPLE_RUNTESTS") is None)


class CreateManifestTest(unittest.TestCase):
    tests_subpath = 'Samples'
    test_name = 'test_create_manifest'

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), "SAMPLE_RUNTESTS environment variable not set.")
    async def test_create_manifest(self):
        TestHelper.delete_files_from_actual_output(
            TestHelper.get_actual_output_folder_path(self.tests_subpath, self.test_name))
        await self.create_manifest(self.setup_cdm_corpus())
        error_log = TestHelper.compare_folder_files_equality(
            TestHelper.get_expected_output_folder_path(self.tests_subpath, self.test_name),
            TestHelper.get_actual_output_folder_path(self.tests_subpath, self.test_name), True)
        self.assertEqual('', error_log)

    def setup_cdm_corpus(self):
        # Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating
        # objects and paths.
        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.ctx.report_at_level = CdmStatusLevel.ERROR

        print('Configure storage adapters')
        cdm_corpus.storage.mount('local', LocalAdapter(
            TestHelper.get_actual_output_folder_path(self.tests_subpath, self.test_name)))

        # Local is our default. So any paths that start out navigating without a device tag will assume local.
        cdm_corpus.storage.default_namespace = 'local'

        # Fake cdm, normally use the CDM Standards adapter.
        cdm_corpus.storage.mount('cdm', LocalAdapter(TestHelper.sample_schema_folder_path))
        return cdm_corpus

    async def create_manifest(self, cdm_corpus: CdmCorpusDefinition):
        print('Make placeholder manifest')

        # Make the temp manifest and add it to the root of the local documents in the corpus.
        manifest_abstract = cdm_corpus.make_object(CdmObjectType.MANIFEST_DEF,
                                                   'temp_abstract')  # type: CdmManifestDefinition

        # Add each declaration, this example is about medical appointments and care plans
        manifest_abstract.entities.append('Account',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account')
        manifest_abstract.entities.append('Address',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Address.cdm.json/Address')
        manifest_abstract.entities.append('CarePlan',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CarePlan.cdm.json/CarePlan')
        manifest_abstract.entities.append('CodeableConcept',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CodeableConcept.cdm.json/CodeableConcept')
        manifest_abstract.entities.append('Contact',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Contact.cdm.json/Contact')
        manifest_abstract.entities.append('Device',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Device.cdm.json/Device')
        manifest_abstract.entities.append('EmrAppointment',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EmrAppointment.cdm.json/EmrAppointment')
        manifest_abstract.entities.append('Encounter',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Encounter.cdm.json/Encounter')
        manifest_abstract.entities.append('EpisodeOfCare',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EpisodeOfCare.cdm.json/EpisodeOfCare')
        manifest_abstract.entities.append('Location',
                                          'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Location.cdm.json/Location')

        # Add the temp manifest to the root of the local documents in the corpus.
        local_root = cdm_corpus.storage.fetch_root_folder('local')
        local_root.documents.append(manifest_abstract)

        # Create the resolved version of everything in the root folder too.
        print('Resolve the placeholder')
        manifest_resolved = await manifest_abstract.create_resolved_manifest_async('default', '')

        # Add an import to the foundations doc so the traits about partitons will resolve nicely.
        manifest_resolved.imports.append('cdm:/foundations.cdm.json', '')

        print('Save the documents')
        for e_def in manifest_resolved.entities:
            # Get the entity being pointed at.
            local_e_def = cast(CdmLocalEntityDeclarationDefinition, e_def)
            # Turns a relative path from manifest_resolved into an absolute path.
            ent_def = cast(CdmEntityDefinition,
                           await cdm_corpus.fetch_object_async(local_e_def.entity_path, manifest_resolved))
            # Make a fake partition, just to demo that.
            part = cdm_corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, '{}-data-description'.format(
                ent_def.entity_name))  # type: CdmDataPartitionDefinition
            local_e_def.data_partitions.append(part)
            part.explanation = 'not real data, just for demo'
            # Define the location of the partition, relative to the manifest
            local_location = 'local:/{}/partition-data.csv'.format(ent_def.entity_name)
            part.location = cdm_corpus.storage.create_relative_corpus_path(local_location, manifest_resolved)
            # Add trait to partition for csv params.
            csv_trait = part.exhibits_traits.append('is.partition.format.CSV', False)
            csv_trait.arguments.append('columnHeaders', 'true')
            csv_trait.arguments.append('delimiter', ',')

            # Get the actual location of the partition file from the corpus.
            part_path = cdm_corpus.storage.corpus_path_to_adapter_path(local_location)

            # Make a fake file with nothing but header for columns.
            header = ','.join([att.name for att in ent_def.attributes])

            os.makedirs(cdm_corpus.storage.corpus_path_to_adapter_path('local:/{}'.format(ent_def.entity_name)),
                        exist_ok=True)
            with open(part_path, 'w') as file:
                file.write(header)

        await manifest_resolved.save_as_async('{}.manifest.cdm.json'.format(manifest_resolved.manifest_name), True)
