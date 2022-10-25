# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional, TYPE_CHECKING
import dateutil.parser

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.objectmodel import CdmTraitCollection
from cdm.utilities import logger, TraitToPropertyMap

from . import utils, extension_helper
from .types import ReferenceEntity

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmReferencedEntityDeclarationDefinition, CdmTraitDefinition
    from cdm.utilities import CopyOptions, ResolveOptions

_TAG = 'ReferencedEntityDeclarationPersistence'


class ReferencedEntityDeclarationPersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', data_obj: 'ReferenceEntity', location: str) -> 'CdmReferencedEntityDeclarationDefinition':
        referenced_entity = ctx.corpus.make_object(
            CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF,
            data_obj.name)
        referenced_entity.entity_name = data_obj.name
        corpus_path = ctx.corpus.storage.adapter_path_to_corpus_path(location)

        if corpus_path is None:
            logger.error(ctx, _TAG, "from_data", None, CdmLogCode.ERR_PERSIST_MODEL_JSON_REF_ENTITY_INVALID_LOCATION, location, referenced_entity.entity_name)
            return None

        referenced_entity._virtual_location = corpus_path
        referenced_entity.entity_path = '{}/{}'.format(corpus_path, data_obj.source)
        referenced_entity.explanation = data_obj.get('description')

        if data_obj.get('lastFileStatusCheckTime'):
            referenced_entity.last_file_status_check_time = dateutil.parser.parse(data_obj.get('lastFileStatusCheckTime'))

        if data_obj.get('lastFileModifiedTime'):
            referenced_entity.last_file_modified_time = dateutil.parser.parse(data_obj.get('lastFileModifiedTime'))

        await utils.process_annotations_from_data(ctx, data_obj, referenced_entity.exhibits_traits)

        if data_obj.get('isHidden'):
            is_hidden_trait = ctx.corpus.make_ref(CdmObjectType.TRAIT_REF, 'is.hidden', True)
            is_hidden_trait.is_from_property = True
            referenced_entity.exhibits_traits.append(is_hidden_trait)

        properties_trait = ctx.corpus.make_ref(CdmObjectType.TRAIT_REF, 'is.propertyContent.multiTrait', False)
        properties_trait.is_from_property = True

        argument = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'modelId')
        argument.value = data_obj.modelId
        properties_trait.arguments.append(argument)
        referenced_entity.exhibits_traits.append(properties_trait)

        extension_trait_def_list = []  # type: List[CdmTraitDefinition]
        extension_traits = CdmTraitCollection(ctx, referenced_entity)

        extension_helper.process_extension_from_json(ctx, data_obj, extension_traits, extension_trait_def_list)

        if extension_trait_def_list:
            logger.warning(ctx, _TAG, ReferencedEntityDeclarationPersistence.from_data.__name__, None,
                           CdmLogCode.WARN_PERSIST_CUSTOM_EXT_NOT_SUPPORTED)

        return referenced_entity

    @staticmethod
    async def to_data(instance: 'CdmReferencedEntityDeclarationDefinition', res_opt: 'ResolveOptions',
                      options: 'CopyOptions') -> Optional['ReferenceEntity']:
        source_index = instance.entity_path.rfind('/')

        if source_index == -1:
            logger.error(instance.ctx, _TAG, 'to_data', instance.at_corpus_path,
                         CdmLogCode.ERR_PERSIST_MODELJSON_ENTITY_PARTITION_CONVERSION_ERROR, instance.at_corpus_path)
            return None

        reference_entity = ReferenceEntity()

        t2pm = TraitToPropertyMap(instance)

        reference_entity.type = 'ReferenceEntity'
        reference_entity.name = instance.entity_name
        reference_entity.source = instance.entity_path[source_index + 1:]
        reference_entity.description = instance.explanation
        reference_entity.lastFileStatusCheckTime = utils.get_formatted_date_string(instance.last_file_status_check_time)
        reference_entity.lastFileModifiedTime = utils.get_formatted_date_string(instance.last_file_modified_time)
        reference_entity.isHidden = bool(t2pm._fetch_trait_reference('is.hidden')) or None

        properties_trait = t2pm._fetch_trait_reference('is.propertyContent.multiTrait')
        if properties_trait:
            reference_entity.modelId = properties_trait.arguments[0].value

        await utils.process_traits_and_annotations_to_data(instance.ctx, reference_entity, instance.exhibits_traits)

        return reference_entity
