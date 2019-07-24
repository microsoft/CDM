import { ArgumentValue , ICdmObject , ICdmParameterDef } from '../internal';

export interface ICdmArgumentDef extends ICdmObject {
    getExplanation(): string;
    setExplanation(explanation: string): string;
    getValue(): ArgumentValue;
    getName(): string;
    getParameterDef(): ICdmParameterDef;
    setValue(value: ArgumentValue): void;
}
