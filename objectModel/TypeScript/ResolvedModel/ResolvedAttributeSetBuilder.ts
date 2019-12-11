import {
    applierAction,
    applierContext,
    applierQuery,
    AttributeContextParameters,
    AttributeResolutionApplier,
    AttributeResolutionApplierCapabilities,
    CdmAttribute,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmAttributeResolutionGuidance,
    CdmObjectBase,
    PrimitiveAppliers,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedTrait,
    ResolvedTraitSet,
    resolveOptions
} from '../internal';

export class AttributeResolutionContext {
    public actionsModify: AttributeResolutionApplier[];
    public actionsGroupAdd: AttributeResolutionApplier[];
    public actionsRoundAdd: AttributeResolutionApplier[];
    public actionsAttributeAdd: AttributeResolutionApplier[];
    public actionsRemove: AttributeResolutionApplier[];
    /**
     * @internal
     */
    public traitsToApply: ResolvedTraitSet;
    /**
     * @internal
     */
    public applierCaps: AttributeResolutionApplierCapabilities;
    public resGuide: CdmAttributeResolutionGuidance;
    public resOpt: resolveOptions;

    constructor(resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance, traits: ResolvedTraitSet) {
        // collect a set of appliers for all traits
        this.traitsToApply = traits;
        this.resGuide = resGuide;
        this.resOpt = resOpt;

        this.actionsModify = [];
        this.actionsGroupAdd = [];
        this.actionsRoundAdd = [];
        this.actionsAttributeAdd = [];
        this.actionsRemove = [];
        this.applierCaps = undefined;

        this.resOpt = CdmObjectBase.copyResolveOptions(resOpt);

        if (resGuide) {
            if (!this.applierCaps) {
                this.applierCaps = {
                    canAlterDirectives: false,
                    canCreateContext: false,
                    canRemove: false,
                    canAttributeModify: false,
                    canGroupAdd: false,
                    canRoundAdd: false,
                    canAttributeAdd: false
                };
            }

            const addApplier = (apl: AttributeResolutionApplier): boolean => {
                // Collect the code that will perform the right action.
                // Associate with the resolved trait and get the priority
                if (apl.willAttributeModify && apl.doAttributeModify) {
                    this.actionsModify.push(apl);
                    this.applierCaps.canAttributeModify = true;
                }
                if (apl.willAttributeAdd && apl.doAttributeAdd) {
                    this.actionsAttributeAdd.push(apl);
                    this.applierCaps.canAttributeAdd = true;
                }
                if (apl.willGroupAdd && apl.doGroupAdd) {
                    this.actionsGroupAdd.push(apl);
                    this.applierCaps.canGroupAdd = true;
                }
                if (apl.willRoundAdd && apl.doRoundAdd) {
                    this.actionsRoundAdd.push(apl);
                    this.applierCaps.canRoundAdd = true;
                }
                if (apl.willAlterDirectives && apl.doAlterDirectives) {
                    this.applierCaps.canAlterDirectives = true;
                    apl.doAlterDirectives(this.resOpt, resGuide);
                }
                if (apl.willCreateContext && apl.doCreateContext) {
                    this.applierCaps.canCreateContext = true;
                }
                if (apl.willRemove) {
                    this.actionsRemove.push(apl);
                    this.applierCaps.canRemove = true;
                }

                return true;
            };

            if (resGuide.removeAttribute) {
                addApplier(PrimitiveAppliers.isRemoved);
            }
            if (resGuide.imposedDirectives) {
                addApplier(PrimitiveAppliers.doesImposeDirectives);
            }
            if (resGuide.removedDirectives) {
                addApplier(PrimitiveAppliers.doesRemoveDirectives);
            }
            if (resGuide.addSupportingAttribute) {
                addApplier(PrimitiveAppliers.doesAddSupportingAttribute);
            }
            if (resGuide.renameFormat) {
                addApplier(PrimitiveAppliers.doesDisambiguateNames);
            }
            if (resGuide.cardinality === 'many') {
                addApplier(PrimitiveAppliers.doesExplainArray);
            }
            if (resGuide.entityByReference) {
                addApplier(PrimitiveAppliers.doesReferenceEntityVia);
            }
            if (resGuide.selectsSubAttribute && resGuide.selectsSubAttribute.selects === 'one') {
                addApplier(PrimitiveAppliers.doesSelectAttributes);
            }

            // sorted by priority
            this.actionsModify = this.actionsModify.sort(
                (lhs: AttributeResolutionApplier, rhs: AttributeResolutionApplier) => lhs.priority - rhs.priority);
            this.actionsGroupAdd = this.actionsGroupAdd.sort(
                (lhs: AttributeResolutionApplier, rhs: AttributeResolutionApplier) => lhs.priority - rhs.priority);
            this.actionsRoundAdd = this.actionsRoundAdd.sort(
                (lhs: AttributeResolutionApplier, rhs: AttributeResolutionApplier) => lhs.priority - rhs.priority);
            this.actionsAttributeAdd = this.actionsAttributeAdd.sort(
                (lhs: AttributeResolutionApplier, rhs: AttributeResolutionApplier) => lhs.priority - rhs.priority);
        }
    }

}

