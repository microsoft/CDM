// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


import {
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmManifestDefinition,
    cdmStatusLevel,
    CdmCorpusDefinition,
    cdmObjectType,
    cdmLogCode,
    CdmTypeAttributeDefinition,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition
} from '../../internal';

import { testHelper } from '../testHelper';

describe('Utilities.EventList', () => {
    const testsSubpath: string = 'Utilities';
    /** Dummy value used for correlation ID testing. */
    const DummyCorrelationId: string = '12345';
    /** Declare a blackhole callback. We're focusing on event recorder, don't care about output going to the standard log stream. */
    const eventCallback = () => { }

    /**
     * Test update and fetch list lookup default value without attributeValue and displayOrder.
     */
    it('TestWithoutNesting', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEventList');
        corpus.setEventCallback(eventCallback, cdmStatusLevel.warning, DummyCorrelationId);

        // Test fetching an object from invalid namespace results in at least one error message in the recorder
        await corpus.fetchObjectAsync('foo:/bar');
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageAdapterNotFound, true)

        // Test fetching a good object, this should leave event recorder empty
        await corpus.fetchObjectAsync('local:/default.manifest.cdm.json');
        TestNoLogsState(corpus);

        // Test saving a manifest to invalid namespace results in at least one error message in the recorder
        let manifest: CdmManifestDefinition = corpus.MakeObject(cdmObjectType.manifestDef, 'dummy');
        await manifest.saveAsAsync('foo:/bar', true);
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrValdnMissingDoc, true)

        // Test resolving a manifest not added to a folder, this should yield at least one error message in the recorder
        await manifest.createResolvedManifestAsync('new dummy', undefined);
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrResolveManifestFailed, true)

        // Test resolving an entity without WRT doc, this should yield at least one error message in the recorder
        let entity2: CdmEntityDefinition = corpus.MakeObject(cdmObjectType.entityDef, 'MyEntity2');
        await entity2.createResolvedEntityAsync('MyEntity2-Resolved');
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrDocWrtDocNotfound, true)

        // Test invoking FileStatusCheckAsync on the manifest, this should yield at least one error message in the recorder
        await manifest.fileStatusCheckAsync();
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageNullNamespace, true)

        // Repeat the same test but with status level 'None', no events should be recorded
        corpus.ctx.reportAtLevel = cdmStatusLevel.none;
        await entity2.createResolvedEntityAsync('MyEntity2-Resolved');
        TestNoLogsState(corpus);

        // Test checking file status on a data partition
        // We're at log level 'Progress', so we get the EnterScope/LeaveScope messages too
        corpus.ctx.reportAtLevel = cdmStatusLevel.progress;
        const part: CdmDataPartitionDefinition = corpus.MakeObject(cdmObjectType.dataPartitionDef, 'part');
        await part.fileStatusCheckAsync();
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrPathNullObjectPath, true);

        // Test checking file status on a data partition pattern
        const refDoc: CdmDocumentDefinition = corpus.MakeObject(cdmObjectType.documentDef, 'RefEntDoc');
        const partPattern: CdmDataPartitionPatternDefinition = corpus.MakeObject(cdmObjectType.dataPartitionPatternDef, 'partPattern');
        partPattern.inDocument = refDoc;
        await partPattern.fileStatusCheckAsync();
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageNullCorpusPath, true);

        // Test calculating relationships - no errors/warnings
        await corpus.calculateEntityGraphAsync(manifest);
        TestBasicLogsState(corpus);

        // Test populating relationships in manifest - no errors/warnings
        await manifest.populateManifestRelationshipsAsync();
        TestBasicLogsState(corpus);
        
        // Test filtering code logic 
        corpus.ctx.suppressedLogCodes.add(cdmLogCode.ErrPathNullObjectPath);
        const part2: CdmDataPartitionDefinition = corpus.MakeObject(cdmObjectType.dataPartitionDef, 'part2');
        await part2.fileStatusCheckAsync();
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrPathNullObjectPath, false);
    });

    /**
     * Tests a use case where recording nesting happens, such as CreateResolvedManifestAsync making calls to CreateResolvedEntityAsync.
     */
    it('TestWithNesting', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEventList');
        corpus.setEventCallback(eventCallback, cdmStatusLevel.warning, DummyCorrelationId);

        let manifest: CdmManifestDefinition = corpus.MakeObject(cdmObjectType.manifestDef, 'dummy');

        // Test resolving a manifest (added to a folder) with an entity in it, this should collect messages from
        // CreateResolvedManifestAsync and CreateResolvedEntityAsync functions
        corpus.storage.fetchRootFolder('local').documents.push(manifest);
        let entity1: CdmEntityDefinition = corpus.MakeObject(cdmObjectType.entityDef, 'MyEntity1');

        let someAttrib1: CdmTypeAttributeDefinition = corpus.MakeObject(cdmObjectType.typeAttributeDef, 'someAttrib1', false);
        someAttrib1.dataType = corpus.MakeRef(cdmObjectType.dataTypeRef, 'entityId', true);
        entity1.attributes.push(someAttrib1);

        let entity1Doc: CdmDocumentDefinition = corpus.MakeObject(cdmObjectType.documentDef, 'MyEntity1.cdm.json');
        entity1Doc.definitions.push(entity1);
        corpus.storage.fetchRootFolder('local').documents.push(entity1Doc);

        manifest.entities.push(entity1);
        await manifest.createResolvedManifestAsync('new dummy 2', undefined);

        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrResolveReferenceFailure, true)

        // Keep for debugging
        // corpus.ctx.events.allItems.forEach(logEntry => {
        //     logEntry.forEach((key: string, value: string) => console.log(`${key}=${value}`))
        // });
    });

    /**
     * Tests events generated in StorageManager APIs
     */
    it('TestStorageManagerEvents', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEventList');
        corpus.setEventCallback(eventCallback, cdmStatusLevel.info, DummyCorrelationId);

        corpus.storage.mount('dummy', undefined);
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageNullAdapter, true);

        corpus.storage.unMount('nothing');
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.WarnStorageRemoveAdapterFailed, true);

        // No errors/warnings expected here
        corpus.storage.fetchRootFolder(undefined);
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageNullNamespace, true);

        corpus.storage.adapterPathToCorpusPath('Test');
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageInvalidAdapterPath, true);

        corpus.storage.corpusPathToAdapterPath('unknown:/Test');
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageAdapterNotFound, true);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrStorageNamespaceNotRegistered, true);

        corpus.storage.createAbsoluteCorpusPath(undefined);
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrPathNullObjectPath, true);

        corpus.storage.createRelativeCorpusPath(undefined);
        TestBasicLogsState(corpus);
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.ErrPathNullObjectPath, true);
        
    });

    /**
     * Test logging of API scope entry/exit.
     */
    it('TestScoping', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestEventList');
         // For scoping test we need to use log level info
        corpus.setEventCallback(eventCallback, cdmStatusLevel.info, DummyCorrelationId);

        await corpus.fetchObjectAsync('local:/default.manifest.cdm.json');
        expect(corpus.ctx.events.isRecording).toBe(false);
        expect(corpus.ctx.events.length).toBeGreaterThan(2);

        TestBasicLogsState(corpus);

        // Verify method on entry/exit event
        expect(corpus.ctx.events.allItems[0].get('method')).toBe('fetchObjectAsync')
        expect(corpus.ctx.events.allItems[corpus.ctx.events.length - 1].get('method')).toBe('fetchObjectAsync')

        // Keep for debugging
        // corpus.ctx.events.allItems.forEach(logEntry => {
        //     logEntry.forEach((key: string, value: string) => console.log(`${key}=${value}`))
        // });
    });

    /// <summary>
    /// Helper function to test that recording is stopped and no logs are recorded.
    /// </summary>
    /// <param name="corpus"></param>
    function TestNoLogsState(corpus: CdmCorpusDefinition): void {
        TestBasicLogsState(corpus, true);
    }

    /// <summary>
    /// Helper function to check for event list state and presence of scope enter/leave logs.
    /// </summary>
    /// <param name="corpus"></param>
    /// <param name="expectNoLogs">If true, tests that recording is stopped and there are no logs in EventList. If false,
    /// tests that there are multiple entries and log enter/exit events were logged.</param>
    function TestBasicLogsState(corpus: CdmCorpusDefinition, expectNoLogs: boolean = false): void {
        expect(corpus.ctx.events).not.toBeUndefined();
        expect(corpus.ctx.events.isRecording).toBe(false);

        if (expectNoLogs) {
            expect(corpus.ctx.events.length).toBe(0);
        } else {
            expect(corpus.ctx.events.length).toBeGreaterThan(0);
            expect(corpus.ctx.events.allItems[0].has('timestamp')).toBe(true);
            expect(corpus.ctx.events.allItems[0].get('cid')).toBe(DummyCorrelationId);

            if (corpus.ctx.reportAtLevel == cdmStatusLevel.progress) {
                expect(corpus.ctx.events.allItems[0].get('message')).toBe('Entering scope');
                expect(corpus.ctx.events.allItems[corpus.ctx.events.length - 1].get('message').startsWith('Leaving scope')).toBe(true);
            }
        }
    }
});

