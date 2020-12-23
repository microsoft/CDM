// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    cdmStatusLevel
} from '../../../internal';

import { testHelper } from '../../testHelper';

describe('Persistence.CdmFolder.JsonSemanticVersionTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Persistence/CdmFolder/JsonSemanticVersionTest';

    /**
     * Test loading a document with a semantic version bigger than the one supported.
     */
    it('testLoadingUnsupportedVersion', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingUnsupportedVersion');
        let errorCount: number = 0;

        // Test loading a resolved document.
        corpus.setEventCallback((level: cdmStatusLevel, message: string) => {
            if (message.includes('This ObjectModel version supports json semantic version') && level == cdmStatusLevel.warning) {
                errorCount++;
            }
        }, cdmStatusLevel.warning);
        await corpus.fetchObjectAsync('local:/resolvedDoc.cdm.json');
        if (errorCount !== 1) {
            done.fail('Should have logged a warning.');
        }
        errorCount = 0;

        // Test loading a logical document.
        corpus.setEventCallback((level: cdmStatusLevel, message: string) => {
            if (message.includes('This ObjectModel version supports json semantic version') && level == cdmStatusLevel.error) {
                errorCount++;
            }
        }, cdmStatusLevel.error);
        await corpus.fetchObjectAsync('local:/logicalDoc.cdm.json');
        if (errorCount !== 1) {
            done.fail('Should have logged an error.');
        }
        errorCount = 0;

        // Test loading a document missing the jsonSemanticVersion property.
        corpus.setEventCallback((level: cdmStatusLevel, message: string) => {
            if (message.includes('jsonSemanticVersion is a required property of a document.') && level == cdmStatusLevel.warning) {
                errorCount++;
            }
        }, cdmStatusLevel.warning);
        await corpus.fetchObjectAsync('local:/missingDoc.cdm.json');
        if (errorCount !== 1) {
            done.fail('Should have logged a warning for missing property.');
        }
        done();
    });

    /**
     * Test loading a document with a semantic version bigger than the one supported.
     */
    it('testLoadingInvalidVersion', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingInvalidVersion');
        let errorCount: number = 0;

        corpus.setEventCallback((level: cdmStatusLevel, message: string) => {
            if (message.includes('jsonSemanticVersion must be set using the format <major>.<minor>.<patch>.') && level == cdmStatusLevel.warning) {
                errorCount++;
            }
        }, cdmStatusLevel.warning);

        // Test loading a version format "a.0.0".
        await corpus.fetchObjectAsync('local:/invalidVersionDoc.cdm.json');
        if (errorCount !== 1) {
            done.fail('Should have logged a warning.');
        }
        errorCount = 0;

        // Test loading a version format "1.0".
        await corpus.fetchObjectAsync('local:/invalidFormatDoc.cdm.json');
        if (errorCount !== 1) {
            done.fail('Should have logged a warning.');
        }
        done();
    });
});
