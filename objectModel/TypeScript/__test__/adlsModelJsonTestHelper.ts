// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import { adlsTestHelper } from './adlsTestHelper';
import { testHelper } from './testHelper';

export namespace adlsModelJsonTestHelper {
    export const hostnamePlaceholder: string = '<HOSTNAME>';
    export const rootPathPlaceholder: string = '/<ROOTPATH>';
    export const actualFolderName: string = 'Actual';
    export const expectedFolderName: string = 'Expected';
    export const inputFolderName: string = 'Input';

    export function getActualSubFolderPath(testSubPath: string, testName: string, subFolderName: string): string {
        return `${testHelper.getActualOutputFolderPath(testSubPath, testName)}/${subFolderName}`;
    }

    export function getExpectedFileContent(testSubPath: string, testName: string, fileName: string): string {
        return fs.readFileSync(
            `${testHelper.getActualOutputFolderPath(testSubPath, testName)}/${expectedFolderName}/${fileName}`)
            .toString();
    }

    export function saveModelJsonToActualOutput(testSubPath: string, testName: string, fileName: string, content: string) : void {
        const actualFolderPath: string = getActualSubFolderPath(testSubPath, testName, actualFolderName);
        if (!fs.existsSync(actualFolderPath))
        {
            fs.mkdirSync(actualFolderPath);
        }

        fs.writeFileSync(`${actualFolderPath}/${fileName}`, content);
    }

    export function updateInputAndExpectedAndSaveToActualSubFolder(
        testSubPath: string,
        testName: string,
        rootRelativePath: string,
        fileName: string,
        stringToAddSuffix: string,
        suffix: string): void {
            // Prepare the root path.
            let rootPath: string = process.env['ADLS_ROOTPATH'];
            rootPath = adlsTestHelper.getFullRootPath(rootPath, rootRelativePath);

            if (!rootPath.startsWith('/')) {
                rootPath = `/${rootPath}`;
            }

            if (rootPath.endsWith('/')) {
                rootPath = rootPath.substring(0, rootPath.length - 1);
            }

            rootPath = encodeURIComponent(rootPath)
                .replace(/%2F/g, '/');

            // Update input content and save to ActualOutput/Input
            let inputContent: string = testHelper.getInputFileContent(testSubPath, testName, fileName);
            inputContent = replacePlaceholder(inputContent, rootPath, stringToAddSuffix, suffix);

            const inputFolderPath: string = getActualSubFolderPath(testSubPath, testName, inputFolderName);

            if (!fs.existsSync(inputFolderPath)) {
                fs.mkdirSync(inputFolderPath);
            }

            fs.writeFileSync(
                `${inputFolderPath}/${fileName}`,
                inputContent);

            // Update expected content and save to ActualOutput/Expected
            let expectedContent: string = testHelper.getExpectedOutputFileContent(testSubPath, testName, fileName);
            expectedContent = replacePlaceholder(expectedContent, rootPath, stringToAddSuffix, suffix);

            const expectedFolderPath: string = getActualSubFolderPath(testSubPath, testName, expectedFolderName);

            if (!fs.existsSync(expectedFolderPath)) {
                fs.mkdirSync(expectedFolderPath);
            }

            fs.writeFileSync(
                `${expectedFolderPath}/${fileName}`,
                expectedContent);
    }

    export function replacePlaceholder(content: string, root: string, stringToAddSuffix: string, suffix: string) : string {
        content = content.replace(new RegExp(hostnamePlaceholder, 'g'), process.env['ADLS_HOSTNAME']);
        content = content.replace(new RegExp(rootPathPlaceholder, 'g'), root);
        content = content.replace(new RegExp(stringToAddSuffix, 'g'), `${stringToAddSuffix}-${suffix}`);

        return content;
    }
};
