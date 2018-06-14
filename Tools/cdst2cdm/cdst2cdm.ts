
import * as cdm from "../cdm-types/cdm-types"
import { readFileSync, writeFileSync, readFile, mkdirSync, existsSync, createReadStream } from "fs";
import { promisify } from "util";
import { relative } from "path";


interface dataTypeAndRelationshipPicker {
    scoreAtttribute(type : string, internalName : string, semanticType : string) : number;
    typeName? : string;
    typeTraitName? : string;
    relationshipName? : string;
}

class Startup {
    public static main(): number {

        let now = Date.now();
        let cdmCorpus : cdm.Corpus;
        let pathToDocRoot = "../../schemaDocuments";

        // run over intput folders recursively and process them into a hierarchical corpus of schema docs
        console.log('reading source file');
        let cdstCorpus = JSON.parse(readFileSync("entitycorpus.json", "utf8"));

        console.log('creating cdm corpus');
        if (cdstCorpus && cdstCorpus.folderInfo && cdstCorpus.folderInfo.length ==1) {
            cdmCorpus = new cdm.Corpus(pathToDocRoot);
            cdmCorpus.statusLevel = cdm.cdmStatusLevel.progress;
            this.convertCdstFolder(cdstCorpus.folderInfo[0], cdmCorpus);
        }

        console.log('persist Corpus:');
        // run over created corpus and write out the docs into the folders
        if (cdmCorpus && cdmCorpus.getSubFolders() && cdmCorpus.getSubFolders().length == 1) {
            this.persistFolder(cdmCorpus.rootPath, cdmCorpus.getSubFolders()[0]);
        }

        console.log('reading well known attribute sets');
       let wkas = readFileSync(cdmCorpus.rootPath + "/core/applicationCommon/wellKnownCDSAttributeGroups.cdm.json", "utf8");
       let docWkas : cdm.ICdmDocumentDef = cdmCorpus.addDocumentFromContent("/core/applicationCommon/wellKnownCDSAttributeGroups.cdm.json", wkas);

        let msgCount : number= 0;
        let statusRpt = (level:cdm.cdmStatusLevel, msg : string, path : string)=> {
            if (level == cdm.cdmStatusLevel.error) {
                console.log("E: " + msg + "  @" + path) ;
            }
            else if (level == cdm.cdmStatusLevel.progress) {
                console.log("P: " + msg);
            }
            else {
                msgCount ++;
                if (msgCount % 1000 == 0) {
                    console.log("I: " + msg);
                    console.log(msgCount);
                }
            }
        }

        console.log('resolving imports');
        // first resolve all of the imports to pull other docs into the namespace
        cdmCorpus.resolveImports((uri : string) : Promise<[string, string]> =>{
            return new Promise<[string, string]>((resolve, reject) => {
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
                cdmCorpus.resolveReferencesAndValidate(currentStep, statusRpt).then((nextStep:cdm.cdmValidationStep) => {
                        if (nextStep == cdm.cdmValidationStep.error) {
                            console.log('validation step failed');
                        }
                        else if (nextStep == cdm.cdmValidationStep.finished) {
                            console.log('finished');
                            console.log(Date.now() - now);
                        }
                        else {
                            validateStep(nextStep);
                        }
                    });
                }
                now = Date.now();
                validateStep(cdm.cdmValidationStep.start);
            }
        });

        
        return 0;
    }

        
    public static convertCdstFolder(cdstFolder : any, cdmFolderParent : cdm.ICdmFolderDef): cdm.ICdmFolderDef {
        let cdmFolder : cdm.ICdmFolderDef = null;
        if (cdmFolderParent && cdstFolder.name && cdstFolder.path != null) {
            if (cdmFolder = cdmFolderParent.addFolder(cdstFolder.name)) {
                // add a master import for the folder
                let masterImport : string;
                if (cdstFolder.referenceInfo && cdstFolder.referenceInfo.length) {
                    masterImport = "_allImports.cdm.json";
                    let cdmDocImp : cdm.ICdmDocumentDef = cdmFolder.addDocument("_allImports.cdm.json", "");
                    cdmDocImp.addImport("/core/applicationCommon/cdsConcepts.cdm.json", "");
                    cdmDocImp.addImport("/core/applicationCommon/wellKnownCDSAttributeGroups.cdm.json", "");
                    cdstFolder.referenceInfo.sort((l, r) : number => {
                            // sort to put monikers first then by path so that things which stop or diverge "lower" than this path are first
                            // then the things at this path then the things which are 'deeper' than this path. this way more specialized 
                            // re-declarations of base objects are last and thay way they override the earlier declarations
                            if (l.referenceMoniker && !r.referenceMoniker)
                                return -1;
                            if (!l.referenceMoniker && r.referenceMoniker)
                                return 1;
                            if (!l.referencePath && !r.referencePath)
                                return l.referenceItem.localeCompare(r.referenceItem);
                            if (!l.referencePath && r.referencePath)
                                return 1;
                            if (l.referencePath && !r.referencePath)
                                return -1;
                            
                            if (r.referencePath.startsWith(l.referencePath))
                                return -1;
                            if (l.referencePath.startsWith(r.referencePath))
                                return 1;
                            return l.referencePath.localeCompare(r.referencePath);
                        }).forEach(imp => {
                            if (imp.referencePath != null && imp.referenceItem != null) {
                                cdmDocImp.addImport(imp.referencePath + imp.referenceItem + ".cdm.json", imp.referenceMoniker);
                            }
                        });
                }

                // add all documents
                if (cdstFolder.entityInfo && cdstFolder.entityInfo.length) {
                    cdstFolder.entityInfo.forEach(ei => {
                        this.convertCdstEntityToDoc(cdmFolder, ei, masterImport);
                    });
                }

                // create the sub-folders 
                if (cdstFolder.subFolders && cdstFolder.subFolders.length) {
                    cdstFolder.subFolders.forEach(f => {
                        this.convertCdstFolder(f, cdmFolder);
                    });
                }

            }
        }
        return cdmFolder;
    }
    public static convertCdstEntityToDoc(cdmFolder : cdm.ICdmFolderDef, cdstEntityInfo : any, masterImport : string): cdm.ICdmDocumentDef {
        let cdmDocument : cdm.ICdmDocumentDef = null;
        if (cdmFolder && cdstEntityInfo.name) {
            if (cdmDocument = cdmFolder.addDocument(cdstEntityInfo.name + ".cdm.json", "")) {
                // need an import?
                if (masterImport) {
                    let imp = cdmDocument.addImport(masterImport, null);
                }
                // add the entity
                let cdmEntity  = cdmDocument.addDefinition<cdm.ICdmEntityDef>(cdm.cdmObjectType.entityDef, cdstEntityInfo.name);
                // do everything
                this.cdstEntityToCdmEntity(cdmFolder, cdstEntityInfo, cdmEntity);
            }
        }
        return cdmDocument;
    }

