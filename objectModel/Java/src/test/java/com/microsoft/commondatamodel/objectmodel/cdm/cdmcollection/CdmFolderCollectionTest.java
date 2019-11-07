package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import java.util.Arrays;
import java.util.List;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmFolderCollectionTest {
  @Test
  public void testFolderCollectionAdd() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");
    final CdmFolderDefinition parentFolder =
        new CdmFolderDefinition(manifest.getCtx(), "ParentFolder");
    parentFolder.setNamespace("TheNamespace");
    parentFolder.setFolderPath("ParentFolderPath/");

    final CdmFolderCollection childFolders = parentFolder.getChildFolders();
    new CdmFolderCollection(manifest.getCtx(), parentFolder);
    final CdmFolderDefinition childFolder =
        new CdmFolderDefinition(manifest.getCtx(),
            "ChildFolder1");

    Assert.assertEquals(0, childFolders.size());
    final CdmFolderDefinition addedChildFolder = childFolders.add(childFolder);

    Assert.assertEquals(1, childFolders.size());
    Assert.assertEquals(childFolder, childFolders.get(0));
    Assert.assertEquals(childFolder, addedChildFolder);
    Assert.assertEquals(manifest.getCtx(), childFolder.getCtx());
    Assert.assertEquals("ChildFolder1", childFolder.getName());
    Assert.assertEquals(parentFolder, childFolder.getOwner());
    Assert.assertEquals("TheNamespace", childFolder.getNamespace());
    Assert.assertEquals(
        parentFolder.getFolderPath() + childFolder.getName() + "/",
        childFolder.getFolderPath());
  }

  @Test
  public void testFolderCollectionInsert() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("c:/Root/Path");
    final CdmFolderDefinition parentFolder =
        new CdmFolderDefinition(manifest.getCtx(), "ParentFolder");
    parentFolder.setInDocument(manifest);
    parentFolder.setNamespace("TheNamespace");
    parentFolder.setFolderPath("ParentFolderPath/");

    final CdmFolderCollection childFolders = parentFolder.getChildFolders();
    final CdmFolderDefinition childFolder =
        new CdmFolderDefinition(manifest.getCtx(), "ChildFolder1");

    final CdmFolderDefinition child1 = childFolders.add("child1");
    final CdmFolderDefinition child2 = childFolders.add("child2");
    manifest.setDirty(false);

    childFolders.add(1, childFolder);

    Assert.assertEquals(3, childFolders.getCount());
    Assert.assertTrue(manifest.isDirty());
    Assert.assertEquals(child1, childFolders.get(0));
    Assert.assertEquals(childFolder, childFolders.get(1));
    Assert.assertEquals(child2, childFolders.get(2));
    Assert.assertEquals(manifest.getCtx(), childFolder.getCtx());
    Assert.assertEquals("ChildFolder1", childFolder.getName());
    Assert.assertEquals(parentFolder, childFolder.getOwner());
    Assert.assertEquals("TheNamespace", childFolder.getNamespace());
    Assert.assertEquals(
        parentFolder.getFolderPath() + childFolder.getName() + "/",
        childFolder.getFolderPath());
  }

  @Test
  public void testFolderCollectionAddWithNameParameter() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");
    final CdmFolderDefinition parentFolder =
        new CdmFolderDefinition(manifest.getCtx(), "ParentFolder");
    parentFolder.setNamespace("TheNamespace");
    parentFolder.setFolderPath("ParentFolderPath/");

    final CdmFolderCollection childFolders = parentFolder.getChildFolders();

    Assert.assertEquals(0, childFolders.size());
    final CdmFolderDefinition childFolder = childFolders.add("ChildFolder1");
    Assert.assertEquals(1, childFolders.size());
    Assert.assertEquals(childFolder, childFolders.get(0));
    Assert.assertEquals(manifest.getCtx(), childFolder.getCtx());
    Assert.assertEquals("ChildFolder1", childFolder.getName());
    Assert.assertEquals(parentFolder, childFolder.getOwner());
    Assert.assertEquals("TheNamespace", childFolder.getNamespace());
    Assert.assertEquals(
        parentFolder.getFolderPath() + childFolder.getName() + "/",
        childFolder.getFolderPath());
  }

  @Test
  public void testFolderCollectionAddRange() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");
    final CdmFolderDefinition parentFolder =
        new CdmFolderDefinition(manifest.getCtx(), "ParentFolder");
    parentFolder.setNamespace("TheNamespace");
    parentFolder.setFolderPath("ParentFolderPath/");

    final CdmFolderCollection childFolders = parentFolder.getChildFolders();
    final CdmFolderDefinition childFolder =
        new CdmFolderDefinition(manifest.getCtx(), "ChildFolder1");
    final CdmFolderDefinition childFolder2 =
        new CdmFolderDefinition(manifest.getCtx(), "ChildFolder2");
    final List<CdmFolderDefinition> childList = Arrays.asList(childFolder, childFolder2);

    Assert.assertEquals(0, childFolders.size());
    childFolders.addAll(childList);
    Assert.assertEquals(2, childFolders.size());
    Assert.assertEquals(childFolder, childFolders.get(0));
    Assert.assertEquals(manifest.getCtx(), childFolder.getCtx());
    Assert.assertEquals("ChildFolder1", childFolder.getName());
    Assert.assertEquals(parentFolder, childFolder.getOwner());
    Assert.assertEquals("TheNamespace", childFolder.getNamespace());
    Assert.assertEquals(
        parentFolder.getFolderPath() + childFolder.getName() + "/",
        childFolder.getFolderPath());

    Assert.assertEquals(childFolder2, childFolders.get(1));
    Assert.assertEquals("ChildFolder2", childFolder2.getName());
    Assert.assertEquals(parentFolder, childFolder2.getOwner());
    Assert.assertEquals("TheNamespace", childFolder2.getNamespace());
    Assert.assertEquals(
        parentFolder.getFolderPath() + childFolder2.getName() + "/",
        childFolder2.getFolderPath());
  }

  @Test
  public void testFolderCollectionRemove() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");
    final CdmFolderDefinition parentFolder =
        new CdmFolderDefinition(manifest.getCtx(), "ParentFolder");
    parentFolder.setNamespace("TheNamespace");
    parentFolder.setFolderPath("ParentFolderPath/");

    final CdmFolderCollection childFolders = parentFolder.getChildFolders();
    final CdmFolderDefinition childFolder =
        new CdmFolderDefinition(manifest.getCtx(), "ChildFolder1");

    Assert.assertEquals(0, childFolders.size());
    childFolders.add(childFolder);
    Assert.assertEquals(1, childFolders.size());
    childFolders.remove(childFolder);
    Assert.assertEquals(0, childFolders.size());
  }
}
