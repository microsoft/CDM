// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.resolvedmodel.expressionparser.Tokenizer;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Unit test for Tokenizer functions
 */
public class TokenizerUnitTest {
    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testTokenizer")
            .toString();

    @Test
    public void testGetExpressionAsTokenList() {
        List<List<String>> exprAndExpectedList = new ArrayList<>();
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("(cardinality.maximum > 1) && (!referenceOnly)", "( cardinality.maximum > 1 ) && ( ! referenceOnly )")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("", "")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("  ", "")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("always", "always")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("!structured", "! structured")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("referenceOnly || (depth > 5)", "referenceOnly || ( depth > 5 )")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("!(referenceOnly)", "! ( referenceOnly )")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("!(normalized && cardinality.maximum > 1)", "! ( normalized && cardinality.maximum > 1 )")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("true", "true")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("(((true==true)))", "( ( ( true == true ) ) )")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("!normalized || (cardinality.maximum <= 1)", "! normalized || ( cardinality.maximum <= 1 )")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("!(normalized && cardinality.maximum > 1) && !(structured)", "! ( normalized && cardinality.maximum > 1 ) && ! ( structured )")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("!(unknownToken != 1 && cardinality.maximum >                                       1) && !anotherUnknownToken", "! ( unknownToken != 1 && cardinality.maximum > 1 ) && ! anotherUnknownToken")));
        exprAndExpectedList.add(new ArrayList<>(Arrays.asList("!(normalized && isArray) || noMaxDepth", "! ( normalized && isArray ) || noMaxDepth")));

        for (List<String> item : exprAndExpectedList) {
            String expected = item.get(1);
            List<List<Object>> expTupleList = Tokenizer.getExpressionAsTokenList(item.get(0));
            List<String> expList = new ArrayList<>();
            for (List<Object> t : expTupleList) {
                expList.add(t.get(0).toString());
            }
            String actual = String.join(" ", expList.toArray(new String[expList.size()]));
            Assert.assertEquals(actual, expected);
        }
    }
}
