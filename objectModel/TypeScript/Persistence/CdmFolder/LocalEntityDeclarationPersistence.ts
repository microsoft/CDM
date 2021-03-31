// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmCorpusContext,
    CdmLocalEntityDeclarationDefinition,
    cdmObjectType,
    CdmTraitReference,
    cdmLogCode,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
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
    private static TAG: string = LocalEntityDeclarationPersistence.name;

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
                Logger.error(ctx, this.TAG, this.fromData.name, null, cdmLogCode.ErrPersistEntityPathNotFound);
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
        
        utils.addArrayToCdmCollection<CdmTraitReference>(localDec.exhibitsTraits, utils.createTraitReferenceArray(ctx, dataObj.exhibitsTraits));
        
        if (dataObj.dataPartitions) {
            for (const dataPartition of dataObj.dataPartitions) {
                localDec.dataPartitions.push(CdmFolder.DataPartitionPersistence.fromData(ctx, dataPartition));
            }
        }
        if (dataObj.dataPartitionPatterns) {
            for (const pattern of dataObj.dataPartitionPatterns) {
                localDec.dataPartitionPatterns.push(CdmFolder.DataPartitionPatternPersistence.fromData(ctx, pattern));
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
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits, options),
            entityPath: instance.entityPath,
            dataPartitions: copyDataUtils.arrayCopyData<DataPartition>(resOpt, instance.dataPartitions, options),
            dataPartitionPatterns: copyDataUtils.arrayCopyData<DataPartitionPattern>(resOpt, instance.dataPartitionPatterns, options)
        };
    }
}
