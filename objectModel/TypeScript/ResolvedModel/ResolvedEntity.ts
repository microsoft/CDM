import {
    CdmEntityDefinition,
    ResolvedAttributeSet,
    ResolvedEntityReferenceSet,
    ResolvedTraitSet,
    resolveOptions,
    spewCatcher
} from '../internal';

/**
     * @internal
     */
export class ResolvedEntity {
    public get sourceName(): string {
        return this.entity.sourceName;
    }
    public get description(): string {
        return this.entity.description;
    }
    public get displayName(): string {
        return this.entity.displayName;
    }
    public get version(): string {
        return this.entity.version;
    }
    public get cdmSchemas(): string[] {
        return this.entity.cdmSchemas;
    }

    public entity: CdmEntityDefinition;
    public resolvedName: string;
    public resolvedTraits: ResolvedTraitSet;
    public resolvedAttributes: ResolvedAttributeSet;
    public resolvedEntityReferences: ResolvedEntityReferenceSet;

    constructor(resOpt: resolveOptions, entDef: CdmEntityDefinition) {
        this.entity = entDef;
        this.resolvedName = this.entity.getName();
        this.resolvedTraits = this.entity.fetchResolvedTraits(resOpt);
        this.resolvedAttributes = this.entity.fetchResolvedAttributes(resOpt);
        this.resolvedEntityReferences = this.entity.fetchResolvedEntityReference(resOpt);
    }

    public spewProperties(to: spewCatcher, indent: string): void {
        if (this.displayName) {
            to.spewLine(`${indent}displayName: ${this.displayName}`);
        }
        if (this.description) {
            to.spewLine(`${indent}description: ${this.description}`);
        }
        if (this.version) {
            to.spewLine(`${indent}version: ${this.version}`);
        }
        if (this.sourceName) {
            to.spewLine(`${indent}sourceName: ${this.sourceName}`);
        }
    }

    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string, nameSort: boolean): void {
        to.spewLine(`${indent}=====ENTITY=====`);
        to.spewLine(`${indent}${this.resolvedName}`);
        to.spewLine(`${indent}================`);
        to.spewLine(`${indent}properties:`);
        this.spewProperties(to, `${indent} `);
        to.spewLine(`${indent}traits:`);
        this.resolvedTraits.spew(resOpt, to, `${indent} `, nameSort);
        to.spewLine('attributes:');
        this.resolvedAttributes.spew(resOpt, to, `${indent} `, nameSort);
        to.spewLine('relationships:');
        this.resolvedEntityReferences.spew(resOpt, to, `${indent} `, nameSort);
    }
}
