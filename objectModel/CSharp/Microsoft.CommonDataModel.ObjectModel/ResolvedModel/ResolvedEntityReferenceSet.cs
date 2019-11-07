//-----------------------------------------------------------------------
// <copyright file="ResolvedEntityReferenceSet.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class ResolvedEntityReferenceSet
    {
        internal List<ResolvedEntityReference> Set { get; set; }
        ResolveOptions ResOpt { get; set; }

        internal ResolvedEntityReferenceSet(ResolveOptions resOpt, List<ResolvedEntityReference> set = null)
        {
            this.ResOpt = resOpt;
            if (set != null)
            {
                this.Set = set;
            }
            else
                this.Set = new List<ResolvedEntityReference>();
        }

        public void Add(ResolvedEntityReferenceSet toAdd)
        {
            if (toAdd?.Set?.Count > 0)
            {
                this.Set.AddRange(toAdd.Set);
            }
        }

        public ResolvedEntityReferenceSet Copy()
        {
            List<ResolvedEntityReference> newSet = new List<ResolvedEntityReference>(this.Set);
            for (int i = 0; i < newSet.Count; i++)
            {
                newSet[i] = newSet[i].Copy();
            }
            return new ResolvedEntityReferenceSet(this.ResOpt, newSet);
        }

        public ResolvedEntityReferenceSet FindEntity(CdmEntityDefinition entOther)
        {
            // make an array of just the refs that include the requested
            List<ResolvedEntityReference> filter = new List<ResolvedEntityReference>();
            foreach (ResolvedEntityReference rer in this.Set)
            {
                if (rer.Referenced.Where(rers => rers.Entity == entOther).Any())
                {
                    filter.Add(rer);
                }
            }

            if (filter.Count == 0)
                return null;
            return new ResolvedEntityReferenceSet(this.ResOpt, filter);
        }

        internal void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent, bool nameSort)
        {
            List<ResolvedEntityReference> list = new List<ResolvedEntityReference>(this.Set);
            if (nameSort)
            {
                list.Sort((l, r) => {
                    if (l.Referenced?.Count > 0)
                    {
                        if (r.Referenced?.Count > 0)
                        {
                            return string.Compare(l.Referenced[0].Entity?.GetName(), r.Referenced[0].Entity?.GetName(), StringComparison.OrdinalIgnoreCase);
                        }
                        return 1;
                    }
                    return -1;
                });
            }
            for (int i = 0; i < this.Set.Count; i++)
            {
                list[i].Spew(resOpt, to, indent + $"(rer[{i}])", nameSort);
            }
        }
    }
}
