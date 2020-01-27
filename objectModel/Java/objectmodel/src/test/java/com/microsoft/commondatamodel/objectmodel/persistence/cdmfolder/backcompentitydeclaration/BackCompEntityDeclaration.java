package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.backcompentitydeclaration;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import org.testng.Assert;
import org.testng.annotations.Test;

public class BackCompEntityDeclaration {
  /**
   * The path between TestDataPath and TestName.
   */
  private final String TESTS_SUBPATH =
      new File(
          new File("persistence", "cdmfolder"),
          "backcompentitydeclaration"
      ).toString();

  /**
   * Test load legacy entity declaration.
   */
  @Test
  public void testLoadLegacyEntityDeclaration() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(
        TESTS_SUBPATH,
        "testLoadLegacyEntityDeclaration",
        "entities.manifest.cdm.json");
    final ManifestContent jsonContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
        new ResolveContext(new CdmCorpusDefinition()),
        "",
        "",
        "",
        jsonContent);
    // Local entity declaration.
    Assert.assertEquals(cdmManifest.getEntities().get(0).getEntityPath(), "testPath");

    // Referenced entity declaration.
    Assert.assertEquals(
        cdmManifest.getEntities().get(1).getEntityPath(),
        "Account.cdm.json/Account");
  }
}
