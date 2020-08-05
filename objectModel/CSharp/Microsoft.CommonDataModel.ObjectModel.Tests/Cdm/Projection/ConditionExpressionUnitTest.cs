// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;

    /// <summary>
    /// Unit test for ConditionExpression functions
    /// </summary>
    /// <returns></returns>
    [TestClass]
    public class ConditionExpressionUnitTest
    {
        private const string FoundationJsonPath = "cdm:/foundations.cdm.json";

        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ConditionExpressionUnitTest");

        /// <summary>
        /// Unit test for ConditionExpression.GetDefaultConditionExpression
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public void TestGetDefaultConditionExpression()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestGetDefaultConditionExpression");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestGetDefaultConditionExpression")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");
            CdmManifestDefinition manifestDefault = CreateDefaultManifest(corpus, localRoot);

            CdmEntityDefinition entityTestSource = CreateEntityTestSource(corpus, manifestDefault, localRoot);

            // projection for a non entity attribute 
            CdmOperationCollection opColl = new CdmOperationCollection(corpus.Ctx, entityTestSource);
            {
                // add 1st FK
                opColl.Add(new CdmOperationReplaceAsForeignKey(corpus.Ctx));
                Assert.AreEqual($" (referenceOnly || noMaxDepth || (depth > maxDepth)) ", ConditionExpression.GetDefaultConditionExpression(opColl, owner: entityTestSource));

                // add 2nd FK
                opColl.Add(new CdmOperationReplaceAsForeignKey(corpus.Ctx));
                Assert.AreEqual($" (referenceOnly || noMaxDepth || (depth > maxDepth)) ", ConditionExpression.GetDefaultConditionExpression(opColl, owner: entityTestSource));

                opColl.Clear();

                // add AddCount
                opColl.Add(new CdmOperationAddCountAttribute(corpus.Ctx));
                Assert.AreEqual($" (!structured) ", ConditionExpression.GetDefaultConditionExpression(opColl, owner: entityTestSource));

                // add ArrayExpansion
                opColl.Add(new CdmOperationArrayExpansion(corpus.Ctx));
                Assert.AreEqual($" (!structured) ", ConditionExpression.GetDefaultConditionExpression(opColl, owner: entityTestSource));

                opColl.Clear();

                // add AddSupporting
                opColl.Add(new CdmOperationAddSupportingAttribute(corpus.Ctx));
                Assert.AreEqual($" (true) ", ConditionExpression.GetDefaultConditionExpression(opColl, owner: entityTestSource));
            }

            CdmEntityAttributeDefinition entityTestEntityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, nameOrRef: "TestEntityAttribute", simpleNameRef: false);

            // projection for a non entity attribute 
            CdmOperationCollection opCollEA = new CdmOperationCollection(corpus.Ctx, entityTestEntityAttribute);
            {
                // add 1st FK
                opCollEA.Add(new CdmOperationReplaceAsForeignKey(corpus.Ctx));
                Assert.AreEqual($" ( (!normalized) || (cardinality.maximum <= 1) )  &&  (referenceOnly || noMaxDepth || (depth > maxDepth)) ", ConditionExpression.GetDefaultConditionExpression(opCollEA, owner: entityTestEntityAttribute));

                // add 2nd FK
                opCollEA.Add(new CdmOperationReplaceAsForeignKey(corpus.Ctx));
                Assert.AreEqual($" ( (!normalized) || (cardinality.maximum <= 1) )  &&  (referenceOnly || noMaxDepth || (depth > maxDepth)) ", ConditionExpression.GetDefaultConditionExpression(opCollEA, owner: entityTestEntityAttribute));

                opCollEA.Clear();

                // add AddCount
                opCollEA.Add(new CdmOperationAddCountAttribute(corpus.Ctx));
                Assert.AreEqual($" ( (!normalized) || (cardinality.maximum <= 1) )  &&  (!structured) ", ConditionExpression.GetDefaultConditionExpression(opCollEA, owner: entityTestEntityAttribute));

                // add ArrayExpansion
                opCollEA.Add(new CdmOperationArrayExpansion(corpus.Ctx));
                Assert.AreEqual($" ( (!normalized) || (cardinality.maximum <= 1) )  &&  (!structured) ", ConditionExpression.GetDefaultConditionExpression(opCollEA, owner: entityTestEntityAttribute));

                opCollEA.Clear();

                // add AddSupporting
                opCollEA.Add(new CdmOperationAddSupportingAttribute(corpus.Ctx));
                Assert.AreEqual($" ( (!normalized) || (cardinality.maximum <= 1) )  &&  (true) ", ConditionExpression.GetDefaultConditionExpression(opCollEA, owner: entityTestEntityAttribute));
            }
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

    }
}
