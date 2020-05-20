// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.ArrayList;
import java.util.Arrays;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.Errors;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class CdmImport extends CdmObjectSimple {

  private String moniker;
  private String corpusPath;
  private CdmDocumentDefinition doc;

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
   */
  CdmDocumentDefinition getDoc() {
    return doc;
  }

  void setDoc(final CdmDocumentDefinition doc) {
    this.doc = doc;
  }

  /**
   * Gets or sets the import path.
   */
  public String getCorpusPath() {
    return corpusPath;
  }

  public void setCorpusPath(final String value) {
    this.corpusPath = value;
  }

  /**
   * Gets or sets the import moniker.
   */
  public String getMoniker() {
    return moniker;
  }

  public void setMoniker(final String value) {
    this.moniker = value;
  }

  CdmDocumentDefinition getResolvedDocument() {
    return this.doc;
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.corpusPath)) {
      Logger.error(CdmImport.class.getSimpleName(), this.getCtx(), Errors.validateErrorString(this.getAtCorpusPath(), new ArrayList<String>(Arrays.asList("corpusPath"))));
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
   * @param resOpt
   * @return
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

    copy.setDoc(doc);
    return copy;
  }
}
