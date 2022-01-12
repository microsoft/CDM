// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.AttributeResolutionContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntity;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntityReference;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntityReferenceSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTrait;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionDirective;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

public class CdmEntityDefinition extends CdmObjectDefinitionBase implements CdmReferencesEntities {
  private static final String TAG = CdmEntityDefinition.class.getSimpleName();
  
  private String entityName;
  private CdmEntityReference extendsEntity;
  private CdmAttributeResolutionGuidance extendsEntityResolutionGuidance;
  private CdmCollection<CdmAttributeItem> attributes;
  private CdmAttributeContext attributeContext;
  private ResolveContext ctxDefault;
  private boolean resolvingEntityReferences = false;
  private TraitToPropertyMap t2pm;
  private ResolvedAttributeSetBuilder rasb;

  public CdmEntityDefinition(final CdmCorpusContext ctx, final String entityName) {
    this(ctx, entityName, null);
  }

  public CdmEntityDefinition(final CdmCorpusContext ctx, final String entityName, final CdmEntityReference extendsEntity) {
    this(ctx, entityName, extendsEntity, false, false);
  }

  public CdmEntityDefinition(final CdmCorpusContext ctx, final String entityName, final CdmEntityReference extendsEntity,
                             final boolean exhibitsTraits, final boolean attributes) {
    super(ctx);
    this.setObjectType(CdmObjectType.EntityDef);
    this.setEntityName(entityName);
    this.setExtendsEntity(extendsEntity);

    this.attributes = new CdmCollection(this.getCtx(), this, CdmObjectType.TypeAttributeDef);
    this.t2pm = new TraitToPropertyMap(this);
  }

  public String getEntityName() {
    return entityName;
  }

  public void setEntityName(final String entityName) {
    this.entityName = entityName;
  }

  public CdmEntityReference getExtendsEntity() {
    return extendsEntity;
  }

  public void setExtendsEntity(final CdmEntityReference extendsEntity) {
    if (extendsEntity != null) {
      extendsEntity.setOwner(this);
    }
    this.extendsEntity = extendsEntity;
  }

  /**
   * @deprecated
   * Resolution guidance is being deprecated in favor of Projections. https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
   */
  public CdmAttributeResolutionGuidance getExtendsEntityResolutionGuidance() {
    return extendsEntityResolutionGuidance;
  }

  /**
   * @deprecated
   * Resolution guidance is being deprecated in favor of Projections. https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
  */
  public void setExtendsEntityResolutionGuidance(CdmAttributeResolutionGuidance extendsEntityResolutionGuidance) {
    this.extendsEntityResolutionGuidance = extendsEntityResolutionGuidance;
  }

  public CdmAttributeContext getAttributeContext() {
    return this.attributeContext;
  }

  public void setAttributeContext(
          final CdmAttributeContext attributeContext) {
    this.attributeContext = attributeContext;
  }

  public void setExtendsEntityRef(CdmEntityReference extendsEntityRef) {
    this.extendsEntity = extendsEntityRef;
  }

  @Override
  public String getName() {
    return this.entityName;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    return this.isDerivedFromDef(resOpt, this.getExtendsEntity(), this.getName(), baseDef);
  }

  public List<String> getCdmSchemas() {
    return (List<String>) this.t2pm.fetchPropertyValue(CdmPropertyName.CDM_SCHEMAS);
  }

  public void setCdmSchemas(final List<String> value) {
    this.t2pm.updatePropertyValue(CdmPropertyName.CDM_SCHEMAS, value);
  }

  public String getDescription() {
    return (String) this.t2pm.fetchPropertyValue(CdmPropertyName.DESCRIPTION);
  }

  public void setDescription(final String value) {
    this.t2pm.updatePropertyValue(CdmPropertyName.DESCRIPTION, value);
  }

  public String getDisplayName() {
    return (String) this.t2pm.fetchPropertyValue(CdmPropertyName.DISPLAY_NAME);
  }

  public void setDisplayName(final String value) {
    this.t2pm.updatePropertyValue(CdmPropertyName.DISPLAY_NAME, value);
  }

  public CdmCollection<CdmAttributeItem> getAttributes() {
    return this.attributes;
  }

  public String getSourceName() {
    return (String) this.t2pm.fetchPropertyValue(CdmPropertyName.SOURCE_NAME);
  }

  public void setSourceName(final String value) {
    this.t2pm.updatePropertyValue(CdmPropertyName.SOURCE_NAME, value);
  }

  public String getVersion() {
    return (String) this.t2pm.fetchPropertyValue(CdmPropertyName.VERSION);
  }

  public void setVersion(final String value) {
    this.t2pm.updatePropertyValue(CdmPropertyName.VERSION, value);
  }

