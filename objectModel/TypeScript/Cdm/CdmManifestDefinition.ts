// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmCollection,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmE2ERelationship,
    CdmEntityCollection,
    CdmEntityDeclarationDefinition,
    CdmEntityDefinition,
    CdmFileStatus,
    CdmFolderDefinition,
    CdmImport,
    CdmLocalEntityDeclarationDefinition,
    cdmLogCode,
    CdmManifestDeclarationDefinition,
    CdmObject,
    CdmObjectDefinition,
    cdmObjectType,
    cdmRelationshipDiscoveryStyle,
    CdmTraitCollection,
    CdmTraitReferenceBase,
    copyOptions,
    importsLoadStrategy,
    Logger,
    resolveOptions,
    StorageAdapterBase,
    StorageAdapterCacheContext,
    VisitCallback
} from '../internal';
import { isLocalEntityDeclarationDefinition, isReferencedEntityDeclarationDefinition } from '../Utilities/cdmObjectTypeGuards';
import * as timeUtils from '../Utilities/timeUtils';
import { using } from "using-statement";
import { enterScope } from '../Utilities/Logging/Logger';

export class CdmManifestDefinition extends CdmDocumentDefinition implements CdmObjectDefinition, CdmFileStatus {
    private _TAG: string = CdmManifestDefinition.name;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.manifestDef;
    }
    public manifestName: string;
    public readonly subManifests: CdmCollection<CdmManifestDeclarationDefinition>;
    public readonly entities: CdmEntityCollection;
    public readonly relationships: CdmCollection<CdmE2ERelationship>;
    public readonly exhibitsTraits: CdmTraitCollection;
    public explanation: string;
    public lastFileStatusCheckTime: Date;
    public lastFileModifiedTime: Date;
    public lastChildFileModifiedTime: Date;

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx, `${name}.manifest.cdm.json`);
        this.objectType = cdmObjectType.manifestDef;
        this.manifestName = name;

        this.subManifests = new CdmCollection<CdmManifestDeclarationDefinition>(this.ctx, this, cdmObjectType.manifestDeclarationDef);
        this.entities = new CdmEntityCollection(this.ctx, this);
        this.relationships = new CdmCollection<CdmE2ERelationship>(this.ctx, this, cdmObjectType.e2eRelationshipDef);
        this.exhibitsTraits = new CdmTraitCollection(this.ctx, this);
    }

    public getExplanation(): string {
        return this.explanation;
    }

    public setExplanation(explanation: string): string {
        this.explanation = explanation;

        return this.explanation;
    }

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        return false;
    }

    /**
     * @internal
     */
    public getObjectPath(): string {
        return this.atCorpusPath;
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
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
        if (this.entities) {
            if (this.entities.visitArray(pathFrom, preChildren, postChildren)) {
                return true;
            }
        }
        if (this.relationships) {
            if (this.relationships.visitArray(`${pathFrom}/relationships/`, preChildren, postChildren)) {
                return true;
            }
        }
        if (this.subManifests) {
            if (this.subManifests.visitArray(`${pathFrom}/subManifests/`, preChildren, postChildren)) {
                return true;
            }
        }
        if (postChildren && postChildren(this, pathFrom)) {
            return true;
        }

        return false;
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        // since we need to call the base copy which will only return a document when there is no host, make a fake host here
        const tempHost: CdmManifestDefinition =
            host instanceof CdmManifestDefinition ? host : new CdmManifestDefinition(this.ctx, this.manifestName);

        const copy: CdmManifestDefinition = super.copy(resOpt, tempHost) as CdmManifestDefinition;
        copy.manifestName = this.manifestName;
        copy.explanation = this.explanation;
        copy.lastFileStatusCheckTime = this.lastFileStatusCheckTime;
        copy.lastFileModifiedTime = this.lastFileModifiedTime;
        copy.lastChildFileModifiedTime = this.lastChildFileModifiedTime;

        copy.entities.clear();
        for (const ent of this.entities) {
            copy.entities.push(ent.copy(resOpt) as CdmEntityDeclarationDefinition);
        }
        copy.relationships.clear();
        for (const rel of this.relationships) {
            copy.relationships.push(rel.copy(resOpt) as CdmE2ERelationship);
        }
        copy.subManifests.clear();
        for (const man of this.subManifests) {
            copy.subManifests.push(man.copy(resOpt) as CdmManifestDeclarationDefinition);
        }
        copy.exhibitsTraits.clear();
        for (const et of this.exhibitsTraits) {
            copy.exhibitsTraits.push(et.copy(resOpt) as CdmTraitReferenceBase);
        }

        return copy;
    }

    /**
     * creates a resolved copy of the manifest.
     * newEntityDocumentNameFormat specifies a pattern to use when creating documents for resolved entites
     * the default is "{f}resolved/{n}.cdm.json" to avoid a document name conflict with documents in the same
     * folder as the manifest. every instance of the string {n} is replaced with the entity name from the source manifest
     * every instance of the string {f} is replaced with the folder path from the source manifest to the source entity
     * (if there is one that is possible as a relative location, else nothing)
     */
    public async createResolvedManifestAsync(
        newManifestName: string,
        newEntityDocumentNameFormat: string,
        directives?: AttributeResolutionDirectiveSet): Promise<CdmManifestDefinition> {
        return await using(enterScope(CdmManifestDefinition.name, this.ctx, this.createResolvedManifestAsync.name), async _ => {
            if (!this.entities) {
                return undefined;
            }

            if (!this.owner) {
                Logger.error(this.ctx, this._TAG, this.createResolvedManifestAsync.name, this.atCorpusPath, cdmLogCode.ErrResolveManifestFailed, this.manifestName);
                return undefined;
            }

            if (newEntityDocumentNameFormat == undefined) {
                newEntityDocumentNameFormat = '{f}resolved/{n}.cdm.json';
            } else if (newEntityDocumentNameFormat === '') { // for back compat
                newEntityDocumentNameFormat = '{n}.cdm.json';
            } else if (newEntityDocumentNameFormat.search('{n}') === -1) { // for back compat
                newEntityDocumentNameFormat = `${newEntityDocumentNameFormat}/{n}.cdm.json`;
            }

            const sourceManifestPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(this.atCorpusPath, this);
            const sourceManifestFolderPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(this.owner.atCorpusPath, this);

            const resolvedManifestPathSplit: number = newManifestName.lastIndexOf('/') + 1;
            let resolvedManifestFolder: CdmFolderDefinition;
            if (resolvedManifestPathSplit > 0) {
                const resolvedManifestPath: string = newManifestName.substring(0, resolvedManifestPathSplit);
                const newFolderPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(resolvedManifestPath, this);
                resolvedManifestFolder = await this.ctx.corpus.fetchObjectAsync<CdmFolderDefinition>(newFolderPath);
                if (!resolvedManifestFolder) {
                    Logger.error(this.ctx, this._TAG, this.createResolvedManifestAsync.name, this.atCorpusPath, cdmLogCode.ErrResolveFolderNotFound, newFolderPath);
                    return undefined;
                }
                newManifestName = newManifestName.substr(resolvedManifestPathSplit, newManifestName.length - resolvedManifestPathSplit);
            } else {
                resolvedManifestFolder = this.owner as CdmFolderDefinition;
            }

            if (resolvedManifestFolder.documents.item(newManifestName) !== undefined) {
                Logger.error(this.ctx, this._TAG, this.createResolvedManifestAsync.name, this.atCorpusPath, cdmLogCode.ErrResolveManifestExists, newManifestName, resolvedManifestFolder.atCorpusPath);
                return undefined;
            }

            Logger.debug(this.ctx, this._TAG, this.createResolvedManifestAsync.name, this.atCorpusPath, `resolving manifest ${this.manifestName}`);

            // Using the references present in the resolved entities, get an entity
            // create an imports doc with all the necessary resolved entity references and then resolve it
            // sometimes they might send the docname, that makes sense a bit, don't include the suffix in the name
            if (newManifestName.toLowerCase().endsWith('.manifest.cdm.json')) {
                newManifestName = newManifestName.substring(0, newManifestName.length - '.manifest.cdm.json'.length);
            }
            const resolvedManifest: CdmManifestDefinition = new CdmManifestDefinition(this.ctx, newManifestName);

            // bring over any imports in this document or other bobbles
            resolvedManifest.schema = this.schema;
            resolvedManifest.explanation = this.explanation;
            resolvedManifest.documentVersion = this.documentVersion;
            for (const imp of this.imports) {
                resolvedManifest.imports.push(imp.copy());
            }

            // add the new document to the folder
            if (resolvedManifestFolder.documents.push(resolvedManifest) === undefined) {
                // when would this happen?

                return undefined;
            }

            for (const entity of this.entities) {
                const entityPath: string = await this.getEntityPathFromDeclaration(entity, this);
                const entDef: CdmEntityDefinition = await this.ctx.corpus.fetchObjectAsync<CdmEntityDefinition>(entityPath);

                if (entDef === undefined) {
                    Logger.error(this.ctx, this._TAG, this.createResolvedManifestAsync.name, this.atCorpusPath, cdmLogCode.ErrResolveEntityFailure, entityPath);
                    return undefined;
                }

                if (!entDef.inDocument.owner) {
                    Logger.error(this.ctx, this._TAG, this.createResolvedManifestAsync.name, this.atCorpusPath, cdmLogCode.ErrDocIsNotFolder, entDef.entityName);
                    return undefined;
                }

                // get the path from this manifest to the source entity. This will be the {f} replacement value
                const sourceEntityFullPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(entDef.inDocument.owner.atCorpusPath, this);
                let f: string = '';
                if (sourceEntityFullPath.startsWith(sourceManifestFolderPath)) {
                    f = sourceEntityFullPath.substr(sourceManifestFolderPath.length, sourceEntityFullPath.length - sourceManifestFolderPath.length);
                }

                let newDocumentFullPath: string = newEntityDocumentNameFormat.replace('{n}', entDef.entityName);
                newDocumentFullPath = newDocumentFullPath.replace('{f}', f);
                newDocumentFullPath = this.ctx.corpus.storage.createAbsoluteCorpusPath(newDocumentFullPath, this);
                const newDocumentPathSplit: number = newDocumentFullPath.lastIndexOf('/') + 1;
                const newDocumentPath: string = newDocumentFullPath.slice(0, newDocumentPathSplit);
                const newDocumentName: string = newDocumentFullPath.substr(newDocumentPathSplit);

                // make sure the new folder exists
                const folder: CdmFolderDefinition = await this.ctx.corpus.fetchObjectAsync<CdmFolderDefinition>(newDocumentPath);
                if (folder === undefined) {
                    Logger.error(this.ctx, this._TAG, this.createResolvedManifestAsync.name, this.atCorpusPath, cdmLogCode.ErrResolveFolderNotFound, newDocumentPath);
                    return undefined;
                }

                // Next create the resolved entity
                const withDirectives: AttributeResolutionDirectiveSet = directives !== undefined ? directives :
                    this.ctx.corpus.defaultResolutionDirectives;
                const resOpt: resolveOptions = new resolveOptions(entDef.inDocument, withDirectives?.copy());

                Logger.debug(this.ctx, this._TAG, this.createResolvedManifestAsync.name, this.atCorpusPath, `resolving entity ${sourceEntityFullPath} to document ${newDocumentFullPath}`);

                const resolvedEntity: CdmEntityDefinition =
                    await entDef.createResolvedEntityAsync(entDef.entityName, resOpt, folder, newDocumentName);
                if (resolvedEntity === undefined) {
                    // Fail all resolution, if any one entity resolution fails
                    return undefined;
                }

                const result: CdmEntityDeclarationDefinition = entity.copy(resOpt) as CdmEntityDeclarationDefinition;
                if (result.objectType === cdmObjectType.localEntityDeclarationDef) {
                    result.entityPath =
                        this.ctx.corpus.storage.createRelativeCorpusPath(resolvedEntity.atCorpusPath, resolvedManifest)
                        || result.atCorpusPath;
                }
                resolvedManifest.entities.push(result);
            }

            Logger.debug(this.ctx, this._TAG, this.createResolvedManifestAsync.name, this.atCorpusPath, `calculating relationships`);

            // calculate the entity graph for this manifest and any submanifests
            await this.ctx.corpus.calculateEntityGraphAsync(resolvedManifest);
            // stick results into the relationships list for the manifest
            // only put in relationships that are between the entities that are used in the manifest
            await resolvedManifest.populateManifestRelationshipsAsync(cdmRelationshipDiscoveryStyle.exclusive);

            // needed until Matt's changes with collections where I can propigate
            resolvedManifest.isDirty = true;

            return resolvedManifest as unknown as CdmManifestDefinition;
        });
    }

    public async populateManifestRelationshipsAsync(option: cdmRelationshipDiscoveryStyle = cdmRelationshipDiscoveryStyle.all): Promise<void> {
        return await using(enterScope(CdmManifestDefinition.name, this.ctx, this.populateManifestRelationshipsAsync.name), async _ => {
            this.relationships.clear();
            const relCache: Set<string> = new Set<string>();

            for (const entDec of this.entities) {
                const entPath: string = await this.getEntityPathFromDeclaration(entDec, this);
                const currEntity: CdmEntityDefinition = await this.ctx.corpus.fetchObjectAsync<CdmEntityDefinition>(entPath);

                if (!currEntity) {
                    continue;
                }

                // handle the outgoing relationships
                const outgoingRels: CdmE2ERelationship[] = this.ctx.corpus.fetchOutgoingRelationships(currEntity);
                if (outgoingRels) {
                    for (const rel of outgoingRels) {
                        const cacheKey: string = rel.createCacheKey();
                        if (!relCache.has(cacheKey) && this.isRelAllowed(rel, option)) {
                            this.relationships.push(this.localizeRelToManifest(rel));
                            this.addImportsForElevatedTraits(rel);
                            relCache.add(cacheKey);
                        }
                    }
                }

                const incomingRels: CdmE2ERelationship[] =
                    (this.ctx.corpus).fetchIncomingRelationships(currEntity);

                if (incomingRels) {
                    for (const inRel of incomingRels) {
                        // get entity object for current toEntity
                        let currentInBase: CdmEntityDefinition =
                            await this.ctx.corpus.fetchObjectAsync<CdmEntityDefinition>(inRel.toEntity, this);

                        if (!currentInBase) {
                            continue;
                        }

                        // create graph of inheritance for to currentInBase
                        // graph represented by an array where entity at i extends entity at i+1
                        const toInheritanceGraph: CdmEntityDefinition[] = [];
                        while (currentInBase) {
                            const resOpt: resolveOptions = new resolveOptions(currentInBase.inDocument);
                            currentInBase = currentInBase.extendsEntity ? currentInBase.extendsEntity.fetchObjectDefinition(resOpt) : undefined;

                            if (currentInBase) {
                                toInheritanceGraph.push(currentInBase);
                            }
                        }

                        // add current incoming relationship
                        const cacheKey: string = inRel.createCacheKey();
                        if (!relCache.has(cacheKey) && this.isRelAllowed(inRel, option)) {
                            this.relationships.push(this.localizeRelToManifest(inRel));
                            this.addImportsForElevatedTraits(inRel);
                            relCache.add(cacheKey);
                        }

                        // if A points at B, A's base classes must point at B as well
                        for (const baseEntity of toInheritanceGraph) {
                            const incomingRelsForBase: CdmE2ERelationship[] =
                                this.ctx.corpus.fetchIncomingRelationships(baseEntity);

                            if (incomingRelsForBase) {
                                for (const inRelBase of incomingRelsForBase) {
                                    const newRel: CdmE2ERelationship = new CdmE2ERelationship(this.ctx, '');
                                    newRel.fromEntity = inRelBase.fromEntity;
                                    newRel.fromEntityAttribute = inRelBase.fromEntityAttribute;
                                    newRel.toEntity = inRel.toEntity;
                                    newRel.toEntityAttribute = inRel.toEntityAttribute;

                                    const baseRelCacheKey: string = newRel.createCacheKey();
                                    if (!relCache.has(baseRelCacheKey) && this.isRelAllowed(newRel, option)) {
                                        this.relationships.push(this.localizeRelToManifest(newRel));
                                        this.addImportsForElevatedTraits(newRel);
                                        relCache.add(baseRelCacheKey);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (const subManifestDef of this.subManifests) {
                const corpusPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(subManifestDef.definition, this);
                const subManifest: CdmManifestDefinition = await this.ctx.corpus.fetchObjectAsync<CdmManifestDefinition>(corpusPath);
                await (subManifest as unknown as CdmManifestDefinition).populateManifestRelationshipsAsync(option);
            }
        });
    }

    /**
     * @inheritdoc
     */
    public async fileStatusCheckAsync(): Promise<void> {
        return await using(enterScope(CdmManifestDefinition.name, this.ctx, this.fileStatusCheckAsync.name), async _ => {
            let adapter: StorageAdapterBase = this.ctx.corpus.storage.fetchAdapter(this.inDocument.namespace);
            let cacheContext: StorageAdapterCacheContext = (adapter != null) ? adapter.createFileQueryCacheContext() : null;
            try {
                const modifiedTime: Date = await (this.ctx.corpus).getLastModifiedTimeFromObjectAsync(this);

                this.lastFileStatusCheckTime = new Date();
                if (!this.lastFileModifiedTime) {
                    this.lastFileModifiedTime = this._fileSystemModifiedTime;
                }

                // reload the manifest if it has been updated in the file system
                if (modifiedTime && this._fileSystemModifiedTime && modifiedTime.getTime() !== this._fileSystemModifiedTime.getTime()) {
                    await this.reload();
                    this.lastFileModifiedTime = timeUtils.maxTime(modifiedTime, this.lastFileModifiedTime);
                    this._fileSystemModifiedTime = this.lastFileModifiedTime;
                }

                for (const entity of this.entities) {
                    await entity.fileStatusCheckAsync();
                }

                for (const subManifest of this.subManifests) {
                    await subManifest.fileStatusCheckAsync();
                }
            }
            finally {
                if (cacheContext != null) {
                    cacheContext.dispose()
                }
            }
        });
    }

    /**
     * @inheritdoc
     */
    public async reportMostRecentTimeAsync(childTime: Date): Promise<void> {
        if (childTime) {
            this.lastChildFileModifiedTime = timeUtils.maxTime(childTime, this.lastChildFileModifiedTime);
        }
    }

    /**
     * @internal
     * Helper that fixes a path from local to absolute, gets the object from that path
     * then looks at the document where the object is found.
     * If dirty, the document is saved with the original name.
     */
    public async saveDirtyLink(relative: string, options: copyOptions): Promise<boolean> {
        // get the document object from the import
        const docPath = this.ctx.corpus.storage.createAbsoluteCorpusPath(relative, this);
        if (!docPath) {
            Logger.error(this.ctx, this._TAG, this.saveDirtyLink.name, this.atCorpusPath, cdmLogCode.ErrValdnInvalidCorpusPath, relative);
            return false;
        }
        const objAt: CdmObject = await this.ctx.corpus.fetchObjectAsync(docPath);
        if (!objAt) {
            Logger.error(this.ctx, this._TAG, this.saveDirtyLink.name, this.atCorpusPath, cdmLogCode.ErrPersistObjectNotFound, docPath);
            return false;
        }
        const docImp: CdmDocumentDefinition = objAt.inDocument;

        if (docImp !== undefined) {
            if (docImp.isDirty) {
                // save it with the same name
                if (await docImp.saveAsAsync(docImp.name, true, options) === false) {
                    Logger.error(this.ctx, this._TAG, this.saveDirtyLink.name, docImp.atCorpusPath, cdmLogCode.ErrDocEntityDocSavingFailure, docImp.name);
                }
            }
        }

        return true;
    }

    /**
     * @internal
     * Helper that fixes a path from local to absolute.Gets the object from that path.
     * Created from saveDirtyLink in order to be able to save docs in parallel.
     * Represents the part of saveDirtyLink that could not be parallelized.
     */
    public async fetchDocumentDefinition(relativePath: string): Promise<CdmDocumentDefinition> {
        // get the document object from the import
        const docPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(relativePath, this);
        if (!docPath) {
            Logger.error(this.ctx, this._TAG, this.fetchDocumentDefinition.name, this.atCorpusPath, cdmLogCode.ErrValdnInvalidCorpusPath, relativePath);
            return undefined;
        }

        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;
        const objAt: CdmObject = await this.ctx.corpus.fetchObjectAsync(relativePath, this, resOpt);
        if (!objAt) {
            Logger.error(this.ctx, this._TAG, this.fetchDocumentDefinition.name, this.atCorpusPath, cdmLogCode.ErrPersistObjectNotFound, docPath);
            return undefined;
        }
        return objAt.inDocument;
    }

    /**
     * @internal
     * Saves CdmDocumentDefinition if dirty.
     * Was created from SaveDirtyLink in order to be able to save docs in parallel.
     * Represents the part of SaveDirtyLink that could be parallelized.
     */
    public async saveDocumentIfDirty(docImp: CdmDocumentDefinition, options: copyOptions): Promise<boolean> {
        // get the document object from the import
        if (docImp !== undefined && docImp.isDirty) {
            // save it with the same name
            if (await docImp.saveAsAsync(docImp.name, true, options) === false) {
                Logger.error(this.ctx, this._TAG, this.saveDocumentIfDirty.name, docImp.atCorpusPath, cdmLogCode.ErrDocEntityDocSavingFailure, docImp.name);
                return false;
            }
        }
        return true;
    }


    /**
     * @internal
     */
    public async saveLinkedDocuments(options?: copyOptions): Promise<boolean> {
        let links: Set<string> = new Set<string>();
        if (!options) {
            options = new copyOptions();
        }
        if (this.imports !== undefined) {
            for (const imp of this.imports) {
                links.add(imp.corpusPath);
            }
        }
        if (this.entities !== undefined) {
            // only the local entity declarations please
            for (const def of this.entities) {
                if (isLocalEntityDeclarationDefinition(def)) {
                    const defImp: CdmLocalEntityDeclarationDefinition = def;
                    links.add(defImp.entityPath);

                    // also, partitions can have their own schemas
                    if (defImp.dataPartitions !== undefined) {
                        for (const part of defImp.dataPartitions) {
                            if (part.specializedSchema !== undefined) {
                                links.add(part.specializedSchema);
                            }
                        }
                    }
                    // so can patterns
                    if (defImp.dataPartitionPatterns !== undefined) {
                        for (const part of defImp.dataPartitionPatterns) {
                            if (part.specializedSchema !== undefined) {
                                links.add(part.specializedSchema);
                            }
                        }
                    }
                }
            }
        }

        const docs: CdmDocumentDefinition[] = [];
        for (var link of links) {
            const doc: CdmDocumentDefinition = await this.fetchDocumentDefinition(link);
            if (!doc) {
                return false;
            }
            docs.push(doc);
        }

        await Promise.all(docs.map(async (doc: CdmDocumentDefinition) => {
            if (doc) {
                if (!await this.saveDocumentIfDirty(doc, options)) {
                    return false;
                }
            }
        }));

        if (this.subManifests !== undefined) {
            for (const subDeclaration of this.subManifests) {
                const subManifest: CdmManifestDefinition  = await this.fetchDocumentDefinition(subDeclaration.definition) as CdmManifestDefinition;
                if (!subManifest || !await this.saveDocumentIfDirty(subManifest, options)) {
                    return false;
                }
            }
        }

        return true;
    }


    /**
     * @internal
     */
    public async getEntityPathFromDeclaration(entityDec: CdmEntityDeclarationDefinition, obj?: CdmObject): Promise<string> {
        // keep following referenceEntityDeclaration paths until a LocalentityDeclaration is hit
        while (isReferencedEntityDeclarationDefinition(entityDec)) {
            const currCorpusPath: string =
                this.ctx.corpus.storage.createAbsoluteCorpusPath(entityDec.entityPath, obj);
            entityDec = await this.ctx.corpus.fetchObjectAsync<CdmEntityDeclarationDefinition>(currCorpusPath);
            if (!entityDec) {
                return undefined;
            }
            obj = entityDec.inDocument;
        }

        return entityDec ?
            this.ctx.corpus.storage.createAbsoluteCorpusPath(entityDec.entityPath, obj)
            : undefined;
    }

    /**
     * Query the manifest for a set of entities that match an input query
     * querySpec = a JSON object (or a string that can be parsed into one) of the form
     * {"entityName":"", "attributes":[{see QueryOnTraits for CdmEntityDefinition for details}]}
     * returns null for 0 results or an array of json objects, each matching the shape of the input query,
     * with entity and attribute names filled in
     */
    private async queryOnTraitsAsync(querySpec: (string | object)): Promise<object[]> {
        return undefined;
    }

    private localizeRelToManifest(rel: CdmE2ERelationship): CdmE2ERelationship {
        const relCopy: CdmE2ERelationship = this.ctx.corpus.MakeObject<CdmE2ERelationship>(cdmObjectType.e2eRelationshipDef, rel.name);
        relCopy.toEntity = this.ctx.corpus.storage.createRelativeCorpusPath(rel.toEntity, this);
        relCopy.fromEntity = this.ctx.corpus.storage.createRelativeCorpusPath(rel.fromEntity, this);
        relCopy.toEntityAttribute = rel.toEntityAttribute;
        relCopy.fromEntityAttribute = rel.fromEntityAttribute;
        relCopy.exhibitsTraits.concat(rel.exhibitsTraits.allItems);

        return relCopy;
    }

    private isRelAllowed(rel: CdmE2ERelationship, option: cdmRelationshipDiscoveryStyle): boolean {
        if (option === cdmRelationshipDiscoveryStyle.none) {
            return false;
        } else if (option === cdmRelationshipDiscoveryStyle.exclusive) {
            // only true if from and to entities are both found in the entities list of this manifest
            const absoluteFromEntString: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(rel.fromEntity, this);
            const fromEntInManifest: boolean = this.entities.allItems.filter(
                (x: CdmEntityDeclarationDefinition) => {
                    return this.ctx.corpus.storage.createAbsoluteCorpusPath(x.entityPath, this) === absoluteFromEntString;
                }).length > 0;

            const absoluteToEntString: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(rel.toEntity, this);
            const toEntInManifest: boolean = this.entities.allItems.filter(
                (x: CdmEntityDeclarationDefinition) => {
                    return this.ctx.corpus.storage.createAbsoluteCorpusPath(x.entityPath, this) === absoluteToEntString;
                }).length > 0;

            return fromEntInManifest && toEntInManifest;
        } else {
            return true;
        }
    }

    
    /**
     * Adding imports for elevated purpose traits for relationships.
     * The last import has the highest priority, so we add insert the imports for traits to the beginning of the list.
     */
    private addImportsForElevatedTraits(rel: CdmE2ERelationship): void {
        for (const path of rel.getElevatedTraitCorpusPaths()) {
            const relativePath: string = this.ctx.corpus.storage.createRelativeCorpusPath(path, this);
            if (this.imports.item(relativePath, null, false) === undefined) {
                this.imports.insert(0, new CdmImport(this.ctx, relativePath, undefined));
            }
        }
    }

}
