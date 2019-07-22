import { ICdmObject } from '../internal';

export interface ICdmImport extends ICdmObject {
    corpusPath: string;
    moniker?: string;
}
