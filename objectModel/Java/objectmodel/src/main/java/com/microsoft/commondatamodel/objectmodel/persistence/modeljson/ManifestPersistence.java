// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmImport;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ImportPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Entity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.ReferenceEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.ReferenceModel;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.SingleKeyRelationship;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

public class ManifestPersistence {
  private static final String TAG = ManifestPersistence.class.getSimpleName();

  /**
   * Whether this persistence class has async methods.
   */
  public static final boolean isPersistenceAsync = true;
  
  /**
   * The file format/extension types this persistence class supports.
   */
  public static final String[] formats = { CdmConstants.MODEL_JSON_EXTENSION };

  public static CompletableFuture<CdmManifestDefinition> fromObject(
      final CdmCorpusContext ctx,
      final Model obj,
      final CdmFolderDefinition folder) {
    final List<CdmTraitDefinition> extensionTraitDefList = new ArrayList<>();

    final CdmManifestDefinition manifest = ctx.getCorpus().makeObject(CdmObjectType.ManifestDef, obj.getName());

    // We need to set up folder path and namespace of a manifest to be able to retrieve that object.
    folder.getDocuments().add(manifest);

    if (obj.getImports() != null) {
      obj.getImports()
          .forEach(
              element->manifest.getImports().add(ImportPersistence.fromData(ctx, element)));
    }

    if (manifest.getImports()
        .getAllItems()
        .parallelStream()
        .noneMatch(importPresent ->
            Objects.equals(importPresent.getCorpusPath(), Constants.FoundationsCorpusPath))) {
      manifest.getImports().add(Constants.FoundationsCorpusPath);
    }

    manifest.setExplanation(obj.getDescription());
    manifest.setLastFileModifiedTime(obj.getModifiedTime());
    manifest.setLastChildFileModifiedTime(obj.getLastChildFileModifiedTime());
    manifest.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());

    if (!StringUtils.isBlankByCdmStandard(obj.getDocumentVersion())) {
      manifest.setDocumentVersion(obj.getDocumentVersion());
    }

    if (obj.getApplication() != null) {
      final CdmTraitReference applicationTrait = ctx.getCorpus()
          .makeRef(CdmObjectType.TraitRef, "is.managedBy", false);
      applicationTrait.setFromProperty(true);

      final CdmArgumentDefinition arg = ctx.getCorpus()
          .makeObject(CdmObjectType.ArgumentDef, "application");
      arg.setValue(obj.getApplication());
      applicationTrait.getArguments().add(arg);

      manifest.getExhibitsTraits().add(applicationTrait);
    }

    if (obj.getVersion() != null) {
      final CdmTraitReference versionTrait = ctx.getCorpus()
          .makeRef(CdmObjectType.TraitRef, "is.modelConversion.modelVersion", false);

      final CdmArgumentDefinition arg = ctx.getCorpus().makeObject(CdmObjectType.ArgumentDef, "version");
      arg.setValue(obj.getVersion());
      versionTrait.getArguments().add(arg);

      manifest.getExhibitsTraits().add(versionTrait);
    }

    if (obj.getCulture() != null) {
      final CdmTraitReference cultureTrait = ctx.getCorpus()
          .makeRef(CdmObjectType.TraitRef, "is.partition.culture", false);
      cultureTrait.setFromProperty(true);

      final CdmArgumentDefinition arg = ctx.getCorpus().makeObject(CdmObjectType.ArgumentDef, "culture");
      arg.setValue(obj.getCulture());
      cultureTrait.getArguments().add(arg);

      manifest.getExhibitsTraits().add(cultureTrait);
    }

    if (obj.isHidden() != null && obj.isHidden()) {
      final CdmTraitReference isHiddenTrait = ctx.getCorpus()
          .makeRef(CdmObjectType.TraitRef, "is.hidden", true);
      isHiddenTrait.setFromProperty(true);
      manifest.getExhibitsTraits().add(isHiddenTrait);
    }

