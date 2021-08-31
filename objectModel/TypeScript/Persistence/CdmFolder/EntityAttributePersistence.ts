// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmCorpusContext,
    CdmEntityAttributeDefinition,
    CdmEntityReference,
    cdmLogCode,
    cdmObjectType,
    CdmTraitGroupReference,
    CdmTraitReference,
    CdmTraitReferenceBase,
    copyOptions,
    Logger,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import { ProjectionPersistence } from './Projections/ProjectionPersistence';
import { AttributeResolutionGuidance, EntityAttribute, EntityReferenceDefinition, PurposeReference, TraitGroupReference, TraitReference } from './types';
import * as utils from './utils';

export class EntityAttributePersistence {
    private static TAG: string = EntityAttributePersistence.name;
    
    public static fromData(ctx: CdmCorpusContext, object: EntityAttribute): CdmEntityAttributeDefinition {
        const entityAttribute: CdmEntityAttributeDefinition = ctx.corpus.MakeObject(cdmObjectType.entityAttributeDef, object.name);

        entityAttribute.description = utils.propertyFromDataToString(object.description);
        entityAttribute.displayName = utils.propertyFromDataToString(object.displayName);
        entityAttribute.explanation = utils.propertyFromDataToString(object.explanation);

        entityAttribute.cardinality = utils.cardinalitySettingsFromData(object.cardinality, entityAttribute);

        entityAttribute.isPolymorphicSource = object.isPolymorphicSource;

        if (object.entity && typeof(object.entity) !== 'string' && 'source' in object.entity) {
            const inlineEntityRef: CdmEntityReference = ctx.corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, undefined);
            inlineEntityRef.explicitReference = ProjectionPersistence.fromData(ctx, object.entity);
            entityAttribute.entity = inlineEntityRef;
        } else {
            entityAttribute.entity = CdmFolder.EntityReferencePersistence.fromData(ctx, object.entity);
        }

        entityAttribute.purpose = CdmFolder.PurposeReferencePersistence.fromData(ctx, object.purpose);
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(
            entityAttribute.appliedTraits,
            utils.createTraitReferenceArray(ctx, object.appliedTraits)
        );

        // Ignore resolution guidance if the entity is a projection
        if (object.resolutionGuidance && object.entity && typeof(object.entity) !== 'string' && 'source' in object.entity) {
            Logger.error(ctx, this.TAG, this.fromData.name, null, cdmLogCode.ErrPersistEntityAttrUnsupported, entityAttribute.name);
        } else {
            entityAttribute.resolutionGuidance =
                CdmFolder.AttributeResolutionGuidancePersistence.fromData(ctx, object.resolutionGuidance);
        }

        return entityAttribute;
    }

    public static toData(instance: CdmEntityAttributeDefinition, resOpt: resolveOptions, options: copyOptions): EntityAttribute {
        let entity: (string | EntityReferenceDefinition);
        entity = instance.entity ? instance.entity.copyData(resOpt, options) as (string | EntityReferenceDefinition) : undefined;
        const appliedTraits: CdmTraitReferenceBase[] = instance.appliedTraits ?
            instance.appliedTraits.allItems.filter(
                (trait: CdmTraitReferenceBase) => trait instanceof CdmTraitGroupReference || !(trait as CdmTraitReference).isFromProperty) : undefined;

        const object: EntityAttribute = {
            name: instance.name,
            description: instance.description,
            displayName: instance.displayName,
            explanation: instance.explanation,
            isPolymorphicSource: instance.isPolymorphicSource,
            purpose: instance.purpose
            ? instance.purpose.copyData(resOpt, options) as (string | PurposeReference)
                : undefined,
            entity: entity,
            appliedTraits: copyDataUtils.arrayCopyData<string | TraitReference | TraitGroupReference>(resOpt, appliedTraits, options),
            resolutionGuidance: instance.resolutionGuidance
                ? instance.resolutionGuidance.copyData(resOpt, options) as AttributeResolutionGuidance : undefined,
            cardinality: utils.cardinalitySettingsToData(instance.cardinality)
        };

        return object;
    }
}
