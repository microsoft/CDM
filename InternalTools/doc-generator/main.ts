import * as path from "path";
import * as process from 'process'
import * as utils from "./utils";
import { DocGenerator } from "./docGenerator";
import { SchemaLoader } from "./schemaLoader";
import { InstancesMapper } from './instancesMapper';
import { OverviewGenerator } from './overviewGenerator';
import {
    IEntityState, EntityContainer, IRelationship, IExplorerEntity
} from "entity-api";
import { docStrings } from "./configHelper";

let pathToSchemaDocRoot = process.argv[2]; 
let targetFolderPath = process.argv[3];
let docsBranch = process.argv[4];
let languageSetting = process.argv[5];

class Startup {
    private static checkInputParams(){
        if(pathToSchemaDocRoot == undefined) {
            pathToSchemaDocRoot = "../testCorpus/";
        }

        if(targetFolderPath == undefined) {
            targetFolderPath = "docs";
        }

        if (docsBranch == undefined) {
            docsBranch = "trunorth-testing-2";
        }

        if(languageSetting == undefined) {
            languageSetting = "en";
        }
    }

    public static main() : number {
        Startup.checkInputParams();
        
        let dir = pathToSchemaDocRoot;
        let schemaLoader = new SchemaLoader();
        let schemas = schemaLoader.run(dir);

        let entityContainer = new EntityContainer();
        entityContainer.loadEntitiesFromDocuments("", schemas.hier);

        entityContainer.resolveEntities("", (operation: string) => {
            if (operation == "resolveModeResult") {
                let entityStates: IEntityState[] = Array.from(schemas.idLookup.values());
                let entityPaths = entityStates.map(entState => entState.path + entState.docName + '/' + entState.name)
                let mappedEntities = entityContainer.mapEntities(entityPaths);
                InstancesMapper.createInstancesMap(mappedEntities);

                DocGenerator.init(languageSetting);
                entityStates.forEach((entityState, idx) => {
                    entityState.entity = mappedEntities[idx];
                    entityState.relsIn = new Array<IRelationship>();
                    entityState.referencedEntityNames = new Set<string>();
                    entityState.referencedEntityCache = new Map<IExplorerEntity, boolean>();
                    if (entityState.entity) {
                        entityState.referencedEntityNames = new Set<string>(entityState.entity.entityReferences.filter(ref => ref.referencingEntity == entityState.entity).map(ref => ref.referencedEntity.name));
                    }
                    let cdmObject = entityState.entity;

                    if (cdmObject) {
                        let entPath = path.resolve(targetFolderPath, utils.generateMdPath(cdmObject.path));
                        DocGenerator.run(cdmObject, entPath);
                    }
                });

                // Marker FullRun: change third parameter here to switch between test run and full run.
                OverviewGenerator.run(targetFolderPath, 13, true, docsBranch);
            }
        });

        return 0;
    }
}

console.log("The return value is " + Startup.main());