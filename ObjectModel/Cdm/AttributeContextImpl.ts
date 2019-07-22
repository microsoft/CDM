import {
    AttributeContext,
    AttributeContextParameters,
    AttributeReferenceImpl,
    cdmAttributeContextType,
    CdmCorpusContext,
    cdmObject,
    cdmObjectDef,
    cdmObjectRef,
    cdmObjectType,
    copyOptions,
    DocumentImpl,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmObject,
    ICdmObjectRef,
    ICdmTraitRef,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitReference,
    VisitCallback
} from '../internal';

export class AttributeContextImpl extends cdmObjectDef implements ICdmAttributeContext {
    public type: cdmAttributeContextType;
    public parent?: ICdmObjectRef;
    public definition?: ICdmObjectRef;
    public contents?: (ICdmObjectRef | ICdmAttributeContext)[];
    public name: string;
    public lowestOrder: number;

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx, false);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeContextDef;
            this.name = name;
            // this will get overwritten when parent set
            this.corpusPath = name;
        }
        // return p.measure(bodyCode);
    }
    public static mapTypeNameToEnum(typeName: string): cdmAttributeContextType {
        // let bodyCode = () =>
        {
            switch (typeName) {
                case 'entity':
                    return cdmAttributeContextType.entity;
                case 'entityReferenceExtends':
                    return cdmAttributeContextType.entityReferenceExtends;
                case 'attributeGroup':
                    return cdmAttributeContextType.attributeGroup;
                case 'attributeDefinition':
                    return cdmAttributeContextType.attributeDefinition;
                case 'addedAttributeSupporting':
                    return cdmAttributeContextType.addedAttributeSupporting;
                case 'addedAttributeIdentity':
                    return cdmAttributeContextType.addedAttributeIdentity;
                default:
                    return -1;
            }
        }
        // return p.measure(bodyCode);
    }
    public static mapEnumToTypeName(enumVal: cdmAttributeContextType): string {
        // let bodyCode = () =>
        {
            switch (enumVal) {
                case cdmAttributeContextType.entity:
                    return 'entity';
                case cdmAttributeContextType.entityReferenceExtends:
                    return 'entityReferenceExtends';
                case cdmAttributeContextType.attributeGroup:
                    return 'attributeGroup';
                case cdmAttributeContextType.attributeDefinition:
                    return 'attributeDefinition';
                case cdmAttributeContextType.addedAttributeSupporting:
                    return 'addedAttributeSupporting';
                case cdmAttributeContextType.addedAttributeIdentity:
                    return 'addedAttributeIdentity';
                default:
                    return 'unknown';
            }
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: AttributeContext): AttributeContextImpl {
        // let bodyCode = () =>
        {
            const c: AttributeContextImpl = ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, object.name);
            c.type = AttributeContextImpl.mapTypeNameToEnum(object.type);
            if (object.parent) {
                c.parent = cdmObject.createAttributeContextReference(ctx, object.parent);
            }
            if (object.explanation) {
                c.explanation = object.explanation;
            }
            if (object.definition) {
                switch (c.type) {
                    case cdmAttributeContextType.entity:
                    case cdmAttributeContextType.entityReferenceExtends:
                        c.definition = cdmObject.createEntityReference(ctx, object.definition);
                        break;
                    case cdmAttributeContextType.attributeGroup:
                        c.definition = cdmObject.createAttributeGroupReference(ctx, object.definition);
                        break;
                    case cdmAttributeContextType.addedAttributeSupporting:
                    case cdmAttributeContextType.addedAttributeIdentity:
                    case cdmAttributeContextType.attributeDefinition:
                        c.definition = cdmObject.createAttributeReference(ctx, object.definition);
                        break;
                    default:
                }
            }
            // i know the trait collection names look wrong. but I wanted to use the def baseclass
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.appliedTraits);
            if (object.contents) {
                c.contents = [];
                const l: number = object.contents.length;
                for (let i: number = 0; i < l; i++) {
                    const ct: string | AttributeContext = object.contents[i];
                    if (typeof (ct) === 'string') {
                        c.contents.push(AttributeReferenceImpl.instanceFromData(ctx, ct));
                    } else {
                        c.contents.push(AttributeContextImpl.instanceFromData(ctx, ct));
                    }
                }
            }

            return c;
        }
        // return p.measure(bodyCode);
    }

    public static createChildUnder(resOpt: resolveOptions, acp: AttributeContextParameters): AttributeContextImpl {
        // let bodyCode = () =>
        {
            if (!acp) {
                return undefined;
            }

            if (acp.type === cdmAttributeContextType.passThrough) {
                return acp.under as AttributeContextImpl;
            }

            // this flag makes sure we hold on to any resolved object refs when things get copied
            const resOptCopy: resolveOptions = cdmObject.copyResolveOptions(resOpt);
            resOptCopy.saveResolutionsOnCopy = true;

            let definition: ICdmObjectRef;
            let rtsApplied: ResolvedTraitSet;
            // get a simple reference to definition object to avoid getting the traits that might be part of this ref
            // included in the link to the definition.
            if (acp.regarding) {
                definition = acp.regarding.createSimpleReference(resOptCopy);
                // now get the traits applied at this reference (applied only, not the ones that are part of the definition of the object)
                // and make them the traits for this context
                if (acp.includeTraits) {
                    rtsApplied = acp.regarding.getResolvedTraits(resOptCopy);
                }
            }

            const underChild: AttributeContextImpl = acp.under.ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, acp.name);
            // need context to make this a 'live' object
            underChild.ctx = acp.under.ctx;
            underChild.docCreatedIn = (acp.under as AttributeContextImpl).docCreatedIn;
            underChild.type = acp.type;
            underChild.definition = definition;
            // add traits if there are any
            if (rtsApplied && rtsApplied.set) {
                rtsApplied.set.forEach((rt: ResolvedTrait) => {
                    const traitRef: ICdmTraitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                    underChild.addExhibitedTrait(traitRef, typeof (traitRef) === 'string');
                });
            }

            // add to parent
            underChild.setParent(resOptCopy, acp.under as AttributeContextImpl);

            return underChild;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.attributeContextDef;
        }
        // return p.measure(bodyCode);
    }

    public copyData(resOpt: resolveOptions, options: copyOptions): AttributeContext {
        // let bodyCode = () =>
        {
            return {
                explanation: this.explanation,
                name: this.name,
                type: AttributeContextImpl.mapEnumToTypeName(this.type),
                parent: this.parent ? this.parent.copyData(resOpt, options) as string : undefined,
                definition: this.definition ? this.definition.copyData(resOpt, options) as string : undefined,
                // i know the trait collection names look wrong. but I wanted to use the def baseclass
                appliedTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options),
                contents: cdmObject.arraycopyData<string | AttributeContext>(resOpt, this.contents, options)
            };
        }
        // return p.measure(bodyCode);
    }

    public copyNode(resOpt: resolveOptions): ICdmObject {
        // let bodyCode = () =>
        {
            // instead of copying the entire context tree, just the current node
            const copy: AttributeContextImpl = new AttributeContextImpl(this.ctx, this.name);
            copy.type = this.type;
            copy.docCreatedIn = resOpt.wrtDoc as DocumentImpl;
            if (this.definition) {
                copy.definition = this.definition.copy(resOpt) as ICdmObjectRef;
            }
            copy.contents = [];

            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public copyAttributeContextTree(resOpt: resolveOptions, newNode: AttributeContextImpl,
                                    ras: ResolvedAttributeSet, attCtxSet?: Set<AttributeContextImpl>): AttributeContextImpl {
        const ra: ResolvedAttribute = ras.attCtx2ra.get(this);
        if (ra) {
            ras.cacheAttributeContext(newNode, ra);
        }

        // add context to set
        if (attCtxSet) {
            attCtxSet.add(newNode);
        }

        // now copy the children
        if (this.contents && this.contents.length > 0) {
            for (const child of this.contents) {
                const newChild: AttributeContextImpl = (child as AttributeContextImpl).copyNode(resOpt) as AttributeContextImpl;
                if (newNode) {
                    newChild.setParent(resOpt, newNode);
                }
                let currentRas: ResolvedAttributeSet = ras;
                if (ra && ra.target && (ra.target as ResolvedAttributeSet).set) {
                    currentRas = (ra.target as ResolvedAttributeSet);
                }
                (child as AttributeContextImpl).copyAttributeContextTree(resOpt, newChild, currentRas, attCtxSet);
            }
        }

        return newNode;
    }

    public copy(resOpt: resolveOptions): ICdmObject {
        const copy: AttributeContextImpl = this.copyNode(resOpt) as AttributeContextImpl;
        if (this.parent) {
            copy.parent = this.parent.copy(resOpt) as ICdmObjectRef;
        }
        if (this.contents && this.contents.length > 0) {
            for (const child of this.contents) {
                copy.contents.push(child.copy(resOpt) as (ICdmAttributeContext | ICdmObjectRef));
            }
        }

        return copy;
    }

    public validate(): boolean {
        return this.name && this.type !== undefined;
    }

    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            // todo
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.addChildString('attributeContext');
            ff.addChildString(this.name);

            return ff;
        }
        // return p.measure(bodyCode);
    }
    public getName(): string {
        // let bodyCode = () =>
        {
            return this.name;
        }
        // return p.measure(bodyCode);
    }

    public getContentRefs(): (ICdmObjectRef | ICdmAttributeContext)[] {
        // let bodyCode = () =>
        {
            if (!this.contents) {
                this.contents = [];
            }

            return this.contents;
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

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.parent) {
                if (this.parent.visit(`${path}/parent/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.definition) {
                if (this.definition.visit(`${path}/definition/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.contents) {
                if (cdmObject.visitArray(this.contents as ICdmObject[] as cdmObject[], `${path}/`, preChildren, postChildren)) {
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
            return false;
        }
        // return p.measure(bodyCode);
    }
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
    public setParent(resOpt: resolveOptions, parent: AttributeContextImpl): void {
        // let bodyCode = () =>
        {
            // will need a working reference to this as the parent
            const parentRef: cdmObjectRef = this.ctx.corpus.MakeObject(
                cdmObjectType.attributeContextRef,
                parent.corpusPath,
                true);
            if (this.name) {
                this.corpusPath = `${parent.corpusPath}/${this.name}`;
            }
            parentRef.explicitReference = parent;
            // setting this will let the 'localize references' code trace from any document back to where the parent is defined
            parentRef.docCreatedIn = parent.docCreatedIn;
            const parentContents: (ICdmObjectRef | ICdmAttributeContext)[] = parent.getContentRefs();
            parentContents.push(this);
            this.parent = parentRef;
        }
        // return p.measure(bodyCode);
    }
}
