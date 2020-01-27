// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import java.util.Arrays;
import java.util.HashSet;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
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
   * Tracks the number of entity attributes that have been travered when collecting resolved traits
   * or attributes. prevents run away loops.
   */
  private int relationshipDepth;
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
   * Forces symbolic references to be re-written to be the precicely located reference based on the
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

  public ResolveOptions(final CdmObject cdmObject) {
    if (cdmObject.getOwner() != null) {
      this.setWrtDoc(cdmObject.getOwner().getInDocument());
    }
    this.setDirectives(
        new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized")))
    );
    this.symbolRefSet = new SymbolSet();
  }

  public void setSymbolRefSet(final SymbolSet symbolRefSet) {
    this.symbolRefSet = symbolRefSet;
  }

  public CdmDocumentDefinition getWrtDoc() {
    return wrtDoc;
  }

  public void setWrtDoc(final CdmDocumentDefinition wrtDoc) {
    this.wrtDoc = wrtDoc;
  }

  public void setSaveResolutionsOnCopy(final boolean saveResolutionsOnCopy) {
    this.saveResolutionsOnCopy = saveResolutionsOnCopy;
  }

  public void setDirectives(final AttributeResolutionDirectiveSet directives) {
    this.directives = directives;
  }

  public CdmDocumentDefinition getIndexingDoc() {
    return indexingDoc;
  }

  public void setRelationshipDepth(final int relationshipDepth) {
    this.relationshipDepth = relationshipDepth;
  }

  public boolean isSaveResolutionsOnCopy() {
    return saveResolutionsOnCopy;
  }

  public SymbolSet getSymbolRefSet() {
    return symbolRefSet;
  }

  public AttributeResolutionDirectiveSet getDirectives() {
    return directives;
  }

  public void setIndexingDoc(final CdmDocumentDefinition indexingDoc) {
    this.indexingDoc = indexingDoc;
  }

  public int getRelationshipDepth() {
    return relationshipDepth;
  }

  public CdmDocumentDefinition getLocalizeReferencesFor() {
    return localizeReferencesFor;
  }

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

  public String getFromMoniker() {
    return fromMoniker;
  }

  public void setFromMoniker(final String fromMoniker) {
    this.fromMoniker = fromMoniker;
  }
}