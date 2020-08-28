// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.io.File;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

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
    @Test
    public void testComputeLastModifiedTimeAsync() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestComputeLastModifiedTimeAsync", null);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            Assert.fail(message);
        }, CdmStatusLevel.Error);

        corpus.computeLastModifiedTimeAsync("local:/default.manifest.cdm.json").join();
    }

    /**
     * Tests the FetchObjectAsync function with the StrictValidation off.
     */
    @Test
    public void testStrictValidationOff() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestStrictValidation", null);
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            // when the strict validation is disabled, there should be no reference validation.
            // no error should be logged.
            Assert.fail(message);
        }, CdmStatusLevel.Warning);

        // load with strict validation disabled.
        final ResolveOptions resOpt = new ResolveOptions();
        resOpt.setStrictValidation(false);
        corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/doc.cdm.json", null, resOpt).join();
    }

    /**
     * Tests the FetchObjectAsync function with the StrictValidation on.
     */
    @Test
    public void testStrictValidationOn() throws InterruptedException {
        final AtomicInteger errorCount = new AtomicInteger(0);
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestStrictValidation", null);
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (message.contains("Unable to resolve the reference")) {
                errorCount.getAndIncrement();
            } else {
                Assert.fail(message);
            }
        }, CdmStatusLevel.Error);

        // load with strict validation.
        ResolveOptions resOpt = new ResolveOptions();
        resOpt.setStrictValidation(true);
        corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/doc.cdm.json", null, resOpt).join();
        Assert.assertEquals(1, errorCount.get());

        errorCount.set(0);
        corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testStrictValidation", null);
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (level == CdmStatusLevel.Warning && message.contains("Unable to resolve the reference")) {
                errorCount.getAndIncrement();
            } else {
                Assert.fail(message);
            }
        }, CdmStatusLevel.Warning);

        // load with strict validation and shallow validation.
        resOpt = new ResolveOptions();
        resOpt.setStrictValidation(true);
        resOpt.setShallowValidation(true);
        corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/doc.cdm.json", null, resOpt).join();
        Assert.assertEquals(1, errorCount.get());
    }
}