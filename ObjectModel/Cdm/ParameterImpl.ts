import {
    ArgumentValue,
    CdmCorpusContext,
    CdmJsonType,
    cdmObject,
    cdmObjectSimple,
    cdmObjectType,
    copyOptions,
    DataTypeReference,
    DataTypeReferenceImpl,
    friendlyFormatNode,
    ICdmDataTypeRef,
    ICdmObject,
    ICdmParameterDef,
    Parameter,
    resolveOptions,
    VisitCallback
} from '../internal';

export class ParameterImpl extends cdmObjectSimple implements ICdmParameterDef {
    public explanation: string;
    public name: string;
    public defaultValue: ArgumentValue;
    public required: boolean;
    public direction: string;
    public dataTypeRef: DataTypeReferenceImpl;

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.name = name;
            this.objectType = cdmObjectType.parameterDef;
        }
        // return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: Parameter): ParameterImpl {

        // let bodyCode = () =>
        {
            const c: ParameterImpl = new ParameterImpl(ctx, object.name);
            c.explanation = object.explanation;
            c.required = object.required ? object.required : false;
            c.direction = object.direction ? object.direction : 'in';

            c.defaultValue = cdmObject.createConstant(ctx, object.defaultValue);
            c.dataTypeRef = cdmObject.createDataTypeReference(ctx, object.dataType);

            return c;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.parameterDef;
        }
        // return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Parameter {
        // let bodyCode = () =>
        {
            let defVal: CdmJsonType;
            if (this.defaultValue) {
                if (typeof (this.defaultValue) === 'string') {
                    defVal = this.defaultValue;
                } else {
                    defVal = (this.defaultValue).copyData(resOpt, options);
                }
            }

            return {
                explanation: this.explanation,
                name: this.name,
                defaultValue: defVal,
                required: this.required,
                direction: this.direction,
                dataType: this.dataTypeRef ? this.dataTypeRef.copyData(resOpt, options) as (string | DataTypeReference) : undefined
            };
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject {
        // let bodyCode = () =>
        {
            const copy: ParameterImpl = new ParameterImpl(this.ctx, this.name);

            let defVal: ArgumentValue;
            if (this.defaultValue) {
                if (typeof (this.defaultValue) === 'string') {
                    defVal = this.defaultValue;
                } else {
                    defVal = (this.defaultValue).copy(resOpt);
                }
            }
            copy.explanation = this.explanation;
            copy.defaultValue = defVal;
            copy.required = this.required;
            copy.direction = this.direction;
            copy.dataTypeRef = (this.dataTypeRef ? this.dataTypeRef.copy(resOpt) : undefined) as DataTypeReferenceImpl;

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
            ff.addChildString(this.required ? 'required' : undefined);
            ff.addChildString(this.direction);
            ff.addChild(this.dataTypeRef.getFriendlyFormat());
            ff.addChildString(this.name);
            if (this.defaultValue) {
                ff.addChildString('=');
                if (typeof (this.defaultValue) === 'string') {
                    ff.addChildString(this.defaultValue);
                } else {
                    ff.addChild((this.defaultValue).getFriendlyFormat());
                }
            }
            ff.addComment(this.explanation);

            return ff;
        }
        // return p.measure(bodyCode);
    }
    public getExplanation(): string {
        // let bodyCode = () =>
        {
            return this.explanation;
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
    public getDefaultValue(): ArgumentValue {
        // let bodyCode = () =>
        {
            return this.defaultValue;
        }
        // return p.measure(bodyCode);
    }
    public getRequired(): boolean {
        // let bodyCode = () =>
        {
            return this.required;
        }
        // return p.measure(bodyCode);
    }
    public getDirection(): string {
        // let bodyCode = () =>
        {
            return this.direction;
        }
        // return p.measure(bodyCode);
    }
    public getDataTypeRef(): ICdmDataTypeRef {
        // let bodyCode = () =>
        {
            return this.dataTypeRef;
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
            if (this.defaultValue && typeof (this.defaultValue) !== 'string') {
                if ((this.defaultValue).visit(`${path}/defaultValue/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.dataTypeRef) {
                if (this.dataTypeRef.visit(`${path}/dataType/`, preChildren, postChildren)) {
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
}
