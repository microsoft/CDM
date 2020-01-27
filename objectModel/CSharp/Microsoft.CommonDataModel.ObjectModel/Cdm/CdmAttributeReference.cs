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
        /// <summary>
        /// Constructs a CdmAttributeReference.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="attribute">The attribute to reference.</param>
        /// <param name="simpleReference">Whether this reference is a simple reference.</param>
        public CdmAttributeReference(CdmCorpusContext ctx, dynamic attribute, bool simpleReference)
            : base(ctx, (object)attribute, simpleReference)
        {
            this.ObjectType = CdmObjectType.AttributeRef;
        }

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference, CdmObjectReferenceBase host = null)
        {
            if (host == null)
                return new CdmAttributeReference(this.Ctx, refTo, simpleReference);
            else
                return host.CopyToHost(this.Ctx, refTo, simpleReference);
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
