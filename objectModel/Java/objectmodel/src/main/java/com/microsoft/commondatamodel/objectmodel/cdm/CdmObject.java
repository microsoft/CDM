// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.List;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.TraitProfile;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.TraitProfileCache;
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
   * returns a list of TraitProfile descriptions, one for each trait applied to or exhibited by this object.
   * each description of a trait is an expanded picture of a trait reference.
   * the goal of the profile is to make references to structured, nested, messy traits easier to understand and compare.
   * we do this by promoting and merging some information as far up the trait inheritance / reference chain as far as we can without 
   * giving up important meaning.
   * in general, every trait profile includes:
   * 1. the name of the trait
   * 2. a TraitProfile for any trait that this trait may 'extend', that is, a base class trait
   * 3. a map of argument / parameter values that have been set
   * 4. an applied 'verb' trait in the form of a TraitProfile
   * 5. an array of any "classifier" traits that have been applied
   * 6. and array of any other (non-classifier) traits that have been applied or exhibited by this trait
   * 
   * Adjustments to these ideas happen as trait information is 'bubbled up' from base definitons. adjustments include
   * 1. the most recent verb trait that was defined or applied will propigate up the hierarchy for all references even those that do not specify a verb. 
   * This ensures the top trait profile depicts the correct verb
   * 2. traits that are applied or exhibited by another trait using the 'classifiedAs' verb are put into a different collection called classifiers.
   * 3. classifiers are accumulated and promoted from base references up to the final trait profile. this way the top profile has a complete list of classifiers 
   * but the 'deeper' profiles will not have the individual classifications set (to avoid an explosion of info)
   * 3. In a similar way, trait arguments will accumulate from base definitions and default values.
   * 4. traits used as 'verbs' (defaultVerb or explicit verb) will not include classifier descriptions, this avoids huge repetition of somewhat pointless info and recursive effort
   * @param resOpt The resolve options.
   * @param cache if specified, profiles for trait definitions will be pulled from and placed into the give cache. helps with runtime, size and persistance performace.
   * @param resOpt if specified, only traits that are applied directly or implicitly with the given verb name will be included.
   * @return List<TraitProfile>
   */
  List<TraitProfile> fetchTraitProfiles(ResolveOptions resOpt, TraitProfileCache cache, String forVerb);

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
