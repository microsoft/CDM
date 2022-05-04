// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDataPartitionDefinition,
    CdmEntityDeclarationDefinition,
    CdmEntityDefinition,
    cdmIncrementalPartitionType,
    CdmLocalEntityDeclarationDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    cdmStatusLevel,
    constants,
    copyOptions,
    enterScope,
    resolveContext,
    resolveOptions,
} from '../../../../internal';
import { CdmFolder } from '../../../../Persistence';
import { DataPartition, EntityDeclarationDefinition, ManifestContent, KeyValPair, TraitReference } from '../../../../Persistence/CdmFolder/types';
import { testHelper } from '../../../testHelper';
import { createDocumentForEntity } from '../../../Cdm/CdmCollection/CdmCollectionHelperFunctions';
import { using } from 'using-statement';

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
     * Testing programmatically creating manifest with partitions and persisting
     */
    it('TestProgrammaticallyCreatePartitions', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestProgrammaticallyCreatePartitions', undefined, undefined, undefined, false);
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

    /**
     * Testing loading manifest with local entity declaration having an incremental partition without incremental trait.
     */
    it('TestFromIncrementalPartitionWithoutTrait', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestFromIncrementalPartitionWithoutTrait');
        let errorMessageVerified: boolean = false
        // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
        corpus.setEventCallback((level, message) => {
            if (message.indexOf('Failed to persist object \'DeletePartition\'. This object does not contain the trait \'is.partition.incremental\', so it should not be in the collection \'incrementalPartitions\'. | fromData') !== -1) {
                errorMessageVerified = true;
            } else {
                fail(new Error('Some unexpected failure - ' + message));
            }
        }, cdmStatusLevel.warning);

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/entities.manifest.cdm.json');
        expect(manifest.entities.length)
            .toBe(1);
        expect(manifest.entities.allItems[0].objectType)
            .toBe(cdmObjectType.localEntityDeclarationDef);
        const entity: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(entity.incrementalPartitions.length)
            .toBe(1);
        const incrementalPartition = entity.incrementalPartitions.allItems[0]
        expect(incrementalPartition.name)
            .toBe('UpsertPartition');
        expect(incrementalPartition.exhibitsTraits.length)
            .toBe(1);
        expect(incrementalPartition.exhibitsTraits.allItems[0].fetchObjectDefinitionName())
            .toBe(constants.INCREMENTAL_TRAIT_NAME);
        expect(errorMessageVerified)
            .toBeTruthy();
        done();
    });

    /**
     * Testing loading manifest with local entity declaration having a data partition with incremental trait.
     */
    it('TestFromDataPartitionWithIncrementalTrait', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestFromDataPartitionWithIncrementalTrait');
        let errorMessageVerified: boolean = false
        // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
        corpus.setEventCallback((level, message) => {
            if (message.indexOf('Failed to persist object \'UpsertPartition\'. This object contains the trait \'is.partition.incremental\', so it should not be in the collection \'dataPartitions\'. | fromData') !== -1) {
                errorMessageVerified = true;
            } else {
                fail(new Error('Some unexpected failure - ' + message));
            }
        }, cdmStatusLevel.warning);

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/entities.manifest.cdm.json');
        expect(manifest.entities.length)
            .toBe(1);
        expect(manifest.entities.allItems[0].objectType)
            .toBe(cdmObjectType.localEntityDeclarationDef);
        const entity: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(entity.dataPartitions.length)
            .toBe(1);
        expect(entity.dataPartitions.allItems[0].name)
            .toBe('TestingPartition');
        expect(errorMessageVerified)
            .toBeTruthy();
        done();
    });
    
    /*
    * Testing saving manifest with local entity declaration having an incremental partition without incremental trait.
    */
    it('TestToIncrementalPartitionWithoutTrait', async (done) => {
       const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestToIncrementalPartitionWithoutTrait');
       let errorMessageVerified: boolean = false
       // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
       corpus.setEventCallback((level, message) => {
           if (message.indexOf('Failed to persist object \'DeletePartition\'. This object does not contain the trait \'is.partition.incremental\', so it should not be in the collection \'incrementalPartitions\'. | toData') !== -1) {
               errorMessageVerified = true;
           } else {
               fail(new Error('Some unexpected failure - ' + message));
           }
       }, cdmStatusLevel.warning);

       const manifest: CdmManifestDefinition = new CdmManifestDefinition(corpus.ctx, 'manifest');
       corpus.storage.fetchRootFolder('local').documents.push(manifest);

       const entity: CdmEntityDefinition = new CdmEntityDefinition(corpus.ctx, 'entityName', undefined);
       createDocumentForEntity(corpus, entity);
       const localizedEntityDeclaration = manifest.entities.push(entity);

       const upsertIncrementalPartition = corpus.MakeObject<CdmDataPartitionDefinition>(cdmObjectType.dataPartitionDef, 'UpsertPartition', false);
       upsertIncrementalPartition.location = '/IncrementalData';
       upsertIncrementalPartition.specializedSchema = 'csv';
       upsertIncrementalPartition.exhibitsTraits.push(constants.INCREMENTAL_TRAIT_NAME, [['type', cdmIncrementalPartitionType[cdmIncrementalPartitionType.Upsert]]]);

       const deletePartition = corpus.MakeObject<CdmDataPartitionDefinition>(cdmObjectType.dataPartitionDef, 'DeletePartition', false);
       deletePartition.location = '/IncrementalData';
       deletePartition.specializedSchema = 'csv';
       localizedEntityDeclaration.incrementalPartitions.push(upsertIncrementalPartition);
       localizedEntityDeclaration.incrementalPartitions.push(deletePartition);

       using(enterScope('DataPartitionTest', corpus.ctx, 'TestToIncrementalPartitionWithoutTrait'), _ => {
            const manifestData = CdmFolder.ManifestPersistence.toData(manifest, undefined, undefined);
            expect(manifestData.entities.length)
                .toBe(1);
            const entityData: EntityDeclarationDefinition = manifestData.entities[0];
            expect(entityData.incrementalPartitions.length)
                .toBe(1);
            const partitionData: DataPartition = entityData.incrementalPartitions[0];
            expect(partitionData.name)
                .toBe('UpsertPartition');
            expect(partitionData.exhibitsTraits.length)
                .toBe(1);
            expect((partitionData.exhibitsTraits[0] as TraitReference).traitReference)
                .toBe(constants.INCREMENTAL_TRAIT_NAME);
        });

        expect(errorMessageVerified)
            .toBeTruthy();

       done();
    });

    /*
    * Testing saving manifest with local entity declaration having a data partition with incremental trait.
    */
    it('TestToDataPartitionWithIncrementalTrait', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestToDataPartitionWithIncrementalTrait');
        let errorMessageVerified: boolean = false
        // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
        corpus.setEventCallback((level, message) => {
            if (message.indexOf('Failed to persist object \'UpsertPartition\'. This object contains the trait \'is.partition.incremental\', so it should not be in the collection \'dataPartitions\'. | toData') !== -1) {
                errorMessageVerified = true;
            } else {
                fail(new Error('Some unexpected failure - ' + message));
            }
        }, cdmStatusLevel.warning);
    
        const manifest: CdmManifestDefinition = new CdmManifestDefinition(corpus.ctx, 'manifest');
        corpus.storage.fetchRootFolder('local').documents.push(manifest);
    
        const entity: CdmEntityDefinition = new CdmEntityDefinition(corpus.ctx, 'entityName', undefined);
        createDocumentForEntity(corpus, entity);
        const localizedEntityDeclaration = manifest.entities.push(entity);
    
        const upsertIncrementalPartition = corpus.MakeObject<CdmDataPartitionDefinition>(cdmObjectType.dataPartitionDef, 'UpsertPartition', false);
        upsertIncrementalPartition.location = '/IncrementalData';
        upsertIncrementalPartition.specializedSchema = 'csv';
        upsertIncrementalPartition.exhibitsTraits.push(constants.INCREMENTAL_TRAIT_NAME, [['type', cdmIncrementalPartitionType[cdmIncrementalPartitionType.Upsert]]]);
    
        const deletePartition = corpus.MakeObject<CdmDataPartitionDefinition>(cdmObjectType.dataPartitionDef, 'TestingPartition', false);
        deletePartition.location = '/testingData';
        deletePartition.specializedSchema = 'csv';
        localizedEntityDeclaration.dataPartitions.push(upsertIncrementalPartition);
        localizedEntityDeclaration.dataPartitions.push(deletePartition);
    
        using(enterScope('DataPartitionTest', corpus.ctx, 'TestToDataPartitionWithIncrementalTrait'), _ => {
                const manifestData = CdmFolder.ManifestPersistence.toData(manifest, undefined, undefined);
                expect(manifestData.entities.length)
                    .toBe(1);
                const entityData: EntityDeclarationDefinition = manifestData.entities[0];
                expect(entityData.dataPartitions.length)
                    .toBe(1);
                const partitionData: DataPartition = entityData.dataPartitions[0];
                expect(partitionData.name)
                    .toBe('TestingPartition');
            });
    
        expect(errorMessageVerified)
            .toBeTruthy();
    
        done();
    });
});
