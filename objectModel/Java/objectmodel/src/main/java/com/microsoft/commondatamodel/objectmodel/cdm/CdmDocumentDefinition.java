// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.ImportsLoadStrategy;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ParameterCollection;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ImportInfo;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

public class CdmDocumentDefinition extends CdmObjectSimple implements CdmContainerDefinition {
  private static final String TAG = CdmDocumentDefinition.class.getSimpleName();

  protected Map<String, CdmObjectBase> internalDeclarations;
  protected boolean isDirty = true;
  protected boolean isValid;
  protected boolean declarationsIndexed;
  protected ImportPriorities importPriorities;
  private boolean needsIndexing;
  private CdmDefinitionCollection definitions;
  private CdmImportCollection imports;
  private String folderPath;
  private String namespace;
  private boolean importsIndexed;
  private boolean currentlyIndexing;
  private String name;
  private String schema;
  private String jsonSchemaSemanticVersion;
  private String documentVersion;
  private OffsetDateTime _fileSystemModifiedTime;

  /**
   * A list of all objects contained by this document.
   * Only using during indexing and cleared after indexing is done.
   */
  private List<CdmObjectBase> internalObjects;

  public CdmDocumentDefinition() {
  }

  public CdmDocumentDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setInDocument(this);
    this.setObjectType(CdmObjectType.DocumentDef);
    this.name = name;
    this.jsonSchemaSemanticVersion = getJsonSchemaSemanticVersionMinimumSave();
    this.documentVersion = null;
    this.needsIndexing = true;
    this.isDirty = true;
    this.importsIndexed = false;
    this.currentlyIndexing = false;
    this.isValid = true;

