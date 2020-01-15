package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.entity;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import java.io.File;
import java.util.List;
import java.util.stream.Collectors;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmEntityDefinitionTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH =
      new File(new File(
          "persistence",
          "cdmfolder"),
          "entity")
          .toString();
  private static final String LOCAL = "local";

  /**
   * Testing that traits with multiple properties are maintained
   * even when one of the properties is null
   */
  @Test
  public void testEntityProperties() throws InterruptedException {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH,
        "testEntityProperties");

    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();

    final StorageAdapter localAdapter;
    localAdapter = new LocalAdapter(testInputPath);
    corpus.getStorage().mount(LOCAL, localAdapter);
    corpus.getStorage().setDefaultNamespace(LOCAL);

    final CdmEntityDefinition obj =
        corpus.<CdmEntityDefinition>fetchObjectAsync(
            "local:/entA.cdm.json/Entity A"
        ).join();
    final CdmTypeAttributeDefinition att = (CdmTypeAttributeDefinition) obj.getAttributes().get(0);
    List<CdmTraitReference> result = att.getAppliedTraits()
        .getAllItems()
        .parallelStream()
        .filter(x -> "is.constrained".equals(x.getNamedReference()))
        .collect(Collectors.toList());

    Assert.assertNotNull(result);
    Assert.assertEquals(new Integer(30), att.fetchMaximumLength());
    Assert.assertNull(att.fetchMaximumValue());

    att.updateMaximumLength(null);
    result = att.getAppliedTraits()
        .getAllItems()
        .parallelStream()
        .filter(x -> "is.constrained".equals(x.getNamedReference()))
        .collect(Collectors.toList());

    Assert.assertNull(att.fetchMaximumLength());
    Assert.assertEquals(0, result.size());
  }
}
