// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CardinalitySettings, CdmCorpusDefinition, cdmStatusLevel, CdmTypeAttributeDefinition, cdmObjectType } from '../../../internal';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 * Unit test for CardinalitySetting functions
 */
describe('Cdm/Projection/CardinalitySettingUnitTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestCardinalitySetting';

    /**
     * Unit test for CardinalitySetting.IsMinimumValid
     */
    it('TestMinimum', () => {
        const testName: string = 'TestMinimum';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (message.indexOf('CardinalitySettings | Invalid minimum cardinality -1.') === -1) {
                fail(`Some unexpected failure - ${message}!`);
            }
        }, cdmStatusLevel.warning);

        // Create Dummy Type Attribute
        const attribute: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, "dummyAttribute", false);
        attribute.cardinality = new CardinalitySettings(attribute);
        attribute.cardinality.minimum = '-1';
    });

    /**
     * Unit test for CardinalitySetting.IsMaximumValid
     */
    it('TestMaximum', () => {
        const testName: string = 'TestMaximum';

        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (message.indexOf('CardinalitySettings | Invalid maximum cardinality Abc.') === -1) {
                fail(`Some unexpected failure - ${message}!`);
            }
        }, cdmStatusLevel.warning);

        // Create Dummy Type Attribute
        const attribute: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, "dummyAttribute", false);
        attribute.cardinality = new CardinalitySettings(attribute);
        attribute.cardinality.maximum = 'Abc';
    });
});
