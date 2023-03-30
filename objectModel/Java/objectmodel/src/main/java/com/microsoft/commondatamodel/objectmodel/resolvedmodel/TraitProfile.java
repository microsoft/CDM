// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmConstantEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitGroupReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitGroupDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReferenceBase;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
  * The object returned from the FetchTraitProfile API
  * represents an expanded picture of a trait reference including:
  * The structure represents either a trait definition or a trait reference
  * IF the References member is not null, this is a trait reference else a definition
  * Definition has
  *     1. TraitName: the defined name of the trait
  *     2. Explanation: null or any text provided in the definition
  *     3. IS_A: null or a reference profile for the base trait if the definition extends another trait
  *     4. References: null
  *     5. Verb: null or a reference profile for the defaultVerb of the definition if there is one
  *     6. Arguments: null or if parameters are defined on the trait a map from parameter name to any default value defined for the parameter else null
  *     7. Classifications: null or an array of reference profiles for any 'exhibitedTraits' of the trait definition that use the 'classifiedAs' verb.
  *     8. MetaTrait: null or an array of reference profiles for any 'exhibitedTraits' of the trait definition that DO NOT use the 'classifiedAs' verb.
  * Reference has
  *     1. TraitName: the name of the referenced trait
  *     2. Explanation: null
  *     3. IS_A: null
  *     4. References: a definition profile for the referenced trait
  *     5. Verb: null or a reference profile for any verb applied in this reference
  *     6. Arguments: null or if arguments are set at this reference then a map from argument name to set value
  *     7. Classifications: null or an array of reference profiles for any 'appliedTraits' at this reference that use the 'classifiedAs' verb.
  *     8. MetaTrait: null or an array of reference profiles for any 'appliedTraits' at this reference that DO NOT use the 'classifiedAs' verb.
  * 
  */

  public class TraitProfile {
    /**
      * For Definition: the defined name of the trait
      * For Reference: the name of the referenced trait
      */ 
    private String traitName;
    public void setTraitName(String traitName) {
        this.traitName = traitName;
    }
    public String getTraitName() {
        return this.traitName;
    }

    /**
      * For Definition: null or any text provided in the definition
      * For Reference: null
      */ 
    private String explanation;
    public void setExplanation(String value) {
        this.explanation = value;
    }
    public String getExplanation() {
        return this.explanation;
    }

    /**
      * For Definition: null or a reference profile for the base trait if the definition extends another trait
      * For Reference: null
      */ 
    private TraitProfile IS_A;
    @JsonProperty("IS_A")
    public void setIS_A(TraitProfile value) {
        this.IS_A = value;
    }
    @JsonProperty("IS_A")
    public TraitProfile getIS_A() {
        return this.IS_A;
    }

    /**
      * For Definition: null
      * For Reference: a definition profile for the referenced trait
      */ 
    private TraitProfile references;
    public void setReferences(TraitProfile value) {
        this.references = value;
    }
    public TraitProfile getReferences() {
        return this.references;
    }

    /**
      * For Definition: null or a reference profile for the defaultVerb of the definition if there is one
      * For Reference: null or a reference profile for any verb applied in this reference
      */ 
    private TraitProfile verb;
    public void setVerb(TraitProfile value) {
        this.verb = value;
    }
    public TraitProfile getVerb() {
        return this.verb;
    }

    /**
      * For Definition: null or if parameters are defined on the trait a map from parameter name to any default value defined for the parameter else null
      * For Reference: null or if arguments are set at this reference then a map from argument name to set value
      */ 
    private Map<String, Object> argumentValues;
    public void setArgumentValues(Map<String, Object> value) {
        this.argumentValues = value;
    }
    public Map<String, Object> getArgumentValues() {
        return this.argumentValues;
    }

    /**
      * For Definition: null or an array of reference profiles for any 'exhibitedTraits' of the trait definition that use the 'classifiedAs' verb.
      * For Reference: null or an array of reference profiles for any 'appliedTraits' at this reference that use the 'classifiedAs' verb.
      */ 
    private ArrayList<TraitProfile> classifications;
    public void setClassifications(ArrayList<TraitProfile> value) {
        this.classifications = value;
    }
    public ArrayList<TraitProfile> getClassifications() {
        return this.classifications;
    }

    /**
      * For Definition: null or an array of reference profiles for any 'exhibitedTraits' of the trait definition that DO NOT use the 'classifiedAs' verb.
      * For Reference: null or an array of reference profiles for any 'appliedTraits' at this reference that DO NOT use the 'classifiedAs' verb.
      */ 
    private ArrayList<TraitProfile> metaTraits;
    public void setMetaTraits(ArrayList<TraitProfile> value) {
        this.metaTraits = value;
    }
    public ArrayList<TraitProfile> getMetaTraits() {
        return this.metaTraits;
    }


    // need a way to unique ID object instances
    private static AtomicInteger nextId = new AtomicInteger();
    private String tpId;
    @JsonIgnore
    public String getTpId() {
        return tpId;
    }

    public TraitProfile() {
        this.tpId = nextId.incrementAndGet() + "_";
    }

    // searches the chain of references and IS_A references for a profile with the given name
    // if B IS_A ref A
    // C IS_A ref B
    // then (ref C).isA('A') is true
    public boolean IsA(String extendedName) {
        TraitProfile seek = this;
        while (seek != null) {
            if (seek.getTraitName().equals(extendedName))
                return true;
            
            if (seek.IS_A != null)
                seek = seek.IS_A;
            else if (seek.getReferences() != null)
                seek = seek.getReferences();
            else
                seek = null;
        }
        return false;
    }

    // find the same verb that would bubble to this point in consolidated profiles
    public TraitProfile AppliedVerb() {
        TraitProfile seek = this;
        while (seek != null) {
            if (seek.getVerb() != null)
                return seek.getVerb();
            if (seek.IS_A != null)
                seek = seek.IS_A;
            else if (seek.getReferences() != null)
                seek = seek.getReferences();
            else
                seek = null;
        }
        return null;
    }

    /**
      * Is this trait profile defined as using or being applied with the 'classifiedAs' verb so it represents the classification of other objects
      */ 
    @JsonIgnore
    public boolean isClassification() {
        TraitProfile seek = this;
        while (seek != null){
            if (seek.getVerb() != null){
                return seek.getVerb().getTraitName().equals("classifiedAs");
            }
            if (seek.IS_A != null)
                seek = seek.IS_A;
            else if (seek.getReferences() != null)
                seek = seek.getReferences();
            else
                seek = null;
        }
        return false;
    }

    /**
      * makes a new trait profile that is a 'shallow' copy of the source (this)
      * shallow meaning fresh collections are created but any referenced profiles remain as before
      * @return a new trait profile as a copy of this
      * return 
      */ 
    public TraitProfile copy(){
        TraitProfile copy = new TraitProfile();

        copy.setTraitName(this.traitName);
        copy.setExplanation(this.explanation);
        copy.setIS_A(this.IS_A);
        copy.setReferences(this.references);
        copy.setVerb(this.verb);
        if (this.argumentValues != null){
            HashMap<String, Object> copyArgs = new HashMap<String, Object>();
            copyArgs.putAll(this.argumentValues);
            copy.setArgumentValues(copyArgs);
        }
        if (this.classifications != null) {
            copy.setClassifications(new ArrayList<TraitProfile>(this.classifications));
        }
        if (this.metaTraits != null){
            copy.setMetaTraits(new ArrayList<TraitProfile>(this.metaTraits));
        }
        return copy;
    }

    /**
      * converts a value taken from a trait argument and returns a version that can be persisted. 
      * these are used as the argument map values in trait profiles
      * @returns a persist friendly version of the value
      */ 
    public static Object fetchProfileArgumentFromTraitArgument(Object value, ResolveOptions resOpt) {
        if (value == null) {
            return null;
        }
        if (value instanceof CdmEntityReference) {
            return PersistenceLayer.toData((CdmEntityReference) value, resOpt, new CopyOptions(), "CdmFolder", CdmEntityReference.class);
        }
        else if (value instanceof CdmAttributeReference){
            return PersistenceLayer.toData((CdmAttributeReference) value, resOpt, new CopyOptions(), "CdmFolder", CdmAttributeReference.class);
        }
        else {
            String strVal = value.toString();
            if (strVal != null && strVal != "") {
                return strVal;
            }
        }
        return null;
    }

    /**
      * given a persist friendly argument value from a profile argument map, turn that into a constant entity (if it is one)
      * @returns a constant entity definition found from the input
      */ 
    public static CdmConstantEntityDefinition fetchConstantEntityFromProfileArgument(Object argValue, ResolveOptions resOpt) {
        if (argValue == null)
            return null;

        // must be a ref to constant entity. make a real object from it
        CdmEntityReference entRefArg = (CdmEntityReference) PersistenceLayer.fromData(resOpt.getWrtDoc().getCtx(), argValue, "CdmFolder", CdmEntityReference.class);
        if (entRefArg == null)
            return null;

        // get the definition of the constant entity
        CdmConstantEntityDefinition constEntDef = (CdmConstantEntityDefinition) entRefArg.fetchObjectDefinition(resOpt);
        return constEntDef;
    }

    /**
      * Consolidate action on a set of trait profiles will do a few things to make the profiles easier to work with, compare, store.
      * all classification traits applied or defined along the inheritance chain are promoted to the top most reference and deeper classification lists are removed.
      * the last verb that was applied or defined is also promoted and other verbs are removed.
      * references that add no value (no new verb or meta traits added) are removed from the branches of this tree. 
      * a 'simple' definition profile might get merged into a 'value adding' reference.
      * along the way, duplicate descriptions of definitions or duplicate looking references are turned into single objects
      * @returns a list of the consolidated profiles
      */ 
    public static ArrayList<TraitProfile> consolidateList(List<TraitProfile> toConsolidate) {
        return consolidateList(toConsolidate, null);
    }
    public static ArrayList<TraitProfile> consolidateList(List<TraitProfile> toConsolidate, TraitProfileCache cache) {
        if (cache == null) {
            cache = new TraitProfileCache();
        }
        return _consolidateList(toConsolidate, cache);
    }
    public TraitProfile consolidate() {
        return consolidate(null);
    }
    public TraitProfile consolidate(TraitProfileCache cache) {
        if (cache == null) {
            cache = new TraitProfileCache();
        }
        TraitProfile consProf = this.promoteFromBase(cache);
        return consProf.removeNakedReferences(cache);
    }

    private static ArrayList<TraitProfile> _consolidateList(List<TraitProfile> toConsolidate, TraitProfileCache cache) {
        ArrayList<TraitProfile> result = new ArrayList<TraitProfile>();

        for (TraitProfile prof : toConsolidate) {
            // promote verbs, explanations and classification traits up from the base definition
            TraitProfile consProf = prof.promoteFromBase(cache);
            result.add(consProf);
        }
        toConsolidate = result;
        result = new ArrayList<TraitProfile>();
        for (TraitProfile prof : toConsolidate) {
            // remove extra layers of references that add no information and reuse references where possible
            TraitProfile consProf = prof.removeNakedReferences(cache);
            result.add(consProf);
        }

        return result;
    }

    private void takePromoValues(TraitProfile source) {
        // promote explanation unless this sets one
        if (this.explanation == null) {
            this.explanation = source.getExplanation();
        }
        // promote verb unless this def sets one
        if (this.verb == null) {
            this.verb = source.getVerb();
        }
        // copy or add the classifications
        if (source.classifications != null && source.classifications.size() > 0) {
            if (this.classifications == null) {
                this.classifications = new ArrayList<TraitProfile>(source.getClassifications());
            }
            else {
                this.classifications.addAll(source.getClassifications());
            }
        }
    }
    private TraitProfile promoteFromBase(TraitProfileCache cache) {
        TraitProfile result = this;
        if (this.references == null) {
            // we must be a trait def pointing to a ref of extended or empty
            // done this before?
            TraitProfile cached = cache.getPromotedDefinitionProfile(this);
            if (cached != null) {
                return cached;
            }

            // new definition seen
            // since we get modified, make a copy
            result = this.copy();
            if (result.IS_A != null) {
                TraitProfile isaRef = result.IS_A.promoteFromBase(cache);
                result.IS_A = isaRef;
                // pull up values from ref and then clean it up
                result.takePromoValues(isaRef);
                // clean ref
                isaRef.setClassifications(null);
                isaRef.setVerb(null);
            }

            // save this so we only do it once
            cache.savePromotedDefinitionProfile(result, this);
            TraitProfile cleaned = result.copy();
            cleaned.setClassifications(null);
            cleaned.setVerb(null);
            cache.saveCleanedDefinitionProfile(cleaned, result);
        }
        else {
            // we must be a trait reference to a trait def
            TraitProfile isaDef = this.references.promoteFromBase(cache);
            // promote to this
            result = this.copy();
            result.takePromoValues(isaDef);
            // get the 'cleaned' base as our base
            result.setReferences(cache.getCleanedDefinitionProfile(isaDef));
        }

        if (result.metaTraits != null) {
            result.setMetaTraits(promoteFromBaseList(result.metaTraits, cache));
        }
        return result;
    }
    private static ArrayList<TraitProfile> promoteFromBaseList(ArrayList<TraitProfile> toConsolidate, TraitProfileCache cache)
    {
        ArrayList<TraitProfile> result = new ArrayList<TraitProfile>();
        for (TraitProfile prof : toConsolidate) {
            // promote verbs, explanations and classification traits up from the base definition
            TraitProfile consProf = prof.promoteFromBase(cache);
            result.add(consProf);
        }
        return result;
    }

    private TraitProfile removeNakedReferences(TraitProfileCache cache)
    {
        TraitProfile result = this.copy();
        if (result.IS_A != null) {
            result.IS_A = result.IS_A.removeNakedReferences(cache);
        }
        if (result.references != null) {
            result.setReferences(result.references.removeNakedReferences(cache));
        }
        if (result.verb != null) {
            result.setVerb(result.verb.removeNakedReferences(cache));
        }
        if (result.metaTraits != null) {
            result.setMetaTraits(removeNakedReferencesList(result.metaTraits, cache));
        }

        if (result.references != null) {
            // if this reference is not interesting then move info down to a copy of the thing being referenced
            if (result.metaTraits == null || result.metaTraits.size() == 0) {
                TraitProfile newResult = result.references.copy();
                newResult.setVerb(result.verb);
                newResult.setClassifications(result.classifications);
                newResult.setArgumentValues(result.argumentValues);
                newResult = cache.getEquivalentReference(newResult);
                return newResult;
            }
            else {
                // the other option is that this reference is interesting but the thing being referenced is NOT. so just "remove" it
                if (result.references.metaTraits == null || result.references.metaTraits.size() == 0) {
                    TraitProfile newResult = result.copy();
                    newResult.setIS_A(result.references.IS_A);
                    newResult.setReferences(null);
                    newResult = cache.getEquivalentReference(newResult);
                    return newResult;
                }
            }
        }
        return cache.getEquivalentReference(result);
    }
    private static ArrayList<TraitProfile> removeNakedReferencesList(ArrayList<TraitProfile> toConsolidate, TraitProfileCache cache) {
        ArrayList<TraitProfile> result = new ArrayList<TraitProfile>();
        for (TraitProfile prof : toConsolidate) {
            // remove extra layers of references that add no information and reuse references where possible
            TraitProfile consProf = prof.removeNakedReferences(cache);
            result.add(consProf);
        }
        return result;
    }

    /**
     * I want this to be internal but I need to use it outside this module. 
     * create a TraitProfile object representing a CdmTraitDefinition
     */
    @Deprecated
    public static TraitProfile _traitDefToProfile(CdmTraitDefinition traitDef, ResolveOptions resOpt, boolean isVerb, boolean isMeta, TraitProfileCache cache) {
        if (cache == null) {
            cache = new TraitProfileCache();
        }
        TraitProfile result = new TraitProfile();
        String traitName = traitDef.getTraitName();
        result.setTraitName(traitName);
        result.setExplanation(traitDef.getExplanation());
        TraitProfile extTrait = null;
        if (cache.addContext(traitName) == true) {

            TraitProfile tpCache = cache.getDefinitionProfile(traitDef, isVerb, isMeta);
            if (tpCache != null) {
                cache.removeContext(traitName);
                return tpCache;
            }

            if (!isVerb) {
                if (traitDef.getExtendsTrait() != null) {
                    // get details, only include classifiers if this is along the main path, don't get args
                    extTrait = TraitProfile._traitRefToProfile(traitDef.getExtendsTrait(), resOpt, false, isMeta, false, cache);
                    result.setIS_A(extTrait);
                }
                if (traitDef.getDefaultVerb() != null) {
                    // get verb info, no classifications wanted args ok
                    result.setVerb(TraitProfile._traitRefToProfile(traitDef.getDefaultVerb(), resOpt, true, true, true, cache));
                }
                if (traitDef.getExhibitsTraits() != null && traitDef.getExhibitsTraits().size() > 0) {
                    // get sub traits include classifications
                    ArrayList<TraitProfile> subTraits = TraitProfile.traitCollectionToProfileList(traitDef.getExhibitsTraits().getAllItems(), resOpt, result.metaTraits, isMeta, cache);
                    if (subTraits != null) {
                        result.setMetaTraits(subTraits);
                        result.removeClassifiersFromMeta();
                    }
                }
            }
            cache.removeContext(traitName);

            cache.SaveDefinitionProfile(traitDef, result, isVerb, isMeta);
        }

        return result;
    }

    /**
     * I want this to be internal but I need to use it outside this module. 
     * create a TraitProfile object representing a CdmTraitReference
     */
    
    @Deprecated
    public static TraitProfile _traitRefToProfile(CdmTraitReferenceBase trb, ResolveOptions resOpt, boolean isVerb, boolean isMeta, boolean includeArgs, TraitProfileCache cache) {
        if (cache == null) {
            cache = new TraitProfileCache();
        }
        TraitProfile result = new TraitProfile();
        String traitName = trb.fetchObjectDefinitionName();
        result.setTraitName(traitName);
        if (cache.addContext(traitName)){
            cache.removeContext(traitName);
            // is this a traitgroup ref or a trait ref?
            if (trb instanceof CdmTraitReference)
            {
                CdmTraitReference tr = (CdmTraitReference) trb;

                CdmTraitDefinition traitDef = (CdmTraitDefinition) tr.fetchObjectDefinition(resOpt);
                if (traitDef != null) {
                    result.setReferences(_traitDefToProfile(traitDef, resOpt, isVerb, isMeta, cache));
                }
                if (tr.getVerb() != null) {
                    // get info, a verb without classifications but args if set
                    result.setVerb(_traitRefToProfile(tr.getVerb(), resOpt, true, true, true, cache));
                }
                if (tr.getAppliedTraits() != null && tr.getAppliedTraits().size() > 0) {
                    // get sub traits but include classification only if requested
                    ArrayList<TraitProfile> subTraits = traitCollectionToProfileList(tr.getAppliedTraits().getAllItems(), resOpt, result.metaTraits, true, cache);
                    if (subTraits != null) {
                        result.setMetaTraits(subTraits);
                        result.removeClassifiersFromMeta();
                    }
                }

                if (includeArgs) {
                    Map<String, Object> args = tr.fetchFinalArgumentValues(resOpt);
                    if (args != null && args.size() > 0) {
                        Map<String, Object> argMap = new HashMap<String, Object>();

                        for (Map.Entry<String, Object> av : args.entrySet()) {
                            Object value = TraitProfile.fetchProfileArgumentFromTraitArgument(av.getValue(), resOpt);
                            if (value != null) {
                                argMap.put(av.getKey(), value);
                            }
                        }
                        if (argMap.size() > 0) {
                            result.setArgumentValues(argMap);
                        }
                    }
                }
                result = cache.getEquivalentReference(result);
            }
            else {
                // must be a trait group. so get the immediate members and unfold the list
                CdmTraitGroupDefinition tg = (CdmTraitGroupDefinition) ((CdmTraitGroupReference) trb).fetchObjectDefinition(resOpt);
                if (tg != null) {
                    result.setMetaTraits(traitCollectionToProfileList(tg.getExhibitsTraits().getAllItems(), resOpt, null, true, cache));
                }
            }
        }
        return result;
    }

    static ArrayList<TraitProfile> traitCollectionToProfileList(List<CdmTraitReferenceBase> trCol, ResolveOptions resOpt, ArrayList<TraitProfile> accumulateInList, boolean isMeta, TraitProfileCache cache) {
        if (cache == null) {
            cache = new TraitProfileCache();
        }
        ArrayList<TraitProfile> result = new ArrayList<TraitProfile>();

        // if given a previous place, move over everything but maybe skip the classifiers
        if (accumulateInList != null) {
            for (TraitProfile oldProf : accumulateInList) {
                if (!isMeta || !oldProf.isClassification())
                    result.add(oldProf);
            }
        }
        // run over all traits and get a profile
        for (CdmTraitReferenceBase tr : trCol) {
            TraitProfile current = _traitRefToProfile(tr, resOpt, false, isMeta, true, cache); // not a verb, no classifiers for sub, args ok
            if (!isMeta || !current.isClassification())
                result.add(current);
        }
        if (result.size() == 0)
            return null;
        return result;
    }

    void removeClassifiersFromMeta() {
        if (this.metaTraits != null && this.metaTraits.size() > 0) {
            ArrayList<TraitProfile> newExtTraits = new ArrayList<TraitProfile>();
            ArrayList<TraitProfile> classifierTraits = new ArrayList<TraitProfile>();
            for (TraitProfile extr : this.metaTraits) {
                if (extr.isClassification())
                    classifierTraits.add(extr);
                else
                    newExtTraits.add(extr);
            }
            this.metaTraits = null;
            if (newExtTraits.size() > 0) {
                this.metaTraits = newExtTraits;
            }
            if (classifierTraits.size() > 0) {
                if (this.classifications == null)
                    this.classifications = new ArrayList<TraitProfile>();
                this.classifications.addAll(classifierTraits);
            }
        }
    }
}

