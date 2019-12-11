import { Parameter, TraitReference } from '.';

export abstract class Trait {
    public explanation?: string;
    public traitName: string;
    public extendsTrait?: string | TraitReference;
    public hasParameters?: (string | Parameter)[];
    public elevated?: boolean;
    public modifiesAttributes?: boolean;
    public ugly?: boolean;
    public associatedProperties?: string[];
}
