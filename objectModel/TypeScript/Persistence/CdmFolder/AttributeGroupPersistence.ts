// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmAttributeGroupDefinition,
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitReferenceBase,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import { identifierRef } from '../../Utilities/identifierRef';
import {
    AttributeGroup,
    AttributeGroupReference,
    EntityAttribute,
    TraitReference,
    TypeAttribute
} from './types';
import * as utils from './utils';

export class AttributeGroupPersistence {
    public static fromData(ctx: CdmCorpusContext, object: AttributeGroup, entityName?: string): CdmAttributeGroupDefinition {
        const attributeGroup: CdmAttributeGroupDefinition =
            ctx.corpus.MakeObject(cdmObjectType.attributeGroupDef, object.attributeGroupName);

        if (object.explanation) {
            attributeGroup.explanation = object.explanation;
        }
        attributeGroup.attributeContext = CdmFolder.AttributeContextReferencePersistence.fromData(ctx, object.attributeContext as string);
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(
            attributeGroup.exhibitsTraits,
            utils.createTraitReferenceArray(ctx, object.exhibitsTraits)
        );
        if (object.members) {
            for (const att of object.members) {
                attributeGroup.members.push(utils.createAttribute(ctx, att, entityName));
            }
        }

        return attributeGroup;
    }

    public static toData(instance: CdmAttributeGroupDefinition, resOpt: resolveOptions, options: copyOptions): AttributeGroup {
        return {
            explanation: instance.explanation,
            attributeGroupName: instance.attributeGroupName,
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits.allItems, options),
            attributeContext: instance.
                attributeContext ? instance.attributeContext.copyData(resOpt, options) as (string | identifierRef) : undefined,
            members: copyDataUtils.
                arrayCopyData<string | AttributeGroupReference | TypeAttribute | EntityAttribute>(resOpt, instance.members, options) || []
        };
    }
}
