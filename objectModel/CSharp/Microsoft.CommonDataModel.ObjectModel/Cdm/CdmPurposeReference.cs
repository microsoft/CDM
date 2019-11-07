//-----------------------------------------------------------------------
// <copyright file="CdmPurposeReference.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmPurposeReference : CdmObjectReferenceBase
    {
        public CdmPurposeReference(CdmCorpusContext ctx, dynamic purpose, bool simpleReference)
            : base(ctx, (object)purpose, simpleReference)
        {
            this.ObjectType = CdmObjectType.PurposeRef;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.PurposeRef;
        }

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference)
        {
            CdmPurposeReference copy = new CdmPurposeReference(this.Ctx, refTo, simpleReference);
            return copy;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmPurposeReference>(this, resOpt, options);
        }

        internal override bool VisitRef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            return false;
        }
    }
}
