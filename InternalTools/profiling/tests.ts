import { IExplorerEntity, DirectiveSet, ResolveOptions } from 'entity-api';
import * as cdm from 'cdm.objectmodel';
export class Tests {

    constructor(private profiler: cdm.types.CdmProfiler, private entities: IExplorerEntity[]) {
    }

    public runAllTests() {
        let results = [];
        results.push(['resolveEntity', this.resolveEntity()]);
        results.push(['resolveAllEntitiesWrt', this.resolveAllEntitiesWrt()]);
        return results;
    }


    public resolveEntity(): boolean {
        this.profiler.clearData();
        this.profiler.on = true;

        let entityResolutionTimes = new Array();
        this.entities.forEach(entity => {
            this.profiler.clearData();
            this.resolveEntityHelper(entity);
            const callData = this.profiler.getCallData();
            let data = callData.get('Tests:resolveEntityHelper');
            entityResolutionTimes.push([entity.path, data.timeTotal]);
        });

        this.profiler.on = false;
        let totalTime = entityResolutionTimes.reduce((sum, current) => sum + current[1], 0);
        console.log(`Total time for resolveEntity: ${totalTime}`);
        return totalTime < 5000
    }

    private resolveEntityHelper(entity: IExplorerEntity) {
        let resOpt: ResolveOptions = {
            withRespectToDocument: entity.declaredIn,
            directives: DirectiveSet.ReferenceOnly | DirectiveSet.Normalized
        };
        entity.createResolvedEntity(resOpt);
    }

    public resolveAllEntitiesWrt(): boolean {
        this.profiler.clearData();
        this.profiler.on = true;

        let entityResolutionTimes = new Array();
        this.entities.forEach(entity => {
            this.profiler.clearData();
            this.resolveAllEntitiesWrtHelper(entity);
            const callData = this.profiler.getCallData();
            let data = callData.get('Tests:resolveAllEntitiesWrtHelper');
            entityResolutionTimes.push([entity.path, data.timeTotal]);
        });

        this.profiler.on = false;
        entityResolutionTimes.sort((lhs, rhs) => rhs[1] - lhs[1]);
        let totalTime = entityResolutionTimes.reduce((sum, current) => sum + current[1], 0);
        console.log(`Total time for resolveEntityWrt: ${totalTime}`);
        console.log(`${entityResolutionTimes[0][0]} resolution time: ${entityResolutionTimes[0][1]}`)
        return entityResolutionTimes[0][1] < 5000 && totalTime < 150000
    }

    private resolveAllEntitiesWrtHelper(entity: IExplorerEntity) {
        let resOpt: ResolveOptions = {
            withRespectToDocument: entity.declaredIn,
            directives: DirectiveSet.ReferenceOnly | DirectiveSet.Normalized
        };
        let referencedEntities = new Set<IExplorerEntity>();
        entity.entityReferences.filter(ref => ref.referencedEntity == entity).forEach(ref => referencedEntities.add(ref.referencingEntity));
        referencedEntities.forEach(currEntity => currEntity.createResolvedEntity(resOpt, false));
    }
}