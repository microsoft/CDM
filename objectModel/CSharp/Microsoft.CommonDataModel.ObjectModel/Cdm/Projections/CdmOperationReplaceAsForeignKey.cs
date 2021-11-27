﻿// Copyright (c) Microsoft Corporation. All rights reserved.
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
    /// Class to handle ReplaceAsForeignKey operations
    /// </summary>
    public class CdmOperationReplaceAsForeignKey : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationReplaceAsForeignKey);

        public string Reference { get; set; }

        public CdmTypeAttributeDefinition ReplaceWith { get; set; }

        public CdmOperationReplaceAsForeignKey(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationReplaceAsForeignKeyDef;
            this.Type = CdmOperationType.ReplaceAsForeignKey;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var copy = host == null ?  new CdmOperationReplaceAsForeignKey(this.Ctx) : host as CdmOperationReplaceAsForeignKey;

            copy.ReplaceWith = this.ReplaceWith?.Copy(resOpt) as CdmTypeAttributeDefinition;
            copy.Reference = this.Reference;

            this.CopyProj(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationReplaceAsForeignKey>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationReplaceAsForeignKey";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationReplaceAsForeignKeyDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (string.IsNullOrWhiteSpace(this.Reference))
                missingFields.Add("Reference");

            if (this.ReplaceWith == null)
                missingFields.Add("ReplaceWith");

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

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;

            if (this.ReplaceWith != null)
            {
                if (this.ReplaceWith.Visit(pathFrom + "foreignKeyAttribute/", preChildren, postChildren))
                {
                    return true;
                }
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
            // Create new attribute context for the operation
            AttributeContextParameters attrCtxOpFKParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationReplaceAsForeignKey,
                Name = $"operation/index{Index}/operationReplaceAsForeignKey"
            };
            CdmAttributeContext attrCtxOpFK = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpFKParam);

            // Create new attribute context for the AddedAttributeIdentity
            AttributeContextParameters attrCtxFKParam = new AttributeContextParameters
            {
                under = attrCtxOpFK,
                type = CdmAttributeContextType.AddedAttributeIdentity,
                Name = $"_foreignKey"
            };
            CdmAttributeContext attrCtxFK = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxFKParam);

            // get the added attribute and applied trait
            CdmTypeAttributeDefinition subFK = this.ReplaceWith;
            List<string> addTrait = new List<string>() { "is.linkedEntity.identifier" };

            // Create new resolved attribute, set the new attribute as target, and apply "is.linkedEntity.identifier" trait
            ResolvedAttribute resAttrNewFK = CreateNewResolvedAttribute(projCtx, attrCtxFK, subFK, addedSimpleRefTraits: addTrait);

            ProjectionAttributeStateSet outputFromOpPasSet = CreateNewProjectionAttributeStateSet(projCtx, projOutputSet, resAttrNewFK, this.Reference);

            return outputFromOpPasSet;
        }

        private static ProjectionAttributeStateSet CreateNewProjectionAttributeStateSet(
            ProjectionContext projCtx,
            ProjectionAttributeStateSet projOutputSet,
            ResolvedAttribute newResAttrFK,
            string refAttrName)
        {
            List<ProjectionAttributeState> pasList = ProjectionResolutionCommonUtil.GetLeafList(projCtx, refAttrName);
            string sourceEntity = projCtx.ProjectionDirective.OriginalSourceAttributeName;

            if (sourceEntity == null)
            {
                Logger.Warning(projOutputSet.Ctx, Tag, nameof(CreateNewProjectionAttributeStateSet), null, CdmLogCode.WarnProjFKWithoutSourceEntity, refAttrName);
            }

            if (pasList != null)
            {
                // update the new foreign key resolved attribute with trait param with reference details
                ResolvedTrait reqdTrait = newResAttrFK.ResolvedTraits.Find(projCtx.ProjectionDirective.ResOpt, "is.linkedEntity.identifier");
                if (reqdTrait != null && sourceEntity != null)
                {
                    CdmEntityReference traitParamEntRef = ProjectionResolutionCommonUtil.CreateForeignKeyLinkedEntityIdentifierTraitParameter(projCtx.ProjectionDirective, projOutputSet.Ctx.Corpus, pasList);
                    reqdTrait.ParameterValues.SetParameterValue(projCtx.ProjectionDirective.ResOpt, "entityReferences", traitParamEntRef);
                }

                // Create new output projection attribute state set for FK and add prevPas as previous state set
                ProjectionAttributeState newProjAttrStateFK = new ProjectionAttributeState(projOutputSet.Ctx)
                {
                    CurrentResolvedAttribute = newResAttrFK,
                    PreviousStateList = pasList
                };

                projOutputSet.Add(newProjAttrStateFK);
            }
            else
            {
                // Log error & return projOutputSet without any change
                Logger.Error(projOutputSet.Ctx, Tag, nameof(CreateNewProjectionAttributeStateSet), null, CdmLogCode.ErrProjRefAttrStateFailure, refAttrName);
            }

            return projOutputSet;
        }
    }
}
