import {
    ICdmEntityDef,
    ResolvedAttributeSet,
    ResolvedEntityReferenceSet,
    ResolvedTraitSet,
    resolveOptions,
    spewCatcher,
    traitToPropertyMap
} from '../internal';

export class ResolvedEntity {
    public get sourceName(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('sourceName');
    }
    public get description(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('description');
    }
    public get displayName(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('displayName');
    }
    public get version(): string {
        return this.getTraitToPropertyMap()
            .getPropertyValue('version');
    }
    public get cdmSchemas(): string[] {
        return this.getTraitToPropertyMap()
            .getPropertyValue('cdmSchemas');
    }
    public entity: ICdmEntityDef;
    public resolvedName: string;
    public resolvedTraits: ResolvedTraitSet;
    public resolvedAttributes: ResolvedAttributeSet;
    public resolvedEntityReferences: ResolvedEntityReferenceSet;
    private t2pm: traitToPropertyMap;
    constructor(resOpt: resolveOptions, entDef: ICdmEntityDef) {
        this.entity = entDef;
        this.resolvedName = this.entity.getName();
        this.resolvedTraits = this.entity.getResolvedTraits(resOpt);
        this.resolvedAttributes = this.entity.getResolvedAttributes(resOpt);
        this.resolvedEntityReferences = this.entity.getResolvedEntityReferences(resOpt);
    }

    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string, nameSort: boolean): void {
        // let bodyCode = () =>
        {
            to.spewLine(`${indent}=====ENTITY=====`);
            to.spewLine(`${indent}${this.resolvedName}`);
            to.spewLine(`${indent}================`);
            to.spewLine(`${indent}traits:`);
            this.resolvedTraits.spew(resOpt, to, `${indent} `, nameSort);
            to.spewLine('attributes:');
            this.resolvedAttributes.spew(resOpt, to, `${indent} `, nameSort);
            to.spewLine('relationships:');
            this.resolvedEntityReferences.spew(resOpt, to, `${indent} `, nameSort);
        }
        // return p.measure(bodyCode);
    }

    private getTraitToPropertyMap(): traitToPropertyMap {
        if (this.t2pm) {
            return this.t2pm;
        }
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForResolvedEntity(this.entity.ctx, this.resolvedTraits);

        return this.t2pm;
    }
}
