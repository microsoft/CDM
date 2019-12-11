import { EntityReferencePersistence } from '.';
import {
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    CdmEntityReference,
    cdmObjectType,
    copyOptions,
    resolveOptions
} from '../../internal';
import {
    ConstantEntity,
    EntityReference
} from './types';

export class ConstantEntityPersistence {
    public static fromData(ctx: CdmCorpusContext, object: ConstantEntity): CdmConstantEntityDefinition {
        const constantEntity: CdmConstantEntityDefinition =
            ctx.corpus.MakeObject<CdmConstantEntityDefinition>(cdmObjectType.constantEntityDef, object.constantEntityName);
        if (object.explanation) {
            constantEntity.explanation = object.explanation;
        }
        if (object.constantValues) {
            constantEntity.constantValues = object.constantValues;
        }
        constantEntity.entityShape = EntityReferencePersistence.fromData(ctx, object.entityShape);

        return constantEntity;
    }

    public static toData(instance: CdmConstantEntityDefinition, resOpt: resolveOptions, options: copyOptions): ConstantEntity {
        return {
            explanation: instance.explanation,
            constantEntityName: instance.constantEntityName,
            entityShape: instance.entityShape ? instance.entityShape.copyData(resOpt, options) as (string | EntityReference) : undefined,
            constantValues: instance.constantValues
        };
    }
}
