// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel.Projections;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Class to handle ExcludeAttributes operations
    /// </summary>
    public class CdmOperationExcludeAttributes : CdmOperationBase
    {
        private static readonly string TAG = nameof(CdmOperationExcludeAttributes);

        public List<string> ExcludeAttributes { get; set; }

        public CdmOperationExcludeAttributes(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationExcludeAttributesDef;
            this.Type = CdmOperationType.ExcludeAttributes;
            this.ExcludeAttributes = new List<string>();
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            List<string> excludeAttributes = new List<string>();
            excludeAttributes.AddRange(this.ExcludeAttributes);

            CdmOperationExcludeAttributes copy = new CdmOperationExcludeAttributes(this.Ctx)
            {
                ExcludeAttributes = excludeAttributes
            };
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationExcludeAttributes>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationExcludeAttributes";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationExcludeAttributesDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (this.ExcludeAttributes == null)
                missingFields.Add("ExcludeAttributes");

            if (missingFields.Count > 0)
            {
                Logger.Error(TAG, this.Ctx, Errors.ValidateErrorString(this.AtCorpusPath, missingFields), nameof(Validate));
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
                    path = pathFrom + "operationExcludeAttributes";
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
            AttributeContextParameters attrCtxOpExcludeAttrsParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationExcludeAttributes,
                Name = $"operation/index{Index}/operationExcludeAttributes"
            };
            CdmAttributeContext attrCtxOpExcludeAttrs = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpExcludeAttrsParam);

            // Get the top-level attribute names of the attributes to exclude
            // We use the top-level names because the exclude list may contain a previous name our current resolved attributes had
            Dictionary<string, string> topLevelExcludeAttributeNames = ProjectionResolutionCommonUtil.GetTopList(projCtx, this.ExcludeAttributes);

            // Initialize a projection attribute context tree builder with the created attribute context for the operation
            ProjectionAttributeContextTreeBuilder attrCtxTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpExcludeAttrs);

            // Iterate through all the projection attribute states generated from the source's resolved attributes
            // Each projection attribute state contains a resolved attribute that it is corresponding to
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                // Check if the current projection attribute state's resolved attribute is in the list of attributes to exclude
                // If this attribute is not in the exclude list, then we are including it in the output
                if (!topLevelExcludeAttributeNames.ContainsKey(currentPAS.CurrentResolvedAttribute.ResolvedName))
                {
                    // Create the attribute context parameters and just store it in the builder for now
                    // We will create the attribute contexts at the end
                    attrCtxTreeBuilder.CreateAndStoreAttributeContextParameters(null, currentPAS, currentPAS.CurrentResolvedAttribute,
                        CdmAttributeContextType.AttributeDefinition,
                        currentPAS.CurrentResolvedAttribute.AttCtx, // lineage is the included attribute
                        null); // don't know who will point here yet

                    // Create a projection attribute state for the included attribute by creating a copy of the current state
                    // Copy() sets the current state as the previous state for the new one
                    // We only create projection attribute states for attributes that are not in the exclude list    
                    ProjectionAttributeState newPAS = currentPAS.Copy();

                    projOutputSet.Add(newPAS);
                }
                else
                {
                    // The current projection attribute state's resolved attribute is in the exclude list

                    // Get the attribute name the way it appears in the exclude list
                    string excludeAttributeName = null;
                    topLevelExcludeAttributeNames.TryGetValue(currentPAS.CurrentResolvedAttribute.ResolvedName, out excludeAttributeName);

                    // Create the attribute context parameters and just store it in the builder for now
                    // We will create the attribute contexts at the end
                    attrCtxTreeBuilder.CreateAndStoreAttributeContextParameters(excludeAttributeName, currentPAS, currentPAS.CurrentResolvedAttribute,
                        CdmAttributeContextType.AttributeDefinition,
                        currentPAS.CurrentResolvedAttribute.AttCtx, // lineage is the included attribute
                        null); // don't know who will point here yet, excluded, so... this could be the end for you.

                }
            }

            // Create all the attribute contexts and construct the tree
            attrCtxTreeBuilder.ConstructAttributeContextTree(projCtx);

            return projOutputSet;
        }
    }
}
