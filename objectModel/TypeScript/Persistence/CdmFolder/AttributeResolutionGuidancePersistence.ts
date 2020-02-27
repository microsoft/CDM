// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeResolutionGuidance,
    CdmCorpusContext,
    cdmObjectType,
    copyOptions,
    resolveOptions
} from '../../internal';
import { CdmTypeAttributeDefinition } from '../../Cdm/CdmTypeAttributeDefinition';
import {
    AttributeResolutionGuidance,
    TypeAttribute
} from './types';
import * as utils from './utils';

export class AttributeResolutionGuidancePersistence {
    /**
     * Creates an instance of attribute resolution guidance from data object.
     * @param ctx The context.
     * @param object The object to get data from.
     */
    public static fromData(ctx: CdmCorpusContext, dataObj: AttributeResolutionGuidance): CdmAttributeResolutionGuidance {
        if (!dataObj) {
            return undefined;
        }

        const newRef: CdmAttributeResolutionGuidance
            = ctx.corpus.MakeObject(cdmObjectType.attributeResolutionGuidanceDef);

        newRef.removeAttribute = dataObj.removeAttribute;
        newRef.imposedDirectives = dataObj.imposedDirectives;
        newRef.removedDirectives = dataObj.removedDirectives;
        newRef.cardinality = dataObj.cardinality;
        newRef.renameFormat = dataObj.renameFormat;
        if (dataObj.addSupportingAttribute) {
            newRef.addSupportingAttribute = utils.createAttribute(ctx, dataObj.addSupportingAttribute) as CdmTypeAttributeDefinition;
        }
        if (dataObj.expansion) {
            newRef.expansion = {};
            newRef.expansion.startingOrdinal = dataObj.expansion.startingOrdinal;
            newRef.expansion.maximumExpansion = dataObj.expansion.maximumExpansion;
            if (dataObj.expansion.countAttribute) {
                newRef.expansion.countAttribute =
                    utils.createAttribute(ctx, dataObj.expansion.countAttribute) as CdmTypeAttributeDefinition;
            }
        }
        if (dataObj.entityByReference) {
            newRef.entityByReference = {};
            newRef.entityByReference.allowReference = dataObj.entityByReference.allowReference;
            newRef.entityByReference.alwaysIncludeForeignKey = dataObj.entityByReference.alwaysIncludeForeignKey;
            newRef.entityByReference.referenceOnlyAfterDepth = dataObj.entityByReference.referenceOnlyAfterDepth;
            if (dataObj.entityByReference.foreignKeyAttribute) {
                newRef.entityByReference.foreignKeyAttribute =
                    utils.createAttribute(ctx, dataObj.entityByReference.foreignKeyAttribute) as CdmTypeAttributeDefinition;
            }
        }
        if (dataObj.selectsSubAttribute) {
            newRef.selectsSubAttribute = {};
            newRef.selectsSubAttribute.selects = dataObj.selectsSubAttribute.selects;
            if (dataObj.selectsSubAttribute.selectedTypeAttribute) {
                newRef.selectsSubAttribute.selectedTypeAttribute =
                    utils.createAttribute(ctx, dataObj.selectsSubAttribute.selectedTypeAttribute) as CdmTypeAttributeDefinition;
            }
            if (dataObj.selectsSubAttribute.selectsSomeTakeNames) {
                newRef.selectsSubAttribute.selectsSomeTakeNames = dataObj.selectsSubAttribute.selectsSomeTakeNames;
            }
            if (dataObj.selectsSubAttribute.selectsSomeAvoidNames) {
                newRef.selectsSubAttribute.selectsSomeAvoidNames = dataObj.selectsSubAttribute.selectsSomeAvoidNames;
            }
        }

        return newRef;
    }

    public static toData(instance: CdmAttributeResolutionGuidance, resOpt: resolveOptions, options: copyOptions)
        : AttributeResolutionGuidance {
        if (instance === undefined && instance === undefined) {
            return undefined;
        }
        const result: AttributeResolutionGuidance = {};
        result.removeAttribute = instance.removeAttribute;
        result.imposedDirectives = instance.imposedDirectives;
        result.removedDirectives = instance.removedDirectives;
        result.cardinality = instance.cardinality;
        result.renameFormat = instance.renameFormat;
        if (instance.addSupportingAttribute !== undefined) {
            result.addSupportingAttribute = instance.addSupportingAttribute.copyData(resOpt, options) as TypeAttribute;
        }
        if (instance.expansion !== undefined) {
            result.expansion = {};
            result.expansion.startingOrdinal = instance.expansion.startingOrdinal;
            result.expansion.maximumExpansion = instance.expansion.maximumExpansion;
            if (instance.expansion.countAttribute) {
                result.expansion.countAttribute = instance.expansion.countAttribute.copyData(resOpt, options) as TypeAttribute;
            }
        }
        if (instance.entityByReference !== undefined) {
            result.entityByReference = {};
            result.entityByReference.allowReference = instance.entityByReference.allowReference;
            result.entityByReference.alwaysIncludeForeignKey = instance.entityByReference.alwaysIncludeForeignKey;
            result.entityByReference.referenceOnlyAfterDepth = instance.entityByReference.referenceOnlyAfterDepth;
            if (instance.entityByReference.foreignKeyAttribute) {
                result.entityByReference.foreignKeyAttribute =
                    instance.entityByReference.foreignKeyAttribute.copyData(resOpt, options) as TypeAttribute;
            }
        }
        if (instance.selectsSubAttribute !== undefined) {
            result.selectsSubAttribute = {};
            result.selectsSubAttribute.selects = instance.selectsSubAttribute.selects;
            if (instance.selectsSubAttribute.selectedTypeAttribute) {
                result.selectsSubAttribute.selectedTypeAttribute =
                    instance.selectsSubAttribute.selectedTypeAttribute.copyData(resOpt, options) as TypeAttribute;
            }
            if (instance.selectsSubAttribute.selectsSomeTakeNames) {
                result.selectsSubAttribute.selectsSomeTakeNames = instance.selectsSubAttribute.selectsSomeTakeNames;
            }
            if (instance.selectsSubAttribute.selectsSomeAvoidNames) {
                result.selectsSubAttribute.selectsSomeAvoidNames = instance.selectsSubAttribute.selectsSomeAvoidNames;
            }
        }

        return result;
    }
}
