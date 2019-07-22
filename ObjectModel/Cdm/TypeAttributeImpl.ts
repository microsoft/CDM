import {
    AttributeContextImpl,
    AttributeContextReferenceImpl,
    AttributeImpl,
    AttributeReferenceImpl,
    CdmCorpusContext,
    cdmObject,
    cdmObjectType,
    copyOptions,
    DataTypeReference,
    DataTypeReferenceImpl,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmDataTypeRef,
    ICdmObject,
    ICdmTypeAttributeDef,
    RelationshipReference,
    ResolvedAttribute,
    ResolvedAttributeSetBuilder,
    ResolvedEntityReferenceSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitReference,
    traitToPropertyMap,
    TypeAttribute,
    VisitCallback
} from '../internal';

export class TypeAttributeImpl extends AttributeImpl implements ICdmTypeAttributeDef {
    public get isReadOnly(): boolean {
        return this.getTraitToPropertyMap()
            .getPropertyValue('isReadOnly');
    }
    public set isReadOnly(val: boolean) {
        this.getTraitToPropertyMap()
            .setPropertyValue('isReadOnly', val);
    }
    public get isNullable(): boolean {
        return this.getTraitToPropertyMap()
            .getPropertyValue('isNullable');
    }
    public set isNullable(val: boolean) {
        this.getTraitToPropertyMap()
            .setPropertyValue('isNullable', val);
    }
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
    public get sourceOrdering(): number {
        return this.getTraitToPropertyMap()
            .getPropertyValue('sourceOrdering');
    }
    public set sourceOrdering(val: number) {
        this.getTraitToPropertyMap()
            .setPropertyValue('sourceOrdering', val);
    }
    public get valueConstrainedToList(): boolean {
        return this.getTraitToPropertyMap()
            .getPropertyValue('valueConstrainedToList');
    }
    public set valueConstrainedToList(val: boolean) {
        this.getTraitToPropertyMap()
            .setPropertyValue('valueConstrainedToList', val);
    }
    public get isPrimaryKey(): boolean {
        return this.getTraitToPropertyMap()
            .getPropertyValue('isPrimaryKey');
    }
    public set isPrimaryKey(val: boolean) {
        this.getTraitToPropertyMap()
            .setPropertyValue('isPrimaryKey', val);
    }
    public get maximumLength(): number {
        return this.getTraitToPropertyMap()
            .getPropertyValue('maximumLength');
    }
    public set maximumLength(val: number) {
        this.getTraitToPropertyMap()
            .setPropertyValue('maximumLength', val);
    }
    public get maximumValue(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('maximumValue');
    }
    public set maximumValue(val: string) {
        this.getTraitToPropertyMap()
            .setPropertyValue('maximumValue', val);
    }
    public get minimumValue(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('minimumValue');
    }
    public set minimumValue(val: string) {
        this.getTraitToPropertyMap()
            .setPropertyValue('minimumValue', val);
    }
    public get dataFormat(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('dataFormat');
    }
    public set dataFormat(val: string) {
        this.getTraitToPropertyMap()
            .setPropertyValue('dataFormat', val);
    }
    public get defaultValue(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('defaultValue');
    }
    public set defaultValue(val: string) {
        this.getTraitToPropertyMap()
            .setPropertyValue('defaultValue', val);
    }
    public dataType: DataTypeReferenceImpl;
    public t2pm: traitToPropertyMap;
    public attributeContext?: AttributeContextReferenceImpl;

    constructor(ctx: CdmCorpusContext, name: string, appliedTraits: boolean) {
        super(ctx, name, appliedTraits);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.typeAttributeDef;
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: TypeAttribute): TypeAttributeImpl {
        // let bodyCode = () =>
        {
            const c: TypeAttributeImpl = new TypeAttributeImpl(ctx, object.name, !!object.appliedTraits);

            if (object.explanation) {
                c.explanation = object.explanation;
            }

            c.relationship = cdmObject.createRelationshipReference(ctx, object.relationship);
            c.dataType = cdmObject.createDataTypeReference(ctx, object.dataType);
            c.attributeContext = cdmObject.createAttributeContextReference(ctx, object.attributeContext);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, object.appliedTraits);
            c.t2pm = new traitToPropertyMap();
            c.t2pm.initForTypeAttributeDef(ctx, object, c);

            return c;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.typeAttributeDef;
        }
        // return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): TypeAttribute {
        // let bodyCode = () =>
        {
            const castedToInterface: TypeAttribute = {
                explanation: this.explanation,
                relationship: this.relationship
                    ? this.relationship.copyData(resOpt, options) as (string | RelationshipReference)
                    : undefined,
                dataType: this.dataType ? this.dataType.copyData(resOpt, options) as (string | DataTypeReference) : undefined,
                name: this.name,
                appliedTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.appliedTraits, options),
                attributeContext: this.attributeContext ? this.attributeContext.copyData(resOpt, options) as string : undefined
            };
            this.getTraitToPropertyMap()
                .persistForTypeAttributeDef(castedToInterface, options);

