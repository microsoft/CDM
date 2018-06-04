(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cdm2dplx = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class DataPoolImpl {
    constructor() {
        this.name = "ExampleDataPool";
        this.culture = "en-EN";
        //this.collation = "_CS"
        //this.isHidden = false;
        //this.isGdpr = false;
        //this.pii = "Unclassified";
        this.entities = new Array();
        this.relationships = new Array();
    }
    cleanUp() {
        if (this.entities.length == 0)
            this.entities = undefined;
        if (this.relationships.length == 0)
            this.relationships = undefined;
    }
}
class DPEntityImpl {
    constructor() {
        this.$type = "LocalEntity";
        this.name = "";
        this.description = "";
        this.dataCategory = "";
        //this.pii = "Unclassified";
        this.annotations = new Array();
        this.attributes = new Array();
        this.partitions = new Array();
    }
    cleanUp() {
        //if (this.pii == "Unclassified")
        //    this.pii = undefined;
        if (this.annotations.length == 0)
            this.annotations = undefined;
        if (this.attributes.length == 0)
            this.attributes = undefined;
        if (this.partitions.length == 0)
            this.partitions = undefined;
    }
}
class DPPartitionImpl {
    constructor(pattern, entityName) {
        this.location = entityName.replace(/(.+)/, pattern);
    }
}
class DPAttributeImpl {
    //pii: string;
    //isHidden: boolean;
    constructor() {
    }
}
class DPAnnotationImpl {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
class DPRelationshipSideImpl {
}
class DPRelationshipImpl {
    constructor() {
        this.$type = "SingleKeyRelationship";
        this.fromAttribute = new DPRelationshipSideImpl();
        this.toAttribute = new DPRelationshipSideImpl();
    }
}
class Converter {
    constructor() {
        this.partitionPattern = "$1.csv";
    }
    convertEntities(entities) {
        let dp = new DataPoolImpl();
        let entitiesIncluded = new Set();
        let relationshipsSeen = new Array();
        for (let iEnt = 0; iEnt < entities.length; iEnt++) {
            const cdmEntity = entities[iEnt];
            // remember what was sent to pick out the 'good' relationships at the end
            entitiesIncluded.add(cdmEntity);
            let rels = cdmEntity.getResolvedEntityReferences();
            if (rels)
                relationshipsSeen.push(rels);
            // make the entity thing
            let dpEnt = new DPEntityImpl();
            dpEnt.name = cdmEntity.getName();
            if (this.bindingType === "byol")
                dpEnt.partitions.push(new DPPartitionImpl(this.partitionPattern, dpEnt.name));
            // datacategory is the same as name for cdm
            dpEnt.dataCategory = dpEnt.name;
            // get the traits of the entity 
            let rtsEnt = cdmEntity.getResolvedTraits();
            // any traits that are derived from 'is.CDM.Id' identify special attribute groups 
            // also look for the description, pii
            let attSets = new Array();
            let isPII = false;
            let isHidden = false;
            rtsEnt.set.forEach(rt => {
                if (rt.trait.isDerivedFrom("is.CDM.Id"))
                    attSets.push(rt.traitName);
                if (rt.trait.isDerivedFrom("is.sensitive.PII"))
                    isPII = true;
                if (rt.trait.isDerivedFrom("is.hidden"))
                    isHidden = true;
                if (rt.traitName === "is.localized.describedAs") {
                    let localizedTableRef = rt.parameterValues.getParameterValue("localizedDisplayText").value;
                    if (localizedTableRef)
                        dpEnt.description = localizedTableRef.getObjectDef().lookupWhere("displayText", "languageTag", "en");
                }
            });
            if (attSets.length)
                dpEnt.annotations.push(new DPAnnotationImpl("ContainedAttributeSets", attSets));
            // if (isPII)
            //     dpEnt.pii = "CustomerContent";
            // if (isHidden)
            //     dpEnt.isHidden = true;
            // get all attributes of the entity
            let ras = cdmEntity.getResolvedAttributes();
            ras.set.forEach(ra => {
                let dpAtt = new DPAttributeImpl();
                dpAtt.name = ra.resolvedName;
                let descTrait;
                if (descTrait = ra.resolvedTraits.find("is.localized.describedAs")) {
                    let localizedTableRef = descTrait.parameterValues.getParameterValue("localizedDisplayText").value;
                    if (localizedTableRef)
                        dpAtt.description = localizedTableRef.getObjectDef().lookupWhere("displayText", "languageTag", "en");
                }
                // if (ra.resolvedTraits.find("is.sensitive.PII")) 
                //     dpAtt.pii = "CustomerContent";
                // if (ra.resolvedTraits.find("is.hidden"))
                //     dpAtt.isHidden = true;                    
                dpAtt.dataType = this.traits2DataType(ra.resolvedTraits);
                dpAtt.dataCategory = this.traits2DataCategory(ra.resolvedTraits);
                dpEnt.attributes.push(dpAtt);
            });
            dpEnt.cleanUp();
            dp.entities.push(dpEnt);
        }
        // now pick out all of the relationships that matter for the selected entities
        relationshipsSeen.forEach(entRels => {
            entRels.set.forEach(resEntRef => {
                let referencingEntity = resEntRef.referencing.entity;
                let referencingAttribute = resEntRef.referencing.getFirstAttribute(); // assumes single column keys
                resEntRef.referenced.forEach(resEntRefSideReferenced => {
                    let referencedEntity = resEntRefSideReferenced.entity;
                    let referencedAttribute = resEntRefSideReferenced.getFirstAttribute(); // assumes single column keys
                    if (referencedEntity && referencedAttribute && entitiesIncluded.has(referencingEntity) && entitiesIncluded.has(referencedEntity)) {
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
        dp.cleanUp();
        return dp;
    }
    traits2DataType(rts) {
        let isBig = false;
        let isSmall = false;
        let baseType = "unclassified";
        let l = rts.set.length;
        for (let i = 0; i < l; i++) {
            const raName = rts.set[i].traitName;
            switch (raName) {
                case "is.dataFormat.big":
                    isBig = true;
                    break;
                case "is.dataFormat.small":
                    isSmall = true;
                    break;
                case "is.dataFormat.integer":
                    baseType = "int";
                    break;
                case "is.dataFormat.floatingPoint":
                    baseType = "float";
                    break;
                case "is.dataFormat.characters":
                    baseType = "string";
                    break;
                case "is.dataFormat.bytes":
                    baseType = "string";
                    break;
                case "is.dataFormat.date":
                    if (baseType == "time")
                        baseType = "dateTime";
                    else
                        baseType = "date";
                    break;
                case "is.dataFormat.time":
                    if (baseType == "date")
                        baseType = "dateTime";
                    else
                        baseType = "time";
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
        // and now throw away everything we just learned and smash into this set :)
        if (baseType == "float")
            baseType = "double";
        if (baseType == "int")
            baseType = "int64";
        if (baseType == "date" || baseType == "time")
            baseType = "dateTime";
        return baseType;
    }
    traits2DataCategory(rts) {
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
}
exports.Converter = Converter;

},{}]},{},[1])(1)
});
