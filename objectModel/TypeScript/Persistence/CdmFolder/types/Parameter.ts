import { CdmJsonType, DataTypeReference } from '.';

export abstract class Parameter {
    public explanation?: string;
    public name: string;
    public defaultValue?: CdmJsonType;
    public required?: boolean;
    public direction?: string;
    public dataType?: string | DataTypeReference;
}
