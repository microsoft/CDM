//-----------------------------------------------------------------------
// <copyright file="CdmAttributeContextReference.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------


namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    public class CdmAttributeContextReference : CdmObjectReferenceBase
    {
        public CdmAttributeContextReference(CdmCorpusContext ctx, string name)
            : base(ctx, name, true)
        {
            this.ObjectType = CdmObjectType.AttributeContextRef;
        }

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference)
        {
            return new CdmAttributeContextReference(this.Ctx, refTo);
        }

        [Obsolete("InstanceFromData is deprecated. Please use the Persistence Layer instead.")]
        public static CdmAttributeContextReference InstanceFromData(CdmCorpusContext ctx, dynamic obj)
        {
            return CdmObjectBase.InstanceFromData<CdmAttributeContextReference, dynamic>(ctx, obj);
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmAttributeContextReference>(this, resOpt, options);
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.AttributeContextRef;
        }

        internal override bool VisitRef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            return false;
        }
    }
}
