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
    CdmLocalEntityDeclarationDefinition,
    CdmManifestDeclarationDefinition,
    CdmObject,
    cdmObjectType,
    cdmRelationshipDiscoveryStyle,
    CdmTraitCollection,
    copyOptions,
    Logger,
    resolveOptions,
    VisitCallback
} from '../internal';
import { isLocalEntityDeclarationDefinition, isReferencedEntityDeclarationDefinition } from '../Utilities/cdmObjectTypeGuards';
import * as timeUtils from '../Utilities/timeUtils';

const rel2CacheKey = (rel: CdmE2ERelationship): string => {
    return `${rel.toEntity}|${rel.toEntityAttribute}|${rel.fromEntity}|${rel.fromEntityAttribute}`;
};

export class CdmManifestDefinition extends CdmDocumentDefinition implements CdmFileStatus {
    public manifestName: string;
    public readonly subManifests: CdmCollection<CdmManifestDeclarationDefinition>;
    public readonly entities: CdmEntityCollection;
    public readonly relationships: CdmCollection<CdmE2ERelationship>;
    /**
     * @internal
     */
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

    public static get objectType(): cdmObjectType {
        return cdmObjectType.manifestDef;
    }

    public getExplanation(): string {
        return this.explanation;
    }

    public setExplanation(explanation: string): string {
        this.explanation = explanation;

        return this.explanation;
    }

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

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
            copy.entities.push(ent);
        }
        copy.relationships.clear();
        for (const rel of this.relationships) {
            copy.relationships.push(rel);
        }
        copy.subManifests.clear();
        for (const man of this.subManifests) {
            copy.subManifests.push(man);
        }
        copy.exhibitsTraits.clear();
        for (const et of this.exhibitsTraits) {
            copy.exhibitsTraits.push(et);
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
        newEntityDocumentNameFormat: string): Promise<CdmManifestDefinition> {
        if (!this.entities) {
            return undefined;
        }

        if (newEntityDocumentNameFormat === undefined) {
            newEntityDocumentNameFormat = '{f}resolved/{n}.cdm.json';
        } else if (newEntityDocumentNameFormat === '') { // for back compat
            newEntityDocumentNameFormat = '{n}.cdm.json';
        } else if (newEntityDocumentNameFormat.search('{n}') === -1) { // for back compat
            newEntityDocumentNameFormat = `${newEntityDocumentNameFormat}/{n}.cdm.json`;
        }

        const sourceManifestPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(this.atCorpusPath, this);
        const sourceManifestFolderPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(this.folder.atCorpusPath, this);

        const resolvedManifestPathSplit: number = newManifestName.lastIndexOf('/') + 1;
        let resolvedManifestFolder: CdmFolderDefinition;
        if (resolvedManifestPathSplit > 0) {
            const resolvedManifestPath: string = newManifestName.substring(0, resolvedManifestPathSplit);
            const newFolderPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(resolvedManifestPath, this);
            resolvedManifestFolder = await this.ctx.corpus.fetchObjectAsync<CdmFolderDefinition>(newFolderPath);
            if (!resolvedManifestFolder) {
                Logger.error(
                    CdmManifestDefinition.name,
                    this.ctx,
                    `New folder for manifest not found ${newFolderPath}`,
                    'CreateResolvedManifestAsync'
                );

                return undefined;
            }
            newManifestName = newManifestName.substr(resolvedManifestPathSplit, newManifestName.length - resolvedManifestPathSplit);
        } else {
            resolvedManifestFolder = this.owner as CdmFolderDefinition;
        }

        Logger.debug('CdmManifestDefinition', this.ctx, `resolving manifest ${this.manifestName}`, `CreateResolvedManifestAsync`);

        // Using the references present in the resolved entities, get an entity
        // create an imports doc with all the necessary resolved entity references and then resolve it
        const resolvedManifest: CdmManifestDefinition = new CdmManifestDefinition(this.ctx, newManifestName);

        // add the new document to the folder
        if (resolvedManifestFolder.documents.push(resolvedManifest) === undefined) {
            // when would this happen?

            return undefined;
        }

        // mapping from entity path to resolved entity path for translating relationhsip paths
        const resEntMap: Map<string, string> = new Map<string, string>();

        for (const entity of this.entities) {
            const entDef: CdmEntityDefinition = await this.getEntityFromReference(entity, this);

            if (entDef === undefined) {
                Logger.error('CdmManifestDefinition', this.ctx, `Unable to get entity from reference`, 'CreateResolvedManifestAsync');

                return undefined;
            }

            // get the path from this manifest to the source entity. This will be the {f} replacement value
            const sourceEntityFullPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(entDef.inDocument.folder.atCorpusPath, this);
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
                Logger.error(CdmManifestDefinition.name, this.ctx, `new folder not found ${newDocumentPath}`, 'CreateResolvedManifest');

                return undefined;
            }

            // Next create the resolved entity
            const resOpt: resolveOptions = {
                wrtDoc: entDef.inDocument,
                directives: new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly']))
            };

            Logger.debug(
                'CdmManifestDefinition',
                this.ctx,
                `resolving entity ${sourceEntityFullPath} to document {newDocumentFullPath}`,
                'CreateResolvedManifestAsync'
            );

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

            // absolute path is needed for generating relationships
            const absoluteEntPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(result.entityPath, resolvedManifest);
            resEntMap.set(this.ctx.corpus.storage.createAbsoluteCorpusPath(entDef.atCorpusPath, entDef.inDocument), absoluteEntPath);
        }

        // add the new document to the folder
        if (!resolvedManifestFolder.documents.push(resolvedManifest)) {
            // when would this happen?
            return undefined;
        }

        Logger.debug('CdmManifestDefinition', this.ctx, `calculating relationships`, 'CreateResolvedManifestAsync');

        // calculate the entity graph for this manifest and any submanifests
        await this.ctx.corpus._calculateEntityGraphAsync(resolvedManifest as unknown as CdmManifestDefinition, resEntMap);
        // stick results into the relationships list for the manifest
        // only put in relationships that are between the entities that are used in the manifest
        await resolvedManifest.populateManifestRelationshipsAsync(cdmRelationshipDiscoveryStyle.exclusive);

        // needed until Matt's changes with collections where I can propigate
        resolvedManifest.isDirty = true;

        return resolvedManifest as unknown as CdmManifestDefinition;
    }

    public async populateManifestRelationshipsAsync(option: cdmRelationshipDiscoveryStyle = cdmRelationshipDiscoveryStyle.all): Promise<void> {
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
                    const cacheKey: string = rel2CacheKey(rel);
                    if (!relCache.has(cacheKey) && this.isRelAllowed(rel, option)) {
                        this.relationships.push(this.localizeRelToManifest(rel));
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
                        const resOpt: resolveOptions = { wrtDoc: currentInBase.inDocument };
                        currentInBase = currentInBase.extendsEntity ? currentInBase.extendsEntity.fetchObjectDefinition(resOpt) : undefined;

                        if (currentInBase) {
                            toInheritanceGraph.push(currentInBase);
                        }
                    }

                    // add current incoming relationship
                    const cacheKey: string = rel2CacheKey(inRel);
                    if (!relCache.has(cacheKey) && this.isRelAllowed(inRel, option)) {
                        this.relationships.push(this.localizeRelToManifest(inRel));
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

                                const baseRelCacheKey: string = rel2CacheKey(newRel);
                                if (!relCache.has(baseRelCacheKey) && this.isRelAllowed(newRel, option)) {
                                    this.relationships.push(this.localizeRelToManifest(newRel));
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
    }

    // find and return an entity object from an EntityDeclaration object that probably comes from a manifest
    /**
     * @internal
     */
    public async getEntityFromReference(
        entity: CdmEntityDeclarationDefinition,
        manifest: CdmManifestDefinition): Promise<CdmEntityDefinition> {
        const entityPath: string = await this.getEntityPathFromDeclaration(entity, manifest);
        const result: CdmEntityDefinition = await this.ctx.corpus.fetchObjectAsync<CdmEntityDefinition>(entityPath);

        if (result === undefined) {
            Logger.error(CdmManifestDefinition.name, this.ctx, `failed to resolve entity ${entityPath}`, `GetEntityFromReference`);
        }

        return result;
    }

    /**
     * @inheritdoc
     */
    public async fileStatusCheckAsync(): Promise<void> {
        const modifiedTime: Date = await (this.ctx.corpus).getLastModifiedTimeAsyncFromObject(this);

        for (const entity of this.entities) {
            await entity.fileStatusCheckAsync();
        }

        for (const subManifest of this.subManifests) {
            await subManifest.fileStatusCheckAsync();
        }

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
     * Query the manifest for a set of entities that match an input query
     * querySpec = a JSON object (or a string that can be parsed into one) of the form
     * {"entityName":"", "attributes":[{see QueryOnTraits for CdmEntityDefinition for details}]}
     * returns null for 0 results or an array of json objects, each matching the shape of the input query,
     * with entity and attribute names filled in
     */
    /**
     * @internal
     */
    public async queryOnTraitsAsync(querySpec: (string | object)): Promise<object[]> {
        return undefined;
    }

    // helper that fixes a path from local to absolute, gets the object from that path
    // then looks at the document where the object is found.
    // if dirty, the document is saved with the original name
    /**
     * @internal
     */
    public async saveDirtyLink(relative: string, options: copyOptions): Promise<boolean> {
        // get the document object from the import
        const objAt: CdmObject = await this.ctx.corpus.fetchObjectAsync(relative, this);
        if (!objAt) {
            Logger.error(
                'CdmManifestDefinition',
                this.ctx,
                `Could not save document ${relative} because it couldn't be loaded.`,
                'saveDirtyLink'
            );

            return false;
        }
        const docImp: CdmDocumentDefinition = objAt.inDocument;

        if (docImp !== undefined) {
            if (docImp.isDirty) {
                // save it with the same name
                if (await docImp.saveAsAsync(docImp.name, true, options) === false) {
                    Logger.error('CdmManifestDefinition', this.ctx, `failed saving document ${docImp.name}`, 'saveDirtyLink');
                }
            }
        }

        return true;
    }

    public async saveLinkedDocuments(options?: copyOptions): Promise<boolean> {
        if (!options) {
            options = new copyOptions();
        }
        if (this.imports !== undefined) {
            for (const imp of this.imports) {
                if (await this.saveDirtyLink(imp.atCorpusPath, options) === false) {
                    Logger.error(
                        'CdmManifestDefinition',
                        this.ctx,
                        `Failed saving imported document ${imp.atCorpusPath}`,
                        'SaveLinkedDocuments'
                    );
                }
            }
        }
        if (this.entities !== undefined) {
            // only the local entity declarations please
            for (const def of this.entities) {
                if (isLocalEntityDeclarationDefinition(def)) {
                    const defImp: CdmLocalEntityDeclarationDefinition = def;
                    if (await this.saveDirtyLink(defImp.entityPath, options) === false) {
                        Logger.error(
                            'CdmManifestDefinition',
                            this.ctx,
                            `failed saving local entity schema document ${defImp.entityPath}`,
                            'SaveLinkedDocumnets'
                        );

                        return false;
                    }

                    // also, partitions can have their own schemas
                    if (defImp.dataPartitions !== undefined) {
                        for (const part of defImp.dataPartitions) {
                            if (part.specializedSchema !== undefined) {
                                if (await this.saveDirtyLink(part.specializedSchema, options) === false) {
                                    Logger.error(
                                        'CdmManifestDefinition',
                                        this.ctx,
                                        `failed saving local entity schema documnet ${defImp.entityPath}`,
                                        'SaveLinkedDocuments'
                                    );

                                    return false;
                                }
                            }
                        }
                    }
                    // so can patterns
                    if (defImp.dataPartitionPatterns !== undefined) {
                        for (const part of defImp.dataPartitionPatterns) {
                            if (part.specializedSchema !== undefined) {
                                if (await this.saveDirtyLink(part.specializedSchema, options) === false) {
                                    Logger.error(
                                        'CdmManifestDifinition',
                                        this.ctx,
                                        `Failed saving partition shcema document ${part.specializedSchema}`,
                                        'SaveLinkedDocuments'
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
        if (this.subManifests !== undefined) {
            for (const sub of this.subManifests) {
                if (await this.saveDirtyLink(sub.definition, options) === false) {
                    Logger.error(
                        'CdmManifestDefinition',
                        this.ctx,
                        `failed saving sub-manifest document ${sub.definition}`,
                        'LaveLivkedDocuments'
                    );

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

    private localizeRelToManifest(rel: CdmE2ERelationship): CdmE2ERelationship {
        const relCopy: CdmE2ERelationship = this.ctx.corpus.MakeObject<CdmE2ERelationship>(cdmObjectType.e2eRelationshipDef);
        relCopy.toEntity = this.ctx.corpus.storage.createRelativeCorpusPath(rel.toEntity, this);
        relCopy.fromEntity = this.ctx.corpus.storage.createRelativeCorpusPath(rel.fromEntity, this);
        relCopy.toEntityAttribute = rel.toEntityAttribute;
        relCopy.fromEntityAttribute = rel.fromEntityAttribute;

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
}
