// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { EntityReferenceDefinition } from 'Persistence/CdmFolder/types';
import { IPersistence } from 'Persistence/Common/IPersistence';
import { AttributeReference } from 'Persistence/ModelJson/types';
import {
    ArgumentValue,
    CdmAttributeReference,
    CdmConstantEntityDefinition,
    CdmEntityReference,
    CdmObjectBase,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitGroupDefinition,
    CdmTraitGroupReference,
    CdmTraitReference,
    CdmTraitReferenceBase,
    copyOptions,
    ResolvedTrait,
    resolveOptions
} from '../internal';
import { PersistenceLayer } from '../Persistence';

/// <summary>
/// The object returned from the FetchTraitProfile API
/// represents an expanded picture of a trait reference including:
/// The structure represents either a trait definition or a trait reference
/// IF the references member is not undefined, this is a trait reference else a definition
/// Definition has
///     1. traitName: the defined name of the trait
///     2. explanation: undefined or any text provided in the definition
///     3. IS_A: undefined or a reference profile for the base trait if the definition extends another trait
///     4. references: undefined
///     5. Verb: undefined or a reference profile for the defaultVerb of the definition if there is one
///     6. Arguments: undefined or if parameters are defined on the trait a map from parameter name to any default value defined for the parameter else undefined
///     7. classifications: undefined or an array of reference profiles for any 'exhibitedTraits' of the trait definition that use the 'classifiedAs' verb.
///     8. MetaTrait: undefined or an array of reference profiles for any 'exhibitedTraits' of the trait definition that DO NOT use the 'classifiedAs' verb.
/// Reference has
///     1. traitName: the name of the referenced trait
///     2. explanation: undefined
///     3. IS_A: undefined
///     4. references: a definition profile for the referenced trait
///     5. Verb: undefined or a reference profile for any verb applied in this reference
///     6. Arguments: undefined or if arguments are set at this reference then a map from argument name to set value
///     7. classifications: undefined or an array of reference profiles for any 'appliedTraits' at this reference that use the 'classifiedAs' verb.
///     8. MetaTrait: undefined or an array of reference profiles for any 'appliedTraits' at this reference that DO NOT use the 'classifiedAs' verb.
/// </summary>
export class traitProfile {
    /// <summary>
    /// For Definition: the defined name of the trait
    /// For Reference: the name of the referenced trait
    /// </summary>
    public traitName: string | undefined;
    /// <summary>
    /// For Definition: undefined or any text provided in the definition
    /// For Reference: undefined
    /// </summary>
    public explanation: string | undefined;
    /// <summary>
    /// For Definition: undefined or a reference profile for the base trait if the definition extends another trait
    /// For Reference: undefined
    /// </summary>
    public IS_A : traitProfile | undefined;
    /// <summary>
    /// For Definition: undefined
    /// For Reference: a definition profile for the referenced trait
    /// </summary>
    public references : traitProfile | undefined;
    /// <summary>
    /// For Definition: undefined or a reference profile for the defaultVerb of the definition if there is one
    /// For Reference: undefined or a reference profile for any verb applied in this reference
    /// </summary>
    public verb : traitProfile | undefined;
    /// <summary>
    /// For Definition: undefined or if parameters are defined on the trait a map from parameter name to any default value defined for the parameter else undefined
    /// For Reference: undefined or if arguments are set at this reference then a map from argument name to set value
    /// </summary>
    public argumentValues : Map<string, object | string | undefined> | undefined;
    /// <summary>
    /// For Definition: undefined or an array of reference profiles for any 'exhibitedTraits' of the trait definition that use the 'classifiedAs' verb.
    /// For Reference: undefined or an array of reference profiles for any 'appliedTraits' at this reference that use the 'classifiedAs' verb.
    /// </summary>
    public classifications : Array<traitProfile> | undefined;
    /// <summary>
    /// For Definition: undefined or an array of reference profiles for any 'exhibitedTraits' of the trait definition that DO NOT use the 'classifiedAs' verb.
    /// For Reference: undefined or an array of reference profiles for any 'appliedTraits' at this reference that DO NOT use the 'classifiedAs' verb.
    /// </summary>
    public metaTraits : Array<traitProfile> | undefined;

