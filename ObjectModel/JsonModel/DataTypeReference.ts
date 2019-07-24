import { DataType, TraitReference } from '../internal';

export interface DataTypeReference {
    dataTypeReference: string | DataType;
    appliedTraits?: (string | TraitReference)[];
}
