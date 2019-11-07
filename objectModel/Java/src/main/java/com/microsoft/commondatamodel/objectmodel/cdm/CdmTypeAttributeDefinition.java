package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.AttributeResolutionContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntityReferenceSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public class CdmTypeAttributeDefinition extends CdmAttribute {

  private CdmDataTypeReference dataType;
  private CdmAttributeContextReference attributeContext;
  private TraitToPropertyMap t2pm;

  public CdmTypeAttributeDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx, name);
    this.setObjectType(CdmObjectType.TypeAttributeDef);
  }

  public CdmAttributeContextReference getAttributeContext() {
    return attributeContext;
  }

  public void setAttributeContext(final CdmAttributeContextReference value) {
    this.attributeContext = value;
  }

  public String fetchDataFormat() {
    final Object dataFormat = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DATA_FORMAT);
    return dataFormat != null ? (String) dataFormat : "Unknown";
  }

  public void updateDataFormat(final String value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.DATA_FORMAT, value);
  }

  public CdmDataTypeReference getDataType() {
    return this.dataType;
  }

  public void setDataType(final CdmDataTypeReference value) {
    this.dataType = value;
  }

  public String fetchDefaultValue() {
    final Object defaultValue = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DEFAULT);
    return defaultValue != null ? (String) defaultValue : null;
  }

  public void updateDefaultValue(final Object value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.DEFAULT, value);
  }

  public String fetchDescription() {
    final Object description = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DESCRIPTION);
    return description != null ? (String) description : null;
  }

  public void updateDescription(final String value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.DESCRIPTION, value);
  }

  public String fetchDisplayName() {
    final Object displayName = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DISPLAY_NAME);
    return displayName != null ? (String) displayName : "Unknown";
  }

  public void setDisplayName(final String value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.DISPLAY_NAME, value);
  }

  public Boolean fetchIsNullable() {
    final Object nullable = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.IS_NULLABLE);
    return nullable != null ? (Boolean) nullable : null;
  }

  public void updateIsNullable(final Boolean value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.IS_NULLABLE, value);
  }

  public Boolean fetchIsPrimaryKey() {
    final Object primaryKey = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.IS_PRIMARY_KEY);
    return primaryKey != null ? (Boolean) primaryKey : null;
  }

  public Boolean fetchIsReadOnly() {
    final Object readOnly = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.IS_READ_ONLY);
    return readOnly != null ? (Boolean) readOnly : null;
  }

  public void updateIsReadOnly(final Boolean value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.IS_READ_ONLY, value);
  }

  public Integer fetchMaximumLength() {
    final Object maximumLength = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.MAXIMUM_LENGTH);
    if (maximumLength instanceof String) {
      return Integer.parseInt((String) maximumLength);
    }
    return maximumLength != null ? (Integer) maximumLength : null;
  }

  public void updateMaximumLength(final Integer value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.MAXIMUM_LENGTH, value);
  }

  public String fetchMaximumValue() {
    final Object maximumValue = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.MAXIMUM_VALUE);
    return maximumValue != null ? (String) maximumValue : null;
  }

  public void updateMaximumValue(final String value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.MAXIMUM_VALUE, value);
  }

  public String fetchMinimumValue() {
    final Object minimumValue = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.MINIMUM_VALUE);
    return minimumValue != null ? (String) minimumValue : null;
  }

  public void updateMinimumValue(final String value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.MINIMUM_VALUE, value);
  }

  public String fetchSourceName() {
    final Object sourceName = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.SOURCE_NAME);
    return sourceName != null ? (String) sourceName : "Unknown";
  }

  public void updateSourceName(final String value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.SOURCE_NAME, value);
  }

  public Integer fetchSourceOrdering() {
    final Object sourceOrdering = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.SOURCE_ORDERING);
    return sourceOrdering != null ? (Integer) sourceOrdering : null;
  }

  public void updateSourceOrderingToTrait(final Integer value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.SOURCE_ORDERING, value);
  }

  public Boolean fetchValueConstrainedToList() {
    return (Boolean) this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.VALUE_CONSTRAINED_TO_LIST);
  }

  public void updateValueConstrainedToList(final Boolean value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.VALUE_CONSTRAINED_TO_LIST, value);
  }

  /**
   *
   * @param propertyName
   * @return
   * @deprecated This class is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Object fetchProperty(final CdmPropertyName propertyName) {
    return this.getTraitToPropertyMap().fetchPropertyValue(propertyName, true);
  }

  public TraitToPropertyMap getTraitToPropertyMap() {
    if (this.t2pm == null) {
      this.t2pm = new TraitToPropertyMap(this);
    }
    return this.t2pm;
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
    if (this.getDataType() != null
            && this.getDataType().visit(path + "/dataType/", preChildren, postChildren)) {
      return true;
    }
    if (this.getAttributeContext() != null
            && this.getAttributeContext()
            .visit(path + "/attributeContext/", preChildren, postChildren)) {
      return true;
    }
    if (this.visitAtt(path, preChildren, postChildren)) {
      return true;
    }
    return postChildren != null && postChildren.invoke(this, path);
  }

  @Override
  public boolean validate() {
    return !Strings.isNullOrEmpty(this.getName());
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
    // find and cache the complete set of attributes
    // attributes definitions originate from and then get modified by subsequent re-definitions from (in this order):
    // the datatype used as an attribute, traits applied to that datatype,
    // the purpose of the attribute, dynamic traits applied to the attribute.
    final ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
    rasb.getResolvedAttributeSet().setAttributeContext(under);

    // add this attribute to the set
    // make a new one and apply dynamic traits
    final ResolvedAttribute newAtt = new ResolvedAttribute(resOpt, this, this.getName(), under);
    rasb.ownOne(newAtt);

    final ResolvedTraitSet rts = this.fetchResolvedTraits(resOpt);
    // this context object holds all of the info about what needs to happen to resolve these attribute
    // make a copy and add defaults if missing
    final CdmAttributeResolutionGuidance resGuideWithDefault;
    if (this.getResolutionGuidance() != null) {
      resGuideWithDefault = (CdmAttributeResolutionGuidance) this.getResolutionGuidance().copy(resOpt);
    } else {
      resGuideWithDefault = new CdmAttributeResolutionGuidance(this.getCtx());
    }
    resGuideWithDefault.updateAttributeDefaults(null);
    final AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuideWithDefault, rts);

    // from the traits of the datatype, purpose and applied here, see if new attributes get generated
    rasb.applyTraits(arc);
    rasb.generateApplierAttributes(arc, false); // false = don't apply these traits to added things
    // this may have added symbols to the dependencies, so merge them
    resOpt.getSymbolRefSet().merge(arc.getResOpt().getSymbolRefSet());

    return rasb;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // get from datatype
    if (this.getDataType() != null)
      rtsb.takeReference(this.dataType.fetchResolvedTraits(resOpt));
    // get from purpose
    if (this.getPurpose() != null)
      rtsb.mergeTraits(this.getPurpose().fetchResolvedTraits(resOpt));

    this.addResolvedTraitsApplied(rtsb, resOpt);

    // special case for attributes, replace a default "this.attribute" with this attribute on traits that elevate attribute
    final ResolvedTraitSet resolvedTraitSet = rtsb.getResolvedTraitSet();
    if (resolvedTraitSet != null && resolvedTraitSet.getHasElevated() != null && resolvedTraitSet.getHasElevated()) {
      final CdmAttributeReference replacement = new CdmAttributeReference(this.getCtx(), this.getName(), true);
      replacement.setCtx(this.getCtx());
      replacement.setExplicitReference(this);

      rtsb.replaceTraitParameterValue(resOpt, "does.elevateAttribute",
              "attribute", "this.attribute", replacement);
    }
    //rtsb.CleanUp();
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
    return CdmObjectBase.copyData(this, resOpt, options, CdmTypeAttributeDefinition.class);
  }

  @Override
  public CdmObject copy(final ResolveOptions resOpt) {
    final CdmTypeAttributeDefinition copy = new CdmTypeAttributeDefinition(this.getCtx(), this.getName());

    if (this.getDataType() != null) {
      copy.setDataType((CdmDataTypeReference) this.getDataType().copy(resOpt));
    }

    if (this.getAttributeContext() != null) {
      copy.setAttributeContext(
              (CdmAttributeContextReference) this.getAttributeContext().copy(resOpt));
    }

    this.copyAtt(resOpt, copy);
    return copy;
  }

  @Override
  public ResolvedEntityReferenceSet fetchResolvedEntityReferences(final ResolveOptions resOpt) {
    // Return null intentionally.
    return null;
  }

  @Override
  public boolean isDerivedFrom(final ResolveOptions resOpt, final String baseDef) {
    return false;
  }
}
