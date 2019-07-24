import {
    CdmCorpusContext,
    CdmJsonType,
    cdmObject,
    cdmObjectRef,
    cdmObjectType,
    ConstantEntity,
    ConstantEntityImpl,
    copyOptions,
    Entity,
    EntityImpl,
    EntityReference,
    ICdmObjectRef,
    resolveOptions,
    TraitReference,
    VisitCallback
} from '../internal';

const isConstantEntity : (object: Entity | ConstantEntity) => object is ConstantEntity
= (object: Entity | ConstantEntity): object is ConstantEntity => {
    return 'entityShape' in object;
};

export class EntityReferenceImpl extends cdmObjectRef implements ICdmObjectRef {
    constructor(
        ctx: CdmCorpusContext, entityRef: string | EntityImpl | ConstantEntityImpl, simpleReference: boolean, appliedTraits: boolean) {
        super(ctx, entityRef, simpleReference, appliedTraits);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityRef;
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: string | EntityReference): EntityReferenceImpl {

        // let bodyCode = () =>
        {
            let simpleReference: boolean = true;
            let entity: string | EntityImpl | ConstantEntityImpl;
            let appliedTraits: (string | TraitReference)[];
            if (typeof (object) === 'string') {
                entity = object;
            } else {
                simpleReference = false;
                appliedTraits = object.appliedTraits;
                if (typeof (object.entityReference) === 'string') {
                    entity = object.entityReference;
                } else if (isConstantEntity(object.entityReference)) {
                    entity = ConstantEntityImpl.instanceFromData(ctx, object.entityReference);
                } else {
                    entity = EntityImpl.instanceFromData(ctx, object.entityReference);
                }
            }

            const c: EntityReferenceImpl = new EntityReferenceImpl(ctx, entity, simpleReference, !!appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, appliedTraits);

            return c;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.entityRef;
        }
        // return p.measure(bodyCode);
    }
    public copyRefData(resOpt: resolveOptions, copy: EntityReference, refTo: string | Entity, options: copyOptions): CdmJsonType {
        // let bodyCode = () =>
        {
            copy.entityReference = refTo;

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo: string | EntityImpl | ConstantEntityImpl, simpleReference: boolean): cdmObjectRef {
        // let bodyCode = () =>
        {
            return new EntityReferenceImpl(this.ctx, refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
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
