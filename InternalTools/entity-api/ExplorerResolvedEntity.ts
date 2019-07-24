import * as cdm from "cdm.objectmodel";
import { IExplorerResolvedEntity } from "./IExplorerResolvedEntity";
import { EntityContainer } from "./EntityContainer";
import { ResolveOptions, IExplorerEntityReference } from "./IExplorerEntity";
import { IExplorerTrait } from "./IExplorerTrait";
import { ExplorerTrait } from "./ExplorerTrait";
import { ExplorerEntity } from "./ExplorerEntity";
import { ExplorerAttributeBase } from "./ExplorerAttributeBase";
import { EntityApiUtils } from "./utils";
import { IExplorerAttributeBase } from "./IExplorerAttributeBase";

export class ExplorerResolvedEntity implements IExplorerResolvedEntity {

    public get name(): string {
        return this.resolvedEntity.getName();
    }

    public get displayName(): string {
        return this.resolvedEntity.displayName;
    }

    public get description(): string {
        return this.resolvedEntity.description;
    }

    public get version(): string {
        return this.resolvedEntity.version;
    }

    public get cdmSchemas(): string[] {
        return this.resolvedEntity.cdmSchemas;
    }

    public get sourceName(): string {
        return this.resolvedEntity.sourceName;
    }

    public traits: IExplorerTrait[] = [];
    public attributes: IExplorerAttributeBase[] = [];

    public resolvedEntity: cdm.types.ICdmEntityDef;
    public entityContainer: EntityContainer;
    public entityReferences: IExplorerEntityReference[] = [];

    public constructor(public explorerEntity: ExplorerEntity, public resOpt: cdm.types.resolveOptions) {
        this.entityContainer = this.explorerEntity.entityContainer;
        this.resolvedEntity = this.explorerEntity.entity.createResolvedEntity(resOpt, this.explorerEntity.entity.getName() + "_");

        this.attributes = this.resolvedEntity.getHasAttributeDefs().map(attribute => ExplorerAttributeBase.createExplorerAttribute(attribute, resOpt, this, this.entityContainer));
        this.attributes.forEach(att => att.entityReferences.forEach(ref => this.entityReferences.push(ref)));

        if (this.resolvedEntity.getExhibitedTraitRefs()) {
            this.traits = this.resolvedEntity.getExhibitedTraitRefs().map(trait => new ExplorerTrait(trait, resOpt, this.entityContainer));
        }
    }

    public copyData(resolutionOptions: ResolveOptions, copyOptions: any) {
        let resOpt = EntityApiUtils.convertOptions(resolutionOptions);
        return this.resolvedEntity.copyData(resOpt, copyOptions);
    }
}