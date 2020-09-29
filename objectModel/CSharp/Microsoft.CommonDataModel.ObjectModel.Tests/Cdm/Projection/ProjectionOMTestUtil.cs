// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;

    /// <summary>
    /// Utility class to help create object model based tests
    /// </summary>
    public sealed class ProjectionOMTestUtil : IDisposable
    {
        private const string FoundationJsonPath = "cdm:/foundations.cdm.json";

        private const string LocalOutputStorageNS = "output";

        private const string ManifestName = "default";

        public readonly string ManifestDocName = $"{ManifestName}.manifest.cdm.json";

        private const string AllImportsName = "_allImports";

        public readonly string AllImportsDocName = $"{AllImportsName}.cdm.json";

        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath;

        /// <summary>
        /// ClassName property
        /// </summary>
        public string ClassName { get; set; }

        /// <summary>
        /// TestName property
        /// </summary>
        public string TestName { get; set; }

        /// <summary>
        /// Corpus property
        /// </summary>
        public CdmCorpusDefinition Corpus { get; set; }

        /// <summary>
        /// Test Folder Input Path
        /// </summary>
        public string InputPath { get; set; }

        /// <summary>
        /// Test Folder Expected Output Path
        /// </summary>
        public string ExpectedOutputPath { get; set; }

        /// <summary>
        /// Test Folder Actual Output Path
        /// </summary>
        public string ActualOutputPath { get; set; }

        /// <summary>
        /// Local storage root folder definition
        /// </summary>
        public CdmFolderDefinition LocalStorageRoot { get; set; }

        /// <summary>
        /// Default manifest definition
        /// </summary>
        public CdmManifestDefinition DefaultManifest { get; set; }

        /// <summary>
        /// All imports files
        /// </summary>
        public CdmDocumentDefinition AllImports { get; set; }

        /// <summary>
        /// Utility class constructor
        /// </summary>
        /// <param name="testName"></param>
        public ProjectionOMTestUtil(string className, string testName)
        {
            ClassName = className;
            TestName = testName;

            testsSubpath = Path.Combine("Cdm", "Projection", ClassName);

            InputPath = TestHelper.GetInputFolderPath(testsSubpath, TestName);
            ExpectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, TestName);
            ActualOutputPath = TestHelper.GetActualOutputFolderPath(testsSubpath, TestName);

            Corpus = TestHelper.GetLocalCorpus(testsSubpath, TestName);
            Corpus.Storage.Mount(LocalOutputStorageNS, new LocalAdapter(ActualOutputPath));
            Corpus.Storage.DefaultNamespace = LocalOutputStorageNS;

            LocalStorageRoot = Corpus.Storage.FetchRootFolder(LocalOutputStorageNS);

            DefaultManifest = CreateDefaultManifest();

            AllImports = CreateAndInitializeAllImportsFile();
        }

        void IDisposable.Dispose()
        {
            Corpus = null;
        }

        /// <summary>
        /// Create a default manifest
        /// </summary>
        public CdmManifestDefinition CreateDefaultManifest()
        {
            CdmManifestDefinition manifestDefault = Corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, ManifestName);
            LocalStorageRoot.Documents.Add(manifestDefault, ManifestDocName);

            return manifestDefault;
        }

        /// <summary>
        /// Create and initialize _allImports file
        /// </summary>
        /// <returns></returns>
        public CdmDocumentDefinition CreateAndInitializeAllImportsFile()
        {
            CdmDocumentDefinition allImportsDoc = new CdmDocumentDefinition(Corpus.Ctx, AllImportsName);

            CdmDocumentDefinition allImportsDocDef = LocalStorageRoot.Documents.Add(allImportsDoc, AllImportsDocName);
            allImportsDocDef.Imports.Add(FoundationJsonPath);

            return allImportsDocDef;
        }

        /// <summary>
        /// Create a simple entity called 'TestSource' with a single attribute
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="attributesParams"></param>
        /// <returns></returns>
        public CdmEntityDefinition CreateBasicEntity(string entityName, List<TypeAttributeParam> attributesParams)
        {
            CdmEntityDefinition entity = Corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, entityName);

            foreach (TypeAttributeParam attributesParam in attributesParams)
            {
                CdmTypeAttributeDefinition attribute = Corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, nameOrRef: attributesParam.AttributeName, simpleNameRef: false);
                attribute.DataType = Corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, refObj: attributesParam.AttributeDataType, simpleNameRef: true);
                attribute.Purpose = Corpus.MakeRef<CdmPurposeReference>(CdmObjectType.PurposeRef, refObj: attributesParam.AttributePurpose, simpleNameRef: true);
                attribute.DisplayName = attributesParam.AttributeName;

                entity.Attributes.Add(attribute);
            }

            CdmDocumentDefinition entityDoc = Corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json", false);
            entityDoc.Imports.Add(AllImportsDocName);
            entityDoc.Definitions.Add(entity);

            LocalStorageRoot.Documents.Add(entityDoc, entityDoc.Name);
            DefaultManifest.Entities.Add(entity);
            AllImports.Imports.Add(entity.InDocument.Name);

            return entity;
        }

        /// <summary>
        /// Function to valid the entity
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="attributesParams"></param>
        public void ValidateBasicEntity(CdmEntityDefinition entity, string entityName, List<TypeAttributeParam> attributesParams)
        {
            Assert.IsNotNull(entity, $"ValidateBasicEntity: {entityName} failed!");
            Assert.AreEqual(entity.Attributes.Count, attributesParams.Count, $"ValidateBasicEntity: Attribute count for {entityName} failed!");
        }

        /// <summary>
        /// Create a simple projection object
        /// </summary>
        /// <param name="projectionSourceName"></param>
        /// <returns></returns>
        public CdmProjection CreateProjection(string projectionSourceName)
        {
            CdmProjection projection = Corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            projection.Source = Corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, projectionSourceName, simpleNameRef: true);

            return projection;
        }

        /// <summary>
        /// Create an inline entity reference for a projection
        /// </summary>
        /// <param name="projectionSourceName"></param>
        /// <returns></returns>
        public CdmEntityReference CreateProjectionInlineEntityReference(CdmProjection projection)
        {
            CdmEntityReference projectionInlineEntityRef = Corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionInlineEntityRef.ExplicitReference = projection;

            return projectionInlineEntityRef;
        }

        /// <summary>
        /// Create an Input Attribute Operation
        /// </summary>
        /// <returns></returns>
        public CdmOperationIncludeAttributes CreateOperationInputAttribute(CdmProjection projection, List<string> includeAttributes)
        {
            // IncludeAttributes Operation
            CdmOperationIncludeAttributes includeAttributesOp = new CdmOperationIncludeAttributes(Corpus.Ctx)
            {
                IncludeAttributes = new List<string>()
            };

            foreach (string includeAttribute in includeAttributes)
            {
                includeAttributesOp.IncludeAttributes.Add(includeAttribute);
            }

            projection.Operations.Add(includeAttributesOp);

            return includeAttributesOp;
        }

        /// <summary>
        /// Create an entity attribute
        /// </summary>
        /// <param name="entityAttributeName"></param>
        /// <param name="projectionSourceEntityRef"></param>
        /// <returns></returns>
        public CdmEntityAttributeDefinition CreateEntityAttribute(string entityAttributeName, CdmEntityReference projectionSourceEntityRef)
        {
            CdmEntityAttributeDefinition entityAttribute = Corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, nameOrRef: entityAttributeName, simpleNameRef: false);
            entityAttribute.Entity = projectionSourceEntityRef;

            return entityAttribute;
        }

        public CdmEntityDefinition GetAndValidateResolvedEntity(CdmEntityDefinition entity, List<string> resOpts)
        {
            CdmEntityDefinition resolvedEntity = ProjectionTestUtils.GetResolvedEntity(Corpus, entity, resOpts, addResOptToName: true).GetAwaiter().GetResult();
            Assert.IsNotNull(resolvedEntity, $"GetAndValidateResolvedEntity: {entity.EntityName} resolution with options '{string.Join(", ", resOpts)}' failed!");

            return resolvedEntity;
        }
    }
}
