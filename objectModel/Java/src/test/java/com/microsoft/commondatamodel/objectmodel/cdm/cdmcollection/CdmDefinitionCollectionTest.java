package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmDefinitionCollectionTest {
  @Test
  public void testCdmDefinitionCollectionAdd() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    document.setDirty(false);

    final CdmAttributeContext attribute = new CdmAttributeContext(document.getCtx(), "the attribute");
    final CdmFolderDefinition folder = new CdmFolderDefinition(document.getCtx(), "The folder");
    final CdmTraitDefinition trait =
        new CdmTraitDefinition(document.getCtx(), "The trait", null);

    final CdmObjectDefinition addedAttribute = document.getDefinitions().add(attribute);
    final CdmObjectDefinition addedFolder = document.getDefinitions().add(folder);
    final CdmObjectDefinition addedTrait = document.getDefinitions().add(trait);

    Assert.assertTrue(document.isDirty());
    Assert.assertEquals(3, document.getDefinitions().getCount());
    Assert.assertEquals(attribute, addedAttribute);
    Assert.assertEquals(folder, addedFolder);
    Assert.assertEquals(trait, addedTrait);
    Assert.assertEquals(attribute, document.getDefinitions().get(0));
    Assert.assertEquals(folder, document.getDefinitions().get(1));
    Assert.assertEquals(trait, document.getDefinitions().get(2));
    Assert.assertEquals(document, attribute.getInDocument());
    Assert.assertEquals(document, trait.getInDocument());
    Assert.assertEquals(document, attribute.getOwner());
    Assert.assertEquals(document, folder.getOwner());
    Assert.assertEquals(document, trait.getOwner());
  }

  @Test
  public void testCdmDefinitionCollectionInsert() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");

    final CdmEntityDefinition ent1 = document.getDefinitions().add("ent1");
    final CdmEntityDefinition ent2 = document.getDefinitions().add("ent2");

    document.setDirty(false);

    final CdmAttributeContext attribute =
        new CdmAttributeContext(document.getCtx(), "the attribute");

    document.getDefinitions().add(0, attribute);

    Assert.assertEquals(3, document.getDefinitions().getCount());
    Assert.assertTrue(document.isDirty());
    Assert.assertEquals(attribute, document.getDefinitions().get(0));
    Assert.assertEquals(document, attribute.getInDocument());
    Assert.assertEquals(document, attribute.getOwner());
    Assert.assertEquals(ent1, document.getDefinitions().get(1));
    Assert.assertEquals(ent2, document.getDefinitions().get(2));
  }

  @Test
  public void TestCdmDefinitionCollectionAddEntityByProvidingName() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    document.setDirty(false);

    final CdmEntityDefinition entity = document.getDefinitions().add("theNameOfTheEntity");
    Assert.assertTrue(document.isDirty());
    Assert.assertEquals(entity, document.getDefinitions().get(0));
    Assert.assertEquals(document, entity.getInDocument());
    Assert.assertEquals(document, entity.getOwner());
    Assert.assertEquals("theNameOfTheEntity", entity.getEntityName());
  }

  @Test
  public void testCdmDefinitionCollectionAddByProvidingTypeAndName() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    document.setDirty(false);

    final CdmObjectDefinition attribute =
        document.getDefinitions().add(CdmObjectType.AttributeContextDef, "Name of attribute");
    final CdmObjectDefinition trait =
        document.getDefinitions().add(CdmObjectType.TraitDef, "Name of trait");

    Assert.assertTrue(document.isDirty());
    Assert.assertEquals(attribute, document.getDefinitions().get(0));
    Assert.assertEquals(trait, document.getDefinitions().get(1));
    Assert.assertEquals(document, attribute.getInDocument());
    Assert.assertEquals(document, attribute.getOwner());
    Assert.assertEquals(document, trait.getInDocument());
    Assert.assertEquals(document, trait.getOwner());
  }

  @Test
  public void testCdmDefinitionCollectionAddRange() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    document.setDirty(false);

    final CdmAttributeContext attribute = new CdmAttributeContext(document.getCtx(), "the attribute");
    final CdmFolderDefinition folder = new CdmFolderDefinition(document.getCtx(), "The folder");
    final CdmTraitDefinition trait =
        new CdmTraitDefinition(document.getCtx(), "The trait", null);

    final List<CdmObjectDefinition> definitionList = Arrays.asList(attribute, folder, trait);
    document.getDefinitions().addAll(definitionList);

    Assert.assertTrue(document.isDirty());
    Assert.assertEquals(3, document.getDefinitions().getCount());
    Assert.assertEquals(attribute, document.getDefinitions().get(0));
    Assert.assertEquals(folder, document.getDefinitions().get(1));
    Assert.assertEquals(trait, document.getDefinitions().get(2));
    Assert.assertEquals(document, attribute.getInDocument());
    Assert.assertEquals(document, trait.getInDocument());
    Assert.assertEquals(document, attribute.getOwner());
    Assert.assertEquals(document, folder.getOwner());
    Assert.assertEquals(document, trait.getOwner());
  }

  @Test
  public void testDocumentCollectionRemoveAt() {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest("c:/Root/Path");
    final CdmFolderDefinition folder = new CdmFolderDefinition(manifest.getCtx(), "Folder");
    folder.setCorpus(manifest.getCtx().getCorpus());
    folder.setFolderPath("FolderPath/");
    folder.setNamespace("Namespace");
    final CdmDocumentDefinition document = folder.getDocuments().add("DocumentName");
    final CdmDocumentDefinition document2 = folder.getDocuments().add("DocumentName2");
    final CdmDocumentDefinition document3 = folder.getDocuments().add("DocumentName3");
    Assert.assertEquals(manifest.getCtx().getCorpus().getAllDocuments().size(), 3);
    Assert.assertTrue(manifest.getCtx().getCorpus().getAllDocuments().contains(new ImmutablePair<>(folder, document)));
    Assert.assertTrue(manifest.getCtx().getCorpus().getAllDocuments().contains(new ImmutablePair<>(folder, document2)));
    Assert.assertTrue(manifest.getCtx().getCorpus().getAllDocuments().contains(new ImmutablePair<>(folder, document3)));
    Assert.assertEquals(folder.getDocumentLookup().size(), 3);
    Assert.assertTrue(folder.getDocumentLookup().containsKey(document.getName()));
    Assert.assertTrue(folder.getDocumentLookup().containsKey(document2.getName()));
    Assert.assertTrue(folder.getDocumentLookup().containsKey(document3.getName()));
    folder.getDocuments().removeAt(1);
    folder.getDocuments().remove("DocumentName");
    folder.getDocuments().remove(document3);
    Assert.assertEquals(manifest.getCtx().getCorpus().getAllDocuments().size(), 0);
    Assert.assertFalse(manifest.getCtx().getCorpus().getAllDocuments().contains(new ImmutablePair<>(folder, document)));
    Assert.assertFalse(manifest.getCtx().getCorpus().getAllDocuments().contains(new ImmutablePair<>(folder, document2)));
    Assert.assertFalse(manifest.getCtx().getCorpus().getAllDocuments().contains(new ImmutablePair<>(folder, document3)));
    Assert.assertEquals(folder.getDocumentLookup().size(), 0);
    Assert.assertFalse(folder.getDocumentLookup().containsKey(document.getName()));
    Assert.assertFalse(folder.getDocumentLookup().containsKey(document2.getName()));
    Assert.assertFalse(folder.getDocumentLookup().containsKey(document3.getName()));
  }
}
