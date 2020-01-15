import {
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentCollection,
    CdmDocumentDefinition,
    CdmFolderCollection,
    CdmObject,
    CdmObjectDefinition,
    CdmObjectDefinitionBase,
    cdmObjectType,
    Logger,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    StorageAdapter,
    VisitCallback
} from '../internal';

/**
 * The object model implementation for Folder object.
 */
export class CdmFolderDefinition extends CdmObjectDefinitionBase {
    /**
     * @inheritdoc
     */
    public name: string;

    /**
     * @inheritdoc
     */
    public folderPath: string;

    /**
     * @inheritdoc
     */
    public childFolders?: CdmFolderCollection;

    /**
     * @inheritdoc
     */
    public documents?: CdmDocumentCollection;

    /**
     * @internal
     * The corpus object this folder is a part of.
     */
    public corpus: CdmCorpusDefinition;

    /**
     * @inheritdoc
     * @internal
     */
    public documentLookup: Map<string, CdmDocumentDefinition>;

    /**
     * @inheritdoc
     */
    public namespace: string;

    /**
     * @inheritdoc
     */
    public objectType: cdmObjectType;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.folderDef;
    }

    /**
     * Initializes a new instance of theFolderImpl class.
     * @param ctx The context.
     * @param name The name.
     */
    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        this.name = name;
        this.folderPath = `${name}/`;
        this.childFolders = new CdmFolderCollection(ctx, this);
        this.documents = new CdmDocumentCollection(ctx, this);
        this.documentLookup = new Map<string, CdmDocumentDefinition>();
        this.objectType = cdmObjectType.folderDef;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        return this.name ? true : false;
    }

    /**
     * @inheritdoc
     */
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        return false;
    }

    public get atCorpusPath(): string {
        if (!this.namespace) {
            // We're not under any adapter (not in a corpus), so return special indicator.
            return `NULL:/${this.folderPath}`;
        } else {
            return `${this.namespace}:${this.folderPath}`;
        }
    }

    /**
     * @internal
     * @inheritdoc
     */
    public async fetchChildFolderFromPathAsync(path: string, makeFolder: boolean = true): Promise<CdmFolderDefinition> {
        let name: string;
        let remainingPath: string;
        let first: number = path.indexOf('/', 0);
        if (first < 0) {
            name = path.slice(0);
            remainingPath = '';
        } else {
            name = path.slice(0, first);
            remainingPath = path.slice(first + 1);
        }
        if (name.toLowerCase() === this.name.toLowerCase()) {
            // the end?
            if (remainingPath === '') {
                return this;
            }
            // check children folders
            let result: CdmFolderDefinition;
            if (this.childFolders) {
                for (const f of this.childFolders) {
                    result = await f.fetchChildFolderFromPathAsync(remainingPath, makeFolder);
                    if (result) {
                        break;
                    }
                }
            }
            if (result) {
                return result;
            }

            // get the next folder
            first = remainingPath.indexOf('/', 0);
            name = first > 0 ? remainingPath.slice(0, first) : remainingPath;

            if (first !== -1) {
                const childPath: CdmFolderDefinition = await this.childFolders.push(name)
                    .fetchChildFolderFromPathAsync(remainingPath, makeFolder);
                if (!childPath) {
                    Logger.error(
                        CdmFolderDefinition.name,
                        this.ctx,
                        `Invalid path '${path}'`,
                        this.fetchChildFolderFromPathAsync.name
                    );
                }

                return childPath;
            }

            if (makeFolder) {
                // huh, well need to make the fold here
                return (this.childFolders.push(name))
                    .fetchChildFolderFromPathAsync(remainingPath, makeFolder);
            } else {
                // good enough, return where we got to
                return this;
            }
        }

        return undefined;
    }

    /**
     * @internal
     * @inheritdoc
     */
    public async fetchDocumentFromFolderPathAsync(
        objectPath: string,
        adapter: StorageAdapter,
        forceReload: boolean = false): Promise<CdmDocumentDefinition> {
        let docName: string;
        let remainingPath: string;
        const first: number = objectPath.indexOf('/', 0);
        if (first < 0) {
            remainingPath = '';
            docName = objectPath;
        } else {
            remainingPath = objectPath.slice(first + 1);
            docName = objectPath.substring(0, first);
        }

        // got that doc?
        let doc: CdmDocumentDefinition;
        if (this.documentLookup.has(docName)) {
            doc = this.documentLookup.get(docName);
            if (!forceReload) {
                return doc;
            }

            // remove them from the caches since they will be back in a moment
            if (doc.isDirty) {
                Logger.warning('CdmFolderDefinition', this.ctx, `discarding changes in document: ${doc.name}`);
            }
            this.documents.remove(docName);
        }

        // go get the doc
        doc = await this.corpus.persistence.LoadDocumentFromPathAsync(this, docName, doc);

        return doc;
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.folderDef;
    }

    /**
     * @inheritdoc
     */
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        return false;
    }

    /**
     * @inheritdoc
     */
    public fetchObjectDefinition<T = CdmObjectDefinition>(resOpt?: resolveOptions): T {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        return undefined;
    }

    /**
     * @inheritdoc
     */
    public fetchResolvedTraits(resOpt?: resolveOptions): ResolvedTraitSet {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        return undefined;
    }

    /**
     * @inheritdoc
     */
    public fetchResolvedAttributes(): ResolvedAttributeSet {
        return undefined;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        return undefined;
    }
}
