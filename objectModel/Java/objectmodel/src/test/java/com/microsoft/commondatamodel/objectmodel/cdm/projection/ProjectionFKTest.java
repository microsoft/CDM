// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
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
    public void testEntityAttribute() {
        String testName = "testEntityAttribute";
        String entityName = "SalesEntityAttribute";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }


    @Test
    public void testEntityAttributeProj() {
        String testName = "testEntityAttributeProj";
        String entityName = "SalesEntityAttribute";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testSourceWithEA() {
        String testName = "testSourceWithEA";
        String entityName = "SalesSourceWithEA";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testSourceWithEAProj() {
        String testName = "testSourceWithEAProj";
        String entityName = "SalesSourceWithEA";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testGroupFK() {
        String testName = "testGroupFK";
        String entityName = "SalesGroupFK";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testGroupFKProj() {
        String testName = "testGroupFKProj";
        String entityName = "SalesGroupFK";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testNestedFKProj() {
        String testName = "testNestedFKProj";
        String entityName = "SalesNestedFK";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testPolymorphic() {
        String testName = "testPolymorphic";
        String entityName = "PersonPolymorphicSource";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testPolymorphicProj() {
        String testName = "testPolymorphicProj";
        String entityName = "PersonPolymorphicSource";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testPolymorphicFKProj() {
        String testName = "testPolymorphicFKProj";
        String entityName = "PersonPolymorphicSourceFK";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testArraySource() {
        String testName = "testArraySource";
        String entityName = "SalesArraySource";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testArraySourceProj() {
        String testName = "testArraySourceProj";
        String entityName = "SalesArraySource";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testForeignKey() {
        String testName = "testForeignKey";
        String entityName = "SalesForeignKey";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testForeignKeyProj() {
        String testName = "testForeignKeyProj";
        String entityName = "SalesForeignKey";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testForeignKeyAlways() {
        String testName = "testForeignKeyAlways";
        String entityName = "SalesForeignKeyAlways";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    @Test
    public void testCompositeKeyProj() {
        String testName = "testCompositeKeyProj";
        String entityName = "SalesCompositeKey";

        for (List<String> resOpt : resOptsCombinations) {
            loadEntityForResolutionOptionAndSave(testName, entityName, resOpt).join();
        }
    }

    private CompletableFuture<Void> loadEntityForResolutionOptionAndSave(String testName, String entityName, List<String> resOpts) {
        return CompletableFuture.runAsync(() -> {
            CdmCorpusDefinition corpus = null;
            try {
                corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/default.manifest.cdm.json").join();

            String expectedOutputPath = null;
            try {
                expectedOutputPath = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            String fileNameSuffix = ProjectionTestUtils.getResolutionOptionNameSuffix(resOpts);

            CdmEntityDefinition entSalesForeignKeyProjection = (CdmEntityDefinition) corpus.fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName, manifest).join();
            Assert.assertNotNull(entSalesForeignKeyProjection);
            CdmEntityDefinition resolvedSalesForeignKeyProjection = saveResolved(corpus, manifest, testName, entSalesForeignKeyProjection, resOpts).join();
            Assert.assertNotNull(resolvedSalesForeignKeyProjection);
            AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, entityName + fileNameSuffix, resolvedSalesForeignKeyProjection);
        });
    }

    private CompletableFuture<CdmEntityDefinition> saveResolved(CdmCorpusDefinition corpus, CdmManifestDefinition manifest, String testName, CdmEntityDefinition inputEntity, List<String> resolutionOptions) {
        return CompletableFuture.supplyAsync(() -> {
            HashSet<String> roHashSet = new HashSet<String>();
            for (int i = 0; i < resolutionOptions.size(); i++) {
                roHashSet.add(resolutionOptions.get(i));
            }

            String fileNameSuffix = ProjectionTestUtils.getResolutionOptionNameSuffix(resolutionOptions);

            String resolvedEntityName = "Resolved_" + inputEntity.getEntityName() + fileNameSuffix + ".cdm.json";

            ResolveOptions ro = new ResolveOptions(inputEntity.getInDocument());
            ro.setDirectives(new AttributeResolutionDirectiveSet(roHashSet));

            CdmFolderDefinition resolvedFolder = corpus.getStorage().fetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = inputEntity.createResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder).join();

            return resolvedEntity;
        });
    }
}
