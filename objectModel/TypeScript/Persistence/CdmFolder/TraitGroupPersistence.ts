// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitGroupDefinition,
    CdmTraitReferenceBase,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import {
    TraitGroup,
    TraitGroupReference,
    TraitReference
} from './types';
import * as utils from './utils';

export class TraitGroupPersistence {
    public static fromData(ctx: CdmCorpusContext, object: TraitGroup): CdmTraitGroupDefinition {
        const traitGroup: CdmTraitGroupDefinition = ctx.corpus.MakeObject(cdmObjectType.traitGroupDef, object.traitGroupName);
        traitGroup.explanation = object.explanation;
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(traitGroup.exhibitsTraits, utils.createTraitReferenceArray(ctx, object.exhibitsTraits));

        return traitGroup;
    }

    public static toData(instance: CdmTraitGroupDefinition, resOpt: resolveOptions, options: copyOptions): TraitGroup {
        return  {
            traitGroupName: instance.traitGroupName,
            explanation: instance.explanation,
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference | TraitGroupReference>(resOpt, instance.exhibitsTraits, options)
        };
    }
}