            return castedToInterface;
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject {
        // let bodyCode = () =>
        {
            const copy: TypeAttributeImpl = new TypeAttributeImpl(this.ctx, this.name, false);
            copy.dataType = this.dataType ? <DataTypeReferenceImpl>this.dataType.copy(resOpt) : undefined;
            copy.attributeContext = this.attributeContext ? <AttributeContextReferenceImpl>this.attributeContext.copy(resOpt) : undefined;
            this.copyAtt(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        // return p.measure(bodyCode);
    }

    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.addComment(this.explanation);
            ff.addChild(this.relationship.getFriendlyFormat());
            ff.addChild(this.dataType.getFriendlyFormat());
            ff.addChildString(this.name);
            if (this.appliedTraits && this.appliedTraits.length) {
                const ffSub: friendlyFormatNode = new friendlyFormatNode();
                ffSub.separator = ', ';
                ffSub.starter = '[';
                ffSub.terminator = ']';
                ffSub.lineWrap = true;
                cdmObject.arrayGetFriendlyFormat(ffSub, this.appliedTraits);
                ff.addChild(ffSub);
            }

            return ff;
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
    public getDataTypeRef(): ICdmDataTypeRef {
        // let bodyCode = () =>
        {
            return this.dataType;
        }
        // return p.measure(bodyCode);
    }
    public setDataTypeRef(dataType: ICdmDataTypeRef): ICdmDataTypeRef {
        // let bodyCode = () =>
        {
            this.dataType = dataType as DataTypeReferenceImpl;

            return this.dataType;
        }
        // return p.measure(bodyCode);
    }

    public getTraitToPropertyMap(): traitToPropertyMap {
        if (this.t2pm) {
            return this.t2pm;
        }
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForTypeAttributeDef(this.ctx, undefined, this);

        return this.t2pm;
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
            if (this.dataType) {
                if (this.dataType.visit(`${path}/dataType/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.attributeContext) {
                if (this.attributeContext.visit(`${path}/attributeContext/`, preChildren, postChildren)) {
                    return true;
                }
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
            // // get from datatype
            if (this.dataType) {
                rtsb.takeReference(this.getDataTypeRef()
                    .getResolvedTraits(resOpt));
            }
            // // get from relationship
            if (this.relationship) {
                rtsb.mergeTraits(this.getRelationshipRef()
                    .getResolvedTraits(resOpt));
            }

            this.addResolvedTraitsApplied(rtsb, resOpt);

            // special case for attributes, replace a default "this.attribute" with this attribute on traits that elevate attribute
            if (rtsb.rts && rtsb.rts.hasElevated) {
                const replacement: AttributeReferenceImpl = new AttributeReferenceImpl(this.ctx, this.name, true);
                replacement.ctx = this.ctx;
                replacement.explicitReference = this;
                rtsb.replaceTraitParameterValue(resOpt, 'does.elevateAttribute', 'attribute', 'this.attribute', replacement);
            }

            // rtsb.cleanUp();
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the datatype used as an attribute, traits applied to that datatype,
            // the relationship of the attribute, any traits applied to the attribute.
            const rasb: ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
            rasb.ras.setAttributeContext(under);

            // add this attribute to the set
            // make a new one and apply any traits
            const newAtt: ResolvedAttribute = new ResolvedAttribute(resOpt, this, this.name, under as AttributeContextImpl);
            rasb.ownOne(newAtt);
            rasb.prepareForTraitApplication(this.getResolvedTraits(resOpt));

            // from the traits of the datatype, relationship and applied here, see if new attributes get generated
            rasb.applyTraits();
            rasb.generateTraitAttributes(false); // false = don't apply these traits to added things

            return rasb;
        }
        // return p.measure(bodyCode);
    }
    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
}
