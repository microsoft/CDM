# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Dict, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import logger

from . import utils
from .types import SingleKeyRelationship, AttributeReference

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmE2ERelationship
    from cdm.utilities import CopyOptions, ResolveOptions

_TAG = 'RelationshipPersistence'


class RelationshipPersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', obj: 'SingleKeyRelationship', entity_schema_by_name: Dict[str, str]) -> Optional['CdmE2ERelationship']:
        if obj.type != 'SingleKeyRelationship':
            # We don't have any other type of a relationship yet!
            return None

        if obj.fromAttribute.entityName not in entity_schema_by_name or obj.toAttribute.entityName not in entity_schema_by_name:
            logger.error(_TAG, ctx, 'Trying to create relationship to an entity not defined.')
            return None

        relationship = ctx.corpus.make_object(CdmObjectType.E2E_RELATIONSHIP_DEF, obj.get('name'))

        await utils.process_annotations_from_data(ctx, obj, relationship.exhibits_traits)

        relationship.explanation = obj.get('description')

        relationship.from_entity = entity_schema_by_name[obj.fromAttribute.entityName]
        relationship.from_entity_attribute = obj.fromAttribute.attributeName
        relationship.to_entity = entity_schema_by_name[obj.toAttribute.entityName]
        relationship.to_entity_attribute = obj.toAttribute.attributeName

        return relationship

    @staticmethod
    async def to_data(instance: 'CdmE2ERelationship', res_opt: 'ResolveOptions', options: 'CopyOptions', ctx: 'CdmCorpusContext') -> 'SingleKeyRelationship':
        result = SingleKeyRelationship()

        result.type = 'SingleKeyRelationship'

        from_attrib = AttributeReference()
        from_attrib.entityName = RelationshipPersistence.get_entity_name(instance.from_entity)
        from_attrib.attributeName = instance.from_entity_attribute
        result.fromAttribute = from_attrib

        to_attrib = AttributeReference()
        to_attrib.entityName = RelationshipPersistence.get_entity_name(instance.to_entity)
        to_attrib.attributeName = instance.to_entity_attribute
        result.toAttribute = to_attrib

        result.description = instance.explanation
        result.name = instance.relationship_name
        await utils.process_annotations_to_data(instance.ctx, result, instance.exhibits_traits)

        return result

    @staticmethod
    def get_entity_name(corpus_path: str) -> str:
        last_slash_index = corpus_path.rfind('/')

        if last_slash_index != -1:
            return corpus_path[last_slash_index + 1:]

        return corpus_path
