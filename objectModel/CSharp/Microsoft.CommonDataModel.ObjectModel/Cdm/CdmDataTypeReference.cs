// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmDataTypeReference : CdmObjectReferenceBase
    {
        /// <summary>
        /// Constructs a CdmDataTypeReference.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="dataType">The data type to reference.</param>
        /// <param name="simpleReference">Whether this reference is a simple reference.</param>
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

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference, CdmObjectReferenceBase host = null)
        {
            if (host == null)
                return new CdmDataTypeReference(this.Ctx, refTo, simpleReference);
            else
                return host.CopyToHost(this.Ctx, refTo, simpleReference);
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
