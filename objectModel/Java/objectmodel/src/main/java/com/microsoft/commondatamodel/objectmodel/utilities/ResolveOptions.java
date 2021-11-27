// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.enums.ImportsLoadStrategy;

import java.util.*;

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
   * Defines at which point the Object Model will try to load the imported documents.
   */
  private ImportsLoadStrategy importsLoadStrategy = ImportsLoadStrategy.LazyLoad;
  /**
   * The limit for the number of resolved attributes allowed per entity. if the number is exceeded, the resolution will fail
   */
  private Integer resolvedAttributeLimit = 4000;
  /**
   * The maximum value for the end ordinal in an ArrayExpansion operation
   */
  private int maxOrdinalForArrayExpansion = 20;
  /**
   * The maximum depth that entity attributes will be resolved before giving up
   */
  private int maxDepth = 2;
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
  /**
   * Contains information about the depth that we are resolving at
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public DepthInfo depthInfo;
  /**
   * Indicates whether we are resolving inside of a circular reference, resolution is different in that case
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public boolean inCircularReference;
  private HashMap<CdmAttributeContext, CdmAttributeContext> mapOldCtxToNewCtx;
  /**
   * @deprecated
   */
  public HashSet<CdmEntityDefinition> currentlyResolvingEntities;
  /**
   * Indicates if resolution guidance was used at any point during resolution
   * @deprecated
   */
  public boolean usedResolutionGuidance = false;

  /**
   * Creates a new instance of Resolve Options using most common parameters.
   * @param cdmDocument Document to use as point of reference when resolving relative paths and symbol names.
   */
  public ResolveOptions(final CdmDocumentDefinition cdmDocument) {
    this(cdmDocument, null);
  }

  /**
   * Creates a new instance of Resolve Options using most common parameters.
   * @param cdmDocument Document to use as point of reference when resolving relative paths and symbol names.
   * @param directives Directives to use when resolving attributes
   */
  public ResolveOptions(final CdmDocumentDefinition cdmDocument, AttributeResolutionDirectiveSet directives) {
    this();
    this.setWrtDoc(cdmDocument);
    this.setDirectives(directives != null ? directives.copy() : new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
  }

  /**
   * Creates a new instance of Resolve Options using most common parameters.
   * @param cdmObject A CdmObject from which to take the With Regards To Document
   */
  public ResolveOptions(final CdmObject cdmObject) {
    this(cdmObject, null);
  }

  /**
   * Creates a new instance of Resolve Options using most common parameters.
   * @param cdmObject A CdmObject from which to take the With Regards To Document
   * @param directives Directives to use when resolving attributes
   */
  public ResolveOptions(final CdmObject cdmObject, AttributeResolutionDirectiveSet directives) {
    this();
    this.setWrtDoc(fetchDocument(cdmObject));
    this.setDirectives(directives != null ? directives.copy() : new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
  }

  /**
   * Creates a new instance of Resolve Options using most common parameters.
   */
  public ResolveOptions() {
    this.symbolRefSet = new SymbolSet();

    this.depthInfo = new DepthInfo();
    this.inCircularReference = false;
    this.currentlyResolvingEntities = new HashSet<CdmEntityDefinition>();
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param symbolRefSet SymbolSet 
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

  public ImportsLoadStrategy getImportsLoadStrategy() {
    return importsLoadStrategy;
  }

  public void setImportsLoadStrategy(ImportsLoadStrategy importsLoadStrategy) {
    this.importsLoadStrategy = importsLoadStrategy;
  }

  /**
   * @return Boolean
   * @deprecated please use importsLoadStrategy instead.
   */
  @Deprecated
  public Boolean getStrictValidation() {
    if (this.importsLoadStrategy == ImportsLoadStrategy.LazyLoad) {
      return null;
    }
    return this.importsLoadStrategy == ImportsLoadStrategy.Load;
  }

  /**
   * @deprecated please use importsLoadStrategy instead.
   */
  @Deprecated
  public void setStrictValidation(final Boolean strictValidation) {
    if (strictValidation == null) {
      this.importsLoadStrategy = ImportsLoadStrategy.LazyLoad;
    } else if (strictValidation) {
      this.importsLoadStrategy = ImportsLoadStrategy.Load;
    } else {
      this.importsLoadStrategy = ImportsLoadStrategy.DoNotLoad;
    }
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param saveResolutionsOnCopy boolean 
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

  public int getMaxOrdinalForArrayExpansion() {
    return this.maxOrdinalForArrayExpansion;
  }

  public void setMaxOrdinalForArrayExpansion(final int maxOrdinalForArrayExpansion) {
    this.maxOrdinalForArrayExpansion = maxOrdinalForArrayExpansion;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return CdmDocumentDefinition
   */
  @Deprecated
  public CdmDocumentDefinition getIndexingDoc() {
    return indexingDoc;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return boolean
   */
  @Deprecated
  public boolean isSaveResolutionsOnCopy() {
    return saveResolutionsOnCopy;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return SymbolSet
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
   * @param indexingDoc CdmDocumentDefinition 
   */
  @Deprecated
  public void setIndexingDoc(final CdmDocumentDefinition indexingDoc) {
    this.indexingDoc = indexingDoc;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return CdmDocumentDefinition
   */
  @Deprecated
  public CdmDocumentDefinition getLocalizeReferencesFor() {
    return localizeReferencesFor;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param localizeReferencesFor CdmDocumentDefinition 
   */
  @Deprecated
  public void setLocalizeReferencesFor(final CdmDocumentDefinition localizeReferencesFor) {
    this.localizeReferencesFor = localizeReferencesFor;
  }

  public int getMaxDepth() {
    return maxDepth;
  }

  public void setMaxDepth(final int maxDepth) {
    this.maxDepth = maxDepth;
  }

  /**
   * Returns a new copy of this object.
   *
   * @return New copy
   */
  public ResolveOptions copy() {
    final ResolveOptions resOptCopy = new ResolveOptions();
    resOptCopy.wrtDoc = this.wrtDoc;
    resOptCopy.depthInfo = this.depthInfo.copy();
    resOptCopy.localizeReferencesFor = this.localizeReferencesFor;
    resOptCopy.indexingDoc = this.indexingDoc;
    resOptCopy.shallowValidation = this.shallowValidation;
    resOptCopy.resolvedAttributeLimit = this.resolvedAttributeLimit;
    resOptCopy.setMapOldCtxToNewCtx(this.mapOldCtxToNewCtx); // ok to share this map
    resOptCopy.importsLoadStrategy = this.importsLoadStrategy;
    resOptCopy.saveResolutionsOnCopy = this.saveResolutionsOnCopy;
    resOptCopy.currentlyResolvingEntities = this.currentlyResolvingEntities; // ok to share this map
    resOptCopy.usedResolutionGuidance = this.usedResolutionGuidance;

    if (this.directives != null) {
      resOptCopy.directives = this.directives.copy();
    }

    return resOptCopy;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return String
   */
  @Deprecated
  public String getFromMoniker() {
    return fromMoniker;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param fromMoniker String 
   */
  @Deprecated
  public void setFromMoniker(final String fromMoniker) {
    this.fromMoniker = fromMoniker;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return String
   */
  @Deprecated
  public HashMap<CdmAttributeContext, CdmAttributeContext> getMapOldCtxToNewCtx() {
    return mapOldCtxToNewCtx;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param mapOldCtxToNewCtx LinkedHashMap of CdmAttributeContext and CdmAttributeContext
   */
  @Deprecated
  public void setMapOldCtxToNewCtx(final HashMap<CdmAttributeContext, CdmAttributeContext> mapOldCtxToNewCtx) {
    this.mapOldCtxToNewCtx = mapOldCtxToNewCtx;
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
   * @param amount int
   * @return boolean
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
