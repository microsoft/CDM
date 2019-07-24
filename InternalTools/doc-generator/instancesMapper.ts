import { IExplorerEntity, ResolveOptions, DirectiveSet } from "entity-api";

export class InstancesMapper {
    private static idInstancesMap: Map<number, Array<string>>;
    private static entityPathIdMap: Map<string, number>;

    public static createInstancesMap(mappedEntities: IExplorerEntity[]) {
        let id = 0;
        InstancesMapper.entityPathIdMap = new Map();
        InstancesMapper.idInstancesMap = new Map();

        mappedEntities.forEach((entity) => {
            if (!entity) {
                return;
            }
            
            let childEntities = new Array();
            while (true) {
                if (InstancesMapper.entityPathIdMap.has(entity.path)) {
                    // Already in entityPathMap, add to same id group.
                    let tempId = InstancesMapper.entityPathIdMap.get(entity.path);
                    childEntities.forEach((childEntity) => {
                        InstancesMapper.idInstancesMap.get(tempId).push(childEntity);
                        InstancesMapper.entityPathIdMap.set(childEntity, tempId);
                    });
                    break;
                } else {
                    childEntities.push(entity.path);
                    let resOpt: ResolveOptions = {
                        withRespectToDocument: entity.declaredIn,
                        directives: DirectiveSet.ReferenceOnly | DirectiveSet.Normalized
                    };
                    let baseEntity = entity.getBaseEntity(resOpt);
                    if (!baseEntity) {
                        // If no parent, add to a new id group.
                        InstancesMapper.idInstancesMap.set(id, childEntities);
                        childEntities.forEach((childEntity) => {
                            InstancesMapper.entityPathIdMap.set(childEntity, id);
                        });
                        id++;
                        break;
                    } else {
                        entity = baseEntity;
                    }
                }
            }
        });
        console.log("Instances map generated.");
    }

    public static getInstances(entityPath: string) : string[] {
        let id = InstancesMapper.entityPathIdMap.get(entityPath);
        return InstancesMapper.idInstancesMap.get(id);
    }
}