// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace create_net_new_entities
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;

    /*
    * ----------------------------------------------------------------------------------------------------------------------------------------
    * This sample is going to simulate the steps a tool would follow in order to create a new manifest document 
    * in some user storage folder with two types of entities - a net new entity and an entity extended from some public standards.
    * Note: If we want to create a relationship from a new custom entity to an existing entity which is loaded from some public standards, 
    * we need to create an entity extended from the existing entity and add a relationship to the attribute of the new entity.
    * Since we can't modify attributes from an 'abstract' schema defintion in the public standards.
    * This sample also creates a relationship from a net new entity to an existing entity, and a relationship between two net new entities.
    * NOTE: Relationships can be created with using of projections, please check out the eighth example 8-logical-manipulation-using-projections for more details.
    * 
    * The steps are:
    *      1. Create a temporary 'manifest' object at the root of the corpus
    *      2. Create two net new entities without extending any existing entity, create a relationship from one to the other, and add them to the manifest
    *      3. Create one entity which extends from the public standards, create a relationship from it to a net new entity, and add the entity to the manifest
    *      4. Make a 'resolved' version of each entity doc in our local folder. Call CreateResolvedManifestAsync on our starting manifest. 
    *          This will resolve everything and find all of the relationships between entities for us. Please check out the second example 2-create-manifest for more details
    *      5. Save the new document(s) 
    * ----------------------------------------------------------------------------------------------------------------------------------------
    */

    class Program
    {
        // Path of the folder where schema documents are stored
        private const string SchemaDocsRoot = "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords";

        // the names of the custom entities for this sample
        private const string CustomAccountEntityName = "CustomAccount";
        private const string CustomPersonEntityName = "CustomPerson";
        private const string ExtendedStandardAccount = "ExtendedStandardAccount";

        private const string FoundationJsonPath = "cdm:/foundations.cdm.json";

        static async Task Main()
        {
            // Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating objects and paths
            var cdmCorpus = new CdmCorpusDefinition();

            Console.WriteLine("configure storage adapters");

            // Configure storage adapters to point at the target local manifest location and at the fake public standards
            var pathFromExeToExampleRoot = "../../../../../../";


            cdmCorpus.Storage.Mount("local", new LocalAdapter(pathFromExeToExampleRoot + "6-create-net-new-entities/sample-data"));
            cdmCorpus.Storage.DefaultNamespace = "local"; // local is our default. so any paths that start out navigating without a device tag will assume local

            // Fake cdm, normally use the CDM Standards adapter
            // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards"));

            // Example how to mount to the ADLS.
            // cdmCorpus.Storage.Mount("adls",
            //    new ADLSAdapter(
            // "<ACCOUNT-NAME>.dfs.core.windows.net", // Hostname.
            // "/<FILESYSTEM-NAME>", // Root.
            // "72f988bf-86f1-41af-91ab-2d7cd011db47",  // Tenant ID.
            // "<CLIENT-ID>",  // Client ID.
            // "<CLIENT-SECRET>" // Client secret.
            // ));

            Console.WriteLine("Make placeholder manifest");
            // Make the temp manifest and add it to the root of the local documents in the corpus
            CdmManifestDefinition manifestAbstract = cdmCorpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "tempAbstract");

            // Add the temp manifest to the root of the local adapter in the corpus
            var localRoot = cdmCorpus.Storage.FetchRootFolder("local");
            localRoot.Documents.Add(manifestAbstract, "TempAbstract.manifest.cdm.json");

            // Create two entities from scratch, and add some attributes, traits, properties, and relationships in between
            Console.WriteLine("Create net new entities");


            // Create the simplest entity - CustomPerson 
            // Create the entity definition instance
            var personEntity = cdmCorpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, CustomPersonEntityName, false);
            // Add type attributes to the entity instance
            // Both purpose "identifiedBy" and data type "entityId" are defined in public standards on the document /samples/example-public-standards/primitives.cdm.json
            var personAttributeId = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, $"{CustomPersonEntityName}Id", "identifiedBy", "entityId");
            personEntity.Attributes.Add(personAttributeId);
            // Both purpose "hasA" and data type "name" are defined in public standards
            // The purpose "hasA" is from /samples/example-public-standards/primitives.cdm.json
            // The data type "name" is from /samples/example-public-standards/meanings.identity.cdm.json
            var personAttributeName = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, $"{CustomPersonEntityName}Name", "hasA", "name");
            personEntity.Attributes.Add(personAttributeName);
            // Add properties to the entity instance
            personEntity.DisplayName = CustomPersonEntityName;
            personEntity.Version = "0.0.1";
            personEntity.Description = "This is a custom entity created for the sample.";
            // Create the document which contains the entity
            var personEntityDoc = cdmCorpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{CustomPersonEntityName}.cdm.json", false);
            // Add an import to the foundations doc so the traits about partitons will resolve nicely
            personEntityDoc.Imports.Add(FoundationJsonPath);
            personEntityDoc.Definitions.Add(personEntity);
            // Add the document to the root of the local documents in the corpus
            localRoot.Documents.Add(personEntityDoc, personEntityDoc.Name);
            // Add the entity to the manifest
            manifestAbstract.Entities.Add(personEntity);


            // Create an entity - CustomAccount which has a relationship with the entity CustomPerson
            // Create the entity definition instance
            var accountEntity = cdmCorpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, CustomAccountEntityName, false);
            // Add type attributes to the entity instance
            var accountAttributeId = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, $"{CustomAccountEntityName}Id", "identifiedBy", "entityId");
            accountEntity.Attributes.Add(accountAttributeId);
            var accountAttributeName = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, $"{CustomAccountEntityName}Name", "hasA", "name");
            accountEntity.Attributes.Add(accountAttributeName);
            // Add properties to the entity instance
            accountEntity.DisplayName = CustomAccountEntityName;
            accountEntity.Version = "0.0.1";
            accountEntity.Description = "This is a custom entity created for the sample.";
            // In this sample, every account has one person who owns the account
            // the relationship is actually an entity attribute
            var attributeExplanation = "The owner of the account, which is a person.";
            // You can call CreateSimpleAttributeForRelationshipBetweenTwoEntities() instead, but CreateEntityAttributeForRelationshipBetweenTwoEntities() can show 
            // more details of how to use resolution guidance to customize your data
            var accountOwnerAttribute = CreateEntityAttributeForRelationshipBetweenTwoEntities(cdmCorpus, CustomPersonEntityName, "accountOwner", attributeExplanation);
            accountEntity.Attributes.Add(accountOwnerAttribute);
            // Create the document which contains the entity
            var accountEntityDoc = cdmCorpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{CustomAccountEntityName}.cdm.json", false);
            // Add an import to the foundations doc so the traits about partitons will resolve nicely
            accountEntityDoc.Imports.Add(FoundationJsonPath);
            // The CustomAccount entity has a relationship with the CustomPerson entity, this relationship is defined from its attribute with traits, 
            // the import to the entity reference CustomPerson's doc is required
            accountEntityDoc.Imports.Add($"{CustomPersonEntityName}.cdm.json");
            accountEntityDoc.Definitions.Add(accountEntity);
            // Add the document to the root of the local documents in the corpus
            localRoot.Documents.Add(accountEntityDoc, accountEntityDoc.Name);
            // Add the entity to the manifest
            manifestAbstract.Entities.Add(accountEntity);

            // Create an entity which extends "Account" from the standard, it contains everything that "Account" has
            var extendedStandardAccountEntity = cdmCorpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, ExtendedStandardAccount, false);
            // This function with 'true' will make a simple reference to the base
            extendedStandardAccountEntity.ExtendsEntity = cdmCorpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, "Account", true);
            var attrExplanation = "This is a simple custom account for this sample.";
            // Add a relationship from it to the CustomAccount entity, and name the foreign key to SimpleCustomAccount
            // You can also call CreateEntityAttributeForRelationshipBetweenTwoEntities() instead like above 
            var simpleCustomAccountAttribute = CreateSimpleEntityAttributeForRelationshipBetweenTwoEntities(cdmCorpus, CustomAccountEntityName, "SimpleCustomAccount", attrExplanation);
            extendedStandardAccountEntity.Attributes.Add(simpleCustomAccountAttribute);
            var extendedStandardAccountEntityDoc = cdmCorpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{ExtendedStandardAccount}.cdm.json", false);
            // Add an import to the foundations doc so the traits about partitons will resolve nicely
            extendedStandardAccountEntityDoc.Imports.Add(FoundationJsonPath);
            // The ExtendedAccount entity extends from the "Account" entity from standards, the import to the entity Account's doc is required
            // it also has a relationship with the CustomAccount entity, the relationship defined from its from its attribute with traits, the import to the entity reference CustomAccount's doc is required
            extendedStandardAccountEntityDoc.Imports.Add($"{SchemaDocsRoot}/Account.cdm.json");
            extendedStandardAccountEntityDoc.Imports.Add($"{CustomAccountEntityName}.cdm.json");
            // Add the document to the root of the local documents in the corpus
            localRoot.Documents.Add(extendedStandardAccountEntityDoc, extendedStandardAccountEntityDoc.Name);
            extendedStandardAccountEntityDoc.Definitions.Add(extendedStandardAccountEntity);
            // Add the entity to the manifest
            manifestAbstract.Entities.Add(extendedStandardAccountEntity);

            // Create the resolved version of everything in the root folder too
            Console.WriteLine("Resolve the placeholder");
            var manifestResolved = await manifestAbstract.CreateResolvedManifestAsync("default", null);

            // Add an import to the foundations doc so the traits about partitons will resolve nicely
            manifestResolved.Imports.Add(FoundationJsonPath);

            Console.WriteLine("Save the documents");

            // We can save the documents as manifest.cdm.json format or model.json
            // Save as manifest.cdm.json
            await manifestResolved.SaveAsAsync($"{manifestResolved.ManifestName}.manifest.cdm.json", true);
            // Save as a model.json
            // await manifestResolved.SaveAsAsync("model.json", true);
        }

        /// <summary>
        /// Create an type attribute definition instance with provided purpose and data type.
        /// </summary>
        /// <param name="cdmCorpus"> The CDM corpus. </param>
        /// <param name="attributeName"> The directives to use while getting the resolved entities. </param>
        /// <param name="purpose"> The purpose name that is defined in public standards. </param>
        /// <param name="dataType"> The data type name that is defind in public standards.</param>
        /// <returns> The instance of type attribute definition. </returns>
        private static CdmTypeAttributeDefinition CreateTypeAttributeWithPurposeAndDataType(CdmCorpusDefinition cdmCorpus, string attributeName, string purpose, string dataType)
        {
            var typeAttribute = cdmCorpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, attributeName, false);
            typeAttribute.Purpose = cdmCorpus.MakeRef<CdmPurposeReference>(CdmObjectType.PurposeRef, purpose, true);
            typeAttribute.DataType = cdmCorpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, dataType, true);
            return typeAttribute;
        }

        /// <summary>
        /// Create an purpose reference instance which points to `meaningOfRelationshipVerbPhrases` which is defined in public standards.
        /// </summary>
        /// <param name="cdmCorpus"> The CDM corpus. </param>
        /// <returns> The instance of purpose reference. </returns>
        private static CdmPurposeReference CreateRelationshipMeanings(CdmCorpusDefinition cdmCorpus, string customMessage)
        {
            // The purpose "meaningOfRelationshipVerbPhrases" is from /samples/example-public-standards/foundations.cdm.json
            // With the use of this purpose, two additional traits ("means.relationship.verbPhrase" and "means.relationship.inverseVerbPhrase") will be added by default
            // as they are attached to the purpose definition.
            CdmPurposeReference purposeRef = cdmCorpus.MakeRef<CdmPurposeReference>(CdmObjectType.PurposeRef, "meaningOfRelationshipVerbPhrases", false);

            // You can add your own argument to the additional traits 
            // The trait "means.relationship.verbPhrase" is also from /samples/example-public-standards/foundations.cdm.json
            // This trait states that the data type it requires is an entity "localizedTable", which allow you to define phrases in different languages
            CdmTraitReference forwardPurposeTraitReference = cdmCorpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "means.relationship.verbPhrase", false);

            List<List<string>> forwardDescriptions = new List<List<string>> { 
                new List<string>() { "en", $"{customMessage} - Forwards" }, 
                new List<string>() { "cn", "正向" } 
            };

            var forwardConstEntDef = cdmCorpus.MakeObject<CdmConstantEntityDefinition>(CdmObjectType.ConstantEntityDef, null, false);
            forwardConstEntDef.ConstantValues = forwardDescriptions;

            // The entity "localizedTable" is from /samples/example-public-standards/foundations.cdm.json
            forwardConstEntDef.EntityShape = cdmCorpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, "localizedTable", true);
            forwardPurposeTraitReference.Arguments.Add(null, cdmCorpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, forwardConstEntDef, true));

            purposeRef.AppliedTraits.Add(forwardPurposeTraitReference);

            // You can also use the same way above to decorate the second trait "means.relationship.inverseVerbPhrase"
            // it is also available in /samples/example-public-standards/foundations.cdm.json

            return purposeRef;
        }

        /// <summary>
        /// Create a relationship linking by creating an entity attribute definition instance with a trait. 
        /// This allows you to add a resolution guidance to customize your data.
        /// </summary>
        /// <param name="cdmCorpus"> The CDM corpus. </param>
        /// <param name="associatedEntityName"> The name of the associated entity. </param>
        /// <param name="foreignKeyName"> The name of the foreign key. </param>
        /// <param name="attributeExplanation"> The explanation of the attribute.</param>
        /// <returns> The instance of entity attribute definition. </returns>
        private static CdmEntityAttributeDefinition CreateEntityAttributeForRelationshipBetweenTwoEntities(
            CdmCorpusDefinition cdmCorpus,
            string associatedEntityName,
            string foreignKeyName,
            string attributeExplanation)
        {
            // Define a relationship by creating an entity attribute
            var entityAttributeDef = cdmCorpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, foreignKeyName);
            entityAttributeDef.Explanation = attributeExplanation;
            // Creating an entity reference for the associated entity 
            CdmEntityReference associatedEntityRef = cdmCorpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, associatedEntityName, false);

            // Creating a "is.identifiedBy" trait for entity reference
            CdmTraitReference traitReference = cdmCorpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "is.identifiedBy", false);
            traitReference.Arguments.Add(null, $"{associatedEntityName}/(resolvedAttributes)/{associatedEntityName}Id");

            // Add the trait to the attribute's entity reference
            associatedEntityRef.AppliedTraits.Add(traitReference);
            entityAttributeDef.Entity = associatedEntityRef;
            entityAttributeDef.Purpose = CreateRelationshipMeanings(cdmCorpus, "Non-simple resolution guidance sample");

            // Add resolution guidance
            var attributeResolution = cdmCorpus.MakeObject<CdmAttributeResolutionGuidance>(CdmObjectType.AttributeResolutionGuidanceDef);
            attributeResolution.entityByReference = attributeResolution.makeEntityByReference();
            attributeResolution.entityByReference.allowReference = true;
            attributeResolution.renameFormat = "{m}";
            var entityAttribute = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, $"{foreignKeyName}Id", "identifiedBy", "entityId");
            attributeResolution.entityByReference.foreignKeyAttribute = entityAttribute as CdmTypeAttributeDefinition;
            entityAttributeDef.ResolutionGuidance = attributeResolution;

            return entityAttributeDef;
        }

        /// <summary>
        /// Create a relationship linking with an attribute an entity attribute definition instance without a trait.
        /// </summary>
        /// <param name="cdmCorpus"> The CDM corpus. </param>
        /// <param name="associatedEntityName"> The name of . </param>
        /// <param name="foreignKeyName"> The name of the foreign key. </param>
        /// <param name="attributeExplanation"> The explanation of the attribute.</param>
        /// <returns> The instance of entity attribute definition. </returns>
        private static CdmEntityAttributeDefinition CreateSimpleEntityAttributeForRelationshipBetweenTwoEntities(
            CdmCorpusDefinition cdmCorpus,
            string associatedEntityName,
            string foreignKeyName,
            string attributeExplanation)
        {
            // Define a relationship by creating an entity attribute
            var entityAttributeDef = cdmCorpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, foreignKeyName);
            entityAttributeDef.Explanation = attributeExplanation;

            // Creating an entity reference for the associated entity - simple name reference
            entityAttributeDef.Entity = cdmCorpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, associatedEntityName, true);
            entityAttributeDef.Purpose = CreateRelationshipMeanings(cdmCorpus, "Simple resolution guidance sample");

            // Add resolution guidance - enable reference
            var attributeResolution = cdmCorpus.MakeObject<CdmAttributeResolutionGuidance>(CdmObjectType.AttributeResolutionGuidanceDef);
            attributeResolution.entityByReference = attributeResolution.makeEntityByReference();
            attributeResolution.entityByReference.allowReference = true;
            entityAttributeDef.ResolutionGuidance = attributeResolution;

            return entityAttributeDef;
        }
    }
}
