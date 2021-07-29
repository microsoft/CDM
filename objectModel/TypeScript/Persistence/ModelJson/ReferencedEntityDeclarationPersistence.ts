// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmArgumentDefinition,
    CdmCorpusContext,
    cdmObjectType,
    CdmReferencedEntityDeclarationDefinition,
    CdmTraitCollection,
    CdmTraitDefinition,
    CdmTraitReference,
    cdmLogCode,
    copyOptions,
    resolveOptions,
    traitToPropertyMap
} from '../../internal';
import { ReferenceEntity, referenceEntityBaseProperties } from './types';

import { Logger } from '../../Utilities/Logging/Logger';
import * as timeUtils from '../../Utilities/timeUtils';
import { processExtensionFromJson } from './ExtensionHelper';
import { processAnnotationsFromData, processTraitsAndAnnotationsToData } from './utils';

export class ReferencedEntityDeclarationPersistence {
    private static TAG: string = ReferencedEntityDeclarationPersistence.name;

    public static async fromData(
        ctx: CdmCorpusContext,
        dataObj: ReferenceEntity,
        location: string
    ): Promise<CdmReferencedEntityDeclarationDefinition> {
        const referencedEntity: CdmReferencedEntityDeclarationDefinition = ctx.corpus.MakeObject<CdmReferencedEntityDeclarationDefinition>(
            cdmObjectType.referencedEntityDeclarationDef,
            dataObj.name
        );
        const corpusPath: string = ctx.corpus.storage.adapterPathToCorpusPath(location);

        referencedEntity.entityName = dataObj.name;
        referencedEntity.entityPath = `${corpusPath}/${dataObj.source}`;
        referencedEntity.explanation = dataObj.description;

        if (dataObj['cdm:lastFileStatusCheckTime']) {
            referencedEntity.lastFileStatusCheckTime = new Date(dataObj['cdm:lastFileStatusCheckTime']);
        }

        if (dataObj['cdm:lastFileModifiedTime']) {
            referencedEntity.lastFileModifiedTime = new Date(dataObj['cdm:lastFileModifiedTime']);
        }

        await processAnnotationsFromData(ctx, dataObj, referencedEntity.exhibitsTraits);

        if (dataObj.isHidden !== undefined) {
            const isHiddenTrait: CdmTraitReference = ctx.corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, 'is.hidden', true);
            isHiddenTrait.isFromProperty = true;
            referencedEntity.exhibitsTraits.push(isHiddenTrait);
        }

        const trait: CdmTraitReference =
            ctx.corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, 'is.propertyContent.multiTrait', false);
        trait.isFromProperty = true;

        const argument: CdmArgumentDefinition = ctx.corpus.MakeObject<CdmArgumentDefinition>(cdmObjectType.argumentDef, 'modelId');
        argument.value = dataObj.modelId;
        trait.arguments.push(argument);
        referencedEntity.exhibitsTraits.push(trait);
        const extensionTraitDefList: CdmTraitDefinition[] = [];
        const extensionTraits: CdmTraitCollection = new CdmTraitCollection(ctx, referencedEntity);
        processExtensionFromJson(ctx, dataObj, referenceEntityBaseProperties, extensionTraits, extensionTraitDefList);

        if (extensionTraitDefList.length > 0) {
            Logger.warning(ctx, this.TAG, this.fromData.name, null, cdmLogCode.WarnPersistCustomExtNotSupported);
        }

        return referencedEntity;
    }

    public static async toData(
        instance: CdmReferencedEntityDeclarationDefinition,
        resOpt: resolveOptions,
        options: copyOptions
    ): Promise<ReferenceEntity> {
        const referenceEntity: ReferenceEntity = <ReferenceEntity>{};

        const t2pm: traitToPropertyMap = new traitToPropertyMap(instance);
        const isHidden: CdmTraitReference = t2pm.fetchTraitReference('is.hidden');
        const propertiesTrait: CdmTraitReference = t2pm.fetchTraitReference('is.propertyContent.multiTrait');
        const sourceIndex: number = instance.entityPath.lastIndexOf('/');

        if (sourceIndex === -1) {
            Logger.error(instance.ctx, this.TAG, this.toData.name, instance.atCorpusPath, cdmLogCode.ErrPersistModelJsonEntityRefConversionError, instance.entityName);
            return Promise.reject('Source name is not present in entityDeclaration path.');
        }

        referenceEntity.$type = 'ReferenceEntity';
        referenceEntity.name = instance.entityName;
        referenceEntity.source = instance.entityPath.slice(sourceIndex + 1);
        referenceEntity.description = instance.explanation;

        referenceEntity['cdm:lastFileStatusCheckTime'] = timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime);
        referenceEntity['cdm:lastFileModifiedTime'] = timeUtils.getFormattedDateString(instance.lastFileModifiedTime);

        if (isHidden !== undefined) {
            referenceEntity.isHidden = true;
        }

        processTraitsAndAnnotationsToData(instance.ctx, referenceEntity, instance.exhibitsTraits);

        if (propertiesTrait) {
            referenceEntity.modelId = propertiesTrait.arguments.allItems[0].value as string;
        }

        return referenceEntity;
    }
}
