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
    /// Class to handle AddArtifactAttribute operations
    /// </summary>
    public class CdmOperationAddArtifactAttribute : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationAddArtifactAttribute);

        public CdmAttributeItem NewAttribute { get; set; }

        public bool? InsertAtTop { get; set; }

        public CdmOperationAddArtifactAttribute(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationAddArtifactAttributeDef;
            this.Type = CdmOperationType.AddArtifactAttribute;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var copy = host == null ? new CdmOperationAddArtifactAttribute(this.Ctx) : host as CdmOperationAddArtifactAttribute;

            copy.NewAttribute = this.NewAttribute?.Copy(resOpt) as CdmAttributeItem;
            copy.InsertAtTop = this.InsertAtTop;

            this.CopyProj(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationAddArtifactAttribute>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationAddArtifactAttribute";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationAddArtifactAttributeDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (this.NewAttribute == null)
            {
                missingFields.Add(nameof(this.NewAttribute));
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
            {
                return false;
            }

            if (this.NewAttribute != null && this.NewAttribute.Visit($"{path}/newAttribute/", preChildren, postChildren))
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
            if (this.InsertAtTop != true)
            {
                AddAllPreviousAttributeStates(projCtx, projOutputSet);
                AddNewArtifactAttributeState(projCtx, projOutputSet, attrCtx);
            } else
            {
                AddNewArtifactAttributeState(projCtx, projOutputSet, attrCtx);
                AddAllPreviousAttributeStates(projCtx, projOutputSet);
            }

            return projOutputSet;
        }

        /// <summary>
        /// Create a new artifact attribute and add it to the projOutputSet.
        /// </summary>
        /// <param name="projCtx">The projection context.</param>
        /// <param name="projOutputSet">The projection attribute state set.</param>
        /// <param name="attrCtx">The attribute context.</param>
        /// <returns></returns>
        private void AddNewArtifactAttributeState(ProjectionContext projCtx, ProjectionAttributeStateSet projOutputSet, CdmAttributeContext attrCtx)
        {
            // Create a new attribute context for the operation
            AttributeContextParameters attrCtxOpAddArtifactAttrParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationAddArtifactAttribute,
                Name = $"operation/index{Index}/{this.GetName()}"
            };
            CdmAttributeContext attrCtxOpAddArtifactAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpAddArtifactAttrParam);

            if (this.NewAttribute is CdmTypeAttributeDefinition)
            {
                // Create a new attribute context for the new artifact attribute we will create
                AttributeContextParameters attrCtxNewAttrParam = new AttributeContextParameters
                {
                    under = attrCtxOpAddArtifactAttr,
                    type = CdmAttributeContextType.AddedAttributeNewArtifact,
                    Name = this.NewAttribute.FetchObjectDefinitionName()
                };
                CdmAttributeContext attrCtxNewAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxNewAttrParam);
                ResolvedAttribute newResAttr = CreateNewResolvedAttribute(projCtx, attrCtxNewAttr, (CdmAttribute)this.NewAttribute);

                // Create a new projection attribute state for the new artifact attribute and add it to the output set
                // There is no previous state for the newly created attribute
                ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.Ctx)
                {
                    CurrentResolvedAttribute = newResAttr
                };

                projOutputSet.Add(newPAS);
            }
            else if (this.NewAttribute is CdmEntityAttributeDefinition || this.NewAttribute is CdmAttributeGroupReference)
            {
                var typeStr = this.NewAttribute is CdmEntityAttributeDefinition ? "an entity attribute" : "an attribute group";
                Logger.Warning(this.Ctx, Tag, nameof(AppendProjectionAttributeState), this.AtCorpusPath, CdmLogCode.WarnProjAddArtifactAttrNotSupported, typeStr);
            }
            else
            {
                Logger.Error(this.Ctx, Tag, nameof(AppendProjectionAttributeState), this.AtCorpusPath, CdmLogCode.ErrProjUnsupportedSource, this.NewAttribute.ObjectType.ToString(), this.GetName());
            }
        }

        /// <summary>
        /// Pass through all the input projection attribute states if there are any.
        /// </summary>
        /// <param name="projCtx">The projection context.</param>
        /// <param name="projOutputSet">The projection attribute state set.</param>
        /// <returns></returns>
        private void AddAllPreviousAttributeStates(ProjectionContext projCtx, ProjectionAttributeStateSet projOutputSet)
        {
            // Pass through all the input projection attribute states if there are any
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                projOutputSet.Add(currentPAS);
            }
        }
    }
}
