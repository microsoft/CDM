// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmLocalEntityDeclarationDefinition,
    CdmManifestDeclarationDefinition,
    CdmManifestDefinition,
    cdmStatusLevel,
    cdmLogCode,
    resolveContext
} from '../../../../internal';
import { CdmFolder } from '../../../../Persistence';
import { ManifestContent } from '../../../../Persistence/CdmFolder/types';
import { ManifestPersistence } from '../../../../Persistence/CdmFolder/ManifestPersistence';
import { LocalAdapter } from '../../../../Storage';
import * as timeUtils from '../../../../Utilities/timeUtils';
import { testHelper } from '../../../testHelper';

// tslint:disable-next-line: max-func-body-length
describe('Persistence.CdmFolder.Manifest', () => {
    /// <summary>
    /// The path between TestDataPath and TestName.
    /// </summary>
    const testsSubpath: string = 'Persistence/CdmFolder/Manifest';

    /**
     * Testing for manifest impl instance with no entities and no submanifests.
     */
    it('TestLoadFolderWithNoEntityFolders', () => {
        const content: string = testHelper.getInputFileContent(
            testsSubpath,
            'TestLoadFolderWithNoEntityFolders',
            'empty.manifest.cdm.json'
        );

        const cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'cdmTest', 'someNamespace', '/', JSON.parse(content));
        expect(cdmManifest.getName())
            .toBe('cdmTest');
        expect(cdmManifest.manifestName)
            .toBe('cdmTest');
        expect(cdmManifest.schema)
            .toBe('CdmManifestDefinition.cdm.json');
        expect(cdmManifest.jsonSchemaSemanticVersion)
            .toBe('1.0.0');
        expect(cdmManifest.lastFileModifiedTime.toUTCString())
            .toBe('Mon, 15 Sep 2008 23:53:23 GMT');
        expect(cdmManifest.explanation)
            .toBe('test cdm folder for cdm version 1.0+');
        expect(cdmManifest.imports.length)
            .toBe(1);
        expect(cdmManifest.imports.allItems[0].corpusPath)
            .toBe('/primitives.cdm.json');
        expect(cdmManifest.entities.length)
            .toBe(0);
        expect(cdmManifest.exhibitsTraits.length)
            .toBe(1);
        expect(cdmManifest.subManifests.length)
            .toBe(0);
    });

    /**
     * Tests for manifests with everything.
     */
    it('TestManifestWithEverything', () => {
        let content: string = testHelper.getInputFileContent(testsSubpath, 'TestManifestWithEverything', 'complete.manifest.cdm.json');
        let cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'docName', 'someNamespace', '', JSON.parse(content));

        expect(cdmManifest.subManifests.length)
            .toBe(1);
        expect(cdmManifest.entities.length)
            .toBe(2);
        expect(cdmManifest.manifestName)
            .toBe('cdmTest');

        content = testHelper.getInputFileContent(testsSubpath, 'TestManifestWithEverything', 'noname.manifest.cdm.json');
        cdmManifest = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'docName.manifest.cdm.json', 'someNamespace', '/', JSON.parse(content));

        expect(cdmManifest.subManifests.length)
            .toBe(1);
        expect(cdmManifest.entities.length)
            .toBe(2);
        expect(cdmManifest.manifestName)
            .toBe('docName');
    });

    /**
     * Tests for back-comp folio loading.
     */
    it('TestFolioWithEverything', () => {
        let content: string = testHelper.getInputFileContent(testsSubpath, 'TestFolioWithEverything', 'complete.folio.cdm.json');
        let cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'docName', 'someNamespace', '', JSON.parse(content));

        expect(cdmManifest.subManifests.length)
            .toBe(1);
        expect(cdmManifest.entities.length)
            .toBe(2);
        expect(cdmManifest.manifestName)
            .toBe('cdmTest');

        content = testHelper.getInputFileContent(testsSubpath, 'TestFolioWithEverything', 'noname.folio.cdm.json');
        cdmManifest = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'docName.folio.cdm.json', 'someNamespace', '/', JSON.parse(content));

        expect(cdmManifest.subManifests.length)
            .toBe(1);
        expect(cdmManifest.entities.length)
            .toBe(2);
        expect(cdmManifest.manifestName)
            .toBe('docName');
    });

    /**
     * Test for copy data.
     */
    it('TestManifestForCopyData', () => {
        const content: string = testHelper.getInputFileContent(testsSubpath, 'TestManifestForCopyData', 'complete.manifest.cdm.json');
        const cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), 'cdmTest', 'someNamespace', '/', JSON.parse(content));
        const manifestObject: ManifestContent = ManifestPersistence.toData(cdmManifest, undefined, undefined);
        expect(manifestObject.$schema)
            .toBe('CdmManifestDefinition.cdm.json');
        expect(manifestObject.jsonSchemaSemanticVersion)
            .toBe('1.0.0');
        expect(manifestObject.documentVersion)
            .toBe('2.0.0');
        expect(manifestObject.manifestName)
            .toBe('cdmTest');
        expect(manifestObject.explanation)
            .toBe('test cdm folder for cdm version 1.0+');
        expect(manifestObject.imports.length)
            .toBe(1);
        expect(manifestObject.imports[0].corpusPath)
            .toBe('/primitives.cdm.json');
        expect(manifestObject.exhibitsTraits.length)
            .toBe(1);
        expect(manifestObject.entities.length)
            .toBe(2);
        expect(manifestObject.entities[0].entityName)
            .toBe('testEntity');
        expect(manifestObject.subManifests.length)
            .toBe(1);
        expect(manifestObject.subManifests[0].definition)
            .toBe('test definition');
        expect(manifestObject.lastFileModifiedTime)
            .toBeUndefined();
    });

    /**
     * Test modified times for manifest and files beneath it
     * (loads and sets modified times correctly)
     */
    it('TestLoadsAndSetsTimesCorrectly', async (done) => {
        const timeBeforeLoad: Date = new Date();

        const inputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestLoadsAndSetsTimesCorrectly');
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestLoadsAndSetsTimesCorrectly');
        cdmCorpus.setEventCallback((level, msg) => {
            done.fail(new Error('Unexpected log: ' + msg));
        }, cdmStatusLevel.warning)
        cdmCorpus.storage.mount('someNamespace', new LocalAdapter(inputPath));
        cdmCorpus.storage.unMount('cdm');

        const cdmManifest: CdmManifestDefinition =
            await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('someNamespace:/default.manifest.cdm.json');
        const statusTimeAtLoad: Date = cdmManifest.lastFileStatusCheckTime;
        // hard coded because the time comes from inside the file
        expect(timeUtils.getFormattedDateString(statusTimeAtLoad))
            .toBe('2019-02-01T15:36:19.410Z');

        // waits 100 milliseconds
        // tslint:disable-next-line: no-string-based-set-timeout
        await new Promise((resolve: TimerHandler): number => setTimeout(resolve, 100));

        expect(!!cdmManifest._fileSystemModifiedTime)
            .toBe(true);
        expect(cdmManifest._fileSystemModifiedTime < timeBeforeLoad)
            .toBe(true);

        await cdmManifest.fileStatusCheckAsync();

        expect(cdmManifest.lastFileStatusCheckTime > timeBeforeLoad)
            .toBe(true);
        expect(cdmManifest.lastFileStatusCheckTime > statusTimeAtLoad)
            .toBe(true);
        expect(cdmManifest.subManifests.length)
            .toBe(1);
        expect(cdmManifest.subManifests.allItems[0].lastFileStatusCheckTime > timeBeforeLoad)
            .toBe(true);
        expect(cdmManifest.entities.length)
            .toBe(1);
        expect((cdmManifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition).dataPartitions.length)
            .toBe(1);

        const entity: CdmLocalEntityDeclarationDefinition = cdmManifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        const subManifest: CdmManifestDeclarationDefinition = cdmManifest.subManifests.allItems[0];
        const maxTime: Date = timeUtils.maxTime(entity.lastFileModifiedTime, subManifest.lastFileModifiedTime);
        expect(timeUtils.getFormattedDateString(cdmManifest.lastChildFileModifiedTime))
            .toBe(timeUtils.getFormattedDateString(maxTime));
        done();
    });

    /**
     * Checks Absolute corpus path can be created with valid input.
     */
    it('TestValidRootPath', () => {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();

        // Set empty callback to avoid breaking tests due too many errors in logs,
        // change the event callback to console or file status report if wanted.
        // tslint:disable-next-line: no-empty
        corpus.setEventCallback(() => { }, cdmStatusLevel.error);

        // checks with null object
        let absolutePath: string = corpus.storage.createAbsoluteCorpusPath('Abc/Def');
        expect(absolutePath)
            .toEqual('/Abc/Def');

        absolutePath = corpus.storage.createAbsoluteCorpusPath('/Abc/Def');
        expect(absolutePath)
            .toEqual('/Abc/Def');

        absolutePath = corpus.storage.createAbsoluteCorpusPath('cdm:/Abc/Def');
        expect(absolutePath)
            .toEqual('cdm:/Abc/Def');

        const obj: CdmManifestDefinition = new CdmManifestDefinition(undefined, undefined);
        obj.namespace = '';
        obj.folderPath = 'Mnp/Qrs/';
        absolutePath = corpus.storage.createAbsoluteCorpusPath('Abc/Def', obj);
        expect(absolutePath)
            .toEqual('Mnp/Qrs/Abc/Def');

        obj.namespace = 'cdm';
        obj.folderPath = 'Mnp/Qrs/';
        absolutePath = corpus.storage.createAbsoluteCorpusPath('/Abc/Def', obj);
        expect(absolutePath)
            .toEqual('cdm:/Abc/Def');

        obj.namespace = 'cdm';
        obj.folderPath = 'Mnp/Qrs/';
        absolutePath = corpus.storage.createAbsoluteCorpusPath('Abc/Def', obj);
        expect(absolutePath)
            .toEqual('cdm:Mnp/Qrs/Abc/Def');
    });

    /**
     * FolderPath should always end in a /
     * This checks the behavior if FolderPath does not end with a /
     * ( '/' should be appended and a warning be sent through callback function)
     */
    it('TestPathThatDoesNotEndInSlash', () => {
        var expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.WarnStorageExpectedPathPrefix]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestPathThatDoesNotEndInSlash', undefined, false, expectedLogCodes, true);
        const obj: CdmManifestDefinition = new CdmManifestDefinition(undefined, undefined);
        obj.folderPath = 'Mnp';
        obj.namespace = 'cdm';

        const absolutePath: string = corpus.storage.createAbsoluteCorpusPath('Abc', obj);
        expect(absolutePath)
            .toEqual('cdm:Mnp/Abc');

        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.WarnStorageExpectedPathPrefix, true);
    });

    /**
     * Tests absolute paths cannot be created with wrong parameters.
     * Checks behavior if objectPath is invalid.
     */
    it('TestPathRootInvalidObjectPath', () => {
        var expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrStorageInvalidPathFormat]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestPathRootInvalidObjectPath', undefined, false, expectedLogCodes, true);

        corpus.storage.createAbsoluteCorpusPath('./Abc');
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidPathFormat, true);

        corpus.storage.createAbsoluteCorpusPath('/./Abc');
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidPathFormat, true);

        corpus.storage.createAbsoluteCorpusPath('../Abc');
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidPathFormat, true);

        corpus.storage.createAbsoluteCorpusPath('Abc/../Def');
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidPathFormat, true);
    });

    /**
     * Tests absolute paths cannot be created with wrong parameters.
     * Checks behavior if FolderPath is invalid.
     */
    it('TestPathRootInvalidFolderPath', () => {
        var expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.ErrStorageInvalidPathFormat]);
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestPathRootInvalidFolderPath', undefined, false, expectedLogCodes, true);

        let obj: CdmManifestDefinition = new CdmManifestDefinition(undefined, undefined);
        obj.namespace = 'cdm';
        obj.folderPath = './Mnp';
        corpus.storage.createAbsoluteCorpusPath('Abc', obj);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidPathFormat, true);

        obj = new CdmManifestDefinition(undefined, undefined);
        obj.namespace = 'cdm';
        obj.folderPath = '/./Mnp';
        corpus.storage.createAbsoluteCorpusPath('Abc', obj);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidPathFormat, true);

        obj = new CdmManifestDefinition(undefined, undefined);
        obj.namespace = 'cdm';
        obj.folderPath = '../Mnp';
        corpus.storage.createAbsoluteCorpusPath('Abc', obj);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidPathFormat, true);

        obj = new CdmManifestDefinition(undefined, undefined);
        obj.namespace = 'cdm';
        obj.folderPath = 'Mnp/./Qrs';
        corpus.storage.createAbsoluteCorpusPath('Abc', obj);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidPathFormat, true);

        obj = new CdmManifestDefinition(undefined, undefined);
        obj.namespace = 'cdm';
        obj.folderPath = 'Mnp/../Qrs';
        corpus.storage.createAbsoluteCorpusPath('Abc', obj);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidPathFormat, true);
    });

        /**
         * Testpassing blank or empty values for manifest schema, name etc.
         */
        it('TestManifestWithBlankFields', () => {
            const content: string = testHelper.getInputFileContent(
                testsSubpath,
                'testManifestWithBlankFields',
                'blank.manifest.cdm.json'
            );
    
            const cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
                new resolveContext(new CdmCorpusDefinition(), undefined), 'cdmTest', 'someNamespace', '/', JSON.parse(content));
            expect(cdmManifest.getName())
                .toBe('cdmTest');
            expect(cdmManifest.schema)
                .toBeUndefined();
            expect(cdmManifest.documentVersion)
                .toBeUndefined();
            expect(cdmManifest.lastFileModifiedTime.toUTCString())
                .toBe('Mon, 15 Sep 2008 23:53:23 GMT');
            expect(cdmManifest.explanation)
                .toBe('test cdm folder for cdm version 1.0+');
            expect(cdmManifest.imports.length)
                .toBe(1);
            expect(cdmManifest.imports.allItems[0].corpusPath)
                .toBe('/primitives.cdm.json');
            expect(cdmManifest.entities.length)
                .toBe(0);
            expect(cdmManifest.exhibitsTraits.length)
                .toBe(1);
            expect(cdmManifest.subManifests.length)
                .toBe(0);
        });
});
