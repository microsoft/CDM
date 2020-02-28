// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { EntityReference } from '.';

export abstract class ConstantEntity {
    public explanation?: string;
    public constantEntityName?: string;
    public entityShape: string | EntityReference;
    public constantValues: string[][];
}
