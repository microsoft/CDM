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
    /// Class to handle AddTypeAttribute operations
    /// </summary>
    public class CdmOperationAddTypeAttribute : CdmOperationBase
    {
        private static readonly string TAG = nameof(CdmOperationAddTypeAttribute);

        public CdmTypeAttributeDefinition TypeAttribute { get; set; }

        public CdmOperationAddTypeAttribute(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationAddTypeAttributeDef;
            this.Type = CdmOperationType.AddTypeAttribute;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            CdmOperationAddTypeAttribute copy = new CdmOperationAddTypeAttribute(this.Ctx)
            {
                TypeAttribute = this.TypeAttribute.Copy(resOpt, host) as CdmTypeAttributeDefinition
            };
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationAddTypeAttribute>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationAddTypeAttribute";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationAddTypeAttributeDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (this.TypeAttribute == null)
                missingFields.Add("TypeAttribute");

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
                    path = pathFrom + "operationAddTypeAttribute";
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
            // Pass through all the input projection attribute states if there are any
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                projOutputSet.Add(currentPAS);
            }

            // Create a new attribute context for the operation
            AttributeContextParameters attrCtxOpAddTypeParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationAddTypeAttribute,
                Name = $"operation/index{Index}/operationAddTypeAttribute"
            };
            CdmAttributeContext attrCtxOpAddType = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpAddTypeParam);

            // Create a new attribute context for the Type attribute we will create
            AttributeContextParameters attrCtxTypeAttrParam = new AttributeContextParameters
            {
                under = attrCtxOpAddType,
                type = CdmAttributeContextType.AddedAttributeSelectedType,
                Name = "_selectedEntityName"
            };
            CdmAttributeContext attrCtxTypeAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxTypeAttrParam);

            // Create the Type attribute with the specified "typeAttribute" (from the operation) as its target and apply the trait "is.linkedEntity.name" to it
            List<string> addTrait = new List<string>() { "is.linkedEntity.name" };
            ResolvedAttribute newResAttr = CreateNewResolvedAttribute(projCtx, attrCtxTypeAttr, this.TypeAttribute, addedSimpleRefTraits: addTrait);

            // Create a new projection attribute state for the new Type attribute and add it to the output set
            // There is no previous state for the newly created Type attribute
            ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.Ctx)
            {
                CurrentResolvedAttribute = newResAttr
            };

            projOutputSet.Add(newPAS);

            return projOutputSet;
        }
    }
}
