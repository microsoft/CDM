import { resolve } from "path";
import { start } from "repl";


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

export interface identifierRef {
    corpusPath : string;
    identifier: string;
}

export interface Argument {
    explanation?: string;
    name?: string;
    value: any;
}

export interface Parameter {
    explanation?: string;
    name: string;
    defaultValue?: any;
    required?: boolean;
    direction?: string;
    dataType?: string | DataTypeReference;
}

export interface Import {
    uri: string;
    moniker?: string;
}

export interface TraitReference {
    traitReference: string | Trait;
    arguments?: (string | Argument)[];
}

export interface Trait {
    explanation?: string;
    traitName: string;
    extendsTrait?: string | TraitReference;
    hasParameters?: (string | Parameter)[];
    elevated?: boolean;
}

export interface RelationshipReference {
    relationshipReference: string | Relationship;
    appliedTraits?: (string | TraitReference)[];
}

export interface Relationship {
    explanation?: string;
    relationshipName: string;
    extendsRelationship?: string | RelationshipReference;
    exhibitsTraits?: (string | TraitReference)[];
}

export interface DataTypeReference {
    dataTypeReference: string | DataType;
    appliedTraits?: (string | TraitReference)[];
}

export interface DataType {
    explanation?: string;
    dataTypeName: string;
    extendsDataType?: string | DataTypeReference;
    exhibitsTraits?: (string | TraitReference)[];
}

export interface TypeAttribute {
    explanation?: string;
    name: string;
    relationship?: (string | RelationshipReference);
    dataType?: (string | DataTypeReference);
    appliedTraits?: (string | TraitReference)[];
}

export interface AttributeGroupReference {
    attributeGroupReference: string | AttributeGroup;
}

export interface AttributeGroup {
    explanation?: string;
    attributeGroupName: string;
    members: (string | AttributeGroupReference | TypeAttribute | EntityAttribute)[];
    exhibitsTraits?: (string | TraitReference)[];
}

export interface EntityAttribute {
    explanation?: string;
    relationship?: (string | RelationshipReference);
    entity: (string | EntityReference | (string | EntityReference)[]);
    appliedTraits?: (string | TraitReference)[];
}

export interface ConstantEntity {
    explanation?: string;
    constantEntityName?: string;
    entityShape: string | EntityReference;
    constantValues: string[][];
}

export interface EntityReference {
    entityReference: string | Entity;
    appliedTraits?: (string | TraitReference)[];
}

export interface Entity {
    explanation?: string;
    entityName: string;
    extendsEntity?: string | EntityReference;
    exhibitsTraits?: (string | TraitReference)[];
    hasAttributes?: (string | AttributeGroupReference | TypeAttribute | EntityAttribute)[];
}

export interface DocumentContent {
    schema: string;
    schemaVersion: string;
    imports?: Import[];
    definitions: (Trait | DataType | Relationship | AttributeGroup | Entity | ConstantEntity)[];
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  enums
////////////////////////////////////////////////////////////////////////////////////////////////////
export enum cdmObjectType {
    unresolved,
    cdmObject,
    import,
    stringConstant,
    genericRef,
    argumentDef,
    parameterDef,
    traitDef,
    traitRef,
    relationshipDef,
    relationshipRef,
    dataTypeDef,
    dataTypeRef,
    typeAttributeDef,
    entityAttributeDef,
    attributeGroupDef,
    attributeGroupRef,
    constantEntityDef,
    constantEntityRef,
    entityDef,
    entityRef,
    documentDef,
    folderDef
}

export enum cdmTraitSet {
    all,
    elevatedOnly,
    inheritedOnly,
    appliedOnly
}

export enum cdmValidationStep {
    start,
    imports,
    integrity,
    declarations,
    references,
    parameters,
    traits,
    attributes,
    entityReferences,
    cleanup,
    finished,
    error
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  interfaces for construction, inspection of OM
////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ICdmObject {
    visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean;
    validate(): boolean;
    getObjectType(): cdmObjectType;
    getObjectRefType(): cdmObjectType;
    getPathBranch(): string;
    getObjectDef<T=ICdmObjectDef>(): T
    copyData(stringPaths? : boolean): any;
    getResolvedTraits(set?: cdmTraitSet): ResolvedTraitSet
    setTraitParameterValue(toTrait : ICdmTraitDef, paramName : string, value : string | ICdmObject);
    getResolvedAttributes(): ResolvedAttributeSet
    copy();
    getFriendlyFormat() : friendlyFormatNode;
}

export interface ICdmObjectRef extends ICdmObject {
    getAppliedTraitRefs(): ICdmTraitRef[];
    addAppliedTrait(traitDef : ICdmTraitRef | ICdmTraitDef | string) : ICdmTraitRef;
    setObjectDef(def :ICdmObjectDef) : ICdmObjectDef;
}

export interface ICdmReferencesEntities {
    getResolvedEntityReferences(): ResolvedEntityReferenceSet;
}

export interface ICdmStringConstant extends ICdmObject, ICdmReferencesEntities {
    getConstant(): string;
}

export interface ICdmArgumentDef extends ICdmObject {
    getExplanation(): string;
    setExplanation(explanation : string): string;
    getValue(): ICdmObject;
    getName(): string;
    getParameterDef(): ICdmParameterDef;
    setValue(value : ICdmObject);
}

export interface ICdmParameterDef extends ICdmObject {
    getExplanation(): string;
    getName(): string;
    getDefaultValue(): ICdmObject;
    getRequired(): boolean;
    getDirection(): string;
    getDataTypeRef(): ICdmDataTypeRef;
}

export interface ICdmTraitRef extends ICdmObjectRef {
    getArgumentDefs(): (ICdmArgumentDef)[];
    setArgumentValue(name : string, value : string);
    addArgument(name: string, value : ICdmObject) : ICdmArgumentDef;
}

export interface ICdmObjectDef extends ICdmObject {
    getExplanation(): string;
    setExplanation(explanation : string): string;
    getName(): string;
    getExhibitedTraitRefs(): ICdmTraitRef[];
    addExhibitedTrait(traitDef : ICdmTraitRef | ICdmTraitDef | string) : ICdmTraitRef;
    isDerivedFrom(base: string): boolean;
    getObjectPath() : string;
}

export interface ICdmTraitDef extends ICdmObjectDef {
    getExtendsTrait(): ICdmTraitRef;
    setExtendsTrait(traitDef : ICdmTraitRef | ICdmTraitDef | string): ICdmTraitRef;
    getHasParameterDefs(): ICdmParameterDef[];
    getAllParameters(): ParameterCollection;
    addTraitApplier(applier: traitApplier);
    getTraitAppliers(): traitApplier[];
    getElevated() : boolean;
    setElevated(state: boolean) : boolean;
}

export interface ICdmRelationshipRef extends ICdmObjectRef {
}

export interface ICdmRelationshipDef extends ICdmObjectDef {
    getExtendsRelationshipRef(): ICdmRelationshipRef;
}

export interface ICdmDataTypeRef extends ICdmObjectRef {
}

export interface ICdmDataTypeDef extends ICdmObjectDef {
    getExtendsDataTypeRef(): ICdmDataTypeRef;
}

export interface ICdmAttributeDef extends ICdmObjectRef, ICdmReferencesEntities {
    getExplanation(): string;
    setExplanation(explanation : string): string;
    getName(): string;
    getRelationshipRef(): ICdmRelationshipRef;
    setRelationshipRef(relRef :  ICdmRelationshipRef): ICdmRelationshipRef;
    removedTraitDef(ref : ICdmTraitDef);
}

export interface ICdmTypeAttributeDef extends ICdmAttributeDef {
    getDataTypeRef(): ICdmDataTypeRef;
    setDataTypeRef(dataType : ICdmDataTypeRef): ICdmDataTypeRef;
}

export interface ICdmAttributeGroupRef extends ICdmObjectRef, ICdmReferencesEntities {
}

export interface ICdmAttributeGroupDef extends ICdmObjectDef, ICdmReferencesEntities {
    getMembersAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[];
    addMemberAttributeDef(attDef : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef) : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef;
}

export interface ICdmEntityAttributeDef extends ICdmAttributeDef {
    getEntityRefIsArray(): boolean;
    getEntityRef(): (ICdmEntityRef | (ICdmEntityRef[]));
    setEntityRef(entRef : (ICdmEntityRef | (ICdmEntityRef[]))): (ICdmEntityRef | (ICdmEntityRef[]));
}

export interface ICdmConstantEntityDef extends ICdmObject {
    getExplanation(): string;
    setExplanation(explanation : string): string;
    getName(): string;
    getEntityShape(): ICdmEntityDef | ICdmEntityRef;
    setEntityShape(shape : (ICdmEntityDef | ICdmEntityRef)) : (ICdmEntityDef | ICdmEntityRef);
    getConstantValues(): string[][];
    setConstantValues(values : string[][]): string[][]; 
    lookupWhere(attReturn : string, attSearch : string, valueSearch: string) : string;
}

export interface ICdmEntityRef extends ICdmObjectRef {
}

export interface ICdmEntityDef extends ICdmObjectDef, ICdmReferencesEntities {
    getExtendsEntityRef(): ICdmObjectRef;
    setExtendsEntityRef(ref : ICdmObjectRef) : ICdmObjectRef;
    getHasAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[];
    addAttributeDef(attDef : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef) : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef;
    countInheritedAttributes() : number;
}

export interface ICdmImport extends ICdmObject {
}

export interface ICdmDocumentDef extends ICdmObject {
    getName():string;
    getSchema(): string;
    getSchemaVersion(): string;
    getDefinitions(): (ICdmTraitDef | ICdmDataTypeDef | ICdmRelationshipDef | ICdmAttributeGroupDef | ICdmEntityDef | ICdmConstantEntityDef)[];
    addDefinition<T>(ofType : cdmObjectType, name : string) : T;
    getImports() : ICdmImport[];
    addImport(uri : string, moniker : string) : void;
    getObjectFromDocumentPath(path : string) : ICdmObject;
}

export interface ICdmFolderDef extends ICdmObject {
    getName(): string;
    getRelativePath() : string;
    getSubFolders(): ICdmFolderDef[];
    getDocuments(): ICdmDocumentDef[];
    addFolder(name: string): ICdmFolderDef
    addDocument(name: string, content: string): ICdmDocumentDef;
    getSubFolderFromPath(path: string,  makeFolder : boolean): ICdmFolderDef;
    getObjectFromFolderPath(path : string) : ICdmObject;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  argument types and callbacks
////////////////////////////////////////////////////////////////////////////////////////////////////

type ArgumentValue = (StringConstant | RelationshipReferenceImpl | TraitReferenceImpl | DataTypeReferenceImpl | AttributeGroupReferenceImpl | EntityReferenceImpl | EntityAttributeImpl | TypeAttributeImpl);

export enum cdmStatusLevel {
    info,
    progress,
    warning,
    error
}
export type RptCallback = (level: cdmStatusLevel, msg: string, path: string) => void;
export type VisitCallback = (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => boolean

type CdmCreator<T> = (o: any) => T;


export interface ApplierResult {
    shouldDelete?: boolean;            // for attributeRemove, set to true to request that attribute be removed
    continuationState?: any;            // set to any value to request another call to the same method. values will be passed back in 
    addedAttribute?: ICdmAttributeDef;  // result of adding. 
}
export interface traitApplier {
    matchName: string;
    priority: number;
    willApply?: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait) => boolean;
    attributeApply?: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait) => ApplierResult;
    willAdd?: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait, continuationState: any) => boolean;
    attributeAdd?: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait, continuationState: any) => ApplierResult;
    attributeRemove?: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait) => ApplierResult;
}
interface ApplierContinuation {
    applier: traitApplier;
    resAtt: ResolvedAttribute;
    resTrait: ResolvedTrait;
    continuationState: any;
}
class ApplierContinuationSet {
    constructor() {
        this.continuations = new Array<ApplierContinuation>();
    }
    continuations : ApplierContinuation[];
    rasResult : ResolvedAttributeSet;
}


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  classes for resolution of refereneces and representing constructed traits, attributes and relationships
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//  parameters and arguments in traits
////////////////////////////////////////////////////////////////////////////////////////////////////

export class ParameterCollection {
    sequence: ICdmParameterDef[];
    lookup: Map<string, ICdmParameterDef>;
    ordinals: Map<ICdmParameterDef, number>;
    constructor(prior: ParameterCollection) {
        if (prior && prior.sequence)
            this.sequence = prior.sequence.slice();
        else
            this.sequence = new Array<ICdmParameterDef>();

        if (prior && prior.lookup)
            this.lookup = new Map<string, ICdmParameterDef>(prior.lookup);
        else
            this.lookup = new Map<string, ICdmParameterDef>();

        if (prior && prior.ordinals)
            this.ordinals = new Map<ICdmParameterDef, number>(prior.ordinals);
        else
            this.ordinals = new Map<ICdmParameterDef, number>();
    }

    public add(element: ICdmParameterDef) {
        // if there is already a named parameter that matches, this is trouble
        let name: string = element.getName();
        if (name && this.lookup.has(name))
            throw new Error(`duplicate parameter named '${name}'`)
        if (name)
            this.lookup.set(name, element);

        this.ordinals.set(element, this.sequence.length);
        this.sequence.push(element);
    }
    public resolveParameter(ordinal: number, name: string) {
        if (name) {
            if (this.lookup.has(name))
                return this.lookup.get(name);
            throw new Error(`there is no parameter named '${name}'`)
        }
        if (ordinal >= this.sequence.length)
            throw new Error(`too many arguments supplied`)
        return this.sequence[ordinal];
    }
    public getParameterIndex(pName: string): number {
        return this.ordinals.get(this.lookup.get(pName));
    }
}

export class ParameterValue {
    public parameter: ICdmParameterDef;
    public value: ICdmObject;
    constructor(param: ICdmParameterDef, value: ICdmObject) {
        this.parameter = param;
        this.value = value;
    }
    public get valueString(): string {
        if (this.value) {
            if (this.value.getObjectType() == cdmObjectType.stringConstant)
                return (this.value as ICdmStringConstant).getConstant();
            return "cdmObject()";
        }
        return "undefined";
    }
    public get name(): string {
        return this.parameter.getName();
    }
    public spew(indent: string) {
        console.log(`${indent}${this.name}:${this.valueString}`);
    }

}

let __paramCopy = 0;

export class ParameterValueSet {
    pc: ParameterCollection;
    values: ICdmObject[];
    constructor(pc: ParameterCollection, values: ICdmObject[]) {
        this.pc = pc;
        this.values = values;
    }
    public get length(): number {
        if (this.pc && this.pc.sequence)
            return this.pc.sequence.length;
        return 0;
    }
    public indexOf(paramDef: ICdmParameterDef): number {
        return this.pc.ordinals.get(paramDef);
    }
    public getParameter(i : number) : ICdmParameterDef {
        return this.pc.sequence[i];
    }
    public getValue(i : number) : ICdmObject {
        return this.values[i];
    }
    public getParameterValue(pName: string): ParameterValue {
        let i = this.pc.getParameterIndex(pName);
        return new ParameterValue(this.pc.sequence[i], this.values[i])
    }
    public setParameterValue(pName: string, value: string | ICdmObject): void {
        let i = this.pc.getParameterIndex(pName);
        let v: ICdmObject;
        if (typeof (value) === "string")
            v = new StringConstant(cdmObjectType.unresolved, value as string);
        else
            v = value;
        this.values[i] = v;
    }

    public copy(): ParameterValueSet {
        __paramCopy++;
        let copyValues = this.values.slice(0);
        let copy = new ParameterValueSet(this.pc, copyValues);
        return copy;
    }

