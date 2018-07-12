
import * as cdm from "../cdm-types/cdm-types";
import * as loc from "../local-corpus/local-corpus"
import {tomModelToCdmCorpus} from "../tom2cdm/tom2cdm";

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";


class Startup {
    public static main(): number {

        console.log('reading source file');
        let cdmCorpus : cdm.Corpus;
        let pathToDocRoot = "../../schemaDocuments";
        let pathToOutput = "retail";

        // create an empty corpus with the supporting files at the root
        cdmCorpus = new cdm.Corpus(pathToDocRoot);
        cdmCorpus.statusLevel = cdm.cdmStatusLevel.info;
        let folderResult = cdmCorpus.addFolder(pathToOutput);
        
        //let modelJson = JSON.parse(readFileSync("model.bim", "utf8"));
        //let modelJson = JSON.parse(readFileSync("/cdsa schemas/CreditAndCollectionsImportMode.xmla", "utf8"));
        let modelJson = JSON.parse(readFileSync("/cdsa schemas/retail/XMLAQuery1.xmla", "utf8"));

        let converter = new tomModelToCdmCorpus();
        converter.addToCorpus(folderResult, modelJson);

        console.log('persist Corpus:');
        loc.persistCorpus(cdmCorpus);

        loc.resolveLocalCorpus(cdmCorpus, cdm.cdmStatusLevel.error, loc.consoleStatusReport).then((r:boolean) =>{
            console.log('done');
        }).catch();
        
        return 0;
    }
}

Startup.main(); 