// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { isString } from 'util';
import {
    addTraitRef,
    AttributeContextParameters,
    CdmAttribute,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmObjectDefinitionBase,
    CdmObjectReference,
    cdmObjectType,
    CdmTraitCollection,
    Logger,
    resolveContext,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    SymbolSet,
    VisitCallback
} from '../internal';

export abstract class CdmObjectReferenceBase extends CdmObjectBase implements CdmObjectReference {
    /**
     * @internal
     */
    public static resAttToken: string = '/(resolvedAttributes)/';
    public readonly appliedTraits: CdmTraitCollection;
    public namedReference?: string;
    public explicitReference?: CdmObjectDefinition;
    public simpleNamedReference?: boolean;
    /**
     * @internal
     */
    public monikeredDocument?: CdmDocumentDefinition;

    constructor(ctx: CdmCorpusContext, referenceTo: (string | CdmObjectDefinitionBase), simpleReference: boolean) {
        super(ctx);
        // let bodyCode = () =>
        {
            if (referenceTo) {
                if (typeof (referenceTo) === 'string') {
                    this.namedReference = referenceTo;
                } else {
                    this.explicitReference = referenceTo;
                }
            }
            if (simpleReference) {
                this.simpleNamedReference = true;
            }
            this.appliedTraits = new CdmTraitCollection(this.ctx, this);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public static offsetAttributePromise(ref: string): number {
        if (ref === undefined) {
            return -1;
        }

        return ref.indexOf(this.resAttToken);
    }

    /**
     * @internal
     */
    public copyToHost(ctx: CdmCorpusContext, refTo: string | CdmObjectDefinitionBase, simpleReference: boolean): CdmObjectReferenceBase {
        this.ctx = ctx;
        this.explicitReference = undefined;
        this.namedReference = undefined;

        if (refTo !== undefined) {
            if (isString(refTo)) {
                // NamedReference is a string or JValue
                this.namedReference = refTo;
            } else {
                this.explicitReference = refTo;
            }
        }
        this.simpleNamedReference = simpleReference;

        this.appliedTraits.clear();

        return this;
    }

    /**
     * @deprecated Only for internal use.
     */
    public fetchResolvedReference(resOpt?: resolveOptions): CdmObjectDefinition {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            if (this.explicitReference) {
                return this.explicitReference;
            }

            if (!this.ctx) {
                return undefined;
            }

            const ctx: resolveContext = this.ctx as resolveContext; // what it actually is
            let res: CdmObjectDefinitionBase;

            // if this is a special request for a resolved attribute, look that up now
            const seekResAtt: number = CdmObjectReferenceBase.offsetAttributePromise(this.namedReference);
            if (seekResAtt >= 0) {
                const entName: string = this.namedReference.substring(0, seekResAtt);
                const attName: string = this.namedReference.slice(seekResAtt + CdmObjectReferenceBase.resAttToken.length);
                // get the entity
                const ent: CdmObjectDefinition
                    = (this.ctx.corpus).resolveSymbolReference(resOpt, this.inDocument, entName, cdmObjectType.entityDef, true);

                if (!ent) {
                    Logger.warning(
                        CdmObjectReferenceBase.name,
                        ctx,
                        `unable to resolve an entity named '${entName}' from the reference '${this.namedReference}'`
                    );

                    return undefined;
                }

                // get the resolved attribute
                const ras: ResolvedAttributeSet = ent.fetchResolvedAttributes(resOpt);
                let ra: ResolvedAttribute;
                if (ras !== undefined) {
                    ra = ras.get(attName);
                }
                if (ra) {
                    res = ra.target as CdmAttribute;
                } else {
                    Logger.warning(
                        CdmObjectReferenceBase.name,
                        ctx,
                        `couldn't resolve the attribute promise for '${this.namedReference}'`,
                        `${resOpt.wrtDoc.atCorpusPath}`
                    );
                }
            } else {
                // normal symbolic reference, look up from the Corpus, it knows where everything is
                res =
                    (this.ctx.corpus).resolveSymbolReference(resOpt, this.inDocument, this.namedReference, this.objectType, true);
            }

            return res;
        }
        // return p.measure(bodyCode);
    }

    public createSimpleReference(resOpt?: resolveOptions): CdmObjectReference {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }
        if (this.namedReference) {
            return this.copyRefObject(resOpt, this.namedReference, true);
        }

        return this.copyRefObject(resOpt, this.declaredPath + this.explicitReference.getName(), true);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }
        const copy: CdmObjectReferenceBase = this.copyRefObject(
            resOpt,
            this.namedReference
                ? this.namedReference
                : this.explicitReference,
            this.simpleNamedReference,
            host as CdmObjectReferenceBase);
        if (resOpt.saveResolutionsOnCopy) {
            copy.explicitReference = this.explicitReference;
            copy.inDocument = this.inDocument;
        }
        copy.appliedTraits.clear();
        for (const trait of this.appliedTraits) {
            copy.appliedTraits.push(trait);
        }

