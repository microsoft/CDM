//-----------------------------------------------------------------------
// <copyright file="ResolvedEntityReferenceSide.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    internal class ResolvedEntityReferenceSide
    {
        public CdmEntityDefinition Entity { get; set; }
        internal ResolvedAttributeSetBuilder ResolvedAttributeSetBuilder { get; set; }

        internal ResolvedEntityReferenceSide(CdmEntityDefinition entity, ResolvedAttributeSetBuilder rasb)
        {
            if (entity != null)
                this.Entity = entity;
            if (rasb != null)
                this.ResolvedAttributeSetBuilder = rasb;
            else
                this.ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
        }

        internal ResolvedAttribute GetFirstAttribute()
        {
            if (this.ResolvedAttributeSetBuilder?.ResolvedAttributeSet?.Set?.Count > 0)
                return this.ResolvedAttributeSetBuilder.ResolvedAttributeSet.Set[0];
            return null;
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent, bool nameSort)
        {
            to.SpewLine($"{indent} ent={this.Entity?.GetName()}");
            if (this.ResolvedAttributeSetBuilder?.ResolvedAttributeSet != null)
            {
                this.ResolvedAttributeSetBuilder.ResolvedAttributeSet.Spew(resOpt, to, indent + "  atts:", nameSort);
            }
        }
    }
}
