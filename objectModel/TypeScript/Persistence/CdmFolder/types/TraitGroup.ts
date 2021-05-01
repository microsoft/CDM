// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TraitReference, TraitGroupReference } from '.';

export abstract class TraitGroup {
    public explanation?: string;
    public traitGroupName: string;
    public exhibitsTraits: (string | TraitReference | TraitGroupReference)[];
}
