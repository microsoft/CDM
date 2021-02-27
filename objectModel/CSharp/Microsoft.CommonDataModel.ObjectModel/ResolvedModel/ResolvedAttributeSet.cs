// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.RegularExpressions;

    internal class ResolvedAttributeSet : RefCounted
    {
        private IDictionary<string, ResolvedAttribute> ResolvedName2resolvedAttribute;
        private IDictionary<string, HashSet<ResolvedAttribute>> BaseTrait2Attributes;
        // this maps the the name of an owner (an entity attribute) to a set of the attributes names that were added because of that entAtt
        // used in the entity attribute code to decide when previous (inherit) attributes from an entAtt with the same name might need to be removed
        internal IDictionary<string, HashSet<string>> AttributeOwnershipMap; 
        private List<ResolvedAttribute> _set { get; set; }
        internal List<ResolvedAttribute> Set
        {
            get
            {
                return _set;
            }
            set
            {
                this.ResolvedAttributeCount = value.Sum(att => att.ResolvedAttributeCount);
                this._set = value;
            }
        }
        // we need this instead of checking the size of the set because there may be attributes
        // nested in an attribute group and we need each of those attributes counted here as well
        internal int ResolvedAttributeCount { get; set; }
        // indicates the depth level that this set was resolved at.
        // resulting set can vary depending on the maxDepth value
        internal int DepthTraveled { get; set; }
        public CdmAttributeContext AttributeContext;
        public int InsertOrder { get; set; }

        public ResolvedAttributeSet()
                : base()
        {
            this.ResolvedName2resolvedAttribute = new Dictionary<string, ResolvedAttribute>();
            this.Set = new List<ResolvedAttribute>();
            this.ResolvedAttributeCount = 0;
            this.DepthTraveled = 0;
        }

        public CdmAttributeContext CreateAttributeContext(ResolveOptions resOpt, AttributeContextParameters acp)
        {
            if (acp == null)
                return null;

            // store the current context
            this.AttributeContext = CdmAttributeContext.CreateChildUnder(resOpt, acp);
            return this.AttributeContext;
        }

        internal ResolvedAttributeSet Merge(ResolvedAttribute toMerge)
        {
            ResolvedAttributeSet rasResult = this;
            if (toMerge != null)
            {
                // if there is already a resolve attribute present, remove it before adding the new attribute
                if (rasResult.ResolvedName2resolvedAttribute.ContainsKey(toMerge.ResolvedName))
                {
                    ResolvedAttribute existing = rasResult.ResolvedName2resolvedAttribute[toMerge.ResolvedName];
                    if (existing != toMerge)
                    {
                        if (this.RefCnt > 1 && existing.Target != toMerge.Target)
                        {
                            rasResult = rasResult.Copy(); // copy on write
                            existing = rasResult.ResolvedName2resolvedAttribute[toMerge.ResolvedName];
                        }
                        else
                        {
                            rasResult = this;
                        }

                        if (existing.Target is CdmAttribute)
                            rasResult.ResolvedAttributeCount -= existing.Target.AttributeCount;
                        else if (existing.Target is ResolvedAttributeSet)
                            rasResult.ResolvedAttributeCount -= existing.Target.ResolvedAttributeCount;

                        if (toMerge.Target is CdmAttribute)
                            rasResult.ResolvedAttributeCount += toMerge.Target.AttributeCount;
                        else if (toMerge.Target is ResolvedAttributeSet)
                            rasResult.ResolvedAttributeCount += toMerge.Target.ResolvedAttributeCount;

                        existing.Target = toMerge.Target; // replace with newest version
                        existing.Arc = toMerge.Arc;

                        // merge a new ra into one with the same name, so make a lineage
                        // the existing attCtx becomes the new lineage. but the old one needs to stay too... so you get both. it came from both places.
                        // we need ONE place where this RA can point, so that will be the most recent place with a fixed lineage
                        // A->C1->C0 gets merged with A'->C2->C3 that turns into A->C2->[(c3), (C1->C0)]. in the more simple case this is just A->C2->C1
                        if (toMerge.AttCtx != null)
                        {
                            if (existing.AttCtx != null)
                            {
                                toMerge.AttCtx.AddLineage(existing.AttCtx);
                            }
                            existing.AttCtx = toMerge.AttCtx;
                        }

                        ResolvedTraitSet rtsMerge = existing.ResolvedTraits.MergeSet(toMerge.ResolvedTraits); // newest one may replace
                        if (rtsMerge != existing.ResolvedTraits)
                        {
                            rasResult = rasResult.Copy(); // copy on write
                            existing = rasResult.ResolvedName2resolvedAttribute[toMerge.ResolvedName];
                            existing.ResolvedTraits = rtsMerge;
                        }
                    }
                }
                else
                {
                    if (this.RefCnt > 1)
                        rasResult = rasResult.Copy(); // copy on write
                    if (rasResult == null)
                        rasResult = this;
                    rasResult.ResolvedName2resolvedAttribute.Add(toMerge.ResolvedName, toMerge);
                    //toMerge.InsertOrder = rasResult.Set.Count;
                    rasResult.Set.Add(toMerge);
                    rasResult.ResolvedAttributeCount += toMerge.ResolvedAttributeCount;
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
                if (!ResolvedName2resolvedAttribute.ContainsKey(ra.ResolvedName))
                    ResolvedName2resolvedAttribute.Add(ra.ResolvedName, ra);
            }
        }


        public ResolvedAttributeSet MergeSet(ResolvedAttributeSet toMerge)
        {
            ResolvedAttributeSet rasResult = this;
            if (toMerge != null)
            {
                foreach (ResolvedAttribute ra in toMerge.Set)
                {
                    // don't pass in the context here
                    ResolvedAttributeSet rasMerged = rasResult.Merge(ra);
                    if (rasMerged != rasResult)
                    {
                        rasResult = rasMerged;
                    }
                    // get the attribute from the merged set, attributes that were already present were merged, not replaced
                    rasResult.ResolvedName2resolvedAttribute.TryGetValue(ra.ResolvedName, out ResolvedAttribute currentRa);
                }
                // merge the ownership map. 
                if (toMerge.AttributeOwnershipMap != null)
                {
                    if (this.AttributeOwnershipMap == null)
                    {
                        this.AttributeOwnershipMap = new Dictionary<string, HashSet<string>>();
                    }
                    foreach(var newPair in toMerge.AttributeOwnershipMap)
                    {
                        // always take the new one as the right list, not sure if the constructor for dictionary uses this logic or fails 
                        this.AttributeOwnershipMap[newPair.Key] = newPair.Value;
                    }
                }

            }
            return rasResult;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //  traits that change attributes
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        internal ResolvedAttributeSet ApplyTraits(ResolvedTraitSet traits, ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide, List<AttributeResolutionApplier> actions)
        {
            ResolvedAttributeSet rasResult = this;
            ResolvedAttributeSet rasApplied;

            if (this.RefCnt > 1 && rasResult.CopyNeeded(traits, resOpt, resGuide, actions))
            {
                rasResult = rasResult.Copy();
            }
            rasApplied = rasResult.Apply(traits, resOpt, resGuide, actions);

            // now we are that
            rasResult.ResolvedName2resolvedAttribute = rasApplied.ResolvedName2resolvedAttribute;
            rasResult.BaseTrait2Attributes = null;
            rasResult.Set = rasApplied.Set;

            return rasResult;
        }

        bool CopyNeeded(ResolvedTraitSet traits, ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide, List<AttributeResolutionApplier> actions)
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
                    ApplierContext ctx = new ApplierContext { ResOpt = resOpt, ResAttSource = resAtt, ResGuide = resGuide };
                    if (currentTraitAction.WillAttributeModify(ctx))
                        return true;
                }
            }
            return false;
        }

        ResolvedAttributeSet Apply(ResolvedTraitSet traits, ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide, List<AttributeResolutionApplier> actions)
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
                    ApplierContext ctx = new ApplierContext { ResOpt = resOpt, ResAttSource = resAttTest, ResGuide = resGuide };
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
                CdmAttributeContext attCtxToMerge = resAtt.AttCtx; // start with the current context for the resolved att, if a copy happens this will change 
                if (resAtt.Target is ResolvedAttributeSet subSet)
                {
                    if (makingCopy)
                    {
                        resAtt = resAtt.Copy();
                        // making a copy of a subset (att group) also bring along the context tree for that whole group
                        attCtxToMerge = resAtt.AttCtx;
                    }
                    // the set contains another set. process those
                    resAtt.Target = subSet.Apply(traits, resOpt, resGuide, actions);
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
                                {
                                    resAtt = resAtt.Copy();
                                    attCtxToMerge.AddLineage(resAtt.AttCtx);
                                    resAtt.AttCtx = attCtxToMerge;
                                }

                                ctx.ResAttSource = resAtt;
                                // modify it
                                traitAction.DoAttributeModify(ctx);
                            }
                        }
                    }
                }
                appliedAttSet.Merge(resAtt);
            }

            appliedAttSet.AttributeContext = this.AttributeContext;

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
                    resAtt.PreviousResolvedName = resAtt.ResolvedName;
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

            for (int i = 0; i < l; i++)
            {
                ResolvedAttribute sourceRa = this.Set[i];
                ResolvedAttribute copyRa = sourceRa.Copy();
                copy.Merge(copyRa);
            }

            // copy the ownership map. new map will point at old att lists, but we never update these lists, only make new ones, so all is well
            if (this.AttributeOwnershipMap != null)
            {
                copy.AttributeOwnershipMap = new Dictionary<string, HashSet<string>>(this.AttributeOwnershipMap);
            }
            copy.DepthTraveled = this.DepthTraveled;

            return copy;
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent, bool nameSort)
        {
            if (this.Set.Count > 0)
            {
                List<ResolvedAttribute> list = new List<ResolvedAttribute>(this.Set);
                if (nameSort)
                {
                    list = this.Set.OrderBy(att => Regex.Replace(att.ResolvedName.ToLowerInvariant(), "[^a-zA-Z0-9.]+", "", RegexOptions.Compiled)).ToList();
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
                            ParameterValueSet pvals = ra.ResolvedTraits.Find(resOpt, q.TraitBaseName)?.ParameterValues;
                            if (pvals != null)
                            {
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

        /// <summary>
        /// everything in this set now 'belongs' to the specified owner
        /// </summary>
        /// <param name="ownerName"></param>
        internal void SetAttributeOwnership(string ownerName)
        {
            if (this.Set != null && this.Set.Count > 0)
            {
                this.AttributeOwnershipMap = new Dictionary<string, HashSet<string>>();
                var nameSet = new HashSet<string>(this.ResolvedName2resolvedAttribute.Keys); // this map should always be up to date, so fair to use as a source of all names
                this.AttributeOwnershipMap.Add(ownerName, nameSet);
            }
        }

        internal void MarkOrphansForRemoval(string ownerName, ResolvedAttributeSet rasNewOnes)
        {
            if (this.AttributeOwnershipMap == null)
            {
                return;
            }
            if (!this.AttributeOwnershipMap.ContainsKey(ownerName))
            {
                return;
            }

            var lastSet = this.AttributeOwnershipMap[ownerName]; 

            // make a list of all atts from last time with this owner, remove the ones that show up now
            var thoseNotRepeated = new HashSet<string>(lastSet);
            // of course, if none show up, all must go
            if (rasNewOnes != null && rasNewOnes.Set != null && rasNewOnes.Set.Count > 0)
            {
                foreach (var newOne in rasNewOnes.Set)
                {
                    if (lastSet.Contains(newOne.ResolvedName))
                    {
                        // congrats, you are not doomed
                        thoseNotRepeated.Remove(newOne.ResolvedName);
                    }
                }
            }
            // anyone left must be marked for remove
            var fixedArcs = new HashSet<AttributeResolutionContext>(); // to avoid checking if we need to fix the same thing many times
            foreach(string toRemove in thoseNotRepeated)
            {
                var raDoomed = this.ResolvedName2resolvedAttribute[toRemove];

                if (raDoomed.Arc != null)
                {
                    // to remove these, need to have our special remover thing in the set of actions
                    if (!fixedArcs.Contains(raDoomed.Arc))
                    {
                        fixedArcs.Add(raDoomed.Arc); // not again
                        if (raDoomed.Arc.ApplierCaps.CanRemove == true)
                        {
                            // don't add more than once.
                            if (!raDoomed.Arc.ActionsRemove.Contains(PrimitiveAppliers.isRemovedInternal))
                            {
                                raDoomed.Arc.ActionsRemove.Add(PrimitiveAppliers.isRemovedInternal);
                            }
                        }
                        else
                        {
                            raDoomed.Arc.ActionsRemove.Add(PrimitiveAppliers.isRemovedInternal);
                            raDoomed.Arc.ApplierCaps.CanRemove = true;
                        }
                    }
                    // mark the att in the state
                    if (raDoomed.ApplierState == null)
                    {
                        raDoomed.ApplierState = new ApplierState();
                    }
                    raDoomed.ApplierState.Flex_remove = true;
                }
            }
        }
    }
}
