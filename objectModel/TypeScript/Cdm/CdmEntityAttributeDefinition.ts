// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    AttributeContextParameters,
    AttributeResolutionContext,
    AttributeResolutionDirectiveSet,
    CdmAttribute,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmAttributeItem,
    CdmAttributeResolutionGuidance,
    CdmCollection,
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmObjectReference,
    cdmObjectType,
    CdmPurposeReference,
    cdmStatusLevel,
    CdmTraitDefinition,
    CdmTraitReference,
    Errors,
    Logger,
    relationshipInfo,
    resolveContext,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedEntityReference,
    ResolvedEntityReferenceSet,
    ResolvedEntityReferenceSide,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmEntityAttributeDefinition extends CdmAttribute {
    public purpose: CdmPurposeReference;
    public entity: CdmEntityReference;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.entityAttributeDef;
    }

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx, name);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityAttributeDef;
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
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmEntityAttributeDefinition {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            let copy: CdmEntityAttributeDefinition;
            if (!host) {
                copy = new CdmEntityAttributeDefinition(this.ctx, this.name);
            } else {
                copy = host as CdmEntityAttributeDefinition;
                copy.ctx = this.ctx;
                copy.name = this.name;
            }
            copy.entity = <CdmEntityReference>this.entity.copy(resOpt);
            this.copyAtt(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            const missingFields: string[] = [];
            if (!this.name) {
                missingFields.push('name');
            }
            if (!this.entity) {
                missingFields.push('entity');
            }
            if (missingFields.length > 0) {
                Logger.error(
                    CdmEntityAttributeDefinition.name,
                    this.ctx,
                    Errors.validateErrorString(this.atCorpusPath, missingFields),
                    this.validate.name
                );

                return false;
            }

            return true;
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
                    path = pathFrom + this.name;
                    this.declaredPath = path;
                }
            }

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

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // // get from purpose
            if (this.purpose) {
                rtsb.takeReference(this.purpose
                    .fetchResolvedTraits(resOpt));
            }

            this.addResolvedTraitsApplied(rtsb, resOpt);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the entity used as an attribute, traits applied to that entity,
            // the purpose of the attribute, any traits applied to the attribute.
            let rasb: ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
            const ctxEnt: CdmEntityReference = this.entity;
            const underAtt: CdmAttributeContext = under;
            let acpEnt: AttributeContextParameters;
            if (underAtt) {
                // make a context for this attribute that holds the attributes that come up from the entity
                acpEnt = {
                    under: underAtt,
                    type: cdmAttributeContextType.entity,
                    name: ctxEnt.fetchObjectDefinitionName(),
                    regarding: ctxEnt,
                    includeTraits: true
                };
            }

            const rtsThisAtt: ResolvedTraitSet = this.fetchResolvedTraits(resOpt);

            // this context object holds all of the info about what needs to happen to resolve these attributes.
            // make a copy and add defaults if missing
            let resGuideWithDefault: CdmAttributeResolutionGuidance;
            if (this.resolutionGuidance !== undefined) {
                resGuideWithDefault = this.resolutionGuidance.copy(resOpt) as CdmAttributeResolutionGuidance;
            } else {
                resGuideWithDefault = new CdmAttributeResolutionGuidance(this.ctx);
            }
            resGuideWithDefault.updateAttributeDefaults(this.name);

            const arc: AttributeResolutionContext = new AttributeResolutionContext(resOpt, resGuideWithDefault, rtsThisAtt);

            // complete cheating but is faster.
            // this purpose will remove all of the attributes that get collected here, so dumb and slow to go get them
            const relInfo: relationshipInfo = this.getRelationshipInfo(arc.resOpt, arc);

            if (relInfo.isByRef) {
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
                    const entPickFrom: CdmEntityDefinition = this.entity.fetchObjectDefinition(resOpt);
                    const attsPick: CdmCollection<CdmAttributeItem> = entPickFrom.attributes;
                    if (entPickFrom && attsPick) {
                        const l: number = attsPick.length;
                        for (let i: number = 0; i < l; i++) {
                            if (attsPick.allItems[i].getObjectType() === cdmObjectType.entityAttributeDef) {
                                // a table within a table. as expected with a selectsOne attribute
                                // since this is by ref, we won't get the atts from the table, but we do need the traits that hold the key
                                // these are the same contexts that would get created if we recursed
                                // first this attribute
                                const acpEntAtt: AttributeContextParameters = {
                                    under: under,
                                    type: cdmAttributeContextType.attributeDefinition,
                                    name: attsPick.allItems[i].fetchObjectDefinitionName(),
                                    regarding: attsPick.allItems[i],
                                    includeTraits: true
                                };
                                const pickUnder: CdmAttributeContext = rasb.ras.createAttributeContext(resOpt, acpEntAtt);
                                // and the entity under that attribute
                                const pickEnt: CdmEntityReference = (attsPick.allItems[i] as CdmEntityAttributeDefinition).entity;
                                const acpEntAttEnt: AttributeContextParameters = {
                                    under: pickUnder,
                                    type: cdmAttributeContextType.entity,
                                    name: pickEnt.fetchObjectDefinitionName(),
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
                    if (!arc.resOpt.directives) {
                        arc.resOpt.directives = new AttributeResolutionDirectiveSet();
                    }
                    arc.resOpt.directives.add('referenceOnly');
                }
            } else {
                const resLink: resolveOptions = CdmObjectBase.copyResolveOptions(resOpt);
                resLink.symbolRefSet = resOpt.symbolRefSet;
                resLink.relationshipDepth = relInfo.nextDepth;
                rasb.mergeAttributes(this.entity.fetchResolvedAttributes(resLink, acpEnt));
            }

            // from the traits of purpose and applied here, see if new attributes get generated
            rasb.ras.setAttributeContext(underAtt);
            rasb.applyTraits(arc);
            rasb.generateApplierAttributes(arc, true); // true = apply the prepared traits to new atts
            // this may have added symbols to the dependencies, so merge them
            resOpt.symbolRefSet.merge(arc.resOpt.symbolRefSet);

            // use the traits for linked entity identifiers to record the actual foreign key links
            if (rasb.ras && rasb.ras.set && (relInfo.isByRef)) {
                rasb.ras.set.forEach((att: ResolvedAttribute): void => {
                    if (att.resolvedTraits) {
                        const reqdTrait: ResolvedTrait = att.resolvedTraits.find(resOpt, 'is.linkedEntity.identifier');
                        if (!reqdTrait) {
                            return;
                        }

                        if (reqdTrait.parameterValues === undefined || reqdTrait.parameterValues.length === 0) {
                            Logger.warning(
                                CdmEntityAttributeDefinition.name,
                                this.ctx as resolveContext,
                                `is.linkedEntity.identifier does not support arguments`
                            );

                            return;
                        }
                        const entReferences: (string)[] = [];
                        const attReferences: (string)[] = [];
                        const addEntityReference: (entRef: CdmEntityReference, namespace: string) => void =
                            (entityRef: CdmEntityReference, namespace: string): void => {
                                const entDef: CdmObjectDefinition = entityRef.fetchObjectDefinition(resOpt);
                                if (entDef) {
                                    const otherResTraits: ResolvedTraitSet = entityRef.fetchResolvedTraits(resOpt);
                                    const identifyingTrait: ResolvedTrait = otherResTraits.find(resOpt, 'is.identifiedBy');
                                    if (otherResTraits && identifyingTrait) {
                                        const attRef: CdmObjectReference = identifyingTrait.parameterValues
                                            .fetchParameterValueByName('attribute').value as CdmObjectReference;
                                        const attNamePath: string = attRef.namedReference;
                                        const attName: string = attNamePath.split('/')
                                            .pop();
                                        // path should be absolute and without a namespace
                                        let relativeEntPath: string =
                                            this.ctx.corpus.storage.createAbsoluteCorpusPath(entDef.atCorpusPath, entDef.inDocument);
                                        if (relativeEntPath.startsWith(`${namespace}:`)) {
                                            relativeEntPath = relativeEntPath.slice(namespace.length + 1);
                                        }
                                        entReferences.push(relativeEntPath);
                                        attReferences.push(attName);
                                    }
                                }
                            };
                        if (relInfo.selectsOne) {
                            const entPickFrom: CdmEntityDefinition = this.entity.fetchObjectDefinition(resOpt);
                            const attsPick: CdmCollection<CdmAttributeItem> = entPickFrom ? entPickFrom.attributes : undefined;
                            if (entPickFrom && attsPick) {
                                const l: number = attsPick.length;
                                for (let i: number = 0; i < l; i++) {
                                    if (attsPick.allItems[i].getObjectType() === cdmObjectType.entityAttributeDef) {
                                        const entAtt: CdmEntityAttributeDefinition = attsPick.allItems[i] as CdmEntityAttributeDefinition;
                                        addEntityReference(entAtt.entity, this.inDocument.namespace);
                                    }
                                }
                            }
                        } else {
                            addEntityReference(this.entity, this.inDocument.namespace);
                        }
                        const cEnt: CdmConstantEntityDefinition =
                            this.ctx.corpus.MakeObject<CdmConstantEntityDefinition>(cdmObjectType.constantEntityDef);
                        cEnt.setEntityShape(this.ctx.corpus.MakeRef(cdmObjectType.entityRef, 'entityGroupSet', true));
                        cEnt.setConstantValues(entReferences.map((entityRef: string, idx: number) => [entityRef, attReferences[idx]]));
                        const param: CdmObjectReference = this.ctx.corpus.MakeRef(cdmObjectType.entityRef, cEnt, false);
                        reqdTrait.parameterValues.setParameterValue(resOpt, 'entityReferences', param);
                    }
                });
            }

            // a 'structured' directive wants to keep all entity attributes together in a group
            if (arc.resOpt.directives && arc.resOpt.directives.has('structured')) {
                const raSub: ResolvedAttribute = new ResolvedAttribute(
                    rtsThisAtt.resOpt, rasb.ras, this.name, rasb.ras.attributeContext);
                if (relInfo.isArray) {
                    // put a resolved trait on this att group, yuck,
                    //  hope I never need to do this again and then need to make a function for this
                    const tr: CdmTraitReference =
                        this.ctx.corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, 'is.linkedEntity.array', true);
                    const t: CdmTraitDefinition = tr.fetchObjectDefinition(resOpt);
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

    // the only thing we need this code for is testing!!!
    public fetchResolvedEntityReference(resOpt?: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            const rtsThisAtt: ResolvedTraitSet = this.fetchResolvedTraits(resOpt);
            const resGuide: CdmAttributeResolutionGuidance = this.resolutionGuidance;

            // this context object holds all of the info about what needs to happen to resolve these attributes
            const arc: AttributeResolutionContext = new AttributeResolutionContext(resOpt, resGuide, rtsThisAtt);

            const relInfo: relationshipInfo = this.getRelationshipInfo(resOpt, arc);
            if (relInfo.isByRef && !relInfo.isArray) {
                // only place this is used, so logic here instead of encapsulated.
                // make a set and the one ref it will hold
                const rers: ResolvedEntityReferenceSet = new ResolvedEntityReferenceSet(resOpt);
                const rer: ResolvedEntityReference = new ResolvedEntityReference();
                // referencing attribute(s) come from this attribute
                rer.referencing.rasb.mergeAttributes(this.fetchResolvedAttributes(resOpt));
                const resolveSide: (entRef: CdmEntityReference) => ResolvedEntityReferenceSide =
                    (entRef: CdmEntityReference): ResolvedEntityReferenceSide => {
                        const sideOther: ResolvedEntityReferenceSide = new ResolvedEntityReferenceSide();
                        if (entRef) {
                            // reference to the other entity, hard part is the attribue name.
                            // by convention, this is held in a trait that identifies the key
                            sideOther.entity = entRef.fetchObjectDefinition(resOpt);
                            if (sideOther.entity) {
                                let otherAttribute: CdmAttribute;
                                const otherOpts: resolveOptions = new resolveOptions(resOpt.wrtDoc, resOpt.directives);
                                const t: ResolvedTrait = entRef.fetchResolvedTraits(otherOpts)
                                    .find(otherOpts, 'is.identifiedBy');
                                if (t && t.parameterValues && t.parameterValues.length) {
                                    const otherRef: ArgumentValue = (t.parameterValues.fetchParameterValueByName('attribute').value);
                                    if (otherRef && typeof (otherRef) === 'object' && 'fetchObjectDefinition' in otherRef
                                        && typeof (otherRef.fetchObjectDefinition) === 'function') {
                                        otherAttribute = (otherRef).fetchObjectDefinition(otherOpts) as CdmObject as CdmAttribute;
                                        if (otherAttribute) {
                                            if (!otherAttribute.getName) {
                                                otherAttribute.getName();
                                            }
                                            const sideOtherRas: ResolvedAttributeSet = sideOther.entity.fetchResolvedAttributes(otherOpts);
                                            if (sideOtherRas !== undefined) {
                                                sideOther.rasb.ownOne(sideOtherRas
                                                    .get(otherAttribute.getName())
                                                    .copy());
                                            }
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
                    const entPickFrom: CdmEntityDefinition = this.entity.fetchObjectDefinition(resOpt);
                    const attsPick: CdmCollection<CdmAttributeItem> = entPickFrom.attributes;
                    if (entPickFrom && attsPick) {
                        const l: number = attsPick.length;
                        for (let i: number = 0; i < l; i++) {
                            if (attsPick.allItems[i].getObjectType() === cdmObjectType.entityAttributeDef) {
                                const er: CdmEntityReference = (attsPick.allItems[i] as CdmEntityAttributeDefinition).entity;
                                rer.referenced.push(resolveSide(er));
                            }
                        }
                    }
                } else {
                    rer.referenced.push(resolveSide(this.entity));
                }

                rers.set.push(rer);

                return rers;
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    private getRelationshipInfo(resOpt: resolveOptions, arc: AttributeResolutionContext): relationshipInfo {
        // let bodyCode = () =>
        {
            const rts: ResolvedTraitSet = undefined;
            let hasRef: boolean = false;
            let isByRef: boolean = false;
            let isArray: boolean = false;
            let selectsOne: boolean = false;
            let nextDepth: number;
            let maxDepthExceeded: boolean = false;

            if (arc && arc.resGuide) {
                if (arc.resGuide.entityByReference !== undefined && arc.resGuide.entityByReference.allowReference === true) {
                    hasRef = true;
                }
                if (arc.resOpt.directives) {
                    // based on directives
                    if (hasRef) {
                        isByRef = arc.resOpt.directives.has('referenceOnly');
                    }
                    selectsOne = arc.resOpt.directives.has('selectOne');
                    isArray = arc.resOpt.directives.has('isArray');
                }
                // figure out the depth for the next level
                const oldDepth: number = resOpt.relationshipDepth;
                nextDepth = oldDepth;
                // if this is a 'selectone', then skip counting this entity in the depth, else count it
                if (!selectsOne) {
                    // if already a ref, who cares?
                    if (!isByRef) {
                        if (nextDepth === undefined) {
                            nextDepth = 1;
                        } else {
                            nextDepth++;
                        }
                        // max comes from settings but may not be set
                        let maxDepth: number = 2;
                        if (hasRef && arc.resGuide.entityByReference.referenceOnlyAfterDepth !== undefined) {
                            maxDepth = arc.resGuide.entityByReference.referenceOnlyAfterDepth;
                        }
                        if (nextDepth > maxDepth) {
                            // don't do it
                            isByRef = true;
                            maxDepthExceeded = true;
                        }
                    }
                }
            }

            return {
                rts: rts,
                isByRef: isByRef,
                isArray: isArray,
                selectsOne: selectsOne,
                nextDepth: nextDepth,
                maxDepthExceeded: maxDepthExceeded
            };
        }
        // return p.measure(bodyCode);
    }

}
