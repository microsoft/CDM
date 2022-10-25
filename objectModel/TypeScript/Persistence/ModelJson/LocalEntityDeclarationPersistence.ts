// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ModelJson } from '..';
import {
    CdmCorpusContext,
    CdmDataPartitionDefinition,
    CdmDocumentDefinition,
    CdmFolderDefinition,
    CdmImport,
    CdmLocalEntityDeclarationDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    cdmLogCode,
    CdmTraitDefinition,
    CdmTraitReference,
    copyOptions,
    resolveOptions,
    traitToPropertyMap,
    CdmConstants
} from '../../internal';
import { Logger } from '../../Utilities/Logging/Logger';
import * as timeUtils from '../../Utilities/timeUtils';
import * as extensionHelper from './ExtensionHelper';
import { Entity, LocalEntity, Partition } from './types';

export class LocalEntityDeclarationPersistence {
    private static TAG: string = LocalEntityDeclarationPersistence.name;

    public static async fromData(
        ctx: CdmCorpusContext,
        documentFolder: CdmFolderDefinition,
        dataObj: LocalEntity,
        extensionTraitDefList: CdmTraitDefinition[],
        manifest: CdmManifestDefinition
    ): Promise<CdmLocalEntityDeclarationDefinition> {
        const localEntityDec: CdmLocalEntityDeclarationDefinition =
            ctx.corpus.MakeObject(cdmObjectType.localEntityDeclarationDef, dataObj.name);
        localEntityDec.virtualLocation = documentFolder.folderPath + CdmConstants.modelJsonExtension;

        const localExtensionTraitDefList: CdmTraitDefinition[] = [];
        const entityDoc: CdmDocumentDefinition = await ModelJson.DocumentPersistence.fromData(
            ctx,
            dataObj,
            extensionTraitDefList,
            localExtensionTraitDefList
        );

        documentFolder.documents.push(entityDoc);

        // Entity schema path is the path to the doc containing the entity definition.
        localEntityDec.entityPath = ctx.corpus.storage.createRelativeCorpusPath(`${entityDoc.atCorpusPath}/${dataObj.name}`, manifest);

        localEntityDec.explanation = dataObj.description;

        if (dataObj['cdm:lastFileStatusCheckTime'] !== undefined) {
            localEntityDec.lastFileStatusCheckTime = new Date(dataObj['cdm:lastFileStatusCheckTime']);
        }

        if (dataObj['cdm:lastFileModifiedTime'] !== undefined) {
            localEntityDec.lastFileModifiedTime = new Date(dataObj['cdm:lastFileModifiedTime']);

        }

        if (dataObj['cdm:lastChildFileModifiedTime'] !== undefined) {
            localEntityDec.lastChildFileModifiedTime = new Date(dataObj['cdm:lastChildFileModifiedTime']);
        }

        if (dataObj.isHidden === true) {
            const isHiddenTrait: CdmTraitReference = ctx.corpus.MakeObject(cdmObjectType.traitRef, 'is.hidden', true);
            isHiddenTrait.isFromProperty = true;
            localEntityDec.exhibitsTraits.push(isHiddenTrait);
        }

        // Add traits for schema entity info.
        if (dataObj.schemas) {
            const t2pm: traitToPropertyMap = new traitToPropertyMap(localEntityDec);
            t2pm.updatePropertyValue('cdmSchemas', dataObj.schemas);
        }

        // Data partitions are part of the local entity, add them here.
        if (dataObj.partitions) {
            for (const element of dataObj.partitions) {
                const cdmPartition: CdmDataPartitionDefinition =
                    await ModelJson.DataPartitionPersistence.fromData(
                        ctx,
                        element,
                        extensionTraitDefList,
                        localExtensionTraitDefList,
                        documentFolder
                    );
                if (cdmPartition !== undefined) {
                    localEntityDec.dataPartitions.push(cdmPartition);
                } else {
                    Logger.error(ctx, this.TAG, this.fromData.name, null, cdmLogCode.ErrPersistModelJsonDocConversionError);
                    return undefined;
                }
            }
        }

        const importDocs: CdmImport[] = await extensionHelper.standardImportDetection(
            ctx,
            extensionTraitDefList,
            localExtensionTraitDefList
        );
        extensionHelper.addImportDocsToManifest(ctx, importDocs, entityDoc);

        return localEntityDec;
    }

    public static async toData(
        instance: CdmLocalEntityDeclarationDefinition,
        manifest: CdmManifestDefinition,
        resOpt: resolveOptions,
        options: copyOptions
    ): Promise<LocalEntity> {
        // Fetch the document from entity schema.
        const localEntity: LocalEntity =
            await ModelJson.DocumentPersistence.toData(instance.entityPath, manifest, resOpt, options, instance.ctx);

        if (localEntity !== undefined) {
            const t2pm: traitToPropertyMap = new traitToPropertyMap(instance);
            const isHiddenTrait: CdmTraitReference = t2pm.fetchTraitReference('is.hidden');

            if (!localEntity.description) {
                localEntity.description = instance.explanation;
            }
            localEntity['cdm:lastFileStatusCheckTime'] = timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime);
            localEntity['cdm:lastFileModifiedTime'] = timeUtils.getFormattedDateString(instance.lastFileModifiedTime);
            localEntity['cdm:lastChildFileModifiedTime'] = timeUtils.getFormattedDateString(instance.lastChildFileModifiedTime);

            if (isHiddenTrait !== undefined) {
                localEntity.isHidden = true;
            }

            const schemas: string[] = t2pm.fetchPropertyValue('cdmSchemas') as string[];
            if (schemas !== undefined) {
                localEntity.schemas = schemas;
            }

            if (instance.dataPartitions !== undefined && instance.dataPartitions.length > 0) {
                localEntity.partitions = [];
                for (const element of instance.dataPartitions) {
                    const partition: Partition = await ModelJson.DataPartitionPersistence.toData(element, resOpt, options);
                    if (partition !== undefined) {
                        localEntity.partitions.push(partition);
                    }
                }
            }

            return localEntity;
        }

        return undefined;
    }

    private static copyExtensionProperties(entityFrom: Entity, entityDest: LocalEntity): void {
        for (const prop of Object.keys(entityFrom)
            .filter((x: string) => x.indexOf(':') !== -1)) {
            entityDest[prop] = entityFrom[prop];
        }
    }
}
