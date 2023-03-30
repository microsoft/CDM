// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Parameter, TraitGroupReference, TraitReference } from '.';

export abstract class Trait {
    public explanation?: string;
    public traitName: string;
    public extendsTrait?: string | TraitReference;
    public hasParameters?: (string | Parameter)[];
    public elevated?: boolean;
    public modifiesAttributes?: boolean;
    public ugly?: boolean;
    public associatedProperties?: string[];
    public defaultVerb?: string | TraitReference;
    public exhibitsTraits?: (string | TraitReference | TraitGroupReference)[];
}
