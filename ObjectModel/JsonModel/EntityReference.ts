import { Entity, TraitReference } from '../internal';

export interface EntityReference {
    entityReference: string | Entity;
    appliedTraits?: (string | TraitReference)[];
}
