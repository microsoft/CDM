import {
    CdmCorpusDefinition,
    cdmObjectType,
    CdmTypeAttributeDefinition,
    resolveContext
} from '../../../../internal';
import { fromData } from '../../../../Persistence';

describe('Persistence.CdmFolder.TypeAttribute', () => {
    it('TestNonNullDefaultValueAttribute', () => {
        const theList = [{
            languageTag: 'en',
            displayText: 'Preferred Customer',
            attributeValue: '1',
            displayOrder: '0'
        },
        {
            languageTag: 'en',
            displayText: 'Standard',
            attributeValue: '2',
            displayOrder: '1'
        }];
        const input = {
            defaultValue: theList
        };

        const result: CdmTypeAttributeDefinition = fromData<CdmTypeAttributeDefinition>(
            new resolveContext(new CdmCorpusDefinition(), undefined),
            input,
            cdmObjectType.typeAttributeDef,
            'CdmFolder'
        );

        expect(result)
            .toBeTruthy();

        expect(result.defaultValue)
            .toEqual(input.defaultValue);
    });
});
