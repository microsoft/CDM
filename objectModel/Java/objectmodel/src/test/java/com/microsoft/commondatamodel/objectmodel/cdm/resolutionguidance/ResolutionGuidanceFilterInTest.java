// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextExpectedValue;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeExpectedValue;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

public class ResolutionGuidanceFilterInTest extends CommonTest {

    /**
     * Resolution Guidance Test - FilterIn - Some
     */
    @Test
    public void testFilterInSome() {
        String testName = "testFilterInSome";
        {
            String entityName = "Employee";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
        {
            String entityName = "EmployeeNames";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
    }

    /**
     * Resolution Guidance Test - FilterIn - Some With AttributeGroupRef
     */
    @Test
    public void testFilterInSomeWithAttributeGroupRef() {
        String testName = "testFilterInSomeWithAttributeGroupRef";
        {
            String entityName = "Employee";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
        {
            String entityName = "EmployeeNames";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
    }

    /**
     * Resolution Guidance Test - FilterIn - All
     */
    @Test
    public void testFilterInAll() {
        String testName = "testFilterInAll";
        {
            String entityName = "Employee";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
        {
            String entityName = "EmployeeNames";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
    }

    /**
     * Resolution Guidance Test - FilterIn - All With AttributeGroupRef
     */
    @Test
    public void testFilterInAllWithAttributeGroupRef() {
        String testName = "testFilterInAllWithAttributeGroupRef";
        {
            String entityName = "Employee";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
        {
            String entityName = "EmployeeNames";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
    }
}
