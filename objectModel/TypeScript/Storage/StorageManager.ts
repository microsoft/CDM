// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { GithubAdapter, LocalAdapter } from '.';
import {
    CdmContainerDefinition,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmFolderDefinition,
    cdmLogCode,
    CdmObject,
    configObjectType,
    StorageAdapterBase
} from '../internal';
import { Logger, enterScope } from '../Utilities/Logging/Logger';
import { StorageUtils } from '../Utilities/StorageUtils';
import { ADLSAdapter } from './ADLSAdapter';
import { CdmStandardsAdapter } from './CdmStandardsAdapter';
import { RemoteAdapter } from './RemoteAdapter';
import { ResourceAdapter } from './ResourceAdapter';
import { using } from "using-statement";

export class StorageManager {
    private TAG: string = StorageManager.name;

    /**
     * @internal
     */
    public readonly corpus: CdmCorpusDefinition;
    // the map of registered namespace <-> adapters.
    public namespaceAdapters: Map<string, StorageAdapterBase>;
    /**
     * @internal
     */
    public namespaceFolders: Map<string, CdmFolderDefinition>;
    public defaultNamespace: string;

    /**
     * Maximum number of documents read concurrently when loading imports.
     */
    public get maxConcurrentReads(): number | undefined {
        return this.corpus.documentLibrary.concurrentReadLock.permits;
    }

    /**
     * Maximum number of documents read concurrently when loading imports.
     */
    public set maxConcurrentReads(value: number | undefined) {
        this.corpus.documentLibrary.concurrentReadLock.permits = value;
    }

    private readonly systemDefinedNamespaces: Set<string>;

    private readonly registeredAdapterTypes: Map<string, any>;

    /**
     * @internal
     */
    public get ctx(): CdmCorpusContext {
        return this.corpus.ctx;
    }

    constructor(corpus: CdmCorpusDefinition) {
        this.corpus = corpus;
        this.namespaceAdapters = new Map<string, StorageAdapterBase>();
        this.namespaceFolders = new Map<string, CdmFolderDefinition>();
        this.systemDefinedNamespaces = new Set<string>();
        this.registeredAdapterTypes = new Map<string, any>([
            ['cdm-standards', CdmStandardsAdapter.prototype],
            ['local', LocalAdapter.prototype],
            ['adls', ADLSAdapter.prototype],
            ['remote', RemoteAdapter.prototype],
            ['github', GithubAdapter.prototype]
        ]);

        // set up default adapters
        this.mount('local', new LocalAdapter(process.cwd()));
        this.mount('cdm', new CdmStandardsAdapter());

        this.systemDefinedNamespaces.add('local');
        this.systemDefinedNamespaces.add('cdm');
    }

    /**
     * Mounts a namespace to the specified adapter
     */
    public mount(namespace: string, adapter: StorageAdapterBase): void {
        return using(enterScope(StorageManager.name, this.ctx, this.mount.name), _ => {
            if (!namespace) {
                Logger.error(this.ctx, this.TAG, this.mount.name, null, cdmLogCode.ErrStorageNullNamespace);
                return;
            }

            if (adapter) {
                adapter.ctx = this.ctx;
                this.namespaceAdapters.set(namespace, adapter);
                const fd: CdmFolderDefinition = new CdmFolderDefinition(this.ctx, '');
                fd.corpus = this.corpus;
                fd.namespace = namespace;
                fd.folderPath = '/';
                this.namespaceFolders.set(namespace, fd);
                this.systemDefinedNamespaces.delete(namespace);
            } else {
                Logger.error(this.ctx, this.TAG, this.mount.name, null, cdmLogCode.ErrStorageNullAdapter);
            }
        });
    }

