// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmEntityDefinition, ResolvedEntityReference, ResolvedEntityReferenceSide, resolveOptions, spewCatcher } from '../internal';

/**
     * @internal
     */
export class ResolvedEntityReferenceSet {
    public set: ResolvedEntityReference[];
    public resOpt: resolveOptions;

    constructor(resOpt: resolveOptions, set?: ResolvedEntityReference[]) {
        // let bodyCode = () =>
        {
            this.resOpt = resOpt;
            if (set) {
                this.set = set;
            } else {
                this.set = [];
            }
        }
        // return p.measure(bodyCode);
    }

    public add(toAdd: ResolvedEntityReferenceSet): void {
        // let bodyCode = () =>
        {
            if (toAdd && toAdd.set && toAdd.set.length) {
                this.set = this.set.concat(toAdd.set);
            }
        }
        // return p.measure(bodyCode);
    }

    public copy(): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            const newSet: ResolvedEntityReference[] = this.set.slice(0);
            for (let i: number = 0; i < newSet.length; i++) {
                newSet[i] = newSet[i].copy();
            }

            return new ResolvedEntityReferenceSet(this.resOpt, newSet);
        }
        // return p.measure(bodyCode);
    }

    public findEntity(entOther: CdmEntityDefinition): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            // make an array of just the refs that include the requested
            const filter: ResolvedEntityReference[] = this.set.filter((rer: ResolvedEntityReference): boolean => {
                return (rer.referenced.some((rers: ResolvedEntityReferenceSide): boolean => {
                    if (rers.entity === entOther) {
                        return true;
                    }
                }));
            });

            if (filter.length === 0) {
                return undefined;
            }

            return new ResolvedEntityReferenceSet(this.resOpt, filter);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string, nameSort: boolean): void {
        // let bodyCode = () =>
        {
            let list: ResolvedEntityReference[] = this.set;
            if (nameSort) {
                list = list.sort((l: ResolvedEntityReference, r: ResolvedEntityReference) => {
                    if (l.referenced && l.referenced.length) {
                        if (r.referenced && r.referenced.length) {
                            return l.referenced[0].entity.getName()
                                .localeCompare(r.referenced[0].entity.getName());
                        } else {
                            return 1;
                        }
                    } else {
                        return -1;
                    }
                });
            }
            for (let i: number = 0; i < this.set.length; i++) {
                list[i].spew(resOpt, to, `${indent}(rer[${i}])`, nameSort);
            }
        }
        // return p.measure(bodyCode);
    }
}
