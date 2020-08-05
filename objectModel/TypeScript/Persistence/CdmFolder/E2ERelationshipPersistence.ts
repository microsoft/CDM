// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmE2ERelationship,
    cdmObjectType
} from '../../internal';
import { E2ERelationship } from './types/E2ERelationship';

export class E2ERelationshipPersistence {
    public static fromData(ctx: CdmCorpusContext, dataObj: E2ERelationship): CdmE2ERelationship {
        const relationship: CdmE2ERelationship = ctx.corpus.MakeObject<CdmE2ERelationship>(cdmObjectType.e2eRelationshipDef);
        relationship.name = dataObj.name;
        relationship.fromEntity = dataObj.fromEntity;
        relationship.fromEntityAttribute = dataObj.fromEntityAttribute;
        relationship.toEntity = dataObj.toEntity;
        relationship.toEntityAttribute = dataObj.toEntityAttribute;

        return relationship;
    }

    public static toData(instance: CdmE2ERelationship): E2ERelationship {
        return {
            name: instance.name,
            fromEntity: instance.fromEntity,
            fromEntityAttribute: instance.fromEntityAttribute,
            toEntity: instance.toEntity,
            toEntityAttribute: instance.toEntityAttribute
        };
    }
}
