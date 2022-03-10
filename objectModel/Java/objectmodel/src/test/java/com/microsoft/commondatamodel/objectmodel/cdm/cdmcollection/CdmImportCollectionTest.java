// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmImport;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmImportCollectionTest {
  @Test
  public void testCdmImportCollectionAdd() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    document.setDirty(false);
    Assert.assertFalse(document.isDirty());
    final CdmImport cdmImport = new CdmImport(document.getCtx(), "corpusPath", "moniker");
    final CdmImport addedImport = document.getImports().add(cdmImport);

    Assert.assertTrue(document.isDirty());
    Assert.assertEquals(1, document.getImports().getCount());
    Assert.assertEquals(cdmImport, addedImport);
    Assert.assertEquals(cdmImport, document.getImports().get(0));
    Assert.assertEquals("corpusPath", cdmImport.getCorpusPath());
    Assert.assertEquals("moniker", cdmImport.getMoniker());
    Assert.assertEquals(document.getCtx(), cdmImport.getCtx());
  }

  @Test
  public void testCdmImportCollectionAddCorpusPath() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    document.setDirty(false);
    final CdmImport cdmImport = document.getImports().add("corpusPath");

    Assert.assertTrue(document.isDirty());
    Assert.assertEquals(1, document.getImports().getCount());
    Assert.assertEquals(cdmImport, document.getImports().get(0));
    Assert.assertEquals("corpusPath", cdmImport.getCorpusPath());
    Assert.assertNull(cdmImport.getMoniker());
    Assert.assertEquals(document.getCtx(), cdmImport.getCtx());
  }

  @Test
  public void testCdmImportCollectionAddCorpusPathAndMoniker() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    document.setDirty(false);
    final CdmImport cdmImport = document.getImports().add("corpusPath", "moniker");

    Assert.assertTrue(document.isDirty());
    Assert.assertEquals(1, document.getImports().getCount());
    Assert.assertEquals(cdmImport, document.getImports().get(0));
    Assert.assertEquals("corpusPath", cdmImport.getCorpusPath());
    Assert.assertEquals("moniker", cdmImport.getMoniker());
    Assert.assertEquals(document.getCtx(), cdmImport.getCtx());
  }

  @Test
  public void testCdmImportCollectionAddRange() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    document.setDirty(false);
    final List<CdmImport> importList =
        new ArrayList<>(Arrays.asList(
            new CdmImport(document.getCtx(), "CorpusPath1", "Moniker1"),
            new CdmImport(document.getCtx(), "CorpusPath2", "Moniker2"),
            new CdmImport(document.getCtx(), "CorpusPath3", null)));
    document.getImports().addAll(importList);

    Assert.assertTrue(document.isDirty());
    Assert.assertEquals(document.getImports().getCount(), 3);
    Assert.assertEquals(document.getImports().get(0), importList.get(0));
    Assert.assertEquals(document.getImports().get(1), importList.get(1));
    Assert.assertEquals(document.getImports().get(0).getCorpusPath(), "CorpusPath1");
    Assert.assertEquals(document.getImports().item("CorpusPath1", "Moniker1").getMoniker(), "Moniker1");
    Assert.assertEquals(document.getImports().item("CorpusPath1", "Moniker1").getCtx(), document.getCtx());
    Assert.assertEquals(document.getImports().get(1).getCorpusPath(), "CorpusPath2");
    Assert.assertNull(document.getImports().item("CorpusPath2"));
    Assert.assertNotNull(document.getImports().item("CorpusPath2", null, false));
    Assert.assertNull(document.getImports().item("CorpusPath2", null, true));
    Assert.assertNotNull(document.getImports().item("CorpusPath2", "Moniker2",true));
    Assert.assertNotNull(document.getImports().item("CorpusPath2", "Moniker3", false));
    Assert.assertEquals(document.getImports().item("CorpusPath2", "Moniker2").getMoniker(), "Moniker2");
    Assert.assertEquals(document.getImports().item("CorpusPath2", "Moniker2").getCtx(), document.getCtx());
    Assert.assertEquals(document.getImports().item("CorpusPath3"), importList.get(2));
  }
}
