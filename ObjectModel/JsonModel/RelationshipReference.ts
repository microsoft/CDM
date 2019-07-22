import { Relationship, TraitReference } from '../internal';

export interface RelationshipReference {
    relationshipReference: string | Relationship;
    appliedTraits?: (string | TraitReference)[];
}
