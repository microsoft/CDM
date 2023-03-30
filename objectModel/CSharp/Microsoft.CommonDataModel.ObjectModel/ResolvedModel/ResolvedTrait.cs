// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Collections.Generic;

    internal class ResolvedTrait
    {
        public CdmTraitDefinition Trait { get; set; }
        internal ParameterValueSet ParameterValues { get; set; }
        internal CdmTraitReference ExplicitVerb { get; set; }
        internal List<CdmTraitReferenceBase> MetaTraits { get; set; }

        internal ResolvedTrait(CdmTraitDefinition trait, ParameterCollection parameterCollection, List<dynamic> values, List<bool> wasSet, CdmTraitReference explicitVerb, List<CdmTraitReferenceBase> metaTraits)
        {
            if (parameterCollection?.Sequence?.Count > 0)
                this.ParameterValues = new ParameterValueSet(trait.Ctx, parameterCollection, values, wasSet);
            this.Trait = trait;
            this.ExplicitVerb = explicitVerb;
            if (metaTraits != null)
            {
                this.MetaTraits = new List<CdmTraitReferenceBase>(metaTraits);
            }
        }

        public string TraitName
        {
            get
            {
                return this.Trait?.DeclaredPath;
            }
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent)
        {
            to.SpewLine($"{indent}[{this.TraitName}]");
            if (this.ParameterValues != null)
                this.ParameterValues.Spew(resOpt, to, indent + '-');
        }

        public ResolvedTrait Copy()
        {
            ParameterCollection pc = null;
            List<dynamic> values = null;
            List<bool> wasSet = null;
            List<CdmTraitReferenceBase> metaTraits = null;
            if (this.ParameterValues != null)
            {
                ParameterValueSet copyParamValues = this.ParameterValues.Copy();
                pc = copyParamValues.PC;
                values = copyParamValues.Values;
                wasSet = copyParamValues.WasSet;
            }
            if (this.MetaTraits != null)
            {
                metaTraits = new List<CdmTraitReferenceBase>(this.MetaTraits);
            }
            return new ResolvedTrait(this.Trait, pc, values, wasSet, this.ExplicitVerb, metaTraits);
        }

        public void CollectTraitNames(ResolveOptions resOpt, ISet<string> into)
        {
            CdmTraitDefinition currentTrait = this.Trait;
            while (currentTrait != null)
            {
                string name = currentTrait.GetName();
                into.Add(name);
                CdmTraitReference baseRef = currentTrait.ExtendsTrait;
                currentTrait = baseRef != null ? baseRef.FetchObjectDefinition<CdmTraitDefinition>(resOpt) : null;
            }
        }

        /// <summary>
        /// Adds a 'meta' trait to a resolved trait object
        /// collection stays null until used to save space
        /// </summary>
        /// <param name="trait"> the trait reference to place in the metaTraits collection</param>
        /// <param name="verb"> a verb trait to use along with the ref. can be null for default verb</param>
        public void AddMetaTrait(CdmTraitReference trait, CdmTraitReference verb)
        {
            if (this.MetaTraits == null)
            {
                this.MetaTraits = new List<CdmTraitReferenceBase>();
            }
            trait.Verb = verb;
            this.MetaTraits.Add(trait);
        }

        /// <summary>
        /// creates a TraitProfile from a resolved trait
        /// normally these would come from a trait reference or definition, so we need to 
        /// put some things back together to make this look right
        /// </summary>
        /// <param name="resOpt"></param>
        /// <param name="cache">optional cache object to speed up and make consistent the fetching of profiles for a larger set of objects</param>
        /// <param name="forVerb">optional 'verb' name to use as a filter. I only want profiles applied with 'means' for example</param>
        /// <returns>the profile object, perhaps from the cache</returns>
        public TraitProfile FetchTraitProfile(ResolveOptions resOpt, TraitProfileCache cache = null, string forVerb = null)
        {
            if (cache == null)
            {
                cache = new TraitProfileCache();
            }
            // start with the profile of the definition
            var definition = TraitProfile.traitDefToProfile(this.Trait, resOpt, false, false, cache);
            TraitProfile result;

            // encapsulate and promote
            result = new TraitProfile();
            result.References = definition;
            result.TraitName = definition.TraitName;

            // move over any verb set or metatraits set on this reference
            if (this.ExplicitVerb != null)
            {
                result.Verb = TraitProfile.traitRefToProfile(this.ExplicitVerb, resOpt, true, true, true, cache);
            }
            if (result.Verb != null && forVerb != null && result.Verb.TraitName != forVerb)
            {
                // filter out now
                result = null;
            }
            else
            {
                if (this.MetaTraits != null)
                {
                    result.MetaTraits = TraitProfile.traitCollectionToProfileList(this.MetaTraits, resOpt, result.MetaTraits, true, cache);
                    result.removeClassifiersFromMeta();
                }

                // if there are arguments set in this resolved trait, list them
                if (this.ParameterValues != null && this.ParameterValues.Length > 0)
                {
                    Dictionary<string, dynamic> argMap = new Dictionary<string, dynamic>();
                    int l = this.ParameterValues.Length;
                    for (int i = 0; i < l; i++)
                    {
                        var p = this.ParameterValues.FetchParameterAtIndex(i);
                        dynamic v = this.ParameterValues.FetchValue(i);
                        string name = p.Name;
                        if (name == null)
                        {
                            name = i.ToString();
                        }
                        var value = TraitProfile.FetchProfileArgumentFromTraitArgument(v, resOpt);
                        if (value != null)
                        {
                            argMap.Add(name, value);
                        }
                    }

                    if (argMap.Count > 0)
                    {
                        result.ArgumentValues = argMap;
                    }
                }
            }
            return result;
        }
    }
}