    public static persistFolder(rootPath : string, cdmFolder : cdm.ICdmFolderDef): void {
        if (cdmFolder) {
            let folderPath = rootPath + cdmFolder.getRelativePath();
            if (!existsSync(folderPath))
                mkdirSync(folderPath);
            if (cdmFolder.getDocuments())
                cdmFolder.getDocuments().forEach(doc => {
                    let content = JSON.stringify(doc, null, 4);
                    writeFileSync(folderPath + doc.getName(), content, "utf8");
                });
            if (cdmFolder.getSubFolders()) {
                cdmFolder.getSubFolders().forEach(f => {
                    this.persistFolder(rootPath, f);
                });
            }
        }
    }
    
    public static cdstEntityToCdmEntity(cdmFolder : cdm.ICdmFolderDef, cdstEntityInfo : any, cdmEntity : cdm.ICdmEntityDef) {

        // is this an extension entity? make the ref
        if (cdstEntityInfo.extends) {
            cdmEntity.setExtendsEntityRef(cdm.Corpus.MakeRef(cdm.cdmObjectType.entityRef, cdstEntityInfo.extends));
        }
        else {
            cdmEntity.setExtendsEntityRef(cdm.Corpus.MakeRef(cdm.cdmObjectType.entityRef, "CdmObject"));
        }

        let getLocalizedTableTrait = (sourceText : string, traitName : string) : cdm.ICdmTraitRef => {
            if (sourceText) {
                let tRef = cdm.Corpus.MakeObject<cdm.ICdmTraitRef>(cdm.cdmObjectType.traitRef, traitName);
                // make the argument nothing but a ref to a constant entity, safe since there is only one param for the trait and it looks cleaner
                let cEnt = cdm.Corpus.MakeObject<cdm.ICdmConstantEntityDef>(cdm.cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(cdm.Corpus.MakeRef(cdm.cdmObjectType.entityRef, "localizedTable"));
                cEnt.setConstantValues([["en", sourceText]]);
                tRef.addArgument(undefined, cdm.Corpus.MakeRef(cdm.cdmObjectType.constantEntityRef, cEnt));
                return tRef;
            }
                
        }

        // add descriptive and display text
        cdmEntity.addExhibitedTrait(getLocalizedTableTrait(cdstEntityInfo.displayName, "is.localized.displayedAs"));
        cdmEntity.addExhibitedTrait(getLocalizedTableTrait(cdstEntityInfo.description, "is.localized.describedAs"));

        if (cdstEntityInfo.CDSTName) {
            let tRef = cdmEntity.addExhibitedTrait("is.CDS.sourceNamed");
            tRef.addArgument(undefined, cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, cdstEntityInfo.CDSTName));
        }

        // for each attribute
        if (cdstEntityInfo.attributeInfo) {

            interface creationResultInfo {
                requiredLevel? : string;
            }; 

            // create an attribute group with a trait that lists the path.
            let attGroupAll = cdm.Corpus.MakeObject<cdm.ICdmAttributeGroupDef>(cdm.cdmObjectType.attributeGroupDef, "attributesAddedAtThisScope");
            let tRef = cdm.Corpus.MakeObject<cdm.ICdmTraitRef>(cdm.cdmObjectType.traitRef, "is.CDM.attributeGroup");
            // make the argument nothing but a ref to a constant entity, safe since there is only one param for the trait and it looks cleaner
            let cEnt = cdm.Corpus.MakeObject<cdm.ICdmConstantEntityDef>(cdm.cdmObjectType.constantEntityDef);
            cEnt.setEntityShape(cdm.Corpus.MakeRef(cdm.cdmObjectType.entityRef, "attributeGroupSet"));
            let groupPath = cdmFolder.getRelativePath() + cdmEntity.getName() + ".cdm.json/" + cdmEntity.getName() + "/hasAttributes/attributesAddedAtThisScope";
            // is this an extension entity? make the ref
            cEnt.setConstantValues([[groupPath]]);
            tRef.addArgument(undefined, cdm.Corpus.MakeRef(cdm.cdmObjectType.constantEntityRef, cEnt));
            attGroupAll.addExhibitedTrait(tRef);

            let relRefStatus : cdm.ICdmRelationshipRef = null;
            let attNameState : string = "UNSPECIFIED";

            let createTypeAttribute = (attInfo : any, resultInfo : creationResultInfo) : cdm.ICdmAttributeDef => {
                let cdmAtt = cdm.Corpus.MakeObject<cdm.ICdmAttributeDef>(cdm.cdmObjectType.typeAttributeDef, attInfo.name);
                // if this is the primary key, use the right relationship
                let relRef : cdm.ICdmRelationshipRef = cdm.Corpus.MakeRef(cdm.cdmObjectType.relationshipRef, "hasA");
                if (attInfo.isPrimaryKey) {
                    relRef = cdm.Corpus.MakeRef(cdm.cdmObjectType.relationshipRef, "identifiedBy");
                }

                // everything has one of these
                let tRef = cdmAtt.addAppliedTrait("is.CDS.sourceNamed");
                tRef.addArgument(undefined, cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, attInfo.CDSTName));

                // constrained?
                if (attInfo.maxLength || attInfo.minValue || attInfo.maxValue) {
                    tRef = cdmAtt.addAppliedTrait("is.constrained");
                    if (attInfo.maxLength)
                        tRef.addArgument("maximumLength", cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, attInfo.maxLength));
                    if (attInfo.minValue)
                        tRef.addArgument("minimumValue", cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, attInfo.minValue));
                    if (attInfo.maxValue)
                        tRef.addArgument("maximumValue", cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, attInfo.maxValue));
                }
                if (attInfo.columnNumber) {
                    tRef = cdmAtt.addAppliedTrait("is.CDS.ordered");
                    tRef.addArgument(undefined, cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, attInfo.columnNumber));
                }
                if (attInfo.lookupStyle) {
                    tRef = cdmAtt.addAppliedTrait("is.CDS.lookup");
                    tRef.addArgument("style", cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, attInfo.lookupStyle));
                }
                if (attInfo.calculationOf) {
                    tRef = cdmAtt.addAppliedTrait("is.calculationOf");
                    tRef.addArgument("sourceAttribute", cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, attInfo.calculationOf));
                }

                if (attInfo.isNullable) {
                    tRef = cdmAtt.addAppliedTrait("is.nullable");
                }
                if (attInfo.requiredLevel) {
                    tRef = cdmAtt.addAppliedTrait("is.requiredAtLevel");
                    tRef.addArgument("level", cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, attInfo.requiredLevel));
                    resultInfo.requiredLevel = attInfo.requiredLevel;
                }
               
                
                // figure out a data type
                let dataType : cdm.ICdmDataTypeRef;
                let dataTypeName = "listLookup";
                let supportingDataTypeName : string = "localizedDisplayText";

                if (attInfo.isPrimaryKey) {
                    dataType = cdm.Corpus.MakeRef(cdm.cdmObjectType.dataTypeRef, "entityId");
                }
                else if (attInfo.isBaseCurrency) {
                    dataType = cdm.Corpus.MakeRef(cdm.cdmObjectType.dataTypeRef, "baseCurrency");
                }
                else if (attInfo.dataType == "picklist" || attInfo.dataType == "state" || attInfo.dataType == "status" || attInfo.dataType == "multiselectpicklist") {
                    // option set might be just a picklist, a state or a status
                    let entityShape = "listLookupValues";
                    let entityExplanation="The constantValues below correspond to the attributes of the 'listLookupValues' entityShape which are: {languageTag, displayText, attributeValue, displayOrder}";
                    if (attInfo.dataType === "status") {
                        entityShape = "listLookupCorrelatedValues"
                        entityExplanation="The constantValues below correspond to the attributes of the 'listLookupCorrelatedValues' entityShape which are: {languageTag, displayText, attributeValue, displayOrder, correlatedValue}";
                        relRef = cdm.Corpus.MakeObject(cdm.cdmObjectType.relationshipRef, "representsCorrelatedStatusWith");
                        relRefStatus = relRef; // remember for the end of the att list
                    }
                    else if (attInfo.dataType === "state") {
                        attNameState = attInfo.name; // remember for the end of the att list
                        relRef = cdm.Corpus.MakeRef(cdm.cdmObjectType.relationshipRef, "representsStateWith");
                    }
                    else if (attInfo.dataType == "multiselectpicklist") {
                        dataTypeName = "listLookupMultiple";
                        supportingDataTypeName = "localizedDisplayTextMultiple";
                    }
                    
                    // construct the datatype 
                    dataType = cdm.Corpus.MakeObject(cdm.cdmObjectType.dataTypeRef, dataTypeName);
                    // which has a trait containing the default value
                    let cEnt = cdm.Corpus.MakeObject<cdm.ICdmConstantEntityDef>(cdm.cdmObjectType.constantEntityDef);
                    cEnt.setEntityShape(cdm.Corpus.MakeRef(cdm.cdmObjectType.entityRef, entityShape));
                    cEnt.setExplanation(entityExplanation);
                    dataType.addAppliedTrait("does.haveDefault").addArgument(undefined, cdm.Corpus.MakeRef(cdm.cdmObjectType.entityRef, cEnt));
                    
                    let vals = new Array<Array<string>>();
                    if (attInfo.optionSetInfo && attInfo.optionSetInfo.length)
                        attInfo.optionSetInfo.forEach(osi => {
                            let row = new Array<string>();
                            row.push("en");
                            row.push(osi.displayName);
                            row.push(osi.value.toString());
                            row.push(osi.displayOrder.toString());
                            if (entityShape === "listLookupCorrelatedValues")
                                row.push(osi.stateStatusValue.toString());
                            vals.push(row);
                        });
                    cEnt.setConstantValues(vals);

                    // and a trait that adds a support description attribute
                    let supAtt = cdm.Corpus.MakeObject<cdm.ICdmTypeAttributeDef>(cdm.cdmObjectType.typeAttributeDef, attInfo.name + "_display");
                    supAtt.setDataTypeRef(cdm.Corpus.MakeRef(cdm.cdmObjectType.dataTypeRef, supportingDataTypeName));
                    supAtt.setRelationshipRef(cdm.Corpus.MakeRef(cdm.cdmObjectType.relationshipRef, "hasA"));
                    supAtt.setExplanation(`This attribute '${attInfo.name + "_display"}' is added to the '${cdstEntityInfo.name}' entity to provide the localized display text for the value of the listLookup attribute '${attInfo.name}'`);
                    dataType.addAppliedTrait("does.addSupportingAttribute").addArgument(undefined, supAtt);
                }
                else {

                    let bestPicker : dataTypeAndRelationshipPicker;
                    let bestScore = 0;
                    let bestType : string;
                    let bestTrait : string;
                    let bestRelationship : string;

                    // find the highest scoring picker that can give type
                    this.getPickers().forEach(p => {
                        if (p.typeName) {
                            let scoreP = p.scoreAtttribute(attInfo.dataType, attInfo.CDSTName, attInfo.semanticType);
                            if (scoreP > bestScore) {
                                bestPicker = p;
                                bestScore = scoreP;
                            }
                        }
                    });
                    bestType = bestPicker.typeName;
                    bestTrait = bestPicker.typeTraitName;
                    bestRelationship = bestPicker.relationshipName;
                    // see if there are any that give just traits
                    if (!bestTrait) {
                        bestPicker = undefined;
                        bestScore = 0;
                        this.getPickers().forEach(p => {
                            if (!p.typeName && p.typeTraitName) {
                                let scoreP = p.scoreAtttribute(attInfo.dataType, attInfo.CDSTName, attInfo.semanticType);
                                if (scoreP > bestScore) {
                                    bestPicker = p;
                                    bestScore = scoreP;
                                }
                            }
                        });
                        if (bestPicker) {
                            bestTrait = bestPicker.typeTraitName;
                            if (!bestRelationship)
                                bestRelationship = bestPicker.relationshipName;
                        }
                    }
                    // relationships only?
                    if (!bestRelationship) {
                        bestPicker = undefined;
                        bestScore = 0;
                        this.getPickers().forEach(p => {
                            if (!p.typeName && !p.typeTraitName && p.relationshipName) {
                                let scoreP = p.scoreAtttribute(attInfo.dataType, attInfo.CDSTName, attInfo.semanticType);
                                if (scoreP > bestScore) {
                                    bestPicker = p;
                                    bestScore = scoreP;
                                }
                            }
                        });
                        if (bestPicker)
                            bestRelationship = bestPicker.relationshipName;
                    }

                    if (bestTrait) {
                        dataType = cdm.Corpus.MakeObject<cdm.ICdmDataTypeRef>(cdm.cdmObjectType.dataTypeRef, bestType)
                        dataType.addAppliedTrait(bestTrait);
                    } else {
                        dataType = cdm.Corpus.MakeRef(cdm.cdmObjectType.dataTypeRef, bestType);
                    }
                        
                    if (bestRelationship)
                        relRef = cdm.Corpus.MakeRef(cdm.cdmObjectType.relationshipRef, bestRelationship);

                }


                (cdmAtt as cdm.ICdmTypeAttributeDef).setDataTypeRef(dataType);
                cdmAtt.setRelationshipRef(relRef);

                cdmAtt.addAppliedTrait(getLocalizedTableTrait(attInfo.displayName, "is.localized.displayedAs"));
                cdmAtt.addAppliedTrait(getLocalizedTableTrait(attInfo.description, "is.localized.describedAs"));

                return cdmAtt;
            };

            cdstEntityInfo.attributeInfo.forEach(attInfo => {
                let cdmAtt : cdm.ICdmAttributeDef;

                let resultInfo : creationResultInfo = {};

                if (attInfo.dataType == "customer" || attInfo.dataType == "lookup" || attInfo.dataType == "owner" || (attInfo.relationshipInfo && attInfo.relationshipInfo.length)) {
                    // this is an entity type attribute by ref
                    let referencedEntity : string = "";
                    cdmAtt = cdm.Corpus.MakeObject(cdm.cdmObjectType.entityAttributeDef, null);
                    // make a list of all referenced entities
                    let makeRefEntity = (relInfo : any) : cdm.ICdmEntityRef =>{
                        if (referencedEntity.length)
                            referencedEntity += " and ";
                        referencedEntity += relInfo.referencedEntity;
                        let er : cdm.ICdmEntityRef = cdm.Corpus.MakeObject(cdm.cdmObjectType.entityRef, relInfo.referencedEntity);
                        let tRef = er.addAppliedTrait("is.identifiedBy");
                        tRef.addArgument(undefined, cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, relInfo.referencedEntity + "/(resolvedAttributes)/" +relInfo.referencedAttribute));
                        return er;
                    }
                    let entList = new Array<cdm.ICdmEntityRef>();
                    if (attInfo.relationshipInfo.length > 1) {
                        attInfo.relationshipInfo.forEach(relInfo => {
                            entList.push(makeRefEntity(relInfo));
                        });
                        (cdmAtt as cdm.ICdmEntityAttributeDef).setEntityRef(entList);
                    }
                    else {
                        let relInf;
                        if (attInfo.relationshipInfo && attInfo.relationshipInfo.length)
                            relInf = attInfo.relationshipInfo[0];
                        if ((!relInf && attInfo.dataType == "owner") || (relInf && relInf.referencedEntity == "Owner")) {
                            // fake up a list, there is no Owner entity
                            let relInfFake = {referencedEntity: "User", referencedAttribute:"systemUserId"};
                            entList.push(makeRefEntity(relInfFake));
                            relInfFake = {referencedEntity: "Team", referencedAttribute:"teamId"};
                            entList.push(makeRefEntity(relInfFake));
                            (cdmAtt as cdm.ICdmEntityAttributeDef).setEntityRef(entList);
                        }
                        else if (!relInf) {
                            // some we can guess at

                        }
                        else  {
                            entList.push(makeRefEntity(attInfo.relationshipInfo[0]));
                            (cdmAtt as cdm.ICdmEntityAttributeDef).setEntityRef(entList[0]);
                        }
                    }

                    if (entList.length) {
                        // set up the relationship to add the key
                        let relName = "referencesA";
                        if (attInfo.dataType === "customer")
                            relName = "referencesCustomer"
                        if (attInfo.dataType === "owner")
                            relName = "referencesOwner"
                        let rel = cdm.Corpus.MakeObject<cdm.ICdmRelationshipRef>(cdm.cdmObjectType.relationshipRef, relName)
                        let tRef = rel.addAppliedTrait("referencesA/exhibitsTraits/does.referenceEntity");
                        tRef.addArgument("addedAttribute", createTypeAttribute(attInfo, resultInfo))
                                .setExplanation(`This 'referencesA' relationship to the entity '${referencedEntity}' adds the '${attInfo.name}' attribute below to the '${cdstEntityInfo.name}' entity as a key`);
                        cdmAtt.setRelationshipRef(rel);
                    }
                    else {
                        // give up. make a regular
                        cdmAtt = createTypeAttribute(attInfo, resultInfo);
                    }
                }
                else {
                    cdmAtt = createTypeAttribute(attInfo, resultInfo);
                }

                let attGroupTarget = attGroupAll;
                // if (resultInfo.requiredLevel && resultInfo.requiredLevel != "none")
                //     attGroupTarget = attGroupRequired;

                attGroupTarget.addMemberAttributeDef(cdmAtt as any);
                
            });

            // go back and set this to what was found in the rest of the list
            if (relRefStatus)
                relRefStatus.addAppliedTrait("is.correlatedWith").addArgument(undefined, cdm.Corpus.MakeObject(cdm.cdmObjectType.stringConstant, attNameState));

            cdmEntity.addAttributeDef(cdm.Corpus.MakeRef(cdm.cdmObjectType.attributeGroupRef, attGroupAll) as cdm.ICdmAttributeGroupRef);
        }

    }

    static getPickers() : dataTypeAndRelationshipPicker[] {
        let typeIsString = (type : string) : boolean =>{
            return (type === "text" || type === "ntext" || type ==="nvarchar");
        }
        let typeIsGuid = (type : string) : boolean =>{
            return (type === "uniqueidentifier" || type === "primarykey" || type ==="lookup" || type ==="customer" || type ==="owner" || type ==="partylist");
        }
        let nameContains = (name : string, sub : string) : boolean => {
            return name.toUpperCase().includes(sub.toUpperCase(), 0);
        }
        let stringTypeNameContains = (type : string, name : string, sub : string) : boolean => {
            if (!typeIsString(type))
                return false;
            return nameContains(name, sub);
        }
        let guidTypeNameContains = (type : string, name : string, sub : string) : boolean => {
            if (!typeIsGuid(type))
                return false;
            return nameContains(name, sub);
        }

        return [
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return (type === "image" ? .25 : 0);
                },
                get typeName() { return "image"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return (type === "uniqueidentifier" ? .25 : 0);
                },
                get typeName() { return "guid"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return (type === "datetime" ? .25 : 0);
                },
                get typeName() { return "dateTime"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return (type === "money" ? .25 : 0);
                },
                get typeName() { return "currency"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return (type === "decimal" ? .25 : 0);
                },
                get typeName() { return "decimal"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return (type === "float" ? .25 : 0);
                },
                get typeName() { return "double"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return (type === "int" ? .25 : 0);
                },
                get typeName() { return "integer"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return ((type === "tinyint" || type === "smallint") ? .25 : 0);
                },
                get typeName() { return "smallInteger"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return ((type === "bigint" || type === "timestamp") ? .25 : 0);
                },
                get typeName() { return "bigInteger"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return ((type === "bit" || type === "managedproperty") ? .25 : 0);
                },
                get typeName() { return "boolean"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return ((type === "primarykey" || type === "lookup" || type ==="lookup" || type ==="customer" || type ==="owner") ? .25 : 0);
                },
                get typeName() { return "entityId"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return (typeIsString(type) ? .25 : 0);
                },
                get typeName() { return "string"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (type ==="partylist" || semanticType == "phonepartylist" || semanticType == "emailpartylist" || semanticType == "faxpartylist" || semanticType == "letterpartylist")
                        return 1;
                    return 0;
                },
                get typeName() { return "partylist"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (semanticType == "locale" || semanticType == "language")
                        return .75;
                    return 0;
                },
                get typeName() { return "language"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return stringTypeNameContains(type, internalName, "_LINE") ? .75 : 0;
                },
                get typeName() { return "addressLine"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return stringTypeNameContains(type, internalName, "_CITY") ? .75 : 0;
                },
                get typeName() { return "city"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return stringTypeNameContains(type, internalName, "_COUNTRY") ? .75 : 0;
                },
                get typeName() { return "country"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return stringTypeNameContains(type, internalName, "_COUNTY") ? .75 : 0;
                },
                get typeName() { return "county"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return nameContains(internalName, "_LATITUDE") ? .75 : 0;
                },
                get typeName() { return "latitude"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return nameContains(internalName, "_LONGITUDE") ? .75 : 0;
                },
                get typeName() { return "longitude"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return nameContains(internalName, "_POSTALCODE") ? .75 : 0;
                },
                get typeName() { return "postalCode"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return stringTypeNameContains(type, internalName, "_STATEORPROVINCE") ? .75 : 0;
                },
                get typeName() { return "stateOrProvince"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return semanticType === "timezone"  ? .75 : 0;
                },
                get typeName() { return "timezone"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return semanticType === "duration" && nameContains(internalName, "MINUTES") ? .75 : 0;
                },
                get typeTraitName() { return "means.measurement.duration.minutes"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return (semanticType === "duration") ? .65 : 0;
                },
                get typeTraitName() { return "means.measurement.duration"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    return stringTypeNameContains(type, internalName, "COLOR") ? .33 : 0;
                },
                get typeName() { return "colorName"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (type === "datetime" && nameContains(internalName, "CREAT")) 
                        return .7;
                    return 0;
                },
                get relationshipName() { return "createdOn"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (type === "datetime" && nameContains(internalName, "MODIF")) 
                        return .7;
                    return 0;
                },
                get relationshipName() { return "modifiedOn"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (semanticType === "versionnumber") 
                        return 1;
                    return 0;
                },
                get typeTraitName() { return "means.measurement.version"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (internalName === "governmentid") 
                        return 1;
                    return 0;
                },
                get typeName() { return "governmentId"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (internalName === "name") 
                        return 1;
                    return 0;
                },
                get typeName() { return "name"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (stringTypeNameContains(type, internalName, "NAME"))
                        return .4;
                    return 0;
                },
                get typeName() { return "name"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (stringTypeNameContains(type, internalName, "FIRSTNAME"))
                        return .6;
                    return 0;
                },
                get typeName() { return "firstName"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (stringTypeNameContains(type, internalName, "FULLNAME"))
                        return .6;
                    return 0;
                },
                get typeName() { return "fullName"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (stringTypeNameContains(type, internalName, "LASTNAME"))
                        return .6;
                    return 0;
                },
                get typeName() { return "lastName"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (stringTypeNameContains(type, internalName, "MIDDLENAME"))
                        return .6;
                    return 0;
                },
                get typeName() { return "middleName"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (stringTypeNameContains(type, internalName, "EMAIL") && !stringTypeNameContains(type, internalName, "TEMPLATE"))
                        return .4;
                    return 0;
                },
                get typeName() { return "email"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (semanticType === "email")
                        return 1;
                    return 0;
                },
                get typeName() { return "email"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (stringTypeNameContains(type, internalName, "PHONE"))
                        return .4;
                    return 0;
                },
                get typeName() { return "phone"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (semanticType === "phone")
                        return .75;
                    return 0;
                },
                get typeName() { return "phone"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (semanticType === "phone" && stringTypeNameContains(type, internalName, "CELL"))
                        return 1;
                    return 0;
                },
                get typeName() { return "phoneCell"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (semanticType === "phone" && stringTypeNameContains(type, internalName, "FAX"))
                        return 1;
                    return 0;
                },
                get typeName() { return "phoneFax"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (stringTypeNameContains(type, internalName, "TICKERSYMBOL"))
                        return .8;
                    return 0;
                },
                get typeName() { return "tickerSymbol"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (semanticType === "tickersymbol")
                        return 1;
                    return 0;
                },
                get typeName() { return "tickerSymbol"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (semanticType === "phoneticguide")
                        return 1;
                    return 0;
                },
                get typeTraitName() { return "means.reference.phonetic"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (semanticType === "url")
                        return 1;
                    return 0;
                },
                get typeName() { return "url"; }
            },
            {
                scoreAtttribute(type : string, internalName : string, semanticType : string) : number {
                    if (stringTypeNameContains(type, internalName, "URL"))
                        return .4;
                    return 0;
                },
                get typeName() { return "url"; }
            }
            
        ]
          


    }
    
}

Startup.main(); 