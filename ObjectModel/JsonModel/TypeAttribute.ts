import { DataTypeReference, RelationshipReference, TraitReference } from '../internal';

export interface TypeAttribute {
    explanation?: string;
    name: string;
    relationship?: (string | RelationshipReference);
    dataType?: (string | DataTypeReference);
    appliedTraits?: (string | TraitReference)[];
    attributeContext?: string;
    isPrimaryKey?: boolean;
    isReadOnly?: boolean;
    isNullable?: boolean;
    dataFormat?: string;
    sourceName?: string;
    sourceOrdering?: number;
    displayName?: string;
    description?: string;
    maximumValue?: string;
    minimumValue?: string;
    maximumLength?: number;
    valueConstrainedToList?: boolean;
    defaultValue?: any;
}
