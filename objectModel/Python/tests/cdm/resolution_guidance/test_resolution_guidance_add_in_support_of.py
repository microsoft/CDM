# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from tests.cdm.resolution_guidance import common_test
from tests.common import async_test
from tests.utilities.object_validator import AttributeContextExpectedValue, AttributeExpectedValue


class ResolutionGuidanceAddInSupportOfTest(common_test.CommonTest):
    @async_test
    async def test_add_in_support_of(self):
        """Resolution Guidance Test - AddInSupportOf"""
        test_name = 'TestAddInSupportOf'
        entity_name = 'Product'

        expectedContext_default = AttributeContextExpectedValue()

        expectedContext_default.type = 'entity'
        expectedContext_default.name = 'Product_Resolved_default'
        expectedContext_default.definition = 'resolvedFrom/Product'
        expectedContext_default.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Product_Resolved_default/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'StatusCode'
        attrCtx_LVL2_IND1.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Product_Resolved_default/hasAttributes/StatusCode')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'StatusCode_display'
        attrCtx_LVL2_IND2.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Product_Resolved_default/hasAttributes/StatusCode_display')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized = AttributeContextExpectedValue()

        expectedContext_normalized.type = 'entity'
        expectedContext_normalized.name = 'Product_Resolved_normalized'
        expectedContext_normalized.definition = 'resolvedFrom/Product'
        expectedContext_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Product_Resolved_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'StatusCode'
        attrCtx_LVL2_IND1.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Product_Resolved_normalized/hasAttributes/StatusCode')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'StatusCode_display'
        attrCtx_LVL2_IND2.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Product_Resolved_normalized/hasAttributes/StatusCode_display')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'Product_Resolved_referenceOnly'
        expectedContext_referenceOnly.definition = 'resolvedFrom/Product'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Product_Resolved_referenceOnly/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'StatusCode'
        attrCtx_LVL2_IND1.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Product_Resolved_referenceOnly/hasAttributes/StatusCode')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'StatusCode_display'
        attrCtx_LVL2_IND2.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Product_Resolved_referenceOnly/hasAttributes/StatusCode_display')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'Product_Resolved_structured'
        expectedContext_structured.definition = 'resolvedFrom/Product'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Product_Resolved_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'StatusCode'
        attrCtx_LVL2_IND1.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Product_Resolved_structured/hasAttributes/StatusCode')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'StatusCode_display'
        attrCtx_LVL2_IND2.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append('Product_Resolved_structured/hasAttributes/StatusCode_display')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'Product_Resolved_normalized_structured'
        expectedContext_normalized_structured.definition = 'resolvedFrom/Product'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Product_Resolved_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'StatusCode'
        attrCtx_LVL2_IND1.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append('Product_Resolved_normalized_structured/hasAttributes/StatusCode')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'StatusCode_display'
        attrCtx_LVL2_IND2.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Product_Resolved_normalized_structured/hasAttributes/StatusCode_display')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'Product_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/Product'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Product_Resolved_referenceOnly_normalized/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'StatusCode'
        attrCtx_LVL2_IND1.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'StatusCode_display'
        attrCtx_LVL2_IND2.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode_display')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'Product_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.definition = 'resolvedFrom/Product'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append('Product_Resolved_referenceOnly_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'StatusCode'
        attrCtx_LVL2_IND1.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'StatusCode_display'
        attrCtx_LVL2_IND2.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode_display')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'Product_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/Product'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'ID'
        attrCtx_LVL2_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID'
        attrCtx_LVL2_IND0.context_strings = []

        attrCtx_LVL2_IND0.context_strings.append(
            'Product_Resolved_referenceOnly_normalized_structured/hasAttributes/ID')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'StatusCode'
        attrCtx_LVL2_IND1.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode'
        attrCtx_LVL2_IND1.context_strings = []

        attrCtx_LVL2_IND1.context_strings.append(
            'Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)
        attrCtx_LVL2_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND2.type = 'attributeDefinition'
        attrCtx_LVL2_IND2.name = 'StatusCode_display'
        attrCtx_LVL2_IND2.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display'
        attrCtx_LVL2_IND2.context_strings = []

        attrCtx_LVL2_IND2.context_strings.append(
            'Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode_display')

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND2)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expected_default = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_default.append(att)

        expected_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_normalized.append(att)

        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_referenceOnly.append(att)

        expected_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_structured.append(att)

        expected_normalized_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_normalized_structured.append(att)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_referenceOnly_structured.append(att)

        expected_referenceOnly_normalized_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
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


    @async_test
    async def test_add_in_support_of_with_is_correlated_with(self):
        """Resolution Guidance Test - AddInSupportOf with IsCorrelatedWith"""
        test_name = 'TestAddInSupportOfWithIsCorrelatedWith'
        entity_name = 'Product'

        expectedContext_default = AttributeContextExpectedValue()

        expectedContext_default.type = 'entity'
        expectedContext_default.name = 'Product_Resolved_default'
        expectedContext_default.definition = 'resolvedFrom/Product'
        expectedContext_default.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_default.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'ID'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID'
        attrCtx_LVL0_IND1.context_strings = []

        attrCtx_LVL0_IND1.context_strings.append('Product_Resolved_default/hasAttributes/ID')

        expectedContext_default.contexts.append(attrCtx_LVL0_IND1)
        attrCtx_LVL0_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND2.type = 'attributeDefinition'
        attrCtx_LVL0_IND2.name = 'StateCode'
        attrCtx_LVL0_IND2.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default'
        attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode'
        attrCtx_LVL0_IND2.context_strings = []

        attrCtx_LVL0_IND2.context_strings.append('Product_Resolved_default/hasAttributes/StateCode')

        expectedContext_default.contexts.append(attrCtx_LVL0_IND2)
        attrCtx_LVL0_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND3.type = 'attributeDefinition'
        attrCtx_LVL0_IND3.name = 'StateCode_display'
        attrCtx_LVL0_IND3.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default'
        attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display'
        attrCtx_LVL0_IND3.context_strings = []

        attrCtx_LVL0_IND3.context_strings.append('Product_Resolved_default/hasAttributes/StateCode_display')

        expectedContext_default.contexts.append(attrCtx_LVL0_IND3)
        attrCtx_LVL0_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND4.type = 'attributeDefinition'
        attrCtx_LVL0_IND4.name = 'StatusCode'
        attrCtx_LVL0_IND4.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default'
        attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode'
        attrCtx_LVL0_IND4.context_strings = []

        attrCtx_LVL0_IND4.context_strings.append('Product_Resolved_default/hasAttributes/StatusCode')

        expectedContext_default.contexts.append(attrCtx_LVL0_IND4)
        attrCtx_LVL0_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND5.type = 'attributeDefinition'
        attrCtx_LVL0_IND5.name = 'StatusCode_display'
        attrCtx_LVL0_IND5.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default'
        attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display'
        attrCtx_LVL0_IND5.context_strings = []

        attrCtx_LVL0_IND5.context_strings.append('Product_Resolved_default/hasAttributes/StatusCode_display')

        expectedContext_default.contexts.append(attrCtx_LVL0_IND5)

        expectedContext_normalized = AttributeContextExpectedValue()

        expectedContext_normalized.type = 'entity'
        expectedContext_normalized.name = 'Product_Resolved_normalized'
        expectedContext_normalized.definition = 'resolvedFrom/Product'
        expectedContext_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'ID'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID'
        attrCtx_LVL0_IND1.context_strings = []

        attrCtx_LVL0_IND1.context_strings.append('Product_Resolved_normalized/hasAttributes/ID')

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND1)
        attrCtx_LVL0_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND2.type = 'attributeDefinition'
        attrCtx_LVL0_IND2.name = 'StateCode'
        attrCtx_LVL0_IND2.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized'
        attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode'
        attrCtx_LVL0_IND2.context_strings = []

        attrCtx_LVL0_IND2.context_strings.append('Product_Resolved_normalized/hasAttributes/StateCode')

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND2)
        attrCtx_LVL0_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND3.type = 'attributeDefinition'
        attrCtx_LVL0_IND3.name = 'StateCode_display'
        attrCtx_LVL0_IND3.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized'
        attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display'
        attrCtx_LVL0_IND3.context_strings = []

        attrCtx_LVL0_IND3.context_strings.append('Product_Resolved_normalized/hasAttributes/StateCode_display')

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND3)
        attrCtx_LVL0_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND4.type = 'attributeDefinition'
        attrCtx_LVL0_IND4.name = 'StatusCode'
        attrCtx_LVL0_IND4.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized'
        attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode'
        attrCtx_LVL0_IND4.context_strings = []

        attrCtx_LVL0_IND4.context_strings.append('Product_Resolved_normalized/hasAttributes/StatusCode')

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND4)
        attrCtx_LVL0_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND5.type = 'attributeDefinition'
        attrCtx_LVL0_IND5.name = 'StatusCode_display'
        attrCtx_LVL0_IND5.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized'
        attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display'
        attrCtx_LVL0_IND5.context_strings = []

        attrCtx_LVL0_IND5.context_strings.append('Product_Resolved_normalized/hasAttributes/StatusCode_display')

        expectedContext_normalized.contexts.append(attrCtx_LVL0_IND5)

        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'Product_Resolved_referenceOnly'
        expectedContext_referenceOnly.definition = 'resolvedFrom/Product'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'ID'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID'
        attrCtx_LVL0_IND1.context_strings = []

        attrCtx_LVL0_IND1.context_strings.append('Product_Resolved_referenceOnly/hasAttributes/ID')

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)
        attrCtx_LVL0_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND2.type = 'attributeDefinition'
        attrCtx_LVL0_IND2.name = 'StateCode'
        attrCtx_LVL0_IND2.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly'
        attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode'
        attrCtx_LVL0_IND2.context_strings = []

        attrCtx_LVL0_IND2.context_strings.append('Product_Resolved_referenceOnly/hasAttributes/StateCode')

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND2)
        attrCtx_LVL0_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND3.type = 'attributeDefinition'
        attrCtx_LVL0_IND3.name = 'StateCode_display'
        attrCtx_LVL0_IND3.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly'
        attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display'
        attrCtx_LVL0_IND3.context_strings = []

        attrCtx_LVL0_IND3.context_strings.append('Product_Resolved_referenceOnly/hasAttributes/StateCode_display')

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND3)
        attrCtx_LVL0_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND4.type = 'attributeDefinition'
        attrCtx_LVL0_IND4.name = 'StatusCode'
        attrCtx_LVL0_IND4.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly'
        attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode'
        attrCtx_LVL0_IND4.context_strings = []

        attrCtx_LVL0_IND4.context_strings.append('Product_Resolved_referenceOnly/hasAttributes/StatusCode')

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND4)
        attrCtx_LVL0_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND5.type = 'attributeDefinition'
        attrCtx_LVL0_IND5.name = 'StatusCode_display'
        attrCtx_LVL0_IND5.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly'
        attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display'
        attrCtx_LVL0_IND5.context_strings = []

        attrCtx_LVL0_IND5.context_strings.append('Product_Resolved_referenceOnly/hasAttributes/StatusCode_display')

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND5)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'Product_Resolved_structured'
        expectedContext_structured.definition = 'resolvedFrom/Product'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'ID'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID'
        attrCtx_LVL0_IND1.context_strings = []

        attrCtx_LVL0_IND1.context_strings.append('Product_Resolved_structured/hasAttributes/ID')

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)
        attrCtx_LVL0_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND2.type = 'attributeDefinition'
        attrCtx_LVL0_IND2.name = 'StateCode'
        attrCtx_LVL0_IND2.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured'
        attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode'
        attrCtx_LVL0_IND2.context_strings = []

        attrCtx_LVL0_IND2.context_strings.append('Product_Resolved_structured/hasAttributes/StateCode')

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND2)
        attrCtx_LVL0_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND3.type = 'attributeDefinition'
        attrCtx_LVL0_IND3.name = 'StateCode_display'
        attrCtx_LVL0_IND3.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured'
        attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display'
        attrCtx_LVL0_IND3.context_strings = []

        attrCtx_LVL0_IND3.context_strings.append('Product_Resolved_structured/hasAttributes/StateCode_display')

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND3)
        attrCtx_LVL0_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND4.type = 'attributeDefinition'
        attrCtx_LVL0_IND4.name = 'StatusCode'
        attrCtx_LVL0_IND4.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured'
        attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode'
        attrCtx_LVL0_IND4.context_strings = []

        attrCtx_LVL0_IND4.context_strings.append('Product_Resolved_structured/hasAttributes/StatusCode')

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND4)
        attrCtx_LVL0_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND5.type = 'attributeDefinition'
        attrCtx_LVL0_IND5.name = 'StatusCode_display'
        attrCtx_LVL0_IND5.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured'
        attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display'
        attrCtx_LVL0_IND5.context_strings = []

        attrCtx_LVL0_IND5.context_strings.append('Product_Resolved_structured/hasAttributes/StatusCode_display')

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND5)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'Product_Resolved_normalized_structured'
        expectedContext_normalized_structured.definition = 'resolvedFrom/Product'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'ID'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID'
        attrCtx_LVL0_IND1.context_strings = []

        attrCtx_LVL0_IND1.context_strings.append('Product_Resolved_normalized_structured/hasAttributes/ID')

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)
        attrCtx_LVL0_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND2.type = 'attributeDefinition'
        attrCtx_LVL0_IND2.name = 'StateCode'
        attrCtx_LVL0_IND2.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured'
        attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode'
        attrCtx_LVL0_IND2.context_strings = []

        attrCtx_LVL0_IND2.context_strings.append('Product_Resolved_normalized_structured/hasAttributes/StateCode')

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND2)
        attrCtx_LVL0_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND3.type = 'attributeDefinition'
        attrCtx_LVL0_IND3.name = 'StateCode_display'
        attrCtx_LVL0_IND3.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured'
        attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display'
        attrCtx_LVL0_IND3.context_strings = []

        attrCtx_LVL0_IND3.context_strings.append(
            'Product_Resolved_normalized_structured/hasAttributes/StateCode_display')

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND3)
        attrCtx_LVL0_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND4.type = 'attributeDefinition'
        attrCtx_LVL0_IND4.name = 'StatusCode'
        attrCtx_LVL0_IND4.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured'
        attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode'
        attrCtx_LVL0_IND4.context_strings = []

        attrCtx_LVL0_IND4.context_strings.append('Product_Resolved_normalized_structured/hasAttributes/StatusCode')

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND4)
        attrCtx_LVL0_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND5.type = 'attributeDefinition'
        attrCtx_LVL0_IND5.name = 'StatusCode_display'
        attrCtx_LVL0_IND5.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured'
        attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display'
        attrCtx_LVL0_IND5.context_strings = []

        attrCtx_LVL0_IND5.context_strings.append(
            'Product_Resolved_normalized_structured/hasAttributes/StatusCode_display')

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND5)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'Product_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/Product'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'ID'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID'
        attrCtx_LVL0_IND1.context_strings = []

        attrCtx_LVL0_IND1.context_strings.append('Product_Resolved_referenceOnly_normalized/hasAttributes/ID')

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)
        attrCtx_LVL0_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND2.type = 'attributeDefinition'
        attrCtx_LVL0_IND2.name = 'StateCode'
        attrCtx_LVL0_IND2.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode'
        attrCtx_LVL0_IND2.context_strings = []

        attrCtx_LVL0_IND2.context_strings.append(
            'Product_Resolved_referenceOnly_normalized/hasAttributes/StateCode')

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND2)
        attrCtx_LVL0_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND3.type = 'attributeDefinition'
        attrCtx_LVL0_IND3.name = 'StateCode_display'
        attrCtx_LVL0_IND3.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display'
        attrCtx_LVL0_IND3.context_strings = []

        attrCtx_LVL0_IND3.context_strings.append(
            'Product_Resolved_referenceOnly_normalized/hasAttributes/StateCode_display')

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND3)
        attrCtx_LVL0_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND4.type = 'attributeDefinition'
        attrCtx_LVL0_IND4.name = 'StatusCode'
        attrCtx_LVL0_IND4.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode'
        attrCtx_LVL0_IND4.context_strings = []

        attrCtx_LVL0_IND4.context_strings.append(
            'Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode')

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND4)
        attrCtx_LVL0_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND5.type = 'attributeDefinition'
        attrCtx_LVL0_IND5.name = 'StatusCode_display'
        attrCtx_LVL0_IND5.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display'
        attrCtx_LVL0_IND5.context_strings = []

        attrCtx_LVL0_IND5.context_strings.append(
            'Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode_display')

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND5)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'Product_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.definition = 'resolvedFrom/Product'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'ID'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID'
        attrCtx_LVL0_IND1.context_strings = []

        attrCtx_LVL0_IND1.context_strings.append('Product_Resolved_referenceOnly_structured/hasAttributes/ID')

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)
        attrCtx_LVL0_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND2.type = 'attributeDefinition'
        attrCtx_LVL0_IND2.name = 'StateCode'
        attrCtx_LVL0_IND2.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode'
        attrCtx_LVL0_IND2.context_strings = []

        attrCtx_LVL0_IND2.context_strings.append(
            'Product_Resolved_referenceOnly_structured/hasAttributes/StateCode')

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND2)
        attrCtx_LVL0_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND3.type = 'attributeDefinition'
        attrCtx_LVL0_IND3.name = 'StateCode_display'
        attrCtx_LVL0_IND3.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display'
        attrCtx_LVL0_IND3.context_strings = []

        attrCtx_LVL0_IND3.context_strings.append(
            'Product_Resolved_referenceOnly_structured/hasAttributes/StateCode_display')

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND3)
        attrCtx_LVL0_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND4.type = 'attributeDefinition'
        attrCtx_LVL0_IND4.name = 'StatusCode'
        attrCtx_LVL0_IND4.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode'
        attrCtx_LVL0_IND4.context_strings = []

        attrCtx_LVL0_IND4.context_strings.append(
            'Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode')

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND4)
        attrCtx_LVL0_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND5.type = 'attributeDefinition'
        attrCtx_LVL0_IND5.name = 'StatusCode_display'
        attrCtx_LVL0_IND5.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display'
        attrCtx_LVL0_IND5.context_strings = []

        attrCtx_LVL0_IND5.context_strings.append(
            'Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode_display')

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND5)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'Product_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/Product'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'ID'
        attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID'
        attrCtx_LVL0_IND1.context_strings = []

        attrCtx_LVL0_IND1.context_strings.append(
            'Product_Resolved_referenceOnly_normalized_structured/hasAttributes/ID')

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)
        attrCtx_LVL0_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND2.type = 'attributeDefinition'
        attrCtx_LVL0_IND2.name = 'StateCode'
        attrCtx_LVL0_IND2.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode'
        attrCtx_LVL0_IND2.context_strings = []

        attrCtx_LVL0_IND2.context_strings.append(
            'Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StateCode')

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND2)
        attrCtx_LVL0_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND3.type = 'attributeDefinition'
        attrCtx_LVL0_IND3.name = 'StateCode_display'
        attrCtx_LVL0_IND3.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display'
        attrCtx_LVL0_IND3.context_strings = []

        attrCtx_LVL0_IND3.context_strings.append(
            'Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StateCode_display')

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND3)
        attrCtx_LVL0_IND4 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND4.type = 'attributeDefinition'
        attrCtx_LVL0_IND4.name = 'StatusCode'
        attrCtx_LVL0_IND4.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode'
        attrCtx_LVL0_IND4.context_strings = []

        attrCtx_LVL0_IND4.context_strings.append(
            'Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode')

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND4)
        attrCtx_LVL0_IND5 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND5.type = 'attributeDefinition'
        attrCtx_LVL0_IND5.name = 'StatusCode_display'
        attrCtx_LVL0_IND5.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display'
        attrCtx_LVL0_IND5.context_strings = []

        attrCtx_LVL0_IND5.context_strings.append(
            'Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode_display')

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND5)

        expected_default = []

        att = AttributeExpectedValue()

        att.attribute_context = 'Product_Resolved_default/attributeContext/Product_Resolved_default/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_default/attributeContext/Product_Resolved_default/StateCode'
        att.data_format = 'Int32'
        att.name = 'StateCode'
        att.source_name = 'StateCode'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_default/attributeContext/Product_Resolved_default/StateCode_display'
        att.data_format = 'String'
        att.name = 'StateCode_display'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_default/attributeContext/Product_Resolved_default/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_default.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_default/attributeContext/Product_Resolved_default/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_default.append(att)

        expected_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StateCode'
        att.data_format = 'Int32'
        att.name = 'StateCode'
        att.source_name = 'StateCode'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StateCode_display'
        att.data_format = 'String'
        att.name = 'StateCode_display'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_normalized.append(att)

        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StateCode'
        att.data_format = 'Int32'
        att.name = 'StateCode'
        att.source_name = 'StateCode'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StateCode_display'
        att.data_format = 'String'
        att.name = 'StateCode_display'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_referenceOnly.append(att)

        expected_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/StateCode'
        att.data_format = 'Int32'
        att.name = 'StateCode'
        att.source_name = 'StateCode'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/StateCode_display'
        att.data_format = 'String'
        att.name = 'StateCode_display'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_structured.append(att)

        expected_normalized_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StateCode'
        att.data_format = 'Int32'
        att.name = 'StateCode'
        att.source_name = 'StateCode'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StateCode_display'
        att.data_format = 'String'
        att.name = 'StateCode_display'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_normalized_structured.append(att)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StateCode'
        att.data_format = 'Int32'
        att.name = 'StateCode'
        att.source_name = 'StateCode'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StateCode_display'
        att.data_format = 'String'
        att.name = 'StateCode_display'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StateCode'
        att.data_format = 'Int32'
        att.name = 'StateCode'
        att.source_name = 'StateCode'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StateCode_display'
        att.data_format = 'String'
        att.name = 'StateCode_display'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_referenceOnly_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
        expected_referenceOnly_structured.append(att)

        expected_referenceOnly_normalized_structured = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/ID'
        att.data_format = 'Guid'
        att.is_primary_key = True
        att.name = 'ID'
        att.source_name = 'ID'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StateCode'
        att.data_format = 'Int32'
        att.name = 'StateCode'
        att.source_name = 'StateCode'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StateCode_display'
        att.data_format = 'String'
        att.name = 'StateCode_display'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StatusCode'
        att.data_format = 'Int32'
        att.name = 'StatusCode'
        att.source_name = 'StatusCode'
        expected_referenceOnly_normalized_structured.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StatusCode_display'
        att.data_format = 'String'
        att.name = 'StatusCode_display'
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
