
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ProjectionMapTest {
    /**
     * All possible combinations of the different resolution directives
     */
    private static List<List<String>> resOptsCombinations = new ArrayList<>(
            Arrays.asList(new ArrayList<>(Arrays.asList()), new ArrayList<>(Arrays.asList("referenceOnly")),
                    new ArrayList<>(Arrays.asList("normalized")), new ArrayList<>(Arrays.asList("structured")),
                    new ArrayList<>(Arrays.asList("referenceOnly", "normalized")),
                    new ArrayList<>(Arrays.asList("referenceOnly", "structured")),
                    new ArrayList<>(Arrays.asList("normalized", "structured")),
                    new ArrayList<>(Arrays.asList("referenceOnly", "normalized", "structured"))));

    /**
     * The path between TestDataPath and TestName
     */
    private static final String TESTS_SUBPATH = new File(new File(new File("Cdm"), "Projection"), "ProjectionMapTest").toString();

    /**
     * Test Map type on an entity attribute.
     */
    @Test
    public void testEntityAttribute() throws InterruptedException {
        String testName = "testEntityAttribute";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition nonStructuredResolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();

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
        Assert.assertEquals(nonStructuredResolvedEntity.getAttributes().getCount(), 13);
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(0), "key_1_key", 1, "ThreePeople", null, true);
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(1), "ThreePeople_name_1_value", 1, "ThreePeople", "name");
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(2), "ThreePeople_age_1_value", 1, "ThreePeople", "age");
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(3), "ThreePeople_address_1_value", 1, "ThreePeople", "address");
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(4), "key_2_key", 2, "ThreePeople", null, true);
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(5), "ThreePeople_name_2_value", 2, "ThreePeople", "name");
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(6), "ThreePeople_age_2_value", 2, "ThreePeople", "age");
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(7), "ThreePeople_address_2_value", 2, "ThreePeople", "address");
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(8), "key_3_key", 3, "ThreePeople", null, true);
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(9), "ThreePeople_name_3_value", 3, "ThreePeople", "name");
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(10), "ThreePeople_age_3_value", 3, "ThreePeople", "age");
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(11), "ThreePeople_address_3_value", 3, "ThreePeople", "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(12)).getName(), "personCount");
        Assert.assertEquals(nonStructuredResolvedEntity.getAttributes().get(12).getAppliedTraits().get(1).getNamedReference(), "indicates.expansionInfo.count");
        Assert.assertEquals(((CdmTraitReference)nonStructuredResolvedEntity.getAttributes().get(12).getAppliedTraits().get(1)).getArguments().get(0).getValue(), "ThreePeople");

        // Original set of attributes: ["name", "age", "address"]
        // in structured form
        // addAttributeGroup: favorite people
        // alterTraits = { is.dataFormat.mapValue }
        // addArtifactAttribute : { "favorite People Key" (with trait "is.dataFormat.mapKey") , "insertAtTop": true }
        // addAttributeGroup: favorite People Group
        // alterTraits = { is.dataFormat.map }
        CdmEntityDefinition structuredResolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList( "structured" ))).join();
        Assert.assertEquals(structuredResolvedEntity.getAttributes().getCount(), 1);
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(structuredResolvedEntity.getAttributes(), "favorite People Group");
        Assert.assertNotNull(attGroupDefinition.getExhibitsTraits().item("is.dataFormat.map"));

        Assert.assertEquals(((CdmTypeAttributeDefinition)attGroupDefinition.getMembers().get(0)).getName(), "favorite People Key");
        Assert.assertNotNull(attGroupDefinition.getMembers().get(0).getAppliedTraits().item("is.dataFormat.mapKey"));
        Assert.assertEquals(CdmObjectType.AttributeGroupRef, attGroupDefinition.getMembers().get(1).getObjectType());
        CdmAttributeGroupReference innerAttGroupRef = (CdmAttributeGroupReference)attGroupDefinition.getMembers().get(1);
        Assert.assertNotNull(innerAttGroupRef.getExplicitReference());
        CdmAttributeGroupDefinition innerAttGroupDefinition = (CdmAttributeGroupDefinition)innerAttGroupRef.getExplicitReference();
        Assert.assertEquals("favorite people", innerAttGroupDefinition.getAttributeGroupName());
        Assert.assertNotNull( innerAttGroupDefinition.getExhibitsTraits().item("is.dataFormat.mapValue"));
    }

    /**
     * Test Map type on a type attribute.
     */
    @Test
    public void testTypeAttribute() throws InterruptedException {
        String testName = "testTypeAttribute";
        String entityName = "Person";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition nonStructuredResolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();

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
        Assert.assertEquals(nonStructuredResolvedEntity.getAttributes().getCount(), 5);
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(0), "Term key_1_key", 1, "FavoriteTerms", null, true);
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(1), "FavoriteTerms_1_value", 1, "FavoriteTerms", null);
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(2), "Term key_2_key", 2, "FavoriteTerms", null, true);
        validateAttributeTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(3), "FavoriteTerms_2_value", 2, "FavoriteTerms", null);
        Assert.assertEquals(((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(4)).getName(), "number of favorite terms");
        Assert.assertEquals(nonStructuredResolvedEntity.getAttributes().get(4).getAppliedTraits().get(1).getNamedReference(), "indicates.expansionInfo.count");
        Assert.assertEquals(((CdmTraitReference)nonStructuredResolvedEntity.getAttributes().get(4).getAppliedTraits().get(1)).getArguments().get(0).getValue(), "FavoriteTerms");

        // Original set of attributes: [ "FavoriteTerms" ]
        // in structured form
        // alterTraits = { is.dataFormat.mapValue }
        // addArtifactAttribute : { "Favorite Terms Key" (with trait "is.dataFormat.mapKey")  , "insertAtTop": true }
        // addAttributeGroup: favorite Term Group
        // alterTraits = { is.dataFormat.map }
        CdmEntityDefinition structuredResolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("structured"))).join();
        Assert.assertEquals(structuredResolvedEntity.getAttributes().getCount(), 1);
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(structuredResolvedEntity.getAttributes(), "favorite Term Group");
        Assert.assertNotNull(attGroupDefinition.getExhibitsTraits().item("is.dataFormat.map"));
        Assert.assertEquals(((CdmTypeAttributeDefinition)attGroupDefinition.getMembers().get(0)).getName(), "Favorite Terms Key");
        Assert.assertNotNull(attGroupDefinition.getMembers().get(0).getAppliedTraits().item("is.dataFormat.mapKey"));
        Assert.assertEquals(((CdmTypeAttributeDefinition)attGroupDefinition.getMembers().get(1)).getName(), "FavoriteTerms");
        Assert.assertNotNull(attGroupDefinition.getMembers().get(1).getAppliedTraits().item("is.dataFormat.mapValue"));
    }

    private void validateAttributeTrait(CdmTypeAttributeDefinition attribute, String expectedAttrName, int ordinal, String expansionName, String memberAttribute) {
        this.validateAttributeTrait(attribute, expectedAttrName, ordinal, expansionName, memberAttribute, false);
    }

    private void validateAttributeTrait(CdmTypeAttributeDefinition attribute, String expectedAttrName, int ordinal, String expansionName, String memberAttribute, boolean isKey) {
        Assert.assertEquals(expectedAttrName, attribute.getName());
        CdmTraitReference trait = (CdmTraitReference)attribute.getAppliedTraits().item(isKey ? "indicates.expansionInfo.mapKey" : "has.expansionInfo.mapValue");
        Assert.assertNotNull(trait);
        Assert.assertEquals(trait.getArguments().fetchValue("expansionName"), expansionName);
        Assert.assertEquals(trait.getArguments().fetchValue("ordinal"), String.valueOf(ordinal));
        if (memberAttribute != null) {
            Assert.assertEquals(trait.getArguments().fetchValue("memberAttribute"), memberAttribute);
        }
    }
}
