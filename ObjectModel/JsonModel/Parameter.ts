import { CdmJsonType, DataTypeReference } from '../internal';

export interface Parameter {
    explanation?: string;
    name: string;
    defaultValue?: CdmJsonType;
    required?: boolean;
    direction?: string;
    dataType?: string | DataTypeReference;
}
