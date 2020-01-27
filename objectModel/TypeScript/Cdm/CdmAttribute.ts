import {
    CdmAttributeItem,
    CdmAttributeResolutionGuidance,
    CdmCollection,
    CdmCorpusContext,
    CdmObjectDefinition,
    CdmObjectDefinitionBase,
    cdmObjectType,
    CdmPurposeReference,
    CdmTraitCollection,
    CdmTraitDefinition,
    CdmTraitReference,
    ResolvedEntityReferenceSet,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';

export abstract class CdmAttribute extends CdmObjectDefinitionBase implements CdmAttributeItem {
    public purpose: CdmPurposeReference;
    public name: string;
    public readonly appliedTraits: CdmTraitCollection;
    public resolutionGuidance: CdmAttributeResolutionGuidance;

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.name = name;
            this.appliedTraits = new CdmTraitCollection(this.ctx, this);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public copyAtt(resOpt: resolveOptions, copy: CdmAttribute): CdmAttribute {
        // let bodyCode = () =>
        {
            copy.purpose = this.purpose ? <CdmPurposeReference>this.purpose.copy(resOpt) : undefined;
            copy.resolutionGuidance = this.resolutionGuidance ?
                this.resolutionGuidance.copy(resOpt) as CdmAttributeResolutionGuidance
                : undefined;
            copy.appliedTraits.clear();
            for (const trait of this.appliedTraits) {
                copy.appliedTraits.push(trait);
            }
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

    /**
     * @internal
     */
    public setObjectDef(def: CdmObjectDefinition): CdmObjectDefinition {
        // let bodyCode = () =>
        {
            throw Error('not a ref');
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public visitAtt(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            if (this.purpose) {
                if (this.purpose.visit(`${pathFrom}/purpose/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.appliedTraits) {
                if (this.appliedTraits.visitArray(`${pathFrom}/appliedTraits/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.resolutionGuidance) {
                if (this.resolutionGuidance.visit(`${pathFrom}/resolutionGuidance/`, preChildren, postChildren)) {
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

    /**
     * @internal
     */
    public addResolvedTraitsApplied(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const l: number = this.appliedTraits.length;
            for (let i: number = 0; i < l; i++) {
                rtsb.mergeTraits(this.appliedTraits.allItems[i].fetchResolvedTraits(resOpt));
            }

            // any applied on use
            return rtsb.rts;
        }
        // return p.measure(bodyCode);
    }

    public removeTraitDef(resOpt: resolveOptions, def: CdmTraitDefinition): void {
        // let bodyCode = () =>
        {
            this.clearTraitCache();
            const traitName: string = def.getName();
            if (this.appliedTraits) {
                let iRemove: number = 0;
                for (iRemove = 0; iRemove < this.appliedTraits.length; iRemove++) {
                    const tr: CdmTraitReference = this.appliedTraits[iRemove] as CdmTraitReference;
                    if (tr.fetchObjectDefinitionName() === traitName) {
                        break;
                    }
                }
                if (iRemove < this.appliedTraits.length) {
                    this.appliedTraits.allItems.splice(iRemove, 1);

                    return;
                }
            }
        }
        // return p.measure(bodyCode);
    }
    public abstract fetchResolvedEntityReference(resOpt: resolveOptions): ResolvedEntityReferenceSet;

}
