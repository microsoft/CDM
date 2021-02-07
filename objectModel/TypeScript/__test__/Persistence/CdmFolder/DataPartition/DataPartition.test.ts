// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import {
    CdmCorpusDefinition,
    CdmDataPartitionDefinition,
    CdmEntityDeclarationDefinition,
    CdmFolderDefinition,
    CdmLocalEntityDeclarationDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    copyOptions,
    resolveContext,
    resolveOptions
} from '../../../../internal';
import { CdmFolder } from '../../../../Persistence';
import { DataPartition, EntityDeclarationDefinition, ManifestContent, KeyValPair } from '../../../../Persistence/CdmFolder/types';
import { LocalAdapter } from '../../../../Storage';
import { testHelper } from '../../../testHelper';

describe('Persistence.CdmFolder.DataPartition', () => {
    /// <summary>
    /// The path between TestDataPath and TestName.
    /// </summary>
    const testsSubpath: string = 'Persistence/CdmFolder/DataPartition';

    const doesWriteTestDebuggingFiles: boolean = false;

    /**
     * Testing for Manifest instance with local entity declaration having data partitions.
     */
    it('TestLoadLocalEntityWithDataPartition', () => {
        const readFile: string = testHelper.getInputFileContent(
            testsSubpath,
            'TestLoadLocalEntityWithDataPartition',
            'entities.manifest.cdm.json');

        const cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'entities', 'testNamespace', '/', JSON.parse(readFile));

        expect(cdmManifest.entities.length)
            .toBe(1);
        expect(cdmManifest.entities.allItems[0].getObjectType())
            .toBe(cdmObjectType.localEntityDeclarationDef);
        const entity: CdmLocalEntityDeclarationDefinition = cdmManifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(entity.dataPartitions.length)
            .toBe(2);
        const relativePartition: CdmDataPartitionDefinition = entity.dataPartitions.allItems[0];
        expect(relativePartition.name)
            .toBe('Sample data partition');
        expect(relativePartition.location)
            .toBe('test/location');
        expect(relativePartition.lastFileModifiedTime.toUTCString())
            .toBe('Mon, 15 Sep 2008 23:53:23 GMT');
        expect(relativePartition.exhibitsTraits.length)
            .toBe(1);
        expect(relativePartition.specializedSchema)
            .toBe('teststring');

        const testList: string[] = relativePartition.arguments.get('test');

        expect(testList.length)
            .toEqual(3);
        expect(testList[0])
            .toEqual('something');
        expect(testList[1])
            .toEqual('somethingelse');
        expect(testList[2])
            .toEqual('anotherthing');

        const keyList: string[] = relativePartition.arguments.get('KEY');

        expect(keyList.length)
            .toEqual(1);
        expect(keyList[0])
            .toEqual('VALUE');

        expect(relativePartition.arguments.has('wrong'))
            .toBeFalsy();

        const absolutePartition: CdmDataPartitionDefinition = entity.dataPartitions.allItems[1];
        expect(absolutePartition.location)
            .toBe('local:/some/test/location');
    });

    /**
     * Manifest.DataPartitions.Arguments can be read in multiple forms,
     * but should always be serialized as {name: 'theName', value: 'theValue'}.
     */
    it('TestDataPartitionArgumentsAreSerializedAppropriately', () => {
        const readFile: string = testHelper.getInputFileContent(
            testsSubpath,
            'TestDataPartitionArgumentsAreSerializedAppropriately',
            'entities.manifest.cdm.json');

        const cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'entities', 'testNamespace', '/', JSON.parse(readFile));

        const obtainedCdmFolder: ManifestContent = CdmFolder.ManifestPersistence.toData(cdmManifest, undefined, undefined);
        if (doesWriteTestDebuggingFiles) {
            testHelper.writeActualOutputFileContent(
                testsSubpath,
                'TestDataPartitionArgumentsAreSerializedAppropriately',
                'savedManifest.manifest.cdm.json',
                JSON.stringify(obtainedCdmFolder));
        }
        const expectedOutput: string = testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestDataPartitionArgumentsAreSerializedAppropriately',
            'savedManifest.manifest.cdm.json');
        const expectedManifest: object = JSON.parse(expectedOutput) as object;
        expect(testHelper.compareObjectsContent(obtainedCdmFolder, expectedManifest, true))
            .toBeTruthy();
    });

    /**
     * Testing programatically creating manifest with partitions and persisting
     */
    it('TestProgrammaticallyCreatePartitions', async () => {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        const manifest: CdmManifestDefinition = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'manifest');
        const entity: CdmEntityDeclarationDefinition = manifest.entities.push('entity');

        const relativePartition: CdmDataPartitionDefinition =
            corpus.MakeObject<CdmDataPartitionDefinition>(cdmObjectType.dataPartitionDef, 'relative partition');
        relativePartition.location = 'relative/path';
        relativePartition.arguments.set('test1', [ 'argument1' ]);
        relativePartition.arguments.set('test2', [ 'argument2', 'argument3' ]);

        const absolutePartition: CdmDataPartitionDefinition =
            corpus.MakeObject<CdmDataPartitionDefinition>(cdmObjectType.dataPartitionDef, 'absolute partition');
        absolutePartition.location = 'local:/absolute/path';
        // add an empty arguments list to test empty list should not be displayed in ToData json.
        absolutePartition.arguments.set('test', []);

        entity.dataPartitions.push(relativePartition);
        entity.dataPartitions.push(absolutePartition);

        const manifestData: ManifestContent = CdmFolder.ManifestPersistence.toData(manifest, new resolveOptions(), new copyOptions());
        expect(manifestData.entities.length)
            .toBe(1);
        const entityData: EntityDeclarationDefinition = manifestData.entities[0];
        const partitionsList: DataPartition[] = entityData.dataPartitions;
        expect(partitionsList.length)
            .toBe(2);
        const relativePartitionData: DataPartition = partitionsList[0];
        const absolutePartitionData: DataPartition = partitionsList[1];

        expect(relativePartitionData.location)
            .toBe(relativePartition.location);
        const argumentsList: KeyValPair[] = relativePartitionData.arguments;
        expect(argumentsList.length)
            .toBe(3);
        expect(argumentsList[0].name)
            .toBe('test1');
        expect(argumentsList[0].value)
            .toBe('argument1');
        expect(argumentsList[1].name)
            .toBe('test2');
        expect(argumentsList[1].value)
            .toBe('argument2');
        expect(argumentsList[2].name)
            .toBe('test2');
        expect(argumentsList[2].value)
            .toBe('argument3');

        expect(absolutePartitionData.location)
            .toBe(absolutePartition.location);
        // test if empty argument list is set to null
        expect(absolutePartitionData.arguments)
            .toBeUndefined();
    });
});
