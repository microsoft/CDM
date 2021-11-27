// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// Common utility methods for projection tests.
    /// If you want to update the expected output txt files for all the tests that are ran,
    /// please set the parameter <c updateExpectedOutput/> <c true/> in the method <see cref="ProjectionTestUtils.ValidateAttributeContext(List{string}, string, string, CdmEntityDefinition, bool)"</see>
    /// </summary>
    class ProjectionTestUtils
    {
        /// <summary>
        /// Path to foundations
        /// </summary>
        private const string foundationJsonPath = "cdm:/foundations.cdm.json";

        /// <summary>
        /// Resolves an entity
        /// </summary>
        /// <param name="corpus">The corpus</param>
        /// <param name="inputEntity">The entity to resolve</param>
        /// <param name="directives">A set of directives to be used during resolution</param>
        public static async Task<CdmEntityDefinition> GetResolvedEntity(CdmCorpusDefinition corpus, CdmEntityDefinition inputEntity, List<string> directives)
        {
            string resolvedEntityName = $"Resolved_{inputEntity.EntityName}";

            ResolveOptions resOpt = new ResolveOptions(inputEntity.InDocument)
            {
                Directives = new AttributeResolutionDirectiveSet(new HashSet<string>(directives))
            };

            CdmFolderDefinition resolvedFolder = corpus.Storage.FetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = await inputEntity.CreateResolvedEntityAsync(resolvedEntityName, resOpt, resolvedFolder);

            return resolvedEntity;
        }

        /// <summary>
        /// Returns a suffix that contains the file name and resolution option used
        /// </summary>
        /// <param name="directives">The set of directives used for resolution</param>
        public static string GetResolutionOptionNameSuffix(List<string> directives, string expectedOutputPath = null, string entityName = null)
        {
            string fileNamePrefix = string.Empty;

            foreach (string directive in directives)
            {
                string shortenedDirective;

                switch (directive)
                {
                    case "normalized":
                        shortenedDirective = "norm";
                        break;
                    case "referenceOnly":
                        shortenedDirective = "refOnly";
                        break;
                    case "structured":
                        shortenedDirective = "struc";
                        break;
                    case "virtual":
                        shortenedDirective = "virt";
                        break;
                    default:
                        Assert.Fail("Using unsupported directive");
                        return null;
                }

                fileNamePrefix = $"{fileNamePrefix}_{shortenedDirective}";
            }

            bool fileExists = expectedOutputPath != null && entityName != null ?
                File.Exists(Path.Combine(expectedOutputPath, $"AttrCtx_{entityName}{fileNamePrefix}.txt")) :
                true;

            if (string.IsNullOrWhiteSpace(fileNamePrefix) || !fileExists)
            {
                fileNamePrefix = "_default";
            }

            return fileNamePrefix;
        }

        /// <summary>
        /// Loads an entity, resolves it, and then validates the generated attribute contexts.
        /// </summary>
        public static async Task<CdmEntityDefinition> LoadEntityForResolutionOptionAndSave(CdmCorpusDefinition corpus, string testName, string testsSubpath, string entityName, List<string> directives, bool updateExpectedOutput = false)
        {
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            Assert.IsNotNull(entity);
            CdmEntityDefinition resolvedEntity = await GetResolvedEntity(corpus, entity, directives);
            Assert.IsNotNull(resolvedEntity);

            await ValidateAttributeContext(directives, expectedOutputPath, entityName, resolvedEntity, updateExpectedOutput);

            return resolvedEntity;
        }

        /// <summary>
        /// Creates an entity
        /// </summary>
        public static CdmEntityDefinition CreateEntity(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot)
        {
            string entityName = "TestEntity";
            CdmEntityDefinition entity = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, entityName);

            CdmDocumentDefinition entityDoc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json", false);
            entityDoc.Imports.Add(foundationJsonPath);
            entityDoc.Definitions.Add(entity);
            localRoot.Documents.Add(entityDoc, entityDoc.Name);

            return entity;
        }

        /// <summary>
        /// Creates a source entity for a projection
        /// </summary>
        public static CdmEntityDefinition CreateSourceEntity(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot)
        {
            string entityName = "SourceEntity";
            CdmEntityDefinition entity = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, entityName);

            string attributeName1 = "id";
            CdmTypeAttributeDefinition attribute1 = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, attributeName1);
            attribute1.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "string", true);
            entity.Attributes.Add(attribute1);

            string attributeName2 = "name";
            CdmTypeAttributeDefinition attribute2 = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, attributeName2);
            attribute2.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "string", true);
            entity.Attributes.Add(attribute2);

            string attributeName3 = "value";
            CdmTypeAttributeDefinition attribute3 = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, attributeName3);
            attribute3.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "integer", true);
            entity.Attributes.Add(attribute3);

            string attributeName4 = "date";
            CdmTypeAttributeDefinition attribute4 = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, attributeName4);
            attribute4.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "date", true);
            entity.Attributes.Add(attribute4);

            CdmDocumentDefinition entityDoc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json", false);
            entityDoc.Imports.Add(foundationJsonPath);
            entityDoc.Definitions.Add(entity);
            localRoot.Documents.Add(entityDoc, entityDoc.Name);

            return entity;
        }

        /// <summary>
        /// Creates a projection
        /// </summary>
        public static CdmProjection CreateProjection(CdmCorpusDefinition corpus, CdmFolderDefinition localRoot)
        {
            // Create an entity reference to use as the source of the projection
            CdmEntityReference projectionSource = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionSource.ExplicitReference = CreateSourceEntity(corpus, localRoot);

            // Create the projection
            CdmProjection projection = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            projection.Source = projectionSource;

            return projection;
        }

        /// <summary>
        /// Validates trait "has.expansionInfo.list" for array type.
        /// </summary>
        /// <param name="attribute">The type attribute.</param>
        /// <param name="expectedAttrName">The expected attribute name.</param>
        /// <param name="ordinal">The expected ordinal.</param>
        /// <param name="expansionName">The expected expansion name.</param>
        /// <param name="memberAttribute">The expected member attribute name.</param>
        /// <returns></returns>
        public static void ValidateExpansionInfoTrait(CdmTypeAttributeDefinition attribute, string expectedAttrName, int ordinal, string expansionName, string memberAttribute)
        {
            Assert.AreEqual(expectedAttrName, attribute.Name);
            CdmTraitReference trait = (CdmTraitReference) attribute.AppliedTraits.Item("has.expansionInfo.list");
            Assert.IsNotNull(trait);
            Assert.AreEqual(trait.Arguments.FetchValue("expansionName"), expansionName);
            Assert.AreEqual(trait.Arguments.FetchValue("ordinal"), ordinal.ToString());
            Assert.AreEqual(trait.Arguments.FetchValue("memberAttribute"), memberAttribute);
        }

        /// <summary>
        /// Validates the creation of an attribute group and return its definition
        /// </summary>
        /// <param name="attributes">The collection of attributes.</param>
        /// <param name="attributeGroupName">The attribute group name.</param>
        /// <param name="attributesSize">The expected size of the attributes collection.</param>
        /// <returns></returns>
        public static CdmAttributeGroupDefinition ValidateAttributeGroup(CdmCollection<CdmAttributeItem> attributes, string attributeGroupName, int attributesSize = 1, int index = 0)
        {
            Assert.AreEqual(attributesSize, attributes.Count);
            Assert.AreEqual(CdmObjectType.AttributeGroupRef, attributes[index].ObjectType);
            CdmAttributeGroupReference attGroupReference = attributes[index] as CdmAttributeGroupReference;
            Assert.IsNotNull(attGroupReference.ExplicitReference);

            CdmAttributeGroupDefinition attGroupDefinition = attGroupReference.ExplicitReference as CdmAttributeGroupDefinition;
            Assert.AreEqual(attributeGroupName, attGroupDefinition.AttributeGroupName);

            return attGroupDefinition;
        }

        /// <summary>
        /// Validates if the attribute context of the resolved entity matches the expected output.
        /// </summary>
        /// <param name="directives"></param>
        /// <param name="expectedOutputPath"></param>
        /// <param name="entityName"></param>
        /// <param name="resolvedEntity"></param>
        /// <param name="updateExpectedOutput">If true, will update the expected output txt files for all the tests that are ran.</param>
        private static async Task ValidateAttributeContext(List<string> directives, string expectedOutputPath, string entityName, CdmEntityDefinition resolvedEntity, bool updateExpectedOutput = false)
        {
            if (resolvedEntity.AttributeContext == null)
            {
                throw new Exception("ValidateAttributeContext called with not resolved entity.");
            }

            string fileNamePrefix = $"AttrCtx_{entityName}";
            string fileNameSuffix = GetResolutionOptionNameSuffix(directives);

            // Get actual text
            AttributeContextUtil attrCtxUtil = new AttributeContextUtil();
            string actualText = attrCtxUtil.GetAttributeContextStrings(resolvedEntity);
            string expectedStringFilePath;

            if (updateExpectedOutput)
            {
                expectedStringFilePath = Path.GetFullPath(Path.Combine(expectedOutputPath, $"{fileNamePrefix}{fileNameSuffix}.txt"));

                if (directives.Count > 0)
                {
                    string defaultFileNameSuffix = GetResolutionOptionNameSuffix(new List<string>() { });
                    string defaultStringFilePath = Path.GetFullPath(Path.Combine(expectedOutputPath, $"{fileNamePrefix}{defaultFileNameSuffix}.txt"));
                    string defaultText = File.Exists(defaultStringFilePath) ? File.ReadAllText(defaultStringFilePath) : null;

                    if (actualText.Equals(defaultText))
                    {
                        File.Delete(expectedStringFilePath);
                    }
                    else
                    {
                        File.WriteAllText(expectedStringFilePath, actualText);
                    }
                }
                else
                {
                    File.WriteAllText(expectedStringFilePath, actualText);
                }
            }
            else
            {
                // Actual
                string actualStringFilePath = Path.GetFullPath(Path.Combine(expectedOutputPath, "..", TestHelper.GetTestActualOutputFolderName(), $"{fileNamePrefix}{fileNameSuffix}.txt"));

                // Save Actual AttrCtx_*.txt and Resolved_*.cdm.json
                File.WriteAllText(actualStringFilePath, actualText);
                await resolvedEntity.InDocument.SaveAsAsync($"{resolvedEntity.EntityName}{fileNameSuffix}.cdm.json", saveReferenced: false);

                // Expected
                string expectedFileNameSuffix = GetResolutionOptionNameSuffix(directives, expectedOutputPath, entityName);
                expectedStringFilePath = Path.GetFullPath(Path.Combine(expectedOutputPath, $"{fileNamePrefix}{expectedFileNameSuffix}.txt"));
                string expectedText = File.ReadAllText(expectedStringFilePath);

                // Test if Actual is Equal to Expected
                Assert.AreEqual(expectedText.Replace("\r\n", "\n"), actualText.Replace("\r\n", "\n"));
            }
        }
    }
}
