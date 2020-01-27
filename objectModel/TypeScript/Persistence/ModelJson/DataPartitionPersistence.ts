import { ModelJson } from '..';
import {
    CdmCorpusContext,
    CdmDataPartitionDefinition,
    CdmFolderDefinition,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitReference,
    copyOptions,
    Logger,
    resolveOptions,
    traitToPropertyMap
} from '../../internal';
import * as timeUtils from '../../Utilities/timeUtils';
import { processExtensionFromJson } from './ExtensionHelper';
import { CsvFormatSettings, Partition, partitionBaseProperties } from './types';

export class DataPartitionPersistence {
    public static async fromData(
        ctx: CdmCorpusContext,
        object: Partition,
        extensionTraitDefList: CdmTraitDefinition[],
        localExtensionTraitDefList: CdmTraitDefinition[],
        documentFolder: CdmFolderDefinition):
        Promise<CdmDataPartitionDefinition> {
        const newPartition: CdmDataPartitionDefinition = ctx.corpus.MakeObject(cdmObjectType.dataPartitionDef, object.name);

        newPartition.description = object.description;

        newPartition.location = ctx.corpus.storage.createRelativeCorpusPath(
            ctx.corpus.storage.adapterPathToCorpusPath(object.location),
            documentFolder);

        newPartition.refreshTime = object.refreshTime;

        if (object['cdm:lastFileModifiedTime'] !== undefined) {
            newPartition.lastFileModifiedTime = new Date(object['cdm:lastFileModifiedTime']);
        }

        if (object['cdm:lastFileStatusCheckTime'] !== undefined) {
            newPartition.lastFileStatusCheckTime = new Date(object['cdm:lastFileStatusCheckTime']);
        }

        if (!newPartition.location) {
            Logger.warning(
                DataPartitionPersistence.name,
                ctx,
                `Couldn't find data partition's location for partition ${newPartition.name}.`,
                this.fromData.name
            );
        }

        if (object.isHidden === true) {
            const isHiddenTrait: CdmTraitReference = ctx.corpus.MakeRef(cdmObjectType.traitRef, 'is.hidden', true);
            newPartition.exhibitsTraits.push(isHiddenTrait);
        }

        await ModelJson.utils.processAnnotationsFromData(ctx, object, newPartition.exhibitsTraits);

        if (object.fileFormatSettings !== undefined && object.fileFormatSettings.$type === 'CsvFormatSettings') {
            const csvFormatTrait: CdmTraitReference = ModelJson.utils.createCsvTrait(object.fileFormatSettings, ctx);

            if (csvFormatTrait !== undefined) {
                newPartition.exhibitsTraits.push(csvFormatTrait);
            } else {
                Logger.error(
                    DataPartitionPersistence.name,
                    ctx,
                    'There was a problem while processing csv format settings inside data partition.'
                );

                return undefined;
            }
        }

        processExtensionFromJson(
            ctx,
            object,
            partitionBaseProperties,
            newPartition.exhibitsTraits,
            extensionTraitDefList,
            localExtensionTraitDefList
        );

        return newPartition;
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

        if (!result.location) {
            Logger.warning(DataPartitionPersistence.name, instance.ctx, `Couldn't find data partition's location for partition ${result.name}.`, this.toData.name);
        }

        await ModelJson.utils.processAnnotationsToData(instance.ctx, result, instance.exhibitsTraits);

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
                Logger.error(
                    DataPartitionPersistence.name,
                    instance.ctx,
                    'There was a problem while processing csv format trait inside data partition.'
                );

                return undefined;
            }
        }

        return result;
    }
}
