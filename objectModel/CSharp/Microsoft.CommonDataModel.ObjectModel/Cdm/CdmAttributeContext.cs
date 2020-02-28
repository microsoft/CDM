// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    public class CdmAttributeContext : CdmObjectDefinitionBase
    {
        /// <summary>
        /// Gets or sets the attribute context type.
        /// </summary>
        public CdmAttributeContextType? Type { get; set; }

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
        /// For attribute context we don't follow standard path calculation behavior.
        /// </summary>
        public new string AtCorpusPath { get; set; }

        /// <summary>
        /// Gets or sets the attribute context name.
        /// </summary>
        public string Name { get; set; }
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
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

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
            if (this.Definition != null)
            {
                copy.Definition = (CdmObjectReference)this.Definition.Copy(resOpt);
            }
            copy.Contents = new CdmCollection<CdmObject>(this.Ctx, copy, CdmObjectType.AttributeRef);

            this.CopyDef(resOpt, copy);
            return copy;
        }

        internal CdmAttributeContext CopyAttributeContextTree(ResolveOptions resOpt, CdmAttributeContext newNode, ResolvedAttributeSet ras, HashSet<CdmAttributeContext> attCtxSet = null, string moniker = null)
        {
            ResolvedAttribute ra = null;
            ras.AttCtx2ra.TryGetValue(this, out ra);
            if (ra != null)
            {
                ras.CacheAttributeContext(newNode, ra);
            }

            // add context to set
            if (attCtxSet != null)
            {
                attCtxSet.Add(newNode);
            }

            // add moniker if this is a reference
            //if (!string.IsNullOrWhiteSpace(moniker) && newNode.Definition?.NamedReference?.StartsWith(moniker) == false)
            if (!string.IsNullOrWhiteSpace(moniker) && newNode.Definition?.NamedReference != null)
            {
                newNode.Definition.NamedReference = $"{moniker}/{newNode.Definition.NamedReference}";
            }

            // now copy the children
            foreach (CdmObject child in this.Contents)
            {
                CdmAttributeContext newChild = null;
                if (child is CdmAttributeContext childAsAttributeContext)
                {
                    newChild = childAsAttributeContext.CopyNode(resOpt) as CdmAttributeContext;

                    if (newNode != null)
                    {
                        newChild.SetParent(resOpt, newNode);
                    }
                    ResolvedAttributeSet currentRas = ras;
                    if (ra?.Target is ResolvedAttributeSet)
                    {
                        currentRas = ra.Target;
                    }
                    childAsAttributeContext.CopyAttributeContextTree(resOpt, newChild, currentRas, attCtxSet, moniker);
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
            return !string.IsNullOrEmpty(this.Name) && this.Type != null;
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
            ResolveOptions resOptCopy = CdmObjectBase.CopyResolveOptions(resOpt);
            resOptCopy.SaveResolutionsOnCopy = true;

            CdmObjectReference definition = null;
            ResolvedTraitSet rtsApplied = null;
            // get a simple reference to definition object to avoid getting the traits that might be part of this ref
            // included in the link to the definition.
            if (acp.Regarding != null)
            {
                definition = acp.Regarding.CreateSimpleReference(resOptCopy);
                definition.InDocument = acp.under.InDocument; // ref is in same doc as context
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
    }
}
