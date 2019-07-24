import { ICdmObject } from '../internal';

export type VisitCallback = (iObject: ICdmObject, path: string) => boolean;
