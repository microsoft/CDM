// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTrait;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.Errors;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class CdmAttributeContext extends CdmObjectDefinitionBase {

  private CdmAttributeContextType type;
  private CdmCollection<CdmObject> contents;
  private String name;
  private Integer lowestOrder;
  private CdmObjectReference parent;
  private CdmObjectReference definition;
  private String declaredPath;
  private String atCorpusPath;
  private CdmCollection<CdmAttributeContextReference> lineage;

  public CdmAttributeContext(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setObjectType(CdmObjectType.AttributeContextDef);
    this.name = name;

    // This will get overwritten when parent set.
    this.setAtCorpusPath(name);
    this.contents = new CdmCollection<>(this.getCtx(), this, this.getObjectType());
  }

  public final CdmAttributeContextType getType() {
    return this.type;
  }

  public final void setType(final CdmAttributeContextType value) {
    this.type = value;
  }

  /**
   *
   * @param resOpt Resolved options
   * @param acp Attribute context parameters
   * @return Cdm Attribute Context
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static CdmAttributeContext createChildUnder(final ResolveOptions resOpt,
                                                     final AttributeContextParameters acp) {
    if (acp == null) {
      return null;
    }

    if (acp.getType() == CdmAttributeContextType.PassThrough) {
      return acp.getUnder();
    }

    // this flag makes sure we hold on to any resolved object refs when things get copied
    final ResolveOptions resOptCopy = resOpt.copy();
    resOptCopy.setSaveResolutionsOnCopy(true);

    CdmObjectReference definition = null;
    ResolvedTraitSet rtsApplied = null;

    // get a simple reference to definition object to avoid getting the traits that might be part of this ref
    // included in the link to the definition.
    if (acp.getRegarding() != null) {
      // make a portable reference. this MUST be fixed up when the context node lands in the final document
      definition = ((CdmObjectBase)acp.getRegarding()).createPortableReference(resOptCopy);
      // now get the traits applied at this reference (applied only, not the ones that are part of the definition of the object)
      // and make them the traits for this context
      if (acp.isIncludeTraits()) {
        rtsApplied = acp.getRegarding().fetchResolvedTraits(resOptCopy);
      }
    }

    final CdmAttributeContext underChild = acp.getUnder().getCtx().getCorpus()
        .makeObject(CdmObjectType.AttributeContextDef, acp.getName());

    // need context to make this a 'live' object
    underChild.setCtx(acp.getUnder().getCtx());
    underChild.setInDocument(acp.getUnder().getInDocument());
    underChild.setType(acp.getType());
    underChild.setDefinition(definition);

    // add traits if there are any
    if (rtsApplied != null && rtsApplied.getSet() != null) {
      rtsApplied.getSet().forEach((ResolvedTrait rt) -> {
        final CdmTraitReference traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
        underChild.getExhibitsTraits().add(traitRef);
      });
    }

    // add to parent
    underChild.setParent(resOptCopy, acp.getUnder());
    if (resOptCopy.getMapOldCtxToNewCtx() != null) {
      resOptCopy.getMapOldCtxToNewCtx().put(underChild, underChild); // so we can find every node, not only the replaced ones
    }

    return underChild;
  }

  public CdmObject copyNode() {
    return copyNode(new ResolveOptions(this));
  }

  /**
   * Returns a copy of the current node.
   */
  CdmObject copyNode(final ResolveOptions resOpt) {
    // instead of copying the entire context tree, just the current node
    final CdmAttributeContext copy = new CdmAttributeContext(this.getCtx(), this.getName());
    copy.setType(this.type);
    copy.setInDocument(resOpt.getWrtDoc());
    if (this.getParent() != null) {
      copy.setParent(new CdmAttributeContextReference(this.getCtx(), null));
      copy.getParent().setExplicitReference(this.getParent().getExplicitReference()); // yes, just take the old pointer, will fix all later
    }
    if (this.getDefinition() != null) {
      copy.setDefinition((CdmObjectReference) this.getDefinition().copy(resOpt));
      copy.getDefinition().setOwner(this.getDefinition().getOwner());
    }
    // make space for content, but no copy, done by caller
    copy.setContents(new CdmCollection<>(this.getCtx(), copy, CdmObjectType.AttributeRef));
    if (this.getLineage() != null) {
      this.getLineage().forEach(lin -> copy.addLineage(lin.getExplicitReference(), false)); // use explicitref to cause new ref to be allocated
    }
    this.copyDef(resOpt, copy);
    if (resOpt.getMapOldCtxToNewCtx() != null) {
      resOpt.getMapOldCtxToNewCtx().put(copy, copy);  // so we can find every node, not only the replaced ones
    }
    return copy;
  }

  CdmAttributeContext copyAttributeContextTree(
      final ResolveOptions resOpt,
      final CdmAttributeContext newNode) {

    // remember which node in the new tree replaces which node in the old tree
    // the caller MUST use this to replace the explicit references held in the lineage and parent reference objects
    // and to change the context node that any associated resolved attributes will be pointing at
    resOpt.getMapOldCtxToNewCtx().put(this, newNode); // so we can see the replacement for a copied node

    // now copy the children
    for (final CdmObject child : this.contents) {

      if (child instanceof CdmAttributeContext) {
        final CdmAttributeContext childAsAttributeContext = (CdmAttributeContext)child;
        final CdmAttributeContext newChild = (CdmAttributeContext)childAsAttributeContext.copyNode(resOpt);
        newNode.getContents().allItems.add(newChild); // need to NOT trigger the collection fix up and parent code
        childAsAttributeContext.copyAttributeContextTree(resOpt, newChild);
      }
    }
    return newNode;
  }

  public final CdmObjectReference getParent() {
    return this.parent;
  }

  public final void setParent(final CdmObjectReference value) {
    this.parent = value;
  }

  public final CdmObjectReference getDefinition() {
    return this.definition;
  }

  public final void setDefinition(final CdmObjectReference value) {
    this.definition = value;
  }

  public final CdmCollection<CdmObject> getContents() {
    return this.contents;
  }

  public void setContents(final CdmCollection<CdmObject> value) {
    this.contents = value;
  }

  public final String getName() {
    return this.name;
  }

  public final void setName(final String value) {
    this.name = value;
  }

  final Integer getLowestOrder() {
    return this.lowestOrder;
  }

  final void setLowestOrder(final Integer value) {
    this.lowestOrder = value;
  }

  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  public final CdmCollection<CdmAttributeContextReference> getLineage() {
    return this.lineage;
  }

  public void setLineage(final CdmCollection<CdmAttributeContextReference> value) {
    this.lineage = value;
  }

  /**
   * Clears any existing lineage and sets it to the provided context reference (or a reference to the context object
   * is one is given instead)
   * @param objLineage CdmObject lineage
   * @return CdmAttribute Context Reference
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmAttributeContextReference setLineage(final CdmObject objLineage) {
    this.setLineage(new CdmCollection<CdmAttributeContextReference>(this.getCtx(), this, CdmObjectType.AttributeContextRef));
    return this.addLineage(objLineage);
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";

    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      path = this.declaredPath;

      if (StringUtils.isNullOrTrimEmpty(path)) {
        path = pathFrom + this.getName();
        this.declaredPath = path;
      }
    }

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.getParent() != null && this.getParent()
        .visit(path + "/parent/", preChildren, postChildren)) {
      return true;
    }
    if (this.getDefinition() != null && this.getDefinition()
        .visit(path + "/definition/", preChildren, postChildren)) {
      return true;
    }
    if (this.getContents() != null && CdmObjectBase
        .visitList(this.getContents(), path + "/", preChildren, postChildren)) { // fix that as any.
      return true;
    }
    if (this.getLineage() != null && CdmObjectBase
            .visitList(this.getLineage(), path + "/lineage/", preChildren, postChildren)) { // fix that as any.
      return true;
    }
    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }
    return postChildren != null && postChildren.invoke(this, path);
  }

  @Override
  public boolean validate() {
    ArrayList<String> missingFields = new ArrayList<String>();
    if (StringUtils.isNullOrTrimEmpty(this.name)) {
      missingFields.add("name");
    }
    if (this.type == null) {
      missingFields.add("type");
    }

    if (missingFields.size() > 0) {
      Logger.error(CdmAttributeContext.class.getSimpleName(), this.getCtx(), Errors.validateErrorString(this.getAtCorpusPath(), missingFields));
      return false;
    }
    return true;
  }

  @Override
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmAttributeContext.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmAttributeContext copy;
    if (host == null) {
      copy = (CdmAttributeContext) this.copyNode(resOpt);
    } else {
      copy = (CdmAttributeContext) host;
      copy.setCtx(this.getCtx());
      copy.setName(this.getName());
      copy.getContents().clear();
    }

    if (this.getParent() != null) {
      copy.setParent((CdmObjectReference) this.getParent().copy(resOpt));
    }

    if (this.contents != null && this.contents.size() > 0) {
      for (final CdmObject child : this.contents) {
        copy.getContents().add(child.copy(resOpt));
      }
    }

    if (this.lineage != null && this.lineage.size() > 0) {
      // trying to not allocate lineage collection unless needed
      for (final CdmAttributeContextReference child : this.lineage) {
        copy.addLineage(child.getExplicitReference().copy(resOpt));
      }
    }

    return copy;
  }

  void setRelativePath(String rp) {
    this.declaredPath = rp;
  }

  private void setParent(ResolveOptions resOpt, CdmAttributeContext parent) {
    // will need a working reference to this as the parent
    final CdmObjectReferenceBase parentRef = getCtx().getCorpus()
        .makeObject(CdmObjectType.AttributeContextRef, parent.getAtCorpusPath(), true);

    if (this.getName() != null) {
      this.setAtCorpusPath(parent.getAtCorpusPath() + "/" + this.getName());
    }

    parentRef.setExplicitReference(parent);
    // Setting this will let the 'localize references' code trace from any document back to where the parent is defined.
    parentRef.setInDocument(parent.getInDocument());
    parent.getContents().add(this);
    this.setParent(parentRef);
  }

  @Deprecated
  public CdmAttributeContextReference addLineage(CdmObject objLineage) {
    return addLineage(objLineage, true);
  }

  /**
   * Add to the lineage array the provided context reference (or a reference to the context object is one is given instead)
   * @param objLineage CdmObject
   * @param validate boolean
   * @return CdmAttribute Context Reference
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmAttributeContextReference addLineage(CdmObject objLineage, final boolean validate) {
    // sort out which is the ref and which is the object.
    // attCtxRef object are special in that they don't support an inline definition but they do hold a pointer to the
    // actual context object in the explicit reference member
    CdmAttributeContextReference refLineage;
    if (objLineage.getObjectType() == CdmObjectType.AttributeContextRef) {
      refLineage = (CdmAttributeContextReference) objLineage;
      objLineage = refLineage.getExplicitReference();
    } else if (objLineage.getObjectType() == CdmObjectType.AttributeContextDef) {
      final CdmAttributeContext acLin = (CdmAttributeContext)objLineage;
      refLineage = this.getCtx().getCorpus().makeObject(CdmObjectType.AttributeContextRef, acLin.getAtCorpusPath(), true);
      refLineage.setExplicitReference(acLin);
    } else {
      // programming error
      return null;
    }
    if (this.getLineage() == null) {
      // not allocated by default
      this.setLineage(new CdmCollection<CdmAttributeContextReference>(this.getCtx(), this, CdmObjectType.AttributeContextRef));
    }
    if (refLineage.getExplicitReference().getId() == this.getId()) {
      // why do that?
      return null;
    }
    this.getLineage().add(refLineage);

    // debugging. get the parent of the context tree and validate that this node is in that tree
    // if (validate == true)
    // {
    //     CdmAttributeContext trace = (CdmAttributeContext) refLineage.getExplicitReference();
    //     while (trace.Parent != null)
    //         trace = (CdmAttributeContext) trace.getParent().getExplicitReference();
    //     trace.validateLineage(null);
    // }

    return refLineage;
  }

  public static ResolveOptions prepareOptionsForResolveAttributes(final ResolveOptions resOptSource) {
    ResolveOptions resOptCopy = resOptSource.copy();
    // use this whenever we need to keep references pointing at things that were already found. used when 'fixing' references by localizing to a new document
    resOptCopy.setSaveResolutionsOnCopy(true);
    // for debugging help
    // if (resOptCopy.getMapOldCtxToNewCtx() != null)
    // {
    //     return null;
    // }
    resOptCopy.setMapOldCtxToNewCtx(new HashMap<>());
    return resOptCopy;
  }

  /**
   * @param resOpt ResolveOptions
   * @param ctx CdmCorpusContext
   * @param acpUsed AttributeContextParameters
   * @return Cdm Attribute Context
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static CdmAttributeContext getUnderContextForCacheContext(final ResolveOptions resOpt, final CdmCorpusContext ctx, final AttributeContextParameters acpUsed) {
    // a new context node is needed for these attributes,
    // this tree will go into the cache, so we hang it off a placeholder parent
    // when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
    // put into the 'receiving' tree
    if (acpUsed != null) {
      final AttributeContextParameters acpCache = acpUsed.copy();
      CdmAttributeContext parentCtxForCache = new CdmAttributeContext(ctx, "cacheHolder");
      parentCtxForCache.setType(CdmAttributeContextType.PassThrough);
      acpCache.setUnder(parentCtxForCache);
      return CdmAttributeContext.createChildUnder(resOpt, acpCache);
    }
    return null;
  }

  /**
   * @param resOpt ResolveOptions
   * @param acpUsed AttributeContextParameters
   * @return Cdm Attribute Context
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmAttributeContext getUnderContextFromCacheContext(final ResolveOptions resOpt, final AttributeContextParameters acpUsed)
  {
    // tree is found in cache, need a replacement tree node to put the sub-tree into. this replacement
    // needs to be build from the acp of the destination tree
    if (acpUsed != null)
    {
      return CdmAttributeContext.createChildUnder(resOpt, acpUsed);
    }
    return null;
  }


  /**
   * @param resOpt ResolveOptions
   * @param ras ResolvedAttributeSet
   * @return boolean
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public  boolean associateTreeCopyWithAttributes(final ResolveOptions resOpt, final ResolvedAttributeSet ras) {
    // deep copy the tree. while doing this also collect a map from old attCtx to new equivalent
    // this is where the returned tree fits in
    final CdmAttributeContext cachedCtx = ras.getAttributeContext();
    if (cachedCtx.copyAttributeContextTree(resOpt, this) == null) {
      return false;
    }
    ras.setAttributeContext(this);

    // run over the resolved attributes in the copy and use the map to swap the old ctx for the new version
    fixResolveAttributeCtx(ras, resOpt);

    // now fix any lineage references
    fixAttCtxNodeLineage(this, null, resOpt);

    return true;
  }

  /**
   * @param resOpt ResolveOptions
   * @param pathStart String
   * @param docHome CdmDocumentDefinition
   * @param docFrom CdmDocumentDefinition
   * @param monikerForDocFrom String
   * @return boolean 
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public boolean finalizeAttributeContext(final ResolveOptions resOpt, final String pathStart, final CdmDocumentDefinition docHome, final CdmDocumentDefinition docFrom, String monikerForDocFrom) {
    return this.finalizeAttributeContext(resOpt, pathStart, docFrom, docHome, monikerForDocFrom,false);
  }

  /**
   * @param resOpt ResolveOptions
   * @param pathStart String
   * @param docHome CdmDocumentDefinition
   * @param docFrom CdmDocumentDefinition
   * @param monikerForDocFrom String
   * @param finished boolean
   * @return boolean 
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public boolean finalizeAttributeContext(final ResolveOptions resOpt, final String pathStart, final CdmDocumentDefinition docHome, final CdmDocumentDefinition docFrom, String monikerForDocFrom, final boolean finished) {
    // run over the attCtx tree again and 'fix it' fix means replace the parent and lineage reference path strings with
    // final values from new home and set the inDocument and fix any references to definitions

    // keep track of the paths to documents for fixing symbol refs. expensive to compute
    HashMap<CdmDocumentDefinition, String> foundDocPaths = new LinkedHashMap<>();

    if (!StringUtils.isNullOrTrimEmpty(monikerForDocFrom)) {
      monikerForDocFrom = String.format("%s/", monikerForDocFrom);
    }

    // first step makes sure every node in the tree has a good path for itself and a good document
    // second pass uses the paths from nodes to fix references to other nodes
    fixAttCtxNodePaths(this, pathStart, docHome, docFrom, foundDocPaths, resOpt, monikerForDocFrom);

    // now fix any lineage and parent references
    fixAndFinalizeAttCtxNodeLineage(this);

    if (finished) {
      resOpt.setSaveResolutionsOnCopy(false);
      resOpt.setMapOldCtxToNewCtx(null);
    }

    return true;
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
    return null;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // Intended to return null.
    return;
  }

  /**
   * For attribute context we don't follow standard path calculation behavior.
   * @return The atCorpusPath.
   */
  @Override
  public String getAtCorpusPath() {
    return atCorpusPath;
  }

  /**
   * For attribute context we don't follow standard path calculation behavior.
   * @param atCorpusPath The atCorpusPath.
   */
  public void setAtCorpusPath(String atCorpusPath) {
    this.atCorpusPath = atCorpusPath;
  }

  private void fixResolveAttributeCtx(final ResolvedAttributeSet rasSub, ResolveOptions resOpt) {
    for (final ResolvedAttribute ra : rasSub.getSet()) {
      ra.setAttCtx(resOpt.getMapOldCtxToNewCtx().get(ra.getAttCtx()));
      // the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
      if (ra.getTarget() instanceof ResolvedAttributeSet) {
        ((ResolvedAttributeSet) ra.getTarget()).setAttributeContext(ra.getAttCtx());
        fixResolveAttributeCtx((ResolvedAttributeSet)ra.getTarget(), resOpt);
      }
    }
  }

  private void fixAttCtxNodeLineage(final CdmAttributeContext ac, final CdmAttributeContext acParent, final ResolveOptions resOpt) {
    if (ac == null) {
      return;
    }
    if (acParent != null && ac.getParent() != null && ac.getParent().getExplicitReference() != null) {
      ac.getParent().setExplicitReference(acParent);
    }
    if (ac.getLineage() != null && ac.getLineage().size() > 0) {
      // fix lineage
      ac.getLineage().forEach((final CdmAttributeContextReference lin) -> {
        if (lin.getExplicitReference() != null) {
          // swap the actual object for the one in the new tree
          lin.setExplicitReference(resOpt.getMapOldCtxToNewCtx().get((CdmAttributeContext)lin.getExplicitReference()));
        }
      });
    }

    if (ac.getContents() == null || ac.getContents().isEmpty()) return;
    // look at all children
    for (final CdmObject subSub : ac.getContents()) {
      fixAttCtxNodeLineage((CdmAttributeContext)subSub, ac, resOpt);
    }
  }

  private void fixAttCtxNodePaths(
          final CdmObject subItem,
          final String pathFrom,
          final CdmDocumentDefinition docHome,
          final CdmDocumentDefinition docFrom,
          final HashMap<CdmDocumentDefinition, String> foundDocPaths,
          final ResolveOptions resOpt,
          final String monikerForDocFrom) {
    CdmAttributeContext ac = (CdmAttributeContext)subItem;
    if (ac == null) {
      return;
    }
    ac.setInDocument(docHome);

    // fix up the reference to definition. need to get path from this document to the
    // add moniker if this is a reference
    if (ac.getDefinition() != null) {
      ac.getDefinition().setInDocument(docHome);
      if (ac.getDefinition().getNamedReference() != null) {
        // need the real path to this thing from the explicitRef held in the portable reference
        // the real path is {monikerFrom/}{path from 'from' document to document holding the explicit ref/{declaredPath of explicitRef}}
        // if we have never looked up the path between docs, do that now
        CdmDocumentDefinition docFromDef = ac.getDefinition().getExplicitReference().getInDocument(); // if all parts not set, this is a broken portal ref!
        String pathBetweenDocs = pathBetweenDocs = foundDocPaths.get(docFromDef);
        if (pathBetweenDocs == null) {
          pathBetweenDocs = docFrom.importPathToDoc(docFromDef);
          if (pathBetweenDocs == null)
          {
            // hmm. hmm.
            pathBetweenDocs = "";
          }
          foundDocPaths.put(docFrom, pathBetweenDocs);
        }

        ((CdmObjectReferenceBase)ac.getDefinition()).localizePortableReference(resOpt, String.format("%s%s",  monikerForDocFrom, pathBetweenDocs));
      }
    }
    // doc of parent ref
    if (ac.getParent() != null) {
      ac.getParent().setInDocument(docHome);
    }
    // doc of lineage refs
    if (ac.getLineage() != null && ac.getLineage().size() > 0) {
      ac.getLineage().forEach((final CdmAttributeContextReference lin) -> lin.setInDocument(docHome));
    }

    String divider = (StringUtils.isNullOrEmpty(ac.getAtCorpusPath()) || !pathFrom.endsWith("/")) ? "/" : "";
    ac.setAtCorpusPath(String.format("%s%s%s", pathFrom, divider, ac.getName()));

    if (ac.getContents() == null || ac.getContents().size() == 0) {
      return;
    }
    // look at all children
    for (final CdmObject subSub : ac.getContents()) {
      if (subSub.getObjectType() == CdmObjectType.AttributeContextDef) {
        fixAttCtxNodePaths(subSub, ac.getAtCorpusPath(), docHome, docFrom, foundDocPaths, resOpt, monikerForDocFrom);
      }
    }
  }

  private void fixAndFinalizeAttCtxNodeLineage(final CdmObject subItem) {
    CdmAttributeContext ac = (CdmAttributeContext)subItem;
    if (ac == null) {
      return;
    }
    // for debugLineage, write id
    //ac.Name = $"{ac.Name}({ac.Id})";

    // parent ref
    if (ac.getParent() != null && ac.getParent().getExplicitReference() != null) {
      ac.getParent().setNamedReference(((CdmAttributeContext) ac.getParent().getExplicitReference()).getAtCorpusPath());
      // for debugLineage, write id
      //ac.Parent.NamedReference = $"{ (ac.Parent.ExplicitReference as CdmAttributeContext).AtCoprusPath}({ac.Parent.ExplicitReference.Id})";
    }

    // fix lineage
    if (ac.getLineage() != null && ac.getLineage().size() > 0) {
      for (final CdmAttributeContextReference lin : ac.getLineage()) {
        if (lin.getExplicitReference() != null) {
          // use the new path as the ref
          lin.setNamedReference(((CdmAttributeContext)lin.getExplicitReference()).getAtCorpusPath());
          // for debugLineage, write id
          //lin.NamedReference = $"{ (lin.ExplicitReference as CdmAttributeContext).AtCoprusPath}({lin.ExplicitReference.Id})";
        }
      }
    }

    if (ac.getContents() == null || ac.getContents().size() == 0) {
      return;
    }
    // look at all children
    for (final CdmObject subSub : ac.getContents()) {
        fixAndFinalizeAttCtxNodeLineage(subSub);
    }
  }

  @Deprecated
  public Boolean validateLineage(ResolveOptions resOpt)
  {
    // run over the attCtx tree and validate that it is self consistent on lineage

    // collect all nodes in the tree
    HashSet<CdmAttributeContext> attCtxInTree = new HashSet<>();
    collectAllNodes(this, attCtxInTree);

    // now make sure every lineage ref is in that set
    CheckLineage(this, attCtxInTree);

    return true;
  }

  private void collectAllNodes(CdmObject subItem, HashSet<CdmAttributeContext> attCtxInTree) {
    CdmAttributeContext ac = (CdmAttributeContext)subItem;
    if (ac == null) {
      return;
    }
    attCtxInTree.add(ac);
    if (ac.getContents() == null || ac.getContents().size() == 0) {
      return;
    }
    // look at all children
    ac.getContents().forEach((final CdmObject subSub) -> {
      if (subSub.getObjectType() == CdmObjectType.AttributeContextDef) {
        collectAllNodes(subSub, attCtxInTree);
      }
    });
  }

  private boolean CheckLineage(final CdmObject subItem, HashSet<CdmAttributeContext> attCtxInTree) {
    CdmAttributeContext ac = (CdmAttributeContext) subItem;
    if (ac == null) {
      return true;
    }

    if (ac.getLineage() != null && ac.getLineage().size() > 0) {
      for (final CdmAttributeContextReference lin: ac.getLineage()) {
        if (!attCtxInTree.contains(lin.getExplicitReference())) {
          return false;
        }
        //if (!resOpt.getMapOldCtxToNewCtx().containsKey((CdmAttributeContext)lin.getExplicitReference()))
        //{
        //return false;
        //}
      }
    }

    if (ac.getContents() == null || ac.getContents().size() == 0) {
      return true;
    }
    // look at all children
    for(final CdmObject subSub : ac.getContents()) {
      if (subSub.getObjectType() == CdmObjectType.AttributeContextDef) {
        if (!CheckLineage(subSub, attCtxInTree)) {
          return false;
        }
      }
    }
    return true;
  }
}
