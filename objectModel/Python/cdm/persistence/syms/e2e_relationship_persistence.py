# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List

from cdm.enums import CdmLogCode, CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmE2ERelationship
from cdm.utilities import copy_data_utils, CopyOptions, logger, ResolveOptions
from cdm.utilities.string_utils import StringUtils
from cdm.persistence.syms.models import ColumnRelationshipInformation, Namespace, PublishStatus, RelationshipEntity, RelationshipProperties, RelationshipType, SASEntityType

from . import utils

_TAG = 'E2ERelationshipPersistence'


class E2ERelationshipPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, relationship_entity: RelationshipEntity) -> List[CdmE2ERelationship]:
        relationships = []
        relationship_properties = RelationshipProperties(None, None, None, None).deserialize(relationship_entity.properties)
        for columnRelationshipInformation in relationship_properties.column_relationship_informations :
            relationship = ctx.corpus.make_object(CdmObjectType.E2E_RELATIONSHIP_DEF)
            if not (relationship_entity.name == None or relationship_entity.name == ''):
                relationship.name = relationship_entity.name

            if relationship_properties.relationship_type == RelationshipType.manytoone or relationship_properties.relationship_type == RelationshipType.onetoone:
                relationship.from_entity =  "{}.cdm.json/{}".format(relationship_properties.from_table_name, relationship_properties.from_table_name)
                relationship.to_entity = "{}.cdm.json/{}".format(relationship_properties.to_table_name, relationship_properties.to_table_name)
                relationship.from_entity_attribute = columnRelationshipInformation.from_column_name
                relationship.to_entity_attribute = columnRelationshipInformation.to_column_name
            elif relationship_properties.relationship_type == RelationshipType.onetomany:
                relationship.from_entity = "{}.cdm.json/{}".format(relationship_properties.from_table_name, relationship_properties.from_table_name)
                relationship.to_entity = "{}.cdm.json/{}".format(relationship_properties.to_table_name, relationship_properties.to_table_name)
                relationship.from_entity_attribute = columnRelationshipInformation.to_column_name
                relationship.to_entity_attribute = columnRelationshipInformation.from_column_name
            elif relationship_properties.relationship_type == RelationshipType.manytomany or relationship_properties.relationship_type is None:
                logger.error(ctx, _TAG, 'from_data', None, CdmLogCode.ERR_PERSIST_SYMS_RELATIONSHIP_TYPE_NOT_SUPPORTED, relationship_properties.relationship_type)
                return None

            if relationship_properties.properties is not None:
                if "cdm:exhibitsTraits" in relationship_properties.properties:
                    utils.add_list_to_cdm_collection(relationship.exhibits_traits,
                                                     utils.create_trait_reference_array(ctx, relationship_properties.properties[
                                                                                                         "cdm:exhibitsTraits"]))
            relationships.append(relationship)

        return relationships

    @staticmethod
    def to_data(instance: 'CdmE2ERelationship', dbname:str, res_opt: ResolveOptions, options: CopyOptions, relationship = None)-> RelationshipEntity:
        properties = {}
        if instance.exhibits_traits is not None and len(instance.exhibits_traits) > 0:
            properties["cdm:exhibitsTraits"] = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)

        ns = Namespace(dbname)
        column_relationship_informations = []
        col_info = ColumnRelationshipInformation(from_column_name=instance.from_entity_attribute, to_column_name = instance.to_entity_attribute)
        column_relationship_informations.append(col_info)

        relationship_properties = RelationshipProperties(namespace = ns,
        from_table_name = utils.extract_table_name_from_entity_path(instance.from_entity),
        to_table_name = utils.extract_table_name_from_entity_path(instance.to_entity),
        properties = properties,
        publish_status = PublishStatus.published,
        relationship_type = RelationshipType.manytoone,
        column_relationship_informations = column_relationship_informations)

        relationship_name = instance.name
        if StringUtils.is_blank_by_cdm_standard(instance.name):
            relationship_name = "{}_{}_relationship".format(relationship_properties.from_table_name, relationship_properties.to_table_name)
        
        rel = RelationshipEntity(name=relationship_name, properties=relationship_properties, type=SASEntityType.relationship)
        return rel
