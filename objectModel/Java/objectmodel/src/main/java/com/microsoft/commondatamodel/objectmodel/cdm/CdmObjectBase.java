// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTrait;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.SymbolSet;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.util.LinkedHashMap;
import java.util.Map;

public abstract class CdmObjectBase implements CdmObject {

  private int id;
  private CdmCorpusContext ctx;
  private CdmDocumentDefinition inDocument;
  private String atCorpusPath;
  private CdmObjectType objectType;
  private CdmObject owner;
  private boolean resolvingTraits = false;
  private String declaredPath;
  private Map<String, ResolvedTraitSetBuilder> traitCache;
  protected boolean resolvingAttributes = false;

  public CdmObjectBase() {
  }

  public CdmObjectBase(final CdmCorpusContext ctx) {
    this.id = CdmCorpusDefinition.getNextId();
    this.ctx = ctx;
  }

  /**
   *
   * @param instance
   * @param resOpt
   * @param options
   * @param <T>
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static <T extends CdmObject> Object copyData(
          final T instance,
          final ResolveOptions resOpt,
          final CopyOptions options) {
    return copyData(instance, resOpt, options, CdmObject.class);
  }

  /**
   *
   * @param instance
   * @param resOpt
   * @param options
   * @param classInterface
   * @param <T>
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static <T extends CdmObject> Object copyData(
          final T instance,
          ResolveOptions resOpt,
          CopyOptions options,
          final Class<T> classInterface) {

    if (resOpt == null) {
      resOpt = new ResolveOptions(instance, instance.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    if (options == null) {
      options = new CopyOptions();
    }

    final String persistenceTypeName = "CdmFolder";
    return PersistenceLayer.toData(instance, resOpt, options, persistenceTypeName, classInterface);
  }

  static CdmTraitReference resolvedTraitToTraitRef(final ResolveOptions resOpt, final ResolvedTrait rt) {
    final CdmTraitReference traitRef;

    if (rt.getParameterValues() != null && rt.getParameterValues().length() > 0) {
      traitRef = rt.getTrait().getCtx().getCorpus()
              .makeObject(CdmObjectType.TraitRef, rt.getTraitName(), false);

      final int l = rt.getParameterValues().length();

      if (l == 1) {
        // just one argument, use the shortcut syntax
        final Object val = rt.getParameterValues().fetchValue(0);

        if (val != null) {
          traitRef.getArguments().add(null, val);
        }
      } else {
        for (int i = 0; i < l; i++) {
          final CdmParameterDefinition param = rt.getParameterValues().fetchParameter(i);
          final Object val = rt.getParameterValues().getValues().get(i);

          if (val != null) {
            traitRef.getArguments().add(param.getName(), val);
          }
        }
      }
    } else {
      traitRef = rt.getTrait().getCtx().getCorpus()
              .makeObject(CdmObjectType.TraitRef, rt.getTraitName(), true);
    }

    if (resOpt.isSaveResolutionsOnCopy()) {
      // used to localize references between documents
      traitRef.setExplicitReference(rt.getTrait());
      traitRef.setInDocument(rt.getTrait().getInDocument());
    }

    // always make it a property when you can, however the dataFormat traits should be left alone
    if (rt.getTrait().getAssociatedProperties() != null
        && !rt.getTrait().isDerivedFrom("is.dataFormat", resOpt)) {
      traitRef.setFromProperty(true);
    }
    return traitRef;
  }

  static ResolveOptions copyResolveOptions(final ResolveOptions resOpt) {
    final ResolveOptions resOptCopy = new ResolveOptions();
    resOptCopy.setWrtDoc(resOpt.getWrtDoc());
    resOptCopy.setRelationshipDepth(resOpt.getRelationshipDepth());

    if (null != resOpt.getDirectives()) {
      resOptCopy.setDirectives(resOpt.getDirectives().copy());
    }

    resOptCopy.setLocalizeReferencesFor(resOpt.getLocalizeReferencesFor());
    resOptCopy.setIndexingDoc(resOpt.getIndexingDoc());
    resOptCopy.setShallowValidation((resOpt.getShallowValidation()));
    resOptCopy.setResolvedAttributeLimit(resOpt.getResolvedAttributeLimit());

    return resOptCopy;
  }

  /**
   * Calls the Visit function on all objects in the collection.
   * @param items
   * @param path
   * @param preChildren
   * @param postChildren
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static boolean visitList(final Iterable<?> items, final String path, final VisitCallback preChildren,
                                  final VisitCallback postChildren) {
    boolean result = false;
    if (items != null) {
      for (final Object element : items) {
        if (element != null) {
          if (((CdmObjectBase) element).visit(path, preChildren, postChildren)) {
            result = true;
            break;
          }
        }
      }
    }
    return result;
  }

  void clearTraitCache() {
    this.traitCache = null;
  }

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public String getDeclaredPath() {
    return declaredPath;
  }

  /**
   *
   * @param declaredPath
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setDeclaredPath(final String declaredPath) {
    this.declaredPath = declaredPath;
  }

  @Override
  public int getId() {
    return this.id;
  }

  @Override
  public void setId(final int value) {
    this.id = value;
  }

  @Override
  public CdmCorpusContext getCtx() {
    return this.ctx;
  }

  @Override
  public void setCtx(final CdmCorpusContext value) {
    this.ctx = value;
  }

  @Override
  public CdmDocumentDefinition getInDocument() {
    return this.inDocument;
  }

  @Override
  public void setInDocument(final CdmDocumentDefinition value) {
    this.inDocument = value;
  }

  @Override
  public String getAtCorpusPath() {
    if (this.getInDocument() == null) {
      return "NULL:/NULL/" + this.declaredPath;
    } else {
      return this.getInDocument().getAtCorpusPath() + "/" + this.declaredPath;
    }
  }

  @Override
  public CdmObjectType getObjectType() {
    return this.objectType;
  }

  @Override
  public void setObjectType(final CdmObjectType value) {
    this.objectType = value;
  }

  @Override
  public CdmObject getOwner() {
    return this.owner;
  }

  @Override
  public void setOwner(final CdmObject value) {
    this.owner = value;
  }

  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // intentionally NOP
    return;
  }

  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOptl) {
    return constructResolvedAttributes(resOptl, null);
  }

  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt,
                                                          final CdmAttributeContext under) {
    // Intentionally return null
    return null;
  }

  /**
   *
   * @param resOpt
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedTraitSet fetchResolvedTraits(ResolveOptions resOpt) {
    boolean wasPreviouslyResolving = this.getCtx().getCorpus().isCurrentlyResolving;
    this.getCtx().getCorpus().isCurrentlyResolving = true;

    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    final String kind = "rtsb";
    final ResolveContext ctx = (ResolveContext) this.getCtx();
    String cacheTagA = ctx.getCorpus().createDefinitionCacheTag(resOpt, this, kind);
    ResolvedTraitSetBuilder rtsbAll = null;
    if (this.getTraitCache() == null) {
      this.setTraitCache(new LinkedHashMap<>());
    } else if (!StringUtils.isNullOrTrimEmpty(cacheTagA)) {
      rtsbAll = this.getTraitCache().get(cacheTagA);
    }

    // store the previous document set, we will need to add it with
    // children found from the constructResolvedTraits call
    SymbolSet currDocRefSet = resOpt.getSymbolRefSet();
    if (currDocRefSet == null) {
      currDocRefSet = new SymbolSet();
    }
    resOpt.setSymbolRefSet(new SymbolSet());

    if (rtsbAll == null) {
      rtsbAll = new ResolvedTraitSetBuilder();

      if (!resolvingTraits) {
        resolvingTraits = true;
        this.constructResolvedTraits(rtsbAll, resOpt);
        resolvingTraits = false;
      }

      final CdmObjectDefinitionBase objDef = this.fetchObjectDefinition(resOpt);
      if (objDef != null) {
        // register set of possible docs
        ctx.getCorpus()
                .registerDefinitionReferenceSymbols(objDef, kind, resOpt.getSymbolRefSet());

        if (rtsbAll.getResolvedTraitSet() == null) {
          // nothing came back, but others will assume there is a set in this builder
          rtsbAll.setResolvedTraitSet(new ResolvedTraitSet(resOpt));
        }
        // get the new cache tag now that we have the list of docs
        cacheTagA = ctx.getCorpus().createDefinitionCacheTag(resOpt, this, kind);
        if (!StringUtils.isNullOrTrimEmpty(cacheTagA)) {
          this.getTraitCache().put(cacheTagA, rtsbAll);
        }
      }
    } else {
      // cache was found
      // get the SymbolSet for this cached object
      final String key = CdmCorpusDefinition.createCacheKeyFromObject(this, kind);
      final SymbolSet tempDocRefSet = ctx.getCorpus().getDefinitionReferenceSymbols()
              .get(key);
      resOpt.setSymbolRefSet(tempDocRefSet);
    }

    // merge child document set with current
    currDocRefSet.merge(resOpt.getSymbolRefSet());
    resOpt.setSymbolRefSet(currDocRefSet);

    this.getCtx().getCorpus().isCurrentlyResolving = wasPreviouslyResolving;
    return rtsbAll.getResolvedTraitSet();
  }

  /**
   *
   * @param resOpt
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedAttributeSet fetchResolvedAttributes(final ResolveOptions resOpt) {
    return fetchResolvedAttributes(resOpt, null);
  }

  /**
   *
   * @param resOpt
   * @param acpInContext
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedAttributeSet fetchResolvedAttributes(ResolveOptions resOpt,
                                                      final AttributeContextParameters acpInContext) {
    boolean wasPreviouslyResolving = this.getCtx().getCorpus().isCurrentlyResolving;
    this.getCtx().getCorpus().isCurrentlyResolving = true;

    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    final String kind = "rasb";
    final ResolveContext ctx = (ResolveContext) this.getCtx();
    String cacheTag = ctx.getCorpus()
            .createDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : "");
    Object rasbCache = null;
    if (cacheTag != null) {
      rasbCache = ctx.getCache().get(cacheTag);
    }
    CdmAttributeContext underCtx = null;

    // store the previous document set, we will need to add it with
    // children found from the constructResolvedTraits call
    SymbolSet currDocRefSet = resOpt.getSymbolRefSet();
    if (currDocRefSet == null) {
      currDocRefSet = new SymbolSet();
    }
    resOpt.setSymbolRefSet(new SymbolSet());

    // get the moniker that was found and needs to be appended to all
    // refs in the children attribute context nodes
    final String fromMoniker = resOpt.getFromMoniker();
    resOpt.setFromMoniker(null);

    if (rasbCache == null) {
      if (this.resolvingAttributes) {
        // re-entered this attribute through some kind of self or looping reference.
        this.getCtx().getCorpus().isCurrentlyResolving = wasPreviouslyResolving;
        return new ResolvedAttributeSet();
      }
      this.resolvingAttributes = true;

      // if a new context node is needed for these attributes, make it now
      if (acpInContext != null) {
        underCtx = CdmAttributeContext.createChildUnder(resOpt, acpInContext);
      }

      rasbCache = this.constructResolvedAttributes(resOpt, underCtx);

      if (rasbCache != null) {
        this.resolvingAttributes = false;

        // register set of possible docs
        final CdmObjectDefinition oDef = this.fetchObjectDefinition(resOpt);
        if (oDef != null) {
          ctx.getCorpus()
                  .registerDefinitionReferenceSymbols(oDef, kind, resOpt.getSymbolRefSet());

          // get the new cache tag now that we have the list of docs
          cacheTag = ctx.getCorpus()
                  .createDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : null);

          // save this as the cached version
          if (!StringUtils.isNullOrTrimEmpty(cacheTag) && rasbCache != null) {
            ctx.getCache().put(cacheTag, rasbCache);
          }

          if (!StringUtils.isNullOrTrimEmpty(fromMoniker)
                  && acpInContext != null
                  && this instanceof CdmObjectReference
                  && ((CdmObjectReference) this).getNamedReference() != null) {
            // create a fresh context
            final CdmAttributeContext oldContext = (CdmAttributeContext) acpInContext.getUnder()
                    .getContents()
                    .get(acpInContext.getUnder().getContents().size() - 1);
            acpInContext.getUnder()
                    .getContents()
                    .removeAt(acpInContext.getUnder().getContents().size() - 1);
            underCtx = CdmAttributeContext.createChildUnder(resOpt, acpInContext);

            CdmAttributeContext newContext =
                    oldContext.copyAttributeContextTree(
                            resOpt,
                            underCtx,
                            ((ResolvedAttributeSetBuilder) rasbCache).getResolvedAttributeSet(),
                            null,
                            fromMoniker);

            // Since THIS should be a reference to a thing found in a moniker document,
            // it already has a moniker in the reference.
            // This function just added that same moniker to everything in the sub-tree
            // but now this one symbol has too many.
            // Remove one.
            String monikerPathAdded = fromMoniker + "/";
            if (newContext.getDefinition() != null
                    && newContext.getDefinition().getNamedReference() != null
                    && newContext.getDefinition().getNamedReference().startsWith(monikerPathAdded)) {
              // Slice it off the front.
              newContext
                      .getDefinition()
                      .setNamedReference(
                              newContext
                                      .getDefinition()
                                      .getNamedReference()
                                      .substring(monikerPathAdded.length()));
            }
          }
        }
      }
    } else {
      // cache found. if we are building a context, then fix what we got instead of making a new one
      if (acpInContext != null) {
        // make the new context
        underCtx = CdmAttributeContext.createChildUnder(resOpt, acpInContext);

        //    TODO-BQ: 2019-08-16 Refactor.
        ((ResolvedAttributeSetBuilder) rasbCache).getResolvedAttributeSet()
                .getAttributeContext()
            .copyAttributeContextTree(
                resOpt,
                underCtx,
                ((ResolvedAttributeSetBuilder) rasbCache).getResolvedAttributeSet(),
                null,
                fromMoniker);
      }
    }

    // merge child document set with current
    currDocRefSet.merge(resOpt.getSymbolRefSet());
    resOpt.setSymbolRefSet(currDocRefSet);
    if (rasbCache instanceof ResolvedAttributeSetBuilder) {
      this.getCtx().getCorpus().isCurrentlyResolving = wasPreviouslyResolving;
      return ((ResolvedAttributeSetBuilder) rasbCache).getResolvedAttributeSet();
    }

    this.getCtx().getCorpus().isCurrentlyResolving = wasPreviouslyResolving;
    return null;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Map<String, ResolvedTraitSetBuilder> getTraitCache() {
    return this.traitCache;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setTraitCache(final Map<String, ResolvedTraitSetBuilder> traitCache) {
    this.traitCache = traitCache;
  }
}
