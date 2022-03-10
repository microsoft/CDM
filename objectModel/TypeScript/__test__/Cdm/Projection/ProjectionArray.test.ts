// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


import {
    CdmAttributeGroupDefinition,
    CdmCorpusDefinition,
    CdmEntityDefinition,
    CdmTypeAttributeDefinition,
    CdmTraitReference,
} from '../../../internal';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';

/**
 *  Class for testing the array type with a set of foundational operations in a projection
 */
describe('Cdm/Projection/TestProjectionArray', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/ProjectionArrayTest';

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
     * Test Array type on an entity attribute.
     */
     it('TestEntityAttribute', async () => {
        const testName: string = 'TestEntityAttribute';
        const entityName: string = 'ThreeMusketeers';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const nonStructuredResolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ["name", "age", "address"]
        // in non-structured form 
        // Expand 1...3;
        // renameFormat = {m}{o};
        // alterTraits = { has.expansionInfo.list(expansionName: "{a}", ordinal: "{o}", memberAttribute: "{mo}") , "argumentsContainWildcards" : true }
        // addArtifactAttribute : "personCount"
        // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "personCount" , "argumentsContainWildcards" : true }
        expect(nonStructuredResolvedEntity.attributes.length)
            .toEqual(10);
        projectionTestUtils.validateExpansionInfoTrait(nonStructuredResolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition, "name1", 1, "ThreePeople", "name");
        projectionTestUtils.validateExpansionInfoTrait(nonStructuredResolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition, "age1", 1, "ThreePeople", "age");
        projectionTestUtils.validateExpansionInfoTrait(nonStructuredResolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition, "address1", 1, "ThreePeople", "address");
        projectionTestUtils.validateExpansionInfoTrait(nonStructuredResolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition, "name2", 2, "ThreePeople", "name");
        projectionTestUtils.validateExpansionInfoTrait(nonStructuredResolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition, "age2", 2, "ThreePeople", "age");
        projectionTestUtils.validateExpansionInfoTrait(nonStructuredResolvedEntity.attributes.allItems[5] as CdmTypeAttributeDefinition, "address2", 2, "ThreePeople", "address");
        projectionTestUtils.validateExpansionInfoTrait(nonStructuredResolvedEntity.attributes.allItems[6] as CdmTypeAttributeDefinition, "name3", 3, "ThreePeople", "name");
        projectionTestUtils.validateExpansionInfoTrait(nonStructuredResolvedEntity.attributes.allItems[7] as CdmTypeAttributeDefinition, "age3", 3, "ThreePeople", "age");
        projectionTestUtils.validateExpansionInfoTrait(nonStructuredResolvedEntity.attributes.allItems[8] as CdmTypeAttributeDefinition, "address3", 3, "ThreePeople", "address");
        expect((nonStructuredResolvedEntity.attributes.allItems[9] as CdmTypeAttributeDefinition).name)
            .toEqual('personCount');
        expect(nonStructuredResolvedEntity.attributes.allItems[9].appliedTraits.item('indicates.expansionInfo.count'))
            .not.toBeUndefined()
        expect((nonStructuredResolvedEntity.attributes.allItems[9].appliedTraits.item('indicates.expansionInfo.count') as CdmTraitReference).arguments.allItems[0].value)
            .toEqual('ThreePeople');

        // Original set of attributes: ["name", "age", "address"]
        // in structured form 
        // alterTraits = { is.dataFormat.list }
        // addAttributeGroup: favoriteMusketeers
        const structuredResolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'structured' ]);
        expect(structuredResolvedEntity.attributes.length)
            .toEqual(1);
        const attGroupDefinition: CdmAttributeGroupDefinition = projectionTestUtils.validateAttributeGroup(structuredResolvedEntity.attributes, 'favoriteMusketeers');
        expect(attGroupDefinition.exhibitsTraits.item('is.dataFormat.list'))
            .not
            .toBeUndefined();
    });

    /**
     * Test Array type on an type attribute.
     */
    it('TestTypeAttribute', async () => {
        const testName: string = 'TestTypeAttribute';
        const entityName: string = 'Person';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }

        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`);
        const nonStructuredResolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ ]);

        // Original set of attributes: ["Favorite Terms"]
        // in non-structured form 
        // Expand 1...2;
        // renameFormat = Term {o};
        // alterTraits = { has.expansionInfo.list(expansionName: "{a}", ordinal: "{o}") , "argumentsContainWildcards" : true }
        // addArtifactAttribute : "number of favorite terms"
        // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "number of favorite terms" , "argumentsContainWildcards" : true }
        expect(nonStructuredResolvedEntity.attributes.length)
            .toEqual(3);
        expect((nonStructuredResolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('Term 1');
        expect((nonStructuredResolvedEntity.attributes.allItems[1] as CdmTypeAttributeDefinition).name)
            .toEqual('Term 2');
        expect((nonStructuredResolvedEntity.attributes.allItems[2] as CdmTypeAttributeDefinition).name)
            .toEqual('number of favorite terms');
        expect(nonStructuredResolvedEntity.attributes.allItems[2].appliedTraits.item('indicates.expansionInfo.count'))
            .not.toBeUndefined() 
        expect((nonStructuredResolvedEntity.attributes.allItems[2].appliedTraits.item('indicates.expansionInfo.count') as CdmTraitReference).arguments.allItems[0].value)
            .toEqual('Favorite Terms');

        // Original set of attributes: ["Favorite Terms"]
        // in structured form 
        // alterTraits = { is.dataFormat.list }
        const structuredResolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, [ 'structured' ]);
        expect(structuredResolvedEntity.attributes.length)
            .toEqual(1);
        expect((structuredResolvedEntity.attributes.allItems[0] as CdmTypeAttributeDefinition).name)
            .toEqual('Favorite Terms');
        expect(structuredResolvedEntity.attributes.allItems[0].appliedTraits.item('is.dataFormat.list'))
            .not
            .toBeUndefined();
    });
});
