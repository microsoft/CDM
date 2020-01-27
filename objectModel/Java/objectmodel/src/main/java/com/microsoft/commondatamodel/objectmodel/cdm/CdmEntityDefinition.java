// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
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
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CdmEntityDefinition extends CdmObjectDefinitionBase implements CdmReferencesEntities {
  private static final Logger LOGGER = LoggerFactory.getLogger(CdmEntityDefinition.class);

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
    if (extendsEntity != null) {
      this.setExtendsEntity(extendsEntity);
    }

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
    this.extendsEntity = extendsEntity;
  }

  public CdmAttributeResolutionGuidance getExtendsEntityResolutionGuidance() {
    return extendsEntityResolutionGuidance;
  }

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

  public boolean isResolvingEntityReferences() {
    return this.resolvingEntityReferences;
  }

  public void setResolvingEntityReferences(final boolean resolvingEntityReferences) {
    this.resolvingEntityReferences = resolvingEntityReferences;
  }

  @Override
  public String getName() {
    return this.entityName;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, final ResolveOptions resOpt) {
    return false;
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

  public int countInheritedAttributes(final ResolveOptions resOpt) {
    // ensures that cache exits
    this.fetchResolvedAttributes(resOpt);
    return this.rasb.getInheritedMark();
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // base traits then add any elevated from attributes then add things exhibited by the att.
    final CdmObjectReference baseClass = this.extendsEntity;
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

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
    // find and cache the complete set of attributes
    // attributes definitions originate from and then get modified by subsequent re-definitions from (in this order):
    // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
    // the relationship of the attribute, the attribute definition itself and included attribute groups, dynamic traits applied to the attribute.
    this.rasb = new ResolvedAttributeSetBuilder();
    this.rasb.getResolvedAttributeSet().setAttributeContext(under);

    if (this.getExtendsEntity() != null) {
      final CdmObjectReference extRef = this.extendsEntity;
      final CdmAttributeContext extendsRefUnder;
      AttributeContextParameters acpExtEnt = null;
      if (under != null) {
        final AttributeContextParameters acpExt = new AttributeContextParameters();
        acpExt.setUnder(under);
        acpExt.setType(CdmAttributeContextType.EntityReferenceExtends);
        acpExt.setName("extends");
        acpExt.setRegarding(null);
        acpExt.setIncludeTraits(false);

        extendsRefUnder = this.rasb.getResolvedAttributeSet().createAttributeContext(resOpt, acpExt);
        acpExtEnt = new AttributeContextParameters();
        acpExtEnt.setUnder(extendsRefUnder);
        acpExtEnt.setType(CdmAttributeContextType.Entity);
        acpExtEnt.setName(extRef.getNamedReference());
        acpExtEnt.setRegarding(extRef);
        acpExtEnt.setIncludeTraits(false);
      }

      // save moniker, extended entity may attach a different moniker that we do not
      // want to pass along to getting this entities attributes
      final String oldMoniker = resOpt.getFromMoniker();

      this.rasb.mergeAttributes(this.extendsEntity.fetchResolvedAttributes(resOpt, acpExtEnt));

      if (this.getExtendsEntityResolutionGuidance() != null) {
        // some guidance was given on how to integrate the base attributes into the set. apply that guidance
        ResolvedTraitSet rtsBase = this.fetchResolvedTraits(resOpt);

        // this context object holds all of the info about what needs to happen to resolve these attributes.
        // make a copy and set defaults if needed
        CdmAttributeResolutionGuidance resGuide =
            (CdmAttributeResolutionGuidance) this.getExtendsEntityResolutionGuidance().copy(resOpt);
        resGuide.updateAttributeDefaults(resGuide.fetchObjectDefinitionName());
        // holds all the info needed by the resolver code
        AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuide, rtsBase);

        this.rasb.generateApplierAttributes(arc, false); // true = apply the prepared traits to new atts
      }

      // reset to the old moniker
      resOpt.setFromMoniker(oldMoniker);
    }

    this.rasb.markInherited();
    this.rasb.getResolvedAttributeSet().setAttributeContext(under);

    if (this.getAttributes() != null) {
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

        this.rasb.mergeAttributes(att.fetchResolvedAttributes(resOpt, acpAtt));
      }
    }
    this.rasb.markOrder();
    this.rasb.getResolvedAttributeSet().setAttributeContext(under);

    // things that need to go away
    this.rasb.removeRequestedAtts();

    return this.rasb;
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

  public CompletableFuture<CdmEntityDefinition> createResolvedEntityAsync(
      final String newEntName,
      ResolveOptions resOpt,
      CdmFolderDefinition folderDef,
      final String newDocName) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this);
    }

    if (resOpt.getWrtDoc() == null) {
      LOGGER.error("No WRT document was supplied.");
      return CompletableFuture.completedFuture(null);
    }

    if (Strings.isNullOrEmpty(newEntName)) {
      LOGGER.error("No Entity Name provided.");
      return CompletableFuture.completedFuture(null);
    }

    if (folderDef == null) {
      folderDef = this.getInDocument().getFolder();
    }

    final ResolveOptions finalResOpt = resOpt;
    final CdmFolderDefinition folder = folderDef != null ? folderDef : this.getInDocument().getFolder();
    return CompletableFuture.supplyAsync(() -> {
      final String fileName = (Strings.isNullOrEmpty(newDocName)) ? String.format("%s.cdm.json", newEntName) : newDocName;
      String origDoc = this.getInDocument().getAtCorpusPath();
      // Don't overwrite the source document
      final String targetAtCorpusPath = String.format("%s%s",
          this.getCtx()
              .getCorpus()
              .getStorage()
              .createAbsoluteCorpusPath(folder.getAtCorpusPath(), folder),
          fileName);
      if (targetAtCorpusPath.equalsIgnoreCase(origDoc)) {
        LOGGER.error("Attempting to replace source entity's document '{}'", targetAtCorpusPath);
        return null;
      }

      // if the wrtDoc needs to be indexed (like it was just modified) then do that first
      if (!finalResOpt.getWrtDoc().indexIfNeededAsync(finalResOpt).join()) {
        LOGGER.error("Couldn't index source document.");
        return null;
      }

      // Make the top level attribute context for this entity.
      // For this whole section where we generate the attribute context tree and get resolved attributes.
      // Set the flag that keeps all of the parent changes and document dirty from from happening.
      boolean wasResolving = this.getCtx().getCorpus().isCurrentlyResolving;
      this.getCtx().getCorpus().isCurrentlyResolving = true;
      final ResolveContext ctx = (ResolveContext) this.getCtx();
      CdmAttributeContext attCtxEnt = ctx.getCorpus().makeObject(CdmObjectType.AttributeContextDef, newEntName, true);
      attCtxEnt.setCtx(ctx);
      attCtxEnt.setInDocument(this.getInDocument());

      // cheating a bit to put the paths in the right place
      final AttributeContextParameters acp = new AttributeContextParameters();
      acp.setUnder(attCtxEnt);
      acp.setType(CdmAttributeContextType.AttributeGroup);
      acp.setName("attributeContext");

      final CdmAttributeContext attCtxAC = CdmAttributeContext.createChildUnder(finalResOpt, acp);
      final AttributeContextParameters acpEnt = new AttributeContextParameters();
      acpEnt.setUnder(attCtxAC);
      acpEnt.setType(CdmAttributeContextType.Entity);
      acpEnt.setName(newEntName);
      acpEnt.setRegarding(ctx.getCorpus().makeObject(CdmObjectType.EntityRef, this.getName(), true));

      // use this whenever we need to keep references pointing at things that were already found. used when 'fixing' references by localizing to a new document
      final ResolveOptions resOptCopy = CdmObjectBase.copyResolveOptions(finalResOpt);
      resOptCopy.setSaveResolutionsOnCopy(true);

      // resolve attributes with this context. the end result is that each resolved attribute
      // points to the level of the context where it was created
      final ResolvedAttributeSet ras = this.fetchResolvedAttributes(resOptCopy, acpEnt);

      // create a new copy of the attribute context for this entity
      final LinkedHashSet<CdmAttributeContext> allAttCtx = new LinkedHashSet<>();
      final CdmAttributeContext newNode = ((CdmAttributeContext) attCtxEnt.copyNode(finalResOpt));
      attCtxEnt = attCtxEnt.copyAttributeContextTree(finalResOpt, newNode, ras, allAttCtx, "resolvedFrom");
      final CdmAttributeContext attCtx = (CdmAttributeContext) (((CdmAttributeContext) attCtxEnt.getContents().get(0))).getContents().get(0);

      this.getCtx().getCorpus().isCurrentlyResolving = wasResolving;

      // Make a new document in given folder if provided or the same folder as the source entity.
      folder.getDocuments().remove(fileName);
      CdmDocumentDefinition docRes = folder.getDocuments().add(fileName);
      // Add a import of the source document.
      origDoc = this.getCtx().getCorpus().getStorage().createRelativeCorpusPath(origDoc, docRes); // just in case we missed the prefix
      docRes.getImports().add(origDoc, "resolvedFrom");

      // Make the empty entity.
      CdmEntityDefinition entResolved = docRes.getDefinitions().add(newEntName);
      // Set the context to the copy of the tree. Fix the docs on the context nodes.
      entResolved.setAttributeContext(attCtx);
      attCtx.visit(newEntName + "/attributeContext/", (obj, path) -> {
            obj.setInDocument(docRes);
            return false;
          },
          null);

      // Add the traits of the entity.
      ResolvedTraitSet rtsEnt = this.fetchResolvedTraits(finalResOpt);
      for (final ResolvedTrait rt : rtsEnt.getSet()) {
        final CdmTraitReference traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
        entResolved.getExhibitsTraits().add(traitRef);
      }

      // the attributes have been named, shaped, etc for this entity so now it is safe to go and
      // make each attribute context level point at these final versions of attributes
      final Map<String, Integer> attPath2Order = new LinkedHashMap<>();

      pointContextAtResolvedAtts(ras, newEntName + "/hasAttributes/", allAttCtx, attPath2Order);

      // generate attribute structures may end up with 0 attributes after that. prune them
      cleanSubGroup(attCtx, false);

      orderContents(attCtx, attPath2Order);

      // resolved attributes can gain traits that are applied to an entity when referenced
      // since these traits are described in the context, it is redundant and messy to list them in the attribute
      // so, remove them. create and cache a set of names to look for per context
      // there is actually a hierarchy to  all attributes from the base entity should have all traits applied independed of the
      // sub-context they come from. Same is true of attribute entities. so do this recursively top down
      final Map<CdmAttributeContext, LinkedHashSet<String>> ctx2traitNames = new LinkedHashMap<>();

      collectContextTraits(attCtx, new LinkedHashSet<>(), ctx2traitNames);

      // add the attributes, put them in attribute groups if structure needed
      final Map<ResolvedAttribute, String> resAtt2RefPath = new LinkedHashMap<>();

      addAttributes(ras, entResolved, newEntName + "/hasAttributes/", allAttCtx,
              ctx2traitNames, resOptCopy, resAtt2RefPath);

      // fix entity traits
      if (entResolved.getExhibitsTraits() != null) {
        for (final CdmTraitReference et : entResolved.getExhibitsTraits()) {
          replaceTraitAttRef(et, newEntName, false);
        }
      }

      fixContextTraits(attCtx, newEntName);
      // and the attribute traits
      final CdmCollection<CdmAttributeItem> entAttributes = entResolved.getAttributes();
      if (entAttributes != null) {
        entAttributes.forEach(entAtt -> {
          final CdmTraitCollection attTraits = entAtt.getAppliedTraits();
          if (attTraits != null) {
            attTraits.forEach(tr -> replaceTraitAttRef(tr, newEntName, false));
          }
        });
      }

      // we are about to put this content created in the context of various documents (like references to attributes from base entities, etc.)
      // into one specific document. all of the borrowed refs need to work. so, re-write all string references to work from this new document
      // the catch-22 is that the new document needs these fixes done before it can be used to make these fixes.
      // the fix needs to happen in the middle of the refresh
      // trigger the document to refresh current content into the resolved OM
      attCtx.setParent(null); // remove the fake parent that made the paths work
      final ResolveOptions resOptNew = CdmObjectBase.copyResolveOptions(finalResOpt);
      resOptNew.setLocalizeReferencesFor(docRes);
      resOptNew.setWrtDoc(docRes);
      docRes.refreshAsync(resOptNew).join();
      // get a fresh ref
      entResolved = (CdmEntityDefinition) docRes.fetchObjectFromDocumentPath(newEntName);

      return entResolved;
    });
  }

  private void pointContextAtResolvedAtts(final ResolvedAttributeSet rasSub, final String
          path, final Set<CdmAttributeContext> allAttCtx, final Map<String, Integer> attPath2Order) {
    rasSub.getSet().forEach(ra -> {
      final Set<CdmAttributeContext> raCtxSet = rasSub.getRa2attCtxSet().get(ra);
      List<CdmAttributeContext> raCtxInEnt = new ArrayList<>();

      // Find the correct attCtx for this copy, intersect these two sets.
      // (Iterate over the shortest list.)
      if (raCtxSet != null && allAttCtx.size() < raCtxSet.size()) {
        // find the correct attCtx for this copy
        for (final CdmAttributeContext currAttCtx : allAttCtx) {
          if (raCtxSet.contains(currAttCtx)) {
            raCtxInEnt.add(currAttCtx);
          }
        }
      } else {
        raCtxSet.forEach(currAttCtx -> {
          if (allAttCtx.contains(currAttCtx)) {
            raCtxInEnt.add(currAttCtx);
          }
        });
      }

      for (final CdmAttributeContext raCtx : raCtxInEnt) {
        if (raCtx != null) {
          final CdmCollection<CdmObject> refs = raCtx.getContents();
          // this won't work when I add the structured attributes to avoid name collisions
          String attRefPath = path + ra.getResolvedName();
          try {
            if (ra.getTarget() != null
                && ra.getTarget() instanceof CdmAttribute
                && ra.getTarget().getClass().getMethod("getObjectType") != null) {
              final CdmObjectReference attRef = this.getCtx().getCorpus().makeObject(CdmObjectType.AttributeRef, attRefPath, true);
              attPath2Order.put(attRef.getNamedReference(), ra.getInsertOrder());
              refs.add(attRef);
            } else {
              attRefPath += "/members/";
              pointContextAtResolvedAtts(((ResolvedAttributeSet) ra.getTarget()), attRefPath, allAttCtx, attPath2Order);
            }
          } catch (final NoSuchMethodException e) {
            throw new RuntimeException(e.getMessage());
          }
        }
      }
    });
  }

  private boolean cleanSubGroup(final Object subItem, boolean underGenerated) {
    if (subItem instanceof CdmObject && ((CdmObject) subItem).getObjectType() == CdmObjectType.AttributeRef) {
      return true; // not empty
    }
    if (subItem instanceof CdmAttributeContext) {
      final CdmAttributeContext ac = (CdmAttributeContext) subItem;

      if (ac.getType() == CdmAttributeContextType.GeneratedSet) {
        underGenerated = true;
      }
      if (ac.getContents() == null || ac.getContents().size() == 0) {
        return false; // empty
      }
      // look at all children, make a set to remove
      final List<CdmAttributeContext> toRemove = new ArrayList<>();
      for (final Object subSub : ac.getContents()) {
        if (!cleanSubGroup(subSub, underGenerated)) {
          boolean potentialTarget = underGenerated;

          if (!potentialTarget) {
            // cast is safe because we returned false meaning empty and not a attribute ref
            // so is this the set holder itself?
            potentialTarget = ((CdmAttributeContext) subSub).getType() == CdmAttributeContextType.GeneratedSet;
          }

          if (potentialTarget) {
            toRemove.add((CdmAttributeContext) subSub);
          }
        }
      }
      for (final CdmAttributeContext toDie : toRemove) {
        ac.getContents().remove(toDie);
      }
      return ac.getContents().size() != 0;
    }
    return false;
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
    // create an all-up ordering of attributes at the leaves of this tree based on insert order
    // sort the attributes in each context by their creation order and mix that with the other sub-contexts that have been sorted
    if (item.getObjectType() == CdmObjectType.AttributeContextDef) {
      return orderContents(((CdmAttributeContext) item), attPath2Order);
    } else if (item.getObjectType() == CdmObjectType.AttributeRef) {
      final String attName = ((CdmAttributeReference) item).getNamedReference();
      final int o = attPath2Order.get(attName);
      return o;
    } else {
      return -1; // put the mystery item on top
    }
  }

  private void collectContextTraits(final CdmAttributeContext subAttCtx, final LinkedHashSet<String> inheritedTraitNames,
                                    final Map<CdmAttributeContext, LinkedHashSet<String>> ctx2traitNames) {
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
                             final Set<CdmAttributeContext> allAttCtx,
                             final Map<CdmAttributeContext, LinkedHashSet<String>> ctx2traitNames, final ResolveOptions resOptCopy,
                             final Map<ResolvedAttribute, String> resAtt2RefPath) {
    rasSub.getSet().forEach(ra -> {
      final String attPath = path + ra.getResolvedName();
      // use the path of the context associated with this attribute to find the new context that matches on path
      final Set<CdmAttributeContext> raCtxSet = rasSub.getRa2attCtxSet().get(ra);
      CdmAttributeContext raCtx = null;
      // find the correct attCtx for this copy
      if (raCtxSet != null) {
        for (final CdmAttributeContext currAttCtx : allAttCtx) {
          if (raCtxSet.contains(currAttCtx)) {
            raCtx = currAttCtx;
            break;
          }
        }
      }

      final Object target = ra.getTarget();
      if (target instanceof ResolvedAttributeSet) {
          // this is a set of attributes.
          // make an attribute group to hold them
          final CdmAttributeGroupDefinition attGrp = this.getCtx().getCorpus()
                  .makeObject(CdmObjectType.AttributeGroupDef, ra.getResolvedName(), false);
          attGrp.setAttributeContext(this.getCtx().getCorpus()
                  .makeObject(CdmObjectType.AttributeContextRef, raCtx.getAtCorpusPath(), true));
          // take any traits from the set and make them look like traits exhibited by the group
          final LinkedHashSet<String> avoidSet = ctx2traitNames.get(raCtx);
          final ResolvedTraitSet rtsAtt = ra.fetchResolvedTraits();
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
          ((CdmEntityDefinition) container).getAttributes().add(attGrpRef);
          // isn't this where ...
          addAttributes(((ResolvedAttributeSet) ra.getTarget()), attGrp, attPath + "/members/", allAttCtx, ctx2traitNames, resOptCopy, resAtt2RefPath);
      } else {
        final CdmTypeAttributeDefinition att = this.getCtx().getCorpus().makeObject(CdmObjectType.TypeAttributeDef, ra.getResolvedName(), false);
        att.setAttributeContext(this.getCtx().getCorpus().makeObject(CdmObjectType.AttributeContextRef, raCtx != null ? raCtx.getAtCorpusPath() : null, true));

        final LinkedHashSet<String> avoidSet = ctx2traitNames.get(raCtx);
        final ResolvedTraitSet rtsAtt = ra.fetchResolvedTraits();
        rtsAtt.getSet().forEach(rt -> {
          if (rt.getTrait().getUgly() == null || !rt.getTrait().getUgly()) {
            // don't mention your ugly traits
            if (avoidSet == null || !avoidSet.contains(rt.getTraitName())) {
              // avoid the ones from the context
              final CdmTraitReference traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
              att.getAppliedTraits().add(traitRef);
            }
          }
        });


        // none of the dataformat traits have the bit set that will make them turn into a property
        // this is intentional so that the format traits make it into the resolved object
        // but, we still want a guess as the data format, so get it and set it.
        final String impliedDataFormat = att.fetchDataFormat();
        if (!StringUtils.isNullOrTrimEmpty(impliedDataFormat)) {
          att.updateDataFormat(impliedDataFormat);
        }

        if (container instanceof CdmEntityDefinition) {
          ((CdmEntityDefinition) container).getAttributes().add(att);
        } else if (container instanceof CdmAttributeGroupDefinition) {
          ((CdmAttributeGroupDefinition) container).getMembers().add(att);
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
            if (!Strings.isNullOrEmpty(attRef.getNamedReference()) && attRef.getNamedReference().indexOf('/') == -1) {
              if (arg.getUnResolvedValue() == null) {
                arg.setUnResolvedValue(arg.getValue());
              }

              // give a promise that can be worked out later. assumption is that the attribute must come from this entity.
              arg.setValue(this.getCtx().getCorpus().makeRef(CdmObjectType.AttributeRef,
                      entityHint + "/(resolvedAttributes)/" + attRef.getNamedReference(), true));
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
      traitsHere.forEach(tr -> replaceTraitAttRef(tr, entityHint, true));
    }
    subAttCtx.getContents().getAllItems().forEach(cr -> {
      if (cr.getObjectType() == CdmObjectType.AttributeContextDef) {
        // if this is a new entity context, get the name to pass along
        final CdmAttributeContext subSubAttCtx = (CdmAttributeContext) cr;
        String subEntityHint = entityHint;
        if (subSubAttCtx.getType() == CdmAttributeContextType.Entity) {
          subEntityHint = subSubAttCtx.getDefinition().getNamedReference();
        }
        // do this for all types
        fixContextTraits(subSubAttCtx, subEntityHint);
      }
    });
  }

  public ResolvedAttributeSet getAttributesWithTraits(final ResolveOptions resOpt, final Object queryFor) {
    try {
      return fetchResolvedAttributes(resOpt).fetchAttributesWithTraits(resOpt, queryFor);
    } catch (final IOException ex) {
      // TODO-BQ: What to do here, report it?
      LOGGER.error("Error occurred while trying to get attributes with traits. Reason: {}", ex.getLocalizedMessage());
      return null;
    }
  }

  public String getPrimaryKey() {
    return (String) this.t2pm.fetchPropertyValue(CdmPropertyName.PRIMARY_KEY);
  }

  public Object getProperty(final CdmPropertyName propertyName) {
    return this.t2pm.fetchPropertyValue(propertyName, true);
  }

  TraitToPropertyMap getTraitToPropertyMap() {
    return this.t2pm;
  }

  public CompletableFuture<List<?>> queryOnTraitsAsync(final Object querySpec) {
    return null;
  }

  @Deprecated
  public ResolvedEntity getResolvedEntity(final ResolveOptions resOpt) {
    return new ResolvedEntity(this, resOpt);
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";
    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      path = this.getDeclaredPath();
      if (Strings.isNullOrEmpty(path)) {
        path = pathFrom + this.getEntityName();
        this.setDeclaredPath(path);
      }
    }

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.getExtendsEntity() != null && this.getExtendsEntity()
            .visit(path + "/extendsEntity/", preChildren, postChildren)) {
      return true;
    }
    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }
    if (this.getAttributeContext() != null && this.getAttributeContext()
            .visit(path + "/attributeContext/", preChildren, postChildren)) {
      return true;
    }
    if (this.getAttributes() != null && this.attributes.visitList(path + "/hasAttributes/", preChildren, postChildren)) {
      return true;
    }
    return postChildren != null && postChildren.invoke(this, path);
  }

  @Override
  public boolean validate() {
    return !Strings.isNullOrEmpty(this.entityName);
  }

  @Override
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmEntityDefinition.class);
  }

  /**
   *
   * @param resOpt
   * @return
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this);
    }

    CdmEntityDefinition copy;
    if (host == null) {
      copy = new CdmEntityDefinition(this.getCtx(), this.getEntityName(), null);
    } else {
      copy = (CdmEntityDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setEntityName(this.getEntityName());
      copy.getAttributes().clear();
    }

    copy.setExtendsEntity(copy.getExtendsEntity() != null ? (CdmEntityReference) this.getExtendsEntity().copy(resOpt) : null);
    copy.setAttributeContext(copy.getAttributeContext() != null ? (CdmAttributeContext) this.getAttributeContext().copy(resOpt) : null);
    for (final CdmAttributeItem hasAttribute : this.getAttributes()) {
      copy.getAttributes().add(hasAttribute);
    }
    this.copyDef(resOpt, copy);
    return copy;
  }

  @Override
  public ResolvedEntityReferenceSet fetchResolvedEntityReferences(ResolveOptions resOpt) {
    final boolean wasPreviouslyResolving = this.getCtx().getCorpus().isCurrentlyResolving;
    this.getCtx().getCorpus().isCurrentlyResolving = true;
    if (resOpt == null) {
      resOpt = new ResolveOptions(this);
    }

    // this whole resolved entity ref goo will go away when resolved documents are done.
    // for now, it breaks if structured att sets get made.
    final Set<String> LinkedHashSet = new LinkedHashSet<>();
    LinkedHashSet.add("normalized");
    LinkedHashSet.add("referenceOnly");

    resOpt = CdmObjectBase.copyResolveOptions(resOpt);
    resOpt.setDirectives(new AttributeResolutionDirectiveSet(LinkedHashSet));

    final ResolveContext ctx = (ResolveContext) this.getCtx(); // what it actually is
    ResolvedEntityReferenceSet entRefSetCache = (ResolvedEntityReferenceSet) ctx
            .fetchCache(this, "entRefSet", resOpt);
    if (entRefSetCache == null) {
      entRefSetCache = new ResolvedEntityReferenceSet(resOpt);
      if (!resolvingEntityReferences) {
        resolvingEntityReferences = true;
        // get from dynamic base public class and then 'fix' those to point here instead.
        final CdmObjectReference extRef = this.extendsEntity;
        if (extRef != null) {
          CdmEntityDefinition extDef = extRef.fetchObjectDefinition(resOpt);
          if (extDef != null) {
            if (extDef == this) {
              extDef = extRef.fetchObjectDefinition(resOpt);
            }
            final ResolvedEntityReferenceSet inherited = extDef.fetchResolvedEntityReferences(resOpt);
            if (inherited != null) {
              for (final ResolvedEntityReference res : inherited.getSet()) {
                final ResolvedEntityReference resolvedEntityReference = res.copy();
                resolvedEntityReference.getReferencing().setEntity(this);
                entRefSetCache.getSet().add(resolvedEntityReference);
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
              entRefSetCache.add(sub);
            }
          }
        }
        ctx.updateCache(this, "entRefSet", entRefSetCache, resOpt);
        this.resolvingEntityReferences = false;
      }
    }

    this.getCtx().getCorpus().isCurrentlyResolving = wasPreviouslyResolving;
    return entRefSetCache;
  }
}