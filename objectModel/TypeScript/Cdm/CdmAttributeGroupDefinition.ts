// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    CdmAttributeContextReference,
    cdmAttributeContextType,
    CdmAttributeItem,
    CdmCollection,
    CdmCorpusContext,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    cdmLogCode,
    Logger,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedEntityReferenceSet,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback,
    StringUtils
} from '../internal';

export class CdmAttributeGroupDefinition extends CdmObjectDefinitionBase {
    private TAG: string = CdmAttributeGroupDefinition.name;

    public attributeGroupName: string;
    public readonly members: CdmCollection<CdmAttributeItem>;
    public attributeContext?: CdmAttributeContextReference;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.attributeGroupDef;
    }

    constructor(ctx: CdmCorpusContext, attributeGroupName: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupDef;
            this.attributeGroupName = attributeGroupName;
            this.members = new CdmCollection<CdmAttributeItem>(this.ctx, this, cdmObjectType.typeAttributeDef);
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.attributeGroupDef;
        }
        // return p.measure(bodyCode);
    }

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        // let bodyCode = () =>
        {
            return false;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmAttributeGroupDefinition {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }
            let copy: CdmAttributeGroupDefinition;
            if (!host) {
                copy = new CdmAttributeGroupDefinition(this.ctx, this.attributeGroupName);
            } else {
                copy = host as CdmAttributeGroupDefinition;
                copy.attributeGroupName = this.attributeGroupName;
                copy.members.clear();
            }

            copy.attributeContext = this.attributeContext ? <CdmAttributeContextReference>this.attributeContext.copy(resOpt) : undefined;
            for (const att of this.members) {
                copy.members.push(att.copy(resOpt) as CdmAttributeItem);
            }
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            if (!this.attributeGroupName) {
                let missingFields: string[] = ['attributeGroupName'];
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
            return this.attributeGroupName;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public getMembersAttributeDefs(): CdmCollection<CdmAttributeItem> {
        // let bodyCode = () =>
        {
            return this.members;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public addAttributeDef(attDef: CdmAttributeItem): CdmAttributeItem {
        // let bodyCode = () =>
        {
            this.members.push(attDef);

            return attDef;
        }
        // return p.measure(bodyCode);
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            const path = this.fetchDeclaredPath(pathFrom);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.attributeContext) {
                this.attributeContext.owner = this;
                if (this.attributeContext.visit(`${path}/attributeContext/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.members) {
                if (this.members.visitArray(`${path}/members/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.visitDef(path, preChildren, postChildren)) {
                return true;
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
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            const rasb: ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
            const allUnder: CdmAttributeContext = under;

            if (under) {
                const acpAttGrp: AttributeContextParameters = {
                    under: under,
                    type: cdmAttributeContextType.attributeGroup,
                    name: this.getName(),
                    regarding: this,
                    includeTraits: false
                };
                under = rasb.ras.createAttributeContext(resOpt, acpAttGrp);
            }

            if (this.members) {
                for (const att of this.members) {
                    let acpAtt: AttributeContextParameters;
                    if (under) {
                        acpAtt = {
                            under: under,
                            type: cdmAttributeContextType.attributeDefinition,
                            name: att.fetchObjectDefinitionName(),
                            regarding: att,
                            includeTraits: false
                        };
                    }
                    const rasFromAtt: ResolvedAttributeSet = att.fetchResolvedAttributes(resOpt, acpAtt);
                    // before we just merge, need to handle the case of 'attribute restatement' AKA an entity with an attribute having the same name as an attribute
                    // from a base entity. thing might come out with different names, if they do, then any attributes owned by a similar named attribute before
                    // that didn't just pop out of that same named attribute now need to go away.
                    // mark any attributes formerly from this named attribute that don't show again as orphans
                    rasb.ras.markOrphansForRemoval((att as CdmAttributeItem).fetchObjectDefinitionName(), rasFromAtt);
                    // now merge
                    rasb.mergeAttributes(rasFromAtt);
                }
            }
            // context must be the one expected from the caller's pov.
            rasb.ras.setAttributeContext(allUnder);

            // things that need to go away
            rasb.removeRequestedAtts();

            return rasb;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @deprecated
     * For internal use only.
     */
    public fetchResolvedEntityReference(resOpt: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            const rers: ResolvedEntityReferenceSet = new ResolvedEntityReferenceSet(resOpt);
            const l: number = this.members.length;
            for (let i: number = 0; i < l; i++) {
                rers.add(this.members.allItems[i].fetchResolvedEntityReference(resOpt));
            }

            return rers;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // get only the elevated traits from attributes first, then add in all traits from this definition
            if (this.members) {
                let rtsElevated: ResolvedTraitSet = new ResolvedTraitSet(resOpt);
                for (const att of this.members) {
                    const rtsAtt: ResolvedTraitSet = att.fetchResolvedTraits(resOpt);
                    if (rtsAtt && rtsAtt.hasElevated) {
                        rtsElevated = rtsElevated.mergeSet(rtsAtt, true);
                    }
                }
                rtsb.mergeTraits(rtsElevated);
            }

            this.constructResolvedTraitsDef(undefined, rtsb, resOpt);
        }
        // return p.measure(bodyCode);
    }
}
