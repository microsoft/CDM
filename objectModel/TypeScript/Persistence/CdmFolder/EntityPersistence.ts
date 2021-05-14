// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmAttributeItem,
    CdmCorpusContext,
    CdmEntityDefinition,
    cdmObjectType,
    CdmTraitGroupReference,
    CdmTraitReference,
    CdmTraitReferenceBase,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import {
    AttributeContext,
    AttributeGroupReference,
    AttributeResolutionGuidance,
    Entity,
    EntityAttribute,
    EntityReferenceDefinition,
    TraitGroupReference,
    TraitReference,
    TypeAttribute
} from './types';
import * as utils from './utils';

export class EntityPersistence {
    public static fromData(ctx: CdmCorpusContext, object: Entity): CdmEntityDefinition {
        if (!object) {
            return undefined;
        }

        const entity: CdmEntityDefinition = ctx.corpus.MakeObject(cdmObjectType.entityDef, object.entityName);
        entity.extendsEntity = CdmFolder.EntityReferencePersistence.fromData(ctx, object.extendsEntity);
        entity.extendsEntityResolutionGuidance =
            CdmFolder.AttributeResolutionGuidancePersistence.fromData(ctx, object.extendsEntityResolutionGuidance);

        entity.explanation = utils.propertyFromDataToString(object.explanation);

        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(
            entity.exhibitsTraits,
            utils.createTraitReferenceArray(ctx, object.exhibitsTraits)
        );

        entity.sourceName = utils.propertyFromDataToString(object.sourceName);
        entity.displayName = utils.propertyFromDataToString(object.displayName);
        entity.description = utils.propertyFromDataToString(object.description);
        entity.version = utils.propertyFromDataToString(object.version);
        entity.cdmSchemas = object.cdmSchemas;

        if (object.attributeContext) {
            entity.attributeContext = CdmFolder.AttributeContextPersistence.fromData(ctx, object.attributeContext);
        }

        utils.addArrayToCdmCollection<CdmAttributeItem>(entity.attributes, utils.createAttributeArray(ctx, object.hasAttributes, entity.entityName));

        return entity;
    }

    public static toData(instance: CdmEntityDefinition, resOpt: resolveOptions, options: copyOptions): Entity {
        const exhibitsTraits: CdmTraitReferenceBase[] = instance.exhibitsTraits ?
            instance.exhibitsTraits.allItems.filter(
                (trait: CdmTraitReferenceBase) => trait instanceof CdmTraitGroupReference || !(trait as CdmTraitReference).isFromProperty) : undefined;
        const object: Entity = {
            explanation: instance.explanation,
            entityName: instance.entityName,
            extendsEntity: instance.extendsEntity ?
                instance.extendsEntity.copyData(resOpt, options) as (string | EntityReferenceDefinition) : undefined,
            extendsEntityResolutionGuidance: instance.extendsEntityResolutionGuidance ?
                instance.extendsEntityResolutionGuidance.copyData(resOpt, options) as AttributeResolutionGuidance : undefined,
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference | TraitGroupReference>(resOpt, exhibitsTraits, options)
        };

        if (instance.sourceName) {
            object.sourceName = instance.getProperty('sourceName') as string;
        }
        if (instance.displayName) {
            object.displayName = instance.getProperty('displayName') as string;
        }
        if (instance.description) {
            object.description = instance.getProperty('description') as string;
        }
        if (instance.version) {
            object.version = instance.getProperty('version') as string;
        }
        if (instance.cdmSchemas) {
            object.cdmSchemas = instance.getProperty('cdmSchemas') as string[];
        }

        // after the properties so they show up first in doc
        if (instance.attributes) {
            object.hasAttributes =
            copyDataUtils.arrayCopyData<string | AttributeGroupReference | TypeAttribute | EntityAttribute>(
                    resOpt, instance.attributes, options);
            object.attributeContext = instance.attributeContext ?
                instance.attributeContext.copyData(resOpt, options) as AttributeContext : undefined;
        }

        return object;
    }
}
