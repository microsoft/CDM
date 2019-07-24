import { Parameter, TraitReference } from '../internal';

export interface Trait {
    explanation?: string;
    traitName: string;
    extendsTrait?: string | TraitReference;
    hasParameters?: (string | Parameter)[];
    elevated?: boolean;
    modifiesAttributes?: boolean;
    ugly?: boolean;
    associatedProperties?: string[];
}
