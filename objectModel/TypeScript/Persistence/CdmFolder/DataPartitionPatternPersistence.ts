// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmDataPartitionPatternDefinition,
    cdmObjectType,
    CdmTraitReferenceBase,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import * as timeUtils from '../../Utilities/timeUtils';
import {
    DataPartitionPattern,
    TraitGroupReference,
    TraitReference
} from './types';
import * as utils from './utils';

export class DataPartitionPatternPersistence {
    /**
     * Creates a new instance from a Data partition pattern type object.
     * @param ctx The context.
     * @param dataObj The object to read for data.
     * @returns A new CdmDataPartitionPatternDefinition instance.
     */
    public static fromData(ctx: CdmCorpusContext, dataObj: DataPartitionPattern): CdmDataPartitionPatternDefinition {
        const newPattern: CdmDataPartitionPatternDefinition
            = ctx.corpus.MakeObject(cdmObjectType.dataPartitionPatternDef, dataObj.name);

        newPattern.rootLocation = dataObj.rootLocation;
        if (dataObj.globPattern) {
            newPattern.globPattern = dataObj.globPattern;
        }
        if (dataObj.regularExpression) {
            newPattern.regularExpression = dataObj.regularExpression;
        }
        if (dataObj.parameters) {
            newPattern.parameters = dataObj.parameters;
        }
        if (dataObj.lastFileStatusCheckTime) {
            newPattern.lastFileStatusCheckTime = new Date(dataObj.lastFileStatusCheckTime);
        }

        if (dataObj.lastFileModifiedTime) {
            newPattern.lastFileModifiedTime = new Date(dataObj.lastFileModifiedTime);
        }
        if (dataObj.explanation) {
            newPattern.explanation = dataObj.explanation;
        }
        if (dataObj.specializedSchema) {
            newPattern.specializedSchema = dataObj.specializedSchema;
        }
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(newPattern.exhibitsTraits, utils.createTraitReferenceArray(ctx, dataObj.exhibitsTraits));

        return newPattern;
    }

    public static toData(instance: CdmDataPartitionPatternDefinition, resOpt: resolveOptions, options: copyOptions): DataPartitionPattern {
        return {
            name: instance.name,
            lastFileStatusCheckTime: timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime),
            lastFileModifiedTime: timeUtils.getFormattedDateString(instance.lastFileModifiedTime),
            explanation: instance.explanation,
            rootLocation: instance.rootLocation,
            globPattern: instance.globPattern,
            regularExpression: instance.regularExpression,
            parameters: instance.parameters,
            specializedSchema: instance.specializedSchema,
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference | TraitGroupReference>(resOpt, instance.exhibitsTraits, options)
        };
    }
}
