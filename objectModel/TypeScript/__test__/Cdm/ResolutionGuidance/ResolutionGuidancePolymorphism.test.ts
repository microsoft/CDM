// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AttributeContextExpectedValue, AttributeExpectedValue } from '../../Utilities/ObjectValidator';
import { CommonTest } from './CommonTest';

// tslint:disable:max-func-body-length
// tslint:disable:variable-name
describe('Cdm.ResolutionGuidancePolymorphism', () => {
    /**
     * Resolution Guidance Test - Polymorphism
     */
    it('TestPolymorphism', async (done) => {
        const testName: string = 'TestPolymorphism';
        {
            const entityName: string = 'Customer';

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            const expectedContext_default: AttributeContextExpectedValue = undefined;
            const expectedContext_normalized: AttributeContextExpectedValue = undefined;
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.type = 'entity';
                expectedContext_referenceOnly.name = 'Customer_Resolved_referenceOnly';
                expectedContext_referenceOnly.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'generatedRound';
                            attrCtx_LVL2_IND0.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'addedAttributeIdentity';
                                attrCtx_LVL3_IND0.name = '_foreignKey';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('Customer_Resolved_referenceOnly/hasAttributes/customerCustomerId');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'addedAttributeSelectedType';
                                attrCtx_LVL3_IND1.name = '_selectedEntityName';
                                attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('Customer_Resolved_referenceOnly/hasAttributes/customerCustomerIdType');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_structured.type = 'entity';
                expectedContext_structured.name = 'Customer_Resolved_structured';
                expectedContext_structured.definition = 'resolvedFrom/Customer';
                expectedContext_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'ContactID';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Contact/hasAttributes/ContactID';
                                    attrCtx_LVL4_IND1.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND1.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                                const attrCtx_LVL4_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND2.name = 'FullName';
                                    attrCtx_LVL4_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND2.definition = 'resolvedFrom/Contact/hasAttributes/FullName';
                                    attrCtx_LVL4_IND2.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND2.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND2);
                                const attrCtx_LVL4_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND3.name = 'Address';
                                    attrCtx_LVL4_IND3.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND3.definition = 'resolvedFrom/Contact/hasAttributes/Address';
                                    attrCtx_LVL4_IND3.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND3.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'AccountID';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Account/hasAttributes/AccountID';
                                    attrCtx_LVL4_IND1.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND1.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                                const attrCtx_LVL4_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND2.name = 'CompanyName';
                                    attrCtx_LVL4_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND2.definition = 'resolvedFrom/Account/hasAttributes/CompanyName';
                                    attrCtx_LVL4_IND2.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND2.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND2);
                                const attrCtx_LVL4_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND3.name = 'Address';
                                    attrCtx_LVL4_IND3.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND3.definition = 'resolvedFrom/Account/hasAttributes/Address';
                                    attrCtx_LVL4_IND3.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND3.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.type = 'entity';
                expectedContext_normalized_structured.name = 'Customer_Resolved_normalized_structured';
                expectedContext_normalized_structured.definition = 'resolvedFrom/Customer';
                expectedContext_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'ContactID';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Contact/hasAttributes/ContactID';
                                    attrCtx_LVL4_IND1.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND1.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                                const attrCtx_LVL4_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND2.name = 'FullName';
                                    attrCtx_LVL4_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND2.definition = 'resolvedFrom/Contact/hasAttributes/FullName';
                                    attrCtx_LVL4_IND2.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND2.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND2);
                                const attrCtx_LVL4_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND3.name = 'Address';
                                    attrCtx_LVL4_IND3.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND3.definition = 'resolvedFrom/Contact/hasAttributes/Address';
                                    attrCtx_LVL4_IND3.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND3.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'AccountID';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Account/hasAttributes/AccountID';
                                    attrCtx_LVL4_IND1.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND1.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                                const attrCtx_LVL4_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND2.name = 'CompanyName';
                                    attrCtx_LVL4_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND2.definition = 'resolvedFrom/Account/hasAttributes/CompanyName';
                                    attrCtx_LVL4_IND2.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND2.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND2);
                                const attrCtx_LVL4_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND3.name = 'Address';
                                    attrCtx_LVL4_IND3.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND3.definition = 'resolvedFrom/Account/hasAttributes/Address';
                                    attrCtx_LVL4_IND3.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND3.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.type = 'entity';
                expectedContext_referenceOnly_normalized.name = 'Customer_Resolved_referenceOnly_normalized';
                expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'generatedRound';
                            attrCtx_LVL2_IND0.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'addedAttributeIdentity';
                                attrCtx_LVL3_IND0.name = '_foreignKey';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerId');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'addedAttributeSelectedType';
                                attrCtx_LVL3_IND1.name = '_selectedEntityName';
                                attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerIdType');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.type = 'entity';
                expectedContext_referenceOnly_structured.name = 'Customer_Resolved_referenceOnly_structured';
                expectedContext_referenceOnly_structured.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'generatedRound';
                            attrCtx_LVL2_IND0.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'addedAttributeIdentity';
                                attrCtx_LVL3_IND0.name = '_foreignKey';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.type = 'entity';
                expectedContext_referenceOnly_normalized_structured.name = 'Customer_Resolved_referenceOnly_normalized_structured';
                expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'generatedRound';
                            attrCtx_LVL2_IND0.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'addedAttributeIdentity';
                                attrCtx_LVL3_IND0.name = '_foreignKey';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
            }

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            const expected_default: AttributeExpectedValue[] = undefined;
            const expected_normalized: AttributeExpectedValue[] = undefined;
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                    att.dataFormat = 'Guid';
                    att.displayName = 'Customer';
                    att.name = 'customerCustomerId';
                    att.sourceName = 'customerid';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName';
                    att.dataFormat = 'String';
                    att.displayName = 'Customer Type';
                    att.name = 'customerCustomerIdType';
                    att.sourceName = 'customeridtype';
                }
                expected_referenceOnly.push(att);
            }
            const expected_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    expected_structured.push(attribGroupRef);
                }
            }
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    expected_normalized_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                    att.dataFormat = 'Guid';
                    att.displayName = 'Customer';
                    att.name = 'customerCustomerId';
                    att.sourceName = 'customerid';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName';
                    att.dataFormat = 'String';
                    att.displayName = 'Customer Type';
                    att.name = 'customerCustomerIdType';
                    att.sourceName = 'customeridtype';
                }
                expected_referenceOnly_normalized.push(att);
            }
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer';
                    attribGroupRef.members = [];
                    const att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                        att.dataFormat = 'Guid';
                        att.displayName = 'Customer';
                        att.name = 'customerId';
                        att.sourceName = 'customerid';
                    }
                    attribGroupRef.members.push(att);
                    expected_referenceOnly_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer';
                    attribGroupRef.members = [];
                    const att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                        att.dataFormat = 'Guid';
                        att.displayName = 'Customer';
                        att.name = 'customerId';
                        att.sourceName = 'customerid';
                    }
                    attribGroupRef.members.push(att);
                    expected_referenceOnly_normalized_structured.push(attribGroupRef);
                }
            }

            await CommonTest.runTestWithValues(
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
            );
        }
        done();
    });

    /**
     * Resolution Guidance Test - Polymorphism With AttributeGroupRef
     */
    it('TestPolymorphismWithAttributeGroupRef', async (done) => {
        const testName: string = 'TestPolymorphismWithAttributeGroupRef';
        {
            const entityName: string = 'Customer';

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            const expectedContext_default: AttributeContextExpectedValue = undefined;
            const expectedContext_normalized: AttributeContextExpectedValue = undefined;
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.type = 'entity';
                expectedContext_referenceOnly.name = 'Customer_Resolved_referenceOnly';
                expectedContext_referenceOnly.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customerIdAttribute';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'customerIdAttribute';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'customer';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Customer';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND0.name = 'contactOption';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Contact';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Contact';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'accountOption';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Account';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Account';
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'generatedSet';
                                attrCtx_LVL3_IND1.name = '_generatedAttributeSet';
                                attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'generatedRound';
                                    attrCtx_LVL4_IND0.name = '_generatedAttributeRound0';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity';
                                        attrCtx_LVL5_IND0.name = '_foreignKey';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('Customer_Resolved_referenceOnly/hasAttributes/customerCustomerId');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'addedAttributeSelectedType';
                                        attrCtx_LVL5_IND1.name = '_selectedEntityName';
                                        attrCtx_LVL5_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('Customer_Resolved_referenceOnly/hasAttributes/customerCustomerIdType');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_structured.type = 'entity';
                expectedContext_structured.name = 'Customer_Resolved_structured';
                expectedContext_structured.definition = 'resolvedFrom/Customer';
                expectedContext_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customerIdAttribute';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'customerIdAttribute';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'customer';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Customer';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND0.name = 'contactOption';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Contact';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Contact';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'entityReferenceExtends';
                                            attrCtx_LVL6_IND0.name = 'extends';
                                            attrCtx_LVL6_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact';
                                            attrCtx_LVL6_IND0.contexts = [];
                                            const attrCtx_LVL7_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.type = 'entity';
                                                attrCtx_LVL7_IND0.name = 'CdmEntity';
                                                attrCtx_LVL7_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/extends';
                                                attrCtx_LVL7_IND0.definition = 'resolvedFrom/CdmEntity';
                                            }
                                            attrCtx_LVL6_IND0.contexts.push(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.contexts = [];
                                            const attrCtx_LVL7_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.type = 'attributeGroup';
                                                attrCtx_LVL7_IND0.name = 'attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.contexts = [];
                                                const attrCtx_LVL8_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND0.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND0.name = 'ContactID';
                                                    attrCtx_LVL8_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND0.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/ContactID';
                                                    attrCtx_LVL8_IND0.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND0.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND0);
                                                const attrCtx_LVL8_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND1.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND1.name = 'FullName';
                                                    attrCtx_LVL8_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND1.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/FullName';
                                                    attrCtx_LVL8_IND1.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND1.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND1);
                                                const attrCtx_LVL8_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND2.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND2.name = 'Address';
                                                    attrCtx_LVL8_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND2.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/Address';
                                                    attrCtx_LVL8_IND2.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND2.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND2);
                                            }
                                            attrCtx_LVL6_IND1.contexts.push(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'accountOption';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Account';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Account';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'entityReferenceExtends';
                                            attrCtx_LVL6_IND0.name = 'extends';
                                            attrCtx_LVL6_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account';
                                            attrCtx_LVL6_IND0.contexts = [];
                                            const attrCtx_LVL7_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.type = 'entity';
                                                attrCtx_LVL7_IND0.name = 'CdmEntity';
                                                attrCtx_LVL7_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/extends';
                                                attrCtx_LVL7_IND0.definition = 'resolvedFrom/CdmEntity';
                                            }
                                            attrCtx_LVL6_IND0.contexts.push(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.contexts = [];
                                            const attrCtx_LVL7_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.type = 'attributeGroup';
                                                attrCtx_LVL7_IND0.name = 'attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.contexts = [];
                                                const attrCtx_LVL8_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND0.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND0.name = 'AccountID';
                                                    attrCtx_LVL8_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND0.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/AccountID';
                                                    attrCtx_LVL8_IND0.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND0.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND0);
                                                const attrCtx_LVL8_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND1.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND1.name = 'CompanyName';
                                                    attrCtx_LVL8_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND1.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/CompanyName';
                                                    attrCtx_LVL8_IND1.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND1.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND1);
                                                const attrCtx_LVL8_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND2.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND2.name = 'Address';
                                                    attrCtx_LVL8_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND2.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/Address';
                                                    attrCtx_LVL8_IND2.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND2.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND2);
                                            }
                                            attrCtx_LVL6_IND1.contexts.push(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.type = 'entity';
                expectedContext_normalized_structured.name = 'Customer_Resolved_normalized_structured';
                expectedContext_normalized_structured.definition = 'resolvedFrom/Customer';
                expectedContext_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customerIdAttribute';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'customerIdAttribute';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'customer';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Customer';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND0.name = 'contactOption';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Contact';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Contact';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'entityReferenceExtends';
                                            attrCtx_LVL6_IND0.name = 'extends';
                                            attrCtx_LVL6_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact';
                                            attrCtx_LVL6_IND0.contexts = [];
                                            const attrCtx_LVL7_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.type = 'entity';
                                                attrCtx_LVL7_IND0.name = 'CdmEntity';
                                                attrCtx_LVL7_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/extends';
                                                attrCtx_LVL7_IND0.definition = 'resolvedFrom/CdmEntity';
                                            }
                                            attrCtx_LVL6_IND0.contexts.push(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.contexts = [];
                                            const attrCtx_LVL7_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.type = 'attributeGroup';
                                                attrCtx_LVL7_IND0.name = 'attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.contexts = [];
                                                const attrCtx_LVL8_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND0.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND0.name = 'ContactID';
                                                    attrCtx_LVL8_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND0.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/ContactID';
                                                    attrCtx_LVL8_IND0.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND0.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND0);
                                                const attrCtx_LVL8_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND1.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND1.name = 'FullName';
                                                    attrCtx_LVL8_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND1.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/FullName';
                                                    attrCtx_LVL8_IND1.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND1.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND1);
                                                const attrCtx_LVL8_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND2.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND2.name = 'Address';
                                                    attrCtx_LVL8_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND2.definition = 'resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/Address';
                                                    attrCtx_LVL8_IND2.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND2.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND2);
                                            }
                                            attrCtx_LVL6_IND1.contexts.push(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'accountOption';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Account';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Account';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'entityReferenceExtends';
                                            attrCtx_LVL6_IND0.name = 'extends';
                                            attrCtx_LVL6_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account';
                                            attrCtx_LVL6_IND0.contexts = [];
                                            const attrCtx_LVL7_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.type = 'entity';
                                                attrCtx_LVL7_IND0.name = 'CdmEntity';
                                                attrCtx_LVL7_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/extends';
                                                attrCtx_LVL7_IND0.definition = 'resolvedFrom/CdmEntity';
                                            }
                                            attrCtx_LVL6_IND0.contexts.push(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.contexts = [];
                                            const attrCtx_LVL7_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.type = 'attributeGroup';
                                                attrCtx_LVL7_IND0.name = 'attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope';
                                                attrCtx_LVL7_IND0.contexts = [];
                                                const attrCtx_LVL8_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND0.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND0.name = 'AccountID';
                                                    attrCtx_LVL8_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND0.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/AccountID';
                                                    attrCtx_LVL8_IND0.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND0.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND0);
                                                const attrCtx_LVL8_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND1.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND1.name = 'CompanyName';
                                                    attrCtx_LVL8_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND1.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/CompanyName';
                                                    attrCtx_LVL8_IND1.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND1.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND1);
                                                const attrCtx_LVL8_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND2.type = 'attributeDefinition';
                                                    attrCtx_LVL8_IND2.name = 'Address';
                                                    attrCtx_LVL8_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                                    attrCtx_LVL8_IND2.definition = 'resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/Address';
                                                    attrCtx_LVL8_IND2.contextStrings = [];
                                                    {
                                                        attrCtx_LVL8_IND2.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address');
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.contexts.push(attrCtx_LVL8_IND2);
                                            }
                                            attrCtx_LVL6_IND1.contexts.push(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.type = 'entity';
                expectedContext_referenceOnly_normalized.name = 'Customer_Resolved_referenceOnly_normalized';
                expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customerIdAttribute';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'customerIdAttribute';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'customer';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Customer';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND0.name = 'contactOption';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Contact';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Contact';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'accountOption';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Account';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Account';
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'generatedSet';
                                attrCtx_LVL3_IND1.name = '_generatedAttributeSet';
                                attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'generatedRound';
                                    attrCtx_LVL4_IND0.name = '_generatedAttributeRound0';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity';
                                        attrCtx_LVL5_IND0.name = '_foreignKey';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerId');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'addedAttributeSelectedType';
                                        attrCtx_LVL5_IND1.name = '_selectedEntityName';
                                        attrCtx_LVL5_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerIdType');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.type = 'entity';
                expectedContext_referenceOnly_structured.name = 'Customer_Resolved_referenceOnly_structured';
                expectedContext_referenceOnly_structured.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customerIdAttribute';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'customerIdAttribute';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'customer';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Customer';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND0.name = 'contactOption';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Contact';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Contact';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'accountOption';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Account';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Account';
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'generatedSet';
                                attrCtx_LVL3_IND1.name = '_generatedAttributeSet';
                                attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'generatedRound';
                                    attrCtx_LVL4_IND0.name = '_generatedAttributeRound0';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity';
                                        attrCtx_LVL5_IND0.name = '_foreignKey';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.type = 'entity';
                expectedContext_referenceOnly_normalized_structured.name = 'Customer_Resolved_referenceOnly_normalized_structured';
                expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customerIdAttribute';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'customerIdAttribute';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'customer';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Customer';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND0.name = 'contactOption';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Contact';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Contact';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'accountOption';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'Account';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Account';
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'generatedSet';
                                attrCtx_LVL3_IND1.name = '_generatedAttributeSet';
                                attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'generatedRound';
                                    attrCtx_LVL4_IND0.name = '_generatedAttributeRound0';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity';
                                        attrCtx_LVL5_IND0.name = '_foreignKey';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
            }

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            const expected_default: AttributeExpectedValue[] = undefined;
            const expected_normalized: AttributeExpectedValue[] = undefined;
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                    att.dataFormat = 'Guid';
                    att.displayName = 'Customer';
                    att.name = 'customerCustomerId';
                    att.sourceName = 'customerid';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName';
                    att.dataFormat = 'String';
                    att.displayName = 'Customer Type';
                    att.name = 'customerCustomerIdType';
                    att.sourceName = 'customeridtype';
                }
                expected_referenceOnly.push(att);
            }
            const expected_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    expected_structured.push(attribGroupRef);
                }
            }
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    expected_normalized_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                    att.dataFormat = 'Guid';
                    att.displayName = 'Customer';
                    att.name = 'customerCustomerId';
                    att.sourceName = 'customerid';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName';
                    att.dataFormat = 'String';
                    att.displayName = 'Customer Type';
                    att.name = 'customerCustomerIdType';
                    att.sourceName = 'customeridtype';
                }
                expected_referenceOnly_normalized.push(att);
            }
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer';
                    attribGroupRef.members = [];
                    const att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                        att.dataFormat = 'Guid';
                        att.displayName = 'Customer';
                        att.name = 'customerId';
                        att.sourceName = 'customerid';
                    }
                    attribGroupRef.members.push(att);
                    expected_referenceOnly_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer';
                    attribGroupRef.members = [];
                    const att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                        att.dataFormat = 'Guid';
                        att.displayName = 'Customer';
                        att.name = 'customerId';
                        att.sourceName = 'customerid';
                    }
                    attribGroupRef.members.push(att);
                    expected_referenceOnly_normalized_structured.push(attribGroupRef);
                }
            }

            await CommonTest.runTestWithValues(
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
            );
        }
        done();
    });

    /**
     * Resolution Guidance Test - Polymorphism With Rename As Member
     */
    it('TestPolymorphismWithRenameAsMember', async (done) => {
        const testName: string = 'TestPolymorphismWithRenameAsMember';
        {
            const entityName: string = 'Customer';

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            const expectedContext_default: AttributeContextExpectedValue = undefined;
            const expectedContext_normalized: AttributeContextExpectedValue = undefined;
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.type = 'entity';
                expectedContext_referenceOnly.name = 'Customer_Resolved_referenceOnly';
                expectedContext_referenceOnly.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'generatedRound';
                            attrCtx_LVL2_IND0.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'addedAttributeIdentity';
                                attrCtx_LVL3_IND0.name = '_foreignKey';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('Customer_Resolved_referenceOnly/hasAttributes/customerId');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'addedAttributeSelectedType';
                                attrCtx_LVL3_IND1.name = '_selectedEntityName';
                                attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('Customer_Resolved_referenceOnly/hasAttributes/customerIdType');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_structured.type = 'entity';
                expectedContext_structured.name = 'Customer_Resolved_structured';
                expectedContext_structured.definition = 'resolvedFrom/Customer';
                expectedContext_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'ContactID';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Contact/hasAttributes/ContactID';
                                    attrCtx_LVL4_IND1.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND1.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                                const attrCtx_LVL4_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND2.name = 'FullName';
                                    attrCtx_LVL4_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND2.definition = 'resolvedFrom/Contact/hasAttributes/FullName';
                                    attrCtx_LVL4_IND2.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND2.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND2);
                                const attrCtx_LVL4_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND3.name = 'Address';
                                    attrCtx_LVL4_IND3.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND3.definition = 'resolvedFrom/Contact/hasAttributes/Address';
                                    attrCtx_LVL4_IND3.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND3.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'AccountID';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Account/hasAttributes/AccountID';
                                    attrCtx_LVL4_IND1.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND1.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                                const attrCtx_LVL4_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND2.name = 'CompanyName';
                                    attrCtx_LVL4_IND2.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND2.definition = 'resolvedFrom/Account/hasAttributes/CompanyName';
                                    attrCtx_LVL4_IND2.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND2.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND2);
                                const attrCtx_LVL4_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND3.name = 'Address';
                                    attrCtx_LVL4_IND3.parent = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND3.definition = 'resolvedFrom/Account/hasAttributes/Address';
                                    attrCtx_LVL4_IND3.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND3.contextStrings.push('Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.type = 'entity';
                expectedContext_normalized_structured.name = 'Customer_Resolved_normalized_structured';
                expectedContext_normalized_structured.definition = 'resolvedFrom/Customer';
                expectedContext_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'ContactID';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Contact/hasAttributes/ContactID';
                                    attrCtx_LVL4_IND1.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND1.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                                const attrCtx_LVL4_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND2.name = 'FullName';
                                    attrCtx_LVL4_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND2.definition = 'resolvedFrom/Contact/hasAttributes/FullName';
                                    attrCtx_LVL4_IND2.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND2.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND2);
                                const attrCtx_LVL4_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND3.name = 'Address';
                                    attrCtx_LVL4_IND3.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact';
                                    attrCtx_LVL4_IND3.definition = 'resolvedFrom/Contact/hasAttributes/Address';
                                    attrCtx_LVL4_IND3.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND3.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'AccountID';
                                    attrCtx_LVL4_IND1.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Account/hasAttributes/AccountID';
                                    attrCtx_LVL4_IND1.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND1.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                                const attrCtx_LVL4_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND2.name = 'CompanyName';
                                    attrCtx_LVL4_IND2.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND2.definition = 'resolvedFrom/Account/hasAttributes/CompanyName';
                                    attrCtx_LVL4_IND2.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND2.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND2);
                                const attrCtx_LVL4_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND3.name = 'Address';
                                    attrCtx_LVL4_IND3.parent = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account';
                                    attrCtx_LVL4_IND3.definition = 'resolvedFrom/Account/hasAttributes/Address';
                                    attrCtx_LVL4_IND3.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND3.contextStrings.push('Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address');
                                    }
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.type = 'entity';
                expectedContext_referenceOnly_normalized.name = 'Customer_Resolved_referenceOnly_normalized';
                expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'generatedRound';
                            attrCtx_LVL2_IND0.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'addedAttributeIdentity';
                                attrCtx_LVL3_IND0.name = '_foreignKey';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('Customer_Resolved_referenceOnly_normalized/hasAttributes/customerId');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'addedAttributeSelectedType';
                                attrCtx_LVL3_IND1.name = '_selectedEntityName';
                                attrCtx_LVL3_IND1.parent = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('Customer_Resolved_referenceOnly_normalized/hasAttributes/customerIdType');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.type = 'entity';
                expectedContext_referenceOnly_structured.name = 'Customer_Resolved_referenceOnly_structured';
                expectedContext_referenceOnly_structured.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'generatedRound';
                            attrCtx_LVL2_IND0.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'addedAttributeIdentity';
                                attrCtx_LVL3_IND0.name = '_foreignKey';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.type = 'entity';
                expectedContext_referenceOnly_normalized_structured.name = 'Customer_Resolved_referenceOnly_normalized_structured';
                expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/Customer';
                expectedContext_referenceOnly_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'customer';
                    attrCtx_LVL0_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Customer';
                        attrCtx_LVL1_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'contactOption';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Contact';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/contactOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Contact';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'accountOption';
                            attrCtx_LVL2_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Account';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/accountOption';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Account';
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'generatedRound';
                            attrCtx_LVL2_IND0.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'addedAttributeIdentity';
                                attrCtx_LVL3_IND0.name = '_foreignKey';
                                attrCtx_LVL3_IND0.parent = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId');
                                }
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
            }

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            const expected_default: AttributeExpectedValue[] = undefined;
            const expected_normalized: AttributeExpectedValue[] = undefined;
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                    att.dataFormat = 'Guid';
                    att.displayName = 'Customer';
                    att.name = 'customerId';
                    att.sourceName = 'customerid';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName';
                    att.dataFormat = 'String';
                    att.displayName = 'Customer Type';
                    att.name = 'customerIdType';
                    att.sourceName = 'customeridtype';
                }
                expected_referenceOnly.push(att);
            }
            const expected_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    expected_structured.push(attribGroupRef);
                }
            }
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.dataFormat = 'Unknown';
                    }
                    attribGroupRef.members.push(att);
                    expected_normalized_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                    att.dataFormat = 'Guid';
                    att.displayName = 'Customer';
                    att.name = 'customerId';
                    att.sourceName = 'customerid';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName';
                    att.dataFormat = 'String';
                    att.displayName = 'Customer Type';
                    att.name = 'customerIdType';
                    att.sourceName = 'customeridtype';
                }
                expected_referenceOnly_normalized.push(att);
            }
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer';
                    attribGroupRef.members = [];
                    const att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                        att.dataFormat = 'Guid';
                        att.displayName = 'Customer';
                        att.name = 'customerId';
                        att.sourceName = 'customerid';
                    }
                    attribGroupRef.members.push(att);
                    expected_referenceOnly_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'customer';
                    attribGroupRef.attributeContext = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer';
                    attribGroupRef.members = [];
                    const att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                        att.dataFormat = 'Guid';
                        att.displayName = 'Customer';
                        att.name = 'customerId';
                        att.sourceName = 'customerid';
                    }
                    attribGroupRef.members.push(att);
                    expected_referenceOnly_normalized_structured.push(attribGroupRef);
                }
            }

            await CommonTest.runTestWithValues(
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
            );
        }
        done();
    });
});
