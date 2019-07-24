import { existsSync, mkdirSync, readdirSync, readFile, readFileSync, Stats, statSync, writeFileSync } from 'fs';
import * as cdm from './cdm-types';

/* tslint:disable:no-console */

export function consoleStatusReport(level: cdm.cdmStatusLevel, msg: string, path: string): void {
    if (level === cdm.cdmStatusLevel.error) {
        console.error(`Err: ${msg} @ ${path}`);
    } else if (level === cdm.cdmStatusLevel.warning) {
        console.warn(`Wrn: ${msg} @ ${path}`);
    } else if (level === cdm.cdmStatusLevel.progress) {
        console.log(msg);
    }
}

export async function resolveLocalCorpus(cdmCorpus: cdm.ICdmCorpusDef, finishStep: cdm.cdmValidationStep): Promise<boolean> {
    return new Promise<boolean>((
        localCorpusResolve: (value?: (boolean | PromiseLike<boolean>)) => void,
        localCorpusReject: (reason?: Error) => void): void => {
        console.log('resolving imports');
        // first resolve all of the imports to pull other docs into the namespace
        cdmCorpus.resolveImports(
            async (uri: string): Promise<[string, string]> => {
                return new Promise<[string, string]>((
                    resolve: (value?: ([string, string] | PromiseLike<[string, string]>)) => void,
                    reject: (reason: [string, NodeJS.ErrnoException]) => void): void => {
                    // resolve imports take a callback that askes for promise to do URI resolution.
                    // so here we are, working on that promise
                    readFile(cdmCorpus.rootPath + uri, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
                        if (err) {
                            reject([uri, err]);
                        } else {
                            resolve([uri, data]);
                        }
                    });
                });
            })
            .then(async (r: boolean) => {
                // success resolving all imports
                console.log(r);
                const startTime: number = Date.now();
                console.log('validate schema:');
                if (r) {
                    const validateStep: (currentStep: cdm.cdmValidationStep) => Promise<void>
                        = async (currentStep: cdm.cdmValidationStep): Promise<void> => {
                            return cdmCorpus.resolveReferencesAndValidate(currentStep, finishStep, undefined)
                                .then(async (nextStep: cdm.cdmValidationStep) => {
                                    if (nextStep === cdm.cdmValidationStep.error) {
                                        console.log('validation step failed');
                                    } else if (nextStep === cdm.cdmValidationStep.finished) {
                                        console.log('validation finished');
                                        console.log(Date.now() - startTime);
                                        localCorpusResolve(true);
                                    } else {
                                        // success resolving all imports
                                        return validateStep(nextStep);
                                    }
                                })
                                .catch((reason: Error) => {
                                    console.log('exception during validation');
                                    console.log(reason);
                                    localCorpusReject(reason);
                                });
                        };

                    return validateStep(cdm.cdmValidationStep.start);
                }
            })
            .catch((reason: Error) => {
                console.log('exception during resolving imports');
                console.log(reason);
            });
    });
}

// "analyticalCommon"
// "applicationCommon"

export function loadCorpusFolder(corpus: cdm.ICdmCorpusDef, folder: cdm.ICdmFolderDef, ignoreFolders: string[], version: string): void {
    const path: string = corpus.rootPath + folder.getRelativePath();
    if (ignoreFolders && ignoreFolders.find((ig: string) => ig === folder.getName())) {
        return;
    }
    const endMatch: string = `${(version ? `.${version}` : '')}.cdm.json`;
    // for every document or directory
    readdirSync(path)
        .forEach((dirEntry: string) => {
            const entryName: string = path + dirEntry;
            const stats: Stats = statSync(entryName);
            if (stats.isDirectory()) {
                loadCorpusFolder(corpus, folder.addFolder(dirEntry), ignoreFolders, version);
            } else {
                const postfix: string = dirEntry.slice(dirEntry.indexOf('.'));
                if (postfix === endMatch) {
                    const sourceBuff: Buffer = readFileSync(entryName);
                    if (sourceBuff.length > 3) {
                        const bom1: number = sourceBuff.readInt8(0);
                        const bom2: number = sourceBuff.readInt8(1);
                        const bom3: number = sourceBuff.readInt8(2);
                        if (bom1 === -17 && bom2 === -69 && bom3 === -65) {
                            // this is ff fe encode in utf8 and is the bom that json parser hates.
                            sourceBuff.writeInt8(32, 0);
                            sourceBuff.writeInt8(32, 1);
                            sourceBuff.writeInt8(32, 2);
                        }
                    }
                    const sourceDoc: string = sourceBuff.toString();
                    corpus.addDocumentFromContent(`${folder.getRelativePath()}${dirEntry}`, sourceDoc);
                }
            }
        });
}

export function persistCorpus(cdmCorpus: cdm.ICdmCorpusDef, directives: cdm.TraitDirectiveSet, options?: cdm.copyOptions): void {
    if (cdmCorpus && cdmCorpus.getSubFolders() && cdmCorpus.getSubFolders().length === 1) {
        persistCorpusFolder(cdmCorpus.rootPath, cdmCorpus.getSubFolders()[0], directives, options);
    }
}

export function persistCorpusFolder
    (rootPath: string, cdmFolder: cdm.ICdmFolderDef, directives: cdm.TraitDirectiveSet, options?: cdm.copyOptions)
    : void {
    if (cdmFolder) {
        const folderPath: string = rootPath + cdmFolder.getRelativePath();
        if (!existsSync(folderPath)) {
            mkdirSync(folderPath);
        }
        if (cdmFolder.getDocuments()) {
            cdmFolder.getDocuments()
                .forEach((doc: cdm.ICdmDocumentDef) => {
                    const resOpt: cdm.resolveOptions = { wrtDoc: doc, directives: directives };
                    persistDocument(rootPath, resOpt, options);
                });
        }
        if (cdmFolder.getSubFolders()) {
            cdmFolder.getSubFolders()
                .forEach((f: cdm.ICdmFolderDef) => {
                    persistCorpusFolder(rootPath, f, directives, options);
                });
        }
    }
}

export function persistDocument(rootPath: string, resOpt: cdm.resolveOptions, options?: cdm.copyOptions): void {
    const docPath: string
        = rootPath
        + resOpt.wrtDoc.getFolder()
            .getRelativePath()
        + resOpt.wrtDoc.getName();
    const data: cdm.CdmJsonType = resOpt.wrtDoc.copyData(resOpt, options);
    const content: string = JSON.stringify(data, undefined, 4);
    writeFileSync(docPath, content);
}
