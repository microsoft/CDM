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
            "Cdm"),
            "Projection"),
            "ExpressionTreeUnitTest")
            .toString();

    /**
     * Test evaluateExpression function
     */
    @Test
    public void testEvaluateExpression() {
        InputValues inputValues = new InputValues();
        inputValues.setMaxCardinality(1);
        inputValues.setMinCardinality(0);
        inputValues.setMaxDepth(32);
        inputValues.setNextDepth(1);
        inputValues.setNoMaxDepth(true);
        inputValues.setIsArray(true);
        inputValues.setNormalized(false);
        inputValues.setReferenceOnly(true);
        inputValues.setStructured(true);

        List<List<String>> exprAndExpectedResultList = new ArrayList<>();
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("(cardinality.maximum > 1) && (!referenceOnly)", "false")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("  ", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("always", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("!structured", "false")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("referenceOnly || (depth > 5)", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("!(referenceOnly)", "false")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("!(normalized && cardinality.maximum > 1)", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("true", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("(((true==true)))", "true")));
        exprAndExpectedResultList.add(new ArrayList<>(Arrays.asList("!(normalized && isArray) || noMaxDepth", "false")));

        for (List<String> item : exprAndExpectedResultList) {
            String actual = String.valueOf(ExpressionTree.evaluateCondition(item.get(0), inputValues));
            String expected = item.get(1);

            Assert.assertEquals(actual, expected);
        }
    }
}
