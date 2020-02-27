// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmCorpusContext,
    CdmDataTypeDefinition,
    cdmObjectType,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
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
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits, options)
        };
    }
}
