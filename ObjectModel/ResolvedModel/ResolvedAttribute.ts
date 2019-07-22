import {
    AttributeContextImpl,
    ICdmAttributeDef,
    ICdmObject,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    spewCatcher,
    traitToPropertyMap
} from '../internal';

export class ResolvedAttribute {

    public get isPrimaryKey(): boolean {
        return this.getTraitToPropertyMap()
            .getPropertyValue('isPrimaryKey');
    }
    public get isReadOnly(): boolean {
        return this.getTraitToPropertyMap()
            .getPropertyValue('isReadOnly');
    }
    public get isNullable(): boolean {
        return this.getTraitToPropertyMap()
            .getPropertyValue('isNullable');
    }
    public get dataFormat(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('dataFormat');
    }
    public get sourceName(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('sourceName');
    }
    public get sourceOrdering(): number {
        return this.getTraitToPropertyMap()
            .getPropertyValue('sourceOrdering');
    }
    public get displayName(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('displayName');
    }
    public get description(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('description');
    }
    public get maximumValue(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('maximumValue');
    }
    public get minimumValue(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('minimumValue');
    }
    public get maximumLength(): number {
        return this.getTraitToPropertyMap()
            .getPropertyValue('maximumLength');
    }
    public get valueConstrainedToList(): boolean {
        return this.getTraitToPropertyMap()
            .getPropertyValue('valueConstrainedToList');
    }
    public get defaultValue(): any {
        return this.getTraitToPropertyMap()
            .getPropertyValue('defaultValue');
    }
    public get creationSequence(): number {
        return this.insertOrder;
    }
    public target: ResolutionTarget;
    public resolvedName: string;
    public resolvedTraits: ResolvedTraitSet;
    public insertOrder: number;
    public attCtx: AttributeContextImpl;
    public applierState?: any;
    private t2pm: traitToPropertyMap;

    constructor(resOpt: resolveOptions, target: ResolutionTarget, defaultName: string, attCtx: AttributeContextImpl) {
        // let bodyCode = () =>
        {
            this.target = target;
            this.resolvedTraits = new ResolvedTraitSet(resOpt);
            this.resolvedName = defaultName;
            this.attCtx = attCtx;
        }
        // return p.measure(bodyCode);
    }
    public copy(): ResolvedAttribute {
        // let bodyCode = () =>
        {
            const resOpt: resolveOptions = this.resolvedTraits.resOpt; // use the options from the traits
            const copy: ResolvedAttribute = new ResolvedAttribute(resOpt, this.target, this.resolvedName, this.attCtx);
            copy.resolvedTraits = this.resolvedTraits.shallowCopy();
            copy.insertOrder = this.insertOrder;
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
            to.spewLine(`${indent}[${this.resolvedName}]`);
            this.resolvedTraits.spew(resOpt, to, `${indent}-`, nameSort);
        }
        // return p.measure(bodyCode);
    }

    public completeContext(resOpt: resolveOptions): void {
        if (this.attCtx && !this.attCtx.name) {
            this.attCtx.name = this.resolvedName;
            // type guard later
            if ((this.target as ICdmAttributeDef).createSimpleReference) {
                this.attCtx.definition = (this.target as ICdmAttributeDef).createSimpleReference(resOpt);
            }
            this.attCtx.corpusPath = `${(this.attCtx.parent.getObjectDef(resOpt) as AttributeContextImpl).corpusPath}/${this.resolvedName}`;
        }
    }

    private getTraitToPropertyMap(): traitToPropertyMap {
        if (this.t2pm) {
            return this.t2pm;
        }
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForResolvedAttribute((this.target as ICdmObject).ctx, this.resolvedTraits);

        return this.t2pm;
    }
}

export type ResolutionTarget = (ICdmAttributeDef | ResolvedAttributeSet);
