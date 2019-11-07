//-----------------------------------------------------------------------
// <copyright file="CdmEntityReference.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmEntityReference : CdmObjectReferenceBase
    {
        public CdmEntityReference(CdmCorpusContext ctx, dynamic entityRef, bool simpleReference)
            : base(ctx, (object)entityRef, simpleReference)
        {
            this.ObjectType = CdmObjectType.EntityRef;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.EntityRef;
        }

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference)
        {
            return new CdmEntityReference(this.Ctx, refTo, simpleReference);
        }

        internal override bool VisitRef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            return false;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmEntityReference>(this, resOpt, options);
        }
    }
}
