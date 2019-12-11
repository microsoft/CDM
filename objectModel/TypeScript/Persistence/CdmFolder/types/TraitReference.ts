import { Argument, Trait } from '.';

export abstract class TraitReference {
    public traitReference: string | Trait;
    // tslint:disable-next-line:no-banned-terms
    public arguments?: (string | Argument)[];
}
