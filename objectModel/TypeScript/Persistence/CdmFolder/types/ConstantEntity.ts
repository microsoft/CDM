// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { EntityReferenceDefinition } from '.';

export abstract class ConstantEntity {
    public explanation?: string;
    public constantEntityName?: string;
    public entityShape: string | EntityReferenceDefinition;
    public constantValues: string[][];
}
