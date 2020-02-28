// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.entity;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectReferenceBase;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.EntityPersistence;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.InterceptLog;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.core.LogEvent;
import org.mockito.Mockito;
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

  /**
   * Testing special case where "this.attributes" attributes do not inherit the InDocument field because these attributes
   * are created during resolution (no inDocument propagation during resolution). This error appears when running copyData
   * with stringRefs = true in certain cases
   */
  public void testFromAndToDataWithElevatedTraits() throws InterruptedException, ExecutionException {
    try (final InterceptLog interceptLog = new InterceptLog(CdmObjectReferenceBase.class, Level.WARN)) {
      final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testFromAndToDataWithElevatedTraits", null);
      cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));
      final CdmEntityDefinition entity = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/Account.cdm.json/Account").get();
      CdmEntityDefinition resEntity = entity.createResolvedEntityAsync(String.format("%s_", entity.getEntityName())).get();
      final CopyOptions copyOptions = new CopyOptions();
      copyOptions.setIsStringRefs(true);
      EntityPersistence.toData(resEntity, new ResolveOptions(resEntity), copyOptions);

      interceptLog.verifyNumLogEvents(0);
    }
  }

  /**
   * Testing that loading entities with missing references logs warnings when the resolve option shallowValidation = true.
   */
  @Test
  public void testLoadingEntityWithShallowValidation() throws InterruptedException, ExecutionException {
    // First, check all logs from CdmCorpusDefinition.
    try (final InterceptLog interceptLog = new InterceptLog(CdmCorpusDefinition.class, Level.WARN)) {
      CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingEntityWithShallowValidation", null);
      cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));

      // Load entity with shallowValidation = true.
      cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/Entity.cdm.json/Entity", null, true).join();
      // Load resolved entity with shallowValidation = true.
      cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/ResolvedEntity.cdm.json/ResolvedEntity", null, true).join();

      Mockito.verify(interceptLog.getAppender(), Mockito.atLeast(1)).append(interceptLog.getLogEventCaptor().capture());

      // Verify that messages regarding references not being resolved are logged as warnings.
      for (LogEvent logEvent : interceptLog.getLogEventCaptor().getAllValues()) {
        if (logEvent.getMessage().getFormattedMessage().contains("Unable to resolve the reference")) {
          Assert.assertEquals(logEvent.getLevel(), Level.WARN);
        }
      }
    }

    // Now check all logs from PersistenceLayer.
    try (final InterceptLog interceptLog = new InterceptLog(PersistenceLayer.class, Level.WARN)) {
      CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingEntityWithShallowValidation", null);
      cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));

      // Load entity with shallowValidation = true.
      cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/Entity.cdm.json/Entity", null, true).join();
      // Load resolved entity with shallowValidation = true.
      cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/ResolvedEntity.cdm.json/ResolvedEntity", null, true).join();

      Mockito.verify(interceptLog.getAppender(), Mockito.atLeast(1)).append(interceptLog.getLogEventCaptor().capture());

      // Verify that messages regarding referenced documents not being loaded are logged as warnings.
      for (LogEvent logEvent : interceptLog.getLogEventCaptor().getAllValues()) {
        if (logEvent.getMessage().getFormattedMessage().contains("Could not read")) {
          Assert.assertEquals(logEvent.getLevel(), Level.WARN);
        }
      }
    }
  }

  /**
   * Testing that loading entities with missing references logs errors when the resolve option shallowValidation = false.
   */
  @Test
  public void testLoadingEntityWithoutShallowValidation() throws InterruptedException, ExecutionException {
    // First, check all logs from CdmCorpusDefinition.
    try (final InterceptLog interceptLog = new InterceptLog(CdmCorpusDefinition.class, Level.WARN)) {
      CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingEntityWithShallowValidation", null);
      cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));

      // Load entity with shallowValidation = false.
      cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/Entity.cdm.json/Entity").join();
      // Load resolved entity with shallowValidation = false.
      cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/ResolvedEntity.cdm.json/ResolvedEntity").join();

      Mockito.verify(interceptLog.getAppender(), Mockito.atLeast(1)).append(interceptLog.getLogEventCaptor().capture());

      // Verify that messages regarding references not being resolved are logged as errors.
      for (LogEvent logEvent : interceptLog.getLogEventCaptor().getAllValues()) {
        if (logEvent.getMessage().getFormattedMessage().contains("Unable to resolve the reference")) {
          Assert.assertEquals(logEvent.getLevel(), Level.ERROR);
        }
      }
    }

    // Now check all logs from PersistenceLayer.
    try (final InterceptLog interceptLog = new InterceptLog(PersistenceLayer.class, Level.WARN)) {
      CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingEntityWithShallowValidation", null);
      cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));

      // Load entity with shallowValidation = false.
      cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/Entity.cdm.json/Entity").join();
      // Load resolved entity with shallowValidation = false.
      cdmCorpus.<CdmEntityDefinition>fetchObjectAsync("local:/ResolvedEntity.cdm.json/ResolvedEntity").join();

      Mockito.verify(interceptLog.getAppender(), Mockito.atLeast(1)).append(interceptLog.getLogEventCaptor().capture());

      // Verify that messages regarding referenced documents not being loaded are logged as errors.
      for (LogEvent logEvent : interceptLog.getLogEventCaptor().getAllValues()) {
        if (logEvent.getMessage().getFormattedMessage().contains("Could not read")) {
          Assert.assertEquals(logEvent.getLevel(), Level.ERROR);
        }
      }
    }
  }
}

