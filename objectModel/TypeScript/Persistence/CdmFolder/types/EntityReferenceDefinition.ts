// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ConstantEntity,
    Entity,
    TraitGroupReference,
    TraitReference
} from '.';

export abstract class EntityReferenceDefinition {
    public entityReference: string | Entity | ConstantEntity;
    public appliedTraits?: (string | TraitReference | TraitGroupReference)[];
    public optional?: boolean;
}
