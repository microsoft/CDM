// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace entity_modeling_using_projections
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /**
     * This sample demonstrates how to model a set of common scenarios using projections. 
     * The projections feature provides a way to customize the definition of a logical entity by influencing how the entity is resolved by the object model.
     * Here we will model three common use cases for using projections that are associated with the directives "referenceOnly", "structured" and "normalized".
     * A single logical definition can be resolved into multiple physical layouts. The directives are used to instruct the ObjectModel about how it should to
     * resolve the logical definition provided. To achieve this, we define projections that run conditionally, depending on the directives provided when
     * calling CreateResolvedEntityAsync.
     * To get an overview of the projections feature as well as all of the supported operations refer to the link below.
     * https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
     */
    class Program
    {
        static async Task Main(string[] args)
        {
            // Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating objects and paths
            var corpus = new CdmCorpusDefinition();

            Console.WriteLine("Configure storage adapters.");

            // Configure storage adapters to point at the target local manifest location and at the fake public standards
            string pathFromExeToExampleRoot = "../../../../../../";

            corpus.Storage.Mount("local", new LocalAdapter(pathFromExeToExampleRoot + "8-logical-manipulation-using-projections/sample-data"));
            corpus.Storage.DefaultNamespace = "local"; // local is our default. so any paths that start out navigating without a device tag will assume local

            // Fake cdm, normaly use the CDM Standards adapter
            // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there
            corpus.Storage.Mount("cdm", new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards"));

            Console.WriteLine("Create logical entity definition.");

            var logicalFolder = await corpus.FetchObjectAsync<CdmFolderDefinition>("local:/");
            
            var logicalDoc = logicalFolder.Documents.Add("Person.cdm.json");
            logicalDoc.Imports.Add("Address.cdm.json");

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

            var resolvedFolder = await corpus.FetchObjectAsync<CdmFolderDefinition>("local:/resolved/");

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
            // Doing an ArrayExpansion without a RenameAttributes afterwards will result in the expanded attributes being merged in the final resolved entity.
            // This is because ArrayExpansion does not rename the attributes it expands by default. The expanded attributes end up with the same name and gets merged.
            // Example: We expand A to A[1], A[2], A[3], but A[1], A[2], A[3] are still named "A".
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
                // It is recommended, but not mandated, to be used with the ArrayExpansion operation to provide an ArrayExpansion a count attribute that
                // represents the total number of expanded elements. AddCountAttribute can also be used by itself.
                var addCountAttrOperation = new CdmOperationAddCountAttribute(ctx)
                {
                    CountAttribute = countAttribute
                };
                projection.Operations.Add(addCountAttrOperation);
            }
        }
    }
}
