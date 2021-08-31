# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from tests.cdm.resolution_guidance import common_test
from tests.common import async_test
from tests.utilities.object_validator import AttributeContextExpectedValue, AttributeExpectedValue


class ResolutionGuidanceCardinalityTest(common_test.CommonTest):
    @async_test
    async def test_foreign_key_one_to_one_cardinality(self):
        """Resolution Guidance Test - One:One Cardinality"""
        test_name = 'test_foreign_key_one_to_one_cardinality'
        entity_name = 'Person'

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

        entity_name = 'PersonContact'

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
    async def test_foreign_key_many_to_many_cardinality(self):
        """Resolution Guidance Test - Many:Many Cardinality"""
        test_name = 'test_foreign_key_many_to_many_cardinality'

        entity_name = 'Customer'

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

        entity_name = 'Sales'

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
    async def test_foreign_key_one_to_many_cardinality(self):
        """Resolution Guidance Test - One:Many Cardinality"""
        test_name = 'test_foreign_key_one_to_many_cardinality'

        entity_name = 'Team'

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

        entity_name = 'Employee'

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
