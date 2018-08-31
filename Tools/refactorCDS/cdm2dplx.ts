import * as cdm from "../cdm-types/cdm-types"

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  public interfaces and data structures
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//  shape of persisted json
////////////////////////////////////////////////////////////////////////////////////////////////////

export interface DataPool {
    name : string;
    culture: string;
    //collation: string;
    //isHidden: boolean;
    //isGdpr: boolean;
    //pii: string;
    entities: DPEntity[];
    relationships: DPRelationship[];
}
export interface DPEntity {
    $type: string;
    name : string;
    description: string;
    //dataCategory: string;
    annotations: DPAnnotation[];
    attributes: DPAttribute[];
    partitions : DPPartition[];
}

export interface DPPartition {
    location : string;
}

export interface DPAttribute {
    name : string;
    description: string;
    dataCategory: string;
    dataType : string;
    sourceColumnName: string;
}

export interface DPAnnotation {
    name : string;
    value: string;
}

export interface DPRelationshipSide {
    entityName : string;
    attributeName: string;
}

export interface DPRelationship {
    $type : string;
    fromAttribute : DPRelationshipSide;
    toAttribute: DPRelationshipSide;
}

export interface IConvertToDplx {
    bindingType : string; // none, csv, byol
    relationshipsType : string; // none, inclusive, all
    partitionPattern : string; // a string for the partition location of an entity where $1 is replaced by entity name 
    schemaUriBase : string; // schema URI base
    schemaVersion : string; // explicit version to add to schema references
    getPostFix(): string;
    convertEntities(corpus: cdm.Corpus, entities : cdm.ICdmEntityDef[], dpName : string) : DataPool;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class DataPoolImpl implements DataPool {
    name : string;
    culture: string;
    //collation: string;
    //isHidden: boolean;
    //isGdpr: boolean;
    //pii: string;
    entities: DPEntity[];
    relationships: DPRelationship[];

    constructor() {
        this.name = "ExampleDataFlow";
        this.culture = "en-US";
        //this.collation = "_CS"
        //this.isHidden = false;
        //this.isGdpr = false;
        //this.pii = "Unclassified";
        this.entities = new Array<DPEntity>();
        this.relationships = new Array<DPRelationship>();
    }
    public cleanUp() {
        if (this.entities.length == 0)
            this.entities = undefined;
        if (this.relationships.length == 0)
            this.relationships = undefined;
    }
}
class DPEntityImpl implements DPEntity {
    name : string;
    $type: string;
    description: string;
    //dataCategory: string;
    //pii: string;
    //isHidden: boolean;
    schemas: string[];    
    annotations: DPAnnotation[];
    attributes: DPAttribute[];
    partitions : DPPartition[];
    constructor() {
        this.$type = "LocalEntity"
        this.name = "";
        this.description = "";
        //this.dataCategory = "";
        //this.pii = "Unclassified";
        this.schemas = new Array<string>();
        this.annotations = new Array<DPAnnotation>();
        this.attributes = new Array<DPAttribute>();
        this.partitions = new Array<DPPartition>();
    }
    public cleanUp() {
        //if (this.pii == "Unclassified")
        //    this.pii = undefined;
        if (this.schemas.length == 0)
            this.schemas = undefined;
        if (this.annotations.length == 0)
            this.annotations = undefined;
        if (this.attributes.length == 0)
            this.attributes = undefined;
        if (this.partitions.length == 0)
            this.partitions = undefined;
    }
}
class DPPartitionImpl implements DPPartition {
    location : string;
    constructor(pattern : string, entityName : string) {
        this.location = entityName.replace(/(.+)/, pattern);
    }
}

class DPAttributeImpl implements DPAttribute {
    name : string;
    description: string;
    dataCategory: string;
    dataType : string;
    sourceColumnName : string;
    annotations : Array<DPAnnotation>;
    //pii: string;
    //isHidden: boolean;
    constructor() {
        
    }
    public cleanUp() {
        if (this.annotations.length == 0)
            this.annotations = undefined;
    }
}

class DPAnnotationImpl implements DPAnnotation {
    name : string;
    value: any;
    constructor(name:string, value : any) {
        this.name = name;
        this.value = value;
    }
}

class DPRelationshipSideImpl implements DPRelationshipSide {
    entityName : string;
    attributeName: string;
}

class DPRelationshipImpl implements DPRelationship {
    $type : string;
    fromAttribute : DPRelationshipSide;
    toAttribute: DPRelationshipSide;
    constructor() {
        this.$type = "SingleKeyRelationship";
        this.fromAttribute = new DPRelationshipSideImpl();
        this.toAttribute = new DPRelationshipSideImpl();
    }
}



export class Converter implements IConvertToDplx {
    public bindingType : string = "none"; 
    public relationshipsType : string = "none";
    public partitionPattern : string = "$1.csv";
    public schemaUriBase: string = "";
    public schemaVersion: string = "";