/**
  * an internal helper object that encapsulates the work of producing a 'key' for a trait profile
  * a key is a string that can distinctly identity the trait name, arguments and any applied 
  * trait combinations. 
  * the goal is that two traitProfiles with the same childrent and names etc. will produce identical 
  * keys and can be considered to be the same object
  */
class traitProfileKeyFactory
{
    /// returns a key for a collection of trait profiles as [prof key, prof key]
    public static String collectionGetKey(ArrayList<TraitProfile> col) {
        if (col == null || col.size() == 0) {
            return "[]";
        }
        String key="[";
        for(TraitProfile t : col)
        {
            key += t.getTpId();
        }
        key += "]";
        return key;
    }
    /// get the key for a profile 
    /// form is traitName i:{isA key} r:{references key} v:{verb key} a:{arguments key} c:{classifications key} m:{meta traits key}
    public static String getKey(TraitProfile prof) {
        String iKey = prof.getIS_A() == null ? "0" : prof.getIS_A().getTpId();
        String rKey = prof.getReferences() == null ? "0" : prof.getReferences().getTpId();
        String vKey = prof.getVerb() == null ? "0" : prof.getVerb().getTpId();
        String aKey = "[]";
        if (prof.getArgumentValues() != null && prof.getArgumentValues().size() > 0) {
            aKey = "[";
            for (Map.Entry<String, Object> kv : prof.getArgumentValues().entrySet()) {
                aKey += "{";
                aKey += kv.getKey();
                aKey += "=";
                try {
                    aKey += JMapper.WRITER.writeValueAsString(kv.getValue());
                } catch (JsonProcessingException e) {
                    aKey += "failed conversion";
                }
                aKey += "}";
            }
            aKey += "]";
        }
        String cKey = traitProfileKeyFactory.collectionGetKey(prof.getClassifications());
        String mKey = traitProfileKeyFactory.collectionGetKey(prof.getMetaTraits());
        return String.format("%s i:%s r:%s v:%s a:%s c:%s m:%s", prof.getTraitName(), iKey, rKey, vKey, aKey, cKey, mKey);
    }
}
