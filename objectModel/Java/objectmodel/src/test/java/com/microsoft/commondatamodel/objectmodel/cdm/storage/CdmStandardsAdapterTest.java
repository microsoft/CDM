// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.storage;

import com.microsoft.commondatamodel.objectmodel.storage.CdmStandardsAdapter;

import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Tests if the CdmStandardsAdapter functions correctly.
 */
public class CdmStandardsAdapterTest {
    String ENDPOINT = "https://cdm-schema.microsoft.com/logical";
    String TEST_FILE_PATH = "/foundations.cdm.json";

    /**
     * Tests if the adapter path is created correctly.
     */
    @Test
    public void testCreateAdapterPath() {
        CdmStandardsAdapter adapter = new CdmStandardsAdapter();
        String corpusPath = TEST_FILE_PATH;
        String adapterPath = adapter.createAdapterPath(corpusPath);
        Assert.assertEquals(ENDPOINT + corpusPath, adapterPath);
    }

    /**
     * Tests if the corpus path is created correctly.
     */
    @Test
    public void testCreateCorpusPath() {
        CdmStandardsAdapter adapter = new CdmStandardsAdapter();
        String adapterPath = ENDPOINT + TEST_FILE_PATH;
        String corpusPath = adapter.createCorpusPath(adapterPath);
        Assert.assertEquals(TEST_FILE_PATH, corpusPath);
    }

    /**
     * Tests if the adapter is able to read correctly.
     */
    @Test
    public void testReadAsync() {
        CdmStandardsAdapter adapter = new CdmStandardsAdapter();
        String foundations = adapter.readAsync(TEST_FILE_PATH).join();
        Assert.assertNotNull(foundations);
    }
}