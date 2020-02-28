// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    DataTypeReference,
    TraitReference
} from '.';

export abstract class DataType {
    public explanation?: string;
    public dataTypeName: string;
    public extendsDataType?: string | DataTypeReference;
    public exhibitsTraits?: (string | TraitReference)[];
}
