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
    /// Class to handle RenameAttributes operations
    /// </summary>
    public class CdmOperationRenameAttributes : CdmOperationBase
    {
        private static readonly string TAG = nameof(CdmOperationRenameAttributes);

        public string RenameFormat { get; set; }

        public dynamic ApplyTo { get; set; }

        public CdmOperationRenameAttributes(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationRenameAttributesDef;
            this.Type = CdmOperationType.RenameAttributes;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            Logger.Error(TAG, this.Ctx, "Projection operation not implemented yet.", nameof(Copy));
            return new CdmOperationRenameAttributes(this.Ctx);
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
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            Logger.Error(TAG, this.Ctx, "Projection operation not implemented yet.", nameof(IsDerivedFrom));
            return false;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (string.IsNullOrWhiteSpace(this.RenameFormat))
                missingFields.Add("RenameFormat");

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
            Logger.Error(TAG, this.Ctx, "Projection operation not implemented yet.", nameof(AppendProjectionAttributeState));
            return null;
        }
    }
}
