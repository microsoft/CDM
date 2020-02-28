// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import * as cdm from './cdm-types';
import { CdmFolderDefinition } from './internal';
import * as persistence from './Persistence';

/* tslint:disable:no-console */

export function consoleStatusReport(level: cdm.cdmStatusLevel, msg: string): void {
    if (level === cdm.cdmStatusLevel.error) {
        console.error(`Err: ${msg}`);
    } else if (level === cdm.cdmStatusLevel.warning) {
        console.warn(`Wrn: ${msg}`);
    } else if (level === cdm.cdmStatusLevel.progress) {
        console.log(msg);
    }
}

export function fileStatusReport(level: cdm.cdmStatusLevel, msg: string): void {
    // This file name as well as the function just serves as an example of an event callback, a user can set up any file name.
    const fileName : string = 'common-data-model-loader-test-report.txt';

    if (level === cdm.cdmStatusLevel.error) {
        fs.appendFileSync(fileName, `Err: ${msg}\n`);
    } else if (level === cdm.cdmStatusLevel.warning) {
        fs.appendFileSync(fileName, `Wrn: ${msg}\n`);
    } else if (level === cdm.cdmStatusLevel.progress) {
        fs.appendFileSync(fileName, `${msg}\n`);
    }
}

const directives: cdm.TraitDirectiveSet = new cdm.TraitDirectiveSet(
    new Set<string>(['normalized', 'referenceOnly'])); // the default from before.

export async function resolveLocalCorpus(cdmCorpus: cdm.CdmCorpusDefinition, finishStep: cdm.cdmValidationStep): Promise<boolean> {
    console.log('resolving imports');
    // first resolve all of the imports to pull other docs into the namespace
    const docsJustAdded: Set<cdm.CdmDocumentDefinition> = new Set<cdm.CdmDocumentDefinition>();
    const docsNotFound: Set<string> = new Set<string>();
    for (const doc of cdmCorpus.allDocuments) {
        await cdmCorpus.resolveImportsAsync(doc[1]);
        const resOpt: cdm.resolveOptions = { wrtDoc: doc[1], directives: directives };
        docsJustAdded.add(doc[1]);
        for (const addedDoc of docsJustAdded) {
            await addedDoc.indexIfNeeded(resOpt);
        }
    }

    return true;
}

// "analyticalCommon"
// "applicationCommon"

export function persistCorpusFolder
    (rootPath: string, cdmFolder: cdm.CdmFolderDefinition, directiveSet: cdm.TraitDirectiveSet, options?: cdm.copyOptions)
    : void {
    if (cdmFolder) {
        const folderPath: string = rootPath + cdmFolder.folderPath;
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        if (cdmFolder.documents) {
            cdmFolder.documents.allItems
                .forEach((doc: cdm.CdmDocumentDefinition) => {
                    const resOpt: cdm.resolveOptions = { wrtDoc: doc, directives: directiveSet };
                    persistDocument(rootPath, resOpt, options);
                });
        }
        if (cdmFolder.childFolders) {
            cdmFolder.childFolders.allItems
                .forEach((f: cdm.CdmFolderDefinition) => {
                    persistCorpusFolder(rootPath, f, directiveSet, options);
                });
        }
    }
}

export function persistDocument(rootPath: string, resOpt: cdm.resolveOptions, options?: cdm.copyOptions): void {
    const docPath: string
        = rootPath
        + resOpt.wrtDoc.getFolder()
            .folderPath
        + resOpt.wrtDoc.getName();
    const data = resOpt.wrtDoc.copyData(resOpt, options);
    const content: string = JSON.stringify(data, undefined, 4);
    fs.writeFileSync(docPath, content);
}
