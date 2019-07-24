import * as process from 'process';
import { SchemaLoader } from './schemaLoader';
import {
    IEntityState,
    EntityContainer,
    IRelationship,
    IExplorerEntity,
    getEntityApiClasses
} from "entity-api";
import * as cdm from 'cdm.objectmodel';
import { Tests } from './tests';

let pathToSchemaDocRoot = process.argv[2];

class Startup {
    private static checkInputParams() {
        if (pathToSchemaDocRoot == undefined) {
            pathToSchemaDocRoot = "../testCorpus";
        }
    }

    public static main() {
        Startup.checkInputParams();

        let dir = pathToSchemaDocRoot;
        let schemaLoader = new SchemaLoader();
        let schemas = schemaLoader.run(dir);

        let profiler = new cdm.types.CdmProfiler();
        let classes: any[] = [];
        getEntityApiClasses().forEach(currClass => classes.push(currClass));
        classes.push(Tests);
        profiler.addProfilingCode(classes);
        profiler.on = false;

        let entityContainer = new EntityContainer();
        entityContainer.loadEntitiesFromDocuments("", schemas.hier);
        entityContainer.resolveEntities("", (operation: string) => {
            if (operation == "resolveModeResult") {
                let entityStates: IEntityState[] = Array.from(schemas.idLookup.values());
                let entityPaths = entityStates.map(entState => entState.path + entState.docName + '/' + entState.name)
                let mappedEntities = entityContainer.mapEntities(entityPaths);
                entityStates.forEach((entityState, idx) => {
                    entityState.entity = mappedEntities[idx];
                    entityState.relsIn = new Array<IRelationship>();
                    entityState.referencedEntityNames = new Set<string>();
                    entityState.referencedEntityCache = new Map<IExplorerEntity, boolean>();
                    if (entityState.entity) {
                        entityState.referencedEntityNames = new Set<string>(entityState.entity.entityReferences.filter(ref => ref.referencingEntity == entityState.entity).map(ref => ref.referencedEntity.name));
                    }
                });
                Startup.runTests(entityStates, profiler);
            }
        });
    }


    public static runTests(entityStates: IEntityState[], profiler: cdm.types.CdmProfiler) {
        profiler.on = false;
        let entities = entityStates.filter(entState => entState.entity != null).map(entState => entState.entity);
        const tests = new Tests(profiler, entities);
        const results = tests.runAllTests();
        results.forEach(result => console.log(`${result[0]}: ${result[1]}`));
    }
}

Startup.main();