// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AttributeGroup, TraitGroupReference, TraitReference } from '.';

export abstract class AttributeGroupReference {
    public attributeGroupReference: string | AttributeGroup;
    public appliedTraits?: (string | TraitReference | TraitGroupReference)[];
    public optional?: boolean;
}
