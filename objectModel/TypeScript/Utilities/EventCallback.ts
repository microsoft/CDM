import { cdmStatusLevel } from '../internal';

export type EventCallback = (level: cdmStatusLevel, msg: string) => void;
