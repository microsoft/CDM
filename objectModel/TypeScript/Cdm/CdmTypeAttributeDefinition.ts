import { cdmDataFormat } from '../Enums/cdmDataFormat';
import {
    AttributeResolutionContext,
    CdmAttribute,
    CdmAttributeContext,
    CdmAttributeContextReference,
    CdmAttributeReference,
    CdmAttributeResolutionGuidance,
    CdmCorpusContext,
    CdmDataTypeReference,
    CdmObject,
    CdmObjectBase,
    cdmObjectType,
    ResolvedAttribute,
    ResolvedAttributeSetBuilder,
    ResolvedEntityReferenceSet,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    traitToPropertyMap,
    VisitCallback
} from '../internal';

export class CdmTypeAttributeDefinition extends CdmAttribute {
    public static get objectType(): cdmObjectType {
        return cdmObjectType.typeAttributeDef;
    }
    public get isReadOnly(): boolean {
        return this.traitToPropertyMap.fetchPropertyValue('isReadOnly') as boolean;
    }
    public set isReadOnly(val: boolean) {
        this.traitToPropertyMap.updatePropertyValue('isReadOnly', val);
    }
    public get isNullable(): boolean {
        return this.traitToPropertyMap.fetchPropertyValue('isNullable') as boolean;
    }
    public set isNullable(val: boolean) {
        this.traitToPropertyMap.updatePropertyValue('isNullable', val);
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
    public get sourceOrdering(): number {
        return this.traitToPropertyMap.fetchPropertyValue('sourceOrdering') as number;
    }
    public set sourceOrdering(val: number) {
        this.traitToPropertyMap.updatePropertyValue('sourceOrdering', val);
    }
    public get valueConstrainedToList(): boolean {
        return this.traitToPropertyMap.fetchPropertyValue('valueConstrainedToList') as boolean;
    }
    public set valueConstrainedToList(val: boolean) {
        this.traitToPropertyMap.updatePropertyValue('valueConstrainedToList', val);
    }
    public get isPrimaryKey(): boolean {
        return this.traitToPropertyMap.fetchPropertyValue('isPrimaryKey') as boolean;
    }
    public get maximumLength(): number {
        return this.traitToPropertyMap.fetchPropertyValue('maximumLength') as number;
    }
    public set maximumLength(val: number) {
        this.traitToPropertyMap.updatePropertyValue('maximumLength', val);
    }
    public get maximumValue(): string {
        return this.traitToPropertyMap.fetchPropertyValue('maximumValue') as string;
    }
    public set maximumValue(val: string) {
        this.traitToPropertyMap.updatePropertyValue('maximumValue', val);
    }
    public get minimumValue(): string {
        return this.traitToPropertyMap.fetchPropertyValue('minimumValue') as string;
    }
    public set minimumValue(val: string) {
        this.traitToPropertyMap.updatePropertyValue('minimumValue', val);
    }
    public get dataFormat(): cdmDataFormat {
        return this.traitToPropertyMap.fetchPropertyValue('dataFormat') as cdmDataFormat;
    }
    public set dataFormat(val: cdmDataFormat) {
        this.traitToPropertyMap.updatePropertyValue('dataFormat', val);
    }
    public get defaultValue(): string {
        return this.traitToPropertyMap.fetchPropertyValue('defaultValue') as string;
    }
    public set defaultValue(val: string) {
        this.traitToPropertyMap.updatePropertyValue('defaultValue', val);
    }

    public dataType: CdmDataTypeReference;
    public attributeContext?: CdmAttributeContextReference;

    private readonly traitToPropertyMap: traitToPropertyMap;
    private readonly t2pm: traitToPropertyMap;

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx, name);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.typeAttributeDef;
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
            return cdmObjectType.typeAttributeDef;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            let copy: CdmTypeAttributeDefinition;
            if (!host) {
                copy = new CdmTypeAttributeDefinition(this.ctx, this.name);
            } else {
                copy = host as CdmTypeAttributeDefinition;
                copy.ctx = this.ctx;
                copy.name = this.getName();
            }
            copy.dataType = this.dataType ? <CdmDataTypeReference>this.dataType.copy(resOpt) : undefined;
            copy.attributeContext = this.attributeContext ? <CdmAttributeContextReference>this.attributeContext.copy(resOpt) : undefined;
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

    /**
     * @internal
     */
    public getDataTypeRef(): CdmDataTypeReference {
        // let bodyCode = () =>
        {
            return this.dataType;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public setDataTypeRef(dataType: CdmDataTypeReference): CdmDataTypeReference {
        // let bodyCode = () =>
        {
            this.dataType = dataType;

            return this.dataType;
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

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // // get from datatype
            if (this.dataType) {
                rtsb.takeReference(this.dataType
                    .fetchResolvedTraits(resOpt));
            }
            // // get from purpose
            if (this.purpose) {
                rtsb.mergeTraits(this.purpose
                    .fetchResolvedTraits(resOpt));
            }

            this.addResolvedTraitsApplied(rtsb, resOpt);

            // special case for attributes, replace a default "this.attribute" with this attribute on traits that elevate attribute
            if (rtsb.rts && rtsb.rts.hasElevated) {
                const replacement: CdmAttributeReference = new CdmAttributeReference(this.ctx, this.name, true);
                replacement.ctx = this.ctx;
                replacement.explicitReference = this;
                rtsb.replaceTraitParameterValue(resOpt, 'does.elevateAttribute', 'attribute', 'this.attribute', replacement);
            }

            // rtsb.cleanUp();
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
            // the datatype used as an attribute, traits applied to that datatype,
            // the purpose of the attribute, any traits applied to the attribute.
            const rasb: ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
            rasb.ras.setAttributeContext(under);

            // add this attribute to the set
            // make a new one and apply any traits
            const newAtt: ResolvedAttribute = new ResolvedAttribute(resOpt, this, this.name, under);
            rasb.ownOne(newAtt);
            const rts: ResolvedTraitSet = this.fetchResolvedTraits(resOpt);

            // this context object holds all of the info about what needs to happen to resolve these attributes.
            // make a copy and add defaults if missing
            let resGuideWithDefault: CdmAttributeResolutionGuidance;
            if (this.resolutionGuidance !== undefined) {
                resGuideWithDefault = this.resolutionGuidance.copy(resOpt) as CdmAttributeResolutionGuidance;
            } else {
                resGuideWithDefault = new CdmAttributeResolutionGuidance(this.ctx);
            }

            // renameFormat is not currently supported for type attributes
            resGuideWithDefault.renameFormat = undefined;

            resGuideWithDefault.updateAttributeDefaults(undefined);
            const arc: AttributeResolutionContext = new AttributeResolutionContext(resOpt, resGuideWithDefault, rts);

            // from the traits of the datatype, purpose and applied here, see if new attributes get generated
            rasb.applyTraits(arc);
            rasb.generateApplierAttributes(arc, false); // false = don't apply these traits to added things
            // this may have added symbols to the dependencies, so merge them
            resOpt.symbolRefSet.merge(arc.resOpt.symbolRefSet);

            return rasb;
        }
        // return p.measure(bodyCode);
    }

    public fetchResolvedEntityReference(resOpt: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
}
