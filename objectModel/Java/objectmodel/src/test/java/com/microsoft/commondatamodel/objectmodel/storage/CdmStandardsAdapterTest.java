// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Tests if the CdmStandardsAdapter functions correctly.
 */
public class CdmStandardsAdapterTest {
    String ROOT = "";
    String EXTENSION_FILE_PATH = "/extensions/pbi.extension.cdm.json";
    String FOUNDATIONS_FILE_PATH = "/cdmfoundation/foundations.cdm.json";
    String INVALID_FILE_PATH = "invalidFile.cdm.json";

    /**
     * Tests if the corpus path is created correctly.
     */
    @Test
    public void testCreateCorpusPath() throws ClassNotFoundException {
        CdmStandardsAdapter adapter = new CdmStandardsAdapter();
        String corpusPath = adapter.createCorpusPath(EXTENSION_FILE_PATH);
        Assert.assertEquals(corpusPath, EXTENSION_FILE_PATH);

        corpusPath = adapter.createCorpusPath(FOUNDATIONS_FILE_PATH);
        Assert.assertEquals(corpusPath, FOUNDATIONS_FILE_PATH);
    }

    /**
     * Tests if the adapter path is created correctly.
     */
    @Test
    public void testCreateAdapterPath() throws ClassNotFoundException {
        CdmStandardsAdapter adapter = new CdmStandardsAdapter();
        String adapterPath = adapter.createAdapterPath(EXTENSION_FILE_PATH);
        Assert.assertEquals(adapterPath, ROOT + EXTENSION_FILE_PATH);

        adapterPath = adapter.createAdapterPath(FOUNDATIONS_FILE_PATH);
        Assert.assertEquals(adapterPath, ROOT + FOUNDATIONS_FILE_PATH);
    }

    /**
     * Tests if the adapter is able to read correctly.
     */
    @Test
    public void testReadAsync() throws Throwable {
        CdmStandardsAdapter adapter = new CdmStandardsAdapter();
        String extensions = adapter.readAsync(EXTENSION_FILE_PATH).join();
        String foundations = adapter.readAsync(FOUNDATIONS_FILE_PATH).join();
        Assert.assertNotNull(extensions);
        Assert.assertNotNull(foundations);

        boolean errorWasThrown = false;
        try {
            try {
                adapter.readAsync(INVALID_FILE_PATH).join();
            } catch (final Exception e) {
                throw e.getCause();
            }
        } catch (final StorageAdapterException e) {
            String errorMessageString = String.format("There is no resource found for %s", INVALID_FILE_PATH);
            Assert.assertEquals(e.getMessage().substring(0, errorMessageString.length()), errorMessageString);
            errorWasThrown = true;
        }

        Assert.assertTrue(errorWasThrown);
    }
}