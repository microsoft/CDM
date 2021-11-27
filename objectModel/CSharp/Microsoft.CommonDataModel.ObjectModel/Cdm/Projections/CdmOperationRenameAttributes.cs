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
    using System.Linq;

    /// <summary>
    /// Class to handle RenameAttributes operations
    /// </summary>
    public class CdmOperationRenameAttributes : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationRenameAttributes);

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
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var copy = host == null ? new CdmOperationRenameAttributes(this.Ctx) : host as CdmOperationRenameAttributes;

            if (this.ApplyTo != null)
            {
                copy.ApplyTo = new List<string>(this.ApplyTo);
            }
            copy.RenameFormat = this.RenameFormat;

            this.CopyProj(resOpt, copy);
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
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) =>$"'{s}'")));
                return false;
            }

            return true;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = this.UpdateDeclaredPath(pathFrom);

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

                        string newAttributeName = GetNewAttributeName(projCtx.ProjectionDirective.OriginalSourceAttributeName, currentPAS);

                        // Create new resolved attribute with the new name, set the new attribute as target
                        ResolvedAttribute resAttrNew = CreateNewResolvedAttribute(projCtx, null, currentPAS.CurrentResolvedAttribute, newAttributeName);

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
                        Logger.Warning(this.Ctx, Tag, nameof(AppendProjectionAttributeState), this.AtCorpusPath, CdmLogCode.WarnProjRenameAttrNotSupported);
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
        /// Renames an attribute with the current renameFormat.
        /// </summary>
        /// <param name="projectionOwnerName">The attribute name of projection owner (only available when the owner is an entity attribute or type attribute).</param>
        /// <param name="currentPAS">The attribute state.</param>
        /// <returns></returns>
        private string GetNewAttributeName(string projectionOwnerName, ProjectionAttributeState currentPAS)
        {
            if (string.IsNullOrEmpty(this.RenameFormat))
            {
                Logger.Error((ResolveContext)this.Ctx, Tag, nameof(GetNewAttributeName), this.AtCorpusPath, CdmLogCode.ErrProjRenameFormatIsNotSet);
                return "";
            }

            return ReplaceWildcardCharacters(this.RenameFormat, projectionOwnerName, currentPAS);
        }
    }
}
