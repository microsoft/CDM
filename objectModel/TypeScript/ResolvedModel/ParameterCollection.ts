// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmParameterDefinition } from '../internal';

/**
     * @internal
     */
export class ParameterCollection {
    public sequence: CdmParameterDefinition[];
    public lookup: Map<string, CdmParameterDefinition>;
    public ordinals: Map<CdmParameterDefinition, number>;
    constructor(prior: ParameterCollection) {
        // let bodyCode = () =>
        {
            if (prior && prior.sequence) {
                this.sequence = prior.sequence.slice();
            } else {
                this.sequence = [];
            }

            if (prior && prior.lookup) {
                this.lookup = new Map<string, CdmParameterDefinition>(prior.lookup);
            } else {
                this.lookup = new Map<string, CdmParameterDefinition>();
            }

            if (prior && prior.ordinals) {
                this.ordinals = new Map<CdmParameterDefinition, number>(prior.ordinals);
            } else {
                this.ordinals = new Map<CdmParameterDefinition, number>();
            }
        }
        // return p.measure(bodyCode);
    }

    public add(element: CdmParameterDefinition): void {
        // let bodyCode = () =>
        {
            // if there is already a named parameter that matches, this is trouble
            const name: string = element.getName();
            if (name && this.lookup.has(name)) {
                throw new Error(`duplicate parameter named '${name}'`);
            }
            if (name) {
                this.lookup.set(name, element);
            }

            this.ordinals.set(element, this.sequence.length);
            this.sequence.push(element);
        }
        // return p.measure(bodyCode);
    }
    public resolveParameter(ordinal: number, name: string): CdmParameterDefinition {
        // let bodyCode = () =>
        {
            if (name) {
                if (this.lookup.has(name)) {
                    return this.lookup.get(name);
                }
                throw new Error(`there is no parameter named '${name}'`);
            }
            if (ordinal >= this.sequence.length) {
                throw new Error(`too many arguments supplied`);
            }

            return this.sequence[ordinal];
        }
        // return p.measure(bodyCode);
    }
    public fetchParameterIndex(pName: string): number {
        // let bodyCode = () =>
        {
            return this.ordinals.get(this.lookup.get(pName));
        }
        // return p.measure(bodyCode);
    }
}
