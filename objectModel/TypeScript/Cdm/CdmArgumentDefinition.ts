// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { isString } from 'util';
import {
    ArgumentValue,
    CdmCorpusContext,
    CdmObject,
    CdmObjectBase,
    cdmObjectSimple,
    cdmObjectType,
    CdmParameterDefinition,
    cdmLogCode,
    Logger,
    resolveOptions,
    VisitCallback,
    StringUtils
} from '../internal';

export class CdmArgumentDefinition extends cdmObjectSimple {
    private TAG: string = CdmArgumentDefinition.name;

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
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
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
                    copy.value = this.value;
                }
            }
            copy.resolvedParameter = this.resolvedParameter;
            copy.explanation = this.explanation;

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public fetchObjectDefinitionName(): string {
        return this.name;
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            if (this.value === undefined) {
                let missingFields: string[] = ['value'];
                Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
                return false;
            }

            return true;
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
            const path: string = pathFrom; // name of arg is forced down from trait ref. you get what you get and you don't throw a fit.

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.value !== undefined) {
                if (typeof (this.value) === 'object' && 'visit' in this.value && typeof (this.value.visit) === 'function') {
                    if (this.value.visit(`${path}/value/`, preChildren, postChildren)) {
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
}
