// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ModelJson } from '..';
import {
    CdmCorpusContext,
    CdmDataPartitionDefinition,
    CdmFolderDefinition,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitReference,
    cdmLogCode,
    copyOptions,
    Logger,
    resolveOptions,
    traitToPropertyMap,
    StringUtils
} from '../../internal';
import * as timeUtils from '../../Utilities/timeUtils';
import { processExtensionFromJson } from './ExtensionHelper';
import { CsvFormatSettings, Partition, partitionBaseProperties } from './types';

export class DataPartitionPersistence {
    private static TAG: string = DataPartitionPersistence.name;

    public static async fromData(
        ctx: CdmCorpusContext,
        object: Partition,
        extensionTraitDefList: CdmTraitDefinition[],
        localExtensionTraitDefList: CdmTraitDefinition[],
        documentFolder: CdmFolderDefinition):
        Promise<CdmDataPartitionDefinition> {
        const dataPartition: CdmDataPartitionDefinition = ctx.corpus.MakeObject(cdmObjectType.dataPartitionDef, object.name);

        if (!StringUtils.isBlankByCdmStandard(object.description)) {
            dataPartition.description = object.description;
        }

        dataPartition.location = ctx.corpus.storage.createRelativeCorpusPath(
            ctx.corpus.storage.adapterPathToCorpusPath(object.location),
            documentFolder);

        dataPartition.refreshTime = object.refreshTime;

        if (object['cdm:lastFileModifiedTime'] !== undefined) {
            dataPartition.lastFileModifiedTime = new Date(object['cdm:lastFileModifiedTime']);
        }

        if (object['cdm:lastFileStatusCheckTime'] !== undefined) {
            dataPartition.lastFileStatusCheckTime = new Date(object['cdm:lastFileStatusCheckTime']);
        }

        if (StringUtils.isBlankByCdmStandard(dataPartition.location)) {
            Logger.warning(ctx, this.TAG, this.fromData.name, null, cdmLogCode.WarnPersistPartitionLocMissing, dataPartition.name);
        }

        if (object.isHidden === true) {
            const isHiddenTrait: CdmTraitReference = ctx.corpus.MakeRef(cdmObjectType.traitRef, 'is.hidden', true);
            dataPartition.exhibitsTraits.push(isHiddenTrait);
        }

        await ModelJson.utils.processAnnotationsFromData(ctx, object, dataPartition.exhibitsTraits);

        let csvFormatTrait: CdmTraitReference = dataPartition.exhibitsTraits.item('is.partition.format.CSV') as CdmTraitReference;
        if (object.fileFormatSettings !== undefined && object.fileFormatSettings.$type === 'CsvFormatSettings') {
            const partitionTraitExisted = !!csvFormatTrait;
            csvFormatTrait = ModelJson.utils.createCsvTrait(object.fileFormatSettings, ctx, csvFormatTrait);

            if (csvFormatTrait === undefined) {
                Logger.error(ctx, this.TAG, this.fromData.name, null, cdmLogCode.ErrPersistCsvProcessingError);
                return undefined;
            }

            if (!partitionTraitExisted) {
                dataPartition.exhibitsTraits.push(csvFormatTrait);
            }
        }

        processExtensionFromJson(
            ctx,
            object,
            partitionBaseProperties,
            dataPartition.exhibitsTraits,
            extensionTraitDefList,
            localExtensionTraitDefList
        );

        return dataPartition;
    }

    public static async toData(instance: CdmDataPartitionDefinition, resOpt: resolveOptions, options: copyOptions): Promise<Partition> {
        const t2pm: traitToPropertyMap = new traitToPropertyMap(instance);
        const isHiddenTrait: CdmTraitReference = t2pm.fetchTraitReference('is.hidden');

        const result: Partition = {
            name: instance.name,
            description: instance.explanation,
            annotations: undefined,
            location: instance.ctx.corpus.storage.corpusPathToAdapterPath(
                instance.ctx.corpus.storage.createAbsoluteCorpusPath(
                    instance.location, instance.inDocument)),
            refreshTime: instance.refreshTime,
            fileFormatSettings: undefined,
            'cdm:traits': undefined,
            'cdm:lastFileModifiedTime': timeUtils.getFormattedDateString(instance.lastFileModifiedTime),
            'cdm:lastFileStatusCheckTime': timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime)
        };

        if (result.name === undefined) {
            Logger.warning(instance.ctx, this.TAG, this.toData.name, instance.atCorpusPath, cdmLogCode.WarnPersistPartitionNameNull);
            result.name = '';
        }

        if (StringUtils.isBlankByCdmStandard(result.location)) {
            Logger.warning(instance.ctx, this.TAG, this.toData.name, instance.atCorpusPath, cdmLogCode.WarnPersistPartitionLocMissing, result.name);
        }

        await ModelJson.utils.processTraitsAndAnnotationsToData(instance.ctx, result, instance.exhibitsTraits);

        if (isHiddenTrait) {
            result.isHidden = true;
        }

        const csvTrait: CdmTraitReference = t2pm.fetchTraitReference('is.partition.format.CSV');

        if (csvTrait) {
            const csvFormatSettings: CsvFormatSettings = ModelJson.utils.createCsvFormatSettings(csvTrait);

            if (csvFormatSettings !== undefined) {
                result.fileFormatSettings = csvFormatSettings;
                result.fileFormatSettings.$type = 'CsvFormatSettings';
            } else {
                Logger.error(instance.ctx, this.TAG, this.toData.name, instance.atCorpusPath, cdmLogCode.ErrPersistCsvProcessingError);
                return undefined;
            }
        }

        return result;
    }
}