/**
     * @internal
     */
export class ResolvedAttributeSetBuilder {
    /**
     * @internal
     */
    public ras: ResolvedAttributeSet;
    public inheritedMark: number;

    constructor() {
        this.ras = new ResolvedAttributeSet();
    }

    /**
     * @internal
     */
    public mergeAttributes(rasNew: ResolvedAttributeSet): void {
        // let bodyCode = () =>
        {
            if (rasNew) {
                this.takeReference(this.ras.mergeSet(rasNew));
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
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

    /**
     * @internal
     */
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

    /**
     * @internal
     */
    public ownOne(ra: ResolvedAttribute): void {
        // let bodyCode = () =>
        {
            // save the current context
            const attCtx: CdmAttributeContext = this.ras.attributeContext;
            this.takeReference(new ResolvedAttributeSet());
            this.ras.merge(ra, ra.attCtx);
            // reapply the old attribute context
            this.ras.setAttributeContext(attCtx);
        }
        // return p.measure(bodyCode);
    }

    public applyTraits(arc: AttributeResolutionContext): void {
        // let bodyCode = () =>
        {
            if (this.ras && arc && arc.traitsToApply) {
                this.takeReference(this.ras.applyTraits(arc.traitsToApply, arc.resGuide, arc.actionsModify));
            }
        }
        // return p.measure(bodyCode);
    }

    public generateApplierAttributes(arc: AttributeResolutionContext, applyTraitsToNew: boolean): void {
        // let bodyCode = () =>
        {
            if (!arc || !arc.applierCaps) {
                return;
            }

            if (!this.ras) {
                this.takeReference(new ResolvedAttributeSet());
            }

            // make sure all of the 'source' attributes know about this context
            const set: ResolvedAttribute[] = this.ras.set;
            if (set) {
                const l: number = set.length;
                for (let i: number = 0; i < l; i++) {
                    set[i].arc = arc;

                    // the resolution guidance may be asking for a one time 'take' or avoid of attributes from the source
                    // this also can re-order the attributes
                    if (arc.resGuide && arc.resGuide.selectsSubAttribute &&
                        arc.resGuide.selectsSubAttribute.selects === 'some' &&
                        (arc.resGuide.selectsSubAttribute.selectsSomeTakeNames || arc.resGuide.selectsSubAttribute.selectsSomeAvoidNames)) {
                        // we will make a new resolved attribute set from the 'take' list
                        const takeSet: ResolvedAttribute[] = [];
                        const selectsSomeTakeNames: string[] = arc.resGuide.selectsSubAttribute.selectsSomeTakeNames;
                        const selectsSomeAvoidNames: string[] = arc.resGuide.selectsSubAttribute.selectsSomeAvoidNames;

                        if (selectsSomeTakeNames && !selectsSomeAvoidNames) {
                            // make an index that goes from name to insertion order
                            const inverted: Map<string, number> = new Map<string, number>();
                            for (let iOrder: number = 0; iOrder < l; iOrder++) {
                                inverted.set(set[iOrder].resolvedName, iOrder);
                            }

                            for (const take of selectsSomeTakeNames) {
                                // if in the original set of attributes, take it in the new order
                                const iOriginalOrder: number = inverted.get(take);
                                if (iOriginalOrder) {
                                    takeSet.push(set[iOriginalOrder]);
                                }
                            }
                        }
                        if (selectsSomeAvoidNames) {
                            // make a quick look up of avoid names
                            const avoid: Set<string> = new Set<string>();
                            for (const avoidName of selectsSomeAvoidNames) {
                                avoid.add(avoidName);
                            }

                            for (let iAtt: number = 0; iAtt < l; iAtt++) {
                                // only take the ones not in avoid the list given
                                if (!avoid.has(set[iAtt].resolvedName)) {
                                    takeSet.push(set[iAtt]);
                                }
                            }
                        }

                        // replace the guts of the resolvedAttributeSet with this
                        this.ras.alterSetOrderAndScope(takeSet);
                    }
                }
            }

            // get the new atts and then add them one at a time into this set
            const newAtts: ResolvedAttribute[] = this.getApplierGeneratedAttributes(arc, true, applyTraitsToNew);
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

    // tslint:disable-next-line: max-func-body-length
    private getApplierGeneratedAttributes(
        arc: AttributeResolutionContext,
        clearState: boolean,
        applyModifiers: boolean): ResolvedAttribute[] {
        // let bodyCode = () =>
        {
            if (!this.ras || !this.ras.set) {
                return undefined;
            }

            if (!arc || !arc.applierCaps) {
                return undefined;
            }
            const caps: AttributeResolutionApplierCapabilities = arc.applierCaps;

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

            // make an attribute context to hold attributes that are generated from appliers
            // there is a context for the entire set and one for each 'round' of applications that happen
            let attCtxContainerGroup: CdmAttributeContext = this.ras.attributeContext;
            if (attCtxContainerGroup) {
                const acp: AttributeContextParameters = {
                    under: attCtxContainerGroup,
                    type: cdmAttributeContextType.generatedSet,
                    name: '_generatedAttributeSet'
                };

                attCtxContainerGroup = CdmAttributeContext.createChildUnder(arc.resOpt, acp);
            }
            let attCtxContainer: CdmAttributeContext = attCtxContainerGroup;

            const makeResolvedAttribute: (
                resAttSource: ResolvedAttribute,
                action: AttributeResolutionApplier,
                queryAdd: applierQuery,
                doAdd: applierAction,
                state: string) => applierContext =
                (resAttSource: ResolvedAttribute, action: AttributeResolutionApplier, queryAdd: applierQuery, doAdd: applierAction, state: string): applierContext => {
                    const appCtx: applierContext = {
                        state: state,
                        resOpt: arc.resOpt,
                        attCtx: attCtxContainer,
                        resAttSource: resAttSource,
                        resGuide: arc.resGuide
                    };

                    if (resAttSource && resAttSource.target && (resAttSource.target as ResolvedAttributeSet).set) {
                        return appCtx;
                    } // makes no sense for a group
                    // will something add?
                    if (queryAdd(appCtx)) {
                        // may want to make a new attribute group
                        // make the 'new' attribute look like any source attribute
                        // for the duration of this call to make a context. there could be state needed
                        appCtx.resAttNew = resAttSource;
                        if (this.ras.attributeContext && action.willCreateContext && action.willCreateContext(appCtx)) {
                            action.doCreateContext(appCtx);
                        }
                        // make a new resolved attribute as a place to hold results
                        appCtx.resAttNew = new ResolvedAttribute(appCtx.resOpt, undefined, undefined, appCtx.attCtx);

                        // copy state from source
                        appCtx.resAttNew.applierState = {};
                        if (resAttSource && resAttSource.applierState) {
                            Object.assign(appCtx.resAttNew.applierState, resAttSource.applierState);
                        }
                        // if applying traits, then add the sets traits as a staring point
                        if (applyModifiers) {
                            appCtx.resAttNew.resolvedTraits = arc.traitsToApply.deepCopy();
                        }
                        // make it
                        doAdd(appCtx);

                        // combine resolution guidence for this set with anything new from the new attribute
                        // tslint:disable-next-line: max-line-length
                        appCtx.resGuideNew = (appCtx.resGuide as CdmAttributeResolutionGuidance).combineResolutionGuidance(appCtx.resGuideNew as CdmAttributeResolutionGuidance);
                        appCtx.resAttNew.arc = new AttributeResolutionContext(arc.resOpt, appCtx.resGuideNew as CdmAttributeResolutionGuidance, appCtx.resAttNew.resolvedTraits);

                        if (applyModifiers) {
                            // add the sets traits back in to this newly added one
                            appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.mergeSet(arc.traitsToApply);

                            // be sure to use the new arc, the new attribute may have added actions. For now, only modify and remove will get acted on because recursion. ugh.
                            // do all of the modify traits
                            if (appCtx.resAttNew.arc.applierCaps.canAttributeModify) {
                                // modify acts on the source and we should be done with it
                                appCtx.resAttSource = appCtx.resAttNew;
                            }
                            for (const modAct of appCtx.resAttNew.arc.actionsModify) {
                                // using a new trait now
                                //appCtx.resTrait = modAct.rt;
                                if (modAct.willAttributeModify(appCtx)) {
                                    modAct.doAttributeModify(appCtx);
                                }
                            }
                        }
                        appCtx.resAttNew.completeContext(appCtx.resOpt);
                    }

                    return appCtx;
                };

            // get the one time atts
            if (caps.canGroupAdd) {
                for (const action of arc.actionsGroupAdd) {
                    const appCtx: applierContext =
                        makeResolvedAttribute(undefined, action, action.willGroupAdd, action.doGroupAdd, 'group');
                    // save it
                    if (appCtx && appCtx.resAttNew) {
                        resAttOut.push(appCtx.resAttNew);
                    }
                }
            }
            // now starts a repeating pattern of rounds
            // first step is to get attribute that are descriptions of the round.
            // do this once and then use them as the first entries in the first set of 'previous' atts for the loop

            // make an attribute context to hold attributes that are generated from appliers in this round
            let round: number = 0;
            if (attCtxContainerGroup) {
                const acp: AttributeContextParameters = {
                    under: attCtxContainerGroup,
                    type: cdmAttributeContextType.generatedRound,
                    name: '_generatedAttributeRound0'
                };
                attCtxContainer = CdmAttributeContext.createChildUnder(arc.resOpt, acp);
            }

            let resAttsLastRound: (ResolvedAttribute)[] = [];
            if (caps.canRoundAdd) {
                for (const action of arc.actionsRoundAdd) {
                    const appCtx: applierContext =
                        makeResolvedAttribute(undefined, action, action.willRoundAdd, action.doRoundAdd, 'round');
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
                            for (const action of arc.actionsAttributeAdd) {
                                const appCtx: applierContext =
                                    makeResolvedAttribute(att, action, action.willAttributeAdd, action.doAttributeAdd, 'detail');
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
                    round++;
                    if (attCtxContainerGroup) {
                        const acp: AttributeContextParameters =
                        {
                            under: attCtxContainerGroup,
                            type: cdmAttributeContextType.generatedRound,
                            name: `_generatedAttributeRound${round}`
                        };

                        attCtxContainer = CdmAttributeContext.createChildUnder(arc.resOpt, acp);
                    }
                } while (continues);
            }

            return resAttOut;
        }
        // return p.measure(bodyCode);
    }
}
