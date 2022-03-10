// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Stopwatch } from 'ts-stopwatch';
import {
    CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmOperationAddArtifactAttribute,
    CdmProjection,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../../internal';
import { testHelper } from "../../testHelper";

/**
 *  A test class for testing the performance of projection operations
 */
describe('Cdm/Projection/ProjectionPerformanceTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/ProjectionPerformanceTest';

    /**
     * Test the performance of loading an entity that contains a deeply nested projection
     */
    it('TestProjectionPerformanceOnLoad', async () => {
        var corpus = testHelper.getLocalCorpus(testsSubpath, 'TestProjectionPerformanceOnLoad');
        var entity = await corpus.fetchObjectAsync<CdmEntityDefinition>("largeProjectionEntity.cdm.json/largeProjectionEntity");
        var operation = ((entity.attributes.allItems[0] as CdmEntityAttributeDefinition).entity.explicitReference as CdmProjection).operations.allItems[0] as CdmOperationAddArtifactAttribute;
        var attGroup = (operation.newAttribute as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;

        // add a large number of attributes to the projection
        for (var i = 1; i < 10000; i++) {
            attGroup.members.push(new CdmTypeAttributeDefinition(corpus.ctx, "a" + i));
        }
        const stopwatch: Stopwatch = new Stopwatch();
        stopwatch.start();
        // reindex the entity to run through the visit function
        await entity.inDocument.indexIfNeeded(new resolveOptions(entity.inDocument), true);
        stopwatch.stop();
        expect(stopwatch.getTime())
            .toBeLessThan(500);
    });
});
