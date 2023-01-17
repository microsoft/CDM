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
    it('TestAddInSupportOf', async () => {
        const testName: string = 'TestAddInSupportOf';
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
    });

    /**
     * Resolution Guidance Test - AddInSupportOf with IsCorrelatedWith
     */
    it('TestAddInSupportOfWithIsCorrelatedWith', async () => {
        const testName: string = 'TestAddInSupportOfWithIsCorrelatedWith';
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
    });
});
