//-----------------------------------------------------------------------
// <copyright file="ResolvedAttributeSet.cs" company="Microsoft">
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

    internal class ResolvedAttributeSet : RefCounted
    {
        private IDictionary<string, ResolvedAttribute> ResolvedName2resolvedAttribute;
        private IDictionary<string, HashSet<ResolvedAttribute>> BaseTrait2Attributes;
        internal IDictionary<ResolvedAttribute, HashSet<CdmAttributeContext>> Ra2attCtxSet;
        internal IDictionary<CdmAttributeContext, ResolvedAttribute> AttCtx2ra;
        internal List<ResolvedAttribute> Set { get; set; }
        public CdmAttributeContext AttributeContext;
        public int InsertOrder { get; set; }

        public ResolvedAttributeSet()
                : base()
        {
            this.ResolvedName2resolvedAttribute = new Dictionary<string, ResolvedAttribute>();
            this.Ra2attCtxSet = new Dictionary<ResolvedAttribute, HashSet<CdmAttributeContext>>();
            this.AttCtx2ra = new Dictionary<CdmAttributeContext, ResolvedAttribute>();
            this.Set = new List<ResolvedAttribute>();
        }

        public CdmAttributeContext CreateAttributeContext(ResolveOptions resOpt, AttributeContextParameters acp)
        {
            if (acp == null)
                return null;

            // store the current context
            this.AttributeContext = CdmAttributeContext.CreateChildUnder(resOpt, acp);
            return this.AttributeContext;
        }

        internal void CacheAttributeContext(CdmAttributeContext attCtx, ResolvedAttribute ra)
        {
            this.AttCtx2ra.Add(attCtx, ra);
            // set collection will take care of adding context to set
            if (!this.Ra2attCtxSet.ContainsKey(ra))
                this.Ra2attCtxSet.Add(ra, new HashSet<CdmAttributeContext>());
            this.Ra2attCtxSet[ra].Add(attCtx);
        }

        internal ResolvedAttributeSet Merge(ResolvedAttribute toMerge, CdmAttributeContext attCtx = null)
        {
            ResolvedAttributeSet rasResult = this;
            if (toMerge != null)
            {
                if (rasResult.ResolvedName2resolvedAttribute.ContainsKey(toMerge.ResolvedName))
                {
                    ResolvedAttribute existing = rasResult.ResolvedName2resolvedAttribute[toMerge.ResolvedName];
                    if (this.RefCnt > 1 && existing.Target != toMerge.Target)
                    {
                        rasResult = rasResult.Copy(); // copy on write
                        existing = rasResult.ResolvedName2resolvedAttribute[toMerge.ResolvedName];
                    }
                    existing.Target = toMerge.Target; // replace with newest version
                    existing.Arc = toMerge.Arc;

                    ResolvedTraitSet rtsMerge = existing.ResolvedTraits.MergeSet(toMerge.ResolvedTraits); // newest one may replace
                    if (rtsMerge != existing.ResolvedTraits)
                    {
                        rasResult = rasResult.Copy(); // copy on write
                        existing = rasResult.ResolvedName2resolvedAttribute[toMerge.ResolvedName];
                        existing.ResolvedTraits = rtsMerge;
                    }
                }
                else
                {
                    if (this.RefCnt > 1)
                        rasResult = rasResult.Copy(); // copy on write
                    if (rasResult == null)
                        rasResult = this;
                    rasResult.ResolvedName2resolvedAttribute.Add(toMerge.ResolvedName, toMerge);
                    // don't use the attCtx on the actual attribute, that's only for doing appliers
                    if (attCtx != null)
                        rasResult.CacheAttributeContext(attCtx, toMerge);
                    //toMerge.InsertOrder = rasResult.Set.Count;
                    rasResult.Set.Add(toMerge);
                }
                this.BaseTrait2Attributes = null;
            }
            return rasResult;
        }

        internal void AlterSetOrderAndScope(List<ResolvedAttribute> newSet)
        {
            // assumption is that newSet contains only some or all attributes from the original value of Set. 
            // if not, the stored attribute context mappings are busted
            this.BaseTrait2Attributes = null;
            this.ResolvedName2resolvedAttribute = new Dictionary<string, ResolvedAttribute>(); // rebuild with smaller set
            this.Set = newSet;
            foreach (ResolvedAttribute ra in newSet)
            {
                ResolvedName2resolvedAttribute.Add(ra.ResolvedName, ra);
            }
        }

        internal void CopyAttCtxMappingsInto(IDictionary<ResolvedAttribute, HashSet<CdmAttributeContext>> ra2attCtxSet, IDictionary<CdmAttributeContext, ResolvedAttribute> attCtx2ra, ResolvedAttribute sourceRa, ResolvedAttribute newRa = null)
        {
            if (this.Ra2attCtxSet.Count > 0)
            {
                if (newRa == null)
                    newRa = sourceRa;
                // get the set of attribute contexts for the old resolved attribute
                this.Ra2attCtxSet.TryGetValue(sourceRa, out HashSet<CdmAttributeContext> attCtxSet);
                if (attCtxSet != null)
                {
                    // map the new resolved attribute to the old context set
                    ra2attCtxSet.Add(newRa, attCtxSet);
                    // map the old contexts to the new resolved attribute
                    if (attCtxSet.Count > 0)
                    {
                        foreach (CdmAttributeContext attCtx in attCtxSet)
                            attCtx2ra[attCtx] = newRa;
                    }
                }
            }
        }

        public ResolvedAttributeSet MergeSet(ResolvedAttributeSet toMerge)
        {
            ResolvedAttributeSet rasResult = this;
            if (toMerge != null)
            {
                int l = toMerge.Set.Count;
                for (int i = 0; i < l; i++)
                {
                    // don't pass in the context here
                    ResolvedAttributeSet rasMerged = rasResult.Merge(toMerge.Set[i]);
                    if (rasMerged != rasResult)
                    {
                        rasResult = rasMerged;
                    }
                    // copy context here
                    toMerge.CopyAttCtxMappingsInto(rasResult.Ra2attCtxSet, rasResult.AttCtx2ra, toMerge.Set[i]);
                }
            }
            return rasResult;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //  traits that change attributes
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        internal ResolvedAttributeSet ApplyTraits(ResolvedTraitSet traits, CdmAttributeResolutionGuidance resGuide, List<AttributeResolutionApplier> actions)
        {
            ResolvedAttributeSet rasResult = this;
            ResolvedAttributeSet rasApplied;

            if (this.RefCnt > 1 && rasResult.CopyNeeded(traits, resGuide, actions))
            {
                rasResult = rasResult.Copy();
            }
            rasApplied = rasResult.Apply(traits, resGuide, actions);

            // now we are that
            rasResult.ResolvedName2resolvedAttribute = rasApplied.ResolvedName2resolvedAttribute;
            rasResult.BaseTrait2Attributes = null;
            rasResult.Set = rasApplied.Set;
            rasResult.Ra2attCtxSet = rasApplied.Ra2attCtxSet;
            rasResult.AttCtx2ra = rasApplied.AttCtx2ra;

            return rasResult;
        }

        bool CopyNeeded(ResolvedTraitSet traits, CdmAttributeResolutionGuidance resGuide, List<AttributeResolutionApplier> actions)
        {
            if (actions == null || actions.Count == 0)
            {
                return false;
            }

            // for every attribute in the set, detect if a merge of traits will alter the traits. if so, need to copy the attribute set to avoid overwrite 
            int l = this.Set.Count;
            for (int i = 0; i < l; i++)
            {
                ResolvedAttribute resAtt = this.Set[i];
                foreach (var currentTraitAction in actions)
                {
                    ApplierContext ctx = new ApplierContext { ResOpt = traits.ResOpt, ResAttSource = resAtt, ResGuide = resGuide };
                    if (currentTraitAction.WillAttributeModify(ctx))
                        return true;
                }
            }
            return false;
        }

        ResolvedAttributeSet Apply(ResolvedTraitSet traits, CdmAttributeResolutionGuidance resGuide, List<AttributeResolutionApplier> actions)
        {
            if (traits == null && actions.Count == 0)
            {
                // nothing can change
                return this;
            }

            // for every attribute in the set run any attribute appliers
            ResolvedAttributeSet appliedAttSet = new ResolvedAttributeSet();
            int l = this.Set.Count;
            appliedAttSet.AttributeContext = this.AttributeContext;

            // check to see if we need to make a copy of the attributes
            // do this when building an attribute context and when we will modify the attributes (beyond traits)
            // see if any of the appliers want to modify
            bool makingCopy = false;
            if (l > 0 && appliedAttSet.AttributeContext != null && actions != null && actions.Count > 0)
            {
                ResolvedAttribute resAttTest = this.Set[0];
                foreach (AttributeResolutionApplier traitAction in actions)
                {
                    ApplierContext ctx = new ApplierContext { ResOpt = traits.ResOpt, ResAttSource = resAttTest, ResGuide = resGuide };
                    if (traitAction.WillAttributeModify(ctx) == true)
                    {
                        makingCopy = true;
                        break;
                    }
                }
            }

            if (makingCopy)
            {
                // fake up a generation round for these copies that are about to happen
                AttributeContextParameters acp = new AttributeContextParameters
                {
                    under = appliedAttSet.AttributeContext,
                    type = Enums.CdmAttributeContextType.GeneratedSet,
                    Name = "_generatedAttributeSet"

                };
                appliedAttSet.AttributeContext = CdmAttributeContext.CreateChildUnder(traits.ResOpt, acp);
                acp = new AttributeContextParameters
                {
                    under = appliedAttSet.AttributeContext,
                    type = Enums.CdmAttributeContextType.GeneratedRound,
                    Name = "_generatedAttributeRound0"
                };
                appliedAttSet.AttributeContext = CdmAttributeContext.CreateChildUnder(traits.ResOpt, acp);
            }
            for (int i = 0; i < l; i++)
            {
                ResolvedAttribute resAtt = this.Set[i];
                ResolvedAttributeSet subSet = resAtt.Target as ResolvedAttributeSet;
                CdmAttributeContext attCtxToMerge = null;
                if (subSet?.Set != null)
                {
                    if (makingCopy)
                        resAtt = resAtt.Copy();

                    // the set contains another set. process those
                    resAtt.Target = subSet.Apply(traits, resGuide, actions);
                }
                else
                {
                    ResolvedTraitSet rtsMerge = resAtt.ResolvedTraits.MergeSet(traits);
                    resAtt.ResolvedTraits = rtsMerge;
                    if (actions != null)
                    {
                        foreach (AttributeResolutionApplier traitAction in actions)
                        {
                            ApplierContext ctx = new ApplierContext { ResOpt = traits.ResOpt, ResAttSource = resAtt, ResGuide = resGuide };
                            if (traitAction.WillAttributeModify(ctx) == true)
                            {
                                // make a context for this new copy
                                if (makingCopy)
                                {
                                    AttributeContextParameters acp = new AttributeContextParameters
                                    {
                                        under = appliedAttSet.AttributeContext,
                                        type = Enums.CdmAttributeContextType.AttributeDefinition,
                                        Name = resAtt.ResolvedName,
                                        Regarding = resAtt.Target
                                    };
                                    ctx.AttCtx = CdmAttributeContext.CreateChildUnder(traits.ResOpt, acp);
                                    attCtxToMerge = ctx.AttCtx as CdmAttributeContext;
                                }

                                // make a copy of the resolved att 
                                if (makingCopy)
                                    resAtt = resAtt.Copy();

                                ctx.ResAttSource = resAtt;
                                // modify it
                                traitAction.DoAttributeModify(ctx);
                            }
                        }
                    }
                }
                appliedAttSet.Merge(resAtt, attCtxToMerge);
            }

            appliedAttSet.AttributeContext = this.AttributeContext;

            if (!makingCopy)
            {
                // didn't copy the attributes or make any new context, so just take the old ones
                appliedAttSet.Ra2attCtxSet = this.Ra2attCtxSet;
                appliedAttSet.AttCtx2ra = this.AttCtx2ra;
            }

            return appliedAttSet;
        }

        public ResolvedAttributeSet RemoveRequestedAtts(Marker marker)
        {
            int countIndex = marker.CountIndex;
            int markIndex = marker.MarkIndex;

            // for every attribute in the set run any attribute removers on the traits they have
            ResolvedAttributeSet appliedAttSet = new ResolvedAttributeSet();
            int l = this.Set.Count;
            for (int iAtt = 0; iAtt < l; iAtt++)
            {
                ResolvedAttribute resAtt = this.Set[iAtt];
                // possible for another set to be in this set
                ResolvedAttributeSet subSet = resAtt.Target as ResolvedAttributeSet;
                if (subSet?.Set != null)
                {
                    // well, that happened. so now we go around again on this same function and get rid of things from this group
                    marker.CountIndex = countIndex;
                    marker.MarkIndex = markIndex;
                    ResolvedAttributeSet newSubSet = subSet.RemoveRequestedAtts(marker);
                    countIndex = marker.CountIndex;
                    markIndex = marker.MarkIndex;
                    // replace the set with the new one that came back
                    resAtt.Target = newSubSet;
                    // if everything went away, then remove this group
                    if (newSubSet?.Set == null || newSubSet.Set.Count == 0)
                    {
                        resAtt = null;
                    }
                    else
                    {
                        // don't count this as an attribute (later)
                        countIndex--;
                    }
                }
                else
                {
                    // this is a good time to make the resolved names final
                    resAtt.previousResolvedName = resAtt.ResolvedName;
                    if (resAtt.Arc != null && resAtt.Arc.ApplierCaps != null && resAtt.Arc.ApplierCaps.CanRemove)
                    {
                        foreach (AttributeResolutionApplier apl in resAtt.Arc.ActionsRemove)
                        {
                            // this should look like the applier context when the att was created
                            ApplierContext ctx = new ApplierContext() { ResOpt = resAtt.Arc.ResOpt, ResAttSource = resAtt, ResGuide = resAtt.Arc.ResGuide };
                            if (apl.WillRemove(ctx))
                            {
                                resAtt = null;
                                break;
                            }
                        }
                    }
                }
                if (resAtt != null)
                {
                    // attribute remains
                    // are we building a new set?
                    if (appliedAttSet != null)
                    {
                        this.CopyAttCtxMappingsInto(appliedAttSet.Ra2attCtxSet, appliedAttSet.AttCtx2ra, resAtt);
                        appliedAttSet.Merge(resAtt);
                    }
                    countIndex++;
                }
                else
                {
                    // remove the att
                    // if this is the first removed attribute, then make a copy of the set now
                    // after this point, the rest of the loop logic keeps the copy going as needed
                    if (appliedAttSet == null)
                    {
                        appliedAttSet = new ResolvedAttributeSet();
                        for (int iCopy = 0; iCopy < iAtt; iCopy++)
                        {
                            this.CopyAttCtxMappingsInto(appliedAttSet.Ra2attCtxSet, appliedAttSet.AttCtx2ra, this.Set[iCopy]);
                            appliedAttSet.Merge(this.Set[iCopy]);
                        }
                    }
                    // track deletes under the mark (move the mark up)
                    if (countIndex < markIndex)
                        markIndex--;
                }
            }

            marker.CountIndex = countIndex;
            marker.MarkIndex = markIndex;

            // now we are that (or a copy)
            ResolvedAttributeSet rasResult = this;
            if (appliedAttSet != null && appliedAttSet.Size != rasResult.Size)
            {
                rasResult = appliedAttSet;
                rasResult.BaseTrait2Attributes = null;
                rasResult.AttributeContext = this.AttributeContext;
            }

            return rasResult;
        }

        internal ResolvedAttribute Get(string name)
        {
            if (this.ResolvedName2resolvedAttribute.ContainsKey(name))
                return this.ResolvedName2resolvedAttribute[name];

            ResolvedAttribute raFound = null;

            if (this.Set?.Count != null)
            {
                // deeper look. first see if there are any groups held in this group
                if (this.Set != null)
                {
                    foreach (ResolvedAttribute ra in this.Set)
                    {
                        if ((ra.Target as ResolvedAttributeSet)?.Set != null)
                        {
                            raFound = (ra.Target as ResolvedAttributeSet).Get(name);
                            if (raFound != null)
                                return raFound;
                        }
                    }
                    // nothing found that way, so now look through the attribute definitions for a match
                    foreach (ResolvedAttribute ra in this.Set)
                    {
                        CdmAttribute attLook = ra.Target as CdmAttribute;
                        if (attLook?.Name == name)
                        {
                            return ra;
                        }
                    }
                }
                return null;
            }
            return null;
        }

        public int Size
        {
            get
            {
                return this.ResolvedName2resolvedAttribute.Count;
            }
        }

        public ResolvedAttributeSet Copy()
        {
            ResolvedAttributeSet copy = new ResolvedAttributeSet();
            copy.AttributeContext = this.AttributeContext;
            int l = this.Set.Count;

            // save the mappings to overwrite
            // maps from merge may not be correct
            IDictionary<ResolvedAttribute, HashSet<CdmAttributeContext>> newRa2attCtxSet = new Dictionary<ResolvedAttribute, HashSet<CdmAttributeContext>>();
            IDictionary<CdmAttributeContext, ResolvedAttribute> newAttCtx2ra = new Dictionary<CdmAttributeContext, ResolvedAttribute>();

            for (int i = 0; i < l; i++)
            {
                ResolvedAttribute sourceRa = this.Set[i];
                ResolvedAttribute copyRa = sourceRa.Copy();

                this.CopyAttCtxMappingsInto(newRa2attCtxSet, newAttCtx2ra, sourceRa, copyRa);
                copy.Merge(copyRa);
            }
            // reset mappings to the correct one
            copy.Ra2attCtxSet = newRa2attCtxSet;
            copy.AttCtx2ra = newAttCtx2ra;

            return copy;
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent, bool nameSort)
        {
            if (this.Set.Count > 0)
            {
                List<ResolvedAttribute> list = new List<ResolvedAttribute>(this.Set);
                if (nameSort)
                {
                    list.Sort((l, r) => string.Compare(l.ResolvedName, r.ResolvedName, StringComparison.OrdinalIgnoreCase));
                }

                for (int i = 0; i < this.Set.Count; i++)
                {
                    list[i].Spew(resOpt, to, indent, nameSort);
                }
            }
        }

        public ResolvedAttributeSet FetchAttributesWithTraits(ResolveOptions resOpt, dynamic queryFor)
        {
            // put the input into a standard form
            List<TraitParamSpec> query = new List<TraitParamSpec>();
            if (queryFor.GetType() == typeof(List<TraitParamSpec>))
            {
                int l = queryFor.length;
                for (int i = 0; i < l; i++)
                {
                    dynamic q = queryFor[i];
                    if (q is string)
                        query.Add(new TraitParamSpec { TraitBaseName = q, Parameters = new Dictionary<string, string>() });
                    else
                        query.Add(q);
                }
            }
            else
            {
                if (queryFor is string)
                    query.Add(new TraitParamSpec { TraitBaseName = queryFor, Parameters = new Dictionary<string, string>() });
                else
                    query.Add(queryFor);
            }

            // if the map isn't in place, make one now. assumption is that this is called as part of a usage pattern where it will get called again.
            if (this.BaseTrait2Attributes == null)
            {
                this.BaseTrait2Attributes = new Dictionary<string, HashSet<ResolvedAttribute>>();
                int l = this.Set.Count;
                for (int i = 0; i < l; i++)
                {
                    // create a map from the name of every trait found in this whole set of attributes to the attributes that have the trait (included base classes of traits)
                    var resAtt = this.Set[i];
                    ISet<string> traitNames = resAtt.ResolvedTraits.CollectTraitNames();
                    foreach (string tName in traitNames)
                    {
                        if (!this.BaseTrait2Attributes.ContainsKey(tName))
                            this.BaseTrait2Attributes.Add(tName, new HashSet<ResolvedAttribute>());
                        this.BaseTrait2Attributes[tName].Add(resAtt);
                    }
                }
            }
            // for every trait in the query, get the set of attributes.
            // intersect these sets to get the final answer
            HashSet<ResolvedAttribute> finalSet = null;
            for (int i = 0; i < query.Count; i++)
            {
                var q = query[i];
                if (this.BaseTrait2Attributes.ContainsKey(q.TraitBaseName))
                {
                    var subSet = this.BaseTrait2Attributes[q.TraitBaseName];
                    if (q.Parameters?.Count > 0)
                    {
                        // need to check param values, so copy the subset to something we can modify 
                        HashSet<ResolvedAttribute> filteredSubSet = new HashSet<ResolvedAttribute>();
                        foreach (var ra in subSet)
                        {
                            ParameterValueSet pvals = ra.ResolvedTraits.Find(resOpt, q.TraitBaseName).ParameterValues;
                            // compare to all query params
                            int lParams = q.Parameters.Count;
                            int iParam = 0;
                            for (iParam = 0; iParam < lParams; iParam++)
                            {
                                var param = q.Parameters.ElementAt(iParam);
                                var pv = pvals.FetchParameterValueByName(param.Key);
                                if (pv == null || pv.FetchValueString(resOpt) != param.Value)
                                    break;
                            }

                            // stop early means no match
                            if (iParam == lParams)
                                filteredSubSet.Add(ra);
                        }

                        subSet = filteredSubSet;
                    }
                    if (subSet != null && subSet.Count > 0)
                    {
                        // got some. either use as starting point for answer or intersect this in
                        if (finalSet == null)
                            finalSet = subSet;
                        else
                        {
                            var intersection = new HashSet<ResolvedAttribute>();
                            // intersect the two
                            foreach (var ra in finalSet)
                            {
                                if (subSet.Contains(ra))
                                    intersection.Add(ra);
                            }

                            finalSet = intersection;
                        }
                    }
                }
            }

            // collect the final set into a resolvedAttributeSet
            if (finalSet != null && finalSet.Count > 0)
            {
                ResolvedAttributeSet rasResult = new ResolvedAttributeSet();
                foreach (ResolvedAttribute ra in finalSet)
                {
                    rasResult.Merge(ra);
                }
                return rasResult;
            }

            return null;
        }

        public class Marker
        {
            public int CountIndex { get; set; }
            public int MarkIndex { get; set; }
        }
    }
}
