// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeGroup,
    ConstantEntity,
    DataType,
    Entity,
    Import,
    Purpose,
    Trait
} from '.';

export abstract class DocumentContent {
    public $schema: string;
    public jsonSchemaSemanticVersion: string;
    public imports?: Import[];
    public definitions: (Trait | DataType | Purpose | AttributeGroup | Entity | ConstantEntity)[];

    /**
     * @deprecated
     */
    public schemaVersion?: string;
}
