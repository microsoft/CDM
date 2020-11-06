// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    CdmArgumentDefinition,
    CdmObjectBase,
    CdmTraitDefinition,
    ParameterCollection,
    ParameterValue,
    ResolvedTrait,
    resolveOptions,
    spewCatcher
} from '../internal';

/**
     * @internal
     */
export class ResolvedTraitSet {

    public get size(): number {
        // let bodyCode = () =>
        {
            if (this.set) {
                return this.set.length;
            }

            return 0;
        }
        // return p.measure(bodyCode);
    }

    public get first(): ResolvedTrait {
        // let bodyCode = () =>
        {
            if (this.set) {
                return this.set[0];
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public set: ResolvedTrait[];
    public resOpt: resolveOptions;
    public hasElevated: boolean;
    private readonly lookupByTrait: Map<CdmTraitDefinition, ResolvedTrait>;

    constructor(resOpt: resolveOptions) {
        // let bodyCode = () =>
        {
            this.resOpt = resOpt.copy();
            this.set = [];
            this.lookupByTrait = new Map<CdmTraitDefinition, ResolvedTrait>();
            this.hasElevated = false;
        }
        // return p.measure(bodyCode);
    }

    public merge(toMerge: ResolvedTrait, copyOnWrite: boolean): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            let traitSetResult: ResolvedTraitSet = this;
            const trait: CdmTraitDefinition = toMerge.trait;
            let av: ArgumentValue[];
            let wasSet: boolean[];
            if (toMerge.parameterValues) {
                av = toMerge.parameterValues.values;
                wasSet = toMerge.parameterValues.wasSet;
            }

            if (!this.hasElevated) {
                this.hasElevated = trait.elevated;
            }
            if (traitSetResult.lookupByTrait.has(trait)) {
                let rtOld: ResolvedTrait = traitSetResult.lookupByTrait.get(trait);
                let avOld: ArgumentValue[];
                if (rtOld.parameterValues) {
                    avOld = rtOld.parameterValues.values;
                }
                if (av && avOld) {
                    // the new values take precedence
                    const l: number = av.length;
                    for (let i: number = 0; i < l; i++) {
                        if (av[i] !== avOld[i]) {
                            if (copyOnWrite) {
                                traitSetResult = traitSetResult.shallowCopyWithException(trait);
                                rtOld = traitSetResult.lookupByTrait.get(trait);
                                avOld = rtOld.parameterValues.values;
                                copyOnWrite = false;
                            }

                            avOld[i] = ParameterValue.fetchReplacementValue(this.resOpt, avOld[i], av[i], wasSet[i]);
                        }
                    }
                }
            } else {
                if (copyOnWrite) {
                    traitSetResult = traitSetResult.shallowCopy();
                }
                toMerge = toMerge.copy();
                traitSetResult.set.push(toMerge);
                traitSetResult.lookupByTrait.set(trait, toMerge);
            }

            return traitSetResult;
        }
        // return p.measure(bodyCode);
    }

    public mergeSet(toMerge: ResolvedTraitSet, elevatedOnly: boolean = false): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            let copyOnWrite: boolean = true;
            let traitSetResult: ResolvedTraitSet = this;
            if (toMerge) {
                const l: number = toMerge.set.length;
                for (let i: number = 0; i < l; i++) {
                    const rt: ResolvedTrait = toMerge.set[i];
                    if (!elevatedOnly || rt.trait.elevated) {
                        const traitSetMerge: ResolvedTraitSet = traitSetResult.merge(rt, copyOnWrite);
                        if (traitSetMerge !== traitSetResult) {
                            traitSetResult = traitSetMerge;
                            copyOnWrite = false;
                        }
                    }
                }
            }

            return traitSetResult;
        }
        // return p.measure(bodyCode);
    }

    public get(trait: CdmTraitDefinition): ResolvedTrait {
        // let bodyCode = () =>
        {
            if (this.lookupByTrait.has(trait)) {
                return this.lookupByTrait.get(trait);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public find(resOpt: resolveOptions, traitName: string): ResolvedTrait {
        // let bodyCode = () =>
        {
            const l: number = this.set.length;
            for (let i: number = 0; i < l; i++) {
                const rt: ResolvedTrait = this.set[i];
                if (rt.trait.isDerivedFrom(traitName, resOpt)) {
                    return rt;
                }
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public deepCopy(): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const copy: ResolvedTraitSet = new ResolvedTraitSet(this.resOpt);
            const newSet: ResolvedTrait[] = copy.set;
            const l: number = this.set.length;
            for (let i: number = 0; i < l; i++) {
                let rt: ResolvedTrait = this.set[i];
                rt = rt.copy();
                newSet.push(rt);
                copy.lookupByTrait.set(rt.trait, rt);
            }
            copy.hasElevated = this.hasElevated;

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public shallowCopyWithException(just: CdmTraitDefinition): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const copy: ResolvedTraitSet = new ResolvedTraitSet(this.resOpt);
            const newSet: ResolvedTrait[] = copy.set;
            const l: number = this.set.length;
            for (let i: number = 0; i < l; i++) {
                let rt: ResolvedTrait = this.set[i];
                if (rt.trait === just) {
                    rt = rt.copy();
                }
                newSet.push(rt);
                copy.lookupByTrait.set(rt.trait, rt);
            }
            copy.hasElevated = this.hasElevated;

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public shallowCopy(): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const copy: ResolvedTraitSet = new ResolvedTraitSet(this.resOpt);
            if (this.set) {
                const newSet: ResolvedTrait[] = copy.set;
                const l: number = this.set.length;
                for (let i: number = 0; i < l; i++) {
                    const rt: ResolvedTrait = this.set[i];
                    newSet.push(rt);
                    copy.lookupByTrait.set(rt.trait, rt);
                }
            }
            copy.hasElevated = this.hasElevated;

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public collectTraitNames(): Set<string> {
        // let bodyCode = () =>
        {
            const collection: Set<string> = new Set<string>();
            if (this.set) {
                const l: number = this.set.length;
                for (let i: number = 0; i < l; i++) {
                    const rt: ResolvedTrait = this.set[i];
                    rt.collectTraitNames(this.resOpt, collection);
                }
            }

            return collection;
        }
        // return p.measure(bodyCode);
    }

    public setParameterValueFromArgument(trait: CdmTraitDefinition, arg: CdmArgumentDefinition): void {
        // let bodyCode = () =>
        {
            const resTrait: ResolvedTrait = this.get(trait);
            if (resTrait && resTrait.parameterValues) {
                const av: ArgumentValue[] = resTrait.parameterValues.values;
                const newVal: ArgumentValue = arg.getValue();
                // get the value index from the parameter collection given the parameter that this argument is setting
                const iParam: number = resTrait.parameterValues.indexOf(arg.getParameterDef());
                av[iParam] = ParameterValue.fetchReplacementValue(this.resOpt, av[iParam], newVal, true);
                resTrait.parameterValues.wasSet[iParam] = true;
            }
        }
        // return p.measure(bodyCode);
    }

    public setTraitParameterValue(resOpt: resolveOptions, toTrait: CdmTraitDefinition,
        paramName: string, value: ArgumentValue): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const altered: ResolvedTraitSet = this.shallowCopyWithException(toTrait);
            const currTrait: ResolvedTrait = altered.get(toTrait);
            if (currTrait) {
                currTrait.parameterValues
                    .setParameterValue(this.resOpt, paramName, value);
            }

            return altered;
        }
        // return p.measure(bodyCode);
    }

    public replaceTraitParameterValue(resOpt: resolveOptions, toTrait: string, paramName: string,
        valueWhen: ArgumentValue, valueNew: ArgumentValue): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            let traitSetResult: ResolvedTraitSet = this as ResolvedTraitSet;
            const l: number = traitSetResult.set.length;
            for (let i: number = 0; i < l; i++) {
                let rt: ResolvedTrait = traitSetResult.set[i];
                if (rt && rt.trait.isDerivedFrom(toTrait, this.resOpt)) {
                    if (rt.parameterValues) {
                        const pc: ParameterCollection = rt.parameterValues.pc;
                        let av: ArgumentValue[] = rt.parameterValues.values;
                        const idx: number = pc.fetchParameterIndex(paramName);
                        if (idx !== undefined && av[idx] === valueWhen) {
                            // copy the set and make a deep copy of the trait being set
                            traitSetResult = this.shallowCopyWithException(rt.trait);
                            // assume these are all still true for this copy
                            rt = traitSetResult.set[i];
                            av = rt.parameterValues.values;
                            av[idx] = ParameterValue.fetchReplacementValue(this.resOpt, av[idx], valueNew, true);
                            break;
                        }
                    }
                }
            }

            return traitSetResult;
        }
        // return p.measure(bodyCode);
    }

    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string, nameSort: boolean): void {
        // let bodyCode = () =>
        {
            const l: number = this.set.length;
            let list: ResolvedTrait[] = this.set;
            if (nameSort) {
                list = list.sort((lhs: ResolvedTrait, rhs: ResolvedTrait) => lhs.traitName.localeCompare(rhs.traitName));
            }
            for (let i: number = 0; i < l; i++) {
                // comment this line to simplify spew results to stop at attribute names
                list[i].spew(resOpt, to, indent);
            }
        }
        // return p.measure(bodyCode);
    }
}
