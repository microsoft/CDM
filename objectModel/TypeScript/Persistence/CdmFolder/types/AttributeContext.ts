// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TraitReference, TraitGroupReference } from '.';

export abstract class AttributeContext {
    public explanation?: string;
    public type: string;
    public name: string;
    public parent: string;
    public definition: string;
    public appliedTraits?: (string | TraitReference | TraitGroupReference)[];
    public contents?: (string | AttributeContext)[];
    public lineage?: AttributeContext[];
}
