import {
    CdmAttributeContext,
    CdmCorpusContext,
    CdmDataTypeReference,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmDataTypeDefinition extends CdmObjectDefinitionBase {
    public dataTypeName: string;
    public extendsDataType?: CdmDataTypeReference;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.dataTypeDef;
    }

    constructor(ctx: CdmCorpusContext, dataTypeName: string, extendsDataType: CdmDataTypeReference) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeDef;
            this.dataTypeName = dataTypeName;
            this.extendsDataType = extendsDataType;
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

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmDataTypeDefinition {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            let copy: CdmDataTypeDefinition;
            if (!host) {
                copy = new CdmDataTypeDefinition(this.ctx, this.dataTypeName, undefined);
            } else {
                copy = host as CdmDataTypeDefinition;
                copy.ctx = this.ctx;
                copy.dataTypeName = this.dataTypeName;
            }
            copy.extendsDataType = this.extendsDataType ? <CdmDataTypeReference>this.extendsDataType.copy(resOpt) : undefined;
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

    public getName(): string {
        // let bodyCode = () =>
        {
            return this.dataTypeName;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public getExtendsDataTypeRef(): CdmDataTypeReference {
        // let bodyCode = () =>
        {
            return this.extendsDataType;
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
                    path = pathFrom + this.dataTypeName;
                    this.declaredPath = path;
                }
            }

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

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            return this.isDerivedFromDef(resOpt, this.getExtendsDataTypeRef(), this.getName(), base);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsDataTypeRef(), rtsb, resOpt);
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
            return undefined;
        }
        // return p.measure(bodyCode);
    }
}
