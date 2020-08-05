// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.ArrayList;
import java.util.Arrays;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.Errors;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class CdmArgumentDefinition extends CdmObjectSimple {
  private CdmParameterDefinition resolvedParameter;
  private String explanation;
  private String name;
  private Object value;
  private Object unResolvedValue;
  private String declaredPath;

  public CdmArgumentDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setObjectType(CdmObjectType.ArgumentDef);
    this.name = name;
  }

  public String getExplanation() {
    return this.explanation;
  }

  public void setExplanation(final String value) {
    this.explanation = value;
  }

  public String getName() {
    return this.name;
  }

  public void setName(final String value) {
    this.name = value;
  }

  public Object getValue() {
    return this.value;
  }

  public void setValue(final Object value) {
    this.value = value;
  }

  void setUnResolvedValue(final Object unResolvedValue) {
    this.unResolvedValue = unResolvedValue;
  }

  Object getUnResolvedValue() {
    return unResolvedValue;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmParameterDefinition getResolvedParameter() {
    return this.resolvedParameter;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setResolvedParameter(final CdmParameterDefinition resolvedParameter) {
    this.resolvedParameter = resolvedParameter;
  }

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmParameterDefinition getParameterDef() {
    return this.resolvedParameter;
  }

  /**
   *
   * @param resOpt
   * @param options
   * @return
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, Please refrain from using it.
   */
  @Deprecated
  @Override
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return PersistenceLayer.toData(this, resOpt, options, "CdmFolder", CdmArgumentDefinition.class);
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";

    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      path = this.declaredPath;

      if (StringUtils.isNullOrTrimEmpty(path)) {
        path = pathFrom; // name of arg is forced down from trait ref. you get what you get and you don't throw a fit.
        this.declaredPath = path;
      }
    }

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.getValue() != null && this.getValue() instanceof CdmObject) {
      final CdmObject value = (CdmObject) this.getValue();
      if (value.visit(path + "/value/", preChildren, postChildren)) {
        return true;
      }
    }
    if (postChildren != null && postChildren.invoke(this, path)) {
      return true;
    }

    return postChildren != null && postChildren.invoke(this, path);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmArgumentDefinition copy;
    if (host == null) {
      copy = new CdmArgumentDefinition(this.getCtx(), this.name);
    } else {
      copy = (CdmArgumentDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setName(this.getName());
    }

    if (this.getValue() != null) {
      if (this.getValue() instanceof CdmObject) {
        copy.setValue(((CdmObject) this.getValue()).copy(resOpt));
      } else if (this.getValue() instanceof String){
        copy.setValue(this.getValue());
      } else {
        Logger.error(CdmArgumentDefinition.class.getSimpleName(), this.getCtx(), "Failed to copy CdmArgumentDefinition.getValue(), not recognized type");
        throw new RuntimeException("Failed to copy CdmArgumentDefinition.getValue(), not recognized type");
      }
    }
    copy.setResolvedParameter(this.resolvedParameter);
    copy.setExplanation(this.getExplanation());
    return copy;
  }

  @Override
  public boolean validate() {
    if (this.getValue() == null) {
      Logger.error(CdmArgumentDefinition.class.getSimpleName(), this.getCtx(), Errors.validateErrorString(this.getAtCorpusPath(), new ArrayList<String>(Arrays.asList("value"))));
      return false;
    }
    return true;
  }
}
