// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextExpectedValue;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeExpectedValue;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

public class ResolutionGuidancePolymorphismTest extends CommonTest {

    /**
     * Resolution Guidance Test - Polymorphism
     */
    @Test
    public void testPolymorphism() {
        String testName = "testPolymorphism";
        {
            String entityName = "Customer";

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            AttributeContextExpectedValue expectedContext_default = null;
            AttributeContextExpectedValue expectedContext_normalized = null;
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            List<AttributeExpectedValue> expected_default = null;
            List<AttributeExpectedValue> expected_normalized = null;
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
     * Resolution Guidance Test - Polymorphism With AttributeGroupRef
     */
    @Test
    public void testPolymorphismWithAttributeGroupRef() {
        String testName = "testPolymorphismWithAttributeGroupRef";
        {
            String entityName = "Customer";

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            AttributeContextExpectedValue expectedContext_default = null;
            AttributeContextExpectedValue expectedContext_normalized = null;
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            List<AttributeExpectedValue> expected_default = null;
            List<AttributeExpectedValue> expected_normalized = null;
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
     * Resolution Guidance Test - Polymorphism With Rename As Member
     */
    @Test
    public void testPolymorphismWithRenameAsMember() {
        String testName = "testPolymorphismWithRenameAsMember";
        {
            String entityName = "Customer";

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            AttributeContextExpectedValue expectedContext_default = null;
            AttributeContextExpectedValue expectedContext_normalized = null;
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            List<AttributeExpectedValue> expected_default = null;
            List<AttributeExpectedValue> expected_normalized = null;
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
