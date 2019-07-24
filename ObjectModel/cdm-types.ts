import { performance } from "perf_hooks";

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

export interface identifierRef
{
    corpusPath: string;
    identifier: string;
}

export interface Argument
{
    explanation?: string;
    name?: string;
    value: ArgumentValue;
}

export interface Parameter
{
    explanation?: string;
    name: string;
    defaultValue?: ArgumentValue;
    required?: boolean;
    direction?: string;
    dataType?: string | DataTypeReference;
}

export interface Import
{
    uri?: string; // deprecated
    corpusPath: string;
    moniker?: string;
}

export interface TraitReference
{
    traitReference: string | Trait;
    arguments?: (string | Argument)[];
}

export interface Trait
{
    explanation?: string;
    traitName: string;
    extendsTrait?: string | TraitReference;
    hasParameters?: (string | Parameter)[];
    elevated?: boolean;
    modifiesAttributes?: boolean;
    ugly?: boolean;
    associatedProperties?: string[];
}

export interface RelationshipReference
{
    relationshipReference: string | Relationship;
    appliedTraits?: (string | TraitReference)[];
}

export interface Relationship
{
    explanation?: string;
    relationshipName: string;
    extendsRelationship?: string | RelationshipReference;
    exhibitsTraits?: (string | TraitReference)[];
}

export interface DataTypeReference
{
    dataTypeReference: string | DataType;
    appliedTraits?: (string | TraitReference)[];
}

export interface DataType
{
    explanation?: string;
    dataTypeName: string;
    extendsDataType?: string | DataTypeReference;
    exhibitsTraits?: (string | TraitReference)[];
}

export interface TypeAttribute
{
    explanation?: string;
    name: string;
    relationship?: (string | RelationshipReference);
    dataType?: (string | DataTypeReference);
    appliedTraits?: (string | TraitReference)[];
    attributeContext?: string;
    isPrimaryKey?: boolean;
    isReadOnly?: boolean;
    isNullable?: boolean;
    dataFormat?: string;
    sourceName?: string;
    sourceOrdering?: number;
    displayName?: string;
    description?: string;
    maximumValue?: string;
    minimumValue?: string;
    maximumLength?: number;
    valueConstrainedToList?: boolean;
    defaultValue?: any;
}

let isTypeAttribute = (object): object is TypeAttribute =>
{
    return !("entity" in object);
}

export interface AttributeGroupReference
{
    attributeGroupReference: string | AttributeGroup;
}

let isAttributeGroupReference = (object: object): object is AttributeGroupReference =>
{
    return "attributeGroupReference" in object;
}

export interface AttributeGroup
{
    explanation?: string;
    attributeGroupName: string;
    attributeContext?: string;
    members: (string | AttributeGroupReference | TypeAttribute | EntityAttribute)[];
    exhibitsTraits?: (string | TraitReference)[];
}

export interface EntityAttribute
{
    explanation?: string;
    relationship?: (string | RelationshipReference);
    name: string;
    entity: string | EntityReference;
    appliedTraits?: (string | TraitReference)[];
}

let isEntityAttribute = (object: object): object is EntityAttribute =>
{
    return "entity" in object;
}

export interface ConstantEntity
{
    explanation?: string;
    constantEntityName?: string;
    entityShape: string | EntityReference;
    constantValues: string[][];
}

let isConstantEntity = (object: Entity | ConstantEntity): object is ConstantEntity =>
{
    return "entityShape" in object;
}

export interface EntityReference
{
    entityReference: string | Entity;
    appliedTraits?: (string | TraitReference)[];
}

export interface Entity
{
    explanation?: string;
    entityName: string;
    extendsEntity?: string | EntityReference;
    exhibitsTraits?: (string | TraitReference)[];
    attributeContext?: AttributeContext;
    hasAttributes?: (string | AttributeGroupReference | TypeAttribute | EntityAttribute)[];
    sourceName?: string;
    displayName?: string;
    description?: string;
    version?: string;
    cdmSchemas?: string[];
}

export interface DocumentContent
{
    schema: string;
    jsonSchemaSemanticVersion: string;
    imports?: Import[];
    definitions: (Trait | DataType | Relationship | AttributeGroup | Entity | ConstantEntity)[];
}

export interface AttributeContext
{
    explanation?: string;
    type: string;
    name: string;
    parent: string;
    definition: string;
    appliedTraits?: (string | TraitReference)[];
    contents?: (string | AttributeContext)[];
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//  enums
////////////////////////////////////////////////////////////////////////////////////////////////////
export enum cdmObjectType
{
    error,
    import,
    argumentDef,
    parameterDef,
    traitDef,
    traitRef,
    relationshipDef,
    relationshipRef,
    dataTypeDef,
    dataTypeRef,
    attributeRef,
    typeAttributeDef,
    entityAttributeDef,
    attributeGroupDef,
    attributeGroupRef,
    constantEntityDef,
    entityDef,
    entityRef,
    documentDef,
    folderDef,
    attributeContextDef,
    attributeContextRef
}

export enum cdmValidationStep
{
    start,
    imports,
    integrity,
    declarations,
    references,
    parameters,
    traitAppliers,
    minimumForResolving,
    traits,
    attributes,
    entityReferences,
    finished,
    error
}

export enum cdmAttributeContextType
{
    entity,
    entityReferenceExtends,
    attributeDefinition,
    attributeGroup,
    addedAttributeSupporting,
    addedAttributeIdentity,
    passThrough
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  interfaces for construction, inspection of OM
////////////////////////////////////////////////////////////////////////////////////////////////////

export interface copyOptions
{
    stringRefs?: boolean; // turn simple named string object references into objects with a relative path. used for links in viz
    removeSingleRowLocalizedTableTraits?: boolean;
}

export interface resolveOptions
{
    wrtDoc?: ICdmDocumentDef; // the document to use as a point of reference when resolving relative paths and symbol names.
    directives?: TraitDirectiveSet; // a set of string flags that direct how attribute resolving traits behave
    relationshipDepth?: number; // tracks the number of entity attributes that have been traversed when collecting resolved traits or attributes. prevents run away loops
    saveResolutionsOnCopy?: boolean; // when references get copied, use previous resolution results if available (for use with copy method)
}

export interface ICdmObject
{
    ID : number;
    ctx: CdmCorpusContext; 
    declaredInDocument: ICdmDocumentDef;
    visit(path : string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;
    validate(): boolean;
    getObjectType(): cdmObjectType;
    objectType: cdmObjectType;
    getObjectDef<T=ICdmObjectDef>(resOpt: resolveOptions): T
    getObjectDefName(): string;
    copyData(resOpt: resolveOptions, options?: copyOptions): any;
    getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet
    getResolvedAttributes(resOpt: resolveOptions, acpInContext? : AttributeContextParameters): ResolvedAttributeSet
    copy(resOpt: resolveOptions);
    getFriendlyFormat(): friendlyFormatNode;
    createSimpleReference(resOpt: resolveOptions) : ICdmObjectRef;
}

export interface ICdmObjectRef extends ICdmObject
{
    getAppliedTraitRefs(): ICdmTraitRef[];
    addAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean): ICdmTraitRef;
    removeAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string);
    setObjectDef(def: ICdmObjectDef): ICdmObjectDef;
}

export interface ICdmReferencesEntities
{
    getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet;
}

export interface ICdmArgumentDef extends ICdmObject
{
    getExplanation(): string;
    setExplanation(explanation: string): string;
    getValue(): ArgumentValue;
    getName(): string;
    getParameterDef(): ICdmParameterDef;
    setValue(value: ArgumentValue);
}

export interface ICdmParameterDef extends ICdmObject
{
    getExplanation(): string;
    getName(): string;
    getDefaultValue(): ArgumentValue;
    getRequired(): boolean;
    getDirection(): string;
    getDataTypeRef(): ICdmDataTypeRef;
}

export interface ICdmTraitRef extends ICdmObjectRef
{
    getArgumentDefs(): (ICdmArgumentDef)[];
    addArgument(name: string, value: ArgumentValue): ICdmArgumentDef;
    setArgumentValue(name: string, value: ArgumentValue);
    getArgumentValue(name: string): ArgumentValue;
}

export interface ICdmObjectDef extends ICdmObject
{
    getExplanation(): string;
    setExplanation(explanation: string): string;
    getName(): string;
    getExhibitedTraitRefs(): ICdmTraitRef[];
    addExhibitedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean): ICdmTraitRef;
    removeExhibitedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string);
    isDerivedFrom(resOpt: resolveOptions, base: string): boolean;
    getObjectPath(): string;
}

export interface ICdmTraitDef extends ICdmObjectDef
{
    getExtendsTrait(): ICdmTraitRef;
    setExtendsTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean): ICdmTraitRef;
    getHasParameterDefs(): ICdmParameterDef[];
    getAllParameters(resOpt: resolveOptions): ParameterCollection;
    addTraitApplier(applier: TraitApplier);
    getTraitAppliers(): TraitApplier[];
    elevated: boolean;
    modifiesAttributes: boolean;
    ugly: boolean;
    associatedProperties: string[];
}

export interface ICdmRelationshipRef extends ICdmObjectRef
{
}

export interface ICdmRelationshipDef extends ICdmObjectDef
{
    getExtendsRelationshipRef(): ICdmRelationshipRef;
}

export interface ICdmDataTypeRef extends ICdmObjectRef
{
}

export interface ICdmDataTypeDef extends ICdmObjectDef
{
    getExtendsDataTypeRef(): ICdmDataTypeRef;
}

export interface ICdmAttributeDef extends ICdmObjectRef, ICdmReferencesEntities
{
    getExplanation(): string;
    setExplanation(explanation: string): string;
    getName(): string;
    getRelationshipRef(): ICdmRelationshipRef;
    setRelationshipRef(relRef: ICdmRelationshipRef): ICdmRelationshipRef;
    removeTraitDef(resOpt: resolveOptions, ref: ICdmTraitDef);
}

export interface ICdmTypeAttributeDef extends ICdmAttributeDef
{
    getDataTypeRef(): ICdmDataTypeRef;
    setDataTypeRef(dataType: ICdmDataTypeRef): ICdmDataTypeRef;
    attributeContext?: ICdmObjectRef;
    isPrimaryKey: boolean;    
    isReadOnly: boolean;
    isNullable: boolean;
    dataFormat: string;
    sourceName: string;
    sourceOrdering: number;
    displayName: string;
    description: string;
    maximumValue: string;
    minimumValue: string;
    maximumLength: number;
    valueConstrainedToList: boolean;
    defaultValue: any;
}

export interface ICdmAttributeGroupRef extends ICdmObjectRef, ICdmReferencesEntities
{
}

export interface ICdmAttributeGroupDef extends ICdmObjectDef, ICdmReferencesEntities
{
    getMembersAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[];
    addAttributeDef(attDef: ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef): ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef;
    attributeContext?: ICdmObjectRef;
}

export interface ICdmEntityAttributeDef extends ICdmAttributeDef
{
    getEntityRef(): ICdmEntityRef;
    setEntityRef(entRef: ICdmEntityRef): ICdmEntityRef;
}

export interface ICdmConstantEntityDef extends ICdmObjectDef
{
    getEntityShape(): ICdmEntityRef;
    setEntityShape(shape: ICdmEntityRef): ICdmEntityRef;
    getConstantValues(): string[][];
    setConstantValues(values: string[][]): string[][];
    lookupWhere(resOpt: resolveOptions, attReturn: string | number, attSearch: string | number, valueSearch: string): string;
    setWhere(resOpt: resolveOptions, attReturn: string | number, newValue: string, attSearch: string | number, valueSearch: string): string;
}

export interface ICdmEntityRef extends ICdmObjectRef
{
}

export interface ICdmEntityDef extends ICdmObjectDef, ICdmReferencesEntities
{
    getExtendsEntityRef(): ICdmObjectRef;
    setExtendsEntityRef(ref: ICdmObjectRef): ICdmObjectRef;
    getHasAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[];
    addAttributeDef(attDef: ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef): ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef;
    countInheritedAttributes(resOpt: resolveOptions): number;
    getAttributesWithTraits(resOpt: resolveOptions, queryFor: TraitSpec | TraitSpec[]): ResolvedAttributeSet;
    getResolvedEntity(resOpt: resolveOptions) : ResolvedEntity;
    createResolvedEntity(resOpt: resolveOptions, newDocName: string) : ICdmEntityDef;
    attributeContext?: ICdmAttributeContext;
    sourceName: string;
    displayName: string;
    description: string;
    version: string;
    cdmSchemas: string[];
}

export interface ICdmAttributeContext extends ICdmObjectDef
{
    type: cdmAttributeContextType;
    parent?: ICdmObjectRef;
    definition?: ICdmObjectRef;
    getRelativePath(resOpt: resolveOptions): string;
    getContentRefs(): (ICdmObjectRef | ICdmAttributeContext)[];
}

export interface ICdmImport extends ICdmObject
{
    corpusPath: string;
    moniker?: string;
}

export interface ICdmDocumentDef extends ICdmObject
{
    getName(): string;
    setName(name: string): string;
    getSchema(): string;
    getSchemaVersion(): string;
    getDefinitions(): (ICdmTraitDef | ICdmDataTypeDef | ICdmRelationshipDef | ICdmAttributeGroupDef | ICdmEntityDef | ICdmConstantEntityDef)[];
    addDefinition<T>(ofType: cdmObjectType, name: string): T;
    getImports(): ICdmImport[];
    addImport(coprusPath: string, moniker: string): void;
    getObjectFromDocumentPath(path: string): ICdmObject;
    getFolder(): ICdmFolderDef;
    refresh(resOpt: resolveOptions);
}

export interface ICdmFolderDef extends ICdmObject
{
    getName(): string;
    getRelativePath(): string;
    getSubFolders(): ICdmFolderDef[];
    getDocuments(): ICdmDocumentDef[];
    addFolder(name: string): ICdmFolderDef
    addDocument(name: string, content: string): ICdmDocumentDef;
    removeDocument(name: string);
    getSubFolderFromPath(path: string, makeFolder: boolean): ICdmFolderDef;
    getObjectFromFolderPath(path: string): ICdmObject;
}

export interface ICdmCorpusDef extends ICdmFolderDef
{
    MakeObject<T extends ICdmObject>(ofType: cdmObjectType, nameOrRef?: string, simmpleNameRef? : boolean): T;
    MakeRef(ofType: cdmObjectType, refObj: string | ICdmObjectDef, simpleNameRef : boolean): ICdmObjectRef;
    getObjectFromCorpusPath(objectPath: string);
    setResolutionCallback(status: RptCallback, reportAtLevel?: cdmStatusLevel, errorAtLevel?: cdmStatusLevel);
    resolveImports(importResolver: (corpusPath: string) => Promise<[string, string]>): Promise<boolean>;
    addDocumentFromContent(corpusPath: string, content: string): ICdmDocumentDef;
    resolveReferencesAndValidate(stage: cdmValidationStep, stageThrough: cdmValidationStep, resOpt: resolveOptions): Promise<cdmValidationStep>;
    rootPath: string;
    profiler: ICdmProfiler; // internal use
}

