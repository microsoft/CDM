import {
    ArgumentValue,
    AttributeContextImpl,
    AttributeContextParameters,
    AttributeGroupReference,
    AttributeGroupReferenceImpl,
    AttributeReferenceImpl,
    cdmAttributeContextType,
    CdmCorpusContext,
    cdmObject,
    cdmObjectDef,
    cdmObjectType,
    copyOptions,
    DocumentImpl,
    Entity,
    EntityAttribute,
    EntityAttributeImpl,
    EntityReference,
    EntityReferenceImpl,
    friendlyFormatNode,
    ICdmArgumentDef,
    ICdmAttributeContext,
    ICdmAttributeDef,
    ICdmAttributeGroupDef,
    ICdmAttributeGroupRef,
    ICdmEntityAttributeDef,
    ICdmEntityDef,
    ICdmFolderDef,
    ICdmObject,
    ICdmObjectRef,
    ICdmTraitRef,
    ICdmTypeAttributeDef,
    resolveContext,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedEntity,
    ResolvedEntityReference,
    ResolvedEntityReferenceSet,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitDirectiveSet,
    TraitReference,
    TraitSpec,
    traitToPropertyMap,
    TypeAttribute,
    TypeAttributeImpl,
    VisitCallback
} from '../internal';

export class EntityImpl extends cdmObjectDef implements ICdmEntityDef {

