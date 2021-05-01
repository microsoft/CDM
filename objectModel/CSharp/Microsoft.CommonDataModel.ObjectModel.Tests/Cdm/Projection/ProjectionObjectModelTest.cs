// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ProjectionObjectModelTest
    {
        private const string FoundationJsonPath = "cdm:/foundations.cdm.json";

        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection");

        /// <summary>
        /// Basic test to save projection based entities and then try to reload them and validate that the projections were persisted correctly
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestProjectionUsingObjectModel()
        {
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, "TestProjectionUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestProjectionUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");
            CdmManifestDefinition manifestDefault = CreateDefaultManifest(corpus, localRoot);

            CdmEntityDefinition entityTestSource = CreateEntityTestSource(corpus, manifestDefault, localRoot);
            CdmEntityDefinition entityTestEntityProjection = CreateEntityTestEntityProjection(corpus, manifestDefault, localRoot);
            CdmEntityDefinition entityTestEntityNestedProjection = CreateEntityTestEntityNestedProjection(corpus, manifestDefault, localRoot);
            CdmEntityDefinition entityTestEntityAttributeProjection = CreateEntityTestEntityAttributeProjection(corpus, manifestDefault, localRoot);
            CdmEntityDefinition entityTestOperationCollection = CreateEntityTestOperationCollection(corpus, manifestDefault, localRoot);

            // Save manifest and entities
            await manifestDefault.SaveAsAsync($"{manifestDefault.ManifestName}.manifest.cdm.json", saveReferenced: true);

            string expected = "TestSource";
            CdmObjectType expectedType = CdmObjectType.ProjectionDef;
            string actual = null;
            CdmObjectType actualType = CdmObjectType.Error;

            // Try to read back the newly persisted manifest and projection based entities
            CdmManifestDefinition manifestReadBack = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/{manifestDefault.ManifestName}.manifest.cdm.json");
            Assert.AreEqual(5, manifestReadBack.Entities.Count);
            Assert.AreEqual(entityTestSource.EntityName, manifestReadBack.Entities[0].EntityName);
            Assert.AreEqual(entityTestEntityProjection.EntityName, manifestReadBack.Entities[1].EntityName);
            Assert.AreEqual(entityTestEntityNestedProjection.EntityName, manifestReadBack.Entities[2].EntityName);
            Assert.AreEqual(entityTestEntityAttributeProjection.EntityName, manifestReadBack.Entities[3].EntityName);

            // Read back the newly persisted manifest and projection based entity TestEntityProjection and validate
            CdmEntityDefinition entityTestEntityProjectionReadBack = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityTestEntityProjection.EntityName}.cdm.json/{entityTestEntityProjection.EntityName}", manifestReadBack);
            Assert.IsNotNull(entityTestEntityProjectionReadBack);
            actual = ((CdmEntityReference)((CdmProjection)entityTestEntityProjectionReadBack.ExtendsEntity.ExplicitReference).Source).NamedReference;
            actualType = ((CdmProjection)entityTestEntityProjectionReadBack.ExtendsEntity.ExplicitReference).ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(expectedType, actualType);

            // Read back the newly persisted manifest and projection based entity TestEntityNestedProjection and validate
            CdmEntityDefinition entityTestEntityNestedProjectionReadBack = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityTestEntityNestedProjection.EntityName}.cdm.json/{entityTestEntityNestedProjection.EntityName}", manifestReadBack);
            Assert.IsNotNull(entityTestEntityNestedProjectionReadBack);
            actual = ((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)entityTestEntityNestedProjectionReadBack.ExtendsEntity).ExplicitReference).Source).ExplicitReference).Source).ExplicitReference).Source.NamedReference;
            actualType = ((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)((CdmProjection)((CdmEntityReference)entityTestEntityNestedProjectionReadBack.ExtendsEntity).ExplicitReference).Source).ExplicitReference).Source).ExplicitReference).ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(expectedType, actualType);

            // Read back the newly persisted manifest and projection based entity TestEntityAttributeProjection and validate
            CdmEntityDefinition entityTestEntityAttributeProjectionReadBack = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityTestEntityAttributeProjection.EntityName}.cdm.json/{entityTestEntityAttributeProjection.EntityName}", manifestReadBack);
            Assert.IsNotNull(entityTestEntityAttributeProjectionReadBack);
            actual = ((CdmEntityReference)((CdmProjection)((CdmEntityReference)((CdmEntityAttributeDefinition)entityTestEntityAttributeProjectionReadBack.Attributes[0]).Entity).ExplicitReference).Source).NamedReference;
            actualType = ((CdmProjection)((CdmEntityReference)((CdmEntityAttributeDefinition)entityTestEntityAttributeProjectionReadBack.Attributes[0]).Entity).ExplicitReference).ObjectType;
            Assert.AreEqual(expected, actual);
            Assert.AreEqual(expectedType, actualType);

            // Read back operations collections and validate
            CdmEntityDefinition entityTestOperationCollectionReadBack = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityTestOperationCollection.EntityName}.cdm.json/{entityTestOperationCollection.EntityName}", manifestReadBack);
            Assert.IsNotNull(entityTestOperationCollectionReadBack);
            int actualOperationCount = ((CdmProjection)entityTestOperationCollectionReadBack.ExtendsEntity.ExplicitReference).Operations.Count;
            Assert.AreEqual(9, actualOperationCount);
            CdmOperationCollection operations = ((CdmProjection)entityTestOperationCollectionReadBack.ExtendsEntity.ExplicitReference).Operations;
            Assert.AreEqual(CdmOperationType.AddCountAttribute, operations[0].Type);
            Assert.AreEqual(CdmOperationType.AddSupportingAttribute, operations[1].Type);
            Assert.AreEqual(CdmOperationType.AddTypeAttribute, operations[2].Type);
            Assert.AreEqual(CdmOperationType.ExcludeAttributes, operations[3].Type);
            Assert.AreEqual(CdmOperationType.ArrayExpansion, operations[4].Type);
            Assert.AreEqual(CdmOperationType.CombineAttributes, operations[5].Type);
            Assert.AreEqual(CdmOperationType.RenameAttributes, operations[6].Type);
            Assert.AreEqual(CdmOperationType.ReplaceAsForeignKey, operations[7].Type);
            Assert.AreEqual(CdmOperationType.IncludeAttributes, operations[8].Type);
        }

        /// <summary>
        /// Create a default manifest
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="localRoot"></param>
        /// <returns></returns>
        private CdmManifestDefinition CreateDefaultManifest(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot)
        {
            string manifestName = "default";
            string manifestDocName = $"{manifestName}.manifest.cdm.json";

            CdmManifestDefinition manifestDefault = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, manifestName);

            localRoot.Documents.Add(manifestDefault, manifestDocName);

            return manifestDefault;
        }

        /// <summary>
        /// Create a simple entity called 'TestSource' with a single attribute
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="manifestDefault"></param>
        /// <param name="localRoot"></param>
        /// <returns></returns>
        private CdmEntityDefinition CreateEntityTestSource(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot)
        {
            string entityName = "TestSource";

            CdmEntityDefinition entityTestSource = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, entityName);
            {
                string attributeName = "TestAttribute";

                CdmTypeAttributeDefinition entityTestAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, nameOrRef: attributeName, simpleNameRef: false);
                entityTestAttribute.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, refObj: "string", simpleNameRef: true);
                entityTestAttribute.Purpose = corpus.MakeRef<CdmPurposeReference>(CdmObjectType.PurposeRef, refObj: "hasA", simpleNameRef: true);
                entityTestAttribute.DisplayName = attributeName;

                entityTestSource.Attributes.Add(entityTestAttribute);
            }

            CdmDocumentDefinition entityTestSourceDoc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json", false);
            entityTestSourceDoc.Imports.Add(FoundationJsonPath);
            entityTestSourceDoc.Definitions.Add(entityTestSource);

            localRoot.Documents.Add(entityTestSourceDoc, entityTestSourceDoc.Name);
            manifestDefault.Entities.Add(entityTestSource);

            return entityTestSource;
        }

        /// <summary>
        /// Create a simple projection object
        /// </summary>
        /// <param name="corpus"></param>
        /// <returns></returns>
        private CdmProjection CreateProjection(CdmCorpusDefinition corpus)
        {
            CdmProjection projection = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            {
                projection.Source = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, "TestSource", simpleNameRef: true);
            }

            return projection;
        }

        /// <summary>
        /// Create a 3-level nested projection object
        /// </summary>
        /// <param name="corpus"></param>
        /// <returns></returns>
        private CdmProjection CreateNestedProjection(CdmCorpusDefinition corpus)
        {
            CdmProjection projection3 = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            {
                projection3.Source = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, "TestSource", simpleNameRef: true);
            }
            CdmEntityReference inlineProjectionEntityRef3 = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            inlineProjectionEntityRef3.ExplicitReference = projection3;

            CdmProjection projection2 = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            {
                projection2.Source = inlineProjectionEntityRef3;
            }
            CdmEntityReference inlineProjectionEntityRef2 = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            inlineProjectionEntityRef2.ExplicitReference = projection2;

            CdmProjection projection1 = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            {
                projection1.Source = inlineProjectionEntityRef2;
            }

            return projection1;
        }

        /// <summary>
        /// Create an entity 'TestEntityProjection' that extends from a projection
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="manifestDefault"></param>
        /// <param name="localRoot"></param>
        /// <returns></returns>
        private CdmEntityDefinition CreateEntityTestEntityProjection(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot)
        {
            string entityName = "TestEntityProjection";

            CdmEntityReference inlineProjectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            inlineProjectionEntityRef.ExplicitReference = CreateProjection(corpus);


            CdmEntityDefinition entityTestEntityProjection = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, entityName);
            entityTestEntityProjection.ExtendsEntity = inlineProjectionEntityRef;

            CdmDocumentDefinition entityTestEntityProjectionDoc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json", false);
            entityTestEntityProjectionDoc.Imports.Add(FoundationJsonPath);
            entityTestEntityProjectionDoc.Imports.Add("TestSource.cdm.json");
            entityTestEntityProjectionDoc.Definitions.Add(entityTestEntityProjection);

            localRoot.Documents.Add(entityTestEntityProjectionDoc, entityTestEntityProjectionDoc.Name);
            manifestDefault.Entities.Add(entityTestEntityProjection);

            return entityTestEntityProjection;
        }

        /// <summary>
        /// Create an entity 'TestEntityNestedProjection' that extends from a projection
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="manifestDefault"></param>
        /// <param name="localRoot"></param>
        /// <returns></returns>
        private CdmEntityDefinition CreateEntityTestEntityNestedProjection(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot)
        {
            string entityName = "TestEntityNestedProjection";

            CdmEntityReference inlineProjectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            inlineProjectionEntityRef.ExplicitReference = CreateNestedProjection(corpus);


            CdmEntityDefinition entityTestEntityNestedProjection = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, entityName);
            entityTestEntityNestedProjection.ExtendsEntity = inlineProjectionEntityRef;

            CdmDocumentDefinition entityTestEntityNestedProjectionDoc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json", false);
            entityTestEntityNestedProjectionDoc.Imports.Add(FoundationJsonPath);
            entityTestEntityNestedProjectionDoc.Imports.Add("TestSource.cdm.json");
            entityTestEntityNestedProjectionDoc.Definitions.Add(entityTestEntityNestedProjection);

            localRoot.Documents.Add(entityTestEntityNestedProjectionDoc, entityTestEntityNestedProjectionDoc.Name);
            manifestDefault.Entities.Add(entityTestEntityNestedProjection);

            return entityTestEntityNestedProjection;
        }

        /// <summary>
        /// Create an entity 'TestEntityAttributeProjection' that contains an entity attribute with a projection as a source entity
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="manifestDefault"></param>
        /// <param name="localRoot"></param>
        /// <returns></returns>
        private CdmEntityDefinition CreateEntityTestEntityAttributeProjection(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot)
        {
            string entityName = "TestEntityAttributeProjection";

            CdmEntityReference inlineProjectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            inlineProjectionEntityRef.ExplicitReference = CreateProjection(corpus);

            CdmEntityDefinition entityTestEntityAttributeProjection = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, entityName);
            {
                string attributeName = "TestAttribute";

                CdmEntityAttributeDefinition entityTestEntityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, nameOrRef: attributeName, simpleNameRef: false);
                entityTestEntityAttribute.Entity = inlineProjectionEntityRef;

                entityTestEntityAttributeProjection.Attributes.Add(entityTestEntityAttribute);
            }

            CdmDocumentDefinition entityTestEntityAttributeProjectionDoc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json", false);
            entityTestEntityAttributeProjectionDoc.Imports.Add(FoundationJsonPath);
            entityTestEntityAttributeProjectionDoc.Imports.Add("TestSource.cdm.json");
            entityTestEntityAttributeProjectionDoc.Definitions.Add(entityTestEntityAttributeProjection);

            localRoot.Documents.Add(entityTestEntityAttributeProjectionDoc, entityTestEntityAttributeProjectionDoc.Name);
            manifestDefault.Entities.Add(entityTestEntityAttributeProjection);

            return entityTestEntityAttributeProjection;
        }

        /// <summary>
        /// Create a projection object with operations
        /// </summary>
        /// <param name="corpus"></param>
        /// <returns></returns>
        private CdmProjection CreateProjectionWithOperationCollection(CdmCorpusDefinition corpus, CdmObject owner)
        {
            CdmProjection projection = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            {
                projection.Source = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, "TestSource", simpleNameRef: true);
            }

            {
                // AddCountAttribute Operation
                CdmOperationAddCountAttribute addCountAttributeOp = new CdmOperationAddCountAttribute(corpus.Ctx)
                {
                    CountAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef)
                };
                projection.Operations.Add(addCountAttributeOp);

                // AddSupportingAttribute Operation
                CdmOperationAddSupportingAttribute addSupportingAttributesOp = new CdmOperationAddSupportingAttribute(corpus.Ctx)
                {
                    SupportingAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef)
                };
                projection.Operations.Add(addSupportingAttributesOp);

                // AddTypeAttribute Operation
                CdmOperationAddTypeAttribute addTypeAttributeOp = new CdmOperationAddTypeAttribute(corpus.Ctx)
                {
                    TypeAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef)
                };
                projection.Operations.Add(addTypeAttributeOp);

                // ExcludeAttributes Operation
                CdmOperationExcludeAttributes excludeAttributesOp = new CdmOperationExcludeAttributes(corpus.Ctx)
                {
                    ExcludeAttributes = new List<string>()
                };
                excludeAttributesOp.ExcludeAttributes.Add("testAttribute1");
                projection.Operations.Add(excludeAttributesOp);

                // ArrayExpansion Operation
                CdmOperationArrayExpansion arrayExpansionOp = new CdmOperationArrayExpansion(corpus.Ctx)
                {
                    StartOrdinal = 0,
                    EndOrdinal = 1
                };
                projection.Operations.Add(arrayExpansionOp);

                // CombineAttributes Operation
                CdmOperationCombineAttributes combineAttributesOp = new CdmOperationCombineAttributes(corpus.Ctx)
                {
                    Select = new List<string>(),
                    MergeInto = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef)
                };
                combineAttributesOp.Select.Add("testAttribute1");
                projection.Operations.Add(combineAttributesOp);

                // RenameAttributes Operation
                CdmOperationRenameAttributes renameAttributesOp = new CdmOperationRenameAttributes(corpus.Ctx)
                {
                    RenameFormat = "{m}"
                };
                projection.Operations.Add(renameAttributesOp);

                // ReplaceAsForeignKey Operation
                CdmOperationReplaceAsForeignKey replaceAsForeignKeyOp = new CdmOperationReplaceAsForeignKey(corpus.Ctx)
                {
                    Reference = "testAttribute1",
                    ReplaceWith = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "testForeignKey", simpleNameRef: false)
                };
                projection.Operations.Add(replaceAsForeignKeyOp);

                // IncludeAttributes Operation
                CdmOperationIncludeAttributes includeAttributesOp = new CdmOperationIncludeAttributes(corpus.Ctx)
                {
                    IncludeAttributes = new List<string>()
                };
                includeAttributesOp.IncludeAttributes.Add("testAttribute1");
                projection.Operations.Add(includeAttributesOp);
            }

            return projection;
        }

        /// <summary>
        /// Create an entity 'TestOperationCollection' that extends from a projection with a collection of operations
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="manifestDefault"></param>
        /// <param name="localRoot"></param>
        /// <returns></returns>
        private CdmEntityDefinition CreateEntityTestOperationCollection(CdmCorpusDefinition corpus, CdmManifestDefinition manifestDefault, CdmFolderDefinition localRoot)
        {
            string entityName = "TestOperationCollection";

            CdmEntityReference inlineProjectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            CdmEntityDefinition entityTestOperationCollection = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, entityName);
            inlineProjectionEntityRef.ExplicitReference = CreateProjectionWithOperationCollection(corpus, entityTestOperationCollection);
            entityTestOperationCollection.ExtendsEntity = inlineProjectionEntityRef;

            CdmDocumentDefinition entityTestOperationCollectionDoc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json", false);
            entityTestOperationCollectionDoc.Imports.Add(FoundationJsonPath);
            entityTestOperationCollectionDoc.Imports.Add("TestSource.cdm.json");
            entityTestOperationCollectionDoc.Definitions.Add(entityTestOperationCollection);

            localRoot.Documents.Add(entityTestOperationCollectionDoc, entityTestOperationCollectionDoc.Name);
            manifestDefault.Entities.Add(entityTestOperationCollection);

            return entityTestOperationCollection;
        }
    }
}
