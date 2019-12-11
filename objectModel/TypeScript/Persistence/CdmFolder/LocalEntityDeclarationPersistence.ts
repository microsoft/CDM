import {
    DataPartitionPatternPersistence,
    DataPartitionPersistence
} from '.';
import {
    CdmCorpusContext,
    CdmLocalEntityDeclarationDefinition,
    cdmObjectType,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../internal';
import { Logger } from '../../Utilities/Logging/Logger';
import * as timeUtils from '../../Utilities/timeUtils';
import {
    DataPartition,
    DataPartitionPattern,
    EntityDeclarationDefinition,
    entityDeclarationDefinitionType,
    TraitReference
} from './types';
import * as utils from './utils';

export class LocalEntityDeclarationPersistence {
    /**
     * Creates an instance of the local entity declaration from data.
     * @param ctx The context.
     * @param object The object to read the data from.
     * @returns a local entity declartion instance.
     */
    public static fromData(ctx: CdmCorpusContext, prefixPath: string, dataObj: EntityDeclarationDefinition): CdmLocalEntityDeclarationDefinition {
        const localDec: CdmLocalEntityDeclarationDefinition =
            ctx.corpus.MakeObject<CdmLocalEntityDeclarationDefinition>(cdmObjectType.localEntityDeclarationDef, dataObj.entityName);
        let entityPath: string = dataObj.entityPath;
        // check for the old format, it has to be there then.
        if (!entityPath) {
            entityPath = dataObj.entitySchema;
            if (!entityPath) {
                Logger.error(LocalEntityDeclarationPersistence.name, ctx, 'Couldn\'t find entity path or similar.', 'FromData');
            }
        }

        localDec.entityPath = entityPath;

        if (dataObj.lastFileStatusCheckTime) {
            localDec.lastFileStatusCheckTime = new Date(dataObj.lastFileStatusCheckTime);
        }

        if (dataObj.lastFileModifiedTime) {
            localDec.lastFileModifiedTime = new Date(dataObj.lastFileModifiedTime);
        }

        if (dataObj.lastChildFileModifiedTime) {
            localDec.lastChildFileModifiedTime = new Date(dataObj.lastChildFileModifiedTime);
        }

        if (dataObj.explanation) {
            localDec.explanation = dataObj.explanation;
        }
        if (dataObj.exhibitsTraits) {
            utils.addArrayToCdmCollection<CdmTraitReference>(localDec.exhibitsTraits, utils.createTraitReferenceArray(ctx, dataObj.exhibitsTraits));
        }
        if (dataObj.dataPartitions) {
            for (const dataPartition of dataObj.dataPartitions) {
                localDec.dataPartitions.push(DataPartitionPersistence.fromData(ctx, dataPartition));
            }
        }
        if (dataObj.dataPartitionPatterns) {
            for (const pattern of dataObj.dataPartitionPatterns) {
                localDec.dataPartitionPatterns.push(DataPartitionPatternPersistence.fromData(ctx, pattern));
            }
        }

        return localDec;
    }

    public static toData(
        instance: CdmLocalEntityDeclarationDefinition,
        resOpt: resolveOptions,
        options: copyOptions): EntityDeclarationDefinition {
        return {
            type: entityDeclarationDefinitionType.localEntity,
            entityName: instance.entityName,
            explanation: instance.explanation,
            lastFileStatusCheckTime: timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime),
            lastFileModifiedTime: timeUtils.getFormattedDateString(instance.lastFileModifiedTime),
            lastChildFileModifiedTime: timeUtils.getFormattedDateString(instance.lastChildFileModifiedTime),
            exhibitsTraits: utils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits, options),
            entityPath: instance.entityPath,
            dataPartitions: utils.arrayCopyData<DataPartition>(resOpt, instance.dataPartitions, options),
            dataPartitionPatterns: utils.arrayCopyData<DataPartitionPattern>(resOpt, instance.dataPartitionPatterns, options)
        };
    }
}
