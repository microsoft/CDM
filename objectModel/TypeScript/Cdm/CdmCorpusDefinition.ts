// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmArgumentDefinition,
    CdmAttribute,
    CdmAttributeContext,
    CdmAttributeContextReference,
    cdmAttributeContextType,
    CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmAttributeReference,
    CdmAttributeResolutionGuidance,
    CdmConstantEntityDefinition,
    CdmConstants,
    CdmContainerDefinition,
    CdmCorpusContext,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition,
    CdmDataTypeDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmE2ERelationship,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFileMetadata,
    CdmFolderDefinition,
    CdmImport,
    CdmLocalEntityDeclarationDefinition,
    cdmLogCode,
    CdmManifestDeclarationDefinition,
    CdmManifestDefinition,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmObjectReference,
    cdmObjectType,
    CdmOperationAddArtifactAttribute,
    CdmOperationAddAttributeGroup,
    CdmOperationAddCountAttribute,
    CdmOperationAddSupportingAttribute,
    CdmOperationAddTypeAttribute,
    CdmOperationAlterTraits,
    CdmOperationArrayExpansion,
    CdmOperationCombineAttributes,
    CdmOperationExcludeAttributes,
    CdmOperationIncludeAttributes,
    CdmOperationRenameAttributes,
    CdmOperationReplaceAsForeignKey,
    CdmParameterDefinition,
    CdmProjection,
    CdmPurposeDefinition,
    CdmPurposeReference,
    CdmReferencedEntityDeclarationDefinition,
    cdmStatusLevel,
    CdmTraitDefinition,
    CdmTraitGroupDefinition,
    CdmTraitGroupReference,
    CdmTraitReference,
    CdmTraitReferenceBase,
    CdmTypeAttributeDefinition,
    cdmValidationStep,
    DepthInfo,
    docsResult,
    DocumentLibrary,
    EventCallback,
    ICdmProfiler,
    ImportInfo,
    importsLoadStrategy,
    Logger,
    p,
    resolveContext,
    ResolvedTrait,
    ResolvedTraitSet,
    resolveOptions,
    StorageAdapterBase,
    StorageManager,
    StringUtils,
    SymbolSet,
    TelemetryClient
} from '../internal';
import {
    isAttributeGroupDefinition,
    isCdmTraitDefinition,
    isCdmTraitGroupDefinition,
    isConstantEntityDefinition,
    isDataTypeDefinition,
    isEntityDefinition,
    isManifestDefinition,
    isOperationAddArtifactAttribute,
    isOperationAddAttributeGroup,
    isOperationAddCountAttribute,
    isOperationAddSupportingAttribute,
    isOperationAddTypeAttribute,
    isOperationAlterTraits,
    isOperationArrayExpansion,
    isOperationCombineAttributes,
    isOperationExcludeAttributes,
    isOperationIncludeAttributes,
    isOperationRenameAttributes,
    isOperationReplaceAsForeignKey,
    isParameterDefinition,
    isProjection,
    isPurposeDefinition
} from '../Utilities/cdmObjectTypeGuards';

import { PersistenceLayer } from '../Persistence';
import { StorageUtils } from '../Utilities/StorageUtils';
import { VisitCallback } from '../Utilities/VisitCallback';
import { enterScope } from '../Utilities/Logging/Logger';
import { using } from "using-statement";

export class CdmCorpusDefinition {
    private TAG: string = CdmCorpusDefinition.name;

    public get profiler(): ICdmProfiler {
        return p;
    }
    /**
     * @internal
     */
    // tslint:disable-next-line:variable-name
    public static _nextID: number = 0;
    public appId: string;

    public telemetryClient: TelemetryClient;

    /**
     * @internal
     */
    public isCurrentlyResolving: boolean = false;

    /**
     * The set of resolution directives that will be used by default by the object model when it is resolving
     * entities and when no per-call set of directives is provided.
     */
    public defaultResolutionDirectives: AttributeResolutionDirectiveSet;

    public rootPath: string;
    public readonly storage: StorageManager;

    public readonly persistence: PersistenceLayer;

    /**
     * Gets the object context.
     */
    public readonly ctx: CdmCorpusContext;
    /**
     * @internal
     */
    public definitionReferenceSymbols: Map<string, SymbolSet>;
    /**
     * @internal
     */
    public rootManifest: CdmManifestDefinition;
    /**
     * @internal
     */
    public documentLibrary: DocumentLibrary;
    /**
     * @internal
     */
    public readonly resEntMap: Map<string, string>;
    private readonly symbolDefinitions: Map<string, CdmDocumentDefinition[]>;
    private readonly emptyRTS: Map<string, ResolvedTraitSet>;
    private readonly namespaceFolders: Map<string, CdmFolderDefinition>;
    private knownArtifactAttributes: Map<string, CdmTypeAttributeDefinition>;

    private readonly outgoingRelationships: Map<string, CdmE2ERelationship[]>;
    private readonly incomingRelationships: Map<string, CdmE2ERelationship[]>;

    private readonly cdmExtension: string = CdmConstants.cdmExtension;

