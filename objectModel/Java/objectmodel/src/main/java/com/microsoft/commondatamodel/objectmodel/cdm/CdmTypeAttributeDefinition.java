// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.ArrayList;
import java.util.stream.Collectors;

import com.microsoft.commondatamodel.objectmodel.cdm.projections.CardinalitySettings;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.*;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionDirective;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class CdmTypeAttributeDefinition extends CdmAttribute {
  private static final String TAG = CdmTypeAttributeDefinition.class.getSimpleName();

  private CdmDataTypeReference dataType;
  private CdmAttributeContextReference attributeContext;

  private CdmProjection projection;
  private TraitToPropertyMap t2pm;

  public CdmTypeAttributeDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx, name);
    this.setObjectType(CdmObjectType.TypeAttributeDef);
    this.setAttributeCount(1);
  }

  public CdmAttributeContextReference getAttributeContext() {
    return attributeContext;
  }

  public void setAttributeContext(final CdmAttributeContextReference value) {
    this.attributeContext = value;
  }

  public CdmProjection getProjection() {
    return projection;
  }

  public void setProjection(CdmProjection projection) {
    if (projection != null) {
      projection.setOwner(this);
    }
    this.projection = projection;
  }

  public CdmDataFormat fetchDataFormat() {
    final Object dataFormat = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DATA_FORMAT);
    return dataFormat != null ? CdmDataFormat.valueOf((String)dataFormat) : CdmDataFormat.Unknown;
  }

  public void updateDataFormat(final CdmDataFormat value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.DATA_FORMAT, value);
  }

  public CdmDataTypeReference getDataType() {
    return this.dataType;
  }

  public void setDataType(final CdmDataTypeReference value) {
    this.dataType = value;
  }

  public Object fetchDefaultValue() {
    return this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DEFAULT);
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
    return (String) this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DISPLAY_NAME);
  }

  /**
   * @deprecated Please use updateDisplayName instead.
   * @param value String value
   */
  @Deprecated
  public void setDisplayName(final String value) {
    this.updateDisplayName(value);
  }

  public void updateDisplayName(final String value) {
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
    return (String) this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.SOURCE_NAME);
  }

  public void updateSourceName(final String value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.SOURCE_NAME, value);
  }

  public Integer fetchSourceOrdering() {
    final Object sourceOrdering = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.SOURCE_ORDERING);
    try {
      return Integer.parseInt((String)sourceOrdering);
    } catch (NumberFormatException ex) {
      return null;
    }
  }

  /**
   * @deprecated Please use updateSourceOrdering instead
   * @param value value
   */
  @Deprecated
  public void updateSourceOrderingToTrait(final Integer value) {
    this.updateSourceOrdering(value);
  }

  public void updateSourceOrdering(final Integer value) {
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
   * @param propertyName CdmPropertyName
   * @return Object
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Object fetchProperty(final CdmPropertyName propertyName) {
    return this.getTraitToPropertyMap().fetchPropertyValue(propertyName, true);
  }

  private TraitToPropertyMap getTraitToPropertyMap() {
    if (this.t2pm == null) {
      this.t2pm = new TraitToPropertyMap(this);
    }
    return this.t2pm;
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";

    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      path = this.getDeclaredPath();

      if (StringUtils.isNullOrEmpty(path)) {
        path = pathFrom + this.getName();
        this.setDeclaredPath(path);
      }
    }
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

    if (this.getProjection() != null
            && this.getProjection()
            .visit(path + "/projection/", preChildren, postChildren)) {
      return true;
    }
    if (this.visitAtt(path, preChildren, postChildren)) {
      return true;
    }
    return postChildren != null && postChildren.invoke(this, path);
  }

  @Override
  public boolean validate() {
    ArrayList<String> missingFields = new ArrayList<String>();

    if (StringUtils.isNullOrTrimEmpty(this.getName())) {
      missingFields.add("name");
    }

    if (this.getCardinality() != null) {
      if (StringUtils.isNullOrTrimEmpty(this.getCardinality().getMinimum())) {
        missingFields.add("cardinality.minimum");
      }
      if (StringUtils.isNullOrTrimEmpty(this.getCardinality().getMaximum())) {
        missingFields.add("cardinality.maximum");
      }
    }

    if (missingFields.size() > 0) {
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }

    if (this.getCardinality() != null) {
      if (!CardinalitySettings.isMinimumValid(this.getCardinality().getMinimum())) {
        Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnInvalidMinCardinality,  this.getCardinality().getMinimum());
        return false;
      }
      if (!CardinalitySettings.isMaximumValid(this.getCardinality().getMaximum())) {
        Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnInvalidMinCardinality, this.getCardinality().getMaximum());
        return false;
      }
    }

    return true;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
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

    if (this.getOwner() != null && this.getOwner().getObjectType() == CdmObjectType.EntityDef) {
      rasb.getResolvedAttributeSet().setTargetOwner((CdmEntityDefinition) this.getOwner());
    }

    if (this.getProjection() != null) {
      rasb.getResolvedAttributeSet().applyTraits(rts);

      ProjectionDirective projDirective = new ProjectionDirective(resOpt, this);
      ProjectionContext projCtx = this.getProjection().constructProjectionContext(projDirective, under, rasb.getResolvedAttributeSet());

      ResolvedAttributeSet ras = this.getProjection().extractResolvedAttributes(projCtx, under);
      rasb.setResolvedAttributeSet(ras);
    } else {
      // using resolution guidance

      // this context object holds all of the info about what needs to happen to resolve these attribute
      // make a copy and add defaults if missing
      final CdmAttributeResolutionGuidance resGuideWithDefault;
      if (this.getResolutionGuidance() != null) {
        resOpt.usedResolutionGuidance = true;
        resGuideWithDefault = (CdmAttributeResolutionGuidance) this.getResolutionGuidance().copy(resOpt);
      } else {
        resGuideWithDefault = new CdmAttributeResolutionGuidance(this.getCtx());
      }

      // renameFormat is not currently supported for type attributes.
      resGuideWithDefault.setRenameFormat(null);

      resGuideWithDefault.updateAttributeDefaults(null, this);
      final AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuideWithDefault, rts);

      // from the traits of the datatype, purpose and applied here, see if new attributes get generated
      rasb.applyTraits(arc);
      rasb.generateApplierAttributes(arc, false); // false = don't apply these traits to added things
      // this may have added symbols to the dependencies, so merge them
      resOpt.getSymbolRefSet().merge(arc.getResOpt().getSymbolRefSet());
    }

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
      replacement.setExplicitReference((CdmObjectDefinition) this.copy());
      replacement.setInDocument(this.getInDocument());
      replacement.setOwner(this);

      rtsb.replaceTraitParameterValue(resOpt, "does.elevateAttribute",
              "attribute", "this.attribute", replacement);
    }
    //rtsb.CleanUp();
  }

  /**
   *
   * @param resOpt Resolved option
   * @param options Copy options
   * @return Object
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
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmTypeAttributeDefinition copy;
    if (host == null) {
      copy = new CdmTypeAttributeDefinition(this.getCtx(), this.getName());
    } else {
      copy = (CdmTypeAttributeDefinition) host;
      copy.setName(this.getName());
    }

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

  /**
   * @deprecated for internal use only.
   */
  @Override
  public ResolvedEntityReferenceSet fetchResolvedEntityReferences(final ResolveOptions resOpt) {
    // Return null intentionally.
    return null;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }
}
