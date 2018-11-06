
import * as cdm from "../../lib/cdm-types";
import * as ghc from "../github-pages-gen/gh-content-gen";
import * as loc from "../../lib/local-corpus";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";

class Startup {
    public static main(): number {

        let cdmCorpus : cdm.Corpus;
        let pathToDocRootNew = "../../schemaDocuments";
        let pathToDocRootPrev = "../../prevSchemaDocuments";

        // run over input folders recursively and process them into a hierarchical corpus of schema docs
        cdmCorpus = new cdm.Corpus(pathToDocRootNew);
        cdmCorpus.statusLevel = cdm.cdmStatusLevel.progress;
        console.log('reading source files');
        loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"), "analyticalCommon");

        let statusRpt = loc.consoleStatusReport;

        loc.resolveLocalCorpus(cdmCorpus, cdm.cdmStatusLevel.error, statusRpt).then((r:boolean) =>{
            this.createPrevDocs(cdmCorpus, pathToDocRootPrev);

            let docsRoot = "../../../CDM-dev/";
            let consts : ghc.contentConstants  = {
                docsRoot : docsRoot,
                brTemplate : "SchemaViz.html",
                brTokenScript : "{ d: \"INSERTDATA\" }",
                brTokenHTML : "<span>INSERTHTMLHERE</span>",
                brResultFile : docsRoot + "Docs/indexOld.html",
                mdTemplate : "readme_header.md",
                mdToken : "INSERT_DIRECTORY_HERE",
                coreDir : docsRoot + "prevSchemaDocuments/",
                docLocationRoot : "https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/entities/",
                ghSourceRoot : "https://github.com/Microsoft/CDM/blob/master/schemaDocuments",
                ghRawRoot : "https://raw.githubusercontent.com/Microsoft/CDM/experimental/schemaDocuments"
            };

            let hier = ghc.collectGithubFolderData(cdmCorpus);
            ghc.createGithubIndex(hier, consts);
        
            // read the template html and break it into chunks
            let fullTemplate = readFileSync(consts.brTemplate, {encoding:"utf-8"});

            let navData : any = {};
            this.buildNavData(hier, cdmCorpus, consts.ghSourceRoot, navData);
            let dataChunk = JSON.stringify(navData);
            let content = fullTemplate.replace(consts.brTokenScript, dataChunk);

            let nav = this.buildNavigation(hier, true);
            content = content.replace(consts.brTokenHTML, nav.toString());
        
            // write the result
            writeFileSync(consts.brResultFile, content, {encoding:"utf-8"});
        
            console.log('done');

        }).catch();

        
        return 0;
    }

    
    public static buildNavigation(hier : ghc.folder, alternate : boolean) : span {
        let pc = new span();
        pc.className = "parent_container";
        pc.background = alternate ? "var(--back-alternate1)" : "var(--back-alternate2)"
        var title = new span();
        pc.children.push(title);
        title.className = "group_title";
        title.text = hier.name;
        if (hier.entities) {
            var detailCont = new span();
            detailCont.className = "detail_container";
            pc.children.push(detailCont);
            hier.entities.forEach(e => {
                if (e.createUX) {
                    var entItem = new span();
                    entItem.className = "detail_item";
                    entItem.id = e.id;
                    entItem.text = e.name;
                    detailCont.children.push(entItem);
                }
            });
        };
        if (hier.folders) {
            var subCont = new span();
            subCont.className = "sub_container";
            pc.children.push(subCont);
    
            hier.folders.forEach(f => {
                subCont.children.push(this.buildNavigation(f, !alternate));
            });
        }
        return pc;
    }

