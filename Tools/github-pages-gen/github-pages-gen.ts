import * as cdm from "../cdm-types/cdm-types"
import * as ghc from "../github-pages-gen/gh-content-gen"

// browserify ..\tools\cdm-types\cdm-types.js --o cdm-bundle.js --standalone cdm
// browserify ..\tools\cdm2dplx\cdm2dplx.js --o cdm2dplx-bundle.js --standalone cdm2dplx


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
            let docsRoot = "../../";
            let consts : ghc.contentConstants  = {
                docsRoot : docsRoot,
                brTemplate : "SchemaViz.html",
                brTokenScript : "{ d: \"INSERTDATA\" }",
                brTokenHTML : "NOTUSEDANYMORE",
                brResultFile : docsRoot + "Docs/index.html",
                mdTemplate : "readme_header.md",
                mdToken : "INSERT_DIRECTORY_HERE",
                coreDir : docsRoot + "schemaDocuments/",
                docLocationRoot : "https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/entities/",
                ghSourceRoot : "https://github.com/Microsoft/CDM/blob/experimental/schemaDocuments",
                ghRawRoot : "https://raw.githubusercontent.com/Microsoft/CDM/experimental/schemaDocuments"
                //ghRawRoot : "http://jeffbern-dev.redmond.corp.microsoft.com:1400/schemaDocuments"
            };

            let hier = ghc.collectGithubFolderData(cdmCorpus);
            ghc.createGithubBrowser(hier, consts);
            ghc.createGithubIndex(hier, consts);
            console.log('done');

        }).catch();
        
        return 0;
    }
  
}

Startup.main(); 