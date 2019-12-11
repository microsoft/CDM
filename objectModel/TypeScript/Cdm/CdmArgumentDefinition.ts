import { isString } from 'util';
import {
    ArgumentValue,
    CdmCorpusContext,
    CdmObject,
    CdmObjectBase,
    cdmObjectSimple,
    cdmObjectType,
    CdmParameterDefinition,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmArgumentDefinition extends cdmObjectSimple {
    public explanation: string;
    public name: string;
    public value: ArgumentValue;
    /**
     *  @internal
     */
    public unresolvedValue: ArgumentValue;
    /**
     *  @internal
     */
    public resolvedParameter: CdmParameterDefinition;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.argumentDef;
    }

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.argumentDef;
            this.name = name;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.argumentDef;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmArgumentDefinition {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            let copy: CdmArgumentDefinition;

            if (!host) {
                copy = new CdmArgumentDefinition(this.ctx, this.name);
            } else {
                copy = host as CdmArgumentDefinition;
                copy.ctx = this.ctx;
                copy.name = this.name;
            }
            if (this.value) {
                if (this.value instanceof CdmObjectBase) {
                    copy.value = (this.value as CdmObject).copy(resOpt);
                } else {
                    // Value is a string or object
                    copy.value = this.value;
                }
            }
            copy.resolvedParameter = this.resolvedParameter;
            copy.explanation = this.explanation;

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.value !== undefined;
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

    public setExplanation(explanation: string): string {
        // let bodyCode = () =>
        {
            this.explanation = explanation;

            return this.explanation;
        }
        // return p.measure(bodyCode);
    }

    public getValue(): ArgumentValue {
        // let bodyCode = () =>
        {
            return this.value;
        }
        // return p.measure(bodyCode);
    }

    public setValue(value: ArgumentValue): void {
        // let bodyCode = () =>
        {
            this.value = value;
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

    /**
     * @internal
     */
    public getParameterDef(): CdmParameterDefinition {
        // let bodyCode = () =>
        {
            return this.resolvedParameter;
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
                    path = pathFrom + (this.value ? 'value/' : '');
                    this.declaredPath = path;
                }
            }

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.value) {
                if (typeof (this.value) === 'object' && 'visit' in this.value && typeof (this.value.visit) === 'function') {
                    if (this.value.visit(path, preChildren, postChildren)) {
                        return true;
                    }
                }
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
    public cacheTag(): string {
        // let bodyCode = () =>
        {
            let tag: string;
            const val: ArgumentValue = this.value;
            if (val) {
                if (this.value instanceof CdmObjectBase) {
                    if (this.value.ID) {
                        tag = this.value.ID.toString();
                    }
                } else {
                    tag = JSON.stringify(val);
                }
            }

            return tag;
        }
        // return p.measure(bodyCode);
    }
}
