// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmTraitReference } from '../../../Cdm/CdmTraitReference';
import {
    CdmConstantEntityDefinition,
    CdmCorpusDefinition,
    CdmEntityReference,
    cdmObjectType,
    CdmTypeAttributeDefinition
} from '../../../internal';
import { PersistenceLayer } from '../../../Persistence';
import { Argument, ConstantEntity, EntityReferenceDefinition, TraitReference } from '../../../Persistence/CdmFolder/types';
import { Attribute } from '../../../Persistence/ModelJson/types';
import { LocalAdapter } from '../../../Storage';

// tslint:disable-next-line: max-func-body-length
describe('Persistence.CdmFolder.TypeAttribute', () => {
    /**
     * Testing that 'is.localized.describedAs' trait with a table of three entries (en, rs and cn)
     *  is fully preserved when running ModelJson TypeAttributePersistence ToData.
     */
    it('TestModelJsonToDataTypeAttribute', async (done) => {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.storage.mount('local', new LocalAdapter('C:\\Root\\Path'));
        corpus.storage.defaultNamespace = 'local';

        const cdmTypeAttributeDefinition: CdmTypeAttributeDefinition =
            corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'TestSavingTraitAttribute', false);

        const englishConstantsList: string[] = ['en', 'Some description in English language'];
        const serbianConstantsList: string[] = ['sr', 'Opis na srpskom jeziku'];
        const chineseConstantsList: string[] = ['cn', '一些中文描述'];
        const listOfConstLists: string[][] = [englishConstantsList, serbianConstantsList, chineseConstantsList];

        const constEntDef: CdmConstantEntityDefinition =
            corpus.MakeObject<CdmConstantEntityDefinition>(cdmObjectType.constantEntityDef, 'localizedDescriptions', false);
        constEntDef.constantValues = listOfConstLists;
        constEntDef.entityShape = corpus.MakeRef<CdmEntityReference>(cdmObjectType.entityRef, 'localizedTable', true);
        const traitReference2: CdmTraitReference =
            corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, 'is.localized.describedAs', false);
        traitReference2.arguments.push(
            'localizedDisplayText', corpus.MakeRef<CdmEntityReference>(cdmObjectType.entityRef, constEntDef, true));
        cdmTypeAttributeDefinition.appliedTraits.push(traitReference2);

        // tslint:disable-next-line: await-promise
        const result: Attribute = await PersistenceLayer.toData<CdmTypeAttributeDefinition, Attribute>(
            cdmTypeAttributeDefinition,
            undefined,
            undefined,
            PersistenceLayer.modelJson);

        expect(result['cdm:traits'])
            .toBeTruthy();

        const argument: Argument = (result['cdm:traits'][0] as TraitReference).arguments[0] as Argument;
        const constantValues: string[][] = ((argument.value as EntityReferenceDefinition).entityReference as ConstantEntity).constantValues;
        expect(constantValues[0][0])
            .toBe('en');
        expect(constantValues[0][1])
            .toBe('Some description in English language');
        expect(constantValues[1][0])
            .toBe('sr');
        expect(constantValues[1][1])
            .toBe('Opis na srpskom jeziku');
        expect(constantValues[2][0])
            .toBe('cn');
        expect(constantValues[2][1])
            .toBe('一些中文描述');
        done();
    });
});
