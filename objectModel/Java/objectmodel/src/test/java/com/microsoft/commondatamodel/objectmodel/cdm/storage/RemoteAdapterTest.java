// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.storage;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.concurrent.ExecutionException;

public class RemoteAdapterTest {
    private static final String TESTS_SUBPATH = new File("storage").toString();

    /**
     * Test that with a remote adapter configured, the partition paths get properly turned to their mapped keys.
     * @throws InterruptedException
     * @throws ExecutionException
     */
    @Test
    public void testModelJsonRemoteAdapterConfig() throws InterruptedException, ExecutionException {
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testModelJsonRemoteAdapterConfig");

        CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("model.json").get();

        // Confirm that the partition URL has been mapped to 'contoso' by RemoteAdapter

        Assert.assertNotNull(manifest, "Manifest loaded from model.json should not be null");
        Assert.assertEquals(manifest.getEntities().size(), 1,
                "There should be only one entity loaded from model.json");
        Assert.assertEquals(manifest.getEntities().get(0).getDataPartitions().size(), 1,
                "There should be only one partition attached to the entity loaded from model.json");
        Assert.assertEquals(manifest.getEntities().get(0).getDataPartitions().get(0).getLocation(), "remote:/contoso/some/path/partition-data.csv",
                "The partition location loaded from model.json did not match");
    }
}
