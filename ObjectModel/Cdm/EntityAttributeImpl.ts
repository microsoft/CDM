import {
    ArgumentValue,
    AttributeContextImpl,
    AttributeContextParameters,
    AttributeImpl,
    cdmAttributeContextType,
    CdmCorpusContext,
    cdmObject,
    cdmObjectType,
    cdmStatusLevel,
    copyOptions,
    EntityAttribute,
    EntityReference,
    EntityReferenceImpl,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmAttributeDef,
    ICdmConstantEntityDef,
    ICdmDocumentDef,
    ICdmEntityAttributeDef,
    ICdmEntityDef,
    ICdmEntityRef,
    ICdmObject,
    ICdmObjectDef,
    ICdmObjectRef,
    ICdmTraitDef,
    ICdmTraitRef,
    relationshipInfo,
    RelationshipReference,
    RelationshipReferenceImpl,
    resolveContext,
    ResolvedAttribute,
    ResolvedAttributeSetBuilder,
    ResolvedEntityReference,
    ResolvedEntityReferenceSet,
    ResolvedEntityReferenceSide,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitDirectiveSet,
    TraitReference,
    TraitReferenceImpl,
    VisitCallback
} from '../internal';

export class EntityAttributeImpl extends AttributeImpl implements ICdmEntityAttributeDef {
    public relationship: RelationshipReferenceImpl;
    public entity: EntityReferenceImpl;
    public appliedTraits?: TraitReferenceImpl[];

    constructor(ctx: CdmCorpusContext, name: string, appliedTraits: boolean) {
        super(ctx, name, appliedTraits);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityAttributeDef;
        }
        // return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: EntityAttribute): EntityAttributeImpl {
        // let bodyCode = () =>
        {

            const c: EntityAttributeImpl = new EntityAttributeImpl(ctx, object.name, !!object.appliedTraits);

            if (object.explanation) {
                c.explanation = object.explanation;
            }

            c.entity = EntityReferenceImpl.instanceFromData(ctx, object.entity);

            c.relationship = object.relationship ? cdmObject.createRelationshipReference(ctx, object.relationship) : undefined;
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, object.appliedTraits);

