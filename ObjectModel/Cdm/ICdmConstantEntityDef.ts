import { ICdmEntityRef , ICdmObjectDef , resolveOptions } from '../internal';

export interface ICdmConstantEntityDef extends ICdmObjectDef {
    getEntityShape(): ICdmEntityRef;
    setEntityShape(shape: ICdmEntityRef): ICdmEntityRef;
    getConstantValues(): string[][];
    setConstantValues(values: string[][]): string[][];
    lookupWhere(resOpt: resolveOptions, attReturn: string | number, attSearch: string | number, valueSearch: string): string;
    setWhere(resOpt: resolveOptions, attReturn: string | number, newValue: string, attSearch: string | number, valueSearch: string): string;
}