    // need a way to unique ID object instances
    private static nextTrId:number = 1;
    trId : string;
    public constructor() {
        this.trId = `${traitProfile.nextTrId++}_`;
    }

    // searches the chain of references and IS_A references for a profile with the given name
    // if B IS_A ref A
    // C IS_A ref B
    // then (ref C).isA('A') is true
    public isA(extendedName: string) : boolean {
        let seek: traitProfile  = this
        while (seek !== undefined) {
            if (seek.traitName === extendedName)
                return true;
            
            if (seek.IS_A !== undefined)
                seek = seek.IS_A;
            else if (seek.references !== undefined)
                seek = seek.references;
            else
                seek = undefined;
        }
        return false;
    }

    // find the same verb that would bubble to this point in consolidated profiles
    public appliedVerb() : traitProfile {
        let seek: traitProfile = this;
        while (seek != null) {
            if (seek.verb != null)
                return seek.verb;
            if (seek.IS_A != null)
                seek = seek.IS_A;
            else if (seek.references != null)
                seek = seek.references;
            else
                seek = null;
        }
        return null;
    }
    
    /// <summary>
    /// Is this trait profile defined as using or being applied with the 'classifiedAs' verb so it represents the classification of other objects
    /// </summary>
    /// <returns>true if true</returns>
    public isClassification(): boolean {
        let seek: traitProfile  = this;
        while (seek !== undefined) {
            if (seek.verb !== undefined) {
                return seek.verb.traitName === "classifiedAs";
            }
            if (seek.IS_A !== undefined) {
                seek = seek.IS_A;
            } else if (seek.references !== undefined) {
                seek = seek.references;
            } else {
                seek = undefined;
            }
        }
        return false;
    }

    /// <summary>
    /// makes a new trait profile that is a 'shallow' copy of the source (this)
    /// shallow meaning fresh collections are created but any referenced profiles remain as before
    /// </summary>
    /// <returns>a new trait profile as a copy of this</returns>
    public copy(): traitProfile | undefined {
        let copy: traitProfile = new traitProfile();

        copy.traitName = this.traitName;
        copy.explanation = this.explanation;
        copy.IS_A = this.IS_A;
        copy.references = this.references;
        copy.verb = this.verb;
        if (this.argumentValues !== undefined) {
            copy.argumentValues = new Map<string, object | string | undefined>(this.argumentValues);
        }
        if (this.classifications !== undefined) {
            copy.classifications = this.classifications.slice(0);
        }
        if (this.metaTraits !== undefined) {
            copy.metaTraits = this.metaTraits.slice(0);
        }
        return copy;
    }

    /// <summary>
    /// converts a value taken from a trait argument and returns a version that can be persisted. 
    /// these are used as the argument map values in trait profiles
    /// </summary>
    /// <returns>a persist friendly version of the value</returns>
    public static fetchProfileArgumentFromTraitArgument(value: ArgumentValue, resOpt: resolveOptions): object | string | undefined
    {
        if (value === undefined) {
            return undefined;
        }
        if (typeof(value) === 'object' && (value as CdmObjectBase).objectType === cdmObjectType.entityRef) {
            // turn constant ent refs in arg values into a nicer persisted shape object
            const persistenceClass: IPersistence = PersistenceLayer.fetchPersistenceClass(cdmObjectType.entityRef, 'CdmFolder');
            const refAsObj = persistenceClass.toData<CdmEntityReference, EntityReferenceDefinition>(value as CdmEntityReference, resOpt, new copyOptions());
            return refAsObj;
        } else if (typeof(value) === 'object' && (value as CdmObjectBase).objectType === cdmObjectType.attributeRef) {
            // turn constant ent refs in arg values into a nicer persisted shape object
            const persistenceClass: IPersistence = PersistenceLayer.fetchPersistenceClass(cdmObjectType.attributeRef, 'CdmFolder');
            const refAsObj = persistenceClass.toData<CdmAttributeReference, AttributeReference>(value as CdmAttributeReference, resOpt, new copyOptions());
            return refAsObj;
        } else {
            let strVal = value.toString();
            if (strVal !== undefined && strVal !== ''){
                return strVal;
            }
        }
        return undefined;
    }

