import {
    CdmCorpusContext,
    CdmJsonType,
    cdmObjectSimple,
    cdmObjectType,
    copyOptions,
    CorpusImpl,
    DocumentImpl,
    friendlyFormatNode,
    ICdmDocumentDef,
    ICdmFolderDef,
    ICdmObject,
    ICdmObjectDef,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    VisitCallback
} from '../internal';

export class FolderImpl extends cdmObjectSimple implements ICdmFolderDef {
    public name: string;
    public relativePath: string;
    public subFolders?: FolderImpl[];
    public documents?: ICdmDocumentDef[];
    public corpus: CorpusImpl;
    public documentLookup: Map<string, ICdmDocumentDef>;
    public objectType: cdmObjectType;
    constructor(ctx: CdmCorpusContext, corpus: CorpusImpl, name: string, parentPath: string) {
        super(ctx);
        // let bodyCode = () =>
        {

            this.corpus = corpus;
            this.name = name;
            this.relativePath = `${parentPath}${name}/`;
            this.subFolders = [];
            this.documents = [];
            this.documentLookup = new Map<string, ICdmDocumentDef>();
            this.objectType = cdmObjectType.folderDef;
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
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        // return p.measure(bodyCode);
    }
    public getRelativePath(): string {
        // let bodyCode = () =>
        {
            return this.relativePath;
        }
        // return p.measure(bodyCode);
    }
    public getSubFolders(): ICdmFolderDef[] {
        // let bodyCode = () =>
        {
            return this.subFolders;
        }
        // return p.measure(bodyCode);
    }
    public getDocuments(): ICdmDocumentDef[] {
        // let bodyCode = () =>
        {
            return this.documents;
        }
        // return p.measure(bodyCode);
    }

    public addFolder(name: string): ICdmFolderDef {
        // let bodyCode = () =>
        {
            const newFolder: FolderImpl = new FolderImpl(this.ctx, this.corpus, name, this.relativePath);
            this.subFolders.push(newFolder);

            return newFolder;
        }
        // return p.measure(bodyCode);
    }

    public addDocument(name: string, content: string): ICdmDocumentDef {
        // let bodyCode = () =>
        {
            let doc: DocumentImpl;
            if (this.documentLookup.has(name)) {
                return;
            }
            if (content === undefined || content === '') {
                doc = DocumentImpl.instanceFromData(this.ctx, name, this.relativePath, new DocumentImpl(this.ctx, name, false));
            } else if (typeof (content) === 'string') {
                doc = DocumentImpl.instanceFromData(this.ctx, name, this.relativePath, JSON.parse(content));
            } else {
                doc = DocumentImpl.instanceFromData(this.ctx, name, this.relativePath, content);
            }
            doc.folder = this;
            doc.ctx = this.ctx;
            this.documents.push(doc);
            this.corpus.addDocumentObjects(this, doc);
            this.documentLookup.set(name, doc);

            return doc;
        }
        // return p.measure(bodyCode);
    }

    public removeDocument(name: string): void {
        // let bodyCode = () =>
        {
            if (this.documentLookup.has(name)) {
                this.corpus.removeDocumentObjects(this, this.documentLookup.get(name));
                this.documents.splice(this.documents.findIndex((d: ICdmDocumentDef) => d.getName() === name), 1);
                this.documentLookup.delete(name);
            }
        }
        // return p.measure(bodyCode);
    }

    public getSubFolderFromPath(path: string, makeFolder: boolean = true): ICdmFolderDef {
        // let bodyCode = () =>
        {
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
            if (name.toUpperCase() === this.name.toUpperCase()) {
                // the end?
                if (remainingPath.length <= 2) {
                    return this;
                }
                // check children folders
                let result: FolderImpl;
                if (this.subFolders) {
                    this.subFolders.some((f: FolderImpl) => {
                        result = f.getSubFolderFromPath(remainingPath, makeFolder) as FolderImpl;
                        if (result) {
                            return true;
                        }
                    });
                }
                if (result) {
                    return result;
                }

                if (makeFolder) {
                    // huh, well need to make the fold here
                    first = remainingPath.indexOf('/', 0);
                    name = remainingPath.slice(0, first);

                    return this.addFolder(name)
                        .getSubFolderFromPath(remainingPath, makeFolder);
                } else {
                    // good enough, return where we got to
                    return this;
                }
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public getObjectFromFolderPath(objectPath: string): ICdmObject {
        // let bodyCode = () =>
        {

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
            if (this.documentLookup.has(docName)) {
                const doc: ICdmDocumentDef = this.documentLookup.get(docName);
                // all that is needed ?
                if (remainingPath.length < 2) {
                    return doc;
                }

                // doc will resolve it
                return doc.getObjectFromDocumentPath(remainingPath);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.folderDef;
        }
        // return p.measure(bodyCode);
    }
    // required by base but makes no sense... should refactor
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            return false;
        }
        // return p.measure(bodyCode);
    }
    public getObjectDef<T= ICdmObjectDef>(resOpt: resolveOptions): T {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): CdmJsonType {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public getResolvedAttributes(): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }

}
