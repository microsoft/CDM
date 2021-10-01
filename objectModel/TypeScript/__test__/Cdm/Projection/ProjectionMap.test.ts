// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


import { cdmObjectType } from '../../../Enums/cdmObjectType';
import {
    CdmAttributeGroupDefinition,
    CdmCorpusDefinition,
    CdmEntityDefinition,
    CdmTypeAttributeDefinition,
    CdmTraitReference,
    CdmAttributeGroupReference,
} from '../../../internal';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 *  Class for testing the mao type with a set of foundational operations in a projection
 */
describe('Cdm/Projection/TestProjectionMap', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/ProjectionMapTest';

    /**
     * All possible combinations of the different resolution directives
     */
    const resOptsCombinations: string[][] = [
        [],
        ['referenceOnly'],
        ['normalized'],
        ['structured'],
        ['referenceOnly', 'normalized'],
        ['referenceOnly', 'structured'],
        ['normalized', 'structured'],
        ['referenceOnly', 'normalized', 'structured']
    ];

    /**
     * Test Map type on an entity attribute.
     */
     it('TestEntityAttribute', async () => {
        const testName: string = 'TestEntityAttribute';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const nonStructuredResolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ["name", "age", "address"]
        // in non-structured form 
        // addArtifactAttribute : { "key" , "insertAtTop": true }
        // Expand 1...3;
        // renameAttributes = { {a}_{o}_key, apply to "key" }
        // renameAttributes = { {a}_{m}_{o}_value, apply to "name", "age", "address" }
        // alterTraits = { indicates.expansionInfo.mapKey(expansionName: "{a}", ordinal: "{o}") , apply to "key" , "argumentsContainWildcards" : true }
        // alterTraits = { has.expansionInfo.mapValue(expansionName: "{a}", ordinal: "{o}", memberAttribute: "{mo}") , apply to "name", "age", "address"  , "argumentsContainWildcards" : true }
        // addArtifactAttribute : "personCount"
        // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "personCount" , "argumentsContainWildcards" : true }
        expect(nonStructuredResolvedEntity.attributes.length)
            .toEqual(13);
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, 'key_1_key', 1, 'ThreePeople', undefined, true);
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition, "ThreePeople_name_1_value", 1, "ThreePeople", "name");
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition, "ThreePeople_age_1_value", 1, "ThreePeople", "age");
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition, "ThreePeople_address_1_value", 1, "ThreePeople", "address");
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition, 'key_2_key', 2, 'ThreePeople', undefined, true);
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition, "ThreePeople_name_2_value", 2, "ThreePeople", "name");
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition, "ThreePeople_age_2_value", 2, "ThreePeople", "age");
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition, "ThreePeople_address_2_value", 2, "ThreePeople", "address");
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition, 'key_3_key', 3, 'ThreePeople', undefined, true);
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition, "ThreePeople_name_3_value", 3, "ThreePeople", "name");
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[10] as CdmTypeAttributeDefinition, "ThreePeople_age_3_value", 3, "ThreePeople", "age");
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[11] as CdmTypeAttributeDefinition, "ThreePeople_address_3_value", 3, "ThreePeople", "address");
        expect((nonStructuredResolvedEntity.attributes.allItems[12] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount');
        expect(nonStructuredResolvedEntity.attributes.allItems[12].appliedTraits.allItems[1].namedReference)
            .toEqual('indicates.expansionInfo.count');  
        expect((nonStructuredResolvedEntity.attributes.allItems[12].appliedTraits.allItems[1] as CdmTraitReference).arguments.allItems[0].value)
            .toEqual('ThreePeople');

        // Original set of attributes: ["name", "age", "address"]
        // in structured form 
        // addAttributeGroup: favorite people
        // alterTraits = { is.dataFormat.mapValue }
        // addArtifactAttribute : { "favorite People Key" (with trait "is.dataFormat.mapKey") , "insertAtTop": true }
        // addAttributeGroup: favorite People Group
        // alterTraits = { is.dataFormat.map }
        const structuredResolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'structured' ]);
        expect(structuredResolvedEntity.attributes.length)
            .toEqual(1);
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(structuredResolvedEntity.attributes, 'favorite People Group');
        expect(attGroupDefinition.exhibitsTraits.item('is.dataFormat.map'))
            .not
            .toBeUndefined();
        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('favorite People Key');          
        expect(attGroupDefinition.members.allItems[0].appliedTraits.item('is.dataFormat.mapKey'))
            .not
            .toBeUndefined();       
        expect(attGroupDefinition.members.allItems[1].objectType)
            .toEqual(cdmObjectType.attributeGroupRef);     
        const innerAttGroupRef: CdmAttributeGroupReference = attGroupDefinition.members.allItems[1] as CdmAttributeGroupReference;
        expect(innerAttGroupRef.explicitReference)
            .not
            .toBeUndefined();
        const innerAttGroupDefinition: CdmAttributeGroupDefinition = innerAttGroupRef.explicitReference as CdmAttributeGroupDefinition;
        expect(innerAttGroupDefinition.attributeGroupName)
            .toEqual('favorite people');
        expect(innerAttGroupDefinition.exhibitsTraits.item('is.dataFormat.mapValue'));
            
    });

    /**
     * Test Map type on an type attribute.
     */
    it('TestTypeAttribute', async () => {
        const testName: string = 'TestTypeAttribute';
        const entityName: string = 'Person';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const nonStructuredResolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: [ "FavoriteTerms" ]
        // in non-structured form
        // addArtifactAttribute : { "Term key" , "insertAtTop": true }
        // Expand 1...2;
        // renameAttributes = { {m}_{o}_key, apply to "Term key" }
        // renameAttributes = { {m}_{o}_value, apply to "FavoriteTerms" }
        // alterTraits = { indicates.expansionInfo.mapKey(expansionName: "{a}", ordinal: "{o}") , apply to "Term key" , "argumentsContainWildcards" : true }
        // alterTraits = { has.expansionInfo.mapValue(expansionName: "{a}", ordinal: "{o}") , apply to "FavoriteTerms"  , "argumentsContainWildcards" : true }
        // addArtifactAttribute : number of favorite terms"
        // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "number of favorite terms" , "argumentsContainWildcards" : true }
        expect(nonStructuredResolvedEntity.attributes.length)
            .toEqual(5);
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, 'Term key_1_key', 1, 'FavoriteTerms', undefined, true);
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition, "FavoriteTerms_1_value", 1, "FavoriteTerms");
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition, "Term key_2_key", 2, "FavoriteTerms", undefined, true);
        validateAttributeTrait(nonStructuredResolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition, "FavoriteTerms_2_value", 2, "FavoriteTerms");
        expect((nonStructuredResolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition).name)
            .toEqual('number of favorite terms');
        expect(nonStructuredResolvedEntity.attributes.allItems[4].appliedTraits.allItems[1].namedReference)
            .toEqual('indicates.expansionInfo.count');  
        expect((nonStructuredResolvedEntity.attributes.allItems[4].appliedTraits.allItems[1] as CdmTraitReference).arguments.allItems[0].value)
            .toEqual('FavoriteTerms');

        // Original set of attributes: [ "FavoriteTerms" ]
        // in structured form 
        // alterTraits = { is.dataFormat.mapValue }
        // addArtifactAttribute : { "Favorite Terms Key" (with trait "is.dataFormat.mapKey")  , "insertAtTop": true }
        // addAttributeGroup: favorite Term Group
        // alterTraits = { is.dataFormat.map }
        const structuredResolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'structured' ]);
        expect(structuredResolvedEntity.attributes.length)
            .toEqual(1);
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(structuredResolvedEntity.attributes, 'favorite Term Group');
        expect(attGroupDefinition.exhibitsTraits.item('is.dataFormat.map'))
            .not
            .toBeUndefined();

        expect((attGroupDefinition.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('Favorite Terms Key');
        expect(attGroupDefinition.members.allItems[0].appliedTraits.item('is.dataFormat.mapKey'))
            .not
            .toBeUndefined();
        expect((attGroupDefinition.members.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('FavoriteTerms');
        expect(attGroupDefinition.members.allItems[1].appliedTraits.item('is.dataFormat.mapValue'))
            .not
            .toBeUndefined();
    });

    /**
     * Validates trait for map's value or key.
     * @param attribute The type attribute
     * @param expectedAttrName The expected attribute name
     * @param ordinal The expected ordinal
     * @param expansionName The expected expansion name
     * @param memberAttribute The expected member attribute name
     * @param isKey Whether this is a key
     * @internal
     */
    function validateAttributeTrait(attribute: CdmTypeAttributeDefinition, expectedAttrName: string, ordinal: number, expansionName: string, memberAttribute?: string, isKey?: boolean) {
        expect(attribute.name)
            .toEqual(expectedAttrName);
        const trait: CdmTraitReference = attribute.appliedTraits.item(isKey ? 'indicates.expansionInfo.mapKey' : 'has.expansionInfo.mapValue') as CdmTraitReference;
        expect(trait)
            .not    
            .toBeUndefined();
        expect(trait.arguments.fetchValue('expansionName'))
            .toEqual(expansionName);
        expect(trait.arguments.fetchValue('ordinal'))
            .toEqual(ordinal.toString());
        if (memberAttribute !== undefined) {
            expect(trait.arguments.fetchValue('memberAttribute'))
                .toEqual(memberAttribute);            
        }
    }
});
