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
    Errors,
    Logger,
    ResolvedAttributeSetBuilder,
    ResolvedEntityReferenceSet,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmAttributeGroupDefinition extends CdmObjectDefinitionBase {
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
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmAttributeGroupDefinition {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }
            let copy: CdmAttributeGroupDefinition;
            if (!host) {
                copy = new CdmAttributeGroupDefinition(this.ctx, this.attributeGroupName);
            } else {
                copy = host as CdmAttributeGroupDefinition;
                copy.ctx = this.ctx;
                copy.attributeGroupName = this.attributeGroupName;
                copy.members.clear();
            }

            copy.attributeContext = this.attributeContext ? <CdmAttributeContextReference>this.attributeContext.copy(resOpt) : undefined;
            for (const att of this.members) {
                copy.members.push(att);
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
                Logger.error(
                    CdmAttributeGroupDefinition.name,
                    this.ctx,
                    Errors.validateErrorString(this.atCorpusPath, ['attributeGroupName']),
                    this.validate.name
                );

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
            let path: string = '';
            if (!this.ctx.corpus.blockDeclaredPathChanges) {
                path = this.declaredPath;
                if (!path) {
                    path = pathFrom + this.attributeGroupName;
                    this.declaredPath = path;
                }
            }

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.attributeContext) {
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
                    rasb.mergeAttributes(att.fetchResolvedAttributes(resOpt, acpAtt));
                }
            }
            rasb.ras.setAttributeContext(under);

            // things that need to go away
            rasb.removeRequestedAtts();

            return rasb;
        }
        // return p.measure(bodyCode);
    }

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
