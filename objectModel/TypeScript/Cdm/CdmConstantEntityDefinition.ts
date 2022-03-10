// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    CdmEntityReference,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    cdmLogCode,
    Logger,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmConstantEntityDefinition extends CdmObjectDefinitionBase {
    private TAG: string = CdmConstantEntityDefinition.name;
    
    public constantEntityName: string;
    public entityShape: CdmEntityReference;
    public constantValues: string[][];

    public static get objectType(): cdmObjectType {
        return cdmObjectType.constantEntityDef;
    }

    constructor(ctx: CdmCorpusContext, constantEntityName: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.constantEntityDef;
            this.constantEntityName = constantEntityName;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }
            let copy: CdmConstantEntityDefinition;
            if (!host) {
                copy = new CdmConstantEntityDefinition(this.ctx, this.constantEntityName);
            } else {
                copy = host as CdmConstantEntityDefinition;
                copy.constantEntityName = this.constantEntityName;
            }

            copy.entityShape = <CdmEntityReference>this.entityShape.copy(resOpt);
            if (this.constantValues) {
                // deep copy the content
                copy.constantValues = [];
                for (const row of this.constantValues) {
                    copy.constantValues.push(row.slice());
                }
            }
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            if (this.constantValues === undefined) {
                const pathSplit: string[] = this.declaredPath.split('/');
                const entityName: string = (pathSplit.length > 0) ? pathSplit[0] : ``;
                Logger.warning(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.WarnValdnEntityNotDefined, entityName);
            }
            if (this.entityShape === undefined) {
                let missingFields: string[] = ['entityShape'];
                Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);

                return false;
            }

            return true;
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

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        // let bodyCode = () =>
        {
            return false;
        }
        // return p.measure(bodyCode);
    }

    public getName(): string {
        // let bodyCode = () =>
        {
            // make up a name if one not given
            if (this.constantEntityName === undefined) {
                if (this.entityShape !== undefined) {
                    return `Constant${this.entityShape.fetchObjectDefinitionName()}`;
                }

                return 'ConstantEntity';
            }

            return this.constantEntityName;
        }
        // return p.measure(bodyCode);
    }

    public getEntityShape(): CdmEntityReference {
        // let bodyCode = () =>
        {
            return this.entityShape;
        }
        // return p.measure(bodyCode);
    }

    public setEntityShape(shape: CdmEntityReference): CdmEntityReference {
        // let bodyCode = () =>
        {
            this.entityShape = shape;

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
            const path = this.fetchDeclaredPath(pathFrom);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.entityShape) {
                this.entityShape.owner = this;
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

    /**
     * @internal
     */
    public fetchDeclaredPath(pathFrom: string): string {
        return pathFrom + (this.constantEntityName ? this.constantEntityName : '(unspecified)');
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            return;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            const rasb: ResolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
            rasb.ras.attributeContext = under;
            let acpEnt: AttributeContextParameters;
            if (under) {
                acpEnt = {
                    under: under,
                    type: cdmAttributeContextType.entity,
                    name: this.entityShape.fetchObjectDefinitionName(),
                    regarding: this.entityShape,
                    includeTraits: true
                };
            }

            if (this.entityShape) {
                rasb.mergeAttributes(this
                    .getEntityShape()
                    .fetchResolvedAttributes(resOpt, acpEnt));
            }

            // things that need to go away
            rasb.removeRequestedAtts();

            return rasb;
        }
        // return p.measure(bodyCode);
    }

    // the world's smallest complete query processor...
    /**
     * @internal
     */
    public findValue(
        resOpt: resolveOptions,
        attReturn: string | number,
        attSearch: string | number,
        valueSearch: string,
        order: number,
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
                const ras: ResolvedAttributeSet = this.fetchResolvedAttributes(resOpt);

                // query validation and binding
                if (ras !== undefined) {
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
            }

            // rowset processing
            if (resultAtt >= 0 && searchAtt >= 0) {
                if (this.constantValues && this.constantValues.length) {
                    let startAt: number = 0;
                    let endBefore: number = this.constantValues.length;
                    let increment: number = 1;
                    if (order === -1) {
                        increment = -1;
                        startAt = this.constantValues.length - 1;
                        endBefore = -1;
                    }
                    for (let i: number = startAt; i !== endBefore; i += increment) {
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

    /**
     * @internal
     */
    public fetchConstantValue(
        resOpt: resolveOptions,
        attReturn: string | number,
        attSearch: string | number,
        valueSearch: string,
        order: number): string {
        // let bodyCode = () =>
        {
            let result: string;
            this.findValue(resOpt, attReturn, attSearch, valueSearch, order, (found: string): string => {
                result = found;

                return found;
            });

            return result;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public updateConstantValue(
        resOpt: resolveOptions,
        attReturn: string | number,
        newValue: string,
        attSearch: string | number,
        valueSearch: string,
        order: number): string {
        // let bodyCode = () =>
        {
            let result: string;
            this.findValue(resOpt, attReturn, attSearch, valueSearch, order, (found: string): string => {
                result = found;

                return newValue;
            });

            return result;
        }
        // return p.measure(bodyCode);
    }
}
