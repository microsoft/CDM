// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


import { using } from 'using-statement';
import { createDocumentForEntity } from '../../../Cdm/CdmCollection/CdmCollectionHelperFunctions';
import {
    CdmCorpusDefinition,
    CdmDataPartitionPatternDefinition,
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
    resolveOptions
} from '../../../../internal';
import { CdmFolder } from '../../../../Persistence';
import { DataPartitionPattern, EntityDeclarationDefinition, ManifestContent, TraitReference } from '../../../../Persistence/CdmFolder/types';
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

    /**
     * Testing loading manifest with local entity declaration having an incremental partition pattern without incremental trait.
     */
     it('TestFromIncrementalPartitionPatternWithoutTrait', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestFromIncrementalPartitionPatternWithoutTrait');
        let errorMessageVerified: boolean = false
        // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
        corpus.setEventCallback((level, message) => {
            if (message.indexOf('Failed to persist object \'DeletePattern\'. This object does not contain the trait \'is.partition.incremental\', so it should not be in the collection \'incrementalPartitionPatterns\'. | fromData') !== -1) {
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
        expect(entity.incrementalPartitionPatterns.length)
            .toBe(1);
        const incrementalPartitionPattern = entity.incrementalPartitionPatterns.allItems[0]
        expect(incrementalPartitionPattern.name)
            .toBe('UpsertPattern');
        expect(incrementalPartitionPattern.exhibitsTraits.length)
            .toBe(1);
        expect(incrementalPartitionPattern.exhibitsTraits.allItems[0].fetchObjectDefinitionName())
            .toBe(constants.INCREMENTAL_TRAIT_NAME);
        expect(errorMessageVerified)
            .toBeTruthy();
        done();
    });

    /**
     * Testing loading manifest with local entity declaration having a data partition pattern with incremental trait.
     */
    it('TestFromDataPartitionPatternWithIncrementalTrait', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestFromDataPartitionPatternWithIncrementalTrait');
        let errorMessageVerified: boolean = false
        // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
        corpus.setEventCallback((level, message) => {
            if (message.indexOf('Failed to persist object \'UpsertPattern\'. This object contains the trait \'is.partition.incremental\', so it should not be in the collection \'dataPartitionPatterns\'. | fromData') !== -1) {
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
        expect(entity.dataPartitionPatterns.length)
            .toBe(1);
        expect(entity.dataPartitionPatterns.allItems[0].name)
            .toBe('TestingPattern');
        expect(errorMessageVerified)
            .toBeTruthy();
        done();
    });
    
    /*
    * Testing saving manifest with local entity declaration having an incremental partition pattern without incremental trait.
    */
    it('TestToIncrementalPartitionPatternWithoutTrait', async (done) => {
       const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestToIncrementalPartitionPatternWithoutTrait');
       let errorMessageVerified: boolean = false
       // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
       corpus.setEventCallback((level, message) => {
           if (message.indexOf('Failed to persist object \'DeletePartitionPattern\'. This object does not contain the trait \'is.partition.incremental\', so it should not be in the collection \'incrementalPartitionPatterns\'. | toData') !== -1) {
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

       const upsertIncrementalPartitionPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(cdmObjectType.dataPartitionPatternDef, 'UpsertPattern', false);
       upsertIncrementalPartitionPattern.rootLocation = '/IncrementalData';
       upsertIncrementalPartitionPattern.regularExpression = '/(.*)/(.*)/(.*)/Upserts/upsert(\\d+)\\.csv$';
       upsertIncrementalPartitionPattern.parameters = ['year', 'month', 'day', 'upsertPartitionNumber' ];
       upsertIncrementalPartitionPattern.exhibitsTraits.push(constants.INCREMENTAL_TRAIT_NAME, [['type', cdmIncrementalPartitionType[cdmIncrementalPartitionType.Upsert]]]);

       const deletePartitionPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(cdmObjectType.dataPartitionPatternDef, 'DeletePartitionPattern', false);
       deletePartitionPattern.rootLocation = '/IncrementalData';
       deletePartitionPattern.regularExpression = '/(.*)/(.*)/(.*)/Delete/delete(\\d+)\\.csv$';
       deletePartitionPattern.parameters = ['year', 'month', 'day', 'detelePartitionNumber' ];
       localizedEntityDeclaration.incrementalPartitionPatterns.push(upsertIncrementalPartitionPattern);
       localizedEntityDeclaration.incrementalPartitionPatterns.push(deletePartitionPattern);

       using(enterScope('DataPartitionPatternTest', corpus.ctx, 'TestToIncrementalPartitionPatternWithoutTrait'), _ => {
            const manifestData = CdmFolder.ManifestPersistence.toData(manifest, undefined, undefined);
            expect(manifestData.entities.length)
                .toBe(1);
            const entityData: EntityDeclarationDefinition = manifestData.entities[0];
            expect(entityData.incrementalPartitionPatterns.length)
                .toBe(1);
            const patternData: DataPartitionPattern = entityData.incrementalPartitionPatterns[0];
            expect(patternData.name)
                .toBe('UpsertPattern');
            expect(patternData.exhibitsTraits.length)
                .toBe(1);
            expect((patternData.exhibitsTraits[0] as TraitReference).traitReference)
                .toBe(constants.INCREMENTAL_TRAIT_NAME);
        });

        expect(errorMessageVerified)
            .toBeTruthy();

       done();
    });

    /*
    * Testing saving manifest with local entity declaration having a data partition pattern with incremental trait.
    */
    it('TestToDataPartitionPatternWithIncrementalTrait', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestToDataPartitionPatternWithIncrementalTrait');
        let errorMessageVerified: boolean = false
        // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
        corpus.setEventCallback((level, message) => {
            if (message.indexOf('Failed to persist object \'UpsertPartitionPattern\'. This object contains the trait \'is.partition.incremental\', so it should not be in the collection \'dataPartitionPatterns\'. | toData') !== -1) {
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
    
        const upsertIncrementalPartitionPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(cdmObjectType.dataPartitionPatternDef, 'UpsertPartitionPattern', false);
        upsertIncrementalPartitionPattern.rootLocation = '/IncrementalData';
        upsertIncrementalPartitionPattern.exhibitsTraits.push(constants.INCREMENTAL_TRAIT_NAME, [['type', cdmIncrementalPartitionType[cdmIncrementalPartitionType.Upsert]]]);
    
        const deletePartitionPattern = corpus.MakeObject<CdmDataPartitionPatternDefinition>(cdmObjectType.dataPartitionPatternDef, 'TestingPartitionPattern', false);
        deletePartitionPattern.rootLocation = '/IncrementalData';
        localizedEntityDeclaration.dataPartitionPatterns.push(upsertIncrementalPartitionPattern);
        localizedEntityDeclaration.dataPartitionPatterns.push(deletePartitionPattern);
    
        using(enterScope('DataPartitionPatternTest', corpus.ctx, 'TestToDataPartitionPatternWithIncrementalTrait'), _ => {
                const manifestData = CdmFolder.ManifestPersistence.toData(manifest, undefined, undefined);
                expect(manifestData.entities.length)
                    .toBe(1);
                const entityData: EntityDeclarationDefinition = manifestData.entities[0];
                expect(entityData.dataPartitionPatterns.length)
                    .toBe(1);
                const patternData: DataPartitionPattern = entityData.dataPartitionPatterns[0];
                expect(patternData.name)
                    .toBe('TestingPartitionPattern');
            });
    
        expect(errorMessageVerified)
            .toBeTruthy();
    
        done();
    });
});
