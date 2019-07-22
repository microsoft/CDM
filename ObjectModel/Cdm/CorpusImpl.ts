import {
    ArgumentImpl,
    ArgumentValue,
    AttributeContextImpl,
    AttributeContextReferenceImpl,
    AttributeGroupImpl,
    AttributeGroupReferenceImpl,
    AttributeReferenceImpl,
    cdmObject,
    cdmObjectDef,
    cdmObjectRef,
    cdmObjectType,
    cdmStatusLevel,
    cdmValidationStep,
    ConstantEntityImpl,
    DataTypeImpl,
    DataTypeReferenceImpl,
    DocSet,
    DocSetCollection,
    docsResult,
    DocumentImpl,
    EntityAttributeImpl,
    EntityImpl,
    EntityReferenceImpl,
    FolderImpl,
    ICdmArgumentDef,
    ICdmAttributeDef,
    ICdmAttributeGroupDef,
    ICdmCorpusDef,
    ICdmDataTypeDef,
    ICdmDocumentDef,
    ICdmEntityDef,
    ICdmFolderDef,
    ICdmObject,
    ICdmObjectDef,
    ICdmObjectRef,
    ICdmParameterDef,
    ICdmProfiler,
    ICdmTraitDef,
    ImportImpl,
    p,
    ParameterCollection,
    ParameterImpl,
    PrimitiveAppliers,
    RelationshipImpl,
    RelationshipReferenceImpl,
    resolveContext,
    ResolvedTrait,
    ResolvedTraitSet,
    resolveOptions,
    RptCallback,
    TraitApplier,
    TraitDirectiveSet,
    TraitImpl,
    TraitReferenceImpl,
    TypeAttributeImpl
} from '../internal';

export class CorpusImpl extends FolderImpl implements ICdmCorpusDef {

    public get profiler(): ICdmProfiler {
        return p;
    }
    // tslint:disable-next-line:variable-name
    public static _nextID: number = 0;
    public rootPath: string;
    public allDocuments?: [FolderImpl, DocumentImpl][];
    public directory: Map<DocumentImpl, FolderImpl>;
    public pathLookup: Map<string, [FolderImpl, DocumentImpl]>;
    public symbolDefinitions: Map<string, DocumentImpl[]>;
    public definitionReferenceDocuments: Map<string, DocSetCollection>;
    public defintionWrtTag: Map<string, string>;
    public emptyRTS: Map<string, ResolvedTraitSet>;

    constructor(rootPath: string) {
        super(undefined, undefined, '', '');
        // let bodyCode = () =>
        {
            this.corpus = this; // well ... it is
            this.rootPath = rootPath;
            this.allDocuments = [];
            this.pathLookup = new Map<string, [FolderImpl, DocumentImpl]>();
            this.directory = new Map<DocumentImpl, FolderImpl>();
            this.symbolDefinitions = new Map<string, DocumentImpl[]>();
            this.definitionReferenceDocuments = new Map<string, DocSetCollection>();
            this.defintionWrtTag = new Map<string, string>();
            this.emptyRTS = new Map<string, ResolvedTraitSet>();

            this.ctx = new resolveContext(this, (level: cdmStatusLevel, msg: string, path: string): void => {
                if (level >= (this.ctx as resolveContext).errorAtLevel) {
                    (this.ctx as resolveContext).errors++;
                }
            });
        }
        // return p.measure(bodyCode);
    }

    public static nextID(): number {
        this._nextID++;

        return this._nextID;
    }

    public static GetReferenceType(ofType: cdmObjectType): cdmObjectType {
        // let bodyCode = () =>
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
        // return p.measure(bodyCode);
    }

    public static getCacheKeyFromObject(definition: ICdmObject, kind: string): string {
        return `${definition.ID}-${kind}`;
    }

