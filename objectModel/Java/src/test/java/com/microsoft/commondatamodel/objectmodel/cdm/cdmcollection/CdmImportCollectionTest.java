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

    Assert.assertEquals(true, document.isDirty());
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

    Assert.assertEquals(true, document.isDirty());
    Assert.assertEquals(1, document.getImports().getCount());
    Assert.assertEquals(cdmImport, document.getImports().get(0));
    Assert.assertEquals("corpusPath", cdmImport.getCorpusPath());
    Assert.assertEquals(null, cdmImport.getMoniker());
    Assert.assertEquals(document.getCtx(), cdmImport.getCtx());
  }

  @Test
  public void testCdmImportCollectionAddCorpusPathAndMoniker() {
    final CdmManifestDefinition document =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    document.setDirty(false);
    final CdmImport cdmImport = document.getImports().add("corpusPath", "moniker");

    Assert.assertEquals(true, document.isDirty());
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
            new CdmImport(document.getCtx(), "CorpusPath2", "Moniker2")));
    document.getImports().addAll(importList);

    Assert.assertEquals(true, document.isDirty());
    Assert.assertEquals(2, document.getImports().getCount());
    Assert.assertEquals(importList.get(0), document.getImports().get(0));
    Assert.assertEquals(importList.get(1), document.getImports().get(1));
    Assert.assertEquals("CorpusPath1", importList.get(0).getCorpusPath());
    Assert.assertEquals("Moniker1", importList.get(0).getMoniker());
    Assert.assertEquals(document.getCtx(), importList.get(0).getCtx());
    Assert.assertEquals("CorpusPath2", importList.get(1).getCorpusPath());
    Assert.assertEquals("Moniker2", importList.get(1).getMoniker());
    Assert.assertEquals(document.getCtx(), importList.get(1).getCtx());
  }
}
