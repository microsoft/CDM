// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.resolvedmodel.expressionparser.*;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.List;

/**
 * Unit test for PredefinedTokens functions
 */
public class PredefinedTokensUnitTest {
    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testPredefinedTokens")
            .toString();

    @Test
    public void testGetPredefinedTokens() {
        List<String> tokens = PredefinedTokens.getPredefinedTokens();

        String expected = "always depth maxDepth noMaxDepth isArray cardinality.minimum cardinality.maximum referenceOnly normalized structured virtual";
        String actual = String.join(" ", tokens.toArray(new String[tokens.size()]));
        Assert.assertEquals(actual, expected);
    }

    @Test
    public void testPredefinedConstants() {
        List<String> constants = PredefinedTokens.getPredefinedConstants();

        String expected = "true false";
        String actual = String.join(" ", constants.toArray(new String[constants.size()]));
        Assert.assertEquals(actual, expected);
    }

    @Test
    public void testGetSupportedOperators() {
        List<String> ops = PredefinedTokens.getSupportedOperators();

        // all expect the '!' operator since that is tagged separately
        String expected = "&& || > < == != >= <=";
        String actual = String.join(" ", ops.toArray(new String[ops.size()]));
        Assert.assertEquals(actual, expected);
    }

    @Test
    public void testGetSupportedParenthesis() {
        List<String> ops = PredefinedTokens.getSupportedParenthesis();

        String expected = "( )";
        String actual = String.join(" ", ops.toArray(new String[ops.size()]));
        Assert.assertEquals(actual, expected);
    }
}
