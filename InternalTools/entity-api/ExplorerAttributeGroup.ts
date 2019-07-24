import * as cdm from "cdm.objectmodel";
import { IExplorerAttributeGroup } from "./IExplorerAttributeGroup";
import { ExplorerAttributeBase } from "./ExplorerAttributeBase";
import { IExplorerAttributeBase } from "./IExplorerAttributeBase";
import { EntityContainer } from "./EntityContainer";
import { IExplorerResolvedEntity } from "./IExplorerResolvedEntity";
import { IExplorerEntityReference } from "./IExplorerEntity";

export class ExplorerAttributeGroup implements IExplorerAttributeGroup {

    public get isAttributeGroup() {
        return true;
    }

    public attributes: IExplorerAttributeBase[] = [];
    public entityReferences: IExplorerEntityReference[] = [];
    constructor(public attributeGroup: cdm.types.ICdmAttributeGroupRef, public resOpt: cdm.types.resolveOptions, public resolvedEntity: IExplorerResolvedEntity, public entityContainer: EntityContainer) {
        let attributeGroupDef = (this.attributeGroup.getObjectDef(resOpt) as cdm.types.ICdmAttributeGroupDef).getMembersAttributeDefs();
        this.attributes = attributeGroupDef.map(attribute => ExplorerAttributeBase.createExplorerAttribute(attribute, resOpt, resolvedEntity, entityContainer));
        this.attributes.forEach(att => att.entityReferences.forEach(ref => this.entityReferences.push(ref)));
    }
}