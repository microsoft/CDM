import * as cdm from "../../src/cdm-types"
import * as cdm2dplx from "../cdm2dplx/cdm2dplx"
import * as loc from "../../src/local-corpus";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { version } from "punycode";


class Startup {
    public static main(): number {

        let cdmCorpus : cdm.ICdmCorpusDef;
        let pathToDocRoot = "../../schemaDocuments";
        //let pathToDocRoot = "../../test";
        //pathToDocRoot = "/cdsa schemas/credandcollect";

        let version = "";
        //let version = "0.6"; // explicitly use the explicit version docs to get versioned schema refs too
        cdmCorpus = cdm.NewCorpus(pathToDocRoot);
        cdmCorpus.setResolutionCallback(loc.consoleStatusReport, cdm.cdmStatusLevel.progress, cdm.cdmStatusLevel.error);
        console.log('reading source files');
        loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"), ["analyticalCommon"], version); 

        loc.resolveLocalCorpus(cdmCorpus, cdm.cdmValidationStep.finished).then((r:boolean) =>{
            
            this.listAllTraits(cdmCorpus);
            //this.createTestDplx(cdmCorpus);
            //this.createEachDplx(cdmCorpus, pathToDocRoot, version);
            console.log('done');

        }).catch();
        
        return 0;
    }

    public static listAllTraits(cdmCorpus : cdm.ICdmCorpusDef) {
        let seen = new Set<string>();

        let seekTraits = (folder : cdm.ICdmFolderDef) => {
            if (folder.getName() != "" && folder.getDocuments() && folder.getDocuments().length)
            {
                if (folder.getDocuments())
                    folder.getDocuments().forEach(doc => {
                        if (doc.getDefinitions() && doc.getDefinitions().length)
                            doc.getDefinitions().forEach(def => {
                                if (def.getObjectType() == cdm.cdmObjectType.entityDef) {
                                    let ent = def as cdm.ICdmEntityDef;
                                    let rtsEnt = ent.getResolvedTraits(doc);
                                    rtsEnt.set.forEach(rt => {
                                        let rtName = rt.traitName;
                                        if (!seen.has(rtName)) {
                                            console.log(rtName);
                                            seen.add(rtName);
                                        }
                                    });
                                    let ras = ent.getResolvedAttributes(doc);
                                    ras.set.forEach(ra => {
                                        let rtsAtt = ra.resolvedTraits;
                                        rtsAtt.set.forEach(rt => {
                                            let rtName = rt.traitName;
                                            if (!seen.has(rtName)) {
                                                console.log(rtName);
                                                seen.add(rtName);
                                            }
                                        });
    
                                    });
                                }
                            });
                    });
            }
            if (folder.getSubFolders()) {
                folder.getSubFolders().forEach(f => {
                    seekTraits(f);
                });
            }
        }
    
        seekTraits(cdmCorpus);
    }

    public static createTestDplx(cdmCorpus : cdm.ICdmCorpusDef) {
        let converter = new cdm2dplx.Converter() as cdm2dplx.IConvertToDplx;
        converter.bindingType="byol"
        converter.relationshipsType="inclusive";
        converter.schemaUriBase = "";
        let set = new Array<cdm.ICdmEntityDef>();

        let ent = cdmCorpus.getObjectFromCorpusPath("/core/applicationCommon/foundationCommon/crmCommon/Account.cdm.json/Account") as cdm.ICdmEntityDef;
        //let ent = cdmCorpus.getObjectFromCorpusPath("/model/CollectionStatus.cdm.json/CollectionStatus") as cdm.ICdmEntityDef;

        // ignore this, just testing out the 'search for atts from traits' function
        //let eat = ent.getFriendlyFormat().toString(200, 20, 0, 2);
        //writeFileSync("account.spew", eat, "utf-8");
        // let s = ent.getAttributesWithTraits(["is.dataFormat.floatingPoint","means.location.longitude"]);
        // s = ent.getAttributesWithTraits("means.reference");
        // s = ent.getAttributesWithTraits({traitBaseName:"is.requiredAtLevel", params : [{paramName : "level", paramValue : "systemrequired"}]});


        set.push(ent);
        set.push(cdmCorpus.getObjectFromCorpusPath("/core/applicationCommon/foundationCommon/crmCommon/Lead.cdm.json/Lead") as cdm.ICdmEntityDef);
        let dplx = converter.convertEntities(cdmCorpus, set, "ExampleDataFlow");
    }

    public static createEachDplx(cdmCorpus : cdm.ICdmCorpusDef, outRoot : string, version : string) {
        let converter = new cdm2dplx.Converter() as cdm2dplx.IConvertToDplx;
        converter.bindingType="none"
        converter.relationshipsType="all";
        converter.schemaUriBase = "https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments";
        converter.schemaVersion = version;

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
                                    let dplx = converter.convertEntities(cdmCorpus, [ent], "");
                                    let content = JSON.stringify(dplx, null, 2);
                                    writeFileSync(folderPath + ent.getName() + "_df" + converter.getPostFix(), content, "utf8");
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