import {
    CdmArgumentDefinition,
    CdmCorpusContext,
    cdmObjectType,
    copyOptions,
    resolveOptions
} from '../../internal';
import {
    Argument,
    CdmJsonType
} from './types';
import * as utils from './utils';

export class ArgumentPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | Argument): CdmArgumentDefinition {
        const argument: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef);

        if (typeof object === 'object' && object.value) {
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
        if (instance.value) {
            if (typeof(instance.value) === 'object' && 'copyData' in instance.value
                && typeof(instance.value.copyData) === 'function') {
                value = instance.value.copyData(resOpt, options);
            } else {
                value = instance.value;
            }
        }
        // skip the argument if just a value
        if (!instance.name) {
            return value;
        }

        return { explanation: instance.explanation, name: instance.name, value: instance.value };
    }
}