    /**
     * Mounts the config JSON to the storage manager/corpus.
     * @param adapterConfig The adapters config in JSON.
     * @param adapterOrDoesReturnErrorList A boolean value that denotes whether we want to return a list of adapters that were not found.
     */
    public mountFromConfig(adapterConfig: string, doesReturnErrorList: boolean = false): string[] {
        if (!adapterConfig) {
            Logger.error(this.ctx, this.TAG, this.mountFromConfig.name, null, cdmLogCode.ErrStorageNullAdapterConfig);
            return undefined;
        }

        let adapterConfigJson = JSON.parse(adapterConfig);

        if (adapterConfigJson.appId) {
            this.corpus.appId = adapterConfigJson.appId;
        }

        if (adapterConfigJson.defaultNamespace) {
            this.defaultNamespace = adapterConfigJson.defaultNamespace;
        }

        const unrecognizedAdapters: string[] = [];

        for (const item of adapterConfigJson.adapters) {
            let nameSpace: string;

            // Check whether the namespace exists.
            if (item.namespace) {
                nameSpace = item.namespace;
            } else {
                Logger.error(this.ctx, this.TAG, this.mountFromConfig.name, null, cdmLogCode.ErrStorageMissingNamespace);
                continue;
            }

            let configs;

            // Check whether the config exists.
            if (item.config) {
                configs = item.config;
            } else {
                Logger.error(this.ctx, this.TAG, this.mountFromConfig.name, null, cdmLogCode.ErrStorageMissingJsonConfig, nameSpace);
                continue;
            }

            if (!item.type) {
                Logger.error(this.ctx, this.TAG, this.mountFromConfig.name, null, cdmLogCode.ErrStorageMissingTypeJsonConfig, nameSpace);
                continue;
            }

            const adapterType = this.registeredAdapterTypes.get(item.type);

            if (!adapterType) {
                unrecognizedAdapters.push(item);
            } else {
                const adapter: StorageAdapterBase = new adapterType.constructor();
                adapter.updateConfig(JSON.stringify(configs));
                this.mount(nameSpace, adapter);
            }
        }

        return doesReturnErrorList ? unrecognizedAdapters : undefined;
    }

    /**
     * Unmounts a namespace
     */
    public unMount(nameSpace: string): boolean {
        return using(enterScope(StorageManager.name, this.ctx, this.unMount.name), _ => {
            if (!nameSpace) {
                Logger.error(this.ctx, this.TAG, this.unMount.name, null, cdmLogCode.ErrStorageNullNamespace);
                return false;
            }

            if (this.namespaceAdapters.has(nameSpace)) {
                this.namespaceAdapters.delete(nameSpace);
                this.namespaceFolders.delete(nameSpace);
                this.systemDefinedNamespaces.delete(nameSpace);

                // The special case, use Resource adapter.
                if (nameSpace === 'cdm') {
                    this.mount(nameSpace, new ResourceAdapter());
                }

                return true;
            } else {
                Logger.warning(this.ctx, this.TAG, this.unMount.name, null, cdmLogCode.WarnStorageRemoveAdapterFailed, nameSpace);
            }
        });
    }

    /**
     * @internal
     * Allow replacing a storage adapter with another one for testing, leaving folders intact.
     */
    public setAdapter(nameSpace: string, adapter: StorageAdapterBase): void {
        if (!nameSpace) {
            Logger.error(this.ctx, this.TAG, this.setAdapter.name, null, cdmLogCode.ErrStorageNullNamespace);
            return;
        }
        if (adapter) {
            this.namespaceAdapters.set(nameSpace, adapter);
        } else {
             Logger.error(this.ctx, this.TAG, this.setAdapter.name, null, cdmLogCode.ErrStorageNullAdapter);
        }
    }

    /**
     * Retrieves the adapter for the specified namespace.
     */
    public fetchAdapter(namespace: string): StorageAdapterBase {
        if (!namespace) {
            Logger.error(this.ctx, this.TAG, this.fetchAdapter.name, null, cdmLogCode.ErrStorageNullNamespace);
            return undefined;
        }
        if (this.namespaceFolders.has(namespace)) {
            return this.namespaceAdapters.get(namespace);
        }

        Logger.error(this.ctx, this.TAG, this.fetchAdapter.name, null, cdmLogCode.ErrStorageAdapterNotFound, namespace);
        return undefined;
    }

    /**
     * Given the namespace of a registered storage adapter, returns the root folder containing the sub-folders and documents.
     */
    public fetchRootFolder(namespace: string): CdmFolderDefinition {
        return using(enterScope(StorageManager.name, this.ctx, this.fetchRootFolder.name), _ => {
            if (!namespace) {
                Logger.error(this.ctx, this.TAG, this.fetchRootFolder.name, null, cdmLogCode.ErrStorageNullNamespace);
                return undefined;
            }

            let folder: CdmFolderDefinition;
            if (this.namespaceFolders.has(namespace)) {
                folder = this.namespaceFolders.get(namespace);
            } else if (namespace === 'default') {
                folder = this.namespaceFolders.get(this.defaultNamespace);
            }

            if (!folder) {
                Logger.error(this.ctx, this.TAG, this.fetchRootFolder.name, null, cdmLogCode.ErrStorageAdapterNotFound, namespace);
            }

            return folder;
        });
    }

