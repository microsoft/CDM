// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.entity;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.AttributeGroupPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.EntityPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.AttributeGroup;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutionException;
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

    final StorageAdapterBase localAdapter;
    localAdapter = new LocalAdapter(testInputPath);
    corpus.getStorage().mount(LOCAL, localAdapter);
    corpus.getStorage().setDefaultNamespace(LOCAL);

    final CdmEntityDefinition obj =
        corpus.<CdmEntityDefinition>fetchObjectAsync(
            "local:/entA.cdm.json/Entity A"
        ).join();
    final CdmTypeAttributeDefinition att = (CdmTypeAttributeDefinition) obj.getAttributes().get(0);
    List<CdmTraitReferenceBase> result = att.getAppliedTraits()
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

  /**
   * Testing special case where "this.attributes" attributes do not inherit the InDocument field because these attributes
   * are created during resolution (no inDocument propagation during resolution). This error appears when running copyData
   * with stringRefs = true in certain cases
   */
  @Test
  public void testFromAndToDataWithElevatedTraits() throws InterruptedException, ExecutionException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testFromAndToDataWithElevatedTraits");
    cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));
    cdmCorpus.setEventCallback((CdmStatusLevel level, String message) -> {
      Assert.assertFalse(message.contains("unable to resolve an entity"));
    }, CdmStatusLevel.Warning);
    final CdmEntityDefinition entity = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/Account.cdm.json/Account").get();
    CdmEntityDefinition resEntity = entity.createResolvedEntityAsync(String.format("%s_", entity.getEntityName())).get();
    final CopyOptions copyOptions = new CopyOptions();
    copyOptions.setIsStringRefs(true);
    EntityPersistence.toData(resEntity, new ResolveOptions(resEntity), copyOptions);
  }

  /**
   * Testing that loading entities with missing references logs warnings when the resolve option shallowValidation = true.
   */
  @Test
  public void testLoadingEntityWithShallowValidation() throws InterruptedException {
    CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingEntityWithShallowValidation");
    cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));
    cdmCorpus.setEventCallback((CdmStatusLevel level, String message) -> {
      // When messages regarding references not being resolved or loaded are logged, check that they are warnings and not errors.
      if (message.contains("Unable to resolve the reference") || message.contains("Could not read")) {
        Assert.assertEquals(level, CdmStatusLevel.Warning);
      }
    }, CdmStatusLevel.Warning);

    // Load entity with shallowValidation = true.
    cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/Entity.cdm.json/Entity", null, true).join();
    // Load resolved entity with shallowValidation = true.
    cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/ResolvedEntity.cdm.json/ResolvedEntity", null, true).join();
  }

  /**
   * Testing that loading entities with missing references logs errors when the resolve option shallowValidation = false.
   */
  @Test
  public void testLoadingEntityWithoutShallowValidation() throws InterruptedException, ExecutionException {
    CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingEntityWithShallowValidation");
    cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));
    cdmCorpus.setEventCallback((CdmStatusLevel level, String message) -> {
      // When messages regarding references not being resolved or loaded are logged, check that they are errors.
      if (message.contains("Unable to resolve the reference") || message.contains("Could not read")) {
        Assert.assertEquals(level, CdmStatusLevel.Error);
      }
    }, CdmStatusLevel.Warning);

    // Load entity with shallowValidation = false.
    cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/Entity.cdm.json/Entity").join();
    // Load resolved entity with shallowValidation = false.
    cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/ResolvedEntity.cdm.json/ResolvedEntity").join();
  }

  /**
   * 
   */
  public void testPersistAttributeGroupDefinition() {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    CdmAttributeGroupDefinition attGroup = new CdmAttributeGroupDefinition(corpus.getCtx(), "attGroup");
    AttributeGroup persistedGroup = (AttributeGroup) AttributeGroupPersistence.toData(attGroup,
        new ResolveOptions(attGroup.getInDocument()), new CopyOptions());
    Assert.assertNotNull(persistedGroup.getMembers());
  }
}

