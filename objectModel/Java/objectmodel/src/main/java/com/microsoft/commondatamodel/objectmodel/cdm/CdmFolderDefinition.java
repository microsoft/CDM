// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

public class CdmFolderDefinition extends CdmObjectDefinitionBase implements CdmContainerDefinition {
  private static final String TAG = CdmFolderDefinition.class.getSimpleName();

  private final Map<String, CdmDocumentDefinition> documentLookup = new LinkedHashMap<>();
  private final CdmFolderCollection childFolders = new CdmFolderCollection(this.getCtx(), this);
  private final CdmDocumentCollection documents = new CdmDocumentCollection(this.getCtx(), this);

  private CdmCorpusDefinition corpus;
  private String name;
  private String folderPath;
  private String namespace;

  public CdmFolderDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx);

    this.name = name;
    this.folderPath = name + "/";
    setObjectType(CdmObjectType.FolderDef);
  }

  /**
   *
   * @return CdmCorpusDefinition
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmCorpusDefinition getCorpus() {
    return corpus;
  }

  /**
   *
   * @param corpus CdmCorpusDefinition
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setCorpus(final CdmCorpusDefinition corpus) {
    this.corpus = corpus;
  }

  @Override
  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name;
  }

  /**
   * @return String
   */
  public String getFolderPath() {
    return folderPath;
  }

  /**
   * @deprecated Only for internal use. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param folderPath String
   */
  @Deprecated
  public void setFolderPath(final String folderPath) {
    this.folderPath = folderPath;
  }

  public CdmFolderCollection getChildFolders() {
    return childFolders;
  }

  public CdmDocumentCollection getDocuments() {
    return documents;
  }

  /**
   *
   * @return String
   */
  public String getNamespace() {
    return namespace;
  }

  /**
   *
   * @param namespace String
   * @deprecated Only for internal use. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setNamespace(final String namespace) {
    this.namespace = namespace;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @return Map of String and CDM Definition
   */
  @Deprecated
  public Map<String, CdmDocumentDefinition> getDocumentLookup() {
    return documentLookup;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  CompletableFuture<CdmDocumentDefinition> fetchDocumentFromFolderPathAsync(
      final String objectPath,
      final boolean forceReload,
      final ResolveOptions resOpt) {
    final String docName;
    final int first = objectPath.indexOf("/");
    if (first < 0) {
      docName = objectPath;
    } else {
      docName = objectPath.substring(0, first);
    }

    final CdmDocumentDefinition doc = this.documentLookup.get(docName);
    // got that doc?
    if (this.documentLookup.containsKey(docName)) {
      if (!forceReload) {
        return CompletableFuture.completedFuture(doc);
      }
      if (doc.isDirty()) {
        Logger.warning(this.getCtx(), TAG, "fetchDocumentFromFolderPathAsync", this.getAtCorpusPath(), CdmLogCode.WarnDocChangesDiscarded , doc.getName());
      }
      this.documents.remove(docName);
    }

    return this.corpus.getPersistence().loadDocumentFromPathAsync(this, docName, doc, resOpt);
  }

  @Override
  public <T extends CdmObjectDefinition> T fetchObjectDefinition(ResolveOptions resOpt) {
    return null;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @return ResolvedTraitSet
   */
  @Override
  @Deprecated
  public ResolvedTraitSet fetchResolvedTraits(ResolveOptions resOpt) {
    return null;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param path path
   * @param makeFolder Make folder
   * @return CompletableFuture of CdmFolderDefinition
   */
  @Deprecated
  public CdmFolderDefinition fetchChildFolderFromPath(
      final String path,
      final boolean makeFolder) {
      String name;
      String remainingPath = path;
      CdmFolderDefinition childFolder = this;

      while (childFolder != null && remainingPath.indexOf('/') != -1) {
        int first = remainingPath.indexOf('/');
        if (first < 0) {
          name = remainingPath;
          remainingPath = "";
        } else {
          name = StringUtils.slice(remainingPath, 0, first);
          remainingPath = StringUtils.slice(remainingPath, first + 1);
        }

        if (!name.equalsIgnoreCase(childFolder.getName())) {
          Logger.error(this.getCtx(), TAG, "fetchChildFolderFromPath", this.getAtCorpusPath(), CdmLogCode.ErrInvalidPath, path);
          return null;
        }

        // the end?
        if (remainingPath.length() == 0) {
          return childFolder;
        }

        first = remainingPath.indexOf('/');
        String childFolderName = remainingPath;
        if (first != -1) {
          childFolderName = StringUtils.slice(remainingPath, 0, first);
        } else {
          // the last part of the path will be considered part of the part depending on the makeFolder flag.
          break;
        }

        // get next child folder.
        childFolder = childFolder.getChildFolders().getOrCreate(childFolderName);
      }

      if (makeFolder) {
        childFolder = childFolder.childFolders.add(remainingPath);
      }

      return childFolder;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  CompletableFuture<CdmFolderDefinition> fetchChildFolderFromPathAsync(final String path) {
    return fetchChildFolderFromPathAsync(path, false);
  }

  /**
   * @param path String 
   * @param makeFolder boolean
   * @return CompletableFuture of CdmFolderDefinition
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CompletableFuture<CdmFolderDefinition> fetchChildFolderFromPathAsync(
      final String path,
      final boolean makeFolder) {
      return CompletableFuture.completedFuture(this.fetchChildFolderFromPath(path, makeFolder));
  }

  @Override
  public boolean visit(
      final String pathRoot,
      final VisitCallback preChildren,
      final VisitCallback postChildren) {
    // Intended to return false;
    return false;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  @Override
  public String getAtCorpusPath() {
    if (this.namespace == null) {
      // We're not under any adapter (not in a corpus), so return special indicator.
      return "NULL:" + this.folderPath;
    } else {
      return this.namespace + ":" + this.folderPath;
    }
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.name)) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("name"));
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  /**
   *
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
    return CdmObjectBase.copyData(this, resOpt, options, CdmFolderDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, final CdmObject host) {
    return null;
  }
}
