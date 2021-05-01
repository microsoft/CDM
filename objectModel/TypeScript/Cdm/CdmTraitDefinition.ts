// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    CdmAttributeContext,
    CdmCollection,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    CdmParameterDefinition,
    CdmTraitReference,
    cdmLogCode,
    Logger,
    ParameterCollection,
    ParameterValueSet,
    resolveContext,
    ResolvedAttributeSetBuilder,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    SymbolSet,
    VisitCallback
} from '../internal';

export class CdmTraitDefinition extends CdmObjectDefinitionBase {
    private TAG: string = CdmTraitDefinition.name;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.traitDef;
    }

    public get parameters(): CdmCollection<CdmParameterDefinition> {
        if (!this._parameters) {
            this._parameters = new CdmCollection<CdmParameterDefinition>(this.ctx, this, cdmObjectType.parameterDef);
        }

        return this._parameters;
    }
    public associatedProperties: string[];
    public explanation: string;
    public elevated: boolean;
    public traitName: string;
    public extendsTrait?: CdmTraitReference;
    public ugly: boolean;
    /**
     * @internal
     */
    public thisIsKnownToHaveParameters: boolean;

    private _parameters: CdmCollection<CdmParameterDefinition>;
    private allParameters: ParameterCollection;
    private hasSetFlags: boolean;
    private baseIsKnownToHaveParameters: boolean;

    constructor(ctx: CdmCorpusContext, name: string, extendsTrait?: CdmTraitReference) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.hasSetFlags = false;
            this.objectType = cdmObjectType.traitDef;
            this.traitName = name;
            this.extendsTrait = extendsTrait;
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

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }
            let copy: CdmTraitDefinition;
            if (!host) {
                copy = new CdmTraitDefinition(this.ctx, this.traitName, undefined);
            } else {
                copy = host as CdmTraitDefinition;
                copy.ctx = this.ctx;
                copy.traitName = this.traitName;
            }
            copy.extendsTrait = this.extendsTrait
                ? <CdmTraitReference>this.extendsTrait.copy(resOpt)
                : undefined;
            copy.allParameters = undefined;
            copy.elevated = this.elevated;
            copy.ugly = this.ugly;
            copy.associatedProperties = this.associatedProperties;
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            if (!this.traitName) {
                let missingFields: string[] = ['traitName'];
                Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
                return false;
            }

            return true;
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

    /**
     * @internal
     */
    public fetchExtendsTrait(): CdmTraitReference {
        // let bodyCode = () =>
        {
            return this.extendsTrait;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public hasParameterDefs(): CdmCollection<CdmParameterDefinition> {
        // let bodyCode = () =>
        {
            return this.parameters;
        }
        // return p.measure(bodyCode);
    }

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

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
            let path: string = '';
            if (!this.ctx.corpus.blockDeclaredPathChanges) {
                path = this.declaredPath;
                if (!path) {
                    path = pathFrom + this.traitName;
                    this.declaredPath = path;
                }
            }

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.extendsTrait) {
                this.extendsTrait.owner = this;
                if (this.extendsTrait.visit(`${path}/extendsTrait/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.parameters) {
                if (this.parameters.visitArray(`${path}/hasParameters/`, preChildren, postChildren)) {
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
            // this may happen 0, 1 or 2 times. so make it fast
            let baseTrait: CdmTraitDefinition;
            let baseRts: ResolvedTraitSet;
            let baseValues: ArgumentValue[];
            const getBaseInfo: () => void
                = (): void => {
                    if (this.extendsTrait) {
                        baseTrait = this.extendsTrait.fetchObjectDefinition<CdmTraitDefinition>(resOpt);
                        if (baseTrait) {
                            baseRts = this.extendsTrait.fetchResolvedTraits(resOpt);
                            if (baseRts && baseRts.size === 1) {
                                const basePv: ParameterValueSet =
                                    baseRts.get(baseTrait) ? baseRts.get(baseTrait).parameterValues : undefined;
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

            let cacheTag: string = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind, cacheTagExtra);
            let rtsResult: ResolvedTraitSet = cacheTag ? ctx.cache.get(cacheTag) : undefined;

            // store the previous reference symbol set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currSymRefSet: SymbolSet = resOpt.symbolRefSet || new SymbolSet();
            resOpt.symbolRefSet = new SymbolSet();

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
                        if (this.associatedProperties === undefined) {
                            this.associatedProperties = baseTrait.associatedProperties;
                        }
                    }
                }
                this.hasSetFlags = true;
                const pc: ParameterCollection = this.fetchAllParameters(resOpt);
                const av: (ArgumentValue)[] = [];
                const wasSet: (boolean)[] = [];
                this.thisIsKnownToHaveParameters = (pc.sequence.length > 0);
                for (let i: number = 0; i < pc.sequence.length; i++) {
                    // either use the default value or (higher precidence) the value taken from the base reference
                    let value: ArgumentValue = pc.sequence[i].defaultValue;
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

                // register set of possible symbols
                ctx.corpus.registerDefinitionReferenceSymbols(this.fetchObjectDefinition(resOpt), kind, resOpt.symbolRefSet);
                // get the new cache tag now that we have the list of docs
                cacheTag = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind, cacheTagExtra);
                if (cacheTag) {
                    ctx.cache.set(cacheTag, rtsResult);
                }
            } else {
                // cache found
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

    /**
     * @internal
     */
    public fetchAllParameters(resOpt: resolveOptions): ParameterCollection {
        // let bodyCode = () =>
        {
            if (this.allParameters) {
                return this.allParameters;
            }

            // get parameters from base if there is one
            let prior: ParameterCollection;
            if (this.extendsTrait) {
                prior = this.fetchExtendsTrait()
                    .fetchObjectDefinition<CdmTraitDefinition>(resOpt)
                    .fetchAllParameters(resOpt);
            }
            this.allParameters = new ParameterCollection(prior);
            if (this.parameters) {
                this.parameters.allItems.forEach((element: CdmParameterDefinition) => {
                    this.allParameters.add(element);
                });
            }

            return this.allParameters;
        }
        // return p.measure(bodyCode);
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
}
