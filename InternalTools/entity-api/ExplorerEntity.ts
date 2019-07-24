import * as cdm from "cdm.objectmodel";
import { IExplorerEntity, ResolveOptions, DirectiveSet, IExplorerEntityReference } from "./IExplorerEntity";
import { EntityContainer } from "./EntityContainer";
import { IExplorerDocument } from "./IExplorerDocument";
import { EntityApiUtils } from "./utils";
import { IExplorerResolvedEntity } from "./IExplorerResolvedEntity";
import { ExplorerResolvedEntity } from "./ExplorerResolvedEntity";

export class ExplorerEntity implements IExplorerEntity {

    public get name(): string {
        return this.entity.getName();
    }

    public get path(): string {
        return this.entity.getObjectPath();
    }

    public get declaredIn(): IExplorerDocument {
        return this.entityContainer.getDocument(this.entity.declaredInDocument);
    }

    public entityReferences: IExplorerEntityReference[] = [];
    private resolvedEntityMap: Map<IExplorerDocument, Map<DirectiveSet, IExplorerResolvedEntity>> = new Map<IExplorerDocument, Map<DirectiveSet, IExplorerResolvedEntity>>();

    constructor(public entity: cdm.types.ICdmEntityDef,
        public entityContainer: EntityContainer) {
    }

    public getBaseEntity(resolutionOptions: ResolveOptions): IExplorerEntity {
        let baseEntityRef = this.entity.getExtendsEntityRef();
        if (!baseEntityRef) {
            return null;
        }
        let resOpt = EntityApiUtils.convertOptions(resolutionOptions);
        let baseEntity = baseEntityRef.getObjectDef(resOpt);
        return this.entityContainer.getEntity(baseEntity as cdm.types.ICdmEntityDef);
    }

    public copyData(resolutionOptions: ResolveOptions, copyOptions: any): any {
        let resOpt = EntityApiUtils.convertOptions(resolutionOptions);
        return this.entity.copyData(resOpt, copyOptions);
    }

    public populateReferences() {
        if (!this.entity) {
            return;
        }

        let directives = new cdm.types.TraitDirectiveSet(new Set<string>(["referenceOnly", "normalized"]));
        let resOpt: cdm.types.resolveOptions = { wrtDoc: this.entity.declaredInDocument, directives: directives };
        let resolvedEntity = new ExplorerResolvedEntity(this, resOpt);
        resolvedEntity.entityReferences.forEach(ref => this.entityReferences.push(ref));
        this.entityReferences.forEach(ref => ref.referencedEntity.entityReferences.push(ref));
    }

    public createResolvedEntity(resolutionOptions: ResolveOptions, cache: boolean = true): IExplorerResolvedEntity {
        let resOpt = EntityApiUtils.convertOptions(resolutionOptions);
        if (!cache) {
            return new ExplorerResolvedEntity(this, resOpt);
        }

        if (!this.resolvedEntityMap.has(resolutionOptions.withRespectToDocument)) {
            this.resolvedEntityMap.set(resolutionOptions.withRespectToDocument, new Map<DirectiveSet, IExplorerResolvedEntity>());
        }

        let innerMap = this.resolvedEntityMap.get(resolutionOptions.withRespectToDocument);
        if (innerMap.has(resolutionOptions.directives)) {
            return innerMap.get(resolutionOptions.directives);
        }

        let resolvedEntity = new ExplorerResolvedEntity(this, resOpt);
        innerMap.set(resolutionOptions.directives, resolvedEntity);
        return resolvedEntity;
    }
}