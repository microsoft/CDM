// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import path = require('path');
import { LocalAdapter } from '../../../Storage';
import { CdmCorpusDefinition } from '../../../Cdm/CdmCorpusDefinition';
import { CdmDataPartitionDefinition } from '../../../Cdm/CdmDataPartitionDefinition';
import { CdmLocalEntityDeclarationDefinition } from '../../../Cdm/CdmLocalEntityDeclarationDefinition';
import { CdmManifestDefinition } from '../../../Cdm/CdmManifestDefinition';
import { cdmStatusLevel } from '../../../Cdm/cdmStatusLevel';
import { cdmObjectType } from '../../../Enums/cdmObjectType';
import { CdmEntityDefinition, cdmIncrementalPartitionType, cdmLogCode, CdmParameterDefinition, CdmReadPartitionFromPatternException, CdmTraitDefinition, CdmTraitReference, constants, fileStatusCheckOptions, partitionFileStatusCheckType } from '../../../internal';
import { CdmFolder } from '../../../Persistence';
import { resolveContext } from '../../../Utilities/resolveContext';
import { testHelper } from '../../testHelper';
import { CdmDataPartitionPatternDefinition } from '../../../Cdm/CdmDataPartitionPatternDefinition';
import { adlsTestHelper } from '../../adlsTestHelper';
import { OverrideFetchAllFilesAdapter } from '../../Storage/TestAdapters/OverrideFetchAllFilesAdapter';
import { NoOverrideAdapter } from '../../Storage/TestAdapters/NoOverrideAdapter';
import { FetchAllMetadataNullAdapter } from '../../Storage/TestAdapters/FetchAllMetadataNullAdapter';
import { FetchAllMetadataThrowErrorAdapter } from '../../Storage/TestAdapters/FetchAllMetadataThrowErrorAdapter';

