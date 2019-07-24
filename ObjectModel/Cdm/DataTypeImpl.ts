import {
    CdmCorpusContext,
    cdmObject,
    cdmObjectDef,
    cdmObjectType,
    copyOptions,
    DataType,
    DataTypeReference,
    DataTypeReferenceImpl,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmDataTypeDef,
    ICdmDataTypeRef,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    TraitReference,
    VisitCallback
} from '../internal';

export class DataTypeImpl extends cdmObjectDef implements ICdmDataTypeDef {
    public dataTypeName: string;
    public extendsDataType?: DataTypeReferenceImpl;

    constructor(ctx: CdmCorpusContext, dataTypeName: string, extendsDataType: DataTypeReferenceImpl, exhibitsTraits: boolean) {
        super(ctx, exhibitsTraits);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeDef;
            this.dataTypeName = dataTypeName;
            this.extendsDataType = extendsDataType;
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: DataType): DataTypeImpl {
        // let bodyCode = () =>
        {
            let extendsDataType: DataTypeReferenceImpl;
            extendsDataType = cdmObject.createDataTypeReference(ctx, object.extendsDataType);

            const c: DataTypeImpl = new DataTypeImpl(ctx, object.dataTypeName, extendsDataType, !!object.exhibitsTraits);

            if (object.explanation) {
                c.explanation = object.explanation;
            }

            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);

            return c;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.dataTypeDef;
        }
        // return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): DataType {
        // let bodyCode = () =>
        {
            return {
                explanation: this.explanation,
                dataTypeName: this.dataTypeName,
                extendsDataType: this.extendsDataType
                    ? this.extendsDataType.copyData(resOpt, options) as (string | DataTypeReference)
                    : undefined,
                exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options)
            };
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): DataTypeImpl {
        // let bodyCode = () =>
        {
            const copy: DataTypeImpl = new DataTypeImpl(this.ctx, this.dataTypeName, undefined, false);
            copy.extendsDataType = this.extendsDataType ? <DataTypeReferenceImpl>this.extendsDataType.copy(resOpt) : undefined;
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.dataTypeName ? true : false;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.addChildString('dataType');
            ff.addChildString(this.dataTypeName);
            if (this.extendsDataType) {
                ff.addChildString('extends');
                ff.addChild(this.extendsDataType.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);

            return ff;
        }
        // return p.measure(bodyCode);
    }
    public getName(): string {
        // let bodyCode = () =>
        {
            return this.dataTypeName;
        }
        // return p.measure(bodyCode);
    }
    public getExtendsDataTypeRef(): ICdmDataTypeRef {
        // let bodyCode = () =>
        {
            return this.extendsDataType;
        }
        // return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = this.declaredPath;
            if (!path) {
                path = pathFrom + this.dataTypeName;
                this.declaredPath = path;
            }
            // trackVisits(path);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.extendsDataType) {
                if (this.extendsDataType.visit(`${path}/extendsDataType/`, preChildren, postChildren)) {
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
            return this.isDerivedFromDef(resOpt, this.getExtendsDataTypeRef(), this.getName(), base);
        }
        // return p.measure(bodyCode);
    }
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsDataTypeRef(), rtsb, resOpt);
            // rtsb.cleanUp();
        }
        // return p.measure(bodyCode);
    }
    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
}
