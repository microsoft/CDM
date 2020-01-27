from typing import Optional

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmAttributeGroupDefinition
from cdm.utilities import ResolveOptions, CopyOptions

from . import utils
from .attribute_context_reference_persistence import AttributeContextReferencePersistence
from .types import AttributeGroup


class AttributeGroupPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, obj: AttributeGroup) -> CdmAttributeGroupDefinition:
        attribute_group = ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_GROUP_DEF, obj.attributeGroupName)
        attribute_group.explanation = obj.get('explanation')
        attribute_group.attribute_context = AttributeContextReferencePersistence.from_data(ctx, obj.get('attributeContext'))
        exhibits_traits = utils.create_trait_reference_array(ctx, obj.get('exhibitsTraits'))
        attribute_group.exhibits_traits.extend(exhibits_traits)

        for att in obj.members:
            attribute_group.members.append(utils.create_attribute(ctx, att))

        return attribute_group

    @staticmethod
    def to_data(instance: CdmAttributeGroupDefinition, res_opt: ResolveOptions, options: CopyOptions) -> Optional[AttributeGroup]:
        result = AttributeGroup()
        result.explanation = instance.explanation
        result.attributeGroupName = instance.attribute_group_name
        result.exhibitsTraits = utils.array_copy_data(res_opt, instance.exhibits_traits, options)
        result.attributeContext = AttributeContextReferencePersistence.to_data(
            instance.attribute_context, res_opt, options) if instance.attribute_context else None
        result.members = utils.array_copy_data(res_opt, instance.members, options)
        return result