    final Map<String, String> referenceModels = new LinkedHashMap<>();
    if (obj.getReferenceModels() != null) {
      final CdmTraitReference referenceModelsTrait = ctx.getCorpus()
          .makeRef(CdmObjectType.TraitRef, "is.modelConversion.referenceModelMap", false);

      final CdmArgumentDefinition arg = ctx.getCorpus()
          .makeObject(CdmObjectType.ArgumentDef, "referenceModelMap");
      arg.setValue(JMapper.MAP.valueToTree(obj.getReferenceModels()));
      referenceModelsTrait.getArguments().add(arg);

      manifest.getExhibitsTraits().add(referenceModelsTrait);
      obj.getReferenceModels().forEach(referenceModel ->
          referenceModels.put(referenceModel.getId(), referenceModel.getLocation())
      );
    }

    final Map<String, String> entityPathByName = new LinkedHashMap<>();
    if (obj.getEntities() != null && obj.getEntities().size() > 0) {
      for (final Entity element : obj.getEntities()) {
        CdmEntityDeclarationDefinition entity = null;
        final String type = element.getType();
        if ("LocalEntity".equals(type)) {
          entity =
              LocalEntityDeclarationPersistence.fromData(
                  ctx,
                  folder,
                  (LocalEntity) element,
                  extensionTraitDefList,
                  manifest)
                  .join();
        } else if ("ReferenceEntity".equals(type)) {
          final ReferenceEntity referenceEntity = (ReferenceEntity) element;
          if (!referenceModels.containsKey(referenceEntity.getModelId())) {
            Logger.error(ctx, TAG, "fromObject", null, CdmLogCode.ErrPersistModelJsonModelIdNotFound, referenceEntity.getModelId(), referenceEntity.getName());
            return CompletableFuture.completedFuture(null);
          }
          entity = ReferencedEntityDeclarationPersistence
              .fromData(
                  ctx,
                  referenceEntity,
                  referenceModels.get(referenceEntity.getModelId())).join();
        } else {
          Logger.error(ctx, TAG, "fromObject", null, CdmLogCode.ErrPersistModelJsonEntityParsingError);
        }

        if (entity != null) {
          // Make path relative for entities created here.
          manifest.getEntities().add(entity);
          entityPathByName.put(entity.getEntityName(), entity.getEntityPath());
        } else {
          Logger.error(ctx, TAG, "fromObject", null, CdmLogCode.ErrPersistModelJsonEntityParsingError);
        }
      }
    }

    if (null != obj.getRelationships() && obj.getRelationships().size() > 0) {
      obj.getRelationships().forEach(element -> {
        final CdmE2ERelationship relationship = RelationshipPersistence
            .fromData(ctx, element, entityPathByName).join();
        if (null != relationship) {
          manifest.getRelationships().add(relationship);
        } else {
          Logger.warning(ctx, TAG, "fromObject", null, CdmLogCode.WarnPersistModelJsonRelReadFailed);
        }
      });
    }

