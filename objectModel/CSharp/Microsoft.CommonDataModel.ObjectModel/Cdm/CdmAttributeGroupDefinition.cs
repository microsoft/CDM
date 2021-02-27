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

    /// <summary>
    /// The CDM definition that contains a collection of CdmAttributeItem objects.
    /// </summary>
    public class CdmAttributeGroupDefinition : CdmObjectDefinitionBase, CdmReferencesEntities
    {
        /// <summary>
        /// Constructs a CdmAttributeGroupDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="attributeGroupName">The attribute group name.</param>
        public CdmAttributeGroupDefinition(CdmCorpusContext ctx, string attributeGroupName)
                   : base(ctx)
        {
            this.ObjectType = CdmObjectType.AttributeGroupDef;
            this.AttributeGroupName = attributeGroupName;
            this.Members = new CdmCollection<CdmAttributeItem>(this.Ctx, this, CdmObjectType.TypeAttributeDef);
        }

        /// <summary>
        /// Gets or sets the attribute group name.
        /// </summary>
        public string AttributeGroupName { get; set; }

        /// <summary>
        /// Gets or sets the attribute group context.
        /// </summary>
        public CdmAttributeContextReference AttributeContext { get; set; }

        /// <summary>
        /// Gets the attribute group members.
        /// </summary>
        public CdmCollection<CdmAttributeItem> Members { get; }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.AttributeGroupDef;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            return false;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmAttributeGroupDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmAttributeGroupDefinition copy;
            if (host == null)
            {
                copy = new CdmAttributeGroupDefinition(this.Ctx, this.AttributeGroupName);
            }
            else
            {
                copy = host as CdmAttributeGroupDefinition;
                copy.Ctx = this.Ctx;
                copy.AttributeGroupName = this.AttributeGroupName;
                copy.Members.Clear();
            }

            copy.AttributeContext = (CdmAttributeContextReference)this.AttributeContext?.Copy(resOpt);

            foreach (var newMember in this.Members)
                copy.Members.Add(newMember);
            this.CopyDef(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.AttributeGroupName))
            {
                Logger.Error(nameof(CdmAttributeGroupDefinition), this.Ctx, Errors.ValidateErrorString(this.AtCorpusPath, new List<string> { "AttributeGroupName" }), nameof(Validate));
                return false;
            }
            return true;
        }

        internal CdmAttributeItem AddAttributeDef(CdmAttributeItem attributeDef)
        {
            this.Members.Add(attributeDef);
            return attributeDef;
        }

        public ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            ResolvedEntityReferenceSet rers = new ResolvedEntityReferenceSet(resOpt);
            if (this.Members != null)
            {
                for (int i = 0; i < this.Members.Count; i++)
                {
                    rers.Add(this.Members[i].FetchResolvedEntityReferences(resOpt));
                }
            }
            return rers;
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
                    path = pathFrom + this.AttributeGroupName;
                    this.DeclaredPath = path;
                }
            }
            //trackVisits(path);

            if (preChildren?.Invoke(this, path) == true)
                return false;
            if (this.AttributeContext != null) this.AttributeContext.Owner = this;
            if (this.AttributeContext?.Visit(path + "/attributeContext/", preChildren, postChildren) == true)
                return true;
            if (this.Members != null)
                if (this.Members.VisitList(path + "/members/", preChildren, postChildren))
                    return true;
            if (this.VisitDef(path, preChildren, postChildren))
                return true;

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.AttributeGroupName;
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
            CdmAttributeContext allUnder = under;
            if (under != null)
            {
                AttributeContextParameters acpAttGrp = new AttributeContextParameters
                {
                    under = under,
                    type = CdmAttributeContextType.AttributeGroup,
                    Name = this.GetName(),
                    Regarding = this,
                    IncludeTraits = false
                };
                under = rasb.ResolvedAttributeSet.CreateAttributeContext(resOpt, acpAttGrp);
            }

            if (this.Members != null)
            {
                for (int i = 0; i < this.Members.Count; i++)
                {
                    CdmObjectBase att = this.Members[i] as CdmObjectBase;
                    AttributeContextParameters acpAtt = null;
                    if (under != null)
                    {
                        acpAtt = new AttributeContextParameters
                        {
                            under = under,
                            type = CdmAttributeContextType.AttributeDefinition,
                            Name = att.FetchObjectDefinitionName(),
                            Regarding = att,
                            IncludeTraits = false
                        };
                    }

                    ResolvedAttributeSet rasFromAtt = att.FetchResolvedAttributes(resOpt, acpAtt);
                    // before we just merge, need to handle the case of 'attribute restatement' AKA an entity with an attribute having the same name as an attribute
                    // from a base entity. thing might come out with different names, if they do, then any attributes owned by a similar named attribute before
                    // that didn't just pop out of that same named attribute now need to go away.
                    // mark any attributes formerly from this named attribute that don't show again as orphans
                    rasb.ResolvedAttributeSet.MarkOrphansForRemoval((att as CdmAttributeItem).FetchObjectDefinitionName(), rasFromAtt);
                    // now merge
                    rasb.MergeAttributes(rasFromAtt);

                }
            }
            rasb.ResolvedAttributeSet.AttributeContext = allUnder; // context must be the one expected from the caller's pov.

            // things that need to go away
            rasb.RemoveRequestedAtts();
            return rasb;
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            // get only the elevated traits from attribute first, then add in all traits from this definition
            if (this.Members != null)
            {
                ResolvedTraitSet rtsElevated = new ResolvedTraitSet(resOpt);
                for (int i = 0; i < this.Members.Count; i++)
                {
                    dynamic att = this.Members.AllItems[i];
                    ResolvedTraitSet rtsAtt = att.FetchResolvedTraits(resOpt);
                    if (rtsAtt?.HasElevated == true)
                        rtsElevated = rtsElevated.MergeSet(rtsAtt, true);
                }
                rtsb.MergeTraits(rtsElevated);
            }
            this.ConstructResolvedTraitsDef(null, rtsb, resOpt);
        }
    }
}
