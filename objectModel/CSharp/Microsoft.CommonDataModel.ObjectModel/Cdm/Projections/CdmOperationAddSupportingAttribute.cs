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
    /// Class to handle AddSupportingAttribute operations
    /// </summary>
    public class CdmOperationAddSupportingAttribute : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationAddSupportingAttribute);

        public CdmTypeAttributeDefinition SupportingAttribute { get; set; }

        public CdmOperationAddSupportingAttribute(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationAddSupportingAttributeDef;
            this.Type = CdmOperationType.AddSupportingAttribute;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var copy = host == null ? new CdmOperationAddSupportingAttribute(this.Ctx) : host as CdmOperationAddSupportingAttribute;

            copy.SupportingAttribute = this.SupportingAttribute?.Copy(resOpt) as CdmTypeAttributeDefinition;

            this.CopyProj(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationAddSupportingAttribute>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationAddSupportingAttribute";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationAddSupportingAttributeDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (this.SupportingAttribute == null)
                missingFields.Add("SupportingAttribute");

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
            // Pass through all the input projection attribute states if there are any
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                projOutputSet.Add(currentPAS);
            }

            // Create a new attribute context for the operation
            AttributeContextParameters attrCtxOpAddSupportingAttrParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationAddSupportingAttribute,
                Name = $"operation/index{Index}/{this.GetName()}"
            };
            CdmAttributeContext attrCtxOpAddSupportingAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpAddSupportingAttrParam);

            // Create a new attribute context for the supporting attribute we will create
            AttributeContextParameters attrCtxTypeAttrParam = new AttributeContextParameters
            {
                under = attrCtxOpAddSupportingAttr,
                type = CdmAttributeContextType.AddedAttributeSupporting,
                Name = this.SupportingAttribute.Name
            };
            CdmAttributeContext attrCtxSupportingAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxTypeAttrParam);
            
            // TODO: this if statement keeps the functionality the same way it works currently in resolution guidance.
            // This should be changed to point to the foreign key attribute instead. 
            // There has to be some design decisions about how this will work and will be done in the next release.
            if (projCtx.CurrentAttributeStateSet.States.Count > 0)
            {
                ProjectionAttributeState lastState = projCtx.CurrentAttributeStateSet.States[projCtx.CurrentAttributeStateSet.States.Count - 1];
                CdmTraitReference inSupportOfTrait = this.SupportingAttribute.AppliedTraits.Add("is.addedInSupportOf") as CdmTraitReference;
                inSupportOfTrait.Arguments.Add("inSupportOf", lastState.CurrentResolvedAttribute.ResolvedName);
            }

            // Create the supporting attribute with the specified "SupportingAttribute" property as its target and apply the trait "is.virtual.attribute" to it
            List<string> addTrait = new List<string>() { "is.virtual.attribute" };
            ResolvedAttribute newResAttr = CreateNewResolvedAttribute(projCtx, attrCtxSupportingAttr, this.SupportingAttribute, addedSimpleRefTraits: addTrait);

            // Create a new projection attribute state for the new supporting attribute and add it to the output set
            // There is no previous state for the newly created supporting attribute
            ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.Ctx)
            {
                CurrentResolvedAttribute = newResAttr
            };

            projOutputSet.Add(newPAS);

            return projOutputSet;
        }
    }
}
