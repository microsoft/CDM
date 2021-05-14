// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { PurposeReference, TraitGroupReference, TraitReference } from '.';

export abstract class Purpose {
    public explanation?: string;
    public purposeName: string;
    public extendsPurpose?: string | PurposeReference;
    public exhibitsTraits?: (string | TraitReference | TraitGroupReference)[];
}
