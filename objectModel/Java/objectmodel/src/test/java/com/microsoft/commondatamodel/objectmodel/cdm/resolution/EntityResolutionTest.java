// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ExecutionException;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projection.AttributeContextUtil;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.*;

import org.testng.Assert;
import org.testng.annotations.Ignore;
import org.testng.annotations.Test;

public class EntityResolutionTest {

  private static final String LOCAL = "local";
  private static final String NORMALIZED = "normalized";
  private static final String REFERENCE_ONLY = "referenceOnly";
  private static final String TXT = ".txt";
  private static final String CDM = "cdm";

  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File(new File(CDM, "Resolution"), "EntityResolutionTest").toString();

  /**
   * Whether debugging files should be written or not.
   */
  private static final boolean doesWriteDebuggingFiles = false;

  /**
   * Tests if the owner of the entity is not changed when calling createdResolvedEntityAsync
   */
  @Test
  public void testOwnerNotChanged() throws InterruptedException
  {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testOwnerNotChanged");

    CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/Entity.cdm.json/Entity").join();
    CdmDocumentDefinition document = corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/Entity.cdm.json").join();

    Assert.assertEquals(document, entity.getOwner());

    entity.createResolvedEntityAsync("res-Entity").join();

    Assert.assertEquals(document, entity.getOwner());
    Assert.assertEquals(entity, entity.getAttributes().get(0).getOwner(), "Entity's attribute's owner should have remained unchanged (same as the owning entity)");
  }

  /**
   * Test that entity references that do not point to valid entities are reported as an error instead of triggering an exception
   */
  @Test
  public void testEntRefNonexistent() throws InterruptedException
  {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<>(Arrays.asList(CdmLogCode.WarnResolveObjectFailed, CdmLogCode.ErrResolveReferenceFailure));
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testEntRefNonexistent", null, false, expectedLogCodes);
    CdmFolderDefinition folder = corpus.getStorage().getNamespaceFolders().get("local");
    CdmDocumentDefinition doc = new CdmDocumentDefinition(corpus.getCtx(), "someDoc.cdm.json");
    folder.getDocuments().add(doc);
    CdmEntityDefinition entity = new CdmEntityDefinition(corpus.getCtx(), "someEntity");
    CdmEntityAttributeDefinition entAtt = new CdmEntityAttributeDefinition(corpus.getCtx(), "entityAtt");
    entAtt.setEntity(new CdmEntityReference(corpus.getCtx(), "nonExistingEntity", true));
    entity.getAttributes().add(entAtt);
    doc.getDefinitions().add(entity);

    CdmEntityDefinition resolvedEnt = entity.createResolvedEntityAsync("resolvedSomeEntity").join();
    Assert.assertNotNull(resolvedEnt);
  }

  /**
   * Tests that resolution runs correctly when resolving a resolved entity
   */
  @Test
  public void testResolvingResolvedEntity() throws InterruptedException
  {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolvingResolvedEntity");
    CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/Entity.cdm.json/Entity").join();
    CdmEntityDefinition resEntity = entity.createResolvedEntityAsync("resEntity").join();
    CdmEntityDefinition resResEntity = resEntity.createResolvedEntityAsync("resResEntity").join();
    Assert.assertNotNull(resResEntity);
    Assert.assertEquals(1, resResEntity.getExhibitsTraits().size());
    Assert.assertEquals("has.entitySchemaAbstractionLevel", resResEntity.getExhibitsTraits().get(0).getNamedReference());
    Assert.assertEquals(1, ((CdmTraitReference)resResEntity.getExhibitsTraits().get(0)).getArguments().size());
    Assert.assertEquals("resolved", ((CdmTraitReference)resResEntity.getExhibitsTraits().get(0)).getArguments().get(0).getValue());
  }

  /**
   * Test if the composite resolved entities match
   */
  @Test
  public void testResolvedComposites() throws IOException, InterruptedException {
    ResolutionTestUtils.resolveSaveDebuggingFileAndAssert(TESTS_SUBPATH, "testResolvedComposites", "composites", false);
  }

  /**
   * Test if the composite resolved entities match
   */
  @Test
  public void testResolvedE2E() throws IOException, InterruptedException {
    ResolutionTestUtils.resolveSaveDebuggingFileAndAssert(TESTS_SUBPATH, "testResolvedE2E", "E2EResolution", false);
  }

  /**
   * Test if the knowledge graph resolved entities match.
   */
  @Test
  public void testResolvedKnowledgeGraph() throws IOException, InterruptedException {
    ResolutionTestUtils.resolveSaveDebuggingFileAndAssert(TESTS_SUBPATH, "testResolvedKnowledgeGraph", "KnowledgeGraph", false);
  }

  /**
   * Test if the mini dyn resolved entities match.
   */
  // @Test
  public void testResolvedMiniDyn() throws IOException, InterruptedException {
    ResolutionTestUtils.resolveSaveDebuggingFileAndAssert(TESTS_SUBPATH, "testResolvedMiniDyn", "MiniDyn", false);
  }

