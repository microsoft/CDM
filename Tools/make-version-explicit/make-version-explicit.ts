import * as cdm from "../cdm-types/cdm-types"
import * as loc from "../local-corpus/local-corpus";
import { writeFileSync, mkdirSync, existsSync } from "fs";


class Startup {
    public static main(): number {

        let cdmCorpus : cdm.Corpus;
        let pathToDocRoot = "../../schemaDocuments";

        // run over input folders recursively and process them into a hierarchical corpus of schema docs
        cdmCorpus = new cdm.Corpus(pathToDocRoot);
        cdmCorpus.setResolutionCallback(loc.consoleStatusReport, cdm.cdmStatusLevel.progress, cdm.cdmStatusLevel.error);
        console.log('reading source files');
        loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"), ["analyticalCommon"], "");

        let statusRpt = loc.consoleStatusReport;

        loc.resolveLocalCorpus(cdmCorpus, cdm.cdmValidationStep.finished).then((r:boolean) =>{
            this.makeVersionExplicitCopy(cdmCorpus, "0.7");
            loc.persistCorpus(cdmCorpus);
            console.log('done');

        }).catch();
        
        return 0;
    }

    public static makeVersionExplicitCopy(cdmCorpus : cdm.Corpus, version : string) {

        let addVersionToName = (name : string, version : string) : string => {
            name = name.slice(0, name.length - "cdm.json".length);
            name += version + ".cdm.json";
            return name;
        }

        let versionDocsInFolders = (folder : cdm.ICdmFolderDef) => {
            let documents = folder.getDocuments();
            if (documents && documents.length)
            {
                documents.forEach(doc => {
                    doc.setName(addVersionToName(doc.getName(), version));
                    let imports = doc.getImports();
                    if (imports && imports.length) {
                        imports.forEach(imp => {
                            imp.uri = addVersionToName(imp.uri, version);
                        });
                    }
                    let definitions = doc.getDefinitions();
                    if (definitions && definitions.length) {
                        definitions.forEach(def => {
                            if (def.getObjectType() == cdm.cdmObjectType.entityDef) {
                                // if the entity is already expressing a version trait, then explicitly exhibit one from the entity with the fixed value
                                // except for the baseclass 
                                let ent = def as cdm.ICdmEntityDef;
                                if (ent.getName() != "CdmObject" && ent.getResolvedTraits(doc) && ent.getResolvedTraits(doc).find(doc, "is.CDM.entityVersion")) {
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
        }
    
        versionDocsInFolders(cdmCorpus);
    }
}

Startup.main(); 