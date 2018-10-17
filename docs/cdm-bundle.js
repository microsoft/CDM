(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cdm = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
////////////////////////////////////////////////////////////////////////////////////////////////////
//  enums
////////////////////////////////////////////////////////////////////////////////////////////////////
var cdmObjectType;
(function (cdmObjectType) {
    cdmObjectType[cdmObjectType["error"] = 0] = "error";
    cdmObjectType[cdmObjectType["import"] = 1] = "import";
    cdmObjectType[cdmObjectType["argumentDef"] = 2] = "argumentDef";
    cdmObjectType[cdmObjectType["parameterDef"] = 3] = "parameterDef";
    cdmObjectType[cdmObjectType["traitDef"] = 4] = "traitDef";
    cdmObjectType[cdmObjectType["traitRef"] = 5] = "traitRef";
    cdmObjectType[cdmObjectType["relationshipDef"] = 6] = "relationshipDef";
    cdmObjectType[cdmObjectType["relationshipRef"] = 7] = "relationshipRef";
    cdmObjectType[cdmObjectType["dataTypeDef"] = 8] = "dataTypeDef";
    cdmObjectType[cdmObjectType["dataTypeRef"] = 9] = "dataTypeRef";
    cdmObjectType[cdmObjectType["attributeRef"] = 10] = "attributeRef";
    cdmObjectType[cdmObjectType["typeAttributeDef"] = 11] = "typeAttributeDef";
    cdmObjectType[cdmObjectType["entityAttributeDef"] = 12] = "entityAttributeDef";
    cdmObjectType[cdmObjectType["attributeGroupDef"] = 13] = "attributeGroupDef";
    cdmObjectType[cdmObjectType["attributeGroupRef"] = 14] = "attributeGroupRef";
    cdmObjectType[cdmObjectType["constantEntityDef"] = 15] = "constantEntityDef";
    cdmObjectType[cdmObjectType["entityDef"] = 16] = "entityDef";
    cdmObjectType[cdmObjectType["entityRef"] = 17] = "entityRef";
    cdmObjectType[cdmObjectType["documentDef"] = 18] = "documentDef";
    cdmObjectType[cdmObjectType["folderDef"] = 19] = "folderDef";
    cdmObjectType[cdmObjectType["attributeContextDef"] = 20] = "attributeContextDef";
    cdmObjectType[cdmObjectType["attributeContextRef"] = 21] = "attributeContextRef";
})(cdmObjectType = exports.cdmObjectType || (exports.cdmObjectType = {}));
var cdmTraitSet;
(function (cdmTraitSet) {
    cdmTraitSet[cdmTraitSet["all"] = 0] = "all";
    cdmTraitSet[cdmTraitSet["elevatedOnly"] = 1] = "elevatedOnly";
    cdmTraitSet[cdmTraitSet["inheritedOnly"] = 2] = "inheritedOnly";
    cdmTraitSet[cdmTraitSet["appliedOnly"] = 3] = "appliedOnly";
})(cdmTraitSet = exports.cdmTraitSet || (exports.cdmTraitSet = {}));
var cdmValidationStep;
(function (cdmValidationStep) {
    cdmValidationStep[cdmValidationStep["start"] = 0] = "start";
    cdmValidationStep[cdmValidationStep["imports"] = 1] = "imports";
    cdmValidationStep[cdmValidationStep["integrity"] = 2] = "integrity";
    cdmValidationStep[cdmValidationStep["declarations"] = 3] = "declarations";
    cdmValidationStep[cdmValidationStep["references"] = 4] = "references";
    cdmValidationStep[cdmValidationStep["parameters"] = 5] = "parameters";
    cdmValidationStep[cdmValidationStep["traits"] = 6] = "traits";
    cdmValidationStep[cdmValidationStep["attributes"] = 7] = "attributes";
    cdmValidationStep[cdmValidationStep["entityReferences"] = 8] = "entityReferences";
    cdmValidationStep[cdmValidationStep["finished"] = 9] = "finished";
    cdmValidationStep[cdmValidationStep["error"] = 10] = "error";
})(cdmValidationStep = exports.cdmValidationStep || (exports.cdmValidationStep = {}));
var cdmAttributeContextType;
(function (cdmAttributeContextType) {
    cdmAttributeContextType[cdmAttributeContextType["entity"] = 0] = "entity";
    cdmAttributeContextType[cdmAttributeContextType["entityReferenceExtends"] = 1] = "entityReferenceExtends";
    cdmAttributeContextType[cdmAttributeContextType["entityReferenceAsAttribute"] = 2] = "entityReferenceAsAttribute";
    cdmAttributeContextType[cdmAttributeContextType["attributeGroup"] = 3] = "attributeGroup";
    cdmAttributeContextType[cdmAttributeContextType["addedAttributeSupporting"] = 4] = "addedAttributeSupporting";
    cdmAttributeContextType[cdmAttributeContextType["addedAttributeIdentity"] = 5] = "addedAttributeIdentity";
})(cdmAttributeContextType = exports.cdmAttributeContextType || (exports.cdmAttributeContextType = {}));
var cdmStatusLevel;
(function (cdmStatusLevel) {
    cdmStatusLevel[cdmStatusLevel["info"] = 0] = "info";
    cdmStatusLevel[cdmStatusLevel["progress"] = 1] = "progress";
    cdmStatusLevel[cdmStatusLevel["warning"] = 2] = "warning";
    cdmStatusLevel[cdmStatusLevel["error"] = 3] = "error";
})(cdmStatusLevel = exports.cdmStatusLevel || (exports.cdmStatusLevel = {}));
class profile {
    constructor() {
        this.calls = new Map();
        this.callStack = new Array();
    }
    measure(code) {
        let stack = new Error().stack;
        let start = stack.indexOf(" at ", 13) + 4;
        let end = stack.indexOf("(", start);
        let loc = stack.slice(start, end);
        start = stack.indexOf("js:", end) + 3;
        end = stack.indexOf(":", start);
        loc += ":" + stack.slice(start, end);
        this.callStack.push(loc);
        let cnt = this.calls.get(loc);
        if (!cnt) {
            cnt = { calls: 0, timeTotal: 0, timeExl: 0 };
            this.calls.set(loc, cnt);
        }
        cnt.calls++;
        let n = perf_hooks_1.performance.now();
        let retVal = code();
        let elaspsed = perf_hooks_1.performance.now() - n;
        if (elaspsed < 0)
            elaspsed = .00001;
        cnt.timeTotal += elaspsed;
        this.callStack.pop();
        if (this.callStack.length) {
            let locFrom = this.callStack[this.callStack.length - 1];
            cnt = this.calls.get(locFrom);
            cnt.timeExl += elaspsed;
        }
        return retVal;
    }
    report() {
        //let s = new Map([...this.calls.entries()].sort((a, b) => by == 0 ? (b[1].calls - a[1].calls) : (by == 1 ? (b[1].timeTotal - a[1].timeTotal))));
        this.calls.forEach((v, k) => {
            console.log(`${v.calls},${v.timeTotal},${v.timeTotal - v.timeExl},${k}`);
        });
    }
}
let p = new profile();
let visits;
function trackVisits(path) {
    if (!visits)
        visits = new Map();
    let cnt = 0;
    if (visits.has(path)) {
        cnt = visits.get(path) + 1;
    }
    visits.set(path, cnt);
    if (path == "Case/hasAttributes/attributesAddedAtThisScope/members/(unspecified)")
        return true;
}
class stringSpewCatcher {
    constructor() {
        this.content = "";
        this.segment = "";
    }
    clear() {
        this.content = "";
        this.segment = "";
    }
    spewLine(spew) {
        this.segment += spew + "\n";
        if (this.segment.length > 1000) {
            this.content += this.segment;
            this.segment = "";
        }
    }
    getContent() {
        return this.content + this.segment;
    }
}
exports.stringSpewCatcher = stringSpewCatcher;
class consoleSpewCatcher {
    clear() {
        console.clear();
    }
    spewLine(spew) {
        console.log(spew);
    }
}
exports.consoleSpewCatcher = consoleSpewCatcher;
class ParameterCollection {
    constructor(prior) {
        //let bodyCode = () =>
        {
            if (prior && prior.sequence)
                this.sequence = prior.sequence.slice();
            else
                this.sequence = new Array();
            if (prior && prior.lookup)
                this.lookup = new Map(prior.lookup);
            else
                this.lookup = new Map();
            if (prior && prior.ordinals)
                this.ordinals = new Map(prior.ordinals);
            else
                this.ordinals = new Map();
        }
        //return p.measure(bodyCode);
    }
    add(element) {
        //let bodyCode = () =>
        {
            // if there is already a named parameter that matches, this is trouble
            let name = element.getName();
            if (name && this.lookup.has(name))
                throw new Error(`duplicate parameter named '${name}'`);
            if (name)
                this.lookup.set(name, element);
            this.ordinals.set(element, this.sequence.length);
            this.sequence.push(element);
        }
        //return p.measure(bodyCode);
    }
    resolveParameter(ordinal, name) {
        //let bodyCode = () =>
        {
            if (name) {
                if (this.lookup.has(name))
                    return this.lookup.get(name);
                throw new Error(`there is no parameter named '${name}'`);
            }
            if (ordinal >= this.sequence.length)
                throw new Error(`too many arguments supplied`);
            return this.sequence[ordinal];
        }
        //return p.measure(bodyCode);
    }
    getParameterIndex(pName) {
        //let bodyCode = () =>
        {
            return this.ordinals.get(this.lookup.get(pName));
        }
        //return p.measure(bodyCode);
    }
}
exports.ParameterCollection = ParameterCollection;
class ParameterValue {
    constructor(param, value) {
        //let bodyCode = () =>
        {
            this.parameter = param;
            this.value = value;
        }
        //return p.measure(bodyCode);
    }
    getValueString(wrtDoc) {
        //let bodyCode = () =>
        {
            if (typeof (this.value) === "string")
                return this.value;
            let value = this.value;
            if (value) {
                // if this is a constant table, then expand into an html table
                let def = value.getObjectDef(wrtDoc);
                if (value.getObjectType() == cdmObjectType.entityRef && def && def.getObjectType() == cdmObjectType.constantEntityDef) {
                    var entShape = def.getEntityShape();
                    var entValues = def.getConstantValues();
                    if (!entValues && entValues.length == 0)
                        return "";
                    let rows = new Array();
                    var shapeAtts = entShape.getResolvedAttributes(wrtDoc);
                    let l = shapeAtts.set.length;
                    for (var r = 0; r < entValues.length; r++) {
                        var rowData = entValues[r];
                        if (rowData && rowData.length) {
                            let row = {};
                            for (var c = 0; c < rowData.length; c++) {
                                var tvalue = rowData[c];
                                row[shapeAtts.set[c].resolvedName] = tvalue;
                            }
                            rows.push(row);
                        }
                    }
                    return JSON.stringify(rows);
                }
                // should be a reference to an object
                let data = value.copyData(wrtDoc, { stringRefs: false });
                if (typeof (data) === "string")
                    return data;
                return JSON.stringify(data);
            }
            return "";
        }
        //return p.measure(bodyCode);
    }
    get name() {
        //let bodyCode = () =>
        {
            return this.parameter.getName();
        }
        //return p.measure(bodyCode);
    }
    setValue(wrtDoc, newValue) {
        //let bodyCode = () =>
        {
            this.value = ParameterValue.getReplacementValue(wrtDoc, this.value, newValue, true);
        }
        //return p.measure(bodyCode);
    }
    static getReplacementValue(wrtDoc, oldValue, newValue, wasSet) {
        //let bodyCode = () =>
        {
            if (!oldValue)
                return newValue;
            if (!wasSet) {
                // must explicitly set a value to override
                // if a new value is not set, then newValue holds nothing or the default.
                // in this case, if there was already a value in this argument then just keep using it.
                return oldValue;
            }
            if (typeof (oldValue) == "string") {
                return newValue;
            }
            let ov = oldValue;
            let nv = newValue;
            // replace an old table with a new table? actually just mash them together
            if (ov && ov.getObjectType() == cdmObjectType.entityRef &&
                nv && typeof (nv) != "string" && nv.getObjectType() == cdmObjectType.entityRef) {
                let oldEnt = ov.getObjectDef(wrtDoc);
                let newEnt = nv.getObjectDef(wrtDoc);
                // check that the entities are the same shape
                if (!newEnt)
                    return ov;
                if (!oldEnt || (oldEnt.getEntityShape() != oldEnt.getEntityShape()))
                    return nv;
                let oldCv = oldEnt.getConstantValues();
                let newCv = newEnt.getConstantValues();
                // rows in old?
                if (!oldCv || oldCv.length == 0)
                    return nv;
                // rows in new?
                if (!newCv || newCv.length == 0)
                    return ov;
                // find rows in the new one that are not in the old one. slow, but these are small usually
                let appendedRows = new Array();
                let lNew = newCv.length;
                let lOld = oldCv.length;
                for (let iNew = 0; iNew < lNew; iNew++) {
                    let newRow = newCv[iNew];
                    let lCol = newRow.length;
                    let iOld = 0;
                    for (; iOld < lOld; iOld++) {
                        let oldRow = oldCv[iOld];
                        let iCol = 0;
                        for (; iCol < lCol; iCol++) {
                            if (newRow[iCol] != oldRow[iCol])
                                break;
                        }
                        if (iCol < lCol)
                            break;
                    }
                    if (iOld < lOld) {
                        appendedRows.push(newRow);
                    }
                }
                if (!appendedRows.length)
                    return nv;
                let replacementEnt = oldEnt.copy(wrtDoc);
                let allRows = replacementEnt.getConstantValues().slice(0).concat(appendedRows);
                replacementEnt.setConstantValues(allRows);
                return Corpus.MakeRef(cdmObjectType.entityRef, replacementEnt, false);
            }
            return newValue;
        }
        //return p.measure(bodyCode);
    }
    spew(wrtDoc, to, indent) {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent}${this.name}:${this.getValueString(wrtDoc)}`);
        }
        //return p.measure(bodyCode);
    }
}
exports.ParameterValue = ParameterValue;
class ParameterValueSet {
    constructor(pc, values, wasSet) {
        //let bodyCode = () =>
        {
            this.pc = pc;
            this.values = values;
            this.wasSet = wasSet;
        }
        //return p.measure(bodyCode);
    }
    get length() {
        //let bodyCode = () =>
        {
            if (this.pc && this.pc.sequence)
                return this.pc.sequence.length;
            return 0;
        }
        //return p.measure(bodyCode);
    }
    indexOf(paramDef) {
        //let bodyCode = () =>
        {
            return this.pc.ordinals.get(paramDef);
        }
        //return p.measure(bodyCode);
    }
    getParameter(i) {
        //let bodyCode = () =>
        {
            return this.pc.sequence[i];
        }
        //return p.measure(bodyCode);
    }
    getValue(i) {
        //let bodyCode = () =>
        {
            return this.values[i];
        }
        //return p.measure(bodyCode);
    }
    getValueString(wrtDoc, i) {
        //let bodyCode = () =>
        {
            return new ParameterValue(this.pc.sequence[i], this.values[i]).getValueString(wrtDoc);
        }
        //return p.measure(bodyCode);        
    }
    getParameterValue(pName) {
        //let bodyCode = () =>
        {
            let i = this.pc.getParameterIndex(pName);
            return new ParameterValue(this.pc.sequence[i], this.values[i]);
        }
        //return p.measure(bodyCode);
    }
    setParameterValue(wrtDoc, pName, value) {
        //let bodyCode = () =>
        {
            let i = this.pc.getParameterIndex(pName);
            this.values[i] = ParameterValue.getReplacementValue(wrtDoc, this.values[i], value, true);
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copyValues = this.values.slice(0);
            let copyWasSet = this.wasSet.slice(0);
            let copy = new ParameterValueSet(this.pc, copyValues, copyWasSet);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    spew(wrtDoc, to, indent) {
        //let bodyCode = () =>
        {
            let l = this.length;
            for (let i = 0; i < l; i++) {
                let pv = new ParameterValue(this.pc.sequence[i], this.values[i]);
                pv.spew(wrtDoc, to, indent + '-');
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ParameterValueSet = ParameterValueSet;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  resolved traits
////////////////////////////////////////////////////////////////////////////////////////////////////
class ResolvedTrait {
    constructor(trait, pc, values, wasSet) {
        //let bodyCode = () =>
        {
            this.parameterValues = new ParameterValueSet(pc, values, wasSet);
            this.trait = trait;
        }
        //return p.measure(bodyCode);
    }
    get traitName() {
        //let bodyCode = () =>
        {
            return this.trait.declaredPath;
        }
        //return p.measure(bodyCode);
    }
    spew(wrtDoc, to, indent) {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent}[${this.traitName}]`);
            this.parameterValues.spew(wrtDoc, to, indent + '-');
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copyParamValues = this.parameterValues.copy();
            let copy = new ResolvedTrait(this.trait, copyParamValues.pc, copyParamValues.values, copyParamValues.wasSet);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    collectTraitNames(wrtDoc, into) {
        //let bodyCode = () =>
        {
            // get the name of this trait and all of its base classes
            let t = this.trait;
            while (t) {
                let name = t.getName();
                if (!into.has(name))
                    into.add(name);
                let baseRef = t.getExtendsTrait();
                t = baseRef ? baseRef.getObjectDef(wrtDoc) : null;
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedTrait = ResolvedTrait;
class refCounted {
    constructor() {
        //let bodyCode = () =>
        {
            this.refCnt = 0;
        }
        //return p.measure(bodyCode);
    }
    addRef() {
        //let bodyCode = () =>
        {
            this.refCnt++;
        }
        //return p.measure(bodyCode);
    }
    release() {
        //let bodyCode = () =>
        {
            this.refCnt--;
        }
        //return p.measure(bodyCode);
    }
}
class ResolvedTraitSet extends refCounted {
    constructor(wrtDoc) {
        super();
        //let bodyCode = () =>
        {
            this.wrtDoc = wrtDoc;
            this.set = new Array();
            this.lookupByTrait = new Map();
            this.modifiesAttributes = false;
            this.hasElevated = false;
        }
        //return p.measure(bodyCode);
    }
    merge(toMerge) {
        //let bodyCode = () =>
        {
            let traitSetResult = this;
            let trait = toMerge.trait;
            let av = toMerge.parameterValues.values;
            let wasSet = toMerge.parameterValues.wasSet;
            if (!this.modifiesAttributes)
                this.modifiesAttributes = trait.modifiesAttributes;
            if (!this.hasElevated)
                this.hasElevated = trait.elevated;
            if (traitSetResult.lookupByTrait.has(trait)) {
                let rtOld = traitSetResult.lookupByTrait.get(trait);
                let avOld = rtOld.parameterValues.values;
                // the new values take precedence
                let l = av.length;
                for (let i = 0; i < l; i++) {
                    if (av[i] != avOld[i]) {
                        avOld[i] = ParameterValue.getReplacementValue(this.wrtDoc, avOld[i], av[i], wasSet[i]);
                    }
                }
            }
            else {
                toMerge = toMerge.copy();
                traitSetResult.set.push(toMerge);
                traitSetResult.lookupByTrait.set(trait, toMerge);
            }
            return traitSetResult;
        }
        //return p.measure(bodyCode);
    }
    mergeSet(toMerge) {
        //let bodyCode = () =>
        {
            let traitSetResult = this;
            if (toMerge) {
                let l = toMerge.set.length;
                for (let i = 0; i < l; i++) {
                    const rt = toMerge.set[i];
                    let traitSetMerge = traitSetResult.merge(rt);
                    if (traitSetMerge !== traitSetResult) {
                        traitSetResult = traitSetMerge;
                    }
                }
            }
            return traitSetResult;
        }
        //return p.measure(bodyCode);
    }
    get(trait) {
        //let bodyCode = () =>
        {
            if (this.lookupByTrait.has(trait))
                return this.lookupByTrait.get(trait);
            return null;
        }
        //return p.measure(bodyCode);
    }
    find(wrtDoc, traitName) {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const rt = this.set[i];
                if (rt.trait.isDerivedFrom(wrtDoc, traitName))
                    return rt;
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    get size() {
        //let bodyCode = () =>
        {
            if (this.set)
                return this.set.length;
            return 0;
        }
        //return p.measure(bodyCode);
    }
    get first() {
        //let bodyCode = () =>
        {
            if (this.set)
                return this.set[0];
            return null;
        }
        //return p.measure(bodyCode);
    }
    deepCopy() {
        //let bodyCode = () =>
        {
            let copy = new ResolvedTraitSet(this.wrtDoc);
            let newSet = copy.set;
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                let rt = this.set[i];
                rt = rt.copy();
                newSet.push(rt);
                copy.lookupByTrait.set(rt.trait, rt);
            }
            copy.modifiesAttributes = this.modifiesAttributes;
            copy.hasElevated = this.hasElevated;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    shallowCopyWithException(just) {
        //let bodyCode = () =>
        {
            let copy = new ResolvedTraitSet(this.wrtDoc);
            let newSet = copy.set;
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                let rt = this.set[i];
                if (rt.trait == just)
                    rt = rt.copy();
                newSet.push(rt);
                copy.lookupByTrait.set(rt.trait, rt);
            }
            copy.modifiesAttributes = this.modifiesAttributes;
            copy.hasElevated = this.hasElevated;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    shallowCopy() {
        //let bodyCode = () =>
        {
            let copy = new ResolvedTraitSet(this.wrtDoc);
            if (this.set) {
                let newSet = copy.set;
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    let rt = this.set[i];
                    newSet.push(rt);
                    copy.lookupByTrait.set(rt.trait, rt);
                }
            }
            copy.modifiesAttributes = this.modifiesAttributes;
            copy.hasElevated = this.hasElevated;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    collectTraitNames() {
        //let bodyCode = () =>
        {
            let collection = new Set();
            if (this.set) {
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    let rt = this.set[i];
                    rt.collectTraitNames(this.wrtDoc, collection);
                }
            }
            return collection;
        }
        //return p.measure(bodyCode);
    }
    keepElevated() {
        //let bodyCode = () =>
        {
            let elevatedSet;
            let elevatedLookup;
            let result;
            let modifiesAttribute = false;
            let hasElevated = false;
            if (this.refCnt > 1) {
                result = new ResolvedTraitSet(this.wrtDoc);
                elevatedSet = result.set;
                elevatedLookup = result.lookupByTrait;
            }
            else {
                result = this;
                elevatedSet = new Array();
                elevatedLookup = new Map();
            }
            if (this.hasElevated) {
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    const rt = this.set[i];
                    if (rt.trait.elevated) {
                        hasElevated = true;
                        elevatedSet.push(rt);
                        elevatedLookup.set(rt.trait, rt);
                        if (rt.trait.modifiesAttributes)
                            modifiesAttribute = true;
                    }
                }
            }
            result.set = elevatedSet;
            result.lookupByTrait = elevatedLookup;
            result.modifiesAttributes = modifiesAttribute;
            result.hasElevated = hasElevated;
            return result;
        }
        //return p.measure(bodyCode);
    }
    removeElevated() {
        //let bodyCode = () =>
        {
            if (!this.hasElevated)
                return this;
            let nonElevatedSet;
            let nonElevatedLookup;
            let result;
            let modifiesAttribute = false;
            if (this.refCnt > 1) {
                result = new ResolvedTraitSet(this.wrtDoc);
                nonElevatedSet = result.set;
                nonElevatedLookup = result.lookupByTrait;
            }
            else {
                result = this;
                nonElevatedSet = new Array();
                nonElevatedLookup = new Map();
            }
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const rt = this.set[i];
                if (!rt.trait.elevated) {
                    nonElevatedSet.push(rt);
                    nonElevatedLookup.set(rt.trait, rt);
                    if (rt.trait.modifiesAttributes)
                        modifiesAttribute = true;
                }
            }
            result.set = nonElevatedSet;
            result.lookupByTrait = nonElevatedLookup;
            result.modifiesAttributes = modifiesAttribute;
            result.hasElevated = false;
            return result;
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(wrtDoc, toTrait, paramName, value) {
        //let bodyCode = () =>
        {
            let altered = this;
            altered.get(toTrait).parameterValues.setParameterValue(this.wrtDoc, paramName, value);
            return altered;
        }
        //return p.measure(bodyCode);
    }
    replaceTraitParameterValue(wrtDoc, toTrait, paramName, valueWhen, valueNew) {
        let traitSetResult = this;
        let l = traitSetResult.set.length;
        for (let i = 0; i < l; i++) {
            const rt = traitSetResult.set[i];
            if (rt.trait.isDerivedFrom(wrtDoc, toTrait)) {
                let pc = rt.parameterValues.pc;
                let av = rt.parameterValues.values;
                let idx = pc.getParameterIndex(paramName);
                if (idx != undefined) {
                    if (av[idx] === valueWhen) {
                        av[idx] = ParameterValue.getReplacementValue(wrtDoc, av[idx], valueNew, true);
                    }
                }
            }
        }
        return traitSetResult;
    }
    spew(wrtDoc, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            let list = this.set;
            if (nameSort)
                list = list.sort((l, r) => l.traitName.localeCompare(r.traitName));
            for (let i = 0; i < l; i++) {
                // comment this line to simplify spew results to stop at attribute names
                list[i].spew(wrtDoc, to, indent);
            }
            ;
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedTraitSet = ResolvedTraitSet;
class ResolvedTraitSetBuilder {
    constructor(wrtDoc, set) {
        //let bodyCode = () =>
        {
            this.wrtDoc = wrtDoc;
            this.set = set;
        }
        //return p.measure(bodyCode);
    }
    clear() {
        //let bodyCode = () =>
        {
            if (this.rts) {
                this.rts.release();
                this.rts = null;
            }
        }
        //return p.measure(bodyCode);
    }
    mergeTraits(rtsNew) {
        //let bodyCode = () =>
        {
            if (rtsNew) {
                if (!this.rts) {
                    this.takeReference(rtsNew);
                }
                else
                    this.takeReference(this.rts.mergeSet(rtsNew));
            }
        }
        //return p.measure(bodyCode);
    }
    takeReference(rtsNew) {
        //let bodyCode = () =>
        {
            if (this.rts !== rtsNew) {
                if (rtsNew)
                    rtsNew.addRef();
                if (this.rts)
                    this.rts.release();
                this.rts = rtsNew;
            }
        }
        //return p.measure(bodyCode);
    }
    ownOne(rt) {
        //let bodyCode = () =>
        {
            this.takeReference(new ResolvedTraitSet(this.wrtDoc));
            this.rts.merge(rt);
        }
        //return p.measure(bodyCode);
    }
    setParameterValueFromArgument(trait, arg) {
        //let bodyCode = () =>
        {
            if (this.rts) {
                let resTrait = this.rts.get(trait);
                if (resTrait) {
                    let av = resTrait.parameterValues.values;
                    let newVal = arg.getValue();
                    // get the value index from the parameter collection given the parameter that this argument is setting
                    let iParam = resTrait.parameterValues.indexOf(arg.getParameterDef());
                    av[iParam] = ParameterValue.getReplacementValue(this.wrtDoc, av[iParam], newVal, true);
                    resTrait.parameterValues.wasSet[iParam] = true;
                }
            }
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(wrtDoc, toTrait, paramName, value) {
        //let bodyCode = () =>
        {
            this.takeReference(this.rts.setTraitParameterValue(wrtDoc, toTrait, paramName, value));
        }
        //return p.measure(bodyCode);
    }
    replaceTraitParameterValue(wrtDoc, toTrait, paramName, valueWhen, valueNew) {
        //let bodyCode = () =>
        {
            if (this.rts)
                this.takeReference(this.rts.replaceTraitParameterValue(wrtDoc, toTrait, paramName, valueWhen, valueNew));
        }
        //return p.measure(bodyCode);
    }
    cleanUp() {
        //let bodyCode = () =>
        {
            if (this.rts && this.set == cdmTraitSet.elevatedOnly) {
                this.takeReference(this.rts.keepElevated());
            }
        }
        //return p.measure(bodyCode);
    }
}
class ResolvedAttribute {
    constructor(wrtDoc, target, defaultName, createdContext) {
        //let bodyCode = () =>
        {
            this.target = target;
            this.resolvedTraits = new ResolvedTraitSet(wrtDoc);
            this.resolvedTraits.addRef();
            this.resolvedName = defaultName;
            this.createdContext = createdContext;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new ResolvedAttribute(wrtDoc, this.target, this.resolvedName, this.createdContext);
            copy.applierState = this.applierState;
            copy.resolvedTraits = this.resolvedTraits.shallowCopy();
            copy.resolvedTraits.addRef();
            copy.insertOrder = this.insertOrder;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    spew(wrtDoc, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent}[${this.resolvedName}]`);
            this.resolvedTraits.spew(wrtDoc, to, indent + '-', nameSort);
        }
        //return p.measure(bodyCode);
    }
    get isPrimaryKey() {
        return this.getTraitToPropertyMap().getPropertyValue("isPrimaryKey");
    }
    get isReadOnly() {
        return this.getTraitToPropertyMap().getPropertyValue("isReadOnly");
    }
    get isNullable() {
        return this.getTraitToPropertyMap().getPropertyValue("isNullable");
    }
    get dataFormat() {
        return this.getTraitToPropertyMap().getPropertyValue("dataFormat");
    }
    get sourceName() {
        return this.getTraitToPropertyMap().getPropertyValue("sourceName");
    }
    get sourceOrdering() {
        return this.getTraitToPropertyMap().getPropertyValue("sourceOrdering");
    }
    get displayName() {
        return this.getTraitToPropertyMap().getPropertyValue("displayName");
    }
    get description() {
        return this.getTraitToPropertyMap().getPropertyValue("description");
    }
    get maximumValue() {
        return this.getTraitToPropertyMap().getPropertyValue("maximumValue");
    }
    get minimumValue() {
        return this.getTraitToPropertyMap().getPropertyValue("minimumValue");
    }
    get maximumLength() {
        return this.getTraitToPropertyMap().getPropertyValue("maximumLength");
    }
    get valueConstrainedToList() {
        return this.getTraitToPropertyMap().getPropertyValue("valueConstrainedToList");
    }
    get defaultValue() {
        return this.getTraitToPropertyMap().getPropertyValue("defaultValue");
    }
    get creationSequence() {
        return this.insertOrder;
    }
    getTraitToPropertyMap() {
        if (this.t2pm)
            return this.t2pm;
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForResolvedAttribute(this.resolvedTraits);
        return this.t2pm;
    }
}
exports.ResolvedAttribute = ResolvedAttribute;
class ResolvedAttributeSet extends refCounted {
    constructor(wrtDoc) {
        super();
        //let bodyCode = () =>
        {
            this.wrtDoc = wrtDoc;
            this.resolvedName2resolvedAttribute = new Map();
            this.sourceAttribute2resolvedAttribute = new Map();
            this.set = new Array();
        }
        //return p.measure(bodyCode);
    }
    merge(toMerge) {
        //let bodyCode = () =>
        {
            let rasResult = this;
            if (toMerge) {
                if (rasResult.resolvedName2resolvedAttribute.has(toMerge.resolvedName)) {
                    let existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                    if (this.refCnt > 1 && existing.target !== toMerge.target) {
                        rasResult = rasResult.copy(); // copy on write
                        existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                    }
                    existing.target = toMerge.target; // replace with newest version
                    let rtsMerge = existing.resolvedTraits.mergeSet(toMerge.resolvedTraits); // newest one may replace
                    if (rtsMerge !== existing.resolvedTraits) {
                        rasResult = rasResult.copy(); // copy on write
                        existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                        existing.resolvedTraits.release();
                        existing.resolvedTraits = rtsMerge;
                        existing.resolvedTraits.addRef();
                    }
                }
                else {
                    if (this.refCnt > 1)
                        rasResult = rasResult.copy(); // copy on write
                    rasResult.resolvedName2resolvedAttribute.set(toMerge.resolvedName, toMerge);
                    rasResult.sourceAttribute2resolvedAttribute.set(toMerge.target, toMerge);
                    //toMerge.insertOrder = rasResult.set.length;
                    rasResult.set.push(toMerge);
                }
                this.baseTrait2Attributes = null;
            }
            return rasResult;
        }
        //return p.measure(bodyCode);
    }
    mergeSet(toMerge) {
        //let bodyCode = () =>
        {
            let rasResult = this;
            if (toMerge) {
                let l = toMerge.set.length;
                for (let i = 0; i < l; i++) {
                    let rasMerged = rasResult.merge(toMerge.set[i]);
                    if (rasMerged !== rasResult) {
                        rasResult = rasMerged;
                    }
                }
            }
            return rasResult;
        }
        //return p.measure(bodyCode);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //  traits that change attributes
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    applyTraits(traits, appliers, directives) {
        //let bodyCode = () =>
        {
            let rasResult = this;
            let rasApplied;
            if (this.refCnt > 1 && rasResult.copyNeeded(traits, appliers, directives)) {
                rasResult = rasResult.copy();
            }
            rasApplied = rasResult.apply(traits, appliers, directives);
            // now we are that
            rasResult.resolvedName2resolvedAttribute = rasApplied.resolvedName2resolvedAttribute;
            rasResult.sourceAttribute2resolvedAttribute = rasApplied.sourceAttribute2resolvedAttribute;
            rasResult.baseTrait2Attributes = null;
            rasResult.set = rasApplied.set;
            return rasResult;
        }
        //return p.measure(bodyCode);
    }
    copyNeeded(traits, appliers, directives) {
        //let bodyCode = () =>
        {
            if (appliers.length == 0)
                return false;
            // for every attribute in the set, detect if a merge of traits will alter the traits. if so, need to copy the attribute set to avoid overwrite 
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const resAtt = this.set[i];
                for (const resTraitApplier of appliers) {
                    let applier = resTraitApplier["1"];
                    let rt = resTraitApplier["0"];
                    if (applier.willApply && applier.willApply(this.wrtDoc, resAtt, rt, directives))
                        return true;
                }
            }
            return false;
        }
        //return p.measure(bodyCode);
    }
    apply(traits, appliers, directives) {
        //let bodyCode = () =>
        {
            if (!traits && appliers.length == 0) {
                // nothing can change
                return this;
            }
            // for every attribute in the set run any attribute appliers
            let appliedAttSet = new ResolvedAttributeSet(this.wrtDoc);
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const resAtt = this.set[i];
                let rtsMerge = resAtt.resolvedTraits.mergeSet(traits);
                resAtt.resolvedTraits.release();
                resAtt.resolvedTraits = rtsMerge;
                resAtt.resolvedTraits.addRef();
                for (const resTraitApplier of appliers) {
                    let applier = resTraitApplier["1"];
                    let rt = resTraitApplier["0"];
                    if (applier.willApply && applier.willApply(this.wrtDoc, resAtt, rt, directives)) {
                        applier.attributeApply(this.wrtDoc, resAtt, rt, directives);
                    }
                }
                appliedAttSet.merge(resAtt);
            }
            return appliedAttSet;
        }
        //return p.measure(bodyCode);
    }
    removeRequestedAtts(directives, marker) {
        //let bodyCode = () =>
        {
            // track the deletes 'under' a certain index
            let oldMarker = 0;
            if (marker) {
                oldMarker = marker["0"];
            }
            let newMarker = oldMarker;
            // for every attribute in the set run any attribute removers on the traits they have
            let appliedAttSet;
            let l = this.set.length;
            for (let iAtt = 0; iAtt < l; iAtt++) {
                let resAtt = this.set[iAtt];
                if (resAtt.resolvedTraits && resAtt.resolvedTraits.modifiesAttributes) {
                    let l = resAtt.resolvedTraits.size;
                    // let the appliers change the directives
                    let newDirectives = directives;
                    for (let i = 0; resAtt && i < l; i++) {
                        const rt = resAtt.resolvedTraits.set[i];
                        if (resAtt && rt.trait.modifiesAttributes) {
                            let traitAppliers = rt.trait.getTraitAppliers();
                            if (traitAppliers) {
                                let l = traitAppliers.length;
                                for (let ita = 0; ita < l; ita++) {
                                    const apl = traitAppliers[ita];
                                    if (apl.alterDirectives)
                                        newDirectives = apl.alterDirectives(this.wrtDoc, rt, newDirectives);
                                }
                            }
                        }
                    }
                    for (let i = 0; resAtt && i < l; i++) {
                        const rt = resAtt.resolvedTraits.set[i];
                        if (resAtt && rt.trait.modifiesAttributes) {
                            let traitAppliers = rt.trait.getTraitAppliers();
                            if (traitAppliers) {
                                let l = traitAppliers.length;
                                for (let ita = 0; ita < l; ita++) {
                                    const apl = traitAppliers[ita];
                                    if (resAtt && apl.attributeRemove) {
                                        let result = apl.attributeRemove(this.wrtDoc, resAtt, rt, newDirectives);
                                        if (result.shouldDelete) {
                                            // if this is the first removed attribute, then make a copy of the set now
                                            // after this point, the rest of the loop logic keeps the copy going as needed
                                            if (!appliedAttSet) {
                                                appliedAttSet = new ResolvedAttributeSet(this.wrtDoc);
                                                for (let iCopy = 0; iCopy < iAtt; iCopy++)
                                                    appliedAttSet.merge(this.set[iCopy]);
                                            }
                                            resAtt = null;
                                            if (iAtt < oldMarker)
                                                newMarker--;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (resAtt && appliedAttSet)
                    appliedAttSet.merge(resAtt);
            }
            if (marker) {
                marker["1"] = newMarker;
            }
            // now we are that (or a copy)
            let rasResult = this;
            if (appliedAttSet && appliedAttSet.size != rasResult.size) {
                rasResult = appliedAttSet;
                rasResult.baseTrait2Attributes = null;
            }
            return rasResult;
        }
        //return p.measure(bodyCode);
    }
    getAttributesWithTraits(queryFor) {
        //let bodyCode = () =>
        {
            // put the input into a standard form
            let query = new Array();
            if (queryFor instanceof Array) {
                let l = queryFor.length;
                for (let i = 0; i < l; i++) {
                    let q = queryFor[i];
                    if (typeof (q) === "string")
                        query.push({ traitBaseName: q, params: [] });
                    else
                        query.push(q);
                }
            }
            else {
                if (typeof (queryFor) === "string")
                    query.push({ traitBaseName: queryFor, params: [] });
                else
                    query.push(queryFor);
            }
            // if the map isn't in place, make one now. assumption is that this is called as part of a usage pattern where it will get called again.
            if (!this.baseTrait2Attributes) {
                this.baseTrait2Attributes = new Map();
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    // create a map from the name of every trait found in this whole set of attributes to the attributes that have the trait (included base classes of traits)
                    const resAtt = this.set[i];
                    let traitNames = resAtt.resolvedTraits.collectTraitNames();
                    traitNames.forEach(tName => {
                        if (!this.baseTrait2Attributes.has(tName))
                            this.baseTrait2Attributes.set(tName, new Set());
                        this.baseTrait2Attributes.get(tName).add(resAtt);
                    });
                }
            }
            // for every trait in the query, get the set of attributes.
            // intersect these sets to get the final answer
            let finalSet;
            let lQuery = query.length;
            for (let i = 0; i < lQuery; i++) {
                const q = query[i];
                if (this.baseTrait2Attributes.has(q.traitBaseName)) {
                    let subSet = this.baseTrait2Attributes.get(q.traitBaseName);
                    if (q.params && q.params.length) {
                        // need to check param values, so copy the subset to something we can modify 
                        let filteredSubSet = new Set();
                        subSet.forEach(ra => {
                            // get parameters of the the actual trait matched
                            let pvals = ra.resolvedTraits.find(this.wrtDoc, q.traitBaseName).parameterValues;
                            // compare to all query params
                            let lParams = q.params.length;
                            let iParam;
                            for (iParam = 0; iParam < lParams; iParam++) {
                                const param = q.params[i];
                                let pv = pvals.getParameterValue(param.paramName);
                                if (!pv || pv.getValueString(this.wrtDoc) != param.paramValue)
                                    break;
                            }
                            // stop early means no match
                            if (iParam == lParams)
                                filteredSubSet.add(ra);
                        });
                        subSet = filteredSubSet;
                    }
                    if (subSet && subSet.size) {
                        // got some. either use as starting point for answer or intersect this in
                        if (!finalSet)
                            finalSet = subSet;
                        else {
                            let intersection = new Set();
                            // intersect the two
                            finalSet.forEach(ra => {
                                if (subSet.has(ra))
                                    intersection.add(ra);
                            });
                            finalSet = intersection;
                        }
                    }
                }
            }
            // collect the final set into a resolvedAttributeSet
            if (finalSet && finalSet.size) {
                let rasResult = new ResolvedAttributeSet(this.wrtDoc);
                finalSet.forEach(ra => {
                    rasResult.merge(ra);
                });
                return rasResult;
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    get(name) {
        //let bodyCode = () =>
        {
            if (this.resolvedName2resolvedAttribute.has(name)) {
                return this.resolvedName2resolvedAttribute.get(name);
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    getBySource(source) {
        //let bodyCode = () =>
        {
            return this.sourceAttribute2resolvedAttribute.get(source);
        }
        //return p.measure(bodyCode);
    }
    get size() {
        return this.resolvedName2resolvedAttribute.size;
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new ResolvedAttributeSet(this.wrtDoc);
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                copy.merge(this.set[i].copy(this.wrtDoc));
            }
            return copy;
        }
        //return p.measure(bodyCode);
    }
    spew(wrtDoc, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            if (l > 0) {
                let list = this.set;
                if (nameSort)
                    list = list.sort((l, r) => l.resolvedName.localeCompare(r.resolvedName));
                for (let i = 0; i < l; i++) {
                    list[i].spew(wrtDoc, to, indent, nameSort);
                }
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedAttributeSet = ResolvedAttributeSet;
class ResolvedAttributeSetBuilder {
    constructor(wrtDoc, directives) {
        this.wrtDoc = wrtDoc;
        this.directives = new Set(directives);
    }
    setAttributeContext(under) {
        this.attributeContext = under;
    }
    createAttributeContext(under, type, name, regarding, includeTraits) {
        //let bodyCode = () =>
        {
            if (!under)
                return undefined;
            this.attributeContext = AttributeContextImpl.createChildUnder(this.wrtDoc, under, type, name, regarding, includeTraits);
            return this.attributeContext;
        }
        //return p.measure(bodyCode);
    }
    mergeAttributes(rasNew) {
        //let bodyCode = () =>
        {
            if (rasNew) {
                if (!this.ras)
                    this.takeReference(rasNew);
                else
                    this.takeReference(this.ras.mergeSet(rasNew));
            }
        }
        //return p.measure(bodyCode);
    }
    takeReference(rasNew) {
        //let bodyCode = () =>
        {
            if (this.ras !== rasNew) {
                if (rasNew)
                    rasNew.addRef();
                if (this.ras)
                    this.ras.release();
                this.ras = rasNew;
            }
        }
        //return p.measure(bodyCode);
    }
    giveReference() {
        let rasRef = this.ras;
        if (this.ras) {
            this.ras.release();
            if (this.ras.refCnt == 0)
                this.ras = null;
        }
        return rasRef;
    }
    ownOne(ra) {
        //let bodyCode = () =>
        {
            this.takeReference(new ResolvedAttributeSet(this.wrtDoc));
            this.ras.merge(ra);
        }
        //return p.measure(bodyCode);
    }
    prepareForTraitApplication(traits) {
        //let bodyCode = () =>
        {
            this.appliersAlter = new Array();
            this.appliersAdd = new Array();
            this.appliersRemove = new Array();
            this.traitsToApply = traits;
            // collect a set of appliers for all traits
            if (traits && traits.modifiesAttributes) {
                let l = traits.size;
                for (let i = 0; i < l; i++) {
                    const rt = traits.set[i];
                    if (rt.trait.modifiesAttributes) {
                        let traitAppliers = rt.trait.getTraitAppliers();
                        if (traitAppliers) {
                            let l = traitAppliers.length;
                            for (let ita = 0; ita < l; ita++) {
                                const apl = traitAppliers[ita];
                                if (apl.attributeApply)
                                    this.appliersAlter.push([rt, apl]);
                                if (apl.attributeAdd)
                                    this.appliersAdd.push([rt, apl]);
                                if (apl.attributeRemove)
                                    this.appliersRemove.push([rt, apl]);
                                if (apl.alterDirectives)
                                    this.directives = apl.alterDirectives(this.wrtDoc, rt, this.directives);
                            }
                        }
                    }
                }
            }
            // sorted by priority
            this.appliersAlter = this.appliersAlter.sort((l, r) => l["1"].priority - r["1"].priority);
            this.appliersAdd = this.appliersAdd.sort((l, r) => l["1"].priority - r["1"].priority);
        }
        //return p.measure(bodyCode);
    }
    getAttributeContinuations(priorityAbove, clearState) {
        //let bodyCode = () =>
        {
            if (!this.ras)
                return null;
            // one group of continuation requests per priority level
            let continuationSetOut = new Array();
            if (!this.traitsToApply || !this.traitsToApply.modifiesAttributes)
                return continuationSetOut;
            if (this.appliersAdd.length == 0)
                return continuationSetOut;
            let lastPri = -1;
            let continuationsOut;
            for (const resTraitApplier of this.appliersAdd) {
                let applier = resTraitApplier["1"];
                let rt = resTraitApplier["0"];
                if (applier.priority > priorityAbove) {
                    if (applier.priority != lastPri) {
                        continuationsOut = new Array();
                        continuationSetOut.push(continuationsOut);
                        lastPri = applier.priority;
                    }
                    // if there are no attributes, this is an entity attribute 
                    if (this.ras.size == 0) {
                        continuationsOut.push({ applier: applier, resAtt: null, resTrait: rt });
                    }
                    else {
                        // one for each attribute and applier combo
                        let l = this.ras.set.length;
                        for (let i = 0; i < l; i++) {
                            if (clearState)
                                this.ras.set[i].applierState = undefined;
                            continuationsOut.push({ applier: applier, resAtt: this.ras.set[i], resTrait: rt });
                        }
                    }
                }
            }
            return continuationSetOut;
        }
        //return p.measure(bodyCode);
    }
    applyTraits() {
        //let bodyCode = () =>
        {
            if (this.ras)
                this.takeReference(this.ras.applyTraits(this.traitsToApply, this.appliersAlter, this.directives));
        }
        //return p.measure(bodyCode);
    }
    generateTraitAttributes(applyTraitsToNew) {
        //let bodyCode = () =>
        {
            if (!this.ras)
                this.takeReference(new ResolvedAttributeSet(this.wrtDoc));
            if (this.appliersAdd && this.appliersAdd.length) {
                // using the attributes in this set, get an initial set of continuation requests
                let currentContinueSet = this.getAttributeContinuations(-1, true);
                // loop through this process until it stops giving back new requests 
                let rasbSource = this;
                while (currentContinueSet.length) {
                    let newContinueSet = new Array();
                    let addedThisRound = new ResolvedAttributeSetBuilder(this.wrtDoc, this.directives);
                    addedThisRound.traitsToApply = this.traitsToApply;
                    addedThisRound.appliersAlter = this.appliersAlter;
                    addedThisRound.appliersAdd = this.appliersAdd;
                    // process each priority set independently. this lets the attributes generated by one priority get acted on by the appliers of a later one
                    let l = currentContinueSet.length;
                    for (let i = 0; i < l; i++) {
                        const currentContinues = currentContinueSet[i];
                        let newContinues = new Array();
                        let addedThisPriority = this.processContinuations(currentContinues, newContinues, this.directives, this.attributeContext);
                        if (addedThisPriority && addedThisPriority.ras) {
                            // the next round needs to get a crack at these atts
                            if (i + 1 < l) {
                                // get the new set of appliers above this point in the array using the traits being applied to the whole set
                                addedThisPriority.traitsToApply = this.traitsToApply;
                                addedThisPriority.appliersAdd = this.appliersAdd;
                                let addedThisPriorityContinueSet = addedThisPriority.getAttributeContinuations(currentContinues[0].applier.priority, false);
                                if (addedThisPriorityContinueSet) {
                                    // add these new continuations to the next sets
                                    for (let iAdd = 0; iAdd < addedThisPriorityContinueSet.length; iAdd++) {
                                        let indexCurrent = iAdd + i + 1;
                                        if (indexCurrent < l)
                                            currentContinueSet[indexCurrent] = currentContinueSet[indexCurrent].concat(addedThisPriorityContinueSet[iAdd]);
                                        else
                                            currentContinueSet.push(addedThisPriorityContinueSet[iAdd]);
                                    }
                                    l = currentContinueSet.length;
                                }
                            }
                            addedThisRound.mergeAttributes(addedThisPriority.ras);
                        }
                        if (newContinues.length)
                            newContinueSet.push(newContinues);
                    }
                    // apply the original traits to the newly added atts if requested.
                    if (applyTraitsToNew) {
                        addedThisRound.applyTraits();
                    }
                    // merge them in
                    this.mergeAttributes(addedThisRound.ras);
                    currentContinueSet = newContinueSet;
                }
            }
        }
        //return p.measure(bodyCode);
    }
    processContinuations(continuationsIn, continuationsOut, directives, attCtx) {
        //let bodyCode = () =>
        {
            // for every attribute in the set run any attribute adders and collect results in a new set
            let addedAttSet = new ResolvedAttributeSetBuilder(this.wrtDoc, directives);
            addedAttSet.setAttributeContext(attCtx);
            for (const continueWith of continuationsIn) {
                // if will add, then add and resolve
                if (continueWith.applier.willAdd && continueWith.applier.willAdd(this.wrtDoc, continueWith.resAtt, continueWith.resTrait, directives)) {
                    let result = continueWith.applier.attributeAdd(this.wrtDoc, continueWith.resAtt, continueWith.resTrait, directives);
                    let newResAtt;
                    if (result && result.addedAttribute) {
                        // create a new resolved attribute and apply the traits that it has
                        let rtsNew = result.addedAttribute.getResolvedTraits(this.wrtDoc);
                        let newRasb = new ResolvedAttributeSetBuilder(this.wrtDoc, directives);
                        // applier may want to make a new context
                        let under = attCtx;
                        if (continueWith.applier.createContext)
                            under = continueWith.applier.createContext(this.wrtDoc, continueWith.resAtt, continueWith.resTrait, under, directives).attCtx;
                        newRasb.setAttributeContext(under);
                        newResAtt = new ResolvedAttribute(this.wrtDoc, result.addedAttribute, result.addedAttribute.getName(), under);
                        newResAtt.applierState = result.applierState;
                        newRasb.ownOne(newResAtt);
                        // apply the traits that sit on this new attribute                        
                        newRasb.prepareForTraitApplication(rtsNew);
                        newRasb.applyTraits();
                        // possible that the traits from this new attribute want to generate another attribute.
                        let subContinueSet = newRasb.getAttributeContinuations(-1, true);
                        if (subContinueSet && subContinueSet.length) {
                            // put these in the list going back for more work
                            for (const subContinues of subContinueSet)
                                for (const subContinue of subContinues)
                                    continuationsOut.push(subContinue);
                        }
                        // accumulate all added
                        addedAttSet.mergeAttributes(newRasb.giveReference());
                    }
                    // if a continue requested, add to list
                    if (result && result.continueApplying)
                        continuationsOut.push({ applier: continueWith.applier, resAtt: newResAtt, resTrait: continueWith.resTrait });
                }
            }
            return addedAttSet;
        }
        //return p.measure(bodyCode);
    }
    removeRequestedAtts() {
        //let bodyCode = () =>
        {
            if (this.ras) {
                let marker = [0, 0];
                marker["0"] = this.inheritedMark;
                this.takeReference(this.ras.removeRequestedAtts(this.directives, marker));
                this.inheritedMark = marker["1"];
            }
        }
        //return p.measure(bodyCode);
    }
    markInherited() {
        //let bodyCode = () =>
        {
            if (this.ras && this.ras.set) {
                this.inheritedMark = this.ras.set.length;
                let countSet = (rasSub, offset) => {
                    let last = offset;
                    if (rasSub && rasSub.set) {
                        for (let i = 0; i < rasSub.set.length; i++) {
                            if (rasSub.set[i].target.set) {
                                last = countSet(rasSub.set[i].target, last);
                            }
                            else
                                last++;
                        }
                    }
                    return last;
                };
                this.inheritedMark = countSet(this.ras, 0);
            }
            else
                this.inheritedMark = 0;
        }
        //return p.measure(bodyCode);
    }
    markOrder() {
        //let bodyCode = () =>
        {
            let markSet = (rasSub, inheritedMark, offset) => {
                let last = offset;
                if (rasSub && rasSub.set) {
                    rasSub.insertOrder = last;
                    for (let i = 0; i < rasSub.set.length; i++) {
                        if (rasSub.set[i].target.set) {
                            last = markSet(rasSub.set[i].target, inheritedMark, last);
                        }
                        else {
                            if (last >= inheritedMark)
                                rasSub.set[i].insertOrder = last;
                            last++;
                        }
                    }
                }
                return last;
            };
            markSet(this.ras, this.inheritedMark, 0);
        }
        //return p.measure(bodyCode);
    }
}
class ResolvedEntityReferenceSide {
    constructor(wrtDoc, entity, rasb) {
        //let bodyCode = () =>
        {
            if (entity)
                this.entity = entity;
            if (rasb)
                this.rasb = rasb;
            else
                this.rasb = new ResolvedAttributeSetBuilder(wrtDoc, null);
        }
        //return p.measure(bodyCode);
    }
    getFirstAttribute() {
        //let bodyCode = () =>
        {
            if (this.rasb && this.rasb.ras && this.rasb.ras.set && this.rasb.ras.set.length)
                return this.rasb.ras.set[0];
        }
        //return p.measure(bodyCode);
    }
    spew(wrtDoc, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent} ent=${this.entity.getName()}`);
            if (this.rasb && this.rasb.ras)
                this.rasb.ras.spew(wrtDoc, to, indent + '  atts:', nameSort);
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntityReferenceSide = ResolvedEntityReferenceSide;
class ResolvedEntityReference {
    constructor(wrtDoc) {
        //let bodyCode = () =>
        {
            this.wrtDoc = wrtDoc;
            this.referencing = new ResolvedEntityReferenceSide(this.wrtDoc);
            this.referenced = new Array();
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let result = new ResolvedEntityReference(this.wrtDoc);
            result.referencing.entity = this.referencing.entity;
            result.referencing.rasb = this.referencing.rasb;
            this.referenced.forEach(rers => {
                result.referenced.push(new ResolvedEntityReferenceSide(this.wrtDoc, rers.entity, rers.rasb));
            });
            return result;
        }
        //return p.measure(bodyCode);
    }
    spew(wrtDoc, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            this.referencing.spew(wrtDoc, to, indent + "(referencing)", nameSort);
            let list = this.referenced;
            if (nameSort)
                list = list.sort((l, r) => l.entity.getName().localeCompare(r.entity.getName()));
            for (let i = 0; i < this.referenced.length; i++) {
                list[i].spew(wrtDoc, to, indent + `(referenced[${i}])`, nameSort);
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntityReference = ResolvedEntityReference;
class ResolvedEntity {
    constructor(wrtDoc, entDef, directives) {
        this.entity = entDef;
        this.resolvedName = this.entity.getName();
        this.resolvedTraits = this.entity.getResolvedTraits(wrtDoc);
        this.resolvedAttributes = this.entity.getResolvedAttributes(wrtDoc, directives);
        this.resolvedEntityReferences = this.entity.getResolvedEntityReferences(wrtDoc, directives);
    }
    get sourceName() {
        return this.getTraitToPropertyMap().getPropertyValue("sourceName");
    }
    get description() {
        return this.getTraitToPropertyMap().getPropertyValue("description");
    }
    get displayName() {
        return this.getTraitToPropertyMap().getPropertyValue("displayName");
    }
    get version() {
        return this.getTraitToPropertyMap().getPropertyValue("version");
    }
    get cdmSchemas() {
        return this.getTraitToPropertyMap().getPropertyValue("cdmSchemas");
    }
    getTraitToPropertyMap() {
        if (this.t2pm)
            return this.t2pm;
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForResolvedEntity(this.resolvedTraits);
        return this.t2pm;
    }
    spew(wrtDoc, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            to.spewLine(indent + "=====ENTITY=====");
            to.spewLine(indent + this.resolvedName);
            to.spewLine(indent + "================");
            to.spewLine(indent + "traits:");
            this.resolvedTraits.spew(wrtDoc, to, indent + " ", nameSort);
            to.spewLine("attributes:");
            this.resolvedAttributes.spew(wrtDoc, to, indent + " ", nameSort);
            to.spewLine("relationships:");
            this.resolvedEntityReferences.spew(wrtDoc, to, indent + " ", nameSort);
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntity = ResolvedEntity;
class ResolvedEntityReferenceSet {
    constructor(wrtDoc, set = undefined) {
        //let bodyCode = () =>
        {
            this.wrtDoc = wrtDoc;
            if (set) {
                this.set = set;
            }
            else
                this.set = new Array();
        }
        //return p.measure(bodyCode);
    }
    add(toAdd) {
        //let bodyCode = () =>
        {
            if (toAdd && toAdd.set && toAdd.set.length) {
                this.set = this.set.concat(toAdd.set);
            }
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let newSet = this.set.slice(0);
            for (let i = 0; i < newSet.length; i++) {
                newSet[i] = newSet[i].copy();
            }
            return new ResolvedEntityReferenceSet(this.wrtDoc, newSet);
        }
        //return p.measure(bodyCode);
    }
    findEntity(entOther) {
        //let bodyCode = () =>
        {
            // make an array of just the refs that include the requested
            let filter = this.set.filter((rer) => {
                return (rer.referenced.some((rers) => {
                    if (rers.entity === entOther)
                        return true;
                }));
            });
            if (filter.length == 0)
                return null;
            return new ResolvedEntityReferenceSet(this.wrtDoc, filter);
        }
        //return p.measure(bodyCode);
    }
    spew(wrtDoc, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            let list = this.set;
            if (nameSort)
                list = list.sort((l, r) => {
                    if (l.referenced && l.referenced.length) {
                        if (r.referenced && r.referenced.length) {
                            return l.referenced[0].entity.getName().localeCompare(r.referenced[0].entity.getName());
                        }
                        else {
                            return 1;
                        }
                    }
                    else {
                        return -1;
                    }
                });
            for (let i = 0; i < this.set.length; i++) {
                list[i].spew(wrtDoc, to, indent + `(rer[${i}])`, nameSort);
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntityReferenceSet = ResolvedEntityReferenceSet;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  attribute and entity traits that are represented as properties
////////////////////////////////////////////////////////////////////////////////////////////////////
// this entire class is gross. it is a different abstraction level than all of the rest of this om.
// however, it does make it easier to work with the consumption object model so ... i will hold my nose.
class traitToPropertyMap {
    initForEntityDef(persistedObject, host) {
        //let bodyCode = () =>
        {
            this.hostEnt = host;
            this.traits = this.hostEnt.getExhibitedTraitRefs();
            let tr;
            // turn properties into traits for internal form
            if (persistedObject) {
                if (persistedObject.sourceName) {
                    this.setTraitArgument("is.CDS.sourceNamed", "name", persistedObject.sourceName);
                }
                if (persistedObject.displayName) {
                    this.setLocalizedTraitTable("is.localized.displayedAs", persistedObject.displayName);
                }
                if (persistedObject.description) {
                    this.setLocalizedTraitTable("is.localized.describedAs", persistedObject.description);
                }
                if (persistedObject.version) {
                    this.setTraitArgument("is.CDM.entityVersion", "versionNumber", persistedObject.version);
                }
                if (persistedObject.cdmSchemas) {
                    this.setSingleAttTraitTable("is.CDM.attributeGroup", "groupList", "attributeGroupSet", persistedObject.cdmSchemas);
                }
            }
        }
        //return p.measure(bodyCode);
    }
    initForResolvedEntity(rtsEnt) {
        this.hostRtsEnt = rtsEnt;
        this.traits = rtsEnt.set;
    }
    initForTypeAttributeDef(persistedObject, host) {
        //let bodyCode = () =>
        {
            this.hostAtt = host;
            this.traits = this.hostAtt.getAppliedTraitRefs();
            // turn properties into traits for internal form
            if (persistedObject) {
                if (persistedObject.isReadOnly) {
                    this.getTrait("is.readOnly", true, true);
                }
                if (persistedObject.isNullable) {
                    this.getTrait("is.nullable", true, true);
                }
                if (persistedObject.sourceName) {
                    this.setTraitArgument("is.CDS.sourceNamed", "name", persistedObject.sourceName);
                }
                if (persistedObject.sourceOrdering) {
                    this.setTraitArgument("is.CDS.ordered", "ordinal", persistedObject.sourceOrdering.toString());
                }
                if (persistedObject.displayName) {
                    this.setLocalizedTraitTable("is.localized.displayedAs", persistedObject.displayName);
                }
                if (persistedObject.description) {
                    this.setLocalizedTraitTable("is.localized.describedAs", persistedObject.description);
                }
                if (persistedObject.valueConstrainedToList) {
                    this.getTrait("is.constrainedList", true, true);
                }
                if (persistedObject.isPrimaryKey) {
                    this.getTrait("is.identifiedBy", true, true);
                }
                if (persistedObject.maximumLength) {
                    this.setTraitArgument("is.constrained", "maximumLength", persistedObject.maximumLength.toString());
                }
                if (persistedObject.maximumValue) {
                    this.setTraitArgument("is.constrained", "maximumValue", persistedObject.maximumValue);
                }
                if (persistedObject.minimumValue) {
                    this.setTraitArgument("is.constrained", "minimumValue", persistedObject.minimumValue);
                }
                if (persistedObject.dataFormat) {
                    this.dataFormatToTraits(persistedObject.dataFormat);
                }
                if (persistedObject.defaultValue) {
                    this.setDefaultValue(persistedObject.defaultValue);
                }
            }
        }
        //return p.measure(bodyCode);
    }
    initForResolvedAttribute(rtsAtt) {
        this.hostRtsAtt = rtsAtt;
        this.traits = rtsAtt.set;
    }
    persistForEntityDef(persistedObject, options) {
        //let bodyCode = () =>
        {
            let removedIndexes = new Array();
            if (this.traits) {
                let l = this.traits.length;
                for (let i = 0; i < l; i++) {
                    let traitName = getTraitRefName(this.traits[i]);
                    switch (traitName) {
                        case "is.CDS.sourceNamed":
                            persistedObject.sourceName = getTraitRefArgumentValue(this.traits[i], "name");
                            removedIndexes.push(i);
                            break;
                        case "is.localized.describedAs":
                            persistedObject.description = this.getLocalizedTraitTable("is.localized.describedAs");
                            if (options.removeSingleRowLocalizedTableTraits && persistedObject.description) {
                                let cEnt = this.getTraitTable("is.localized.describedAs", "localizedDisplayText");
                                if (cEnt.getConstantValues().length == 1)
                                    removedIndexes.push(i);
                            }
                            break;
                        case "is.localized.displayedAs":
                            persistedObject.displayName = this.getLocalizedTraitTable("is.localized.displayedAs");
                            if (options.removeSingleRowLocalizedTableTraits && persistedObject.displayName) {
                                let cEnt = this.getTraitTable("is.localized.displayedAs", "localizedDisplayText");
                                if (cEnt.getConstantValues().length == 1)
                                    removedIndexes.push(i);
                            }
                            break;
                        case "is.CDM.entityVersion":
                            persistedObject.version = getTraitRefArgumentValue(this.traits[i], "versionNumber");
                            removedIndexes.push(i);
                            break;
                        case "is.CDM.attributeGroup":
                            persistedObject.cdmSchemas = this.getSingleAttTraitTable("is.CDM.attributeGroup", "groupList");
                            removedIndexes.push(i);
                            break;
                    }
                }
                // remove applied traits from the persisted object back to front
                // could make this faster if needed
                for (let iRem = removedIndexes.length - 1; iRem >= 0; iRem--) {
                    persistedObject.exhibitsTraits.splice(removedIndexes[iRem], 1);
                }
                if (persistedObject.exhibitsTraits.length == 0)
                    persistedObject.exhibitsTraits = undefined;
            }
        }
        //return p.measure(bodyCode);
    }
    persistForTypeAttributeDef(persistedObject, options) {
        //let bodyCode = () =>
        {
            let removedIndexes = new Array();
            persistedObject.dataFormat = this.traitsToDataFormat(persistedObject.appliedTraits, removedIndexes);
            if (this.traits) {
                let l = this.traits.length;
                for (let i = 0; i < l; i++) {
                    let traitName = getTraitRefName(this.traits[i]);
                    switch (traitName) {
                        case "is.CDS.sourceNamed":
                            persistedObject.sourceName = getTraitRefArgumentValue(this.traits[i], "name");
                            removedIndexes.push(i);
                            break;
                        case "is.CDS.ordered":
                            persistedObject.sourceOrdering = parseInt(getTraitRefArgumentValue(this.traits[i], "ordinal"));
                            removedIndexes.push(i);
                            break;
                        case "is.constrainedList":
                            persistedObject.valueConstrainedToList = true;
                            removedIndexes.push(i);
                            break;
                        case "is.constrained":
                            let temp = getTraitRefArgumentValue(this.traits[i], "maximumLength");
                            if (temp != undefined)
                                persistedObject.maximumLength = parseInt(temp);
                            persistedObject.maximumValue = getTraitRefArgumentValue(this.traits[i], "maximumValue");
                            persistedObject.minimumValue = getTraitRefArgumentValue(this.traits[i], "minimumValue");
                            removedIndexes.push(i);
                            break;
                        case "is.readOnly":
                            persistedObject.isReadOnly = true;
                            removedIndexes.push(i);
                            break;
                        case "is.nullable":
                            persistedObject.isNullable = true;
                            removedIndexes.push(i);
                            break;
                        case "is.localized.describedAs":
                            persistedObject.description = this.getLocalizedTraitTable("is.localized.describedAs");
                            if (options.removeSingleRowLocalizedTableTraits && persistedObject.description) {
                                let cEnt = this.getTraitTable("is.localized.describedAs", "localizedDisplayText");
                                if (cEnt.getConstantValues().length == 1)
                                    removedIndexes.push(i);
                            }
                            break;
                        case "is.localized.displayedAs":
                            persistedObject.displayName = this.getLocalizedTraitTable("is.localized.displayedAs");
                            if (options.removeSingleRowLocalizedTableTraits && persistedObject.displayName) {
                                let cEnt = this.getTraitTable("is.localized.displayedAs", "localizedDisplayText");
                                if (cEnt.getConstantValues().length == 1)
                                    removedIndexes.push(i);
                            }
                            break;
                        case "is.identifiedBy":
                            persistedObject.isPrimaryKey = true;
                            removedIndexes.push(i);
                            break;
                        case "does.haveDefault":
                            persistedObject.defaultValue = this.getDefaultValue();
                            removedIndexes.push(i);
                            break;
                    }
                }
                // remove applied traits from the persisted object back to front
                // could make this faster if needed
                for (let iRem = removedIndexes.length - 1; iRem >= 0; iRem--) {
                    persistedObject.appliedTraits.splice(removedIndexes[iRem], 1);
                }
                if (persistedObject.appliedTraits.length == 0)
                    persistedObject.appliedTraits = undefined;
            }
        }
        //return p.measure(bodyCode);
    }
    setPropertyValue(propertyName, newValue) {
        //let bodyCode = () =>
        {
            if (newValue == undefined) {
                if (this.hostAtt)
                    this.hostAtt.removeAppliedTrait(propertyName); // validate a known prop?
                if (this.hostEnt)
                    this.hostEnt.removeExhibitedTrait(propertyName); // validate a known prop?
            }
            else {
                let tr;
                switch (propertyName) {
                    case "version":
                        this.setTraitArgument("is.CDM.entityVersion", "versionNumber", newValue);
                        break;
                    case "cdmSchemas":
                        this.setSingleAttTraitTable("is.CDM.attributeGroup", "groupList", "attributeGroupSet", newValue);
                        break;
                    case "sourceName":
                        this.setTraitArgument("is.CDS.sourceNamed", "name", newValue);
                        break;
                    case "displayName":
                        this.setLocalizedTraitTable("is.localized.displayedAs", newValue);
                        break;
                    case "description":
                        this.setLocalizedTraitTable("is.localized.describedAs", newValue);
                        break;
                    case "cdmSchemas":
                        this.setSingleAttTraitTable("is.CDM.attributeGroup", "groupList", "attributeGroupSet", newValue);
                        break;
                    case "sourceOrdering":
                        this.setTraitArgument("is.CDS.ordered", "ordinal", newValue.toString());
                        break;
                    case "isPrimaryKey":
                        if (newValue)
                            this.getTrait("is.identifiedBy", true, true);
                        if (!newValue)
                            this.hostAtt.removeAppliedTrait("is.identifiedBy");
                        break;
                    case "isReadOnly":
                        if (newValue)
                            this.getTrait("is.readOnly", true, true);
                        if (!newValue)
                            this.hostAtt.removeAppliedTrait("is.readOnly");
                        break;
                    case "isNullable":
                        if (newValue)
                            this.getTrait("is.nullable", true, true);
                        if (!newValue)
                            this.hostAtt.removeAppliedTrait("is.nullable");
                        break;
                    case "valueConstrainedToList":
                        if (newValue)
                            this.getTrait("is.constrainedList", true, true);
                        if (!newValue)
                            this.hostAtt.removeAppliedTrait("is.constrainedList");
                        break;
                    case "maximumValue":
                        this.setTraitArgument("is.constrained", "maximumValue", newValue);
                        break;
                    case "minimumValue":
                        this.setTraitArgument("is.constrained", "minimumValue", newValue);
                        break;
                    case "maximumLength":
                        this.setTraitArgument("is.constrained", "maximumLength", newValue.toString());
                        break;
                    case "dataFormat":
                        this.dataFormatToTraits(newValue);
                        break;
                    case "defaultValue":
                        this.setDefaultValue(newValue);
                        break;
                }
            }
        }
        //return p.measure(bodyCode);
    }
    getPropertyValue(propertyName) {
        //let bodyCode = () =>
        {
            switch (propertyName) {
                case "version":
                    return getTraitRefArgumentValue(this.getTrait("is.CDM.entityVersion", false), "versionNumber");
                case "sourceName":
                    return getTraitRefArgumentValue(this.getTrait("is.CDS.sourceNamed", false), "name");
                case "displayName":
                    return this.getLocalizedTraitTable("is.localized.displayedAs");
                case "description":
                    return this.getLocalizedTraitTable("is.localized.describedAs");
                case "cdmSchemas":
                    return this.getSingleAttTraitTable("is.CDM.attributeGroup", "groupList");
                case "sourceOrdering":
                    return parseInt(getTraitRefArgumentValue(this.getTrait("is.CDS.ordered", false), "ordinal"));
                case "isPrimaryKey":
                    return this.getTrait("is.identifiedBy", false) != undefined;
                case "isNullable":
                    return this.getTrait("is.nullable", false) != undefined;
                case "isReadOnly":
                    return this.getTrait("is.readOnly", false) != undefined;
                case "valueConstrainedToList":
                    return this.getTrait("is.constrainedList", false) != undefined;
                case "maximumValue":
                    return getTraitRefArgumentValue(this.getTrait("is.constrained", false), "maximumValue");
                case "minimumValue":
                    return getTraitRefArgumentValue(this.getTrait("is.constrained", false), "minimumValue");
                case "maximumLength":
                    let temp = getTraitRefArgumentValue(this.getTrait("is.constrained", false), "maximumLength");
                    if (temp != undefined)
                        return parseInt(temp);
                    break;
                case "dataFormat":
                    return this.traitsToDataFormat();
                case "primaryKey":
                    let attRef = getTraitRefArgumentValue(this.getTrait("is.identifiedBy", false), "attribute");
                    if (attRef)
                        return attRef.getObjectDefName();
                    break;
                case "defaultValue":
                    return this.getDefaultValue();
            }
        }
        //return p.measure(bodyCode);
    }
    dataFormatToTraits(dataFormat) {
        //let bodyCode = () =>
        {
            // if this is going to be called many times, then need to remove any dataformat traits that are left behind.
            // but ... probably not. in fact, this is probably never used because data formats come from data type which is not an attribute
            switch (dataFormat) {
                case "Int16":
                    this.getTrait("is.dataFormat.integer", true, true);
                    this.getTrait("is.dataFormat.small", true, true);
                    break;
                case "Int32":
                    this.getTrait("is.dataFormat.integer", true, true);
                    this.getTrait("is.dataFormat.small", true, true);
                    break;
                case "Int64":
                    this.getTrait("is.dataFormat.integer", true, true);
                    this.getTrait("is.dataFormat.big", true, true);
                    break;
                case "Float":
                    this.getTrait("is.dataFormat.floatingPoint", true, true);
                    break;
                case "Double":
                    this.getTrait("is.dataFormat.floatingPoint", true, true);
                    this.getTrait("is.dataFormat.big", true, true);
                    break;
                case "Guid":
                    this.getTrait("is.dataFormat.guid", true, true);
                case "String":
                    this.getTrait("is.dataFormat.array", true, true);
                case "Char":
                    this.getTrait("is.dataFormat.character", true, true);
                    this.getTrait("is.dataFormat.big", true, true);
                    break;
                case "Byte":
                    this.getTrait("is.dataFormat.byte", true, true);
                case "Binary":
                    this.getTrait("is.dataFormat.array", true, true);
                    break;
                case "Time":
                    this.getTrait("is.dataFormat.time", true, true);
                    break;
                case "Date":
                    this.getTrait("is.dataFormat.date", true, true);
                    break;
                case "DateTimeOffset":
                    this.getTrait("is.dataFormat.time", true, true);
                    this.getTrait("is.dataFormat.date", true, true);
                    break;
                case "Boolean":
                    this.getTrait("is.dataFormat.boolean", true, true);
                    break;
                case "Decimal":
                    this.getTrait("is.dataFormat..numeric.shaped", true, true);
                    break;
            }
        }
        //return p.measure(bodyCode);
    }
    traitsToDataFormat(removeFrom = undefined, removedIndexes = undefined) {
        //let bodyCode = () =>
        {
            let isArray = false;
            let isBig = false;
            let isSmall = false;
            let baseType = "Unknown";
            let startingRemoved = removedIndexes ? removedIndexes.length : 0;
            if (this.traits) {
                let l = this.traits.length;
                for (let i = 0; i < l; i++) {
                    let traitName = getTraitRefName(this.traits[i]);
                    let removedPosition = i;
                    switch (traitName) {
                        case "is.dataFormat.array":
                            isArray = true;
                            break;
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
                        case "is.dataFormat.character":
                            if (baseType != "Guid")
                                baseType = "Char";
                            break;
                        case "is.dataFormat.byte":
                            baseType = "Byte";
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
                        case "is.dataFormat.guid":
                            baseType = "Guid";
                            break;
                        default:
                            removedPosition = -1;
                    }
                    if (removedPosition != -1 && removedIndexes)
                        removedIndexes.push(removedPosition);
                }
                if (isArray) {
                    if (baseType == "Char")
                        baseType = "String";
                    else if (baseType == "Byte")
                        baseType = "Binary";
                    else if (baseType != "Guid")
                        baseType = "Unknown";
                }
                if (baseType == "Float" && isBig)
                    baseType = "Double";
                if (baseType == "Int" && isBig)
                    baseType = "Int64";
                if (baseType == "Int" && isSmall)
                    baseType = "Int16";
                if (baseType == "Int")
                    baseType = "Int32";
                if (baseType === "Unknown") {
                    // couldn't figure it out. undo the changes
                    removedIndexes.splice(startingRemoved);
                }
            }
            if (baseType === "Unknown")
                return undefined;
            return baseType;
        }
        //return p.measure(bodyCode);
    }
    getTrait(trait, create = false, simpleRef = false) {
        let traitName;
        if (typeof (trait) === "string") {
            let iTrait;
            traitName = trait;
            trait = undefined;
            iTrait = getTraitRefIndex(this.traits, traitName);
            if (iTrait != -1) {
                trait = this.traits[iTrait];
            }
        }
        if (!trait && create) {
            if (simpleRef)
                trait = traitName;
            else
                trait = Corpus.MakeObject(cdmObjectType.traitRef, traitName);
            if (this.hostAtt)
                trait = this.hostAtt.addAppliedTrait(trait, false);
            if (this.hostEnt)
                trait = this.hostEnt.addExhibitedTrait(trait, false);
        }
        return trait;
    }
    setTraitArgument(trait, argName, value) {
        trait = this.getTrait(trait, true, false);
        let args = trait.getArgumentDefs();
        if (!args || !args.length) {
            trait.addArgument(argName, value);
            return;
        }
        for (let iArg = 0; iArg < args.length; iArg++) {
            let arg = args[iArg];
            if (arg.getName() == argName) {
                arg.setValue(value);
                return;
            }
        }
        trait.addArgument(argName, value);
    }
    setTraitTable(trait, argName, entityName, action) {
        //let bodyCode = () =>
        {
            trait = this.getTrait(trait, true, false);
            if (!trait.getArgumentDefs() || !trait.getArgumentDefs().length) {
                // make the argument nothing but a ref to a constant entity, safe since there is only one param for the trait and it looks cleaner
                let cEnt = Corpus.MakeObject(cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(Corpus.MakeRef(cdmObjectType.entityRef, entityName, true));
                action(cEnt, true);
                trait.addArgument(argName, Corpus.MakeRef(cdmObjectType.entityRef, cEnt, false));
            }
            else {
                let locEntRef = getTraitRefArgumentValue(trait, argName);
                if (locEntRef) {
                    let locEnt = locEntRef.getObjectDef(null);
                    if (locEnt)
                        action(locEnt, false);
                }
            }
        }
        //return p.measure(bodyCode);
    }
    getTraitTable(trait, argName) {
        //let bodyCode = () =>
        {
            if (!trait)
                return undefined;
            if (typeof (trait) === "string") {
                let iTrait;
                iTrait = getTraitRefIndex(this.traits, trait);
                if (iTrait == -1)
                    return undefined;
                trait = this.traits[iTrait];
            }
            let locEntRef = getTraitRefArgumentValue(trait, argName);
            if (locEntRef) {
                return locEntRef.getObjectDef(null);
            }
        }
        //return p.measure(bodyCode);
    }
    setLocalizedTraitTable(traitName, sourceText) {
        //let bodyCode = () =>
        {
            this.setTraitTable(traitName, "localizedDisplayText", "localizedTable", (cEnt, created) => {
                if (created)
                    cEnt.setConstantValues([["en", sourceText]]);
                else
                    cEnt.setWhere(null, 1, sourceText, 0, "en"); // need to use ordinals because no binding done yet
            });
        }
        //return p.measure(bodyCode);
    }
    getLocalizedTraitTable(trait) {
        //let bodyCode = () =>
        {
            let cEnt = this.getTraitTable(trait, "localizedDisplayText");
            if (cEnt)
                return cEnt.lookupWhere(null, 1, 0, "en"); // need to use ordinals because no binding done yet
        }
        //return p.measure(bodyCode);
    }
    setSingleAttTraitTable(trait, argName, entityName, sourceText) {
        this.setTraitTable(trait, argName, entityName, (cEnt, created) => {
            // turn array of strings into array of array of strings;
            let vals = new Array();
            sourceText.forEach(v => { let r = new Array(); r.push(v); vals.push(r); });
            cEnt.setConstantValues(vals);
        });
    }
    getSingleAttTraitTable(trait, argName) {
        let cEnt = this.getTraitTable(trait, argName);
        if (cEnt) {
            // turn array of arrays into single array of strings
            let result = new Array();
            cEnt.getConstantValues().forEach(v => { result.push(v[0]); });
            return result;
        }
    }
    getDefaultValue() {
        let trait = this.getTrait("does.haveDefault", false);
        if (trait) {
            let defVal = getTraitRefArgumentValue(trait, "default");
            if (defVal != undefined && defVal != null) {
                if (typeof (defVal) === "string")
                    return defVal;
                if (defVal.getObjectType() === cdmObjectType.entityRef) {
                    let cEnt = defVal.getObjectDef(null);
                    if (cEnt) {
                        let esName = cEnt.getEntityShape().getObjectDefName();
                        let corr = esName === "listLookupCorrelatedValues";
                        let lookup = esName === "listLookupValues";
                        if (esName === "localizedTable" || lookup || corr) {
                            let result = new Array();
                            let rawValues = cEnt.getConstantValues();
                            let l = rawValues.length;
                            for (let i = 0; i < l; i++) {
                                let row = {};
                                let rawRow = rawValues[i];
                                if (rawRow.length == 2 || (lookup && rawRow.length == 4) || (corr && rawRow.length == 5)) {
                                    row["languageTag"] = rawRow[0];
                                    row["displayText"] = rawRow[1];
                                    if (lookup || corr) {
                                        row["attributeValue"] = rawRow[2];
                                        row["displayOrder"] = rawRow[3];
                                        if (corr)
                                            row["correlatedValue"] = rawRow[4];
                                    }
                                }
                                result.push(row);
                            }
                            return result;
                        }
                        else {
                            // an unknown entity shape. only thing to do is serialize the object
                            defVal = defVal.copyData(null);
                        }
                    }
                }
                else {
                    // is it a cdm object?
                    if (defVal.getObjectType != undefined)
                        defVal = defVal.copyData(null);
                }
            }
            return defVal;
        }
    }
    setDefaultValue(newDefault) {
        let trait = this.getTrait("does.haveDefault", true, false);
        if (typeof (newDefault) === "string") {
            newDefault = newDefault;
        }
        else if (newDefault instanceof Array) {
            let a = newDefault;
            let l = a.length;
            if (l && a[0].displayOrder != undefined) {
                // looks like something we understand
                let tab = new Array();
                let corr = (a[0].correlatedValue != undefined);
                for (let i = 0; i < l; i++) {
                    let row = new Array();
                    row.push(a[i].languageTag);
                    row.push(a[i].displayText);
                    row.push(a[i].attributeValue);
                    row.push(a[i].displayOrder);
                    if (corr)
                        row.push(a[i].correlatedValue);
                    tab.push(row);
                }
                let cEnt = Corpus.MakeObject(cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(Corpus.MakeRef(cdmObjectType.entityRef, corr ? "listLookupCorrelatedValues" : "listLookupValues", true));
                cEnt.setConstantValues(tab);
                newDefault = Corpus.MakeRef(cdmObjectType.entityRef, cEnt, false);
            }
        }
        this.setTraitArgument(trait, "default", newDefault);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  friendly format 
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class friendlyFormatNode {
    constructor(leafSource) {
        this.verticalMode = false;
        this.indentChildren = true;
        this.terminateAfterList = true;
        this.lineWrap = false;
        this.forceWrap = false;
        this.bracketEmpty = false;
        this.layoutWidth = 0;
        this.leafSource = leafSource;
    }
    addComment(comment) {
        this.comment = comment;
    }
    addChild(child) {
        if (!this.children)
            this.children = new Array();
        this.children.push(child);
    }
    addChildString(source, quotes = false) {
        if (source) {
            if (quotes)
                source = `"${source}"`;
            this.addChild(new friendlyFormatNode(source));
        }
    }
    setDelimiters() {
        this.calcStarter = "";
        this.calcTerminator = "";
        this.calcPreceedingSeparator = "";
        if (!this.children && !this.leafSource) {
            if (this.bracketEmpty && this.starter && this.terminator) {
                this.calcStarter = this.starter;
                this.calcTerminator = this.terminator;
            }
            return;
        }
        if (this.starter)
            this.calcStarter = this.starter;
        if (this.terminator)
            this.calcTerminator = this.terminator;
        let lChildren = this.children ? this.children.length : 0;
        for (let iChild = 0; iChild < lChildren; iChild++) {
            let child = this.children[iChild];
            child.setDelimiters();
            if (iChild > 0 && this.separator)
                child.calcPreceedingSeparator = this.separator;
        }
    }
    setWhitespace(indentLevel, needsNL) {
        this.calcIndentLevel = indentLevel;
        let lChildren = this.children ? this.children.length : 0;
        let didNL = false;
        if (this.leafSource) {
            this.calcNLBefore = needsNL;
        }
        for (let iChild = 0; iChild < lChildren; iChild++) {
            let child = this.children[iChild];
            if (this.verticalMode)
                needsNL = !didNL;
            didNL = child.setWhitespace(indentLevel + ((this.indentChildren && this.verticalMode) ? 1 : 0), needsNL);
            if (!this.verticalMode)
                needsNL = false;
        }
        if (this.verticalMode) {
            if (needsNL) {
                this.calcNLAfter = true;
                didNL = true;
            }
        }
        return didNL;
    }
    layout(maxWidth, maxMargin, start, indentWidth) {
        let position = start;
        let firstWrite;
        if (this.calcPreceedingSeparator) {
            firstWrite = position;
            position += this.calcPreceedingSeparator.length;
        }
        if (this.calcStarter) {
            firstWrite = firstWrite != undefined ? firstWrite : position;
            position += this.calcStarter.length;
        }
        if (this.calcNLBefore) {
            position = 0;
            position += this.calcIndentLevel * indentWidth;
            firstWrite = position;
        }
        if (this.children) {
            let lChildren = this.children.length;
            let wrapTo;
            for (let iChild = 0; iChild < lChildren; iChild++) {
                let child = this.children[iChild];
                if (iChild > 0 && (this.forceWrap || (this.lineWrap && position + child.layoutWidth > maxWidth))) {
                    child.calcNLBefore = true;
                    child.calcIndentLevel = Math.floor((wrapTo + indentWidth) / indentWidth);
                    position = child.calcIndentLevel * indentWidth;
                }
                let childLayout = child.layout(maxWidth, maxMargin, position, indentWidth);
                position = childLayout["0"];
                if (iChild == 0) {
                    wrapTo = childLayout["1"];
                    firstWrite = firstWrite != undefined ? firstWrite : wrapTo;
                }
            }
        }
        else if (this.leafSource) {
            firstWrite = firstWrite != undefined ? firstWrite : position;
            position += this.leafSource.length;
        }
        if (this.calcNLAfter) {
            position = 0;
            firstWrite = firstWrite != undefined ? firstWrite : position;
        }
        if (this.calcTerminator) {
            if (this.calcNLAfter)
                position += this.calcIndentLevel * indentWidth;
            firstWrite = firstWrite != undefined ? firstWrite : position;
            position += this.calcTerminator.length;
            if (this.calcNLAfter)
                position = 0;
        }
        firstWrite = firstWrite != undefined ? firstWrite : position;
        this.layoutWidth = position - firstWrite;
        return [position, firstWrite];
    }
    lineStart(startIndent) {
        let line = "";
        while (startIndent) {
            line += " ";
            startIndent--;
        }
        return line;
    }
    compose(indentWidth) {
        let compose = "";
        compose += this.calcPreceedingSeparator;
        if (this.calcStarter) {
            compose += this.calcStarter;
        }
        if (this.calcNLBefore) {
            compose += "\n";
            compose += this.lineStart(this.calcIndentLevel * indentWidth);
        }
        if (this.children) {
            let lChildren = this.children.length;
            for (let iChild = 0; iChild < lChildren; iChild++) {
                let child = this.children[iChild];
                compose += child.compose(indentWidth);
            }
        }
        else if (this.leafSource) {
            compose += this.leafSource;
        }
        if (this.calcNLAfter) {
            compose += "\n";
        }
        if (this.calcTerminator) {
            if (this.calcNLAfter)
                compose += this.lineStart(this.calcIndentLevel * indentWidth);
            compose += this.calcTerminator;
            if (this.calcNLAfter)
                compose += "\n";
        }
        return compose;
    }
    toString(maxWidth, maxMargin, startIndent, indentWidth) {
        this.setDelimiters();
        this.setWhitespace(0, false);
        this.calcNLBefore = false;
        // layout with a giant maxWidth so that we just measure everything
        this.layout(Number.MAX_SAFE_INTEGER, maxMargin, startIndent, indentWidth);
        // now use the real max
        this.layout(maxWidth, maxMargin, startIndent, indentWidth);
        return this.compose(indentWidth);
    }
}
exports.friendlyFormatNode = friendlyFormatNode;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  common base class
//  {Object}
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class cdmObject {
    constructor() {
        this.skipElevated = true;
        this.resolvingAttributes = false;
        this.ID = Corpus.nextID();
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getResolvedTraits(wrtDoc, set) {
        //let bodyCode = () =>
        {
            if (!set)
                set = cdmTraitSet.all;
            if (!this.rtsbInherited && (set == cdmTraitSet.all || set == cdmTraitSet.inheritedOnly)) {
                this.rtsbInherited = new ResolvedTraitSetBuilder(wrtDoc, cdmTraitSet.inheritedOnly);
                this.constructResolvedTraits(this.rtsbInherited);
            }
            if (!this.rtsbApplied && (set == cdmTraitSet.all || set == cdmTraitSet.appliedOnly)) {
                this.rtsbApplied = new ResolvedTraitSetBuilder(wrtDoc, cdmTraitSet.appliedOnly);
                this.constructResolvedTraits(this.rtsbApplied);
            }
            if (!this.skipElevated && !this.rtsbElevated && (set == cdmTraitSet.all || set == cdmTraitSet.elevatedOnly)) {
                this.rtsbElevated = new ResolvedTraitSetBuilder(wrtDoc, cdmTraitSet.elevatedOnly);
                this.constructResolvedTraits(this.rtsbElevated);
            }
            if (!this.rtsbAll && set == cdmTraitSet.all) {
                this.rtsbAll = new ResolvedTraitSetBuilder(wrtDoc, cdmTraitSet.all);
                // applied go after inherited so they can override
                this.rtsbAll.takeReference(this.rtsbInherited.rts);
                if (!this.skipElevated)
                    this.rtsbAll.mergeTraits(this.rtsbElevated.rts);
                this.rtsbAll.mergeTraits(this.rtsbApplied.rts);
            }
            if (set == cdmTraitSet.all)
                return this.rtsbAll.rts;
            if (set == cdmTraitSet.inheritedOnly)
                return this.rtsbInherited.rts;
            if (set == cdmTraitSet.appliedOnly)
                return this.rtsbApplied.rts;
            if (set == cdmTraitSet.elevatedOnly && !this.skipElevated)
                return this.rtsbElevated.rts;
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(wrtDoc, toTrait, paramName, value) {
        //let bodyCode = () =>
        {
            // causes rtsb to get created
            this.getResolvedTraits(wrtDoc);
            this.rtsbAll.setTraitParameterValue(wrtDoc, toTrait, paramName, value);
        }
        //return p.measure(bodyCode);
    }
    getResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            let rasbCache;
            // use a cached version unless we are building an attributeContext.
            let tag = "rasb";
            if (directives) {
                let sorted = new Array();
                directives.forEach(d => sorted.push(d));
                sorted = sorted.sort();
                sorted.forEach(d => {
                    tag += "-" + d;
                });
            }
            if (!under) {
                rasbCache = this.ctx.getCache(this, wrtDoc, tag);
            }
            if (!rasbCache) {
                if (this.resolvingAttributes) {
                    // re-entered this attribute through some kind of self or looping reference.
                    return new ResolvedAttributeSet(wrtDoc);
                }
                this.resolvingAttributes = true;
                rasbCache = this.constructResolvedAttributes(wrtDoc, directives, under);
                this.resolvingAttributes = false;
                // save this as the cached version (unless building a context)
                if (!under)
                    this.ctx.setCache(this, wrtDoc, tag, rasbCache);
            }
            return rasbCache.ras;
        }
        //return p.measure(bodyCode);
    }
    clearTraitCache() {
        //let bodyCode = () =>
        {
            if (this.rtsbAll)
                this.rtsbAll.clear();
            if (this.rtsbApplied)
                this.rtsbApplied.clear();
            if (this.rtsbElevated)
                this.rtsbElevated.clear();
            if (this.rtsbInherited)
                this.rtsbInherited.clear();
        }
        //return p.measure(bodyCode);
    }
    static copyIdentifierRef(identifier, resolved, options) {
        if (!options || !options.stringRefs)
            return identifier;
        if (!resolved)
            return identifier;
        return {
            corpusPath: resolved.getObjectPath(),
            identifier: identifier
        };
    }
    // public toJSON(): any
    // {
    //     //let bodyCode = () =>
    //     {
    //         return this.copyData(false);
    //     }
    //     //return p.measure(bodyCode);
    // }
    static arraycopyData(wrtDoc, source, options) {
        //let bodyCode = () =>
        {
            if (!source)
                return undefined;
            let casted = new Array();
            let l = source.length;
            for (let i = 0; i < l; i++) {
                const element = source[i];
                casted.push(element ? element.copyData(wrtDoc, options) : undefined);
            }
            return casted;
        }
        //return p.measure(bodyCode);
    }
    static arrayCopy(wrtDoc, source) {
        //let bodyCode = () =>
        {
            if (!source)
                return undefined;
            let casted = new Array();
            let l = source.length;
            for (let i = 0; i < l; i++) {
                const element = source[i];
                casted.push(element ? element.copy(wrtDoc) : undefined);
            }
            return casted;
        }
        //return p.measure(bodyCode);
    }
    static arrayGetFriendlyFormat(under, source) {
        //let bodyCode = () =>
        {
            if (!source || source.length == 0) {
                under.lineWrap = false;
                under.forceWrap = false;
                return;
            }
            let l = source.length;
            for (let i = 0; i < l; i++) {
                under.addChild(source[i].getFriendlyFormat());
            }
            if (l == 1) {
                under.lineWrap = false;
                under.forceWrap = false;
            }
        }
        //return p.measure(bodyCode);
    }
    static createConstant(object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            if (typeof object === "string")
                return object;
            else if (object.relationship || object.dataType || object.entity) {
                if (object.dataType)
                    return TypeAttributeImpl.instanceFromData(object);
                else if (object.entity)
                    return EntityAttributeImpl.instanceFromData(object);
                else
                    return null;
            }
            else if (object.relationshipReference)
                return RelationshipReferenceImpl.instanceFromData(object);
            else if (object.traitReference)
                return TraitReferenceImpl.instanceFromData(object);
            else if (object.dataTypeReference)
                return DataTypeReferenceImpl.instanceFromData(object);
            else if (object.entityReference)
                return EntityReferenceImpl.instanceFromData(object);
            else if (object.attributeGroupReference)
                return AttributeGroupReferenceImpl.instanceFromData(object);
            else
                return null;
        }
        //return p.measure(bodyCode);
    }
    static createDataTypeReference(object) {
        //let bodyCode = () =>
        {
            if (object)
                return DataTypeReferenceImpl.instanceFromData(object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createRelationshipReference(object) {
        //let bodyCode = () =>
        {
            if (object)
                return RelationshipReferenceImpl.instanceFromData(object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttributeContext(object) {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeContextImpl.instanceFromData(object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttributeContextReference(object) {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeContextReferenceImpl.instanceFromData(object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createEntityReference(object) {
        //let bodyCode = () =>
        {
            if (object)
                return EntityReferenceImpl.instanceFromData(object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttributeGroupReference(object) {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeGroupReferenceImpl.instanceFromData(object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttributeReference(object) {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeReferenceImpl.instanceFromData(object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttribute(object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            if (typeof object === "string")
                return AttributeGroupReferenceImpl.instanceFromData(object);
            else {
                if (object.attributeGroupReference)
                    return AttributeGroupReferenceImpl.instanceFromData(object);
                else if (object.entity)
                    return EntityAttributeImpl.instanceFromData(object);
                else if (object.name)
                    return TypeAttributeImpl.instanceFromData(object);
            }
        }
        //return p.measure(bodyCode);
    }
    static createAttributeArray(object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            let result;
            result = new Array();
            let l = object.length;
            for (let i = 0; i < l; i++) {
                const ea = object[i];
                result.push(cdmObject.createAttribute(ea));
            }
            return result;
        }
        //return p.measure(bodyCode);
    }
    static createTraitReferenceArray(object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            let result;
            result = new Array();
            let l = object.length;
            for (let i = 0; i < l; i++) {
                const tr = object[i];
                result.push(TraitReferenceImpl.instanceFromData(tr));
            }
            return result;
        }
        //return p.measure(bodyCode);
    }
    static visitArray(items, path, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let result = false;
            if (items) {
                let lItem = items.length;
                for (let iItem = 0; iItem < lItem; iItem++) {
                    let element = items[iItem];
                    if (element) {
                        if (element.visit(path, preChildren, postChildren)) {
                            result = true;
                            break;
                        }
                    }
                }
            }
            return result;
        }
        //return p.measure(bodyCode);
    }
    static resolvedTraitToTraitRef(rt) {
        if (rt.parameterValues && rt.parameterValues.length) {
            let traitRef;
            traitRef = Corpus.MakeObject(cdmObjectType.traitRef, rt.traitName, false);
            let l = rt.parameterValues.length;
            if (l == 1) {
                // just one argument, use the shortcut syntax
                let val = rt.parameterValues.values[0];
                if (val != undefined && val != null) {
                    traitRef.addArgument(undefined, val);
                }
            }
            else {
                for (let i = 0; i < l; i++) {
                    let param = rt.parameterValues.getParameter(i);
                    let val = rt.parameterValues.values[i];
                    if (val != undefined && val != null) {
                        traitRef.addArgument(param.getName(), val);
                    }
                }
            }
            return traitRef;
        }
        else {
            return rt.traitName;
        }
    }
}
// some objects are just to structure other obje
class cdmObjectSimple extends cdmObject {
    getObjectDefName() {
        return undefined;
    }
    getObjectDef(wrtDoc) {
        return undefined;
    }
    createSimpleReference(wrtDoc) {
        return undefined;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  imports
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class ImportImpl extends cdmObjectSimple {
    constructor(uri, moniker = undefined) {
        super();
        //let bodyCode = () =>
        {
            this.uri = uri;
            this.moniker = moniker ? moniker : undefined;
            this.objectType = cdmObjectType.import;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.import;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = { moniker: this.moniker, uri: this.uri };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new ImportImpl(this.uri, this.moniker);
            copy.ctx = this.ctx;
            copy.doc = this.doc;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.uri ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("import *");
            ff.addChildString(this.moniker ? "as " + this.moniker : undefined);
            ff.addChildString("from");
            ff.addChildString(`${this.uri}`, true);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let imp = new ImportImpl(object.uri, object.moniker);
            return imp;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            // not much to do
            if (preChildren && preChildren(this, pathFrom))
                return false;
            if (postChildren && postChildren(this, pathFrom))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.ImportImpl = ImportImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  arguments and parameters on traits
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ArgumentDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class ArgumentImpl extends cdmObjectSimple {
    constructor() {
        super();
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.argumentDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.argumentDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let val;
            if (this.value) {
                if (typeof (this.value) === "string")
                    val = this.value;
                else
                    val = this.value.copyData(wrtDoc, options);
            }
            // skip the argument if just a value
            if (!this.name)
                return val;
            let castedToInterface = { explanation: this.explanation, name: this.name, value: val };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new ArgumentImpl();
            copy.ctx = this.ctx;
            copy.name = this.name;
            if (this.value) {
                if (typeof (this.value) === "string")
                    copy.value = this.value;
                else
                    copy.value = this.value.copy(wrtDoc);
            }
            copy.resolvedParameter = this.resolvedParameter;
            copy.explanation = this.explanation;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.value ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = ": ";
            ff.addChildString(this.name);
            if (this.value) {
                if (typeof (this.value) === "string")
                    ff.addChildString(this.value);
                else
                    ff.addChild(this.value.getFriendlyFormat());
            }
            ff.addComment(this.explanation);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let c = new ArgumentImpl();
            if (object.value) {
                c.value = cdmObject.createConstant(object.value);
                if (object.name)
                    c.name = object.name;
                if (object.explanation)
                    c.explanation = object.explanation;
            }
            else {
                // not a structured argument, just a thing. try it
                c.value = cdmObject.createConstant(object);
            }
            return c;
        }
        //return p.measure(bodyCode);
    }
    getExplanation() {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    setExplanation(explanation) {
        //let bodyCode = () =>
        {
            this.explanation = explanation;
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    getValue() {
        //let bodyCode = () =>
        {
            return this.value;
        }
        //return p.measure(bodyCode);
    }
    setValue(value) {
        //let bodyCode = () =>
        {
            this.value = value;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    getParameterDef() {
        //let bodyCode = () =>
        {
            return this.resolvedParameter;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + (this.value ? "value/" : "");
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.value) {
                if (typeof (this.value) != "string")
                    if (this.value.visit(path, preChildren, postChildren))
                        return true;
            }
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.ArgumentImpl = ArgumentImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ParameterDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class ParameterImpl extends cdmObjectSimple {
    constructor(name) {
        super();
        //let bodyCode = () =>
        {
            this.name = name;
            this.objectType = cdmObjectType.parameterDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.parameterDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let defVal;
            if (this.defaultValue) {
                if (typeof (this.defaultValue) === "string")
                    defVal = this.defaultValue;
                else
                    defVal = this.defaultValue.copyData(wrtDoc, options);
            }
            let castedToInterface = {
                explanation: this.explanation,
                name: this.name,
                defaultValue: defVal,
                required: this.required,
                direction: this.direction,
                dataType: this.dataType ? this.dataType.copyData(wrtDoc, options) : undefined
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new ParameterImpl(this.name);
            copy.ctx = this.ctx;
            let defVal;
            if (this.defaultValue) {
                if (typeof (this.defaultValue) === "string")
                    defVal = this.defaultValue;
                else
                    defVal = this.defaultValue.copy(wrtDoc);
            }
            copy.explanation = this.explanation;
            copy.defaultValue = defVal;
            copy.required = this.required;
            copy.direction = this.direction;
            copy.dataType = (this.dataType ? this.dataType.copy(wrtDoc) : undefined);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString(this.required ? "required" : undefined);
            ff.addChildString(this.direction);
            ff.addChild(this.dataType.getFriendlyFormat());
            ff.addChildString(this.name);
            if (this.defaultValue) {
                ff.addChildString("=");
                if (typeof (this.defaultValue) === "string")
                    ff.addChildString(this.defaultValue);
                else
                    ff.addChild(this.defaultValue.getFriendlyFormat());
            }
            ff.addComment(this.explanation);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let c = new ParameterImpl(object.name);
            c.explanation = object.explanation;
            c.required = object.required ? object.required : false;
            c.direction = object.direction ? object.direction : "in";
            c.defaultValue = cdmObject.createConstant(object.defaultValue);
            c.dataType = cdmObject.createDataTypeReference(object.dataType);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getExplanation() {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    getDefaultValue() {
        //let bodyCode = () =>
        {
            return this.defaultValue;
        }
        //return p.measure(bodyCode);
    }
    getRequired() {
        //let bodyCode = () =>
        {
            return this.required;
        }
        //return p.measure(bodyCode);
    }
    getDirection() {
        //let bodyCode = () =>
        {
            return this.direction;
        }
        //return p.measure(bodyCode);
    }
    getDataTypeRef() {
        //let bodyCode = () =>
        {
            return this.dataType;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + this.name;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.defaultValue && typeof (this.defaultValue) != "string")
                if (this.defaultValue.visit(path + "/defaultValue/", preChildren, postChildren))
                    return true;
            if (this.dataType)
                if (this.dataType.visit(path + "/dataType/", preChildren, postChildren))
                    return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.ParameterImpl = ParameterImpl;
let addTraitRef = (collection, traitDefOrRef, implicitRef) => {
    //let bodyCode = () =>
    {
        if (traitDefOrRef) {
            let tRef;
            if (traitDefOrRef.getObjectType && traitDefOrRef.getObjectType() === cdmObjectType.traitRef)
                // already a ref, just store it
                tRef = traitDefOrRef;
            else {
                if (typeof (traitDefOrRef) === "string")
                    // all we got is a string, so make a trait ref out of it
                    tRef = new TraitReferenceImpl(traitDefOrRef, implicitRef, false);
                else
                    // must be a trait def, so make a ref 
                    tRef = new TraitReferenceImpl(traitDefOrRef, false, false);
            }
            collection.push(tRef);
            return tRef;
        }
    }
    //return p.measure(bodyCode);
};
let getTraitRefName = (traitRefOrDef) => {
    //let bodyCode = () =>
    {
        // lots of things this could be on an unresolved object model, so try them
        if (typeof traitRefOrDef === "string")
            return traitRefOrDef;
        if (traitRefOrDef.parameterValues)
            return traitRefOrDef.traitName;
        let ot = traitRefOrDef.getObjectType();
        if (ot == cdmObjectType.traitDef)
            return traitRefOrDef.getName();
        if (ot == cdmObjectType.traitRef) {
            return traitRefOrDef.getObjectDefName();
        }
        return null;
    }
    //return p.measure(bodyCode);
};
let getTraitRefIndex = (collection, traitDef) => {
    //let bodyCode = () =>
    {
        if (!collection)
            return -1;
        let index;
        let traitName = getTraitRefName(traitDef);
        index = collection.findIndex(t => {
            return getTraitRefName(t) == traitName;
        });
        return index;
    }
    //return p.measure(bodyCode);
};
let removeTraitRef = (collection, traitDef) => {
    //let bodyCode = () =>
    {
        let index = getTraitRefIndex(collection, traitDef);
        if (index >= 0)
            collection.splice(index, 1);
    }
    //return p.measure(bodyCode);
};
let getTraitRefArgumentValue = (tr, argName) => {
    //let bodyCode = () =>
    {
        if (tr) {
            let av;
            if (tr.parameterValues)
                av = tr.parameterValues.getParameterValue(argName).value;
            else
                av = tr.getArgumentValue(argName);
            return av;
        }
    }
    //return p.measure(bodyCode);
};
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  base classes for definitions and references
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ObjectDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class cdmObjectDef extends cdmObject {
    //baseCache : Set<string>;
    constructor(exhibitsTraits = false) {
        super();
        //let bodyCode = () =>
        {
            if (exhibitsTraits)
                this.exhibitsTraits = new Array();
        }
        //return p.measure(bodyCode);
    }
    copyDef(wrtDoc, copy) {
        //let bodyCode = () =>
        {
            copy.explanation = this.explanation;
            copy.exhibitsTraits = cdmObject.arrayCopy(wrtDoc, this.exhibitsTraits);
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormatDef(under) {
        //let bodyCode = () =>
        {
            if (this.exhibitsTraits && this.exhibitsTraits.length) {
                let ff = new friendlyFormatNode();
                ff.separator = " ";
                ff.addChildString("exhibits");
                let ffT = new friendlyFormatNode();
                ffT.separator = ", ";
                ffT.lineWrap = true;
                cdmObject.arrayGetFriendlyFormat(ffT, this.exhibitsTraits);
                ff.addChild(ffT);
                under.addChild(ff);
            }
            under.addComment(this.explanation);
        }
        //return p.measure(bodyCode);
    }
    getObjectDefName() {
        //let bodyCode = () =>
        {
            return this.getName();
        }
        //return p.measure(bodyCode);
    }
    getObjectDef(wrtDoc) {
        //let bodyCode = () =>
        {
            return this;
        }
        //return p.measure(bodyCode);
    }
    getExplanation() {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    setExplanation(explanation) {
        this.explanation = explanation;
        return this.explanation;
    }
    getExhibitedTraitRefs() {
        //let bodyCode = () =>
        {
            return this.exhibitsTraits;
        }
        //return p.measure(bodyCode);
    }
    addExhibitedTrait(traitDef, implicitRef = false) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (!this.exhibitsTraits)
                this.exhibitsTraits = new Array();
            return addTraitRef(this.exhibitsTraits, traitDef, implicitRef);
        }
        //return p.measure(bodyCode);
    }
    removeExhibitedTrait(traitDef) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (this.exhibitsTraits)
                removeTraitRef(this.exhibitsTraits, traitDef);
        }
        //return p.measure(bodyCode);
    }
    visitDef(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            if (this.exhibitsTraits)
                if (cdmObject.visitArray(this.exhibitsTraits, pathFrom + "/exhibitsTraits/", preChildren, postChildren))
                    return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFromDef(wrtDoc, base, name, seek) {
        //let bodyCode = () =>
        {
            if (seek == name)
                return true;
            let def;
            if (base && (def = base.getObjectDef(wrtDoc)))
                return def.isDerivedFrom(wrtDoc, seek);
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraitsDef(base, rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set == cdmTraitSet.inheritedOnly)
                set = cdmTraitSet.all;
            // get from base class first, then see if some are applied to base class on ref then add any traits exhibited by this def
            if (base) {
                // merge in all from base class
                rtsb.mergeTraits(base.getResolvedTraits(rtsb.wrtDoc, set));
            }
            // merge in any that are exhibited by this class
            if (this.exhibitsTraits) {
                this.exhibitsTraits.forEach(et => {
                    rtsb.mergeTraits(et.getResolvedTraits(rtsb.wrtDoc, set));
                });
            }
        }
        //return p.measure(bodyCode);
    }
    getObjectPath() {
        //let bodyCode = () =>
        {
            return this.corpusPath;
        }
        //return p.measure(bodyCode);
    }
    createSimpleReference(wrtDoc) {
        let name;
        if (this.declaredPath)
            name = this.declaredPath;
        else
            name = this.getName();
        let ref = Corpus.MakeObject(Corpus.GetReferenceType(this.getObjectType()), name, true);
        // push into cache if there is one
        if (wrtDoc && this.ctx) {
            let res = {
                toObjectDef: this,
                underCtx: this.ctx,
                usingDoc: wrtDoc,
                viaMoniker: false
            };
            ref.ctx = this.ctx;
            this.ctx.setCache(this, wrtDoc, "nameResolve", res);
        }
        return ref;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ObjectRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class cdmObjectRef extends cdmObject {
    constructor(referenceTo, simpleReference, appliedTraits) {
        super();
        //let bodyCode = () =>
        {
            if (referenceTo) {
                if (typeof (referenceTo) === "string") {
                    this.namedReference = referenceTo;
                }
                else
                    this.explicitReference = referenceTo;
            }
            if (simpleReference)
                this.simpleNamedReference = true;
            if (appliedTraits)
                this.appliedTraits = new Array();
        }
        //return p.measure(bodyCode);
    }
    getResolvedReference(wrtDoc) {
        //let bodyCode = () =>
        {
            if (this.explicitReference)
                return this.explicitReference;
            // first check for the null document, this gets set if the reference comes up 
            // with an explicit use of a monikered import, so honor that and use it independent of the wrt
            // then check for the wrt doc
            // if neither of these is true, then resolve in the doc context
            // this behavior is modeled after virtual functions and the use of explicit calls to base class methods
            if (!this.ctx)
                return undefined;
            let res;
            if (this.monikeredDocument)
                wrtDoc = this.monikeredDocument;
            res = this.ctx.getCache(this, wrtDoc, "nameResolve");
            if (res)
                return res.toObjectDef;
            let resAttToken = "/(resolvedAttributes)/";
            let seekResAtt = this.namedReference.indexOf(resAttToken);
            if (seekResAtt >= 0) {
                res = { underCtx: this.ctx, usingDoc: wrtDoc };
                let entName = this.namedReference.substring(0, seekResAtt);
                let attName = this.namedReference.slice(seekResAtt + resAttToken.length);
                // get the entity
                // resolveNamedReference expects the current document to be set in the context, so put the wrt doc in there
                let save = this.ctx.currentDoc;
                this.ctx.currentDoc = wrtDoc;
                let ent = this.ctx.resolveNamedReference(entName, cdmObjectType.entityDef);
                this.ctx.currentDoc = save;
                if (!ent || ent.toObjectDef.objectType != cdmObjectType.entityDef) {
                    this.ctx.statusRpt(cdmStatusLevel.warning, `unable to resolve an entity named '${entName}' from the reference '${this.namedReference}'`, "");
                    return null;
                }
                // get the resolved attribute
                let ra = ent.toObjectDef.getResolvedAttributes(wrtDoc).get(attName);
                if (ra)
                    res.toObjectDef = ra.target;
                else {
                    this.ctx.statusRpt(cdmStatusLevel.warning, `couldn't resolve the attribute promise for '${this.namedReference}'`, "");
                }
            }
            else {
                let save = this.ctx.currentDoc;
                this.ctx.currentDoc = wrtDoc;
                res = this.ctx.resolveNamedReference(this.namedReference, cdmObjectType.error);
                this.ctx.currentDoc = save;
            }
            if (res) {
                this.ctx.setCache(this, wrtDoc, "nameResolve", res);
            }
            else {
                if (res) {
                    // for debugging only
                    let save = this.ctx.currentDoc;
                    this.ctx.currentDoc = wrtDoc;
                    res = this.ctx.resolveNamedReference(this.namedReference, cdmObjectType.error);
                    this.ctx.currentDoc = save;
                }
                return undefined;
            }
            return res.toObjectDef;
        }
        //return p.measure(bodyCode);
    }
    createSimpleReference(wrtDoc) {
        if (this.namedReference)
            return this.copyRefObject(wrtDoc, this.namedReference, true);
        return this.copyRefObject(wrtDoc, this.declaredPath + this.explicitReference.getName(), true);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let copy = {};
            if (this.namedReference) {
                let identifier = cdmObject.copyIdentifierRef(this.namedReference, this.getResolvedReference(wrtDoc), options);
                if (this.simpleNamedReference)
                    return identifier;
                let replace = this.copyRefData(wrtDoc, copy, identifier, options);
                if (replace)
                    copy = replace;
            }
            else if (this.explicitReference) {
                let erCopy = this.explicitReference.copyData(wrtDoc, options);
                let replace = this.copyRefData(wrtDoc, copy, erCopy, options);
                if (replace)
                    copy = replace;
            }
            if (this.appliedTraits)
                copy.appliedTraits = cdmObject.arraycopyData(wrtDoc, this.appliedTraits, options);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        let copy = this.copyRefObject(wrtDoc, this.namedReference ? this.namedReference : this.explicitReference, this.simpleNamedReference);
        if (this.appliedTraits)
            copy.appliedTraits = cdmObject.arrayCopy(wrtDoc, this.appliedTraits);
        return copy;
    }
    getObjectDefName() {
        //let bodyCode = () =>
        {
            if (this.namedReference)
                return this.namedReference;
            if (this.explicitReference)
                return this.explicitReference.getName();
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef(wrtDoc) {
        //let bodyCode = () =>
        {
            let def = this.getResolvedReference(wrtDoc);
            if (def)
                return def;
            // let docName = wrtDoc ? wrtDoc.getName() : "<no document>"
            // let refName = this.namedReference ? this.namedReference : "<no id>";
            // return new Proxy({},
            //     {
            //         get: function(target, prop) {
            //             return function() { console.log(`called '${prop.toString()}' on failed reference to '${refName}' using '${docName}'`)};
            //         }
            //     }) as any;
        }
        //return p.measure(bodyCode);
    }
    setObjectDef(def) {
        //let bodyCode = () =>
        {
            this.explicitReference = def;
            return def;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            if (this.namedReference)
                ff.addChildString(this.namedReference);
            else
                ff.addChild(this.explicitReference.getFriendlyFormat());
            if (this.appliedTraits && this.appliedTraits.length) {
                let ffT = new friendlyFormatNode();
                ffT.separator = ", ";
                ffT.lineWrap = true;
                ffT.starter = "[";
                ffT.terminator = "]";
                cdmObject.arrayGetFriendlyFormat(ffT, this.appliedTraits);
                ff.addChild(ffT);
            }
            return ff;
        }
        //return p.measure(bodyCode);
    }
    getAppliedTraitRefs() {
        //let bodyCode = () =>
        {
            return this.appliedTraits;
        }
        //return p.measure(bodyCode);
    }
    addAppliedTrait(traitDef, implicitRef = false) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (!this.appliedTraits)
                this.appliedTraits = new Array();
            return addTraitRef(this.appliedTraits, traitDef, implicitRef);
        }
        //return p.measure(bodyCode);
    }
    removeAppliedTrait(traitDef) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (this.appliedTraits)
                removeTraitRef(this.appliedTraits, traitDef);
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return (this.namedReference || this.explicitReference) ? true : false;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                if (this.namedReference)
                    path = pathFrom + this.namedReference;
                else
                    path = pathFrom;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.explicitReference && !this.namedReference)
                if (this.explicitReference.visit(path, preChildren, postChildren))
                    return true;
            if (this.visitRef(path, preChildren, postChildren))
                return true;
            if (this.appliedTraits)
                if (cdmObject.visitArray(this.appliedTraits, path + "/appliedTraits/", preChildren, postChildren))
                    return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            let rasb = new ResolvedAttributeSetBuilder(wrtDoc, directives);
            rasb.setAttributeContext(under);
            let def = this.getObjectDef(wrtDoc);
            if (def) {
                rasb.takeReference(def.getResolvedAttributes(wrtDoc, directives, under));
                rasb.prepareForTraitApplication(this.getResolvedTraits(wrtDoc, cdmTraitSet.appliedOnly));
                rasb.applyTraits();
                rasb.removeRequestedAtts();
            }
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            let objDef = this.getObjectDef(rtsb.wrtDoc);
            if (set == cdmTraitSet.inheritedOnly) {
                if (objDef) {
                    let rtsInh = objDef.getResolvedTraits(rtsb.wrtDoc, cdmTraitSet.all);
                    if (rtsInh)
                        rtsInh = rtsInh.deepCopy();
                    rtsb.takeReference(rtsInh);
                }
                return;
            }
            if (set == cdmTraitSet.appliedOnly)
                set = cdmTraitSet.all;
            if (set == cdmTraitSet.elevatedOnly) {
                if (objDef) {
                    let rtsElev = objDef.getResolvedTraits(rtsb.wrtDoc, set);
                    if (rtsElev)
                        rtsElev = rtsElev.deepCopy();
                    rtsb.takeReference(rtsElev);
                }
                return;
            }
            if (this.appliedTraits) {
                this.appliedTraits.forEach(at => {
                    rtsb.mergeTraits(at.getResolvedTraits(rtsb.wrtDoc, set));
                });
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
}
exports.cdmObjectRef = cdmObjectRef;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Traits
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TraitRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TraitReferenceImpl extends cdmObjectRef {
    constructor(trait, simpleReference, hasArguments) {
        super(trait, simpleReference, false);
        //let bodyCode = () =>
        {
            if (hasArguments)
                this.arguments = new Array();
            this.objectType = cdmObjectType.traitRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.traitRef;
        }
        //return p.measure(bodyCode);
    }
    copyRefData(wrtDoc, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.traitReference = refTo;
            copy.arguments = cdmObject.arraycopyData(wrtDoc, this.arguments, options);
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(wrtDoc, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new TraitReferenceImpl(refTo, simpleReference, (this.arguments && this.arguments.length > 0));
            copy.ctx = this.ctx;
            if (!simpleReference)
                copy.arguments = cdmObject.arrayCopy(wrtDoc, this.arguments);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let trait;
            if (typeof (object) == "string")
                trait = object;
            else {
                simpleReference = false;
                if (typeof (object.traitReference) === "string")
                    trait = object.traitReference;
                else
                    trait = TraitImpl.instanceFromData(object.traitReference);
            }
            let c = new TraitReferenceImpl(trait, simpleReference, object.arguments);
            if (object.arguments) {
                object.arguments.forEach(a => {
                    c.arguments.push(ArgumentImpl.instanceFromData(a));
                });
            }
            return c;
        }
        //return p.measure(bodyCode);
    }
    visitRef(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            if (this.arguments)
                if (cdmObject.visitArray(this.arguments, pathFrom + "/arguments/", preChildren, postChildren))
                    return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.addChildString(this.getObjectDefName());
            let ffSub = new friendlyFormatNode();
            ffSub.separator = ", ";
            ffSub.lineWrap = true;
            ffSub.starter = "(";
            ffSub.terminator = ")";
            ffSub.bracketEmpty = true;
            cdmObject.arrayGetFriendlyFormat(ffSub, this.arguments);
            ff.addChild(ffSub);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    getArgumentDefs() {
        //let bodyCode = () =>
        {
            return this.arguments;
        }
        //return p.measure(bodyCode);
    }
    addArgument(name, value) {
        //let bodyCode = () =>
        {
            if (!this.arguments)
                this.arguments = new Array();
            let newArg = Corpus.MakeObject(cdmObjectType.argumentDef, name);
            newArg.setValue(value);
            this.arguments.push(newArg);
            return newArg;
        }
        //return p.measure(bodyCode);
    }
    getArgumentValue(name) {
        //let bodyCode = () =>
        {
            if (!this.arguments)
                return undefined;
            let iArgSet = 0;
            let lArgSet = this.arguments.length;
            for (iArgSet = 0; iArgSet < lArgSet; iArgSet++) {
                const arg = this.arguments[iArgSet];
                const argName = arg.getName();
                if (argName === name) {
                    return arg.getValue();
                }
                // special case with only one argument and no name give, make a big assumption that this is the one they want
                // right way is to look up parameter def and check name, but this interface is for working on an unresolved def
                if (argName == undefined && lArgSet === 1)
                    return arg.getValue();
            }
        }
        //return p.measure(bodyCode);
    }
    setArgumentValue(name, value) {
        //let bodyCode = () =>
        {
            if (!this.arguments)
                this.arguments = new Array();
            let iArgSet = 0;
            for (iArgSet = 0; iArgSet < this.arguments.length; iArgSet++) {
                const arg = this.arguments[iArgSet];
                if (arg.getName() == name) {
                    arg.setValue(value);
                }
            }
            if (iArgSet == this.arguments.length) {
                let arg = new ArgumentImpl();
                arg.ctx = this.ctx;
                arg.name = name;
                arg.value = value;
            }
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set != cdmTraitSet.appliedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                // get referenced trait
                let trait = this.getObjectDef(rtsb.wrtDoc);
                if (trait) {
                    // get the set of resolutions, should just be this one trait
                    let rts = trait.getResolvedTraits(rtsb.wrtDoc, set);
                    if (rts)
                        rts = rts.deepCopy();
                    rtsb.takeReference(rts);
                    // now if there are argument for this application, set the values in the array
                    if (this.arguments) {
                        this.arguments.forEach(a => {
                            rtsb.setParameterValueFromArgument(trait, a);
                        });
                    }
                }
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
}
exports.TraitReferenceImpl = TraitReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TraitDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TraitImpl extends cdmObjectDef {
    constructor(name, extendsTrait, hasParameters = false) {
        super();
        //let bodyCode = () =>
        {
            this.hasSetFlags = false;
            this.objectType = cdmObjectType.traitDef;
            this.traitName = name;
            this.extendsTrait = extendsTrait;
            if (hasParameters)
                this.hasParameters = new Array();
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.traitDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                traitName: this.traitName,
                extendsTrait: this.extendsTrait ? this.extendsTrait.copyData(wrtDoc, options) : undefined,
                hasParameters: cdmObject.arraycopyData(wrtDoc, this.hasParameters, options),
                elevated: this.elevated,
                modifiesAttributes: this.modifiesAttributes,
                ugly: this.ugly,
                associatedProperties: this.associatedProperties
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new TraitImpl(this.traitName, null, false);
            copy.ctx = this.ctx;
            copy.extendsTrait = this.extendsTrait ? this.extendsTrait.copy(wrtDoc) : undefined,
                copy.hasParameters = cdmObject.arrayCopy(wrtDoc, this.hasParameters);
            copy.allParameters = null;
            copy.elevated = this.elevated;
            copy.ugly = this.ugly;
            copy.modifiesAttributes = this.modifiesAttributes;
            copy.associatedProperties = this.associatedProperties;
            this.copyDef(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.traitName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("trait");
            ff.addChildString(this.traitName);
            if (this.extendsTrait) {
                ff.addChildString("extends");
                ff.addChild(this.extendsTrait.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);
            if (this.hasParameters) {
                let ffSub = new friendlyFormatNode();
                ffSub.forceWrap = true;
                //ffSub.verticalMode = true;
                ffSub.bracketEmpty = true;
                ffSub.separator = ";";
                ffSub.starter = "{";
                ffSub.terminator = "}";
                cdmObject.arrayGetFriendlyFormat(ffSub, this.hasParameters);
                ff.addChild(ffSub);
            }
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let extendsTrait;
            if (object.extendsTrait)
                extendsTrait = TraitReferenceImpl.instanceFromData(object.extendsTrait);
            let c = new TraitImpl(object.traitName, extendsTrait, object.hasParameters);
            if (object.explanation)
                c.explanation = object.explanation;
            if (object.hasParameters) {
                object.hasParameters.forEach(ap => {
                    c.hasParameters.push(ParameterImpl.instanceFromData(ap));
                });
            }
            if (object.elevated != undefined)
                c.elevated = object.elevated;
            if (object.ugly != undefined)
                c.ugly = object.ugly;
            if (object.modifiesAttributes != undefined)
                c.modifiesAttributes = object.modifiesAttributes;
            if (object.associatedProperties)
                c.associatedProperties = object.associatedProperties;
            return c;
        }
        //return p.measure(bodyCode);
    }
    getExplanation() {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.traitName;
        }
        //return p.measure(bodyCode);
    }
    getExtendsTrait() {
        //let bodyCode = () =>
        {
            return this.extendsTrait;
        }
        //return p.measure(bodyCode);
    }
    setExtendsTrait(traitDef, implicitRef = false) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            let extRef = new Array();
            addTraitRef(extRef, traitDef, implicitRef);
            this.extendsTrait = extRef[0];
            return this.extendsTrait;
        }
        //return p.measure(bodyCode);
    }
    getHasParameterDefs() {
        //let bodyCode = () =>
        {
            return this.hasParameters;
        }
        //return p.measure(bodyCode);
    }
    getExhibitedTraitRefs() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(wrtDoc, base) {
        //let bodyCode = () =>
        {
            if (base === this.traitName)
                return true;
            return this.isDerivedFromDef(wrtDoc, this.extendsTrait, this.traitName, base);
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + this.traitName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.extendsTrait)
                if (this.extendsTrait.visit(path + "/extendsTrait/", preChildren, postChildren))
                    return true;
            if (this.hasParameters)
                if (cdmObject.visitArray(this.hasParameters, path + "/hasParameters/", preChildren, postChildren))
                    return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    addTraitApplier(applier) {
        //let bodyCode = () =>
        {
            if (!this.appliers || applier.overridesBase)
                this.appliers = new Array();
            this.appliers.push(applier);
        }
        //return p.measure(bodyCode);
    }
    getTraitAppliers() {
        //let bodyCode = () =>
        {
            return this.appliers;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set != cdmTraitSet.appliedOnly) {
                if (set == cdmTraitSet.elevatedOnly && !this.elevated) {
                    // stop now. won't keep these anyway
                    return;
                }
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                let baseValues;
                if (this.extendsTrait) {
                    // get the resolution of the base class and use the values as a starting point for this trait's values
                    let base = this.extendsTrait.getResolvedTraits(rtsb.wrtDoc, set);
                    if (base)
                        baseValues = base.get(this.extendsTrait.getObjectDef(rtsb.wrtDoc)).parameterValues.values;
                    if (this.hasSetFlags == false) {
                        // inherit these flags
                        let baseTrait = this.extendsTrait.getObjectDef(rtsb.wrtDoc);
                        if (this.elevated == undefined)
                            this.elevated = baseTrait.elevated;
                        if (this.ugly == undefined)
                            this.ugly = baseTrait.ugly;
                        if (this.modifiesAttributes == undefined)
                            this.modifiesAttributes = baseTrait.modifiesAttributes;
                        if (this.associatedProperties == undefined)
                            this.associatedProperties = baseTrait.associatedProperties;
                    }
                }
                this.hasSetFlags = true;
                let pc = this.getAllParameters(rtsb.wrtDoc);
                let av = new Array();
                let wasSet = new Array();
                for (let i = 0; i < pc.sequence.length; i++) {
                    // either use the default value or (higher precidence) the value taken from the base reference
                    let value = pc.sequence[i].defaultValue;
                    let baseValue;
                    if (baseValues && i < baseValues.length) {
                        baseValue = baseValues[i];
                        if (baseValue)
                            value = baseValue;
                    }
                    av.push(value);
                    wasSet.push(false);
                }
                rtsb.ownOne(new ResolvedTrait(this, pc, av, wasSet));
            }
        }
        //return p.measure(bodyCode);
    }
    getAllParameters(wrtDoc) {
        //let bodyCode = () =>
        {
            if (this.allParameters)
                return this.allParameters;
            // get parameters from base if there is one
            let prior;
            if (this.extendsTrait)
                prior = this.getExtendsTrait().getObjectDef(wrtDoc).getAllParameters(wrtDoc);
            this.allParameters = new ParameterCollection(prior);
            if (this.hasParameters) {
                this.hasParameters.forEach(element => {
                    this.allParameters.add(element);
                });
            }
            return this.allParameters;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.TraitImpl = TraitImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  relationships
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {RelationshipRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class RelationshipReferenceImpl extends cdmObjectRef {
    constructor(relationship, simpleReference, appliedTraits) {
        super(relationship, simpleReference, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.relationshipRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.relationshipRef;
        }
        //return p.measure(bodyCode);
    }
    copyRefData(wrtDoc, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.relationshipReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(wrtDoc, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new RelationshipReferenceImpl(refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
            copy.ctx = this.ctx;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let relationship;
            if (typeof (object) == "string")
                relationship = object;
            else {
                simpleReference = false;
                if (typeof (object.relationshipReference) === "string")
                    relationship = object.relationshipReference;
                else
                    relationship = RelationshipImpl.instanceFromData(object.relationshipReference);
            }
            let c = new RelationshipReferenceImpl(relationship, simpleReference, object.appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    visitRef(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.RelationshipReferenceImpl = RelationshipReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {RelationshipDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class RelationshipImpl extends cdmObjectDef {
    constructor(relationshipName, extendsRelationship, exhibitsTraits = false) {
        super(exhibitsTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.relationshipDef;
            this.relationshipName = relationshipName;
            if (extendsRelationship)
                this.extendsRelationship = extendsRelationship;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.relationshipDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                relationshipName: this.relationshipName,
                extendsRelationship: this.extendsRelationship ? this.extendsRelationship.copyData(wrtDoc, options) : undefined,
                exhibitsTraits: cdmObject.arraycopyData(wrtDoc, this.exhibitsTraits, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new RelationshipImpl(this.relationshipName, null, false);
            copy.ctx = this.ctx;
            copy.extendsRelationship = this.extendsRelationship ? this.extendsRelationship.copy(wrtDoc) : undefined;
            this.copyDef(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        return this.relationshipName ? true : false;
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("relationship");
            ff.addChildString(this.relationshipName);
            if (this.extendsRelationship) {
                ff.addChildString("extends");
                ff.addChild(this.extendsRelationship.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let extendsRelationship;
            extendsRelationship = cdmObject.createRelationshipReference(object.extendsRelationship);
            let c = new RelationshipImpl(object.relationshipName, extendsRelationship, object.exhibitsTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.relationshipName;
        }
        //return p.measure(bodyCode);
    }
    getExtendsRelationshipRef() {
        //let bodyCode = () =>
        {
            return this.extendsRelationship;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + this.relationshipName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.extendsRelationship)
                if (this.extendsRelationship.visit(path + "/extendsRelationship/", preChildren, postChildren))
                    return true;
            if (this.visitDef(path, preChildren, postChildren))
                return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(wrtDoc, base) {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(wrtDoc, this.getExtendsRelationshipRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsRelationshipRef(), rtsb);
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.RelationshipImpl = RelationshipImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  datatypes
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {DataTypeRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class DataTypeReferenceImpl extends cdmObjectRef {
    constructor(dataType, simpleReference, appliedTraits) {
        super(dataType, simpleReference, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.dataTypeRef;
        }
        //return p.measure(bodyCode);
    }
    copyRefData(wrtDoc, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.dataTypeReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(wrtDoc, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new DataTypeReferenceImpl(refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
            copy.ctx = this.ctx;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let dataType;
            if (typeof (object) == "string")
                dataType = object;
            else {
                simpleReference = false;
                if (typeof (object.dataTypeReference) === "string")
                    dataType = object.dataTypeReference;
                else
                    dataType = DataTypeImpl.instanceFromData(object.dataTypeReference);
            }
            let c = new DataTypeReferenceImpl(dataType, simpleReference, object.appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    visitRef(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.DataTypeReferenceImpl = DataTypeReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {DataTypeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class DataTypeImpl extends cdmObjectDef {
    constructor(dataTypeName, extendsDataType, exhibitsTraits = false) {
        super(exhibitsTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeDef;
            this.dataTypeName = dataTypeName;
            this.extendsDataType = extendsDataType;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.dataTypeDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                dataTypeName: this.dataTypeName,
                extendsDataType: this.extendsDataType ? this.extendsDataType.copyData(wrtDoc, options) : undefined,
                exhibitsTraits: cdmObject.arraycopyData(wrtDoc, this.exhibitsTraits, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new DataTypeImpl(this.dataTypeName, null, false);
            copy.ctx = this.ctx;
            copy.extendsDataType = this.extendsDataType ? this.extendsDataType.copy(wrtDoc) : undefined;
            this.copyDef(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.dataTypeName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("dataType");
            ff.addChildString(this.dataTypeName);
            if (this.extendsDataType) {
                ff.addChildString("extends");
                ff.addChild(this.extendsDataType.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let extendsDataType;
            extendsDataType = cdmObject.createDataTypeReference(object.extendsDataType);
            let c = new DataTypeImpl(object.dataTypeName, extendsDataType, object.exhibitsTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.dataTypeName;
        }
        //return p.measure(bodyCode);
    }
    getExtendsDataTypeRef() {
        //let bodyCode = () =>
        {
            return this.extendsDataType;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + this.dataTypeName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.extendsDataType)
                if (this.extendsDataType.visit(path + "/extendsDataType/", preChildren, postChildren))
                    return true;
            if (this.visitDef(path, preChildren, postChildren))
                return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(wrtDoc, base) {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(wrtDoc, this.getExtendsDataTypeRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsDataTypeRef(), rtsb);
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.DataTypeImpl = DataTypeImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  attributes
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  attribute references. only used internally, so not persisted except as simple string refs
// 
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeReferenceImpl extends cdmObjectRef {
    constructor(attribute, simpleReference) {
        super(attribute, simpleReference, false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeRef;
        }
        //return p.measure(bodyCode);
    }
    copyRefData(wrtDoc, copy, refTo, options) {
        //let bodyCode = () =>
        {
            // there is no persisted object wrapper
            return refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(wrtDoc, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new AttributeReferenceImpl(refTo, simpleReference);
            copy.ctx = this.ctx;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let attribute;
            if (typeof (object) == "string")
                attribute = object;
            else {
                simpleReference = false;
                attribute = cdmObject.createAttribute(object);
            }
            let c = new AttributeReferenceImpl(attribute, simpleReference);
            return c;
        }
        //return p.measure(bodyCode);
    }
    visitRef(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.AttributeReferenceImpl = AttributeReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeImpl extends cdmObjectDef {
    constructor(name, appliedTraits = false) {
        super();
        //let bodyCode = () =>
        {
            this.name = name;
            if (appliedTraits)
                this.appliedTraits = new Array();
        }
        //return p.measure(bodyCode);
    }
    copyAtt(wrtDoc, copy) {
        //let bodyCode = () =>
        {
            copy.relationship = this.relationship ? this.relationship.copy(wrtDoc) : undefined;
            copy.appliedTraits = cdmObject.arrayCopy(wrtDoc, this.appliedTraits);
            this.copyDef(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    setObjectDef(def) {
        //let bodyCode = () =>
        {
            throw Error("not a ref");
        }
        //return p.measure(bodyCode);
    }
    getRelationshipRef() {
        //let bodyCode = () =>
        {
            return this.relationship;
        }
        //return p.measure(bodyCode);
    }
    setRelationshipRef(relRef) {
        //let bodyCode = () =>
        {
            this.relationship = relRef;
            return this.relationship;
        }
        //return p.measure(bodyCode);
    }
    getAppliedTraitRefs() {
        //let bodyCode = () =>
        {
            return this.appliedTraits;
        }
        //return p.measure(bodyCode);
    }
    addAppliedTrait(traitDef, implicitRef = false) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (!this.appliedTraits)
                this.appliedTraits = new Array();
            return addTraitRef(this.appliedTraits, traitDef, implicitRef);
        }
        //return p.measure(bodyCode);
    }
    removeAppliedTrait(traitDef) {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (this.appliedTraits)
                removeTraitRef(this.appliedTraits, traitDef);
        }
        //return p.measure(bodyCode);
    }
    visitAtt(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            if (this.relationship)
                if (this.relationship.visit(pathFrom + "/relationship/", preChildren, postChildren))
                    return true;
            if (this.appliedTraits)
                if (cdmObject.visitArray(this.appliedTraits, pathFrom + "/appliedTraits/", preChildren, postChildren))
                    return true;
            if (this.visitDef(pathFrom, preChildren, postChildren))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    addResolvedTraitsApplied(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            let addAppliedTraits = (ats) => {
                if (ats) {
                    let l = ats.length;
                    for (let i = 0; i < l; i++) {
                        rtsb.mergeTraits(ats[i].getResolvedTraits(rtsb.wrtDoc, cdmTraitSet.all));
                    }
                }
            };
            addAppliedTraits(this.appliedTraits);
            // any applied on use
            return rtsb.rts;
        }
        //return p.measure(bodyCode);
    }
    removeTraitDef(wrtDoc, def) {
        //let bodyCode = () =>
        {
            this.clearTraitCache();
            let traitName = def.getName();
            if (this.appliedTraits) {
                let iRemove = 0;
                for (iRemove = 0; iRemove < this.appliedTraits.length; iRemove++) {
                    const tr = this.appliedTraits[iRemove];
                    if (tr.getObjectDef(wrtDoc).getName() == traitName)
                        break;
                }
                if (iRemove < this.appliedTraits.length) {
                    this.appliedTraits.splice(iRemove, 1);
                    return;
                }
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.AttributeImpl = AttributeImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TypeAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TypeAttributeImpl extends AttributeImpl {
    constructor(name, appliedTraits = false) {
        super(name, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.typeAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.typeAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                relationship: this.relationship ? this.relationship.copyData(wrtDoc, options) : undefined,
                dataType: this.dataType ? this.dataType.copyData(wrtDoc, options) : undefined,
                name: this.name,
                appliedTraits: cdmObject.arraycopyData(wrtDoc, this.appliedTraits, options),
                attributeContext: this.attributeContext ? this.attributeContext.copyData(wrtDoc, options) : undefined
            };
            this.getTraitToPropertyMap().persistForTypeAttributeDef(castedToInterface, options);
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new TypeAttributeImpl(this.name, false);
            copy.ctx = this.ctx;
            copy.dataType = this.dataType ? this.dataType.copy(wrtDoc) : undefined;
            copy.attributeContext = this.attributeContext ? this.attributeContext.copy(wrtDoc) : undefined;
            this.copyAtt(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addComment(this.explanation);
            ff.addChild(this.relationship.getFriendlyFormat());
            ff.addChild(this.dataType.getFriendlyFormat());
            ff.addChildString(this.name);
            if (this.appliedTraits && this.appliedTraits.length) {
                let ffSub = new friendlyFormatNode();
                ffSub.separator = ", ";
                ffSub.starter = "[";
                ffSub.terminator = "]";
                ffSub.lineWrap = true;
                cdmObject.arrayGetFriendlyFormat(ffSub, this.appliedTraits);
                ff.addChild(ffSub);
            }
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let c = new TypeAttributeImpl(object.name, object.appliedTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.relationship = cdmObject.createRelationshipReference(object.relationship);
            c.dataType = cdmObject.createDataTypeReference(object.dataType);
            c.attributeContext = cdmObject.createAttributeContextReference(object.attributeContext);
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            c.t2pm = new traitToPropertyMap();
            c.t2pm.initForTypeAttributeDef(object, c);
            return c;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(wrtDoc, base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    getDataTypeRef() {
        //let bodyCode = () =>
        {
            return this.dataType;
        }
        //return p.measure(bodyCode);
    }
    setDataTypeRef(dataType) {
        //let bodyCode = () =>
        {
            this.dataType = dataType;
            return this.dataType;
        }
        //return p.measure(bodyCode);
    }
    getTraitToPropertyMap() {
        if (this.t2pm)
            return this.t2pm;
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForTypeAttributeDef(null, this);
        return this.t2pm;
    }
    get isReadOnly() {
        return this.getTraitToPropertyMap().getPropertyValue("isReadOnly");
    }
    set isReadOnly(val) {
        this.getTraitToPropertyMap().setPropertyValue("isReadOnly", val);
    }
    get isNullable() {
        return this.getTraitToPropertyMap().getPropertyValue("isNullable");
    }
    set isNullable(val) {
        this.getTraitToPropertyMap().setPropertyValue("isNullable", val);
    }
    get sourceName() {
        return this.getTraitToPropertyMap().getPropertyValue("sourceName");
    }
    set sourceName(val) {
        this.getTraitToPropertyMap().setPropertyValue("sourceName", val);
    }
    get description() {
        return this.getTraitToPropertyMap().getPropertyValue("description");
    }
    set description(val) {
        this.getTraitToPropertyMap().setPropertyValue("description", val);
    }
    get displayName() {
        return this.getTraitToPropertyMap().getPropertyValue("displayName");
    }
    set displayName(val) {
        this.getTraitToPropertyMap().setPropertyValue("displayName", val);
    }
    get sourceOrdering() {
        return this.getTraitToPropertyMap().getPropertyValue("sourceOrdering");
    }
    set sourceOrdering(val) {
        this.getTraitToPropertyMap().setPropertyValue("sourceOrdering", val);
    }
    get valueConstrainedToList() {
        return this.getTraitToPropertyMap().getPropertyValue("valueConstrainedToList");
    }
    set valueConstrainedToList(val) {
        this.getTraitToPropertyMap().setPropertyValue("valueConstrainedToList", val);
    }
    get isPrimaryKey() {
        return this.getTraitToPropertyMap().getPropertyValue("isPrimaryKey");
    }
    set isPrimaryKey(val) {
        this.getTraitToPropertyMap().setPropertyValue("isPrimaryKey", val);
    }
    get maximumLength() {
        return this.getTraitToPropertyMap().getPropertyValue("maximumLength");
    }
    set maximumLength(val) {
        this.getTraitToPropertyMap().setPropertyValue("maximumLength", val);
    }
    get maximumValue() {
        return this.getTraitToPropertyMap().getPropertyValue("maximumValue");
    }
    set maximumValue(val) {
        this.getTraitToPropertyMap().setPropertyValue("maximumValue", val);
    }
    get minimumValue() {
        return this.getTraitToPropertyMap().getPropertyValue("minimumValue");
    }
    set minimumValue(val) {
        this.getTraitToPropertyMap().setPropertyValue("minimumValue", val);
    }
    get dataFormat() {
        return this.getTraitToPropertyMap().getPropertyValue("dataFormat");
    }
    set dataFormat(val) {
        this.getTraitToPropertyMap().setPropertyValue("dataFormat", val);
    }
    get defaultValue() {
        return this.getTraitToPropertyMap().getPropertyValue("defaultValue");
    }
    set defaultValue(val) {
        this.getTraitToPropertyMap().setPropertyValue("defaultValue", val);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + this.name;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.dataType)
                if (this.dataType.visit(path + "/dataType/", preChildren, postChildren))
                    return true;
            if (this.attributeContext)
                if (this.attributeContext.visit(path + "/attributeContext/", preChildren, postChildren))
                    return true;
            if (this.visitAtt(path, preChildren, postChildren))
                return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set == cdmTraitSet.inheritedOnly || set == cdmTraitSet.elevatedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                // // get from datatype
                if (this.dataType)
                    rtsb.takeReference(this.getDataTypeRef().getResolvedTraits(rtsb.wrtDoc, set));
                // // get from relationship
                if (this.relationship)
                    rtsb.mergeTraits(this.getRelationshipRef().getResolvedTraits(rtsb.wrtDoc, set));
            }
            if (set == cdmTraitSet.appliedOnly || set == cdmTraitSet.elevatedOnly) {
                if (set == cdmTraitSet.appliedOnly)
                    set = cdmTraitSet.all;
                this.addResolvedTraitsApplied(rtsb);
            }
            // special case for attributes, replace a default "this.attribute" with this attribute on traits that elevate attribute
            let replacement = new AttributeReferenceImpl(this.name, true);
            replacement.ctx = this.ctx;
            replacement.explicitReference = this;
            rtsb.replaceTraitParameterValue(rtsb.wrtDoc, "does.elevateAttribute", "attribute", "this.attribute", replacement);
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the datatype used as an attribute, traits applied to that datatype,
            // the relationship of the attribute, any traits applied to the attribute.
            let rasb = new ResolvedAttributeSetBuilder(wrtDoc, directives);
            rasb.setAttributeContext(under);
            // add this attribute to the set
            // make a new one and apply any traits
            let newAtt = new ResolvedAttribute(wrtDoc, this, this.name, under);
            rasb.ownOne(newAtt);
            rasb.prepareForTraitApplication(this.getResolvedTraits(wrtDoc, cdmTraitSet.all));
            // from the traits of the datatype, relationship and applied here, see if new attributes get generated
            rasb.applyTraits();
            rasb.generateTraitAttributes(false); // false = don't apply these traits to added things
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences(wrtDoc, directives) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.TypeAttributeImpl = TypeAttributeImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityAttributeImpl extends AttributeImpl {
    constructor(name, appliedTraits = false) {
        super(name, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(wrtDoc, base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let entity;
            entity = this.entity ? this.entity.copyData(wrtDoc, options) : undefined;
            let castedToInterface = {
                explanation: this.explanation,
                name: this.name,
                entity: this.entity.copyData(wrtDoc, options),
                relationship: this.relationship ? this.relationship.copyData(wrtDoc, options) : undefined,
                appliedTraits: cdmObject.arraycopyData(wrtDoc, this.appliedTraits, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new EntityAttributeImpl(this.name, false);
            copy.ctx = this.ctx;
            copy.entity = this.entity.copy(wrtDoc);
            this.copyAtt(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.name && this.entity ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.lineWrap = true;
            ff.addComment(this.explanation);
            ff.addChild(this.relationship.getFriendlyFormat());
            ff.addChildString(this.name);
            let ffSub = new friendlyFormatNode();
            ffSub.separator = ", ";
            ffSub.starter = "{";
            ffSub.terminator = "}";
            if (this.entity instanceof Array) {
                cdmObject.arrayGetFriendlyFormat(ffSub, this.entity);
                ffSub.forceWrap = true;
            }
            else {
                ffSub.addChild(this.entity.getFriendlyFormat());
                ffSub.forceWrap = false;
            }
            ff.addChild(ffSub);
            if (this.appliedTraits && this.appliedTraits.length) {
                let ffSub = new friendlyFormatNode();
                ffSub.separator = ", ";
                ffSub.starter = "[";
                ffSub.terminator = "]";
                ffSub.lineWrap = true;
                cdmObject.arrayGetFriendlyFormat(ff, this.appliedTraits);
                ff.addChild(ffSub);
            }
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let c = new EntityAttributeImpl(object.name, object.appliedTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.entity = EntityReferenceImpl.instanceFromData(object.entity);
            c.relationship = object.relationship ? cdmObject.createRelationshipReference(object.relationship) : undefined;
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getEntityRef() {
        //let bodyCode = () =>
        {
            return this.entity;
        }
        //return p.measure(bodyCode);
    }
    setEntityRef(entRef) {
        //let bodyCode = () =>
        {
            this.entity = entRef;
            return this.entity;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + this.name;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.entity.visit(path + "/entity/", preChildren, postChildren))
                return true;
            if (this.visitAtt(path, preChildren, postChildren))
                return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set == cdmTraitSet.inheritedOnly || set == cdmTraitSet.elevatedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                // // get from relationship
                if (this.relationship)
                    rtsb.takeReference(this.getRelationshipRef().getResolvedTraits(rtsb.wrtDoc, set));
            }
            // if (set == cdmTraitSet.elevatedOnly) {
            //     // get from entities unless this is a ref
            //     let relRts: ResolvedTraitSet;
            //     if (this.relationship)
            //         relRts = this.getRelationshipRef().getResolvedTraits(rtsb.wrtDoc, cdmTraitSet.all);
            //     let isRef = relRts && relRts.find(rtsb.wrtDoc, "does.referenceEntity");
            //     if (!isRef) {
            //         // for now, a sub for the 'select one' idea
            //         if ((this.entity as EntityReferenceImpl).explicitReference) {
            //             let entPickFrom = (this.entity as ICdmEntityRef).getObjectDef(rtsb.wrtDoc) as ICdmEntityDef;
            //             let attsPick : ICdmObject[];
            //             if (entPickFrom && (attsPick = entPickFrom.getHasAttributeDefs())) {
            //                 let l = attsPick.length;
            //                 for (let i=0; i<l; i++) {
            //                     if (attsPick[i].getObjectType() == cdmObjectType.entityAttributeDef) {
            //                         let er = (attsPick[i] as ICdmEntityAttributeDef).getEntityRef();
            //                         rtsb.mergeTraits(er.getResolvedTraits(rtsb.wrtDoc, cdmTraitSet.elevatedOnly));
            //                     }
            //                 }
            //             }
            //         }
            //         else
            //             rtsb.mergeTraits((this.entity as ICdmEntityRef).getResolvedTraits(rtsb.wrtDoc, cdmTraitSet.elevatedOnly));
            //     }
            // }
            if (set == cdmTraitSet.appliedOnly || set == cdmTraitSet.elevatedOnly) {
                if (set == cdmTraitSet.appliedOnly)
                    set = cdmTraitSet.all;
                this.addResolvedTraitsApplied(rtsb);
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the entity used as an attribute, traits applied to that entity,
            // the relationship of the attribute, any traits applied to the attribute.
            let rasb = new ResolvedAttributeSetBuilder(wrtDoc, directives);
            let ctxEnt = this.entity;
            let underRef = rasb.createAttributeContext(under, cdmAttributeContextType.entityReferenceAsAttribute, this.name, this, true);
            if (under)
                under = rasb.createAttributeContext(underRef, cdmAttributeContextType.entity, ctxEnt.getObjectDefName(), ctxEnt, true);
            // it would be a mistake to merge any elevated traits that came from the entity
            // back into the attributes from that entity. elevated traits only propigate 'up'
            let rtsThisAtt = this.getResolvedTraits(wrtDoc, cdmTraitSet.all);
            if (rtsThisAtt)
                rtsThisAtt = rtsThisAtt.removeElevated();
            rasb.prepareForTraitApplication(rtsThisAtt);
            let relRts;
            if (this.relationship)
                relRts = this.getRelationshipRef().getResolvedTraits(wrtDoc, cdmTraitSet.all);
            let isRef = rasb.directives.has("referenceOnly");
            // until this trait goes away...
            if (!isRef && relRts && relRts.find(wrtDoc, "does.referenceEntity"))
                isRef = true;
            // complete cheating but is faster. this relationship will remove all of the attributes that get collected here, so dumb and slow to go get them
            if (isRef) {
                // if selecting from one of many attributes, then make a context for each one
                if (under && rasb.directives.has("selectOne")) {
                    // the right way to do this is to get a resolved entity from the embedded entity and then 
                    // look through the attribute context hierarchy for non-nested entityReferenceAsAttribute nodes
                    // that seems like a disaster waiting to happen given endless looping, etc.
                    // for now, just insist that only the top level entity attributes declared in the ref entity will work
                    let entPickFrom = this.entity.getObjectDef(wrtDoc);
                    let attsPick;
                    if (entPickFrom && (attsPick = entPickFrom.getHasAttributeDefs())) {
                        let l = attsPick.length;
                        for (let i = 0; i < l; i++) {
                            if (attsPick[i].getObjectType() == cdmObjectType.entityAttributeDef) {
                                let pickUnder = rasb.createAttributeContext(under, cdmAttributeContextType.entityReferenceAsAttribute, attsPick[i].getObjectDefName(), attsPick[i], true);
                                let pickEnt = attsPick[i].getEntityRef();
                                rasb.createAttributeContext(pickUnder, cdmAttributeContextType.entity, pickEnt.getObjectDefName(), pickEnt, true);
                            }
                        }
                    }
                }
            }
            else {
                // usually it makes sense to union the attributes from an entity.
                // if deep structure is needed, author should explicitly impose the structured directive on the included entity
                let structured = directives && directives.has('structured');
                if (structured)
                    directives.delete('structured');
                rasb.mergeAttributes(this.entity.getResolvedAttributes(wrtDoc, directives, under));
                if (structured)
                    directives.add('structured');
            }
            // from the traits of relationship and applied here, see if new attributes get generated
            rasb.setAttributeContext(underRef);
            rasb.applyTraits();
            rasb.generateTraitAttributes(true); // true = apply the prepared traits to new atts
            // a 'structured' directive wants to keep all entity attributes together in a group
            if (directives && directives.has('structured')) {
                let raSub = new ResolvedAttribute(wrtDoc, rasb.ras, this.name, rasb.attributeContext);
                rasb = new ResolvedAttributeSetBuilder(wrtDoc, directives);
                rasb.ownOne(raSub);
            }
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences(wrtDoc, directives) {
        //let bodyCode = () =>
        {
            let relRts;
            if (this.relationship)
                relRts = this.getRelationshipRef().getResolvedTraits(wrtDoc, cdmTraitSet.all);
            let legacyRel = false;
            let flexRel = false;
            let flexArray = false;
            if (relRts) {
                legacyRel = relRts.find(wrtDoc, "does.referenceEntity") ? true : false;
                flexRel = (relRts.find(wrtDoc, "does.referenceEntityVia") ? true : false) && directives && directives.has('referenceOnly');
                let arrayTrait = relRts.find(wrtDoc, "does.explainArray");
                if (arrayTrait) {
                    flexArray = arrayTrait.parameterValues.getParameterValue("isArray").getValueString(wrtDoc) == "true";
                }
            }
            if (legacyRel || (flexRel && !flexArray)) {
                // only place this is used, so logic here instead of encapsulated. 
                // make a set and the one ref it will hold
                let rers = new ResolvedEntityReferenceSet(wrtDoc);
                let rer = new ResolvedEntityReference(wrtDoc);
                // referencing attribute(s) come from this attribute
                rer.referencing.rasb.mergeAttributes(this.getResolvedAttributes(wrtDoc, directives));
                let resolveSide = (entRef) => {
                    let sideOther = new ResolvedEntityReferenceSide(wrtDoc);
                    if (entRef) {
                        // reference to the other entity, hard part is the attribue name.
                        // by convention, this is held in a trait that identifies the key
                        sideOther.entity = entRef.getObjectDef(wrtDoc);
                        if (sideOther.entity) {
                            // now that we resolved the entity, it should be ok and much faster to switch to the
                            // context of the entities document to go after the key 
                            let wrtEntityDoc = sideOther.entity.declaredInDocument;
                            let otherAttribute;
                            let t = entRef.getResolvedTraits(wrtEntityDoc).find(wrtEntityDoc, "is.identifiedBy");
                            if (t && t.parameterValues && t.parameterValues.length) {
                                let otherRef = (t.parameterValues.getParameterValue("attribute").value);
                                if (otherRef && typeof (otherRef) === "object") {
                                    otherAttribute = otherRef.getObjectDef(wrtEntityDoc);
                                    if (otherAttribute) {
                                        if (!otherAttribute.getName)
                                            otherAttribute.getName();
                                        sideOther.rasb.ownOne(sideOther.entity.getResolvedAttributes(wrtEntityDoc, directives).get(otherAttribute.getName()).copy(wrtEntityDoc));
                                    }
                                }
                            }
                        }
                    }
                    return sideOther;
                };
                // either several or one entity
                // for now, a sub for the 'select one' idea
                if (this.entity.explicitReference) {
                    let entPickFrom = this.entity.getObjectDef(wrtDoc);
                    let attsPick;
                    if (entPickFrom && (attsPick = entPickFrom.getHasAttributeDefs())) {
                        let l = attsPick.length;
                        for (let i = 0; i < l; i++) {
                            if (attsPick[i].getObjectType() == cdmObjectType.entityAttributeDef) {
                                let er = attsPick[i].getEntityRef();
                                rer.referenced.push(resolveSide(er));
                            }
                        }
                    }
                }
                else
                    rer.referenced.push(resolveSide(this.entity));
                rers.set.push(rer);
                return rers;
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.EntityAttributeImpl = EntityAttributeImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  attribute groups
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeGroupRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeGroupReferenceImpl extends cdmObjectRef {
    constructor(attributeGroup, simpleReference) {
        super(attributeGroup, simpleReference, false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeGroupRef;
        }
        //return p.measure(bodyCode);
    }
    copyRefData(wrtDoc, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.attributeGroupReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(wrtDoc, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new AttributeGroupReferenceImpl(refTo, simpleReference);
            copy.ctx = this.ctx;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let attributeGroup;
            if (typeof (object) == "string")
                attributeGroup = object;
            else {
                simpleReference = false;
                if (typeof (object.attributeGroupReference) === "string")
                    attributeGroup = object.attributeGroupReference;
                else
                    attributeGroup = AttributeGroupImpl.instanceFromData(object.attributeGroupReference);
            }
            let c = new AttributeGroupReferenceImpl(attributeGroup, simpleReference);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getAppliedTraitRefs() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    visitRef(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences(wrtDoc, directives) {
        //let bodyCode = () =>
        {
            let ref = this.getResolvedReference(wrtDoc);
            if (ref)
                return ref.getResolvedEntityReferences(wrtDoc, directives);
            if (this.explicitReference)
                return this.explicitReference.getResolvedEntityReferences(wrtDoc, directives);
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.AttributeGroupReferenceImpl = AttributeGroupReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeGroupDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeGroupImpl extends cdmObjectDef {
    constructor(attributeGroupName) {
        super();
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupDef;
            this.attributeGroupName = attributeGroupName;
            this.members = new Array();
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeGroupDef;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(wrtDoc, base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                attributeGroupName: this.attributeGroupName,
                exhibitsTraits: cdmObject.arraycopyData(wrtDoc, this.exhibitsTraits, options),
                attributeContext: this.attributeContext ? this.attributeContext.copyData(wrtDoc, options) : undefined,
                members: cdmObject.arraycopyData(wrtDoc, this.members, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new AttributeGroupImpl(this.attributeGroupName);
            copy.ctx = this.ctx;
            copy.members = cdmObject.arrayCopy(wrtDoc, this.members);
            copy.attributeContext = this.attributeContext ? this.attributeContext.copy(wrtDoc) : undefined;
            this.copyDef(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.attributeGroupName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("attributeGroup");
            ff.addChildString(this.attributeGroupName);
            this.getFriendlyFormatDef(ff);
            let ffSub = new friendlyFormatNode();
            //ffSub.forceWrap = true;
            ffSub.verticalMode = true;
            ffSub.bracketEmpty = true;
            ffSub.indentChildren = true;
            ffSub.separator = ";\n";
            ffSub.starter = "{";
            ffSub.terminator = "}";
            cdmObject.arrayGetFriendlyFormat(ffSub, this.members);
            ff.addChild(ffSub);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let c = new AttributeGroupImpl(object.attributeGroupName);
            if (object.explanation)
                c.explanation = object.explanation;
            c.attributeContext = cdmObject.createAttributeContextReference(object.attributeContext);
            c.members = cdmObject.createAttributeArray(object.members);
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.attributeGroupName;
        }
        //return p.measure(bodyCode);
    }
    getMembersAttributeDefs() {
        //let bodyCode = () =>
        {
            return this.members;
        }
        //return p.measure(bodyCode);
    }
    addAttributeDef(attDef) {
        //let bodyCode = () =>
        {
            if (!this.members)
                this.members = new Array();
            this.members.push(attDef);
            return attDef;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + this.attributeGroupName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.attributeContext)
                if (this.attributeContext.visit(path + "/attributeContext/", preChildren, postChildren))
                    return true;
            if (this.members)
                if (cdmObject.visitArray(this.members, path + "/members/", preChildren, postChildren))
                    return true;
            if (this.visitDef(path, preChildren, postChildren))
                return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            let rasb = new ResolvedAttributeSetBuilder(wrtDoc, directives);
            rasb.setAttributeContext(under);
            if (this.members) {
                let l = this.members.length;
                for (let i = 0; i < l; i++) {
                    let att = this.members[i];
                    let attUnder = under;
                    if (att.getObjectType() == cdmObjectType.attributeGroupRef) {
                        attUnder = rasb.createAttributeContext(under, cdmAttributeContextType.attributeGroup, att.getObjectDefName(), att, false);
                    }
                    rasb.mergeAttributes(att.getResolvedAttributes(wrtDoc, directives, attUnder));
                }
            }
            // things that need to go away
            rasb.removeRequestedAtts();
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences(wrtDoc, directives) {
        //let bodyCode = () =>
        {
            let rers = new ResolvedEntityReferenceSet(wrtDoc);
            if (this.members) {
                let l = this.members.length;
                for (let i = 0; i < l; i++) {
                    rers.add(this.members[i].getResolvedEntityReferences(wrtDoc, directives));
                }
            }
            return rers;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set != cdmTraitSet.appliedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                this.constructResolvedTraitsDef(undefined, rtsb);
                if (set == cdmTraitSet.elevatedOnly) {
                    if (this.members) {
                        // run it twice, pull out the entityattributes first
                        // this way any elevated traits from direct attributes get applied last
                        let l = this.members.length;
                        for (let i = 0; i < l; i++) {
                            let att = this.members[i];
                            let attOt = att.objectType;
                            if (attOt == cdmObjectType.entityAttributeDef)
                                rtsb.mergeTraits(att.getResolvedTraits(rtsb.wrtDoc, cdmTraitSet.elevatedOnly));
                        }
                        for (let i = 0; i < l; i++) {
                            let att = this.members[i];
                            let attOt = att.objectType;
                            if (attOt != cdmObjectType.entityAttributeDef)
                                rtsb.mergeTraits(att.getResolvedTraits(rtsb.wrtDoc, cdmTraitSet.elevatedOnly));
                        }
                    }
                }
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
}
exports.AttributeGroupImpl = AttributeGroupImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  the 'constant' entity
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class ConstantEntityImpl extends cdmObjectDef {
    constructor() {
        super();
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.constantEntityDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                constantEntityName: this.constantEntityName,
                entityShape: this.entityShape ? this.entityShape.copyData(wrtDoc, options) : undefined,
                constantValues: this.constantValues
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new ConstantEntityImpl();
            copy.ctx = this.ctx;
            copy.constantEntityName = this.constantEntityName;
            copy.entityShape = this.entityShape.copy(wrtDoc);
            copy.constantValues = this.constantValues; // is a deep copy needed? 
            this.copyDef(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.entityShape ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.lineWrap = true;
            let ffDecl = new friendlyFormatNode();
            ff.addChild(ffDecl);
            ffDecl.separator = " ";
            ffDecl.addChildString("constant entity");
            ffDecl.addChildString(this.constantEntityName);
            ffDecl.addChildString("shaped like");
            ffDecl.addChild(this.entityShape.getFriendlyFormat());
            ffDecl.addChildString("contains");
            let ffTable = new friendlyFormatNode();
            ff.addChild(ffTable);
            ffTable.forceWrap = this.constantValues.length > 1;
            ffTable.bracketEmpty = true;
            ffTable.starter = "{";
            ffTable.terminator = "}";
            ffTable.separator = ",";
            for (let iRow = 0; iRow < this.constantValues.length; iRow++) {
                let ffRow = new friendlyFormatNode();
                ffRow.bracketEmpty = false;
                ffRow.starter = "{";
                ffRow.terminator = "}";
                ffRow.separator = ", ";
                const rowArray = this.constantValues[iRow];
                for (let iCol = 0; iCol < rowArray.length; iCol++) {
                    ffRow.addChildString(rowArray[iCol], true);
                }
                ffTable.addChild(ffRow);
            }
            return ff;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.constantEntityDef;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(wrtDoc, base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let c = new ConstantEntityImpl();
            if (object.explanation)
                c.explanation = object.explanation;
            if (object.constantEntityName)
                c.constantEntityName = object.constantEntityName;
            c.constantValues = object.constantValues;
            c.entityShape = cdmObject.createEntityReference(object.entityShape);
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.constantEntityName;
        }
        //return p.measure(bodyCode);
    }
    getEntityShape() {
        //let bodyCode = () =>
        {
            return this.entityShape;
        }
        //return p.measure(bodyCode);
    }
    setEntityShape(shape) {
        //let bodyCode = () =>
        {
            this.entityShape = shape;
            return this.entityShape;
        }
        //return p.measure(bodyCode);
    }
    getConstantValues() {
        //let bodyCode = () =>
        {
            return this.constantValues;
        }
        //return p.measure(bodyCode);
    }
    setConstantValues(values) {
        //let bodyCode = () =>
        {
            this.constantValues = values;
            return this.constantValues;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + (this.constantEntityName ? this.constantEntityName : "(unspecified)");
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.entityShape)
                if (this.entityShape.visit(path + "/entityShape/", preChildren, postChildren))
                    return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            let rasb = new ResolvedAttributeSetBuilder(wrtDoc, directives);
            under = rasb.createAttributeContext(under, cdmAttributeContextType.entity, this.entityShape.getObjectDefName(), this.entityShape, true);
            if (this.entityShape)
                rasb.mergeAttributes(this.getEntityShape().getResolvedAttributes(wrtDoc, directives, under));
            // things that need to go away
            rasb.removeRequestedAtts();
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    // the world's smallest complete query processor...
    findValue(wrtDoc, attReturn, attSearch, valueSearch, action) {
        //let bodyCode = () =>
        {
            let resultAtt = -1;
            let searchAtt = -1;
            if (typeof (attReturn) === "number")
                resultAtt = attReturn;
            if (typeof (attSearch) === "number")
                searchAtt = attSearch;
            if (resultAtt == -1 || searchAtt == -1) {
                // metadata library
                let ras = this.getResolvedAttributes(wrtDoc);
                // query validation and binding
                let l = ras.set.length;
                for (let i = 0; i < l; i++) {
                    let name = ras.set[i].resolvedName;
                    if (resultAtt == -1 && name === attReturn)
                        resultAtt = i;
                    if (searchAtt == -1 && name === attSearch)
                        searchAtt = i;
                    if (resultAtt >= 0 && searchAtt >= 0)
                        break;
                }
            }
            // rowset processing
            if (resultAtt >= 0 && searchAtt >= 0) {
                if (this.constantValues && this.constantValues.length) {
                    for (let i = 0; i < this.constantValues.length; i++) {
                        if (this.constantValues[i][searchAtt] == valueSearch) {
                            this.constantValues[i][resultAtt] = action(this.constantValues[i][resultAtt]);
                            return;
                        }
                    }
                }
            }
            return;
        }
        //return p.measure(bodyCode);
    }
    lookupWhere(wrtDoc, attReturn, attSearch, valueSearch) {
        //let bodyCode = () =>
        {
            let result;
            this.findValue(wrtDoc, attReturn, attSearch, valueSearch, found => { result = found; return found; });
            return result;
        }
        //return p.measure(bodyCode);
    }
    setWhere(wrtDoc, attReturn, newValue, attSearch, valueSearch) {
        //let bodyCode = () =>
        {
            let result;
            this.findValue(wrtDoc, attReturn, attSearch, valueSearch, found => { result = found; return newValue; });
            return result;
        }
        //return p.measure(bodyCode);
    }
}
exports.ConstantEntityImpl = ConstantEntityImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Entities
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeContextRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeContextReferenceImpl extends cdmObjectRef {
    constructor(name) {
        super(name, true, false);
        this.objectType = cdmObjectType.attributeContextRef;
    }
    getObjectType() {
        return cdmObjectType.attributeContextRef;
    }
    copyRefData(wrtDoc, copy, refTo, options) {
    }
    copyRefObject(wrtDoc, refTo, simpleReference) {
        let copy = new AttributeContextReferenceImpl(refTo);
        copy.ctx = this.ctx;
        return copy;
    }
    static instanceFromData(object) {
        if (typeof (object) == "string")
            return new AttributeContextReferenceImpl(object);
        return null;
    }
    getAppliedTraitRefs() {
        return null;
    }
    visitRef(pathFrom, preChildren, postChildren) {
        return false;
    }
}
exports.AttributeContextReferenceImpl = AttributeContextReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeContext}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeContextImpl extends cdmObjectDef {
    constructor(name) {
        super(false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeContextDef;
            this.name = name;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeContextDef;
        }
        //return p.measure(bodyCode);
    }
    static mapTypeNameToEnum(typeName) {
        //let bodyCode = () =>
        {
            switch (typeName) {
                case "entity":
                    return cdmAttributeContextType.entity;
                case "entityReferenceExtends":
                    return cdmAttributeContextType.entityReferenceExtends;
                case "attributeGroup":
                    return cdmAttributeContextType.attributeGroup;
                case "entityReferenceAsAttribute":
                    return cdmAttributeContextType.entityReferenceAsAttribute;
                case "addedAttributeSupporting":
                    return cdmAttributeContextType.addedAttributeSupporting;
                case "addedAttributeIdentity":
                    return cdmAttributeContextType.addedAttributeIdentity;
                default:
                    return -1;
            }
        }
    }
    static mapEnumToTypeName(enumVal) {
        //let bodyCode = () =>
        {
            switch (enumVal) {
                case cdmAttributeContextType.entity:
                    return "entity";
                case cdmAttributeContextType.entityReferenceExtends:
                    return "entityReferenceExtends";
                case cdmAttributeContextType.attributeGroup:
                    return "attributeGroup";
                case cdmAttributeContextType.entityReferenceAsAttribute:
                    return "entityReferenceAsAttribute";
                case cdmAttributeContextType.addedAttributeSupporting:
                    return "addedAttributeSupporting";
                case cdmAttributeContextType.addedAttributeIdentity:
                    return "addedAttributeIdentity";
                default:
                    return "unknown";
            }
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                name: this.name,
                type: AttributeContextImpl.mapEnumToTypeName(this.type),
                parent: this.parent ? this.parent.copyData(wrtDoc, options) : undefined,
                definition: this.definition ? this.definition.copyData(wrtDoc, options) : undefined,
                // i know the trait collection names look wrong. but I wanted to use the def baseclass
                appliedTraits: cdmObject.arraycopyData(wrtDoc, this.exhibitsTraits, options),
                contents: cdmObject.arraycopyData(wrtDoc, this.contents, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new AttributeContextImpl(this.name);
            copy.ctx = this.ctx;
            copy.type = this.type;
            if (this.parent)
                copy.parent = this.parent.copy(wrtDoc);
            if (this.definition)
                copy.definition = this.definition.copy(wrtDoc);
            copy.contents = cdmObject.arrayCopy(wrtDoc, this.contents);
            this.copyDef(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        return this.name && this.type != undefined;
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            // todo
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.addChildString("attributeContext");
            ff.addChildString(this.name);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let c = Corpus.MakeObject(cdmObjectType.attributeContextDef, object.name);
            c.type = AttributeContextImpl.mapTypeNameToEnum(object.type);
            if (object.parent)
                c.parent = cdmObject.createAttributeContextReference(object.parent);
            if (object.explanation)
                c.explanation = object.explanation;
            if (object.definition) {
                switch (c.type) {
                    case cdmAttributeContextType.entity:
                    case cdmAttributeContextType.entityReferenceExtends:
                        c.definition = cdmObject.createEntityReference(object.definition);
                        break;
                    case cdmAttributeContextType.attributeGroup:
                        c.definition = cdmObject.createAttributeGroupReference(object.definition);
                        break;
                    case cdmAttributeContextType.addedAttributeSupporting:
                    case cdmAttributeContextType.addedAttributeIdentity:
                    case cdmAttributeContextType.entityReferenceAsAttribute:
                        c.definition = cdmObject.createAttributeReference(object.definition);
                        break;
                }
            }
            // i know the trait collection names look wrong. but I wanted to use the def baseclass
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            if (object.contents) {
                c.contents = new Array();
                let l = object.contents.length;
                for (let i = 0; i < l; i++) {
                    const ct = object.contents[i];
                    if (typeof (ct) === "string")
                        c.contents.push(AttributeReferenceImpl.instanceFromData(ct));
                    else
                        c.contents.push(AttributeContextImpl.instanceFromData(ct));
                }
            }
            return c;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    getContentRefs() {
        //let bodyCode = () =>
        {
            if (!this.contents)
                this.contents = new Array();
            return this.contents;
        }
        //return p.measure(bodyCode);
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + this.name;
                this.declaredPath = path;
            }
            if (preChildren && preChildren(this, path))
                return false;
            if (this.parent)
                if (this.parent.visit(path + "/parent/", preChildren, postChildren))
                    return true;
            if (this.definition)
                if (this.definition.visit(path + "/definition/", preChildren, postChildren))
                    return true;
            if (this.contents)
                if (cdmObject.visitArray(this.contents, path + "/", preChildren, postChildren))
                    return true;
            if (this.visitDef(path, preChildren, postChildren))
                return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    getRelativePath() {
        return this.declaredPath;
    }
    setRelativePath(rp) {
        this.declaredPath = rp;
    }
    isDerivedFrom(wrtDoc, base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    static createChildUnder(wrtDoc, under, type, name, regarding, includeTraits) {
        //let bodyCode = () =>
        {
            if (!under)
                return undefined;
            let definition;
            let rtsApplied;
            // get a simple reference to definition object to avoid getting the traits that might be part of this ref
            // included in the link to the definition.
            if (regarding) {
                definition = regarding.createSimpleReference(wrtDoc);
                // now get the traits applied at this reference (applied only, not the ones that are part of the definition of the object)
                // and make them the traits for this context
                if (includeTraits)
                    rtsApplied = regarding.getResolvedTraits(wrtDoc, cdmTraitSet.all);
            }
            let underChild = Corpus.MakeObject(cdmObjectType.attributeContextDef, name);
            // need search context to make this a 'live' object
            underChild.ctx = under.ctx;
            underChild.type = type;
            underChild.definition = definition;
            underChild.setRelativePath(under.getRelativePath() + '/' + name);
            // add traits if there are any
            if (rtsApplied && rtsApplied.set) {
                rtsApplied.set.forEach(rt => {
                    let traitRef = cdmObject.resolvedTraitToTraitRef(rt);
                    underChild.addExhibitedTrait(traitRef, typeof (traitRef) === "string");
                });
            }
            // add to parent
            underChild.parent = under.createSimpleReference(wrtDoc);
            let parentContents = under.getContentRefs();
            parentContents.push(underChild);
            return underChild;
        }
        //return p.measure(bodyCode);
    }
}
exports.AttributeContextImpl = AttributeContextImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityReferenceImpl extends cdmObjectRef {
    constructor(entityRef, simpleReference, appliedTraits) {
        super(entityRef, simpleReference, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityRef;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityRef;
        }
        //return p.measure(bodyCode);
    }
    copyRefData(wrtDoc, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.entityReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(wrtDoc, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new EntityReferenceImpl(refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
            copy.ctx = this.ctx;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let entity;
            if (typeof (object) == "string")
                entity = object;
            else {
                simpleReference = false;
                if (typeof (object.entityReference) === "string")
                    entity = object.entityReference;
                else if (object.entityReference.entityShape)
                    entity = ConstantEntityImpl.instanceFromData(object.entityReference);
                else
                    entity = EntityImpl.instanceFromData(object.entityReference);
            }
            let c = new EntityReferenceImpl(entity, simpleReference, object.appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    visitRef(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
}
exports.EntityReferenceImpl = EntityReferenceImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityImpl extends cdmObjectDef {
    constructor(entityName, extendsEntity, exhibitsTraits = false, hasAttributes = false) {
        super(exhibitsTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityDef;
            this.entityName = entityName;
            if (extendsEntity)
                this.extendsEntity = extendsEntity;
            if (hasAttributes)
                this.hasAttributes = new Array();
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                entityName: this.entityName,
                extendsEntity: this.extendsEntity ? this.extendsEntity.copyData(wrtDoc, options) : undefined,
                exhibitsTraits: cdmObject.arraycopyData(wrtDoc, this.exhibitsTraits, options),
            };
            this.getTraitToPropertyMap().persistForEntityDef(castedToInterface, options);
            // after the properties so they show up first in doc
            castedToInterface.hasAttributes = cdmObject.arraycopyData(wrtDoc, this.hasAttributes, options);
            castedToInterface.attributeContext = this.attributeContext ? this.attributeContext.copyData(wrtDoc, options) : undefined;
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let copy = new EntityImpl(this.entityName, null, false, false);
            copy.ctx = this.ctx;
            copy.extendsEntity = copy.extendsEntity ? this.extendsEntity.copy(wrtDoc) : undefined;
            copy.attributeContext = copy.attributeContext ? this.attributeContext.copy(wrtDoc) : undefined;
            copy.hasAttributes = cdmObject.arrayCopy(wrtDoc, this.hasAttributes);
            this.copyDef(wrtDoc, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.entityName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = " ";
            ff.separator = " ";
            ff.addChildString("entity");
            ff.addChildString(this.entityName);
            if (this.extendsEntity) {
                ff.addChildString("extends");
                ff.addChild(this.extendsEntity.getFriendlyFormat());
            }
            this.getFriendlyFormatDef(ff);
            if (this.attributeContext) {
                ff.addChildString("attributeContext");
                ff.addChild(this.attributeContext.getFriendlyFormat());
            }
            let ffSub = new friendlyFormatNode();
            //ffSub.forceWrap = true;
            ffSub.verticalMode = true;
            ffSub.bracketEmpty = true;
            ffSub.indentChildren = true;
            ffSub.separator = ";\n";
            ffSub.starter = "{";
            ffSub.terminator = "}";
            cdmObject.arrayGetFriendlyFormat(ffSub, this.hasAttributes);
            ff.addChild(ffSub);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(object) {
        //let bodyCode = () =>
        {
            let extendsEntity;
            extendsEntity = cdmObject.createEntityReference(object.extendsEntity);
            let c = new EntityImpl(object.entityName, extendsEntity, object.exhibitsTraits, object.hasAttributes);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
            if (object.attributeContext)
                c.attributeContext = cdmObject.createAttributeContext(object.attributeContext);
            c.hasAttributes = cdmObject.createAttributeArray(object.hasAttributes);
            c.t2pm = new traitToPropertyMap();
            c.t2pm.initForEntityDef(object, c);
            return c;
        }
        //return p.measure(bodyCode);
    }
    get declaredInDocument() {
        return this.docDeclared;
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.entityName;
        }
        //return p.measure(bodyCode);
    }
    getExtendsEntityRef() {
        //let bodyCode = () =>
        {
            return this.extendsEntity;
        }
        //return p.measure(bodyCode);
    }
    setExtendsEntityRef(ref) {
        //let bodyCode = () =>
        {
            this.extendsEntity = ref;
            return this.extendsEntity;
        }
        //return p.measure(bodyCode);
    }
    getHasAttributeDefs() {
        //let bodyCode = () =>
        {
            return this.hasAttributes;
        }
        //return p.measure(bodyCode);
    }
    addAttributeDef(attDef) {
        //let bodyCode = () =>
        {
            if (!this.hasAttributes)
                this.hasAttributes = new Array();
            this.hasAttributes.push(attDef);
            return attDef;
        }
        //return p.measure(bodyCode);
    }
    getTraitToPropertyMap() {
        if (this.t2pm)
            return this.t2pm;
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForEntityDef(null, this);
        return this.t2pm;
    }
    get sourceName() {
        return this.getTraitToPropertyMap().getPropertyValue("sourceName");
    }
    set sourceName(val) {
        this.getTraitToPropertyMap().setPropertyValue("sourceName", val);
    }
    get description() {
        return this.getTraitToPropertyMap().getPropertyValue("description");
    }
    set description(val) {
        this.getTraitToPropertyMap().setPropertyValue("description", val);
    }
    get displayName() {
        return this.getTraitToPropertyMap().getPropertyValue("displayName");
    }
    set displayName(val) {
        this.getTraitToPropertyMap().setPropertyValue("displayName", val);
    }
    get version() {
        return this.getTraitToPropertyMap().getPropertyValue("version");
    }
    set version(val) {
        this.getTraitToPropertyMap().setPropertyValue("version", val);
    }
    get cdmSchemas() {
        return this.getTraitToPropertyMap().getPropertyValue("cdmSchemas");
    }
    set cdmSchemas(val) {
        this.getTraitToPropertyMap().setPropertyValue("cdmSchemas", val);
    }
    get primaryKey() {
        return this.getTraitToPropertyMap().getPropertyValue("primaryKey");
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            let path = this.declaredPath;
            if (!path) {
                path = pathFrom + this.entityName;
                this.declaredPath = path;
            }
            //trackVisits(path);
            if (preChildren && preChildren(this, path))
                return false;
            if (this.extendsEntity)
                if (this.extendsEntity.visit(path + "/extendsEntity/", preChildren, postChildren))
                    return true;
            if (this.visitDef(path, preChildren, postChildren))
                return true;
            if (this.attributeContext)
                if (this.attributeContext.visit(path + "/attributeContext/", preChildren, postChildren))
                    return true;
            if (this.hasAttributes)
                if (cdmObject.visitArray(this.hasAttributes, path + "/hasAttributes/", preChildren, postChildren))
                    return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(wrtDoc, base) {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(wrtDoc, this.getExtendsEntityRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            let set = rtsb.set;
            if (set != cdmTraitSet.appliedOnly) {
                if (set == cdmTraitSet.inheritedOnly)
                    set = cdmTraitSet.all;
                this.constructResolvedTraitsDef(this.getExtendsEntityRef(), rtsb);
                if (set == cdmTraitSet.elevatedOnly) {
                    if (this.hasAttributes) {
                        // run it twice, pull out the entityattributes first
                        let l = this.hasAttributes.length;
                        for (let i = 0; i < l; i++) {
                            let att = this.hasAttributes[i];
                            let attOt = att.objectType;
                            if (attOt == cdmObjectType.entityAttributeDef)
                                rtsb.mergeTraits(att.getResolvedTraits(rtsb.wrtDoc, cdmTraitSet.elevatedOnly));
                        }
                        for (let i = 0; i < l; i++) {
                            let att = this.hasAttributes[i];
                            let attOt = att.objectType;
                            if (attOt != cdmObjectType.entityAttributeDef)
                                rtsb.mergeTraits(att.getResolvedTraits(rtsb.wrtDoc, cdmTraitSet.elevatedOnly));
                        }
                    }
                }
            }
            rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
            // the relationsip of the attribute, the attribute definition itself and included attribute groups, any traits applied to the attribute.
            this.rasb = new ResolvedAttributeSetBuilder(wrtDoc, directives);
            this.rasb.setAttributeContext(under);
            if (this.extendsEntity) {
                let extRef = this.getExtendsEntityRef();
                let extendsRefUnder = this.rasb.createAttributeContext(under, cdmAttributeContextType.entityReferenceExtends, "extends", null, false);
                let extendsUnder = this.rasb.createAttributeContext(extendsRefUnder, cdmAttributeContextType.entity, extRef.getObjectDefName(), extRef, false);
                this.rasb.mergeAttributes(this.getExtendsEntityRef().getResolvedAttributes(wrtDoc, directives, extendsUnder));
            }
            this.rasb.markInherited();
            if (this.hasAttributes) {
                let l = this.hasAttributes.length;
                for (let i = 0; i < l; i++) {
                    let att = this.hasAttributes[i];
                    let attUnder = under;
                    if (att.getObjectType() == cdmObjectType.attributeGroupRef) {
                        attUnder = this.rasb.createAttributeContext(under, cdmAttributeContextType.attributeGroup, att.getObjectDefName(), att, false);
                    }
                    this.rasb.mergeAttributes(att.getResolvedAttributes(wrtDoc, directives, attUnder));
                }
            }
            this.rasb.markOrder();
            // things that need to go away
            this.rasb.removeRequestedAtts();
            return this.rasb;
        }
        //return p.measure(bodyCode);
    }
    countInheritedAttributes(wrtDoc, directives) {
        //let bodyCode = () =>
        {
            // ensures that cache exits
            this.getResolvedAttributes(wrtDoc, directives);
            return this.rasb.inheritedMark;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntity(wrtDoc, directives) {
        return new ResolvedEntity(wrtDoc, this, directives);
    }
    getResolvedEntityReferences(wrtDoc, directives) {
        //let bodyCode = () =>
        {
            let entRefSetCache = this.ctx.getCache(this, wrtDoc, "entRefSet");
            if (!entRefSetCache) {
                entRefSetCache = new ResolvedEntityReferenceSet(wrtDoc);
                // get from any base class and then 'fix' those to point here instead.
                let extRef = this.getExtendsEntityRef();
                if (extRef) {
                    let extDef = extRef.getObjectDef(wrtDoc);
                    if (extDef) {
                        if (extDef === this)
                            extDef = extRef.getObjectDef(wrtDoc);
                        let inherited = extDef.getResolvedEntityReferences(wrtDoc, directives);
                        if (inherited) {
                            inherited.set.forEach((res) => {
                                res = res.copy();
                                res.referencing.entity = this;
                                entRefSetCache.set.push(res);
                            });
                        }
                    }
                }
                if (this.hasAttributes) {
                    let l = this.hasAttributes.length;
                    for (let i = 0; i < l; i++) {
                        // if any refs come back from attributes, they don't know who we are, so they don't set the entity
                        let sub = this.hasAttributes[i].getResolvedEntityReferences(wrtDoc, directives);
                        if (sub) {
                            sub.set.forEach((res) => {
                                res.referencing.entity = this;
                            });
                            entRefSetCache.add(sub);
                        }
                    }
                }
                this.ctx.setCache(this, wrtDoc, "entRefSet", entRefSetCache);
            }
            return entRefSetCache;
        }
        //return p.measure(bodyCode);
    }
    getAttributesWithTraits(wrtDoc, queryFor) {
        //let bodyCode = () =>
        {
            return this.getResolvedAttributes(wrtDoc).getAttributesWithTraits(queryFor);
        }
        //return p.measure(bodyCode);
    }
    createResolvedEntity(wrtDoc, newEntName, directives) {
        //let bodyCode = () =>
        {
            // make the top level attribute context for this entity
            let entName = newEntName;
            let attCtx = Corpus.MakeObject(cdmObjectType.attributeContextDef, entName, true);
            attCtx.ctx = this.ctx;
            attCtx.setExplanation("This OPTIONAL 'AttributeContext' hierarchy is generated by the CDM object model to help explain where each attribute in the entity was defined and discovered.");
            attCtx.type = cdmAttributeContextType.entity;
            attCtx.definition = Corpus.MakeObject(cdmObjectType.entityRef, this.getName(), true);
            // cheating a bit
            attCtx.setRelativePath(entName + '/attributeContext/' + entName);
            // resolve attributes with this context. the end result is that each resolved attribute
            // points to the level of the context where it was created
            let ras = this.getResolvedAttributes(wrtDoc, directives, attCtx);
            // the attributes have been named, shaped, etc for this entity so now it is safe to go and 
            // make each attribute context level point at these final versions of attributes
            let attPath2Order = new Map();
            let pointContextAtResolvedAtts = (rasSub, path) => {
                rasSub.set.forEach(ra => {
                    if (ra.createdContext) {
                        let refs = ra.createdContext.getContentRefs();
                        // this won't work when I add the structured attributes to avoid name collisions
                        let attRefPath = path + ra.resolvedName;
                        if (ra.target.getObjectType) {
                            let attRef = Corpus.MakeObject(cdmObjectType.attributeRef, attRefPath, true);
                            attPath2Order.set(attRef.getObjectDefName(), ra.insertOrder);
                            refs.push(attRef);
                        }
                        else {
                            attRefPath += '/members/';
                            pointContextAtResolvedAtts(ra.target, attRefPath);
                        }
                    }
                });
            };
            pointContextAtResolvedAtts(ras, entName + '/hasAttributes/');
            // attribute structures may end up with 0 attributes after that. prune them
            let emptyStructures = new Array();
            let findEmpty = (under) => {
                let isEmpty = true;
                under.getContentRefs().forEach(cr => {
                    if (cr.getObjectType() == cdmObjectType.attributeContextDef) {
                        if (findEmpty(cr)) {
                            if (!cr.getExhibitedTraitRefs()) {
                                // empty child, remember for later
                                emptyStructures.push([under, cr]);
                            }
                            else {
                                // need to keep context with traits, even if it has no atts
                                isEmpty = false;
                            }
                        }
                        else
                            isEmpty = false;
                    }
                    else {
                        // some attribute here, so not empty
                        isEmpty = false;
                    }
                });
                return isEmpty;
            };
            findEmpty(attCtx);
            // remove all the empties that were found
            emptyStructures.forEach(empty => {
                let content = empty["0"].getContentRefs();
                content.splice(content.indexOf(empty["1"]), 1);
            });
            // create an all-up ordering of attributes at the leaves of this tree based on insert order
            // sort the attributes in each context by their creation order and mix that with the other sub-contexts that have been sorted
            let getOrderNum = (item) => {
                if (item.getObjectType() == cdmObjectType.attributeContextDef) {
                    return orderContents(item);
                }
                else {
                    let attName = item.getObjectDefName();
                    let o = attPath2Order.get(attName);
                    return o;
                }
            };
            let orderContents = (under) => {
                if (under.lowestOrder == undefined) {
                    under.lowestOrder = -1; // used for group with nothing but traits
                    if (under.contents.length == 1) {
                        under.lowestOrder = getOrderNum(under.contents[0]);
                    }
                    else {
                        under.contents = under.contents.sort((l, r) => {
                            let lNum = getOrderNum(l);
                            let rNum = getOrderNum(r);
                            if (lNum != -1 && (under.lowestOrder == -1 || lNum < under.lowestOrder))
                                under.lowestOrder = lNum;
                            if (rNum != -1 && (under.lowestOrder == -1 || rNum < under.lowestOrder))
                                under.lowestOrder = rNum;
                            return lNum - rNum;
                        });
                    }
                }
                return under.lowestOrder;
            };
            orderContents(attCtx);
            // make a new document in the same folder as the source entity
            let folder = this.declaredInDocument.getFolder();
            let fileName = newEntName + ".cdm.json";
            folder.removeDocument(fileName);
            let docRes = folder.addDocument(fileName, "");
            // add a import of the source document
            docRes.addImport(this.declaredInDocument.getFolder().getRelativePath() + this.declaredInDocument.getName(), "");
            // make the empty entity
            let entResolved = docRes.addDefinition(cdmObjectType.entityDef, entName);
            entResolved.attributeContext = attCtx;
            // add the traits of the entity
            let rtsEnt = this.getResolvedTraits(wrtDoc, cdmTraitSet.all);
            rtsEnt.set.forEach(rt => {
                let traitRef = cdmObject.resolvedTraitToTraitRef(rt);
                entResolved.addExhibitedTrait(traitRef, typeof (traitRef) === "string");
            });
            // resolved attributes can gain traits that are applied to an entity when referenced
            // since these traits are described in the context, it is redundant and messy to list them in the attribute
            // so, remove them. create and cache a set of names to look for per context 
            // there is actuall a hierarchy to this. all attributes from the base entity should have all traits applied independed of the 
            // sub-context they come from. Same is true of attribute entities. so do this recursively top down
            let ctx2traitNames = new Map();
            let collectContextTraits = (subAttCtx, inheritedTraitNames) => {
                let traitNamesHere = new Set(inheritedTraitNames);
                let traitsHere = subAttCtx.getExhibitedTraitRefs();
                if (traitsHere)
                    traitsHere.forEach((tat) => { traitNamesHere.add(tat.getObjectDefName()); });
                ctx2traitNames.set(subAttCtx, traitNamesHere);
                subAttCtx.getContentRefs().forEach((cr) => {
                    if (cr.getObjectType() == cdmObjectType.attributeContextDef) {
                        // do this for all types?
                        collectContextTraits(cr, traitNamesHere);
                    }
                });
            };
            collectContextTraits(attCtx, new Set());
            // add the attributes, put them in attribute groups if structure needed
            let resAtt2RefPath = new Map();
            let addAttributes = (rasSub, container, path) => {
                rasSub.set.forEach(ra => {
                    let attPath = path + ra.resolvedName;
                    if (ra.target.set) {
                        let attGrp = Corpus.MakeObject(cdmObjectType.attributeGroupDef, ra.resolvedName);
                        attGrp.attributeContext = Corpus.MakeObject(cdmObjectType.attributeContextRef, ra.createdContext.getRelativePath(), true);
                        let attGrpRef = Corpus.MakeObject(cdmObjectType.attributeGroupRef, undefined);
                        attGrpRef.setObjectDef(attGrp);
                        container.addAttributeDef(attGrpRef);
                        addAttributes(ra.target, attGrp, attPath + '/members/');
                    }
                    else {
                        let att = Corpus.MakeObject(cdmObjectType.typeAttributeDef, ra.resolvedName);
                        att.attributeContext = Corpus.MakeObject(cdmObjectType.attributeContextRef, ra.createdContext.getRelativePath(), true);
                        let avoidSet = ctx2traitNames.get(ra.createdContext);
                        let rtsAtt = ra.resolvedTraits;
                        rtsAtt.set.forEach(rt => {
                            if (!rt.trait.ugly) {
                                if (!avoidSet.has(rt.traitName)) {
                                    let traitRef = cdmObject.resolvedTraitToTraitRef(rt);
                                    att.addAppliedTrait(traitRef, typeof (traitRef) === "string");
                                }
                            }
                        });
                        container.addAttributeDef(att);
                        resAtt2RefPath.set(ra, attPath);
                    }
                });
            };
            addAttributes(ras, entResolved, entName + '/hasAttributes/');
            // any resolved traits that hold arguments with attribute refs should get 'fixed' here
            let replaceTraitAttRef = (tr) => {
                if (tr.getArgumentDefs()) {
                    tr.getArgumentDefs().forEach(arg => {
                        let v = arg.getValue();
                        // is this an attribute reference?
                        if (v && v.getObjectType && v.getObjectType() == cdmObjectType.attributeRef) {
                            // only try this if the reference has no path to it (only happens with intra-entity att refs)
                            let attRef = v;
                            if (attRef.namedReference && attRef.namedReference.indexOf('/') == -1) {
                                // get the original attribute object
                                let att = v.getObjectDef(wrtDoc);
                                // is this one of the resolved attributes?
                                let found = ras.getBySource(att);
                                //change it
                                if (found) {
                                    let attRefPath = resAtt2RefPath.get(found);
                                    arg.setValue(Corpus.MakeObject(cdmObjectType.attributeRef, attRefPath, true));
                                }
                                else {
                                    // declared path is the best way to find it
                                    arg.setValue(Corpus.MakeObject(cdmObjectType.attributeRef, att.declaredPath, true));
                                }
                            }
                        }
                    });
                }
            };
            // fix entity traits
            if (entResolved.getExhibitedTraitRefs())
                entResolved.getExhibitedTraitRefs().forEach(et => {
                    replaceTraitAttRef(et);
                });
            // fix context traits
            let fixContextTraits = (subAttCtx) => {
                let traitsHere = subAttCtx.getExhibitedTraitRefs();
                if (traitsHere)
                    traitsHere.forEach((tr) => { replaceTraitAttRef(tr); });
                subAttCtx.getContentRefs().forEach((cr) => {
                    if (cr.getObjectType() == cdmObjectType.attributeContextDef) {
                        // do this for all types?
                        fixContextTraits(cr);
                    }
                });
            };
            fixContextTraits(attCtx);
            // and the attribute traits
            let entAtts = entResolved.getHasAttributeDefs();
            if (entAtts) {
                let l = entAtts.length;
                for (let i = 0; i < l; i++) {
                    let attTraits = entAtts[i].getAppliedTraitRefs();
                    if (attTraits)
                        attTraits.forEach((tr) => replaceTraitAttRef(tr));
                }
            }
            // trigger the document to refresh current content into the resolved OM
            docRes.refresh();
            // get a fresh ref
            entResolved = docRes.getObjectFromDocumentPath(entName);
            return entResolved;
        }
        //return p.measure(bodyCode);
    }
}
exports.EntityImpl = EntityImpl;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  documents and folders
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {DocumentDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class Document extends cdmObjectSimple {
    constructor(name, hasImports = false) {
        super();
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.documentDef;
            this.name = name;
            this.schemaVersion = "0.7.0";
            this.definitions = new Array();
            if (hasImports)
                this.imports = new Array();
            this.clearCaches();
        }
        //return p.measure(bodyCode);
    }
    clearCaches() {
        this.internalDeclarations = new Map();
        this.monikeredImports = new Map();
        this.flatImports = new Array();
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.documentDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        return null;
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                schema: this.schema,
                schemaVersion: this.schemaVersion,
                imports: cdmObject.arraycopyData(wrtDoc, this.imports, options),
                definitions: cdmObject.arraycopyData(wrtDoc, this.definitions, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            let c = new Document(this.name, (this.imports && this.imports.length > 0));
            c.ctx = this.ctx;
            c.path = this.path;
            c.schema = this.schema;
            c.schemaVersion = this.schemaVersion;
            c.definitions = cdmObject.arrayCopy(wrtDoc, this.definitions);
            c.imports = cdmObject.arrayCopy(wrtDoc, this.imports);
            return c;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.verticalMode = true;
            ff.indentChildren = false;
            ff.separator = "\n";
            let ffImp = new friendlyFormatNode();
            ffImp.indentChildren = false;
            ffImp.separator = ";";
            ffImp.terminator = ";";
            ffImp.verticalMode = true;
            cdmObject.arrayGetFriendlyFormat(ffImp, this.imports);
            ff.addChild(ffImp);
            let ffDef = new friendlyFormatNode();
            ffDef.indentChildren = false;
            ffDef.separator = ";\n";
            ffDef.terminator = ";";
            ffDef.verticalMode = true;
            cdmObject.arrayGetFriendlyFormat(ffDef, this.definitions);
            ff.addChild(ffDef);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(wrtDoc, directives, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(name, path, object) {
        //let bodyCode = () =>
        {
            let doc = new Document(name, object.imports);
            doc.path = path;
            if (object.$schema)
                doc.schema = object.$schema;
            if (object.jsonSchemaSemanticVersion)
                doc.schemaVersion = object.jsonSchemaSemanticVersion;
            if (object.imports) {
                let l = object.imports.length;
                for (let i = 0; i < l; i++) {
                    doc.imports.push(ImportImpl.instanceFromData(object.imports[i]));
                }
            }
            if (object.definitions) {
                let l = object.definitions.length;
                for (let i = 0; i < l; i++) {
                    const d = object.definitions[i];
                    if (d.dataTypeName)
                        doc.definitions.push(DataTypeImpl.instanceFromData(d));
                    else if (d.relationshipName)
                        doc.definitions.push(RelationshipImpl.instanceFromData(d));
                    else if (d.attributeGroupName)
                        doc.definitions.push(AttributeGroupImpl.instanceFromData(d));
                    else if (d.traitName)
                        doc.definitions.push(TraitImpl.instanceFromData(d));
                    else if (d.entityShape)
                        doc.definitions.push(ConstantEntityImpl.instanceFromData(d));
                    else if (d.entityName)
                        doc.definitions.push(EntityImpl.instanceFromData(d));
                }
            }
            return doc;
        }
        //return p.measure(bodyCode);
    }
    addImport(uri, moniker) {
        //let bodyCode = () =>
        {
            if (!this.imports)
                this.imports = new Array();
            let i = new ImportImpl(uri, moniker);
            i.ctx = this.ctx;
            this.imports.push(i);
        }
        //return p.measure(bodyCode);
    }
    getImports() {
        //let bodyCode = () =>
        {
            return this.imports;
        }
        //return p.measure(bodyCode);
    }
    addDefinition(ofType, name) {
        //let bodyCode = () =>
        {
            let newObj = Corpus.MakeObject(ofType, name);
            if (newObj != null) {
                this.definitions.push(newObj);
                if (ofType == cdmObjectType.entityDef)
                    newObj.docDeclared = this;
            }
            return newObj;
        }
        //return p.measure(bodyCode);
    }
    getSchema() {
        //let bodyCode = () =>
        {
            return this.schema;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    setName(name) {
        //let bodyCode = () =>
        {
            this.name = name;
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    getSchemaVersion() {
        //let bodyCode = () =>
        {
            return this.schemaVersion;
        }
        //return p.measure(bodyCode);
    }
    getDefinitions() {
        //let bodyCode = () =>
        {
            return this.definitions;
        }
        //return p.measure(bodyCode);
    }
    getFolder() {
        return this.folder;
    }
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            if (preChildren && preChildren(this, pathFrom))
                return false;
            if (this.definitions)
                if (cdmObject.visitArray(this.definitions, pathFrom, preChildren, postChildren))
                    return true;
            if (postChildren && postChildren(this, pathFrom))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    // remove any old document content from caches and re-declare and resolve with new content
    refresh() {
        //let bodyCode = () =>
        {
            // make the corpus internal machinery pay attention to this document for this call
            let corpus = this.folder.corpus;
            let oldDoc = corpus.ctx.currentDoc;
            corpus.ctx.currentDoc = this;
            // clear old cached things for this doc
            this.clearCaches();
            // this is the minimum set of steps needed to get an object to the point where references will resolve to objects in the corpus
            // index any imports
            corpus.resolveDocumentImports(this, null);
            this.indexImports(corpus.directory);
            // check basic integrity
            corpus.checkObjectIntegrity();
            // declare definitions of objects in this doc
            corpus.declareObjectDefinitions("");
            // make sure we can find everything that is named by reference
            corpus.resolveObjectDefinitions();
            // now resolve any trait arguments that are type object
            corpus.resolveTraitArguments();
            // finish up
            corpus.finishDocumentResolve();
            // go back to what you had before
            corpus.ctx.currentDoc = oldDoc;
        }
        //return p.measure(bodyCode);
    }
    indexImports(directory) {
        //let bodyCode = () =>
        {
            this.extenalDeclarationCache = undefined;
            if (this.imports) {
                let l = this.imports.length;
                // put monikered imports into a set for named access and 
                // and add them first (so searched last) to the flat imports for a scan
                for (let i = 0; i < l; i++) {
                    const imp = this.imports[i];
                    let docLocal = imp.doc;
                    if (docLocal) {
                        if (imp.moniker && imp.moniker.length > 0) {
                            if (!this.monikeredImports.has(imp.moniker))
                                this.monikeredImports.set(imp.moniker, docLocal);
                            this.flatImports.push(docLocal);
                        }
                    }
                }
                // now the non named imports
                for (let i = 0; i < l; i++) {
                    const imp = this.imports[i];
                    if (imp.doc) {
                        if (!imp.moniker || imp.moniker.length == 0)
                            this.flatImports.push(imp.doc);
                    }
                }
            }
            // if there is only one flat import, then don't make a local cache context.
            // later we will just search in that one doc
            if (this.monikeredImports.size > 0 || this.flatImports.length > 1)
                this.extenalDeclarationCache = new Map();
        }
        //return p.measure(bodyCode);
    }
    getObjectFromDocumentPath(objectPath) {
        //let bodyCode = () =>
        {
            // in current document?
            if (this.internalDeclarations.has(objectPath))
                return this.internalDeclarations.get(objectPath);
            return null;
        }
        //return p.measure(bodyCode);
    }
    resolveString(ctx, str, avoid) {
        //let bodyCode = () =>
        {
            // prevents loops in imports
            if (avoid.has(this))
                return undefined;
            avoid.add(this);
            let found = {};
            // first check local declarations, then seach the includes
            found.toObjectDef = this.internalDeclarations.get(str);
            if (!found.toObjectDef) {
                if (!this.extenalDeclarationCache) {
                    // signal there is 0 or 1 import only
                    if (this.flatImports.length)
                        found = this.flatImports[0].resolveString(ctx, str, avoid);
                }
                else {
                    // cached ?
                    let ext = this.extenalDeclarationCache.get(str);
                    if (ext) {
                        found.toObjectDef = ext["0"];
                        found.viaMoniker = ext["1"];
                    }
                    else {
                        // see if there is a prefix that might match one of the imports
                        let preEnd = str.indexOf('/');
                        if (preEnd == 0) {
                            // absolute refererence
                            ctx.statusRpt(cdmStatusLevel.error, "no support for absolute references yet. fix '" + str + "'", ctx.relativePath);
                            return undefined;
                        }
                        if (preEnd > 0) {
                            let prefix = str.slice(0, preEnd);
                            let newRef = str.slice(preEnd + 1);
                            if (this.monikeredImports && this.monikeredImports.has(prefix)) {
                                found = this.monikeredImports.get(prefix).resolveString(ctx, newRef, avoid);
                                if (found)
                                    found.viaMoniker = true;
                            }
                        }
                        if (found && !found.toObjectDef) {
                            // look through the flat list of imports
                            // do this from bottom up so that the last imported declaration for a duplicate name is found first
                            let imps = this.flatImports.length;
                            for (let imp = imps - 1; imp >= 0; imp--) {
                                let impDoc = this.flatImports[imp];
                                found = impDoc.resolveString(ctx, str, avoid);
                                if (found) {
                                    found.viaMoniker = false;
                                    break;
                                }
                            }
                        }
                        // cache the external find
                        if (found && found.toObjectDef) {
                            this.extenalDeclarationCache.set(str, [found.toObjectDef, found.viaMoniker]);
                        }
                    }
                }
            }
            if (!found || !found.toObjectDef)
                return undefined;
            if (found.underCtx == undefined)
                found.underCtx = ctx;
            if (found.usingDoc == undefined)
                found.usingDoc = found.underCtx.currentDoc;
            if (found.viaMoniker == undefined)
                found.viaMoniker = false;
            return found;
        }
        //return p.measure(bodyCode);
    }
}
exports.Document = Document;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {folderDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class Folder extends cdmObjectSimple {
    constructor(corpus, name, parentPath) {
        super();
        //let bodyCode = () =>
        {
            this.corpus = corpus;
            this.name = name;
            this.relativePath = parentPath + name + "/";
            this.subFolders = new Array();
            this.documents = new Array();
            this.documentLookup = new Map();
            this.objectType = cdmObjectType.folderDef;
        }
        //return p.measure(bodyCode);
    }
    getName() {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    getRelativePath() {
        //let bodyCode = () =>
        {
            return this.relativePath;
        }
        //return p.measure(bodyCode);
    }
    getSubFolders() {
        //let bodyCode = () =>
        {
            return this.subFolders;
        }
        //return p.measure(bodyCode);
    }
    getDocuments() {
        //let bodyCode = () =>
        {
            return this.documents;
        }
        //return p.measure(bodyCode);
    }
    addFolder(name) {
        //let bodyCode = () =>
        {
            let newFolder = new Folder(this.corpus, name, this.relativePath);
            this.subFolders.push(newFolder);
            return newFolder;
        }
        //return p.measure(bodyCode);
    }
    addDocument(name, content) {
        //let bodyCode = () =>
        {
            let doc;
            if (this.documentLookup.has(name))
                return;
            if (content == null || content == "")
                doc = Document.instanceFromData(name, this.relativePath, new Document(name, false));
            else if (typeof (content) === "string")
                doc = Document.instanceFromData(name, this.relativePath, JSON.parse(content));
            else
                doc = Document.instanceFromData(name, this.relativePath, content);
            doc.folder = this;
            doc.ctx = this.ctx;
            this.documents.push(doc);
            this.corpus.addDocumentObjects(this, doc);
            this.documentLookup.set(name, doc);
            return doc;
        }
        //return p.measure(bodyCode);
    }
    removeDocument(name) {
        if (this.documentLookup.has(name)) {
            this.corpus.removeDocumentObjects(this, this.documentLookup.get(name));
            this.documents.splice(this.documents.findIndex((d) => d.getName() == name), 1);
            this.documentLookup.delete(name);
        }
    }
    getSubFolderFromPath(path, makeFolder = true) {
        //let bodyCode = () =>
        {
            let name;
            let remainingPath;
            let first = path.indexOf('/', 0);
            if (first < 0) {
                name = path.slice(0);
                remainingPath = "";
            }
            else {
                name = path.slice(0, first);
                remainingPath = path.slice(first + 1);
            }
            if (name.toUpperCase() == this.name.toUpperCase()) {
                // the end?
                if (remainingPath.length <= 2)
                    return this;
                // check children folders
                let result;
                if (this.subFolders) {
                    this.subFolders.some(f => {
                        result = f.getSubFolderFromPath(remainingPath, makeFolder);
                        if (result)
                            return true;
                    });
                }
                if (result)
                    return result;
                if (makeFolder) {
                    // huh, well need to make the fold here
                    first = remainingPath.indexOf('/', 0);
                    name = remainingPath.slice(0, first);
                    return this.addFolder(name).getSubFolderFromPath(remainingPath, makeFolder);
                }
                else {
                    // good enough, return where we got to
                    return this;
                }
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    getObjectFromFolderPath(objectPath) {
        //let bodyCode = () =>
        {
            let docName;
            let remainingPath;
            let first = objectPath.indexOf('/', 0);
            if (first < 0) {
                remainingPath = "";
                docName = objectPath;
            }
            else {
                remainingPath = objectPath.slice(first + 1);
                docName = objectPath.substring(0, first);
            }
            // got that doc?
            if (this.documentLookup.has(docName)) {
                let doc = this.documentLookup.get(docName);
                // all that is needed ?
                if (remainingPath.length < 2)
                    return doc;
                // doc will resolve it
                return doc.getObjectFromDocumentPath(remainingPath);
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.folderDef;
        }
        //return p.measure(bodyCode);
    }
    // required by base but makes no sense... should refactor
    visit(pathFrom, preChildren, postChildren) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    copyData(wrtDoc, options) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getResolvedTraits(wrtDoc, set) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(wrtDoc, toTrait, paramName, value) {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }
    getResolvedAttributes() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    copy(wrtDoc) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getFriendlyFormat() {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
exports.Folder = Folder;
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {Corpus}
////////////////////////////////////////////////////////////////////////////////////////////////////
class resolveContextScope {
}
class resolveContext {
    constructor(statusRpt, reportAtLevel, errorAtLevel) {
        this.reportAtLevel = reportAtLevel;
        this.errorAtLevel = errorAtLevel;
        this.statusRpt = statusRpt;
        this.cache = new Map();
    }
    setDocumentContext(currentDoc, corpusPathRoot) {
        //let bodyCode = () =>
        {
            if (currentDoc)
                this.currentDoc = currentDoc;
            if (corpusPathRoot)
                this.corpusPathRoot = corpusPathRoot;
        }
        //return p.measure(bodyCode);
    }
    pushScope(currentTrait) {
        //let bodyCode = () =>
        {
            if (!this.scopeStack)
                this.scopeStack = new Array();
            let ctxNew = {
                currentTrait: currentTrait ? currentTrait : (this.currentScope ? this.currentScope.currentTrait : undefined),
                currentParameter: 0
            };
            this.currentScope = ctxNew;
            this.scopeStack.push(ctxNew);
        }
        //return p.measure(bodyCode);
    }
    popScope() {
        //let bodyCode = () =>
        {
            this.scopeStack.pop();
            this.currentScope = this.scopeStack.length ? this.scopeStack[this.scopeStack.length - 1] : undefined;
        }
        //return p.measure(bodyCode);
    }
    resolveNamedReference(str, expectedType) {
        //let bodyCode = () =>
        {
            if (!this.currentDoc)
                return null;
            let found = this.currentDoc.resolveString(this, str, new Set());
            // found something, is it the right type?
            if (found && expectedType != cdmObjectType.error) {
                switch (expectedType) {
                    case cdmObjectType.attributeGroupRef:
                        if (!(found.toObjectDef instanceof AttributeGroupImpl)) {
                            this.statusRpt(cdmStatusLevel.error, "expected type attributeGroup", this.relativePath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.dataTypeRef:
                        if (!(found.toObjectDef instanceof DataTypeImpl)) {
                            this.statusRpt(cdmStatusLevel.error, "expected type dataType", this.relativePath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.entityRef:
                        if (!(found.toObjectDef instanceof EntityImpl)) {
                            this.statusRpt(cdmStatusLevel.error, "expected type entity", this.relativePath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.parameterDef:
                        if (!(found.toObjectDef instanceof ParameterImpl)) {
                            this.statusRpt(cdmStatusLevel.error, "expected type parameter", this.relativePath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.relationshipRef:
                        if (!(found.toObjectDef instanceof RelationshipImpl)) {
                            this.statusRpt(cdmStatusLevel.error, "expected type relationship", this.relativePath);
                            found = null;
                        }
                        break;
                    case cdmObjectType.traitRef:
                        if (!(found.toObjectDef instanceof TraitImpl)) {
                            this.statusRpt(cdmStatusLevel.error, "expected type trait", this.relativePath);
                            found = null;
                        }
                        break;
                }
            }
            return found;
        }
        //return p.measure(bodyCode);
    }
    getCache(forObj, wrtDoc, kind) {
        //let bodyCode = () =>
        {
            let key = forObj.ID.toString() + "_" + (wrtDoc ? wrtDoc.ID.toString() : "NULL") + "_" + kind;
            let res = this.cache.get(key);
            return res;
        }
        //return p.measure(bodyCode);
    }
    setCache(forObj, wrtDoc, kind, value) {
        //let bodyCode = () =>
        {
            let key = forObj.ID.toString() + "_" + (wrtDoc ? wrtDoc.ID.toString() : "NULL") + "_" + kind;
            this.cache.set(key, value);
        }
        //return p.measure(bodyCode);
    }
}
class Corpus extends Folder {
    constructor(rootPath) {
        super(null, "", "");
        //let bodyCode = () =>
        {
            this.corpus = this; // well ... it is
            this.rootPath = rootPath;
            this.allDocuments = new Array();
            this.pathLookup = new Map();
            this.directory = new Map();
            this.ctx = new resolveContext((level, msg, path) => {
                if (level >= this.ctx.errorAtLevel)
                    this.ctx.errors++;
            });
        }
        //return p.measure(bodyCode);
    }
    static nextID() {
        this._nextID++;
        return this._nextID;
    }
    static MakeRef(ofType, refObj, simpleNameRef) {
        //let bodyCode = () =>
        {
            let oRef;
            if (refObj) {
                if (typeof (refObj) === "string")
                    oRef = this.MakeObject(ofType, refObj, simpleNameRef);
                else {
                    if (refObj.objectType == ofType) {
                        // forgive this mistake, return the ref passed in
                        oRef = refObj;
                    }
                    else {
                        oRef = this.MakeObject(ofType);
                        oRef.setObjectDef(refObj);
                    }
                }
            }
            return oRef;
        }
        //return p.measure(bodyCode);
    }
    static MakeObject(ofType, nameOrRef, simmpleNameRef) {
        //let bodyCode = () =>
        {
            let newObj = null;
            switch (ofType) {
                case cdmObjectType.argumentDef:
                    newObj = new ArgumentImpl();
                    newObj.name = nameOrRef;
                    break;
                case cdmObjectType.attributeGroupDef:
                    newObj = new AttributeGroupImpl(nameOrRef);
                    break;
                case cdmObjectType.attributeGroupRef:
                    newObj = new AttributeGroupReferenceImpl(nameOrRef, simmpleNameRef);
                    break;
                case cdmObjectType.constantEntityDef:
                    newObj = new ConstantEntityImpl();
                    newObj.constantEntityName = nameOrRef;
                    break;
                case cdmObjectType.dataTypeDef:
                    newObj = new DataTypeImpl(nameOrRef, null, false);
                    break;
                case cdmObjectType.dataTypeRef:
                    newObj = new DataTypeReferenceImpl(nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.documentDef:
                    newObj = new Document(name, false);
                    break;
                case cdmObjectType.entityAttributeDef:
                    newObj = new EntityAttributeImpl(nameOrRef, false);
                    break;
                case cdmObjectType.entityDef:
                    newObj = new EntityImpl(nameOrRef, null, false, false);
                    break;
                case cdmObjectType.entityRef:
                    newObj = new EntityReferenceImpl(nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.import:
                    newObj = new ImportImpl(nameOrRef);
                    break;
                case cdmObjectType.parameterDef:
                    newObj = new ParameterImpl(nameOrRef);
                    break;
                case cdmObjectType.relationshipDef:
                    newObj = new RelationshipImpl(nameOrRef, null, false);
                    break;
                case cdmObjectType.relationshipRef:
                    newObj = new RelationshipReferenceImpl(nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.traitDef:
                    newObj = new TraitImpl(nameOrRef, null, false);
                    break;
                case cdmObjectType.traitRef:
                    newObj = new TraitReferenceImpl(nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.typeAttributeDef:
                    newObj = new TypeAttributeImpl(nameOrRef, false);
                    break;
                case cdmObjectType.attributeContextDef:
                    newObj = new AttributeContextImpl(nameOrRef);
                    break;
                case cdmObjectType.attributeContextRef:
                    newObj = new AttributeContextReferenceImpl(nameOrRef);
                    break;
                case cdmObjectType.attributeRef:
                    newObj = new AttributeReferenceImpl(nameOrRef, simmpleNameRef);
                    break;
            }
            return newObj;
        }
        //return p.measure(bodyCode);
    }
    static GetReferenceType(ofType) {
        //let bodyCode = () =>
        {
            switch (ofType) {
                case cdmObjectType.argumentDef:
                case cdmObjectType.documentDef:
                case cdmObjectType.import:
                case cdmObjectType.parameterDef:
                default:
                    return cdmObjectType.error;
                case cdmObjectType.attributeGroupRef:
                case cdmObjectType.attributeGroupDef:
                    return cdmObjectType.attributeGroupRef;
                case cdmObjectType.constantEntityDef:
                case cdmObjectType.entityDef:
                case cdmObjectType.entityRef:
                    return cdmObjectType.entityRef;
                case cdmObjectType.dataTypeDef:
                case cdmObjectType.dataTypeRef:
                    return cdmObjectType.dataTypeRef;
                case cdmObjectType.relationshipDef:
                case cdmObjectType.relationshipRef:
                    return cdmObjectType.relationshipRef;
                case cdmObjectType.traitDef:
                case cdmObjectType.traitRef:
                    return cdmObjectType.traitRef;
                case cdmObjectType.entityAttributeDef:
                case cdmObjectType.typeAttributeDef:
                case cdmObjectType.attributeRef:
                    return cdmObjectType.attributeRef;
                case cdmObjectType.attributeContextDef:
                case cdmObjectType.attributeContextRef:
                    return cdmObjectType.attributeContextRef;
            }
        }
        //return p.measure(bodyCode);
    }
    addDocumentObjects(folder, docDef) {
        //let bodyCode = () =>
        {
            let doc = docDef;
            let path = doc.path + doc.name;
            if (!this.pathLookup.has(path)) {
                this.allDocuments.push([folder, doc]);
                this.pathLookup.set(path, [folder, doc]);
                this.directory.set(doc, folder);
            }
            return doc;
        }
        //return p.measure(bodyCode);
    }
    removeDocumentObjects(folder, docDef) {
        let doc = docDef;
        let path = doc.path + doc.name;
        if (this.pathLookup.has(path)) {
            this.pathLookup.delete(path);
            this.directory.delete(doc);
            let index = this.allDocuments.indexOf([folder, doc]);
            this.allDocuments.splice(index, 1);
        }
    }
    addDocumentFromContent(uri, content) {
        //let bodyCode = () =>
        {
            let last = uri.lastIndexOf('/');
            if (last < 0)
                throw new Error("bad path");
            let name = uri.slice(last + 1);
            let path = uri.slice(0, last + 1);
            let folder = this.getSubFolderFromPath(path, true);
            if (folder == null && path == "/")
                folder = this;
            return folder.addDocument(name, content);
        }
        //return p.measure(bodyCode);
    }
    resolveDocumentImports(doc, missingSet) {
        //let bodyCode = () =>
        {
            if (doc.imports) {
                doc.imports.forEach(imp => {
                    if (!imp.doc) {
                        // no document set for this import, see if it is already loaded into the corpus
                        let path = imp.uri;
                        if (path.charAt(0) != '/')
                            path = doc.folder.getRelativePath() + imp.uri;
                        let lookup = this.pathLookup.get(path);
                        if (lookup)
                            imp.doc = lookup["1"];
                        else {
                            if (missingSet)
                                missingSet.add(path);
                        }
                    }
                });
            }
        }
        //return p.measure(bodyCode);
    }
    listMissingImports() {
        //let bodyCode = () =>
        {
            let missingSet = new Set();
            let l = this.allDocuments.length;
            for (let i = 0; i < l; i++) {
                const fs = this.allDocuments[i];
                this.resolveDocumentImports(fs["1"], missingSet);
            }
            if (missingSet.size == 0)
                return undefined;
            return missingSet;
        }
        //return p.measure(bodyCode);
    }
    getObjectFromCorpusPath(objectPath) {
        //let bodyCode = () =>
        {
            if (objectPath && objectPath.indexOf('/') == 0) {
                let lastFolder = this.getSubFolderFromPath(objectPath, false); // don't create new folders, just go as far as possible
                if (lastFolder) {
                    // maybe the seach is for a folder?
                    let lastPath = lastFolder.getRelativePath();
                    if (lastPath === objectPath)
                        return lastFolder;
                    // remove path to folder and then look in the folder 
                    objectPath = objectPath.slice(lastPath.length);
                    return lastFolder.getObjectFromFolderPath(objectPath);
                }
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    setResolutionCallback(status, reportAtLevel = cdmStatusLevel.info, errorAtLevel = cdmStatusLevel.warning) {
        this.ctx.reportAtLevel = reportAtLevel;
        this.ctx.errorAtLevel = errorAtLevel;
        this.ctx.errors = 0;
        this.ctx.statusRpt =
            (level, msg, path) => {
                if (level >= this.ctx.errorAtLevel)
                    this.ctx.errors++;
                if (level >= this.ctx.reportAtLevel)
                    status(level, msg, path);
            };
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //  resolve imports
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    resolveImports(importResolver) {
        //let bodyCode = () =>
        {
            return new Promise(resolve => {
                let missingSet = this.listMissingImports();
                let result = true;
                let turnMissingImportsIntoClientPromises = () => {
                    if (missingSet) {
                        // turn each missing into a promise for a missing from the caller
                        missingSet.forEach(missing => {
                            importResolver(missing).then((success) => {
                                if (result) {
                                    // a new document for the corpus
                                    this.addDocumentFromContent(success[0], success[1]);
                                    // remove this from set
                                    missingSet.delete(success[0]);
                                    this.ctx.statusRpt(cdmStatusLevel.progress, `resolved import '${success[0]}'`, "");
                                    // if this is the last import, check to see if more are needed now and recurse 
                                    if (missingSet.size == 0) {
                                        missingSet = this.listMissingImports();
                                        turnMissingImportsIntoClientPromises();
                                    }
                                }
                            }, (fail) => {
                                result = false;
                                // something went wrong with one of the imports, give up on all of it
                                this.ctx.statusRpt(cdmStatusLevel.error, `failed to import '${fail[0]}' for reason : ${fail[1]}`, this.getRelativePath());
                                resolve(result);
                            });
                        });
                    }
                    else {
                        // nothing was missing, so just move to next resolve step
                        resolve(result);
                    }
                };
                turnMissingImportsIntoClientPromises();
            });
        }
        //return p.measure(bodyCode);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  resolve references
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkObjectIntegrity() {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            ctx.currentDoc.visit("", (iObject, path) => {
                if (iObject.validate() == false) {
                    ctx.statusRpt(cdmStatusLevel.error, `integrity check failed for : '${path}'`, ctx.currentDoc.path + path);
                }
                else
                    iObject.ctx = ctx;
                ctx.statusRpt(cdmStatusLevel.info, `checked '${path}'`, ctx.currentDoc.path + path);
                return false;
            }, null);
        }
        //return p.measure(bodyCode);
    }
    declareObjectDefinitions(relativePath) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            ctx.corpusPathRoot = ctx.currentDoc.path + ctx.currentDoc.name;
            ctx.currentDoc.visit(relativePath, (iObject, path) => {
                if (path.indexOf("(unspecified)") > 0)
                    return true;
                switch (iObject.objectType) {
                    case cdmObjectType.entityDef:
                        iObject.docDeclared = ctx.currentDoc;
                        iObject.ctxDefault = ctx;
                    case cdmObjectType.parameterDef:
                    case cdmObjectType.traitDef:
                    case cdmObjectType.relationshipDef:
                    case cdmObjectType.attributeContextDef:
                    case cdmObjectType.dataTypeDef:
                    case cdmObjectType.typeAttributeDef:
                    case cdmObjectType.entityAttributeDef:
                    case cdmObjectType.attributeGroupDef:
                    case cdmObjectType.constantEntityDef:
                    case cdmObjectType.attributeContextDef:
                        ctx.relativePath = relativePath;
                        let corpusPath = ctx.corpusPathRoot + '/' + path;
                        if (ctx.currentDoc.internalDeclarations.has(path)) {
                            ctx.statusRpt(cdmStatusLevel.error, `duplicate declaration for item '${path}'`, corpusPath);
                            return false;
                        }
                        ctx.currentDoc.internalDeclarations.set(path, iObject);
                        iObject.corpusPath = corpusPath;
                        ctx.statusRpt(cdmStatusLevel.info, `declared '${path}'`, corpusPath);
                        break;
                }
                return false;
            }, null);
        }
        //return p.measure(bodyCode);
    }
    constTypeCheck(paramDef, aValue) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            let wrtDoc = ctx.currentDoc;
            let replacement = aValue;
            // if parameter type is entity, then the value should be an entity or ref to one
            // same is true of 'dataType' dataType
            if (paramDef.getDataTypeRef()) {
                let dt = paramDef.getDataTypeRef().getObjectDef(wrtDoc);
                if (!dt)
                    dt = paramDef.getDataTypeRef().getObjectDef(wrtDoc);
                // compare with passed in value or default for parameter
                let pValue = aValue;
                if (!pValue) {
                    pValue = paramDef.getDefaultValue();
                    replacement = pValue;
                }
                if (pValue) {
                    if (dt.isDerivedFrom(wrtDoc, "cdmObject")) {
                        let expectedTypes = new Array();
                        let expected;
                        if (dt.isDerivedFrom(wrtDoc, "entity")) {
                            expectedTypes.push(cdmObjectType.constantEntityDef);
                            expectedTypes.push(cdmObjectType.entityRef);
                            expectedTypes.push(cdmObjectType.entityDef);
                            expected = "entity";
                        }
                        else if (dt.isDerivedFrom(wrtDoc, "attribute")) {
                            expectedTypes.push(cdmObjectType.attributeRef);
                            expectedTypes.push(cdmObjectType.typeAttributeDef);
                            expectedTypes.push(cdmObjectType.entityAttributeDef);
                            expected = "attribute";
                        }
                        else if (dt.isDerivedFrom(wrtDoc, "dataType")) {
                            expectedTypes.push(cdmObjectType.dataTypeRef);
                            expectedTypes.push(cdmObjectType.dataTypeDef);
                            expected = "dataType";
                        }
                        else if (dt.isDerivedFrom(wrtDoc, "relationship")) {
                            expectedTypes.push(cdmObjectType.relationshipRef);
                            expectedTypes.push(cdmObjectType.relationshipDef);
                            expected = "relationship";
                        }
                        else if (dt.isDerivedFrom(wrtDoc, "trait")) {
                            expectedTypes.push(cdmObjectType.traitRef);
                            expectedTypes.push(cdmObjectType.traitDef);
                            expected = "trait";
                        }
                        else if (dt.isDerivedFrom(wrtDoc, "attributeGroup")) {
                            expectedTypes.push(cdmObjectType.attributeGroupRef);
                            expectedTypes.push(cdmObjectType.attributeGroupDef);
                            expected = "attributeGroup";
                        }
                        if (expectedTypes.length == 0)
                            ctx.statusRpt(cdmStatusLevel.error, `parameter '${paramDef.getName()}' has an unexpected dataType.`, ctx.currentDoc.path + ctx.relativePath);
                        // if a string constant, resolve to an object ref.
                        let foundType = cdmObjectType.error;
                        if (typeof (pValue) === "object")
                            foundType = pValue.objectType;
                        let foundDesc = ctx.relativePath;
                        if (typeof (pValue) === "string") {
                            if (pValue == "this.attribute" && expected == "attribute") {
                                // will get sorted out later when resolving traits
                                foundType = cdmObjectType.attributeRef;
                            }
                            else {
                                foundDesc = pValue;
                                let resAttToken = "/(resolvedAttributes)/";
                                let seekResAtt = pValue.indexOf(resAttToken);
                                if (seekResAtt >= 0) {
                                    // get an object there that will get resolved later after resolved attributes
                                    replacement = new AttributeReferenceImpl(pValue, true);
                                    replacement.ctx = ctx;
                                    foundType = cdmObjectType.attributeRef;
                                }
                                else {
                                    let lu = ctx.resolveNamedReference(pValue, cdmObjectType.error);
                                    if (lu) {
                                        if (expected === "attribute") {
                                            replacement = new AttributeReferenceImpl(pValue, true);
                                            replacement.ctx = ctx;
                                            foundType = cdmObjectType.attributeRef;
                                        }
                                        else {
                                            replacement = lu.toObjectDef;
                                            foundType = replacement.objectType;
                                        }
                                    }
                                }
                            }
                        }
                        if (expectedTypes.indexOf(foundType) == -1)
                            ctx.statusRpt(cdmStatusLevel.error, `parameter '${paramDef.getName()}' has the dataType of '${expected}' but the value '${foundDesc}' does't resolve to a known ${expected} referenece`, ctx.currentDoc.path + ctx.relativePath);
                        else {
                            ctx.statusRpt(cdmStatusLevel.info, `    resolved '${foundDesc}'`, ctx.relativePath);
                        }
                    }
                }
            }
            return replacement;
        }
        //return p.measure(bodyCode);
    }
    resolveObjectDefinitions() {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            ctx.currentDoc.visit("", (iObject, path) => {
                let ot = iObject.objectType;
                switch (ot) {
                    case cdmObjectType.attributeRef:
                        // don't try to look these up now.
                        if (iObject.namedReference && iObject.namedReference.indexOf("(resolvedAttributes)") != -1)
                            break;
                    case cdmObjectType.attributeGroupRef:
                    case cdmObjectType.attributeContextRef:
                    case cdmObjectType.dataTypeRef:
                    case cdmObjectType.entityRef:
                    case cdmObjectType.relationshipRef:
                    case cdmObjectType.traitRef:
                        ctx.relativePath = path;
                        let ref = iObject;
                        // see if a cache has already happened
                        let res = this.ctx.getCache(ref, null, "nameResolve");
                        if (!res)
                            res = this.ctx.getCache(ref, ctx.currentDoc, "nameResolve");
                        if (ref.namedReference && !res && !ref.explicitReference) {
                            // no, so look up the thing now
                            let found = ctx.resolveNamedReference(ref.namedReference, ot);
                            if (!found) {
                                // it is 'ok' to not find entity refs sometimes
                                let level = (ot == cdmObjectType.entityRef) ? cdmStatusLevel.warning : cdmStatusLevel.error;
                                ctx.statusRpt(level, `unable to resolve the reference '${ref.namedReference}' to a known object`, ctx.currentDoc.path + path);
                            }
                            else {
                                ref.monikeredDocument = found.viaMoniker ? ctx.currentDoc : undefined;
                                ctx.statusRpt(cdmStatusLevel.info, `    resolved '${ref.namedReference}'`, ctx.currentDoc.path + path);
                            }
                        }
                        break;
                }
                return false;
            }, (iObject, path) => {
                let ot = iObject.objectType;
                switch (ot) {
                    case cdmObjectType.parameterDef:
                        // when a parameter has a datatype that is a cdm object, validate that any default value is the
                        // right kind object
                        let p = iObject;
                        this.constTypeCheck(p, null);
                        break;
                }
                return false;
            });
        }
        //return p.measure(bodyCode);
    }
    resolveTraitArguments() {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            ctx.currentDoc.visit("", (iObject, path) => {
                let ot = iObject.objectType;
                switch (ot) {
                    case cdmObjectType.traitRef:
                        ctx.pushScope(iObject.getObjectDef(ctx.currentDoc));
                        break;
                    case cdmObjectType.argumentDef:
                        try {
                            ctx.relativePath = path;
                            let params = ctx.currentScope.currentTrait.getAllParameters(ctx.currentDoc);
                            let paramFound;
                            let aValue;
                            if (ot == cdmObjectType.argumentDef) {
                                paramFound = params.resolveParameter(ctx.currentScope.currentParameter, iObject.getName());
                                iObject.resolvedParameter = paramFound;
                                aValue = iObject.value;
                                // if parameter type is entity, then the value should be an entity or ref to one
                                // same is true of 'dataType' dataType
                                aValue = this.constTypeCheck(paramFound, aValue);
                                iObject.setValue(aValue);
                            }
                        }
                        catch (e) {
                            ctx.statusRpt(cdmStatusLevel.error, e.toString(), path);
                            ctx.statusRpt(cdmStatusLevel.error, `failed to resolve parameter on trait '${ctx.currentScope.currentTrait.getName()}'`, ctx.currentDoc.path + path);
                        }
                        ctx.currentScope.currentParameter++;
                        break;
                }
                return false;
            }, (iObject, path) => {
                let ot = iObject.objectType;
                switch (ot) {
                    case cdmObjectType.traitRef:
                        ctx.popScope();
                        break;
                }
                return false;
            });
            return;
        }
        //return p.measure(bodyCode);
    }
    finishDocumentResolve() {
        //let bodyCode = () =>
        {
            this.ctx.currentDoc.visit("", (iObject, path) => {
                let obj = iObject;
                obj.skipElevated = false;
                obj.rtsbAll = null;
                return false;
            }, null);
        }
        //return p.measure(bodyCode);
    }
    finishResolve() {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            //  cleanup references
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            ctx.statusRpt(cdmStatusLevel.progress, "finishing...", null);
            // turn elevated traits back on, they are off by default and should work fully now that everything is resolved
            let l = this.allDocuments.length;
            for (let i = 0; i < l; i++) {
                const fd = this.allDocuments[i];
                this.ctx.currentDoc = fd["1"];
                this.finishDocumentResolve();
                this.ctx.currentDoc = undefined;
            }
            ;
            p.report();
            if (visits) {
                let max = 0;
                let maxVisit = "";
                visits.forEach((v, k) => {
                    if (v > 250) {
                        max = v;
                        maxVisit = k;
                    }
                });
                console.log(`${maxVisit}, ${max}`);
            }
        }
        //return p.measure(bodyCode);
    }
    resolveReferencesAndValidate(stage, stageThrough) {
        //let bodyCode = () =>
        {
            return new Promise(resolve => {
                let errors = 0;
                let ctx = this.ctx;
                ////////////////////////////////////////////////////////////////////////////////////////////////////
                //  folder imports
                ////////////////////////////////////////////////////////////////////////////////////////////////////
                if (stage == cdmValidationStep.start || stage == cdmValidationStep.imports) {
                    ctx.statusRpt(cdmStatusLevel.progress, "importing documents...", null);
                    stage = cdmValidationStep.imports;
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        // cache import documents
                        ctx.currentDoc = fd["1"];
                        ctx.currentDoc.indexImports(this.directory);
                        ctx.currentDoc = undefined;
                    }
                    ;
                    if (errors > 0) {
                        resolve(cdmValidationStep.error);
                    }
                    else {
                        if (stageThrough == stage) {
                            this.finishResolve();
                            resolve(cdmValidationStep.finished);
                        }
                        else
                            resolve(cdmValidationStep.integrity);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.integrity) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  integrity
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    ctx.statusRpt(cdmStatusLevel.progress, "basic object integrity...", null);
                    // for each document, see if any object doesn't have the basic required shape
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        this.checkObjectIntegrity();
                        ctx.currentDoc = undefined;
                    }
                    if (errors > 0) {
                        resolve(cdmValidationStep.error);
                    }
                    else {
                        if (stageThrough == stage) {
                            this.finishResolve();
                            resolve(cdmValidationStep.finished);
                        }
                        else
                            resolve(cdmValidationStep.declarations);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.declarations) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  declarations
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    ctx.statusRpt(cdmStatusLevel.progress, "making declarations...", null);
                    // for each document, make a directory of the objects that are declared within it with a path relative to the doc
                    // the rules are that any declared object with a name or an attribute with a name adds the name to a path
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        this.declareObjectDefinitions("");
                        ctx.currentDoc = undefined;
                    }
                    if (errors > 0) {
                        resolve(cdmValidationStep.error);
                    }
                    else {
                        if (stageThrough == stage) {
                            this.finishResolve();
                            resolve(cdmValidationStep.finished);
                        }
                        else
                            resolve(cdmValidationStep.references);
                    }
                    return;
                }
                else if (stage === cdmValidationStep.references) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  references
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // for each document, find each explicit or implicit reference and search for the object named. 
                    // if the name starts with a moniker for one of the imports, then look through that import first else look through the main document first.
                    // if not found, look through any of the imported documents that have no moniker in listed order. depth first avoiding cycles
                    // if any imports have not been resolved to documents, skip them
                    ctx.statusRpt(cdmStatusLevel.progress, "resolving references...", null);
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        this.resolveObjectDefinitions();
                        ctx.currentDoc = undefined;
                    }
                    ;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else {
                        if (stageThrough == stage) {
                            this.finishResolve();
                            resolve(cdmValidationStep.finished);
                        }
                        else
                            resolve(cdmValidationStep.parameters);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.parameters) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  parameters
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    ctx.statusRpt(cdmStatusLevel.progress, "binding parameters...", null);
                    // tie arguments to the parameter for the referenced trait
                    // if type is a cdm object or ref and  value is a string, then resolve like a ref 
                    // calling getAllParameters will validate that there are no duplicate params in the inheritence chain of the trait
                    // calling resolveParameter will fail if there is no match on the given name or ordinal
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        this.resolveTraitArguments();
                        ctx.currentDoc = undefined;
                    }
                    ;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else {
                        if (stageThrough == stage) {
                            this.finishResolve();
                            resolve(cdmValidationStep.finished);
                        }
                        else
                            resolve(cdmValidationStep.traits);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.traits) {
                    ctx.statusRpt(cdmStatusLevel.progress, "resolving traits...", null);
                    let assignAppliers = (traitMatch, traitAssign) => {
                        if (!traitMatch)
                            return;
                        if (traitMatch.getExtendsTrait())
                            assignAppliers(traitMatch.getExtendsTrait().getObjectDef(ctx.currentDoc), traitAssign);
                        let traitName = traitMatch.getName();
                        // small number of matcher
                        PrimitiveAppliers.forEach(applier => {
                            if (applier.matchName == traitName)
                                traitAssign.addTraitApplier(applier);
                        });
                    };
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        ctx.currentDoc.visit("", (iObject, path) => {
                            switch (iObject.objectType) {
                                case cdmObjectType.traitDef:
                                    // add trait appliers to this trait from base class on up
                                    assignAppliers(iObject, iObject);
                                    break;
                            }
                            return false;
                        }, null);
                        ctx.currentDoc = undefined;
                    }
                    ;
                    // for every defined object, find and cache the full set of traits that are exhibited or applied during inheritence 
                    // and for each get a mapping of values (starting with default values) to parameters build from the base declaration up to the final
                    // so that any overrides done along the way take precidence.
                    // for trait definition, consider that when extending a base trait arguments can be applied.
                    let entityNesting = 0;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        ctx.currentDoc.visit("", (iObject, path) => {
                            switch (iObject.objectType) {
                                case cdmObjectType.entityDef:
                                case cdmObjectType.attributeGroupDef:
                                    entityNesting++;
                                    // don't do this for entities and groups defined within entities since getting traits already does that
                                    if (entityNesting > 1)
                                        break;
                                case cdmObjectType.traitDef:
                                case cdmObjectType.relationshipDef:
                                case cdmObjectType.dataTypeDef:
                                    ctx.relativePath = path;
                                    iObject.getResolvedTraits(ctx.currentDoc);
                                    break;
                                case cdmObjectType.entityAttributeDef:
                                case cdmObjectType.typeAttributeDef:
                                    ctx.relativePath = path;
                                    iObject.getResolvedTraits(ctx.currentDoc);
                                    break;
                            }
                            return false;
                        }, (iObject, path) => {
                            if (iObject.objectType === cdmObjectType.entityDef || iObject.objectType === cdmObjectType.attributeGroupDef)
                                entityNesting--;
                            return false;
                        });
                        ctx.currentDoc = undefined;
                    }
                    ;
                    ctx.statusRpt(cdmStatusLevel.progress, "checking required arguments...", null);
                    let checkRequiredParamsOnResolvedTraits = (obj) => {
                        let rts = obj.getResolvedTraits(ctx.currentDoc);
                        if (rts) {
                            let l = rts.size;
                            for (let i = 0; i < l; i++) {
                                const rt = rts.set[i];
                                let found = 0;
                                let resolved = 0;
                                if (rt.parameterValues) {
                                    let l = rt.parameterValues.length;
                                    for (let iParam = 0; iParam < l; iParam++) {
                                        if (rt.parameterValues.getParameter(iParam).getRequired()) {
                                            found++;
                                            if (!rt.parameterValues.getValue(iParam))
                                                ctx.statusRpt(cdmStatusLevel.error, `no argument supplied for required parameter '${rt.parameterValues.getParameter(iParam).getName()}' of trait '${rt.traitName}' on '${obj.getObjectDef(ctx.currentDoc).getName()}'`, ctx.currentDoc.path + ctx.relativePath);
                                            else
                                                resolved++;
                                        }
                                    }
                                }
                                if (found > 0 && found == resolved)
                                    ctx.statusRpt(cdmStatusLevel.info, `found and resolved '${found}' required parameters of trait '${rt.traitName}' on '${obj.getObjectDef(ctx.currentDoc).getName()}'`, ctx.currentDoc.path + ctx.relativePath);
                            }
                        }
                    };
                    // now make sure that within the definition of an entity, every usage of a trait has values or default values for all required params
                    let inEntityDef = 0;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        ctx.currentDoc.visit("", null, (iObject, path) => {
                            let ot = iObject.objectType;
                            if (ot == cdmObjectType.entityDef) {
                                ctx.relativePath = path;
                                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                                checkRequiredParamsOnResolvedTraits(iObject);
                                // do the same for all attributes
                                if (iObject.getHasAttributeDefs()) {
                                    iObject.getHasAttributeDefs().forEach((attDef) => {
                                        checkRequiredParamsOnResolvedTraits(attDef);
                                    });
                                }
                            }
                            if (ot == cdmObjectType.attributeGroupDef) {
                                ctx.relativePath = path;
                                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                                checkRequiredParamsOnResolvedTraits(iObject);
                                // do the same for all attributes
                                if (iObject.getMembersAttributeDefs()) {
                                    iObject.getMembersAttributeDefs().forEach((attDef) => {
                                        checkRequiredParamsOnResolvedTraits(attDef);
                                    });
                                }
                            }
                            return false;
                        });
                        ctx.currentDoc = undefined;
                    }
                    ;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else {
                        if (stageThrough == stage) {
                            this.finishResolve();
                            resolve(cdmValidationStep.finished);
                        }
                        else
                            resolve(cdmValidationStep.attributes);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.attributes) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  attributes
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    ctx.statusRpt(cdmStatusLevel.progress, "resolving attributes...", null);
                    // moving on ...
                    // for each entity, find and cache the complete set of attributes
                    // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
                    // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
                    // the relationsip of the attribute, the attribute definition itself and included attribute groups, any traits applied to the attribute.
                    // make sure there are no duplicates in the final step
                    let directives = new Set(["referenceOnly", "normalized"]);
                    let entityNesting = 0;
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        ctx.currentDoc.visit("", (iObject, path) => {
                            let ot = iObject.objectType;
                            if (ot == cdmObjectType.entityDef) {
                                entityNesting++; // get resolved att is already recursive, so don't compound
                                if (entityNesting == 1) {
                                    ctx.relativePath = path;
                                    iObject.getResolvedAttributes(ctx.currentDoc, directives);
                                }
                            }
                            if (ot == cdmObjectType.attributeGroupDef) {
                                entityNesting++;
                                if (entityNesting == 1) {
                                    ctx.relativePath = path;
                                    iObject.getResolvedAttributes(ctx.currentDoc, directives);
                                }
                            }
                            return false;
                        }, (iObject, path) => {
                            if (iObject.objectType === cdmObjectType.entityDef || iObject.objectType === cdmObjectType.attributeGroupDef)
                                entityNesting--;
                            return false;
                        });
                        ctx.currentDoc = undefined;
                    }
                    ;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else {
                        if (stageThrough == stage) {
                            this.finishResolve();
                            resolve(cdmValidationStep.finished);
                        }
                        else
                            resolve(cdmValidationStep.entityReferences);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.entityReferences) {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    //  entity references
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    let directives = new Set(["normalized", "referenceOnly"]);
                    ctx.statusRpt(cdmStatusLevel.progress, "resolving foreign key references...", null);
                    let entityNesting = 0;
                    // for each entity, find and cache the complete set of references to other entities made through referencesA relationships
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        ctx.currentDoc.visit("", (iObject, path) => {
                            let ot = iObject.objectType;
                            if (ot == cdmObjectType.attributeGroupDef)
                                entityNesting++;
                            if (ot == cdmObjectType.entityDef) {
                                entityNesting++;
                                if (entityNesting == 1) {
                                    ctx.relativePath = path;
                                    iObject.getResolvedEntityReferences(ctx.currentDoc, directives);
                                }
                            }
                            return false;
                        }, (iObject, path) => {
                            if (iObject.objectType === cdmObjectType.entityDef || iObject.objectType === cdmObjectType.attributeGroupDef)
                                entityNesting--;
                            return false;
                        });
                        ctx.currentDoc = undefined;
                    }
                    ;
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else {
                        if (stageThrough == stage) {
                            this.finishResolve();
                            resolve(cdmValidationStep.finished);
                        }
                        else {
                            this.finishResolve();
                            resolve(cdmValidationStep.finished);
                        }
                        return;
                    }
                }
                // bad step sent in
                resolve(cdmValidationStep.error);
            });
        }
        //return p.measure(bodyCode);
    }
}
Corpus._nextID = 0;
exports.Corpus = Corpus;
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  appliers to support the traits from 'primitives.cdm.json'
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
let PrimitiveAppliers = [
    {
        matchName: "is.removed",
        priority: 10,
        overridesBase: false,
        attributeRemove: (wrtDoc, resAtt, resTrait, directives) => {
            return { "shouldDelete": true };
        }
    },
    {
        matchName: "does.addAttribute",
        priority: 7,
        overridesBase: false,
        willAdd: (wrtDoc, resAtt, resTrait, directives) => {
            return true;
        },
        attributeAdd: (wrtDoc, resAtt, resTrait, directives) => {
            // get the added attribute and applied trait
            let sub = resTrait.parameterValues.getParameterValue("addedAttribute").value;
            //sub = sub.copy();
            let appliedTrait = resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait, false); // could be a def or ref or string handed in. this handles it
            }
            return { "addedAttribute": sub };
        }
    },
    {
        matchName: "does.referenceEntity",
        priority: 7,
        overridesBase: true,
        attributeRemove: (wrtDoc, resAtt, resTrait, directives) => {
            let visible = true;
            if (resAtt) {
                // all others go away
                visible = false;
                if (resAtt.target === resTrait.parameterValues.getParameterValue("addedAttribute").value)
                    visible = true;
            }
            return { "shouldDelete": false };
        },
        willAdd: (wrtDoc, resAtt, resTrait, directives) => {
            return true;
        },
        attributeAdd: (wrtDoc, resAtt, resTrait, directives) => {
            // get the added attribute and applied trait
            let sub = resTrait.parameterValues.getParameterValue("addedAttribute").value;
            //sub = sub.copy();
            let appliedTrait = resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait, false); // could be a def or ref or string handed in. this handles it
            }
            return { "addedAttribute": sub };
        },
        createContext: (wrtDoc, resAtt, resTrait, attCtx, directives) => {
            // make a new attributeContext to differentiate this supporting att
            attCtx = AttributeContextImpl.createChildUnder(wrtDoc, attCtx, cdmAttributeContextType.addedAttributeIdentity, "_foreignKey", null, false);
            return { attCtx: attCtx };
        }
    },
    {
        matchName: "does.addSupportingAttribute",
        priority: 7,
        overridesBase: true,
        willAdd: (wrtDoc, resAtt, resTrait, directives) => {
            return true;
        },
        attributeAdd: (wrtDoc, resAtt, resTrait, directives) => {
            // get the added attribute and applied trait
            let sub = resTrait.parameterValues.getParameterValue("addedAttribute").value;
            sub = sub.copy(wrtDoc);
            let appliedTrait = resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (typeof (appliedTrait) === "object") {
                appliedTrait = appliedTrait.getObjectDef(wrtDoc);
                // shove new trait onto attribute
                sub.addAppliedTrait(appliedTrait, false); // could be a def or ref or string handed in. this handles it
                let supporting = "(unspecified)";
                if (resAtt)
                    supporting = resAtt.resolvedName;
                sub.setTraitParameterValue(wrtDoc, appliedTrait, "inSupportOf", supporting);
                return { "addedAttribute": sub };
            }
        },
        createContext: (wrtDoc, resAtt, resTrait, attCtx, directives) => {
            // make a new attributeContext to differentiate this supporting att
            attCtx = AttributeContextImpl.createChildUnder(wrtDoc, attCtx, cdmAttributeContextType.addedAttributeSupporting, "supporting_" + resAtt.resolvedName, resAtt.target, false);
            return { attCtx: attCtx };
        }
    },
    {
        matchName: "does.imposeDirectives",
        priority: 1,
        overridesBase: true,
        alterDirectives: (wrtDoc, resTrait, directives) => {
            let allAdded = resTrait.parameterValues.getParameterValue("directives").getValueString(wrtDoc);
            if (allAdded) {
                directives = new Set(directives);
                allAdded.split(',').forEach(d => directives.add(d));
            }
            return directives;
        }
    },
    {
        matchName: "does.removeDirectives",
        priority: 2,
        overridesBase: true,
        alterDirectives: (wrtDoc, resTrait, directives) => {
            let allRemoved = resTrait.parameterValues.getParameterValue("directives").getValueString(wrtDoc);
            if (allRemoved) {
                directives = new Set(directives);
                allRemoved.split(',').forEach(d => {
                    if (directives.has(d))
                        directives.delete(d);
                });
            }
            return directives;
        }
    },
    {
        matchName: "does.selectAttributes",
        priority: 1,
        overridesBase: false,
        alterDirectives: (wrtDoc, resTrait, directives) => {
            let selects = resTrait.parameterValues.getParameterValue("selects").getValueString(wrtDoc);
            if (selects == "one") {
                directives = new Set(directives);
                directives.add("selectOne");
            }
            return directives;
        },
        willAdd: (wrtDoc, resAtt, resTrait, directives) => {
            let selectsOne = directives && directives.has("selectOne");
            let isNorm = directives && directives.has("referenceOnly") && directives.has("isArray") && directives.has("normalized");
            if (selectsOne && !isNorm) {
                // when one class is being pulled from a list of them
                // add the class attribute if the entity is being referenced and a FK will get added
                // or if the entity is 
                //if (!referenceOnly || (referenceOnly && !isArray))
                return true;
            }
            return false;
        },
        attributeAdd: (wrtDoc, resAtt, resTrait, directives) => {
            // get the added attribute and applied trait
            let sub = resTrait.parameterValues.getParameterValue("storeSelectionInAttribute").value;
            let newState = {};
            if (resAtt && resAtt.applierState)
                Object.assign(newState, resAtt.applierState);
            newState.flex_remove = false;
            return { "addedAttribute": sub, applierState: newState };
        },
        createContext: (wrtDoc, resAtt, resTrait, attCtx, directives) => {
            // make a new attributeContext to differentiate this supporting att
            attCtx = AttributeContextImpl.createChildUnder(wrtDoc, attCtx, cdmAttributeContextType.addedAttributeSupporting, "_selectedEntityName", null, false);
            return { attCtx: attCtx };
        }
    },
    {
        matchName: "does.disambiguateNames",
        priority: 6,
        overridesBase: true,
        willApply: (wrtDoc, resAtt, resTrait, directives) => {
            if (resAtt && !directives.has("structured"))
                return true;
            return false;
        },
        attributeApply: (wrtDoc, resAtt, resTrait, directives) => {
            if (resAtt) {
                let format = resTrait.parameterValues.getParameterValue("renameFormat").getValueString(wrtDoc);
                let ordinal = resAtt.applierState && resAtt.applierState.flex_currentOrdinal != undefined ? resAtt.applierState.flex_currentOrdinal.toString() : "";
                if (!format)
                    return { "shouldDelete": false };
                let formatLength = format.length;
                if (formatLength == 0)
                    return { "shouldDelete": false };
                // parse the format looking for positions of {n} and {o} and text chunks around them
                // there are only 5 possibilies
                let iN = format.indexOf("{n}");
                let iO = format.indexOf("{o}");
                let replace = (start, at, length, value) => {
                    let replaced = "";
                    if (at > start)
                        replaced = format.slice(start, at);
                    replaced += value;
                    if (at + 3 < length)
                        replaced += format.slice(at + 3, length);
                    return replaced;
                };
                let result;
                if (iN < 0 && iO < 0) {
                    result = format;
                }
                else if (iN < 0) {
                    result = replace(0, iO, formatLength, ordinal);
                }
                else if (iO < 0) {
                    result = replace(0, iN, formatLength, resAtt.resolvedName);
                }
                else if (iN < iO) {
                    result = replace(0, iN, iO, resAtt.resolvedName);
                    result += replace(iO, iO, formatLength, ordinal);
                }
                else {
                    result = replace(0, iO, iN, ordinal);
                    result += replace(iN, iN, formatLength, resAtt.resolvedName);
                }
                resAtt.resolvedName = result;
            }
            return { "shouldDelete": false };
        }
    },
    {
        matchName: "does.referenceEntityVia",
        priority: 8,
        overridesBase: false,
        attributeRemove: (wrtDoc, resAtt, resTrait, directives) => {
            let refOnly = directives && directives.has("referenceOnly");
            let visible = true;
            if (refOnly && resAtt) {
                // if in reference only mode, then remove everything that isn't marked to retain
                visible = false;
                if (resAtt.applierState && resAtt.applierState.flex_remove === false)
                    visible = true;
            }
            return { "shouldDelete": !visible };
        },
        willAdd: (wrtDoc, resAtt, resTrait, directives) => {
            let isNorm = directives && directives.has("isArray") && directives.has("normalized");
            let refOnly = directives && directives.has("referenceOnly");
            return refOnly && !isNorm;
        },
        attributeAdd: (wrtDoc, resAtt, resTrait, directives) => {
            // get the added attribute and applied trait
            let sub = resTrait.parameterValues.getParameterValue("foreignKeyAttribute").value;
            let newState = {};
            if (resAtt && resAtt.applierState)
                Object.assign(newState, resAtt.applierState);
            newState.flex_remove = false;
            return { "addedAttribute": sub, applierState: newState };
        },
        createContext: (wrtDoc, resAtt, resTrait, attCtx, directives) => {
            // make a new attributeContext to differentiate this supporting att
            let refOnly = directives && directives.has("referenceOnly");
            if (refOnly)
                attCtx = AttributeContextImpl.createChildUnder(wrtDoc, attCtx, cdmAttributeContextType.addedAttributeIdentity, "_foreignKey", null, false);
            return { attCtx: attCtx };
        }
    },
    {
        matchName: "does.explainArray",
        priority: 9,
        overridesBase: false,
        willAdd: (wrtDoc, resAtt, resTrait, directives) => {
            let isNorm = directives.has("referenceOnly") && directives.has("normalized");
            let isArray = directives.has("isArray") && !directives.has("structured");
            return isArray && resAtt && !isNorm ? true : false;
        },
        attributeAdd: (wrtDoc, resAtt, resTrait, directives) => {
            let newAtt;
            let newState = {};
            let continueAdding = false;
            if (resAtt) {
                if (!resAtt.applierState)
                    resAtt.applierState = {};
                Object.assign(newState, resAtt.applierState);
                if (resAtt.applierState.array_finalOrdinal == undefined) {
                    // get the fixed size (not set means no fixed size)
                    let fixedSizeString = resTrait.parameterValues.getParameterValue("maximumExpansion").getValueString(wrtDoc);
                    if (fixedSizeString && fixedSizeString != "undefined") {
                        let fixedSize = Number.parseInt(fixedSizeString);
                        // marks this att as the template for expansion
                        resAtt.applierState.array_template = resAtt;
                        resAtt.applierState.flex_remove = true;
                        // give back the attribute that holds the count first
                        newState.array_finalOrdinal = fixedSize - 1;
                        newAtt = resTrait.parameterValues.getParameterValue("storeCountInAttribute").value;
                        continueAdding = true;
                    }
                }
                else {
                    if (resAtt.applierState.flex_currentOrdinal == undefined) {
                        // first time 
                        newState.flex_currentOrdinal = 0;
                    }
                    else
                        newState.flex_currentOrdinal = resAtt.applierState.flex_currentOrdinal + 1;
                    if (newState.flex_currentOrdinal <= resAtt.applierState.array_finalOrdinal) {
                        newAtt = (resAtt.applierState.array_template).target.copy(wrtDoc);
                        // and get rid of is.array trait
                        newAtt.removeTraitDef(wrtDoc, resTrait.trait);
                        continueAdding = true;
                    }
                    newState.array_finalOrdinal = resAtt.applierState.array_finalOrdinal;
                }
                newState.array_template = resAtt.applierState.array_template;
            }
            return { addedAttribute: newAtt, continueApplying: continueAdding, applierState: newState };
        },
        alterDirectives: (wrtDoc, resTrait, directives) => {
            let isArray = resTrait.parameterValues.getParameterValue("isArray").getValueString(wrtDoc);
            if (isArray == "true") {
                directives = new Set(directives);
                directives.add("isArray");
            }
            return directives;
        },
        attributeRemove: (wrtDoc, resAtt, resTrait, directives) => {
            let isArray = directives.has("isArray") && !directives.has("structured");
            // only remove the template attributes that seeded the array expansion
            let isTemplate = resAtt.applierState && resAtt.applierState.flex_remove;
            return { "shouldDelete": isArray && isTemplate };
        }
    }
];

},{"perf_hooks":1}]},{},[2])(2)
});
