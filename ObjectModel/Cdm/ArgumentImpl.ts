import {
    Argument,
    ArgumentValue,
    CdmCorpusContext,
    CdmJsonType,
    cdmObject,
    cdmObjectSimple,
    cdmObjectType,
    copyOptions,
    friendlyFormatNode,
    ICdmArgumentDef,
    ICdmObject,
    ICdmParameterDef,
    resolveOptions,
    VisitCallback
} from '../internal';

export class ArgumentImpl extends cdmObjectSimple implements ICdmArgumentDef {
    public explanation: string;
    public name: string;
    public value: ArgumentValue;
    public resolvedParameter: ICdmParameterDef;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.argumentDef;
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: string | Argument): ArgumentImpl {
        // let bodyCode = () =>
        {

            const c: ArgumentImpl = new ArgumentImpl(ctx);

            if (typeof object !== 'string' && object.value) {
                c.value = cdmObject.createConstant(ctx, object.value as CdmJsonType);
                if (object.name) {
                    c.name = object.name;
                }
                if (object.explanation) {
                    c.explanation = object.explanation;
                }
            } else {
                // not a structured argument, just a thing. try it
                c.value = cdmObject.createConstant(ctx, object);
            }

            return c;
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
    public copyData(resOpt: resolveOptions, options: copyOptions): CdmJsonType {
        // let bodyCode = () =>
        {
            let val: CdmJsonType;
            if (this.value) {
                if (typeof (this.value) === 'string') {
                    val = this.value;
                } else {
                    val = (this.value).copyData(resOpt, options);
                }
            }
            // skip the argument if just a value
            if (!this.name) {
                return val;
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ArgumentImpl {
        // let bodyCode = () =>
        {
            const copy: ArgumentImpl = new ArgumentImpl(this.ctx);
            copy.name = this.name;
            if (this.value) {
                if (typeof (this.value) === 'string') {
                    copy.value = this.value;
                } else {
                    copy.value = (this.value).copy(resOpt);
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
            return !!this.value;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const friendlyNode: friendlyFormatNode = new friendlyFormatNode();
            friendlyNode.separator = ': ';
            friendlyNode.addChildString(this.name);
            if (this.value) {
                if (typeof (this.value) === 'string') {
                    friendlyNode.addChildString(this.value);
                } else {
                    friendlyNode.addChild((this.value).getFriendlyFormat());
                }
            }
            friendlyNode.addComment(this.explanation);

            return friendlyNode;
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
    public getParameterDef(): ICdmParameterDef {
        // let bodyCode = () =>
        {
            return this.resolvedParameter;
        }
        // return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = this.declaredPath;
            if (!path) {
                path = pathFrom + (this.value ? 'value/' : '');
                this.declaredPath = path;
            }
            // trackVisits(path);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.value) {
                if (typeof (this.value) !== 'string') {
                    if ((this.value).visit(path, preChildren, postChildren)) {
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

    public cacheTag(): string {
        // let bodyCode = () =>
        {
            let tag: string;
            const val: ArgumentValue = this.value;
            if (val) {
                if (typeof (val) === 'string') {
                    tag = val;
                } else {
                    const valObj: ICdmObject = val;
                    if (valObj.ID) {
                        tag = val.ID.toString();
                    } else {
                        tag = val.toString();
                    }
                }
            }

            return tag;
        }
        // return p.measure(bodyCode);
    }
}
