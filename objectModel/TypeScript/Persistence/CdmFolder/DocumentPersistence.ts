// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmConstants,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmFolderDefinition,
    cdmObjectType,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
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

export class DocumentPersistence {
    // Whether this persistence class has async methods.
    public static readonly isPersistenceAsync: boolean = false;

    // The file format/extension types this persistence class supports.
    public static readonly formats: string[] = [CdmConstants.cdmExtension];

    public static fromObject(ctx: CdmCorpusContext, name: string, namespace: string, path: string, object: DocumentContent): CdmDocumentDefinition {
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
            if (document.jsonSchemaSemanticVersion !== '0.9.0' && document.jsonSchemaSemanticVersion !== '1.0.0') {
                // tslint:disable-next-line:no-suspicious-comment
                // TODO: validate that this is a version we can understand with the OM
            }

            if (object.documentVersion) {
                document.documentVersion = object.documentVersion;
            }

            if (object.imports) {
                for (const importObj of object.imports) {
                    document.imports.push(CdmFolder.ImportPersistence.fromData(ctx, importObj));
                }
            }
            if (object.definitions && Array.isArray(object.definitions)) {
                for (const definition of object.definitions) {
                    if ('dataTypeName' in definition) {
                        document.definitions.push(CdmFolder.DataTypePersistence.fromData(ctx, definition));
                    } else if ('purposeName' in definition) {
                        document.definitions.push(CdmFolder.PurposePersistence.fromData(ctx, definition));
                    } else if ('attributeGroupName' in definition) {
                        document.definitions.push(CdmFolder.AttributeGroupPersistence.fromData(ctx, definition));
                    } else if ('traitName' in definition) {
                        document.definitions.push(CdmFolder.TraitPersistence.fromData(ctx, definition));
                    } else if ('entityShape' in definition) {
                        document.definitions.push(CdmFolder.ConstantEntityPersistence.fromData(ctx, definition));
                    } else if ('entityName' in definition) {
                        document.definitions.push(CdmFolder.EntityPersistence.fromData(ctx, definition));
                    }
                }
            }
        }

        return document;
    }

    public static fromData(ctx: CdmCorpusContext, docName: string, jsonData: string, folder: CdmFolderDefinition): CdmDocumentDefinition {
        const obj = JSON.parse(jsonData);

        return DocumentPersistence.fromObject(ctx, docName, folder.namespace, folder.folderPath, obj);
    }

    public static toData(instance: CdmDocumentDefinition, resOpt: resolveOptions, options: copyOptions): DocumentContent {
        return {
            $schema: instance.schema,
            jsonSchemaSemanticVersion: instance.jsonSchemaSemanticVersion,
            imports: copyDataUtils.arrayCopyData<Import>(resOpt, instance.imports, options),
            definitions: copyDataUtils.arrayCopyData<Trait | DataType | Purpose | AttributeGroup | Entity | ConstantEntity>(
                resOpt, instance.definitions, options),
            documentVersion: instance.documentVersion
        };
    }
}
