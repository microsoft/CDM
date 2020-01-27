//-----------------------------------------------------------------------
// <copyright file="ResolvedAttributeSetBuilder.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;
    using static Microsoft.CommonDataModel.ObjectModel.ResolvedModel.ResolvedAttributeSet;

    public class AttributeResolutionContext
    {
        public List<AttributeResolutionApplier> ActionsModify;
        public List<AttributeResolutionApplier> ActionsGroupAdd;
        public List<AttributeResolutionApplier> ActionsRoundAdd;
        public List<AttributeResolutionApplier> ActionsAttributeAdd;
        public List<AttributeResolutionApplier> ActionsRemove;
        internal ResolvedTraitSet TraitsToApply;
        internal AttributeResolutionApplierCapabilities ApplierCaps;
        public CdmAttributeResolutionGuidance ResGuide;
        public ResolveOptions ResOpt;

        internal AttributeResolutionContext(ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide, ResolvedTraitSet traits)
        {
            // collect a set of appliers for all traits
            this.TraitsToApply = traits;
            this.ResGuide = resGuide;
            this.ResOpt = resOpt;

            this.ActionsModify = new List<AttributeResolutionApplier>();
            this.ActionsGroupAdd = new List<AttributeResolutionApplier>();
            this.ActionsRoundAdd = new List<AttributeResolutionApplier>();
            this.ActionsAttributeAdd = new List<AttributeResolutionApplier>();
            this.ActionsRemove = new List<AttributeResolutionApplier>();
            this.ApplierCaps = null;

            this.ResOpt = CdmObjectBase.CopyResolveOptions(resOpt);

            if (resGuide != null)
            {
                
                    if (this.ApplierCaps == null)
                        this.ApplierCaps = new AttributeResolutionApplierCapabilities()
                        {
                            CanAlterDirectives = false,
                            CanCreateContext = false,
                            CanRemove = false,
                            CanAttributeModify = false,
                            CanGroupAdd = false,
                            CanRoundAdd = false,
                            CanAttributeAdd = false
                        };
                Func<AttributeResolutionApplier, bool> addApplier = (AttributeResolutionApplier apl) =>
                {

                    // Collect the code that will perform the right action.
                    // Associate with the resolved trait and get the priority
                    if (apl.WillAttributeModify != null && apl.DoAttributeModify != null)
                    {
                        this.ActionsModify.Add(apl);
                        this.ApplierCaps.CanAttributeModify = true;
                    }
                    if (apl.WillAttributeAdd != null && apl.DoAttributeAdd != null)
                    {
                        this.ActionsAttributeAdd.Add(apl);
                        this.ApplierCaps.CanAttributeAdd = true;
                    }
                    if (apl.WillGroupAdd != null && apl.DoGroupAdd != null)
                    {
                        this.ActionsGroupAdd.Add(apl);
                        this.ApplierCaps.CanGroupAdd = true;
                    }
                    if (apl.WillRoundAdd != null && apl.DoRoundAdd != null)
                    {
                        this.ActionsRoundAdd.Add(apl);
                        this.ApplierCaps.CanRoundAdd = true;
                    }
                    if (apl.WillAlterDirectives != null && apl.DoAlterDirectives != null)
                    {
                        this.ApplierCaps.CanAlterDirectives = true;
                        apl.DoAlterDirectives(this.ResOpt, resGuide);
                    }
                    if (apl.WillCreateContext != null && apl.DoCreateContext != null)
                    {
                        this.ApplierCaps.CanCreateContext = true;
                    }
                    if (apl.WillRemove != null)
                    {
                        this.ActionsRemove.Add(apl);
                        this.ApplierCaps.CanRemove = true;
                    }
                    return true;
                };

                if (resGuide.removeAttribute == true)
                    addApplier(PrimitiveAppliers.isRemoved);
                if (resGuide.imposedDirectives != null)
                    addApplier(PrimitiveAppliers.doesImposeDirectives);
                if (resGuide.removedDirectives != null)
                    addApplier(PrimitiveAppliers.doesRemoveDirectives);
                if (resGuide.addSupportingAttribute != null)
                    addApplier(PrimitiveAppliers.doesAddSupportingAttribute);
                if (resGuide.renameFormat != null)
                    addApplier(PrimitiveAppliers.doesDisambiguateNames);
                if (resGuide.cardinality == "many")
                    addApplier(PrimitiveAppliers.doesExplainArray);
                if (resGuide.entityByReference != null)
                {
                    addApplier(PrimitiveAppliers.doesReferenceEntityVia);
                }

                if (resGuide.selectsSubAttribute != null && resGuide.selectsSubAttribute.selects == "one")
                    addApplier(PrimitiveAppliers.doesSelectAttributes);

                // sorted by priority
                this.ActionsModify.Sort((l, r) => l.Priority - r.Priority);
                this.ActionsGroupAdd.Sort((l, r) => l.Priority - r.Priority);
                this.ActionsRoundAdd.Sort((l, r) => l.Priority - r.Priority);
                this.ActionsAttributeAdd.Sort((l, r) => l.Priority - r.Priority);

            }
        }

    }

    internal class ResolvedAttributeSetBuilder
    {
        internal ResolvedAttributeSet ResolvedAttributeSet { get; set; }
        public int InheritedMark { get; set; }

        public ResolvedAttributeSetBuilder()
        {
            this.ResolvedAttributeSet = new ResolvedAttributeSet();
        }

        internal void MergeAttributes(ResolvedAttributeSet rasNew)
        {
            if (rasNew != null)
                this.TakeReference(this.ResolvedAttributeSet.MergeSet(rasNew));
        }

        internal void TakeReference(ResolvedAttributeSet rasNew)
        {
            if (this.ResolvedAttributeSet != rasNew)
            {
                if (rasNew != null)
                    rasNew.AddRef();
                if (this.ResolvedAttributeSet != null)
                    this.ResolvedAttributeSet.Release();
                this.ResolvedAttributeSet = rasNew;
            }
        }

        internal ResolvedAttributeSet GiveReference()
        {
            ResolvedAttributeSet rasRef = this.ResolvedAttributeSet;
            if (this.ResolvedAttributeSet != null)
            {
                this.ResolvedAttributeSet.Release();
                if (this.ResolvedAttributeSet.RefCnt == 0)
                {
                    this.ResolvedAttributeSet = null;
                }
            }
            return rasRef;
        }

        internal void OwnOne(ResolvedAttribute ra)
        {
            // save the current context
            CdmAttributeContext attCtx = this.ResolvedAttributeSet.AttributeContext;
            this.TakeReference(new ResolvedAttributeSet());
            this.ResolvedAttributeSet.Merge(ra, ra.AttCtx);
            // reapply the old attribute context
            this.ResolvedAttributeSet.AttributeContext = attCtx;
        }

        public void ApplyTraits(AttributeResolutionContext arc)
        {
            if (this.ResolvedAttributeSet != null && arc != null && arc.TraitsToApply != null)
                this.TakeReference(ResolvedAttributeSet.ApplyTraits(arc.TraitsToApply, arc.ResGuide, arc.ActionsModify));
        }

        public void GenerateApplierAttributes(AttributeResolutionContext arc, bool applyTraitsToNew)
        {
            if (arc == null || arc.ApplierCaps == null)
                return;
            if (this.ResolvedAttributeSet == null)
                this.TakeReference(new ResolvedAttributeSet());

            // make sure all of the 'source' attributes know about this context
            List<ResolvedAttribute> set = this.ResolvedAttributeSet.Set;
            if (set != null)
            {
                int l = set.Count;
                for (int i = 0; i < l; i++)
                    set[i].Arc = arc;

                // the resolution guidance may be asking for a one time 'take' or avoid of attributes from the source
                // this also can re-order the attributes 
                // 
                if (arc.ResGuide != null && arc.ResGuide.selectsSubAttribute != null &&
                    arc.ResGuide.selectsSubAttribute.selects == "some" &&
                    (arc.ResGuide.selectsSubAttribute.selectsSomeTakeNames != null || arc.ResGuide.selectsSubAttribute.selectsSomeAvoidNames != null))
                {
                    // we will make a new resolved attribute set from the 'take' list
                    List<ResolvedAttribute> takeSet = new List<ResolvedAttribute>();
                    List<string> selectsSomeTakeNames = arc.ResGuide.selectsSubAttribute.selectsSomeTakeNames;
                    List<string> selectsSomeAvoidNames = arc.ResGuide.selectsSubAttribute.selectsSomeAvoidNames;

                    if (selectsSomeTakeNames != null && selectsSomeAvoidNames == null)
                    {
                        // make an index that goes from name to insertion order
                        Dictionary<string, int> inverted = new Dictionary<string, int>();
                        for (int iOrder = 0; iOrder < l; iOrder++)
                        {
                            inverted.Add(set[iOrder].ResolvedName, iOrder);
                        }

                        for (int iTake = 0; iTake < selectsSomeTakeNames.Count; iTake++)
                        {
                            // if in the original set of attributes, take it in the new order
                            int iOriginalOrder;
                            if (inverted.TryGetValue(selectsSomeTakeNames[iTake], out iOriginalOrder))
                            {
                                takeSet.Add(set[iOriginalOrder]);
                            }
                        }
                    }
                    if (selectsSomeAvoidNames != null)
                    {
                        // make a quick look up of avoid names
                        HashSet<string> avoid = new HashSet<string>();
                        foreach (string avoidName in selectsSomeAvoidNames)
                        {
                            avoid.Add(avoidName);
                        }

                        for (int iAtt = 0; iAtt < l; iAtt++)
                        {
                            // only take the ones not in avoid the list given
                            if (!avoid.Contains(set[iAtt].ResolvedName))
                            {
                                takeSet.Add(set[iAtt]);
                            }
                        }
                    }

                    // replace the guts of the resolvedAttributeSet with this
                    this.ResolvedAttributeSet.AlterSetOrderAndScope(takeSet);
                }
            }


            // get the new atts and then add them one at a time into this set
            List<ResolvedAttribute> newAtts = GetApplierGeneratedAttributes(arc, true, applyTraitsToNew);
            if (newAtts != null)
            {
                ResolvedAttributeSet ras = this.ResolvedAttributeSet;
                for (int i = 0; i < newAtts.Count; i++)
                {
                    ras = ras.Merge(newAtts[i], newAtts[i].AttCtx);
                }
                this.TakeReference(ras);
            }
        }

        public void RemoveRequestedAtts()
        {
            if (this.ResolvedAttributeSet != null)
            {
                Marker marker = new Marker { CountIndex = 0, MarkIndex = this.InheritedMark };
                this.TakeReference(ResolvedAttributeSet.RemoveRequestedAtts(marker));
                this.InheritedMark = marker.MarkIndex;
            }
        }

        public void MarkInherited()
        {
            if (this.ResolvedAttributeSet?.Set != null)
            {
                this.InheritedMark = this.ResolvedAttributeSet.Set.Count;

                Func<ResolvedAttributeSet, int, int> countSet = null;
                countSet = (rasSub, offset) =>
                {
                    int last = offset;
                    if (rasSub?.Set != null)
                    {
                        for (int i = 0; i < rasSub.Set.Count; i++)
                        {
                            if ((rasSub.Set[i].Target as ResolvedAttributeSet)?.Set != null)
                            {
                                last = countSet((rasSub.Set[i].Target as ResolvedAttributeSet), last);
                            }
                            else
                                last++;
                        }
                    }
                    return last;
                };
                this.InheritedMark = countSet(this.ResolvedAttributeSet, 0);
            }
            else
                this.InheritedMark = 0;
        }

        public void MarkOrder()
        {
            Func<ResolvedAttributeSet, int, int, int> markSet = null;
            markSet = (rasSub, inheritedMark, offset) =>
            {
                int last = offset;
                if (rasSub?.Set != null)
                {
                    rasSub.InsertOrder = last;
                    for (int i = 0; i < rasSub.Set.Count; i++)
                    {
                        if ((rasSub.Set[i].Target as ResolvedAttributeSet)?.Set != null)
                        {
                            last = markSet((rasSub.Set[i].Target as ResolvedAttributeSet), inheritedMark, last);
                        }
                        else
                        {
                            if (last >= inheritedMark)
                                rasSub.Set[i].InsertOrder = last;
                            last++;
                        }
                    }
                }
                return last;
            };
            markSet(this.ResolvedAttributeSet, this.InheritedMark, 0);
        }

        private List<ResolvedAttribute> GetApplierGeneratedAttributes(AttributeResolutionContext arc, bool clearState, bool applyModifiers)
        {
            if (this.ResolvedAttributeSet?.Set == null || arc == null)
                return null;

            AttributeResolutionApplierCapabilities caps = arc.ApplierCaps;

            if (caps == null || (!caps.CanAttributeAdd && !caps.CanGroupAdd && !caps.CanRoundAdd))
                return null;

            List<ResolvedAttribute> resAttOut = new List<ResolvedAttribute>();

            // this function constructs a 'plan' for building up the resolved attributes that get generated from a set of traits being applied to 
            // a set of attributes. it manifests the plan into an array of resolved attributes
            // there are a few levels of hierarchy to consider.
            // 1. once per set of attributes, the traits may want to generate attributes. this is an attribute that is somehow descriptive of the whole set, 
            //    even if it has repeating patterns, like the count for an expanded array.
            // 2. it is possible that some traits (like the array expander) want to keep generating new attributes for some run. each time they do this is considered a 'round'
            //    the traits are given a chance to generate attributes once per round. every set gets at least one round, so these should be the attributes that 
            //    describe the set of other attributes. for example, the foreign key of a relationship or the 'class' of a polymorphic type, etc.
            // 3. for each round, there are new attributes created based on the resolved attributes from the previous round (or the starting atts for this set)
            //    the previous round attribute need to be 'done' having traits applied before they are used as sources for the current round.
            // the goal here is to process each attribute completely before moving on to the next one

            // that may need to start out clean
            if (clearState)
            {
                List<ResolvedAttribute> toClear = this.ResolvedAttributeSet.Set;
                for (int i = 0; i < toClear.Count; i++)
                {
                    toClear[i].ApplierState = null;
                }
            }

            // make an attribute context to hold attributes that are generated from appliers
            // there is a context for the entire set and one for each 'round' of applications that happen
            var attCtxContainerGroup = this.ResolvedAttributeSet.AttributeContext;
            if (attCtxContainerGroup != null)
            {
                AttributeContextParameters acp = new AttributeContextParameters
                {
                    under = attCtxContainerGroup,
                    type = Enums.CdmAttributeContextType.GeneratedSet,
                    Name = "_generatedAttributeSet"
                };

                attCtxContainerGroup = CdmAttributeContext.CreateChildUnder(arc.ResOpt, acp);
            }
            var attCtxContainer = attCtxContainerGroup;

            Func<ResolvedAttribute, AttributeResolutionApplier, Func<ApplierContext, bool>, dynamic, string, ApplierContext> MakeResolvedAttribute = (resAttSource, action, queryAdd, doAdd, state) =>
            {
                ApplierContext appCtx = new ApplierContext
                {
                    State = state,
                    ResOpt = arc.ResOpt,
                    AttCtx = attCtxContainer,
                    ResAttSource = resAttSource,
                    ResGuide = arc.ResGuide
                };

                if ((resAttSource?.Target as ResolvedAttributeSet)?.Set != null)
                    return appCtx; // makes no sense for a group

                // will something add
                if (queryAdd(appCtx))
                {
                    // may want to make a new attribute group
                    // make the 'new' attribute look like any source attribute for the duration of this call to make a context. there could be state needed
                    appCtx.ResAttNew = resAttSource;
                    if (this.ResolvedAttributeSet.AttributeContext != null && action.WillCreateContext?.Invoke(appCtx) == true)
                        action.DoCreateContext(appCtx);
                    // make a new resolved attribute as a place to hold results
                    appCtx.ResAttNew = new ResolvedAttribute(appCtx.ResOpt, null, null, (CdmAttributeContext)appCtx.AttCtx);
                    // copy state from source
                    if (resAttSource?.ApplierState != null)
                        appCtx.ResAttNew.ApplierState = resAttSource.ApplierState.Copy();
                    else
                        appCtx.ResAttNew.ApplierState = new ApplierState();
                    // if applying traits, then add the sets traits as a starting point
                    if (applyModifiers)
                    {
                        appCtx.ResAttNew.ResolvedTraits = arc.TraitsToApply.DeepCopy();
                    }
                    // make it
                    doAdd(appCtx);

                    // combine resolution guidence for this set with anything new from the new attribute
                    appCtx.ResGuideNew = (appCtx.ResGuide as CdmAttributeResolutionGuidance).combineResolutionGuidance(appCtx.ResGuideNew as CdmAttributeResolutionGuidance);
                    appCtx.ResAttNew.Arc = new AttributeResolutionContext(arc.ResOpt, appCtx.ResGuideNew as CdmAttributeResolutionGuidance, appCtx.ResAttNew.ResolvedTraits);

                    if (applyModifiers)
                    {
                        // add the sets traits back in to this newly added one
                        appCtx.ResAttNew.ResolvedTraits = appCtx.ResAttNew.ResolvedTraits.MergeSet(arc.TraitsToApply);
                        // be sure to use the new arc, the new attribute may have added actions. For now, only modify and remove will get acted on because recursion. ugh.
                        // do all of the modify traits
                        if (appCtx.ResAttNew.Arc.ApplierCaps.CanAttributeModify)
                        {
                            // modify acts on the source and we should be done with it
                            appCtx.ResAttSource = appCtx.ResAttNew;
                            foreach (var modAct in appCtx.ResAttNew.Arc.ActionsModify)
                            {
                                if (modAct.WillAttributeModify(appCtx))
                                    modAct.DoAttributeModify(appCtx);
                            }
                        }
                    }
                    appCtx.ResAttNew.CompleteContext(appCtx.ResOpt);
                }
                return appCtx;
            };

            // get the one time atts
            if (caps.CanGroupAdd)
            {
                if (arc.ActionsGroupAdd != null)
                {
                    foreach (var action in arc.ActionsGroupAdd)
                    {
                        ApplierContext appCtx = MakeResolvedAttribute(null, action, action.WillGroupAdd, action.DoGroupAdd, "group");
                        // save it
                        if (appCtx?.ResAttNew != null)
                        {
                            resAttOut.Add(appCtx.ResAttNew);
                        }
                    }
                }
            }


            // now starts a repeating pattern of rounds
            // first step is to get attribute that are descriptions of the round. 
            // do this once and then use them as the first entries in the first set of 'previous' atts for the loop

            // make an attribute context to hold attributes that are generated from appliers in this round
            int round = 0;
            if (attCtxContainerGroup != null)
            {
                AttributeContextParameters acp = new AttributeContextParameters
                {
                    under = attCtxContainerGroup,
                    type = Enums.CdmAttributeContextType.GeneratedRound,
                    Name = "_generatedAttributeRound0"
                };

                attCtxContainer = CdmAttributeContext.CreateChildUnder(arc.ResOpt, acp);
            }

            List<ResolvedAttribute> resAttsLastRound = new List<ResolvedAttribute>();
            if (caps.CanRoundAdd)
            {
                if (arc.ActionsRoundAdd != null)
                {
                    foreach (var action in arc.ActionsRoundAdd)
                    {
                        ApplierContext appCtx = MakeResolvedAttribute(null, action, action.WillRoundAdd, action.DoRoundAdd, "round");
                        // save it
                        if (appCtx?.ResAttNew != null)
                        {
                            // overall list
                            resAttOut.Add(appCtx.ResAttNew);
                            // previous list
                            resAttsLastRound.Add(appCtx.ResAttNew);
                        }
                    }
                }
            }

            // the first per-round set of attributes is the set owned by this object
            resAttsLastRound.AddRange(this.ResolvedAttributeSet.Set);

            // now loop over all of the previous atts until they all say 'stop'
            if (resAttsLastRound.Count > 0)
            {
                int continues = 0;
                do
                {
                    continues = 0;
                    List<ResolvedAttribute> resAttThisRound = new List<ResolvedAttribute>();
                    if (caps.CanAttributeAdd)
                    {
                        for (int iAtt = 0; iAtt < resAttsLastRound.Count; iAtt++)
                        {
                            if (arc.ActionsAttributeAdd != null)
                            {
                                foreach (var action in arc.ActionsAttributeAdd)
                                {
                                    ApplierContext appCtx = MakeResolvedAttribute(resAttsLastRound[iAtt], action, action.WillAttributeAdd, action.DoAttributeAdd, "detail");
                                    // save it
                                    if (appCtx?.ResAttNew != null)
                                    {
                                        // overall list
                                        resAttOut.Add(appCtx.ResAttNew);
                                        resAttThisRound.Add(appCtx.ResAttNew);
                                        if (appCtx.Continue)
                                            continues++;
                                    }
                                }
                            }
                        }
                    }
                    resAttsLastRound = resAttThisRound;

                    round++;
                    if (attCtxContainerGroup != null)
                    {
                        AttributeContextParameters acp = new AttributeContextParameters
                        {
                            under = attCtxContainerGroup,
                            type = Enums.CdmAttributeContextType.GeneratedRound,
                            Name = $"_generatedAttributeRound{round}"
                        };

                        attCtxContainer = CdmAttributeContext.CreateChildUnder(arc.ResOpt, acp);
                    }

                } while (continues > 0);
            }

            return resAttOut;
        }
    }
}
