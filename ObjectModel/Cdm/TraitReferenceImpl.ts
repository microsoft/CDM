import {
    Argument,
    ArgumentImpl,
    ArgumentValue,
    CdmCorpusContext,
    CdmJsonType,
    cdmObject,
    cdmObjectRef,
    cdmObjectType,
    copyOptions,
    CorpusImpl,
    DocSetCollection,
    friendlyFormatNode,
    ICdmArgumentDef,
    ICdmAttributeContext,
    ICdmParameterDef,
    ICdmTraitDef,
    ICdmTraitRef,
    ParameterCollection,
    resolveContext,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    Trait,
    TraitImpl,
    TraitReference,
    VisitCallback
} from '../internal';

export class TraitReferenceImpl extends cdmObjectRef implements ICdmTraitRef {
    // tslint:disable-next-line:no-banned-terms
    public arguments?: ArgumentImpl[];
    public resolvedArguments: boolean;

    constructor(ctx: CdmCorpusContext, trait: string | TraitImpl, simpleReference: boolean, hasArguments: boolean) {
        super(ctx, trait, simpleReference, false);
        // let bodyCode = () =>
        {
            if (hasArguments) {
                this.arguments = [];
            }
            this.objectType = cdmObjectType.traitRef;
            this.resolvedArguments = false;
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: string | TraitReference): TraitReferenceImpl {
        // let bodyCode = () =>
        {
            let simpleReference: boolean = true;
            let trait: string | TraitImpl;
            let args: (string | Argument)[];
            if (typeof (object) === 'string') {
                trait = object;
            } else {
                simpleReference = false;
                args = object.arguments;
                if (typeof (object.traitReference) === 'string') {
                    trait = object.traitReference;
                } else {
                    trait = TraitImpl.instanceFromData(ctx, object.traitReference);
                }
            }

            const c: TraitReferenceImpl = new TraitReferenceImpl(ctx, trait, simpleReference, !!args);
            if (args) {
                args.forEach((a: (string | Argument)) => {
                    c.arguments.push(ArgumentImpl.instanceFromData(ctx, a));
                });
            }

            return c;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.traitRef;
        }
        // return p.measure(bodyCode);
    }
    public copyRefData(resOpt: resolveOptions, copy: TraitReference, refTo: string | Trait, options: copyOptions): CdmJsonType {
        // let bodyCode = () =>
        {
            copy.traitReference = refTo;
            copy.arguments = cdmObject.arraycopyData<Argument>(resOpt, this.arguments, options);

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo: string | TraitImpl, simpleReference: boolean): cdmObjectRef {
        // let bodyCode = () =>
        {
            const copy: TraitReferenceImpl = new TraitReferenceImpl(
                this.ctx, refTo, simpleReference, (this.arguments && this.arguments.length > 0));
            if (!simpleReference) {
                copy.arguments = cdmObject.arrayCopy<ArgumentImpl>(resOpt, this.arguments);
                copy.resolvedArguments = this.resolvedArguments;
            }

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            if (this.arguments) {
                if (cdmObject.visitArray(this.arguments, `${pathFrom}/arguments/`, preChildren, postChildren)) {
                    return true;
                }
            }

            return false;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.addChildString(this.getObjectDefName());
            const ffSub: friendlyFormatNode = new friendlyFormatNode();
            ffSub.separator = ', ';
            ffSub.lineWrap = true;
            ffSub.starter = '(';
            ffSub.terminator = ')';
            ffSub.bracketEmpty = true;
            cdmObject.arrayGetFriendlyFormat(ffSub, this.arguments);
            ff.addChild(ffSub);

            return ff;
        }
        // return p.measure(bodyCode);
    }

    public getArgumentDefs(): (ICdmArgumentDef)[] {
        // let bodyCode = () =>
        {
            return this.arguments;
        }
        // return p.measure(bodyCode);
    }
    public addArgument(name: string, value: ArgumentValue): ICdmArgumentDef {
        // let bodyCode = () =>
        {
            if (!this.arguments) {
                this.arguments = [];
            }
            const newArg: ArgumentImpl = this.ctx.corpus.MakeObject<ArgumentImpl>(cdmObjectType.argumentDef, name);
            newArg.setValue(value);
            this.arguments.push(newArg);
            this.resolvedArguments = false;

            return newArg;
        }
        // return p.measure(bodyCode);
    }
    public getArgumentValue(name: string): ArgumentValue {
        // let bodyCode = () =>
        {
            if (!this.arguments) {
                return undefined;
            }
            for (const arg of this.arguments) {
                const argName: string = arg.getName();
                if (argName === name) {
                    return arg.getValue();
                }
                // special case with only one argument and no name give, make a big assumption that this is the one they want
                // right way is to look up parameter def and check name, but this interface is for working on an unresolved def
                if (argName === undefined && this.arguments.length === 1) {
                    return arg.getValue();
                }
            }
        }
        // return p.measure(bodyCode);
    }

    public setArgumentValue(name: string, value: string): void {
        // let bodyCode = () =>
        {
            if (!this.arguments) {
                this.arguments = [];
            }
            let iArgSet: number = 0;
            for (iArgSet = 0; iArgSet < this.arguments.length; iArgSet++) {
                const arg: ArgumentImpl = this.arguments[iArgSet];
                if (arg.getName() === name) {
                    arg.setValue(value);
                }
            }
            if (iArgSet === this.arguments.length) {
                const arg: ArgumentImpl = new ArgumentImpl(this.ctx);
                arg.ctx = this.ctx;
                arg.name = name;
                arg.value = value;
            }
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

    public getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const kind: string = 'rtsb';
            const ctx: resolveContext = this.ctx as resolveContext;
            // get referenced trait
            const trait: TraitImpl = this.getObjectDef<ICdmTraitDef>(resOpt) as TraitImpl;
            let rtsTrait: ResolvedTraitSet;
            if (!trait) {
                return ctx.corpus.getEmptyResolvedTraitSet(resOpt);
            }

            // see if one is already cached
            // cache by name unless there are parameter
            if (trait.thisIsKnownToHaveParameters === undefined) {
                // never been resolved, it will happen soon, so why not now?
                rtsTrait = trait.getResolvedTraits(resOpt);
            }

            const cacheByName: boolean = !trait.thisIsKnownToHaveParameters;
            let cacheTag: string = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind, '', cacheByName);
            let rtsResult: ResolvedTraitSet = cacheTag ? ctx.cache.get(cacheTag) : null;

            // store the previous document set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currDocRefSet: DocSetCollection = resOpt.documentRefSet || new DocSetCollection();
            resOpt.documentRefSet = new DocSetCollection();

            // if not, then make one and save it
            if (!rtsResult) {
                // get the set of resolutions, should just be this one trait
                if (!rtsTrait) {
                    // store current doc ref set
                    const newDocRefSet: DocSetCollection = resOpt.documentRefSet;
                    resOpt.documentRefSet = new DocSetCollection();

                    rtsTrait = trait.getResolvedTraits(resOpt);

                    // bubble up document set from children
                    if (newDocRefSet) {
                        newDocRefSet.merge(resOpt.documentRefSet);
                    }
                    resOpt.documentRefSet = newDocRefSet;
                }
                if (rtsTrait) {
                    rtsResult = rtsTrait.deepCopy();
                }

                // now if there are argument for this application, set the values in the array
                if (this.arguments && rtsResult) {
                    // if never tried to line up arguments with parameters, do that
                    if (!this.resolvedArguments) {
                        this.resolvedArguments = true;
                        const params: ParameterCollection = trait.getAllParameters(resOpt);
                        let paramFound: ICdmParameterDef;
                        let aValue: ArgumentValue;

                        let iArg: number = 0;
                        for (const a of this.arguments) {
                            paramFound = params.resolveParameter(iArg, a.getName());
                            a.resolvedParameter = paramFound;
                            aValue = a.value;
                            aValue = ctx.corpus.constTypeCheck(resOpt, paramFound, aValue);
                            a.setValue(aValue);
                            iArg++;
                        }
                    }
                    for (const a of this.arguments) {
                        rtsResult.setParameterValueFromArgument(trait, a);
                    }
                }

                // register set of possible docs
                ctx.corpus.registerDefinitionReferenceDocuments(this.getObjectDef(resOpt), kind, resOpt.documentRefSet);

                // get the new cache tag now that we have the list of docs
                cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind, '', cacheByName);
                ctx.cache.set(cacheTag, rtsResult);
            } else {
                // cache was found
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
}
