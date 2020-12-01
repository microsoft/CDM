// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDataPartitionPatternDefinition,
    CdmLocalEntityDeclarationDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    copyOptions,
    resolveContext,
    resolveOptions
} from '../../../../internal';
import { CdmFolder } from '../../../../Persistence';
import { DataPartitionPattern, EntityDeclarationDefinition, ManifestContent } from '../../../../Persistence/CdmFolder/types';
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
            .toBe(2);
        const entity1: CdmLocalEntityDeclarationDefinition = cdmManifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(entity1.getObjectType())
            .toBe(cdmObjectType.localEntityDeclarationDef);
        expect(entity1.dataPartitionPatterns.length)
            .toBe(1);
        const pattern1: CdmDataPartitionPatternDefinition = entity1.dataPartitionPatterns.allItems[0];
        expect(pattern1.name)
            .toBe('testPattern');
        expect(pattern1.explanation)
            .toBe('test explanation');
        expect(pattern1.rootLocation)
            .toBe('test location');
        expect(pattern1.regularExpression)
            .toBe('\\s*');
        expect(pattern1.parameters.length)
            .toBe(2);
        expect(pattern1.parameters[0])
            .toBe('testParam1');
        expect(pattern1.parameters[1])
            .toBe('testParam2');
        expect(pattern1.specializedSchema)
            .toBe('test special schema');
        expect(pattern1.exhibitsTraits.length)
            .toBe(1);

        const entity2: CdmLocalEntityDeclarationDefinition = cdmManifest.entities.allItems[1] as CdmLocalEntityDeclarationDefinition;
        expect(entity2.getObjectType())
            .toBe(cdmObjectType.localEntityDeclarationDef);
        expect(entity2.dataPartitionPatterns.length)
            .toBe(1);
        const pattern2: CdmDataPartitionPatternDefinition = entity2.dataPartitionPatterns.allItems[0];
        expect(pattern2.name)
            .toBe('testPattern2');
        expect(pattern2.rootLocation)
            .toBe('test location2');
        expect(pattern2.globPattern)
            .toBe('/*.csv');

        const manifestData: ManifestContent = CdmFolder.ManifestPersistence.toData(cdmManifest, new resolveOptions(), new copyOptions());
        expect(manifestData.entities.length)
            .toBe(2);
        const entityData1: EntityDeclarationDefinition = manifestData.entities[0];
        expect(entityData1.dataPartitionPatterns.length)
            .toBe(1);
        const patternData1: DataPartitionPattern = entityData1.dataPartitionPatterns[0];
        expect(patternData1.name)
            .toBe('testPattern');
        expect(patternData1.explanation)
            .toBe('test explanation');
        expect(patternData1.rootLocation)
            .toBe('test location');
        expect(patternData1.regularExpression)
            .toBe('\\s*');
        expect(patternData1.parameters.length)
            .toBe(2);
        expect(patternData1.parameters[0])
            .toBe('testParam1');
        expect(patternData1.parameters[1])
            .toBe('testParam2');
        expect(patternData1.specializedSchema)
            .toBe('test special schema');
        expect(patternData1.exhibitsTraits.length)
            .toBe(1);

        const entityData2: EntityDeclarationDefinition = manifestData.entities[1];
        expect(entityData2.dataPartitionPatterns.length)
            .toBe(1);
        const patternData2: DataPartitionPattern = entityData2.dataPartitionPatterns[0];
        expect(patternData2.name)
            .toBe('testPattern2');
        expect(patternData2.rootLocation)
            .toBe('test location2');
        expect(patternData2.globPattern)
            .toBe('/*.csv');
    });
});
