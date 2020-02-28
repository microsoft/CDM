// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionContext,
    CdmAttribute,
    CdmAttributeContext,
    CdmObject,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    spewCatcher,
    traitToPropertyMap
} from '../internal';

/**
     * @internal
     */
export class ResolvedAttribute {

    public get isPrimaryKey(): boolean {
        return this.traitToPropertyMap
            .fetchPropertyValue('isPrimaryKey');
    }
    public get isReadOnly(): boolean {
        return this.traitToPropertyMap
            .fetchPropertyValue('isReadOnly');
    }
    public get isNullable(): boolean {
        return this.traitToPropertyMap
            .fetchPropertyValue('isNullable');
    }
    public get dataFormat(): string {
        return this.traitToPropertyMap
            .fetchPropertyValue('dataFormat');
    }
    public get sourceName(): string {
        return this.traitToPropertyMap
            .fetchPropertyValue('sourceName');
    }
    public get sourceOrdering(): number {
        return this.traitToPropertyMap
            .fetchPropertyValue('sourceOrdering');
    }
    public get displayName(): string {
        return this.traitToPropertyMap
            .fetchPropertyValue('displayName');
    }
    public get description(): string {
        return this.traitToPropertyMap
            .fetchPropertyValue('description');
    }
    public get maximumValue(): string {
        return this.traitToPropertyMap
            .fetchPropertyValue('maximumValue');
    }
    public get minimumValue(): string {
        return this.traitToPropertyMap
            .fetchPropertyValue('minimumValue');
    }
    public get maximumLength(): number {
        return this.traitToPropertyMap
            .fetchPropertyValue('maximumLength');
    }
    public get valueConstrainedToList(): boolean {
        return this.traitToPropertyMap
            .fetchPropertyValue('valueConstrainedToList');
    }
    public get defaultValue(): any {
        return this.traitToPropertyMap
            .fetchPropertyValue('defaultValue');
    }
    public get creationSequence(): number {
        return this.insertOrder;
    }
    private get traitToPropertyMap(): traitToPropertyMap {
        if (this.t2pm) {
            return this.t2pm;
        }
        this.t2pm = new traitToPropertyMap(this.target as CdmObject);

        return this.t2pm;
    }
    public previousResolvedName: string;
    /**
     * @internal
     */
    public resolvedTraits: ResolvedTraitSet;
    /**
     * @internal
     */
    public resolvedAttributeCount: number;
    public insertOrder: number;
    public attCtx: CdmAttributeContext;
    public applierState?: any;
    public arc: AttributeResolutionContext;
    private _target: ResolutionTarget;
    private _resolvedName: string;
    private t2pm: traitToPropertyMap;

    constructor(resOpt: resolveOptions, target: ResolutionTarget, defaultName: string, attCtx: CdmAttributeContext) {
        // let bodyCode = () =>
        {
            this.target = target;
            this.resolvedTraits = new ResolvedTraitSet(resOpt);
            this.resolvedName = defaultName;
            this.previousResolvedName = defaultName;
            this.attCtx = attCtx;
        }
        // return p.measure(bodyCode);
    }
    public set resolvedName(newVal: string) {
        this._resolvedName = newVal;
        if (this.previousResolvedName === undefined) {
            this.previousResolvedName = newVal;
        }
    }
    public get resolvedName(): string {
        return this._resolvedName;
    }
    public set target(newVal: ResolutionTarget) {
        if (newVal !== undefined) {
            if (newVal instanceof CdmAttribute) {
                this.resolvedAttributeCount = newVal.attributeCount;
            } else if (newVal instanceof ResolvedAttributeSet) {
                this.resolvedAttributeCount = newVal.resolvedAttributeCount;
            }
        }
        this._target = newVal;
    }
    public get target(): ResolutionTarget {
        return this._target;
    }
    public copy(): ResolvedAttribute {
        // let bodyCode = () =>
        {
            const resOpt: resolveOptions = this.resolvedTraits.resOpt; // use the options from the traits
            const copy: ResolvedAttribute = new ResolvedAttribute(resOpt, this.target, this._resolvedName, this.attCtx);
            copy.resolvedTraits = this.resolvedTraits.shallowCopy();
            copy.insertOrder = this.insertOrder;
            copy.arc = this.arc;
            if (this.applierState) {
                copy.applierState = {};
                Object.assign(copy.applierState, this.applierState);
            }

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string, nameSort: boolean): void {
        // let bodyCode = () =>
        {
            to.spewLine(`${indent}[${this._resolvedName}]`);
            this.resolvedTraits.spew(resOpt, to, `${indent}-`, nameSort);
        }
        // return p.measure(bodyCode);
    }

    public completeContext(resOpt: resolveOptions): void {
        if (this.attCtx && !this.attCtx.name) {
            this.attCtx.name = this._resolvedName;
            // type guard later
            if ((this.target as CdmAttribute).createSimpleReference) {
                this.attCtx.definition = (this.target as CdmAttribute).createSimpleReference(resOpt);
            }
            this.attCtx.atCorpusPath = `${this.attCtx.parent.fetchObjectDefinition(resOpt).atCorpusPath}/${this._resolvedName}`;
        }
    }
}

export type ResolutionTarget = (CdmAttribute | ResolvedAttributeSet);
