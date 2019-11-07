//-----------------------------------------------------------------------
// <copyright file="CdmPurposeDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmPurposeDefinition : CdmObjectDefinitionBase
    {
        /// <summary>
        /// Gets or sets the purpose name.
        /// </summary>
        public string PurposeName { get; set; }

        /// <summary>
        /// Gets or sets the reference to the purpose extended by this.
        /// </summary>
        public CdmPurposeReference ExtendsPurpose { get; set; }

        public override string GetName()
        {
            return this.PurposeName;
        }

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

        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            CdmPurposeDefinition copy = new CdmPurposeDefinition(this.Ctx, this.PurposeName, null)
            {
                ExtendsPurpose = (CdmPurposeReference)this.ExtendsPurpose?.Copy(resOpt)
            };

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

        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return this.IsDerivedFromDef(resOpt, this.ExtendsPurposeRef, this.GetName(), baseDef);
        }

        public override bool Validate()
        {
            return !string.IsNullOrEmpty(this.PurposeName);
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = this.DeclaredPath;
            if (string.IsNullOrEmpty(path))
            {
                path = pathFrom + this.PurposeName;
                this.DeclaredPath = path;
            }
            //trackVisits(path);

            if (preChildren?.Invoke(this, path) == true)
                return false;
            if (this.ExtendsPurpose != null)
                if (this.ExtendsPurpose.Visit(path + "/extendsPurpose/", preChildren, postChildren))
                    return true;
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
