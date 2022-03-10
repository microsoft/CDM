// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddArtifactAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ExecutionException;

/**
 * Test the performance of loading an entity that contains a deeply nested projection
 */
public class ProjectionPerformanceTest {
    /**
     * The path between TestDataPath and TestName
     */
    private static final String TESTS_SUBPATH = new File(new File(new File("Cdm"), "Projection"), "ProjectionPerformanceTest").toString();

    @Test
    public void testProjectionPerformanceOnLoad() throws InterruptedException, ExecutionException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestProjectionPerformanceOnLoad");
        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("largeProjectionEntity.cdm.json/largeProjectionEntity").join();
        CdmOperationAddArtifactAttribute operation = (CdmOperationAddArtifactAttribute) ((CdmProjection) ((CdmEntityAttributeDefinition) entity.getAttributes().get(0)).getEntity().getExplicitReference()).getOperations().get(0);
        CdmAttributeGroupDefinition attGroup = (CdmAttributeGroupDefinition) ((CdmAttributeGroupReference) operation.getNewAttribute()).getExplicitReference();
        // add a large number of attributes to the projection
        for (int i = 1; i < 10000; i++) {
            attGroup.getMembers().add(new CdmTypeAttributeDefinition(corpus.getCtx(), "a" + i));
        }
        final Instant start = java.time.Instant.now();
        // reindex the entity to run through the visit function
        entity.getInDocument().indexIfNeededAsync(new ResolveOptions(entity.getInDocument()), true).join();
        final Instant end = java.time.Instant.now();
        Assert.assertTrue(Duration.between(start, end).toMillis() < 500);
    }
}
