package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import java.util.ArrayList;
import java.util.List;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ManifestTest {
  /**
   * Tests whether Manifest.Entities.Add() can be used with <see cref="ICdmEntityDef"/> parameter.
   */
  @Test
  public void TestManifestAddEntityWithLocalizedPaths() {
    final CdmCorpusDefinition cdmCorpus = generateCorpusImpl("C:/Root/Path");
    // add cdm namespace
    cdmCorpus.getStorage().mount("cdm", new LocalAdapter("C:/Root/Path"));
    final CdmCorpusContext ctx = cdmCorpus.getCtx();

    final CdmManifestDefinition manifest = new CdmManifestDefinition(cdmCorpus.getCtx(), "manifest");
    manifest.setFolderPath("/");
    manifest.setNamespace("local");
    final CdmEntityDefinition entity = new CdmEntityDefinition(ctx, "entityName", null);
    entity.setExplanation("The explanation of the entity");
    this.createDocumentForEntity(cdmCorpus, entity);

    final CdmEntityDefinition cdmEntity = new CdmEntityDefinition(ctx, "cdmEntityName", null);
    this.createDocumentForEntity(cdmCorpus, cdmEntity, "cdm");

    final CdmEntityDeclarationDefinition localizedEntityDeclaration = manifest.getEntities().add(entity);
    final CdmEntityDeclarationDefinition cdmEntityDeclaration = manifest.getEntities().add(cdmEntity);

    Assert.assertEquals("The explanation of the entity", localizedEntityDeclaration.getExplanation());
    Assert.assertEquals("entityName.cdm.json/entityName", localizedEntityDeclaration.getEntityPath());
    Assert.assertEquals("entityName", localizedEntityDeclaration.getEntityName());
    Assert.assertEquals("cdm:/cdmEntityName.cdm.json/cdmEntityName", cdmEntityDeclaration.getEntityPath());
    Assert.assertEquals("entityName", localizedEntityDeclaration.getEntityName());

    Assert.assertEquals(2, manifest.getEntities().getAllItems().size());
    Assert.assertEquals(localizedEntityDeclaration, manifest.getEntities().getAllItems().get(0));
    Assert.assertEquals(cdmEntityDeclaration, manifest.getEntities().getAllItems().get(1));
  }

  /**
   * Tests whether the EntityDefinition can be passed directly to manifest.getEntities().add().
   */
  @Test
  public void testManifestCanAddEntityDefinition() {
    final CdmCorpusDefinition cdmCorpus = generateCorpusImpl("CdmCorpus/LocalPath");
    final CdmCorpusContext ctx = cdmCorpus.getCtx();
    final CdmManifestDefinition manifest = new CdmManifestDefinition(ctx, "manifest");
    final CdmEntityDefinition entity = new CdmEntityDefinition(ctx, "entityName", null);

    this.createDocumentForEntity(cdmCorpus, entity);

    CdmEntityDeclarationDefinition entityDeclaration = cdmCorpus.makeObject(CdmObjectType.LocalEntityDeclarationDef, entity.getEntityName(), false);
    entityDeclaration.setEntityPath(entity.getOwner().getAtCorpusPath() + "/" + entity.getEntityName());

    manifest.getEntities().add(entityDeclaration);

    Assert.assertEquals("local:/entityName.cdm.json/entityName", entityDeclaration.getEntityPath());
    Assert.assertEquals("entityName", entityDeclaration.getEntityName());

    Assert.assertEquals(1, manifest.getEntities().getAllItems().size());
    Assert.assertEquals(entityDeclaration, manifest.getEntities().getAllItems().get(0));
  }

  @Test
  public void testManifestAddListOfEntityDeclarations() {
    final CdmCorpusDefinition cdmCorpus = generateCorpusImpl("CdmCorpus/LocalPath");
    final CdmCorpusContext ctx = cdmCorpus.getCtx();

    final CdmDocumentDefinition cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
    final CdmEntityCollection collection = new CdmEntityCollection(ctx, cdmDocument);

    List<CdmEntityDefinition> entityList = new ArrayList<>();

    for (int i = 0; i < 2; i++) {
      final CdmEntityDefinition entity = new CdmEntityDefinition(ctx, "entityName_" + i, null);
      this.createDocumentForEntity(cdmCorpus, entity);
      entityList.add(entity);
    }

    Assert.assertEquals(0, collection.getCount());

    collection.addAll(entityList);

    Assert.assertEquals(2, collection.getCount());

    for (int i = 0; i < 2; i++) {
      Assert.assertEquals("entityName_" + i, collection.get(i).getEntityName());
    }
  }

  @Test
  public void testCdmCollectionAddMethod() {
    final CdmCorpusDefinition cdmCorpus = generateCorpusImpl("CdmCorpus/LocalPath");
    final CdmCorpusContext ctx = cdmCorpus.getCtx();

    final CdmDocumentDefinition cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
    final CdmCollection<CdmAttributeContext> collection =
        new CdmCollection<>(ctx, cdmDocument, CdmObjectType.AttributeContextDef);

    Object addedDocument = collection.add("nameOfNewDocument");
    Assert.assertEquals(1, collection.getAllItems().size());
    Assert.assertEquals("nameOfNewDocument", collection.getAllItems().get(0).getName());
    Assert.assertEquals(cdmDocument, collection.get(0).getOwner());
    Assert.assertEquals(ctx, collection.get(0).getCtx());
    Assert.assertEquals(addedDocument, collection.getAllItems().get(0));
  }

  @Test
  public void testCdmCollectionAddingList() {
    final CdmCorpusDefinition cdmCorpus = generateCorpusImpl("CdmCorpus/LocalPath");
    final CdmCorpusContext ctx = cdmCorpus.getCtx();

    final CdmDocumentDefinition cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
    final CdmCollection<CdmEntityDeclarationDefinition> collection =
        new CdmCollection<>(ctx, cdmDocument, CdmObjectType.LocalEntityDeclarationDef);

    List<CdmEntityDeclarationDefinition> entityList = new ArrayList<>();

    for (int i = 0; i < 2; i++) {
      final CdmEntityDefinition entity = new CdmEntityDefinition(ctx, "entityName_" + i, null);

      this.createDocumentForEntity(cdmCorpus, entity);

      final CdmEntityDeclarationDefinition entityDeclaration = cdmCorpus.makeObject(CdmObjectType.LocalEntityDeclarationDef, entity.getEntityName(), false);
      entityDeclaration.setOwner(entity.getOwner());
      entityDeclaration.setEntityPath(entity.getOwner().getAtCorpusPath() + "/" + entity.getEntityName());

      entityList.add(entityDeclaration);
    }
    Assert.assertEquals(0, collection.size());

    collection.addAll(entityList);

    Assert.assertEquals(2, collection.size());

    for (int i = 0; i < 2; i++) {
      Assert.assertEquals("entityName_" + i, collection.get(i).getEntityName());
    }
  }

  /**
   * For an entity, it creates a document that will contain the entity.
   * @param cdmCorpus The corpus everything belongs to.
   * @param entity The entity we want a document for.
   * @return A document containing desired entity.
   */
  private CdmDocumentDefinition createDocumentForEntity(
      CdmCorpusDefinition cdmCorpus,
      CdmEntityDefinition entity) {
    return createDocumentForEntity(cdmCorpus, entity, "local");
  }

  /**
   * For an entity, it creates a document that will contain the entity.
   * @param cdmCorpus The corpus everything belongs to.
   * @param entity The entity we want a document for.
   * @param nameSpace The namespace for the adapter
   * @return A document containing desired entity.
   */
  private CdmDocumentDefinition createDocumentForEntity(CdmCorpusDefinition cdmCorpus, CdmEntityDefinition entity, String nameSpace) {
    final CdmFolderDefinition cdmFolderDef = cdmCorpus.getStorage().fetchRootFolder(nameSpace);
    final CdmDocumentDefinition entityDoc = cdmCorpus.makeObject(
        CdmObjectType.DocumentDef,
        entity.getEntityName() + ".cdm.json",
        false);

    cdmFolderDef.getDocuments().add(entityDoc);
    entityDoc.getDefinitions().add(entity);
    return entityDoc;
  }

  /**
   * Creates a Corpus used for the tests.
   * @param localRootPath A String used as root path for "local" namespace.
   * @return Created corpus.
   */
  private CdmCorpusDefinition generateCorpusImpl(String localRootPath) {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");
    cdmCorpus.getStorage().mount("local", new LocalAdapter(localRootPath));
    return cdmCorpus;
  }
}
