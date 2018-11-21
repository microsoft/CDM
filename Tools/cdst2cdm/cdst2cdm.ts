import * as cdm from "../../src/cdm-types";
import * as loc from "../../src/local-corpus";
import { readFileSync} from "fs";
import { WSASERVICE_NOT_FOUND } from "constants";
import * as path from "path";

let cdsStandards : Set<string> = new Set<string>();
cdsStandards.add("createdBy");
cdsStandards.add("createdOn");
cdsStandards.add("createdOnBehalfBy");
cdsStandards.add("modifiedBy");
cdsStandards.add("modifiedOn");
cdsStandards.add("modifiedOnBehalfBy");
cdsStandards.add("overriddenCreatedOn");
cdsStandards.add("importSequenceNumber");
cdsStandards.add("ownerId");
cdsStandards.add("owningBusinessUnit");
cdsStandards.add("owningTeam");
cdsStandards.add("owningUser");
cdsStandards.add("timeZoneRuleVersionNumber");
cdsStandards.add("UTCConversionTimeZoneCode");
cdsStandards.add("versionNumber");

interface dataTypeAndRelationshipPicker {
    scoreAtttribute(type : string, internalName : string, semanticType : string) : number;
    typeName? : string;
    typeTraitName? : string;
    relationshipName? : string;
}