    /**
     * Takes a storage adapter domain path, figures out the right adapter to use and then returns a corpus path.
     */
    public adapterPathToCorpusPath(adapterPath: string): string {
        return using(enterScope(StorageManager.name, this.ctx, this.adapterPathToCorpusPath.name), _ => {
            let result: string;

            // keep trying adapters until one of them likes what it sees
            if (this.namespaceAdapters) {
                for (const pair of this.namespaceAdapters) {
                    if (result === undefined) {
                        result = pair[1].createCorpusPath(adapterPath);
                        if (result !== undefined) {
                            // got one, add the prefix
                            result = `${pair[0]}:${result}`;
                        }
                    }
                }
            }

            if (result === undefined) {
                Logger.error(this.ctx, this.TAG, this.adapterPathToCorpusPath.name, null, cdmLogCode.ErrStorageInvalidAdapterPath, adapterPath);
            }

            return result;
        });
    }

    /**
     * Takes a corpus path, figures out the right adapter to use and then returns an adapter domain path.
     */
    public corpusPathToAdapterPath(corpusPath: string): string {
        return using(enterScope(StorageManager.name, this.ctx, this.corpusPathToAdapterPath.name), _ => {
            if (!corpusPath) {
                Logger.error(this.ctx, this.TAG, this.corpusPathToAdapterPath.name, null, cdmLogCode.ErrStorageNullCorpusPath);
                return undefined;
            }
            let result: string;
            // break the corpus path into namespace and ... path
            const pathTuple: [string, string] = StorageUtils.splitNamespacePath(corpusPath);
            if (!pathTuple) {
                Logger.error(this.ctx, this.TAG, this.corpusPathToAdapterPath.name, null, cdmLogCode.ErrStorageNullCorpusPath);
                return undefined;
            }
            const namespace: string = pathTuple[0] || this.defaultNamespace;

            // get the adapter registered for this namespace
            const namespaceAdapter: StorageAdapterBase = this.fetchAdapter(namespace);
            if (namespaceAdapter === undefined) {
                Logger.error(this.ctx, this.TAG, this.corpusPathToAdapterPath.name, null, cdmLogCode.ErrStorageNamespaceNotRegistered, namespace);
            } else {
                // ask the storage adapter to 'adapt' this path
                result = namespaceAdapter.createAdapterPath(pathTuple[1]);
            }

            return result;
        });
    }

    public createAbsoluteCorpusPath(objectPath: string, obj?: CdmObject): string {
        return using(enterScope(StorageManager.name, this.ctx, this.createAbsoluteCorpusPath.name), _ => {
            if (!objectPath) {
                Logger.error(this.ctx, this.TAG, this.createAbsoluteCorpusPath.name, null, cdmLogCode.ErrPathNullObjectPath);
                return undefined;
            }

            if (this.containsUnsupportedPathFormat(objectPath)) {
                // already called statusRpt when checking for unsupported path format.
                return;
            }

            const pathTuple: [string, string] = StorageUtils.splitNamespacePath(objectPath);
            if (!pathTuple) {
                Logger.error(this.ctx, this.TAG, this.createAbsoluteCorpusPath.name, null, cdmLogCode.ErrPathNullObjectPath);
                return undefined;
            }
            const nameSpace: string = pathTuple[0];
            let newObjectPath: string = pathTuple[1];
            let finalNamespace: string;

        let prefix: string;
        let namespaceFromObj: string;
        if (obj && (obj as CdmContainerDefinition).namespace && (obj as CdmContainerDefinition).folderPath) {
            prefix = (obj as CdmContainerDefinition).folderPath;
            namespaceFromObj = (obj as CdmContainerDefinition).namespace;
        } else if (obj && obj.inDocument) {
            prefix = obj.inDocument.folderPath;
            namespaceFromObj = obj.inDocument.namespace;
        }

            if (prefix && this.containsUnsupportedPathFormat(prefix)) {
                // already called statusRpt when checking for unsupported path format.
                return;
            }
            if (prefix && prefix.length > 0 && prefix[prefix.length - 1] !== '/') {
                Logger.warning(this.ctx, this.TAG, this.createAbsoluteCorpusPath.name, null, cdmLogCode.WarnStorageExpectedPathPrefix, prefix);
            
                prefix += '/';
            }

            // check if this is a relative path
            if (newObjectPath && newObjectPath.charAt(0) !== '/') {
                if (!obj) {
                    // relative path and no other info given, assume default and root
                    prefix = '/';
                }
                if (nameSpace && nameSpace !== namespaceFromObj) {
                    Logger.error(this.ctx, this.TAG, this.createAbsoluteCorpusPath.name, null, cdmLogCode.ErrStorageNamespaceMismatch, nameSpace);
                    return;
                }
                newObjectPath = `${prefix}${newObjectPath}`;

                finalNamespace = namespaceFromObj || nameSpace || this.defaultNamespace;
            } else {
                finalNamespace = nameSpace || namespaceFromObj || this.defaultNamespace;
            }

            return `${finalNamespace ? `${finalNamespace}:` : ''}${newObjectPath}`;
        });
    }

