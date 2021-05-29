// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CardinalitySettings,
    CdmAttributeItem,
    CdmAttributeResolutionGuidance,
    CdmCorpusContext,
    CdmObjectDefinition,
    CdmObjectDefinitionBase,
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
    /**
     * @internal
     */
    public attributeCount: number;
    /**
     * @deprecated
     * Resolution guidance is being deprecated in favor of Projections. https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
     */
    public resolutionGuidance: CdmAttributeResolutionGuidance;

    /**
     * Cardinality setting for projections
     */
    public cardinality: CardinalitySettings;

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.name = name;
            this.appliedTraits = new CdmTraitCollection(this.ctx, this);
            this.attributeCount = 0;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public copyAtt(resOpt: resolveOptions, copy: CdmAttribute): CdmAttribute {
        // let bodyCode = () =>
        {
            copy.purpose = this.purpose ? this.purpose.copy(resOpt) as CdmPurposeReference : undefined;
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
                this.purpose.owner = this;
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
                this.resolutionGuidance.owner = this;
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
            this.appliedTraits.allItems.forEach(trait => rtsb.mergeTraits(trait.fetchResolvedTraits(resOpt)));

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

    /**
     * @deprecated
     * For internal use only.
     */
    public abstract fetchResolvedEntityReference(resOpt: resolveOptions): ResolvedEntityReferenceSet;

}
