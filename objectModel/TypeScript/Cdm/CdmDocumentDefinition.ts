// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeContext,
    CdmCollection,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition,
    CdmDefinitionCollection,
    CdmE2ERelationship,
    CdmEntityDeclarationDefinition,
    CdmFolderDefinition,
    CdmImport,
    CdmImportCollection,
    CdmManifestDeclarationDefinition,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmObjectDefinitionBase,
    CdmObjectReferenceBase,
    cdmObjectSimple,
    cdmObjectType,
    copyOptions,
    Errors,
    ImportInfo,
    importsLoadStrategy,
    Logger,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';
import { using } from "using-statement";
import { enterScope } from '../Utilities/Logging/Logger';

/**
 * @internal
 */
class ImportPriorities {
    public importPriority: Map<CdmDocumentDefinition, ImportInfo>;
    public monikerPriorityMap: Map<string, CdmDocumentDefinition>;
    public hasCircularImport: boolean;

    constructor() {
        this.importPriority = new Map<CdmDocumentDefinition, ImportInfo>();
        this.monikerPriorityMap = new Map<string, CdmDocumentDefinition>();
        this.hasCircularImport = false;
    }

    public copy(): ImportPriorities {
        const copy: ImportPriorities = new ImportPriorities();
        if (this.importPriority) {
            this.importPriority.forEach((v: ImportInfo, k: CdmDocumentDefinition) => { copy.importPriority.set(k, v); });
        }
        if (this.monikerPriorityMap) {
            this.monikerPriorityMap.forEach((v: CdmDocumentDefinition, k: string) => { copy.monikerPriorityMap.set(k, v); });
        }
        copy.hasCircularImport = this.hasCircularImport;

        return copy;
    }
}

export class CdmDocumentDefinition extends cdmObjectSimple implements CdmDocumentDefinition {

    public static get objectType(): cdmObjectType {
        return cdmObjectType.documentDef;
    }

    public get corpusPath(): string {
        return `${this.namespace || this.folder.namespace}:${this.folderPath}${this.name}`;
    }
    public name: string;
    /**
     * @deprecated Only for internal use.
     */
    public folderPath: string;
    /**
     * @deprecated Only for internal use.
     */
    public namespace: string;
    public schema: string;
    public jsonSchemaSemanticVersion: string;
    public documentVersion: string;
    public readonly imports: CdmImportCollection;
    public definitions: CdmDefinitionCollection;
    public importSetKey: string;
    /**
     * @deprecated Use owner property instead.
     */
    public folder: CdmFolderDefinition;
    /**
     * @internal
     */
    public importPriorities: ImportPriorities;
    /**
     * @internal
     */
    public internalDeclarations: Map<string, CdmObjectBase>;
    /**
     * @internal
     */
    public needsIndexing: boolean;
    /**
     * @internal
     */
    public isDirty: boolean = true;
    /**
     * @internal
     */
    public declarationsIndexed: boolean;
    /**
     * @internal
     */
    public importsIndexed: boolean;
    /**
     * @internal
     */
    public currentlyIndexing: boolean;
    /**
     * @internal
     */
    public isValid: boolean;
    /**
     * @internal
     */
    public _fileSystemModifiedTime: Date;
    /**
     * The maximum json semantic version supported by this ObjectModel version.
     */
    public static currentJsonSchemaSemanticVersion = '1.1.0';

    constructor(ctx: CdmCorpusContext, name: string, hasImports: boolean = false) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.inDocument = this;
            this.objectType = cdmObjectType.documentDef;
            this.name = name;
            this.jsonSchemaSemanticVersion = CdmDocumentDefinition.currentJsonSchemaSemanticVersion;
            this.documentVersion = undefined;
            this.needsIndexing = true;
            this.importsIndexed = false;
            this.declarationsIndexed = false;
            this.isDirty = true;
            this.currentlyIndexing = false;
            this.isValid = true;
            this.namespace = null;

            this.clearCaches();

