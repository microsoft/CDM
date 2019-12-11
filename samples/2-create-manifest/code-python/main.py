# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import asyncio
import os
import sys
from typing import cast

sys.path.append('../CDM.ObjectModel.Python')

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition, CdmLocalEntityDeclarationDefinition, CdmEntityDefinition, CdmManifestDefinition
from cdm.storage import LocalAdapter
from cdm.utilities import CopyOptions


async def main():
    # Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating
    # objects and paths.
    cdm_corpus = CdmCorpusDefinition()
    cdm_corpus.ctx.update_logging_options(level='ERROR')

    print('configure storage adapters')
    cdm_corpus.storage.mount('local', LocalAdapter(root='..'))

    # Local is our default. So any paths that start out navigating without a device tag will assume local.
    cdm_corpus.default_namespace = 'local'

    # Fake cdm, normally use the github adapter.
    cdm_corpus.storage.mount('cdm', LocalAdapter(root='../../example-public-standards'))

    # This sample is going to simulate the steps a tool would follow in order to create a new manifest document in some user
    # Storage folder when the shapes of the entities in that folder are all taken from some public standards with no
    # extensions or additions 
	# The steps are:
    # 1. Create a temporary 'manifest' object at the root of the corpus that contains a list of the selected entities.
    # 2. Each selected entity points at an 'abstract' schema defintion in the public standards. These entity docs are too
    #    hard to deal with because of abstractions and inheritence, etc. So to make things concrete, we want to make a
    #    'resolved' version of each entity doc in our local folder. To do this, we call create_resolved_manifest on our
    #    starting manifest. this will resolve everything and find all of the relationships between entities for us.
    # 3. Save the new documents.

    print('make placeholder manifest')

    # Make the temp manifest and add it to the root of the local documents in the corpus.
    manifest_abstract = cdm_corpus.make_object(CdmObjectType.MANIFEST_DEF, 'temp_abstract')  # type: CdmManifestDefinition

    # Add each declaration, this example is about medical appointments and care plans.
    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'Account')  # type: CdmLocalEntityDeclarationDefinition
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account'
    manifest_abstract.entities.add(ent_dec)

    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'Address')
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Address.cdm.json/Address'
    manifest_abstract.entities.add(ent_dec)

    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'CarePlan')
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CarePlan.cdm.json/CarePlan'
    manifest_abstract.entities.add(ent_dec)

    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'CodeableConcept')
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CodeableConcept.cdm.json/CodeableConcept'
    manifest_abstract.entities.add(ent_dec)

    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'Contact')
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Contact.cdm.json/Contact'
    manifest_abstract.entities.add(ent_dec)

    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'Device')
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Device.cdm.json/Device'
    manifest_abstract.entities.add(ent_dec)

    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'EmrAppointment')
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EmrAppointment.cdm.json/EmrAppointment'
    manifest_abstract.entities.add(ent_dec)

    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'Encounter')
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Encounter.cdm.json/Encounter'
    manifest_abstract.entities.add(ent_dec)

    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'EpisodeOfCare')
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EpisodeOfCare.cdm.json/EpisodeOfCare'
    manifest_abstract.entities.add(ent_dec)

    ent_dec = cdm_corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, 'Location')
    ent_dec.entity_path = 'cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Location.cdm.json/Location'
    manifest_abstract.entities.add(ent_dec)

    # Add the temp manifest to the root of the local documents in the corpus.
    local_root = cdm_corpus.storage.fetch_root_folder('local')
    local_root.add_document('temp_abstract.manifest.cdm.json', manifest_abstract)

    # Create the resolved version of everything in the root folder too.
    print('resolve the placeholder')
    manifest_resolved = await manifest_abstract.create_resolved_manifest_async('default', '')

    # Add an import to the foundations doc so the traits about partitons will resolve nicely.
    manifest_resolved.add_import('cdm:/foundations.cdm.json', '')

    print('save the docs')
    for e_def in manifest_resolved.entities:
        # Get the entity being pointed at.
        local_e_def = cast(CdmLocalEntityDeclarationDefinition, e_def)
        # Turns a relative path from manifest_resolved into an absolute path.
        ent_def = cast(CdmEntityDefinition, await cdm_corpus.fetch_object_async(local_e_def.entity_path, manifest_resolved))
        # Make a fake partition, just to demo that.
        part = cdm_corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, '{}-data-description'.format(ent_def.entity_name))  # type: CdmDataPartitionDefinition
        local_e_def.data_partitions.add(part)
        part.explanation = 'not real data, just for demo'
        # Define the location of the partition, relative to the manifest
        local_location = 'local:/{}/partition-data.csv'.format(ent_def.entity_name)
        part.location = cdm_corpus.storage.create_relative_corpus_path(local_location, manifest_resolved)
        # Add trait to partition for csv params.
        csv_trait = part.add_exhibited_trait('is.partition.format.CSV', False)
        csv_trait.add_argument('columnHeaders', 'true')
        csv_trait.add_argument('delimiter', ',')

        # Get the actual location of the partition file from the corpus.
        part_path = cdm_corpus.storage.corpus_path_to_adapter_path(location)

        # Make a fake file with nothing but header for columns.
        header = ','.join([att.name for att in ent_def.has_attributes])

        os.makedirs(cdm_corpus.storage.corpus_path_to_adapter_path('local:/{}'.format(ent_def.entity_name)), exist_ok=True)
        with open(part_path, 'w') as file:
            file.write(header)

    await manifest_resolved.save_as_async('{}.manifest.cdm.json'.format(manifest_resolved.manifest_name), True)


loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