  /**
   * Test if the overrides resolved entities match.
   */
  @Test
  public void testResolvedOverrides() throws IOException, InterruptedException {
    ResolutionTestUtils.resolveSaveDebuggingFileAndAssert(TESTS_SUBPATH, "testResolvedOverrides", "overrides", false);
  }

  /**
   * Test if the POVResolution resolved entities match.
   */
  @Test
  public void testResolvedPovResolution() throws IOException, InterruptedException {
    ResolutionTestUtils.resolveSaveDebuggingFileAndAssert(TESTS_SUBPATH, "testResolvedPovResolution", "POVResolution", false);
  }

  /**
   * Test if the WebClicks resolved entities match.
   */
  @Test
  public void testResolvedWebClicks() throws IOException, InterruptedException {
    ResolutionTestUtils.resolveSaveDebuggingFileAndAssert(TESTS_SUBPATH, "testResolvedWebClicks", "webClicks", false);
  }

  /**
   * Test that monikered references on resolved entities can be resolved correctly, previously
   * the inclusion of the resolvedFrom moniker stopped the source document from being found
   */
  @Test
  public void testResolveWithExtended() throws InterruptedException, ExecutionException {
    CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolveWithExtended");

    cdmCorpus.setEventCallback(new EventCallback() {
      @Override
      public void apply(CdmStatusLevel level, String message) {
        if (message.contains("unable to resolve the reference"))
          Assert.fail();
        }
      }, CdmStatusLevel.Warning);

    final CdmEntityDefinition ent = cdmCorpus
            .<CdmEntityDefinition>fetchObjectAsync("local:/sub/Account.cdm.json/Account").get();
    ent.createResolvedEntityAsync("Account_").get();
  }

