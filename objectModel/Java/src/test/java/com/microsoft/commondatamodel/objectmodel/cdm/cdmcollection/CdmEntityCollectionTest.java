package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import java.util.ArrayList;
import java.util.List;
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

    this.createDocumentForEntity(cdmCorpus, entity);

    final CdmEntityDefinition cdmEntity =
        new CdmEntityDefinition(cdmCorpus.getCtx(), "cdmEntityName", null);
    this.createDocumentForEntity(cdmCorpus, cdmEntity, "cdm");

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

    Assert.assertEquals(2, manifest.getEntities().getAllItems().size());
    Assert.assertEquals(localizedEntityDeclaration, manifest.getEntities().getAllItems().get(0));
    Assert.assertEquals(cdmEntityDeclaration, manifest.getEntities().getAllItems().get(1));
  }

  /**
   * Tests whether manifest.getEntities().add()
   * throws an exception when the associated document is not added.
   */
  @Test(expectedExceptions = IllegalArgumentException.class)
  public void testManifestCannotAddEntityWithoutDoc() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

    final CdmEntityDefinition entity =
        new CdmEntityDefinition(manifest.getCtx(), "entityName", null);

    manifest.getEntities().add(entity);
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

    this.createDocumentForEntity(manifest.getCtx().getCorpus(), entity);

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

    Assert.assertEquals(1, manifest.getEntities().getAllItems().size());
    Assert.assertEquals(entityDeclaration, manifest.getEntities().getAllItems().get(0));
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
      this.createDocumentForEntity(cdmCorpus, entity);
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
    this.createDocumentForEntity(manifest.getCtx().getCorpus(), entity);
    final CdmEntityDefinition otherEntity =
        new CdmEntityDefinition(manifest.getCtx(), "otherEntityName", null);
    this.createDocumentForEntity(manifest.getCtx().getCorpus(), otherEntity);

    manifest.getEntities().add(entity);
    manifest.getEntities().add(otherEntity);

    Assert.assertEquals(2, manifest.getEntities().getAllItems().size());

    boolean removed = manifest.getEntities().remove(entity);

    Assert.assertEquals(true, removed);
    Assert.assertEquals(1, manifest.getEntities().getAllItems().size());
    Assert.assertEquals(
        otherEntity.getEntityName(),
        manifest.getEntities().getAllItems().get(0).getEntityName());

    removed = manifest.getEntities().remove(entity);
    Assert.assertEquals(false, removed);
    Assert.assertEquals(1, manifest.getEntities().getAllItems().size());
  }

  /**
   * For an entity, it creates a document that will contain the entity.
   *
   * @param cdmCorpus The corpus everything belongs to.
   * @param entity    The entity we want a document for.
   * @return A document containing desired entity.
   */
  private CdmDocumentDefinition createDocumentForEntity(
      final CdmCorpusDefinition cdmCorpus,
      final CdmEntityDefinition entity) {
    return createDocumentForEntity(cdmCorpus, entity, "local");
  }

  /**
   * For an entity, it creates a document that will contain the entity.
   *
   * @param cdmCorpus The corpus everything belongs to.
   * @param entity    The entity we want a document for.
   * @param nameSpace The namespace of the adapter.
   * @return A document containing desired entity.
   */
  private CdmDocumentDefinition createDocumentForEntity(
      final CdmCorpusDefinition cdmCorpus,
      final CdmEntityDefinition entity,
      final String nameSpace) {
    final CdmFolderDefinition cdmFolderDef = cdmCorpus.getStorage().fetchRootFolder(nameSpace);
    final CdmDocumentDefinition entityDoc = cdmCorpus.makeObject(
        CdmObjectType.DocumentDef,
        entity.getEntityName() + ".cdm.json",
        false);

    cdmFolderDef.getDocuments().add(entityDoc);
    entityDoc.getDefinitions().add(entity);
    return entityDoc;
  }
}
