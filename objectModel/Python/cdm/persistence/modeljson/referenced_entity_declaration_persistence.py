from typing import List, Optional, TYPE_CHECKING
import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.utilities import TraitToPropertyMap

from . import utils, extension_helper
from .types import ReferenceEntity

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmReferencedEntityDeclarationDefinition, CdmTraitDefinition
    from cdm.utilities import CopyOptions, ResolveOptions


class ReferencedEntityDeclarationPersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', data_obj: 'ReferenceEntity', location: str,
                        extension_trait_def_list: List['CdmTraitDefinition']) -> 'CdmReferencedEntityDeclarationDefinition':
        referenced_entity = ctx.corpus.make_object(
            CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF,
            data_obj.name)
        corpus_path = ctx.corpus.storage.adapter_path_to_corpus_path(location)

        referenced_entity.entity_name = data_obj.name
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

        await extension_helper.process_extension_from_json(ctx, data_obj, referenced_entity.exhibits_traits,
                                                           extension_trait_def_list)

        return referenced_entity

    @staticmethod
    async def to_data(instance: 'CdmReferencedEntityDeclarationDefinition', res_opt: 'ResolveOptions',
                      options: 'CopyOptions') -> Optional['ReferenceEntity']:
        source_index = instance.entity_path.rfind('/')

        if source_index == -1:
            instance.ctx.logger.error('Source name is not present in entityDeclaration path. | %s', instance.at_corpus_path)
            return

        reference_entity = ReferenceEntity()

        t2pm = TraitToPropertyMap(instance)

        reference_entity.type = 'ReferenceEntity'
        reference_entity.name = instance.entity_name
        reference_entity.source = instance.entity_path[source_index + 1:]
        reference_entity.description = instance.explanation
        reference_entity.lastFileStatusCheckTime = utils.get_formatted_date_string(instance.last_file_status_check_time)
        reference_entity.lastFileModifiedTime = utils.get_formatted_date_string(instance.last_file_modified_time)
        reference_entity.isHidden = bool(t2pm.fetch_trait_reference('is.hidden')) or None

        properties_trait = t2pm.fetch_trait_reference('is.propertyContent.multiTrait')
        if properties_trait:
            reference_entity.modelId = properties_trait.arguments[0].value

        await utils.process_annotations_to_data(instance.ctx, reference_entity, instance.exhibits_traits)

        return reference_entity
