import {
    applierAction,
    applierContext,
    applierQuery,
    AttributeContextImpl,
    AttributeContextParameters,
    ICdmAttributeContext,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedTrait,
    ResolvedTraitSet,
    resolveOptions,
    traitAction,
    TraitApplier,
    TraitApplierCapabilities
} from '../internal';

export class ResolvedAttributeSetBuilder {
    public ras: ResolvedAttributeSet;
    public inheritedMark: number;

    public actionsModify: traitAction[];
    public actionsGroupAdd: traitAction[];
    public actionsRoundAdd: traitAction[];
    public actionsAttributeAdd: traitAction[];
    public traitsToApply: ResolvedTraitSet;

    constructor() {
        this.ras = new ResolvedAttributeSet();
    }

    public mergeAttributes(rasNew: ResolvedAttributeSet): void {
        // let bodyCode = () =>
        {
            if (rasNew) {
                this.takeReference(this.ras.mergeSet(rasNew));
            }
        }
        // return p.measure(bodyCode);
    }

    public takeReference(rasNew: ResolvedAttributeSet): void {
        // let bodyCode = () =>
        {
            if (this.ras !== rasNew) {
                if (rasNew) {
                    rasNew.addRef();
                }
                if (this.ras) {
                    this.ras.release();
                }
                this.ras = rasNew;
            }
        }
        // return p.measure(bodyCode);
    }
    public giveReference(): ResolvedAttributeSet {
        const rasRef: ResolvedAttributeSet = this.ras;
        if (this.ras) {
            this.ras.release();
            if (this.ras.refCnt === 0) {
                this.ras = undefined;
            }
        }

        return rasRef;
    }

    public ownOne(ra: ResolvedAttribute): void {
        // let bodyCode = () =>
        {
            // save the current context
            const attCtx: ICdmAttributeContext = this.ras.attributeContext;
            this.takeReference(new ResolvedAttributeSet());
            this.ras.merge(ra, ra.attCtx);
            // reapply the old attribute context
            this.ras.setAttributeContext(attCtx);
        }
        // return p.measure(bodyCode);
    }

    public prepareForTraitApplication(traits: ResolvedTraitSet): void {
        // let bodyCode = () =>
        {
            // collect a set of appliers for all traits
            this.traitsToApply = traits;
            if (traits && traits.applierCaps) {
                this.actionsModify = [];
                this.actionsGroupAdd = [];
                this.actionsRoundAdd = [];
                this.actionsAttributeAdd = [];

                const l: number = traits.size;
                for (let i: number = 0; i < l; i++) {
                    const rt: ResolvedTrait = traits.set[i];
                    if (rt.trait.modifiesAttributes) {
                        const traitAppliers: TraitApplier[] = rt.trait.getTraitAppliers();
                        if (traitAppliers) {
                            const ltraits: number = traitAppliers.length;
                            for (let ita: number = 0; ita < ltraits; ita++) {
                                // Collect the code that will perform the right action.
                                // Associate with the resolved trait and get the priority
                                const apl: TraitApplier = traitAppliers[ita];
                                let action: traitAction;
                                if (apl.willAttributeModify && apl.doAttributeModify) {
                                    action = { rt: rt, applier: apl };
                                    this.actionsModify.push(action);
                                }
                                if (apl.willAttributeAdd && apl.doAttributeAdd) {
                                    action = { rt: rt, applier: apl };
                                    this.actionsAttributeAdd.push(action);
                                }
                                if (apl.willGroupAdd && apl.doGroupAdd) {
                                    action = { rt: rt, applier: apl };
                                    this.actionsGroupAdd.push(action);
                                }
                                if (apl.willRoundAdd && apl.doRoundAdd) {
                                    action = { rt: rt, applier: apl };
                                    this.actionsRoundAdd.push(action);
                                }
                            }
                        }
                    }
                }
                // sorted by priority
                this.actionsModify = this.actionsModify.sort(
                    (lhs: traitAction, rhs: traitAction) => lhs.applier.priority - rhs.applier.priority);
                this.actionsGroupAdd = this.actionsGroupAdd.sort(
                    (lhs: traitAction, rhs: traitAction) => lhs.applier.priority - rhs.applier.priority);
                this.actionsRoundAdd = this.actionsRoundAdd.sort(
                    (lhs: traitAction, rhs: traitAction) => lhs.applier.priority - rhs.applier.priority);
                this.actionsAttributeAdd = this.actionsAttributeAdd.sort(
                    (lhs: traitAction, rhs: traitAction) => lhs.applier.priority - rhs.applier.priority);
            }
        }
        // return p.measure(bodyCode);
    }

    public applyTraits(): void {
        // let bodyCode = () =>
        {
            if (this.ras && this.traitsToApply) {
                this.takeReference(this.ras.applyTraits(this.traitsToApply, this.actionsModify));
            }
        }
        // return p.measure(bodyCode);
    }