  /**
   * Test that attributes with the same name are merged on resolve and that
   * traits are merged and attribute contexts are mapped correctly
   */
  @Test
  public void testAttributesThatAreReplaced() throws InterruptedException, ExecutionException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testAttributesThatAreReplaced");
    corpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));

    CdmEntityDefinition extendedEntity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/extended.cdm.json/extended").get();
    CdmEntityDefinition resExtendedEnt = extendedEntity.createResolvedEntityAsync("resExtended").get();

    // the attribute from the base class should be merged with the attribute
    // from the extended class into a single attribute
    Assert.assertEquals(1, resExtendedEnt.getAttributes().size());

    // check that traits from the base class merged with the traits from the extended class
    final CdmAttributeItem attribute = resExtendedEnt.getAttributes().get(0);
    // base trait
    Assert.assertTrue(attribute.getAppliedTraits().indexOf("means.identity.brand") != -1);
    // extended trait
    Assert.assertTrue(attribute.getAppliedTraits().indexOf("means.identity.company.name") != -1);

    // make sure the attribute context and entity foreign key were maintained correctly
    final CdmAttributeContext foreignKeyForBaseAttribute = ((CdmAttributeContext)((CdmAttributeContext)resExtendedEnt.getAttributeContext().getContents().get(1)).getContents().get(1));
    Assert.assertEquals("_generatedAttributeSet", foreignKeyForBaseAttribute.getName());

    final CdmAttributeReference fkReference = (CdmAttributeReference)(((CdmAttributeContext)((CdmAttributeContext)foreignKeyForBaseAttribute.getContents().get(0)).getContents().get(0)).getContents().get(0));
    Assert.assertEquals("resExtended/hasAttributes/regardingObjectId", fkReference.getNamedReference());
  }

  /**
   * Test that resolved attribute limit is calculated correctly and respected
   */
  @Test
  public void TestResolvedAttributeLimit() throws InterruptedException, ExecutionException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrRelMaxResolvedAttrReached));
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolvedAttributeLimit", null, false, expectedLogCodes);

    CdmEntityDefinition mainEntity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/mainEntity.cdm.json/mainEntity").join();
    ResolveOptions resOpt = new ResolveOptions(mainEntity.getInDocument(), null);

    // if attribute limit is reached, entity should be null
    resOpt.setResolvedAttributeLimit(4);
    CdmEntityDefinition resEnt = mainEntity.createResolvedEntityAsync(String.format("%s_zeroAtts", mainEntity.getEntityName()), resOpt).join();
    Assert.assertNull(resEnt);

    // when the attribute limit is set to null, there should not be a limit on the possible number of attributes
    resOpt.setResolvedAttributeLimit(null);
    ResolvedAttributeSet ras = mainEntity.fetchResolvedAttributes(resOpt);
    resEnt = mainEntity.createResolvedEntityAsync(String.format("%s_normalized_referenceOnly", mainEntity.getEntityName()), resOpt).join();

    // there are 5 total attributes
    Assert.assertEquals(5, ras.getResolvedAttributeCount());
    Assert.assertEquals(5, ras.getSet().size());
    Assert.assertEquals(3, mainEntity.getAttributes().size());
    // there are 2 attributes grouped in an entity attribute
    // and 2 attributes grouped in an attribute group
    Assert.assertEquals(2, (((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)mainEntity.getAttributes().get(2)).getExplicitReference()).getMembers().size()));

    // using the default limit number
    resOpt = new ResolveOptions(mainEntity.getInDocument());
    ras = mainEntity.fetchResolvedAttributes(resOpt);
    resEnt = mainEntity.createResolvedEntityAsync(String.format("%s_normalized_referenceOnly", mainEntity.getEntityName()), resOpt).join();

    // there are 5 total attributes
    Assert.assertEquals(5, ras.getResolvedAttributeCount());
    Assert.assertEquals(5, ras.getSet().size());
    Assert.assertEquals(3, mainEntity.getAttributes().size());
    // there are 2 attributes grouped in an entity attribute
    // and 2 attributes grouped in an attribute group
    Assert.assertEquals(2, ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)mainEntity.getAttributes().get(2)).getExplicitReference()).getMembers().size());

    Set<String> directives = new LinkedHashSet<>();
    directives.add("normalized");
    directives.add("structured");
    resOpt = new ResolveOptions(mainEntity.getInDocument(), new AttributeResolutionDirectiveSet(directives));
    ras = mainEntity.fetchResolvedAttributes(resOpt);
    resEnt = mainEntity.createResolvedEntityAsync(String.format("%s_normalized_structured", mainEntity.getEntityName()), resOpt).join();

    // there are 5 total attributes
    Assert.assertEquals(5, ras.getResolvedAttributeCount());
    // the attribute count is different because one attribute is a group that contains two different attributes
    Assert.assertEquals(4, ras.getSet().size());
    Assert.assertEquals(3, mainEntity.getAttributes().size());
    // again there are 2 attributes grouped in an entity attribute
    // and 2 attributes grouped in an attribute group
    Assert.assertEquals(2, ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)mainEntity.getAttributes().get(2)).getExplicitReference()).getMembers().size());
  }

  /**
   * Test that "is.linkedEntity.name" and "is.linkedEntity.identifier" traits are set when "selectedTypeAttribute" and "foreignKeyAttribute"
   * are present in the entity's resolution guidance.
   */
  @Test
  public void testSettingTraitsForResolutionGuidanceAttributes() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testSettingTraitsForResolutionGuidanceAttributes");
    CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/Customer.cdm.json/Customer").join();

    // Resolve with default directives to get "is.linkedEntity.name" trait.
    ResolveOptions resOpt = new ResolveOptions(entity.getInDocument(), null);
    CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("resolved", resOpt).join();

    Assert.assertNotNull(resolvedEntity.getAttributes().get(1).getAppliedTraits().item("is.linkedEntity.name"));

    // Resolve with referenceOnly directives to get "is.linkedEntity.identifier" trait.
    Set<String> directives = new LinkedHashSet<>();
    directives.add("referenceOnly");
    resOpt = new ResolveOptions(entity.getInDocument(), new AttributeResolutionDirectiveSet(directives));
    resolvedEntity = entity.createResolvedEntityAsync("resolved2", resOpt).join();

    Assert.assertNotNull(resolvedEntity.getAttributes().get(0).getAppliedTraits().item("is.linkedEntity.identifier"));
  }

  /**
   * Test whether or not the test corpus can be resolved The input of this test is
   * a manifest from SchemaDocs, so this test does not need any individual input
   * files. This test does not check the output. Possibly because the schema docs
   * change often.
   */
  @Test
  @Ignore
  public void testResolveTestCorpus() throws Exception {
    Assert.assertTrue((Files.isDirectory(Paths.get(TestHelper.SCHEMA_DOCS_ROOT))), "SchemaDocsRoot not found!!!");

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    final StorageAdapterBase adapter = new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT);
    cdmCorpus.getStorage().mount(LOCAL, adapter);
    final CdmManifestDefinition manifest = cdmCorpus
        .<CdmManifestDefinition>fetchObjectAsync(TestHelper.CDM_STANDARDS_SCHEMA_PATH).get();
    final AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(
        new LinkedHashSet<>(Arrays.asList(NORMALIZED, REFERENCE_ONLY)));
    final String allResolved = ResolutionTestUtils.listAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher());
    assert (!StringUtils.isNullOrEmpty(allResolved));
  }

   /**
   * Test whether or not the test corpus can be resolved The input of this test is
   * a manifest from SchemaDocs, so this test does not need any individual input
   * files. This test does not check the output. Possibly because the schema docs
   * change often.
   */
  @Test
  public void testAppliedTraitsInAttributes() throws Exception {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testAppliedTraitsInAttributes");
    String expectedOutputFolder = TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, "testAppliedTraitsInAttributes");
    CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/Sales.cdm.json/Sales").join();
    CdmEntityDefinition resolvedEntity = ProjectionTestUtils.getResolvedEntity(corpus, entity, new ArrayList<String>(Arrays.asList("referenceOnly"))).join();
    AttributeContextUtil.validateAttributeContext(expectedOutputFolder, "Sales", resolvedEntity);
  }
}
