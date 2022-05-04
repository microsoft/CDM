// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ModelJson } from '..';
import {
    CdmCorpusContext,
    CdmEntityDefinition,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTypeAttributeDefinition,
    cdmLogCode,
    copyOptions,
    resolveOptions,
    StringUtils
} from '../../internal';
import { Logger } from '../../Utilities/Logging/Logger';
import * as extensionHelper from './ExtensionHelper';
import { Attribute, LocalEntity, localEntityBaseProperties } from './types';

export class EntityPersistence {
    private static TAG: string = EntityPersistence.name;

    public static async fromData(
        ctx: CdmCorpusContext,
        object: LocalEntity,
        extensionTraitDefList: CdmTraitDefinition[],
        localExtensionTraitDefList: CdmTraitDefinition[]
    ): Promise<CdmEntityDefinition> {
        const entity: CdmEntityDefinition = ctx.corpus.MakeObject(cdmObjectType.entityDef, object.name);

        if (!StringUtils.isBlankByCdmStandard(object.description)) {
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
                    Logger.error(ctx, this.TAG, this.fromData.name, null, cdmLogCode.ErrPersistModelJsonToAttrConversionFailure);
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
        await ModelJson.utils.processTraitsAndAnnotationsToData(instance.ctx, result, instance.exhibitsTraits);

        if (instance.attributes !== undefined) {
            result.attributes = [];
            for (const element of instance.attributes.allItems) {
                if (element.objectType !== cdmObjectType.typeAttributeDef) {
                    Logger.error(ctx, this.TAG, this.toData.name, null, cdmLogCode.ErrPersistModelJsonEntityAttrError);
                    return undefined;
                }

                const attribute: Attribute =
                    await ModelJson.TypeAttributePersistence.toData(element as CdmTypeAttributeDefinition, resOpt, options);
                if (attribute !== undefined) {
                    result.attributes.push(attribute);
                } else {
                    Logger.error(ctx, this.TAG, this.toData.name, null, cdmLogCode.ErrPersistModelJsonFromAttrConversionFailure);
                    return undefined;
                }
            }
        }

        return result;
    }
}
