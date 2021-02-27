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
    /// Class to handle RenameAttributes operations
    /// </summary>
    public class CdmOperationRenameAttributes : CdmOperationBase
    {
        private static readonly string TAG = nameof(CdmOperationRenameAttributes);

        public string RenameFormat { get; set; }

        public List<string> ApplyTo { get; set; }

        public CdmOperationRenameAttributes(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationRenameAttributesDef;
            this.Type = CdmOperationType.RenameAttributes;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            List<string> applyTo = null;
            
            if (this.ApplyTo != null)
            {
                applyTo = new List<string>();
                applyTo.AddRange(this.ApplyTo);
            }

            CdmOperationRenameAttributes copy = new CdmOperationRenameAttributes(this.Ctx)
            {
                RenameFormat = this.RenameFormat,
                ApplyTo = applyTo
            };
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationRenameAttributes>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationRenameAttributes";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationRenameAttributesDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (string.IsNullOrWhiteSpace(this.RenameFormat))
            {
                missingFields.Add(nameof(this.RenameFormat));
            }

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
                    path = pathFrom + "operationRenameAttributes";
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
            AttributeContextParameters attrCtxOpRenameAttrsParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationRenameAttributes,
                Name = $"operation/index{Index}/operationRenameAttributes"
            };
            CdmAttributeContext attrCtxOpRenameAttrs = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpRenameAttrsParam);

            // Get the list of attributes that will be renamed
            List<string> renameAttributes;
            if (this.ApplyTo != null)
            {
                renameAttributes = this.ApplyTo;
            }
            else
            {
                renameAttributes = new List<string>();
                foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
                {
                    renameAttributes.Add(currentPAS.CurrentResolvedAttribute.ResolvedName);
                }
            }

            // Get the top-level attribute names of the attributes to rename
            // We use the top-level names because the rename list may contain a previous name our current resolved attributes had
            Dictionary<string, string> topLevelRenameAttributeNames = ProjectionResolutionCommonUtil.GetTopList(projCtx, renameAttributes);

            string sourceAttributeName = projCtx.ProjectionDirective.OriginalSourceEntityAttributeName;

            // Initialize a projection attribute context tree builder with the created attribute context for the operation
            ProjectionAttributeContextTreeBuilder attrCtxTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpRenameAttrs);

            // Iterate through all the projection attribute states generated from the source's resolved attributes
            // Each projection attribute state contains a resolved attribute that it is corresponding to
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                // Check if the current projection attribute state's resolved attribute is in the list of attributes to rename
                // If this attribute is not in the rename list, then we are including it in the output without changes
                if (topLevelRenameAttributeNames.ContainsKey(currentPAS.CurrentResolvedAttribute.ResolvedName))
                {
                    if (currentPAS.CurrentResolvedAttribute.Target is CdmAttribute)
                    {
                        // The current attribute should be renamed

                        string newAttributeName = GetNewAttributeName(currentPAS, sourceAttributeName);

                        // Create new resolved attribute with the new name, set the new attribute as target
                        ResolvedAttribute resAttrNew = CreateNewResolvedAttribute(projCtx, null, currentPAS.CurrentResolvedAttribute.Target, newAttributeName);

                        // Get the attribute name the way it appears in the applyTo list
                        string applyToName = topLevelRenameAttributeNames[currentPAS.CurrentResolvedAttribute.ResolvedName];

                        // Create the attribute context parameters and just store it in the builder for now
                        // We will create the attribute contexts at the end
                        attrCtxTreeBuilder.CreateAndStoreAttributeContextParameters(applyToName, currentPAS, resAttrNew,
                            CdmAttributeContextType.AttributeDefinition,
                            currentPAS.CurrentResolvedAttribute.AttCtx, // lineage is the original attribute
                            null); // don't know who will point here yet

                        // Create a projection attribute state for the renamed attribute by creating a copy of the current state
                        // Copy() sets the current state as the previous state for the new one
                        // We only create projection attribute states for attributes that are in the rename list    
                        ProjectionAttributeState newPAS = currentPAS.Copy();

                        // Update the resolved attribute to be the new renamed attribute we created
                        newPAS.CurrentResolvedAttribute = resAttrNew;

                        projOutputSet.Add(newPAS);
                    }
                    else
                    {
                        Logger.Warning(TAG, this.Ctx, "RenameAttributes is not supported on an attribute group yet.");
                        // Add the attribute without changes
                        projOutputSet.Add(currentPAS);
                    }
                }
                else
                {
                    // Pass through
                    projOutputSet.Add(currentPAS);
                }
            }

            // Create all the attribute contexts and construct the tree
            attrCtxTreeBuilder.ConstructAttributeContextTree(projCtx);

            return projOutputSet;
        }

        /// <summary>
        /// Renames an attribute with the current renameFormat
        /// </summary>
        /// <param name="attributeState">The attribute state.</param>
        /// <param name="sourceAttributeName">The parent attribute name (if any).</param>
        /// <returns></returns>
        private string GetNewAttributeName(ProjectionAttributeState attributeState, string sourceAttributeName)
        {
            string currentAttributeName = attributeState.CurrentResolvedAttribute.ResolvedName;
            string ordinal = attributeState.Ordinal != null ? attributeState.Ordinal.ToString() : "";
            string format = this.RenameFormat;

            if (string.IsNullOrEmpty(format))
            {
                Logger.Error(TAG, this.Ctx, "RenameFormat should be set for this operation to work.");
                return "";
            }

            string attributeName = StringUtils.Replace(format, 'a', sourceAttributeName);
            attributeName = StringUtils.Replace(attributeName, 'o', ordinal);
            attributeName = StringUtils.Replace(attributeName, 'm', currentAttributeName);

            return attributeName;
        }
    }
}
