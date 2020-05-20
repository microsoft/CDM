# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from tests.cdm.resolution_guidance import common_test
from tests.common import async_test
from tests.utilities.object_validator import AttributeContextExpectedValue, AttributeExpectedValue


class ResolutionGuidanceFilterOutTest(common_test.CommonTest):
    @async_test
    async def test_filter_out_some(self):
        """Resolution Guidance Test - FilterOut - Some"""
        test_name = 'test_filter_out_some'
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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_default/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_default/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_default/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_normalized/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_normalized/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_normalized/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_normalized/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_normalized/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_normalized/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_referenceOnly_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_structured.append(att)

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
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_referenceOnly_structured.append(att)

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
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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

        entity_name = 'EmployeeNames'

        expectedContext_default = AttributeContextExpectedValue()

        expectedContext_default.type = 'entity'
        expectedContext_default.name = 'EmployeeNames_Resolved_default'
        expectedContext_default.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_default.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'First_Name'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'Last_Name'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized = AttributeContextExpectedValue()

        expectedContext_normalized.type = 'entity'
        expectedContext_normalized.name = 'EmployeeNames_Resolved_normalized'
        expectedContext_normalized.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'First_Name'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'Last_Name'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'EmployeeNames_Resolved_referenceOnly'
        expectedContext_referenceOnly.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'First_Name'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'Last_Name'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'EmployeeNames_Resolved_structured'
        expectedContext_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL4_IND4.context_strings = []

        attrCtx_LVL4_IND4.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL4_IND5.context_strings = []

        attrCtx_LVL4_IND5.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL4_IND6.context_strings = []

        attrCtx_LVL4_IND6.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'EmployeeNames_Resolved_normalized_structured'
        expectedContext_normalized_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL4_IND4.context_strings = []

        attrCtx_LVL4_IND4.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL4_IND5.context_strings = []

        attrCtx_LVL4_IND5.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL4_IND6.context_strings = []

        attrCtx_LVL4_IND6.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'EmployeeNames_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'First_Name'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'Last_Name'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'EmployeeNames_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL4_IND4.context_strings = []

        attrCtx_LVL4_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL4_IND5.context_strings = []

        attrCtx_LVL4_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL4_IND6.context_strings = []

        attrCtx_LVL4_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'EmployeeNames_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL4_IND4.context_strings = []

        attrCtx_LVL4_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL4_IND5.context_strings = []

        attrCtx_LVL4_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL4_IND6.context_strings = []

        attrCtx_LVL4_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expected_default = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_default.append(att)

        expected_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_normalized.append(att)

        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly.append(att)

        expected_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_normalized_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
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
    async def test_filter_out_some_with_attribute_group_ref(self):
        """Resolution Guidance Test - FilterOut - Some With AttributeGroupRef"""
        test_name = 'test_filter_out_some_with_attribute_group_ref'
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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_default/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_default/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_default/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_normalized/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_normalized/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_normalized/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_normalized/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_normalized/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_normalized/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_referenceOnly_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_structured.append(att)

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
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_referenceOnly_structured.append(att)

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
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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

        entity_name = 'EmployeeNames'

        expectedContext_default = AttributeContextExpectedValue()

        expectedContext_default.type = 'entity'
        expectedContext_default.name = 'EmployeeNames_Resolved_default'
        expectedContext_default.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_default.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'First_Name'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'Last_Name'
        attrCtx_LVL5_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized = AttributeContextExpectedValue()

        expectedContext_normalized.type = 'entity'
        expectedContext_normalized.name = 'EmployeeNames_Resolved_normalized'
        expectedContext_normalized.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'First_Name'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'Last_Name'
        attrCtx_LVL5_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'EmployeeNames_Resolved_referenceOnly'
        expectedContext_referenceOnly.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'First_Name'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'Last_Name'
        attrCtx_LVL5_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'EmployeeNames_Resolved_structured'
        expectedContext_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL6_IND2.context_strings = []

        attrCtx_LVL6_IND2.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL6_IND3.context_strings = []

        attrCtx_LVL6_IND3.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL6_IND4.context_strings = []

        attrCtx_LVL6_IND4.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL6_IND5.context_strings = []

        attrCtx_LVL6_IND5.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL6_IND6.context_strings = []

        attrCtx_LVL6_IND6.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'EmployeeNames_Resolved_normalized_structured'
        expectedContext_normalized_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL6_IND2.context_strings = []

        attrCtx_LVL6_IND2.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL6_IND3.context_strings = []

        attrCtx_LVL6_IND3.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL6_IND4.context_strings = []

        attrCtx_LVL6_IND4.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL6_IND5.context_strings = []

        attrCtx_LVL6_IND5.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL6_IND6.context_strings = []

        attrCtx_LVL6_IND6.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'EmployeeNames_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'First_Name'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'Last_Name'
        attrCtx_LVL5_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'EmployeeNames_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL6_IND2.context_strings = []

        attrCtx_LVL6_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL6_IND3.context_strings = []

        attrCtx_LVL6_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL6_IND4.context_strings = []

        attrCtx_LVL6_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL6_IND5.context_strings = []

        attrCtx_LVL6_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL6_IND6.context_strings = []

        attrCtx_LVL6_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'EmployeeNames_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL6_IND2.context_strings = []

        attrCtx_LVL6_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL6_IND3.context_strings = []

        attrCtx_LVL6_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL6_IND4.context_strings = []

        attrCtx_LVL6_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL6_IND5.context_strings = []

        attrCtx_LVL6_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL6_IND6.context_strings = []

        attrCtx_LVL6_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expected_default = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_default.append(att)

        expected_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_normalized.append(att)

        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly.append(att)

        expected_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_normalized_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
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
    async def test_filter_out_all(self):
        """Resolution Guidance Test - FilterOut - All"""
        test_name = 'test_filter_out_all'
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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_default/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_default/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_default/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_normalized/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_normalized/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_normalized/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_normalized/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_normalized/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_normalized/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_referenceOnly_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_structured.append(att)

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
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_referenceOnly_structured.append(att)

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
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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

        entity_name = 'EmployeeNames'

        expectedContext_default = AttributeContextExpectedValue()

        expectedContext_default.type = 'entity'
        expectedContext_default.name = 'EmployeeNames_Resolved_default'
        expectedContext_default.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_default.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'ID'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesID')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'First_Name'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)
        attrCtx_LVL3_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND2.type = 'attributeDefinition'
        attrCtx_LVL3_IND2.name = 'Last_Name'
        attrCtx_LVL3_IND2.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL3_IND2.context_strings = []

        attrCtx_LVL3_IND2.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND2)
        attrCtx_LVL3_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND3.type = 'attributeDefinition'
        attrCtx_LVL3_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL3_IND3.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL3_IND3.context_strings = []

        attrCtx_LVL3_IND3.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesDate_Of_Joining')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND3)
        attrCtx_LVL3_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND4.type = 'attributeDefinition'
        attrCtx_LVL3_IND4.name = 'Office_Number'
        attrCtx_LVL3_IND4.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL3_IND4.context_strings = []

        attrCtx_LVL3_IND4.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesOffice_Number')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND4)
        attrCtx_LVL3_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND5.type = 'attributeDefinition'
        attrCtx_LVL3_IND5.name = 'Office_Building'
        attrCtx_LVL3_IND5.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL3_IND5.context_strings = []

        attrCtx_LVL3_IND5.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesOffice_Building')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND5)
        attrCtx_LVL3_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND6.type = 'attributeDefinition'
        attrCtx_LVL3_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL3_IND6.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL3_IND6.context_strings = []

        attrCtx_LVL3_IND6.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesOffice_Geo_Location')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND6)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized = AttributeContextExpectedValue()

        expectedContext_normalized.type = 'entity'
        expectedContext_normalized.name = 'EmployeeNames_Resolved_normalized'
        expectedContext_normalized.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'ID'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesID')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'First_Name'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)
        attrCtx_LVL3_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND2.type = 'attributeDefinition'
        attrCtx_LVL3_IND2.name = 'Last_Name'
        attrCtx_LVL3_IND2.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL3_IND2.context_strings = []

        attrCtx_LVL3_IND2.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND2)
        attrCtx_LVL3_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND3.type = 'attributeDefinition'
        attrCtx_LVL3_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL3_IND3.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL3_IND3.context_strings = []

        attrCtx_LVL3_IND3.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesDate_Of_Joining')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND3)
        attrCtx_LVL3_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND4.type = 'attributeDefinition'
        attrCtx_LVL3_IND4.name = 'Office_Number'
        attrCtx_LVL3_IND4.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL3_IND4.context_strings = []

        attrCtx_LVL3_IND4.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesOffice_Number')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND4)
        attrCtx_LVL3_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND5.type = 'attributeDefinition'
        attrCtx_LVL3_IND5.name = 'Office_Building'
        attrCtx_LVL3_IND5.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL3_IND5.context_strings = []

        attrCtx_LVL3_IND5.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesOffice_Building')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND5)
        attrCtx_LVL3_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND6.type = 'attributeDefinition'
        attrCtx_LVL3_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL3_IND6.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL3_IND6.context_strings = []

        attrCtx_LVL3_IND6.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesOffice_Geo_Location')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND6)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'EmployeeNames_Resolved_referenceOnly'
        expectedContext_referenceOnly.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'ID'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesID')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'First_Name'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)
        attrCtx_LVL3_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND2.type = 'attributeDefinition'
        attrCtx_LVL3_IND2.name = 'Last_Name'
        attrCtx_LVL3_IND2.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL3_IND2.context_strings = []

        attrCtx_LVL3_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND2)
        attrCtx_LVL3_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND3.type = 'attributeDefinition'
        attrCtx_LVL3_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL3_IND3.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL3_IND3.context_strings = []

        attrCtx_LVL3_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesDate_Of_Joining')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND3)
        attrCtx_LVL3_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND4.type = 'attributeDefinition'
        attrCtx_LVL3_IND4.name = 'Office_Number'
        attrCtx_LVL3_IND4.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL3_IND4.context_strings = []

        attrCtx_LVL3_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesOffice_Number')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND4)
        attrCtx_LVL3_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND5.type = 'attributeDefinition'
        attrCtx_LVL3_IND5.name = 'Office_Building'
        attrCtx_LVL3_IND5.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL3_IND5.context_strings = []

        attrCtx_LVL3_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesOffice_Building')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND5)
        attrCtx_LVL3_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND6.type = 'attributeDefinition'
        attrCtx_LVL3_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL3_IND6.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL3_IND6.context_strings = []

        attrCtx_LVL3_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesOffice_Geo_Location')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND6)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'EmployeeNames_Resolved_structured'
        expectedContext_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL4_IND4.context_strings = []

        attrCtx_LVL4_IND4.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL4_IND5.context_strings = []

        attrCtx_LVL4_IND5.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL4_IND6.context_strings = []

        attrCtx_LVL4_IND6.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'EmployeeNames_Resolved_normalized_structured'
        expectedContext_normalized_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL4_IND4.context_strings = []

        attrCtx_LVL4_IND4.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL4_IND5.context_strings = []

        attrCtx_LVL4_IND5.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL4_IND6.context_strings = []

        attrCtx_LVL4_IND6.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'EmployeeNames_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeDefinition'
        attrCtx_LVL3_IND0.name = 'ID'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesID')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'attributeDefinition'
        attrCtx_LVL3_IND1.name = 'First_Name'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)
        attrCtx_LVL3_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND2.type = 'attributeDefinition'
        attrCtx_LVL3_IND2.name = 'Last_Name'
        attrCtx_LVL3_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL3_IND2.context_strings = []

        attrCtx_LVL3_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND2)
        attrCtx_LVL3_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND3.type = 'attributeDefinition'
        attrCtx_LVL3_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL3_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL3_IND3.context_strings = []

        attrCtx_LVL3_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesDate_Of_Joining')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND3)
        attrCtx_LVL3_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND4.type = 'attributeDefinition'
        attrCtx_LVL3_IND4.name = 'Office_Number'
        attrCtx_LVL3_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL3_IND4.context_strings = []

        attrCtx_LVL3_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesOffice_Number')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND4)
        attrCtx_LVL3_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND5.type = 'attributeDefinition'
        attrCtx_LVL3_IND5.name = 'Office_Building'
        attrCtx_LVL3_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL3_IND5.context_strings = []

        attrCtx_LVL3_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesOffice_Building')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND5)
        attrCtx_LVL3_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND6.type = 'attributeDefinition'
        attrCtx_LVL3_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL3_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL3_IND6.context_strings = []

        attrCtx_LVL3_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesOffice_Geo_Location')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND6)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'EmployeeNames_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL4_IND4.context_strings = []

        attrCtx_LVL4_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL4_IND5.context_strings = []

        attrCtx_LVL4_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL4_IND6.context_strings = []

        attrCtx_LVL4_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'EmployeeNames_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'EmployeeNames'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/EmployeeNames'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Employee'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL2_IND0.name = 'extends'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'CdmEntity'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/extends'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'attributeGroup'
        attrCtx_LVL3_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'ID'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL4_IND0.context_strings = []

        attrCtx_LVL4_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'First_Name'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'Last_Name'
        attrCtx_LVL4_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL4_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)
        attrCtx_LVL4_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND4.type = 'attributeDefinition'
        attrCtx_LVL4_IND4.name = 'Office_Number'
        attrCtx_LVL4_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL4_IND4.context_strings = []

        attrCtx_LVL4_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND4)
        attrCtx_LVL4_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND5.type = 'attributeDefinition'
        attrCtx_LVL4_IND5.name = 'Office_Building'
        attrCtx_LVL4_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL4_IND5.context_strings = []

        attrCtx_LVL4_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND5)
        attrCtx_LVL4_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND6.type = 'attributeDefinition'
        attrCtx_LVL4_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL4_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL4_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL4_IND6.context_strings = []

        attrCtx_LVL4_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND6)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expected_default = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'EmployeeNamesID'
        att.source_name = 'ID'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'EmployeeNamesDate_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'EmployeeNamesOffice_Number'
        att.source_name = 'Office_Number'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'EmployeeNamesOffice_Building'
        att.source_name = 'Office_Building'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'EmployeeNamesOffice_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_default.append(att)

        expected_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'EmployeeNamesID'
        att.source_name = 'ID'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'EmployeeNamesDate_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'EmployeeNamesOffice_Number'
        att.source_name = 'Office_Number'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'EmployeeNamesOffice_Building'
        att.source_name = 'Office_Building'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'EmployeeNamesOffice_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_normalized.append(att)

        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'EmployeeNamesID'
        att.source_name = 'ID'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'EmployeeNamesDate_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'EmployeeNamesOffice_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'EmployeeNamesOffice_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'EmployeeNamesOffice_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_referenceOnly.append(att)

        expected_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_normalized_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'EmployeeNamesID'
        att.source_name = 'ID'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'EmployeeNamesDate_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'EmployeeNamesOffice_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'EmployeeNamesOffice_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'EmployeeNamesOffice_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
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
    async def test_filter_out_all_with_attribute_group_ref(self):
        """Resolution Guidance Test - FilterOut - All With AttributeGroupRef"""
        test_name = 'test_filter_out_all_with_attribute_group_ref'
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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_default/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_default/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_default/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append('Employee_Resolved_default/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_normalized/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_normalized/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_normalized/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_normalized/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_normalized/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_normalized/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_referenceOnly/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Employee_Resolved_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Employee_Resolved_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append('Employee_Resolved_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append('Employee_Resolved_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append('Employee_Resolved_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_normalized_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Employee_Resolved_referenceOnly_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'First_Name'
        attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/First_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'Last_Name'
        attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Last_Name')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)
        attrCtx_LVL2_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND3.type = 'attributeDefinition'
        attrCtx_LVL2_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL2_IND3.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL2_IND3.context_strings = []

        attrCtx_LVL2_IND3.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Date_Of_Joining')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND3)
        attrCtx_LVL2_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND4.type = 'attributeDefinition'
        attrCtx_LVL2_IND4.name = 'Office_Number'
        attrCtx_LVL2_IND4.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL2_IND4.context_strings = []

        attrCtx_LVL2_IND4.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Number')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND4)
        attrCtx_LVL2_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND5.type = 'attributeDefinition'
        attrCtx_LVL2_IND5.name = 'Office_Building'
        attrCtx_LVL2_IND5.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL2_IND5.context_strings = []

        attrCtx_LVL2_IND5.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Building')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND5)
        attrCtx_LVL2_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND6.type = 'attributeDefinition'
        attrCtx_LVL2_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL2_IND6.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL2_IND6.context_strings = []

        attrCtx_LVL2_IND6.context_strings.append(
            'Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/Office_Geo_Location')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND6)

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
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_structured.append(att)

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
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_referenceOnly_structured.append(att)

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
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'First_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'Last_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'Date_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'Office_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'Office_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'Office_Geo_Location'
        att.source_name = 'Office_Geo_Location'
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

        entity_name = 'EmployeeNames'

        expectedContext_default = AttributeContextExpectedValue()

        expectedContext_default.type = 'entity'
        expectedContext_default.name = 'EmployeeNames_Resolved_default'
        expectedContext_default.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_default.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'ID'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesID')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'First_Name'
        attrCtx_LVL5_IND1.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)
        attrCtx_LVL5_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND2.type = 'attributeDefinition'
        attrCtx_LVL5_IND2.name = 'Last_Name'
        attrCtx_LVL5_IND2.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL5_IND2.context_strings = []

        attrCtx_LVL5_IND2.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND2)
        attrCtx_LVL5_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND3.type = 'attributeDefinition'
        attrCtx_LVL5_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL5_IND3.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL5_IND3.context_strings = []

        attrCtx_LVL5_IND3.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesDate_Of_Joining')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND3)
        attrCtx_LVL5_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND4.type = 'attributeDefinition'
        attrCtx_LVL5_IND4.name = 'Office_Number'
        attrCtx_LVL5_IND4.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL5_IND4.context_strings = []

        attrCtx_LVL5_IND4.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesOffice_Number')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND4)
        attrCtx_LVL5_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND5.type = 'attributeDefinition'
        attrCtx_LVL5_IND5.name = 'Office_Building'
        attrCtx_LVL5_IND5.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL5_IND5.context_strings = []

        attrCtx_LVL5_IND5.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesOffice_Building')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND5)
        attrCtx_LVL5_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND6.type = 'attributeDefinition'
        attrCtx_LVL5_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL5_IND6.parent = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL5_IND6.context_strings = []

        attrCtx_LVL5_IND6.context_strings.append(
            'EmployeeNames_Resolved_default/hasAttributes/EmployeeNamesOffice_Geo_Location')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND6)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized = AttributeContextExpectedValue()

        expectedContext_normalized.type = 'entity'
        expectedContext_normalized.name = 'EmployeeNames_Resolved_normalized'
        expectedContext_normalized.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'ID'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesID')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'First_Name'
        attrCtx_LVL5_IND1.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)
        attrCtx_LVL5_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND2.type = 'attributeDefinition'
        attrCtx_LVL5_IND2.name = 'Last_Name'
        attrCtx_LVL5_IND2.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL5_IND2.context_strings = []

        attrCtx_LVL5_IND2.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND2)
        attrCtx_LVL5_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND3.type = 'attributeDefinition'
        attrCtx_LVL5_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL5_IND3.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL5_IND3.context_strings = []

        attrCtx_LVL5_IND3.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesDate_Of_Joining')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND3)
        attrCtx_LVL5_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND4.type = 'attributeDefinition'
        attrCtx_LVL5_IND4.name = 'Office_Number'
        attrCtx_LVL5_IND4.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL5_IND4.context_strings = []

        attrCtx_LVL5_IND4.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesOffice_Number')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND4)
        attrCtx_LVL5_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND5.type = 'attributeDefinition'
        attrCtx_LVL5_IND5.name = 'Office_Building'
        attrCtx_LVL5_IND5.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL5_IND5.context_strings = []

        attrCtx_LVL5_IND5.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesOffice_Building')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND5)
        attrCtx_LVL5_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND6.type = 'attributeDefinition'
        attrCtx_LVL5_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL5_IND6.parent = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL5_IND6.context_strings = []

        attrCtx_LVL5_IND6.context_strings.append(
            'EmployeeNames_Resolved_normalized/hasAttributes/EmployeeNamesOffice_Geo_Location')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND6)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'EmployeeNames_Resolved_referenceOnly'
        expectedContext_referenceOnly.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'ID'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesID')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'First_Name'
        attrCtx_LVL5_IND1.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)
        attrCtx_LVL5_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND2.type = 'attributeDefinition'
        attrCtx_LVL5_IND2.name = 'Last_Name'
        attrCtx_LVL5_IND2.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL5_IND2.context_strings = []

        attrCtx_LVL5_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND2)
        attrCtx_LVL5_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND3.type = 'attributeDefinition'
        attrCtx_LVL5_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL5_IND3.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL5_IND3.context_strings = []

        attrCtx_LVL5_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesDate_Of_Joining')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND3)
        attrCtx_LVL5_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND4.type = 'attributeDefinition'
        attrCtx_LVL5_IND4.name = 'Office_Number'
        attrCtx_LVL5_IND4.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL5_IND4.context_strings = []

        attrCtx_LVL5_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesOffice_Number')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND4)
        attrCtx_LVL5_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND5.type = 'attributeDefinition'
        attrCtx_LVL5_IND5.name = 'Office_Building'
        attrCtx_LVL5_IND5.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL5_IND5.context_strings = []

        attrCtx_LVL5_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesOffice_Building')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND5)
        attrCtx_LVL5_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND6.type = 'attributeDefinition'
        attrCtx_LVL5_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL5_IND6.parent = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL5_IND6.context_strings = []

        attrCtx_LVL5_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly/hasAttributes/EmployeeNamesOffice_Geo_Location')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND6)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'EmployeeNames_Resolved_structured'
        expectedContext_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL6_IND2.context_strings = []

        attrCtx_LVL6_IND2.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL6_IND3.context_strings = []

        attrCtx_LVL6_IND3.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL6_IND4.context_strings = []

        attrCtx_LVL6_IND4.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL6_IND5.context_strings = []

        attrCtx_LVL6_IND5.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL6_IND6.context_strings = []

        attrCtx_LVL6_IND6.context_strings.append(
            'EmployeeNames_Resolved_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'EmployeeNames_Resolved_normalized_structured'
        expectedContext_normalized_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL6_IND2.context_strings = []

        attrCtx_LVL6_IND2.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL6_IND3.context_strings = []

        attrCtx_LVL6_IND3.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL6_IND4.context_strings = []

        attrCtx_LVL6_IND4.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL6_IND5.context_strings = []

        attrCtx_LVL6_IND5.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL6_IND6.context_strings = []

        attrCtx_LVL6_IND6.context_strings.append(
            'EmployeeNames_Resolved_normalized_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'EmployeeNames_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeDefinition'
        attrCtx_LVL5_IND0.name = 'ID'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesID')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'attributeDefinition'
        attrCtx_LVL5_IND1.name = 'First_Name'
        attrCtx_LVL5_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesFirst_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)
        attrCtx_LVL5_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND2.type = 'attributeDefinition'
        attrCtx_LVL5_IND2.name = 'Last_Name'
        attrCtx_LVL5_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL5_IND2.context_strings = []

        attrCtx_LVL5_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesLast_Name')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND2)
        attrCtx_LVL5_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND3.type = 'attributeDefinition'
        attrCtx_LVL5_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL5_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL5_IND3.context_strings = []

        attrCtx_LVL5_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesDate_Of_Joining')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND3)
        attrCtx_LVL5_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND4.type = 'attributeDefinition'
        attrCtx_LVL5_IND4.name = 'Office_Number'
        attrCtx_LVL5_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL5_IND4.context_strings = []

        attrCtx_LVL5_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesOffice_Number')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND4)
        attrCtx_LVL5_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND5.type = 'attributeDefinition'
        attrCtx_LVL5_IND5.name = 'Office_Building'
        attrCtx_LVL5_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL5_IND5.context_strings = []

        attrCtx_LVL5_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesOffice_Building')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND5)
        attrCtx_LVL5_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND6.type = 'attributeDefinition'
        attrCtx_LVL5_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL5_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL5_IND6.context_strings = []

        attrCtx_LVL5_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized/hasAttributes/EmployeeNamesOffice_Geo_Location')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND6)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'EmployeeNames_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL6_IND2.context_strings = []

        attrCtx_LVL6_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL6_IND3.context_strings = []

        attrCtx_LVL6_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL6_IND4.context_strings = []

        attrCtx_LVL6_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL6_IND5.context_strings = []

        attrCtx_LVL6_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL6_IND6.context_strings = []

        attrCtx_LVL6_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'EmployeeNames_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/EmployeeNames'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'EmployeeNames'
        attrCtx_LVL2_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeNames/hasAttributes/attributesAddedAtThisScope/members/EmployeeNames'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Employee'
        attrCtx_LVL3_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrCtx_LVL3_IND0.definition = 'resolvedFrom/Employee'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/extends'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee'
        attrCtx_LVL4_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'attributeGroup'
        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'attributeDefinition'
        attrCtx_LVL6_IND0.name = 'ID'
        attrCtx_LVL6_IND0.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL6_IND0.context_strings = []

        attrCtx_LVL6_IND0.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/ID')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'First_Name'
        attrCtx_LVL6_IND1.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/First_Name'
        attrCtx_LVL6_IND1.context_strings = []

        attrCtx_LVL6_IND1.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/First_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)
        attrCtx_LVL6_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND2.type = 'attributeDefinition'
        attrCtx_LVL6_IND2.name = 'Last_Name'
        attrCtx_LVL6_IND2.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Last_Name'
        attrCtx_LVL6_IND2.context_strings = []

        attrCtx_LVL6_IND2.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Last_Name')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND2)
        attrCtx_LVL6_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND3.type = 'attributeDefinition'
        attrCtx_LVL6_IND3.name = 'Date_Of_Joining'
        attrCtx_LVL6_IND3.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND3.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Date_Of_Joining'
        attrCtx_LVL6_IND3.context_strings = []

        attrCtx_LVL6_IND3.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Date_Of_Joining')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND3)
        attrCtx_LVL6_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND4.type = 'attributeDefinition'
        attrCtx_LVL6_IND4.name = 'Office_Number'
        attrCtx_LVL6_IND4.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND4.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Number'
        attrCtx_LVL6_IND4.context_strings = []

        attrCtx_LVL6_IND4.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Number')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND4)
        attrCtx_LVL6_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND5.type = 'attributeDefinition'
        attrCtx_LVL6_IND5.name = 'Office_Building'
        attrCtx_LVL6_IND5.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND5.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Building'
        attrCtx_LVL6_IND5.context_strings = []

        attrCtx_LVL6_IND5.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Building')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND5)
        attrCtx_LVL6_IND6 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND6.type = 'attributeDefinition'
        attrCtx_LVL6_IND6.name = 'Office_Geo_Location'
        attrCtx_LVL6_IND6.parent = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL6_IND6.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/Office_Geo_Location'
        attrCtx_LVL6_IND6.context_strings = []

        attrCtx_LVL6_IND6.context_strings.append(
            'EmployeeNames_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeNames/members/Office_Geo_Location')

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND6)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expected_default = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'EmployeeNamesID'
        att.source_name = 'ID'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'EmployeeNamesDate_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'EmployeeNamesOffice_Number'
        att.source_name = 'Office_Number'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'EmployeeNamesOffice_Building'
        att.source_name = 'Office_Building'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_default/attributeContext/EmployeeNames_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'EmployeeNamesOffice_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_default.append(att)

        expected_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'EmployeeNamesID'
        att.source_name = 'ID'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'EmployeeNamesDate_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'EmployeeNamesOffice_Number'
        att.source_name = 'Office_Number'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'EmployeeNamesOffice_Building'
        att.source_name = 'Office_Building'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized/attributeContext/EmployeeNames_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'EmployeeNamesOffice_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_normalized.append(att)

        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'EmployeeNamesID'
        att.source_name = 'ID'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'EmployeeNamesDate_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'EmployeeNamesOffice_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'EmployeeNamesOffice_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly/attributeContext/EmployeeNames_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'EmployeeNamesOffice_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_referenceOnly.append(att)

        expected_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_structured/attributeContext/EmployeeNames_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)

        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_normalized_structured/attributeContext/EmployeeNames_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_normalized_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/ID'
        att.data_format = 'Guid'
        att.display_name = 'ID'
        att.is_primary_key = True
        att.name = 'EmployeeNamesID'
        att.source_name = 'ID'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/First_Name'
        att.data_format = 'String'
        att.display_name = 'First_Name'
        att.name = 'EmployeeNamesFirst_Name'
        att.source_name = 'First_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Last_Name'
        att.data_format = 'String'
        att.display_name = 'Last_Name'
        att.name = 'EmployeeNamesLast_Name'
        att.source_name = 'Last_Name'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.display_name = 'Date_Of_Joining'
        att.name = 'EmployeeNamesDate_Of_Joining'
        att.source_name = 'Date_Of_Joining'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Number'
        att.data_format = 'Int32'
        att.display_name = 'Office_Number'
        att.name = 'EmployeeNamesOffice_Number'
        att.source_name = 'Office_Number'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Building'
        att.data_format = 'String'
        att.display_name = 'Office_Building'
        att.name = 'EmployeeNamesOffice_Building'
        att.source_name = 'Office_Building'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/_generatedAttributeSet/_generatedAttributeRound0/Office_Geo_Location'
        att.data_format = 'String'
        att.display_name = 'Office_Geo_Location'
        att.name = 'EmployeeNamesOffice_Geo_Location'
        att.source_name = 'Office_Geo_Location'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'EmployeeNames'
        attrib_group_ref.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.name = 'ID'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/First_Name'
        att.data_format = 'String'
        att.name = 'First_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Last_Name'
        att.data_format = 'String'
        att.name = 'Last_Name'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Date_Of_Joining'
        att.data_format = 'DateTime'
        att.name = 'Date_Of_Joining'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Number'
        att.data_format = 'Int32'
        att.name = 'Office_Number'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Building'
        att.data_format = 'String'
        att.name = 'Office_Building'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'EmployeeNames_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeNames_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeNames/Employee/attributesAddedAtThisScope/attributesAddedAtThisScope/Office_Geo_Location'
        att.data_format = 'String'
        att.name = 'Office_Geo_Location'
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
