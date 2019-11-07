package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmImport;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ImportPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Entity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.ReferenceEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.ReferenceModel;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.SingleKeyRelationship;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ManifestPersistence {
  private static final Logger LOGGER = LoggerFactory.getLogger(ManifestPersistence.class);

  public static CompletableFuture<CdmManifestDefinition> fromData(final CdmCorpusContext ctx, final Model obj,
                                                                  final CdmFolderDefinition folder) {
    final CdmDocumentDefinition extensionDoc = ctx.getCorpus().makeObject(CdmObjectType.DocumentDef,
        (Strings.isNullOrEmpty(folder.getName()) ? folder.getNamespace() : folder.getName()) + ".extension.cdm.json");
    final CdmCollection<CdmTraitDefinition> extensionTraitDefList = new CdmCollection<>(ctx,
            extensionDoc, CdmObjectType.TraitDef);

    final CdmManifestDefinition manifest = ctx.getCorpus().makeObject(CdmObjectType.ManifestDef, obj.getName());

    // We need to set up folder path and namespace of a manifest to be able to fetch that object.
    manifest.setFolderPath(folder.getFolderPath());
    manifest.setFolder(folder);
    manifest.setNamespace(folder.getNamespace());

    manifest.setExplanation(obj.getDescription());
    manifest.setLastFileModifiedTime(obj.getModifiedTime());
    manifest.setLastChildFileModifiedTime(obj.getLastChildFileModifiedTime());
    manifest.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());

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

    final Map<String, String> referenceModels = new HashMap<>();
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

    final Map<String, String> entityPathByName = new HashMap<>();
    if (obj.getEntities() != null && obj.getEntities().size() > 0) {
      for (final Entity element : obj.getEntities()) {
        CdmEntityDeclarationDefinition entity = null;
        final String type = element.getType();
        if ("LocalEntity".equals(type)) {
          entity = LocalEntityDeclarationPersistence.fromData(ctx, folder, (LocalEntity) element, extensionTraitDefList).join();
        } else if ("ReferenceEntity".equals(type)) {
          final ReferenceEntity referenceEntity = (ReferenceEntity) element;
          if (!referenceModels.containsKey(referenceEntity.getModelId())) {
            LOGGER.error("Model Id '{}' from '{}' not found in referenceModels.", referenceEntity.getModelId(), referenceEntity.getName());
            return CompletableFuture.completedFuture(null);
          }
          entity = ReferencedEntityDeclarationPersistence
                  .fromData(ctx, referenceEntity, referenceModels.get(referenceEntity.getModelId()),
                          extensionTraitDefList).join();
        } else {
          LOGGER.error("There was an error while trying to parse entity type.");
        }

        if (entity != null) {
          // Make path relative for entities created here.
          entity.setEntityPath(ctx.getCorpus().getStorage().createRelativeCorpusPath(entity.getEntityPath(), manifest));
          manifest.getEntities().add(entity);
          entityPathByName.put(entity.getEntityName(), entity.getEntityPath());
        } else {
          LOGGER.error("There was an error while trying to parse entity type.");
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
          LOGGER.error("There was an error while trying to convert model.json local entity to cdm local entity declaration.");
        }
      });
    }

    if (obj.getImports() != null) {
      obj.getImports().forEach(element ->
              manifest.getImports().add(ImportPersistence.fromData(ctx, element))
      );
    }

    return Utils.processAnnotationsFromData(ctx, obj, manifest.getExhibitsTraits()).thenCompose(v -> {
      ExtensionHelper.processExtensionFromJson(ctx, obj, manifest.getExhibitsTraits(), extensionTraitDefList);
      final List<CdmImport> importDocs = ExtensionHelper.standardImportDetection(ctx, extensionTraitDefList).join();

      ManifestPersistence.createExtensionDocAndAddToFolderAndImports(
          ctx,
          extensionDoc,
          extensionTraitDefList,
          folder,
          importDocs);
      ManifestPersistence.addImportDocsToManifest(ctx, importDocs, manifest).join();

      // We need to set up folder path and namespace of a manifest to be able to retrieve that object.
      folder.getDocuments().add(manifest);

      return CompletableFuture.completedFuture(manifest);
    });
  }

  /**
   * Adds the remaining definitions of extensions to extensionDoc. Then adds extensionDoc to the
   * folder of the manifest and adds it's path to the list of imports.
   *
   * @param ctx                   The context.
   * @param extensionDoc          The document where the definitions will be added. This document will be
   *                              added to folder and it's path to importDocs
   * @param extensionTraitDefList The list of definitions to be added to schema.
   * @param folder                The folder that contains the manifest and where the document containing the schema
   *                              will be placed.
   * @param importDocs            The list of paths of documents containing schemas for the manifest.
   */
  private static void createExtensionDocAndAddToFolderAndImports(final CdmCorpusContext ctx,
                                                                 final CdmDocumentDefinition extensionDoc,
                                                                 final CdmCollection<CdmTraitDefinition> extensionTraitDefList,
                                                                 final CdmFolderDefinition folder, final List<CdmImport> importDocs) {
    if (extensionTraitDefList.getCount() > 0) {
      extensionTraitDefList.getAllItems()
          .parallelStream()
          .map((CdmTraitDefinition cdmTraitDef) -> (CdmObjectDefinition) cdmTraitDef)
          .collect(Collectors.toList()).forEach(cdmObjectDef -> extensionDoc.getDefinitions().add(cdmObjectDef));
      extensionDoc.setFolder(folder);
      final CdmImport baseExtensionImport = ctx.getCorpus().makeObject(CdmObjectType.Import);
      baseExtensionImport.setCorpusPath("cdm:/extensions/base.extension.cdm.json");
      extensionDoc.getImports().add(baseExtensionImport);
      extensionDoc.setJsonSchemaSemanticVersion("0.9.0");
      extensionDoc.setFolderPath(folder.getFolderPath());
      extensionDoc.setNamespace(folder.getNamespace());

      // Add the extension doc to the folder, will wire everything together as needed.
      folder.getDocuments().add(extensionDoc);

      final CdmImport extensionImport = ctx.getCorpus().makeObject(CdmObjectType.Import);
      extensionImport.setCorpusPath(ctx.getCorpus().getStorage().createRelativeCorpusPath(extensionDoc.getAtCorpusPath(), extensionDoc));
      importDocs.add(extensionImport);
    }
  }

  /**
   * Adds the list of documents with extensions schema definitions to the manifest.
   *
   * @param ctx        The context.
   * @param importDocs The list of paths of documents containing schemas for the manifest.
   * @param manifest   The manifest that needs to import the docs.
   */
  private static CompletableFuture<Void> addImportDocsToManifest(final CdmCorpusContext ctx,
                                                                 final List<CdmImport> importDocs,
                                                                 final CdmManifestDefinition manifest) {
    return CompletableFuture.runAsync(() ->
            importDocs.forEach(importDoc -> {
              manifest.getEntities().forEach(entityDef -> {
                if (entityDef.getObjectType() == CdmObjectType.LocalEntityDeclarationDef) {
                  final String entityPath = entityDef.getEntityPath();
                  final String docPath = entityPath.substring(0, entityPath.lastIndexOf('/'));
                  final CdmObject objectFromCorpusPath = ctx.getCorpus()
                          .fetchObjectAsync(docPath).join();
                  final CdmDocumentDefinition cdmDocument = (CdmDocumentDefinition) objectFromCorpusPath;

                  if (cdmDocument.getImports()
                          .getAllItems()
                          .parallelStream()
                          .noneMatch(
                          (CdmImport importPresent) -> Objects.equals(importPresent.getCorpusPath(),
                                  importDoc.getCorpusPath()))) {
                    cdmDocument.getImports().add(importDoc);
                  }
                }
              });
              if (manifest.getImports()
                      .getAllItems()
                      .parallelStream()
                      .noneMatch(importPresent -> Objects.equals(importPresent.getCorpusPath(),
                              importDoc.getCorpusPath()))) {
                manifest.getImports().add(importDoc);
              }
            })
    );
  }

  public static CompletableFuture<Model> toData(final CdmManifestDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {

    return CompletableFuture.supplyAsync(() -> {
      final Model result = new Model();
      result.setName(instance.getManifestName());
      result.setDescription(instance.getExplanation());
      result.setModifiedTime(instance.getLastFileModifiedTime());
      result.setLastChildFileModifiedTime(instance.getLastChildFileModifiedTime());
      result.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());

      final TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);

      final CdmTraitReference isHiddenTrait = t2pm.fetchTraitReferenceName("is.hidden");
      if (isHiddenTrait != null) {
        result.setHidden(true);
      }

      final CdmTraitReference applicationTrait = t2pm.fetchTraitReferenceName("is.managedBy");
      if (applicationTrait != null) {
        result.setApplication(
            applicationTrait.getArguments().getAllItems().get(0).getValue().toString());
      }

      final CdmTraitReference versionTrait = t2pm.fetchTraitReferenceName("is.modelConversion.modelVersion");
      if (versionTrait != null) {
        result.setVersion(versionTrait.getArguments().getAllItems().get(0).getValue().toString());
      } else {
        // Version property is required. If it doesn't exist set default.
        result.setVersion("1.0");
      }

      final CdmTraitReference cultureTrait = t2pm.fetchTraitReferenceName("is.partition.culture");
      if (cultureTrait != null) {
        result.setCulture(cultureTrait.getArguments().getAllItems().get(0).getValue().toString());
      }

      final Map<String, String> referenceEntityLocations = new HashMap<>();
      final Map<String, String> referenceModels = new HashMap<>();

      final CdmTraitReference referenceModelsTrait = t2pm.fetchTraitReferenceName("is.modelConversion.referenceModelMap");
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

      Utils.processAnnotationsToData(instance.getCtx(), result, instance.getExhibitsTraits()).join();

      if (instance.getEntities() != null && instance.getEntities().getCount() > 0) {
        final List<CompletableFuture<Void>> promises = new ArrayList<>();
        final CopyOnWriteArrayList<Entity> obtainedEntities = new CopyOnWriteArrayList<>();
        for (final CdmEntityDeclarationDefinition entity : instance.getEntities()) {
          final CompletableFuture<Void> createdPromise = CompletableFuture.runAsync(() -> {
            Entity element = null;
            if ((entity.getObjectType() == CdmObjectType.LocalEntityDeclarationDef)) {
              element = LocalEntityDeclarationPersistence.toData(
                  entity,
                  resOpt,
                  options
              ).join();
            } else if ((entity.getObjectType() == CdmObjectType.ReferencedEntityDeclarationDef)) {
              element = ReferencedEntityDeclarationPersistence.toData(
                  entity,
                  resOpt,
                  options
              ).join();

              final ReferenceEntity referenceEntity = (ReferenceEntity) element;
              final String location = instance.getCtx()
                  .getCorpus()
                  .getStorage()
                  .corpusPathToAdapterPath(
                      entity.getEntityPath()
                  );

              if ((referenceEntity.getModelId() != null)) {
                referenceModels.putIfAbsent(referenceEntity.getModelId(), location);
              } else if (referenceEntityLocations.get(location) != null) {
                referenceEntity.setModelId(referenceEntityLocations.get(location));
              } else {
                referenceEntity.setModelId(UUID.randomUUID().toString());
                referenceModels.put(referenceEntity.getModelId(), location);
                referenceEntityLocations.put(location, referenceEntity.getModelId());
              }
            }

            if (element != null) {
              obtainedEntities.add(element);
            } else {
              LOGGER.error("There was an error while trying to convert entity declaration to model json format.");
            }
          });
          promises.add(createdPromise);

          // TODO: Currently function is synchronous. Remove next line to turn it asynchronous.
          // Currently some functions called are not thread safe.
          createdPromise.join();
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
          } else {
            LOGGER.error("There was an error while trying to convert cdm relationship to model.json relationship.");
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