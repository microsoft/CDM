// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Samples
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [TestClass]
    public class LogicalManipulationUsingProjectionsTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = "Samples";

        [TestInitialize]
        public void CheckSampleRunTestsFlag()
        {
            if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("SAMPLE_RUNTESTS")))
            {
               // this will cause tests to appear as "Skipped" in the final result
               Assert.Inconclusive("SAMPLE_RUNTESTS environment variable not set.");
            }
        }

        [TestMethod]
        public async Task TestLogicalManipulationUsingProjections()
        {
            TestHelper.DeleteFilesFromActualOutput(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestLogicalManipulationUsingProjections)));

            await this.LogicalManipulationUsingProjections(this.SetupCdmCorpus());
            TestHelper.AssertFolderFilesEquality(
                TestHelper.GetExpectedOutputFolderPath(testsSubpath, nameof(TestLogicalManipulationUsingProjections)),
                TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestLogicalManipulationUsingProjections)), true);
        }

        private CdmCorpusDefinition SetupCdmCorpus()
        {
            var corpus = new CdmCorpusDefinition();
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetInputFolderPath(testsSubpath, nameof(TestLogicalManipulationUsingProjections))));
            corpus.Storage.Mount("output", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestLogicalManipulationUsingProjections))));
            corpus.Storage.DefaultNamespace = "local";
            corpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SampleSchemaFolderPath));

            return corpus;
        }

        private async Task LogicalManipulationUsingProjections(CdmCorpusDefinition corpus)
        {
            Console.WriteLine("Create logical entity definition.");

            var logicalFolder = await corpus.FetchObjectAsync<CdmFolderDefinition>("output:/");

            var logicalDoc = logicalFolder.Documents.Add("Person.cdm.json");
            logicalDoc.Imports.Add("local:/Address.cdm.json");

            var entity = logicalDoc.Definitions.Add("Person");

            // Add "name" data typed attribute.
            var nameAttr = entity.Attributes.Add("name") as CdmTypeAttributeDefinition;
            nameAttr.DataType = new CdmDataTypeReference(corpus.Ctx, "string", true);

            // Add "age" data typed attribute.
            var ageAttr = entity.Attributes.Add("age") as CdmTypeAttributeDefinition;
            ageAttr.DataType = new CdmDataTypeReference(corpus.Ctx, "string", true);

            // Add "address" entity typed attribute.
            var entityAttr = new CdmEntityAttributeDefinition(corpus.Ctx, "address")
            {
                Entity = new CdmEntityReference(corpus.Ctx, "Address", true)
            };
            ApplyArrayExpansion(entityAttr, 1, 3, "{m}{A}{o}", "countAttribute");
            ApplyDefaultBehavior(entityAttr, "addressFK", "address");

            entity.Attributes.Add(entityAttr);

            // Add "email" data typed attribute.
            var emailAttr = entity.Attributes.Add("email") as CdmTypeAttributeDefinition;
            emailAttr.DataType = new CdmDataTypeReference(corpus.Ctx, "string", true);

            // Save the logical definition of Person.
            await entity.InDocument.SaveAsAsync("Person.cdm.json");

            Console.WriteLine("Get \"resolved\" folder where the resolved entities will be saved.");

            var resolvedFolder = await corpus.FetchObjectAsync<CdmFolderDefinition>("output:/");

            var resOpt = new ResolveOptions(entity);

            // To get more information about directives and their meaning refer to 
            // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#directives-guidance-and-the-resulting-resolved-shapes

            // We will start by resolving this entity with the "normalized" direcitve. 
            // This directive will be used on this and the next two examples so we can analize the resolved entity
            // without the array expansion.
            Console.WriteLine("Resolving logical entity with normalized directive.");
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized" });
            var resNormalizedEntity = await entity.CreateResolvedEntityAsync($"normalized_{entity.EntityName}", resOpt, resolvedFolder);
            await resNormalizedEntity.InDocument.SaveAsAsync($"{resNormalizedEntity.EntityName}.cdm.json");

            // Another common scenario is to resolve an entity using the "referenceOnly" directive. 
            // This directives is used to replace the relationships with a foreign key.
            Console.WriteLine("Resolving logical entity with referenceOnly directive.");
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
            var resReferenceOnlyEntity = await entity.CreateResolvedEntityAsync($"referenceOnly_{entity.EntityName}", resOpt, resolvedFolder);
            await resReferenceOnlyEntity.InDocument.SaveAsAsync($"{resReferenceOnlyEntity.EntityName}.cdm.json");

            // When dealing with structured data, like Json or parquet, it sometimes necessary to represent the idea that 
            // a property can hold a complex object. The shape of the complex object is defined by the source entity pointed by the 
            // entity attribute and we use the "structured" directive to resolve the entity attribute as an attribute group.
            Console.WriteLine("Resolving logical entity with structured directive.");
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "structured" });
            var resStructuredEntity = await entity.CreateResolvedEntityAsync($"structured_{entity.EntityName}", resOpt, resolvedFolder);
            await resStructuredEntity.InDocument.SaveAsAsync($"{resStructuredEntity.EntityName}.cdm.json");

            // Now let us remove the "normalized" directive so the array expansion operation can run.
            Console.WriteLine("Resolving logical entity without directives (array expansion).");
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { });
            var resArrayEntity = await entity.CreateResolvedEntityAsync($"array_expansion_{entity.EntityName}", resOpt, resolvedFolder);
            await resArrayEntity.InDocument.SaveAsAsync($"{resArrayEntity.EntityName}.cdm.json");
        }

        /// <summary>
        /// Applies the replaceAsForeignKey and addAttributeGroup operations to the entity attribute provided.
        /// </summary>
        /// <param name="entityAttr"></param>
        /// <param name="fkAttrName"></param>
        /// <param name="attrGroupName"></param>
        static void ApplyDefaultBehavior(CdmEntityAttributeDefinition entityAttr, string fkAttrName, string attrGroupName)
        {
            var ctx = entityAttr.Ctx;
            CdmProjection projection = new CdmProjection(ctx)
            {
                // Link for the Source property documentation.
                // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#source
                Source = entityAttr.Entity,
                // Link for the RunSequentially property documentation.
                // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#run-sequentially
                RunSequentially = true
            };
            entityAttr.Entity = new CdmEntityReference(ctx, projection, false);

            if (fkAttrName != null)
            {
                var foreignKeyAttr = new CdmTypeAttributeDefinition(ctx, fkAttrName)
                {
                    DataType = new CdmDataTypeReference(ctx, "entityId", true)
                };

                // Link for the ReplaceAsForeignKey operation documentation.
                // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/replaceasforeignkey
                var replaceAsFKOperation = new CdmOperationReplaceAsForeignKey(ctx)
                {
                    Condition = "referenceOnly",
                    Reference = "addressLine",
                    ReplaceWith = foreignKeyAttr
                };
                projection.Operations.Add(replaceAsFKOperation);
            }

            if (attrGroupName != null)
            {
                // Link for the AddAttributeGroup operation documentation.
                // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addattributegroup
                var addAttrGroupOperation = new CdmOperationAddAttributeGroup(ctx)
                {
                    Condition = "structured",
                    AttributeGroupName = attrGroupName
                };
                projection.Operations.Add(addAttrGroupOperation);
            }
        }

        /// <summary>
        /// Applies the arrayExpansion operation to the entity attribute provided.
        /// It also takes care of applying a renameAttributes operation and optionally applying a addCountAttribute operation.
        /// </summary>
        /// <param name="entityAttr"></param>
        /// <param name="startOrdinal"></param>
        /// <param name="endOrdinal"></param>
        /// <param name="renameFormat"></param>
        /// <param name="countAttName"></param>
        static void ApplyArrayExpansion(CdmEntityAttributeDefinition entityAttr, int startOrdinal, int endOrdinal, string renameFormat, string countAttName)
        {
            var ctx = entityAttr.Ctx;
            CdmProjection projection = new CdmProjection(ctx)
            {
                Source = entityAttr.Entity,
                RunSequentially = true,
                // Link for the Condition property documentation.
                // https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#condition
                Condition = "!normalized"
            };
            entityAttr.Entity = new CdmEntityReference(ctx, projection, false);

            // Link for the ArrayExpansion operation documentation.
            // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/arrayexpansion
            var arrExpansionOperation = new CdmOperationArrayExpansion(ctx)
            {
                StartOrdinal = startOrdinal,
                EndOrdinal = endOrdinal
            };
            projection.Operations.Add(arrExpansionOperation);

            // Link for the RenameAttributes operation documentation.
            // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/renameattributes
            var renameAttrsOperation = new CdmOperationRenameAttributes(ctx)
            {
                RenameFormat = renameFormat
            };
            projection.Operations.Add(renameAttrsOperation);

            if (countAttName != null)
            {
                var countAttribute = new CdmTypeAttributeDefinition(ctx, countAttName)
                {
                    DataType = new CdmDataTypeReference(ctx, "integer", true)
                };

                // Link for the AddCountAttribute operation documentation.
                // https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addcountattribute 
                var addCountAttrOperation = new CdmOperationAddCountAttribute(ctx)
                {
                    CountAttribute = countAttribute
                };
                projection.Operations.Add(addCountAttrOperation);
            }
        }
    }
}
