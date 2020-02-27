// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.datapartitionpattern;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.RemoteAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import org.testng.Assert;
import org.testng.AssertJUnit;
import org.testng.annotations.Test;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class DataPartitionPatternTest {

  private static final String TESTS_SUBPATH = new File(new File("persistence", "cdmfolder"), "datapartitionpattern").toString();
  private static final ResolveContext RESOLVE_CONTEXT = new ResolveContext(new CdmCorpusDefinition());
  private static final String LOCAL = "local";
  private static final String CDM = "cdm";
  private static final String REMOTE = "remote";

  /**
   * Testing for folder with local entity declaration with data partition patterns.
   */
  @Test
  public void testLoadLocalEntityWithDataPartitionPattern() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testLoadLocalEntityWithDataPartitionPattern", "entities.manifest.cdm.json");
    final ManifestContent manifestContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(RESOLVE_CONTEXT,
            "entities", "testNamespace", "/", manifestContent);

    Assert.assertEquals(cdmManifest.getEntities().getCount(), 1);
    Assert.assertEquals(cdmManifest.getEntities().get(0).getObjectType(), CdmObjectType.LocalEntityDeclarationDef);

    final CdmEntityDeclarationDefinition entity = cdmManifest.getEntities().get(0);
    Assert.assertEquals(entity.getDataPartitionPatterns().getCount(), 1);

    final CdmDataPartitionPatternDefinition pattern = entity.getDataPartitionPatterns().get(0);
    Assert.assertEquals(pattern.getName(), "testPattern");
    Assert.assertEquals(pattern.getExplanation(), "test explanation");
    Assert.assertEquals(pattern.getRootLocation(), "test location");
    Assert.assertEquals(pattern.getRegularExpression(), "\\s*");
    Assert.assertEquals(pattern.getParameters().size(), 2);
    Assert.assertEquals(pattern.getParameters().get(0), "testParam1");
    Assert.assertEquals(pattern.getParameters().get(1), "testParam2");
    Assert.assertEquals(pattern.getSpecializedSchema(), "test special schema");
    Assert.assertEquals(pattern.getExhibitsTraits().getCount(), 1);
  }

  /**
   * Testing that error is handled when partition pattern contains a folder that does not exist
   */
  @Test
  public void testPatternWithNonExistingFolder() throws IOException, InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPatternWithNonExistingFolder", null);
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testPatternWithNonExistingFolder", "entities.manifest.cdm.json");
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(new ResolveContext(corpus), "entities", "local", "/", JMapper.MAP.readValue(content, ManifestContent.class));
    cdmManifest.fileStatusCheckAsync().join();
    Assert.assertEquals(cdmManifest.getEntities().get(0).getDataPartitions().size(), 0);
    // make sure the last check time is still being set
    AssertJUnit.assertNotNull(cdmManifest.getEntities().get(0).getDataPartitionPatterns().get(0).getLastFileStatusCheckTime());
  }
}