    getPostFix(): string {
        return (this.schemaVersion ? "." + this.schemaVersion : "") + ".cdm.json";
    }

    public convertEntities(corpus: cdm.Corpus, entities : cdm.ICdmEntityDef[], dpName : string) : DataPool {
        let dp = new DataPoolImpl();
        dp.name = dpName;

        let entitiesIncluded = new Set<cdm.ICdmEntityDef>();
        let relationshipsSeen = new Array<cdm.ResolvedEntityReferenceSet>();

        let postFix = this.getPostFix();

        for (let iEnt = 0; iEnt < entities.length; iEnt++) {
            const cdmEntity = entities[iEnt];

            // set the resolution context to this document, so it used this entities point of view to find thing
            let wrtDoc = cdmEntity.declaredInDocument;

            // remember what was sent to pick out the 'good' relationships at the end
            entitiesIncluded.add(cdmEntity);
            let rels = cdmEntity.getResolvedEntityReferences(wrtDoc);
            if(rels)
                relationshipsSeen.push(rels);

            // make the entity thing
            let dpEnt = new DPEntityImpl();

            dpEnt.name = cdmEntity.getName();
            if (this.bindingType === "byol")
                dpEnt.partitions.push(new DPPartitionImpl(this.partitionPattern, dpEnt.name));

            // datacategory is the same as name for cdm
            //dpEnt.dataCategory = dpEnt.name;
            
            // get the traits of the entity 
            let rtsEnt = cdmEntity.getResolvedTraits(wrtDoc);
            // the trait 'is.CDM.attributeGroup' contains a table of references to the 'special' attribute groups contained by the entity.
            // also look for the description, pii
            let isPII = false;
            let isHidden = false;
            rtsEnt.set.forEach(rt => {
                if (rt.traitName === "is.CDM.attributeGroup") {
                    // get the entity held in the parameter
                    let pv : cdm.ParameterValue;
                    let ent : cdm.ICdmConstantEntityDef;
                    let cv : string[][];
                    if ((pv = rt.parameterValues.getParameterValue("groupList")) &&
                        (pv.value && (ent = (pv.value as cdm.ICdmObject).getObjectDef(wrtDoc))) &&
                        (cv = ent.getConstantValues())) {
                        cv.forEach(r => {
                            // assume this is the right entity shape. just one attribute
                            let agPath = r[0];
                            // the attributegroup path is virtual from the root of the OM hierarchy out to the name of the attribute group.
                            // turn this into just the entity doc reference 
                            let expectedEnding = `.cdm.json/${dpEnt.name}/hasAttributes/attributesAddedAtThisScope`;
                            if (agPath.endsWith(expectedEnding))
                                agPath = agPath.slice(0, agPath.length - expectedEnding.length);
                            agPath += postFix;
                            // caller might want some other prefix
                            agPath = this.schemaUriBase + agPath;
                            dpEnt.schemas.push(agPath);
                        });
                    }
                }
                if (rt.trait.isDerivedFrom(wrtDoc, "is.sensitive.PII"))
                    isPII=true;
                if (rt.trait.isDerivedFrom(wrtDoc, "is.hidden"))
                    isHidden = true;
                if (rt.traitName === "is.localized.describedAs") {
                    let localizedTableRef = rt.parameterValues.getParameterValue("localizedDisplayText").value as cdm.cdmObjectRef;
                    if (localizedTableRef) 
                        dpEnt.description = localizedTableRef.getObjectDef<cdm.ICdmConstantEntityDef>(wrtDoc).lookupWhere(wrtDoc, "displayText", "languageTag", "en");
                }
                // turn each trait into an annotation too
                //this.traitToAnnotation(rt, dpEnt.annotations);
            });
            // if (isPII)
            //     dpEnt.pii = "CustomerContent";
            // if (isHidden)
            //     dpEnt.isHidden = true;

            // get all attributes of the entity
            let ras = cdmEntity.getResolvedAttributes(wrtDoc);

            ras.set.forEach(ra => {
                let dpAtt = new DPAttributeImpl();
                dpAtt.name = ra.resolvedName;
                let descTrait;
                if (descTrait = ra.resolvedTraits.find(wrtDoc, "is.localized.describedAs")) {
                    let localizedTableRef = descTrait.parameterValues.getParameterValue("localizedDisplayText").value as cdm.cdmObjectRef;
                    if (localizedTableRef) 
                        dpAtt.description = localizedTableRef.getObjectDef<cdm.ICdmConstantEntityDef>(wrtDoc).lookupWhere(wrtDoc, "displayText", "languageTag", "en");
                }
                // if (ra.resolvedTraits.find("is.sensitive.PII")) 
                //     dpAtt.pii = "CustomerContent";
                // if (ra.resolvedTraits.find("is.hidden"))
                //     dpAtt.isHidden = true;                    

                let mapTrait : cdm.ResolvedTrait;
                if (mapTrait = ra.resolvedTraits.find(wrtDoc, "is.CDS.sourceNamed")) 
                    dpAtt.sourceColumnName = mapTrait.parameterValues.getParameterValue("name").getValueString(wrtDoc);

                dpAtt.dataType = this.traits2DataType(ra.resolvedTraits);
                dpAtt.dataCategory = this.traits2DataCategory(ra.resolvedTraits);

                // turn each trait into an annotation too
                dpAtt.annotations = new Array<DPAnnotation>();
                let rtsAtt = ra.resolvedTraits;
                rtsAtt.set.forEach(rt => {
                    //this.traitToAnnotation(rt, dpAtt.annotations);
                });

                dpAtt.cleanUp();
                dpEnt.attributes.push(dpAtt);
               
            });


            dpEnt.cleanUp()
            dp.entities.push(dpEnt);
        }
        // now pick out all of the relationships that matter for the selected entities
        if (this.relationshipsType != "none") {
            relationshipsSeen.forEach(entRels => {
                entRels.set.forEach(resEntRef => {
                    let referencingEntity = resEntRef.referencing.entity;
                    let referencingAttribute = resEntRef.referencing.getFirstAttribute(); // assumes single column keys
                    resEntRef.referenced.forEach(resEntRefSideReferenced => {
                        let referencedEntity = resEntRefSideReferenced.entity;
                        let referencedAttribute = resEntRefSideReferenced.getFirstAttribute();// assumes single column keys

                        if (referencedEntity && referencedAttribute && 
                            ((this.relationshipsType == "inclusive" && entitiesIncluded.has(referencingEntity) && entitiesIncluded.has(referencedEntity)) ||
                             (this.relationshipsType == "all"))) {
                            let dpRel = new DPRelationshipImpl();
                            dpRel.fromAttribute.entityName = referencingEntity.getName();
                            dpRel.fromAttribute.attributeName = referencingAttribute.resolvedName;
                            dpRel.toAttribute.entityName = referencedEntity.getName();
                            dpRel.toAttribute.attributeName = referencedAttribute.resolvedName;
                            dp.relationships.push(dpRel);
                        }
                    });
                });
            });
        }

        dp.cleanUp();
            
        return dp;
    }