            return c;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.entityAttributeDef;
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
    public copyData(resOpt: resolveOptions, options: copyOptions): EntityAttribute {
        // let bodyCode = () =>
        {
            let entity: (string | EntityReference);
            entity = this.entity ? this.entity.copyData(resOpt, options) as (string | EntityReference) : undefined;

            return {
                explanation: this.explanation,
                name: this.name,
                entity: entity,
                relationship: this.relationship
                    ? this.relationship.copyData(resOpt, options) as (string | RelationshipReference)
                    : undefined,
                appliedTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.appliedTraits, options)
            };
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): EntityAttributeImpl {
        // let bodyCode = () =>
        {
            const copy: EntityAttributeImpl = new EntityAttributeImpl(this.ctx, this.name, false);
            copy.entity = <EntityReferenceImpl>this.entity.copy(resOpt);
            this.copyAtt(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.name && this.entity ? true : false;
        }
        // return p.measure(bodyCode);
    }

    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.lineWrap = true;
            ff.addComment(this.explanation);
            ff.addChild(this.relationship.getFriendlyFormat());
            ff.addChildString(this.name);
            let ffSub: friendlyFormatNode = new friendlyFormatNode();
            ffSub.separator = ', ';
            ffSub.starter = '{';
            ffSub.terminator = '}';
            if (this.entity instanceof Array) {
                cdmObject.arrayGetFriendlyFormat(ffSub, this.entity);
                ffSub.forceWrap = true;
            } else {
                ffSub.addChild(this.entity.getFriendlyFormat());
                ffSub.forceWrap = false;
            }
            ff.addChild(ffSub);

            if (this.appliedTraits && this.appliedTraits.length) {
                ffSub = new friendlyFormatNode();
                ffSub.separator = ', ';
                ffSub.starter = '[';
                ffSub.terminator = ']';
                ffSub.lineWrap = true;
                cdmObject.arrayGetFriendlyFormat(ff, this.appliedTraits);
                ff.addChild(ffSub);
            }

            return ff;
        }
        // return p.measure(bodyCode);
    }
    public getEntityRef(): ICdmEntityRef {
        // let bodyCode = () =>
        {
            return this.entity;
        }
        // return p.measure(bodyCode);
    }
    public setEntityRef(entRef: ICdmEntityRef): EntityReferenceImpl {
        // let bodyCode = () =>
        {
            this.entity = entRef as EntityReferenceImpl;

            return this.entity;
        }
        // return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = this.declaredPath;
            if (!path) {
                path = pathFrom + this.name;
                this.declaredPath = path;
            }
            // trackVisits(path);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.entity.visit(`${path}/entity/`, preChildren, postChildren)) {
                return true;
            }
            if (this.visitAtt(path, preChildren, postChildren)) {
                return true;
            }
            if (postChildren && postChildren(this, path)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // // get from relationship
            if (this.relationship) {
                rtsb.takeReference(this.getRelationshipRef()
                    .getResolvedTraits(resOpt));
            }

            this.addResolvedTraitsApplied(rtsb, resOpt);
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the entity used as an attribute, traits applied to that entity,
            // the relationship of the attribute, any traits applied to the attribute.
            let rasb: ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
            const ctxEnt: ICdmEntityRef = this.entity as ICdmEntityRef;
            const underAtt: AttributeContextImpl = under as AttributeContextImpl;
            let acpEnt: AttributeContextParameters;
            if (underAtt) {
                // make a context for this attribute that holds the attributes that come up from the entity
                acpEnt = {
                    under: underAtt,
                    type: cdmAttributeContextType.entity,
                    name: ctxEnt.getObjectDefName(),
                    regarding: ctxEnt,
                    includeTraits: true
                };
            }

            const rtsThisAtt: ResolvedTraitSet = this.getResolvedTraits(resOpt);
            rasb.prepareForTraitApplication(rtsThisAtt);

            // complete cheating but is faster.
            // this relationship will remove all of the attributes that get collected here, so dumb and slow to go get them
            const relInfo: relationshipInfo = this.getRelationshipInfo(resOpt);
            if (relInfo.isFlexRef || relInfo.isLegacyRef) {
                // make the entity context that a real recursion would have give us
                if (under) {
                    under = rasb.ras.createAttributeContext(resOpt, acpEnt);
                }
                // if selecting from one of many attributes, then make a context for each one
                if (under && relInfo.selectsOne) {
                    // the right way to do this is to get a resolved entity from the embedded entity and then
                    // look through the attribute context hierarchy for non-nested entityReferenceAsAttribute nodes
                    // that seems like a disaster waiting to happen given endless looping, etc.
                    // for now, just insist that only the top level entity attributes declared in the ref entity will work
                    const entPickFrom: ICdmEntityDef = (this.entity as ICdmEntityRef).getObjectDef(resOpt) as ICdmEntityDef;
                    let attsPick: ICdmObject[];
                    attsPick = entPickFrom.getHasAttributeDefs();
                    if (entPickFrom && attsPick) {
                        const l: number = attsPick.length;
                        for (let i: number = 0; i < l; i++) {
                            if (attsPick[i].getObjectType() === cdmObjectType.entityAttributeDef) {
                                // a table within a table. as expected with a selectsOne attribute
                                // since this is by ref, we won't get the atts from the table, but we do need the traits that hold the key
                                // these are the same contexts that would get created if we recursed
                                // first this attribute
                                const acpEntAtt: AttributeContextParameters = {
                                    under: under,
                                    type: cdmAttributeContextType.attributeDefinition,
                                    name: attsPick[i].getObjectDefName(),
                                    regarding: attsPick[i],
                                    includeTraits: true
                                };
                                const pickUnder: ICdmAttributeContext = rasb.ras.createAttributeContext(resOpt, acpEntAtt);
                                // and the entity under that attribute
                                const pickEnt: ICdmEntityRef = (attsPick[i] as ICdmEntityAttributeDef).getEntityRef();
                                const acpEntAttEnt: AttributeContextParameters = {
                                    under: pickUnder,
                                    type: cdmAttributeContextType.entity,
                                    name: pickEnt.getObjectDefName(),
                                    regarding: pickEnt,
                                    includeTraits: true
                                };
                                rasb.ras.createAttributeContext(resOpt, acpEntAttEnt);
                            }
                        }
                    }
                }
                // if we got here because of the max depth, need to impose the directives to make the trait work as expected
                if (relInfo.maxDepthExceeded) {
                    const dirNew: TraitDirectiveSet = new TraitDirectiveSet();
                    dirNew.add('referenceOnly');
                    rtsThisAtt.collectDirectives(dirNew);
                }
            } else {
                const resLink: resolveOptions = cdmObject.copyResolveOptions(resOpt);
                resLink.documentRefSet = resOpt.documentRefSet;
                resLink.relationshipDepth = relInfo.nextDepth;
                rasb.mergeAttributes((this.entity as ICdmEntityRef).getResolvedAttributes(resLink, acpEnt));
            }

            // from the traits of relationship and applied here, see if new attributes get generated
            rasb.ras.setAttributeContext(underAtt);
            rasb.applyTraits();
            rasb.generateTraitAttributes(true); // true = apply the prepared traits to new atts
            if (rasb.ras && rasb.ras.set && (relInfo.isFlexRef || relInfo.isLegacyRef)) {
                rasb.ras.set.forEach((att: ResolvedAttribute): void => {
                    const reqdTrait: ResolvedTrait = att.resolvedTraits.find(resOpt, 'is.linkedEntity.identifier');
                    if (!reqdTrait) {
                        return;
                    }

                    if (reqdTrait.parameterValues === undefined || reqdTrait.parameterValues.length === 0) {
                        (this.ctx as resolveContext)
                            .statusRpt(cdmStatusLevel.warning, `is.linkedEntity.identifier does not support arguments`, '');

                        return;
                    }
                    const entReferences: (string)[] = [];
                    const attReferences: (string)[] = [];
                    const addEntityReference: (entRef: ICdmEntityRef) => void = (entityRef: ICdmEntityRef): void => {
                        const entDef: ICdmObjectDef = entityRef.getObjectDef(resOpt);
                        const requiredTrait: ResolvedTrait = entityRef.getResolvedTraits(resOpt)
                            .find(resOpt, 'is.identifiedBy');
                        if (requiredTrait && entDef) {
                            const attRef: ICdmObjectRef
                                = requiredTrait.parameterValues.getParameterValue('attribute').value as ICdmObjectRef;
                            const attName: string =
                                attRef.getObjectDefName()
                                    .split('/')
                                    .pop();
                            entReferences.push(entDef.getObjectPath());
                            attReferences.push(attName);
                        }
                    };
                    if (relInfo.selectsOne) {
                        const entPickFrom: ICdmEntityDef = (this.entity as ICdmEntityRef).getObjectDef(resOpt) as ICdmEntityDef;
                        const attsPick: ICdmObject[] = entPickFrom ? entPickFrom.getHasAttributeDefs() : undefined;
                        if (attsPick) {
                            const l: number = attsPick.length;
                            for (let i: number = 0; i < l; i++) {
                                if (attsPick[i].getObjectType() === cdmObjectType.entityAttributeDef) {
                                    const entAtt: ICdmEntityAttributeDef = attsPick[i] as ICdmEntityAttributeDef;
                                    addEntityReference(entAtt.getEntityRef());
                                }
                            }
                        }
                    } else {
                        addEntityReference(this.entity);
                    }
                    const cEnt: ICdmConstantEntityDef = this.ctx.corpus.MakeObject<ICdmConstantEntityDef>(cdmObjectType.constantEntityDef);
                    cEnt.setEntityShape(this.ctx.corpus.MakeRef(cdmObjectType.entityRef, 'entityGroupSet', true));
                    cEnt.setConstantValues(entReferences.map((entityRef: string, idx: number) => [entityRef, attReferences[idx]]));
                    const param: ICdmObjectRef = this.ctx.corpus.MakeRef(cdmObjectType.entityRef, cEnt, false);
                    reqdTrait.parameterValues.setParameterValue(resOpt, 'entityReferences', param);
                });
            }

            // a 'structured' directive wants to keep all entity attributes together in a group
            if (rtsThisAtt && rtsThisAtt.resOpt.directives && rtsThisAtt.resOpt.directives.has('structured')) {
                const raSub: ResolvedAttribute = new ResolvedAttribute(
                    rtsThisAtt.resOpt, rasb.ras, this.name, rasb.ras.attributeContext as AttributeContextImpl);
                if (relInfo.isArray) {
                    // put a resolved trait on this att group, yuck,
                    //  hope I never need to do this again and then need to make a function for this
                    const tr: ICdmTraitRef =
                        this.ctx.corpus.MakeObject<ICdmTraitRef>(cdmObjectType.traitRef, 'is.linkedEntity.array', true);
                    const t: ICdmTraitDef = tr.getObjectDef(resOpt) as ICdmTraitDef;
                    const rt: ResolvedTrait = new ResolvedTrait(t, undefined, [], []);
                    raSub.resolvedTraits = raSub.resolvedTraits.merge(rt, true);
                }
                rasb = new ResolvedAttributeSetBuilder();
                rasb.ownOne(raSub);
            }

            return rasb;
        }
        // return p.measure(bodyCode);
    }

    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            const relInfo: relationshipInfo = this.getRelationshipInfo(resOpt);
            if (relInfo.isLegacyRef || (relInfo.isFlexRef && !relInfo.isArray)) {
                // only place this is used, so logic here instead of encapsulated.
                // make a set and the one ref it will hold
                const rers: ResolvedEntityReferenceSet = new ResolvedEntityReferenceSet(resOpt);
                const rer: ResolvedEntityReference = new ResolvedEntityReference();
                // referencing attribute(s) come from this attribute
                rer.referencing.rasb.mergeAttributes(this.getResolvedAttributes(resOpt));
                const resolveSide: (entRef: ICdmEntityRef) => ResolvedEntityReferenceSide =
                    (entRef: ICdmEntityRef): ResolvedEntityReferenceSide => {
                        const sideOther: ResolvedEntityReferenceSide = new ResolvedEntityReferenceSide();
                        if (entRef) {
                            // reference to the other entity, hard part is the attribue name.
                            // by convention, this is held in a trait that identifies the key
                            sideOther.entity = entRef.getObjectDef(resOpt) as ICdmEntityDef;
                            if (sideOther.entity) {
                                // now that we resolved the entity, it should be ok and much faster to switch to the
                                // context of the entities document to go after the key
                                const wrtEntityDoc: ICdmDocumentDef = sideOther.entity.declaredInDocument;
                                let otherAttribute: ICdmAttributeDef;
                                const otherOpts: resolveOptions = { wrtDoc: wrtEntityDoc, directives: resOpt.directives };
                                const t: ResolvedTrait = entRef.getResolvedTraits(otherOpts)
                                    .find(otherOpts, 'is.identifiedBy');
                                if (t && t.parameterValues && t.parameterValues.length) {
                                    const otherRef: ArgumentValue = (t.parameterValues.getParameterValue('attribute').value);
                                    if (otherRef && typeof (otherRef) === 'object') {
                                        otherAttribute = (otherRef).getObjectDef(otherOpts) as ICdmObject as ICdmAttributeDef;
                                        if (otherAttribute) {
                                            if (!otherAttribute.getName) {
                                                otherAttribute.getName();
                                            }
                                            sideOther.rasb.ownOne(sideOther.entity.getResolvedAttributes(otherOpts)
                                                .get(otherAttribute.getName())
                                                .copy());
                                        }
                                    }
                                }
                            }
                        }

                        return sideOther;
                    };

                // either several or one entity
                // for now, a sub for the 'select one' idea
                if ((this.entity).explicitReference) {
                    const entPickFrom: ICdmEntityDef = (this.entity as ICdmEntityRef).getObjectDef(resOpt) as ICdmEntityDef;
                    const attsPick: ICdmObject[] = entPickFrom.getHasAttributeDefs();
                    if (entPickFrom && attsPick) {
                        const l: number = attsPick.length;
                        for (let i: number = 0; i < l; i++) {
                            if (attsPick[i].getObjectType() === cdmObjectType.entityAttributeDef) {
                                const er: ICdmEntityRef = (attsPick[i] as ICdmEntityAttributeDef).getEntityRef();
                                rer.referenced.push(resolveSide(er));
                            }
                        }
                    }
                } else {
                    rer.referenced.push(resolveSide(this.entity as ICdmEntityRef));
                }

                rers.set.push(rer);

                return rers;
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    private getRelationshipInfo(resOpt: resolveOptions): relationshipInfo {
        // let bodyCode = () =>
        {
            let rts: ResolvedTraitSet;
            let isFlexRef: boolean = false;
            let isLegacyRef: boolean = false;
            let isArray: boolean = false;
            let selectsOne: boolean = false;
            let nextDepth: number;
            let maxDepthExceeded: boolean = false;

            if (this.relationship) {
                // get the traits for the relationship only
                rts = this.getRelationshipRef()
                    .getResolvedTraits(resOpt);
                if (rts) {
                    // this trait will go away at somepoint ..
                    isLegacyRef = rts.find(resOpt, 'does.referenceEntity') ? true : false; // legacy trait
                    if (rts.resOpt.directives) {
                        // based on directives
                        if (!isLegacyRef) {
                            isFlexRef = rts.resOpt.directives.has('referenceOnly');
                        }
                        selectsOne = rts.resOpt.directives.has('selectOne');
                        isArray = rts.resOpt.directives.has('isArray');
                    }
                    // figure out the depth for the next level
                    const oldDepth: number = resOpt.relationshipDepth;
                    nextDepth = oldDepth;
                    // if this is a 'selectone', then skip counting this entity in the depth, else count it
                    if (!selectsOne) {
                        // if already a ref, who cares?
                        if (!isFlexRef) {
                            if (nextDepth === undefined) {
                                nextDepth = 1;
                            } else {
                                nextDepth++;
                            }
                            // max comes from trait
                            let maxDepth: number = 100; // crazy default
                            const rt: ResolvedTrait = rts.find(resOpt, 'does.referenceEntityVia');
                            if (rt) {
                                const setMax: string = rt.parameterValues.getParameterValue('referencesOnlyAfterDepth')
                                    .getValueString(resOpt);
                                if (setMax !== undefined) {
                                    const max: number = Number.parseInt(setMax, 0);
                                    if (max !== undefined) {
                                        maxDepth = max;
                                    }
                                }
                            }
                            if (nextDepth > maxDepth) {
                                // don't do it
                                isFlexRef = true;
                                maxDepthExceeded = true;
                            }
                        }
                    }
                }
            }

            return {
                rts: rts,
                isFlexRef: isFlexRef,
                isLegacyRef: isLegacyRef,
                isArray: isArray,
                selectsOne: selectsOne,
                nextDepth: nextDepth,
                maxDepthExceeded: maxDepthExceeded
            };
        }
        // return p.measure(bodyCode);
    }

}
