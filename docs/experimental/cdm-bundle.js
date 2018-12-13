(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cdm = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
let isTypeAttribute = (object) => {
    return !("entity" in object);
};
let isAttributeGroupReference = (object) => {
    return "attributeGroupReference" in object;
};
let isEntityAttribute = (object) => {
    return "entity" in object;
};
let isConstantEntity = (object) => {
    return "entityShape" in object;
};
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
var cdmValidationStep;
(function (cdmValidationStep) {
    cdmValidationStep[cdmValidationStep["start"] = 0] = "start";
    cdmValidationStep[cdmValidationStep["imports"] = 1] = "imports";
    cdmValidationStep[cdmValidationStep["integrity"] = 2] = "integrity";
    cdmValidationStep[cdmValidationStep["declarations"] = 3] = "declarations";
    cdmValidationStep[cdmValidationStep["references"] = 4] = "references";
    cdmValidationStep[cdmValidationStep["parameters"] = 5] = "parameters";
    cdmValidationStep[cdmValidationStep["traitAppliers"] = 6] = "traitAppliers";
    cdmValidationStep[cdmValidationStep["minimumForResolving"] = 7] = "minimumForResolving";
    cdmValidationStep[cdmValidationStep["traits"] = 8] = "traits";
    cdmValidationStep[cdmValidationStep["attributes"] = 9] = "attributes";
    cdmValidationStep[cdmValidationStep["entityReferences"] = 10] = "entityReferences";
    cdmValidationStep[cdmValidationStep["finished"] = 11] = "finished";
    cdmValidationStep[cdmValidationStep["error"] = 12] = "error";
})(cdmValidationStep = exports.cdmValidationStep || (exports.cdmValidationStep = {}));
var cdmAttributeContextType;
(function (cdmAttributeContextType) {
    cdmAttributeContextType[cdmAttributeContextType["entity"] = 0] = "entity";
    cdmAttributeContextType[cdmAttributeContextType["entityReferenceExtends"] = 1] = "entityReferenceExtends";
    cdmAttributeContextType[cdmAttributeContextType["attributeDefinition"] = 2] = "attributeDefinition";
    cdmAttributeContextType[cdmAttributeContextType["attributeGroup"] = 3] = "attributeGroup";
    cdmAttributeContextType[cdmAttributeContextType["addedAttributeSupporting"] = 4] = "addedAttributeSupporting";
    cdmAttributeContextType[cdmAttributeContextType["addedAttributeIdentity"] = 5] = "addedAttributeIdentity";
    cdmAttributeContextType[cdmAttributeContextType["passThrough"] = 6] = "passThrough";
})(cdmAttributeContextType = exports.cdmAttributeContextType || (exports.cdmAttributeContextType = {}));
function NewCorpus(rootPath) {
    return new CorpusImpl(rootPath);
}
exports.NewCorpus = NewCorpus;
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
        this.on = false;
    }
    measure(code) {
        if (this.on) {
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
        else
            return code();
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
    constructor(ctx, param, value) {
        //let bodyCode = () =>
        {
            this.parameter = param;
            this.value = value;
            this.ctx = ctx;
        }
        //return p.measure(bodyCode);
    }
    getValueString(resOpt) {
        //let bodyCode = () =>
        {
            if (typeof (this.value) === "string")
                return this.value;
            let value = this.value;
            if (value) {
                // if this is a constant table, then expand into an html table
                let def = value.getObjectDef(resOpt);
                if (value.getObjectType() == cdmObjectType.entityRef && def && def.getObjectType() == cdmObjectType.constantEntityDef) {
                    let entShape = def.getEntityShape();
                    let entValues = def.getConstantValues();
                    if (!entValues && entValues.length == 0)
                        return "";
                    let rows = new Array();
                    let shapeAtts = entShape.getResolvedAttributes(resOpt);
                    for (let r = 0; r < entValues.length; r++) {
                        let rowData = entValues[r];
                        if (rowData && rowData.length) {
                            let row = {};
                            for (let c = 0; c < rowData.length; c++) {
                                let tvalue = rowData[c];
                                row[shapeAtts.set[c].resolvedName] = tvalue;
                            }
                            rows.push(row);
                        }
                    }
                    return JSON.stringify(rows);
                }
                // should be a reference to an object
                let data = value.copyData(resOpt, { stringRefs: false });
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
    setValue(resOpt, newValue) {
        //let bodyCode = () =>
        {
            this.value = ParameterValue.getReplacementValue(resOpt, this.value, newValue, true);
        }
        //return p.measure(bodyCode);
    }
    static getReplacementValue(resOpt, oldValue, newValue, wasSet) {
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
                let oldEnt = ov.getObjectDef(resOpt);
                let newEnt = nv.getObjectDef(resOpt);
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
                // make a set of rows in the old one and add the new ones. this will union the two
                // find rows in the new one that are not in the old one. slow, but these are small usually
                let unionedRows = new Map();
                let l = oldCv.length;
                for (let i = 0; i < l; i++) {
                    let row = oldCv[i];
                    let key = row.reduce((prev, curr) => (prev ? prev : "") + "::" + curr);
                    unionedRows.set(key, row);
                }
                l = newCv.length;
                for (let i = 0; i < l; i++) {
                    let row = newCv[i];
                    let key = row.reduce((prev, curr) => (prev ? prev : "") + "::" + curr);
                    unionedRows.set(key, row);
                }
                if (unionedRows.size == oldCv.length)
                    return nv;
                let allRows = Array.from(unionedRows.values());
                let replacementEnt = oldEnt.copy(resOpt);
                replacementEnt.setConstantValues(allRows);
                return resOpt.wrtDoc.ctx.corpus.MakeRef(cdmObjectType.entityRef, replacementEnt, false);
            }
            return newValue;
        }
        //return p.measure(bodyCode);
    }
    spew(resOpt, to, indent) {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent}${this.name}:${this.getValueString(resOpt)}`);
        }
        //return p.measure(bodyCode);
    }
}
exports.ParameterValue = ParameterValue;
class ParameterValueSet {
    constructor(ctx, pc, values, wasSet) {
        //let bodyCode = () =>
        {
            this.pc = pc;
            this.values = values;
            this.wasSet = wasSet;
            this.ctx = ctx;
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
    getValueString(resOpt, i) {
        //let bodyCode = () =>
        {
            return new ParameterValue(this.ctx, this.pc.sequence[i], this.values[i]).getValueString(resOpt);
        }
        //return p.measure(bodyCode);        
    }
    getParameterValue(pName) {
        //let bodyCode = () =>
        {
            let i = this.pc.getParameterIndex(pName);
            return new ParameterValue(this.ctx, this.pc.sequence[i], this.values[i]);
        }
        //return p.measure(bodyCode);
    }
    setParameterValue(resOpt, pName, value) {
        //let bodyCode = () =>
        {
            let i = this.pc.getParameterIndex(pName);
            this.values[i] = ParameterValue.getReplacementValue(resOpt, this.values[i], value, true);
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let copyValues = this.values.slice(0);
            let copyWasSet = this.wasSet.slice(0);
            let copy = new ParameterValueSet(this.ctx, this.pc, copyValues, copyWasSet);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    spew(resOpt, to, indent) {
        //let bodyCode = () =>
        {
            let l = this.length;
            for (let i = 0; i < l; i++) {
                let pv = new ParameterValue(this.ctx, this.pc.sequence[i], this.values[i]);
                pv.spew(resOpt, to, indent + '-');
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
            if (pc && pc.sequence && pc.sequence.length)
                this.parameterValues = new ParameterValueSet(trait.ctx, pc, values, wasSet);
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
    spew(resOpt, to, indent) {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent}[${this.traitName}]`);
            if (this.parameterValues)
                this.parameterValues.spew(resOpt, to, indent + '-');
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            if (this.parameterValues) {
                let copyParamValues = this.parameterValues.copy();
                return new ResolvedTrait(this.trait, copyParamValues.pc, copyParamValues.values, copyParamValues.wasSet);
            }
            return new ResolvedTrait(this.trait, undefined, undefined, undefined);
        }
        //return p.measure(bodyCode);
    }
    collectTraitNames(resOpt, into) {
        //let bodyCode = () =>
        {
            // get the name of this trait and all of its base classes
            let t = this.trait;
            while (t) {
                let name = t.getName();
                if (!into.has(name))
                    into.add(name);
                let baseRef = t.getExtendsTrait();
                t = baseRef ? baseRef.getObjectDef(resOpt) : null;
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
exports.refCounted = refCounted;
class TraitDirectiveSet {
    constructor(set) {
        if (set)
            this.set = new Set(set);
    }
    copy() {
        let result = new TraitDirectiveSet();
        if (this.set)
            result.set = new Set(this.set);
        if (this.setRemoved)
            result.setRemoved = new Set(this.setRemoved);
        result.sortedTag = this.sortedTag;
        return result;
    }
    has(directive) {
        if (this.set)
            return this.set.has(directive);
        return false;
    }
    add(directive) {
        if (!this.set)
            this.set = new Set();
        // once explicitly removed from a set, never put it back.
        if (this.setRemoved && this.setRemoved.has(directive))
            return;
        this.set.add(directive);
        this.sortedTag = undefined;
    }
    delete(directive) {
        if (!this.setRemoved)
            this.setRemoved = new Set();
        this.setRemoved.add(directive);
        if (this.set) {
            if (this.set.has(directive))
                this.set.delete(directive);
        }
        this.sortedTag = undefined;
    }
    merge(directives) {
        if (directives) {
            if (directives.setRemoved) {
                // copy over the removed list first
                directives.setRemoved.forEach((d) => {
                    this.delete(d);
                });
            }
            if (directives.set)
                directives.set.forEach((d) => this.add(d));
            this.sortedTag = undefined;
        }
    }
    getTag() {
        if (this.sortedTag == undefined) {
            if (this.set && this.set.size) {
                this.sortedTag = "";
                let sorted = Array.from(this.set).sort();
                sorted.forEach(d => {
                    this.sortedTag += "-" + d;
                });
            }
        }
        if (this.sortedTag)
            return this.sortedTag;
        return "";
    }
}
exports.TraitDirectiveSet = TraitDirectiveSet;
class ResolvedTraitSet {
    constructor(resOpt) {
        //let bodyCode = () =>
        {
            this.resOpt = cdmObject.copyResolveOptions(resOpt);
            this.set = new Array();
            this.lookupByTrait = new Map();
            this.hasElevated = false;
        }
        //return p.measure(bodyCode);
    }
    measureAppliers(trait) {
        //let bodyCode = () =>
        {
            let newAppliers = trait.getTraitAppliers();
            if (newAppliers) {
                if (!this.applierCaps)
                    this.applierCaps = { canAlterDirectives: false, canAttributeAdd: false, canRemove: false, canAttributeModify: false, canCreateContext: false, canGroupAdd: false, canRoundAdd: false };
                for (const applier of newAppliers) {
                    if (applier.willAlterDirectives && applier.doAlterDirectives)
                        this.applierCaps.canAlterDirectives = true;
                    if (applier.willRemove)
                        this.applierCaps.canRemove = true;
                    if (applier.willCreateContext && applier.doCreateContext)
                        this.applierCaps.canCreateContext = true;
                    if (applier.willAttributeModify && applier.doAttributeModify)
                        this.applierCaps.canAttributeModify = true;
                    if (applier.willGroupAdd && applier.doGroupAdd)
                        this.applierCaps.canGroupAdd = true;
                    if (applier.willRoundAdd && applier.doRoundAdd)
                        this.applierCaps.canRoundAdd = true;
                    if (applier.willAttributeAdd && applier.doAttributeAdd)
                        this.applierCaps.canAttributeAdd = true;
                }
            }
            //return p.measure(bodyCode);
        }
    }
    copyApplierCapabilities(caps) {
        //let bodyCode = () =>
        {
            this.applierCaps = { canAlterDirectives: caps.canAlterDirectives, canAttributeAdd: caps.canAttributeAdd, canRemove: caps.canRemove,
                canAttributeModify: caps.canAttributeModify, canCreateContext: caps.canCreateContext,
                canGroupAdd: caps.canGroupAdd, canRoundAdd: caps.canRoundAdd };
        }
        //return p.measure(bodyCode);
    }
    merge(toMerge, copyOnWrite) {
        //let bodyCode = () =>
        {
            let traitSetResult = this;
            let trait = toMerge.trait;
            let av;
            let wasSet;
            if (toMerge.parameterValues) {
                av = toMerge.parameterValues.values;
                wasSet = toMerge.parameterValues.wasSet;
            }
            if (!this.hasElevated)
                this.hasElevated = trait.elevated;
            this.measureAppliers(trait);
            if (traitSetResult.lookupByTrait.has(trait)) {
                let rtOld = traitSetResult.lookupByTrait.get(trait);
                let avOld;
                if (rtOld.parameterValues)
                    avOld = rtOld.parameterValues.values;
                if (av && avOld) {
                    // the new values take precedence
                    let l = av.length;
                    for (let i = 0; i < l; i++) {
                        if (av[i] != avOld[i]) {
                            if (copyOnWrite) {
                                traitSetResult = traitSetResult.shallowCopyWithException(trait);
                                rtOld = traitSetResult.lookupByTrait.get(trait);
                                avOld = rtOld.parameterValues.values;
                                copyOnWrite = false;
                            }
                            avOld[i] = ParameterValue.getReplacementValue(this.resOpt, avOld[i], av[i], wasSet[i]);
                        }
                    }
                }
            }
            else {
                if (copyOnWrite)
                    traitSetResult = traitSetResult.shallowCopy();
                toMerge = toMerge.copy();
                traitSetResult.set.push(toMerge);
                traitSetResult.lookupByTrait.set(trait, toMerge);
            }
            return traitSetResult;
        }
        //return p.measure(bodyCode);
    }
    mergeSet(toMerge, elevatedOnly = false) {
        //let bodyCode = () =>
        {
            let copyOnWrite = true;
            let traitSetResult = this;
            if (toMerge) {
                let l = toMerge.set.length;
                for (let i = 0; i < l; i++) {
                    const rt = toMerge.set[i];
                    if (!elevatedOnly || rt.trait.elevated) {
                        let traitSetMerge = traitSetResult.merge(rt, copyOnWrite);
                        if (traitSetMerge !== traitSetResult) {
                            traitSetResult = traitSetMerge;
                            copyOnWrite = false;
                        }
                    }
                }
                if (toMerge.resOpt.directives) {
                    if (!traitSetResult.resOpt.directives)
                        traitSetResult.resOpt.directives = new TraitDirectiveSet();
                    traitSetResult.resOpt.directives.merge(toMerge.resOpt.directives);
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
    find(resOpt, traitName) {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const rt = this.set[i];
                if (rt.trait.isDerivedFrom(resOpt, traitName))
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
            let copy = new ResolvedTraitSet(this.resOpt);
            let newSet = copy.set;
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                let rt = this.set[i];
                rt = rt.copy();
                newSet.push(rt);
                copy.lookupByTrait.set(rt.trait, rt);
            }
            if (this.applierCaps)
                copy.copyApplierCapabilities(this.applierCaps);
            copy.hasElevated = this.hasElevated;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    shallowCopyWithException(just) {
        //let bodyCode = () =>
        {
            let copy = new ResolvedTraitSet(this.resOpt);
            let newSet = copy.set;
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                let rt = this.set[i];
                if (rt.trait == just)
                    rt = rt.copy();
                newSet.push(rt);
                copy.lookupByTrait.set(rt.trait, rt);
            }
            if (this.applierCaps)
                copy.copyApplierCapabilities(this.applierCaps);
            copy.hasElevated = this.hasElevated;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    shallowCopy() {
        //let bodyCode = () =>
        {
            let copy = new ResolvedTraitSet(this.resOpt);
            if (this.set) {
                let newSet = copy.set;
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    let rt = this.set[i];
                    newSet.push(rt);
                    copy.lookupByTrait.set(rt.trait, rt);
                }
            }
            if (this.applierCaps)
                copy.copyApplierCapabilities(this.applierCaps);
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
                    rt.collectTraitNames(this.resOpt, collection);
                }
            }
            return collection;
        }
        //return p.measure(bodyCode);
    }
    setParameterValueFromArgument(trait, arg) {
        //let bodyCode = () =>
        {
            let resTrait = this.get(trait);
            if (resTrait && resTrait.parameterValues) {
                let av = resTrait.parameterValues.values;
                let newVal = arg.getValue();
                // get the value index from the parameter collection given the parameter that this argument is setting
                let iParam = resTrait.parameterValues.indexOf(arg.getParameterDef());
                av[iParam] = ParameterValue.getReplacementValue(this.resOpt, av[iParam], newVal, true);
                resTrait.parameterValues.wasSet[iParam] = true;
            }
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(resOpt, toTrait, paramName, value) {
        //let bodyCode = () =>
        {
            let altered = this.shallowCopyWithException(toTrait);
            altered.get(toTrait).parameterValues.setParameterValue(this.resOpt, paramName, value);
            return altered;
        }
        //return p.measure(bodyCode);
    }
    replaceTraitParameterValue(resOpt, toTrait, paramName, valueWhen, valueNew) {
        //let bodyCode = () =>
        {
            let traitSetResult = this;
            let l = traitSetResult.set.length;
            for (let i = 0; i < l; i++) {
                let rt = traitSetResult.set[i];
                if (rt.trait.isDerivedFrom(this.resOpt, toTrait)) {
                    if (rt.parameterValues) {
                        let pc = rt.parameterValues.pc;
                        let av = rt.parameterValues.values;
                        let idx = pc.getParameterIndex(paramName);
                        if (idx != undefined) {
                            if (av[idx] === valueWhen) {
                                // copy the set and make a deep copy of the trait being set
                                traitSetResult = this.shallowCopyWithException(rt.trait);
                                // assume these are all still true for this copy
                                rt = traitSetResult.set[i];
                                av = rt.parameterValues.values;
                                av[idx] = ParameterValue.getReplacementValue(this.resOpt, av[idx], valueNew, true);
                                break;
                            }
                        }
                    }
                }
            }
            return traitSetResult;
        }
        //return p.measure(bodyCode);
    }
    collectDirectives(directives) {
        //let bodyCode = () =>
        {
            // some traits may actually add directives to the set.
            if (this.set && this.applierCaps && this.applierCaps.canAlterDirectives) {
                if (!this.resOpt.directives)
                    this.resOpt.directives = new TraitDirectiveSet();
                this.resOpt.directives.merge(directives);
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    const rt = this.set[i];
                    if (rt.trait.modifiesAttributes) {
                        let traitAppliers = rt.trait.getTraitAppliers();
                        if (traitAppliers) {
                            let l = traitAppliers.length;
                            for (let ita = 0; ita < l; ita++) {
                                const apl = traitAppliers[ita];
                                if (apl.willAlterDirectives && apl.willAlterDirectives(this.resOpt, rt))
                                    apl.doAlterDirectives(this.resOpt, rt);
                            }
                        }
                    }
                }
            }
            //return p.measure(bodyCode);
        }
    }
    spew(resOpt, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            let list = this.set;
            if (nameSort)
                list = list.sort((l, r) => l.traitName.localeCompare(r.traitName));
            for (let i = 0; i < l; i++) {
                // comment this line to simplify spew results to stop at attribute names
                list[i].spew(resOpt, to, indent);
            }
            ;
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedTraitSet = ResolvedTraitSet;
class ResolvedTraitSetBuilder {
    //resOpt: resolveOptions;
    clear() {
        //let bodyCode = () =>
        {
            this.rts = null;
        }
        //return p.measure(bodyCode);
    }
    mergeTraits(rtsNew) {
        //let bodyCode = () =>
        {
            if (rtsNew) {
                if (!this.rts)
                    this.rts = new ResolvedTraitSet(rtsNew.resOpt);
                this.rts = this.rts.mergeSet(rtsNew);
            }
        }
        //return p.measure(bodyCode);
    }
    takeReference(rtsNew) {
        //let bodyCode = () =>
        {
            this.rts = rtsNew;
        }
        //return p.measure(bodyCode);
    }
    ownOne(rt, resOpt) {
        //let bodyCode = () =>
        {
            this.rts = new ResolvedTraitSet(resOpt);
            this.rts.merge(rt, false);
        }
        //return p.measure(bodyCode);
    }
    setTraitParameterValue(resOpt, toTrait, paramName, value) {
        //let bodyCode = () =>
        {
            this.rts = this.rts.setTraitParameterValue(resOpt, toTrait, paramName, value);
        }
        //return p.measure(bodyCode);
    }
    replaceTraitParameterValue(resOpt, toTrait, paramName, valueWhen, valueNew) {
        //let bodyCode = () =>
        {
            if (this.rts)
                this.rts = this.rts.replaceTraitParameterValue(resOpt, toTrait, paramName, valueWhen, valueNew);
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedTraitSetBuilder = ResolvedTraitSetBuilder;
class ResolvedAttribute {
    constructor(resOpt, target, defaultName, createdContextId) {
        //let bodyCode = () =>
        {
            this.target = target;
            this.resolvedTraits = new ResolvedTraitSet(resOpt);
            this.resolvedName = defaultName;
            this.createdContextId = createdContextId;
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let resOpt = this.resolvedTraits.resOpt; // use the options from the traits
            let copy = new ResolvedAttribute(resOpt, this.target, this.resolvedName, this.createdContextId);
            copy.resolvedTraits = this.resolvedTraits.shallowCopy();
            copy.insertOrder = this.insertOrder;
            if (this.applierState) {
                copy.applierState = {};
                Object.assign(copy.applierState, this.applierState);
            }
            return copy;
        }
        //return p.measure(bodyCode);
    }
    spew(resOpt, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent}[${this.resolvedName}]`);
            this.resolvedTraits.spew(resOpt, to, indent + '-', nameSort);
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
        this.t2pm.initForResolvedAttribute(this.target.ctx, this.resolvedTraits);
        return this.t2pm;
    }
}
exports.ResolvedAttribute = ResolvedAttribute;
class ResolvedAttributeSet extends refCounted {
    constructor() {
        super();
        //let bodyCode = () =>
        {
            this.resolvedName2resolvedAttribute = new Map();
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
                        existing.resolvedTraits = rtsMerge;
                    }
                }
                else {
                    if (this.refCnt > 1)
                        rasResult = rasResult.copy(); // copy on write
                    rasResult.resolvedName2resolvedAttribute.set(toMerge.resolvedName, toMerge);
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
    applyTraits(traits, actions) {
        //let bodyCode = () =>
        {
            let rasResult = this;
            let rasApplied;
            if (this.refCnt > 1 && rasResult.copyNeeded(traits, actions)) {
                rasResult = rasResult.copy();
            }
            rasApplied = rasResult.apply(traits, actions);
            // now we are that
            rasResult.resolvedName2resolvedAttribute = rasApplied.resolvedName2resolvedAttribute;
            rasResult.baseTrait2Attributes = null;
            rasResult.set = rasApplied.set;
            return rasResult;
        }
        //return p.measure(bodyCode);
    }
    copyNeeded(traits, actions) {
        //let bodyCode = () =>
        {
            if (!actions || actions.length == 0)
                return false;
            // for every attribute in the set, detect if a merge of traits will alter the traits. if so, need to copy the attribute set to avoid overwrite 
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const resAtt = this.set[i];
                for (const traitAction of actions) {
                    let ctx = { resOpt: traits.resOpt, resAttSource: resAtt, resTrait: traitAction.rt };
                    if (traitAction.applier.willAttributeModify(ctx))
                        return true;
                }
            }
            return false;
        }
        //return p.measure(bodyCode);
    }
    apply(traits, actions) {
        //let bodyCode = () =>
        {
            if (!traits && actions.length == 0) {
                // nothing can change
                return this;
            }
            // for every attribute in the set run any attribute appliers
            let appliedAttSet = new ResolvedAttributeSet();
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const resAtt = this.set[i];
                let subSet = resAtt.target;
                if (subSet.set) {
                    // the set contains another set. process those
                    resAtt.target = subSet.apply(traits, actions);
                }
                else {
                    let rtsMerge = resAtt.resolvedTraits.mergeSet(traits);
                    resAtt.resolvedTraits = rtsMerge;
                    if (actions) {
                        for (const traitAction of actions) {
                            let ctx = { resOpt: traits.resOpt, resAttSource: resAtt, resTrait: traitAction.rt };
                            if (traitAction.applier.willAttributeModify(ctx))
                                traitAction.applier.doAttributeModify(ctx);
                        }
                    }
                }
                appliedAttSet.merge(resAtt);
            }
            return appliedAttSet;
        }
        //return p.measure(bodyCode);
    }
    removeRequestedAtts(marker) {
        //let bodyCode = () =>
        {
            // the marker tracks the track the deletes 'under' a certain index
            let countIndex = marker["0"];
            let markIndex = marker["1"];
            // for every attribute in the set run any attribute removers on the traits they have
            let appliedAttSet;
            let l = this.set.length;
            for (let iAtt = 0; iAtt < l; iAtt++) {
                let resAtt = this.set[iAtt];
                // possible for another set to be in this set
                let subSet = resAtt.target;
                if (subSet.set) {
                    // well, that happened. so now we go around again on this same function and get rid of things from this group
                    marker["0"] = countIndex;
                    marker["1"] = markIndex;
                    let newSubSet = subSet.removeRequestedAtts(marker);
                    countIndex = marker["0"];
                    markIndex = marker["1"];
                    // replace the set with the new one that came back
                    resAtt.target = newSubSet;
                    // if everything went away, then remove this group
                    if (!newSubSet || !newSubSet.set || newSubSet.set.length == 0) {
                        resAtt = null;
                    }
                    else {
                        // don't count this as an attribute (later)
                        countIndex--;
                    }
                }
                else {
                    if (resAtt.resolvedTraits && resAtt.resolvedTraits.applierCaps && resAtt.resolvedTraits.applierCaps.canRemove) {
                        let l = resAtt.resolvedTraits.size;
                        for (let i = 0; resAtt && i < l; i++) {
                            const rt = resAtt.resolvedTraits.set[i];
                            if (resAtt && rt.trait.modifiesAttributes) {
                                let ctx = { resOpt: resAtt.resolvedTraits.resOpt, resAttSource: resAtt, resTrait: rt };
                                let traitAppliers = rt.trait.getTraitAppliers();
                                if (traitAppliers) {
                                    let l = traitAppliers.length;
                                    for (let ita = 0; ita < l; ita++) {
                                        const apl = traitAppliers[ita];
                                        if (resAtt && apl.willRemove) {
                                            if (apl.willRemove(ctx)) {
                                                // this makes all the loops stop
                                                resAtt = null;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (resAtt) {
                    // attribute remains
                    // are we building a new set?
                    if (appliedAttSet)
                        appliedAttSet.merge(resAtt);
                    countIndex++;
                }
                else {
                    // remove the att
                    // if this is the first removed attribute, then make a copy of the set now
                    // after this point, the rest of the loop logic keeps the copy going as needed
                    if (!appliedAttSet) {
                        appliedAttSet = new ResolvedAttributeSet();
                        for (let iCopy = 0; iCopy < iAtt; iCopy++)
                            appliedAttSet.merge(this.set[iCopy]);
                    }
                    // track deletes under the mark (move the mark up)
                    if (countIndex < markIndex)
                        markIndex--;
                }
            }
            marker["0"] = countIndex;
            marker["1"] = markIndex;
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
    getAttributesWithTraits(resOpt, queryFor) {
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
                            let pvals = ra.resolvedTraits.find(resOpt, q.traitBaseName).parameterValues;
                            // compare to all query params
                            let lParams = q.params.length;
                            let iParam;
                            for (iParam = 0; iParam < lParams; iParam++) {
                                const param = q.params[i];
                                let pv = pvals.getParameterValue(param.paramName);
                                if (!pv || pv.getValueString(resOpt) != param.paramValue)
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
                let rasResult = new ResolvedAttributeSet();
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
            let raFound = this.resolvedName2resolvedAttribute.get(name);
            if (raFound)
                return raFound;
            if (this.set && this.set.length) {
                // deeper look. first see if there are any groups held in this group
                for (const ra of this.set) {
                    if (ra.target.set) {
                        raFound = ra.target.get(name);
                        if (raFound)
                            return raFound;
                    }
                }
                // nothing found that way, so now look through the attribute definitions for a match
                for (const ra of this.set) {
                    let attLook = ra.target;
                    if (attLook.getName && attLook.getName() === name) {
                        return ra;
                    }
                }
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    get size() {
        return this.resolvedName2resolvedAttribute.size;
    }
    copy() {
        //let bodyCode = () =>
        {
            let copy = new ResolvedAttributeSet();
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                copy.merge(this.set[i].copy());
            }
            return copy;
        }
        //return p.measure(bodyCode);
    }
    spew(resOpt, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            if (l > 0) {
                let list = this.set;
                if (nameSort)
                    list = list.sort((l, r) => l.resolvedName.localeCompare(r.resolvedName));
                for (let i = 0; i < l; i++) {
                    list[i].spew(resOpt, to, indent, nameSort);
                }
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedAttributeSet = ResolvedAttributeSet;
class ResolvedAttributeSetBuilder {
    constructor() {
    }
    setAttributeContext(under) {
        this.attributeContext = under;
    }
    createAttributeContext(resOpt, acp) {
        //let bodyCode = () =>
        {
            if (!acp)
                return undefined;
            this.attributeContext = AttributeContextImpl.createChildUnder(resOpt, acp);
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
            this.takeReference(new ResolvedAttributeSet());
            this.ras.merge(ra);
        }
        //return p.measure(bodyCode);
    }
    prepareForTraitApplication(traits) {
        //let bodyCode = () =>
        {
            // collect a set of appliers for all traits
            this.traitsToApply = traits;
            if (traits && traits.applierCaps) {
                this.actionsModify = new Array();
                this.actionsGroupAdd = new Array();
                this.actionsRoundAdd = new Array();
                this.actionsAttributeAdd = new Array();
                let l = traits.size;
                for (let i = 0; i < l; i++) {
                    const rt = traits.set[i];
                    if (rt.trait.modifiesAttributes) {
                        let traitAppliers = rt.trait.getTraitAppliers();
                        if (traitAppliers) {
                            let l = traitAppliers.length;
                            for (let ita = 0; ita < l; ita++) {
                                // collect the code that will perform the right action. associate with the resolved trait and get the priority
                                const apl = traitAppliers[ita];
                                let action;
                                if (apl.willAttributeModify && apl.doAttributeModify) {
                                    action = { rt: rt, applier: apl };
                                    this.actionsModify.push(action);
                                }
                                if (apl.willAttributeAdd && apl.doAttributeAdd) {
                                    action = { rt: rt, applier: apl };
                                    this.actionsAttributeAdd.push(action);
                                }
                                if (apl.willGroupAdd && apl.doGroupAdd) {
                                    action = { rt: rt, applier: apl };
                                    this.actionsGroupAdd.push(action);
                                }
                                if (apl.willRoundAdd && apl.doRoundAdd) {
                                    action = { rt: rt, applier: apl };
                                    this.actionsRoundAdd.push(action);
                                }
                            }
                        }
                    }
                }
                // sorted by priority
                this.actionsModify = this.actionsModify.sort((l, r) => l.applier.priority - r.applier.priority);
                this.actionsGroupAdd = this.actionsGroupAdd.sort((l, r) => l.applier.priority - r.applier.priority);
                this.actionsRoundAdd = this.actionsRoundAdd.sort((l, r) => l.applier.priority - r.applier.priority);
                this.actionsAttributeAdd = this.actionsAttributeAdd.sort((l, r) => l.applier.priority - r.applier.priority);
            }
        }
        //return p.measure(bodyCode);
    }
    getTraitGeneratedAttributes(clearState, applyModifiers) {
        //let bodyCode = () =>
        {
            if (!this.ras || !this.ras.set)
                return undefined;
            if (!this.traitsToApply || !this.traitsToApply.applierCaps)
                return undefined;
            let caps = this.traitsToApply.applierCaps;
            if (!(caps.canAttributeAdd || caps.canGroupAdd || caps.canRoundAdd))
                return undefined;
            let resAttOut = new Array();
            // this function constructs a 'plan' for building up the resolved attributes that get generated from a set of traits being applied to 
            // a set of attributes. it manifests the plan into an array of resolved attributes
            // there are a few levels of hierarchy to consider.
            // 1. once per set of attributes, the traits may want to generate attributes. this is an attribute that is somehow descriptive of the whole set, 
            //    even if it has repeating patterns, like the count for an expanded array.
            // 2. it is possible that some traits (like the array exander) want to keep generating new attributes for some run. each time they do this is considered a 'round'
            //    the traits are given a chance to generate attributes once per round. every set gets at least one round, so these should be the attributes that 
            //    describe the set of other attributes. for example, the foreign key of a relationship or the 'class' of a polymorphic type, etc.
            // 3. for each round, there are new attributes created based on the resolved attributes from the previous round (or the starting atts for this set)
            //    the previous round attribute need to be 'done' having traits applied before they are used as sources for the current round.
            // the goal here is to process each attribute completely before moving on to the next one
            // that may need to start out clean
            if (clearState) {
                let toClear = this.ras.set;
                let l = toClear.length;
                for (let i = 0; i < l; i++) {
                    toClear[i].applierState = undefined;
                }
            }
            let makeResolvedAttribute = (resAttSource, action, queryAdd, doAdd) => {
                let appCtx = { resOpt: this.traitsToApply.resOpt, attCtx: this.attributeContext, resAttSource: resAttSource, resTrait: action.rt };
                if (resAttSource && resAttSource.target && resAttSource.target.set)
                    return appCtx; // makes no sense for a group
                // will something add?
                if (queryAdd(appCtx)) {
                    // may want to make a new attribute group
                    if (this.attributeContext && action.applier.willCreateContext && action.applier.willCreateContext(appCtx))
                        action.applier.doCreateContext(appCtx);
                    // make a new resolved attribute as a place to hold results
                    appCtx.resAttNew = new ResolvedAttribute(appCtx.resOpt, undefined, undefined, appCtx.attCtx ? appCtx.attCtx.ID : -1);
                    // copy state from source
                    appCtx.resAttNew.applierState = {};
                    if (resAttSource && resAttSource.applierState)
                        Object.assign(appCtx.resAttNew.applierState, resAttSource.applierState);
                    // if applying traits, then add the sets traits as a staring point
                    if (applyModifiers) {
                        appCtx.resAttNew.resolvedTraits = this.traitsToApply.deepCopy();
                        appCtx.resAttNew.resolvedTraits.collectDirectives(undefined);
                    }
                    // make it
                    doAdd(appCtx);
                    if (applyModifiers) {
                        // add the sets traits back in to this newly added one
                        appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.mergeSet(this.traitsToApply);
                        appCtx.resAttNew.resolvedTraits.collectDirectives(undefined);
                        // do all of the modify traits
                        if (caps.canAttributeModify)
                            // modify acts on the source and we should be done with it
                            appCtx.resAttSource = appCtx.resAttNew;
                        for (const modAct of this.actionsModify) {
                            // using a new trait now
                            appCtx.resTrait = modAct.rt;
                            if (modAct.applier.willAttributeModify(appCtx))
                                modAct.applier.doAttributeModify(appCtx);
                        }
                    }
                }
                return appCtx;
            };
            // get the one time atts
            if (caps.canGroupAdd) {
                for (const action of this.actionsGroupAdd) {
                    let appCtx = makeResolvedAttribute(undefined, action, action.applier.willGroupAdd, action.applier.doGroupAdd);
                    // save it
                    if (appCtx && appCtx.resAttNew)
                        resAttOut.push(appCtx.resAttNew);
                }
            }
            // now starts a repeating pattern of rounds
            // first step is to get attribute that are descriptions of the round. 
            // do this once and then use them as the first entries in the first set of 'previous' atts for the loop
            let resAttsLastRound = new Array();
            if (caps.canRoundAdd) {
                for (const action of this.actionsRoundAdd) {
                    let appCtx = makeResolvedAttribute(undefined, action, action.applier.willRoundAdd, action.applier.doRoundAdd);
                    // save it
                    if (appCtx && appCtx.resAttNew) {
                        // overall list
                        resAttOut.push(appCtx.resAttNew);
                        // previous list
                        resAttsLastRound.push(appCtx.resAttNew);
                    }
                }
            }
            // the first per-round set of attributes is the set owned by this object
            resAttsLastRound = resAttsLastRound.concat(this.ras.set);
            // now loop over all of the previous atts until they all say 'stop'
            if (resAttsLastRound.length) {
                let continues = 0;
                do {
                    continues = 0;
                    let resAttThisRound = new Array();
                    if (caps.canAttributeAdd) {
                        for (let iAtt = 0; iAtt < resAttsLastRound.length; iAtt++) {
                            for (const action of this.actionsAttributeAdd) {
                                let appCtx = makeResolvedAttribute(resAttsLastRound[iAtt], action, action.applier.willAttributeAdd, action.applier.doAttributeAdd);
                                // save it
                                if (appCtx && appCtx.resAttNew) {
                                    // overall list
                                    resAttOut.push(appCtx.resAttNew);
                                    resAttThisRound.push(appCtx.resAttNew);
                                    if (appCtx.continue)
                                        continues++;
                                }
                            }
                        }
                    }
                    resAttsLastRound = resAttThisRound;
                } while (continues);
            }
            return resAttOut;
        }
        //return p.measure(bodyCode);
    }
    applyTraits() {
        //let bodyCode = () =>
        {
            if (this.ras && this.traitsToApply)
                this.takeReference(this.ras.applyTraits(this.traitsToApply, this.actionsModify));
        }
        //return p.measure(bodyCode);
    }
    generateTraitAttributes(applyTraitsToNew) {
        //let bodyCode = () =>
        {
            if (!this.traitsToApply || !this.traitsToApply.applierCaps)
                return;
            if (!this.ras)
                this.takeReference(new ResolvedAttributeSet());
            // get the new atts and then add them one at a time into this set
            let newAtts = this.getTraitGeneratedAttributes(true, applyTraitsToNew);
            if (newAtts) {
                let l = newAtts.length;
                let ras = this.ras;
                for (let i = 0; i < l; i++) {
                    ras = ras.merge(newAtts[i]);
                }
                this.takeReference(ras);
            }
        }
        //return p.measure(bodyCode);
    }
    removeRequestedAtts() {
        //let bodyCode = () =>
        {
            if (this.ras) {
                let marker = [0, 0];
                marker["1"] = this.inheritedMark;
                this.takeReference(this.ras.removeRequestedAtts(marker));
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
exports.ResolvedAttributeSetBuilder = ResolvedAttributeSetBuilder;
class ResolvedEntityReferenceSide {
    constructor(entity, rasb) {
        //let bodyCode = () =>
        {
            if (entity)
                this.entity = entity;
            if (rasb)
                this.rasb = rasb;
            else
                this.rasb = new ResolvedAttributeSetBuilder();
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
    spew(resOpt, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent} ent=${this.entity.getName()}`);
            if (this.rasb && this.rasb.ras)
                this.rasb.ras.spew(resOpt, to, indent + '  atts:', nameSort);
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntityReferenceSide = ResolvedEntityReferenceSide;
class ResolvedEntityReference {
    constructor() {
        //let bodyCode = () =>
        {
            this.referencing = new ResolvedEntityReferenceSide();
            this.referenced = new Array();
        }
        //return p.measure(bodyCode);
    }
    copy() {
        //let bodyCode = () =>
        {
            let result = new ResolvedEntityReference();
            result.referencing.entity = this.referencing.entity;
            result.referencing.rasb = this.referencing.rasb;
            this.referenced.forEach(rers => {
                result.referenced.push(new ResolvedEntityReferenceSide(rers.entity, rers.rasb));
            });
            return result;
        }
        //return p.measure(bodyCode);
    }
    spew(resOpt, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            this.referencing.spew(resOpt, to, indent + "(referencing)", nameSort);
            let list = this.referenced;
            if (nameSort)
                list = list.sort((l, r) => l.entity.getName().localeCompare(r.entity.getName()));
            for (let i = 0; i < this.referenced.length; i++) {
                list[i].spew(resOpt, to, indent + `(referenced[${i}])`, nameSort);
            }
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntityReference = ResolvedEntityReference;
class ResolvedEntity {
    constructor(resOpt, entDef) {
        this.entity = entDef;
        this.resolvedName = this.entity.getName();
        this.resolvedTraits = this.entity.getResolvedTraits(resOpt);
        this.resolvedAttributes = this.entity.getResolvedAttributes(resOpt);
        this.resolvedEntityReferences = this.entity.getResolvedEntityReferences(resOpt);
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
        this.t2pm.initForResolvedEntity(this.entity.ctx, this.resolvedTraits);
        return this.t2pm;
    }
    spew(resOpt, to, indent, nameSort) {
        //let bodyCode = () =>
        {
            to.spewLine(indent + "=====ENTITY=====");
            to.spewLine(indent + this.resolvedName);
            to.spewLine(indent + "================");
            to.spewLine(indent + "traits:");
            this.resolvedTraits.spew(resOpt, to, indent + " ", nameSort);
            to.spewLine("attributes:");
            this.resolvedAttributes.spew(resOpt, to, indent + " ", nameSort);
            to.spewLine("relationships:");
            this.resolvedEntityReferences.spew(resOpt, to, indent + " ", nameSort);
        }
        //return p.measure(bodyCode);
    }
}
exports.ResolvedEntity = ResolvedEntity;
class ResolvedEntityReferenceSet {
    constructor(resOpt, set = undefined) {
        //let bodyCode = () =>
        {
            this.resOpt = resOpt;
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
            return new ResolvedEntityReferenceSet(this.resOpt, newSet);
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
            return new ResolvedEntityReferenceSet(this.resOpt, filter);
        }
        //return p.measure(bodyCode);
    }
    spew(resOpt, to, indent, nameSort) {
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
                list[i].spew(resOpt, to, indent + `(rer[${i}])`, nameSort);
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
    initForEntityDef(ctx, persistedObject, host) {
        //let bodyCode = () =>
        {
            this.ctx = ctx;
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
    initForResolvedEntity(ctx, rtsEnt) {
        this.hostRtsEnt = rtsEnt;
        this.traits = rtsEnt.set;
        this.ctx = ctx;
    }
    initForTypeAttributeDef(ctx, persistedObject, host) {
        //let bodyCode = () =>
        {
            this.ctx = ctx;
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
    initForResolvedAttribute(ctx, rtsAtt) {
        this.hostRtsAtt = rtsAtt;
        this.traits = rtsAtt.set;
        this.ctx = ctx;
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
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.description) {
                                let cEnt = this.getTraitTable("is.localized.describedAs", "localizedDisplayText");
                                if (cEnt.getConstantValues().length == 1)
                                    removedIndexes.push(i);
                            }
                            break;
                        case "is.localized.displayedAs":
                            persistedObject.displayName = this.getLocalizedTraitTable("is.localized.displayedAs");
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.displayName) {
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
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.description) {
                                let cEnt = this.getTraitTable("is.localized.describedAs", "localizedDisplayText");
                                if (cEnt.getConstantValues().length == 1)
                                    removedIndexes.push(i);
                            }
                            break;
                        case "is.localized.displayedAs":
                            persistedObject.displayName = this.getLocalizedTraitTable("is.localized.displayedAs");
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.displayName) {
                                let cEnt = this.getTraitTable("is.localized.displayedAs", "localizedDisplayText");
                                if (cEnt.getConstantValues().length == 1)
                                    removedIndexes.push(i);
                            }
                            break;
                        case "is.identifiedBy":
                            let ib = getTraitRefArgumentValue(this.traits[i], "attribute");
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
                    this.getTrait("is.dataFormat.numeric.shaped", true, true);
                    break;
            }
        }
        //return p.measure(bodyCode);
    }
    traitsToDataFormat(removeFrom, removedIndexes) {
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
                    if (removedIndexes)
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
                trait = this.ctx.corpus.MakeObject(cdmObjectType.traitRef, traitName);
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
                let cEnt = this.ctx.corpus.MakeObject(cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(this.ctx.corpus.MakeRef(cdmObjectType.entityRef, entityName, true));
                action(cEnt, true);
                trait.addArgument(argName, this.ctx.corpus.MakeRef(cdmObjectType.entityRef, cEnt, false));
            }
            else {
                let locEntRef = getTraitRefArgumentValue(trait, argName);
                if (locEntRef) {
                    let locEnt = locEntRef.getObjectDef(null, undefined);
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
                return locEntRef.getObjectDef(null, undefined);
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
                    cEnt.setWhere(undefined, 1, sourceText, 0, "en"); // need to use ordinals because no binding done yet
            });
        }
        //return p.measure(bodyCode);
    }
    getLocalizedTraitTable(trait) {
        //let bodyCode = () =>
        {
            let cEnt = this.getTraitTable(trait, "localizedDisplayText");
            if (cEnt)
                return cEnt.lookupWhere(undefined, 1, 0, "en"); // need to use ordinals because no binding done yet
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
                    let cEnt = defVal.getObjectDef(undefined); // no doc or directives should work ?
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
                            defVal = defVal.copyData(null, undefined);
                        }
                    }
                }
                else {
                    // is it a cdm object?
                    if (defVal.getObjectType != undefined)
                        defVal = defVal.copyData(null, undefined);
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
                let cEnt = this.ctx.corpus.MakeObject(cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(this.ctx.corpus.MakeRef(cdmObjectType.entityRef, corr ? "listLookupCorrelatedValues" : "listLookupValues", true));
                cEnt.setConstantValues(tab);
                newDefault = this.ctx.corpus.MakeRef(cdmObjectType.entityRef, cEnt, false);
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
    constructor(ctx) {
        this.resolvingAttributes = false;
        this.ID = CorpusImpl.nextID();
        this.ctx = ctx;
        if (ctx)
            this.docCreatedIn = ctx.currentDoc;
    }
    get declaredInDocument() {
        return this.docCreatedIn;
    }
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getResolvedTraits(resOpt) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            let cacheTagA = ctx.corpus.getDefinitionCacheTag(resOpt, this, "rtsb");
            let rtsbAll;
            if (!this.traitCache)
                this.traitCache = new Map();
            else
                rtsbAll = this.traitCache.get(cacheTagA);
            if (!rtsbAll) {
                resOpt = cdmObject.copyResolveOptions(resOpt);
                rtsbAll = new ResolvedTraitSetBuilder();
                this.constructResolvedTraits(rtsbAll, resOpt);
                if (rtsbAll.rts) {
                    // update the directives 
                    if (rtsbAll.rts.applierCaps) {
                        rtsbAll.rts.collectDirectives(resOpt.directives);
                    }
                }
                else {
                    // nothing came back, but others will assume there is a set in this builder
                    rtsbAll.rts = new ResolvedTraitSet(resOpt);
                }
                this.traitCache.set(cacheTagA, rtsbAll);
            }
            return rtsbAll.rts;
        }
        //return p.measure(bodyCode);
    }
    getResolvedAttributes(resOpt, acpInContext) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx; // what it actually is
            let cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, "rasb", acpInContext ? "ctx" : "");
            let rasbCache = ctx.cache.get(cacheTag);
            let underCtx;
            if (!rasbCache) {
                if (this.resolvingAttributes) {
                    // re-entered this attribute through some kind of self or looping reference.
                    return new ResolvedAttributeSet();
                }
                this.resolvingAttributes = true;
                // if a new context node is needed for these attributes, make it now
                if (acpInContext)
                    underCtx = AttributeContextImpl.createChildUnder(resOpt, acpInContext);
                rasbCache = this.constructResolvedAttributes(resOpt, underCtx);
                this.resolvingAttributes = false;
                // save this as the cached version
                ctx.cache.set(cacheTag, rasbCache);
                // if a context was built, collect the mapping from contextID to objects (this is needed to let resolved attributes from this set locate the context they are created underCtx)
                if (underCtx)
                    underCtx.collectIdMap(undefined);
            }
            else {
                // cache found. if we are building a context, then fix what we got instead of making a new one
                if (acpInContext) {
                    // copy the content  of the cached context into this context
                    let underCtx = rasbCache.attributeContext.copy(resOpt);
                    underCtx.setParent(resOpt, acpInContext.under);
                    // given this new context copy, mapp it
                    underCtx.collectIdMap(undefined);
                    // because some of the atts may be pointing right at this new context and will be using the ID for the old parent, make the old ID point here too
                    underCtx.id2ctx.set(rasbCache.attributeContext.ID, underCtx);
                }
            }
            return rasbCache.ras;
        }
        //return p.measure(bodyCode);
    }
    clearTraitCache() {
        //let bodyCode = () =>
        {
            this.traitCache = undefined;
        }
        //return p.measure(bodyCode);
    }
    static copyIdentifierRef(identifier, resolved, options) {
        if (!options || !options.stringRefs || !resolved)
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
    static arraycopyData(resOpt, source, options) {
        //let bodyCode = () =>
        {
            if (!source)
                return undefined;
            let casted = new Array();
            let l = source.length;
            for (let i = 0; i < l; i++) {
                const element = source[i];
                casted.push(element ? element.copyData(resOpt, options) : undefined);
            }
            return casted;
        }
        //return p.measure(bodyCode);
    }
    static arrayCopy(resOpt, source) {
        //let bodyCode = () =>
        {
            if (!source)
                return undefined;
            let casted = new Array();
            let l = source.length;
            for (let i = 0; i < l; i++) {
                const element = source[i];
                casted.push(element ? element.copy(resOpt) : undefined);
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
    static createConstant(ctx, object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            if (typeof object === "string")
                return object;
            else if (object.relationship || object.dataType || object.entity) {
                if (object.dataType)
                    return TypeAttributeImpl.instanceFromData(ctx, object);
                else if (object.entity)
                    return EntityAttributeImpl.instanceFromData(ctx, object);
                else
                    return null;
            }
            else if (object.relationshipReference)
                return RelationshipReferenceImpl.instanceFromData(ctx, object);
            else if (object.traitReference)
                return TraitReferenceImpl.instanceFromData(ctx, object);
            else if (object.dataTypeReference)
                return DataTypeReferenceImpl.instanceFromData(ctx, object);
            else if (object.entityReference)
                return EntityReferenceImpl.instanceFromData(ctx, object);
            else if (object.attributeGroupReference)
                return AttributeGroupReferenceImpl.instanceFromData(ctx, object);
            else
                return null;
        }
        //return p.measure(bodyCode);
    }
    static createDataTypeReference(ctx, object) {
        //let bodyCode = () =>
        {
            if (object)
                return DataTypeReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createRelationshipReference(ctx, object) {
        //let bodyCode = () =>
        {
            if (object)
                return RelationshipReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttributeContext(ctx, object) {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeContextImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttributeContextReference(ctx, object) {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeContextReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createEntityReference(ctx, object) {
        //let bodyCode = () =>
        {
            if (object)
                return EntityReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttributeGroupReference(ctx, object) {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeGroupReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttributeReference(ctx, object) {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    static createAttribute(ctx, object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            if (typeof object === "string" || isAttributeGroupReference(object))
                return AttributeGroupReferenceImpl.instanceFromData(ctx, object);
            else if (isEntityAttribute(object))
                return EntityAttributeImpl.instanceFromData(ctx, object);
            else if (isTypeAttribute(object))
                return TypeAttributeImpl.instanceFromData(ctx, object);
        }
        //return p.measure(bodyCode);
    }
    static createAttributeArray(ctx, object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            let result;
            result = new Array();
            let l = object.length;
            for (let i = 0; i < l; i++) {
                const ea = object[i];
                result.push(cdmObject.createAttribute(ctx, ea));
            }
            return result;
        }
        //return p.measure(bodyCode);
    }
    static createTraitReferenceArray(ctx, object) {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;
            let result;
            result = new Array();
            let l = object.length;
            for (let i = 0; i < l; i++) {
                const tr = object[i];
                result.push(TraitReferenceImpl.instanceFromData(ctx, tr));
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
    static resolvedTraitToTraitRef(resOpt, rt) {
        let traitRef;
        if (rt.parameterValues && rt.parameterValues.length) {
            traitRef = rt.trait.ctx.corpus.MakeObject(cdmObjectType.traitRef, rt.traitName, false);
            let l = rt.parameterValues.length;
            if (l == 1) {
                // just one argument, use the shortcut syntax
                let val = rt.parameterValues.values[0];
                if (val != undefined && val != null) {
                    if (typeof (val) != "string") {
                        val = val.copy(resOpt);
                    }
                    traitRef.addArgument(undefined, val);
                }
            }
            else {
                for (let i = 0; i < l; i++) {
                    let param = rt.parameterValues.getParameter(i);
                    let val = rt.parameterValues.values[i];
                    if (val != undefined && val != null) {
                        if (typeof (val) != "string") {
                            val = val.copy(resOpt);
                        }
                        traitRef.addArgument(param.getName(), val);
                    }
                }
            }
        }
        else {
            traitRef = rt.trait.ctx.corpus.MakeObject(cdmObjectType.traitRef, rt.traitName, true);
        }
        if (resOpt.saveResolutionsOnCopy) {
            // used to localize references between documents
            traitRef.explicitReference = rt.trait;
            traitRef.docCreatedIn = rt.trait.docCreatedIn;
        }
        return traitRef;
    }
    static copyResolveOptions(resOpt) {
        let resOptCopy = {};
        resOptCopy.wrtDoc = resOpt.wrtDoc;
        resOptCopy.relationshipDepth = resOpt.relationshipDepth;
        if (resOpt.directives)
            resOptCopy.directives = resOpt.directives.copy();
        return resOptCopy;
    }
}
// some objects are just to structure other obje
class cdmObjectSimple extends cdmObject {
    constructor(ctx) {
        super(ctx);
    }
    getObjectDefName() {
        return undefined;
    }
    getObjectDef(resOpt) {
        return undefined;
    }
    createSimpleReference(resOpt) {
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
    constructor(ctx, corpusPath, moniker) {
        super(ctx);
        //let bodyCode = () =>
        {
            this.corpusPath = corpusPath;
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
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = { moniker: this.moniker, corpusPath: this.corpusPath };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new ImportImpl(this.ctx, this.corpusPath, this.moniker);
            copy.doc = this.doc;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    validate() {
        //let bodyCode = () =>
        {
            return this.corpusPath ? true : false;
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
            ff.addChildString(`${this.corpusPath}`, true);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let corpusPath = object.corpusPath;
            if (!corpusPath)
                corpusPath = object.uri;
            let imp = new ImportImpl(ctx, corpusPath, object.moniker);
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
    constructor(ctx) {
        super(ctx);
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
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let val;
            if (this.value) {
                if (typeof (this.value) === "string")
                    val = this.value;
                else
                    val = this.value.copyData(resOpt, options);
            }
            // skip the argument if just a value
            if (!this.name)
                return val;
            let castedToInterface = { explanation: this.explanation, name: this.name, value: val };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new ArgumentImpl(this.ctx);
            copy.name = this.name;
            if (this.value) {
                if (typeof (this.value) === "string")
                    copy.value = this.value;
                else
                    copy.value = this.value.copy(resOpt);
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let c = new ArgumentImpl(ctx);
            if (typeof object !== "string" && object.value) {
                c.value = cdmObject.createConstant(ctx, object.value);
                if (object.name)
                    c.name = object.name;
                if (object.explanation)
                    c.explanation = object.explanation;
            }
            else {
                // not a structured argument, just a thing. try it
                c.value = cdmObject.createConstant(ctx, object);
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
    cacheTag() {
        //let bodyCode = () =>
        {
            let tag = "";
            let val = this.value;
            if (val) {
                if (typeof (val) === "string")
                    tag = val;
                else {
                    let valObj = val;
                    if (valObj.ID)
                        tag == val.ID.toString();
                    else
                        tag = val.toString();
                }
            }
            return tag;
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ParameterDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class ParameterImpl extends cdmObjectSimple {
    constructor(ctx, name) {
        super(ctx);
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
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let defVal;
            if (this.defaultValue) {
                if (typeof (this.defaultValue) === "string")
                    defVal = this.defaultValue;
                else
                    defVal = this.defaultValue.copyData(resOpt, options);
            }
            let castedToInterface = {
                explanation: this.explanation,
                name: this.name,
                defaultValue: defVal,
                required: this.required,
                direction: this.direction,
                dataType: this.dataType ? this.dataType.copyData(resOpt, options) : undefined
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new ParameterImpl(this.ctx, this.name);
            let defVal;
            if (this.defaultValue) {
                if (typeof (this.defaultValue) === "string")
                    defVal = this.defaultValue;
                else
                    defVal = this.defaultValue.copy(resOpt);
            }
            copy.explanation = this.explanation;
            copy.defaultValue = defVal;
            copy.required = this.required;
            copy.direction = this.direction;
            copy.dataType = (this.dataType ? this.dataType.copy(resOpt) : undefined);
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let c = new ParameterImpl(ctx, object.name);
            c.explanation = object.explanation;
            c.required = object.required ? object.required : false;
            c.direction = object.direction ? object.direction : "in";
            c.defaultValue = cdmObject.createConstant(ctx, object.defaultValue);
            c.dataType = cdmObject.createDataTypeReference(ctx, object.dataType);
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
let addTraitRef = (ctx, collection, traitDefOrRef, implicitRef) => {
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
                    tRef = new TraitReferenceImpl(ctx, traitDefOrRef, implicitRef, false);
                else
                    // must be a trait def, so make a ref 
                    tRef = new TraitReferenceImpl(ctx, traitDefOrRef, false, false);
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
        if (traitRefOrDef.trait)
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
    constructor(ctx, exhibitsTraits) {
        super(ctx);
        //let bodyCode = () =>
        {
            if (exhibitsTraits)
                this.exhibitsTraits = new Array();
        }
        //return p.measure(bodyCode);
    }
    copyDef(resOpt, copy) {
        //let bodyCode = () =>
        {
            copy.explanation = this.explanation;
            copy.exhibitsTraits = cdmObject.arrayCopy(resOpt, this.exhibitsTraits);
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
    getObjectDef(resOpt) {
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
            return addTraitRef(this.ctx, this.exhibitsTraits, traitDef, implicitRef);
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
    isDerivedFromDef(resOpt, base, name, seek) {
        //let bodyCode = () =>
        {
            if (seek == name)
                return true;
            let def;
            if (base && (def = base.getObjectDef(resOpt)))
                return def.isDerivedFrom(resOpt, seek);
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraitsDef(base, rtsb, resOpt) {
        //let bodyCode = () =>
        {
            // get from base class first, then see if some are applied to base class on ref then add any traits exhibited by this def
            if (base) {
                // merge in all from base class
                rtsb.mergeTraits(base.getResolvedTraits(resOpt));
            }
            // merge in any that are exhibited by this class
            if (this.exhibitsTraits) {
                this.exhibitsTraits.forEach(et => {
                    rtsb.mergeTraits(et.getResolvedTraits(resOpt));
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
    createSimpleReference(resOpt) {
        let name;
        if (this.declaredPath)
            name = this.declaredPath;
        else
            name = this.getName();
        let ref = this.ctx.corpus.MakeObject(CorpusImpl.GetReferenceType(this.getObjectType()), name, true);
        if (resOpt.saveResolutionsOnCopy) {
            // used to localize references between documents
            ref.explicitReference = this;
            ref.docCreatedIn = this.docCreatedIn;
        }
        return ref;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ObjectRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class cdmObjectRef extends cdmObject {
    constructor(ctx, referenceTo, simpleReference, appliedTraits) {
        super(ctx);
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
    getResolvedReference(resOpt) {
        //let bodyCode = () =>
        {
            if (this.explicitReference)
                return this.explicitReference;
            if (!this.ctx)
                return undefined;
            let ctx = this.ctx; // what it actually is
            let res;
            // if this is a special request for a resolved attribute, look that up now
            let resAttToken = "/(resolvedAttributes)/";
            let seekResAtt = this.namedReference.indexOf(resAttToken);
            if (seekResAtt >= 0) {
                let entName = this.namedReference.substring(0, seekResAtt);
                let attName = this.namedReference.slice(seekResAtt + resAttToken.length);
                // get the entity
                let ent = this.ctx.corpus.resolveSymbolReference(resOpt, this.docCreatedIn, entName, cdmObjectType.entityDef);
                if (!ent) {
                    ctx.statusRpt(cdmStatusLevel.warning, `unable to resolve an entity named '${entName}' from the reference '${this.namedReference}'`, "");
                    return undefined;
                }
                // get the resolved attribute
                let ra = ent.getResolvedAttributes(resOpt).get(attName);
                if (ra)
                    res = ra.target;
                else {
                    ctx.statusRpt(cdmStatusLevel.warning, `couldn't resolve the attribute promise for '${this.namedReference}'`, "");
                }
            }
            else {
                // normal symbolic reference, look up from the Corpus, it knows where everything is
                res = this.ctx.corpus.resolveSymbolReference(resOpt, this.docCreatedIn, this.namedReference, this.objectType);
            }
            return res;
        }
        //return p.measure(bodyCode);
    }
    createSimpleReference(resOpt) {
        if (this.namedReference)
            return this.copyRefObject(resOpt, this.namedReference, true);
        return this.copyRefObject(resOpt, this.declaredPath + this.explicitReference.getName(), true);
    }
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let copy = {};
            if (this.namedReference) {
                let identifier = cdmObject.copyIdentifierRef(this.namedReference, this.getResolvedReference(resOpt), options);
                if (this.simpleNamedReference)
                    return identifier;
                let replace = this.copyRefData(resOpt, copy, identifier, options);
                if (replace)
                    copy = replace;
            }
            else if (this.explicitReference) {
                let erCopy = this.explicitReference.copyData(resOpt, options);
                let replace = this.copyRefData(resOpt, copy, erCopy, options);
                if (replace)
                    copy = replace;
            }
            if (this.appliedTraits)
                copy.appliedTraits = cdmObject.arraycopyData(resOpt, this.appliedTraits, options);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        let copy = this.copyRefObject(resOpt, this.namedReference ? this.namedReference : this.explicitReference, this.simpleNamedReference);
        if (resOpt.saveResolutionsOnCopy) {
            copy.explicitReference = this.explicitReference;
            copy.docCreatedIn = this.docCreatedIn;
        }
        if (this.appliedTraits)
            copy.appliedTraits = cdmObject.arrayCopy(resOpt, this.appliedTraits);
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
    getObjectDef(resOpt) {
        //let bodyCode = () =>
        {
            let def = this.getResolvedReference(resOpt);
            if (def)
                return def;
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
            return addTraitRef(this.ctx, this.appliedTraits, traitDef, implicitRef);
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
            //if (!path) {
            if (this.namedReference)
                path = pathFrom + this.namedReference;
            else
                path = pathFrom;
            this.declaredPath = path;
            //}
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
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            let rasb = new ResolvedAttributeSetBuilder();
            rasb.setAttributeContext(under);
            let def = this.getObjectDef(resOpt);
            if (def) {
                let acpRef;
                if (under) {
                    // ask for a 'pass through' context, that is, no new context at this level
                    acpRef = {
                        under: under,
                        type: cdmAttributeContextType.passThrough,
                    };
                }
                let resAtts = def.getResolvedAttributes(resOpt, acpRef);
                if (resAtts) {
                    resAtts = resAtts.copy();
                    rasb.mergeAttributes(resAtts);
                    rasb.removeRequestedAtts();
                }
            }
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedTraits(resOpt) {
        //let bodyCode = () =>
        {
            if (this.namedReference && !this.appliedTraits) {
                let ctx = this.ctx;
                let objDefName = this.getObjectDefName();
                let cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, "rts", "", true);
                let rtsResult = ctx.cache.get(cacheTag);
                if (!rtsResult) {
                    let objDef = this.getObjectDef(resOpt);
                    rtsResult = objDef.getResolvedTraits(resOpt);
                    if (rtsResult)
                        rtsResult = rtsResult.deepCopy();
                    ctx.cache.set(cacheTag, rtsResult);
                }
                return rtsResult;
            }
            else {
                return super.getResolvedTraits(resOpt);
            }
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            let objDef = this.getObjectDef(resOpt);
            if (objDef) {
                let rtsInh = objDef.getResolvedTraits(resOpt);
                if (rtsInh)
                    rtsInh = rtsInh.deepCopy();
                rtsb.takeReference(rtsInh);
            }
            if (this.appliedTraits) {
                this.appliedTraits.forEach(at => {
                    rtsb.mergeTraits(at.getResolvedTraits(resOpt));
                });
            }
        }
        //return p.measure(bodyCode);
    }
}
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
    constructor(ctx, trait, simpleReference, hasArguments) {
        super(ctx, trait, simpleReference, false);
        //let bodyCode = () =>
        {
            if (hasArguments)
                this.arguments = new Array();
            this.objectType = cdmObjectType.traitRef;
            this.resolvedArguments = false;
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
    copyRefData(resOpt, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.traitReference = refTo;
            copy.arguments = cdmObject.arraycopyData(resOpt, this.arguments, options);
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(resOpt, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new TraitReferenceImpl(this.ctx, refTo, simpleReference, (this.arguments && this.arguments.length > 0));
            if (!simpleReference) {
                copy.arguments = cdmObject.arrayCopy(resOpt, this.arguments);
                copy.resolvedArguments = this.resolvedArguments;
            }
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let trait;
            let args = null;
            if (typeof (object) == "string")
                trait = object;
            else {
                simpleReference = false;
                args = object.arguments;
                if (typeof (object.traitReference) === "string")
                    trait = object.traitReference;
                else
                    trait = TraitImpl.instanceFromData(ctx, object.traitReference);
            }
            let c = new TraitReferenceImpl(ctx, trait, simpleReference, !!args);
            if (args) {
                args.forEach(a => {
                    c.arguments.push(ArgumentImpl.instanceFromData(ctx, a));
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
            let newArg = this.ctx.corpus.MakeObject(cdmObjectType.argumentDef, name);
            newArg.setValue(value);
            this.arguments.push(newArg);
            this.resolvedArguments = false;
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
                let arg = new ArgumentImpl(this.ctx);
                arg.ctx = this.ctx;
                arg.name = name;
                arg.value = value;
            }
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getResolvedTraits(resOpt) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            // get referenced trait
            let trait = this.getObjectDef(resOpt);
            let rtsTrait;
            if (!trait)
                return ctx.corpus.getEmptyResolvedTraitSet(resOpt);
            // see if one is already cached 
            // cache by name unless there are parameter
            if (trait.thisIsKnownToHaveParameters == undefined) {
                // never been resolved, it will happen soon, so why not now?
                rtsTrait = trait.getResolvedTraits(resOpt);
            }
            let cacheByName = !trait.thisIsKnownToHaveParameters;
            let cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, "rtsb", "", cacheByName);
            let rtsResult = ctx.cache.get(cacheTag);
            // if not, then make one and save it
            if (!rtsResult) {
                // get the set of resolutions, should just be this one trait
                if (!rtsTrait)
                    rtsTrait = trait.getResolvedTraits(resOpt);
                if (rtsTrait)
                    rtsResult = rtsTrait.deepCopy();
                // now if there are argument for this application, set the values in the array
                if (this.arguments && rtsResult) {
                    // if never tried to line up arguments with parameters, do that
                    if (!this.resolvedArguments) {
                        this.resolvedArguments = true;
                        let params = trait.getAllParameters(resOpt);
                        let paramFound;
                        let aValue;
                        let iArg = 0;
                        for (const a of this.arguments) {
                            paramFound = params.resolveParameter(iArg, a.getName());
                            a.resolvedParameter = paramFound;
                            aValue = a.value;
                            aValue = ctx.corpus.constTypeCheck(resOpt, paramFound, aValue);
                            a.setValue(aValue);
                            iArg++;
                        }
                    }
                    for (const a of this.arguments) {
                        rtsResult.setParameterValueFromArgument(trait, a);
                    }
                }
                ctx.cache.set(cacheTag, rtsResult);
            }
            return rtsResult;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TraitDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TraitImpl extends cdmObjectDef {
    constructor(ctx, name, extendsTrait, hasParameters) {
        super(ctx, false);
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
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                traitName: this.traitName,
                extendsTrait: this.extendsTrait ? this.extendsTrait.copyData(resOpt, options) : undefined,
                hasParameters: cdmObject.arraycopyData(resOpt, this.hasParameters, options),
                elevated: this.elevated,
                modifiesAttributes: this.modifiesAttributes,
                ugly: this.ugly,
                associatedProperties: this.associatedProperties
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new TraitImpl(this.ctx, this.traitName, null, false);
            copy.extendsTrait = this.extendsTrait ? this.extendsTrait.copy(resOpt) : undefined,
                copy.hasParameters = cdmObject.arrayCopy(resOpt, this.hasParameters);
            copy.allParameters = null;
            copy.elevated = this.elevated;
            copy.ugly = this.ugly;
            copy.modifiesAttributes = this.modifiesAttributes;
            copy.associatedProperties = this.associatedProperties;
            this.copyDef(resOpt, copy);
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let extendsTrait;
            if (object.extendsTrait)
                extendsTrait = TraitReferenceImpl.instanceFromData(ctx, object.extendsTrait);
            let c = new TraitImpl(ctx, object.traitName, extendsTrait, !!object.hasParameters);
            if (object.explanation)
                c.explanation = object.explanation;
            if (object.hasParameters) {
                object.hasParameters.forEach(ap => {
                    c.hasParameters.push(ParameterImpl.instanceFromData(ctx, ap));
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
            addTraitRef(this.ctx, extRef, traitDef, implicitRef);
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
    isDerivedFrom(resOpt, base) {
        //let bodyCode = () =>
        {
            if (base === this.traitName)
                return true;
            return this.isDerivedFromDef(resOpt, this.extendsTrait, this.traitName, base);
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
    getResolvedTraits(resOpt) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            // this may happen 0, 1 or 2 times. so make it fast
            let baseTrait;
            let baseRts;
            let baseValues;
            let getBaseInfo = () => {
                if (this.extendsTrait) {
                    baseTrait = this.extendsTrait.getObjectDef(resOpt);
                    if (baseTrait) {
                        baseRts = this.extendsTrait.getResolvedTraits(resOpt);
                        if (baseRts && baseRts.size === 1) {
                            let basePv = baseRts.get(baseTrait).parameterValues;
                            if (basePv)
                                baseValues = basePv.values;
                        }
                    }
                }
            };
            // see if one is already cached 
            // if this trait has parameters, then the base trait found through the reference might be a different reference 
            // because trait references are unique per argument value set. so use the base as a part of the cache tag
            // since it is expensive to figure out the extra tag, cache that too!
            if (this.baseIsKnownToHaveParameters == undefined) {
                getBaseInfo();
                // is a cache tag needed? then make one
                this.baseIsKnownToHaveParameters = false;
                if (baseValues && baseValues.length > 0)
                    this.baseIsKnownToHaveParameters = true;
            }
            let cacheTagExtra = "";
            if (this.baseIsKnownToHaveParameters)
                cacheTagExtra = this.extendsTrait.ID.toString();
            let cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, "rtsb", cacheTagExtra);
            let rtsResult = ctx.cache.get(cacheTag);
            // if not, then make one and save it
            if (!rtsResult) {
                getBaseInfo();
                if (baseTrait) {
                    // get the resolution of the base class and use the values as a starting point for this trait's values
                    if (this.hasSetFlags == false) {
                        // inherit these flags
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
                let pc = this.getAllParameters(resOpt);
                let av = new Array();
                let wasSet = new Array();
                this.thisIsKnownToHaveParameters = (pc.sequence.length > 0);
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
                // save it
                let resTrait = new ResolvedTrait(this, pc, av, wasSet);
                rtsResult = new ResolvedTraitSet(resOpt);
                rtsResult.merge(resTrait, false);
                if (rtsResult.applierCaps)
                    rtsResult.collectDirectives(resOpt.directives);
                ctx.cache.set(cacheTag, rtsResult);
            }
            return rtsResult;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
    }
    getAllParameters(resOpt) {
        //let bodyCode = () =>
        {
            if (this.allParameters)
                return this.allParameters;
            // get parameters from base if there is one
            let prior;
            if (this.extendsTrait)
                prior = this.getExtendsTrait().getObjectDef(resOpt).getAllParameters(resOpt);
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
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
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
    constructor(ctx, relationship, simpleReference, appliedTraits) {
        super(ctx, relationship, simpleReference, appliedTraits);
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
    copyRefData(resOpt, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.relationshipReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(resOpt, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new RelationshipReferenceImpl(this.ctx, refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let appliedTraits = null;
            let relationship;
            if (typeof (object) == "string")
                relationship = object;
            else {
                simpleReference = false;
                appliedTraits = object.appliedTraits;
                if (typeof (object.relationshipReference) === "string")
                    relationship = object.relationshipReference;
                else
                    relationship = RelationshipImpl.instanceFromData(ctx, object.relationshipReference);
            }
            let c = new RelationshipReferenceImpl(ctx, relationship, simpleReference, !!appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, appliedTraits);
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
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {RelationshipDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class RelationshipImpl extends cdmObjectDef {
    constructor(ctx, relationshipName, extendsRelationship, exhibitsTraits) {
        super(ctx, exhibitsTraits);
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
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                relationshipName: this.relationshipName,
                extendsRelationship: this.extendsRelationship ? this.extendsRelationship.copyData(resOpt, options) : undefined,
                exhibitsTraits: cdmObject.arraycopyData(resOpt, this.exhibitsTraits, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new RelationshipImpl(this.ctx, this.relationshipName, null, false);
            copy.extendsRelationship = this.extendsRelationship ? this.extendsRelationship.copy(resOpt) : undefined;
            this.copyDef(resOpt, copy);
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let extendsRelationship;
            extendsRelationship = cdmObject.createRelationshipReference(ctx, object.extendsRelationship);
            let c = new RelationshipImpl(ctx, object.relationshipName, extendsRelationship, !!object.exhibitsTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);
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
    isDerivedFrom(resOpt, base) {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(resOpt, this.getExtendsRelationshipRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsRelationshipRef(), rtsb, resOpt);
            //rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
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
    constructor(ctx, dataType, simpleReference, appliedTraits) {
        super(ctx, dataType, simpleReference, appliedTraits);
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
    copyRefData(resOpt, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.dataTypeReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(resOpt, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new DataTypeReferenceImpl(this.ctx, refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let dataType;
            let appliedTraits = null;
            if (typeof (object) == "string")
                dataType = object;
            else {
                simpleReference = false;
                appliedTraits = object.appliedTraits;
                if (typeof (object.dataTypeReference) === "string")
                    dataType = object.dataTypeReference;
                else
                    dataType = DataTypeImpl.instanceFromData(ctx, object.dataTypeReference);
            }
            let c = new DataTypeReferenceImpl(ctx, dataType, simpleReference, !!appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, appliedTraits);
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
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {DataTypeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class DataTypeImpl extends cdmObjectDef {
    constructor(ctx, dataTypeName, extendsDataType, exhibitsTraits) {
        super(ctx, exhibitsTraits);
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
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                dataTypeName: this.dataTypeName,
                extendsDataType: this.extendsDataType ? this.extendsDataType.copyData(resOpt, options) : undefined,
                exhibitsTraits: cdmObject.arraycopyData(resOpt, this.exhibitsTraits, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new DataTypeImpl(this.ctx, this.dataTypeName, null, false);
            copy.extendsDataType = this.extendsDataType ? this.extendsDataType.copy(resOpt) : undefined;
            this.copyDef(resOpt, copy);
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let extendsDataType;
            extendsDataType = cdmObject.createDataTypeReference(ctx, object.extendsDataType);
            let c = new DataTypeImpl(ctx, object.dataTypeName, extendsDataType, !!object.exhibitsTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);
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
    isDerivedFrom(resOpt, base) {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(resOpt, this.getExtendsDataTypeRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsDataTypeRef(), rtsb, resOpt);
            //rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
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
    constructor(ctx, attribute, simpleReference) {
        super(ctx, attribute, simpleReference, false);
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
    copyRefData(resOpt, copy, refTo, options) {
        //let bodyCode = () =>
        {
            // there is no persisted object wrapper
            return refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(resOpt, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new AttributeReferenceImpl(this.ctx, refTo, simpleReference);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let attribute;
            if (typeof (object) == "string")
                attribute = object;
            else {
                simpleReference = false;
                attribute = cdmObject.createAttribute(ctx, object);
            }
            let c = new AttributeReferenceImpl(ctx, attribute, simpleReference);
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
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeImpl extends cdmObjectDef {
    constructor(ctx, name, appliedTraits) {
        super(ctx, false);
        //let bodyCode = () =>
        {
            this.name = name;
            if (appliedTraits)
                this.appliedTraits = new Array();
        }
        //return p.measure(bodyCode);
    }
    copyAtt(resOpt, copy) {
        //let bodyCode = () =>
        {
            copy.relationship = this.relationship ? this.relationship.copy(resOpt) : undefined;
            copy.appliedTraits = cdmObject.arrayCopy(resOpt, this.appliedTraits);
            this.copyDef(resOpt, copy);
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
            return addTraitRef(this.ctx, this.appliedTraits, traitDef, implicitRef);
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
    addResolvedTraitsApplied(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            let addAppliedTraits = (ats) => {
                if (ats) {
                    let l = ats.length;
                    for (let i = 0; i < l; i++) {
                        rtsb.mergeTraits(ats[i].getResolvedTraits(resOpt));
                    }
                }
            };
            addAppliedTraits(this.appliedTraits);
            // any applied on use
            return rtsb.rts;
        }
        //return p.measure(bodyCode);
    }
    removeTraitDef(resOpt, def) {
        //let bodyCode = () =>
        {
            this.clearTraitCache();
            let traitName = def.getName();
            if (this.appliedTraits) {
                let iRemove = 0;
                for (iRemove = 0; iRemove < this.appliedTraits.length; iRemove++) {
                    const tr = this.appliedTraits[iRemove];
                    if (tr.getObjectDefName() == traitName)
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
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TypeAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TypeAttributeImpl extends AttributeImpl {
    constructor(ctx, name, appliedTraits) {
        super(ctx, name, appliedTraits);
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
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                relationship: this.relationship ? this.relationship.copyData(resOpt, options) : undefined,
                dataType: this.dataType ? this.dataType.copyData(resOpt, options) : undefined,
                name: this.name,
                appliedTraits: cdmObject.arraycopyData(resOpt, this.appliedTraits, options),
                attributeContext: this.attributeContext ? this.attributeContext.copyData(resOpt, options) : undefined
            };
            this.getTraitToPropertyMap().persistForTypeAttributeDef(castedToInterface, options);
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new TypeAttributeImpl(this.ctx, this.name, false);
            copy.dataType = this.dataType ? this.dataType.copy(resOpt) : undefined;
            copy.attributeContext = this.attributeContext ? this.attributeContext.copy(resOpt) : undefined;
            this.copyAtt(resOpt, copy);
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let c = new TypeAttributeImpl(ctx, object.name, !!object.appliedTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.relationship = cdmObject.createRelationshipReference(ctx, object.relationship);
            c.dataType = cdmObject.createDataTypeReference(ctx, object.dataType);
            c.attributeContext = cdmObject.createAttributeContextReference(ctx, object.attributeContext);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, object.appliedTraits);
            c.t2pm = new traitToPropertyMap();
            c.t2pm.initForTypeAttributeDef(ctx, object, c);
            return c;
        }
        //return p.measure(bodyCode);
    }
    isDerivedFrom(resOpt, base) {
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
        this.t2pm.initForTypeAttributeDef(this.ctx, null, this);
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
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            // // get from datatype
            if (this.dataType)
                rtsb.takeReference(this.getDataTypeRef().getResolvedTraits(resOpt));
            // // get from relationship
            if (this.relationship)
                rtsb.mergeTraits(this.getRelationshipRef().getResolvedTraits(resOpt));
            this.addResolvedTraitsApplied(rtsb, resOpt);
            // special case for attributes, replace a default "this.attribute" with this attribute on traits that elevate attribute
            if (rtsb.rts && rtsb.rts.hasElevated) {
                let replacement = new AttributeReferenceImpl(this.ctx, this.name, true);
                replacement.ctx = this.ctx;
                replacement.explicitReference = this;
                rtsb.replaceTraitParameterValue(resOpt, "does.elevateAttribute", "attribute", "this.attribute", replacement);
            }
            //rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the datatype used as an attribute, traits applied to that datatype,
            // the relationship of the attribute, any traits applied to the attribute.
            let rasb = new ResolvedAttributeSetBuilder();
            rasb.setAttributeContext(under);
            // add this attribute to the set
            // make a new one and apply any traits
            let newAtt = new ResolvedAttribute(resOpt, this, this.name, under ? under.ID : -1);
            rasb.ownOne(newAtt);
            rasb.prepareForTraitApplication(this.getResolvedTraits(resOpt));
            // from the traits of the datatype, relationship and applied here, see if new attributes get generated
            rasb.applyTraits();
            rasb.generateTraitAttributes(false); // false = don't apply these traits to added things
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences(resOpt) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityAttributeImpl extends AttributeImpl {
    constructor(ctx, name, appliedTraits) {
        super(ctx, name, appliedTraits);
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
    isDerivedFrom(resOpt, base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let entity;
            entity = this.entity ? this.entity.copyData(resOpt, options) : undefined;
            let castedToInterface = {
                explanation: this.explanation,
                name: this.name,
                entity: this.entity.copyData(resOpt, options),
                relationship: this.relationship ? this.relationship.copyData(resOpt, options) : undefined,
                appliedTraits: cdmObject.arraycopyData(resOpt, this.appliedTraits, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new EntityAttributeImpl(this.ctx, this.name, false);
            copy.entity = this.entity.copy(resOpt);
            this.copyAtt(resOpt, copy);
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let c = new EntityAttributeImpl(ctx, object.name, !!object.appliedTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.entity = EntityReferenceImpl.instanceFromData(ctx, object.entity);
            c.relationship = object.relationship ? cdmObject.createRelationshipReference(ctx, object.relationship) : undefined;
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, object.appliedTraits);
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
    getRelationshipInfo(resOpt) {
        //let bodyCode = () =>
        {
            let rts;
            let isFlexRef = false;
            let isLegacyRef = false;
            let isArray = false;
            let selectsOne = false;
            let nextDepth;
            let maxDepthExceeded = false;
            if (this.relationship) {
                // get the traits for the relationship only
                rts = this.getRelationshipRef().getResolvedTraits(resOpt);
                if (rts) {
                    // this trait will go away at somepoint ..
                    isLegacyRef = rts.find(resOpt, "does.referenceEntity") ? true : false; // legacy trait
                    if (rts.resOpt.directives) {
                        // based on directives
                        if (!isLegacyRef)
                            isFlexRef = rts.resOpt.directives.has("referenceOnly");
                        selectsOne = rts.resOpt.directives.has("selectOne");
                        isArray = rts.resOpt.directives.has("isArray");
                    }
                    // figure out the depth for the next level
                    let oldDepth = resOpt.relationshipDepth;
                    nextDepth = oldDepth;
                    // if this is a 'selectone', then skip counting this entity in the depth, else count it
                    if (!selectsOne) {
                        // if already a ref, who cares?
                        if (!isFlexRef) {
                            if (nextDepth == undefined)
                                nextDepth = 1;
                            else
                                nextDepth++;
                            // max comes from trait
                            let maxDepth = 100; // crazy default
                            let rt = rts.find(resOpt, "does.referenceEntityVia");
                            if (rt) {
                                let setMax = rt.parameterValues.getParameterValue("referencesOnlyAfterDepth").getValueString(resOpt);
                                if (setMax != undefined) {
                                    let max = Number.parseInt(setMax);
                                    if (max != undefined) {
                                        maxDepth = max;
                                    }
                                }
                            }
                            if (nextDepth > maxDepth) {
                                // don't do it
                                isFlexRef = true;
                                maxDepthExceeded = true;
                            }
                        }
                    }
                }
            }
            return { rts: rts,
                isFlexRef: isFlexRef,
                isLegacyRef: isLegacyRef,
                isArray: isArray,
                selectsOne: selectsOne,
                nextDepth: nextDepth,
                maxDepthExceeded: maxDepthExceeded
            };
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            // // get from relationship
            if (this.relationship)
                rtsb.takeReference(this.getRelationshipRef().getResolvedTraits(resOpt));
            this.addResolvedTraitsApplied(rtsb, resOpt);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the entity used as an attribute, traits applied to that entity,
            // the relationship of the attribute, any traits applied to the attribute.
            let rasb = new ResolvedAttributeSetBuilder();
            let ctxEnt = this.entity;
            let underAtt = under;
            let acpEnt;
            if (underAtt) {
                // make a context for this attribute that holds the attributes that come up from the entity
                acpEnt = {
                    under: underAtt,
                    type: cdmAttributeContextType.entity,
                    name: ctxEnt.getObjectDefName(),
                    regarding: ctxEnt,
                    includeTraits: true
                };
            }
            let rtsThisAtt = this.getResolvedTraits(resOpt);
            rasb.prepareForTraitApplication(rtsThisAtt);
            // complete cheating but is faster. this relationship will remove all of the attributes that get collected here, so dumb and slow to go get them
            let relInfo = this.getRelationshipInfo(resOpt);
            if (relInfo.isFlexRef || relInfo.isLegacyRef) {
                // make the entity context that a real recursion would have give us
                if (under)
                    under = rasb.createAttributeContext(resOpt, acpEnt);
                // if selecting from one of many attributes, then make a context for each one
                if (under && relInfo.selectsOne) {
                    // the right way to do this is to get a resolved entity from the embedded entity and then 
                    // look through the attribute context hierarchy for non-nested entityReferenceAsAttribute nodes
                    // that seems like a disaster waiting to happen given endless looping, etc.
                    // for now, just insist that only the top level entity attributes declared in the ref entity will work
                    let entPickFrom = this.entity.getObjectDef(resOpt);
                    let attsPick;
                    if (entPickFrom && (attsPick = entPickFrom.getHasAttributeDefs())) {
                        let l = attsPick.length;
                        for (let i = 0; i < l; i++) {
                            if (attsPick[i].getObjectType() == cdmObjectType.entityAttributeDef) {
                                // a table within a table. as expected with a selectsOne attribute
                                // since this is by ref, we won't get the atts from the table, but we do need the traits that hold the key
                                // these are the same contexts that would get created if we recursed
                                // first this attribute
                                let acpEntAtt = {
                                    under: under,
                                    type: cdmAttributeContextType.attributeDefinition,
                                    name: attsPick[i].getObjectDefName(),
                                    regarding: attsPick[i],
                                    includeTraits: true
                                };
                                let pickUnder = rasb.createAttributeContext(resOpt, acpEntAtt);
                                // and the entity under that attribute
                                let pickEnt = attsPick[i].getEntityRef();
                                let acpEntAttEnt = {
                                    under: pickUnder,
                                    type: cdmAttributeContextType.entity,
                                    name: pickEnt.getObjectDefName(),
                                    regarding: pickEnt,
                                    includeTraits: true
                                };
                                rasb.createAttributeContext(resOpt, acpEntAttEnt);
                            }
                        }
                    }
                }
                // if we got here because of the max depth, need to impose the directives to make the trait work as expected
                if (relInfo.maxDepthExceeded) {
                    let dirNew = new TraitDirectiveSet();
                    dirNew.add("referenceOnly");
                    rtsThisAtt.collectDirectives(dirNew);
                }
            }
            else {
                let resLink = cdmObject.copyResolveOptions(resOpt);
                resLink.relationshipDepth = relInfo.nextDepth;
                rasb.mergeAttributes(this.entity.getResolvedAttributes(resLink, acpEnt));
            }
            // from the traits of relationship and applied here, see if new attributes get generated
            rasb.setAttributeContext(underAtt);
            rasb.applyTraits();
            rasb.generateTraitAttributes(true); // true = apply the prepared traits to new atts
            // a 'structured' directive wants to keep all entity attributes together in a group
            if (rtsThisAtt && rtsThisAtt.resOpt.directives && rtsThisAtt.resOpt.directives.has('structured')) {
                let raSub = new ResolvedAttribute(rtsThisAtt.resOpt, rasb.ras, this.name, rasb.attributeContext ? rasb.attributeContext.ID : -1);
                if (relInfo.isArray) {
                    // put a resolved trait on this att group, yuck, hope I never need to do this again and then need to make a function for this
                    let tr = this.ctx.corpus.MakeObject(cdmObjectType.traitRef, "is.linkedEntity.array", true);
                    let t = tr.getObjectDef(resOpt);
                    let rt = new ResolvedTrait(t, undefined, new Array(), new Array());
                    raSub.resolvedTraits = raSub.resolvedTraits.merge(rt, true);
                }
                rasb = new ResolvedAttributeSetBuilder();
                rasb.ownOne(raSub);
            }
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences(resOpt) {
        //let bodyCode = () =>
        {
            let relInfo = this.getRelationshipInfo(resOpt);
            if (relInfo.isLegacyRef || (relInfo.isFlexRef && !relInfo.isArray)) {
                // only place this is used, so logic here instead of encapsulated. 
                // make a set and the one ref it will hold
                let rers = new ResolvedEntityReferenceSet(resOpt);
                let rer = new ResolvedEntityReference();
                // referencing attribute(s) come from this attribute
                rer.referencing.rasb.mergeAttributes(this.getResolvedAttributes(resOpt));
                let resolveSide = (entRef) => {
                    let sideOther = new ResolvedEntityReferenceSide();
                    if (entRef) {
                        // reference to the other entity, hard part is the attribue name.
                        // by convention, this is held in a trait that identifies the key
                        sideOther.entity = entRef.getObjectDef(resOpt);
                        if (sideOther.entity) {
                            // now that we resolved the entity, it should be ok and much faster to switch to the
                            // context of the entities document to go after the key 
                            let wrtEntityDoc = sideOther.entity.declaredInDocument;
                            let otherAttribute;
                            let otherOpts = { wrtDoc: wrtEntityDoc, directives: resOpt.directives };
                            let t = entRef.getResolvedTraits(otherOpts).find(otherOpts, "is.identifiedBy");
                            if (t && t.parameterValues && t.parameterValues.length) {
                                let otherRef = (t.parameterValues.getParameterValue("attribute").value);
                                if (otherRef && typeof (otherRef) === "object") {
                                    otherAttribute = otherRef.getObjectDef(otherOpts);
                                    if (otherAttribute) {
                                        if (!otherAttribute.getName)
                                            otherAttribute.getName();
                                        sideOther.rasb.ownOne(sideOther.entity.getResolvedAttributes(otherOpts).get(otherAttribute.getName()).copy());
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
                    let entPickFrom = this.entity.getObjectDef(resOpt);
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
    constructor(ctx, attributeGroup, simpleReference) {
        super(ctx, attributeGroup, simpleReference, false);
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
    copyRefData(resOpt, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.attributeGroupReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(resOpt, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new AttributeGroupReferenceImpl(this.ctx, refTo, simpleReference);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(ctx, object) {
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
                    attributeGroup = AttributeGroupImpl.instanceFromData(ctx, object.attributeGroupReference);
            }
            let c = new AttributeGroupReferenceImpl(ctx, attributeGroup, simpleReference);
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
    getResolvedEntityReferences(resOpt) {
        //let bodyCode = () =>
        {
            let ref = this.getResolvedReference(resOpt);
            if (ref)
                return ref.getResolvedEntityReferences(resOpt);
            if (this.explicitReference)
                return this.explicitReference.getResolvedEntityReferences(resOpt);
            return null;
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeGroupDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeGroupImpl extends cdmObjectDef {
    constructor(ctx, attributeGroupName) {
        super(ctx, false);
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
    isDerivedFrom(resOpt, base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                attributeGroupName: this.attributeGroupName,
                exhibitsTraits: cdmObject.arraycopyData(resOpt, this.exhibitsTraits, options),
                attributeContext: this.attributeContext ? this.attributeContext.copyData(resOpt, options) : undefined,
                members: cdmObject.arraycopyData(resOpt, this.members, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new AttributeGroupImpl(this.ctx, this.attributeGroupName);
            copy.members = cdmObject.arrayCopy(resOpt, this.members);
            copy.attributeContext = this.attributeContext ? this.attributeContext.copy(resOpt) : undefined;
            this.copyDef(resOpt, copy);
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let c = new AttributeGroupImpl(ctx, object.attributeGroupName);
            if (object.explanation)
                c.explanation = object.explanation;
            c.attributeContext = cdmObject.createAttributeContextReference(ctx, object.attributeContext);
            c.members = cdmObject.createAttributeArray(ctx, object.members);
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);
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
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            let rasb = new ResolvedAttributeSetBuilder();
            if (under) {
                let acpAttGrp = {
                    under: under,
                    type: cdmAttributeContextType.attributeGroup,
                    name: this.getName(),
                    regarding: this,
                    includeTraits: false
                };
                under = rasb.createAttributeContext(resOpt, acpAttGrp);
            }
            if (this.members) {
                let l = this.members.length;
                for (let i = 0; i < l; i++) {
                    let att = this.members[i];
                    let attUnder = under;
                    let acpAtt;
                    if (under) {
                        acpAtt = {
                            under: under,
                            type: cdmAttributeContextType.attributeDefinition,
                            name: att.getObjectDefName(),
                            regarding: att,
                            includeTraits: false
                        };
                    }
                    rasb.mergeAttributes(att.getResolvedAttributes(resOpt, acpAtt));
                }
            }
            rasb.setAttributeContext(under);
            // things that need to go away
            rasb.removeRequestedAtts();
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntityReferences(resOpt) {
        //let bodyCode = () =>
        {
            let rers = new ResolvedEntityReferenceSet(resOpt);
            if (this.members) {
                let l = this.members.length;
                for (let i = 0; i < l; i++) {
                    rers.add(this.members[i].getResolvedEntityReferences(resOpt));
                }
            }
            return rers;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            // get only the elevated traits from attributes first, then add in all traits from this definition
            if (this.members) {
                let rtsElevated = new ResolvedTraitSet(resOpt);
                let l = this.members.length;
                for (let i = 0; i < l; i++) {
                    let att = this.members[i];
                    let rtsAtt = att.getResolvedTraits(resOpt);
                    if (rtsAtt && rtsAtt.hasElevated) {
                        rtsElevated = rtsElevated.mergeSet(rtsAtt, true);
                    }
                }
                rtsb.mergeTraits(rtsElevated);
            }
            this.constructResolvedTraitsDef(undefined, rtsb, resOpt);
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  the 'constant' entity
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
class ConstantEntityImpl extends cdmObjectDef {
    constructor(ctx) {
        super(ctx, false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.constantEntityDef;
        }
        //return p.measure(bodyCode);
    }
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                constantEntityName: this.constantEntityName,
                entityShape: this.entityShape ? this.entityShape.copyData(resOpt, options) : undefined,
                constantValues: this.constantValues
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new ConstantEntityImpl(this.ctx);
            copy.constantEntityName = this.constantEntityName;
            copy.entityShape = this.entityShape.copy(resOpt);
            copy.constantValues = this.constantValues; // is a deep copy needed? 
            this.copyDef(resOpt, copy);
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
    isDerivedFrom(resOpt, base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let c = new ConstantEntityImpl(ctx);
            if (object.explanation)
                c.explanation = object.explanation;
            if (object.constantEntityName)
                c.constantEntityName = object.constantEntityName;
            c.constantValues = object.constantValues;
            c.entityShape = cdmObject.createEntityReference(ctx, object.entityShape);
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
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            let rasb = new ResolvedAttributeSetBuilder();
            let acpEnt;
            if (under) {
                let acpEnt = {
                    under: under,
                    type: cdmAttributeContextType.entity,
                    name: this.entityShape.getObjectDefName(),
                    regarding: this.entityShape,
                    includeTraits: true
                };
            }
            if (this.entityShape)
                rasb.mergeAttributes(this.getEntityShape().getResolvedAttributes(resOpt, acpEnt));
            // things that need to go away
            rasb.removeRequestedAtts();
            return rasb;
        }
        //return p.measure(bodyCode);
    }
    // the world's smallest complete query processor...
    findValue(resOpt, attReturn, attSearch, valueSearch, action) {
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
                let ras = this.getResolvedAttributes(resOpt);
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
    lookupWhere(resOpt, attReturn, attSearch, valueSearch) {
        //let bodyCode = () =>
        {
            let result;
            this.findValue(resOpt, attReturn, attSearch, valueSearch, found => { result = found; return found; });
            return result;
        }
        //return p.measure(bodyCode);
    }
    setWhere(resOpt, attReturn, newValue, attSearch, valueSearch) {
        //let bodyCode = () =>
        {
            let result;
            this.findValue(resOpt, attReturn, attSearch, valueSearch, found => { result = found; return newValue; });
            return result;
        }
        //return p.measure(bodyCode);
    }
}
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
    constructor(ctx, name) {
        super(ctx, name, true, false);
        this.objectType = cdmObjectType.attributeContextRef;
    }
    getObjectType() {
        return cdmObjectType.attributeContextRef;
    }
    copyRefData(resOpt, copy, refTo, options) {
    }
    copyRefObject(resOpt, refTo, simpleReference) {
        let copy = new AttributeContextReferenceImpl(this.ctx, refTo);
        return copy;
    }
    static instanceFromData(ctx, object) {
        if (typeof (object) == "string")
            return new AttributeContextReferenceImpl(ctx, object);
        return null;
    }
    getAppliedTraitRefs() {
        return null;
    }
    visitRef(pathFrom, preChildren, postChildren) {
        return false;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeContext}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeContextImpl extends cdmObjectDef {
    constructor(ctx, name) {
        super(ctx, false);
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
                case "attributeDefinition":
                    return cdmAttributeContextType.attributeDefinition;
                case "addedAttributeSupporting":
                    return cdmAttributeContextType.addedAttributeSupporting;
                case "addedAttributeIdentity":
                    return cdmAttributeContextType.addedAttributeIdentity;
                default:
                    return -1;
            }
        }
        //return p.measure(bodyCode);
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
                case cdmAttributeContextType.attributeDefinition:
                    return "attributeDefinition";
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
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                name: this.name,
                type: AttributeContextImpl.mapEnumToTypeName(this.type),
                parent: this.parent ? this.parent.copyData(resOpt, options) : undefined,
                definition: this.definition ? this.definition.copyData(resOpt, options) : undefined,
                // i know the trait collection names look wrong. but I wanted to use the def baseclass
                appliedTraits: cdmObject.arraycopyData(resOpt, this.exhibitsTraits, options),
                contents: cdmObject.arraycopyData(resOpt, this.contents, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new AttributeContextImpl(this.ctx, this.name);
            // because resolved attributes indirect to the context they are created in by way of id, use the same ID for a copy.
            copy.ID = this.ID;
            copy.type = this.type;
            copy.docCreatedIn = resOpt.wrtDoc;
            if (this.parent)
                copy.parent = this.parent.copy(resOpt);
            if (this.definition)
                copy.definition = this.definition.copy(resOpt);
            copy.contents = cdmObject.arrayCopy(resOpt, this.contents);
            // need to fix the parent refs
            if (copy.contents) {
                for (const cnt of copy.contents) {
                    if (cnt.getObjectType() == cdmObjectType.attributeContextDef) {
                        let parentRef = cnt.parent;
                        parentRef.explicitReference = copy;
                    }
                }
            }
            // if there is a map from ID to object, make a new one
            if (this.id2ctx) {
                copy.collectIdMap(undefined);
                // as a special issue, there may be other IDs in the map that point at this context 
                // (this is actually the whole point of using the map, so that we can redirect attributes to a new place on context copy / splice)
                // so, any entries in the source map that point at this context should get moved over to the copy
                this.id2ctx.forEach((v, k) => {
                    if (v === this)
                        copy.id2ctx.set(k, copy);
                });
            }
            this.copyDef(resOpt, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    collectIdMap(id2ctx) {
        //let bodyCode = () =>
        {
            if (!id2ctx) {
                // this must be the starting point, collect all mappings under this context and store here
                if (!this.id2ctx)
                    this.id2ctx = new Map();
                id2ctx = this.id2ctx;
            }
            if (this.id2ctx && this.id2ctx.size > 0) {
                // a map has been collected here before (any may even have extra, important mappings added), so just copy it.
                this.id2ctx.forEach((v, k) => { id2ctx.set(k, v); });
            }
            else {
                // fresh map, us and children
                id2ctx.set(this.ID, this);
                if (this.contents) {
                    for (const cnt of this.contents) {
                        if (cnt.getObjectType() == cdmObjectType.attributeContextDef) {
                            cnt.collectIdMap(id2ctx);
                        }
                    }
                }
            }
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let c = ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, object.name);
            c.type = AttributeContextImpl.mapTypeNameToEnum(object.type);
            if (object.parent)
                c.parent = cdmObject.createAttributeContextReference(ctx, object.parent);
            if (object.explanation)
                c.explanation = object.explanation;
            if (object.definition) {
                switch (c.type) {
                    case cdmAttributeContextType.entity:
                    case cdmAttributeContextType.entityReferenceExtends:
                        c.definition = cdmObject.createEntityReference(ctx, object.definition);
                        break;
                    case cdmAttributeContextType.attributeGroup:
                        c.definition = cdmObject.createAttributeGroupReference(ctx, object.definition);
                        break;
                    case cdmAttributeContextType.addedAttributeSupporting:
                    case cdmAttributeContextType.addedAttributeIdentity:
                    case cdmAttributeContextType.attributeDefinition:
                        c.definition = cdmObject.createAttributeReference(ctx, object.definition);
                        break;
                }
            }
            // i know the trait collection names look wrong. but I wanted to use the def baseclass
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.appliedTraits);
            if (object.contents) {
                c.contents = new Array();
                let l = object.contents.length;
                for (let i = 0; i < l; i++) {
                    const ct = object.contents[i];
                    if (typeof (ct) === "string")
                        c.contents.push(AttributeReferenceImpl.instanceFromData(ctx, ct));
                    else
                        c.contents.push(AttributeContextImpl.instanceFromData(ctx, ct));
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
    getRelativePath(resOpt) {
        let pre = "";
        if (this.parent) {
            let resParent = this.parent.getObjectDef(resOpt);
            if (resParent)
                pre = resParent.getRelativePath(resOpt) + "/";
        }
        return pre + this.name;
    }
    isDerivedFrom(resOpt, base) {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    static createChildUnder(resOpt, acp) {
        //let bodyCode = () =>
        {
            if (!acp)
                return undefined;
            if (acp.type === cdmAttributeContextType.passThrough)
                return acp.under;
            // this flag makes sure we hold on to any resolved object refs when things get coppied
            let resOptCopy = cdmObject.copyResolveOptions(resOpt);
            resOptCopy.saveResolutionsOnCopy = true;
            let definition;
            let rtsApplied;
            // get a simple reference to definition object to avoid getting the traits that might be part of this ref
            // included in the link to the definition.
            if (acp.regarding) {
                definition = acp.regarding.createSimpleReference(resOptCopy);
                // now get the traits applied at this reference (applied only, not the ones that are part of the definition of the object)
                // and make them the traits for this context
                if (acp.includeTraits)
                    rtsApplied = acp.regarding.getResolvedTraits(resOptCopy);
            }
            let underChild = acp.under.ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, acp.name);
            // need context to make this a 'live' object
            underChild.ctx = acp.under.ctx;
            underChild.docCreatedIn = acp.under.docCreatedIn;
            underChild.type = acp.type;
            underChild.definition = definition;
            // add traits if there are any
            if (rtsApplied && rtsApplied.set) {
                rtsApplied.set.forEach(rt => {
                    let traitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                    underChild.addExhibitedTrait(traitRef, typeof (traitRef) === "string");
                });
            }
            // add to parent
            underChild.setParent(resOptCopy, acp.under);
            return underChild;
        }
        //return p.measure(bodyCode);
    }
    setParent(resOpt, parent) {
        //let bodyCode = () =>
        {
            // will need a working reference to this as the parent
            let parentRef = this.ctx.corpus.MakeObject(cdmObjectType.attributeContextRef, parent.getRelativePath(resOpt), true);
            parentRef.explicitReference = parent;
            parentRef.docCreatedIn = parent.docCreatedIn; // setting this will let the 'localize references' code trace from any document back to where the parent is defined
            let parentContents = parent.getContentRefs();
            parentContents.push(this);
            this.parent = parentRef;
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityReferenceImpl extends cdmObjectRef {
    constructor(ctx, entityRef, simpleReference, appliedTraits) {
        super(ctx, entityRef, simpleReference, appliedTraits);
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
    copyRefData(resOpt, copy, refTo, options) {
        //let bodyCode = () =>
        {
            copy.entityReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    copyRefObject(resOpt, refTo, simpleReference) {
        //let bodyCode = () =>
        {
            let copy = new EntityReferenceImpl(this.ctx, refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
            return copy;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let simpleReference = true;
            let entity;
            let appliedTraits = null;
            if (typeof (object) == "string")
                entity = object;
            else {
                simpleReference = false;
                appliedTraits = object.appliedTraits;
                if (typeof (object.entityReference) === "string")
                    entity = object.entityReference;
                else if (isConstantEntity(object.entityReference))
                    entity = ConstantEntityImpl.instanceFromData(ctx, object.entityReference);
                else
                    entity = EntityImpl.instanceFromData(ctx, object.entityReference);
            }
            let c = new EntityReferenceImpl(ctx, entity, simpleReference, !!appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, appliedTraits);
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
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityImpl extends cdmObjectDef {
    constructor(ctx, entityName, extendsEntity, exhibitsTraits, hasAttributes) {
        super(ctx, exhibitsTraits);
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
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                explanation: this.explanation,
                entityName: this.entityName,
                extendsEntity: this.extendsEntity ? this.extendsEntity.copyData(resOpt, options) : undefined,
                exhibitsTraits: cdmObject.arraycopyData(resOpt, this.exhibitsTraits, options),
            };
            this.getTraitToPropertyMap().persistForEntityDef(castedToInterface, options);
            // after the properties so they show up first in doc
            castedToInterface.hasAttributes = cdmObject.arraycopyData(resOpt, this.hasAttributes, options);
            castedToInterface.attributeContext = this.attributeContext ? this.attributeContext.copyData(resOpt, options) : undefined;
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let copy = new EntityImpl(this.ctx, this.entityName, null, false, false);
            copy.extendsEntity = copy.extendsEntity ? this.extendsEntity.copy(resOpt) : undefined;
            copy.attributeContext = copy.attributeContext ? this.attributeContext.copy(resOpt) : undefined;
            copy.hasAttributes = cdmObject.arrayCopy(resOpt, this.hasAttributes);
            this.copyDef(resOpt, copy);
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
    static instanceFromData(ctx, object) {
        //let bodyCode = () =>
        {
            let extendsEntity;
            extendsEntity = cdmObject.createEntityReference(ctx, object.extendsEntity);
            let c = new EntityImpl(ctx, object.entityName, extendsEntity, !!object.exhibitsTraits, !!object.hasAttributes);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);
            if (object.attributeContext)
                c.attributeContext = cdmObject.createAttributeContext(ctx, object.attributeContext);
            c.hasAttributes = cdmObject.createAttributeArray(ctx, object.hasAttributes);
            c.t2pm = new traitToPropertyMap();
            c.t2pm.initForEntityDef(ctx, object, c);
            return c;
        }
        //return p.measure(bodyCode);
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
        this.t2pm.initForEntityDef(this.ctx, null, this);
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
    isDerivedFrom(resOpt, base) {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(resOpt, this.getExtendsEntityRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            // base traits then add any elevated from attributes then add things exhibited by the att.
            let base = this.getExtendsEntityRef();
            if (base) {
                // merge in all from base class
                rtsb.mergeTraits(base.getResolvedTraits(resOpt));
            }
            if (this.hasAttributes) {
                let rtsElevated = new ResolvedTraitSet(resOpt);
                let l = this.hasAttributes.length;
                for (let i = 0; i < l; i++) {
                    let att = this.hasAttributes[i];
                    let rtsAtt = att.getResolvedTraits(resOpt);
                    if (rtsAtt && rtsAtt.hasElevated) {
                        rtsElevated = rtsElevated.mergeSet(rtsAtt, true);
                    }
                }
                rtsb.mergeTraits(rtsElevated);
            }
            this.constructResolvedTraitsDef(null, rtsb, resOpt);
        }
        //return p.measure(bodyCode);
    }
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
            // the relationsip of the attribute, the attribute definition itself and included attribute groups, any traits applied to the attribute.
            this.rasb = new ResolvedAttributeSetBuilder();
            this.rasb.setAttributeContext(under);
            if (this.extendsEntity) {
                let extRef = this.getExtendsEntityRef();
                let extendsRefUnder;
                let acpExtEnt;
                if (under) {
                    let acpExt = {
                        under: under,
                        type: cdmAttributeContextType.entityReferenceExtends,
                        name: "extends",
                        regarding: null,
                        includeTraits: false
                    };
                    extendsRefUnder = this.rasb.createAttributeContext(resOpt, acpExt);
                    acpExtEnt = {
                        under: extendsRefUnder,
                        type: cdmAttributeContextType.entity,
                        name: extRef.getObjectDefName(),
                        regarding: extRef,
                        includeTraits: false
                    };
                }
                this.rasb.mergeAttributes(this.getExtendsEntityRef().getResolvedAttributes(resOpt, acpExtEnt));
            }
            this.rasb.markInherited();
            this.rasb.setAttributeContext(under);
            if (this.hasAttributes) {
                let l = this.hasAttributes.length;
                for (let i = 0; i < l; i++) {
                    let att = this.hasAttributes[i];
                    let attUnder = under;
                    let acpAtt;
                    if (under) {
                        acpAtt = {
                            under: under,
                            type: cdmAttributeContextType.attributeDefinition,
                            name: att.getObjectDefName(),
                            regarding: att,
                            includeTraits: false
                        };
                    }
                    this.rasb.mergeAttributes(att.getResolvedAttributes(resOpt, acpAtt));
                }
            }
            this.rasb.markOrder();
            this.rasb.setAttributeContext(under);
            // things that need to go away
            this.rasb.removeRequestedAtts();
            return this.rasb;
        }
        //return p.measure(bodyCode);
    }
    countInheritedAttributes(resOpt) {
        //let bodyCode = () =>
        {
            // ensures that cache exits
            this.getResolvedAttributes(resOpt);
            return this.rasb.inheritedMark;
        }
        //return p.measure(bodyCode);
    }
    getResolvedEntity(resOpt) {
        return new ResolvedEntity(resOpt, this);
    }
    getResolvedEntityReferences(resOpt) {
        //let bodyCode = () =>
        {
            // this whole resolved entity ref goo will go away when resolved documents are done.
            // for now, it breaks if structured att sets get made.
            resOpt = cdmObject.copyResolveOptions(resOpt);
            resOpt.directives = new TraitDirectiveSet(new Set(["normalized", "referenceOnly"]));
            let ctx = this.ctx; // what it actually is
            let entRefSetCache = ctx.getCache(this, resOpt, "entRefSet");
            if (!entRefSetCache) {
                entRefSetCache = new ResolvedEntityReferenceSet(resOpt);
                // get from any base class and then 'fix' those to point here instead.
                let extRef = this.getExtendsEntityRef();
                if (extRef) {
                    let extDef = extRef.getObjectDef(resOpt);
                    if (extDef) {
                        if (extDef === this)
                            extDef = extRef.getObjectDef(resOpt);
                        let inherited = extDef.getResolvedEntityReferences(resOpt);
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
                        let sub = this.hasAttributes[i].getResolvedEntityReferences(resOpt);
                        if (sub) {
                            sub.set.forEach((res) => {
                                res.referencing.entity = this;
                            });
                            entRefSetCache.add(sub);
                        }
                    }
                }
                ctx.setCache(this, resOpt, "entRefSet", entRefSetCache);
            }
            return entRefSetCache;
        }
        //return p.measure(bodyCode);
    }
    getAttributesWithTraits(resOpt, queryFor) {
        //let bodyCode = () =>
        {
            return this.getResolvedAttributes(resOpt).getAttributesWithTraits(resOpt, queryFor);
        }
        //return p.measure(bodyCode);
    }
    createResolvedEntity(resOpt, newEntName) {
        //let bodyCode = () =>
        {
            // make the top level attribute context for this entity
            let entName = newEntName;
            let ctx = this.ctx;
            let attCtxEnt = ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, entName, true);
            attCtxEnt.ctx = ctx;
            attCtxEnt.docCreatedIn = this.docCreatedIn;
            // cheating a bit to put the paths in the right place
            let acp = {
                under: attCtxEnt,
                type: cdmAttributeContextType.attributeGroup,
                name: "attributeContext"
            };
            let attCtxAC = AttributeContextImpl.createChildUnder(resOpt, acp);
            let acpEnt = {
                under: attCtxAC,
                type: cdmAttributeContextType.entity,
                name: entName,
                regarding: ctx.corpus.MakeObject(cdmObjectType.entityRef, this.getName(), true)
            };
            // use this whenever we need to keep references pointing at things that were already found. used when 'fixing' references by localizing to a new document
            let resOptCopy = cdmObject.copyResolveOptions(resOpt);
            resOptCopy.saveResolutionsOnCopy = true;
            // resolve attributes with this context. the end result is that each resolved attribute
            // points to the level of the context where it was created
            let ras = this.getResolvedAttributes(resOptCopy, acpEnt);
            // will be making some destructive changes, so swap in a copy
            let attCtx = attCtxAC.getContentRefs()[0].copy(resOptCopy);
            attCtxAC.getContentRefs().splice(0);
            attCtx.setParent(resOpt, attCtxAC);
            // the context should now contain a mapping from ID to context node. the resolved attributes will use these IDs
            let id2ctx = attCtx.id2ctx;
            // the attributes have been named, shaped, etc for this entity so now it is safe to go and 
            // make each attribute context level point at these final versions of attributes
            let attPath2Order = new Map();
            let pointContextAtResolvedAtts = (rasSub, path) => {
                rasSub.set.forEach(ra => {
                    let raCtx = id2ctx.get(ra.createdContextId);
                    if (raCtx) {
                        let refs = raCtx.getContentRefs();
                        // this won't work when I add the structured attributes to avoid name collisions
                        let attRefPath = path + ra.resolvedName;
                        if (ra.target.getObjectType) {
                            let attRef = this.ctx.corpus.MakeObject(cdmObjectType.attributeRef, attRefPath, true);
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
            let rtsEnt = this.getResolvedTraits(resOpt);
            rtsEnt.set.forEach(rt => {
                let traitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
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
                    // use the path of the context associated with this attribute to find the new context that matches on path
                    let raCtx = id2ctx.get(ra.createdContextId);
                    if (ra.target.set) {
                        // this is a set of attributes.
                        // make an attribute group to hold them
                        let attGrp = this.ctx.corpus.MakeObject(cdmObjectType.attributeGroupDef, ra.resolvedName);
                        attGrp.attributeContext = this.ctx.corpus.MakeObject(cdmObjectType.attributeContextRef, raCtx.getRelativePath(resOpt), true);
                        // take any traits from the set and make them look like traits exhibited by the group
                        let avoidSet = ctx2traitNames.get(raCtx);
                        let rtsAtt = ra.resolvedTraits;
                        rtsAtt.set.forEach(rt => {
                            if (!rt.trait.ugly) {
                                if (avoidSet && !avoidSet.has(rt.traitName)) {
                                    let traitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                                    attGrp.addExhibitedTrait(traitRef, typeof (traitRef) === "string");
                                }
                            }
                        });
                        // wrap it in a reference and then recurse with this as the new container
                        let attGrpRef = this.ctx.corpus.MakeObject(cdmObjectType.attributeGroupRef, undefined);
                        attGrpRef.setObjectDef(attGrp);
                        container.addAttributeDef(attGrpRef);
                        // isn't this where ...
                        addAttributes(ra.target, attGrp, attPath + '/members/');
                    }
                    else {
                        let att = this.ctx.corpus.MakeObject(cdmObjectType.typeAttributeDef, ra.resolvedName);
                        att.attributeContext = this.ctx.corpus.MakeObject(cdmObjectType.attributeContextRef, raCtx.getRelativePath(resOpt), true);
                        let avoidSet = ctx2traitNames.get(raCtx);
                        let rtsAtt = ra.resolvedTraits;
                        rtsAtt.set.forEach(rt => {
                            if (!rt.trait.ugly) {
                                if (avoidSet && !avoidSet.has(rt.traitName)) {
                                    let traitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
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
            let replaceTraitAttRef = (tr, entityHint) => {
                if (tr.getArgumentDefs()) {
                    tr.getArgumentDefs().forEach(arg => {
                        let v = arg.getValue();
                        // is this an attribute reference?
                        if (v && v.getObjectType && v.getObjectType() == cdmObjectType.attributeRef) {
                            // only try this if the reference has no path to it (only happens with intra-entity att refs)
                            let attRef = v;
                            if (attRef.namedReference && attRef.namedReference.indexOf('/') == -1) {
                                // get the attribute by name from the resolved atts of this entity
                                let found = ras.get(attRef.namedReference);
                                //change it
                                if (found) {
                                    let attRefPath = resAtt2RefPath.get(found);
                                    arg.setValue(this.ctx.corpus.MakeObject(cdmObjectType.attributeRef, attRefPath, true));
                                }
                                else {
                                    // give a promise that can be worked out later. assumption is that the attribute must come from this entity.
                                    arg.setValue(this.ctx.corpus.MakeObject(cdmObjectType.attributeRef, entityHint + "/(resolvedAttributes)/" + attRef.namedReference, true));
                                }
                            }
                        }
                    });
                }
            };
            // fix entity traits
            if (entResolved.getExhibitedTraitRefs())
                entResolved.getExhibitedTraitRefs().forEach(et => {
                    replaceTraitAttRef(et, newEntName);
                });
            // fix context traits
            let fixContextTraits = (subAttCtx, entityHint) => {
                let traitsHere = subAttCtx.getExhibitedTraitRefs();
                if (traitsHere)
                    traitsHere.forEach((tr) => { replaceTraitAttRef(tr, entityHint); });
                subAttCtx.getContentRefs().forEach((cr) => {
                    if (cr.getObjectType() == cdmObjectType.attributeContextDef) {
                        // if this is a new entity context, get the name to pass along
                        let subSubAttCtx = cr;
                        let subEntityHint = entityHint;
                        if (subSubAttCtx.type === cdmAttributeContextType.entity)
                            subEntityHint = subSubAttCtx.definition.getObjectDefName();
                        // do this for all types
                        fixContextTraits(subSubAttCtx, subEntityHint);
                    }
                });
            };
            fixContextTraits(attCtx, newEntName);
            // and the attribute traits
            let entAtts = entResolved.getHasAttributeDefs();
            if (entAtts) {
                let l = entAtts.length;
                for (let i = 0; i < l; i++) {
                    let attTraits = entAtts[i].getAppliedTraitRefs();
                    if (attTraits)
                        attTraits.forEach((tr) => replaceTraitAttRef(tr, newEntName));
                }
            }
            // we are about to put this content created in the context of various documents (like references to attributes from base entities, etc.)
            // into one specific document. all of the borrowed refs need to work. so, re-write all string references to work from this new document
            // the catch-22 is that the new document needs these fixes done before it can be used to make these fixes. but it imports the 
            // source doc without a moniker, so the results are the same from that pov
            ctx.corpus.localizeReferences(resOpt, docRes);
            // trigger the document to refresh current content into the resolved OM
            attCtx.parent = undefined; // remove the fake parent that made the paths work
            let resOptNew = cdmObject.copyResolveOptions(resOpt);
            resOptNew.wrtDoc = docRes;
            docRes.refresh(resOptNew);
            // get a fresh ref
            entResolved = docRes.getObjectFromDocumentPath(entName);
            return entResolved;
        }
        //return p.measure(bodyCode);
    }
}
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
class DocumentImpl extends cdmObjectSimple {
    constructor(ctx, name, hasImports) {
        super(ctx);
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
    }
    getObjectType() {
        //let bodyCode = () =>
        {
            return cdmObjectType.documentDef;
        }
        //return p.measure(bodyCode);
    }
    getObjectDef(resOpt) {
        return null;
    }
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            let castedToInterface = {
                schema: this.schema,
                schemaVersion: this.schemaVersion,
                imports: cdmObject.arraycopyData(resOpt, this.imports, options),
                definitions: cdmObject.arraycopyData(resOpt, this.definitions, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    copy(resOpt) {
        //let bodyCode = () =>
        {
            let c = new DocumentImpl(this.ctx, this.name, (this.imports && this.imports.length > 0));
            c.ctx = this.ctx;
            c.path = this.path;
            c.schema = this.schema;
            c.schemaVersion = this.schemaVersion;
            c.definitions = cdmObject.arrayCopy(resOpt, this.definitions);
            c.imports = cdmObject.arrayCopy(resOpt, this.imports);
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
    constructResolvedAttributes(resOpt, under) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    constructResolvedTraits(rtsb, resOpt) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    static instanceFromData(ctx, name, path, object) {
        //let bodyCode = () =>
        {
            let doc = new DocumentImpl(ctx, name, object.imports);
            doc.path = path;
            // set this as the current doc of the context for this operation
            ctx.currentDoc = doc;
            if (object.$schema)
                doc.schema = object.$schema;
            if (object.jsonSchemaSemanticVersion)
                doc.schemaVersion = object.jsonSchemaSemanticVersion;
            if (object.imports) {
                let l = object.imports.length;
                for (let i = 0; i < l; i++) {
                    doc.imports.push(ImportImpl.instanceFromData(ctx, object.imports[i]));
                }
            }
            if (object.definitions) {
                let l = object.definitions.length;
                for (let i = 0; i < l; i++) {
                    const d = object.definitions[i];
                    if (d.dataTypeName)
                        doc.definitions.push(DataTypeImpl.instanceFromData(ctx, d));
                    else if (d.relationshipName)
                        doc.definitions.push(RelationshipImpl.instanceFromData(ctx, d));
                    else if (d.attributeGroupName)
                        doc.definitions.push(AttributeGroupImpl.instanceFromData(ctx, d));
                    else if (d.traitName)
                        doc.definitions.push(TraitImpl.instanceFromData(ctx, d));
                    else if (d.entityShape)
                        doc.definitions.push(ConstantEntityImpl.instanceFromData(ctx, d));
                    else if (d.entityName)
                        doc.definitions.push(EntityImpl.instanceFromData(ctx, d));
                }
            }
            ctx.currentDoc = undefined;
            return doc;
        }
        //return p.measure(bodyCode);
    }
    addImport(corpusPath, moniker) {
        //let bodyCode = () =>
        {
            if (!this.imports)
                this.imports = new Array();
            let i = new ImportImpl(this.ctx, corpusPath, moniker);
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
            let newObj = this.ctx.corpus.MakeObject(ofType, name);
            if (newObj != null) {
                this.definitions.push(newObj);
                newObj.docCreatedIn = this;
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
    refresh(resOpt) {
        //let bodyCode = () =>
        {
            // make the corpus internal machinery pay attention to this document for this call
            let corpus = this.folder.corpus;
            let oldDoc = corpus.ctx.currentDoc;
            corpus.ctx.currentDoc = this;
            // remove all of the cached paths and resolved pointers
            this.visit("", null, (iObject, path) => {
                iObject.declaredPath = undefined;
                return false;
            });
            // clear old cached things for this doc
            this.clearCaches();
            // this is the minimum set of steps needed to get an object to the point where references will resolve to objects in the corpus
            // index any imports
            corpus.resolveDocumentImports(this, null);
            this.prioritizeImports(undefined, 0, undefined);
            // check basic integrity
            corpus.checkObjectIntegrity();
            // declare definitions of objects in this doc
            corpus.declareObjectDefinitions("");
            // make sure we can find everything that is named by reference
            corpus.resolveObjectDefinitions(resOpt);
            // now resolve any trait arguments that are type object
            corpus.resolveTraitArguments(resOpt);
            // finish up
            corpus.finishDocumentResolve();
            // go back to what you had before
            corpus.ctx.currentDoc = oldDoc;
        }
        //return p.measure(bodyCode);
    }
    prioritizeImports(priorityMap, sequence, monikerMap, skipThis = false, skipMonikered = false) {
        //let bodyCode = () =>
        {
            // goal is to make a map from the reverse order of imports (depth first) to the sequence number in that list
            // since the 'last' definition for a duplicate symbol wins, the lower in this list a document shows up, the higher priority its definitions are for
            // resolving conflicts
            if (priorityMap == undefined) {
                this.importPriority = new Map();
                priorityMap = this.importPriority;
            }
            if (monikerMap == undefined) {
                this.monikerPriorityMap = new Map();
                monikerMap = this.monikerPriorityMap;
            }
            // if already in list, don't do this again
            if (priorityMap.has(this))
                return sequence;
            if (skipThis == false) {
                // remember the sequence this way put in the list
                priorityMap.set(this, sequence);
                sequence++;
            }
            // may have avoided this level, but don't avoid deeper. this flag is used to get the dependencies from moniker imports without getting the import itself
            skipThis = false;
            if (this.imports) {
                let l = this.imports.length;
                // reverse order
                for (let i = l - 1; i >= 0; i--) {
                    const imp = this.imports[i];
                    // don't add the moniker imports to the priority list, but do add the dependencies of them. when doing that, don't include the monikered imports of the dependencies in our map.
                    let isMoniker = !!imp.moniker;
                    if (imp.doc) {
                        sequence = imp.doc.prioritizeImports(priorityMap, sequence, monikerMap, isMoniker, isMoniker);
                    }
                }
                // skip the monikered imports from here if this is a monikered import itself and we are only collecting the dependencies 
                if (skipMonikered == false) {
                    // moniker imports are prioritized by the 'closest' use of the moniker to the starting doc. so last one found in this recursion
                    for (let i = 0; i < l; i++) {
                        const imp = this.imports[i];
                        if (imp.doc && imp.moniker) {
                            monikerMap.set(imp.moniker, imp.doc);
                        }
                    }
                }
            }
            return sequence;
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
    getPathsToOtherDocuments() {
        //let bodyCode = () =>
        {
            if (!this.pathsToOtherDocuments) {
                this.pathsToOtherDocuments = new Map();
                // found directly
                if (this.importPriority) {
                    for (const otherDoc of this.importPriority.keys()) {
                        this.pathsToOtherDocuments.set(otherDoc, "");
                    }
                }
                // found only through a moniker
                if (this.monikerPriorityMap) {
                    this.monikerPriorityMap.forEach((v, k) => {
                        if (!this.pathsToOtherDocuments.has(v)) {
                            // not seen this doc any other way
                            this.pathsToOtherDocuments.set(v, k + '/');
                            // look through the list of docs it knows about, and add ones here that we've never seen
                            let monikeredOthers = v.getPathsToOtherDocuments();
                            // need a way to make this fast
                            monikeredOthers.forEach((vo, ko) => {
                                // never seen?
                                if (!this.pathsToOtherDocuments.has(ko))
                                    this.pathsToOtherDocuments.set(ko, k + '/' + vo);
                            });
                        }
                    });
                }
            }
            return this.pathsToOtherDocuments;
        }
        //return p.measure(bodyCode);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {folderDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class FolderImpl extends cdmObjectSimple {
    constructor(ctx, corpus, name, parentPath) {
        super(ctx);
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
            let newFolder = new FolderImpl(this.ctx, this.corpus, name, this.relativePath);
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
                doc = DocumentImpl.instanceFromData(this.ctx, name, this.relativePath, new DocumentImpl(this.ctx, name, false));
            else if (typeof (content) === "string")
                doc = DocumentImpl.instanceFromData(this.ctx, name, this.relativePath, JSON.parse(content));
            else
                doc = DocumentImpl.instanceFromData(this.ctx, name, this.relativePath, content);
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
        //let bodyCode = () =>
        {
            if (this.documentLookup.has(name)) {
                this.corpus.removeDocumentObjects(this, this.documentLookup.get(name));
                this.documents.splice(this.documents.findIndex((d) => d.getName() == name), 1);
                this.documentLookup.delete(name);
            }
        }
        //return p.measure(bodyCode);
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
    getObjectDef(resOpt) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    copyData(resOpt, options) {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getResolvedTraits(resOpt) {
        //let bodyCode = () =>
        {
            return null;
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
    copy(resOpt) {
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
////////////////////////////////////////////////////////////////////////////////////////////////////
//  {Corpus}
////////////////////////////////////////////////////////////////////////////////////////////////////
class resolveContextScope {
}
class resolveContext {
    constructor(corpus, statusRpt, reportAtLevel, errorAtLevel) {
        this.reportAtLevel = reportAtLevel;
        this.errorAtLevel = errorAtLevel;
        this.statusRpt = statusRpt;
        this.cache = new Map();
        this.corpus = corpus;
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
    getCache(forObj, resOpt, kind) {
        //let bodyCode = () =>
        {
            let key = forObj.ID.toString() + "_" + (resOpt && resOpt.wrtDoc ? resOpt.wrtDoc.ID.toString() : "NULL") + "_" + kind;
            let res = this.cache.get(key);
            return res;
        }
        //return p.measure(bodyCode);
    }
    setCache(forObj, resOpt, kind, value) {
        //let bodyCode = () =>
        {
            let key = forObj.ID.toString() + "_" + (resOpt && resOpt.wrtDoc ? resOpt.wrtDoc.ID.toString() : "NULL") + "_" + kind;
            this.cache.set(key, value);
        }
        //return p.measure(bodyCode);
    }
}
class CorpusImpl extends FolderImpl {
    constructor(rootPath) {
        super(null, null, "", "");
        //let bodyCode = () =>
        {
            this.corpus = this; // well ... it is
            this.rootPath = rootPath;
            this.allDocuments = new Array();
            this.pathLookup = new Map();
            this.directory = new Map();
            this.symbolDefinitions = new Map();
            this.defintionReferenceDocuments = new Map();
            this.defintionWrtTag = new Map();
            this.emptyRTS = new Map();
            this.ctx = new resolveContext(this, (level, msg, path) => {
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
    getEmptyResolvedTraitSet(resOpt) {
        //let bodyCode = () =>
        {
            let key = "";
            if (resOpt) {
                if (resOpt.wrtDoc)
                    key = resOpt.wrtDoc.ID.toString();
                key += "-";
                if (resOpt.directives)
                    key += resOpt.directives.getTag();
            }
            let rts = this.emptyRTS.get(key);
            if (!rts) {
                rts = new ResolvedTraitSet(resOpt);
                this.emptyRTS.set(key, rts);
            }
            return rts;
        }
        //return p.measure(bodyCode);
    }
    registerSymbol(symbol, inDoc) {
        //let bodyCode = () =>
        {
            let docs = this.symbolDefinitions.get(symbol);
            if (!docs) {
                docs = new Array();
                this.symbolDefinitions.set(symbol, docs);
            }
            docs.push(inDoc);
        }
        //return p.measure(bodyCode);
    }
    unRegisterSymbol(symbol, inDoc) {
        //let bodyCode = () =>
        {
            let docs = this.symbolDefinitions.get(symbol);
            if (docs) {
                let index = docs.indexOf(inDoc);
                docs.splice(index, 1);
            }
        }
        //return p.measure(bodyCode);
    }
    docsForSymbol(wrtDoc, fromDoc, symbol) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            let result = { newSymbol: symbol };
            // first decision, is the symbol defined anywhere?
            result.docList = this.symbolDefinitions.get(symbol);
            if (!result.docList || result.docList.length === 0) {
                // this can happen when the symbol is disambiguated with a moniker for one of the imports used 
                // in this situation, the 'wrt' needs to be ignored, the document where the reference is being made has a map of the 'one best' monikered import to search for each moniker
                let preEnd = symbol.indexOf('/');
                if (preEnd == 0) {
                    // absolute refererence
                    ctx.statusRpt(cdmStatusLevel.error, `no support for absolute references yet. fix '${symbol}'`, ctx.relativePath);
                    return undefined;
                }
                if (preEnd > 0) {
                    let prefix = symbol.slice(0, preEnd);
                    result.newSymbol = symbol.slice(preEnd + 1);
                    if (fromDoc && fromDoc.monikerPriorityMap && fromDoc.monikerPriorityMap.has(prefix)) {
                        result.docBest = fromDoc.monikerPriorityMap.get(prefix);
                    }
                    else if (wrtDoc.monikerPriorityMap && wrtDoc.monikerPriorityMap.has(prefix)) {
                        // if that didn't work, then see if the wrtDoc can find the moniker
                        result.docBest = wrtDoc.monikerPriorityMap.get(prefix);
                    }
                }
            }
            return result;
        }
        //return p.measure(bodyCode);
    }
    resolveSymbolReference(resOpt, fromDoc, symbol, expectedType) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            // given a symbolic name, find the 'highest prirority' definition of the object from the point of view of a given document (with respect to, wrtDoc)
            // (meaning given a document and the things it defines and the files it imports and the files they import, where is the 'last' definition found)
            if (!resOpt || !resOpt.wrtDoc)
                return undefined; // no way to figure this out
            let wrtDoc = resOpt.wrtDoc;
            // get the array of documents where the symbol is defined
            let docsResult = this.docsForSymbol(wrtDoc, fromDoc, symbol);
            let docBest = docsResult.docBest;
            symbol = docsResult.newSymbol;
            let docs = docsResult.docList;
            if (docs) {
                // for the given doc, there is a sorted list of imported docs (including the doc itself as item 0).
                // find the lowest number imported document that has a definition for this symbol
                let importPriority = wrtDoc.importPriority;
                if (!importPriority || importPriority.size === 0)
                    return undefined; // need to index imports first, should have happened
                let indexBest = Number.MAX_SAFE_INTEGER;
                for (const docDefined of docs) {
                    // is this one of the imported docs?
                    let indexFound = importPriority.get(docDefined);
                    if (indexFound < indexBest) {
                        indexBest = indexFound;
                        docBest = docDefined;
                        if (indexBest === 0)
                            break; // hard to be better than the best
                    }
                }
            }
            // perhaps we have never heard of this symbol in the imports for this document?
            if (!docBest)
                return undefined;
            // return the definition found in the best document
            let found = docBest.internalDeclarations.get(symbol);
            if (found && expectedType != cdmObjectType.error) {
                switch (expectedType) {
                    case cdmObjectType.traitRef:
                        if (!(found.objectType === cdmObjectType.traitDef)) {
                            ctx.statusRpt(cdmStatusLevel.error, "expected type trait", symbol);
                            found = null;
                        }
                        break;
                    case cdmObjectType.dataTypeRef:
                        if (!(found.objectType === cdmObjectType.dataTypeDef)) {
                            ctx.statusRpt(cdmStatusLevel.error, "expected type dataType", symbol);
                            found = null;
                        }
                        break;
                    case cdmObjectType.entityRef:
                        if (!(found.objectType === cdmObjectType.entityDef)) {
                            ctx.statusRpt(cdmStatusLevel.error, "expected type entity", symbol);
                            found = null;
                        }
                        break;
                    case cdmObjectType.parameterDef:
                        if (!(found.objectType === cdmObjectType.parameterDef)) {
                            ctx.statusRpt(cdmStatusLevel.error, "expected type parameter", symbol);
                            found = null;
                        }
                        break;
                    case cdmObjectType.relationshipRef:
                        if (!(found.objectType === cdmObjectType.relationshipDef)) {
                            ctx.statusRpt(cdmStatusLevel.error, "expected type relationship", symbol);
                            found = null;
                        }
                        break;
                    case cdmObjectType.attributeGroupRef:
                        if (!(found.objectType === cdmObjectType.attributeGroupDef)) {
                            ctx.statusRpt(cdmStatusLevel.error, "expected type attributeGroup", symbol);
                            found = undefined;
                        }
                        break;
                }
            }
            return found;
        }
        //return p.measure(bodyCode);
    }
    registerDefinitionReferenceDocuments(definition, docRefSet) {
        //let bodyCode = () =>
        {
            if (docRefSet.size > 1) {
                this.defintionReferenceDocuments.set(definition, docRefSet);
            }
        }
        //return p.measure(bodyCode);
    }
    unRegisterDefinitionReferenceDocuments(definition) {
        //let bodyCode = () =>
        {
            this.defintionReferenceDocuments.delete(definition);
        }
        //return p.measure(bodyCode);
    }
    getDefinitionCacheTag(resOpt, definition, kind, extraTags = "", useNameNotId = false) {
        //let bodyCode = () =>
        {
            // construct a tag that is unique for a given object in a given context
            // context is: 
            //   (1) the wrtDoc has a set of imports and defintions that may change what the object is point at
            //   (2) there are different kinds of things stored per object (resolved traits, atts, etc.)
            //   (3) the directives from the resolve Options might matter
            //   (4) sometimes the caller needs different caches (extraTags) even give 1-3 are the same
            // the hardest part is (1). To do this, see if the object has a set of reference documents registered.
            // if there is nothing registered, then there is only one possible way to resolve the object so don't include doc info in the tag.
            // if there IS something registered, then the object could be ambiguous. find the 'index' of each of the ref documents (potential definition of something referenced under this scope)
            // in the wrt document's list of imports. sort the ref docs by their index, the relative ordering of found documents makes a unique context.
            // the hope is that many, many different lists of imported files will result in identical reference sortings, so lots of re-use
            // since this is an expensive operation, actually cache the sorted list associated with this object and wrtDoc
            // easy stuff first
            let thisId;
            if (useNameNotId)
                thisId = definition.getObjectDefName();
            else
                thisId = definition.ID.toString();
            let tagSuffix = `-${kind}-${thisId}`;
            tagSuffix += `-(${resOpt.directives ? resOpt.directives.getTag() : ""})`;
            if (extraTags)
                tagSuffix += `-${extraTags}`;
            // is there a registered set? (for the objectdef, not for a reference) of the many documents involved in defining this thing (might be none)
            let docsRef = this.defintionReferenceDocuments.get(definition.getObjectDef(resOpt));
            if (docsRef) {
                // already solved this?
                let cacheTagCacheTag = "";
                for (const d of docsRef)
                    cacheTagCacheTag += "-" + d.ID.toString();
                cacheTagCacheTag += resOpt.wrtDoc ? resOpt.wrtDoc.ID.toString() : "none";
                let tagPre = this.defintionWrtTag.get(cacheTagCacheTag);
                if (!tagPre) {
                    // need to figure it out
                    if (resOpt.wrtDoc) {
                        let wrtDoc = resOpt.wrtDoc;
                        tagPre = "using (";
                        let importPriority = wrtDoc.importPriority;
                        if (importPriority) {
                            // find each ref in the set of imports and store a list
                            let foundRefs = new Array();
                            for (const docRef of docsRef) {
                                let iFound = importPriority.get(docRef);
                                if (iFound != undefined) {
                                    foundRefs.push([iFound, docRef]);
                                }
                            }
                            // sort that and make a list
                            foundRefs.sort((l, r) => { return l["0"] - r["0"]; }).forEach(r => { tagPre += "-" + r["1"].ID.toString(); });
                        }
                        tagPre += ") ";
                    }
                    else {
                        tagPre = "using nothing ";
                    }
                    // remember
                    this.defintionWrtTag.set(cacheTagCacheTag, tagPre);
                }
                return tagPre + tagSuffix;
            }
            else
                return tagSuffix;
        }
        //return p.measure(bodyCode);
    }
    MakeRef(ofType, refObj, simpleNameRef) {
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
    MakeObject(ofType, nameOrRef, simmpleNameRef) {
        //let bodyCode = () =>
        {
            let newObj = null;
            switch (ofType) {
                case cdmObjectType.argumentDef:
                    newObj = new ArgumentImpl(this.ctx);
                    newObj.name = nameOrRef;
                    break;
                case cdmObjectType.attributeGroupDef:
                    newObj = new AttributeGroupImpl(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.attributeGroupRef:
                    newObj = new AttributeGroupReferenceImpl(this.ctx, nameOrRef, simmpleNameRef);
                    break;
                case cdmObjectType.constantEntityDef:
                    newObj = new ConstantEntityImpl(this.ctx);
                    newObj.constantEntityName = nameOrRef;
                    break;
                case cdmObjectType.dataTypeDef:
                    newObj = new DataTypeImpl(this.ctx, nameOrRef, null, false);
                    break;
                case cdmObjectType.dataTypeRef:
                    newObj = new DataTypeReferenceImpl(this.ctx, nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.documentDef:
                    newObj = new DocumentImpl(this.ctx, name, false);
                    break;
                case cdmObjectType.entityAttributeDef:
                    newObj = new EntityAttributeImpl(this.ctx, nameOrRef, false);
                    break;
                case cdmObjectType.entityDef:
                    newObj = new EntityImpl(this.ctx, nameOrRef, null, false, false);
                    break;
                case cdmObjectType.entityRef:
                    newObj = new EntityReferenceImpl(this.ctx, nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.import:
                    newObj = new ImportImpl(this.ctx, nameOrRef, undefined);
                    break;
                case cdmObjectType.parameterDef:
                    newObj = new ParameterImpl(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.relationshipDef:
                    newObj = new RelationshipImpl(this.ctx, nameOrRef, null, false);
                    break;
                case cdmObjectType.relationshipRef:
                    newObj = new RelationshipReferenceImpl(this.ctx, nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.traitDef:
                    newObj = new TraitImpl(this.ctx, nameOrRef, null, false);
                    break;
                case cdmObjectType.traitRef:
                    newObj = new TraitReferenceImpl(this.ctx, nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.typeAttributeDef:
                    newObj = new TypeAttributeImpl(this.ctx, nameOrRef, false);
                    break;
                case cdmObjectType.attributeContextDef:
                    newObj = new AttributeContextImpl(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.attributeContextRef:
                    newObj = new AttributeContextReferenceImpl(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.attributeRef:
                    newObj = new AttributeReferenceImpl(this.ctx, nameOrRef, simmpleNameRef);
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
        //let bodyCode = () =>
        {
            let doc = docDef;
            // don't worry about defintionWrtTag because it uses the doc ID that won't get re-used in this session unless there are more than 4 billion objects
            // every symbol defined in this document is pointing at the document, so remove from cache.
            // also remove the list of docs that it depends on
            this.removeObjectDefinitions(doc);
            // remove from path lookup, folder lookup and global list of documents
            let path = doc.path + doc.name;
            if (this.pathLookup.has(path)) {
                this.pathLookup.delete(path);
                this.directory.delete(doc);
                let index = this.allDocuments.indexOf([folder, doc]);
                this.allDocuments.splice(index, 1);
            }
        }
        //return p.measure(bodyCode);
    }
    addDocumentFromContent(corpusPath, content) {
        //let bodyCode = () =>
        {
            let last = corpusPath.lastIndexOf('/');
            if (last < 0)
                throw new Error("bad path");
            let name = corpusPath.slice(last + 1);
            let path = corpusPath.slice(0, last + 1);
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
                        let path = imp.corpusPath;
                        if (path.charAt(0) != '/')
                            path = doc.folder.getRelativePath() + imp.corpusPath;
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
        let ctx = this.ctx;
        ctx.reportAtLevel = reportAtLevel;
        ctx.errorAtLevel = errorAtLevel;
        ctx.errors = 0;
        ctx.statusRpt =
            (level, msg, path) => {
                if (level >= ctx.errorAtLevel)
                    ctx.errors++;
                if (level >= ctx.reportAtLevel)
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
                let ctx = this.ctx;
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
                                    ctx.statusRpt(cdmStatusLevel.progress, `resolved import '${success[0]}'`, "");
                                    // if this is the last import, check to see if more are needed now and recurse 
                                    if (missingSet.size == 0) {
                                        missingSet = this.listMissingImports();
                                        turnMissingImportsIntoClientPromises();
                                    }
                                }
                            }, (fail) => {
                                result = false;
                                // something went wrong with one of the imports, give up on all of it
                                ctx.statusRpt(cdmStatusLevel.error, `failed to import '${fail[0]}' for reason : ${fail[1]}`, this.getRelativePath());
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
    localizeReferences(resOpt, content) {
        //let bodyCode = () =>
        {
            // call visit with no callbacks, this will make everthing has a declared path
            content.visit("", null, null);
            // get the paths to other documents fro this pov
            let docPath = resOpt.wrtDoc.getPathsToOtherDocuments();
            content.visit("", (iObject, path) => {
                let ot = iObject.objectType;
                switch (ot) {
                    case cdmObjectType.attributeRef:
                    case cdmObjectType.attributeGroupRef:
                    case cdmObjectType.attributeContextRef:
                    case cdmObjectType.dataTypeRef:
                    case cdmObjectType.entityRef:
                    case cdmObjectType.relationshipRef:
                    case cdmObjectType.traitRef:
                        let ref = iObject;
                        if (ref.namedReference && ref.explicitReference) {
                            let defDoc = ref.explicitReference.declaredInDocument;
                            let newIdentifier = docPath.get(defDoc);
                            if (newIdentifier != undefined) {
                                newIdentifier += ref.explicitReference.declaredPath;
                                ref.namedReference = newIdentifier;
                            }
                        }
                        break;
                }
                return false;
            }, null);
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
                iObject.docCreatedIn = ctx.currentDoc;
                if (path.indexOf("(unspecified)") > 0)
                    return true;
                switch (iObject.objectType) {
                    case cdmObjectType.entityDef:
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
                        this.registerSymbol(path, ctx.currentDoc);
                        ctx.statusRpt(cdmStatusLevel.info, `declared '${path}'`, corpusPath);
                        break;
                }
                return false;
            }, null);
        }
        //return p.measure(bodyCode);
    }
    removeObjectDefinitions(doc) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            doc.internalDeclarations = undefined;
            doc.visit("", (iObject, path) => {
                iObject.docCreatedIn = ctx.currentDoc;
                if (path.indexOf("(unspecified)") > 0)
                    return true;
                switch (iObject.objectType) {
                    case cdmObjectType.entityDef:
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
                        this.unRegisterSymbol(path, doc);
                        this.unRegisterDefinitionReferenceDocuments(iObject);
                        break;
                }
                return false;
            }, null);
        }
        //return p.measure(bodyCode);
    }
    constTypeCheck(resOpt, paramDef, aValue) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            let replacement = aValue;
            // if parameter type is entity, then the value should be an entity or ref to one
            // same is true of 'dataType' dataType
            if (paramDef.getDataTypeRef()) {
                let dt = paramDef.getDataTypeRef().getObjectDef(resOpt);
                if (!dt)
                    dt = paramDef.getDataTypeRef().getObjectDef(resOpt);
                // compare with passed in value or default for parameter
                let pValue = aValue;
                if (!pValue) {
                    pValue = paramDef.getDefaultValue();
                    replacement = pValue;
                }
                if (pValue) {
                    if (dt.isDerivedFrom(resOpt, "cdmObject")) {
                        let expectedTypes = new Array();
                        let expected;
                        if (dt.isDerivedFrom(resOpt, "entity")) {
                            expectedTypes.push(cdmObjectType.constantEntityDef);
                            expectedTypes.push(cdmObjectType.entityRef);
                            expectedTypes.push(cdmObjectType.entityDef);
                            expected = "entity";
                        }
                        else if (dt.isDerivedFrom(resOpt, "attribute")) {
                            expectedTypes.push(cdmObjectType.attributeRef);
                            expectedTypes.push(cdmObjectType.typeAttributeDef);
                            expectedTypes.push(cdmObjectType.entityAttributeDef);
                            expected = "attribute";
                        }
                        else if (dt.isDerivedFrom(resOpt, "dataType")) {
                            expectedTypes.push(cdmObjectType.dataTypeRef);
                            expectedTypes.push(cdmObjectType.dataTypeDef);
                            expected = "dataType";
                        }
                        else if (dt.isDerivedFrom(resOpt, "relationship")) {
                            expectedTypes.push(cdmObjectType.relationshipRef);
                            expectedTypes.push(cdmObjectType.relationshipDef);
                            expected = "relationship";
                        }
                        else if (dt.isDerivedFrom(resOpt, "trait")) {
                            expectedTypes.push(cdmObjectType.traitRef);
                            expectedTypes.push(cdmObjectType.traitDef);
                            expected = "trait";
                        }
                        else if (dt.isDerivedFrom(resOpt, "attributeGroup")) {
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
                                    replacement = new AttributeReferenceImpl(ctx, pValue, true);
                                    replacement.ctx = ctx;
                                    replacement.docCreatedIn = ctx.currentDoc;
                                    foundType = cdmObjectType.attributeRef;
                                }
                                else {
                                    let lu = ctx.corpus.resolveSymbolReference(resOpt, ctx.currentDoc, pValue, cdmObjectType.error);
                                    if (lu) {
                                        if (expected === "attribute") {
                                            replacement = new AttributeReferenceImpl(ctx, pValue, true);
                                            replacement.ctx = ctx;
                                            replacement.docCreatedIn = ctx.currentDoc;
                                            foundType = cdmObjectType.attributeRef;
                                        }
                                        else {
                                            replacement = lu;
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
    resolveObjectDefinitions(resOpt) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            // for every object defined, accumulate the set of documents that could be needed to resolve the object AND any references it makes
            // this is a stack, since things get defined inside of things
            let documentRefSetStack = new Array();
            let documentRefSet;
            ctx.currentDoc.visit("", (iObject, path) => {
                let ot = iObject.objectType;
                switch (ot) {
                    case cdmObjectType.entityDef:
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
                        if (path.indexOf("(unspecified)") == -1) {
                            // a new thing being defined. push onto stack
                            documentRefSet = new Set();
                            documentRefSetStack.push(documentRefSet);
                            // put in the docs where this thing is defined. if only one document, then don't add. if only one doc, then only one choice on resolve time too
                            let defIn = this.docsForSymbol(ctx.currentDoc, ctx.currentDoc, path);
                            if (defIn.docList && defIn.docList.length > 1)
                                for (const d of defIn.docList) {
                                    documentRefSet.add(d);
                                }
                        }
                        break;
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
                        let resNew = ref.getObjectDef(resOpt);
                        // a new reference. push onto stack. even if we can't look this up, ok because it pops off later
                        documentRefSet = new Set();
                        documentRefSetStack.push(documentRefSet);
                        if (!resNew) {
                            // it is 'ok' to not find entity refs sometimes
                            let level = (ot == cdmObjectType.entityRef) ? cdmStatusLevel.warning : cdmStatusLevel.error;
                            ctx.statusRpt(level, `unable to resolve the reference '${ref.namedReference}' to a known object`, ctx.currentDoc.path + path);
                            let debugRes = ref.getObjectDef(resOpt);
                        }
                        else {
                            // normal case of a string name reference, just look up the docs for the symbol
                            if (ref.namedReference) {
                                // and store the docs
                                let defIn = this.docsForSymbol(ctx.currentDoc, ctx.currentDoc, ref.namedReference);
                                if (defIn.docList && defIn.docList.length > 1)
                                    for (const d of defIn.docList) {
                                        documentRefSet.add(d);
                                    }
                            }
                            else {
                                // object being defined inline inside a ref.
                                // nothing to do now except wait for the def to make a new stack entry and later we will take the docs from it
                            }
                            ctx.statusRpt(cdmStatusLevel.info, `    resolved '${ref.namedReference}'`, ctx.currentDoc.path + path);
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
                        this.constTypeCheck(resOpt, p, null);
                        break;
                    case cdmObjectType.entityDef:
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
                        if (path.indexOf("(unspecified)") == -1) {
                            // a new thing done being defined. pop off of stack
                            documentRefSet = documentRefSetStack.pop();
                            // give the set to the corpus to track
                            this.registerDefinitionReferenceDocuments(iObject, documentRefSet);
                        }
                        break;
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
                        // store the docs in for this ref in the outer object
                        documentRefSet = documentRefSetStack.pop();
                        if (documentRefSet.size > 1) {
                            if (documentRefSetStack.length > 0) {
                                let outerSet = documentRefSetStack[documentRefSetStack.length - 1]; // the next to pop off is the outer object, this could go many layers up
                                for (const d of documentRefSet) {
                                    outerSet.add(d);
                                }
                            }
                        }
                        this.registerDefinitionReferenceDocuments(iObject, documentRefSet);
                        break;
                }
                return false;
            });
        }
        //return p.measure(bodyCode);
    }
    resolveTraitArguments(resOpt) {
        //let bodyCode = () =>
        {
            let ctx = this.ctx;
            ctx.currentDoc.visit("", (iObject, path) => {
                let ot = iObject.objectType;
                switch (ot) {
                    case cdmObjectType.traitRef:
                        ctx.pushScope(iObject.getObjectDef(resOpt));
                        break;
                    case cdmObjectType.argumentDef:
                        try {
                            if (ctx.currentScope.currentTrait) {
                                ctx.relativePath = path;
                                let params = ctx.currentScope.currentTrait.getAllParameters(resOpt);
                                let paramFound;
                                let aValue;
                                if (ot == cdmObjectType.argumentDef) {
                                    paramFound = params.resolveParameter(ctx.currentScope.currentParameter, iObject.getName());
                                    iObject.resolvedParameter = paramFound;
                                    aValue = iObject.value;
                                    // if parameter type is entity, then the value should be an entity or ref to one
                                    // same is true of 'dataType' dataType
                                    aValue = this.constTypeCheck(resOpt, paramFound, aValue);
                                    iObject.setValue(aValue);
                                }
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
                        iObject.resolvedArguments = true;
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
                ctx.currentDoc = fd["1"];
                this.finishDocumentResolve();
                ctx.currentDoc = undefined;
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
    get profiler() {
        return p;
    }
    resolveReferencesAndValidate(stage, stageThrough, resOpt) {
        //let bodyCode = () =>
        {
            return new Promise(resolve => {
                let errors = 0;
                let ctx = this.ctx;
                // use the provided directives or make a relational default
                let directives;
                if (resOpt)
                    directives = resOpt.directives;
                else
                    directives = new TraitDirectiveSet(new Set(["referenceOnly", "normalized"]));
                resOpt = { wrtDoc: undefined, directives: directives, relationshipDepth: 0 };
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
                        resOpt.wrtDoc = ctx.currentDoc;
                        ctx.currentDoc.prioritizeImports(undefined, 0, undefined);
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
                        resOpt.wrtDoc = ctx.currentDoc;
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
                        resOpt.wrtDoc = ctx.currentDoc;
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
                        resOpt.wrtDoc = ctx.currentDoc;
                        this.resolveObjectDefinitions(resOpt);
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
                        resOpt.wrtDoc = ctx.currentDoc;
                        this.resolveTraitArguments(resOpt);
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
                            resolve(cdmValidationStep.traitAppliers);
                    }
                    return;
                }
                else if (stage == cdmValidationStep.traitAppliers) {
                    ctx.statusRpt(cdmStatusLevel.progress, "defining traits...", null);
                    let assignAppliers = (traitMatch, traitAssign) => {
                        if (!traitMatch)
                            return;
                        if (traitMatch.getExtendsTrait())
                            assignAppliers(traitMatch.getExtendsTrait().getObjectDef(resOpt), traitAssign);
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
                        resOpt.wrtDoc = ctx.currentDoc;
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
                    if (errors > 0)
                        resolve(cdmValidationStep.error);
                    else {
                        if (stageThrough == stage || stageThrough == cdmValidationStep.minimumForResolving) {
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
                    let l = this.allDocuments.length;
                    // for every defined object, find and cache the full set of traits that are exhibited or applied during inheritence 
                    // and for each get a mapping of values (starting with default values) to parameters build from the base declaration up to the final
                    // so that any overrides done along the way take precidence.
                    // for trait definition, consider that when extending a base trait arguments can be applied.
                    let entityNesting = 0;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        resOpt.wrtDoc = ctx.currentDoc;
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
                                    iObject.getResolvedTraits(resOpt);
                                    break;
                                case cdmObjectType.entityAttributeDef:
                                case cdmObjectType.typeAttributeDef:
                                    ctx.relativePath = path;
                                    iObject.getResolvedTraits(resOpt);
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
                        let rts = obj.getResolvedTraits(resOpt);
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
                                                ctx.statusRpt(cdmStatusLevel.error, `no argument supplied for required parameter '${rt.parameterValues.getParameter(iParam).getName()}' of trait '${rt.traitName}' on '${obj.getObjectDef(resOpt).getName()}'`, ctx.currentDoc.path + ctx.relativePath);
                                            else
                                                resolved++;
                                        }
                                    }
                                }
                                if (found > 0 && found == resolved)
                                    ctx.statusRpt(cdmStatusLevel.info, `found and resolved '${found}' required parameters of trait '${rt.traitName}' on '${obj.getObjectDef(resOpt).getName()}'`, ctx.currentDoc.path + ctx.relativePath);
                            }
                        }
                    };
                    // now make sure that within the definition of an entity, every usage of a trait has values or default values for all required params
                    let inEntityDef = 0;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        resOpt.wrtDoc = ctx.currentDoc;
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
                    let entityNesting = 0;
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        resOpt.wrtDoc = ctx.currentDoc;
                        ctx.currentDoc.visit("", (iObject, path) => {
                            let ot = iObject.objectType;
                            if (ot == cdmObjectType.entityDef) {
                                entityNesting++; // get resolved att is already recursive, so don't compound
                                if (entityNesting == 1) {
                                    ctx.relativePath = path;
                                    iObject.getResolvedAttributes(resOpt);
                                }
                            }
                            if (ot == cdmObjectType.attributeGroupDef) {
                                entityNesting++;
                                if (entityNesting == 1) {
                                    ctx.relativePath = path;
                                    iObject.getResolvedAttributes(resOpt);
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
                    ctx.statusRpt(cdmStatusLevel.progress, "resolving foreign key references...", null);
                    let entityNesting = 0;
                    // for each entity, find and cache the complete set of references to other entities made through referencesA relationships
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        resOpt.wrtDoc = ctx.currentDoc;
                        ctx.currentDoc.visit("", (iObject, path) => {
                            let ot = iObject.objectType;
                            if (ot == cdmObjectType.attributeGroupDef)
                                entityNesting++;
                            if (ot == cdmObjectType.entityDef) {
                                entityNesting++;
                                if (entityNesting == 1) {
                                    ctx.relativePath = path;
                                    iObject.getResolvedEntityReferences(resOpt);
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
CorpusImpl._nextID = 0;
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
        willRemove: (onStep) => {
            return true;
        }
    },
    {
        matchName: "does.addAttribute",
        priority: 4,
        overridesBase: false,
        willAttributeAdd: (appCtx) => {
            return true;
        },
        doAttributeAdd: (appCtx) => {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("addedAttribute").value;
            //sub = sub.copy();
            let appliedTrait = appCtx.resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait, false); // could be a def or ref or string handed in. this handles it
            }
            appCtx.resAttNew.target = sub;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
        }
    },
    {
        matchName: "does.referenceEntity",
        priority: 4,
        overridesBase: true,
        willRemove: (appCtx) => {
            let visible = true;
            if (appCtx.resAttSource) {
                // all others go away
                visible = false;
                if (appCtx.resAttSource.target === appCtx.resTrait.parameterValues.getParameterValue("addedAttribute").value)
                    visible = true;
            }
            return false; // find this bug
        },
        willRoundAdd: (appCtx) => {
            return true;
        },
        doRoundAdd: (appCtx) => {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("addedAttribute").value;
            //sub = sub.copy();
            let appliedTrait = appCtx.resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait, false); // could be a def or ref or string handed in. this handles it
            }
            appCtx.resAttNew.target = sub;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
        },
        willCreateContext: (appCtx) => {
            return true;
        },
        doCreateContext: (appCtx) => {
            // make a new attributeContext to differentiate this supporting att
            let acp = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.addedAttributeIdentity,
                name: "_foreignKey"
            };
            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: "does.addSupportingAttribute",
        priority: 8,
        overridesBase: true,
        willAttributeAdd: (appCtx) => {
            return true;
        },
        doAttributeAdd: (appCtx) => {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("addedAttribute").value;
            sub = sub.copy(appCtx.resOpt);
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // might have set a supporting trait to add to this attribute            
            let appliedTrait = appCtx.resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (typeof (appliedTrait) === "object") {
                appliedTrait = appliedTrait.getObjectDef(appCtx.resOpt);
                // shove new trait onto attribute
                sub.addAppliedTrait(appliedTrait, false); // could be a def or ref or string handed in. this handles it
                // get the resolved traits from attribute
                appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
                // assumes some things, like the argument name. probably a dumb design, should just take the name and assume the trait too. that simplifies the source docs
                let supporting = "(unspecified)";
                if (appCtx.resAttSource)
                    supporting = appCtx.resAttSource.resolvedName;
                appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.setTraitParameterValue(appCtx.resOpt, appliedTrait, "inSupportOf", supporting);
            }
            else {
                // get the resolved traits from attribute
                appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
            }
            appCtx.resAttNew.target = sub;
        },
        willCreateContext: (appCtx) => {
            return true;
        },
        doCreateContext: (appCtx) => {
            // make a new attributeContext to differentiate this supporting att
            let acp = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.addedAttributeSupporting,
                name: "supporting_" + appCtx.resAttSource.resolvedName,
                regarding: appCtx.resAttSource.target
            };
            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: "does.imposeDirectives",
        priority: 1,
        overridesBase: true,
        willAlterDirectives: (resOpt, resTrait) => {
            return true;
        },
        doAlterDirectives: (resOpt, resTrait) => {
            let allAdded = resTrait.parameterValues.getParameterValue("directives").getValueString(resOpt);
            if (allAdded) {
                if (resOpt.directives) {
                    resOpt.directives = resOpt.directives.copy();
                    allAdded.split(',').forEach(d => resOpt.directives.add(d));
                }
            }
        }
    },
    {
        matchName: "does.removeDirectives",
        priority: 2,
        overridesBase: true,
        willAlterDirectives: (resOpt, resTrait) => {
            return true;
        },
        doAlterDirectives: (resOpt, resTrait) => {
            let allRemoved = resTrait.parameterValues.getParameterValue("directives").getValueString(resOpt);
            if (allRemoved) {
                if (resOpt.directives) {
                    resOpt.directives = resOpt.directives.copy();
                    allRemoved.split(',').forEach(d => {
                        resOpt.directives.delete(d);
                    });
                }
            }
        }
    },
    {
        matchName: "does.selectAttributes",
        priority: 4,
        overridesBase: false,
        willAlterDirectives: (resOpt, resTrait) => {
            let selects = resTrait.parameterValues.getParameterValue("selects").getValueString(resOpt);
            return (selects == "one");
        },
        doAlterDirectives: (resOpt, resTrait) => {
            if (resOpt.directives)
                resOpt.directives = resOpt.directives.copy();
            else
                resOpt.directives = new TraitDirectiveSet();
            resOpt.directives.add("selectOne");
        },
        willRoundAdd: (appCtx) => {
            let dir = appCtx.resOpt.directives;
            let selectsOne = dir && dir.has("selectOne");
            let structured = dir && dir.has("structured");
            if (selectsOne && !structured) {
                // when one class is being pulled from a list of them
                // add the class attribute unless this is a structured output (assumes they know the class)
                return true;
            }
            return false;
        },
        doRoundAdd: (appCtx) => {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("storeSelectionInAttribute").value;
            appCtx.resAttNew.target = sub;
            appCtx.resAttNew.applierState.flex_remove = false;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // add the trait that tells them what this means
            if (!sub.getAppliedTraitRefs() || !sub.getAppliedTraitRefs().find((atr) => atr.getObjectDefName() === "is.linkedEntity.name"))
                sub.addAppliedTrait("is.linkedEntity.name", true);
            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
        },
        willCreateContext: (appCtx) => {
            let dir = appCtx.resOpt.directives;
            let selectsOne = dir && dir.has("selectOne");
            let structured = dir && dir.has("structured");
            if (selectsOne && !structured) {
                return true;
            }
            return false;
        },
        doCreateContext: (appCtx) => {
            // make a new attributeContext to differentiate this supporting att
            let acp = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.addedAttributeSupporting,
                name: "_selectedEntityName"
            };
            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: "does.disambiguateNames",
        priority: 9,
        overridesBase: true,
        willAttributeModify: (appCtx) => {
            if (appCtx.resAttSource && !appCtx.resOpt.directives.has("structured"))
                return true;
            return false;
        },
        doAttributeModify: (appCtx) => {
            if (appCtx.resAttSource) {
                let format = appCtx.resTrait.parameterValues.getParameterValue("renameFormat").getValueString(appCtx.resOpt);
                let state = appCtx.resAttSource.applierState;
                let ordinal = state && state.flex_currentOrdinal != undefined ? state.flex_currentOrdinal.toString() : "";
                if (!format)
                    return;
                let formatLength = format.length;
                if (formatLength == 0)
                    return;
                // parse the format looking for positions of {n} and {o} and text chunks around them
                // there are only 5 possibilies
                let upper = false;
                let iN = format.indexOf("{n}");
                if (iN < 0) {
                    iN = format.indexOf("{N}");
                    upper = true;
                }
                let iO = format.indexOf("{o}");
                let replace = (start, at, length, value) => {
                    if (upper && value) {
                        value = value.charAt(0).toUpperCase() + value.slice(1);
                    }
                    let replaced = "";
                    if (at > start)
                        replaced = format.slice(start, at);
                    replaced += value;
                    if (at + 3 < length)
                        replaced += format.slice(at + 3, length);
                    return replaced;
                };
                let result;
                let srcName = appCtx.resAttSource.resolvedName;
                if (iN < 0 && iO < 0) {
                    result = format;
                }
                else if (iN < 0) {
                    result = replace(0, iO, formatLength, ordinal);
                }
                else if (iO < 0) {
                    result = replace(0, iN, formatLength, srcName);
                }
                else if (iN < iO) {
                    result = replace(0, iN, iO, srcName);
                    result += replace(iO, iO, formatLength, ordinal);
                }
                else {
                    result = replace(0, iO, iN, ordinal);
                    result += replace(iN, iN, formatLength, srcName);
                }
                appCtx.resAttSource.resolvedName = result;
            }
        }
    },
    {
        matchName: "does.referenceEntityVia",
        priority: 4,
        overridesBase: false,
        willRemove: (appCtx) => {
            let dir = appCtx.resOpt.directives;
            let isNorm = dir && dir.has("normalized");
            let isArray = dir && dir.has("isArray");
            let isRefOnly = dir && dir.has("referenceOnly");
            let alwaysAdd = appCtx.resTrait.parameterValues.getParameterValue("alwaysAddForeignKey").getValueString(appCtx.resOpt) === "true";
            let doFK = (alwaysAdd || isRefOnly) && (isNorm == false || isArray == false);
            let visible = true;
            if (doFK && appCtx.resAttSource) {
                // if in reference only mode, then remove everything that isn't marked to retain
                visible = false;
                if (alwaysAdd || (appCtx.resAttSource.applierState && appCtx.resAttSource.applierState.flex_remove === false))
                    visible = true;
            }
            return !visible;
        },
        willRoundAdd: (appCtx) => {
            let dir = appCtx.resOpt.directives;
            let isNorm = dir && dir.has("normalized");
            let isArray = dir && dir.has("isArray");
            let isRefOnly = dir && dir.has("referenceOnly");
            let alwaysAdd = appCtx.resTrait.parameterValues.getParameterValue("alwaysAddForeignKey").getValueString(appCtx.resOpt) === "true";
            // add a foreign key and remove everything else when asked to do so.
            // however, avoid doing this for normalized arrays, since they remove all alls anyway
            let doFK = (isRefOnly || alwaysAdd) && (isNorm == false || isArray == false);
            return doFK;
        },
        doRoundAdd: (appCtx) => {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("foreignKeyAttribute").value;
            appCtx.resAttNew.target = sub;
            appCtx.resAttNew.applierState.flex_remove = false;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // add the trait that tells them what this means
            if (!sub.getAppliedTraitRefs() || !sub.getAppliedTraitRefs().find((atr) => atr.getObjectDefName() === "is.linkedEntity.identifier"))
                sub.addAppliedTrait("is.linkedEntity.identifier", true);
            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
        },
        willCreateContext: (appCtx) => {
            let dir = appCtx.resOpt.directives;
            let isNorm = dir && dir.has("normalized");
            let isArray = dir && dir.has("isArray");
            let isRefOnly = dir && dir.has("referenceOnly");
            let doFKOnly = isRefOnly && (isNorm == false || isArray == false);
            return doFKOnly;
        },
        doCreateContext: (appCtx) => {
            // make a new attributeContext to differentiate this foreign key att
            let acp = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.addedAttributeIdentity,
                name: "_foreignKey"
            };
            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: "does.explainArray",
        priority: 6,
        overridesBase: false,
        willGroupAdd: (appCtx) => {
            let dir = appCtx.resOpt.directives;
            let isNorm = dir && dir.has("normalized");
            let isArray = dir && dir.has("isArray");
            let isStructured = dir && dir.has("structured");
            // expand array and add a count if this is an array AND it isn't structured or normalized
            // structured assumes they know about the array size from the structured data format
            // normalized means that arrays of entities shouldn't be put inline, they should reference or include from the 'other' side of that 1:M relationship
            return isArray && !isNorm && !isStructured;
        },
        doGroupAdd: (appCtx) => {
            let sub = appCtx.resTrait.parameterValues.getParameterValue("storeCountInAttribute").value;
            appCtx.resAttNew.target = sub;
            appCtx.resAttNew.applierState.flex_remove = false;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // add the trait that tells them what this means
            if (!sub.getAppliedTraitRefs() || !sub.getAppliedTraitRefs().find((atr) => atr.getObjectDefName() === "is.linkedEntity.array.count"))
                sub.addAppliedTrait("is.linkedEntity.array.count", true);
            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
        },
        willAttributeAdd: (appCtx) => {
            let dir = appCtx.resOpt.directives;
            let isNorm = dir && dir.has("normalized");
            let isArray = dir && dir.has("isArray");
            let isStructured = dir && dir.has("structured");
            return isArray && !isNorm && !isStructured;
        },
        doAttributeAdd: (appCtx) => {
            let newAtt;
            appCtx.continue = false;
            if (appCtx.resAttSource) {
                let state = appCtx.resAttNew.applierState;
                if (state.array_finalOrdinal == undefined) {
                    // get the fixed size (not set means no fixed size)
                    let fixedSizeString = appCtx.resTrait.parameterValues.getParameterValue("maximumExpansion").getValueString(appCtx.resOpt);
                    let fixedSize = 1;
                    if (fixedSizeString && fixedSizeString != "undefined")
                        fixedSize = Number.parseInt(fixedSizeString);
                    let initialString = appCtx.resTrait.parameterValues.getParameterValue("startingIndex").getValueString(appCtx.resOpt);
                    let initial = 0;
                    if (initialString && initialString != "undefined")
                        initial = Number.parseInt(initialString);
                    fixedSize += initial;
                    // marks this att as the template for expansion
                    state.array_template = appCtx.resAttSource;
                    if (!appCtx.resAttSource.applierState)
                        appCtx.resAttSource.applierState = {};
                    appCtx.resAttSource.applierState.flex_remove = true;
                    // give back the attribute that holds the count first
                    state.array_initialOrdinal = initial;
                    state.array_finalOrdinal = fixedSize - 1;
                    state.flex_currentOrdinal = initial;
                }
                else
                    state.flex_currentOrdinal = state.flex_currentOrdinal + 1;
                if (state.flex_currentOrdinal <= state.array_finalOrdinal) {
                    let template = (state.array_template);
                    appCtx.resAttNew.target = template.target;
                    // copy the template
                    //appCtx.resAttNew.resolvedName = template.resolvedName; // must solve problem with apply happening twice.
                    appCtx.resAttNew.resolvedName = template.target.getName();
                    appCtx.resAttNew.resolvedTraits = template.resolvedTraits.deepCopy();
                    appCtx.continue = state.flex_currentOrdinal < state.array_finalOrdinal;
                }
            }
        },
        willAlterDirectives: (resOpt, resTrait) => {
            let isArray = resTrait.parameterValues.getParameterValue("isArray").getValueString(resOpt);
            return isArray == "true";
        },
        doAlterDirectives: (resOpt, resTrait) => {
            if (resOpt.directives)
                resOpt.directives = resOpt.directives.copy();
            else
                resOpt.directives = new TraitDirectiveSet();
            resOpt.directives.add("isArray");
        },
        willRemove: (appCtx) => {
            let dir = appCtx.resOpt.directives;
            let isNorm = dir && dir.has("normalized");
            let isArray = dir && dir.has("isArray");
            // remove the 'template' attributes that got copied on expansion if they come here
            // also, normalized means that arrays of entities shouldn't be put inline
            // only remove the template attributes that seeded the array expansion
            let isTemplate = appCtx.resAttSource.applierState && appCtx.resAttSource.applierState.flex_remove;
            return isArray && (isTemplate || isNorm);
        }
    }
];

},{"perf_hooks":1}]},{},[2])(2)
});
