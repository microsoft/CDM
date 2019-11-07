import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmReferencedEntityDeclarationDefinition
from cdm.utilities import CopyOptions, ResolveOptions, time_utils

from . import utils
from .types import ReferencedEntityDeclaration


class ReferencedEntityDeclarationPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, prefix_path: str, data: ReferencedEntityDeclaration) -> CdmReferencedEntityDeclarationDefinition:
        referenced_entity = ctx.corpus.make_object(CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF, data.entityName)

        entity_path = data.get('entityDeclaration') or data.get('entityPath')

        if entity_path.find(':/') == -1:
            referenced_entity.entity_path = '{}{}'.format(prefix_path, entity_path)
        else:
            referenced_entity.entity_path = entity_path

        referenced_entity.explanation = data.get('explanation')

        if data.get('lastFileStatusCheckTime'):
            referenced_entity.last_file_status_check_time = dateutil.parser.parse(data.lastFileStatusCheckTime)

        if data.get('lastFileModifiedTime'):
            referenced_entity.last_file_modified_time = dateutil.parser.parse(data.lastFileModifiedTime)

        if data.get('exhibitsTraits'):
            exhibits_traits = utils.create_trait_reference_array(ctx, data.exhibitsTraits)
            referenced_entity.exhibits_traits.extend(exhibits_traits)

        return referenced_entity

    @staticmethod
    def to_data(instance: CdmReferencedEntityDeclarationDefinition, res_opt: ResolveOptions, options: CopyOptions) -> ReferencedEntityDeclaration:
        data = ReferencedEntityDeclaration()

        data.entityName = instance.entity_name
        data.explanation = instance.explanation
        data.lastFileStatusCheckTime = time_utils.get_formatted_date_string(instance.last_file_status_check_time)
        data.lastFileModifiedTime = time_utils.get_formatted_date_string(instance.last_file_modified_time)
        data.entityPath = instance.entity_path
        data.exhibitsTraits = utils.array_copy_data(res_opt, instance.exhibits_traits, options)

        return data
