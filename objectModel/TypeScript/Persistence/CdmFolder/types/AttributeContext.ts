import { TraitReference } from '.';

export abstract class AttributeContext {
    public explanation?: string;
    public type: string;
    public name: string;
    public parent: string;
    public definition: string;
    public appliedTraits?: (string | TraitReference)[];
    public contents?: (string | AttributeContext)[];
}
