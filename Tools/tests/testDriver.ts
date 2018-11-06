import * as cdm from "../../lib/cdm-types"
import * as loc from "../../lib/local-corpus";
import { writeFileSync, mkdirSync, existsSync } from "fs";


class Startup {
    public static main(): number {

        let cdmCorpus : cdm.Corpus;
        let testCorpus = false;
        let resolveEnt = false;
        let pathToDocRoot : string;
        if (testCorpus)
            pathToDocRoot = "../../testCorpus";
        else
            pathToDocRoot = "../../schemaDocuments";

        let version = "";
        //let version = "0.7"; // explicitly use the explicit version docs to get versioned schema refs too

        cdmCorpus = new cdm.Corpus(pathToDocRoot);
        cdmCorpus.setResolutionCallback(loc.consoleStatusReport, cdm.cdmStatusLevel.progress, cdm.cdmStatusLevel.error);
        console.log('reading source files');
        if (testCorpus)
            loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("E2EResolution"), ["analyticalCommon"], version); 
        else
            loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"), ["analyticalCommon"], version); 

        loc.resolveLocalCorpus(cdmCorpus, cdm.cdmValidationStep.finished).then((r:boolean) =>{

            let directives = new cdm.TraitDirectiveSet(new Set<string>
                    (["xnormalized", "structured","referenceOnly"]));
            
            if (resolveEnt) {
                let ent: cdm.ICdmEntityDef;
                if (testCorpus)
                    ent = cdmCorpus.getObjectFromCorpusPath("/E2EResolution/E2EArrayOne.cdm.json/E2EArrayOne") as cdm.ICdmEntityDef;
                else
                    ent = cdmCorpus.getObjectFromCorpusPath("/core/applicationCommon/foundationCommon/Account.cdm.json/Account") as cdm.ICdmEntityDef;

                let resOpt: cdm.resolveOptions = {wrtDoc: ent.declaredInDocument, directives: directives};
                let x = ent.createResolvedEntity(resOpt, "RESOLVED_KILL");
                resOpt.wrtDoc = x.declaredInDocument;
                loc.persistDocument(cdmCorpus.rootPath, resOpt, {stringRefs:false, removeSingleRowLocalizedTableTraits:true});
            }

            console.log('list all resolved');
            directives = new cdm.TraitDirectiveSet(new Set<string>(["normalized","referenceOnly"])); // the default from before.
            this.listAllResolved(cdmCorpus, directives);
            console.log('done');

        }).catch();
        
        return 0;
    }

    public static listAllResolved(cdmCorpus : cdm.Corpus, directives: cdm.TraitDirectiveSet) {
        let seen = new Set<string>();
        let spew = new cdm.stringSpewCatcher();

        let seekEntities = (folder : cdm.ICdmFolderDef) => {
            if (folder.getName() != "" && folder.getDocuments() && folder.getDocuments().length)
            {
                spew.spewLine(folder.getRelativePath());
                folder.getDocuments().sort((l, r) => l.getName().localeCompare(r.getName())).forEach(doc => {
                    if (doc.getDefinitions() && doc.getDefinitions().length)
                        doc.getDefinitions().forEach(def => {
                            if (def.getObjectType() == cdm.cdmObjectType.entityDef) {
                                let resOpt: cdm.resolveOptions = {wrtDoc: doc, directives: directives};
                                let ent = (def as cdm.ICdmEntityDef).getResolvedEntity(resOpt);
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