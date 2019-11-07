package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.GithubAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.concurrent.CompletableFuture;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ResolutionGuidanceTest {

  /**
   * The test's data path.
   */
  private static final String TESTS_SUBPATH =
      new File("cdm", "resolutionguidance").toString();

  private static CompletableFuture<Void> runTest(final String testName, final String sourceEntityName) {
    return CompletableFuture.runAsync(() -> {
      try {
        final String testInputPath =
            TestHelper.getInputFolderPath(TESTS_SUBPATH, testName);
        final String testExpectedOutputPath =
            TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, testName);
        final String testActualOutputPath =
            TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, testName);

        final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
        corpus.getStorage().mount(
            "localInput",
            new LocalAdapter(testInputPath));
        corpus.getStorage().mount(
            "localExpectedOutput",
            new LocalAdapter(testExpectedOutputPath));
        corpus.getStorage().mount(
            "localActualOutput",
            new LocalAdapter(testActualOutputPath));

        final GithubAdapter githubAdapter = new GithubAdapter();
        githubAdapter.setTimeout(Duration.ofSeconds(3));
        githubAdapter.setTimeout(Duration.ofSeconds(3));
        githubAdapter.setNumberOfRetries(1);

        corpus.getStorage().mount("cdm", githubAdapter);

        corpus.getStorage().setDefaultNamespace("localInput");

        final CdmEntityDefinition srcEntityDef =
            corpus.<CdmEntityDefinition>fetchObjectAsync(
                "localInput:/" + sourceEntityName + ".cdm.json/" + sourceEntityName
            ).join();
        Assert.assertTrue(srcEntityDef != null);

        final ResolveOptions resOpt = new ResolveOptions(srcEntityDef);
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>()));

        final CdmFolderDefinition actualOutputFolder =
            corpus.<CdmFolderDefinition>fetchObjectAsync("localActualOutput:/").join();
        CdmEntityDefinition resolvedEntityDef;
        String outputEntityFileName;
        String entityFileName;

        entityFileName = "default";
        resOpt.setDirectives(new AttributeResolutionDirectiveSet(new HashSet<>()));
        outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + ".cdm.json";
        resolvedEntityDef =
            srcEntityDef.createResolvedEntityAsync(
                outputEntityFileName,
                resOpt,
                actualOutputFolder).join();
        if (resolvedEntityDef
            .getInDocument()
            .saveAsAsync(
                outputEntityFileName,
                false,
                new CopyOptions()).join()) {
          validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = "referenceOnly";
        resOpt.setDirectives(
            new AttributeResolutionDirectiveSet(
                new HashSet<>(Collections.singletonList("referenceOnly"))));
        outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + ".cdm.json";
        resolvedEntityDef =
            srcEntityDef.createResolvedEntityAsync(
                outputEntityFileName,
                resOpt,
                actualOutputFolder).join();
        if (resolvedEntityDef
            .getInDocument()
            .saveAsAsync(
                outputEntityFileName,
                false,
                new CopyOptions()).join()) {
          validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = "normalized";
        resOpt.setDirectives(
            new AttributeResolutionDirectiveSet(
                new HashSet<>(Collections.singletonList("normalized"))));
        outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + ".cdm.json";
        resolvedEntityDef =
            srcEntityDef.createResolvedEntityAsync(
                outputEntityFileName,
                resOpt,
                actualOutputFolder).join();
        if (resolvedEntityDef
            .getInDocument()
            .saveAsAsync(
                outputEntityFileName,
                false,
                new CopyOptions()).join()) {
          validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = "structured";
        resOpt.setDirectives(
            new AttributeResolutionDirectiveSet(
                new HashSet<>(Collections.singletonList("structured"))));
        outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + ".cdm.json";
        resolvedEntityDef =
            srcEntityDef.createResolvedEntityAsync(
                outputEntityFileName,
                resOpt,
                actualOutputFolder).join();
        if (resolvedEntityDef
            .getInDocument()
            .saveAsAsync(
                outputEntityFileName,
                false,
                new CopyOptions()).join()) {
          validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = "referenceOnly_normalized";
        resOpt.setDirectives(
            new AttributeResolutionDirectiveSet(
                new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
        outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + ".cdm.json";
        resolvedEntityDef =
            srcEntityDef.createResolvedEntityAsync(
                outputEntityFileName,
                resOpt,
                actualOutputFolder).join();
        if (resolvedEntityDef
            .getInDocument()
            .saveAsAsync(
                outputEntityFileName,
                false,
                new CopyOptions()).join()) {
          validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = "referenceOnly_normalized";
        resOpt.setDirectives(
            new AttributeResolutionDirectiveSet(
                new HashSet<>(Arrays.asList("referenceOnly", "normalized"))));
        outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + ".cdm.json";
        resolvedEntityDef =
            srcEntityDef.createResolvedEntityAsync(
                outputEntityFileName,
                resOpt,
                actualOutputFolder).join();
        if (resolvedEntityDef
            .getInDocument()
            .saveAsAsync(
                outputEntityFileName,
                false,
                new CopyOptions()).join()) {
          validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = "referenceOnly_structured";
        resOpt.setDirectives(
            new AttributeResolutionDirectiveSet(
                new HashSet<>(Arrays.asList("referenceOnly", "structured"))));
        outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + ".cdm.json";
        resolvedEntityDef =
            srcEntityDef.createResolvedEntityAsync(
                outputEntityFileName,
                resOpt,
                actualOutputFolder).join();
        if (resolvedEntityDef
            .getInDocument()
            .saveAsAsync(
                outputEntityFileName,
                false,
                new CopyOptions()).join()) {
          validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = "normalized_structured";
        resOpt.setDirectives(
            new AttributeResolutionDirectiveSet(
                new HashSet<>(Arrays.asList("normalized", "structured"))));
        outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + ".cdm.json";
        resolvedEntityDef =
            srcEntityDef.createResolvedEntityAsync(
                outputEntityFileName,
                resOpt,
                actualOutputFolder).join();
        if (resolvedEntityDef
            .getInDocument()
            .saveAsAsync(
                outputEntityFileName,
                false,
                new CopyOptions()).join()) {
          validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = "referenceOnly_normalized_structured";
        resOpt.setDirectives(
            new AttributeResolutionDirectiveSet(
                new HashSet<>(Arrays.asList("referenceOnly", "normalized", "structured"))));
        outputEntityFileName = sourceEntityName + "_Resolved_" + entityFileName + ".cdm.json";
        resolvedEntityDef =
            srcEntityDef.createResolvedEntityAsync(
                outputEntityFileName,
                resOpt,
                actualOutputFolder).join();
        if (resolvedEntityDef
            .getInDocument()
            .saveAsAsync(
                outputEntityFileName,
                false,
                new CopyOptions()).join()) {
          validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }
      } catch (final Exception e) {
        // Assert.fail(e.getMessage());
        throw new RuntimeException(e);
      }
    });
  }

  private static void validateOutput(
      final String outputEntityFileName,
      final String testExpectedOutputPath,
      final String testActualOutputPath) {

    try {
    final String expectedOutput = new String(Files.readAllBytes(
        new File(testExpectedOutputPath, outputEntityFileName).toPath()),
        StandardCharsets.UTF_8);
    final String actualOutput = new String(Files.readAllBytes(
        new File(testActualOutputPath, outputEntityFileName).toPath()),
        StandardCharsets.UTF_8);
      JSONAssert.assertEquals(expectedOutput, actualOutput, false);
    } catch (final Exception e) {
      Assert.fail(e.getMessage());
    }

  }

  /**
   * Resolution Guidance Test 01 - Resolve entity by name.
   */
  @Test
  public void test_01_ByEntityName() {
    final String testName = "test_01_ByEntityName";
    runTest(testName, "Sales").join();
  }

  /**
   * Resolution Guidance Test 02 - Resolve entity by primary key.
   */
  @Test
  public void test_02_ByPrimaryKey() {
    final String testName = "test_02_ByPrimaryKey";
    runTest(testName, "Sales").join();
  }

  /**
   * Resolution Guidance Test 03 - Empty ResolutionGuidance.
   */
  @Test
  public void test_03_EmptyResolutionGuidance() {
    final String testName = "test_03_EmptyResolutionGuidance";
    runTest(testName, "Sales").join();
  }

  /**
   * Resolution Guidance Test 04 - With RenameFormat property.
   */
  @Test
  public void test_04_RenameFormat() {
    final String testName = "test_04_RenameFormat";
    runTest(testName, "Sales").join();
  }

  /**
   * Resolution Guidance Test 05 - Empty EntityReference property.
   */
  @Test
  public void test_05_EmptyEntityReference() {
    final String testName = "test_05_EmptyEntityReference";
    runTest(testName, "Sales").join();
  }

  /**
   * Resolution Guidance Test 06 - With AllowReferences = true.
   */
  @Test
  public void test_06_AllowReferencesTrue() {
    final String testName = "test_06_AllowReferencesTrue";
    runTest(testName, "Sales").join();
  }

  /**
   * Resolution Guidance Test 07 - With AlwaysIncludeForeignKey = true.
   */
  @Test
  public void test_07_AlwaysIncludeForeignKeyTrue() {
    final String testName = "test_07_AlwaysIncludeForeignKeyTrue";
    runTest(testName, "Sales").join();
  }

  /**
   * Resolution Guidance Test 08 - With ForeignKeyAttribute property.
   */
  @Test
  public void test_08_ForeignKeyAttribute() {
    final String testName = "test_08_ForeignKeyAttribute";
    runTest(testName, "Sales").join();
  }

  /**
   * Resolution Guidance Test 09 - With Cardinality = "one".
   */
  @Test
  public void test_09_CardinalityOne() {
    final String testName = "test_09_CardinalityOne";
    runTest(testName, "Sales").join();
  }
}
