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
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.TraitProfile;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.TraitProfileCache;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.SymbolSet;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

import java.util.*;

public abstract class CdmObjectBase implements CdmObject {

  /**
   * The minimum json semantic versions that can be loaded by this ObjectModel version.
   */
  public static String getJsonSchemaSemanticVersionMinimumLoad() {
    return "1.0.0";
  }
  /**
   * The minimum json semantic versions that can be saved by this ObjectModel version.
   */
  public static String getJsonSchemaSemanticVersionMinimumSave() {
    return "1.1.0";
  }
  /**
   * The maximum json semantic versions that can be loaded and saved by this ObjectModel version.
   */
  public static String getJsonSchemaSemanticVersionMaximumSaveLoad() {
    return "1.5.0";
  }

  // known semantic versions changes
  public static String getJsonSchemaSemanticVersionProjections() { return "1.4.0"; }
  public static String getJsonSchemaSemanticVersionTraitsOnTraits() { return "1.5.0"; }

  private int id;
  private CdmCorpusContext ctx;
  private CdmDocumentDefinition inDocument;
  private String atCorpusPath;
  private CdmObjectType objectType;
  private CdmObject owner;
  private boolean resolvingTraits = false;
  private String declaredPath;
  private Map<String, ResolvedTraitSetBuilder> traitCache;

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

  @Deprecated
  public static CdmTraitReference resolvedTraitToTraitRef(final ResolveOptions resOpt, final ResolvedTrait rt) {
  
    // if nothing extra needs a mention, make a simple string ref
    final CdmTraitReference traitRef = rt.getTrait().getCtx().getCorpus()
      .makeObject(CdmObjectType.TraitRef, rt.getTraitName(), 
        !((rt.getParameterValues() != null && rt.getParameterValues().length() > 0) || 
          rt.getExplicitVerb() != null || rt.getMetaTraits() != null));


    if (rt.getParameterValues() != null && rt.getParameterValues().length() > 0) {
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
    }

    if (rt.getExplicitVerb() != null) {
      traitRef.setVerb((CdmTraitReference) rt.getExplicitVerb().copy(resOpt));
      traitRef.getVerb().setOwner(traitRef);
    }

    if (rt.getMetaTraits() != null) {
      for(CdmTraitReferenceBase trMeta : rt.getMetaTraits()) {
        CdmTraitReference trMetaCopy = (CdmTraitReference) trMeta.copy(resOpt);
        traitRef.getAppliedTraits().add(trMetaCopy);
      }
    }

    if (resOpt.isSaveResolutionsOnCopy()) {
      // used to localize references between documents
      traitRef.setExplicitReference(rt.getTrait());
      traitRef.setInDocument(rt.getTrait().getInDocument());
    }

    // always make it a property when you can, however the dataFormat traits should be left alone
    // also the wellKnown is the first constrained list that uses the datatype to hold the table instead of the default value property.
    // so until we figure out how to move the enums away from default value, show that trait too
    if (rt.getTrait().getAssociatedProperties() != null && rt.getTrait().getAssociatedProperties().size() > 0 && 
        !rt.getTrait().isDerivedFrom("is.dataFormat", resOpt) && !(rt.getTrait().getTraitName().equals("is.constrainedList.wellKnown"))) {
      traitRef.setFromProperty(true);
    }
    return traitRef;
  }
  
  @Deprecated
  // internal only but public for building cross package
  public long getMinimumSemanticVersion()
  {
      return CdmObjectBase.DefaultJsonSchemaSemanticVersionNumber;
  }

  /**
   * converts a string in the form MM.mm.pp into a single comparable long integer
   * limited to 3 parts where each part is 5 numeric digits or fewer
   * returns -1 if failure
   */
  public static long semanticVersionStringToNumber(String version) {
    if (version == null) {
        return -1;
    }

    // must have the three parts
    String[] semanticVersionSplit = version.split("\\.");
    if (semanticVersionSplit.length != 3) {
        return -1;
    }

    // accumulate the result
    long numVer = 0;
    for (int i = 0; i < 3; ++i) {
      int verPart=0;
      try {
        verPart = Integer.parseInt(semanticVersionSplit[i]);
      } catch (NumberFormatException e) {
        return -1;
      }
      // 6 digits?
      if (verPart > 100000) {
          return -1;
      }

      // shift the previous accumulation over 5 digits and add in the new part
      numVer *= 100000;
      numVer += verPart;
    }
    return numVer;
  }

