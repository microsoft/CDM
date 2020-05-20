// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
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
import java.util.LinkedHashSet;

public class CdmAttributeContext extends CdmObjectDefinitionBase {

  private CdmAttributeContextType type;
  private CdmCollection<CdmObject> contents;
  private String name;
  private Integer lowestOrder;
  private CdmObjectReference parent;
  private CdmObjectReference definition;
  private String declaredPath;
  private String atCorpusPath;

  public CdmAttributeContext(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setObjectType(CdmObjectType.AttributeContextDef);
    this.name = name;

    // This will get overwritten when parent set.
    this.setAtCorpusPath(name);
    this.contents = new CdmCollection<>(this.getCtx(), this.getOwner(), this.getObjectType());
  }

  public final CdmAttributeContextType getType() {
    return this.type;
  }

  public final void setType(final CdmAttributeContextType value) {
    this.type = value;
  }

  /**
   *
   * @param resOpt
   * @param acp
   * @return
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
      definition = acp.getRegarding().createSimpleReference(resOptCopy);
      definition.setInDocument(acp.getUnder().getInDocument()); // Ref is in the same doc as context.

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
    if (this.getDefinition() != null) {
      copy.setDefinition((CdmObjectReference) this.getDefinition().copy(resOpt));
    }

    copy.setContents(new CdmCollection<>(this.getCtx(), copy, CdmObjectType.AttributeRef));

    this.copyDef(resOpt, copy);
    return copy;
  }

  CdmAttributeContext copyAttributeContextTree(
      final ResolveOptions resOpt,
      final CdmAttributeContext newNode,
      final ResolvedAttributeSet ras) {
    return copyAttributeContextTree(resOpt, newNode, ras, null);
  }

  CdmAttributeContext copyAttributeContextTree(
      final ResolveOptions resOpt,
      final CdmAttributeContext newNode,
      final ResolvedAttributeSet ras,
      final LinkedHashSet<CdmAttributeContext> attCtxSet) {
    return copyAttributeContextTree(resOpt, newNode, ras, attCtxSet, null);
  }

  CdmAttributeContext copyAttributeContextTree(
      final ResolveOptions resOpt,
      final CdmAttributeContext newNode,
      final ResolvedAttributeSet ras,
      final LinkedHashSet<CdmAttributeContext> attCtxSet,
      final String moniker) {
    final ResolvedAttribute ra = ras.getAttCtx2ra().get(this);
    if (ra != null) {
      ras.cacheAttributeContext(newNode, ra);
    }

    // add context to set
    if (attCtxSet != null) {
      attCtxSet.add(newNode);
    }

    // Add moniker if this is a reference.
    if (!StringUtils.isNullOrTrimEmpty(moniker)
        && newNode.getDefinition() != null
        && newNode.getDefinition().getNamedReference() != null) {
      newNode
          .getDefinition()
          .setNamedReference(moniker + "/" + newNode.getDefinition().getNamedReference());
    }

    // now copy the children
    for (final CdmObject child : this.contents) {
      CdmAttributeContext newChild = null;
      if (child instanceof CdmAttributeContext) {
        final CdmAttributeContext childAsAttributeContext = (CdmAttributeContext) child;
        newChild = (CdmAttributeContext) childAsAttributeContext
            .copyNode(resOpt);
        if (newNode != null) {
          newChild.setParent(resOpt, newNode);
        }
        ResolvedAttributeSet currentRas = ras;
        if (ra != null && ra.getTarget() instanceof ResolvedAttributeSet) {
          currentRas = (ResolvedAttributeSet) ra.getTarget();
        }

        childAsAttributeContext
            .copyAttributeContextTree(resOpt, newChild, currentRas, attCtxSet, moniker);
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
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    return false;
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
        .visitList(this.getContents(), path + "/", preChildren, postChildren)) {
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
      if (parent.getAtCorpusPath().endsWith("/") || this.getName().startsWith("/")) {
        this.setAtCorpusPath(parent.getAtCorpusPath() + this.getName());
      } else {
        this.setAtCorpusPath(parent.getAtCorpusPath() + "/" + this.getName());
      }
    }

    parentRef.setExplicitReference(parent);
    // Setting this will let the 'localize references' code trace from any document
    // back to where the parent is defined.
    parentRef.setInDocument(parent.getInDocument());
    final CdmCollection<CdmObject> parentContents = parent.getContents();
    parentContents.add(this);
    this.setParent(parentRef);
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, final CdmAttributeContext under) {
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
}
