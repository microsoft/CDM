import * as cdm from "cdm.objectmodel";
import { IExplorerTypeAttribute } from "./IExplorerTypeAttribute";
import { IExplorerTrait } from "./IExplorerTrait";
import { ExplorerTrait } from "./ExplorerTrait";
import { EntityContainer } from "./EntityContainer";
import { IConstantEntityArgumentValues } from "./IExplorerArgumentValue";
import { IExplorerResolvedEntity } from "./IExplorerResolvedEntity";
import { IExplorerEntityReference, ResolveOptions } from "./IExplorerEntity";
import { EntityApiUtils } from "./utils";

export class ExplorerTypeAttribute implements IExplorerTypeAttribute {

    public get name(): string {
        return this.attribute.getName();
    }

    public get resolvedName(): string {
        return this.name;
    }

    public get displayName(): string {
        return this.attribute.displayName;
    }

    public get description(): string {
        return this.attribute.description;
    }

    public get isPrimaryKey(): boolean {
        return this.attribute.isPrimaryKey;
    }

    public get dataFormat(): string {
        return this.attribute.dataFormat;
    }

    public get maximumLength(): number {
        return this.attribute.maximumLength;
    }

    public get maximumValue(): string {
        return this.attribute.maximumValue;
    }

    public get minimumValue(): string {
        return this.attribute.minimumValue;
    }

    public get isReadOnly(): boolean {
        return this.attribute.isReadOnly;
    }

    public get isNullable(): boolean {
        return this.attribute.isNullable;
    }

    public get sourceName(): string {
        return this.attribute.sourceName;
    }

    public get valueConstrainedToList(): boolean {
        return this.attribute.valueConstrainedToList;
    }

    public get defaultValue(): any {
        return this.attribute.defaultValue;
    }

    public get isAttributeGroup(): boolean {
        return false;
    }

    public traits: IExplorerTrait[];
    public entityReferences: IExplorerEntityReference[];
    public isInherited: boolean;
    constructor(public attribute: cdm.types.ICdmTypeAttributeDef, public resOpt: cdm.types.resolveOptions, public resolvedEntity: IExplorerResolvedEntity, public entityContainer: EntityContainer) {
        this.attribute.getAppliedTraitRefs();
        this.traits = this.attribute.getAppliedTraitRefs().map(trait => new ExplorerTrait(trait, resOpt, entityContainer));
        this.entityReferences = new Array<IExplorerEntityReference>();
        
        let attContextPath = this.attribute.attributeContext.getObjectDefName();
        let extendPath = `${this.resolvedEntity.name}/attributeContext/${this.resolvedEntity.name}/extends/`;
        this.isInherited = attContextPath.startsWith(extendPath);

        let referenceTrait = this.traits.find(trait => trait.name == "is.linkedEntity.identifier");
        if (!referenceTrait || referenceTrait.arguments.length != 1) {
            return;
        }

        let references = (referenceTrait.arguments[0]).value.argumentValue as IConstantEntityArgumentValues;
        references.constantValues.forEach(ref => {
            let referencedEntity = this.entityContainer.getEntityByPath(ref[0]);
            if (referencedEntity == undefined) {
                return;
            }
            this.entityReferences.push(<IExplorerEntityReference>{
                referencingEntity: this.resolvedEntity.explorerEntity,
                referencingAttributeName: this.name,
                referencedEntity: referencedEntity,
                referencedAttributeName: ref[1]
            });
        });
    }

    public copyData(resolutionOptions: ResolveOptions, copyOptions: any): any {
        let resOpt = EntityApiUtils.convertOptions(resolutionOptions);
        return this.attribute.copyData(resOpt, copyOptions);
    }
}