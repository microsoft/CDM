package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmRelationshipDiscoveryStyle;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import org.apache.commons.lang3.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CdmManifestDefinition extends CdmDocumentDefinition implements CdmObjectDefinition, CdmFileStatus {
  private static final Logger LOGGER = LoggerFactory.getLogger(CdmManifestDefinition.class);

  private String manifestName;
  private CdmCollection<CdmManifestDeclarationDefinition> subManifests;
  private CdmEntityCollection entities;
  private CdmCollection<CdmE2ERelationship> relationships;
  private String explanation;
  private CdmTraitCollection exhibitsTraits;
  private OffsetDateTime lastFileStatusCheckTime;
  private OffsetDateTime lastFileModifiedTime;
  private OffsetDateTime lastChildFileModifiedTime;

  public CdmManifestDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx, name + CdmConstants.MANIFEST_EXTENSION);
    this.setObjectType(CdmObjectType.ManifestDef);
    this.manifestName = name;
    this.entities = new CdmEntityCollection(this.getCtx(), this);
    this.exhibitsTraits = new CdmTraitCollection(this.getCtx(), this);
  }

  public String getManifestName() {
    return manifestName;
  }

  public void setManifestName(final String manifestName) {
    //    TODO-BQ: 2019-09-16 Temporary support for folio.cdm.json
    if (manifestName.endsWith(CdmConstants.FOLIO_EXTENSION)) {
      this.manifestName = manifestName.replace(
          CdmConstants.FOLIO_EXTENSION,
          CdmConstants.MANIFEST_EXTENSION);
    }
    this.manifestName = manifestName;
  }

  @Override
  public OffsetDateTime getLastFileStatusCheckTime() {
    return this.lastFileStatusCheckTime;
  }

  @Override
  public void setLastFileStatusCheckTime(final OffsetDateTime lastFileStatusCheckTime) {
    this.lastFileStatusCheckTime = lastFileStatusCheckTime;
  }

  @Override
  public OffsetDateTime getLastFileModifiedTime() {
    return lastFileModifiedTime;
  }

  @Override
  public void setLastFileModifiedTime(final OffsetDateTime lastFileModifiedTime) {
    this.lastFileModifiedTime = lastFileModifiedTime;
  }

  @Override
  public OffsetDateTime getLastChildFileModifiedTime() {
    return this.lastChildFileModifiedTime;
  }

  @Override
  public void setLastChildFileModifiedTime(final OffsetDateTime lastChildFileModifiedTime) {
    this.lastChildFileModifiedTime = lastChildFileModifiedTime;
  }

  @Override
  public String getExplanation() {
    return this.explanation;
  }

  @Override
  public void setExplanation(final String explanation) {
    this.explanation = explanation;
  }

  public CdmEntityCollection getEntities() {
    return this.entities;
  }

  @Override
  public CdmObjectType getObjectType() {
    return CdmObjectType.ManifestDef;
  }

  public CdmCollection<CdmManifestDeclarationDefinition> getSubManifests() {
    if (this.subManifests == null) {
      this.subManifests = new CdmCollection<>(this.getCtx(), this, CdmObjectType.ManifestDeclarationDef);
    }
    return this.subManifests;
  }

  public CdmCollection<CdmE2ERelationship> getRelationships() {
    if (this.relationships == null) {
      this.relationships = new CdmCollection<>(this.getCtx(), this,
          CdmObjectType.E2ERelationshipDef);
    }
    return this.relationships;
  }

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmTraitCollection getExhibitsTraits() {
    return this.exhibitsTraits;
  }

  /**
   *
   * @param exhibitsTraits
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setExhibitsTraits(
      final CdmTraitCollection exhibitsTraits) {
    this.exhibitsTraits = exhibitsTraits;
  }

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CompletableFuture<Boolean> saveLinkedDocumentsAsync(final CopyOptions options) {
    return CompletableFuture.supplyAsync(() -> {
      if (this.getImports() != null) {
        for (final CdmImport imp : this.getImports()) {
          if (!saveDirtyLinkAsync(imp.getCorpusPath(), options).join()) {
            LOGGER.error("Failed saving imported document '{}'", imp.getCorpusPath());
            return false;
          }
        }
      }
      if (this.getEntities() != null) {
        // only the local entity declarations please
        for (final CdmEntityDeclarationDefinition def : this.getEntities()) {
          if (def.getObjectType() == CdmObjectType.LocalEntityDeclarationDef) {
            if (!saveDirtyLinkAsync(def.getEntityPath(), options).join()) {
              LOGGER.error("Failed saving local entity schema document '{}'", def.getEntityPath());
              return false;
            }

            // also, partitions can have their own schemas
            if (def.getDataPartitions() != null) {
              for (final CdmDataPartitionDefinition part : def.getDataPartitions()) {
                if (part.getSpecializedSchema() != null) {
                  if (!saveDirtyLinkAsync(part.getSpecializedSchema(), options).join()) {
                    LOGGER.error("Failed saving partition schema document '{}'", part.getSpecializedSchema());
                    return false;
                  }
                }
              }
            }
            // so can patterns
            if (def.getDataPartitionPatterns() != null) {
              for (final CdmDataPartitionPatternDefinition part : def.getDataPartitionPatterns()) {
                if (part.getSpecializedSchema() != null) {
                  if (!saveDirtyLinkAsync(part.getSpecializedSchema(), options).join()) {
                    LOGGER.error("failed saving partition schema document '{}'", part.getSpecializedSchema());
                    return false;
                  }
                }
              }
            }
          }
        }
      }
      if (this.getSubManifests() != null) {
        for (final CdmManifestDeclarationDefinition sub : this.getSubManifests()) {
          if (!saveDirtyLinkAsync(sub.getDefinition(), options).join()) {
            LOGGER.error("Failed saving sub-manifest document '{}'.", sub.getDefinition());
            return false;
          }
        }
      }
      return true;
    });
  }

  private CompletableFuture<Boolean> saveDirtyLinkAsync(final String relative, final CopyOptions options) {
    return CompletableFuture.supplyAsync(() -> {
      final CdmObject objAt = this.getCtx().getCorpus().fetchObjectAsync(relative, this).join();
      if (objAt == null) {
        LOGGER.error("Invalid corpus path '{}'", relative);
        return false;
      }

      final CdmDocumentDefinition docImp = objAt.getInDocument();
      if (docImp != null) {
        if (docImp.isDirty()) {
          // save it with the same name
          if (!docImp.saveAsAsync(docImp.getName(), true, options).join()) {
            LOGGER.error("Failed saving document '{}'", docImp.getName());
            return false;
          }
        }
      }

      return true;
    });
  }

  public CompletableFuture<Void> populateManifestRelationshipsAsync() {
    return populateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.All);
  }

  public CompletableFuture<Void> populateManifestRelationshipsAsync(final CdmRelationshipDiscoveryStyle option) {
    return CompletableFuture.runAsync(() -> {
      this.getRelationships().clear();
      final Set<String> relCache = ConcurrentHashMap.newKeySet();

      for (final CdmEntityDeclarationDefinition entDec : getEntities()) {
        final String entPath = this.createEntityPathFromDeclarationAsync(entDec, this).join();
        final CdmEntityDefinition currEntity = this.getCtx().getCorpus().<CdmEntityDefinition>fetchObjectAsync(entPath).join();

        if (currEntity == null) {
          continue;
        }

        // handle the outgoing relationships
        final ArrayList<CdmE2ERelationship> outgoingRels = this.getCtx().getCorpus().fetchOutgoingRelationships(currEntity);
        if (outgoingRels != null) {
          for (final CdmE2ERelationship outgoingRel : outgoingRels) {
            final String cacheKey = rel2CacheKey(outgoingRel);
            if (!relCache.contains(cacheKey) && isRelAllowed(outgoingRel, option)) {
              this.getRelationships().add(localizeRelToManifest(outgoingRel));
              relCache.add(cacheKey);
            }
          }
        }

        final ArrayList<CdmE2ERelationship> incomingRels = this.getCtx().getCorpus().fetchIncomingRelationships(currEntity);

        if (incomingRels != null) {
          for (final CdmE2ERelationship inRel : incomingRels) {
            // get entity object for current toEntity
            CdmEntityDefinition currentInBase =
                this.getCtx().getCorpus().<CdmEntityDefinition>fetchObjectAsync(inRel.getToEntity(), this).join();

            if (currentInBase == null) {
              continue;
            }

            // create graph of inheritance for to currentInBase
            // graph represented by an array where entity at i extends entity at i+1
            final CdmCollection<CdmEntityDefinition> toInheritanceGraph = new CdmCollection<>(this.getCtx(), this, this.getObjectType());
            while (currentInBase != null) {
              final ResolveOptions resOpt = new ResolveOptions();
              resOpt.setWrtDoc(currentInBase.getInDocument());
              currentInBase = currentInBase.getExtendsEntity() != null
                  ? currentInBase.getExtendsEntity().fetchObjectDefinition(resOpt)
                  : null;
              if (currentInBase != null) {
                toInheritanceGraph.add(currentInBase);
              }
            }

            // add current incoming relationship
            final String cacheKey = rel2CacheKey(inRel);
            if (!relCache.contains(cacheKey) && isRelAllowed(inRel, option)) {
              this.getRelationships().add(localizeRelToManifest(inRel));
              relCache.add(cacheKey);
            }

            // if A points at B, A's base classes must point at B as well
            for (final CdmEntityDefinition baseEntity : toInheritanceGraph) {
              final ArrayList<CdmE2ERelationship> incomingRelsForBase = this.getCtx()
                  .getCorpus()
                  .fetchIncomingRelationships(baseEntity);

              if (incomingRelsForBase != null) {
                for (final CdmE2ERelationship inRelBase : incomingRelsForBase) {
                  final CdmE2ERelationship newRel = new CdmE2ERelationship(this.getCtx(), "");
                  newRel.setFromEntity(inRelBase.getFromEntity());
                  newRel.setFromEntityAttribute(inRelBase.getFromEntityAttribute());
                  newRel.setToEntity(inRel.getToEntity());
                  newRel.setToEntityAttribute(inRel.getToEntityAttribute());

                  final String baseRelCacheKey = rel2CacheKey(newRel);
                  if (!relCache.contains(baseRelCacheKey) && isRelAllowed(newRel, option)) {
                    this.getRelationships().add(localizeRelToManifest(newRel));
                    relCache.add(baseRelCacheKey);
                  }
                }
              }
            }
          }
        }
      }

      if (this.getSubManifests() != null) {
        for (final CdmManifestDeclarationDefinition subManifestDef : this.getSubManifests()) {
          final String corpusPath = this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(subManifestDef.getDefinition(), this);
          final CdmManifestDefinition subManifest = (CdmManifestDefinition) this.getCtx().getCorpus().fetchObjectAsync(corpusPath).join();
          subManifest.populateManifestRelationshipsAsync(option).join();
        }
      }
    });
  }

  @Override
  public CompletableFuture<Void> fileStatusCheckAsync() {
    return CompletableFuture.runAsync(() -> {
      final OffsetDateTime modifiedTime = getCtx().getCorpus()
          .computeLastModifiedTimeFromObjectAsync(this).join();

      for (final CdmEntityDeclarationDefinition entity : getEntities()) {
        entity.fileStatusCheckAsync().join();
      }

      for (final CdmManifestDeclarationDefinition subManifest : getSubManifests()) {
        subManifest.fileStatusCheckAsync().join();
      }

      setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));

      if (getLastFileModifiedTime() == null) {
        setLastFileModifiedTime(getFileSystemModifiedTime());
      }

      // reload the manifest if it has been updated in the file system
      if (!Objects.equals(modifiedTime, getFileSystemModifiedTime())) {
        reloadAsync().join();
        setLastFileModifiedTime(TimeUtils.maxTime(modifiedTime, getLastFileModifiedTime()));
        setFileSystemModifiedTime(getLastFileModifiedTime());
      }
    });
  }

  @Override
  public CompletableFuture<Void> reportMostRecentTimeAsync(final OffsetDateTime childTime) {
    if (childTime != null) {
      this.setLastChildFileModifiedTime(
          TimeUtils.maxTime(childTime, this.getLastChildFileModifiedTime()));
    }
    return CompletableFuture.completedFuture(null);
  }

  public CompletableFuture<List<?>> queryOnTraitsAsync(final Object querySpec) {
    return CompletableFuture.completedFuture(null);
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, final ResolveOptions resOpt) {
    return false;
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    if (preChildren != null && preChildren.invoke(this, pathFrom)) {
      return false;
    }

    if (this.getDefinitions() != null && this.getDefinitions()
        .visitList(pathFrom, preChildren, postChildren)) {
      return true;
    }

    if (this.getEntities() != null) {
      if (this.entities.visitList(pathFrom, preChildren, postChildren)) {
        return true;
      }
    }

    if (this.getRelationships() != null) {
      this.getSubManifests().visitList(pathFrom + "/relationships/", preChildren, postChildren);
    }

    if (this.getSubManifests() != null) {
      if (this.getSubManifests().visitList(pathFrom + "/subManifests/", preChildren, postChildren)) {
        return true;
      }
    }
    return postChildren != null && postChildren.invoke(this, pathFrom);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    // Since we need to call the base copy which will only return a document when there is no host,
    // make a fake host here.
    CdmManifestDefinition tempHost = (CdmManifestDefinition) host;
    if (tempHost == null) {
      tempHost = new CdmManifestDefinition(this.getCtx(), this.getManifestName());
    }

    final CdmManifestDefinition copy = (CdmManifestDefinition) super.copy(resOpt, tempHost);

    copy.setManifestName(this.getManifestName());
    copy.setExplanation(this.getExplanation());
    copy.setLastFileStatusCheckTime(this.getLastFileStatusCheckTime());
    copy.setLastFileModifiedTime(this.getLastFileModifiedTime());
    copy.setLastChildFileModifiedTime(this.getLastChildFileModifiedTime());

    copy.getEntities().clear();
    this.getEntities().forEach(copy.getEntities()::add);

    copy.getRelationships().clear();
    this.getRelationships().forEach(copy.getRelationships()::add);

    copy.getSubManifests().clear();
    this.getSubManifests().forEach(copy.getSubManifests()::add);

    copy.getExhibitsTraits().clear();
    this.getExhibitsTraits().forEach(copy.getExhibitsTraits()::add);

    return copy;
  }

  public CompletableFuture<CdmManifestDefinition> createResolvedManifestAsync(
      String newManifestName,
      String newEntityDocumentNameFormat) {
    if (null == this.getEntities()) {
      return CompletableFuture.completedFuture(null);
    }

    if (null == newEntityDocumentNameFormat) {
      newEntityDocumentNameFormat = "{f}resolved/{n}.cdm.json";
    } else if (newEntityDocumentNameFormat.isEmpty()) { // For backwards compatibility.
      newEntityDocumentNameFormat = "{n}.cdm.json";
    } else if (!newEntityDocumentNameFormat.contains("{n}")) { // For backwards compatibility.
      newEntityDocumentNameFormat = newEntityDocumentNameFormat + "/{n}.cdm.json";
    }

    final String sourceManifestPath = this.getCtx().getCorpus()
        .getStorage()
        .createAbsoluteCorpusPath(this.getAtCorpusPath(), this);
    final String sourceManifestFolderPath = this.getCtx().getCorpus()
        .getStorage()
        .createAbsoluteCorpusPath(this.getFolder().getAtCorpusPath(), this);

    int resolvedManifestPathSplit = newManifestName.lastIndexOf("/") + 1;
    CdmFolderDefinition resolvedManifestFolder;
    if (resolvedManifestPathSplit > 0) {
      String resolvedManifestPath = newManifestName.substring(0, resolvedManifestPathSplit);
      final String newFolderPath = this.getCtx().getCorpus()
          .getStorage()
          .createAbsoluteCorpusPath(resolvedManifestPath, this);
      resolvedManifestFolder = this.getCtx()
          .getCorpus()
          .<CdmFolderDefinition>fetchObjectAsync(newFolderPath).join();
      if (resolvedManifestFolder == null) {
        LOGGER.error("New folder for manifest not found {}", newFolderPath);
        return CompletableFuture.completedFuture(null);
      }
      newManifestName = newManifestName.substring(resolvedManifestPathSplit);
    } else {
      resolvedManifestFolder = (CdmFolderDefinition) this.getOwner();
    }

    LOGGER.debug("Resolving manifest '{}'", sourceManifestPath);

    // Using the references present in the resolved entities, get an entity.
    // Create an imports doc with all the necessary resolved entity references and then resolve it.
    final CdmManifestDefinition resolvedManifest = new CdmManifestDefinition(this.getCtx(), newManifestName);

    // Add the new document to the folder.
    if (resolvedManifestFolder.getDocuments().add(resolvedManifest) == null) {
      // When would this happen?
      return CompletableFuture.completedFuture(null);
    }

    // Mapping from entity path to resolved entity path for translating relationship paths
    final Map<String, String> resEntMap = new LinkedHashMap<>();

    final String finalNewEntityDocumentNameFormat = newEntityDocumentNameFormat;
    return CompletableFuture.supplyAsync(() -> {
      for (final CdmEntityDeclarationDefinition entity : this.getEntities()) {
        final CdmEntityDefinition entDef = this.getEntityFromReferenceAsync(entity, this).join();
        if (null == entDef) {
          LOGGER.error("Unable to get entity from reference");
          return null;
        }

        // get the path from this manifest to the source entity. this will be the {f} replacement value
        String sourceEntityFullPath = this.getCtx()
            .getCorpus()
            .getStorage()
            .createAbsoluteCorpusPath(entDef.getInDocument().getFolder().getAtCorpusPath(), this);
        String f = "";
        if (sourceEntityFullPath.startsWith(sourceManifestFolderPath)) {
          f = sourceEntityFullPath.substring(sourceManifestFolderPath.length());
        }

        // Make sure the new folder exists.
        String newDocumentFullPath = finalNewEntityDocumentNameFormat
            .replace("{n}", entDef.getEntityName());
        newDocumentFullPath = newDocumentFullPath.replace("{f}", f);
        newDocumentFullPath = this.getCtx()
            .getCorpus()
            .getStorage()
            .createAbsoluteCorpusPath(newDocumentFullPath, this);
        final int newDocumentPathSplit = newDocumentFullPath.lastIndexOf("/") + 1;
        final String newDocumentPath = newDocumentFullPath.substring(0, newDocumentPathSplit);
        final String newDocumentName = newDocumentFullPath.substring(newDocumentPathSplit);

        final CdmFolderDefinition folder =
            this.getCtx().getCorpus().<CdmFolderDefinition>fetchObjectAsync(newDocumentPath).join();
        if (null == folder) {
          LOGGER.error("New folder not found '{}'", newDocumentPath);
          return null;
        }

        // Next create the resolved entity.
        final ResolveOptions resOpt = new ResolveOptions(entDef);
        LOGGER.debug("    resolving entity {} to document {}", sourceEntityFullPath, newDocumentFullPath);

        final CdmEntityDefinition resolvedEntity = entDef
            .createResolvedEntityAsync(entDef.getEntityName(), resOpt, folder, newDocumentName).join();

        if (null == resolvedEntity) {
          // Fail all resolution, if any one entity resolution fails.
          return null;
        }

        CdmEntityDeclarationDefinition result = (CdmEntityDeclarationDefinition) entity.copy(resOpt);
        if (result.getObjectType() == CdmObjectType.LocalEntityDeclarationDef) {
          result.setEntityPath(
              ObjectUtils.firstNonNull(
                  this.getCtx()
                      .getCorpus()
                      .getStorage()
                      .createRelativeCorpusPath(resolvedEntity.getAtCorpusPath(), resolvedManifest),
                  result.getAtCorpusPath()));
        }

        resolvedManifest.getEntities().add(result);

        // Absolute path is needed for generating relationships.
        final String absoluteEntPath = this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(result.getEntityPath(), resolvedManifest);
        resEntMap.put(this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(entDef.getAtCorpusPath(), entDef.getInDocument()), absoluteEntPath);
      }

      LOGGER.debug("    calculating relationships");

      // Calculate the entity graph for just this folio and any subManifests.
      this.getCtx().getCorpus().calculateEntityGraphAsync(resolvedManifest, resEntMap).join();
      // Stick results into the relationships list for the manifest.
      // Only put in relationships that are between the entities that are used in the manifest.
      resolvedManifest.populateManifestRelationshipsAsync(
          CdmRelationshipDiscoveryStyle.Exclusive
      ).join();

      // Needed until Matt's changes with collections where I can propagate.
      resolvedManifest.setDirty(true);
      return resolvedManifest;
    });
  }

  /**
   * finds and returns an entity object from an EntityDeclaration object that probably comes from a manifest.
   */
  private CompletableFuture<CdmEntityDefinition> getEntityFromReferenceAsync(
      final CdmEntityDeclarationDefinition entity,
      final CdmManifestDefinition manifest) {
    return CompletableFuture.supplyAsync(() -> {
      final String entityPath = this.createEntityPathFromDeclarationAsync(entity, manifest).join();
      final CdmEntityDefinition result = this.getCtx()
          .getCorpus()
          .<CdmEntityDefinition>fetchObjectAsync(entityPath)
          .join();

      if (null == result) {
        LOGGER.error("Failed to resolve entity {}", entityPath);
      }
      return result;
    });
  }

  public CompletableFuture<String> createEntityPathFromDeclarationAsync(
      final CdmEntityDeclarationDefinition entityDec) {
    return createEntityPathFromDeclarationAsync(entityDec, null);
  }

  CompletableFuture<String> createEntityPathFromDeclarationAsync(
      CdmEntityDeclarationDefinition entityDec,
      CdmObject obj) {
    // Keep following referenceEntityDeclaration paths
    // until a CdmLocalEntityDeclarationDefinition is hit.
    while (entityDec instanceof CdmReferencedEntityDeclarationDefinition) {
      String currCorpusPath = this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(entityDec.getEntityPath(), obj);
      entityDec = this.getCtx().getCorpus().<CdmEntityDeclarationDefinition>fetchObjectAsync(currCorpusPath).join();
      if (entityDec == null)
        return null;
      obj = entityDec.getInDocument();
    }

    return CompletableFuture.completedFuture(
        entityDec != null ? this.getCtx()
          .getCorpus()
          .getStorage()
          .createAbsoluteCorpusPath(entityDec.getEntityPath(), obj) : null
    );
  }

  boolean isRelAllowed(final CdmE2ERelationship rel, final CdmRelationshipDiscoveryStyle option) {
    if (option == CdmRelationshipDiscoveryStyle.None) {
      return false;
    } else if (option == CdmRelationshipDiscoveryStyle.Exclusive) {
      final String absoluteFromEntString =
          this.getCtx()
              .getCorpus()
              .getStorage()
              .createAbsoluteCorpusPath(rel.getFromEntity(), this);
      // only true if from and to entities are both found in the entities list of this folio
      final boolean fromEntInManifest = this
          .getEntities()
          .getAllItems()
          .stream().anyMatch(x -> Objects.equals(this.getCtx().getCorpus().getStorage()
              .createAbsoluteCorpusPath(x.getEntityPath(), this), absoluteFromEntString));

      final String absoluteToEntString = this.getCtx().getCorpus().getStorage()
          .createAbsoluteCorpusPath(rel.getToEntity(), this);
      final boolean toEntInManifest = this
          .getEntities()
          .getAllItems()
          .parallelStream()
          .anyMatch(x -> Objects.equals(this.getCtx().getCorpus().getStorage()
              .createAbsoluteCorpusPath(x.getEntityPath(), this), absoluteToEntString));
      return fromEntInManifest && toEntInManifest;
    } else {
      return true;
    }
  }

  CdmE2ERelationship localizeRelToManifest(final CdmE2ERelationship rel) {
    final CdmE2ERelationship relCopy = this
        .getCtx()
        .getCorpus()
        .makeObject(CdmObjectType.E2ERelationshipDef);

    relCopy.setToEntity(this
        .getCtx()
        .getCorpus()
        .getStorage()
        .createRelativeCorpusPath(rel.getToEntity(), this));
    relCopy.setFromEntity(this
        .getCtx()
        .getCorpus()
        .getStorage()
        .createRelativeCorpusPath(rel.getFromEntity(), this));
    relCopy.setToEntityAttribute(rel.getToEntityAttribute());
    relCopy.setFromEntityAttribute(rel.getFromEntityAttribute());
    return relCopy;
  }

  // standardized way of turning a relationship object into a key for caching
  // without using the object itself as a key (could be duplicate relationship objects)
  String rel2CacheKey(final CdmE2ERelationship rel) {
    return rel.getToEntity() + "|" + rel.getToEntityAttribute() + "|" + rel.getFromEntity() + "|" + rel.getFromEntityAttribute();
  }
}
