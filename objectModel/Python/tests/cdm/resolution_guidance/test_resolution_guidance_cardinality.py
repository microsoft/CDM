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

        expectedContext_default.type = 'entity'
        expectedContext_default.name = 'Employee_Resolved_default'
        expectedContext_default.definition = 'resolvedFrom/Employee'
        expectedContext_default.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_default/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'FullName'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_default/hasAttributes/FullName')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'TeamID'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID'
        attrCtx_LVL2_IND2.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Team'
        attrCtx_LVL3_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'Name'
        attrCtx_LVL6_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'addedAttributeExpansionTotal'
        attrCtx_LVL4_IND0.name = 'TeamIDTeamCount'
        attrCtx_LVL4_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID/resolutionGuidance/countAttribute/TeamCount'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append('Employee_Resolved_default/hasAttributes/TeamIDTeamCount')

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized = AttributeContextExpectedValue()

        expectedContext_normalized.type = 'entity'
        expectedContext_normalized.name = 'Employee_Resolved_normalized'
        expectedContext_normalized.definition = 'resolvedFrom/Employee'
        expectedContext_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'TeamID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Team'
        attrCtx_LVL3_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'Name'
        attrCtx_LVL6_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'ID'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'FullName'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_normalized/hasAttributes/FullName')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'Employee_Resolved_referenceOnly'
        expectedContext_referenceOnly.definition = 'resolvedFrom/Employee'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'FullName'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/FullName')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'TeamID'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID'
        attrCtx_LVL2_IND2.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Team'
        attrCtx_LVL3_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team'

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'addedAttributeExpansionTotal'
        attrCtx_LVL4_IND0.name = 'TeamIDTeamCount'
        attrCtx_LVL4_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID/resolutionGuidance/countAttribute/TeamCount'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/TeamIDTeamCount')

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'Employee_Resolved_structured'
        expectedContext_structured.definition = 'resolvedFrom/Employee'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'FullName'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_structured/hasAttributes/FullName')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'TeamID'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID'
        attrCtx_LVL2_IND2.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Team'
        attrCtx_LVL3_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append('Employee_Resolved_structured/hasAttributes/TeamID/members/ID')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'Name'
        attrCtx_LVL6_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append('Employee_Resolved_structured/hasAttributes/TeamID/members/Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'Employee_Resolved_normalized_structured'
        expectedContext_normalized_structured.definition = 'resolvedFrom/Employee'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'TeamID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Team'
        attrCtx_LVL3_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'Name'
        attrCtx_LVL6_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'ID'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'FullName'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_normalized_structured/hasAttributes/FullName')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'Employee_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/Employee'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'TeamID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Team'
        attrCtx_LVL3_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'ID'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_referenceOnly_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'FullName'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_referenceOnly_normalized/hasAttributes/FullName')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'Employee_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.definition = 'resolvedFrom/Employee'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_referenceOnly_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'FullName'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_referenceOnly_structured/hasAttributes/FullName')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'TeamID'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID'
        attrCtx_LVL2_IND2.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Team'
        attrCtx_LVL3_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team'

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL5_IND0.name = '_foreignKey'
        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/TeamID/members/TeamID')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'Employee_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/Employee'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'TeamID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Team'
        attrCtx_LVL3_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'ID'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'FullName'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/FullName')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expected_default = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName'
        att.data_format = 'String'
        att.display_name = 'FullName'
        att.name = 'FullName'
        att.source_name = 'FullName'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/TeamIDTeamCount'
        att.data_format = 'Int32'
        att.name = 'TeamIDTeamCount'
        expected_default.append(att)

        expected_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName'
        att.data_format = 'String'
        att.display_name = 'FullName'
        att.name = 'FullName'
        att.source_name = 'FullName'
        expected_normalized.append(att)

        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName'
        att.data_format = 'String'
        att.display_name = 'FullName'
        att.name = 'FullName'
        att.source_name = 'FullName'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/TeamIDTeamCount'
        att.data_format = 'Int32'
        att.name = 'TeamIDTeamCount'
        expected_referenceOnly.append(att)

        expected_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName'
        att.data_format = 'String'
        att.display_name = 'FullName'
        att.name = 'FullName'
        att.source_name = 'FullName'
        expected_structured.append(att)

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'TeamID'
        attrib_group_ref.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope/Name'
        att.data_format = 'String'
        att.name = 'Name'
        attrib_group_ref.members.append(att)
        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName'
        att.data_format = 'String'
        att.display_name = 'FullName'
        att.name = 'FullName'
        att.source_name = 'FullName'
        expected_normalized_structured.append(att)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName'
        att.data_format = 'String'
        att.display_name = 'FullName'
        att.name = 'FullName'
        att.source_name = 'FullName'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName'
        att.data_format = 'String'
        att.display_name = 'FullName'
        att.name = 'FullName'
        att.source_name = 'FullName'
        expected_referenceOnly_structured.append(att)

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'TeamID'
        attrib_group_ref.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.description = ''
        att.display_name = 'TeamID'
        att.name = 'TeamID'
        att.source_name = 'TeamID'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName'
        att.data_format = 'String'
        att.display_name = 'FullName'
        att.name = 'FullName'
        att.source_name = 'FullName'
        expected_referenceOnly_normalized_structured.append(att)

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