// tslint:disable-next-line: max-func-body-length
describe('Cdm/DataPartitionPattern/DataPartitionPattern', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/DataPartitionPattern';

    /**
     * Tests refreshing files that match the regular expression
     */
    it('TestRefreshDataPartitionPatterns', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestRefreshDataPartitionPatterns');

        const cdmManifest: CdmManifestDefinition =
            await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('local:/patternManifest.manifest.cdm.json');

        const partitionEntity: CdmLocalEntityDeclarationDefinition =
            cdmManifest.entities.allItems[1] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.dataPartitions.length)
            .toBe(1);

        const timeBeforeLoad: Date = new Date();

        await cdmManifest.fileStatusCheckAsync();

        // file status check should check patterns and add two more partitions that match the pattern
        // should not re-add already existing partitions
        expect(partitionEntity.dataPartitions.length)
            .toBe(8);

        const partitionFromPattern: CdmDataPartitionDefinition = partitionEntity.dataPartitions.allItems[2];
        expect(partitionFromPattern.location)
            .toBe('partitions/someSubFolder/someSubPartition.csv');
        expect(partitionFromPattern.specializedSchema)
            .toBe('test special schema');

        expect(partitionFromPattern.lastFileStatusCheckTime >= timeBeforeLoad)
            .toBe(true);

        // inherits the exhibited traits from pattern
        expect(partitionFromPattern.exhibitsTraits.length)
            .toBe(1);
        expect(partitionFromPattern.exhibitsTraits.allItems[0].namedReference)
            .toBe('is');

        expect(partitionFromPattern.arguments.size)
            .toBe(1);
        expect(partitionFromPattern.arguments.has('testParam1'))
            .toBeTruthy();
        expect(partitionFromPattern.arguments.get('testParam1').length)
            .toBe(1);
        expect(partitionFromPattern.arguments.get('testParam1')[0])
            .toEqual('/someSubFolder/someSub');

        // captures pattern in folder
        const folderCapturePartition: CdmDataPartitionDefinition = partitionEntity.dataPartitions.allItems[3];
        expect(folderCapturePartition.location)
            .toBe('partitions/2018/folderCapture.csv');
        expect(folderCapturePartition.arguments.size)
            .toBe(1);
        expect(folderCapturePartition.arguments.get('year')[0])
            .toEqual('2018');

        // multiple capture groups in folder
        const multipleCapturePartition: CdmDataPartitionDefinition = partitionEntity.dataPartitions.allItems[4];
        expect(multipleCapturePartition.location)
            .toBe('partitions/2018/8/15/folderCapture.csv');
        expect(multipleCapturePartition.arguments.size)
            .toBe(3);
        expect(multipleCapturePartition.arguments.get('year')[0])
            .toEqual('2018');
        expect(multipleCapturePartition.arguments.get('month')[0])
            .toEqual('8');
        expect(multipleCapturePartition.arguments.get('day')[0])
            .toEqual('15');

        // multiple captures in the same capture group
        const multipleCaptureSameGroup: CdmDataPartitionDefinition = partitionEntity.dataPartitions.allItems[5];
        expect(multipleCaptureSameGroup.location)
            .toBe('partitions/2018/8/15/folderCaptureRepeatedGroup.csv');
        expect(multipleCaptureSameGroup.arguments.size)
            .toBe(1);
        expect(multipleCaptureSameGroup.arguments.get('day')[0])
            .toEqual('15');

        // tests where there are more captures than parameters
        const tooFewPartition: CdmDataPartitionDefinition = partitionEntity.dataPartitions.allItems[6];
        expect(tooFewPartition.location)
            .toBe('partitions/testTooFew.csv');
        expect(tooFewPartition.arguments.size)
            .toBe(0);

        // tests where there are fewer captures than parameters
        const tooManyPartition: CdmDataPartitionDefinition = partitionEntity.dataPartitions.allItems[7];
        expect(tooManyPartition.location)
            .toBe('partitions/testTooMany.csv');
        expect(tooManyPartition.arguments.size)
            .toBe(0);
    });

    /**
     * Tests data partition objects created by a partition pattern do not share the same trait with the partition pattern
     */
    it('TestRefreshesDataPartitionPatternsWithTrait', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestRefreshesDataPartitionPatternsWithTrait');
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/patternManifest.manifest.cdm.json');

        const partitionEntity: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.dataPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.dataPartitions.length)
            .toBe(0);

        const traitDef = new CdmTraitDefinition(corpus.ctx, 'testTrait');
        traitDef.parameters.allItems.push(new CdmParameterDefinition(corpus.ctx, 'argument value'));
        let patternTraitRef = partitionEntity.dataPartitionPatterns.allItems[0].exhibitsTraits.push('testTrait') as CdmTraitReference;
        patternTraitRef.arguments.push("int", 1);
        patternTraitRef.arguments.push("bool", true);
        patternTraitRef.arguments.push("string", 'a');

        await manifest.fileStatusCheckAsync();

        expect(partitionEntity.dataPartitions.length)
            .toBe(2);
        patternTraitRef = partitionEntity.dataPartitionPatterns.allItems[0].exhibitsTraits.item("testTrait") as CdmTraitReference;
        expect(patternTraitRef.arguments.allItems[0].value)
            .toBe(1);
        expect(patternTraitRef.arguments.allItems[1].value)
            .toBeTruthy();
        patternTraitRef.arguments.allItems[0].value = 3;
        patternTraitRef.arguments.allItems[1].value = false as unknown as object;

        let partitionTraitRef = partitionEntity.dataPartitions.allItems[0].exhibitsTraits.item("testTrait") as CdmTraitReference;
        expect(partitionTraitRef)
            .not.toBe(patternTraitRef);
        expect(partitionTraitRef.arguments.allItems[0].value)
            .toBe(1);
        expect(partitionTraitRef.arguments.allItems[1].value)
            .toBeTruthy();
        partitionTraitRef.arguments.allItems[0].value = 2;
        expect((partitionEntity.dataPartitions.allItems[1].exhibitsTraits.item("testTrait") as CdmTraitReference).arguments.allItems[0].value)
            .toBe(1);
    });

    /**
     * Tests refreshing incremental partition files that match the regular expression
     */
    it('TestIncrementalPatternsRefreshesFullAndIncremental', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestIncrementalPatternsRefreshesFullAndIncremental');
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/pattern.manifest.cdm.json');

        const partitionEntity: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.dataPartitions.length)
            .toBe(0);
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(0);
        expect(partitionEntity.dataPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(2);

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.FullAndIncremental);

        // Mac and Windows behave differently when listing file content, so we don't want to be strict about partition file order
        let totalExpectedPartitionsFound: number = 0;

        expect(partitionEntity.dataPartitions.length)
            .toBe(1);
        totalExpectedPartitionsFound++;
        expect(partitionEntity.dataPartitions.allItems[0].isIncremental)
            .toBeFalsy;

        for (const partition of partitionEntity.incrementalPartitions) {
            switch (partition.location) {
                case '/IncrementalData/2018/8/15/Deletes/delete1.csv':
                    totalExpectedPartitionsFound++;
                    expect(partition.arguments.size)
                        .toBe(4);
                    expect(partition.arguments.has('year'))
                        .toBeTruthy();
                    expect(partition.arguments.get('year')[0])
                        .toBe('2018');
                    expect(partition.arguments.has('month'))
                        .toBeTruthy();
                    expect(partition.arguments.get('month')[0])
                        .toBe('8');
                    expect(partition.arguments.has('day'))
                        .toBeTruthy();
                    expect(partition.arguments.get('day')[0])
                        .toBe('15');
                    expect(partition.arguments.has('deletePartitionNumber'))
                        .toBeTruthy();
                    expect(partition.arguments.get('deletePartitionNumber')[0])
                        .toBe('1');
                    expect(partition.exhibitsTraits.length)
                        .toBe(1);
                    const trait1: CdmTraitReference = partition.exhibitsTraits.allItems[0] as CdmTraitReference;
                    expect(trait1.fetchObjectDefinitionName())
                        .toBe(constants.INCREMENTAL_TRAIT_NAME);
                    expect(trait1.arguments.item(constants.INCREMENTAL_PATTERN_PARAMETER_NAME).getValue())
                        .toBe('DeletePattern');
                    expect(trait1.arguments.item('type').getValue())
                        .toBe(cdmIncrementalPartitionType[cdmIncrementalPartitionType.Delete]);
                    expect(trait1.arguments.item('fullDataPartitionPatternName').getValue())
                        .toBe('FullDataPattern');
                    break;
                case '/IncrementalData/2018/8/15/Deletes/delete2.csv':
                    totalExpectedPartitionsFound++;
                    expect(partition.arguments.size)
                        .toBe(4);
                    expect(partition.arguments.get('year')[0])
                        .toBe('2018');
                    expect(partition.arguments.get('month')[0])
                        .toBe('8');
                    expect(partition.arguments.get('day')[0])
                        .toBe('15');
                    expect(partition.arguments.get('deletePartitionNumber')[0])
                        .toBe('2');
                    const trait2: CdmTraitReference = partition.exhibitsTraits.allItems[0] as CdmTraitReference;
                    expect(trait2.fetchObjectDefinitionName())
                        .toBe(constants.INCREMENTAL_TRAIT_NAME);
                    expect(trait2.arguments.item(constants.INCREMENTAL_PATTERN_PARAMETER_NAME).getValue())
                        .toBe('DeletePattern');
                    expect(trait2.arguments.item('type').getValue())
                        .toBe(cdmIncrementalPartitionType[cdmIncrementalPartitionType.Delete]);
                    expect(trait2.arguments.item('fullDataPartitionPatternName').getValue())
                        .toBe('FullDataPattern');
                    break;
                case "/IncrementalData/2018/8/15/Upserts/upsert1.csv":
                    totalExpectedPartitionsFound++;
                    expect(partition.arguments.size)
                        .toBe(4);
                    expect(partition.arguments.get('year')[0])
                        .toBe('2018');
                    expect(partition.arguments.get('month')[0])
                        .toBe('8');
                    expect(partition.arguments.get('day')[0])
                        .toBe('15');
                    expect(partition.arguments.get('upsertPartitionNumber')[0])
                        .toBe('1');
                    expect(partition.exhibitsTraits.length)
                        .toBe(1);
                    const trait3: CdmTraitReference = partition.exhibitsTraits.allItems[0] as CdmTraitReference;
                    expect(trait3.fetchObjectDefinitionName())
                        .toBe(constants.INCREMENTAL_TRAIT_NAME);
                    expect(trait3.arguments.item(constants.INCREMENTAL_PATTERN_PARAMETER_NAME).getValue())
                        .toBe('UpsertPattern');
                    expect(trait3.arguments.item('type').getValue())
                        .toBe(cdmIncrementalPartitionType[cdmIncrementalPartitionType.Upsert]);
                    break;
                default:
                    totalExpectedPartitionsFound++;
                    break;
            }
        }
        expect(totalExpectedPartitionsFound)
            .toBe(4);
    });

    /**
     * Tests only refreshing delete type incremental partition files.
     */
    it('TestIncrementalPatternsRefreshesDeleteIncremental', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestIncrementalPatternsRefreshesDeleteIncremental');
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/pattern.manifest.cdm.json');

        // Test without incremental partition added
        const partitionEntity: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(0);
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(2);

        var traitRef0 = partitionEntity.incrementalPartitionPatterns.allItems[0].exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference;
        expect(traitRef0.arguments.item('type').getValue())
            .toBe(cdmIncrementalPartitionType[cdmIncrementalPartitionType.Upsert]);
        var traitRef1 = partitionEntity.incrementalPartitionPatterns.allItems[1].exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference;
        expect(traitRef1.arguments.item('type').getValue())
            .toBe(cdmIncrementalPartitionType[cdmIncrementalPartitionType.Delete]);

        let timeBeforeLoad: Date = new Date();
        timeBeforeLoad.setDate(timeBeforeLoad.getDate() - 1);

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental, cdmIncrementalPartitionType.Delete);
        let totalExpectedPartitionsFound: number = 0;
        for (const partition of partitionEntity.incrementalPartitions) {
            if (partition.lastFileStatusCheckTime > timeBeforeLoad) {
                totalExpectedPartitionsFound++;
                const traitRef = partition.exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference;
                expect(traitRef.arguments.item('type').getValue())
                    .toBe(cdmIncrementalPartitionType[cdmIncrementalPartitionType.Delete]);
            }
        }

        expect(totalExpectedPartitionsFound)
            .toBe(2);

        //////////////////////////////////////////////////////////////////

        // Test without incremental partition added
        partitionEntity.incrementalPartitions.clear();
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(0);

        timeBeforeLoad = new Date();
        timeBeforeLoad.setDate(timeBeforeLoad.getDate() - 1);
        const upsertIncrementalPartition = corpus.MakeObject<CdmDataPartitionDefinition>(cdmObjectType.dataPartitionDef, '2019UpsertPartition1', false);
        upsertIncrementalPartition.lastFileStatusCheckTime = timeBeforeLoad;
        upsertIncrementalPartition.location = '/IncrementalData/Upserts/upsert1.csv';
        upsertIncrementalPartition.exhibitsTraits.push(constants.INCREMENTAL_TRAIT_NAME, [['type', cdmIncrementalPartitionType[cdmIncrementalPartitionType.Upsert]]]);

        var deleteIncrementalPartition = corpus.MakeObject<CdmDataPartitionDefinition>(cdmObjectType.dataPartitionDef, "2019DeletePartition1", false);
        deleteIncrementalPartition.lastFileStatusCheckTime = timeBeforeLoad;
        deleteIncrementalPartition.location = '/IncrementalData/Deletes/delete1.csv';
        deleteIncrementalPartition.exhibitsTraits.push(constants.INCREMENTAL_TRAIT_NAME, [['type', cdmIncrementalPartitionType[cdmIncrementalPartitionType.Delete]]]);

        partitionEntity.incrementalPartitions.push(upsertIncrementalPartition);
        partitionEntity.incrementalPartitions.push(deleteIncrementalPartition);
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(2);
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(2);

        totalExpectedPartitionsFound = 0;

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental, cdmIncrementalPartitionType.Delete);

        for (const partition of partitionEntity.incrementalPartitions) {
            if (partition.lastFileStatusCheckTime > timeBeforeLoad) {
                totalExpectedPartitionsFound++;
                const traitRef = partition.exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference;
                expect(traitRef.arguments.item('type').getValue())
                    .toBe(cdmIncrementalPartitionType[cdmIncrementalPartitionType.Delete]);
            }
        }

        expect(totalExpectedPartitionsFound)
            .toBe(3);
    });

    /**
     * Tests refreshing partition pattern with invalid incremental partition trait and invalid arguments.
     */
    it('TestPatternRefreshesWithInvalidTraitAndArgument', async () => {
        // providing invalid enum value of CdmIncrementalPartitionType in string
        // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": "typo"}]
        let expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrEnumConversionFailure]);
        let corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestPatternRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        let manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/pattern.manifest.cdm.json');

        let partitionEntity: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitionPatterns.allItems[0].isIncremental)
            .toBeTruthy();

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental, cdmIncrementalPartitionType.Delete);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrEnumConversionFailure, true);

        //////////////////////////////////////////////////////////////////

        // providing invalid argument value - supply integer
        // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": 123}]
        expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrTraitInvalidArgumentValueType]);
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestPatternRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/pattern.manifest.cdm.json');

        partitionEntity = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitionPatterns.allItems[0].isIncremental)
            .toBeTruthy();
        let traitRef = partitionEntity.incrementalPartitionPatterns.allItems[0].exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference;
        traitRef.arguments.item('type').setValue(123)

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental, cdmIncrementalPartitionType.Delete);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrTraitInvalidArgumentValueType, true);

        //////////////////////////////////////////////////////////////////

        // not providing argument
        // "traitReference": "is.partition.incremental", "arguments": []]
        expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrTraitArgumentMissing]);
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestPatternRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/pattern.manifest.cdm.json');

        partitionEntity = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitionPatterns.allItems[0].isIncremental)
            .toBeTruthy();
        traitRef = partitionEntity.incrementalPartitionPatterns.allItems[0].exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference;
        traitRef.arguments.clear()

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental, cdmIncrementalPartitionType.Delete);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrTraitArgumentMissing, true);

        //////////////////////////////////////////////////////////////////

        // not trait argument
        expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrMissingIncrementalPartitionTrait]);
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestPatternRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/pattern.manifest.cdm.json');

        partitionEntity = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitionPatterns.allItems[0].isIncremental)
            .toBeTruthy();
        partitionEntity.incrementalPartitionPatterns.allItems[0].exhibitsTraits.clear()

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrMissingIncrementalPartitionTrait, true);

        //////////////////////////////////////////////////////////////////

        // data partition pattern in DataPartitionPatterns collection contains incremental partition trait
        expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrUnexpectedIncrementalPartitionTrait]);
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestPatternRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/pattern.manifest.cdm.json');

        partitionEntity = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitionPatterns.allItems[0].isIncremental)
            .toBeTruthy();
        const patternCopy: CdmDataPartitionPatternDefinition = partitionEntity.incrementalPartitionPatterns.allItems[0].copy(undefined);
        partitionEntity.dataPartitionPatterns.push(patternCopy)

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrUnexpectedIncrementalPartitionTrait, true);
    });

    /**
     * Tests refreshing partition with invalid incremental partition trait and invalid arguments.
     */
    it('TestPartitionRefreshesWithInvalidTraitAndArgument', async () => {
        // providing invalid enum value of CdmIncrementalPartitionType in string
        // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": "typo"}]
        let expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrEnumConversionFailure]);
        let corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestPartitionRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        let manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/partition.manifest.cdm.json');

        let partitionEntity: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitions.allItems[0].isIncremental)
            .toBeTruthy();

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental, cdmIncrementalPartitionType.Delete);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrEnumConversionFailure, true);

        //////////////////////////////////////////////////////////////////

        // providing invalid argument value - supply integer
        // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": 123}]
        expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrTraitInvalidArgumentValueType]);
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestPartitionRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/partition.manifest.cdm.json');

        partitionEntity = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitions.allItems[0].isIncremental)
            .toBeTruthy();
        let traitRef = partitionEntity.incrementalPartitions.allItems[0].exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference;
        traitRef.arguments.item('type').setValue(123)

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental, cdmIncrementalPartitionType.Delete);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrTraitInvalidArgumentValueType, true);

        //////////////////////////////////////////////////////////////////

        // not providing argument
        // "traitReference": "is.partition.incremental", "arguments": []]
        expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrTraitArgumentMissing]);
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestPartitionRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/partition.manifest.cdm.json');

        partitionEntity = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitions.allItems[0].isIncremental)
            .toBeTruthy();
        traitRef = partitionEntity.incrementalPartitions.allItems[0].exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference;
        traitRef.arguments.clear()

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental, cdmIncrementalPartitionType.Delete);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrTraitArgumentMissing, true);

        //////////////////////////////////////////////////////////////////

        // not trait argument
        expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrMissingIncrementalPartitionTrait]);
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestPartitionRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/partition.manifest.cdm.json');

        partitionEntity = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitions.allItems[0].isIncremental)
            .toBeTruthy();
        partitionEntity.incrementalPartitions.allItems[0].exhibitsTraits.clear()

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Incremental);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrMissingIncrementalPartitionTrait, true);

        //////////////////////////////////////////////////////////////////

        // data partition in DataPartitions collection contains incremental partition trait
        expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrUnexpectedIncrementalPartitionTrait]);
        corpus = testHelper.getLocalCorpus(testsSubpath, 'TestPartitionRefreshesWithInvalidTraitAndArgument', undefined, undefined, expectedLogCodes);
        manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/partition.manifest.cdm.json');

        partitionEntity = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitions.allItems[0].isIncremental)
            .toBeTruthy();
        const partitionCopy: CdmDataPartitionDefinition = partitionEntity.incrementalPartitions.allItems[0].copy(undefined);
        partitionEntity.dataPartitions.push(partitionCopy)

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrUnexpectedIncrementalPartitionTrait, true);
    });

    /**
     * Tests fileStatusCheckAsync(), fileStatusCheckAsync(partitionFileStatusCheckType.Full), and fileStatusCheckAsync(partitionFileStatusCheckType.None).
     */
    it('TestPartitionFileRefreshTypeFullOrNone', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestPartitionFileRefreshTypeFullOrNone');
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/pattern.manifest.cdm.json');

        // Test manifest.fileStatusCheckAsync();
        const partitionEntity: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.dataPartitions.length)
            .toBe(0);
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(0);
        expect(partitionEntity.dataPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(1);

        await manifest.fileStatusCheckAsync();
        expect(partitionEntity.dataPartitions.length)
            .toBe(1);
        expect(partitionEntity.dataPartitions.allItems[0].isIncremental)
            .toBeFalsy();
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(0);

        //////////////////////////////////////////////////////////////////

        // Test manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full);
        partitionEntity.dataPartitions.clear();
        partitionEntity.incrementalPartitions.clear();
        expect(partitionEntity.dataPartitions.length)
            .toBe(0);
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(0);
        expect(partitionEntity.dataPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(1);

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full);
        expect(partitionEntity.dataPartitions.length)
            .toBe(1);
        expect(partitionEntity.dataPartitions.allItems[0].isIncremental)
            .toBeFalsy();
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(0);

        //////////////////////////////////////////////////////////////////

        // Test manifest.fileStatusCheckAsync(partitionFileStatusCheckType.None);
        partitionEntity.dataPartitions.clear();
        partitionEntity.incrementalPartitions.clear();
        expect(partitionEntity.dataPartitions.length)
            .toBe(0);
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(0);
        expect(partitionEntity.dataPartitionPatterns.length)
            .toBe(1);
        expect(partitionEntity.incrementalPartitionPatterns.length)
            .toBe(1);

        await new Promise(f => setTimeout(f, 1000));
        const timeBeforeLoad: Date = new Date();
        expect(partitionEntity.lastFileStatusCheckTime < timeBeforeLoad)
            .toBe(true);

        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.None);

        expect(partitionEntity.dataPartitions.length)
            .toBe(0);
        expect(partitionEntity.incrementalPartitions.length)
            .toBe(0);
        expect(partitionEntity.lastFileStatusCheckTime >= timeBeforeLoad)
            .toBe(true);
    });

    /**
     * Testing that error is handled when partition pattern contains a folder that does not exist
     */
    it('TestPatternWithNonExistingFolder', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestPatternWithNonExistingFolder');
        const content: string = testHelper.getInputFileContent(testsSubpath, 'TestPatternWithNonExistingFolder', 'entities.manifest.cdm.json');
        const cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(corpus, undefined),
            'entities',
            'local',
            '/',
            JSON.parse(content));
        let errorLogged: number = 0;
        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (message.indexOf('Failed to fetch all files in the folder location \'local:/testLocation\' described by a partition pattern. Exception') !== -1) {
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
    });

    /**
     * Testing that partition is correctly found when namespace of pattern differs from namespace of the manifest
     */
    it('TestPatternWithDifferentNamespace', async () => {
        const testName: string = 'TestPatternWithDifferentNamespace';
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const localAdapter: LocalAdapter = cdmCorpus.storage.fetchAdapter('local') as LocalAdapter;
        const localPath: string = localAdapter.fullRoot;
        cdmCorpus.storage.mount('other', new LocalAdapter(path.join(localPath, 'other')));
        var cdmManifest = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('local:/patternManifest.manifest.cdm.json');

        await cdmManifest.fileStatusCheckAsync();

        expect(cdmManifest.entities.allItems[0].dataPartitions.length)
            .toBe(1);
    });

    /**
     * Testing that patterns behave correctly with variations to rootLocation
     */
    it('TestVariationsInRootLocation', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestVariationsInRootLocation');
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('pattern.manifest.cdm.json');
        await manifest.fileStatusCheckAsync();

        const startsWithSlash: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(startsWithSlash.dataPartitionPatterns.allItems[0].regularExpression)
            .toBe('.*testfile.csv');
        expect(startsWithSlash.dataPartitions.length)
            .toBe(1);
        expect(startsWithSlash.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');

        const endsWithSlash: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[1] as CdmLocalEntityDeclarationDefinition;
        expect(endsWithSlash.dataPartitionPatterns.allItems[0].regularExpression)
            .toBe('.*testfile.csv');
        expect(endsWithSlash.dataPartitions.length)
            .toBe(1);
        expect(endsWithSlash.dataPartitions.allItems[0].location)
            .toBe('partitions/testfile.csv');

        const noSlash: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[2] as CdmLocalEntityDeclarationDefinition;
        expect(noSlash.dataPartitionPatterns.allItems[0].regularExpression)
            .toBe('.*testfile.csv');
        expect(noSlash.dataPartitions.length)
            .toBe(1);
        expect(noSlash.dataPartitions.allItems[0].location)
            .toBe('partitions/testfile.csv');
    });

    /**
     * Testing data partition patterns that use glob patterns
     */
    it('TestPartitionPatternWithGlob', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestPartitionPatternWithGlob');

        let patternsWithGlobAndRegex: number = 0;
        corpus.setEventCallback(
            (level, msg) => {
                if (msg.indexOf('CdmDataPartitionPatternDefinition | The Data Partition Pattern contains both a glob pattern (/testfile.csv) and a regular expression (/subFolder/testSubFile.csv) set, the glob pattern will be used. | fileStatusCheckAsync') != -1) {
                    patternsWithGlobAndRegex++;
                }
            },
            cdmStatusLevel.warning);

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('pattern.manifest.cdm.json');
        await manifest.fileStatusCheckAsync();

        // one pattern object contains both glob and regex
        expect(patternsWithGlobAndRegex)
            .toBe(1);

        let index: number = 0;
        // make sure '.' in glob is not converted to '.' in regex
        const dotIsEscaped: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(dotIsEscaped.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('test.ile.csv');
        expect(dotIsEscaped.dataPartitions.length)
            .toBe(0);
        index++;

        // star pattern should match anything in the root folder
        const onlyStar: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(onlyStar.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('*');
        expect(onlyStar.dataPartitions.length)
            .toBe(1);
        expect(onlyStar.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        // star can match nothing
        const starNoMatch: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(starNoMatch.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/testfile*.csv');
        expect(starNoMatch.dataPartitions.length)
            .toBe(1);
        expect(starNoMatch.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        // star at root level
        // this should match any files at root level, none in subfolders
        const starAtRoot: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(starAtRoot.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/*.csv');
        expect(starAtRoot.dataPartitions.length)
            .toBe(1);
        expect(starAtRoot.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        // star at deeper level
        const starAtDeeperLevel: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(starAtDeeperLevel.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/*/*.csv');
        expect(starAtDeeperLevel.dataPartitions.length)
            .toBe(1);
        expect(starAtDeeperLevel.dataPartitions.allItems[0].location)
            .toBe('/partitions/subFolder/testSubFile.csv');
        index++;

        // pattern that ends with star
        const endsWithStar: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(endsWithStar.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/testfile*');
        expect(endsWithStar.dataPartitions.length)
            .toBe(1);
        expect(endsWithStar.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        // globstar (**) on its own matches
        const globStar: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(globStar.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('**');
        expect(globStar.dataPartitions.length)
            .toBe(2);
        expect(globStar.dataPartitions.allItems.filter((x: CdmDataPartitionDefinition) =>
            x.location === '/partitions/testfile.csv'
        ).length)
            .toBe(1);
        expect(globStar.dataPartitions.allItems.filter((x: CdmDataPartitionDefinition) =>
            x.location === '/partitions/subFolder/testSubFile.csv'
        ).length)
            .toBe(1);
        index++;

        // globstar at the beginning of the pattern
        const beginsWithGlobstar: CdmLocalEntityDeclarationDefinition =
            manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(beginsWithGlobstar.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/**.csv');
        expect(beginsWithGlobstar.dataPartitions.length)
            .toBe(1);
        expect(beginsWithGlobstar.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        // globstar at the end of the pattern
        const endsWithGlobstar: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(endsWithGlobstar.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/**');
        expect(endsWithGlobstar.dataPartitions.length)
            .toBe(2);
        expect(endsWithGlobstar.dataPartitions.allItems.filter((x: CdmDataPartitionDefinition) =>
            x.location === '/partitions/testfile.csv'
        ).length)
            .toBe(1);
        expect(endsWithGlobstar.dataPartitions.allItems.filter((x: CdmDataPartitionDefinition) =>
            x.location === '/partitions/subFolder/testSubFile.csv'
        ).length)
            .toBe(1);
        index++;

        // globstar matches zero or more folders
        const zeroOrMoreFolders: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(zeroOrMoreFolders.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/**/*.csv');
        expect(zeroOrMoreFolders.dataPartitions.length)
            .toBe(2);
        expect(zeroOrMoreFolders.dataPartitions.allItems.filter((x: CdmDataPartitionDefinition) =>
            x.location === '/partitions/testfile.csv'
        ).length)
            .toBe(1);
        expect(zeroOrMoreFolders.dataPartitions.allItems.filter((x: CdmDataPartitionDefinition) =>
            x.location === '/partitions/subFolder/testSubFile.csv'
        ).length)
            .toBe(1);
        index++;

        // globstar matches zero or more folders without starting slash
        const zeroOrMoreNoStartingSlash: CdmLocalEntityDeclarationDefinition =
            manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(zeroOrMoreNoStartingSlash.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/**/*.csv');
        expect(zeroOrMoreNoStartingSlash.dataPartitions.length)
            .toBe(2);
        expect(zeroOrMoreNoStartingSlash.dataPartitions.allItems.filter((x: CdmDataPartitionDefinition) =>
            x.location === '/partitions/testfile.csv'
        ).length)
            .toBe(1);
        expect(zeroOrMoreNoStartingSlash.dataPartitions.allItems.filter((x: CdmDataPartitionDefinition) =>
            x.location === '/partitions/subFolder/testSubFile.csv'
        ).length)
            .toBe(1);
        index++;

        // question mark in the middle of a pattern
        const questionMark: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(questionMark.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/test?ile.csv');
        expect(questionMark.dataPartitions.length)
            .toBe(1);
        expect(questionMark.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        // question mark at the beginning of a pattern
        const beginsWithQuestionMark: CdmLocalEntityDeclarationDefinition =
            manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(beginsWithQuestionMark.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/?estfile.csv');
        expect(beginsWithQuestionMark.dataPartitions.length)
            .toBe(1);
        expect(beginsWithQuestionMark.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        // question mark at the end of a pattern
        const endsWithQuestionMark: CdmLocalEntityDeclarationDefinition =
            manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(endsWithQuestionMark.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/testfile.cs?');
        expect(endsWithQuestionMark.dataPartitions.length)
            .toBe(1);
        expect(endsWithQuestionMark.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        // backslash in glob can match slash
        const backslashInPattern: CdmLocalEntityDeclarationDefinition =
            manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(backslashInPattern.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('\\testfile.csv');
        expect(backslashInPattern.dataPartitions.length)
            .toBe(1);
        expect(backslashInPattern.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        // pattern object includes glob pattern and regular expression
        const globAndRegex: CdmLocalEntityDeclarationDefinition =
            manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(globAndRegex.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/testfile.csv');
        expect(globAndRegex.dataPartitionPatterns.allItems[0].regularExpression)
            .toBe('/subFolder/testSubFile.csv');
        expect(globAndRegex.dataPartitions.length)
            .toBe(1);
        // matching this file means the glob pattern was (correctly) used
        expect(globAndRegex.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
    });

    /**
     * Testing data partition patterns that use glob patterns with variations in path style
     */
    it('TestGlobPathVariation', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestGlobPathVariation');

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('pattern.manifest.cdm.json');
        await manifest.fileStatusCheckAsync();

        let index: number = 0;
        const noSlash: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(noSlash.dataPartitionPatterns.allItems[0].rootLocation)
            .toBe('/partitions');
        expect(noSlash.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('*.csv');
        expect(noSlash.dataPartitions.length)
            .toBe(1);
        expect(noSlash.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        const rootLocationSlash: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(rootLocationSlash.dataPartitionPatterns.allItems[0].rootLocation)
            .toBe('/partitions/');
        expect(rootLocationSlash.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('*.csv');
        expect(rootLocationSlash.dataPartitions.length)
            .toBe(1);
        expect(rootLocationSlash.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        const globPatternSlash: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(globPatternSlash.dataPartitionPatterns.allItems[0].rootLocation)
            .toBe('/partitions');
        expect(globPatternSlash.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/*.csv');
        expect(globPatternSlash.dataPartitions.length)
            .toBe(1);
        expect(globPatternSlash.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        const bothSlash: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(bothSlash.dataPartitionPatterns.allItems[0].rootLocation)
            .toBe('/partitions/');
        expect(bothSlash.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('/*.csv');
        expect(bothSlash.dataPartitions.length)
            .toBe(1);
        expect(bothSlash.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        const noSlashOrStarAtStart: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(noSlashOrStarAtStart.dataPartitionPatterns.allItems[0].rootLocation)
            .toBe('/partitions/');
        expect(noSlashOrStarAtStart.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('t*.csv');
        expect(noSlashOrStarAtStart.dataPartitions.length)
            .toBe(1);
        expect(noSlashOrStarAtStart.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
        index++;

        const noSlashOrStarAndRootLocation: CdmLocalEntityDeclarationDefinition = manifest.entities.allItems[index] as CdmLocalEntityDeclarationDefinition;
        expect(noSlashOrStarAndRootLocation.dataPartitionPatterns.allItems[0].rootLocation)
            .toBe('/partitions');
        expect(noSlashOrStarAndRootLocation.dataPartitionPatterns.allItems[0].globPattern)
            .toBe('t*.csv');
        expect(noSlashOrStarAndRootLocation.dataPartitions.length)
            .toBe(1);
        expect(noSlashOrStarAndRootLocation.dataPartitions.allItems[0].location)
            .toBe('/partitions/testfile.csv');
    });

    /**
     *  Verifies that performing file status check on manifest with a partition with
     * null location is gracefully handled.
     */
    it('TestFileStatusCheckOnNullLocation', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestFileStatusCheckOnNullLocation');

        corpus.setEventCallback((level, message) => {
            if (level != cdmStatusLevel.error) {
                throw new Error('Error level message should have been reported');
            }

            if (message.indexOf('StorageManager | The object path cannot be null or empty. | createAbsoluteCorpusPath') == -1 &&
                message.indexOf('CdmCorpusDefinition | The object path cannot be null or empty. | getFileMetadataFromPartitionPathAsync') == -1) {
                throw new Error('Unexpected error message received');
            }
        }, cdmStatusLevel.warning);

        // Create manifest
        var manifest = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'TestModel');
        corpus.storage.fetchRootFolder('local').documents.push(manifest);

        // Create entity
        var entDoc = corpus.storage.fetchRootFolder('local').documents.push('MyEntityDoc.cdm.json');

        var entDef = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, 'MyEntity');
        entDoc.definitions.push(entDef);

        var entDecl = manifest.entities.push(entDef);

        // Create partition
        var part = corpus.MakeObject<CdmDataPartitionDefinition>(cdmObjectType.dataPartitionDef, 'MyPartition');
        entDecl.dataPartitions.push(part);

        // This should not throw exception
        await manifest.fileStatusCheckAsync();
    });

    /**
     * Test FetchAllFilesMetadata includes partition size and is added as a trait in FileStatusCheckAsync
     */
    it('TestFetchAllFilesMetadata', async () => {
        const expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrFetchingFileMetadataNull]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestFetchAllFilesMetadata', undefined, false, expectedLogCodes);
        const fileStatusCheckOptions: fileStatusCheckOptions = { includeDataPartitionSize: true };

        // test local adapter
        const localManifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('manifest.manifest.cdm.json');
        await localManifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full, cdmIncrementalPartitionType.None, fileStatusCheckOptions);

        const localDataPartitionList = localManifest.entities.allItems[0].dataPartitions.allItems;
        expect(localDataPartitionList.length)
            .toBe(1);
        const localTraitIndex: number = localDataPartitionList[0].exhibitsTraits.indexOf('is.partition.size');
        expect(localTraitIndex)
            .not.toBe(-1);
        const localTrait = localDataPartitionList[0].exhibitsTraits.allItems[localTraitIndex] as CdmTraitReference;
        expect(localTrait.namedReference)
            .toBe('is.partition.size');
        expect(localTrait.arguments.allItems[0].value)
            .toBe(2);

        if (adlsTestHelper.isAdlsEnvironmentEnabled()) {
            // test ADLS adapter
            corpus.storage.mount('adls', adlsTestHelper.createAdapterWithSharedKey());
            const adlsManifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('adlsManifest.manifest.cdm.json');
            await adlsManifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full, cdmIncrementalPartitionType.None, fileStatusCheckOptions);

            const adlsDataPartitionList = adlsManifest.entities.allItems[0].dataPartitions.allItems;
            expect(adlsDataPartitionList.length)
                .toBe(1);
            const adlsTraitIndex: number = adlsDataPartitionList[0].exhibitsTraits.indexOf('is.partition.size');
            expect(adlsTraitIndex)
                .not.toBe(-1);
            const adlsTrait = adlsDataPartitionList[0].exhibitsTraits.allItems[adlsTraitIndex] as CdmTraitReference;
            expect(adlsTrait.namedReference)
                .toBe('is.partition.size');
            expect(adlsTrait.arguments.allItems[0].value)
                .toBe(1);
        }

        const testLocalAdapter: LocalAdapter = corpus.storage.namespaceAdapters.get(corpus.storage.defaultNamespace) as LocalAdapter;

        // check that there are no errors when FetchAllFilesAsync is not overridden, uses method from StorageAdapterBase
        corpus.storage.mount('noOverride', new NoOverrideAdapter(testLocalAdapter));
        const noOverrideManifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('noOverride:/manifest.manifest.cdm.json');
        await noOverrideManifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full, cdmIncrementalPartitionType.None, fileStatusCheckOptions);

        const noOverridePartitionList = noOverrideManifest.entities.allItems[0].dataPartitions;
        expect(noOverridePartitionList.length)
            .toBe(0);

        // check that there are no errors when FetchAllFilesMetadataAsync is not overridden
        corpus.storage.mount('overrideFetchAll', new OverrideFetchAllFilesAdapter(testLocalAdapter));
        const overrideFetchAllManifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('overrideFetchAll:/manifest.manifest.cdm.json');
        await overrideFetchAllManifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full, cdmIncrementalPartitionType.None, fileStatusCheckOptions);

        const overrideFetchDataPartitionList = overrideFetchAllManifest.entities.allItems[0].dataPartitions;
        expect(overrideFetchDataPartitionList.length)
            .toBe(1);
        const overrideFetchTraitIndex: number = overrideFetchDataPartitionList.allItems[0].exhibitsTraits.indexOf('is.partition.size');
        expect(overrideFetchTraitIndex)
            .toBe(-1);
        expect(overrideFetchDataPartitionList.allItems[0].exhibitsTraits.length)
            .toBe(1);

        // check that error is correctly logged when FetchAllFilesMetadata is misconfigured and returns null
        corpus.storage.mount('fetchNull', new FetchAllMetadataNullAdapter(testLocalAdapter));
        var fetchNullManifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('fetchNull:/manifest.manifest.cdm.json');
        await fetchNullManifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full, cdmIncrementalPartitionType.None, fileStatusCheckOptions);
    });

    /**
     * Test Regex Timeout handled correctly
     */
    it('TestRegexTimeout', async () => {
        const expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrRegexTimeout]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestFetchAllFilesMetadata', undefined, false, expectedLogCodes);
        const fileStatusCheckOptions: fileStatusCheckOptions = { regexTimeoutSeconds: 0 };

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('manifest.manifest.cdm.json');
        await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full, cdmIncrementalPartitionType.None, fileStatusCheckOptions);
    });
    
    /*
    * Test that error is thrown when FileStatusCheckOption is set
    */
    it('TestThrowOnPartitionError', async () => {
        const expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.WarnPartitionFileFetchFailed]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestFetchAllFilesMetadata', undefined, false, expectedLogCodes);
        const testLocalAdapter: LocalAdapter = corpus.storage.namespaceAdapters.get(corpus.storage.defaultNamespace) as LocalAdapter;
        corpus.storage.mount("error", new FetchAllMetadataThrowErrorAdapter(testLocalAdapter));
        const fileStatusCheckOptions: fileStatusCheckOptions = { throwOnPartitionError: true };

        let manifestThrowsError: boolean = false;
        let entityDecThrowsError: boolean = false;
        let partitionPatternThrowsError: boolean = false;

        var manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('error:/manifest.manifest.cdm.json');

        try {
            await manifest.fileStatusCheckAsync(partitionFileStatusCheckType.Full, cdmIncrementalPartitionType.None, fileStatusCheckOptions);
        } catch (e) {
            expect(e instanceof CdmReadPartitionFromPatternException).toBeTruthy();
            expect(e.innerException).not.toBeUndefined();
            expect('Some test error message').toBe((e as CdmReadPartitionFromPatternException).innerException.message);
            manifestThrowsError = true;
        }

        var entityDec = manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;

        try {
            await entityDec.fileStatusCheckAsync(partitionFileStatusCheckType.Full, cdmIncrementalPartitionType.None, fileStatusCheckOptions);
        } catch (e) {
            expect(e instanceof CdmReadPartitionFromPatternException).toBeTruthy();
            expect(e.innerException).not.toBeUndefined();
            expect('Some test error message').toBe((e as CdmReadPartitionFromPatternException).innerException.message);
            entityDecThrowsError = true;
        }

        const partitionPattern: CdmDataPartitionPatternDefinition = (manifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition).dataPartitionPatterns.allItems[0];

        try {
            await partitionPattern.fileStatusCheckAsync(fileStatusCheckOptions);
        } catch (e) {
            console.log(e.message);
            expect(e instanceof CdmReadPartitionFromPatternException).toBeTruthy();
            expect(e.innerException).not.toBeUndefined();
            expect('Some test error message').toBe((e as CdmReadPartitionFromPatternException).innerException.message);
            partitionPatternThrowsError = true;
        }

        expect(manifestThrowsError && entityDecThrowsError && partitionPatternThrowsError).toBeTruthy();
    });
});