    this.imports = new CdmImportCollection(this.getCtx(), this);
    this.definitions = new CdmDefinitionCollection(this.getCtx(), this);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @return boolean
   */
  @Deprecated
  public boolean getNeedsIndexing() {
    return this.needsIndexing;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param value boolean
   */
  @Deprecated
  public void setNeedsIndexing(final boolean value) {
    this.needsIndexing = value;
  }

  /**
   * @return String
   * @deprecated Only for internal use. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public String getFolderPath() {
    return this.folderPath;
  }

  /**
   * @param folderPath String
   * @deprecated Only for internal use. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public void setFolderPath(final String folderPath) {
    this.folderPath = folderPath;
  }

  /**
   * @return String
   * @deprecated Only for internal use. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public String getNamespace() {
    return this.namespace;
  }

  /**
   * @param namespace String
   * @deprecated Only for internal use. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public void setNamespace(final String namespace) {
    this.namespace = namespace;
  }

  @Deprecated
  boolean isImportsIndexed() {
    return importsIndexed;
  }

  @Deprecated
  void setImportsIndexed(final boolean importsIndexed) {
    this.importsIndexed = importsIndexed;
  }

  @Deprecated
  boolean isCurrentlyIndexing() {
    return currentlyIndexing;
  }

  @Deprecated
  void setCurrentlyIndexing(final boolean currentlyIndexing) {
    this.currentlyIndexing = currentlyIndexing;
  }

  public CdmDefinitionCollection getDefinitions() {
    return this.definitions;
  }

  /**
   * @return CdmFolderDefinition
   * @deprecated Use the owner property instead. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmFolderDefinition getFolder() {
    return (CdmFolderDefinition) this.getOwner();
  }

  /**
   * @param folder CdmFolderDefinition
   * @deprecated Use the owner property instead. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setFolder(final CdmFolderDefinition folder) {
    this.setOwner(folder);
  }

  public CdmImportCollection getImports() {
    return this.imports;
  }

  public String getName() {
    return this.name;
  }

  public void setName(final String value) {
    this.name = value;
  }

  public String getJsonSchemaSemanticVersion() {
    return this.jsonSchemaSemanticVersion;
  }

  public void setJsonSchemaSemanticVersion(final String jsonSchemaSemanticVersion) {
    this.jsonSchemaSemanticVersion = jsonSchemaSemanticVersion;
  }

  public String getDocumentVersion() {
    return this.documentVersion;
  }

  public void setDocumentVersion(final String documentVersion) {
    this.documentVersion = documentVersion;
  }

  /**
   * finds the highest required semantic version in the document and set it
   */
  @Deprecated // not, but need to be internal
  public void discoverMinimumRequiredJsonSemanticVersion() {
    // ohyesicantoomutateafinalcapturedlocalinjava
    long[] maxVersion = {CdmObjectBase.semanticVersionStringToNumber(this.getJsonSchemaSemanticVersion())}; // may return -1, that is fine

    this.visit("", null, (obj, objPath) -> {
      CdmObjectBase objectBase = (CdmObjectBase) obj;
      // the object knows if semantics are being used that need a certain version
      long objVersion = objectBase.getMinimumSemanticVersion();
      if (objVersion > maxVersion[0]) {
        maxVersion[0] = objVersion;
      }

      return false;
    });
  
    this.setJsonSchemaSemanticVersion(CdmObjectBase.semanticVersionNumberToString(maxVersion[0]));
  }


  /**
   * Clear all document's internal caches and update the declared path of every object contained by this document.
   */
  void clearCaches() {
    // Clean all internal caches and flags
    this.internalDeclarations = new LinkedHashMap<>();
    this.internalObjects = new ArrayList<CdmObjectBase>();
    this.declarationsIndexed = false;
    this.importsIndexed = false;
    this.setImportPriorities(null);

    // Collects all the objects contained by this document and updates their DeclaredPath.
    this.visit("", null, (obj, objPath) -> {
      CdmObjectBase objectBase = (CdmObjectBase) obj;
      // Update the DeclaredPath property.
      ((CdmObjectBase) obj).setDeclaredPath(objPath);
      this.internalObjects.add(objectBase);
      return false;
    });
  }

  /**
   * Finds any relative corpus paths that are held within this document and makes them relative to
   * the new folder instead.
   * @param newFolder CdmFolderDefinition
   * @return boolean
   */
  boolean localizeCorpusPaths(CdmFolderDefinition newFolder) {
    final AtomicBoolean allWentWell = new AtomicBoolean(true);

    // shout into the void
    Logger.info(this.getCtx(), TAG, "localizeCorpusPaths", newFolder.getAtCorpusPath(), Logger.format("Localizing corpus paths in document '{0}'.", this.getName()));

    // find anything in the document that is a corpus path
    this.visit("", (iObject, path) -> {
      // i don't like that document needs to know a little about these objects
      // in theory, we could create a virtual function on cdmObject that localizes properties
      // but then every object would need to know about the documents and paths and such ...
      // also, i already wrote this code.
      switch (iObject.getObjectType()) {
        case Import: {
          final CdmImport typeObj = (CdmImport) iObject;
          final String localizeCorpusPath =
              localizeCorpusPath(typeObj.getCorpusPath(), newFolder, allWentWell);
          typeObj.setCorpusPath(
              localizeCorpusPath == null
                  ? typeObj.getCorpusPath()
                  : localizeCorpusPath);
          break;
        }
        case LocalEntityDeclarationDef:
        case ReferencedEntityDeclarationDef: {
          final CdmEntityDeclarationDefinition typeObj = (CdmEntityDeclarationDefinition) iObject;
          final String localizeCorpusPath =
              localizeCorpusPath(typeObj.getEntityPath(), newFolder, allWentWell);
          typeObj.setEntityPath(
              localizeCorpusPath == null
                  ? typeObj.getEntityPath()
                  : localizeCorpusPath);
          break;
        }
        case DataPartitionDef: {
          final CdmDataPartitionDefinition typeObj = (CdmDataPartitionDefinition) iObject;
          String localizeCorpusPath =
              localizeCorpusPath(typeObj.getLocation(), newFolder, allWentWell);
          typeObj.setLocation(
              localizeCorpusPath == null
                  ? typeObj.getLocation()
                  : localizeCorpusPath);

          localizeCorpusPath =
              localizeCorpusPath(typeObj.getSpecializedSchema(), newFolder, allWentWell);
          typeObj.setSpecializedSchema(
              localizeCorpusPath == null
                  ? typeObj.getSpecializedSchema()
                  : localizeCorpusPath);
          break;
        }
        case DataPartitionPatternDef: {
          final CdmDataPartitionPatternDefinition typeObj = (CdmDataPartitionPatternDefinition) iObject;
          String localizeCorpusPath =
              localizeCorpusPath(typeObj.getRootLocation(), newFolder, allWentWell);
          typeObj.setRootLocation(
              localizeCorpusPath == null
                  ? typeObj.getRootLocation()
                  : localizeCorpusPath);

          localizeCorpusPath =
              localizeCorpusPath(typeObj.getSpecializedSchema(), newFolder, allWentWell);
          typeObj.setSpecializedSchema(
              localizeCorpusPath == null
                  ? typeObj.getSpecializedSchema()
                  : localizeCorpusPath);
          break;
        }
        case E2ERelationshipDef: {
          final CdmE2ERelationship typeObj = (CdmE2ERelationship) iObject;
          String localizeCorpusPath =
              localizeCorpusPath(typeObj.getToEntity(), newFolder, allWentWell);
          typeObj.setToEntity(
              localizeCorpusPath == null
                  ? typeObj.getToEntity()
                  : localizeCorpusPath);

          localizeCorpusPath =
              localizeCorpusPath(typeObj.getFromEntity(), newFolder, allWentWell);
          typeObj.setFromEntity(
              localizeCorpusPath == null
                  ? typeObj.getFromEntity()
                  : localizeCorpusPath);
          break;
        }
        case ManifestDeclarationDef: {
          final CdmManifestDeclarationDefinition typeObj =
              (CdmManifestDeclarationDefinition) iObject;
          String localizeCorpusPath =
              localizeCorpusPath(typeObj.getDefinition(), newFolder, allWentWell);
          typeObj.setDefinition(
              localizeCorpusPath == null
                  ? typeObj.getDefinition()
                  : localizeCorpusPath);
          break;
        }
      }
      return false;
    }, null);

    return allWentWell.get();
  }


  
  /** 
   * Changes a relative corpus path to be relative to the new folder.
   * @param corpusPath corpus path
   * @param newFolder new foldser
   * @param allWentWell atomic boolean
   * @return String
   */
  private String localizeCorpusPath(
      final String corpusPath,
      final CdmFolderDefinition newFolder,
      final AtomicBoolean allWentWell) {
    // If this isn't a local path, then don't do anything to it.
    if (StringUtils.isNullOrTrimEmpty(corpusPath)) {
      return corpusPath;
    }

    // First, if there was no previous folder (odd) then just localize as best we can.
    CdmFolderDefinition oldFolder = (CdmFolderDefinition) this.getOwner();
    String newPath;
    if (oldFolder == null) {
      newPath =
          this.getCtx()
              .getCorpus()
              .getStorage()
              .createRelativeCorpusPath(corpusPath, newFolder);
    } else {
      // If the current value != the absolute path, then assume it is a relative path.
      String absPath =
          this.getCtx()
              .getCorpus()
              .getStorage()
              .createAbsoluteCorpusPath(corpusPath, oldFolder);
      if (Objects.equals(absPath, corpusPath)) {
        newPath = absPath; // Leave it alone.
      } else {
        // Make it relative to the new folder then.
        newPath =
            this.getCtx()
                .getCorpus()
                .getStorage()
                .createRelativeCorpusPath(absPath, newFolder);
      }
    }

    if (newPath == null) {
      allWentWell.set(false);
    }

    return newPath;
  }

  public CompletableFuture<Boolean> refreshAsync() {
    return this.refreshAsync(new ResolveOptions(this));
  }

  public CompletableFuture<Boolean> refreshAsync(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    this.needsIndexing = true;
    this.declarationsIndexed = false;
    this.importPriorities = null;
    this.importsIndexed = false;
    this.isValid = true;
    return this.indexIfNeededAsync(resOpt, true);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @param finalLoadImports boolean
   * @return CompletableFuture
   */
  @Deprecated
  public CompletableFuture<Boolean> indexIfNeededAsync(final ResolveOptions resOpt, final boolean finalLoadImports) {
    if (this.getOwner() == null) {
      Logger.error(this.getCtx(), TAG, "indexIfNeededAsync", this.getAtCorpusPath(), CdmLogCode.ErrValdnMissingDoc, this.name);
      return CompletableFuture.completedFuture(false);
    }

    final CdmCorpusDefinition corpus = ((CdmFolderDefinition) this.getOwner()).getCorpus();
    boolean needsIndexing = corpus.documentLibrary.markDocumentForIndexing(this);

    if (!needsIndexing) {
      return CompletableFuture.completedFuture(true);
    }

    return CompletableFuture.supplyAsync(() -> {
      boolean loadImports = finalLoadImports;
      // If the imports load strategy is "LazyLoad", loadImports value will be the one sent by the called function.
      if (resOpt.getImportsLoadStrategy() == ImportsLoadStrategy.DoNotLoad) {
        loadImports = false;
      } else if (resOpt.getImportsLoadStrategy() == ImportsLoadStrategy.Load) {
        loadImports = true;
      }

      Set<String> docsLoading = new HashSet<String>();

      // make the internal machinery pay attention to this document for this call.
      docsLoading.add(this.getAtCorpusPath());

      if (loadImports) {
        corpus.resolveImportsAsync(this, docsLoading, resOpt).join();
      }

      return corpus.indexDocuments(resOpt, loadImports, this, docsLoading);
    });
  }

  public CompletableFuture<Boolean> saveAsAsync(final String newName) {
    return saveAsAsync(newName, false);
  }

  public CompletableFuture<Boolean> saveAsAsync(final String newName, final boolean saveReferenced) {
    return saveAsAsync(newName, saveReferenced, new CopyOptions());
  }

  /**
   * Saves the document back through the adapter in the requested format.
   * Format is specified via document name/extension based on conventions:
   * 'model.json' for the back compatible model, '*.manifest.cdm.json' for manifest, '*.folio.cdm.json' for folio, *.cdm.json' for CDM definitions.
   * saveReferenced (default false) when true will also save any schema defintion documents that are
   * linked from the source doc and that have been modified. existing document names are used for those.
   * Returns false on any failure.
   * @param newName the new name
   * @param saveReferenced the save referenced flag
   * @param options the copy options
   * @return true if save succeeded, false otherwise
   */
  public CompletableFuture<Boolean> saveAsAsync(final String newName, final boolean saveReferenced, CopyOptions options) {
    if (options == null) {
      options = new CopyOptions();
    }
    CopyOptions finalOptions = options;
    return CompletableFuture.supplyAsync(() -> {
      try (Logger.LoggerScope logScope = Logger.enterScope(CdmDocumentDefinition.class.getSimpleName(), getCtx(), "saveAsAsync")) {

        final ResolveOptions resOpt = new ResolveOptions(this, getCtx().getCorpus().getDefaultResolutionDirectives());

        if (!this.indexIfNeededAsync(resOpt, false).join()) {
          Logger.error(getCtx(), TAG, "saveAsAsync", this.getAtCorpusPath(), CdmLogCode.ErrIndexFailed);
          return false;
        }

        if (newName.equals(this.getName())) {
          this.isDirty = false;
        }

        if (!this.getCtx().getCorpus().getPersistence().saveDocumentAsAsync(this, newName, saveReferenced, finalOptions).join()) {
          return false;
        }

        // Log the telemetry if the document is a manifest
        if (this instanceof CdmManifestDefinition) {
          for (CdmEntityDeclarationDefinition entity : ((CdmManifestDefinition) this).getEntities()) {
            if (entity instanceof CdmLocalEntityDeclarationDefinition) {
              ((CdmLocalEntityDeclarationDefinition) entity).resetLastFileModifiedOldTime();
            }
            for (CdmE2ERelationship relationship : ((CdmManifestDefinition) this).getRelationships()) {
              relationship.resetLastFileModifiedOldTime();
            }
          }
          Logger.ingestManifestTelemetry((CdmManifestDefinition) this, this.getCtx(), TAG, "saveAsAsync", this.getAtCorpusPath());
        }

        // Log the telemetry of all entities contained in the document
        else {
          for (CdmObjectDefinition obj : this.getDefinitions()) {
            if (obj instanceof CdmEntityDefinition) {
              Logger.ingestEntityTelemetry((CdmEntityDefinition) obj, this.getCtx(), TAG, "saveAsAsync", this.getAtCorpusPath());
            }
          }
        }
      }
        return true;
    });
  }

  CdmObject fetchObjectFromDocumentPath(final String objectPath, final ResolveOptions resOpt) {
    // in current document?
    if (this.internalDeclarations.containsKey(objectPath)) {
      return this.internalDeclarations.get(objectPath);
    } else {
      // this might be a request for an object def drill through of a reference.
      // path/(object)/paths
      // there can be several such requests in one path AND some of the requested
      // defintions might be defined inline inside a reference meaning the declared path
      // includes that reference name and could still be inside this document. example:
      // /path/path/refToInline/(object)/member1/refToSymbol/(object)/member2
      // the full path is not in this doc but /path/path/refToInline/(object)/member1/refToSymbol
      // is declared in this document. we then need to go to the doc for refToSymbol and
      // search for refToSymbol/member2

      // work backward until we find something in this document
      int lastObj = objectPath.lastIndexOf("/(object)");
      while (lastObj > 0) {
        String thisDocPart = thisDocPart = objectPath.substring(0, lastObj);
        if (this.internalDeclarations.containsKey(thisDocPart)) {
          CdmObjectReferenceBase thisDocObjRef = (CdmObjectReferenceBase)this.internalDeclarations.get(thisDocPart);
          CdmObjectDefinitionBase thatDocObjDef = thisDocObjRef.fetchObjectDefinition(resOpt);
          if (thatDocObjDef != null) {
            // get from other document.
            // but first fix the path to look like it is relative to that object as declared in that doc
            String thatDocPart = objectPath.substring(lastObj + "/(object)".length());
            thatDocPart = thatDocObjDef.getDeclaredPath() + thatDocPart;
            if (thatDocPart == objectPath) {
              // we got back to were we started. probably because something is just not found.
              return null;
            }
            return thatDocObjDef.getInDocument().fetchObjectFromDocumentPath(thatDocPart, resOpt);
          }
          return null;
        }
        lastObj = thisDocPart.lastIndexOf("/(object)");
      }
    }
    return null;
  }

  @Override
  public String fetchObjectDefinitionName() {
    return this.name;
  }

  @Override
  public String getAtCorpusPath() {
    if (this.getOwner() == null) {
      return "NULL:/" + this.name;
    } else {
      return this.getOwner().getAtCorpusPath() + this.name;
    }
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    if (preChildren != null && preChildren.invoke(this, pathFrom)) {
      return false;
    }
    if (this.getImports() != null && this.getImports()
        .visitList(pathFrom, preChildren, postChildren)) {
      return true;
    }
    if (this.getDefinitions() != null && this.getDefinitions()
        .visitList(pathFrom, preChildren, postChildren)) {
      return true;
    }
    return postChildren != null && postChildren.invoke(this, pathFrom);
  }

  @Override
  public <T extends CdmObjectDefinition> T fetchObjectDefinition(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    return null;
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.getName())) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("name"));
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  /**
   * @param resOpt Resolved options
   * @param options Copy options
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmDocumentDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmDocumentDefinition copy;
    if (host == null) {
      copy = new CdmDocumentDefinition(this.getCtx(), this.getName());
    } else {
      copy = (CdmDocumentDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setName(this.getName());
      copy.getDefinitions().clear();
      copy.declarationsIndexed = false;
      copy.internalDeclarations = new LinkedHashMap<>();
      copy.needsIndexing = true;
      copy.getImports().clear();
      copy.importsIndexed = false;
      copy.importPriorities = null;
    }

    copy.setInDocument(copy);
    copy.setDirty(true);
    copy.setFolderPath(this.getFolderPath());
    copy.setSchema(this.getSchema());
    copy.setJsonSchemaSemanticVersion(this.getJsonSchemaSemanticVersion());
    copy.setDocumentVersion(this.getDocumentVersion());

    for (final CdmObjectDefinition definition : this.getDefinitions()) {
      copy.getDefinitions().add(definition);
    }

    for (final CdmImport anImport : this.getImports()) {
      copy.getImports().add(anImport);
    }

    return copy;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @return ResolvedAttributeSetBuilder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @param under context
   * @return ResolvedAttributeSetBuilder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
    // return null intentionally
    return null;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // intentionally NOP
    return;
  }

  /**
   * @return date time offset
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public OffsetDateTime getFileSystemModifiedTime() {
    return _fileSystemModifiedTime;
  }

  /**
   * @param _fileSystemModifiedTime date time offset
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setFileSystemModifiedTime(final OffsetDateTime _fileSystemModifiedTime) {
    this._fileSystemModifiedTime = _fileSystemModifiedTime;
  }

  /**
   * Validates all the objects in this document.
   */
  void checkIntegrity() {
    int errorCount = 0;

    for (CdmObjectBase obj : this.internalObjects) {
      if (!obj.validate()) {
        errorCount++;
      } else {
        obj.setCtx(this.getCtx());
      }

      Logger.info(this.getCtx(), TAG, "checkObjectIntegrity", null,
              Logger.format("Checked, folderPath: '{0}', path: '{1}'", this.getFolderPath(), obj.getDeclaredPath()));
    }

    this.isValid = Objects.equals(errorCount, 0);
  }