  int countInheritedAttributes(final ResolveOptions resOpt) {
    // ensures that cache exits
    this.fetchResolvedAttributes(resOpt);
    return this.rasb.getInheritedMark();
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // base traits then add any elevated from attributes then add things exhibited by the att.
    final CdmObjectReference baseClass = this.getExtendsEntity();
    if (baseClass != null) {
      // merge in all from base class
      rtsb.mergeTraits(baseClass.fetchResolvedTraits(resOpt));
    }

    if (this.getAttributes() != null) {
      ResolvedTraitSet rtsElevated = new ResolvedTraitSet(resOpt);
      for (int i = 0; i < this.getAttributes().getCount(); i++) {
        final CdmAttributeItem att = this.attributes.getAllItems().get(i);
        final ResolvedTraitSet rtsAtt = att.fetchResolvedTraits(resOpt);
        if (rtsAtt != null && rtsAtt.getHasElevated() != null && rtsAtt.getHasElevated()) {
          rtsElevated = rtsElevated.mergeSet(rtsAtt, true);
        }
        rtsb.mergeTraits(rtsElevated);
      }
      this.constructResolvedTraitsDef(null, rtsb, resOpt);
    }
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
    // find and cache the complete set of attributes
    // attributes definitions originate from and then get modified by subsequent re-definitions from (in this order):
    // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
    // the relationship of the attribute, the attribute definition itself and included attribute groups, dynamic traits applied to the attribute.
    this.rasb = new ResolvedAttributeSetBuilder();
    ResolvedAttributeSetBuilder rasb = this.rasb; // local var needed because we now allow reentry
    rasb.getResolvedAttributeSet().setAttributeContext(under);

    if (this.getExtendsEntity() != null) {
      final CdmObjectReference extRef = this.extendsEntity;
      CdmAttributeContext extendsRefUnder = null;
      AttributeContextParameters acpExtEnt = null;

      if (under != null) {
        final AttributeContextParameters acpExt = new AttributeContextParameters();
        acpExt.setUnder(under);
        acpExt.setType(CdmAttributeContextType.EntityReferenceExtends);
        acpExt.setName("extends");
        acpExt.setRegarding(null);
        acpExt.setIncludeTraits(false);

        extendsRefUnder = rasb.getResolvedAttributeSet().createAttributeContext(resOpt, acpExt);
      }

      if (extRef.getExplicitReference() != null && extRef.fetchObjectDefinition(resOpt).getObjectType() == CdmObjectType.ProjectionDef) {
        // A Projection

        CdmObjectDefinition extRefObjDef = extRef.fetchObjectDefinition(resOpt);
        if (extendsRefUnder != null) {
          acpExtEnt = new AttributeContextParameters();
          acpExtEnt.setUnder(extendsRefUnder);
          acpExtEnt.setType(CdmAttributeContextType.Projection);
          acpExtEnt.setName(extRefObjDef.getName());
          acpExtEnt.setRegarding(extRef);
          acpExtEnt.setIncludeTraits(false);
        }

        ProjectionDirective projDirective = new ProjectionDirective(resOpt, this, extRef);
        CdmProjection projDef = (CdmProjection) extRefObjDef;
        ProjectionContext projCtx = projDef.constructProjectionContext(projDirective, extendsRefUnder);

        rasb.setResolvedAttributeSet(projDef.extractResolvedAttributes(projCtx, under));
      } else {
        // An Entity Reference

        if (extendsRefUnder != null) {

          // usually the extended entity is a reference to a name.
          // it is allowed however to just define the entity inline.
          acpExtEnt = new AttributeContextParameters();
          acpExtEnt.setUnder(extendsRefUnder);
          acpExtEnt.setType(CdmAttributeContextType.Entity);
          acpExtEnt.setName(extRef.getNamedReference() != null ? extRef.getNamedReference() : extRef.getExplicitReference().getName());
          acpExtEnt.setRegarding(extRef);
          acpExtEnt.setIncludeTraits(true);  // "Entity" is the thing with traits - That perches in the tree - And sings the tune and never waits - To see what it should be.
        }

        rasb.mergeAttributes((this.getExtendsEntity()).fetchResolvedAttributes(resOpt, acpExtEnt));

        if (!resOpt.checkAttributeCount(rasb.getResolvedAttributeSet().getResolvedAttributeCount())) {
          Logger.error(this.getCtx(), TAG, "constructResolvedAttributes", this.getAtCorpusPath(), CdmLogCode.ErrRelMaxResolvedAttrReached, this.entityName);
          return null;
        }

        if (this.getExtendsEntityResolutionGuidance() != null) {
          resOpt.usedResolutionGuidance = true;

          // some guidance was given on how to integrate the base attributes into the set. apply that guidance
          ResolvedTraitSet rtsBase = this.fetchResolvedTraits(resOpt);

          // this context object holds all of the info about what needs to happen to resolve these attributes.
          // make a copy and set defaults if needed
          CdmAttributeResolutionGuidance resGuide =
                  (CdmAttributeResolutionGuidance) this.getExtendsEntityResolutionGuidance().copy(resOpt);
          resGuide.updateAttributeDefaults(resGuide.fetchObjectDefinitionName(), this);
          // holds all the info needed by the resolver code
          AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuide, rtsBase);

          rasb.generateApplierAttributes(arc, false); // true = apply the prepared traits to new atts
        }
      }
    }

    rasb.markInherited();
    rasb.getResolvedAttributeSet().setAttributeContext(under);

    if (this.getAttributes() != null) {
      int furthestChildDepth = 0;
      final int l = this.getAttributes().getCount();
      for (int i = 0; i < l; i++) {
        final CdmAttributeItem att = this.attributes.getAllItems().get(i);
        AttributeContextParameters acpAtt = null;
        if (under != null) {
          acpAtt = new AttributeContextParameters();
          acpAtt.setUnder(under);
          acpAtt.setType(CdmAttributeContextType.AttributeDefinition);
          acpAtt.setName(att.fetchObjectDefinitionName());
          acpAtt.setRegarding(att);
          acpAtt.setIncludeTraits(false);
        }

        ResolvedAttributeSet rasFromAtt = att.fetchResolvedAttributes(resOpt, acpAtt);
        
        // we can now set depth now that children nodes have been resolved
        if (att instanceof CdmEntityAttributeDefinition) {
          furthestChildDepth = rasFromAtt.getDepthTraveled() > furthestChildDepth ? rasFromAtt.getDepthTraveled() : furthestChildDepth;
        }

        // before we just merge, need to handle the case of 'attribute restatement' AKA an entity with an attribute having the same name as an attribute
        // from a base entity. thing might come out with different names, if they do, then any attributes owned by a similar named attribute before
        // that didn't just pop out of that same named attribute now need to go away.
        // mark any attributes formerly from this named attribute that don't show again as orphans
        rasb.getResolvedAttributeSet().markOrphansForRemoval(att.fetchObjectDefinitionName(), rasFromAtt);
        // now merge
        rasb.mergeAttributes(rasFromAtt);

        if (!resOpt.checkAttributeCount(rasb.getResolvedAttributeSet().getResolvedAttributeCount())) {
          Logger.error(this.getCtx(), TAG, "constructResolvedAttributes", this.getAtCorpusPath(), CdmLogCode.ErrRelMaxResolvedAttrReached, this.entityName);
          return null;
        }
      }
      rasb.getResolvedAttributeSet().setDepthTraveled(furthestChildDepth);
    }
    rasb.markOrder();
    rasb.getResolvedAttributeSet().setAttributeContext(under);

