// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { MetadataObject } from './MetadataObject';

/**
 * Describes how entities are connected.
 */
export abstract class Relationship extends MetadataObject {
    public $type : string;
}
