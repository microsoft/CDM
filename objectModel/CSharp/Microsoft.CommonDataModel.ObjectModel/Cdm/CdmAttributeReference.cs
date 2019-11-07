//-----------------------------------------------------------------------
// <copyright file="CdmAttributeReference.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmAttributeReference : CdmObjectReferenceBase
    {
        public CdmAttributeReference(CdmCorpusContext ctx, dynamic attribute, bool simpleReference)
            : base(ctx, (object)attribute, simpleReference)
        {
            this.ObjectType = CdmObjectType.AttributeRef;
        }

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference)
        {
            CdmAttributeReference copy = new CdmAttributeReference(this.Ctx, refTo, simpleReference);
            return copy;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmAttributeReference>(this, resOpt, options);
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.AttributeRef;
        }

        internal override bool VisitRef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            return false;
        }
    }
}
