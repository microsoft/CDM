import {
    CdmFolder,
    ModelJson
} from '.';
import {
    AttributeResolutionDirectiveSet,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmFolderDefinition,
    CdmObject,
    cdmObjectType,
    copyOptions,
    resolveOptions
} from '../internal';
import { StorageAdapter } from '../Storage/StorageAdapter';
import { Logger } from '../Utilities/Logging/Logger';
import { IPersistence } from './Common/IPersistence';
import { fetchModelJsonExtension, fetchOdiExtension } from './extensionFunctions';

const PersistenceTypes = {
    CdmFolder
};

export class PersistenceLayer {
    /**
     * @internal
     */
    public corpus: CdmCorpusDefinition;

    /**
     * @internal
     */
    public ctx: CdmCorpusContext;

    /**
     * @internal
     */
    public cdmFolder: string = 'CdmFolder';

    /**
     * @internal
     */
    public modelJson: string = 'ModelJson';

    /**
     * @internal
     */
    public odi: string = 'Odi';

    // The dictionary of file extension <-> persistence class that handles the file format.
    private readonly registeredPersistenceFormats: Map<string, any>;

    // The dictionary of persistence class <-> whether the persistence class has async methods.
    private readonly isRegisteredPersistenceAsync: Map<any, boolean>;

    /**
     * Constructs a PersistenceLayer and registers persistence classes to load and save known file formats.
     * @param corpus The corpus that owns this persistence layer.
     */
    constructor(corpus: CdmCorpusDefinition) {
        this.corpus = corpus;
        this.ctx = this.corpus.ctx;
        this.registeredPersistenceFormats = new Map<string, any>();
        this.isRegisteredPersistenceAsync = new Map<any, boolean>();

        // Register known persistence classes.
        this.registerFormat(`./CdmFolder/${CdmFolder.ManifestPersistence.name}`);
        this.registerFormat(`./ModelJson/${ModelJson.ManifestPersistence.name}`);
        this.registerFormat(`./CdmFolder/${CdmFolder.DocumentPersistence.name}`);
        // this.registerFormat('./Odi/ManifestPersistence');
    }

    /**
     * @param args arguments passed to the persistence class.
     * @param objectType any of cdmObjectType.
     * @param persistenceType a type supported by the persistence layer. Can by any of PersistenceTypes.
     */
    public static fromData<T extends CdmObject>(...args: any[]): T {
        const persistenceType: string = args.pop() as string;
        const objectType: cdmObjectType = args.pop() as cdmObjectType;
        const persistenceClass: IPersistence = PersistenceLayer.fetchPersistenceClass(objectType, persistenceType);

        return persistenceClass.fromData.apply(this, arguments) as T;
    }

    /**
     * @param instance the instance that is going to be serialized.
     * @param resOpt information about how to resolve the instance.
     * @param persistenceType a type supported by the persistence layer. Can by any of PersistenceTypes.
     * @param options set of options to specify how the output format.
     */
    public static toData<T extends CdmObject, U>(instance: T, resOpt: resolveOptions, options: copyOptions, persistenceType: string): U {
        const objectType: cdmObjectType = instance.objectType;
        const persistenceClass: IPersistence = PersistenceLayer.fetchPersistenceClass(objectType, persistenceType);

        return persistenceClass.toData(instance, resOpt, options);
    }

    public static fetchPersistenceClass(objectType: cdmObjectType, persistenceType: string): IPersistence {
        const persistenceLayer: { [id: string]: IPersistence } = PersistenceTypes[persistenceType] as { [id: string]: IPersistence };
        if (persistenceLayer) {
            let objectName: string = cdmObjectType[objectType];

            // tslint:disable:newline-per-chained-call
            objectName = objectName.charAt(0).toUpperCase() + objectName.slice(1);
            const defString: string = 'Def';
            if (objectName.endsWith(defString)) {
                objectName = objectName.slice(0, (defString.length) * -1);
            } else if (objectName.endsWith('Ref')) {
                objectName += 'erence';
            }
            const persistenceClassName: string = `${objectName}Persistence`;
            const persistenceClass: IPersistence = persistenceLayer[persistenceClassName];
            if (!persistenceClass) {
                throw new Error(`Persistence class ${persistenceClassName} not implemented in type ${persistenceType}.`);
            }

            return persistenceClass;
        } else {
            throw new Error(`Persistence type ${persistenceType} not implemented.`);
        }
    }

