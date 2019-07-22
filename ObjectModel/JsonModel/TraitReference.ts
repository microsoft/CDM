import { Argument, Trait } from '../internal';

export interface TraitReference {
    traitReference: string | Trait;
    // tslint:disable-next-line:no-banned-terms
    arguments?: (string | Argument)[];
}
