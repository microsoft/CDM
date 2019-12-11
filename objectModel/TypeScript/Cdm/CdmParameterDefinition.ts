import {
    ArgumentValue,
    CdmCorpusContext,
    CdmDataTypeReference,
    CdmObject,
    cdmObjectSimple,
    cdmObjectType,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmParameterDefinition extends cdmObjectSimple implements CdmParameterDefinition {
    public explanation: string;
    public name: string;
    public defaultValue: ArgumentValue;
    public required: boolean;
    public dataTypeRef: CdmDataTypeReference;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.parameterDef;
    }

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.name = name;
            this.objectType = cdmObjectType.parameterDef;
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

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            let copy: CdmParameterDefinition;
            if (!host) {
                copy = new CdmParameterDefinition(this.ctx, this.name);
            } else {
                copy = host as CdmParameterDefinition;
                copy.ctx = this.ctx;
                copy.name = this.name;
            }

            let defVal: ArgumentValue;
            if (this.defaultValue) {
                if (typeof (this.defaultValue) === 'object' && 'copy' in this.defaultValue
                    && typeof (this.defaultValue.copy) === 'function') {
                    defVal = this.defaultValue.copy(resOpt);
                } else if (typeof (this.defaultValue) === 'object') {
                    defVal = { ...this.defaultValue };
                } else {
                    defVal = this.defaultValue;
                }
            }
            copy.explanation = this.explanation;
            copy.defaultValue = defVal;
            copy.required = this.required;
            copy.dataTypeRef = (this.dataTypeRef ? this.dataTypeRef.copy(resOpt) : undefined) as CdmDataTypeReference;

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

    public isDerivedFrom(baseDef: string, resOpt?: resolveOptions) {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        return false;
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

    /**
     * @internal
     */
    public getDataTypeRef(): CdmDataTypeReference {
        // let bodyCode = () =>
        {
            return this.dataTypeRef;
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
            if (typeof (this.defaultValue) === 'object' && 'visit' in this.defaultValue
                && typeof (this.defaultValue.visit) === 'function') {
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
