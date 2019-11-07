package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmCollectionTest {
  @Test
  public void testCdmCollectionAddMethod() {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");
    cdmCorpus.getStorage().mount("local", new LocalAdapter("CdmCorpus/LocalPath"));

    final CdmCorpusContext ctx = cdmCorpus.getCtx();

    final CdmDocumentDefinition cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
    final CdmCollection<CdmAttributeContext> collection =
        new CdmCollection(ctx, cdmDocument, CdmObjectType.AttributeContextDef);

    final CdmAttributeContext addedAttributeContext = collection.add("nameOfNewAttribute");
    Assert.assertEquals(1, collection.getAllItems().size());
    Assert.assertEquals("nameOfNewAttribute", collection.getAllItems().get(0).getName());
    Assert.assertEquals(cdmDocument, collection.get(0).getOwner());
    Assert.assertEquals(ctx, collection.get(0).getCtx());

    Assert.assertEquals(collection.getAllItems().get(0), addedAttributeContext);

    final CdmAttributeContext attributeContext = new CdmAttributeContext(ctx, "NameOfAttributeContext");
    final CdmAttributeContext addedAttribute = collection.add(attributeContext);
    Assert.assertEquals(2, collection.getAllItems().size());
    Assert.assertEquals(attributeContext, addedAttribute);
    Assert.assertEquals(attributeContext, collection.getAllItems().get(1));
    Assert.assertEquals(cdmDocument, attributeContext.getOwner());
  }

  @Test
  public void testCdmCollectionRemoveMethod() {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");
    cdmCorpus.getStorage().mount("local", new LocalAdapter("CdmCorpus/LocalPath"));

    final CdmCorpusContext ctx = cdmCorpus.getCtx();

    final CdmDocumentDefinition cdmDocument =
        new CdmDocumentDefinition(ctx, "NameOfDocument");
    final CdmCollection<CdmAttributeContext> collection =
        new CdmCollection(ctx, cdmDocument, CdmObjectType.AttributeContextDef);

    final CdmObject addedDocument = collection.add("nameOfNewDocument");
    final CdmObject addedDocument2 = collection.add("otherDocument");

    Assert.assertEquals(2, collection.getCount());

    boolean removed = collection.remove(addedDocument);
    Assert.assertEquals(true, removed);

    // try to remove a second time.
    removed = collection.remove(addedDocument);
    Assert.assertEquals(false, removed);
    Assert.assertEquals(1, collection.getCount());
  }

  @Test
  public void testCdmCollectionRemoveAt() {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");
    cdmCorpus.getStorage().mount("local", new LocalAdapter("CdmCorpus/LocalPath"));
    final CdmCorpusContext ctx = cdmCorpus.getCtx();
    final CdmDocumentDefinition cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
    final CdmCollection collection = new CdmCollection<CdmAttributeContext>(ctx, cdmDocument, CdmObjectType.AttributeContextDef);
    final CdmObject addedDocument = collection.add("nameOfNewDocument");
    final CdmObject addedDocument2 = collection.add("otherDocument");
    Assert.assertEquals(2, collection.size());
    collection.removeAt(0);
    Assert.assertEquals(1, collection.size());
    Assert.assertEquals(addedDocument2, collection.get(0));
    collection.removeAt(1);
    Assert.assertEquals(1, collection.size());
    Assert.assertEquals(addedDocument2, collection.get(0));
    collection.removeAt(0);
    Assert.assertEquals(0, collection.size());
  }

  @Test
  public void testCdmCollectionAddingList() {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");
    cdmCorpus.getStorage().mount("local", new LocalAdapter("CdmCorpus/LocalPath"));

    final CdmCorpusContext ctx = cdmCorpus.getCtx();

    final CdmDocumentDefinition cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
    final CdmCollection<CdmEntityDeclarationDefinition> collection =
        new CdmCollection(ctx, cdmDocument, CdmObjectType.LocalEntityDeclarationDef);

    final List<CdmEntityDeclarationDefinition> entityList = new ArrayList<>();

    for (int i = 0; i < 2; i++) {
      final CdmEntityDefinition entity =
          new CdmEntityDefinition(cdmCorpus.getCtx(), "entityName_" + i, null);

      this.createDocumentForEntity(cdmCorpus, entity);

      final CdmEntityDeclarationDefinition entityDeclaration =
          cdmCorpus.makeObject(
              CdmObjectType.LocalEntityDeclarationDef,
              entity.getEntityName(),
              false);
      entityDeclaration.setOwner(entity.getOwner());
      entityDeclaration.setEntityPath(entity.getOwner().getAtCorpusPath() + "/" + entity.getEntityName());

      entityList.add(entityDeclaration);
    }
    Assert.assertEquals(0, collection.getCount());

    collection.addAll(entityList);

    Assert.assertEquals(2, collection.getCount());

    for (int i = 0; i < 2; i++) {
      Assert.assertEquals("entityName_" + i, collection.get(i).getEntityName());
    }
  }

  @Test
  public void testCdmCollectionChangeMakesDocumentDirty() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/nothing");
    final CdmCollection<CdmEntityReference> collection =
        new CdmCollection<>(manifest.getCtx(), manifest, CdmObjectType.EntityRef);

    manifest.setDirty(false);
    collection.add(new CdmEntityReference(manifest.getCtx(), "name", false));
    Assert.assertTrue(manifest.isDirty());
    manifest.setDirty(false);
    collection.add("theName");
    Assert.assertTrue(manifest.isDirty());
    final CdmEntityReference entity = new CdmEntityReference(
        manifest.getCtx(),
        "otherEntity",
        false);
    final List<CdmEntityReference> entityList = Collections.singletonList(entity);
    manifest.setDirty(false);
    collection.addAll(entityList);
    Assert.assertTrue(manifest.isDirty());
    manifest.setDirty(false);
    final CdmEntityReference entity2 = new CdmEntityReference(
        manifest.getCtx(),
        "otherEntity2",
        false);
    collection.add(0, entity2);
    Assert.assertTrue(manifest.isDirty());

    manifest.setDirty(false);
    collection.remove(entity);
    Assert.assertTrue(manifest.isDirty());

    manifest.setDirty(false);
    collection.removeAt(0);
    Assert.assertTrue(manifest.isDirty());

    manifest.setDirty(false);
    collection.clear();
    Assert.assertTrue(manifest.isDirty());
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
   * @param nameSpace The nameSpace of the adapter.
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
