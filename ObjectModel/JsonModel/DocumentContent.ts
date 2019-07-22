import { AttributeGroup, ConstantEntity, DataType, Entity, Import, Relationship, Trait } from '../internal';

export interface DocumentContent {
    schema: string;
    jsonSchemaSemanticVersion: string;
    imports?: Import[];
    definitions: (Trait | DataType | Relationship | AttributeGroup | Entity | ConstantEntity)[];
}
