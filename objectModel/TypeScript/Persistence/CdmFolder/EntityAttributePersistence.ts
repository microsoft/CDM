// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CardinalitySettings,
    CdmCorpusContext,
    CdmEntityAttributeDefinition,
    CdmEntityReference,
    cdmObjectType,
    CdmProjection,
    CdmTraitReference,
    copyOptions,
    Logger,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import { ProjectionPersistence } from './Projections/ProjectionPersistence';
import { AttributeResolutionGuidance, EntityAttribute, EntityReferenceDefinition, PurposeReference, TraitReference } from './types';
import * as utils from './utils';

export class EntityAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: EntityAttribute): CdmEntityAttributeDefinition {
        const entityAttribute: CdmEntityAttributeDefinition = ctx.corpus.MakeObject(cdmObjectType.entityAttributeDef, object.name);

        entityAttribute.description = utils.propertyFromDataToString(object.description);
        entityAttribute.displayName = utils.propertyFromDataToString(object.displayName);
        entityAttribute.explanation = utils.propertyFromDataToString(object.explanation);

        if (object.cardinality) {
            let minCardinality: string;
            if (object.cardinality.minimum) {
                minCardinality = object.cardinality.minimum;
            }

            let maxCardinality: string;
            if (object.cardinality.maximum) {
                maxCardinality = object.cardinality.maximum;
            }

            if (!minCardinality || !maxCardinality) {
                Logger.error(EntityAttributePersistence.name, ctx, 'Both minimum and maximum are required for the Cardinality property.', this.fromData.name);
            }

            if (!CardinalitySettings.isMinimumValid(minCardinality)) {
                Logger.error(EntityAttributePersistence.name, ctx, `Invalid minimum cardinality ${minCardinality}.`, this.fromData.name);
            }

            if (!CardinalitySettings.isMaximumValid(maxCardinality)) {
                Logger.error(EntityAttributePersistence.name, ctx, `Invalid maximum cardinality ${maxCardinality}.`, this.fromData.name);
            }

            if (minCardinality && maxCardinality && CardinalitySettings.isMinimumValid(minCardinality) && CardinalitySettings.isMaximumValid(maxCardinality)) {
                entityAttribute.cardinality = new CardinalitySettings(entityAttribute);
                entityAttribute.cardinality.minimum = minCardinality;
                entityAttribute.cardinality.maximum = maxCardinality;
            }
        }

        entityAttribute.isPolymorphicSource = object.isPolymorphicSource;

        if (object.entity && typeof(object.entity) !== 'string' && 'source' in object.entity) {
            const inlineEntityRef: CdmEntityReference = ctx.corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
            inlineEntityRef.explicitReference = ProjectionPersistence.fromData(ctx, object.entity);
            entityAttribute.entity = inlineEntityRef;
        } else {
            entityAttribute.entity = CdmFolder.EntityReferencePersistence.fromData(ctx, object.entity);
        }

        entityAttribute.purpose = CdmFolder.PurposeReferencePersistence.fromData(ctx, object.purpose);
        utils.addArrayToCdmCollection<CdmTraitReference>(
            entityAttribute.appliedTraits,
            utils.createTraitReferenceArray(ctx, object.appliedTraits)
        );

        // Ignore resolution guidance if the entity is a projection
        if (object.resolutionGuidance && object.entity && typeof(object.entity) !== 'string' && 'source' in object.entity) {
            Logger.error(
                EntityAttributePersistence.name,
                ctx,
                `The EntityAttribute ${entityAttribute.name} is projection based. Resolution guidance is not supported with a projection.`
            );
        } else {
            entityAttribute.resolutionGuidance =
                CdmFolder.AttributeResolutionGuidancePersistence.fromData(ctx, object.resolutionGuidance);
        }

        return entityAttribute;
    }
    public static toData(instance: CdmEntityAttributeDefinition, resOpt: resolveOptions, options: copyOptions): EntityAttribute {
        let entity: (string | EntityReferenceDefinition);
        entity = instance.entity ? instance.entity.copyData(resOpt, options) as (string | EntityReferenceDefinition) : undefined;
        const exhibitsTraits: CdmTraitReference[] = instance.exhibitsTraits ?
            instance.exhibitsTraits.allItems.filter((trait: CdmTraitReference) => !trait.isFromProperty) : undefined;

        return {
            name: instance.name,
            description: instance.description,
            displayName: instance.displayName,
            explanation: instance.explanation,
            isPolymorphicSource: instance.isPolymorphicSource,
            purpose: instance.purpose
            ? instance.purpose.copyData(resOpt, options) as (string | PurposeReference)
                : undefined,
            entity: entity,
            appliedTraits: copyDataUtils.arrayCopyData<string | TraitReference>(resOpt, exhibitsTraits, options),
            resolutionGuidance: instance.resolutionGuidance
                ? instance.resolutionGuidance.copyData(resOpt, options) as AttributeResolutionGuidance : undefined
        };
    }
}
