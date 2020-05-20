// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmDataPartitionDefinition,
    cdmObjectType,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import { Logger } from '../../Utilities/Logging/Logger';
import * as timeUtils from '../../Utilities/timeUtils';
import {
    DataPartition,
    KeyValPair,
    TraitReference
} from './types';
import * as utils from './utils';

export class DataPartitionPersistence {
    /**
     * Creates an instance from data object.
     * @param ctx The context.
     * @param dataObj The data object.
     * @returns A CdmDataPartitionDefinition instance.
     */
    public static fromData(ctx: CdmCorpusContext, dataObj: DataPartition): CdmDataPartitionDefinition {
        const newPartition: CdmDataPartitionDefinition = ctx.corpus.MakeObject(cdmObjectType.dataPartitionDef);
        newPartition.location = dataObj.location;

        if (dataObj.name) {
            newPartition.name = dataObj.name;
        }
        if (dataObj.specializedSchema) {
            newPartition.specializedSchema = dataObj.specializedSchema;
        }
        if (dataObj.lastFileStatusCheckTime) {
            newPartition.lastFileStatusCheckTime = new Date(dataObj.lastFileStatusCheckTime);
        }
        if (dataObj.lastFileModifiedTime) {
            newPartition.lastFileModifiedTime = new Date(dataObj.lastFileModifiedTime);
        }
        if (dataObj.exhibitsTraits) {
            utils.addArrayToCdmCollection<CdmTraitReference>(
                newPartition.exhibitsTraits, 
                utils.createTraitReferenceArray(ctx, dataObj.exhibitsTraits)
            );
        }
        if (dataObj.arguments) {
            for (const argument of dataObj.arguments) {
                let argName: string;
                let argValue: string;
                const entries: [string, string][] = Object.entries(argument);
                if (argument.name !== undefined) {
                    argName = argument.name;
                    argValue = argument.value;
                } else if (argument['key'] !== undefined) {
                    argName = argument['key'] as string;
                    argValue = argument.value;
                } else if (entries.length === 1) {
                    argName = entries[0][0];
                    argValue = entries[0][1];
                }
                if (!argName || !argValue) {
                    Logger.warning(
                        DataPartitionPersistence.name,
                        ctx,
                        `invalid set of arguments provided for data partition corresponding to location: ${dataObj.location}`
                    );
                }

                if (newPartition.arguments.has(argName)) {
                    newPartition.arguments.get(argName)
                        .push(argValue);
                } else {
                    newPartition.arguments.set(argName, [argValue]);
                }
            }
        }

        return newPartition;
    }

    public static toData(
        instance: CdmDataPartitionDefinition,
        resOpt: resolveOptions,
        options: copyOptions
    ): DataPartition {
        const dataCopy: DataPartition = {
            name: instance.name,
            location: instance.location,
            lastFileStatusCheckTime: timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime),
            lastFileModifiedTime: timeUtils.getFormattedDateString(instance.lastFileModifiedTime),
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits, options),
            arguments: undefined,
            specializedSchema: instance.specializedSchema
        };

        const argumentsCopy: KeyValPair[] = [];
        if (instance.arguments) {
            instance.arguments.forEach((argValueList: string[], key: string) => {
                argValueList.forEach((argValue: string) => {
                    argumentsCopy.push({name: key, value: argValue});
                });
            });
        }

        dataCopy.arguments = argumentsCopy.length > 0 ? argumentsCopy : undefined;

        return dataCopy;
    }
}
