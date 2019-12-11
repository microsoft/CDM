import { AttributeContextReferencePersistence } from '.';
import {
    CdmCorpusContext,
    cdmObjectType,
    copyOptions,
    CdmAttributeGroupDefinition,
    CdmTraitReference,
    resolveOptions
} from '../../internal';
import {
    AttributeGroup,
    AttributeGroupReference,
    EntityAttribute,
    TraitReference,
    TypeAttribute
} from './types';
import * as utils from './utils';

export class AttributeGroupPersistence {
    public static fromData(ctx: CdmCorpusContext, object: AttributeGroup): CdmAttributeGroupDefinition {
        const attributeGroup: CdmAttributeGroupDefinition =
            ctx.corpus.MakeObject(cdmObjectType.attributeGroupDef, object.attributeGroupName);

        if (object.explanation) {
            attributeGroup.explanation = object.explanation;
        }
        attributeGroup.attributeContext = AttributeContextReferencePersistence.fromData(ctx, object.attributeContext);
        utils.addArrayToCdmCollection<CdmTraitReference>(attributeGroup.exhibitsTraits, utils.createTraitReferenceArray(ctx, object.exhibitsTraits));
        for (const att of object.members) {
            attributeGroup.members.push(utils.createAttribute(ctx, att));
        }

        return attributeGroup;
    }
    public static toData(instance: CdmAttributeGroupDefinition, resOpt: resolveOptions, options: copyOptions): AttributeGroup {
        return {
            explanation: instance.explanation,
            attributeGroupName: instance.attributeGroupName,
            exhibitsTraits: utils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits.allItems, options),
            attributeContext: instance.attributeContext ? instance.attributeContext.copyData(resOpt, options) as string : undefined,
            members: utils.
                arrayCopyData<string | AttributeGroupReference | TypeAttribute | EntityAttribute>(resOpt, instance.members, options)
        };
    }
}
