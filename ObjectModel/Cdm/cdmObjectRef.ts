import {
    addTraitRef,
    AttributeContextParameters,
    cdmAttributeContextType,
    CdmCorpusContext,
    CdmJsonType,
    cdmObject,
    cdmObjectDef,
    cdmObjectType,
    cdmStatusLevel,
    copyOptions,
    CorpusImpl,
    DocSetCollection,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmDocumentDef,
    ICdmObject,
    ICdmObjectDef,
    ICdmObjectRef,
    ICdmTraitDef,
    ICdmTraitRef,
    identifierRef,
    removeTraitRef,
    resolveContext,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitReferenceImpl,
    VisitCallback
} from '../internal';

export abstract class cdmObjectRef extends cdmObject implements ICdmObjectRef {
    public appliedTraits?: TraitReferenceImpl[];
    public namedReference?: string;
    public explicitReference?: cdmObjectDef;
    public simpleNamedReference?: boolean;
    public monikeredDocument?: ICdmDocumentDef;

    constructor(ctx: CdmCorpusContext, referenceTo: (string | cdmObjectDef), simpleReference: boolean, appliedTraits: boolean) {
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
            if (appliedTraits) {
                this.appliedTraits = [];
            }
        }
        // return p.measure(bodyCode);
    }

    public getResolvedReference(resOpt: resolveOptions): cdmObjectDef {
        // let bodyCode = () =>
        {
            if (this.explicitReference) {
                return this.explicitReference;
            }

            if (!this.ctx) {
                return undefined;
            }

            const ctx: resolveContext = this.ctx as resolveContext; // what it actually is
            let res: cdmObjectDef;

            // if this is a special request for a resolved attribute, look that up now
            const resAttToken: string = '/(resolvedAttributes)/';
            const seekResAtt: number = this.namedReference.indexOf(resAttToken);
            if (seekResAtt >= 0) {
                const entName: string = this.namedReference.substring(0, seekResAtt);
                const attName: string = this.namedReference.slice(seekResAtt + resAttToken.length);
                // get the entity
                const ent: ICdmObjectDef
                    = (this.ctx.corpus as CorpusImpl).resolveSymbolReference(resOpt, this.docCreatedIn, entName, cdmObjectType.entityDef);

                if (!ent) {
                    ctx.statusRpt(
                        cdmStatusLevel.warning,
                        `unable to resolve an entity named '${entName}' from the reference '${this.namedReference}'`,
                        '');

                    return undefined;
                }

                // get the resolved attribute
                const ra: ResolvedAttribute
                    = ent.getResolvedAttributes(resOpt)
                        .get(attName);
                if (ra) {
                    res = ra.target as any;
                } else {
                    ctx.statusRpt(cdmStatusLevel.warning, `couldn't resolve the attribute promise for '${this.namedReference}'`, '');
                }
            } else {
                // normal symbolic reference, look up from the Corpus, it knows where everything is
                res =
                    (this.ctx.corpus as CorpusImpl).resolveSymbolReference(resOpt, this.docCreatedIn, this.namedReference, this.objectType);
            }

            return res;
        }
        // return p.measure(bodyCode);
    }

    public createSimpleReference(resOpt: resolveOptions): ICdmObjectRef {
        if (this.namedReference) {
            return this.copyRefObject(resOpt, this.namedReference, true);
        }

        return this.copyRefObject(resOpt, this.declaredPath + this.explicitReference.getName(), true);
    }

    public copyData(resOpt: resolveOptions, options: copyOptions): CdmJsonType {
        // let bodyCode = () =>
        {
            // We don't know what object we are creating to initialize to any
            // tslint:disable-next-line:no-any
            let copy: any = {};
            if (this.namedReference) {
                const identifier: (string | identifierRef)
                    = cdmObject.copyIdentifierRef(this.namedReference, this.getResolvedReference(resOpt), options);
                if (this.simpleNamedReference) {
                    return identifier;
                }
                const replace: CdmJsonType = this.copyRefData(resOpt, copy, identifier, options);
                if (replace) {
                    copy = replace;
                }
            } else if (this.explicitReference) {
                const erCopy: CdmJsonType = this.explicitReference.copyData(resOpt, options);
                const replace: CdmJsonType = this.copyRefData(resOpt, copy, erCopy, options);
                if (replace) {
                    copy = replace;
                }
            }
            if (this.appliedTraits) {
                // We don't know if the object we are copying has applied traits or not and hence use any
                // tslint:disable-next-line:no-any
                copy.appliedTraits = cdmObject.arraycopyData<TraitReferenceImpl>(resOpt, this.appliedTraits, options);
            }

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public abstract copyRefData(resOpt: resolveOptions, copy: CdmJsonType, refTo: CdmJsonType, options: copyOptions): CdmJsonType;

    public copy(resOpt: resolveOptions): ICdmObject {
        const copy: cdmObjectRef = this.copyRefObject(
            resOpt,
            this.namedReference
                ? this.namedReference
                : this.explicitReference,
            this.simpleNamedReference);
        if (resOpt.saveResolutionsOnCopy) {
            copy.explicitReference = this.explicitReference;
            copy.docCreatedIn = this.docCreatedIn;
        }
        if (this.appliedTraits) {
            copy.appliedTraits = cdmObject.arrayCopy<TraitReferenceImpl>(resOpt, this.appliedTraits);
        }

        return copy;
    }
    public abstract copyRefObject(resOpt: resolveOptions, refTo: string | cdmObjectDef, simpleReference: boolean): cdmObjectRef;

    public getObjectDefName(): string {
        // let bodyCode = () =>
        {
            if (this.namedReference) {
                return this.namedReference;
            }
            if (this.explicitReference) {
                return this.explicitReference.getName();
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public getObjectDef<T= ICdmObjectDef>(resOpt: resolveOptions): T {
        // let bodyCode = () =>
        {
            const def: any = this.getResolvedReference(resOpt) as any;
            if (def) {
                return def;
            }
        }
        // return p.measure(bodyCode);
    }

    public setObjectDef(def: ICdmObjectDef): ICdmObjectDef {
        // let bodyCode = () =>
        {
            this.explicitReference = def as cdmObjectDef;

            return def;
        }
        // return p.measure(bodyCode);
    }

    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            if (this.namedReference) {
                ff.addChildString(this.namedReference);
            } else {
                ff.addChild(this.explicitReference.getFriendlyFormat());
            }

            if (this.appliedTraits && this.appliedTraits.length) {
                const ffT: friendlyFormatNode = new friendlyFormatNode();
                ffT.separator = ', ';
                ffT.lineWrap = true;
                ffT.starter = '[';
                ffT.terminator = ']';
                cdmObject.arrayGetFriendlyFormat(ffT, this.appliedTraits);
                ff.addChild(ffT);
            }

            return ff;
        }
        // return p.measure(bodyCode);
    }

    public getAppliedTraitRefs(): ICdmTraitRef[] {
        // let bodyCode = () =>
        {
            return this.appliedTraits;
        }
        // return p.measure(bodyCode);
    }
    public addAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean = false): ICdmTraitRef {
        // let bodyCode = () =>
        {
            if (!traitDef) {
                return undefined;
            }
            this.clearTraitCache();
            if (!this.appliedTraits) {
                this.appliedTraits = [];
            }

            return addTraitRef(this.ctx, this.appliedTraits, traitDef, implicitRef);
        }
        // return p.measure(bodyCode);
    }
    public removeAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string): void {
        // let bodyCode = () =>
        {
            if (!traitDef) {
                return;
            }
            this.clearTraitCache();
            if (this.appliedTraits) {
                removeTraitRef(this.appliedTraits, traitDef);
            }
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
            let path: string = this.declaredPath;
            // if (!path) {
            if (this.namedReference) {
                path = pathFrom + this.namedReference;
            } else {
                path = pathFrom;
            }
            this.declaredPath = path;
            // }

            // trackVisits(path);

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
                if (cdmObject.visitArray(this.appliedTraits, `${path}/appliedTraits/`, preChildren, postChildren)) {
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
    public abstract visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;

    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            const rasb: ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
            rasb.ras.setAttributeContext(under);
            const def: ICdmObjectDef = this.getObjectDef(resOpt);
            if (def) {
                let acpRef: AttributeContextParameters;
                if (under) {
                    // ask for a 'pass through' context, that is, no new context at this level
                    acpRef = {
                        under: under,
                        type: cdmAttributeContextType.passThrough
                    };
                }
                let resAtts: ResolvedAttributeSet = def.getResolvedAttributes(resOpt, acpRef);
                if (resAtts && resAtts.set.length > 0) {
                    resAtts = resAtts.copy();
                    rasb.mergeAttributes(resAtts);
                    rasb.removeRequestedAtts();
                }
            }

            return rasb;
        }
        // return p.measure(bodyCode);
    }

    public getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const kind: string = 'rts';
            if (this.namedReference && !this.appliedTraits) {
                const ctx: resolveContext = this.ctx as resolveContext;
                let cacheTag: string = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind, '', true);
                let rtsResult: ResolvedTraitSet = cacheTag ? ctx.cache.get(cacheTag) : null;

                // store the previous document set, we will need to add it with
                // children found from the constructResolvedTraits call
                const currDocRefSet: DocSetCollection = resOpt.documentRefSet || new DocSetCollection();
                resOpt.documentRefSet = new DocSetCollection();

                if (!rtsResult) {
                    const objDef: ICdmObjectDef = this.getObjectDef(resOpt);
                    rtsResult = objDef.getResolvedTraits(resOpt);
                    if (rtsResult) {
                        rtsResult = rtsResult.deepCopy();
                    }

                    // register set of possible docs
                    ctx.corpus.registerDefinitionReferenceDocuments(this.getObjectDef(resOpt), kind, resOpt.documentRefSet);

                    // get the new cache tag now that we have the list of docs
                    cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind, '', true);
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
            } else {
                return super.getResolvedTraits(resOpt);
            }
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            const objDef: ICdmObjectDef = this.getObjectDef(resOpt);

            if (objDef) {
                let rtsInh: ResolvedTraitSet = objDef.getResolvedTraits(resOpt);
                if (rtsInh) {
                    rtsInh = rtsInh.deepCopy();
                }
                rtsb.takeReference(rtsInh);
            }

            if (this.appliedTraits) {
                this.appliedTraits.forEach((at: TraitReferenceImpl) => {
                    rtsb.mergeTraits(at.getResolvedTraits(resOpt));
                });
            }

        }
        // return p.measure(bodyCode);
    }
}
