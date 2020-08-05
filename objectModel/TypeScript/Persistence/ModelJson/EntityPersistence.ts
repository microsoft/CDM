// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ModelJson } from '..';
import {
    CdmCorpusContext,
    CdmEntityDefinition,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTypeAttributeDefinition,
    copyOptions,
    resolveOptions
} from '../../internal';
import { Logger } from '../../Utilities/Logging/Logger';
import * as extensionHelper from './ExtensionHelper';
import { Attribute, LocalEntity, localEntityBaseProperties } from './types';

export class EntityPersistence {
    public static async fromData(
        ctx: CdmCorpusContext,
        object: LocalEntity,
        extensionTraitDefList: CdmTraitDefinition[],
        localExtensionTraitDefList: CdmTraitDefinition[]
    ): Promise<CdmEntityDefinition> {
        const entity: CdmEntityDefinition = ctx.corpus.MakeObject(cdmObjectType.entityDef, object.name);

        if (object.description && object.description.trim() !== '') {
            entity.description = object.description;
        }

        await ModelJson.utils.processAnnotationsFromData(ctx, object, entity.exhibitsTraits);

        const localEntity: LocalEntity = object;

        if (localEntity.attributes) {
            for (const element of localEntity.attributes) {
                const typeAttribute: CdmTypeAttributeDefinition =
                    await ModelJson.TypeAttributePersistence.fromData(ctx, element, extensionTraitDefList, localExtensionTraitDefList);
                if (typeAttribute !== undefined) {
                    entity.attributes.push(typeAttribute);
                } else {
                    Logger.error(
                        EntityPersistence.name,
                        ctx,
                        'There was an error while trying to convert model.json attribute to cdm attribute.'
                    );

                    return undefined;
                }
            }
        }
        extensionHelper.processExtensionFromJson(
            ctx,
            localEntity,
            localEntityBaseProperties,
            entity.exhibitsTraits,
            extensionTraitDefList,
            localExtensionTraitDefList
        );

        return entity;
    }

    public static async toData(
        instance: CdmEntityDefinition,
        resOpt: resolveOptions,
        options: copyOptions,
        ctx: CdmCorpusContext
    ): Promise<LocalEntity> {
        const result: LocalEntity = {
            $type: 'LocalEntity',
            name: instance.entityName,
            description: instance.getProperty('description') as string,
            isHidden: undefined,
            annotations: undefined,
            'cdm:traits': undefined,
            attributes: undefined,
            partitions: undefined,
            schemas: undefined,
            'cdm:imports': undefined
        };
        ModelJson.utils.processTraitsAndAnnotationsToData(instance.ctx, result, instance.exhibitsTraits);

        if (instance.attributes !== undefined) {
            result.attributes = [];
            for (const element of instance.attributes.allItems) {
                if (element.objectType !== cdmObjectType.typeAttributeDef) {
                    Logger.error(
                        EntityPersistence.name,
                        ctx,
                        `Saving a manifest, with an entity containing an entity attribute, to model.json format is currently not supported.`
                    );

                    return undefined;
                }

                const attribute: Attribute =
                    await ModelJson.TypeAttributePersistence.toData(element as CdmTypeAttributeDefinition, resOpt, options);
                if (attribute !== undefined) {
                    result.attributes.push(attribute);
                } else {
                    Logger.error(
                        EntityPersistence.name,
                        ctx,
                        'There was an error while trying to convert model.json attribute to cdm attribute.'
                    );

                    return undefined;
                }
            }
        }

        return result;
    }
}
