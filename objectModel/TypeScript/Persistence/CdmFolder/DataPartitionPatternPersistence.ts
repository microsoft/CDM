import {
    CdmCorpusContext,
    cdmObjectType,
    copyOptions,
    CdmDataPartitionPatternDefinition,
    CdmTraitReference,
    resolveOptions
} from '../../internal';
import * as timeUtils from '../../Utilities/timeUtils';
import {
    DataPartitionPattern,
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
        if (dataObj.exhibitsTraits) {
            utils.addArrayToCdmCollection<CdmTraitReference>(newPattern.exhibitsTraits, utils.createTraitReferenceArray(ctx, dataObj.exhibitsTraits));
        }

        return newPattern;
    }

    public static toData(instance: CdmDataPartitionPatternDefinition, resOpt: resolveOptions, options: copyOptions): DataPartitionPattern {
        return {
            name: instance.name,
            lastFileStatusCheckTime: timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime),
            lastFileModifiedTime: timeUtils.getFormattedDateString(instance.lastFileModifiedTime),
            explanation: instance.explanation,
            rootLocation: instance.rootLocation,
            regularExpression: instance.regularExpression,
            parameters: instance.parameters,
            specializedSchema: instance.specializedSchema,
            exhibitsTraits: utils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits, options)
        };
    }
}
