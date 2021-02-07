// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmManifestDefinition,
    cdmStatusLevel,
    CdmCorpusDefinition,
    cdmObjectType,
    CdmTypeAttributeDefinition
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
        expect(corpus.ctx.events).not.toBeUndefined();
        expect(corpus.ctx.events.isRecording).toBe(false);
        expect(corpus.ctx.events.length).toBeGreaterThan(0);
        expect(corpus.ctx.events.allItems[0].has('timestamp')).toBe(true);
        expect(corpus.ctx.events.allItems[0].get('correlationId')).toEqual(DummyCorrelationId);

        // Test fetching a good object, this should leave event recorder empty
        await corpus.fetchObjectAsync('local:/default.manifest.cdm.json');
        expect(corpus.ctx.events.isRecording).toBe(false);
        expect(corpus.ctx.events.length).toEqual(0);

        // Test saving a manifest to invalid namespace results in at least one error message in the recorder
        let manifest: CdmManifestDefinition = corpus.MakeObject(cdmObjectType.manifestDef, 'dummy');
        await manifest.saveAsAsync('foo:/bar', true);
        expect(corpus.ctx.events.isRecording).toBe(false);
        expect(corpus.ctx.events.length).toBeGreaterThan(0);
        expect(corpus.ctx.events.allItems[0].has('timestamp')).toBe(true);
        expect(corpus.ctx.events.allItems[0].get('correlationId')).toEqual(DummyCorrelationId);

        // Test resolving a manifest not added to a folder, this should yield at least one error message in the recorder
        await manifest.createResolvedManifestAsync('new dummy', null);
        expect(corpus.ctx.events.isRecording).toBe(false);
        expect(corpus.ctx.events.length).toBeGreaterThan(0);
        expect(corpus.ctx.events.allItems[0].has('timestamp')).toBe(true);
        expect(corpus.ctx.events.allItems[0].get('correlationId')).toEqual(DummyCorrelationId);

        // Test resolving an entity without WRT doc, this should yield at least one error message in the recorder
        let entity2: CdmEntityDefinition = corpus.MakeObject(cdmObjectType.entityDef, 'MyEntity2');
        await entity2.createResolvedEntityAsync('MyEntity2-Resolved');
        expect(corpus.ctx.events.isRecording).toBe(false);
        expect(corpus.ctx.events.length).toBeGreaterThan(0);
        expect(corpus.ctx.events.allItems[0].has('timestamp')).toBe(true);
        expect(corpus.ctx.events.allItems[0].get('correlationId')).toEqual(DummyCorrelationId);

        // Test invoking FileStatusCheckAsync on the manifest, this should yield at least one error message in the recorder
        await manifest.fileStatusCheckAsync();
        expect(corpus.ctx.events.isRecording).toBe(false);
        expect(corpus.ctx.events.length).toBeGreaterThan(0);
        expect(corpus.ctx.events.allItems[0].has('timestamp')).toBe(true);
        expect(corpus.ctx.events.allItems[0].get('correlationId')).toEqual(DummyCorrelationId);

        // Repeat the same test but with status level 'None', no events should be recorded
        corpus.ctx.reportAtLevel = cdmStatusLevel.none;
        await entity2.createResolvedEntityAsync('MyEntity2-Resolved');
        expect(corpus.ctx.events.isRecording).toBe(false);
        expect(corpus.ctx.events.length).toEqual(0);
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

        let entity1Doc: CdmDocumentDefinition = corpus.MakeObject(cdmObjectType.documentDef, "MyEntity1.cdm.json");
        entity1Doc.definitions.push(entity1);
        corpus.storage.fetchRootFolder('local').documents.push(entity1Doc);

        manifest.entities.push(entity1);
        await manifest.createResolvedManifestAsync('new dummy 2', null);

        expect(corpus.ctx.events.isRecording).toBe(false);
        expect(corpus.ctx.events.length).toBeGreaterThan(0);
        // We check that there first event recorded was an error from the nested function
        expect(corpus.ctx.events.allItems[0].get('level')).toBe('error');
        expect(corpus.ctx.events.allItems[0].get('message')).toBe('Unable to resolve the reference \'entityId\' to a known object');
        expect(corpus.ctx.events.allItems[0].get('correlationId')).toEqual(DummyCorrelationId);

        // Keep for debugging
        // corpus.ctx.events.allItems.forEach(logEntry => {
        //     logEntry.forEach((key: string, value: string) => console.log(`${key}=${value}`))
        // });
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

        // Verify scope entry event
        expect(corpus.ctx.events.allItems[0].get('message')).toBe('Entering scope')
        expect(corpus.ctx.events.allItems[0].get('path')).toBe('fetchObjectAsync')

        // Verify scope exit event
        expect(corpus.ctx.events.allItems[corpus.ctx.events.length - 1].get('message')).toBe('Leaving scope')
        expect(corpus.ctx.events.allItems[corpus.ctx.events.length - 1].get('path')).toBe('fetchObjectAsync')

        // Keep for debugging
        // corpus.ctx.events.allItems.forEach(logEntry => {
        //     logEntry.forEach((key: string, value: string) => console.log(`${key}=${value}`))
        // });
    });
});
