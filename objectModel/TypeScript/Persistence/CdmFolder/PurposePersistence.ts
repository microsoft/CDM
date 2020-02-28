// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmCorpusContext,
    cdmObjectType,
    CdmPurposeDefinition,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import {
    Purpose,
    PurposeReference,
    TraitReference
} from './types';
import * as utils from './utils';

export class PurposePersistence {
    public static fromData(ctx: CdmCorpusContext, object: Purpose): CdmPurposeDefinition {
        const purpose: CdmPurposeDefinition = ctx.corpus.MakeObject(cdmObjectType.purposeDef, object.purposeName);
        purpose.extendsPurpose = CdmFolder.PurposeReferencePersistence.fromData(ctx, object.extendsPurpose);
        if (object.explanation) {
            purpose.explanation = object.explanation;
        }
        utils.addArrayToCdmCollection<CdmTraitReference>(
            purpose.exhibitsTraits,
            utils.createTraitReferenceArray(ctx, object.exhibitsTraits)
        );

        return purpose;
    }
    public static toData(instance: CdmPurposeDefinition, resOpt: resolveOptions, options: copyOptions): Purpose {
        return {
            explanation: instance.explanation,
            purposeName: instance.purposeName,
            extendsPurpose: instance.extendsPurpose
                ? instance.extendsPurpose.copyData(resOpt, options) as object as PurposeReference : undefined,
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits.allItems, options)
        };
    }
}
