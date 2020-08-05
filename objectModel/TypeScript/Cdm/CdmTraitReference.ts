// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    CdmArgumentCollection,
    CdmArgumentDefinition,
    CdmAttributeContext,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmObjectReferenceBase,
    cdmObjectType,
    CdmParameterDefinition,
    CdmTraitDefinition,
    ParameterCollection,
    resolveContext,
    ResolvedAttributeSetBuilder,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    SymbolSet,
    VisitCallback
} from '../internal';

export class CdmTraitReference extends CdmObjectReferenceBase {
    public arguments: CdmArgumentCollection;
    public isFromProperty: boolean;
    /**
     * @internal
     */
    public resolvedArguments: boolean;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.traitRef;
    }

    constructor(ctx: CdmCorpusContext, trait: string | CdmTraitDefinition, simpleReference: boolean, hasArguments: boolean) {
        super(ctx, trait, simpleReference);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.traitRef;
            this.resolvedArguments = false;
            this.isFromProperty = false;
            this.arguments = new CdmArgumentCollection(ctx, this);
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

    /**
     * @internal
     */
    public copyRefObject(resOpt: resolveOptions, refTo: string | CdmTraitDefinition, simpleReference: boolean, host?: CdmObjectReferenceBase): CdmObjectReferenceBase {
        // let bodyCode = () =>
        {
            let copy: CdmTraitReference;
            if (!host) {
                copy = new CdmTraitReference(this.ctx, refTo, simpleReference, this.arguments ? this.arguments.length > 0 : undefined);
            } else {
                copy = host.copyToHost(this.ctx, refTo, simpleReference) as CdmTraitReference;
                copy.arguments.clear();
            }
            if (!simpleReference) {
                for (const arg of this.arguments) {
                    copy.arguments.push(arg);
                }
                copy.resolvedArguments = this.resolvedArguments;
            }

            return copy;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let result: boolean = false;
            if (this.arguments && this.arguments.allItems && this.arguments.allItems.length > 0) {
                // custom enumeration of args to force a path onto these things that just might not have a name
                const lItem: number = this.arguments.allItems.length;
                for (let iItem: number = 0; iItem < lItem; iItem++) {
                    const element: CdmArgumentDefinition = this.arguments.allItems[iItem];
                    if (element) {
                        const argPath: string = `${pathFrom}/arguments/a${iItem}`;
                        if (element.visit(argPath, preChildren, postChildren)) {
                            result = true;
                            break;
                        }
                    }
                }
            }

            return result;
        }
        // return p.measure(bodyCode);
    }

    public fetchFinalArgumentValues(resOpt: resolveOptions): Map<string, ArgumentValue> {
        const finalArgs: Map<string, ArgumentValue> = new Map<string, ArgumentValue>();
        // get resolved traits does all the work, just clean up the answers
        const rts: ResolvedTraitSet = this.fetchResolvedTraits(resOpt);
        if (!rts) {
            return undefined;
        }
        // there is only one resolved trait
        const rt: ResolvedTrait = rts.first;
        if (rt.parameterValues && rt.parameterValues.length > 0) {
            const l: number = rt.parameterValues.length;
            for (let i: number = 0; i < l; i++) {
                const p: CdmParameterDefinition = rt.parameterValues.fetchParameterAtIndex(i);
                const v = rt.parameterValues.fetchValue(i);
                let name: string = p.name;
                if (!name) {
                    name = i.toString();
                }
                finalArgs.set(name, v);
            }
        }

        return finalArgs;
    }

    /**
     * @internal
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public fetchResolvedTraits(resOpt?: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            const kind: string = 'rtsb';
            const ctx: resolveContext = this.ctx as resolveContext;
            // get referenced trait
            const trait: CdmTraitDefinition = this.fetchObjectDefinition<CdmTraitDefinition>(resOpt);
            let rtsTrait: ResolvedTraitSet;
            if (!trait) {
                return ctx.corpus.createEmptyResolvedTraitSet(resOpt);
            }

            // see if one is already cached
            // cache by name unless there are parameter
            if (trait.thisIsKnownToHaveParameters === undefined) {
                // never been resolved, it will happen soon, so why not now?
                rtsTrait = trait.fetchResolvedTraits(resOpt);
            }

            let cacheByPath: boolean = true;
            if (trait.thisIsKnownToHaveParameters) {
                cacheByPath = !trait.thisIsKnownToHaveParameters;
            }
            let cacheTag: string = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind, '', cacheByPath, trait.atCorpusPath);
            let rtsResult: ResolvedTraitSet = cacheTag ? ctx.cache.get(cacheTag) : undefined;

            // store the previous reference symbol set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currSymRefSet: SymbolSet = resOpt.symbolRefSet || new SymbolSet();
            resOpt.symbolRefSet = new SymbolSet();

            // if not, then make one and save it
            if (!rtsResult) {
                // get the set of resolutions, should just be this one trait
                if (!rtsTrait) {
                    // store current doc ref set
                    const newDocRefSet: SymbolSet = resOpt.symbolRefSet;
                    resOpt.symbolRefSet = new SymbolSet();

                    rtsTrait = trait.fetchResolvedTraits(resOpt);

                    // bubble up symbol reference set from children
                    if (newDocRefSet) {
                        newDocRefSet.merge(resOpt.symbolRefSet);
                    }
                    resOpt.symbolRefSet = newDocRefSet;
                }
                if (rtsTrait) {
                    rtsResult = rtsTrait.deepCopy();
                }

                // now if there are argument for this application, set the values in the array
                if (this.arguments && rtsResult) {
                    // if never tried to line up arguments with parameters, do that
                    if (!this.resolvedArguments) {
                        this.resolvedArguments = true;
                        const params: ParameterCollection = trait.fetchAllParameters(resOpt);
                        let paramFound: CdmParameterDefinition;
                        let aValue: ArgumentValue;

                        let iArg: number = 0;
                        for (const a of this.arguments) {
                            paramFound = params.resolveParameter(iArg, a.getName());
                            a.resolvedParameter = paramFound;
                            aValue = a.value;
                            aValue = ctx.corpus.constTypeCheck(resOpt, this.inDocument, paramFound, aValue);
                            a.value = aValue;
                            iArg++;
                        }
                    }
                    for (const a of this.arguments) {
                        rtsResult.setParameterValueFromArgument(trait, a);
                    }
                }

                // register set of possible symbols
                ctx.corpus.registerDefinitionReferenceSymbols(this.fetchObjectDefinition(resOpt), kind, resOpt.symbolRefSet);

                // get the new cache tag now that we have the list of docs
                cacheTag = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind, '', cacheByPath, trait.atCorpusPath);
                if (cacheTag) {
                    ctx.cache.set(cacheTag, rtsResult);
                }
            } else {
                // cache was found
                // get the SymbolSet for this cached object
                const key: string = CdmCorpusDefinition.createCacheKeyFromObject(this, kind);
                resOpt.symbolRefSet = ctx.corpus.definitionReferenceSymbols.get(key);
            }

            // merge child document set with current
            currSymRefSet.merge(resOpt.symbolRefSet);
            resOpt.symbolRefSet = currSymRefSet;

            return rtsResult;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // traits don't have traits.
    }
}
