// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmE2ERelationship,
    cdmObjectType,
    CdmTraitReferenceBase,
    copyOptions,
    resolveOptions,
    StringUtils
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import { TraitGroupReference } from './types';
import { E2ERelationship } from './types/E2ERelationship';
import { TraitReference } from './types/TraitReference';
import * as utils from './utils';

export class E2ERelationshipPersistence {
    public static fromData(ctx: CdmCorpusContext, dataObj: E2ERelationship): CdmE2ERelationship {
        const relationship: CdmE2ERelationship = ctx.corpus.MakeObject<CdmE2ERelationship>(cdmObjectType.e2eRelationshipDef);
        if (!StringUtils.isNullOrWhiteSpace(dataObj.name)) {
            relationship.name = dataObj.name;
        }
        relationship.fromEntity = dataObj.fromEntity;
        relationship.fromEntityAttribute = dataObj.fromEntityAttribute;
        relationship.toEntity = dataObj.toEntity;
        relationship.toEntityAttribute = dataObj.toEntityAttribute;
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(relationship.exhibitsTraits, utils.createTraitReferenceArray(ctx, dataObj.exhibitsTraits));

        return relationship;
    }

    public static toData(instance: CdmE2ERelationship, resOpt: resolveOptions, options: copyOptions): E2ERelationship {
        return {
            name: !StringUtils.isNullOrWhiteSpace(instance.name) ? instance.name : undefined,
            fromEntity: instance.fromEntity,
            fromEntityAttribute: instance.fromEntityAttribute,
            toEntity: instance.toEntity,
            toEntityAttribute: instance.toEntityAttribute,
            exhibitsTraits: copyDataUtils.arrayCopyData<string | TraitReference | TraitGroupReference>(resOpt, instance.exhibitsTraits, options)
        };
    }
}
