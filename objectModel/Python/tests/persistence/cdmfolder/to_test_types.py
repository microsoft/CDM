# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from cdm.utilities import JObject
from cdm.utilities.string_utils import kvprint
from cdm.persistence.cdmfolder.types import Entity, EntityAttribute, EntityReference, ManifestContent


# Test creating an entity instance from scratch and serializing it

entityRef = EntityReference()
entityRef.entityReference = 'AReferencedEntity'

attrib = EntityAttribute()
attrib.name = 'accountId'
attrib.explanation = 'Some attribute'
attrib.appliedTraits = ['is.primaryId']
attrib.entity = entityRef

entity = Entity()
entity.entityName = 'Account'
entity.description = 'Some entity'
entity.exhibitsTraits = ['is.some.trait']
entity.hasAttributes = [attrib]

# Try first plain de/ser (no PersistenceLayer's involvement)

entityJson = entity.encode()
entityCheck = JObject(entityJson)
entityCheckJson = entityCheck.encode()

assert entityJson == entityCheckJson

# Test loading a manifest from a file, and printing it out

manifestJson = ''

with open('tests/cdmfolder/default.manifest.cdm.json') as manifestJsonFile:
    manifestJson = manifestJsonFile.read()

manifestContent = ManifestContent()
manifestContent.decode(manifestJson)

kvprint('name', manifestContent.manifestName, 3, 0)
kvprint('explanation', str(manifestContent.get('explanation')), 3, 0)
kvprint('jsonSchemaSemanticVersion', manifestContent.jsonSchemaSemanticVersion, 3, 0)

if manifestContent.get('imports'):
    kvprint('imports', '', 6, 0)
    for the_import in manifestContent.get('imports'):
        kvprint('corpusPath', the_import.corpusPath, 3, 4)
        kvprint('moniker', the_import.moniker, 3, 4)

if manifestContent.get('entities'):
    kvprint('entities', '', 6, 0)
    for entity in manifestContent.get('entities'):
        kvprint('entityName', entity.entityName, 3, 4)
        kvprint('entitySchema', entity.entitySchema, 3, 4)

        if entity.get('dataPartitions'):
            kvprint('partitions', '', 6, 4)
            for partition in entity.get('dataPartitions'):
                kvprint('location', partition.location, 3, 8)
                kvprint('lastFileStatusCheckTime', partition.lastFileStatusCheckTime, 3, 8)
                kvprint('lastFileModifiedTime', partition.lastFileModifiedTime, 3, 8)

                if partition.get('exhibitsTraits'):
                    kvprint('traits', '', 6, 8)
                    for trait in partition.get('exhibitsTraits'):
                        kvprint('traitReference', trait.traitReference, 3, 12)

                        for argument in (trait.arguments or []):
                            kvprint(argument.name, argument.value, 3, 16)

        kvprint('---', '', 0, 4)
