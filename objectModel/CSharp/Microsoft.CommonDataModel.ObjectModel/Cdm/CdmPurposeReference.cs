// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmPurposeReference : CdmObjectReferenceBase
    {
        /// <summary>
        /// Constructs a CdmPurposeReference.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="purpose">The purpose to reference.</param>
        /// <param name="simpleReference">Whether this reference is a simple reference.</param>
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

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference, CdmObjectReferenceBase host = null)
        {
            if (host == null)
                return new CdmPurposeReference(this.Ctx, refTo, simpleReference);
            else
                return host.CopyToHost(this.Ctx, refTo, simpleReference);
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
