// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmRelationshipDiscoveryStyle;
import com.microsoft.commondatamodel.objectmodel.enums.ImportsLoadStrategy;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang3.ObjectUtils;

public class CdmManifestDefinition extends CdmDocumentDefinition implements CdmObjectDefinition, CdmFileStatus {
  private static final String TAG = CdmManifestDefinition.class.getSimpleName();

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

  @Override
  public CdmTraitCollection getExhibitsTraits() {
    return this.exhibitsTraits;
  }

  public void setExhibitsTraits(
      final CdmTraitCollection exhibitsTraits) {
    this.exhibitsTraits = exhibitsTraits;
  }

  /**
   * @param options Copy Oprions
   * @return CompletableFuture
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CompletableFuture<Boolean> saveLinkedDocumentsAsync(final CopyOptions options) {

    return CompletableFuture.supplyAsync(() -> {
      HashSet<String> links = new HashSet<String>();
      if (this.getImports() != null) {
        for (final CdmImport imp : this.getImports()) {
          links.add(imp.getCorpusPath());
        }
      }
      if (this.getEntities() != null) {
        // only the local entity declarations please
        for (final CdmEntityDeclarationDefinition def : this.getEntities()) {
          if (def.getObjectType() == CdmObjectType.LocalEntityDeclarationDef) {
            links.add(def.getEntityPath());
            // also, partitions can have their own schemas
            if (def.getDataPartitions() != null) {
              for (final CdmDataPartitionDefinition part : def.getDataPartitions()) {
                if (part.getSpecializedSchema() != null) {
                  links.add(part.getSpecializedSchema());
                }
              }
            }
            // so can patterns
            if (def.getDataPartitionPatterns() != null) {
              for (final CdmDataPartitionPatternDefinition part : def.getDataPartitionPatterns()) {
                if (part.getSpecializedSchema() != null) {
                  links.add(part.getSpecializedSchema());
                }
              }
            }
          }
        }
      }
 
      for (final String link : links) {
        CdmDocumentDefinition doc = fetchDocumentDefinition(link).join();
        if(doc == null){
          return false;
        }
        saveDocumentIfDirty(doc, options).join();
      }

      if (this.getSubManifests() != null) {
        for (final CdmManifestDeclarationDefinition sub : this.getSubManifests()) {
          CdmManifestDefinition subManifest = (CdmManifestDefinition) fetchDocumentDefinition(sub.getDefinition()).join();
          if (subManifest == null || !saveDocumentIfDirty(subManifest, options).join()) {
            return false;
          }
        }
      }

      return true;
     });
  }

  /**
   * Helper that fixes a path from local to absolute.
   * Gets the object from that path then looks at the document where the object is found.
   * If dirty, the document is saved with the original name.
   */
  private CompletableFuture<Boolean> saveDirtyLinkAsync(final String relative, final CopyOptions options) {
    return CompletableFuture.supplyAsync(() -> {
      // get the document object from the import
      String docPath =this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(relative, this);
      if (docPath == null)
      {
          Logger.error(this.getCtx(), TAG, "saveDirtyLinkAsync", this.getAtCorpusPath(), CdmLogCode.ErrValdnInvalidCorpusPath, relative);
          return false;
      }
      
      final CdmObject objAt = this.getCtx().getCorpus().fetchObjectAsync(docPath).join();
      if (objAt == null) {
        Logger.error(this.getCtx(), TAG, "saveDirtyLinkAsync", this.getAtCorpusPath(), CdmLogCode.ErrPersistObjectNotFound, docPath);
        return false;
      }

      final CdmDocumentDefinition docImp = objAt.getInDocument();
      if (docImp != null) {
        if (docImp.isDirty()) {
          // save it with the same name
          if (!docImp.saveAsAsync(docImp.getName(), true, options).join()) {
            Logger.error(this.getCtx(), TAG, "saveDirtyLinkAsync", this.getAtCorpusPath(), CdmLogCode.ErrDocEntityDocSavingFailure, docImp.getName());
            return false;
          }
        }
      }

      return true;
    });
  }

