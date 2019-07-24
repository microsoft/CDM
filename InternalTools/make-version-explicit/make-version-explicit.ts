import * as cdm from "cdm.objectmodel";

class Startup {
    public static main(): number {

        let cdmCorpus : cdm.types.ICdmCorpusDef;
        let newVersion = "0.8.2";
        let pathToDocRoot = "../../CDM.SchemaDocuments";

        if (process.argv.length > 2) {
            newVersion = process.argv[2];
        }
        if (process.argv.length > 3) {
            pathToDocRoot = process.argv[3];
        }

        // run over input folders recursively and process them into a hierarchical corpus of schema docs
        cdmCorpus = cdm.types.NewCorpus(pathToDocRoot);
        cdmCorpus.setResolutionCallback(cdm.loc.consoleStatusReport, cdm.types.cdmStatusLevel.progress, cdm.types.cdmStatusLevel.error);
        console.log("reading source files");
        cdm.loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"), ["analyticalCommon"], "");

        let directives = new cdm.types.TraitDirectiveSet(new Set<string>(["normalized", "referenceOnly"]));

        cdm.loc.resolveLocalCorpus(cdmCorpus, cdm.types.cdmValidationStep.finished).then((r:boolean) => {
            this.makeVersionExplicitCopy(cdmCorpus, newVersion);
            cdm.loc.persistCorpus(cdmCorpus, directives);
            console.log("done");

        }).catch();

        return 0;
    }

    public static makeVersionExplicitCopy(cdmCorpus : cdm.types.ICdmCorpusDef, version : string) {

        let directives = new cdm.types.TraitDirectiveSet(new Set<string>(["normalized", "referenceOnly"]));

        let addVersionToName = (name : string, version : string): string => {
            name = name.slice(0, name.length - "cdm.json".length);
            name += version + ".cdm.json";
            return name;
        };

        let versionDocsInFolders = (folder : cdm.types.ICdmFolderDef) => {
            let documents = folder.getDocuments();
            if (documents && documents.length) {
                documents.forEach(doc => {
                    doc.setName(addVersionToName(doc.getName(), version));
                    let imports = doc.getImports();
                    if (imports && imports.length) {
                        imports.forEach(imp => {
                            imp.corpusPath = addVersionToName(imp.corpusPath, version);
                        });
                    }
                    let resOpt: cdm.types.resolveOptions = {wrtDoc: doc, directives: directives};
                    let definitions = doc.getDefinitions();
                    if (definitions && definitions.length) {
                        definitions.forEach(def => {
                            if (def.getObjectType() === cdm.types.cdmObjectType.entityDef) {
                                // if the entity is already expressing a version trait,
                                // then explicitly exhibit one from the entity with the fixed value
                                // except for the baseclass
                                let ent = def as cdm.types.ICdmEntityDef;
                                if (ent.getName() !== "CdmObject"
                                && ent.getResolvedTraits(resOpt) && ent.getResolvedTraits(resOpt).find(resOpt, "is.CDM.entityVersion")) {
                                    let tRef = ent.addExhibitedTrait("is.CDM.entityVersion", false);
                                    tRef.addArgument(undefined, version);
                                }
                            }
                        });
                    }
                });
            }
            if (folder.getSubFolders()) {
                folder.getSubFolders().forEach(f => {
                    versionDocsInFolders(f);
                });
            }
        };

        versionDocsInFolders(cdmCorpus);
    }
}

Startup.main();