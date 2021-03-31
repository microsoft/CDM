// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class ProjectionFKTest {
    private static List<List<String>> resOptsCombinations = new ArrayList<>(
        Arrays.asList(
            new ArrayList<>(Arrays.asList()),
            new ArrayList<>(Arrays.asList("referenceOnly")),
            new ArrayList<>(Arrays.asList("normalized")),
            new ArrayList<>(Arrays.asList("structured")),
            new ArrayList<>(Arrays.asList("referenceOnly", "normalized")),
            new ArrayList<>(Arrays.asList("referenceOnly", "structured")),
            new ArrayList<>(Arrays.asList("normalized", "structured")),
            new ArrayList<>(Arrays.asList("referenceOnly", "normalized", "structured"))
        )
    );

    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testProjectionFK")
            .toString();

    @Test
    public void testEntityAttribute() throws InterruptedException {
        String testName = "testEntityAttribute";
        String entityName = "SalesEntityAttribute";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }


    @Test
    public void testEntityAttributeProj() throws InterruptedException {
        String testName = "testEntityAttributeProj";
        String entityName = "SalesEntityAttribute";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testSourceWithEA() throws InterruptedException {
        String testName = "testSourceWithEA";
        String entityName = "SalesSourceWithEA";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testSourceWithEAProj() throws InterruptedException {
        String testName = "testSourceWithEAProj";
        String entityName = "SalesSourceWithEA";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testGroupFK() throws InterruptedException {
        String testName = "testGroupFK";
        String entityName = "SalesGroupFK";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testGroupFKProj() throws InterruptedException {
        String testName = "testGroupFKProj";
        String entityName = "SalesGroupFK";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testNestedFKProj() throws InterruptedException {
        String testName = "testNestedFKProj";
        String entityName = "SalesNestedFK";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testPolymorphic() throws InterruptedException {
        String testName = "testPolymorphic";
        String entityName = "PersonPolymorphicSource";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testPolymorphicProj() throws InterruptedException {
        String testName = "testPolymorphicProj";
        String entityName = "PersonPolymorphicSource";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testPolymorphicFKProj() throws InterruptedException {
        String testName = "testPolymorphicFKProj";
        String entityName = "PersonPolymorphicSourceFK";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testArraySource() throws InterruptedException {
        String testName = "testArraySource";
        String entityName = "SalesArraySource";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testArraySourceProj() throws InterruptedException {
        String testName = "testArraySourceProj";
        String entityName = "SalesArraySource";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testForeignKey() throws InterruptedException {
        String testName = "testForeignKey";
        String entityName = "SalesForeignKey";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testForeignKeyProj() throws InterruptedException {
        String testName = "testForeignKeyProj";
        String entityName = "SalesForeignKey";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testForeignKeyAlways() throws InterruptedException {
        String testName = "testForeignKeyAlways";
        String entityName = "SalesForeignKeyAlways";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    @Test
    public void testCompositeKeyProj() throws InterruptedException {
        String testName = "testCompositeKeyProj";
        String entityName = "SalesCompositeKey";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }
    }

    /**
     * Test resolving a type attribute with a replace as foreign key operation
     */
    @Test
    public void testTypeAttributeProj() throws InterruptedException {
        String testName = "testTypeAttributeProj";
        String entityName = "Person";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getCorpus(testName, TESTS_SUBPATH);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<>(Arrays.asList("referenceOnly"))).join();

        // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
        // Replace as foreign key applied to "address", replace with "addressId"
        Assert.assertEquals(resolvedEntity.getAttributes().size(), 5);
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0)).getName(), "name");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(1)).getName(), "age");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(2)).getName(), "addressId");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(3)).getName(), "phoneNumber");
        Assert.assertEquals(((CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(4)).getName(), "email");
    }
}
