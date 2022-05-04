// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmDocumentCollectionTest {

  @Test
  public void testDocumentCollectionAdd() throws InterruptedException {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest();

    final CdmFolderDefinition folder = new CdmFolderDefinition(manifest.getCtx(), "Folder");
    folder.setCorpus(manifest.getCtx().getCorpus());
    folder.setFolderPath("FolderPath/");
    folder.setNamespace("Namespace");
    final CdmDocumentDefinition document =
        new CdmDocumentDefinition(manifest.getCtx(), "DocumentName");

    Assert.assertEquals(0, folder.getDocuments().getCount());
    final CdmDocumentDefinition addedDocument = folder.getDocuments().add(document);

    Assert.assertEquals(1, folder.getDocuments().getCount());
    Assert.assertEquals(document, folder.getDocuments().get(0));
    Assert.assertEquals(document, addedDocument);
    Assert.assertEquals("FolderPath/", document.getFolderPath());
    Assert.assertEquals(folder, document.getOwner());
    Assert.assertEquals("Namespace", document.getNamespace());
    Assert.assertTrue(document.getNeedsIndexing());

    final CdmDocumentDefinition doc = folder.getDocuments().add(document);
    Assert.assertNull(doc);
  }

  @Test
  public void testDocumentCollectionInsert() throws InterruptedException {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest();

    final CdmFolderDefinition folder = new CdmFolderDefinition(manifest.getCtx(), "Folder");
    folder.setInDocument(manifest);
    folder.setCorpus(manifest.getCtx().getCorpus());
    folder.setFolderPath("FolderPath/");
    folder.setNamespace("Namespace");

    final CdmDocumentDefinition document =
        new CdmDocumentDefinition(manifest.getCtx(), "DocumentName");

    final CdmDocumentDefinition doc1 = folder.getDocuments().add("doc1");
    final CdmDocumentDefinition doc2 = folder.getDocuments().add("doc2");

    manifest.setDirty(false);

    folder.getDocuments().add(2, document);
    Assert.assertTrue(manifest.isDirty());
    Assert.assertEquals(3, folder.getDocuments().getCount());
    Assert.assertEquals(doc1, folder.getDocuments().get(0));
    Assert.assertEquals(doc2, folder.getDocuments().get(1));
    Assert.assertEquals(document, folder.getDocuments().get(2));

    Assert.assertEquals("FolderPath/", document.getFolderPath());
    Assert.assertEquals(folder, document.getOwner());
    Assert.assertEquals("Namespace", document.getNamespace());
    Assert.assertTrue(document.getNeedsIndexing());
    Assert.assertEquals(folder, document.getOwner());
    Assert.assertTrue(folder.getDocumentLookup().containsKey(document.getName()));
    Assert.assertTrue(manifest.getCtx().getCorpus()
        .getDocumentLibrary()
        .contains(ImmutablePair.of(folder, document)));
    
    folder.getDocuments().add(2, document);
    Assert.assertEquals(3, folder.getDocuments().getCount());
  }

  @Test
  public void testDocumentCollectionAddWithDocumentName() throws InterruptedException {

    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest();

    final CdmFolderDefinition folder = new CdmFolderDefinition(manifest.getCtx(), "Folder");
    folder.setCorpus(manifest.getCtx().getCorpus());
    folder.setFolderPath("FolderPath/");
    folder.setNamespace("Namespace");

    Assert.assertEquals(0, folder.getDocuments().getCount());
    final CdmDocumentDefinition document = folder.getDocuments().add("DocumentName");
    Assert.assertEquals(1, folder.getDocuments().getCount());

    Assert.assertEquals("DocumentName", document.getName());
    Assert.assertEquals(document, folder.getDocuments().get(0));
    Assert.assertEquals("FolderPath/", document.getFolderPath());
    Assert.assertEquals(folder, document.getOwner());
    Assert.assertEquals("Namespace", document.getNamespace());
    Assert.assertTrue(document.getNeedsIndexing());
  }

  @Test
  public void testDocumentCollectionAddAll() throws InterruptedException {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest();

    final CdmFolderDefinition folder = new CdmFolderDefinition(manifest.getCtx(), "Folder");
    folder.setCorpus(manifest.getCtx().getCorpus());
    folder.setFolderPath("FolderPath/");
    folder.setNamespace("Namespace");

    Assert.assertEquals(0, folder.getDocuments().getCount());

    final CdmDocumentDefinition document =
        new CdmDocumentDefinition(manifest.getCtx(), "DocumentName");
    final CdmDocumentDefinition document2 =
        new CdmDocumentDefinition(manifest.getCtx(), "DocumentName2");

    final List<CdmDocumentDefinition> documentList = Arrays.asList(document, document2);
    folder.getDocuments().addAll(documentList);
    Assert.assertEquals(2, folder.getDocuments().getCount());
    Assert.assertEquals(document, folder.getDocuments().get(0));
    Assert.assertEquals(document2, folder.getDocuments().get(1));

    Assert.assertEquals("DocumentName", document.getName());
    Assert.assertEquals(document, folder.getDocuments().get(0));
    Assert.assertEquals("FolderPath/", document.getFolderPath());
    Assert.assertEquals(folder, document.getOwner());
    Assert.assertEquals("Namespace", document.getNamespace());
    Assert.assertTrue(document.getNeedsIndexing());

    Assert.assertEquals("DocumentName2", document2.getName());
    Assert.assertEquals("FolderPath/", document2.getFolderPath());
    Assert.assertEquals(folder, document2.getOwner());
    Assert.assertEquals("Namespace", document2.getNamespace());
    Assert.assertTrue(document2.getNeedsIndexing());
  }

  @Test
  public void testDocumentCollectionRemove() throws InterruptedException {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest();

    final CdmFolderDefinition folder = new CdmFolderDefinition(manifest.getCtx(), "Folder");
    folder.setCorpus(manifest.getCtx().getCorpus());
    folder.setFolderPath("FolderPath/");
    folder.setNamespace("Namespace");

    Assert.assertEquals(0, folder.getDocuments().getCount());

    final CdmDocumentDefinition document =
        new CdmDocumentDefinition(manifest.getCtx(), "DocumentName");
    final CdmDocumentDefinition document2 =
        new CdmDocumentDefinition(manifest.getCtx(), "DocumentName2");

    final List<CdmDocumentDefinition> documentList = Arrays.asList(document, document2);
    folder.getDocuments().addAll(documentList);
    Assert.assertEquals(2, folder.getDocuments().getCount());
    Assert.assertEquals(document, folder.getDocuments().get(0));
    Assert.assertEquals(document2, folder.getDocuments().get(1));
    Assert.assertEquals(folder, document.getOwner());

    boolean removed = folder.getDocuments().remove(document);
    Assert.assertTrue(removed);
    Assert.assertEquals(1, folder.getDocuments().getCount());
    Assert.assertEquals(document2, folder.getDocuments().get(0));
    Assert.assertNull(document.getOwner());

    removed = folder.getDocuments().remove(document);
    Assert.assertFalse(removed);
    Assert.assertEquals(1, folder.getDocuments().getCount());
    Assert.assertEquals(document2, folder.getDocuments().get(0));

    folder.getDocuments().add(document);
    Assert.assertEquals(2, folder.getDocuments().getCount());
    Assert.assertEquals(folder, document.getOwner());

    removed = folder.getDocuments().remove(document.getName());
    Assert.assertTrue(removed);
    Assert.assertEquals(1, folder.getDocuments().getCount());
    Assert.assertEquals(document2, folder.getDocuments().get(0));
    Assert.assertNull(document.getOwner());
  }
}
