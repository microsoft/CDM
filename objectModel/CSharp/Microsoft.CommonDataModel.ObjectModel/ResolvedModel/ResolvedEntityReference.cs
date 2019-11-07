//-----------------------------------------------------------------------
// <copyright file="ResolvedEntityReference.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    internal class ResolvedEntityReference
    {
        public ResolvedEntityReferenceSide Referencing { get; set; }
        public List<ResolvedEntityReferenceSide> Referenced;

        public ResolvedEntityReference()
        {
            this.Referencing = new ResolvedEntityReferenceSide(null, null);
            this.Referenced = new List<ResolvedEntityReferenceSide>();
        }

        public ResolvedEntityReference Copy()
        {
            ResolvedEntityReference result = new ResolvedEntityReference();
            result.Referencing.Entity = this.Referencing.Entity;
            result.Referencing.ResolvedAttributeSetBuilder = this.Referencing.ResolvedAttributeSetBuilder;
            foreach (ResolvedEntityReferenceSide rers in this.Referenced)
            {
                result.Referenced.Add(new ResolvedEntityReferenceSide(rers.Entity, rers.ResolvedAttributeSetBuilder));
            }
            return result;
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent, bool nameSort)
        {
            this.Referencing.Spew(resOpt, to, indent + "(referencing)", nameSort);
            List<ResolvedEntityReferenceSide> list = new List<ResolvedEntityReferenceSide>(this.Referenced);
            if (nameSort)
            {
                list.Sort((l, r) => string.Compare(l.Entity?.GetName(), r.Entity?.GetName(), StringComparison.OrdinalIgnoreCase));
            }

            for (int i = 0; i < this.Referenced.Count; i++)
            {
                list[i].Spew(resOpt, to, indent + $"(referenced[{i}])", nameSort);
            }
        }
    }
}
