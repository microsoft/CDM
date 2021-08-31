// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel.Projections;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Logger = Microsoft.CommonDataModel.ObjectModel.Utilities.Logging.Logger;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Class to handle CombineAttributes operations
    /// </summary>
    public class CdmOperationCombineAttributes : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationCombineAttributes);

        public List<string> Select { get; set; }

        public CdmTypeAttributeDefinition MergeInto { get; set; }

        public CdmOperationCombineAttributes(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationCombineAttributesDef;
            this.Type = CdmOperationType.CombineAttributes;

            this.Select = new List<string>();
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var copy = host == null ? new CdmOperationCombineAttributes(this.Ctx) : host as CdmOperationCombineAttributes;

            if (this.Select != null)
            {
                copy.Select = new List<string>(this.Select);
            }
            copy.MergeInto = this.MergeInto?.Copy(resOpt) as CdmTypeAttributeDefinition;

            this.CopyProj(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationCombineAttributes>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationCombineAttributes";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationCombineAttributesDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (this.Select == null)
                missingFields.Add("Select");

            if (this.MergeInto == null)
                missingFields.Add("MergeInto");

            if (missingFields.Count > 0)
            {
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) =>$"'{s}'")));
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
                    path = pathFrom + "operationCombineAttributes";
                    this.DeclaredPath = path;
                }
            }

            if (preChildren?.Invoke(this, path) == true)
                return false;

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
            AttributeContextParameters attrCtxOpCombineAttrsParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationCombineAttributes,
                Name = $"operation/index{Index}/operationCombineAttributes"
            };
            CdmAttributeContext attrCtxOpCombineAttrs = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpCombineAttrsParam);

            // Initialize a projection attribute context tree builder with the created attribute context for the operation
            ProjectionAttributeContextTreeBuilder attrCtxTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpCombineAttrs);

            // Get all the leaf level PAS nodes from the tree for each selected attribute and cache to a dictionary
            Dictionary<string, List<ProjectionAttributeState>> leafLevelCombineAttributeNames = new Dictionary<string, List<ProjectionAttributeState>>();
            // Also, create a single list of leaf level PAS
            List<ProjectionAttributeState> leafLevelMergePASList = new List<ProjectionAttributeState>();
            foreach (string select in this.Select)
            {
                List<ProjectionAttributeState> leafLevelListForCurrentSelect = ProjectionResolutionCommonUtil.GetLeafList(projCtx, select);
                if (leafLevelListForCurrentSelect != null &&
                    leafLevelListForCurrentSelect.Count > 0 &&
                    !leafLevelCombineAttributeNames.ContainsKey(select))
                {
                    leafLevelCombineAttributeNames.Add(select, leafLevelListForCurrentSelect);

                    leafLevelMergePASList.AddRange(leafLevelListForCurrentSelect);
                }
            }

            // Create a List of top-level PAS objects that will be get merged based on the selected attributes
            List<ProjectionAttributeState> pasMergeList = new List<ProjectionAttributeState>();

            // Run through the top-level PAS objects 
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                if (leafLevelCombineAttributeNames.ContainsKey(currentPAS.CurrentResolvedAttribute.ResolvedName))
                {
                    // Attribute to Merge

                    if (!pasMergeList.Contains(currentPAS))
                    {
                        pasMergeList.Add(currentPAS);
                    }
                }
                else
                {
                    // Attribute to Pass Through

                    // Create a projection attribute state for the non-selected / pass-through attribute by creating a copy of the current state
                    // Copy() sets the current state as the previous state for the new one
                    ProjectionAttributeState newPAS = currentPAS.Copy();

                    projOutputSet.Add(newPAS);
                }
            }

            if (pasMergeList.Count > 0)
            {
                CdmTypeAttributeDefinition mergeIntoAttribute = this.MergeInto as CdmTypeAttributeDefinition;

                // the merged attribute needs one new place to live, so here it is
                AttributeContextParameters mergedAttrCtxParam = new AttributeContextParameters
                {
                    under = attrCtxOpCombineAttrs,
                    type = CdmAttributeContextType.AttributeDefinition,
                    Name = mergeIntoAttribute.GetName()
                };
                CdmAttributeContext mergedAttrCtx = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, mergedAttrCtxParam);

                // Create new resolved attribute, set the new attribute as target
                ResolvedAttribute raNewMergeInto = CreateNewResolvedAttribute(projCtx, mergedAttrCtx, mergeIntoAttribute, null);

                // Create new output projection attribute state set
                ProjectionAttributeState newMergeIntoPAS = new ProjectionAttributeState(projOutputSet.Ctx)
                {
                    CurrentResolvedAttribute = raNewMergeInto,
                    PreviousStateList = pasMergeList
                };

                HashSet<string> attributesAddedToContext = new HashSet<string>();

                // Create the attribute context parameters and just store it in the builder for now
                // We will create the attribute contexts at the end
                foreach (string select in leafLevelCombineAttributeNames.Keys)
                {
                    if (leafLevelCombineAttributeNames.ContainsKey(select) &&
                        leafLevelCombineAttributeNames[select] != null &&
                        leafLevelCombineAttributeNames[select].Count > 0)
                    {
                        foreach (ProjectionAttributeState leafLevelForSelect in leafLevelCombineAttributeNames[select])
                        {
                            // When dealing with a polymorphic entity, it is possible that multiple entities have an attribute with the same name
                            // Only one attribute with each name should be added otherwise the attribute context will end up with duplicated nodes
                            if (!attributesAddedToContext.Contains(leafLevelForSelect.CurrentResolvedAttribute.ResolvedName))
                            {
                                attributesAddedToContext.Add(leafLevelForSelect.CurrentResolvedAttribute.ResolvedName);
                                attrCtxTreeBuilder.CreateAndStoreAttributeContextParameters(select, leafLevelForSelect, newMergeIntoPAS.CurrentResolvedAttribute,
                                    CdmAttributeContextType.AttributeDefinition,
                                    leafLevelForSelect.CurrentResolvedAttribute.AttCtx, // lineage is the source att
                                    newMergeIntoPAS.CurrentResolvedAttribute.AttCtx); // merge into points back here
                            }
                        }
                    }
                }

                projOutputSet.Add(newMergeIntoPAS);
            }

            // Create all the attribute contexts and construct the tree
            attrCtxTreeBuilder.ConstructAttributeContextTree(projCtx);

            return projOutputSet;
        }
    }
}