export function NewCorpus(rootPath: string) : ICdmCorpusDef {
    return new CorpusImpl(rootPath);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  argument types and callbacks
////////////////////////////////////////////////////////////////////////////////////////////////////

export interface CdmCorpusContext
{
    corpus: ICdmCorpusDef;
}

export interface TraitParamSpec
{
    traitBaseName: string;
    params: {
        paramName: string;
        paramValue: string;
    }[];
}
export type TraitSpec = (string | TraitParamSpec);

export interface TraitApplierCapabilities {
    canAlterDirectives: boolean;
    canCreateContext: boolean;
    canRemove: boolean;
    canAttributeModify: boolean;
    canGroupAdd: boolean;
    canRoundAdd: boolean;
    canAttributeAdd: boolean;
}

export type ArgumentValue = (string | ICdmObject);


export enum cdmStatusLevel
{
    info,
    progress,
    warning,
    error
}
export type RptCallback = (level: cdmStatusLevel, msg: string, path: string) => void;
export type VisitCallback = (iObject: ICdmObject, path: string) => boolean

type CdmCreator<T> = (o: any) => T;

// one of the doXXX steps that an applier may perform
export type applierAction = (onStep: applierContext) => void
export type applierQuery = (onStep: applierContext) => boolean
// a discrete action for an applier to perform upon a trait/attribute/etc.
export interface applierContext
{
    resOpt: resolveOptions
    attCtx?: ICdmAttributeContext;
    resTrait: ResolvedTrait;
    resAttSource: ResolvedAttribute;
    resAttNew?: ResolvedAttribute;
    continue?: boolean;
}

export interface TraitApplier
{
    matchName: string;
    priority: number;
    overridesBase: boolean;

    willAlterDirectives?: (resOpt: resolveOptions, resTrait: ResolvedTrait)=>boolean;
    doAlterDirectives?: (resOpt: resolveOptions, resTrait: ResolvedTrait)=>void;

    willCreateContext?: applierQuery;
    doCreateContext?: applierAction
    willRemove?: applierQuery;
    willAttributeModify?: applierQuery;
    doAttributeModify?: applierAction
    willGroupAdd?: applierQuery;
    doGroupAdd?: applierAction
    willRoundAdd?: applierQuery;
    doRoundAdd?: applierAction
    willAttributeAdd?: applierQuery;
    doAttributeAdd?: applierAction
}

// the description of a new attribute context into which a set of resolved attributes should be placed.
export interface AttributeContextParameters
{
    under: ICdmAttributeContext;
    type: cdmAttributeContextType;
    name?: string;
    regarding? : ICdmObject;
    includeTraits? : boolean;
}

interface callData
{
    calls: number;
    timeTotal: number;
    timeExl: number;
}

export interface ICdmProfiler {
    report();
    on:boolean;
}
class profile implements ICdmProfiler
{
    calls: Map<string, callData> = new Map<string, callData>();
    callStack: Array<string> = new Array<string>();
    on: boolean = false;

    public measure(code: () => any): any
    {
        if (this.on) {
            let stack: string = new Error().stack;
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
            let n = performance.now();
            let retVal = code();
            let elaspsed = performance.now() - n;
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

    public report()
    {
        //let s = new Map([...this.calls.entries()].sort((a, b) => by == 0 ? (b[1].calls - a[1].calls) : (by == 1 ? (b[1].timeTotal - a[1].timeTotal))));
        this.calls.forEach((v, k) =>
        {
            console.log(`${v.calls},${v.timeTotal},${v.timeTotal - v.timeExl},${k}`)
        });
    }

}

let p = new profile();

let visits: Map<string, number>;
function trackVisits(path)
{
    if (!visits)
        visits = new Map<string, number>();
    let cnt = 0;
    if (visits.has(path)) {
        cnt = visits.get(path) + 1;
    }
    visits.set(path, cnt);
    if (path == "Case/hasAttributes/attributesAddedAtThisScope/members/(unspecified)")
        return true;
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

export interface spewCatcher
{
    clear();
    spewLine(spew:string);
}

export class stringSpewCatcher implements spewCatcher
{
    content : string = "";
    segment : string = "";
    public clear()
    {
        this.content = "";
        this.segment = "";
    }
    public spewLine(spew:string)
    {
        this.segment += spew + "\n";
        if (this.segment.length > 1000)
        {
            this.content += this.segment;
            this.segment = "";
        }
    }
    public getContent()
    {
        return this.content + this.segment;
    }
}
export class consoleSpewCatcher implements spewCatcher
{
    public clear()
    {
        console.clear()
    }
    public spewLine(spew:string)
    {
        console.log(spew);
    }
}

export class ParameterCollection
{
    sequence: ICdmParameterDef[];
    lookup: Map<string, ICdmParameterDef>;
    ordinals: Map<ICdmParameterDef, number>;
    constructor(prior: ParameterCollection)
    {
        //let bodyCode = () =>
        {
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
        //return p.measure(bodyCode);
    }

    public add(element: ICdmParameterDef)
    {
        //let bodyCode = () =>
        {
            // if there is already a named parameter that matches, this is trouble
            let name: string = element.getName();
            if (name && this.lookup.has(name))
                throw new Error(`duplicate parameter named '${name}'`)
            if (name)
                this.lookup.set(name, element);

            this.ordinals.set(element, this.sequence.length);
            this.sequence.push(element);
        }
        //return p.measure(bodyCode);
    }
    public resolveParameter(ordinal: number, name: string)
    {
        //let bodyCode = () =>
        {
            if (name) {
                if (this.lookup.has(name))
                    return this.lookup.get(name);
                throw new Error(`there is no parameter named '${name}'`)
            }
            if (ordinal >= this.sequence.length)
                throw new Error(`too many arguments supplied`)
            return this.sequence[ordinal];
        }
        //return p.measure(bodyCode);
    }
    public getParameterIndex(pName: string): number
    {
        //let bodyCode = () =>
        {
            return this.ordinals.get(this.lookup.get(pName));
        }
        //return p.measure(bodyCode);
    }
}

export class ParameterValue
{
    public parameter: ICdmParameterDef;
    public value: ArgumentValue;
    ctx: CdmCorpusContext;
    constructor(ctx: CdmCorpusContext, param: ICdmParameterDef, value: ArgumentValue)
    {
        //let bodyCode = () =>
        {
            this.parameter = param;
            this.value = value;
            this.ctx = ctx;
        }
        //return p.measure(bodyCode);
    }
    public getValueString(resOpt: resolveOptions): string
    {
        //let bodyCode = () =>
        {
            if (typeof(this.value) === "string")
                return this.value;
            let value = this.value as ICdmObject;
            if (value) {
                // if this is a constant table, then expand into an html table
                let def = value.getObjectDef(resOpt);
                if (value.getObjectType() == cdmObjectType.entityRef && def && def.getObjectType() == cdmObjectType.constantEntityDef) {
                    let entShape : ICdmEntityRef = (def as ICdmConstantEntityDef).getEntityShape();
                    let entValues : string[][] = (def as ICdmConstantEntityDef).getConstantValues();
                    if (!entValues && entValues.length == 0)
                        return "";

                    let rows = new Array<object>();
                    let shapeAtts : ResolvedAttributeSet = entShape.getResolvedAttributes(resOpt);

                    for (let r = 0; r < entValues.length; r++) {
                        let rowData : string[] = entValues[r];
                        if (rowData && rowData.length) {
                            let row = {};
                            for (let c = 0; c < rowData.length; c++) {
                                let tvalue : string = rowData[c];
                                row[shapeAtts.set[c].resolvedName] = tvalue;
                            }
                            rows.push(row);
                        }
                    }
                    return JSON.stringify(rows);
                }
                // should be a reference to an object
                let data = value.copyData(resOpt, {stringRefs: false});
                if (typeof(data) === "string")
                    return data;

                return JSON.stringify(data);
            }
            return "";
        }
        //return p.measure(bodyCode);
    }
    public get name(): string
    {
        //let bodyCode = () =>
        {
            return this.parameter.getName();
        }
        //return p.measure(bodyCode);
    }
    public setValue(resOpt: resolveOptions, newValue: ArgumentValue)
    {
        //let bodyCode = () =>
        {
            this.value = ParameterValue.getReplacementValue(resOpt, this.value, newValue, true);
        }
        //return p.measure(bodyCode);
    }
    public static getReplacementValue(resOpt: resolveOptions, oldValue: ArgumentValue, newValue: ArgumentValue, wasSet:boolean): ArgumentValue
    {
        //let bodyCode = () =>
        {
            if (!oldValue)
                return newValue;

            if (!wasSet)
            {
                // must explicitly set a value to override
                // if a new value is not set, then newValue holds nothing or the default.
                // in this case, if there was already a value in this argument then just keep using it.
                return oldValue;
            }

            if (typeof(oldValue) == "string") {
                return newValue;
            }
            let ov = oldValue as ICdmObject;
            let nv = newValue as ICdmObject;
            // replace an old table with a new table? actually just mash them together
            if (ov && ov.getObjectType() == cdmObjectType.entityRef && 
                nv && typeof(nv) != "string" && nv.getObjectType() == cdmObjectType.entityRef) {
                let oldEnt: ICdmConstantEntityDef = ov.getObjectDef(resOpt);
                let newEnt: ICdmConstantEntityDef = nv.getObjectDef(resOpt);

                // check that the entities are the same shape
                if (!newEnt)
                    return ov;
                if (!oldEnt || (oldEnt.getEntityShape().getObjectDef(resOpt) != newEnt.getEntityShape().getObjectDef(resOpt)))
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
                let unionedRows = new Map<string, Array<string>>();
                let l = oldCv.length;
                for (let i = 0; i < l; i++) {
                    let row = oldCv[i];
                    let key = row.reduce((prev, curr)=> (prev?prev:"") + "::" + curr);
                    unionedRows.set(key, row);
                }
                l = newCv.length;
                for (let i = 0; i < l; i++) {
                    let row = newCv[i];
                    let key = row.reduce((prev, curr)=> (prev?prev:"") + "::" + curr);
                    unionedRows.set(key, row);
                }

                if (unionedRows.size == oldCv.length)
                    return nv;

                let allRows = Array.from(unionedRows.values());
                let replacementEnt: ICdmConstantEntityDef = oldEnt.copy(resOpt);
                replacementEnt.setConstantValues(allRows);
                return resOpt.wrtDoc.ctx.corpus.MakeRef(cdmObjectType.entityRef, replacementEnt, false);
            }

            return newValue;
        }
        //return p.measure(bodyCode);
    }
    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string)
    {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent}${this.name}:${this.getValueString(resOpt)}`);
        }
        //return p.measure(bodyCode);
    }

}

export class ParameterValueSet
{
    pc: ParameterCollection;
    values: ArgumentValue[];
    wasSet: boolean[];
    ctx: CdmCorpusContext
    constructor(ctx: CdmCorpusContext, pc: ParameterCollection, values: ArgumentValue[], wasSet:boolean[])
    {
        //let bodyCode = () =>
        {
            this.pc = pc;
            this.values = values;
            this.wasSet = wasSet;
            this.ctx = ctx;
        }
        //return p.measure(bodyCode);
    }
    public get length(): number
    {
        //let bodyCode = () =>
        {
            if (this.pc && this.pc.sequence)
                return this.pc.sequence.length;
            return 0;
        }
        //return p.measure(bodyCode);
    }
    public indexOf(paramDef: ICdmParameterDef): number
    {
        //let bodyCode = () =>
        {
            return this.pc.ordinals.get(paramDef);
        }
        //return p.measure(bodyCode);
    }
    public getParameter(i: number): ICdmParameterDef
    {
        //let bodyCode = () =>
        {
            return this.pc.sequence[i];
        }
        //return p.measure(bodyCode);
    }
    public getValue(i: number): ArgumentValue
    {
        //let bodyCode = () =>
        {
            return this.values[i];
        }
        //return p.measure(bodyCode);
    }
    public getValueString(resOpt: resolveOptions, i: number): string
    {
        //let bodyCode = () =>
        {
            return new ParameterValue(this.ctx, this.pc.sequence[i], this.values[i]).getValueString(resOpt);
        }
        //return p.measure(bodyCode);        
    }
    public getParameterValue(pName: string): ParameterValue
    {
        //let bodyCode = () =>
        {
            let i = this.pc.getParameterIndex(pName);
            return new ParameterValue(this.ctx, this.pc.sequence[i], this.values[i])
        }
        //return p.measure(bodyCode);
    }

    public setParameterValue(resOpt: resolveOptions, pName: string, value: ArgumentValue): void
    {
        //let bodyCode = () =>
        {
            let i = this.pc.getParameterIndex(pName);
            this.values[i] = ParameterValue.getReplacementValue(resOpt, this.values[i], value, true);
        }
        //return p.measure(bodyCode);
    }

    public copy(): ParameterValueSet
    {
        //let bodyCode = () =>
        {
            let copyValues = this.values.slice(0);
            let copyWasSet = this.wasSet.slice(0);
            let copy = new ParameterValueSet(this.ctx, this.pc, copyValues, copyWasSet);
            return copy;
        }
        //return p.measure(bodyCode);
    }

    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string)
    {
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

////////////////////////////////////////////////////////////////////////////////////////////////////
//  resolved traits
////////////////////////////////////////////////////////////////////////////////////////////////////

export class ResolvedTrait
{
    public trait: ICdmTraitDef;
    public parameterValues: ParameterValueSet;
    constructor(trait: ICdmTraitDef, pc: ParameterCollection, values: ArgumentValue[], wasSet: boolean[])
    {
        //let bodyCode = () =>
        {
            if (pc && pc.sequence && pc.sequence.length)
                this.parameterValues = new ParameterValueSet(trait.ctx, pc, values, wasSet);
            this.trait = trait;
        }
        //return p.measure(bodyCode);
    }
    public get traitName(): string
    {
        //let bodyCode = () =>
        {
            return (this.trait as TraitImpl).declaredPath;
        }
        //return p.measure(bodyCode);
    }
    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string)
    {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent}[${this.traitName}]`);
            if (this.parameterValues)
                this.parameterValues.spew(resOpt, to, indent + '-');
        }
        //return p.measure(bodyCode);
    }
    public copy(): ResolvedTrait
    {
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
    public collectTraitNames(resOpt: resolveOptions, into: Set<string>)
    {
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

export class refCounted
{
    public refCnt: number;
    constructor()
    {
        //let bodyCode = () =>
        {
            this.refCnt = 0;
        }
        //return p.measure(bodyCode);
    }
    addRef()
    {
        //let bodyCode = () =>
        {
            this.refCnt++;
        }
        //return p.measure(bodyCode);
    }
    release()
    {
        //let bodyCode = () =>
        {
            this.refCnt--;
        }
        //return p.measure(bodyCode);
    }
}

export class TraitDirectiveSet {
    public set:Set<string>;
    setRemoved:Set<string>;
    sortedTag: string;
    constructor(set?: Set<string>) {
        if (set)
            this.set= new Set<string>(set);
    }
    public copy() : TraitDirectiveSet {
        let result = new TraitDirectiveSet();
        if (this.set)
            result.set = new Set<string>(this.set);
        if (this.setRemoved)
            result.setRemoved = new Set<string>(this.setRemoved);
        result.sortedTag = this.sortedTag;
        return result;
    }
    public has(directive: string): boolean {
        if (this.set)
            return this.set.has(directive);
        return false;
    }
    public add(directive: string) {
        if (!this.set)
            this.set = new Set<string>();
        // once explicitly removed from a set, never put it back.
        if (this.setRemoved && this.setRemoved.has(directive))
            return;
        this.set.add(directive);
        this.sortedTag=undefined;
    }
    public delete(directive:string) {
        if (!this.setRemoved) 
            this.setRemoved = new Set<string>();
        this.setRemoved.add(directive);
        if (this.set) {
            if (this.set.has(directive))
                this.set.delete(directive);
        }
        this.sortedTag=undefined;
    }
    public merge(directives: TraitDirectiveSet) {
        if (directives) {
            if (directives.setRemoved) {
                // copy over the removed list first
                directives.setRemoved.forEach((d)=> {
                    this.delete(d)
                });
            }
            if (directives.set) 
                directives.set.forEach((d)=>this.add(d));
            this.sortedTag=undefined;
        }
    }
    public getTag() : string {
        if (this.sortedTag == undefined) {
            if (this.set && this.set.size) {
                this.sortedTag = "";
                let sorted = Array.from(this.set).sort();
                sorted.forEach(d => {
                    this.sortedTag += "-"+d;
                });
            }
        }

        if (this.sortedTag)
            return this.sortedTag
        return "";
    }
}


export class ResolvedTraitSet
{
    public set: ResolvedTrait[];
    private lookupByTrait: Map<ICdmTraitDef, ResolvedTrait>;
    resOpt: resolveOptions;
    public hasElevated : boolean;
    applierCaps: TraitApplierCapabilities;
 
    constructor(resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            this.resOpt = cdmObject.copyResolveOptions(resOpt);
            this.set = new Array<ResolvedTrait>();
            this.lookupByTrait = new Map<ICdmTraitDef, ResolvedTrait>();
            this.hasElevated = false;
        }
        //return p.measure(bodyCode);
    }

    measureAppliers(trait: ICdmTraitDef)
    {
        //let bodyCode = () =>
        {
            let newAppliers = trait.getTraitAppliers();
            if (newAppliers) {
                if (!this.applierCaps)
                    this.applierCaps = {canAlterDirectives:false, canAttributeAdd:false, canRemove:false, canAttributeModify:false, canCreateContext:false, canGroupAdd:false, canRoundAdd:false};
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
    copyApplierCapabilities(caps: TraitApplierCapabilities) 
    {
        //let bodyCode = () =>
        {
            this.applierCaps = {canAlterDirectives:caps.canAlterDirectives, canAttributeAdd:caps.canAttributeAdd, canRemove:caps.canRemove, 
                canAttributeModify:caps.canAttributeModify, canCreateContext:caps.canCreateContext, 
                canGroupAdd:caps.canGroupAdd, canRoundAdd:caps.canRoundAdd};
        }
        //return p.measure(bodyCode);
    }

    public merge(toMerge: ResolvedTrait, copyOnWrite:boolean): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            let traitSetResult: ResolvedTraitSet = this;
            let trait: ICdmTraitDef = toMerge.trait;
            let av: ArgumentValue[];
            let wasSet: boolean[];
            if (toMerge.parameterValues) {
                av = toMerge.parameterValues.values;
                wasSet = toMerge.parameterValues.wasSet;
            }

            if (!this.hasElevated)
                this.hasElevated = trait.elevated;
            this.measureAppliers(trait);
            if (traitSetResult.lookupByTrait.has(trait)) {
                let rtOld = traitSetResult.lookupByTrait.get(trait);
                let avOld : ArgumentValue[];
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

    public mergeSet(toMerge: ResolvedTraitSet, elevatedOnly=false): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            let copyOnWrite:boolean = true;
            let traitSetResult: ResolvedTraitSet = this;
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

    public get(trait: ICdmTraitDef): ResolvedTrait
    {
        //let bodyCode = () =>
        {
            if (this.lookupByTrait.has(trait))
                return this.lookupByTrait.get(trait);
            return null;
        }
        //return p.measure(bodyCode);
    }

    public find(resOpt: resolveOptions, traitName: string): ResolvedTrait
    {
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

    public get size(): number
    {
        //let bodyCode = () =>
        {
            if (this.set)
                return this.set.length;
            return 0;
        }
        //return p.measure(bodyCode);
    }
    public get first(): ResolvedTrait
    {
        //let bodyCode = () =>
        {
            if (this.set)
                return this.set[0];
            return null;

        }
        //return p.measure(bodyCode);
    }
    public deepCopy(): ResolvedTraitSet
    {
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
    public shallowCopyWithException(just: ICdmTraitDef): ResolvedTraitSet
    {
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
    public shallowCopy(): ResolvedTraitSet
    {
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

    public collectTraitNames(): Set<string>
    {
        //let bodyCode = () =>
        {
            let collection = new Set<string>();
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

    public setParameterValueFromArgument(trait: ICdmTraitDef, arg: ICdmArgumentDef)
    {
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

    public setTraitParameterValue(resOpt: resolveOptions, toTrait: ICdmTraitDef, paramName: string, value: ArgumentValue): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            let altered: ResolvedTraitSet = this.shallowCopyWithException(toTrait);
            altered.get(toTrait).parameterValues.setParameterValue(this.resOpt, paramName, value);
            return altered;
        }
        //return p.measure(bodyCode);
    }
    public replaceTraitParameterValue(resOpt: resolveOptions, toTrait: string, paramName: string, valueWhen: ArgumentValue, valueNew: ArgumentValue): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            let traitSetResult = this as ResolvedTraitSet;
            let l = traitSetResult.set.length;
            for (let i = 0; i < l; i++) {
                let rt = traitSetResult.set[i];
                if (rt.trait.isDerivedFrom(this.resOpt, toTrait))
                {
                    if (rt.parameterValues) {
                        let pc: ParameterCollection = rt.parameterValues.pc;
                        let av: ArgumentValue[] = rt.parameterValues.values;
                        let idx = pc.getParameterIndex(paramName);
                        if (idx != undefined)
                        {
                            if (av[idx] === valueWhen)
                            {
                                // copy the set and make a deep copy of the trait being set
                                traitSetResult = this.shallowCopyWithException(rt.trait);
                                // assume these are all still true for this copy
                                rt = traitSetResult.set[i];
                                av = rt.parameterValues.values;
                                av[idx] = ParameterValue.getReplacementValue(this.resOpt, av[idx], valueNew, true)
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

    public collectDirectives(directives: TraitDirectiveSet) {
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
          
    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string, nameSort : boolean)
    {
        //let bodyCode = () =>
        {
            let l = this.set.length;
            let list = this.set;
            if (nameSort)
                list = list.sort((l, r) => l.traitName.localeCompare(r.traitName))
            for (let i = 0; i < l; i++) {
                // comment this line to simplify spew results to stop at attribute names
                list[i].spew(resOpt, to, indent);
            };
        }
        //return p.measure(bodyCode);
    }
}

export class ResolvedTraitSetBuilder
{
    public rts: ResolvedTraitSet;
    //resOpt: resolveOptions;

    public clear()
    {
        //let bodyCode = () =>
        {
            this.rts = null;
        }
        //return p.measure(bodyCode);
    }
    public mergeTraits(rtsNew: ResolvedTraitSet)
    {
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
    public takeReference(rtsNew: ResolvedTraitSet)
    {
        //let bodyCode = () =>
        {
            this.rts = rtsNew;
        }
        //return p.measure(bodyCode);
    }

    public ownOne(rt: ResolvedTrait, resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            this.rts = new ResolvedTraitSet(resOpt);
            this.rts.merge(rt, false);
        }
        //return p.measure(bodyCode);
    }

    public setTraitParameterValue(resOpt: resolveOptions, toTrait: ICdmTraitDef, paramName: string, value: ArgumentValue)
    {
        //let bodyCode = () =>
        {
            this.rts = this.rts.setTraitParameterValue(resOpt, toTrait, paramName, value);
        }
        //return p.measure(bodyCode);
    }
    public replaceTraitParameterValue(resOpt: resolveOptions, toTrait: string, paramName: string, valueWhen: ArgumentValue, valueNew: ArgumentValue)
    {
        //let bodyCode = () =>
        {
            if (this.rts)
                this.rts = this.rts.replaceTraitParameterValue(resOpt, toTrait, paramName, valueWhen, valueNew);
        }
        //return p.measure(bodyCode);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  resolved attributes
////////////////////////////////////////////////////////////////////////////////////////////////////

export type ResolutionTarget = (ICdmAttributeDef | ResolvedAttributeSet);

export class ResolvedAttribute
{
    private t2pm: traitToPropertyMap;
    public target: ResolutionTarget;
    public resolvedName: string;
    public resolvedTraits: ResolvedTraitSet;
    public insertOrder: number;
    public createdContextId : number;
    public applierState?: any;

    constructor(resOpt: resolveOptions, target: ResolutionTarget, defaultName: string, createdContextId : number)
    {
        //let bodyCode = () =>
        {
            this.target = target;
            this.resolvedTraits = new ResolvedTraitSet(resOpt);
            this.resolvedName = defaultName;
            this.createdContextId = createdContextId;
        }
        //return p.measure(bodyCode);
    }
    public copy(): ResolvedAttribute
    {
        //let bodyCode = () =>
        {
            let resOpt: resolveOptions = this.resolvedTraits.resOpt; // use the options from the traits
            let copy = new ResolvedAttribute(resOpt, this.target, this.resolvedName, this.createdContextId);
            copy.resolvedTraits = this.resolvedTraits.shallowCopy();
            copy.insertOrder = this.insertOrder;
            if (this.applierState) {
                copy.applierState ={};
                Object.assign(copy.applierState, this.applierState);
            }
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string, nameSort : boolean)
    {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent}[${this.resolvedName}]`);
            this.resolvedTraits.spew(resOpt, to, indent + '-', nameSort);
        }
        //return p.measure(bodyCode);
    }

    public get isPrimaryKey(): boolean {
        return this.getTraitToPropertyMap().getPropertyValue("isPrimaryKey");
    }
    public get isReadOnly(): boolean {
        return this.getTraitToPropertyMap().getPropertyValue("isReadOnly");
    }
    public get isNullable(): boolean {
        return this.getTraitToPropertyMap().getPropertyValue("isNullable");
    }
    public get dataFormat(): string {
        return this.getTraitToPropertyMap().getPropertyValue("dataFormat");
    }
    public get sourceName(): string {
        return this.getTraitToPropertyMap().getPropertyValue("sourceName");
    }
    public get sourceOrdering(): number {
        return this.getTraitToPropertyMap().getPropertyValue("sourceOrdering");
    }
    public get displayName(): string {
        return this.getTraitToPropertyMap().getPropertyValue("displayName");
    }
    public get description(): string {
        return this.getTraitToPropertyMap().getPropertyValue("description");
    }
    public get maximumValue(): string {
        return this.getTraitToPropertyMap().getPropertyValue("maximumValue");
    }
    public get minimumValue(): string {
        return this.getTraitToPropertyMap().getPropertyValue("minimumValue");
    }
    public get maximumLength(): number {
        return this.getTraitToPropertyMap().getPropertyValue("maximumLength");
    }
    public get valueConstrainedToList(): boolean {
        return this.getTraitToPropertyMap().getPropertyValue("valueConstrainedToList");
    }
    public get defaultValue(): any {
        return this.getTraitToPropertyMap().getPropertyValue("defaultValue");
    }    
    public get creationSequence(): number {
        return this.insertOrder;
    }

    private getTraitToPropertyMap()
    {
        if (this.t2pm)
            return this.t2pm;
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForResolvedAttribute((this.target as ICdmObject).ctx, this.resolvedTraits);
        return this.t2pm;
    }    
}

export class ResolvedAttributeSet extends refCounted
{
    resolvedName2resolvedAttribute: Map<string, ResolvedAttribute>;
    baseTrait2Attributes: Map<string, Set<ResolvedAttribute>>;
    set: Array<ResolvedAttribute>;
    public insertOrder:number;

    constructor()
    {
        super();
        //let bodyCode = () =>
        {
            this.resolvedName2resolvedAttribute = new Map<string, ResolvedAttribute>();
            this.set = new Array<ResolvedAttribute>();
        }
        //return p.measure(bodyCode);
    }
    public merge(toMerge: ResolvedAttribute): ResolvedAttributeSet
    {
        //let bodyCode = () =>
        {
            let rasResult: ResolvedAttributeSet = this;
            if (toMerge) {
                if (rasResult.resolvedName2resolvedAttribute.has(toMerge.resolvedName)) {
                    let existing: ResolvedAttribute = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                    if (this.refCnt > 1 && existing.target !== toMerge.target) {
                        rasResult = rasResult.copy(); // copy on write
                        existing = rasResult.resolvedName2resolvedAttribute.get(toMerge.resolvedName);
                    }
                    existing.target = toMerge.target; // replace with newest version

                    let rtsMerge = existing.resolvedTraits.mergeSet(toMerge.resolvedTraits) // newest one may replace
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
    public mergeSet(toMerge: ResolvedAttributeSet): ResolvedAttributeSet
    {
        //let bodyCode = () =>
        {
            let rasResult: ResolvedAttributeSet = this;
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
    public applyTraits(traits: ResolvedTraitSet, actions: Array<traitAction>): ResolvedAttributeSet
    {
        //let bodyCode = () =>
        {
            let rasResult: ResolvedAttributeSet = this;
            let rasApplied: ResolvedAttributeSet;

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

    copyNeeded(traits: ResolvedTraitSet, actions: Array<traitAction>): boolean
    {
        //let bodyCode = () =>
        {
            if (!actions || actions.length == 0)
                return false;

            // for every attribute in the set, detect if a merge of traits will alter the traits. if so, need to copy the attribute set to avoid overwrite 
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const resAtt = this.set[i];
                for (const traitAction of actions) {
                    let ctx: applierContext = {resOpt:traits.resOpt, resAttSource:resAtt, resTrait:traitAction.rt};
                    if (traitAction.applier.willAttributeModify(ctx))
                        return true;
                }
            }
            return false;
        }
        //return p.measure(bodyCode);
    }

    apply(traits: ResolvedTraitSet, actions: Array<traitAction>): ResolvedAttributeSet
    {
        //let bodyCode = () =>
        {
            if (!traits && actions.length == 0) {
                // nothing can change
                return this;
            }
            // for every attribute in the set run any attribute appliers
            let appliedAttSet: ResolvedAttributeSet = new ResolvedAttributeSet();
            let l = this.set.length;
            for (let i = 0; i < l; i++) {
                const resAtt = this.set[i];
                let subSet = resAtt.target as ResolvedAttributeSet;
                if (subSet.set) {
                    // the set contains another set. process those
                    resAtt.target = subSet.apply(traits, actions);
                }
                else {
                    let rtsMerge = resAtt.resolvedTraits.mergeSet(traits);
                    resAtt.resolvedTraits = rtsMerge;

                    if (actions) {
                        for (const traitAction of actions) {
                            let ctx: applierContext = {resOpt:traits.resOpt, resAttSource:resAtt, resTrait:traitAction.rt};
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

    public removeRequestedAtts(marker : [number, number]): ResolvedAttributeSet
    {
        //let bodyCode = () =>
        {
            // the marker tracks the track the deletes 'under' a certain index
            let countIndex = marker["0"];
            let markIndex = marker["1"];

            // for every attribute in the set run any attribute removers on the traits they have
            let appliedAttSet: ResolvedAttributeSet;
            let l = this.set.length;
            for (let iAtt = 0; iAtt < l; iAtt++) {
                let resAtt = this.set[iAtt];
                // possible for another set to be in this set
                let subSet = resAtt.target as ResolvedAttributeSet;
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
                        countIndex --
                    }
                }
                else {
                    if (resAtt.resolvedTraits && resAtt.resolvedTraits.applierCaps && resAtt.resolvedTraits.applierCaps.canRemove) {
                        let l = resAtt.resolvedTraits.size;
                        for (let i = 0; resAtt && i < l; i++) {
                            const rt = resAtt.resolvedTraits.set[i];
                            if (resAtt && rt.trait.modifiesAttributes) {
                                let ctx:applierContext = {resOpt:resAtt.resolvedTraits.resOpt, resAttSource:resAtt, resTrait:rt};
                                let traitAppliers = rt.trait.getTraitAppliers();
                                if (traitAppliers) {
                                    let l = traitAppliers.length;
                                    for (let ita = 0; ita < l; ita++) {
                                        const apl = traitAppliers[ita];
                                        if (resAtt && apl.willRemove) {
                                            if (apl.willRemove(ctx)){
                                                // this makes all the loops stop
                                                resAtt = null
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
                        markIndex --;
                }
            }

            marker["0"] = countIndex;
            marker["1"] = markIndex;

            // now we are that (or a copy)
            let rasResult: ResolvedAttributeSet = this;
            if (appliedAttSet && appliedAttSet.size != rasResult.size) {
                rasResult = appliedAttSet;
                rasResult.baseTrait2Attributes = null;
            }

            return rasResult;
        }
        //return p.measure(bodyCode);
    }

    getAttributesWithTraits(resOpt: resolveOptions, queryFor: TraitSpec | TraitSpec[]): ResolvedAttributeSet
    {
        //let bodyCode = () =>
        {
            // put the input into a standard form
            let query = new Array<TraitParamSpec>();
            if (queryFor instanceof Array) {
                let l = queryFor.length;
                for (let i = 0; i < l; i++) {
                    let q = queryFor[i];
                    if (typeof (q) === "string")
                        query.push({ traitBaseName: q, params: [] })
                    else
                        query.push(q);
                }
            }
            else {
                if (typeof (queryFor) === "string")
                    query.push({ traitBaseName: queryFor, params: [] })
                else
                    query.push(queryFor);
            }

            // if the map isn't in place, make one now. assumption is that this is called as part of a usage pattern where it will get called again.
            if (!this.baseTrait2Attributes) {
                this.baseTrait2Attributes = new Map<string, Set<ResolvedAttribute>>();
                let l = this.set.length;
                for (let i = 0; i < l; i++) {
                    // create a map from the name of every trait found in this whole set of attributes to the attributes that have the trait (included base classes of traits)
                    const resAtt = this.set[i];
                    let traitNames = resAtt.resolvedTraits.collectTraitNames();
                    traitNames.forEach(tName =>
                    {
                        if (!this.baseTrait2Attributes.has(tName))
                            this.baseTrait2Attributes.set(tName, new Set<ResolvedAttribute>());
                        this.baseTrait2Attributes.get(tName).add(resAtt);
                    });
                }
            }
            // for every trait in the query, get the set of attributes.
            // intersect these sets to get the final answer
            let finalSet: Set<ResolvedAttribute>;
            let lQuery = query.length;
            for (let i = 0; i < lQuery; i++) {
                const q = query[i];
                if (this.baseTrait2Attributes.has(q.traitBaseName)) {
                    let subSet = this.baseTrait2Attributes.get(q.traitBaseName);
                    if (q.params && q.params.length) {
                        // need to check param values, so copy the subset to something we can modify 
                        let filteredSubSet = new Set<ResolvedAttribute>();
                        subSet.forEach(ra =>
                        {
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
                            let intersection = new Set<ResolvedAttribute>();
                            // intersect the two
                            finalSet.forEach(ra =>
                            {
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
                finalSet.forEach(ra =>
                {
                    rasResult.merge(ra);
                });
                return rasResult;
            }

            return null;

        }
        //return p.measure(bodyCode);
    }


    public get(name: string): ResolvedAttribute
    {
        //let bodyCode = () =>
        {
            let raFound = this.resolvedName2resolvedAttribute.get(name);
            if (raFound)
                return raFound;

            if (this.set && this.set.length) {
                // deeper look. first see if there are any groups held in this group
                for (const ra of this.set) {
                    if ((ra.target as ResolvedAttributeSet).set) {
                        raFound = (ra.target as ResolvedAttributeSet).get(name);
                        if (raFound)
                            return raFound;
                    }
                }
                // nothing found that way, so now look through the attribute definitions for a match
                for (const ra of this.set) {
                    let attLook = ra.target as ICdmAttributeDef;
                    if (attLook.getName && attLook.getName() === name) {
                        return ra;
                    }
                }
            }
            return null;
        }
        //return p.measure(bodyCode);
    }
    public get size(): number
    {
        return this.resolvedName2resolvedAttribute.size;
    }
    public copy(): ResolvedAttributeSet
    {
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
    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string, nameSort : boolean)
    {
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

// to hold the capability specific applier actions for the set of traits
export interface traitAction {
    rt: ResolvedTrait;
    applier: TraitApplier;
}

export class ResolvedAttributeSetBuilder
{
    public ras: ResolvedAttributeSet;
    public inheritedMark: number;
    attributeContext : ICdmAttributeContext;

    actionsModify: Array<traitAction>;
    actionsGroupAdd: Array<traitAction>;
    actionsRoundAdd: Array<traitAction>;
    actionsAttributeAdd: Array<traitAction>;
    traitsToApply: ResolvedTraitSet;

    constructor () {
    }

    public setAttributeContext(under : ICdmAttributeContext) {
        this.attributeContext = under;
    }

    public createAttributeContext(resOpt: resolveOptions, acp: AttributeContextParameters) : ICdmAttributeContext {
        //let bodyCode = () =>
        {
            if (!acp)
                return undefined;

            this.attributeContext = AttributeContextImpl.createChildUnder(resOpt, acp);
            return this.attributeContext;
        }
        //return p.measure(bodyCode);
    }

    public mergeAttributes(rasNew: ResolvedAttributeSet)
    {
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

    public takeReference(rasNew: ResolvedAttributeSet)
    {
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
    public giveReference() : ResolvedAttributeSet
    {
        let rasRef = this.ras;
        if (this.ras)
        {
            this.ras.release();
            if (this.ras.refCnt == 0)
                this.ras = null;
        }
        return rasRef;
    }

    public ownOne(ra: ResolvedAttribute)
    {
        //let bodyCode = () =>
        {
            this.takeReference(new ResolvedAttributeSet());
            this.ras.merge(ra);
        }
        //return p.measure(bodyCode);
    }

    public prepareForTraitApplication(traits: ResolvedTraitSet)
    {
        //let bodyCode = () =>
        {    
            // collect a set of appliers for all traits
            this.traitsToApply = traits;
            if (traits && traits.applierCaps) {
                this.actionsModify= new Array<traitAction>();
                this.actionsGroupAdd= new Array<traitAction>();
                this.actionsRoundAdd= new Array<traitAction>();
                this.actionsAttributeAdd= new Array<traitAction>();

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
                                let action: traitAction;
                                if (apl.willAttributeModify && apl.doAttributeModify) {
                                    action = {rt:rt, applier: apl};
                                    this.actionsModify.push(action);
                                }
                                if (apl.willAttributeAdd && apl.doAttributeAdd) {
                                    action = {rt:rt, applier: apl};
                                    this.actionsAttributeAdd.push(action);
                                }
                                if (apl.willGroupAdd && apl.doGroupAdd) {
                                    action = {rt:rt, applier: apl};
                                    this.actionsGroupAdd.push(action);
                                }
                                if (apl.willRoundAdd && apl.doRoundAdd) {
                                    action = {rt:rt, applier: apl};
                                    this.actionsRoundAdd.push(action);
                                }
                            }
                        }
                    }
                }
                // sorted by priority
                this.actionsModify = this.actionsModify.sort((l: traitAction, r: traitAction) => l.applier.priority - r.applier.priority);
                this.actionsGroupAdd = this.actionsGroupAdd.sort((l: traitAction, r: traitAction) => l.applier.priority - r.applier.priority);
                this.actionsRoundAdd = this.actionsRoundAdd.sort((l: traitAction, r: traitAction) => l.applier.priority - r.applier.priority);
                this.actionsAttributeAdd = this.actionsAttributeAdd.sort((l: traitAction, r: traitAction) => l.applier.priority - r.applier.priority);
            }
        }
        //return p.measure(bodyCode);
    }

    private getTraitGeneratedAttributes(clearState: boolean, applyModifiers): ResolvedAttribute[]
    {
        //let bodyCode = () =>
        {
            if (!this.ras || !this.ras.set)
                return undefined;

            if (!this.traitsToApply || !this.traitsToApply.applierCaps)
                return undefined;
            let caps = this.traitsToApply.applierCaps;

            if (!(caps.canAttributeAdd || caps.canGroupAdd || caps.canRoundAdd))
                return undefined;

            let resAttOut = new Array<ResolvedAttribute>();

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

            let makeResolvedAttribute = (resAttSource: ResolvedAttribute, action: traitAction, queryAdd: applierQuery, doAdd: applierAction) : applierContext => {
                let appCtx: applierContext = {resOpt:this.traitsToApply.resOpt, attCtx:this.attributeContext, resAttSource: resAttSource, resTrait:action.rt};
                
                if (resAttSource && resAttSource.target && (resAttSource.target as ResolvedAttributeSet).set)
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
            }
    
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
            let resAttsLastRound = new Array<ResolvedAttribute>();
            if (caps.canRoundAdd) {
                for (const action of this.actionsRoundAdd) {
                    let appCtx = makeResolvedAttribute(undefined, action, action.applier.willRoundAdd, action.applier.doRoundAdd);
                    // save it
                    if (appCtx && appCtx.resAttNew) {
                        // overall list
                        resAttOut.push(appCtx.resAttNew);
                        // previous list
                        resAttsLastRound.push(appCtx.resAttNew)
                    }
                }
            }

            // the first per-round set of attributes is the set owned by this object
            resAttsLastRound=resAttsLastRound.concat(this.ras.set);

            // now loop over all of the previous atts until they all say 'stop'
            if (resAttsLastRound.length) {
                let continues = 0;
                do {
                    continues = 0;
                    let resAttThisRound = new Array<ResolvedAttribute>();
                    if (caps.canAttributeAdd) {
                        for(let iAtt = 0; iAtt < resAttsLastRound.length; iAtt++) {
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

    public applyTraits()
    {
        //let bodyCode = () =>
        {
            if (this.ras && this.traitsToApply)
                this.takeReference(this.ras.applyTraits(this.traitsToApply, this.actionsModify));
        }
        //return p.measure(bodyCode);
    }

    public generateTraitAttributes(applyTraitsToNew: boolean)
    {
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
                for (let i=0; i < l; i++) {
                    ras = ras.merge(newAtts[i]);
                }
                this.takeReference(ras);
            }
        }
        //return p.measure(bodyCode);
    }
    public removeRequestedAtts()
    {
        //let bodyCode = () =>
        {
            if (this.ras) {
                let marker : [number, number] = [0,0];
                marker["1"] = this.inheritedMark;
                this.takeReference(this.ras.removeRequestedAtts(marker));
                this.inheritedMark = marker["1"];
            }
        }
        //return p.measure(bodyCode);
    }
    public markInherited()
    {
        //let bodyCode = () =>
        {
            if (this.ras && this.ras.set) {
                this.inheritedMark = this.ras.set.length;

                let countSet = (rasSub: ResolvedAttributeSet, offset: number):number => {
                    let last = offset;
                    if (rasSub && rasSub.set) {
                        for (let i=0; i < rasSub.set.length; i++) {
                            if ((rasSub.set[i].target as ResolvedAttributeSet).set) {
                                last = countSet((rasSub.set[i].target as ResolvedAttributeSet), last);
                            }
                            else
                                last ++;
                        }
                    }
                    return last;
                }
                this.inheritedMark = countSet(this.ras, 0);
            }
            else
                this.inheritedMark = 0;
        }
        //return p.measure(bodyCode);
    }
    public markOrder()
    {
        //let bodyCode = () =>
        {
            let markSet = (rasSub: ResolvedAttributeSet, inheritedMark: number, offset: number):number => {
                let last = offset;
                if (rasSub && rasSub.set) {
                    rasSub.insertOrder = last;
                    for (let i=0; i < rasSub.set.length; i++) {
                        if ((rasSub.set[i].target as ResolvedAttributeSet).set) {
                            last = markSet((rasSub.set[i].target as ResolvedAttributeSet), inheritedMark, last);
                        }
                        else {
                            if (last >= inheritedMark)
                                rasSub.set[i].insertOrder = last;
                            last ++;
                        }
                    }
                }
                return last;
            }
            markSet(this.ras, this.inheritedMark, 0);

        }
        //return p.measure(bodyCode);
    }

}

export class ResolvedEntityReferenceSide
{
    public entity: ICdmEntityDef;
    public rasb: ResolvedAttributeSetBuilder;

    constructor(entity?: ICdmEntityDef, rasb?: ResolvedAttributeSetBuilder)
    {
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
    public getFirstAttribute(): ResolvedAttribute
    {
        //let bodyCode = () =>
        {
            if (this.rasb && this.rasb.ras && this.rasb.ras.set && this.rasb.ras.set.length)
                return this.rasb.ras.set[0];
        }
        //return p.measure(bodyCode);
    }
    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string, nameSort : boolean)
    {
        //let bodyCode = () =>
        {
            to.spewLine(`${indent} ent=${this.entity.getName()}`);
            if (this.rasb && this.rasb.ras)
                this.rasb.ras.spew(resOpt, to, indent + '  atts:', nameSort);
        }
        //return p.measure(bodyCode);
    }

}

export class ResolvedEntityReference
{
    public referencing: ResolvedEntityReferenceSide;
    public referenced: ResolvedEntityReferenceSide[];

    constructor()
    {
        //let bodyCode = () =>
        {
            this.referencing = new ResolvedEntityReferenceSide();
            this.referenced = new Array<ResolvedEntityReferenceSide>();
        }
        //return p.measure(bodyCode);
    }
    public copy(): ResolvedEntityReference
    {
        //let bodyCode = () =>
        {
            let result = new ResolvedEntityReference();
            result.referencing.entity = this.referencing.entity;
            result.referencing.rasb = this.referencing.rasb;
            this.referenced.forEach(rers =>
            {
                result.referenced.push(new ResolvedEntityReferenceSide(rers.entity, rers.rasb));
            });
            return result;
        }
        //return p.measure(bodyCode);
    }

    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string, nameSort : boolean)
    {
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

export class ResolvedEntity 
{
    private t2pm: traitToPropertyMap;
    public entity : ICdmEntityDef;
    public resolvedName : string;
    public resolvedTraits : ResolvedTraitSet;
    public resolvedAttributes : ResolvedAttributeSet;
    public resolvedEntityReferences : ResolvedEntityReferenceSet;
    constructor(resOpt: resolveOptions, entDef : ICdmEntityDef) {
        this.entity = entDef;
        this.resolvedName = this.entity.getName();
        this.resolvedTraits = this.entity.getResolvedTraits(resOpt);
        this.resolvedAttributes = this.entity.getResolvedAttributes(resOpt);
        this.resolvedEntityReferences = this.entity.getResolvedEntityReferences(resOpt);
    }
    public get sourceName() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("sourceName");
    }
    public get description() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("description");
    }
    public get displayName() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("displayName");
    }
    public get version() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("version");
    }
    public get cdmSchemas() : string[]
    {
        return this.getTraitToPropertyMap().getPropertyValue("cdmSchemas");
    }

    private getTraitToPropertyMap()
    {
        if (this.t2pm)
            return this.t2pm;
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForResolvedEntity(this.entity.ctx, this.resolvedTraits);
        return this.t2pm;
    }

    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string, nameSort : boolean)
    {
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

export class ResolvedEntityReferenceSet
{
    set: Array<ResolvedEntityReference>;
    resOpt: resolveOptions; 
    constructor(resOpt: resolveOptions, set: Array<ResolvedEntityReference> = undefined)
    {
        //let bodyCode = () =>
        {
            this.resOpt = resOpt;
            if (set) {
                this.set = set;
            }
            else
                this.set = new Array<ResolvedEntityReference>();
        }
        //return p.measure(bodyCode);
    }
    public add(toAdd: ResolvedEntityReferenceSet)
    {
        //let bodyCode = () =>
        {
            if (toAdd && toAdd.set && toAdd.set.length) {
                this.set = this.set.concat(toAdd.set);
            }
        }
        //return p.measure(bodyCode);
    }
    public copy(): ResolvedEntityReferenceSet
    {
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
    public findEntity(entOther: ICdmEntityDef): ResolvedEntityReferenceSet
    {
        //let bodyCode = () =>
        {
            // make an array of just the refs that include the requested
            let filter = this.set.filter((rer: ResolvedEntityReference): boolean =>
            {
                return (rer.referenced.some((rers: ResolvedEntityReferenceSide): boolean =>
                {
                    if (rers.entity === entOther)
                        return true;
                }));
            })

            if (filter.length == 0)
                return null;
            return new ResolvedEntityReferenceSet(this.resOpt, filter);
        }
        //return p.measure(bodyCode);
    }

    public spew(resOpt: resolveOptions, to:spewCatcher, indent: string, nameSort : boolean)
    {
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

////////////////////////////////////////////////////////////////////////////////////////////////////
//  attribute and entity traits that are represented as properties
////////////////////////////////////////////////////////////////////////////////////////////////////

// this entire class is gross. it is a different abstraction level than all of the rest of this om.
// however, it does make it easier to work with the consumption object model so ... i will hold my nose.
class traitToPropertyMap
{

    hostEnt: ICdmEntityDef;
    hostAtt: ICdmTypeAttributeDef;
    traits: (ResolvedTrait | ICdmTraitRef)[];
    hostRtsEnt: ResolvedTraitSet;
    hostRtsAtt: ResolvedTraitSet;
    ctx: CdmCorpusContext;

    public initForEntityDef(ctx: CdmCorpusContext, persistedObject: Entity, host: ICdmObject)
    {
        //let bodyCode = () =>
        {
            this.ctx = ctx;
            this.hostEnt = host as ICdmEntityDef;
            this.traits = this.hostEnt.getExhibitedTraitRefs();
            let tr : ICdmTraitRef;
            // turn properties into traits for internal form
            if (persistedObject) {
                if (persistedObject.sourceName) {
                    this.setTraitArgument("is.CDS.sourceNamed", "name", persistedObject.sourceName)
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

    public initForResolvedEntity(ctx: CdmCorpusContext, rtsEnt : ResolvedTraitSet) {
        this.hostRtsEnt = rtsEnt;
        this.traits = rtsEnt.set;
        this.ctx = ctx;
    }

    public initForTypeAttributeDef(ctx: CdmCorpusContext, persistedObject: TypeAttribute, host: ICdmObject)
    {
        //let bodyCode = () =>
        {
            this.ctx = ctx;
            this.hostAtt = host as ICdmTypeAttributeDef;
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

    public initForResolvedAttribute(ctx: CdmCorpusContext, rtsAtt : ResolvedTraitSet) {
        this.hostRtsAtt = rtsAtt;
        this.traits = rtsAtt.set;
        this.ctx = ctx;
    }


    public persistForEntityDef(persistedObject: Entity, options: copyOptions)
    {
        //let bodyCode = () =>
        {
            let removedIndexes = new Array<number>();
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
                            persistedObject.description=this.getLocalizedTraitTable("is.localized.describedAs");
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.description) {
                                let cEnt = this.getTraitTable("is.localized.describedAs", "localizedDisplayText")
                                if (cEnt.getConstantValues().length == 1)
                                    removedIndexes.push(i);
                            }
                            break;
                        case "is.localized.displayedAs":
                            persistedObject.displayName=this.getLocalizedTraitTable("is.localized.displayedAs");
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.displayName) {
                                let cEnt = this.getTraitTable("is.localized.displayedAs", "localizedDisplayText")
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

    public persistForTypeAttributeDef(persistedObject: TypeAttribute, options: copyOptions)
    {
        //let bodyCode = () =>
        {
            let removedIndexes = new Array<number>();
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
                            persistedObject.description=this.getLocalizedTraitTable("is.localized.describedAs");
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.description) {
                                let cEnt = this.getTraitTable("is.localized.describedAs", "localizedDisplayText")
                                if (cEnt.getConstantValues().length == 1)
                                    removedIndexes.push(i);
                            }
                            break;
                        case "is.localized.displayedAs":
                            persistedObject.displayName=this.getLocalizedTraitTable("is.localized.displayedAs");
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.displayName) {
                                let cEnt = this.getTraitTable("is.localized.displayedAs", "localizedDisplayText")
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

    public setPropertyValue(propertyName: string, newValue: any)
    {
        //let bodyCode = () =>
        {
            if (newValue == undefined) {
                if (this.hostAtt)
                    this.hostAtt.removeAppliedTrait(propertyName); // validate a known prop?
                if (this.hostEnt)
                    this.hostEnt.removeExhibitedTrait(propertyName); // validate a known prop?
            }
            else {
                let tr : ICdmTraitRef;
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
    public getPropertyValue(propertyName: string): any
    {
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
                    let attRef : ICdmTypeAttributeDef = getTraitRefArgumentValue(this.getTrait("is.identifiedBy", false), "attribute");
                    if (attRef)
                        return attRef.getObjectDefName();
                    break;
                case "defaultValue":
                    return this.getDefaultValue();
            }
        }
        //return p.measure(bodyCode);
    }


    dataFormatToTraits(dataFormat : string)  {
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

    traitsToDataFormat(removeFrom?: (string | TraitReference)[], removedIndexes?: number[]) : string {
        //let bodyCode = () =>
        {
            let isArray = false;
            let isBig = false;
            let isSmall = false;
            let baseType : string = "Unknown";
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


    getTrait(trait : string | ICdmTraitRef | ResolvedTrait, create = false, simpleRef = false) : ICdmTraitRef {
        let traitName:string;
        if (typeof(trait) === "string") {
            let iTrait :number;
            traitName = trait;
            trait = undefined;
            iTrait = getTraitRefIndex(this.traits as any, traitName);
            if (iTrait != -1) {
                trait = this.traits[iTrait];
            }
        }

        if (!trait && create) {
            if (simpleRef)
                trait = traitName;
            else 
                trait = this.ctx.corpus.MakeObject<ICdmTraitRef>(cdmObjectType.traitRef, traitName);
            if (this.hostAtt)
                trait = this.hostAtt.addAppliedTrait(trait, false);
            if (this.hostEnt)
                trait = this.hostEnt.addExhibitedTrait(trait, false);
        }
        return trait as ICdmTraitRef;
    }

    setTraitArgument(trait : string | ICdmTraitRef, argName : string, value : ArgumentValue) {
        trait = this.getTrait(trait, true, false);
        let args = trait.getArgumentDefs();
        if (!args || !args.length) {
            trait.addArgument(argName, value);
            return;
        }

        for(let iArg = 0; iArg < args.length; iArg++) {
            let arg = args[iArg];
            if (arg.getName() == argName) {
                arg.setValue(value);
                return;
            }
        }
        trait.addArgument(argName, value);
    }

    setTraitTable (trait : string | ICdmTraitRef, argName: string, entityName : string, action: (cEnt:ICdmConstantEntityDef, created : boolean)=>void)  {
        //let bodyCode = () =>
        {
            trait = this.getTrait(trait, true, false);
            if (!trait.getArgumentDefs() || !trait.getArgumentDefs().length) {
                // make the argument nothing but a ref to a constant entity, safe since there is only one param for the trait and it looks cleaner
                let cEnt = this.ctx.corpus.MakeObject<ICdmConstantEntityDef>(cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(this.ctx.corpus.MakeRef(cdmObjectType.entityRef, entityName, true));
                action(cEnt, true);
                trait.addArgument(argName, this.ctx.corpus.MakeRef(cdmObjectType.entityRef, cEnt, false));
            }
            else {
                let locEntRef = getTraitRefArgumentValue(trait as ICdmTraitRef, argName);
                if (locEntRef) {
                    let locEnt = locEntRef.getObjectDef(null, undefined) as ICdmConstantEntityDef;
                    if (locEnt)
                        action(locEnt, false);
                }
            }
        }
        //return p.measure(bodyCode);
    }

    getTraitTable (trait : string | ICdmTraitRef | ResolvedTrait, argName : string) : ICdmConstantEntityDef  {
        //let bodyCode = () =>
        {
            if (!trait) 
                return undefined;
            if (typeof(trait) === "string") {
                let iTrait :number;
                iTrait = getTraitRefIndex(this.traits as any, trait);
                if (iTrait == -1) 
                    return undefined;
                trait = this.traits[iTrait];
            }

            let locEntRef = getTraitRefArgumentValue(trait, argName);
            if (locEntRef) {
                return locEntRef.getObjectDef(null, undefined) as ICdmConstantEntityDef;
            }
        }
        //return p.measure(bodyCode);
    }


    setLocalizedTraitTable (traitName : string, sourceText : string)  {
        //let bodyCode = () =>
        {
            this.setTraitTable(traitName, "localizedDisplayText", "localizedTable", (cEnt : ICdmConstantEntityDef, created : boolean) => {
                if (created)
                    cEnt.setConstantValues([["en", sourceText]]);
                else
                    cEnt.setWhere(undefined, 1, sourceText, 0, "en");  // need to use ordinals because no binding done yet
            });
        }
        //return p.measure(bodyCode);
    }

    getLocalizedTraitTable (trait : string | ICdmTraitRef)  {
        //let bodyCode = () =>
        {
            let cEnt = this.getTraitTable(trait, "localizedDisplayText")
            if (cEnt)
                return cEnt.lookupWhere(undefined, 1, 0, "en"); // need to use ordinals because no binding done yet
        }
        //return p.measure(bodyCode);
    }

    setSingleAttTraitTable(trait : string | ICdmTraitRef, argName : string, entityName : string, sourceText : string[]) {
        this.setTraitTable(trait, argName, entityName, (cEnt : ICdmConstantEntityDef, created : boolean) => {
            // turn array of strings into array of array of strings;
            let vals = new Array<Array<string>>();
            sourceText.forEach(v=>{let r = new Array<string>(); r.push(v); vals.push(r)});
            cEnt.setConstantValues(vals);
        });
    }
    getSingleAttTraitTable(trait : string | ICdmTraitRef, argName : string) : string[]{
        let cEnt = this.getTraitTable(trait, argName)
        if (cEnt) {
            // turn array of arrays into single array of strings
            let result = new Array<string>();
            cEnt.getConstantValues().forEach(v=>{ result.push(v[0])});
            return result;
        }
    }

    getDefaultValue() : any {
        let trait = this.getTrait("does.haveDefault", false);
        if (trait) {
            let defVal = getTraitRefArgumentValue(trait as ICdmTraitRef, "default");
            if (defVal != undefined && defVal != null) {
                if (typeof(defVal) === "string")
                    return defVal;
                if ((defVal as ICdmObject).getObjectType() === cdmObjectType.entityRef) {
                    let cEnt = (defVal as ICdmObject).getObjectDef(undefined) as ICdmConstantEntityDef; // no doc or directives should work ?
                    if (cEnt) {
                        let esName = cEnt.getEntityShape().getObjectDefName();
                        let corr = esName === "listLookupCorrelatedValues";
                        let lookup = esName === "listLookupValues";
                        if (esName === "localizedTable" || lookup || corr) {
                            let result = new Array<object>();
                            let rawValues : string[][] = cEnt.getConstantValues();
                            let l = rawValues.length;
                            for(let i=0; i<l; i++) {
                                let row : object = {};
                                let rawRow : string[] = rawValues[i];
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
                        } else {
                            // an unknown entity shape. only thing to do is serialize the object
                            defVal = (defVal as ICdmObject).copyData(null, undefined);
                        }
                    }
                } else {
                    // is it a cdm object?
                    if (defVal.getObjectType != undefined)
                        defVal = (defVal as ICdmObject).copyData(null, undefined);
                }
            }

            return defVal;
        }
    }

    setDefaultValue(newDefault : any) {
        let trait = this.getTrait("does.haveDefault", true, false);
        if (typeof(newDefault) === "string") {
            newDefault = newDefault;
        }
        else if (newDefault instanceof Array) {
            let a = newDefault as Array<any>;
            let l = a.length;
            if (l && a[0].displayOrder != undefined) {
                // looks like something we understand
                let tab = new Array<Array<string>>();
                let corr = (a[0].correlatedValue != undefined);
                for (let i=0; i<l; i++) {
                    let row = new Array<string>();
                    row.push(a[i].languageTag);
                    row.push(a[i].displayText);
                    row.push(a[i].attributeValue);
                    row.push(a[i].displayOrder);
                    if (corr)
                        row.push(a[i].correlatedValue);
                    tab.push(row);
                }
                let cEnt = this.ctx.corpus.MakeObject<ICdmConstantEntityDef>(cdmObjectType.constantEntityDef);
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

export class friendlyFormatNode
{
    public verticalMode: boolean = false;
    public indentChildren: boolean = true;
    public terminateAfterList: boolean = true;
    public lineWrap: boolean = false;
    public forceWrap: boolean = false;
    public bracketEmpty: boolean = false;
    public starter: string;
    public terminator: string;
    public separator: string;
    public comment: string;
    public leafSource: string;
    public layoutWidth: number = 0;
    public children: friendlyFormatNode[];
    calcStarter: string;
    calcTerminator: string;
    calcPreceedingSeparator: string;
    calcIndentLevel: number;
    calcNLBefore: boolean;
    calcNLAfter: boolean;

    constructor(leafSource?: string)
    {
        this.leafSource = leafSource;
    }
    public addComment(comment: string)
    {
        this.comment = comment;
    }
    public addChild(child: friendlyFormatNode)
    {
        if (!this.children)
            this.children = new Array<friendlyFormatNode>();
        this.children.push(child);
    }

    public addChildString(source: string, quotes: boolean = false)
    {
        if (source) {
            if (quotes)
                source = `"${source}"`;
            this.addChild(new friendlyFormatNode(source));
        }
    }

    public setDelimiters()
    {
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

    public setWhitespace(indentLevel: number, needsNL: boolean): boolean
    {
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

    public layout(maxWidth: number, maxMargin: number, start: number, indentWidth: number): [number, number]
    {

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
            let wrapTo: number;
            for (let iChild = 0; iChild < lChildren; iChild++) {
                let child = this.children[iChild];
                if (iChild > 0 && (this.forceWrap || (this.lineWrap && position + child.layoutWidth > maxWidth))) {
                    child.calcNLBefore = true;
                    child.calcIndentLevel = Math.floor((wrapTo + indentWidth) / indentWidth)
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

    lineStart(startIndent: number)
    {
        let line = "";
        while (startIndent) {
            line += " ";
            startIndent--;
        }
        return line;
    }

    public compose(indentWidth: number): string
    {

        let compose: string = "";

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

    public toString(maxWidth: number, maxMargin: number, startIndent: number, indentWidth: number)
    {
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

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  common base class
//  {Object}
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

abstract class cdmObject implements ICdmObject
{
    constructor(ctx:CdmCorpusContext) {
        this.ID = CorpusImpl.nextID();
        this.ctx = ctx;
        if (ctx)
            this.docCreatedIn = (ctx as resolveContext).currentDoc;
    }
    public ID : number;
    public abstract copy(resOpt: resolveOptions): ICdmObject
    public abstract getFriendlyFormat(): friendlyFormatNode;
    public abstract validate(): boolean;
    public objectType: cdmObjectType;
    ctx: CdmCorpusContext;
    docCreatedIn: DocumentImpl;

    traitCache: Map<string, ResolvedTraitSetBuilder>;

    declaredPath: string;

    public abstract getObjectType(): cdmObjectType;
    public abstract getObjectDefName(): string;
    public abstract getObjectDef<T=ICdmObjectDef>(resOpt: resolveOptions);
    public abstract createSimpleReference(resOpt: resolveOptions): ICdmObjectRef;

    public get declaredInDocument() : ICdmDocumentDef {
        return this.docCreatedIn as ICdmDocumentDef;
    }

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }
    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }

    public getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            let cacheTagA = ctx.corpus.getDefinitionCacheTag(resOpt, this, "rtsb");

            let rtsbAll: ResolvedTraitSetBuilder;
            if (!this.traitCache)
                this.traitCache = new Map<string, ResolvedTraitSetBuilder>();
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

    resolvingAttributes: boolean = false;
    public getResolvedAttributes(resOpt: resolveOptions, acpInContext? : AttributeContextParameters): ResolvedAttributeSet
    {
        //let bodyCode = () =>
        {
            let ctx=this.ctx as resolveContext; // what it actually is
            let cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, "rasb", acpInContext ? "ctx" : "");
            let rasbCache : ResolvedAttributeSetBuilder = ctx.cache.get(cacheTag);
            let underCtx: AttributeContextImpl;

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
                    let underCtx = rasbCache.attributeContext.copy(resOpt) as AttributeContextImpl;
                    underCtx.setParent(resOpt, acpInContext.under as AttributeContextImpl);
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

    clearTraitCache()
    {
        //let bodyCode = () =>
        {
            this.traitCache = undefined;
        }
        //return p.measure(bodyCode);
    }


    public abstract copyData(resOpt: resolveOptions, options: copyOptions): any;
    public static copyIdentifierRef(identifier : string, resolved : cdmObjectDef, options: copyOptions) : string | identifierRef
    {
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

    public static arraycopyData<T>(resOpt: resolveOptions, source: ICdmObject[], options: copyOptions): Array<T>
    {
        //let bodyCode = () =>
        {
            if (!source)
                return undefined;
            let casted = new Array<T>();
            let l = source.length;
            for (let i = 0; i < l; i++) {
                const element = source[i];
                casted.push(element ? element.copyData(resOpt, options) : undefined);
            }
            return casted;
        }
        //return p.measure(bodyCode);
    }

    public static arrayCopy<T extends ICdmObject>(resOpt: resolveOptions, source: cdmObject[]): Array<T>
    {
        //let bodyCode = () =>
        {
            if (!source)
                return undefined;
            let casted = new Array<T>();
            let l = source.length;
            for (let i = 0; i < l; i++) {
                const element : cdmObject = source[i];
                casted.push(element ? <T>element.copy(resOpt) : undefined);
            }
            return casted;
        }
        //return p.measure(bodyCode);
    }

    public static arrayGetFriendlyFormat(under: friendlyFormatNode, source: cdmObject[])
    {
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

    public static createConstant(ctx: CdmCorpusContext, object: any): ArgumentValue
    {
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
    public static createDataTypeReference(ctx: CdmCorpusContext, object: string | DataTypeReference): DataTypeReferenceImpl
    {
        //let bodyCode = () =>
        {
            if (object)
                return DataTypeReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    public static createRelationshipReference(ctx: CdmCorpusContext, object: string | RelationshipReference): RelationshipReferenceImpl
    {
        //let bodyCode = () =>
        {
            if (object)
                return RelationshipReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    public static createAttributeContext(ctx: CdmCorpusContext, object: AttributeContext): AttributeContextImpl    
    {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeContextImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    public static createAttributeContextReference(ctx: CdmCorpusContext, object: string): AttributeContextReferenceImpl
    {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeContextReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    public static createEntityReference(ctx: CdmCorpusContext, object: string | EntityReference): EntityReferenceImpl
    {
        //let bodyCode = () =>
        {
            if (object)
                return EntityReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    public static createAttributeGroupReference(ctx: CdmCorpusContext, object: string | AttributeGroupReference): AttributeGroupReferenceImpl
    {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeGroupReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }
    public static createAttributeReference(ctx: CdmCorpusContext, object: string): AttributeReferenceImpl
    {
        //let bodyCode = () =>
        {
            if (object)
                return AttributeReferenceImpl.instanceFromData(ctx, object);
            return undefined;
        }
        //return p.measure(bodyCode);
    }

    public static createAttribute(ctx: CdmCorpusContext, object: string | AttributeGroupReference | EntityAttribute | TypeAttribute): (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)
    {
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
    public static createAttributeArray(ctx: CdmCorpusContext, object: (string | AttributeGroupReference | EntityAttribute | TypeAttribute)[]): (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[]
    {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;

            let result: (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[];
            result = new Array<AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>();

            let l = object.length;
            for (let i = 0; i < l; i++) {
                const ea = object[i];
                result.push(cdmObject.createAttribute(ctx, ea));
            }
            return result;
        }
        //return p.measure(bodyCode);
    }

    public static createTraitReferenceArray(ctx: CdmCorpusContext, object: (string | TraitReference)[]): TraitReferenceImpl[]
    {
        //let bodyCode = () =>
        {
            if (!object)
                return undefined;

            let result: TraitReferenceImpl[];
            result = new Array<TraitReferenceImpl>();

            let l = object.length;
            for (let i = 0; i < l; i++) {
                const tr = object[i];
                result.push(TraitReferenceImpl.instanceFromData(ctx, tr));
            }
            return result;
        }
        //return p.measure(bodyCode);
    }

    public abstract visit(path : string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;
    public static visitArray(items: Array<cdmObject>, path : string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
        //let bodyCode = () =>
        {
            let result: boolean = false;
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
    public static resolvedTraitToTraitRef(resOpt: resolveOptions, rt: ResolvedTrait):ICdmTraitRef
    {
        let traitRef : TraitReferenceImpl;
        if (rt.parameterValues && rt.parameterValues.length) {
            traitRef = rt.trait.ctx.corpus.MakeObject(cdmObjectType.traitRef, rt.traitName, false);
            let l = rt.parameterValues.length;
            if (l == 1) {
                // just one argument, use the shortcut syntax
                let val = rt.parameterValues.values[0];
                if (val != undefined && val != null) {
                    if (typeof(val) != "string") {
                        val = (val as ICdmObject).copy(resOpt);
                    }
                    traitRef.addArgument(undefined, val);
                }
            }
            else {
                for (let i = 0; i<l; i++) {
                    let param = rt.parameterValues.getParameter(i);
                    let val = rt.parameterValues.values[i];
                    if (val != undefined && val != null) {
                        if (typeof(val) != "string") {
                            val = (val as ICdmObject).copy(resOpt);
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
            traitRef.explicitReference = rt.trait as TraitImpl;
            traitRef.docCreatedIn = (rt.trait as TraitImpl).docCreatedIn;
        }
        return traitRef;
    }

    public static copyResolveOptions(resOpt: resolveOptions) : resolveOptions {
        let resOptCopy : resolveOptions = {};
        resOptCopy.wrtDoc = resOpt.wrtDoc;
        resOptCopy.relationshipDepth = resOpt.relationshipDepth;
        if (resOpt.directives)
            resOptCopy.directives = resOpt.directives.copy();
        return resOptCopy;
    }

}

// some objects are just to structure other obje
abstract class cdmObjectSimple extends cdmObject {
    public constructor(ctx: CdmCorpusContext) {
        super(ctx);
    }
    public getObjectDefName(): string {
        return undefined;
    }
    public getObjectDef<T=ICdmObjectDef>(resOpt: resolveOptions) {
        return undefined;
    }
    public createSimpleReference(resOpt: resolveOptions): ICdmObjectRef
    {
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

class ImportImpl extends cdmObjectSimple implements ICdmImport
{
    corpusPath: string;
    moniker: string;
    doc: DocumentImpl;

    constructor(ctx:CdmCorpusContext, corpusPath: string, moniker: string)
    {
        super(ctx);
        //let bodyCode = () =>
        {
            this.corpusPath = corpusPath;
            this.moniker = moniker ? moniker : undefined;
            this.objectType = cdmObjectType.import;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.import;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Import
    {
        //let bodyCode = () =>
        {
            let castedToInterface: Import = { moniker: this.moniker, corpusPath: this.corpusPath };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new ImportImpl(this.ctx, this.corpusPath, this.moniker);
            copy.doc = this.doc;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.corpusPath ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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
    public static instanceFromData(ctx: CdmCorpusContext, object: Import): ImportImpl
    {
        //let bodyCode = () =>
        {
            let corpusPath = object.corpusPath;
            if (!corpusPath)
                corpusPath = object.uri;
            let imp: ImportImpl = new ImportImpl(ctx, corpusPath, object.moniker);
            return imp;
        }
        //return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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

class ArgumentImpl extends cdmObjectSimple implements ICdmArgumentDef
{
    explanation: string;
    name: string;
    value: ArgumentValue;
    resolvedParameter: ICdmParameterDef;

    constructor(ctx:CdmCorpusContext)
    {
        super(ctx);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.argumentDef;
        }
        //return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.argumentDef;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Argument | ArgumentValue
    {
        //let bodyCode = () =>
        {
            let val : ArgumentValue;
            if (this.value) {
                if (typeof(this.value) === "string")
                    val = this.value;
                else 
                    val = (<ICdmObject>this.value).copyData(resOpt, options);
            }
            // skip the argument if just a value
            if (!this.name)
                return val as ArgumentValue;

            let castedToInterface: Argument = { explanation: this.explanation, name: this.name, value: val };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new ArgumentImpl(this.ctx);
            copy.name = this.name;
            if (this.value) {
                if (typeof(this.value) === "string")
                    copy.value = this.value;
                else 
                    copy.value = (<ICdmObject>this.value).copy(resOpt);
            }
            copy.resolvedParameter = this.resolvedParameter;
            copy.explanation = this.explanation;
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.value ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
        //let bodyCode = () =>
        {
            let ff = new friendlyFormatNode();
            ff.separator = ": ";
            ff.addChildString(this.name);
            if (this.value) {
                if (typeof(this.value) === "string")
                    ff.addChildString(this.value);
                else 
                    ff.addChild((this.value as ICdmObject).getFriendlyFormat());
            }
            ff.addComment(this.explanation);
            return ff;
        }
        //return p.measure(bodyCode);
    }
    public static instanceFromData(ctx:CdmCorpusContext, object: string | Argument): ArgumentImpl
    {
        //let bodyCode = () =>
        {

            let c: ArgumentImpl = new ArgumentImpl(ctx);

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
    public getExplanation(): string
    {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    public setExplanation(explanation: string): string
    {
        //let bodyCode = () =>
        {
            this.explanation = explanation;
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    public getValue(): ArgumentValue
    {
        //let bodyCode = () =>
        {
            return this.value;
        }
        //return p.measure(bodyCode);
    }
    public setValue(value: ArgumentValue)
    {
        //let bodyCode = () =>
        {
            this.value = value;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    public getParameterDef(): ICdmParameterDef
    {
        //let bodyCode = () =>
        {
            return this.resolvedParameter;
        }
        //return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
                if (typeof(this.value) != "string")
                    if ((this.value as ICdmObject).visit(path, preChildren, postChildren))
                        return true;
            }
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }

    cacheTag():string 
    {
        //let bodyCode = () =>
        {
            let tag = "";
            let val = this.value;
            if (val) {
                if (typeof(val) === "string")
                    tag = val;
                else {
                    let valObj = val as ICdmObject;
                    if (valObj.ID)
                        tag = val.ID.toString();
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
class ParameterImpl extends cdmObjectSimple implements ICdmParameterDef
{
    explanation: string;
    name: string;
    defaultValue: ArgumentValue;
    required: boolean;
    direction: string;
    dataType: DataTypeReferenceImpl;

    constructor(ctx: CdmCorpusContext, name: string)
    {
        super(ctx);
        //let bodyCode = () =>
        {
            this.name = name;
            this.objectType = cdmObjectType.parameterDef;
        }
        //return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.parameterDef;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Parameter
    {
        //let bodyCode = () =>
        {
            let defVal : ArgumentValue;
            if (this.defaultValue) {
                if (typeof(this.defaultValue)==="string")
                    defVal = this.defaultValue;
                else
                    defVal = (<ICdmObject> this.defaultValue).copyData(resOpt, options);
            }
            let castedToInterface: Parameter = {
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
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new ParameterImpl(this.ctx, this.name);

            let defVal : ArgumentValue;
            if (this.defaultValue) {
                if (typeof(this.defaultValue)==="string")
                    defVal = this.defaultValue;
                else
                    defVal = (<ICdmObject> this.defaultValue).copy(resOpt);
            }
            copy.explanation = this.explanation;
            copy.defaultValue = defVal;
            copy.required = this.required;
            copy.direction = this.direction;
            copy.dataType = (this.dataType ? this.dataType.copy(resOpt) : undefined) as DataTypeReferenceImpl
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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
                if (typeof(this.defaultValue) === "string")
                    ff.addChildString(this.defaultValue);
                else
                    ff.addChild((this.defaultValue as ICdmObject).getFriendlyFormat());
            }
            ff.addComment(this.explanation);
            return ff;
        }
        //return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: any): ParameterImpl
    {

        //let bodyCode = () =>
        {
            let c: ParameterImpl = new ParameterImpl(ctx, object.name);
            c.explanation = object.explanation;
            c.required = object.required ? object.required : false;
            c.direction = object.direction ? object.direction : "in";

            c.defaultValue = cdmObject.createConstant(ctx, object.defaultValue);
            c.dataType = cdmObject.createDataTypeReference(ctx, object.dataType);

            return c;
        }
        //return p.measure(bodyCode);
    }
    public getExplanation(): string
    {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    public getDefaultValue(): ArgumentValue
    {
        //let bodyCode = () =>
        {
            return this.defaultValue;
        }
        //return p.measure(bodyCode);
    }
    public getRequired(): boolean
    {
        //let bodyCode = () =>
        {
            return this.required;
        }
        //return p.measure(bodyCode);
    }
    public getDirection(): string
    {
        //let bodyCode = () =>
        {
            return this.direction;
        }
        //return p.measure(bodyCode);
    }
    public getDataTypeRef(): ICdmDataTypeRef
    {
        //let bodyCode = () =>
        {
            return this.dataType;
        }
        //return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
            if (this.defaultValue && typeof(this.defaultValue) != "string")
                if ((this.defaultValue as ICdmObject).visit(path + "/defaultValue/", preChildren, postChildren))
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

let addTraitRef = (ctx:CdmCorpusContext, collection: Array<TraitReferenceImpl>, traitDefOrRef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean): ICdmTraitRef =>
{
    //let bodyCode = () =>
    {
        if (traitDefOrRef) {
            let tRef : TraitReferenceImpl;
            if ((traitDefOrRef as ICdmObject).getObjectType && (traitDefOrRef as ICdmObject).getObjectType() === cdmObjectType.traitRef)
                // already a ref, just store it
                tRef = traitDefOrRef as TraitReferenceImpl;
            else {
                if (typeof(traitDefOrRef) === "string") 
                    // all we got is a string, so make a trait ref out of it
                    tRef = new TraitReferenceImpl(ctx, traitDefOrRef, implicitRef, false);
                else 
                    // must be a trait def, so make a ref 
                    tRef = new TraitReferenceImpl(ctx, traitDefOrRef as TraitImpl, false, false)
            }

            collection.push(tRef);
            return tRef;
        }
    }
    //return p.measure(bodyCode);
}

let getTraitRefName = (traitRefOrDef: ICdmTraitRef | ICdmTraitDef | string | ResolvedTrait): string =>
{
    //let bodyCode = () =>
    {
        // lots of things this could be on an unresolved object model, so try them
        if (typeof traitRefOrDef === "string")
            return traitRefOrDef;
        if ((traitRefOrDef as ResolvedTrait).trait) // is this a resolved trait?
            return (traitRefOrDef as ResolvedTrait).traitName;

        let ot = (traitRefOrDef as ICdmObject).getObjectType();
        if (ot == cdmObjectType.traitDef)
            return (traitRefOrDef as ICdmTraitDef).getName();
        if (ot == cdmObjectType.traitRef) {
            return (traitRefOrDef as ICdmTraitDef).getObjectDefName();
        }
        return null;
    }
    //return p.measure(bodyCode);
}

let getTraitRefIndex = (collection: Array<(TraitReferenceImpl | ResolvedTrait)>, traitDef: ICdmTraitRef | ICdmTraitDef | string): number =>
{
    //let bodyCode = () =>
    {
        if (!collection)
            return -1;
        let index: number;
        let traitName = getTraitRefName(traitDef);
        index = collection.findIndex(t =>
        {
            return getTraitRefName(t) == traitName;
        });
        return index;
    }
    //return p.measure(bodyCode);
}

let removeTraitRef = (collection: Array<(TraitReferenceImpl)>, traitDef: ICdmTraitRef | ICdmTraitDef | string) =>
{
    //let bodyCode = () =>
    {
        let index: number = getTraitRefIndex(collection, traitDef);
        if (index >= 0)
            collection.splice(index, 1);
    }
    //return p.measure(bodyCode);
}

let getTraitRefArgumentValue = (tr: ICdmTraitRef | ResolvedTrait, argName: string): any =>
{
    //let bodyCode = () =>
    {
        if (tr) {
            let av : ArgumentValue;
            if ((tr as ResolvedTrait).parameterValues)
                av = (tr as ResolvedTrait).parameterValues.getParameterValue(argName).value;
            else 
                av = (tr as ICdmTraitRef).getArgumentValue(argName);
            return av;
        }
    }
    //return p.measure(bodyCode);
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

abstract class cdmObjectDef extends cdmObject implements ICdmObjectDef
{
    public explanation: string;
    public exhibitsTraits: TraitReferenceImpl[];
    public corpusPath: string;
    //baseCache : Set<string>;

    constructor(ctx: CdmCorpusContext, exhibitsTraits: boolean)
    {
        super(ctx);
        //let bodyCode = () =>
        {
            if (exhibitsTraits)
                this.exhibitsTraits = new Array<TraitReferenceImpl>();
        }
        //return p.measure(bodyCode);
    }
    public abstract getName(): string;
    public abstract isDerivedFrom(resOpt: resolveOptions, base: string): boolean;
    public copyDef(resOpt: resolveOptions, copy: cdmObjectDef)
    {
        //let bodyCode = () =>
        {
            copy.explanation = this.explanation;
            copy.exhibitsTraits = cdmObject.arrayCopy<TraitReferenceImpl>(resOpt, this.exhibitsTraits);
        }
        //return p.measure(bodyCode);
    }

    public getFriendlyFormatDef(under: friendlyFormatNode)
    {
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

    public getObjectDefName(): string {
        //let bodyCode = () =>
        {
            return this.getName(); 
        }
        //return p.measure(bodyCode);
    }
    public getObjectDef<T=ICdmObjectDef>(resOpt: resolveOptions): T
    {
        //let bodyCode = () =>
        {
            return this as any;
        }
        //return p.measure(bodyCode);
    }

    public getExplanation(): string
    {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    public setExplanation(explanation: string): string
    {
        this.explanation = explanation;
        return this.explanation;
    }
    public getExhibitedTraitRefs(): ICdmTraitRef[]
    {
        //let bodyCode = () =>
        {
            return this.exhibitsTraits;
        }
        //return p.measure(bodyCode);
    }
    public addExhibitedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean = false): ICdmTraitRef
    {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (!this.exhibitsTraits)
                this.exhibitsTraits = new Array<TraitReferenceImpl>();
            return addTraitRef(this.ctx, this.exhibitsTraits, traitDef, implicitRef);
        }
        //return p.measure(bodyCode);
    }
    public removeExhibitedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string): ICdmTraitRef
    {
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
    
    public visitDef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
        //let bodyCode = () =>
        {
            if (this.exhibitsTraits)
                if (cdmObject.visitArray(this.exhibitsTraits, pathFrom + "/exhibitsTraits/", preChildren, postChildren))
                    return true;
            return false;
        }
        //return p.measure(bodyCode);
    }

    public isDerivedFromDef(resOpt: resolveOptions, base: ICdmObjectRef, name: string, seek: string): boolean
    {
        //let bodyCode = () =>
        {
            if (seek == name)
                return true;

            let def : ICdmObjectDef;
            if (base && (def = base.getObjectDef(resOpt)))
                return def.isDerivedFrom(resOpt, seek);
            return false;
        }
        //return p.measure(bodyCode);
    }

    public constructResolvedTraitsDef(base: ICdmObjectRef, rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            // get from base class first, then see if some are applied to base class on ref then add any traits exhibited by this def
            if (base) {
                // merge in all from base class
                rtsb.mergeTraits(base.getResolvedTraits(resOpt));
            }
            // merge in any that are exhibited by this class
            if (this.exhibitsTraits) {
                this.exhibitsTraits.forEach(et =>
                {
                    rtsb.mergeTraits(et.getResolvedTraits(resOpt));
                });
            }
        }
        //return p.measure(bodyCode);
    }
    public getObjectPath(): string
    {
        //let bodyCode = () =>
        {
            return this.corpusPath;
        }
        //return p.measure(bodyCode);
    }

    public createSimpleReference(resOpt: resolveOptions) : ICdmObjectRef {
        let name : string;
        if (this.declaredPath)
            name = this.declaredPath;
        else
            name = this.getName();

        let ref = this.ctx.corpus.MakeObject(CorpusImpl.GetReferenceType(this.getObjectType()), name, true) as cdmObjectRef;
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
abstract class cdmObjectRef extends cdmObject implements ICdmObjectRef
{
    appliedTraits?: TraitReferenceImpl[];
    namedReference?: string;
    explicitReference?: cdmObjectDef;
    simpleNamedReference?: boolean;
    monikeredDocument?:ICdmDocumentDef;

    constructor(ctx:CdmCorpusContext, referenceTo : (string | cdmObjectDef), simpleReference : boolean, appliedTraits: boolean)
    {
        super(ctx);
        //let bodyCode = () =>
        {
            if (referenceTo) {
                if (typeof(referenceTo) === "string") {
                    this.namedReference = referenceTo;
                }
                else
                    this.explicitReference = referenceTo as cdmObjectDef;
            }
            if (simpleReference)
                this.simpleNamedReference = true;
            if (appliedTraits)
                this.appliedTraits = new Array<TraitReferenceImpl>();
        }
        //return p.measure(bodyCode);
    }

    getResolvedReference(resOpt: resolveOptions) : cdmObjectDef {
        //let bodyCode = () =>
        {
            if (this.explicitReference)
                return this.explicitReference;

            if (!this.ctx)
                return undefined;

            let ctx=this.ctx as resolveContext; // what it actually is
            let res: cdmObjectDef;

            // if this is a special request for a resolved attribute, look that up now
            let resAttToken = "/(resolvedAttributes)/";
            let seekResAtt = this.namedReference.indexOf(resAttToken);
            if (seekResAtt >= 0) {
                let entName = this.namedReference.substring(0, seekResAtt);
                let attName = this.namedReference.slice(seekResAtt + resAttToken.length);
                // get the entity
                let ent : ICdmObjectDef = (this.ctx.corpus as CorpusImpl).resolveSymbolReference(resOpt, this.docCreatedIn, entName, cdmObjectType.entityDef);

                if (!ent) {
                    ctx.statusRpt(cdmStatusLevel.warning, `unable to resolve an entity named '${entName}' from the reference '${this.namedReference}'`, "");
                    return undefined;
                }

                // get the resolved attribute
                let ra = ent.getResolvedAttributes(resOpt).get(attName);
                if (ra) 
                    res = ra.target as any;
                else {
                    ctx.statusRpt(cdmStatusLevel.warning, `couldn't resolve the attribute promise for '${this.namedReference}'`, "");
                }
            }
            else {
                // normal symbolic reference, look up from the Corpus, it knows where everything is
                res = (this.ctx.corpus as CorpusImpl).resolveSymbolReference(resOpt, this.docCreatedIn, this.namedReference, this.objectType);
            }

            return res;
        }
        //return p.measure(bodyCode);
    }

    public createSimpleReference(resOpt: resolveOptions) : ICdmObjectRef
    {
        if (this.namedReference)
            return this.copyRefObject(resOpt, this.namedReference, true);
        return this.copyRefObject(resOpt, this.declaredPath + this.explicitReference.getName(), true);
    }

    public copyData(resOpt: resolveOptions, options: copyOptions) : any {
        //let bodyCode = () =>
        {
            let copy : any = {};
            if (this.namedReference)
            {
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
                copy.appliedTraits = cdmObject.arraycopyData<TraitReferenceImpl>(resOpt, this.appliedTraits, options);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public abstract copyRefData(resOpt: resolveOptions, copy : any, refTo : any, options: copyOptions) : any;

    public copy(resOpt: resolveOptions): ICdmObject {
        let copy = this.copyRefObject(resOpt, this.namedReference ? this.namedReference : this.explicitReference, this.simpleNamedReference);
        if (resOpt.saveResolutionsOnCopy) {
            copy.explicitReference = this.explicitReference;
            copy.docCreatedIn = this.docCreatedIn;
        }
        if (this.appliedTraits)
            copy.appliedTraits = cdmObject.arrayCopy<TraitReferenceImpl>(resOpt, this.appliedTraits);
        return copy;
    }
    public abstract copyRefObject(resOpt: resolveOptions, refTo : string | cdmObjectDef, simpleReference: boolean): cdmObjectRef;

    public getObjectDefName(): string {
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
    public getObjectDef<T=ICdmObjectDef>(resOpt: resolveOptions): T
    {
        //let bodyCode = () =>
        {
            let def = this.getResolvedReference(resOpt) as any;
            if (def)
                return def;
        }
        //return p.measure(bodyCode);
    }

    public setObjectDef(def: ICdmObjectDef): ICdmObjectDef
    {
        //let bodyCode = () =>
        {
            this.explicitReference = def as cdmObjectDef;
            return def;
        }
        //return p.measure(bodyCode);
    }

    public getFriendlyFormat(): friendlyFormatNode
    {
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

    public getAppliedTraitRefs(): ICdmTraitRef[]
    {
        //let bodyCode = () =>
        {
            return this.appliedTraits;
        }
        //return p.measure(bodyCode);
    }
    public addAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean = false): ICdmTraitRef
    {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (!this.appliedTraits)
                this.appliedTraits = new Array<TraitReferenceImpl>();
            return addTraitRef(this.ctx, this.appliedTraits, traitDef, implicitRef);
        }
        //return p.measure(bodyCode);
    }
    public removeAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string)
    {
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
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return (this.namedReference || this.explicitReference) ? true : false;
        }
        //return p.measure(bodyCode);
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
    public abstract visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;

    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            let rasb = new ResolvedAttributeSetBuilder();
            rasb.setAttributeContext(under);
            let def = this.getObjectDef(resOpt);
            if (def) {
                let acpRef : AttributeContextParameters;
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

    public getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            if (this.namedReference && !this.appliedTraits) {
                let ctx=this.ctx as resolveContext; 
                let objDefName = this.getObjectDefName();
                let cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, "rts", "", true); 
                let rtsResult: ResolvedTraitSet = ctx.cache.get(cacheTag);
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

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
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
                this.appliedTraits.forEach(at =>
                {
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
class TraitReferenceImpl extends cdmObjectRef implements ICdmTraitRef
{
    arguments?: ArgumentImpl[];
    resolvedArguments: boolean;

    constructor(ctx:CdmCorpusContext, trait: string | TraitImpl, simpleReference: boolean, hasArguments: boolean)
    {
        super(ctx, trait, simpleReference, false);
        //let bodyCode = () =>
        {
            if (hasArguments)
                this.arguments = new Array<ArgumentImpl>();
            this.objectType = cdmObjectType.traitRef;
            this.resolvedArguments = false;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.traitRef;
        }
        //return p.measure(bodyCode);
    }
    public copyRefData(resOpt: resolveOptions, copy : TraitReference, refTo : string | Trait, options: copyOptions) 
    {
        //let bodyCode = () =>
        {
            copy.traitReference = refTo;
            copy.arguments = cdmObject.arraycopyData<Argument>(resOpt, this.arguments, options)
        }
        //return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo : string | TraitImpl, simpleReference: boolean): cdmObjectRef
    {
        //let bodyCode = () =>
        {
            let copy = new TraitReferenceImpl(this.ctx, refTo, simpleReference, (this.arguments && this.arguments.length > 0));
            if (!simpleReference) {
                copy.arguments = cdmObject.arrayCopy<ArgumentImpl>(resOpt, this.arguments);
                copy.resolvedArguments = this.resolvedArguments;
            }
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: string | TraitReference): TraitReferenceImpl
    {
        //let bodyCode = () =>
        {
            let simpleReference : boolean = true;
            let trait : string | TraitImpl;
            let args : (string | Argument)[] = null;
            if (typeof(object) == "string")
                trait = object;
            else {
                simpleReference = false;
                args = object.arguments;
                if (typeof(object.traitReference) === "string")
                    trait = object.traitReference;
                else 
                    trait = TraitImpl.instanceFromData(ctx, object.traitReference);
            }

            let c: TraitReferenceImpl = new TraitReferenceImpl(ctx, trait, simpleReference, !!args);
            if (args) {
                args.forEach(a => {
                    c.arguments.push(ArgumentImpl.instanceFromData(ctx, a));
                });
            }
            return c;
        }
        //return p.measure(bodyCode);
    }

    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
        //let bodyCode = () =>
        {
            if (this.arguments)
                if (cdmObject.visitArray(this.arguments, pathFrom + "/arguments/", preChildren, postChildren))
                    return true;
            return false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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

    public getArgumentDefs(): (ICdmArgumentDef)[]
    {
        //let bodyCode = () =>
        {
            return this.arguments;
        }
        //return p.measure(bodyCode);
    }
    public addArgument(name: string, value: ArgumentValue): ICdmArgumentDef
    {
        //let bodyCode = () =>
        {
            if (!this.arguments)
                this.arguments = new Array<ArgumentImpl>();
            let newArg : ArgumentImpl = this.ctx.corpus.MakeObject<ArgumentImpl>(cdmObjectType.argumentDef, name);
            newArg.setValue(value);
            this.arguments.push(newArg);
            this.resolvedArguments = false;
            return newArg;
        }
        //return p.measure(bodyCode);
    }
    public getArgumentValue(name: string): ArgumentValue 
    {
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

    public setArgumentValue(name: string, value: string)
    {
        //let bodyCode = () =>
        {
            if (!this.arguments)
                this.arguments = new Array<ArgumentImpl>();
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

    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }

    public getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            // get referenced trait
            let trait = this.getObjectDef<ICdmTraitDef>(resOpt) as TraitImpl;
            let rtsTrait: ResolvedTraitSet;
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
            let rtsResult: ResolvedTraitSet = ctx.cache.get(cacheTag);
            
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
                        let params: ParameterCollection = trait.getAllParameters(resOpt);
                        let paramFound: ICdmParameterDef;
                        let aValue: ArgumentValue;

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

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TraitDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TraitImpl extends cdmObjectDef implements ICdmTraitDef
{
    explanation: string;
    traitName: string;
    extendsTrait: TraitReferenceImpl;
    hasParameters: ParameterImpl[];
    allParameters: ParameterCollection;
    appliers: TraitApplier[];
    hasSetFlags: boolean;
    elevated: boolean;
    modifiesAttributes: boolean;
    ugly: boolean;
    associatedProperties: string[];
    baseIsKnownToHaveParameters: boolean;
    thisIsKnownToHaveParameters: boolean;


    constructor(ctx:CdmCorpusContext, name: string, extendsTrait: TraitReferenceImpl, hasParameters: boolean)
    {
        super(ctx, false);
        //let bodyCode = () =>
        {
            this.hasSetFlags = false;
            this.objectType = cdmObjectType.traitDef;
            this.traitName = name;
            this.extendsTrait = extendsTrait;
            if (hasParameters)
                this.hasParameters = new Array<ParameterImpl>();
        }
        //return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.traitDef;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Trait
    {
        //let bodyCode = () =>
        {
            let castedToInterface: Trait = {
                explanation: this.explanation,
                traitName: this.traitName,
                extendsTrait: this.extendsTrait ? this.extendsTrait.copyData(resOpt, options) : undefined,
                hasParameters: cdmObject.arraycopyData<string | Parameter>(resOpt, this.hasParameters, options),
                elevated: this.elevated,
                modifiesAttributes: this.modifiesAttributes,
                ugly: this.ugly,
                associatedProperties: this.associatedProperties
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new TraitImpl(this.ctx, this.traitName, null, false);
            copy.extendsTrait = this.extendsTrait ? <TraitReferenceImpl>this.extendsTrait.copy(resOpt) : undefined,
            copy.hasParameters = cdmObject.arrayCopy<ParameterImpl>(resOpt, this.hasParameters)
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
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.traitName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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
    public static instanceFromData(ctx: CdmCorpusContext, object: Trait): TraitImpl
    {
        //let bodyCode = () =>
        {
            let extendsTrait: TraitReferenceImpl;
            if (object.extendsTrait)
                extendsTrait = TraitReferenceImpl.instanceFromData(ctx, object.extendsTrait);

            let c: TraitImpl = new TraitImpl(ctx, object.traitName, extendsTrait, !!object.hasParameters);

            if (object.explanation)
                c.explanation = object.explanation;

            if (object.hasParameters) {
                object.hasParameters.forEach(ap =>{
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
    public getExplanation(): string
    {
        //let bodyCode = () =>
        {
            return this.explanation;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.traitName;
        }
        //return p.measure(bodyCode);
    }
    public getExtendsTrait(): ICdmTraitRef
    {
        //let bodyCode = () =>
        {
            return this.extendsTrait;
        }
        //return p.measure(bodyCode);
    }
    public setExtendsTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean = false): ICdmTraitRef
    {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            let extRef = new Array<(TraitReferenceImpl)>();
            addTraitRef(this.ctx, extRef, traitDef, implicitRef);
            this.extendsTrait = extRef[0];
            return this.extendsTrait;
        }
        //return p.measure(bodyCode);
    }
    public getHasParameterDefs(): ICdmParameterDef[]
    {
        //let bodyCode = () =>
        {
            return this.hasParameters;
        }
        //return p.measure(bodyCode);
    }
    public getExhibitedTraitRefs(): ICdmTraitRef[]
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean
    {
        //let bodyCode = () =>
        {
            if (base === this.traitName)
                return true;
            return this.isDerivedFromDef(resOpt, this.extendsTrait, this.traitName, base);
        }
        //return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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

    public addTraitApplier(applier: TraitApplier)
    {
        //let bodyCode = () =>
        {
            if (!this.appliers || applier.overridesBase)
                this.appliers = new Array<TraitApplier>();
            this.appliers.push(applier);
        }
        //return p.measure(bodyCode);
    }

    public getTraitAppliers(): TraitApplier[]
    {
        //let bodyCode = () =>
        {
            return this.appliers;
        }
        //return p.measure(bodyCode);
    }

    public getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            // this may happen 0, 1 or 2 times. so make it fast
            let baseTrait: ICdmTraitDef;
            let baseRts: ResolvedTraitSet;
            let baseValues: ArgumentValue[];
            let getBaseInfo = () => {
                if (this.extendsTrait) {
                    baseTrait = this.extendsTrait.getObjectDef<ICdmTraitDef>(resOpt);
                    if (baseTrait) {
                        baseRts = this.extendsTrait.getResolvedTraits(resOpt);
                        if (baseRts && baseRts.size === 1) {
                            let basePv = baseRts.get(baseTrait).parameterValues;
                            if (basePv)
                                baseValues = basePv.values;
                        }
                    }
                }
            }

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
            let cacheTagExtra: string = "";
            if (this.baseIsKnownToHaveParameters) 
                cacheTagExtra = this.extendsTrait.ID.toString();

            let cacheTag = ctx.corpus.getDefinitionCacheTag(resOpt, this, "rtsb", cacheTagExtra); 
            let rtsResult: ResolvedTraitSet = ctx.cache.get(cacheTag);
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
                let av = new Array<ArgumentValue>();
                let wasSet = new Array<boolean>();
                this.thisIsKnownToHaveParameters = (pc.sequence.length > 0);
                for (let i = 0; i < pc.sequence.length; i++) {
                    // either use the default value or (higher precidence) the value taken from the base reference
                    let value: ArgumentValue = (pc.sequence[i] as ParameterImpl).defaultValue;
                    let baseValue: ArgumentValue;
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

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
    }

    public getAllParameters(resOpt: resolveOptions): ParameterCollection
    {
        //let bodyCode = () =>
        {
            if (this.allParameters)
                return this.allParameters;

            // get parameters from base if there is one
            let prior: ParameterCollection;
            if (this.extendsTrait)
                prior = this.getExtendsTrait().getObjectDef<ICdmTraitDef>(resOpt).getAllParameters(resOpt);
            this.allParameters = new ParameterCollection(prior);
            if (this.hasParameters) {
                this.hasParameters.forEach(element =>
                {
                    this.allParameters.add(element as ICdmParameterDef);
                });
            }

            return this.allParameters;
        }
        //return p.measure(bodyCode);
    }
    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
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
class RelationshipReferenceImpl extends cdmObjectRef implements ICdmRelationshipRef
{
    constructor(ctx:CdmCorpusContext, relationship: string | RelationshipImpl, simpleReference : boolean, appliedTraits: boolean)
    {
        super(ctx, relationship, simpleReference, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.relationshipRef;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.relationshipRef;
        }
        //return p.measure(bodyCode);
    }
    public copyRefData(resOpt: resolveOptions, copy : RelationshipReference, refTo : string | Relationship, options: copyOptions) 
    {
        //let bodyCode = () =>
        {
            copy.relationshipReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo : string | RelationshipImpl, simpleReference: boolean): cdmObjectRef
    {
        //let bodyCode = () =>
        {
            let copy = new RelationshipReferenceImpl(this.ctx, refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
            return copy;
        }
        //return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: string | RelationshipReference): RelationshipReferenceImpl
    {
        //let bodyCode = () =>
        {
            let simpleReference : boolean = true;
            let appliedTraits : (string | TraitReference)[] = null;
            let relationship : string | RelationshipImpl;
            if (typeof(object) == "string")
                relationship = object;
            else {
                simpleReference = false;
                appliedTraits = object.appliedTraits;
                if (typeof(object.relationshipReference) === "string")
                    relationship = object.relationshipReference;
                else 
                    relationship = RelationshipImpl.instanceFromData(ctx, object.relationshipReference);
            }

            let c: RelationshipReferenceImpl = new RelationshipReferenceImpl(ctx, relationship, simpleReference, !!appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, appliedTraits);

            return c;
        }
        //return p.measure(bodyCode);
    }

    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
class RelationshipImpl extends cdmObjectDef implements ICdmRelationshipDef
{
    relationshipName: string;
    extendsRelationship?: RelationshipReferenceImpl;

    constructor(ctx:CdmCorpusContext, relationshipName: string, extendsRelationship: RelationshipReferenceImpl, exhibitsTraits: boolean)
    {
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
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.relationshipDef;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Relationship
    {
        //let bodyCode = () =>
        {
            let castedToInterface: Relationship = {
                explanation: this.explanation,
                relationshipName: this.relationshipName,
                extendsRelationship: this.extendsRelationship ? this.extendsRelationship.copyData(resOpt, options) : undefined,
                exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new RelationshipImpl(this.ctx, this.relationshipName, null, false);
            copy.extendsRelationship = this.extendsRelationship ? <RelationshipReferenceImpl>this.extendsRelationship.copy(resOpt) : undefined
            this.copyDef(resOpt, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        return this.relationshipName ? true : false;
    }

    public getFriendlyFormat(): friendlyFormatNode
    {
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
    public static instanceFromData(ctx: CdmCorpusContext, object: Relationship): RelationshipImpl
    {
        //let bodyCode = () =>
        {
            let extendsRelationship: RelationshipReferenceImpl;
            extendsRelationship = cdmObject.createRelationshipReference(ctx, object.extendsRelationship);
            let c: RelationshipImpl = new RelationshipImpl(ctx, object.relationshipName, extendsRelationship, !!object.exhibitsTraits);
            if (object.explanation)
                c.explanation = object.explanation;
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.relationshipName;
        }
        //return p.measure(bodyCode);
    }
    public getExtendsRelationshipRef(): ICdmRelationshipRef
    {
        //let bodyCode = () =>
        {
            return this.extendsRelationship;
        }
        //return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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

    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean
    {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(resOpt, this.getExtendsRelationshipRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsRelationshipRef(), rtsb, resOpt);
            //rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }

    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
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
class DataTypeReferenceImpl extends cdmObjectRef
{
    constructor(ctx:CdmCorpusContext, dataType: string | DataTypeImpl, simpleReference : boolean, appliedTraits: boolean)
    {
        super(ctx, dataType, simpleReference, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeRef;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.dataTypeRef;
        }
        //return p.measure(bodyCode);
    }
    public copyRefData(resOpt: resolveOptions, copy : DataTypeReference, refTo : string | DataType, options: copyOptions) 
    {
        //let bodyCode = () =>
        {
            copy.dataTypeReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo : string | DataTypeImpl, simpleReference: boolean): cdmObjectRef
    {
        //let bodyCode = () =>
        {
            let copy = new DataTypeReferenceImpl(this.ctx, refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
            return copy;
        }
        //return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: string | DataTypeReference): DataTypeReferenceImpl
    {
        //let bodyCode = () =>
        {
            let simpleReference : boolean = true;
            let dataType : string | DataTypeImpl;
            let appliedTraits : (string | TraitReference)[] = null;
            if (typeof(object) == "string")
                dataType = object;
            else {
                simpleReference = false;
                appliedTraits = object.appliedTraits;
                if (typeof(object.dataTypeReference) === "string")
                    dataType = object.dataTypeReference;
                else 
                    dataType = DataTypeImpl.instanceFromData(ctx, object.dataTypeReference);
            }

            let c: DataTypeReferenceImpl = new DataTypeReferenceImpl(ctx, dataType, simpleReference, !!appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, appliedTraits);

            return c;
        }
        //return p.measure(bodyCode);
    }

    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
class DataTypeImpl extends cdmObjectDef implements ICdmDataTypeDef
{
    dataTypeName: string;
    extendsDataType?: DataTypeReferenceImpl;

    constructor(ctx:CdmCorpusContext, dataTypeName: string, extendsDataType: DataTypeReferenceImpl, exhibitsTraits: boolean)
    {
        super(ctx, exhibitsTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeDef;
            this.dataTypeName = dataTypeName;
            this.extendsDataType = extendsDataType;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.dataTypeDef;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): DataType
    {
        //let bodyCode = () =>
        {
            let castedToInterface: DataType = {
                explanation: this.explanation,
                dataTypeName: this.dataTypeName,
                extendsDataType: this.extendsDataType ? this.extendsDataType.copyData(resOpt, options) : undefined,
                exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new DataTypeImpl(this.ctx, this.dataTypeName, null, false);
            copy.extendsDataType = this.extendsDataType ? <DataTypeReferenceImpl>this.extendsDataType.copy(resOpt) : undefined
            this.copyDef(resOpt, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.dataTypeName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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
    public static instanceFromData(ctx: CdmCorpusContext, object: DataType): DataTypeImpl
    {
        //let bodyCode = () =>
        {
            let extendsDataType: DataTypeReferenceImpl;
            extendsDataType = cdmObject.createDataTypeReference(ctx, object.extendsDataType);

            let c: DataTypeImpl = new DataTypeImpl(ctx, object.dataTypeName, extendsDataType, !!object.exhibitsTraits);

            if (object.explanation)
                c.explanation = object.explanation;

            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);

            return c;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.dataTypeName;
        }
        //return p.measure(bodyCode);
    }
    public getExtendsDataTypeRef(): ICdmDataTypeRef
    {
        //let bodyCode = () =>
        {
            return this.extendsDataType;
        }
        //return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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

    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean
    {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(resOpt, this.getExtendsDataTypeRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsDataTypeRef(), rtsb, resOpt);
            //rtsb.cleanUp();
        }
        //return p.measure(bodyCode);
    }
    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
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

class AttributeReferenceImpl extends cdmObjectRef
{
    constructor(ctx:CdmCorpusContext, attribute: string | AttributeImpl, simpleReference : boolean)
    {
        super(ctx, attribute, simpleReference, false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeRef;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeRef;
        }
        //return p.measure(bodyCode);
    }
    public copyRefData(resOpt: resolveOptions, copy : AttributeImpl, refTo : any, options: copyOptions) 
    {
        //let bodyCode = () =>
        {
            // there is no persisted object wrapper
            return refTo;
        }
        //return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo : string | AttributeImpl, simpleReference: boolean): cdmObjectRef
    {
        //let bodyCode = () =>
        {
            let copy = new AttributeReferenceImpl(this.ctx, refTo, simpleReference);
            return copy;
        }
        //return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: string): AttributeReferenceImpl
    {
        //let bodyCode = () =>
        {
            let simpleReference : boolean = true;
            let attribute : string | AttributeImpl;
            if (typeof(object) == "string")
                attribute = object;
            else {
                simpleReference = false;
                attribute = cdmObject.createAttribute(ctx, object) as AttributeImpl;
            }

            let c: AttributeReferenceImpl = new AttributeReferenceImpl(ctx, attribute, simpleReference);
            return c;
        }
        //return p.measure(bodyCode);
    }

    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
abstract class AttributeImpl extends cdmObjectDef implements ICdmAttributeDef
{
    relationship: RelationshipReferenceImpl;
    name: string;
    appliedTraits?: TraitReferenceImpl[];

    constructor(ctx:CdmCorpusContext, name: string, appliedTraits: boolean)
    {
        super(ctx, false);
        //let bodyCode = () =>
        {
            this.name = name;
            if (appliedTraits)
                this.appliedTraits = new Array<TraitReferenceImpl>();
        }
        //return p.measure(bodyCode);
    }

    public copyAtt(resOpt: resolveOptions, copy: AttributeImpl)
    {
        //let bodyCode = () =>
        {
            copy.relationship = this.relationship ? <RelationshipReferenceImpl>this.relationship.copy(resOpt) : undefined;
            copy.appliedTraits = cdmObject.arrayCopy<TraitReferenceImpl>(resOpt, this.appliedTraits);
            this.copyDef(resOpt, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    public setObjectDef(def: ICdmObjectDef): ICdmObjectDef
    {
        //let bodyCode = () =>
        {
            throw Error("not a ref");
        }
        //return p.measure(bodyCode);
    }
    public getRelationshipRef(): ICdmRelationshipRef
    {
        //let bodyCode = () =>
        {
            return this.relationship;
        }
        //return p.measure(bodyCode);
    }
    public setRelationshipRef(relRef: ICdmRelationshipRef): ICdmRelationshipRef
    {
        //let bodyCode = () =>
        {
            this.relationship = relRef as RelationshipReferenceImpl;
            return this.relationship;
        }
        //return p.measure(bodyCode);
    }
    public getAppliedTraitRefs(): ICdmTraitRef[]
    {
        //let bodyCode = () =>
        {
            return this.appliedTraits;
        }
        //return p.measure(bodyCode);
    }
    public addAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean = false): ICdmTraitRef
    {
        //let bodyCode = () =>
        {
            if (!traitDef)
                return null;
            this.clearTraitCache();
            if (!this.appliedTraits)
                this.appliedTraits = new Array<TraitReferenceImpl>();
            return addTraitRef(this.ctx, this.appliedTraits, traitDef, implicitRef);
        }
        //return p.measure(bodyCode);
    }
    public removeAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string)
    {
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

    public visitAtt(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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

    public addResolvedTraitsApplied(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            let addAppliedTraits = (ats: ICdmTraitRef[]) =>
            {
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

    public removeTraitDef(resOpt: resolveOptions, def: ICdmTraitDef)
    {
        //let bodyCode = () =>
        {
            this.clearTraitCache();
            let traitName = def.getName();
            if (this.appliedTraits) {
                let iRemove = 0
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
    abstract getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {TypeAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class TypeAttributeImpl extends AttributeImpl implements ICdmTypeAttributeDef
{
    dataType: DataTypeReferenceImpl;
    t2pm: traitToPropertyMap;
    public attributeContext?: AttributeContextReferenceImpl;

    constructor(ctx:CdmCorpusContext, name: string, appliedTraits: boolean)
    {
        super(ctx, name, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.typeAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.typeAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): TypeAttribute
    {
        //let bodyCode = () =>
        {
            let castedToInterface: TypeAttribute = {
                explanation: this.explanation,
                relationship: this.relationship ? this.relationship.copyData(resOpt, options) : undefined,
                dataType: this.dataType ? this.dataType.copyData(resOpt, options) : undefined,
                name: this.name,
                appliedTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.appliedTraits, options),
                attributeContext: this.attributeContext ? this.attributeContext.copyData(resOpt, options) : undefined
            };
            this.getTraitToPropertyMap().persistForTypeAttributeDef(castedToInterface, options);
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new TypeAttributeImpl(this.ctx, this.name, false);
            copy.dataType = this.dataType ? <DataTypeReferenceImpl>this.dataType.copy(resOpt) : undefined;
            copy.attributeContext = this.attributeContext ? <AttributeContextReferenceImpl>this.attributeContext.copy(resOpt) : undefined;
            this.copyAtt(resOpt, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }

    public getFriendlyFormat(): friendlyFormatNode
    {
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
    public static instanceFromData(ctx: CdmCorpusContext, object: TypeAttribute): TypeAttributeImpl
    {
        //let bodyCode = () =>
        {
            let c: TypeAttributeImpl = new TypeAttributeImpl(ctx, object.name, !!object.appliedTraits);

            if (object.explanation)
                c.explanation = object.explanation;

            c.relationship = cdmObject.createRelationshipReference(ctx, object.relationship);
            c.dataType = cdmObject.createDataTypeReference(ctx, object.dataType);
            c.attributeContext = cdmObject.createAttributeContextReference(ctx, object.attributeContext);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, object.appliedTraits);
            c.t2pm = new traitToPropertyMap();
            c.t2pm.initForTypeAttributeDef(ctx, object as TypeAttribute, c);
            return c;
        }
        //return p.measure(bodyCode);
    }
    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean
    {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    public getDataTypeRef(): ICdmDataTypeRef
    {
        //let bodyCode = () =>
        {
            return this.dataType;
        }
        //return p.measure(bodyCode);
    }
    public setDataTypeRef(dataType: ICdmDataTypeRef): ICdmDataTypeRef
    {
        //let bodyCode = () =>
        {
            this.dataType = dataType as DataTypeReferenceImpl;
            return this.dataType;
        }
        //return p.measure(bodyCode);
    }

    getTraitToPropertyMap()
    {
        if (this.t2pm)
            return this.t2pm;
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForTypeAttributeDef(this.ctx, null, this);
        return this.t2pm;
    }
    public get isReadOnly() : boolean
    {
        return this.getTraitToPropertyMap().getPropertyValue("isReadOnly");
    }
    public set isReadOnly(val: boolean)
    {
        this.getTraitToPropertyMap().setPropertyValue("isReadOnly", val);
    }
    public get isNullable() : boolean
    {
        return this.getTraitToPropertyMap().getPropertyValue("isNullable");
    }
    public set isNullable(val: boolean)
    {
        this.getTraitToPropertyMap().setPropertyValue("isNullable", val);
    }
    public get sourceName() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("sourceName");
    }
    public set sourceName(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("sourceName", val);
    }
    public get description() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("description");
    }
    public set description(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("description", val);
    }
    public get displayName() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("displayName");
    }
    public set displayName(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("displayName", val);
    }
    public get sourceOrdering() : number
    {
        return this.getTraitToPropertyMap().getPropertyValue("sourceOrdering");
    }
    public set sourceOrdering(val: number)
    {
        this.getTraitToPropertyMap().setPropertyValue("sourceOrdering", val);
    }
    public get valueConstrainedToList() : boolean
    {
        return this.getTraitToPropertyMap().getPropertyValue("valueConstrainedToList");
    }
    public set valueConstrainedToList(val: boolean)
    {
        this.getTraitToPropertyMap().setPropertyValue("valueConstrainedToList", val);
    }
    public get isPrimaryKey() : boolean
    {
        return this.getTraitToPropertyMap().getPropertyValue("isPrimaryKey");
    }
    public set isPrimaryKey(val: boolean)
    {
        this.getTraitToPropertyMap().setPropertyValue("isPrimaryKey", val);
    }
    public get maximumLength() : number
    {
        return this.getTraitToPropertyMap().getPropertyValue("maximumLength");
    }
    public set maximumLength(val: number)
    {
        this.getTraitToPropertyMap().setPropertyValue("maximumLength", val);
    }
    public get maximumValue() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("maximumValue");
    }
    public set maximumValue(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("maximumValue", val);
    }
    public get minimumValue() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("minimumValue");
    }
    public set minimumValue(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("minimumValue", val);
    }
    public get dataFormat() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("dataFormat");
    }
    public set dataFormat(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("dataFormat", val);
    }
    public get defaultValue() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("defaultValue");
    }
    public set defaultValue(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("defaultValue", val);
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
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

    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
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
            let newAtt = new ResolvedAttribute(resOpt, this, this.name, under ? under.ID:-1);
            rasb.ownOne(newAtt);
            rasb.prepareForTraitApplication(this.getResolvedTraits(resOpt));

            // from the traits of the datatype, relationship and applied here, see if new attributes get generated
            rasb.applyTraits();
            rasb.generateTraitAttributes(false); // false = don't apply these traits to added things

            return rasb;
        }
        //return p.measure(bodyCode);
    }
    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
}

interface relationshipInfo {
    rts: ResolvedTraitSet;
    isFlexRef: boolean;
    isLegacyRef: boolean;
    isArray: boolean;
    selectsOne: boolean;
    nextDepth: number;
    maxDepthExceeded: boolean
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {EntityAttributeDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class EntityAttributeImpl extends AttributeImpl implements ICdmEntityAttributeDef
{
    relationship: RelationshipReferenceImpl;
    entity: EntityReferenceImpl;
    appliedTraits?: TraitReferenceImpl[];

    constructor(ctx:CdmCorpusContext, name: string, appliedTraits: boolean)
    {
        super(ctx, name, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityAttributeDef;
        }
        //return p.measure(bodyCode);
    }
    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean
    {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): EntityAttribute
    {
        //let bodyCode = () =>
        {
            let entity: (string | EntityReference | ((string | EntityReference)[]));
            entity = this.entity ? this.entity.copyData(resOpt, options) : undefined;

            let castedToInterface: EntityAttribute = {
                explanation: this.explanation,
                name: this.name,
                entity: this.entity.copyData(resOpt, options),
                relationship: this.relationship ? this.relationship.copyData(resOpt, options) : undefined,
                appliedTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.appliedTraits, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new EntityAttributeImpl(this.ctx, this.name, false);
            copy.entity = <EntityReferenceImpl>this.entity.copy(resOpt);
            this.copyAtt(resOpt, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.name && this.entity ? true : false;
        }
        //return p.measure(bodyCode);
    }

    public getFriendlyFormat(): friendlyFormatNode
    {
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

    public static instanceFromData(ctx: CdmCorpusContext, object: EntityAttribute): EntityAttributeImpl
    {
        //let bodyCode = () =>
        {

            let c: EntityAttributeImpl = new EntityAttributeImpl(ctx, object.name, !!object.appliedTraits);

            if (object.explanation)
                c.explanation = object.explanation;

            c.entity = EntityReferenceImpl.instanceFromData(ctx, object.entity);

            c.relationship = object.relationship ? cdmObject.createRelationshipReference(ctx, object.relationship) : undefined
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, object.appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    public getEntityRef(): ICdmEntityRef
    {
        //let bodyCode = () =>
        {
            return this.entity;
        }
        //return p.measure(bodyCode);
    }
    public setEntityRef(entRef: ICdmEntityRef)
    {
        //let bodyCode = () =>
        {
            this.entity = entRef as EntityReferenceImpl;
            return this.entity;
        }
        //return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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

    private getRelationshipInfo(resOpt: resolveOptions) : relationshipInfo {
        //let bodyCode = () =>
        {
            let rts: ResolvedTraitSet;
            let isFlexRef: boolean = false;
            let isLegacyRef: boolean = false;
            let isArray: boolean = false;
            let selectsOne: boolean = false;
            let nextDepth: number;
            let maxDepthExceeded: boolean = false;

            if (this.relationship) {
                // get the traits for the relationship only
                rts = this.getRelationshipRef().getResolvedTraits(resOpt);
                if (rts) {
                    // this trait will go away at somepoint ..
                    isLegacyRef = rts.find(resOpt, "does.referenceEntity")?true:false; // legacy trait
                    if (rts.resOpt.directives) {
                        // based on directives
                        if (!isLegacyRef)
                            isFlexRef = rts.resOpt.directives.has("referenceOnly");
                        selectsOne = rts.resOpt.directives.has("selectOne")
                        isArray = rts.resOpt.directives.has("isArray")
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

            return {rts: rts,
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
    
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            // // get from relationship
            if (this.relationship)
                rtsb.takeReference(this.getRelationshipRef().getResolvedTraits(resOpt));

            this.addResolvedTraitsApplied(rtsb, resOpt);
        }
        //return p.measure(bodyCode);
    }

    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
        //let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the entity used as an attribute, traits applied to that entity,
            // the relationship of the attribute, any traits applied to the attribute.
            let rasb = new ResolvedAttributeSetBuilder();
            let ctxEnt : ICdmEntityRef = this.entity as ICdmEntityRef;
            let underAtt = under as AttributeContextImpl;
            let acpEnt : AttributeContextParameters;
            if (underAtt) {
                // make a context for this attribute that holds the attributes that come up from the entity
                acpEnt = {
                    under:underAtt,
                    type:cdmAttributeContextType.entity,
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
                    let entPickFrom = (this.entity as ICdmEntityRef).getObjectDef(resOpt) as ICdmEntityDef;
                    let attsPick : ICdmObject[];
                    if (entPickFrom && (attsPick = entPickFrom.getHasAttributeDefs())) {
                        let l = attsPick.length;
                        for (let i=0; i<l; i++) {
                            if (attsPick[i].getObjectType() == cdmObjectType.entityAttributeDef) {
                                // a table within a table. as expected with a selectsOne attribute
                                // since this is by ref, we won't get the atts from the table, but we do need the traits that hold the key
                                // these are the same contexts that would get created if we recursed
                                // first this attribute
                                let acpEntAtt : AttributeContextParameters = {
                                    under:under,
                                    type:cdmAttributeContextType.attributeDefinition,
                                    name:  attsPick[i].getObjectDefName(),
                                    regarding: attsPick[i],
                                    includeTraits: true
                                };
                                let pickUnder = rasb.createAttributeContext(resOpt, acpEntAtt);
                                // and the entity under that attribute
                                let pickEnt = (attsPick[i] as ICdmEntityAttributeDef).getEntityRef() as ICdmEntityRef;
                                let acpEntAttEnt : AttributeContextParameters = {
                                    under:pickUnder,
                                    type:cdmAttributeContextType.entity,
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
                    rtsThisAtt.collectDirectives(dirNew)
                }
            }
            else {
                let resLink = cdmObject.copyResolveOptions(resOpt);
                resLink.relationshipDepth = relInfo.nextDepth;
                rasb.mergeAttributes((this.entity as ICdmEntityRef).getResolvedAttributes(resLink, acpEnt));
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
                    let tr = this.ctx.corpus.MakeObject<ICdmTraitRef>(cdmObjectType.traitRef, "is.linkedEntity.array", true);
                    let t = tr.getObjectDef<ICdmTraitDef>(resOpt);
                    let rt = new ResolvedTrait(t, undefined, new Array<ArgumentValue>(), new Array<boolean>());
                    raSub.resolvedTraits = raSub.resolvedTraits.merge(rt, true);
                }
                rasb = new ResolvedAttributeSetBuilder();
                rasb.ownOne(raSub);
            }
            

            return rasb;
        }
        //return p.measure(bodyCode);
    }
    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet
    {
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
                let resolveSide = (entRef: ICdmEntityRef): ResolvedEntityReferenceSide =>
                {
                    let sideOther = new ResolvedEntityReferenceSide();
                    if (entRef) {
                        // reference to the other entity, hard part is the attribue name.
                        // by convention, this is held in a trait that identifies the key
                        sideOther.entity = entRef.getObjectDef(resOpt);
                        if (sideOther.entity) {
                            // now that we resolved the entity, it should be ok and much faster to switch to the
                            // context of the entities document to go after the key 
                            let wrtEntityDoc = sideOther.entity.declaredInDocument;
                            let otherAttribute: ICdmAttributeDef;
                            let otherOpts : resolveOptions = {wrtDoc:wrtEntityDoc, directives:resOpt.directives};
                            let t: ResolvedTrait = entRef.getResolvedTraits(otherOpts).find(otherOpts, "is.identifiedBy");
                            if (t && t.parameterValues && t.parameterValues.length) {
                                let otherRef = (t.parameterValues.getParameterValue("attribute").value);
                                if (otherRef && typeof(otherRef) === "object") {
                                    otherAttribute = (otherRef as ICdmObject).getObjectDef(otherOpts) as ICdmAttributeDef;
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
                if ((this.entity as EntityReferenceImpl).explicitReference) {
                    let entPickFrom = (this.entity as ICdmEntityRef).getObjectDef(resOpt) as ICdmEntityDef;
                    let attsPick : ICdmObject[];
                    if (entPickFrom && (attsPick = entPickFrom.getHasAttributeDefs())) {
                        let l = attsPick.length;
                        for (let i=0; i<l; i++) {
                            if (attsPick[i].getObjectType() == cdmObjectType.entityAttributeDef) {
                                let er = (attsPick[i] as ICdmEntityAttributeDef).getEntityRef();
                                rer.referenced.push(resolveSide(er));
                            }
                        }
                    }
                }
                else
                    rer.referenced.push(resolveSide(this.entity as ICdmEntityRef));

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
class AttributeGroupReferenceImpl extends cdmObjectRef implements ICdmAttributeGroupRef
{
    constructor(ctx:CdmCorpusContext, attributeGroup: string | AttributeGroupImpl, simpleReference: boolean)
    {
        super(ctx, attributeGroup, simpleReference, false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupRef;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeGroupRef;
        }
        //return p.measure(bodyCode);
    }
    public copyRefData(resOpt: resolveOptions, copy : AttributeGroupReference, refTo : string | AttributeGroup, options: copyOptions) 
    {
        //let bodyCode = () =>
        {
            copy.attributeGroupReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo : string | AttributeGroupImpl, simpleReference: boolean): cdmObjectRef
    {
        //let bodyCode = () =>
        {
            let copy = new AttributeGroupReferenceImpl(this.ctx, refTo, simpleReference);
            return copy;
        }
        //return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: string | AttributeGroupReference): AttributeGroupReferenceImpl
    {
        //let bodyCode = () =>
        {
            let simpleReference : boolean = true;
            let attributeGroup : string | AttributeGroupImpl;
            if (typeof(object) == "string")
                attributeGroup = object;
            else {
                simpleReference = false;
                if (typeof(object.attributeGroupReference) === "string")
                    attributeGroup = object.attributeGroupReference;
                else 
                    attributeGroup = AttributeGroupImpl.instanceFromData(ctx, object.attributeGroupReference);
            }

            let c: AttributeGroupReferenceImpl = new AttributeGroupReferenceImpl(ctx, attributeGroup, simpleReference);
            return c;
        }
        //return p.measure(bodyCode);
    }
    public getAppliedTraitRefs(): ICdmTraitRef[]
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet
    {
        //let bodyCode = () =>
        {
            let ref = this.getResolvedReference(resOpt);
            if (ref)
                return (ref as AttributeGroupImpl).getResolvedEntityReferences(resOpt);
            if (this.explicitReference)
                return (this.explicitReference as AttributeGroupImpl).getResolvedEntityReferences(resOpt);
            return null;
        }
        //return p.measure(bodyCode);
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeGroupDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeGroupImpl extends cdmObjectDef implements ICdmAttributeGroupDef
{
    attributeGroupName: string;
    members: (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[];
    public attributeContext?: AttributeContextReferenceImpl;

    constructor(ctx:CdmCorpusContext, attributeGroupName: string)
    {
        super(ctx, false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupDef;
            this.attributeGroupName = attributeGroupName;
            this.members = new Array<AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>();
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeGroupDef;
        }
        //return p.measure(bodyCode);
    }
    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean
    {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): AttributeGroup
    {
        //let bodyCode = () =>
        {
            let castedToInterface: AttributeGroup = {
                explanation: this.explanation,
                attributeGroupName: this.attributeGroupName,
                exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options),
                attributeContext: this.attributeContext ? this.attributeContext.copyData(resOpt, options) : undefined,
                members: cdmObject.arraycopyData<string | AttributeGroupReference | TypeAttribute | EntityAttribute>(resOpt, this.members, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new AttributeGroupImpl(this.ctx, this.attributeGroupName);
            copy.members = cdmObject.arrayCopy<AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>(resOpt, this.members);
            copy.attributeContext = this.attributeContext ? <AttributeContextReferenceImpl>this.attributeContext.copy(resOpt) : undefined;
            this.copyDef(resOpt, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.attributeGroupName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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
    public static instanceFromData(ctx: CdmCorpusContext, object: AttributeGroup): AttributeGroupImpl
    {
        //let bodyCode = () =>
        {
            let c: AttributeGroupImpl = new AttributeGroupImpl(ctx, object.attributeGroupName);

            if (object.explanation)
                c.explanation = object.explanation;
            c.attributeContext = cdmObject.createAttributeContextReference(ctx, object.attributeContext);
            c.members = cdmObject.createAttributeArray(ctx, object.members);
            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);

            return c;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.attributeGroupName;
        }
        //return p.measure(bodyCode);
    }
    public getMembersAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[]
    {
        //let bodyCode = () =>
        {
            return this.members;
        }
        //return p.measure(bodyCode);
    }
    public addAttributeDef(attDef: ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef): ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef
    {
        //let bodyCode = () =>
        {
            if (!this.members)
                this.members = new Array<(AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)>();
            this.members.push(attDef as any);
            return attDef;
        }
        //return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
        //let bodyCode = () =>
        {
            let rasb = new ResolvedAttributeSetBuilder();

            if (under) {
                let acpAttGrp : AttributeContextParameters = {
                    under:under,
                    type:cdmAttributeContextType.attributeGroup,
                    name:  this.getName(),
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
                    let acpAtt : AttributeContextParameters;
                    if (under) {
                        acpAtt = {
                            under:under,
                            type:cdmAttributeContextType.attributeDefinition,
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
    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet
    {
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

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
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
class ConstantEntityImpl extends cdmObjectDef implements ICdmConstantEntityDef
{
    constantEntityName: string;
    entityShape: EntityReferenceImpl;
    constantValues: string[][];

    constructor(ctx:CdmCorpusContext)
    {
        super(ctx, false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.constantEntityDef;
        }
        //return p.measure(bodyCode);
    }

    public copyData(resOpt: resolveOptions, options: copyOptions): ConstantEntity
    {
        //let bodyCode = () =>
        {
            let castedToInterface: ConstantEntity = {
                explanation: this.explanation,
                constantEntityName: this.constantEntityName,
                entityShape: this.entityShape ? this.entityShape.copyData(resOpt, options) : undefined,
                constantValues: this.constantValues
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new ConstantEntityImpl(this.ctx);
            copy.constantEntityName = this.constantEntityName;
            copy.entityShape = <EntityReferenceImpl>this.entityShape.copy(resOpt);
            copy.constantValues = this.constantValues; // is a deep copy needed? 
            this.copyDef(resOpt, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.entityShape ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.constantEntityDef;
        }
        //return p.measure(bodyCode);
    }
    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean
    {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: ConstantEntity): ConstantEntityImpl
    {

        //let bodyCode = () =>
        {
            let c: ConstantEntityImpl = new ConstantEntityImpl(ctx);
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
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.constantEntityName;
        }
        //return p.measure(bodyCode);
    }
    public getEntityShape(): ICdmEntityRef
    {
        //let bodyCode = () =>
        {
            return this.entityShape;
        }
        //return p.measure(bodyCode);
    }
    public setEntityShape(shape: ICdmEntityRef): ICdmEntityRef
    {
        //let bodyCode = () =>
        {
            this.entityShape = shape as EntityReferenceImpl;
            return this.entityShape;
        }
        //return p.measure(bodyCode);
    }

    public getConstantValues(): string[][]
    {
        //let bodyCode = () =>
        {
            return this.constantValues;
        }
        //return p.measure(bodyCode);
    }
    public setConstantValues(values: string[][]): string[][]
    {
        //let bodyCode = () =>
        {
            this.constantValues = values;
            return this.constantValues;
        }
        //return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }

    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
        //let bodyCode = () =>
        {
            let rasb = new ResolvedAttributeSetBuilder();
            let acpEnt : AttributeContextParameters;
            if (under) {
                acpEnt = {
                    under:under,
                    type:cdmAttributeContextType.entity,
                    name:  this.entityShape.getObjectDefName(),
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
    findValue(resOpt: resolveOptions, attReturn: string | number, attSearch: string | number, valueSearch: string, action: (found : string)=>string)
    {
        //let bodyCode = () =>
        {
            let resultAtt = -1;
            let searchAtt = -1;

            if (typeof(attReturn) === "number")
                resultAtt = attReturn;
            if (typeof(attSearch) === "number")
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

    public lookupWhere(resOpt: resolveOptions, attReturn: string | number, attSearch: string | number, valueSearch: string): string
    {
        //let bodyCode = () =>
        {
            let result : string;
            this.findValue(resOpt, attReturn, attSearch, valueSearch, found=>{ result = found; return found;})
            return result;
        }
        //return p.measure(bodyCode);
    }
    public setWhere(resOpt: resolveOptions, attReturn: string | number, newValue: string, attSearch: string | number, valueSearch: string) : string {
        //let bodyCode = () =>
        {
            let result : string;
            this.findValue(resOpt, attReturn, attSearch, valueSearch, found=>{ result = found; return newValue; })
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
class AttributeContextReferenceImpl extends cdmObjectRef
{
    constructor(ctx:CdmCorpusContext, name: string)
    {
        super(ctx, name, true, false);
        this.objectType = cdmObjectType.attributeContextRef;
    }
    public getObjectType(): cdmObjectType
    {
        return cdmObjectType.attributeContextRef;
    }
    public copyRefData(resOpt: resolveOptions, copy : AttributeGroupReference, refTo : any, options: copyOptions) 
    {
    }
    public copyRefObject(resOpt: resolveOptions, refTo : string, simpleReference: boolean): cdmObjectRef
    {
        let copy = new AttributeContextReferenceImpl(this.ctx, refTo);
        return copy;
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: string): AttributeContextReferenceImpl
    {
        if (typeof(object) == "string")
            return new AttributeContextReferenceImpl(ctx, object);
        return null;
    }
    public getAppliedTraitRefs(): ICdmTraitRef[]
    {
        return null;
    }
    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//  {AttributeContext}
////////////////////////////////////////////////////////////////////////////////////////////////////
class AttributeContextImpl extends cdmObjectDef implements ICdmAttributeContext
{
    type: cdmAttributeContextType;
    parent?: ICdmObjectRef;
    definition?: ICdmObjectRef;
    contents?: (ICdmObjectRef | ICdmAttributeContext)[];
    name: string;
    lowestOrder: number;
    id2ctx: Map<number, AttributeContextImpl>;

    constructor(ctx:CdmCorpusContext, name: string)
    {
        super(ctx, false);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeContextDef;
            this.name = name;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.attributeContextDef;
        }
        //return p.measure(bodyCode);
    }
    static mapTypeNameToEnum(typeName : string) : cdmAttributeContextType
    {
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
    static mapEnumToTypeName(enumVal : cdmAttributeContextType) : string
    {
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
    public copyData(resOpt: resolveOptions, options: copyOptions): AttributeContext
    {
        //let bodyCode = () =>
        {
            let castedToInterface: AttributeContext = {
                explanation: this.explanation,
                name: this.name,
                type: AttributeContextImpl.mapEnumToTypeName(this.type),
                parent: this.parent ? this.parent.copyData(resOpt, options) : undefined,
                definition: this.definition ? this.definition.copyData(resOpt, options) : undefined,
                // i know the trait collection names look wrong. but I wanted to use the def baseclass
                appliedTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options),
                contents: cdmObject.arraycopyData<string | AttributeContext>(resOpt, this.contents, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new AttributeContextImpl(this.ctx, this.name);
            // because resolved attributes indirect to the context they are created in by way of id, use the same ID for a copy.
            copy.ID = this.ID;
            copy.type = this.type;
            copy.docCreatedIn = resOpt.wrtDoc as DocumentImpl;
            if (this.parent)
                copy.parent = this.parent.copy(resOpt);
            if (this.definition)
                copy.definition = this.definition.copy(resOpt);
            copy.contents = cdmObject.arrayCopy<ICdmObjectRef | ICdmAttributeContext>(resOpt, this.contents as any);
            // need to fix the parent refs
            if (copy.contents) {
                for (const cnt of copy.contents) {
                    if (cnt.getObjectType() == cdmObjectType.attributeContextDef) {
                        let parentRef = (cnt as AttributeContextImpl).parent as cdmObjectRef;
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

    public collectIdMap(id2ctx:Map<number, AttributeContextImpl>) {
        //let bodyCode = () =>
        {
            if (!id2ctx) {
                // this must be the starting point, collect all mappings under this context and store here
                if (!this.id2ctx)
                    this.id2ctx = new Map<number, AttributeContextImpl>();
                id2ctx = this.id2ctx;
            }
            if (this.id2ctx && this.id2ctx.size > 0) {
                // a map has been collected here before (any may even have extra, important mappings added), so just copy it.
                if (id2ctx != this.id2ctx)
                    this.id2ctx.forEach((v, k)=> {id2ctx.set(k, v);});
            }
            else {
                // fresh map, us and children
                id2ctx.set(this.ID, this);
                if (this.contents) {
                    for (const cnt of this.contents) {
                        if (cnt.getObjectType() == cdmObjectType.attributeContextDef) {
                            (cnt as AttributeContextImpl).collectIdMap(id2ctx);
                        }
                    }
                }
            }
        }
        //return p.measure(bodyCode);

    }
    
    public validate(): boolean
    {
        return this.name && this.type != undefined;
    }

    public getFriendlyFormat(): friendlyFormatNode
    {
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
    public static instanceFromData(ctx: CdmCorpusContext, object: AttributeContext): AttributeContextImpl
    {
        //let bodyCode = () =>
        {
            let c: AttributeContextImpl = ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, object.name)
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
                c.contents = new Array<ICdmObjectRef | ICdmAttributeContext>();
                let l = object.contents.length;
                for (let i = 0; i < l; i++) {
                    const ct = object.contents[i];
                    if (typeof(ct) === "string")
                        c.contents.push(AttributeReferenceImpl.instanceFromData(ctx, ct));
                    else
                        c.contents.push(AttributeContextImpl.instanceFromData(ctx, ct));
                }
            }
            return c;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }

    public getContentRefs(): (ICdmObjectRef | ICdmAttributeContext)[] {
        //let bodyCode = () =>
        {
            if (!this.contents)
                this.contents = new Array<ICdmObjectRef | ICdmAttributeContext>();
            return this.contents;
        }
        //return p.measure(bodyCode);
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
                if (cdmObject.visitArray(this.contents as any as cdmObject[], path + "/", preChildren, postChildren)) // fix that as any. 
                    return true;

            if (this.visitDef(path, preChildren, postChildren))
                return true;
            if (postChildren && postChildren(this, path))
                return true;
            return false;
        }
        //return p.measure(bodyCode);
    }

    public getRelativePath(resOpt: resolveOptions): string
    {
        let pre = "";
        if (this.parent) {
            let resParent = this.parent.getObjectDef<ICdmAttributeContext>(resOpt);
            if (resParent)
                pre = resParent.getRelativePath(resOpt) + "/";

        }
        return pre + this.name;
    }
    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean
    {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }

    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }

    public static createChildUnder(resOpt: resolveOptions, acp: AttributeContextParameters) : AttributeContextImpl {
        //let bodyCode = () =>
        {
            if (!acp)
                return undefined;

            if (acp.type === cdmAttributeContextType.passThrough)
                return acp.under as AttributeContextImpl;

            // this flag makes sure we hold on to any resolved object refs when things get coppied
            let resOptCopy = cdmObject.copyResolveOptions(resOpt);
            resOptCopy.saveResolutionsOnCopy = true;
    

            let definition : ICdmObjectRef;
            let rtsApplied : ResolvedTraitSet;
            // get a simple reference to definition object to avoid getting the traits that might be part of this ref
            // included in the link to the definition.
            if (acp.regarding) {
                definition = acp.regarding.createSimpleReference(resOptCopy);
                // now get the traits applied at this reference (applied only, not the ones that are part of the definition of the object)
                // and make them the traits for this context
                if (acp.includeTraits)
                    rtsApplied = acp.regarding.getResolvedTraits(resOptCopy);
            }

            let underChild = acp.under.ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, acp.name) as AttributeContextImpl;
            // need context to make this a 'live' object
            underChild.ctx = acp.under.ctx;
            underChild.docCreatedIn = (acp.under as AttributeContextImpl).docCreatedIn;
            underChild.type = acp.type;
            underChild.definition = definition;
            // add traits if there are any
            if (rtsApplied && rtsApplied.set) {
                rtsApplied.set.forEach(rt => {
                    let traitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                    underChild.addExhibitedTrait(traitRef, typeof(traitRef) === "string");
                });
            }

            // add to parent
            underChild.setParent(resOptCopy, acp.under as AttributeContextImpl);

            return underChild;
        }
        //return p.measure(bodyCode);
    }
    public setParent(resOpt: resolveOptions, parent: AttributeContextImpl) 
    {
        //let bodyCode = () =>
        {
            // will need a working reference to this as the parent
            let parentRef = this.ctx.corpus.MakeObject(cdmObjectType.attributeContextRef, parent.getRelativePath(resOpt), true) as cdmObjectRef;
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
class EntityReferenceImpl extends cdmObjectRef implements ICdmObjectRef
{
    constructor(ctx:CdmCorpusContext, entityRef: string | EntityImpl | ConstantEntityImpl, simpleReference : boolean, appliedTraits: boolean)
    {
        super(ctx, entityRef, simpleReference, appliedTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityRef;
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityRef;
        }
        //return p.measure(bodyCode);
    }
    public copyRefData(resOpt: resolveOptions, copy : EntityReference, refTo : string | Entity, options: copyOptions) 
    {
        //let bodyCode = () =>
        {
            copy.entityReference = refTo;
        }
        //return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo : string | EntityImpl | ConstantEntityImpl, simpleReference: boolean): cdmObjectRef
    {
        //let bodyCode = () =>
        {
            let copy = new EntityReferenceImpl(this.ctx, refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: string | EntityReference): EntityReferenceImpl
    {

        //let bodyCode = () =>
        {
            let simpleReference : boolean = true;
            let entity : string | EntityImpl | ConstantEntityImpl;
            let appliedTraits : (string | TraitReference)[] = null;
            if (typeof(object) == "string")
                entity = object;
            else {
                simpleReference = false;
                appliedTraits = object.appliedTraits;
                if (typeof(object.entityReference) === "string")
                    entity = object.entityReference;
                else if (isConstantEntity(object.entityReference))
                    entity = ConstantEntityImpl.instanceFromData(ctx, object.entityReference);
                else
                    entity = EntityImpl.instanceFromData(ctx, object.entityReference);
                }

            let c: EntityReferenceImpl = new EntityReferenceImpl(ctx, entity, simpleReference, !!appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, appliedTraits);
            return c;
        }
        //return p.measure(bodyCode);
    }
    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
class EntityImpl extends cdmObjectDef implements ICdmEntityDef
{
    entityName: string;
    extendsEntity?: EntityReferenceImpl;
    hasAttributes?: (AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)[];
    public attributeContext?: AttributeContextImpl;
    rasb: ResolvedAttributeSetBuilder;
    t2pm: traitToPropertyMap;

    constructor(ctx:CdmCorpusContext, entityName: string, extendsEntity: EntityReferenceImpl, exhibitsTraits: boolean, hasAttributes: boolean)
    {
        super(ctx, exhibitsTraits);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityDef;
            this.entityName = entityName;
            if (extendsEntity)
                this.extendsEntity = extendsEntity;
            if (hasAttributes)
                this.hasAttributes = new Array<(AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)>();
        }
        //return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.entityDef;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Entity
    {
        //let bodyCode = () =>
        {
            let castedToInterface: Entity = {
                explanation: this.explanation,
                entityName: this.entityName,
                extendsEntity: this.extendsEntity ? this.extendsEntity.copyData(resOpt, options) : undefined,
                exhibitsTraits: cdmObject.arraycopyData<string | TraitReference>(resOpt, this.exhibitsTraits, options),
            };
            this.getTraitToPropertyMap().persistForEntityDef(castedToInterface, options);
            // after the properties so they show up first in doc
            if (this.hasAttributes) {
                castedToInterface.hasAttributes = cdmObject.arraycopyData<string | AttributeGroupReference | TypeAttribute | EntityAttribute>(resOpt, this.hasAttributes, options);
                castedToInterface.attributeContext = this.attributeContext ? this.attributeContext.copyData(resOpt, options) : undefined;
            }

            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let copy = new EntityImpl(this.ctx, this.entityName, null, false, false);
            copy.extendsEntity = copy.extendsEntity ? <EntityReferenceImpl>this.extendsEntity.copy(resOpt) : undefined;
            copy.attributeContext = copy.attributeContext ? <AttributeContextImpl>this.attributeContext.copy(resOpt) : undefined;
            copy.hasAttributes = cdmObject.arrayCopy<AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl>(resOpt, this.hasAttributes);
            this.copyDef(resOpt, copy);
            return copy;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.entityName ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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
    public static instanceFromData(ctx: CdmCorpusContext, object: Entity): EntityImpl
    {
        //let bodyCode = () =>
        {

            let extendsEntity: EntityReferenceImpl;
            extendsEntity = cdmObject.createEntityReference(ctx, object.extendsEntity);
            let c: EntityImpl = new EntityImpl(ctx, object.entityName, extendsEntity, !!object.exhibitsTraits, !!object.hasAttributes);

            if (object.explanation)
                c.explanation = object.explanation;

            c.exhibitsTraits = cdmObject.createTraitReferenceArray(ctx, object.exhibitsTraits);
            if (object.attributeContext)
                c.attributeContext = cdmObject.createAttributeContext(ctx, object.attributeContext);

            c.hasAttributes = cdmObject.createAttributeArray(ctx, object.hasAttributes);
            c.t2pm = new traitToPropertyMap();
            c.t2pm.initForEntityDef(ctx, object as Entity, c);

            return c;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.entityName;
        }
        //return p.measure(bodyCode);
    }
    public getExtendsEntityRef(): ICdmObjectRef
    {
        //let bodyCode = () =>
        {
            return this.extendsEntity;
        }
        //return p.measure(bodyCode);
    }
    public setExtendsEntityRef(ref: ICdmObjectRef): ICdmObjectRef
    {
        //let bodyCode = () =>
        {
            this.extendsEntity = ref as EntityReferenceImpl;
            return this.extendsEntity;
        }
        //return p.measure(bodyCode);
    }
    public getHasAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[]
    {
        //let bodyCode = () =>
        {
            return this.hasAttributes;
        }
        //return p.measure(bodyCode);
    }
    public addAttributeDef(attDef: ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef): ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef
    {
        //let bodyCode = () =>
        {
            if (!this.hasAttributes)
                this.hasAttributes = new Array<(AttributeGroupReferenceImpl | TypeAttributeImpl | EntityAttributeImpl)>();
            this.hasAttributes.push(attDef as any);
            return attDef;
        }
        //return p.measure(bodyCode);
    }
    getTraitToPropertyMap()
    {
        if (this.t2pm)
            return this.t2pm;
        this.t2pm = new traitToPropertyMap();
        this.t2pm.initForEntityDef(this.ctx, null, this);
        return this.t2pm;
    }

    public get sourceName() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("sourceName");
    }
    public set sourceName(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("sourceName", val);
    }
    public get description() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("description");
    }
    public set description(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("description", val);
    }
    public get displayName() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("displayName");
    }
    public set displayName(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("displayName", val);
    }
    public get version() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("version");
    }
    public set version(val: string)
    {
        this.getTraitToPropertyMap().setPropertyValue("version", val);
    }
    public get cdmSchemas() : string[]
    {
        return this.getTraitToPropertyMap().getPropertyValue("cdmSchemas");
    }
    public set cdmSchemas(val: string[])
    {
        this.getTraitToPropertyMap().setPropertyValue("cdmSchemas", val);
    }
    public get primaryKey() : string
    {
        return this.getTraitToPropertyMap().getPropertyValue("primaryKey");
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
    public isDerivedFrom(resOpt: resolveOptions, base: string): boolean
    {
        //let bodyCode = () =>
        {
            return this.isDerivedFromDef(resOpt, this.getExtendsEntityRef(), this.getName(), base);
        }
        //return p.measure(bodyCode);
    }

    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
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

    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
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
                let extendsRefUnder : ICdmAttributeContext;
                let acpExtEnt : AttributeContextParameters;
                if (under) {
                    let acpExt : AttributeContextParameters = {
                        under:under,
                        type:cdmAttributeContextType.entityReferenceExtends,
                        name:  "extends",
                        regarding: null,
                        includeTraits: false
                    };
                    extendsRefUnder = this.rasb.createAttributeContext(resOpt, acpExt);
                    acpExtEnt = {
                        under:extendsRefUnder,
                        type:cdmAttributeContextType.entity,
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
                    let acpAtt : AttributeContextParameters;
                    if (under) {
                        acpAtt = {
                            under:under,
                            type:cdmAttributeContextType.attributeDefinition,
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

    public countInheritedAttributes(resOpt: resolveOptions): number
    {
        //let bodyCode = () =>
        {
            // ensures that cache exits
            this.getResolvedAttributes(resOpt);
            return this.rasb.inheritedMark;
        }
        //return p.measure(bodyCode);
    }

    public getResolvedEntity(resOpt: resolveOptions) : ResolvedEntity {
        return new ResolvedEntity(resOpt, this);
    }

    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet
    {
        //let bodyCode = () =>
        {
            // this whole resolved entity ref goo will go away when resolved documents are done.
            // for now, it breaks if structured att sets get made.
            resOpt = cdmObject.copyResolveOptions(resOpt);
            resOpt.directives = new TraitDirectiveSet(new Set<string> (["normalized", "referenceOnly"]));
            
            let ctx=this.ctx as resolveContext; // what it actually is
            let entRefSetCache = ctx.getCache(this, resOpt, "entRefSet") as ResolvedEntityReferenceSet;
            if (!entRefSetCache) {
                entRefSetCache = new ResolvedEntityReferenceSet(resOpt);
                // get from any base class and then 'fix' those to point here instead.
                let extRef = this.getExtendsEntityRef();
                if (extRef) {
                    let extDef = extRef.getObjectDef<ICdmEntityDef>(resOpt);
                    if (extDef) {
                        if (extDef === this)
                            extDef = extRef.getObjectDef<ICdmEntityDef>(resOpt);
                        let inherited = extDef.getResolvedEntityReferences(resOpt);
                        if (inherited) {
                            inherited.set.forEach((res) =>
                            {
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
                            sub.set.forEach((res) =>
                            {
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

    getAttributesWithTraits(resOpt: resolveOptions, queryFor: TraitSpec | TraitSpec[]): ResolvedAttributeSet
    {
        //let bodyCode = () =>
        {
            return this.getResolvedAttributes(resOpt).getAttributesWithTraits(resOpt, queryFor);
        }
        //return p.measure(bodyCode);
    }

    createResolvedEntity(resOpt: resolveOptions, newEntName: string) : ICdmEntityDef
    {
        //let bodyCode = () =>
        {
            // make the top level attribute context for this entity
            let entName = newEntName;
            let ctx = this.ctx as resolveContext;
            let attCtxEnt : AttributeContextImpl = ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, entName, true);
            attCtxEnt.ctx = ctx;
            attCtxEnt.docCreatedIn = this.docCreatedIn;

            // cheating a bit to put the paths in the right place
            let acp : AttributeContextParameters = {
                    under:attCtxEnt,
                    type:cdmAttributeContextType.attributeGroup,
                    name: "attributeContext"
                };
            let attCtxAC = AttributeContextImpl.createChildUnder(resOpt, acp);
            let acpEnt : AttributeContextParameters = {
                    under:attCtxAC,
                    type:cdmAttributeContextType.entity,
                    name: entName,
                    regarding:ctx.corpus.MakeObject(cdmObjectType.entityRef, this.getName(), true)
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
            (attCtx as AttributeContextImpl).setParent(resOpt, attCtxAC as AttributeContextImpl);
            // the context should now contain a mapping from ID to context node. the resolved attributes will use these IDs
            let id2ctx = (attCtx as AttributeContextImpl).id2ctx;

            // the attributes have been named, shaped, etc for this entity so now it is safe to go and 
            // make each attribute context level point at these final versions of attributes
            let attPath2Order = new Map<string, number>();
            let pointContextAtResolvedAtts = (rasSub : ResolvedAttributeSet, path: string) => {
                rasSub.set.forEach(ra => {
                    let raCtx = id2ctx.get(ra.createdContextId);
                    if (raCtx) {
                        let refs = raCtx.getContentRefs();
                        // this won't work when I add the structured attributes to avoid name collisions
                        let attRefPath = path + ra.resolvedName;
                        if ((ra.target as ICdmAttributeDef).getObjectType) {
                            let attRef : ICdmObjectRef = this.ctx.corpus.MakeObject(cdmObjectType.attributeRef, attRefPath, true);
                            attPath2Order.set(attRef.getObjectDefName(), ra.insertOrder);
                            refs.push(attRef);
                        }
                        else {
                            attRefPath += '/members/';
                            pointContextAtResolvedAtts(ra.target as ResolvedAttributeSet, attRefPath);
                        }
                    }
                });
            }

            pointContextAtResolvedAtts(ras, entName + '/hasAttributes/');

            // attribute structures may end up with 0 attributes after that. prune them
            let emptyStructures = new Array<[ICdmAttributeContext, ICdmAttributeContext]>();
            let findEmpty = (under: ICdmAttributeContext) : boolean =>{
                let isEmpty = true;
                under.getContentRefs().forEach(cr => {
                    if (cr.getObjectType() == cdmObjectType.attributeContextDef) {
                        if (findEmpty(cr as ICdmAttributeContext)) {
                            if (!(cr as ICdmAttributeContext).getExhibitedTraitRefs()) {
                                // empty child, remember for later
                                emptyStructures.push([under, cr as ICdmAttributeContext]);
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
            }
            findEmpty(attCtx);
            // remove all the empties that were found
            emptyStructures.forEach(empty => {
                let content = empty["0"].getContentRefs();
                content.splice(content.indexOf(empty["1"]), 1);
            });

            // create an all-up ordering of attributes at the leaves of this tree based on insert order
            // sort the attributes in each context by their creation order and mix that with the other sub-contexts that have been sorted
            let getOrderNum = (item: ICdmObject): number =>{
                if (item.getObjectType() == cdmObjectType.attributeContextDef) {
                    return orderContents(item as AttributeContextImpl);
                }
                else {
                    let attName = item.getObjectDefName();
                    let o = attPath2Order.get(attName);
                    return o;
                }
            };
            let orderContents = (under: AttributeContextImpl) : number => {
                if (under.lowestOrder == undefined) {
                    under.lowestOrder = -1; // used for group with nothing but traits
                    if (under.contents.length == 1) {
                        under.lowestOrder = getOrderNum(under.contents[0]);
                    }
                    else {
                        under.contents = under.contents.sort((l : ICdmObject, r : ICdmObject): number => {
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
            orderContents(attCtx as AttributeContextImpl);

            // make a new document in the same folder as the source entity
            let folder = this.declaredInDocument.getFolder();
            let fileName = newEntName+".cdm.json";
            folder.removeDocument(fileName);
            let docRes = folder.addDocument(fileName, "") as DocumentImpl;
            // add a import of the source document
            docRes.addImport(this.declaredInDocument.getFolder().getRelativePath() + this.declaredInDocument.getName(), "");
            
            // make the empty entity
            let entResolved = docRes.addDefinition<ICdmEntityDef>(cdmObjectType.entityDef, entName);
            entResolved.attributeContext = attCtx;

            // add the traits of the entity
            let rtsEnt = this.getResolvedTraits(resOpt);
            rtsEnt.set.forEach(rt => {
                let traitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                entResolved.addExhibitedTrait(traitRef, typeof(traitRef) === "string");
            });

            // resolved attributes can gain traits that are applied to an entity when referenced
            // since these traits are described in the context, it is redundant and messy to list them in the attribute
            // so, remove them. create and cache a set of names to look for per context 
            // there is actuall a hierarchy to this. all attributes from the base entity should have all traits applied independed of the 
            // sub-context they come from. Same is true of attribute entities. so do this recursively top down
            let ctx2traitNames = new Map<ICdmAttributeContext, Set<string>>();
            let collectContextTraits = (subAttCtx: ICdmAttributeContext, inheritedTraitNames: Set<string> ) => {
                let traitNamesHere = new Set<string>(inheritedTraitNames);
                let traitsHere = subAttCtx.getExhibitedTraitRefs();
                if (traitsHere)
                    traitsHere.forEach((tat)=>{traitNamesHere.add(tat.getObjectDefName())});
                ctx2traitNames.set(subAttCtx, traitNamesHere);
                subAttCtx.getContentRefs().forEach((cr)=>{
                    if (cr.getObjectType() == cdmObjectType.attributeContextDef) {
                        // do this for all types?
                        collectContextTraits(cr as ICdmAttributeContext, traitNamesHere);
                    }
                });

            }
            collectContextTraits(attCtx, new Set<string>());

            // add the attributes, put them in attribute groups if structure needed
            let resAtt2RefPath = new Map<ResolvedAttribute, string>();
            let addAttributes = (rasSub: ResolvedAttributeSet, container: ICdmEntityDef | ICdmAttributeGroupDef, path) => {
                rasSub.set.forEach(ra => {
                    let attPath = path + ra.resolvedName;
                    // use the path of the context associated with this attribute to find the new context that matches on path
                    let raCtx = id2ctx.get(ra.createdContextId);
                    if ((ra.target as ResolvedAttributeSet).set) {
                        // this is a set of attributes.
                        // make an attribute group to hold them
                        let attGrp = this.ctx.corpus.MakeObject<ICdmAttributeGroupDef>(cdmObjectType.attributeGroupDef, ra.resolvedName);
                        attGrp.attributeContext = this.ctx.corpus.MakeObject(cdmObjectType.attributeContextRef, raCtx.getRelativePath(resOpt), true);
                        // take any traits from the set and make them look like traits exhibited by the group
                        let avoidSet = ctx2traitNames.get(raCtx);
                        let rtsAtt = ra.resolvedTraits;
                        rtsAtt.set.forEach(rt => {
                            if (!rt.trait.ugly) { // don't mention your ugly traits
                                if (avoidSet && !avoidSet.has(rt.traitName)) { // avoid the ones from the context
                                    let traitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                                    attGrp.addExhibitedTrait(traitRef, typeof(traitRef) === "string");
                                }
                            }
                        });

                        // wrap it in a reference and then recurse with this as the new container
                        let attGrpRef = this.ctx.corpus.MakeObject<ICdmAttributeGroupRef>(cdmObjectType.attributeGroupRef, undefined);
                        attGrpRef.setObjectDef(attGrp);
                        container.addAttributeDef(attGrpRef);
                        // isn't this where ...
                        addAttributes(ra.target as ResolvedAttributeSet, attGrp, attPath+'/members/');
                    }
                    else {
                        let att = this.ctx.corpus.MakeObject<ICdmTypeAttributeDef>(cdmObjectType.typeAttributeDef, ra.resolvedName);
                        att.attributeContext = this.ctx.corpus.MakeObject(cdmObjectType.attributeContextRef, raCtx.getRelativePath(resOpt), true);
                        let avoidSet = ctx2traitNames.get(raCtx);
                        let rtsAtt = ra.resolvedTraits;
                        rtsAtt.set.forEach(rt => {
                            if (!rt.trait.ugly) { // don't mention your ugly traits
                                if (avoidSet && !avoidSet.has(rt.traitName)) { // avoid the ones from the context
                                    let traitRef = cdmObject.resolvedTraitToTraitRef(resOptCopy, rt);
                                    att.addAppliedTrait(traitRef, typeof(traitRef) === "string");
                                }
                            }
                        });
                        container.addAttributeDef(att);
                        resAtt2RefPath.set(ra, attPath);
                    }
                });
            }
            addAttributes(ras, entResolved, entName + '/hasAttributes/');

            // any resolved traits that hold arguments with attribute refs should get 'fixed' here
            let replaceTraitAttRef = (tr:ICdmTraitRef, entityHint: string) => {
                if (tr.getArgumentDefs()) {
                    tr.getArgumentDefs().forEach(arg => {
                        let v = arg.getValue();
                        // is this an attribute reference?
                        if (v && (v as ICdmObject).getObjectType && (v as ICdmObject).getObjectType() == cdmObjectType.attributeRef) {
                            // only try this if the reference has no path to it (only happens with intra-entity att refs)
                            let attRef = v as AttributeReferenceImpl;
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
            }

            // fix entity traits
            if (entResolved.getExhibitedTraitRefs())
                entResolved.getExhibitedTraitRefs().forEach(et => {
                    replaceTraitAttRef(et, newEntName);
                });

            // fix context traits
            let fixContextTraits = (subAttCtx: ICdmAttributeContext, entityHint: string) => {
                let traitsHere = subAttCtx.getExhibitedTraitRefs();
                if (traitsHere)
                    traitsHere.forEach((tr)=>{replaceTraitAttRef(tr, entityHint)});
                subAttCtx.getContentRefs().forEach((cr)=>{
                    if (cr.getObjectType() == cdmObjectType.attributeContextDef) {
                        // if this is a new entity context, get the name to pass along
                        let subSubAttCtx = cr as ICdmAttributeContext;
                        let subEntityHint = entityHint;
                        if (subSubAttCtx.type === cdmAttributeContextType.entity)
                            subEntityHint = subSubAttCtx.definition.getObjectDefName();
                        // do this for all types
                        fixContextTraits(subSubAttCtx, subEntityHint);
                    }
                });

            }
            fixContextTraits(attCtx, newEntName);
            // and the attribute traits
            let entAtts = entResolved.getHasAttributeDefs();
            if (entAtts) {
                let l = entAtts.length;
                for (let i=0; i<l; i++) {
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
            entResolved = docRes.getObjectFromDocumentPath(entName) as ICdmEntityDef;

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
class DocumentImpl extends cdmObjectSimple implements ICdmDocumentDef  
{
    name: string;
    path: string;
    schema: string;
    jsonSchemaSemanticVersion: string;
    imports: ImportImpl[];
    definitions: (TraitImpl | DataTypeImpl | RelationshipImpl | AttributeGroupImpl | EntityImpl | ConstantEntityImpl)[];
    importSetKey: string;
    folder: FolderImpl;
    internalDeclarations: Map<string, cdmObjectDef>;
    importPriority: Map<DocumentImpl, number>;
    monikerPriorityMap: Map<string, DocumentImpl>;
    pathsToOtherDocuments: Map<DocumentImpl, string>;

    constructor(ctx:CdmCorpusContext, name: string, hasImports: boolean)
    {
        super(ctx);
        //let bodyCode = () =>
        {
            this.objectType = cdmObjectType.documentDef;
            this.name = name;
            this.jsonSchemaSemanticVersion = "0.7.0";

            this.definitions = new Array<TraitImpl | DataTypeImpl | RelationshipImpl | AttributeGroupImpl | EntityImpl | ConstantEntityImpl>();
            if (hasImports)
                this.imports = new Array<ImportImpl>();
            this.clearCaches();
        }
        //return p.measure(bodyCode);
    }
    clearCaches()
    {
        this.internalDeclarations = new Map<string, cdmObjectDef>();
    }
    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.documentDef;
        }
        //return p.measure(bodyCode);
    }
    public getObjectDef<T=ICdmObjectDef>(resOpt: resolveOptions): T
    {
        return null;
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): DocumentContent
    {
        //let bodyCode = () =>
        {
            let castedToInterface: DocumentContent = {
                schema: this.schema,
                jsonSchemaSemanticVersion: this.jsonSchemaSemanticVersion,
                imports: cdmObject.arraycopyData<Import>(resOpt, this.imports, options),
                definitions: cdmObject.arraycopyData<Trait | DataType | Relationship | AttributeGroup | Entity | ConstantEntity>(resOpt, this.definitions, options)
            };
            return castedToInterface;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            let c = new DocumentImpl(this.ctx, this.name, (this.imports && this.imports.length > 0));
            c.ctx = this.ctx;
            c.path = this.path;
            c.schema = this.schema;
            c.jsonSchemaSemanticVersion = this.jsonSchemaSemanticVersion;
            c.definitions = cdmObject.arrayCopy<TraitImpl | DataTypeImpl | RelationshipImpl | AttributeGroupImpl | EntityImpl | ConstantEntityImpl>(resOpt, this.definitions);
            c.imports = cdmObject.arrayCopy<ImportImpl>(resOpt, this.imports);
            return c;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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

    public constructResolvedAttributes(resOpt: resolveOptions, under? :ICdmAttributeContext): ResolvedAttributeSetBuilder
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, name: string, path: string, object: any): DocumentImpl
    {
        //let bodyCode = () =>
        {

            let doc: DocumentImpl = new DocumentImpl(ctx, name, object.imports);
            doc.path = path;
            // set this as the current doc of the context for this operation
            (ctx as resolveContext).currentDoc = doc;

            if (object.$schema)
                doc.schema = object.$schema;
            // support old model syntax
            if (object.schemaVersion)
                doc.jsonSchemaSemanticVersion = object.schemaVersion;
            if (object.jsonSchemaSemanticVersion)
                doc.jsonSchemaSemanticVersion = object.jsonSchemaSemanticVersion;
            if (doc.jsonSchemaSemanticVersion != "0.7.0") {
                // TODO: validate that this is a version we can understand with the OM
            }
            
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
            (ctx as resolveContext).currentDoc = undefined;

            return doc;
        }
        //return p.measure(bodyCode);
    }

    public addImport(corpusPath: string, moniker: string): void
    {
        //let bodyCode = () =>
        {
            if (!this.imports)
                this.imports = new Array<ImportImpl>();
            let i = new ImportImpl(this.ctx, corpusPath, moniker);
            i.ctx = this.ctx;
            this.imports.push(i)
            
        }
        //return p.measure(bodyCode);
    }
    public getImports(): ICdmImport[]
    {
        //let bodyCode = () =>
        {
            return this.imports;
        }
        //return p.measure(bodyCode);
    }

    public addDefinition<T>(ofType: cdmObjectType, name: string): T
    {
        //let bodyCode = () =>
        {
            let newObj: any = this.ctx.corpus.MakeObject<ICdmObject>(ofType, name);
            if (newObj != null) {
                this.definitions.push(newObj);
                (newObj as cdmObject).docCreatedIn = this;
            }
            return newObj;
        }
        //return p.measure(bodyCode);
    }

    public getSchema(): string
    {
        //let bodyCode = () =>
        {
            return this.schema;
        }
        //return p.measure(bodyCode);
    }
    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    public setName(name: string): string
    {
        //let bodyCode = () =>
        {
            this.name = name;
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    public getSchemaVersion(): string
    {
        //let bodyCode = () =>
        {
            return this.jsonSchemaSemanticVersion;
        }
        //return p.measure(bodyCode);
    }
    public getDefinitions(): (ICdmTraitDef | ICdmDataTypeDef | ICdmRelationshipDef | ICdmAttributeGroupDef | ICdmEntityDef | ICdmConstantEntityDef)[]
    {
        //let bodyCode = () =>
        {
            return this.definitions;
        }
        //return p.measure(bodyCode);
    }
    public getFolder(): ICdmFolderDef
    {
        return this.folder;
    } 

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
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
    public refresh(resOpt: resolveOptions) 
    {
        //let bodyCode = () =>
        {
            // make the corpus internal machinery pay attention to this document for this call
            let corpus = this.folder.corpus;
            let oldDoc = (corpus.ctx as resolveContext).currentDoc;
            (corpus.ctx as resolveContext).currentDoc = this;
            // remove all of the cached paths and resolved pointers
            this.visit("", null, (iObject: ICdmObject, path: string) =>
            {
                (iObject as cdmObject).declaredPath = undefined;
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
            (corpus.ctx as resolveContext).currentDoc = oldDoc;
        }
        //return p.measure(bodyCode);
    }

    public prioritizeImports(priorityMap: Map<DocumentImpl, number>, sequence:number, monikerMap: Map<string, DocumentImpl>, skipThis = false, skipMonikered=false) : number
    {
        //let bodyCode = () =>
        {
            // goal is to make a map from the reverse order of imports (depth first) to the sequence number in that list
            // since the 'last' definition for a duplicate symbol wins, the lower in this list a document shows up, the higher priority its definitions are for
            // resolving conflicts
            if (priorityMap == undefined) {
                this.importPriority = new Map<DocumentImpl, number>();
                priorityMap = this.importPriority;
            }
            if (monikerMap == undefined) {
                this.monikerPriorityMap = new Map<string, DocumentImpl>();
                monikerMap = this.monikerPriorityMap;
            }
            // if already in list, don't do this again
            if (priorityMap.has(this))
                return sequence;
            if (skipThis == false) {
                // remember the sequence this way put in the list
                priorityMap.set(this, sequence);
                sequence ++;
            }
            // may have avoided this level, but don't avoid deeper. this flag is used to get the dependencies from moniker imports without getting the import itself
            skipThis = false;
            
            if (this.imports) {
                let l = this.imports.length;
                // reverse order
                for (let i = l-1; i >= 0; i--) {
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

    public getObjectFromDocumentPath(objectPath: string): ICdmObject
    {
        //let bodyCode = () =>
        {
            // in current document?
            if (this.internalDeclarations.has(objectPath))
                return this.internalDeclarations.get(objectPath);
            return null;
        }
        //return p.measure(bodyCode);
    }

    public getPathsToOtherDocuments() : Map<DocumentImpl, string> {
        //let bodyCode = () =>
        {
            if (!this.pathsToOtherDocuments) {
                this.pathsToOtherDocuments = new Map<DocumentImpl, string>();
                // found directly
                if (this.importPriority) {
                    for (const otherDoc of this.importPriority.keys()) {
                        this.pathsToOtherDocuments.set(otherDoc, "");
                    }
                }
                // found only through a moniker
                if (this.monikerPriorityMap)
                {
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
                                    this.pathsToOtherDocuments.set(ko, k+'/' + vo);
                            });
                        }
                    });
                }
            }
            return this.pathsToOtherDocuments
        }
        //return p.measure(bodyCode);
    }
  
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//  {folderDef}
////////////////////////////////////////////////////////////////////////////////////////////////////
class FolderImpl extends cdmObjectSimple implements ICdmFolderDef
{
    name: string;
    relativePath: string;
    subFolders?: FolderImpl[];
    documents?: ICdmDocumentDef[];
    corpus: CorpusImpl;
    documentLookup: Map<string, ICdmDocumentDef>;
    public objectType: cdmObjectType;
    constructor(ctx:CdmCorpusContext, corpus: CorpusImpl, name: string, parentPath: string)
    {
        super(ctx);
        //let bodyCode = () =>
        {

            this.corpus = corpus;
            this.name = name;
            this.relativePath = parentPath + name + "/";
            this.subFolders = new Array<FolderImpl>();
            this.documents = new Array<DocumentImpl>();
            this.documentLookup = new Map<string, ICdmDocumentDef>();
            this.objectType = cdmObjectType.folderDef;
        }
        //return p.measure(bodyCode);
    }

    public getName(): string
    {
        //let bodyCode = () =>
        {
            return this.name;
        }
        //return p.measure(bodyCode);
    }
    public validate(): boolean
    {
        //let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        //return p.measure(bodyCode);
    }
    public getRelativePath(): string
    {
        //let bodyCode = () =>
        {
            return this.relativePath;
        }
        //return p.measure(bodyCode);
    }
    public getSubFolders(): ICdmFolderDef[]
    {
        //let bodyCode = () =>
        {
            return this.subFolders;
        }
        //return p.measure(bodyCode);
    }
    public getDocuments(): ICdmDocumentDef[]
    {
        //let bodyCode = () =>
        {
            return this.documents;
        }
        //return p.measure(bodyCode);
    }

    public addFolder(name: string): ICdmFolderDef
    {
        //let bodyCode = () =>
        {
            let newFolder: FolderImpl = new FolderImpl(this.ctx, this.corpus, name, this.relativePath);
            this.subFolders.push(newFolder);
            return newFolder;
        }
        //return p.measure(bodyCode);
    }

    public addDocument(name: string, content: string): ICdmDocumentDef
    {
        //let bodyCode = () =>
        {
            let doc: DocumentImpl;
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

    public removeDocument(name: string)
    {
        //let bodyCode = () =>
        {
            if (this.documentLookup.has(name)) {
                this.corpus.removeDocumentObjects(this, this.documentLookup.get(name))
                this.documents.splice(this.documents.findIndex((d)=>d.getName() == name), 1);
                this.documentLookup.delete(name);
            }
        }
        //return p.measure(bodyCode);
    }

    public getSubFolderFromPath(path: string, makeFolder = true): ICdmFolderDef
    {
        //let bodyCode = () =>
        {
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
                let result: FolderImpl;
                if (this.subFolders) {
                    this.subFolders.some(f =>
                    {
                        result = f.getSubFolderFromPath(remainingPath, makeFolder) as FolderImpl;
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

    public getObjectFromFolderPath(objectPath: string): ICdmObject
    {
        //let bodyCode = () =>
        {

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
        //return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType
    {
        //let bodyCode = () =>
        {
            return cdmObjectType.folderDef;
        }
        //return p.measure(bodyCode);
    }
    // required by base but makes no sense... should refactor
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
    {
        //let bodyCode = () =>
        {
            return false;
        }
        //return p.measure(bodyCode);
    }
    public getObjectDef<T=ICdmObjectDef>(resOpt: resolveOptions): T
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): FolderImpl
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    getResolvedAttributes(): ResolvedAttributeSet
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject
    {
        //let bodyCode = () =>
        {
            return null;
        }
        //return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode
    {
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
class resolveContextScope
{
    currentTrait?: ICdmTraitDef;
    currentParameter?: number;
}



class resolveContext
{
    constructor(corpus:CorpusImpl, statusRpt?: RptCallback, reportAtLevel?: cdmStatusLevel, errorAtLevel? : cdmStatusLevel)
    {
        this.reportAtLevel = reportAtLevel;
        this.errorAtLevel = errorAtLevel
        this.statusRpt = statusRpt;
        this.cache = new Map<string, any>();
        this.corpus = corpus;
    }
    scopeStack: Array<resolveContextScope>;
    currentScope: resolveContextScope;
    reportAtLevel: cdmStatusLevel;
    errorAtLevel: cdmStatusLevel;
    statusRpt: RptCallback;
    currentDoc?: DocumentImpl;
    relativePath?: string;
    corpusPathRoot?: string;
    errors? : number;
    cache : Map<string, any>;
    corpus:CorpusImpl;

    public setDocumentContext(currentDoc?: DocumentImpl, corpusPathRoot?: string)
    {
        //let bodyCode = () =>
        {
            if (currentDoc)
                this.currentDoc = currentDoc;
            if (corpusPathRoot)
                this.corpusPathRoot = corpusPathRoot;
        }
        //return p.measure(bodyCode);
    }
    public pushScope(currentTrait?: ICdmTraitDef)
    {
        //let bodyCode = () =>
        {
            if (!this.scopeStack)
                this.scopeStack = new Array<resolveContextScope>();
    
            let ctxNew: resolveContextScope = { 
                currentTrait: currentTrait ? currentTrait : (this.currentScope ? this.currentScope.currentTrait : undefined),
                currentParameter: 0
            };
            this.currentScope = ctxNew;
            this.scopeStack.push(ctxNew);
        }
        //return p.measure(bodyCode);
    }

    public popScope()
    {
        //let bodyCode = () =>
        {
            this.scopeStack.pop();
            this.currentScope = this.scopeStack.length ? this.scopeStack[this.scopeStack.length - 1] : undefined;
        }
        //return p.measure(bodyCode);
    }

    public getCache(forObj : cdmObject, resOpt: resolveOptions, kind : string) : any {
        //let bodyCode = () =>
        {
            let key=forObj.ID.toString() + "_" + (resOpt && resOpt.wrtDoc ? resOpt.wrtDoc.ID.toString() : "NULL") + "_" + kind;
            let res= this.cache.get(key);
            return res;
        }
        //return p.measure(bodyCode);
    }
    public setCache(forObj : cdmObject, resOpt: resolveOptions, kind : string, value : any) {
        //let bodyCode = () =>
        {
            let key=forObj.ID.toString() + "_" + (resOpt && resOpt.wrtDoc ? resOpt.wrtDoc.ID.toString() : "NULL") + "_" + kind;
            this.cache.set(key, value);
        }
        //return p.measure(bodyCode);
    }

}

interface docsResult
{
    newSymbol?: string;
    docBest?: DocumentImpl;
    docList?: Array<DocumentImpl>;
}

class CorpusImpl extends FolderImpl implements ICdmCorpusDef
{
    static _nextID = 0;
    rootPath: string;
    allDocuments?: [FolderImpl, DocumentImpl][];
    directory: Map<DocumentImpl, FolderImpl>;
    pathLookup: Map<string, [FolderImpl, DocumentImpl]>;
    symbolDefinitions: Map<string, Array<DocumentImpl>>;
    defintionReferenceDocuments: Map<cdmObject, Set<DocumentImpl>>;
    defintionWrtTag: Map<string, string>;
    emptyRTS: Map<string, ResolvedTraitSet>;
    
    constructor(rootPath: string)
    {
        super(null, null, "", "");
        //let bodyCode = () =>
        {
            this.corpus = this; // well ... it is
            this.rootPath = rootPath;
            this.allDocuments = new Array<[FolderImpl, DocumentImpl]>();
            this.pathLookup = new Map<string, [FolderImpl, DocumentImpl]>();
            this.directory = new Map<DocumentImpl, FolderImpl>();
            this.symbolDefinitions = new Map<string, Array<DocumentImpl>>();
            this.defintionReferenceDocuments = new Map<cdmObject, Set<DocumentImpl>>();
            this.defintionWrtTag = new Map<string, string>();
            this.emptyRTS = new Map<string, ResolvedTraitSet>();
        
            this.ctx = new resolveContext(this, (level, msg, path) => {
                if (level >= (this.ctx as resolveContext).errorAtLevel)
                    (this.ctx as resolveContext).errors++; 
            });
        }
        //return p.measure(bodyCode);
    }

    public static nextID() {
        this._nextID++;
        return this._nextID;
    }

    getEmptyResolvedTraitSet(resOpt: resolveOptions) {
        //let bodyCode = () =>
        {
            let key: string = "";
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


    registerSymbol(symbol: string, inDoc: DocumentImpl) {
        //let bodyCode = () =>
        {
            let docs = this.symbolDefinitions.get(symbol);
            if (!docs) {
                docs = new Array<DocumentImpl>();
                this.symbolDefinitions.set(symbol, docs);
            }
            docs.push(inDoc);
        }
        //return p.measure(bodyCode);
    }
    unRegisterSymbol(symbol: string, inDoc: DocumentImpl) {
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


    public docsForSymbol(wrtDoc: DocumentImpl, fromDoc: DocumentImpl, symbol: string) : docsResult
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            let result: docsResult = {newSymbol:symbol};
           
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

    public resolveSymbolReference(resOpt : resolveOptions, fromDoc: DocumentImpl, symbol: string, expectedType: cdmObjectType) : cdmObjectDef
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;

            // given a symbolic name, find the 'highest prirority' definition of the object from the point of view of a given document (with respect to, wrtDoc)
            // (meaning given a document and the things it defines and the files it imports and the files they import, where is the 'last' definition found)
            if (!resOpt || !resOpt.wrtDoc)
                return undefined; // no way to figure this out
            let wrtDoc = (resOpt.wrtDoc as DocumentImpl);
            
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

    public registerDefinitionReferenceDocuments(definition : cdmObject, docRefSet: Set<DocumentImpl>) {
        //let bodyCode = () =>
        {
            if (docRefSet.size > 1) {
                this.defintionReferenceDocuments.set(definition, docRefSet);
            }
        }
        //return p.measure(bodyCode);
    }

    unRegisterDefinitionReferenceDocuments(definition : cdmObject)
    {
        //let bodyCode = () =>
        {
            this.defintionReferenceDocuments.delete(definition);
        }
        //return p.measure(bodyCode);
    }


    public getDefinitionCacheTag(resOpt : resolveOptions, definition : cdmObject, kind: string, extraTags="", useNameNotId=false) : string {
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
            let thisId: string;
            if (useNameNotId)
                thisId = definition.getObjectDefName();
            else
                thisId = definition.ID.toString();

            let tagSuffix = `-${kind}-${thisId}`;
            tagSuffix += `-(${resOpt.directives?resOpt.directives.getTag():""})`;
            if (extraTags)
                tagSuffix += `-${extraTags}`;

            // is there a registered set? (for the objectdef, not for a reference) of the many documents involved in defining this thing (might be none)
            let docsRef = this.defintionReferenceDocuments.get(definition.getObjectDef(resOpt));
            if (docsRef) {
                // already solved this?
                let cacheTagCacheTag = "";
                for (const d of docsRef)
                    cacheTagCacheTag += "-" + d.ID.toString(); 
                cacheTagCacheTag += resOpt.wrtDoc?resOpt.wrtDoc.ID.toString():"none";
                let tagPre = this.defintionWrtTag.get(cacheTagCacheTag);
                if (!tagPre) {
                    // need to figure it out
                    if (resOpt.wrtDoc) {
                        let wrtDoc = (resOpt.wrtDoc as DocumentImpl);
                        tagPre = "using (";
                        let importPriority = wrtDoc.importPriority;
                        if (importPriority) {
                            // find each ref in the set of imports and store a list
                            let foundRefs = new Array<[number, DocumentImpl]>();
                            for (const docRef of docsRef) {
                                let iFound = importPriority.get(docRef);
                                if (iFound != undefined) {
                                    foundRefs.push([iFound, docRef]);
                                }
                            }
                            // sort that and make a list
                            foundRefs.sort((l, r)=>{return l["0"] - r["0"]}).forEach(r=>{ tagPre += "-" + r["1"].ID.toString()});
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
   
    public MakeRef(ofType: cdmObjectType, refObj: string | ICdmObjectDef, simpleNameRef : boolean): ICdmObjectRef
    {
        //let bodyCode = () =>
        {
            let oRef: ICdmObjectRef;

            if (refObj) {
                if (typeof (refObj) === "string")
                    oRef = this.MakeObject<ICdmObjectRef>(ofType, refObj, simpleNameRef);
                else {
                    if (refObj.objectType == ofType) {
                        // forgive this mistake, return the ref passed in
                        oRef = (refObj as any) as ICdmObjectRef;
                    }
                    else {
                        oRef = this.MakeObject<ICdmObjectRef>(ofType);
                        (oRef as ICdmObjectRef).setObjectDef(refObj);
                    }
                }
            }
            return oRef;
        }
        //return p.measure(bodyCode);
    }
    public MakeObject<T extends ICdmObject>(ofType: cdmObjectType, nameOrRef?: string, simmpleNameRef? : boolean): T
    {
        //let bodyCode = () =>
        {
            let newObj: ICdmObject = null;

            switch (ofType) {
                case cdmObjectType.argumentDef:
                    newObj = new ArgumentImpl(this.ctx);
                    (newObj as ArgumentImpl).name = nameOrRef;
                    break;
                case cdmObjectType.attributeGroupDef:
                    newObj = new AttributeGroupImpl(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.attributeGroupRef:
                    newObj = new AttributeGroupReferenceImpl(this.ctx, nameOrRef, simmpleNameRef);
                    break;
                case cdmObjectType.constantEntityDef:
                    newObj = new ConstantEntityImpl(this.ctx);
                    (newObj as ConstantEntityImpl).constantEntityName = nameOrRef;
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
            return newObj as T;
        }
        //return p.measure(bodyCode);
    }

    public static GetReferenceType(ofType: cdmObjectType): cdmObjectType
    {
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

    public addDocumentObjects(folder: FolderImpl, docDef: ICdmDocumentDef): ICdmDocumentDef
    {
        //let bodyCode = () =>
        {
            let doc: DocumentImpl = docDef as DocumentImpl;
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

    public removeDocumentObjects(folder: FolderImpl, docDef: ICdmDocumentDef)
    {
        //let bodyCode = () =>
        {
            let doc: DocumentImpl = docDef as DocumentImpl;
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

    public addDocumentFromContent(corpusPath: string, content: string): ICdmDocumentDef
    {
        //let bodyCode = () =>
        {
            let last: number = corpusPath.lastIndexOf('/');
            if (last < 0)
                throw new Error("bad path");
            let name: string = corpusPath.slice(last + 1);
            let path: string = corpusPath.slice(0, last + 1);
            let folder: ICdmFolderDef = this.getSubFolderFromPath(path, true);
            if (folder == null && path == "/")
                folder = this;
            return folder.addDocument(name, content);
        }
        //return p.measure(bodyCode);
    }

    public resolveDocumentImports(doc: DocumentImpl, missingSet: Set<string>) 
    {
        //let bodyCode = () =>
        {
            if (doc.imports) {
                doc.imports.forEach(imp =>
                {
                    if (!imp.doc) {
                        // no document set for this import, see if it is already loaded into the corpus
                        let path = imp.corpusPath;
                        if (path.charAt(0) != '/')
                            path = doc.folder.getRelativePath() + imp.corpusPath;
                        let lookup: [FolderImpl, DocumentImpl] = this.pathLookup.get(path);
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

    public listMissingImports(): Set<string>
    {
        //let bodyCode = () =>
        {
            let missingSet: Set<string> = new Set<string>();
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

    public getObjectFromCorpusPath(objectPath: string)
    {
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

    public setResolutionCallback(status: RptCallback, reportAtLevel: cdmStatusLevel = cdmStatusLevel.info, errorAtLevel: cdmStatusLevel = cdmStatusLevel.warning) {
        let ctx = this.ctx as resolveContext;
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

    public resolveImports(importResolver: (corpusPath: string) => Promise<[string, string]>): Promise<boolean>
    {
        //let bodyCode = () =>
        {
            return new Promise<boolean>(resolve =>
            {

                let missingSet: Set<string> = this.listMissingImports();
                let result = true;
                let ctx = this.ctx as resolveContext;

                let turnMissingImportsIntoClientPromises = () =>
                {
                    if (missingSet) {
                        // turn each missing into a promise for a missing from the caller
                        missingSet.forEach(missing =>
                        {
                            importResolver(missing).then((success: [string, string]) =>
                            {
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
                            }, (fail: [string, string]) =>
                                {
                                    result = false;
                                    // something went wrong with one of the imports, give up on all of it
                                    ctx.statusRpt(cdmStatusLevel.error, `failed to import '${fail[0]}' for reason : ${fail[1]}`, this.getRelativePath());
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
        //return p.measure(bodyCode);
    }

    public localizeReferences(resOpt : resolveOptions, content: cdmObject)
    {
        //let bodyCode = () =>
        {
            // call visit with no callbacks, this will make everthing has a declared path
            content.visit("", null, null);

            // get the paths to other documents fro this pov
            let docPath = (resOpt.wrtDoc as DocumentImpl).getPathsToOtherDocuments();
            content.visit("", (iObject: ICdmObject, path: string) =>
            {
                let ot: cdmObjectType = iObject.objectType;
                switch (ot) {
                    case cdmObjectType.attributeRef:
                    case cdmObjectType.attributeGroupRef:
                    case cdmObjectType.attributeContextRef:
                    case cdmObjectType.dataTypeRef:
                    case cdmObjectType.entityRef:
                    case cdmObjectType.relationshipRef:
                    case cdmObjectType.traitRef:
                        let ref = iObject as cdmObjectRef;
                        if (ref.namedReference && ref.explicitReference) {
                            let defDoc = ref.explicitReference.declaredInDocument as DocumentImpl;
                            let newIdentifier = docPath.get(defDoc);
                            if (newIdentifier != undefined) {
                                newIdentifier += ref.explicitReference.declaredPath;
                                ref.namedReference = newIdentifier;
                            }
                        }
                        break;
                }
                return false
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

    checkObjectIntegrity()
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            ctx.currentDoc.visit("", (iObject: ICdmObject, path: string) =>
            {
                if (iObject.validate() == false) {
                    ctx.statusRpt(cdmStatusLevel.error, `integrity check failed for : '${path}'`, ctx.currentDoc.path + path);
                } else 
                    (iObject as cdmObject).ctx = ctx;
                    ctx.statusRpt(cdmStatusLevel.info, `checked '${path}'`, ctx.currentDoc.path + path);
                return false
            }, null);
        }
        //return p.measure(bodyCode);
    }

    declareObjectDefinitions(relativePath: string)
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            ctx.corpusPathRoot = ctx.currentDoc.path + ctx.currentDoc.name;
            ctx.currentDoc.visit(relativePath, (iObject: ICdmObject, path: string) =>
            {
                (iObject as cdmObject).docCreatedIn = ctx.currentDoc;
                if (path.indexOf("(unspecified)") > 0)
                    return true;
                switch (iObject.objectType) {
                    case cdmObjectType.entityDef:
                    case cdmObjectType.parameterDef:
                    case cdmObjectType.traitDef:
                    case cdmObjectType.relationshipDef:
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
                        ctx.currentDoc.internalDeclarations.set(path, iObject as cdmObjectDef);
                        (iObject as cdmObjectDef).corpusPath = corpusPath;
                        this.registerSymbol(path, ctx.currentDoc);
                        ctx.statusRpt(cdmStatusLevel.info, `declared '${path}'`, corpusPath);
                        break;
                }

                return false
            }, null);
        }
        //return p.measure(bodyCode);
    }

    removeObjectDefinitions(doc: DocumentImpl)
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            doc.internalDeclarations = undefined;
            doc.visit("", (iObject: ICdmObject, path: string) =>
            {
                (iObject as cdmObject).docCreatedIn = ctx.currentDoc;
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
                        this.unRegisterDefinitionReferenceDocuments(iObject as cdmObject);
                        break;
                }
                return false
            }, null);
        }
        //return p.measure(bodyCode);
    }

    constTypeCheck(resOpt: resolveOptions, paramDef: ICdmParameterDef, aValue: ArgumentValue) : ArgumentValue
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            let replacement = aValue;
            // if parameter type is entity, then the value should be an entity or ref to one
            // same is true of 'dataType' dataType
            if (paramDef.getDataTypeRef()) {
                let dt = paramDef.getDataTypeRef().getObjectDef<ICdmDataTypeDef>(resOpt);
                if (!dt)
                    dt = paramDef.getDataTypeRef().getObjectDef<ICdmDataTypeDef>(resOpt);
                // compare with passed in value or default for parameter
                let pValue = aValue;
                if (!pValue) {
                    pValue = paramDef.getDefaultValue();
                    replacement = pValue;
                }
                if (pValue) {
                    if (dt.isDerivedFrom(resOpt, "cdmObject")) {
                        let expectedTypes: cdmObjectType[] = new Array<cdmObjectType>();
                        let expected: string;
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
                        if (typeof(pValue) === "object")
                            foundType = (pValue as ICdmObject).objectType;
                        let foundDesc: string = ctx.relativePath;
                        if (typeof(pValue) === "string") {
                            if (pValue == "this.attribute" && expected == "attribute"){
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
                                    (replacement as AttributeReferenceImpl).ctx = ctx;
                                    (replacement as AttributeReferenceImpl).docCreatedIn = ctx.currentDoc;
                                    foundType = cdmObjectType.attributeRef;
                                }
                                else {
                                    let lu = ctx.corpus.resolveSymbolReference(resOpt, ctx.currentDoc, pValue, cdmObjectType.error);
                                    if (lu) {
                                        if (expected === "attribute") {
                                            replacement = new AttributeReferenceImpl(ctx, pValue, true);
                                            (replacement as AttributeReferenceImpl).ctx = ctx;
                                            (replacement as AttributeReferenceImpl).docCreatedIn = ctx.currentDoc;
                                            foundType = cdmObjectType.attributeRef;
                                        }
                                        else {
                                            replacement = lu;
                                            foundType = (replacement as ICdmObject).objectType;
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


    resolveObjectDefinitions(resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            // for every object defined, accumulate the set of documents that could be needed to resolve the object AND any references it makes
            // this is a stack, since things get defined inside of things
            let documentRefSetStack = new Array<Set<DocumentImpl>>();
            let documentRefSet: Set<DocumentImpl>;

            ctx.currentDoc.visit("", (iObject: ICdmObject, path: string) =>
            {
                let ot: cdmObjectType = iObject.objectType;
                switch (ot) {
                    case cdmObjectType.entityDef:
                    case cdmObjectType.parameterDef:
                    case cdmObjectType.traitDef:
                    case cdmObjectType.relationshipDef:
                    case cdmObjectType.dataTypeDef:
                    case cdmObjectType.typeAttributeDef:
                    case cdmObjectType.entityAttributeDef:
                    case cdmObjectType.attributeGroupDef:
                    case cdmObjectType.constantEntityDef:
                    case cdmObjectType.attributeContextDef:
                        if (path.indexOf("(unspecified)") == -1) {
                            // a new thing being defined. push onto stack
                            documentRefSet = new Set<DocumentImpl>();
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
                        if ((iObject as AttributeReferenceImpl).namedReference && (iObject as AttributeReferenceImpl).namedReference.indexOf("(resolvedAttributes)") != -1)
                            break;
                    case cdmObjectType.attributeGroupRef:
                    case cdmObjectType.attributeContextRef:
                    case cdmObjectType.dataTypeRef:
                    case cdmObjectType.entityRef:
                    case cdmObjectType.relationshipRef:
                    case cdmObjectType.traitRef:
                        ctx.relativePath = path;
                        let ref = iObject as cdmObjectRef;
                        let resNew = ref.getObjectDef(resOpt);

                        // a new reference. push onto stack. even if we can't look this up, ok because it pops off later
                        documentRefSet = new Set<DocumentImpl>();
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
                return false
            }, (iObject: ICdmObject, path: string) =>
                {
                    let ot: cdmObjectType = iObject.objectType;
                    switch (ot) {
                        case cdmObjectType.parameterDef:
                            // when a parameter has a datatype that is a cdm object, validate that any default value is the
                            // right kind object
                            let p: ICdmParameterDef = iObject as ICdmParameterDef;
                            this.constTypeCheck(resOpt, p, null);
                            break;
                        case cdmObjectType.entityDef:
                        case cdmObjectType.parameterDef:
                        case cdmObjectType.traitDef:
                        case cdmObjectType.relationshipDef:
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
                                this.registerDefinitionReferenceDocuments(iObject as cdmObject, documentRefSet);
                            }
                            break;

                        case cdmObjectType.attributeRef:
                            // don't try to look these up now.
                            if ((iObject as AttributeReferenceImpl).namedReference && (iObject as AttributeReferenceImpl).namedReference.indexOf("(resolvedAttributes)") != -1)
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
                            this.registerDefinitionReferenceDocuments(iObject as cdmObject, documentRefSet);

                        break;

                    }
                    return false
                });
        }
        //return p.measure(bodyCode);
    }

    resolveTraitArguments(resOpt: resolveOptions)
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
            ctx.currentDoc.visit("", 
                (iObject: ICdmObject, path: string) => {
                    let ot: cdmObjectType = iObject.objectType;
                    switch (ot) {
                        case cdmObjectType.traitRef:
                            ctx.pushScope(iObject.getObjectDef<ICdmTraitDef>(resOpt));
                            break;
                        case cdmObjectType.argumentDef:
                            try {
                                if (ctx.currentScope.currentTrait) {
                                    ctx.relativePath = path;
                                    let params: ParameterCollection = ctx.currentScope.currentTrait.getAllParameters(resOpt);
                                    let paramFound: ICdmParameterDef;
                                    let aValue: ArgumentValue;
                                    if (ot == cdmObjectType.argumentDef) {
                                        paramFound = params.resolveParameter(ctx.currentScope.currentParameter, (iObject as ICdmArgumentDef).getName());
                                        (iObject as ArgumentImpl).resolvedParameter = paramFound;
                                        aValue = (iObject as ArgumentImpl).value;

                                        // if parameter type is entity, then the value should be an entity or ref to one
                                        // same is true of 'dataType' dataType
                                        aValue = this.constTypeCheck(resOpt, paramFound, aValue);
                                        (iObject as ArgumentImpl).setValue(aValue);
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
                },
                (iObject: ICdmObject, path: string) => {
                    let ot: cdmObjectType = iObject.objectType;
                    switch (ot) {
                        case cdmObjectType.traitRef:
                            (iObject as TraitReferenceImpl).resolvedArguments = true;
                            ctx.popScope()
                            break;
                    }
                    return false;
                });
            return;
        }
        //return p.measure(bodyCode);
    }

    finishDocumentResolve()
    {
        //let bodyCode = () =>
        {
        }
        //return p.measure(bodyCode);
    }

    finishResolve()
    {
        //let bodyCode = () =>
        {
            let ctx = this.ctx as resolveContext;
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
            };
    
            p.report();
            if (visits) {
                let max = 0;
                let maxVisit = "";
                visits.forEach((v, k) =>
                {
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

    public get profiler() : ICdmProfiler
    {
         return p;
    }

    public resolveReferencesAndValidate(stage: cdmValidationStep, stageThrough: cdmValidationStep, resOpt: resolveOptions): Promise<cdmValidationStep>
    {
        //let bodyCode = () =>
        {
            return new Promise<cdmValidationStep>(resolve =>
            {
                let errors: number = 0;
                let ctx = this.ctx as resolveContext;
                // use the provided directives or make a relational default
                let directives: TraitDirectiveSet;
                if (resOpt)
                    directives = resOpt.directives;
                else
                    directives = new TraitDirectiveSet(new Set<string>(["referenceOnly", "normalized"]));
                resOpt = {wrtDoc:undefined, directives:directives, relationshipDepth:0};                    

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
                    };

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
                    };

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
                    };

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

                    let assignAppliers = (traitMatch: ICdmTraitDef, traitAssign: ICdmTraitDef) =>
                    {
                        if (!traitMatch)
                            return;
                        if (traitMatch.getExtendsTrait())
                            assignAppliers(traitMatch.getExtendsTrait().getObjectDef(resOpt), traitAssign);
                        let traitName = traitMatch.getName();
                        // small number of matcher
                        PrimitiveAppliers.forEach(applier =>
                        {
                            if (applier.matchName == traitName)
                                traitAssign.addTraitApplier(applier);
                        });
                    }
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        resOpt.wrtDoc = ctx.currentDoc;
                        ctx.currentDoc.visit("", (iObject: ICdmObject, path: string) =>
                        {
                            switch (iObject.objectType) {
                                case cdmObjectType.traitDef:
                                    // add trait appliers to this trait from base class on up
                                    assignAppliers(iObject as ICdmTraitDef, iObject as ICdmTraitDef);
                                    break;
                            }
                            return false;
                        }, null);
                        ctx.currentDoc = undefined;
                    };
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
                    let entityNesting=0;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        resOpt.wrtDoc = ctx.currentDoc;
                        ctx.currentDoc.visit("", (iObject: ICdmObject, path: string) =>
                        {
                            switch (iObject.objectType) {
                                case cdmObjectType.entityDef:
                                case cdmObjectType.attributeGroupDef:
                                    entityNesting ++;
                                    // don't do this for entities and groups defined within entities since getting traits already does that
                                    if (entityNesting > 1)
                                        break;
                                case cdmObjectType.traitDef:
                                case cdmObjectType.relationshipDef:
                                case cdmObjectType.dataTypeDef:
                                    ctx.relativePath = path;
                                    (iObject as ICdmObjectDef).getResolvedTraits(resOpt);
                                    break;
                                case cdmObjectType.entityAttributeDef:
                                case cdmObjectType.typeAttributeDef:
                                    ctx.relativePath = path;
                                    (iObject as ICdmAttributeDef).getResolvedTraits(resOpt);
                                    break;
                            }
                            return false;
                        }, 
                        (iObject: ICdmObject, path: string) =>
                        {
                            if (iObject.objectType === cdmObjectType.entityDef || iObject.objectType === cdmObjectType.attributeGroupDef)
                                entityNesting --;
                            return false;
                        });
                        ctx.currentDoc = undefined;
                    };

                    ctx.statusRpt(cdmStatusLevel.progress, "checking required arguments...", null);

                    let checkRequiredParamsOnResolvedTraits = (obj: ICdmObject) =>
                    {
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
                    }

                    // now make sure that within the definition of an entity, every usage of a trait has values or default values for all required params
                    let inEntityDef = 0;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        resOpt.wrtDoc = ctx.currentDoc;
                        ctx.currentDoc.visit("", null, (iObject: ICdmObject, path: string) =>
                        {
                            let ot: cdmObjectType = iObject.objectType;
                            if (ot == cdmObjectType.entityDef) {
                                ctx.relativePath = path;
                                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                                checkRequiredParamsOnResolvedTraits(iObject);
                                // do the same for all attributes
                                if ((iObject as ICdmEntityDef).getHasAttributeDefs()) {
                                    (iObject as ICdmEntityDef).getHasAttributeDefs().forEach((attDef) =>
                                    {
                                        checkRequiredParamsOnResolvedTraits(attDef as ICdmObject);
                                    });
                                }
                            }
                            if (ot == cdmObjectType.attributeGroupDef) {
                                ctx.relativePath = path;
                                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                                checkRequiredParamsOnResolvedTraits(iObject);
                                // do the same for all attributes
                                if ((iObject as ICdmAttributeGroupDef).getMembersAttributeDefs()) {
                                    (iObject as ICdmAttributeGroupDef).getMembersAttributeDefs().forEach((attDef) =>
                                    {
                                        checkRequiredParamsOnResolvedTraits(attDef as ICdmObject);
                                    });
                                }
                            }
                            return false;
                        });
                        ctx.currentDoc = undefined;                        
                    };

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
                    let entityNesting=0;
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        resOpt.wrtDoc = ctx.currentDoc;
                        ctx.currentDoc.visit("", (iObject: ICdmObject, path: string) =>
                        {
                            let ot: cdmObjectType = iObject.objectType;
                            if (ot == cdmObjectType.entityDef) {
                                entityNesting ++; // get resolved att is already recursive, so don't compound
                                if (entityNesting == 1) {
                                    ctx.relativePath = path;
                                    (iObject as ICdmEntityDef).getResolvedAttributes(resOpt);
                                }
                            }
                            if (ot == cdmObjectType.attributeGroupDef) {
                                entityNesting++;
                                if (entityNesting == 1) { // entity will do this for the group defined inside it
                                    ctx.relativePath = path;
                                    (iObject as ICdmAttributeGroupDef).getResolvedAttributes(resOpt);
                                }
                            }
                            return false;
                        }, 
                        (iObject: ICdmObject, path: string) =>
                        {
                            if (iObject.objectType === cdmObjectType.entityDef || iObject.objectType === cdmObjectType.attributeGroupDef)
                                entityNesting --;
                            return false;
                        });
                        ctx.currentDoc = undefined;
                    };

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
                    let entityNesting=0;
                    // for each entity, find and cache the complete set of references to other entities made through referencesA relationships
                    let l = this.allDocuments.length;
                    for (let i = 0; i < l; i++) {
                        const fd = this.allDocuments[i];
                        ctx.currentDoc = fd["1"];
                        resOpt.wrtDoc = ctx.currentDoc;
                        ctx.currentDoc.visit("", (iObject: ICdmObject, path: string) =>
                        {
                            let ot: cdmObjectType = iObject.objectType;
                            if (ot == cdmObjectType.attributeGroupDef)
                                entityNesting++;
                            if (ot == cdmObjectType.entityDef) {
                                entityNesting ++;
                                if (entityNesting == 1) { // get resolved is recursive, so no need
                                    ctx.relativePath = path;
                                    (iObject as ICdmEntityDef).getResolvedEntityReferences(resOpt);
                                }
                            }
                            return false;
                        }, 
                        (iObject: ICdmObject, path: string) =>
                        {
                            if (iObject.objectType === cdmObjectType.entityDef || iObject.objectType === cdmObjectType.attributeGroupDef)
                                entityNesting --;
                            return false;
                        });
                        ctx.currentDoc = undefined;
                    };

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


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  appliers to support the traits from 'primitives.cdm.json'
//
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

let PrimitiveAppliers: TraitApplier[] = [
    {
        matchName: "is.removed",
        priority: 10,
        overridesBase: false,
        willRemove: (onStep: applierContext) : boolean => 
        {
            return true;
        }
    },
    {
        matchName: "does.addAttribute",
        priority: 4,
        overridesBase: false,
        willAttributeAdd: (appCtx: applierContext): boolean =>
        {
            return true;
        },
        doAttributeAdd: (appCtx: applierContext): void =>
        {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("addedAttribute").value as ICdmAttributeDef;
            //sub = sub.copy();
            let appliedTrait = appCtx.resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait as any, false); // could be a def or ref or string handed in. this handles it
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
        willRemove: (appCtx: applierContext): boolean =>
        {
            let visible = true;
            if (appCtx.resAttSource) {
                // all others go away
                visible = false;
                if (appCtx.resAttSource.target === appCtx.resTrait.parameterValues.getParameterValue("addedAttribute").value)
                    visible = true;
            }
            return false; // find this bug
        },
        willRoundAdd: (appCtx: applierContext): boolean =>
        {
            return true;
        },
        doRoundAdd: (appCtx: applierContext): void =>
        {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("addedAttribute").value as ICdmAttributeDef;
            //sub = sub.copy();
            let appliedTrait = appCtx.resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait as any, false); // could be a def or ref or string handed in. this handles it
            }
            appCtx.resAttNew.target = sub;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);

        },
        willCreateContext: (appCtx: applierContext): boolean =>
        {
            return true;
        },
        doCreateContext: (appCtx: applierContext): void =>
        {
            // make a new attributeContext to differentiate this supporting att
            let acp : AttributeContextParameters = {
                under:appCtx.attCtx,
                type:cdmAttributeContextType.addedAttributeIdentity,
                name: "_foreignKey"
            };

            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: "does.addSupportingAttribute",
        priority: 8,
        overridesBase: true,
        willAttributeAdd: (appCtx: applierContext): boolean =>
        {
            return true;
        },
        doAttributeAdd: (appCtx: applierContext): void =>
        {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("addedAttribute").value as ICdmAttributeDef;
            sub = sub.copy(appCtx.resOpt);
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // might have set a supporting trait to add to this attribute            
            let appliedTrait = appCtx.resTrait.parameterValues.getParameterValue("appliedTrait").value;
            if (typeof(appliedTrait) === "object") {
                appliedTrait = (appliedTrait as ICdmObjectRef).getObjectDef(appCtx.resOpt);
                // shove new trait onto attribute
                sub.addAppliedTrait(appliedTrait as any, false); // could be a def or ref or string handed in. this handles it
                // get the resolved traits from attribute
                appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
                // assumes some things, like the argument name. probably a dumb design, should just take the name and assume the trait too. that simplifies the source docs
                let supporting = "(unspecified)"
                if (appCtx.resAttSource)
                    supporting = appCtx.resAttSource.resolvedName
                appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.setTraitParameterValue(appCtx.resOpt, appliedTrait as ICdmTraitDef, "inSupportOf", supporting);
            }
            else {
                // get the resolved traits from attribute
                appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
            }

            appCtx.resAttNew.target = sub;
        },
        willCreateContext: (appCtx: applierContext): boolean =>
        {
            return true;
        },
        doCreateContext: (appCtx: applierContext): void =>
        {
            // make a new attributeContext to differentiate this supporting att
            let acp : AttributeContextParameters = {
                under:appCtx.attCtx,
                type:cdmAttributeContextType.addedAttributeSupporting,
                name: "supporting_" + appCtx.resAttSource.resolvedName,
                regarding: appCtx.resAttSource.target as ICdmAttributeDef
            };

            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: "does.imposeDirectives",
        priority: 1,
        overridesBase: true,
        willAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait) : boolean =>
        {
            return true;
        },
        doAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait)=>
        {
            let allAdded = resTrait.parameterValues.getParameterValue("directives").getValueString(resOpt);

            if (allAdded) {
                if (resOpt.directives) {
                    resOpt.directives = resOpt.directives.copy();
                    allAdded.split(',').forEach(d=> resOpt.directives.add(d));
                }
            }
        }
    },
    {
        matchName: "does.removeDirectives",
        priority: 2,
        overridesBase: true,
        willAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait) : boolean =>
        {
            return true;
        },
        doAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait) : void =>
        {
            let allRemoved = resTrait.parameterValues.getParameterValue("directives").getValueString(resOpt);

            if (allRemoved) {
                if (resOpt.directives) {
                    resOpt.directives = resOpt.directives.copy();
                    allRemoved.split(',').forEach(d=> {
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
        willAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait) : boolean =>
        {
            let selects = resTrait.parameterValues.getParameterValue("selects").getValueString(resOpt);
            return (selects == "one")
        },
        doAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait) : void =>
        {
            if (resOpt.directives)
                resOpt.directives = resOpt.directives.copy();
            else 
                resOpt.directives = new TraitDirectiveSet();
            resOpt.directives.add("selectOne");
        },
        willRoundAdd: (appCtx: applierContext): boolean =>
        {
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
        doRoundAdd: (appCtx: applierContext): void =>
        {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("storeSelectionInAttribute").value as ICdmAttributeDef;
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
        willCreateContext: (appCtx: applierContext): boolean =>
        {
            let dir = appCtx.resOpt.directives;
            let selectsOne = dir && dir.has("selectOne");
            let structured = dir && dir.has("structured");
            if (selectsOne && !structured) {
                return true;
            }
            return false;
        },
        doCreateContext: (appCtx: applierContext): void =>
        {
            // make a new attributeContext to differentiate this supporting att
            let acp : AttributeContextParameters = {
                under:appCtx.attCtx,
                type:cdmAttributeContextType.addedAttributeSupporting,
                name: "_selectedEntityName"
            };

            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: "does.disambiguateNames",
        priority: 9,
        overridesBase: true,
        willAttributeModify: (appCtx: applierContext): boolean =>
        {
            if (appCtx.resAttSource && !appCtx.resOpt.directives.has("structured"))
                return true;
            return false;
        },
        doAttributeModify: (appCtx: applierContext): void =>
        {
            if (appCtx.resAttSource) {
                let format = appCtx.resTrait.parameterValues.getParameterValue("renameFormat").getValueString(appCtx.resOpt);
                let state = appCtx.resAttSource.applierState
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
                let replace = (start: number, at: number, length: number, value: string): string =>
                {
                    if (upper && value) {
                        value = value.charAt(0).toUpperCase() + value.slice(1);
                    }
                    let replaced: string = "";
                    if (at > start)
                        replaced = format.slice(start, at);
                    replaced += value;
                    if (at + 3 < length)
                        replaced += format.slice(at + 3, length);
                    return replaced;
                }
                let result: string;
                let srcName = appCtx.resAttSource.resolvedName;
                if (iN < 0 && iO < 0) {
                    result = format;
                }
                else if (iN < 0) {
                    result = replace(0, iO, formatLength, ordinal);
                }
                else if (iO < 0) {
                    result = replace(0, iN, formatLength, srcName);
                } else if (iN < iO) {
                    result = replace(0, iN, iO, srcName);
                    result += replace(iO, iO, formatLength, ordinal);
                } else {
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
        willRemove: (appCtx: applierContext): boolean =>
        {
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
        willRoundAdd: (appCtx: applierContext): boolean =>
        {
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
        doRoundAdd: (appCtx: applierContext): void =>
        {
            // get the added attribute and applied trait
            let sub = appCtx.resTrait.parameterValues.getParameterValue("foreignKeyAttribute").value as ICdmAttributeDef;
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
        willCreateContext: (appCtx: applierContext): boolean =>
        {
            let dir = appCtx.resOpt.directives;
            let isNorm = dir && dir.has("normalized");
            let isArray = dir && dir.has("isArray");
            let isRefOnly = dir && dir.has("referenceOnly");
            let doFKOnly = isRefOnly && (isNorm == false || isArray == false);
            return doFKOnly;
        },
        doCreateContext: (appCtx: applierContext): void =>
        {
            // make a new attributeContext to differentiate this foreign key att
            let acp : AttributeContextParameters = {
                under:appCtx.attCtx,
                type:cdmAttributeContextType.addedAttributeIdentity,
                name: "_foreignKey"
            };

            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: "does.explainArray",
        priority: 6,
        overridesBase: false,
        willGroupAdd: (appCtx: applierContext): boolean =>
        {
            let dir = appCtx.resOpt.directives;
            let isNorm = dir && dir.has("normalized");
            let isArray = dir && dir.has("isArray");
            let isStructured = dir && dir.has("structured");
            // expand array and add a count if this is an array AND it isn't structured or normalized
            // structured assumes they know about the array size from the structured data format
            // normalized means that arrays of entities shouldn't be put inline, they should reference or include from the 'other' side of that 1:M relationship
            return isArray && !isNorm && !isStructured;
        },
        doGroupAdd: (appCtx: applierContext): void =>
        {
            let sub = appCtx.resTrait.parameterValues.getParameterValue("storeCountInAttribute").value as ICdmAttributeDef;
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
        willAttributeAdd: (appCtx: applierContext): boolean =>
        {
            let dir = appCtx.resOpt.directives;
            let isNorm = dir && dir.has("normalized");
            let isArray = dir && dir.has("isArray");
            let isStructured = dir && dir.has("structured");
            return isArray && !isNorm && !isStructured;
        },
        doAttributeAdd: (appCtx: applierContext): void =>
        {
            let newAtt: ICdmAttributeDef;
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
                    let template = (state.array_template) as ResolvedAttribute;
                    appCtx.resAttNew.target = template.target;
                    // copy the template
                    //appCtx.resAttNew.resolvedName = template.resolvedName; // must solve problem with apply happening twice.
                    appCtx.resAttNew.resolvedName = (template.target as ICdmAttributeDef).getName();
                    appCtx.resAttNew.resolvedTraits = template.resolvedTraits.deepCopy();
                    appCtx.continue = state.flex_currentOrdinal < state.array_finalOrdinal;
                }
                
            }
        },
        willAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait) : boolean =>
        {
            let isArray = resTrait.parameterValues.getParameterValue("isArray").getValueString(resOpt);
            return isArray == "true";
        },
        doAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait) : void =>
        {
            if (resOpt.directives)
                resOpt.directives = resOpt.directives.copy();
            else 
                resOpt.directives = new TraitDirectiveSet();
            resOpt.directives.add("isArray");
        },
        willRemove: (appCtx: applierContext): boolean =>
        {
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
