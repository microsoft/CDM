import {
    addTraitRef,
    CdmCorpusContext,
    cdmObject,
    cdmObjectDef,
    ICdmAttributeDef,
    ICdmObjectDef,
    ICdmRelationshipRef,
    ICdmTraitDef,
    ICdmTraitRef,
    RelationshipReferenceImpl,
    removeTraitRef,
    ResolvedEntityReferenceSet,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitReferenceImpl,
    VisitCallback
} from '../internal';

export abstract class AttributeImpl extends cdmObjectDef implements ICdmAttributeDef {
    public relationship: RelationshipReferenceImpl;
    public name: string;
    public appliedTraits?: TraitReferenceImpl[];

    constructor(ctx: CdmCorpusContext, name: string, appliedTraits: boolean) {
        super(ctx, false);
        // let bodyCode = () =>
        {
            this.name = name;
            if (appliedTraits) {
                this.appliedTraits = [];
            }
        }
        // return p.measure(bodyCode);
    }

    public copyAtt(resOpt: resolveOptions, copy: AttributeImpl): AttributeImpl {
        // let bodyCode = () =>
        {
            copy.relationship = this.relationship ? <RelationshipReferenceImpl>this.relationship.copy(resOpt) : undefined;
            copy.appliedTraits = cdmObject.arrayCopy<TraitReferenceImpl>(resOpt, this.appliedTraits);
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public getName(): string {
        // let bodyCode = () =>
        {
            return this.name;
        }
        // return p.measure(bodyCode);
    }
    public setObjectDef(def: ICdmObjectDef): ICdmObjectDef {
        // let bodyCode = () =>
        {
            throw Error('not a ref');
        }
        // return p.measure(bodyCode);
    }
    public getRelationshipRef(): ICdmRelationshipRef {
        // let bodyCode = () =>
        {
            return this.relationship;
        }
        // return p.measure(bodyCode);
    }
    public setRelationshipRef(relRef: ICdmRelationshipRef): ICdmRelationshipRef {
        // let bodyCode = () =>
        {
            this.relationship = relRef as RelationshipReferenceImpl;

            return this.relationship;
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

    public visitAtt(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            if (this.relationship) {
                if (this.relationship.visit(`${pathFrom}/relationship/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.appliedTraits) {
                if (cdmObject.visitArray(this.appliedTraits, `${pathFrom}/appliedTraits/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.visitDef(pathFrom, preChildren, postChildren)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public addResolvedTraitsApplied(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const addAppliedTraits: (ats: ICdmTraitRef[]) => void = (ats: ICdmTraitRef[]): void => {
                if (ats) {
                    const l: number = ats.length;
                    for (let i: number = 0; i < l; i++) {
                        rtsb.mergeTraits(ats[i].getResolvedTraits(resOpt));
                    }
                }
            };

            addAppliedTraits(this.appliedTraits);

            // any applied on use
            return rtsb.rts;

        }
        // return p.measure(bodyCode);
    }

    public removeTraitDef(resOpt: resolveOptions, def: ICdmTraitDef): void {
        // let bodyCode = () =>
        {
            this.clearTraitCache();
            const traitName: string = def.getName();
            if (this.appliedTraits) {
                let iRemove: number = 0;
                for (iRemove = 0; iRemove < this.appliedTraits.length; iRemove++) {
                    const tr: TraitReferenceImpl = this.appliedTraits[iRemove];
                    if (tr.getObjectDefName() === traitName) {
                        break;
                    }
                }
                if (iRemove < this.appliedTraits.length) {
                    this.appliedTraits.splice(iRemove, 1);

                    return;
                }
            }
        }
        // return p.measure(bodyCode);
    }
    public abstract getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet;
}
