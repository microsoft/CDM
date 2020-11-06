// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    CdmCollection,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmObject,
    CdmObjectDefinition,
    CdmObjectReference,
    CdmObjectReferenceBase,
    cdmObjectType,
    CdmParameterDefinition,
    CdmTraitReference,
    copyOptions,
    DepthInfo,
    isEntityAttributeDefinition,
    resolveContext,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    SymbolSet,
    VisitCallback
} from '../internal';
import { PersistenceLayer } from '../Persistence';
import { CdmJsonType } from '../Persistence/CdmFolder/types';

export abstract class CdmObjectBase implements CdmObject {

    public inDocument: CdmDocumentDefinition;
    public ID: number;
    public objectType: cdmObjectType;
    public ctx: CdmCorpusContext;

    public get atCorpusPath(): string {
        if (!this.inDocument) {
            return `NULL:/NULL/${this.declaredPath}`;
        } else {
            return `${this.inDocument.atCorpusPath}/${this.declaredPath}`;
        }
    }

    /**
     * @internal
     */
    public traitCache: Map<string, ResolvedTraitSetBuilder>;

    /**
     * @internal
     */
    public declaredPath: string;
    public owner: CdmObject;
    public resolvingAttributes: boolean = false;
    protected circularReference: boolean;
    private resolvingTraits: boolean = false;
    constructor(ctx: CdmCorpusContext) {
        this.ID = CdmCorpusDefinition.nextID();
        this.ctx = ctx;
    }

    public static get objectType(): cdmObjectType {
        return;
    }

    /**
     * @deprecated
     */
    public static instanceFromData<T extends CdmObject>(...args: any[]): T {
        const objectType: cdmObjectType = this.objectType;
        const persistenceType: string = 'CdmFolder';

        return PersistenceLayer.fromData(...args, objectType, persistenceType);
    }

