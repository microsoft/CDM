// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TraitReference, TraitGroup } from '.';

export abstract class TraitGroupReference {
    public traitGroupReference: string | TraitGroup;
    public appliedTraits?: (string | TraitReference | TraitGroupReference)[];
    public optional?: boolean;
}
