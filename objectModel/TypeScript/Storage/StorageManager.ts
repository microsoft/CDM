// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { GithubAdapter, LocalAdapter } from '.';
import {
    CdmContainerDefinition,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmFolderDefinition,
    CdmObject,
    resolveContext
} from '../internal';
import { Logger } from '../Utilities/Logging/Logger';
import { StorageUtils } from '../Utilities/StorageUtils';
import { ADLSAdapter } from './ADLSAdapter';
import { CdmStandardsAdapter } from './CdmStandardsAdapter';
import { RemoteAdapter } from './RemoteAdapter';
import { ResourceAdapter } from './ResourceAdapter';
import { configObjectType, StorageAdapter } from './StorageAdapter';

export class StorageManager {
    /**
     * @internal
     */
    public readonly corpus: CdmCorpusDefinition;
    // the map of registered namespace <-> adapters.
    public namespaceAdapters: Map<string, StorageAdapter>;
    /**
     * @internal
     */
    public namespaceFolders: Map<string, CdmFolderDefinition>;
    public defaultNamespace: string;

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
        this.namespaceAdapters = new Map<string, StorageAdapter>();
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
    public mount(namespace: string, adapter: StorageAdapter): void {
        if (!namespace) {
            Logger.error(StorageManager.name, this.ctx, 'The namespace cannot be null or empty.', this.mount.name);

            return;
        }

        if (adapter) {
            this.namespaceAdapters.set(namespace, adapter);
            const fd: CdmFolderDefinition = new CdmFolderDefinition(this.ctx, '');
            fd.corpus = this.corpus;
            fd.namespace = namespace;
            fd.folderPath = '/';
            this.namespaceFolders.set(namespace, fd);
            this.systemDefinedNamespaces.delete(namespace);
        } else {
            Logger.error(StorageManager.name, this.ctx, 'The adapter cannot be null.', this.mount.name);
        }
    }

    /**
     * Mounts the config JSON to the storage manager/corpus.
     * @param adapterConfig The adapters config in JSON.
     * @param adapterOrDoesReturnErrorList A boolean value that denotes whether we want to return a list of adapters that were not found.
     */
    public mountFromConfig(adapterConfig: string, doesReturnErrorList: boolean = false): string[] {
        if (!adapterConfig) {
            Logger.error(StorageManager.name, this.ctx, 'Adapter config cannot be null or empty.', this.mount.name);

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
                Logger.error(StorageManager.name, this.ctx, 'The namespace is missing for one of the adapters in the JSON config.');
                continue;
            }

            let configs;

            // Check whether the config exists.
            if (item.config) {
                configs = item.config;
            } else {
                Logger.error(StorageManager.name, this.ctx, `Missing JSON config for the namespace ${nameSpace}.`);
                continue;
            }

            if (!item.type) {
                Logger.error(StorageManager.name, this.ctx, `Missing type in the JSON config for the namespace ${nameSpace}.`);
                continue;
            }

            const adapterType = this.registeredAdapterTypes.get(item.type);

            if (!adapterType) {
                unrecognizedAdapters.push(item);
            } else {
                const adapter: StorageAdapter = new adapterType.constructor();
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
        if (!nameSpace) {
            Logger.error(StorageManager.name, this.ctx, 'The namespace cannot be null or empty.', this.unMount.name);

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
            Logger.warning(
                StorageManager.name,
                this.ctx,
                'Cannot remove the adapter from non-existing namespace.',
                this.unMount.name
            );
        }
    }

    /**
     * @internal
     * Allow replacing a storage adapter with another one for testing, leaving folders intact.
     */
    public setAdapter(nameSpace: string, adapter: StorageAdapter): void {
        if (!nameSpace) {
            Logger.error(StorageManager.name, this.ctx, 'The namespace cannot be null or empty.', this.setAdapter.name);

            return;
        }
        if (adapter) {
            this.namespaceAdapters.set(nameSpace, adapter);
        } else {
            Logger.error(StorageManager.name, this.ctx, 'The adapter cannot be undefined.', this.setAdapter.name);
        }
    }

    /**
     * Retrieves the adapter for the specified namespace.
     */
    public fetchAdapter(namespace: string): StorageAdapter {
        if (!namespace) {
            Logger.error(StorageManager.name, this.ctx, 'The namespace cannot be null or empty.', this.fetchAdapter.name);

            return undefined;
        }
        if (this.namespaceFolders.has(namespace)) {
            return this.namespaceAdapters.get(namespace);
        }

        Logger.error(
            StorageManager.name,
            this.ctx,
            `Adapter not found for the namespace '${namespace}'.`,
            this.fetchAdapter.name
        );

        return undefined;
    }

    /**
     * Given the namespace of a registered storage adapter, returns the root folder containing the sub-folders and documents.
     */
    public fetchRootFolder(namespace: string): CdmFolderDefinition {
        if (!namespace) {
            Logger.error(StorageManager.name, this.ctx, 'The namespace cannot be null or empty.', this.fetchRootFolder.name);

            return undefined;
        }

        let folder: CdmFolderDefinition;
        if (this.namespaceFolders.has(namespace)) {
            folder = this.namespaceFolders.get(namespace);
        } else if (namespace === 'default') {
            folder = this.namespaceFolders.get(this.defaultNamespace);
        }

        if (!folder) {
            Logger.error(
                StorageManager.name,
                this.ctx,
                `Adapter not found for namespace '${namespace}'`,
                this.fetchRootFolder.name
            );
        }

        return folder;
    }

    /**
     * Takes a storage adapter domain path, figures out the right adapter to use and then returns a corpus path.
     */
    public adapterPathToCorpusPath(adapterPath: string): string {
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
            Logger.error(
                StorageManager.name,
                this.ctx as resolveContext,
                `No registered storage adapter understood the path '${adapterPath}'`,
                this.adapterPathToCorpusPath.name
            );
        }

        return result;
    }

