// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CdmConstantEntityDefinition extends CdmObjectDefinitionBase {
  private static final Logger LOGGER = LoggerFactory.getLogger(CdmConstantEntityDefinition.class);

  private String constantEntityName;
  private CdmEntityReference entityShape;
  private List<List<String>> constantValues;

  @Override
  public String getName() {
    return this.constantEntityName;
  }

  public CdmConstantEntityDefinition(final CdmCorpusContext ctx, final String constantEntityName) {
    super(ctx);
    this.setObjectType(CdmObjectType.ConstantEntityDef);
    this.setConstantEntityName(constantEntityName);
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";

    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      path = this.getDeclaredPath();

      if (StringUtils.isNullOrTrimEmpty(path)) {
        path = pathFrom + (!Strings.isNullOrEmpty(this.getConstantEntityName())
            ? this.getConstantEntityName()
            : "(unspecified)");
        this.setDeclaredPath(path);
      }
    }


    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.getEntityShape() != null) {
      if (this.getEntityShape().visit(path + "/entityShape/", preChildren, postChildren)) {
        return true;
      }
    }
    return postChildren != null && postChildren.invoke(this, path);
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
//    LEFT BLANK INTENTIONALLY.
    return;
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
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

  @Override
  public boolean validate() {
    if (null == this.constantValues) {
      final String[] pathSplit = this.getDeclaredPath().split("/", -1);
      final String entityName = (pathSplit.length > 0) ? pathSplit[0] : new String();
      LOGGER.warn("constant entity '{}' defined without a constant value.", entityName);
    }
    return this.entityShape != null;
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
    return CdmObjectBase.copyData(this, resOpt, options, CdmConstantEntityDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this);
    }

    CdmConstantEntityDefinition copy;
    if (host == null) {
      copy = new CdmConstantEntityDefinition(this.getCtx(), this.getConstantEntityName());
    } else {
      copy = (CdmConstantEntityDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setConstantEntityName(this.getConstantEntityName());
    }

    copy.setConstantEntityName(this.getConstantEntityName());
    copy.setEntityShape((CdmEntityReference) this.getEntityShape().copy(resOpt));
    copy.setConstantValues(this.getConstantValues()); // is a deep copy needed?
    this.copyDef(resOpt, copy);
    return copy;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, final ResolveOptions resOpt) {
    return false;
  }

  /**
   * Gets or sets the constant entity name.
   */
  public String getConstantEntityName() {
    return this.constantEntityName;
  }

  public void setConstantEntityName(final String value) {
    this.constantEntityName = value;
  }

  /**
   * Gets or sets the constant entity constant values.
   */
  public List<List<String>> getConstantValues() {
    return this.constantValues;
  }

  public void setConstantValues(final List<List<String>> value) {
    this.constantValues = value;
  }

  /**
   * Gets or sets the constant entity shape.
   */
  public CdmEntityReference getEntityShape() {
    return this.entityShape;
  }

  public void setEntityShape(final CdmEntityReference value) {
    this.entityShape = value;
  }

  /**
   * Returns constantValue.attReturn where constantValue.attSearch equals valueSearch.
   * @param resOpt
   * @param attReturn
   * @param attSearch
   * @param valueSearch
   * @param order
   * @return
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
   * @param resOpt
   * @param attReturn
   * @param newValue
   * @param attSearch
   * @param valueSearch
   * @param order
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public String updateConstantValue(final ResolveOptions resOpt, final Object attReturn, final String newValue, final Object attSearch,
                                    final String valueSearch, final int order) {
    return this.findValue(resOpt, attReturn, attSearch, valueSearch, order);
  }


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
      final int l = ras.getSet().size();
      for (int i = 0; i < l; i++) {
        final String name = ras.getSet().get(1).getResolvedName();
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
