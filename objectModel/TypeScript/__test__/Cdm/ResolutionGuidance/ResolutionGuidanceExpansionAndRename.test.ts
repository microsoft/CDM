// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AttributeContextExpectedValue, AttributeExpectedValue } from '../../Utilities/ObjectValidator';
import { CommonTest } from './CommonTest';

// tslint:disable:max-func-body-length
// tslint:disable:variable-name
describe('Cdm.ResolutionGuidanceExpansionAndRename', () => {
    /**
     * Resolution Guidance Test - Expansion & Rename - Ordinal With AttributeGroupRef
     */
    it('TestExpansionAndRenamedOrdinalWithAttributeGroupRef', async (done) => {
        const testName: string = 'TestExpansionAndRenamedOrdinalWithAttributeGroupRef';
        {
            const entityName: string = 'EmployeeAddresses';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_default.type = 'entity';
                expectedContext_default.name = 'EmployeeAddresses_Resolved_default';
                expectedContext_default.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_default.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Address';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'City';
                                            attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'State';
                                            attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
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
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'generatedRound';
                                    attrCtx_LVL4_IND0.name = '_generatedAttributeRound0';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND0.name = 'EmployeeAddress1City';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress1City');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND1.name = 'EmployeeAddress1State';
                                        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress1State');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'generatedRound';
                                    attrCtx_LVL4_IND1.name = '_generatedAttributeRound1';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND0.name = 'EmployeeAddress2City';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress2City');
                                        }
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND1.name = 'EmployeeAddress2State';
                                        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress2State');
                                        }
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.type = 'entity';
                expectedContext_normalized.name = 'EmployeeAddresses_Resolved_normalized';
                expectedContext_normalized.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Address';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'City';
                                            attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'State';
                                            attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
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
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'generatedRound';
                                    attrCtx_LVL4_IND0.name = '_generatedAttributeRound0';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND0.name = 'EmployeeAddress1City';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress1City');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND1.name = 'EmployeeAddress1State';
                                        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress1State');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'generatedRound';
                                    attrCtx_LVL4_IND1.name = '_generatedAttributeRound1';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND0.name = 'EmployeeAddress2City';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress2City');
                                        }
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND1.name = 'EmployeeAddress2State';
                                        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress2State');
                                        }
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.type = 'entity';
                expectedContext_referenceOnly.name = 'EmployeeAddresses_Resolved_referenceOnly';
                expectedContext_referenceOnly.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_referenceOnly.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Address';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'City';
                                            attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'State';
                                            attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
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
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'generatedRound';
                                    attrCtx_LVL4_IND0.name = '_generatedAttributeRound0';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND0.name = 'EmployeeAddress1City';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress1City');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND1.name = 'EmployeeAddress1State';
                                        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress1State');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'generatedRound';
                                    attrCtx_LVL4_IND1.name = '_generatedAttributeRound1';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND0.name = 'EmployeeAddress2City';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress2City');
                                        }
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND1.name = 'EmployeeAddress2State';
                                        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress2State');
                                        }
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND1);
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
                expectedContext_structured.name = 'EmployeeAddresses_Resolved_structured';
                expectedContext_structured.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Address';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'City';
                                            attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                            attrCtx_LVL6_IND0.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND0.contextStrings.push('EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/City');
                                            }
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'State';
                                            attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                            attrCtx_LVL6_IND1.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND1.contextStrings.push('EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/State');
                                            }
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
                expectedContext_normalized_structured.name = 'EmployeeAddresses_Resolved_normalized_structured';
                expectedContext_normalized_structured.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Address';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'City';
                                            attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                            attrCtx_LVL6_IND0.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND0.contextStrings.push('EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/City');
                                            }
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'State';
                                            attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                            attrCtx_LVL6_IND1.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND1.contextStrings.push('EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/State');
                                            }
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
                expectedContext_referenceOnly_normalized.name = 'EmployeeAddresses_Resolved_referenceOnly_normalized';
                expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_referenceOnly_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Address';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'City';
                                            attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'State';
                                            attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
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
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'generatedRound';
                                    attrCtx_LVL4_IND0.name = '_generatedAttributeRound0';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND0.name = 'EmployeeAddress1City';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress1City');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND1.name = 'EmployeeAddress1State';
                                        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress1State');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'generatedRound';
                                    attrCtx_LVL4_IND1.name = '_generatedAttributeRound1';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND0.name = 'EmployeeAddress2City';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress2City');
                                        }
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                    const attrCtx_LVL5_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.type = 'attributeDefinition';
                                        attrCtx_LVL5_IND1.name = 'EmployeeAddress2State';
                                        attrCtx_LVL5_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                        attrCtx_LVL5_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                        attrCtx_LVL5_IND1.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress2State');
                                        }
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND1);
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
                expectedContext_referenceOnly_structured.name = 'EmployeeAddresses_Resolved_referenceOnly_structured';
                expectedContext_referenceOnly_structured.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_referenceOnly_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Address';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'City';
                                            attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                            attrCtx_LVL6_IND0.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/City');
                                            }
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'State';
                                            attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                            attrCtx_LVL6_IND1.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/State');
                                            }
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
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.type = 'entity';
                expectedContext_referenceOnly_normalized_structured.name = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured';
                expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_referenceOnly_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Address';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'City';
                                            attrCtx_LVL6_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City';
                                            attrCtx_LVL6_IND0.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/City');
                                            }
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'State';
                                            attrCtx_LVL6_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State';
                                            attrCtx_LVL6_IND1.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/State');
                                            }
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
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND1);
            }

            const expected_default: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City';
                    att.dataFormat = 'String';
                    att.displayName = 'City';
                    att.name = 'EmployeeAddress1City';
                    att.sourceName = 'City';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State';
                    att.dataFormat = 'String';
                    att.displayName = 'State';
                    att.name = 'EmployeeAddress1State';
                    att.sourceName = 'State';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City';
                    att.dataFormat = 'String';
                    att.displayName = 'City';
                    att.name = 'EmployeeAddress2City';
                    att.sourceName = 'City';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State';
                    att.dataFormat = 'String';
                    att.displayName = 'State';
                    att.name = 'EmployeeAddress2State';
                    att.sourceName = 'State';
                }
                expected_default.push(att);
            }
            const expected_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City';
                    att.dataFormat = 'String';
                    att.displayName = 'City';
                    att.name = 'EmployeeAddress1City';
                    att.sourceName = 'City';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State';
                    att.dataFormat = 'String';
                    att.displayName = 'State';
                    att.name = 'EmployeeAddress1State';
                    att.sourceName = 'State';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City';
                    att.dataFormat = 'String';
                    att.displayName = 'City';
                    att.name = 'EmployeeAddress2City';
                    att.sourceName = 'City';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State';
                    att.dataFormat = 'String';
                    att.displayName = 'State';
                    att.name = 'EmployeeAddress2State';
                    att.sourceName = 'State';
                }
                expected_normalized.push(att);
            }
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City';
                    att.dataFormat = 'String';
                    att.displayName = 'City';
                    att.name = 'EmployeeAddress1City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State';
                    att.dataFormat = 'String';
                    att.displayName = 'State';
                    att.name = 'EmployeeAddress1State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City';
                    att.dataFormat = 'String';
                    att.displayName = 'City';
                    att.name = 'EmployeeAddress2City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State';
                    att.dataFormat = 'String';
                    att.displayName = 'State';
                    att.name = 'EmployeeAddress2State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly.push(att);
            }
            const expected_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'EmployeeAddress';
                    attribGroupRef.attributeContext = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City';
                        att.dataFormat = 'String';
                        att.name = 'City';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State';
                        att.dataFormat = 'String';
                        att.name = 'State';
                    }
                    attribGroupRef.members.push(att);
                    expected_structured.push(attribGroupRef);
                }
            }
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'EmployeeAddress';
                    attribGroupRef.attributeContext = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City';
                        att.dataFormat = 'String';
                        att.name = 'City';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State';
                        att.dataFormat = 'String';
                        att.name = 'State';
                    }
                    attribGroupRef.members.push(att);
                    expected_normalized_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City';
                    att.dataFormat = 'String';
                    att.displayName = 'City';
                    att.name = 'EmployeeAddress1City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State';
                    att.dataFormat = 'String';
                    att.displayName = 'State';
                    att.name = 'EmployeeAddress1State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City';
                    att.dataFormat = 'String';
                    att.displayName = 'City';
                    att.name = 'EmployeeAddress2City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State';
                    att.dataFormat = 'String';
                    att.displayName = 'State';
                    att.name = 'EmployeeAddress2State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly_normalized.push(att);
            }
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'EmployeeAddress';
                    attribGroupRef.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City';
                        att.dataFormat = 'String';
                        att.name = 'City';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State';
                        att.dataFormat = 'String';
                        att.name = 'State';
                    }
                    attribGroupRef.members.push(att);
                    expected_referenceOnly_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'EmployeeAddress';
                    attribGroupRef.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City';
                        att.dataFormat = 'String';
                        att.name = 'City';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State';
                        att.dataFormat = 'String';
                        att.name = 'State';
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
     * Resolution Guidance Test - Expansion & Rename - Ordinal 2 to 3 and AddCount
     */
    it('TestExpansionAndRenamedOrdinal23AndAddCount', async (done) => {
        const testName: string = 'TestExpansionAndRenamedOrdinal23AndAddCount';
        {
            const entityName: string = 'EmployeeAddresses';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_default.type = 'entity';
                expectedContext_default.name = 'EmployeeAddresses_Resolved_default';
                expectedContext_default.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_default.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'EmployeeAddress';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Address';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'entityReferenceExtends';
                            attrCtx_LVL2_IND0.name = 'extends';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'CdmEntity';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address/extends';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'City';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City';
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'State';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State';
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'addedAttributeExpansionTotal';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress__AddressCount';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress__AddressCount');
                            }
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'generatedRound';
                            attrCtx_LVL2_IND1.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_2_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_2_City');
                                }
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_2_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_2_State');
                                }
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'generatedRound';
                            attrCtx_LVL2_IND2.name = '_generatedAttributeRound1';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND2.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_3_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_3_City');
                                }
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_3_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_3_State');
                                }
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND2);
                        const attrCtx_LVL2_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND3.type = 'generatedRound';
                            attrCtx_LVL2_IND3.name = '_generatedAttributeRound2';
                            attrCtx_LVL2_IND3.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND3.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_4_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_4_City');
                                }
                            }
                            attrCtx_LVL2_IND3.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_4_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_4_State');
                                }
                            }
                            attrCtx_LVL2_IND3.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND3);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.type = 'entity';
                expectedContext_normalized.name = 'EmployeeAddresses_Resolved_normalized';
                expectedContext_normalized.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'EmployeeAddress';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Address';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'entityReferenceExtends';
                            attrCtx_LVL2_IND0.name = 'extends';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'CdmEntity';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address/extends';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'City';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City';
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'State';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State';
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'addedAttributeExpansionTotal';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress__AddressCount';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress__AddressCount');
                            }
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'generatedRound';
                            attrCtx_LVL2_IND1.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_2_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_2_City');
                                }
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_2_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_2_State');
                                }
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'generatedRound';
                            attrCtx_LVL2_IND2.name = '_generatedAttributeRound1';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND2.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_3_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_3_City');
                                }
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_3_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_3_State');
                                }
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND2);
                        const attrCtx_LVL2_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND3.type = 'generatedRound';
                            attrCtx_LVL2_IND3.name = '_generatedAttributeRound2';
                            attrCtx_LVL2_IND3.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND3.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_4_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_4_City');
                                }
                            }
                            attrCtx_LVL2_IND3.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_4_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_4_State');
                                }
                            }
                            attrCtx_LVL2_IND3.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND3);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.type = 'entity';
                expectedContext_referenceOnly.name = 'EmployeeAddresses_Resolved_referenceOnly';
                expectedContext_referenceOnly.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_referenceOnly.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'EmployeeAddress';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Address';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'entityReferenceExtends';
                            attrCtx_LVL2_IND0.name = 'extends';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'CdmEntity';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address/extends';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'City';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City';
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'State';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State';
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'addedAttributeExpansionTotal';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress__AddressCount';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress__AddressCount');
                            }
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'generatedRound';
                            attrCtx_LVL2_IND1.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_2_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_2_City');
                                }
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_2_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_2_State');
                                }
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'generatedRound';
                            attrCtx_LVL2_IND2.name = '_generatedAttributeRound1';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND2.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_3_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_3_City');
                                }
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_3_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_3_State');
                                }
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND2);
                        const attrCtx_LVL2_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND3.type = 'generatedRound';
                            attrCtx_LVL2_IND3.name = '_generatedAttributeRound2';
                            attrCtx_LVL2_IND3.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND3.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_4_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_4_City');
                                }
                            }
                            attrCtx_LVL2_IND3.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_4_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_4_State');
                                }
                            }
                            attrCtx_LVL2_IND3.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND3);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_structured.type = 'entity';
                expectedContext_structured.name = 'EmployeeAddresses_Resolved_structured';
                expectedContext_structured.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'EmployeeAddress';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Address';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'entityReferenceExtends';
                            attrCtx_LVL2_IND0.name = 'extends';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'CdmEntity';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/extends';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'City';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/City');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'State';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/State');
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
                expectedContext_normalized_structured.name = 'EmployeeAddresses_Resolved_normalized_structured';
                expectedContext_normalized_structured.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'EmployeeAddress';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Address';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'entityReferenceExtends';
                            attrCtx_LVL2_IND0.name = 'extends';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'CdmEntity';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/extends';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'City';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/City');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'State';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/State');
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
                expectedContext_referenceOnly_normalized.name = 'EmployeeAddresses_Resolved_referenceOnly_normalized';
                expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_referenceOnly_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'EmployeeAddress';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Address';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'entityReferenceExtends';
                            attrCtx_LVL2_IND0.name = 'extends';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'CdmEntity';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address/extends';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'City';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City';
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'State';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State';
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND0);
                    const attrCtx_LVL1_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.type = 'generatedSet';
                        attrCtx_LVL1_IND1.name = '_generatedAttributeSet';
                        attrCtx_LVL1_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress';
                        attrCtx_LVL1_IND1.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'addedAttributeExpansionTotal';
                            attrCtx_LVL2_IND0.name = 'EmployeeAddress__AddressCount';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress__AddressCount');
                            }
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'generatedRound';
                            attrCtx_LVL2_IND1.name = '_generatedAttributeRound0';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND1.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_2_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_2_City');
                                }
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_2_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_2_State');
                                }
                            }
                            attrCtx_LVL2_IND1.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'generatedRound';
                            attrCtx_LVL2_IND2.name = '_generatedAttributeRound1';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND2.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_3_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_3_City');
                                }
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_3_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_3_State');
                                }
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND2);
                        const attrCtx_LVL2_IND3: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND3.type = 'generatedRound';
                            attrCtx_LVL2_IND3.name = '_generatedAttributeRound2';
                            attrCtx_LVL2_IND3.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet';
                            attrCtx_LVL2_IND3.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'attributeDefinition';
                                attrCtx_LVL3_IND0.name = 'EmployeeAddress_4_City';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Address/hasAttributes/City';
                                attrCtx_LVL3_IND0.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND0.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_4_City');
                                }
                            }
                            attrCtx_LVL2_IND3.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'attributeDefinition';
                                attrCtx_LVL3_IND1.name = 'EmployeeAddress_4_State';
                                attrCtx_LVL3_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2';
                                attrCtx_LVL3_IND1.definition = 'resolvedFrom/Address/hasAttributes/State';
                                attrCtx_LVL3_IND1.contextStrings = [];
                                {
                                    attrCtx_LVL3_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_4_State');
                                }
                            }
                            attrCtx_LVL2_IND3.contexts.push(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.contexts.push(attrCtx_LVL2_IND3);
                    }
                    attrCtx_LVL0_IND1.contexts.push(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND1);
            }
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.type = 'entity';
                expectedContext_referenceOnly_structured.name = 'EmployeeAddresses_Resolved_referenceOnly_structured';
                expectedContext_referenceOnly_structured.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_referenceOnly_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'EmployeeAddress';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Address';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'entityReferenceExtends';
                            attrCtx_LVL2_IND0.name = 'extends';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'CdmEntity';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/extends';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'City';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/City');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'State';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/State');
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
                expectedContext_referenceOnly_normalized_structured.name = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured';
                expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/EmployeeAddresses';
                expectedContext_referenceOnly_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'EmployeeAddress';
                    attrCtx_LVL0_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'Address';
                        attrCtx_LVL1_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Address';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'entityReferenceExtends';
                            attrCtx_LVL2_IND0.name = 'extends';
                            attrCtx_LVL2_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'CdmEntity';
                                attrCtx_LVL3_IND0.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/extends';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/CdmEntity';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'City';
                            attrCtx_LVL2_IND1.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Address/hasAttributes/City';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/City');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'State';
                            attrCtx_LVL2_IND2.parent = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Address/hasAttributes/State';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/State');
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
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount';
                    att.dataFormat = 'Int32';
                    att.name = 'EmployeeAddress__AddressCount';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_2_City';
                    att.sourceName = 'City';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_2_State';
                    att.sourceName = 'State';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_3_City';
                    att.sourceName = 'City';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_3_State';
                    att.sourceName = 'State';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_4_City';
                    att.sourceName = 'City';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_4_State';
                    att.sourceName = 'State';
                }
                expected_default.push(att);
            }
            const expected_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount';
                    att.dataFormat = 'Int32';
                    att.name = 'EmployeeAddress__AddressCount';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_2_City';
                    att.sourceName = 'City';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_2_State';
                    att.sourceName = 'State';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_3_City';
                    att.sourceName = 'City';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_3_State';
                    att.sourceName = 'State';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_4_City';
                    att.sourceName = 'City';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_4_State';
                    att.sourceName = 'State';
                }
                expected_normalized.push(att);
            }
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount';
                    att.dataFormat = 'Int32';
                    att.name = 'EmployeeAddress__AddressCount';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_2_City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_2_State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_3_City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_3_State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_4_City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_4_State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly.push(att);
            }
            const expected_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'EmployeeAddress';
                    attribGroupRef.attributeContext = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/City';
                        att.dataFormat = 'String';
                        att.name = 'City';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/State';
                        att.dataFormat = 'String';
                        att.name = 'State';
                    }
                    attribGroupRef.members.push(att);
                    expected_structured.push(attribGroupRef);
                }
            }
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'EmployeeAddress';
                    attribGroupRef.attributeContext = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/City';
                        att.dataFormat = 'String';
                        att.name = 'City';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/State';
                        att.dataFormat = 'String';
                        att.name = 'State';
                    }
                    attribGroupRef.members.push(att);
                    expected_normalized_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount';
                    att.dataFormat = 'Int32';
                    att.name = 'EmployeeAddress__AddressCount';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_2_City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_2_State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_3_City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_3_State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_4_City';
                    att.sourceName = 'City';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State';
                    att.dataFormat = 'String';
                    att.name = 'EmployeeAddress_4_State';
                    att.sourceName = 'State';
                }
                expected_referenceOnly_normalized.push(att);
            }
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'EmployeeAddress';
                    attribGroupRef.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/City';
                        att.dataFormat = 'String';
                        att.name = 'City';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/State';
                        att.dataFormat = 'String';
                        att.name = 'State';
                    }
                    attribGroupRef.members.push(att);
                    expected_referenceOnly_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];
            {
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'EmployeeAddress';
                    attribGroupRef.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress';
                    attribGroupRef.members = [];
                    let att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/City';
                        att.dataFormat = 'String';
                        att.name = 'City';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/State';
                        att.dataFormat = 'String';
                        att.name = 'State';
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
