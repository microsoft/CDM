package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.utilities.ApplierState;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import java.io.IOException;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedAttribute {

  private Object target;
  private String previousResolvedName;
  private ResolvedTraitSet resolvedTraits;
  private int insertOrder;
  private CdmAttributeContext attCtx;
  private AttributeResolutionContext arc;
  private ApplierState applierState;

  private TraitToPropertyMap t2pm;
  private String _resolvedName;

  public ResolvedAttribute(final ResolveOptions resOpt, final Object target, final String defaultName,
                           final CdmAttributeContext attCtx) {
    this.target = target;
    this.resolvedTraits = new ResolvedTraitSet(resOpt);
    this._resolvedName = defaultName;
    this.previousResolvedName = defaultName;
    this.attCtx = attCtx;
  }

  public ResolvedAttribute copy() {
    final ResolveOptions resOpt = resolvedTraits.getResOpt(); // use the options from the traits

    final ResolvedAttribute copy = new ResolvedAttribute(resOpt, target, _resolvedName, attCtx);
    copy.updateResolvedName(getResolvedName());
    copy.setResolvedTraits(fetchResolvedTraits().shallowCopy());
    copy.insertOrder = insertOrder;
    copy.arc = arc;

    if (applierState != null) {
      copy.setApplierState(applierState.copy());
    }

    return copy;
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent, final boolean nameSort)
          throws IOException {
    to.spewLine(indent + "[" + _resolvedName + "]");
    resolvedTraits.spew(resOpt, to, indent + '-', nameSort);
  }

  void completeContext(final ResolveOptions resOpt) {
    if (attCtx != null && attCtx.getName() == null) {
      attCtx.setName(_resolvedName);
      if (target instanceof CdmAttribute) {
        attCtx.setDefinition(((CdmAttribute) target).createSimpleReference(resOpt));
      }
      if (attCtx.getParent().fetchObjectDefinition(resOpt).getAtCorpusPath().endsWith("/") || _resolvedName.startsWith("/")) {
        attCtx.setAtCorpusPath(
                attCtx.getParent().fetchObjectDefinition(resOpt).getAtCorpusPath() + _resolvedName);
      } else {
        attCtx.setAtCorpusPath(
                attCtx.getParent().fetchObjectDefinition(resOpt).getAtCorpusPath() + "/" + _resolvedName);
      }
    }
  }

  public boolean isPrimaryKey() {
    return (Boolean) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.IS_PRIMARY_KEY);
  }

  public boolean isReadOnly() {
    return (Boolean) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.IS_READ_ONLY);
  }

  public boolean isNullable() {
    return (Boolean) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.IS_NULLABLE);
  }

  public String dataFormat() {
    return (String) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DATA_FORMAT);
  }

  public String sourceName() {
    return (String) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.SOURCE_NAME);
  }

  public int sourceOrdering() {
    return (Integer) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.SOURCE_ORDERING);
  }

  public String displayName() {
    return (String) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DISPLAY_NAME);
  }

  public String description() {
    return (String) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DESCRIPTION);
  }

  public String maximumValue() {
    return (String) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.MAXIMUM_VALUE);
  }

  public String minimumValue() {
    return (String) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.MINIMUM_VALUE);
  }

  public int maximumLength() {
    return (Integer) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.MAXIMUM_LENGTH);
  }

  public boolean valueConstrainedToList() {
    return (Boolean) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.VALUE_CONSTRAINED_TO_LIST);
  }

  public Object defaultValue() {
    return getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DEFAULT);
  }

  public int creationSequence() {
    return insertOrder;
  }

  TraitToPropertyMap getTraitToPropertyMap() {
    if (t2pm == null) {
      t2pm = new TraitToPropertyMap((CdmObject) target);
    }
    return t2pm;
  }

  public Object getTarget() {
    return target;
  }

  public void setTarget(final Object target) {
    this.target = target;
  }

  public String getPreviousResolvedName() {
    return previousResolvedName;
  }

  void setPreviousResolvedName(final String previousResolvedName) {
    this.previousResolvedName = previousResolvedName;
  }

  public String getResolvedName() {
    return _resolvedName;
  }

  /**
   *
   * @param resolvedName
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void updateResolvedName(final String resolvedName) {
    _resolvedName = resolvedName;
    if (previousResolvedName == null) {
      previousResolvedName = resolvedName;
    }
  }

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedTraitSet fetchResolvedTraits() {
    return resolvedTraits;
  }

  /**
   *
   * @param resolvedTraits
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setResolvedTraits(final ResolvedTraitSet resolvedTraits) {
    this.resolvedTraits = resolvedTraits;
  }

  public int getInsertOrder() {
    return insertOrder;
  }

  public void setInsertOrder(final int insertOrder) {
    this.insertOrder = insertOrder;
  }

  public CdmAttributeContext getAttCtx() {
    return attCtx;
  }

  public void setAttCtx(final CdmAttributeContext attCtx) {
    this.attCtx = attCtx;
  }

  public AttributeResolutionContext getArc() {
    return arc;
  }

  public void setArc(final AttributeResolutionContext arc) {
    this.arc = arc;
  }

  public ApplierState getApplierState() {
    return applierState;
  }

  public void setApplierState(final ApplierState applierState) {
    this.applierState = applierState;
  }
}