    // things that need to go away
    rasb.removeRequestedAtts();

    // recursively sets the target owner's to be this entity.
    // required because the replaceAsForeignKey operation uses the owner to generate the `is.linkedEntity.identifier` trait.
    rasb.getResolvedAttributeSet().setTargetOwner(this);

    return rasb;
  }

  public CompletableFuture<CdmEntityDefinition> createResolvedEntityAsync(final String newEntName) {
    return createResolvedEntityAsync(newEntName, null);
  }

  public CompletableFuture<CdmEntityDefinition> createResolvedEntityAsync(
      final String newEntName,
      final ResolveOptions resOpt) {
    return createResolvedEntityAsync(newEntName, resOpt,null, null);
  }

  public CompletableFuture<CdmEntityDefinition> createResolvedEntityAsync(
      final String newEntName,
      final ResolveOptions resOpt,
      final CdmFolderDefinition folder) {
    return createResolvedEntityAsync(newEntName, resOpt, folder, null);
  }

  /**
   * Creates a resolved copy of the entity.
   * @param newEntName the new entity name
   * @param resOpt the resolve options
   * @param folderDef the folder to save document in
   * @param newDocName the new document name
   * @return resolved entity definition
   */
  public CompletableFuture<CdmEntityDefinition> createResolvedEntityAsync(
      final String newEntName,
      final ResolveOptions resOpt,
      final CdmFolderDefinition folderDef,
      final String newDocName) {
    return CompletableFuture.supplyAsync(() -> {
      try (Logger.LoggerScope logScope = Logger.enterScope(TAG, getCtx(), "createResolvedEntityAsync")) {
        ResolveOptions tmpResOpt = resOpt;
        if (tmpResOpt == null) {
          tmpResOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        if (tmpResOpt.getWrtDoc() == null) {
          Logger.error(this.getCtx(), TAG, "createResolvedEntityAsync", this.getAtCorpusPath(), CdmLogCode.ErrDocWrtDocNotfound);
          return null;
        }

        if (StringUtils.isNullOrEmpty(newEntName)) {
          Logger.error(this.getCtx(), TAG, "createResolvedEntityAsync", this.getAtCorpusPath(), CdmLogCode.ErrResolveNewEntityNameNotSet);
          return null;
        }

        final ResolveOptions finalResOpt = tmpResOpt;
        final CdmFolderDefinition folder = folderDef != null ? folderDef : this.getInDocument().getFolder();
        // if the wrtDoc needs to be indexed (like it was just modified) then do that first
        if (!finalResOpt.getWrtDoc().indexIfNeededAsync(finalResOpt, true).join()) {
          Logger.error(this.getCtx(), TAG, "createResolvedEntityAsync", this.getAtCorpusPath(), CdmLogCode.ErrIndexFailed);
          return null;
        }

        final String fileName = (StringUtils.isNullOrEmpty(newDocName)) ? String.format("%s.cdm.json", newEntName) : newDocName;
        String origDoc = this.getInDocument().getAtCorpusPath();
        // Don't overwrite the source document
        final String targetAtCorpusPath = String.format("%s%s",
                this.getCtx()
                        .getCorpus()
                        .getStorage()
                        .createAbsoluteCorpusPath(folder.getAtCorpusPath(), folder),
                fileName);
        if (StringUtils.equalsWithIgnoreCase(targetAtCorpusPath, origDoc)) {
          Logger.error(this.getCtx(), TAG, "createResolvedEntityAsync", this.getAtCorpusPath(), CdmLogCode.ErrDocEntityReplacementFailure, targetAtCorpusPath);
          return null;
        }

        // make sure the corpus has a set of default artifact attributes
        this.getCtx().getCorpus().prepareArtifactAttributesAsync().join();

        // Make the top level attribute context for this entity.
        // For this whole section where we generate the attribute context tree and get resolved attributes.
        // Set the flag that keeps all of the parent changes and document dirty from from happening.
        boolean wasResolving = this.getCtx().getCorpus().isCurrentlyResolving;
        this.getCtx().getCorpus().isCurrentlyResolving = true;
        final String entName = newEntName;
        final ResolveContext ctx = (ResolveContext) this.getCtx();
        CdmAttributeContext attCtxEnt = ctx.getCorpus().makeObject(CdmObjectType.AttributeContextDef, entName, true);
        attCtxEnt.setCtx(ctx);
        attCtxEnt.setInDocument(this.getInDocument());

        // cheating a bit to put the paths in the right place
        final AttributeContextParameters acp = new AttributeContextParameters();
        acp.setUnder(attCtxEnt);
        acp.setType(CdmAttributeContextType.AttributeGroup);
        acp.setName("attributeContext");

        final CdmAttributeContext attCtxAC = CdmAttributeContext.createChildUnder(finalResOpt, acp);
        // this is the node that actually is first in the context we save. all definition refs should take the new perspective that they
        // can only be understood through the resolvedFrom moniker
        final CdmEntityReference entRefThis = ctx.getCorpus().makeObject(CdmObjectType.EntityRef, this.getName(), true);
        entRefThis.setOwner(this);
        entRefThis.setInDocument(this.getInDocument()); // need to set owner and inDocument to this starting entity so the ref will be portable to the new document
        CdmObject prevOwner = this.getOwner();
        entRefThis.setExplicitReference(this);
        // we don't want to change the owner of this entity to the entity reference
        // re-assign whatever was there before
        this.setOwner(prevOwner);

        final AttributeContextParameters acpEnt = new AttributeContextParameters();
        acpEnt.setUnder(attCtxAC);
        acpEnt.setType(CdmAttributeContextType.Entity);
        acpEnt.setName(entName);
        acpEnt.setRegarding(entRefThis);

        // reset previous depth information in case there are left overs
        finalResOpt.depthInfo.reset();

        final ResolveOptions resOptCopy = CdmAttributeContext.prepareOptionsForResolveAttributes(finalResOpt);
        // resolve attributes with this context. the end result is that each resolved attribute
        // points to the level of the context where it was  last modified, merged, created
        final ResolvedAttributeSet ras = this.fetchResolvedAttributes(resOptCopy, acpEnt);

        if (resOptCopy.usedResolutionGuidance) {
          Logger.warning(this.getCtx(), TAG, "createResolvedEntityAsync", this.getAtCorpusPath(), CdmLogCode.WarnDeprecatedResolutionGuidance);
        }

        if (ras == null) {
          return null;
        }

        this.getCtx().getCorpus().isCurrentlyResolving = wasResolving;

        // Make a new document in given folder if provided or the same folder as the source entity.
        folder.getDocuments().remove(fileName);
        CdmDocumentDefinition docRes = folder.getDocuments().add(fileName);
        // Add a import of the source document.
        origDoc = this.getCtx().getCorpus().getStorage().createRelativeCorpusPath(origDoc, docRes); // just in case we missed the prefix
        docRes.getImports().add(origDoc, "resolvedFrom");
        docRes.setDocumentVersion(this.getInDocument().getDocumentVersion());

        // Make the empty entity.
        CdmEntityDefinition entResolved = docRes.getDefinitions().add(entName);

        // grab that context that comes from fetchResolvedAttributes. We are sure this tree is a copy that we can own, so no need to copy it again
        CdmAttributeContext attCtx = null;
        if (attCtxAC != null && attCtxAC.getContents() != null && attCtxAC.getContents().size() == 1) {
          attCtx = (CdmAttributeContext) attCtxAC.getContents().get(0);
        }
        entResolved.setAttributeContext(attCtx);

        if (attCtx != null) {
          // fix all of the definition references, parent and lineage references, owner documents, etc. in the context tree
          attCtx.finalizeAttributeContext(resOptCopy, String.format("%s/attributeContext/", entName), docRes, this.getInDocument(), "resolvedFrom", true);

          // TEST CODE in C# by Jeff
          // run over the resolved attributes and make sure none have the dummy context
          //Action<ResolvedAttributeSet> testResolveAttributeCtx = null;
          //testResolveAttributeCtx = (rasSub) =>
          //{
          //    if (rasSub.Set.Count != 0 && rasSub.AttributeContext.AtCoprusPath.StartsWith("cacheHolder"))
          //        System.Diagnostics.Debug.WriteLine("Bad!!");
          //    rasSub.Set.ForEach(ra =>
          //    {
          //        if (ra.AttCtx.AtCoprusPath.StartsWith("cacheHolder"))
          //            System.Diagnostics.Debug.WriteLine("Bad!!");

          //        // the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
          //        if (ra.Target is ResolvedAttributeSet)
          //        {
          //            testResolveAttributeCtx(ra.Target as ResolvedAttributeSet);
          //        }
          //    });
          //};
          //testResolveAttributeCtx(ras);

        }
        // Add the traits of the entity, also add to attribute context top node
        ResolvedTraitSet rtsEnt = this.fetchResolvedTraits(finalResOpt);
        for (final ResolvedTrait rt : rtsEnt.getSet()) {
          CdmTraitReference traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
          entResolved.getExhibitsTraits().add(traitRef);
          traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt); // fresh copy
          if (entResolved.getAttributeContext() != null) {
            entResolved.getAttributeContext().getExhibitsTraits().add(traitRef);
          }
        }

        // special trait to explain this is a resolved entity
        entResolved.indicateAbstractionLevel("resolved", finalResOpt);

        if (entResolved.getAttributeContext() != null) {
          // the attributes have been named, shaped, etc for this entity so now it is safe to go and
          // make each attribute context level point at these final versions of attributes

          // what we have is a resolved attribute set (maybe with structure) where each ra points at the best tree node
          // we also have the tree of context, we need to flip this around so that the right tree nodes point at the paths to the
          // right attributes. so run over the resolved atts and then add a path reference to each one into the context contents where is last lived
          final Map<String, Integer> attPath2Order = new LinkedHashMap<>();
          final Set<String> finishedGroups = new LinkedHashSet<>();
          final Set<CdmAttributeContext> allPrimaryCtx = new LinkedHashSet<>(); // keep a list so it is easier to think about these later
          pointContextAtResolvedAtts(ras, entName + "/hasAttributes/", allPrimaryCtx, attPath2Order, finishedGroups);
          // the generated attribute structures sometimes has a LOT of extra nodes that don't say anything or explain anything
          // our goal now is to prune that tree to just have the stuff one may need
          // do this by keeping the leafs and all of the lineage nodes for the attributes that end up in the resolved entity
          // along with some special nodes that explain entity structure and inherit
          if (!attCtx.pruneToScope(allPrimaryCtx)) {
            // TODO: log error.
            return null;
          }

          // create an all-up ordering of attributes at the leaves of this tree based on insert order
          // sort the attributes in each context by their creation order and mix that with the other sub-contexts that have been sorted
          orderContents(attCtx, attPath2Order);

          // resolved attributes can gain traits that are applied to an entity when referenced
          // since these traits are described in the context, it is redundant and messy to list them in the attribute
          // so, remove them. create and cache a set of names to look for per context
          // there is actually a hierarchy to all attributes from the base entity should have all traits applied independently of the
          // sub-context they come from. Same is true of attribute entities. so do this recursively top down
          final HashMap<CdmAttributeContext, HashSet<String>> ctx2traitNames = new LinkedHashMap<>();

          collectContextTraits(attCtx, new LinkedHashSet<>(), ctx2traitNames);

          // add the attributes, put them in attribute groups if structure needed
          final Map<ResolvedAttribute, String> resAtt2RefPath = new LinkedHashMap<>();

          addAttributes(ras, entResolved, entName + "/hasAttributes/", docRes,
                  ctx2traitNames, resOptCopy, resAtt2RefPath);

          // fix entity traits
          if (entResolved.getExhibitsTraits() != null) {
            for (final CdmTraitReferenceBase et : entResolved.getExhibitsTraits()) {
              if (et instanceof CdmTraitReference) {
                replaceTraitAttRef((CdmTraitReference) et, newEntName, false);
              }
            }
          }

          fixContextTraits(attCtx, newEntName);
          // and the attribute traits
          final CdmCollection<CdmAttributeItem> entAttributes = entResolved.getAttributes();
          if (entAttributes != null) {
            entAttributes.forEach(entAtt -> {
              final CdmTraitCollection attTraits = entAtt.getAppliedTraits();
              if (attTraits != null) {
                attTraits.forEach(tr -> {
                  if (tr instanceof CdmTraitReference) {
                    replaceTraitAttRef((CdmTraitReference) tr, newEntName, false);
                  }
                });
              }
            });
          }
        }

        // we are about to put this content created in the context of various documents (like references to attributes from base entities, etc.)
        // into one specific document. all of the borrowed refs need to work. so, re-write all string references to work from this new document
        // the catch-22 is that the new document needs these fixes done before it can be used to make these fixes.
        // the fix needs to happen in the middle of the refresh
        // trigger the document to refresh current content into the resolved OM
        if (attCtx != null) {
          attCtx.setParent(null); // remove the fake parent that made the paths work
        }
        final ResolveOptions resOptNew = finalResOpt.copy();
        resOptNew.setLocalizeReferencesFor(docRes);
        resOptNew.setWrtDoc(docRes);
        docRes.refreshAsync(resOptNew).join();
        // get a fresh ref
        entResolved = (CdmEntityDefinition) docRes.fetchObjectFromDocumentPath(newEntName, resOptNew);

        this.getCtx().getCorpus().resEntMap.put(this.getAtCorpusPath(), entResolved.getAtCorpusPath());

        return entResolved;
      }
    });
  }

  private void pointContextAtResolvedAtts(final ResolvedAttributeSet rasSub, final String
          path, final Set<CdmAttributeContext> allPrimaryCtx, final Map<String, Integer> attPath2Order, final Set<String> finishedGroups) {
    rasSub.getSet().forEach(ra -> {
      final CdmAttributeContext raCtx = ra.getAttCtx();
      final CdmCollection<CdmObject> refs = raCtx.getContents();
      allPrimaryCtx.add(raCtx);

      String attRefPath = path + ra.getResolvedName();
      // the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
      if (ra.getTarget() instanceof CdmAttribute) {
        // it was an attribute, add to the content of the context, also, keep track of the ordering for all of the att paths we make up
        // as we go through the resolved attributes, this is the order of atts in the final resolved entity
        if (!attPath2Order.containsKey(attRefPath)) {
          final CdmObjectReference attRef = this.getCtx().getCorpus().makeObject(CdmObjectType.AttributeRef, attRefPath, true);
          // only need one explanation for this path to the insert order
          attPath2Order.put(attRef.getNamedReference(), ra.getInsertOrder());
          raCtx.getContents().add(attRef);
        }
      } else {
        // a group, so we know an attribute group will get created later with the name of the group and the things it contains will be in
        // the members of that group
        attRefPath += "/members/";
        if (!finishedGroups.contains(attRefPath)) {
          pointContextAtResolvedAtts((ResolvedAttributeSet)ra.getTarget(), attRefPath, allPrimaryCtx, attPath2Order, finishedGroups);
          finishedGroups.add(attRefPath);
        }
      }
    });
  }

  private boolean cleanSubGroup(final CdmObject subItem, HashSet<CdmAttributeContext> nodesToSave) {
    if (subItem.getObjectType() == CdmObjectType.AttributeRef) {
      return true; // not empty
    }

    CdmAttributeContext ac = (CdmAttributeContext)subItem;

    if (!nodesToSave.contains(ac)) {
      return false; // don't even look at content, this all goes away
    }

    if (ac.getContents() != null && ac.getContents().size() > 0) {
      // need to clean up the content array without triggering the code that fixes in document or paths
      final List<CdmObject> newContent = new ArrayList<>();
      for (final CdmObject sub : ac.getContents()) {
        // true means keep this as a child
        if (cleanSubGroup(sub, nodesToSave)) {
          newContent.add(sub);
        }
      }
      // clear the old content and replace
      ac.getContents().allItems.clear();
      ac.getContents().allItems.addAll(newContent);
    }

    return true;
  }

  private Integer orderContents(final CdmAttributeContext under, final Map<String, Integer> attPath2Order) {
    if (under.getLowestOrder() == null) {
      under.setLowestOrder(-1); // used for group with nothing but traits
      if (under.getContents().size() == 1) {
        under.setLowestOrder(getOrderNum(under.getContents().get(0), attPath2Order));
      } else {
        under.getContents().sort((l, r) -> {
          Integer lNum = getOrderNum(l, attPath2Order); // TODO-BQ: suppose to be getOrderNum(l, attPath2Order) == null ? -1 : getOrderNum(l, attPath2Order);
          if (lNum == null) {
            lNum = -1;
          }
          Integer rNum = getOrderNum(r, attPath2Order); // TODO-BQ: suppose to be getOrderNum(r, attPath2Order) == null ? -1 : getOrderNum(r, attPath2Order);
          if (rNum == null) {
            rNum = -1;
          }

          if (lNum != -1 && (under.getLowestOrder() == -1 || lNum < under.getLowestOrder())) {
            under.setLowestOrder(lNum);
          }
          if (rNum != -1 && (under.getLowestOrder() == -1 || rNum < under.getLowestOrder())) {
            under.setLowestOrder(rNum);
          }

          return lNum - rNum;
        });
      }
    }
    return under.getLowestOrder();
  }

  private Integer getOrderNum(final CdmObject item, final Map<String, Integer> attPath2Order) {
    if (item.getObjectType() == CdmObjectType.AttributeContextDef) {
      return orderContents((CdmAttributeContext) item, attPath2Order);
    } else if (item.getObjectType() == CdmObjectType.AttributeRef) {
      final String attName = ((CdmAttributeReference) item).getNamedReference();
      final int o = attPath2Order.get(attName);
      return o;
    } else {
      return -1; // put the mystery item on top
    }
  }

  private void collectContextTraits(final CdmAttributeContext subAttCtx, final HashSet<String> inheritedTraitNames,
                                    final Map<CdmAttributeContext, HashSet<String>> ctx2traitNames) {
    final LinkedHashSet<String> traitNamesHere = new LinkedHashSet<>(inheritedTraitNames);

    final CdmTraitCollection traitsHere = subAttCtx.getExhibitsTraits();
    if (traitsHere != null) {
      traitsHere.forEach(tat -> traitNamesHere.add(tat.getNamedReference()));
    }
    ctx2traitNames.put(subAttCtx, traitNamesHere);
    for (final Object cr : subAttCtx.getContents().getAllItems()) {

      if (((CdmObject) cr).getObjectType() == CdmObjectType.AttributeContextDef) {
        // do this for all types?
        collectContextTraits((CdmAttributeContext) cr, traitNamesHere, ctx2traitNames);
      }
    }
  }

  private void addAttributes(final ResolvedAttributeSet rasSub, final Object container, final String path,
                             final CdmDocumentDefinition docRes,
                             final Map<CdmAttributeContext, HashSet<String>> ctx2traitNames, final ResolveOptions resOptCopy,
                             final Map<ResolvedAttribute, String> resAtt2RefPath) {
    rasSub.getSet().forEach(ra -> {
      final String attPath = path + ra.getResolvedName();
      // use the path of the context associated with this attribute to find the new context that matches on path
      final CdmAttributeContext raCtx = ra.getAttCtx();

      final Object target = ra.getTarget();
      if (target instanceof ResolvedAttributeSet) {
          // this is a set of attributes.
          // make an attribute group to hold them
          final CdmAttributeGroupDefinition attGrp = this.getCtx().getCorpus()
                  .makeObject(CdmObjectType.AttributeGroupDef, ra.getResolvedName(), false);
          attGrp.setAttributeContext(this.getCtx().getCorpus()
                  .makeObject(CdmObjectType.AttributeContextRef, raCtx.getAtCorpusPath(), true));

          // debugLineage - from C#
          //attGrp.AttributeContext.NamedReference = $"{ raCtx.AtCoprusPath}({raCtx.Id})";

          // take any traits from the set and make them look like traits exhibited by the group
          final HashSet<String> avoidSet = ctx2traitNames.get(raCtx);
          // traits with the same name can show up on entities and attributes AND have different meanings.
          avoidSet.clear();
          final ResolvedTraitSet rtsAtt = ra.getResolvedTraits();
            rtsAtt.getSet().forEach(rt -> {
              if (rt.getTrait().getUgly() == null || (rt.getTrait().getUgly() != null && !rt.getTrait().getUgly())) {
                if (avoidSet == null || !avoidSet.contains(rt.getTraitName())) {
                  // avoid the ones from the context
                  final CdmTraitReference traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
                  attGrp.getExhibitsTraits().add(traitRef);
                }
              }
            });

          // wrap it in a reference and then recurse with this as the new container
          final CdmAttributeGroupReference attGrpRef = this.getCtx().getCorpus().makeObject(CdmObjectType.AttributeGroupRef, null, false);
          attGrpRef.setExplicitReference(attGrp);
          if (container instanceof CdmEntityDefinition) {
            ((CdmEntityDefinition) container).addAttributeDef(attGrpRef);
          } else if (container instanceof CdmAttributeGroupDefinition) {
            ((CdmAttributeGroupDefinition) container).addAttributeDef(attGrpRef);
          }
          // isn't this where ...
          addAttributes(((ResolvedAttributeSet) ra.getTarget()), attGrp, attPath + "/members/", docRes, ctx2traitNames, resOptCopy, resAtt2RefPath);
      } else {
        final CdmTypeAttributeDefinition att = this.getCtx().getCorpus().makeObject(CdmObjectType.TypeAttributeDef, ra.getResolvedName(), false);
        att.setAttributeContext(this.getCtx().getCorpus().makeObject(CdmObjectType.AttributeContextRef, raCtx.getAtCorpusPath(), true));
        // debugLineage
        //att.AttributeContext.NamedReference = $"{ raCtx.AtCoprusPath}({raCtx.Id})";

        final HashSet<String> avoidSet = ctx2traitNames.get(raCtx);
        // i don't know why i thought this was the right thing to do,
        // traits with the same name can show up on entities and attributes AND have different meanings.
        avoidSet.clear();
        // i really need to figure out the effects of this before making this change
        // without it, some traits don't make it to the resolved entity
        // with it, too many traits might make it there

        final ResolvedTraitSet rtsAtt = ra.getResolvedTraits();
        rtsAtt.getSet().forEach(rt -> {
          if (rt.getTrait().getUgly() == null || !rt.getTrait().getUgly()) {
            // don't mention your ugly traits
            if (avoidSet == null || !avoidSet.contains(rt.getTraitName())) {
              // avoid the ones from the context
              final CdmTraitReference traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
              att.getAppliedTraits().add(traitRef);

              // the trait that points at other entities for foreign keys, that is trouble
              // the string value in the table needs to be a relative path from the document of this entity
              // to the document of the related entity. but, right now it is a relative path to the source entity
              // so find those traits, and adjust the paths in the tables they hold
              if (rt.getTraitName().equals("is.linkedEntity.identifier")) {
                // grab the content of the table from the new ref (should be a copy of orig)
                List<List<String>> linkTable = null;
                if (traitRef.getArguments() != null && traitRef.getArguments().size() > 0) {
                  final CdmArgumentCollection args = traitRef.getArguments();
                  final CdmEntityReference entRef = args != null ? (CdmEntityReference)args.get(0).getValue() : null;
                  final CdmConstantEntityDefinition constantEntDef = entRef != null ? (CdmConstantEntityDefinition)entRef.getExplicitReference() : null;
                  linkTable = constantEntDef != null ? constantEntDef.getConstantValues() : null;
                }
                if (linkTable != null && linkTable.size() > 0) {
                  for (final List<String> row : linkTable) {
                    if (row.size() == 2 || row.size() == 3) { // either the old table or the new one with relationship name can be there
                      // entity path an attribute name
                      String fixedPath = row.get(0);
                      fixedPath = this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(fixedPath, this.getInDocument()); // absolute from relative to this
                      fixedPath = this.getCtx().getCorpus().getStorage().createRelativeCorpusPath(fixedPath, docRes); // realtive to new entity
                      row.set(0, fixedPath);
                    }
                  }
                }
              }
            }
          }
        });

        // none of the dataformat traits have the bit set that will make them turn into a property
        // this is intentional so that the format traits make it into the resolved object
        // but, we still want a guess as the data format, so get it and set it.
        final CdmDataFormat impliedDataFormat = att.fetchDataFormat();
        if (impliedDataFormat != CdmDataFormat.Unknown) {
          att.updateDataFormat(impliedDataFormat);
        }

        if (container instanceof CdmEntityDefinition) {
          ((CdmEntityDefinition) container).addAttributeDef(att);
        } else if (container instanceof CdmAttributeGroupDefinition) {
          ((CdmAttributeGroupDefinition) container).addAttributeDef(att);
        }

        resAtt2RefPath.put(ra, attPath);
      }
    });
  }

  private void replaceTraitAttRef(final CdmTraitReference tr, final String entityHint, final boolean isAttributeContext) {
    // any resolved traits that hold arguments with attribute refs should get 'fixed' here
    if (tr.getArguments() != null) {
      for (final CdmArgumentDefinition argumentDef : tr.getArguments().getAllItems()) {
        final CdmArgumentDefinition arg = argumentDef;
        final Object v = arg.getUnResolvedValue() != null ? arg.getUnResolvedValue() : arg.getValue();
        // is this an attribute reference?
        if (v instanceof CdmObject) {
          if (((CdmObject) v).getObjectType() == CdmObjectType.AttributeRef) {
            // only try this if the reference has no path to it (only happens with intra-entity att refs)
            final CdmAttributeReference attRef = ((CdmAttributeReference) v);
            if (!StringUtils.isNullOrEmpty(attRef.getNamedReference()) && attRef.getNamedReference().indexOf('/') == -1) {
              if (arg.getUnResolvedValue() == null) {
                arg.setUnResolvedValue(arg.getValue());
              }

              // give a promise that can be worked out later. assumption is that the attribute must come from this entity.
              final CdmAttributeReference newAttRef = this.getCtx().getCorpus().makeRef(CdmObjectType.AttributeRef,
                      entityHint + "/(resolvedAttributes)/" + attRef.getNamedReference(), true);
              // inDocument is not propagated during resolution, so set it here
              newAttRef.setInDocument(arg.getInDocument());
              arg.setValue(newAttRef);
            }
          }
        }
      }
    }
  }

  private void fixContextTraits(final CdmAttributeContext subAttCtx, final String entityHint) {
    // fix context traits
    final CdmTraitCollection traitsHere = subAttCtx.getExhibitsTraits();
    if (traitsHere != null) {
      traitsHere.forEach(tr -> {
        if (tr instanceof CdmTraitReference) {
          replaceTraitAttRef((CdmTraitReference) tr, entityHint, true);
        }
      });
    }
    subAttCtx.getContents().getAllItems().forEach(cr -> {
      if (cr.getObjectType() == CdmObjectType.AttributeContextDef) {
        // if this is a new entity context, get the name to pass along
        final CdmAttributeContext subSubAttCtx = (CdmAttributeContext) cr;
        String subEntityHint = entityHint;
        if (subSubAttCtx.getType() == CdmAttributeContextType.Entity && subSubAttCtx.getDefinition() != null) {
          subEntityHint = subSubAttCtx.getDefinition().getNamedReference();
        }
        // do this for all types
        fixContextTraits(subSubAttCtx, subEntityHint);
      }
    });
  }

  ResolvedAttributeSet getAttributesWithTraits(final ResolveOptions resOpt, final Object queryFor) {
    try {
      final ResolvedAttributeSet resolvedAttributeSet = fetchResolvedAttributes(resOpt);
      if (resolvedAttributeSet != null) {
        return resolvedAttributeSet.fetchAttributesWithTraits(resOpt, queryFor);
      }
    } catch (final IOException ex) {
      // TODO-BQ: What to do here, report it?
      Logger.error(this.getCtx(), TAG, "getAttributesWithTraits", this.getAtCorpusPath(), CdmLogCode.ErrTraitAttrFetchError, ex.getLocalizedMessage());
    }
    return null;
  }

  public String getPrimaryKey() {
    return (String) this.t2pm.fetchPropertyValue(CdmPropertyName.PRIMARY_KEY);
  }

  boolean getIsResolved() {
    return (boolean) this.t2pm.fetchPropertyValue(CdmPropertyName.IS_RESOLVED);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param propertyName CDM Property name
   * @return Object
   */
  @Deprecated
  public Object getProperty(final CdmPropertyName propertyName) {
    return this.t2pm.fetchPropertyValue(propertyName, true);
  }

  TraitToPropertyMap getTraitToPropertyMap() {
    return this.t2pm;
  }

  private CompletableFuture<List<?>> queryOnTraitsAsync(final Object querySpec) {
    return null;
  }

  @Deprecated
  public ResolvedEntity getResolvedEntity(final ResolveOptions resOpt) {
    return new ResolvedEntity(this, resOpt);
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = this.fetchDeclaredPath(pathFrom);

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.getExtendsEntity() != null) {
      if (this.getExtendsEntity().visit(path + "/extendsEntity/", preChildren, postChildren)) {
        return true;
      }
    }

    if (this.getExtendsEntityResolutionGuidance() != null)  {
      this.getExtendsEntityResolutionGuidance().setOwner(this);
      if (this.getExtendsEntityResolutionGuidance().visit(pathFrom + "/extendsEntityResolutionGuidance/", preChildren, postChildren)) {
        return true;
      }
    }

    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }
    if (this.getAttributeContext() != null) {
      this.getAttributeContext().setOwner(this);
      if (this.getAttributeContext()
              .visit(path + "/attributeContext/", preChildren, postChildren)) {
        return true;
      }
    }
    if (this.getAttributes() != null && this.attributes.visitList(path + "/hasAttributes/", preChildren, postChildren)) {
      return true;
    }
    return postChildren != null && postChildren.invoke(this, path);
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.entityName)) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("entityName"));
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  @Override
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmEntityDefinition.class);
  }

  /**
   *
   * @param resOpt Resolved options
   * @param host CDM Object
   * @return CDM Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmEntityDefinition copy;
    if (host == null) {
      copy = new CdmEntityDefinition(this.getCtx(), this.getEntityName(), null);
    } else {
      copy = (CdmEntityDefinition) host;
      copy.setEntityName(this.getEntityName());
      copy.getAttributes().clear();
    }

    copy.setExtendsEntity(
            this.getExtendsEntity() != null
                    ? (CdmEntityReference) this.getExtendsEntity().copy(resOpt) : null);
    copy.setExtendsEntityResolutionGuidance(
            this.getExtendsEntityResolutionGuidance() != null
                    ? (CdmAttributeResolutionGuidance) this.getExtendsEntityResolutionGuidance().copy(resOpt) : null);
    copy.setAttributeContext(
            this.getAttributeContext() != null
                    ? (CdmAttributeContext) this.getAttributeContext().copy(resOpt) : null);
    for (final CdmAttributeItem hasAttribute : this.getAttributes()) {
      copy.getAttributes().add((CdmAttributeItem)hasAttribute.copy(resOpt));
    }
    this.copyDef(resOpt, copy);
    return copy;
  }

  /**
   * @deprecated for internal use only.
   */
  @Override
  public ResolvedEntityReferenceSet fetchResolvedEntityReferences(ResolveOptions resOpt) {
    final boolean wasPreviouslyResolving = this.getCtx().getCorpus().isCurrentlyResolving;
    this.getCtx().getCorpus().isCurrentlyResolving = true;

    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    // this whole resolved entity ref goo will go away when resolved documents are done.
    // for now, it breaks if structured att sets get made.
    resOpt = resOpt.copy();
    final Set<String> LinkedHashSet = new LinkedHashSet<>();
    LinkedHashSet.add("normalized");
    LinkedHashSet.add("referenceOnly");

    resOpt = resOpt.copy();
    resOpt.setDirectives(new AttributeResolutionDirectiveSet(LinkedHashSet));

    ResolvedEntityReferenceSet entRefSet = new ResolvedEntityReferenceSet(resOpt);
    if (!resolvingEntityReferences) {
      resolvingEntityReferences = true;
      // get from dynamic base public class and then 'fix' those to point here instead.
      final CdmObjectReference extRef = this.extendsEntity;
      if (extRef != null) {
        CdmEntityDefinition extDef = extRef.fetchObjectDefinition(resOpt);
        if (extDef != null) {
          final ResolvedEntityReferenceSet inherited = extDef.fetchResolvedEntityReferences(resOpt);
          if (inherited != null) {
            for (final ResolvedEntityReference res : inherited.getSet()) {
              final ResolvedEntityReference resolvedEntityReference = res.copy();
              resolvedEntityReference.getReferencing().setEntity(this);
              entRefSet.getSet().add(resolvedEntityReference);
            }
          }
        }
      }
      if (this.getAttributes() != null) {
        for (int i = 0; i < this.getAttributes().getCount(); i++) {
          // if dynamic refs come back from attributes, they don't know who we are, so they don't set the entity
          final ResolvedEntityReferenceSet sub = this.getAttributes().getAllItems().get(i)
                  .fetchResolvedEntityReferences(resOpt);
          if (sub != null) {
            for (final ResolvedEntityReference res : sub.getSet()) {
              res.getReferencing().setEntity(this);
            }
            entRefSet.add(sub);
          }
        }
      }
      this.resolvingEntityReferences = false;
    }

    this.getCtx().getCorpus().isCurrentlyResolving = wasPreviouslyResolving;
    return entRefSet;
  }

  CdmAttributeItem addAttributeDef(CdmAttributeItem attributeDef) {
      this.getAttributes().add(attributeDef);
      return attributeDef;
  }

  /**
   * Creates or sets the has.entitySchemaAbstractionLevel trait to logical, composition, resolved or unknown
   * todo: consider making this public API
   * @param level String
   * @param resOpt ResolveOptions
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Deprecated
  public void indicateAbstractionLevel(final String level, final ResolveOptions resOpt)
  {
    // see if entitySchemaAbstractionLevel is a known trait to this entity
    if (resOpt!= null &&
            this.getCtx().getCorpus().resolveSymbolReference(resOpt, this.getInDocument(), "has.entitySchemaAbstractionLevel", CdmObjectType.TraitDef, false) == null) {
      return;
    }

    // get or add the trait
    CdmTraitReference traitRef = (CdmTraitReference) this.getExhibitsTraits().item("has.entitySchemaAbstractionLevel");
    if (traitRef == null) {
      traitRef = new CdmTraitReference(this.getCtx(), "has.entitySchemaAbstractionLevel", false, true);
      this.getExhibitsTraits().add(traitRef);
    }
    // get or add the one argument
    CdmArgumentDefinition argDef;
    if (traitRef.getArguments() != null && traitRef.getArguments().size() == 1) {
      argDef = traitRef.getArguments().get(0);
    } else {
      argDef = new CdmArgumentDefinition(this.getCtx(), "level");
      traitRef.getArguments().add(argDef);
    }
    // set it
    argDef.setValue(level);
  }
}
