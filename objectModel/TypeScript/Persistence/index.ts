import {
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmFolderDefinition,
    CdmObject,
    cdmObjectType,
    copyOptions,
    resolveOptions
} from '../internal';
import { StorageAdapter } from '../StorageAdapter/StorageAdapter';
import { Logger } from '../Utilities/Logging/Logger';
import * as CdmFolder from './CdmFolder';
import {DocumentPersistence as CdmFolderDocumentPersistence} from './CdmFolder/DocumentPersistence';
import { IPersistence } from './Common/IPersistence';
import * as ModelJson from './ModelJson';

const PersistenceTypes = {
    CdmFolder
};

// tslint:disable:export-name
class PersistenceLayer {
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
            if (objectName.endsWith('Def')) {
                objectName = objectName.slice(0, -3);
            } else if (objectName.endsWith('Ref')) {
                objectName += 'erence';
            }
            const persistenceClassName: string = `${objectName}Persistence`;
            const persistenceClass: IPersistence = persistenceLayer[persistenceClassName];
            if (!persistenceClass) {
                throw new Error(`Persistence class ${persistenceClassName} not implemented in type ${persistenceType} .`);
            }

            return persistenceClass;
        } else {
            throw new Error(`Persistence type ${persistenceType} not implemented.`);
        }
    }

    public static async LoadDocumentFromPathAsync(folder: CdmFolderDefinition, docName: string, docContainer: CdmDocumentDefinition): Promise<CdmDocumentDefinition> {
        let doc: CdmDocumentDefinition;
        let docContent: CdmDocumentDefinition;
        let jsonData: string;
        let jsonObject: any;
        let fsModifiedTime: Date;
        const ctx: CdmCorpusContext = folder.ctx;
        const docPath: string = folder.folderPath + docName;
        const adapter: StorageAdapter = ctx.corpus.storage.fetchAdapter(folder.namespace);

        try {
            if (adapter.canRead()) {
                jsonData = await adapter.readAsync(docPath);
                fsModifiedTime = await adapter.computeLastModifiedTimeAsync(adapter.createAdapterPath(docPath));
                Logger.info('PersistenceLayer', ctx, `read file: ${docPath}`, 'LoadDocumentFromPathAsync');
            }
        } catch (e) {
            Logger.error(
                'PersistenceLayer',
                ctx,
                `Could not read ${docPath} from the '${folder.namespace}' namespace. Reason ${e}`,
                'LoadDocumentFromPathAsync'
            );

            return undefined;
        }

        try {
            jsonObject = JSON.parse(jsonData);
        } catch (e) {
            Logger.error(
                'PersistenceLayer',
                ctx,
                `Could not convert '${docPath}'. Reason ${e}`,
                'LoadDocumentFromPathAsync'
            );

            return undefined;
        }

        const docNameInLowCase: string = docName.toLowerCase();

        if (docNameInLowCase.endsWith(CdmCorpusDefinition.fetchFolioExtension()) ||
            docNameInLowCase.endsWith(CdmCorpusDefinition.fetchManifestExtension())) {
            docContent = CdmFolder.ManifestPersistence.fromData(
                ctx,
                docName,
                folder.namespace,
                folder.folderPath,
                jsonObject
            ) as unknown as CdmDocumentDefinition;
        } else if (docNameInLowCase.endsWith(CdmCorpusDefinition.fetchModelJsonExtension())) {
            if (docNameInLowCase !== CdmCorpusDefinition.fetchModelJsonExtension()) {
                Logger.error(
                    CdmCorpusDefinition.name,
                    ctx,
                    `Failed to load '${docName}', as it's not an acceptable filename. It must be model.json`, 'LoadDocumentFromPathAsync'
                );

                return undefined;
            }

            docContent = await ModelJson.ManifestPersistence.fromData(
                ctx,
                jsonObject,
                folder
            ) as unknown as CdmDocumentDefinition;
        } else {
            docContent = CdmFolderDocumentPersistence.fromData(
                ctx,
                docName,
                folder.namespace,
                folder.folderPath,
                jsonObject
            ) as unknown as CdmDocumentDefinition;
        }

        if (!docContent) {
            Logger.error('CdmFolderDefinition', ctx, `Could not convert ${docPath}.`, 'LoadDocumentFromPathAsync');

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
            doc = folder.documents.push(docContent, docName) as unknown as CdmDocumentDefinition;

            doc._fileSystemModifiedTime = fsModifiedTime;
            doc.isDirty = false;
        }

        return doc;
    }
}

const fromData = PersistenceLayer.fromData;
const toData = PersistenceLayer.toData;
const LoadDocumentFromPathAsync = PersistenceLayer.LoadDocumentFromPathAsync;

export {
    CdmFolder as cdmFolder,
    ModelJson as modelJson,
    fromData,
    toData,
    LoadDocumentFromPathAsync
};