    constructor() {
        // let bodyCode = () =>
        {
            // this.rootPath = rootPath;
            this.namespaceFolders = new Map<string, CdmFolderDefinition>();
            this.symbolDefinitions = new Map<string, CdmDocumentDefinition[]>();
            this.definitionReferenceSymbols = new Map<string, SymbolSet>();
            this.emptyRTS = new Map<string, ResolvedTraitSet>();
            this.outgoingRelationships = new Map<string, CdmE2ERelationship[]>();
            this.incomingRelationships = new Map<string, CdmE2ERelationship[]>();
            this.resEntMap = new Map<string, string>();
            this.documentLibrary = new DocumentLibrary(this);

            this.ctx = new resolveContext(this);
            this.storage = new StorageManager(this);
            this.persistence = new PersistenceLayer(this);

            // the default for the default is to make entity attributes into foreign key references
            // when they point at one other instance and to ignore the other entities when there are an array of them
            this.defaultResolutionDirectives = new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly']));
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public static nextID(): number {
        this._nextID++;

        return this._nextID;
    }

    /**
     * @internal
     */
    public static mapReferenceType(ofType: cdmObjectType): cdmObjectType {
        // let bodyCode = () =>
        {
            switch (ofType) {
                case cdmObjectType.argumentDef:
                case cdmObjectType.documentDef:
                case cdmObjectType.manifestDef:
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

                case cdmObjectType.purposeDef:
                case cdmObjectType.purposeRef:
                    return cdmObjectType.purposeRef;

                case cdmObjectType.traitDef:
                case cdmObjectType.traitRef:
                    return cdmObjectType.traitRef;

                case cdmObjectType.traitGroupDef:
                case cdmObjectType.traitGroupRef:
                    return cdmObjectType.traitGroupRef;

                case cdmObjectType.entityAttributeDef:
                case cdmObjectType.typeAttributeDef:
                case cdmObjectType.attributeRef:
                    return cdmObjectType.attributeRef;

                case cdmObjectType.attributeContextDef:
                case cdmObjectType.attributeContextRef:
                    return cdmObjectType.attributeContextRef;
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public static createCacheKeyFromObject(definition: CdmObject, kind: string): string {
        return `${definition.ID}-${kind}`;
    }

    /**
     * @internal
     */
    private static fetchPriorityDoc(
        docs: CdmDocumentDefinition[],
        importPriority: Map<CdmDocumentDefinition,
            ImportInfo>): CdmDocumentDefinition {
        // let bodyCode = () =>
        {
            let docBest: CdmDocumentDefinition;
            let indexBest: number = Number.MAX_SAFE_INTEGER;
            for (const docDefined of docs) {
                // is this one of the imported docs?
                const importInfo: ImportInfo = importPriority.get(docDefined);
                if (importInfo && importInfo.priority < indexBest) {
                    indexBest = importInfo.priority;
                    docBest = docDefined;
                    if (indexBest === 0) {
                        break;
                    } // hard to be better than the best
                }
            }

            return docBest;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @deprecated Use fetchObjectAsync instead.
     */
    public async createRootManifest(corpusPath: string): Promise<CdmManifestDefinition> {
        if (this.isPathManifestDocument(corpusPath)) {
            const newManifest: CdmManifestDefinition = await this.fetchObjectAsync(corpusPath, undefined, false);
            if (!isManifestDefinition(newManifest)) {
                Logger.error(this.ctx, this.TAG, this.createRootManifest.name, corpusPath, cdmLogCode.ErrInvalidCast, corpusPath, "CdmManifestDefinition");
                return undefined;
            }

            this.rootManifest = newManifest;

            return this.rootManifest;
        }
    }

    /**
     * @internal
     */
    public createEmptyResolvedTraitSet(resOpt: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            let key: string = '';
            if (resOpt) {
                if (resOpt.wrtDoc) {
                    key = resOpt.wrtDoc.ID.toString();
                }
                key += '-';
                if (resOpt.directives) {
                    key += resOpt.directives.getTag();
                }
            }
            let rts: ResolvedTraitSet = this.emptyRTS.get(key);
            if (!rts) {
                rts = new ResolvedTraitSet(resOpt);
                this.emptyRTS.set(key, rts);
            }

            return rts;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public docsForSymbol(
        resOpt: resolveOptions,
        wrtDoc: CdmDocumentDefinition,
        fromDoc: CdmDocumentDefinition,
        symbolDef: string): docsResult {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            const result: docsResult = { newSymbol: symbolDef };

            // first decision, is the symbol defined anywhere?
            result.docList = this.symbolDefinitions.get(symbolDef);
            if (!result.docList || result.docList.length === 0) {
                // this can happen when the symbol is disambiguated with a moniker for one of the imports used
                // in this situation, the 'wrt' needs to be ignored,
                // the document where the reference is being made has a map of the 'one best' monikered import to search for each moniker
                const preEnd: number = symbolDef.indexOf('/');
                if (preEnd === 0) {
                    // absolute refererence
                    Logger.error(this.ctx, this.TAG, this.docsForSymbol.name, wrtDoc.atCorpusPath, cdmLogCode.ErrUnsupportedRef, symbolDef, ctx.relativePath);

                    return undefined;
                }
                if (preEnd > 0) {
                    const prefix: string = symbolDef.slice(0, preEnd);
                    result.newSymbol = symbolDef.slice(preEnd + 1);
                    result.docList = this.symbolDefinitions.get(result.newSymbol);

                    let tempMonikerDoc: CdmDocumentDefinition;
                    let usingWrtDoc: boolean = false;
                    if (fromDoc && fromDoc.importPriorities && fromDoc.importPriorities.monikerPriorityMap.has(prefix)) {
                        tempMonikerDoc = fromDoc.importPriorities.monikerPriorityMap.get(prefix);
                    } else if (wrtDoc && wrtDoc.importPriorities && wrtDoc.importPriorities.monikerPriorityMap.has(prefix)) {
                        // if that didn't work, then see if the wrtDoc can find the moniker
                        tempMonikerDoc = wrtDoc.importPriorities.monikerPriorityMap.get(prefix);
                        usingWrtDoc = true;
                    }

                    if (tempMonikerDoc) {
                        // if more monikers, keep looking
                        if (result.newSymbol.indexOf('/') >= 0 && (usingWrtDoc || !this.symbolDefinitions.has(result.newSymbol))) {
                            const currDocsResult: docsResult = this.docsForSymbol(resOpt, wrtDoc, tempMonikerDoc, result.newSymbol);
                            if (!currDocsResult.docList && fromDoc === wrtDoc) {
                                // we are back at the top and we have not found the docs, move the wrtDoc down one level
                                return this.docsForSymbol(resOpt, tempMonikerDoc, tempMonikerDoc, result.newSymbol);
                            } else {
                                return currDocsResult;
                            }
                        }
                        result.docBest = tempMonikerDoc;
                    } else {
                        // moniker not recognized in either doc, fail with grace
                        result.newSymbol = symbolDef;
                        result.docList = undefined;
                    }
                }
            }

            return result;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public resolveSymbolReference(
        resOpt: resolveOptions,
        fromDoc: CdmDocumentDefinition,
        symbolDef: string,
        expectedType: cdmObjectType,
        retry: boolean
    ): CdmObjectBase {
        // given a symbolic name,
        // find the 'highest priority' definition of the object from the point of view of a given document (with respect to, wrtDoc)
        // (meaning given a document and the things it defines and the files it imports and the files they import,
        // where is the 'last' definition found)
        if (!resOpt || !resOpt.wrtDoc || !symbolDef) {
            return undefined;
        } // no way to figure this out
        const wrtDoc: CdmDocumentDefinition = resOpt.wrtDoc;

        if (wrtDoc.needsIndexing && resOpt.importsLoadStrategy === importsLoadStrategy.doNotLoad) {
            Logger.error(this.ctx, this.TAG, this.resolveSymbolReference.name, wrtDoc.atCorpusPath, cdmLogCode.ErrSymbolNotFound, symbolDef, 'because the ImportsLoadStrategy is set to DoNotLoad"');
            return undefined;
        }

        // save the symbol name as it got here
        let initialSymbol: string = symbolDef;

        // when trying to find a reference, first find the definition that contains it
        // and then look for the reference inside it.
        const isReference: Boolean = symbolDef?.endsWith('(ref)') === true;
        if (isReference) {
            const defIndex: number = symbolDef.indexOf('/');
            symbolDef = symbolDef.substring(0, defIndex);
        }

        // get the array of documents where the symbol is defined
        const symbolDocsResult: docsResult = this.docsForSymbol(resOpt, wrtDoc, fromDoc, symbolDef);
        let docBest: CdmDocumentDefinition = symbolDocsResult.docBest;
        symbolDef = symbolDocsResult.newSymbol;

        if (!isReference) {
            initialSymbol = symbolDef;
        }

        const docs: CdmDocumentDefinition[] = symbolDocsResult.docList;
        if (docs) {
            // add this symbol to the set being collected in resOpt, we will need this when caching
            if (!resOpt.symbolRefSet) {
                resOpt.symbolRefSet = new SymbolSet();
            }
            resOpt.symbolRefSet.add(symbolDef);
            // for the given doc, there is a sorted list of imported docs (including the doc itself as item 0).
            // find the lowest number imported document that has a definition for this symbol
            if (!wrtDoc.importPriorities) {
                return undefined; // need to index imports first, should have happened
            }
            const importPriority: Map<CdmDocumentDefinition, ImportInfo> = wrtDoc.importPriorities.importPriority;
            if (importPriority.size === 0) {
                return undefined;
            }

            if (!docBest) {
                docBest = CdmCorpusDefinition.fetchPriorityDoc(docs, importPriority) || docBest;
            }
        }

        // perhaps we have never heard of this symbol in the imports for this document?
        if (!docBest) {
            return undefined;
        }

        // return the definition found in the best document
        let found: CdmObjectBase = docBest.internalDeclarations.get(symbolDef);

        // in case we are trying to find a reference, the object we found previously is the definition that contains the reference.
        // look inside the definition now.
        if (found && isReference) {
            let foundRef: CdmObjectBase = undefined;
            // try to find the reference
            found.visit('',
                (obj, objPath) => {
                    if (initialSymbol === objPath) {
                        foundRef = obj as CdmObjectBase;
                        return true;
                    }
                    return false;
                },
                undefined);
            found = foundRef;
        }

        if (found === undefined && retry === true) {
            // maybe just locatable from here not defined here.
            // this happens when the symbol is monikered, but the moniker path doesn't lead to the document where the symbol is defined.
            // it leads to the document from where the symbol can be found.
            // Ex.: resolvedFrom/Owner, while resolvedFrom is the Account that imports Owner.
            found = this.resolveSymbolReference(resOpt, docBest, initialSymbol, expectedType, false);
        }

        if (found && expectedType !== cdmObjectType.error) {
            found = this.reportErrorStatus(found, symbolDef, expectedType);
        }

        return found;
    }

    /**
     * @internal
     */
    public registerDefinitionReferenceSymbols(definition: CdmObject, kind: string, symbolRefSet: SymbolSet): void {
        // let bodyCode = () =>
        {
            const key: string = CdmCorpusDefinition.createCacheKeyFromObject(definition, kind);
            const existingSymbols: SymbolSet = this.definitionReferenceSymbols.get(key);
            if (existingSymbols === undefined) {
                // nothing set, just use it
                this.definitionReferenceSymbols.set(key, symbolRefSet);
            } else {
                // something there, need to merge
                existingSymbols.merge(symbolRefSet);
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public unRegisterDefinitionReferenceDocuments(definition: CdmObject, kind: string): void {
        // let bodyCode = () =>
        {
            const key: string = CdmCorpusDefinition.createCacheKeyFromObject(definition, kind);
            this.definitionReferenceSymbols.delete(key);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public createDefinitionCacheTag(
        resOpt: resolveOptions,
        definition: CdmObjectBase,
        kind: string,
        extraTags: string = '',
        notKnownToHaveParameters: boolean = false,
        pathToDef?: string
    ): string {
        // let bodyCode = () =>
        {
            // construct a tag that is unique for a given object in a given context
            // context is:
            //   (1) the wrtDoc has a set of imports and defintions that may change what the object is point at
            //   (2) there are different kinds of things stored per object (resolved traits, atts, etc.)
            //   (3) the directives from the resolve Options might matter
            //   (4) sometimes the caller needs different caches (extraTags) even give 1-3 are the same
            // the hardest part is (1). To do this, see if the object has a set of reference documents registered.
            // if there is nothing registered, there is only one possible way to resolve the object so don't include doc info in the tag.
            // if there IS something registered, then the object could be ambiguous.
            // find the 'index' of each of the ref documents (potential definition of something referenced under this scope)
            // in the wrt document's list of imports. sort the ref docs by their index,
            // the relative ordering of found documents makes a unique context.
            // the hope is that many, many different lists of imported files will result in identical reference sortings, so lots of re-use
            // since this is an expensive operation, actually cache the sorted list associated with this object and wrtDoc

            // easy stuff first
            let thisId: string;
            const thisPath: string = (definition.objectType === cdmObjectType.projectionDef) ? definition.declaredPath.replace(/\//g, '') : definition.atCorpusPath;
            if (pathToDef && notKnownToHaveParameters) {
                thisId = pathToDef;
            } else {
                thisId = definition.ID.toString();
            }

            let tagSuffix: string = `-${kind}-${thisId}`;

            // Some object types like traits don't change their resolved from depending on the directives.
            // This optimization is only useful when the same corpus is used to resolve objects using different directives.
            let simpleCacheTag: boolean = false;

            switch (definition.objectType) {
                case cdmObjectType.dataTypeDef:
                case cdmObjectType.purposeDef:
                case cdmObjectType.traitDef:
                case cdmObjectType.traitGroupDef:
                    simpleCacheTag = true;
                    break;
            }
            if (!simpleCacheTag) {
                tagSuffix += `-(${resOpt.directives ? resOpt.directives.getTag() : ''})`;
            }

            // only for attributes
            if (kind === 'rasb') {
                // if MaxDepth was not initialized before, initialize it now
                if (resOpt.depthInfo.maxDepth === undefined) {
                    resOpt.depthInfo.maxDepth = resOpt.maxDepth;
                }

                // add to the cache tag either if we reached maximum depth or how many levels we can go down until reaching the maximum depth
                if (resOpt.depthInfo.currentDepth > resOpt.depthInfo.maxDepth) {
                    tagSuffix += '-overMaxDepth';
                } else {
                    const currDepthInfo: DepthInfo = resOpt.depthInfo;
                    tagSuffix += `-${currDepthInfo.maxDepth - currDepthInfo.currentDepth}toMaxDepth`;
                }
            }
            if (resOpt.inCircularReference) {
                tagSuffix += '-pk';
            }
            if (extraTags) {
                tagSuffix += `-${extraTags}`;
            }

            // is there a registered set?
            // (for the objectdef, not for a reference) of the many symbols involved in defining this thing(might be none)
            const objDef: CdmObjectDefinition = definition.fetchObjectDefinition(resOpt);
            let symbolsRef: SymbolSet;
            if (objDef) {
                const key: string = CdmCorpusDefinition.createCacheKeyFromObject(objDef, kind);
                symbolsRef = this.definitionReferenceSymbols.get(key);
            }

            if (symbolsRef === undefined && thisPath !== undefined) {
                // every symbol should depend on at least itself
                const symSetThis: SymbolSet = new SymbolSet();
                symSetThis.add(thisPath);
                this.registerDefinitionReferenceSymbols(definition, kind, symSetThis);
                symbolsRef = symSetThis;
            }

            if (symbolsRef && symbolsRef.size > 0) {
                // each symbol may have definitions in many documents. use importPriority to figure out which one we want
                const wrtDoc: CdmDocumentDefinition = resOpt.wrtDoc;
                const foundDocIds: Set<number> = new Set<number>();
                if (wrtDoc.importPriorities) {
                    for (const symRef of symbolsRef) {
                        // get the set of docs where defined
                        const docsRes: docsResult = this.docsForSymbol(resOpt, wrtDoc, definition.inDocument, symRef);
                        // we only add the best doc if there are multiple options
                        if (docsRes !== undefined && docsRes.docList !== undefined && docsRes.docList.length > 1) {
                            const docBest: CdmDocumentDefinition = CdmCorpusDefinition.fetchPriorityDoc(
                                docsRes.docList,
                                wrtDoc.importPriorities.importPriority
                            );
                            if (docBest) {
                                foundDocIds.add(docBest.ID);
                            }
                        }
                    }
                }
                const tagPre: string = Array.from(foundDocIds)
                    .sort()
                    .join('-');

                return tagPre + tagSuffix;
            }
        }
        // return p.measure(bodyCode);
    }

    public MakeRef<T extends CdmObjectReference>(ofType: cdmObjectType, refObj: string | CdmObjectDefinition, simpleNameRef: boolean): T {
        // let bodyCode = () =>
        {
            let oRef: CdmObjectReference;

            if (refObj) {
                if (refObj instanceof CdmObjectBase) {
                    if (refObj.objectType === ofType) {
                        // forgive this mistake, return the ref passed in
                        oRef = (refObj as CdmObject) as CdmObjectReference;
                    } else {
                        oRef = this.MakeObject<CdmObjectReference>(ofType, undefined, false);
                        oRef.explicitReference = refObj as CdmObjectDefinition;
                    }
                } else {
                    // refObj is a string or object
                    oRef = this.MakeObject<CdmObjectReference>(ofType, refObj as string, simpleNameRef);
                }
            }

            return oRef as T;
        }
        // return p.measure(bodyCode);
    }

    public MakeObject<T extends CdmObject>(ofType: cdmObjectType, nameOrRef?: string, simmpleNameRef?: boolean): T {
        // let bodyCode = () =>
        {
            let newObj: CdmObject;

            switch (ofType) {
                case cdmObjectType.argumentDef:
                    newObj = new CdmArgumentDefinition(this.ctx, nameOrRef);
                    (newObj as CdmArgumentDefinition).name = nameOrRef;
                    break;
                case cdmObjectType.attributeGroupDef:
                    newObj = new CdmAttributeGroupDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.attributeGroupRef:
                    newObj = new CdmAttributeGroupReference(this.ctx, nameOrRef, simmpleNameRef);
                    break;
                case cdmObjectType.constantEntityDef:
                    newObj = new CdmConstantEntityDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.dataTypeDef:
                    newObj = new CdmDataTypeDefinition(this.ctx, nameOrRef, undefined);
                    break;
                case cdmObjectType.dataTypeRef:
                    newObj = new CdmDataTypeReference(this.ctx, nameOrRef, simmpleNameRef);
                    break;
                case cdmObjectType.documentDef:
                    newObj = new CdmDocumentDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.manifestDef:
                    newObj = new CdmManifestDefinition(this.ctx, nameOrRef);

                    // Log and ingest a message when a new manifest is created
                    Logger.debug(this.ctx, this.TAG, this.MakeObject.name, newObj.atCorpusPath, "New Manifest created.", true);
                    break;
                case cdmObjectType.entityAttributeDef:
                    newObj = new CdmEntityAttributeDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.entityDef:
                    newObj = new CdmEntityDefinition(this.ctx, nameOrRef, undefined);
                    break;
                case cdmObjectType.entityRef:
                    newObj = new CdmEntityReference(this.ctx, nameOrRef, simmpleNameRef);
                    break;
                case cdmObjectType.import:
                    newObj = new CdmImport(this.ctx, nameOrRef, undefined);
                    break;
                case cdmObjectType.parameterDef:
                    newObj = new CdmParameterDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.purposeDef:
                    newObj = new CdmPurposeDefinition(this.ctx, nameOrRef, undefined);
                    break;
                case cdmObjectType.purposeRef:
                    newObj = new CdmPurposeReference(this.ctx, nameOrRef, simmpleNameRef);
                    break;
                case cdmObjectType.traitDef:
                    newObj = new CdmTraitDefinition(this.ctx, nameOrRef, undefined);
                    break;
                case cdmObjectType.traitRef:
                    newObj = new CdmTraitReference(this.ctx, nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.traitGroupDef:
                    newObj = new CdmTraitGroupDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.traitGroupRef:
                    newObj = new CdmTraitGroupReference(this.ctx, nameOrRef, simmpleNameRef);
                    break;
                case cdmObjectType.typeAttributeDef:
                    newObj = new CdmTypeAttributeDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.attributeContextDef:
                    newObj = new CdmAttributeContext(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.attributeContextRef:
                    newObj = new CdmAttributeContextReference(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.attributeRef:
                    newObj = new CdmAttributeReference(this.ctx, nameOrRef, simmpleNameRef);
                    break;
                case cdmObjectType.dataPartitionDef:
                    newObj = new CdmDataPartitionDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.dataPartitionPatternDef:
                    newObj = new CdmDataPartitionPatternDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.manifestDeclarationDef:
                    newObj = new CdmManifestDeclarationDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.referencedEntityDeclarationDef:
                    newObj = new CdmReferencedEntityDeclarationDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.localEntityDeclarationDef:
                    newObj = new CdmLocalEntityDeclarationDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.folderDef:
                    newObj = new CdmFolderDefinition(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.attributeResolutionGuidanceDef:
                    newObj = new CdmAttributeResolutionGuidance(this.ctx);
                    break;
                case cdmObjectType.e2eRelationshipDef:
                    newObj = new CdmE2ERelationship(this.ctx, nameOrRef);
                    break;
                case cdmObjectType.projectionDef:
                    newObj = new CdmProjection(this.ctx);
                    break;
                case cdmObjectType.operationAddCountAttributeDef:
                    newObj = new CdmOperationAddCountAttribute(this.ctx);
                    break;
                case cdmObjectType.operationAddSupportingAttributeDef:
                    newObj = new CdmOperationAddSupportingAttribute(this.ctx);
                    break;
                case cdmObjectType.operationAddTypeAttributeDef:
                    newObj = new CdmOperationAddTypeAttribute(this.ctx);
                    break;
                case cdmObjectType.operationExcludeAttributesDef:
                    newObj = new CdmOperationExcludeAttributes(this.ctx);
                    break;
                case cdmObjectType.operationArrayExpansionDef:
                    newObj = new CdmOperationArrayExpansion(this.ctx);
                    break;
                case cdmObjectType.operationCombineAttributesDef:
                    newObj = new CdmOperationCombineAttributes(this.ctx);
                    break;
                case cdmObjectType.operationRenameAttributesDef:
                    newObj = new CdmOperationRenameAttributes(this.ctx);
                    break;
                case cdmObjectType.operationReplaceAsForeignKeyDef:
                    newObj = new CdmOperationReplaceAsForeignKey(this.ctx);
                    break;
                case cdmObjectType.operationIncludeAttributesDef:
                    newObj = new CdmOperationIncludeAttributes(this.ctx);
                    break;
                case cdmObjectType.operationAddAttributeGroupDef:
                    newObj = new CdmOperationAddAttributeGroup(this.ctx);
                    break;
                case cdmObjectType.operationAlterTraitsDef:
                    newObj = new CdmOperationAlterTraits(this.ctx);
                    break;
                case cdmObjectType.operationAddArtifactAttributeDef:
                    newObj = new CdmOperationAddArtifactAttribute(this.ctx);
                    break;
                default:
            }

            return newObj as T;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public addDocumentObjects(folder: CdmFolderDefinition, doc: CdmDocumentDefinition): CdmDocumentDefinition {
        // let bodyCode = () =>
        {
            const path: string = this.storage.createAbsoluteCorpusPath(`${doc.folderPath}${doc.name}`, doc);
            this.documentLibrary.addDocumentPath(path, folder, doc);

            return doc;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public removeDocumentObjects(folder: CdmFolderDefinition, doc: CdmDocumentDefinition): void {
        // let bodyCode = () =>
        {

            // every symbol defined in this document is pointing at the document, so remove from cache.
            // also remove the list of docs that it depends on
            this.removeObjectDefinitions(doc);

            // remove from path lookup, folder lookup and global list of documents
            const path: string = this.storage.createAbsoluteCorpusPath(`${doc.folderPath}${doc.name}`, doc);
            this.documentLibrary.removeDocumentPath(path, folder, doc);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public indexDocuments(resOpt: resolveOptions, loadImports: boolean, rootDoc: CdmDocumentDefinition, docsLoaded: Set<string>): boolean {
        const docsNotIndexed: Set<CdmDocumentDefinition> = this.documentLibrary.listDocsNotIndexed(rootDoc, docsLoaded);

        // Step: clear document caches.
        for (const doc of docsNotIndexed) {
            if (!doc.declarationsIndexed || loadImports) {
                Logger.debug(this.ctx, this.TAG, this.indexDocuments.name, doc.atCorpusPath, `index start: ${doc.atCorpusPath}`);
                doc.clearCaches();
            }
        }

        // Step: check basic integrity.
        for (const doc of docsNotIndexed) {
            if (!doc.declarationsIndexed || loadImports) {
                doc.checkIntegrity();
            }
        }

        // Step: declare definitions in objects in this doc.
        for (const doc of docsNotIndexed) {
            if ((!doc.declarationsIndexed || loadImports) && doc.isValid) {
                doc.declareObjectDefinitions();
            }
        }

        if (loadImports) {
            // Step: Index import priorities.
            for (const doc of docsNotIndexed) {
                if (doc.isValid) {
                    // index any imports
                    doc.getImportPriorities();
                }
            }

            // Step: make sure we can find everything that is named by reference.
            for (const doc of docsNotIndexed) {
                if (doc.isValid) {
                    const resOptLocal: resolveOptions = resOpt.copy();
                    resOptLocal.wrtDoc = doc;
                    doc.resolveObjectDefinitions(resOptLocal);
                }
            }
            // Step: now resolve any trait arguments that are type object.
            for (const doc of docsNotIndexed) {
                if (doc.isValid) {
                    const resOptLocal: resolveOptions = resOpt.copy();
                    resOptLocal.wrtDoc = doc;
                    doc.resolveTraitArguments(resOptLocal);
                }
            }
        }

        // Step: finish up.
        for (const doc of docsNotIndexed) {
            doc.finishIndexing(loadImports);
        }

        return true;
    }

    /**
     * @deprecated
     */
    public visit(path: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        return false;
    }

    /**
     * Fetches an object by the path from the corpus.
     * @param objectPath Object path, absolute or relative.
     * @param obj Optional parameter. When provided, it is used to obtain the FolderPath and the Namespace needed
     * to create the absolute path from a relative path.
     * @param shallowValidationOrResOpt Optional parameter. When provided, shallow validation in ResolveOptions is enabled,
     * which logs errors regarding resolving/loading references as warnings.
     * It also accepts a ResolveOptions object. When provided, will use be used to determine how the symbols are resolved.
     * @param forceReload Optional parameter. When true, the document containing the requested object is reloaded from storage
     * to access any external changes made to the document since it may have been cached by the corpus.
     * @returns The object obtained from the provided path.
     */
    public async fetchObjectAsync<T>(objectPath: string, obj?: CdmObject, shallowValidationOrResOpt: boolean | resolveOptions | undefined = undefined, forceReload: boolean = false): Promise<T> {
        return await using(enterScope(CdmCorpusDefinition.name, this.ctx, this.fetchObjectAsync.name), async _ => {
            let resOpt: resolveOptions;
            if (typeof (shallowValidationOrResOpt) === 'boolean') {
                resOpt = new resolveOptions();
                resOpt.shallowValidation = shallowValidationOrResOpt;
            } else if (shallowValidationOrResOpt === undefined) {
                resOpt = new resolveOptions();
            } else {
                resOpt = shallowValidationOrResOpt;
            }

            objectPath = this.storage.createAbsoluteCorpusPath(objectPath, obj);

            let documentPath: string = objectPath;
            let documentNameIndex: number = objectPath.lastIndexOf(this.cdmExtension);

            if (documentNameIndex !== -1) {
                // if there is something after the document path, split it into document path and object path.
                documentNameIndex += this.cdmExtension.length;
                documentPath = objectPath.slice(0, documentNameIndex);
            }

            Logger.debug(this.ctx, this.TAG, this.fetchObjectAsync.name, objectPath, `request object: ${objectPath}`);
            const newObj: CdmContainerDefinition = await this.documentLibrary.loadFolderOrDocument(documentPath, forceReload);

            if (newObj) {
                // get imports and index each document that is loaded
                if (newObj instanceof CdmDocumentDefinition) {
                    if (!await newObj.indexIfNeeded(resOpt)) {
                        return undefined;
                    }
                    if (!newObj.isValid) {
                        Logger.error(this.ctx, this.TAG, this.fetchObjectAsync.name, newObj.atCorpusPath, cdmLogCode.ErrValdnInvalidDoc, objectPath);

                        return undefined;
                    }
                }

                if (documentPath === objectPath) {
                    if (newObj instanceof CdmManifestDefinition) {
                        Logger.ingestManifestTelemetry(newObj as CdmManifestDefinition, this.ctx, this.TAG, this.fetchObjectAsync.name, newObj.atCorpusPath);
                    }

                    return newObj as unknown as T;
                }

                if (documentNameIndex === -1) {
                    // there is no remaining path to be loaded, so return.
                    return undefined;
                }

                // trim off the document path to get the object path in the doc
                const remainingObjectPath: string = objectPath.slice(documentNameIndex + 1);

                const result: CdmObject = (newObj as CdmDocumentDefinition).fetchObjectFromDocumentPath(remainingObjectPath, resOpt);
                if (result === undefined) {
                    Logger.error(this.ctx, this.TAG, this.fetchObjectAsync.name, newObj.atCorpusPath, cdmLogCode.ErrDocSymbolNotFound, objectPath, newObj.atCorpusPath);
                } else {
                    // Log the telemetry if the object is a manifest
                    if (result instanceof CdmManifestDefinition) {
                        Logger.ingestManifestTelemetry(result as CdmManifestDefinition, this.ctx, this.TAG, this.fetchObjectAsync.name, result.atCorpusPath);
                    }

                    // Log the telemetry if the object is an entity
                    else if (result instanceof CdmEntityDefinition) {
                        Logger.ingestEntityTelemetry(result as CdmEntityDefinition, this.ctx, this.TAG, this.fetchObjectAsync.name, result.atCorpusPath);
                    }
                }

                return result as unknown as T;
            }
        });
    }

    public setEventCallback(
        status: EventCallback,
        reportAtLevel: cdmStatusLevel = cdmStatusLevel.info,
        correlationId?: string
    ): void {
        const ctx: resolveContext = this.ctx as resolveContext;
        ctx.statusEvent = status;
        ctx.reportAtLevel = reportAtLevel;
        ctx.correlationId = correlationId;
    }

    /**
     * @internal
     */
    public setImportDocuments(doc: CdmDocumentDefinition): void {
        if (doc.imports) {
            for (const imp of doc.imports) {
                if (!imp.document) {
                    // no document set for this import, see if it is already loaded into the corpus
                    const path: string = this.storage.createAbsoluteCorpusPath(imp.corpusPath, doc);
                    const impDoc: CdmDocumentDefinition = this.documentLibrary.fetchDocument(path);
                    if (impDoc) {
                        imp.document = impDoc;
                        this.setImportDocuments(imp.document);
                    }
                }
            }
        }
    }

    /**
     * @internal
     */
    public async loadImportsAsync(doc: CdmDocumentDefinition, docsLoading: Set<string>, resOpt: resolveOptions): Promise<void> {
        if (!doc) {
            // if there's not document, our job here is done.
            return;
        }

        const loadDocs = async (docPath: string) => {
            if (!this.documentLibrary.needToLoadDocument(docPath, docsLoading)) {
                return;
            }

            // load it
            const loadedDoc: CdmDocumentDefinition = await this.documentLibrary.loadFolderOrDocument(docPath, false, resOpt) as CdmDocumentDefinition;

            if (loadedDoc) {
                Logger.debug(this.ctx, this.TAG, this.loadImportsAsync.name, doc.atCorpusPath, `resolved import for '${loadedDoc.name}'`);
            } else {
                Logger.warning(this.ctx, this.TAG, this.loadImportsAsync.name, doc.atCorpusPath, cdmLogCode.WarnResolveImportFailed, docPath, doc.atCorpusPath);
            }

            await this.loadImportsAsync(loadedDoc, docsLoading, resOpt);
        }

        // Loop through all of the document's imports and load them recursively.
        const taskList: Promise<void>[] = [];
        for (const imp of doc.imports) {
            if (!imp.document) {
                const docPath = this.storage.createAbsoluteCorpusPath(imp.corpusPath, doc);
                const loadTask: Promise<void> = loadDocs(docPath);
                taskList.push(loadTask);
            }
        }

        // Wait for all of the missing docs to finish loading.
        await Promise.all(taskList);
    }

    /**
     * @internal
     */
    public async resolveImportsAsync(doc: CdmDocumentDefinition, docsLoading: Set<string>, resOpt: resolveOptions): Promise<void> {
        // load imports (and imports of imports)
        await this.loadImportsAsync(doc, docsLoading, resOpt);
        // now that everything is loaded, attach import docs to this doc's import list
        this.setImportDocuments(doc);
    }

    /**
     * @internal
     */
    public finishResolve(): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            Logger.debug(ctx, this.TAG, this.finishResolve.name, undefined, 'finishing...');
            for (const doc of this.documentLibrary.listAllDocuments()) {
                doc.finishIndexing(false);
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     * Returns the last modified time of the file where the object at the corpusPath can be found
     * @param corpusPath The corpus path to a CDM object
     */
    public async computeLastModifiedTimeAsync(corpusPath: string, obj?: CdmObject): Promise<Date> {
        const currObject: CdmObject = await this.fetchObjectAsync(corpusPath, obj, true);
        if (currObject) {
            return this.getLastModifiedTimeFromObjectAsync(currObject);
        }
    }

    /**
     * @internal
     * Returns the last modified time of the file where the input object can be found
     * @param currObject A CDM object
     */
    public async getLastModifiedTimeFromObjectAsync(currObject: CdmObject): Promise<Date> {
        const referencedEntity: CdmReferencedEntityDeclarationDefinition = currObject instanceof CdmReferencedEntityDeclarationDefinition ? currObject as CdmReferencedEntityDeclarationDefinition : undefined;
        if ("namespace" in currObject || (referencedEntity !== undefined && referencedEntity.isVirtual())) {

            const namespacePath = referencedEntity !== undefined ? referencedEntity.virtualLocation : currObject.atCorpusPath;

            // Remove namespace from path
            const pathTuple: [string, string] = StorageUtils.splitNamespacePath(namespacePath);
            if (!pathTuple) {
                Logger.error(this.ctx, this.TAG, this.getLastModifiedTimeFromObjectAsync.name, namespacePath, cdmLogCode.ErrStorageNullCorpusPath);

                return undefined;
            }

            const curNamespace: string = pathTuple[0];
            var path: string = pathTuple[1];

            if (currObject instanceof CdmManifestDefinition && (currObject as CdmManifestDefinition).isVirtual()) {
                path = (currObject as CdmManifestDefinition).virtualLocation;
            } else if (currObject instanceof CdmLocalEntityDeclarationDefinition && (currObject as CdmLocalEntityDeclarationDefinition).isVirtual()) {
                path = (currObject as CdmLocalEntityDeclarationDefinition).virtualLocation;
            }

            const adapter: StorageAdapterBase = this.storage.fetchAdapter(curNamespace);

            if (adapter === undefined) {
                Logger.error(this.ctx, this.TAG, this.getLastModifiedTimeFromObjectAsync.name, currObject.atCorpusPath, cdmLogCode.ErrAdapterNotFound, curNamespace);
                return undefined;
            }

            try {
                return adapter.computeLastModifiedTimeAsync(path);
            } catch (e) {
                Logger.error(this.ctx, this.TAG, this.getLastModifiedTimeFromObjectAsync.name, currObject.atCorpusPath, cdmLogCode.ErrManifestFileModTimeFailure, path, (e as Error).toString());
                return undefined;
            }
        } else {
            return this.getLastModifiedTimeFromObjectAsync(currObject.inDocument);
        }
    }

    /**
     * @internal
     * Returns the last modified time of a partition object, does not try to open the file
     * as getLastModifiedTime does
     * @param corpusPath The corpus path to a CDM object
     */
    public async getLastModifiedTimeFromPartitionPathAsync(corpusPath: string): Promise<Date> {
        const fileMetadata: CdmFileMetadata = await this.getFileMetadataFromPartitionPathAsync(corpusPath);

        if (fileMetadata == undefined) {
            return undefined;
        }

        return fileMetadata.lastModifiedTime;
    }

    /**
 * @internal
 * Returns the file metadata of the partition without trying to read the file itself.
 */
    public async getFileMetadataFromPartitionPathAsync(corpusPath: string): Promise<CdmFileMetadata> {
        // we do not want to load partitions from file, just check the modified times
        const pathTuple: [string, string] = StorageUtils.splitNamespacePath(corpusPath);
        if (!pathTuple) {
            Logger.error(this.ctx, this.TAG, this.getFileMetadataFromPartitionPathAsync.name, corpusPath, cdmLogCode.ErrPathNullObjectPath);

            return undefined;
        }
        const namespace: string = pathTuple[0];
        let adapter: StorageAdapterBase;
        if (namespace) {
            adapter = this.storage.fetchAdapter(namespace);
        }

        if (adapter === undefined) {
            Logger.error(this.ctx, this.TAG, this.getFileMetadataFromPartitionPathAsync.name, corpusPath, cdmLogCode.ErrAdapterNotFound);

            return undefined;
        }

        try {
            return adapter.fetchFileMetadataAsync(pathTuple[1]);
        } catch (e) {
            Logger.error(this.ctx, this.TAG, this.getFileMetadataFromPartitionPathAsync.name, corpusPath, cdmLogCode.ErrPartitionFileModTimeFailure, pathTuple[1], (e as Error).toString());
        }
    }

    /**
     * Returns a list of relationships where the input entity is the incoming entity
     * @param entity The entity that we want to get relationships for
     */
    public fetchIncomingRelationships(entity: CdmEntityDefinition): CdmE2ERelationship[] {
        if (this.incomingRelationships !== undefined && this.incomingRelationships.has(entity.atCorpusPath)) {
            return this.incomingRelationships.get(entity.atCorpusPath);
        }

        return [];
    }

    /**
     * Returns a list of relationships where the input entity is the outgoing entity
     * @param entity The entity that we want to get relationships for
     */
    public fetchOutgoingRelationships(entity: CdmEntityDefinition): CdmE2ERelationship[] {
        if (this.outgoingRelationships !== undefined && this.outgoingRelationships.has(entity.atCorpusPath)) {
            return this.outgoingRelationships.get(entity.atCorpusPath);
        }

        return [];
    }

    /**
     * Calculates the entity to entity relationships for all the entities present in the manifest and its sub-manifests.
     * @param currManifest The manifest (and any sub-manifests it contains) that we want to calculate relationships for.
     * @returns A Promise for the completion of entity graph calculation.
     */
    public async calculateEntityGraphAsync(currManifest: CdmManifestDefinition, resOpt: resolveOptions = undefined): Promise<void> {
        return await using(enterScope(CdmCorpusDefinition.name, this.ctx, this.calculateEntityGraphAsync.name), async _ => {
            for (const entityDec of currManifest.entities) {
                const entityPath: string = await currManifest.getEntityPathFromDeclaration(entityDec, currManifest);
                // the path returned by GetEntityPathFromDeclaration is an absolute path.
                // no need to pass the manifest to FetchObjectAsync.
                const entity: CdmEntityDefinition = await this.fetchObjectAsync<CdmEntityDefinition>(entityPath);

                if (!isEntityDefinition(entity)) {
                    Logger.error(this.ctx, this.TAG, this.calculateEntityGraphAsync.name, currManifest.atCorpusPath, cdmLogCode.ErrInvalidCast, entityPath, "CdmEntityDefinition");
                    continue;
                }

                if (!entity) {
                    continue;
                }

                let resEntity: CdmEntityDefinition;
                // make options wrt this entity document and "relational" always
                const resOptCopy: resolveOptions = resOpt != undefined ? resOpt.copy() : new resolveOptions();
                resOptCopy.wrtDoc = entity.inDocument;
                resOptCopy.directives = new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly']));

                const isResolvedEntity: boolean = entity.isResolved;

                // only create a resolved entity if the entity passed in was not a resolved entity
                if (!isResolvedEntity) {
                    // first get the resolved entity so that all of the references are present
                    resEntity = await entity.createResolvedEntityAsync(`wrtSelf_${entity.entityName}`, resOptCopy);
                } else {
                    resEntity = entity;
                }

                // find outgoing entity relationships using attribute context
                const newOutgoingRelationships: CdmE2ERelationship[] =
                    this.findOutgoingRelationships(resOptCopy, resEntity, resEntity.attributeContext, isResolvedEntity);

                const oldOutgoingRelationships: CdmE2ERelationship[] = this.outgoingRelationships.get(entity.atCorpusPath);

                // fix incoming rels based on any changes made to the outgoing rels
                if (oldOutgoingRelationships) {
                    for (const rel of oldOutgoingRelationships) {
                        const relString: string = rel.createCacheKey();
                        const hasRel: boolean = newOutgoingRelationships.some(x => x.createCacheKey() === relString);

                        // remove any relationships that no longer exist
                        if (!hasRel) {
                            let targetEnt: CdmEntityDefinition = await this.fetchObjectAsync<CdmEntityDefinition>(rel.toEntity, currManifest);
                            if (!isEntityDefinition(targetEnt)) {
                                Logger.error(this.ctx, this.TAG, this.calculateEntityGraphAsync.name, currManifest.atCorpusPath, cdmLogCode.ErrInvalidCast, rel.toEntity, "CdmEntityDefinition");
                                targetEnt = undefined;
                            }

                            if (targetEnt) {
                                const currIncoming: CdmE2ERelationship[] = this.incomingRelationships.get(targetEnt.atCorpusPath);
                                if (currIncoming) {
                                    currIncoming.splice(currIncoming.indexOf(rel), 1);
                                }
                            } else {
                                const absolutePath: string = this.storage.createAbsoluteCorpusPath(rel.toEntity, rel.inDocument);
                                this.incomingRelationships.delete(absolutePath);
                            }
                        }
                    }
                }

                this.outgoingRelationships.set(entity.atCorpusPath, newOutgoingRelationships);

                // flip outgoing entity relationships list to get incoming relationships map
                for (const rel of newOutgoingRelationships) {
                    let targetEnt: CdmEntityDefinition = await this.fetchObjectAsync<CdmEntityDefinition>(rel.toEntity, currManifest);
                    if (!isEntityDefinition(targetEnt)) {
                        Logger.error(this.ctx, this.TAG, this.calculateEntityGraphAsync.name, currManifest.atCorpusPath, cdmLogCode.ErrInvalidCast, rel.toEntity, "CdmEntityDefinition");
                        targetEnt = undefined;
                    }

                    if (targetEnt) {
                        if (!this.incomingRelationships.has(targetEnt.atCorpusPath)) {
                            this.incomingRelationships.set(targetEnt.atCorpusPath, []);
                        }
                        this.incomingRelationships.get(targetEnt.atCorpusPath)
                            .push(rel);
                    }
                }

                // delete the resolved entity if we created one here
                if (!isResolvedEntity) {
                    (resEntity.inDocument.owner as CdmFolderDefinition).documents.remove(resEntity.inDocument.name);
                }
            }

            for (const subManifestDef of currManifest.subManifests) {
                const corpusPath: string = this.storage.createAbsoluteCorpusPath(subManifestDef.definition, currManifest);
                const subManifest: CdmManifestDefinition = await this.fetchObjectAsync<CdmManifestDefinition>(corpusPath);
                if (!isManifestDefinition(subManifest)) {
                    Logger.error(this.ctx, this.TAG, this.calculateEntityGraphAsync.name, currManifest.atCorpusPath, cdmLogCode.ErrInvalidCast, corpusPath, "CdmManifestDefinition");
                    continue;
                }

                if (subManifest) {
                    await this.calculateEntityGraphAsync(subManifest, resOpt);
                }
            }
        });
    }

    /**
     * @internal
     */
    public findOutgoingRelationships(
        resOpt: resolveOptions,
        resEntity: CdmEntityDefinition,
        attCtx: CdmAttributeContext,
        isResolvedEntity: boolean = false,
        generatedAttSetContext?: CdmAttributeContext,
        wasProjectionPolymorphic: boolean = false,
        fromAtts: CdmAttributeReference[] = undefined,
        entityAttAttContext: CdmAttributeContext = undefined
    ): CdmE2ERelationship[] {
        let outRels: CdmE2ERelationship[] = [];
        if (attCtx && attCtx.contents) {
            // as we traverse the context tree, look for these nodes which hold the foreign key
            // once we find a context node that refers to an entity reference, we will use the
            // nearest _generatedAttributeSet (which is above or at the same level as the entRef context)
            // and use its foreign key
            let newGenSet: CdmAttributeContext = attCtx.contents.item('_generatedAttributeSet') as CdmAttributeContext;
            if (!newGenSet) {
                newGenSet = generatedAttSetContext;
            }

            let isEntityRef: boolean = false;
            let isPolymorphicSource: boolean = false;
            for (const subAttCtx of attCtx.contents.allItems) {
                if (subAttCtx.objectType === cdmObjectType.attributeContextDef) {
                    // find the top level entity definition's attribute context
                    if (entityAttAttContext === undefined && attCtx.type === cdmAttributeContextType.attributeDefinition
                        && attCtx.definition?.fetchObjectDefinition<CdmObjectDefinition>(resOpt)?.objectType === cdmObjectType.entityAttributeDef) {
                        entityAttAttContext = attCtx;
                    }
                    // find entity references that identifies the 'this' entity
                    const child: CdmAttributeContext = subAttCtx as CdmAttributeContext;
                    if (child.definition && child.definition.getObjectType() === cdmObjectType.entityRef) {
                        const toEntity: CdmObjectDefinition = child.definition.fetchObjectDefinition<CdmObjectDefinition>(resOpt);

                        if (toEntity?.objectType === cdmObjectType.projectionDef) {
                            // Projections

                            const owner: CdmObject = toEntity.owner && toEntity.owner.owner;

                            if (owner) {
                                isPolymorphicSource = (owner.objectType === cdmObjectType.entityAttributeDef &&
                                    (owner as CdmEntityAttributeDefinition).isPolymorphicSource);
                            }
                            else {
                                Logger.error(this.ctx, this.TAG, this.findOutgoingRelationships.name, subAttCtx.atCorpusPath, cdmLogCode.ErrObjectWithoutOwnerFound);
                            }

                            // From the top of the projection (or the top most which contains a generatedSet / operations)
                            // get the attribute names for the foreign key
                            if (newGenSet && !fromAtts) {
                                fromAtts = this.getFromAttributes(newGenSet, fromAtts);
                            }

                            // Fetch purpose traits
                            let traitRefsAndCorpusPaths: [CdmTraitReference, string][] = undefined;
                            const entityAtt: CdmEntityAttributeDefinition = owner.fetchObjectDefinition<CdmObjectDefinition>(resOpt) as CdmEntityAttributeDefinition;
                            if (entityAtt?.purpose !== undefined) {
                                const resolvedTraitSet = entityAtt.purpose.fetchResolvedTraits(resOpt);
                                if (resolvedTraitSet !== undefined) {
                                    traitRefsAndCorpusPaths = this.findElevatedTraitRefsAndCorpusPaths(resOpt, resolvedTraitSet);
                                }
                            }

                            outRels = this.findOutgoingRelationshipsForProjection(outRels, child, resOpt, resEntity, fromAtts, traitRefsAndCorpusPaths);

                            wasProjectionPolymorphic = isPolymorphicSource;
                        } else {
                            // Non-Projections based approach and current as-is code path

                            isEntityRef = true;

                            const toAtt: string[] = child.exhibitsTraits.allItems.filter(
                                (x: CdmTraitReferenceBase) => {
                                    return x.namedReference === 'is.identifiedBy' && (x as CdmTraitReference).arguments.length > 0;
                                })
                                .map((y: CdmTraitReferenceBase) => {
                                    const namedRef: string = ((y as CdmTraitReference).arguments.allItems[0].value as CdmAttributeReference).namedReference;

                                    return namedRef.slice(namedRef.lastIndexOf('/') + 1);
                                });

                            outRels = this.findOutgoingRelationshipsForEntityRef(toEntity, toAtt, outRels, newGenSet, child, resOpt, resEntity, isResolvedEntity, wasProjectionPolymorphic, isEntityRef, entityAttAttContext);
                        }
                    }

                    // repeat the process on the child node
                    const skipAdd: boolean = wasProjectionPolymorphic && isEntityRef;

                    const subOutRels: CdmE2ERelationship[] = this.findOutgoingRelationships(resOpt, resEntity, child, isResolvedEntity, newGenSet, wasProjectionPolymorphic, fromAtts, entityAttAttContext);
                    outRels = outRels.concat(subOutRels);

                    // if it was a projection-based polymorphic source up through this branch of the tree and currently it has reached the end of the projection tree to come to a non-projection source,
                    // then skip adding just this one source and continue with the rest of the tree
                    if (skipAdd) {
                        // skip adding only this entry in the tree and continue with the rest of the tree
                        wasProjectionPolymorphic = false;
                    }
                }
            }
        }

        return outRels;
    }

    /**
     * Fetch resolved traits on purpose from attribute context (non-projection entity attribute).
     */
    private fetchPurposeTraitRefsFromAttCtx(resOpt: resolveOptions, attributeCtx: CdmAttributeContext): [CdmTraitReference, string][] {
        const def: CdmObjectDefinition = attributeCtx.definition?.fetchObjectDefinition<CdmObjectDefinition>(resOpt);
        if (def?.objectType === cdmObjectType.entityAttributeDef && (def as CdmEntityAttributeDefinition)?.purpose !== undefined) {
            var resolvedTraitSet = (def as CdmEntityAttributeDefinition).purpose.fetchResolvedTraits(resOpt);
            if (resolvedTraitSet !== undefined) {
                return this.findElevatedTraitRefsAndCorpusPaths(resOpt, resolvedTraitSet);
            }
        }

        return undefined;
    }

    /**
     * Find the corpus path for each elevated trait.
     */
    private findElevatedTraitRefsAndCorpusPaths(resOpt: resolveOptions, resolvedTraitSet: ResolvedTraitSet): [CdmTraitReference, string][] {
        const traitRefsAndCorpusPaths: [CdmTraitReference, string][] = [];
        resolvedTraitSet.set.forEach(rt => {
            var traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOpt, rt);
            if (traitRef !== undefined && !StringUtils.isNullOrWhiteSpace(rt.trait.inDocument?.atCorpusPath)) {
                traitRefsAndCorpusPaths.push([traitRef, rt.trait.inDocument.atCorpusPath]);
            }
        })
        return traitRefsAndCorpusPaths;
    }

    /**
     * Find the outgoing relationships for Projections.
     * Given a list of 'From' attributes, find the E2E relationships based on the 'To' information stored in the trait of the attribute in the resolved entity
     * @internal
     */
    public findOutgoingRelationshipsForProjection(
        outRels: CdmE2ERelationship[],
        child: CdmAttributeContext,
        resOpt: resolveOptions,
        resEntity: CdmEntityDefinition,
        fromAtts: CdmAttributeReference[] = undefined,
        traitRefsAndCorpusPaths: [CdmTraitReference, string][] = undefined
    ): CdmE2ERelationship[] {
        if (fromAtts) {
            const resOptCopy: resolveOptions = resOpt.copy();
            resOptCopy.wrtDoc = resEntity.inDocument;

            // Extract the from entity from resEntity
            const refToLogicalEntity: CdmObjectReference = resEntity.attributeContext.definition;
            const unResolvedEntity: CdmEntityDefinition = refToLogicalEntity?.fetchObjectDefinition<CdmEntityDefinition>(resOptCopy);
            const fromEntity: string = unResolvedEntity?.ctx.corpus.storage.createRelativeCorpusPath(unResolvedEntity.atCorpusPath, unResolvedEntity.inDocument);

            for (let i: number = 0; i < fromAtts.length; i++) {
                // List of to attributes from the constant entity argument parameter
                const fromAttrDef: CdmTypeAttributeDefinition = fromAtts[i].fetchObjectDefinition<CdmTypeAttributeDefinition>(resOptCopy);
                const tupleList: [string, string, string][] = this.getToAttributes(fromAttrDef, resOptCopy);

                // For each of the to attributes, create a relationship
                for (const tuple of tupleList) {
                    const newE2ERel: CdmE2ERelationship = new CdmE2ERelationship(this.ctx, tuple[2]);
                    newE2ERel.fromEntity = this.storage.createAbsoluteCorpusPath(fromEntity, unResolvedEntity);
                    newE2ERel.fromEntityAttribute = fromAtts[i].fetchObjectDefinitionName();
                    newE2ERel.toEntity = this.storage.createAbsoluteCorpusPath(tuple[0], resEntity);
                    newE2ERel.toEntityAttribute = tuple[1];

                    this.addTraitRefsAndCorpusPathsToRelationship(traitRefsAndCorpusPaths, newE2ERel);

                    outRels.push(newE2ERel);
                }
            }
        }

        return outRels;
    }

    /**
     * Find the outgoing relationships for Non-Projections EntityRef
     * @internal
     */
    public findOutgoingRelationshipsForEntityRef(
        toEntity: CdmObjectDefinition,
        toAtt: string[],
        outRels: CdmE2ERelationship[],
        newGenSet: CdmAttributeContext,
        child: CdmAttributeContext,
        resOpt: resolveOptions,
        resEntity: CdmEntityDefinition,
        isResolvedEntity: boolean,
        wasProjectionPolymorphic: boolean = false,
        wasEntityRef: boolean = false,
        attributeCtx: CdmAttributeContext = undefined
    ): CdmE2ERelationship[] {
        // entity references should have the "is.identifiedBy" trait, and the entity ref should be valid
        if (toAtt.length === 1 && toEntity) {
            // get the attribute name from the foreign key
            const findAddedAttributeIdentity = (context: CdmAttributeContext): string => {
                if (context && context.contents) {
                    for (const sub of context.contents.allItems) {
                        const subCtx: CdmAttributeContext = sub as CdmAttributeContext;
                        if (subCtx.type === cdmAttributeContextType.entity) {
                            continue;
                        }
                        const fk: string = findAddedAttributeIdentity(subCtx);
                        if (fk) {
                            return fk;
                        } else if (subCtx && subCtx.type === cdmAttributeContextType.addedAttributeIdentity
                            && subCtx.contents && subCtx.contents.allItems[0]) {
                            // entity references should have the "is.identifiedBy" trait, and the entity def should be valid
                            return (subCtx.contents.allItems[0] as CdmObjectReference).namedReference;
                        }
                    }
                }
            };

            const foreignKey: string = findAddedAttributeIdentity(newGenSet);

            if (foreignKey) {
                // this list will contain the final tuples used for the toEntity where
                // index 0 is the absolute path to the entity and index 1 is the toEntityAttribute
                const toAttList: [string, string][] = [];

                // get the list of toAttributes from the traits on the resolved attribute
                const resolvedResOpt: resolveOptions = new resolveOptions(resEntity.inDocument);
                const attFromFk: CdmTypeAttributeDefinition = this.resolveSymbolReference(resolvedResOpt, resEntity.inDocument, foreignKey, cdmObjectType.typeAttributeDef, false) as CdmTypeAttributeDefinition;
                if (attFromFk !== undefined) {
                    const fkArgValues: [string, string, string][] = this.getToAttributes(attFromFk, resolvedResOpt);

                    for (const constEnt of fkArgValues) {
                        const absolutePath: string = this.storage.createAbsoluteCorpusPath(constEnt[0], attFromFk);
                        toAttList.push([absolutePath, constEnt[1]]);
                    }
                }

                const traitRefsAndCorpusPaths: [CdmTraitReference, string][] = this.fetchPurposeTraitRefsFromAttCtx(resOpt, attributeCtx);

                for (const attributeTuple of toAttList) {
                    const fromAtt: string = foreignKey.slice(foreignKey.lastIndexOf('/') + 1)
                        .replace(`${child.name}_`, '');

                    const newE2ERel: CdmE2ERelationship = new CdmE2ERelationship(this.ctx, '');
                    newE2ERel.fromEntityAttribute = fromAtt;
                    newE2ERel.toEntityAttribute = attributeTuple[1];

                    this.addTraitRefsAndCorpusPathsToRelationship(traitRefsAndCorpusPaths, newE2ERel);

                    if (isResolvedEntity) {
                        newE2ERel.fromEntity = resEntity.atCorpusPath;
                        if (this.resEntMap.has(attributeTuple[0])) {
                            newE2ERel.toEntity = this.resEntMap.get(attributeTuple[0]);
                        } else {
                            newE2ERel.toEntity = attributeTuple[0];
                        }
                    } else {
                        // find the path of the unresolved entity using the attribute context of the resolved entity
                        const refToLogicalEntity: CdmObjectReference = resEntity.attributeContext.definition;

                        let unResolvedEntity: CdmEntityDefinition;
                        if (refToLogicalEntity) {
                            unResolvedEntity = refToLogicalEntity.fetchObjectDefinition(resOpt);
                        }
                        const selectedEntity: CdmEntityDefinition = unResolvedEntity !== undefined ? unResolvedEntity : resEntity;
                        const selectedEntCorpusPath: string =
                            unResolvedEntity !== undefined ? unResolvedEntity.atCorpusPath : resEntity.atCorpusPath.replace('wrtSelf_', '');

                        newE2ERel.fromEntity = this.storage.createAbsoluteCorpusPath(selectedEntCorpusPath, selectedEntity);
                        newE2ERel.toEntity = attributeTuple[0];
                    }

                    // if it was a projection-based polymorphic source up through this branch of the tree and currently it has reached the end of the projection tree to come to a non-projection source,
                    // then skip adding just this one source and continue with the rest of the tree
                    if (!(wasProjectionPolymorphic && wasEntityRef)) {
                        outRels.push(newE2ERel);
                    }
                }
            }
        }

        return outRels;
    }

    private addTraitRefsAndCorpusPathsToRelationship(traitRefsAndCorpusPaths: [CdmTraitReference, string][], cdmE2ERel: CdmE2ERelationship): void {
        if (traitRefsAndCorpusPaths !== undefined) {
            for (const pair of traitRefsAndCorpusPaths) {
                cdmE2ERel.exhibitsTraits.allItems.push(pair[0]);
                cdmE2ERel.getElevatedTraitCorpusPath().set(pair[0], pair[1]);
            }
        }
    }

    /**
     * Resolves references according to the provided stages and validates.
     * @returns The validation step that follows the completed step
     * @deprecated
     */
    public async resolveReferencesAndValidateAsync(
        stage: cdmValidationStep,
        stageThrough: cdmValidationStep,
        resOpt: resolveOptions
    ): Promise<cdmValidationStep> {
        // let bodyCode = () =>
        {
            return new Promise<cdmValidationStep>(
                async (resolve: (value?: cdmValidationStep | PromiseLike<cdmValidationStep>) => void): Promise<void> => {
                    // use the provided directives or use the current default
                    let directives: AttributeResolutionDirectiveSet;
                    if (resOpt) {
                        directives = resOpt.directives;
                    } else {
                        directives = this.defaultResolutionDirectives;
                    }
                    resOpt = new resolveOptions(undefined, directives);
                    resOpt.depthInfo.reset();

                    for (const doc of this.documentLibrary.listAllDocuments()) {
                        await doc.indexIfNeeded(resOpt);
                    }

                    const finishresolve: boolean = stageThrough === stage;
                    switch (stage) {
                        case cdmValidationStep.start:
                        case cdmValidationStep.traitAppliers:
                            this.resolveReferencesStep(
                                'defining traits...',
                                (currentDoc: CdmDocumentDefinition, resOptions: resolveOptions, entityNesting: number) => { },
                                resOpt,
                                true,
                                finishresolve || stageThrough === cdmValidationStep.minimumForResolving,
                                cdmValidationStep.traits
                            );

                            return;
                        case cdmValidationStep.traits:
                            this.resolveReferencesStep(
                                'resolving traits...',
                                (currentDoc: CdmDocumentDefinition, resOptions: resolveOptions, entityNesting: number) => {
                                    this.resolveTraits(currentDoc, resOptions, entityNesting);
                                },
                                resOpt,
                                false,
                                finishresolve,
                                cdmValidationStep.traits
                            );
                            this.resolveReferencesStep(
                                'checking required arguments...',
                                (currentDoc: CdmDocumentDefinition, resOptions: resolveOptions, entityNesting: number) => {
                                    this.resolveReferencesTraitsArguments(currentDoc, resOptions, entityNesting);
                                },
                                resOpt,
                                true,
                                finishresolve,
                                cdmValidationStep.attributes
                            );

                            return;
                        case cdmValidationStep.attributes:
                            this.resolveReferencesStep(
                                'resolving attributes...',
                                (currentDoc: CdmDocumentDefinition, resOptions: resolveOptions, entityNesting: number) => {
                                    this.resolveAttributes(currentDoc, resOptions, entityNesting);
                                },
                                resOpt,
                                true,
                                finishresolve,
                                cdmValidationStep.entityReferences
                            );

                            return;
                        case cdmValidationStep.entityReferences:
                            this.resolveReferencesStep(
                                'resolving foreign key references...',
                                (currentDoc: CdmDocumentDefinition, resOptions: resolveOptions, entityNesting: number) => {
                                    this.resolveForeignKeyReferences(currentDoc, resOptions, entityNesting);
                                },
                                resOpt,
                                true,
                                true,
                                cdmValidationStep.finished
                            );

                            return;
                        default:
                    }

                    // bad step sent in
                    resolve(cdmValidationStep.error);
                }
            );
        }
    }

    /**
     * @internal
     * fetches from primitives or creates the default attributes that get added by resolution 
     */
    public async prepareArtifactAttributesAsync(): Promise<boolean> {
        if (!this.knownArtifactAttributes) {
            this.knownArtifactAttributes = new Map<string, CdmTypeAttributeDefinition>();
            // see if we can get the value from primitives doc
            // this might fail, and we do not want the user to know about it.
            const oldStatus = this.ctx.statusEvent; // todo, we should make an easy way for our code to do this and set it back
            const oldLevel = this.ctx.reportAtLevel;
            this.setEventCallback(() => { }, cdmStatusLevel.error);

            let entArt: CdmEntityDefinition;
            try {
                const defaultArtifactsPath = 'cdm:/primitives.cdm.json/defaultArtifacts';
                entArt = await this.fetchObjectAsync<CdmEntityDefinition>(defaultArtifactsPath);
                if (!isEntityDefinition(entArt)) {
                    Logger.error(this.ctx, this.TAG, this.prepareArtifactAttributesAsync.name, undefined, cdmLogCode.ErrInvalidCast, defaultArtifactsPath, "CdmEntityDefinition");
                    entArt = undefined;
                }
            }
            finally {
                this.setEventCallback(oldStatus, oldLevel);
            }

            if (!entArt) {
                // fallback to the old ways, just make some
                let artAtt: CdmTypeAttributeDefinition = this.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'count');
                artAtt.dataType = this.MakeObject<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'integer', true);
                this.knownArtifactAttributes.set('count', artAtt);
                artAtt = this.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'id');
                artAtt.dataType = this.MakeObject<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'entityId', true);
                this.knownArtifactAttributes.set('id', artAtt);
                artAtt = this.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'type');
                artAtt.dataType = this.MakeObject<CdmDataTypeReference>(cdmObjectType.dataTypeRef, 'entityName', true);
                this.knownArtifactAttributes.set('type', artAtt);
            } else {
                // point to the ones from the file
                for (const att of entArt.attributes) {
                    this.knownArtifactAttributes.set((att as CdmAttribute).name, att as CdmTypeAttributeDefinition);
                }
            }
        }
        return true;
    }

    /**
     * @internal
     * returns the (previously prepared) artifact attribute of the known name
     */
    public fetchArtifactAttribute(name: string): CdmTypeAttributeDefinition {
        if (!this.knownArtifactAttributes) {
            // this is a usage mistake. never call this before success from the PrepareArtifactAttributesAsync
            return undefined;
        }

        return this.knownArtifactAttributes.get(name).copy() as CdmTypeAttributeDefinition;
    }

    private removeObjectDefinitions(doc: CdmDocumentDefinition): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            doc.visit(
                '',
                (iObject: CdmObject, path: string) => {
                    if (path.indexOf('(unspecified)') !== -1) {
                        return true;
                    }
                    switch (iObject.objectType) {
                        case cdmObjectType.entityDef:
                        case cdmObjectType.parameterDef:
                        case cdmObjectType.traitDef:
                        case cdmObjectType.traitGroupDef:
                        case cdmObjectType.purposeDef:
                        case cdmObjectType.dataTypeDef:
                        case cdmObjectType.typeAttributeDef:
                        case cdmObjectType.entityAttributeDef:
                        case cdmObjectType.attributeGroupDef:
                        case cdmObjectType.constantEntityDef:
                        case cdmObjectType.attributeContextDef:
                        case cdmObjectType.localEntityDeclarationDef:
                        case cdmObjectType.referencedEntityDeclarationDef:
                        case cdmObjectType.projectionDef:
                        case cdmObjectType.operationAddCountAttributeDef:
                        case cdmObjectType.operationAddSupportingAttributeDef:
                        case cdmObjectType.operationAddTypeAttributeDef:
                        case cdmObjectType.operationExcludeAttributesDef:
                        case cdmObjectType.operationArrayExpansionDef:
                        case cdmObjectType.operationCombineAttributesDef:
                        case cdmObjectType.operationRenameAttributesDef:
                        case cdmObjectType.operationReplaceAsForeignKeyDef:
                        case cdmObjectType.operationIncludeAttributesDef:
                        case cdmObjectType.operationAddAttributeGroupDef:
                        case cdmObjectType.operationAlterTraitsDef:
                        case cdmObjectType.operationAddArtifactAttributeDef:
                            this.unRegisterSymbol(path, doc);
                            this.unRegisterDefinitionReferenceDocuments(iObject, 'rasb');
                        default:
                    }

                    return false;
                },
                undefined
            );
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     * @param symbolDef
     * @param inDoc 
     */
    public registerSymbol(symbolDef: string, inDoc: CdmDocumentDefinition): void {
        // let bodyCode = () =>
        {
            let docs: CdmDocumentDefinition[] = this.symbolDefinitions.get(symbolDef);
            if (!docs) {
                docs = [];

                this.symbolDefinitions.set(symbolDef, docs);
            }

            docs.push(inDoc);
        }
        // return p.measure(bodyCode);
    }

    private unRegisterSymbol(symbolDef: string, inDoc: CdmDocumentDefinition): void {
        // let bodyCode = () =>
        {
            // if the symbol is listed for the given doc, remove it
            const docs: CdmDocumentDefinition[] = this.symbolDefinitions.get(symbolDef);
            if (docs) {
                const index: number = docs.indexOf(inDoc);
                if (index !== -1) {
                    docs.splice(index, 1);
                }
            }
        }
        // return p.measure(bodyCode);
    }

    private resolveTraits(currentDoc: CdmDocumentDefinition, resOpt: resolveOptions, entityNesting: number): void {
        const ctx: resolveContext = this.ctx as resolveContext;
        currentDoc.visit(
            '',
            (iObject: CdmObject, path: string) => {
                switch (iObject.objectType) {
                    case cdmObjectType.entityDef:
                    case cdmObjectType.attributeGroupDef:
                        entityNesting++;
                        // don't do this for entities and groups defined within entities since getting traits already does that
                        if (entityNesting > 1) {
                            break;
                        }
                    case cdmObjectType.traitDef:
                    case cdmObjectType.traitGroupDef:
                    case cdmObjectType.purposeDef:
                    case cdmObjectType.dataTypeDef:
                        (this.ctx as resolveContext).relativePath = path;
                        (iObject as CdmObjectDefinition).fetchResolvedTraits(resOpt);
                        break;
                    case cdmObjectType.entityAttributeDef:
                    case cdmObjectType.typeAttributeDef:
                        ctx.relativePath = path;
                        (iObject as CdmAttribute).fetchResolvedTraits(resOpt);
                    default:
                }

                return false;
            },
            (iObject: CdmObject, path: string) => {
                if (isEntityDefinition(iObject) || isAttributeGroupDefinition(iObject)) {
                    entityNesting--;
                }

                return false;
            }
        );
    }

    private resolveReferencesTraitsArguments(currentDoc: CdmDocumentDefinition, resOpt: resolveOptions, entityNesting: number): void {
        const ctx: resolveContext = this.ctx as resolveContext;
        const checkRequiredParamsOnResolvedTraits: (obj: CdmObject) => void = (obj: CdmObject): void => {
            const rts: ResolvedTraitSet = obj.fetchResolvedTraits(resOpt);
            if (rts) {
                const l: number = rts.size;
                for (let i: number = 0; i < l; i++) {
                    const rt: ResolvedTrait = rts.set[i];
                    let found: number = 0;
                    let resolved: number = 0;
                    if (rt && rt.parameterValues) {
                        const parameterValuesCount: number = rt.parameterValues.length;
                        for (let iParam: number = 0; iParam < parameterValuesCount; iParam++) {
                            if (rt.parameterValues.fetchParameterAtIndex(iParam)
                                .getRequired()) {
                                found++;
                                if (!rt.parameterValues.fetchValue(iParam)) {
                                    const paramName: string = rt.parameterValues.fetchParameterAtIndex(iParam)
                                        .getName();
                                    const objectName: string = obj.fetchObjectDefinition(resOpt)
                                        .getName();

                                    Logger.error(this.ctx, this.TAG, this.resolveReferencesTraitsArguments.name, currentDoc.atCorpusPath, cdmLogCode.ErrTraitArgumentMissing, paramName, rt.traitName, objectName);

                                } else {
                                    resolved++;
                                }
                            }
                        }
                    }
                    if (found > 0 && found === resolved) {
                        Logger.debug(ctx, this.TAG, this.resolveReferencesTraitsArguments.name, currentDoc.atCorpusPath, `found and resolved '${found}' required parameters of trait '${rt.traitName}' on '${obj
                            .fetchObjectDefinition(resOpt)
                            .getName()}'`);
                    }
                }
            }
        };

        currentDoc.visit('', undefined, (iObject: CdmObject, path: string) => {
            const ot: cdmObjectType = iObject.objectType;
            if (ot === cdmObjectType.entityDef) {
                ctx.relativePath = path;
                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                checkRequiredParamsOnResolvedTraits(iObject);
                // do the same for all attributes
                if ((iObject as CdmEntityDefinition).attributes) {
                    for (const attDef of (iObject as CdmEntityDefinition).attributes) {
                        checkRequiredParamsOnResolvedTraits(attDef);
                    }
                }
            }
            if (ot === cdmObjectType.attributeGroupDef) {
                ctx.relativePath = path;
                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                checkRequiredParamsOnResolvedTraits(iObject);
                // do the same for all attributes
                if ((iObject as CdmAttributeGroupDefinition).members) {
                    for (const attDef of (iObject as CdmAttributeGroupDefinition).members) {
                        checkRequiredParamsOnResolvedTraits(attDef);
                    }
                }
            }

            return false;
        });
    }

    private resolveAttributes(currentDoc: CdmDocumentDefinition, resOpt: resolveOptions, entityNesting: number): void {
        const ctx: resolveContext = this.ctx as resolveContext;
        currentDoc.visit(
            '',
            (iObject: CdmObject, path: string) => {
                const ot: cdmObjectType = iObject.objectType;
                if (ot === cdmObjectType.entityDef) {
                    entityNesting++; // get resolved att is already recursive, so don't compound
                    if (entityNesting === 1) {
                        ctx.relativePath = path;
                        (iObject as CdmEntityDefinition).fetchResolvedAttributes(resOpt);
                    }
                }
                if (ot === cdmObjectType.attributeGroupDef) {
                    entityNesting++;
                    if (entityNesting === 1) {
                        // entity will do this for the group defined inside it
                        ctx.relativePath = path;
                        (iObject as CdmAttributeGroupDefinition).fetchResolvedAttributes(resOpt);
                    }
                }

                return false;
            },
            (iObject: CdmObject, path: string) => {
                if (isEntityDefinition(iObject) || isAttributeGroupDefinition(iObject)) {
                    entityNesting--;
                }

                return false;
            }
        );
    }

    private resolveForeignKeyReferences(currentDoc: CdmDocumentDefinition, resOpt: resolveOptions, entityNesting: number): void {
        currentDoc.visit(
            '',
            (iObject: CdmObject, path: string) => {
                const ot: cdmObjectType = iObject.objectType;
                if (ot === cdmObjectType.attributeGroupDef) {
                    entityNesting++;
                }
                if (ot === cdmObjectType.entityDef) {
                    entityNesting++;
                    if (entityNesting === 1) {
                        // get resolved is recursive, so no need
                        (this.ctx as resolveContext).relativePath = path;
                        (iObject as CdmEntityDefinition).fetchResolvedEntityReference(resOpt);
                    }
                }

                return false;
            },
            (iObject: CdmObject, path: string) => {
                if (isEntityDefinition(iObject) || isAttributeGroupDefinition(iObject)) {
                    entityNesting--;
                }

                return false;
            }
        );
    }

    private resolveReferencesStep(
        statusMessage: string,
        resolveAction: (currentDoc: CdmDocumentDefinition, resOpt: resolveOptions, entityNesting: number) => void,
        resolveOpt: resolveOptions,
        stageFinished: boolean,
        finishResolve: boolean,
        nextStage: cdmValidationStep
    ): cdmValidationStep {
        const ctx: resolveContext = this.ctx as resolveContext;
        Logger.debug(ctx, this.TAG, this.resolveReferencesStep.name, undefined, statusMessage);
        const entityNesting: number = 0;
        for (const doc of this.documentLibrary.listAllDocuments()) {
            // cache import documents
            const currentDoc: CdmDocumentDefinition = doc;
            resolveOpt.wrtDoc = currentDoc;
            resolveAction(currentDoc, resolveOpt, entityNesting);
        }
        if (stageFinished) {
            if (finishResolve) {
                this.finishResolve();

                return cdmValidationStep.finished;
            }

            return nextStage;
        }

        return nextStage;
    }

    /**
     * Checks whether a resolved entity has an "is.identifiedBy" trait.
     */
    private checkPrimaryKeyAttributes(resolvedEntity: CdmEntityDefinition, resOpt: resolveOptions, ctx: resolveContext): void {
        if (resolvedEntity.fetchResolvedTraits(resOpt)
            .find(resOpt, 'is.identifiedBy') === undefined) {

            Logger.warning(this.ctx, this.TAG, this.checkPrimaryKeyAttributes.name, resolvedEntity.atCorpusPath, cdmLogCode.WarnValdnPrimaryKeyMissing, resolvedEntity.getName());
        }
    }

    private reportErrorStatus(found: CdmObjectBase, symbolDef: string, expectedType: cdmObjectType): CdmObjectBase {
        const ctx: resolveContext = this.ctx as resolveContext;
        switch (expectedType) {
            case cdmObjectType.traitRef:
                if (!isCdmTraitDefinition(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'trait', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.dataTypeRef:
                if (!isDataTypeDefinition(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'dataType', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.entityRef:
                if (!isEntityDefinition(found) && !isProjection(found) && !isConstantEntityDefinition(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'entity or type projection or type constant entity', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.parameterDef:
                if (!isParameterDefinition(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'parameter', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.purposeRef:
                if (!isPurposeDefinition(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'purpose', symbolDef);

                    return undefined;
                }
                break;
            case cdmObjectType.traitGroupRef:
                if (!isCdmTraitGroupDefinition(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'traitGroup', symbolDef);

                    return undefined;
                }
                break;
            case cdmObjectType.attributeGroupRef:
                if (!isAttributeGroupDefinition(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'attributeGroup', symbolDef);

                    return undefined;
                }
                break;
            case cdmObjectType.projectionDef:
                if (!isProjection(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'projection', symbolDef);

                    return undefined;
                }
                break;
            case cdmObjectType.operationAddCountAttributeDef:
                if (!isOperationAddCountAttribute(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'add count attribute operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationAddSupportingAttributeDef:
                if (!isOperationAddSupportingAttribute(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'add supporting attribute operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationAddTypeAttributeDef:
                if (!isOperationAddTypeAttribute(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'add type attribute operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationExcludeAttributesDef:
                if (!isOperationExcludeAttributes(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'exclude attributes operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationArrayExpansionDef:
                if (!isOperationArrayExpansion(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'array expansion operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationCombineAttributesDef:
                if (!isOperationCombineAttributes(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'combine attributes operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationRenameAttributesDef:
                if (!isOperationRenameAttributes(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'rename attributes operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationReplaceAsForeignKeyDef:
                if (!isOperationReplaceAsForeignKey(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'replace as foreign key operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationIncludeAttributesDef:
                if (!isOperationIncludeAttributes(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'include attributes operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationAddAttributeGroupDef:
                if (!isOperationAddAttributeGroup(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'add attribute group operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationAlterTraitsDef:
                if (!isOperationAlterTraits(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'alter traits operation', symbolDef);
                    return undefined;
                }
                break;
            case cdmObjectType.operationAddArtifactAttributeDef:
                if (!isOperationAddArtifactAttribute(found)) {
                    Logger.error(this.ctx, this.TAG, this.reportErrorStatus.name, found.atCorpusPath, cdmLogCode.ErrUnexpectedType, 'add artifact attribute operation', symbolDef);
                    return undefined;
                }
                break;
            default:
        }

        return found;
    }

    private isPathManifestDocument(path: string): boolean {
        return path.endsWith(CdmConstants.manifestExtension)
            || path.endsWith(CdmConstants.modelJsonExtension)
            || path.endsWith(CdmConstants.folioExtension);
    }

    private pathToSymbol(symbol: string, docFrom: CdmDocumentDefinition, docResultTo: docsResult): string {
        // if no destination given, no path to look for
        if (docResultTo.docBest === undefined) {
            return undefined;
        }

        // if there, return
        if (docFrom === docResultTo.docBest) {
            return docResultTo.newSymbol;
        }

        // if the to Doc is imported directly here,
        let pri: number;
        if (docFrom.importPriorities.importPriority.has(docResultTo.docBest)) {
            pri = docFrom.importPriorities.importPriority.get(docResultTo.docBest).priority;

            // if the imported version is the highest priority, we are good
            if (!docResultTo.docList || docResultTo.docList.length === 1) {
                return symbol;
            }

            // more than 1 symbol, see if highest pri
            let maxPri: number = -1;
            for (const docCheck of docResultTo.docList) {
                const priCheck: number = docFrom.importPriorities.importPriority.get(docCheck).priority;
                if (priCheck > maxPri) {
                    maxPri = priCheck;
                }
            }
            if (maxPri === pri) {
                return symbol;
            }
        }

        // can't get there directly, check the monikers
        if (docFrom.importPriorities.monikerPriorityMap !== undefined) {
            for (const kv of docFrom.importPriorities.monikerPriorityMap) {
                const tryMoniker: string = this.pathToSymbol(symbol, kv[1], docResultTo);
                if (tryMoniker !== undefined) {
                    return `${kv[0]}/${tryMoniker}`;
                }
            }
        }

        return undefined;
    }

    /**
     * For Projections get the list of 'From' Attributes
     */
    private getFromAttributes(newGenSet: CdmAttributeContext, fromAttrs: CdmAttributeReference[]): CdmAttributeReference[] {
        if (newGenSet?.contents) {
            if (!fromAttrs) {
                fromAttrs = [];
            }

            for (const sub of newGenSet.contents) {
                if (sub.objectType === cdmObjectType.attributeContextDef) {
                    const subCtx: CdmAttributeContext = sub as CdmAttributeContext;
                    fromAttrs = this.getFromAttributes(subCtx, fromAttrs);
                } else if (sub.objectType === cdmObjectType.attributeRef) {
                    fromAttrs.push(sub as CdmAttributeReference);
                }
            }
        }

        return fromAttrs;
    }

    /**
     * For Projections get the list of 'To' Attributes
     */
    private getToAttributes(fromAttrDef: CdmTypeAttributeDefinition, resOpt: resolveOptions): [string, string, string][] {
        if (fromAttrDef?.appliedTraits) {
            const tupleList: [string, string, string][] = [];
            for (const trait of fromAttrDef.appliedTraits) {
                if (trait.namedReference === 'is.linkedEntity.identifier' && (trait as CdmTraitReference).arguments.length > 0) {
                    const constEnt: CdmConstantEntityDefinition = ((trait as CdmTraitReference).arguments.allItems[0].value as CdmEntityReference)
                        .fetchObjectDefinition<CdmConstantEntityDefinition>(resOpt);
                    if (constEnt && constEnt.constantValues.length > 0) {
                        for (const constantValues of constEnt.constantValues) {
                            tupleList.push([constantValues[0], constantValues[1], constantValues.length > 2 ? constantValues[2] : '']);
                        }
                    }
                }
            }

            return tupleList;
        }

        return undefined;
    }
}
