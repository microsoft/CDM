// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Argument, Trait, TraitGroupReference } from '.';

export abstract class TraitReference {
    public traitReference: string | Trait;
    // tslint:disable-next-line:no-banned-terms
    public arguments?: (string | Argument)[];
    public appliedTraits?: (string | TraitReference | TraitGroupReference)[];
    public optional?: boolean;
    public verb?: string | TraitReference;
}