    public static buildNavData(hier: ghc.folder, cdmCorpus : cdm.Corpus, ghUrl: string, navData : any) {
        interface entProp {
            id: string;
            isInternal?:PrevEntityImpl;
            extends: string;
            name: string;
            description: string;
            displayName: string;
            pointsAt: entRef[];
            attributes: attProp[];
            ghurl: string;
        }

        interface entRef {
            entityId: string;
            attributes: string[];
        }

        interface attProp {
            name: string;
            description: string;
            displayName: string;
            inherited: boolean;
            isPrimaryKey: boolean;
            dataType: string;
            semanticType: string;
            pointsAt: entRef[];
            pointedAtBy: entRef[];
        }

        let path2entId = new Map<string, string>();
        // build all entProp without refs
        let collectEntProp = (hier : ghc.folder, path : string)=>{
            if (hier.entities) {
                hier.entities.forEach(e => {
                    if (e.createUX) {
                        // lookup from path
                        let ent : cdm.ICdmEntityDef = cdmCorpus.getObjectFromCorpusPath(path + "/" + e.docName + "/" + e.name) as cdm.ICdmEntityDef;
                        // get a digested form
                        let prevEnt = new PrevEntityImpl(ent);
                        if (prevEnt.cleanUp()) {
                            path2entId.set(path + "/" + e.name, e.id);
                            // make the shape expected by explorer
                            let ep : entProp = { id:e.id, name:e.name, extends:null, pointsAt:null, attributes:null, displayName:prevEnt.displayName, description:prevEnt.description, ghurl:ghUrl + path + "/" +  e.docName};
                            ep.isInternal = prevEnt;
                            ep.attributes = new Array<attProp>();
                            prevEnt.attributes.forEach(prevAtt => {
                                let ap : attProp = {pointsAt:null, pointedAtBy:null, name:prevAtt.name, dataType:prevAtt.dataType, description:prevAtt.description, displayName : prevAtt.displayName, semanticType:null, inherited:false, isPrimaryKey: false};
                                if (prevAtt.semanticDomain) {
                                    ap.inherited = prevAtt.semanticDomain.inherited;
                                    ap.isPrimaryKey = prevAtt.semanticDomain.isPrimaryKey;
                                    ap.semanticType = prevAtt.semanticDomain.semanticTypeName;
                                }
                                ep.attributes.push(ap);
                            });
                            navData["id_" + ep.id] = ep;
                        }
                    }
                });
            };
            if (hier.folders) {
                hier.folders.forEach(f => {
                    collectEntProp(f, path+"/" + f.name);
                });
            }
        }
        collectEntProp(hier, "");

        let prevEntRef2Id = (per : PrevEntityRef) : string => {
            if (per) {
                let path = "/" + per.namespace.replace(".", "/") + "/" + per.type;
                return path2entId.get(path);
            }
        }

        // do the baseclasses
        path2entId.forEach((v, k) => {
            let ep : entProp = navData["id_" + v];
            ep.extends = prevEntRef2Id(ep.isInternal.semanticDomain.extends);
        });
        
        // relationships
        path2entId.forEach((v, k) => {
            let ep : entProp = navData["id_" + v];
            let prevE = ep.isInternal;
            if (prevE.relationships) {
                prevE.relationships.forEach(prevR => {
                    let pAt : entRef = {attributes:[prevR.referenced.attributes[0].name], entityId : prevEntRef2Id(prevR.referenced.entity)};
                    let pFrom : entRef = {attributes:[prevR.referencing.attributes[0].name], entityId : prevEntRef2Id(prevR.referencing.entity)};
                    if (!ep.pointsAt)
                        ep.pointsAt = new Array<entRef>();
                    ep.pointsAt.push(pAt);

                    // cross wire the attributes
                    let epFrom : entProp = navData["id_" + pFrom.entityId];
                    let apFrom = epFrom.attributes[epFrom.attributes.findIndex((a)=>a.name == pFrom.attributes[0])];
                    if (!apFrom.pointsAt)
                        apFrom.pointsAt = new Array<entRef>();
                    apFrom.pointsAt.push(pAt);

                    let epAt : entProp = navData["id_" + pAt.entityId];
                    let apAt = epAt.attributes[epAt.attributes.findIndex((a)=>a.name == pAt.attributes[0])];
                    if (!apAt.pointedAtBy)
                        apAt.pointedAtBy = new Array<entRef>();
                    apAt.pointedAtBy.push(pFrom);
                   
                });
            }
            ep.extends = prevEntRef2Id(ep.isInternal.semanticDomain.extends);
        });

        // clean up
        path2entId.forEach((v, k) => {
            navData["id_" + v].isInternal = undefined;
        });

    }

    public static createPrevDocs(cdmFolder : cdm.ICdmFolderDef, rootStore : string) {
        let noDoc = new Set<string>();
        noDoc.add("primitives.cdm.json");
        noDoc.add("foundations.cdm.json");
        noDoc.add("meanings.cdm.json");
        noDoc.add("dwConcepts.cdm.json");
        noDoc.add("_allImports.cdm.json");
        noDoc.add("cdsConcepts.cdm.json");
        noDoc.add("wellKnownCDSAttributeGroups.cdm.json");
    
        if (cdmFolder) {
            let folderPath = rootStore + cdmFolder.getRelativePath();
            if (!existsSync(folderPath))
                mkdirSync(folderPath);
            if (cdmFolder.getDocuments())
                cdmFolder.getDocuments().forEach(doc => {
                    if (!noDoc.has(doc.getName())) {
                        let prevDoc = new PrevDocumentImpl(doc);
                        if (prevDoc.cleanUp()) {
                            let content = JSON.stringify(prevDoc, null, 2);
                            writeFileSync(folderPath + doc.getName(), content, "utf8");
                        }
                    }

                });
            if (cdmFolder.getSubFolders()) {
                cdmFolder.getSubFolders().forEach(f => {
                    this.createPrevDocs(f, rootStore);
                });
            }
        }
    }
   
}

