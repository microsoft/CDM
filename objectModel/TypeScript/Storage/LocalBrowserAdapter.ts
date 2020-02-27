// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { StorageAdapter } from './StorageAdapter';

interface FileInfo {
    name: string;
    path: string;
    file: File;
}

/**
 * This adapter is necessary for utilizing local files with the Entity Explorer on the browser.
 * Since we cannot pull any local files from the browser, all files are loaded from a dialog
 * and then stored in this adapter. Any files that are needed must be loaded from that dialog
 * and cannot be pulled in in any other way.
 */
export class LocalBrowserAdapter implements StorageAdapter {
    private readonly folders: Set<string> = new Set<string>();
    private readonly fileMap: Map<string, FileInfo>;

    constructor(config) {
        if (config.fileMap) {
            this.fileMap = config.fileMap;
            for (let path of this.fileMap.keys()) {
                // remove file name
                path = path.slice(0, path.lastIndexOf('/'));

                const pathSplit: string[] = path.split('/')
                    .filter((x: string) => { return !!x; });
                let currentPath: string = '';
                for (const folder of pathSplit) {
                    currentPath = `${currentPath}/${folder}`;
                    this.folders.add(currentPath);
                }
            }
            this.folders.add('/');
        }
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        if (this.fileMap.has(corpusPath)) {
            const file: File = this.fileMap.get(corpusPath).file;

            const f = async (fileObj: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader: FileReader = new FileReader();
                    reader.onloadend = (event) => {
                        resolve(reader.result.toString());
                    };
                    reader.onerror = (event) => {
                        reject('Could not read data from the file');
                    };

                    reader.readAsText(fileObj);
                });
            };

            const data: string = await f(file);
            if (data) {
                return data;
            }
        }

        return undefined;
    }

    public canWrite(): boolean {
        return false;
    }

    public async dirExists(folderPath: string): Promise<boolean> {
        return this.folders.has(folderPath);
    }

    public createAdapterPath(corpusPath: string): string {
        return corpusPath;
    }

    public createCorpusPath(adapterPath: string): string {
        return adapterPath;
    }

    public clearCache(): void {
        return;
    }

    public async computeLastModifiedTimeAsync(adapterPath: string): Promise<Date> {
        return undefined;
    }

    public async fetchAllFilesAsync(folderCorpusPath: string): Promise<string[]> {
        return Array.from(this.fileMap.keys());
    }

    public fetchConfig(): string {
        return undefined;
    }

    public updateConfig(config: string): void {
    }
}
