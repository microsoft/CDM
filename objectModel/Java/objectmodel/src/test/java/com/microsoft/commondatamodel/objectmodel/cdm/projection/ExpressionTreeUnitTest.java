// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.resolvedmodel.expressionparser.*;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Unit test for ExpressionTree functions
 */
public class ExpressionTreeUnitTest {
    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testExpressionTree")
            .toString();

    /**
     * Test evaluateExpression function
     */
    @Test
    public void testEvaluateExpression() {
        InputValues input = new InputValues();
        input.setMaxCardinality(1);
        input.setMinCardinality(0);
        input.setMaxDepth(32);
        input.setNextDepth(1);
        input.setNoMaxDepth(true);
        input.setIsArray(true);
        input.setNormalized(false);
        input.setReferenceOnly(true);
        input.setStructured(true);

        List<List<String>> exprAndExpectedResultList = new ArrayList<>();
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("(cardinality.maximum > 1) && (!referenceOnly)", "false")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("", "false")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("  ", "false")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("always", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("!structured", "false")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("referenceOnly || (depth > 5)", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("!(referenceOnly)", "false")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("!(normalized && cardinality.maximum > 1)", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("true", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("(((true==true)))", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("!(normalized && isArray) || noMaxDepth", "false")));

        for (List<String> item : exprAndExpectedResultList) {
            ExpressionTree tree = new ExpressionTree();
            Node treeTop = tree.constructExpressionTree(item.get(0));
            String expected = item.get(1);
            Object foo = ExpressionTree.evaluateExpressionTree(treeTop, input);
            String actual = foo.toString();

            Assert.assertEquals(actual, expected);
        }
    }
}
