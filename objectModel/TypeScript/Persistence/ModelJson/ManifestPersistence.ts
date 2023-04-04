// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Guid } from 'guid-typescript';
import { CdmFolder, ModelJson } from '..';
import {
    CdmArgumentDefinition,
    CdmConstants,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmE2ERelationship,
    CdmEntityDeclarationDefinition,
    CdmFolderDefinition,
    CdmImport,
    CdmManifestDefinition,
    cdmLogCode,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitReference,
    copyOptions,
    resolveOptions,
    traitToPropertyMap,
    StringUtils,
    constants
} from '../../internal';
import {
    isLocalEntityDeclarationDefinition,
    isReferencedEntityDeclarationDefinition
} from '../../Utilities/cdmObjectTypeGuards';
import { Logger } from '../../Utilities/Logging/Logger';
import * as timeUtils from '../../Utilities/timeUtils';
import { Import } from '../CdmFolder/types';
import * as extensionHelper from './ExtensionHelper';
import {
    LocalEntity, Model, modelBaseProperties, ReferenceEntity, ReferenceModel, SingleKeyRelationship
} from './types';

export class ManifestPersistence {
    private static TAG: string = ManifestPersistence.name;

    // Whether this persistence class has async methods.
    public static readonly isPersistenceAsync: boolean = true;

    // The file format/extension types this persistence class supports.
    public static readonly formats: string[] = [CdmConstants.modelJsonExtension];

    public static async fromObject(ctx: CdmCorpusContext, obj: Model, folder: CdmFolderDefinition): Promise<CdmManifestDefinition> {
        const extensionTraitDefList: CdmTraitDefinition[] = [];

        const manifest: CdmManifestDefinition = ctx.corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, obj.name);
        manifest.virtualLocation = folder.folderPath + CdmConstants.modelJsonExtension;

        // We need to set up folder path and namespace of a manifest to be able to retrieve that object.
        folder.documents.push(manifest);

        if (obj['cdm:imports']) {
            obj['cdm:imports'].forEach((impElement: object) => {
                const importObj: CdmImport = CdmFolder.ImportPersistence.fromData(ctx, impElement as Import);
                manifest.imports.push(importObj);
            });
        }

        if (!manifest.imports.allItems.some((importPresent: CdmImport) => importPresent.corpusPath === constants.FOUNDATIONS_CORPUS_PATH)) {
            manifest.imports.push(constants.FOUNDATIONS_CORPUS_PATH);
        }

        manifest.explanation = obj.description;

        if (obj.modifiedTime !== undefined) {
            manifest.lastFileModifiedTime = new Date(obj.modifiedTime);
        }

        if (obj['cdm:lastChildFileModifiedTime'] !== undefined) {
            manifest.lastChildFileModifiedTime = new Date(obj['cdm:lastChildFileModifiedTime']);
        }

        if (obj['cdm:lastFileStatusCheckTime'] !== undefined) {
            manifest.lastFileStatusCheckTime = new Date(obj['cdm:lastFileStatusCheckTime']);
        }

        if (!StringUtils.isBlankByCdmStandard(obj['cdm:documentVersion'])) {
            manifest.documentVersion = obj['cdm:documentVersion'];
        }

        if (obj.application) {
            const applicationTrait: CdmTraitReference = ctx.corpus.MakeObject(cdmObjectType.traitRef, 'is.managedBy', false);
            applicationTrait.isFromProperty = true;

            const arg: CdmArgumentDefinition = ctx.corpus.MakeObject<CdmArgumentDefinition>(cdmObjectType.argumentDef, 'application');
            arg.value = obj.application;
            applicationTrait.arguments.push(arg);

            // Returns true if the object (or the referenced object) is an extension from the specified symbol name in some way.
            manifest.exhibitsTraits.push(applicationTrait);
        }

        if (obj.version) {
            const versionTrait: CdmTraitReference =
                ctx.corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, 'is.modelConversion.modelVersion', false);
            const arg: CdmArgumentDefinition = ctx.corpus.MakeObject<CdmArgumentDefinition>(cdmObjectType.argumentDef, 'version');
            arg.value = obj.version;
            versionTrait.arguments.push(arg);

