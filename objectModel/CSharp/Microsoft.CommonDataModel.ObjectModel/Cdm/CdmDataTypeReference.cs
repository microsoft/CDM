//-----------------------------------------------------------------------
// <copyright file="CdmDataTypeReference.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmDataTypeReference : CdmObjectReferenceBase
    {
        public CdmDataTypeReference(CdmCorpusContext ctx, dynamic dataType, bool simpleReference)
            : base(ctx, (object)dataType, simpleReference)
        {
            this.ObjectType = CdmObjectType.DataTypeRef;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.DataTypeRef;
        }

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference)
        {
            return new CdmDataTypeReference(this.Ctx, refTo, simpleReference);
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmDataTypeReference>(this, resOpt, options);
        }

        internal override bool VisitRef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            return false;
        }
    }
}