// jsdom was too hard to make work with modules :(
class span {
    constructor() {
        this.children = new Array<span>();
    }
    public className : string;
    public background : string;
    public text : string;
    public children : span[];
    public id : string;
    public toString() : string {
        let res = "<span";
        if (this.className)
            res += ` class="${this.className}"`;
        if (this.id)
            res += ` id="${this.id}"`;
        if (this.background)
            res += ` style="background-color: ${this.background}"`;
        res += ">";
        if (this.text)
            res += this.text;
        this.children.forEach(c => {
            res+= c.toString();
        });

        return res + "</span>";
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  shape of persisted json
////////////////////////////////////////////////////////////////////////////////////////////////////


interface PrevDocument {
    jsonSchemaSemanticVersion : string;
    entity : PrevEntity;
}

interface PrevEntity {
    semanticDomain: PrevEntitySemantic;
    description: string;
    displayName: string;
    cdsSourceName : string;
    attributes: PrevAttribute[];
    relationships: PrevRelationship[];
}

interface PrevEntitySemantic {
    class : PrevEntityRef;
    extends : PrevEntityRef;
}

interface PrevEntityRef {
    type : string;
    namespace : string;
    semanticVersion : string;
}

interface PrevAttribute {
    name : string;
    dataType : string;
    displayName: string;
    description: string;
    cdsSourceName : string;
    semanticDomain: PrevAttributeSemantic;
}

interface PrevAttributeSemantic {
    semanticTypeName : string;
    inSupportOf : string;
    isPrimaryKey : boolean;
    isReadOnly:boolean;
    maxLength: number;
    minValue: number;
    maxValue: number;
    inherited:boolean;
    constrainedList:PrevConstrainedList;
}

interface PrevConstrainedList {
    name: string;
    displayName: string;
    description: string;
    items : PrevConstrainedListValue[];
}

interface PrevConstrainedListValue {
    value: string;
    displayName: string;
    correlationValue: string;
}

interface PrevRelationship {
    name : string;
    referencing : PrevRelationshipSide;
    referenced : PrevRelationshipSide;
}

interface PrevRelationshipSide {
    entity : PrevEntityRef;
    attributes: PrevRelationshipSideAttribute[];
}

interface PrevRelationshipSideAttribute {
    name : string;
    comparisonOrder: number;
}


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class PrevDocumentImpl implements PrevDocument {
    public jsonSchemaSemanticVersion : string;
    public entity : PrevEntityImpl;

    constructor(doc : cdm.ICdmDocumentDef) {
        this.jsonSchemaSemanticVersion = "0.5.5";
        // assuming one entity per doc
        let ent = doc.getDefinitions()[0];
        if (ent.getObjectType() == cdm.cdmObjectType.entityDef) {
            this.entity = new PrevEntityImpl(ent as cdm.ICdmEntityDef);
        }
    }
    public cleanUp() : boolean {
        if (this.entity && !this.entity.cleanUp())
            this.entity = undefined;
        return this.entity != undefined;
    }
}

class PrevEntityImpl implements PrevEntity {
    public semanticDomain: PrevEntitySemanticImpl;
    public description: string;
    public displayName: string;
    public cdsSourceName : string;
    public attributes: PrevAttributeImpl[];
    public relationships: PrevRelationshipImpl[];

    constructor(ent : cdm.ICdmEntityDef) {
        this.semanticDomain = new PrevEntitySemanticImpl(ent);

        this.semanticDomain.class
        let locEnt : cdm.ICdmConstantEntityDef;
        let pVal: cdm.ParameterValue;
        let rtDesc : cdm.ResolvedTrait;
        if ((rtDesc = ent.getResolvedTraits().find("is.localized.describedAs")) && 
            (pVal=rtDesc.parameterValues.getParameterValue("localizedDisplayText")) &&
            (pVal.value) && 
            (locEnt = pVal.value.getObjectDef() as cdm.ICdmConstantEntityDef)) {
                this.description = locEnt.lookupWhere("displayText", "languageTag", "en");
        }
        if ((rtDesc = ent.getResolvedTraits().find("is.localized.displayedAs")) && 
            (pVal=rtDesc.parameterValues.getParameterValue("localizedDisplayText")) &&
            (pVal.value) && 
            (locEnt = pVal.value.getObjectDef() as cdm.ICdmConstantEntityDef)) {
                this.displayName = locEnt.lookupWhere("displayText", "languageTag", "en");
        }
        if ((rtDesc = ent.getResolvedTraits().find("is.CDS.sourceNamed")) && 
            (pVal=rtDesc.parameterValues.getParameterValue("name")) &&
            (pVal.value)) {
                this.cdsSourceName = pVal.valueString;
        }

        this.attributes = new Array<PrevAttributeImpl>();

        let atts = ent.getResolvedAttributes();
        let inherited = ent.countInheritedAttributes();
        if (atts) {
            let l = atts.set.length;
            for (var i = 0; i < l; i++) {
                let att = atts.set[i];
                this.attributes.push(new PrevAttributeImpl(att, i < inherited))
            }
        }
        
        this.relationships = new Array<PrevRelationshipImpl>();
        let rels = ent.getResolvedEntityReferences();
        rels.set.forEach(resEntRef => {
            let referencingEntity = resEntRef.referencing.entity;
            let referencingAttribute = resEntRef.referencing.getFirstAttribute(); // assumes single column keys
            resEntRef.referenced.forEach(resEntRefSideReferenced => {
                let referencedEntity = resEntRefSideReferenced.entity;
                let referencedAttribute = resEntRefSideReferenced.getFirstAttribute();// assumes single column keys

                if (referencedEntity && referencedAttribute) {
                    let rel = new PrevRelationshipImpl();
                    rel.referenced.entity = new PrevEntityRefImpl(referencedEntity);
                    rel.referenced.attributes.push(new PrevRelationshipSideAttributeImpl(referencedAttribute.resolvedName));
                    rel.referencing.entity = new PrevEntityRefImpl(referencingEntity);
                    rel.referencing.attributes.push(new PrevRelationshipSideAttributeImpl(referencingAttribute.resolvedName));
                    this.relationships.push(rel);
                }
            });
        });
    }

    public cleanUp() : boolean {

        if (this.attributes.length) {
            for(let i=0; i < this.attributes.length; i++) {
                this.attributes[i].cleanUp();
            }
        }
        else 
            this.attributes = undefined;

        if (this.relationships.length) {
            for(let i=0; i < this.relationships.length; i++) {
                if (!this.relationships[i] || !this.relationships[i].cleanUp()) {
                    this.relationships.splice(i, 1);
                    i--;
                }
            }
        }
        if (!this.relationships.length)
            this.relationships = undefined;

        if (!this.semanticDomain.cleanUp())
            this.semanticDomain = undefined;
        
        if (!this.semanticDomain || (!this.attributes && !this.relationships))
            return false;
        return true;
    }

}

class PrevEntitySemanticImpl implements PrevEntitySemantic {
    public class : PrevEntityRefImpl;
    public extends : PrevEntityRefImpl;

    constructor(ent : cdm.ICdmEntityDef) {
        this.class = new PrevEntityRefImpl(ent);
        if (ent.getExtendsEntityRef())
            this.extends = new PrevEntityRefImpl(ent.getExtendsEntityRef().getObjectDef())
    }
    public cleanUp() : boolean {
        if (!this.class.cleanUp())
            this.class = undefined;
        if (this.extends && !this.extends.cleanUp())
            this.extends = undefined;
            
        return this.class != undefined;
    }
}

class PrevEntityRefImpl implements PrevEntityRef {
    public type : string;
    public namespace : string;
    public semanticVersion : string;

    constructor(ent : cdm.ICdmEntityDef) {
        this.semanticVersion = "0.5.5";
        this.type = ent.getName();
        this.namespace = ent.getObjectPath();
        // prune back to before the doc name
        let end = this.namespace.lastIndexOf("/");
        if (end > 0)
            this.namespace = this.namespace.slice(0, end);
        end = this.namespace.lastIndexOf("/");
        if (end >= 0)
            this.namespace = this.namespace.slice(0, end);
        if (this.namespace.indexOf("/") == 0)
            this.namespace = this.namespace.slice(1);

        this.namespace = this.namespace.replace("/", ".");

        if (this.type == "CdmObject")
            this.type = undefined;
    }

    public cleanUp() : boolean {
        return this.type != undefined;
    }
}

class PrevAttributeImpl implements PrevAttribute {
    public name : string;
    public dataType : string;
    public displayName: string;
    public description: string;
    public cdsSourceName : string;
    public semanticDomain: PrevAttributeSemanticImpl;

    constructor(resAtt : cdm.ResolvedAttribute, inherited : boolean) {
        this.name = resAtt.resolvedName;
        let locEnt : cdm.ICdmConstantEntityDef;
        let pVal: cdm.ParameterValue;
        let rtDesc : cdm.ResolvedTrait;
        if ((rtDesc = resAtt.resolvedTraits.find("is.localized.describedAs")) && 
            (pVal=rtDesc.parameterValues.getParameterValue("localizedDisplayText")) &&
            (pVal.value) && 
            (locEnt = pVal.value.getObjectDef() as cdm.ICdmConstantEntityDef)) {
                this.description = locEnt.lookupWhere("displayText", "languageTag", "en");
        }
        if ((rtDesc = resAtt.resolvedTraits.find("is.localized.displayedAs")) && 
            (pVal=rtDesc.parameterValues.getParameterValue("localizedDisplayText")) &&
            (pVal.value) && 
            (locEnt = pVal.value.getObjectDef() as cdm.ICdmConstantEntityDef)) {
                this.displayName = locEnt.lookupWhere("displayText", "languageTag", "en");
        }
        if ((rtDesc = resAtt.resolvedTraits.find("is.CDS.sourceNamed")) && 
            (pVal=rtDesc.parameterValues.getParameterValue("name")) &&
            (pVal.value)) {
                this.cdsSourceName = pVal.valueString;
        }

        let isBig = false;
        let isSmall = false;
        let baseType : string = "unclassified";
        this.semanticDomain = new PrevAttributeSemanticImpl();
        if (inherited)
            this.semanticDomain.inherited = inherited;

        let l = resAtt.resolvedTraits.set.length;
        for (let i = 0; i < l; i++) {
            const raName = resAtt.resolvedTraits.set[i].traitName;
            let pValSet = resAtt.resolvedTraits.set[i].parameterValues;
            
            switch (raName) {
                case "is.dataFormat.big":
                    isBig = true;
                    break;
                case "is.dataFormat.small":
                    isSmall = true;
                    break;
                case "is.dataFormat.integer":
                    baseType = "Int";
                    break;
                case "is.dataFormat.floatingPoint":
                    baseType = "Float";
                    break;
                case "is.dataFormat.characters":
                    baseType = "String";
                    break;
                case "is.dataFormat.bytes":
                    baseType = "Binary";
                    break;
                case "is.dataFormat.date":
                    if (baseType == "Time")
                        baseType = "DateTimeOffset";
                    else
                        baseType = "Date";
                    break;
                case "is.dataFormat.time":
                    if (baseType == "Date")
                        baseType = "DateTimeOffset";
                    else
                        baseType = "Time";
                    break;
                case "is.dataFormat.boolean":
                    baseType = "Boolean";
                    break;
                case "is.dataFormat.numeric.shaped":
                    baseType = "Decimal";
                    break;
                case "means.identity.entityId":
                    baseType = "Guid";
                    break;
                case "is.identifiedBy":
                    this.semanticDomain.isPrimaryKey = true;
                    break;
                case "is.addedInSupportOf":
                    this.semanticDomain.inSupportOf = pValSet.getParameterValue("inSupportOf").valueString;
                    this.semanticDomain.isReadOnly=true;
                    break;
                case "is.constrained":
                    pVal = pValSet.getParameterValue("maximumLength");
                    if (pVal && pVal.value)
                        this.semanticDomain.maxLength = Number.parseInt(pVal.valueString);
                    pVal = pValSet.getParameterValue("maximumValue");
                    if (pVal && pVal.value)
                        this.semanticDomain.maxValue = Number.parseFloat(pVal.valueString);
                    pVal = pValSet.getParameterValue("minimumValue");
                    if (pVal && pVal.value)
                        this.semanticDomain.minValue = Number.parseFloat(pVal.valueString);
                    break;
                case "does.haveDefault":
                    if ((pVal = pValSet.getParameterValue("default")) &&
                        (locEnt = pVal.value.getObjectDef() as cdm.ICdmConstantEntityDef)) {
                        let locAtt = locEnt.getResolvedAttributes();
                        let corVal = locAtt.get("correlatedValue") ? true : false;
                        let cvs = locEnt.getConstantValues();
                        if (cvs && cvs.length) {
                            for (let i=0; i< cvs.length; i++) {
                                let clv = new PrevConstrainedListValueImpl();
                                clv.displayName = cvs[i][1];
                                clv.value = cvs[i][2]; 
                                if (corVal)
                                    clv.correlationValue = cvs[i][4]; 
                                this.semanticDomain.constrainedList.items.push(clv);
                            }
                        }
                    }
                    break;
                default:
                    if (raName.startsWith("means.")) {
                        if (this.semanticDomain.semanticTypeName) {
                            this.semanticDomain.semanticTypeName += ", " + raName;
                        }
                        else
                            this.semanticDomain.semanticTypeName = raName;
                    }
                    break;
            }
        }

        if (baseType == "Float" && isBig)
            baseType = "Double";
        if (baseType == "Int" && isBig)
            baseType = "Int64";
        if (baseType == "Int" && isSmall)
            baseType = "Int16";
        if (baseType == "Int")
            baseType = "Int32";

        this.dataType = baseType;
   
    }
    public cleanUp() : boolean {
        if (!this.semanticDomain.cleanUp())
            this.semanticDomain = undefined;
        return true;
    }
}

class PrevAttributeSemanticImpl implements PrevAttributeSemantic {
    public semanticTypeName : string;
    public inSupportOf : string;
    public isPrimaryKey : boolean;
    public isReadOnly:boolean;
    public maxLength: number;
    public minValue: number;
    public maxValue: number;
    public inherited:boolean;
    public constrainedList:PrevConstrainedListImpl;

    constructor() {
        this.constrainedList = new PrevConstrainedListImpl();
    }

    public cleanUp() : boolean {
        if (this.constrainedList && !this.constrainedList.cleanUp())
            this.constrainedList = undefined;
        if (!this.semanticTypeName && !this.inSupportOf && !this.isPrimaryKey && !this.isReadOnly && !this.maxLength && !this.minValue && !this.maxValue && !this.inherited && !this.constrainedList)
            return false;
        return true;
    }
}

class PrevConstrainedListImpl implements PrevConstrainedList {
    public name: string;
    public displayName: string;
    public description: string;
    public items : PrevConstrainedListValueImpl[];

    constructor() {
        this.items = new Array<PrevConstrainedListValueImpl>();
    }
    public cleanUp() : boolean {
        if (this.items.length) {
            for(let i=0; i < this.items.length; i++) {
                if (!this.items[i] || !this.items[i].cleanUp()) {
                    this.items.splice(i, 1);
                    i--;
                }
            }
        }

        if (this.items.length == 0) {
            this.items = undefined;
            return false;
        }
        return true;
    }
}

class PrevConstrainedListValueImpl implements PrevConstrainedListValue {
    public value: string;
    public displayName: string;
    public correlationValue: string;

    constructor() {
    }
    public cleanUp() : boolean {
        return this.value != undefined;
    }
}

class PrevRelationshipImpl implements PrevRelationship {
    public name : string;
    public referencing : PrevRelationshipSideImpl;
    public referenced : PrevRelationshipSideImpl;

    constructor() {
        this.referencing = new PrevRelationshipSideImpl();
        this.referenced = new PrevRelationshipSideImpl();
    }
    public cleanUp() : boolean {
        if (!this.referencing.cleanUp())
            this.referencing = undefined;
        if (!this.referenced.cleanUp())
            this.referenced = undefined;
        if (!this.referencing || !this.referenced)
            return false;
        return true;
    }
}

class PrevRelationshipSideImpl implements PrevRelationshipSide {
    public entity : PrevEntityRefImpl;
    public attributes: PrevRelationshipSideAttributeImpl[];

    constructor() {
        this.attributes = new Array<PrevRelationshipSideAttributeImpl>();
    }
    public cleanUp() : boolean {
        if (!this.attributes.length)
            this.attributes = undefined;
        if (!this.attributes || !this.entity || !this.attributes[0].cleanUp())
            return false;
        return true;
    }
}

class PrevRelationshipSideAttributeImpl implements PrevRelationshipSideAttribute {
    public name : string;
    public comparisonOrder: number;

    constructor(name: string) {
        this.name = name;
        this.comparisonOrder = 0;
    }
    public cleanUp() : boolean {
        if (!this.name)
            return false;
        return true;
    }
}



Startup.main(); 

