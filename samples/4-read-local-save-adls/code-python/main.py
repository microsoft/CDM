import asyncio
from typing import TYPE_CHECKING

from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition
from cdm.storage import AdlsAdapter, LocalAdapter, RemoteAdapter
from cdm.utilities import CopyOptions

if TYPE_CHECKING:
    from cdm.objectmodel import CdmDocumentDefinition, CdmDataPartitionDefinition, CdmEntityDefinition, CdmLocalEntityDeclarationDefinition, \
        CdmTypeAttributeDefinition

# ---------------------------------------------------------------------------------------------
# This sample demonstrates CDM Object Model use case in which a model.json file is loaded from
# a local file-system, its content explored and then changed, and finally saved to an
# ADLSg2 destination.
#
# IMPORTANT: Before running this sample, make sure following is satisfied:
#  1. The OM library is available in the execution scope of this sample
#  2. The model_json_root constant points to the location of the model.json file
#  3. ADLSg2 adapter configuration is updated according to your env setup
#  4. The partition location in model.json file is specifying the same ADLSg2 account and file-system settings
#  5. Ensure the Azure user object is assigned "Storage Blob Data Contributor" role in the ADLSg2 access management page
# ---------------------------------------------------------------------------------------------

model_json_root = '<<<INPUT_PATH>>>'

# ---------------------------------------------------------------------------------------------
# Instantiate corpus and set it to use default namespace 'adls'

corpus = CdmCorpusDefinition()
corpus.default_namespace = 'adls'

# The context is set up to log messages to console
corpus.ctx.update_logging_options(level='INFO')

# ---------------------------------------------------------------------------------------------
# Set up a local, remote and adls adapters

corpus.storage.mount('local', LocalAdapter(root=model_json_root))
corpus.storage.mount('remote', RemoteAdapter(hosts={'contoso': 'http://contoso.com'}))
corpus.storage.mount('adls', AdlsAdapter(
    root='/<FILESYSTEM_NAME>',                        # Container name
    hostname='<ACCOUNT_NAME>.dfs.core.windows.net',   # Blob endpoint
    tenant='72f988bf-86f1-41af-91ab-2d7cd011db47',    # Tenant ID (Microsoft)
    resource='https://storage.azure.com',             # Resource type
    client_id='<CLIENT_ID>',                          # Test account client ID
    secret='<CLIENT_SECRET>'                          # Test account secret
))

# ---------------------------------------------------------------------------------------------
# Create manifest from a local model.json file

loop = asyncio.get_event_loop()
task = loop.create_task(corpus.fetch_object_async('local:/model.json'))
manifest = loop.run_until_complete(task)

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
corpus.storage.fetch_root_folder('local').documents.append(new_entity_doc.name, new_entity_doc)

new_entity = new_entity_doc.definitions.append(CdmObjectType.ENTITY_DEF, 'NewEntity')  # type: CdmEntityDefinition

# Define new string attribute and add it to the entity definition
new_attribute = corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'NewAttribute')  # type: CdmTypeAttributeDefinition
new_attribute.data_format = CdmDataFormat.STRING
new_entity.attributes.append(new_attribute)

# Create a local declaration of the entity and point it to the new entity document
new_entity_decl = corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF)  # type: CdmLocalEntityDeclarationDefinition
new_entity_decl.entity_path = new_entity_doc.at_corpus_path + '/' + new_entity.entity_name

# Define a partition and add it to the local declaration
new_partition = corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, 'NewPartition')  # type: CdmDataPartitionDefinition
new_partition.location = 'adls:/new-partition.csv'
new_entity_decl.data_partitions.append(new_partition)

# Add the local declaration to the manifest
manifest.entities.append(new_entity_decl)

# ---------------------------------------------------------------------------------------------
# Save the updated model to adls

manifest.namespace = 'adls'
task = loop.create_task(manifest.save_as_async('model.json', True))
loop.run_until_complete(task)
