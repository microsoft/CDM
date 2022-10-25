// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.ReferencedEntityDeclaration
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ReferencedEntityTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Cdm", "ReferencedEntityDeclaration");

        /// <summary>
        /// Test that ReferencedEntity is correctly found with path separator as "/" or "\"
        /// </summary>
        [TestMethod]
        public async Task TestRefEntityWithSlashPath()
        {
            var slashCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestRefEntityWithSlashPath");
            var slashLocalPath = ((LocalAdapter)slashCorpus.Storage.NamespaceAdapters["local"]).Root;
            var slashAdapter = new ModelJsonUnitTestLocalAdapter(slashLocalPath);
            slashCorpus.Storage.Mount("slash", slashAdapter);
            slashCorpus.Storage.DefaultNamespace = "slash";

            // load model.json files with paths generated using both '/' and '\'
            var slashManifest = await slashCorpus.FetchObjectAsync<CdmManifestDefinition>("slash:/model.json");

            // manually add the reference model location, path will vary on each machine
            var refModelTrait = slashManifest.ExhibitsTraits.Item("is.modelConversion.referenceModelMap") as CdmTraitReference;
            var entityPath = slashManifest.Entities[0].EntityPath;
            refModelTrait.Arguments[0].Value[0].location = slashAdapter.CreateAdapterPath(entityPath.Substring(0, entityPath.LastIndexOf("/")));

            var slashModel = await ManifestPersistence.ToData(slashManifest, new ResolveOptions(), new CopyOptions());

            Assert.IsNotNull(slashModel);
            Assert.AreEqual(1, slashModel.Entities.Count);

            var backSlashCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestRefEntityWithSlashPath");
            var backSlashLocalPath = ((LocalAdapter)backSlashCorpus.Storage.NamespaceAdapters["local"]).Root;
            var backSlashAdapter = new ModelJsonUnitTestLocalAdapter(backSlashLocalPath);
            backSlashCorpus.Storage.Mount("backslash", backSlashAdapter);
            backSlashCorpus.Storage.DefaultNamespace = "backslash";

            var backSlashManifest = await backSlashCorpus.FetchObjectAsync<CdmManifestDefinition>("backslash:/model.json");

            // manually add the reference model location, path will vary on each machine
            var backSlashRefModelTrait = backSlashManifest.ExhibitsTraits.Item("is.modelConversion.referenceModelMap") as CdmTraitReference;
            var backSlashEntityPath = backSlashManifest.Entities[0].EntityPath;
            backSlashRefModelTrait.Arguments[0].Value[0].location = backSlashAdapter.CreateAdapterPath(backSlashEntityPath.Substring(0, backSlashEntityPath.LastIndexOf("/")))
                .Replace("/", "\\\\");

            var backSlashModel = await ManifestPersistence.ToData(backSlashManifest, new ResolveOptions(), new CopyOptions());

            Assert.IsNotNull(backSlashModel);
            Assert.AreEqual(1, backSlashModel.Entities.Count);
        }
    }
}
