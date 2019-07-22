import { ArgumentValue } from '../internal';

export interface Argument {
    explanation?: string;
    name?: string;
    value: ArgumentValue;
}