    /**
     * @internal
     */
    public static visitArray(items: CdmCollection<CdmObject>, path: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let result: boolean = false;
            if (items) {
                const lItem: number = items.length;
                for (let iItem: number = 0; iItem < lItem; iItem++) {
                    const element: CdmObject = items.allItems[iItem];
                    if (element) {
                        if (element.visit(path, preChildren, postChildren)) {
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

    /**
     * @internal
     */
    public static resolvedTraitToTraitRef(resOpt: resolveOptions, rt: ResolvedTrait): CdmTraitReference {
        let traitRef: CdmTraitReference;
        if (rt.parameterValues && rt.parameterValues.length) {
            traitRef = rt.trait.ctx.corpus.MakeObject(cdmObjectType.traitRef, rt.traitName, false);
            const l: number = rt.parameterValues.length;
            if (l === 1) {
                // just one argument, use the shortcut syntax
                let val: string | object | CdmObject = rt.parameterValues.values[0];
                if (val !== undefined) {
                    if (typeof val === 'object' && 'copy' in val && typeof val.copy === 'function') {
                        val = val.copy(resOpt);
                    }
                    traitRef.arguments.push(undefined, val);
                }
            } else {
                for (let i: number = 0; i < l; i++) {
                    const param: CdmParameterDefinition = rt.parameterValues.fetchParameterAtIndex(i);
                    let val: string | object | CdmObject = rt.parameterValues.values[i];
                    if (val !== undefined) {
                        if (typeof val === 'object' && 'copy' in val && typeof val.copy === 'function') {
                            val = val.copy(resOpt);
                        } else if (typeof val === 'object') {
                            val = { ...val };
                        }
                        traitRef.arguments.push(param.name, val);
                    }
                }
            }
        } else {
            traitRef = rt.trait.ctx.corpus.MakeObject(cdmObjectType.traitRef, rt.traitName, true);
        }
        if (resOpt.saveResolutionsOnCopy) {
            // used to localize references between documents
            traitRef.explicitReference = rt.trait;
            traitRef.inDocument = rt.trait.inDocument;
        }
        // always make it a property when you can, however the dataFormat traits should be left alone
        if (rt.trait.associatedProperties && !rt.trait.isDerivedFrom('is.dataFormat', resOpt)) {
            traitRef.isFromProperty = true;
        }

        return traitRef;
    }

    public abstract isDerivedFrom(baseDef: string, resOpt?: resolveOptions): boolean;
    public abstract copy(resOpt: resolveOptions, host?: CdmObject): CdmObject;
    public abstract validate(): boolean;

    public abstract getObjectType(): cdmObjectType;
    public abstract fetchObjectDefinitionName(): string;
    public abstract fetchObjectDefinition<T extends CdmObjectDefinition>(resOpt: resolveOptions): T;
    public abstract createSimpleReference(resOpt: resolveOptions): CdmObjectReference;

    /**
     * @deprecated
     */
    public copyData(resOpt: resolveOptions, options?: copyOptions): CdmJsonType {
        const persistenceType: string = 'CdmFolder';

        return PersistenceLayer.toData(this, resOpt, options, persistenceType);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
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

    /**
     * @internal
     */
    public fetchResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const wasPreviouslyResolving: boolean = this.ctx.corpus.isCurrentlyResolving;
            this.ctx.corpus.isCurrentlyResolving = true;
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            const kind: string = 'rtsb';
            const ctx: resolveContext = this.ctx as resolveContext;
            let cacheTagA: string = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind);

            let rtsbAll: ResolvedTraitSetBuilder;
            if (!this.traitCache) {
                this.traitCache = new Map<string, ResolvedTraitSetBuilder>();
            } else {
                rtsbAll = cacheTagA ? this.traitCache.get(cacheTagA) : undefined;
            }

            // store the previous symbol set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currSymbolRefSet: SymbolSet = resOpt.symbolRefSet || new SymbolSet();
            resOpt.symbolRefSet = new SymbolSet();

            if (!rtsbAll) {
                rtsbAll = new ResolvedTraitSetBuilder();
                if (!this.resolvingTraits) {
                    this.resolvingTraits = true;
                    this.constructResolvedTraits(rtsbAll, resOpt);
                    this.resolvingTraits = false;
                }

                const objDef: CdmObjectDefinition = this.fetchObjectDefinition(resOpt);
                if (objDef !== undefined) {
                    // register set of possible docs
                    ctx.corpus.registerDefinitionReferenceSymbols(objDef, kind, resOpt.symbolRefSet);

                    if (rtsbAll.rts === undefined) {
                        // nothing came back, but others will assume there is a set in this builder
                        rtsbAll.rts = new ResolvedTraitSet(resOpt);
                    }
                    // get the new cache tag now that we have the list of docs
                    cacheTagA = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind);
                    if (cacheTagA) {
                        this.traitCache.set(cacheTagA, rtsbAll);
                    }
                }
            } else {
                // cache was found
                // get the SymbolSet of refereces for this cached object
                const key: string = CdmCorpusDefinition.createCacheKeyFromObject(this, kind);
                resOpt.symbolRefSet = ctx.corpus.definitionReferenceSymbols.get(key);
            }

            // merge child symbols set with current
            currSymbolRefSet.merge(resOpt.symbolRefSet);
            resOpt.symbolRefSet = currSymbolRefSet;

            this.ctx.corpus.isCurrentlyResolving = wasPreviouslyResolving;

            return rtsbAll.rts;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public fetchObjectFromCache(resOpt: resolveOptions, acpInContext?: AttributeContextParameters): ResolvedAttributeSetBuilder {
        const kind: string = 'rasb';
        const ctx: resolveContext = this.ctx as resolveContext; // what it actually is
        const cacheTag: string = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind, acpInContext ? 'ctx' : '');

        return cacheTag ? ctx.cache.get(cacheTag) : undefined;
    }

    /**
     * @internal
     */
    public fetchResolvedAttributes(resOpt?: resolveOptions, acpInContext?: AttributeContextParameters): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            const wasPreviouslyResolving: boolean = this.ctx.corpus.isCurrentlyResolving;
            this.ctx.corpus.isCurrentlyResolving = true;
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            const kind: string = 'rasb';
            const ctx: resolveContext = this.ctx as resolveContext; // what it actually is
            let rasbCache: ResolvedAttributeSetBuilder = this.fetchObjectFromCache(resOpt, acpInContext);
            let underCtx: CdmAttributeContext;

            // store the previous symbol set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currSymRefSet: SymbolSet = resOpt.symbolRefSet || new SymbolSet();
            resOpt.symbolRefSet = new SymbolSet();

            // get the moniker that was found and needs to be appended to all
            // refs in the children attribute context nodes
            const fromMoniker: string = resOpt.fromMoniker;
            resOpt.fromMoniker = undefined;

            // if using the cache passes the maxDepth, we cannot use it
            if (rasbCache && resOpt.depthInfo && resOpt.depthInfo.currentDepth + rasbCache.ras.depthTraveled > resOpt.depthInfo.maxDepth) {
                rasbCache = undefined;
            }

            if (!rasbCache) {
                if (this.resolvingAttributes) {
                    // re-entered this attribute through some kind of self or looping reference.
                    this.ctx.corpus.isCurrentlyResolving = wasPreviouslyResolving;
                    resOpt.inCircularReference = true;
                    this.circularReference = true;
                }
                this.resolvingAttributes = true;

                // if a new context node is needed for these attributes, make it now
                if (acpInContext) {
                    underCtx = CdmAttributeContext.createChildUnder(resOpt, acpInContext);
                }

                rasbCache = this.constructResolvedAttributes(resOpt, underCtx);

                if (rasbCache !== undefined) {

                    this.resolvingAttributes = false;

                    // register set of possible docs
                    const odef: CdmObject = this.fetchObjectDefinition(resOpt);
                    if (odef !== undefined) {
                        ctx.corpus.registerDefinitionReferenceSymbols(odef, kind, resOpt.symbolRefSet);

                        // get the new cache tag now that we have the list of symbols
                        const cacheTag: string = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind, acpInContext ? 'ctx' : '');
                        // save this as the cached version
                        if (cacheTag) {
                            ctx.cache.set(cacheTag, rasbCache);
                        }

                        if (this instanceof CdmObjectReferenceBase &&
                            fromMoniker &&
                            acpInContext &&
                            (this as unknown as CdmObjectReferenceBase).namedReference) {
                            // create a fresh context
                            const oldContext: CdmAttributeContext =
                                acpInContext.under.contents.allItems[acpInContext.under.contents.length - 1] as CdmAttributeContext;
                            acpInContext.under.contents.removeAt(acpInContext.under.contents.length - 1);
                            underCtx = CdmAttributeContext.createChildUnder(resOpt, acpInContext);

                            const newContext: CdmAttributeContext =
                                oldContext.copyAttributeContextTree(resOpt, underCtx, rasbCache.ras, undefined, fromMoniker);
                            // since THIS should be a refererence to a thing found in a moniker document,
                            // it already has a moniker in the reference this function just added that same moniker
                            // to everything in the sub-tree but now this one symbol has too many remove one
                            const monikerPathAdded: string = `${fromMoniker}/`;
                            if (newContext.definition && newContext.definition.namedReference &&
                                newContext.definition.namedReference.startsWith(monikerPathAdded)) {
                                // slice it off the front
                                newContext.definition.namedReference = newContext.definition.namedReference.substring(monikerPathAdded.length);
                            }
                        }
                    }
                }

                if (this.circularReference) {
                    resOpt.inCircularReference = false;
                }
            } else {
                // cache found. if we are building a context, then fix what we got instead of making a new one
                if (acpInContext) {
                    // make the new context
                    underCtx = CdmAttributeContext.createChildUnder(resOpt, acpInContext);

                    (rasbCache.ras.attributeContext).copyAttributeContextTree(resOpt, underCtx, rasbCache.ras, undefined, fromMoniker);
                }
            }

            const currDepthInfo: DepthInfo = resOpt.depthInfo;
            if (isEntityAttributeDefinition(this) && currDepthInfo) {
                // if we hit the maxDepth, we are now going back up
                currDepthInfo.currentDepth--;
                // now at the top of the chain where max depth does not influence the cache
                if (currDepthInfo.currentDepth <= 0) {
                    resOpt.depthInfo = undefined;
                }
            }

            // merge child reference symbols set with current
            currSymRefSet.merge(resOpt.symbolRefSet);
            resOpt.symbolRefSet = currSymRefSet;

            this.ctx.corpus.isCurrentlyResolving = wasPreviouslyResolving;

            return rasbCache !== undefined ? rasbCache.ras : undefined;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public clearTraitCache(): void {
        // let bodyCode = () =>
        {
            this.traitCache = undefined;
        }
        // return p.measure(bodyCode);
    }

    public abstract visit(path: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;
}
