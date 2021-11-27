// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AttributeGroupReference } from '../AttributeGroupReference';
import { EntityAttribute } from '../EntityAttribute';
import { TypeAttribute } from '../TypeAttribute';
import { OperationBase } from './OperationBase';

/**
 * OperationAddArtifactAttribute class
 */
export abstract class OperationAddArtifactAttribute extends OperationBase {
    public newAttribute: string | AttributeGroupReference | TypeAttribute | EntityAttribute;
    public insertAtTop?: boolean;
}
