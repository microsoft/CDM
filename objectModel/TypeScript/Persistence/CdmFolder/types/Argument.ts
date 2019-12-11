import { ArgumentValue } from '../../../internal';

export abstract class Argument {
    public explanation?: string;
    public name?: string;
    public value: ArgumentValue;
}
