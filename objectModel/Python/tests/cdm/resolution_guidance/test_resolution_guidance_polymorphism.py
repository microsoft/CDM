# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from tests.cdm.resolution_guidance import common_test
from tests.common import async_test
from tests.utilities.object_validator import AttributeContextExpectedValue, AttributeExpectedValue


class ResolutionGuidancePolymorphismTest(common_test.CommonTest):
    @async_test
    async def test_polymorphism(self):
        """Resolution Guidance Test - Polymorphism"""
        test_name = 'TestPolymorphism'
        entity_name = 'Customer'

        # Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
        expectedContext_default = None
        expectedContext_normalized = None
        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'Customer_Resolved_referenceOnly'
        expectedContext_referenceOnly.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL3_IND0.name = '_foreignKey'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly/hasAttributes/customerCustomerId')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'addedAttributeSelectedType'
        attrCtx_LVL3_IND1.name = '_selectedEntityName'
        attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'Customer_Resolved_referenceOnly/hasAttributes/customerCustomerIdType')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'Customer_Resolved_structured'
        expectedContext_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact/extends'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'ContactID'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Contact/hasAttributes/ContactID'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'FullName'
        attrCtx_LVL4_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND2.Definition = 'resolvedFrom/Contact/hasAttributes/FullName'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Address'
        attrCtx_LVL4_IND3.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND3.Definition = 'resolvedFrom/Contact/hasAttributes/Address'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account/extends'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'AccountID'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Account/hasAttributes/AccountID'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'CompanyName'
        attrCtx_LVL4_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND2.Definition = 'resolvedFrom/Account/hasAttributes/CompanyName'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Address'
        attrCtx_LVL4_IND3.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND3.Definition = 'resolvedFrom/Account/hasAttributes/Address'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'Customer_Resolved_normalized_structured'
        expectedContext_normalized_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact/extends'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'ContactID'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Contact/hasAttributes/ContactID'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'FullName'
        attrCtx_LVL4_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND2.Definition = 'resolvedFrom/Contact/hasAttributes/FullName'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Address'
        attrCtx_LVL4_IND3.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND3.Definition = 'resolvedFrom/Contact/hasAttributes/Address'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account/extends'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'AccountID'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Account/hasAttributes/AccountID'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'CompanyName'
        attrCtx_LVL4_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND2.Definition = 'resolvedFrom/Account/hasAttributes/CompanyName'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Address'
        attrCtx_LVL4_IND3.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND3.Definition = 'resolvedFrom/Account/hasAttributes/Address'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'Customer_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL3_IND0.name = '_foreignKey'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerId')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'addedAttributeSelectedType'
        attrCtx_LVL3_IND1.name = '_selectedEntityName'
        attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerIdType')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'Customer_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL3_IND0.name = '_foreignKey'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'Customer_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL3_IND0.name = '_foreignKey'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        # Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
        expected_default = None
        expected_normalized = None
        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerCustomerId'
        att.source_name = 'customerid'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName'
        att.data_format = 'String'
        att.display_name = 'Customer Type'
        att.name = 'customerCustomerIdType'
        att.source_name = 'customeridtype'
        expected_referenceOnly.append(att)

        expected_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)
        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)
        expected_normalized_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerCustomerId'
        att.source_name = 'customerid'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName'
        att.data_format = 'String'
        att.display_name = 'Customer Type'
        att.name = 'customerCustomerIdType'
        att.source_name = 'customeridtype'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerId'
        att.source_name = 'customerid'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerId'
        att.source_name = 'customerid'
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
    async def test_polymorphism_with_attribute_group_ref(self):
        """Resolution Guidance Test - Polymorphism With AttributeGroupRef"""
        test_name = 'TestPolymorphismWithAttributeGroupRef'
        entity_name = 'Customer'

        # Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
        expectedContext_default = None
        expectedContext_normalized = None
        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'Customer_Resolved_referenceOnly'
        expectedContext_referenceOnly.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customerIdAttribute'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'customerIdAttribute'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'customer'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Customer'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'contactOption'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Contact'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'accountOption'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Account'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL5_IND0.name = '_foreignKey'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly/hasAttributes/customerCustomerId')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'addedAttributeSelectedType'
        attrCtx_LVL5_IND1.name = '_selectedEntityName'
        attrCtx_LVL5_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'Customer_Resolved_referenceOnly/hasAttributes/customerCustomerIdType')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'Customer_Resolved_structured'
        expectedContext_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customerIdAttribute'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'customerIdAttribute'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'customer'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Customer'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'contactOption'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Contact'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Contact'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL6_IND0.name = 'extends'
        attrCtx_LVL6_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact'
        attrCtx_LVL6_IND0.contexts = []
        attrCtx_LVL7_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL7_IND0.type = 'entity'
        attrCtx_LVL7_IND0.name = 'CdmEntity'
        attrCtx_LVL7_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/extends'
        attrCtx_LVL7_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL6_IND0.contexts.append(attrCtx_LVL7_IND0)

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact'
        attrCtx_LVL6_IND1.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.contexts = []
        attrCtx_LVL7_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL7_IND0.type = 'attributeGroup'
        attrCtx_LVL7_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.contexts = []
        attrCtx_LVL8_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND0.type = 'attributeDefinition'
        attrCtx_LVL8_IND0.name = 'ContactID'
        attrCtx_LVL8_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND0.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/ContactID'
        attrCtx_LVL8_IND0.context_strings = []

        attrCtx_LVL8_IND0.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND0)
        attrCtx_LVL8_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND1.type = 'attributeDefinition'
        attrCtx_LVL8_IND1.name = 'FullName'
        attrCtx_LVL8_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND1.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL8_IND1.context_strings = []

        attrCtx_LVL8_IND1.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND1)
        attrCtx_LVL8_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND2.type = 'attributeDefinition'
        attrCtx_LVL8_IND2.name = 'Address'
        attrCtx_LVL8_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND2.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/Address'
        attrCtx_LVL8_IND2.context_strings = []

        attrCtx_LVL8_IND2.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND2)

        attrCtx_LVL6_IND1.contexts.append(attrCtx_LVL7_IND0)

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'accountOption'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Account'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Account'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL6_IND0.name = 'extends'
        attrCtx_LVL6_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account'
        attrCtx_LVL6_IND0.contexts = []
        attrCtx_LVL7_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL7_IND0.type = 'entity'
        attrCtx_LVL7_IND0.name = 'CdmEntity'
        attrCtx_LVL7_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/extends'
        attrCtx_LVL7_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL6_IND0.contexts.append(attrCtx_LVL7_IND0)

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account'
        attrCtx_LVL6_IND1.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.contexts = []
        attrCtx_LVL7_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL7_IND0.type = 'attributeGroup'
        attrCtx_LVL7_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.contexts = []
        attrCtx_LVL8_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND0.type = 'attributeDefinition'
        attrCtx_LVL8_IND0.name = 'AccountID'
        attrCtx_LVL8_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND0.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/AccountID'
        attrCtx_LVL8_IND0.context_strings = []

        attrCtx_LVL8_IND0.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND0)
        attrCtx_LVL8_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND1.type = 'attributeDefinition'
        attrCtx_LVL8_IND1.name = 'CompanyName'
        attrCtx_LVL8_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND1.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/CompanyName'
        attrCtx_LVL8_IND1.context_strings = []

        attrCtx_LVL8_IND1.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND1)
        attrCtx_LVL8_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND2.type = 'attributeDefinition'
        attrCtx_LVL8_IND2.name = 'Address'
        attrCtx_LVL8_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND2.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/Address'
        attrCtx_LVL8_IND2.context_strings = []

        attrCtx_LVL8_IND2.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND2)

        attrCtx_LVL6_IND1.contexts.append(attrCtx_LVL7_IND0)

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'Customer_Resolved_normalized_structured'
        expectedContext_normalized_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customerIdAttribute'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'customerIdAttribute'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'customer'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Customer'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'contactOption'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Contact'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Contact'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL6_IND0.name = 'extends'
        attrCtx_LVL6_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact'
        attrCtx_LVL6_IND0.contexts = []
        attrCtx_LVL7_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL7_IND0.type = 'entity'
        attrCtx_LVL7_IND0.name = 'CdmEntity'
        attrCtx_LVL7_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/extends'
        attrCtx_LVL7_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL6_IND0.contexts.append(attrCtx_LVL7_IND0)

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact'
        attrCtx_LVL6_IND1.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.contexts = []
        attrCtx_LVL7_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL7_IND0.type = 'attributeGroup'
        attrCtx_LVL7_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.contexts = []
        attrCtx_LVL8_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND0.type = 'attributeDefinition'
        attrCtx_LVL8_IND0.name = 'ContactID'
        attrCtx_LVL8_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND0.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/ContactID'
        attrCtx_LVL8_IND0.context_strings = []

        attrCtx_LVL8_IND0.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND0)
        attrCtx_LVL8_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND1.type = 'attributeDefinition'
        attrCtx_LVL8_IND1.name = 'FullName'
        attrCtx_LVL8_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND1.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/FullName'
        attrCtx_LVL8_IND1.context_strings = []

        attrCtx_LVL8_IND1.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND1)
        attrCtx_LVL8_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND2.type = 'attributeDefinition'
        attrCtx_LVL8_IND2.name = 'Address'
        attrCtx_LVL8_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND2.Definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/Address'
        attrCtx_LVL8_IND2.context_strings = []

        attrCtx_LVL8_IND2.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND2)

        attrCtx_LVL6_IND1.contexts.append(attrCtx_LVL7_IND0)

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'accountOption'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Account'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Account'
        attrCtx_LVL5_IND0.contexts = []
        attrCtx_LVL6_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL6_IND0.name = 'extends'
        attrCtx_LVL6_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account'
        attrCtx_LVL6_IND0.contexts = []
        attrCtx_LVL7_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL7_IND0.type = 'entity'
        attrCtx_LVL7_IND0.name = 'CdmEntity'
        attrCtx_LVL7_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/extends'
        attrCtx_LVL7_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL6_IND0.contexts.append(attrCtx_LVL7_IND0)

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND0)
        attrCtx_LVL6_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL6_IND1.type = 'attributeDefinition'
        attrCtx_LVL6_IND1.name = 'attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account'
        attrCtx_LVL6_IND1.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL6_IND1.contexts = []
        attrCtx_LVL7_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL7_IND0.type = 'attributeGroup'
        attrCtx_LVL7_IND0.name = 'attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope'
        attrCtx_LVL7_IND0.contexts = []
        attrCtx_LVL8_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND0.type = 'attributeDefinition'
        attrCtx_LVL8_IND0.name = 'AccountID'
        attrCtx_LVL8_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND0.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/AccountID'
        attrCtx_LVL8_IND0.context_strings = []

        attrCtx_LVL8_IND0.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND0)
        attrCtx_LVL8_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND1.type = 'attributeDefinition'
        attrCtx_LVL8_IND1.name = 'CompanyName'
        attrCtx_LVL8_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND1.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/CompanyName'
        attrCtx_LVL8_IND1.context_strings = []

        attrCtx_LVL8_IND1.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND1)
        attrCtx_LVL8_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL8_IND2.type = 'attributeDefinition'
        attrCtx_LVL8_IND2.name = 'Address'
        attrCtx_LVL8_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope'
        attrCtx_LVL8_IND2.Definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/Address'
        attrCtx_LVL8_IND2.context_strings = []

        attrCtx_LVL8_IND2.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address')

        attrCtx_LVL7_IND0.contexts.append(attrCtx_LVL8_IND2)

        attrCtx_LVL6_IND1.contexts.append(attrCtx_LVL7_IND0)

        attrCtx_LVL5_IND0.contexts.append(attrCtx_LVL6_IND1)

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'Customer_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customerIdAttribute'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'customerIdAttribute'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'customer'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Customer'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'contactOption'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Contact'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'accountOption'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Account'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL5_IND0.name = '_foreignKey'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerId')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)
        attrCtx_LVL5_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND1.type = 'addedAttributeSelectedType'
        attrCtx_LVL5_IND1.name = '_selectedEntityName'
        attrCtx_LVL5_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND1.context_strings = []

        attrCtx_LVL5_IND1.context_strings.append(
            'Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerIdType')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND1)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'Customer_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customerIdAttribute'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'customerIdAttribute'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'customer'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Customer'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'contactOption'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Contact'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'accountOption'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Account'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL5_IND0.name = '_foreignKey'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'Customer_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customerIdAttribute'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'attributeGroup'
        attrCtx_LVL1_IND0.name = 'customerIdAttribute'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'customer'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Customer'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'attributeDefinition'
        attrCtx_LVL4_IND0.name = 'contactOption'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Contact'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'accountOption'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL4_IND1.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'Account'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL4_IND1.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'generatedSet'
        attrCtx_LVL3_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer'
        attrCtx_LVL3_IND1.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'generatedRound'
        attrCtx_LVL4_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL5_IND0.name = '_foreignKey'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL5_IND0.context_strings = []

        attrCtx_LVL5_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId')

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND1.contexts.append(attrCtx_LVL4_IND0)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        # Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
        expected_default = None
        expected_normalized = None
        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerCustomerId'
        att.source_name = 'customerid'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName'
        att.data_format = 'String'
        att.display_name = 'Customer Type'
        att.name = 'customerCustomerIdType'
        att.source_name = 'customeridtype'
        expected_referenceOnly.append(att)

        expected_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)
        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)
        expected_normalized_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerCustomerId'
        att.source_name = 'customerid'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName'
        att.data_format = 'String'
        att.display_name = 'Customer Type'
        att.name = 'customerCustomerIdType'
        att.source_name = 'customeridtype'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerId'
        att.source_name = 'customerid'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerId'
        att.source_name = 'customerid'
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
    async def test_polymorphism_with_rename_as_member(self):
        """Resolution Guidance Test - Polymorphism With Rename As Member"""
        test_name = 'TestPolymorphismWithRenameAsMember'
        entity_name = 'Customer'

        # Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
        expectedContext_default = None
        expectedContext_normalized = None
        expectedContext_referenceOnly = AttributeContextExpectedValue()

        expectedContext_referenceOnly.type = 'entity'
        expectedContext_referenceOnly.name = 'Customer_Resolved_referenceOnly'
        expectedContext_referenceOnly.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL3_IND0.name = '_foreignKey'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append('Customer_Resolved_referenceOnly/hasAttributes/customerId')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'addedAttributeSelectedType'
        attrCtx_LVL3_IND1.name = '_selectedEntityName'
        attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'Customer_Resolved_referenceOnly/hasAttributes/customerIdType')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_structured = AttributeContextExpectedValue()

        expectedContext_structured.type = 'entity'
        expectedContext_structured.name = 'Customer_Resolved_structured'
        expectedContext_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact/extends'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'ContactID'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Contact/hasAttributes/ContactID'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'FullName'
        attrCtx_LVL4_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND2.Definition = 'resolvedFrom/Contact/hasAttributes/FullName'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Address'
        attrCtx_LVL4_IND3.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND3.Definition = 'resolvedFrom/Contact/hasAttributes/Address'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account/extends'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'AccountID'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Account/hasAttributes/AccountID'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'CompanyName'
        attrCtx_LVL4_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND2.Definition = 'resolvedFrom/Account/hasAttributes/CompanyName'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Address'
        attrCtx_LVL4_IND3.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND3.Definition = 'resolvedFrom/Account/hasAttributes/Address'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_normalized_structured = AttributeContextExpectedValue()

        expectedContext_normalized_structured.type = 'entity'
        expectedContext_normalized_structured.name = 'Customer_Resolved_normalized_structured'
        expectedContext_normalized_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact/extends'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'ContactID'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Contact/hasAttributes/ContactID'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'FullName'
        attrCtx_LVL4_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND2.Definition = 'resolvedFrom/Contact/hasAttributes/FullName'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Address'
        attrCtx_LVL4_IND3.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact'
        attrCtx_LVL4_IND3.Definition = 'resolvedFrom/Contact/hasAttributes/Address'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'
        attrCtx_LVL3_IND0.contexts = []
        attrCtx_LVL4_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL4_IND0.name = 'extends'
        attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND0.contexts = []
        attrCtx_LVL5_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL5_IND0.type = 'entity'
        attrCtx_LVL5_IND0.name = 'CdmEntity'
        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account/extends'
        attrCtx_LVL5_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL4_IND0.contexts.append(attrCtx_LVL5_IND0)

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND0)
        attrCtx_LVL4_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND1.type = 'attributeDefinition'
        attrCtx_LVL4_IND1.name = 'AccountID'
        attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND1.Definition = 'resolvedFrom/Account/hasAttributes/AccountID'
        attrCtx_LVL4_IND1.context_strings = []

        attrCtx_LVL4_IND1.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND1)
        attrCtx_LVL4_IND2 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND2.type = 'attributeDefinition'
        attrCtx_LVL4_IND2.name = 'CompanyName'
        attrCtx_LVL4_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND2.Definition = 'resolvedFrom/Account/hasAttributes/CompanyName'
        attrCtx_LVL4_IND2.context_strings = []

        attrCtx_LVL4_IND2.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND2)
        attrCtx_LVL4_IND3 = AttributeContextExpectedValue()

        attrCtx_LVL4_IND3.type = 'attributeDefinition'
        attrCtx_LVL4_IND3.name = 'Address'
        attrCtx_LVL4_IND3.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account'
        attrCtx_LVL4_IND3.Definition = 'resolvedFrom/Account/hasAttributes/Address'
        attrCtx_LVL4_IND3.context_strings = []

        attrCtx_LVL4_IND3.context_strings.append(
            'Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address')

        attrCtx_LVL3_IND0.contexts.append(attrCtx_LVL4_IND3)

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized.type = 'entity'
        expectedContext_referenceOnly_normalized.name = 'Customer_Resolved_referenceOnly_normalized'
        expectedContext_referenceOnly_normalized.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly_normalized.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL3_IND0.name = '_foreignKey'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly_normalized/hasAttributes/customerId')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)
        attrCtx_LVL3_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND1.type = 'addedAttributeSelectedType'
        attrCtx_LVL3_IND1.name = '_selectedEntityName'
        attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND1.context_strings = []

        attrCtx_LVL3_IND1.context_strings.append(
            'Customer_Resolved_referenceOnly_normalized/hasAttributes/customerIdType')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND1)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly_normalized.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_structured.type = 'entity'
        expectedContext_referenceOnly_structured.name = 'Customer_Resolved_referenceOnly_structured'
        expectedContext_referenceOnly_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL3_IND0.name = '_foreignKey'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly_structured.contexts.append(attrCtx_LVL0_IND1)

        expectedContext_referenceOnly_normalized_structured = AttributeContextExpectedValue()

        expectedContext_referenceOnly_normalized_structured.type = 'entity'
        expectedContext_referenceOnly_normalized_structured.name = 'Customer_Resolved_referenceOnly_normalized_structured'
        expectedContext_referenceOnly_normalized_structured.Definition = 'resolvedFrom/Customer'
        expectedContext_referenceOnly_normalized_structured.contexts = []
        attrCtx_LVL0_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND0.type = 'entityReferenceExtends'
        attrCtx_LVL0_IND0.name = 'extends'
        attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND0.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'CdmEntity'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/CdmEntity'

        attrCtx_LVL0_IND0.contexts.append(attrCtx_LVL1_IND0)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND0)
        attrCtx_LVL0_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL0_IND1.type = 'attributeDefinition'
        attrCtx_LVL0_IND1.name = 'customer'
        attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured'
        attrCtx_LVL0_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer'
        attrCtx_LVL0_IND1.contexts = []
        attrCtx_LVL1_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND0.type = 'entity'
        attrCtx_LVL1_IND0.name = 'Customer'
        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer'
        attrCtx_LVL1_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer'
        attrCtx_LVL1_IND0.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'attributeDefinition'
        attrCtx_LVL2_IND0.name = 'contactOption'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer'
        attrCtx_LVL2_IND0.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Contact'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/contactOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Contact'

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND0)
        attrCtx_LVL2_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND1.type = 'attributeDefinition'
        attrCtx_LVL2_IND1.name = 'accountOption'
        attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer'
        attrCtx_LVL2_IND1.Definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption'
        attrCtx_LVL2_IND1.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'entity'
        attrCtx_LVL3_IND0.name = 'Account'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/accountOption'
        attrCtx_LVL3_IND0.Definition = 'resolvedFrom/Account'

        attrCtx_LVL2_IND1.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND0.contexts.append(attrCtx_LVL2_IND1)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND0)
        attrCtx_LVL1_IND1 = AttributeContextExpectedValue()

        attrCtx_LVL1_IND1.type = 'generatedSet'
        attrCtx_LVL1_IND1.name = '_generatedAttributeSet'
        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer'
        attrCtx_LVL1_IND1.contexts = []
        attrCtx_LVL2_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL2_IND0.type = 'generatedRound'
        attrCtx_LVL2_IND0.name = '_generatedAttributeRound0'
        attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet'
        attrCtx_LVL2_IND0.contexts = []
        attrCtx_LVL3_IND0 = AttributeContextExpectedValue()

        attrCtx_LVL3_IND0.type = 'addedAttributeIdentity'
        attrCtx_LVL3_IND0.name = '_foreignKey'
        attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0'
        attrCtx_LVL3_IND0.context_strings = []

        attrCtx_LVL3_IND0.context_strings.append(
            'Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId')

        attrCtx_LVL2_IND0.contexts.append(attrCtx_LVL3_IND0)

        attrCtx_LVL1_IND1.contexts.append(attrCtx_LVL2_IND0)

        attrCtx_LVL0_IND1.contexts.append(attrCtx_LVL1_IND1)

        expectedContext_referenceOnly_normalized_structured.contexts.append(attrCtx_LVL0_IND1)

        # Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
        expected_default = None
        expected_normalized = None
        expected_referenceOnly = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerId'
        att.source_name = 'customerid'
        expected_referenceOnly.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName'
        att.data_format = 'String'
        att.display_name = 'Customer Type'
        att.name = 'customerIdType'
        att.source_name = 'customeridtype'
        expected_referenceOnly.append(att)

        expected_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)
        expected_structured.append(attrib_group_ref)

        expected_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)

        att = AttributeExpectedValue()
        att.data_format = 'Unknown'
        attrib_group_ref.members.append(att)
        expected_normalized_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerId'
        att.source_name = 'customerid'
        expected_referenceOnly_normalized.append(att)

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName'
        att.data_format = 'String'
        att.display_name = 'Customer Type'
        att.name = 'customerIdType'
        att.source_name = 'customeridtype'
        expected_referenceOnly_normalized.append(att)

        expected_referenceOnly_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerId'
        att.source_name = 'customerid'
        attrib_group_ref.members.append(att)
        expected_referenceOnly_structured.append(attrib_group_ref)

        expected_referenceOnly_normalized_structured = []

        attrib_group_ref = AttributeExpectedValue()
        attrib_group_ref.attribute_group_name = 'customer'
        attrib_group_ref.attribute_context = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer'
        attrib_group_ref.members = []

        att = AttributeExpectedValue()
        att.attribute_context = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey'
        att.data_format = 'Guid'
        att.display_name = 'Customer'
        att.name = 'customerId'
        att.source_name = 'customerid'
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