  private CompletableFuture<CdmDocumentDefinition> fetchDocumentDefinition(final String relativePath) {
    return CompletableFuture.supplyAsync(() -> {
       // get the document object from the import
      String docPath = this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(relativePath, this);
      if (docPath == null)
      {
           Logger.error(this.getCtx(), TAG, "fetchDocumentDefinition", this.getAtCorpusPath(), CdmLogCode.ErrValdnInvalidCorpusPath, relativePath);
           return null;
      }
      
      final ResolveOptions resOpt = new ResolveOptions();
      resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);
      final CdmObject objAt = this.getCtx().getCorpus().fetchObjectAsync(docPath, null, resOpt).join();
      if (objAt == null) {
         Logger.error(this.getCtx(), TAG, "fetchDocumentDefinition", this.getAtCorpusPath(), CdmLogCode.ErrPersistObjectNotFound, docPath);
         return null;
      }
      return objAt.getInDocument();
    });
  }
  
  private CompletableFuture<Boolean> saveDocumentIfDirty(final CdmDocumentDefinition docImp, final CopyOptions options) {
    return CompletableFuture.supplyAsync(() -> {
      if (docImp != null && docImp.isDirty()) {
          // save it with the same name
          if (!docImp.saveAsAsync(docImp.getName(), true, options).join()) {
            Logger.error(this.getCtx(), TAG, "saveDocumentIfDirty", this.getAtCorpusPath(), CdmLogCode.ErrDocEntityDocSavingFailure, docImp.getName());
            return false;
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
      try (Logger.LoggerScope logScope = Logger.enterScope(CdmManifestDefinition.class.getSimpleName(), getCtx(), "populateManifestRelationshipsAsync")) {
        this.getRelationships().clear();
        final Set<String> relCache = ConcurrentHashMap.newKeySet();

        if (getEntities() != null) {
          // Indexes on this manifest before calling `AddElevatedTraitsAndRelationships`
          // and calls `RefreshAsync` after adding all imports and traits to relationships
          final ResolveOptions outerResOpt = new ResolveOptions(this);
          this.indexIfNeededAsync(outerResOpt, true).join();

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
                final String cacheKey = outgoingRel.createCacheKey();
                if (!relCache.contains(cacheKey) && isRelAllowed(outgoingRel, option)) {
                  this.addElevatedTraitsAndRelationships(outgoingRel).join();
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
                final ArrayList<CdmEntityDefinition> toInheritanceGraph = new ArrayList<CdmEntityDefinition>();
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
                final String cacheKey = inRel.createCacheKey();
                if (!relCache.contains(cacheKey) && isRelAllowed(inRel, option)) {
                  this.addElevatedTraitsAndRelationships(inRel).join();
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

                      final String baseRelCacheKey = newRel.createCacheKey();
                      if (!relCache.contains(baseRelCacheKey) && isRelAllowed(newRel, option)) {
                        this.addElevatedTraitsAndRelationships(newRel).join();
                        relCache.add(baseRelCacheKey);
                      }
                    }
                  }
                }
              }
            }
          }

          // Calls RefreshAsync on this manifest to resolve purpose traits in relationships
          // after adding all imports and traits by calling `AddElevatedTraitsAndRelationships`
          this.refreshAsync(outerResOpt).join();
        }

        if (this.getSubManifests() != null) {
          for (final CdmManifestDeclarationDefinition subManifestDef : this.getSubManifests()) {
            final String corpusPath = this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(subManifestDef.getDefinition(), this);
            final CdmManifestDefinition subManifest = (CdmManifestDefinition) this.getCtx().getCorpus().fetchObjectAsync(corpusPath).join();
            subManifest.populateManifestRelationshipsAsync(option).join();
          }
        }
      }
    });
  }

  @Override
  public CompletableFuture<Void> fileStatusCheckAsync() {
    return CompletableFuture.runAsync(() -> {
      try (Logger.LoggerScope logScope = Logger.enterScope(CdmManifestDefinition.class.getSimpleName(), getCtx(), "fileStatusCheckAsync")) {
        StorageAdapterBase adapter = this.getCtx().getCorpus().getStorage().fetchAdapter(this.getInDocument().getNamespace());
        StorageAdapterBase.CacheContext cacheContext = null;
        if (adapter != null) {
          cacheContext = adapter.createFileQueryCacheContext();
        }
        try {

          final OffsetDateTime modifiedTime = getCtx().getCorpus()
                  .getLastModifiedTimeFromObjectAsync(this).join();

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

          for (final CdmEntityDeclarationDefinition entity : getEntities()) {
            entity.fileStatusCheckAsync().join();
          }

          for (final CdmManifestDeclarationDefinition subManifest : getSubManifests()) {
            subManifest.fileStatusCheckAsync().join();
          }
        } finally {
          if (cacheContext != null) {
            cacheContext.dispose();
          }
        }
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

  private CompletableFuture<List<?>> queryOnTraitsAsync(final Object querySpec) {
    return CompletableFuture.completedFuture(null);
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    if (preChildren != null && preChildren.invoke(this, pathFrom)) {
      return false;
    }

    if (this.getImports() != null && this.getImports().visitList(pathFrom, preChildren, postChildren)) {
      return true;
    }

    if (this.getDefinitions() != null && this.getDefinitions().visitList(pathFrom, preChildren, postChildren)) {
      return true;
    }

    if (this.getEntities() != null) {
      if (this.entities.visitList(pathFrom, preChildren, postChildren)) {
        return true;
      }
    }

    if (this.getRelationships() != null) {
      if (this.getRelationships().visitList(pathFrom + "/relationships/", preChildren, postChildren)) {
        return true;
      }
    }

    if (this.getSubManifests() != null) {
      if (this.getSubManifests().visitList(pathFrom + "/subManifests/", preChildren, postChildren)) {
        return true;
      }
    }
    if (postChildren != null && postChildren.invoke(this, pathFrom)) {
      return true;
    }

    return false;
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
    this.getEntities().forEach(entityDec -> copy.getEntities().add((CdmEntityDeclarationDefinition) entityDec.copy(resOpt)));

    copy.getRelationships().clear();
    this.getRelationships().forEach(relationship -> copy.getRelationships().add((CdmE2ERelationship) relationship.copy(resOpt)));

    copy.getSubManifests().clear();
    this.getSubManifests().forEach(subManifest -> copy.getSubManifests().add((CdmManifestDeclarationDefinition) subManifest.copy(resOpt)));

    copy.getExhibitsTraits().clear();
    this.getExhibitsTraits().forEach(trait -> copy.getExhibitsTraits().add((CdmTraitReferenceBase) trait.copy(resOpt)));

    return copy;
  }

  /**
   * Creates a resolved copy of the manifest.
   * newEntityDocumentNameFormat specifies a pattern to use when creating documents for resolved entities.
   * The default is "{f}resolved/{n}.cdm.json" to avoid a document name conflict with documents in the same folder as the manifest.
   * Every instance of the string {n} is replaced with the entity name from the source manifest.
   * Every instance of the string {f} is replaced with the folder path from the source manifest to the source entity
   * (if there is one that is possible as a relative location, else nothing).
   * @param newManifestName name string
   * @param newEntityDocumentNameFormat format string
   * @return CompletableFuture
   */
  public CompletableFuture<CdmManifestDefinition> createResolvedManifestAsync(
    String newManifestName,
    String newEntityDocumentNameFormat) {
      return createResolvedManifestAsync(newManifestName, newEntityDocumentNameFormat, null);
  }

  /**
   * Creates a resolved copy of the manifest.
   * newEntityDocumentNameFormat specifies a pattern to use when creating documents for resolved entities.
   * The default is "{f}resolved/{n}.cdm.json" to avoid a document name conflict with documents in the same folder as the manifest.
   * Every instance of the string {n} is replaced with the entity name from the source manifest.
   * Every instance of the string {f} is replaced with the folder path from the source manifest to the source entity
   * (if there is one that is possible as a relative location, else nothing).
   * @param newManifestName name string
   * @param newEntityDocumentNameFormat format string
   * @param directives Resolution directive
   * @return CompletableFuture
   */
  public CompletableFuture<CdmManifestDefinition> createResolvedManifestAsync(
      final String newManifestName,
      final String newEntityDocumentNameFormat,
      final AttributeResolutionDirectiveSet directives) {
    return CompletableFuture.supplyAsync(() -> {
      try (Logger.LoggerScope logScope = Logger.enterScope(CdmManifestDefinition.class.getSimpleName(), getCtx(), "createResolvedManifestAsync")) {

        String innerNewEntityDocumentNameFormat = newEntityDocumentNameFormat;
        String innerNewManifestName = newManifestName;

        if (null == this.getEntities()) {
          return null;
        }

        if (this.getOwner() == null) {
          Logger.error(this.getCtx(), TAG, "createResolvedManifestAsync", this.getAtCorpusPath(), CdmLogCode.ErrResolveManifestFailed, this.manifestName);
          return null;
        }

        if (null == innerNewEntityDocumentNameFormat) {
          innerNewEntityDocumentNameFormat = "{f}resolved/{n}.cdm.json";
        } else if (innerNewEntityDocumentNameFormat.isEmpty()) { // For backwards compatibility.
          innerNewEntityDocumentNameFormat = "{n}.cdm.json";
        } else if (!innerNewEntityDocumentNameFormat.contains("{n}")) { // For backwards compatibility.
          innerNewEntityDocumentNameFormat = innerNewEntityDocumentNameFormat + "/{n}.cdm.json";
        }

        final String sourceManifestPath = this.getCtx().getCorpus()
                .getStorage()
                .createAbsoluteCorpusPath(this.getAtCorpusPath(), this);
        final String sourceManifestFolderPath = this.getCtx().getCorpus()
                .getStorage()
                .createAbsoluteCorpusPath(this.getOwner().getAtCorpusPath(), this);

        int resolvedManifestPathSplit = innerNewManifestName.lastIndexOf("/") + 1;
        CdmFolderDefinition resolvedManifestFolder;
        if (resolvedManifestPathSplit > 0) {
          String resolvedManifestPath = innerNewManifestName.substring(0, resolvedManifestPathSplit);
          final String newFolderPath = this.getCtx().getCorpus()
                  .getStorage()
                  .createAbsoluteCorpusPath(resolvedManifestPath, this);
          resolvedManifestFolder = this.getCtx()
                  .getCorpus()
                  .<CdmFolderDefinition>fetchObjectAsync(newFolderPath).join();
          if (resolvedManifestFolder == null) {
            Logger.error( this.getCtx(), TAG, "createResolvedManifestAsync", this.getAtCorpusPath(), CdmLogCode.ErrResolveFolderNotFound, newFolderPath);
            return null;
          }
          innerNewManifestName = innerNewManifestName.substring(resolvedManifestPathSplit);
        } else {
          resolvedManifestFolder = (CdmFolderDefinition) this.getOwner();
        }

        if (resolvedManifestFolder.getDocuments().item(newManifestName) != null) {
          Logger.error(this.getCtx(), TAG, "createResolvedManifestAsync", this.getAtCorpusPath(), CdmLogCode.ErrResolveManifestExists, newManifestName, resolvedManifestFolder.getAtCorpusPath());
          return null;
        }

        Logger.debug(this.getCtx(), TAG, "createResolvedManifestAsync", this.getAtCorpusPath(), Logger.format("Resolving manifest '{0}'", sourceManifestPath));

        // Using the references present in the resolved entities, get an entity.
        // Create an imports doc with all the necessary resolved entity references and then resolve it.
        // sometimes they might send the docname, that makes sense a bit, don't include the suffix in the name
        if (innerNewManifestName.toLowerCase().endsWith(".manifest.cdm.json")) {
          innerNewManifestName = innerNewManifestName.substring(0, innerNewManifestName.length() - ".manifest.cdm.json".length());
        }
        final CdmManifestDefinition resolvedManifest = new CdmManifestDefinition(this.getCtx(), innerNewManifestName);

        // bring over any imports in this document or other bobbles
        resolvedManifest.setSchema(this.getSchema());
        resolvedManifest.setExplanation(this.getExplanation());
        resolvedManifest.setDocumentVersion(this.getDocumentVersion());
        for (CdmImport imp : this.getImports()) {
          resolvedManifest.getImports().add((CdmImport) imp.copy());
        }

        // Add the new document to the folder.
        if (resolvedManifestFolder.getDocuments().add(resolvedManifest) == null) {
          // When would this happen?
          return null;
        }

        for (final CdmEntityDeclarationDefinition entity : this.getEntities()) {
          final String entityPath = this.createEntityPathFromDeclarationAsync(entity, this).join();
          final CdmEntityDefinition entDef = this.getCtx()
                                              .getCorpus()
                                              .<CdmEntityDefinition>fetchObjectAsync(entityPath)
                                              .join();
          if (null == entDef) {
            Logger.error(this.getCtx(), TAG, "createResolvedManifestAsync", this.getAtCorpusPath(), CdmLogCode.ErrResolveEntityFailure, entityPath);
            return null;
          }

          if (entDef.getInDocument().getOwner() == null) {
            Logger.error(this.getCtx(), TAG, "createResolvedManifestAsync", this.getAtCorpusPath(), CdmLogCode.ErrDocIsNotFolder, entDef.getEntityName());
            return null;
          }

          // get the path from this manifest to the source entity. this will be the {f} replacement value
          String sourceEntityFullPath = this.getCtx()
                  .getCorpus()
                  .getStorage()
                  .createAbsoluteCorpusPath(entDef.getInDocument().getOwner().getAtCorpusPath(), this);
          String f = "";
          if (sourceEntityFullPath.startsWith(sourceManifestFolderPath)) {
            f = sourceEntityFullPath.substring(sourceManifestFolderPath.length());
          }

          // Make sure the new folder exists.
          String newDocumentFullPath = innerNewEntityDocumentNameFormat
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
            Logger.error(this.getCtx(), TAG, "createResolvedManifestAsync", this.getAtCorpusPath(), CdmLogCode.ErrResolveFolderNotFound, newDocumentPath);
            return null;
          }

          // Next create the resolved entity.
          AttributeResolutionDirectiveSet withDirectives =
                  directives != null ? directives : this.getCtx().getCorpus().getDefaultResolutionDirectives();
          final ResolveOptions resOpt = new ResolveOptions(entDef.getInDocument(), withDirectives != null ? withDirectives.copy() : null);
          Logger.debug(this.getCtx(), TAG, "createResolvedManifestAsync", this.getAtCorpusPath(), Logger.format("resolving entity {0} to document {1}", sourceEntityFullPath, newDocumentFullPath));

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
        }

        Logger.debug(this.getCtx(), TAG, "createResolvedManifestAsync", this.getAtCorpusPath(), "calculating relationships");

        // Calculate the entity graph for just this folio and any subManifests.
        this.getCtx().getCorpus().calculateEntityGraphAsync(resolvedManifest).join();
        // Stick results into the relationships list for the manifest.
        // Only put in relationships that are between the entities that are used in the manifest.
        resolvedManifest.populateManifestRelationshipsAsync(
                CdmRelationshipDiscoveryStyle.Exclusive
        ).join();

        // Needed until Matt's changes with collections where I can propagate.
        resolvedManifest.setDirty(true);
        return resolvedManifest;
      }
    });
  }


  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param entityDec CdmEntityDeclarationDefinition
   * @return CompletableFuture
   */
  @Deprecated
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

  /**
   * Adds imports for elevated purpose traits for relationships, then adds the relationships to the manifest.
   * The last import has the highest priority, so we insert the imports for traits to the beginning of the list.
   */
  private CompletableFuture<Void> addElevatedTraitsAndRelationships(final CdmE2ERelationship rel) {
    return CompletableFuture.runAsync(() -> {
      final ResolveOptions resOpt = new ResolveOptions(this);
      for (final CdmTraitReferenceBase traitRef : rel.getExhibitsTraits()) {
        final CdmTraitDefinition traitDef = (CdmTraitDefinition) this.getCtx().getCorpus().resolveSymbolReference(resOpt, this, traitRef.fetchObjectDefinitionName(), CdmObjectType.TraitDef, true);
        if (traitDef == null) {
          final String absPath = rel.getElevatedTraitCorpusPath().get((CdmTraitReference) traitRef);
          final String relativePath = this.getCtx().getCorpus().getStorage().createRelativeCorpusPath(absPath, this);
          // Adds the import to this manifest file
          this.getImports().add(0, new CdmImport(this.getCtx(), relativePath, null));
          // Fetches the actual file of the import and indexes it
          CdmDocumentDefinition importDocument = (CdmDocumentDefinition) this.getCtx().getCorpus().fetchObjectAsync(absPath).join();
          importDocument.indexIfNeededAsync(resOpt, false).join();
          // Resolves the imports in the manifests
          this.getCtx().getCorpus().resolveImportsAsync(this, new HashSet<>(Collections.singletonList(this.getAtCorpusPath())), resOpt);
          // Calls `GetImportPriorities` to prioritize all imports properly after a new import added (which requires `ImportPriorities` set to null)
          this.setImportPriorities(null);
          this.getImportPriorities();
          // As adding a new import above set the manifest needsIndexing to true, we want to avoid over indexing for each import insertion
          // so we handle the indexing for the new import above seperately in this case, no indexing needed at this point
          this.setNeedsIndexing(false);
        }
      }

      this.getRelationships().add(localizeRelToManifest(rel));
    });
  }

  CdmE2ERelationship localizeRelToManifest(final CdmE2ERelationship rel) {
    final CdmE2ERelationship relCopy = this
        .getCtx()
        .getCorpus()
        .makeObject(CdmObjectType.E2ERelationshipDef, rel.getName());

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
    relCopy.getExhibitsTraits().addAll(rel.getExhibitsTraits());
    return relCopy;
  }
}
