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
    CdmManifestDefinition,
    cdmLogCode,
    CdmObject,
    cdmObjectType,
    copyOptions,
    Logger,
    resolveOptions,
    StorageAdapterBase,
} from '../internal';
import { DocumentPersistence } from './CdmFolder/DocumentPersistence';
import { IPersistence } from './Common/IPersistence';

const PersistenceTypes = {
    CdmFolder,
    ModelJson
};

export class PersistenceLayer {
    private TAG: string = PersistenceLayer.name;

    public static cdmFolder: string = 'CdmFolder';
    public static modelJson: string = 'ModelJson';
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
        const adapter: StorageAdapterBase = this.corpus.storage.fetchAdapter(folder.namespace);

        try {
            if (adapter.canRead()) {
                // log message used by navigator, do not change or remove
                Logger.debug(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, docPath, `request file: ${docPath}`);
                jsonData = await adapter.readAsync(docPath);
                // log message used by navigator, do not change or remove
                Logger.debug(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, docPath, `received file: ${docPath}`);
            } else {
                throw new Error('Storage Adapter is not enabled to read.');
            }
        } catch (e) {
            // log message used by navigator, do not change or remove
            Logger.debug(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, docPath, `fail file: ${docPath}`);

            // When shallow validation is enabled, log messages about being unable to find referenced documents as warnings instead of errors.
            if (resOpt && resOpt.shallowValidation) {
                Logger.warning(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, docPath, cdmLogCode.WarnPersistFileReadFailure, docPath, folder.namespace, e);
            } else {
                Logger.error(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, docPath, cdmLogCode.ErrPersistFileReadFailure, docPath, folder.namespace, e);
            }

            return undefined;
        }

        try {
            fsModifiedTime = await adapter.computeLastModifiedTimeAsync(docPath);
        } catch (e) {
            Logger.warning(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, docPath, cdmLogCode.WarnPersistFileModTimeFailure, e);
        }

        if (!docName) {
            Logger.error(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, docPath, cdmLogCode.ErrPersistNullDocName);
            return undefined;
        }

        // If loading an model.json file, check that it is named correctly.
        if (docName.toLowerCase().endsWith(CdmConstants.modelJsonExtension) &&
            docName.toLowerCase() !== CdmConstants.modelJsonExtension) {
            Logger.error(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, docPath, cdmLogCode.ErrPersistDocNameLoadFailure, docName, CdmConstants.modelJsonExtension);
            return undefined;
        }

        const docNameInLowCase: string = docName.toLowerCase();

