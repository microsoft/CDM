// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmJsonType, DataTypeReference } from '.';

export abstract class Parameter {
    public explanation?: string;
    public name: string;
    public defaultValue?: CdmJsonType;
    public required?: boolean;
    public direction?: string;
    public dataType?: string | DataTypeReference;
}
