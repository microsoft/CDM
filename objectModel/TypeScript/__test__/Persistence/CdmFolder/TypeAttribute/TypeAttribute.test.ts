// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmAttributeGroupDefinition } from '../../../../Cdm/CdmAttributeGroupDefinition';
import { CdmAttributeGroupReference } from '../../../../Cdm/CdmAttributeGroupReference';
import { CdmEntityDefinition } from '../../../../Cdm/CdmEntityDefinition';
import { CdmTraitReference } from '../../../../Cdm/CdmTraitReference';
import { cdmDataFormat } from '../../../../Enums/cdmDataFormat';
import {
    CdmAttributeReference,
    CdmConstantEntityDefinition,
    CdmCorpusDefinition,
    CdmEntityReference,
    cdmObjectType,
    cdmStatusLevel,
    CdmTypeAttributeDefinition,
    resolveContext
} from '../../../../internal';
import { PersistenceLayer } from '../../../../Persistence';
import { EntityPersistence } from '../../../../Persistence/CdmFolder/EntityPersistence';
import { TypeAttributePersistence } from '../../../../Persistence/CdmFolder/TypeAttributePersistence';
import { Argument, Entity, TraitReference, TypeAttribute } from '../../../../Persistence/CdmFolder/types';
import { LocalAdapter } from '../../../../Storage';
import { testHelper } from '../../../testHelper';

