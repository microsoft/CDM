// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;


    [TestClass]
    public class CdmFolderCollectionTests
    {
        [TestMethod]
        public void TestFolderCollectionAdd()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var parentFolder = new CdmFolderDefinition(manifest.Ctx, "ParentFolder");
            parentFolder.Namespace = "TheNamespace";
            parentFolder.FolderPath = "ParentFolderPath/";

            var childFolders = parentFolder.ChildFolders;
            var childFolder = new CdmFolderDefinition(manifest.Ctx, "ChildFolder1");

            Assert.AreEqual(0, childFolders.Count);
            var addedChildFolder = childFolders.Add(childFolder);
            Assert.AreEqual(1, childFolders.Count);
            Assert.AreEqual(childFolder, childFolders[0]);
            Assert.AreEqual(childFolder, addedChildFolder);
            Assert.AreEqual(manifest.Ctx, childFolder.Ctx);
            Assert.AreEqual("ChildFolder1", childFolder.Name);
            Assert.AreEqual(parentFolder, childFolder.Owner);
            Assert.AreEqual("TheNamespace", childFolder.Namespace);
            Assert.AreEqual(parentFolder.FolderPath + childFolder.Name + "/", childFolder.FolderPath);
        }

        [TestMethod]
        public void TestFolderCollectionInsert()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var parentFolder = new CdmFolderDefinition(manifest.Ctx, "ParentFolder");
            parentFolder.InDocument = manifest;
            parentFolder.Namespace = "TheNamespace";
            parentFolder.FolderPath = "ParentFolderPath/";

            var childFolders = parentFolder.ChildFolders;
            var childFolder = new CdmFolderDefinition(manifest.Ctx, "ChildFolder1");

            var child1 = childFolders.Add("child1");
            var child2 = childFolders.Add("child2");
            manifest.IsDirty = false;

            childFolders.Insert(1, childFolder);

            Assert.AreEqual(3, childFolders.Count);
            Assert.IsTrue(manifest.IsDirty);
            Assert.AreEqual(child1, childFolders[0]);
            Assert.AreEqual(childFolder, childFolders[1]);
            Assert.AreEqual(child2, childFolders[2]);
            Assert.AreEqual(manifest.Ctx, childFolder.Ctx);
            Assert.AreEqual("ChildFolder1", childFolder.Name);
            Assert.AreEqual(parentFolder, childFolder.Owner);
            Assert.AreEqual("TheNamespace", childFolder.Namespace);
            Assert.AreEqual(parentFolder.FolderPath + childFolder.Name + "/", childFolder.FolderPath);
        }

        [TestMethod]
        public void TestFolderCollectionAddWithNameParameter()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var parentFolder = new CdmFolderDefinition(manifest.Ctx, "ParentFolder");
            parentFolder.Namespace = "TheNamespace";
            parentFolder.FolderPath = "ParentFolderPath/";

            CdmFolderCollection childFolders = parentFolder.ChildFolders;

            Assert.AreEqual(0, childFolders.Count);
            var childFolder = childFolders.Add("ChildFolder1");
            Assert.AreEqual(1, childFolders.Count);
            Assert.AreEqual(childFolder, childFolders[0]);
            Assert.AreEqual(manifest.Ctx, childFolder.Ctx);
            Assert.AreEqual("ChildFolder1", childFolder.Name);
            Assert.AreEqual(parentFolder, childFolder.Owner);
            Assert.AreEqual("TheNamespace", childFolder.Namespace);
            Assert.AreEqual(parentFolder.FolderPath + childFolder.Name + "/", childFolder.FolderPath);
        }

        [TestMethod]
        public void TestFolderCollectionAddRange()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var parentFolder = new CdmFolderDefinition(manifest.Ctx, "ParentFolder");
            parentFolder.Namespace = "TheNamespace";
            parentFolder.FolderPath = "ParentFolderPath/";

            CdmFolderCollection childFolders = parentFolder.ChildFolders;
            var childFolder = new CdmFolderDefinition(manifest.Ctx, "ChildFolder1");
            var childFolder2 = new CdmFolderDefinition(manifest.Ctx, "ChildFolder2");
            var childList = new List<CdmFolderDefinition> { childFolder, childFolder2 };

            Assert.AreEqual(0, childFolders.Count);
            childFolders.AddRange(childList);
            Assert.AreEqual(2, childFolders.Count);
            Assert.AreEqual(childFolder, childFolders[0]);
            Assert.AreEqual(manifest.Ctx, childFolder.Ctx);
            Assert.AreEqual("ChildFolder1", childFolder.Name);
            Assert.AreEqual(parentFolder, childFolder.Owner);
            Assert.AreEqual("TheNamespace", childFolder.Namespace);
            Assert.AreEqual(parentFolder.FolderPath + childFolder.Name + "/", childFolder.FolderPath);

            Assert.AreEqual(childFolder2, childFolders[1]);
            Assert.AreEqual("ChildFolder2", childFolder2.Name);
            Assert.AreEqual(parentFolder, childFolder2.Owner);
            Assert.AreEqual("TheNamespace", childFolder2.Namespace);
            Assert.AreEqual(parentFolder.FolderPath + childFolder2.Name + "/", childFolder2.FolderPath);
        }

        [TestMethod]
        public void TestFolderCollectionRemove()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var parentFolder = new CdmFolderDefinition(manifest.Ctx, "ParentFolder");
            parentFolder.Namespace = "TheNamespace";
            parentFolder.FolderPath = "ParentFolderPath/";

            CdmFolderCollection childFolders = parentFolder.ChildFolders;
            var childFolder = new CdmFolderDefinition(manifest.Ctx, "ChildFolder1");

            Assert.AreEqual(0, childFolders.Count);
            childFolders.Add(childFolder);
            Assert.AreEqual(1, childFolders.Count);
            childFolders.Remove(childFolder);
            Assert.AreEqual(0, childFolders.Count);
        }
    }
}
