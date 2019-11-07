from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmTraitDefinition
from cdm.utilities import ResolveOptions, CopyOptions

from . import utils
from .types import Trait
from .parameter_persistence import ParameterPersistence


class TraitPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: Trait) -> CdmTraitDefinition:
        from .trait_reference_persistence import TraitReferencePersistence
        trait = ctx.corpus.make_object(CdmObjectType.TRAIT_DEF, data.traitName)

        if data.get('extendsTrait'):
            trait.extends_trait = TraitReferencePersistence.from_data(ctx, data.extendsTrait)

        if data.get('explanation'):
            trait.explanation = data.explanation

        if data.get('hasParameters'):
            parameters = [ParameterPersistence.from_data(ctx, ap) for ap in data.hasParameters]
            trait.parameters.extend(parameters)

        if data.get('elevated'):
            trait.elevated = data.elevated

        if data.get('ugly'):
            trait.ugly = data.ugly

        if data.get('associatedProperties'):
            trait.associated_properties = data.associatedProperties

        return trait

    @staticmethod
    def to_data(instance: CdmTraitDefinition, res_opt: ResolveOptions, options: CopyOptions) -> Trait:
        from .trait_reference_persistence import TraitReferencePersistence

        result = Trait()
        result.traitName = instance.trait_name
        result.extendsTrait = TraitReferencePersistence.to_data(instance.extends_trait, res_opt, options) if instance.extends_trait else None
        result.hasParameters = utils.array_copy_data(res_opt, instance.parameters, options)

        if instance.associated_properties:
            result.associatedProperties = instance.associated_properties

        if instance.elevated:
            result.elevated = instance.elevated

        if instance.explanation:
            result.explanation = instance.explanation

        if instance.ugly:
            result.ugly = instance.ugly

        return result
