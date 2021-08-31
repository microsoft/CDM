package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import java.io.File;
import java.util.Arrays;
import java.util.HashSet;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import org.testng.Assert;
import org.testng.annotations.Test;

public class CacheTest {
    private static final String TESTS_SUBPATH = new File(new File("Cdm", "Resolution"), "CacheTest").toString();

    /**
     * Test when cached value hit the max depth, we are now getting
     * attributes where max depth should not be reached
     */
    @Test
    public void testMaxDepthCached() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testMaxDepth");
        CdmEntityDefinition aEnt = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("A.cdm.json/A").join();
        CdmEntityDefinition bEnt = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("B.cdm.json/B").join();
        CdmEntityDefinition cEnt = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("C.cdm.json/C").join();
        CdmEntityDefinition dEnt = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("D.cdm.json/D").join();

        // when resolving B, it should include any attributes from D because
        // it is outside of the maxDepth
        CdmEntityDefinition resB = bEnt.createResolvedEntityAsync("resB", new ResolveOptions(
                bEnt.getInDocument(),
                new AttributeResolutionDirectiveSet(new HashSet<> (Arrays.asList("normalized", "structured")))
            )).join();
        // ensure that when resolving A, attributes from D are excluded because they are beyond the max depth
        CdmEntityDefinition resA = aEnt.createResolvedEntityAsync("resA", new ResolveOptions(
                aEnt.getInDocument(),
                new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("normalized", "structured" )))
            )).join();

        // check the attributes found in D from resolving A
        CdmAttributeGroupDefinition bAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)resA.getAttributes().get(1)).getExplicitReference());
        CdmAttributeGroupDefinition cAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(bAttInA.getMembers().get(1))).getExplicitReference());
        CdmAttributeGroupDefinition dAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(cAttInA.getMembers().get(1))).getExplicitReference());
        Assert.assertEquals(dAttInA.getMembers().size(), 1);
        // check that the attribute in D is a foreign key attribute
        CdmTypeAttributeDefinition dIdAttFromA = (CdmTypeAttributeDefinition)(dAttInA.getMembers().get(0));
        Assert.assertEquals(dIdAttFromA.getName(), "dId");
        Assert.assertNotNull(dIdAttFromA.getAppliedTraits().item("is.linkedEntity.identifier"));

        // check the attributes found in D from resolving B
        CdmAttributeGroupDefinition cAttInB = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)resB.getAttributes().get(1)).getExplicitReference());
        CdmAttributeGroupDefinition dAttInB = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(cAttInB.getMembers().get(1))).getExplicitReference());
        Assert.assertEquals(dAttInB.getMembers().size(), 2);
        // check that the attribute in D is not a foreign key attribute
        CdmTypeAttributeDefinition dIdAttFromB = (CdmTypeAttributeDefinition)(dAttInB.getMembers().get(0));
        Assert.assertEquals(dIdAttFromB.getName(), "dId");
        Assert.assertNull(dIdAttFromB.getAppliedTraits().item("is.linkedEntity.identifier"));
    }

    /**
     * 
     */
    @Test
    public void testNonMaxDepthCached() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testMaxDepth");
        CdmEntityDefinition aEnt = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("A.cdm.json/A").join();
        CdmEntityDefinition bEnt = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("B.cdm.json/B").join();
        CdmEntityDefinition cEnt = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("C.cdm.json/C").join();
        CdmEntityDefinition dEnt = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("D.cdm.json/D").join();

        // when resolving A, B should be cached and it should exclude any attributes from D because
        // it is outside of the maxDepth
        CdmEntityDefinition resA = aEnt.createResolvedEntityAsync("resA", new ResolveOptions(
                aEnt.getInDocument(),
                new AttributeResolutionDirectiveSet(new HashSet<>(Arrays.asList("normalized", "structured" )))
            )).join();
        // ensure that when resolving B on its own, attributes from D are included
        CdmEntityDefinition resB = bEnt.createResolvedEntityAsync("resB", new ResolveOptions(
                bEnt.getInDocument(),
                new AttributeResolutionDirectiveSet(new HashSet<> (Arrays.asList("normalized", "structured")))
            )).join();

        // check the attributes found in D from resolving A
        CdmAttributeGroupDefinition bAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)resA.getAttributes().get(1)).getExplicitReference());
        CdmAttributeGroupDefinition cAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(bAttInA.getMembers().get(1))).getExplicitReference());
        CdmAttributeGroupDefinition dAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(cAttInA.getMembers().get(1))).getExplicitReference());
        Assert.assertEquals(dAttInA.getMembers().size(), 1);
        // check that the attribute in D is a foreign key attribute
        CdmTypeAttributeDefinition dIdAttFromA = (CdmTypeAttributeDefinition)(dAttInA.getMembers().get(0));
        Assert.assertEquals(dIdAttFromA.getName(), "dId");
        Assert.assertNotNull(dIdAttFromA.getAppliedTraits().item("is.linkedEntity.identifier"));

        // check the attributes found in D from resolving B
        CdmAttributeGroupDefinition cAttInB = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)resB.getAttributes().get(1)).getExplicitReference());
        CdmAttributeGroupDefinition dAttInB = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(cAttInB.getMembers().get(1))).getExplicitReference());
        Assert.assertEquals(dAttInB.getMembers().size(), 2);
        // check that the attribute in D is not a foreign key attribute
        CdmTypeAttributeDefinition dIdAttFromB = (CdmTypeAttributeDefinition)(dAttInB.getMembers().get(0));
        Assert.assertEquals(dIdAttFromB.getName(), "dId");
        Assert.assertNull(dIdAttFromB.getAppliedTraits().item("is.linkedEntity.identifier"));
    }
}
