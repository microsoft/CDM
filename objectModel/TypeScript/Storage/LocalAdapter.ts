// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { StorageUtils } from '../Utilities/StorageUtils';
import { CdmFileMetadata, configObjectType, StorageAdapterBase } from '../internal';

let readFile, writeFile, stat, mkdir, readdir;

if (fs.readFile) {
    readFile = util.promisify(fs.readFile);
    writeFile = util.promisify(fs.writeFile);
    stat = util.promisify(fs.stat);
    mkdir = util.promisify(fs.mkdir);
    readdir = util.promisify(fs.readdir);
}

export class LocalAdapter extends StorageAdapterBase {
    public root: string;
    /**
     * @internal
     */
    public fullRoot: string;

    /**
     * @internal
     */
    public readonly type: string = 'local';

    constructor(root?: string) {
        super();
        if (root) {
            this.root = root;
            this.fullRoot = path.resolve(root);
        }
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        try {
            const adapterPath: string = this.createAdapterPath(corpusPath);
            const s: string = await readFile(adapterPath, 'utf-8') as string;
            if (s === undefined || s === '') {
                throw new Error(`The requested document '${adapterPath}' is empty`);
            }

            return s;
        } catch (err) {
            throw (err);
        }
    }

    public canWrite(): boolean {
        return true;
    }

    public async writeAsync(corpusPath: string, data: string): Promise<void> {
        // ensure that the path exists before trying to write the file
        const adapterPath: string = this.createAdapterPath(corpusPath);
        if (await this.ensurePath(adapterPath) === false) {
            throw new Error(`could not create folder for document '${adapterPath}'`);
        }

        await writeFile(adapterPath, data, 'utf-8');
    }

    public createAdapterPath(corpusPath: string): string {
        const pathTuple: [string, string] = StorageUtils.splitNamespacePath(corpusPath);
        if (!pathTuple) {
            return undefined;
        }
        corpusPath = pathTuple[1];

        if (path.isAbsolute(this.fullRoot)) {
            return path.join(this.fullRoot, corpusPath);
        }

        return path.join(__dirname, this.root, corpusPath);
    }

    public createCorpusPath(adapterPath: string): string {
        if (!adapterPath || adapterPath.startsWith('http')) {
            return;
        }

        // make this a file system path and normalize it
        const formattedAdapterPath: string = path.resolve(adapterPath)
            .replace(/\\/g, '/');
        const formattedRoot: string = this.fullRoot.replace(/\\/g, '/');

        // might not be an adapterPath that we understand. check that first
        if (formattedAdapterPath.startsWith(formattedRoot)) {
            return formattedAdapterPath.slice(formattedRoot.length);
        }

        return; // signal that we didn't recognize path as one for this adapter
    }

    public async computeLastModifiedTimeAsync(corpusPath: string): Promise<Date> {
        try {
            const adapterPath: string = this.createAdapterPath(corpusPath);
            const stats: fs.Stats = await stat(adapterPath) as fs.Stats;

            return stats.mtime;
        } catch (err) {
            return undefined;
        }
    }

    public async fetchAllFilesAsync(folderCorpusPath: string): Promise<string[]> {

        // Returns a list corpus paths to all files and folders at or under the
        // provided corpus path to a folder
        return this._fetchAllFilesAsync(folderCorpusPath);
    }

    public async fetchAllFilesMetadataAsync(folderCorpusPath: string): Promise<Map<string, CdmFileMetadata>> {
        const fileMetadatas: Map<string, CdmFileMetadata> = new Map<string, CdmFileMetadata>();
        const fileNames: string[] = await this.fetchAllFilesAsync(folderCorpusPath);

        for (const fileName of fileNames) {
            const path: string = this.createAdapterPath(fileName);
            const stats: fs.Stats = await stat(path);
            fileMetadatas.set(fileName, { fileSizeBytes: stats.isFile ? stats.size : undefined });
        }

        return fileMetadatas;
    }

    public fetchConfig(): string {
        const resultConfig: configObjectType = {
            type: this.type
        };

        const configObject: configObjectType = {
            root: this.root
        };

        if (this.locationHint) {
            configObject.locationHint = this.locationHint;
        }

        resultConfig.config = configObject;

        return JSON.stringify(resultConfig);
    }

    public updateConfig(config: string): void {
        if (!config) {
            throw new Error('Local adapter needs a config.');
        }

        const configJson: configObjectType = JSON.parse(config);

        if (!configJson.root) {
            throw new Error('The root has to be specified and cannot be null.');
        }

        this.root = configJson.root;

        if (configJson.locationHint) {
            this.locationHint = configJson.locationHint;
        }

        this.fullRoot = path.resolve(this.root);
    }

    private async dirExists(folderPath: string): Promise<boolean> {
        try {
            const adapterPath: string = this.createAdapterPath(folderPath);
            const dir: fs.Stats = await stat(adapterPath) as fs.Stats;

            return dir && dir.isDirectory();
        } catch (err) {
            return false;
        }
    }

    // recursive check for / create path to house a document
    private async ensurePath(pathFor: string): Promise<boolean> {
        const pathEnd: number = pathFor.lastIndexOf(path.sep);
        if (pathEnd === -1) {
            return false;
        }
        const pathTo: string = pathFor.slice(0, pathEnd);

        const dir: fs.Stats = await stat(pathTo) as fs.Stats;

        if (dir && dir.isDirectory) {
            return true;
        }

        // make sure there is a place to put the directory that is missing
        if (await this.ensurePath(pathTo) === false) {
            return false;
        }

        // hmm how to tell if it fails?
        await mkdir(pathTo);

        return true;
    }

    private async _fetchAllFilesAsync(currFullPath: string): Promise<string[]> {
        let allFiles: string[] = [];
        const adapterPath: string = this.createAdapterPath(currFullPath);

        const content: string[] = await readdir(adapterPath) as string[];

        for (const childPath of content) {
            const childCorpusPath: string = this.createCorpusPath(path.join(adapterPath, childPath));
            const isDir: boolean = await this.dirExists(childCorpusPath);

            if (isDir) {
                const subFiles: string[] = await this._fetchAllFilesAsync(childCorpusPath);
                allFiles = allFiles.concat(subFiles);
            } else {
                allFiles.push(childCorpusPath);
            }
        }

        return allFiles;
    }
}
