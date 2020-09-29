// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.ArrayList;
import java.util.Arrays;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.Errors;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class CdmDataTypeDefinition extends CdmObjectDefinitionBase {

  private String dataTypeName;
  private CdmDataTypeReference extendsDataType;

  public CdmDataTypeDefinition(final CdmCorpusContext ctx, final String dataTypeName) {
    this(ctx, dataTypeName, null);
  }

  public CdmDataTypeDefinition(final CdmCorpusContext ctx, final String dataTypeName,
                               final CdmDataTypeReference extendsDataType) {
    super(ctx);
    this.setObjectType(CdmObjectType.DataTypeDef);
    this.setDataTypeName(dataTypeName);
    this.setExtendsDataType(extendsDataType);
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.dataTypeName)) {
      Logger.error(CdmDataTypeDefinition.class.getSimpleName(), this.getCtx(), Errors.validateErrorString(this.getAtCorpusPath(), new ArrayList<String>(Arrays.asList("dataTypeName"))));
      return false;
    }
    return true;
  }

  /**
   *
   * @param resOpt Resolve options
   * @param options Copy options
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmDataTypeDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    CdmDataTypeDefinition copy;
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    if (host == null) {
      copy = new CdmDataTypeDefinition(this.getCtx(), this.getDataTypeName(), null);
    } else {
      copy = (CdmDataTypeDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setDataTypeName(this.getDataTypeName());
    }

    if (this.getExtendsDataType() != null) {
      copy.setExtendsDataType((CdmDataTypeReference) this.getExtendsDataType().copy(resOpt));
    }

    this.copyDef(resOpt, copy);
    return copy;
  }

  @Override
  public String getName() {
    return this.dataTypeName;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    return this.isDerivedFromDef(resOpt, this.getExtendsDataType(), this.getName(), baseDef);
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";

    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      path = this.getDeclaredPath();

      if (Strings.isNullOrEmpty(path)) {
        path = pathFrom + this.getDataTypeName();
        this.setDeclaredPath(path);
      }
    }

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }

    if (this.getExtendsDataType() != null && this.getExtendsDataType()
        .visit(path + "/extendsDataType/", preChildren, postChildren)) {
      return true;
    }

    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }

    return postChildren != null && postChildren.invoke(this, path);
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    this.constructResolvedTraitsDef(this.getExtendsDataType(), rtsb, resOpt);
    //rtsb.CleanUp();
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
   * @param under attribue context
   * @return ResolvedAttributeSetBuilder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
    // Return null intentionally
    return null;
  }

  /**
   * Gets or sets the data type name.
   * @return String 
   */
  public String getDataTypeName() {
    return this.dataTypeName;
  }

  public void setDataTypeName(final String value) {
    this.dataTypeName = value;
  }

  /**
   * Gets or sets the data type extended by this data type.
   * @return CdmDataTypeReference
   */
  public CdmDataTypeReference getExtendsDataType() {
    return this.extendsDataType;
  }

  public void setExtendsDataType(final CdmDataTypeReference value) {
    this.extendsDataType = value;
  }
}
