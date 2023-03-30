// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmCorpusContext,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition,
    CdmLocalEntityDeclarationDefinition,
    cdmLogCode,
    CdmObject,
    cdmObjectType,
    CdmTraitReferenceBase,
    constants,
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
    TraitGroupReference,
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
                Logger.error(ctx, this.TAG, this.fromData.name, undefined, cdmLogCode.ErrPersistEntityPathNotFound, dataObj.entityName);
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
        
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(localDec.exhibitsTraits, utils.createTraitReferenceArray(ctx, dataObj.exhibitsTraits));
        
        if (dataObj.dataPartitions) {
            for (const dataPartition of dataObj.dataPartitions) {
                const dataPartitionDef = CdmFolder.DataPartitionPersistence.fromData(ctx, dataPartition);
                if (dataPartitionDef.isIncremental) {
                    this.errorMessage(ctx, this.fromData.name, null, dataPartitionDef, true);
                } else {
                    localDec.dataPartitions.push(dataPartitionDef);
                }
            }
        }
        if (dataObj.dataPartitionPatterns) {
            for (const pattern of dataObj.dataPartitionPatterns) {
                const dataPartitionPatternDef = CdmFolder.DataPartitionPatternPersistence.fromData(ctx, pattern)
                if (dataPartitionPatternDef.isIncremental) {
                    this.errorMessage(ctx, this.fromData.name, null, dataPartitionPatternDef, true);
                } else {
                    localDec.dataPartitionPatterns.push(dataPartitionPatternDef);
                }
            }
        }

        if (dataObj.incrementalPartitions) {
            for (const incrementalPartition of dataObj.incrementalPartitions) {
                const incrementalPartitionDef = CdmFolder.DataPartitionPersistence.fromData(ctx, incrementalPartition);
                if (!incrementalPartitionDef.isIncremental) {
                    this.errorMessage(ctx, this.fromData.name, null, incrementalPartitionDef, false);
                } else {
                    localDec.incrementalPartitions.push(incrementalPartitionDef);
                }
            }
        }
        if (dataObj.incrementalPartitionPatterns) {
            for (const incrementalPattern of dataObj.incrementalPartitionPatterns) {
                const incrementalPatternDef = CdmFolder.DataPartitionPatternPersistence.fromData(ctx, incrementalPattern)
                if (!incrementalPatternDef.isIncremental) {
                    this.errorMessage(ctx, this.fromData.name, null, incrementalPatternDef, false);
                } else {
                    localDec.incrementalPartitionPatterns.push(incrementalPatternDef);
                }
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
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference | TraitGroupReference>(resOpt, instance.exhibitsTraits, options),
            entityPath: instance.entityPath,
            dataPartitions: copyDataUtils.arrayCopyData<DataPartition>(resOpt, instance.dataPartitions, options, this.ensureNonIncremental(instance)),
            dataPartitionPatterns: copyDataUtils.arrayCopyData<DataPartitionPattern>(resOpt, instance.dataPartitionPatterns, options, this.ensureNonIncremental(instance)),
            incrementalPartitions: copyDataUtils.arrayCopyData<DataPartition>(resOpt, instance.incrementalPartitions, options, this.ensureIncremental(instance)),
            incrementalPartitionPatterns: copyDataUtils.arrayCopyData<DataPartitionPattern>(resOpt, instance.incrementalPartitionPatterns, options, this.ensureIncremental(instance))
        };
    }

    private static errorMessage(ctx: CdmCorpusContext, methodName: string, corpusPath: string, obj: CdmDataPartitionDefinition| CdmDataPartitionPatternDefinition, isIncremental: boolean): void {
        const propertyName: string = obj instanceof CdmDataPartitionDefinition 
                                            ? (isIncremental ? 'dataPartitions' : 'incrementalPartitions') 
                                            : (isIncremental ? 'dataPartitionPatterns' : 'incrementalPartitionPatterns')
        if (isIncremental) {
            Logger.error(ctx, this.TAG, methodName, corpusPath, cdmLogCode.ErrPersistIncrementalConversionError, obj.name, constants.INCREMENTAL_TRAIT_NAME, propertyName);
        } else {
            Logger.error(ctx, this.TAG, methodName, corpusPath, cdmLogCode.ErrPersistNonIncrementalConversionError, obj.name, constants.INCREMENTAL_TRAIT_NAME, propertyName);
        }
    }

    private static ensureNonIncremental(instance: CdmLocalEntityDeclarationDefinition): ((obj: CdmObject) => boolean) {
        const compare = (obj: CdmObject): boolean => {
            if ((obj instanceof CdmDataPartitionDefinition && (obj as CdmDataPartitionDefinition).isIncremental) ||
                (obj instanceof CdmDataPartitionPatternDefinition && (obj as CdmDataPartitionPatternDefinition).isIncremental)) {
                this.errorMessage(instance.ctx, this.toData.name, instance.atCorpusPath, obj, true);
                return false;
            }
            return true;
        }
        return compare;
    }

    private static ensureIncremental(instance: CdmLocalEntityDeclarationDefinition): ((obj: CdmObject) => boolean) {
        const compare = (obj: CdmObject): boolean => {
            if ((obj instanceof CdmDataPartitionDefinition && !(obj as CdmDataPartitionDefinition).isIncremental) ||
                (obj instanceof CdmDataPartitionPatternDefinition && !(obj as CdmDataPartitionPatternDefinition).isIncremental)) {
                this.errorMessage(instance.ctx, this.toData.name, instance.atCorpusPath, obj, false);
                return false;
            }
            return true;
        }
        return compare;
    }
}
