// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;

/**
 * Tests to verify if resolution of trait groups performs as expected.
 */
public class EntityResolutionTraitGroupTests {
    private static final String TESTS_SUBPATH =
            new File(new File(new File("Cdm"),
                    "Resolution"),
                    "EntityResolution")
                    .toString();

    /**
     * Verify success case and make sure the entities are resolved
     */
    @Test
    public void testResolvedTraitGroupE2E() throws IOException, InterruptedException {
        ResolutionTestUtils.resolveSaveDebuggingFileAndAssert(TESTS_SUBPATH,"TestResolvedTraitGroup", "E2EResolution", false);
    }

    /**
     * Verify that the traits are assigned appropriately.
     * AND no errors or warnings are thrown.
     * If the optional traitgroups are not ignored, then this will fail.
     */
    @Test
    public void testTraitsFromTraitGroup() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestResolvedTraitGroup");

        cdmCorpus.setEventCallback(
                (CdmStatusLevel level, String message) -> {
                    if (!message.contains("Resolution guidance is being deprecated in favor of Projections.")) {
                        Assert.fail("Received " + level + " message: " + message);
                    }
                },
                CdmStatusLevel.Warning);

        CdmEntityDefinition ent = (CdmEntityDefinition) cdmCorpus.fetchObjectAsync("local:/E2EResolution/Contact.cdm.json/Contact").join();
        ent.createResolvedEntityAsync("Contact_").join();
    }
}
