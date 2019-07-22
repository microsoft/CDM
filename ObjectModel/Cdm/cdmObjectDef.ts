import {
    addTraitRef,
    CdmCorpusContext,
    cdmObject,
    cdmObjectRef,
    CorpusImpl,
    friendlyFormatNode,
    ICdmObjectDef,
    ICdmObjectRef,
    ICdmTraitDef,
    ICdmTraitRef,
    removeTraitRef,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitReferenceImpl,
    VisitCallback
} from '../internal';

export abstract class cdmObjectDef extends cdmObject implements ICdmObjectDef {
    public explanation: string;
    public exhibitsTraits: TraitReferenceImpl[];
    public corpusPath: string;
    // baseCache : Set<string>;

    constructor(ctx: CdmCorpusContext, exhibitsTraits: boolean) {
        super(ctx);
        // let bodyCode = () =>
        {
            if (exhibitsTraits) {
                this.exhibitsTraits = [];
            }
        }
        // return p.measure(bodyCode);
    }
    public abstract getName(): string;
    public abstract isDerivedFrom(resOpt: resolveOptions, base: string): boolean;
    public copyDef(resOpt: resolveOptions, copy: cdmObjectDef): void {
        // let bodyCode = () =>
        {
            copy.explanation = this.explanation;
            copy.exhibitsTraits = cdmObject.arrayCopy<TraitReferenceImpl>(resOpt, this.exhibitsTraits);
        }
        // return p.measure(bodyCode);
    }

    public getFriendlyFormatDef(under: friendlyFormatNode): void {
        // let bodyCode = () =>
        {
            if (this.exhibitsTraits && this.exhibitsTraits.length) {
                const ff: friendlyFormatNode = new friendlyFormatNode();
                ff.separator = ' ';
                ff.addChildString('exhibits');
                const ffT: friendlyFormatNode = new friendlyFormatNode();
                ffT.separator = ', ';
                ffT.lineWrap = true;
                cdmObject.arrayGetFriendlyFormat(ffT, this.exhibitsTraits);
                ff.addChild(ffT);
                under.addChild(ff);
            }
            under.addComment(this.explanation);
        }
        // return p.measure(bodyCode);
    }

    public getObjectDefName(): string {
        // let bodyCode = () =>
        {
            return this.getName();
        }
        // return p.measure(bodyCode);
    }
    public getObjectDef(resOpt: resolveOptions): ICdmObjectDef {
        // let bodyCode = () =>
        {
            return this as ICdmObjectDef;
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
    public setExplanation(explanation: string): string {
        this.explanation = explanation;

        return this.explanation;
    }
    public getExhibitedTraitRefs(): ICdmTraitRef[] {
        // let bodyCode = () =>
        {
            return this.exhibitsTraits;
        }
        // return p.measure(bodyCode);
    }
    public addExhibitedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean = false): ICdmTraitRef {
        // let bodyCode = () =>
        {
            if (!traitDef) {
                return undefined;
            }
            this.clearTraitCache();
            if (!this.exhibitsTraits) {
                this.exhibitsTraits = [];
            }

            return addTraitRef(this.ctx, this.exhibitsTraits, traitDef, implicitRef);
        }
        // return p.measure(bodyCode);
    }
    public removeExhibitedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string): void {
        // let bodyCode = () =>
        {
            if (!traitDef) {
                return;
            }
            this.clearTraitCache();
            if (this.exhibitsTraits) {
                removeTraitRef(this.exhibitsTraits, traitDef);
            }
        }
        // return p.measure(bodyCode);
    }

    public visitDef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            if (this.exhibitsTraits) {
                if (cdmObject.visitArray(this.exhibitsTraits, `${pathFrom}/exhibitsTraits/`, preChildren, postChildren)) {
                    return true;
                }
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public isDerivedFromDef(resOpt: resolveOptions, base: ICdmObjectRef, name: string, seek: string): boolean {
        // let bodyCode = () =>
        {
            if (seek === name) {
                return true;
            }

            const def: ICdmObjectDef = base ? base.getObjectDef(resOpt) : undefined;
            if (base && def) {
                return def.isDerivedFrom(resOpt, seek);
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedTraitsDef(base: ICdmObjectRef, rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // get from base class first, then see if some are applied to base class on ref then add any traits exhibited by this def
            if (base) {
                // merge in all from base class
                rtsb.mergeTraits(base.getResolvedTraits(resOpt));
            }
            // merge in any that are exhibited by this class
            if (this.exhibitsTraits) {
                this.exhibitsTraits.forEach((et: TraitReferenceImpl) => {
                    rtsb.mergeTraits(et.getResolvedTraits(resOpt));
                });
            }
        }
        // return p.measure(bodyCode);
    }
    public getObjectPath(): string {
        // let bodyCode = () =>
        {
            return this.corpusPath;
        }
        // return p.measure(bodyCode);
    }

    public createSimpleReference(resOpt: resolveOptions): ICdmObjectRef {
        let name: string;
        if (this.declaredPath) {
            name = this.declaredPath;
        } else {
            name = this.getName();
        }

        const ref: cdmObjectRef = this.ctx.corpus.MakeObject(CorpusImpl.GetReferenceType(this.getObjectType()), name, true);
        if (resOpt.saveResolutionsOnCopy) {
            // used to localize references between documents
            ref.explicitReference = this;
            ref.docCreatedIn = this.docCreatedIn;
        }

        return ref;
    }
}
