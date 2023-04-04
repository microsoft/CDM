// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TraitGroupReference } from '../TraitGroupReference';
import { TraitReference } from '../TraitReference';
import { OperationBase } from './OperationBase';

/**
 * OperationAlterTraits class
 */
export abstract class OperationAlterTraits extends OperationBase {
    public traitsToAdd: (string | TraitReference | TraitGroupReference)[];
    public traitsToRemove: (string | TraitReference | TraitGroupReference)[];
    public argumentsContainWildcards?: boolean;
    public applyTo: any;
    public applyToTraits: any;
}
