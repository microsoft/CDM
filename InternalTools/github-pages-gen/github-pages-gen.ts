import * as cdm from "cdm.objectmodel";
import * as ghc from "./gh-content-gen";

// browserify ..\lib\cdm-types.js --o cdm-bundle.js --standalone cdm

if(process.argv.length !== 4 || !process.argv[2] || !process.argv[3]) {
    throw "Invalid usage, please provide the correct paths.\n" +
    "Correct Usage: node ./dist/github-pages-gen.js <Schema Documents Path> <Explorer Path>";
}

const schemaDocumentsPath: string = process.argv[2].trim() + "/";
const cdmExplorerPath: string = process.argv[3].trim() + "/";

console.log(process.argv[2]);
console.log(process.argv[3]);

class Startup {
    public static main(): number {

        let cdmCorpus: cdm.types.ICdmCorpusDef;
        // run over input folders recursively and process them into a hierarchical corpus of schema docs
        cdmCorpus = cdm.types.NewCorpus(schemaDocumentsPath);
        cdmCorpus.setResolutionCallback(cdm.loc.consoleStatusReport, cdm.types.cdmStatusLevel.progress, cdm.types.cdmStatusLevel.error);
        console.log("reading source files");
        cdm.loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"), ["analyticalCommon"], "");

        cdm.loc.resolveLocalCorpus(cdmCorpus, cdm.types.cdmValidationStep.finished).then((r: boolean) => {
            let consts: ghc.contentConstants = {
                brTemplate: "SchemaViz.html",
                brTokenScript: "{ d: \"INSERTDATA\" }",
                brTokenHTML: "NOTUSEDANYMORE",
                brResultFile: `${cdmExplorerPath}/index.html`,
                mdTemplate: "readme_header.md",
                mdToken: "INSERT_DIRECTORY_HERE",
                coreDir: schemaDocumentsPath,
                docLocationRoot: "https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/entities/",
                ghSourceRoot: "https://github.com/Microsoft/CDM/blob/master/schemaDocuments",
                ghRawRoot: "https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments"
            };

            let hier = ghc.collectGithubFolderData(cdmCorpus);
            ghc.createGithubBrowser(hier, consts);
            ghc.createGithubIndex(hier, consts);
            console.log("done");

        }).catch();

        return 0;
    }
}

Startup.main();