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
   * Gets or sets the object id.
   */
  int getId();

  void setId(int value);

  /**
   * Gets or sets the object context.
   */
  CdmCorpusContext getCtx();

  void setCtx(CdmCorpusContext value);

  /**
   * Gets or sets the declaration document of the object.
   */
  CdmDocumentDefinition getInDocument();

  void setInDocument(CdmDocumentDefinition value);

  /**
   * Gets the object declared path.
   */
  String getAtCorpusPath();

  /**
   * Gets or sets the object type.
   */
  CdmObjectType getObjectType();

  void setObjectType(CdmObjectType value);

  /**
   * The object that owns or contains this object.
   */
  CdmObject getOwner();

  void setOwner(CdmObject value);

  /**
   * Returns the resolved object reference.
   */
  default <T extends CdmObjectDefinition> T fetchObjectDefinition() {
    return fetchObjectDefinition(new ResolveOptions(this));
  }

  /**
   * Returns the resolved object reference.
   */
  <T extends CdmObjectDefinition> T fetchObjectDefinition(ResolveOptions resOpt);

  /**
   * Returns the name of the object if this is a definition or the name of the referenced object if
   * this is an object reference.
   */
  String fetchObjectDefinitionName();

  /**
   * Returns true if the object (or the referenced object) is an extension in some way from the
   * specified symbol name.
   */
  default boolean isDerivedFrom(String baseDef) {
    return this.isDerivedFrom(baseDef, null);
  }

  /**
   * Returns true if the object (or the referenced object) is an extension in some way from the
   * specified symbol name.
   */
  boolean isDerivedFrom(String baseDef, ResolveOptions resOpt);

  /**
   * Runs the preChildren and postChildren input functions with this object as input, also calls
   * recursively on any objects this one contains.
   */
  boolean visit(String pathRoot, VisitCallback preChildren, VisitCallback postChildren);

  /**
   * Validates that the object is configured properly.
   */
  boolean validate();

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  default Object copyData() {
    return this.copyData(new ResolveOptions(this));
  }

  /**
   *
   * @param resOpt
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  default Object copyData(final ResolveOptions resOpt) {
    return this.copyData(resOpt, null);
  }

  /**
   *
   * @param resOpt
   * @param options
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  Object copyData(ResolveOptions resOpt, CopyOptions options);

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  default ResolvedTraitSet fetchResolvedTraits() {
    return this.fetchResolvedTraits(new ResolveOptions(this));
  }

  /**
   *
   * @param resOpt
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  ResolvedTraitSet fetchResolvedTraits(ResolveOptions resOpt);

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  default ResolvedAttributeSet fetchResolvedAttributes() {
    return this.fetchResolvedAttributes(new ResolveOptions(this));
  }

  /**
   *
   * @param resOpt
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  ResolvedAttributeSet fetchResolvedAttributes(ResolveOptions resOpt);

  /**
   *
   * @param resOpt
   * @param acpInContext
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  ResolvedAttributeSet fetchResolvedAttributes(ResolveOptions resOpt,
                                                  AttributeContextParameters acpInContext);

  /**
   * Creates a copy of this object.
   * Uses the default {@link ResolveOptions}. {@link CdmObject} is null by default.
   *
   * @return A copy of the object.
   * @see #copy(ResolveOptions, CdmObject).
   */
  default CdmObject copy() {
    return this.copy(new ResolveOptions(this));
  }

  /**
   * Creates a copy of this object. {@link CdmObject} is null by default.
   *
   * @param resOpt The resolve options.
   * @return A copy of the object.
   * @see #copy(ResolveOptions, CdmObject).
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
   * @return
   */
  default CdmObjectReference createSimpleReference() {
    return this.createSimpleReference(new ResolveOptions(this));
  }

  /**
   *
   * @param resOpt
   * @return
   */
  CdmObjectReference createSimpleReference(ResolveOptions resOpt);
}
