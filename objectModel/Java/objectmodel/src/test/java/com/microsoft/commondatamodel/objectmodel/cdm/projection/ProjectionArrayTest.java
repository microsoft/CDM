
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.utilities.ProjectionTestUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.*;

public class ProjectionArrayTest {
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
    private static final String TESTS_SUBPATH = new File(new File(new File("Cdm"), "Projection"), "ProjectionArrayTest").toString();

    /**
     * Test Array type on an entity attribute.
     */
    @Test
    public void testEntityAttribute() throws InterruptedException {
        String testName = "testEntityAttribute";
        String entityName = "ThreeMusketeers";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition nonStructuredResolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();

        // Original set of attributes: ["name", "age", "address"]
        // in non-structured form
        // Expand 1...3;
        // renameFormat = {m}{o};
        // alterTraits = { has.expansionInfo.list(expansionName: "{a}", ordinal: "{o}", memberAttribute: "{m}") , "argumentsContainWildcards" : true }
        // addArtifactAttribute : "personCount"
        // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "personCount" , "argumentsContainWildcards" : true }
        Assert.assertEquals(nonStructuredResolvedEntity.getAttributes().getCount(), 10);
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(0), "name1", 1, "ThreePeople", "name");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(1), "age1", 1, "ThreePeople", "age");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(2), "address1", 1, "ThreePeople", "address");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(3), "name2", 2, "ThreePeople", "name");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(4), "age2", 2, "ThreePeople", "age");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(5), "address2", 2, "ThreePeople", "address");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(6), "name3", 3, "ThreePeople", "name");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(7), "age3", 3, "ThreePeople", "age");
        ProjectionTestUtils.validateExpansionInfoTrait((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(8), "address3", 3, "ThreePeople", "address");
        Assert.assertEquals(((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(9)).getName(), "personCount");
        Assert.assertEquals(nonStructuredResolvedEntity.getAttributes().get(9).getAppliedTraits().get(1).getNamedReference(), "indicates.expansionInfo.count");
        Assert.assertEquals(((CdmTraitReference)nonStructuredResolvedEntity.getAttributes().get(9).getAppliedTraits().get(1)).getArguments().get(0).getValue(), "ThreePeople");

        // in structured form
        // alterTraits = { is.dataFormat.list }
        // addAttributeGroup: favoriteMusketeers
        CdmEntityDefinition structuredResolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList( "structured" ))).join();
        Assert.assertEquals(structuredResolvedEntity.getAttributes().getCount(), 1);
        CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.validateAttributeGroup(structuredResolvedEntity.getAttributes(), "favoriteMusketeers");
        Assert.assertNotNull(attGroupDefinition.getExhibitsTraits().item("is.dataFormat.list"));
    }

    /**
     * Test Array type on a type attribute.
     */
    @Test
    public void testTypeAttribute() throws InterruptedException {
        String testName = "testTypeAttribute";
        String entityName = "Person";
        CdmCorpusDefinition corpus = ProjectionTestUtils.getLocalCorpus(TESTS_SUBPATH, testName);

        for (List<String> resOpt : resOptsCombinations) {
            ProjectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, TESTS_SUBPATH, entityName, resOpt).join();
        }

        CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/" + entityName + ".cdm.json/" + entityName).join();
        CdmEntityDefinition nonStructuredResolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.emptyList())).join();

        // Original set of attributes: ["Favorite Terms"]
        // in non-structured form
        // Expand 1...2;
        // renameFormat = Term {o};
        // alterTraits = { has.expansionInfo.list(expansionName: "{m}", ordinal: "{o}") , "argumentsContainWildcards" : true }
        // addArtifactAttribute : "number of favorite terms"
        // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "number of favorite terms" , "argumentsContainWildcards" : true }
        Assert.assertEquals(nonStructuredResolvedEntity.getAttributes().getCount(), 3);
        Assert.assertEquals(((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(0)).getName(), "Term 1");
        Assert.assertEquals(((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(1)).getName(), "Term 2");
        Assert.assertEquals(((CdmTypeAttributeDefinition)nonStructuredResolvedEntity.getAttributes().get(2)).getName(), "number of favorite terms");
        Assert.assertEquals(nonStructuredResolvedEntity.getAttributes().get(2).getAppliedTraits().get(1).getNamedReference(), "indicates.expansionInfo.count");
        Assert.assertEquals(((CdmTraitReference)nonStructuredResolvedEntity.getAttributes().get(2).getAppliedTraits().get(1)).getArguments().get(0).getValue(), "Favorite Terms");

        // Original set of attributes: ["Favorite Terms"]
        // in structured form
        // alterTraits = { is.dataFormat.list }
        CdmEntityDefinition structuredResolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Collections.singletonList("structured"))).join();
        Assert.assertEquals(structuredResolvedEntity.getAttributes().getCount(), 1);
        Assert.assertEquals(((CdmTypeAttributeDefinition)structuredResolvedEntity.getAttributes().get(0)).getName(), "Favorite Terms");
        Assert.assertNotNull(structuredResolvedEntity.getAttributes().get(0).getAppliedTraits().item("is.dataFormat.list"));
    }
}
