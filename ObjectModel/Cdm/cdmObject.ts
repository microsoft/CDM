import {
    ArgumentValue,
    AttributeContext,
    AttributeContextImpl,
    AttributeContextParameters,
    AttributeContextReferenceImpl,
    AttributeGroupReference,
    AttributeGroupReferenceImpl,
    AttributeReferenceImpl,
    CdmCorpusContext,
    CdmJsonType,
    cdmObjectDef,
    cdmObjectType,
    copyOptions,
    CorpusImpl,
    DataTypeReference,
    DataTypeReferenceImpl,
    DocSet,
    DocSetCollection,
    docsResult,
    DocumentImpl,
    EntityAttribute,
    EntityAttributeImpl,
    EntityReference,
    EntityReferenceImpl,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmDocumentDef,
    ICdmObject,
    ICdmObjectDef,
    ICdmObjectRef,
    ICdmParameterDef,
    ICdmTraitRef,
    identifierRef,
    RelationshipReference,
    RelationshipReferenceImpl,
    resolveContext,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitImpl,
    TraitReference,
    TraitReferenceImpl,
    TypeAttribute,
    TypeAttributeImpl,
    VisitCallback
} from '../internal';

export abstract class cdmObject implements ICdmObject {

    public get declaredInDocument(): ICdmDocumentDef {
        return this.docCreatedIn as ICdmDocumentDef;
    }
    public ID: number;
    public objectType: cdmObjectType;
    public ctx: CdmCorpusContext;
    public docCreatedIn: DocumentImpl;

    public traitCache: Map<string, ResolvedTraitSetBuilder>;

    public declaredPath: string;

    public resolvingAttributes: boolean = false;
    constructor(ctx: CdmCorpusContext) {
        this.ID = CorpusImpl.nextID();
        this.ctx = ctx;
        if (ctx) {
            this.docCreatedIn = (ctx as resolveContext).currentDoc;
        }
    }
    public static copyIdentifierRef(identifier: string, resolved: cdmObjectDef, options: copyOptions): string | identifierRef {
        if (!options || !options.stringRefs || !resolved) {
            return identifier;
        }

        return {
            corpusPath: resolved.getObjectPath(),
            identifier: identifier
        };
    }

    // public toJSON(): any
    // {
    //     //let bodyCode = () =>
    //     {
    //         return this.copyData(false);
    //     }
    //     //return p.measure(bodyCode);
    // }

    public static arraycopyData<T>(resOpt: resolveOptions, source: ICdmObject[], options: copyOptions): T[] {
        // let bodyCode = () =>
        {
            if (!source) {
                return undefined;
            }
            const casted: T[] = [];
            const l: number = source.length;
            for (let i: number = 0; i < l; i++) {
                const element: ICdmObject = source[i];
                casted.push(element ? element.copyData(resOpt, options) as unknown as T : undefined);
            }

            return casted;
        }
        // return p.measure(bodyCode);
    }

    public static arrayCopy<T extends ICdmObject>(resOpt: resolveOptions, source: cdmObject[]): T[] {
        // let bodyCode = () =>
        {
            if (!source) {
                return undefined;
            }
            const casted: T[] = [];
            const l: number = source.length;
            for (let i: number = 0; i < l; i++) {
                const element: cdmObject = source[i];
                casted.push(element ? <T>element.copy(resOpt) : undefined);
            }

            return casted;
        }
        // return p.measure(bodyCode);
    }

    public static arrayGetFriendlyFormat(under: friendlyFormatNode, source: cdmObject[]): void {
        // let bodyCode = () =>
        {
            if (!source || source.length === 0) {
                under.lineWrap = false;
                under.forceWrap = false;

                return;
            }
            const l: number = source.length;
            for (let i: number = 0; i < l; i++) {
                under.addChild(source[i].getFriendlyFormat());
            }
            if (l === 1) {
                under.lineWrap = false;
                under.forceWrap = false;
            }
        }
        // return p.measure(bodyCode);
    }

