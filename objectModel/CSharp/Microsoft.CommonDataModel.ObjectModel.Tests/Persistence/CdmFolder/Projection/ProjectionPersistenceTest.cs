// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ProjectionPersistenceTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Persistence", "CdmFolder", "Projection");

        /// <summary>
        /// Basic test to load persisted Projections based entities
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestLoadProjection()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestLoadProjection");

            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");

            string expected = "TestSource";
            string actual = null;
            CdmObjectType actualType = CdmObjectType.Error;

            #region TestEntityStringReference.cdm.json
            CdmEntityDefinition entTestEntityStringReference = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityStringReference.cdm.json/TestEntityStringReference", manifest);
            Assert.IsNotNull(entTestEntityStringReference);
            actual = ((CdmEntityReference)entTestEntityStringReference.ExtendsEntity).NamedReference;
            actualType = ((CdmEntityReference)entTestEntityStringReference.ExtendsEntity).ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(CdmObjectType.EntityRef, actualType);
            #endregion // TestEntityStringReference.cdm.json

            #region TestEntityEntityReference.cdm.json
            CdmEntityDefinition entTestEntityEntityReference = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityEntityReference.cdm.json/TestEntityEntityReference", manifest);
            Assert.IsNotNull(entTestEntityEntityReference);
            actual = ((CdmEntityReference)entTestEntityEntityReference.ExtendsEntity).NamedReference;
            actualType = ((CdmEntityReference)entTestEntityEntityReference.ExtendsEntity).ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(CdmObjectType.EntityRef, actualType);
            #endregion // TestEntityEntityReference.cdm.json

            #region TestEntityProjection.cdm.json
            CdmEntityDefinition entTestEntityProjection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityProjection.cdm.json/TestEntityProjection", manifest);
            Assert.IsNotNull(entTestEntityProjection);
            actual = ((CdmEntityReference)((CdmProjection)entTestEntityProjection.ExtendsEntity.ExplicitReference).Source).NamedReference;
            actualType = ((CdmProjection)entTestEntityProjection.ExtendsEntity.ExplicitReference).ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(CdmObjectType.ProjectionDef, actualType);
            #endregion // TestEntityProjection.cdm.json

            #region TestEntityNestedProjection.cdm.json
            CdmEntityDefinition entTestEntityNestedProjection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityNestedProjection.cdm.json/TestEntityNestedProjection", manifest);
            Assert.IsNotNull(entTestEntityNestedProjection);
            actual = ((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)entTestEntityNestedProjection.ExtendsEntity).ExplicitReference).Source).ExplicitReference).Source).ExplicitReference).Source.NamedReference;
            actualType = ((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)entTestEntityNestedProjection.ExtendsEntity).ExplicitReference).Source).ExplicitReference).Source).ExplicitReference).ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(CdmObjectType.ProjectionDef, actualType);
            #endregion // TestEntityNestedProjection.cdm.json

            #region TestEntityAttributeStringReference.cdm.json
            CdmEntityDefinition entTestEntityAttributeStringReference = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityAttributeStringReference.cdm.json/TestEntityAttributeStringReference", manifest);
            Assert.IsNotNull(entTestEntityAttributeStringReference);
            actual = ((CdmEntityAttributeDefinition)entTestEntityAttributeStringReference.Attributes[0]).Entity.NamedReference;
            actualType = ((CdmEntityAttributeDefinition)entTestEntityAttributeStringReference.Attributes[0]).Entity.ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(CdmObjectType.EntityRef, actualType);
            #endregion // TestEntityAttributeStringReference.cdm.json

            #region TestEntityAttributeEntityReference.cdm.json
            CdmEntityDefinition entTestEntityAttributeEntityReference = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityAttributeEntityReference.cdm.json/TestEntityAttributeEntityReference", manifest);
            Assert.IsNotNull(entTestEntityAttributeEntityReference);
            actual = ((CdmEntityAttributeDefinition)entTestEntityAttributeEntityReference.Attributes[0]).Entity.NamedReference;
            actualType = ((CdmEntityAttributeDefinition)entTestEntityAttributeEntityReference.Attributes[0]).Entity.ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(CdmObjectType.EntityRef, actualType);
            #endregion // TestEntityAttributeEntityReference.cdm.json

            #region TestEntityAttributeProjection.cdm.json
            CdmEntityDefinition entTestEntityAttributeProjection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityAttributeProjection.cdm.json/TestEntityAttributeProjection", manifest);
            Assert.IsNotNull(entTestEntityAttributeProjection);
            actual = ((CdmProjection)((CdmEntityAttributeDefinition)entTestEntityAttributeProjection.Attributes[0]).Entity.ExplicitReference).Source.NamedReference;
            actualType = ((CdmEntityAttributeDefinition)entTestEntityAttributeProjection.Attributes[0]).Entity.ExplicitReference.ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(CdmObjectType.ProjectionDef, actualType);
            #endregion // TestEntityAttributeProjection.cdm.json

            #region TestEntityAttributeNestedProjection.cdm.json
            CdmEntityDefinition entTestEntityAttributeNestedProjection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityAttributeNestedProjection.cdm.json/TestEntityAttributeNestedProjection", manifest);
            Assert.IsNotNull(entTestEntityAttributeNestedProjection);
            actual = ((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)((CdmEntityAttributeDefinition)entTestEntityAttributeNestedProjection.Attributes[0]).Entity).ExplicitReference).Source).ExplicitReference).Source).ExplicitReference).Source.NamedReference;
            actualType = ((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)((CdmEntityAttributeDefinition)entTestEntityAttributeNestedProjection.Attributes[0]).Entity).ExplicitReference).Source).ExplicitReference).Source).ExplicitReference).ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(CdmObjectType.ProjectionDef, actualType);
            #endregion // TestEntityAttributeNestedProjection.cdm.json

            #region TestOperationCollection.cdm.json
            CdmEntityDefinition entTestOperationCollection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestOperationCollection.cdm.json/TestOperationCollection", manifest);
            Assert.IsNotNull(entTestOperationCollection);
            int actualOperationCount = ((CdmProjection)entTestOperationCollection.ExtendsEntity.ExplicitReference).Operations.Count;
            Assert.AreEqual(9, actualOperationCount);
            CdmOperationCollection operations = ((CdmProjection)entTestOperationCollection.ExtendsEntity.ExplicitReference).Operations;
            Assert.AreEqual(CdmOperationType.AddCountAttribute, operations[0].Type);
            Assert.AreEqual(CdmOperationType.AddSupportingAttribute, operations[1].Type);
            Assert.AreEqual(CdmOperationType.AddTypeAttribute, operations[2].Type);
            Assert.AreEqual(CdmOperationType.ExcludeAttributes, operations[3].Type);
            Assert.AreEqual(CdmOperationType.ArrayExpansion, operations[4].Type);
            Assert.AreEqual(CdmOperationType.CombineAttributes, operations[5].Type);
            Assert.AreEqual(CdmOperationType.RenameAttributes, operations[6].Type);
            Assert.AreEqual(CdmOperationType.ReplaceAsForeignKey, operations[7].Type);
            Assert.AreEqual(CdmOperationType.IncludeAttributes, operations[8].Type);
            #endregion // TestOperationCollection.cdm.json

            #region TestEntityTrait.cdm.json
            CdmEntityDefinition entTestEntityTrait = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityTrait.cdm.json/TestEntityTrait", manifest);
            Assert.IsNotNull(entTestEntityTrait);
            Assert.AreEqual("TestAttribute", ((CdmTypeAttributeDefinition)entTestEntityTrait.Attributes[0]).Name);
            Assert.AreEqual("testDataType", ((CdmTypeAttributeDefinition)entTestEntityTrait.Attributes[0]).DataType.NamedReference);
            #endregion // TestEntityTrait.cdm.json

            #region TestEntityExtendsTrait.cdm.json
            CdmEntityDefinition entTestEntityExtendsTrait = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestEntityExtendsTrait.cdm.json/TestEntityExtendsTrait", manifest);
            Assert.IsNotNull(entTestEntityExtendsTrait);
            Assert.AreEqual("TestExtendsTraitAttribute", ((CdmTypeAttributeDefinition)entTestEntityExtendsTrait.Attributes[0]).Name);
            Assert.AreEqual("testDerivedDataType", ((CdmTypeAttributeDefinition)entTestEntityExtendsTrait.Attributes[0]).DataType.NamedReference);
            #endregion // TestEntityExtendsTrait.cdm.json

            #region TestProjectionTrait.cdm.json
            CdmEntityDefinition entTestProjectionTrait = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestProjectionTrait.cdm.json/TestProjectionTrait", manifest);
            Assert.IsNotNull(entTestProjectionTrait);
            Assert.AreEqual("TestProjectionAttribute", ((CdmTypeAttributeDefinition)entTestProjectionTrait.Attributes[0]).Name);
            Assert.AreEqual("testDataType", ((CdmTypeAttributeDefinition)entTestProjectionTrait.Attributes[0]).DataType.NamedReference);
            #endregion // TestProjectionTrait.cdm.json

            #region TestProjectionExtendsTrait.cdm.json
            CdmEntityDefinition entTestProjectionExtendsTrait = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/TestProjectionExtendsTrait.cdm.json/TestProjectionExtendsTrait", manifest);
            Assert.IsNotNull(entTestProjectionExtendsTrait);
            Assert.AreEqual("TestProjectionAttributeB", ((CdmTypeAttributeDefinition)entTestProjectionExtendsTrait.Attributes[0]).Name);
            Assert.AreEqual("testExtendsDataTypeB", ((CdmTypeAttributeDefinition)entTestProjectionExtendsTrait.Attributes[0]).DataType.NamedReference);
            #endregion // TestProjectionExtendsTrait.cdm.json
        }

        /// <summary>
        /// Basic test to save persisted Projections based entities
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestSaveProjection()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestSaveProjection");

            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");

            CdmEntityDefinition entitySales = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/Sales.cdm.json/Sales", manifest);
            Assert.IsNotNull(entitySales);

            CdmFolderDefinition actualRoot = corpus.Storage.FetchRootFolder("output");
            Assert.IsNotNull(actualRoot);

            actualRoot.Documents.Add(entitySales.InDocument, "Persisted_Sales.cdm.json");
            await actualRoot.Documents[0].SaveAsAsync("output:/Persisted_Sales.cdm.json");

            CdmEntityDefinition entityActual = await corpus.FetchObjectAsync<CdmEntityDefinition>($"output:/Persisted_Sales.cdm.json/Sales", manifest);
            Assert.IsNotNull(entityActual);

            Entity entityContentActual = PersistenceLayer.ToData<CdmEntityDefinition, Entity>(entityActual, null, null, "CdmFolder");
            Assert.IsNotNull(entityContentActual);
            Assert.IsNotNull(entityContentActual.HasAttributes);
            Assert.IsTrue(entityContentActual.HasAttributes.Count == 1);
            Assert.IsFalse(entityContentActual.HasAttributes[0].ToString().Contains(@"""entityReference"""));
        }
    }
}
