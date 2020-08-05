// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;

    /// <summary>
    /// Various projections scenarios, partner scenarios, bug fixes
    /// </summary>
    /// <returns></returns>
    [TestClass]
    public class ProjectionMiscellaneousTest
    {
        private const string FoundationJsonPath = "cdm:/foundations.cdm.json";

        private static List<HashSet<string>> restOptsCombinations = new List<HashSet<string>>() {
            new HashSet<string> { },
            new HashSet<string> { "referenceOnly" },
            new HashSet<string> { "normalized" },
            new HashSet<string> { "structured" },
            new HashSet<string> { "referenceOnly", "normalized" },
            new HashSet<string> { "referenceOnly", "structured" },
            new HashSet<string> { "normalized", "structured" },
            new HashSet<string> { "referenceOnly", "normalized", "structured" },
        };

        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionMiscellaneousTest");

        /// <summary>
        /// Test case scenario for Bug #25 from the projections internal bug bash
        /// Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/25
        /// </summary>
        [TestMethod]
        public void TestMissingConditionInJson()
        {
            string testName = "TestMissingConditionInJson";

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    Assert.Fail(message);
                }
            }, CdmStatusLevel.Warning);

            CdmManifestDefinition manifest = corpus.FetchObjectAsync<CdmManifestDefinition>($"default.manifest.cdm.json").GetAwaiter().GetResult();

            string entityName = "SalesNestedFK";
            CdmEntityDefinition entity = corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest).GetAwaiter().GetResult();
            Assert.IsNotNull(entity);

            ResolveOptions resOpt = new ResolveOptions(entity.InDocument)
            {
                // where, restOptsCombinations[1] == "referenceOnly"
                Directives = new AttributeResolutionDirectiveSet(restOptsCombinations[1])
            };

            CdmFolderDefinition resolvedFolder = corpus.Storage.FetchRootFolder("output");

            bool wasInfoMessageReceived = false;

            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (StringUtils.EqualsWithIgnoreCase("CdmProjection | Optional expression missing. Implicit expression will automatically apply. | ConstructProjectionContext", message))
                    {
                        wasInfoMessageReceived = true;
                    }
                }
            }, CdmStatusLevel.Info);

            CdmEntityDefinition resolvedEntity = entity.CreateResolvedEntityAsync($"Resolved_{entityName}.cdm.json", resOpt, resolvedFolder).GetAwaiter().GetResult();
            Assert.IsNotNull(resolvedEntity);

            Assert.IsTrue(wasInfoMessageReceived);
        }

        /// <summary>
        /// Test case scenario for Bug #24 from the projections internal bug bash
        /// Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/24
        /// </summary>
        [TestMethod]
        public void TestInvalidOperationType()
        {
            string testName = "TestInvalidOperationType";

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (!StringUtils.EqualsWithIgnoreCase($"ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'. | FromData", message))
                    {
                        Assert.Fail(message);
                    }
                }
            }, CdmStatusLevel.Warning);

            CdmManifestDefinition manifest = corpus.FetchObjectAsync<CdmManifestDefinition>($"default.manifest.cdm.json").GetAwaiter().GetResult();

            // Raise error: $"ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'. | FromData",
            // when attempting to load a projection with an invalid operation
            string entityName = "SalesNestedFK";
            CdmEntityDefinition entity = corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest).GetAwaiter().GetResult();
            Assert.IsNotNull(entity);
        }

        /// <summary>
        /// Test case scenario for Bug #23 from the projections internal bug bash
        /// Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/23
        /// </summary>
        [TestMethod]
        public void TestZeroMinimumCardinality()
        {
            string testName = "TestZeroMinimumCardinality";

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    Assert.Fail(message);
                }
            }, CdmStatusLevel.Warning);

            // Create Local Root Folder
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create Manifest
            CdmManifestDefinition manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "default");
            localRoot.Documents.Add(manifest, "default.manifest.cdm.json");

            string entityName = "TestEntity";

            // Create Entity
            CdmEntityDefinition entity = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, entityName);
            entity.ExtendsEntity = corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, "CdmEntity", true);

            // Create Entity Document
            CdmDocumentDefinition document = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json", false);
            document.Definitions.Add(entity);
            localRoot.Documents.Add(document, document.Name);
            manifest.Entities.Add(entity);

            string attributeName = "testAttribute";
            string attributeDataType = "string";
            string attributePurpose = "hasA";

            // Create Type Attribute
            CdmTypeAttributeDefinition attribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, nameOrRef: attributeName, simpleNameRef: false);
            attribute.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, refObj: attributeDataType, simpleNameRef: true);
            attribute.Purpose = corpus.MakeRef<CdmPurposeReference>(CdmObjectType.PurposeRef, refObj: attributePurpose, simpleNameRef: true);
            attribute.DisplayName = attributeName;

            if (entity != null)
            {
                entity.Attributes.Add(attribute);
            }

            attribute.Cardinality = new CardinalitySettings(attribute)
            {
                Minimum = "0",
                Maximum = "*"
            };

            Assert.IsTrue(attribute.IsNullable == true);
        }
    }
}
