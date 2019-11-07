// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public class CdmParameterDefinition extends CdmObjectDefinitionBase {

  private String name;
  private Boolean isRequired;
  private CdmDataTypeReference dataTypeRef;
  private Object defaultValue;

  public CdmParameterDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setName(name);
    this.setObjectType(CdmObjectType.ParameterDef);
    this.setAtCorpusPath("");
  }

  @Override
  public boolean isDerivedFrom(final ResolveOptions resOpt, final String baseDef) {
    return false;
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = this.getDeclaredPath();
    if (Strings.isNullOrEmpty(path)) {
      path = pathFrom + this.getName();
      this.setDeclaredPath(path);
    }
    //trackVisits(path);

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.getDefaultValue() != null && this.getDefaultValue() instanceof CdmObject
            && ((CdmObject) this.getDefaultValue())
        .visit(path + "/defaultValue/", preChildren, postChildren)) {
      return true;
    }

    if (this.getDataTypeRef() != null && this.getDataTypeRef()
        .visit(path + "/dataType/", preChildren, postChildren)) {
      return true;
    }

    return postChildren != null && postChildren.invoke(this, path);
  }

  /**
   * Gets or sets the parameter name.
   */
  @Override
  public String getName() {
    return name;
  }

  public void setName(final String value) {
    this.name = value;
  }

  /**
   * Gets or sets the parameter default value.
   */
  public Object getDefaultValue() {
    return this.defaultValue;
  }

  public void setDefaultValue(final Object value) {
    this.defaultValue = value;
  }

  /**
   * Gets or sets if the parameter is required.
   */
  public Boolean isRequired() {
    return isRequired;
  }

  public void setRequired(final boolean value) {
    this.isRequired = value;
  }

  /**
   * Gets or sets the parameter data type reference.
   */
  public CdmDataTypeReference getDataTypeRef() {
    return dataTypeRef;
  }

  public void setDataTypeRef(final CdmDataTypeReference value) {
    this.dataTypeRef = value;
  }

  @Override
  public boolean validate() {
    return !Strings.isNullOrEmpty(this.name);
  }

  /**
   *
   * @param resOpt
   * @param options
   * @return
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmParameterDefinition.class);
  }

  @Override
  public CdmObject copy(final ResolveOptions resOpt) {
    final CdmParameterDefinition copy = new CdmParameterDefinition(this.getCtx(), this.getName());

    Object defVal = null;
    if (this.getDefaultValue() != null) {
      if (this.getDefaultValue() instanceof String) {
        defVal = this.getDefaultValue();
      } else {
        defVal = ((CdmObject) this.getDefaultValue()).copy(resOpt);
      }
    }
    copy.setExplanation(this.getExplanation());
    copy.setDefaultValue(defVal);
    copy.setRequired(this.isRequired());
    copy.setDataTypeRef(
            (CdmDataTypeReference) (this.getDataTypeRef() != null ? this.getDataTypeRef().copy(resOpt)
            : null));
    return copy;
  }
}
