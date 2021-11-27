// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.relationship;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmRelationshipDiscoveryStyle;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.E2ERelationship;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.testng.Assert;
import org.testng.annotations.Test;

public class RelationshipTest {
  private static final String CDM = "cdm";
  private static final String TESTS_SUBPATH = new File(CDM, "relationship").toString();

  /**
   * Testing calculation of relationships and that those relationships are
   * properly added to manifest objects
   */
  @Test
  public void testCalculateRelationshipsAndPopulateManifests() throws IOException, InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testCalculateRelationshipsAndPopulateManifests");
    final CdmManifestDefinition rootManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();
    final CdmManifestDefinition subManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync(rootManifest.getSubManifests().get(0).getDefinition()).join();

    corpus.calculateEntityGraphAsync(rootManifest).join();
    rootManifest.populateManifestRelationshipsAsync().join();

    final List<E2ERelationship> expectedAllManifestRels = JMapper.MAP.readValue(
        TestHelper.getExpectedOutputFileContent(TESTS_SUBPATH, "testCalculateRelationshipsAndPopulateManifests",
            "expectedAllManifestRels.json"),
        new TypeReference<List<E2ERelationship>>() {
        });
    final List<E2ERelationship> expectedAllSubManifestRels = JMapper.MAP.readValue(
        TestHelper.getExpectedOutputFileContent(TESTS_SUBPATH, "testCalculateRelationshipsAndPopulateManifests",
            "expectedAllSubManifestRels.json"),
        new TypeReference<List<E2ERelationship>>() {
        });

