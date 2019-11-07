// Copyright (c) Microsoft Corporation.

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
   * Sets the object declared path.
   */
  void setAtCorpusPath(final String atCorpusPath);
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
   * returns true if the object (or the referenced object) is an extension in some way from the specified symbol name
   * @param resOpt
   * @return
   */
  default boolean isDerivedFrom(ResolveOptions resOpt) {
    return this.isDerivedFrom(resOpt, null);
  }


  /**
   * Returns true if the object (or the referenced object) is an extension in some way from the specified symbol name.
   */
  boolean isDerivedFrom(ResolveOptions resOpt, String baseDef);

  /**
   * Runs the preChildren and postChildren input functions with this object as input, also calls
   * recursively on any objects this one contains.
   * @param pathRoot
   * @param preChildren
   * @param postChildren
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  boolean visit(String pathRoot, VisitCallback preChildren, VisitCallback postChildren);

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
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
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  default CdmObject copy() {
    return this.copy(new ResolveOptions(this));
  }

  /**
   *
   * @param resOpt
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  CdmObject copy(ResolveOptions resOpt);

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
