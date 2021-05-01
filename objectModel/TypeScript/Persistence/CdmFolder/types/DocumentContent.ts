// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeGroup,
    ConstantEntity,
    DataType,
    Entity,
    Import,
    Purpose,
    Trait,
    TraitGroup
} from '.';

export abstract class DocumentContent {
    public $schema: string;
    public jsonSchemaSemanticVersion: string;
    public imports?: Import[];
    public definitions: (Trait | TraitGroup | DataType | Purpose | AttributeGroup | Entity | ConstantEntity)[];
    public documentVersion: string;

    /**
     * @deprecated
     */
    public schemaVersion?: string;
}