    /**
     * @internal
     * Loads a document from the folder path.
     * @param folder The folder that contains the document we want to load.
     * @param docName The document name.
     * @param docContainer The loaded document, if it was previously loaded.
     */
    public async LoadDocumentFromPathAsync(folder: CdmFolderDefinition, docName: string, docContainer: CdmDocumentDefinition): Promise<CdmDocumentDefinition> {
        let docContent: any;
        let jsonData: string;
        let fsModifiedTime: Date;
        const docPath: string = folder.folderPath + docName;
        const adapter: StorageAdapter = this.corpus.storage.fetchAdapter(folder.namespace);

        try {
            if (adapter.canRead()) {
                jsonData = await adapter.readAsync(docPath);
                fsModifiedTime = await adapter.computeLastModifiedTimeAsync(adapter.createAdapterPath(docPath));
                Logger.info(PersistenceLayer.name, this.ctx, `read file: ${docPath}`, this.LoadDocumentFromPathAsync.name);
            }
        } catch (e) {
            Logger.error(
                PersistenceLayer.name,
                this.ctx,
                `Could not read ${docPath} from the '${folder.namespace}' namespace. Reason ${e}`,
                this.LoadDocumentFromPathAsync.name
            );

            return undefined;
        }

        if (!docName) {
            Logger.error(PersistenceLayer.name, this.ctx, 'Document name cannot be null or empty.', this.LoadDocumentFromPathAsync.name);

            return undefined;
        }

        // If loading an odi.json/model.json file, check that it is named correctly.
        if (docName.toLowerCase().endsWith(fetchOdiExtension().toLowerCase()) &&
            docName.toLowerCase() !== fetchOdiExtension().toLowerCase()) {
            Logger.error(PersistenceLayer.name, this.ctx, `Failed to load '${docName}', as it's not an acceptable file name. It must be ${fetchOdiExtension()}.`, this.LoadDocumentFromPathAsync.name);

            return undefined;
        }

        if (docName.toLowerCase().endsWith(fetchModelJsonExtension()) &&
            docName.toLowerCase() !== fetchModelJsonExtension()) {
            Logger.error(PersistenceLayer.name, this.ctx, `Failed to load '${docName}', as it's not an acceptable file name. It must be ${fetchModelJsonExtension()}.`, this.LoadDocumentFromPathAsync.name);

            return undefined;
        }

        // Fetch the correct persistence class to use.
        const persistenceClass: any = this.fetchRegisteredPersistenceFormat(docName);
        if (persistenceClass) {
            try {
                const method = persistenceClass.fromData;
                const parameters: any[] = [this.ctx, docName, jsonData, folder];

                // Check if FromData() is asynchronous for this persistence class.
                if (!this.isRegisteredPersistenceAsync.has(persistenceClass)) {
                    // Cache whether this persistence class has async methods.
                    this.isRegisteredPersistenceAsync.set(persistenceClass, persistenceClass.isPersistenceAsync);
                }

                if (this.isRegisteredPersistenceAsync.get(persistenceClass)) {
                    docContent = await method.apply(this, parameters);
                } else {
                    docContent = method.apply(this, parameters);
                }
            } catch (e) {
                Logger.error(
                    PersistenceLayer.name,
                    this.ctx,
                    `Could not convert \'${docName}\'. Reason \'${e}\'`,
                    this.LoadDocumentFromPathAsync.name);

                return undefined;
            }
        } else {
            // Could not find a registered persistence class to handle this document type.
            Logger.error(
                PersistenceLayer.name,
                this.ctx,
                `Could not find a persistence class to handle the file \'${docName}\'`,
                this.LoadDocumentFromPathAsync.name
            );

            return undefined;
        }

        //Add document to the folder, this sets all the folder/path things,
        // caches name to content association and may trigger indexing on content
        if (docContent) {
            if (docContainer) {
                // there are situations where a previously loaded document must be re-loaded.
                // the end of that chain of work is here where the old version of the document has been removed from
                // the corpus and we have created a new document and loaded it from storage and after this call we will probably
                // add it to the corpus and index it, etc.
                // it would be really rude to just kill that old object and replace it with this replicant, especially because
                // the caller has no idea this happened. so... sigh ... instead of returning the new object return the one that
                // was just killed off but make it contain everything the new document loaded.
                docContent = docContent.copy(new resolveOptions(docContainer), docContainer) as CdmDocumentDefinition;
            }
            folder.documents.push(docContent, docName);

            docContent._fileSystemModifiedTime = fsModifiedTime;
            docContent.isDirty = false;
        }

        return docContent;
    }

