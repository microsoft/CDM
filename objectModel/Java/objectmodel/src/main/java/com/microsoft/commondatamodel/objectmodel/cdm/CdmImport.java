// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class CdmImport extends CdmObjectSimple {

  private static final String TAG = CdmImport.class.getSimpleName();

  private String moniker;
  private String corpusPath;
  private CdmDocumentDefinition document;
  /**
   * Used when creating a copy of an import to figure out the new corpus path.
   */
  CdmObject previousOwner;

  public CdmImport(final CdmCorpusContext ctx, final String corpusPath, final String moniker) {
    super(ctx);
    this.setCorpusPath(corpusPath);
    this.setMoniker(moniker);
    this.setObjectType(CdmObjectType.Import);
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    if (preChildren != null && preChildren.invoke(this, pathFrom)) {
      return false;
    }
    return postChildren != null && postChildren.invoke(this, pathFrom);
  }

  /**
   * Gets or sets the document.
   * @return CdmDocumentDefinition
   */
  CdmDocumentDefinition getDocument() {
    return document;
  }

  void setDocument(final CdmDocumentDefinition document) {
    this.document = document;
  }

  /**
   * Gets or sets the import path.
   * @return String
   */
  public String getCorpusPath() {
    return corpusPath;
  }

  public void setCorpusPath(final String value) {
    this.corpusPath = value;
  }

  /**
   * Gets or sets the import moniker.
   * @return String
   */
  public String getMoniker() {
    return moniker;
  }

  public void setMoniker(final String value) {
    this.moniker = value;
  }

  @Override
  public String fetchObjectDefinitionName() {
    return null;
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.corpusPath)) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("corpusPath"));
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  @Override
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmImport.class);
  }

  /**
   *
   * @param resOpt Resolved options
   * @param host host
   * @return CDM Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmImport copy;
    if (host == null) {
      copy = new CdmImport(getCtx(), corpusPath, moniker);
    } else {
      copy = (CdmImport) host;
      copy.setCtx(this.getCtx());
      copy.setCorpusPath(this.getCorpusPath());
      copy.setMoniker(this.getMoniker());
    }

    copy.setDocument(
            this.getDocument() != null
                    ? (CdmDocumentDefinition) this.getDocument().copy(resOpt) : null);
    copy.previousOwner = this.getOwner();

    return copy;
  }
}
