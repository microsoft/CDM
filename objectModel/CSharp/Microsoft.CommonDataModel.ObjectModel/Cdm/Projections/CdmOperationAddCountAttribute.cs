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
    /// Class to handle AddCountAttribute operations
    /// </summary>
    public class CdmOperationAddCountAttribute : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationAddCountAttribute);

        public CdmTypeAttributeDefinition CountAttribute { get; set; }

        public CdmOperationAddCountAttribute(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationAddCountAttributeDef;
            this.Type = CdmOperationType.AddCountAttribute;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var copy = host == null ? new CdmOperationAddCountAttribute(this.Ctx) : host as CdmOperationAddCountAttribute;
            copy.CountAttribute = this.CountAttribute?.Copy(resOpt) as CdmTypeAttributeDefinition;

            this.CopyProj(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationAddCountAttribute>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationAddCountAttribute";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationAddCountAttributeDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (this.CountAttribute == null)
                missingFields.Add("CountAttribute");

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
            string path = this.UpdateDeclaredPath(pathFrom);

            if (preChildren?.Invoke(this, path) == true)
                return false;

            if (this.CountAttribute != null && this.CountAttribute.Visit($"{path}/countAttribute/", preChildren, postChildren))
                return true;

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
            // Pass through all the input projection attribute states if there are any
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                projOutputSet.Add(currentPAS);
            }

            // Create a new attribute context for the operation
            AttributeContextParameters attrCtxOpAddCountParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationAddCountAttribute,
                Name = $"operation/index{Index}/operationAddCountAttribute"
            };
            CdmAttributeContext attrCtxOpAddCount = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpAddCountParam);

            // Create a new attribute context for the Count attribute we will create
            AttributeContextParameters attrCtxCountAttrParam = new AttributeContextParameters
            {
                under = attrCtxOpAddCount,
                type = CdmAttributeContextType.AddedAttributeExpansionTotal,
                Name = this.CountAttribute.Name
            };
            CdmAttributeContext attrCtxCountAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxCountAttrParam);

            // Create the Count attribute with the specified CountAttribute as its target and apply the trait "is.linkedEntity.array.count" to it
            List<string> addTrait = new List<string>() { "is.linkedEntity.array.count" };
            ResolvedAttribute newResAttr = CreateNewResolvedAttribute(projCtx, attrCtxCountAttr, this.CountAttribute, addedSimpleRefTraits: addTrait);

            // Create a new projection attribute state for the new Count attribute and add it to the output set
            // There is no previous state for the newly created Count attribute
            ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.Ctx)
            {
                CurrentResolvedAttribute = newResAttr
            };

            projOutputSet.Add(newPAS);

            return projOutputSet;
        }
    }
}
