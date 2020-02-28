// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDataPartitionPatternDefinition,
    CdmLocalEntityDeclarationDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    resolveContext
} from '../../../../internal';
import { CdmFolder } from '../../../../Persistence';
import { testHelper } from '../../../testHelper';
import { cdmStatusLevel } from '../../../../Cdm/cdmStatusLevel';

describe('Persistence.CdmFolder.DataPartitionPattern', () => {
    /// <summary>
    /// The path between TestDataPath and TestName.
    /// </summary>
    const testsSubpath: string = 'Persistence/CdmFolder/DataPartitionPattern';

    /**
     * Testing for folder with local entity declaration with data partition patterns.
     */
    it('TestLoadLocalEntityWithDataPartitionPattern', () => {
        const readFile: string = testHelper.getInputFileContent(
            testsSubpath,
            'TestLoadLocalEntityWithDataPartitionPattern',
            'entities.manifest.cdm.json');

        const cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), '', '', '', JSON.parse(readFile));

        expect(cdmManifest.entities.length)
            .toBe(1);
        expect(cdmManifest.entities.allItems[0].getObjectType())
            .toBe(cdmObjectType.localEntityDeclarationDef);
        const entity: CdmLocalEntityDeclarationDefinition = cdmManifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(entity.dataPartitionPatterns.length)
            .toBe(1);
        const pattern: CdmDataPartitionPatternDefinition = entity.dataPartitionPatterns.allItems[0];
        expect(pattern.name)
            .toBe('testPattern');
        expect(pattern.explanation)
            .toBe('test explanation');
        expect(pattern.rootLocation)
            .toBe('test location');
        expect(pattern.regularExpression)
            .toBe('\\s*');
        expect(pattern.parameters.length)
            .toBe(2);
        expect(pattern.parameters[0])
            .toBe('testParam1');
        expect(pattern.parameters[1])
            .toBe('testParam2');
        expect(pattern.specializedSchema)
            .toBe('test special schema');
        expect(pattern.exhibitsTraits.length)
            .toBe(1);
    });

    /**
     * Testing that error is handled when partition pattern contains a folder that does not exist
     */
    it('TestPatternWithNonExistingFolder', async(done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath);
        const content: string = testHelper.getInputFileContent(testsSubpath, 'TestPatternWithNonExistingFolder', 'entities.manifest.cdm.json');
        const cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(corpus, undefined),
            'entities',
            'local',
            '/',
            JSON.parse(content));
        let errorLogged: number = 0;
        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (message.indexOf('The folder location \'local:/testLocation\' described by a partition pattern does not exist') !== -1) {
                errorLogged++;
            }
        }, cdmStatusLevel.warning);
        await cdmManifest.fileStatusCheckAsync();
        expect(errorLogged)
            .toBe(1);
        expect(cdmManifest.entities.allItems[0].dataPartitions.length)
            .toBe(0);
        // make sure the last check time is still being set
        expect(cdmManifest.entities.allItems[0].dataPartitionPatterns.allItems[0].lastFileStatusCheckTime)
            .not
            .toBeUndefined();
        done();
    });
});
