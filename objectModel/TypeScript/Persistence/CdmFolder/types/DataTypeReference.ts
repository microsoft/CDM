import {
    DataType,
    TraitReference
} from '.';

export abstract class DataTypeReference {
    public dataTypeReference: string | DataType;
    public appliedTraits?: (string | TraitReference)[];
}