  /**
   * converts a number encoding 3 version parts into a string in the form MM.mm.pp
   * assumes 5 digits per encoded version part
   */
  public static String semanticVersionNumberToString(long version) {
    
    int verPartM = (int) (version / (100000L * 100000L));
    version = version - (verPartM * (100000L * 100000L));
    int verPartm = (int) (version / 100000L);
    int verPartP = (int) (version - (verPartm * 100000L));
    return String.valueOf(verPartM) + "." + String.valueOf(verPartm) + "." + String.valueOf(verPartP);
  }

  static long DefaultJsonSchemaSemanticVersionNumber = semanticVersionStringToNumber(getJsonSchemaSemanticVersionMinimumSave());

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
    * adjustments to these ideas happen as trait information is 'bubbled up' from base definitons. adjustments include
    * 1. the most recent verb trait that was defined or applied will propigate up the hierarchy for all references even those that do not specify a verb. 
    * This ensures the top trait profile depicts the correct verb
    * 2. traits that are applied or exhibited by another trait using the 'classifiedAs' verb are put into a different collection called classifiers.
    * 3. classifiers are accumulated and promoted from base references up to the final trait profile. this way the top profile has a complete list of classifiers 
    * but the 'deeper' profiles will not have the individual classifications set (to avoid an explosion of info)
    * 3. In a similar way, trait arguments will accumulate from base definitions and default values. 
    * 4. traits used as 'verbs' (defaultVerb or explicit verb) will not include classifier descriptions, this avoids huge repetition of somewhat pointless info and recursive effort
    * 
    */

  public List<TraitProfile> fetchTraitProfiles() {
    return fetchTraitProfiles(null, null, null);
  }
  public List<TraitProfile> fetchTraitProfiles(ResolveOptions resOpt) {
    return fetchTraitProfiles(resOpt, null, null);
  }
  public List<TraitProfile> fetchTraitProfiles(ResolveOptions resOpt, TraitProfileCache cache) {
    return fetchTraitProfiles(resOpt, cache, null);
  }

  public List<TraitProfile> fetchTraitProfiles(ResolveOptions resOpt, TraitProfileCache cache, String forVerb) {
    if (cache == null) {
      cache = new TraitProfileCache();
    }

    if (resOpt == null) {
      // resolve symbols with default directive and WRTDoc from this object's point of view
      resOpt = new ResolveOptions(this, this.ctx.getCorpus().getDefaultResolutionDirectives());
    }

    List<TraitProfile> result = new ArrayList<TraitProfile>();

    CdmTraitCollection traits = null;
    TraitProfile prof = null;
    if (this instanceof CdmAttributeItem) {
      traits = ((CdmAttributeItem) this).getAppliedTraits();
    }
    else if (this instanceof CdmTraitDefinition) {
      prof = TraitProfile._traitDefToProfile((CdmTraitDefinition) this, resOpt, false, false, cache);
    }
    else if (this instanceof CdmObjectDefinition) {
      traits = ((CdmObjectDefinition) this).getExhibitsTraits();
    }
    if (this instanceof CdmTraitReference) {
      prof = TraitProfile._traitRefToProfile((CdmTraitReference) this, resOpt, false, false, true, cache);
    } 
    else if (this instanceof CdmTraitGroupReference) {
      prof = TraitProfile._traitRefToProfile((CdmTraitGroupReference) this, resOpt, false, false, true, cache);
    }
    else if (this instanceof CdmObjectReference) {
      traits = ((CdmObjectReference) this).getAppliedTraits();
    }
    // one of these two will happen
    if (prof != null) {
      if (prof.getVerb() == null || forVerb == null || prof.getVerb().getTraitName().equals(forVerb))
        result.add(prof);
    }
    if (traits != null) {
      for (CdmTraitReferenceBase tr : traits) {
        prof = TraitProfile._traitRefToProfile(tr, resOpt, false, false, true, cache);
        if (prof != null) {
          if (prof.getVerb() == null || forVerb == null || prof.getVerb().getTraitName().equals(forVerb))
            result.add(prof);
        }
      }
    }

    if (result.size() == 0)
        result = null;

    return result;
  }

  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
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

    ResolvedAttributeSetBuilder rasbCache = null;
    if (cacheTag != null) {
      rasbCache = ctx.getAttributeCache().get(cacheTag);
    }
    return rasbCache;
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

