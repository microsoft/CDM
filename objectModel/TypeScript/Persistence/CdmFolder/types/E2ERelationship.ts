// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    TraitGroupReference,
    TraitReference
} from '.';

export abstract class E2ERelationship {
    public name: string;
    public fromEntity: string;
    public fromEntityAttribute: string;
    public toEntity: string;
    public toEntityAttribute: string;
    public exhibitsTraits?: (string | TraitReference | TraitGroupReference)[];
}
