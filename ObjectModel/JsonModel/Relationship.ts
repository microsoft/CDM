import { RelationshipReference, TraitReference } from '../internal';

export interface Relationship {
    explanation?: string;
    relationshipName: string;
    extendsRelationship?: string | RelationshipReference;
    exhibitsTraits?: (string | TraitReference)[];
}
