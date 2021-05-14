// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class CdmPurposeDefinition extends CdmObjectDefinitionBase {
  private static final String TAG = CdmPurposeDefinition.class.getSimpleName();

  public String purposeName;
  public CdmPurposeReference extendsPurpose;

  public CdmPurposeDefinition(final CdmCorpusContext ctx, final String purposeName) {
    this(ctx, purposeName, null);
  }

  public CdmPurposeDefinition(final CdmCorpusContext ctx, final String purposeName,
                              final CdmPurposeReference extendsPurpose) {
    super(ctx);
    this.setObjectType(CdmObjectType.PurposeDef);
    this.setPurposeName(purposeName);
    if (extendsPurpose != null) {
      this.setExtendsPurpose(extendsPurpose);
    }
  }

  @Override
  public String getName() {
    return this.getPurposeName();
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    return this.isDerivedFromDef(resOpt, this.getExtendsPurpose(), this.getName(), baseDef);
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";

    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      path = this.getDeclaredPath();

      if (Strings.isNullOrEmpty(path)) {
        path = pathFrom + this.getPurposeName();
        this.setDeclaredPath(path);
      }
    }

    if (preChildren != null && preChildren.invoke(this, path)){
      return false;
    }
    if (this.getExtendsPurpose() != null) {
      this.getExtendsPurpose().setOwner(this);
      if (this.getExtendsPurpose().visit(path + "/extendsPurpose/", preChildren, postChildren)) {
        return true;
      }
    }
    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }
    return postChildren != null && postChildren.invoke(this, path);
  }

  /**
   * Gets or sets the reference to the purpose extended by this.
   * @return CdmPurposeReference
   */
  public CdmPurposeReference getExtendsPurpose() {
    return this.extendsPurpose;
  }

  public void setExtendsPurpose(final CdmPurposeReference value) {
    this.extendsPurpose = value;
  }

  /**
   * Gets or sets the purpose name.
   * @return string
   */
  public String getPurposeName() {
    return this.purposeName;
  }

  public void setPurposeName(final String value) {
    this.purposeName = value;
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.purposeName)) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("purposeName"));
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), 
              String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    this.constructResolvedTraitsDef(this.getExtendsPurpose(), rtsb, resOpt);
  }

  /**
   *
   * @param resOpt Resolved option
   * @param options Copy option 
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmPurposeDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmPurposeDefinition copy;
    if (host == null) {
      copy = new CdmPurposeDefinition(this.getCtx(), this.getPurposeName(), null);
    } else {
      copy = (CdmPurposeDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setPurposeName(this.getPurposeName());
    }

    if (this.getExtendsPurpose() != null) {
      copy.setExtendsPurpose((CdmPurposeReference) this.getExtendsPurpose().copy(resOpt));
    }

    this.copyDef(resOpt, copy);
    return copy;
  }
}
