package com.microsoft.commondatamodel.objectmodel.cdm.relationship;

import com.fasterxml.jackson.core.type.TypeReference;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmRelationshipDiscoveryStyle;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.E2ERelationship;
import com.microsoft.commondatamodel.objectmodel.storage.GithubAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.Objects;
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
  public void testCalculateRelationshipsAndPopulateManifests()
      throws IOException, InterruptedException {
    final String testInputPath = TestHelper.getInputFolderPath(
        TESTS_SUBPATH,
        "testCalculateRelationshipsAndPopulateManifests");

    List<E2ERelationship> expectedAllManifestRels =
        JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
            TESTS_SUBPATH,
            "testCalculateRelationshipsAndPopulateManifests",
            "expectedAllManifestRels.json"),
            new TypeReference<List<E2ERelationship>>() {
            });
    List<E2ERelationship> expectedAllSubManifestRels =
        JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
            TESTS_SUBPATH,
            "testCalculateRelationshipsAndPopulateManifests",
            "expectedAllSubManifestRels.json"),
            new TypeReference<List<E2ERelationship>>() {
            });
    List<E2ERelationship> expectedExclusiveManifestRels =
        JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
            TESTS_SUBPATH,
            "testCalculateRelationshipsAndPopulateManifests",
            "expectedExclusiveManifestRels.json"),
            new TypeReference<List<E2ERelationship>>() {
            });
    List<E2ERelationship> expectedExclusiveSubManifestRels =
        JMapper.MAP.readValue(TestHelper.getExpectedOutputFileContent(
            TESTS_SUBPATH,
            "testCalculateRelationshipsAndPopulateManifests",
            "expectedExclusiveSubManifestRels.json"),
            new TypeReference<List<E2ERelationship>>() {
            });

    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("local", new LocalAdapter(testInputPath));

    final GithubAdapter githubAdapter = new GithubAdapter();
    githubAdapter.setTimeout(Duration.ofSeconds(3));
    githubAdapter.setMaximumTimeout(Duration.ofSeconds(6));
    githubAdapter.setNumberOfRetries(1);
    corpus.getStorage().mount("cdm", githubAdapter);

    corpus.getStorage().setDefaultNamespace("local");

    CdmManifestDefinition rootManifest =
        corpus.<CdmManifestDefinition>fetchObjectAsync(
            "local:/default.manifest.cdm.json"
        ).join();
    CdmManifestDefinition subManifest =
        corpus.<CdmManifestDefinition>fetchObjectAsync(
            rootManifest.getSubManifests().get(0).getDefinition()
        ).join();

    corpus.calculateEntityGraphAsync(rootManifest).join();
    rootManifest.populateManifestRelationshipsAsync().join();

    Assert.assertEquals(rootManifest.getRelationships().getCount(), 5);
    Assert.assertEquals(subManifest.getRelationships().getCount(), 7);

    // check that each relationship has been created correctly
    for (final E2ERelationship expectedRel : expectedAllManifestRels) {
      List<CdmE2ERelationship> found = rootManifest.getRelationships().getAllItems()
          .parallelStream()
          .filter(x ->
              Objects.equals(expectedRel.getFromEntity(), x.getFromEntity())
                  && Objects.equals(expectedRel.getFromEntityAttribute(), x.getFromEntityAttribute())
                  && Objects.equals(expectedRel.getToEntity(), x.getToEntity())
                  && Objects.equals(expectedRel.getToEntityAttribute(), x.getToEntityAttribute()))
          .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }

    for (final E2ERelationship expectedSubRel : expectedAllSubManifestRels) {
      List<CdmE2ERelationship> found = subManifest.getRelationships().getAllItems()
          .parallelStream()
          .filter(x ->
              Objects.equals(expectedSubRel.getFromEntity(), x.getFromEntity())
                  && Objects.equals(expectedSubRel.getFromEntityAttribute(), x.getFromEntityAttribute())
                  && Objects.equals(expectedSubRel.getToEntity(), x.getToEntity())
                  && Objects.equals(expectedSubRel.getToEntityAttribute(), x.getToEntityAttribute()))
          .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }

    // make sure only relationships where to and from entities are in the manifest are found with the "exclusive" option is passed in
    rootManifest.populateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.Exclusive).join();

    Assert.assertEquals(rootManifest.getRelationships().size(), 3);
    Assert.assertEquals(subManifest.getRelationships().size(), 3);

    // check that each relationship has been created correctly
    for (final E2ERelationship expectedRel : expectedExclusiveManifestRels) {
      List<CdmE2ERelationship> found = rootManifest.getRelationships().getAllItems()
          .parallelStream()
          .filter(x ->
              Objects.equals(expectedRel.getFromEntity(), x.getFromEntity())
                  && Objects.equals(expectedRel.getFromEntityAttribute(), x.getFromEntityAttribute())
                  && Objects.equals(expectedRel.getToEntity(), x.getToEntity())
                  && Objects.equals(expectedRel.getToEntityAttribute(), x.getToEntityAttribute()))
          .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }

    for (final E2ERelationship expectedSubRel : expectedExclusiveSubManifestRels) {
      List<CdmE2ERelationship> found = subManifest.getRelationships().getAllItems()
          .parallelStream()
          .filter(x ->
              Objects.equals(expectedSubRel.getFromEntity(), x.getFromEntity())
                  && Objects.equals(expectedSubRel.getFromEntityAttribute(), x.getFromEntityAttribute())
                  && Objects.equals(expectedSubRel.getToEntity(), x.getToEntity())
                  && Objects.equals(expectedSubRel.getToEntityAttribute(), x.getToEntityAttribute()))
          .collect(Collectors.toList());
      Assert.assertEquals(found.size(), 1);
    }

    // make sure no relationships are added when "none" relationship option is passed in
    rootManifest.populateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.None).join();

    Assert.assertEquals(rootManifest.getRelationships().size(), 0);
    Assert.assertEquals(subManifest.getRelationships().size(), 0);
  }
}