    /**
     * Takes a corpus path (relative or absolute) and creates a valid relative corpus path with namespace.
     * @param objectPath The path that should be made relative, if possible
     * @param relativeTo The object that the path should be made relative with respect to.
     */
    public createRelativeCorpusPath(objectPath: string, relativeTo?: CdmContainerDefinition): string {
        return using(enterScope(StorageManager.name, this.ctx, this.createRelativeCorpusPath.name), _ => {
            let newPath: string = this.createAbsoluteCorpusPath(objectPath, relativeTo);

            const namespaceString: string = relativeTo ? `${relativeTo.namespace}:` : '';
            if (namespaceString && newPath && newPath.startsWith(namespaceString)) {
                newPath = newPath.slice(namespaceString.length);

                if (newPath.startsWith(relativeTo.folderPath)) {
                    newPath = newPath.slice(relativeTo.folderPath.length);
                }
            }

            return newPath;
        });
    }

    /**
     * @inheritdoc
     */
    public fetchConfig(): string {
        const adaptersArray = [];

        // Construct the JObject for each adapter.
        for (const namespaceAdapterTuple of this.namespaceAdapters) {
            // Skip system-defined adapters and resource adapters.
            if (this.systemDefinedNamespaces.has(namespaceAdapterTuple[0]) || namespaceAdapterTuple[1] instanceof ResourceAdapter) {
                continue;
            }
            const config: string = namespaceAdapterTuple[1].fetchConfig();
            if (!config) {
                Logger.error(this.ctx, this.TAG, this.fetchConfig.name, null, cdmLogCode.ErrStorageNullAdapter);
                continue;
            }

            const jsonConfig = JSON.parse(config);
            jsonConfig.namespace = namespaceAdapterTuple[0];

            adaptersArray.push(jsonConfig);
        }

        const resultConfig: configObjectType = {};

        /// App ID might not be set.
        if (this.corpus.appId) {
            resultConfig.appId = this.corpus.appId;
        }

        resultConfig.defaultNamespace = this.defaultNamespace;
        resultConfig.adapters = adaptersArray;

        return JSON.stringify(resultConfig);
    }

    /**
     * Saves adapters config into a file.
     */
    public async saveAdaptersConfigAsync(name: string, adapter: StorageAdapterBase): Promise<void> {
        await adapter.writeAsync(name, this.fetchConfig());
    }

    /**
     * Checks whether the paths has an unsupported format, such as starting with ./ or containing ../  or  /./
     * In case unsupported path format is found, function calls statusRpt and returns true.
     * Returns false if path seems OK.
     * @param path The path to be checked.
     * @returns True if an unsupported path format was found.
     */
    private containsUnsupportedPathFormat(path: string): boolean {
        let statusMessage: string;
        if (path.startsWith('./') || path.startsWith('.\\')) {
            statusMessage = 'The path starts with ./';
        } else if (path.indexOf('../') !== -1 || path.indexOf('..\\') !== -1) {
            statusMessage = 'The path contains ../';
        } else if (path.indexOf('/./') !== -1 || path.indexOf('\\.\\') !== -1) {
            statusMessage = 'The path contains /./';
        } else {
            return false;
        }

         Logger.error(this.ctx, this.TAG, this.containsUnsupportedPathFormat.name, null, cdmLogCode.ErrStorageInvalidPathFormat, statusMessage);

        return true;
    }
}