    public static createConstant(ctx: CdmCorpusContext, object: CdmJsonType): ArgumentValue {
        // let bodyCode = () =>
        {
            if (!object) {
                return undefined;
            }
            if (typeof object === 'string') {
                return object;
            } else {
                const objectproperties: string[] = Object.getOwnPropertyNames(object);
                const checkExistingProperty: (propertyName: string) => boolean
                    = (propertyName: string): boolean => {
                        return objectproperties.some(
                            (element: string) => {
                                return element === propertyName;
                            });
                    };
                if (checkExistingProperty('relationship') || checkExistingProperty('dataType') || checkExistingProperty('entity')) {
                    if (checkExistingProperty('dataType')) {
                        return TypeAttributeImpl.instanceFromData(ctx, object as TypeAttribute);
                    } else if (checkExistingProperty('entity')) {
                        return EntityAttributeImpl.instanceFromData(ctx, object as EntityAttribute);
                    } else {
                        return undefined;
                    }
                } else if (checkExistingProperty('relationshipReference')) {
                    return RelationshipReferenceImpl.instanceFromData(ctx, object as RelationshipReference);
                } else if (checkExistingProperty('traitReference')) {
                    return TraitReferenceImpl.instanceFromData(ctx, object as TraitReference);
                } else if (checkExistingProperty('dataTypeReference')) {
                    return DataTypeReferenceImpl.instanceFromData(ctx, object as DataTypeReference);
                } else if (checkExistingProperty('entityReference')) {
                    return EntityReferenceImpl.instanceFromData(ctx, object as EntityReference);
                } else if (checkExistingProperty('attributeGroupReference')) {
                    return AttributeGroupReferenceImpl.instanceFromData(ctx, object as AttributeGroupReference);
                } else {
                    return undefined;
                }
            }
        }
        // return p.measure(bodyCode);
    }
    public static createDataTypeReference(ctx: CdmCorpusContext, object: string | DataTypeReference): DataTypeReferenceImpl {
        // let bodyCode = () =>
        {
            if (object) {
                return DataTypeReferenceImpl.instanceFromData(ctx, object);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public static createRelationshipReference(ctx: CdmCorpusContext, object: string | RelationshipReference): RelationshipReferenceImpl {
        // let bodyCode = () =>
        {
            if (object) {
                return RelationshipReferenceImpl.instanceFromData(ctx, object);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public static createAttributeContext(ctx: CdmCorpusContext, object: AttributeContext): AttributeContextImpl {
        // let bodyCode = () =>
        {
            if (object) {
                return AttributeContextImpl.instanceFromData(ctx, object);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public static createAttributeContextReference(ctx: CdmCorpusContext, object: string): AttributeContextReferenceImpl {
        // let bodyCode = () =>
        {
            if (object) {
                return AttributeContextReferenceImpl.instanceFromData(ctx, object);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public static createEntityReference(ctx: CdmCorpusContext, object: string | EntityReference): EntityReferenceImpl {
        // let bodyCode = () =>
        {
            if (object) {
                return EntityReferenceImpl.instanceFromData(ctx, object);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public static createAttributeGroupReference(ctx: CdmCorpusContext, object: string | AttributeGroupReference)
        : AttributeGroupReferenceImpl {
        // let bodyCode = () =>
        {
            if (object) {
                return AttributeGroupReferenceImpl.instanceFromData(ctx, object);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public static createAttributeReference(ctx: CdmCorpusContext, object: string): AttributeReferenceImpl {
        // let bodyCode = () =>
        {
            if (object) {
                return AttributeReferenceImpl.instanceFromData(ctx, object);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public static createAttribute(ctx: CdmCorpusContext, object: string | AttributeGroupReference | EntityAttribute | TypeAttribute)
        : (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl) {
        // let bodyCode = () =>
        {
            if (!object) {
                return undefined;
            }

            if (typeof object === 'string' || isAttributeGroupReference(object)) {
                return AttributeGroupReferenceImpl.instanceFromData(ctx, object);
            } else if (isEntityAttribute(object)) {
                return EntityAttributeImpl.instanceFromData(ctx, object);
            } else if (isTypeAttribute(object)) {
                return TypeAttributeImpl.instanceFromData(ctx, object);
            }
        }
        // return p.measure(bodyCode);
    }
    public static createAttributeArray(
        ctx: CdmCorpusContext,
        object: (string | AttributeGroupReference | EntityAttribute | TypeAttribute)[])
        : (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[] {
        // let bodyCode = () =>
        {
            if (!object) {
                return undefined;
            }

            let result: (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[];
            result = [];

            const l: number = object.length;
            for (let i: number = 0; i < l; i++) {
                const ea: string | AttributeGroupReference | EntityAttribute | TypeAttribute = object[i];
                result.push(cdmObject.createAttribute(ctx, ea));
            }

            return result;
        }
        // return p.measure(bodyCode);
    }

    public static createTraitReferenceArray(ctx: CdmCorpusContext, object: (string | TraitReference)[]): TraitReferenceImpl[] {
        // let bodyCode = () =>
        {
            if (!object) {
                return undefined;
            }

            let result: TraitReferenceImpl[];
            result = [];

            const l: number = object.length;
            for (let i: number = 0; i < l; i++) {
                const tr: string | TraitReference = object[i];
                result.push(TraitReferenceImpl.instanceFromData(ctx, tr));
            }

            return result;
        }
        // return p.measure(bodyCode);
    }
    public static visitArray(items: cdmObject[], path: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let result: boolean = false;
            if (items) {
                const lItem: number = items.length;
                for (let iItem: number = 0; iItem < lItem; iItem++) {
                    const element: cdmObject = items[iItem];
                    if (element) {
                        if (element.visit(path, preChildren, postChildren)) {
                            result = true;
                            break;
                        }
                    }
                }
            }

            return result;
        }
        // return p.measure(bodyCode);
    }
    public static resolvedTraitToTraitRef(resOpt: resolveOptions, rt: ResolvedTrait): ICdmTraitRef {
        let traitRef: TraitReferenceImpl;
        if (rt.parameterValues && rt.parameterValues.length) {
            traitRef = rt.trait.ctx.corpus.MakeObject(cdmObjectType.traitRef, rt.traitName, false);
            const l: number = rt.parameterValues.length;
            if (l === 1) {
                // just one argument, use the shortcut syntax
                let val: string | ICdmObject = rt.parameterValues.values[0];
                if (val !== undefined) {
                    if (typeof (val) !== 'string') {
                        val = (val).copy(resOpt);
                    }
                    traitRef.addArgument(undefined, val);
                }
            } else {
                for (let i: number = 0; i < l; i++) {
                    const param: ICdmParameterDef = rt.parameterValues.getParameter(i);
                    let val: string | ICdmObject = rt.parameterValues.values[i];
                    if (val !== undefined) {
                        if (typeof (val) !== 'string') {
                            val = (val).copy(resOpt);
                        }
                        traitRef.addArgument(param.getName(), val);
                    }
                }
            }
        } else {
            traitRef = rt.trait.ctx.corpus.MakeObject(cdmObjectType.traitRef, rt.traitName, true);
        }
        if (resOpt.saveResolutionsOnCopy) {
            // used to localize references between documents
            traitRef.explicitReference = rt.trait as TraitImpl;
            traitRef.docCreatedIn = (rt.trait as TraitImpl).docCreatedIn;
        }

        return traitRef;
    }

    public static copyResolveOptions(resOpt: resolveOptions): resolveOptions {
        const resOptCopy: resolveOptions = {};
        resOptCopy.wrtDoc = resOpt.wrtDoc;
        resOptCopy.relationshipDepth = resOpt.relationshipDepth;
        if (resOpt.directives) {
            resOptCopy.directives = resOpt.directives.copy();
        }

        return resOptCopy;
    }
    public abstract copy(resOpt: resolveOptions): ICdmObject;
    public abstract getFriendlyFormat(): friendlyFormatNode;
    public abstract validate(): boolean;

    public abstract getObjectType(): cdmObjectType;
    public abstract getObjectDefName(): string;
    public abstract getObjectDef(resOpt: resolveOptions): ICdmObjectDef;
    public abstract createSimpleReference(resOpt: resolveOptions): ICdmObjectRef;

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        // return p.measure(bodyCode);
    }
    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public generateDocumentRefSet(ctx: resolveContext, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            resOpt.documentRefSet = new DocSetCollection();
            // put in docs where this thing is defined. if only one document, then don't add
            // if only one doc, then only one choice on resolve time too
            const defIn: docsResult = ctx.corpus.docsForSymbol(ctx.currentDoc, ctx.currentDoc, '');

            if (defIn.docList && defIn.docList.length > 1) {
                resOpt.documentRefSet.add(new DocSet(defIn.docList));
            }
        }
        // return p.measure(bodyCode);
    }

    public getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            const kind: string = 'rtsb';
            const ctx: resolveContext = this.ctx as resolveContext;
            let cacheTagA: string = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind);

            let rtsbAll: ResolvedTraitSetBuilder;
            if (!this.traitCache) {
                this.traitCache = new Map<string, ResolvedTraitSetBuilder>();
            } else {
                rtsbAll = cacheTagA ? this.traitCache.get(cacheTagA) : null;
            }

            // store the previous document set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currDocRefSet: DocSetCollection = resOpt.documentRefSet || new DocSetCollection();
            resOpt.documentRefSet = new DocSetCollection();

            if (!rtsbAll) {
                // copy resolve options but use same doc ref set
                const oldResOpt: resolveOptions = resOpt;
                resOpt = cdmObject.copyResolveOptions(resOpt);
                resOpt.documentRefSet = oldResOpt.documentRefSet;

                rtsbAll = new ResolvedTraitSetBuilder();
                this.constructResolvedTraits(rtsbAll, resOpt);

                // register set of possible docs
                ctx.corpus.registerDefinitionReferenceDocuments(this.getObjectDef(resOpt), kind, resOpt.documentRefSet);

                if (rtsbAll.rts) {
                    // update the directives
                    if (rtsbAll.rts.applierCaps) {
                        rtsbAll.rts.collectDirectives(resOpt.directives);
                    }
                } else {
                    // nothing came back, but others will assume there is a set in this builder
                    rtsbAll.rts = new ResolvedTraitSet(resOpt);
                }
                // get the new cache tag now that we have the list of docs
                cacheTagA = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind);
                this.traitCache.set(cacheTagA, rtsbAll);
            } else {
                // cache was found
                // get the DocSetCollection for this cached object
                const key: string = CorpusImpl.getCacheKeyFromObject(this, kind);
                resOpt.documentRefSet = ctx.corpus.definitionReferenceDocuments.get(key);
            }

            // merge child document set with current
            currDocRefSet.merge(resOpt.documentRefSet);
            resOpt.documentRefSet = currDocRefSet;

            return rtsbAll.rts;
        }
        // return p.measure(bodyCode);
    }
    public getResolvedAttributes(resOpt: resolveOptions, acpInContext?: AttributeContextParameters): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            const kind: string = 'rasb';
            const ctx: resolveContext = this.ctx as resolveContext; // what it actually is
            let cacheTag: string = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind, acpInContext ? 'ctx' : '');
            let rasbCache: ResolvedAttributeSetBuilder = cacheTag ? ctx.cache.get(cacheTag) : null;
            let underCtx: AttributeContextImpl;

            // store the previous document set, we will need to add it with
            // children found from the constructResolvedTraits call
            const currDocRefSet: DocSetCollection = resOpt.documentRefSet || new DocSetCollection();
            resOpt.documentRefSet = new DocSetCollection();

            if (!rasbCache) {
                if (this.resolvingAttributes) {
                    // re-entered this attribute through some kind of self or looping reference.
                    return new ResolvedAttributeSet();
                }
                this.resolvingAttributes = true;

                // if a new context node is needed for these attributes, make it now
                if (acpInContext) {
                    underCtx = AttributeContextImpl.createChildUnder(resOpt, acpInContext);
                }

                rasbCache = this.constructResolvedAttributes(resOpt, underCtx);
                this.resolvingAttributes = false;

                // register set of possible docs
                ctx.corpus.registerDefinitionReferenceDocuments(this.getObjectDef(resOpt), kind, resOpt.documentRefSet);

                // get the new cache tag now that we have the list of docs
                cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, kind, acpInContext ? 'ctx' : '');
                // save this as the cached version
                ctx.cache.set(cacheTag, rasbCache);
            } else {
                // get the DocSetCollection for this cached object and pass that back
                const key: string = CorpusImpl.getCacheKeyFromObject(this, kind);
                resOpt.documentRefSet = ctx.corpus.definitionReferenceDocuments.get(key);

                // cache found. if we are building a context, then fix what we got instead of making a new one
                if (acpInContext) {
                    // make the new context
                    underCtx = AttributeContextImpl.createChildUnder(resOpt, acpInContext);

                    (rasbCache.ras.attributeContext as AttributeContextImpl).copyAttributeContextTree(resOpt, underCtx, rasbCache.ras);
                }
            }

            // merge child document set with current
            currDocRefSet.merge(resOpt.documentRefSet);
            resOpt.documentRefSet = currDocRefSet;

            return rasbCache.ras;
        }
        // return p.measure(bodyCode);
    }

    public clearTraitCache(): void {
        // let bodyCode = () =>
        {
            this.traitCache = undefined;
        }
        // return p.measure(bodyCode);
    }

    public abstract copyData(resOpt: resolveOptions, options: copyOptions): CdmJsonType;

    public abstract visit(path: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;

}

function isTypeAttribute(object: object): object is TypeAttribute {
    return !('entity' in object);
}

function isEntityAttribute(object: object): object is EntityAttribute {
    return 'entity' in object;
}

function isAttributeGroupReference(object: object): object is AttributeGroupReference {
    return 'attributeGroupReference' in object;
}