    public get sourceName(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('sourceName');
    }
    public set sourceName(val: string) {
        this.getTraitToPropertyMap()
            .setPropertyValue('sourceName', val);
    }
    public get description(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('description');
    }
    public set description(val: string) {
        this.getTraitToPropertyMap()
            .setPropertyValue('description', val);
    }
    public get displayName(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('displayName');
    }
    public set displayName(val: string) {
        this.getTraitToPropertyMap()
            .setPropertyValue('displayName', val);
    }
    public get version(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('version');
    }
    public set version(val: string) {
        this.getTraitToPropertyMap()
            .setPropertyValue('version', val);
    }
    public get cdmSchemas(): string[] {
        return this.getTraitToPropertyMap()
            .getPropertyValue('cdmSchemas');
    }
    public set cdmSchemas(val: string[]) {
        this.getTraitToPropertyMap()
            .setPropertyValue('cdmSchemas', val);
    }
    public get primaryKey(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('primaryKey');
    }
    public entityName: string;
    public extendsEntity?: EntityReferenceImpl;
    public hasAttributes?: (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[];
    public attributeContext?: AttributeContextImpl;
    public rasb: ResolvedAttributeSetBuilder;
    public t2pm: traitToPropertyMap;

    constructor(
        ctx: CdmCorpusContext, entityName: string, extendsEntity: EntityReferenceImpl, exhibitsTraits: boolean, hasAttributes: boolean) {
        super(ctx, exhibitsTraits);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityDef;
            this.entityName = entityName;
            if (extendsEntity) {
                this.extendsEntity = extendsEntity;
            }
            if (hasAttributes) {
                this.hasAttributes = [];
            }
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: Entity): EntityImpl {
        // let bodyCode = () =>
        {

            let extendsEntity: EntityReferenceImpl;
            extendsEntity = cdmObject.createEntityReference(ctx, object.extendsEntity);
            const c: EntityImpl = new EntityImpl(ctx, object.entityName, extendsEntity, !!object.exhibitsTraits, !!object.hasAttributes);

            if (object.explanation) {
                c.explanation = object.explanation;
            }

            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);
            if (object.attributeContext) {
                c.attributeContext = cdmObject.createAttributeContext(ctx, object.attributeContext);
            }

            c.hasAttributes = cdmObject.createAttributeArray(ctx, object.hasAttributes);
            c.t2pm = new traitToPropertyMap();
            c.t2pm.initForEntityDef(ctx, object, c);

            return c;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.entityDef;
        }
        // return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Entity {
        // let bodyCode = () =>
        {
            const castedToInterface: Entity = {
                explanation: this.explanation,
                entityName: this.entityName,
                extendsEntity: this.extendsEntity ? this.extendsEntity.copyData(resOpt, options) as (string | EntityReference) : undefined,
                exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options)
            };
            this.getTraitToPropertyMap()
                .persistForEntityDef(castedToInterface, options);
            // after the properties so they show up first in doc
            if (this.hasAttributes) {
                castedToInterface.hasAttributes =
                    cdmObject.arraycopyData<string | AttributeGroupReference | TypeAttribute | EntityAttribute>(
                        resOpt, this.hasAttributes, options);
                castedToInterface.attributeContext = this.attributeContext ? this.attributeContext.copyData(resOpt, options) : undefined;
            }

            return castedToInterface;
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): EntityImpl {
        // let bodyCode = () =>
        {
            const copy: EntityImpl = new EntityImpl(this.ctx, this.entityName, undefined, false, false);
            copy.extendsEntity = copy.extendsEntity ? <EntityReferenceImpl>this.extendsEntity.copy(resOpt) : undefined;
            copy.attributeContext = copy.attributeContext ? <AttributeContextImpl>this.attributeContext.copy(resOpt) : undefined;
            copy.hasAttributes
                = cdmObject.arrayCopy<AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>(
                    resOpt, this.hasAttributes);
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.entityName ? true : false;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.separator = ' ';
            ff.addChildString('entity');
            ff.addChildString(this.entityName);
            if (this.extendsEntity) {
                ff.addChildString('extends');
                ff.addChild(this.extendsEntity.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);
            if (this.attributeContext) {
                ff.addChildString('attributeContext');
                ff.addChild(this.attributeContext.getFriendlyFormat());
            }

            const ffSub: friendlyFormatNode = new friendlyFormatNode();
            // ffSub.forceWrap = true;
            ffSub.verticalMode = true;
            ffSub.bracketEmpty = true;
            ffSub.indentChildren = true;
            ffSub.separator = ';\n';
            ffSub.starter = '{';
            ffSub.terminator = '}';
            cdmObject.arrayGetFriendlyFormat(ffSub, this.hasAttributes);
            ff.addChild(ffSub);

            return ff;
        }
        // return p.measure(bodyCode);
    }
    public getName(): string {
        // let bodyCode = () =>
        {
            return this.entityName;
        }
        // return p.measure(bodyCode);
    }
    public getExtendsEntityRef(): ICdmObjectRef {
        // let bodyCode = () =>
        {
            return this.extendsEntity;
        }
        // return p.measure(bodyCode);
    }
    public setExtendsEntityRef(ref: ICdmObjectRef): ICdmObjectRef {
        // let bodyCode = () =>
        {
            this.extendsEntity = ref as EntityReferenceImpl;

            return this.extendsEntity;
        }
        // return p.measure(bodyCode);
    }
    public getHasAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[] {
        // let bodyCode = () =>
        {
            return this.hasAttributes;
        }
        // return p.measure(bodyCode);
    }
    public addAttributeDef(
        attDef: ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)
        : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef {
        // let bodyCode = () =>
        {
            if (!this.hasAttributes) {
                this.hasAttributes = [];
            }
            this.hasAttributes.push(attDef as (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl));

            return attDef;
        }
        // return p.measure(bodyCode);
    }
    public getTraitToPropertyMap(): traitToPropertyMap {
        if (this.t2pm) {
            return this.t2pm;
        }
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForEntityDef(this.ctx, undefined, this);

        return this.t2pm;
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = this.declaredPath;
            if (!path) {
                path = pathFrom + this.entityName;
                this.declaredPath = path;
            }
            // trackVisits(path);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.extendsEntity) {
                if (this.extendsEntity.visit(`${path}/extendsEntity/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.visitDef(path, preChildren, postChildren)) {
                return true;
            }
            if (this.attributeContext) {
                if (this.attributeContext.visit(`${path}/attributeContext/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.hasAttributes) {
                if (cdmObject.visitArray(this.hasAttributes, `${path}/hasAttributes/`, preChildren, postChildren)) {
                    return true;
                }
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
            return this.isDerivedFromDef(resOpt, this.getExtendsEntityRef(), this.getName(), base);
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // base traits then add any elevated from attributes then add things exhibited by the att.
            const base: ICdmObjectRef = this.getExtendsEntityRef();
            if (base) {
                // merge in all from base class
                rtsb.mergeTraits(base.getResolvedTraits(resOpt));
            }

            if (this.hasAttributes) {
                let rtsElevated: ResolvedTraitSet = new ResolvedTraitSet(resOpt);
                for (const att of this.hasAttributes) {
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

    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // an extended entity, traits applied to extended entity, exhibited traits of main entity,
            // the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
            // the relationsip of the attribute, the attribute definition itself and included attribute groups,
            //  any traits applied to the attribute.
            this.rasb = new ResolvedAttributeSetBuilder();
            this.rasb.ras.setAttributeContext(under);

            if (this.extendsEntity) {
                const extRef: ICdmObjectRef = this.getExtendsEntityRef();
                let extendsRefUnder: ICdmAttributeContext;
                let acpExtEnt: AttributeContextParameters;
                if (under) {
                    const acpExt: AttributeContextParameters = {
                        under: under,
                        type: cdmAttributeContextType.entityReferenceExtends,
                        name: 'extends',
                        regarding: undefined,
                        includeTraits: false
                    };
                    extendsRefUnder = this.rasb.ras.createAttributeContext(resOpt, acpExt);
                    acpExtEnt = {
                        under: extendsRefUnder,
                        type: cdmAttributeContextType.entity,
                        name: extRef.getObjectDefName(),
                        regarding: extRef,
                        includeTraits: false
                    };
                }
                this.rasb.mergeAttributes(this.getExtendsEntityRef()
                    .getResolvedAttributes(resOpt, acpExtEnt));
            }
            this.rasb.markInherited();
            this.rasb.ras.setAttributeContext(under);

            if (this.hasAttributes) {
                for (const att of this.hasAttributes) {
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
                    this.rasb.mergeAttributes(att.getResolvedAttributes(resOpt, acpAtt));
                }
            }

            this.rasb.markOrder();
            this.rasb.ras.setAttributeContext(under);

            // things that need to go away
            this.rasb.removeRequestedAtts();

            return this.rasb;
        }
        // return p.measure(bodyCode);
    }

    public countInheritedAttributes(resOpt: resolveOptions): number {
        // let bodyCode = () =>
        {
            // ensures that cache exits
            this.getResolvedAttributes(resOpt);

            return this.rasb.inheritedMark;
        }
        // return p.measure(bodyCode);
    }

    public getResolvedEntity(resOpt: resolveOptions): ResolvedEntity {
        return new ResolvedEntity(resOpt, this);
    }

    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            // this whole resolved entity ref goo will go away when resolved documents are done.
            // for now, it breaks if structured att sets get made.
            resOpt = cdmObject.copyResolveOptions(resOpt);
            resOpt.directives = new TraitDirectiveSet(new Set<string>(['normalized', 'referenceOnly']));

            const ctx: resolveContext = this.ctx as resolveContext; // what it actually is
            let entRefSetCache: ResolvedEntityReferenceSet = ctx.getCache(this, resOpt, 'entRefSet') as ResolvedEntityReferenceSet;
            if (!entRefSetCache) {
                entRefSetCache = new ResolvedEntityReferenceSet(resOpt);
                // get from any base class and then 'fix' those to point here instead.
                const extRef: ICdmObjectRef = this.getExtendsEntityRef();
                if (extRef) {
                    let extDef: ICdmEntityDef = extRef.getObjectDef(resOpt) as ICdmEntityDef;
                    if (extDef) {
                        if (extDef === this) {
                            extDef = extRef.getObjectDef(resOpt) as ICdmEntityDef;
                        }
                        const inherited: ResolvedEntityReferenceSet = extDef.getResolvedEntityReferences(resOpt);
                        if (inherited) {
                            inherited.set.forEach((res: ResolvedEntityReference) => {
                                res = res.copy();
                                res.referencing.entity = this;
                                entRefSetCache.set.push(res);
                            });
                        }
                    }
                }
                if (this.hasAttributes) {
                    for (const attribute of this.hasAttributes) {
                        // if any refs come back from attributes, they don't know who we are, so they don't set the entity
                        const sub: ResolvedEntityReferenceSet = attribute.getResolvedEntityReferences(resOpt);
                        if (sub) {
                            sub.set.forEach((res: ResolvedEntityReference) => {
                                res.referencing.entity = this;
                            });

                            entRefSetCache.add(sub);
                        }
                    }
                }
                ctx.setCache(this, resOpt, 'entRefSet', entRefSetCache);
            }

            return entRefSetCache;
        }
        // return p.measure(bodyCode);
    }

    public getAttributesWithTraits(resOpt: resolveOptions, queryFor: TraitSpec | TraitSpec[]): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            return this.getResolvedAttributes(resOpt)
                .getAttributesWithTraits(resOpt, queryFor);
        }
        // return p.measure(bodyCode);
    }