    /**
     * @internal
     * a manifest or document can be saved with a new or exisitng name. This function on the corpus does all the actual work
     * because the corpus knows about persistence types and about the storage adapters
     * if saved with the same name, then consider this document 'clean' from changes. if saved with a back compat model or
     * to a different name, then the source object is still 'dirty'
     * an option will cause us to also save any linked documents.
     */
    public async saveDocumentAsAsync(
        doc: CdmDocumentDefinition,
        options: copyOptions,
        newName: string,
        saveReferenced: boolean): Promise<boolean> {
        // find out if the storage adapter is able to write.
        let ns: string = doc.namespace;
        if (ns === undefined) {
            ns = this.corpus.storage.defaultNamespace;
        }
        const adapter: StorageAdapter = this.corpus.storage.fetchAdapter(ns);
        if (adapter === undefined) {
            Logger.error(
                CdmCorpusDefinition.name,
                this.ctx,
                `Couldn't find a storage adapter registered for the namespace '${ns}'`,
                this.saveDocumentAsAsync.name
            );

            return false;
        } else if (adapter.canWrite() === false) {
            Logger.error(
                CdmCorpusDefinition.name,
                this.ctx,
                `The storage adapter '${ns}' claims it is unable to write files.`,
                this.saveDocumentAsAsync.name
            );

            return false;
        } else {
            if (!newName) {
                Logger.error(PersistenceLayer.name, this.ctx, `Document name cannot be null or empty.`, this.saveDocumentAsAsync.name);

                return false;
            }

            // What kind of document is requested?
            // Check file extensions using a case-insensitive ordinal string comparison.
            const newNameInLowCase: string = newName.toLowerCase();
            const persistenceType: string =
                newNameInLowCase.endsWith(fetchModelJsonExtension()) ? this.modelJson :
                    (newNameInLowCase.endsWith(fetchOdiExtension()) ? this.odi : this.cdmFolder);

            if (persistenceType === this.odi && newNameInLowCase !== fetchOdiExtension()) {
                Logger.error(PersistenceLayer.name, this.ctx, `Failed to persist '${newName}', as it's not an acceptable file name. It must be ${fetchOdiExtension()}.`, this.saveDocumentAsAsync.name);

                return false;
            }

            if (persistenceType === this.modelJson && newNameInLowCase !== fetchModelJsonExtension()) {
                Logger.error(PersistenceLayer.name, this.ctx, `Failed to persist '${newName}', as it's not an acceptable file name. It must be ${fetchModelJsonExtension()}.`, this.saveDocumentAsAsync.name);

                return false;
            }

            // save the object into a json blob
            const resOpt: resolveOptions = { wrtDoc: doc, directives: new AttributeResolutionDirectiveSet() };
            let persistedDoc: object;

            // Fetch the correct persistence class to use.
            const persistenceClass = this.fetchRegisteredPersistenceFormat(newName);
            if (persistenceClass) {
                try {
                    const method = persistenceClass.toData;
                    const parameters: object[] = [doc, resOpt, options];

                    // Check if ToData() is asynchronous for this persistence class.
                    if (!this.isRegisteredPersistenceAsync.has(persistenceClass)) {
                        // Cache whether this persistence class has async methods.
                        this.isRegisteredPersistenceAsync.set(persistenceClass, persistenceClass.isPersistenceAsync);
                    }

                    if (this.isRegisteredPersistenceAsync.get(persistenceClass)) {
                        persistedDoc = await method.apply(this, parameters);
                    } else {
                        persistedDoc = method.apply(this, parameters);
                    }
                } catch (e) {
                    Logger.error(
                        PersistenceLayer.name,
                        this.ctx,
                        `Could not persist file '${newName}'. Reason '${e}'.`,
                        this.saveDocumentAsAsync.name
                    );

                    return false;
                }
            } else {
                // Could not find a registered persistence class to handle this document type.
                Logger.error(
                    PersistenceLayer.name,
                    this.ctx,
                    `Could not find a persistence class to handle the file \'${newName}\'.`,
                    this.saveDocumentAsAsync.name
                );

                return false;
            }

            if (!persistedDoc) {
                Logger.error(PersistenceLayer.name, this.ctx, `Failed to persist \'${newName}\'.`, this.saveDocumentAsAsync.name);

                return false;
            }

            if (persistenceType === this.odi) {
                await this.saveOdiDocuments(persistedDoc, adapter, newName);

                return true;
            }

            // turn the name into a path
            let newPath: string = `${doc.folderPath}${newName}`;
            newPath = this.corpus.storage.createAbsoluteCorpusPath(newPath, doc);
            if (newPath.startsWith(`${ns}:`)) {
                newPath = newPath.slice(ns.length + 1);
            }

            // ask the adapter to make it happen
            try {
                const content: string = JSON.stringify(persistedDoc, undefined, 2);
                await adapter.writeAsync(newPath, content);

                // write the adapter's config.
                if (options.isTopLevelDocument) {
                    await this.corpus.storage.saveAdaptersConfigAsync('/config.json', adapter);

                    // the next documentwon't be top level, so reset the flag
                    options.isTopLevelDocument = false;
                }
            } catch (e) {
                Logger.error(
                    PersistenceLayer.name,
                    this.ctx,
                    `Failed to write to the file '${newName}' for reason ${e}`,
                    this.saveDocumentAsAsync.name
                );

                return false;
            }

            // if we also want to save referenced docs, then it depends on what kind of thing just got saved
            // if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
            // definition will save imports, manifests will save imports, schemas, sub manifests
            if (saveReferenced && persistenceType === this.cdmFolder) {
                if (!await doc.saveLinkedDocuments(options)) {
                    Logger.error(
                        PersistenceLayer.name,
                        this.ctx,
                        `Failed to save linked documents for file '${newName}'`,
                        this.saveDocumentAsAsync.name
                    );
                }
            }

            return true;
        }
    }