    /// <summary>
    /// given a persist friendly argument value from a profile argument map, turn that into a constant entity (if it is one)
    /// </summary>
    /// <returns>a constant entity definition found from the input</returns>
    public static fetchConstantEntityFromProfileArgument(argValue: object | string | undefined, resOpt: resolveOptions): CdmConstantEntityDefinition | undefined {
        if (argValue === undefined || typeof(argValue) === 'string')
            return undefined;

        // must be a ref to constant entity shape. make a real object from it
        let entRefArg: CdmEntityReference = PersistenceLayer.fromData<CdmEntityReference>(resOpt.wrtDoc.ctx, argValue);
        if (entRefArg === undefined)
            return undefined;

        // get the definition of the constant entity
        var constEntDef = entRefArg.fetchObjectDefinition<CdmConstantEntityDefinition>(resOpt);
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

    public static consolidateList(toConsolidate: Array<traitProfile>, cache:traitProfileCache = undefined): Array<traitProfile> | undefined {
        if (cache === undefined) {
            cache = new traitProfileCache();
        }
        return traitProfile._consolidateList(toConsolidate, cache);
    }
    public consolidate(cache: traitProfileCache = undefined): traitProfile | undefined {
        if (cache === undefined) {
            cache = new traitProfileCache();
        }
        let consProf = this.promoteFromBase(cache);
        return consProf.removeNakedReferences(cache);
    }

    /**
     * @internal
     */
     private static _consolidateList(toConsolidate: Array<traitProfile>, cache: traitProfileCache): Array<traitProfile> | undefined
    {
        let result = new Array<traitProfile>();
        for (const prof of toConsolidate) {
            // promote verbs, explanations and classification traits up from the base definition
            let consProf = prof.promoteFromBase(cache);
            result.push(consProf);
        }
        toConsolidate = result;
        result = new Array<traitProfile>();
        for (const prof of toConsolidate) {
            // remove extra layers of references that add no information and reuse references where possible
            var consProf = prof.removeNakedReferences(cache);
            result.push(consProf);
        }

        return result;
    }

    /**
     * @internal
     */
    private takePromoValues(source: traitProfile): void {
        // promote explanation unless this sets one
        if (this.explanation === undefined) {
            this.explanation = source.explanation;
        }
        // promote verb unless this def sets one
        if (this.verb === undefined) {
            this.verb = source.verb;
        }
        // copy or add the classifications
        if (source.classifications !== undefined && source.classifications.length > 0) {
            if (this.classifications === undefined) {
                this.classifications = source.classifications.slice(0);
            } else {
                this.classifications = this.classifications.concat(source.classifications);
            }
        }
    }

    /**
     * @internal
     */
    private promoteFromBase(cache: traitProfileCache): traitProfile {
        let result:traitProfile = this;
        if (this.references === undefined) {
            // we must be a trait def pointing to a ref of extended or empty
            // done this before?
            let cached: traitProfile = cache.getPromotedDefinitionProfile(this);
            if (cached !== undefined) {
                return cached;
            }

            // new definition seen
            // since we get modified, make a copy
            result = this.copy();
            if (result.IS_A !== undefined) {
                let isaRef: traitProfile = result.IS_A.promoteFromBase(cache);
                result.IS_A = isaRef;
                // pull up values from ref and then clean it up
                result.takePromoValues(isaRef);
                // clean ref
                isaRef.classifications = undefined;
                isaRef.verb = undefined;
            }

            // save this so we only do it once
            cache.savePromotedDefinitionProfile(result, this);
            let cleaned = result.copy();
            cleaned.classifications = undefined;
            cleaned.verb = undefined;
            cache.saveCleanedDefinitionProfile(cleaned, result);
        } else  {
            // we must be a trait reference to a trait def
            let isaDef = this.references.promoteFromBase(cache);
            // promote to this
            result = this.copy();
            result.takePromoValues(isaDef);
            // get the 'cleaned' base as our base
            result.references = cache.getCleanedDefinitionProfile(isaDef);
        }

        if (result.metaTraits !== undefined) {
            result.metaTraits = traitProfile.promoteFromBaseList(result.metaTraits, cache);
        }
        return result;
    }

    /**
     * @internal
     */
    private static promoteFromBaseList(toConsolidate: Array<traitProfile>, cache: traitProfileCache): Array<traitProfile> | undefined {
        let result = new Array<traitProfile>();
        for (const prof of toConsolidate) {
            // promote verbs, explanations and classification traits up from the base definition
            var consProf = prof.promoteFromBase(cache);
            result.push(consProf);
        }
        return result;
    }

    /**
     * @internal
     */
     private removeNakedReferences(cache: traitProfileCache): traitProfile {
        let result = this.copy();
        if (result.IS_A !== undefined) {
            result.IS_A = result.IS_A.removeNakedReferences(cache);
        }
        if (result.references !== undefined) {
            result.references = result.references.removeNakedReferences(cache);
        }
        if (result.verb !== undefined) {
            result.verb = result.verb.removeNakedReferences(cache);
        }
        if (result.metaTraits !== undefined) {
            result.metaTraits = traitProfile.removeNakedReferencesList(result.metaTraits, cache);
        }

        if (result.references !== undefined) {
            // if this reference is not interesting then move info down to a copy of the thing being referenced
            if (result.metaTraits === undefined || result.metaTraits.length === 0) {
                var newResult = result.references.copy();
                newResult.verb = result.verb;
                newResult.classifications = result.classifications;
                newResult.argumentValues = result.argumentValues;
                if (result.explanation !== undefined) {
                    newResult.explanation = result.explanation;
                }
                newResult = cache.getEquivalentReference(newResult);
                return newResult;
            } else {
                // the other option is that this reference is interesting but the thing being referenced is NOT. so just "remove" it
                if (result.references.metaTraits === undefined || result.references.metaTraits.length===0) {
                    let newResult = result.copy();
                    newResult.IS_A = result.references.IS_A;
                    newResult.references = undefined;
                    newResult = cache.getEquivalentReference(newResult);
                    return newResult;
                }
            }
        }

        return cache.getEquivalentReference(result);
    }

    /**
     * @internal
     */
     private static removeNakedReferencesList(toConsolidate: Array<traitProfile>, cache: traitProfileCache): Array<traitProfile> | undefined
    {
        let result = new Array<traitProfile>();
        for (const prof of toConsolidate) {
            // remove extra layers of references that add no information and reuse references where possible
            var consProf = prof.removeNakedReferences(cache);
            result.push(consProf);
        }
        return result;
    }

    /**
     * @internal
     */
     public static traitDefToProfile(traitDef: CdmTraitDefinition, resOpt: resolveOptions, isVerb: boolean, isMeta: boolean, cache: traitProfileCache) : traitProfile|undefined {
        if (cache === undefined) {
            cache = new traitProfileCache();
        }
        var result = new traitProfile();
        let traitName = traitDef.traitName;
        result.traitName = traitName;
        result.explanation = traitDef.explanation;
        let extTrait: traitProfile = undefined;
        if (cache.addContext(traitName) === true) {
            let tpCache: traitProfile  = cache.getDefinitionProfile(traitDef, isVerb, isMeta);
            if (tpCache !== undefined) {
                cache.removeContext(traitName);
                return tpCache;
            }

            if (!isVerb) {
                if (traitDef.extendsTrait !== undefined) {
                    // get details, only include classifiers if this is along the main path, don't get args
                    extTrait = traitProfile.traitRefToProfile(traitDef.extendsTrait, resOpt, false, isMeta, false, cache);
                    result.IS_A = extTrait;
                }
                if (traitDef.defaultVerb !== undefined) {
                    // get verb info, no classifications wanted args ok
                    result.verb = traitProfile.traitRefToProfile(traitDef.defaultVerb, resOpt, true, true, true, cache);
                }
                if (traitDef.exhibitsTraits !== undefined && traitDef.exhibitsTraits.length > 0) {
                    // get sub traits include classifications
                    var subTraits = traitProfile.traitCollectionToProfileList(traitDef.exhibitsTraits.allItems, resOpt, result.metaTraits, isMeta, cache);
                    if (subTraits !== undefined) {
                        result.metaTraits = subTraits;
                        result.removeClassifiersFromMeta();
                    }
                }
            }
            cache.removeContext(traitName);

            cache.saveDefinitionProfile(traitDef, result, isVerb, isMeta);
        }

        return result;
    }

    /**
     * @internal
     */
    public static traitRefToProfile(trb: CdmTraitReferenceBase, resOpt: resolveOptions, isVerb: boolean, isMeta: boolean, includeArgs: boolean, cache: traitProfileCache): traitProfile | undefined {
        if (cache === undefined) {
            cache = new traitProfileCache();
        }
        let result = new traitProfile();
        let traitName = trb.fetchObjectDefinitionName();
        result.traitName = traitName;
        if (cache.addContext(traitName)) {
            cache.removeContext(traitName);
            // is this a traitgroup ref or a trait ref?
            let tr: CdmTraitReference = trb as CdmTraitReference;

            // trait
            if (tr !== undefined) {
                let traitDef = tr.fetchObjectDefinition<CdmTraitDefinition>(resOpt);
                if (traitDef !== undefined) {
                    result.references = traitProfile.traitDefToProfile(traitDef, resOpt, isVerb, isMeta, cache);
                }
                if (tr.verb !== undefined) {
                    // get info, a verb without classifications but args if set
                    result.verb = traitProfile.traitRefToProfile(tr.verb, resOpt, true, true, true, cache);
                }
                if (tr.appliedTraits !== undefined && tr.appliedTraits.length > 0) {
                    // get sub traits but include classification only if requested
                    var subTraits = traitProfile.traitCollectionToProfileList(tr.appliedTraits.allItems, resOpt, result.metaTraits, true, cache);
                    if (subTraits !== undefined) {
                        result.metaTraits = subTraits;
                        result.removeClassifiersFromMeta();
                    }
                }

                if (includeArgs)
                {
                    var args = tr.fetchFinalArgumentValues(resOpt);
                    if (args !== undefined && args.size > 0) {
                        let argMap = new Map<string, object | string | undefined>();

                        for (const av of args) {
                            var value = traitProfile.fetchProfileArgumentFromTraitArgument(av[1], resOpt);
                            if (value !== undefined) {
                                argMap.set(av[0], value);
                            }

                        }
                        if (argMap.size > 0) {
                            result.argumentValues = argMap;
                        }
                    }
                }
                result = cache.getEquivalentReference(result);
            }
            else
            {
                // must be a trait group. so get the immediate members and unfold the list
                var tg = (trb as CdmTraitGroupReference).fetchObjectDefinition<CdmTraitGroupDefinition>(resOpt);
                if (tg !== undefined) {
                    result.metaTraits = traitProfile.traitCollectionToProfileList(tg.exhibitsTraits.allItems, resOpt, undefined, true, cache);
                }
            }
        }
        return result;
    }

    /**
     * @internal
     */
    public static traitCollectionToProfileList(trCol: Array<CdmTraitReferenceBase>, resOpt: resolveOptions, accumulateInList: Array<traitProfile>, isMeta: boolean, cache: traitProfileCache): Array<traitProfile> {
        if (cache === undefined) {
            cache = new traitProfileCache();
        }
        let result: Array<traitProfile>  = new Array<traitProfile>();

        // if given a previous place, move over everything but maybe skip the classifiers
        if (accumulateInList !== undefined) {
            for (const oldProf of accumulateInList) {
                if (!isMeta || !oldProf.isClassification()) {
                    result.push(oldProf);
                }
            }
        }
        // run over all traits and get a profile
        for (const tr of trCol) {
            var current = traitProfile.traitRefToProfile(tr, resOpt, false, isMeta, true, cache); // not a verb, no classifiers for sub, args ok
            if (!isMeta || !current.isClassification())
                result.push(current);
        }
        if (result.length === 0) {
            return undefined;
        }
        return result;
    }

    /**
     * @internal
     */
     public removeClassifiersFromMeta(): void  {
        if (this.metaTraits !== undefined && this.metaTraits.length > 0) {
            let newExtTraits: Array<traitProfile> = new Array<traitProfile>();
            let classifierTraits: Array<traitProfile> = new Array<traitProfile>();
            for (const extr of this.metaTraits) {
                if (extr.isClassification()) {
                    classifierTraits.push(extr);
                } else {
                    newExtTraits.push(extr);
                }
            }
            this.metaTraits = undefined;
            if (newExtTraits.length > 0) {
                this.metaTraits = newExtTraits;
            }
            if (classifierTraits.length > 0)
            {
                if (this.classifications === undefined) {
                    this.classifications = new Array<traitProfile>();
                }
                this.classifications = this.classifications.concat(classifierTraits);
            }
        }
    }
}

/**
 * @internal
 * a helper object that encapsulates the work of producing a 'key' for a trait profile
 * a key is a string that can distinctly identity the trait name, arguments and any applied 
 * trait combinations. 
 * the goal is that two traitProfiles with the same childrent and names etc. will produce identical 
 * keys and can be considered to be the same object
 */
export class traitProfileKeyFactory {
    /**
     * @internal
     * returns a key for a collection of trait profiles as [prof key, prof key]
     */
    public static collectionGetKey(col:Array<traitProfile>): string {
        if (col === undefined || col.length === 0) {
            return '[]';
        }
        let key='[';
        for (const t of col) {
            key += t.trId;
        }
        key += ']'

        return key;
    }
    /**
     * @internal
     * get the key for a profile 
     * form is traitName i:{isA key} r:{references key} v:{verb key} a:{arguments key} c:{classifications key} m:{meta traits key}
     */
    public static getKey(prof: traitProfile) {
        let iKey = prof.IS_A === undefined ? '0' : prof.IS_A.trId;
        let rKey = prof.references === undefined ? '0' : prof.references.trId;
        let vKey = prof.verb === undefined ? '0' : prof.verb.trId;
        let aKey = '[]';
        if (prof.argumentValues !== undefined && prof.argumentValues.size > 0){
            aKey = '[';
            prof.argumentValues.forEach((v,k)=>{
                aKey += '{';
                aKey += k;
                aKey += '=';
                aKey += JSON.stringify(v);
                aKey += '}';
            });
            aKey += ']';
        }

        let cKey = traitProfileKeyFactory.collectionGetKey(prof.classifications);
        let mKey = traitProfileKeyFactory.collectionGetKey(prof.metaTraits);
        return `${prof.traitName} i:${iKey} r:${rKey} v:${vKey} a:${aKey} c:${cKey} m:${mKey}`;
    }
}

/// Encapsulates a scope of caching for trait profiles
/// this object is created by an API user and passed as an argument, but is meant to be mostly opaque 
/// in terms of operation or content
export class traitProfileCache {
    stack: Set<string> = undefined;
    traitDefToProfile: Map<CdmTraitDefinition, traitProfile> = undefined;
    traitDefToProfileNoClassifiers: Map<CdmTraitDefinition, traitProfile> = undefined;
    traitDefToProfileNoMeta: Map<CdmTraitDefinition, traitProfile> = undefined;
    profToPromotedProfile: Map<traitProfile, traitProfile> = undefined;
    profToCleanedProfile: Map<traitProfile, traitProfile> = undefined;
    referenceCache: Map<string, traitProfile> = undefined;

