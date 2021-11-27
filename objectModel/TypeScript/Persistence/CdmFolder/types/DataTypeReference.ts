// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    DataType,
    TraitGroupReference,
    TraitReference
} from '.';

export abstract class DataTypeReference {
    public dataTypeReference: string | DataType;
    public appliedTraits?: (string | TraitReference | TraitGroupReference)[];
    public optional?: boolean;
}
