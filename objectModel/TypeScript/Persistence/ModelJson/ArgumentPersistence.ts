import { CdmArgumentDefinition, CdmCorpusContext, cdmObjectType, copyOptions, resolveOptions } from '../../internal';
import { Annotation } from './types';

export class ArgumentPersistence {
    public static async fromData(ctx: CdmCorpusContext, object: Annotation): Promise<CdmArgumentDefinition> {
        const arg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, object.name);

        arg.name = object.name;
        arg.value = object.value;

        return arg;
    }

    public static async toData(instance: CdmArgumentDefinition, resOpt: resolveOptions, options: copyOptions): Promise<Annotation> {
        if (typeof instance.value === 'string') {
            return {
                name: instance.name,
                value: instance.value
            };
        }
    }
}