  /**
   * Indexes all definitions contained by this document.
   */
  void declareObjectDefinitions() {

    final String corpusPathRoot = this.getFolderPath() + this.getName();
    for (CdmObjectBase obj : this.internalObjects) {
      // I can't think of a better time than now to make sure any recently changed or added things have an in doc
      obj.setInDocument(this);
      String objPath = obj.getDeclaredPath();

      if (objPath.contains("(unspecified)")) {
        continue;
      }

      boolean skipDuplicates = false;
      switch (obj.getObjectType()) {
        case ConstantEntityDef:
          // if there is a duplicate, don't complain, the path just finds the first one
          skipDuplicates = true;
        case AttributeGroupDef:
        case EntityDef:
        case ParameterDef:
        case TraitDef:
        case PurposeDef:
        case TraitGroupDef:
        case AttributeContextDef:
        case DataTypeDef:
        case TypeAttributeDef:
        case EntityAttributeDef:
        case LocalEntityDeclarationDef:
        case ReferencedEntityDeclarationDef:
        case ProjectionDef:
        case OperationAddCountAttributeDef:
        case OperationAddSupportingAttributeDef:
        case OperationAddTypeAttributeDef:
        case OperationExcludeAttributesDef:
        case OperationArrayExpansionDef:
        case OperationCombineAttributesDef:
        case OperationRenameAttributesDef:
        case OperationReplaceAsForeignKeyDef:
        case OperationIncludeAttributesDef:
        case OperationAddAttributeGroupDef:
        case OperationAlterTraitsDef:
        case OperationAddArtifactAttributeDef:{
          final String corpusPath;
          if (corpusPathRoot.endsWith("/") || objPath.startsWith("/")) {
            corpusPath = corpusPathRoot + objPath;
          } else {
            corpusPath = corpusPathRoot + "/" + objPath;
          }
          if (this.internalDeclarations.containsKey(objPath) && !skipDuplicates) {
            Logger.error(this.getCtx(), TAG, "declareObjectDefinitions", corpusPath, CdmLogCode.ErrPathIsDuplicate, objPath);
            continue;
          } else {
            this.internalDeclarations.putIfAbsent(objPath, (CdmObjectBase)obj);

            this.getCtx().getCorpus().registerSymbol(objPath, this);
            Logger.info(this.getCtx(), TAG, "declareObjectDefinitions", corpusPath, Logger.format("Declared: '{0}'", corpusPath));
          }
          break;
        }

        default: {
          Logger.debug(this.getCtx(), TAG, "declareObjectDefinitions", this.getAtCorpusPath(), Logger.format("ObjectType not recognized: '{0}'", obj.getObjectType().name()));
          break;
        }
      }
    }
  }

