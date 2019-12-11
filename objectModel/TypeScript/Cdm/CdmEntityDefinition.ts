import {
    ArgumentValue,
    AttributeContextParameters,
    AttributeResolutionContext,
    AttributeResolutionDirectiveSet,
    CdmAttribute,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmAttributeItem,
    CdmAttributeReference,
    CdmAttributeResolutionGuidance,
    CdmCollection,
    CdmCorpusContext,
    cdmDataFormat,
    CdmDocumentDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmObjectDefinitionBase,
    CdmObjectReference,
    cdmObjectType,
    CdmTraitCollection,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
    Logger,
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
    TraitSpec,
    traitToPropertyMap,
    VisitCallback
} from '../internal';
import { isAttributeReference } from '../Utilities/cdmObjectTypeGuards';

export class CdmEntityDefinition extends CdmObjectDefinitionBase implements CdmEntityDefinition {
    public static get objectType(): cdmObjectType {
        return cdmObjectType.entityDef;
    }
    public get sourceName(): string {
        return this.traitToPropertyMap.fetchPropertyValue('sourceName') as string;
    }
    public set sourceName(val: string) {
        this.traitToPropertyMap.updatePropertyValue('sourceName', val);
    }
    public get description(): string {
        return this.traitToPropertyMap.fetchPropertyValue('description') as string;
    }
    public set description(val: string) {
        this.traitToPropertyMap.updatePropertyValue('description', val);
    }
    public get displayName(): string {
        return this.traitToPropertyMap.fetchPropertyValue('displayName') as string;
    }
    public set displayName(val: string) {
        this.traitToPropertyMap.updatePropertyValue('displayName', val);
    }
    public get version(): string {
        return this.traitToPropertyMap.fetchPropertyValue('version') as string;
    }
    public set version(val: string) {
        this.traitToPropertyMap.updatePropertyValue('version', val);
    }
    public get cdmSchemas(): string[] {
        return this.traitToPropertyMap.fetchPropertyValue('cdmSchemas') as string[];
    }
    public set cdmSchemas(val: string[]) {
        this.traitToPropertyMap.updatePropertyValue('cdmSchemas', val);
    }
    public get primaryKey(): string {
        return this.traitToPropertyMap.fetchPropertyValue('primaryKey') as string;
    }

    public entityName: string;
    public extendsEntity?: CdmEntityReference;
    public attributes: CdmCollection<CdmAttributeItem>;
    public attributeContext?: CdmAttributeContext;
    public rasb: ResolvedAttributeSetBuilder;

    /**
     * The resolution guidance for attributes taken from the entity extended by this entity.
     */
    public extendsEntityResolutionGuidance: CdmAttributeResolutionGuidance
    private traitToPropertyMap: traitToPropertyMap;
    private resolvingEntityReferences: boolean = false;

    constructor(
        ctx: CdmCorpusContext, entityName: string, extendsEntity?: CdmEntityReference) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityDef;
            this.entityName = entityName;
            if (extendsEntity) {
                this.extendsEntity = extendsEntity;
            }