class Startup {
    public static main(): number {

        let now = Date.now();
        let cdmCorpus : cdm.ICdmCorpusDef;
        let pathToDocRoot = path.join(__dirname, "../../schemaDocuments");

        // run over input folders recursively and process them into a hierarchical corpus of schema docs
        console.log('reading source file');
        let cdstCorpus = JSON.parse(readFileSync("Tools/cdst2cdm/entitycorpus.json", "utf8"));

        console.log('creating cdm corpus');
        if (cdstCorpus && cdstCorpus.folderInfo && cdstCorpus.folderInfo.length == 1) {
            cdmCorpus = cdm.NewCorpus(pathToDocRoot);
            cdmCorpus.setResolutionCallback(loc.consoleStatusReport, cdm.cdmStatusLevel.progress, cdm.cdmStatusLevel.error);
            this.convertCdstFolder(cdmCorpus, cdstCorpus.folderInfo[0], cdmCorpus);
        }

        console.log('persist Corpus:');
        // run over created corpus and write out the docs into the folders
        loc.persistCorpus(cdmCorpus, new cdm.TraitDirectiveSet()); 

       console.log('reading well known attribute sets');
       let wkas = readFileSync(cdmCorpus.rootPath + "/core/wellKnownCDSAttributeGroups.cdm.json", "utf8");
       let docWkas : cdm.ICdmDocumentDef = cdmCorpus.addDocumentFromContent("/core/wellKnownCDSAttributeGroups.cdm.json", wkas);

        let statusRpt = loc.consoleStatusReport;

        now = Date.now();
        loc.resolveLocalCorpus(cdmCorpus, cdm.cdmValidationStep.finished).then((r:boolean) =>{
            console.log('finished');
            console.log(Date.now() - now);
        }).catch();
        
        return 0;
    }

        
    public static convertCdstFolder(cdmCorpus : cdm.ICdmCorpusDef, cdstFolder : any, cdmFolderParent : cdm.ICdmFolderDef): cdm.ICdmFolderDef {
        let cdmFolder : cdm.ICdmFolderDef = null;
        if (cdmFolderParent && cdstFolder.name && cdstFolder.path != null) {
            if (cdmFolder = cdmFolderParent.addFolder(cdstFolder.name)) {
                // add a master import for the folder
                let masterImport : string;
                if (cdstFolder.referenceInfo && cdstFolder.referenceInfo.length) {
                    masterImport = "_allImports.cdm.json";
                    let cdmDocImp : cdm.ICdmDocumentDef = cdmFolder.addDocument("_allImports.cdm.json", "");
                    cdmDocImp.addImport("/core/cdsConcepts.cdm.json", "");
                    cdmDocImp.addImport("/core/wellKnownCDSAttributeGroups.cdm.json", "");
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
                        this.convertCdstEntityToDoc(cdmCorpus, cdmFolder, ei, masterImport);
                    });
                }

                // create the sub-folders 
                if (cdstFolder.subFolders && cdstFolder.subFolders.length) {
                    cdstFolder.subFolders.forEach(f => {
                        this.convertCdstFolder(cdmCorpus, f, cdmFolder);
                    });
                }
            }
        }
        return cdmFolder;
    }
    public static convertCdstEntityToDoc(cdmCorpus: cdm.ICdmCorpusDef, cdmFolder : cdm.ICdmFolderDef, cdstEntityInfo : any, masterImport : string): cdm.ICdmDocumentDef {
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
                this.cdstEntityToCdmEntity(cdmCorpus, cdmFolder, cdstEntityInfo, cdmEntity);
            }
        }
        return cdmDocument;
    }
    
    public static cdstEntityToCdmEntity(cdmCorpus: cdm.ICdmCorpusDef, cdmFolder : cdm.ICdmFolderDef, cdstEntityInfo : any, cdmEntity : cdm.ICdmEntityDef) {

        // is this an extension entity? make the ref
        if (cdstEntityInfo.extends) {
            cdmEntity.setExtendsEntityRef(cdmCorpus.MakeRef(cdm.cdmObjectType.entityRef, cdstEntityInfo.extends, true));
        } else if (this.isCdsStandard(cdstEntityInfo)) {
            cdmEntity.setExtendsEntityRef(cdmCorpus.MakeRef(cdm.cdmObjectType.entityRef, "CdsStandard", true));
        } else {
            cdmEntity.setExtendsEntityRef(cdmCorpus.MakeRef(cdm.cdmObjectType.entityRef, "CdmObject", true));
        }

        let getLocalizedTableTrait = (sourceText : string, traitName : string) : cdm.ICdmTraitRef => {
            if (sourceText) {
                let tRef = cdmCorpus.MakeObject<cdm.ICdmTraitRef>(cdm.cdmObjectType.traitRef, traitName);
                // make the argument nothing but a ref to a constant entity, safe since there is only one param for the trait and it looks cleaner
                let cEnt = cdmCorpus.MakeObject<cdm.ICdmConstantEntityDef>(cdm.cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(cdmCorpus.MakeRef(cdm.cdmObjectType.entityRef, "localizedTable", true));
                cEnt.setConstantValues([["en", sourceText]]);
                tRef.addArgument(undefined, cdmCorpus.MakeRef(cdm.cdmObjectType.entityRef, cEnt, false));
                return tRef;
            }
        }

        // add descriptive and display text
        cdmEntity.addExhibitedTrait(getLocalizedTableTrait(cdstEntityInfo.displayName, "is.localized.displayedAs"), false);
        cdmEntity.addExhibitedTrait(getLocalizedTableTrait(cdstEntityInfo.description, "is.localized.describedAs"), false);

        if (cdstEntityInfo.CDSTName) {
            let tRef = cdmEntity.addExhibitedTrait("is.CDS.sourceNamed", false);
            tRef.addArgument(undefined, cdstEntityInfo.CDSTName);
        }

        // for each attribute
        if (cdstEntityInfo.attributeInfo) {

            interface creationResultInfo {
                requiredLevel? : string;
            }; 

            // create an attribute group with a trait that lists the path.
            let attGroupAll = cdmCorpus.MakeObject<cdm.ICdmAttributeGroupDef>(cdm.cdmObjectType.attributeGroupDef, "attributesAddedAtThisScope");
            let tRef = cdmCorpus.MakeObject<cdm.ICdmTraitRef>(cdm.cdmObjectType.traitRef, "is.CDM.attributeGroup");
            // make the argument nothing but a ref to a constant entity, safe since there is only one param for the trait and it looks cleaner
            let cEnt = cdmCorpus.MakeObject<cdm.ICdmConstantEntityDef>(cdm.cdmObjectType.constantEntityDef);
            cEnt.setEntityShape(cdmCorpus.MakeRef(cdm.cdmObjectType.entityRef, "attributeGroupSet", true));
            let groupPath = cdmFolder.getRelativePath() + cdmEntity.getName() + ".cdm.json/" + cdmEntity.getName() + "/hasAttributes/attributesAddedAtThisScope";
            // is this an extension entity? make the ref
            cEnt.setConstantValues([[groupPath]]);
            tRef.addArgument(undefined, cdmCorpus.MakeRef(cdm.cdmObjectType.entityRef, cEnt, false));
            attGroupAll.addExhibitedTrait(tRef, false);

            let relRefStatus : cdm.ICdmRelationshipRef = null;
            let attNameState : string = "UNSPECIFIED";

            let createTypeAttribute = (attInfo : any, resultInfo : creationResultInfo) : cdm.ICdmAttributeDef => {
                let cdmAtt = cdmCorpus.MakeObject<cdm.ICdmAttributeDef>(cdm.cdmObjectType.typeAttributeDef, attInfo.name);
                // if this is the primary key, use the right relationship
                let relRef : cdm.ICdmRelationshipRef = cdmCorpus.MakeRef(cdm.cdmObjectType.relationshipRef, "hasA", true);
                if (attInfo.isPrimaryKey) {
                    relRef = cdmCorpus.MakeRef(cdm.cdmObjectType.relationshipRef, "identifiedBy", true);
                }

                // everything has one of these
                let tRef = cdmAtt.addAppliedTrait("is.CDS.sourceNamed", false);
                tRef.addArgument(undefined, attInfo.CDSTName);

                // constrained?
                if (attInfo.maxLength || attInfo.minValue || attInfo.maxValue) {
                    tRef = cdmAtt.addAppliedTrait("is.constrained", false);
                    if (attInfo.maxLength)
                        tRef.addArgument("maximumLength", attInfo.maxLength);
                    if (attInfo.minValue)
                        tRef.addArgument("minimumValue", attInfo.minValue);
                    if (attInfo.maxValue)
                        tRef.addArgument("maximumValue", attInfo.maxValue);
                }
                if (attInfo.columnNumber) {
                    tRef = cdmAtt.addAppliedTrait("is.CDS.ordered", false);
                    tRef.addArgument(undefined, attInfo.columnNumber);
                }
                if (attInfo.lookupStyle) {
                    tRef = cdmAtt.addAppliedTrait("is.CDS.lookup", false);
                    tRef.addArgument("style", attInfo.lookupStyle);
                }
                if (attInfo.calculationOf) {
                    tRef = cdmAtt.addAppliedTrait("is.calculationOf", false);
                    tRef.addArgument("sourceAttribute", attInfo.calculationOf);
                }

                if (attInfo.isNullable) {
                    tRef = cdmAtt.addAppliedTrait("is.nullable", true);
                }
                if (attInfo.requiredLevel) {
                    tRef = cdmAtt.addAppliedTrait("is.requiredAtLevel", false);
                    tRef.addArgument("level", attInfo.requiredLevel);
                    resultInfo.requiredLevel = attInfo.requiredLevel;
                }
               
                
                // figure out a data type
                let dataType : cdm.ICdmDataTypeRef;
                let dataTypeName = "listLookup";
                let supportingDataTypeName : string = "localizedDisplayText";

                if (attInfo.isPrimaryKey) {
                    dataType = cdmCorpus.MakeRef(cdm.cdmObjectType.dataTypeRef, "entityId", true);
                }
                else if (attInfo.isBaseCurrency) {
                    dataType = cdmCorpus.MakeRef(cdm.cdmObjectType.dataTypeRef, "baseCurrency", true);
                }
                else if (attInfo.dataType == "picklist" || attInfo.dataType == "state" || attInfo.dataType == "status" || attInfo.dataType == "multiselectpicklist") {
                    // option set might be just a picklist, a state or a status
                    let entityShape = "listLookupValues";
                    let entityExplanation="The constantValues below correspond to the attributes of the 'listLookupValues' entityShape which are: {languageTag, displayText, attributeValue, displayOrder}";
                    if (attInfo.dataType === "status") {
                        entityShape = "listLookupCorrelatedValues"
                        entityExplanation="The constantValues below correspond to the attributes of the 'listLookupCorrelatedValues' entityShape which are: {languageTag, displayText, attributeValue, displayOrder, correlatedValue}";
                        relRef = cdmCorpus.MakeObject(cdm.cdmObjectType.relationshipRef, "representsCorrelatedStatusWith");
                        relRefStatus = relRef; // remember for the end of the att list
                    }
                    else if (attInfo.dataType === "state") {
                        attNameState = attInfo.name; // remember for the end of the att list
                        relRef = cdmCorpus.MakeRef(cdm.cdmObjectType.relationshipRef, "representsStateWith", true);
                    }
                    else if (attInfo.dataType == "multiselectpicklist") {
                        dataTypeName = "listLookupMultiple";
                        supportingDataTypeName = "localizedDisplayTextMultiple";
                    }
                    
                    // construct the datatype 
                    dataType = cdmCorpus.MakeObject(cdm.cdmObjectType.dataTypeRef, dataTypeName);
                    // which has a trait containing the default value
                    let cEnt = cdmCorpus.MakeObject<cdm.ICdmConstantEntityDef>(cdm.cdmObjectType.constantEntityDef);
                    cEnt.setEntityShape(cdmCorpus.MakeRef(cdm.cdmObjectType.entityRef, entityShape, true));
                    cEnt.setExplanation(entityExplanation);
                    dataType.addAppliedTrait("does.haveDefault", false).addArgument(undefined, cdmCorpus.MakeRef(cdm.cdmObjectType.entityRef, cEnt, false));
                    
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
                    let supAtt = cdmCorpus.MakeObject<cdm.ICdmTypeAttributeDef>(cdm.cdmObjectType.typeAttributeDef, attInfo.name + "_display");
                    supAtt.setDataTypeRef(cdmCorpus.MakeRef(cdm.cdmObjectType.dataTypeRef, supportingDataTypeName, true));
                    supAtt.setRelationshipRef(cdmCorpus.MakeRef(cdm.cdmObjectType.relationshipRef, "hasA", true));
                    supAtt.setExplanation(`This attribute '${attInfo.name + "_display"}' is added to the '${cdstEntityInfo.name}' entity to provide the localized display text for the value of the listLookup attribute '${attInfo.name}'`);
                    dataType.addAppliedTrait("does.addSupportingAttribute", false).addArgument(undefined, supAtt);
                    supAtt.addAppliedTrait("is.readOnly", true);
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
                        dataType = cdmCorpus.MakeObject<cdm.ICdmDataTypeRef>(cdm.cdmObjectType.dataTypeRef, bestType)
                        dataType.addAppliedTrait(bestTrait, true);
                    } else {
                        dataType = cdmCorpus.MakeRef(cdm.cdmObjectType.dataTypeRef, bestType, true);
                    }
                        
                    if (bestRelationship)
                        relRef = cdmCorpus.MakeRef(cdm.cdmObjectType.relationshipRef, bestRelationship, true);

                }


                (cdmAtt as cdm.ICdmTypeAttributeDef).setDataTypeRef(dataType);
                cdmAtt.setRelationshipRef(relRef);

                cdmAtt.addAppliedTrait(getLocalizedTableTrait(attInfo.displayName, "is.localized.displayedAs"), false);
                cdmAtt.addAppliedTrait(getLocalizedTableTrait(attInfo.description, "is.localized.describedAs"), false);

                return cdmAtt;
            };

            cdstEntityInfo.attributeInfo.forEach(attInfo => {
                let cdmAtt : cdm.ICdmAttributeDef;

                let resultInfo : creationResultInfo = {};

                if (cdmEntity.getExtendsEntityRef().getObjectDefName() == "CdsStandard" && cdsStandards.has(attInfo.name))
                    return;

                if (attInfo.dataType == "customer" || attInfo.dataType == "lookup" || attInfo.dataType == "owner" || (attInfo.relationshipInfo && attInfo.relationshipInfo.length)) {
                    // this is an entity type attribute by ref
                    let referencedEntity : string = "";
                    cdmAtt = cdmCorpus.MakeObject<cdm.ICdmEntityAttributeDef>(cdm.cdmObjectType.entityAttributeDef, "comeupwithaname");
                    // make a list of all referenced entities
                    let makeRefEntity = (relInfo : any) : cdm.ICdmEntityRef => {
                        if (referencedEntity.length)
                            referencedEntity += " and ";
                        referencedEntity += relInfo.referencedEntity;
                        let er = cdmCorpus.MakeObject<cdm.ICdmEntityRef>(cdm.cdmObjectType.entityRef, relInfo.referencedEntity);
                        let tRef = er.addAppliedTrait("is.identifiedBy", false);
                        tRef.addArgument(undefined, relInfo.referencedEntity + "/(resolvedAttributes)/" +relInfo.referencedAttribute);
                        return er;
                    }
                    let makeEntityAtt = (relInfo: any) => {
                        let entityAtt = cdmCorpus.MakeObject<cdm.ICdmEntityAttributeDef>(cdm.cdmObjectType.entityAttributeDef, `${relInfo.referencedEntity.toLowerCase()}Option`);
                        entityAtt.setEntityRef(makeRefEntity(relInfo));
                        return entityAtt;
                    };
                    // create a ref to the wrapper entity
                    let makeRefWrapper = (entityDef : cdm.ICdmEntityDef) : cdm.ICdmEntityRef => {
                        let entityRefWrapper = cdmCorpus.MakeObject<cdm.ICdmEntityRef>(cdm.cdmObjectType.entityRef);
                        entityRefWrapper.setObjectDef(entityDef);
                        return entityRefWrapper;
                    };
                    // store list of entities as attributes in a (wrapper) entity
                    let entList = cdmCorpus.MakeObject<cdm.ICdmEntityDef>(cdm.cdmObjectType.entityDef);
                    if (attInfo.relationshipInfo.length > 1) {
                        attInfo.relationshipInfo.forEach(relInfo => {
                            entList.addAttributeDef(makeEntityAtt(relInfo));
                        });
                        (cdmAtt as cdm.ICdmEntityAttributeDef).setEntityRef(makeRefWrapper(entList));
                    }
                    else {
                        let relInf;
                        if (attInfo.relationshipInfo && attInfo.relationshipInfo.length)
                            relInf = attInfo.relationshipInfo[0];
                        if ((!relInf && attInfo.dataType == "owner") || (relInf && relInf.referencedEntity == "Owner")) {
                            // fake up a list, there is no Owner entity
                            let relInfFake = {referencedEntity: "User", referencedAttribute:"systemUserId"};
                            entList.addAttributeDef(makeEntityAtt(relInfFake));
                            relInfFake = {referencedEntity: "Team", referencedAttribute:"teamId"};
                            entList.addAttributeDef(makeEntityAtt(relInfFake));
                            (cdmAtt as cdm.ICdmEntityAttributeDef).setEntityRef(makeRefWrapper(entList));
                        }
                        else if (!relInf) {
                            // some we can guess at

                        }
                        else  {
                            entList.addAttributeDef(makeEntityAtt(attInfo.relationshipInfo[0]));
                            (cdmAtt as cdm.ICdmEntityAttributeDef).setEntityRef(makeRefWrapper(entList));
                        }
                    }

                    if (entList.getHasAttributeDefs()) {
                        // set up the relationship to add the key
                        let relName = "referencesA";
                        if (attInfo.dataType === "customer")
                            relName = "referencesCustomer"
                        if (attInfo.dataType === "owner")
                            relName = "referencesOwner"
                        let rel = cdmCorpus.MakeObject<cdm.ICdmRelationshipRef>(cdm.cdmObjectType.relationshipRef, relName)
                        let tRef = rel.addAppliedTrait("referencesA/exhibitsTraits/does.referenceEntity", false);
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

                attGroupTarget.addAttributeDef(cdmAtt as any);
            });

            // go back and set this to what was found in the rest of the list
            if (relRefStatus)
                relRefStatus.addAppliedTrait("is.correlatedWith", false).addArgument(undefined, attNameState);

            cdmEntity.addAttributeDef(cdmCorpus.MakeRef(cdm.cdmObjectType.attributeGroupRef, attGroupAll, false) as cdm.ICdmAttributeGroupRef);
        }

    }

    static isCdsStandard(cdstEntityInfo: any) : boolean {
        let found : Set<string> = new Set<string>();
        

        for (let i = 0; i < cdstEntityInfo.attributeInfo.length; i++) {
            let name = cdstEntityInfo.attributeInfo[i].name;
            if (cdsStandards.has(name)) {
                found.add(name);
            }
        }

        return cdsStandards.size == found.size;
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