        return copy;
    }

    /**
     * @internal
     */
    public abstract copyRefObject(resOpt: resolveOptions, refTo: string | CdmObjectDefinition, simpleReference: boolean, host?: CdmObjectReferenceBase): CdmObjectReferenceBase;

    public fetchObjectDefinitionName(): string {
        // let bodyCode = () =>
        {
            if (this.namedReference) {
                const pathEnd: number = this.namedReference.lastIndexOf('/');
                if (pathEnd === -1 || pathEnd + 1 === this.namedReference.length) {
                    return this.namedReference;
                } else {
                    return this.namedReference.substring(pathEnd + 1);
                }
            }
            if (this.explicitReference) {
                return this.explicitReference.getName();
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public isDerivedFrom(baseDef: string, resOpt: resolveOptions): boolean {
        const def: CdmObjectDefinitionBase = this.fetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);
        if (def) {
            return def.isDerivedFrom(baseDef, resOpt);
        }

        return false;
    }

    public fetchObjectDefinition<T extends CdmObjectDefinition>(resOpt?: resolveOptions): T {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            return this.fetchResolvedReference(resOpt) as unknown as T;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            return (this.namedReference || this.explicitReference) ? true : false;
        }
        // return p.measure(bodyCode);
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = '';
            if (!this.ctx.corpus.blockDeclaredPathChanges) {
                path = this.declaredPath;
                if (this.namedReference) {
                    path = pathFrom + this.namedReference;
                } else {
                    path = pathFrom;
                }
            }
            this.declaredPath = path;

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.explicitReference && !this.namedReference) {
                if (this.explicitReference.visit(path, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.visitRef(path, preChildren, postChildren)) {
                return true;
            }

            if (this.appliedTraits) {
                if (this.appliedTraits.visitArray(`${path}/appliedTraits/`, preChildren, postChildren)) {
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
    public abstract visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;

    /**
     * @internal
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            const rasb: ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
            rasb.ras.setAttributeContext(under);
            const def: CdmObjectDefinition = this.fetchObjectDefinition(resOpt);
            if (def) {
                let acpRef: AttributeContextParameters;
                if (under) {
                    // ask for a 'pass through' context, that is, no new context at this level
                    acpRef = {
                        under: under,
                        type: cdmAttributeContextType.passThrough
                    };
                }
                let resAtts: ResolvedAttributeSet = def.fetchResolvedAttributes(resOpt, acpRef);
                if (resAtts && resAtts.set.length > 0) {
                    resAtts = resAtts.copy();
                    rasb.mergeAttributes(resAtts);
                    rasb.removeRequestedAtts();
                }
            } else {
                const defName: string = this.fetchObjectDefinitionName();
                Logger.warning(defName, this.ctx, `unable to resolve an object from the reference '${defName}'`);
            }

            return rasb;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public fetchResolvedTraits(resOpt?: resolveOptions): ResolvedTraitSet {
        const wasPreviouslyResolving: boolean = this.ctx.corpus.isCurrentlyResolving;
        this.ctx.corpus.isCurrentlyResolving = true;
        const ret: ResolvedTraitSet = this._fetchResolvedTraits(resOpt);
        this.ctx.corpus.isCurrentlyResolving = wasPreviouslyResolving;

        return ret;
    }

    /**
     * @internal
     */
    public _fetchResolvedTraits(resOpt?: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            const kind: string = 'rts';
            if (this.namedReference && !this.appliedTraits) {
                const ctx: resolveContext = this.ctx as resolveContext;
                let cacheTag: string = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind, '', true);
                let rtsResult: ResolvedTraitSet = cacheTag ? ctx.cache.get(cacheTag) : undefined;

                // store the previous reference symbol set, we will need to add it with
                // children found from the constructResolvedTraits call
                const currSymRefSet: SymbolSet = resOpt.symbolRefSet || new SymbolSet();
                resOpt.symbolRefSet = new SymbolSet();

                if (!rtsResult) {
                    const objDef: CdmObjectDefinition = this.fetchObjectDefinition(resOpt);
                    if (objDef !== undefined) {
                        rtsResult = objDef.fetchResolvedTraits(resOpt);
                        if (rtsResult) {
                            rtsResult = rtsResult.deepCopy();
                        }

                        // register set of possible docs
                        ctx.corpus.registerDefinitionReferenceSymbols(objDef, kind, resOpt.symbolRefSet);

                        // get the new cache tag now that we have the list of docs
                        cacheTag = ctx.corpus.createDefinitionCacheTag(resOpt, this, kind, '', true);
                        if (cacheTag) {
                            ctx.cache.set(cacheTag, rtsResult);
                        }
                    }
                } else {
                    // cache was found
                    // get the SymbolSet for this cached object
                    const key: string = CdmCorpusDefinition.createCacheKeyFromObject(this, kind);
                    resOpt.symbolRefSet = ctx.corpus.definitionReferenceSymbols.get(key);
                }

                // merge child symbol references set with current
                currSymRefSet.merge(resOpt.symbolRefSet);
                resOpt.symbolRefSet = currSymRefSet;

                return rtsResult;
            } else {
                return super.fetchResolvedTraits(resOpt);
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            const objDef: CdmObjectDefinition = this.fetchObjectDefinition(resOpt);

            if (objDef) {
                let rtsInh: ResolvedTraitSet = objDef.fetchResolvedTraits(resOpt);
                if (rtsInh) {
                    rtsInh = rtsInh.deepCopy();
                }
                rtsb.takeReference(rtsInh);
            } else {
                const defName: string = this.fetchObjectDefinitionName();
                Logger.warning(defName, this.ctx, `unable to resolve an object from the reference '${defName}'`);
            }

            if (this.appliedTraits) {
                for (const at of this.appliedTraits) {
                    rtsb.mergeTraits(at.fetchResolvedTraits(resOpt));
                }
            }
        }
        // return p.measure(bodyCode);
    }
}
