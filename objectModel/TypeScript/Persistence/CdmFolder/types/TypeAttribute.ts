// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AttributeResolutionGuidance, CardinalitySettings, DataTypeReference, Projection, PurposeReference, TraitGroupReference, TraitReference } from '.';

export abstract class TypeAttribute {
    public explanation?: string;
    public name: string;
    public purpose?: (string | PurposeReference);
    public dataType?: (string | DataTypeReference);
    public appliedTraits?: (string | TraitReference | TraitGroupReference)[];
    public attributeContext?: string;
    public isPrimaryKey?: boolean;
    public isReadOnly?: boolean;
    public isNullable?: boolean;
    public dataFormat?: string;
    public sourceName?: string;
    public sourceOrdering?: number;
    public displayName?: string;
    public description?: string;
    public maximumValue?: string;
    public minimumValue?: string;
    public maximumLength?: number;
    public valueConstrainedToList?: boolean;
    public defaultValue?: any;
    public resolutionGuidance? : AttributeResolutionGuidance;
    public cardinality?: CardinalitySettings;
    public projection?: Projection;
}
