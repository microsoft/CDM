// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class CdmConstantEntityDefinition extends CdmObjectDefinitionBase {
  private static final String TAG = CdmConstantEntityDefinition.class.getSimpleName();

  private String constantEntityName;
  private CdmEntityReference entityShape;
  private List<List<String>> constantValues;

  
  /** 
   * @return String
   */
  @Override
  public String getName() {
    // make up a name if one not given
    if (this.constantEntityName == null) {
      if (this.entityShape != null) {
        return "Constant" + this.entityShape.fetchObjectDefinitionName();
      }
      return "ConstantEntity";
    }
    return this.constantEntityName;
  }

  public CdmConstantEntityDefinition(final CdmCorpusContext ctx, final String constantEntityName) {
    super(ctx);
    this.setObjectType(CdmObjectType.ConstantEntityDef);
    this.setConstantEntityName(constantEntityName);
  }

  
  /** 
   * @param pathFrom Path From
   * @param preChildren Pre Children
   * @param postChildren Post Children
   * @return boolean
   */
  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";

    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      path = this.getDeclaredPath();

      if (StringUtils.isNullOrTrimEmpty(path)) {
        path = pathFrom + (!StringUtils.isNullOrEmpty(this.getConstantEntityName())
            ? this.getConstantEntityName()
            : "(unspecified)");
        this.setDeclaredPath(path);
      }
    }


    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.getEntityShape() != null) {
      this.getEntityShape().setOwner(this);
      if (this.getEntityShape().visit(path + "/entityShape/", preChildren, postChildren)) {
        return true;
      }
    }
    return postChildren != null && postChildren.invoke(this, path);
  }

  
  /** 
   * @param rtsb ResolvedTraitSetBuilder
   * @param resOpt ResolveOptions
   */
  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