    public constructor() {

    }

    /**
     * @internal
     */
     public addContext(level: string): boolean {
        if (this.stack === undefined) {
            this.stack = new Set<string>();
        } else {
            if (this.stack.has(level)) {
                return false;
            }
        }
        this.stack.add(level);
        return true;
    }

    /**
     * @internal
     */
     public removeContext(level: string): boolean {
        if (this.stack !== undefined) {
            return this.stack.delete(level);
        }
        return false;
    }

    /**
     * @internal
     */
     public saveDefinitionProfile(traitDef: CdmTraitDefinition, defProf: traitProfile, noMeta: boolean, noClassifiers:boolean): traitProfile | undefined {
        if (this.traitDefToProfile === undefined) {
            this.traitDefToProfile = new Map<CdmTraitDefinition, traitProfile>();
            this.traitDefToProfileNoClassifiers = new Map<CdmTraitDefinition, traitProfile>();
            this.traitDefToProfileNoMeta = new Map<CdmTraitDefinition, traitProfile>();
        }
        if (noClassifiers === false && noMeta === false) {
            this.traitDefToProfile.set(traitDef, defProf);
        }
        if (noClassifiers === true && noMeta === false) {
            this.traitDefToProfileNoClassifiers.set(traitDef, defProf);
        }
        if (noMeta === true) {
            this.traitDefToProfileNoMeta.set(traitDef, defProf);
        }
        return defProf;
    }