  /**
   * Fetches the corresponding object definition for every object reference.
   * @param resOpt
   */
  void resolveObjectDefinitions(final ResolveOptions resOpt) {
    final ResolveContext ctx = (ResolveContext) this.getCtx();
    resOpt.setIndexingDoc(this);

    for (CdmObjectBase obj : this.internalObjects) {
      switch (obj.getObjectType()) {
        case AttributeRef:
        case AttributeGroupRef:
        case AttributeContextRef:
        case DataTypeRef:
        case EntityRef:
        case PurposeRef:
        case TraitRef: {
          ctx.setRelativePath(obj.getDeclaredPath());
          final CdmObjectReferenceBase objectRef = (CdmObjectReferenceBase) obj;

          if (CdmObjectReferenceBase.offsetAttributePromise(objectRef.getNamedReference()) < 0) {
            final CdmObject resNew = objectRef.fetchObjectDefinition(resOpt);

            if (null == resNew) {
              String message = Logger.format(
                      "Unable to resolve the reference '{0}' to a known object",
                      this.getAtCorpusPath(),
                      this.getFolderPath(),
                      objectRef.getNamedReference()
              );
              String messagePath = obj.getAtCorpusPath();
              // It's okay if references can't be resolved when shallow validation is enabled.
              if (resOpt.getShallowValidation()) {
                Logger.warning(ctx, TAG, "resolveObjectDefinitions", this.getAtCorpusPath(), CdmLogCode.WarnResolveReferenceFailure, objectRef.getNamedReference());
              } else {
                Logger.error(ctx, TAG, "resolveObjectDefinitions", this.getAtCorpusPath(), CdmLogCode.ErrResolveReferenceFailure, objectRef.getNamedReference());
              }
              // don't check in this file without both of these comments. handy for debug of failed lookups
              // final CdmObjectDefinition resTest = objectRef.fetchObjectDefinition(resOpt);
            } else {
              Logger.info(ctx, TAG, "resolveObjectDefinitions", resNew.getAtCorpusPath(), Logger.format("Resolved folderPath: '{0}', path: '{1}'", this.getFolderPath(), obj.getDeclaredPath()));
            }
          }

          break;
        }

        case ParameterDef: {
          // When a parameter has a data type that is a cdm object, validate that any default value
          // is the right kind object.
          final CdmParameterDefinition parameterDef = (CdmParameterDefinition) obj;
          parameterDef.constTypeCheck(resOpt, this, null);
          break;
        }

        default: {
          Logger.debug(ctx, TAG, "resolveObjectDefinitions", null, Logger.format("ObjectType not recognized: '{0}'", obj.getObjectType().name()));
          break;
        }
      }
    }

    resOpt.setIndexingDoc(null);
  }

