import {
    CdmCorpusContext,
    CdmJsonType,
    cdmObject,
    cdmObjectRef,
    cdmObjectType,
    copyOptions,
    ICdmRelationshipRef,
    Relationship,
    RelationshipImpl,
    RelationshipReference,
    resolveOptions,
    TraitReference,
    VisitCallback
} from '../internal';

export class RelationshipReferenceImpl extends cdmObjectRef implements ICdmRelationshipRef {
    constructor(ctx: CdmCorpusContext, relationship: string | RelationshipImpl, simpleReference: boolean, appliedTraits: boolean) {
        super(ctx, relationship, simpleReference, appliedTraits);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.relationshipRef;
        }
        // return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: string | RelationshipReference): RelationshipReferenceImpl {
        // let bodyCode = () =>
        {
            let simpleReference: boolean = true;
            let appliedTraits: (string | TraitReference)[];
            let relationship: string | RelationshipImpl;
            if (typeof (object) === 'string') {
                relationship = object;
            } else {
                simpleReference = false;
                appliedTraits = object.appliedTraits;
                if (typeof (object.relationshipReference) === 'string') {
                    relationship = object.relationshipReference;
                } else {
                    relationship = RelationshipImpl.instanceFromData(ctx, object.relationshipReference);
                }
            }

            const c: RelationshipReferenceImpl = new RelationshipReferenceImpl(ctx, relationship, simpleReference, !!appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, appliedTraits);

            return c;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.relationshipRef;
        }
        // return p.measure(bodyCode);
    }
    public copyRefData(resOpt: resolveOptions, copy: RelationshipReference,
                       refTo: string | Relationship, options: copyOptions): CdmJsonType {
        // let bodyCode = () =>
        {
            copy.relationshipReference = refTo;

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo: string | RelationshipImpl, simpleReference: boolean): cdmObjectRef {
        // let bodyCode = () =>
        {
            return new RelationshipReferenceImpl(this.ctx, refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
        }
        // return p.measure(bodyCode);
    }

    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            return false;
        }
        // return p.measure(bodyCode);
    }

}
