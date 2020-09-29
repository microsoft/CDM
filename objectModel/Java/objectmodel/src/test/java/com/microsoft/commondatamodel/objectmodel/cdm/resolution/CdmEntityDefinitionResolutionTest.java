// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeItem;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.enums.ImportsLoadStrategy;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntity;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterException;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.InterceptLog;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.core.LogEvent;
import org.mockito.ArgumentCaptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.Ignore;
import org.testng.annotations.Test;

public class CdmEntityDefinitionResolutionTest {

  private static final String LOCAL = "local";
  private static final String NORMALIZED = "normalized";
  private static final String REFERENCE_ONLY = "referenceOnly";
  private static final String TXT = ".txt";
  private static final String CDM = "cdm";

  private static final Logger LOGGER = LoggerFactory.getLogger(CdmEntityDefinitionResolutionTest.class);

  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File(new File(CDM, "resolution"), "entityresolution").toString();

  /**
   * Whether debugging files should be written or not.
   */
  private static final boolean doesWriteDebuggingFiles = false;

  /**
   * Get the text version of all the resolved entities.
   *
   * @param cdmCorpus  The CDM corpus.
   * @param directives The directives to use while getting the resolved entities.
   * @param manifest   The manifest to be resolved.
   * @param spew       The object used to store the text to be returned.
   * @return The text version of the resolved entities. (it's in a form that
   *         facilitates debugging)
   */
  public static CompletableFuture<String> listAllResolved(final CdmCorpusDefinition cdmCorpus,
      final AttributeResolutionDirectiveSet directives, final CdmManifestDefinition manifest,
      final StringSpewCatcher spew) {
    return CompletableFuture.supplyAsync(() -> {
      seekEntities(cdmCorpus, directives, manifest, spew).join();

      if (spew != null) {
        return spew.getContent();
      }
      return "";
    });
  }

