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

    public class CdmPurposeDefinition : CdmObjectDefinitionBase
    {
        private static readonly string Tag = nameof(CdmPurposeDefinition);

        /// <summary>
        /// Gets or sets the purpose name.
        /// </summary>
        public string PurposeName { get; set; }

        /// <summary>
        /// Gets or sets the reference to the purpose extended by this purpose.
        /// </summary>
        public CdmPurposeReference ExtendsPurpose { get; set; }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.PurposeName;
        }

        /// <summary>
        /// Constructs a CdmPurposeDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="purposeName">The purpose name.</param>
        /// <param name="extendsPurpose">The purpose extended by this purpose.</param>
        public CdmPurposeDefinition(CdmCorpusContext ctx, string purposeName, CdmPurposeReference extendsPurpose = null)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.PurposeDef;
            this.PurposeName = purposeName;
            if (extendsPurpose != null)
                this.ExtendsPurpose = extendsPurpose;
        }

        internal CdmPurposeReference ExtendsPurposeRef
        {
            get
            {
                return this.ExtendsPurpose as CdmPurposeReference;
            }
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmPurposeDefinition copy;
            if (host == null)
            {
                copy = new CdmPurposeDefinition(this.Ctx, this.PurposeName, null);
            }
            else
            {
                copy = host as CdmPurposeDefinition;
                copy.PurposeName = this.PurposeName;
            }

            copy.ExtendsPurpose = (CdmPurposeReference)this.ExtendsPurpose?.Copy(resOpt);

            this.CopyDef(resOpt, copy);
            return copy;
        }


        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmPurposeDefinition>(this, resOpt, options);
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.PurposeDef;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            return this.IsDerivedFromDef(resOpt, this.ExtendsPurposeRef, this.GetName(), baseDef);
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.PurposeName))
            {
                IEnumerable<string> missingFields = new List<string> { "PurposeName" };
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) =>$"'{s}'")));
                return false;
            }
            return true;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = this.UpdateDeclaredPath(pathFrom);
            //trackVisits(path);

            if (preChildren?.Invoke(this, path) == true)
                return false;
            if (this.ExtendsPurpose != null)
            {
                this.ExtendsPurpose.Owner = this;
                if (this.ExtendsPurpose.Visit(path + "/extendsPurpose/", preChildren, postChildren))
                    return true;
            }
            if (this.VisitDef(path, preChildren, postChildren))
                return true;
            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            this.ConstructResolvedTraitsDef(this.ExtendsPurposeRef, rtsb, resOpt);
            //rtsb.CleanUp();
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            return null;
        }
    }
}
