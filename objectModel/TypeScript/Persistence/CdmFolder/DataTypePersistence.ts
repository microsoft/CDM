import {
    CdmCorpusContext,
    CdmDataTypeDefinition,
    cdmObjectType,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../internal';
import { CdmFolder } from '..';
import {
    DataType,
    DataTypeReference,
    TraitReference
} from './types';
import * as utils from './utils';

export class DataTypePersistence {
    public static fromData(ctx: CdmCorpusContext, object: DataType): CdmDataTypeDefinition {
        const dataType: CdmDataTypeDefinition = ctx.corpus.MakeObject(cdmObjectType.dataTypeDef, object.dataTypeName);
        dataType.extendsDataType = CdmFolder.DataTypeReferencePersistence.fromData(ctx, object.extendsDataType);
        if (object.explanation) {
            dataType.explanation = object.explanation;
        }
        utils.addArrayToCdmCollection<CdmTraitReference>(
            dataType.exhibitsTraits,
            utils.createTraitReferenceArray(ctx, object.exhibitsTraits)
        );

        return dataType;
    }
    public static toData(instance: CdmDataTypeDefinition, resOpt: resolveOptions, options: copyOptions): DataType {
        return {
            explanation: instance.explanation,
            dataTypeName: instance.dataTypeName,
            extendsDataType: instance.extendsDataType
                ? instance.extendsDataType.copyData(resOpt, options) as (string | DataTypeReference)
                : undefined,
            exhibitsTraits: utils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits, options)
        };
    }
}
