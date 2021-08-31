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
    using System.Linq;

    /// <summary>
    /// Class to handle AlterTraits operations
    /// </summary>
    public class CdmOperationAlterTraits : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationAlterTraits);

        public List<CdmTraitReferenceBase> TraitsToAdd { get; set; }

        public List<CdmTraitReferenceBase> TraitsToRemove { get; set; }

        public bool? ArgumentsContainWildcards { get; set; }

        public List<string> ApplyTo { get; set; }

        public CdmOperationAlterTraits(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationAlterTraitsDef;
            this.Type = CdmOperationType.AlterTraits;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var copy = host == null ? new CdmOperationAlterTraits(this.Ctx) : host as CdmOperationAlterTraits;

            List<CdmTraitReferenceBase> traitsToAdd = null;
            
            if (this.TraitsToAdd != null)
            {
                traitsToAdd = new List<CdmTraitReferenceBase>();
                this.TraitsToAdd.ForEach(trait => traitsToAdd.Add(trait.Copy(resOpt) as CdmTraitReferenceBase));
            }

            List<CdmTraitReferenceBase> traitsToRemove = null;

            if (this.TraitsToRemove != null)
            {
                traitsToRemove = new List<CdmTraitReferenceBase>();
                this.TraitsToRemove.ForEach(trait => traitsToRemove.Add(trait.Copy(resOpt) as CdmTraitReferenceBase));
            }


            if (this.ApplyTo != null)
            {
                copy.ApplyTo = new List<string>(this.ApplyTo);
            }

            copy.TraitsToAdd = traitsToAdd;
            copy.TraitsToRemove = traitsToRemove;
            copy.ArgumentsContainWildcards = this.ArgumentsContainWildcards;

            this.CopyProj(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationAlterTraits>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationAlterTraits";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationAlterTraitsDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            // Need to have either traitsToAdd or traitsToRemove
            if (this.TraitsToAdd == null && this.TraitsToRemove == null)
            {
                missingFields.Add(nameof(this.TraitsToAdd));
                missingFields.Add(nameof(this.TraitsToRemove));
            } 

            if (missingFields.Count > 0)
            {
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) => $"'{s}'")));
                return false;
            }

            return true;
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
                    path = pathFrom + this.GetName();
                    this.DeclaredPath = path;
                }
            }

            if (preChildren?.Invoke(this, path) == true)
            {
                return false;
            }

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;

            return false;
        }

        /// <inheritdoc />
        internal override ProjectionAttributeStateSet AppendProjectionAttributeState(
            ProjectionContext projCtx,
            ProjectionAttributeStateSet projOutputSet,
            CdmAttributeContext attrCtx)
        {
            // Create a new attribute context for the operation
            AttributeContextParameters attrCtxOpAlterTraitsParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationAlterTraits,
                Name = $"operation/index{Index}/{this.GetName()}"
            };
            CdmAttributeContext attrCtxOpAlterTraits = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpAlterTraitsParam);

            // Get the top-level attribute names of the selected attributes to apply
            // We use the top-level names because the applyTo list may contain a previous name our current resolved attributes had
            Dictionary<string, string> topLevelSelectedAttributeNames = this.ApplyTo != null ? ProjectionResolutionCommonUtil.GetTopList(projCtx, this.ApplyTo) : null;

            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                // Check if the current projection attribute state's resolved attribute is in the list of selected attributes
                // If this attribute is not in the list, then we are including it in the output without changes
                if (topLevelSelectedAttributeNames == null || topLevelSelectedAttributeNames.ContainsKey(currentPAS.CurrentResolvedAttribute.ResolvedName))
                {
                    // Create a new attribute context for the new attribute we will create
                    AttributeContextParameters attrCtxNewAttrParam = new AttributeContextParameters
                    {
                        under = attrCtxOpAlterTraits,
                        type = CdmAttributeContextType.AttributeDefinition,
                        Name = currentPAS.CurrentResolvedAttribute.ResolvedName
                    };
                    CdmAttributeContext attrCtxNewAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxNewAttrParam);

                    ResolvedAttribute newResAttr = null;
                    
                    if (currentPAS.CurrentResolvedAttribute.Target is ResolvedAttributeSet)
                    {
                        // Attribute group
                        // Create a copy of resolved attribute set 
                        ResolvedAttributeSet resAttrNewCopy = ((ResolvedAttributeSet)currentPAS.CurrentResolvedAttribute.Target).Copy();
                        newResAttr = new ResolvedAttribute(projCtx.ProjectionDirective.ResOpt, resAttrNewCopy, currentPAS.CurrentResolvedAttribute.ResolvedName, attrCtxNewAttr);

                        // the resolved attribute group obtained from previous projection operation may have a different set of traits comparing to the resolved attribute target. 
                        // We would want to take the set of traits from the resolved attribute.
                        newResAttr.ResolvedTraits = currentPAS.CurrentResolvedAttribute.ResolvedTraits.DeepCopy();
                    }
                    else if (currentPAS.CurrentResolvedAttribute.Target is CdmAttribute)
                    {
                        // Entity Attribute or Type Attribute
                        newResAttr = CreateNewResolvedAttribute(projCtx, attrCtxNewAttr, currentPAS.CurrentResolvedAttribute, currentPAS.CurrentResolvedAttribute.ResolvedName);
                    }
                    else
                    {
                        Logger.Error(this.Ctx, Tag, nameof(AppendProjectionAttributeState), this.AtCorpusPath, CdmLogCode.ErrProjUnsupportedSource, currentPAS.CurrentResolvedAttribute.Target.ObjectType.ToString(), this.GetName());
                        // Add the attribute without changes
                        projOutputSet.Add(currentPAS);
                        break;
                    }

                    newResAttr.ResolvedTraits = newResAttr.ResolvedTraits.MergeSet(this.ResolvedNewTraits(projCtx, currentPAS));
                    this.RemoveTraitsInNewAttribute(projCtx.ProjectionDirective.ResOpt, newResAttr);

                    // Create a projection attribute state for the new attribute with new applied traits by creating a copy of the current state
                    // Copy() sets the current state as the previous state for the new one
                    ProjectionAttributeState newPAS = currentPAS.Copy();

                    // Update the resolved attribute to be the new attribute we created
                    newPAS.CurrentResolvedAttribute = newResAttr;

                    projOutputSet.Add(newPAS);
                }
                else
                {
                    // Pass through
                    projOutputSet.Add(currentPAS);
                }
            }

            return projOutputSet;
        }

        /// <summary>
        /// Get a resolved trait set which contains new resolved traits with placement for wild characters if it's applicable.
        /// </summary>
        /// <param name="projCtx">The current projection context.</param>
        /// <param name="currentPAS">The current attribute state set.</param>
        /// <returns></returns>
        private ResolvedTraitSet ResolvedNewTraits(ProjectionContext projCtx, ProjectionAttributeState currentPAS)
        {
            ResolvedTraitSet resolvedTraitSet = new ResolvedTraitSet(projCtx.ProjectionDirective.ResOpt);
            string baseAttributeName = projCtx.ProjectionDirective.OriginalSourceEntityAttributeName ?? projCtx.ProjectionDirective.Owner.GetName() ?? "";
            string ordinal = currentPAS.Ordinal != null ? currentPAS.Ordinal.ToString() : "";
            string currentAttributeName = (currentPAS.CurrentResolvedAttribute.Target as CdmAttribute)?.Name ?? "";

            foreach (var traitRef in this.TraitsToAdd)
            {
                var traitRefCopy = traitRef.FetchResolvedTraits(projCtx.ProjectionDirective.ResOpt).DeepCopy();
                ReplaceWildcardCharacters(projCtx.ProjectionDirective.ResOpt, traitRefCopy, baseAttributeName, ordinal, currentAttributeName);
                resolvedTraitSet = resolvedTraitSet.MergeSet(traitRefCopy);
            }

            return resolvedTraitSet;
        }

        /// <summary>
        /// Replace wild characters in the arguments if argumentsContainWildcards is true.
        /// </summary>
        /// <param name="resOpt">The resolve options.</param>
        /// <param name="resolvedTraitSet">The current attribute state set.</param>
        /// <param name="baseAttributeName">The base attribute name, it may be empty string if it's not available(type attribute).</param>
        /// <param name="ordinal">The ordinal number, it may be empty string if it's not available.</param>
        /// <param name="currentAttributeName">The current attribute name, It may be empty string if the source is a ResolvedAttributeSet (attribute group reference).</param>
        private void ReplaceWildcardCharacters(ResolveOptions resOpt, ResolvedTraitSet resolvedTraitSet, string baseAttributeName, string ordinal, string currentAttributeName)
        {
            if (this.ArgumentsContainWildcards.HasValue && this.ArgumentsContainWildcards.Value == true)
            {
                foreach (ResolvedTrait resolvedTrait in resolvedTraitSet.Set)
                {
                    var parameterValueSet = resolvedTrait.ParameterValues;
                    for (int i = 0; i < parameterValueSet.Length; ++i)
                    {
                        var value = parameterValueSet.FetchValue(i);
                        if (value is string v)
                        {
                            var newVal = ReplaceWildcardCharacters(v, baseAttributeName, ordinal, currentAttributeName);
                            if (newVal != value)
                            {
                                parameterValueSet.SetParameterValue(resOpt, parameterValueSet.FetchParameterAtIndex(i).GetName(), newVal);
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Remove traits from the new resolved attribute.
        /// </summary>
        /// <param name="resOpt">The resolve options.</param>
        /// <param name="newResAttr">The new resolved attribute.</param>
        private void RemoveTraitsInNewAttribute(ResolveOptions resOpt, ResolvedAttribute newResAttr)
        {
            HashSet<string> traitNamesToRemove = new HashSet<string>();
            if (this.TraitsToRemove != null)
            {
                foreach (var traitRef in this.TraitsToRemove)
                {
                    ResolvedTraitSet resolvedTraitSet = traitRef.FetchResolvedTraits(resOpt).DeepCopy();
                    resolvedTraitSet.Set.ForEach(rt => traitNamesToRemove.Add(rt.TraitName));
                }
                traitNamesToRemove.ToList().ForEach(traitName => newResAttr.ResolvedTraits.Remove(resOpt, traitName));
            }
        }
    }
}
