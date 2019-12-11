import {
    DataTypeReference,
    TraitReference
} from '.';

export abstract class DataType {
    public explanation?: string;
    public dataTypeName: string;
    public extendsDataType?: string | DataTypeReference;
    public exhibitsTraits?: (string | TraitReference)[];
}
