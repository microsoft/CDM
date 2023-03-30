// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import exp = require('node:constants');
import { Entity, EntityReferenceDefinition } from 'Persistence/CdmFolder/types';
import { IPersistence } from '../Persistence/Common/IPersistence';
import { PersistenceLayer } from '../Persistence/PersistenceLayer';
import {
    ArgumentValue,
    CdmEntityReference,
    CdmObjectBase,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitReference,
    CdmTraitReferenceBase,
    copyOptions,
    ParameterCollection,
    ParameterValueSet,
    resolveOptions,
    spewCatcher,
    traitProfile,
    traitProfileCache
} from '../internal';

/**
     * @internal
     */
export class ResolvedTrait {
    public trait: CdmTraitDefinition;
    /**
     * @internal
     */
    public parameterValues: ParameterValueSet;
    public explicitVerb: CdmTraitReference;
    public metaTraits: Array<CdmTraitReferenceBase>;

    constructor(trait: CdmTraitDefinition, pc: ParameterCollection, values: ArgumentValue[], wasSet: boolean[], explicitVerb: CdmTraitReference, metaTraits: Array<CdmTraitReferenceBase> ) {
        // let bodyCode = () =>
        {
            if (pc && pc.sequence && pc.sequence.length) {
                this.parameterValues = new ParameterValueSet(trait.ctx, pc, values, wasSet);
            }
            this.trait = trait;
            this.explicitVerb = explicitVerb;
            if (metaTraits !== undefined) {
                this.metaTraits = metaTraits.slice(0);
            }
        }
        // return p.measure(bodyCode);
    }

    public get traitName(): string {
        // let bodyCode = () =>
        {
            return this.trait.declaredPath;
        }
        // return p.measure(bodyCode);
    }

    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string): void {
        // let bodyCode = () =>
        {
            to.spewLine(`${indent}[${this.traitName}]`);
            if (this.parameterValues) {
                this.parameterValues.spew(resOpt, to, `${indent}-`);
            }
        }
        // return p.measure(bodyCode);
    }

    public copy(): ResolvedTrait {
        // let bodyCode = () =>
        {
            let pc: ParameterCollection = undefined;
            let values: Array<ArgumentValue> = undefined;
            let wasSet: Array<boolean> = undefined;
            let metaTraits: Array<CdmTraitReferenceBase> = undefined;

            if (this.parameterValues) {
                const copyParamValues: ParameterValueSet = this.parameterValues.copy();
                pc = copyParamValues.pc;
                values = copyParamValues.values;
                wasSet = copyParamValues.wasSet;
            }
            if (this.metaTraits !== undefined) {
                metaTraits = this.metaTraits.slice(0);
            }

            return new ResolvedTrait(this.trait, pc, values, wasSet, this.explicitVerb, metaTraits);
        }
        // return p.measure(bodyCode);
    }

    public collectTraitNames(resOpt: resolveOptions, into: Set<string>): void {
        // let bodyCode = () =>
        {
            // get the name of this trait and all of its base classes
            let t: CdmTraitDefinition = this.trait;
            while (t) {
                const name: string = t.getName();
                if (!into.has(name)) {
                    into.add(name);
                }
                const baseRef: CdmTraitReference = t.fetchExtendsTrait();
                t = (baseRef ? baseRef.fetchObjectDefinition(resOpt) : undefined);
            }
        }
        // return p.measure(bodyCode);
    }

    /// Adds a 'meta' trait to a resolved trait object
    /// collection stays null until used to save space
    /// </summary>
    /// <param name="trait"> the trait reference to place in the metaTraits collection</param>
    /// <param name="verb"> a verb trait to use along with the ref. can be null for default verb</param>
    public addMetaTrait(trait: CdmTraitReference, verb: CdmTraitReference): void {
        if (this.metaTraits === undefined) {
            this.metaTraits = new Array<CdmTraitReferenceBase>();
        }
        trait.verb = verb;
        this.metaTraits.push(trait);
    }

    /// creates a TraitProfile from a resolved trait
    /// normally these would come from a trait reference or definition, so we need to 
    /// put some things back together to make this look right
    /// <param name="resOpt"></param>
    /// <param name="cache">optional cache object to speed up and make consistent the fetching of profiles for a larger set of objects</param>
    /// <param name="forVerb">optional 'verb' name to use as a filter. I only want profiles applied with 'means' for example</param>
    /// <returns>the profile object, perhaps from the cache</returns>
    public fetchTraitProfile(resOpt: resolveOptions, cache: traitProfileCache = undefined, forVerb: string = undefined): traitProfile {
        if (cache === undefined) {
            cache = new traitProfileCache();
        }
        // start with the profile of the definition
        let definition = traitProfile.traitDefToProfile(this.trait, resOpt, false, false, cache);
        let result: traitProfile = new traitProfile();

        // encapsulate and promote
        result.references = definition;
        result.traitName = definition.traitName;

        // move over any verb set or metatraits set on this reference
        if (this.explicitVerb !== undefined) {
            result.verb = traitProfile.traitRefToProfile(this.explicitVerb, resOpt, true, true, true, cache);
        }
        if (result.verb !== undefined && forVerb !== undefined && result.verb.traitName !== forVerb) {
            // filter out now
            result = undefined;
        }
        else
        {
            if (this.metaTraits !== undefined) {
                result.metaTraits = traitProfile.traitCollectionToProfileList(this.metaTraits, resOpt, result.metaTraits, true, cache);
                result.removeClassifiersFromMeta();
            }

            // if there are arguments set in this resolved trait, list them
            if (this.parameterValues !== undefined && this.parameterValues.length > 0) {
                let argMap = new Map<string, string | undefined | object>()
                let l = this.parameterValues.length;
                for (let i = 0; i < l; i++) {
                    let p = this.parameterValues.fetchParameterAtIndex(i);
                    let v = this.parameterValues.fetchValue(i);
                    let name = p.name;
                    if (name === undefined) {
                        name = i.toString();
                    }
                    var value = traitProfile.fetchProfileArgumentFromTraitArgument(v, resOpt);
                    if (value !== undefined) {
                        argMap.set(name, value);
                    }
                }

                if (argMap.size > 0) {
                    result.argumentValues = argMap;
                }
            }
        }
        return result;
    }

}
