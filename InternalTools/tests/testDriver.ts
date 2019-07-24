import * as cdm from "cdm.objectmodel";
import { writeFileSync, mkdirSync, existsSync } from "fs";

let pathToDocRootParam = process.argv[2];

class Startup {
    public static main(): number {

        let cdmCorpus: cdm.types.ICdmCorpusDef;
        let testCorpus = true;
        let perfTest = false;
        let resolveEnt = false;
        let spewAll = true;

        let pathToDocRoot: string;
        let docGroup: string;
        let testEnt: string;

        if (pathToDocRootParam && pathToDocRootParam.trim().length > 0){
            pathToDocRoot = pathToDocRootParam;
            docGroup = process.argv[3];
            testEnt = process.argv[4];
        }
        else {
            if (testCorpus) {
                pathToDocRoot = "../testCorpus";
                //docGroup = "E2EResolution";
                //docGroup = "POVResolution";
                docGroup = "MiniDyn";
                //testEnt = "/E2EResolution/E2EArrayOne.cdm.json/E2EArrayOne";
                //testEnt = "/MiniDyn/sub/Lead.cdm.json/Lead";
                //testEnt = "/POVResolution/sub1/Main.cdm.json/Main"
                testEnt = "/MiniDyn/Account.cdm.json/Account";
            }
            else {
                // TODO: confirm and fix this.
                pathToDocRoot = "../../schemaDocuments";
                docGroup = "core";
                testEnt = "/core/applicationCommon/foundationCommon/crmCommon/Account.cdm.json/Account";
            }
        }

        let version = "";
        //let version = "0.8"; // explicitly use the explicit version docs to get versioned schema refs too

        cdmCorpus = cdm.types.NewCorpus(pathToDocRoot);
        cdmCorpus.setResolutionCallback(cdm.loc.consoleStatusReport, cdm.types.cdmStatusLevel.progress, cdm.types.cdmStatusLevel.error);
        console.log('reading source files');
        cdm.loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder(docGroup), ["analyticalCommon"], version);
        cdm.loc.resolveLocalCorpus(cdmCorpus, cdm.types.cdmValidationStep.minimumForResolving).then((r: boolean) => {

            if (perfTest) {
                console.log('profile Start');
                let startTime = Date.now();
                cdmCorpus.profiler.on = true;
                let directives = new cdm.types.TraitDirectiveSet(new Set<string>(["normalized", "referenceOnly"])); // the default from before.
                this.getAllAtts(cdmCorpus, directives);
                cdmCorpus.profiler.on = false;
                console.log('profile End');
                console.log(Date.now() - startTime);
                cdmCorpus.profiler.report();
            }

            if (resolveEnt) {
                let directives = new cdm.types.TraitDirectiveSet(new Set<string>
                    //                (["normalized", "xstructured","referenceOnly"]));
                    (["normalized", "referenceOnly"]));

                let ent: cdm.types.ICdmEntityDef;
                ent = cdmCorpus.getObjectFromCorpusPath(testEnt) as cdm.types.ICdmEntityDef;
                let resOpt: cdm.types.resolveOptions = { wrtDoc: ent.declaredInDocument, directives: directives };
                let x = ent.createResolvedEntity(resOpt, "RESOLVED_KILL");
                cdm.loc.persistDocument(cdmCorpus.rootPath, resOpt, { stringRefs: false, removeSingleRowLocalizedTableTraits: true });
            }

            if (spewAll) {
                console.log('list all resolved');
                let directives = new cdm.types.TraitDirectiveSet(new Set<string>(["normalized", "referenceOnly"])); // the default from before.
                this.listAllResolved(cdmCorpus, directives);
                console.log('done');
            }

        }).catch();

        return 0;
    }

    public static getAllAtts(cdmCorpus: cdm.types.ICdmCorpusDef, directives: cdm.types.TraitDirectiveSet) {
        let seen = new Set<string>();

        let seekEntities = (folder: cdm.types.ICdmFolderDef) => {
            if (folder.getName() != "" && folder.getDocuments() && folder.getDocuments().length) {
                folder.getDocuments().sort((l, r) => l.getName().localeCompare(r.getName())).forEach(doc => {
                    if (doc.getDefinitions() && doc.getDefinitions().length)
                        doc.getDefinitions().forEach(def => {
                            if (def.getObjectType() == cdm.types.cdmObjectType.entityDef) {
                                let resOpt: cdm.types.resolveOptions = { wrtDoc: doc, directives: directives };
                                let atts = (def as cdm.types.ICdmEntityDef).getResolvedAttributes(resOpt);
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

    public static listAllResolved(cdmCorpus: cdm.types.ICdmCorpusDef, directives: cdm.types.TraitDirectiveSet) {
        let seen = new Set<string>();
        let spew = new cdm.types.stringSpewCatcher();

        let seekEntities = (folder: cdm.types.ICdmFolderDef) => {
            if (folder.getName() != "" && folder.getDocuments() && folder.getDocuments().length) {
                spew.spewLine(folder.getRelativePath());
                folder.getDocuments().sort((l, r) => l.getName().localeCompare(r.getName())).forEach(doc => {
                    if (doc.getDefinitions() && doc.getDefinitions().length)
                        doc.getDefinitions().forEach(def => {
                            if (def.getObjectType() == cdm.types.cdmObjectType.entityDef) {
                                let resOpt: cdm.types.resolveOptions = { wrtDoc: doc, directives: directives };
                                let ent = (def as cdm.types.ICdmEntityDef).getResolvedEntity(resOpt);
                                ent.spew(resOpt, spew, " ", true);
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
        writeFileSync("allResolved.txt", spew.getContent(), "utf8");

    }
}

Startup.main(); 