    public generateTraitAttributes(applyTraitsToNew: boolean): void {
        // let bodyCode = () =>
        {
            if (!this.traitsToApply || !this.traitsToApply.applierCaps) {
                return;
            }

            if (!this.ras) {
                this.takeReference(new ResolvedAttributeSet());
            }

            // get the new atts and then add them one at a time into this set
            const newAtts: ResolvedAttribute[] = this.getTraitGeneratedAttributes(true, applyTraitsToNew);
            if (newAtts) {
                const l: number = newAtts.length;
                let ras: ResolvedAttributeSet = this.ras;
                for (let i: number = 0; i < l; i++) {
                    // here we want the context that was created in the appliers
                    ras = ras.merge(newAtts[i], newAtts[i].attCtx);
                }
                this.takeReference(ras);
            }
        }
        // return p.measure(bodyCode);
    }
    public removeRequestedAtts(): void {
        // let bodyCode = () =>
        {
            if (this.ras) {
                const marker: [number, number] = [0, 0];
                marker['1'] = this.inheritedMark;
                this.takeReference(this.ras.removeRequestedAtts(marker));
                this.inheritedMark = marker['1'];
            }
        }
        // return p.measure(bodyCode);
    }
    public markInherited(): void {
        // let bodyCode = () =>
        {
            if (this.ras && this.ras.set) {
                this.inheritedMark = this.ras.set.length;

                const countSet: (rasSub: ResolvedAttributeSet, offset: number) => number =
                    (rasSub: ResolvedAttributeSet, offset: number): number => {
                        let last: number = offset;
                        if (rasSub && rasSub.set) {
                            for (const resolvedSet of rasSub.set) {
                                if ((resolvedSet.target as ResolvedAttributeSet).set) {
                                    last = countSet((resolvedSet.target as ResolvedAttributeSet), last);
                                } else {
                                    last++;
                                }
                            }
                        }

                        return last;
                    };
                this.inheritedMark = countSet(this.ras, 0);
            } else {
                this.inheritedMark = 0;
            }
        }
        // return p.measure(bodyCode);
    }

    public markOrder(): void {
        // let bodyCode = () =>
        {
            const markSet: (rasSub: ResolvedAttributeSet, inheritedMark: number, offset: number) => number =
                (rasSub: ResolvedAttributeSet, inheritedMark: number, offset: number): number => {
                    let last: number = offset;
                    if (rasSub && rasSub.set) {
                        rasSub.insertOrder = last;
                        for (const resolvedSet of rasSub.set) {
                            if ((resolvedSet.target as ResolvedAttributeSet).set) {
                                last = markSet((resolvedSet.target as ResolvedAttributeSet), inheritedMark, last);
                            } else {
                                if (last >= inheritedMark) {
                                    resolvedSet.insertOrder = last;
                                }
                                last++;
                            }
                        }
                    }

                    return last;
                };
            markSet(this.ras, this.inheritedMark, 0);

        }
        // return p.measure(bodyCode);
    }

