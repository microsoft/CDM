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
    VisitCallback,
    CdmTraitReferenceBase
} from '../internal';

export class CdmTraitReference extends CdmTraitReferenceBase {
    public arguments: CdmArgumentCollection;
    public isFromProperty: boolean;
    /**
     * @internal
     */
    public resolvedArguments: boolean;

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
                    copy.arguments.push(arg.copy(resOpt));
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
        if (!rts || rts.size !== 1) {
            // well didn't get the traits. maybe imports are missing or maybe things are just not defined yet.
            // this function will try to fake up some answers then from the arguments that are set on this reference only
            if (this.arguments && this.arguments.length > 0) {
                let unNamedCount: number = 0;
                for (const arg of this.arguments)
                {
                    // if no arg name given, use the position in the list.
                    let argName: string  = arg.name;
                    if (!argName) {
                        argName = unNamedCount.toString();
                    }
                    finalArgs.set(argName, arg.value);
                    unNamedCount++;
                }
                return finalArgs;
            }
            return undefined;
        }
        // there is only one resolved trait
        const rt: ResolvedTrait = rts.first;
        if (rt && rt.parameterValues && rt.parameterValues.length > 0) {
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

            let rtsResult: ResolvedTraitSet = undefined;

            // store the previous reference symbol set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currSymRefSet: SymbolSet = resOpt.symbolRefSet ?? new SymbolSet();
            resOpt.symbolRefSet = new SymbolSet();

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

                    let argumentIndex: number = 0;
                    for (const argument of this.arguments) {
                        paramFound = params.resolveParameter(argumentIndex, argument.getName());
                        argument.resolvedParameter = paramFound;
                        argument.value = paramFound.constTypeCheck(resOpt, this.inDocument, argument.value);
                        argumentIndex++;
                    }
                }

                for (const argument of this.arguments) {
                    rtsResult.setParameterValueFromArgument(trait, argument);
                }
            }

            // register set of possible symbols
            ctx.corpus.registerDefinitionReferenceSymbols(this.fetchObjectDefinition(resOpt), kind, resOpt.symbolRefSet);

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
