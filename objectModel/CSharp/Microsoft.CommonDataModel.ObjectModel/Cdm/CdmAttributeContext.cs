// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;

    public class CdmAttributeContext : CdmObjectDefinitionBase
    {
        /// <summary>
        /// Gets or sets the attribute context type.
        /// </summary>
        public CdmAttributeContextType? Type { get; set; }

        /// <summary>
        /// Gets or sets the attribute context name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the attribute context's parent.
        /// </summary>
        public CdmObjectReference Parent { get; set; }

        /// <summary>
        /// Gets or sets a reference to the object from which this attribute context was defined.
        /// </summary>
        public CdmObjectReference Definition { get; set; }

        /// <summary>
        /// Gets or sets the attribute context's content list.
        /// </summary>
        public CdmCollection<CdmObject> Contents { get; set; }

        /// <summary>
        /// Gets or sets the attribute context's parent.
        /// </summary>
        public CdmCollection<CdmAttributeContextReference> Lineage { get; set; }

        /// <summary>
        /// For attribute context we don't follow standard path calculation behavior.
        /// </summary>
        public new string AtCorpusPath { get; set; }

        internal int? LowestOrder { get; set; }

        /// <summary>
        /// Constructs a CdmAttributeContext. 
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The attribute context name.</param>
        public CdmAttributeContext(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.AttributeContextDef;
            this.Name = name;
            // this will get overwritten when parent set
            this.AtCorpusPath = name;
            this.Contents = new CdmCollection<CdmObject>(ctx, this, CdmObjectType.AttributeRef);
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.AttributeContextDef;
        }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.Name;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            return false;
        }

        /// <summary>
        /// Returns a copy of the current node. If refMoniker is set, definition refs will get a moniker added.
        /// </summary>
        public CdmObject CopyNode(ResolveOptions resOpt)
        {
            // instead of copying the entire context tree, just the current node
            CdmAttributeContext copy = new CdmAttributeContext(this.Ctx, this.Name)
            {
                Type = this.Type,
                InDocument = resOpt.WrtDoc as CdmDocumentDefinition
            };
            if (this.Parent != null)
            {
                copy.Parent = new CdmAttributeContextReference(this.Ctx, null);
                copy.Parent.ExplicitReference = this.Parent.ExplicitReference; // yes, just take the old pointer, will fix all later
            }
            if (this.Definition != null)
            {
                copy.Definition = (CdmObjectReference)this.Definition.Copy(resOpt);
                copy.Definition.Owner = this.Definition.Owner;
            }
            // make space for content, but no copy, done by caller
            copy.Contents = new CdmCollection<CdmObject>(this.Ctx, copy, CdmObjectType.AttributeRef);

            if (this.Lineage != null)
            {
                foreach(var lin in this.Lineage)
                {
                    copy.AddLineage(lin.ExplicitReference, false); // use explicitref to cause new ref to be allocated
                }
            }
            this.CopyDef(resOpt, copy);

            if (resOpt.MapOldCtxToNewCtx != null)
            {
                resOpt.MapOldCtxToNewCtx[copy] = copy; // so we can find every node, not only the replaced ones
            }

            return copy;
        }

        internal CdmAttributeContext CopyAttributeContextTree(ResolveOptions resOpt, CdmAttributeContext newNode)
        {
            // remember which node in the new tree replaces which node in the old tree
            // the caller MUST use this to replace the explicit references held in the lineage and parent reference objects
            // and to change the context node that any associated resolved attributes will be pointing at
            resOpt.MapOldCtxToNewCtx[this] = newNode; // so we can see the replacement for a copied node

            // now copy the children
            foreach (CdmObject child in this.Contents)
            {
                if (child is CdmAttributeContext childAsAttributeContext)
                {
                    CdmAttributeContext newChild = childAsAttributeContext.CopyNode(resOpt) as CdmAttributeContext;
                    newNode.Contents.AllItems.Add(newChild); // need to NOT trigger the collection fix up and parent code
                    childAsAttributeContext.CopyAttributeContextTree(resOpt, newChild);
                }
            }
            return newNode;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmAttributeContext copy;
            if (host == null)
            {
                copy = (CdmAttributeContext)this.CopyNode(resOpt);
            }
            else
            {
                copy = host as CdmAttributeContext;
                copy.Ctx = this.Ctx;
                copy.Name = this.GetName();
                copy.Contents.Clear();
            }

            if (this.Parent != null)
                copy.Parent = (CdmObjectReference)this.Parent.Copy(resOpt);

            if (this.Contents?.Count > 0)
            {
                foreach (dynamic child in this.Contents)
                {
                    copy.Contents.Add(child.Copy(resOpt));
                }
            }

            if (this.Lineage?.Count > 0)
            {
                // trying to not allocate lineage collection unless needed
                foreach (CdmAttributeContextReference child in this.Lineage)
                {
                    copy.AddLineage(child.ExplicitReference.Copy(resOpt));
                }
            }

            return copy;
        }

        [Obsolete("InstanceFromData is deprecated. Please use the Persistence Layer instead.")]
        public static CdmAttributeContext InstanceFromData(CdmCorpusContext ctx, dynamic obj)
        {
            return CdmObjectBase.InstanceFromData<CdmAttributeContext, dynamic>(ctx, obj);
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();
            if (string.IsNullOrWhiteSpace(this.Name))
                missingFields.Add("Name");
            if (this.Type == null)
                missingFields.Add("Type");

            if (missingFields.Count > 0)
            {
                Logger.Error(nameof(CdmAttributeContext), this.Ctx, Errors.ValidateErrorString(this.AtCorpusPath, missingFields), nameof(Validate));
                return false;
            }
            return true;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmAttributeContext>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                path = this.DeclaredPath;
                if (string.IsNullOrEmpty(path))
                {
                    path = pathFrom + this.Name;
                    this.DeclaredPath = path;
                }
            }

            if (preChildren?.Invoke(this, path) == true)
                return false;
            if (this.Parent?.Visit(path + "/parent/", preChildren, postChildren) == true)
                return true;
            if (this.Definition?.Visit(path + "/definition/", preChildren, postChildren) == true)
                return true;
            if (this.Contents != null && CdmObjectBase.VisitList(this.Contents, path + "/", preChildren, postChildren)) // fix that as any. 
                return true;

            if (this.Lineage != null && CdmObjectBase.VisitList(this.Lineage, path + "/lineage/", preChildren, postChildren)) // fix that as any. 
                return true;

            if (this.VisitDef(path, preChildren, postChildren))
                return true;
            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        internal void SetRelativePath(string rp)
        {
            this.DeclaredPath = rp;
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            return;
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            return null;
        }

        internal static CdmAttributeContext CreateChildUnder(ResolveOptions resOpt, AttributeContextParameters acp)
        {
            if (acp == null)
                return null;

            if (acp.type == CdmAttributeContextType.PassThrough)
                return acp.under as CdmAttributeContext;

            // this flag makes sure we hold on to any resolved object refs when things get copied
            ResolveOptions resOptCopy = resOpt.Copy();
            resOptCopy.SaveResolutionsOnCopy = true;

            CdmObjectReference definition = null;
            ResolvedTraitSet rtsApplied = null;
            // get a simple reference to definition object to avoid getting the traits that might be part of this ref
            // included in the link to the definition.
            if (acp.Regarding != null)
            {
                // make a portable reference. this MUST be fixed up when the context node lands in the final document
                definition = (acp.Regarding as CdmObjectBase).CreatePortableReference(resOptCopy);
                // now get the traits applied at this reference (applied only, not the ones that are part of the definition of the object)
                // and make them the traits for this context
                if (acp.IncludeTraits)
                    rtsApplied = (acp.Regarding as CdmObjectBase).FetchResolvedTraits(resOptCopy);
            }

            CdmAttributeContext underChild = acp.under.Ctx.Corpus.MakeObject<CdmAttributeContext>(CdmObjectType.AttributeContextDef, acp.Name);
            // need context to make this a 'live' object
            underChild.Ctx = acp.under.Ctx;
            underChild.InDocument = (acp.under as CdmAttributeContext).InDocument;
            underChild.Type = acp.type;
            underChild.Definition = definition;
            // add traits if there are any
            if (rtsApplied?.Set != null)
            {
                rtsApplied.Set.ForEach(rt =>
                {
                    var traitRef = CdmObjectBase.ResolvedTraitToTraitRef(resOptCopy, rt);
                    underChild.ExhibitsTraits.Add(traitRef);
                });
            }

            // add to parent
            underChild.SetParent(resOptCopy, acp.under as CdmAttributeContext);

            if (resOptCopy.MapOldCtxToNewCtx != null)
            {
                resOptCopy.MapOldCtxToNewCtx[underChild] = underChild; // so we can find every node, not only the replaced ones
            }

            return underChild;
        }

        internal void SetParent(ResolveOptions resOpt, CdmAttributeContext parent)
        {
            // will need a working reference to this as the parent
            CdmObjectReferenceBase parentRef = this.Ctx.Corpus.MakeObject<CdmObjectReferenceBase>(CdmObjectType.AttributeContextRef, parent.AtCorpusPath, true);
            if (this.Name != null)
            {
                this.AtCorpusPath = parent.AtCorpusPath + "/" + this.Name;
            }
            parentRef.ExplicitReference = parent;
            // setting this will let the 'localize references' code trace from any document back to where the parent is defined
            parentRef.InDocument = parent.InDocument;
            CdmCollection<CdmObject> parentContents = parent.Contents;
            parentContents.Add(this);
            this.Parent = parentRef;
        }

        /// <summary>
        /// clears any existing lineage and sets it to the provided context reference (or a reference to the context object is one is given instead)
        /// </summary>
        /// <param name="objLineage"></param>
        internal CdmAttributeContextReference SetLineage(CdmObject objLineage)
        {
            this.Lineage = new CdmCollection<CdmAttributeContextReference>(this.Ctx, this, CdmObjectType.AttributeContextRef);
            return this.AddLineage(objLineage);
        }

        /// <summary>
        /// add to the lineage array the provided context reference (or a reference to the context object is one is given instead)
        /// </summary>
        /// <param name="objLineage"></param>
        internal CdmAttributeContextReference AddLineage(CdmObject objLineage, bool validate = true)
        {
            // sort out which is the ref and which is the object.
            // attCtxRef object are special in that they don't support an inline definition but they do hold a pointer to the
            // actual context object in the explicit reference member
            CdmAttributeContextReference refLineage;
            if (objLineage.ObjectType == CdmObjectType.AttributeContextRef)
            {
                refLineage = objLineage as CdmAttributeContextReference;
                objLineage = refLineage.ExplicitReference;
            }
            else if (objLineage.ObjectType == CdmObjectType.AttributeContextDef)
            {
                var acLin = objLineage as CdmAttributeContext;
                refLineage = this.Ctx.Corpus.MakeObject<CdmAttributeContextReference>(CdmObjectType.AttributeContextRef, acLin.AtCorpusPath, true);
                refLineage.ExplicitReference = acLin;
            }
            else
            {
                // programming error
                return null;
            }
            if (this.Lineage == null)
            {
                // not allocated by default
                this.Lineage = new CdmCollection<CdmAttributeContextReference>(this.Ctx, this, CdmObjectType.AttributeContextRef);
            }
            if (refLineage.ExplicitReference.Id == this.Id)
            {
                // why do that?
                return null;
            }
            this.Lineage.Add(refLineage);

            // debugging. get the parent of the context tree and validate that this node is in that tree
            // if (validate == true)
            // {
            //     CdmAttributeContext trace = refLineage.ExplicitReference as CdmAttributeContext;
            //     while (trace.Parent != null)
            //         trace = trace.Parent.ExplicitReference as CdmAttributeContext;
            //     trace.ValidateLineage(null);
            // }

            return refLineage;
        }
        public static ResolveOptions PrepareOptionsForResolveAttributes(ResolveOptions resOptSource)
        {
            ResolveOptions resOptCopy = resOptSource.Copy();
            // use this whenever we need to keep references pointing at things that were already found. used when 'fixing' references by localizing to a new document
            resOptCopy.SaveResolutionsOnCopy = true;
            // for debugging help
            // if (resOptCopy.MapOldCtxToNewCtx != null)
            // {
            //     return null;
            // }
            resOptCopy.MapOldCtxToNewCtx = new Dictionary<CdmAttributeContext, CdmAttributeContext>();
            return resOptCopy;
        }

        internal static CdmAttributeContext GetUnderContextForCacheContext(ResolveOptions resOpt, CdmCorpusContext ctx, AttributeContextParameters acpUsed)
        {
            // a new context node is needed for these attributes, 
            // this tree will go into the cache, so we hang it off a placeholder parent
            // when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
            // put into the 'receiving' tree
            if (acpUsed != null)
            {
                var acpCache = acpUsed.Copy();
                CdmAttributeContext parentCtxForCache = new CdmAttributeContext(ctx, "cacheHolder");
                parentCtxForCache.Type = CdmAttributeContextType.PassThrough;
                acpCache.under = parentCtxForCache;
                return CdmAttributeContext.CreateChildUnder(resOpt, acpCache);
            }
            return null;
        }

        internal CdmAttributeContext GetUnderContextFromCacheContext(ResolveOptions resOpt, AttributeContextParameters acpUsed)
        {
            // tree is found in cache, need a replacement tree node to put the sub-tree into. this replacement
            // needs to be build from the acp of the destination tree
            if (acpUsed != null)
            {
                return CdmAttributeContext.CreateChildUnder(resOpt, acpUsed);
            }
            return null;
        }

        internal bool AssociateTreeCopyWithAttributes(ResolveOptions resOpt, ResolvedAttributeSet ras)
        {
            // deep copy the tree. while doing this also collect a map from old attCtx to new equivalent
            // this is where the returned tree fits in
            var cachedCtx = ras.AttributeContext;
            if (cachedCtx.CopyAttributeContextTree(resOpt, this) == null)
            {
                return false;
            }
            ras.AttributeContext = this;

            // run over the resolved attributes in the copy and use the map to swap the old ctx for the new version
            Action<ResolvedAttributeSet> fixResolveAttributeCtx = null;
            fixResolveAttributeCtx = (rasSub) =>
            {
                rasSub.Set.ForEach(ra =>
                {
                    ra.AttCtx = resOpt.MapOldCtxToNewCtx[ra.AttCtx];
                    // the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
                    if (ra.Target is ResolvedAttributeSet)
                    {
                        (ra.Target as ResolvedAttributeSet).AttributeContext = ra.AttCtx;
                        fixResolveAttributeCtx(ra.Target as ResolvedAttributeSet);
                    }
                });
            };
            fixResolveAttributeCtx(ras);

            // now fix any lineage references 
            Action<CdmAttributeContext, CdmAttributeContext> FixAttCtxNodeLineage = null;
            FixAttCtxNodeLineage = (ac, acParent) =>
            {
                if (ac == null)
                {
                    return;
                }
                if (acParent != null && ac.Parent != null && ac.Parent.ExplicitReference != null)
                {
                    ac.Parent.ExplicitReference = acParent;
                }
                if (ac.Lineage != null && ac.Lineage.Count > 0)
                {
                    // fix lineage
                    foreach (var lin in ac.Lineage)
                    {
                        if (lin.ExplicitReference != null)
                        {
                            // swap the actual object for the one in the new tree
                            lin.ExplicitReference = resOpt.MapOldCtxToNewCtx[lin.ExplicitReference as CdmAttributeContext];
                        }
                    }
                }

                if (ac.Contents == null || ac.Contents.Count == 0)
                {
                    return;
                }
                // look at all children
                foreach (CdmAttributeContext subSub in ac.Contents)
                {
                    FixAttCtxNodeLineage(subSub, ac);
                }
            };
            FixAttCtxNodeLineage(this, null);

            return true;
        }

        internal bool FinalizeAttributeContext(ResolveOptions resOpt, string pathStart, CdmDocumentDefinition docHome, CdmDocumentDefinition docFrom, string monikerForDocFrom, bool finished = false)
        {
            // run over the attCtx tree again and 'fix it' fix means replace the parent and lineage reference path strings with
            // final values from new home and set the inDocument and fix any references to definitions

            // keep track of the paths to documents for fixing symbol refs. expensive to compute
            Dictionary<CdmDocumentDefinition, string> foundDocPaths = new Dictionary<CdmDocumentDefinition, string>();

            if (!string.IsNullOrWhiteSpace(monikerForDocFrom))
            {
                monikerForDocFrom = $"{monikerForDocFrom}/";
            }

            // first step makes sure every node in the tree has a good path for itself and a good document
            // second pass uses the paths from nodes to fix references to other nodes
            Action<CdmObject, string> FixAttCtxNodePaths = null;
            FixAttCtxNodePaths = (subItem, pathFrom) =>
            {
                CdmAttributeContext ac = subItem as CdmAttributeContext;
                if (ac == null)
                {
                    return;
                }
                ac.InDocument = docHome;

                // fix up the reference to defintion. need to get path from this document to the 
                // add moniker if this is a reference
                if (ac.Definition != null)
                {
                    ac.Definition.InDocument = docHome;

                    if (ac.Definition?.NamedReference != null)
                    {
                        // need the real path to this thing from the explicitRef held in the portable reference
                        // the real path is {monikerFrom/}{path from 'from' document to document holding the explicit ref/{declaredPath of explicitRef}}
                        // if we have never looked up the path between docs, do that now
                        CdmDocumentDefinition docFromDef = ac.Definition.ExplicitReference.InDocument; // if all parts not set, this is a broken portal ref!
                        string pathBetweenDocs;
                        if (foundDocPaths.TryGetValue(docFromDef, out pathBetweenDocs) == false)
                        {
                            pathBetweenDocs = docFrom.ImportPathToDoc(docFromDef);
                            if (pathBetweenDocs == null)
                            {
                                // hmm. hmm.
                                pathBetweenDocs = "";
                            }
                            foundDocPaths[docFrom] = pathBetweenDocs;
                        }
                        
                        (ac.Definition as CdmObjectReferenceBase).LocalizePortableReference(resOpt, $"{monikerForDocFrom}{pathBetweenDocs}");
                    }
                }
                // doc of parent ref
                if (ac.Parent != null)
                {
                    ac.Parent.InDocument = docHome;
                }
                // doc of lineage refs
                if (ac.Lineage != null && ac.Lineage.Count > 0)
                {
                    foreach (var lin in ac.Lineage)
                    {
                        lin.InDocument = docHome;
                    }
                }

                string divider = (string.IsNullOrEmpty(ac.AtCorpusPath) || !pathFrom.EndsWith("/")) ? "/" : "";
                ac.AtCorpusPath = $"{pathFrom}{divider}{ac.Name}";

                if (ac.Contents == null || ac.Contents.Count == 0)
                {
                    return;
                }
                // look at all children
                foreach (var subSub in ac.Contents)
                {
                    if (subSub.ObjectType == CdmObjectType.AttributeContextDef)
                    {
                        FixAttCtxNodePaths(subSub, ac.AtCorpusPath);
                    }
                }
            };
            FixAttCtxNodePaths(this, pathStart);

            // now fix any lineage and parent references 
            Action<CdmObject> FixAttCtxNodeLineage = null;
            FixAttCtxNodeLineage = (subItem) =>
            {
                CdmAttributeContext ac = subItem as CdmAttributeContext;
                if (ac == null)
                {
                    return;
                }
                // for debugLineage, write id
                //ac.Name = $"{ac.Name}({ac.Id})";

                // parent ref
                if (ac.Parent != null && ac.Parent.ExplicitReference != null)
                {
                    ac.Parent.NamedReference = (ac.Parent.ExplicitReference as CdmAttributeContext).AtCorpusPath;
                    // for debugLineage, write id
                    //ac.Parent.NamedReference = $"{ (ac.Parent.ExplicitReference as CdmAttributeContext).AtCorpusPath}({ac.Parent.ExplicitReference.Id})";
                }

                // fix lineage
                if (ac.Lineage != null && ac.Lineage.Count > 0)
                {
                    foreach (var lin in ac.Lineage)
                    {
                        if (lin.ExplicitReference != null)
                        {
                            // use the new path as the ref
                            lin.NamedReference = (lin.ExplicitReference as CdmAttributeContext).AtCorpusPath;
                            // for debugLineage, write id
                            //lin.NamedReference = $"{ (lin.ExplicitReference as CdmAttributeContext).AtCorpusPath}({lin.ExplicitReference.Id})";
                        }
                    }
                }


                if (ac.Contents == null || ac.Contents.Count == 0)
                {
                    return;
                }
                // look at all children
                foreach (var subSub in ac.Contents)
                {
                    FixAttCtxNodeLineage(subSub);
                }
            };
            FixAttCtxNodeLineage(this);

            if (finished)
            {
                resOpt.SaveResolutionsOnCopy = false;
                resOpt.MapOldCtxToNewCtx = null;
            }

            return true;
        }
        internal bool ValidateLineage(ResolveOptions resOpt)
        {
            // run over the attCtx tree and validate that it is self consistent on lineage

            // collect all nodes in the tree
            HashSet<CdmAttributeContext> attCtxInTree = new HashSet<CdmAttributeContext>();
            Action<CdmObject> collectAllNodes = null;
            collectAllNodes = (subItem) =>
            {
                CdmAttributeContext ac = subItem as CdmAttributeContext;
                if (ac == null)
                {
                    return;
                }
                attCtxInTree.Add(ac);
                if (ac.Contents == null || ac.Contents.Count == 0)
                {
                    return;
                }
                // look at all children
                foreach (var subSub in ac.Contents)
                {
                    if (subSub.ObjectType == CdmObjectType.AttributeContextDef)
                    {
                        collectAllNodes(subSub);
                    }
                }
            };
            collectAllNodes(this);

            // now make sure every lineage ref is in that set
            Func<CdmObject, bool> CheckLineage = null;
            CheckLineage = (subItem) =>
            {
                CdmAttributeContext ac = subItem as CdmAttributeContext;
                if (ac == null)
                {
                    return true;
                }

                if (ac.Lineage != null && ac.Lineage.Count > 0)
                {
                    foreach (var lin in ac.Lineage)
                    {
                        if (!attCtxInTree.Contains(lin.ExplicitReference as CdmAttributeContext))
                        {
                            return false;
                        }
                        //if (!resOpt.MapOldCtxToNewCtx.ContainsKey(lin.ExplicitReference as CdmAttributeContext))
                        //{
                            //return false;
                        //}

                    }
                }

                if (ac.Contents == null || ac.Contents.Count == 0)
                {
                    return true;
                }
                // look at all children
                foreach (var subSub in ac.Contents)
                {
                    if (subSub.ObjectType == CdmObjectType.AttributeContextDef)
                    {
                        if (CheckLineage(subSub) == false)
                        {
                            return false;
                        }
                    }
                }
                return true;
            };
            CheckLineage(this);

            return true;
        }

    }
}