//    LEFT BLANK INTENTIONALLY.
    return;
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
   * @param under CdmAttributeContext
   * @return ResolvedAttributeSetBuilder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
    final com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
    AttributeContextParameters acpEnt = null;
    if (under != null) {
      acpEnt = new AttributeContextParameters();
      acpEnt.setUnder(under);
      acpEnt.setType(CdmAttributeContextType.Entity);
      acpEnt.setName(this.getEntityShape().fetchObjectDefinitionName());
      acpEnt.setRegarding(this.getEntityShape());
      acpEnt.setIncludeTraits(true);
    }

    if (this.getEntityShape() != null) {
      rasb.mergeAttributes(this.getEntityShape().fetchResolvedAttributes(resOpt, acpEnt));
    }

    // things that need to go away
    rasb.removeRequestedAtts();
    return rasb;
  }

  
  /** 
   * @return boolean
   */
  @Override
  public boolean validate() {
    if (null == this.constantValues) {
      final String[] pathSplit = this.getDeclaredPath().split("/", -1);
      final String entityName = (pathSplit.length > 0) ? pathSplit[0] : new String();
      Logger.warning(this.getCtx(), TAG,"validate", this.getAtCorpusPath(), CdmLogCode.WarnValdnEntityNotDefined, entityName);
    }
    if (this.entityShape == null) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("entityShape"));
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
    return CdmObjectBase.copyData(this, resOpt, options, CdmConstantEntityDefinition.class);
  }

  
  /** 
   * @param resOpt Resolved options
   * @param host CDM Object
   * @return CdmObject
   */
  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmConstantEntityDefinition copy;
    if (host == null) {
      copy = new CdmConstantEntityDefinition(this.getCtx(), this.getConstantEntityName());
    } else {
      copy = (CdmConstantEntityDefinition) host;
      copy.setConstantEntityName(this.getConstantEntityName());
    }

    copy.setConstantEntityName(this.getConstantEntityName());
    copy.setEntityShape((CdmEntityReference) this.getEntityShape().copy(resOpt));
    if (this.getConstantValues() != null) {
      // deep copy the content
      copy.setConstantValues(new ArrayList<>());
      for (final List<String> row : this.getConstantValues()) {
        copy.getConstantValues().add(new ArrayList<>(row));
      }
    }
    this.copyDef(resOpt, copy);
    return copy;
  }

  
  /** 
   * @param baseDef String
   * @param resOpt Resolved options
   * @return boolean
   */
  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  /**
   * Gets or sets the constant entity name.
   * @return String
   */
  public String getConstantEntityName() {
    return this.constantEntityName;
  }

  
  /** 
   * @param value String
   */
  public void setConstantEntityName(final String value) {
    this.constantEntityName = value;
  }

  /**
   * Gets or sets the constant entity constant values.
   * @return List of List of String
   */
  public List<List<String>> getConstantValues() {
    return this.constantValues;
  }

  
  /** 
   * @param value List of List of String
   */
  public void setConstantValues(final List<List<String>> value) {
    this.constantValues = value;
  }

  /**
   * Gets or sets the constant entity shape.
   * @return CdmEntityReference
   */
  public CdmEntityReference getEntityShape() {
    return this.entityShape;
  }

  
  /** 
   * @param value CdmEntityReference
   */
  public void setEntityShape(final CdmEntityReference value) {
    this.entityShape = value;
  }

  /**
   * Returns constantValue.attReturn where constantValue.attSearch equals valueSearch.
   * @param resOpt Resolved options
   * @param attReturn Attribute return
   * @param attSearch Attribute Search
   * @param valueSearch Value search
   * @param order Order object
   * @return String
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public String fetchConstantValue(final ResolveOptions resOpt, final Object attReturn, final Object attSearch,
                                   final String valueSearch, final int order) {
    return this.findValue(resOpt, attReturn, attSearch, valueSearch, order);
  }

  /**
   * Returns constantValue.attReturn where constantValue.attSearch equals valueSearch.
   * @param resOpt Resolved options
   * @param attReturn Attribute return
   * @param newValue String 
   * @param attSearch Attribute Search
   * @param valueSearch Value search
   * @param order Order object
   * @return String
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public String updateConstantValue(final ResolveOptions resOpt, final Object attReturn, final String newValue, final Object attSearch,
                                    final String valueSearch, final int order) {
    return this.findValue(resOpt, attReturn, attSearch, valueSearch, order);
  }


  
  /** 
   * @param resOpt Resolved options
   * @param attReturn Attribute return
   * @param attSearch Attribute Search
   * @param valueSearch Value search
   * @param order Order object
   * @return String
   */
  private String findValue(final ResolveOptions resOpt, final Object attReturn, final Object attSearch,
                           final String valueSearch, final int order) {
    int resultAtt = -1;
    int searchAtt = -1;

    if (attReturn instanceof Integer) {
      resultAtt = (Integer) attReturn;
    }
    if (attSearch instanceof Integer) {
      searchAtt = (Integer) attSearch;
    }

    if (resultAtt == -1 || searchAtt == -1) {
      // metadata library
      final ResolvedAttributeSet ras = this.fetchResolvedAttributes(resOpt);
      // query validation and binding
      if (ras != null) {
        final int l = ras.getSet().size();
        for (int i = 0; i < l; i++) {
          final String name = ras.getSet().get(i).getResolvedName();
          if (resultAtt == -1 && name == attReturn) {
            resultAtt = i;
          }
          if (searchAtt == -1 && name == attSearch) {
            searchAtt = i;
          }
          if (resultAtt >= 0 && searchAtt >= 0) {
            break;
          }
        }
      }
    }

    // rowset processing
    if (resultAtt >= 0 && searchAtt >= 0) {
      if (this.getConstantValues() != null && this.getConstantValues().size() > 0) {

        int startAt = 0;
        int endBefore = this.getConstantValues().size();
        int increment = 1;
        if (order == -1) {
          increment = -1;
          startAt = this.getConstantValues().size() - 1;
          endBefore = -1;
        }
        for (int i = startAt; i != endBefore; i += increment) {
          if (this.getConstantValues().get(i).get(searchAtt).equals(valueSearch)) {
            final String result = this.getConstantValues().get(i).get(resultAtt);
            this.getConstantValues().get(i)
                .set(resultAtt, result);
            return result;
          }
        }
      }
    }

    return null;
  }
}
