//-----------------------------------------------------------------------
// <copyright file="CdmE2ERelationship.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using Microsoft.CommonDataModel.ObjectModel.Enums;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using System;

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    public class CdmE2ERelationship : CdmObjectDefinitionBase
    {
        public string Name { get; set; }
        public string FromEntity { get; set; }
        public string FromEntityAttribute { get; set; }
        public string ToEntity { get; set; }
        public string ToEntityAttribute { get; set; }

        public CdmE2ERelationship(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.Name = name;
            this.ObjectType = CdmObjectType.E2ERelationshipDef;
        }

        public override string GetName()
        {
            return this.Name;
        }

        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return false;
        }

        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            var copy = new CdmE2ERelationship(this.Ctx, this.GetName())
            {
                FromEntity = this.FromEntity,
                FromEntityAttribute = this.FromEntityAttribute,
                ToEntity = this.ToEntity,
                ToEntityAttribute = this.ToEntityAttribute
            };
            this.CopyDef(resOpt, copy);

            return copy;
        }

        public override bool Validate()
        {
            return !string.IsNullOrEmpty(this.FromEntity) && !string.IsNullOrEmpty(this.FromEntityAttribute)
                && !string.IsNullOrEmpty(this.ToEntity) && !string.IsNullOrEmpty(this.ToEntityAttribute);
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.E2ERelationshipDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmE2ERelationship>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            
            if (string.IsNullOrEmpty(this.DeclaredPath))
            {
                this.DeclaredPath = pathFrom + this.Name;
            }

            var path = this.DeclaredPath;

            if (preChildren != null && preChildren.Invoke(this, path))
            {
                return false;
            }

            if (this.VisitDef(path, preChildren, postChildren))
            {
                return true;
            }
            
            if (postChildren != null && postChildren.Invoke(this, path))
            {
                return true;
            }

            return false;
        }
    }
}
