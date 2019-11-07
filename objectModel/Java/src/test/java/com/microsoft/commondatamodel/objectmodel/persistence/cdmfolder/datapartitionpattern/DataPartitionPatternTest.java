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
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DataPartitionPatternTest {

  private static final String TESTS_SUBPATH = new File(new File("persistence", "cdmfolder"), "datapartitionpattern").toString();
  private static final ResolveContext RESOLVE_CONTEXT = new ResolveContext(new CdmCorpusDefinition());

  /**
   * Testing for folder with local entity declaration with data partition patterns.
   */
  @Test
  public void testLoadLocalEntityWithDataPartitionPattern() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testLoadLocalEntityWithDataPartitionPattern", "entities.manifest.cdm.json");
    final ManifestContent manifestContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromData(RESOLVE_CONTEXT,
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
}
