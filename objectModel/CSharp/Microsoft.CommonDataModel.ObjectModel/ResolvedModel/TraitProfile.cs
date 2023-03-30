// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// The object returned from the FetchTraitProfile API
    /// represents an expanded picture of a trait reference including:
    /// The structure represents either a trait definition or a trait reference
    /// IF the References member is not null, this is a trait reference else a definition
    /// Definition has
    ///     1. TraitName: the defined name of the trait
    ///     2. Explanation: null or any text provided in the definition
    ///     3. IS_A: null or a reference profile for the base trait if the definition extends another trait
    ///     4. References: null
    ///     5. Verb: null or a reference profile for the defaultVerb of the definition if there is one
    ///     6. Arguments: null or if parameters are defined on the trait a map from parameter name to any default value defined for the parameter else null
    ///     7. Classifications: null or an array of reference profiles for any 'exhibitedTraits' of the trait definition that use the 'classifiedAs' verb.
    ///     8. MetaTrait: null or an array of reference profiles for any 'exhibitedTraits' of the trait definition that DO NOT use the 'classifiedAs' verb.
    /// Reference has
    ///     1. TraitName: the name of the referenced trait
    ///     2. Explanation: null
    ///     3. IS_A: null
    ///     4. References: a definition profile for the referenced trait
    ///     5. Verb: null or a reference profile for any verb applied in this reference
    ///     6. Arguments: null or if arguments are set at this reference then a map from argument name to set value
    ///     7. Classifications: null or an array of reference profiles for any 'appliedTraits' at this reference that use the 'classifiedAs' verb.
    ///     8. MetaTrait: null or an array of reference profiles for any 'appliedTraits' at this reference that DO NOT use the 'classifiedAs' verb.
    /// </summary>
    public class TraitProfile
    {
        /// <summary>
        /// For Definition: the defined name of the trait
        /// For Reference: the name of the referenced trait
        /// </summary>
        [JsonProperty("traitName")]
        public string TraitName;
        /// <summary>
        /// For Definition: null or any text provided in the definition
        /// For Reference: null
        /// </summary>
        [JsonProperty("explanation")]
        public string Explanation;
        /// <summary>
        /// For Definition: null or a reference profile for the base trait if the definition extends another trait
        /// For Reference: null
        /// </summary>
        [JsonProperty("IS_A")]
        public TraitProfile IS_A;
        /// <summary>
        /// For Definition: null
        /// For Reference: a definition profile for the referenced trait
        /// </summary>
        [JsonProperty("references")]
        public TraitProfile References;
        /// <summary>
        /// For Definition: null or a reference profile for the defaultVerb of the definition if there is one
        /// For Reference: null or a reference profile for any verb applied in this reference
        /// </summary>
        [JsonProperty("verb")]
        public TraitProfile Verb;
        /// <summary>
        /// For Definition: null or if parameters are defined on the trait a map from parameter name to any default value defined for the parameter else null
        /// For Reference: null or if arguments are set at this reference then a map from argument name to set value
        /// </summary>
        [JsonProperty("argumentValues")]
        public Dictionary<string, dynamic> ArgumentValues;
        /// <summary>
        /// For Definition: null or an array of reference profiles for any 'exhibitedTraits' of the trait definition that use the 'classifiedAs' verb.
        /// For Reference: null or an array of reference profiles for any 'appliedTraits' at this reference that use the 'classifiedAs' verb.
        /// </summary>
        [JsonProperty("classifications")]
        public List<TraitProfile> Classifications;
        /// <summary>
        /// For Definition: null or an array of reference profiles for any 'exhibitedTraits' of the trait definition that DO NOT use the 'classifiedAs' verb.
        /// For Reference: null or an array of reference profiles for any 'appliedTraits' at this reference that DO NOT use the 'classifiedAs' verb.
        /// </summary>
        [JsonProperty("metaTraits")]
        public List<TraitProfile> MetaTraits;

        // need a way to unique ID object instances
        private static int nextTpId = 1;
        internal string tpId;
        public TraitProfile()
        {
            this.tpId = $"{System.Threading.Interlocked.Increment(ref TraitProfile.nextTpId)}_";
        }

        // is this profile directly or through inheritance of the given type name
        // searches the chain of references and IS_A references for a profile with the given name
        // if B IS_A ref A
        // C IS_A ref B
        // then (ref C).isA('A') is true
        public bool IsA(string extendedName)
        {
            TraitProfile seek = this;
            while (seek != null)
            {
                if (seek.TraitName == extendedName)
                    return true;
                
                if (seek.IS_A != null)
                    seek = seek.IS_A;
                else if (seek.References != null)
                    seek = seek.References;
                else
                    seek = null;
            }
            return false;
        }

        // find the same verb that would bubble to this point in consolidated profiles
        public TraitProfile AppliedVerb()
        {
            TraitProfile seek = this;
            while (seek != null)
            {
                if (seek.Verb != null)
                    return seek.Verb;

                if (seek.IS_A != null)
                    seek = seek.IS_A;
                else if (seek.References != null)
                    seek = seek.References;
                else
                    seek = null;
            }
            return null;
        }


        /// <summary>
        /// Is this trait profile defined as using or being applied with the 'classifiedAs' verb so it represents the classification of other objects
        /// </summary>
        /// <returns>true if true</returns>
        public bool isClassification()
        {
            TraitProfile seek = this;
            while (seek != null)
            {
                if (seek.Verb != null)
                {
                    return seek.Verb.TraitName == "classifiedAs";
                }
                if (seek.IS_A != null)
                    seek = seek.IS_A;
                else if (seek.References != null)
                    seek = seek.References;
                else
                    seek = null;
            }
            return false;
        }

        /// <summary>
        /// makes a new trait profile that is a 'shallow' copy of the source (this)
        /// shallow meaning fresh collections are created but any referenced profiles remain as before
        /// </summary>
        /// <returns>a new trait profile as a copy of this</returns>
        public TraitProfile Copy()
        {
            TraitProfile copy = new TraitProfile();

            copy.TraitName = this.TraitName;
            copy.Explanation = this.Explanation;
            copy.IS_A = this.IS_A;
            copy.References = this.References;
            copy.Verb = this.Verb;
            if (this.ArgumentValues != null)
            {
                copy.ArgumentValues = new Dictionary<string, dynamic>(this.ArgumentValues);
            }
            if (this.Classifications != null)
            {
                copy.Classifications = new List<TraitProfile>(this.Classifications);

            }
            if (this.MetaTraits != null)
            {
                copy.MetaTraits = new List<TraitProfile>(this.MetaTraits);
            }
            return copy;
        }

        /// <summary>
        /// converts a value taken from a trait argument and returns a version that can be persisted. 
        /// these are used as the argument map values in trait profiles
        /// </summary>
        /// <returns>a persist friendly version of the value</returns>
        public static dynamic FetchProfileArgumentFromTraitArgument(dynamic value, ResolveOptions resOpt)
        {
            if (value == null)
            {
                return null;
            }
            if (value is CdmEntityReference)
            {
                return PersistenceLayer.ToData<CdmEntityReference, dynamic>(value as CdmEntityReference, resOpt, new CopyOptions(), "CdmFolder");
            }
            else if (value is CdmAttributeReference)
            {
                return PersistenceLayer.ToData<CdmAttributeReference, dynamic>(value as CdmAttributeReference, resOpt, new CopyOptions(), "CdmFolder");
            }
            else
            {
                string strVal = value.ToString();
                if (strVal != null && strVal != "")
                {
                    return strVal;
                }
            }
            return null;
        }

        /// <summary>
        /// given a persist friendly argument value from a profile argument map, turn that into a constant entity (if it is one)
        /// </summary>
        /// <returns>a constant entity definition found from the input</returns>
        public static CdmConstantEntityDefinition FetchConstantEntityFromProfileArgument(dynamic argValue, ResolveOptions resOpt)
        {
            if (argValue == null)
                return null;
            var jsonSerializer = JsonSerializer.Create(new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
            var valAsJT = JToken.FromObject(argValue, jsonSerializer);
            if (valAsJT == null)
                return null;

            // must be a ref to constant entity. make a real object from it
            CdmEntityReference entRefArg = Persistence.CdmFolder.EntityReferencePersistence.FromData(resOpt.WrtDoc.Ctx, valAsJT);
            if (entRefArg == null)
                return null;

            // get the definition of the constant entity
            var constEntDef = entRefArg.FetchObjectDefinition<CdmConstantEntityDefinition>(resOpt);
            return constEntDef;
        }

        /// <summary>
        /// Consolidate action on a set of trait profiles will do a few things to make the profiles easier to work with, compare, store.
        /// all classification traits applied or defined along the inheritance chain are promoted to the top most reference and deeper classification lists are removed.
        /// the last verb that was applied or defined is also promoted and other verbs are removed.
        /// references that add no value (no new verb or meta traits added) are removed from the branches of this tree. 
        /// a 'simple' definition profile might get merged into a 'value adding' reference.
        /// along the way, duplicate descriptions of definitions or duplicate looking references are turned into single objects
        /// </summary>
        /// <returns>a list of the consolidated profiles</returns>
        public static List<TraitProfile> ConsolidateList(List<TraitProfile> toConsolidate, TraitProfileCache cache = null)
        {
            if (cache == null)
            {
                cache = new TraitProfileCache();
            }
            return _ConsolidateList(toConsolidate, cache);
        }
        public TraitProfile Consolidate(TraitProfileCache cache = null)
        {
            if (cache == null)
            {
                cache = new TraitProfileCache();
            }
            var consProf = this.PromoteFromBase(cache);
            return consProf.RemoveNakedReferences(cache);
        }

        internal static List<TraitProfile> _ConsolidateList(List<TraitProfile> toConsolidate, TraitProfileCache cache)
        {
            var result = new List<TraitProfile>();
            foreach(var prof in toConsolidate)
            {
                // promote verbs, explanations and classification traits up from the base definition
                var consProf = prof.PromoteFromBase(cache);
                result.Add(consProf);
            }
            toConsolidate = result;
            result = new List<TraitProfile>();
            foreach (var prof in toConsolidate)
            {
                // remove extra layers of references that add no information and reuse references where possible
                var consProf = prof.RemoveNakedReferences(cache);
                result.Add(consProf);
            }

            return result;
        }
        private void TakePromoValues(TraitProfile source)
        {
            // promote explanation unless this sets one
            if (this.Explanation == null)
            {
                this.Explanation = source.Explanation;
            }
            // promote verb unless this def sets one
            if (this.Verb == null)
            {
                this.Verb = source.Verb;
            }
            // copy or add the classifications
            if (source.Classifications != null && source.Classifications.Count > 0)
            {
                if (this.Classifications == null)
                {
                    this.Classifications = new List<TraitProfile>(source.Classifications);
                }
                else
                {
                    this.Classifications.AddRange(source.Classifications);
                }
            }
        }
        private TraitProfile PromoteFromBase(TraitProfileCache cache)
        {
            var result = this;
            if (this.References == null)
            {
                // we must be a trait def pointing to a ref of extended or empty
                // done this before?
                TraitProfile cached = cache.GetPromotedDefinitionProfile(this);
                if (cached != null)
                {
                    return cached;
                }

                // new definition seen
                // since we get modified, make a copy
                result = this.Copy();
                if (result.IS_A != null)
                {
                    TraitProfile isaRef = result.IS_A.PromoteFromBase(cache);
                    result.IS_A = isaRef;
                    // pull up values from ref and then clean it up
                    result.TakePromoValues(isaRef);
                    // clean ref
                    isaRef.Classifications = null;
                    isaRef.Verb = null;
                }

                // save this so we only do it once
                cache.SavePromotedDefinitionProfile(result, this);
                var cleaned = result.Copy();
                cleaned.Classifications = null;
                cleaned.Verb = null;
                cache.SaveCleanedDefinitionProfile(cleaned, result);
            }
            else 
            {
                // we must be a trait reference to a trait def
                var isaDef = this.References.PromoteFromBase(cache);
                // promote to this
                result = this.Copy();
                result.TakePromoValues(isaDef);
                // get the 'cleaned' base as our base
                result.References = cache.GetCleanedDefinitionProfile(isaDef);
            }

            if (result.MetaTraits != null)
            {
                result.MetaTraits = PromoteFromBaseList(result.MetaTraits, cache);
            }
            return result;
        }
        internal static List<TraitProfile> PromoteFromBaseList(List<TraitProfile> toConsolidate, TraitProfileCache cache)
        {
            var result = new List<TraitProfile>();
            foreach (var prof in toConsolidate)
            {
                // promote verbs, explanations and classification traits up from the base definition
                var consProf = prof.PromoteFromBase(cache);
                result.Add(consProf);
            }
            return result;
        }

        private TraitProfile RemoveNakedReferences(TraitProfileCache cache)
        {
            var result = this.Copy();
            if (result.IS_A != null)
            {
                result.IS_A = result.IS_A.RemoveNakedReferences(cache);
            }
            if (result.References != null)
            {
                result.References = result.References.RemoveNakedReferences(cache);
            }
            if (result.Verb != null)
            {
                result.Verb = result.Verb.RemoveNakedReferences(cache);
            }
            if (result.MetaTraits != null)
            {
                result.MetaTraits = RemoveNakedReferencesList(result.MetaTraits, cache);
            }

            if (result.References != null)
            {
                // if this reference is not interesting then move info down to a copy of the thing being referenced
                if (result.MetaTraits == null || result.MetaTraits.Count == 0)
                {
                    var newResult = result.References.Copy();
                    newResult.Verb = result.Verb;
                    newResult.Classifications = result.Classifications;
                    newResult.ArgumentValues = result.ArgumentValues;
                    newResult = cache.GetEquivalentReference(newResult);
                    return newResult;
                }
                else
                {
                    // the other option is that this reference is interesting but the thing being referenced is NOT. so just "remove" it
                    if (result.References.MetaTraits == null || result.References.MetaTraits.Count==0)
                    {
                        var newResult = result.Copy();
                        newResult.IS_A = result.References.IS_A;
                        newResult.References = null;
                        newResult = cache.GetEquivalentReference(newResult);
                        return newResult;
                    }
                }
            }

            return cache.GetEquivalentReference(result);
        }
        internal static List<TraitProfile> RemoveNakedReferencesList(List<TraitProfile> toConsolidate, TraitProfileCache cache)
        {
            var result = new List<TraitProfile>();
            foreach (var prof in toConsolidate)
            {
                // remove extra layers of references that add no information and reuse references where possible
                var consProf = prof.RemoveNakedReferences(cache);
                result.Add(consProf);
            }
            return result;
        }

        internal static TraitProfile traitDefToProfile(CdmTraitDefinition traitDef, ResolveOptions resOpt, bool isVerb, bool isMeta, TraitProfileCache cache)
        {
            if (cache == null)
            {
                cache = new TraitProfileCache();
            }
            var result = new TraitProfile();
            string traitName = traitDef.TraitName;
            result.TraitName = traitName;
            result.Explanation = traitDef.Explanation;
            TraitProfile extTrait = null;
            if (cache.AddContext(traitName) == true)
            {

                TraitProfile tpCache = cache.GetDefinitionProfile(traitDef, isVerb, isMeta);
                if (tpCache != null)
                {
                    cache.RemoveContext(traitName);
                    return tpCache;
                }

                if (!isVerb)
                {
                    if (traitDef.ExtendsTrait != null)
                    {
                        // get details, only include classifiers if this is along the main path, don't get args
                        extTrait = traitRefToProfile(traitDef.ExtendsTrait, resOpt, false, isMeta, false, cache);
                        result.IS_A = extTrait;
                    }
                    if (traitDef.DefaultVerb != null)
                    {
                        // get verb info, no classifications wanted args ok
                        result.Verb = traitRefToProfile(traitDef.DefaultVerb, resOpt, true, true, true, cache);
                    }
                    if (traitDef.ExhibitsTraits != null && traitDef.ExhibitsTraits.Count > 0)
                    {
                        // get sub traits include classifications
                        var subTraits = traitCollectionToProfileList(traitDef.ExhibitsTraits.AllItems, resOpt, result.MetaTraits, isMeta, cache);
                        if (subTraits != null)
                        {
                            result.MetaTraits = subTraits;
                            result.removeClassifiersFromMeta();
                        }
                    }
                }
                cache.RemoveContext(traitName);

                cache.SaveDefinitionProfile(traitDef, result, isVerb, isMeta);
            }

            return result;
        }
        internal static TraitProfile traitRefToProfile(CdmTraitReferenceBase trb, ResolveOptions resOpt, bool isVerb, bool isMeta, bool includeArgs, TraitProfileCache cache)
        {
            if (cache == null)
            {
                cache = new TraitProfileCache();
            }
            var result = new TraitProfile();
            string traitName = trb.FetchObjectDefinitionName();
            result.TraitName = traitName;
            if (cache.AddContext(traitName))
            {
                cache.RemoveContext(traitName);
                // is this a traitgroup ref or a trait ref?
                CdmTraitReference tr = trb as CdmTraitReference;

                // trait
                if (tr != null)
                {
                    var traitDef = tr.FetchObjectDefinition<CdmTraitDefinition>(resOpt);
                    if (traitDef != null)
                    {
                        result.References = traitDefToProfile(traitDef, resOpt, isVerb, isMeta, cache);
                    }
                    if (tr.Verb != null)
                    {
                        // get info, a verb without classifications but args if set
                        result.Verb = traitRefToProfile(tr.Verb, resOpt, true, true, true, cache);
                    }
                    if (tr.AppliedTraits != null && tr.AppliedTraits.Count > 0)
                    {
                        // get sub traits but include classification only if requested
                        var subTraits = traitCollectionToProfileList(tr.AppliedTraits.AllItems, resOpt, result.MetaTraits, true, cache);
                        if (subTraits != null)
                        {
                            result.MetaTraits = subTraits;
                            result.removeClassifiersFromMeta();
                        }
                    }

                    if (includeArgs)
                    {
                        var args = tr.FetchFinalArgumentValues(resOpt);
                        if (args != null && args.Count > 0)
                        {
                            Dictionary<string, dynamic> argMap = new Dictionary<string, dynamic>();

                            foreach (var av in args)
                            {
                                var value = TraitProfile.FetchProfileArgumentFromTraitArgument(av.Value, resOpt);
                                if (value != null)
                                {
                                    argMap.Add(av.Key, value);
                                }
                            }
                            if (argMap.Count > 0)
                            {
                                result.ArgumentValues = argMap;
                            }
                        }
                    }
                    result = cache.GetEquivalentReference(result);
                }
                else
                {
                    // must be a trait group. so get the immediate members and unfold the list
                    var tg = (trb as CdmTraitGroupReference).FetchObjectDefinition<CdmTraitGroupDefinition>(resOpt);
                    if (tg != null)
                    {
                        result.MetaTraits = traitCollectionToProfileList(tg.ExhibitsTraits.AllItems, resOpt, null, true, cache);
                    }
                }
            }
            return result;
        }

        internal static List<TraitProfile> traitCollectionToProfileList(List<CdmTraitReferenceBase> trCol, ResolveOptions resOpt, List<TraitProfile> accumulateInList, bool isMeta, TraitProfileCache cache)
        {
            if (cache == null)
            {
                cache = new TraitProfileCache();
            }
            List<TraitProfile> result = new List<TraitProfile>();

            // if given a previous place, move over everything but maybe skip the classifiers
            if (accumulateInList != null)
            {
                foreach (var oldProf in accumulateInList)
                {
                    if (!isMeta || !oldProf.isClassification())
                        result.Add(oldProf);
                }
            }
            // run over all traits and get a profile
            foreach (var tr in trCol)
            {
                var current = traitRefToProfile(tr, resOpt, false, isMeta, true, cache); // not a verb, no classifiers for sub, args ok
                if (!isMeta || !current.isClassification())
                    result.Add(current);
            }
            if (result.Count == 0)
                return null;
            return result;
        }

        internal void removeClassifiersFromMeta()
        {
            if (this.MetaTraits != null && this.MetaTraits.Count > 0)
            {
                List<TraitProfile> newExtTraits = new List<TraitProfile>();
                List<TraitProfile> classifierTraits = new List<TraitProfile>();
                foreach (var extr in this.MetaTraits)
                {
                    if (extr.isClassification())
                        classifierTraits.Add(extr);
                    else
                        newExtTraits.Add(extr);
                }
                this.MetaTraits = null;
                if (newExtTraits.Count > 0)
                {
                    this.MetaTraits = newExtTraits;
                }
                if (classifierTraits.Count > 0)
                {
                    if (this.Classifications == null)
                        this.Classifications = new List<TraitProfile>();
                    this.Classifications.AddRange(classifierTraits);
                }
            }
        }
    }

    /// <summary>
    /// a helper object that encapsulates the work of producing a 'key' for a trait profile
    /// a key is a string that can distinctly identity the trait name, arguments and any applied 
    /// trait combinations. 
    /// the goal is that two traitProfiles with the same childrent and names etc. will produce identical 
    /// keys and can be considered to be the same object
    /// </summary>
    class TraitProfileKeyFactory
    {
        /// <summary>
        /// returns a key for a collection of trait profiles as [prof key, prof key]
        /// </summary>
        public static string CollectionGetKey(List<TraitProfile> col)
        {
            if (col == null || col.Count == 0)
            {
                return "[]";
            }
            var key="[";
            foreach(var t in col)
            {
                key += t.tpId;
            }
            key += "]";
            return key;
        }
        /// <summary>
        /// get the key for a profile 
        /// form is traitName i:{isA key} r:{references key} v:{verb key} a:{arguments key} c:{classifications key} m:{meta traits key}
        /// </summary>
        public static string getKey(TraitProfile prof)
        {
            var iKey = prof.IS_A == null ? "0" : prof.IS_A.tpId;
            var rKey = prof.References == null ? "0" : prof.References.tpId;
            var vKey = prof.Verb == null ? "0" : prof.Verb.tpId;
            var aKey = "[]";
            if (prof.ArgumentValues != null && prof.ArgumentValues.Count > 0)
            {
                aKey = "[";
                foreach(var kv in prof.ArgumentValues)
                {
                    aKey += "{";
                    aKey += kv.Key;
                    aKey += "=";
                    aKey += JToken.FromObject(kv.Value).ToString();
                    aKey += "}";
                }
                aKey += "]";
            }
            var cKey = TraitProfileKeyFactory.CollectionGetKey(prof.Classifications);
            var mKey = TraitProfileKeyFactory.CollectionGetKey(prof.MetaTraits);
            return $"{prof.TraitName} i:{iKey} r:{rKey} v:{vKey} a:{aKey} c:{cKey} m:{mKey}";
        }
    }

    /// <summary>
    /// Encapsulates a scope of caching for trait profiles
    /// this object is created by an API user and passed as an argument, but is meant to be mostly opaque 
    /// in terms of operation or content
    /// </summary>

    public class TraitProfileCache
    {
        HashSet<string> stack;
        Dictionary<CdmTraitDefinition, TraitProfile> traitDefToProfile;
        Dictionary<CdmTraitDefinition, TraitProfile> traitDefToProfileNoClassifiers;
        Dictionary<CdmTraitDefinition, TraitProfile> traitDefToProfileNoMeta;
        Dictionary<TraitProfile, TraitProfile> profToPromotedProfile = null;
        Dictionary<TraitProfile, TraitProfile> profToCleanedProfile = null;
        Dictionary<string, TraitProfile> referenceCache = null;
        public TraitProfileCache()
        {

        }

        internal bool AddContext(string level)
        {
            if (this.stack == null)
            {
                this.stack = new HashSet<string>();
            }
            else
            {
                if (this.stack.Contains(level))
                {
                    return false;
                }
            }
            this.stack.Add(level);
            return true;
        }

        internal bool RemoveContext(string level)
        {
            if (this.stack != null)
            {
                return this.stack.Remove(level);
            }
            return false;
        }

        internal TraitProfile SaveDefinitionProfile(CdmTraitDefinition traitDef, TraitProfile defProf, bool noMeta, bool noClassifiers)
        {
            if (traitDefToProfile == null)
            {
                traitDefToProfile = new Dictionary<CdmTraitDefinition, TraitProfile>();
                traitDefToProfileNoClassifiers = new Dictionary<CdmTraitDefinition, TraitProfile>();
                traitDefToProfileNoMeta = new Dictionary<CdmTraitDefinition, TraitProfile>();
            }
            if (noClassifiers == false && noMeta == false)
            {
                traitDefToProfile.Add(traitDef, defProf);
            }
            if (noClassifiers == true && noMeta == false)
            {
                traitDefToProfileNoClassifiers.Add(traitDef, defProf);
            }
            if (noMeta == true)
            {
                traitDefToProfileNoMeta.Add(traitDef, defProf);
            }
            return defProf;
        }

        internal TraitProfile GetDefinitionProfile(CdmTraitDefinition traitDef, bool noMeta, bool noClassifiers)
        {
            if (traitDefToProfile == null)
                return null;
            TraitProfile found = null;

            if (noClassifiers == false && noMeta == false)
            {
                if (this.traitDefToProfile.TryGetValue(traitDef, out found) == false)
                    return null;
            }
            if (noClassifiers == true && noMeta == false)
            {
                if (this.traitDefToProfileNoClassifiers.TryGetValue(traitDef, out found) == false)
                    return null;
            }
            if (noMeta == true)
            {
                if (this.traitDefToProfileNoMeta.TryGetValue(traitDef, out found) == false)
                    return null;
            }
            return found;
        }

        internal TraitProfile SavePromotedDefinitionProfile(TraitProfile promoted, TraitProfile defProf)
        {
            if (profToPromotedProfile == null)
            {
                profToPromotedProfile = new Dictionary<TraitProfile, TraitProfile>();
            }
            profToPromotedProfile.Add(defProf, promoted);
            return defProf;
        }

        internal TraitProfile GetPromotedDefinitionProfile(TraitProfile profToFind)
        {
            if (profToPromotedProfile == null)
                return null;
            TraitProfile found;
            if (this.profToPromotedProfile.TryGetValue(profToFind, out found) == true)
            {
                return found;
            }
            return null;
        }
        internal TraitProfile SaveCleanedDefinitionProfile(TraitProfile cleaned, TraitProfile promoted)
        {
            if (profToCleanedProfile == null)
            {
                profToCleanedProfile = new Dictionary<TraitProfile, TraitProfile>();
            }
            profToCleanedProfile.Add(promoted, cleaned);
            return cleaned;
        }
        internal TraitProfile GetCleanedDefinitionProfile(TraitProfile promoted)
        {
            if (profToCleanedProfile == null)
                return null;
            TraitProfile found;
            if (this.profToCleanedProfile.TryGetValue(promoted, out found) == true)
            {
                return found;
            }
            return null;
        }
        /// <summary>
        /// returns a traitProfile from the cache that is exactly like the supplied profile 
        /// OR adds the supplied profile to the cache 
        /// </summary>
        /// <param name="prof">the profile to seek</param>
        /// <returns>the equivalent profile from the cache</returns>
        public TraitProfile GetEquivalentReference(TraitProfile prof)
        {
            if (this.referenceCache == null)
            {
                this.referenceCache = new Dictionary<string, TraitProfile>();
            }
            var testWith = TraitProfileKeyFactory.getKey(prof);
            TraitProfile equivalent;
            if (this.referenceCache.TryGetValue(testWith, out equivalent) == false)
            {
                equivalent = prof;
                this.referenceCache.Add(testWith, prof);
            }

            return equivalent;
        }
    }

}
