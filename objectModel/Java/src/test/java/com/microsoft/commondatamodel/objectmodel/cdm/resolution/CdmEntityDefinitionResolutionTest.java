package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntity;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterException;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmEntityDefinitionResolutionTest {

  private static final String LOCAL = "local";
  private static final String NORMALIZED = "normalized";
  private static final String REFERENCE_ONLY = "referenceOnly";
  private static final String TXT = ".txt";
  private static final String CDM = "cdm";
  private static final String SCHEMA_DOCS_ROOT = "../CDM.SchemaDocuments";

  /**
   * The path of the SchemaDocs project.
   */
  private static final Logger LOGGER = LoggerFactory.getLogger(CdmEntityDefinitionResolutionTest.class);
  private static final String TESTS_SUBPATH = new File(new File(CDM, "resolution"), "entityresolution").toString();

  /**
   * Whether debugging files should be written or not.
   */
  private static final boolean doesWriteDebuggingFiles = TestHelper.doesWriteTestDebuggingFiles;

  /**
   * Get the text version of all the resolved entities.
   *
   * @param cdmCorpus  The CDM corpus.
   * @param directives The directives to use while getting the resolved entities.
   * @param manifest   The manifest to be resolved.
   * @param spew       The object used to store the text to be returned.
   * @return The text version of the resolved entities. (it's in a form that facilitates debugging)
   */
  public static CompletableFuture<String> listAllResolved(
      final CdmCorpusDefinition cdmCorpus,
      final AttributeResolutionDirectiveSet directives,
      final CdmManifestDefinition manifest,
      final StringSpewCatcher spew) {
    return CompletableFuture.supplyAsync(() -> {
      seekEntities(cdmCorpus, directives, manifest, spew).join();

      if (spew != null) {
        return spew.getContent();
      }
      return "";
    });
  }

  private static CompletableFuture<Void> seekEntities(
      final CdmCorpusDefinition cdmCorpus,
      final AttributeResolutionDirectiveSet directives,
      final CdmManifestDefinition manifest,
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
            ent = cdmCorpus.<CdmEntityDeclarationDefinition>fetchObjectAsync(
                ent.getEntityPath(), currentFile).join();
            currentFile = ent;
          }
          final CdmEntityDefinition newEnt = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync(
              ent.getEntityPath(), currentFile).join();
          final ResolveOptions resOpt = new ResolveOptions();
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
          seekEntities(
              cdmCorpus,
              directives,
              cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
                  subManifest.getDefinition(),
                  manifest).join(),
              spew)
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
  @Test
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
  public void testPovResolution() {
    this.resolveSaveDebuggingFileAndAssert("testPovResolution", "POVResolution");
  }

  /**
   * Test if the WebClicks resolved entities match.
   */
  @Test
  public void testWebClicks() {
    this.resolveSaveDebuggingFileAndAssert("testWebClicks", "webClicks");
  }

  /**
   * Function used to test resolving an environment.
   * Writes a helper function used for debugging.
   * Asserts the result matches the expected result stored in a file.
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
   * Test whether or not the test corpus can be resolved
   * The input of this test is a manifest from SchemaDocs, so this test does not need any individual input files.
   * This test does not check the output. Possibly because the schema docs change often.
   */
  @Test
  public void testResolveTestCorpus() throws Exception {
    Assert.assertTrue((Files.isDirectory(Paths.get(SCHEMA_DOCS_ROOT))), "SchemaDocsRoot not found!!!");

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    LOGGER.info("reading source file");

    final StorageAdapter adapter = new LocalAdapter(SCHEMA_DOCS_ROOT);
    cdmCorpus.getStorage().mount(LOCAL, adapter);
    final CdmManifestDefinition manifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("local:/standards.manifest.cdm.json").get();
    final AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(new LinkedHashSet<>(
        Arrays.asList(NORMALIZED, REFERENCE_ONLY)));
    final String allResolved = listAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher()).get();
    assert (!Strings.isNullOrEmpty(allResolved));
  }

  /**
   * Resolve the entities in the given manifest.
   *
   * @param testName     The name of the test. It is used to decide the path of input / output files.
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