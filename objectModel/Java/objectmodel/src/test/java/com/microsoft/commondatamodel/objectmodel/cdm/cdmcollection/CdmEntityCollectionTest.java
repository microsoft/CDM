// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.InterceptLog;
import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.Level;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmEntityCollectionTest {
  /**
   * Tests whether manifest.getEntities().add() can be used with {@link CdmEntityDefinition} parameter.
   */
  @Test
  public void testManifestAddEntityWithLocalizedPaths() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");
    final CdmCorpusDefinition cdmCorpus = manifest.getCtx().getCorpus();

    final CdmEntityDefinition entity =
        new CdmEntityDefinition(cdmCorpus.getCtx(), "entityName", null);
    entity.setExplanation("The explanation of the entity");

    CdmCollectionHelperFunctions.createDocumentForEntity(cdmCorpus, entity);

    final CdmEntityDefinition cdmEntity =
        new CdmEntityDefinition(cdmCorpus.getCtx(), "cdmEntityName", null);
    CdmCollectionHelperFunctions.createDocumentForEntity(cdmCorpus, cdmEntity, "cdm");

    final CdmEntityDeclarationDefinition localizedEntityDeclaration =
        manifest.getEntities().add(entity);
    final CdmEntityDeclarationDefinition cdmEntityDeclaration =
        manifest.getEntities().add(cdmEntity);

    Assert.assertEquals(
        "The explanation of the entity",
        localizedEntityDeclaration.getExplanation());
    Assert.assertEquals(
        "entityName.cdm.json/entityName",
        localizedEntityDeclaration.getEntityPath());
    Assert.assertEquals("entityName", localizedEntityDeclaration.getEntityName());
    Assert.assertEquals(
        "cdm:/cdmEntityName.cdm.json/cdmEntityName",
        cdmEntityDeclaration.getEntityPath());
    Assert.assertEquals("entityName", localizedEntityDeclaration.getEntityName());

    Assert.assertEquals(2, manifest.getEntities().getCount());
    Assert.assertEquals(localizedEntityDeclaration, manifest.getEntities().get(0));
    Assert.assertEquals(cdmEntityDeclaration, manifest.getEntities().get(1));
  }

  /**
   * Tests whether the EntityDefinition can be passed directly to manifest.getEntities().add().
   */
  @Test
  public void testManifestCanAddEntityDefinition() {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

    final CdmEntityDefinition entity = new CdmEntityDefinition(
        manifest.getCtx(),
        "entityName",
        null);

    CdmCollectionHelperFunctions.createDocumentForEntity(manifest.getCtx().getCorpus(), entity);

    final CdmEntityDeclarationDefinition entityDeclaration =
        manifest.getCtx().getCorpus().makeObject(
            CdmObjectType.LocalEntityDeclarationDef,
            entity.getEntityName(),
            false);
    entityDeclaration.setEntityPath(
        entity.getOwner().getAtCorpusPath() + "/" + entity.getEntityName()
    );

    manifest.getEntities().add(entityDeclaration);

    Assert.assertEquals("local:/entityName.cdm.json/entityName", entityDeclaration.getEntityPath());
    Assert.assertEquals("entityName", entityDeclaration.getEntityName());

    Assert.assertEquals(1, manifest.getEntities().getCount());
    Assert.assertEquals(entityDeclaration, manifest.getEntities().get(0));
  }

  /**
   * Tests whether the EntityDefinition can be passed directly to Manifest.Entities.Add().
   */
  @Test
  public void testManifestCannotAddEntityDefinitionWithoutCreatingDocument() {
    // Use try-with-resources to ensure that interceptLog is removed after the test to not interrupt
    // with other tests.
    try (final InterceptLog interceptLog = new InterceptLog(CdmEntityCollection.class)) {
      final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
      cdmCorpus.getStorage().setDefaultNamespace("local");

      cdmCorpus.getStorage().mount("local", new LocalAdapter("C:\\Root\\Path"));

      final CdmManifestDefinition manifest =
          new CdmManifestDefinition(cdmCorpus.getCtx(), "manifest");
      manifest.setFolderPath("/");
      manifest.setNamespace("local");

      final CdmEntityDefinition entity =
          new CdmEntityDefinition(manifest.getCtx(), "entityName", null);

      manifest.getEntities().add(entity);

      // User verifyNumLogEvents(int) to ensure that logs are captured.
      interceptLog.verifyNumLogEvents(1);
      interceptLog.assertLoggedLevel(Level.ERROR);
      interceptLog.assertLoggedMessage("Expected entity to have an \"Owner\" document set. Cannot create entity declaration to add to manifest.");
      Assert.assertEquals(0, manifest.getEntities().getCount());
    }
  }

  @Test
  public void testManifestAddListOfEntityDeclarations() {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");

    cdmCorpus.getStorage().mount("local", new LocalAdapter("CdmCorpus/LocalPath"));

    final CdmCorpusContext ctx = cdmCorpus.getCtx();

    final CdmDocumentDefinition cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
    final CdmEntityCollection collection = new CdmEntityCollection(ctx, cdmDocument);

    final List<CdmEntityDefinition> entityList = new ArrayList<>();

    for (int i = 0; i < 2; i++) {
      final CdmEntityDefinition entity =
          new CdmEntityDefinition(cdmCorpus.getCtx(), "entityName_" + i, null);
      CdmCollectionHelperFunctions.createDocumentForEntity(cdmCorpus, entity);
      entityList.add(entity);
    }

    Assert.assertEquals(0, collection.size());

    collection.addAll(entityList);

    Assert.assertEquals(2, collection.size());

    for (int i = 0; i < 2; i++) {
      Assert.assertEquals("entityName_" + i, collection.get(i).getEntityName());
    }
  }

  @Test
  public void testCdmEntityCollectionRemoveEntityDeclarationDefinition() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");
    final CdmEntityDefinition entity =
        new CdmEntityDefinition(manifest.getCtx(), "entityName", null);
    CdmCollectionHelperFunctions.createDocumentForEntity(manifest.getCtx().getCorpus(), entity);
    final CdmEntityDefinition otherEntity =
        new CdmEntityDefinition(manifest.getCtx(), "otherEntityName", null);
    CdmCollectionHelperFunctions.createDocumentForEntity(manifest.getCtx().getCorpus(), otherEntity);

    manifest.getEntities().add(entity);
    manifest.getEntities().add(otherEntity);

    Assert.assertEquals(2, manifest.getEntities().getCount());

    boolean removed = manifest.getEntities().remove(entity);

    Assert.assertTrue(removed);
    Assert.assertEquals(1, manifest.getEntities().getCount());
    Assert.assertEquals(
        otherEntity.getEntityName(),
        manifest.getEntities().get(0).getEntityName());

    removed = manifest.getEntities().remove(entity);
    Assert.assertFalse(removed);
    Assert.assertEquals(1, manifest.getEntities().getCount());
  }
}