            this.imports = new CdmImportCollection(ctx, this);
            this.definitions = new CdmDefinitionCollection(ctx, this);
        }
        // return p.measure(bodyCode);
    }
    /**
     * @internal
     */
    public clearCaches(): void {
        this.internalDeclarations = new Map<string, CdmObjectDefinitionBase>();
        // remove all of the cached paths
        this.visit('', undefined, (iObject: CdmObject, path: string) => {
            (iObject as CdmObjectBase).declaredPath = undefined;

            return false;
        });
    }

    /**
     * @internal
     * finds any relative corpus paths that are held within this document and makes them relative to the new folder instead
     */
    public localizeCorpusPaths(newFolder: CdmFolderDefinition): boolean {
        let allWentWell: boolean = true;
        let worked: boolean;
        let corpPath: string;
        const wasBlocking: boolean = this.ctx.corpus.blockDeclaredPathChanges;
        this.ctx.corpus.blockDeclaredPathChanges = true;

        // shout into the void
        Logger.info(
            CdmDocumentDefinition.name,
            this.ctx,
            `Localizing corpus paths in document '${this.name}'`,
            this.localizeCorpusPaths.name
        );

        // find anything in the document that is a corpus path
        this.visit(
            '',
            (iObject: CdmObject, path: string) => {
                // i don't like that document needs to know a little about these objects
                // in theory, we could create a virtual function on cdmObject that localizes properties
                // but then every object would need to know about the documents and paths and such ...
                // also, i already wrote this code.
                switch (iObject.objectType) {
                    case cdmObjectType.import: {
                        const typeObj: CdmImport = iObject as CdmImport;
                        [corpPath, worked] = this.localizeCorpusPath(typeObj.corpusPath, newFolder);
                        if (worked === false) {
                            allWentWell = false;
                        } else {
                            typeObj.corpusPath = corpPath;
                        }
                        break;
                    }
                    case cdmObjectType.localEntityDeclarationDef:
                    case cdmObjectType.referencedEntityDeclarationDef: {
                        const typeObj: CdmEntityDeclarationDefinition = iObject as CdmEntityDeclarationDefinition;
                        [corpPath, worked] = this.localizeCorpusPath(typeObj.entityPath, newFolder);
                        if (worked === false) {
                            allWentWell = false;
                        } else {
                            typeObj.entityPath = corpPath;
                        }
                        break;
                    }
                    case cdmObjectType.dataPartitionDef: {
                        const typeObj: CdmDataPartitionDefinition = iObject as CdmDataPartitionDefinition;
                        [corpPath, worked] = this.localizeCorpusPath(typeObj.location, newFolder);
                        if (worked === false) {
                            allWentWell = false;
                        } else {
                            typeObj.location = corpPath;
                        }
                        [corpPath, worked] = this.localizeCorpusPath(typeObj.specializedSchema, newFolder);
                        if (worked === false) {
                            allWentWell = false;
                        } else {
                            typeObj.specializedSchema = corpPath;
                        }
                        break;
                    }
                    case cdmObjectType.dataPartitionPatternDef: {
                        const typeObj: CdmDataPartitionPatternDefinition = iObject as CdmDataPartitionPatternDefinition;
                        [corpPath, worked] = this.localizeCorpusPath(typeObj.rootLocation, newFolder);
                        if (worked === false) {
                            allWentWell = false;
                        } else {
                            typeObj.rootLocation = corpPath;
                        }
                        [corpPath, worked] = this.localizeCorpusPath(typeObj.specializedSchema, newFolder);
                        if (worked === false) {
                            allWentWell = false;
                        } else {
                            typeObj.specializedSchema = corpPath;
                        }
                        break;
                    }
                    case cdmObjectType.e2eRelationshipDef: {
                        const typeObj: CdmE2ERelationship = iObject as CdmE2ERelationship;
                        [corpPath, worked] = this.localizeCorpusPath(typeObj.toEntity, newFolder);
                        if (worked === false) {
                            allWentWell = false;
                        } else {
                            typeObj.toEntity = corpPath;
                        }
                        [corpPath, worked] = this.localizeCorpusPath(typeObj.fromEntity, newFolder);
                        if (worked === false) {
                            allWentWell = false;
                        } else {
                            typeObj.fromEntity = corpPath;
                        }
                        break;
                    }
                    case cdmObjectType.manifestDeclarationDef: {
                        const typeObj: CdmManifestDeclarationDefinition = iObject as CdmManifestDeclarationDefinition;
                        [corpPath, worked] = this.localizeCorpusPath(typeObj.definition, newFolder);
                        if (worked === false) {
                            allWentWell = false;
                        } else {
                            typeObj.definition = corpPath;
                        }
                        break;
                    }
                    default:
                }

                return false;
            },
            undefined);

        this.ctx.corpus.blockDeclaredPathChanges = wasBlocking;

        return allWentWell;
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.documentDef;
        }
        // return p.measure(bodyCode);
    }

    public fetchObjectDefinition<T = CdmObjectDefinition>(resOpt: resolveOptions): T {
        return undefined;
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            let copy: CdmDocumentDefinition;
            if (!host) {
                copy = new CdmDocumentDefinition(this.ctx, this.name);
            } else {
                copy = host as CdmDocumentDefinition;
                copy.ctx = this.ctx;
                copy.name = this.name;
                copy.definitions.clear();
                copy.declarationsIndexed = false;
                copy.internalDeclarations = new Map<string, CdmObjectBase>();
                copy.needsIndexing = true;
                copy.imports.clear();
                copy.importsIndexed = false;
                copy.importPriorities = undefined;
            }

            copy.inDocument = copy;
            copy.isDirty = true;
            copy.folderPath = this.folderPath;
            copy.schema = this.schema;
            copy.jsonSchemaSemanticVersion = this.jsonSchemaSemanticVersion;
            copy.documentVersion = this.documentVersion;

            for (const def of this.definitions) {
                copy.definitions.push(def);
            }

            for (const imp of this.imports) {
                copy.imports.push(imp);
            }

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            if (!this.name) {
                Logger.error(
                    CdmDocumentDefinition.name,
                    this.ctx,
                    Errors.validateErrorString(this.atCorpusPath, ['name']),
                    this.validate.name);

                return false;
            }

            return true;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public getSchema(): string {
        // let bodyCode = () =>
        {
            return this.schema;
        }
        // return p.measure(bodyCode);
    }

    public getName(): string {
        // let bodyCode = () =>
        {
            return this.name;
        }
        // return p.measure(bodyCode);
    }

    public setName(name: string): string {
        // let bodyCode = () =>
        {
            this.name = name;

            return this.name;
        }
        // return p.measure(bodyCode);
    }

    public getSchemaVersion(): string {
        // let bodyCode = () =>
        {
            return this.jsonSchemaSemanticVersion;
        }
        // return p.measure(bodyCode);
    }

    public getDefinitions()
        : CdmCollection<CdmObjectDefinition> {
        // let bodyCode = () =>
        {
            return this.definitions;
        }
        // return p.measure(bodyCode);
    }

    public getFolder(): CdmFolderDefinition {
        return this.folder;
    }

    public get atCorpusPath(): string {
        if (!this.folder) {
            return `NULL:/${this.name}`;
        } else {
            return `${this.folder.atCorpusPath}${this.name}`;
        }
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            if (preChildren && preChildren(this, pathFrom)) {
                return false;
            }
            if (this.definitions) {
                if (this.definitions.visitArray(pathFrom, preChildren, postChildren)) {
                    return true;
                }
            }
            if (postChildren && postChildren(this, pathFrom)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    /**
     * saves the document back through the adapter in the requested format
     * format is specified via document name/extension based on conventions:
     * 'model.json' for back compat model, '*.manifest.cdm.json' for manifest, '*.cdm.json' for cdm defs
     * saveReferenced (default false) when true will also save any schema defintion documents that are
     * linked from the source doc and that have been modified. existing document names are used for those.
     * returns false on any failure
     */
    public async saveAsAsync(newName: string, saveReferenced: boolean = false, options?: copyOptions): Promise<boolean> {
        return await using(enterScope(CdmDocumentDefinition.name, this.ctx, this.saveAsAsync.name), async _ => {
            if (!options) {
                options = new copyOptions();
            }
            const resOpt: resolveOptions = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            if (!await this.indexIfNeeded(resOpt)) {
                Logger.error(
                    CdmDocumentDefinition.name,
                    this.ctx,
                    `Failed to index document prior to save '${this.name}'`,
                    this.saveAsAsync.name
                );

                return false;
            }
            // if save to the same document name, then we are no longer 'dirty'
            if (newName === this.name) {
                this.isDirty = false;
            }

            if (await this.ctx.corpus.persistence.saveDocumentAsAsync(this, options, newName, saveReferenced) === false) {
                return false;
            }

            return true;
        });
    }

    public async refreshAsync(resOpt: resolveOptions): Promise<boolean> {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        this.needsIndexing = true;
        this.importPriorities = undefined;
        this.importsIndexed = false;
        this.declarationsIndexed = false;
        this.isValid = true;

        return this.indexIfNeeded(resOpt, true);
    }

    /**
     * @internal
     * Remove any old document content from caches and re-declare and resolve with new content
     */
    public async indexIfNeeded(resOpt: resolveOptions, loadImports: boolean = false): Promise<boolean> {
        // let bodyCode = () =>
        {
            if (this.needsIndexing && !this.currentlyIndexing) {
                if (!this.folder) {
                    Logger.error(CdmDocumentDefinition.name, this.ctx, `Document '${this.name}' is not in a folder`, this.indexIfNeeded.name);
                    return false;
                }

                const corpus: CdmCorpusDefinition = this.folder.corpus;

                // if the imports load strategy is "lazyLoad", loadImports value will be the one sent by the called function.
                if (resOpt.importsLoadStrategy === importsLoadStrategy.doNotLoad) {
                    loadImports = false;
                } else if (resOpt.importsLoadStrategy === importsLoadStrategy.load) {
                    loadImports = true;
                }

                if (loadImports) {
                    await corpus.resolveImportsAsync(this, resOpt);
                }

                // make the corpus internal machinery pay attention to this document for this call.
                corpus.documentLibrary.markDocumentForIndexing(this);

                return corpus.indexDocuments(resOpt, loadImports);
            }

            return true;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public getImportPriorities(): ImportPriorities {

        if (this.importPriorities === undefined) {
            const importPriorities: ImportPriorities = new ImportPriorities();
            importPriorities.importPriority.set(this, new ImportInfo(0, false));
            this.prioritizeImports(
                new Set<CdmDocumentDefinition>(), importPriorities, 1, false);
            this.importPriorities = importPriorities;
        }

        // make a copy so the caller doesn't mess these up
        return this.importPriorities.copy();
    }

    /**
     * @internal
     */
    public fetchObjectFromDocumentPath(objectPath: string, resOpt: resolveOptions): CdmObject {
        // let bodyCode = () =>
        {
            // in current document?
            if (this.internalDeclarations.has(objectPath)) {
                return this.internalDeclarations.get(objectPath);
            } else {
                // this might be a request for an object def drill through of a reference.
                // path/(object)/paths
                // there can be several such requests in one path AND some of the requested
                // defintions might be defined inline inside a reference meaning the declared path
                // includes that reference name and could still be inside this document. example:
                // /path/path/refToInline/(object)/member1/refToSymbol/(object)/member2
                // the full path is not in this doc but /path/path/refToInline/(object)/member1/refToSymbol
                // is declared in this document. we then need to go to the doc for refToSymbol and
                // search for refToSymbol/member2

                // work backward until we find something in this document
                let lastObj: number = objectPath.lastIndexOf('/(object)');
                let thisDocPart: string = objectPath;
                while (lastObj > 0) {
                    thisDocPart = objectPath.slice(0, lastObj);
                    if (this.internalDeclarations.has(thisDocPart)) {
                        const thisDocObjRef: CdmObjectReferenceBase = this.internalDeclarations.get(thisDocPart) as CdmObjectReferenceBase;
                        const thatDocObjDef: CdmObjectDefinitionBase = thisDocObjRef.fetchObjectDefinition(resOpt);
                        if (thatDocObjDef !== undefined) {
                            // get from other document.
                            // but first fix the path to look like it is relative to that object as declared in that doc
                            let thatDocPart: string = objectPath.slice(lastObj + '/(object)'.length);
                            thatDocPart = `${thatDocObjDef.declaredPath}${thatDocPart}`;
                            if (thatDocPart === objectPath) {
                                // we got back to were we started. probably because something is just not found.
                                return undefined;
                            }

                            return thatDocObjDef.inDocument.fetchObjectFromDocumentPath(thatDocPart, resOpt);
                        }

                        return undefined;
                    }
                    lastObj = thisDocPart.lastIndexOf('/(object)');
                }
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    /**
     * @internal
     */
    public async reload(): Promise<void> {
        await (this.ctx.corpus).fetchObjectAsync(this.corpusPath);
    }

    /**
     * @internal
     */
    public async saveLinkedDocuments(options?: copyOptions): Promise<boolean> {
        if (!options) {
            options = new copyOptions();
        }

        // the only linked documents would be the imports
        if (this.imports !== undefined) {
            for (const imp of this.imports) {
                // get the document object from the import
                const docPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(imp.corpusPath, this);
                const docImp: CdmDocumentDefinition = await this.ctx.corpus.fetchObjectAsync<CdmDocumentDefinition>(docPath);
                if (docImp !== undefined && docImp.isDirty) {
                    // save it with the same name
                    if (await docImp.saveAsAsync(docImp.name, true, options) === false) {
                        Logger.error(
                            'CdmDocumentDefinition',
                            this.ctx,
                            `Foiled to save import ${docImp.name}`,
                            this.saveLinkedDocuments.name
                        );

                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * changes a relative corpus path to be relative to the new folder
     */
    private localizeCorpusPath(path: string, newFolder: CdmFolderDefinition): [string, boolean] {
        // if this isn't a local path, then don't do anything to it
        if (!path) {
            return [path, true];
        }

        // but first, if there was no previous folder (odd) then just localize as best we can
        const oldFolder: CdmFolderDefinition = this.owner as CdmFolderDefinition;
        let newPath: string;
        if (!oldFolder) {
            newPath = this.ctx.corpus.storage.createRelativeCorpusPath(path, newFolder);
        } else {
            // if the current value != the absolute path, then assume it is a relative path
            const absPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(path, oldFolder);
            if (absPath === path) {
                newPath = absPath; // leave it alone
            } else {
                // make it relative to the new folder then
                newPath = this.ctx.corpus.storage.createRelativeCorpusPath(absPath, newFolder);
            }
        }

        if (newPath === undefined) {
            return [newPath, false];
        }

        return [newPath, true];
    }

    private prioritizeImports(
        processedSet: Set<CdmDocumentDefinition>,
        importPriorities: ImportPriorities,
        sequence: number,
        skipMonikered: boolean)
        : number {
        // goal is to make a map from the reverse order of imports (breadth first) to the first (aka last) sequence number in that list.
        // This gives the semantic that the 'last/shallowest' definition for a duplicate symbol wins,
        // the lower in this list a document shows up, the higher priority its definitions are for resolving conflicts.
        // for 'moniker' imports, keep track of the 'last/shallowest' use of each moniker tag.

        // maps document to priority.
        const priorityMap: Map<CdmDocumentDefinition, ImportInfo> = importPriorities.importPriority;

        // maps moniker to document.
        const monikerMap: Map<string, CdmDocumentDefinition> = importPriorities.monikerPriorityMap;

        // if already in list, don't do this again
        if (processedSet.has(this)) {
            // if the first document in the priority map is this then the document was the starting point of the recursion.
            // and if this document is present in the processedSet we know that there is a circular list of imports.
            if (priorityMap.has(this) && priorityMap.get(this).priority === 0) {
                importPriorities.hasCircularImport = true;
            }

            return sequence;
        }
        processedSet.add(this);

        if (this.imports) {
            const revImp: CdmImport[] = this.imports.allItems.slice()
                .reverse();
            const monikerImports: CdmDocumentDefinition[] = [];
            // first add the imports done at this level only in reverse order.
            for (const imp of revImp) {
                const impDoc: CdmDocumentDefinition = imp.document;

                if (impDoc) {
                    // moniker imports will be added to the end of the priority list later.
                    if (imp.document && !imp.moniker && !priorityMap.has(impDoc)) {
                        // add doc.
                        priorityMap.set(impDoc, new ImportInfo(sequence, false));
                        sequence++;
                    } else {
                        monikerImports.push(impDoc);
                    }
                } else {
                    Logger.warning(CdmDocumentDefinition.name, this.ctx, `Import document ${imp.corpusPath} not loaded. This might cause an unexpected output.`);
                }
            }

            // now add the imports of the imports.
            for (const imp of revImp) {
                const impDoc: CdmDocumentDefinition = imp.document;
                const isMoniker: boolean = !!imp.moniker;

                if (!impDoc) {
                    Logger.warning(CdmDocumentDefinition.name, this.ctx, `Import document ${imp.corpusPath} not loaded. This might cause an unexpected output.`);
                }

                // if the document has circular imports its order on the impDoc.ImportPriorities list is not correct.
                // since the document itself will always be the first one on the list.
                if (impDoc !== undefined && impDoc.importPriorities !== undefined && !impDoc.importPriorities.hasCircularImport) {
                    // lucky, already done so avoid recursion and copy.
                    const impPriSub: ImportPriorities = impDoc.getImportPriorities();
                    impPriSub.importPriority.delete(impDoc); // because already added above.
                    impPriSub.importPriority.forEach((v: ImportInfo, k: CdmDocumentDefinition) => {
                        // if the document is imported with moniker in another document do not include it in the priority list of this one.
                        // moniker imports are only added to the priority list of the document that directly imports them.
                        if (!priorityMap.has(k) && !v.isMoniker) {
                            // add doc.
                            priorityMap.set(k, new ImportInfo(sequence, false));
                            sequence++;
                        }
                    });

                    // if the import is not monikered then merge its monikerMap to this one.
                    if (!isMoniker) {
                        impPriSub.monikerPriorityMap.forEach((v: CdmDocumentDefinition, k: string) => {
                            monikerMap.set(k, v);
                        });
                    }
                } else if (impDoc !== undefined) {
                    // skip the monikered imports from here if this is a monikered import itself 
                    // and we are only collecting the dependencies.
                    sequence = impDoc.prioritizeImports(processedSet, importPriorities, sequence, isMoniker);
                }
            }

            // skip the monikered imports from here if this is a monikered import itself and we are only collecting the dependencies.
            if (!skipMonikered) {
                // moniker imports are prioritized by the 'closest' use of the moniker to the starting doc.
                // so last one found in this recursion.
                for (const imp of this.imports) {
                    if (imp.document && imp.moniker) {
                        monikerMap.set(imp.moniker, imp.document);
                    }
                }

                // if the document index is zero, the document being processed is the root of the imports chain.
                // in this case add the monikered imports to the end of the priorityMap.
                if (priorityMap.has(this) && priorityMap.get(this).priority === 0) {
                    for (const imp of monikerImports) {
                        if (!priorityMap.has(imp)) {
                            priorityMap.set(imp, new ImportInfo(sequence, true));
                            sequence++;
                        }
                    }
                }
            }
        }

        return sequence;
    }
}
