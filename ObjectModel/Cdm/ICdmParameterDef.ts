import { ArgumentValue , ICdmDataTypeRef , ICdmObject } from '../internal';

export interface ICdmParameterDef extends ICdmObject {
    explanation: string;
    name: string;
    defaultValue: ArgumentValue;
    required: boolean;
    direction: string;
    dataTypeRef: ICdmDataTypeRef;
    getExplanation(): string;
    getName(): string;
    getDefaultValue(): ArgumentValue;
    getRequired(): boolean;
    getDirection(): string;
    getDataTypeRef(): ICdmDataTypeRef;
}
