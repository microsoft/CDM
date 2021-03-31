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
    /// Class to handle AddAttributeGroup operations
    /// </summary>
    public class CdmOperationAddAttributeGroup : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationAddAttributeGroup);

        /// <summary>
        /// Name given to the attribute group that will be created
        /// </summary>
        public string AttributeGroupName { get; set; }

        public CdmOperationAddAttributeGroup(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationAddAttributeGroupDef;
            this.Type = CdmOperationType.AddAttributeGroup;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            var copy = new CdmOperationAddAttributeGroup(this.Ctx)
            {
                AttributeGroupName = this.AttributeGroupName
            };
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationAddAttributeGroup>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationAddAttributeGroup";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationAddAttributeGroupDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (string.IsNullOrWhiteSpace(this.AttributeGroupName))
            {
                missingFields.Add(nameof(this.AttributeGroupName));
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
            AttributeContextParameters attrCtxOpAddAttrGroupParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationAddAttributeGroup,
                Name = $"operation/index{Index}/{this.GetName()}"
            };
            CdmAttributeContext attrCtxOpAddAttrGroup = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpAddAttrGroupParam);

            // Create a new attribute context for the attribute group we will create
            AttributeContextParameters attrCtxAttrGroupParam = new AttributeContextParameters
            {
                under = attrCtxOpAddAttrGroup,
                type = CdmAttributeContextType.AttributeDefinition,
                Name = this.AttributeGroupName
            };
            CdmAttributeContext attrCtxAttrGroup = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxAttrGroupParam);

            // Create a new resolve attribute set builder that will be used to combine all the attributes into one set
            ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();

            // Iterate through all the projection attribute states generated from the source's resolved attributes
            // Each projection attribute state contains a resolved attribute that it is corresponding to
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                // Create a copy of the resolved attribute
                ResolvedAttribute resolvedAttribute = currentPAS.CurrentResolvedAttribute.Copy();

                // Add the attribute to the resolved attribute set
                rasb.ResolvedAttributeSet.Merge(resolvedAttribute);

                // Add each attribute's attribute context to the resolved attribute set attribute context
                AttributeContextParameters AttrParam = new AttributeContextParameters
                {
                    under = attrCtxAttrGroup,
                    type = CdmAttributeContextType.AttributeDefinition,
                    Name = resolvedAttribute.ResolvedName
                };
                resolvedAttribute.AttCtx = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, AttrParam);
                resolvedAttribute.AttCtx.AddLineage(currentPAS.CurrentResolvedAttribute.AttCtx);
            }

            // Create a new resolved attribute that will hold the attribute set containing all the attributes
            ResolvedAttribute resAttrNew = new ResolvedAttribute(projCtx.ProjectionDirective.ResOpt, rasb.ResolvedAttributeSet, this.AttributeGroupName, attrCtxAttrGroup);

            // Create a new projection attribute state pointing to the resolved attribute set that represents the attribute group
            ProjectionAttributeState newPAS = new ProjectionAttributeState(this.Ctx)
            {
                CurrentResolvedAttribute = resAttrNew
            };
            projOutputSet.Add(newPAS);

            return projOutputSet;
        }
    }
}
