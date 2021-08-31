// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.cdmfolderpersistence;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import org.testng.annotations.Test;

public class CdmFolderPersistenceTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private final String TESTS_SUBPATH =
      new File(
          new File("persistence", "cdmfolder"),
          "cdmfolderpersistence"
      ).toString();

  /**
   * Test loading and saving cdm folder files.
   */
  @Test
  public void testFromAndToData() throws IOException, InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestFromAndToData", true);

    final CdmFolderDefinition folder = corpus.getStorage().fetchRootFolder("local");
    final CdmManifestDefinition manifest = (CdmManifestDefinition)corpus.fetchObjectAsync("default" + PersistenceLayer.manifestExtension, folder).join();
    final ManifestContent actualData = ManifestPersistence.toData(manifest, null, null);

    manifest.getEntities().forEach(entity -> corpus.fetchObjectAsync(entity.getEntityPath(), manifest));

    corpus.getStorage().fetchRootFolder("output").getDocuments().add(manifest);
    manifest.saveAsAsync("default" + PersistenceLayer.manifestExtension, true);

    final String expected_data = TestHelper.getExpectedOutputFileContent(TESTS_SUBPATH, "TestFromAndToData", "default" + PersistenceLayer.manifestExtension);
    TestHelper.assertSameObjectWasSerialized(expected_data, JMapper.MAPPER_FOR_SPEW.writeValueAsString(actualData));
  }
}
