// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Encapsulates a scope of caching for trait profiles
 * this object is created by an API user and passed as an argument, but is meant to be mostly opaque 
 * in terms of operation or content
 */
public class TraitProfileCache {
    Set<String> stack;
    Map<CdmTraitDefinition, TraitProfile> traitDefToProfile;
    Map<CdmTraitDefinition, TraitProfile> traitDefToProfileNoClassifiers;
    Map<CdmTraitDefinition, TraitProfile> traitDefToProfileNoMeta;
    Map<TraitProfile, TraitProfile> profToPromotedProfile = null;
    Map<TraitProfile, TraitProfile> profToCleanedProfile = null;
    Map<String, TraitProfile> referenceCache = null;
    public TraitProfileCache() {

    }

    public Boolean addContext(String level) {
        if (this.stack == null) {
            this.stack = new HashSet<String>();
        }
        else {
            if (this.stack.contains(level)) {
                return false;
            }
        }
        this.stack.add(level);
        return true;
    }

    public Boolean removeContext(String level)
    {
        if (this.stack != null) {
            return this.stack.remove(level);
        }
        return false;
    }

    public TraitProfile SaveDefinitionProfile(CdmTraitDefinition traitDef, TraitProfile defProf, Boolean noMeta, Boolean noClassifiers) {
        if (traitDefToProfile == null) {
            traitDefToProfile = new HashMap<CdmTraitDefinition, TraitProfile>();
            traitDefToProfileNoClassifiers = new HashMap<CdmTraitDefinition, TraitProfile>();
            traitDefToProfileNoMeta = new HashMap<CdmTraitDefinition, TraitProfile>();
        }
        if (noClassifiers == false && noMeta == false) {
            traitDefToProfile.put(traitDef, defProf);
        }
        if (noClassifiers == true && noMeta == false) {
            traitDefToProfileNoClassifiers.put(traitDef, defProf);
        }
        if (noMeta == true) {
            traitDefToProfileNoMeta.put(traitDef, defProf);
        }
        return defProf;
    }

    public TraitProfile getDefinitionProfile(CdmTraitDefinition traitDef, Boolean noMeta, Boolean noClassifiers) {
        if (traitDefToProfile == null)
            return null;
        TraitProfile found = null;

        if (noClassifiers == false && noMeta == false) {
            if ((found = this.traitDefToProfile.get(traitDef)) == null)
                return null;
        }
        if (noClassifiers == true && noMeta == false)
        {
            if ((found = this.traitDefToProfileNoClassifiers.get(traitDef)) == null)
                return null;
        }
        if (noMeta == true)
        {
            if ((found = this.traitDefToProfileNoMeta.get(traitDef)) == null)
                return null;
        }
        return found;
    }

    public TraitProfile savePromotedDefinitionProfile(TraitProfile promoted, TraitProfile defProf)
    {
        if (profToPromotedProfile == null) {
            profToPromotedProfile = new HashMap<TraitProfile, TraitProfile>();
        }
        profToPromotedProfile.put(defProf, promoted);
        return defProf;
    }

    public TraitProfile getPromotedDefinitionProfile(TraitProfile profToFind)
    {
        if (profToPromotedProfile == null)
            return null;
        TraitProfile found;
        if ((found = this.profToPromotedProfile.get(profToFind)) != null) {
            return found;
        }
        return null;
    }
    public TraitProfile saveCleanedDefinitionProfile(TraitProfile cleaned, TraitProfile promoted)
    {
        if (profToCleanedProfile == null) {
            profToCleanedProfile = new HashMap<TraitProfile, TraitProfile>();
        }
        profToCleanedProfile.put(promoted, cleaned);
        return cleaned;
    }
    public TraitProfile getCleanedDefinitionProfile(TraitProfile promoted)
    {
        if (profToCleanedProfile == null)
            return null;
        TraitProfile found;
        if ((found = this.profToCleanedProfile.get(promoted)) != null) {
            return found;
        }
        return null;
    }

    // returns a traitProfile from the cache that is exactly like the supplied profile 
    // OR adds the supplied profile to the cache 
    public TraitProfile getEquivalentReference(TraitProfile prof)
    {
        if (this.referenceCache == null) {
            this.referenceCache = new HashMap<String, TraitProfile>();
        }
        String testWith = traitProfileKeyFactory.getKey(prof);
        TraitProfile equivalent;
        if ((equivalent = this.referenceCache.get(testWith)) == null){
            equivalent = prof;
            this.referenceCache.put(testWith, prof);
        }
        return equivalent;
    }
}
