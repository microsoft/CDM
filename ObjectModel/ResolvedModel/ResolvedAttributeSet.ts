import {
    applierContext,
    AttributeContextImpl,
    AttributeContextParameters,
    ICdmAttributeContext,
    ICdmAttributeDef,
    ParameterValue,
    ParameterValueSet,
    refCounted,
    ResolvedAttribute,
    ResolvedTrait,
    ResolvedTraitSet,
    resolveOptions,
    spewCatcher,
    traitAction,
    TraitApplier,
    TraitParamSpec,
    TraitSpec
} from '../internal';

export class ResolvedAttributeSet extends refCounted {
    public resolvedName2resolvedAttribute: Map<string, ResolvedAttribute>;
    public baseTrait2Attributes: Map<string, Set<ResolvedAttribute>>;
    public ra2attCtxSet: Map<ResolvedAttribute, Set<ICdmAttributeContext>>;
    public attCtx2ra: Map<ICdmAttributeContext, ResolvedAttribute>;
    public set: ResolvedAttribute[];
    public attributeContext: ICdmAttributeContext;
    public insertOrder: number;

    constructor() {
        super();
        // let bodyCode = () =>
        {
            this.resolvedName2resolvedAttribute = new Map<string, ResolvedAttribute>();
            this.ra2attCtxSet = new Map<ResolvedAttribute, Set<ICdmAttributeContext>>();
            this.attCtx2ra = new Map<ICdmAttributeContext, ResolvedAttribute>();
            this.set = [];
        }
        // return p.measure(bodyCode);
    }

    public setAttributeContext(under: ICdmAttributeContext): void {
        this.attributeContext = under;
    }

    public createAttributeContext(resOpt: resolveOptions, acp: AttributeContextParameters): ICdmAttributeContext {
        // let bodyCode = () =>
        {
            if (!acp) {
                return undefined;
            }
            // store the current context
            this.attributeContext = AttributeContextImpl.createChildUnder(resOpt, acp);

            return this.attributeContext;
        }
        // return p.measure(bodyCode);
    }

    public cacheAttributeContext(attCtx: ICdmAttributeContext, ra: ResolvedAttribute): void {
        this.attCtx2ra.set(attCtx, ra);
        // set collection will take care of adding context to set
        if (!this.ra2attCtxSet.has(ra)) {
            this.ra2attCtxSet.set(ra, new Set<ICdmAttributeContext>());
        }
        this.ra2attCtxSet.get(ra).add(attCtx);
    }

    public merge(toMerge: ResolvedAttribute, attCtx?: AttributeContextImpl): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            let rasResult: ResolvedAttributeSet;
            if (toMerge) {
                if (this.resolvedName2resolvedAttribute.has(toMerge.resolvedName)) {
                    let existing: ResolvedAttribute = this.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                    if (this.refCnt > 1 && existing.target !== toMerge.target) {
                        rasResult = this.copy(); // copy on write
                        existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                    }
                    if ((existing.target as ResolvedAttributeSet).set && (toMerge.target as ResolvedAttributeSet).set) {
                        existing.target = (existing.target as ResolvedAttributeSet)
                            .mergeSet(toMerge.target as ResolvedAttributeSet);
                    } else {
                        existing.target = toMerge.target; // replace with newest version
                    }

                    const rtsMerge: ResolvedTraitSet = existing.resolvedTraits.mergeSet(toMerge.resolvedTraits); // newest one may replace
                    if (rtsMerge !== existing.resolvedTraits) {
                        rasResult = (rasResult === undefined ? this : rasResult).copy(); // copy on write
                        existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                        existing.resolvedTraits = rtsMerge;
                    }
                } else {
                    if (this.refCnt > 1) {
                        rasResult = this.copy();
                    } // copy on write
                    if (!rasResult) {
                        rasResult = this;
                    }
                    rasResult.resolvedName2resolvedAttribute.set(toMerge.resolvedName, toMerge);
                    // don't use the attCtx on the actual attribute, that's only for doing appliers
                    if (attCtx) {
                        rasResult.cacheAttributeContext(attCtx, toMerge);
                    }
                    // toMerge.insertOrder = rasResult.set.length;
                    (rasResult === undefined ? this : rasResult).set.push(toMerge);
                }
                this.baseTrait2Attributes = undefined;
            }

