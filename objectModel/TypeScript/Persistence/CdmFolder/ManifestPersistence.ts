// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmConstants,
    CdmCorpusContext,
    CdmE2ERelationship,
    CdmEntityDeclarationDefinition,
    CdmFolderDefinition,
    CdmImport,
    CdmManifestDefinition,
    cdmObjectType,
    cdmLogCode,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import { Logger } from '../../Utilities/Logging/Logger';
import * as timeUtils from '../../Utilities/timeUtils';
import { AttributeGroupPersistence } from './AttributeGroupPersistence';
import { ConstantEntityPersistence } from './ConstantEntityPersistence';
import { DataTypePersistence } from './DataTypePersistence';
import { DocumentPersistence } from './DocumentPersistence';
import { E2ERelationshipPersistence } from './E2ERelationshipPersistence';
import { EntityPersistence } from './EntityPersistence';
import { ImportPersistence } from './ImportPersistence';
import { LocalEntityDeclarationPersistence } from './LocalEntityDeclarationPersistence';
import { ManifestDeclarationPersistence } from './ManifestDeclarationPersistence';
import { PurposePersistence } from './PurposePersistence';
import { ReferencedEntityDeclarationPersistence } from './ReferencedEntityDeclarationPersistence';
import { TraitPersistence } from './TraitPersistence';
import {
    EntityDeclarationDefinition,
    entityDeclarationDefinitionType,
    ManifestContent,
    ManifestDeclaration,
    TraitReference
} from './types';
import * as utils from './utils';

export class ManifestPersistence {
    private static TAG: string = ManifestPersistence.name;

    // Whether this persistence class has async methods.
    public static readonly isPersistenceAsync: boolean = false;

    // The file format/extension types this persistence class supports.
    public static readonly formats: string[] = [CdmConstants.manifestExtension, CdmConstants.folioExtension];

    public static fromObject(
        ctx: CdmCorpusContext,
        name: string,
        namespace: string,
        path: string,
        dataObj: ManifestContent
    ): CdmManifestDefinition {
        // Determine name of the manifest
        let manifestName: string;
        if (dataObj) {
            manifestName = dataObj.manifestName ? dataObj.manifestName : dataObj.folioName;
        }
        // We haven't found the name in the file, use one provided in the call but without the suffixes
        if (!manifestName && name) {
            manifestName = name.replace(CdmConstants.manifestExtension, '')
                .replace(CdmConstants.folioExtension, '');
        }
        const manifest: CdmManifestDefinition = ctx.corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, manifestName);
        // this is the document name which is assumed by constructor to be related to the the manifestName, but may not be
        manifest.name = name;
        manifest.folderPath = path;
        manifest.namespace = namespace;

