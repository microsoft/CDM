// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    CdmCorpusContext,
    CdmParameterDefinition,
    ParameterCollection,
    ParameterValue,
    resolveOptions,
    spewCatcher
} from '../internal';

/**
     * @internal
     */
export class ParameterValueSet {
    public pc: ParameterCollection;
    public values: ArgumentValue[];
    public wasSet: boolean[];
    public ctx: CdmCorpusContext;
    constructor(ctx: CdmCorpusContext, pc: ParameterCollection, values: ArgumentValue[], wasSet: boolean[]) {
        // let bodyCode = () =>
        {
            this.pc = pc;
            this.values = values;
            this.wasSet = wasSet;
            this.ctx = ctx;
        }
        // return p.measure(bodyCode);
    }

    public get length(): number {
        // let bodyCode = () =>
        {
            if (this.pc && this.pc.sequence) {
                return this.pc.sequence.length;
            }

            return 0;
        }
        // return p.measure(bodyCode);
    }

    public indexOf(paramDef: CdmParameterDefinition): number {
        // let bodyCode = () =>
        {
            return this.pc.ordinals.get(paramDef);
        }
        // return p.measure(bodyCode);
    }

    public fetchParameterAtIndex(i: number): CdmParameterDefinition {
        // let bodyCode = () =>
        {
            return this.pc.sequence[i];
        }
        // return p.measure(bodyCode);
    }

    public fetchValue(i: number): ArgumentValue {
        // let bodyCode = () =>
        {
            return this.values[i];
        }
        // return p.measure(bodyCode);
    }

    public fetchValueString(resOpt: resolveOptions, i: number): string {
        // let bodyCode = () =>
        {
            return new ParameterValue(this.ctx, this.pc.sequence[i], this.values[i]).fetchValueString(resOpt);
        }
        // return p.measure(bodyCode);
    }

    public fetchParameterValueByName(pName: string): ParameterValue {
        // let bodyCode = () =>
        {
            const i: number = this.pc.fetchParameterIndex(pName);

            return new ParameterValue(this.ctx, this.pc.sequence[i], this.values[i]);
        }
        // return p.measure(bodyCode);
    }

    public setParameterValue(resOpt: resolveOptions, pName: string, value: ArgumentValue): void {
        // let bodyCode = () =>
        {
            const i: number = this.pc.fetchParameterIndex(pName);
            this.values[i] = ParameterValue.fetchReplacementValue(resOpt, this.values[i], value, true);
            this.wasSet[i] = true;
        }
        // return p.measure(bodyCode);
    }

    public copy(): ParameterValueSet {
        // let bodyCode = () =>
        {
            const copyValues: ArgumentValue[] = this.values.slice(0);
            const copyWasSet: boolean[] = this.wasSet.slice(0);

            return new ParameterValueSet(this.ctx, this.pc, copyValues, copyWasSet);
        }
        // return p.measure(bodyCode);
    }

    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string): void {
        // let bodyCode = () =>
        {
            const l: number = this.length;
            for (let i: number = 0; i < l; i++) {
                const pv: ParameterValue = new ParameterValue(this.ctx, this.pc.sequence[i], this.values[i]);
                pv.spew(resOpt, to, `${indent}-`);
            }
        }
        // return p.measure(bodyCode);
    }
}
