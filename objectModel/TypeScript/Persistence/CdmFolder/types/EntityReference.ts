import {
    Entity,
    TraitReference
} from '.';

export abstract class EntityReference {
    public entityReference: string | Entity;
    public appliedTraits?: (string | TraitReference)[];
}
