import { DataTypeReference, TraitReference } from '../internal';

export interface DataType {
    explanation?: string;
    dataTypeName: string;
    extendsDataType?: string | DataTypeReference;
    exhibitsTraits?: (string | TraitReference)[];
}
