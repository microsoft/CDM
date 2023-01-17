// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AttributeContextExpectedValue, AttributeExpectedValue } from '../../Utilities/ObjectValidator';
import { CommonTest } from './CommonTest';

// tslint:disable:max-func-body-length
// tslint:disable:variable-name
// tslint:disable:no-shadowed-variable
describe('Cdm.ResolutionGuidanceCardinality', () => {
    /**
     * Resolution Guidance Test - One:One Cardinality
     */
    it('TestForeignKeyOneToOneCardinality', async () => {
        const testName: string = 'TestForeignKeyOneToOneCardinality';
        {
            const entityName: string = 'Person';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();

            const expected_default: AttributeExpectedValue[] = [];
            const expected_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            const expected_structured: AttributeExpectedValue[] = [];
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];

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
        {
            const entityName: string = 'PersonContact';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();

            const expected_default: AttributeExpectedValue[] = [];
            const expected_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            const expected_structured: AttributeExpectedValue[] = [];
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];

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
    });

    /**
     * Resolution Guidance Test - Many:Many Cardinality
     */
    it('TestForeignKeyManyToManyCardinality', async () => {
        const testName: string = 'TestForeignKeyManyToManyCardinality';
        {
            const entityName: string = 'Customer';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();

            const expected_default: AttributeExpectedValue[] = [];
            const expected_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            const expected_structured: AttributeExpectedValue[] = [];
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];

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
        {
            const entityName: string = 'Product';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();

            const expected_default: AttributeExpectedValue[] = [];
            const expected_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            const expected_structured: AttributeExpectedValue[] = [];
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];

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
        {
            const entityName: string = 'Sales';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();

            const expected_default: AttributeExpectedValue[] = [];
            const expected_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            const expected_structured: AttributeExpectedValue[] = [];
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];

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
    });

    /**
     * Resolution Guidance Test - One:Many Cardinality
     */
    it('TestForeignKeyOneToManyCardinality', async () => {
        const testName: string = 'TestForeignKeyOneToManyCardinality';
        {
            const entityName: string = 'Team';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            const expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue = new AttributeContextExpectedValue();

            const expected_default: AttributeExpectedValue[] = [];
            const expected_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            const expected_structured: AttributeExpectedValue[] = [];
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];

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
        {
            const entityName: string = 'Employee';

            const expectedContext_default: AttributeContextExpectedValue = new AttributeContextExpectedValue();
            {
                expectedContext_default.type = 'entity';
                expectedContext_default.name = 'Employee_Resolved_default';
                expectedContext_default.definition = 'resolvedFrom/Employee';
                expectedContext_default.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_default.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Employee_Resolved_default/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'FullName';
                            attrCtx_LVL2_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Employee_Resolved_default/hasAttributes/FullName');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'TeamID';
                            attrCtx_LVL2_IND2.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID';
                            attrCtx_LVL2_IND2.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Team';
                                attrCtx_LVL3_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'ID';
                                            attrCtx_LVL6_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'Name';
                                            attrCtx_LVL6_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'generatedSet';
                                attrCtx_LVL3_IND1.name = '_generatedAttributeSet';
                                attrCtx_LVL3_IND1.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'addedAttributeExpansionTotal';
                                    attrCtx_LVL4_IND0.name = 'TeamIDTeamCount';
                                    attrCtx_LVL4_IND0.parent = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID/resolutionGuidance/countAttribute/TeamCount';
                                    attrCtx_LVL4_IND0.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND0.contextStrings.push('Employee_Resolved_default/hasAttributes/TeamIDTeamCount');
                                    }
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND1);
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
                expectedContext_normalized.name = 'Employee_Resolved_normalized';
                expectedContext_normalized.definition = 'resolvedFrom/Employee';
                expectedContext_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'TeamID';
                            attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Team';
                                attrCtx_LVL3_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'ID';
                                            attrCtx_LVL6_IND0.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'Name';
                                            attrCtx_LVL6_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name';
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
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'ID';
                            attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Employee_Resolved_normalized/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'FullName';
                            attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Employee_Resolved_normalized/hasAttributes/FullName');
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
                expectedContext_referenceOnly.name = 'Employee_Resolved_referenceOnly';
                expectedContext_referenceOnly.definition = 'resolvedFrom/Employee';
                expectedContext_referenceOnly.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Employee_Resolved_referenceOnly/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'FullName';
                            attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Employee_Resolved_referenceOnly/hasAttributes/FullName');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'TeamID';
                            attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID';
                            attrCtx_LVL2_IND2.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Team';
                                attrCtx_LVL3_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team';
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'generatedSet';
                                attrCtx_LVL3_IND1.name = '_generatedAttributeSet';
                                attrCtx_LVL3_IND1.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'addedAttributeExpansionTotal';
                                    attrCtx_LVL4_IND0.name = 'TeamIDTeamCount';
                                    attrCtx_LVL4_IND0.parent = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID/resolutionGuidance/countAttribute/TeamCount';
                                    attrCtx_LVL4_IND0.contextStrings = [];
                                    {
                                        attrCtx_LVL4_IND0.contextStrings.push('Employee_Resolved_referenceOnly/hasAttributes/TeamIDTeamCount');
                                    }
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND1);
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
                expectedContext_structured.name = 'Employee_Resolved_structured';
                expectedContext_structured.definition = 'resolvedFrom/Employee';
                expectedContext_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Employee_Resolved_structured/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'FullName';
                            attrCtx_LVL2_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Employee_Resolved_structured/hasAttributes/FullName');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'TeamID';
                            attrCtx_LVL2_IND2.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID';
                            attrCtx_LVL2_IND2.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Team';
                                attrCtx_LVL3_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'ID';
                                            attrCtx_LVL6_IND0.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID';
                                            attrCtx_LVL6_IND0.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND0.contextStrings.push('Employee_Resolved_structured/hasAttributes/TeamID/members/ID');
                                            }
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'Name';
                                            attrCtx_LVL6_IND1.parent = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name';
                                            attrCtx_LVL6_IND1.contextStrings = [];
                                            {
                                                attrCtx_LVL6_IND1.contextStrings.push('Employee_Resolved_structured/hasAttributes/TeamID/members/Name');
                                            }
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND0);
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
                expectedContext_normalized_structured.name = 'Employee_Resolved_normalized_structured';
                expectedContext_normalized_structured.definition = 'resolvedFrom/Employee';
                expectedContext_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'TeamID';
                            attrCtx_LVL2_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Team';
                                attrCtx_LVL3_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team';
                                attrCtx_LVL3_IND0.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'entityReferenceExtends';
                                    attrCtx_LVL4_IND0.name = 'extends';
                                    attrCtx_LVL4_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'entity';
                                        attrCtx_LVL5_IND0.name = 'CdmEntity';
                                        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/CdmEntity';
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.contexts.push(attrCtx_LVL4_IND0);
                                const attrCtx_LVL4_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.type = 'attributeDefinition';
                                    attrCtx_LVL4_IND1.name = 'attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team';
                                    attrCtx_LVL4_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope';
                                    attrCtx_LVL4_IND1.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'attributeGroup';
                                        attrCtx_LVL5_IND0.name = 'attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope';
                                        attrCtx_LVL5_IND0.contexts = [];
                                        const attrCtx_LVL6_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND0.name = 'ID';
                                            attrCtx_LVL6_IND0.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND0.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID';
                                        }
                                        attrCtx_LVL5_IND0.contexts.push(attrCtx_LVL6_IND0);
                                        const attrCtx_LVL6_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.type = 'attributeDefinition';
                                            attrCtx_LVL6_IND1.name = 'Name';
                                            attrCtx_LVL6_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope';
                                            attrCtx_LVL6_IND1.definition = 'resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name';
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
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'ID';
                            attrCtx_LVL2_IND1.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Employee_Resolved_normalized_structured/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'FullName';
                            attrCtx_LVL2_IND2.parent = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Employee_Resolved_normalized_structured/hasAttributes/FullName');
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
                expectedContext_referenceOnly_normalized.name = 'Employee_Resolved_referenceOnly_normalized';
                expectedContext_referenceOnly_normalized.definition = 'resolvedFrom/Employee';
                expectedContext_referenceOnly_normalized.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'TeamID';
                            attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Team';
                                attrCtx_LVL3_IND0.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'ID';
                            attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Employee_Resolved_referenceOnly_normalized/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'FullName';
                            attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Employee_Resolved_referenceOnly_normalized/hasAttributes/FullName');
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
                expectedContext_referenceOnly_structured.name = 'Employee_Resolved_referenceOnly_structured';
                expectedContext_referenceOnly_structured.definition = 'resolvedFrom/Employee';
                expectedContext_referenceOnly_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'ID';
                            attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND0.contextStrings = [];
                            {
                                attrCtx_LVL2_IND0.contextStrings.push('Employee_Resolved_referenceOnly_structured/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'FullName';
                            attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Employee_Resolved_referenceOnly_structured/hasAttributes/FullName');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'TeamID';
                            attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID';
                            attrCtx_LVL2_IND2.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Team';
                                attrCtx_LVL3_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team';
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND0);
                            const attrCtx_LVL3_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.type = 'generatedSet';
                                attrCtx_LVL3_IND1.name = '_generatedAttributeSet';
                                attrCtx_LVL3_IND1.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND1.contexts = [];
                                const attrCtx_LVL4_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.type = 'generatedRound';
                                    attrCtx_LVL4_IND0.name = '_generatedAttributeRound0';
                                    attrCtx_LVL4_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet';
                                    attrCtx_LVL4_IND0.contexts = [];
                                    const attrCtx_LVL5_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.type = 'addedAttributeIdentity';
                                        attrCtx_LVL5_IND0.name = '_foreignKey';
                                        attrCtx_LVL5_IND0.parent = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/_generatedAttributeRound0';
                                        attrCtx_LVL5_IND0.contextStrings = [];
                                        {
                                            attrCtx_LVL5_IND0.contextStrings.push('Employee_Resolved_referenceOnly_structured/hasAttributes/TeamID/members/TeamID');
                                        }
                                    }
                                    attrCtx_LVL4_IND0.contexts.push(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.contexts.push(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND2.contexts.push(attrCtx_LVL3_IND1);
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
                expectedContext_referenceOnly_normalized_structured.name = 'Employee_Resolved_referenceOnly_normalized_structured';
                expectedContext_referenceOnly_normalized_structured.definition = 'resolvedFrom/Employee';
                expectedContext_referenceOnly_normalized_structured.contexts = [];
                const attrCtx_LVL0_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.type = 'entityReferenceExtends';
                    attrCtx_LVL0_IND0.name = 'extends';
                    attrCtx_LVL0_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND0.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'entity';
                        attrCtx_LVL1_IND0.name = 'CdmEntity';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/extends';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/CdmEntity';
                    }
                    attrCtx_LVL0_IND0.contexts.push(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.contexts.push(attrCtx_LVL0_IND0);
                const attrCtx_LVL0_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.type = 'attributeDefinition';
                    attrCtx_LVL0_IND1.name = 'attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured';
                    attrCtx_LVL0_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                    attrCtx_LVL0_IND1.contexts = [];
                    const attrCtx_LVL1_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.type = 'attributeGroup';
                        attrCtx_LVL1_IND0.name = 'attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope';
                        attrCtx_LVL1_IND0.contexts = [];
                        const attrCtx_LVL2_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.type = 'attributeDefinition';
                            attrCtx_LVL2_IND0.name = 'TeamID';
                            attrCtx_LVL2_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND0.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID';
                            attrCtx_LVL2_IND0.contexts = [];
                            const attrCtx_LVL3_IND0: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.type = 'entity';
                                attrCtx_LVL3_IND0.name = 'Team';
                                attrCtx_LVL3_IND0.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                                attrCtx_LVL3_IND0.definition = 'resolvedFrom/Team';
                            }
                            attrCtx_LVL2_IND0.contexts.push(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND0);
                        const attrCtx_LVL2_IND1: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.type = 'attributeDefinition';
                            attrCtx_LVL2_IND1.name = 'ID';
                            attrCtx_LVL2_IND1.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND1.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID';
                            attrCtx_LVL2_IND1.contextStrings = [];
                            {
                                attrCtx_LVL2_IND1.contextStrings.push('Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/ID');
                            }
                        }
                        attrCtx_LVL1_IND0.contexts.push(attrCtx_LVL2_IND1);
                        const attrCtx_LVL2_IND2: AttributeContextExpectedValue = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.type = 'attributeDefinition';
                            attrCtx_LVL2_IND2.name = 'FullName';
                            attrCtx_LVL2_IND2.parent = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope';
                            attrCtx_LVL2_IND2.definition = 'resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName';
                            attrCtx_LVL2_IND2.contextStrings = [];
                            {
                                attrCtx_LVL2_IND2.contextStrings.push('Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/FullName');
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
                    att.attributeContext = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.displayName = 'ID';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName';
                    att.dataFormat = 'String';
                    att.displayName = 'FullName';
                    att.name = 'FullName';
                    att.sourceName = 'FullName';
                }
                expected_default.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/TeamIDTeamCount';
                    att.dataFormat = 'Int32';
                    att.name = 'TeamIDTeamCount';
                }
                expected_default.push(att);
            }
            const expected_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.displayName = 'ID';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName';
                    att.dataFormat = 'String';
                    att.displayName = 'FullName';
                    att.name = 'FullName';
                    att.sourceName = 'FullName';
                }
                expected_normalized.push(att);
            }
            const expected_referenceOnly: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.displayName = 'ID';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName';
                    att.dataFormat = 'String';
                    att.displayName = 'FullName';
                    att.name = 'FullName';
                    att.sourceName = 'FullName';
                }
                expected_referenceOnly.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/TeamIDTeamCount';
                    att.dataFormat = 'Int32';
                    att.name = 'TeamIDTeamCount';
                }
                expected_referenceOnly.push(att);
            }
            const expected_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.displayName = 'ID';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName';
                    att.dataFormat = 'String';
                    att.displayName = 'FullName';
                    att.name = 'FullName';
                    att.sourceName = 'FullName';
                }
                expected_structured.push(att);
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'TeamID';
                    attribGroupRef.attributeContext = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                    attribGroupRef.members = [];
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                        att.dataFormat = 'Guid';
                        att.name = 'ID';
                    }
                    attribGroupRef.members.push(att);
                    att = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope/Name';
                        att.dataFormat = 'String';
                        att.name = 'Name';
                    }
                    attribGroupRef.members.push(att);
                    expected_structured.push(attribGroupRef);
                }
            }
            const expected_normalized_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.displayName = 'ID';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName';
                    att.dataFormat = 'String';
                    att.displayName = 'FullName';
                    att.name = 'FullName';
                    att.sourceName = 'FullName';
                }
                expected_normalized_structured.push(att);
            }
            const expected_referenceOnly_normalized: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.displayName = 'ID';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly_normalized.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName';
                    att.dataFormat = 'String';
                    att.displayName = 'FullName';
                    att.name = 'FullName';
                    att.sourceName = 'FullName';
                }
                expected_referenceOnly_normalized.push(att);
            }
            const expected_referenceOnly_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.displayName = 'ID';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName';
                    att.dataFormat = 'String';
                    att.displayName = 'FullName';
                    att.name = 'FullName';
                    att.sourceName = 'FullName';
                }
                expected_referenceOnly_structured.push(att);
                const attribGroupRef: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    attribGroupRef.attributeGroupName = 'TeamID';
                    attribGroupRef.attributeContext = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID';
                    attribGroupRef.members = [];
                    const att: AttributeExpectedValue = new AttributeExpectedValue();
                    {
                        att.attributeContext = 'Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey';
                        att.dataFormat = 'Guid';
                        att.description = '';
                        att.displayName = 'TeamID';
                        att.name = 'TeamID';
                        att.sourceName = 'TeamID';
                    }
                    attribGroupRef.members.push(att);
                    expected_referenceOnly_structured.push(attribGroupRef);
                }
            }
            const expected_referenceOnly_normalized_structured: AttributeExpectedValue[] = [];
            {
                let att: AttributeExpectedValue = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID';
                    att.dataFormat = 'Guid';
                    att.displayName = 'ID';
                    att.isPrimaryKey = true;
                    att.name = 'ID';
                    att.sourceName = 'ID';
                }
                expected_referenceOnly_normalized_structured.push(att);
                att = new AttributeExpectedValue();
                {
                    att.attributeContext = 'Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName';
                    att.dataFormat = 'String';
                    att.displayName = 'FullName';
                    att.name = 'FullName';
                    att.sourceName = 'FullName';
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
    });
});
