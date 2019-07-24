import {
    AttributeContextParameters,
    AttributeContextReferenceImpl,
    AttributeGroup,
    AttributeGroupReference,
    AttributeGroupReferenceImpl,
    cdmAttributeContextType,
    CdmCorpusContext,
    cdmObject,
    cdmObjectDef,
    cdmObjectType,
    copyOptions,
    EntityAttribute,
    EntityAttributeImpl,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmAttributeGroupDef,
    ICdmAttributeGroupRef,
    ICdmEntityAttributeDef,
    ICdmObject,
    ICdmTypeAttributeDef,
    ResolvedAttributeSetBuilder,
    ResolvedEntityReferenceSet,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitReference,
    TypeAttribute,
    TypeAttributeImpl,
    VisitCallback
} from '../internal';

export class AttributeGroupImpl extends cdmObjectDef implements ICdmAttributeGroupDef {
    public attributeGroupName: string;
    public members: (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[];
    public attributeContext?: AttributeContextReferenceImpl;

    constructor(ctx: CdmCorpusContext, attributeGroupName: string) {
        super(ctx, false);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupDef;
            this.attributeGroupName = attributeGroupName;
            this.members = [];
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: AttributeGroup): AttributeGroupImpl {
        // let bodyCode = () =>
        {
            const c: AttributeGroupImpl = new AttributeGroupImpl(ctx, object.attributeGroupName);

            if (object.explanation) {
                c.explanation = object.explanation;
            }
            c.attributeContext = cdmObject.createAttributeContextReference(ctx, object.attributeContext);
            c.members = cdmObject.createAttributeArray(ctx, object.members);
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);

            return c;
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
    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean {
        // let bodyCode = () =>
        {
            return false;
        }
        // return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): AttributeGroup {
        // let bodyCode = () =>
        {
            return {
                explanation: this.explanation,
                attributeGroupName: this.attributeGroupName,
                exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options),
                attributeContext: this.attributeContext ? this.attributeContext.copyData(resOpt, options) as string : undefined,
                members: cdmObject.
                    arraycopyData<string | AttributeGroupReference | TypeAttribute | EntityAttribute>(resOpt, this.members, options)
            };
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): AttributeGroupImpl {
        // let bodyCode = () =>
        {
            const copy: AttributeGroupImpl = new AttributeGroupImpl(this.ctx, this.attributeGroupName);
            copy.members = cdmObject.arrayCopy<AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>(resOpt, this.members);
            copy.attributeContext = this.attributeContext ? <AttributeContextReferenceImpl>this.attributeContext.copy(resOpt) : undefined;
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.attributeGroupName ? true : false;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.addChildString('attributeGroup');
            ff.addChildString(this.attributeGroupName);
            this.getFriendlyFormatDef(ff);
            const ffSub: friendlyFormatNode = new friendlyFormatNode();
            // ffSub.forceWrap = true;
            ffSub.verticalMode = true;
            ffSub.bracketEmpty = true;
            ffSub.indentChildren = true;
            ffSub.separator = ';\n';
            ffSub.starter = '{';
            ffSub.terminator = '}';
            cdmObject.arrayGetFriendlyFormat(ffSub, this.members);
            ff.addChild(ffSub);

            return ff;
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
    public getMembersAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[] {
        // let bodyCode = () =>
        {
            return this.members;
        }
        // return p.measure(bodyCode);
    }
    public addAttributeDef(attDef: ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)
    : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef {
        // let bodyCode = () =>
        {
            if (!this.members) {
                this.members = [];
            }
            this.members.push(attDef as (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl));

            return attDef;
        }
        // return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = this.declaredPath;
            if (!path) {
                path = pathFrom + this.attributeGroupName;
                this.declaredPath = path;
            }
            // trackVisits(path);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.attributeContext) {
                if (this.attributeContext.visit(`${path}/attributeContext/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.members) {
                if (cdmObject.visitArray(this.members, `${path}/members/`, preChildren, postChildren)) {
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
    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
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
                            name: att.getObjectDefName(),
                            regarding: att,
                            includeTraits: false
                        };
                    }
                    rasb.mergeAttributes(att.getResolvedAttributes(resOpt, acpAtt));
                }
            }
            rasb.ras.setAttributeContext(under);

            // things that need to go away
            rasb.removeRequestedAtts();

            return rasb;
        }
        // return p.measure(bodyCode);
    }
    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            const rers: ResolvedEntityReferenceSet = new ResolvedEntityReferenceSet(resOpt);
            if (this.members) {
                const l: number = this.members.length;
                for (let i: number = 0; i < l; i++) {
                    rers.add(this.members[i].getResolvedEntityReferences(resOpt));
                }
            }

            return rers;
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // get only the elevated traits from attributes first, then add in all traits from this definition
            if (this.members) {
                let rtsElevated: ResolvedTraitSet = new ResolvedTraitSet(resOpt);
                for (const att of this.members) {
                    const rtsAtt: ResolvedTraitSet = att.getResolvedTraits(resOpt);
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
