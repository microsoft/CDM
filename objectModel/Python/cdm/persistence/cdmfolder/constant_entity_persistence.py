from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmConstantEntityDefinition, CdmCorpusContext
from cdm.utilities import CopyOptions, ResolveOptions

from .types import ConstantEntity


class ConstantEntityPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: ConstantEntity) -> CdmConstantEntityDefinition:
        from .entity_reference_persistence import EntityReferencePersistence

        constant_entity = ctx.corpus.make_object(CdmObjectType.CONSTANT_ENTITY_DEF, data.get('constantEntityName'))
        constant_entity.explanation = data.get('explanation')
        constant_entity.constant_values = data.get('constantValues')
        constant_entity.entity_shape = EntityReferencePersistence.from_data(ctx, data.entityShape)

        return constant_entity

    @staticmethod
    def to_data(instance: CdmConstantEntityDefinition, res_opt: ResolveOptions, options: CopyOptions) -> ConstantEntity:
        from .entity_reference_persistence import EntityReferencePersistence

        result = ConstantEntity()
        result.explanation = instance.explanation
        result.constantEntityName = instance.constant_entity_name
        result.entityShape = EntityReferencePersistence.to_data(instance.entity_shape, res_opt, options) if instance.entity_shape else None
        result.constantValues = instance.constant_values

        return result
