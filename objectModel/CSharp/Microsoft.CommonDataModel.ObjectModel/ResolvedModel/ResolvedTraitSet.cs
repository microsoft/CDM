// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    internal class ResolvedTraitSet
    {
        public List<ResolvedTrait> Set { get; set; }
        private IDictionary<CdmTraitDefinition, ResolvedTrait> LookupByTrait;
        internal ResolveOptions ResOpt { get; set; }
        public bool? HasElevated { get; set; }

        public ResolvedTraitSet(ResolveOptions resOpt)
        {
            this.ResOpt = CdmObjectBase.CopyResolveOptions(resOpt);
            this.Set = new List<ResolvedTrait>();
            this.LookupByTrait = new Dictionary<CdmTraitDefinition, ResolvedTrait>();
            this.HasElevated = false;
        }

        public ResolvedTraitSet Merge(ResolvedTrait toMerge, bool copyOnWrite)
        {
            ResolvedTraitSet traitSetResult = this;
            var trait = toMerge.Trait;
            List<dynamic> av = null;
            List<bool> wasSet = null;
            if (toMerge.ParameterValues != null)
            {
                av = toMerge.ParameterValues.Values;
                wasSet = toMerge.ParameterValues.WasSet;
            }

            if (this.HasElevated != true)
            {
                this.HasElevated = trait.Elevated;
            }

            if (traitSetResult.LookupByTrait.ContainsKey(trait))
            {
                ResolvedTrait rtOld = traitSetResult.LookupByTrait[trait];
                List<dynamic> avOld = null;
                if (rtOld.ParameterValues != null)
                    avOld = rtOld.ParameterValues.Values;
                if (av != null && avOld != null)
                {
                    // the new values take precedence
                    for (int i = 0; i < av.Count; i++)
                    {
                        if (avOld[i]?.GetType() == typeof(JValue))
                        {
                            avOld[i] = (string)avOld[i];
                        }
                        try
                        {
                            if (av[i] != avOld[i])
                            {
                                if (copyOnWrite)
                                {
                                    traitSetResult = traitSetResult.ShallowCopyWithException(trait);
                                    rtOld = traitSetResult.LookupByTrait[trait];
                                    avOld = rtOld.ParameterValues.Values;
                                    copyOnWrite = false;
                                }
                                avOld[i] = ParameterValue.FetchReplacementValue(this.ResOpt, avOld[i], av[i], wasSet[i]);
                            }
                        }
                        catch
                        {

                        }
                    }
                }
            }
            else
            {
                if (copyOnWrite)
                    traitSetResult = traitSetResult.ShallowCopy();
                toMerge = toMerge.Copy();
                traitSetResult.Set.Add(toMerge);
                traitSetResult.LookupByTrait.Add(trait, toMerge);
            }

            return traitSetResult;
        }

        public ResolvedTraitSet MergeSet(ResolvedTraitSet toMerge, bool elevatedOnly = false)
        {
            bool copyOnWrite = true;
            ResolvedTraitSet traitSetResult = this;
            if (toMerge != null)
            {
                int l = toMerge.Set.Count;
                for (int i = 0; i < l; i++)
                {
                    ResolvedTrait rt = toMerge.Set[i];
                    if (!elevatedOnly || rt.Trait.Elevated == true)
                    {
                        ResolvedTraitSet traitSetMerge = traitSetResult.Merge(rt, copyOnWrite);
                        if (traitSetMerge != traitSetResult)
                        {
                            traitSetResult = traitSetMerge;
                            copyOnWrite = false;
                        }
                    }
                }
            }
            return traitSetResult;
        }

        public ResolvedTrait Get(CdmTraitDefinition trait)
        {
            if (this.LookupByTrait.ContainsKey(trait))
                return this.LookupByTrait[trait];
            return null;
        }
        public ResolvedTrait Find(ResolveOptions resOpt, string traitName)
        {
            int l = this.Set.Count;
            for (int i = 0; i < l; i++)
            {
                ResolvedTrait rt = this.Set[i];
                if (rt.Trait.IsDerivedFrom(traitName, resOpt))
                    return rt;
            }
            return null;
        }
        public int Size
        {
            get
            {
                if (this.Set != null)
                    return this.Set.Count;
                return 0;
            }
        }

        public ResolvedTrait First
        {
            get
            {
                if (this.Set != null)
                    return this.Set[0];
                return null;
            }
        }

        public ResolvedTraitSet DeepCopy()
        {
            ResolvedTraitSet copy = new ResolvedTraitSet(this.ResOpt);
            List<ResolvedTrait> newSet = copy.Set;
            for (int i = 0; i < this.Set.Count; i++)
            {
                ResolvedTrait rt = this.Set[i];
                rt = rt.Copy();
                newSet.Add(rt);
                copy.LookupByTrait.Add(rt.Trait, rt);
            }
            copy.HasElevated = this.HasElevated;
            return copy;
        }

        public ResolvedTraitSet ShallowCopyWithException(CdmTraitDefinition just)
        {
            ResolvedTraitSet copy = new ResolvedTraitSet(this.ResOpt);
            List<ResolvedTrait> newSet = copy.Set;
            int l = this.Set.Count;
            for (int i = 0; i < l; i++)
            {
                ResolvedTrait rt = this.Set[i];
                if (rt.Trait == just)
                    rt = rt.Copy();
                newSet.Add(rt);
                copy.LookupByTrait.Add(rt.Trait, rt);
            }

            copy.HasElevated = this.HasElevated;
            return copy;
        }
        public ResolvedTraitSet ShallowCopy()
        {
            ResolvedTraitSet copy = new ResolvedTraitSet(this.ResOpt);
            if (this.Set != null)
            {
                List<ResolvedTrait> newSet = copy.Set;
                int l = this.Set.Count;
                for (int i = 0; i < l; i++)
                {
                    ResolvedTrait rt = this.Set[i];
                    newSet.Add(rt);
                    copy.LookupByTrait.Add(rt.Trait, rt);
                }
            }

            copy.HasElevated = this.HasElevated;
            return copy;
        }

        public ISet<string> CollectTraitNames()
        {
            ISet<string> collection = new HashSet<string>();
            if (this.Set != null)
            {
                int l = this.Set.Count;
                for (int i = 0; i < l; i++)
                {
                    ResolvedTrait rt = this.Set[i];
                    rt.CollectTraitNames(this.ResOpt, collection);
                }
            }
            return collection;
        }

        public void SetParameterValueFromArgument(CdmTraitDefinition trait, CdmArgumentDefinition arg)
        {
            ResolvedTrait resTrait = this.Get(trait);
            if (resTrait?.ParameterValues != null)
            {
                List<dynamic> av = resTrait.ParameterValues.Values;
                dynamic newVal = arg.Value;
                // get the value index from the parameter collection given the parameter that this argument is setting
                int iParam = resTrait.ParameterValues.IndexOf(arg.GetParameterDef());
                av[iParam] = ParameterValue.FetchReplacementValue(this.ResOpt, av[iParam], newVal, true);
                resTrait.ParameterValues.WasSet[iParam] = true;
            }
        }

        public ResolvedTraitSet SetTraitParameterValue(ResolveOptions resOpt, CdmTraitDefinition toTrait, string paramName, dynamic value)
        {
            ResolvedTraitSet altered = this.ShallowCopyWithException(toTrait);
            var currTrait = altered.Get(toTrait)?.ParameterValues;
            if (currTrait != null)
                currTrait.SetParameterValue(this.ResOpt, paramName, value);
            return altered;
        }

        public ResolvedTraitSet ReplaceTraitParameterValue(ResolveOptions resOpt, string toTrait, string paramName, dynamic valueWhen, dynamic valueNew)
        {
            ResolvedTraitSet traitSetResult = this as ResolvedTraitSet;
            for (int i = 0; i < traitSetResult.Set.Count; i++)
            {
                ResolvedTrait rt = traitSetResult.Set[i];
                if (rt?.Trait.IsDerivedFrom(toTrait, resOpt) == true)
                {
                    if (rt.ParameterValues != null)
                    {
                        ParameterCollection pc = rt.ParameterValues.PC;
                        List<dynamic> av = rt.ParameterValues.Values;
                        int idx = pc.FetchParameterIndex(paramName);
                        if (idx >= 0 && Equals(av[idx], valueWhen))
                        {
                            // copy the set and make a deep copy of the trait being set
                            traitSetResult = this.ShallowCopyWithException(rt.Trait);
                            // assume these are all still true for this copy
                            rt = traitSetResult.Set[i];
                            av = rt.ParameterValues.Values;
                            av[idx] = ParameterValue.FetchReplacementValue(resOpt, av[idx], valueNew, true);
                            break;
                        }
                    }
                }
            }
            return traitSetResult;
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent, bool nameSort)
        {
            List<ResolvedTrait> list = new List<ResolvedTrait>(this.Set);
            if (nameSort)
            {
                list.Sort((l, r) => StringUtils.CompareWithOrdinalIgnoreCase(l.TraitName, r.TraitName));
            }

            for (int i = 0; i < this.Set.Count; i++)
            {
                list[i].Spew(resOpt, to, indent);
            };
        }
    }
}
