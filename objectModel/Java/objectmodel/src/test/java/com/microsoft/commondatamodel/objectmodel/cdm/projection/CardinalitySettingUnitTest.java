// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CardinalitySettings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;

/**
 * Unit test for CardinalitySetting functions
 */
public class CardinalitySettingUnitTest {
    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testCardinalitySetting")
            .toString();

    /**
     * Unit test for CardinalitySetting.isMinimumValid
     */
    @Test
    public void testMinimum() throws InterruptedException {
        String testName = "testMinimum";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);

        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (!message.contains("CardinalitySettings | Invalid minimum cardinality -1."))
                Assert.fail("Some unexpected failure - " + message + "!");
        }, CdmStatusLevel.Warning);

        // Create Dummy Type Attribute
        CdmTypeAttributeDefinition attribute = corpus.makeObject(CdmObjectType.TypeAttributeDef, "dummyAttribute", false);
        attribute.setCardinality(new CardinalitySettings(attribute));
        attribute.getCardinality().setMinimum("-1");
    }

    /**
     * Unit test for CardinalitySetting.isMaximumValid
     */
    @Test
    public void testMaximum() throws InterruptedException {
        String testName = "TestMaximum";

        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null);
        corpus.setEventCallback((CdmStatusLevel level, String message) -> {
            if (!message.contains("CardinalitySettings | Invalid maximum cardinality Abc."))
                Assert.fail("Some unexpected failure - " + message + "!");
        }, CdmStatusLevel.Warning);

        // Create Dummy Type Attribute
        CdmTypeAttributeDefinition attribute = corpus.makeObject(CdmObjectType.TypeAttributeDef, "dummyAttribute", false);
        attribute.setCardinality(new CardinalitySettings(attribute));
        attribute.getCardinality().setMaximum("Abc");
    }
}
