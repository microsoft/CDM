// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
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
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public abstract class CdmObjectReferenceBase extends CdmObjectBase implements CdmObjectReference {
  private static final String TAG = CdmObjectReferenceBase.class.getSimpleName();

  private static final String RES_ATT_TOKEN = "/(resolvedAttributes)/";
  private CdmTraitCollection appliedTraits;
  private String namedReference;
  private CdmObjectDefinition explicitReference;
  private boolean simpleNamedReference;
  private CdmDocumentDefinition monikeredDocument;
  /**
   * Gets or sets the object's Optional property.
   * This indicates the SDK to not error out in case the definition could not be resolved.
   */
  private Boolean optional;
  /**
   * A portable explicit reference used to manipulate nodes in the attribute context.
   * For more information, refer to the `CreatePortableReference` method in CdmObjectDef and CdmObjectRef.
   */
  CdmObjectDefinitionBase portableReference;

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

  CdmObjectReferenceBase copyToHost(
      final CdmCorpusContext ctx,
      final Object refTo,
      final boolean simpleReference) {
    this.setCtx(ctx);
    this.setExplicitReference(null);
    this.setNamedReference(null);

    if (refTo != null) {
      if (refTo instanceof CdmObject) {
        this.setExplicitReference((CdmObjectDefinitionBase) refTo);
      } else if (refTo instanceof JsonNode) {
        // NamedReference is a string or JsonNode.
        this.setNamedReference(((JsonNode) refTo).asText());
      } else {
        this.setNamedReference((String) refTo);
      }
    }

    this.setSimpleNamedReference(simpleReference);

    this.getAppliedTraits().clear();

    return this;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt - Resolved options
   * @param refTo - Object
   * @param simpleReference - if simple reference
   * @return Cdm Object Reference Base
   */
  @Deprecated
  public abstract CdmObjectReferenceBase copyRefObject(ResolveOptions resOpt, Object refTo, boolean simpleReference);

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt - Resolved options
   * @param refTo - Object
   * @param simpleReference - if simple reference
   * @param host - Object reference base
   * @return Cdm Object Reference Base
   */
  @Deprecated
  public abstract CdmObjectReferenceBase copyRefObject(ResolveOptions resOpt, Object refTo, boolean simpleReference, CdmObjectReferenceBase host);

  /**
   * @param pathFrom - path from
   * @param preChildren - pre children
   * @param postChildren - post children
   * @return boolean
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public abstract boolean visitRef(String pathFrom, VisitCallback preChildren, VisitCallback postChildren);

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt - Resolved options
   * @return Resolved Attribute Set Builder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt - Resolved options
   * @param under - CDM Attribute context
   * @return Resolved Attribute SetBuilder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(
      final ResolveOptions resOpt,
      final CdmAttributeContext under) {
    // find and getCache() the complete set of attributes
    final ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
    rasb.getResolvedAttributeSet().setAttributeContext(under);
    final CdmObjectDefinitionBase def = this.fetchObjectDefinition(resOpt);
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
//        resAtts = resAtts.copy(); should not neeed this copy now that we copy from the cache. lets try!
        rasb.mergeAttributes(resAtts);
        rasb.removeRequestedAtts();
      }
    } else {
      final String defName = this.fetchObjectDefinitionName();
      Logger.warning(this.getCtx(), TAG, "constructResolvedAttributes", this.getAtCorpusPath(), CdmLogCode.WarnResolveObjectFailed ,defName);
    }
    return rasb;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedTraitSet fetchResolvedTraits() {
    return this.fetchResolvedTraits(null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt - Resolved options
   * @return Resolved Trait Set
   */
  @Deprecated
  @Override
  public ResolvedTraitSet fetchResolvedTraits(ResolveOptions resOpt) {
    final boolean wasPreviouslyResolving = this.getCtx().getCorpus().isCurrentlyResolving;
    this.getCtx().getCorpus().isCurrentlyResolving = true;
    ResolvedTraitSet ret = this._fetchResolvedTraits(resOpt);
    this.getCtx().getCorpus().isCurrentlyResolving = wasPreviouslyResolving;
    return ret;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt - Resolved options
   * @return Resolved Trait Set
   */
  @Deprecated
  public ResolvedTraitSet _fetchResolvedTraits(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    if (this.getNamedReference() != null && this.getAppliedTraits() == null) {
      final String kind = "rts";
      final ResolveContext ctx = (ResolveContext) this.getCtx();
      final CdmObjectDefinition objDef = this.fetchObjectDefinition(resOpt);
      String cacheTag = ctx.getCorpus().createDefinitionCacheTag(
        resOpt,
        this,
        kind,
        "",
        true,
        objDef != null ? objDef.getAtCorpusPath() : null
      );
      Object rtsResultDynamic = null;
      if (cacheTag != null) {
        rtsResultDynamic = ctx.getCache().get(cacheTag);
      }
      ResolvedTraitSet rtsResult = (ResolvedTraitSet) rtsResultDynamic;

      // store the previous document set, we will need to add it with
      // children found from the constructResolvedTraits call
      SymbolSet currSymRefSet = resOpt.getSymbolRefSet();
      if (currSymRefSet == null) {
        currSymRefSet = new SymbolSet();
      }
      resOpt.setSymbolRefSet(new SymbolSet());

      if (rtsResult == null) {
        if (objDef != null) {
          rtsResult = objDef.fetchResolvedTraits(resOpt);
          if (rtsResult != null) {
            rtsResult = rtsResult.deepCopy();
          }

          // register set of possible docs
          ctx.getCorpus().registerDefinitionReferenceSymbols(objDef, kind, resOpt.getSymbolRefSet());

          // get the new getCache() tag now that we have the list of docs
          cacheTag = ctx.getCorpus().createDefinitionCacheTag(resOpt, this, kind, "", true, objDef.getAtCorpusPath());
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
    } else if (isOptional() != null && !isOptional()) {
      Logger.warning(this.getCtx(), TAG, "constructResolvedTraits", this.getAtCorpusPath(), 
                     CdmLogCode.WarnResolveObjectFailed, this.fetchObjectDefinitionName());
    }

    if (this.getAppliedTraits() != null) {
      for (final CdmTraitReferenceBase at : this.getAppliedTraits()) {
        rtsb.mergeTraits(at.fetchResolvedTraits(resOpt));
      }
    }
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @return Cdm Object
   */
  @Deprecated
  public CdmObject fetchResolvedReference() {
    return fetchResolvedReference(null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt - Resolved options
   * @return Cdm Object
   */
  @Deprecated
  public CdmObject fetchResolvedReference(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    if (this.getExplicitReference() != null) {
      return this.getExplicitReference();
    }

    if (this.getCtx() == null) {
      return null;
    }

    final ResolveContext ctx = (ResolveContext) this.getCtx();
    CdmObjectBase res = null;

    // if this is a special request for a resolved attribute, look that up now
    final int seekResAtt = offsetAttributePromise(this.getNamedReference());
    if (seekResAtt >= 0) {
      final String entName = this.getNamedReference().substring(0, seekResAtt);
      final String attName = this.getNamedReference().substring(seekResAtt + RES_ATT_TOKEN.length());
      // get the entity
      final CdmObject ent = this.getCtx().getCorpus().resolveSymbolReference(resOpt, this.getInDocument(),
          entName, CdmObjectType.EntityDef, true);
      if (ent == null) {
        Logger.warning(ctx, TAG, "fetchResolvedReference", this.getAtCorpusPath(), CdmLogCode.WarnResolveEntityFailed ,entName, this.getNamedReference());
        return null;
      }

      // get the resolved attribute
      final ResolvedAttributeSet ras = ent.fetchResolvedAttributes(resOpt);
      ResolvedAttribute ra = null;
      if (ras != null) {
        ra = ras.get(attName);
      }
      if (ra != null) {
        res = (CdmObjectDefinitionBase) ra.getTarget();
      } else {
        Logger.warning(ctx, TAG, "fetchResolvedReference", this.getAtCorpusPath(), CdmLogCode.WarnResolveAttrFailed ,this.getNamedReference());
      }
    } else {
      // normal symbolic reference, look up from the CdmCorpusDefinition, it knows
      // where everything is
      res = this.getCtx()
          .getCorpus()
          .resolveSymbolReference(
              resOpt,
              this.getInDocument(),
              this.getNamedReference(),
              this.getObjectType(),
              true);
    }

    return res;
  }

  // Creates a 'portable' reference object to this object. portable means there is no symbolic name set until this reference is placed into some final document.
  @Override
  @Deprecated
  public CdmObjectReference createPortableReference(ResolveOptions resOpt) {
    CdmObjectDefinitionBase cdmObjectDef = this.fetchObjectDefinition(resOpt);
    
    if (cdmObjectDef == null || this.getInDocument() == null) {
      return null; // not allowed
    }

    CdmObjectReferenceBase cdmObjectRef = this.getCtx().getCorpus().makeObject(CdmCorpusDefinition.mapReferenceType(this.getObjectType()), "portable", true);
    cdmObjectRef.portableReference = cdmObjectDef;
    cdmObjectRef.setOptional(this.isOptional());
    cdmObjectRef.setInDocument(this.getInDocument()); // if the object has no document, take from the reference
    cdmObjectRef.setOwner(this.getOwner());

    return cdmObjectRef;
  }

  //Creates a 'portable' reference object to this object. portable means there is no symbolic name set until this reference is placed into some final document.
  @Deprecated
  public void localizePortableReference(String importPath) {
    String newDeclaredPath = this.portableReference.getDeclaredPath();
    newDeclaredPath = newDeclaredPath != null && newDeclaredPath.endsWith("/(ref)") ? newDeclaredPath.substring(0, newDeclaredPath.length() - 6) : newDeclaredPath;
    this.setNamedReference(String.format("%s%s", importPath, newDeclaredPath));
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
    if (explicitReference != null) {
      explicitReference.setOwner(this);
    }
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
  public Boolean isOptional() {
    return this.optional;
  }

  @Override
  public void setOptional(final Boolean optional) {
    this.optional = optional;
  }

  @Override
  public <T extends CdmObjectDefinition> T fetchObjectDefinition(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmObject def = this.fetchResolvedReference(resOpt);
    if (def != null) {
      if (def instanceof CdmObjectReference) {
        def = ((CdmObjectReference)def).fetchResolvedReference();
      }
    }
    if (def != null && !(def instanceof CdmObjectReference)) {
      return (T) def;
    }

    return null;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    final CdmObjectDefinition def = this.fetchObjectDefinition(resOpt);
    if (def != null) {
      return def.isDerivedFrom(baseDef, resOpt);
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
      return this.explicitReference.getName();
    }
    return null;
  }

  @Override
  public boolean visit(
      final String pathFrom,
      final VisitCallback preChildren,
      final VisitCallback postChildren) {
    String path = "";
    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      if (!Strings.isNullOrEmpty(this.getNamedReference())) {
        path = pathFrom + this.getNamedReference();
      } else {
        // when an object is defined inline inside a reference, we need a path to the reference
        // AND a path to the inline object. The 'correct' way to do this is to name the reference (inline) and the
        // defined object objectName so you get a path like extendsEntity/(inline)/MyBaseEntity. that way extendsEntity/(inline)
        // gets you the reference where there might be traits, etc. and extendsEntity/(inline)/MyBaseEntity gets the
        // entity defintion. HOWEVER! there are situations where (inline) would be ambiguous since there can be more than one
        // object at the same level, like anywhere there is a collection of references or the collection of attributes.
        // so we will flip it (also preserves back compat) and make the reference extendsEntity/MyBaseEntity/(inline) so that
        // extendsEntity/MyBaseEntity gives the reference (like before) and then extendsEntity/MyBaseEntity/(inline) would give
        // the inline defined object.
        // ALSO, ALSO!!! since the ability to use a path to request an object (through) a reference is super useful, lets extend
        // the notion and use the word (object) in the path to mean 'drill from reference to def' This would work then on
        // ANY reference, not just inline ones
        if (this.explicitReference != null) {
          // ref path is name of defined object
          path = pathFrom + this.explicitReference.getName();
          // inline object path is a request for the defintion. setting the declaredPath
          // keeps the visit on the explcitReference from using the defined object name
          // as the path to that object
          ((CdmObjectDefinitionBase)this.getExplicitReference()).setDeclaredPath(path);
        } else {
          path = pathFrom;
        }
      }
      this.setDeclaredPath(path + "/(ref)");
    }
    String refPath = this.getDeclaredPath();

    if (preChildren != null && preChildren.invoke(this, refPath)) {
      return false;
    }
    if (this.getExplicitReference() != null && Strings.isNullOrEmpty(this.getNamedReference()) && this.getExplicitReference().visit(path, preChildren, postChildren)) {
      return true;
    }
    if (this.visitRef(path, preChildren, postChildren)) {
      return true;
    }

    if (this.getAppliedTraits() != null) {
      if (this.getAppliedTraits().visitList(refPath + "/appliedTraits/", preChildren, postChildren)) {
        return true;
      }
    }

    return postChildren != null && postChildren.invoke(this, refPath);
  }

  @Override
  public boolean validate() {
    ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("namedReference", "explicitReference"));
    if (StringUtils.isNullOrTrimEmpty(this.namedReference) && this.explicitReference == null) {
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    final CdmObjectReferenceBase copy;
    if (!Strings.isNullOrEmpty(this.getNamedReference())) {
      copy = this.copyRefObject(resOpt, this.getNamedReference(), this.isSimpleNamedReference());
    } else {
      copy = this.copyRefObject(resOpt, this.getExplicitReference(), this.isSimpleNamedReference());
    }
    if (resOpt.isSaveResolutionsOnCopy()) {
      final CdmObjectDefinition explicitReference = this.getExplicitReference() != null ? (CdmObjectDefinition) this.getExplicitReference().copy() : null;
      copy.setExplicitReference(explicitReference);
    }

    copy.setOptional(this.isOptional());
    copy.portableReference = this.portableReference;

    copy.getAppliedTraits().clear();
    if (this.getAppliedTraits() != null) {
      for (final CdmTraitReferenceBase appliedTrait : this.appliedTraits) {
        copy.getAppliedTraits().add(appliedTrait);
      }
    }

    // Don't do anything else after this, as it may cause InDocument to become dirty
    copy.setInDocument(this.getInDocument());

    return copy;
  }

  @Override
  public CdmObjectReference createSimpleReference(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    if (!Strings.isNullOrEmpty(this.namedReference)) {
      return this.copyRefObject(resOpt, this.namedReference, true);
    }
    String newDeclaredPath = this.getDeclaredPath() != null && this.getDeclaredPath().endsWith("/(ref)") ?
      this.getDeclaredPath().substring(0, this.getDeclaredPath().length() - 6) : this.getDeclaredPath();
    return this.copyRefObject(resOpt, newDeclaredPath, true);
  }

  CdmDocumentDefinition getMonikeredDocument() {
    return monikeredDocument;
  }

  void setMonikeredDocument(final CdmDocumentDefinition monikeredDocument) {
    this.monikeredDocument = monikeredDocument;
  }
}