            manifest.exhibitsTraits.push(versionTrait);
        }

        if (obj.culture) {
            const cultureTrait: CdmTraitReference =
                ctx.corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, 'is.partition.culture', false);
            cultureTrait.isFromProperty = true;

            const arg: CdmArgumentDefinition = ctx.corpus.MakeObject<CdmArgumentDefinition>(cdmObjectType.argumentDef, 'culture');
            arg.value = obj.culture;
            cultureTrait.arguments.push(arg);

            manifest.exhibitsTraits.push(cultureTrait);
        }

        if (obj.isHidden === true) {
            const isHiddenTrait: CdmTraitReference = ctx.corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, 'is.hidden', true);
            isHiddenTrait.isFromProperty = true;
            manifest.exhibitsTraits.push(isHiddenTrait);
        }

        const referenceModels: Map<string, string> = new Map();

        if (obj.referenceModels) {
            // Create a trait and put reference models inside an argument that goes inside the trait.
            const referenceModelsTrait: CdmTraitReference = ctx.corpus.MakeObject<CdmTraitReference>(
                cdmObjectType.traitRef, 'is.modelConversion.referenceModelMap', true);

            referenceModelsTrait.simpleNamedReference = false;

            const referenceModelArg: CdmArgumentDefinition =
                ctx.corpus.MakeObject<CdmArgumentDefinition>(cdmObjectType.argumentDef, 'referenceModelMap', false);
            referenceModelArg.value = obj.referenceModels;
            referenceModelsTrait.arguments.push(referenceModelArg);

            manifest.exhibitsTraits.push(referenceModelsTrait);

            obj.referenceModels.forEach((element: ReferenceModel) => {
                referenceModels.set(element.id, element.location);
            });
        }

        const entitySchemaByName: Map<string, string> = new Map();
        if (obj.entities && obj.entities.length > 0) {
            for (const element of obj.entities) {
                let entity: CdmEntityDeclarationDefinition;
                if (element.$type === 'LocalEntity') {
                    entity = await ModelJson.LocalEntityDeclarationPersistence.fromData(
                        ctx,
                        folder,
                        element as LocalEntity,
                        extensionTraitDefList,
                        manifest
                    );
                } else if (element.$type === 'ReferenceEntity') {
                    const referenceEntity: ReferenceEntity = element as ReferenceEntity;
                    const entityLocation: string = referenceModels.get(referenceEntity.modelId);
                    if (!entityLocation) {
                        Logger.error(ctx, this.TAG, this.fromObject.name, undefined, cdmLogCode.ErrPersistModelJsonModelIdNotFound);
                        return;
                    }
                    entity = await ModelJson.ReferencedEntityDeclarationPersistence.fromData(ctx, referenceEntity, entityLocation);
                } else {
                    Logger.error(ctx, this.TAG, this.fromObject.name, undefined, cdmLogCode.ErrPersistModelJsonEntityParsingError);
                    return;
                }

                if (entity) {
                    manifest.entities.push(entity);
                    entitySchemaByName.set(entity.entityName, entity.entityPath);
                } else {
                    Logger.error(ctx, this.TAG, this.fromObject.name, undefined, cdmLogCode.ErrPersistModelJsonEntityParsingError);
                }
            }
        }

        if (obj.relationships !== undefined && obj.relationships.length > 0) {
            for (const relationship of obj.relationships) {
                const cdmRelationship: CdmE2ERelationship =
                    await ModelJson.RelationshipPersistence.fromData(ctx, relationship, entitySchemaByName);

                if (cdmRelationship !== undefined) {
                    manifest.relationships.push(cdmRelationship);
                } else {
                    Logger.warning(ctx, this.TAG, this.fromObject.name, undefined, cdmLogCode.WarnPersistModelJsonRelReadFailed);
                    return undefined;
                }
            }
        }

        await ModelJson.utils.processAnnotationsFromData(ctx, obj, manifest.exhibitsTraits);

        const localExtensionTraitDefList: CdmTraitDefinition[] = [];
        extensionHelper.processExtensionFromJson(
            ctx,
            obj,
            modelBaseProperties,
            manifest.exhibitsTraits,
            extensionTraitDefList,
            localExtensionTraitDefList
        );

        const importDocs: CdmImport[] =
            await extensionHelper.standardImportDetection(ctx, extensionTraitDefList, localExtensionTraitDefList);
        extensionHelper.addImportDocsToManifest(ctx, importDocs, manifest);

        ManifestPersistence.createExtensionDocAndAddToFolderAndImports(ctx, extensionTraitDefList, folder);

        return manifest;
    }

    public static async fromData(ctx: CdmCorpusContext, docName: string, jsonData: string, folder: CdmFolderDefinition): Promise<CdmManifestDefinition> {
        const obj = JSON.parse(jsonData);

        return ManifestPersistence.fromObject(ctx, obj, folder);
    }

    public static async toData(instance: CdmManifestDefinition, resOpt: resolveOptions, options: copyOptions): Promise<Model> {
        const result: Model = <Model>{};

        result.name = instance.manifestName;
        result.description = instance.explanation;
        result.modifiedTime = timeUtils.getFormattedDateString(instance.lastFileModifiedTime);
        result['cdm:lastChildFileModifiedTime'] = timeUtils.getFormattedDateString(instance.lastChildFileModifiedTime);
        result['cdm:lastFileStatusCheckTime'] = timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime);
        result['cdm:documentVersion'] = instance.documentVersion;

        const t2pm: traitToPropertyMap = new traitToPropertyMap(instance);

        const isHiddenTrait: CdmTraitReference = t2pm.fetchTraitReference('is.hidden');

        if (isHiddenTrait !== undefined) {
            result.isHidden = true;
        }

        const applicationTrait: CdmTraitReference = t2pm.fetchTraitReference('is.managedBy');
        if (applicationTrait !== undefined) {
            result.application = applicationTrait.arguments.allItems[0].value as string;
        }

        const versionTrait: CdmTraitReference = t2pm.fetchTraitReference('is.modelConversion.modelVersion');
        if (versionTrait !== undefined) {
            result.version = versionTrait.arguments.allItems[0].value as string;
        } else {
            // version property is required. If it doesn't exist set default.
            result.version = '1.0';
        }

        const cultureTrait: CdmTraitReference = t2pm.fetchTraitReference('is.partition.culture');
        if (cultureTrait !== undefined) {
            result.culture = cultureTrait.arguments.allItems[0].value as string;
        }

        const referenceEntityLocations: Map<string, string> = new Map<string, string>();
        const referenceModels: Map<string, string> = new Map<string, string>();

        const referenceModelsTrait: CdmTraitReference = t2pm.fetchTraitReference('is.modelConversion.referenceModelMap');

        if (referenceModelsTrait !== undefined) {
            const refModels: ReferenceModel[] = referenceModelsTrait.arguments.allItems[0].value as ReferenceModel[];

            refModels.forEach((element: ReferenceModel) => {
                const referenceModel: ReferenceModel = element;
                referenceModels.set(referenceModel.id, referenceModel.location);
                referenceEntityLocations.set(referenceModel.location, referenceModel.id);
            });
        }

        // processAnnotationsToData also processes extensions.
        await ModelJson.utils.processTraitsAndAnnotationsToData(instance.ctx, result, instance.exhibitsTraits);

        if (instance.entities && instance.entities.length > 0) {
            async function createPromise(instance) {
                result.entities = [];
                for (const entity of instance.entities.allItems) {
                    let element: LocalEntity | ReferenceEntity;
                    if (isLocalEntityDeclarationDefinition(entity)) {
                        element = await ModelJson.LocalEntityDeclarationPersistence.toData(
                            entity,
                            instance,
                            resOpt,
                            options
                        );
                    } else if (isReferencedEntityDeclarationDefinition(entity)) {
                        element = await ModelJson.ReferencedEntityDeclarationPersistence.toData(
                            entity,
                            resOpt,
                            options
                        );

                        let entityLocation: string = instance.ctx.corpus.storage.corpusPathToAdapterPath(
                            entity.entityPath);

                        if (StringUtils.isBlankByCdmStandard(entityLocation)) {
                            Logger.error(instance.ctx, ManifestPersistence.TAG, ManifestPersistence.toData.name, instance.atCorpusPath, cdmLogCode.ErrPersistModelJsonInvalidEntityPath, entity.entityName);
                            element = undefined;
                        }

                        const referenceEntity: ReferenceEntity = element as ReferenceEntity;
                        if (referenceEntity !== undefined) {
                            // path separator can differ depending on the adapter, cover the case where path uses '/' or '\'
                            const lastSlashLocation: number = entityLocation.lastIndexOf('/') > entityLocation.lastIndexOf('\\') ?
                                entityLocation.lastIndexOf('/') : entityLocation.lastIndexOf('\\');
                            if (lastSlashLocation > 0) {
                                entityLocation = entityLocation.slice(0, lastSlashLocation);
                            }

                            if (referenceEntity.modelId !== undefined) {
                                const savedLocation: string = referenceModels.get(referenceEntity.modelId);
                                if (savedLocation !== undefined && savedLocation !== entityLocation) {
                                    Logger.error(instance.ctx, ManifestPersistence.TAG, ManifestPersistence.toData.name, instance.atCorpusPath, cdmLogCode.ErrPersistModelJsonModelIdDuplication);
                                    element = undefined;
                                } else if (savedLocation === undefined) {
                                    referenceModels.set(referenceEntity.modelId, entityLocation);
                                    referenceEntityLocations.set(entityLocation, referenceEntity.modelId);
                                }
                            } else if (referenceEntity.modelId === undefined
                                && referenceEntityLocations.get(entityLocation) !== undefined) {
                                referenceEntity.modelId = referenceEntityLocations.get(entityLocation);
                            } else {
                                referenceEntity.modelId = Guid.create()
                                    .toString();
                                referenceModels.set(referenceEntity.modelId, entityLocation);
                                referenceEntityLocations.set(entityLocation, referenceEntity.modelId);
                            }
                        }
                    }

                    if (element) {
                        result.entities.push(element);
                    } else {
                        Logger.error(instance.ctx, ManifestPersistence.TAG, ManifestPersistence.toData.name, instance.atCorpusPath, cdmLogCode.ErrPersistModelJsonEntityDeclarationConversionError, entity.entityName);
                    }                    
                }
                return result.entities;
            }
            await createPromise(instance);
        }

        if (referenceModels.size > 0) {
            result.referenceModels = [];
            referenceModels.forEach((value: string, key: string) => {
                const model: ReferenceModel = {
                    id: key,
                    location: value
                };
                result.referenceModels.push(model);
            });
        }

        if (instance.relationships && instance.relationships.length > 0) {
            result.relationships = [];

            for (const cdmRelationship of instance.relationships) {
                const relationship: SingleKeyRelationship =
                    await ModelJson.RelationshipPersistence.toData(cdmRelationship, resOpt, options, instance.ctx);

                if (relationship !== undefined) {
                    result.relationships.push(relationship);
                }
            }
        }

        result['cdm:imports'] = [];

        if (instance.imports && instance.imports.allItems.length > 0) {
            instance.imports.allItems.forEach((element: CdmImport) => {
                const importObj: Import =
                    CdmFolder.ImportPersistence.toData(element, resOpt, options);
                if (importObj !== undefined) {
                    result['cdm:imports'].push(importObj);
                }
            });

        } 
        
        //  Importing foundations.cdm.json to resolve trait properly on manifest
        if (instance.imports === undefined || instance.imports.item(constants.FOUNDATIONS_CORPUS_PATH, undefined, false) === undefined) {
            const foundationsImport : Import = {
                corpusPath: constants.FOUNDATIONS_CORPUS_PATH
            };
            result['cdm:imports'].push(foundationsImport);
        }

        return result;
    }

    private static createExtensionDocAndAddToFolderAndImports(
        ctx: CdmCorpusContext,
        extensionTraitDefList: CdmTraitDefinition[],
        folder: CdmFolderDefinition
    ): void {
        if (extensionTraitDefList.length > 0) {
            const extensionDoc: CdmDocumentDefinition =
                ctx.corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, extensionHelper.extensionDocName);
            // pull out the extension trait definitions into a new custom extension document
            for (const def of extensionTraitDefList) {
                extensionDoc.definitions.push(def);
            }

            // import the cdm extensions into this new document that has the custom extensions
            extensionDoc.imports.push('cdm:/extensions/base.extension.cdm.json');

            // add the extension doc to the folder, will wire everything together as needed
            folder.documents.push(extensionDoc);
        }
    }
}
