// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    /// <summary>
    /// The CDM reference that references a collection of CdmAttributeItem objects.
    /// </summary>
    public class CdmAttributeGroupReference : CdmObjectReferenceBase, CdmAttributeItem
    {
        /// <summary>
        /// Constructs a CdmAttributeGroupReference.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="attributeGroup">The attribute group to reference.</param>
        /// <param name="simpleReference">Whether this reference is a simple reference.</param>
        public CdmAttributeGroupReference(CdmCorpusContext ctx, dynamic attributeGroup, bool simpleReference)
            : base(ctx, (object)attributeGroup, simpleReference)
        {
            this.ObjectType = CdmObjectType.AttributeGroupRef;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.AttributeGroupRef;
        }

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference, CdmObjectReferenceBase host = null)
        {
            if (host == null)
            {
                // for inline attribute group definition, the owner information is lost here when a ref object created
                // updating it here
                if (this.ExplicitReference != null &&
                    this.ExplicitReference.ObjectType == CdmObjectType.AttributeGroupDef &&
                    this.ExplicitReference.Owner == null)
                {
                    this.ExplicitReference.Owner = this.Owner;
                }

                return new CdmAttributeGroupReference(this.Ctx, refTo, simpleReference);
            }
            else
                return host.CopyToHost(this.Ctx, refTo, simpleReference);
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmAttributeGroupReference>(this, resOpt, options);
        }

        internal override bool VisitRef(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            return false;
        }

        public ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmObject cdmObjectDef = this.FetchResolvedReference(resOpt);
            if (cdmObjectDef != null)
                return (cdmObjectDef as CdmAttributeGroupDefinition).FetchResolvedEntityReferences(resOpt);
            if (this.ExplicitReference != null)
                return (this.ExplicitReference as CdmAttributeGroupDefinition).FetchResolvedEntityReferences(resOpt);
            return null;
        }
    }
}
