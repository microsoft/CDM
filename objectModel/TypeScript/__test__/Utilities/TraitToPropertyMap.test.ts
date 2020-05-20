// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    cdmDataFormat,
    cdmObjectType,
    CdmTypeAttributeDefinition,
    traitToPropertyMap
} from '../../internal';

describe('Utilities.TraitToPropertyMapTests', () => {
    /**
     * Test update and fetch list lookup default value without attributeValue and displayOrder.
     */
    it('TestUpdateAndFetchListLookup', () => {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        const cdmAttribute: CdmTypeAttributeDefinition = new CdmTypeAttributeDefinition(corpus.ctx, 'SomeAttribute');
        const t2pm: traitToPropertyMap = new traitToPropertyMap(cdmAttribute);

        const constantValues = [
            {
                'languageTag': 'en',
                'displayText': 'Fax'
            }
        ];

        t2pm.updatePropertyValue('defaultValue', constantValues);
        const result: Array<Map<string, string>> = t2pm.fetchPropertyValue('defaultValue');

        expect(result.length).toBe(1);
        expect(result[0]['languageTag']).toBe('en');
        expect(result[0]['displayText']).toBe('Fax');
        expect(result[0]['attributeValue']).toBeNull();
        expect(result[0]['displayOrder']).toBeNull();
    });

    /**
     * Test setting and getting of data format
     */
    it('TestDataFormat', () => {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        const att: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'att');

        // Object.keys give 2x the number that is in the enum
        const l: number = Object.keys(cdmDataFormat).length / 2;
        for (let i: number = 0; i < l; i++) {
            att.dataFormat = i;
            expect(att.dataFormat)
                .toBe(i);
        }
    });
});
