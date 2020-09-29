// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// Common utility methods for projection tests
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
        /// <param name="resolutionOptions">The resolution options</param>
        /// <param name="addResOptToName">Whether to add the resolution options as part of the resolved entity name</param>
        public static async Task<CdmEntityDefinition> GetResolvedEntity(CdmCorpusDefinition corpus, CdmEntityDefinition inputEntity, List<string> resolutionOptions, bool addResOptToName = false)
        {
            HashSet<string> roHashSet = new HashSet<string>(resolutionOptions);

            string resolvedEntityName = "";

            if (addResOptToName)
            {
                string fileNameSuffix = GetResolutionOptionNameSuffix(resolutionOptions);
                resolvedEntityName = $"Resolved_{inputEntity.EntityName}{fileNameSuffix}";
            }
            else
            {
                resolvedEntityName = $"Resolved_{inputEntity.EntityName}";
            }

            ResolveOptions ro = new ResolveOptions(inputEntity.InDocument)
            {
                Directives = new AttributeResolutionDirectiveSet(roHashSet)
            };

            CdmFolderDefinition resolvedFolder = corpus.Storage.FetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = await inputEntity.CreateResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder);
            await resolvedEntity.InDocument.SaveAsAsync($"{resolvedEntityName}.cdm.json", saveReferenced: false);

            return resolvedEntity;
        }

        /// <summary>
        /// Returns a suffix that contains the file name and resolution option used
        /// </summary>
        /// <param name="resolutionOptions">The resolution options</param>
        public static string GetResolutionOptionNameSuffix(List<string> resolutionOptions)
        {
            string fileNamePrefix = string.Empty;

            for (int i = 0; i < resolutionOptions.Count; i++)
            {
                fileNamePrefix = $"{fileNamePrefix}_{resolutionOptions[i]}";
            }

            if (string.IsNullOrWhiteSpace(fileNamePrefix))
            {
                fileNamePrefix = "_default";
            }

            return fileNamePrefix;
        }

        /// <summary>
        /// Loads an entity, resolves it, and then validates the generated attribute contexts.
        /// </summary>
        public static async Task LoadEntityForResolutionOptionAndSave(CdmCorpusDefinition corpus, string testName, string testsSubpath, string entityName, List<string> resOpts)
        {
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);
            string fileNameSuffix = GetResolutionOptionNameSuffix(resOpts);

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await GetResolvedEntity(corpus, entity, resOpts, true);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, $"{entityName}{fileNameSuffix}", resolvedEntity);
        }

        /// <summary>
        /// Creates a corpus
        /// </summary>
        public static CdmCorpusDefinition GetCorpus(string testName, string testsSubpath)
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            return corpus;
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
    }
}