    traits2DataType(rts : cdm.ResolvedTraitSet) : string {
        let baseType : string = "unclassified";
        let l = rts.set.length;
        for (let i = 0; i < l; i++) {
            const raName = rts.set[i].traitName;
            switch (raName) {
                case "is.dataFormat.integer":
                    baseType = "int64";
                    break;
                case "is.dataFormat.floatingPoint":
                    baseType = "double";
                    break;
                case "is.dataFormat.byte":
                case "is.dataFormat.character":
                    baseType = "string";
                    break;
                case "is.dataFormat.time":
                case "is.dataFormat.date":
                    baseType = "dateTime";
                    break;
                case "is.dataFormat.boolean":
                    baseType = "boolean";
                    break;
                case "is.dataFormat.numeric.shaped":
                    baseType = "decimal";
                    break;
                default:
                    break;
            }
        }
        
        return baseType;
    }

    traits2DataCategory(rts : cdm.ResolvedTraitSet) : string {
        let baseType = "Uncategorized";
        let fiscal = false;
        let calendar = false;
        let l = rts.set.length;
        for (let i = 0; i < l; i++) {
            const raName = rts.set[i].traitName;
            switch (raName) {
                case "means.calendar.fiscal":
                    fiscal = true;
                    break;
                case "means.calendar.dayOfWeek":
                    calendar = true;
                    baseType = "DayOfWeek";
                    break;
                case "means.calendar.dayOfMonth":
                    calendar = true;
                    baseType = "DayOfMonth";
                    break;
                case "means.calendar.dayOfYear":
                    calendar = true;
                    baseType = "DayOfYear";
                    break;
                case "means.calendar.weekOfMonth":
                    calendar = true;
                    baseType = "WeekOfMonth";
                    break;
                case "means.calendar.weekOfYear":
                    calendar = true;
                    baseType = "WeekOfYear";
                    break;
                case "means.calendar.month":
                    calendar = true;
                    baseType = "Month";
                    break;
                case "means.calendar.monthOfYear":
                    calendar = true;
                    baseType = "MonthOfYear";
                    break;
                case "means.calendar.quarter":
                    calendar = true;
                    baseType = "Quarter";
                    break;
                case "means.calendar.week":
                    calendar = true;
                    baseType = "Week";
                    break;
                case "means.calendar.year":
                    calendar = true;
                    baseType = "Year";
                    break;
                case "means.idea.account":
                    baseType = "Account";
                    break;
                case "means.idea.channel":
                    baseType = "Channel";
                    break;
                case "means.idea.customer":
                    baseType = "Customer";
                    break;
                case "means.idea.person":
                case "means.idea.person.contact":
                case "means.idea.person.employee":
                case "means.idea.person.representative":
                    baseType = "Person";
                    break;
                case "means.idea.organization":
                    baseType = "Organization";
                    break;
                case "means.idea.organization.unit":
                    baseType = "Organization.Unit";
                    break;
                case "means.idea.product":
                    baseType = "Product";
                    break;
                case "means.location.address":
                    baseType = "Location.Address";
                    break;
                case "means.location.address.street":
                    baseType = "Location.Address.Street";
                    break;
                case "means.location.city":
                    baseType = "Location.City";
                    break;
                case "means.location.continent":
                    baseType = "Location.Continent";
                    break;
                case "means.location.country":
                    baseType = "Location.Country";
                    break;
                case "means.location.county":
                    baseType = "Location.County";
                    break;
                case "means.location.latitude":
                    baseType = "Location.Latitude";
                    break;
                case "means.location.longitude":
                    baseType = "Location.Longitude";
                    break;
                case "means.location.point":
                    baseType = "Location.Point";
                    break;
                case "means.location.postalCode":
                    baseType = "Location.PostalCode";
                    break;
                case "means.location.province":
                    baseType = "Location.Province";
                    break;
                case "means.location.region":
                    baseType = "Location.Region";
                    break;
                case "means.location.stateOrProvince":
                    baseType = "Location.State";
                    break;
                case "means.location.timezone":
                    baseType = "Location.Timezone";
                    break;
                case "means.measurement.version":
                    baseType = "Measurement.Version";
                    break;
                case "means.measurement.date.creation":
                    baseType = "Measurement.Date.Creation";
                    break;
                case "means.measurement.date.modify":
                    baseType = "Measurement.Date.Modify";
                    break;
                case "means.content.binary.image":
                case "means.content.binary.image.BMP":
                case "means.content.binary.image.GIF":
                case "means.content.binary.image.JPG":
                case "means.content.binary.image.PNG":
                case "means.content.binary.image.TIFF":
                    baseType = "Image";
                    break;
                case "means.identity.barCode":
                    baseType = "BarCode";
                    break;
                case "means.identity.brand":
                    baseType = "Brand";
                    break;
                case "means.identity.governmentID":
                    baseType = "Identity.GovernmentID";
                    break;
                case "means.identity.person.firstName":
                    baseType = "Person.FirstName";
                    break;
                case "means.identity.person.fullName":
                    baseType = "Person.FullName";
                    break;
                case "means.identity.person.lastName":
                    baseType = "Person.LastName";
                    break;
                case "means.identity.person.middleName":
                    baseType = "Person.MiddleName";
                    break;
                case "means.identity.service.email":
                    baseType = "Identity.Service.Email";
                    break;
                case "means.identity.service.facebook":
                    baseType = "Identity.Service.Facebook";
                    break;
                case "means.identity.service.phone":
                case "means.identity.service.phone.cell":
                case "means.identity.service.phone.fax":
                    baseType = "Identity.Service.Phone";
                    break;
                case "means.identity.service.twitter":
                    baseType = "Identity.Service.Twitter";
                    break;
                case "means.reference.description":
                    baseType = "Reference.Description";
                    break;
                case "means.reference.phonetic":
                    baseType = "Reference.Phonetic";
                    break;
                case "means.reference.URL":
                    baseType = "Reference.URL";
                    break;
                case "means.reference.URL.image":
                    baseType = "Reference.ImageURL";
                    break;
                default:
                    break;
            }

            if (calendar) {
                if (fiscal) {
                    baseType = "Calendar.Fiscal." + baseType;
                }
                else {
                    if (baseType == "DayOfMonth" || baseType == "DayOfWeek" || baseType == "DayOfYear")
                        baseType = "Calendar." + baseType;
                    else
                        baseType = "Calendar.Date";
                }
            }
        }

        return baseType;
    }

    traitToAnnotation(wrtDoc: cdm.ICdmDocumentDef, rt : cdm.ResolvedTrait, annotations : DPAnnotation[]) {
        // skip the ugly traits
        if (!rt.trait.ugly) {
            let annotationName = "trait." + rt.traitName;
            let annotation : DPAnnotation;
            // if there are non-null parameters for the trait, they each turn into annotations
            let pv = rt.parameterValues;
            if (pv && pv.length) {
                for (let i =0; i< pv.length; i++) {
                    let paramName = pv.getParameter(i).getName();
                    let paramValue = pv.getValueString(wrtDoc, i);
                    if (paramValue) {
                        annotation = new DPAnnotationImpl(annotationName + "." + paramName, paramValue);
                        annotations.push(annotation);
                    }
                }
            }
            if (!annotation) {
                annotation = new DPAnnotationImpl(annotationName, "true");
                annotations.push(annotation);
            }
        }
    }

}


