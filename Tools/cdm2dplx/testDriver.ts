import * as cdm from "../cdm-types/cdm-types"
import * as cdm2dplx from "../cdm2dplx/cdm2dplx"
import { readFileSync, writeFileSync, readFile, mkdirSync, existsSync, createReadStream, readdirSync, statSync } from "fs";


class Startup {
    public static main(): number {

        let cdmCorpus : cdm.Corpus;
        let pathToDocRoot = "../../schemaDocuments";

        // run over input folders recursively and process them into a hierarchical corpus of schema docs
        cdmCorpus = new cdm.Corpus(pathToDocRoot);
        console.log('reading source files');
        this.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"));

        let statusRpt = (level: cdm.cdmStatusLevel, msg : string, path : string)=> {
            if (level == cdm.cdmStatusLevel.error)
                console.log("E: " + msg + "  @" + path) ;
            else if (level == cdm.cdmStatusLevel.progress)
                console.log("   " + msg);
        }

        console.log('resolving imports');
        // first resolve all of the imports to pull other docs into the namespace
        cdmCorpus.resolveImports((uri : string) : Promise<[string, string]> =>{
            return new Promise<[string, string]>((resolve, reject) => {
                // super mixed up. 
                // resolve imports take a callback that askes for promise to do URI resolution.
                // so here we are, working on that promise
                readFile(cdmCorpus.rootPath + uri, "utf8", (err : NodeJS.ErrnoException, data:string)=>{
                    if(err)
                        reject([uri, err]);
                    else
                        resolve([uri, data]);
                })
            });
        }, statusRpt).then((r:boolean) => {
            // success resolving all imports
            console.log(r);
            console.log('validate schema:');
            if (r) {
                let validateStep = (currentStep:cdm.cdmValidationStep)=> {
                cdmCorpus.resolveReferencesAndValidate(currentStep, statusRpt, cdm.cdmStatusLevel.error).then((nextStep:cdm.cdmValidationStep) => {
                        if (nextStep == cdm.cdmValidationStep.error) {
                            console.log('validation step failed');
                        }
                        else if (nextStep == cdm.cdmValidationStep.finished) {
                            console.log('validation finished');
                            
                            this.createTestDplx(cdmCorpus);
                        }
                        else {
                            // success resolving all imports
                            validateStep(nextStep);
                        }
                    }).catch((reason)=> {
                        console.log('exception during validation');
                        console.log(reason);
                    });
                }
                validateStep(cdm.cdmValidationStep.start);
            }
        });

        
        return 0;
    }

    public static loadCorpusFolder(corpus : cdm.Corpus, folder : cdm.ICdmFolderDef) {
        let path = corpus.rootPath + folder.getRelativePath();
        // for every document or directory
        readdirSync(path).forEach(dirEntry => {
            let entryName = path + dirEntry;
            let stats = statSync(entryName);
            if (stats.isDirectory()) {
                this.loadCorpusFolder(corpus, folder.addFolder(dirEntry));
            }
            else if (dirEntry.endsWith(".cdm.json")) {
                let sourceDoc = readFileSync(entryName, "utf8");
                let doc : cdm.ICdmDocumentDef = corpus.addDocumentFromContent(folder.getRelativePath() +  dirEntry, sourceDoc);
            }
        });

    }

    public static createTestDplx(cdmCorpus : cdm.Corpus) {
        let converter = new cdm2dplx.Converter() as cdm2dplx.IConvertToDplx;
        converter.bindingType="byol"
        let set = new Array<cdm.ICdmEntityDef>();

        set.push(cdmCorpus.getObjectFromCorpusPath("/core/applicationCommon/foundationCommon/crmCommon/Account.cdm.json/Account") as cdm.ICdmEntityDef);
        set.push(cdmCorpus.getObjectFromCorpusPath("/core/applicationCommon/foundationCommon/crmCommon/Lead.cdm.json/Lead") as cdm.ICdmEntityDef);

        
        writeFileSync("account.spew", cdmCorpus.getObjectFromCorpusPath("/core/applicationCommon/Account.cdm.json/Account").getFriendlyFormat().toString(200, 20, 0, 2), "utf-8");

        let dplx = converter.convertEntities(set);


    }
   
}

Startup.main(); 