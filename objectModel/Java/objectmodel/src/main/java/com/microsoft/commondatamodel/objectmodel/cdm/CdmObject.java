// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public interface CdmObject {

  /**
   *
   * Gets or sets the object id.
   * @return int ID
   */
  int getId();

  void setId(int value);

  /**
   * Gets or sets the object context.
   * @return CDM Corpus context
   */
  CdmCorpusContext getCtx();

  void setCtx(CdmCorpusContext value);

  /**
   * Gets or sets the declaration document of the object.
   * @return CDM Document Definition   
   */
  CdmDocumentDefinition getInDocument();

  void setInDocument(CdmDocumentDefinition value);

  /**
   * Gets the object declared path.
   * @return string corpus path
   */
  String getAtCorpusPath();

  /**
   * Gets or sets the object type.
   * @return CDM Object Type   
   */
  CdmObjectType getObjectType();

  void setObjectType(CdmObjectType value);

  /**
   * The object that owns or contains this object.
   * @return CDM Object
   */
  CdmObject getOwner();

  void setOwner(CdmObject value);

  /**
   * Returns the resolved object reference.
   * @param <T> Type
   * @return List of CDM Object definitions
   */
  default <T extends CdmObjectDefinition> T fetchObjectDefinition() {
    return fetchObjectDefinition(new ResolveOptions(this));
  }

  /**
   * Returns the resolved object reference.
   * @param resOpt resolve options
   * @param <T> Type
   * @return List of CDM Object definitions   
   */
  <T extends CdmObjectDefinition> T fetchObjectDefinition(ResolveOptions resOpt);

  /**
   * Returns the name of the object if this is a definition or the name of the referenced object if
   * this is an object reference.
   * @return String object name definition
   */
  String fetchObjectDefinitionName();

  /**
   * Returns true if the object (or the referenced object) is an extension in some way from the
   * specified symbol name.
   * @param baseDef Base definition
   * @return boolean if the version is derived from base definition 
   */
  default boolean isDerivedFrom(String baseDef) {
    return this.isDerivedFrom(baseDef, null);
  }

  /**
   * Returns true if the object (or the referenced object) is an extension in some way from the
   * specified symbol name.
   * @param baseDef Base definition
   * @param resOpt Resolved options
   * @return boolean if the version is derived from base definition   
   */
  boolean isDerivedFrom(String baseDef, ResolveOptions resOpt);

  /**
   * Runs the preChildren and postChildren input functions with this object as input, also calls
   * recursively on any objects this one contains.
   * @param pathRoot Root path
   * @param preChildren pre call back
   * @param postChildren post Call back
   * @return boolean
   */
  boolean visit(String pathRoot, VisitCallback preChildren, VisitCallback postChildren);

  /**
   * Validates that the object is configured properly.
   * @return boolean
   */
  boolean validate();

  /**
   *
   * @return Object
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  default Object copyData() {
    return this.copyData(new ResolveOptions(this));
  }

  /**
   *
   * @param resOpt Resolv options
   * @return Object
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  default Object copyData(final ResolveOptions resOpt) {
    return this.copyData(resOpt, null);
  }

  /**
   *
   * @param resOpt Resolve options
   * @param options copy options
   * @return Object
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  Object copyData(ResolveOptions resOpt, CopyOptions options);

  /**
   *
   * @return Resolved traits list
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  default ResolvedTraitSet fetchResolvedTraits() {
    return this.fetchResolvedTraits(new ResolveOptions(this));
  }

  /**
   *
   * @param resOpt Resolve options
   * @return Resolved traits set
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  ResolvedTraitSet fetchResolvedTraits(ResolveOptions resOpt);

  /**
   *
   * @return Resolved attribute set
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  default ResolvedAttributeSet fetchResolvedAttributes() {
    return this.fetchResolvedAttributes(new ResolveOptions(this));
  }

  /**
   *
   * @param resOpt Resolve options
   * @return Tesolved attribute set
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  ResolvedAttributeSet fetchResolvedAttributes(ResolveOptions resOpt);

  /**
   *
   * @param resOpt Resolve options
   * @param acpInContext Attribute context parameters
   * @return Resolved attribute set
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  ResolvedAttributeSet fetchResolvedAttributes(ResolveOptions resOpt,
                                                  AttributeContextParameters acpInContext);

  /**
   * Creates a copy of this object.
   * Uses the default {@link ResolveOptions}. {@link CdmObject} is null by default.
   * @return A copy of the object.
   * @see #copy(ResolveOptions, CdmObject)
   */
  default CdmObject copy() {
    return this.copy(new ResolveOptions(this));
  }

  /**
   * Creates a copy of this object. {@link CdmObject} is null by default.
   * @param resOpt The resolve options.
   * @return A copy of the object.
   * @see #copy(ResolveOptions, CdmObject)
   */
  default CdmObject copy(ResolveOptions resOpt) {
    return this.copy(resOpt, null);
  }

  /**
   * Creates a copy of this object.
   *
   * @param resOpt The resolve options.
   * @param host   For CDM internal use. Copies the object INTO the provided host instead of
   *               creating a new object instance.
   * @return A copy of the object.
   */
  CdmObject copy(ResolveOptions resOpt, CdmObject host);

  /**
   *
   * @return CDM Object reference
   */
  default CdmObjectReference createSimpleReference() {
    return this.createSimpleReference(new ResolveOptions(this));
  }

  /**
   *
   * @param resOpt Resolve Options
   * @return CDM Object reference
   */
  CdmObjectReference createSimpleReference(ResolveOptions resOpt);

  /**
   *
   * @param resOpt Resolve Options
   * @return CDM Object reference
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  CdmObjectReference createPortableReference(ResolveOptions resOpt);
}
