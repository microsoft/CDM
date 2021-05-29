// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    CdmCollection,
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmObject,
    CdmObjectDefinition,
    CdmObjectReference,
    cdmObjectType,
    CdmParameterDefinition,
    CdmTraitDefinition,
    CdmTraitReference,
    copyOptions,
    DepthInfo,
    isEntityAttributeDefinition,
    isEntityDefinition,
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
            return `NULL:/NULL/${this.declaredPath ? this.declaredPath : ''}`;
        } else {
            return `${this.inDocument.atCorpusPath}/${this.declaredPath ? this.declaredPath : ''}`;
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
                let val: string | object | CdmObject = CdmObjectBase.protectParameterValues(resOpt, rt.parameterValues.values[0]);
                if (val !== undefined) {
                    traitRef.arguments.push(undefined, val);
                }
            } else {
                for (let i: number = 0; i < l; i++) {
                    const param: CdmParameterDefinition = rt.parameterValues.fetchParameterAtIndex(i);
                    let val: string | object | CdmObject = CdmObjectBase.protectParameterValues(resOpt, rt.parameterValues.values[i]);
                    if (val !== undefined) {
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
            traitRef.inDocument = (rt.trait as CdmTraitDefinition).inDocument;
        }
        // always make it a property when you can, however the dataFormat traits should be left alone
        // also the wellKnown is the first constrained list that uses the datatype to hold the table instead of the default value property.
        // so until we figure out how to move the enums away from default value, show that trait too
        if (rt.trait.associatedProperties && !rt.trait.isDerivedFrom('is.dataFormat', resOpt) && rt.trait.traitName !== 'is.constrainedList.wellKnown') {
            traitRef.isFromProperty = true;
        }

        return traitRef;
    }

    public abstract isDerivedFrom(baseDef: string, resOpt?: resolveOptions): boolean;
    public abstract copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject;
    public abstract validate(): boolean;

    public abstract getObjectType(): cdmObjectType;
    public abstract fetchObjectDefinitionName(): string;
    public abstract fetchObjectDefinition<T extends CdmObjectDefinition>(resOpt: resolveOptions): T;
    public abstract createSimpleReference(resOpt: resolveOptions): CdmObjectReference;
    /**
     * @internal
     */
    public abstract createPortableReference(resOpt: resolveOptions): CdmObjectReference;

    /**
     * @deprecated
     */
    public copyData(resOpt: resolveOptions, options?: copyOptions): CdmJsonType {
        const persistenceType: string = 'CdmFolder';

        if (resOpt == null) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        if (options == null) {
            options = new copyOptions();
        }

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

            let inCircularReference: boolean = false;
            const wasInCircularReference: boolean = resOpt.inCircularReference;
            if (isEntityDefinition(this)) {
                inCircularReference = resOpt.currentlyResolvingEntities.has(this);
                resOpt.currentlyResolvingEntities.add(this);
                resOpt.inCircularReference = inCircularReference;

                // uncomment this line as a test to turn off allowing cycles
                //if (inCircularReference) {
                //    return new ResolvedAttributeSet();
                //}
            }

            const currentDepth: number = resOpt.depthInfo.currentDepth;

            const kind: string = 'rasb';
            const ctx: resolveContext = this.ctx as resolveContext; // what it actually is
            let rasbResult: ResolvedAttributeSetBuilder;
            let rasbCache: ResolvedAttributeSetBuilder = this.fetchObjectFromCache(resOpt, acpInContext);
            let underCtx: CdmAttributeContext;

            // store the previous symbol set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currSymRefSet: SymbolSet = resOpt.symbolRefSet || new SymbolSet();
            resOpt.symbolRefSet = new SymbolSet();

            // if using the cache passes the maxDepth, we cannot use it
            if (rasbCache && resOpt.depthInfo.currentDepth + rasbCache.ras.depthTraveled > resOpt.depthInfo.maxDepth) {
                rasbCache = undefined;
            }

            if (!rasbCache) {
                // a new context node is needed for these attributes, 
                // this tree will go into the cache, so we hang it off a placeholder parent
                // when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
                // put into the 'receiving' tree
                underCtx = CdmAttributeContext.getUnderContextForCacheContext(resOpt, this.ctx, acpInContext);

                rasbCache = this.constructResolvedAttributes(resOpt, underCtx);

                if (rasbCache !== undefined) {
                    // register set of possible docs
                    const odef: CdmObject = this.fetchObjectDefinition(resOpt);
                    if (odef !== undefined) {
                        ctx.corpus.registerDefinitionReferenceSymbols(odef, kind, resOpt.symbolRefSet);

                        if (this.objectType === cdmObjectType.entityDef) {
                            // if we just got attributes for an entity, take the time now to clean up this cached tree and prune out
                            // things that don't help explain where the final set of attributes came from
                            if (underCtx) {
                                const scopesForAttributes = new Set<CdmAttributeContext>();
                                underCtx.collectContextFromAtts(rasbCache.ras, scopesForAttributes); // the context node for every final attribute
                                if (!underCtx.pruneToScope(scopesForAttributes)) {
                                    return undefined;
                                }
                            }
                        }

                        // get the new cache tag now that we have the list of docs
                        const cacheTag: string = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind, acpInContext ? 'ctx' : undefined);
                        // save this as the cached version
                        if (cacheTag) {
                            ctx.cache.set(cacheTag, rasbCache);
                        }
                    }

                        // get the 'underCtx' of the attribute set from the acp that is wired into
                        // the target tree
                        underCtx = rasbCache.ras.attributeContext ?
                            rasbCache.ras.attributeContext.getUnderContextFromCacheContext(resOpt, acpInContext) : undefined;
                }
            } else {
                // get the 'underCtx' of the attribute set from the cache. The one stored there was build with a different
                // acp and is wired into the fake placeholder. so now build a new underCtx wired into the output tree but with
                // copies of all cached children
                underCtx = rasbCache.ras.attributeContext ?
                    rasbCache.ras.attributeContext.getUnderContextFromCacheContext(resOpt, acpInContext) : undefined;
                //underCtx.validateLineage(resOpt); // debugging
            }

            if (rasbCache) {
                // either just built something or got from cache
                // either way, same deal: copy resolved attributes and copy the context tree associated with it
                // 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
                // 2. deep copy the tree. 

                // 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
                rasbResult = new ResolvedAttributeSetBuilder();
                rasbResult.ras = rasbCache.ras.copy();

                // 2. deep copy the tree and map the context references. 
                if (underCtx) // null context? means there is no tree, probably 0 attributes came out
                {
                    if (!underCtx.associateTreeCopyWithAttributes(resOpt, rasbResult.ras)) {
                        return undefined;
                    }
                }
            }

            if (isEntityAttributeDefinition(this)) {
                // if we hit the maxDepth, we are now going back up
                resOpt.depthInfo.currentDepth = currentDepth;
                // now at the top of the chain where max depth does not influence the cache
                if (resOpt.depthInfo.currentDepth === 0) {
                    resOpt.depthInfo.maxDepthExceeded = false;
                }
            }

            if (!inCircularReference && isEntityDefinition(this)) {
                // should be removed from the root level only
                // if it is in a circular reference keep it there
                resOpt.currentlyResolvingEntities.delete(this);
            }
            resOpt.inCircularReference = wasInCircularReference;

            // merge child reference symbols set with current
            currSymRefSet.merge(resOpt.symbolRefSet);
            resOpt.symbolRefSet = currSymRefSet;

            this.ctx.corpus.isCurrentlyResolving = wasPreviouslyResolving;

            return rasbResult ? rasbResult.ras : undefined;
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

    private static protectParameterValues(resOpt: resolveOptions, val: any) {
        if (val) {
            // the value might be a contant entity object, need to protect the original 
            let cEnt: any = (val as CdmEntityReference) ? (val as CdmEntityReference).explicitReference as CdmConstantEntityDefinition : undefined;
            if (cEnt) {
                // copy the constant entity AND the reference that holds it
                cEnt = cEnt.copy(resOpt) as CdmConstantEntityDefinition;
                val = (val as CdmEntityReference).copy(resOpt);
                (val as CdmEntityReference).explicitReference = cEnt;
            }
        }
        return val;
    }
}
