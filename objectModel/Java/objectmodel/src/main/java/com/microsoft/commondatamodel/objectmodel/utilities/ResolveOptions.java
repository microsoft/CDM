// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import java.util.Arrays;
import java.util.HashSet;

public class ResolveOptions {
  /**
   * The document to use as a point of reference when resolving relative paths and symbol names.
   */
  private CdmDocumentDefinition wrtDoc;
  /**
   * A set of string flags that direct how attribute resolving traits behave.
   */
  private AttributeResolutionDirectiveSet directives;
  /**
   * When enabled, errors regarding references that are unable to be resolved or loaded are logged
   * as warnings instead.
   */
  private boolean shallowValidation;
  /**
   * the limit for the number of resolved attributes allowed per entity. if the number is exceeded, the resolution will fail
   */
  private Integer resolvedAttributeLimit = 4000;
  /**
   * Tracks the number of entity attributes that have been travered when collecting resolved traits
   * or attributes. prevents run away loops.
   */
  private Integer relationshipDepth;
  /**
   * When references get copied, use previous resolution results if available (for use with copy
   * method).
   */
  private boolean saveResolutionsOnCopy;
  /**
   * Set of set of symbol that the current chain of resolution depends upon. used with
   * importPriority to find what docs and versions of symbols to use.
   */
  private SymbolSet symbolRefSet;
  /**
   * Forces symbolic references to be re-written to be the precisely located reference based on the
   * wrtDoc
   */
  private CdmDocumentDefinition localizeReferencesFor;
  /**
   * CdmDocumentDefinition currently being indexed
   */
  private CdmDocumentDefinition indexingDoc;
  private String fromMoniker; // moniker that was found on the ref

  public ResolveOptions() {
    // Default constructor
  }

  /**
   * Creates a new instance of Resolve Options using most common parameters.
   * @param cdmDocument Document to use as point of reference when resolving relative paths and symbol names.
   */
  public ResolveOptions(final CdmDocumentDefinition cdmDocument) {
    this.setWrtDoc(cdmDocument);
    this.setDirectives(
        new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized")))
    );
    this.symbolRefSet = new SymbolSet();
  }

  /**
   * Creates a new instance of Resolve Options using most common parameters.
   * @param cdmDocument Document to use as point of reference when resolving relative paths and symbol names.
   * @param directives Directives to use when resolving attributes
   */
  public ResolveOptions(final CdmDocumentDefinition cdmDocument, AttributeResolutionDirectiveSet directives) {
    this.setWrtDoc(cdmDocument);
      this.setDirectives(directives != null ? directives.copy() : new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
    this.symbolRefSet = new SymbolSet();
  }

  /**
   * Creates a new instance of Resolve Options using most common parameters.
   * @param cdmObject A CdmObject from which to take the With Regards To Document
   */
  public ResolveOptions(final CdmObject cdmObject) {
    this.setWrtDoc(fetchDocument(cdmObject));
    this.setDirectives(
        new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized")))
    );
    this.symbolRefSet = new SymbolSet();
  }

  /**
   * Creates a new instance of Resolve Options using most common parameters.
   * @param cdmObject A CdmObject from which to take the With Regards To Document
   * @param directives Directives to use when resolving attributes
   */
  public ResolveOptions(final CdmObject cdmObject, AttributeResolutionDirectiveSet directives) {
    this.setWrtDoc(fetchDocument(cdmObject));
    this.setDirectives(directives != null ? directives.copy() : new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
    this.symbolRefSet = new SymbolSet();
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setSymbolRefSet(final SymbolSet symbolRefSet) {
    this.symbolRefSet = symbolRefSet;
  }

  public boolean getShallowValidation() {
    return shallowValidation;
  }

  public void setShallowValidation(final boolean shallowValidation) {
    this.shallowValidation = shallowValidation;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setSaveResolutionsOnCopy(final boolean saveResolutionsOnCopy) {
    this.saveResolutionsOnCopy = saveResolutionsOnCopy;
  }

  public void setDirectives(final AttributeResolutionDirectiveSet directives) {
    this.directives = directives;
  }

  public CdmDocumentDefinition getWrtDoc() {
    return wrtDoc;
  }

  public void setWrtDoc(final CdmDocumentDefinition wrtDoc) {
    this.wrtDoc = wrtDoc;
  }

  public Integer getResolvedAttributeLimit() { return this.resolvedAttributeLimit; }

  public void setResolvedAttributeLimit(final Integer resolvedAttributeLimit) { this.resolvedAttributeLimit = resolvedAttributeLimit; }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmDocumentDefinition getIndexingDoc() {
    return indexingDoc;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setRelationshipDepth(final Integer relationshipDepth) {
    this.relationshipDepth = relationshipDepth;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public boolean isSaveResolutionsOnCopy() {
    return saveResolutionsOnCopy;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public SymbolSet getSymbolRefSet() {
    return symbolRefSet;
  }

  public AttributeResolutionDirectiveSet getDirectives() {
    return directives;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setIndexingDoc(final CdmDocumentDefinition indexingDoc) {
    this.indexingDoc = indexingDoc;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Integer getRelationshipDepth() {
    return relationshipDepth;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmDocumentDefinition getLocalizeReferencesFor() {
    return localizeReferencesFor;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setLocalizeReferencesFor(final CdmDocumentDefinition localizeReferencesFor) {
    this.localizeReferencesFor = localizeReferencesFor;
  }

  /**
   * Returns a new copy of this object.
   *
   * @return New copy
   */
  public ResolveOptions copy() {
    final ResolveOptions resOptCopy = new ResolveOptions();
    resOptCopy.wrtDoc = this.wrtDoc;
    resOptCopy.relationshipDepth = this.relationshipDepth;
    if (this.directives != null) {
      resOptCopy.directives = this.directives.copy();
    }
    resOptCopy.localizeReferencesFor = this.localizeReferencesFor;
    resOptCopy.indexingDoc = this.indexingDoc;
    return resOptCopy;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public String getFromMoniker() {
    return fromMoniker;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setFromMoniker(final String fromMoniker) {
    this.fromMoniker = fromMoniker;
  }

  /**
   * Fetches the document that contains the owner of the CdmObject.
   * @param obj CdmObject to fetch the document for
   * @return Document to be used as starting point when resolving the CdmObject passed as argument.
   */
  private static CdmDocumentDefinition fetchDocument(CdmObject obj) {
      if (obj == null || obj.getOwner() == null) {
          return null;
      }

      return obj.getOwner().getInDocument();
  }

  /**
   * Checks if the limit for the number of attributes an entity can have has been reached
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public boolean checkAttributeCount(int amount)
  {
    if (this.getResolvedAttributeLimit() != null)
    {
      if (amount > this.getResolvedAttributeLimit())
      {
        return false;
      }
    }
    return true;
  }
}