    private getTraitGeneratedAttributes(clearState: boolean, applyModifiers: boolean): ResolvedAttribute[] {
        // let bodyCode = () =>
        {
            if (!this.ras || !this.ras.set) {
                return undefined;
            }

            if (!this.traitsToApply || !this.traitsToApply.applierCaps) {
                return undefined;
            }
            const caps: TraitApplierCapabilities = this.traitsToApply.applierCaps;

            if (!(caps.canAttributeAdd || caps.canGroupAdd || caps.canRoundAdd)) {
                return undefined;
            }

            const resAttOut: (ResolvedAttribute)[] = [];

            // this function constructs a 'plan' for building up the resolved attributes
            // that get generated from a set of traits being applied to a set of attributes.
            // it manifests the plan into an array of resolved attributes there are a few levels of hierarchy to consider.
            // 1. once per set of attributes, the traits may want to generate attributes.
            //    this is an attribute that is somehow descriptive of the whole set,
            //    even if it has repeating patterns, like the count for an expanded array.
            // 2. it is possible that some traits (like the array expander) want to keep generating new attributes for some run.
            //    each time they do this is considered a 'round'the traits are given a chance to generate attributes once per round.
            //    every set gets at least one round, so these should be the attributes that describe the set of other attributes.
            //    for example, the foreign key of a relationship or the 'class' of a polymorphic type, etc.
            // 3. for each round, there are new attributes created based on the resolved attributes from the
            //    previous round(or the starting atts for this set) the previous round attribute need to be 'done'
            //    having traits applied before they are used as sources for the current round.
            //    the goal here is to process each attribute completely before moving on to the next one

            // that may need to start out clean
            if (clearState) {
                const toClear: ResolvedAttribute[] = this.ras.set;
                const l: number = toClear.length;
                for (let i: number = 0; i < l; i++) {
                    toClear[i].applierState = undefined;
                }
            }

            const makeResolvedAttribute: (resAttSource: ResolvedAttribute, action: traitAction,
                                          queryAdd: applierQuery, doAdd: applierAction) => applierContext =
                (resAttSource: ResolvedAttribute, action: traitAction, queryAdd: applierQuery, doAdd: applierAction): applierContext => {
                    const appCtx: applierContext = {
                        resOpt: this.traitsToApply.resOpt,
                        attCtx: this.ras.attributeContext,
                        resAttSource: resAttSource,
                        resTrait: action.rt
                    };

                    if (resAttSource && resAttSource.target && (resAttSource.target as ResolvedAttributeSet).set) {
                        return appCtx;
                    } // makes no sense for a group

                    // will something add?
                    if (queryAdd(appCtx)) {
                        // may want to make a new attribute group
                        if (this.ras.attributeContext && action.applier.willCreateContext && action.applier.willCreateContext(appCtx)) {
                            action.applier.doCreateContext(appCtx);
                        }
                        // make a new resolved attribute as a place to hold results
                        appCtx.resAttNew = new ResolvedAttribute(appCtx.resOpt, undefined, undefined, appCtx.attCtx as AttributeContextImpl);
                        // copy state from source
                        appCtx.resAttNew.applierState = {};
                        if (resAttSource && resAttSource.applierState) {
                            Object.assign(appCtx.resAttNew.applierState, resAttSource.applierState);
                        }
                        // if applying traits, then add the sets traits as a staring point
                        if (applyModifiers) {
                            appCtx.resAttNew.resolvedTraits = this.traitsToApply.deepCopy();
                            appCtx.resAttNew.resolvedTraits.collectDirectives(undefined);
                        }
                        // make it
                        doAdd(appCtx);

                        if (applyModifiers) {
                            // add the sets traits back in to this newly added one
                            appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.mergeSet(this.traitsToApply);
                            appCtx.resAttNew.resolvedTraits.collectDirectives(undefined);
                            // do all of the modify traits
                            if (caps.canAttributeModify) {
                                // modify acts on the source and we should be done with it
                                appCtx.resAttSource = appCtx.resAttNew;
                            }
                            for (const modAct of this.actionsModify) {
                                // using a new trait now
                                appCtx.resTrait = modAct.rt;
                                if (modAct.applier.willAttributeModify(appCtx)) {
                                    modAct.applier.doAttributeModify(appCtx);
                                }
                            }
                        }
                        appCtx.resAttNew.completeContext(appCtx.resOpt);
                    }

                    return appCtx;
                };

            // get the one time atts
            if (caps.canGroupAdd) {
                for (const action of this.actionsGroupAdd) {
                    const appCtx: applierContext =
                        makeResolvedAttribute(undefined, action, action.applier.willGroupAdd, action.applier.doGroupAdd);
                    // save it
                    if (appCtx && appCtx.resAttNew) {
                        resAttOut.push(appCtx.resAttNew);
                    }
                }
            }

            // now starts a repeating pattern of rounds
            // first step is to get attribute that are descriptions of the round.
            // do this once and then use them as the first entries in the first set of 'previous' atts for the loop
            let resAttsLastRound: (ResolvedAttribute)[] = [];
            if (caps.canRoundAdd) {
                for (const action of this.actionsRoundAdd) {
                    const appCtx: applierContext =
                        makeResolvedAttribute(undefined, action, action.applier.willRoundAdd, action.applier.doRoundAdd);
                    // save it
                    if (appCtx && appCtx.resAttNew) {
                        // overall list
                        resAttOut.push(appCtx.resAttNew);
                        // previous list
                        resAttsLastRound.push(appCtx.resAttNew);
                    }
                }
            }

            // the first per-round set of attributes is the set owned by this object
            resAttsLastRound = resAttsLastRound.concat(this.ras.set);

            // now loop over all of the previous atts until they all say 'stop'
            if (resAttsLastRound.length) {
                let continues: number = 0;
                do {
                    continues = 0;
                    const resAttThisRound: (ResolvedAttribute)[] = [];
                    if (caps.canAttributeAdd) {
                        for (const att of resAttsLastRound) {
                            for (const action of this.actionsAttributeAdd) {
                                const appCtx: applierContext =
                                    makeResolvedAttribute(att, action, action.applier.willAttributeAdd, action.applier.doAttributeAdd);
                                // save it
                                if (appCtx && appCtx.resAttNew) {
                                    // overall list
                                    resAttOut.push(appCtx.resAttNew);
                                    resAttThisRound.push(appCtx.resAttNew);
                                    if (appCtx.continue) {
                                        continues++;
                                    }
                                }
                            }
                        }
                    }
                    resAttsLastRound = resAttThisRound;

                } while (continues);
            }

            return resAttOut;
        }
        // return p.measure(bodyCode);
    }

}
