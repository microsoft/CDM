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
            Logger.Error(TAG, this.Ctx, "Projection operation not implemented yet.", nameof(Copy));
            return new CdmOperationExcludeAttributes(this.Ctx);
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
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            Logger.Error(TAG, this.Ctx, "Projection operation not implemented yet.", nameof(IsDerivedFrom));
            return false;
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

            // Iterate through all the projection attribute states generated from the source's resolved attributes
            // Each projection attribute state contains a resolved attribute that it is corresponding to
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.Values)
            {
                // Check if the current projection attribute state's resolved attribute is in the list of attributes to exclude
                // If this attribute is not in the exclude list, then we are including it in the output
                if (!topLevelExcludeAttributeNames.ContainsKey(currentPAS.CurrentResolvedAttribute.ResolvedName))
                {
                    // Create a new attribute context for the attribute that we are including
                    AttributeContextParameters attrCtxAddedAttrParam = new AttributeContextParameters
                    {
                        under = attrCtx,
                        type = CdmAttributeContextType.AttributeDefinition,
                        Name = currentPAS.CurrentResolvedAttribute.ResolvedName
                    };
                    CdmAttributeContext attrCtxAddedAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxAddedAttrParam);

                    // Create a projection attribute state for the included attribute
                    // We only create projection attribute states for attributes that are not in the exclude list    
                    // Add the current projection attribute state as the previous state of the new projection attribute state
                    ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.Ctx)
                    {
                        CurrentResolvedAttribute = currentPAS.CurrentResolvedAttribute,
                        PreviousStateList = new List<ProjectionAttributeState> { currentPAS }
                    };

                    projOutputSet.Add(newPAS);
                }
                else
                {
                    // The current projection attribute state's resolved attribute is in the exclude list

                    // Get the attribute name the way it appears in the exclude list
                    // For our attribute context, we want to use the attribute name the attribute has in the exclude list rather than its current name
                    string excludeAttributeName = null;
                    topLevelExcludeAttributeNames.TryGetValue(currentPAS.CurrentResolvedAttribute.ResolvedName, out excludeAttributeName);

                    // Create a new attribute context for the excluded attribute
                    AttributeContextParameters attrCtxExcludedAttrParam = new AttributeContextParameters
                    {
                        under = attrCtxOpExcludeAttrs,
                        type = CdmAttributeContextType.AttributeDefinition,
                        Name = excludeAttributeName
                    };
                    CdmAttributeContext attrCtxExcludedAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxExcludedAttrParam);
                }
            }

            return projOutputSet;
        }
    }
}
