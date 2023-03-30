// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmArgumentDefinition,
    CdmCorpusContext,
    cdmObjectType,
    copyOptions,
    resolveOptions,
    StringUtils
} from '../../internal';
import {
    Argument,
    CdmJsonType
} from './types';
import * as utils from './utils';

export class ArgumentPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | Argument): CdmArgumentDefinition {
        const argument: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef);
        
        // must use `object !== undefined` here, since when object is null, null !== undefined => false but null !== undefined => true
        if (typeof object === 'object' && object !== undefined && object.value !== undefined) {
            argument.value = utils.createConstant(ctx, object.value as CdmJsonType);
            if (object.name) {
                argument.name = object.name;
            }
            if (object.explanation) {
                argument.explanation = object.explanation;
            }
        } else {
            // not a structured argument, just a thing. try it
            argument.value = utils.createConstant(ctx, object);
        }

        return argument;
    }

    public static toData(instance: CdmArgumentDefinition, resOpt: resolveOptions, options: copyOptions): CdmJsonType {
        let value: CdmJsonType;
        if (instance.value !== undefined) {
            if (typeof(instance.value) === 'object' && 'copyData' in instance.value
                && typeof(instance.value.copyData) === 'function') {
                value = instance.value.copyData(resOpt, options);
            } else {
                value = instance.value;
            }
        }
        // skip the argument if just a value
        if (StringUtils.isBlankByCdmStandard(instance.name)) {
            return value;
        }

        return { explanation: instance.explanation, name: instance.name, value: value };
    }
}
