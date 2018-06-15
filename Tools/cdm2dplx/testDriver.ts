import * as cdm from "../cdm-types/cdm-types"
import * as cdm2dplx from "../cdm2dplx/cdm2dplx"
import * as ghc from "../github-pages-gen/gh-content-gen"
import { readFileSync, writeFileSync, readFile, mkdirSync, existsSync, createReadStream, readdirSync, statSync } from "fs";


class Startup {
    public static main(): number {

        let cdmCorpus : cdm.Corpus;
        let pathToDocRoot = "../../schemaDocuments";

        // run over input folders recursively and process them into a hierarchical corpus of schema docs
        cdmCorpus = new cdm.Corpus(pathToDocRoot);
        cdmCorpus.statusLevel = cdm.cdmStatusLevel.progress;
        console.log('reading source files');
        ghc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"));

        let statusRpt = (level: cdm.cdmStatusLevel, msg : string, path : string)=> {
            if (level == cdm.cdmStatusLevel.error || level == cdm.cdmStatusLevel.warning)
                console.log(`${(level==cdm.cdmStatusLevel.error) ? "Err" : "Wrn"}: ${msg} @ ${path}`) ;
            else if (level == cdm.cdmStatusLevel.progress)
                console.log(msg);
        }

        ghc.resolveLocalCorpus(cdmCorpus, statusRpt).then((r:boolean) =>{

            this.createTestDplx(cdmCorpus);
            //this.createEachDplx(cdmCorpus, ".");

            console.log('done');

        }).catch();
        
        return 0;
    }

    public static createTestDplx(cdmCorpus : cdm.Corpus) {
        let converter = new cdm2dplx.Converter() as cdm2dplx.IConvertToDplx;
        converter.bindingType="byol"
        converter.relationshipsType="inclusive";
        converter.schemaUriBase = "";
        let set = new Array<cdm.ICdmEntityDef>();

        let ent = cdmCorpus.getObjectFromCorpusPath("/core/applicationCommon/foundationCommon/crmCommon/Account.cdm.json/Account") as cdm.ICdmEntityDef;

        // ignore this, just testing out the 'search for atts from traits' function
        let s = ent.getAttributesWithTraits(["is.dataFormat.floatingPoint","means.location.longitude"]);
        s = ent.getAttributesWithTraits("means.reference");
        s = ent.getAttributesWithTraits({traitBaseName:"is.requiredAtLevel", params : [{paramName : "level", paramValue : "systemrequired"}]});


        set.push(ent);
        set.push(cdmCorpus.getObjectFromCorpusPath("/core/applicationCommon/foundationCommon/crmCommon/Lead.cdm.json/Lead") as cdm.ICdmEntityDef);
        let dplx = converter.convertEntities(set, "ExampleDataPool");
    }

    public static createEachDplx(cdmCorpus : cdm.Corpus, outRoot : string) {
        let converter = new cdm2dplx.Converter() as cdm2dplx.IConvertToDplx;
        converter.bindingType="none"
        converter.relationshipsType="all";
        converter.schemaUriBase = "https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments";

        let dplxFolders = (folder : cdm.ICdmFolderDef) => {

            let folderPath = outRoot + folder.getRelativePath();
            if (!existsSync(folderPath))
                mkdirSync(folderPath);

            if (folder.getName() != "" && folder.getDocuments() && folder.getDocuments().length)
            {
                if (folder.getDocuments())
                    folder.getDocuments().forEach(doc => {
                        if (doc.getDefinitions() && doc.getDefinitions().length)
                            doc.getDefinitions().forEach(def => {
                                if (def.getObjectType() == cdm.cdmObjectType.entityDef) {
                                    let ent = def as cdm.ICdmEntityDef;
                                    let dplx = converter.convertEntities([ent], "ReferenceDataPool" + ent.getObjectPath().replace(/(\/)/g, "."));
                                    let content = JSON.stringify(dplx, null, 2);
                                    writeFileSync(folderPath + ent.getName() + ".dplx", content, "utf8");
                                }
                            });
                        
                    });
            }
            if (folder.getSubFolders()) {
                folder.getSubFolders().forEach(f => {
                    dplxFolders(f);
                });
            }
        }
    
        dplxFolders(cdmCorpus);
    }
}

Startup.main(); 