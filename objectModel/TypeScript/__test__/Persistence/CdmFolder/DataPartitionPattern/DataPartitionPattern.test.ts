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
});
