import {
    addTraitRef,
    ArgumentValue,
    CdmCorpusContext,
    cdmObject,
    cdmObjectDef,
    cdmObjectType,
    copyOptions,
    CorpusImpl,
    DocSetCollection,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmObject,
    ICdmParameterDef,
    ICdmTraitDef,
    ICdmTraitRef,
    Parameter,
    ParameterCollection,
    ParameterImpl,
    ParameterValueSet,
    resolveContext,
    ResolvedAttributeSetBuilder,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    Trait,
    TraitApplier,
    TraitReference,
    TraitReferenceImpl,
    VisitCallback
} from '../internal';

export class TraitImpl extends cdmObjectDef implements ICdmTraitDef {
    public explanation: string;
    public traitName: string;
    public extendsTrait: TraitReferenceImpl;
    public hasParameters: ParameterImpl[];
    public allParameters: ParameterCollection;
    public appliers: TraitApplier[];
    public hasSetFlags: boolean;
    public elevated: boolean;
    public modifiesAttributes: boolean;
    public ugly: boolean;
    public associatedProperties: string[];
    public baseIsKnownToHaveParameters: boolean;
    public thisIsKnownToHaveParameters: boolean;

    constructor(ctx: CdmCorpusContext, name: string, extendsTrait: TraitReferenceImpl, hasParameters: boolean) {
        super(ctx, false);
        // let bodyCode = () =>
        {
            this.hasSetFlags = false;
            this.objectType = cdmObjectType.traitDef;
            this.traitName = name;
            this.extendsTrait = extendsTrait;
            if (hasParameters) {
                this.hasParameters = [];
            }
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: Trait): TraitImpl {
        // let bodyCode = () =>
        {
            let extendsTrait: TraitReferenceImpl;
            if (object.extendsTrait) {
                extendsTrait = TraitReferenceImpl.instanceFromData(ctx, object.extendsTrait);
            }

            const c: TraitImpl = new TraitImpl(ctx, object.traitName, extendsTrait, !!object.hasParameters);

            if (object.explanation) {
                c.explanation = object.explanation;
            }

            if (object.hasParameters) {
                object.hasParameters.forEach((ap: string | Parameter) => {
                    if (typeof (ap) !== 'string') {
                        c.hasParameters.push(ParameterImpl.instanceFromData(ctx, ap));
                    }
                });
            }

            if (object.elevated !== undefined) {
                c.elevated = object.elevated;
            }
            if (object.ugly !== undefined) {
                c.ugly = object.ugly;
            }
            if (object.modifiesAttributes !== undefined) {
                c.modifiesAttributes = object.modifiesAttributes;
            }
            if (object.associatedProperties) {
                c.associatedProperties = object.associatedProperties;
            }

            return c;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.traitDef;
        }
        // return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Trait {
        // let bodyCode = () =>
        {
            return {
                explanation: this.explanation,
                traitName: this.traitName,
                extendsTrait: this.extendsTrait ? this.extendsTrait.copyData(resOpt, options) as (string | TraitReference) : undefined,
                hasParameters: cdmObject.arraycopyData<string | Parameter>(resOpt, this.hasParameters, options),
                elevated: this.elevated,
                modifiesAttributes: this.modifiesAttributes,
                ugly: this.ugly,
                associatedProperties: this.associatedProperties
            };
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject {
        // let bodyCode = () =>
        {
            const copy: TraitImpl = new TraitImpl(this.ctx, this.traitName, undefined, false);
            copy.extendsTrait = this.extendsTrait
                ? <TraitReferenceImpl>this.extendsTrait.copy(resOpt)
                : undefined;
            copy.hasParameters = cdmObject.arrayCopy<ParameterImpl>(resOpt, this.hasParameters);
            copy.allParameters = undefined;
            copy.elevated = this.elevated;
            copy.ugly = this.ugly;
            copy.modifiesAttributes = this.modifiesAttributes;
            copy.associatedProperties = this.associatedProperties;
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.traitName ? true : false;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.addChildString('trait');
            ff.addChildString(this.traitName);
            if (this.extendsTrait) {
                ff.addChildString('extends');
                ff.addChild(this.extendsTrait.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);

            if (this.hasParameters) {
                const ffSub: friendlyFormatNode = new friendlyFormatNode();
                ffSub.forceWrap = true;
                // ffSub.verticalMode = true;
                ffSub.bracketEmpty = true;
                ffSub.separator = ';';
                ffSub.starter = '{';
                ffSub.terminator = '}';
                cdmObject.arrayGetFriendlyFormat(ffSub, this.hasParameters);
                ff.addChild(ffSub);
            }

            return ff;
        }
        // return p.measure(bodyCode);
    }
    public getExplanation(): string {
        // let bodyCode = () =>
        {
            return this.explanation;
        }
        // return p.measure(bodyCode);
    }
    public getName(): string {
        // let bodyCode = () =>
        {
            return this.traitName;
        }
        // return p.measure(bodyCode);
    }
    public getExtendsTrait(): ICdmTraitRef {
        // let bodyCode = () =>
        {
            return this.extendsTrait;
        }
        // return p.measure(bodyCode);
    }
    public setExtendsTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean = false): ICdmTraitRef {
        // let bodyCode = () =>
        {
            if (!traitDef) {
                return undefined;
            }
            this.clearTraitCache();
            const extRef: ((TraitReferenceImpl))[] = [];
            addTraitRef(this.ctx, extRef, traitDef, implicitRef);
            this.extendsTrait = extRef[0];

            return this.extendsTrait;
        }
        // return p.measure(bodyCode);
    }
    public getHasParameterDefs(): ICdmParameterDef[] {
        // let bodyCode = () =>
        {
            if (!this.hasParameters) {
                this.hasParameters = [];
            }

            return this.hasParameters;
        }
        // return p.measure(bodyCode);
    }
    public getExhibitedTraitRefs(): ICdmTraitRef[] {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean {
        // let bodyCode = () =>
        {
            if (base === this.traitName) {
                return true;
            }

            return this.isDerivedFromDef(resOpt, this.extendsTrait, this.traitName, base);
        }
        // return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = this.declaredPath;
            if (!path) {
                path = pathFrom + this.traitName;
                this.declaredPath = path;
            }
            // trackVisits(path);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.extendsTrait) {
                if (this.extendsTrait.visit(`${path}/extendsTrait/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.hasParameters) {
                if (cdmObject.visitArray(this.hasParameters, `${path}/hasParameters/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (postChildren && postChildren(this, path)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public addTraitApplier(applier: TraitApplier): void {
        // let bodyCode = () =>
        {
            if (!this.appliers || applier.overridesBase) {
                this.appliers = [];
            }
            this.appliers.push(applier);
        }
        // return p.measure(bodyCode);
    }

    public getTraitAppliers(): TraitApplier[] {
        // let bodyCode = () =>
        {
            return this.appliers;
        }
        // return p.measure(bodyCode);
    }

    public getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const kind: string = 'rtsb';
            const ctx: resolveContext = this.ctx as resolveContext;
            // this may happen 0, 1 or 2 times. so make it fast
            let baseTrait: ICdmTraitDef;
            let baseRts: ResolvedTraitSet;
            let baseValues: ArgumentValue[];
            const getBaseInfo: () => void
                = (): void => {
                    if (this.extendsTrait) {
                        baseTrait = this.extendsTrait.getObjectDef<ICdmTraitDef>(resOpt);
                        if (baseTrait) {
                            baseRts = this.extendsTrait.getResolvedTraits(resOpt);
                            if (baseRts && baseRts.size === 1) {
                                const basePv: ParameterValueSet = baseRts.get(baseTrait) ? baseRts.get(baseTrait).parameterValues : null;
                                if (basePv) {
                                    baseValues = basePv.values;
                                }
                            }
                        }
                    }
                };

            // see if one is already cached
            // if this trait has parameters, then the base trait found through the reference might be a different reference
            // because trait references are unique per argument value set. so use the base as a part of the cache tag
            // since it is expensive to figure out the extra tag, cache that too!
            if (this.baseIsKnownToHaveParameters === undefined) {
                getBaseInfo();
                // is a cache tag needed? then make one
                this.baseIsKnownToHaveParameters = false;
                if (baseValues && baseValues.length > 0) {
                    this.baseIsKnownToHaveParameters = true;
                }
            }
            let cacheTagExtra: string = '';
            if (this.baseIsKnownToHaveParameters) {
                cacheTagExtra = this.extendsTrait.ID.toString();
            }

            let cacheTag: string = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind, cacheTagExtra);
            let rtsResult: ResolvedTraitSet = cacheTag ? ctx.cache.get(cacheTag) : null;

            // store the previous document set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currDocRefSet: DocSetCollection = resOpt.documentRefSet || new DocSetCollection();
            resOpt.documentRefSet = new DocSetCollection();

            // if not, then make one and save it
            if (!rtsResult) {
                getBaseInfo();
                if (baseTrait) {
                    // get the resolution of the base class and use the values as a starting point for this trait's values
                    if (this.hasSetFlags === false) {
                        // inherit these flags
                        if (this.elevated === undefined) {
                            this.elevated = baseTrait.elevated;
                        }
                        if (this.ugly === undefined) {
                            this.ugly = baseTrait.ugly;
                        }
                        if (this.modifiesAttributes === undefined) {
                            this.modifiesAttributes = baseTrait.modifiesAttributes;
                        }
                        if (this.associatedProperties === undefined) {
                            this.associatedProperties = baseTrait.associatedProperties;
                        }
                    }
                }
                this.hasSetFlags = true;
                const pc: ParameterCollection = this.getAllParameters(resOpt);
                const av: (ArgumentValue)[] = [];
                const wasSet: (boolean)[] = [];
                this.thisIsKnownToHaveParameters = (pc.sequence.length > 0);
                for (let i: number = 0; i < pc.sequence.length; i++) {
                    // either use the default value or (higher precidence) the value taken from the base reference
                    let value: ArgumentValue = (pc.sequence[i] as ParameterImpl).defaultValue;
                    let baseValue: ArgumentValue;
                    if (baseValues && i < baseValues.length) {
                        baseValue = baseValues[i];
                        if (baseValue) {
                            value = baseValue;
                        }
                    }
                    av.push(value);
                    wasSet.push(false);
                }

                // save it
                const resTrait: ResolvedTrait = new ResolvedTrait(this, pc, av, wasSet);
                rtsResult = new ResolvedTraitSet(resOpt);
                rtsResult.merge(resTrait, false);
                if (rtsResult.applierCaps) {
                    rtsResult.collectDirectives(resOpt.directives);
                }

                // register set of possible docs
                ctx.corpus.registerDefinitionReferenceDocuments(this.getObjectDef(resOpt), kind, resOpt.documentRefSet);
                // get the new cache tag now that we have the list of docs
                cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind, cacheTagExtra);
                ctx.cache.set(cacheTag, rtsResult);
            } else {
                // cache found
                // get the DocSetCollection for this cached object
                const key: string = CorpusImpl.getCacheKeyFromObject(this, kind);
                resOpt.documentRefSet = ctx.corpus.definitionReferenceDocuments.get(key);
            }
            // merge child document set with current
            currDocRefSet.merge(resOpt.documentRefSet);
            resOpt.documentRefSet = currDocRefSet;

            return rtsResult;
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // traits don't have traits.
    }

    public getAllParameters(resOpt: resolveOptions): ParameterCollection {
        // let bodyCode = () =>
        {
            if (this.allParameters) {
                return this.allParameters;
            }

            // get parameters from base if there is one
            let prior: ParameterCollection;
            if (this.extendsTrait) {
                prior = (this.getExtendsTrait()
                    .getObjectDef(resOpt) as ICdmTraitDef)
                    .getAllParameters(resOpt);
            }
            this.allParameters = new ParameterCollection(prior);
            if (this.hasParameters) {
                this.hasParameters.forEach((element: ParameterImpl) => {
                    this.allParameters.add(element as ICdmParameterDef);
                });
            }

            return this.allParameters;
        }
        // return p.measure(bodyCode);
    }
    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
}
