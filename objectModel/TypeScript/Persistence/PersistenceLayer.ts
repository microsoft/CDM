// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmFolder,
    ModelJson
} from '.';
import {
    AttributeResolutionDirectiveSet,
    CdmConstants,
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
import { StorageUtils } from '../Utilities/StorageUtils';
import { IPersistence } from './Common/IPersistence';

const PersistenceTypes = {
    CdmFolder,
    ModelJson
};

export class PersistenceLayer {
    public static cdmFolder: string = 'CdmFolder';
    public static modelJson: string = 'ModelJson';
    public static odi: string = 'Odi';
    /**
     * @internal
     */
    public corpus: CdmCorpusDefinition;

    /**
     * @internal
     */
    public ctx: CdmCorpusContext;

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
        this.registerFormat(`./${PersistenceLayer.cdmFolder}/${CdmFolder.ManifestPersistence.name}`);
        this.registerFormat(`./${PersistenceLayer.modelJson}/${ModelJson.ManifestPersistence.name}`);
        this.registerFormat(`./${PersistenceLayer.cdmFolder}/${CdmFolder.DocumentPersistence.name}`);
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
     * @param resOpt Optional parameter. The resolve options.
     */
    public async LoadDocumentFromPathAsync(folder: CdmFolderDefinition, docName: string, docContainer: CdmDocumentDefinition, resOpt: resolveOptions = null):
        Promise<CdmDocumentDefinition> {
        let docContent: CdmDocumentDefinition;
        let jsonData: string;
        let fsModifiedTime: Date;
        const docPath: string = folder.folderPath + docName;
        const adapter: StorageAdapter = this.corpus.storage.fetchAdapter(folder.namespace);

        try {
            if (adapter.canRead()) {
                // log message used by navigator, do not change or remove
                Logger.debug('PersistenceLayer', this.ctx, `request file: ${docPath}`, this.LoadDocumentFromPathAsync.name);
                jsonData = await adapter.readAsync(docPath);
                // log message used by navigator, do not change or remove
                Logger.debug(PersistenceLayer.name, this.ctx, `received file: ${docPath}`, this.LoadDocumentFromPathAsync.name);
            } else {
                throw new Error('Storage Adapter is not enabled to read.');
            }
        } catch (e) {
            // log message used by navigator, do not change or remove
            Logger.debug('PersistenceLayer', this.ctx, `fail file: ${docPath}`, this.LoadDocumentFromPathAsync.name);

            const message: string = `Could not read ${docPath} from the '${folder.namespace}' namespace. Reason ${e}`;
            // When shallow validation is enabled, log messages about being unable to find referenced documents as warnings instead of errors.
            if (resOpt && resOpt.shallowValidation) {
                Logger.warning(PersistenceLayer.name, this.ctx, message, this.LoadDocumentFromPathAsync.name);
            } else {
                Logger.error(PersistenceLayer.name, this.ctx, message, this.LoadDocumentFromPathAsync.name);
            }

            return undefined;
        }

        try {
            fsModifiedTime = await adapter.computeLastModifiedTimeAsync(docPath);
        } catch (e) {
            Logger.warning(
                PersistenceLayer.name,
                this.ctx,
                `Failed to compute file last modified time. Reason ${e}`,
                this.LoadDocumentFromPathAsync.name
            );
        }

        if (!docName) {
            Logger.error(PersistenceLayer.name, this.ctx, 'Document name cannot be null or empty.', this.LoadDocumentFromPathAsync.name);

            return undefined;
        }

        // If loading an odi.json/model.json file, check that it is named correctly.
        if (docName.toLowerCase().endsWith(CdmConstants.odiExtension.toLowerCase()) &&
            docName.toLowerCase() !== CdmConstants.odiExtension.toLowerCase()) {
            Logger.error(PersistenceLayer.name, this.ctx, `Failed to load '${docName}', as it's not an acceptable file name. It must be ${CdmConstants.odiExtension}.`, this.LoadDocumentFromPathAsync.name);

            return undefined;
        }

        if (docName.toLowerCase().endsWith(CdmConstants.modelJsonExtension) &&
            docName.toLowerCase() !== CdmConstants.modelJsonExtension) {
            Logger.error(PersistenceLayer.name, this.ctx, `Failed to load '${docName}', as it's not an acceptable file name. It must be ${CdmConstants.modelJsonExtension}.`, this.LoadDocumentFromPathAsync.name);

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
                docContent = docContent.copy(new resolveOptions(docContainer, this.ctx.corpus.defaultResolutionDirectives), docContainer) as CdmDocumentDefinition;
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
                newNameInLowCase.endsWith(CdmConstants.modelJsonExtension) ? PersistenceLayer.modelJson :
                    (newNameInLowCase.endsWith(CdmConstants.odiExtension) ? PersistenceLayer.odi : PersistenceLayer.cdmFolder);

            if (persistenceType === PersistenceLayer.odi && newNameInLowCase !== CdmConstants.odiExtension) {
                Logger.error(CdmConstants.name, this.ctx, `Failed to persist '${newName}', as it's not an acceptable file name. It must be ${CdmConstants.odiExtension}.`, this.saveDocumentAsAsync.name);

                return false;
            }

            if (persistenceType === PersistenceLayer.modelJson && newNameInLowCase !== CdmConstants.modelJsonExtension) {
                Logger.error(CdmConstants.name, this.ctx, `Failed to persist '${newName}', as it's not an acceptable file name. It must be ${CdmConstants.modelJsonExtension}.`, this.saveDocumentAsAsync.name);

                return false;
            }

            // save the object into a json blob
            const resOpt: resolveOptions = new resolveOptions(doc, new AttributeResolutionDirectiveSet());
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

            if (persistenceType === PersistenceLayer.odi) {
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
                const content: string = JSON.stringify(persistedDoc, undefined, 4);
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

            }

            // if we also want to save referenced docs, then it depends on what kind of thing just got saved
            // if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
            // definition will save imports, manifests will save imports, schemas, sub manifests
            if (saveReferenced && persistenceType === PersistenceLayer.cdmFolder) {
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
                oldDocumentPath.substring(0, oldDocumentPath.length - CdmConstants.odiExtension.length) + newName;
            // Remove namespace from path
            const pathTuple: [string, string] = StorageUtils.splitNamespacePath(newDocumentPath);
            if (!pathTuple) {
                Logger.error(PersistenceLayer.name, this.ctx, 'The object path cannot be null or empty.', this.saveOdiDocuments.name);

                return;
            }
            const content = JSON.stringify(doc, undefined, 2);
            await adapter.writeAsync(pathTuple[1], content);
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