  /**
   * Verifies if the trait argument data type matches what is specified on the trait definition.
   * @param resOpt
   */
  void resolveTraitArguments(
          final ResolveOptions resOpt) {
    final ResolveContext ctx = (ResolveContext) this.getCtx();

    for (CdmObjectBase obj : this.internalObjects) {
      if (obj.getObjectType() == CdmObjectType.TraitRef) {
        CdmTraitDefinition traitDef = obj.fetchObjectDefinition(resOpt);
        if (traitDef == null) {
          continue;
        }

        CdmTraitReference traitRef = (CdmTraitReference) obj;
        for (int argumentIndex = 0; argumentIndex < traitRef.getArguments().getCount(); ++argumentIndex) {
          CdmArgumentDefinition argument = traitRef.getArguments().get(argumentIndex);

          try {
            ctx.setRelativePath(argument.getDeclaredPath());
            final ParameterCollection parameterCollection = traitDef.fetchAllParameters(resOpt);
            final CdmParameterDefinition paramFound = parameterCollection.resolveParameter(argumentIndex, argument.getName());
            argument.setResolvedParameter(paramFound);

            // If parameter type is entity, then the value should be an entity or ref to one
            // same is true of 'dataType' data type.
            Object argumentValue = paramFound.constTypeCheck(resOpt, this, argument.getValue());
            if (argumentValue != null) {
              argument.setValue(argumentValue);
            }
          } catch (final Exception e) {
            Logger.error(ctx, TAG, "resolveTraitArguments", this.getAtCorpusPath(), CdmLogCode.ErrTraitResolutionFailure, traitDef.getName());
          }
        }

        traitRef.resolvedArguments = true;
      }
    }
  }

