import { TraitReference } from '../internal';

export interface AttributeContext {
    explanation?: string;
    type: string;
    name: string;
    parent: string;
    definition: string;
    appliedTraits?: (string | TraitReference)[];
    contents?: (string | AttributeContext)[];
}
