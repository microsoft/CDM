// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    CdmAttributeContext,
    CdmCollection,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition,
    CdmDefinitionCollection,
    CdmE2ERelationship,
    CdmEntityDeclarationDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmImport,
    CdmImportCollection,
    CdmManifestDeclarationDefinition,
    CdmManifestDefinition,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmObjectDefinitionBase,
    CdmObjectReferenceBase,
    cdmObjectSimple,
    cdmObjectType,
    CdmParameterDefinition,
    CdmTraitDefinition,
    CdmTraitReference,
    copyOptions,
    cdmLogCode,
    ImportInfo,
    ImportPriorities,
    importsLoadStrategy,
    isEntityDefinition,
    Logger,
    ParameterCollection,
    ResolvedAttributeSetBuilder,
    resolveContext,
    resolveOptions,
    ResolvedTraitSetBuilder,
    VisitCallback,
    CdmLocalEntityDeclarationDefinition
} from '../internal';
import { using } from "using-statement";
import { enterScope } from '../Utilities/Logging/Logger';

export class CdmDocumentDefinition extends cdmObjectSimple implements CdmDocumentDefinition {
    private TAG: string = CdmDocumentDefinition.name;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.documentDef;
    }

    /**
     * @deprecated Use atCorpusPath instead.
     */
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
    public get folder(): CdmFolderDefinition {
        return this.owner as CdmFolderDefinition;
    }

    /**
     * @deprecated Use owner property instead.
     */
    public set folder(value: CdmFolderDefinition) {
        this.owner = value;
    }

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
    public static currentJsonSchemaSemanticVersion = '1.4.0';

    /**
     * A list of all objects contained by this document.
     * Only using during indexing and cleared after indexing is done.
     */
     private internalObjects: CdmObjectBase[];

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

            this.imports = new CdmImportCollection(ctx, this);
            this.definitions = new CdmDefinitionCollection(ctx, this);
        }
        // return p.measure(bodyCode);
    }

    /**
     * Validates all the objects in this document.
     * @internal
     */
     public checkIntegrity(): void {
        // let bodyCode = () =>
        {
            let errorCount: number = 0;
            for (const obj of this.internalObjects) {
                if (!obj.validate()) {
                    errorCount++;
                } else {
                    obj.ctx = this.ctx;
                }
                Logger.info(this.ctx, this.TAG, this.checkIntegrity.name, obj.atCorpusPath, `checked '${obj.atCorpusPath}'`);
            }

            this.isValid = errorCount === 0;
        }
        // return p.measure(bodyCode);
    }

    /**
     * Clear all document's internal caches and update the declared path of every object contained by this document.
     * @internal
     */
    public clearCaches(): void {
        // Clean all internal caches and flags
        this.internalObjects = [];
        this.declarationsIndexed = false;
        this.internalDeclarations = new Map<string, CdmObjectDefinitionBase>();
        this.importsIndexed = false;
        this.importPriorities = undefined;

        // Collects all the objects contained by this document and updates their DeclaredPath.
        this.visit('', (obj: CdmObject, objPath: string) => {
            const objectBase: CdmObjectBase = obj as CdmObjectBase;
            // Update the DeclaredPath property.
            objectBase.declaredPath = objPath;
            this.internalObjects.push(objectBase);

            return false;
        }, undefined);
    }

    /**
     * Indexes all definitions contained by this document.
     * @internal
     */
    public declareObjectDefinitions(): void {
        // let bodyCode = () =>
        {
            const corpusPathRoot: string = this.folderPath + this.name;
            for (const obj of this.internalObjects) {
                // I can't think of a better time than now to make sure any recently changed or added things have an in doc
                obj.inDocument = this;
                const objPath = obj.declaredPath;

                if (objPath.indexOf('(unspecified)') !== -1) {
                    continue;
                }
                let skipDuplicates: boolean = false;
                switch (obj.objectType) {
                    case cdmObjectType.constantEntityDef:
                        // if there is a duplicate, don't complain, the path just finds the first one
                        skipDuplicates = true;
                    case cdmObjectType.attributeGroupDef:
                    case cdmObjectType.entityDef:
                    case cdmObjectType.parameterDef:
                    case cdmObjectType.traitDef:
                    case cdmObjectType.traitGroupDef:
                    case cdmObjectType.purposeDef:
                    case cdmObjectType.dataTypeDef:
                    case cdmObjectType.typeAttributeDef:
                    case cdmObjectType.entityAttributeDef:
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
                        const corpusPath: string = `${corpusPathRoot}/${objPath}`;
                        if (this.internalDeclarations.has(objPath) && !skipDuplicates) {
                            Logger.error(this.ctx, this.TAG, this.declareObjectDefinitions.name, this.atCorpusPath, cdmLogCode.ErrPathIsDuplicate, objPath, corpusPath);
                        } else {
                            this.internalDeclarations.set(objPath, obj as CdmObjectDefinitionBase);
                            this.ctx.corpus.registerSymbol(objPath, this);

                            Logger.info(this.ctx, this.TAG, this.declareObjectDefinitions.name, this.atCorpusPath, `declared '${objPath}'`);
                        }
                    default:
                }
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
     public finishIndexing(loadedImports: boolean): void {
        Logger.debug(this.ctx, this.TAG, this.finishIndexing.name, this.atCorpusPath, `index finish: ${this.atCorpusPath}`);

        const wasIndexedPreviously = this.declarationsIndexed;

        this.ctx.corpus.documentLibrary.markDocumentAsIndexed(this);
        this.importsIndexed = this.importsIndexed || loadedImports;
        this.declarationsIndexed = true;
        this.needsIndexing = !loadedImports;
        this.internalObjects = undefined;

        // if the thisument declarations were indexed previously, do not log again.
        if (!wasIndexedPreviously && this.isValid) {
            for (const def of this.definitions.allItems) {
                if (isEntityDefinition(def)) {
                    Logger.debug(this.ctx, this.TAG, this.finishIndexing.name, def.atCorpusPath, `indexed entity: ${def.atCorpusPath}`);
                }
            }
        }
    }

    /**
     * Fetches the corresponding object definition for every object reference.
     * @internal
     */
    public resolveObjectDefinitions(resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            resOpt.indexingDoc = this;

            for (const obj of this.internalObjects) {
                switch (obj.objectType) {
                    case cdmObjectType.attributeRef:
                    case cdmObjectType.attributeGroupRef:
                    case cdmObjectType.attributeContextRef:
                    case cdmObjectType.dataTypeRef:
                    case cdmObjectType.entityRef:
                    case cdmObjectType.purposeRef:
                    case cdmObjectType.traitRef:
                        ctx.relativePath = obj.declaredPath;
                        const ref: CdmObjectReferenceBase = obj as CdmObjectReferenceBase;

                        if (CdmObjectReferenceBase.offsetAttributePromise(ref.namedReference) < 0) {
                            const resNew: CdmObjectDefinitionBase = ref.fetchObjectDefinition(resOpt);

                            if (!resNew) {
                                const messagePath: string = this.folderPath + obj.declaredPath;

                                // It's okay if references can't be resolved when shallow validation is enabled.
                                if (resOpt.shallowValidation) {
                                    Logger.warning(ctx, this.TAG, this.resolveObjectDefinitions.name, this.atCorpusPath, cdmLogCode.WarnResolveReferenceFailure, ref.namedReference);
                                } else {
                                    Logger.error(this.ctx, this.TAG, this.resolveObjectDefinitions.name, this.atCorpusPath, cdmLogCode.ErrResolveReferenceFailure, ref.namedReference);
                                }
                                // don't check in this file without both of these comments. handy for debug of failed lookups
                                //const resTest: CdmObjectDefinitionBase = ref.fetchObjectDefinition(resOpt);
                            } else {
                                Logger.info(ctx, this.TAG, this.resolveObjectDefinitions.name, this.atCorpusPath, `resolved '${ref.namedReference}'`);
                            }
                        }
                    default:
                }
            }

            resOpt.indexingDoc = undefined;
        }
        // return p.measure(bodyCode);
    }

    /**
     * Verifies if the trait argument data type matches what is specified on the trait definition.
     * @internal
     */
    public resolveTraitArguments(resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            for (const obj of this.internalObjects) {
                if (obj.objectType === cdmObjectType.traitRef) {
                    const traitRef = obj as CdmTraitReference;
                    const traitDef: CdmTraitDefinition = obj.fetchObjectDefinition<CdmTraitDefinition>(resOpt);

                    if (!traitDef) {
                        continue;
                    }

                    for (let argumentIndex = 0; argumentIndex < traitRef.arguments.length; ++argumentIndex) {
                        const argument = traitRef.arguments.allItems[argumentIndex];
                        try {
                            ctx.relativePath = argument.declaredPath;

                            const params: ParameterCollection = traitDef.fetchAllParameters(resOpt);
                            const paramFound: CdmParameterDefinition = params.resolveParameter(argumentIndex, argument.getName());
                            argument.resolvedParameter = paramFound;

                            // if parameter type is entity, then the value should be an entity or ref to one
                            // same is true of 'dataType' dataType
                            const argumentValue: any = paramFound.constTypeCheck(resOpt, this, argument.value);
                            if (argumentValue) {
                                argument.setValue(argumentValue);
                            }
                        } catch (e) {
                            Logger.error(this.ctx, this.TAG, this.resolveTraitArguments.name, this.atCorpusPath, cdmLogCode.ErrTraitResolutionFailure, (e as Error).toString(), traitDef.getName());
                        }
                    }

                    traitRef.resolvedArguments = true;
                }
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     * finds any relative corpus paths that are held within this document and makes them relative to the new folder instead
     */
    public localizeCorpusPaths(newFolder: CdmFolderDefinition): boolean {
        let allWentWell: boolean = true;
        let worked: boolean;
        let corpPath: string;

        // shout into the void
        Logger.info(this.ctx, this.TAG, this.localizeCorpusPaths.name, this.atCorpusPath, `Localizing corpus paths in document '${this.name}'`);

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

    public fetchObjectDefinitionName(): string {
        return this.name;
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
                let missingFields: string[] = ['name'];
                Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
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
        return this.owner as CdmFolderDefinition;
    }

    public get atCorpusPath(): string {
        if (!this.owner) {
            return `NULL:/${this.name}`;
        } else {
            return `${this.owner.atCorpusPath}${this.name}`;
        }
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            if (preChildren && preChildren(this, pathFrom)) {
                return false;
            }
            if (this.imports) {
                if (this.imports.visitArray(pathFrom, preChildren, postChildren)) {
                    return true;
                }
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
                Logger.error(this.ctx, this.TAG, this.saveAsAsync.name, this.atCorpusPath, cdmLogCode.ErrIndexFailed, this.name);
                return false;
            }
            // if save to the same document name, then we are no longer 'dirty'
            if (newName === this.name) {
                this.isDirty = false;
            }

            if (await this.ctx.corpus.persistence.saveDocumentAsAsync(this, options, newName, saveReferenced) === false) {
                return false;
            }

            if (this instanceof CdmManifestDefinition) {
                for (const entity of (this as CdmManifestDefinition).entities) {
                    if (entity instanceof CdmLocalEntityDeclarationDefinition) {
                      (entity as CdmLocalEntityDeclarationDefinition).resetLastFileModifiedOldTime();
                    }
                    for (const relationship of (this as CdmManifestDefinition).relationships) {
                      relationship.resetLastFileModifiedOldTime();
                    }
                }
                // Log the telemetry if the document is a manifest
                Logger.ingestManifestTelemetry(this as CdmManifestDefinition, this.ctx, this.TAG, this.saveAsAsync.name, this.atCorpusPath);
            } else {
                // Log the telemetry of all entities contained in the document
                for (const obj of this.definitions) {
                    if (obj instanceof CdmEntityDefinition) {
                        Logger.ingestEntityTelemetry(obj as CdmEntityDefinition, this.ctx, this.TAG, this.saveAsAsync.name, obj.atCorpusPath);
                    }
                }
            }

            return true;
        });
    }

    public async refreshAsync(resOpt: resolveOptions): Promise<boolean> {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        this.needsIndexing = true;
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
            if (!this.owner) {
                Logger.error(this.ctx, this.TAG, this.indexIfNeeded.name, this.atCorpusPath, cdmLogCode.ErrValdnMissingDoc, this.name);
                return false;
            }

            const corpus: CdmCorpusDefinition = (this.owner as CdmFolderDefinition).corpus;
            const needsIndexing = corpus.documentLibrary.markDocumentForIndexing(this);

            if (!needsIndexing) {
                return true;
            }

            // if the imports load strategy is "lazyLoad", loadImports value will be the one sent by the called function.
            if (resOpt.importsLoadStrategy === importsLoadStrategy.doNotLoad) {
                loadImports = false;
            } else if (resOpt.importsLoadStrategy === importsLoadStrategy.load) {
                loadImports = true;
            }

            // make the internal machinery pay attention to this document for this call.
            const docsLoading: Set<string> = new Set([ this.atCorpusPath ]);

            if (loadImports) {
                await corpus.resolveImportsAsync(this, docsLoading, resOpt);
            }

            // make the corpus internal machinery pay attention to this document for this call.
            corpus.documentLibrary.markDocumentForIndexing(this);

            return corpus.indexDocuments(resOpt, loadImports, this, docsLoading);
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
                while (lastObj > 0) {
                    const thisDocPart: string = objectPath.slice(0, lastObj);
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
                        Logger.error(this.ctx, this.TAG, this.saveLinkedDocuments.name, docImp.atCorpusPath, cdmLogCode.ErrDocImportSavingFailure, this.name);
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

                // moniker imports will be added to the end of the priority list later.
                if (impDoc) {
                    if (imp.document && !imp.moniker && !priorityMap.has(impDoc)) {
                        // add doc.
                        priorityMap.set(impDoc, new ImportInfo(sequence, false));
                        sequence++;
                    } else {
                        monikerImports.push(impDoc);
                    }
                } else {
                    Logger.warning(this.ctx, this.TAG, this.prioritizeImports.name, imp.atCorpusPath, cdmLogCode.WarnDocImportNotLoaded, imp.corpusPath);
                }
            }

            // now add the imports of the imports.
            for (const imp of revImp) {
                const impDoc: CdmDocumentDefinition = imp.document;
                const isMoniker: boolean = !!imp.moniker;

                if (!impDoc) {
                    Logger.warning(this.ctx, this.TAG, this.prioritizeImports.name, imp.atCorpusPath, cdmLogCode.WarnDocImportNotLoaded, imp.corpusPath);
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

    /**
     * @internal
     */
    public importPathToDoc(docDest: CdmDocumentDefinition): string {
        const avoidLoop: Set<CdmDocumentDefinition> = new Set<CdmDocumentDefinition>();
        const internalImportPathToDoc: (docCheck: CdmDocumentDefinition, path: string) => string
            = (docCheck: CdmDocumentDefinition, path: string): string => {
                if (docCheck === docDest) {
                    return '';
                }
                if (avoidLoop.has(docCheck)) {
                    return undefined;
                }
                avoidLoop.add(docCheck);
                // if the docDest is one of the monikered imports of docCheck, then add the moniker and we are cool
                if (docCheck.importPriorities && docCheck.importPriorities.monikerPriorityMap && docCheck.importPriorities.monikerPriorityMap.size > 0) {
                    for (const monPair of docCheck.importPriorities.monikerPriorityMap) {
                        if (monPair[1] === docDest) {
                            return `${path}${monPair[0]}/`;
                        }
                    }
                }
                // ok, what if the document can be reached directly from the imports here
                let impInfo: ImportInfo;
                if (docCheck.importPriorities && docCheck.importPriorities.importPriority && !docCheck.importPriorities.importPriority.has(docDest)) {
                    impInfo = undefined;
                }
                if (impInfo && !impInfo.isMoniker) {
                    // good enough
                    return path;
                }

                // still nothing, now we need to check those docs deeper
                if (docCheck.importPriorities && docCheck.importPriorities.monikerPriorityMap && docCheck.importPriorities.monikerPriorityMap.size > 0) {
                    for (const monPair of docCheck.importPriorities.monikerPriorityMap) {
                        const pathFound: string = internalImportPathToDoc(monPair[1], `${path}${monPair[0]}/`);
                        if (pathFound != null) {
                            return pathFound;
                        }
                    }
                }
                if (docCheck.importPriorities && docCheck.importPriorities.importPriority && docCheck.importPriorities.importPriority.size > 0) {
                    for (const impInfoPair of docCheck.importPriorities.importPriority) {
                        if (!impInfoPair[1].isMoniker) {
                            const pathFound: string = internalImportPathToDoc(impInfoPair[0], path);
                            if (pathFound) {
                                return pathFound;
                            }
                        }
                    }
                }
                return undefined;

            };

        return internalImportPathToDoc(this, '');

    }
}
