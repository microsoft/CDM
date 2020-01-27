import {
    CdmCorpusDefinition,
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
        expect(result[0]['attributeValue']).toBeUndefined();
        expect(result[0]['displayOrder']).toBeUndefined();
    });
});