        if (dataObj) {
            if (dataObj.explanation) {
                manifest.explanation = dataObj.explanation;
            }
            if (dataObj.$schema) {
                manifest.schema = dataObj.$schema;
            }
            // support old model syntax
            if (dataObj.schemaVersion) {
                manifest.jsonSchemaSemanticVersion = dataObj.schemaVersion;
            }
            if (dataObj.jsonSchemaSemanticVersion) {
                manifest.jsonSchemaSemanticVersion = dataObj.jsonSchemaSemanticVersion;
            }
            if (manifest.jsonSchemaSemanticVersion !== '1.0.0') {
                // tslint:disable-next-line:no-suspicious-comment
                // TODO: validate that this is a version we can understand with the OM
            }

            if (dataObj.documentVersion) {
                manifest.documentVersion = dataObj.documentVersion;
            }

            if (dataObj.manifestName) {
                manifest.manifestName = dataObj.manifestName;
                // Might be populated in the case of folio.cdm.json or manifest.cdm.json file.
            } else if (dataObj.folioName) {
                manifest.manifestName = dataObj.folioName;
            }

            if (dataObj.imports) {
                for (const importObj of dataObj.imports) {
                    manifest.imports.push(ImportPersistence.fromData(ctx, importObj));
                }
            }
            if (dataObj.definitions && Array.isArray(dataObj.definitions)) {
                for (const definition of dataObj.definitions) {
                    if ('dataTypeName' in definition) {
                        manifest.definitions.push(DataTypePersistence.fromData(ctx, definition));
                    } else if ('purposeName' in definition) {
                        manifest.definitions.push(PurposePersistence.fromData(ctx, definition));
                    } else if ('attributeGroupName' in definition) {
                        manifest.definitions.push(AttributeGroupPersistence.fromData(ctx, definition));
                    } else if ('traitName' in definition) {
                        manifest.definitions.push(TraitPersistence.fromData(ctx, definition));
                    } else if ('entityShape' in definition) {
                        manifest.definitions.push(ConstantEntityPersistence.fromData(ctx, definition));
                    } else if ('entityName' in definition) {
                        manifest.definitions.push(EntityPersistence.fromData(ctx, definition));
                    }
                }
            }

            if (dataObj.lastFileStatusCheckTime) {
                manifest.lastFileStatusCheckTime = new Date(dataObj.lastFileStatusCheckTime);
            }

            if (dataObj.lastFileModifiedTime) {
                manifest.lastFileModifiedTime = new Date(dataObj.lastFileModifiedTime);
            }

            if (dataObj.lastChildFileModifiedTime) {
                manifest.lastChildFileModifiedTime = new Date(dataObj.lastChildFileModifiedTime);
            }

            utils.addArrayToCdmCollection<CdmTraitReference>(
                    manifest.exhibitsTraits,
                    utils.createTraitReferenceArray(ctx, dataObj.exhibitsTraits)
            );

            if (dataObj.entities) {
                const fullPath: string = `${namespace ? `${namespace}:${path}` : path}`;
                for (const entityObj of dataObj.entities) {
                    let entity: CdmEntityDeclarationDefinition;
                    if (entityObj.type) {
                        if (entityObj.type === entityDeclarationDefinitionType.localEntity) {
                            entity = LocalEntityDeclarationPersistence.fromData(ctx, fullPath, entityObj);
                        } else if (entityObj.type === entityDeclarationDefinitionType.referencedEntity) {
                            entity = ReferencedEntityDeclarationPersistence.fromData(ctx, fullPath, entityObj);
                        } else {
                            Logger.error(ctx, this.TAG, this.fromObject.name, null, cdmLogCode.ErrPersistEntityDeclarationMissing);
                        }
                    } else {
                        // We see old structure of entity declaration, check for entity schema/declaration.
                        if (entityObj.entitySchema) {
                            // Local entity declaration used to use entity schema.
                            entity = LocalEntityDeclarationPersistence.fromData(ctx, fullPath, entityObj);
                        } else {
                            // While referenced entity declaration used to use entity declaration.
                            entity = ReferencedEntityDeclarationPersistence.fromData(ctx, fullPath, entityObj);
                        }
                    }
                    manifest.entities.push(entity);
                }
            }

            if (dataObj.relationships) {
                for (const rel of dataObj.relationships) {
                    manifest.relationships.push(E2ERelationshipPersistence.fromData(ctx, rel));
                }
            }

            if (dataObj.subManifests) {
                for (const subManifest of dataObj.subManifests) {
                    manifest.subManifests.push(ManifestDeclarationPersistence.fromData(ctx, subManifest));
                }
                // Might be populated in the case of folio.cdm.json or manifest.cdm.json file.
            } else if (dataObj.subFolios) {
                for (const subFolio of dataObj.subFolios) {
                    manifest.subManifests.push(ManifestDeclarationPersistence.fromData(ctx, subFolio));
                }
            }
        }

        return manifest;
    }

    public static fromData(ctx: CdmCorpusContext, docName: string, jsonData: string, folder: CdmFolderDefinition): CdmManifestDefinition {
        const dataObj = JSON.parse(jsonData);

        return ManifestPersistence.fromObject(ctx, docName, folder.namespace, folder.folderPath, dataObj);
    }

    public static toData(instance: CdmManifestDefinition, resOpt: resolveOptions, options: copyOptions): ManifestContent {
        const manifestContent: ManifestContent = DocumentPersistence.toData(instance, resOpt, options) as ManifestContent;

        manifestContent.manifestName = instance.manifestName;
        manifestContent.lastFileStatusCheckTime = timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime);
        manifestContent.lastFileModifiedTime = timeUtils.getFormattedDateString(instance.lastFileModifiedTime);
        manifestContent.lastChildFileModifiedTime = timeUtils.getFormattedDateString(instance.lastChildFileModifiedTime);
        manifestContent.documentVersion = instance.documentVersion;
        manifestContent.explanation = instance.explanation;
        manifestContent.exhibitsTraits = copyDataUtils.arrayCopyData<TraitReference>(
            resOpt,
            instance.exhibitsTraits.allItems,
            options);
        manifestContent.entities = copyDataUtils.arrayCopyData<EntityDeclarationDefinition>(
            resOpt,
            instance.entities,
            options
        );

        manifestContent.subManifests = copyDataUtils.arrayCopyData<ManifestDeclaration>(resOpt, instance.subManifests, options);

        if (instance.imports && instance.imports.length > 0) {
            manifestContent.imports = [];
            instance.imports.allItems.forEach((importDoc: CdmImport) => {
                manifestContent.imports.push(ImportPersistence.toData(importDoc, new resolveOptions(), {}));
            });
        }

        if (instance.relationships && instance.relationships.length > 0) {
            manifestContent.relationships = instance.relationships.allItems.map((relationship: CdmE2ERelationship) => {
                return E2ERelationshipPersistence.toData(relationship, resOpt, options);
            });
        }

        return manifestContent;
    }
}
