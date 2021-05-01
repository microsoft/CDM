// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContext,
    AttributeGroupReference,
    AttributeResolutionGuidance,
    EntityAttribute,
    EntityReferenceDefinition,
    Projection,
    TraitGroupReference,
    TraitReference,
    TypeAttribute
} from '.';

export abstract class Entity {
    public explanation?: string;
    public entityName: string;
    public extendsEntity?: (string | EntityReferenceDefinition | Projection);
    public extendsEntityResolutionGuidance: AttributeResolutionGuidance;
    public exhibitsTraits?: (string | TraitReference | TraitGroupReference)[];
    public attributeContext?: AttributeContext;
    public hasAttributes?: (string | AttributeGroupReference | TypeAttribute | EntityAttribute)[];
    public sourceName?: string;
    public displayName?: string;
    public description?: string;
    public version?: string;
    public cdmSchemas?: string[];
}
