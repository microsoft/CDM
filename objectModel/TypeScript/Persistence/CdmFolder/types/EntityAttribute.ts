// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AttributeResolutionGuidance, CardinalitySettings, EntityReferenceDefinition, Projection, PurposeReference, TraitReference, TraitGroupReference } from '.';

export abstract class EntityAttribute {
    public name: string;
    public explanation?: string;
    public description?: string;
    public displayName?: string;
    public purpose?: (string | PurposeReference);
    public isPolymorphicSource?: boolean;
    public entity: string | EntityReferenceDefinition | Projection;
    public appliedTraits?: (string | TraitReference | TraitGroupReference)[];
    public resolutionGuidance?: AttributeResolutionGuidance;
    public cardinality?: CardinalitySettings;
}
