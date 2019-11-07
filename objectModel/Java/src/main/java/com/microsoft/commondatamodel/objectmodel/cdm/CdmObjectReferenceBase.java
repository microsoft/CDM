// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.SymbolSet;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class CdmObjectReferenceBase extends CdmObjectBase implements CdmObjectReference {
  private static final Logger LOGGER = LoggerFactory.getLogger(CdmObjectReferenceBase.class);

  private static String RES_ATT_TOKEN = "/(resolvedAttributes)/";
  private CdmTraitCollection appliedTraits;
  private String namedReference;
  private CdmObjectDefinition explicitReference;
  private boolean simpleNamedReference;
  private CdmDocumentDefinition monikeredDocument;

  public CdmObjectReferenceBase(final CdmCorpusContext ctx, final Object referenceTo, final boolean simpleReference) {
    super(ctx);
    this.appliedTraits = new CdmTraitCollection(this.getCtx(), this);
    if (null != referenceTo) {
      if (referenceTo instanceof CdmObject) {
        this.setExplicitReference((CdmObjectDefinitionBase) referenceTo);
      } else {
        this.setNamedReference((String) referenceTo);
      }
    }
    if (simpleReference) {
      this.setSimpleNamedReference(true);
    }
  }

  static int offsetAttributePromise(final String ref) {
    if (Strings.isNullOrEmpty(ref)) {
      return -1;
    }

    return ref.indexOf(RES_ATT_TOKEN);
  }

  /**
   *
   * @param resOpt
   * @param refTo
   * @param simpleReference
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public abstract CdmObjectReferenceBase copyRefObject(ResolveOptions resOpt, Object refTo, boolean simpleReference);

  /**
   *
   * @param pathFrom
   * @param preChildren
   * @param postChildren
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public abstract boolean visitRef(String pathFrom, VisitCallback preChildren, VisitCallback postChildren);

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
    // find and getCache() the complete set of attributes
    final ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
    rasb.getResolvedAttributeSet().setAttributeContext(under);
    final CdmObjectDefinition def = this.fetchObjectDefinition(resOpt);
    if (def != null) {
      AttributeContextParameters acpRef = null;
      if (under != null) {
        // ask for a 'pass through' context, that is, no new context at this level
        acpRef = new AttributeContextParameters();
        acpRef.setUnder(under);
        acpRef.setType(CdmAttributeContextType.PassThrough);
      }
      ResolvedAttributeSet resAtts = def.fetchResolvedAttributes(resOpt, acpRef);
      if (resAtts != null && resAtts.getSet() != null && resAtts.getSet().size() > 0) {
        resAtts = resAtts.copy();
        rasb.mergeAttributes(resAtts);
        rasb.removeRequestedAtts();
      }
    } else {
      final String defName = this.fetchObjectDefinitionName();
      LOGGER.warn(defName, this.getCtx(), "unable to resolve an object from the reference '" + defName + "'");
    }
    return rasb;
  }

  @Override
  public ResolvedTraitSet fetchResolvedTraits(final ResolveOptions resOpt) {
    if (this.getNamedReference() != null && this.getAppliedTraits() == null) {
      final String kind = "rts";
      final ResolveContext ctx = (ResolveContext) this.getCtx();
      String cacheTag = ctx.getCorpus().createDefinitionCacheTag(resOpt, this, kind, "", true);
      Object rtsResultDynamic = null;
      if (cacheTag != null)
        rtsResultDynamic = ctx.getCache().get(cacheTag);
      ResolvedTraitSet rtsResult = (ResolvedTraitSet) rtsResultDynamic;

      // store the previous document set, we will need to add it with
      // children found from the constructResolvedTraits call
      SymbolSet currSymRefSet = resOpt.getSymbolRefSet();
      if (currSymRefSet == null) {
        currSymRefSet = new SymbolSet();
      }
      resOpt.setSymbolRefSet(new SymbolSet());

      if (rtsResult == null) {
        final CdmObjectDefinition objDef = this.fetchObjectDefinition(resOpt);
        if (objDef != null) {
          rtsResult = objDef.fetchResolvedTraits(resOpt);
          if (rtsResult != null) {
            rtsResult = rtsResult.deepCopy();
          }

          // register set of possible docs
          ctx.getCorpus().registerDefinitionReferenceSymbols(objDef, kind, resOpt.getSymbolRefSet());

          // get the new getCache() tag now that we have the list of docs
          cacheTag = ctx.getCorpus().createDefinitionCacheTag(resOpt, this, kind, "", true);
          if (!StringUtils.isNullOrTrimEmpty(cacheTag)) {
            ctx.getCache().put(cacheTag, rtsResult);
          }
        }
      } else {
        // getCache() was found
        // get the SymbolSet for this cached object
        final String key = CdmCorpusDefinition.createCacheKeyFromObject(this, kind);
        final SymbolSet tempDocRefSet = ctx.getCorpus().getDefinitionReferenceSymbols().get(key);
        resOpt.setSymbolRefSet(tempDocRefSet);
      }

      // merge child document set with current
      currSymRefSet.merge(resOpt.getSymbolRefSet());
      resOpt.setSymbolRefSet(currSymRefSet);

      return rtsResult;
    } else {
      return super.fetchResolvedTraits(resOpt);
    }
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    final CdmObjectDefinition objDef = this.fetchObjectDefinition(resOpt);

    if (objDef != null) {
      ResolvedTraitSet rtsInh = objDef.fetchResolvedTraits(resOpt);
      if (rtsInh != null) {
        rtsInh = rtsInh.deepCopy();
      }
      rtsb.takeReference(rtsInh);
    } else {
      final String defName = this.fetchObjectDefinitionName();
      LOGGER.warn(defName, this.getCtx(), "unable to resolve an object from the reference '" + defName + "'");
    }

    if (this.getAppliedTraits() != null) {
      for (final CdmTraitReference at : this.getAppliedTraits()) {
        rtsb.mergeTraits(at.fetchResolvedTraits(resOpt));
      }
    }
  }

  public CdmObjectDefinition fetchResolvedReference(final ResolveOptions resOpt) {
    if (this.getExplicitReference() != null) {
      return this.getExplicitReference();
    }

    if (this.getCtx() == null) {
      return null;
    }

    final ResolveContext ctx = (ResolveContext) this.getCtx();
    CdmObjectDefinitionBase res = null;

    // if this is a special request for a resolved attribute, look that up now
    final int seekResAtt = offsetAttributePromise(this.getNamedReference());
    if (seekResAtt >= 0) {
      final String entName = this.getNamedReference().substring(0, seekResAtt);
      final String attName = this.getNamedReference().substring(seekResAtt + RES_ATT_TOKEN.length());
      // get the entity
      final CdmObjectDefinition ent = this.getCtx().getCorpus().resolveSymbolReference(resOpt, this.getDocCreatedIn(),
          entName, CdmObjectType.EntityDef, true);
      if (ent == null) {
        LOGGER.warn("unable to resolve an entity named '{}' from the reference '{}'", entName,
            this.getNamedReference());
        return null;
      }

      // get the resolved attribute
      final ResolvedAttribute ra = ent.fetchResolvedAttributes(resOpt).get(attName);
      if (ra != null) {
        res = (CdmObjectDefinitionBase) ra.getTarget();
      } else {
        LOGGER.warn("couldn't resolve the attribute promise for '{}'", this.getNamedReference());
      }
    } else {
      // normal symbolic reference, look up from the CdmCorpusDefinition, it knows
      // where everything is
      res = this.getCtx().getCorpus().resolveSymbolReference(resOpt, this.getDocCreatedIn(), this.getNamedReference(),
          this.getObjectType(), true);
    }

    return res;
  }

  @Override
  public String getNamedReference() {
    return namedReference;
  }

  @Override
  public void setNamedReference(final String namedReference) {
    this.namedReference = namedReference;
  }

  @Override
  public CdmObjectDefinition getExplicitReference() {
    return explicitReference;
  }

  @Override
  public void setExplicitReference(final CdmObjectDefinition explicitReference) {
    this.explicitReference = explicitReference;
  }

  @Override
  public boolean isSimpleNamedReference() {
    return this.simpleNamedReference;
  }

  @Override
  public void setSimpleNamedReference(final boolean simpleNamedReference) {
    this.simpleNamedReference = simpleNamedReference;
  }

  @Override
  public <T extends CdmObjectDefinition> T fetchObjectDefinition(final ResolveOptions resOpt) {
    final CdmObjectDefinition def = this.fetchResolvedReference(resOpt);
    if (def != null) {
      return (T) def;
    }

    return null;
  }

  @Override
  public boolean isDerivedFrom(final ResolveOptions resOpt, final String baseDef) {
    final CdmObjectDefinition def = this.fetchObjectDefinition(resOpt);
    if (def != null) {
      return def.isDerivedFrom(resOpt, baseDef);

    }
    return false;
  }

  @Override
  public CdmTraitCollection getAppliedTraits() {
    return this.appliedTraits;
  }

  @Override
  public String fetchObjectDefinitionName() {
    if (!Strings.isNullOrEmpty(this.namedReference)) {
      final int pathEnd = this.getNamedReference().lastIndexOf('/');
      if (pathEnd == -1 || pathEnd + 1 == this.getNamedReference().length()) {
        return this.getNamedReference();
      } else {
        return this.getNamedReference().substring(pathEnd + 1);
      }
    }
    if (this.explicitReference != null) {
      return this.explicitReference.fetchObjectDefinitionName();
    }
    return null;
  }

  @Override
  public boolean visit(
      final String pathFrom,
      final VisitCallback preChildren,
      final VisitCallback postChildren) {
    final String path;
    if (!Strings.isNullOrEmpty(this.getNamedReference())) {
      path = pathFrom + this.getNamedReference();
    } else {
      path = pathFrom;
    }
    this.setDeclaredPath(path);

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.getExplicitReference() != null && Strings.isNullOrEmpty(this.getNamedReference())) {
      if (this.getExplicitReference().visit(path, preChildren, postChildren)) {
        return true;
      }
    }
    if (this.visitRef(path, preChildren, postChildren)) {
      return true;
    }

    if (this.getAppliedTraits() != null) {
      if (this.getAppliedTraits().visitList(path + "/appliedTraits/", preChildren, postChildren)) {
        return true;
      }
    }

    if (postChildren != null && postChildren.invoke(this, path)) {
      return true;
    }
    return false;
  }

  @Override
  public boolean validate() {
    return (!Strings.isNullOrEmpty(this.namedReference) || this.explicitReference != null);
  }

  @Override
  public CdmObject copy(final ResolveOptions resOpt) {
    final CdmObjectReferenceBase copy;
    if (!Strings.isNullOrEmpty(this.getNamedReference())) {
      copy = this.copyRefObject(resOpt, this.getNamedReference(), this.isSimpleNamedReference());
    } else {
      copy = this.copyRefObject(resOpt, this.getExplicitReference(), this.isSimpleNamedReference());
    }
    if (resOpt.isSaveResolutionsOnCopy()) {
      copy.setExplicitReference(this.getExplicitReference());
      copy.setDocCreatedIn(this.getDocCreatedIn());
    }
    if (this.getAppliedTraits() != null) {
      for (final CdmTraitReference appliedTrait : this.appliedTraits) {
        copy.getAppliedTraits().add(appliedTrait);
      }
    }
    return copy;
  }

  @Override
  public CdmObjectReference createSimpleReference(final ResolveOptions resOpt) {
    if (!Strings.isNullOrEmpty(this.namedReference)) {
      return this.copyRefObject(resOpt, this.namedReference, true);
    }
    return this.copyRefObject(resOpt, this.getDeclaredPath() + this.explicitReference.fetchObjectDefinitionName(),
        true);
  }

  CdmDocumentDefinition getMonikeredDocument() {
    return monikeredDocument;
  }

  void setMonikeredDocument(final CdmDocumentDefinition monikeredDocument) {
    this.monikeredDocument = monikeredDocument;
  }
}
