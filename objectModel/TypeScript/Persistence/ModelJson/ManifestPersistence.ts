import { Guid } from 'guid-typescript';
import {
    LocalEntityDeclarationPersistence,
    processAnnotationsFromData,
    processAnnotationsToData,
    ReferencedEntityDeclarationPersistence,
    RelationshipPersistence
} from '.';
import {
    CdmArgumentDefinition,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmE2ERelationship,
    CdmEntityDeclarationDefinition,
    CdmFolderDefinition,
    CdmImport,
    CdmManifestDefinition,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitReference,
    copyOptions,
    resolveOptions,
    traitToPropertyMap
} from '../../internal';
import {
    isLocalEntityDeclarationDefinition,
    isReferencedEntityDeclarationDefinition
} from '../../Utilities/cdmObjectTypeGuards';
import { Logger } from '../../Utilities/Logging/Logger';
import * as timeUtils from '../../Utilities/timeUtils';
import { ImportPersistence } from '../CdmFolder';
import { Import } from '../CdmFolder/types';
import * as extensionHelper from './ExtensionHelper';
import {
    LocalEntity, Model, modelBaseProperties, ReferenceEntity, ReferenceModel, SingleKeyRelationship
} from './types';

export class ManifestPersistence {
    public static async fromData(ctx: CdmCorpusContext, obj: Model, folder: CdmFolderDefinition): Promise<CdmManifestDefinition> {
        const extensionTraitDefList: CdmTraitDefinition[] = [];

        const manifest: CdmManifestDefinition = ctx.corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, obj.name);

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
                    entity = await LocalEntityDeclarationPersistence.fromData(ctx, folder, element as LocalEntity, extensionTraitDefList);
                } else if (element.$type === 'ReferenceEntity') {
                    const referenceEntity: ReferenceEntity = element as ReferenceEntity;
                    const location: string = referenceModels.get(referenceEntity.modelId);
                    if (!location) {
                        Logger.error(
                            ManifestPersistence.name,
                            ctx,
                            `Model Id ${referenceEntity.modelId} from ${referenceEntity.name} not found in referenceModels.`
                        );

                        return;
                    }
                    entity = await ReferencedEntityDeclarationPersistence.fromData(ctx, referenceEntity, location);
                } else {
                    Logger.error(ManifestPersistence.name, ctx, 'There was an error while trying to parse entity type.');

                    return;
                }

                if (entity) {
                    manifest.entities.push(entity);
                    entitySchemaByName.set(entity.entityName, entity.entityPath);
                } else {
                    Logger.error(ManifestPersistence.name, ctx, 'There was an error while trying to parse entity type.');

                    return;
                }
            }
        }

        if (obj.relationships !== undefined && obj.relationships.length > 0) {
            for (const relationship of obj.relationships) {
                const cdmRelationship: CdmE2ERelationship = await RelationshipPersistence.fromData(ctx, relationship, entitySchemaByName);

                if (cdmRelationship !== undefined) {
                    manifest.relationships.push(cdmRelationship);
                } else {
                    Logger.warning(
                        ManifestPersistence.name,
                        ctx,
                        'There was an error while trying to convert model.json local entity to cdm local entity declaration.'
                    );

                    return undefined;
                }
            }
        }

        if (obj['cdm:imports']) {
            obj['cdm:imports'].forEach((impElement: object) => {
                const importObj: CdmImport = ImportPersistence.fromData(ctx, impElement as Import);
                manifest.imports.push(importObj);
            });
        }

        await processAnnotationsFromData(ctx, obj, manifest.exhibitsTraits);

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

        // We need to set up folder path and namespace of a manifest to be able to retrieve the object
        folder.documents.push(manifest);

        return manifest;
    }

    public static async toData(instance: CdmManifestDefinition, resOpt: resolveOptions, options: copyOptions): Promise<Model> {
        const result: Model = <Model>{};

        result.name = instance.manifestName;
        result.description = instance.explanation;
        result.modifiedTime = timeUtils.getFormattedDateString(instance.lastFileModifiedTime);
        result['cdm:lastChildFileModifiedTime'] = timeUtils.getFormattedDateString(instance.lastChildFileModifiedTime);
        result['cdm:lastFileStatusCheckTime'] = timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime);

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
        await processAnnotationsToData(instance.ctx, result, instance.exhibitsTraits);

        if (instance.entities && instance.entities.length > 0) {
            result.entities = [];
            const promises: Promise<void>[] = instance.entities.allItems.map(
                async (entity: CdmEntityDeclarationDefinition) => {
                    let element: LocalEntity | ReferenceEntity;
                    if (isLocalEntityDeclarationDefinition(entity)) {
                        element = await LocalEntityDeclarationPersistence.toData(
                            entity,
                            instance,
                            resOpt,
                            options
                        );
                    } else if (isReferencedEntityDeclarationDefinition(entity)) {
                        element = await ReferencedEntityDeclarationPersistence.toData(
                            entity,
                            resOpt,
                            options
                        );

                        const referenceEntity: ReferenceEntity = element;
                        const location: string = instance.ctx.corpus.storage.corpusPathToAdapterPath(
                            entity.entityPath);

                        if (referenceEntity.modelId !== undefined) {
                            if (referenceModels.get(referenceEntity.modelId) === undefined) {
                                referenceModels.set(referenceEntity.modelId, location);
                            }
                        } else if (referenceEntityLocations.get(location) !== undefined) {
                            referenceEntity.modelId = referenceEntityLocations.get(location);
                        } else {
                            referenceEntity.modelId = Guid.create()
                                .toString();
                            referenceModels.set(referenceEntity.modelId, location);
                            referenceEntityLocations.set(location, referenceEntity.modelId);
                        }
                    }

                    if (element) {
                        result.entities.push(element);
                    } else {
                        Logger.error(
                            ManifestPersistence.name,
                            instance.ctx,
                            'There was an error while trying to convert entity declaration to model json format.');
                    }
                }
            );
            await Promise.all(promises);
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
                    await RelationshipPersistence.toData(cdmRelationship, resOpt, options, instance.ctx);

                if (relationship !== undefined) {
                    result.relationships.push(relationship);
                } else {
                    Logger.error(
                        ManifestPersistence.name,
                        instance.ctx,
                        'There was an error while trying to convert cdm relationship to model.json relationship.'
                    );

                    return undefined;
                }
            }
        }

        if (instance.imports && instance.imports.allItems.length > 0) {
            result['cdm:imports'] = [];
            instance.imports.allItems.forEach((element: CdmImport) => {
                const importObj: Import = ImportPersistence.toData(element, resOpt, options);
                if (importObj !== undefined) {
                    result['cdm:imports'].push(importObj);
                }
            });
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
