import { cdmStatusLevel } from '../internal';

export type RptCallback = (level: cdmStatusLevel, msg: string, path: string) => void;
