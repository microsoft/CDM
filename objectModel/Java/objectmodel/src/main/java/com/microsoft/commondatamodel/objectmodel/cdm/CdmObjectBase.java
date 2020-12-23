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
import com.microsoft.commondatamodel.objectmodel.utilities.DepthInfo;
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
  protected boolean circularReference;

  public CdmObjectBase() {
  }

  public CdmObjectBase(final CdmCorpusContext ctx) {
    this.id = CdmCorpusDefinition.getNextId();
    this.ctx = ctx;
  }

  /**
   *
   * @param instance  instance
   * @param resOpt Resolved option
   * @param options Copy Options
   * @param <T> Type
   * @return CDM Object
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
   * @param instance instance
   * @param resOpt Resolved options
   * @param options Copy options
   * @param classInterface class interface
   * @param <T> Type
   * @return CDM Object
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
        final Object val = ProtectParameterValues(resOpt, rt.getParameterValues().getValues().get(0));

        if (val != null) {
          traitRef.getArguments().add(null, val);
        }
      } else {
        for (int i = 0; i < l; i++) {
          final CdmParameterDefinition param = rt.getParameterValues().fetchParameter(i);
          final Object val = ProtectParameterValues(resOpt, rt.getParameterValues().getValues().get(i));

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
    // also the wellKnown is the first constrained list that uses the datatype to hold the table instead of the default value property.
    // so until we figure out how to move the enums away from default value, show that trait too
    if (rt.getTrait().getAssociatedProperties() != null && !rt.getTrait().isDerivedFrom("is.dataFormat", resOpt) && !(rt.getTrait().getTraitName().equals("is.constrainedList.wellKnown"))) {
      traitRef.setFromProperty(true);
    }
    return traitRef;
  }

  /**
   * Calls the Visit function on all objects in the collection.
   * @param items Items
   * @param path path
   * @param preChildren pre visit callback
   * @param postChildren post visit callback
   * @return Boolean
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
   * @return string path
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public String getDeclaredPath() {
    return declaredPath;
  }

  /**
   *
   * @param declaredPath Declared path
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
      return this.getInDocument().getAtCorpusPath() + "/" + (this.declaredPath != null ? this.declaredPath : "");
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

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOptl Resolved Options
   * @return Resolved Attribute Set Builder
   */
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOptl) {
    return constructResolvedAttributes(resOptl, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved Options
   * @param under CDM attribute context
   * @return Resolved Attribute Set Builder
   */
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt,
                                                          final CdmAttributeContext under) {
    // Intentionally return null
    return null;
  }

  /**
   *
   * @param resOpt Resolve Options
   * @return Resolved trait set
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

  @Deprecated
  public ResolvedAttributeSetBuilder fetchObjectFromCache(ResolveOptions resOpt) {
    return this.fetchObjectFromCache(resOpt, null);
  }
  /**
   * @param resOpt Resolve Options
   * @param acpInContext Attribute Context Parameters
   * @return Resolved attribute set builder
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedAttributeSetBuilder fetchObjectFromCache(ResolveOptions resOpt, AttributeContextParameters acpInContext) {
    String kind = "rasb";
    final ResolveContext ctx = (ResolveContext) this.getCtx();
    String cacheTag = ctx.getCorpus().createDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : "");

    Object rasbCache = null;
    if (cacheTag != null) {
      rasbCache = ctx.getCache().get(cacheTag);
    }
    return (ResolvedAttributeSetBuilder)rasbCache;
  }

  /**
   *
   * @param resOpt Resolve Options
   * @return Resolved attribute set
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
   * @param resOpt Resolve Options
   * @param acpInContext Attribute context
   * @return Resolved attribute set
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
    ResolvedAttributeSetBuilder rasbResult = null;
    // keep track of the context node that the results of this call would like to use as the parent
    CdmAttributeContext parentCtxForResult = null;
    ResolvedAttributeSetBuilder rasbCache = this.fetchObjectFromCache(resOpt, acpInContext);
    CdmAttributeContext underCtx = null;
    if (acpInContext != null)
    {
      parentCtxForResult = acpInContext.getUnder();
    }

    // store the previous document set, we will need to add it with
    // children found from the constructResolvedTraits call
    SymbolSet currDocRefSet = resOpt.getSymbolRefSet();
    if (currDocRefSet == null) {
      currDocRefSet = new SymbolSet();
    }
    resOpt.setSymbolRefSet(new SymbolSet());

    // if using the cache passes the maxDepth, we cannot use it
    if (rasbCache != null && resOpt.depthInfo != null && resOpt.depthInfo.getMaxDepth() != null
        && resOpt.depthInfo.getCurrentDepth() + rasbCache.getResolvedAttributeSet().getDepthTraveled() > resOpt.depthInfo.getMaxDepth()) {
      rasbCache = null;
    }

    if (rasbCache == null) {
      if (this.resolvingAttributes) {
        // re-entered this attribute through some kind of self or looping reference.
        this.getCtx().getCorpus().isCurrentlyResolving = wasPreviouslyResolving;
        //return new ResolvedAttributeSet();  // uncomment this line as a test to turn off allowing cycles
        resOpt.inCircularReference = true;
        this.circularReference = true;
      }
      this.resolvingAttributes = true;

      // a new context node is needed for these attributes,
      // this tree will go into the cache, so we hang it off a placeholder parent
      // when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
      // put into the 'receiving' tree
      underCtx = CdmAttributeContext.getUnderContextForCacheContext(resOpt, this.getCtx(), acpInContext);

      rasbCache = this.constructResolvedAttributes(resOpt, underCtx);

      this.resolvingAttributes = false;

      if (rasbCache != null) {
        // register set of possible docs
        final CdmObjectDefinition oDef = this.fetchObjectDefinition(resOpt);
        if (oDef != null) {
          ctx.getCorpus()
                  .registerDefinitionReferenceSymbols(oDef, kind, resOpt.getSymbolRefSet());

          // get the new cache tag now that we have the list of docs
          String cacheTag = ctx.getCorpus()
                  .createDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : null);

          // save this as the cached version
          if (!StringUtils.isNullOrTrimEmpty(cacheTag) && rasbCache != null) {
            ctx.getCache().put(cacheTag, rasbCache);
          }
          // get the 'underCtx' of the attribute set from the acp that is wired into
          // the target tree
          underCtx = rasbCache.getResolvedAttributeSet().getAttributeContext() != null
                  ? rasbCache.getResolvedAttributeSet().getAttributeContext().getUnderContextFromCacheContext(resOpt, acpInContext)
                  : null;
        }
      }
      if (this.circularReference) {
        resOpt.inCircularReference = false;
      }
    }
    else {
      // get the 'underCtx' of the attribute set from the cache. The one stored there was build with a different
      // acp and is wired into the fake placeholder. so now build a new underCtx wired into the output tree but with
      // copies of all cached children
      underCtx = rasbCache.getResolvedAttributeSet().getAttributeContext() != null
              ? rasbCache.getResolvedAttributeSet().getAttributeContext().getUnderContextFromCacheContext(resOpt, acpInContext)
              : null;
      //underCtx.validateLineage(resOpt); // debugging
    }

    if (rasbCache != null) {
      // either just built something or got from cache
      // either way, same deal: copy resolved attributes and copy the context tree associated with it
      // 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
      // 2. deep copy the tree.

      // 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
      rasbResult = new ResolvedAttributeSetBuilder();
      rasbResult.setResolvedAttributeSet(((ResolvedAttributeSetBuilder) rasbCache).getResolvedAttributeSet().copy());

      // 2. deep copy the tree and map the context references.
      if (underCtx != null) { // null context? means there is no tree, probably 0 attributes came out
        if (underCtx.associateTreeCopyWithAttributes(resOpt, rasbResult.getResolvedAttributeSet()) == false) {
          return null;
        }
      }
    }

    DepthInfo currDepthInfo = resOpt.depthInfo;
    if (this instanceof CdmEntityAttributeDefinition && currDepthInfo != null) {
      // if we hit the maxDepth, we are now going back up
      currDepthInfo.setCurrentDepth(currDepthInfo.getCurrentDepth() - 1);
      // now at the top of the chain where max depth does not influence the cache
      if (currDepthInfo.getCurrentDepth() <= 0) {
        resOpt.depthInfo = null;
      }
    }

    // merge child document set with current
    currDocRefSet.merge(resOpt.getSymbolRefSet());
    resOpt.setSymbolRefSet(currDocRefSet);

    this.getCtx().getCorpus().isCurrentlyResolving = wasPreviouslyResolving;
    return rasbResult != null ? rasbResult.getResolvedAttributeSet() : null;
  }

  private static Object ProtectParameterValues(ResolveOptions resOpt, Object val) {
    if (val != null) {
      // the value might be a contant entity object, need to protect the original
      CdmConstantEntityDefinition cEnt = null;
      if (val instanceof CdmEntityReference) {
        cEnt = (CdmConstantEntityDefinition) ((CdmEntityReference) val).getExplicitReference();
      }
      if (cEnt != null) {
        // copy the constant entity AND the reference that holds it
        cEnt = (CdmConstantEntityDefinition) cEnt.copy(resOpt);
        val = ((CdmEntityReference)val).copy(resOpt);
        ((CdmEntityReference)val).setExplicitReference(cEnt);
      }
    }
    return val;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @return Resolved traits set map
   */
  @Deprecated
  public Map<String, ResolvedTraitSetBuilder> getTraitCache() {
    return this.traitCache;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param traitCache cache of trait
   */
  @Deprecated
  public void setTraitCache(final Map<String, ResolvedTraitSetBuilder> traitCache) {
    this.traitCache = traitCache;
  }
}
