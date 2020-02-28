// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    Entity,
    TraitReference
} from '.';

export abstract class EntityReference {
    public entityReference: string | Entity;
    public appliedTraits?: (string | TraitReference)[];
}