        try {
            // Check file extensions, which performs a case-insensitive ordinal string comparison
            if (docNameInLowCase.endsWith(CdmConstants.folioExtension) ||
                docNameInLowCase.endsWith(CdmConstants.manifestExtension)) {
                docContent = CdmFolder.ManifestPersistence.fromObject(
                    this.ctx,
                    docName,
                    folder.namespace,
                    folder.folderPath,
                    JSON.parse(jsonData)
                ) as unknown as CdmDocumentDefinition;
            } else if (docNameInLowCase.endsWith(CdmConstants.modelJsonExtension)) {
                docContent = await ModelJson.ManifestPersistence.fromObject(
                    this.ctx,
                    JSON.parse(jsonData),
                    folder
                ) as unknown as CdmDocumentDefinition;
            } else if (docNameInLowCase.endsWith(CdmConstants.cdmExtension)) {
                docContent = DocumentPersistence.fromObject(this.ctx, docName, folder.namespace, folder.folderPath, JSON.parse(jsonData));
            } else {
                // Could not find a registered persistence class to handle this document type.
                Logger.error(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, docPath, cdmLogCode.ErrPersistClassMissing, docName);
                return undefined;
            }
        } catch (e) {
            // Could not find a registered persistence class to handle this document type.
            Logger.error(this.ctx, this.TAG, this.LoadDocumentFromPathAsync.name, null, cdmLogCode.ErrPersistDocConversionFailure, docName, e.message);
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
        const adapter: StorageAdapterBase = this.corpus.storage.fetchAdapter(ns);
        if (adapter === undefined) {
            Logger.error(this.ctx, this.TAG, this.saveDocumentAsAsync.name, doc.atCorpusPath, cdmLogCode.ErrPersistAdapterNotFoundForNamespace, ns);
            return false;
        } else if (adapter.canWrite() === false) {
            Logger.error(this.ctx, this.TAG, this.saveDocumentAsAsync.name, doc.atCorpusPath, cdmLogCode.ErrPersistAdapterWriteFailure, ns);
            return false;
        } else {
            if (!newName) {
                Logger.error(this.ctx, this.TAG, this.saveDocumentAsAsync.name, doc.atCorpusPath, cdmLogCode.ErrPersistNullDocName);
                return false;
            }

            // What kind of document is requested?
            // Check file extensions using a case-insensitive ordinal string comparison.
            const newNameInLowCase: string = newName.toLowerCase();
            const persistenceType: string =
                newNameInLowCase.endsWith(CdmConstants.modelJsonExtension) ? PersistenceLayer.modelJson : PersistenceLayer.cdmFolder;

            if (persistenceType === PersistenceLayer.modelJson && newNameInLowCase !== CdmConstants.modelJsonExtension) {
                Logger.error(this.ctx, this.TAG, this.saveDocumentAsAsync.name, doc.atCorpusPath, cdmLogCode.ErrPersistFailure, newName, CdmConstants.modelJsonExtension);
                return false;
            }

            // save the object into a json blob
            const resOpt: resolveOptions = new resolveOptions(doc, new AttributeResolutionDirectiveSet());
            let persistedDoc: object;
            if (newNameInLowCase.endsWith(CdmConstants.modelJsonExtension) ||
                newNameInLowCase.endsWith(CdmConstants.manifestExtension)
                || newNameInLowCase.endsWith(CdmConstants.folioExtension)) {
                if (persistenceType === 'CdmFolder') {
                    persistedDoc = CdmFolder.ManifestPersistence.toData(doc as CdmManifestDefinition, resOpt, options);
                } else {
                    if (newNameInLowCase !== CdmConstants.modelJsonExtension) {
                        Logger.error(this.ctx, this.TAG, this.saveDocumentAsAsync.name, doc.atCorpusPath, cdmLogCode.ErrPersistFailure, newName);
                        return false;
                    }
                    persistedDoc = await ModelJson.ManifestPersistence.toData(doc as CdmManifestDefinition, resOpt, options);
                }
            } else if (newNameInLowCase.endsWith(CdmConstants.cdmExtension)) {
                persistedDoc = CdmFolder.DocumentPersistence.toData(doc as CdmManifestDefinition, resOpt, options);
            } else {
                // Could not find a registered persistence class to handle this document type.
                Logger.error(this.ctx, this.TAG, this.saveDocumentAsAsync.name, doc.atCorpusPath, cdmLogCode.ErrPersistClassMissing, newName);
                return false;
            }

            if (!persistedDoc) {
                Logger.error(this.ctx, this.TAG, this.saveDocumentAsAsync.name, doc.atCorpusPath, cdmLogCode.ErrPersistFilePersistFailed, newName);
                return false;
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

                doc._fileSystemModifiedTime = await adapter.computeLastModifiedTimeAsync(newPath);

                // write the adapter's config.
                if (options.isTopLevelDocument) {
                    await this.corpus.storage.saveAdaptersConfigAsync('/config.json', adapter);

                    // the next documentwon't be top level, so reset the flag
                    options.isTopLevelDocument = false;
                }
            } catch (e) {
                Logger.error(this.ctx, this.TAG, this.saveDocumentAsAsync.name, doc.atCorpusPath, cdmLogCode.ErrPersistFilePersistError, newName, e);
            }

            // if we also want to save referenced docs, then it depends on what kind of thing just got saved
            // if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
            // definition will save imports, manifests will save imports, schemas, sub manifests
            if (saveReferenced && persistenceType === PersistenceLayer.cdmFolder) {
                if (!await doc.saveLinkedDocuments(options)) {
                    Logger.error(this.ctx, this.TAG, this.saveDocumentAsAsync.name, doc.atCorpusPath, cdmLogCode.ErrPersistSaveLinkedDocs, newName);
                    }
            }
            return true;
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