    // check that each relationship has been created correctly
    verifyRelationships(rootManifest, expectedAllManifestRels);
    verifyRelationships(subManifest, expectedAllSubManifestRels);
  }

  /**
   * Testing calculation of relationships and that those relationships are
   * properly added to manifest objects.
   */
  @Test
  public void TestCalculateRelationshipsAndPopulateManifestsWithExclusiveFlag()
      throws InterruptedException, ExecutionException, IOException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testCalculateRelationshipsAndPopulateManifests");

    final CdmManifestDefinition rootManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").get();
    final CdmManifestDefinition subManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync(rootManifest.getSubManifests().get(0).getDefinition()).get();

    corpus.calculateEntityGraphAsync(rootManifest).join();
    rootManifest.populateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.Exclusive).join();

    final List<E2ERelationship> expectedExclusiveManifestRels = JMapper.MAP.readValue(
        TestHelper.getExpectedOutputFileContent(TESTS_SUBPATH, "TestCalculateRelationshipsAndPopulateManifests",
            "expectedExclusiveManifestRels.json"),
        new TypeReference<List<E2ERelationship>>() {
        });
    final List<E2ERelationship> expectedExclusiveSubManifestRels = JMapper.MAP.readValue(
        TestHelper.getExpectedOutputFileContent(TESTS_SUBPATH, "TestCalculateRelationshipsAndPopulateManifests",
            "expectedExclusiveSubManifestRels.json"),
        new TypeReference<List<E2ERelationship>>() {
        });

    // check that each relationship has been created correctly
    verifyRelationships(rootManifest, expectedExclusiveManifestRels);
    verifyRelationships(subManifest, expectedExclusiveSubManifestRels);
  }

  /**
   * Testing calculation of relationships and that those relationships are
   * properly added to manifest objects setting the populate flag to None.
   */
  @Test
  public void testCalculateRelationshipsAndPopulateManifestsWithNoneFlag()
      throws ExecutionException, InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testCalculateRelationshipsAndPopulateManifests");

    final CdmManifestDefinition rootManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").get();
    final CdmManifestDefinition subManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync(rootManifest.getSubManifests().get(0).getDefinition()).get();

    corpus.calculateEntityGraphAsync(rootManifest).join();
    // make sure no relationships are added when "none" relationship option is passed in
    rootManifest.populateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.None).join();

    Assert.assertEquals(0, rootManifest.getRelationships().getCount());
    Assert.assertEquals(0, subManifest.getRelationships().getCount());
  }

  /**
   * Testing calculation of relationships when resolved entities are listed in the manifest
   */
  @Test
  public void testCalculateRelationshipsOnResolvedEntities()
      throws JsonMappingException, JsonProcessingException, IOException, InterruptedException {
    final List<E2ERelationship> expectedResolvedManifestRels = 
      JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
      TESTS_SUBPATH,
      "testCalculateRelationshipsOnResolvedEntities", 
      "expectedResolvedManifestRels.json"),
      new TypeReference<List<E2ERelationship>>() {
      });
    final List<E2ERelationship> expectedResolvedSubManifestRels = 
      JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
      TESTS_SUBPATH,
      "testCalculateRelationshipsOnResolvedEntities",
      "expectedResolvedSubManifestRels.json"),
      new TypeReference<List<E2ERelationship>>() {
      });
    final List<E2ERelationship> expectedResolvedExcManifestRels = 
      JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
      TESTS_SUBPATH,
      "testCalculateRelationshipsOnResolvedEntities", 
      "expectedResolvedExcManifestRels.json"),
      new TypeReference<List<E2ERelationship>>() {
      });
    final List<E2ERelationship> expectedResolvedExcSubManifestRels = 
      JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
      TESTS_SUBPATH,
      "testCalculateRelationshipsOnResolvedEntities",
      "expectedResolvedExcSubManifestRels.json"),
      new TypeReference<List<E2ERelationship>>() {
      });
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "TestCalculateRelationshipsOnResolvedEntities");
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("local", new LocalAdapter(testInputPath));
    corpus.getStorage().setDefaultNamespace("local");
    final CdmManifestDefinition rootManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();
    final CdmManifestDefinition resolvedManifest = loadAndResolveManifest(corpus, rootManifest, "-resolved");
    String subManifestPath = corpus.getStorage().createAbsoluteCorpusPath(resolvedManifest.getSubManifests().getAllItems().get(0).getDefinition());
    CdmManifestDefinition subManifest = corpus.<CdmManifestDefinition>fetchObjectAsync(subManifestPath).join();

    // using createResolvedManifest will only populate exclusive relationships
    verifyRelationships(resolvedManifest, expectedResolvedExcManifestRels);
    verifyRelationships(subManifest, expectedResolvedExcSubManifestRels);

    // check that each relationship has been created correctly with the all flag
    resolvedManifest.populateManifestRelationshipsAsync().join();
    subManifest.populateManifestRelationshipsAsync().join();
    verifyRelationships(resolvedManifest, expectedResolvedManifestRels);
    verifyRelationships(subManifest, expectedResolvedSubManifestRels);

    // it is not enough to check if the relationships are correct.
    // We need to check if the incoming and outgoing relationships are
    // correct as well. One being correct can cover up the other being wrong
    // A
    final CdmEntityDefinition aEnt = corpus.<CdmEntityDefinition>fetchObjectAsync(resolvedManifest.getEntities().getAllItems().get(0).getEntityPath(), resolvedManifest).join();
    final ArrayList<CdmE2ERelationship> aInRels = corpus.fetchIncomingRelationships(aEnt);
    final ArrayList<CdmE2ERelationship> aOutRels = corpus.fetchOutgoingRelationships(aEnt);
    Assert.assertEquals(aInRels.size(), 0);
    Assert.assertEquals(aOutRels.size(), 1);
    Assert.assertEquals(aOutRels.get(0).getFromEntity(), "local:/A-resolved.cdm.json/A");
    Assert.assertEquals(aOutRels.get(0).getToEntity(), "local:/B-resolved.cdm.json/B");

    // B
    final CdmEntityDefinition bEnt = corpus.<CdmEntityDefinition>fetchObjectAsync(resolvedManifest.getEntities().getAllItems().get(1).getEntityPath(), resolvedManifest).join();
    final ArrayList<CdmE2ERelationship> bInRels = corpus.fetchIncomingRelationships(bEnt);
    final ArrayList<CdmE2ERelationship> bOutRels = corpus.fetchOutgoingRelationships(bEnt);
    Assert.assertEquals(bInRels.size(), 2);
    Assert.assertEquals(bInRels.get(0).getFromEntity(), "local:/A-resolved.cdm.json/A");
    Assert.assertEquals(bInRels.get(0).getToEntity(), "local:/B-resolved.cdm.json/B");
    Assert.assertEquals(bInRels.get(1).getFromEntity(), "local:/sub/C-resolved.cdm.json/C");
    Assert.assertEquals(bInRels.get(1).getToEntity(), "local:/B-resolved.cdm.json/B");
    Assert.assertEquals(bOutRels.size(), 0);

    // C
    final CdmEntityDefinition cEnt = corpus.<CdmEntityDefinition>fetchObjectAsync(subManifest.getEntities().getAllItems().get(0).getEntityPath(), subManifest).join();
    final ArrayList<CdmE2ERelationship> cInRels = corpus.fetchIncomingRelationships(cEnt);
    final ArrayList<CdmE2ERelationship> cOutRels = corpus.fetchOutgoingRelationships(cEnt);
    Assert.assertEquals(cInRels.size(), 0);
    Assert.assertEquals(cOutRels.size(), 2);
    Assert.assertEquals(cOutRels.get(0).getFromEntity(), "local:/sub/C-resolved.cdm.json/C");
    Assert.assertEquals(cOutRels.get(0).getToEntity(), "local:/B-resolved.cdm.json/B");
    Assert.assertEquals(cOutRels.get(1).getFromEntity(), "local:/sub/C-resolved.cdm.json/C");
    Assert.assertEquals(cOutRels.get(1).getToEntity(), "local:/sub/D-resolved.cdm.json/D");

    // D
    final CdmEntityDefinition dEnt = corpus.<CdmEntityDefinition>fetchObjectAsync(subManifest.getEntities().getAllItems().get(1).getEntityPath(), subManifest).join();
    final ArrayList<CdmE2ERelationship> dInRels = corpus.fetchIncomingRelationships(dEnt);
    final ArrayList<CdmE2ERelationship> dOutRels = corpus.fetchOutgoingRelationships(dEnt);
    Assert.assertEquals(dInRels.size(), 1);
    Assert.assertEquals(dInRels.get(0).getFromEntity(), "local:/sub/C-resolved.cdm.json/C");
    Assert.assertEquals(dInRels.get(0).getToEntity(), "local:/sub/D-resolved.cdm.json/D");
    Assert.assertEquals(dOutRels.size(), 0);

    // E
    final CdmEntityDefinition eEnt = corpus.<CdmEntityDefinition>fetchObjectAsync(resolvedManifest.getEntities().getAllItems().get(2).getEntityPath(), resolvedManifest).join();
    final ArrayList<CdmE2ERelationship> eInRels = corpus.fetchIncomingRelationships(eEnt);
    final ArrayList<CdmE2ERelationship> eOutRels = corpus.fetchOutgoingRelationships(eEnt);
    Assert.assertEquals(eInRels.size(), 1);
    Assert.assertEquals(eInRels.get(0).getFromEntity(), "local:/sub/F-resolved.cdm.json/F");
    Assert.assertEquals(eInRels.get(0).getToEntity(), "local:/E-resolved.cdm.json/E");
    Assert.assertEquals(eOutRels.size(), 0);

    // F
    final CdmEntityDefinition fEnt = corpus.<CdmEntityDefinition>fetchObjectAsync(subManifest.getEntities().getAllItems().get(2).getEntityPath(), subManifest).join();
    final ArrayList<CdmE2ERelationship> fInRels = corpus.fetchIncomingRelationships(fEnt);
    final ArrayList<CdmE2ERelationship> fOutRels = corpus.fetchOutgoingRelationships(fEnt);
    Assert.assertEquals(fInRels.size(), 0);
    Assert.assertEquals(fOutRels.size(), 1);
    Assert.assertEquals(fOutRels.get(0).getFromEntity(), "local:/sub/F-resolved.cdm.json/F");
    Assert.assertEquals(fOutRels.get(0).getToEntity(), "local:/E-resolved.cdm.json/E");
  }

  /**
   * Testing calculating relationships for the special kind of attribute that uses the "select one" directive
   */
  @Test
  public void testCalculateRelationshipsForSelectsOneAttribute()
      throws JsonMappingException, JsonProcessingException, IOException, InterruptedException, ExecutionException {
        final List<E2ERelationship> expectedRels = 
          JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
          TESTS_SUBPATH,
          "testCalculateRelationshipsForSelectsOneAttribute", 
          "expectedRels.json"),
          new TypeReference<List<E2ERelationship>>() {
        });
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testCalculateRelationshipsForSelectsOneAttribute");
        corpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));

        final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/selectsOne.manifest.cdm.json").join();

        corpus.calculateEntityGraphAsync(manifest).get();
        manifest.populateManifestRelationshipsAsync().get();

        // check that each relationship has been created correctly
        verifyRelationships(manifest, expectedRels);
  }

  /**
   * Test the relationship calculation when using a replace as foreign key operation while extending an entity.
   */
  @Test
  public void testExtendsEntityAndReplaceAsForeignKey() throws InterruptedException {
      String testName = "testExtendsEntityAndReplaceAsForeignKey";
      final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.WarnProjFKWithoutSourceEntity));
      CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName, null, false, expectedLogCodes);

      CdmManifestDefinition manifest =  corpus.<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();

      corpus.calculateEntityGraphAsync(manifest).join();
      // Check if the warning was logged.
      TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.WarnProjFKWithoutSourceEntity, true);

      manifest.populateManifestRelationshipsAsync().join();
      Assert.assertEquals(manifest.getRelationships().size(), 0);
  }

  /**
   * Test relationships are generated correctly when the document name and entity name do not match
   */
  @Test
  public void testRelationshipsEntityAndDocumentNameDifferent()
      throws JsonMappingException, JsonProcessingException, IOException, InterruptedException, ExecutionException {
        final List<E2ERelationship> expectedRels =
          JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
          TESTS_SUBPATH,
          "testRelationshipsEntityAndDocumentNameDifferent",
          "expectedRels.json"),
          new TypeReference<List<E2ERelationship>>() {
        });
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testRelationshipsEntityAndDocumentNameDifferent");
        final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/main.manifest.cdm.json").join();

        corpus.calculateEntityGraphAsync(manifest).get();
        manifest.populateManifestRelationshipsAsync().get();

        // check that each relationship has been created correctly
        verifyRelationships(manifest, expectedRels);
  }

  /**
   * Test that multiple relationships are generated when there are references to multiple entities
   */
  @Test
  public void testRelationshipToMultipleEntities()
      throws JsonMappingException, JsonProcessingException, IOException, InterruptedException, ExecutionException {
        final List<E2ERelationship> expectedRels = 
          JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
          TESTS_SUBPATH,
          "testRelationshipToMultipleEntities", 
          "expectedRels.json"),
          new TypeReference<List<E2ERelationship>>() {
        });
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testRelationshipToMultipleEntities");
        final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/main.manifest.cdm.json").join();

        corpus.calculateEntityGraphAsync(manifest).get();
        manifest.populateManifestRelationshipsAsync().get();

        // check that each relationship has been created correctly
        verifyRelationships(manifest, expectedRels);
  }

  /**
   * Test that relationships between entities in different namespaces are created correctly
   */
  @Test
  public void testRelationshipToDifferentNamespace()
      throws JsonMappingException, JsonProcessingException, IOException, InterruptedException, ExecutionException {
        final List<E2ERelationship> expectedRels = 
          JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
          TESTS_SUBPATH,
          "testRelationshipToDifferentNamespace", 
          "expectedRels.json"),
          new TypeReference<List<E2ERelationship>>() {
        });
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testRelationshipToDifferentNamespace");
        // entity B will be in a different namespace
        corpus.getStorage().mount("differentNamespace", new LocalAdapter(TestHelper.getInputFolderPath(TESTS_SUBPATH, "TestRelationshipToDifferentNamespace") + "/differentNamespace"));

        final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/main.manifest.cdm.json").join();

        corpus.calculateEntityGraphAsync(manifest).get();
        manifest.populateManifestRelationshipsAsync().get();

        // check that each relationship has been created correctly
        verifyRelationships(manifest, expectedRels);
  }

  private CompletableFuture<Void> reloadFromEntity(CdmCorpusDefinition corpus, CdmEntityDefinition fromEnt, String tempFromFilePath, String tempFromEntityPath) {
      final CopyOptions options = new CopyOptions();
      options.setTopLevelDocument(false);
      fromEnt.getInDocument().saveAsAsync(tempFromFilePath, false, options).join();
      // fetch gain to reset the cache
      corpus.<CdmEntityDefinition>fetchObjectAsync(tempFromEntityPath, null, null, true).join();
      return CompletableFuture.completedFuture(null);
  };

  /**
   * Test that relationships pointing from a manifest to an entity in a submanifest create correct paths
   */
  @Test
  public void testRelationshipPointingToSubManifest()
      throws JsonMappingException, JsonProcessingException, IOException, InterruptedException, ExecutionException {
        final List<E2ERelationship> expectedRels = 
          JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
          TESTS_SUBPATH,
          "testRelationshipPointingToSubManifest", 
          "expectedRels.json"),
          new TypeReference<List<E2ERelationship>>() {
        });
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testRelationshipPointingToSubManifest");
        final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/main.manifest.cdm.json").join();

        corpus.calculateEntityGraphAsync(manifest).get();
        manifest.populateManifestRelationshipsAsync().get();

        // check that each relationship has been created correctly
        verifyRelationships(manifest, expectedRels);
  }

    /**
     * Test that ensures relationships are updated correctly after entities are changed
     */
    @Test
    public void testUpdateRelationships()
            throws JsonMappingException, JsonProcessingException, IOException, InterruptedException, ExecutionException {
        final List<E2ERelationship> expectedRels =
                JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
                                TESTS_SUBPATH,
                                "testUpdateRelationships",
                                "expectedRels.json"),
                        new TypeReference<List<E2ERelationship>>() {
                        });
        final String tempFromFilePath = "fromEntTemp.cdm.json";
        final String tempFromEntityPath = "local:/fromEntTemp.cdm.json/fromEnt";
        final String tempToEntityPath = "local:/toEnt.cdm.json/toEnt";

        // Initialize corpus and entity files
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testUpdateRelationships");
        final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/main.manifest.cdm.json").join();
        final CdmManifestDefinition manifestNoToEnt = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/mainNoToEnt.manifest.cdm.json").join();
        final CdmEntityDefinition fromEnt = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/fromEnt.cdm.json/fromEnt").join();

        final CopyOptions options = new CopyOptions();
        options.setTopLevelDocument(false);
        fromEnt.getInDocument().saveAsAsync(tempFromFilePath, false, options).join();

        try {
            // 1. test when entity attribute is removed
            corpus.calculateEntityGraphAsync(manifest).join();
            manifest.populateManifestRelationshipsAsync().join();

            // check that the relationship has been created correctly
            verifyRelationships(manifest, expectedRels);

            // now remove the entity attribute, which removes the relationship
            CdmAttributeItem removedAttribute = fromEnt.getAttributes().get(0);
            fromEnt.getAttributes().removeAt(0);
            reloadFromEntity(corpus, fromEnt, tempFromFilePath, tempFromEntityPath).join();

            corpus.calculateEntityGraphAsync(manifest).join();
            manifest.populateManifestRelationshipsAsync().join();

            // check that the relationship has been removed
            verifyRelationships(manifest, new ArrayList<E2ERelationship>());

            // 2. test when the to entity is removed
            // restore the entity to the original state
            fromEnt.getAttributes().add(removedAttribute);
            reloadFromEntity(corpus, fromEnt, tempFromFilePath, tempFromEntityPath).join();

            corpus.calculateEntityGraphAsync(manifest).join();
            manifest.populateManifestRelationshipsAsync().join();

            // check that the relationship has been created correctly
            verifyRelationships(manifest, expectedRels);

            // remove the to entity
            fromEnt.getAttributes().removeAt(0);
            reloadFromEntity(corpus, fromEnt, tempFromFilePath, tempFromEntityPath).join();
            // fetch again to reset the cache
            corpus.<CdmEntityDefinition>fetchObjectAsync(tempToEntityPath, null, null, true).join();

            corpus.calculateEntityGraphAsync(manifestNoToEnt).join();
            manifestNoToEnt.populateManifestRelationshipsAsync().join();

            // check that the relationship has been removed
            verifyRelationships(manifestNoToEnt, new ArrayList<E2ERelationship>());
        } finally {
            // clean up created file created
            final String fromFilePath = corpus.getStorage().corpusPathToAdapterPath("local:/" + tempFromFilePath);
            final File fromFile = new File(fromFilePath);
            fromFile.delete();
        }
    }

  private static void verifyRelationships(CdmManifestDefinition manifest, List<E2ERelationship> expectedRelationships) {
    Assert.assertEquals(manifest.getRelationships().size(), expectedRelationships.size());

    for (final E2ERelationship expectedRel : expectedRelationships) {
      final List<CdmE2ERelationship> found = manifest.getRelationships().getAllItems()
        .parallelStream()
        .filter(x ->
          Objects.equals(expectedRel.getFromEntity(), x.getFromEntity())
          && Objects.equals(expectedRel.getFromEntityAttribute(), x.getFromEntityAttribute())
          && Objects.equals(expectedRel.getToEntity(), x.getToEntity())
          && Objects.equals(expectedRel.getToEntityAttribute(), x.getToEntityAttribute()))
        .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
   }
  }

  private static CdmManifestDefinition loadAndResolveManifest(CdmCorpusDefinition corpus, CdmManifestDefinition manifest, String renameSuffix) {
    System.out.println("Resolving manifest " + manifest.getManifestName() + " ...");
    CdmManifestDefinition resolvedManifest = manifest.createResolvedManifestAsync(manifest.getManifestName() + renameSuffix, "{n}-resolved.cdm.json").join();
    for (final CdmManifestDeclarationDefinition subManifestDecl : manifest.getSubManifests()) {
      final CdmManifestDefinition subManifest = corpus.<CdmManifestDefinition>fetchObjectAsync(subManifestDecl.getDefinition(), manifest).join();
      final CdmManifestDefinition resolvedSubManifest = loadAndResolveManifest(corpus, subManifest, renameSuffix);

      final CdmManifestDeclarationDefinition resolvedDecl = corpus.<CdmManifestDeclarationDefinition>makeObject(CdmObjectType.ManifestDeclarationDef, resolvedSubManifest.getManifestName());
      resolvedDecl.setDefinition(corpus.getStorage().createRelativeCorpusPath(resolvedSubManifest.getAtCorpusPath(), resolvedManifest));

      resolvedManifest.getSubManifests().add(resolvedDecl);
    }
    return resolvedManifest;
  }
}