    /**
     * @internal
     */
    public async saveOdiDocuments(doc: any, adapter: StorageAdapter, newName: string): Promise<void> {
        if (!doc) {
            throw new Error(`Failed to persist document because ${doc.name} is undefined.`);
        }

        // Ask the adapter to make it happen.
        try {
            const oldDocumentPath: string = doc.documentPath;
            const newDocumentPath: string =
                oldDocumentPath.substring(0, oldDocumentPath.length - fetchOdiExtension().length) + newName;
            const content = JSON.stringify(doc, undefined, 2);
            await adapter.writeAsync(newDocumentPath, content);
        } catch (e) {
            Logger.error(
                PersistenceLayer.name,
                this.ctx,
                `Failed to write to the file '${doc.documentPath}' for reason ${e}.`, this.saveOdiDocuments.name
            );
        }

        // Save linked documents.
        if (doc.linkedDocuments !== undefined) {
            for (const linkedDoc of doc.LinkedDocuments) {
                await this.saveOdiDocuments(linkedDoc, adapter, newName);
            }
        }
    }

    public registerFormat(persistenceClassName: string, assemblyName?: string): void {
        try {
            let persistenceClass;
            // this is here to work with webpack for the default classes
            // which cannot import a fully dynamic path
            if (persistenceClassName.startsWith('./')) {
                persistenceClass = require(`./${persistenceClassName.substring(2)}`);
            } else {
                persistenceClass = require(persistenceClassName);
            }
            const className: string = persistenceClassName.split('/').pop();

            if (className) {
                const formats: string[] = persistenceClass[className].formats;

                for (const form of formats) {
                    this.registeredPersistenceFormats.set(form, persistenceClass[className]);
                }
            }
        } catch (e) {
            Logger.info(
                PersistenceLayer.name,
                this.ctx,
                `Unable to register persistence class ${persistenceClassName}. Reason: ${e}.`,
                this.registerFormat.name
            );
        }
    }

    private fetchRegisteredPersistenceFormat(docName: string): any {
        for (const registeredPersistenceFormat of this.registeredPersistenceFormats.entries()) {
            // Find the persistence class to use for this document.
            if (docName.toLowerCase().endsWith(registeredPersistenceFormat[0].toLowerCase())) {
                return registeredPersistenceFormat[1];
            }
        }

        return undefined;
    }
}
