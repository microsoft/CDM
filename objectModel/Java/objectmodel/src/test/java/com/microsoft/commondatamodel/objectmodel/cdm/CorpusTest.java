// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.io.File;
import java.util.concurrent.ExecutionException;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.InterceptLog;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import org.apache.logging.log4j.Level;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CorpusTest {
    private static final String TESTS_SUBPATH = new File("cdm", "corpus").toString();

    /**
    * Tests if a symbol imported with a moniker can be found as the last resource.
    * When resolving symbolEntity with respect to wrtEntity, the symbol fromEntity should be found correctly.
    */
    @Test
    public void testResolveSymbolReference() throws InterruptedException, ExecutionException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolveSymbolReference", null);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            Assert.fail(message);
        }, CdmStatusLevel.Warning);

        final CdmEntityDefinition wrtEntity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/wrtEntity.cdm.json/wrtEntity").get();
        final ResolveOptions resOpt = new ResolveOptions(wrtEntity, new AttributeResolutionDirectiveSet());
        wrtEntity.createResolvedEntityAsync("NewEntity", resOpt);
    }

    /**
     * Tests if ComputeLastModifiedTimeAsync doesn't log errors related to reference validation.
     */
    public void testComputeLastModifiedTimeAsync() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestComputeLastModifiedTimeAsync", null);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            Assert.fail(message);
        }, CdmStatusLevel.Warning);

        corpus.computeLastModifiedTimeAsync("local:/default.manifest.cdm.json").join();
    }
}