import { CdmObject } from '../internal';

export type VisitCallback = (iObject: CdmObject, path: string) => boolean;
