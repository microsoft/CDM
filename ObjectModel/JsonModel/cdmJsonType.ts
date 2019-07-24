import {
    Argument,
    AttributeContext,
    AttributeGroup,
    AttributeGroupReference,
    ConstantEntity,
    DataType,
    DataTypeReference,
    DocumentContent,
    Entity,
    EntityAttribute,
    EntityReference,
    Import,
    Parameter,
    Relationship,
    RelationshipReference,
    Trait,
    TraitReference,
    TypeAttribute
} from '../internal';

export type CdmJsonType = (
    string |
    Argument |
    AttributeContext |
    AttributeGroup |
    AttributeGroupReference |
    ConstantEntity |
    DataType |
    DataTypeReference |
    DocumentContent |
    Entity |
    EntityAttribute |
    EntityReference |
    Import |
    Parameter |
    Relationship |
    RelationshipReference |
    Trait |
    TraitReference |
    TypeAttribute);