    /**
     * Takes a corpus path, figures out the right adapter to use and then returns an adapter domain path.
     */
    public corpusPathToAdapterPath(corpusPath: string): string {
        if (!corpusPath) {
            Logger.error(StorageManager.name, this.ctx, 'The corpus path cannot be null or empty.', this.corpusPathToAdapterPath.name);

            return undefined;
        }
        let result: string;
        // break the corpus path into namespace and ... path
        const pathTuple: [string, string] = StorageUtils.splitNamespacePath(corpusPath);
        if (!pathTuple) {
            Logger.error(StorageManager.name, this.ctx, 'The corpus path cannot be null or empty.', this.corpusPathToAdapterPath.name);

            return undefined;
        }
        const namespace: string = pathTuple[0] || this.defaultNamespace;

        // get the adapter registered for this namespace
        const namespaceAdapter: StorageAdapter = this.fetchAdapter(namespace);
        if (namespaceAdapter === undefined) {
            Logger.error(
                StorageManager.name,
                this.ctx as resolveContext,
                `The namespace '${namespace}' has not been registered`,
                this.corpusPathToAdapterPath.name
            );
        } else {
            // ask the storage adapter to 'adapt' this path
            result = namespaceAdapter.createAdapterPath(pathTuple[1]);
        }

        return result;
    }

    public createAbsoluteCorpusPath(objectPath: string, obj?: CdmObject): string {
        if (!objectPath) {
            Logger.error(StorageManager.name, this.ctx, 'The object path cannot be null or empty.', this.createAbsoluteCorpusPath.name);

            return undefined;
        }

        if (this.containsUnsupportedPathFormat(objectPath)) {
            // already called statusRpt when checking for unsupported path format.
            return;
        }

        const pathTuple: [string, string] = StorageUtils.splitNamespacePath(objectPath);
        if (!pathTuple) {
            Logger.error(StorageManager.name, this.ctx, 'The object path cannot be null or empty.', this.createAbsoluteCorpusPath.name);

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
        } else if (obj) {
            prefix = obj.inDocument.folderPath;
            namespaceFromObj = obj.inDocument.namespace;
        }

        if (prefix && this.containsUnsupportedPathFormat(prefix)) {
            // already called statusRpt when checking for unsupporetd path format.
            return;
        }
        if (prefix && prefix.length > 0 && prefix[prefix.length - 1] !== '/') {
            Logger.warning(
                StorageManager.name,
                this.ctx as resolveContext,
                'Expected path prefix to end in /, but it didn\'t. Appended the /',
                prefix
            );
            prefix += '/';
        }

        // check if this is a relative path
        if (newObjectPath && newObjectPath.charAt(0) !== '/') {
            if (!obj) {
                // relative path and no other info given, assume default and root
                prefix = '/';
            }
            if (nameSpace && nameSpace !== namespaceFromObj) {
                Logger.error(
                    StorageManager.name,
                    this.ctx as resolveContext,
                    `The namespace '${nameSpace}' found on the path does not match the namespace found on the object`
                );

                return;
            }
            newObjectPath = `${prefix}${newObjectPath}`;

            finalNamespace = namespaceFromObj || nameSpace || this.defaultNamespace;
        } else {
            finalNamespace = nameSpace || namespaceFromObj || this.defaultNamespace;
        }

        return `${finalNamespace ? `${finalNamespace}:` : ''}${newObjectPath}`;
    }

    /**
     * Takes a corpus path (relative or absolute) and creates a valid relative corpus path with namespace.
     * @param objectPath The path that should be made relative, if possible
     * @param relativeTo The object that the path should be made relative with respect to.
     */
    public createRelativeCorpusPath(objectPath: string, relativeTo?: CdmContainerDefinition): string {
        let newPath: string = this.createAbsoluteCorpusPath(objectPath, relativeTo);

        const namespaceString: string = `${relativeTo.namespace}:`;
        if (namespaceString && newPath && newPath.startsWith(namespaceString)) {
            newPath = newPath.slice(namespaceString.length);

            if (newPath.startsWith(relativeTo.folderPath)) {
                newPath = newPath.slice(relativeTo.folderPath.length);
            }
        }

        return newPath;
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
                Logger.error(
                    StorageManager.name,
                    this.ctx,
                    'JSON config constructed by adapter is null or empty.',
                    this.fetchConfig.name
                );
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
    public async saveAdaptersConfigAsync(name: string, adapter: StorageAdapter): Promise<void> {
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
            statusMessage = 'The path should not start with ./';
        } else if (path.indexOf('../') !== -1 || path.indexOf('..\\') !== -1) {
            statusMessage = 'The path should not contain ../';
        } else if (path.indexOf('/./') !== -1 || path.indexOf('\\.\\') !== -1) {
            statusMessage = 'The path should not contain /./';
        } else {
            return false;
        }

        Logger.error(StorageManager.name, (this.ctx as resolveContext), statusMessage, path);

        return true;
    }
}