  /**
   * Marks that the document was indexed.
   * @param importsLoaded
   */
  void finishIndexing(final boolean importsLoaded) {
    Logger.debug(this.getCtx(), TAG, "indexDocuments", this.getAtCorpusPath(), Logger.format("index finish: {0}"));

    boolean wasIndexedPreviously = this.declarationsIndexed;

    this.getCtx().getCorpus().documentLibrary.markDocumentAsIndexed(this);
    this.setImportsIndexed(this.isImportsIndexed() || importsLoaded);
    this.declarationsIndexed = true;
    this.setNeedsIndexing(!importsLoaded);
    this.internalObjects = null;

    // if the document declarations were indexed previously, do not log again.
    if (!wasIndexedPreviously && this.isValid) {
      this.getDefinitions().forEach(def -> {
        if (def.getObjectType() == CdmObjectType.EntityDef) {
          Logger.debug(this.getCtx(), TAG, "finishDocumentResolve", def.getAtCorpusPath(), Logger.format("indexed: '{0}'", def.getAtCorpusPath()));
        }
      });
    }
  }

  private int prioritizeImports(final LinkedHashSet<CdmDocumentDefinition> processedSet, final ImportPriorities importPriorities,
                                int sequence, final boolean skipMonikered) {
    // goal is to make a map from the reverse order of imports (breadth first) to the first (aka last) sequence number in that list.
    // This gives the semantic that the 'last/shallowest' definition for a duplicate symbol wins,
    // the lower in this list a document shows up, the higher priority its definitions are for resolving conflicts.
    // for 'moniker' imports, keep track of the 'last/shallowest' use of each moniker tag.

    // maps document to priority.
    final Map<CdmDocumentDefinition, ImportInfo> priorityMap = importPriorities.getImportPriority();

    // maps moniker to document.
    final Map<String, CdmDocumentDefinition> monikerMap = importPriorities.getMonikerPriorityMap();

    // if already in list, don't do this again
    if (processedSet.contains(this)) {
      // if the first document in the priority map is this then the document was the starting point of the recursion.
      // and if this document is present in the processedSet we know that there is a circular list of imports.
      if (priorityMap.containsKey(this) && priorityMap.get(this).getPriority() == 0) {
          importPriorities.setHasCircularImport(true);
      }

      return sequence;
    }
    processedSet.add(this);

    if (this.getImports() != null) {

      // first add the imports done at this level only.
      final int l = this.getImports().getCount();
      final ArrayList<CdmDocumentDefinition> monikerImports = new ArrayList<>();
      // reverse order
      for (int i = l - 1; i >= 0; i--) {
        final CdmImport imp = this.getImports().get(i);
        final CdmDocumentDefinition impDoc = imp.getDocument();
        // moniker imports will be added to the end of the priority list later.
        final boolean isMoniker = !StringUtils.isNullOrTrimEmpty(imp.getMoniker());

        if (impDoc != null) {
          if (imp.getDocument() != null && !isMoniker && !priorityMap.containsKey(impDoc)) {
            // add doc.
            priorityMap.put(impDoc, new ImportInfo(sequence, false));
            sequence++;
          } else {
            monikerImports.add(impDoc);
          }
        } else {
          Logger.warning(this.getCtx(), TAG, "prioritizeImports", this.getAtCorpusPath(), CdmLogCode.WarnDocImportNotLoaded ,imp.getCorpusPath());
        }
      }

      // now add the imports of the imports.
      for (int i = l - 1; i >= 0; i--) {
        final CdmImport imp = this.getImports().get(i);
        final CdmDocumentDefinition impDoc = imp.getDocument();
        // don't add the moniker imports to the priority list.
        final boolean isMoniker = !StringUtils.isNullOrTrimEmpty(imp.getMoniker());

        if (impDoc == null) {
          Logger.warning(this.getCtx(), TAG, "prioritizeImports", this.getAtCorpusPath(), CdmLogCode.WarnDocImportNotLoaded, imp.getCorpusPath());
        }

        // if the document has circular imports its order on the impDoc.ImportPriorities list is not correct.
        // since the document itself will always be the first one on the list.
        if (impDoc != null && impDoc.importPriorities != null && !impDoc.importPriorities.getHasCircularImport()) {
          // lucky, already done so avoid recursion and copy.
          final ImportPriorities impPriSub = impDoc.getImportPriorities();
          impPriSub.getImportPriority().remove(impDoc); // because already added above.
          for (final Map.Entry<CdmDocumentDefinition, ImportInfo> ip : impPriSub.getImportPriority().entrySet()
              .stream().sorted(
                  Comparator.comparing(entry -> entry.getValue().getPriority()))
              .collect(Collectors.toList())) {
            // if the document is imported with moniker in another document do not include it in the priority list of this one.
            // moniker imports are only added to the priority list of the document that directly imports them.
            if (!priorityMap.containsKey(ip.getKey()) && !ip.getValue().getIsMoniker()) {
              // add doc
              priorityMap.put(ip.getKey(), new ImportInfo(sequence, false));
              sequence++;
            }
          }

          // if the import is not monikered then merge its monikerMap to this one.
          if (!isMoniker) {
            impPriSub.getMonikerPriorityMap().entrySet().forEach(mp -> {
              monikerMap.put(mp.getKey(), mp.getValue());
            });
          }
        } else if (impDoc != null) {
          // skip the monikered imports from here if this is a monikered import itself and we are only collecting the dependencies.
          sequence = impDoc.prioritizeImports(processedSet, importPriorities, sequence, isMoniker);
        }
      }

      // skip the monikered imports from here if this is a monikered import itself and we are only collecting the dependencies.
      if (!skipMonikered) {
        // moniker imports are prioritized by the 'closest' use of the moniker to the starting doc. so last one found in this recursion.
        for (int i = 0; i < l; i++) {
          final CdmImport imp = this.getImports().get(i);
          final boolean isMoniker = !StringUtils.isNullOrTrimEmpty(imp.getMoniker());
          if (imp.getDocument() != null && isMoniker) {
            monikerMap.put(imp.getMoniker(), imp.getDocument());
          }
        }

        // if the document index is zero, the document being processed is the root of the imports chain.
        // in this case add the monikered imports to the end of the priorityMap.
        if (priorityMap.containsKey(this) && priorityMap.get(this).getPriority() == 0) {
          for (final CdmDocumentDefinition imp : monikerImports) {
            if (!priorityMap.containsKey(imp)) {
              priorityMap.put(imp, new ImportInfo(sequence, true));
              sequence++;
            }
          }
        }

        // if the document index is zero, the document being processed is the root of the imports chain.
        // in this case add the monikered imports to the end of the priorityMap.
        if (priorityMap.containsKey(this) && priorityMap.get(this).getPriority() == 0) {
          for (final CdmDocumentDefinition imp : monikerImports) {
            if (!priorityMap.containsKey(imp)) {
              priorityMap.put(imp, new ImportInfo(sequence, true));
              sequence++;
            }
          }
        }
      }
    }
    return sequence;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param docDest CdmDocumentDefinition
   * @return String
   */
  @Deprecated
  public String importPathToDoc(CdmDocumentDefinition docDest) {
    return internalImportPathToDoc(this, "", docDest, new LinkedHashSet<>());
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @return CompletableFuture
   */
  @Deprecated
  public CompletableFuture<Boolean> saveLinkedDocumentsAsync() {
    return saveLinkedDocumentsAsync(null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param options Copy options
   * @return CompletableFuture
   */
  @Deprecated
  public CompletableFuture<Boolean> saveLinkedDocumentsAsync(final CopyOptions options) {
    // the only linked documents would be the imports
    return CompletableFuture.supplyAsync(() -> {
      if (this.getImports() != null) {
        for (final CdmImport anImport : this.getImports()) {
          final CdmImport imp = anImport;
          // get the document object from the import
          CdmDocumentDefinition docImp = null;
          try { 
            docImp = this.getCtx().getCorpus()
              .<CdmDocumentDefinition>fetchObjectAsync(imp.getCorpusPath(), this).join();
          } catch (ClassCastException e) {
            Logger.error(this.getCtx(), TAG, "saveLinkedDocumentsAsync", this.getAtCorpusPath(), CdmLogCode.ErrInvalidCast, imp.getCorpusPath(), "CdmDocumentDefinition");
          }
          if (docImp != null && docImp.isDirty) {
            // save it with the same name
            if (!docImp.saveAsAsync(docImp.getName(), true, options).join()) {
              Logger.error(this.getCtx(), TAG, "saveLinkedDocumentsAsync", this.getAtCorpusPath(), CdmLogCode.ErrDocImportSavingFailure, docImp.getName());
              return false;
            }
          }
        }
      }
      return true;
    });
  }

  public String getSchema() {
    return schema;
  }

  public void setSchema(final String schema) {
    this.schema = schema;
  }

  ImportPriorities getImportPriorities() {
    if (this.importPriorities == null) {
      final ImportPriorities importPriorities = new ImportPriorities();
      importPriorities.getImportPriority().put(this, new ImportInfo(0, false));
      this.prioritizeImports(new LinkedHashSet<>(), importPriorities, 1, false);
      this.importPriorities = importPriorities;
    }
    // make a copy so the caller doesn't mess these up
    return this.importPriorities.copy();
  }

  void setImportPriorities(final ImportPriorities importPriorities) {
    this.importPriorities = importPriorities;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @return boolean
   */
  @Deprecated
  public boolean isDirty() {
    return isDirty;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param dirty boolean
   */
  @Deprecated
  public void setDirty(final boolean dirty) {
    isDirty = dirty;
  }

  CompletableFuture<Void> reloadAsync() {
    return getCtx().getCorpus().fetchObjectAsync(getAtCorpusPath(), null, true)
        .thenAccept((v) -> {
        });
  }

  private String internalImportPathToDoc(final CdmDocumentDefinition docCheck, final String path, final CdmDocumentDefinition docDest, final HashSet<CdmDocumentDefinition> avoidLoop) {
    if (docCheck == docDest) {
      return "";
    }
    if (avoidLoop.contains(docCheck)) {
      return null;
    }
    avoidLoop.add(docCheck);
    // if the docDest is one of the monikered imports of docCheck, then add the moniker and we are cool
    if (docCheck.getImportPriorities() != null && docCheck.getImportPriorities().getMonikerPriorityMap() != null
            && docCheck.getImportPriorities().getMonikerPriorityMap().size() > 0) {
      for(final Map.Entry<String, CdmDocumentDefinition> monPair : docCheck.getImportPriorities().getMonikerPriorityMap().entrySet()) {
        if (monPair.getValue() == docDest) {
          return String.format("%s%s/", path, monPair.getKey());
        }
      }
    }
    // ok, what if the document can be reached directly from the imports here
    ImportInfo impInfo = docCheck.getImportPriorities() != null && docCheck.getImportPriorities().getImportPriority() != null ? docCheck.getImportPriorities().getImportPriority().get(docDest) : null;

    if (impInfo != null && !impInfo.getIsMoniker()) {
      // good enough
      return path;
    }

    // still nothing, now we need to check those docs deeper
    if (docCheck.getImportPriorities() != null && docCheck.getImportPriorities().getMonikerPriorityMap() != null
            && docCheck.getImportPriorities().getMonikerPriorityMap().size() > 0) {

      for(final Map.Entry<String, CdmDocumentDefinition> monPair : docCheck.getImportPriorities().getMonikerPriorityMap().entrySet()) {
        if (monPair.getValue() == docDest) {
          String pathFound = internalImportPathToDoc(monPair.getValue(), String.format("%s%s/", path, monPair.getKey()), docDest, avoidLoop);
          if (pathFound != null) {
            return pathFound;
          }
        }
      }
    }
    if (docCheck.getImportPriorities() != null && docCheck.getImportPriorities().getImportPriority() != null && docCheck.getImportPriorities().getImportPriority().size() > 0) {
      for(final Map.Entry<CdmDocumentDefinition, ImportInfo> impInfoPair : docCheck.getImportPriorities().getImportPriority().entrySet()) {
        if (impInfoPair.getValue().getIsMoniker()) {
          String pathFound = internalImportPathToDoc(impInfoPair.getKey(), path, docDest, avoidLoop);
          if (pathFound != null) {
            return pathFound;
          }
        }
      }
    }
    return null;
  }
}