  private static CompletableFuture<Void> seekEntities(final CdmCorpusDefinition cdmCorpus,
      final AttributeResolutionDirectiveSet directives, final CdmManifestDefinition manifest,
      final StringSpewCatcher spew) {
    return CompletableFuture.runAsync(() -> {
      if (manifest.getEntities() != null) {
        if (spew != null) {
          spew.spewLine(manifest.getFolderPath());
        }
        for (final CdmEntityDeclarationDefinition entity : manifest.getEntities()) {
          CdmEntityDeclarationDefinition ent = entity;
          CdmObject currentFile = manifest;
          while (ent instanceof CdmReferencedEntityDeclarationDefinition) {
            ent = cdmCorpus.<CdmEntityDeclarationDefinition>fetchObjectAsync(ent.getEntityPath(), currentFile).join();
            currentFile = ent;
          }
          final ResolveOptions resOpt = new ResolveOptions();
          resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);
          final CdmEntityDefinition newEnt = cdmCorpus
              .<CdmEntityDefinition>fetchObjectAsync(ent.getEntityPath(), currentFile, resOpt).join();
          resOpt.setWrtDoc(newEnt.getInDocument());
          resOpt.setDirectives(directives);

          final ResolvedEntity resEnt = new ResolvedEntity(newEnt, resOpt);

          if (spew != null) {
            try {
              resEnt.spew(resOpt, spew, " ", true);
            } catch (final IOException e) {
              throw new StorageAdapterException(e.getMessage());
            }
          }
        }
      }

      if (manifest.getSubManifests() != null) {
        for (final CdmManifestDeclarationDefinition subManifest : manifest.getSubManifests()) {
          seekEntities(cdmCorpus, directives,
              cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(subManifest.getDefinition(), manifest).join(), spew)
                  .join();
        }
      }
    });
  }

  /**
   * Test if the composite resolved entities match
   */
  @Test
  public void testResolvedComposites() {
    this.resolveSaveDebuggingFileAndAssert("testResolvedComposites", "composites");
  }

  /**
   * Test if the composite resolved entities match
   */
  @Test
  public void testResolvedE2E() {
    this.resolveSaveDebuggingFileAndAssert("testResolvedE2E", "E2EResolution");
  }

  /**
   * Test if the knowledge graph resolved entities match.
   */
  @Test
  public void testResolvedKnowledgeGraph() {
    this.resolveSaveDebuggingFileAndAssert("testResolvedKnowledgeGraph", "KnowledgeGraph");
  }

  /**
   * Test if the mini dyn resolved entities match.
   */
  // @Test
  public void testResolvedMiniDyn() {
    this.resolveSaveDebuggingFileAndAssert("testResolvedMiniDyn", "MiniDyn");
  }

  /**
   * Test if the overrides resolved entities match.
   */
  @Test
  public void testResolvedOverrides() {
    this.resolveSaveDebuggingFileAndAssert("testResolvedOverrides", "overrides");
  }

  /**
   * Test if the POVResolution resolved entities match.
   */
  @Test
  public void testResolvedPovResolution() {
    this.resolveSaveDebuggingFileAndAssert("testResolvedPovResolution", "POVResolution");
  }

  /**
   * Test if the WebClicks resolved entities match.
   */
  @Test
  public void testResolvedWebClicks() {
    this.resolveSaveDebuggingFileAndAssert("testResolvedWebClicks", "webClicks");
  }

  /**
   * Test that monikered references on resolved entities can be resolved correctly, previously
   * the inclusion of the resolvedFrom moniker stopped the source document from being found
   */
  @Test
  public void testResolveWithExtended() throws InterruptedException, ExecutionException {
    try (final InterceptLog interceptLog = new InterceptLog(CdmCorpusDefinition.class, Level.WARN)) {
      final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolveWithExtended", null);
      final CdmEntityDefinition ent = cdmCorpus
          .<CdmEntityDefinition>fetchObjectAsync("local:/sub/Account.cdm.json/Account").get();
      ent.createResolvedEntityAsync("Account_").get();

      interceptLog.verifyNumLogEvents(0);
    }
  }

  /**
   * Test that attributes with the same name are merged on resolve and that
   * traits are merged and attribute contexts are mapped correctly
   */
  @Test
  public void testAttributesThatAreReplaced() throws InterruptedException, ExecutionException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testAttributesThatAreReplaced", null);
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
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolvedAttributeLimit", null);

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
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testSettingTraitsForResolutionGuidanceAttributes", null);
    CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/Customer.cdm.json/Customer").join();

    // Resolve with default directives to get "is.linkedEntity.name" trait.
    ResolveOptions resOpt = new ResolveOptions(entity.getInDocument(), null);
    CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync("resolved", resOpt).join();

    Assert.assertEquals(resolvedEntity.getAttributes().get(1).getAppliedTraits().get(7).getNamedReference(), "is.linkedEntity.name");

    // Resolve with referenceOnly directives to get "is.linkedEntity.identifier" trait.
    Set<String> directives = new LinkedHashSet<>();
    directives.add("referenceOnly");
    resOpt = new ResolveOptions(entity.getInDocument(), new AttributeResolutionDirectiveSet(directives));
    resolvedEntity = entity.createResolvedEntityAsync("resolved2", resOpt).join();

    Assert.assertEquals(resolvedEntity.getAttributes().get(0).getAppliedTraits().get(7).getNamedReference(), "is.linkedEntity.identifier");
  }

  /**
   * Function used to test resolving an environment. Writes a helper function used
   * for debugging. Asserts the result matches the expected result stored in a
   * file.
   *
   * @param testName The name of the test we should fetch input files for.
   */
  private void resolveSaveDebuggingFileAndAssert(final String testName, final String manifestName) {
    Assert.assertNotNull(testName);
    final String result;
    try {
      result = this.resolveEnvironment(testName, manifestName);
      if (doesWriteDebuggingFiles) {
        TestHelper.writeActualOutputFileContent(TESTS_SUBPATH, testName, manifestName + TXT, result);
      }

      final String original = TestHelper.getExpectedOutputFileContent(this.TESTS_SUBPATH, testName, manifestName + TXT);
      TestHelper.assertFileContentEquality(original, result);
    } catch (final Exception e) {
      LOGGER.error(e.getMessage());
      throw new RuntimeException(e);
    }
  }

  /**
   * Test whether or not the test corpus can be resolved The input of this test is
   * a manifest from SchemaDocs, so this test does not need any individual input
   * files. This test does not check the output. Possibly because the schema docs
   * change often.
   */
  //@Test
  public void testResolveTestCorpus() throws Exception {
    Assert.assertTrue((Files.isDirectory(Paths.get(TestHelper.SCHEMA_DOCS_ROOT))), "SchemaDocsRoot not found!!!");

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    LOGGER.info("reading source file");

    final StorageAdapter adapter = new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT);
    cdmCorpus.getStorage().mount(LOCAL, adapter);
    final CdmManifestDefinition manifest = cdmCorpus
        .<CdmManifestDefinition>fetchObjectAsync(TestHelper.CDM_STANDARDS_SCHEMA_PATH).get();
    final AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(
        new LinkedHashSet<>(Arrays.asList(NORMALIZED, REFERENCE_ONLY)));
    final String allResolved = listAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher()).get();
    assert (!Strings.isNullOrEmpty(allResolved));
  }

  /**
   * Resolve the entities in the given manifest.
   *
   * @param testName     The name of the test. It is used to decide the path of
   *                     input / output files.
   * @param manifestName The name of the manifest to be used.
   * @return The resolved entities.
   */
  private String resolveEnvironment(final String testName, final String manifestName)
      throws InterruptedException, ExecutionException {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    final StorageAdapter adapter = new LocalAdapter(TestHelper.getInputFolderPath(TESTS_SUBPATH, testName));
    cdmCorpus.getStorage().mount(LOCAL, adapter);

    final CdmManifestDefinition folio = cdmCorpus
        .<CdmManifestDefinition>fetchObjectAsync("local:/" + manifestName + ".manifest.cdm.json").get();
    final AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(
        new LinkedHashSet<>(Arrays.asList(NORMALIZED, REFERENCE_ONLY)));
    return listAllResolved(cdmCorpus, directives, folio, new StringSpewCatcher()).join();
  }
}
