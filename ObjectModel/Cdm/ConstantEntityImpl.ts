import {
    AttributeContextParameters,
    cdmAttributeContextType,
    CdmCorpusContext,
    cdmObject,
    cdmObjectDef,
    cdmObjectType,
    ConstantEntity,
    copyOptions,
    EntityReference,
    EntityReferenceImpl,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmConstantEntityDef,
    ICdmEntityRef,
    ICdmObject,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';

export class ConstantEntityImpl extends cdmObjectDef implements ICdmConstantEntityDef {
    public constantEntityName: string;
    public entityShape: EntityReferenceImpl;
    public constantValues: string[][];

    constructor(ctx: CdmCorpusContext) {
        super(ctx, false);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.constantEntityDef;
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: ConstantEntity): ConstantEntityImpl {

        // let bodyCode = () =>
        {
            const c: ConstantEntityImpl = new ConstantEntityImpl(ctx);
            if (object.explanation) {
                c.explanation = object.explanation;
            }
            if (object.constantEntityName) {
                c.constantEntityName = object.constantEntityName;
            }
            c.constantValues = object.constantValues;
            c.entityShape = cdmObject.createEntityReference(ctx, object.entityShape);

            return c;
        }
        // return p.measure(bodyCode);
    }

    public copyData(resOpt: resolveOptions, options: copyOptions): ConstantEntity {
        // let bodyCode = () =>
        {
            return {
                explanation: this.explanation,
                constantEntityName: this.constantEntityName,
                entityShape: this.entityShape ? this.entityShape.copyData(resOpt, options) as (string | EntityReference)  : undefined,
                constantValues: this.constantValues
            };
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject {
        // let bodyCode = () =>
        {
            const copy: ConstantEntityImpl = new ConstantEntityImpl(this.ctx);
            copy.constantEntityName = this.constantEntityName;
            copy.entityShape = <EntityReferenceImpl>this.entityShape.copy(resOpt);
            copy.constantValues = this.constantValues; // is a deep copy needed?
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.entityShape ? true : false;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.lineWrap = true;
            const ffDecl: friendlyFormatNode = new friendlyFormatNode();
            ff.addChild(ffDecl);
            ffDecl.separator = ' ';
            ffDecl.addChildString('constant entity');
            ffDecl.addChildString(this.constantEntityName);
            ffDecl.addChildString('shaped like');
            ffDecl.addChild(this.entityShape.getFriendlyFormat());
            ffDecl.addChildString('contains');

            const ffTable: friendlyFormatNode = new friendlyFormatNode();
            ff.addChild(ffTable);
            ffTable.forceWrap = this.constantValues.length > 1;
            ffTable.bracketEmpty = true;
            ffTable.starter = '{';
            ffTable.terminator = '}';
            ffTable.separator = ',';
            for (const rowArray of this.constantValues) {
                const ffRow: friendlyFormatNode = new friendlyFormatNode();
                ffRow.bracketEmpty = false;
                ffRow.starter = '{';
                ffRow.terminator = '}';
                ffRow.separator = ', ';
                for (const rowColumnValue of rowArray) {
                    ffRow.addChildString(rowColumnValue, true);
                }
                ffTable.addChild(ffRow);
            }

            return ff;
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.constantEntityDef;
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
    public getName(): string {
        // let bodyCode = () =>
        {
            return this.constantEntityName;
        }
        // return p.measure(bodyCode);
    }
    public getEntityShape(): ICdmEntityRef {
        // let bodyCode = () =>
        {
            return this.entityShape;
        }
        // return p.measure(bodyCode);
    }
    public setEntityShape(shape: ICdmEntityRef): ICdmEntityRef {
        // let bodyCode = () =>
        {
            this.entityShape = shape as EntityReferenceImpl;

            return this.entityShape;
        }
        // return p.measure(bodyCode);
    }

    public getConstantValues(): string[][] {
        // let bodyCode = () =>
        {
            return this.constantValues;
        }
        // return p.measure(bodyCode);
    }
    public setConstantValues(values: string[][]): string[][] {
        // let bodyCode = () =>
        {
            this.constantValues = values;

            return this.constantValues;
        }
        // return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = this.declaredPath;
            if (!path) {
                path = pathFrom + (this.constantEntityName ? this.constantEntityName : '(unspecified)');
                this.declaredPath = path;
            }
            // trackVisits(path);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.entityShape) {
                if (this.entityShape.visit(`${path}/entityShape/`, preChildren, postChildren)) {
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
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            return;
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            const rasb: ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
            let acpEnt: AttributeContextParameters;
            if (under) {
                acpEnt = {
                    under: under,
                    type: cdmAttributeContextType.entity,
                    name: this.entityShape.getObjectDefName(),
                    regarding: this.entityShape,
                    includeTraits: true
                };
            }

            if (this.entityShape) {
                rasb.mergeAttributes(this
                    .getEntityShape()
                    .getResolvedAttributes(resOpt, acpEnt));
            }

            // things that need to go away
            rasb.removeRequestedAtts();

            return rasb;
        }
        // return p.measure(bodyCode);
    }

    // the world's smallest complete query processor...
    public findValue(
        resOpt: resolveOptions,
        attReturn: string | number,
        attSearch: string | number,
        valueSearch: string,
        action: (found: string) => string): void {
        // let bodyCode = () =>
        {
            let resultAtt: number = -1;
            let searchAtt: number = -1;

            if (typeof (attReturn) === 'number') {
                resultAtt = attReturn;
            }
            if (typeof (attSearch) === 'number') {
                searchAtt = attSearch;
            }

            if (resultAtt === -1 || searchAtt === -1) {
                // metadata library
                const ras: ResolvedAttributeSet = this.getResolvedAttributes(resOpt);
                // query validation and binding
                const l: number = ras.set.length;
                for (let i: number = 0; i < l; i++) {
                    const name: string = ras.set[i].resolvedName;
                    if (resultAtt === -1 && name === attReturn) {
                        resultAtt = i;
                    }
                    if (searchAtt === -1 && name === attSearch) {
                        searchAtt = i;
                    }
                    if (resultAtt >= 0 && searchAtt >= 0) {
                        break;
                    }
                }
            }

            // rowset processing
            if (resultAtt >= 0 && searchAtt >= 0) {
                if (this.constantValues && this.constantValues.length) {
                    const l: number = this.constantValues.length;
                    for (let i: number = 0; i < l; i++) {
                        if (this.constantValues[i][searchAtt] === valueSearch) {
                            this.constantValues[i][resultAtt] = action(this.constantValues[i][resultAtt]);

                            return;
                        }
                    }
                }
            }

            return;
        }
        // return p.measure(bodyCode);
    }

    public lookupWhere(resOpt: resolveOptions, attReturn: string | number, attSearch: string | number, valueSearch: string): string {
        // let bodyCode = () =>
        {
            let result: string;
            this.findValue(resOpt, attReturn, attSearch, valueSearch, (found: string): string => {
                result = found;

                return found;
            });

            return result;
        }
        // return p.measure(bodyCode);
    }
    public setWhere(
        resOpt: resolveOptions,
        attReturn: string | number,
        newValue: string,
        attSearch: string | number,
        valueSearch: string): string {
        // let bodyCode = () =>
        {
            let result: string;
            this.findValue(resOpt, attReturn, attSearch, valueSearch, (found: string): string => {
                result = found;

                return newValue;
            });

            return result;
        }
        // return p.measure(bodyCode);
    }

}
