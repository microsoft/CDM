import {
    CdmCorpusContext,
    CdmEntityAttributeDefinition,
    cdmObjectType,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../internal';
import { CdmFolder } from '..';
import {
    AttributeResolutionGuidance,
    EntityAttribute,
    EntityReference,
    PurposeReference,
    TraitReference
} from './types';
import * as utils from './utils';

export class EntityAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: EntityAttribute): CdmEntityAttributeDefinition {
        const entityAttribute: CdmEntityAttributeDefinition = ctx.corpus.MakeObject(cdmObjectType.entityAttributeDef, object.name);

        if (object.explanation) {
            entityAttribute.explanation = object.explanation;
        }
        entityAttribute.entity = CdmFolder.EntityReferencePersistence.fromData(ctx, object.entity);
        entityAttribute.purpose = CdmFolder.PurposeReferencePersistence.fromData(ctx, object.purpose);
        utils.addArrayToCdmCollection<CdmTraitReference>(
            entityAttribute.appliedTraits,
            utils.createTraitReferenceArray(ctx, object.appliedTraits)
        );
        entityAttribute.resolutionGuidance =
            CdmFolder.AttributeResolutionGuidancePersistence.fromData(ctx, object.resolutionGuidance);

        return entityAttribute;
    }
    public static toData(instance: CdmEntityAttributeDefinition, resOpt: resolveOptions, options: copyOptions): EntityAttribute {
        let entity: (string | EntityReference);
        entity = instance.entity ? instance.entity.copyData(resOpt, options) as (string | EntityReference) : undefined;

        return {
            explanation: instance.explanation,
            name: instance.name,
            purpose: instance.purpose
                ? instance.purpose.copyData(resOpt, options) as (string | PurposeReference)
                : undefined,
            entity: entity,
            appliedTraits: utils.arrayCopyData<string | TraitReference>(resOpt, instance.appliedTraits, options),
            resolutionGuidance: instance.resolutionGuidance
                ? instance.resolutionGuidance.copyData(resOpt, options) as AttributeResolutionGuidance : undefined
        };
    }
}
