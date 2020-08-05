// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import org.apache.commons.lang3.tuple.Pair;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Test to validate StorageUtils functions
 */
public class StorageUtilsTest {

    /**
     * Test splitNamespacePath function on different paths
     */
    @Test
    public void testSplitNamespacePath() {
        Assert.assertNull(StorageUtils.splitNamespacePath(null));

        final Pair<String, String> pathTuple1 = StorageUtils.splitNamespacePath("local:/some/path");
        Assert.assertNotNull(pathTuple1);
        Assert.assertEquals(pathTuple1.getLeft(), "local");
        Assert.assertEquals(pathTuple1.getRight(), "/some/path");

        final Pair<String, String> pathTuple2 = StorageUtils.splitNamespacePath("/some/path");
        Assert.assertNotNull(pathTuple2);
        Assert.assertEquals(pathTuple2.getLeft(), "");
        Assert.assertEquals(pathTuple2.getRight(), "/some/path");

        final Pair<String, String> pathTuple3 = StorageUtils.splitNamespacePath("adls:/some/path:with:colons");
        Assert.assertNotNull(pathTuple3);
        Assert.assertEquals(pathTuple3.getLeft(), "adls");
        Assert.assertEquals(pathTuple3.getRight(), "/some/path:with:colons");
    }
}
