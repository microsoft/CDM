// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AttributeContextExpectedValue, AttributeExpectedValue } from '../../Utilities/ObjectValidator';
import { CommonTest } from './CommonTest';

// tslint:disable:max-func-body-length
// tslint:disable:variable-name
describe('Cdm.ResolutionGuidanceAddInSupportOf', () => {
    /**
     * Resolution Guidance Test - AddInSupportOf
     */
    it('TestAddInSupportOf', async (done) => {
        const testName: string = 'TestAddInSupportOf';
        {
            const entityName: string = 'Product';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_default.type = 'entity';
                expectedContext_default.name = 'Product_Resolved_default';
                expectedContext_default.definition = 'resolvedFrom/Product';
                expectedContext_default.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Product_Resolved_default/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'StatusCode';
                            attrCtx_LVL2_IND1.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Product_Resolved_default/hasAttributes/StatusCode');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'StatusCode_display';
                            attrCtx_LVL2_IND2.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Product_Resolved_default/hasAttributes/StatusCode_display');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.type = 'entity';
                expectedContext_normalized.name = 'Product_Resolved_normalized';
                expectedContext_normalized.definition = 'resolvedFrom/Product';
                expectedContext_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Product_Resolved_normalized/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'StatusCode';
                            attrCtx_LVL2_IND1.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Product_Resolved_normalized/hasAttributes/StatusCode');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'StatusCode_display';
                            attrCtx_LVL2_IND2.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Product_Resolved_normalized/hasAttributes/StatusCode_display');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.type = 'entity';
                expectedContext_referenceOnly.name = 'Product_Resolved_referenceOnly';
                expectedContext_referenceOnly.definition = 'resolvedFrom/Product';
                expectedContext_referenceOnly.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Product_Resolved_referenceOnly/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'StatusCode';
                            attrCtx_LVL2_IND1.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Product_Resolved_referenceOnly/hasAttributes/StatusCode');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'StatusCode_display';
                            attrCtx_LVL2_IND2.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Product_Resolved_referenceOnly/hasAttributes/StatusCode_display');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_structured.type = 'entity';
                expectedContext_structured.name = 'Product_Resolved_structured';
                expectedContext_structured.definition = 'resolvedFrom/Product';
                expectedContext_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Product_Resolved_structured/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'StatusCode';
                            attrCtx_LVL2_IND1.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Product_Resolved_structured/hasAttributes/StatusCode');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'StatusCode_display';
                            attrCtx_LVL2_IND2.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Product_Resolved_structured/hasAttributes/StatusCode_display');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.type = 'entity';
                expectedContext_normalized_structured.name = 'Product_Resolved_normalized_structured';
                expectedContext_normalized_structured.definition = 'resolvedFrom/Product';
                expectedContext_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Product_Resolved_normalized_structured/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'StatusCode';
                            attrCtx_LVL2_IND1.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Product_Resolved_normalized_structured/hasAttributes/StatusCode');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'StatusCode_display';
                            attrCtx_LVL2_IND2.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Product_Resolved_normalized_structured/hasAttributes/StatusCode_display');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.type = 'entity';
                expectedContext_referenceOnly_normalized.name = 'Product_Resolved_referenceOnly_normalized';
                expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/Product';
                expectedContext_referenceOnly_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Product_Resolved_referenceOnly_normalized/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'StatusCode';
                            attrCtx_LVL2_IND1.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'StatusCode_display';
                            attrCtx_LVL2_IND2.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode_display');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.type = 'entity';
                expectedContext_referenceOnly_structured.name = 'Product_Resolved_referenceOnly_structured';
                expectedContext_referenceOnly_structured.definition = 'resolvedFrom/Product';
                expectedContext_referenceOnly_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Product_Resolved_referenceOnly_structured/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'StatusCode';
                            attrCtx_LVL2_IND1.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'StatusCode_display';
                            attrCtx_LVL2_IND2.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode_display');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.type = 'entity';
                expectedContext_referenceOnly_normalized_structured.name = 'Product_Resolved_referenceOnly_normalized_structured';
                expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/Product';
                expectedContext_referenceOnly_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Product_Resolved_referenceOnly_normalized_structured/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'StatusCode';
                            attrCtx_LVL2_IND1.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'StatusCode_display';
                            attrCtx_LVL2_IND2.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode_display');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
            }

            const expected_default: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_default.push(att);
            }
            const expected_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_normalized.push(att);
            }
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_referenceOnly.push(att);
            }
            const expected_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_structured.push(att);
            }
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_normalized_structured.push(att);
            }
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_referenceOnly_normalized.push(att);
            }
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_referenceOnly_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_referenceOnly_structured.push(att);
            }
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_referenceOnly_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_referenceOnly_normalized_structured.push(att);
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
     * Resolution Guidance Test - AddInSupportOf with IsCorrelatedWith
     */
    it('TestAddInSupportOfWithIsCorrelatedWith', async (done) => {
        const testName: string = 'TestAddInSupportOfWithIsCorrelatedWith';
        {
            const entityName: string = 'Product';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_default.type = 'entity';
                expectedContext_default.name = 'Product_Resolved_default';
                expectedContext_default.definition = 'resolvedFrom/Product';
                expectedContext_default.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'ID';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID';
                    attrCtx_LVL0_IND1.contextStrings = [];
                    {
                        attrCtx_LVL0_IND1.contextStrings.push('Product_Resolved_default/hasAttributes/ID');
                    }
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND1);
                const attrCtx_LVL0_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.type = 'attributeDefinition';
                    attrCtx_LVL0_IND2.name = 'StateCode';
                    attrCtx_LVL0_IND2.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default';
                    attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode';
                    attrCtx_LVL0_IND2.contextStrings = [];
                    {
                        attrCtx_LVL0_IND2.contextStrings.push('Product_Resolved_default/hasAttributes/StateCode');
                    }
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND2);
                const attrCtx_LVL0_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.type = 'attributeDefinition';
                    attrCtx_LVL0_IND3.name = 'StateCode_display';
                    attrCtx_LVL0_IND3.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default';
                    attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display';
                    attrCtx_LVL0_IND3.contextStrings = [];
                    {
                        attrCtx_LVL0_IND3.contextStrings.push('Product_Resolved_default/hasAttributes/StateCode_display');
                    }
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND3);
                const attrCtx_LVL0_IND4: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.type = 'attributeDefinition';
                    attrCtx_LVL0_IND4.name = 'StatusCode';
                    attrCtx_LVL0_IND4.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default';
                    attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode';
                    attrCtx_LVL0_IND4.contextStrings = [];
                    {
                        attrCtx_LVL0_IND4.contextStrings.push('Product_Resolved_default/hasAttributes/StatusCode');
                    }
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND4);
                const attrCtx_LVL0_IND5: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.type = 'attributeDefinition';
                    attrCtx_LVL0_IND5.name = 'StatusCode_display';
                    attrCtx_LVL0_IND5.parent = 'Product_Resolved_default/attributeContext/Product_Resolved_default';
                    attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display';
                    attrCtx_LVL0_IND5.contextStrings = [];
                    {
                        attrCtx_LVL0_IND5.contextStrings.push('Product_Resolved_default/hasAttributes/StatusCode_display');
                    }
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND5);
            }
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.type = 'entity';
                expectedContext_normalized.name = 'Product_Resolved_normalized';
                expectedContext_normalized.definition = 'resolvedFrom/Product';
                expectedContext_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'ID';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID';
                    attrCtx_LVL0_IND1.contextStrings = [];
                    {
                        attrCtx_LVL0_IND1.contextStrings.push('Product_Resolved_normalized/hasAttributes/ID');
                    }
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND1);
                const attrCtx_LVL0_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.type = 'attributeDefinition';
                    attrCtx_LVL0_IND2.name = 'StateCode';
                    attrCtx_LVL0_IND2.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized';
                    attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode';
                    attrCtx_LVL0_IND2.contextStrings = [];
                    {
                        attrCtx_LVL0_IND2.contextStrings.push('Product_Resolved_normalized/hasAttributes/StateCode');
                    }
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND2);
                const attrCtx_LVL0_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.type = 'attributeDefinition';
                    attrCtx_LVL0_IND3.name = 'StateCode_display';
                    attrCtx_LVL0_IND3.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized';
                    attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display';
                    attrCtx_LVL0_IND3.contextStrings = [];
                    {
                        attrCtx_LVL0_IND3.contextStrings.push('Product_Resolved_normalized/hasAttributes/StateCode_display');
                    }
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND3);
                const attrCtx_LVL0_IND4: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.type = 'attributeDefinition';
                    attrCtx_LVL0_IND4.name = 'StatusCode';
                    attrCtx_LVL0_IND4.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized';
                    attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode';
                    attrCtx_LVL0_IND4.contextStrings = [];
                    {
                        attrCtx_LVL0_IND4.contextStrings.push('Product_Resolved_normalized/hasAttributes/StatusCode');
                    }
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND4);
                const attrCtx_LVL0_IND5: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.type = 'attributeDefinition';
                    attrCtx_LVL0_IND5.name = 'StatusCode_display';
                    attrCtx_LVL0_IND5.parent = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized';
                    attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display';
                    attrCtx_LVL0_IND5.contextStrings = [];
                    {
                        attrCtx_LVL0_IND5.contextStrings.push('Product_Resolved_normalized/hasAttributes/StatusCode_display');
                    }
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND5);
            }
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.type = 'entity';
                expectedContext_referenceOnly.name = 'Product_Resolved_referenceOnly';
                expectedContext_referenceOnly.definition = 'resolvedFrom/Product';
                expectedContext_referenceOnly.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'ID';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID';
                    attrCtx_LVL0_IND1.contextStrings = [];
                    {
                        attrCtx_LVL0_IND1.contextStrings.push('Product_Resolved_referenceOnly/hasAttributes/ID');
                    }
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND1);
                const attrCtx_LVL0_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.type = 'attributeDefinition';
                    attrCtx_LVL0_IND2.name = 'StateCode';
                    attrCtx_LVL0_IND2.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly';
                    attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode';
                    attrCtx_LVL0_IND2.contextStrings = [];
                    {
                        attrCtx_LVL0_IND2.contextStrings.push('Product_Resolved_referenceOnly/hasAttributes/StateCode');
                    }
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND2);
                const attrCtx_LVL0_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.type = 'attributeDefinition';
                    attrCtx_LVL0_IND3.name = 'StateCode_display';
                    attrCtx_LVL0_IND3.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly';
                    attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display';
                    attrCtx_LVL0_IND3.contextStrings = [];
                    {
                        attrCtx_LVL0_IND3.contextStrings.push('Product_Resolved_referenceOnly/hasAttributes/StateCode_display');
                    }
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND3);
                const attrCtx_LVL0_IND4: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.type = 'attributeDefinition';
                    attrCtx_LVL0_IND4.name = 'StatusCode';
                    attrCtx_LVL0_IND4.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly';
                    attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode';
                    attrCtx_LVL0_IND4.contextStrings = [];
                    {
                        attrCtx_LVL0_IND4.contextStrings.push('Product_Resolved_referenceOnly/hasAttributes/StatusCode');
                    }
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND4);
                const attrCtx_LVL0_IND5: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.type = 'attributeDefinition';
                    attrCtx_LVL0_IND5.name = 'StatusCode_display';
                    attrCtx_LVL0_IND5.parent = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly';
                    attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display';
                    attrCtx_LVL0_IND5.contextStrings = [];
                    {
                        attrCtx_LVL0_IND5.contextStrings.push('Product_Resolved_referenceOnly/hasAttributes/StatusCode_display');
                    }
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND5);
            }
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_structured.type = 'entity';
                expectedContext_structured.name = 'Product_Resolved_structured';
                expectedContext_structured.definition = 'resolvedFrom/Product';
                expectedContext_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'ID';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID';
                    attrCtx_LVL0_IND1.contextStrings = [];
                    {
                        attrCtx_LVL0_IND1.contextStrings.push('Product_Resolved_structured/hasAttributes/ID');
                    }
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND1);
                const attrCtx_LVL0_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.type = 'attributeDefinition';
                    attrCtx_LVL0_IND2.name = 'StateCode';
                    attrCtx_LVL0_IND2.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured';
                    attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode';
                    attrCtx_LVL0_IND2.contextStrings = [];
                    {
                        attrCtx_LVL0_IND2.contextStrings.push('Product_Resolved_structured/hasAttributes/StateCode');
                    }
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND2);
                const attrCtx_LVL0_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.type = 'attributeDefinition';
                    attrCtx_LVL0_IND3.name = 'StateCode_display';
                    attrCtx_LVL0_IND3.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured';
                    attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display';
                    attrCtx_LVL0_IND3.contextStrings = [];
                    {
                        attrCtx_LVL0_IND3.contextStrings.push('Product_Resolved_structured/hasAttributes/StateCode_display');
                    }
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND3);
                const attrCtx_LVL0_IND4: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.type = 'attributeDefinition';
                    attrCtx_LVL0_IND4.name = 'StatusCode';
                    attrCtx_LVL0_IND4.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured';
                    attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode';
                    attrCtx_LVL0_IND4.contextStrings = [];
                    {
                        attrCtx_LVL0_IND4.contextStrings.push('Product_Resolved_structured/hasAttributes/StatusCode');
                    }
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND4);
                const attrCtx_LVL0_IND5: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.type = 'attributeDefinition';
                    attrCtx_LVL0_IND5.name = 'StatusCode_display';
                    attrCtx_LVL0_IND5.parent = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured';
                    attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display';
                    attrCtx_LVL0_IND5.contextStrings = [];
                    {
                        attrCtx_LVL0_IND5.contextStrings.push('Product_Resolved_structured/hasAttributes/StatusCode_display');
                    }
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND5);
            }
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.type = 'entity';
                expectedContext_normalized_structured.name = 'Product_Resolved_normalized_structured';
                expectedContext_normalized_structured.definition = 'resolvedFrom/Product';
                expectedContext_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'ID';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID';
                    attrCtx_LVL0_IND1.contextStrings = [];
                    {
                        attrCtx_LVL0_IND1.contextStrings.push('Product_Resolved_normalized_structured/hasAttributes/ID');
                    }
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
                const attrCtx_LVL0_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.type = 'attributeDefinition';
                    attrCtx_LVL0_IND2.name = 'StateCode';
                    attrCtx_LVL0_IND2.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured';
                    attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode';
                    attrCtx_LVL0_IND2.contextStrings = [];
                    {
                        attrCtx_LVL0_IND2.contextStrings.push('Product_Resolved_normalized_structured/hasAttributes/StateCode');
                    }
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND2);
                const attrCtx_LVL0_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.type = 'attributeDefinition';
                    attrCtx_LVL0_IND3.name = 'StateCode_display';
                    attrCtx_LVL0_IND3.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured';
                    attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display';
                    attrCtx_LVL0_IND3.contextStrings = [];
                    {
                        attrCtx_LVL0_IND3.contextStrings.push('Product_Resolved_normalized_structured/hasAttributes/StateCode_display');
                    }
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND3);
                const attrCtx_LVL0_IND4: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.type = 'attributeDefinition';
                    attrCtx_LVL0_IND4.name = 'StatusCode';
                    attrCtx_LVL0_IND4.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured';
                    attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode';
                    attrCtx_LVL0_IND4.contextStrings = [];
                    {
                        attrCtx_LVL0_IND4.contextStrings.push('Product_Resolved_normalized_structured/hasAttributes/StatusCode');
                    }
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND4);
                const attrCtx_LVL0_IND5: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.type = 'attributeDefinition';
                    attrCtx_LVL0_IND5.name = 'StatusCode_display';
                    attrCtx_LVL0_IND5.parent = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured';
                    attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display';
                    attrCtx_LVL0_IND5.contextStrings = [];
                    {
                        attrCtx_LVL0_IND5.contextStrings.push('Product_Resolved_normalized_structured/hasAttributes/StatusCode_display');
                    }
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND5);
            }
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.type = 'entity';
                expectedContext_referenceOnly_normalized.name = 'Product_Resolved_referenceOnly_normalized';
                expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/Product';
                expectedContext_referenceOnly_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'ID';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID';
                    attrCtx_LVL0_IND1.contextStrings = [];
                    {
                        attrCtx_LVL0_IND1.contextStrings.push('Product_Resolved_referenceOnly_normalized/hasAttributes/ID');
                    }
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND1);
                const attrCtx_LVL0_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.type = 'attributeDefinition';
                    attrCtx_LVL0_IND2.name = 'StateCode';
                    attrCtx_LVL0_IND2.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode';
                    attrCtx_LVL0_IND2.contextStrings = [];
                    {
                        attrCtx_LVL0_IND2.contextStrings.push('Product_Resolved_referenceOnly_normalized/hasAttributes/StateCode');
                    }
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND2);
                const attrCtx_LVL0_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.type = 'attributeDefinition';
                    attrCtx_LVL0_IND3.name = 'StateCode_display';
                    attrCtx_LVL0_IND3.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display';
                    attrCtx_LVL0_IND3.contextStrings = [];
                    {
                        attrCtx_LVL0_IND3.contextStrings.push('Product_Resolved_referenceOnly_normalized/hasAttributes/StateCode_display');
                    }
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND3);
                const attrCtx_LVL0_IND4: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.type = 'attributeDefinition';
                    attrCtx_LVL0_IND4.name = 'StatusCode';
                    attrCtx_LVL0_IND4.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode';
                    attrCtx_LVL0_IND4.contextStrings = [];
                    {
                        attrCtx_LVL0_IND4.contextStrings.push('Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode');
                    }
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND4);
                const attrCtx_LVL0_IND5: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.type = 'attributeDefinition';
                    attrCtx_LVL0_IND5.name = 'StatusCode_display';
                    attrCtx_LVL0_IND5.parent = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display';
                    attrCtx_LVL0_IND5.contextStrings = [];
                    {
                        attrCtx_LVL0_IND5.contextStrings.push('Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode_display');
                    }
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND5);
            }
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.type = 'entity';
                expectedContext_referenceOnly_structured.name = 'Product_Resolved_referenceOnly_structured';
                expectedContext_referenceOnly_structured.definition = 'resolvedFrom/Product';
                expectedContext_referenceOnly_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'ID';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID';
                    attrCtx_LVL0_IND1.contextStrings = [];
                    {
                        attrCtx_LVL0_IND1.contextStrings.push('Product_Resolved_referenceOnly_structured/hasAttributes/ID');
                    }
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND1);
                const attrCtx_LVL0_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.type = 'attributeDefinition';
                    attrCtx_LVL0_IND2.name = 'StateCode';
                    attrCtx_LVL0_IND2.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode';
                    attrCtx_LVL0_IND2.contextStrings = [];
                    {
                        attrCtx_LVL0_IND2.contextStrings.push('Product_Resolved_referenceOnly_structured/hasAttributes/StateCode');
                    }
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND2);
                const attrCtx_LVL0_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.type = 'attributeDefinition';
                    attrCtx_LVL0_IND3.name = 'StateCode_display';
                    attrCtx_LVL0_IND3.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display';
                    attrCtx_LVL0_IND3.contextStrings = [];
                    {
                        attrCtx_LVL0_IND3.contextStrings.push('Product_Resolved_referenceOnly_structured/hasAttributes/StateCode_display');
                    }
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND3);
                const attrCtx_LVL0_IND4: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.type = 'attributeDefinition';
                    attrCtx_LVL0_IND4.name = 'StatusCode';
                    attrCtx_LVL0_IND4.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode';
                    attrCtx_LVL0_IND4.contextStrings = [];
                    {
                        attrCtx_LVL0_IND4.contextStrings.push('Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode');
                    }
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND4);
                const attrCtx_LVL0_IND5: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.type = 'attributeDefinition';
                    attrCtx_LVL0_IND5.name = 'StatusCode_display';
                    attrCtx_LVL0_IND5.parent = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display';
                    attrCtx_LVL0_IND5.contextStrings = [];
                    {
                        attrCtx_LVL0_IND5.contextStrings.push('Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode_display');
                    }
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND5);
            }
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.type = 'entity';
                expectedContext_referenceOnly_normalized_structured.name = 'Product_Resolved_referenceOnly_normalized_structured';
                expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/Product';
                expectedContext_referenceOnly_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'ID';
                    attrCtx_LVL0_IND1.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Product/hasAttributes/ID';
                    attrCtx_LVL0_IND1.contextStrings = [];
                    {
                        attrCtx_LVL0_IND1.contextStrings.push('Product_Resolved_referenceOnly_normalized_structured/hasAttributes/ID');
                    }
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
                const attrCtx_LVL0_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.type = 'attributeDefinition';
                    attrCtx_LVL0_IND2.name = 'StateCode';
                    attrCtx_LVL0_IND2.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND2.definition = 'resolvedFrom/Product/hasAttributes/StateCode';
                    attrCtx_LVL0_IND2.contextStrings = [];
                    {
                        attrCtx_LVL0_IND2.contextStrings.push('Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StateCode');
                    }
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND2);
                const attrCtx_LVL0_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.type = 'attributeDefinition';
                    attrCtx_LVL0_IND3.name = 'StateCode_display';
                    attrCtx_LVL0_IND3.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND3.definition = 'resolvedFrom/Product/hasAttributes/StateCode_display';
                    attrCtx_LVL0_IND3.contextStrings = [];
                    {
                        attrCtx_LVL0_IND3.contextStrings.push('Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StateCode_display');
                    }
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND3);
                const attrCtx_LVL0_IND4: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.type = 'attributeDefinition';
                    attrCtx_LVL0_IND4.name = 'StatusCode';
                    attrCtx_LVL0_IND4.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND4.definition = 'resolvedFrom/Product/hasAttributes/StatusCode';
                    attrCtx_LVL0_IND4.contextStrings = [];
                    {
                        attrCtx_LVL0_IND4.contextStrings.push('Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode');
                    }
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND4);
                const attrCtx_LVL0_IND5: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.type = 'attributeDefinition';
                    attrCtx_LVL0_IND5.name = 'StatusCode_display';
                    attrCtx_LVL0_IND5.parent = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND5.definition = 'resolvedFrom/Product/hasAttributes/StatusCode_display';
                    attrCtx_LVL0_IND5.contextStrings = [];
                    {
                        attrCtx_LVL0_IND5.contextStrings.push('Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode_display');
                    }
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND5);
            }

            const expected_default: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_default/attributeContext/Product_Resolved_default/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_default/attributeContext/Product_Resolved_default/StateCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StateCode';
                    att.sourceName = 'StateCode';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_default/attributeContext/Product_Resolved_default/StateCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StateCode_display';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_default/attributeContext/Product_Resolved_default/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_default/attributeContext/Product_Resolved_default/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_default.push(att);
            }
            const expected_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StateCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StateCode';
                    att.sourceName = 'StateCode';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StateCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StateCode_display';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_normalized.push(att);
            }
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StateCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StateCode';
                    att.sourceName = 'StateCode';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StateCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StateCode_display';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_referenceOnly.push(att);
            }
            const expected_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/StateCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StateCode';
                    att.sourceName = 'StateCode';
                }
                expected_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/StateCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StateCode_display';
                }
                expected_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_structured/attributeContext/Product_Resolved_structured/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_structured.push(att);
            }
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StateCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StateCode';
                    att.sourceName = 'StateCode';
                }
                expected_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StateCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StateCode_display';
                }
                expected_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_normalized_structured.push(att);
            }
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StateCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StateCode';
                    att.sourceName = 'StateCode';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StateCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StateCode_display';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_referenceOnly_normalized.push(att);
            }
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StateCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StateCode';
                    att.sourceName = 'StateCode';
                }
                expected_referenceOnly_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StateCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StateCode_display';
                }
                expected_referenceOnly_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_referenceOnly_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_referenceOnly_structured.push(att);
            }
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/ID';
                    att.dataFormat = 'Guid';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StateCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StateCode';
                    att.sourceName = 'StateCode';
                }
                expected_referenceOnly_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StateCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StateCode_display';
                }
                expected_referenceOnly_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StatusCode';
                    att.dataFormat = 'Int32';
                    att.name = 'StatusCode';
                    att.sourceName = 'StatusCode';
                }
                expected_referenceOnly_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StatusCode_display';
                    att.dataFormat = 'String';
                    att.name = 'StatusCode_display';
                }
                expected_referenceOnly_normalized_structured.push(att);
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