// tslint:disable-next-line: max-func-body-length
describe('Persistence.CdmFolder.TypeAttribute', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Persistence/CdmFolder/TypeAttribute';

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

        const cdmTypeAttributeDefinition: CdmTypeAttributeDefinition = TypeAttributePersistence.fromData(
            new resolveContext(new CdmCorpusDefinition(), undefined), input as TypeAttribute, undefined);

        const result: TypeAttribute = PersistenceLayer.toData<CdmTypeAttributeDefinition, TypeAttribute>(
            cdmTypeAttributeDefinition,
            undefined,
            undefined,
            PersistenceLayer.cdmFolder
        );

        expect(result)
            .toBeTruthy();

        expect(result.defaultValue)
            .toEqual(input.defaultValue);
    });

    /**
     * Testing that 'isPrimaryKey' property value is correct when reading from an unresolved and resolved entity schema.
     */
    it('TestReadingIsPrimaryKey', async (done) => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestReadingIsPrimaryKey');
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.setEventCallback(() => { }, cdmStatusLevel.warning);
        corpus.storage.mount('local', new LocalAdapter(testInputPath));
        corpus.storage.defaultNamespace = 'local';

        // Read from an unresolved entity schema.
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TeamMembership.cdm.json/TeamMembership');
        const attributeGroupRef: CdmAttributeGroupReference = entity.attributes.allItems[0] as CdmAttributeGroupReference;
        const attributeGroup: CdmAttributeGroupDefinition = attributeGroupRef.explicitReference as CdmAttributeGroupDefinition;
        const typeAttribute: CdmTypeAttributeDefinition = attributeGroup.members.allItems[0] as CdmTypeAttributeDefinition;

        expect(typeAttribute.isPrimaryKey)
            .toBeTruthy();

        // Check that the trait 'is.identifiedBy' is created with the correct argument.
        const isIdentifiedBy1: CdmTraitReference = typeAttribute.appliedTraits.allItems[1];
        expect(isIdentifiedBy1.namedReference).toEqual('is.identifiedBy');
        expect(isIdentifiedBy1.arguments.allItems[0].value).toEqual('TeamMembership/(resolvedAttributes)/teamMembershipId');

        // Read from a resolved entity schema.
        const resolvedEntity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TeamMembership_Resolved.cdm.json/TeamMembership');
        const resolvedTypeAttribute: CdmTypeAttributeDefinition = resolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition;

        expect(resolvedTypeAttribute.isPrimaryKey)
            .toBeTruthy();

        // Check that the trait 'is.identifiedBy' is created with the correct argument.
        const isIdentifiedBy2: CdmTraitReference = resolvedTypeAttribute.appliedTraits.allItems[6];
        expect(isIdentifiedBy2.namedReference)
            .toEqual('is.identifiedBy');

        const argumentValue: CdmAttributeReference = isIdentifiedBy2.arguments.allItems[0].value as CdmAttributeReference;
        expect(argumentValue.namedReference)
            .toEqual('TeamMembership/(resolvedAttributes)/teamMembershipId');

        done();
    });

    /**
     * Testing that 'isPrimaryKey' property is set to true when 'purpose' = 'identifiedBy'.
     */
    it('TestReadingIsPrimaryKeyConstructedFromPurpose', async (done) => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestReadingIsPrimaryKeyConstructedFromPurpose');
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TeamMembership.cdm.json/TeamMembership');
        const attributeGroupRef: CdmAttributeGroupReference = entity.attributes.allItems[0] as CdmAttributeGroupReference;
        const attributeGroup: CdmAttributeGroupDefinition = attributeGroupRef.explicitReference as CdmAttributeGroupDefinition;
        const typeAttribute: CdmTypeAttributeDefinition = attributeGroup.members.allItems[0] as CdmTypeAttributeDefinition;

        expect(typeAttribute.purpose.namedReference)
            .toEqual('identifiedBy');
        expect(typeAttribute.isPrimaryKey)
            .toBeTruthy();

        done();
    });

    /**
     * Testing fromData and toData correctly handles all properties
     */
    it('TestPropertyPersistence', async (done) => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestPropertyPersistence');
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testInputPath);
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/PropertyEntity.cdm.json/PropertyEntity');

        // test loading properties
        const attribute: CdmTypeAttributeDefinition = entity.attributes.allItems[0] as CdmTypeAttributeDefinition;
        expect(attribute.isReadOnly)
            .toBeTruthy();
        expect(attribute.isNullable)
            .toBeTruthy();
        expect(attribute.sourceName)
            .toBe('propertyAttribute');
        expect(attribute.description)
            .toBe('Attribute that has all properties set.');
        expect(attribute.displayName)
            .toBe('Property Attribute');
        expect(attribute.sourceOrdering)
            .toBe(1);
        expect(attribute.valueConstrainedToList)
            .toBeTruthy();
        expect(attribute.maximumLength)
            .toBe(10);
        expect(attribute.maximumValue)
            .toBe('20');
        expect(attribute.minimumValue)
            .toBe('1');
        expect(attribute.dataFormat)
            .toBe(cdmDataFormat.string);
        expect(attribute.defaultValue[0].displayText)
            .toBe('Default');

        // test loading negative value properties
        const negativeAttribute: CdmTypeAttributeDefinition = entity.attributes.allItems[1] as CdmTypeAttributeDefinition;
        expect(negativeAttribute.isReadOnly)
            .toBeFalsy();
        expect(negativeAttribute.isNullable)
            .toBeFalsy();
        expect(negativeAttribute.sourceName)
            .toBeUndefined();
        expect(negativeAttribute.description)
            .toBeUndefined();
        expect(negativeAttribute.displayName)
            .toBeUndefined();
        expect(negativeAttribute.sourceOrdering)
            .toBe(0);
        expect(negativeAttribute.valueConstrainedToList)
            .toBeFalsy();
        expect(negativeAttribute.maximumLength)
            .toBe(0);
        expect(negativeAttribute.maximumValue)
            .toBe('0');
        expect(negativeAttribute.minimumValue)
            .toBe('0');
        expect(negativeAttribute.dataFormat)
            .toBe(cdmDataFormat.unknown);
        expect(negativeAttribute.defaultValue[0].displayText)
            .toBe('');

        // test loading values with wrongs types in file
        const wrongTypesAttribute: CdmTypeAttributeDefinition = entity.attributes.allItems[2] as CdmTypeAttributeDefinition;
        expect(wrongTypesAttribute.isReadOnly)
            .toBeTruthy();
        expect(wrongTypesAttribute.isNullable)
            .toBeTruthy();
        expect(wrongTypesAttribute.sourceOrdering)
            .toBe(1);
        expect(wrongTypesAttribute.valueConstrainedToList)
            .toBeFalsy();
        expect(wrongTypesAttribute.maximumLength)
            .toBe(0);
        expect(wrongTypesAttribute.maximumValue)
            .toBe('20');
        expect(wrongTypesAttribute.minimumValue)
            .toBe('0');

        // test loading values with wrong types that cannot be properly converted
        const invalidValuesAttribute: CdmTypeAttributeDefinition = entity.attributes.allItems[3] as CdmTypeAttributeDefinition;
        expect(invalidValuesAttribute.isReadOnly)
            .toBeFalsy();
        expect(invalidValuesAttribute.maximumLength)
            .toBeUndefined();

        const entityData: Entity = EntityPersistence.toData(entity, undefined, undefined);

        // test toData for properties
        const attributeData: TypeAttribute = entityData.hasAttributes[0] as TypeAttribute;
        expect(attributeData.isReadOnly)
            .toBeTruthy();
        expect(attributeData.isNullable)
            .toBeTruthy();
        expect(attributeData.sourceName)
            .toBe('propertyAttribute');
        expect(attributeData.description)
            .toBe('Attribute that has all properties set.');
        expect(attributeData.displayName)
            .toBe('Property Attribute');
        expect(attributeData.sourceOrdering)
            .toBe(1);
        expect(attributeData.valueConstrainedToList)
            .toBeTruthy();
        expect(attributeData.maximumLength)
            .toBe(10);
        expect(attributeData.maximumValue)
            .toBe('20');
        expect(attributeData.minimumValue)
            .toBe('1');
        expect(attributeData.dataFormat)
            .toBe('String');
        expect(attributeData.defaultValue[0].displayText)
            .toBe('Default');

        // test toData for negative value properties
        const negativeAttributeData: TypeAttribute = entityData.hasAttributes[1] as TypeAttribute;
        expect(negativeAttributeData.isReadOnly)
            .toBeFalsy();
        expect(negativeAttributeData.isNullable)
            .toBeFalsy();
        expect(negativeAttributeData.sourceName)
            .toBeUndefined();
        expect(negativeAttributeData.description)
            .toBeUndefined();
        expect(negativeAttributeData.displayName)
            .toBeUndefined();
        expect(negativeAttributeData.sourceOrdering)
            .toBeUndefined();
        expect(negativeAttributeData.valueConstrainedToList)
            .toBeUndefined();
        expect(negativeAttributeData.maximumLength)
            .toBe(0);
        expect(negativeAttributeData.maximumValue)
            .toBe('0');
        expect(negativeAttributeData.minimumValue)
            .toBe('0');
        expect(negativeAttributeData.dataFormat)
            .toBeUndefined();
        expect(negativeAttributeData.defaultValue[0].displayText)
            .toBe('');

        // test toData for values with wrong types in file
        const wrongTypesAttributeData: TypeAttribute = entityData.hasAttributes[2] as TypeAttribute;
        expect(wrongTypesAttributeData.isReadOnly)
            .toBeTruthy();
        expect(wrongTypesAttributeData.isNullable)
            .toBeTruthy();
        expect(wrongTypesAttributeData.sourceOrdering)
            .toBe(1);
        expect(wrongTypesAttributeData.valueConstrainedToList)
            .toBeUndefined();
        expect(wrongTypesAttributeData.maximumLength)
            .toBe(0);
        expect(wrongTypesAttributeData.maximumValue)
            .toBe('20');
        expect(wrongTypesAttributeData.minimumValue)
            .toBe('0');

        // test toData with wrong types that cannot be properly converted
        const invalidValuesAttributeData: TypeAttribute = entityData.hasAttributes[3] as TypeAttribute;
        expect(invalidValuesAttributeData.isReadOnly)
            .toBeUndefined();
        expect(invalidValuesAttributeData.maximumLength)
            .toBeUndefined();
        done();
    });

    /**
     * Testing that 'is.localized.describedAs' trait with a table of three entries (en, rs and cn)
     *  is fully preserved when running CdmFolder TypeAttributePersistence ToData.
     */
    it('TestCdmFolderToDataTypeAttribute', async (done) => {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.setEventCallback(() => { }, cdmStatusLevel.warning);
        corpus.storage.mount('local', new LocalAdapter('C:\\Root\\Path'));
        corpus.storage.defaultNamespace = 'local';

        const cdmTypeAttributeDefinition : CdmTypeAttributeDefinition =
            corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, 'TestSavingTraitAttribute', false);

        const englishConstantsList : string[] = [ 'en', 'Some description in English language' ];
        const serbianConstantsList : string[] = [ 'sr', 'Opis na srpskom jeziku' ];
        const chineseConstantsList : string[] =  [ 'cn', '一些中文描述' ];
        const listOfConstLists : string[][ ] = [ englishConstantsList, serbianConstantsList, chineseConstantsList ];

        const constEntDef : CdmConstantEntityDefinition =
            corpus.MakeObject<CdmConstantEntityDefinition>(cdmObjectType.constantEntityDef, 'localizedDescriptions', false);
        constEntDef.constantValues = listOfConstLists;
        constEntDef.entityShape = corpus.MakeRef<CdmEntityReference>(cdmObjectType.entityRef, 'localizedTable', true);
        const traitReference2 : CdmTraitReference = 
            corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, 'is.localized.describedAs', false);
        traitReference2.arguments.push(
            'localizedDisplayText', corpus.MakeRef<CdmEntityReference>(cdmObjectType.entityRef, constEntDef, true));
        cdmTypeAttributeDefinition.appliedTraits.push(traitReference2);

        const result: TypeAttribute = PersistenceLayer.toData<CdmTypeAttributeDefinition, TypeAttribute>(
            cdmTypeAttributeDefinition,
            undefined,
            undefined,
            PersistenceLayer.cdmFolder);

        expect(result)
            .toBeTruthy();

        const argument : Argument = (result.appliedTraits[0] as TraitReference).arguments[0] as Argument;
        const constantValues : string[][] =
            (((argument.value as CdmEntityReference).explicitReference) as CdmConstantEntityDefinition).constantValues;
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
