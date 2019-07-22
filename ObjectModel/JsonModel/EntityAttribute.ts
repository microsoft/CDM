import { EntityReference , RelationshipReference , TraitReference } from '../internal';

export interface EntityAttribute {
    explanation?: string;
    relationship?: (string | RelationshipReference);
    name: string;
    entity: string | EntityReference;
    appliedTraits?: (string | TraitReference)[];
}