    private static getPriorityDoc(docs: DocSet, importPriority: Map<DocumentImpl, number>): DocumentImpl {
        // let bodyCode = () =>
        {
            let docBest: DocumentImpl;
            let indexBest: number = Number.MAX_SAFE_INTEGER;
            for (const docDefined of docs) {
                // is this one of the imported docs?
                const indexFound: number = importPriority.get(docDefined);
                if (indexFound < indexBest) {
                    indexBest = indexFound;
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

    private static passReferenceDocsToParent(dependentDocsStack: DocSetCollection[], documentRefSet: DocSetCollection): void {
        // let bodyCode = () =>
        {
            if (dependentDocsStack.length > 0) {
                // the next to pop off is the outer object, this could go many layers up
                const outerSet: DocSetCollection = dependentDocsStack[dependentDocsStack.length - 1];
                // store the docs for this ref in the outer object
                for (const docSet of documentRefSet) {
                    if (docSet.size > 1) {
                        outerSet.add(docSet);
                    }
                }
            }
        }
        // return p.measure(bodyCode);
    }

    public getEmptyResolvedTraitSet(resOpt: resolveOptions): ResolvedTraitSet {
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

    public registerSymbol(symbolDef: string, inDoc: DocumentImpl): void {
        // let bodyCode = () =>
        {
            let docs: DocumentImpl[] = this.symbolDefinitions.get(symbolDef);
            if (!docs) {
                docs = [];
                this.symbolDefinitions.set(symbolDef, docs);
            }
            docs.push(inDoc);
        }
        // return p.measure(bodyCode);
    }
    public unRegisterSymbol(symbolDef: string, inDoc: DocumentImpl): void {
        // let bodyCode = () =>
        {
            const docs: DocumentImpl[] = this.symbolDefinitions.get(symbolDef);
            if (docs) {
                const index: number = docs.indexOf(inDoc);
                docs.splice(index, 1);
            }
        }
        // return p.measure(bodyCode);
    }

    public docsForSymbol(wrtDoc: DocumentImpl, fromDoc: DocumentImpl, symbolDef: string): docsResult {
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
                    ctx.statusRpt(cdmStatusLevel.error, `no support for absolute references yet. fix '${symbolDef}'`, ctx.relativePath);

                    return undefined;
                }
                if (preEnd > 0) {
                    const prefix: string = symbolDef.slice(0, preEnd);
                    result.newSymbol = symbolDef.slice(preEnd + 1);
                    result.docList = this.symbolDefinitions.get(result.newSymbol);
                    if (fromDoc && fromDoc.monikerPriorityMap && fromDoc.monikerPriorityMap.has(prefix)) {
                        result.docBest = fromDoc.monikerPriorityMap.get(prefix);
                    } else if (wrtDoc.monikerPriorityMap && wrtDoc.monikerPriorityMap.has(prefix)) {
                        // if that didn't work, then see if the wrtDoc can find the moniker
                        result.docBest = wrtDoc.monikerPriorityMap.get(prefix);
                    }
                }
            }

            return result;
        }
        // return p.measure(bodyCode);
    }

    public resolveSymbolReference(
        resOpt: resolveOptions,
        fromDoc: DocumentImpl,
        symbolDef: string,
        expectedType: cdmObjectType): cdmObjectDef {
        // let bodyCode = () =>
        {
            // given a symbolic name,
            // find the 'highest prirority' definition of the object from the point of view of a given document (with respect to, wrtDoc)
            // (meaning given a document and the things it defines and the files it imports and the files they import,
            // where is the 'last' definition found)
            if (!resOpt || !resOpt.wrtDoc) {
                return undefined;
            } // no way to figure this out
            const wrtDoc: DocumentImpl = (resOpt.wrtDoc as DocumentImpl);

            // get the array of documents where the symbol is defined
            const symbolDocsResult: docsResult = this.docsForSymbol(wrtDoc, fromDoc, symbolDef);
            let docBest: DocumentImpl = symbolDocsResult.docBest;
            symbolDef = symbolDocsResult.newSymbol;
            const docs: DocSet = new DocSet(symbolDocsResult.docList);
            if (docs) {
                // add possible docs to resOpt, we will need this when caching
                if (docs.size > 1) {
                    if (!resOpt.documentRefSet) {
                        resOpt.documentRefSet = new DocSetCollection();
                    }
                    resOpt.documentRefSet.add(docs);
                }
                // for the given doc, there is a sorted list of imported docs (including the doc itself as item 0).
                // find the lowest number imported document that has a definition for this symbol
                const importPriority: Map<DocumentImpl, number> = wrtDoc.importPriority;
                if (!importPriority || importPriority.size === 0) {
                    return undefined;
                } // need to index imports first, should have happened

                if (!docBest) {
                    docBest = CorpusImpl.getPriorityDoc(docs, importPriority) || docBest;
                }
            }

            // perhaps we have never heard of this symbol in the imports for this document?
            if (!docBest) {
                return undefined;
            }

            // return the definition found in the best document
            let found: cdmObjectDef = docBest.internalDeclarations.get(symbolDef);

            if (found && expectedType !== cdmObjectType.error) {
                found = this.reportErrorStatus(found, symbolDef, expectedType);
            }

            return found;
        }
        // return p.measure(bodyCode);
    }

    public registerDefinitionReferenceDocuments(definition: ICdmObject, kind: string, docRefSet: DocSetCollection): void {
        // let bodyCode = () =>
        {
            const key: string = CorpusImpl.getCacheKeyFromObject(definition, kind);
            this.definitionReferenceDocuments.set(key, docRefSet);
        }
        // return p.measure(bodyCode);
    }

    public unRegisterDefinitionReferenceDocuments(definition: ICdmObject, kind: string): void {
        // let bodyCode = () =>
        {
            const key: string = CorpusImpl.getCacheKeyFromObject(definition, kind);
            this.definitionReferenceDocuments.delete(key);
        }
        // return p.measure(bodyCode);
    }

    public getDefinitionCacheTag(
        resOpt: resolveOptions,
        definition: cdmObject,
        kind: string,
        extraTags: string = '',
        useNameNotId: boolean = false): string {
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
            if (useNameNotId) {
                thisId = definition.getObjectDefName();
            } else {
                thisId = definition.ID.toString();
            }

            let tagSuffix: string = `-${kind}-${thisId}`;
            tagSuffix += `-(${resOpt.directives ? resOpt.directives.getTag() : ''})`;
            if (extraTags) {
                tagSuffix += `-${extraTags}`;
            }

            // is there a registered set?
            // (for the objectdef, not for a reference) of the many documents involved in defining this thing(might be none)
            const objDef: ICdmObjectDef = definition.getObjectDef(resOpt);
            let docsRef: DocSetCollection;
            if (objDef) {
                const key: string = CorpusImpl.getCacheKeyFromObject(objDef, kind);
                docsRef = this.definitionReferenceDocuments.get(key);
            }

            if (docsRef) {
                // each set has doc options. use importPriority to figure out which one we want
                const wrtDoc: DocumentImpl = (resOpt.wrtDoc as DocumentImpl);
                const foundDocIds: Set<number> = new Set<number>();
                if (wrtDoc.importPriority) {
                    for (const docSet of docsRef) {
                        // we only add the best doc if there are multiple options
                        if (docSet.size > 1) {
                            const docBest: DocumentImpl = CorpusImpl.getPriorityDoc(docSet, wrtDoc.importPriority);
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
            } else {
                // reference docs need to be solved before we can generate a cache tag
                return undefined;
            }
        }
        // return p.measure(bodyCode);
    }

    public MakeRef(ofType: cdmObjectType, refObj: string | ICdmObjectDef, simpleNameRef: boolean): ICdmObjectRef {
        // let bodyCode = () =>
        {
            let oRef: ICdmObjectRef;

            if (refObj) {
                if (typeof (refObj) === 'string') {
                    oRef = this.MakeObject<ICdmObjectRef>(ofType, refObj, simpleNameRef);
                } else {
                    if (refObj.objectType === ofType) {
                        // forgive this mistake, return the ref passed in
                        oRef = (refObj as ICdmObject) as ICdmObjectRef;
                    } else {
                        oRef = this.MakeObject<ICdmObjectRef>(ofType);
                        (oRef).setObjectDef(refObj);
                    }
                }
            }

            return oRef;
        }
        // return p.measure(bodyCode);
    }
    public MakeObject<T extends ICdmObject>(ofType: cdmObjectType, nameOrRef?: string, simmpleNameRef?: boolean): T {
        // let bodyCode = () =>
        {
            let newObj: ICdmObject;

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
                    newObj = new DataTypeImpl(this.ctx, nameOrRef, undefined, false);
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
                    newObj = new EntityImpl(this.ctx, nameOrRef, undefined, false, false);
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
                    newObj = new RelationshipImpl(this.ctx, nameOrRef, undefined, false);
                    break;
                case cdmObjectType.relationshipRef:
                    newObj = new RelationshipReferenceImpl(this.ctx, nameOrRef, simmpleNameRef, false);
                    break;
                case cdmObjectType.traitDef:
                    newObj = new TraitImpl(this.ctx, nameOrRef, undefined, false);
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
                default:
            }

            return newObj as T;
        }
        // return p.measure(bodyCode);
    }

    public addDocumentObjects(folder: FolderImpl, docDef: ICdmDocumentDef): ICdmDocumentDef {
        // let bodyCode = () =>
        {
            const doc: DocumentImpl = docDef as DocumentImpl;
            const path: string = doc.path + doc.name;
            if (!this.pathLookup.has(path)) {
                this.allDocuments.push([folder, doc]);
                this.pathLookup.set(path, [folder, doc]);
                this.directory.set(doc, folder);
            }

            return doc;
        }
        // return p.measure(bodyCode);
    }

    public removeDocumentObjects(folder: FolderImpl, docDef: ICdmDocumentDef): void {
        // let bodyCode = () =>
        {
            const doc: DocumentImpl = docDef as DocumentImpl;
            // don't worry about defintionWrtTag because it uses the doc ID
            // that won't get re-used in this session unless there are more than 4 billion objects
            // every symbol defined in this document is pointing at the document, so remove from cache.
            // also remove the list of docs that it depends on
            this.removeObjectDefinitions(doc);

            // remove from path lookup, folder lookup and global list of documents
            const path: string = doc.path + doc.name;
            if (this.pathLookup.has(path)) {
                this.pathLookup.delete(path);
                this.directory.delete(doc);
                const index: number = this.allDocuments.indexOf([folder, doc]);
                this.allDocuments.splice(index, 1);
            }
        }
        // return p.measure(bodyCode);
    }

    public addDocumentFromContent(corpusPath: string, content: string): ICdmDocumentDef {
        // let bodyCode = () =>
        {
            const last: number = corpusPath.lastIndexOf('/');
            if (last < 0) {
                throw new Error('bad path');
            }
            const name: string = corpusPath.slice(last + 1);
            const path: string = corpusPath.slice(0, last + 1);
            let folder: ICdmFolderDef = this.getSubFolderFromPath(path, true);
            if (folder === undefined && path === '/') {
                folder = this;
            }

            return folder.addDocument(name, content);
        }
        // return p.measure(bodyCode);
    }

    public resolveDocumentImports(doc: DocumentImpl, missingSet: Set<string>): void {
        // let bodyCode = () =>
        {
            if (doc.imports) {
                doc.imports.forEach((imp: ImportImpl): void => {
                    if (!imp.doc) {
                        // no document set for this import, see if it is already loaded into the corpus
                        let path: string = imp.corpusPath;
                        if (path.charAt(0) !== '/') {
                            path = doc.folder.getRelativePath() + imp.corpusPath;
                        }
                        const lookup: [FolderImpl, DocumentImpl] = this.pathLookup.get(path);
                        if (lookup) {
                            imp.doc = lookup['1'];
                        } else {
                            if (missingSet) {
                                missingSet.add(path);
                            }
                        }
                    }
                });
            }
        }
        // return p.measure(bodyCode);
    }

    public listMissingImports(): Set<string> {
        // let bodyCode = () =>
        {
            const missingSet: Set<string> = new Set<string>();

            for (const fs of this.allDocuments) {
                this.resolveDocumentImports(fs['1'], missingSet);
            }

            if (missingSet.size === 0) {
                return undefined;
            }

            return missingSet;
        }
        // return p.measure(bodyCode);
    }

    public getObjectFromCorpusPath(objectPath: string): ICdmObject {
        // let bodyCode = () =>
        {

            if (objectPath && objectPath.indexOf('/') === 0) {
                const lastFolder: ICdmFolderDef = this.getSubFolderFromPath(objectPath, false);
                // don't create new folders, just go as far as possible
                if (lastFolder) {
                    // maybe the search is for a folder?
                    const lastPath: string = lastFolder.getRelativePath();
                    if (lastPath === objectPath) {
                        return lastFolder;
                    }

                    // remove path to folder and then look in the folder
                    objectPath = objectPath.slice(lastPath.length);

                    return lastFolder.getObjectFromFolderPath(objectPath);
                }

            }

            return undefined;

        }
        // return p.measure(bodyCode);
    }

    public setResolutionCallback(
        status: RptCallback,
        reportAtLevel: cdmStatusLevel = cdmStatusLevel.info,
        errorAtLevel: cdmStatusLevel = cdmStatusLevel.warning): void {
        const ctx: resolveContext = this.ctx as resolveContext;
        ctx.reportAtLevel = reportAtLevel;
        ctx.errorAtLevel = errorAtLevel;
        ctx.errors = 0;
        ctx.statusRpt =
            (level: cdmStatusLevel, msg: string, path: string): void => {
                if (level >= ctx.errorAtLevel) {
                    ctx.errors++;
                }
                if (level >= ctx.reportAtLevel) {
                    status(level, msg, path);
                }
            };
    }

    public async resolveImports(importResolver: (corpusPath: string) => Promise<[string, string]>): Promise<boolean> {
        // let bodyCode = () =>
        {
            return new Promise<boolean>((resolve: ((value?: boolean | PromiseLike<boolean>) => void)): void => {

                let missingSet: Set<string> = this.listMissingImports();
                let result: boolean = true;
                const ctx: resolveContext = this.ctx as resolveContext;

                const turnMissingImportsIntoClientPromises: () => void = (): void => {
                    if (missingSet) {
                        // turn each missing into a promise for a missing from the caller
                        missingSet.forEach((missing: string): void => {
                            importResolver(missing)
                                .then(
                                    (success: [string, string]) => {
                                        if (result) {
                                            // a new document for the corpus
                                            this.addDocumentFromContent(success[0], success[1]);

                                            // remove this from set
                                            missingSet.delete(success[0]);
                                            ctx.statusRpt(cdmStatusLevel.progress, `resolved import '${success[0]}'`, '');
                                            // if this is the last import, check to see if more are needed now and recurse
                                            if (missingSet.size === 0) {
                                                missingSet = this.listMissingImports();
                                                turnMissingImportsIntoClientPromises();
                                            }
                                        }
                                    },
                                    (fail: [string, string]) => {
                                        result = false;
                                        // something went wrong with one of the imports, give up on all of it
                                        ctx.statusRpt(
                                            cdmStatusLevel.error, `failed to import '${fail[0]}' for reason : ${fail[1]}`,
                                            this.getRelativePath());

                                        resolve(result);
                                    });
                        });
                    } else {
                        // nothing was missing, so just move to next resolve step
                        resolve(result);
                    }
                };

                turnMissingImportsIntoClientPromises();

            });
        }
        // return p.measure(bodyCode);
    }

    public localizeReferences(resOpt: resolveOptions, content: cdmObject): void {
        // let bodyCode = () =>
        {
            // call visit with no callbacks, this will make everthing has a declared path
            content.visit('', undefined, undefined);

            // get the paths to other documents fro this pov
            const docPath: Map<DocumentImpl, string> = (resOpt.wrtDoc as DocumentImpl).getPathsToOtherDocuments();
            content.visit(
                '',
                (
                    iObject: ICdmObject, path: string) => {
                    const ot: cdmObjectType = iObject.objectType;
                    switch (ot) {
                        case cdmObjectType.attributeRef:
                        case cdmObjectType.attributeGroupRef:
                        case cdmObjectType.attributeContextRef:
                        case cdmObjectType.dataTypeRef:
                        case cdmObjectType.entityRef:
                        case cdmObjectType.relationshipRef:
                        case cdmObjectType.traitRef:
                            const ref: cdmObjectRef = iObject as cdmObjectRef;
                            if (ref.namedReference && ref.explicitReference) {
                                const defDoc: DocumentImpl = ref.explicitReference.declaredInDocument as DocumentImpl;
                                let newIdentifier: string = docPath.get(defDoc);
                                if (newIdentifier !== undefined) {
                                    newIdentifier += ref.explicitReference.declaredPath;
                                    ref.namedReference = newIdentifier;
                                }
                            }
                        default:
                    }

                    return false;
                },
                undefined);
        }
        // return p.measure(bodyCode);
    }

    public checkObjectIntegrity(): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            ctx.currentDoc.visit(
                '',
                (iObject: ICdmObject, path: string) => {
                    if (iObject.validate() === false) {
                        ctx.statusRpt(
                            cdmStatusLevel.error,
                            `integrity check failed for : '${path}'`,
                            ctx.currentDoc.path + path);
                    } else {
                        (iObject as cdmObject).ctx = ctx;
                    }
                    ctx.statusRpt(cdmStatusLevel.info, `checked '${path}'`, ctx.currentDoc.path + path);

                    return false;
                },
                undefined);
        }
        // return p.measure(bodyCode);
    }

    public declareObjectDefinitions(relativePath: string): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            ctx.corpusPathRoot = ctx.currentDoc.path + ctx.currentDoc.name;
            ctx.currentDoc.visit(
                relativePath,
                (iObject: ICdmObject, path: string) => {
                    (iObject as cdmObject).docCreatedIn = ctx.currentDoc;
                    if (path.indexOf('(unspecified)') > 0) {
                        return true;
                    }
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
                            const corpusPath: string = `${ctx.corpusPathRoot}/${path}`;
                            if (ctx.currentDoc.internalDeclarations.has(path)) {
                                ctx.statusRpt(cdmStatusLevel.error, `duplicate declaration for item '${path}'`, corpusPath);

                                return false;
                            }
                            ctx.currentDoc.internalDeclarations.set(path, iObject as cdmObjectDef);
                            (iObject as cdmObjectDef).corpusPath = corpusPath;
                            this.registerSymbol(path, ctx.currentDoc);
                            ctx.statusRpt(cdmStatusLevel.info, `declared '${path}'`, corpusPath);
                        default:
                    }

                    return false;
                },
                undefined);
        }
        // return p.measure(bodyCode);
    }

    public removeObjectDefinitions(doc: DocumentImpl): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            doc.internalDeclarations = undefined;
            doc.visit(
                '',
                (iObject: ICdmObject, path: string) => {
                    (iObject as cdmObject).docCreatedIn = ctx.currentDoc;
                    if (path.indexOf('(unspecified)') > 0) {
                        return true;
                    }
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
                            this.unRegisterSymbol(path, doc);
                            this.unRegisterDefinitionReferenceDocuments(iObject, 'rasb');
                        default:
                    }

                    return false;
                },
                undefined);
        }
        // return p.measure(bodyCode);
    }

    public constTypeCheck(resOpt: resolveOptions, paramDef: ICdmParameterDef, aValue: ArgumentValue): ArgumentValue {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            let replacement: ArgumentValue = aValue;
            // if parameter type is entity, then the value should be an entity or ref to one
            // same is true of 'dataType' dataType
            if (paramDef.getDataTypeRef()) {
                const dt: ICdmDataTypeDef = paramDef.getDataTypeRef()
                    .getObjectDef(resOpt) as ICdmDataTypeDef;
                // compare with passed in value or default for parameter
                let pValue: ArgumentValue = aValue;
                if (!pValue) {
                    pValue = paramDef.getDefaultValue();
                    replacement = pValue;
                }
                if (pValue) {
                    if (dt.isDerivedFrom(resOpt, 'cdmObject')) {
                        const expectedTypes: cdmObjectType[] = [];
                        let expected: string;
                        if (dt.isDerivedFrom(resOpt, 'entity')) {
                            expectedTypes.push(cdmObjectType.constantEntityDef);
                            expectedTypes.push(cdmObjectType.entityRef);
                            expectedTypes.push(cdmObjectType.entityDef);
                            expected = 'entity';
                        } else if (dt.isDerivedFrom(resOpt, 'attribute')) {
                            expectedTypes.push(cdmObjectType.attributeRef);
                            expectedTypes.push(cdmObjectType.typeAttributeDef);
                            expectedTypes.push(cdmObjectType.entityAttributeDef);
                            expected = 'attribute';
                        } else if (dt.isDerivedFrom(resOpt, 'dataType')) {
                            expectedTypes.push(cdmObjectType.dataTypeRef);
                            expectedTypes.push(cdmObjectType.dataTypeDef);
                            expected = 'dataType';
                        } else if (dt.isDerivedFrom(resOpt, 'relationship')) {
                            expectedTypes.push(cdmObjectType.relationshipRef);
                            expectedTypes.push(cdmObjectType.relationshipDef);
                            expected = 'relationship';
                        } else if (dt.isDerivedFrom(resOpt, 'trait')) {
                            expectedTypes.push(cdmObjectType.traitRef);
                            expectedTypes.push(cdmObjectType.traitDef);
                            expected = 'trait';
                        } else if (dt.isDerivedFrom(resOpt, 'attributeGroup')) {
                            expectedTypes.push(cdmObjectType.attributeGroupRef);
                            expectedTypes.push(cdmObjectType.attributeGroupDef);
                            expected = 'attributeGroup';
                        }

                        if (expectedTypes.length === 0) {
                            ctx.statusRpt(
                                cdmStatusLevel.error,
                                `parameter '${paramDef.getName()}' has an unexpected dataType.`,
                                ctx.currentDoc.path + ctx.relativePath);
                        }

                        // if a string constant, resolve to an object ref.
                        let foundType: cdmObjectType = cdmObjectType.error;
                        if (typeof (pValue) === 'object') {
                            foundType = (pValue).objectType;
                        }
                        let foundDesc: string = ctx.relativePath;
                        if (typeof (pValue) === 'string') {
                            if (pValue === 'this.attribute' && expected === 'attribute') {
                                // will get sorted out later when resolving traits
                                foundType = cdmObjectType.attributeRef;
                            } else {
                                foundDesc = pValue;
                                const resAttToken: string = '/(resolvedAttributes)/';
                                const seekResAtt: number = pValue.indexOf(resAttToken);
                                if (seekResAtt >= 0) {
                                    // get an object there that will get resolved later after resolved attributes
                                    replacement = new AttributeReferenceImpl(ctx, pValue, true);
                                    (replacement as AttributeReferenceImpl).ctx = ctx;
                                    (replacement as AttributeReferenceImpl).docCreatedIn = ctx.currentDoc;
                                    foundType = cdmObjectType.attributeRef;
                                } else {
                                    const lu: cdmObjectDef =
                                        ctx.corpus.resolveSymbolReference(resOpt, ctx.currentDoc, pValue, cdmObjectType.error);
                                    if (lu) {
                                        if (expected === 'attribute') {
                                            replacement = new AttributeReferenceImpl(ctx, pValue, true);
                                            (replacement as AttributeReferenceImpl).ctx = ctx;
                                            (replacement as AttributeReferenceImpl).docCreatedIn = ctx.currentDoc;
                                            foundType = cdmObjectType.attributeRef;
                                        } else {
                                            replacement = lu;
                                            foundType = (replacement).objectType;
                                        }
                                    }
                                }
                            }
                        }
                        if (expectedTypes.indexOf(foundType) === -1) {
                            ctx.statusRpt(
                                cdmStatusLevel.error,
                                `parameter '${paramDef.getName()}' has the dataType of '${
                                expected}' but the value '${foundDesc}' does't resolve to a known ${expected} referenece`,
                                ctx.currentDoc.path + ctx.relativePath);
                        } else {
                            ctx.statusRpt(cdmStatusLevel.info, `    resolved '${foundDesc}'`, ctx.relativePath);
                        }
                    }
                }
            }

            return replacement;
        }
        // return p.measure(bodyCode);
    }

    public resolveObjectDefinitions(resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            // for every object defined, accumulate the set of documents that could be needed
            // to resolve the object AND any references it makes
            // this is a stack, since things get defined inside of things
            const dependentDocsStack: (DocSetCollection)[] = [];
            // each set within this set represents a set of dependencies for a given thing. Multiple sets means the outer object depends
            // on multiple things that have their own dependencies
            let documentRefSet: DocSetCollection;

            ctx.currentDoc.visit(
                '',
                (iObject: ICdmObject, path: string) => {
                    const ot: cdmObjectType = iObject.objectType;
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
                            if (path.indexOf('(unspecified)') === -1) {
                                // a new thing being defined. push onto stack
                                documentRefSet = new DocSetCollection();
                                // put in the docs where this thing is defined. if only one document, then don't add.
                                const defIn: docsResult = this.docsForSymbol(ctx.currentDoc, ctx.currentDoc, path);
                                const docSet: DocSet = new DocSet(defIn.docList);
                                if (docSet.size > 1) {
                                    documentRefSet.add(docSet);
                                }
                                dependentDocsStack.push(documentRefSet);
                            }
                            break;

                        case cdmObjectType.attributeRef:
                            // don't try to look these up now.
                            if ((iObject as AttributeReferenceImpl).namedReference
                                && (iObject as AttributeReferenceImpl).namedReference.indexOf('(resolvedAttributes)') !== -1) {
                                break;
                            }
                        case cdmObjectType.attributeGroupRef:
                        case cdmObjectType.attributeContextRef:
                        case cdmObjectType.dataTypeRef:
                        case cdmObjectType.entityRef:
                        case cdmObjectType.relationshipRef:
                        case cdmObjectType.traitRef:
                            ctx.relativePath = path;
                            const ref: cdmObjectRef = iObject as cdmObjectRef;
                            const resNew: cdmObjectDef = ref.getObjectDef(resOpt);

                            if (!resNew) {
                                // it is 'ok' to not find entity refs sometimes
                                const level: cdmStatusLevel = (ot === cdmObjectType.entityRef) ?
                                    cdmStatusLevel.warning :
                                    cdmStatusLevel.error;
                                ctx.statusRpt(
                                    level,
                                    `unable to resolve the reference '${ref.namedReference}' to a known object`,
                                    ctx.currentDoc.path + path);
                            } else {
                                // normal case of a string name reference, just look up the docs for the symbol
                                if (ref.namedReference) {
                                    // and store the docs
                                    const defIn: docsResult = this.docsForSymbol(ctx.currentDoc, ctx.currentDoc, ref.namedReference);
                                    // a new reference. push onto stack. even if we can't look this up, ok because it pops off later
                                    documentRefSet = new DocSetCollection();
                                    dependentDocsStack.push(documentRefSet);
                                    documentRefSet.add(new DocSet(defIn.docList));
                                } else {
                                    // object being defined inline inside a ref.
                                    // nothing to do now except wait for the def to make a new stack entry
                                    // and later we will take the docs from it
                                }
                                ctx.statusRpt(cdmStatusLevel.info, `    resolved '${ref.namedReference}'`, ctx.currentDoc.path + path);
                            }
                        default:
                    }

                    return false;
                },
                (iObject: ICdmObject, path: string) => {
                    const ot: cdmObjectType = iObject.objectType;
                    switch (ot) {
                        case cdmObjectType.parameterDef:
                            // when a parameter has a datatype that is a cdm object, validate that any default value is the
                            // right kind object
                            const param: ICdmParameterDef = iObject as ICdmParameterDef;
                            this.constTypeCheck(resOpt, param, undefined);
                            break;
                        case cdmObjectType.attributeRef:
                            // don't try to look these up now
                            if ((iObject as AttributeReferenceImpl).namedReference
                                && (iObject as AttributeReferenceImpl).namedReference.indexOf('(resolvedAttributes)') !== -1) {
                                break;
                            }
                        case cdmObjectType.entityDef:
                        case cdmObjectType.traitDef:
                        case cdmObjectType.relationshipDef:
                        case cdmObjectType.dataTypeDef:
                        case cdmObjectType.typeAttributeDef:
                        case cdmObjectType.entityAttributeDef:
                        case cdmObjectType.attributeGroupDef:
                        case cdmObjectType.constantEntityDef:
                        case cdmObjectType.attributeContextDef:
                            if (path.indexOf('(unspecified)') === -1) {
                                // a new thing done being defined. pop off of stack
                                documentRefSet = dependentDocsStack.pop();
                                CorpusImpl.passReferenceDocsToParent(dependentDocsStack, documentRefSet);
                                // give the set to the corpus to track
                                this.registerDefinitionReferenceDocuments(iObject as cdmObject, 'rasb', documentRefSet);
                            }
                            break;
                        case cdmObjectType.attributeGroupRef:
                        case cdmObjectType.attributeContextRef:
                        case cdmObjectType.dataTypeRef:
                        case cdmObjectType.entityRef:
                        case cdmObjectType.relationshipRef:
                        case cdmObjectType.traitRef:
                            if ((iObject as cdmObjectRef).getObjectDef(resOpt) && (iObject as cdmObjectRef).namedReference) {
                                // a new thing done being defined. pop off of stack
                                documentRefSet = dependentDocsStack.pop();
                                CorpusImpl.passReferenceDocsToParent(dependentDocsStack, documentRefSet);
                                // give the set to the corpus to track
                                this.registerDefinitionReferenceDocuments(iObject as cdmObject, 'rasb', documentRefSet);
                            }
                            break;
                        default:
                    }

                    return false;
                });
        }
        // return p.measure(bodyCode);
    }

    public resolveTraitArguments(resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            ctx.currentDoc.visit(
                '',
                (iObject: ICdmObject, path: string) => {
                    const ot: cdmObjectType = iObject.objectType;
                    switch (ot) {
                        case cdmObjectType.traitRef:
                            ctx.pushScope(iObject.getObjectDef(resOpt) as ICdmTraitDef);
                            break;
                        case cdmObjectType.argumentDef:
                            try {
                                if (ctx.currentScope.currentTrait) {
                                    ctx.relativePath = path;
                                    const params: ParameterCollection = ctx.currentScope.currentTrait.getAllParameters(resOpt);
                                    let paramFound: ICdmParameterDef;
                                    let aValue: ArgumentValue;
                                    if (ot === cdmObjectType.argumentDef) {
                                        paramFound = params.resolveParameter(
                                            ctx.currentScope.currentParameter, (iObject as ICdmArgumentDef).getName());
                                        (iObject as ArgumentImpl).resolvedParameter = paramFound;
                                        aValue = (iObject as ArgumentImpl).value;

                                        // if parameter type is entity, then the value should be an entity or ref to one
                                        // same is true of 'dataType' dataType
                                        aValue = this.constTypeCheck(resOpt, paramFound, aValue);
                                        (iObject as ArgumentImpl).setValue(aValue);
                                    }
                                }

                            } catch (e) {
                                ctx.statusRpt(cdmStatusLevel.error, (e as Error).toString(), path);
                                ctx.statusRpt(
                                    cdmStatusLevel.error,
                                    `failed to resolve parameter on trait '${ctx.currentScope.currentTrait.getName()}'`,
                                    ctx.currentDoc.path + path);
                            }
                            ctx.currentScope.currentParameter++;
                        default:
                    }

                    return false;
                },
                (iObject: ICdmObject, path: string) => {
                    const ot: cdmObjectType = iObject.objectType;
                    if (ot === cdmObjectType.traitRef) {
                        (iObject as TraitReferenceImpl).resolvedArguments = true;
                        ctx.popScope();
                    }

                    return false;
                });

            return;
        }
        // return p.measure(bodyCode);
    }

    public finishDocumentResolve(): void {
        // let bodyCode = () =>
        // return p.measure(bodyCode);
    }

    public finishResolve(): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            ctx.statusRpt(cdmStatusLevel.progress, 'finishing...', undefined);
            for (const fd of this.allDocuments) {
                ctx.currentDoc = fd['1'];
                this.finishDocumentResolve();
                ctx.currentDoc = undefined;
            }

            p.report();
        }
        // return p.measure(bodyCode);
    }

    // Generates warnings into the status report.
    public generateWarnings(): void {
        const directives: TraitDirectiveSet = new TraitDirectiveSet(new Set<string>(['referenceOnly', 'normalized']));
        const resOpt: resolveOptions = { wrtDoc: undefined, directives: directives, relationshipDepth: 0 };
        for (const fd of this.allDocuments) {
            this.generateWarningsForSingleDoc(fd['1'], resOpt);
        }
    }

    public async resolveReferencesAndValidate(
        stage: cdmValidationStep, stageThrough: cdmValidationStep, resOpt: resolveOptions): Promise<cdmValidationStep> {
        // let bodyCode = () =>
        {
            return new Promise<cdmValidationStep>((resolve: (value?: cdmValidationStep | PromiseLike<cdmValidationStep>) => void): void => {
                // use the provided directives or make a relational default
                let directives: TraitDirectiveSet;
                if (resOpt) {
                    directives = resOpt.directives;
                } else {
                    directives = new TraitDirectiveSet(new Set<string>(['referenceOnly', 'normalized']));
                }
                resOpt = { wrtDoc: undefined, directives: directives, relationshipDepth: 0 };

                const finishresolve: boolean = stageThrough === stage;
                switch (stage) {
                    case cdmValidationStep.imports:
                    case cdmValidationStep.start:
                        this.resolveReferencesStep(
                            'importing documents...',
                            (currentDoc: DocumentImpl) => { this.resolveReferenceImports(currentDoc); },
                            resolve, resOpt, true, finishresolve, cdmValidationStep.integrity);

                        return;
                    case cdmValidationStep.integrity:
                        this.resolveReferencesStep(
                            'basic object integrity...',
                            () => { this.checkObjectIntegrity(); }, resolve, resOpt, true, finishresolve, cdmValidationStep.declarations);

                        return;
                    case cdmValidationStep.declarations:
                        this.resolveReferencesStep(
                            'making declarations...',
                            () => { this.resolveReferenceDeclarations(); },
                            resolve, resOpt, true, finishresolve, cdmValidationStep.references);

                        return;
                    case cdmValidationStep.references:
                        this.resolveReferencesStep(
                            'resolving references...',
                            (currentDoc: DocumentImpl, resOptions: resolveOptions) => {
                                this.resolveObjectDefinitions(resOptions);
                            },
                            resolve, resOpt, true, finishresolve, cdmValidationStep.parameters);

                        return;
                    case cdmValidationStep.parameters:
                        this.resolveReferencesStep(
                            'binding parameters...',
                            (currentDoc: DocumentImpl, resOptions: resolveOptions) => {
                                this.resolveReferenceParameters(currentDoc, resOptions);
                            },
                            resolve, resOpt, true, finishresolve, cdmValidationStep.traitAppliers);

                        return;
                    case cdmValidationStep.traitAppliers:
                        this.resolveReferencesStep(
                            'defining traits...',
                            (currentDoc: DocumentImpl, resOptions: resolveOptions, entityNesting: number) => {
                                this.resolveTraitAppliers(currentDoc, resOptions, entityNesting);
                            },
                            resolve, resOpt, true, finishresolve || stageThrough === cdmValidationStep.minimumForResolving,
                            cdmValidationStep.traits);

                        return;
                    case cdmValidationStep.traits:
                        this.resolveReferencesStep(
                            'resolving traits...',
                            (currentDoc: DocumentImpl, resOptions: resolveOptions, entityNesting: number) => {
                                this.resolveTraits(currentDoc, resOptions, entityNesting);
                            },
                            resolve, resOpt, false, finishresolve, cdmValidationStep.traits);
                        this.resolveReferencesStep(
                            'checking required arguments...',
                            (currentDoc: DocumentImpl, resOptions: resolveOptions, entityNesting: number) => {
                                this.resolveReferencesTraitsArguments(currentDoc, resOptions, entityNesting);
                            },
                            resolve, resOpt, true, finishresolve, cdmValidationStep.attributes);

                        return;
                    case cdmValidationStep.attributes:
                        this.resolveReferencesStep(
                            'resolving attributes...',
                            (currentDoc: DocumentImpl, resOptions: resolveOptions, entityNesting: number) => {
                                this.resolveAttributes(currentDoc, resOptions, entityNesting);
                            },
                            resolve, resOpt, true, finishresolve, cdmValidationStep.entityReferences);

                        return;
                    case cdmValidationStep.entityReferences:
                        this.resolveReferencesStep(
                            'resolving foreign key references...',
                            (currentDoc: DocumentImpl, resOptions: resolveOptions, entityNesting: number) => {
                                this.resolveForeignKeyReferences(currentDoc, resOptions, entityNesting);
                            },
                            resolve, resOpt, true, true, cdmValidationStep.finished);

                        return;
                    default:
                }

                // bad step sent in
                resolve(cdmValidationStep.error);
            });
        }
    }

    private resolveReferenceImports(currentDoc: DocumentImpl): void {
        currentDoc.prioritizeImports(undefined, 0, undefined);
    }

    private resolveReferenceDeclarations(): void {
        this.declareObjectDefinitions('');
    }

    private resolveReferenceParameters(currentdoc: DocumentImpl, resOpt: resolveOptions): void {
        this.resolveTraitArguments(resOpt);
    }

    private resolveTraits(currentDoc: DocumentImpl, resOpt: resolveOptions, entityNesting: number): void {
        const ctx: resolveContext = this.ctx as resolveContext;
        currentDoc.visit(
            '',
            (iObject: ICdmObject, path: string) => {
                switch (iObject.objectType) {
                    case cdmObjectType.entityDef:
                    case cdmObjectType.attributeGroupDef:
                        entityNesting++;
                        // don't do this for entities and groups defined within entities since getting traits already does that
                        if (entityNesting > 1) {
                            break;
                        }
                    case cdmObjectType.traitDef:
                    case cdmObjectType.relationshipDef:
                    case cdmObjectType.dataTypeDef:
                        (this.ctx as resolveContext).relativePath = path;
                        (iObject as ICdmObjectDef).getResolvedTraits(resOpt);
                        break;
                    case cdmObjectType.entityAttributeDef:
                    case cdmObjectType.typeAttributeDef:
                        ctx.relativePath = path;
                        (iObject as ICdmAttributeDef).getResolvedTraits(resOpt);
                    default:
                }

                return false;
            },
            (iObject: ICdmObject, path: string) => {
                if (iObject.objectType === cdmObjectType.entityDef || iObject.objectType === cdmObjectType.attributeGroupDef) {
                    entityNesting--;
                }

                return false;
            });
    }

    private resolveReferencesTraitsArguments(currentDoc: DocumentImpl, resOpt: resolveOptions, entityNesting: number): void {
        const ctx: resolveContext = this.ctx as resolveContext;
        const checkRequiredParamsOnResolvedTraits: (obj: ICdmObject) => void =
            (obj: ICdmObject): void => {
                const rts: ResolvedTraitSet = obj.getResolvedTraits(resOpt);
                if (rts) {
                    const l: number = rts.size;
                    for (let i: number = 0; i < l; i++) {
                        const rt: ResolvedTrait = rts.set[i];
                        let found: number = 0;
                        let resolved: number = 0;
                        if (rt.parameterValues) {
                            const parameterValuesCount: number = rt.parameterValues.length;
                            for (let iParam: number = 0; iParam < parameterValuesCount; iParam++) {
                                if (rt.parameterValues.getParameter(iParam)
                                    .getRequired()) {
                                    found++;
                                    if (!rt.parameterValues.getValue(iParam)) {
                                        const paramName: string = rt.parameterValues.getParameter(iParam)
                                            .getName();
                                        const objectName: string = obj.getObjectDef(resOpt)
                                            .getName();
                                        ctx.statusRpt(
                                            cdmStatusLevel.error,
                                            `no argument supplied for required parameter '${
                                            paramName}' of trait '${rt.traitName}' on '${objectName}'`,
                                            ctx.currentDoc.path + ctx.relativePath);
                                    } else {
                                        resolved++;
                                    }
                                }
                            }
                        }
                        if (found > 0 && found === resolved) {
                            ctx.statusRpt(
                                cdmStatusLevel.info,
                                `found and resolved '${found}' required parameters of trait '${rt.traitName}' on '${obj.getObjectDef(resOpt)
                                    .getName()}'`,
                                ctx.currentDoc.path + ctx.relativePath);
                        }
                    }
                }
            };

        currentDoc.visit('', undefined, (iObject: ICdmObject, path: string) => {
            const ot: cdmObjectType = iObject.objectType;
            if (ot === cdmObjectType.entityDef) {
                ctx.relativePath = path;
                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                checkRequiredParamsOnResolvedTraits(iObject);
                // do the same for all attributes
                if ((iObject as ICdmEntityDef).getHasAttributeDefs()) {
                    (iObject as ICdmEntityDef).getHasAttributeDefs()
                        .forEach((attDef: ICdmObject) => {
                            checkRequiredParamsOnResolvedTraits(attDef);
                        });
                }
            }
            if (ot === cdmObjectType.attributeGroupDef) {
                ctx.relativePath = path;
                // get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                checkRequiredParamsOnResolvedTraits(iObject);
                // do the same for all attributes
                if ((iObject as ICdmAttributeGroupDef).getMembersAttributeDefs()) {
                    (iObject as ICdmAttributeGroupDef).getMembersAttributeDefs()
                        .forEach((attDef: ICdmObject) => {
                            checkRequiredParamsOnResolvedTraits(attDef);
                        });
                }
            }

            return false;
        });
    }

    private resolveAttributes(currentDoc: DocumentImpl, resOpt: resolveOptions, entityNesting: number): void {
        const ctx: resolveContext = this.ctx as resolveContext;
        currentDoc.visit(
            '',
            (iObject: ICdmObject, path: string) => {
                const ot: cdmObjectType = iObject.objectType;
                if (ot === cdmObjectType.entityDef) {
                    entityNesting++; // get resolved att is already recursive, so don't compound
                    if (entityNesting === 1) {
                        ctx.relativePath = path;
                        (iObject as ICdmEntityDef).getResolvedAttributes(resOpt);
                    }
                }
                if (ot === cdmObjectType.attributeGroupDef) {
                    entityNesting++;
                    if (entityNesting === 1) { // entity will do this for the group defined inside it
                        ctx.relativePath = path;
                        (iObject as ICdmAttributeGroupDef).getResolvedAttributes(resOpt);
                    }
                }

                return false;
            },
            (iObject: ICdmObject, path: string) => {
                if (iObject.objectType === cdmObjectType.entityDef || iObject.objectType === cdmObjectType.attributeGroupDef) {
                    entityNesting--;
                }

                return false;
            });
    }

    private resolveTraitAppliers(currentDoc: DocumentImpl, resOpt: resolveOptions, entityNesting: number): void {
        const assignAppliers: (traitMatch: ICdmTraitDef, traitAssign: ICdmTraitDef) => void =
            (traitMatch: ICdmTraitDef, traitAssign: ICdmTraitDef): void => {
                if (!traitMatch) {
                    return;
                }
                if (traitMatch.getExtendsTrait()) {
                    assignAppliers(
                        traitMatch.getExtendsTrait()
                            .getObjectDef(resOpt) as ICdmTraitDef,
                        traitAssign);
                }
                const traitName: string = traitMatch.getName();
                // small number of matcher
                PrimitiveAppliers.forEach((applier: TraitApplier): void => {
                    if (applier.matchName === traitName) {
                        traitAssign.addTraitApplier(applier);
                    }
                });
            };
        currentDoc.visit(
            '',
            (iObject: ICdmObject, path: string) => {
                if (iObject.objectType === cdmObjectType.traitDef) {
                    assignAppliers(iObject as ICdmTraitDef, iObject as ICdmTraitDef);
                }

                return false;
            },
            undefined);
    }

    private resolveForeignKeyReferences(currentDoc: DocumentImpl, resOpt: resolveOptions, entityNesting: number): void {
        currentDoc.visit(
            '',
            (iObject: ICdmObject, path: string) => {
                const ot: cdmObjectType = iObject.objectType;
                if (ot === cdmObjectType.attributeGroupDef) {
                    entityNesting++;
                }
                if (ot === cdmObjectType.entityDef) {
                    entityNesting++;
                    if (entityNesting === 1) { // get resolved is recursive, so no need
                        (this.ctx as resolveContext).relativePath = path;
                        (iObject as ICdmEntityDef).getResolvedEntityReferences(resOpt);
                    }
                }

                return false;
            },
            (iObject: ICdmObject, path: string) => {
                if (iObject.objectType === cdmObjectType.entityDef || iObject.objectType === cdmObjectType.attributeGroupDef) {
                    entityNesting--;
                }

                return false;
            });
    }

    private resolveReferencesStep(
        statusMessage: string,
        resolveAction: (currentDoc: DocumentImpl, resOpt: resolveOptions, entityNesting: number) => void,
        resolve: (value?: cdmValidationStep | PromiseLike<cdmValidationStep>) => void,
        resolveOpt: resolveOptions,
        stageFinished: boolean,
        finishResolve: boolean,
        nextStage: cdmValidationStep): void {
        const ctx: resolveContext = this.ctx as resolveContext;
        ctx.statusRpt(cdmStatusLevel.progress, statusMessage, undefined);
        const entityNesting: number = 0;
        for (const fd of this.allDocuments) {
            // cache import documents
            ctx.currentDoc = fd['1'];
            resolveOpt.wrtDoc = ctx.currentDoc;
            resolveAction(ctx.currentDoc, resolveOpt, entityNesting);
            ctx.currentDoc = undefined;
        }
        if (stageFinished) {
            if (finishResolve) {
                this.finishResolve();
                resolve(cdmValidationStep.finished);
            } else {
                resolve(nextStage);
            }
        }
    }

    // Generates the warnings for a single document.
    private generateWarningsForSingleDoc(doc: DocumentImpl, resOpt: resolveOptions): void {
        if (doc.getDefinitions() === undefined) {
            return;
        }

        const ctx: resolveContext = this.ctx as resolveContext;

        resOpt.wrtDoc = doc;

        doc.getDefinitions()
            .forEach((element: ICdmObjectDef): void => {
                if (element instanceof EntityImpl && (element).hasAttributes !== undefined) {
                    const resolvedEntity: EntityImpl = element.createResolvedEntity(resOpt, `${element.entityName}_`) as EntityImpl;

                    // tslint:disable-next-line:no-suspicious-comment
                    // TODO: Add additional checks here.
                    this.checkPrimaryKeyAttributes(resolvedEntity, resOpt, ctx);
                }
            });

        resOpt.wrtDoc = undefined;
    }

    // Checks whether a resolved entity has an "is.identifiedBy" trait.
    private checkPrimaryKeyAttributes(resolvedEntity: EntityImpl, resOpt: resolveOptions, ctx: resolveContext): void {
        if (resolvedEntity.getResolvedTraits(resOpt)
            .find(resOpt, 'is.identifiedBy') === undefined) {
            ctx.statusRpt(cdmStatusLevel.warning, `There is a primary key missing for the entity ${resolvedEntity.getName()}.`, undefined);
        }
    }

    private reportErrorStatus(found: cdmObjectDef, symbolDef: string, expectedType: cdmObjectType): cdmObjectDef {
        const ctx: resolveContext = this.ctx as resolveContext;
        switch (expectedType) {
            case cdmObjectType.traitRef:
                if (!(found.objectType === cdmObjectType.traitDef)) {
                    ctx.statusRpt(cdmStatusLevel.error, 'expected type trait', symbolDef);

                    return undefined;
                }
                break;
            case cdmObjectType.dataTypeRef:
                if (!(found.objectType === cdmObjectType.dataTypeDef)) {
                    ctx.statusRpt(cdmStatusLevel.error, 'expected type dataType', symbolDef);

                    return undefined;
                }
                break;
            case cdmObjectType.entityRef:
                if (!(found.objectType === cdmObjectType.entityDef)) {
                    ctx.statusRpt(cdmStatusLevel.error, 'expected type entity', symbolDef);

                    return undefined;
                }
                break;
            case cdmObjectType.parameterDef:
                if (!(found.objectType === cdmObjectType.parameterDef)) {
                    ctx.statusRpt(cdmStatusLevel.error, 'expected type parameter', symbolDef);

                    return undefined;
                }
                break;
            case cdmObjectType.relationshipRef:
                if (!(found.objectType === cdmObjectType.relationshipDef)) {
                    ctx.statusRpt(cdmStatusLevel.error, 'expected type relationship', symbolDef);

                    return undefined;
                }
                break;
            case cdmObjectType.attributeGroupRef:
                if (!(found.objectType === cdmObjectType.attributeGroupDef)) {
                    ctx.statusRpt(cdmStatusLevel.error, 'expected type attributeGroup', symbolDef);

                    return undefined;
                }
            default:
        }

        return found;
    }
}

export function NewCorpus(rootPath: string): ICdmCorpusDef {
    return new CorpusImpl(rootPath);
}
