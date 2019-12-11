import {
    AttributeGroupPersistence,
    ConstantEntityPersistence,
    DataTypePersistence,
    EntityPersistence,
    ImportPersistence,
    PurposePersistence,
    TraitPersistence
} from '.';
import {
    CdmCorpusContext,
    CdmDocumentDefinition,
    cdmObjectType,
    copyOptions,
    resolveOptions
} from '../../internal';
import {
    AttributeGroup,
    ConstantEntity,
    DataType,
    DocumentContent,
    Entity,
    Import,
    Purpose,
    Trait
} from './types';
import * as utils from './utils';

export class DocumentPersistence {
    public static fromData(ctx: CdmCorpusContext, name: string, namespace: string, path: string, object: DocumentContent): CdmDocumentDefinition {
        const document: CdmDocumentDefinition = ctx.corpus.MakeObject(cdmObjectType.documentDef, name);
        document.folderPath = path;
        document.namespace = namespace;

        if (object) {
            if (object.$schema) {
                document.schema = object.$schema;
            }
            // support old model syntax
            if (object.schemaVersion) {
                document.jsonSchemaSemanticVersion = object.schemaVersion;
            }
            if (object.jsonSchemaSemanticVersion) {
                document.jsonSchemaSemanticVersion = object.jsonSchemaSemanticVersion;
            }
            if (document.jsonSchemaSemanticVersion !== '0.9.0') {
                // tslint:disable-next-line:no-suspicious-comment
                // TODO: validate that this is a version we can understand with the OM
            }

            if (object.imports) {
                for (const importObj of object.imports) {
                    document.imports.push(ImportPersistence.fromData(ctx, importObj));
                }
            }
            if (object.definitions && Array.isArray(object.definitions)) {
                for (const definition of object.definitions) {
                    if ('dataTypeName' in definition) {
                        document.definitions.push(DataTypePersistence.fromData(ctx, definition));
                    } else if ('purposeName' in definition) {
                        document.definitions.push(PurposePersistence.fromData(ctx, definition));
                    } else if ('attributeGroupName' in definition) {
                        document.definitions.push(AttributeGroupPersistence.fromData(ctx, definition));
                    } else if ('traitName' in definition) {
                        document.definitions.push(TraitPersistence.fromData(ctx, definition));
                    } else if ('entityShape' in definition) {
                        document.definitions.push(ConstantEntityPersistence.fromData(ctx, definition));
                    } else if ('entityName' in definition) {
                        document.definitions.push(EntityPersistence.fromData(ctx, definition));
                    }
                }
            }
        }

        return document;
    }
    public static toData(instance: CdmDocumentDefinition, resOpt: resolveOptions, options: copyOptions): DocumentContent {
        return {
            $schema: instance.schema,
            jsonSchemaSemanticVersion: instance.jsonSchemaSemanticVersion,
            imports: utils.arrayCopyData<Import>(resOpt, instance.imports, options),
            definitions: utils.arrayCopyData<Trait | DataType | Purpose | AttributeGroup | Entity | ConstantEntity>(
                resOpt, instance.definitions, options)
        };
    }
}
