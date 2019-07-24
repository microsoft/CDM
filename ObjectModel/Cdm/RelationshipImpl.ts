import {
    CdmCorpusContext,
    cdmObject,
    cdmObjectDef,
    cdmObjectType,
    copyOptions,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmObject,
    ICdmRelationshipDef,
    ICdmRelationshipRef,
    Relationship,
    RelationshipReference,
    RelationshipReferenceImpl,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitReference,
    VisitCallback
} from '../internal';

export class RelationshipImpl extends cdmObjectDef implements ICdmRelationshipDef {
    public relationshipName: string;
    public extendsRelationship?: RelationshipReferenceImpl;

    constructor(ctx: CdmCorpusContext, relationshipName: string, extendsRelationship: RelationshipReferenceImpl, exhibitsTraits: boolean) {
        super(ctx, exhibitsTraits);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.relationshipDef;
            this.relationshipName = relationshipName;
            if (extendsRelationship) {
                this.extendsRelationship = extendsRelationship;
            }
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: Relationship): RelationshipImpl {
        // let bodyCode = () =>
        {
            let extendsRelationship: RelationshipReferenceImpl;
            extendsRelationship = cdmObject.createRelationshipReference(ctx, object.extendsRelationship);
            const c: RelationshipImpl = new RelationshipImpl(ctx, object.relationshipName, extendsRelationship, !!object.exhibitsTraits);
            if (object.explanation) {
                c.explanation = object.explanation;
            }
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);

            return c;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.relationshipDef;
        }
        // return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Relationship {
        // let bodyCode = () =>
        {
            return {
                explanation: this.explanation,
                relationshipName: this.relationshipName,
                extendsRelationship: this.extendsRelationship
                ? this.extendsRelationship.copyData(resOpt, options) as object as RelationshipReference : undefined,
                exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options)
            };
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject {
        // let bodyCode = () =>
        {
            const copy: RelationshipImpl = new RelationshipImpl(this.ctx, this.relationshipName, undefined, false);
            copy.extendsRelationship = this.extendsRelationship
                ? <RelationshipReferenceImpl>this.extendsRelationship.copy(resOpt)
                : undefined;
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        return this.relationshipName ? true : false;
    }

    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.addChildString('relationship');
            ff.addChildString(this.relationshipName);
            if (this.extendsRelationship) {
                ff.addChildString('extends');
                ff.addChild(this.extendsRelationship.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);

            return ff;
        }
        // return p.measure(bodyCode);
    }
    public getName(): string {
        // let bodyCode = () =>
        {
            return this.relationshipName;
        }
        // return p.measure(bodyCode);
    }
    public getExtendsRelationshipRef(): ICdmRelationshipRef {
        // let bodyCode = () =>
        {
            return this.extendsRelationship;
        }
        // return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = this.declaredPath;
            if (!path) {
                path = pathFrom + this.relationshipName;
                this.declaredPath = path;
            }
            // trackVisits(path);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.extendsRelationship) {
                if (this.extendsRelationship.visit(`${path}/extendsRelationship/`, preChildren, postChildren)) {
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

    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean {
        // let bodyCode = () =>
        {
            return this.isDerivedFromDef(resOpt, this.getExtendsRelationshipRef(), this.getName(), base);
        }
        // return p.measure(bodyCode);
    }
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsRelationshipRef(), rtsb, resOpt);
            // rtsb.cleanUp();
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
}
