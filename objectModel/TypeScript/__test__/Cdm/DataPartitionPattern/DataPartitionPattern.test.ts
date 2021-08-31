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
import { CdmEntityDefinition } from '../../../internal';
import { CdmFolder } from '../../../Persistence';
import { resolveContext } from '../../../Utilities/resolveContext';
import { testHelper } from '../../testHelper';

// tslint:disable-next-line: max-func-body-length
describe('Cdm/DataPartitionPattern/DataPartitionPattern', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/DataPartitionPattern';

    /**
     * Tests refreshing files that match the regular expression
     */
    it('TestRefreshDataPartitionPatterns', async (done) => {
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
        done();
    });

    /**
     * Testing that error is handled when partition pattern contains a folder that does not exist
     */
    it('TestPatternWithNonExistingFolder', async (done) => {
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
        done();
    });

    /**
     * Testing that partition is correctly found when namespace of pattern differs from namespace of the manifest
     */
    it('TestPatternWithDifferentNamespace', async (done) => {
        const testName: string = 'TestPatternWithDifferentNamespace';
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const localAdapter: LocalAdapter = cdmCorpus.storage.fetchAdapter('local') as LocalAdapter;
        const localPath: string = localAdapter.fullRoot;
        cdmCorpus.storage.mount('other', new LocalAdapter(path.join(localPath, 'other')));
        var cdmManifest = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('local:/patternManifest.manifest.cdm.json');

        await cdmManifest.fileStatusCheckAsync();

        expect(cdmManifest.entities.allItems[0].dataPartitions.length)
            .toBe(1);
        done();
    });

    /**
     * Testing that patterns behave correctly with variations to rootLocation
     */
    it('TestVariationsInRootLocation', async (done) => {
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
        done();
    });

    /**
     * Testing data partition patterns that use glob patterns
     */
    it('TestPartitionPatternWithGlob', async (done) => {
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

        done();
    });

    /**
     * Testing data partition patterns that use glob patterns with variations in path style
     */
    it('TestGlobPathVariation', async (done) => {
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

        done();
    });

    /**
     *  Verifies that performing file status check on manifest with a partition with
     * null location is gracefully handled.
     */
    it('TestFileStatusCheckOnNullLocation', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestFileStatusCheckOnNullLocation');

        corpus.setEventCallback((level, message) => {
            if (level != cdmStatusLevel.error) {
                fail(new Error('Error level message should have been reported'));
            }

            if (message.indexOf('StorageManager | The object path cannot be null or empty. | createAbsoluteCorpusPath') == -1 &&
                message.indexOf('CdmCorpusDefinition | The object path cannot be null or empty. | getLastModifiedTimeFromPartitionPathAsync') == -1) {
                fail(new Error('Unexpected error message received'));
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
});
