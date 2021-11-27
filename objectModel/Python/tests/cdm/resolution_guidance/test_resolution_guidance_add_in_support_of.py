# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from tests.cdm.resolution_guidance import common_test
from tests.common import async_test
from tests.utilities.object_validator import AttributeContextExpectedValue, AttributeExpectedValue


class ResolutionGuidanceAddInSupportOfTest(common_test.CommonTest):
    @async_test
    async def test_add_in_support_of(self):
        """Resolution Guidance Test - AddInSupportOf"""
        test_name = 'test_add_in_support_of'
        entity_name = 'Product'

        expectedContext_default = AttributeContextExpectedValue()
        expectedContext_normalized = AttributeContextExpectedValue()
        expectedContext_referenceOnly = AttributeContextExpectedValue()
        expectedContext_structured = AttributeContextExpectedValue()
        expectedContext_normalized_structured = AttributeContextExpectedValue()
        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()
        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()
        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()


        expected_default = []
        expected_normalized = []
        expected_referenceOnly = []
        expected_structured = []
        expected_normalized_structured = []
        expected_referenceOnly_normalized = []
        expected_referenceOnly_structured = []
        expected_referenceOnly_normalized_structured = []

        await self.run_test_with_values(
            test_name,
            entity_name,

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
        )


    @async_test
    async def test_add_in_support_of_with_is_correlated_with(self):
        """Resolution Guidance Test - AddInSupportOf with IsCorrelatedWith"""
        test_name = 'test_add_in_support_of_with_is_correlated_with'
        entity_name = 'Product'

        expectedContext_default = AttributeContextExpectedValue()
        expectedContext_normalized = AttributeContextExpectedValue()
        expectedContext_referenceOnly = AttributeContextExpectedValue()
        expectedContext_structured = AttributeContextExpectedValue()
        expectedContext_normalized_structured = AttributeContextExpectedValue()
        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()
        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()
        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expected_default = []
        expected_normalized = []
        expected_referenceOnly = []
        expected_structured = []
        expected_normalized_structured = []
        expected_referenceOnly_normalized = []
        expected_referenceOnly_structured = []
        expected_referenceOnly_normalized_structured = []

        await self.run_test_with_values(
            test_name,
            entity_name,

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
        )
