import fetch from 'node-fetch';
import * as cdm from "../cdm-types/cdm-types"
import { readFileSync, writeFileSync, readFile, mkdirSync, existsSync, createReadStream, readdirSync, statSync } from "fs";
import { promisify } from "util";
import { relative } from "path";


interface entityState {
    id : string;
    folderId : string;
    name : string;
    path : string;
    docName : string;
    loadState : number;
    description : string;
    createUX : boolean;
}

interface folder {
    id : string;
    name : string
    entities : entityState[];
    folders : folder[];
}


interface navigatorData {
    root : folder;  
    readRoot : string;
    sourceRoot : string;
}

interface indexEntry {
    name : string;
    jsonLink : string;
    locationFragment : string;
    locationLink : string;
    documentationLink : string;
    level : number;
    description : string;
}

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
        this.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"));

        let statusRpt = (level: cdm.cdmStatusLevel, msg : string, path : string)=> {
            if (level == cdm.cdmStatusLevel.error || level == cdm.cdmStatusLevel.warning)
                console.log(`${(level==cdm.cdmStatusLevel.error) ? "Err" : "Wrn"}: ${msg} @ ${path}`) ;
            else if (level == cdm.cdmStatusLevel.progress)
                console.log(msg);
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
            let startTime = Date.now();
            console.log('validate schema:');
            if (r) {
                let validateStep = (currentStep:cdm.cdmValidationStep)=> {
                    return cdmCorpus.resolveReferencesAndValidate(currentStep, statusRpt, cdm.cdmStatusLevel.error).then((nextStep:cdm.cdmValidationStep) => {
                        if (nextStep == cdm.cdmValidationStep.error) {
                            console.log('validation step failed');
                        }
                        else if (nextStep == cdm.cdmValidationStep.finished) {
                            console.log('validation finished');
                            console.log(Date.now() - startTime);
                            this.createGithubContent(cdmCorpus);
                            console.log(Date.now()-startTime);
                        }
                        else {
                            // success resolving all imports
                            return validateStep(nextStep);
                        }
                    }).catch((reason)=> {
                        console.log('exception during validation');
                        console.log(reason);
                    });
                }
                return validateStep(cdm.cdmValidationStep.start);
            }
        });

        
        return 0;
    }

    public static loadCorpusFolder(corpus : cdm.Corpus, folder : cdm.ICdmFolderDef) {
        let path = corpus.rootPath + folder.getRelativePath();
        if (folder.getName() == "analyticalCommon")
        //if (folder.getName() == "applicationCommon")
            return;
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

    public static createGithubContent(corpus : cdm.Corpus) {

        let docsRoot = "../../../CDM/";

        let token1 = "{ d: \"INSERTDATA\" }";
        let mdToken = "INSERT_DIRECTORY_HERE";
        let templateFile = docsRoot + "SchemaViz.html";
        let resultFile = docsRoot + "Docs/index.html";
        let coreDir = docsRoot + "schemaDocuments/";
        let docLocationRoot = "https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/";
        let ghSourceRoot = "https://github.com/Microsoft/CDM/blob/experimental/schemaDocuments";
        let ghRawRoot = "https://raw.githubusercontent.com/Microsoft/CDM/experimental/schemaDocuments";
        //ghRawRoot = "<private>/schemaDocuments";

        let collectFolderHierarchy = (folder : cdm.ICdmFolderDef, hier : folder) => {
            folderId ++;
            let entNumber = 0;
            hier.name = folder.getName();
            hier.id = "f" + (folderId * 10000).toString();
            if (folder.getName() != "" && folder.getDocuments() && folder.getDocuments().length)
            {
                hier.entities = new Array<entityState>();
                folder.getDocuments().forEach(doc => {
                    if (doc.getDefinitions() && doc.getDefinitions().length)
                        doc.getDefinitions().forEach(def => {
                            if (def.getObjectType() == cdm.cdmObjectType.entityDef) {
                                entNumber ++;
                                let id = "e" + (entNumber + folderId * 10000).toString();
                                // for each entity defined 
                                // get description
                                let description = "";
                                let locEnt : cdm.ICdmConstantEntityDef;
                                let pVal: cdm.ParameterValue;
                                let rtDesc : cdm.ResolvedTrait;
                                if ((rtDesc = def.getResolvedTraits().find("is.localized.describedAs")) && 
                                    (pVal=rtDesc.parameterValues.getParameterValue("localizedDisplayText")) &&
                                    (pVal.value) && 
                                    (locEnt = pVal.value.getObjectDef() as cdm.ICdmConstantEntityDef)) {
                                        description = locEnt.lookupWhere("displayText", "languageTag", "en");
                                }
                                hier.entities.push({id:id, folderId:hier.id, name:def.getName(), path:folder.getRelativePath(), 
                                                    docName:doc.getName(), loadState : 0, description : description, createUX : true});
                            }
                        });
                    
                });
            }
            if (folder.getSubFolders() && folder.getSubFolders().length)
            {
                hier.folders = new Array<folder>();
                folder.getSubFolders().forEach(sub => {
                    let subHier : folder = {id:"0", name:undefined, entities:undefined, folders:undefined}
                    hier.folders.push(subHier);
                    collectFolderHierarchy(sub, subHier);
                });
            }
        }

        let stateList = new Array<entityState>();
        let hierRoot : folder = {id:"0", name:"", entities:undefined, folders:undefined};
        let folderId = 0;
        collectFolderHierarchy(corpus, hierRoot)
        let navData : navigatorData = {readRoot:ghRawRoot, sourceRoot:ghSourceRoot, root:hierRoot };
        let dataChunk = JSON.stringify(navData);

        // read the template html and break it into chunks
        let fullTemplate = readFileSync(templateFile, {encoding:"utf-8"});
        let content = fullTemplate.replace(token1, dataChunk);

        // write the result
        writeFileSync(resultFile, content, {encoding:"utf-8"});

        //now make the markdown index tables
        let createMarkdownIndex = (path : string, hier : folder, locationParent : string, locationThis : string) => { 
            let content = "";
            let appendLine = (toAdd : string) => {
                content += toAdd + "\n";
            }

            let makeLocationFragment = (locationParent : string, locationThis : string) : string => {
                if (locationParent) 
                    return `${locationParent}/${locationThis}/`;
                else if (locationThis)
                    return `${locationThis}/`;
                return undefined;
            }

            let locationFragment = makeLocationFragment(locationParent, locationThis) ;
            if (locationFragment)
                appendLine(`## ${locationFragment}`);

            let collectAllEntities = (hier : folder, locationParent : string, locationThis : string, level : number, accumulateIn : Array<indexEntry>) => {
                let locationFragment = makeLocationFragment(locationParent, locationThis);

                if (hier.entities) {
                    hier.entities.forEach(ent => {
                        accumulateIn.push({name : ent.name, 
                                        jsonLink : ghSourceRoot + ent.path + ent.docName,
                                        locationFragment : locationFragment,
                                        locationLink : ghSourceRoot + ent.path,
                                        description : ent.description,
                                        documentationLink : docLocationRoot + ent.name,
                                        level : level});
                    });
                }
                if (hier.folders) {
                    hier.folders.forEach(fold => {
                        collectAllEntities(fold, locationThis, fold.name, level + 1, accumulateIn);
                    });
                }
            }

            let allIndex = new Array<indexEntry>();
            let dupName = false;
            collectAllEntities(hier, "", locationThis, 0, allIndex);
            // sort by entity name and level
            allIndex = allIndex.sort((l, r) : number => { 
                if (l.name < r.name)
                    return -1;
                if (l.name > r.name)
                    return 1;
                dupName = true;
                if (l.level < r.level)
                    return -1;
                if (l.level > r.level)
                    return 1;
                return 0;
            });

            if (dupName) {
                appendLine(">Note: Entities with multiple rows in the index below indicate that there is a base version of the entity (first occurrence), as well as extended versions with additional attributes added (e.g.with Sales / Services / Marketing specific additions)");
                appendLine("");
            }
        
            appendLine("| Entity Name | Location: | Description | External Link |");
            appendLine("|:--- |:--- |:--- |:--- |");

            allIndex.forEach(i => {
                content += `|[**${i.name}**](${i.jsonLink})|`;
    
                if (i.locationFragment != null)
                    content += `[${i.locationFragment}](${i.locationLink})|`;
                else
                    content += " |";
    
                if (i.description!= null)
                        content += `${i.description}|`;
                else
                    content += " |";
    
                appendLine(`[Docs](${i.documentationLink})|`);
            });



            if (!locationFragment) {
                // special case for the top directory, insert the link to the nav tool and other help
                let template = readFileSync(path + "readme_header.md", "utf8");
                content = template.replace(mdToken, content);
            }

            writeFileSync(path + "README.md", content, {encoding:"utf-8"});

            if (hier.folders) {
                hier.folders.forEach(fold => {
                    createMarkdownIndex(path + fold.name + "/", fold, locationThis, fold.name);
                });
            }
        }

        createMarkdownIndex(coreDir, hierRoot, "", "");
    }
    
}

Startup.main(); 