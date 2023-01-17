// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.io.File;
import java.util.Arrays;
import java.util.HashSet;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.enums.ImportsLoadStrategy;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import org.testng.Assert;
import org.testng.annotations.Test;

public class CorpusTest {
    private static final String TESTS_SUBPATH = new File("Cdm", "Corpus").toString();

    /**
    * Tests if a symbol imported with a moniker can be found as the last resource.
    * When resolving symbolEntity with respect to wrtEntity, the symbol fromEntity should be found correctly.
    */
    @Test
    public void testResolveSymbolReference() throws InterruptedException, ExecutionException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolveSymbolReference");

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
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestComputeLastModifiedTimeAsync");

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            Assert.fail(message);
        }, CdmStatusLevel.Error);

        corpus.computeLastModifiedTimeAsync("local:/default.manifest.cdm.json").join();
    }

    /**
     * Tests if the OM is able to load a data type with a cycle and log an error when that occurs.
     */
    @Test
    public void testCycleInDataType() throws InterruptedException {
        final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Arrays.asList(CdmLogCode.ErrCycleInObjectDefinition, CdmLogCode.ErrResolutionFailure));
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testCycleInDataType", false, expectedLogCodes);

        // Force the symbols to be resolved.
        final ResolveOptions resOpt = new ResolveOptions();
        resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);

        corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/doc.cdm.json", null, resOpt).join();

        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrCycleInObjectDefinition, true);
    }

    /**
     * Tests the FetchObjectAsync function with the lazy imports load.
     */
    @Test
    public void testLazyLoadImports() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testImportsLoadStrategy");
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            // when the imports are not loaded, there should be no reference validation.
            // no error should be logged.
            Assert.fail(message);
        }, CdmStatusLevel.Warning);

        // load with deferred imports.
        final ResolveOptions resOpt = new ResolveOptions();
        resOpt.setImportsLoadStrategy(ImportsLoadStrategy.LazyLoad);
        corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/doc.cdm.json", null, resOpt).join();
    }

    /**
     * Tests if a document that was fetched with lazy load and imported by another document is property indexed when needed.
     */
    @Test
    public void testLazyLoadCreateResolvedEntity() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLazyLoadCreateResolvedEntity");
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            // no error should be logged.
            Assert.fail(message);
        }, CdmStatusLevel.Warning);

        // load with deferred imports.
        final ResolveOptions resOpt = new ResolveOptions();
        resOpt.setImportsLoadStrategy(ImportsLoadStrategy.LazyLoad);

        // load entB which is imported by entA document.
        final CdmDocumentDefinition docB = corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/entB.cdm.json", null, resOpt).join();
        final CdmEntityDefinition entA = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/entA.cdm.json/entA", null, resOpt).join();

        Assert.assertNull(entA.getInDocument().importPriorities);
        Assert.assertNull(docB.importPriorities);

        // createResolvedEntityAsync will force the entA document to be indexed.
        final CdmEntityDefinition resEntA = entA.createResolvedEntityAsync("resolved-EntA").join();

        // in createResolvedEntityAsync the documents should be indexed.
        Assert.assertNotNull(entA.getInDocument().importPriorities);
        Assert.assertNotNull(docB.importPriorities);
        Assert.assertNotNull(resEntA.getInDocument().importPriorities);
    }

    /**
     * Tests the FetchObjectAsync function with the lazy imports load.
     */
    @Test
    public void testLoadImports() throws InterruptedException {
        final AtomicInteger errorCount = new AtomicInteger(0);
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testImportsLoadStrategy");
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (message.contains("Unable to resolve the reference")) {
                errorCount.getAndIncrement();
            } else {
                Assert.fail(message);
            }
        }, CdmStatusLevel.Error);

        // load imports.
        ResolveOptions resOpt = new ResolveOptions();
        resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);
        corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/doc.cdm.json", null, resOpt).join();
        Assert.assertEquals(1, errorCount.get());

        errorCount.set(0);
        corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testImportsLoadStrategy");
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (level == CdmStatusLevel.Warning && message.contains("Unable to resolve the reference")) {
                errorCount.getAndIncrement();
            } else {
                Assert.fail(message);
            }
        }, CdmStatusLevel.Warning);

        // load imports with shallow validation.
        resOpt = new ResolveOptions();
        resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);
        resOpt.setShallowValidation(true);
        corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/doc.cdm.json", null, resOpt).join();
        Assert.assertEquals(1, errorCount.get());
    }

    /**
    * Tests if a symbol imported with a moniker can be found as the last resource.
    * When resolving symbolEntity with respect to wrtEntity, the symbol fromEntity should be found correctly.
    */
    @Test
    public void testResolveConstSymbolReference() throws InterruptedException, ExecutionException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolveConstSymbolReference");

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            Assert.fail(message);
        }, CdmStatusLevel.Warning);

        final CdmEntityDefinition wrtEntity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/wrtConstEntity.cdm.json/wrtConstEntity").get();
        final ResolveOptions resOpt = new ResolveOptions(wrtEntity, new AttributeResolutionDirectiveSet());
        wrtEntity.createResolvedEntityAsync("NewEntity", resOpt);
    }

    /**
     * Tests that errors when trying to cast objects after fetching is handled correctly.
     */
    @Test
    public void testIncorrectCastOnFetch() throws InterruptedException {
        final HashSet<CdmLogCode> expectedLogCodes = new HashSet<>(Arrays.asList(CdmLogCode.ErrInvalidCast));
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestIncorrectCastOnFetch", null, false, expectedLogCodes);
        final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();
        // this function will fetch the entity inside it
        corpus.calculateEntityGraphAsync(manifest).join();
        TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrInvalidCast, true);
    }
}