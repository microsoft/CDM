import { ArgumentValue, ICdmArgumentDef, ICdmObjectRef } from '../internal';

export interface ICdmTraitRef extends ICdmObjectRef {
    getArgumentDefs(): (ICdmArgumentDef)[];
    addArgument(name: string, value: ArgumentValue): ICdmArgumentDef;
    setArgumentValue(name: string, value: ArgumentValue): void;
    getArgumentValue(name: string): ArgumentValue;
}