            return rasResult === undefined ? this : rasResult;
        }
        // return p.measure(bodyCode);
    }

    public copyAttCtxMappingsInto(ra2attCtxSet: Map<ResolvedAttribute, Set<ICdmAttributeContext>>,
                                  attCtx2ra: Map<ICdmAttributeContext, ResolvedAttribute>,
                                  sourceRa: ResolvedAttribute, newRa?: ResolvedAttribute): void {
        if (this.ra2attCtxSet.size > 0) {
            if (!newRa) {
                newRa = sourceRa;
            }
            // get the set of attribute contexts for the old resolved attribute
            const attCtxSet: Set<ICdmAttributeContext> = this.ra2attCtxSet.get(sourceRa);
            if (attCtxSet) {
                // map the new resolved attribute to the old context set
                ra2attCtxSet.set(newRa, attCtxSet);
                // map the old contexts to the new resolved attribute
                for (const attCtx of attCtxSet.values()) {
                    attCtx2ra.set(attCtx, newRa);
                }
            }
        }
    }

    public mergeSet(toMerge: ResolvedAttributeSet): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            let rasResult: ResolvedAttributeSet = this;
            if (toMerge) {
                const l: number = toMerge.set.length;
                for (let i: number = 0; i < l; i++) {
                    // don't pass in the context here
                    const rasMerged: ResolvedAttributeSet = rasResult.merge(toMerge.set[i]);
                    if (rasMerged !== rasResult) {
                        rasResult = rasMerged;
                    }
                    // copy context here
                    toMerge.copyAttCtxMappingsInto(rasResult.ra2attCtxSet, rasResult.attCtx2ra, toMerge.set[i]);
                }
            }

            return rasResult;
        }
        // return p.measure(bodyCode);
    }

    public applyTraits(traits: ResolvedTraitSet, actions: traitAction[]): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            let rasResult: ResolvedAttributeSet = this;
            let rasApplied: ResolvedAttributeSet;

            if (this.refCnt > 1 && rasResult.copyNeeded(traits, actions)) {
                rasResult = rasResult.copy();
            }
            rasApplied = rasResult.apply(traits, actions);

            // now we are that
            rasResult.resolvedName2resolvedAttribute = rasApplied.resolvedName2resolvedAttribute;
            rasResult.baseTrait2Attributes = undefined;
            rasResult.set = rasApplied.set;

            return rasResult;
        }
        // return p.measure(bodyCode);
    }

    public copyNeeded(traits: ResolvedTraitSet, actions: traitAction[]): boolean {
        // let bodyCode = () =>
        {
            if (!actions || actions.length === 0) {
                return false;
            }

            // for every attribute in the set, detect if a merge of traits will alter the traits.
            // if so, need to copy the attribute set to avoid overwrite
            const l: number = this.set.length;
            for (let i: number = 0; i < l; i++) {
                const resAtt: ResolvedAttribute = this.set[i];
                for (const currentTraitAction of actions) {
                    const ctx: applierContext = { resOpt: traits.resOpt, resAttSource: resAtt, resTrait: currentTraitAction.rt };
                    if (currentTraitAction.applier.willAttributeModify(ctx)) {
                        return true;
                    }
                }
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public apply(traits: ResolvedTraitSet, actions: traitAction[]): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            if (!traits && actions.length === 0) {
                // nothing can change
                return this;
            }
            // for every attribute in the set run any attribute appliers
            const appliedAttSet: ResolvedAttributeSet = new ResolvedAttributeSet();
            const l: number = this.set.length;
            for (let i: number = 0; i < l; i++) {
                const resAtt: ResolvedAttribute = this.set[i];
                const subSet: ResolvedAttributeSet = resAtt.target as ResolvedAttributeSet;
                if (subSet.set) {
                    // the set contains another set. process those
                    resAtt.target = subSet.apply(traits, actions);
                } else {
                    const rtsMerge: ResolvedTraitSet = resAtt.resolvedTraits.mergeSet(traits);
                    resAtt.resolvedTraits = rtsMerge;

                    if (actions) {
                        for (const currentTraitAction of actions) {
                            const ctx: applierContext = { resOpt: traits.resOpt, resAttSource: resAtt, resTrait: currentTraitAction.rt };
                            if (currentTraitAction.applier.willAttributeModify(ctx)) {
                                currentTraitAction.applier.doAttributeModify(ctx);
                            }
                        }
                    }
                }
                appliedAttSet.merge(resAtt);
            }

            appliedAttSet.ra2attCtxSet = this.ra2attCtxSet;
            appliedAttSet.attCtx2ra = this.attCtx2ra;

            return appliedAttSet;
        }
        // return p.measure(bodyCode);
    }

    public removeRequestedAtts(marker: [number, number]): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            // the marker tracks the track the deletes 'under' a certain index
            let countIndex: number = marker['0'];
            let markIndex: number = marker['1'];

            // for every attribute in the set run any attribute removers on the traits they have
            let appliedAttSet: ResolvedAttributeSet;
            const l: number = this.set.length;
            for (let iAtt: number = 0; iAtt < l; iAtt++) {
                let resAtt: ResolvedAttribute = this.set[iAtt];
                // possible for another set to be in this set
                const subSet: ResolvedAttributeSet = resAtt.target as ResolvedAttributeSet;
                if (subSet.set) {
                    // well, that happened. so now we go around again on this same function and get rid of things from this group
                    marker['0'] = countIndex;
                    marker['1'] = markIndex;
                    const newSubSet: ResolvedAttributeSet = subSet.removeRequestedAtts(marker);
                    countIndex = marker['0'];
                    markIndex = marker['1'];
                    // replace the set with the new one that came back
                    resAtt.target = newSubSet;
                    // if everything went away, then remove this group
                    if (!newSubSet || !newSubSet.set || newSubSet.set.length === 0) {
                        resAtt = undefined;
                    } else {
                        // don't count this as an attribute (later)
                        countIndex--;
                    }
                } else {
                    if (resAtt.resolvedTraits && resAtt.resolvedTraits.applierCaps && resAtt.resolvedTraits.applierCaps.canRemove) {
                        const ltraits: number = resAtt.resolvedTraits.size;
                        for (let i: number = 0; resAtt && i < ltraits; i++) {
                            const rt: ResolvedTrait = resAtt.resolvedTraits.set[i];
                            if (resAtt && rt.trait.modifiesAttributes) {
                                const ctx: applierContext = { resOpt: resAtt.resolvedTraits.resOpt, resAttSource: resAtt, resTrait: rt };
                                const traitAppliers: TraitApplier[] = rt.trait.getTraitAppliers();
                                if (traitAppliers) {
                                    const lappliers: number = traitAppliers.length;
                                    for (let ita: number = 0; ita < lappliers; ita++) {
                                        const apl: TraitApplier = traitAppliers[ita];
                                        if (resAtt && apl.willRemove) {
                                            if (apl.willRemove(ctx)) {
                                                // this makes all the loops stop
                                                resAtt = undefined;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (resAtt) {
                    // attribute remains
                    // are we building a new set?
                    if (appliedAttSet) {
                        this.copyAttCtxMappingsInto(appliedAttSet.ra2attCtxSet, appliedAttSet.attCtx2ra, resAtt);
                        appliedAttSet.merge(resAtt);
                    }
                    countIndex++;
                } else {
                    // remove the att
                    // if this is the first removed attribute, then make a copy of the set now
                    // after this point, the rest of the loop logic keeps the copy going as needed
                    if (!appliedAttSet) {
                        appliedAttSet = new ResolvedAttributeSet();
                        for (let iCopy: number = 0; iCopy < iAtt; iCopy++) {
                            this.copyAttCtxMappingsInto(appliedAttSet.ra2attCtxSet, appliedAttSet.attCtx2ra, this.set[iCopy]);
                            appliedAttSet.merge(this.set[iCopy]);
                        }
                    }
                    // track deletes under the mark (move the mark up)
                    if (countIndex < markIndex) {
                        markIndex--;
                    }
                }
            }

            marker['0'] = countIndex;
            marker['1'] = markIndex;

            // now we are that (or a copy)
            let rasResult: ResolvedAttributeSet = this;
            if (appliedAttSet && appliedAttSet.size !== rasResult.size) {
                rasResult = appliedAttSet;
                rasResult.baseTrait2Attributes = undefined;
                rasResult.attributeContext = this.attributeContext;
            }

            return rasResult;
        }
        // return p.measure(bodyCode);
    }

    public getAttributesWithTraits(resOpt: resolveOptions, queryFor: TraitSpec | TraitSpec[]): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            // put the input into a standard form
            const query: (TraitParamSpec)[] = [];
            if (queryFor instanceof Array) {
                const l: number = queryFor.length;
                for (let i: number = 0; i < l; i++) {
                    const q: TraitSpec = queryFor[i];
                    if (typeof (q) === 'string') {
                        query.push({ traitBaseName: q, params: [] });
                    } else {
                        query.push(q);
                    }
                }
            } else {
                if (typeof (queryFor) === 'string') {
                    query.push({ traitBaseName: queryFor, params: [] });
                } else {
                    query.push(queryFor);
                }
            }

            // if the map isn't in place, make one now.
            // assumption is that this is called as part of a usage pattern where it will get called again.
            if (!this.baseTrait2Attributes) {
                this.baseTrait2Attributes = new Map<string, Set<ResolvedAttribute>>();
                const l: number = this.set.length;
                for (let i: number = 0; i < l; i++) {
                    // create a map from the name of every trait found in this whole set of
                    // attributes to the attributes that have the trait (included base classes of traits)
                    const resAtt: ResolvedAttribute = this.set[i];
                    const traitNames: Set<string> = resAtt.resolvedTraits.collectTraitNames();
                    traitNames.forEach((tName: string) => {
                        if (!this.baseTrait2Attributes.has(tName)) {
                            this.baseTrait2Attributes.set(tName, new Set<ResolvedAttribute>());
                        }
                        this.baseTrait2Attributes.get(tName)
                            .add(resAtt);
                    });
                }
            }
            // for every trait in the query, get the set of attributes.
            // intersect these sets to get the final answer
            let finalSet: Set<ResolvedAttribute>;
            const lQuery: number = query.length;
            for (let i: number = 0; i < lQuery; i++) {
                const q: TraitParamSpec = query[i];
                if (this.baseTrait2Attributes.has(q.traitBaseName)) {
                    let subSet: Set<ResolvedAttribute> = this.baseTrait2Attributes.get(q.traitBaseName);
                    if (q.params && q.params.length) {
                        // need to check param values, so copy the subset to something we can modify
                        const filteredSubSet: Set<ResolvedAttribute> = new Set<ResolvedAttribute>();
                        subSet.forEach((ra: ResolvedAttribute) => {
                            // get parameters of the the actual trait matched
                            const pvals: ParameterValueSet = ra.resolvedTraits.find(resOpt, q.traitBaseName).parameterValues;
                            // compare to all query params
                            const lParams: number = q.params.length;
                            let iParam: number;
                            for (iParam = 0; iParam < lParams; iParam++) {
                                const param: { paramName: string; paramValue: string } = q.params[i];
                                const pv: ParameterValue = pvals.getParameterValue(param.paramName);
                                if (!pv || pv.getValueString(resOpt) !== param.paramValue) {
                                    break;
                                }
                            }
                            // stop early means no match
                            if (iParam === lParams) {
                                filteredSubSet.add(ra);
                            }
                        });
                        subSet = filteredSubSet;
                    }
                    if (subSet && subSet.size) {
                        // got some. either use as starting point for answer or intersect this in
                        if (!finalSet) {
                            finalSet = subSet;
                        } else {
                            const intersection: Set<ResolvedAttribute> = new Set<ResolvedAttribute>();
                            // intersect the two
                            finalSet.forEach((ra: ResolvedAttribute) => {
                                if (subSet.has(ra)) {
                                    intersection.add(ra);
                                }
                            });
                            finalSet = intersection;
                        }
                    }
                }
            }

            // collect the final set into a resolvedAttributeSet
            if (finalSet && finalSet.size) {
                const rasResult: ResolvedAttributeSet = new ResolvedAttributeSet();
                finalSet.forEach((ra: ResolvedAttribute) => {
                    rasResult.merge(ra);
                });

                return rasResult;
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public get(name: string): ResolvedAttribute {
        // let bodyCode = () =>
        {
            let raFound: ResolvedAttribute = this.resolvedName2resolvedAttribute.get(name);
            if (raFound) {
                return raFound;
            }

            if (this.set && this.set.length) {
                // deeper look. first see if there are any groups held in this group
                for (const ra of this.set) {
                    if ((ra.target as ResolvedAttributeSet).set) {
                        raFound = (ra.target as ResolvedAttributeSet).get(name);
                        if (raFound) {
                            return raFound;
                        }
                    }
                }
                // nothing found that way, so now look through the attribute definitions for a match
                for (const ra of this.set) {
                    const attLook: ICdmAttributeDef = ra.target as ICdmAttributeDef;
                    if (attLook.getName && attLook.getName() === name) {
                        return ra;
                    }
                }
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public get size(): number {
        return this.resolvedName2resolvedAttribute.size;
    }
    public copy(): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            const copy: ResolvedAttributeSet = new ResolvedAttributeSet();
            copy.attributeContext = this.attributeContext;
            const l: number = this.set.length;

            // save the mappings to overwrite
            // maps from merge may not be correct
            const newRa2attCtxSet: Map<ResolvedAttribute, Set<ICdmAttributeContext>> = new Map<ResolvedAttribute, Set<ICdmAttributeContext>>();
            const newAttCtx2ra: Map<ICdmAttributeContext, ResolvedAttribute> = new Map<ICdmAttributeContext, ResolvedAttribute>();

            for (let i: number = 0; i < l; i++) {
                const sourceRa: ResolvedAttribute = this.set[i];
                const copyRa: ResolvedAttribute = sourceRa.copy();

                this.copyAttCtxMappingsInto(newRa2attCtxSet, newAttCtx2ra, sourceRa, copyRa);
                copy.merge(copyRa);
            }
            // reset mappings to the correct one
            copy.ra2attCtxSet = newRa2attCtxSet;
            copy.attCtx2ra = newAttCtx2ra;

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string, nameSort: boolean): void {
        // let bodyCode = () =>
        {
            const l: number = this.set.length;
            if (l > 0) {
                let list: ResolvedAttribute[] = this.set;
                if (nameSort) {
                    list = list.sort((lhs: ResolvedAttribute, rhs: ResolvedAttribute) => lhs.resolvedName.localeCompare(rhs.resolvedName));
                }
                for (let i: number = 0; i < l; i++) {
                    list[i].spew(resOpt, to, indent, nameSort);
                }
            }
        }
        // return p.measure(bodyCode);
    }
}