            this.attributes = new CdmCollection<CdmAttributeItem>(this.ctx, this, cdmObjectType.typeAttributeDef);
            this.traitToPropertyMap = new traitToPropertyMap(this);
        }
        // return p.measure(bodyCode);
    }

    public getProperty(propertyName: string): any {
        return this.traitToPropertyMap.fetchPropertyValue(propertyName, true);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.entityDef;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmEntityDefinition {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            let copy: CdmEntityDefinition;
            if (!host) {
                copy = new CdmEntityDefinition(this.ctx, this.entityName, undefined);
            } else {
                copy = host as CdmEntityDefinition;
                copy.ctx = this.ctx;
                copy.entityName = this.entityName;
                copy.attributes.clear();
            }
            copy.extendsEntity = copy.extendsEntity ? <CdmEntityReference>this.extendsEntity.copy(resOpt) : undefined;
            copy.extendsEntityResolutionGuidance =
                this.extendsEntityResolutionGuidance !== undefined ?
                    this.extendsEntityResolutionGuidance.copy(resOpt) as CdmAttributeResolutionGuidance
                    : undefined;
            copy.attributeContext = copy.attributeContext ? <CdmAttributeContext>this.attributeContext.copy(resOpt) : undefined;
            for (const att of this.attributes) {
                copy.attributes.push(att);
            }
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

    public getName(): string {
        // let bodyCode = () =>
        {
            return this.entityName;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public getExtendsEntityRef(): CdmObjectReference {
        // let bodyCode = () =>
        {
            return this.extendsEntity;
        }
        // return p.measure(bodyCode);
    }

    public setExtendsEntityRef(ref: CdmObjectReference): CdmObjectReference {
        // let bodyCode = () =>
        {
            this.extendsEntity = ref as CdmEntityReference;

            return this.extendsEntity;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public addAttributeDef(
        attDef: CdmAttributeItem)
        : CdmAttributeItem {
        // let bodyCode = () =>
        {
            if (!this.attributes) {
                this.attributes = new CdmCollection<CdmAttributeItem>(this.ctx, this, cdmObjectType.typeAttributeDef);
            }
            this.attributes.push(attDef);

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
                    path = pathFrom + this.entityName;
                    this.declaredPath = path;
                }
            }

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
            if (this.attributes) {
                if (this.attributes.visitArray(`${path}/hasAttributes/`, preChildren, postChildren)) {
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

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            return this.isDerivedFromDef(resOpt, this.getExtendsEntityRef(), this.getName(), base);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // base traits then add any elevated from attributes then add things exhibited by the att.
            const base: CdmObjectReference = this.getExtendsEntityRef();
            if (base) {
                // merge in all from base class
                rtsb.mergeTraits(base.fetchResolvedTraits(resOpt));
            }

            if (this.attributes) {
                let rtsElevated: ResolvedTraitSet = new ResolvedTraitSet(resOpt);
                for (const att of this.attributes) {
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

    /**
     * @internal
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // an extended entity, traits applied to extended entity, exhibited traits of main entity,
            // the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
            // the relationsip of the attribute, the attribute definition itself and included attribute groups,
            // any traits applied to the attribute.
            this.rasb = new ResolvedAttributeSetBuilder();
            this.rasb.ras.setAttributeContext(under);

            if (this.extendsEntity) {
                const extRef: CdmObjectReference = this.getExtendsEntityRef();
                let extendsRefUnder: CdmAttributeContext;
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
                        name: extRef.namedReference,
                        regarding: extRef,
                        includeTraits: false
                    };
                }
                // save moniker, extended entity may attach a different moniker that we do not
                // want to pass along to getting this entities attributes
                const oldMoniker: string = resOpt.fromMoniker;

                this.rasb.mergeAttributes(this.getExtendsEntityRef()
                    .fetchResolvedAttributes(resOpt, acpExtEnt));

                if (this.extendsEntityResolutionGuidance) {
                    /**
                     * some guidance was given on how to integrate the base attributes into the set. Apply that guidance
                     */
                    const rtsBase: ResolvedTraitSet = this.fetchResolvedTraits(resOpt);
                    /**
                     * this context object holds all of the info about what needs to happen to resolve these attributes
                     * make a copy and set defaults if needed.
                     */
                    const resGuide: CdmAttributeResolutionGuidance = this.extendsEntityResolutionGuidance.copy(resOpt) as CdmAttributeResolutionGuidance;
                    resGuide.updateAttributeDefaults(resGuide.fetchObjectDefinitionName());

                    /**
                     * holds all the info needed by the resolver code
                     */
                    const arc: AttributeResolutionContext = new AttributeResolutionContext(resOpt, resGuide, rtsBase);

                    this.rasb.generateApplierAttributes(arc, false); /** true = apply the prepared traits to new atts */
                }

                // reset to the old moniker
                resOpt.fromMoniker = oldMoniker;
            }
            this.rasb.markInherited();
            this.rasb.ras.setAttributeContext(under);

            if (this.attributes) {
                for (const att of this.attributes) {
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
                    this.rasb.mergeAttributes(att.fetchResolvedAttributes(resOpt, acpAtt));
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

    /**
     * @internal
     */
    public countInheritedAttributes(resOpt: resolveOptions): number {
        // let bodyCode = () =>
        {
            // ensures that cache exits
            this.fetchResolvedAttributes(resOpt);

            return this.rasb.inheritedMark;
        }
        // return p.measure(bodyCode);
    }
    /**
     * @internal
     */
    /** @deprecated */
    public getResolvedEntity(resOpt: resolveOptions): ResolvedEntity {
        return new ResolvedEntity(resOpt, this);
    }

    public fetchResolvedEntityReference(resOpt?: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            const wasPreviouslyResolving: boolean = this.ctx.corpus.isCurrentlyResolving;
            this.ctx.corpus.isCurrentlyResolving = true;
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            // this whole resolved entity ref goo will go away when resolved documents are done.
            // for now, it breaks if structured att sets get made.
            resOpt = CdmObjectBase.copyResolveOptions(resOpt);
            resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly']));

            const ctx: resolveContext = this.ctx as resolveContext; // what it actually is
            let entRefSetCache: ResolvedEntityReferenceSet = ctx.fetchCache(this, resOpt, 'entRefSet') as ResolvedEntityReferenceSet;
            if (!entRefSetCache) {
                entRefSetCache = new ResolvedEntityReferenceSet(resOpt);

                if (!this.resolvingEntityReferences) {
                    this.resolvingEntityReferences = true;
                    // get from any base class and then 'fix' those to point here instead.
                    const extRef: CdmObjectReference = this.getExtendsEntityRef();
                    if (extRef) {
                        let extDef: CdmEntityDefinition = extRef.fetchObjectDefinition(resOpt);
                        if (extDef) {
                            if (extDef === this) {
                                extDef = extRef.fetchObjectDefinition(resOpt);
                            }
                            const inherited: ResolvedEntityReferenceSet = extDef.fetchResolvedEntityReference(resOpt);
                            if (inherited) {
                                inherited.set.forEach((res: ResolvedEntityReference) => {
                                    res = res.copy();
                                    res.referencing.entity = this;
                                    entRefSetCache.set.push(res);
                                });
                            }
                        }
                    }
                    if (this.attributes) {
                        for (const attribute of this.attributes) {
                            // if any refs come back from attributes, they don't know who we are, so they don't set the entity
                            const sub: ResolvedEntityReferenceSet = attribute.fetchResolvedEntityReference(resOpt);
                            if (sub) {
                                sub.set.forEach((res: ResolvedEntityReference) => {
                                    res.referencing.entity = this;
                                });

                                entRefSetCache.add(sub);
                            }
                        }
                    }
                    ctx.updateCache(this, resOpt, 'entRefSet', entRefSetCache);
                    this.resolvingEntityReferences = false;
                }
            }
            this.ctx.corpus.isCurrentlyResolving = wasPreviouslyResolving;

            return entRefSetCache;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public fetchAttributesWithTraits(resOpt: resolveOptions, queryFor: TraitSpec | TraitSpec[]): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            return this.fetchResolvedAttributes(resOpt)
                .fetchAttributesWithTraits(resOpt, queryFor);
        }
        // return p.measure(bodyCode);
    }

    // tslint:disable-next-line:no-suspicious-comment
    // TODO: refactor and split this function to be more structured.
    // tslint:disable-next-line:max-func-body-length
    public async createResolvedEntityAsync(
        newEntName: string,
        resOpt?: resolveOptions,
        folder?: CdmFolderDefinition,
        newDocName?: string): Promise<CdmEntityDefinition> {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            // if the wrtDoc needs to be indexed (like it was just modified) then do that first
            if (!resOpt.wrtDoc) {
                Logger.error('CdmEntityDefinition', this.ctx, 'No WRT document was supplied', 'CreateResolvedEntityAsync');

                return undefined;
            }

            if (!newEntName || newEntName === '') {
                Logger.error('CdmEntityDefinition', this.ctx, 'No Entity Name provided', 'CreateResolvedENtityAsync');

                return undefined;
            }

            if (!folder) {
                folder = this.inDocument.folder;
            }

            const fileName: string = (newDocName === undefined || newDocName === '') ? `${newEntName}.cdm.json` : newDocName;
            let origDoc: string = this.inDocument.atCorpusPath;

            // Don't overwite the source document
            const targetAtCorpusPath: string = `${this.ctx.corpus.storage.createAbsoluteCorpusPath(folder.atCorpusPath, folder)}${fileName}`;
            if (targetAtCorpusPath === origDoc) {
                Logger.error(
                    CdmEntityDefinition.name,
                    this.ctx as resolveContext,
                    `attempting to replace source entity's document '${targetAtCorpusPath}`,
                    'CreateResolvedEntity'
                );

                return undefined;
            }

            // if the wrtDoc needs to be indexed (like it was just modified) then do that first
            if (await (resOpt.wrtDoc.indexIfNeeded(resOpt)) === false) {
                Logger.error(CdmEntityDefinition.name, this.ctx, 'Couldn\'t index source document', 'CreateResolvedEntity');

                return undefined;
            }

            // make the top level attribute context for this entity
            // for this whole section where we generate the attribute context tree and get resolved attributes
            // set the flag that keeps all of the parent changes and document dirty from from happening 
            const wasResolving: boolean = this.ctx.corpus.isCurrentlyResolving;
            this.ctx.corpus.isCurrentlyResolving = true;
            const entName: string = newEntName;
            const ctx: resolveContext = this.ctx as resolveContext;
            let attCtxEnt: CdmAttributeContext = ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, entName, true);
            attCtxEnt.ctx = ctx;
            attCtxEnt.inDocument = this.inDocument;

            // cheating a bit to put the paths in the right place
            const acp: AttributeContextParameters = {
                under: attCtxEnt,
                type: cdmAttributeContextType.attributeGroup,
                name: 'attributeContext'
            };
            const attCtxAC: CdmAttributeContext = CdmAttributeContext.createChildUnder(resOpt, acp);
            const acpEnt: AttributeContextParameters = {
                under: attCtxAC,
                type: cdmAttributeContextType.entity,
                name: entName,
                regarding: ctx.corpus.MakeObject(cdmObjectType.entityRef, this.getName(), true)
            };

            // use this whenever we need to keep references pointing at things that were already found.
            // used when 'fixing' references by localizing to a new document
            const resOptCopy: resolveOptions = CdmObjectBase.copyResolveOptions(resOpt);
            resOptCopy.saveResolutionsOnCopy = true;

            // resolve attributes with this context. the end result is that each resolved attribute
            // points to the level of the context where it was created
            const ras: ResolvedAttributeSet = this.fetchResolvedAttributes(resOptCopy, acpEnt);

            // create a new copy of the attribute context for this entity
            const allAttCtx: Set<CdmAttributeContext> = new Set<CdmAttributeContext>();
            const newNode: CdmAttributeContext = attCtxEnt.copyNode(resOpt) as CdmAttributeContext;
            attCtxEnt = attCtxEnt.copyAttributeContextTree(resOpt, newNode, ras, allAttCtx, 'resolvedFrom');
            const attCtx: CdmAttributeContext = (attCtxEnt.contents.allItems[0] as CdmAttributeContext)
                .contents.allItems[0] as CdmAttributeContext;

            this.ctx.corpus.isCurrentlyResolving = wasResolving;

            // make a new document in given folder if provided or the same folder as the source entity
            folder.documents.remove(fileName);
            const docRes: CdmDocumentDefinition = folder.documents.push(fileName);
            // add a import of the source document 
            origDoc = this.ctx.corpus.storage.createRelativeCorpusPath(origDoc, docRes); // just in case we missed the prefix
            docRes.imports.push(origDoc, 'resolvedFrom');

            // make the empty entity
            let entResolved: CdmEntityDefinition = docRes.definitions.push(entName) as CdmEntityDefinition;
            // set the context to the copy of the tree. fix the docs on the context nodes
            entResolved.attributeContext = attCtx;
            attCtx.visit(
                `${entName}/attributeContext/`,
                (iObject: CdmObject, path: string) => {
                    iObject.inDocument = docRes;

                    return false;
                },
                undefined);

            // add the traits of the entity
            const rtsEnt: ResolvedTraitSet = this.fetchResolvedTraits(resOpt);
            rtsEnt.set.forEach((rt: ResolvedTrait) => {
                const traitRef: CdmTraitReference = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
                (entResolved as CdmObjectDefinition).exhibitsTraits.push(traitRef);
            });

            // the attributes have been named, shaped, etc for this entity so now it is safe to go and
            // make each attribute context level point at these final versions of attributes
            const attPath2Order: Map<string, number> = new Map<string, number>();
            const pointContextAtResolvedAtts: (rasSub: ResolvedAttributeSet, path: string) => void
                = (rasSub: ResolvedAttributeSet, path: string): void => {
                    rasSub.set.forEach((ra: ResolvedAttribute) => {
                        const raCtxInEnt: CdmAttributeContext[] = [];
                        const raCtxSet: Set<CdmAttributeContext> = rasSub.ra2attCtxSet.get(ra);
                        // find the correct attCtx for this copy
                        // iterate over the shortest list
                        if (allAttCtx.size < raCtxSet.size) {
                            for (const currAttCtx of allAttCtx) {
                                if (raCtxSet.has(currAttCtx)) {
                                    raCtxInEnt.push(currAttCtx);
                                }
                            }
                        } else {
                            for (const currAttCtx of raCtxSet) {
                                if (allAttCtx.has(currAttCtx)) {
                                    raCtxInEnt.push(currAttCtx);
                                }
                            }
                        }
                        for (const raCtx of raCtxInEnt) {

                            const refs: CdmCollection<CdmObject> = raCtx.contents;
                            // there might be more than one explanation for where and attribute came from when things get merges as they do
                            // this won't work when I add the structured attributes to avoid name collisions
                            let attRefPath: string = path + ra.resolvedName;
                            if ((ra.target as CdmAttribute).getObjectType) {
                                const attRef: CdmObjectReference = this.ctx.corpus.MakeObject(cdmObjectType.attributeRef, attRefPath, true);
                                if (!attPath2Order.has(attRef.namedReference)) {
                                    // only need one explanation for this path to the insert order
                                    attPath2Order.set(attRef.namedReference, ra.insertOrder);
                                }
                                refs.push(attRef);
                            } else {
                                attRefPath += '/members/';
                                pointContextAtResolvedAtts(ra.target as ResolvedAttributeSet, attRefPath);
                            }
                        }
                    });
                };

            pointContextAtResolvedAtts(ras, `${entName}/hasAttributes/`);

            // generated attribute structures may end up with 0 attributes after that. prune them
            const cleanSubGroup: (subItem: any, underGenerated: boolean) => boolean =
                (subItem: any, underGenerated: boolean) => {
                    if (isAttributeReference(subItem)) {
                        return true; // not empty
                    }
                    const ac: CdmAttributeContext = subItem as CdmAttributeContext;

                    if (ac.type === cdmAttributeContextType.generatedSet) {
                        underGenerated = true;
                    }
                    if (!ac.contents || ac.contents.length === 0) {
                        return false; // empty
                    }
                    // look at all children, make a set to remove
                    const toRemove: CdmAttributeContext[] = [];
                    for (const subSub of ac.contents.allItems) {
                        if (cleanSubGroup(subSub, underGenerated) === false) {
                            let potentialTarget = underGenerated;
                            if (potentialTarget === false) {
                                // cast is safe because we returned false meaning empty and not an attribute ref
                                // so is this the set holder itself?
                                potentialTarget = (subSub as CdmAttributeContext).type === cdmAttributeContextType.generatedSet;
                            }
                            if (potentialTarget) {
                                toRemove.push(subSub as CdmAttributeContext);
                            }
                        }
                    }
                    for (const toDie of toRemove) {
                        ac.contents.remove(toDie);
                    }
                    return ac.contents.length != 0;
                };
            cleanSubGroup(attCtx, false);

            // create an all-up ordering of attributes at the leaves of this tree based on insert order
            // sort the attributes in each context by their creation order and mix that with the other sub-contexts that have been sorted
            let getOrderNum: (item: CdmObject) => number;

            const orderContents: (under: CdmAttributeContext) => number
                = (under: CdmAttributeContext): number => {
                    if (under.lowestOrder === undefined) {
                        under.lowestOrder = -1; // used for group with nothing but traits
                        if (under.contents.length === 1) {
                            under.lowestOrder = getOrderNum(under.contents.allItems[0]);
                        } else {
                            under.contents.allItems = under.contents.allItems.sort((l: CdmObject, r: CdmObject): number => {
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

            getOrderNum = (item: CdmObject): number => {
                if (item.getObjectType() === cdmObjectType.attributeContextDef) {
                    return orderContents(item as CdmAttributeContext);
                } else if (isAttributeReference(item)) {
                    return attPath2Order.get((item).namedReference);
                } else {
                    return -1; // put the mystery item on top.
                }
            };
            orderContents(attCtx);

            // resolved attributes can gain traits that are applied to an entity when referenced
            // since these traits are described in the context, it is redundant and messy to list them in the attribute
            // so, remove them. create and cache a set of names to look for per context
            // there is actuall a hierarchy to this. all attributes from the base entity should have all traits applied independed of the
            // sub-context they come from. Same is true of attribute entities. so do this recursively top down
            const ctx2traitNames: Map<CdmAttributeContext, Set<string>> = new Map<CdmAttributeContext, Set<string>>();
            const collectContextTraits: (subAttCtx: CdmAttributeContext, inheritedTraitNames: Set<string>) => void
                = (subAttCtx: CdmAttributeContext, inheritedTraitNames: Set<string>): void => {
                    const traitNamesHere: Set<string> = new Set<string>(inheritedTraitNames);
                    const traitsHere: CdmTraitCollection = subAttCtx.exhibitsTraits;
                    if (traitsHere) {
                        traitsHere.allItems.forEach((tat: CdmTraitReference) => { traitNamesHere.add(tat.namedReference); });
                    }
                    ctx2traitNames.set(subAttCtx, traitNamesHere);
                    for (const cr of subAttCtx.contents.allItems) {
                        if (cr.getObjectType() === cdmObjectType.attributeContextDef) {
                            // do this for all types?
                            collectContextTraits(cr as CdmAttributeContext, traitNamesHere);
                        }
                    }
                };
            collectContextTraits(attCtx, new Set<string>());

            // add the attributes, put them in attribute groups if structure needed
            const resAtt2RefPath: Map<ResolvedAttribute, string> = new Map<ResolvedAttribute, string>();
            const addAttributes: (rasSub: ResolvedAttributeSet, container: CdmEntityDefinition | CdmAttributeGroupDefinition, path: string) => void
                = (rasSub: ResolvedAttributeSet, container: CdmEntityDefinition | CdmAttributeGroupDefinition, path: string): void => {
                    rasSub.set.forEach((ra: ResolvedAttribute) => {
                        const attPath: string = path + ra.resolvedName;
                        // use the path of the context associated with this attribute to find the new context that matches on path
                        const raCtxSet: Set<CdmAttributeContext> = rasSub.ra2attCtxSet.get(ra);
                        let raCtx: CdmAttributeContext;
                        // find the correct attCtx for this copy
                        for (const currAttCtx of allAttCtx) {
                            if (raCtxSet.has(currAttCtx)) {
                                raCtx = currAttCtx;
                                break;
                            }
                        }

                        if (ra.target instanceof ResolvedAttributeSet) {
                            // this is a set of attributes.
                            // make an attribute group to hold them
                            const attGrp: CdmAttributeGroupDefinition = this.ctx.corpus.MakeObject(
                                cdmObjectType.attributeGroupDef, ra.resolvedName);
                            attGrp.attributeContext = this.ctx.corpus.MakeObject(
                                cdmObjectType.attributeContextRef, raCtx.atCorpusPath, true);
                            // take any traits from the set and make them look like traits exhibited by the group
                            const avoidSet: Set<string> = ctx2traitNames.get(raCtx);
                            const rtsAtt: ResolvedTraitSet = ra.resolvedTraits;
                            rtsAtt.set.forEach((rt: ResolvedTrait) => {
                                if (!rt.trait.ugly) { // don't mention your ugly traits
                                    if (avoidSet && !avoidSet.has(rt.traitName)) { // avoid the ones from the context
                                        const traitRef: CdmTraitReference = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
                                        attGrp.exhibitsTraits.push(traitRef);
                                    }
                                }
                            });

                            // wrap it in a reference and then recurse with this as the new container
                            const attGrpRef: CdmAttributeGroupReference = this.ctx.corpus.MakeObject(
                                cdmObjectType.attributeGroupRef, undefined);
                            attGrpRef.explicitReference = attGrp;
                            container.addAttributeDef(attGrpRef);
                            // isn't this where ...
                            addAttributes(ra.target as ResolvedAttributeSet, attGrp, `${attPath}/members/`);
                        } else {
                            const att: CdmTypeAttributeDefinition =
                                this.ctx.corpus.MakeObject(cdmObjectType.typeAttributeDef, ra.resolvedName);
                            att.attributeContext = this.ctx.corpus.MakeObject(
                                cdmObjectType.attributeContextRef, raCtx.atCorpusPath, true);
                            const avoidSet: Set<string> = ctx2traitNames.get(raCtx);
                            const rtsAtt: ResolvedTraitSet = ra.resolvedTraits;
                            rtsAtt.set.forEach((rt: ResolvedTrait) => {
                                if (!rt.trait.ugly) { // don't mention your ugly traits
                                    if (avoidSet && !avoidSet.has(rt.traitName)) { // avoid the ones from the context
                                        const traitRef: CdmTraitReference = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
                                        att.appliedTraits.push(traitRef);
                                    }
                                }
                            });

                            // none of the dataformat traits have the bit set that will make them turn into a property
                            // this is intentional so that the format traits make it into the resolved object
                            // but, we still want a guess as the data format, so get it and set it.
                            const impliedDataFormat: cdmDataFormat = att.dataFormat;
                            if (impliedDataFormat !== cdmDataFormat.unknown) {
                                att.dataFormat = impliedDataFormat;
                            }

                            container.addAttributeDef(att);
                            resAtt2RefPath.set(ra, attPath);
                        }
                    });
                };
            addAttributes(ras, entResolved, `${entName}/hasAttributes/`);

            // any resolved traits that hold arguments with attribute refs should get 'fixed' here
            const replaceTraitAttRef: (tr: CdmTraitReference, entityHint: string, isAttributeContext: boolean) => void
                = (tr: CdmTraitReference, entityHint: string): void => {
                    if (tr.arguments) {
                        for (const arg of tr.arguments.allItems) {
                            const v: ArgumentValue =
                                arg.unresolvedValue ? arg.unresolvedValue : arg.getValue();
                            // is this an attribute reference?
                            if (v
                                && (v as CdmObject).getObjectType
                                && (v as CdmObject).getObjectType() === cdmObjectType.attributeRef) {
                                // only try this if the reference has no path to it (only happens with intra-entity att refs)
                                const attRef: CdmAttributeReference = v as CdmAttributeReference;
                                if (attRef.namedReference && attRef.namedReference.indexOf('/') === -1) {
                                    if (!arg.unresolvedValue) {
                                        arg.unresolvedValue = arg.value;
                                    }
                                    // give a promise that can be worked out later.
                                    // assumption is that the attribute must come from this entity.
                                    arg.setValue(this.ctx.corpus.MakeObject(
                                        cdmObjectType.attributeRef,
                                        `${entityHint}/(resolvedAttributes)/${attRef.namedReference}`,
                                        true));
                                }
                            }

                        }
                    }
                };

            // fix entity traits
            if (entResolved.exhibitsTraits) {
                entResolved.exhibitsTraits.allItems
                    .forEach((et: CdmTraitReference) => {
                        replaceTraitAttRef(et, newEntName, false);
                    });
            }

            // fix context traits
            const fixContextTraits: (subAttCtx: CdmAttributeContext, entityHint: string) => void
                = (subAttCtx: CdmAttributeContext, entityHint: string): void => {
                    const traitsHere: CdmTraitCollection = subAttCtx.exhibitsTraits;
                    if (traitsHere) {
                        traitsHere.allItems.forEach((tr: CdmTraitReference) => { replaceTraitAttRef(tr, entityHint, true); });
                    }
                    for (const cr of subAttCtx.contents.allItems) {
                        if (cr.getObjectType() === cdmObjectType.attributeContextDef) {
                            // if this is a new entity context, get the name to pass along
                            const subSubAttCtx: CdmAttributeContext = cr as CdmAttributeContext;
                            let subEntityHint: string = entityHint;
                            if (subSubAttCtx.type === cdmAttributeContextType.entity) {
                                subEntityHint = subSubAttCtx.definition.namedReference;
                            }
                            // do this for all types
                            fixContextTraits(subSubAttCtx, subEntityHint);
                        }
                    }
                };
            fixContextTraits(attCtx, newEntName);
            // and the attribute traits
            const entAtts: CdmCollection<CdmAttributeItem> = entResolved.attributes;
            if (entAtts) {
                for (const attribute of entAtts.allItems) {
                    const attTraits: CdmTraitCollection = attribute.appliedTraits;
                    if (attTraits) {
                        attTraits.allItems.forEach((tr: CdmTraitReference) => { replaceTraitAttRef(tr, newEntName, false); });
                    }
                }
            }

            // we are about to put this content created in the context of various documents (like references to attributes from base entities, etc.)
            // into one specific document. all of the borrowed refs need to work. so, re-write all string references to work from this new document
            // the catch-22 is that the new document needs these fixes done before it can be used to make these fixes.
            // the fix needs to happen in the middle of the refresh
            // trigger the document to refresh current content into the resolved OM
            (attCtx).parent = undefined; // remove the fake parent that made the paths work
            const resOptNew: resolveOptions = CdmObjectBase.copyResolveOptions(resOpt);
            resOptNew.wrtDoc = docRes;
            resOptNew.localizeReferencesFor = docRes;
            if (!await docRes.refreshAsync(resOptNew)) {
                Logger.error(CdmEntityDefinition.name, this.ctx, 'Failed to index the resolved document.', 'createResolvedEntity');

                return undefined;
            }
            // get a fresh ref
            entResolved = docRes.fetchObjectFromDocumentPath(entName) as CdmEntityDefinition;

            return entResolved;
        }
        // return p.measure(bodyCode);
    }

    /**
     * Query the entity for a set of attributes that match an input query
     * querySpec = a JSON object (or a string that can be parsed into one) of the form
     * {"attributeName":"", "attributeOrdinal": -1, "traits":[see next]}
     * matched attributes have each of the traits in the array
     * the trait object is specified as
     * {"traitName": queried trait name or base trait name, (optional) "arguments":[{"argumentName": queried argument, "value": queried value}]}
     * null for 0 results or an array of json objects, each matching the shape of the input query, with attribute names filled in
     */
    /**
     * @internal
     */
    public async queryOnTraits(querySpec: (string | object)): Promise<object[]> {
        return undefined;
    }

}
