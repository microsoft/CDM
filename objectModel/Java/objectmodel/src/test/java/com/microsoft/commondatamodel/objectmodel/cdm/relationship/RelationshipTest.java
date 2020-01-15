package com.microsoft.commondatamodel.objectmodel.cdm.relationship;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmRelationshipDiscoveryStyle;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.E2ERelationship;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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
    final CdmCorpusDefinition corpus = this.getCorpus();
    final CdmManifestDefinition rootManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();
    final CdmManifestDefinition subManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync(rootManifest.getSubManifests().get(0).getDefinition()).join();

    corpus.calculateEntityGraphAsync(rootManifest).join();
    rootManifest.populateManifestRelationshipsAsync().join();

    Assert.assertEquals(rootManifest.getRelationships().getCount(), 5);
    Assert.assertEquals(subManifest.getRelationships().getCount(), 7);

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
    for (final E2ERelationship expectedRel : expectedAllManifestRels) {
      final List<CdmE2ERelationship> found = rootManifest.getRelationships().getAllItems().parallelStream()
          .filter(x -> Objects.equals(expectedRel.getFromEntity(), x.getFromEntity())
              && Objects.equals(expectedRel.getFromEntityAttribute(), x.getFromEntityAttribute())
              && Objects.equals(expectedRel.getToEntity(), x.getToEntity())
              && Objects.equals(expectedRel.getToEntityAttribute(), x.getToEntityAttribute()))
          .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }

    for (final E2ERelationship expectedSubRel : expectedAllSubManifestRels) {
      final List<CdmE2ERelationship> found = subManifest.getRelationships().getAllItems().parallelStream()
          .filter(x -> Objects.equals(expectedSubRel.getFromEntity(), x.getFromEntity())
              && Objects.equals(expectedSubRel.getFromEntityAttribute(), x.getFromEntityAttribute())
              && Objects.equals(expectedSubRel.getToEntity(), x.getToEntity())
              && Objects.equals(expectedSubRel.getToEntityAttribute(), x.getToEntityAttribute()))
          .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }
  }

  /**
   * Testing calculation of relationships and that those relationships are
   * properly added to manifest objects.
   */
  @Test
  public void TestCalculateRelationshipsAndPopulateManifestsWithExclusiveFlag()
      throws InterruptedException, ExecutionException, IOException {
    final CdmCorpusDefinition corpus = this.getCorpus();

    final CdmManifestDefinition rootManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").get();
    final CdmManifestDefinition subManifest = corpus
        .<CdmManifestDefinition>fetchObjectAsync(rootManifest.getSubManifests().get(0).getDefinition()).get();

    corpus.calculateEntityGraphAsync(rootManifest).join();
    rootManifest.populateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.Exclusive).join();

    Assert.assertEquals(rootManifest.getRelationships().size(), 3);
    Assert.assertEquals(subManifest.getRelationships().size(), 3);

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
    for (final E2ERelationship expectedRel : expectedExclusiveManifestRels) {
      final List<CdmE2ERelationship> found = rootManifest.getRelationships().getAllItems().parallelStream()
          .filter(x -> Objects.equals(expectedRel.getFromEntity(), x.getFromEntity())
              && Objects.equals(expectedRel.getFromEntityAttribute(), x.getFromEntityAttribute())
              && Objects.equals(expectedRel.getToEntity(), x.getToEntity())
              && Objects.equals(expectedRel.getToEntityAttribute(), x.getToEntityAttribute()))
          .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }

    for (final E2ERelationship expectedSubRel : expectedExclusiveSubManifestRels) {
      final List<CdmE2ERelationship> found = subManifest.getRelationships().getAllItems().parallelStream()
          .filter(x -> Objects.equals(expectedSubRel.getFromEntity(), x.getFromEntity())
              && Objects.equals(expectedSubRel.getFromEntityAttribute(), x.getFromEntityAttribute())
              && Objects.equals(expectedSubRel.getToEntity(), x.getToEntity())
              && Objects.equals(expectedSubRel.getToEntityAttribute(), x.getToEntityAttribute()))
          .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }
  }

  /**
   * Testing calculation of relationships and that those relationships are
   * properly added to manifest objects setting the populate flag to None.
   */
  @Test
  public void testCalculateRelationshipsAndPopulateManifestsWithNoneFlag()
      throws ExecutionException, InterruptedException {
    final CdmCorpusDefinition corpus = this.getCorpus();

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
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "TestCalculateRelationshipsOnResolvedEntities");
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("local", new LocalAdapter(testInputPath));
    corpus.getStorage().setDefaultNamespace("local");
    final CdmManifestDefinition rootManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();
    final CdmManifestDefinition resolvedManifest = loadAndResolveManifest(corpus, rootManifest, "-resolved");
    String subManifestPath = corpus.getStorage().createAbsoluteCorpusPath(resolvedManifest.getSubManifests().getAllItems().get(0).getDefinition());
    CdmManifestDefinition subManifest = corpus.<CdmManifestDefinition>fetchObjectAsync(subManifestPath).join();
    // using createResolvedManifest will only populate exclusive relationships
    Assert.assertEquals(resolvedManifest.getRelationships().size(), expectedResolvedManifestRels.size());
    Assert.assertEquals(subManifest.getRelationships().size(), expectedResolvedSubManifestRels.size());
    // check that each relationship has been created correctly
    for (final E2ERelationship expectedRel : expectedResolvedManifestRels) {
    final List<CdmE2ERelationship> found = resolvedManifest.getRelationships().getAllItems()
      .parallelStream()
      .filter(x ->
        Objects.equals(expectedRel.getFromEntity(), x.getFromEntity())
          && Objects.equals(expectedRel.getFromEntityAttribute(), x.getFromEntityAttribute())
          && Objects.equals(expectedRel.getToEntity(), x.getToEntity())
          && Objects.equals(expectedRel.getToEntityAttribute(), x.getToEntityAttribute()))
        .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }

    for (E2ERelationship expectedSubRel : expectedResolvedSubManifestRels) {
      final List<CdmE2ERelationship> found = subManifest.getRelationships().getAllItems()
      .parallelStream()
      .filter(x ->
        Objects.equals(expectedSubRel.getFromEntity(), x.getFromEntity())
          && Objects.equals(expectedSubRel.getFromEntityAttribute(), x.getFromEntityAttribute())
          && Objects.equals(expectedSubRel.getToEntity(), x.getToEntity())
          && Objects.equals(expectedSubRel.getToEntityAttribute(), x.getToEntityAttribute()))
        .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }

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
    Assert.assertEquals(bInRels.size(), 1);
    Assert.assertEquals(bInRels.get(0).getFromEntity(), "local:/A-resolved.cdm.json/A");
    Assert.assertEquals(bInRels.get(0).getToEntity(), "local:/B-resolved.cdm.json/B");
    Assert.assertEquals(bOutRels.size(), 0);

    // C
    final CdmEntityDefinition cEnt = corpus.<CdmEntityDefinition>fetchObjectAsync(subManifest.getEntities().getAllItems().get(0).getEntityPath(), subManifest).join();
    final ArrayList<CdmE2ERelationship> cInRels = corpus.fetchIncomingRelationships(cEnt);
    final ArrayList<CdmE2ERelationship> cOutRels = corpus.fetchOutgoingRelationships(cEnt);
    Assert.assertEquals(cInRels.size(), 0);
    Assert.assertEquals(cOutRels.size(), 2);
    Assert.assertEquals(cOutRels.get(0).getFromEntity(), "local:/sub/C-resolved.cdm.json/C");
    // TODO: this should point to the resolved entity, currently an open bug
    Assert.assertEquals(cOutRels.get(0).getToEntity(), "local:/B.cdm.json/B");
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

  private CdmCorpusDefinition getCorpus() throws InterruptedException {
    final String testInputPath =
        TestHelper.getInputFolderPath(
            TESTS_SUBPATH,
            "testCalculateRelationshipsAndPopulateManifests");

    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("local", new LocalAdapter(testInputPath));
    corpus.getStorage().unmount("cdm");

    corpus.getStorage().setDefaultNamespace("local");

    return corpus;
  }
}
