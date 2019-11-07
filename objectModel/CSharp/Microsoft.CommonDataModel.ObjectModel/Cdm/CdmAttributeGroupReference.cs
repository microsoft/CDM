//-----------------------------------------------------------------------
// <copyright file="CdmAttributeGroupReference.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    /// <summary>
    /// The CDM Ref that references a collection of CdmAttributeItem objects
    /// </summary>
    public class CdmAttributeGroupReference : CdmObjectReferenceBase, CdmAttributeItem
    {
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

        internal override CdmObjectReferenceBase CopyRefObject(ResolveOptions resOpt, dynamic refTo, bool simpleReference)
        {
            return new CdmAttributeGroupReference(this.Ctx, refTo, simpleReference);
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
                resOpt = new ResolveOptions(this);
            }

            CdmObjectDefinition cdmObjectDef = this.GetResolvedReference(resOpt);
            if (cdmObjectDef != null)
                return (cdmObjectDef as CdmAttributeGroupDefinition).FetchResolvedEntityReferences(resOpt);
            if (this.ExplicitReference != null)
                return (this.ExplicitReference as CdmAttributeGroupDefinition).FetchResolvedEntityReferences(resOpt);
            return null;
        }
    }
}