    boolean inCircularReference = false;
    boolean wasInCircularReference = resOpt.inCircularReference;
    if (this.objectType == CdmObjectType.EntityDef) {
      CdmEntityDefinition entity = (CdmEntityDefinition) this;
        inCircularReference = resOpt.currentlyResolvingEntities.contains(entity);
        resOpt.currentlyResolvingEntities.add(entity);
        resOpt.inCircularReference = inCircularReference;

        // uncomment this line as a test to turn off allowing cycles
        //if (inCircularReference) {
        //    return new ResolvedAttributeSet();
        //}
    }

    int currentDepth = resOpt.depthInfo.getCurrentDepth();

    final String kind = "rasb";
    final ResolveContext ctx = (ResolveContext) this.getCtx();
    ResolvedAttributeSetBuilder rasbResult = null;
    ResolvedAttributeSetBuilder rasbCache = this.fetchObjectFromCache(resOpt, acpInContext);
    CdmAttributeContext underCtx = null;

    // store the previous document set, we will need to add it with
    // children found from the constructResolvedTraits call
    SymbolSet currDocRefSet = resOpt.getSymbolRefSet();
    if (currDocRefSet == null) {
      currDocRefSet = new SymbolSet();
    }
    resOpt.setSymbolRefSet(new SymbolSet());

    // if using the cache passes the maxDepth, we cannot use it
    if (rasbCache != null && resOpt.depthInfo.getMaxDepth() != null
        && resOpt.depthInfo.getCurrentDepth() + rasbCache.getResolvedAttributeSet().getDepthTraveled() > resOpt.depthInfo.getMaxDepth()) {
      rasbCache = null;
    }

    if (rasbCache == null) {
      // a new context node is needed for these attributes,
      // this tree will go into the cache, so we hang it off a placeholder parent
      // when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
      // put into the 'receiving' tree
      underCtx = CdmAttributeContext.getUnderContextForCacheContext(resOpt, this.getCtx(), acpInContext);

      rasbCache = this.constructResolvedAttributes(resOpt, underCtx);

      if (rasbCache != null) {
        // register set of possible docs
        final CdmObjectDefinition oDef = this.fetchObjectDefinition(resOpt);
        if (oDef != null) {
          ctx.getCorpus()
                  .registerDefinitionReferenceSymbols(oDef, kind, resOpt.getSymbolRefSet());

          if (this.objectType == CdmObjectType.EntityDef) {
            // if we just got attributes for an entity, take the time now to clean up this cached tree and prune out
            // things that don't help explain where the final set of attributes came from
            if (underCtx != null) {
              HashSet<CdmAttributeContext> scopesForAttributes = new HashSet<CdmAttributeContext>();
              underCtx.collectContextFromAtts(rasbCache.getResolvedAttributeSet(), scopesForAttributes); // the context node for every final attribute
              if (!underCtx.pruneToScope(scopesForAttributes)) { 
                return null;
              }
            }
          }

          // get the new cache tag now that we have the list of docs
          String cacheTag = ctx.getCorpus()
                  .createDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : null);

          // save this as the cached version
          if (!StringUtils.isNullOrTrimEmpty(cacheTag) && rasbCache != null) {
            ctx.getAttributeCache().put(cacheTag, rasbCache);
          }
        }
        // get the 'underCtx' of the attribute set from the acp that is wired into
        // the target tree
        underCtx = rasbCache.getResolvedAttributeSet().getAttributeContext() != null
                ? rasbCache.getResolvedAttributeSet().getAttributeContext().getUnderContextFromCacheContext(resOpt, acpInContext)
                : null;
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
        if (!underCtx.associateTreeCopyWithAttributes(resOpt, rasbResult.getResolvedAttributeSet())) {
          return null;
        }
      }
    }

    if (this instanceof CdmEntityAttributeDefinition) {
      // if we hit the maxDepth, we are now going back up
      resOpt.depthInfo.setCurrentDepth(currentDepth);
      // now at the top of the chain where max depth does not influence the cache
      if (resOpt.depthInfo.getCurrentDepth() == 0) {
        resOpt.depthInfo.setMaxDepthExceeded(false);;
      }
    }

    if (!inCircularReference && this.objectType == CdmObjectType.EntityDef) {
      // should be removed from the root level only
      // if it is in a circular reference keep it there
      resOpt.currentlyResolvingEntities.remove(this);
    }
    resOpt.inCircularReference = wasInCircularReference;

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
