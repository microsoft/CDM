# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmManifestDefinition
from cdm.persistence.modeljson.types import Attribute, LocalEntity, Model
from cdm.persistence.persistence_layer import from_data
from cdm.utilities.string_utils import kvprint


attrib = Attribute()
attrib.dataType = 'Attribute'
attrib.name = 'accountId'
attrib.traits = [{'is.primaryId': 'true'}]
attrib.extension_fields = 'extfieldsvalue'

entity = LocalEntity()
entity.type = 'LocalEntity'
entity.name = 'Account'
entity.traits = [{'is.some.trait': 'foo'}]
entity.annotations = [{'some:annotation': 'bar'}]
entity.attributes = [attrib]
entity.extension_fields = 'extfieldsvalue'

model = Model()
model.name = 'SomeModel'
model.description = 'SomeDescription'
model.version = '1.0'
model.entities = [entity]

modelJson = model.encode()

modelCheck = Model()
modelCheck.decode(modelJson)
modelCheckJson = modelCheck.encode()

assert modelJson == modelCheckJson
assert not modelCheck.entities[0].get('extension_fields')  # there should be no extension_fields in deserialized object
assert not modelCheck.entities[0].attributes[0].get('extension_fields')  # there should be no extension_fields in deserialized object

with open('tests/testdata/persistence/modeljson/test_from_and_to_data/test_input/model.json') as modelJsonFile:
    model = Model()
    model.decode(modelJsonFile.read())

    kvprint('name', model.name, 3, 0)
    kvprint('description', model.description, 3, 0)
    kvprint('version', model.version, 3, 0)
    kvprint('pbi:mashup', str(model.get('pbi:mashup')), 3, 0)

    if model.get('entities'):
        kvprint('entities', '', 6, 0)
        for cur_entity in model.entities:
            kvprint('name', cur_entity.name, 3, 4)
            kvprint('type', cur_entity.type, 3, 4)
            kvprint('desc', cur_entity.description, 3, 4)
            kvprint('schemas', str(cur_entity.get('schemas')), 3, 4)

            if cur_entity.get('annotations'):
                kvprint('annotations', '', 6, 4)
                for annotation in cur_entity.get('annotations'):
                    kvprint(annotation.name, annotation.value, 3, 8)

            if cur_entity.get('attributes'):
                kvprint('attributes', '', 6, 4)
                for attribute in cur_entity.get('attributes'):
                    kvprint(attribute.name, attribute.dataType, 3, 8)

            if cur_entity.get('partitions'):
                kvprint('partitions', '', 6, 4)
                for partition in cur_entity.get('partitions'):
                    kvprint('name', partition.name, 3, 8)
                    kvprint('refreshTime', partition.refreshTime, 3, 8)
                    kvprint('location', partition.location, 3, 8)
                    kvprint('isHidden', str(partition.isHidden), 3, 8)
                    kvprint('file format', '', 6, 8)
                    kvprint('type', partition.fileFormatSettings.type, 3, 12)
                    kvprint('columnHeaders', str(partition.fileFormatSettings.columnHeaders), 3, 12)
                    kvprint('delimiter', partition.fileFormatSettings.delimiter, 3, 12)

                    if partition.get('annotations'):
                        kvprint('annotations', '', 6, 8)
                        for annotation in partition.get('annotations'):
                            kvprint(annotation.name, annotation.value, 3, 12)

            kvprint('---', '', 0, 4)

    if model.get('relationships'):
        kvprint('relationships', '', 6, 0)
        for relationship in model.get('relationships'):
            kvprint('type', relationship.type, 3, 4)
            kvprint('fromAttribute', relationship.fromAttribute, 3, 4)
            kvprint('toAttribute', relationship.toAttribute, 3, 4)

    if model.get('referenceModels'):
        kvprint('reference models', '', 6, 0)
        for refModel in model.get('referenceModels'):
            kvprint('id', refModel.id, 3, 4)
            kvprint('location', refModel.location, 3, 4)

# Now run the loaded model through PersistenceLayer

# TODO: Fails because CdmCorpusContext is abstract
# TODO: Fails because CdmObjectType is all capital SNAKE_CASE, but before it used to follow camelCase
manifest_def = from_data(CdmCorpusContext(), model, CdmObjectType.MANIFEST_DEF, 'CdmFolder')  # type: CdmManifestDefinition

assert manifest_def
assert manifest_def.name == 'OrdersProductsCustomersLinked'
assert manifest_def.version == '1.0'
assert manifest_def.description == 'Description of the model OrdersProductsCustomersLinked'
assert len(manifest_def.entities) == 2
# assert manifest_def.entities[1].entityName