    public spew(indent: string) {
        let l = this.length;
        for (let i = 0; i < l; i++) {
            let pv = new ParameterValue(this.pc.sequence[i], this.values[i]);
            pv.spew(indent + '-');
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  resolved traits
////////////////////////////////////////////////////////////////////////////////////////////////////

export class ResolvedTrait {
    public trait: ICdmTraitDef;
    public parameterValues: ParameterValueSet;
    constructor(trait: ICdmTraitDef, pc: ParameterCollection, values: ICdmObject[]) {
        this.parameterValues = new ParameterValueSet(pc, values);
        this.trait = trait;
    }
    public get traitName(): string {
        return this.trait.getName();
    }
    public spew(indent: string) {
        console.log(`${indent}[${this.traitName}]`);
        this.parameterValues.spew(indent + '-');
    }
    public copy(): ResolvedTrait {
        let copyParamValues = this.parameterValues.copy();
        let copy = new ResolvedTrait(this.trait, copyParamValues.pc, copyParamValues.values);
        return copy;
    }
}

class refCounted {
    public refCnt : number;
    constructor() {
        this.refCnt=0;
    }
    addRef() {
        this.refCnt ++;
    }
    release() {
        this.refCnt --;
    }
}

let __rtsMergeOne = 0;
export class ResolvedTraitSet extends refCounted {
    public set : ResolvedTrait[];
    private lookupByTrait: Map<ICdmTraitDef, ResolvedTrait>;
    constructor() {
        super();
        this.set = new Array<ResolvedTrait>();
        this.lookupByTrait= new Map<ICdmTraitDef, ResolvedTrait>();
    }
    public merge(toMerge: ResolvedTrait, copyOnWrite : boolean, forAtt : ICdmAttributeDef=null) : ResolvedTraitSet {
        __rtsMergeOne ++
        let traitSetResult : ResolvedTraitSet = this;
        //toMerge = toMerge.copy();
        let trait: ICdmTraitDef = toMerge.trait;
        let pc: ParameterCollection = toMerge.parameterValues.pc;
        let av: ICdmObject[] = toMerge.parameterValues.values;
        if (traitSetResult.lookupByTrait.has(trait)) {
            let rtOld = traitSetResult.lookupByTrait.get(trait);
            let avOld = rtOld.parameterValues.values;
            // the new values take precedence
            let l = av.length;
            for (let i = 0; i < l; i++) {
                if (av[i] != avOld[i]) {
                    if (traitSetResult === this && copyOnWrite) {
                        traitSetResult = traitSetResult.shallowCopyWithException(trait); // copy on write
                        rtOld = traitSetResult.lookupByTrait.get(trait);
                        avOld = rtOld.parameterValues.values;
                    }
                    avOld[i] = av[i];
                }
                if (forAtt) {
                    let strConst = avOld[i] as StringConstant;
                    if (strConst && strConst.constantValue && strConst.constantValue === "this.attribute" && (strConst.resolvedReference as any) !== forAtt) {
                        if (traitSetResult === this && copyOnWrite) {
                            traitSetResult = traitSetResult.shallowCopyWithException(trait); // copy on write
                            rtOld = traitSetResult.lookupByTrait.get(trait);
                            avOld = rtOld.parameterValues.values;
                        }
                        avOld[i] = forAtt;
                    }
                } 
            }
        }
        else {
            if (this.refCnt > 1)
                traitSetResult = traitSetResult.shallowCopy(); // copy on write
            traitSetResult.set.push(toMerge);
            traitSetResult.lookupByTrait.set(trait, toMerge);
            
            if (forAtt) {
                let avMerge = toMerge.parameterValues.values;
                let l = av.length;
                for (let i = 0; i < l; i++) {
                    let strConst = avMerge[i] as StringConstant;
                    if (strConst && strConst.constantValue && strConst.constantValue === "this.attribute" && (strConst.resolvedReference as any) !== forAtt) {
                        // never change the values in the trait passed in.
                        traitSetResult = traitSetResult.shallowCopyWithException(trait); // copy on write
                        let rtOld = traitSetResult.lookupByTrait.get(trait);
                        avMerge = rtOld.parameterValues.values;
                        avMerge[i] = forAtt;
                    }
                } 
                    
            }
        }

        return traitSetResult;

    }

    public mergeWillAlter(toMerge: ResolvedTrait, forAtt : ICdmAttributeDef = null) : boolean {
        let trait: ICdmTraitDef = toMerge.trait;
        if (!this.lookupByTrait.has(trait))
            return true;
        let pc: ParameterCollection = toMerge.parameterValues.pc;
        let av: ICdmObject[] = toMerge.parameterValues.values;
        let rtOld = this.lookupByTrait.get(trait);
        let avOld = rtOld.parameterValues.values;
        let l = av.length;
        for (let i = 0; i < l; i++) {
            if (av[i] != avOld[i])
                return true;
            if (forAtt) {
                let strConst = av[i] as StringConstant;
                if (strConst.constantValue && strConst.constantValue === "this.attribute" && (strConst.resolvedReference as any) !== forAtt)
                    return true;
            } 
        }
        return false;
    }


    public mergeSet(toMerge: ResolvedTraitSet, forAtt : ICdmAttributeDef = null) : ResolvedTraitSet {
        let traitSetResult : ResolvedTraitSet = this;
        if (toMerge) {
            let l = toMerge.set.length;
            for (let i = 0; i < l; i++) {
                const rt = toMerge.set[i];
                let traitSetMerge = traitSetResult.merge(rt, this.refCnt > 1, forAtt);
                if (traitSetMerge !== traitSetResult) {
                    traitSetResult = traitSetMerge
                }
                
            }
        }
        return traitSetResult;
    }

    public mergeSetWillAlter(toMerge: ResolvedTraitSet, forAtt : ICdmAttributeDef = null) : boolean {
        let traitSetResult : ResolvedTraitSet = this;
        if (toMerge) {
            let l = toMerge.set.length;
            for (let i = 0; i < l; i++) {
                const rt = toMerge.set[i];
                if (traitSetResult.mergeWillAlter(rt, forAtt))
                    return true;
            }
        }
        return false;
    }


    public get(trait: ICdmTraitDef): ResolvedTrait {
        if (this.lookupByTrait.has(trait))
            return this.lookupByTrait.get(trait);
        return null;
    }

    public find(traitName: string): ResolvedTrait {
        let l = this.set.length;
        for (let i = 0; i < l; i++) {
            const rt = this.set[i];
            if (rt.trait.isDerivedFrom(traitName))
                return rt;
        }
        return null;
    }
    
    public get size(): number {
        if (this.set)
            return this.set.length;
        return 0;
    }
    public get first(): ResolvedTrait {
        if (this.set)
            return this.set[0];
        return null;

    }
    public shallowCopyWithException(just : ICdmTraitDef): ResolvedTraitSet {
        let copy = new ResolvedTraitSet();
        let newSet = copy.set;
        let l = this.set.length;
        for (let i = 0; i < l; i++) {
            let rt = this.set[i];
            if (rt.trait == just)
                rt = rt.copy();
            newSet.push(rt);
            copy.lookupByTrait.set(rt.trait, rt);
        }
        return copy;
    }
    public shallowCopy(): ResolvedTraitSet {
        let copy = new ResolvedTraitSet();
        if (this.set) {
            let newSet = copy.set;
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                let rt = this.set[i];
                newSet.push(rt);
                copy.lookupByTrait.set(rt.trait, rt);
            }
        }
        return copy;
    }

    public keepElevated() : ResolvedTraitSet {
        let elevatedSet : ResolvedTrait[];
        let elevatedLookup : Map<ICdmTraitDef, ResolvedTrait>;
        let result : ResolvedTraitSet;
        if (this.refCnt > 1) {
            result = new ResolvedTraitSet();
            elevatedSet = result.set;
            elevatedLookup = result.lookupByTrait;
        }
        else {
            result = this;
            elevatedSet = new Array<ResolvedTrait>();
            elevatedLookup = new Map<ICdmTraitDef, ResolvedTrait>();
        }
        let l = this.set.length;
        for (let i = 0; i < l; i++) {
            const rt = this.set[i];
            if (rt.trait.getElevated()) {
                elevatedSet.push(rt);
                elevatedLookup.set(rt.trait, rt);
            }
        }
        result.set = elevatedSet;
        result.lookupByTrait = elevatedLookup;
        return result;
    }

    public setTraitParameterValue(toTrait : ICdmTraitDef, paramName : string, value : string | ICdmObject) : ResolvedTraitSet {
        let altered : ResolvedTraitSet = this;
        //if (altered.refCnt > 1) {
            altered=this.shallowCopyWithException(toTrait);
        //}

        altered.get(toTrait).parameterValues.setParameterValue(paramName, value);
        return altered;
    }

    public spew(indent: string) {
        let l = this.set.length;
        for (let i = 0; i < l; i++) {
            this.set[i].spew(indent);
        };
    }
}

class ResolvedTraitSetBuilder {
    public rts : ResolvedTraitSet;
    public set : cdmTraitSet;

    constructor(set : cdmTraitSet) {
        this.set = set;
    }
    public clear () {
        if (this.rts) {
            this.rts.release();
            this.rts = null;
        }
    }
    public mergeTraits(rtsNew : ResolvedTraitSet, forAtt : ICdmAttributeDef = null) {
        if (rtsNew) {
            if (!this.rts) {
                if (forAtt) {
                    // need to run the mergeset code, even though nothing to merge. it sets the att
                    this.takeReference(new ResolvedTraitSet());
                    this.takeReference(this.rts.mergeSet(rtsNew, forAtt));
                }
                else
                    this.takeReference(rtsNew);
            }
            else 
                this.takeReference(this.rts.mergeSet(rtsNew, forAtt));
        }
    }
    public takeReference(rtsNew : ResolvedTraitSet) {
        if (this.rts !== rtsNew) {
            if (rtsNew)
                rtsNew.addRef();
            if (this.rts)
                this.rts.release();
            this.rts = rtsNew;
        }
    }

    public ownOne(rt : ResolvedTrait) {
        this.takeReference(new ResolvedTraitSet());
        this.rts.merge(rt, false);
    }

    public setParameterValueFromArgument(trait : ICdmTraitDef, arg : ICdmArgumentDef) {

        if (this.rts) {
            let resTrait = this.rts.get(trait);
            if (resTrait) {
                let av = resTrait.parameterValues.values;
                let newVal = arg.getValue();
                // get the value index from the parameter collection given the parameter that this argument is setting
                let iParam = resTrait.parameterValues.indexOf(arg.getParameterDef());
                if (this.rts.refCnt > 1 && av[iParam] != newVal) {
                    // make a copy and try again
                    this.takeReference(this.rts.shallowCopyWithException(trait));
                    resTrait = this.rts.get(trait);
                    av = resTrait.parameterValues.values;
                }
                av[iParam] = newVal;
            }
        }
    }
    public setTraitParameterValue(toTrait : ICdmTraitDef, paramName : string, value : string | ICdmObject) {
        this.takeReference(this.rts.setTraitParameterValue(toTrait, paramName, value));
    }

    public cleanUp() {
        if (this.rts && this.set == cdmTraitSet.elevatedOnly)
        {
            this.takeReference(this.rts.keepElevated());
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  resolved attributes
////////////////////////////////////////////////////////////////////////////////////////////////////

let __raCopy = 0;
export class ResolvedAttribute {
    public attribute: ICdmAttributeDef;
    public resolvedName: string;
    public resolvedTraits: ResolvedTraitSet;
    public insertOrder: number;

    constructor(attribute: ICdmAttributeDef) {
        this.attribute = attribute;
        this.resolvedTraits = new ResolvedTraitSet();
        this.resolvedTraits.addRef();
        this.resolvedName = attribute.getName();
    }
    public copy(): ResolvedAttribute {
        __raCopy ++;
        let copy = new ResolvedAttribute(this.attribute);
        copy.resolvedName = this.resolvedName;
        copy.resolvedTraits = this.resolvedTraits.shallowCopy();
        copy.resolvedTraits.addRef();
        copy.insertOrder = this.insertOrder;
        return copy;
    }
    public spew(indent: string) {
        console.log(`${indent}[${this.resolvedName}]`);
        this.resolvedTraits.spew(indent + '-');
    }
}

let __rasMergeOne = 0;
let __rasApply = 0;
let __rasApplyAdd = 0;
let __rasApplyRemove = 0;
export class ResolvedAttributeSet extends refCounted {
    resolvedName2resolvedAttribute: Map<string, ResolvedAttribute>;
    set : Array<ResolvedAttribute>;
    constructor() {
        super();
        this.resolvedName2resolvedAttribute = new Map<string, ResolvedAttribute>();
        this.set = new Array<ResolvedAttribute>();
    }
    public merge(toMerge: ResolvedAttribute) : ResolvedAttributeSet {
        __rasMergeOne ++;
        let rasResult : ResolvedAttributeSet = this;
        if (toMerge) {
            if (rasResult.resolvedName2resolvedAttribute.has(toMerge.resolvedName)) {
                let existing: ResolvedAttribute = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                if (this.refCnt > 1 && existing.attribute !== toMerge.attribute) {
                    rasResult = rasResult.copy(); // copy on write
                    existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                }
                existing.attribute = toMerge.attribute; // replace with newest version

                let rtsMerge = existing.resolvedTraits.mergeSet(toMerge.resolvedTraits) // newest one may replace
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
                toMerge.insertOrder = rasResult.set.length;
                rasResult.set.push(toMerge);
            }
        }
        return rasResult;
    }
    public mergeSet(toMerge: ResolvedAttributeSet) : ResolvedAttributeSet {
        let rasResult : ResolvedAttributeSet = this;
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

    public mergeTraitAttributes(traits: ResolvedTraitSet, continuationsIn: ApplierContinuationSet): ApplierContinuationSet {
        // if there was no continuation set provided, build one 
        if (!continuationsIn) {
            continuationsIn = new ApplierContinuationSet();
            // collect a set of appliers for all traits
            let appliers = new Array<[ResolvedTrait, traitApplier]>();
            let iApplier = 0;
            if (traits) {
                let l = traits.size;
                for (let i = 0; i < l; i++) {
                    const rt = traits.set[i];
                    if (rt.trait.isDerivedFrom("does.modifyAttributes")) {
                        let traitAppliers = rt.trait.getTraitAppliers();
                        if (traitAppliers) {
                            let l = traitAppliers.length;
                            for (let ita = 0; ita < l; ita++) {
                                const apl = traitAppliers[ita];
                                    if (apl.attributeAdd)
                                        appliers.push([rt, apl]);
                            }
                        }
                    }
                }
            }
            if (appliers.length == 0)
                return null;

            for (const resTraitApplier of appliers) {
                let applier: traitApplier = resTraitApplier["1"];
                let rt: ResolvedTrait = resTraitApplier["0"];

                // if there are no attributes, this is an entity attribute 
                if (this.resolvedName2resolvedAttribute.size == 0) {
                    continuationsIn.continuations.push({ applier: applier, resAtt: null, resTrait: rt, continuationState: null });
                }
                else {
                    // one for each attribute and applier combo
                    let l = this.set.length;
                    for (let i = 0; i < l; i++) {
                        continuationsIn.continuations.push({ applier: applier, resAtt: this.set[i], resTrait: rt, continuationState: null });
                    }
                }
            }
        }

        // for every attribute in the set run any attribute adders and collect results in a new set
        let addedAttSet: ResolvedAttributeSet = new ResolvedAttributeSet();
        addedAttSet.addRef();
        let continuationsOut = new ApplierContinuationSet();

        for (const continueWith of continuationsIn.continuations) {
            if (continueWith.applier.willAdd(continueWith.resAtt, continueWith.resTrait, continueWith.continuationState)) {
                __rasApplyAdd ++;
                let result = continueWith.applier.attributeAdd(continueWith.resAtt, continueWith.resTrait, continueWith.continuationState);
                // create a new resolved attribute and apply the traits that it has
                let newAttSet: ResolvedAttributeSet = new ResolvedAttributeSet();
                newAttSet.addRef()
                let mergeOne = newAttSet.merge(new ResolvedAttribute(result.addedAttribute).copy());
                mergeOne.addRef();
                newAttSet.release();
                newAttSet = mergeOne;

                newAttSet.applyTraits(result.addedAttribute.getResolvedTraits());
                // accumulate all added
                let mergeResult = addedAttSet.mergeSet(newAttSet);
                mergeResult.addRef();
                addedAttSet.release()
                addedAttSet = mergeResult;

                // if a continue requested, add to list
                if (result.continuationState)
                    continuationsOut.continuations.push({ applier: continueWith.applier, resAtt: continueWith.resAtt, resTrait: continueWith.resTrait, continuationState: result.continuationState });
            }
        }

        continuationsOut.rasResult = this.mergeSet(addedAttSet);
        continuationsOut.rasResult.addRef();

        if (!continuationsOut.continuations.length)
            continuationsOut.continuations = null;
        return continuationsOut;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
//  traits that change attributes
////////////////////////////////////////////////////////////////////////////////////////////////////
    public applyTraits(traits: ResolvedTraitSet) : ResolvedAttributeSet {
        // collect a set of appliers for all traits
        let appliers = new Array<[ResolvedTrait, traitApplier]>();
        let iApplier = 0;
        if (traits) {
            let l = traits.size;
            for (let i = 0; i < l; i++) {
                const rt = traits.set[i];
                if (rt.trait.isDerivedFrom("does.modifyAttributes")) {
                    let traitAppliers = rt.trait.getTraitAppliers();
                    if (traitAppliers) {
                        let l = traitAppliers.length;
                        for (let ita = 0; ita < l; ita++) {
                            const apl = traitAppliers[ita];
                                if (apl.attributeApply)
                                    appliers.push([rt, apl]);
                        }
                    }
                }
            }
        }

        // sorted by priority
        appliers = appliers.sort((l: [ResolvedTrait, traitApplier], r: [ResolvedTrait, traitApplier]) => r["1"].priority - l["1"].priority);

        let rasResult : ResolvedAttributeSet = this;
        let rasApplied : ResolvedAttributeSet; 

        if (this.refCnt > 1 && rasResult.copyNeeded(traits, appliers)) {
            rasResult = rasResult.copy();
        }
        rasApplied = rasResult.apply(traits, appliers);

        // now we are that
        rasResult.resolvedName2resolvedAttribute = rasApplied.resolvedName2resolvedAttribute;
        rasResult.set = rasApplied.set;
        return rasResult;
    }
    
    copyNeeded(traits : ResolvedTraitSet, appliers : Array<[ResolvedTrait, traitApplier]>) : boolean {
        // for every attribute in the set, detect if a merge of traits will alter the traits. if so, need to copy the attribute set to avoid overwrite 
        let l = this.set.length;
        for (let i = 0; i < l; i++) {
            const resAtt = this.set[i];
            if (resAtt.resolvedTraits.mergeSetWillAlter(traits, resAtt.attribute))
                return true;
            for (const resTraitApplier of appliers) {
                let applier: traitApplier = resTraitApplier["1"];
                let rt: ResolvedTrait = resTraitApplier["0"];
                if (applier.willApply(resAtt, rt))
                    return true;
            }
        }
        return false;
    }

    apply(traits : ResolvedTraitSet, appliers : Array<[ResolvedTrait, traitApplier]>) : ResolvedAttributeSet {
        // for every attribute in the set run any attribute appliers
        let appliedAttSet: ResolvedAttributeSet = new ResolvedAttributeSet();
        let l = this.set.length;
        for (let i = 0; i < l; i++) {
            const resAtt = this.set[i];
            let rtsMerge = resAtt.resolvedTraits.mergeSet(traits, resAtt.attribute);
            resAtt.resolvedTraits.release();
            resAtt.resolvedTraits = rtsMerge;
            resAtt.resolvedTraits.addRef();
            for (const resTraitApplier of appliers) {
                let applier: traitApplier = resTraitApplier["1"];
                let rt: ResolvedTrait = resTraitApplier["0"];
                if (applier.willApply(resAtt, rt)) {
                    applier.attributeApply(resAtt, rt);
                }
            }
            appliedAttSet.merge(resAtt);
        }
        return appliedAttSet;
    }

    public removeRequestedAtts() : ResolvedAttributeSet {
        // for every attribute in the set run any attribute removers on the traits they have
        let appliedAttSet: ResolvedAttributeSet = new ResolvedAttributeSet();
        let l = this.set.length;
        for (let i = 0; i < l; i++) {
            let resAtt = this.set[i];
            if (resAtt.resolvedTraits) {
                let l = resAtt.resolvedTraits.size;
                for (let i = 0; resAtt && i < l; i++) {
                    const rt = resAtt.resolvedTraits.set[i];
                    if (resAtt && rt.trait.isDerivedFrom("does.modifyAttributes")) {
                        let traitAppliers = rt.trait.getTraitAppliers();
                        if (traitAppliers) {
                            let l = traitAppliers.length;
                            for (let ita = 0; ita < l; ita++) {
                                const apl = traitAppliers[ita];
                                if (resAtt && apl.attributeRemove) {
                                    let result = apl.attributeRemove(resAtt, rt);
                                    if (result.shouldDelete) {
                                        resAtt = null;
                                        __rasApplyRemove ++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (resAtt)
                appliedAttSet.merge(resAtt);
        }
        
        // now we are that (or a copy)
        let rasResult : ResolvedAttributeSet = this;
        if (this.refCnt > 1 && appliedAttSet.size != rasResult.size) {
            rasResult = appliedAttSet;
        }

        rasResult.resolvedName2resolvedAttribute = appliedAttSet.resolvedName2resolvedAttribute;
        rasResult.set = appliedAttSet.set;
        return rasResult;
    }

    public get(name: string): ResolvedAttribute {
        if (this.resolvedName2resolvedAttribute.has(name)) {
            return this.resolvedName2resolvedAttribute.get(name);
        }
        return null;
    }
    public get size(): number {
        return this.resolvedName2resolvedAttribute.size;
    }
    public copy(): ResolvedAttributeSet {
        let copy = new ResolvedAttributeSet();
        let l = this.set.length;
        for (let i = 0; i < l; i++) {
            copy.merge(this.set[i].copy());
        }
        return copy;
    }
    public spew(indent: string) {
        let l = this.set.length;
        for (let i = 0; i < l; i++) {
            this.set[i].spew(indent);
        }
    }
}

class ResolvedAttributeSetBuilder {
    public ras : ResolvedAttributeSet;
    public inheritedMark : number;
    public mergeAttributes(rasNew : ResolvedAttributeSet) {
        if (rasNew) {
            if (!this.ras)
                this.takeReference(rasNew);
            else 
                this.takeReference(this.ras.mergeSet(rasNew));
        }
    }

    public takeReference(rasNew : ResolvedAttributeSet) {
        if (this.ras !== rasNew) {
            if (rasNew)
                rasNew.addRef();
            if (this.ras)
                this.ras.release();
            this.ras = rasNew;
        }
    }

    public ownOne(ra : ResolvedAttribute) {
        this.takeReference(new ResolvedAttributeSet());
        this.ras.merge(ra);
    }
    public applyTraits(rts : ResolvedTraitSet) {
        if (this.ras)
            this.takeReference(this.ras.applyTraits(rts));
    }
    
    public mergeTraitAttributes(rts : ResolvedTraitSet) {
        if (!this.ras)
            this.takeReference(new ResolvedAttributeSet());

        let localContinue: ApplierContinuationSet = null;
        while (localContinue = this.ras.mergeTraitAttributes(rts, localContinue)) {
            this.takeReference(localContinue.rasResult)
            if (!localContinue.continuations)
                break;
        }
    }
    public removeRequestedAtts() {
        if (this.ras) {
            this.takeReference(this.ras.removeRequestedAtts());
        }
    }
    public markInherited() {
        if (this.ras && this.ras.set)
            this.inheritedMark = this.ras.set.length;
        else
            this.inheritedMark = 0;
    }
    
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  attributed references to other entities
////////////////////////////////////////////////////////////////////////////////////////////////////

class attributePromise {
    constructor(forAtt : string) {
        this.requestedName = forAtt;
    }
    public requestedName : string;
    public resolvedAtt : ICdmAttributeDef;
}

export class ResolvedEntityReferenceSide {
    public entity : ICdmEntityDef;
    public rasb: ResolvedAttributeSetBuilder;

    constructor(entity? : ICdmEntityDef, rasb?: ResolvedAttributeSetBuilder) {
        if (entity)
            this.entity = entity;
        if (rasb)
            this.rasb = rasb;
        else
            this.rasb = new ResolvedAttributeSetBuilder();
    }
    public getFirstAttribute() : ResolvedAttribute {
        if (this.rasb && this.rasb.ras && this.rasb.ras.set && this.rasb.ras.set.length)
            return this.rasb.ras.set[0];
    }
    public spew(indent: string) {
        console.log(`${indent} ent=${this.entity.getName()}`);
        this.rasb.ras.spew(indent + '  atts:');
    }
    
}

export class ResolvedEntityReference {
    public referencing : ResolvedEntityReferenceSide;
    public referenced: ResolvedEntityReferenceSide[];

    constructor() {
        this.referencing = new ResolvedEntityReferenceSide();
        this.referenced = new Array<ResolvedEntityReferenceSide>();
    }
    public copy() : ResolvedEntityReference {
        let result = new ResolvedEntityReference();
        result.referencing.entity = this.referencing.entity;
        result.referencing.rasb = this.referencing.rasb;
        this.referenced.forEach(rers => {
            result.referenced.push(new ResolvedEntityReferenceSide(rers.entity, rers.rasb));
        });
        return result;
    }

    public spew(indent: string) {
        this.referencing.spew(indent + "(referencing)");
        for (let i = 0; i< this.referenced.length; i++) {
            this.referenced[i].spew(indent + `(referenced[${i}])`);
        }
    }
    
}

export class ResolvedEntityReferenceSet {
    set: Array<ResolvedEntityReference>;
    constructor(set : Array<ResolvedEntityReference> = undefined) {
        if (set) {
            this.set = set;
        }
        else
            this.set = new Array<ResolvedEntityReference>();
    }
    public add(toAdd : ResolvedEntityReferenceSet) {
        if (toAdd && toAdd.set && toAdd.set.length) {
            this.set=this.set.concat(toAdd.set);
        }
    }
    public copy() : ResolvedEntityReferenceSet {
        let newSet = this.set.slice(0);
        for (let i = 0; i< newSet.length; i++) {
            newSet[i] = newSet[i].copy();
        }
        return new ResolvedEntityReferenceSet(newSet);
    }
    public findEntity(entOther : ICdmEntityDef) : ResolvedEntityReferenceSet {
        // make an array of just the refs that include the requested
        let filter = this.set.filter((rer : ResolvedEntityReference) : boolean => {
            return (rer.referenced.some((rers : ResolvedEntityReferenceSide): boolean => {
                if (rers.entity === entOther)
                    return true;
            }));
        })

        if (filter.length == 0)
            return null;
        return new ResolvedEntityReferenceSet(filter);
    }

    public spew(indent: string) {
        for (let i = 0; i< this.set.length; i++) {
            this.set[i].spew(indent + `(rer[${i}])`);
        }
    }
    
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  friendly format 
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

export class friendlyFormatNode {
    public verticalMode : boolean = false;
    public indentChildren : boolean = true;
    public terminateAfterList : boolean = true;
    public bracketEmpty : boolean = false;
    public starter : string;
    public terminator : string;
    public separator : string;
    public comment : string;
    public leafSource: string;
    public sourceWidth: number;
    public children: friendlyFormatNode[];
    calcStarter : string;
    calcTerminator : string;
    calcPreceedingSeparator : string;
    calcIndentLevel: number;
    calcNLBefore : boolean;
    calcNLAfter : boolean;

    constructor(leafSource? : string) {
        this.leafSource = leafSource;
    }
    public addComment(comment : string) {
        this.comment = comment;
    }
    public addChild(child : friendlyFormatNode) {
        if (!this.children)
            this.children = new Array<friendlyFormatNode>();
        this.children.push(child);
    }

    public addChildString(source : string, quotes: boolean = false) {
        if (source) {
            if (quotes)
                source = `"${source}"`;
            this.addChild(new friendlyFormatNode(source));
        }
    }

    public measure() : number {
        if (this.leafSource)
            this.sourceWidth = this.leafSource.length;
        else if (this.children) {
            this.sourceWidth = 0;
            let lChildren = this.children.length;
            for (let iChild = 0; iChild < lChildren; iChild++) {
                this.sourceWidth += this.children[iChild].measure();

            }
        }
        else
            this.sourceWidth = 0;

        this.sourceWidth += this.calcPreceedingSeparator.length;
        if (!this.verticalMode) {
            this.sourceWidth += (this.calcStarter.length + this.calcTerminator.length);
        }
        return this.sourceWidth;
    }

    lineStart(startIndent : number) {
        let line = "";
        while (startIndent) {
            line += " ";
            startIndent --;
        }
        return line;
    }

    public layout(indentWidth : number, measureOnly : boolean) : string {

        let layout : string = "";
        let width = 0;
        
        layout += this.calcPreceedingSeparator;

        if (this.calcStarter) {
            layout += this.calcStarter;
        }
        width += layout.length;

        if (this.calcNLBefore) {
            layout += "\n";
            width = 0;
        }

        if (this.children) {
            let lChildren = this.children.length;
            for (let iChild = 0; iChild < lChildren; iChild++) {
                let child = this.children[iChild];
                layout += child.layout(indentWidth, measureOnly);
            }
        }
        else if (this.leafSource) {
            if (this.calcNLBefore)
                layout += this.lineStart(this.calcIndentLevel * indentWidth);
            layout += this.leafSource;
        }

        if (this.calcNLAfter) {
            layout += "\n";
        }

        if (this.calcTerminator) {
            if (this.calcNLAfter)
                layout += this.lineStart(this.calcIndentLevel * indentWidth);
            layout += this.calcTerminator;
            if (this.calcNLAfter)
                layout += "\n";
        }
        return layout;
    }

    public breakLines(maxWidth : number, maxMargin : number, startIndent : number, indentWidth : number) {


    }


    public setDelimiters() {
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

    public setWhitespace(indentLevel : number, needsNL : boolean) : boolean {
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

    public toString(maxWidth : number, maxMargin : number, startIndent : number, indentWidth : number) {
        this.setDelimiters();
        this.setWhitespace(0, false);
        this.calcNLBefore = false;
        this.measure();
        this.breakLines(maxWidth, maxMargin, startIndent, indentWidth);
        return this.layout(indentWidth, false);

    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  common base class
//  {Object}
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

abstract class cdmObject implements ICdmObject {

    public abstract getObjectType(): cdmObjectType;
    public abstract getObjectRefType(): cdmObjectType;
    public abstract getObjectDef<T=ICdmObjectDef>(): T
    public abstract copy(): ICdmObject
    public abstract getFriendlyFormat() : friendlyFormatNode;
    public abstract validate(): boolean;

    skipElevated = true;

    rtsbAll: ResolvedTraitSetBuilder;
    rtsbElevated: ResolvedTraitSetBuilder;
    rtsbInherited: ResolvedTraitSetBuilder;
    rtsbApplied: ResolvedTraitSetBuilder;
    public abstract constructResolvedTraits(rtsb : ResolvedTraitSetBuilder);
    public getResolvedTraits(set?: cdmTraitSet): ResolvedTraitSet {
        if (!set)
            set = cdmTraitSet.all;
        if (!this.rtsbInherited && (set == cdmTraitSet.all || set == cdmTraitSet.inheritedOnly))  {
            this.rtsbInherited = new ResolvedTraitSetBuilder(cdmTraitSet.inheritedOnly);
            this.constructResolvedTraits(this.rtsbInherited);
        }
            
        if (!this.rtsbApplied && (set == cdmTraitSet.all || set == cdmTraitSet.appliedOnly)) {
            this.rtsbApplied = new ResolvedTraitSetBuilder(cdmTraitSet.appliedOnly);
            this.constructResolvedTraits(this.rtsbApplied);
        }
            
        if (!this.skipElevated && !this.rtsbElevated && (set == cdmTraitSet.all || set == cdmTraitSet.elevatedOnly)) {
            this.rtsbElevated = new ResolvedTraitSetBuilder(cdmTraitSet.elevatedOnly);
            this.constructResolvedTraits(this.rtsbElevated);
        }
            
        if (!this.rtsbAll && set == cdmTraitSet.all) {
            this.rtsbAll = new ResolvedTraitSetBuilder(cdmTraitSet.all);
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
    public setTraitParameterValue(toTrait : ICdmTraitDef, paramName : string, value : string | ICdmObject) {
        // causes rtsb to get created
        this.getResolvedTraits();
        this.rtsbAll.setTraitParameterValue(toTrait, paramName, value);
    }

    resolvedAttributes: ResolvedAttributeSet;
    public abstract constructResolvedAttributes(): ResolvedAttributeSet;
    resolvingAttributes : boolean = false;
    public getResolvedAttributes(): ResolvedAttributeSet {
        if (!this.resolvedAttributes) {
            if (this.resolvingAttributes) {
                // re-entered this attribute through some kind of self or looping reference.
                return new ResolvedAttributeSet();
            }
            this.resolvingAttributes = true;
            this.resolvedAttributes = this.constructResolvedAttributes();
            this.resolvingAttributes = false;
        }
        return this.resolvedAttributes;
    }

    clearTraitCache() {
        if (this.rtsbAll)
            this.rtsbAll.clear();
        if (this.rtsbApplied)
            this.rtsbApplied.clear();
        if (this.rtsbElevated)
            this.rtsbElevated.clear();
        if (this.rtsbInherited)
            this.rtsbInherited.clear();
    }


    public abstract copyData(stringRefs? : boolean): any;
    public toJSON(stringRefs? : boolean): any {
        return this.copyData(stringRefs);
    }

    public static arraycopyData<T>(source: ICdmObject[], stringRefs? : boolean): Array<T> {
        if (!source)
            return undefined;
        let casted = new Array<T>();
        let l = source.length;
        for (let i = 0; i < l; i++) {
            const element = source[i];
            casted.push(element ? element.copyData(stringRefs) : undefined);
        }
        return casted;
    }

    public static arrayCopy<T>(source: cdmObject[]): Array<T> {
        if (!source)
            return undefined;
        let casted = new Array<T>();
        let l = source.length;
        for (let i = 0; i < l; i++) {
            const element = source[i];
            casted.push(element ? <any> element.copy() : undefined);
        }
        return casted;
    }

    public static arrayGetFriendlyFormat(under : friendlyFormatNode, source: cdmObject[]) {
        if (!source || source.length == 0)
            return;
        let l = source.length;
        for (let i = 0; i < l; i++) {
            under.addChild(source[i].getFriendlyFormat());
        }
    }

    public static createStringOrImpl<T>(object: any, typeName: cdmObjectType, creater: CdmCreator<T>): (StringConstant | T) {
        if (!object)
            return undefined;
        if (typeof object === "string")
            return new StringConstant(typeName, object);
        else
            return creater(object);
    }

    public static createConstant(object: any): ArgumentValue {
        if (!object)
            return undefined;
        if (typeof object === "string")
            return new StringConstant(cdmObjectType.unresolved, object);
        else if (object.relationship) {
            if (object.dataType)
                return TypeAttributeImpl.createClass(object);
            else if (object.entity)
                return EntityAttributeImpl.createClass(object);
            else
                return null;
        }
        else if (object.relationshipReference)
            return RelationshipReferenceImpl.createClass(object);
        else if (object.traitReference)
            return TraitReferenceImpl.createClass(object);
        else if (object.dataTypeReference)
            return DataTypeReferenceImpl.createClass(object);
        else if (object.entityReference)
            return EntityReferenceImpl.createClass(object);
        else if (object.attributeGroupReference)
            return AttributeGroupReferenceImpl.createClass(object);
        else
            return null;
    }
    public static createDataTypeReference(object: any): (StringConstant | DataTypeReferenceImpl) {
        return cdmObject.createStringOrImpl<DataTypeReferenceImpl>(object, cdmObjectType.dataTypeRef, DataTypeReferenceImpl.createClass);
    }
    public static createRelationshipReference(object: any): (StringConstant | RelationshipReferenceImpl) {
        return cdmObject.createStringOrImpl<RelationshipReferenceImpl>(object, cdmObjectType.relationshipRef, RelationshipReferenceImpl.createClass);
    }
    public static createEntityReference(object: any): (StringConstant | EntityReferenceImpl) {
        return cdmObject.createStringOrImpl<EntityReferenceImpl>(object, cdmObjectType.entityRef, EntityReferenceImpl.createClass);
    }

    public static createAttributeArray(object: any): (StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[] {
        if (!object)
            return undefined;

        let result: (StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[];
        result = new Array<StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>();

        let l=object.length;
        for (let i = 0; i < l; i++) {
            const ea = object[i];
            if (typeof ea === "string")
                result.push(new StringConstant(cdmObjectType.attributeGroupRef, ea));
            else {
                if (ea.attributeGroupReference)
                    result.push(AttributeGroupReferenceImpl.createClass(ea));
                else if (ea.name)
                    result.push(TypeAttributeImpl.createClass(ea));
                else if (ea.entity)
                    result.push(EntityAttributeImpl.createClass(ea));
            }
        }
        return result;
    }

    public static createTraitReferenceArray(object: any): (StringConstant | TraitReferenceImpl)[] {
        if (!object)
            return undefined;

        let result: (StringConstant | TraitReferenceImpl)[];
        result = new Array<StringConstant | TraitReferenceImpl>();

        let l=object.length;
        for (let i = 0; i < l; i++) {
            const tr = object[i];
            result.push(cdmObject.createStringOrImpl<TraitReferenceImpl>(tr, cdmObjectType.traitRef, TraitReferenceImpl.createClass));
        }
        return result;
    }

    public abstract getPathBranch(): string;
    public abstract visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean;
    public static visitArray(items: Array<cdmObject>, userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let result: boolean = false;
        if (items) {
            items.some(element => {
                if (element)
                    if (element.visit(userData, pathRoot, preChildren, postChildren, statusRpt)) {
                        result = true;
                        return true;
                    }
            });
        }
        return result;
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  string used as a constant, reference, or other shortcut
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
export class StringConstant extends cdmObject implements ICdmStringConstant, ICdmObjectRef, ICdmTraitRef, ICdmParameterDef, ICdmArgumentDef {
    expectedType: cdmObjectType;
    constantValue: string;
    resolvedReference: cdmObjectDef;
    resolvedParameter: ICdmParameterDef;

    constructor(expectedType: cdmObjectType, constantValue: string) {
        super();
        this.expectedType = expectedType;
        this.constantValue = constantValue;
    }
    public copyData(stringRefs? : boolean): any {
        this.checkForSwap();
        if (stringRefs && this.resolvedReference) {
            return {
                corpusPath: this.resolvedReference.getObjectPath(),
                identifier: this.constantValue
            } as identifierRef;
        }
        else 
            return this.constantValue;
    }
    public copy() : ICdmObject {
        this.checkForSwap();
        let copy = new StringConstant(this.expectedType, this.constantValue);
        copy.resolvedReference = this.resolvedReference;
        copy.resolvedParameter = this.resolvedParameter;
        return copy;
    }
    public validate(): boolean {
        return this.constantValue ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let v = this.constantValue;
        if (!this.resolvedReference) {
            v = `"${v}"`;
        }
        return new friendlyFormatNode(v);
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.stringConstant;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public getConstant(): string {
        // if string used as an argument
        if (this.resolvedReference)
            return null;
        return this.constantValue;
    }
    public setExplanation(explanation : string): string {
        return null;
    }
    
    checkForSwap() {        
        if (this.resolvedReference) {
            if ((this.resolvedReference as any).requestedName) {
                // this is a promise, see if we can swap for it
                if ((this.resolvedReference as any).resolvedAtt)
                    this.resolvedReference = (this.resolvedReference as any).resolvedAtt;
            }
        }
    }

    public getObjectDef<T=ICdmObjectDef>(): T {
        this.checkForSwap();
        return <any>this.resolvedReference;
    }
    public setObjectDef(def :ICdmObjectDef) : ICdmObjectDef {
        this.resolvedReference = def as any;
        return <any>this.resolvedReference;
    }
    public getAppliedTraitRefs(): ICdmTraitRef[] {
        return null;
    }
    public addAppliedTrait(traitDef : ICdmTraitRef | ICdmTraitDef | string) : ICdmTraitRef {
        throw new Error("can't apply traits on simple reference")
    }
    
    public setArgumentValue(name : string, value : string) {
        throw new Error("can't set argument value on simple reference")
    }
    
    public getArgumentDefs(): ICdmArgumentDef[] {
        // if string constant is used as a trait ref, there are no arguments
        return null;
    }
    public addArgument(name: string, value : ICdmObject) : ICdmArgumentDef {
        throw new Error("can't set argument value on simple reference")
    }

    public getExplanation(): string {
        // if string is used as a parameter def
        return null;
    }
    public getName(): string {
        // if string is used as a parameter def
        return this.constantValue;
    }
    public getDefaultValue(): ICdmObject {
        // if string is used as a parameter def
        return null;
    }
    public getRequired(): boolean {
        // if string is used as a parameter def
        return false;
    }
    public getDirection(): string {
        // if string is used as a parameter def
        return "in";
    }
    public getDataTypeRef(): ICdmDataTypeRef {
        // if string is used as a parameter def
        return null;
    }
    public getValue(): ICdmObject {
        // if string used as an argument
        if (this.resolvedReference)
            this.resolvedReference;
        return this;
    }
    public setValue(value : ICdmObject) {
        // if string used as an argument
        if (value.getObjectType() == cdmObjectType.stringConstant)
            this.constantValue = (value as StringConstant).constantValue;
    }
    public getParameterDef(): ICdmParameterDef {
        // if string used as an argument
        return this.resolvedParameter;
    }
    public getPathBranch(): string {
        if (!this.constantValue)
            return "XXXXX";
        return this.constantValue;
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path = pathRoot + this.getPathBranch();
        // not much to do
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
    public constructResolvedAttributes(): ResolvedAttributeSet {
        if (this.resolvedReference) {
            let rasb = new ResolvedAttributeSetBuilder();
            rasb.takeReference(this.resolvedReference.getResolvedAttributes());
            // things that need to go away
            rasb.removeRequestedAtts();
            return rasb.ras;
        }
        return null;
    }
    public getResolvedEntityReferences(): ResolvedEntityReferenceSet {
        if (this.resolvedReference && (this.resolvedReference.getObjectType() == cdmObjectType.attributeGroupDef || this.resolvedReference.getObjectType() == cdmObjectType.entityDef))
            return (<any> this.resolvedReference as ICdmReferencesEntities).getResolvedEntityReferences();
        return null;

    }

    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) {
        if (this.resolvedReference) {
            if (rtsb.set == cdmTraitSet.inheritedOnly)
                // this string is an implicit reference to an object def, get exhibited traits
                rtsb.takeReference(this.resolvedReference.getResolvedTraits(cdmTraitSet.all));
            else if (rtsb.set == cdmTraitSet.elevatedOnly)
                // this string is an implicit reference to an object def, get exhibited traits
                rtsb.takeReference(this.resolvedReference.getResolvedTraits(rtsb.set));
            rtsb.cleanUp();
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  imports
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

export class ImportImpl extends cdmObject implements ICdmImport {
    uri: string;
    moniker: string;
    doc: Document;

    constructor(uri: string, moniker: string = undefined) {
        super();
        this.uri = uri;
        this.moniker = moniker ? moniker : undefined;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.import;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return null;
    }
    public copyData(stringRefs? : boolean): Import {
        let castedToInterface: Import = {  moniker: this.moniker, uri: this.uri };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new ImportImpl(this.uri, this.moniker);
        copy.doc = this.doc;
        return copy;
    }
    public validate(): boolean {
        return this.uri ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = " ";
        ff.terminator = ";"
        ff.addChildString("import *");
        ff.addChildString(this.moniker ? "as " + this.moniker : undefined);
        ff.addChildString("from");
        ff.addChildString(this.uri, true);
        return ff;
    }
    public static createClass(object: any): ImportImpl {

        let imp: ImportImpl = new ImportImpl(object.uri, object.moniker);
        return imp;
    }
    public getPathBranch(): string {
        return this.uri;
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        // not much to do
        if (preChildren && preChildren(userData, this, pathRoot, statusRpt))
            return false;
        if (postChildren && postChildren(userData, this, pathRoot, statusRpt))
            return true;
        return false;
    }
    public constructResolvedAttributes(): ResolvedAttributeSet {
        return null;
    }
    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) {    
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

export class ArgumentImpl extends cdmObject implements ICdmArgumentDef {
    explanation: string;
    name: string;
    value: ArgumentValue;
    resolvedParameter: ICdmParameterDef;

    public getObjectType(): cdmObjectType {
        return cdmObjectType.argumentDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return null;
    }
    public copyData(stringRefs? : boolean): Argument {
        // skip the argument if just a value
        if (!this.name) 
            return this.value as any;
        let castedToInterface: Argument = {  explanation : this.explanation, name: this.name, value: this.value.copyData(stringRefs)};
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new ArgumentImpl();
        copy.name = this.name;
        copy.value = <ArgumentValue> this.value.copy();
        copy.resolvedParameter = this.resolvedParameter;
        copy.explanation = this.explanation;
        return copy;
    }
    public validate(): boolean {
        return this.value ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = ": ";
        ff.addChildString(this.name);
        ff.addChild(this.value.getFriendlyFormat());
        ff.addComment(this.explanation);
        return ff;
    }
    public static createClass(object: any): ArgumentImpl {

        let c: ArgumentImpl = new ArgumentImpl();
        
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
    public getExplanation(): string {
        return this.explanation;
    }
    public setExplanation(explanation : string): string {
        this.explanation = explanation;
        return this.explanation;
    }
    public getValue(): ICdmObject {
        return this.value;
    }
    public setValue(value : ICdmObject) {
        this.value = <ArgumentValue> value;
    }
    public getName(): string {
        return this.name;
    }
    public getParameterDef(): ICdmParameterDef {
        return this.resolvedParameter;
    }
    public getPathBranch(): string {
        if (this.value)
            return "value/";
        return "";
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.value)
            if (this.value.visit(userData, path, preChildren, postChildren, statusRpt))
                return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
    public constructResolvedAttributes(): ResolvedAttributeSet {
        // no way for attributes to come up from an argument
        return null;
    }
    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) {    
        return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ParameterDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class ParameterImpl extends cdmObject implements ICdmParameterDef {
    explanation: string;
    name: string;
    defaultValue: ArgumentValue;
    required: boolean;
    direction: string;
    dataType: StringConstant | DataTypeReferenceImpl;

    constructor(name: string) {
        super();
        this.name = name;
    }

    public getObjectType(): cdmObjectType {
        return cdmObjectType.parameterDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return null;
    }

    public copyData(stringRefs? : boolean): Parameter {
        let castedToInterface: Parameter = {
            explanation: this.explanation,
            name: this.name,
            defaultValue: this.defaultValue ? this.defaultValue.copyData(stringRefs) : undefined,
            required: this.required,
            direction: this.direction,
            dataType: this.dataType ? this.dataType.copyData(stringRefs) : undefined
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new ParameterImpl(this.name);
        copy.explanation = this.explanation;
        copy.defaultValue = this.defaultValue ? <ArgumentValue> this.defaultValue.copy() : undefined;
        copy.required = this.required;
        copy.direction = this.direction;
        copy.dataType = this.dataType ? <StringConstant | DataTypeReferenceImpl> this.dataType.copy() : undefined
        return copy;
    }
    public validate(): boolean {
        return this.name ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = " ";
        ff.addChildString(this.required ? "required" : undefined);
        ff.addChildString(this.direction);
        ff.addChild(this.dataType.getFriendlyFormat());
        ff.addChildString(this.name);
        if (this.defaultValue) {
            ff.addChildString("=");
            ff.addChild(this.defaultValue.getFriendlyFormat());
        }
        ff.addComment(this.explanation);
        return ff;
    }

    public static createClass(object: any): ParameterImpl {

        let c: ParameterImpl = new ParameterImpl(object.name);
        c.explanation = object.explanation;
        c.required = object.required ? object.required : false;
        c.direction = object.direction ? object.direction : "in";

        c.defaultValue = cdmObject.createConstant(object.defaultValue);
        c.dataType = cdmObject.createDataTypeReference(object.dataType);

        return c;
    }
    public getExplanation(): string {
        return this.explanation;
    }
    public getName(): string {
        return this.name;
    }
    public getDefaultValue(): ICdmObject {
        return this.defaultValue;
    }
    public getRequired(): boolean {
        return this.required;
    }
    public getDirection(): string {
        return this.direction;
    }
    public getDataTypeRef(): ICdmDataTypeRef {
        return this.dataType;
    }
    public getPathBranch(): string {
        return this.name;
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.defaultValue)
            if (this.defaultValue.visit(userData, path + "/defaultValue/", preChildren, postChildren, statusRpt))
                return true;
        if (this.dataType)
            if (this.dataType.visit(userData, path + "/dataType/", preChildren, postChildren, statusRpt))
                return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
    public constructResolvedAttributes(): ResolvedAttributeSet {
        return null;
    }
    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        return null;
    }
}

let addTraitRef = (collection : Array<(StringConstant | TraitReferenceImpl)>, traitDef : ICdmTraitRef | ICdmTraitDef | string) : ICdmTraitRef => {
    let trait : (StringConstant | TraitImpl);
    if (typeof traitDef === "string")
        trait = new StringConstant(cdmObjectType.traitRef, traitDef);
    else if (traitDef.getObjectType() == cdmObjectType.traitDef)
        trait = traitDef as TraitImpl;
    else if (traitDef.getObjectType() == cdmObjectType.traitRef) {
        collection.push(traitDef as TraitReferenceImpl);
        return traitDef as ICdmTraitRef;
    }
        
    let tRef = new TraitReferenceImpl(trait, false);
    collection.push(tRef);
    return tRef;
}


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

abstract class cdmObjectDef extends cdmObject implements ICdmObjectDef {
    public explanation: string;
    public exhibitsTraits: (StringConstant | TraitReferenceImpl)[];
    public corpusPath : string;

    constructor(exhibitsTraits: boolean = false) {
        super();
        if (exhibitsTraits)
            this.exhibitsTraits = new Array<(StringConstant | TraitReferenceImpl)>();
    }
    public abstract getName(): string;
    public abstract isDerivedFrom(base: string): boolean;
    public copyDef(copy : cdmObjectDef) {
        copy.explanation = this.explanation;
        copy.exhibitsTraits = cdmObject.arrayCopy<StringConstant | TraitReferenceImpl>(this.exhibitsTraits);
    }

    public getFriendlyFormatDef(under : friendlyFormatNode) {
        if (this.exhibitsTraits && this.exhibitsTraits.length)  {
            let ff = new friendlyFormatNode();
            ff.verticalMode = false;
            ff.separator = " ";
            ff.addChildString("exhibits");
            let ffT = new friendlyFormatNode();
            ffT.verticalMode = false;
            ffT.separator = ", ";
            cdmObject.arrayGetFriendlyFormat(ffT, this.exhibitsTraits);
            ff.addChild(ffT);
            under.addChild(ff);
        }
        under.addComment(this.explanation);
    }

    public getObjectDef<T=ICdmObjectDef>(): T {
        return <any>this;
    }

    public getExplanation(): string {
        return this.explanation;
    }
    public setExplanation(explanation : string): string {
        this.explanation = explanation;
        return this.explanation;
    }
    public getExhibitedTraitRefs(): ICdmTraitRef[] {
        return this.exhibitsTraits;
    }
    public addExhibitedTrait(traitDef : ICdmTraitRef | ICdmTraitDef | string) : ICdmTraitRef {
        if (!traitDef)
            return null;
        this.clearTraitCache();
        if (!this.exhibitsTraits)
            this.exhibitsTraits = new Array<(StringConstant | TraitReferenceImpl)>();
        return addTraitRef(this.exhibitsTraits, traitDef);
    }
    
    public visitDef(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        if (this.exhibitsTraits)
            if (cdmObject.visitArray(this.exhibitsTraits, userData, pathRoot + "/exhibitsTraits/", preChildren, postChildren, statusRpt))
                return true;
        return false;
    }

    public isDerivedFromDef(base: ICdmObjectRef, name: string, seek: string): boolean {
        if (seek == name)
            return true;
        if (base && base.getObjectDef())
            return base.getObjectDef().isDerivedFrom(seek);
        return false;
    }

    public constructResolvedTraitsDef(base: ICdmObjectRef, rtsb : ResolvedTraitSetBuilder) {
        let set = rtsb.set;
        if (set == cdmTraitSet.inheritedOnly)
            set = cdmTraitSet.all;

        // get from base class first, then see if some are applied to base class on ref then add any traits exhibited by this def
        if (base) {
            // merge in all from base class
            rtsb.mergeTraits(base.getResolvedTraits(set));
        }
        // merge in any that are exhibited by this class
        if (this.exhibitsTraits) {
            this.exhibitsTraits.forEach(et => {
                rtsb.mergeTraits(et.getResolvedTraits(set));
            });
        }
    }
    public getObjectPath() : string {
        return this.corpusPath;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {ObjectRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export abstract class cdmObjectRef extends cdmObject implements ICdmObjectRef {
    appliedTraits?: (StringConstant | TraitReferenceImpl)[];

    constructor(appliedTraits: boolean) {
        super();
        if (appliedTraits)
            this.appliedTraits = new Array<StringConstant | TraitReferenceImpl>();
    }
    public copyRef(copy : cdmObjectRef) {
        copy.appliedTraits = cdmObject.arrayCopy<StringConstant | TraitReferenceImpl>(this.appliedTraits);
    }
    public getFriendlyFormatRef(under : friendlyFormatNode)  {
        if (this.appliedTraits && this.appliedTraits.length)  {
            let ff = new friendlyFormatNode();
            ff.verticalMode = false;
            ff.separator = ", ";
            ff.starter = "[";
            ff.terminator = "]";
            cdmObject.arrayGetFriendlyFormat(ff, this.appliedTraits);
            under.addChild(ff);
        }
    }

    abstract setObjectDef(def :ICdmObjectDef) : ICdmObjectDef;

    public getAppliedTraitRefs(): ICdmTraitRef[] {
        return this.appliedTraits;
    }
    public addAppliedTrait(traitDef : ICdmTraitRef | ICdmTraitDef | string) : ICdmTraitRef {
        if (!traitDef)
            return null;
        this.clearTraitCache();
        if (!this.appliedTraits)
            this.appliedTraits = new Array<(StringConstant | TraitReferenceImpl)>();
        return addTraitRef(this.appliedTraits, traitDef);
    }
    
    public visitRef(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        if (this.appliedTraits)
            if (cdmObject.visitArray(this.appliedTraits, userData, pathRoot + "/appliedTraits/", preChildren, postChildren, statusRpt))
                return true;
        return false;
    }
    public constructResolvedAttributes(): ResolvedAttributeSet {
        // find and cache the complete set of attributes
        let rasb = new ResolvedAttributeSetBuilder();
        rasb.takeReference(this.getObjectDef().getResolvedAttributes());
        rasb.applyTraits(this.getResolvedTraits(cdmTraitSet.appliedOnly));
        rasb.removeRequestedAtts();
        return rasb.ras;
    }

    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        let set = rtsb.set;
        let objDef = this.getObjectDef();

        if (set == cdmTraitSet.inheritedOnly) {
            if (objDef)
                rtsb.takeReference(objDef.getResolvedTraits(cdmTraitSet.all));
            return;
        }

        if (set == cdmTraitSet.appliedOnly)
            set = cdmTraitSet.all;

        if (set == cdmTraitSet.elevatedOnly) {
            if (objDef)
                rtsb.takeReference(objDef.getResolvedTraits(set));
            return;
        }

        if (this.appliedTraits) {
            this.appliedTraits.forEach(at => {
                rtsb.mergeTraits(at.getResolvedTraits(set));
            });
        }
        rtsb.cleanUp();
        
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
export class TraitReferenceImpl extends cdmObjectRef implements ICdmTraitRef {
    trait: StringConstant | TraitImpl;
    arguments?: (StringConstant | ArgumentImpl)[];

    constructor(trait: StringConstant | TraitImpl, hasArguments: boolean) {
        super(false);
        this.trait = trait;
        if (hasArguments)
            this.arguments = new Array<StringConstant | ArgumentImpl>();
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.traitRef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public copyData(stringRefs? : boolean): TraitReference {
        let castedToInterface: TraitReference = {
            traitReference: this.trait.copyData(stringRefs),
            arguments: cdmObject.arraycopyData<string | Argument>(this.arguments, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new TraitReferenceImpl(this.trait, false);
        copy.arguments = cdmObject.arrayCopy<StringConstant | ArgumentImpl>(this.arguments);
        this.copyRef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.trait ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.addChildString(this.trait.getName());
        
        let ffSub = new friendlyFormatNode();
        ffSub.verticalMode = false;
        ffSub.separator = ", ";
        ffSub.starter = "(";
        ffSub.terminator = ")";
        ffSub.bracketEmpty = true;
        cdmObject.arrayGetFriendlyFormat(ffSub, this.arguments);
        ff.addChild(ffSub);
        return ff;
    }

    public static createClass(object: any): TraitReferenceImpl {
        let trait = cdmObject.createStringOrImpl<TraitImpl>(object.traitReference, cdmObjectType.traitRef, TraitImpl.createClass);
        let c: TraitReferenceImpl = new TraitReferenceImpl(trait, object.arguments);
        if (object.arguments) {
            object.arguments.forEach(a => {
                c.arguments.push(cdmObject.createStringOrImpl<ArgumentImpl>(a, cdmObjectType.argumentDef, ArgumentImpl.createClass));
            });
        }
        return c;
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return this.trait.getObjectDef<T>();
    }
    public setObjectDef(def :ICdmObjectDef) : ICdmObjectDef {
        this.trait = def as any;
        return this.trait.getObjectDef<ICdmObjectDef>();
    }
    public getArgumentDefs(): (ICdmArgumentDef)[] {
        return this.arguments;
    }
    public addArgument(name: string, value : ICdmObject) : ICdmArgumentDef {
        if (!this.arguments)
            this.arguments = new Array<StringConstant | ArgumentImpl>();
        let newArg = Corpus.MakeObject<ICdmArgumentDef>(cdmObjectType.argumentDef, name);
        newArg.setValue(value);
        this.arguments.push(newArg as any);
        return newArg;
    }
    public setArgumentValue(name : string, value : string) {
        let valueObj = new StringConstant(cdmObjectType.unresolved, value);
        if (!this.arguments)
            this.arguments = new Array<StringConstant | ArgumentImpl>();
        let iArgSet = 0;
        for (iArgSet = 0; iArgSet < this.arguments.length; iArgSet++) {
            const arg = this.arguments[iArgSet];
            if (arg.getName() == name) {
                arg.setValue(valueObj);
            }
        }
        if (iArgSet == this.arguments.length) {
            let arg = new ArgumentImpl();
            arg.name = name;
            arg.value = valueObj;
        }
    }
    public getPathBranch(): string {
        if (this.trait.getObjectType() != cdmObjectType.stringConstant)
            return "";
        return this.trait.getPathBranch();
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.trait)
            if (this.trait.visit(userData, path, preChildren, postChildren, statusRpt))
                return true;
        if (this.arguments)
            if (cdmObject.visitArray(this.arguments, userData, path + "/arguments/", preChildren, postChildren, statusRpt))
                return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
    public constructResolvedAttributes(): ResolvedAttributeSet {
        return null;
    }
    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        let set = rtsb.set;
        if (set != cdmTraitSet.appliedOnly) {
            if (set == cdmTraitSet.inheritedOnly)
                set = cdmTraitSet.all;

            // get referenced trait
            let trait = this.getObjectDef<ICdmTraitDef>();
            if (trait) {
                // get the set of resolutions, should just be this one trait
                rtsb.takeReference(trait.getResolvedTraits(set));
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
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TraitDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class TraitImpl extends cdmObjectDef implements ICdmTraitDef {
    explanation: string;
    traitName: string;
    extendsTrait: StringConstant | TraitReferenceImpl;
    hasParameters: (StringConstant | ParameterImpl)[];
    allParameters: ParameterCollection;
    appliers: traitApplier[];
    elevated: boolean;

    constructor(name: string, extendsTrait: (StringConstant | TraitReferenceImpl), hasParameters: boolean = false) {
        super();
        this.traitName = name;
        this.extendsTrait = extendsTrait;
        if (hasParameters)
            this.hasParameters = new Array<(StringConstant | ParameterImpl)>();
    }

    public getObjectType(): cdmObjectType {
        return cdmObjectType.traitDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.traitRef;
    }
    public copyData(stringRefs? : boolean): Trait {
        let castedToInterface: Trait = {
            explanation: this.explanation,
            traitName: this.traitName,
            extendsTrait: this.extendsTrait ? this.extendsTrait.copyData(stringRefs) : undefined,
            hasParameters: cdmObject.arraycopyData<string | Parameter>(this.hasParameters, stringRefs),
            elevated : this.elevated
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new TraitImpl(this.traitName, null, false);
        copy.extendsTrait = this.extendsTrait ? <StringConstant | TraitReferenceImpl> this.extendsTrait.copy() : undefined,
        copy.hasParameters = cdmObject.arrayCopy<StringConstant | ParameterImpl>(this.hasParameters)
        copy.allParameters = null;
        copy.elevated = this.elevated;
        this.copyDef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.traitName ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = " ";
        ff.terminator = ";";
        ff.addChildString("trait");
        ff.addChildString(this.traitName);
        if (this.extendsTrait) {
            ff.addChildString("extends");
            ff.addChild(this.extendsTrait.getFriendlyFormat());
        }
        this.getFriendlyFormatDef(ff);
        return ff;
    }
    public static createClass(object: any): TraitImpl {

        let extendsTrait: (StringConstant | TraitReferenceImpl);
        extendsTrait = cdmObject.createStringOrImpl<TraitReferenceImpl>(object.extendsTrait, cdmObjectType.traitRef, TraitReferenceImpl.createClass);

        let c: TraitImpl = new TraitImpl(object.traitName, extendsTrait, object.hasParameters);

        if (object.explanation)
            c.explanation = object.explanation;

        if (object.hasParameters) {
            object.hasParameters.forEach(ap => {
                c.hasParameters.push(cdmObject.createStringOrImpl<ParameterImpl>(ap, cdmObjectType.parameterDef, ParameterImpl.createClass));
            });
        }

        if (object.elevated != undefined)
            c.elevated = object.elevated;

        return c;
    }
    public getExplanation(): string {
        return this.explanation;
    }
    public getName(): string {
        return this.traitName;
    }
    public getExtendsTrait(): ICdmTraitRef {
        return this.extendsTrait;
    }
    public setExtendsTrait(traitDef : ICdmTraitRef | ICdmTraitDef | string) : ICdmTraitRef {
        if (!traitDef)
            return null;
        this.clearTraitCache();
        let extRef = new Array<(StringConstant | TraitReferenceImpl)>();
        addTraitRef(extRef, traitDef);
        this.extendsTrait = extRef[0];
        return this.extendsTrait;
    }
    public getHasParameterDefs(): ICdmParameterDef[] {
        return this.hasParameters;
    }
    public getExhibitedTraitRefs(): ICdmTraitRef[] {
        return null;
    }
    public getElevated(): boolean {
        if (this.elevated)
            return true;
        if (this.extendsTrait) 
            return this.extendsTrait.getObjectDef<ICdmTraitDef>().getElevated();
        return false;
    }
    public setElevated(elevated : boolean): boolean {
        this.elevated = elevated;
        return this.elevated;
    }
    public isDerivedFrom(base: string): boolean {
        return this.isDerivedFromDef(this.getExtendsTrait(), this.getName(), base);
    }
    public getPathBranch(): string {
        return this.traitName;
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();

        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.extendsTrait)
            if (this.extendsTrait.visit(userData, path + "/extendsTrait/", preChildren, postChildren, statusRpt))
                return true;
        if (this.hasParameters)
            if (cdmObject.visitArray(this.hasParameters, userData, path + "/hasParameters/", preChildren, postChildren, statusRpt))
                return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }

    public addTraitApplier(applier: traitApplier) {
        if (!this.appliers)
            this.appliers = new Array<traitApplier>();
        this.appliers.push(applier);
    }

    public getTraitAppliers(): traitApplier[] {
        return this.appliers;
    }

    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        let set = rtsb.set;
        if (set != cdmTraitSet.appliedOnly) {
            if (set == cdmTraitSet.elevatedOnly && !this.getElevated()) {
                // stop now. won't keep these anyway
                return;
            }

            if (set == cdmTraitSet.inheritedOnly)
                set = cdmTraitSet.all;
            let baseValues: ICdmObject[];
            if (this.extendsTrait) {
                // get the resolution of the base class and use the values as a starting point for this trait's values
                let base: ResolvedTraitSet = this.extendsTrait.getResolvedTraits(set);
                if (base)
                    baseValues = base.get(this.extendsTrait.getObjectDef<ICdmTraitDef>()).parameterValues.values;
            }
            let pc = this.getAllParameters();
            let av = new Array<ICdmObject>();
            for (let i = 0; i < pc.sequence.length; i++) {
                // either use the default value or (higher precidence) the value taken from the base reference
                let value: ICdmObject = (pc.sequence[i] as ParameterImpl).defaultValue;
                let baseValue: ICdmObject;
                if (baseValues && i < baseValues.length) {
                    baseValue = baseValues[i];
                    if (baseValue)
                        value = baseValue;
                }
                av.push(value);
            }
            rtsb.ownOne(new ResolvedTrait(this, pc, av));
        }
    }
    public getAllParameters(): ParameterCollection {
        if (this.allParameters)
            return this.allParameters;

        // get parameters from base if there is one
        let prior: ParameterCollection;
        if (this.extendsTrait)
            prior = this.getExtendsTrait().getObjectDef<ICdmTraitDef>().getAllParameters();
        this.allParameters = new ParameterCollection(prior);
        if (this.hasParameters) {
            this.hasParameters.forEach(element => {
                this.allParameters.add(element as ICdmParameterDef);
            });
        }

        return this.allParameters;
    }
    public constructResolvedAttributes(): ResolvedAttributeSet {
        return null;
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
export class RelationshipReferenceImpl extends cdmObjectRef {
    relationship: StringConstant | RelationshipImpl;

    constructor(relationship: StringConstant | RelationshipImpl, appliedTraits: boolean) {
        super(appliedTraits);
        this.relationship = relationship;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.relationshipRef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public copyData(stringRefs? : boolean): RelationshipReference {
        let castedToInterface: RelationshipReference = {
            relationshipReference: this.relationship.copyData(stringRefs),
            appliedTraits: cdmObject.arraycopyData<string | TraitReference>(this.appliedTraits, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new RelationshipReferenceImpl(null, false);
        copy.relationship = <StringConstant | RelationshipImpl> this.relationship.copy();
        this.copyRef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.relationship ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = " ";
        ff.addChild(this.relationship.getFriendlyFormat());
        this.getFriendlyFormatRef(ff);
        return ff;
    }
    public static createClass(object: any): RelationshipReferenceImpl {
        let relationship = cdmObject.createStringOrImpl<RelationshipImpl>(object.relationshipReference, cdmObjectType.relationshipRef, RelationshipImpl.createClass);
        let c: RelationshipReferenceImpl = new RelationshipReferenceImpl(relationship, object.appliedTraits);
        c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
        return c;
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return this.relationship.getObjectDef<T>();
    }
    public setObjectDef(def :ICdmObjectDef) : ICdmObjectDef {
        this.relationship = def as any;
        return this.relationship.getObjectDef<ICdmObjectDef>();
    }
    public getPathBranch(): string {
        if (this.relationship.getObjectType() != cdmObjectType.stringConstant)
            return "";
        return this.relationship.getPathBranch();
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.relationship)
            if (this.relationship.visit(userData, path, preChildren, postChildren, statusRpt))
                return true;
        if (this.visitRef(userData, path, preChildren, postChildren, statusRpt))
            return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {RelationshipDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class RelationshipImpl extends cdmObjectDef implements ICdmRelationshipDef {
    relationshipName: string;
    extendsRelationship?: StringConstant | RelationshipReferenceImpl;

    constructor(relationshipName: string, extendsRelationship: (StringConstant | RelationshipReferenceImpl), exhibitsTraits: boolean = false) {
        super(exhibitsTraits);
        this.relationshipName = relationshipName;
        if (extendsRelationship)
            this.extendsRelationship = extendsRelationship;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.relationshipDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.relationshipRef;
    }
    public copyData(stringRefs? : boolean): Relationship {
        let castedToInterface: Relationship = {
            explanation: this.explanation,
            relationshipName: this.relationshipName,
            extendsRelationship: this.extendsRelationship ? this.extendsRelationship.copyData(stringRefs) : undefined,
            exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(this.exhibitsTraits, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new RelationshipImpl(this.relationshipName, null, false);
        copy.extendsRelationship = this.extendsRelationship ? <StringConstant | RelationshipReferenceImpl> this.extendsRelationship.copy() : undefined
        this.copyDef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.relationshipName ? true : false;
    }
    
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = " ";
        ff.terminator = ";";
        ff.addChildString("relationship");
        ff.addChildString(this.relationshipName);
        if (this.extendsRelationship) {
            ff.addChildString("extends");
            ff.addChild(this.extendsRelationship.getFriendlyFormat());
        }
        this.getFriendlyFormatDef(ff);
        return ff;
    }
    public static createClass(object: any): RelationshipImpl {
        let extendsRelationship: (StringConstant | RelationshipReferenceImpl);
        extendsRelationship = cdmObject.createRelationshipReference(object.extendsRelationship)
        let c: RelationshipImpl = new RelationshipImpl(object.relationshipName, extendsRelationship, object.exhibitsTraits);
        if (object.explanation)
            c.explanation = object.explanation;
        c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
        return c;
    }
    public getName(): string {
        return this.relationshipName;
    }
    public getExtendsRelationshipRef(): ICdmRelationshipRef {
        return this.extendsRelationship;
    }
    public getPathBranch(): string {
        return this.relationshipName;
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.extendsRelationship)
            if (this.extendsRelationship.visit(userData, path + "/extendsRelationship/", preChildren, postChildren, statusRpt))
                return true;
        if (this.visitDef(userData, path, preChildren, postChildren, statusRpt))
            return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }

    public isDerivedFrom(base: string): boolean {
        return this.isDerivedFromDef(this.getExtendsRelationshipRef(), this.getName(), base);
    }
    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        this.constructResolvedTraitsDef(this.getExtendsRelationshipRef(), rtsb);
        rtsb.cleanUp();
    }

    public constructResolvedAttributes(): ResolvedAttributeSet {
        return null;
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
export class DataTypeReferenceImpl extends cdmObjectRef {
    dataType: StringConstant | DataTypeImpl;

    constructor(dataType: StringConstant | DataTypeImpl, appliedTraits: boolean) {
        super(appliedTraits);
        this.dataType = dataType;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.dataTypeRef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public copyData(stringRefs? : boolean): DataTypeReference {
        let castedToInterface: DataTypeReference = {
            dataTypeReference: this.dataType.copyData(stringRefs),
            appliedTraits: cdmObject.arraycopyData<string | TraitReference>(this.appliedTraits, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new DataTypeReferenceImpl(null, false);
        copy.dataType = <StringConstant | DataTypeImpl> this.dataType.copy();
        this.copyRef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.dataType ? true : false;
    }
    
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = " ";
        ff.addChild(this.dataType.getFriendlyFormat());
        this.getFriendlyFormatRef(ff);
        return ff;
    }
    public static createClass(object: any): DataTypeReferenceImpl {
        let dataType = cdmObject.createStringOrImpl<DataTypeImpl>(object.dataTypeReference, cdmObjectType.dataTypeRef, DataTypeImpl.createClass);
        let c: DataTypeReferenceImpl = new DataTypeReferenceImpl(dataType, object.appliedTraits);
        c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
        return c;
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return this.dataType.getObjectDef<T>();
    }
    public setObjectDef(def :ICdmObjectDef) : ICdmObjectDef {
        this.dataType = def as any;
        return this.dataType.getObjectDef<ICdmObjectDef>();
    }
    public getPathBranch(): string {
        if (this.dataType.getObjectType() != cdmObjectType.stringConstant)
            return "";
        return this.dataType.getPathBranch();
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.dataType)
            if (this.dataType.visit(userData, path, preChildren, postChildren, statusRpt))
                return true;
        if (this.visitRef(userData, path, preChildren, postChildren, statusRpt))
            return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {DataTypeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class DataTypeImpl extends cdmObjectDef implements ICdmDataTypeDef {
    dataTypeName: string;
    extendsDataType?: StringConstant | DataTypeReferenceImpl;

    constructor(dataTypeName: string, extendsDataType: (StringConstant | DataTypeReferenceImpl), exhibitsTraits: boolean = false) {
        super(exhibitsTraits);
        this.dataTypeName = dataTypeName;
        this.extendsDataType = extendsDataType;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.dataTypeDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.dataTypeRef;
    }
    public copyData(stringRefs? : boolean): DataType {
        let castedToInterface: DataType = {
            explanation: this.explanation,
            dataTypeName: this.dataTypeName,
            extendsDataType: this.extendsDataType ? this.extendsDataType.copyData(stringRefs) : undefined,
            exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(this.exhibitsTraits, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new DataTypeImpl(this.dataTypeName, null, false);
        copy.extendsDataType = this.extendsDataType ? <StringConstant | DataTypeReferenceImpl> this.extendsDataType.copy() : undefined
        this.copyDef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.dataTypeName ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = " ";
        ff.terminator = ";";
        ff.addChildString("dataType");
        ff.addChildString(this.dataTypeName);
        if (this.extendsDataType) {
            ff.addChildString("extends");
            ff.addChild(this.extendsDataType.getFriendlyFormat());
        }
        this.getFriendlyFormatDef(ff);
        return ff;
    }
    public static createClass(object: any): DataTypeImpl {
        let extendsDataType: (StringConstant | DataTypeReferenceImpl);
        extendsDataType = cdmObject.createDataTypeReference(object.extendsDataType);

        let c: DataTypeImpl = new DataTypeImpl(object.dataTypeName, extendsDataType, object.exhibitsTraits);

        if (object.explanation)
            c.explanation = object.explanation;

        c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);

        return c;
    }
    public getName(): string {
        return this.dataTypeName;
    }
    public getExtendsDataTypeRef(): ICdmDataTypeRef {
        return this.extendsDataType;
    }
    public getPathBranch(): string {
        return this.dataTypeName;
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.extendsDataType)
            if (this.extendsDataType.visit(userData, path + "/extendsDataType/", preChildren, postChildren, statusRpt))
                return true;
        if (this.visitDef(userData, path, preChildren, postChildren, statusRpt))
            return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }

    public isDerivedFrom(base: string): boolean {
        return this.isDerivedFromDef(this.getExtendsDataTypeRef(), this.getName(), base);
    }
    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        this.constructResolvedTraitsDef(this.getExtendsDataTypeRef(), rtsb);
        rtsb.cleanUp();
    }
    public constructResolvedAttributes(): ResolvedAttributeSet {
        return null;
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
//  {AttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export abstract class AttributeImpl extends cdmObjectDef implements ICdmAttributeDef {
    relationship: (StringConstant | RelationshipReferenceImpl);
    appliedTraits?: (StringConstant | TraitReferenceImpl)[];

    constructor(appliedTraits: boolean = false) {
        super();
        if (appliedTraits)
            this.appliedTraits = new Array<(StringConstant | TraitReferenceImpl)>();
    }

    public copyAtt(copy : AttributeImpl) {
        copy.relationship = this.relationship ? <StringConstant | RelationshipReferenceImpl> this.relationship.copy() : undefined;
        copy.appliedTraits = cdmObject.arrayCopy<StringConstant | TraitReferenceImpl>(this.appliedTraits);
        this.copyDef(copy);
        return copy;
    }
    public setObjectDef(def :ICdmObjectDef) : ICdmObjectDef {
        throw Error("not a ref");
    }
    public getRelationshipRef(): ICdmRelationshipRef {
        return this.relationship;
    }
    public setRelationshipRef(relRef : ICdmRelationshipRef): ICdmRelationshipRef {
        this.relationship = relRef as any;
        return this.relationship;
    }
    public getAppliedTraitRefs(): ICdmTraitRef[] {
        return this.appliedTraits;
    }
    public addAppliedTrait(traitDef : ICdmTraitRef | ICdmTraitDef | string) : ICdmTraitRef {
        if (!traitDef)
            return null;
        this.clearTraitCache();
        if (!this.appliedTraits)
            this.appliedTraits = new Array<(StringConstant | TraitReferenceImpl)>();
        return addTraitRef(this.appliedTraits, traitDef);
    }
    
    public visitAtt(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        if (this.relationship)
            if (this.relationship.visit(userData, pathRoot + "/relationship/", preChildren, postChildren, statusRpt))
                return true;
        if (this.appliedTraits)
            if (cdmObject.visitArray(this.appliedTraits, userData, pathRoot + "/appliedTraits/", preChildren, postChildren, statusRpt))
                return true;
        if (this.visitDef(userData, pathRoot, preChildren, postChildren, statusRpt))
            return true;
        return false;
    }

    public addResolvedTraitsApplied(rtsb : ResolvedTraitSetBuilder) : ResolvedTraitSet  {

        let set = rtsb.set;
        let addAppliedTraits = (ats: ICdmTraitRef[]) => {
            if (ats) {
                let l = ats.length;
                for (let i = 0; i < l; i++) {
                    rtsb.mergeTraits(ats[i].getResolvedTraits(cdmTraitSet.all));
                }
            }
        };

        addAppliedTraits(this.appliedTraits);
        // any applied on use
        return  rtsb.rts;

    }

    public removedTraitDef(def : ICdmTraitDef) {
        this.clearTraitCache();
        let traitName = def.getName();
        if (this.appliedTraits) {
            let iRemove = 0
            for (iRemove = 0; iRemove < this.appliedTraits.length; iRemove++) {
                const tr = this.appliedTraits[iRemove];
                if (tr.getObjectDef().getName() == traitName)
                    break;
            }
            if (iRemove < this.appliedTraits.length) {
                this.appliedTraits.splice(iRemove, 1);
                return;
            }
        }
    }
    abstract getResolvedEntityReferences(): ResolvedEntityReferenceSet;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TypeAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class TypeAttributeImpl extends AttributeImpl implements ICdmTypeAttributeDef  {
    name: string;
    dataType: (StringConstant | DataTypeReferenceImpl);

    constructor(name: string, appliedTraits: boolean = false) {
        super(appliedTraits);
        this.name = name;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.typeAttributeDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public copyData(stringRefs? : boolean): TypeAttribute {
        let castedToInterface: TypeAttribute = {
            explanation: this.explanation,
            name: this.name,
            relationship: this.relationship ? this.relationship.copyData(stringRefs) : undefined,
            dataType: this.dataType ? this.dataType.copyData(stringRefs) : undefined,
            appliedTraits: cdmObject.arraycopyData<string | TraitReference>(this.appliedTraits, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new TypeAttributeImpl(this.name, false);
        copy.dataType = this.dataType ? <StringConstant | DataTypeReferenceImpl> this.dataType.copy() : undefined;
        this.copyAtt(copy);
        return copy;
    }
    public validate(): boolean {
        return this.relationship && this.name && this.dataType ? true : false;
    }
    
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.separator = " ";
        ff.addComment(this.explanation);
        ff.addChild(this.relationship.getFriendlyFormat());
        ff.addChild(this.dataType.getFriendlyFormat());
        ff.addChildString(this.name);
        if (this.appliedTraits && this.appliedTraits.length)  {
            let ffSub = new friendlyFormatNode();
            ffSub.separator = ", ";
            ffSub.starter = "[";
            ffSub.terminator = "]";
            cdmObject.arrayGetFriendlyFormat(ffSub, this.appliedTraits);
            ff.addChild(ffSub);
        }
        return ff;
    }
    public static createClass(object: any): TypeAttributeImpl {

        let c: TypeAttributeImpl = new TypeAttributeImpl(object.name, object.appliedTraits);

        if (object.explanation)
            c.explanation = object.explanation;

        c.relationship = cdmObject.createRelationshipReference(object.relationship);
        c.dataType = cdmObject.createDataTypeReference(object.dataType);
        c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
        return c;
    }
    public isDerivedFrom(base: string): boolean {
        return false;
    }
    public getName(): string {
        return this.name;
    }
    public getDataTypeRef(): ICdmDataTypeRef {
        return this.dataType;
    }
    public setDataTypeRef(dataType : ICdmDataTypeRef): ICdmDataTypeRef {
        this.dataType = dataType as any;
        return this.dataType;
    }
    public getPathBranch(): string {
        return this.name;
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.dataType)
            if (this.dataType.visit(userData, path + "/dataType/", preChildren, postChildren, statusRpt))
                return true;
        if (this.visitAtt(userData, path, preChildren, postChildren, statusRpt))
            return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }

    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        let set = rtsb.set;
        if (set == cdmTraitSet.inheritedOnly || set == cdmTraitSet.elevatedOnly) {
            if (set == cdmTraitSet.inheritedOnly)
                set = cdmTraitSet.all;
            // // get from datatype
            if (this.dataType)
                rtsb.takeReference(this.getDataTypeRef().getResolvedTraits(set));
            // // get from relationship
            if (this.relationship) 
                rtsb.mergeTraits(this.getRelationshipRef().getResolvedTraits(set));
        }

        if (set == cdmTraitSet.appliedOnly || set == cdmTraitSet.elevatedOnly) {
            if (set == cdmTraitSet.appliedOnly)
                set = cdmTraitSet.all;
                this.addResolvedTraitsApplied(rtsb);
        }
        rtsb.cleanUp();
    }

    public constructResolvedAttributes(): ResolvedAttributeSet {
        // find and cache the complete set of attributes
        // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
        // the datatype used as an attribute, traits applied to that datatype,
        // the relationship of the attribute, any traits applied to the attribute.
        let rasb = new ResolvedAttributeSetBuilder();

        // add this attribute to the set
        // make a new one and apply any traits
        let newAtt = new ResolvedAttribute(this);
        rasb.ownOne(newAtt);
        rasb.applyTraits(this.getResolvedTraits(cdmTraitSet.all));

        // from the traits of the datatype, relationship and applied here, see if new attributes get generated
        rasb.mergeTraitAttributes(this.getResolvedTraits(cdmTraitSet.all));
       
        return rasb.ras;
    }
    public getResolvedEntityReferences(): ResolvedEntityReferenceSet {
        return null;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class EntityAttributeImpl extends AttributeImpl implements ICdmEntityAttributeDef{
    relationship: (StringConstant | RelationshipReferenceImpl);
    entity: (StringConstant | EntityReferenceImpl | ((StringConstant | EntityReferenceImpl)[]));
    appliedTraits?: (StringConstant | TraitReferenceImpl)[];

    constructor(appliedTraits: boolean = false) {
        super(appliedTraits);
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.typeAttributeDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public isDerivedFrom(base: string): boolean {
        return false;
    }
    public copyData(stringRefs? : boolean): EntityAttribute {
        let entity: (string | EntityReference | ((string | EntityReference)[]));
        if (this.entity instanceof Array)
            entity = cdmObject.arraycopyData<(string | EntityReference)>(this.entity, stringRefs);
        else
            entity = this.entity ? this.entity.copyData(stringRefs) : undefined;

        let castedToInterface: EntityAttribute = {
            explanation: this.explanation,
            relationship: this.relationship ? this.relationship.copyData(stringRefs) : undefined,
            entity: entity,
            appliedTraits: cdmObject.arraycopyData<string | TraitReference>(this.appliedTraits, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new EntityAttributeImpl(false);
        if (this.entity instanceof Array)
            copy.entity = cdmObject.arrayCopy<StringConstant | EntityReferenceImpl>(this.entity);
        else
            copy.entity = <StringConstant | EntityReferenceImpl> this.entity.copy();
        this.copyAtt(copy);
        return copy;
    }
    public validate(): boolean {
        return this.relationship && this.entity ? true : false;
    }
    
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.separator = " ";
        ff.addComment(this.explanation);
        ff.addChild(this.relationship.getFriendlyFormat());
        if (this.entity instanceof Array) {
            let ffSub = new friendlyFormatNode();
            ffSub.separator = ", ";
            ffSub.starter = "{";
            ffSub.terminator = "}";
            ffSub.verticalMode = true;
            cdmObject.arrayGetFriendlyFormat(ffSub, this.entity);
            ff.addChild(ffSub);
        }
        else {
            ff.addChild(this.entity.getFriendlyFormat());
        }
        
        if (this.appliedTraits && this.appliedTraits.length)  {
            let ffSub = new friendlyFormatNode();
            ffSub.separator = ", ";
            ffSub.starter = "[";
            ffSub.terminator = "]";
            cdmObject.arrayGetFriendlyFormat(ff, this.appliedTraits);
            ff.addChild(ffSub);
        }
        return ff;
    }

    public static createClass(object: any): EntityAttributeImpl {

        let c: EntityAttributeImpl = new EntityAttributeImpl(object.appliedTraits);

        if (object.explanation)
            c.explanation = object.explanation;

        if (typeof object.entity === "string")
            c.entity = new StringConstant(cdmObjectType.entityRef, object.entity);
        else {
            if (object.entity instanceof Array) {
                c.entity = new Array<StringConstant | EntityReferenceImpl>();
                object.entity.forEach(e => {
                    (c.entity as Array<StringConstant | EntityReferenceImpl>).push(cdmObject.createEntityReference(e));
                });
            }
            else {
                c.entity = EntityReferenceImpl.createClass(object.entity);
            }
        }

        c.relationship = object.relationship ? cdmObject.createRelationshipReference(object.relationship) : undefined
        c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
        return c;
    }
    public getName(): string {
        return "(unspecified)";
    }
    public getEntityRefIsArray(): boolean {
        return this.entity instanceof Array;
    }
    public getEntityRef(): (ICdmEntityRef | (ICdmEntityRef[])) {
        return this.entity;
    }
    public setEntityRef(entRef : (ICdmEntityRef | (ICdmEntityRef[]))): (ICdmEntityRef | (ICdmEntityRef[])) {
        this.entity = entRef as any;
        return this.entity;
    }

    public getPathBranch(): string {
        return "(unspecified)";
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.entity instanceof Array) {
            if (cdmObject.visitArray(this.entity, userData, path + "/entity/", preChildren, postChildren, statusRpt))
                return true;
        }
        else {
            if (this.entity)
                if (this.entity.visit(userData, path + "/entity/", preChildren, postChildren, statusRpt))
                    return true;
        }
        if (this.visitAtt(userData, path, preChildren, postChildren, statusRpt))
            return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }

    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        let set = rtsb.set;
        
        if (set == cdmTraitSet.inheritedOnly || set == cdmTraitSet.elevatedOnly) {
            if (set == cdmTraitSet.inheritedOnly)
                set = cdmTraitSet.all;
            // // get from relationship
            if (this.relationship) 
                rtsb.takeReference(this.getRelationshipRef().getResolvedTraits(set));
        }

        if (set == cdmTraitSet.elevatedOnly) {
            // get from entities unless this is a ref
            let relRts = this.getRelationshipRef().getResolvedTraits(cdmTraitSet.all);
            if (!relRts || !relRts.find("does.referenceEntity")) {
                if (this.getEntityRefIsArray()) {
                    (this.entity as ICdmEntityRef[]).forEach(er => {
                        rtsb.mergeTraits(er.getResolvedTraits(cdmTraitSet.elevatedOnly));
                    });
                }
                else 
                    rtsb.mergeTraits((this.entity as ICdmEntityRef).getResolvedTraits(cdmTraitSet.elevatedOnly));
            }
        }

        if (set == cdmTraitSet.appliedOnly || set == cdmTraitSet.elevatedOnly) {
            if (set == cdmTraitSet.appliedOnly)
                set = cdmTraitSet.all;
            this.addResolvedTraitsApplied(rtsb);
        }
        rtsb.cleanUp();
    }

    public constructResolvedAttributes(): ResolvedAttributeSet {
        // find and cache the complete set of attributes
        // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
        // the entity used as an attribute, traits applied to that entity,
        // the relationship of the attribute, any traits applied to the attribute.
        let rasb = new ResolvedAttributeSetBuilder();

        // complete cheating but is faster. this relationship will remove all of the attributes that get collected here, so dumb and slow to go get them
        let relRts = this.getRelationshipRef().getResolvedTraits(cdmTraitSet.all);
        if (!relRts || !relRts.find("does.referenceEntity")) {
            if (this.getEntityRefIsArray()) {
                (this.entity as ICdmEntityRef[]).forEach(er => {
                    rasb.mergeAttributes(er.getResolvedAttributes());
                });
            }
            else {
                rasb.mergeAttributes((this.entity as ICdmEntityRef).getResolvedAttributes());
            }
        }
        rasb.applyTraits(this.getResolvedTraits(cdmTraitSet.all));

        // from the traits of relationship and applied here, see if new attributes get generated
        rasb.mergeTraitAttributes(this.getResolvedTraits(cdmTraitSet.all));

        return rasb.ras;
    }
    public getResolvedEntityReferences(): ResolvedEntityReferenceSet {
        let relRts = this.getRelationshipRef().getResolvedTraits(cdmTraitSet.all);
        if (relRts && relRts.find("does.referenceEntity")) {
            // only place this is used, so logic here instead of encapsulated. 
            // make a set and the one ref it will hold
            let rers = new ResolvedEntityReferenceSet();
            let rer = new ResolvedEntityReference();
            // referencing attribute(s) come from this attribute
            rer.referencing.rasb.mergeAttributes(this.getResolvedAttributes());
            let resolveSide = (entRef : ICdmEntityRef) : ResolvedEntityReferenceSide => {
                let sideOther = new ResolvedEntityReferenceSide();
                if (entRef) {
                    // reference to the other entity, hard part is the attribue name.
                    // by convention, this is held in a trait that identifies the key
                    sideOther.entity = entRef.getObjectDef();
                    let otherAttribute : ICdmAttributeDef;
                    let t : ResolvedTrait = entRef.getResolvedTraits().find("is.identifiedBy");
                    if (t && t.parameterValues && t.parameterValues.length) {
                        let otherRef = (t.parameterValues.getParameterValue("attribute").value); 
                        if (otherRef) {
                            otherAttribute = otherRef.getObjectDef() as ICdmAttributeDef; 
                            if (otherAttribute) {
                                if (!otherAttribute.getName)
                                    otherAttribute.getName();
                                sideOther.rasb.ownOne(sideOther.entity.getResolvedAttributes().get(otherAttribute.getName())); 
                            }
                        }
                    }
                }

                return sideOther;
            };
       
            // either several or one entity
            if (this.getEntityRefIsArray()) {
                (this.entity as ICdmEntityRef[]).forEach(er => {
                    rer.referenced.push(resolveSide(er));
                });
            }
            else {
                rer.referenced.push(resolveSide(this.entity as ICdmEntityRef));
            }
            rers.set.push(rer);
            return rers;
        }            
        return null;
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
export class AttributeGroupReferenceImpl extends cdmObjectRef implements ICdmAttributeGroupRef {
    attributeGroup: StringConstant | AttributeGroupImpl;
    constructor(attributeGroup: StringConstant | AttributeGroupImpl) {
        super(false);
        this.attributeGroup = attributeGroup;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.attributeGroupRef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public copyData(stringRefs? : boolean): AttributeGroupReference {
        let castedToInterface: AttributeGroupReference = {
            attributeGroupReference: this.attributeGroup.copyData(stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new AttributeGroupReferenceImpl(null);
        copy.attributeGroup = <StringConstant | AttributeGroupImpl> this.attributeGroup.copy();
        this.copyRef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.attributeGroup ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = " ";
        ff.addChild(this.attributeGroup.getFriendlyFormat());
        this.getFriendlyFormatRef(ff);
        return ff;
    }
    public static createClass(object: any): AttributeGroupReferenceImpl {
        let attributeGroup = cdmObject.createStringOrImpl<AttributeGroupImpl>(object.attributeGroupReference, cdmObjectType.attributeGroupRef, AttributeGroupImpl.createClass);
        let c: AttributeGroupReferenceImpl = new AttributeGroupReferenceImpl(attributeGroup);
        return c;
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return this.attributeGroup.getObjectDef<T>();
    }
    public setObjectDef(def :ICdmObjectDef) : ICdmObjectDef {
        this.attributeGroup = def as any;
        return this.attributeGroup.getObjectDef<ICdmObjectDef>();
    }
    public getAppliedTraitRefs(): ICdmTraitRef[] {
        return null;
    }
    public getPathBranch(): string {
        if (this.attributeGroup.getObjectType() != cdmObjectType.stringConstant)
            return "";
        return this.attributeGroup.getPathBranch();
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.attributeGroup)
            if (this.attributeGroup.visit(userData, path, preChildren, postChildren, statusRpt))
                return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
    public getResolvedEntityReferences(): ResolvedEntityReferenceSet {
        if (this.attributeGroup)
            return this.attributeGroup.getResolvedEntityReferences();
        return null;
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeGroupDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class AttributeGroupImpl extends cdmObjectDef implements ICdmAttributeGroupDef {
    attributeGroupName: string;
    members: (StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[];

    constructor(attributeGroupName: string) {
        super();
        this.attributeGroupName = attributeGroupName;
        this.members = new Array<StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>();
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.attributeGroupDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.attributeGroupRef;
    }
    public isDerivedFrom(base: string): boolean {
        return false;
    }
    public copyData(stringRefs? : boolean): AttributeGroup {
        let castedToInterface: AttributeGroup = {
            explanation: this.explanation,
            attributeGroupName: this.attributeGroupName,
            exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(this.exhibitsTraits, stringRefs),
            members: cdmObject.arraycopyData<string | AttributeGroupReference | TypeAttribute | EntityAttribute>(this.members, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new AttributeGroupImpl(this.attributeGroupName);
        copy.members = cdmObject.arrayCopy<StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>(this.members);
        this.copyDef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.attributeGroupName ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.separator = " ";
        ff.addChildString("attributeGroup");
        ff.addChildString(this.attributeGroupName);
        this.getFriendlyFormatDef(ff);
        ff.addChildString("members");
        let ffSub = new friendlyFormatNode();
        ffSub.verticalMode = true;
        ffSub.bracketEmpty = true;
        ffSub.indentChildren = true;
        ffSub.separator = ";";
        ffSub.starter = "{";
        ffSub.terminator = "}";
        cdmObject.arrayGetFriendlyFormat(ffSub, this.members);
        ff.addChild(ffSub);
        return ff;
    }
    public static createClass(object: any): AttributeGroupImpl {

        let c: AttributeGroupImpl = new AttributeGroupImpl(object.attributeGroupName);

        if (object.explanation)
            c.explanation = object.explanation;

        c.members = cdmObject.createAttributeArray(object.members);
        c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);

        return c;
    }
    public getName(): string {
        return this.attributeGroupName;
    }
    public getMembersAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[] {
        return this.members;
    }
    public addMemberAttributeDef(attDef : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef) : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef {
        if (!this.members)
            this.members = new Array<(StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)>();
        this.members.push(attDef as any);
        return attDef;
    } 
    public getPathBranch(): string {
        return this.attributeGroupName;;
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.members)
            if (cdmObject.visitArray(this.members, userData, path + "/members/", preChildren, postChildren, statusRpt))
                return true;
        if (this.visitDef(userData, path, preChildren, postChildren, statusRpt))
            return true;
                    
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
    public constructResolvedAttributes(): ResolvedAttributeSet {
        let rasb = new ResolvedAttributeSetBuilder();
        
        if (this.members) {
            let l = this.members.length;
            for (let i = 0; i < l; i++) {
                rasb.mergeAttributes(this.members[i].getResolvedAttributes());
            }
        }
                
        // things that need to go away
        rasb.removeRequestedAtts();
        return rasb.ras;
    }
    public getResolvedEntityReferences(): ResolvedEntityReferenceSet {
        let rers = new ResolvedEntityReferenceSet();
        if (this.members) {
            let l = this.members.length;
            for (let i = 0; i < l; i++) {
                rers.add(this.members[i].getResolvedEntityReferences());
            }
        }
        return rers;
    }

    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        let set = rtsb.set;
        
        if (set != cdmTraitSet.appliedOnly) {
            if (set == cdmTraitSet.inheritedOnly)
                set = cdmTraitSet.all;
            this.constructResolvedTraitsDef(undefined, rtsb);
            if (set == cdmTraitSet.elevatedOnly) {
                if (this.members) {
                    let l = this.members.length;
                    for (let i = 0; i < l; i++) {
                        let att = this.members[i];
                        let attOt = att.getObjectType();
                        rtsb.mergeTraits(att.getResolvedTraits(cdmTraitSet.elevatedOnly), (attOt == cdmObjectType.entityAttributeDef || attOt == cdmObjectType.typeAttributeDef) ? att as ICdmAttributeDef : null);
                    }
                }
            }

        }
        rtsb.cleanUp();
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  the 'constant' entity
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
export class ConstantEntityImpl extends cdmObjectDef implements ICdmConstantEntityDef {
    constantEntityName: string;
    entityShape: StringConstant | EntityReferenceImpl;
    constantValues: string[][];

    public copyData(stringRefs? : boolean): ConstantEntity {
        let castedToInterface: ConstantEntity = {
            explanation: this.explanation,
            constantEntityName: this.constantEntityName,
            entityShape: this.entityShape ? this.entityShape.copyData(stringRefs) : undefined,
            constantValues: this.constantValues
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new ConstantEntityImpl();
        copy.constantEntityName = this.constantEntityName;
        copy.entityShape = <StringConstant | EntityReferenceImpl> this.entityShape.copy();
        copy.constantValues= this.constantValues; // is a deep copy needed? 
        this.copyDef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.entityShape ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.separator = " ";
        ff.addChildString("constant entity");
        ff.addChildString(this.constantEntityName);
        ff.addChildString("shaped like");
        ff.addChild(this.entityShape.getFriendlyFormat());
        ff.addChildString("contains");

        let ffTable = new friendlyFormatNode();
        ff.addChild(ffTable);
        ffTable.verticalMode = this.constantValues.length > 1;
        ffTable.bracketEmpty = true;
        ffTable.starter = "{";
        ffTable.terminator= "}";
        ffTable.separator= ",";
        for (let iRow = 0; iRow < this.constantValues.length; iRow++) {
            let ffRow = new friendlyFormatNode();
            ffRow.bracketEmpty = false;
            ffRow.starter = "{";
            ffRow.terminator= "}";
            ffRow.separator= ", ";
            const rowArray = this.constantValues[iRow];
            for (let iCol = 0; iCol < rowArray.length; iCol++) {
                ffRow.addChildString(rowArray[iCol], true);
            }
            ffTable.addChild(ffRow);
        }
        return ff;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.constantEntityDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.entityRef;
    }
    public isDerivedFrom(base: string): boolean {
        return false;
    }
    public static createClass(object: any): ConstantEntityImpl {

        let c: ConstantEntityImpl = new ConstantEntityImpl();
        if (object.explanation)
            c.explanation = object.explanation;
        if (object.constantEntityName)
            c.constantEntityName = object.constantEntityName;
        c.constantValues = object.constantValues;

        c.entityShape = cdmObject.createStringOrImpl<EntityReferenceImpl>(object.entityShape, cdmObjectType.entityRef, EntityReferenceImpl.createClass);

        return c;
    }
    public getName(): string {
        return this.constantEntityName;
    }
    public getEntityShape(): ICdmEntityDef | ICdmEntityRef {
        return this.entityShape;
    }
    public setEntityShape(shape : (ICdmEntityDef | ICdmEntityRef)) : (ICdmEntityDef | ICdmEntityRef) {
        this.entityShape = <any> shape;
        return this.entityShape;
    }
    
    public getConstantValues(): string[][] {
        return this.constantValues;
    }
    public setConstantValues(values : string[][]): string[][] {
        this.constantValues = values;
        return this.constantValues;
    }
    public getPathBranch(): string {
        if (this.constantEntityName)
            return this.constantEntityName;
        else
            return "(unspecified)";
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();

        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.entityShape)
            if (this.entityShape.visit(userData, path + "/entityShape/", preChildren, postChildren, statusRpt))
                return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        return null;
    }

    public constructResolvedAttributes(): ResolvedAttributeSet {
        let rasb = new ResolvedAttributeSetBuilder();
        if (this.entityShape)
            rasb.mergeAttributes(this.getEntityShape().getResolvedAttributes());

            // things that need to go away
        rasb.removeRequestedAtts();
        return rasb.ras;
    }

    // the world's smallest complete query processor...
    public lookupWhere(attReturn : string, attSearch : string, valueSearch: string) : string {
        // metadata library
        let ras = this.getResolvedAttributes();
        // query validation and binding
        let resultAtt = -1;
        let searchAtt = -1;
        let l = ras.set.length;
        for (let i = 0; i < l; i++) {
            let name = ras.set[i].resolvedName;
            if (name === attReturn)
                resultAtt=i;
            if (name === attSearch)
                searchAtt =i; 
            if (resultAtt >= 0 && searchAtt >= 0)
                break;
        }        
        // rowset processing
        if (resultAtt >= 0 && searchAtt >= 0) {
            if (this.constantValues && this.constantValues.length) {
                for (let i=0; i< this.constantValues.length; i++) {
                    if (this.constantValues[i][searchAtt] == valueSearch)
                        return this.constantValues[i][resultAtt];
                }
            }
        }
        return undefined;
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
//  {EntityRef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class EntityReferenceImpl extends cdmObjectRef implements ICdmObjectRef {
    entity: StringConstant | EntityImpl | ConstantEntityImpl;

    constructor(entityRef: StringConstant | EntityImpl | ConstantEntityImpl, appliedTraits: boolean) {
        super(appliedTraits);
        this.entity = entityRef;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.entityRef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public copyData(stringRefs? : boolean): EntityReference {
        let castedToInterface: EntityReference = {
            entityReference: this.entity.copyData(stringRefs),
            appliedTraits: cdmObject.arraycopyData<string | TraitReference>(this.appliedTraits, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new EntityReferenceImpl(null, false);
        copy.entity = <StringConstant | EntityImpl | ConstantEntityImpl> this.entity.copy();
        this.copyRef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.entity ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = false;
        ff.separator = " ";
        ff.addChild(this.entity.getFriendlyFormat());
        this.getFriendlyFormatRef(ff);
        return ff;
    }
    public static createClass(object: any): EntityReferenceImpl {

        let entity: StringConstant | EntityImpl | ConstantEntityImpl;
        if (object.entityReference.entityShape)
            entity = ConstantEntityImpl.createClass(object.entityReference);
        else
            entity = cdmObject.createStringOrImpl<EntityImpl>(object.entityReference, cdmObjectType.constantEntityRef, EntityImpl.createClass);

        let c: EntityReferenceImpl = new EntityReferenceImpl(entity, object.appliedTraits);
        c.appliedTraits = cdmObject.createTraitReferenceArray(object.appliedTraits);
        return c;
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return this.entity.getObjectDef<T>();
    }
    public setObjectDef(def :ICdmObjectDef) : ICdmObjectDef {
        this.entity = def as any;
        return this.entity.getObjectDef<ICdmObjectDef>();
    }
    public getPathBranch(): string {
        if (this.entity.getObjectType() != cdmObjectType.stringConstant)
            return "";
        return this.entity.getPathBranch();
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.entity)
            if (this.entity.visit(userData, path, preChildren, postChildren, statusRpt))
                return true;
        if (this.visitRef(userData, path, preChildren, postChildren, statusRpt))
            return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class EntityImpl extends cdmObjectDef implements ICdmEntityDef {
    entityName: string;
    extendsEntity?: StringConstant | EntityReferenceImpl;
    hasAttributes?: (StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[];
    entityRefSet : ResolvedEntityReferenceSet;
    rasb : ResolvedAttributeSetBuilder;

    constructor(entityName: string, extendsEntity: (StringConstant | EntityReferenceImpl), exhibitsTraits: boolean = false, hasAttributes: boolean = false) {
        super(exhibitsTraits);
        this.entityName = entityName;
        if (extendsEntity)
            this.extendsEntity = extendsEntity;
        if (hasAttributes)
            this.hasAttributes = new Array<(StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)>();
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.entityDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.entityRef;
    }
    public copyData(stringRefs? : boolean): Entity {
        let castedToInterface: Entity = {
            explanation: this.explanation,
            entityName: this.entityName,
            extendsEntity: this.extendsEntity ? this.extendsEntity.copyData(stringRefs) : undefined,
            exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(this.exhibitsTraits, stringRefs),
            hasAttributes: cdmObject.arraycopyData<string | AttributeGroupReference | TypeAttribute | EntityAttribute>(this.hasAttributes, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let copy = new EntityImpl(this.entityName, null, false, false);
        copy.extendsEntity = copy.extendsEntity ? <StringConstant | EntityReferenceImpl> this.extendsEntity.copy() : undefined;
        copy.hasAttributes = cdmObject.arrayCopy<StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>(this.hasAttributes); 
        this.copyDef(copy);
        return copy;
    }
    public validate(): boolean {
        return this.entityName ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
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
        ff.addChildString("hasAttributes");
        let ffSub = new friendlyFormatNode();
        ffSub.verticalMode = true;
        ffSub.bracketEmpty = true;
        ffSub.indentChildren = true;
        ffSub.separator = ";";
        ffSub.starter = "{";
        ffSub.terminator = "}";
        cdmObject.arrayGetFriendlyFormat(ffSub, this.hasAttributes);
        ff.addChild(ffSub);
        return ff;
    }
    public static createClass(object: any): EntityImpl {

        let extendsEntity: (StringConstant | EntityReferenceImpl);
        if (object.extendsEntity) {
            if (typeof object.extendsEntity === "string")
                extendsEntity = new StringConstant(cdmObjectType.entityRef, object.extendsEntity);
            else
                extendsEntity = EntityReferenceImpl.createClass(object.extendsEntity);
        }

        let c: EntityImpl = new EntityImpl(object.entityName, extendsEntity, object.exhibitsTraits, object.hasAttributes);

        if (object.explanation)
            c.explanation = object.explanation;

        c.exhibitsTraits = cdmObject.createTraitReferenceArray(object.exhibitsTraits);
        c.hasAttributes = cdmObject.createAttributeArray(object.hasAttributes);
        return c;
    }
    public getName(): string {
        return this.entityName;
    }
    public getExtendsEntityRef(): ICdmObjectRef {
        return this.extendsEntity;
    }
    public setExtendsEntityRef(ref : ICdmObjectRef) : ICdmObjectRef {
        this.extendsEntity = ref as (StringConstant | EntityReferenceImpl);
        return this.extendsEntity;
    }
    public getHasAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[] {
        return this.hasAttributes;
    }
    public addAttributeDef(attDef : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef) : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef {
        if (!this.hasAttributes)
            this.hasAttributes = new Array<(StringConstant | AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)>();
        this.hasAttributes.push(attDef as any);
        return attDef;
    }    
    public getPathBranch(): string {
        return this.entityName;
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        let path: string = pathRoot + this.getPathBranch();
        if (preChildren && preChildren(userData, this, path, statusRpt))
            return false;
        if (this.extendsEntity)
            if (this.extendsEntity.visit(userData, path + "/extendsEntity/", preChildren, postChildren, statusRpt))
                return true;
        if (this.visitDef(userData, path, preChildren, postChildren, statusRpt))
            return true;
        if (this.hasAttributes)
            if (cdmObject.visitArray(this.hasAttributes, userData, path + "/hasAttributes/", preChildren, postChildren, statusRpt))
                return true;
        if (postChildren && postChildren(userData, this, path, statusRpt))
            return true;
        return false;
    }
    public isDerivedFrom(base: string): boolean {
        return this.isDerivedFromDef(this.getExtendsEntityRef(), this.getName(), base);
    }

    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        let set=rtsb.set;
        
        if (set != cdmTraitSet.appliedOnly) {
            if (set == cdmTraitSet.inheritedOnly)
                set = cdmTraitSet.all;
            this.constructResolvedTraitsDef(this.getExtendsEntityRef(), rtsb);

            if (set == cdmTraitSet.elevatedOnly) {
                if (this.hasAttributes) {
                    let l = this.hasAttributes.length;
                    for (let i = 0; i < l; i++) {
                        let att = this.hasAttributes[i];
                        let attOt = att.getObjectType();
                        rtsb.mergeTraits(att.getResolvedTraits(cdmTraitSet.elevatedOnly), (attOt == cdmObjectType.entityAttributeDef || attOt == cdmObjectType.typeAttributeDef) ? att as ICdmAttributeDef : null);
                    }
                }
            }

        }
        rtsb.cleanUp();
    }

    attributePromises : Map<string, attributePromise>;

    public getAttributePromise(forAtt : string) : attributePromise {
        if (!this.attributePromises)
            this.attributePromises = new Map<string, attributePromise>();
        if (!this.attributePromises.has(forAtt))
            this.attributePromises.set(forAtt, new attributePromise(forAtt));
        return this.attributePromises.get(forAtt);
    }

    public constructResolvedAttributes(): ResolvedAttributeSet {
        // find and cache the complete set of attributes
        // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
        // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
        // the relationsip of the attribute, the attribute definition itself and included attribute groups, any traits applied to the attribute.
        this.rasb = new ResolvedAttributeSetBuilder();
        if (this.extendsEntity) 
            this.rasb.mergeAttributes(this.getExtendsEntityRef().getResolvedAttributes());
        this.rasb.markInherited();

        if (this.hasAttributes) {
            let l = this.hasAttributes.length;
            for (let i = 0; i < l; i++) {
                this.rasb.mergeAttributes(this.hasAttributes[i].getResolvedAttributes());
            }
        }

        // things that need to go away
        this.rasb.removeRequestedAtts();

        // promises to keep?
        if (this.attributePromises) {
            this.attributePromises.forEach((v,k) => {
                let ra = this.rasb.ras.get(v.requestedName);
                if (ra)
                    v.resolvedAtt = ra.attribute;
                else
                    throw new Error("couldn't resolve the attribute promise for " + v.requestedName);
            });
        }

        return this.rasb.ras;
    }

    public countInheritedAttributes() : number {
        // ensures that cache exits
        this.getResolvedAttributes();
        return this.rasb.inheritedMark;
    }


    public getResolvedEntityReferences(): ResolvedEntityReferenceSet {
        if (!this.entityRefSet) {
            this.entityRefSet = new ResolvedEntityReferenceSet();
            // get from any base class and then 'fix' those to point here instead.
            if (this.getExtendsEntityRef()) {
                let inherited = this.getExtendsEntityRef().getObjectDef<ICdmEntityDef>().getResolvedEntityReferences();
                if (inherited) {
                    inherited.set.forEach((res)=>{
                        res = res.copy();
                        res.referencing.entity = this;
                    });
                    this.entityRefSet.add(inherited);
                }
            }
            if (this.hasAttributes) {
                let l = this.hasAttributes.length;
                for (let i = 0; i < l; i++) {
                    // if any refs come back from attributes, they don't know who we are, so they don't set the entity
                    let sub = this.hasAttributes[i].getResolvedEntityReferences();
                    if (sub) {
                        sub.set.forEach((res)=>{
                            res.referencing.entity = this;
                        });

                    }
                    this.entityRefSet.add(sub);
                }
            }

        }
        return this.entityRefSet;
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
export class Document extends cdmObject implements ICdmDocumentDef {
    name: string;
    path: string;
    schema: string;
    schemaVersion: string;
    imports: ImportImpl[];
    definitions: (TraitImpl | DataTypeImpl | RelationshipImpl | AttributeGroupImpl | EntityImpl | ConstantEntityImpl)[];
    declarations: Map<string, cdmObjectDef>;
    monikeredImports: Map<string, Document>;
    flatImports: Array<Document>;

    constructor(name: string, hasImports: boolean = false) {
        super();
        this.name = name;
        this.schemaVersion = "0.6.0";
        
        this.definitions = new Array<TraitImpl | DataTypeImpl | RelationshipImpl | AttributeGroupImpl | EntityImpl | ConstantEntityImpl>();
        if (hasImports)
            this.imports = new Array<ImportImpl>();
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.documentDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return null;
    }
    public copyData(stringRefs? : boolean): DocumentContent {
        let castedToInterface: DocumentContent = {
            schema: this.schema,
            schemaVersion: this.schemaVersion,
            imports: cdmObject.arraycopyData<Import>(this.imports, stringRefs),
            definitions: cdmObject.arraycopyData<Trait | DataType | Relationship | AttributeGroup | Entity | ConstantEntity>(this.definitions, stringRefs)
        };
        return castedToInterface;
    }
    public copy() : ICdmObject {
        let c = new Document(this.name, (this.imports && this.imports.length > 0));
        c.path = this.path;
        c.schema = this.schema;
        c.schemaVersion = this.schemaVersion;
        c.definitions = cdmObject.arrayCopy<TraitImpl | DataTypeImpl | RelationshipImpl | AttributeGroupImpl | EntityImpl | ConstantEntityImpl>(this.definitions); 
        c.imports = cdmObject.arrayCopy<ImportImpl>(this.imports);
        return c;
    }
    public validate(): boolean {
        return this.name ? true : false;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        let ff = new friendlyFormatNode();
        ff.verticalMode = true;
        ff.indentChildren = false;
        cdmObject.arrayGetFriendlyFormat(ff, this.imports);
        cdmObject.arrayGetFriendlyFormat(ff, this.definitions);
        return ff;
    }

    public constructResolvedAttributes(): ResolvedAttributeSet {
        return null;
    }
    public constructResolvedTraits(rtsb : ResolvedTraitSetBuilder) { 
        return null;
    }

    public static createClass(name: string, path: string, object: any): Document {

        let doc: Document = new Document(name, object.imports);
        doc.path = path;

        if (object.$schema)
            doc.schema = object.$schema;
        if (object.jsonSchemaSemanticVersion)
            doc.schemaVersion = object.jsonSchemaSemanticVersion;
        if (object.imports) {
            let l = object.imports.length;
            for (let i = 0; i < l; i++) {
                doc.imports.push(ImportImpl.createClass(object.imports[i]));
            }
        }
        if (object.definitions) {
            let l = object.definitions.length;
            for (let i = 0; i < l; i++) {
                const d = object.definitions[i];
                if (d.dataTypeName)
                    doc.definitions.push(DataTypeImpl.createClass(d));
                else if (d.relationshipName)
                    doc.definitions.push(RelationshipImpl.createClass(d));
                else if (d.attributeGroupName)
                    doc.definitions.push(AttributeGroupImpl.createClass(d));
                else if (d.traitName)
                    doc.definitions.push(TraitImpl.createClass(d));
                else if (d.entityShape)
                    doc.definitions.push(ConstantEntityImpl.createClass(d));
                else if (d.entityName)
                    doc.definitions.push(EntityImpl.createClass(d));
            }
        }
        return doc;
    }

    public addImport(uri : string, moniker : string) : void {
        if (!this.imports)
            this.imports = new Array<ImportImpl>();
        this.imports.push(new ImportImpl(uri, moniker))
    }
    public getImports() : ICdmImport[] {
        return this.imports;
    }

    public addDefinition<T>(ofType : cdmObjectType, name : string) : T {
        let newObj : any = Corpus.MakeObject(ofType, name);
        if (newObj != null)
            this.definitions.push(newObj);
        return newObj;
    }
    
    public getSchema(): string {
        return this.schema;
    }
    public getName() : string {
        return this.name;
    }
    public getSchemaVersion(): string {
        return this.schemaVersion;
    }
    public getDefinitions(): (ICdmTraitDef | ICdmDataTypeDef | ICdmRelationshipDef | ICdmAttributeGroupDef | ICdmEntityDef | ICdmConstantEntityDef)[] {
        return this.definitions;
    }

    public getPathBranch(): string {
        return "";
    }
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        if (preChildren && preChildren(userData, this, pathRoot, statusRpt))
            return false;
        if (this.definitions)
            if (cdmObject.visitArray(this.definitions, userData, pathRoot, preChildren, postChildren, statusRpt))
                return true;
        if (postChildren && postChildren(userData, this, pathRoot, statusRpt))
            return true;
        return false;
    }

    public indexImports(directory : Map<Document, Folder>) {
        // put the imports that have documents assigned into either the flat list or the named lookup
        if (this.imports) {
            this.flatImports = new Array<Document>();
            this.monikeredImports = new Map<string, Document>();
            // where are we?
            let folder = directory.get(this);

            let l = this.imports.length;
            for (let i = 0; i < l; i++) {
                const imp = this.imports[i];
                if (imp.doc) {
                    // swap with local? if previoulsy made a local copy, use that
                    let docLocal = imp.doc;
                    if (folder && folder.localizedImports.has(docLocal))
                        docLocal = folder.localizedImports.get(docLocal);

                    if (imp.moniker && imp.moniker.length > 0) {
                        if (!this.monikeredImports.has(imp.moniker))
                            this.monikeredImports.set(imp.moniker, docLocal);
                    }
                    else {
                        this.flatImports.push(docLocal);
                    }
                }
            }
        }
    }

    public getObjectFromDocumentPath(objectPath : string) : ICdmObject {

        // in current document?
        if (this.declarations.has(objectPath))
            return this.declarations.get(objectPath);
        return null;
    }


    public resolveString(str: StringConstant, avoid: Set<string>, reportPath: string, status: RptCallback): cdmObjectDef {
        // all of the work of resolving references happens here at the leaf strings

        // if tracking the path for loops, then add us here unless there is already trouble?
        let docPath: string = this.path + this.name;
        // never come back into this document
        if (avoid.has(docPath))
            return null;
        avoid.add(docPath);


        let documentSeeker = (doc: Document): cdmObjectDef => {

            // see if there is a prefix that might match one of the imports
            let preEnd = str.constantValue.indexOf('/');
            if (preEnd == 0) {
                // absolute refererence
                status(cdmStatusLevel.error, "no support for absolute references yet. fix '" + str.constantValue + "'", reportPath);
                return null;
            }
            else if (preEnd > 0) {
                let prefix: string = str.constantValue.slice(0, preEnd);
                if (doc.monikeredImports && doc.monikeredImports.has(prefix)) {
                    let newRef: StringConstant = new StringConstant(str.expectedType, str.constantValue.slice(preEnd + 1));
                    return doc.monikeredImports.get(prefix).resolveString(newRef, avoid, reportPath, status);
                }
            }
            // in current document?
            if (doc.declarations.has(str.constantValue))
                return doc.declarations.get(str.constantValue);

            // let wild = str.constantValue.indexOf('*');
            // if (wild >= 0) {
            //     let srch = str.constantValue.replace(/\//g, "\\/").replace(/\*/g, "[\\S]*");
            //     let exp = new RegExp(srch, "g");
            //     let itr = doc.declarations.keys();
            //     let cur : IteratorResult<string> = itr.next();
            //     while(!cur.done) {
            //         if (cur.value.search(exp) == 0)
            //             return doc.declarations.get(cur.value);
            //         cur = itr.next();
            //     }
            // }
            // too dangerous. can match wrong things

            // look through the flat list of imports
            if (doc.flatImports) {
                let seek: cdmObjectDef;
                // do this from bottom up so that the last imported declaration for a duplicate name is found first
                let imps = doc.flatImports.length;
                for (let imp = imps - 1; imp >= 0; imp --) {
                    let impDoc = doc.flatImports[imp];
                    seek = impDoc.resolveString(str, avoid, reportPath, status);
                    if (seek) {
                        // add this to the current document's declarations as a cache
                        doc.declarations.set(str.constantValue, seek);
                        return seek;
                    }
                }
            }
            return null;
        }

        let found = documentSeeker(this);

        // found something, is it the right type?
        if (found) {
            switch (str.expectedType) {
                case cdmObjectType.cdmObject:
                    break;
                case cdmObjectType.attributeGroupRef:
                    if (!(found instanceof AttributeGroupImpl)) {
                        status(cdmStatusLevel.error, "expected type attributeGroup", reportPath);
                        found = null;
                    }
                    break;
                case cdmObjectType.dataTypeRef:
                    if (!(found instanceof DataTypeImpl)) {
                        status(cdmStatusLevel.error, "expected type dataType", reportPath);
                        found = null;
                    }
                    break;
                case cdmObjectType.entityRef:
                    if (!(found instanceof EntityImpl)) {
                        status(cdmStatusLevel.error, "expected type entity", reportPath);
                        found = null;
                    }
                    break;
                case cdmObjectType.parameterDef:
                    if (!(found instanceof ParameterImpl)) {
                        status(cdmStatusLevel.error, "expected type parameter", reportPath);
                        found = null;
                    }
                    break;
                case cdmObjectType.relationshipRef:
                    if (!(found instanceof RelationshipImpl)) {
                        status(cdmStatusLevel.error, "expected type relationship", reportPath);
                        found = null;
                    }
                    break;
                case cdmObjectType.traitRef:
                    if (!(found instanceof TraitImpl)) {
                        status(cdmStatusLevel.error, "expected type trait", reportPath);
                        found = null;
                    }
                    break;
            }
        }

        return found;
    }

}


////////////////////////////////////////////////////////////////////////////////////////////////////
//  {folderDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class Folder implements ICdmFolderDef {
    name: string;
    relativePath: string;
    subFolders?: Folder[];
    documents?: ICdmDocumentDef[];
    localizedImports?: Map<Document, Document>;
    corpus: Corpus;
    documentLookup : Map<string, ICdmDocumentDef>;
    constructor(corpus: Corpus, name: string, parentPath: string) {

        this.corpus = corpus;
        this.name = name;
        this.relativePath = parentPath + name + "/";
        this.subFolders = new Array<Folder>();
        this.documents = new Array<Document>();
        this.localizedImports = new Map<Document, Document>();
        this.documentLookup = new Map<string, ICdmDocumentDef>();
    }

    public getName(): string {
        return this.name;
    }
    public validate(): boolean {
        return this.name ? true : false;
    }
    public getRelativePath() : string {
        return this.relativePath;
    }
    public getSubFolders(): ICdmFolderDef[] {
        return this.subFolders;
    }
    public getDocuments(): ICdmDocumentDef[] {
        return this.documents;
    }
    
    public addFolder(name: string): ICdmFolderDef {
        let newFolder: Folder = new Folder(this.corpus, name, this.relativePath);
        this.subFolders.push(newFolder);
        return newFolder;
    }

    public addDocument(name: string, content: any): ICdmDocumentDef {
        let doc: Document;
        if (this.documentLookup.has(name))
            return;
        if (content==null || content=="")
            doc = Document.createClass(name, this.relativePath, new Document(name, false));
        else if (typeof(content)==="string")
            doc = Document.createClass(name, this.relativePath, JSON.parse(content));
        else
            doc = Document.createClass(name, this.relativePath, content);
        this.documents.push(doc);
        this.corpus.addDocumentObjects(this, doc);
        this.documentLookup.set(name, doc);
        return doc;
    }

    public getSubFolderFromPath(path: string, makeFolder = true): ICdmFolderDef {
        let name: string;
        let remainingPath: string;
        let first: number = path.indexOf('/', 0);
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
            let result: Folder;
            if (this.subFolders) {
                this.subFolders.some(f => {
                    result = f.getSubFolderFromPath(remainingPath, makeFolder) as Folder;
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

    public getObjectFromFolderPath(objectPath : string) : ICdmObject {

        let docName: string;
        let remainingPath: string;
        let first: number = objectPath.indexOf('/', 0);
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

    public localizeImports(allDocuments : [Folder, Document][], directory : Map<Document, Folder>, status: RptCallback) : number {
        let errors = 0;
        let lDocs = this.documents.length;
        for (let iDoc = 0; iDoc < lDocs; iDoc++) {
            const doc = this.documents[iDoc] as Document;
            // find imports
            let imports = doc.getImports();
            if (imports && imports.length) {
                for (let iImport = 0; iImport < imports.length; iImport++) {
                    const imp = imports[iImport] as ImportImpl;
                    if (imp.doc) {
                        let origFolder = directory.get(imp.doc);
                        // if from a different folder, make a copy here. once
                        if (origFolder && origFolder != this) {
                            if (!this.localizedImports.has(imp.doc)) {
                                let local = imp.doc.copy() as Document;
                                local.path = this.relativePath;
                                local.name = "localized.import.of." + local.name;
                                this.localizedImports.set(imp.doc, local);
                                allDocuments.push([this, local]);
                            }
                        }
                    }
                }

            }
        }
        if (this.subFolders) {
            let lSub = this.subFolders.length;
            for (let iSub = 0; iSub < lSub; iSub++) {
                errors += this.subFolders[iSub].localizeImports(allDocuments, directory, status);
            }
        }

        return errors;
    }

    public getObjectType(): cdmObjectType {
        return cdmObjectType.folderDef;
    }
    public getObjectRefType(): cdmObjectType {
        return cdmObjectType.unresolved;
    }
    // required by base but makes no sense... should refactor
    public visit(userData: any, pathRoot: string, preChildren: VisitCallback, postChildren: VisitCallback, statusRpt: RptCallback): boolean {
        return false;
    }
    public getPathBranch(): string {
        return "only makes sense inside a document"
    }
    public getObjectDef<T=ICdmObjectDef>(): T {
        return null;
    }
    public copyData(stringRefs? : boolean): Folder {
        return null;
    }
    getResolvedTraits(set?: cdmTraitSet): ResolvedTraitSet {
        return null;
    }
    public setTraitParameterValue(toTrait : ICdmTraitDef, paramName : string, value : string | ICdmObject) {
        
    }    
    getResolvedAttributes(): ResolvedAttributeSet {
        return null;
    }
    public copy() : ICdmObject {
        return null;
    }
    public getFriendlyFormat() : friendlyFormatNode {
        return null;
    }
    
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//  {Corpus}
////////////////////////////////////////////////////////////////////////////////////////////////////
export class Corpus extends Folder {
    rootPath: string;
    allDocuments?: [Folder, Document][];
    directory: Map<Document, Folder>;
    pathLookup: Map<string, [Folder, Document]>;
    public statusLevel : cdmStatusLevel = cdmStatusLevel.info;
    constructor(rootPath: string) {
        super(null, "", "");
        this.corpus = this; // well ... it is
        this.rootPath=rootPath;
        this.allDocuments = new Array<[Folder, Document]>();
        this.pathLookup = new Map<string, [Folder, Document]>();
        this.directory = new Map<Document, Folder>();
    }

    public static MakeRef(ofType: cdmObjectType, refObj: string | ICdmObject) : ICdmObjectRef {
        let oRef : ICdmObjectRef; 

        if (refObj) {
            if (typeof(refObj) === "string")
                oRef = new StringConstant(ofType, refObj);
            else
            {
                if (refObj.getObjectType() == ofType)
                    oRef = refObj as ICdmObjectRef;
                else { 
                    oRef = this.MakeObject(refObj.getObjectRefType(), undefined);
                    (oRef as ICdmObjectRef).setObjectDef(refObj as ICdmObjectDef);
                }
            }
        }
        return oRef;
    }
    public static MakeObject<T=ICdmObject> (ofType : cdmObjectType, nameOrRef? : string) : T {
        let newObj : ICdmObject = null;
        
        switch (ofType) {
            case cdmObjectType.argumentDef:
                newObj = new ArgumentImpl();
                (newObj as ArgumentImpl).name = nameOrRef;
                break;
            case cdmObjectType.attributeGroupDef:
                newObj = new AttributeGroupImpl(nameOrRef);
                break;
            case cdmObjectType.attributeGroupRef:
                newObj = new AttributeGroupReferenceImpl(this.MakeRef(ofType, nameOrRef) as any);
                break;
            case cdmObjectType.constantEntityDef:
                newObj = new ConstantEntityImpl(false);
                (newObj as ConstantEntityImpl).constantEntityName = nameOrRef;
                break;
            case cdmObjectType.dataTypeDef:
                newObj = new DataTypeImpl(nameOrRef, null, false);
                break;
            case cdmObjectType.dataTypeRef:
                newObj = new DataTypeReferenceImpl(this.MakeRef(ofType, nameOrRef) as any, false);
                break;
            case cdmObjectType.documentDef:
                newObj = new Document(name, false);
                break;
            case cdmObjectType.entityAttributeDef:
                newObj = new EntityAttributeImpl(false);
                (newObj as EntityAttributeImpl).entity = this.MakeRef(cdmObjectType.entityRef, nameOrRef) as any;
                break;
            case cdmObjectType.entityDef:
                newObj = new EntityImpl(nameOrRef, null, false, false);
                break;
            case cdmObjectType.entityRef:
                newObj = new EntityReferenceImpl(this.MakeRef(ofType, nameOrRef) as any, false);
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
                newObj = new RelationshipReferenceImpl(this.MakeRef(ofType, nameOrRef) as any, false);
                break;
            case cdmObjectType.stringConstant:
                newObj = new StringConstant(cdmObjectType.unresolved, nameOrRef);
                break;
            case cdmObjectType.traitDef:
                newObj = new TraitImpl(nameOrRef, null, false);
                break;
            case cdmObjectType.traitRef:
                newObj = new TraitReferenceImpl(this.MakeRef(ofType, nameOrRef) as any, false);
                break;
            case cdmObjectType.typeAttributeDef:
                newObj = new TypeAttributeImpl(nameOrRef, false);
                break;
        }
        return newObj as any;
    }

    public addDocumentObjects(folder: Folder, docDef: ICdmDocumentDef): ICdmDocumentDef {
        let doc : Document = docDef as Document;
        let path = doc.path + doc.name;
        if (!this.pathLookup.has(path)) {
            this.allDocuments.push([folder, doc]);
            this.pathLookup.set(path, [folder, doc]);
            this.directory.set(doc, folder);
        }
        return doc;
    }

    public addDocumentFromContent(uri: string, content: string): ICdmDocumentDef {
        let last: number = uri.lastIndexOf('/');
        if (last < 0)
            throw new Error("bad path");
        let name: string = uri.slice(last + 1);
        let path: string = uri.slice(0, last + 1);
        let folder: ICdmFolderDef = this.getSubFolderFromPath(path, true);
        if (folder == null && path == "/")
            folder = this;        
        return folder.addDocument(name, content);
    }

    public listMissingImports(): Set<string> {
        let missingSet: Set<string> = new Set<string>();
        let l = this.allDocuments.length;
        for (let i = 0; i < l; i++) {
            const fd = this.allDocuments[i];
            if (fd["1"].imports) {
                fd["1"].imports.forEach(imp => {
                    if (!imp.doc) {
                        // no document set for this import, see if it is already loaded into the corpus
                        let path = imp.uri;
                        if (path.charAt(0) != '/')
                            path =  fd["0"].getRelativePath() + imp.uri;
                        let lookup: [Folder, Document] = this.pathLookup.get(path);
                        if (lookup)
                            imp.doc = lookup["1"];
                        else
                            missingSet.add(path);
                    }
                });
            }
        }

        if (missingSet.size == 0)
            return undefined;
        return missingSet;
    }

    public getObjectFromCorpusPath(objectPath : string) {

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


////////////////////////////////////////////////////////////////////////////////////////////////////
//  resolve imports
////////////////////////////////////////////////////////////////////////////////////////////////////

    public resolveImports(importResolver: (uri: string) => Promise<[string, string]>, status: RptCallback): Promise<boolean> {
        return new Promise<boolean>(resolve => {

            let missingSet: Set<string> = this.listMissingImports();
            let result = true;

            let turnMissingImportsIntoClientPromises = () => {
                if (missingSet) {
                    // turn each missing into a promise for a missing from the caller
                    missingSet.forEach(missing => {
                        importResolver(missing).then((success: [string, string]) => {
                            if (result) {
                                // a new document for the corpus
                                this.addDocumentFromContent(success[0], success[1]);

                                // remove this from set
                                missingSet.delete(success[0]);
                                if (this.statusLevel <= cdmStatusLevel.progress)
                                    status(cdmStatusLevel.progress, `resolved import '${success[0]}'`, "");
                                // if this is the last import, check to see if more are needed now and recurse 
                                if (missingSet.size == 0) {
                                    missingSet = this.listMissingImports();
                                    turnMissingImportsIntoClientPromises();
                                }
                            }
                        }, (fail: [string, string]) => {
                            result = false;
                            // something went wrong with one of the imports, give up on all of it
                            status(cdmStatusLevel.error, `failed to import '${fail[0]}' for reason : ${fail[1]}`, this.getRelativePath());
                            resolve(result);
                        })
                    });
                }
                else {
                    // nothing was missing, so just move to next resolve step
                    resolve(result);
                }
            }

            turnMissingImportsIntoClientPromises();

        });
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  resolve references
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
    public resolveReferencesAndValidate(stage : cdmValidationStep, status: RptCallback, errorLevel : cdmStatusLevel = cdmStatusLevel.warning): Promise<cdmValidationStep> {
        return new Promise<cdmValidationStep>(resolve => {
            let errors: number = 0;

            interface resolveContext {
                currentDoc? : Document;
                currentEntity? : ICdmEntityDef;
                currentAtttribute? : ICdmAttributeDef;
                currentTrait? : ICdmTraitDef;
                currentParameter? : number;
            }
            let contextStack = new Array<resolveContext>();
            let contextCurrent : resolveContext = {};
            contextStack.push(contextCurrent);


            // helper
            let constTypeCheck = (ctx : resolveContext, paramDef: ICdmParameterDef, aValue: ICdmObject, userData: any, path: string, statusRpt: RptCallback) => {
                // if parameter type is entity, then the value should be an entity or ref to one
                // same is true of 'dataType' dataType
                if (paramDef.getDataTypeRef()) {
                    let dt = paramDef.getDataTypeRef().getObjectDef<ICdmDataTypeDef>();
                    // compare with passed in value or default for parameter
                    let pValue = aValue;
                    if (!pValue)
                        pValue = paramDef.getDefaultValue();
                    if (pValue) {
                        if (dt.isDerivedFrom("cdmObject")) {
                            let expectedTypes: cdmObjectType[] = new Array<cdmObjectType>();
                            let expected: string;
                            if (dt.isDerivedFrom("entity")) {
                                expectedTypes.push(cdmObjectType.constantEntityDef);
                                expectedTypes.push(cdmObjectType.entityRef);
                                expectedTypes.push(cdmObjectType.entityDef);
                                expected = "entity";
                            }
                            else if (dt.isDerivedFrom("attribute")) {
                                expectedTypes.push(cdmObjectType.typeAttributeDef);
                                expectedTypes.push(cdmObjectType.entityAttributeDef);
                                expected = "attribute";
                            }
                            else if (dt.isDerivedFrom("dataType")) {
                                expectedTypes.push(cdmObjectType.dataTypeRef);
                                expectedTypes.push(cdmObjectType.dataTypeDef);
                                expected = "dataType";
                            }
                            else if (dt.isDerivedFrom("relationship")) {
                                expectedTypes.push(cdmObjectType.relationshipRef);
                                expectedTypes.push(cdmObjectType.relationshipDef);
                                expected = "relationship";
                            }
                            else if (dt.isDerivedFrom("trait")) {
                                expectedTypes.push(cdmObjectType.traitRef);
                                expectedTypes.push(cdmObjectType.traitDef);
                                expected = "trait";
                            }
                            else if (dt.isDerivedFrom("attributeGroup")) {
                                expectedTypes.push(cdmObjectType.attributeGroupRef);
                                expectedTypes.push(cdmObjectType.attributeGroupDef);
                                expected = "attributeGroup";
                            }

                            if (expectedTypes.length == 0)
                                statusRpt(cdmStatusLevel.error, `parameter '${paramDef.getName()}' has an unexpected dataType.`, ctx.currentDoc.path + path);

                            // if a string constant, resolve to an object ref.
                            let foundType: cdmObjectType = pValue.getObjectType();
                            let foundDesc: string = path;
                            if (foundType == cdmObjectType.stringConstant) {
                                let sc: StringConstant = (pValue as StringConstant);
                                foundDesc = sc.constantValue;
                                if (foundDesc == "this.attribute" && expected == "attribute") {
                                    sc.resolvedReference = ctx.currentAtttribute as any;
                                    foundType = cdmObjectType.typeAttributeDef;
                                }
                                else if (foundDesc == "this.trait" && expected == "trait") {
                                    sc.resolvedReference = ctx.currentTrait as any;
                                    foundType = cdmObjectType.traitDef;
                                }
                                else if (foundDesc == "this.entity" && expected == "entity") {
                                    sc.resolvedReference = ctx.currentEntity as any;
                                    foundType = cdmObjectType.entityDef;
                                }
                                else {
                                    let resAttToken = "/(resolvedAttributes)/";
                                    let seekResAtt = sc.constantValue.indexOf(resAttToken);
                                    if (seekResAtt >= 0) {
                                        let entName = sc.constantValue.substring(0, seekResAtt);
                                        let attName = sc.constantValue.slice(seekResAtt + resAttToken.length);
                                        // get the entity
                                        let ent = (userData as Document).resolveString(new StringConstant(cdmObjectType.entityDef, entName), new Set<string>(), path, status);
                                        if (!ent || ent.getObjectType() != cdmObjectType.entityDef) {
                                            statusRpt(cdmStatusLevel.warning, `unable to resolve an entity named '${entName}' from the reference '${foundDesc}'`, ctx.currentDoc.path + path);
                                            return null;
                                        }
                                        // get an object there that will get resolved later
                                        sc.resolvedReference = ((ent as EntityImpl).getAttributePromise(attName) as any);
                                        foundType = cdmObjectType.typeAttributeDef;
                                    }
                                    else {
                                        sc.expectedType = cdmObjectType.cdmObject;
                                        sc.resolvedReference = (userData as Document).resolveString(sc, new Set<string>(), path, status);
                                        if (sc.resolvedReference) {
                                            foundType = sc.expectedType = sc.resolvedReference.getObjectType();
                                        }
                                    }
                                }
                            }
                            if (expectedTypes.indexOf(foundType) == -1)
                                statusRpt(cdmStatusLevel.error, `parameter '${paramDef.getName()}' has the dataType of '${expected}' but the value '${foundDesc}' does't resolve to a known ${expected} referenece`, ctx.currentDoc.path + path);
                            else {
                                if (this.statusLevel <= cdmStatusLevel.info)
                                    statusRpt(cdmStatusLevel.info, `    resolved '${foundDesc}'`, path);
                            }
                        }
                    }
                }
            }


////////////////////////////////////////////////////////////////////////////////////////////////////
//  folder imports
////////////////////////////////////////////////////////////////////////////////////////////////////
            if (stage == cdmValidationStep.start || stage == cdmValidationStep.imports) 
            {
                if (this.statusLevel <= cdmStatusLevel.progress)                
                    status(cdmStatusLevel.progress, "importing documents...", null);
                
                // recurse through folders because this is contextual
                // for each document in a folder look at the imports. if there are imports to objects from different folders, then
                // make a folder local copy of the document. this is done so that any references the imported document makes are
                // resolved relative to the folder where it is imported, not where it is defined. this lets us re-use shared definitions 
                // that make references to other objects which might have a different meaning in the current folder
                // note that imports done in the copy imported are going to still point at original objects. 
                
                //errors = this.localizeImports(this.allDocuments, this.directory, status);
                // work in progress...

                let l = this.allDocuments.length;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    // cache import documents
                    fd["1"].indexImports(this.directory);
                };
                
                if (errors > 0) {
                    resolve(cdmValidationStep.error);
                }
                else {
                    resolve(cdmValidationStep.integrity);
                }
                return;
            }
            else if (stage == cdmValidationStep.integrity) 
            {
////////////////////////////////////////////////////////////////////////////////////////////////////
//  integrity
////////////////////////////////////////////////////////////////////////////////////////////////////
                if (this.statusLevel <= cdmStatusLevel.progress)                
                    status(cdmStatusLevel.progress, "basic object integrity...", null);
                
                // for each document, see if any object doesn't have the basic required shape
                let l = this.allDocuments.length;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    doc.declarations = new Map<string, cdmObjectDef>();
                    doc.visit(null, "", (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        if (iObject.validate() == false) {
                            statusRpt(cdmStatusLevel.error, `integrity check failed for : '${path}'`, doc.path + path);
                        } else if (this.statusLevel <= cdmStatusLevel.info)
                            statusRpt(cdmStatusLevel.info, `checked '${path}'`, doc.path + path);
                        return false
                    }, null, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                }

                if (errors > 0) {
                    resolve(cdmValidationStep.error);
                }
                else {
                    resolve(cdmValidationStep.declarations);
                }
                return;
            }
            else if (stage == cdmValidationStep.declarations) 
            {
////////////////////////////////////////////////////////////////////////////////////////////////////
//  declarations
////////////////////////////////////////////////////////////////////////////////////////////////////
                if (this.statusLevel <= cdmStatusLevel.progress)                
                    status(cdmStatusLevel.progress, "making declarations...", null);
                
                // for each document, make a directory of the objects that are declared within it with a path relative to the doc
                // the rules are that any declared object with a name or an attribute with a name adds the name to a path
                let l = this.allDocuments.length;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    doc.declarations = new Map<string, cdmObjectDef>();
                    doc.visit(null, "", (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        if (path.indexOf("(unspecified)") > 0)
                            return true;
                        switch (iObject.getObjectType()) {
                            case cdmObjectType.parameterDef:
                            case cdmObjectType.traitDef:
                            case cdmObjectType.relationshipDef:
                            case cdmObjectType.dataTypeDef:
                            case cdmObjectType.typeAttributeDef:
                            case cdmObjectType.entityAttributeDef:
                            case cdmObjectType.attributeGroupDef:
                            case cdmObjectType.constantEntityDef:
                            case cdmObjectType.entityDef:
                                if (doc.declarations.has(path)) {
                                    statusRpt(cdmStatusLevel.error, `duplicate declaration for item '${path}'`, doc.path + path);
                                    return false;
                                }
                                doc.declarations.set(path, iObject as cdmObjectDef);
                                (iObject as cdmObjectDef).corpusPath = doc.path + doc.name + '/' + path;
                                if (this.statusLevel <= cdmStatusLevel.info)
                                    statusRpt(cdmStatusLevel.info, `declared '${path}'`, doc.path + path);
                                break;
                        }

                        return false
                    }, null, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                }

                if (errors > 0) {
                    resolve(cdmValidationStep.error);
                }
                else {
                    resolve(cdmValidationStep.references);
                }
                return;
            }
            else if (stage == cdmValidationStep.references) {
////////////////////////////////////////////////////////////////////////////////////////////////////
//  references
////////////////////////////////////////////////////////////////////////////////////////////////////

                // for each document, find each explicit or implicit reference and search for the object named. 
                // if the name starts with a moniker for one of the imports, then look through that import first else look through the main document first.
                // if not found, look through any of the imported documents that have no moniker in listed order. depth first avoiding cycles
                // if any imports have not been resolved to documents, skip them
                if (this.statusLevel <= cdmStatusLevel.progress)
                    status(cdmStatusLevel.progress, "resolving references...", null);

                let l = this.allDocuments.length;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    contextCurrent.currentDoc = doc;
                    doc.visit(doc, "", (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        let ot: cdmObjectType = iObject.getObjectType();
                        switch (ot) {
                            case cdmObjectType.entityDef:
                                contextCurrent = {currentDoc:doc, currentEntity : iObject as ICdmEntityDef};
                                contextStack.push(contextCurrent);
                                break;
                            case cdmObjectType.typeAttributeDef:
                            case cdmObjectType.entityAttributeDef:
                                contextCurrent = {currentDoc:doc, currentEntity : contextCurrent.currentEntity, currentAtttribute: iObject as ICdmAttributeDef};
                                contextStack.push(contextCurrent);
                                break;
                            case cdmObjectType.stringConstant:
                                let sc: StringConstant = (iObject as StringConstant);
                                if (sc.expectedType != cdmObjectType.unresolved && sc.expectedType != cdmObjectType.argumentDef) {

                                    let avoid = new Set<string>();
                                    sc.resolvedReference = (userData as Document).resolveString(sc, avoid, path, status);
                                    if (!sc.resolvedReference) {
                                        // it is 'ok' to not find entity refs sometimes
                                        let level = (sc.expectedType == cdmObjectType.entityRef || sc.expectedType == cdmObjectType.entityDef || 
                                                sc.expectedType == cdmObjectType.constantEntityDef || sc.expectedType == cdmObjectType.constantEntityRef)
                                             ? cdmStatusLevel.warning : cdmStatusLevel.error;
                                        statusRpt(level, `unable to resolve the reference '${sc.constantValue}' to a known object`, doc.path + path);
                                    }
                                    else {
                                        if (this.statusLevel <= cdmStatusLevel.info)
                                            statusRpt(cdmStatusLevel.info, `    resolved '${sc.constantValue}'`, doc.path + path);
                                    }
                                }
                                break;
                        }
                        return false
                    }, (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        let ot: cdmObjectType = iObject.getObjectType();
                        switch (ot) {
                            case cdmObjectType.entityDef:
                            case cdmObjectType.typeAttributeDef:
                            case cdmObjectType.entityAttributeDef:
                                contextStack.pop();
                                contextCurrent = contextStack[contextStack.length-1];
                                break;
                            case cdmObjectType.parameterDef: 
                                // when a parameter has a datatype of 'entity' and a default value, then the default value should be a constant entity or ref to one
                                let p: ICdmParameterDef = iObject as ICdmParameterDef;
                                constTypeCheck(contextCurrent, p, null, userData, path, statusRpt);
                                break;
                        }
                        return false
                    }, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                };

                if (errors > 0) 
                    resolve(cdmValidationStep.error);
                else
                    resolve(cdmValidationStep.parameters);
                return;
            }
            else if (stage == cdmValidationStep.parameters) {
////////////////////////////////////////////////////////////////////////////////////////////////////
//  parameters
////////////////////////////////////////////////////////////////////////////////////////////////////
                if (this.statusLevel <= cdmStatusLevel.progress)
                    status(cdmStatusLevel.progress, "binding parameters...", null);

                // tie arguments to the parameter for the referenced trait
                // if type is 'entity' and  value is a string, then resolve like a ref 
                // calling getAllParameters will validate that there are no duplicate params in the inheritence chain of the trait
                // calling resolveParameter will fail if there is no match on the given name or ordinal
                let l = this.allDocuments.length;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    contextCurrent.currentDoc = doc;
                    doc.visit(doc, "", (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        let ot: cdmObjectType = iObject.getObjectType();
                        switch (ot) {
                            case cdmObjectType.entityDef:
                                contextCurrent = {currentDoc:doc, currentEntity : iObject as ICdmEntityDef};
                                contextStack.push(contextCurrent);
                                break;
                            case cdmObjectType.typeAttributeDef:
                            case cdmObjectType.entityAttributeDef:
                                contextCurrent = {currentDoc:doc, currentEntity : contextCurrent.currentEntity, currentAtttribute: iObject as ICdmAttributeDef};
                                contextStack.push(contextCurrent);
                                break;
                            case cdmObjectType.traitRef:
                                contextCurrent = {currentDoc:doc, currentEntity : contextCurrent.currentEntity, currentAtttribute: contextCurrent.currentAtttribute, currentTrait : iObject.getObjectDef<ICdmTraitDef>(), currentParameter : 0};
                                contextStack.push(contextCurrent);
                                break;
                            case cdmObjectType.stringConstant:
                                if ((iObject as StringConstant).expectedType != cdmObjectType.argumentDef)
                                    break;
                            case cdmObjectType.argumentDef:
                                try {
                                    let params: ParameterCollection = contextCurrent.currentTrait.getAllParameters();
                                    let paramFound: ICdmParameterDef;
                                    let aValue: ArgumentValue;
                                    if (ot == cdmObjectType.argumentDef) {
                                        paramFound = params.resolveParameter(contextCurrent.currentParameter, (iObject as ICdmArgumentDef).getName());
                                        (iObject as ArgumentImpl).resolvedParameter = paramFound;
                                        aValue = (iObject as ArgumentImpl).value;
                                    }
                                    else {
                                        paramFound = params.resolveParameter(contextCurrent.currentParameter, null);
                                        (iObject as StringConstant).resolvedParameter = paramFound;
                                        aValue = (iObject as StringConstant);
                                    }
                                    // if parameter type is entity, then the value should be an entity or ref to one
                                    // same is true of 'dataType' dataType
                                    constTypeCheck(contextCurrent, paramFound, aValue, userData, path, statusRpt);
                                }
                                catch (e) {
                                    statusRpt(cdmStatusLevel.error, e.toString(), path);
                                    statusRpt(cdmStatusLevel.error,`failed to resolve parameter on trait '${contextCurrent.currentTrait.getName()}'`, doc.path + path);
                                }
                                contextCurrent.currentParameter ++;
                                break;
                        }
                        return false;
                    }, (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        let ot: cdmObjectType = iObject.getObjectType();
                        switch (ot) {
                            case cdmObjectType.entityDef:
                            case cdmObjectType.typeAttributeDef:
                            case cdmObjectType.entityAttributeDef:
                            case cdmObjectType.traitRef:
                                contextStack.pop();
                                contextCurrent = contextStack[contextStack.length-1];
                                break;
                        }
                        return false;
                    }, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                };

                if (errors > 0) 
                    resolve(cdmValidationStep.error);
                else
                    resolve(cdmValidationStep.traits);
                return;
            }
            else if (stage == cdmValidationStep.traits) {

                if (this.statusLevel <= cdmStatusLevel.progress)
                    status(cdmStatusLevel.progress, "resolving traits...", null);

                let assignAppliers = (traitMatch: ICdmTraitDef, traitAssign: ICdmTraitDef) => {
                    if (!traitMatch)
                        return;
                    if (traitMatch.getExtendsTrait())
                        assignAppliers(traitMatch.getExtendsTrait().getObjectDef(), traitAssign);
                    let traitName = traitMatch.getName();
                    // small number of matcher
                    PrimitiveAppliers.forEach(applier => {
                        if (applier.matchName == traitName)
                            traitAssign.addTraitApplier(applier);
                    });

                }
                let l = this.allDocuments.length;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    doc.visit(doc, "", (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        switch (iObject.getObjectType()) {
                            case cdmObjectType.traitDef:
                                // add trait appliers to this trait from base class on up
                                assignAppliers(iObject as ICdmTraitDef, iObject as ICdmTraitDef);
                                break;
                        }
                        return false;
                    }, null, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                };

                // for every defined object, find and cache the full set of traits that are exhibited or applied during inheritence 
                // and for each get a mapping of values (starting with default values) to parameters build from the base declaration up to the final
                // so that any overrides done along the way take precidence.
                // for trait definition, consider that when extending a base trait arguments can be applied.
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    doc.visit(doc, "", (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        switch (iObject.getObjectType()) {
                            case cdmObjectType.traitDef:
                            case cdmObjectType.relationshipDef:
                            case cdmObjectType.dataTypeDef:
                            case cdmObjectType.entityDef:
                            case cdmObjectType.attributeGroupDef:
                                (iObject as ICdmObjectDef).getResolvedTraits();
                                break;
                            case cdmObjectType.entityAttributeDef:
                            case cdmObjectType.typeAttributeDef:
                                (iObject as ICdmAttributeDef).getResolvedTraits();
                                break;
                        }
                        return false;
                    }, null, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                };

                if (this.statusLevel <= cdmStatusLevel.progress)
                    status(cdmStatusLevel.progress, "checking required arguments...", null);

                let checkRequiredParamsOnResolvedTraits = (doc : Document, obj: ICdmObject, path: string, statusRpt: RptCallback) => {
                    let rts = obj.getResolvedTraits();
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
                                            statusRpt(cdmStatusLevel.error, `no argument supplied for required parameter '${rt.parameterValues.getParameter(iParam).getName()}' of trait '${rt.traitName}' on '${obj.getObjectDef().getName()}'`, doc.path + path);
                                        else
                                            resolved++;
                                    }
                                }
                            }
                            if (found > 0 && found == resolved && this.statusLevel <= cdmStatusLevel.info)
                                statusRpt(cdmStatusLevel.info, `found and resolved '${found}' required parameters of trait '${rt.traitName}' on '${obj.getObjectDef().getName()}'`, doc.path + path);
                        }
                    }
                }

                // now make sure that within the definition of an entity, every usage of a trait has values or default values for all required params
                let inEntityDef = 0;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    doc.visit(doc, "", null, (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        let ot: cdmObjectType = iObject.getObjectType();
                        if (ot == cdmObjectType.entityDef) {
                            // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                            checkRequiredParamsOnResolvedTraits(doc, iObject, path, statusRpt);
                            // do the same for all attributes
                            if ((iObject as ICdmEntityDef).getHasAttributeDefs()) {
                                (iObject as ICdmEntityDef).getHasAttributeDefs().forEach((attDef) => {
                                    checkRequiredParamsOnResolvedTraits(doc, attDef as ICdmObject, path, statusRpt);
                                });
                            }
                        }
                        if (ot == cdmObjectType.attributeGroupDef) {
                            // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                            checkRequiredParamsOnResolvedTraits(doc, iObject, path, statusRpt);
                            // do the same for all attributes
                            if ((iObject as ICdmAttributeGroupDef).getMembersAttributeDefs()) {
                                (iObject as ICdmAttributeGroupDef).getMembersAttributeDefs().forEach((attDef) => {
                                    checkRequiredParamsOnResolvedTraits(doc, attDef as ICdmObject, path, statusRpt);
                                });
                            }
                        }
                        return false;
                    }, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                };

                if (errors > 0) 
                    resolve(cdmValidationStep.error);
                else
                    resolve(cdmValidationStep.attributes);
                return;
            }
            else if (stage == cdmValidationStep.attributes) {
////////////////////////////////////////////////////////////////////////////////////////////////////
//  attributes
////////////////////////////////////////////////////////////////////////////////////////////////////
                if (this.statusLevel <= cdmStatusLevel.progress)
                    status(cdmStatusLevel.progress, "resolving attributes...", null);

                // moving on ...
                // for each entity, find and cache the complete set of attributes
                // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
                // an extended entity, traits applied to extended entity, exhibited traits of main entity, the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
                // the relationsip of the attribute, the attribute definition itself and included attribute groups, any traits applied to the attribute.
                // make sure there are no duplicates in the final step

                let l = this.allDocuments.length;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    doc.visit(doc, "", (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        let ot: cdmObjectType = iObject.getObjectType();
                        if (ot == cdmObjectType.entityDef) {
                            (iObject as ICdmEntityDef).getResolvedAttributes();
                        }
                        if (ot == cdmObjectType.attributeGroupDef) {
                            (iObject as ICdmAttributeGroupDef).getResolvedAttributes();
                        }
                        return false;
                    }, null, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                };

                // status(cdmStatusLevel.progress, `__paramCopy:${__paramCopy} __raCopy:${__raCopy} __rtsMergeOne:${__rtsMergeOne} __rasMergeOne:${__rasMergeOne} __rasApplyAdd:${__rasApplyAdd} __rasApplyRemove:${__rasApplyRemove}`, null);
                // __paramCopy =  __raCopy = __rtsMergeOne = __rasMergeOne = __rasApplyAdd = __rasApplyRemove = 0;
                if (errors > 0) 
                    resolve(cdmValidationStep.error);
                else
                    resolve(cdmValidationStep.entityReferences);
                return;
            }
            else if (stage == cdmValidationStep.entityReferences) {
////////////////////////////////////////////////////////////////////////////////////////////////////
//  entity references
////////////////////////////////////////////////////////////////////////////////////////////////////
                if (this.statusLevel <= cdmStatusLevel.progress)
                    status(cdmStatusLevel.progress, "resolving foreign key references...", null);
                // for each entity, find and cache the complete set of references to other entities made through referencesA relationships
                let l = this.allDocuments.length;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    doc.visit(doc, "", (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        let ot: cdmObjectType = iObject.getObjectType();
                        if (ot == cdmObjectType.entityDef) {
                            (iObject as ICdmEntityDef).getResolvedEntityReferences();
                        }
                        return false;
                    }, null, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                };

                if (errors > 0) 
                    resolve(cdmValidationStep.error);
                else
                    resolve(cdmValidationStep.cleanup);
                return;
            }
            else if (stage == cdmValidationStep.cleanup) {
////////////////////////////////////////////////////////////////////////////////////////////////////
//  cleanup references
////////////////////////////////////////////////////////////////////////////////////////////////////
                if (this.statusLevel <= cdmStatusLevel.progress)
                    status(cdmStatusLevel.progress, "finishing...", null);
                // turn elevated traits back on, they are off by default and should work fully now that everything is resolved
                let l = this.allDocuments.length;
                for (let i = 0; i < l; i++) {
                    const fd = this.allDocuments[i];
                    let doc = fd["1"];
                    doc.visit(doc, "", (userData: any, iObject: ICdmObject, path: string, statusRpt: RptCallback) => {
                        let obj = (iObject as cdmObject);
                        obj.skipElevated = false;
                        obj.rtsbAll=null;
                        return false;
                    }, null, (level, msg, path) => { if (level >= errorLevel) errors++; status(level, msg, path); });
                };

                if (errors > 0) 
                    resolve(cdmValidationStep.error);
                else
                    resolve(cdmValidationStep.finished);
                return;
            }


            resolve(cdmValidationStep.error);
        });
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  appliers to support the traits from 'primitives.cmd'
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

let PrimitiveAppliers: traitApplier[] = [
    {
        matchName: "is.removed",
        priority: 10,
        attributeRemove: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait): ApplierResult => {
            return { "shouldDelete": true };
        }
    },
    {
        matchName: "does.addAttribute",
        priority: 9,
        willAdd: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait): boolean => {
            return true;
        },
        attributeAdd: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait, continuationState: any): ApplierResult => {
            // get the added attribute and applied trait
            let sub = resTrait.parameterValues.getParameterValue("addedAttribute").value as ICdmAttributeDef;
            sub = sub.copy();
            let appliedTrait = resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait as any); // could be a def or ref or string handed in. this handles it
            }
            return { "addedAttribute": sub };
        }
    },
    {
        matchName: "does.referenceEntity",
        priority: 8,
        attributeRemove: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait): ApplierResult => {
            let visible = true;
            if (resAtt) {
                // all others go away
                visible = false;
                if (resAtt.attribute === resTrait.parameterValues.getParameterValue("addedAttribute").value)
                    visible = true;
            }
            return { "shouldDelete": !visible };
        }
    },
    {
        matchName: "does.addSupportingAttribute",
        priority: 8,
        willAdd: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait): boolean => {
            return true;
        },
        attributeAdd: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait, continuationState: any): ApplierResult => {
            // get the added attribute and applied trait
            let sub = resTrait.parameterValues.getParameterValue("addedAttribute").value as ICdmAttributeDef;
            sub=sub.copy();
            let appliedTrait = resTrait.parameterValues.getParameterValue("appliedTrait").value;
            appliedTrait = appliedTrait.getObjectDef();
            // shove new trait onto attribute
            sub.addAppliedTrait(appliedTrait as any); // could be a def or ref or string handed in. this handles it
            let supporting = "(unspecified)"
            if (resAtt)
                supporting = resAtt.resolvedName
            sub.setTraitParameterValue(appliedTrait as ICdmTraitDef, "inSupportOf", supporting);
            
            return { "addedAttribute": sub };
        }
    },
    {
        matchName: "is.array",
        priority: 6,
        willAdd: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait): boolean => {
            return resAtt ? true : false;
        },
        attributeAdd: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait, continuationState: any): ApplierResult => {
            let newAtt : ICdmAttributeDef;
            let newContinue : {curentOrdinal : number, finalOrdinal : number, renameTrait : ICdmTraitRef};
            if (resAtt) {
                if (!continuationState) {
                    // get the fixed size (not set means no fixed size)
                    let fixedSizeString = resTrait.parameterValues.getParameterValue("fixedSize").valueString;
                    if (fixedSizeString && fixedSizeString != "undefined") {
                        let fixedSize = Number.parseInt(fixedSizeString);
                        let renameTrait = resTrait.parameterValues.getParameterValue("renameTrait").value;
                        if (renameTrait) {
                            let ordinal = Number.parseInt(renameTrait.getResolvedTraits().first.parameterValues.getParameterValue("ordinal").valueString);
                            continuationState = {curentOrdinal : ordinal, finalOrdinal : ordinal + fixedSize - 1, renameTrait : renameTrait};
                        }
                    }
                }

                if (continuationState) {
                    if (continuationState.curentOrdinal <= continuationState.finalOrdinal) {
                        newAtt = resAtt.attribute.copy();
                        // add the rename trait to the new attribute
                        let newRenameTraitRef = continuationState.renameTrait.copy();
                        (newRenameTraitRef as ICdmTraitRef).setArgumentValue("ordinal", continuationState.curentOrdinal.toString());
                        newAtt.addAppliedTrait(newRenameTraitRef);
                        // and get rid of is.array trait
                        newAtt.removedTraitDef(resTrait.trait);

                        continuationState.curentOrdinal ++;
                        if (continuationState.curentOrdinal > continuationState.finalOrdinal)
                            continuationState = null;
                    }
                }
            }
            return { "addedAttribute": newAtt, "continuationState" : continuationState};
        },
        attributeRemove: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait): ApplierResult => {
            // array attributes get removed after being enumerated
            return { "shouldDelete": true };
        }
        
    },
    {
        matchName: "does.renameWithFormat",
        priority: 6,
        willApply: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait): boolean => {
            return (resAtt ? true : false);
        },
        attributeApply: (resAtt: ResolvedAttribute, resTrait: ResolvedTrait): ApplierResult => {
            if (resAtt) {
                let format = resTrait.parameterValues.getParameterValue("renameFormat").valueString;
                let ordinal = resTrait.parameterValues.getParameterValue("ordinal").valueString;
                if (!format)
                    return { "shouldDelete": false };
                let formatLength = format.length;
                if (formatLength == 0)
                    return { "shouldDelete": false };
                // parse the format looking for positions of {n} and {o} and text chunks around them
                // there are only 5 possibilies
                let iN = format.indexOf("{n}");
                let iO = format.indexOf("{o}");
                let replace = (start: number, at: number, length: number, value: string): string => {
                    let replaced: string = "";
                    if (at > start)
                        replaced = format.slice(start, at);
                    replaced += value;
                    if (at + 3 < length)
                        replaced += format.slice(at + 3, length);
                    return replaced;
                }
                let result: string;
                if (iN < 0 && iO < 0) {
                    result = format;
                }
                else if (iN < 0) {
                    result = replace(0, iO, formatLength, ordinal);
                }
                else if (iO < 0) {
                    result = replace(0, iN, formatLength, resAtt.resolvedName);
                } else if (iN < iO) {
                    result = replace(0, iN, iO, resAtt.resolvedName);
                    result += replace(iO, iO, formatLength, ordinal);
                } else {
                    result = replace(0, iO, iN, ordinal);
                    result += replace(iN, iN, formatLength, resAtt.resolvedName);
                }
                resAtt.resolvedName = result;
            }
            return { "shouldDelete": false };;
        }
    }
];  
