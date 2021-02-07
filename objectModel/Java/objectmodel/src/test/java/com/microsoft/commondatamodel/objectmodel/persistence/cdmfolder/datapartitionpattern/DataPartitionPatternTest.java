// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.datapartitionpattern;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;

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

    Assert.assertEquals(cdmManifest.getEntities().getCount(), 2);

    final CdmEntityDeclarationDefinition entity1 = cdmManifest.getEntities().get(0);
    Assert.assertEquals(entity1.getObjectType(), CdmObjectType.LocalEntityDeclarationDef);
    Assert.assertEquals(entity1.getDataPartitionPatterns().getCount(), 1);

    final CdmDataPartitionPatternDefinition pattern1 = entity1.getDataPartitionPatterns().get(0);
    Assert.assertEquals(pattern1.getName(), "testPattern");
    Assert.assertEquals(pattern1.getExplanation(), "test explanation");
    Assert.assertEquals(pattern1.getRootLocation(), "test location");
    Assert.assertEquals(pattern1.getRegularExpression(), "\\s*");
    Assert.assertEquals(pattern1.getParameters().size(), 2);
    Assert.assertEquals(pattern1.getParameters().get(0), "testParam1");
    Assert.assertEquals(pattern1.getParameters().get(1), "testParam2");
    Assert.assertEquals(pattern1.getSpecializedSchema(), "test special schema");
    Assert.assertEquals(pattern1.getExhibitsTraits().getCount(), 1);

    final CdmEntityDeclarationDefinition entity2 = cdmManifest.getEntities().get(1);
    Assert.assertEquals(entity2.getObjectType(), CdmObjectType.LocalEntityDeclarationDef);
    Assert.assertEquals(entity2.getDataPartitionPatterns().getCount(), 1);
    final CdmDataPartitionPatternDefinition pattern2 = entity2.getDataPartitionPatterns().get(0);
    Assert.assertEquals(pattern2.getName(), "testPattern2");
    Assert.assertEquals(pattern2.getRootLocation(), "test location2");
    Assert.assertEquals(pattern2.getGlobPattern(), "/*.csv");

    final ManifestContent manifestData =
            ManifestPersistence.toData(cdmManifest, new ResolveOptions(), new CopyOptions());
    Assert.assertEquals(manifestData.getEntities().size(), 2);

    final JsonNode entityData1 = manifestData.getEntities().get(0);
    Assert.assertEquals(entityData1.get("dataPartitionPatterns").size(), 1);
    final JsonNode patternData1 = entityData1.get("dataPartitionPatterns").get(0);
    Assert.assertEquals(patternData1.get("name").asText(), "testPattern");
    Assert.assertEquals(patternData1.get("explanation").asText(), "test explanation");
    Assert.assertEquals(patternData1.get("rootLocation").asText(), "test location");
    Assert.assertEquals(patternData1.get("regularExpression").asText(), "\\s*");
    Assert.assertEquals(patternData1.get("parameters").size(), 2);
    Assert.assertEquals(patternData1.get("parameters").get(0).asText(), "testParam1");
    Assert.assertEquals(patternData1.get("parameters").get(1).asText(), "testParam2");
    Assert.assertEquals(patternData1.get("specializedSchema").asText(), "test special schema");
    Assert.assertEquals(patternData1.get("exhibitsTraits").size(), 1);

    final JsonNode entityData2 = manifestData.getEntities().get(1);
    Assert.assertEquals(entityData2.get("dataPartitionPatterns").size(), 1);
    final JsonNode patternData2 = entityData2.get("dataPartitionPatterns").get(0);
    Assert.assertEquals(patternData2.get("name").asText(), "testPattern2");
    Assert.assertEquals(patternData2.get("rootLocation").asText(), "test location2");
    Assert.assertEquals(patternData2.get("globPattern").asText(), "/*.csv");
  }
}
