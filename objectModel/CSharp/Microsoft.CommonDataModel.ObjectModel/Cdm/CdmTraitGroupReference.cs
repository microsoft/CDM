// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmTraitGroupReference : CdmTraitReferenceBase
    {
        /// <summary>
        /// Constructs a CdmTraitGroupReference.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="TraitGroup">The TraitGroup to reference.</param>
        /// <param name="simpleReference">Whether this reference is a simple reference.</param>
        public CdmTraitGroupReference(CdmCorpusContext ctx, dynamic TraitGroup, bool simpleReference)
            : base(ctx, (object)TraitGroup, simpleReference)
        {
            this.ObjectType = CdmObjectType.TraitGroupRef;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.TraitGroupRef;
        }

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference, CdmObjectReferenceBase host = null)
        {
            if (host == null)
                return new CdmTraitGroupReference(this.Ctx, refTo, simpleReference);
            else
                return host.CopyToHost(this.Ctx, refTo, simpleReference);
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData(this, resOpt, options);
        }

        internal override bool VisitRef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            return false;
        }
    }
}
