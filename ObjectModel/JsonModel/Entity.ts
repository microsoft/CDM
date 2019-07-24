import { AttributeContext, AttributeGroupReference, EntityAttribute, EntityReference, TraitReference, TypeAttribute } from '../internal';

export interface Entity {
    explanation?: string;
    entityName: string;
    extendsEntity?: string | EntityReference;
    exhibitsTraits?: (string | TraitReference)[];
    attributeContext?: AttributeContext;
    hasAttributes?: (string | AttributeGroupReference | TypeAttribute | EntityAttribute)[];
    sourceName?: string;
    displayName?: string;
    description?: string;
    version?: string;
    cdmSchemas?: string[];
}
