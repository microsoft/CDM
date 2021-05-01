// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Purpose, TraitGroupReference, TraitReference } from '.';

export abstract class PurposeReference {
    public purposeReference: string | Purpose;
    public appliedTraits?: (string | TraitReference | TraitGroupReference)[];
    public optional?: boolean;
}