    /**
     * @internal
     */
     public getDefinitionProfile(traitDef: CdmTraitDefinition, noMeta: boolean, noClassifiers: boolean): traitProfile | undefined {
        if (this.traitDefToProfile === undefined) {
            return undefined;
        }
        let found: traitProfile = undefined;

        if (noClassifiers === false && noMeta === false) {
            if (this.traitDefToProfile.has(traitDef)) {
                found = this.traitDefToProfile.get(traitDef);
            }
        }
        if (noClassifiers === true && noMeta === false) {
            if (this.traitDefToProfileNoClassifiers.has(traitDef)) {
                found = this.traitDefToProfileNoClassifiers.get(traitDef);
            }
        }
        if (noMeta === true) {
            if (this.traitDefToProfileNoMeta.has(traitDef)) {
                found = this.traitDefToProfileNoMeta.get(traitDef);
            }
        }
        return found;
    }

    /**
     * @internal
     */
     public savePromotedDefinitionProfile(promoted: traitProfile, defProf:traitProfile): traitProfile | undefined {
        if (this.profToPromotedProfile === undefined) {
            this.profToPromotedProfile = new Map<traitProfile, traitProfile>();
        }
        this.profToPromotedProfile.set(defProf, promoted);
        return defProf;
    }

    /**
     * @internal
     */
     public getPromotedDefinitionProfile(profToFind: traitProfile): traitProfile | undefined {
        if (this.profToPromotedProfile === undefined) {
            return undefined;
        }
        let found: traitProfile;
        if (this.profToPromotedProfile.has(profToFind)) {
            return this.profToPromotedProfile.get(profToFind);
        }
        return undefined;
    }
    /**
     * @internal
     */
     public saveCleanedDefinitionProfile(cleaned: traitProfile, promoted: traitProfile): traitProfile | undefined {
        if (this.profToCleanedProfile === undefined) {
            this.profToCleanedProfile = new Map<traitProfile, traitProfile>();
        }
        this.profToCleanedProfile.set(promoted, cleaned);
        return cleaned;
    }
    /**
     * @internal
     */
     public getCleanedDefinitionProfile(promoted: traitProfile): traitProfile | undefined {
        if (this.profToCleanedProfile === undefined) {
            return undefined;
        }
        let found: traitProfile;
        if (this.profToCleanedProfile.has(promoted)) {
            return this.profToCleanedProfile.get(promoted);
        }
        return undefined;
    }
    /**
     * returns a traitProfile from the cache that is exactly like the supplied profile 
     * OR adds the supplied profile to the cache 
     */
     public getEquivalentReference(prof: traitProfile): traitProfile | undefined {
        if (this.referenceCache === undefined) {
            this.referenceCache = new Map<string, traitProfile>();
        }
        let testWith = traitProfileKeyFactory.getKey(prof);
        let equivalent: traitProfile;
        if (!this.referenceCache.has(testWith)) {
            equivalent = prof;
            this.referenceCache.set(testWith, prof);
        } else {
            equivalent = this.referenceCache.get(testWith);
        }

        return equivalent;
    }

}
