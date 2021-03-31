// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

  private String previousResolvedName;
  private ResolvedTraitSet resolvedTraits;
  private int insertOrder;
  private CdmAttributeContext attCtx;
  private AttributeResolutionContext arc;
  private ApplierState applierState;

  private TraitToPropertyMap t2pm;
  private String _resolvedName;
  private Object _target;
  // we need this instead of checking the size of the set because there may be attributes
  // nested in an attribute group and we need each of those attributes counted here as well
  private int resolvedAttributeCount;

  public ResolvedAttribute(final ResolveOptions resOpt, final Object target, final String defaultName,
                           final CdmAttributeContext attCtx) {
    this.setTarget(target);
    this.resolvedTraits = new ResolvedTraitSet(resOpt);
    this._resolvedName = defaultName;
    this.previousResolvedName = defaultName;
    this.attCtx = attCtx;
    // if the target is a resolved attribute set, then we are wrapping it. update the lineage of this new ra to point at all members of the set
    if (target instanceof ResolvedAttributeSet && attCtx != null) {
      final ResolvedAttributeSet rasSub = (ResolvedAttributeSet)target;
      if (rasSub.getSet() != null && rasSub.getSet().size() > 0) {
        rasSub.getSet().forEach((final ResolvedAttribute raSub) ->  {
          if (raSub.getAttCtx() != null  ) {
            this.attCtx.addLineage(raSub.getAttCtx());
          }
        });
      }
    }
  }

  public ResolvedAttribute copy() {
    final ResolveOptions resOpt = resolvedTraits.getResOpt(); // use the options from the traits

    final ResolvedAttribute copy = new ResolvedAttribute(resOpt, _target, _resolvedName, null);
    copy.updateResolvedName(getResolvedName());
    copy.setResolvedTraits(getResolvedTraits().shallowCopy());
    copy.insertOrder = insertOrder;
    copy.arc = arc;
    copy.attCtx = attCtx; // set here instead of constructor to avoid setting lineage for this copy

    if (copy.getTarget() instanceof ResolvedAttributeSet) {
      // deep copy when set contains sets. this copies the resolved att set and the context, etc.
      copy.setTarget(((ResolvedAttributeSet)copy.getTarget()).copy() );
    } else {
      CdmAttribute att = (CdmAttribute) this.getTarget();
      CdmAttribute copyAtt = (CdmAttribute) ((CdmAttribute) copy.getTarget()).copy();
      copy.setTarget(copyAtt);
      copyAtt.setOwner(att.getOwner());
      copyAtt.setInDocument(att.getInDocument());
    }

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
    if (this.attCtx != null) {
      if (this.attCtx.getName() == null) {
        this.attCtx.setName(this._resolvedName);
        this.attCtx.setAtCorpusPath(this.attCtx.getParent().fetchObjectDefinition(resOpt).getAtCorpusPath() + "/" + this._resolvedName);
      }
      if (this.attCtx.getDefinition() == null && _target instanceof CdmAttribute) {
        attCtx.setDefinition(((CdmAttribute) this.getTarget()).createPortableReference(resOpt));
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
      t2pm = new TraitToPropertyMap((CdmObject) _target);
    }
    return t2pm;
  }

  public Object getTarget() {
    return _target;
  }

  public void setTarget(final Object target) {
    if (target != null) {
      if (target instanceof CdmAttribute) {
        this.resolvedAttributeCount = ((CdmAttribute) target).getAttributeCount();
      } else if (target instanceof ResolvedAttributeSet)
      this.resolvedAttributeCount = ((ResolvedAttributeSet) target).getResolvedAttributeCount();
    }
    this._target = target;
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
   * @param resolvedName String
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
   * @return ResolvedTraitSet
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedTraitSet getResolvedTraits() {
    return resolvedTraits;
  }

  /**
   * @param resolvedTraits ResolvedTraitSet
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

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return int attribute count
   */
  @Deprecated
  public int getResolvedAttributeCount() { return this.resolvedAttributeCount; }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param resolvedAttributeCount attribute count
   */
  @Deprecated
  public void setResolvedAttributeCount(final int resolvedAttributeCount) { this.resolvedAttributeCount = resolvedAttributeCount; }
}