    return Utils.processAnnotationsFromData(ctx, obj, manifest.getExhibitsTraits())
        .thenCompose(v -> {

          final List<CdmTraitDefinition> localExtensionTraitDefList = new ArrayList<>();
          ExtensionHelper.processExtensionFromJson(
              ctx,
              obj,
              manifest.getExhibitsTraits(),
              extensionTraitDefList,
              localExtensionTraitDefList);
          final List<CdmImport> importDocs =
              ExtensionHelper.standardImportDetection(
                  ctx,
                  extensionTraitDefList,
                  localExtensionTraitDefList).join();

          ExtensionHelper.addImportDocsToManifest(ctx, importDocs, manifest);

          ManifestPersistence.createExtensionDocAndAddToFolderAndImports(
              ctx,
              extensionTraitDefList,
              folder);

          return CompletableFuture.completedFuture(manifest);
        });
  }
  
  public static CompletableFuture<CdmManifestDefinition> fromData(CdmCorpusContext ctx, String docName, String jsonData, CdmFolderDefinition folder) {
    return CompletableFuture.supplyAsync(() -> {
      try {
        Model obj = JMapper.MAP.readValue(jsonData, Model.class);
        return fromObject(ctx, obj, folder).join();
      } catch (final Exception e) {
        Logger.error(ctx, TAG, "fromData", null, CdmLogCode.ErrPersistConversionError, docName, e.getLocalizedMessage());
        return null;
      }
    });
  }

  /**
   * Adds the remaining definitions of extensions to extensionDoc. Then adds extensionDoc to the
   * folder of the manifest and adds it's path to the list of imports.
   *
   * @param ctx                   The context.
   * @param extensionTraitDefList The list of definitions to be added to schema.
   * @param folder                The folder that contains the manifest and where the document containing the schema
   *                              will be placed.
   */
  private static void createExtensionDocAndAddToFolderAndImports(
      final CdmCorpusContext ctx,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final CdmFolderDefinition folder) {
    if (extensionTraitDefList.size() > 0) {
      final CdmDocumentDefinition extensionDoc =
          ctx.getCorpus().makeObject(CdmObjectType.DocumentDef, ExtensionHelper.EXTENSION_DOC_NAME);
      extensionTraitDefList
          .parallelStream()
          .map((CdmTraitDefinition cdmTraitDef) -> (CdmObjectDefinition) cdmTraitDef)
          .collect(Collectors.toList()).forEach(cdmObjectDef -> extensionDoc.getDefinitions().add(cdmObjectDef));
      extensionDoc.getImports().add("cdm:/extensions/base.extension.cdm.json");
      extensionDoc.setFolderPath(folder.getFolderPath());
      extensionDoc.setNamespace(folder.getNamespace());

      // Add the extension doc to the folder, will wire everything together as needed.
      folder.getDocuments().add(extensionDoc);
    }
  }

  public static CompletableFuture<Model> toData(
      final CdmManifestDefinition instance,
      final ResolveOptions resOpt,
      final CopyOptions options) {
      final Model result = new Model();
      result.setName(instance.getManifestName());
      result.setDescription(instance.getExplanation());
      result.setModifiedTime(instance.getLastFileModifiedTime());
      result.setLastChildFileModifiedTime(instance.getLastChildFileModifiedTime());
      result.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());
      result.setDocumentVersion(instance.getDocumentVersion());

      final TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);

      final CdmTraitReference isHiddenTrait = t2pm.fetchTraitReference("is.hidden");
      if (isHiddenTrait != null) {
        result.setHidden(true);
      }

      final CdmTraitReference applicationTrait = t2pm.fetchTraitReference("is.managedBy");
      if (applicationTrait != null) {
        result.setApplication(
            applicationTrait.getArguments().get(0).getValue().toString());
      }

      final CdmTraitReference versionTrait = t2pm.fetchTraitReference("is.modelConversion.modelVersion");
      if (versionTrait != null) {
        result.setVersion(versionTrait.getArguments().get(0).getValue().toString());
      } else {
        // Version property is required. If it doesn't exist set default.
        result.setVersion("1.0");
      }

      final CdmTraitReference cultureTrait = t2pm.fetchTraitReference("is.partition.culture");
      if (cultureTrait != null) {
        result.setCulture(cultureTrait.getArguments().get(0).getValue().toString());
      }

      final Map<String, String> referenceEntityLocations = new LinkedHashMap<>();
      final Map<String, String> referenceModels = new LinkedHashMap<>();

      final CdmTraitReference referenceModelsTrait = t2pm.fetchTraitReference("is.modelConversion.referenceModelMap");
      if (referenceModelsTrait != null) {
        final JsonNode refModels = JMapper.MAP
            .valueToTree(referenceModelsTrait.getArguments().getAllItems().get(0).getValue());
        refModels.forEach(referenceModel -> {
          final JsonNode referenceModelId = referenceModel.get("id");
          final String referenceModelIdAsString = referenceModelId.asText();
          final JsonNode referenceModelLocation = referenceModel.get("location");
          final String referenceModelLocationAsString = referenceModelLocation.asText();
          referenceModels.put(referenceModelIdAsString, referenceModelLocationAsString);
          referenceEntityLocations.put(referenceModelLocationAsString, referenceModelIdAsString);
        });
      }

      return Utils.processTraitsAndAnnotationsToData(instance.getCtx(), result, instance.getExhibitsTraits()).thenApply(v -> {
        if (instance.getEntities() != null && instance.getEntities().getCount() > 0) {
          final List<CompletableFuture<Void>> promises = new ArrayList<>();
          final CopyOnWriteArrayList<Entity> obtainedEntities = new CopyOnWriteArrayList<>();
          for (final CdmEntityDeclarationDefinition entity : instance.getEntities()) {
            final CompletableFuture<Void> createdPromise = CompletableFuture.runAsync(() -> {
              Entity element = null;
              if ((entity.getObjectType() == CdmObjectType.LocalEntityDeclarationDef)) {
                element = LocalEntityDeclarationPersistence.toData(
                        entity,
                        instance,
                        resOpt,
                        options
                ).join();
              } else if ((entity.getObjectType() == CdmObjectType.ReferencedEntityDeclarationDef)) {
                element = ReferencedEntityDeclarationPersistence.toData(
                        entity,
                        resOpt,
                        options
                ).join();

                String location = instance.getCtx()
                        .getCorpus()
                        .getStorage()
                        .corpusPathToAdapterPath(
                                entity.getEntityPath()
                        );

                if (StringUtils.isBlankByCdmStandard(location)) {
                  Logger.error(instance.getCtx(), TAG, "toData", instance.getAtCorpusPath(), CdmLogCode.ErrPersistModelJsonInvalidEntityPath);
                  element = null;
                }

                if (element instanceof ReferenceEntity) {
                  // path separator can differ depending on the adapter, cover the case where path uses '/' or '\'
                  final ReferenceEntity referenceEntity = (ReferenceEntity) element;
                  int lastSlashLocation = location.lastIndexOf("/") > location.lastIndexOf("\\") ? location.lastIndexOf("/") : location.lastIndexOf("\\");
                  if (lastSlashLocation > 0) {
                    location = location.substring(0, lastSlashLocation);
                  }

                  if (referenceEntity.getModelId() != null) {
                    final String savedLocation = referenceModels.get(referenceEntity.getModelId());
                    if (savedLocation != null && !Objects.equals(savedLocation, location)) {
                      Logger.error(instance.getCtx(), TAG, "toData", instance.getAtCorpusPath(), CdmLogCode.ErrPersistModelJsonModelIdDuplication);
                      element = null;
                    } else if (savedLocation == null) {
                      referenceModels.put(referenceEntity.getModelId(), location);
                      referenceEntityLocations.put(location, referenceEntity.getModelId());
                    }
                  } else if (referenceEntityLocations.containsKey(location)) {
                    referenceEntity.setModelId(referenceEntityLocations.get(location));
                  } else {
                    referenceEntity.setModelId(UUID.randomUUID().toString());
                    referenceModels.put(referenceEntity.getModelId(), location);
                    referenceEntityLocations.put(location, referenceEntity.getModelId());
                  }
                }
              }

              if (element != null) {
                obtainedEntities.add(element);
              } else {
                Logger.error(instance.getCtx(), TAG, "toData", instance.getAtCorpusPath(), CdmLogCode.ErrPersistModelJsonEntityDeclarationConversionError, entity.getEntityName());
              }
            });

            try {
              // TODO: Currently function is synchronous. Remove next line to turn it asynchronous.
              // Currently some functions called are not thread safe.
              createdPromise.get();
              promises.add(createdPromise);
            } catch (InterruptedException | ExecutionException e) {
              Logger.error(instance.getCtx(), TAG, "toData", instance.getAtCorpusPath(), CdmLogCode.ErrPersistModelJsonEntityDeclarationConversionFailure, entity.getEntityName(), e.getMessage());
            }
          }
          for (final CompletableFuture<Void> promise : promises) {
            promise.join();
          } //    TODO-BQ: 2019-09-05 Refactor.
          result.setEntities(new ArrayList<>(obtainedEntities));
        }

        if (!referenceModels.isEmpty()) {
          result.setReferenceModels(new ArrayList<>());
          for (final Map.Entry<String, String> referenceModel : referenceModels.entrySet()) {
            final ReferenceModel newReferenceModel = new ReferenceModel();
            newReferenceModel.setId(referenceModel.getKey());
            newReferenceModel.setLocation(referenceModel.getValue());
            result.getReferenceModels().add(newReferenceModel);
          }
        }

        if (null != instance.getRelationships() && instance.getRelationships().getCount() > 0) {
          result.setRelationships(new ArrayList<>());

          instance.getRelationships().forEach(cdmRelationship -> {
            final SingleKeyRelationship relationship = RelationshipPersistence
                    .toData(cdmRelationship, resOpt, options).join();

            if (null != relationship) {
              result.getRelationships().add(relationship);
            }
          });
        }

        if (instance.getImports() != null && instance.getImports().getCount() > 0) {
          result.setImports(new ArrayList<>());
          instance.getImports().forEach(element ->
                  result.getImports().add(ImportPersistence.toData(element, resOpt, options)));
        }

        return result;
      });
  }
}
