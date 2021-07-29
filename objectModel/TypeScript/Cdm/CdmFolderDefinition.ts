// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
    cdmLogCode,
    Logger,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    StorageAdapter,
    StringUtils,
    VisitCallback
} from '../internal';

/**
 * The object model implementation for Folder object.
 */
export class CdmFolderDefinition extends CdmObjectDefinitionBase {
    private TAG: string = CdmFolderDefinition.name;

    /**
     * @inheritdoc
     */
    public name: string;

    /**
     * @inheritdoc
     */
    public get folderPath(): string {
        return this._folderPath;
    }

    /**
     * @inheritdoc
     * @internal
     */
    public set folderPath(value: string) {
        this._folderPath = value;
    }

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
    public get namespace(): string {
        return this._namespace;
    }

    /**
     * @inheritdoc
     * @internal
     */
    public set namespace(value: string) {
        this._namespace = value;
    }

    /**
     * @inheritdoc
     */
    public objectType: cdmObjectType;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.folderDef;
    }

    private _folderPath: string;
    private _namespace: string;

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
        if (!this.name) {
            let missingFields: string[] = ['name'];
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
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
    public fetchChildFolderFromPath(path: string, makeFolder: boolean = true): CdmFolderDefinition {
        let name: string;
        let remainingPath: string = path;
        let childFolder: CdmFolderDefinition = this;

        while (childFolder && remainingPath.indexOf('/') != -1) {
            let first: number = remainingPath.indexOf('/');
            name = remainingPath.slice(0, first);
            remainingPath = remainingPath.slice(first + 1);

            if (name.toLowerCase() !== childFolder.name.toLowerCase()) {
                Logger.error(this.ctx, this.TAG, this.fetchChildFolderFromPath.name, null, cdmLogCode.ErrInvalidPath);
                return undefined;
            }

            // the end?
            if (remainingPath === '') {
                return childFolder;
            }

            first = remainingPath.indexOf('/')
            let childFolderName: string = remainingPath
            if (first != -1) {
                childFolderName = remainingPath.slice(0, first);
            } else {
                // the last part of the path will be considered part of the part depending on the make_folder flag.
                break
            }

            // check children folders
            let result: CdmFolderDefinition;
            if (childFolder.childFolders) {
                for (const folder of childFolder.childFolders) {
                    if (childFolderName.toLowerCase() == folder.name.toLowerCase()) {
                        result = folder;
                        break;
                    }
                }
            }

            if (!result) {
                result = childFolder.childFolders.push(childFolderName);
            }

            childFolder = result;
        }

        if (makeFolder) {
            childFolder = childFolder.childFolders.push(remainingPath);
        }

        return childFolder;
    }

    /**
     * @internal
     * @inheritdoc
     */
    public async fetchDocumentFromFolderPathAsync(
        objectPath: string,
        adapter: StorageAdapter,
        forceReload: boolean = false,
        resOpt: resolveOptions = null): Promise<CdmDocumentDefinition> {
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
                Logger.warning(this.ctx, this.TAG, this.fetchDocumentFromFolderPathAsync.name, null, cdmLogCode.WarnDocChangesDiscarded, doc.name);
            }
            this.documents.remove(docName);
        }

        // go get the doc
        doc = await this.corpus.persistence.LoadDocumentFromPathAsync(this, docName, doc, resOpt);

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
        return undefined;
    }

    /**
     * @inheritdoc
     * @internal
     */
    public fetchResolvedTraits(resOpt?: resolveOptions): ResolvedTraitSet {
        return undefined;
    }

    /**
     * @inheritdoc
     * @internal
     */
    public fetchResolvedAttributes(): ResolvedAttributeSet {
        return undefined;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        return undefined;
    }
}
