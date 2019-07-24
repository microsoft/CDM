import * as cdm from "cdm.objectmodel";
import { ExplorerAttributeGroup } from "./ExplorerAttributeGroup";
import { ExplorerTypeAttribute } from "./ExplorerTypeAttribute";
import { EntityContainer } from "./EntityContainer";
import { IExplorerResolvedEntity } from "./IExplorerResolvedEntity";

export class ExplorerAttributeBase {
    public static createExplorerAttribute(attribute: cdm.types.ICdmTypeAttributeDef | cdm.types.ICdmEntityAttributeDef | cdm.types.ICdmAttributeGroupRef, resOpt: cdm.types.resolveOptions, resolvedEntity: IExplorerResolvedEntity, entityContainer: EntityContainer) {
        let attributeType = attribute.getObjectType();
        if (attributeType == cdm.types.cdmObjectType.attributeGroupRef) {
            return new ExplorerAttributeGroup((attribute as cdm.types.ICdmAttributeGroupRef), resOpt, resolvedEntity, entityContainer);
        } else {
            return new ExplorerTypeAttribute((attribute as cdm.types.ICdmTypeAttributeDef), resOpt, resolvedEntity, entityContainer);
        }
    }
}