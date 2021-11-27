package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import java.io.File;
import java.util.Arrays;
import java.util.HashSet;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import org.testng.Assert;
import org.testng.annotations.Test;

public class CircularResolutionTest {
    private static final String TESTS_SUBPATH = new File(new File("Cdm", "Resolution"), "CircularResolutionTest").toString();

    /**
     * Test proper behavior for entities that contain circular references
     */
    @Test
    public void testCircularReference() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestCircularReference");
        CdmEntityDefinition customer = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/Customer.cdm.json/Customer").join();
        CdmEntityDefinition resCustomerStructured = customer.createResolvedEntityAsync("resCustomer", new ResolveOptions(
            customer.getInDocument(),
            new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("normalized", "structured", "noMaxDepth")))
        )).join();

        // check that the circular reference attribute has a single id attribute
        CdmAttributeGroupDefinition storeGroupAtt = (CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(resCustomerStructured.getAttributes().get(1))).getExplicitReference();
        CdmAttributeGroupDefinition customerGroupAtt = (CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(storeGroupAtt.getMembers().get(1))).getExplicitReference();
        Assert.assertEquals(customerGroupAtt.getMembers().size(), 1);
        Assert.assertEquals(((CdmTypeAttributeDefinition)(customerGroupAtt.getMembers().get(0))).getName(), "customerId");
    }

    /**
     * Test that relationship is created when an entity contains a reference to itself
     */
    @Test
    public void testSelfReference() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestSelfReference");
        CdmManifestDefinition manifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("local:/SelfReference.manifest.cdm.json").join();
        cdmCorpus.calculateEntityGraphAsync(manifest).join();
        manifest.populateManifestRelationshipsAsync().join();

        Assert.assertEquals(manifest.getRelationships().size(), 1);
        CdmE2ERelationship rel = manifest.getRelationships().get(0);
        Assert.assertEquals(rel.getFromEntity(), "CustTable.cdm.json/CustTable");
        Assert.assertEquals(rel.getToEntity(), "CustTable.cdm.json/CustTable");
        Assert.assertEquals(rel.getFromEntityAttribute(), "FactoringAccountRelationship");
        Assert.assertEquals(rel.getToEntityAttribute(), "PaymTermId");
    }
}
