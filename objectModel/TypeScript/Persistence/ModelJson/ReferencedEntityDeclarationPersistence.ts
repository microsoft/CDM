import {
    CdmArgumentDefinition,
    CdmCorpusContext,
    cdmObjectType,
    CdmReferencedEntityDeclarationDefinition,
    cdmStatusLevel,
    CdmTraitCollection,
    CdmTraitDefinition,
    CdmTraitReference,
    copyOptions,
    resolveOptions,
    traitToPropertyMap
} from '../../internal';
import { ReferenceEntity, referenceEntityBaseProperties } from './types';

import { Logger } from '../../Utilities/Logging/Logger';
import * as timeUtils from '../../Utilities/timeUtils';
import { processExtensionFromJson } from './ExtensionHelper';
import { processAnnotationsFromData, processAnnotationsToData } from './utils';

export class ReferencedEntityDeclarationPersistence {
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
            Logger.warning(ReferencedEntityDeclarationPersistence.name, ctx, 'Custom extensions are not supported in referenced entity.');
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
            Logger.error(
                ReferencedEntityDeclarationPersistence.name,
                instance.ctx,
                'Source name is not present in entityDeclaration path.',
                instance.atCorpusPath
            );

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

        await processAnnotationsToData(instance.ctx, referenceEntity, instance.exhibitsTraits);

        if (propertiesTrait) {
            referenceEntity.modelId = propertiesTrait.arguments.allItems[0].value as string;
        }

        return referenceEntity;
    }
}
