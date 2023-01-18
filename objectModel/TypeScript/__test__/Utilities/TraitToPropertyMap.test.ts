// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { testHelper } from '../testHelper';
import {
    CdmCorpusDefinition,
    cdmDataFormat,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    CdmTypeAttributeDefinition,
    traitToPropertyMap
} from '../../internal';

describe('Utilities.TraitToPropertyMapTests', () => {
    const testsSubpath: string = 'Utilities/TraitToPropertyMap';

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

    /**
     * Test getting primary key.
     */
    it('TestFetchPrimaryKey', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, "TestFetchPrimaryKey");
        const doc: CdmDocumentDefinition = await corpus.fetchObjectAsync<CdmDocumentDefinition>("Account.cdm.json");

        if (doc == undefined) {
            throw new Error("Unable to load manifest account.cdm.json. Please inspect error log for additional details.");
        }

        const entity: CdmEntityDefinition = doc.definitions.allItems[0] as CdmEntityDefinition;
        try {
            const pk: string = entity.primaryKey;
        } catch (e) {
            throw new Error("Exception occur while reading primary key for entity account." + e);
        }

    });
});
