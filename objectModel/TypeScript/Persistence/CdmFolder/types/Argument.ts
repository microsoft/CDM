// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ArgumentValue } from '../../../internal';
import { CdmJsonType } from './CdmJsonType';

export abstract class Argument {
    public explanation?: string;
    public name?: string;
    public value: CdmJsonType;
}
