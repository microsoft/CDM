// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmParameterDefinition,
    copyOptions,
    resolveOptions
} from '../../internal';
import { CdmFolder } from '..';
import {
    CdmJsonType,
    DataTypeReference,
    Parameter
} from './types';
import * as utils from './utils';

export class ParameterPersistence {
    public static fromData(ctx: CdmCorpusContext, object: Parameter): CdmParameterDefinition {
        const parameter: CdmParameterDefinition = ctx.corpus.MakeObject(cdmObjectType.parameterDef, object.name);
        parameter.explanation = object.explanation;
        parameter.required = object.required ? object.required : false;
        parameter.defaultValue = utils.createConstant(ctx, object.defaultValue);
        parameter.dataTypeRef = CdmFolder.DataTypeReferencePersistence.fromData(ctx, object.dataType);

        return parameter;
    }
    public static toData(instance: CdmParameterDefinition, resOpt: resolveOptions, options: copyOptions): Parameter {
        let defVal: CdmJsonType;
        if (instance.defaultValue) {
            if (typeof (instance.defaultValue) === 'object' && 'copyData' in instance.defaultValue
                && typeof (instance.defaultValue.copyData) === 'function') {
                defVal = instance.defaultValue.copyData(resOpt, options);
            } else if (typeof (instance.defaultValue) === 'object' && typeof (instance.defaultValue) === 'string') {
                defVal = instance.defaultValue;
            }
        }

        const result: Parameter = {
            name: instance.name,
            dataType: instance.dataTypeRef ? instance.dataTypeRef.copyData(resOpt, options) as (string | DataTypeReference) : undefined
        };

        if (instance.explanation !== undefined) {
            result.explanation = instance.explanation;
        }

        if (instance.defaultValue !== undefined) {
            result.defaultValue = defVal;
        }

        if (instance.required !== undefined) {
            result.required = instance.required;
        }

        return result;
    }
}
