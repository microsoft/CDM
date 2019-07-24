import * as cdm from "cdm.objectmodel";
import { writeFileSync, mkdirSync, existsSync } from "fs";

let rootFolderName = process.argv[2];
let pathToDocRootParam = process.argv[3];

// Parts of the class similar to the testDriver class so far, but many parts of this class  might be removed in the future.
class Startup {
    public static main(): number {

        let cdmCorpus: cdm.types.ICdmCorpusDef;

        let pathToDocRoot: string;
        let docGroup: string;

        if (rootFolderName === undefined || rootFolderName.length == 0) {
            // Using this just for testing purposes.
            rootFolderName = "docs";
        }

        if (pathToDocRootParam !== undefined && pathToDocRootParam.length > 0){
            pathToDocRoot = pathToDocRootParam;
            docGroup = process.argv[4];
        }
        else {
            // Using this just for testing purposes.
            pathToDocRoot = "../../testCorpus";
            docGroup = "/";
        }
        
        cdmCorpus = cdm.types.NewCorpus(pathToDocRoot);
        cdmCorpus.setResolutionCallback(cdm.loc.consoleStatusReport, cdm.types.cdmStatusLevel.progress, cdm.types.cdmStatusLevel.error);

        cdm.loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder(docGroup), ["analyticalCommon"], "");
        cdm.loc.resolveLocalCorpus(cdmCorpus, cdm.types.cdmValidationStep.minimumForResolving).then((r: boolean) => {
            let directives = new cdm.types.TraitDirectiveSet(new Set<string>(["normalized", "referenceOnly"]));
            this.processEntities(cdmCorpus, directives);
        }).catch();

        return 0;
    }

    // Creates folder if it doesnt exist.
    private static createFolderIfDoesntExist(folder : cdm.types.ICdmFolderDef) {
        let path = Startup.getFolderRelativePathWithoutPrecedingSlashes(folder);

        // Split to path to create each folder separately.
        let folders = path.split('/');
        let tmpPath = '';

        folders.forEach( (folder) => {
            if (folder != '') {
                tmpPath = tmpPath + folder + '/';
                if (!existsSync(tmpPath)){
                    mkdirSync(tmpPath);

                    // Create overview files for every directory.
                    this.createMdFile(folder, tmpPath + '/overview.md');
                }
            }
        });
    }

    // Removes preceding slashes from the path name.
    private static getFolderRelativePathWithoutPrecedingSlashes(folder) {
        let path = folder.getRelativePath();
        while (path[0] == '/') {
            path = path.substring(1);
        }

        return rootFolderName + '/' + path;
    }

    private static createMdFile(entName : string, entPath : string) {
        let spew = new cdm.types.stringSpewCatcher();

        spew.spewLine("---");
        spew.spewLine("title: " + entName);
        spew.spewLine("description: some description");
        spew.spewLine("ms.service:: common-data-model");
        spew.spewLine("ms.reviewer: anneta");
        spew.spewLine("ms.topic: article");
        spew.spewLine("ms.date: " + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCDate() + "/" + new Date().getUTCFullYear());
        spew.spewLine("ms.author: tpalmer");
        spew.spewLine("---");

        // TODO: Add other stuff to the entity.
        
        writeFileSync(entPath, spew.getContent(), "utf8");
        spew.clear();
    }

    // Processes entities and creates the md doc file for each one.
    public static processEntities(cdmCorpus: cdm.types.ICdmCorpusDef, directives: cdm.types.TraitDirectiveSet) {
        let seekEntities = (folder: cdm.types.ICdmFolderDef) => {
            if (folder.getName() != "" && folder.getDocuments() && folder.getDocuments().length) {
                Startup.createFolderIfDoesntExist(folder);
                folder.getDocuments().sort((l, r) => l.getName().localeCompare(r.getName())).forEach(doc => {
                    if (doc.getDefinitions() && doc.getDefinitions().length)
                        doc.getDefinitions().forEach(def => {
                            if (def.getObjectType() == cdm.types.cdmObjectType.entityDef) {
                                
                                let resOpt: cdm.types.resolveOptions = { wrtDoc: doc, directives: directives };
                                let ent = (def as cdm.types.ICdmEntityDef).createResolvedEntity(resOpt, def.getName() + '_');

                                // Remove the last character from the name.
                                let entName = ent.getName().substring(0, ent.getName().length - 1);
                                let entPath = Startup.getFolderRelativePathWithoutPrecedingSlashes(folder) + entName + '.md';
                                Startup.createMdFile(entName, entPath);
                            }
                        });
                });
            }
            if (folder.getSubFolders()) {
                folder.getSubFolders().sort((l, r) => l.getName().localeCompare(r.getName())).forEach(f => {
                    seekEntities(f);
                });
            }
        }

        seekEntities(cdmCorpus);
    }
}

console.log("The return value is " + Startup.main());