# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from tests.cdm.resolution_guidance import common_test
from tests.common import async_test
from tests.utilities.object_validator import AttributeContextExpectedValue, AttributeExpectedValue


class ResolutionGuidanceExpansionAndRenameTest(common_test.CommonTest):
    @async_test
    async def test_expansion_and_renamed_ordinal_with_attribute_group_ref(self):
        """Resolution Guidance Test - Expansion & Rename - Ordinal With AttributeGroupRef"""
        test_name = 'test_expansion_and_renamed_ordinal_with_attribute_group_ref'
        entity_name = 'EmployeeAddresses'

        expectedContext_default = AttributeContextExpectedValue()

        expectedContext_default.type = 'entity'
        expectedContext_default.name = 'EmployeeAddresses_Resolved_default'
        expectedContext_default.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_default.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Address'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'City'
        attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'State'
        attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'EmployeeAddress1City'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress1City')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'EmployeeAddress1State'
        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress1State')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'generatedRound'
        attrCtx_LVL4_IND1.name = '_generatedAttributeRound1'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'EmployeeAddress2City'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress2City')

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'EmployeeAddress2State'
        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress2State')

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized = AttributeContextExpectedValue()

        expectedContext_normalized.type = 'entity'
        expectedContext_normalized.name = 'EmployeeAddresses_Resolved_normalized'
        expectedContext_normalized.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Address'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'City'
        attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'State'
        attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'EmployeeAddress1City'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress1City')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'EmployeeAddress1State'
        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress1State')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'generatedRound'
        attrCtx_LVL4_IND1.name = '_generatedAttributeRound1'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'EmployeeAddress2City'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress2City')

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'EmployeeAddress2State'
        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress2State')

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'EmployeeAddresses_Resolved_referenceOnly'
        expectedContext_referenceOnly.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Address'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'City'
        attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'State'
        attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'EmployeeAddress1City'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress1City')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'EmployeeAddress1State'
        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress1State')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'generatedRound'
        attrCtx_LVL4_IND1.name = '_generatedAttributeRound1'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'EmployeeAddress2City'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress2City')

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'EmployeeAddress2State'
        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress2State')

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'EmployeeAddresses_Resolved_structured'
        expectedContext_structured.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Address'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'City'
        attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/City')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'State'
        attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/State')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'EmployeeAddresses_Resolved_normalized_structured'
        expectedContext_normalized_structured.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Address'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'City'
        attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/City')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'State'
        attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/State')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'EmployeeAddresses_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Address'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'City'
        attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'State'
        attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'EmployeeAddress1City'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress1City')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'EmployeeAddress1State'
        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress1State')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'generatedRound'
        attrCtx_LVL4_IND1.name = '_generatedAttributeRound1'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'EmployeeAddress2City'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress2City')

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'EmployeeAddress2State'
        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress2State')

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'EmployeeAddresses_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Address'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'City'
        attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/City')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'State'
        attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/State')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Address'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'City'
        attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/City')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'State'
        attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/State')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expected_default = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City'
        att.data_format = 'String'
        att.display_name = 'City'
        att.name = 'EmployeeAddress1City'
        att.source_name = 'City'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State'
        att.data_format = 'String'
        att.display_name = 'State'
        att.name = 'EmployeeAddress1State'
        att.source_name = 'State'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City'
        att.data_format = 'String'
        att.display_name = 'City'
        att.name = 'EmployeeAddress2City'
        att.source_name = 'City'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State'
        att.data_format = 'String'
        att.display_name = 'State'
        att.name = 'EmployeeAddress2State'
        att.source_name = 'State'
        expected_default.append(att)

        expected_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City'
        att.data_format = 'String'
        att.display_name = 'City'
        att.name = 'EmployeeAddress1City'
        att.source_name = 'City'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State'
        att.data_format = 'String'
        att.display_name = 'State'
        att.name = 'EmployeeAddress1State'
        att.source_name = 'State'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City'
        att.data_format = 'String'
        att.display_name = 'City'
        att.name = 'EmployeeAddress2City'
        att.source_name = 'City'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State'
        att.data_format = 'String'
        att.display_name = 'State'
        att.name = 'EmployeeAddress2State'
        att.source_name = 'State'
        expected_normalized.append(att)

        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City'
        att.data_format = 'String'
        att.display_name = 'City'
        att.name = 'EmployeeAddress1City'
        att.source_name = 'City'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State'
        att.data_format = 'String'
        att.display_name = 'State'
        att.name = 'EmployeeAddress1State'
        att.source_name = 'State'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City'
        att.data_format = 'String'
        att.display_name = 'City'
        att.name = 'EmployeeAddress2City'
        att.source_name = 'City'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State'
        att.data_format = 'String'
        att.display_name = 'State'
        att.name = 'EmployeeAddress2State'
        att.source_name = 'State'
        expected_referenceOnly.append(att)

        expected_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeAddress'
        attrib_group_ref.attribute_context = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City'
        att.data_format = 'String'
        att.name = 'City'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State'
        att.data_format = 'String'
        att.name = 'State'
        attrib_group_ref.members.append(att)
        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeAddress'
        attrib_group_ref.attribute_context = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City'
        att.data_format = 'String'
        att.name = 'City'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State'
        att.data_format = 'String'
        att.name = 'State'
        attrib_group_ref.members.append(att)
        expected_normalized_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City'
        att.data_format = 'String'
        att.display_name = 'City'
        att.name = 'EmployeeAddress1City'
        att.source_name = 'City'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State'
        att.data_format = 'String'
        att.display_name = 'State'
        att.name = 'EmployeeAddress1State'
        att.source_name = 'State'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City'
        att.data_format = 'String'
        att.display_name = 'City'
        att.name = 'EmployeeAddress2City'
        att.source_name = 'City'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State'
        att.data_format = 'String'
        att.display_name = 'State'
        att.name = 'EmployeeAddress2State'
        att.source_name = 'State'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeAddress'
        attrib_group_ref.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City'
        att.data_format = 'String'
        att.name = 'City'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State'
        att.data_format = 'String'
        att.name = 'State'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeAddress'
        attrib_group_ref.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City'
        att.data_format = 'String'
        att.name = 'City'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State'
        att.data_format = 'String'
        att.name = 'State'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_normalized_structured.append(attrib_group_ref)

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
    async def test_expansion_and_renamed_ordinal_23_and_add_count(self):
        """Resolution Guidance Test - Expansion & Rename - Ordinal 2 to 3 and AddCount"""
        test_name = 'test_expansion_and_renamed_ordinal_23_and_add_count'

        entity_name = 'EmployeeAddresses'

        expectedContext_default = AttributeContextExpectedValue()

        expectedContext_default.type = 'entity'
        expectedContext_default.name = 'EmployeeAddresses_Resolved_default'
        expectedContext_default.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_default.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeAddress'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Address'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'City'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City'

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'State'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State'

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'addedAttributeExpansionTotal'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress__AddressCount'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress__AddressCount')

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'generatedRound'
        attrCtx_LVL2_IND1.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_2_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_2_City')

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_2_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_2_State')

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'generatedRound'
        attrCtx_LVL2_IND2.name = '_generatedAttributeRound1'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND2.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_3_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_3_City')

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_3_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_3_State')

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'generatedRound'
        attrCtx_LVL2_IND3.name = '_generatedAttributeRound2'
        attrCtx_LVL2_IND3.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND3.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_4_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_4_City')

        attrCtx_LVL2_IND3.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_4_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_4_State')

        attrCtx_LVL2_IND3.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND3)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized = AttributeContextExpectedValue()

        expectedContext_normalized.type = 'entity'
        expectedContext_normalized.name = 'EmployeeAddresses_Resolved_normalized'
        expectedContext_normalized.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeAddress'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Address'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'City'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City'

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'State'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State'

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'addedAttributeExpansionTotal'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress__AddressCount'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress__AddressCount')

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'generatedRound'
        attrCtx_LVL2_IND1.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_2_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_2_City')

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_2_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_2_State')

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'generatedRound'
        attrCtx_LVL2_IND2.name = '_generatedAttributeRound1'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND2.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_3_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_3_City')

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_3_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_3_State')

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'generatedRound'
        attrCtx_LVL2_IND3.name = '_generatedAttributeRound2'
        attrCtx_LVL2_IND3.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND3.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_4_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_4_City')

        attrCtx_LVL2_IND3.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_4_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_4_State')

        attrCtx_LVL2_IND3.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND3)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'EmployeeAddresses_Resolved_referenceOnly'
        expectedContext_referenceOnly.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeAddress'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Address'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'City'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City'

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'State'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State'

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'addedAttributeExpansionTotal'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress__AddressCount'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress__AddressCount')

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'generatedRound'
        attrCtx_LVL2_IND1.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_2_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_2_City')

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_2_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_2_State')

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'generatedRound'
        attrCtx_LVL2_IND2.name = '_generatedAttributeRound1'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND2.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_3_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_3_City')

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_3_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_3_State')

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'generatedRound'
        attrCtx_LVL2_IND3.name = '_generatedAttributeRound2'
        attrCtx_LVL2_IND3.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND3.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_4_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_4_City')

        attrCtx_LVL2_IND3.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_4_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_4_State')

        attrCtx_LVL2_IND3.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND3)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'EmployeeAddresses_Resolved_structured'
        expectedContext_structured.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeAddress'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Address'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'City'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/City')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'State'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/State')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'EmployeeAddresses_Resolved_normalized_structured'
        expectedContext_normalized_structured.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeAddress'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Address'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'City'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/City')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'State'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/State')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'EmployeeAddresses_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeAddress'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Address'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'City'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City'

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'State'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State'

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'addedAttributeExpansionTotal'
        attrCtx_LVL2_IND0.name = 'EmployeeAddress__AddressCount'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress__AddressCount')

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'generatedRound'
        attrCtx_LVL2_IND1.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_2_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_2_City')

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_2_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_2_State')

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'generatedRound'
        attrCtx_LVL2_IND2.name = '_generatedAttributeRound1'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND2.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_3_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_3_City')

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_3_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_3_State')

        attrCtx_LVL2_IND2.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'generatedRound'
        attrCtx_LVL2_IND3.name = '_generatedAttributeRound2'
        attrCtx_LVL2_IND3.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet'
        attrCtx_LVL2_IND3.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'EmployeeAddress_4_City'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_4_City')

        attrCtx_LVL2_IND3.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'EmployeeAddress_4_State'
        attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_4_State')

        attrCtx_LVL2_IND3.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND3)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'EmployeeAddresses_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeAddress'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Address'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'City'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/City')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'State'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/State')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/EmployeeAddresses'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeAddress'
        attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Address'
        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'City'
        attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/City')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'State'
        attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/State')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expected_default = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount'
        att.data_format = 'Int32'
        att.name = 'EmployeeAddress__AddressCount'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_2_City'
        att.source_name = 'City'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_2_State'
        att.source_name = 'State'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_3_City'
        att.source_name = 'City'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_3_State'
        att.source_name = 'State'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_4_City'
        att.source_name = 'City'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_4_State'
        att.source_name = 'State'
        expected_default.append(att)

        expected_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount'
        att.data_format = 'Int32'
        att.name = 'EmployeeAddress__AddressCount'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_2_City'
        att.source_name = 'City'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_2_State'
        att.source_name = 'State'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_3_City'
        att.source_name = 'City'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_3_State'
        att.source_name = 'State'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_4_City'
        att.source_name = 'City'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_4_State'
        att.source_name = 'State'
        expected_normalized.append(att)

        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount'
        att.data_format = 'Int32'
        att.name = 'EmployeeAddress__AddressCount'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_2_City'
        att.source_name = 'City'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_2_State'
        att.source_name = 'State'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_3_City'
        att.source_name = 'City'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_3_State'
        att.source_name = 'State'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_4_City'
        att.source_name = 'City'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_4_State'
        att.source_name = 'State'
        expected_referenceOnly.append(att)

        expected_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeAddress'
        attrib_group_ref.attribute_context = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/City'
        att.data_format = 'String'
        att.name = 'City'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/State'
        att.data_format = 'String'
        att.name = 'State'
        attrib_group_ref.members.append(att)
        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeAddress'
        attrib_group_ref.attribute_context = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/City'
        att.data_format = 'String'
        att.name = 'City'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/State'
        att.data_format = 'String'
        att.name = 'State'
        attrib_group_ref.members.append(att)
        expected_normalized_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount'
        att.data_format = 'Int32'
        att.name = 'EmployeeAddress__AddressCount'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_2_City'
        att.source_name = 'City'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_2_State'
        att.source_name = 'State'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_3_City'
        att.source_name = 'City'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_3_State'
        att.source_name = 'State'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_4_City'
        att.source_name = 'City'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State'
        att.data_format = 'String'
        att.name = 'EmployeeAddress_4_State'
        att.source_name = 'State'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeAddress'
        attrib_group_ref.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/City'
        att.data_format = 'String'
        att.name = 'City'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/State'
        att.data_format = 'String'
        att.name = 'State'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeAddress'
        attrib_group_ref.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/City'
        att.data_format = 'String'
        att.name = 'City'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/State'
        att.data_format = 'String'
        att.name = 'State'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_normalized_structured.append(attrib_group_ref)

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
