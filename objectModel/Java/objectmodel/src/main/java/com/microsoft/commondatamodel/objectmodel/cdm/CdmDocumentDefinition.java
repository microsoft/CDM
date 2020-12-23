// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.ImportsLoadStrategy;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.Errors;
import com.microsoft.commondatamodel.objectmodel.utilities.ImportInfo;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

public class CdmDocumentDefinition extends CdmObjectSimple implements CdmContainerDefinition {
  protected Map<String, CdmObjectBase> internalDeclarations;
  protected boolean isDirty = true;
  protected boolean isValid;
  protected boolean declarationsIndexed;
  protected ImportPriorities importPriorities;
  private boolean needsIndexing;
  private CdmDefinitionCollection definitions;
  private CdmImportCollection imports;
  private CdmFolderDefinition folder;
  private String folderPath;
  private String namespace;
  private boolean importsIndexed;
  private boolean currentlyIndexing;
  private String name;
  private String schema;
  private String jsonSchemaSemanticVersion;
  private String documentVersion;
  private OffsetDateTime _fileSystemModifiedTime;

  public CdmDocumentDefinition() {
  }

  public CdmDocumentDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setInDocument(this);
    this.setObjectType(CdmObjectType.DocumentDef);
    this.name = name;
    this.jsonSchemaSemanticVersion = getCurrentJsonSchemaSemanticVersion();
    this.documentVersion = null;
    this.needsIndexing = true;
    this.isDirty = true;
    this.importsIndexed = false;
    this.currentlyIndexing = false;
    this.isValid = true;

    this.clearCaches();

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

  /**
   * The maximum json semantic version supported by this ObjectModel version.
   */
  public static String getCurrentJsonSchemaSemanticVersion() {
    return "1.1.0";
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
    return this.folder;
  }

  /**
   * @param folder CdmFolderDefinition
   * @deprecated Use the owner property instead. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setFolder(final CdmFolderDefinition folder) {
    this.folder = folder;
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

  void clearCaches() {
    this.internalDeclarations = new LinkedHashMap<>();

    // Remove all of the cached paths and resolved pointers.
    this.visit("", null, (iObject, path) -> {
      ((CdmObjectBase) iObject).setDeclaredPath(null);
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
    boolean wasBlocking = this.getCtx().getCorpus().blockDeclaredPathChanges;
    this.getCtx().getCorpus().blockDeclaredPathChanges = true;

    // shout into the void
    Logger.info(
        CdmDocumentDefinition.class.getSimpleName(),
        this.getCtx(),
        Logger.format("Localizing corpus paths in document '{0}'.", this.getName()),
        "localizeCorpusPaths"
    );

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

    this.getCtx().getCorpus().blockDeclaredPathChanges = wasBlocking;

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

    return CompletableFuture.supplyAsync(() -> {
      if (this.getNeedsIndexing() && !this.currentlyIndexing) {
        if (this.getFolder() == null) {
          Logger.error(
              CdmDocumentDefinition.class.getSimpleName(),
              this.getCtx(),
              Logger.format("Document '{0}' is not in a folder", this.name),
              "indexIfNeededAsync"
          );
          return false;
        }

        final CdmCorpusDefinition corpus = this.getFolder().getCorpus();

        boolean loadImports = finalLoadImports;
        // If the imports load strategy is "LazyLoad", loadImports value will be the one sent by the called function.
        if (resOpt.getImportsLoadStrategy() == ImportsLoadStrategy.DoNotLoad) {
          loadImports = false;
        } else if (resOpt.getImportsLoadStrategy() == ImportsLoadStrategy.Load) {
          loadImports = true;
        }

        if (loadImports) {
          corpus.resolveImportsAsync(this, resOpt).join();
        }

        corpus.getDocumentLibrary().markDocumentForIndexing(this);
        return corpus.indexDocuments(resOpt, loadImports);
      }
      return true;
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
    try (Logger.LoggerScope logScope = Logger.enterScope(CdmDocumentDefinition.class.getSimpleName(), getCtx(), "saveAsAsync")) {
      if (options == null) {
        options = new CopyOptions();
      }

      final ResolveOptions resOpt = new ResolveOptions(this, getCtx().getCorpus().getDefaultResolutionDirectives());

      if (!this.indexIfNeededAsync(resOpt, false).join()) {
        Logger.error(
                CdmDocumentDefinition.class.getSimpleName(),
                getCtx(),
                Logger.format("Failed to index document prior to save '{0}'", this.getName()),
                "saveAsAsync"
        );
        return CompletableFuture.completedFuture(false);
      }

      if (newName.equals(this.getName())) {
        this.isDirty = false;
      }

      return this.getCtx().getCorpus().getPersistence().saveDocumentAsAsync(this, newName, saveReferenced, options);
    }
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
      String thisDocPart = objectPath;
      while (lastObj > 0) {
        thisDocPart = objectPath.substring(0, lastObj);
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
    if (this.folder == null) {
      return "NULL:/" + this.name;
    } else {
      return this.folder.getAtCorpusPath() + this.name;
    }
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
      Logger.error(CdmDocumentDefinition.class.getSimpleName(), this.getCtx(), Errors.validateErrorString(this.getAtCorpusPath(), new ArrayList<String>(Arrays.asList("name"))));
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

  OffsetDateTime getFileSystemModifiedTime() {
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
          Logger.warning(
                  CdmDocumentDefinition.class.getSimpleName(),
                  this.getCtx(),
                  Logger.format("Import document {0} not loaded. This might cause an unexpected output.'", imp.getCorpusPath()));
        }
      }

      // now add the imports of the imports.
      for (int i = l - 1; i >= 0; i--) {
        final CdmImport imp = this.getImports().get(i);
        final CdmDocumentDefinition impDoc = imp.getDocument();
        // don't add the moniker imports to the priority list.
        final boolean isMoniker = !StringUtils.isNullOrTrimEmpty(imp.getMoniker());

        if (impDoc == null) {
          Logger.warning(
            CdmDocumentDefinition.class.getSimpleName(),
            this.getCtx(),
            Logger.format("Import document {0} not loaded. This might cause an unexpected output.'", imp.getCorpusPath()));
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
          final CdmDocumentDefinition docImp = ((CdmDocumentDefinition) this.getCtx().getCorpus()
              .fetchObjectAsync(imp.getCorpusPath(), this).join());
          if (docImp != null && docImp.isDirty) {
            // save it with the same name
            if (!docImp.saveAsAsync(docImp.getName(), true, options).join()) {
              Logger.error(
                  CdmDocumentDefinition.class.getSimpleName(),
                  this.getCtx(),
                  Logger.format("Failed to save import '{0}'", docImp.getName()),
                  "saveLinkedDocumentsAsync"
              );
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