    // tslint:disable-next-line:no-suspicious-comment
    // TODO: refactor and split this function to be more structured.
    // tslint:disable-next-line:max-func-body-length
    public createResolvedEntity(resOpt: resolveOptions, newEntName: string): ICdmEntityDef {
        // let bodyCode = () =>
        {
            // make the top level attribute context for this entity
            const entName: string = newEntName;
            const ctx: resolveContext = this.ctx as resolveContext;
            let attCtxEnt: AttributeContextImpl = ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, entName, true);
            attCtxEnt.ctx = ctx;
            attCtxEnt.docCreatedIn = this.docCreatedIn;

            // cheating a bit to put the paths in the right place
            const acp: AttributeContextParameters = {
                under: attCtxEnt,
                type: cdmAttributeContextType.attributeGroup,
                name: 'attributeContext'
            };
            const attCtxAC: AttributeContextImpl = AttributeContextImpl.createChildUnder(resOpt, acp);
            const acpEnt: AttributeContextParameters = {
                under: attCtxAC,
                type: cdmAttributeContextType.entity,
                name: entName,
                regarding: ctx.corpus.MakeObject(cdmObjectType.entityRef, this.getName(), true)
            };

            // use this whenever we need to keep references pointing at things that were already found.
            // used when 'fixing' references by localizing to a new document
            const resOptCopy: resolveOptions = cdmObject.copyResolveOptions(resOpt);
            resOptCopy.saveResolutionsOnCopy = true;

            // resolve attributes with this context. the end result is that each resolved attribute
            // points to the level of the context where it was created
            const ras: ResolvedAttributeSet = this.getResolvedAttributes(resOptCopy, acpEnt);

            // create a new copy of the attribute context for this entity
            const allAttCtx: Set<AttributeContextImpl> = new Set<AttributeContextImpl>();
            const newNode: AttributeContextImpl = attCtxEnt.copyNode(resOpt) as AttributeContextImpl;
            attCtxEnt = attCtxEnt.copyAttributeContextTree(resOpt, newNode, ras, allAttCtx);
            const attCtx: ICdmAttributeContext = (attCtxEnt.getContentRefs()[0] as ICdmAttributeContext).getContentRefs()[0] as ICdmAttributeContext;

            // the attributes have been named, shaped, etc for this entity so now it is safe to go and
            // make each attribute context level point at these final versions of attributes
            const attPath2Order: Map<string, number> = new Map<string, number>();
            const pointContextAtResolvedAtts: (rasSub: ResolvedAttributeSet, path: string) => void
                = (rasSub: ResolvedAttributeSet, path: string): void => {
                    rasSub.set.forEach((ra: ResolvedAttribute) => {
                        let raCtx: ICdmAttributeContext;
                        const raCtxSet: Set<ICdmAttributeContext> = rasSub.ra2attCtxSet.get(ra);
                        // find the correct attCtx for this copy
                        for (const currAttCtx of allAttCtx) {
                            if (raCtxSet.has(currAttCtx)) {
                                raCtx = currAttCtx;
                                break;
                            }
                        }
                        if (raCtx) {
                            const refs: (ICdmObjectRef | ICdmAttributeContext)[] = raCtx.getContentRefs();
                            // this won't work when I add the structured attributes to avoid name collisions
                            let attRefPath: string = path + ra.resolvedName;
                            if ((ra.target as ICdmAttributeDef).getObjectType) {
                                const attRef: ICdmObjectRef = this.ctx.corpus.MakeObject(cdmObjectType.attributeRef, attRefPath, true);
                                attPath2Order.set(attRef.getObjectDefName(), ra.insertOrder);
                                refs.push(attRef);
                            } else {
                                attRefPath += '/members/';
                                pointContextAtResolvedAtts(ra.target as ResolvedAttributeSet, attRefPath);
                            }
                        }
                    });
                };

            pointContextAtResolvedAtts(ras, `${entName}/hasAttributes/`);

            // attribute structures may end up with 0 attributes after that. prune them
            const emptyStructures: ([ICdmAttributeContext, ICdmAttributeContext])[] = [];
            const findEmpty: (under: ICdmAttributeContext) => boolean
                = (under: ICdmAttributeContext): boolean => {
                    let isEmpty: boolean = true;
                    under.getContentRefs()
                        .forEach((cr: (ICdmObjectRef | ICdmAttributeContext)) => {
                            if (cr.getObjectType() === cdmObjectType.attributeContextDef) {
                                if (findEmpty(cr as ICdmAttributeContext)) {
                                    if (!(cr as ICdmAttributeContext).getExhibitedTraitRefs()) {
                                        // empty child, remember for later
                                        emptyStructures.push([under, cr as ICdmAttributeContext]);
                                    } else {
                                        // need to keep context with traits, even if it has no atts
                                        isEmpty = false;
                                    }
                                } else {
                                    isEmpty = false;
                                }
                            } else {
                                // some attribute here, so not empty
                                isEmpty = false;
                            }
                        });

                    return isEmpty;
                };
            findEmpty(attCtx);
            // remove all the empties that were found
            emptyStructures.forEach((empty: [ICdmAttributeContext, ICdmAttributeContext]) => {
                const content: (ICdmObjectRef | ICdmAttributeContext)[] = empty['0'].getContentRefs();
                content.splice(content.indexOf(empty['1']), 1);
            });

            // create an all-up ordering of attributes at the leaves of this tree based on insert order
            // sort the attributes in each context by their creation order and mix that with the other sub-contexts that have been sorted
            let getOrderNum: (item: ICdmObject) => number;

            const orderContents: (under: AttributeContextImpl) => number
                = (under: AttributeContextImpl): number => {
                    if (under.lowestOrder === undefined) {
                        under.lowestOrder = -1; // used for group with nothing but traits
                        if (under.contents.length === 1) {
                            under.lowestOrder = getOrderNum(under.contents[0]);
                        } else {
                            under.contents = under.contents.sort((l: ICdmObject, r: ICdmObject): number => {
                                const lNum: number = getOrderNum(l);
                                const rNum: number = getOrderNum(r);

                                if (lNum !== -1 && (under.lowestOrder === -1 || lNum < under.lowestOrder)) {
                                    under.lowestOrder = lNum;
                                }
                                if (rNum !== -1 && (under.lowestOrder === -1 || rNum < under.lowestOrder)) {
                                    under.lowestOrder = rNum;
                                }

                                return lNum - rNum;
                            });
                        }
                    }

                    return under.lowestOrder;
                };

            getOrderNum = (item: ICdmObject): number => {
                if (item.getObjectType() === cdmObjectType.attributeContextDef) {
                    return orderContents(item as AttributeContextImpl);
                } else {
                    return attPath2Order.get(item.getObjectDefName());
                }
            };
            orderContents(attCtx as AttributeContextImpl);

            // make a new document in the same folder as the source entity
            const folder: ICdmFolderDef = this.declaredInDocument.getFolder();
            const fileName: string = `${newEntName}.cdm.json`;
            folder.removeDocument(fileName);
            const docRes: DocumentImpl = folder.addDocument(fileName, '') as DocumentImpl;
            // add a import of the source document
            docRes.addImport(
                this.declaredInDocument.getFolder()
                    .getRelativePath() + this.declaredInDocument.getName(),
                '');

            // make the empty entity
            let entResolved: ICdmEntityDef = docRes.addDefinition<ICdmEntityDef>(cdmObjectType.entityDef, entName);
            entResolved.attributeContext = attCtx;

            // add the traits of the entity
            const rtsEnt: ResolvedTraitSet = this.getResolvedTraits(resOpt);
            rtsEnt.set.forEach((rt: ResolvedTrait) => {
                const traitRef: ICdmTraitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                entResolved.addExhibitedTrait(traitRef, typeof (traitRef) === 'string');
            });

            // resolved attributes can gain traits that are applied to an entity when referenced
            // since these traits are described in the context, it is redundant and messy to list them in the attribute
            // so, remove them. create and cache a set of names to look for per context
            // there is actuall a hierarchy to this. all attributes from the base entity should have all traits applied independed of the
            // sub-context they come from. Same is true of attribute entities. so do this recursively top down
            const ctx2traitNames: Map<ICdmAttributeContext, Set<string>> = new Map<ICdmAttributeContext, Set<string>>();
            const collectContextTraits: (subAttCtx: ICdmAttributeContext, inheritedTraitNames: Set<string>) => void
                = (subAttCtx: ICdmAttributeContext, inheritedTraitNames: Set<string>): void => {
                    const traitNamesHere: Set<string> = new Set<string>(inheritedTraitNames);
                    const traitsHere: ICdmTraitRef[] = subAttCtx.getExhibitedTraitRefs();
                    if (traitsHere) {
                        traitsHere.forEach((tat: ICdmTraitRef) => { traitNamesHere.add(tat.getObjectDefName()); });
                    }
                    ctx2traitNames.set(subAttCtx, traitNamesHere);
                    subAttCtx.getContentRefs()
                        .forEach((cr: ICdmAttributeContext | ICdmObjectRef) => {
                            if (cr.getObjectType() === cdmObjectType.attributeContextDef) {
                                // do this for all types?
                                collectContextTraits(cr as ICdmAttributeContext, traitNamesHere);
                            }
                        });

                };
            collectContextTraits(attCtx, new Set<string>());

            // add the attributes, put them in attribute groups if structure needed
            const resAtt2RefPath: Map<ResolvedAttribute, string> = new Map<ResolvedAttribute, string>();
            const addAttributes: (rasSub: ResolvedAttributeSet, container: ICdmEntityDef | ICdmAttributeGroupDef, path: string) => void
                = (rasSub: ResolvedAttributeSet, container: ICdmEntityDef | ICdmAttributeGroupDef, path: string): void => {
                    rasSub.set.forEach((ra: ResolvedAttribute) => {
                        const attPath: string = path + ra.resolvedName;
                        // use the path of the context associated with this attribute to find the new context that matches on path
                        const raCtxSet: Set<ICdmAttributeContext> = rasSub.ra2attCtxSet.get(ra);
                        let raCtx: AttributeContextImpl;
                        // find the correct attCtx for this copy
                        for (const currAttCtx of allAttCtx) {
                            if (raCtxSet.has(currAttCtx)) {
                                raCtx = currAttCtx;
                                break;
                            }
                        }

                        if ((ra.target as ResolvedAttributeSet).set) {
                            // this is a set of attributes.
                            // make an attribute group to hold them
                            const attGrp: ICdmAttributeGroupDef = this.ctx.corpus.MakeObject(
                                cdmObjectType.attributeGroupDef, ra.resolvedName);
                            attGrp.attributeContext = this.ctx.corpus.MakeObject(
                                cdmObjectType.attributeContextRef, raCtx.corpusPath, true);
                            // take any traits from the set and make them look like traits exhibited by the group
                            const avoidSet: Set<string> = ctx2traitNames.get(raCtx);
                            const rtsAtt: ResolvedTraitSet = ra.resolvedTraits;
                            rtsAtt.set.forEach((rt: ResolvedTrait) => {
                                if (!rt.trait.ugly) { // don't mention your ugly traits
                                    if (avoidSet && !avoidSet.has(rt.traitName)) { // avoid the ones from the context
                                        const traitRef: ICdmTraitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                                        attGrp.addExhibitedTrait(traitRef, typeof (traitRef) === 'string');
                                    }
                                }
                            });

                            // wrap it in a reference and then recurse with this as the new container
                            const attGrpRef: ICdmAttributeGroupRef = this.ctx.corpus.MakeObject(
                                cdmObjectType.attributeGroupRef, undefined);
                            attGrpRef.setObjectDef(attGrp);
                            container.addAttributeDef(attGrpRef);
                            // isn't this where ...
                            addAttributes(ra.target as ResolvedAttributeSet, attGrp, `${attPath}/members/`);
                        } else {
                            const att: ICdmTypeAttributeDef = this.ctx.corpus.MakeObject(cdmObjectType.typeAttributeDef, ra.resolvedName);
                            att.attributeContext = this.ctx.corpus.MakeObject(
                                cdmObjectType.attributeContextRef, raCtx.corpusPath, true);
                            const avoidSet: Set<string> = ctx2traitNames.get(raCtx);
                            const rtsAtt: ResolvedTraitSet = ra.resolvedTraits;
                            rtsAtt.set.forEach((rt: ResolvedTrait) => {
                                if (!rt.trait.ugly) { // don't mention your ugly traits
                                    if (avoidSet && !avoidSet.has(rt.traitName)) { // avoid the ones from the context
                                        const traitRef: ICdmTraitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                                        att.addAppliedTrait(traitRef, typeof (traitRef) === 'string');
                                    }
                                }
                            });
                            container.addAttributeDef(att);
                            resAtt2RefPath.set(ra, attPath);
                        }
                    });
                };
            addAttributes(ras, entResolved, `${entName}/hasAttributes/`);

            // any resolved traits that hold arguments with attribute refs should get 'fixed' here
            const replaceTraitAttRef: (tr: ICdmTraitRef, entityHint: string) => void
                = (tr: ICdmTraitRef, entityHint: string): void => {
                    if (tr.getArgumentDefs()) {
                        tr.getArgumentDefs()
                            .forEach((arg: ICdmArgumentDef) => {
                                const v: ArgumentValue = arg.getValue();
                                // is this an attribute reference?
                                if (v
                                    && (v as ICdmObject).getObjectType
                                    && (v as ICdmObject).getObjectType() === cdmObjectType.attributeRef) {
                                    // only try this if the reference has no path to it (only happens with intra-entity att refs)
                                    const attRef: AttributeReferenceImpl = v as AttributeReferenceImpl;
                                    if (attRef.namedReference && attRef.namedReference.indexOf('/') === -1) {
                                        // get the attribute by name from the resolved atts of this entity
                                        const found: ResolvedAttribute = ras.get(attRef.namedReference);
                                        // change it
                                        if (found) {
                                            const attRefPath: string = resAtt2RefPath.get(found);
                                            arg.setValue(this.ctx.corpus.MakeObject(cdmObjectType.attributeRef, attRefPath, true));
                                        } else {
                                            // give a promise that can be worked out later.
                                            // assumption is that the attribute must come from this entity.
                                            arg.setValue(this.ctx.corpus.MakeObject(
                                                cdmObjectType.attributeRef,
                                                `${entityHint}/(resolvedAttributes)/${attRef.namedReference}`,
                                                true));
                                        }
                                    }
                                }

                            });
                    }
                };

            // fix entity traits
            if (entResolved.getExhibitedTraitRefs()) {
                entResolved.getExhibitedTraitRefs()
                    .forEach((et: ICdmTraitRef) => {
                        replaceTraitAttRef(et, newEntName);
                    });
            }

            // fix context traits
            const fixContextTraits: (subAttCtx: ICdmAttributeContext, entityHint: string) => void
                = (subAttCtx: ICdmAttributeContext, entityHint: string): void => {
                    const traitsHere: ICdmTraitRef[] = subAttCtx.getExhibitedTraitRefs();
                    if (traitsHere) {
                        traitsHere.forEach((tr: ICdmTraitRef) => { replaceTraitAttRef(tr, entityHint); });
                    }
                    subAttCtx.getContentRefs()
                        .forEach((cr: (ICdmAttributeContext | ICdmObjectRef)) => {
                            if (cr.getObjectType() === cdmObjectType.attributeContextDef) {
                                // if this is a new entity context, get the name to pass along
                                const subSubAttCtx: ICdmAttributeContext = cr as ICdmAttributeContext;
                                let subEntityHint: string = entityHint;
                                if (subSubAttCtx.type === cdmAttributeContextType.entity) {
                                    subEntityHint = subSubAttCtx.definition.getObjectDefName();
                                }
                                // do this for all types
                                fixContextTraits(subSubAttCtx, subEntityHint);
                            }
                        });

                };
            fixContextTraits(attCtx, newEntName);
            // and the attribute traits
            const entAtts: (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[] = entResolved.getHasAttributeDefs();
            if (entAtts) {
                for (const attribute of entAtts) {
                    const attTraits: ICdmTraitRef[] = attribute.getAppliedTraitRefs();
                    if (attTraits) {
                        attTraits.forEach((tr: ICdmTraitRef) => { replaceTraitAttRef(tr, newEntName); });
                    }
                }
            }

            // we are about to put this content created in the context of various documents
            // (like references to attributes from base entities, etc.) into one specific document.
            // all of the borrowed refs need to work. so, re-write all string references to work from this new document
            // the catch-22 is that the new document needs these fixes done before it can be used to make these fixes. but it imports the
            // source doc without a moniker, so the results are the same from that pov
            ctx.corpus.localizeReferences(resOpt, docRes);

            // trigger the document to refresh current content into the resolved OM
            (attCtx as AttributeContextImpl).parent = undefined; // remove the fake parent that made the paths work
            const resOptNew: resolveOptions = cdmObject.copyResolveOptions(resOpt);
            resOptNew.wrtDoc = docRes;
            docRes.refresh(resOptNew);
            // get a fresh ref
            entResolved = docRes.getObjectFromDocumentPath(entName) as ICdmEntityDef;

            return entResolved;
        }
        // return p.measure(bodyCode);
    }
}
