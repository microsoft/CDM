// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    CdmTraitDefinition,
    CdmTraitReference,
    ParameterCollection,
    ParameterValueSet,
    resolveOptions,
    spewCatcher
} from '../internal';

/**
     * @internal
     */
export class ResolvedTrait {
    public trait: CdmTraitDefinition;
    /**
     * @internal
     */
    public parameterValues: ParameterValueSet;
    constructor(trait: CdmTraitDefinition, pc: ParameterCollection, values: ArgumentValue[], wasSet: boolean[]) {
        // let bodyCode = () =>
        {
            if (pc && pc.sequence && pc.sequence.length) {
                this.parameterValues = new ParameterValueSet(trait.ctx, pc, values, wasSet);
            }
            this.trait = trait;
        }
        // return p.measure(bodyCode);
    }

    public get traitName(): string {
        // let bodyCode = () =>
        {
            return this.trait.declaredPath;
        }
        // return p.measure(bodyCode);
    }

    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string): void {
        // let bodyCode = () =>
        {
            to.spewLine(`${indent}[${this.traitName}]`);
            if (this.parameterValues) {
                this.parameterValues.spew(resOpt, to, `${indent}-`);
            }
        }
        // return p.measure(bodyCode);
    }

    public copy(): ResolvedTrait {
        // let bodyCode = () =>
        {
            if (this.parameterValues) {
                const copyParamValues: ParameterValueSet = this.parameterValues.copy();

                return new ResolvedTrait(this.trait, copyParamValues.pc, copyParamValues.values, copyParamValues.wasSet);
            }

            return new ResolvedTrait(this.trait, undefined, undefined, undefined);
        }
        // return p.measure(bodyCode);
    }

    public collectTraitNames(resOpt: resolveOptions, into: Set<string>): void {
        // let bodyCode = () =>
        {
            // get the name of this trait and all of its base classes
            let t: CdmTraitDefinition = this.trait;
            while (t) {
                const name: string = t.getName();
                if (!into.has(name)) {
                    into.add(name);
                }
                const baseRef: CdmTraitReference = t.fetchExtendsTrait();
                t = (baseRef ? baseRef.fetchObjectDefinition(resOpt) : undefined);
            }
        }
        // return p.measure(bodyCode);
    }
}
