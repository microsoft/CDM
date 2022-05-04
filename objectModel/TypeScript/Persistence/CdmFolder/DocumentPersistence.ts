// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmConstants,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    cdmObjectType,
    CdmTraitReference,
    copyOptions,
    Logger,
    cdmLogCode,
    resolveOptions,
    CdmTraitReferenceBase,
    StringUtils
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
    private static TAG: string = DocumentPersistence.name;

    /**
     * Whether this persistence class has async methods.
     */
    public static readonly isPersistenceAsync: boolean = false;

    /**
     * The file format/extension types this persistence class supports.
     */
    public static readonly formats: string[] = [CdmConstants.cdmExtension];

    public static fromObject(ctx: CdmCorpusContext, name: string, namespace: string, path: string, object: DocumentContent): CdmDocumentDefinition {
        const document: CdmDocumentDefinition = ctx.corpus.MakeObject(cdmObjectType.documentDef, name);
        document.folderPath = path;
        document.namespace = namespace;

        if (object) {
            if (!StringUtils.isBlankByCdmStandard(object.$schema)) {
                document.schema = object.$schema;
            }
            // support old model syntax
            if (!StringUtils.isBlankByCdmStandard(object.schemaVersion)) {
                document.jsonSchemaSemanticVersion = object.schemaVersion;
            }

            if (!StringUtils.isBlankByCdmStandard(object.documentVersion)) {
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
                    } else if ('traitGroupName' in definition) {
                        document.definitions.push(CdmFolder.TraitGroupPersistence.fromData(ctx, definition));
                    } else if ('entityShape' in definition) {
                        document.definitions.push(CdmFolder.ConstantEntityPersistence.fromData(ctx, definition));
                    } else if ('entityName' in definition) {
                        document.definitions.push(CdmFolder.EntityPersistence.fromData(ctx, definition));
                    }
                }
            }
        }

        let isResolvedDoc: boolean = false;
        if (document.definitions.length === 1 && document.definitions.allItems[0].objectType == cdmObjectType.entityDef) {
            const entity: CdmEntityDefinition = document.definitions.allItems[0] as CdmEntityDefinition;
            const resolvedTrait: CdmTraitReferenceBase = entity.exhibitsTraits.item('has.entitySchemaAbstractionLevel');
            // Tries to figure out if the document is in resolved form by looking for the schema abstraction trait
            // or the presence of the attribute context.
            isResolvedDoc = resolvedTrait != null && (resolvedTrait as CdmTraitReference).arguments.allItems[0].value == 'resolved';
            isResolvedDoc = isResolvedDoc || !!entity.attributeContext;
        }

        if (!StringUtils.isBlankByCdmStandard(object.jsonSchemaSemanticVersion)) {
            document.jsonSchemaSemanticVersion = object.jsonSchemaSemanticVersion;
            if (DocumentPersistence.compareJsonSemanticVersion(ctx, document.jsonSchemaSemanticVersion) > 0) {
                if (isResolvedDoc) {
                    Logger.warning(ctx, this.TAG, this.fromObject.name, null, cdmLogCode.WarnPersistUnsupportedJsonSemVer, CdmDocumentDefinition.currentJsonSchemaSemanticVersion, document.jsonSchemaSemanticVersion);
                } else {
                    Logger.error(ctx, this.TAG, this.fromObject.name, null, cdmLogCode.ErrPersistUnsupportedJsonSemVer, CdmDocumentDefinition.currentJsonSchemaSemanticVersion, document.jsonSchemaSemanticVersion);
                }
            }
        } else {
            Logger.warning(ctx, this.TAG, this.fromObject.name, null, cdmLogCode.WarnPersistJsonSemVerMandatory);
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

    /**
     * Compares the document version with the json semantic version supported.
     * 1 => if documentSemanticVersion > jsonSemanticVersion
     * 0 => if documentSemanticVersion == jsonSemanticVersion or if documentSemanticVersion is invalid
     * -1 => if documentSemanticVersion < jsonSemanticVersion
     */
    private static compareJsonSemanticVersion(ctx: CdmCorpusContext, documentSemanticVersion: string): number {
        const docSemanticVersionSplit: number[] = documentSemanticVersion.split(".").map(x => Number(x));
        const currSemanticVersionSplit: number[] = CdmDocumentDefinition.currentJsonSchemaSemanticVersion.split(".").map(x => Number(x));

        if (docSemanticVersionSplit.length !== 3 || docSemanticVersionSplit.includes(NaN)) {
            Logger.warning(ctx, this.TAG, this.compareJsonSemanticVersion.name, null, cdmLogCode.WarnPersistJsonSemVerInvalidFormat);
            return 0;
        }

        for (let i = 0; i < 3; ++i) {
            if (docSemanticVersionSplit[i] !== currSemanticVersionSplit[i]) {
                return docSemanticVersionSplit[i] < currSemanticVersionSplit[i] ? -1 : 1;
            }
        }

        return 0;
    }
}
