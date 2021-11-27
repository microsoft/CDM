// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package example;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * ----------------------------------------------------------------------------------------------------------------------------------------
 * This sample is going to simulate the steps a tool would follow in order to create a new manifest document
 * in some user storage folder with two types of entities - a net new entity and an entity extended from some public standards.
 * Note: If we want to create a relationship from a new custom entity to an existing entity which is loaded from some public standards,
 * we need to create an entity extended from the existing entity and add a relationship to the attribute of the new entity.
 * Since we can't modify attributes from an 'abstract' schema defintion in the public standards.
 * This sample also creates a relationship from a net new entity to an existing entity, and a relationship between two net new entities.
 * NOTE: Relationships can be created with using of projections, please check out the eighth example 8-logical-manipulation-using-projections for more details.
 * <p>
 * The steps are:
 * 1. Create a temporary 'manifest' object at the root of the corpus
 * 2. Create two net new entities without extending any existing entity, create a relationship from one to the other, and add them to the manifest
 * 3. Create one entity which extends from the public standards, create a relationship from it to a net new entity, and add the entity to the manifest
 * 4. Make a 'resolved' version of each entity doc in our local folder. Call CreateResolvedManifestAsync on our starting manifest.
 * This will resolve everything and find all of the relationships between entities for us. Please check out the second example 2-create-manifest for more details
 * 5. Save the new document(s)
 * ----------------------------------------------------------------------------------------------------------------------------------------
 */
public class Program {
  private final static String SCHEMA_DOCS_ROOT = "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords";
  // The names of the custom entities for this sample.
  private final static String CUSTOM_ACCOUNT_ENTITY_NAME = "CustomAccount";
  private final static String CUSTOM_PERSON_ENTITY_NAME = "CustomPerson";
  private final static String EXTENDED_STANDARD_ACCOUNT = "ExtendedStandardAccount";
  private final static String FOUNDATION_JSON_PATH = "cdm:/foundations.cdm.json";

  public static void main(String[] args) throws ExecutionException, InterruptedException {
    // Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating objects and paths
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    // set callback to receive error and warning logs.
    cdmCorpus.setEventCallback((level, message) -> {
      System.out.println(message);
    }, CdmStatusLevel.Warning);

    System.out.println("configure storage adapters");

    // Configure storage adapters to point at the target local manifest location and at the fake public standards
    final String pathFromExeToExampleRoot = "../../";

    cdmCorpus.getStorage().mount("local", new LocalAdapter(pathFromExeToExampleRoot + "6-create-net-new-entities/sample-data"));
    cdmCorpus.getStorage().setDefaultNamespace("local"); // local is our default. so any paths that start out navigating without a device tag will assume local

    // Fake cdm, normally use the CDM Standards adapter
    // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there
    cdmCorpus.getStorage().mount("cdm", new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards"));

    // Example how to mount to the ADLS.
    // final AdlsAdapter adlsAdapter = new AdlsAdapter(
    //     "<ACCOUNT_NAME>.dfs.core.windows.net", // Hostname.
    //     "/<FILESYSTEM-NAME>", // Root.
    //     "72f988bf-86f1-41af-91ab-2d7cd011db47", // Tenant ID.
    //     "<CLIENT_ID>", // Client ID.
    //     "<CLIENT_SECRET>" // Client secret.
    // );

    System.out.println("Make placeholder manifest");
    // Make the temp manifest and add it to the root of the local documents in the corpus
    final CdmManifestDefinition manifestAbstract = cdmCorpus.makeObject(CdmObjectType.ManifestDef, "tempAbstract");

    // Add the temp manifest to the root of the local adapter in the corpus
    final CdmFolderDefinition localRoot = cdmCorpus.getStorage().fetchRootFolder("local");
    localRoot.getDocuments().add(manifestAbstract);

    // Create two entities from scratch, and add some attributes, traits, properties, and relationships in between
    System.out.println("Create net new entities");

    // Create the simplest entity - CustomPerson
    // Create the entity definition instance
    final CdmEntityDefinition personEntity = cdmCorpus.makeObject(CdmObjectType.EntityDef, CUSTOM_PERSON_ENTITY_NAME);
    // Add type attributes to the entity instance
    final CdmTypeAttributeDefinition personAttributeId = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, CUSTOM_PERSON_ENTITY_NAME + "Id", "identifiedBy", "entityId");
    personEntity.getAttributes().add(personAttributeId);
    final CdmTypeAttributeDefinition personAttributeName = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, CUSTOM_PERSON_ENTITY_NAME + "Name", "hasA", "name");
    personEntity.getAttributes().add(personAttributeName);
    // Add properties to the entity instance
    personEntity.setDisplayName(CUSTOM_PERSON_ENTITY_NAME);
    personEntity.setVersion("0.0.1");
    personEntity.setDescription("This is a custom entity created for the sample.");
    // Create the document which contains the entity
    final CdmDocumentDefinition personEntityDoc = cdmCorpus.makeObject(CdmObjectType.DocumentDef, CUSTOM_PERSON_ENTITY_NAME + ".cdm.json", false);
    // Add an import to the foundations doc so the traits about partitons will resolve nicely
    personEntityDoc.getImports().add(FOUNDATION_JSON_PATH);
    personEntityDoc.getDefinitions().add(personEntity);
    // Add the document to the root of the local documents in the corpus
    localRoot.getDocuments().add(personEntityDoc);
    // Add the entity to the manifest
    manifestAbstract.getEntities().add(personEntity);

    // Create an entity - CustomAccount which has a relationship with the entity CustomPerson
    // Create the entity definition instance
    final CdmEntityDefinition accountEntity = cdmCorpus.makeObject(CdmObjectType.EntityDef, CUSTOM_ACCOUNT_ENTITY_NAME, false);
    // Add type attributes to the entity instance
    // Both purpose "identifiedBy" and data type "entityId" are defined in public standards on the document /samples/example-public-standards/primitives.cdm.json
    final CdmTypeAttributeDefinition accountAttributeId = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, CUSTOM_ACCOUNT_ENTITY_NAME + "Id", "identifiedBy", "entityId");
    accountEntity.getAttributes().add(accountAttributeId);
    // Both purpose "hasA" and data type "name" are defined in public standards
    // The purpose "hasA" is from /samples/example-public-standards/primitives.cdm.json
    // The data type "name" is from /samples/example-public-standards/meanings.identity.cdm.json
    final CdmTypeAttributeDefinition accountAttributeName = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, CUSTOM_ACCOUNT_ENTITY_NAME + "Name", "hasA", "name");
    accountEntity.getAttributes().add(accountAttributeName);
    // Add properties to the entity instance
    accountEntity.setDisplayName(CUSTOM_ACCOUNT_ENTITY_NAME);
    accountEntity.setVersion("0.0.1");
    accountEntity.setDescription("This is a custom entity created for the sample.");
    // In this sample, every account has one person who owns the account
    // the relationship is actually an entity attribute
    final String attributeExplanation = "The owner of the account, which is a person.";
    // You can call CreateSimpleEntityAttributeForRelationshipBetweenTwoEntities() instead, but CreateEntityAttributeForRelationshipBetweenTwoEntities() can show
    // more details of how to use resolution guidance to customize your data
    final CdmEntityAttributeDefinition accountOwnerAttribute = CreateEntityAttributeForRelationshipBetweenTwoEntities(cdmCorpus, CUSTOM_PERSON_ENTITY_NAME, "accountOwner", attributeExplanation);
    accountEntity.getAttributes().add(accountOwnerAttribute);
    // Create the document which contains the entity
    final CdmDocumentDefinition accountEntityDoc = cdmCorpus.makeObject(CdmObjectType.DocumentDef, CUSTOM_ACCOUNT_ENTITY_NAME + ".cdm.json", false);
    // Add an import to the foundations doc so the traits about partitons will resolve nicely
    accountEntityDoc.getImports().add(FOUNDATION_JSON_PATH);
    // The CustomAccount entity has a relationship with the CustomPerson entity, this relationship is defined from its attribute with traits,
    // the import to the entity reference CustomPerson's doc is required
    accountEntityDoc.getImports().add(CUSTOM_PERSON_ENTITY_NAME + ".cdm.json");
    accountEntityDoc.getDefinitions().add(accountEntity);
    // Add the document to the root of the local documents in the corpus
    localRoot.getDocuments().add(accountEntityDoc);
    // Add the entity to the manifest
    manifestAbstract.getEntities().add(accountEntity);

    // Create an entity which extends "Account" from the standard, it contains everything that "Account" has
    final CdmEntityDefinition extendedStandardAccountEntity = cdmCorpus.makeObject(CdmObjectType.EntityDef, EXTENDED_STANDARD_ACCOUNT, false);
    // This function with 'true' will make a simple reference to the base
    extendedStandardAccountEntity.setExtendsEntity(cdmCorpus.makeObject(CdmObjectType.EntityRef, "Account", true));
    final String attrExplanation = "This is a simple custom account for this sample.";
    // Add a relationship from it to the CustomAccount entity, and name the foreign key to SimpleCustomAccount
    // You can also call CreateEntityAttributeForRelationshipBetweenTwoEntities() instead like above
    final CdmEntityAttributeDefinition simpleCustomAccountAttribute = CreateSimpleEntityAttributeForRelationshipBetweenTwoEntities(cdmCorpus, CUSTOM_ACCOUNT_ENTITY_NAME, "SimpleCustomAccount", attrExplanation);
    extendedStandardAccountEntity.getAttributes().add(simpleCustomAccountAttribute);
    final CdmDocumentDefinition extendedStandardAccountEntityDoc = cdmCorpus.makeObject(CdmObjectType.DocumentDef, EXTENDED_STANDARD_ACCOUNT + ".cdm.json", false);
    // Add an import to the foundations doc so the traits about partitons will resolve nicely
    extendedStandardAccountEntityDoc.getImports().add(FOUNDATION_JSON_PATH);
    // The ExtendedAccount entity extends from the "Account" entity from standards, the import to the entity Account's doc is required
    // it also has a relationship with the CustomAccount entity, the relationship defined from its from its attribute with traits, the import to the entity reference CustomAccount's doc is required
    extendedStandardAccountEntityDoc.getImports().add(SCHEMA_DOCS_ROOT + "/Account.cdm.json");
    extendedStandardAccountEntityDoc.getImports().add(CUSTOM_ACCOUNT_ENTITY_NAME + ".cdm.json");
    // Add the document to the root of the local documents in the corpus
    localRoot.getDocuments().add(extendedStandardAccountEntityDoc);
    extendedStandardAccountEntityDoc.getDefinitions().add(extendedStandardAccountEntity);
    // Add the entity to the manifest
    manifestAbstract.getEntities().add(extendedStandardAccountEntity);

    // Create the resolved version of everything in the root folder too
    System.out.println("Resolve the placeholder");
    final CdmManifestDefinition manifestResolved = manifestAbstract.createResolvedManifestAsync("default", null).get();

    // Add an import to the foundations doc so the traits about partitions will resolve nicely.
    manifestResolved.getImports().add(FOUNDATION_JSON_PATH);

    System.out.println("Save the documents");
    // We can save the documents as manifest.cdm.json format or model.json
    // Save as manifest.cdm.json
    manifestResolved.saveAsAsync(manifestResolved.getManifestName() + ".manifest.cdm.json", true).get();
    // Save as a model.json
    // manifestResolved.saveAsAsync("model.json", true).get();
  }

  /**
   * Create an type attribute definition instance with provided purpose and data type.
   *
   * @param cdmCorpus     The CDM corpus.
   * @param attributeName The directives to use while getting the resolved entities.
   * @param purpose       The purpose name that is defined in public standards.
   * @param dataType      The data type name that is defind in public standards
   * @return The instance of type attribute definition.
   */
  private static CdmTypeAttributeDefinition CreateTypeAttributeWithPurposeAndDataType(final CdmCorpusDefinition cdmCorpus, final String attributeName, final String purpose, String dataType) {
    final CdmTypeAttributeDefinition entityAttribute = cdmCorpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName, false);
    entityAttribute.setPurpose(cdmCorpus.makeRef(CdmObjectType.PurposeRef, purpose, true));
    entityAttribute.setDataType(cdmCorpus.makeRef(CdmObjectType.DataTypeRef, dataType, true));
    return entityAttribute;
  }

  /**
   * Create an purpose reference instance which points to `meaningOfRelationshipVerbPhrases` which is defined in public standards.
   *
   * @param cdmCorpus           The CDM corpus.
   * @param custom_message      The some custom message.
   * @return The instance of purpose reference.
   */
  private static CdmPurposeReference CreateRelationshipMeanings(CdmCorpusDefinition cdmCorpus, final String custom_message) {
    // The purpose "meaningOfRelationshipVerbPhrases" is from /samples/example-public-standards/foundations.cdm.json
    // With the use of this purpose, two additional traits ("means.relationship.verbPhrase" and "means.relationship.inverseVerbPhrase") will be added by default
    // as they are attached to the purpose definition.
    final CdmPurposeReference purposeRef = cdmCorpus.makeRef(CdmObjectType.PurposeRef, "meaningOfRelationshipVerbPhrases", false);

    // You can add your own argument to the additional traits
    // The trait "means.relationship.verbPhrase" is also from /samples/example-public-standards/foundations.cdm.json
    // This trait states that the data type it requires is an entity "localizedTable", which allow you to define phrases in different languages
    final CdmTraitReference forwardPurposeTraitReference = cdmCorpus.makeObject(CdmObjectType.TraitRef, "means.relationship.verbPhrase", false);

    final List<List<String>> forwardDescriptions = Arrays.asList(Arrays.asList( "en", custom_message + " - Forwards" ), Arrays.asList("cn", "正向"));

    final CdmConstantEntityDefinition forwardConstEntDef = cdmCorpus.makeObject(CdmObjectType.ConstantEntityDef, null, false);
    forwardConstEntDef.setConstantValues(forwardDescriptions);

    // The entity "localizedTable" is from /samples/example-public-standards/foundations.cdm.json
    forwardConstEntDef.setEntityShape(cdmCorpus.makeRef(CdmObjectType.EntityRef, "localizedTable", true));
    forwardPurposeTraitReference.getArguments().add(null, cdmCorpus.makeRef(CdmObjectType.EntityRef, forwardConstEntDef, true));

    purposeRef.getAppliedTraits().add(forwardPurposeTraitReference);

    // You can also use the same way above to decorate the second trait "means.relationship.inverseVerbPhrase"
    // it is also available in /samples/example-public-standards/foundations.cdm.json

    return purposeRef;
  }

  /**
   * Create a relationship linking with an attribute an entity attribute definition instance without a trait.
   *
   * @param cdmCorpus            The CDM corpus.
   * @param associatedEntityName The name of .
   * @param foreignKeyName       The name of the foreign key.
   * @param attributeExplanation The explanation of the attribute.
   * @return The instance of entity attribute definition.
   */
  private static CdmEntityAttributeDefinition CreateSimpleEntityAttributeForRelationshipBetweenTwoEntities(
      final CdmCorpusDefinition cdmCorpus,
      final String associatedEntityName,
      final String foreignKeyName,
      final String attributeExplanation) {
    // Define a relationship by creating an entity attribute
    final CdmEntityAttributeDefinition entityAttributeDef = cdmCorpus.makeObject(CdmObjectType.EntityAttributeDef, foreignKeyName);
    entityAttributeDef.setExplanation(attributeExplanation);

    // Creating an entity reference for the associated entity - simple name reference
    entityAttributeDef.setEntity(cdmCorpus.makeRef(CdmObjectType.EntityRef, associatedEntityName, true));
    entityAttributeDef.setPurpose(CreateRelationshipMeanings(cdmCorpus, "Simple resolution guidance sample"));

    // Add resolution guidance - enable reference
    final CdmAttributeResolutionGuidance attributeResolution = cdmCorpus.makeObject(CdmObjectType.AttributeResolutionGuidanceDef);
    attributeResolution.setEntityByReference(attributeResolution.makeEntityByReference());
    attributeResolution.getEntityByReference().setAllowReference(true);
    entityAttributeDef.setResolutionGuidance(attributeResolution);
    return entityAttributeDef;
  }

  /**
   * Create a relationship linking by creating an entity attribute definition instance with a trait.
   * This allows you to add a resolution guidance to customize your data.
   *
   * @param cdmCorpus            The CDM corpus.
   * @param associatedEntityName The name of the associated entity.
   * @param foreignKeyName       The name of the foreign key.
   * @param attributeExplanation The explanation of the attribute.
   * @return The instance of entity attribute definition.
   */
  private static CdmEntityAttributeDefinition CreateEntityAttributeForRelationshipBetweenTwoEntities(
      final CdmCorpusDefinition cdmCorpus,
      final String associatedEntityName,
      final String foreignKeyName,
      final String attributeExplanation) {
    // Define a relationship by creating an entity attribute
    CdmEntityAttributeDefinition entityAttributeDef = cdmCorpus.makeObject(CdmObjectType.EntityAttributeDef, foreignKeyName);
    entityAttributeDef.setExplanation(attributeExplanation);
    // Creating an entity reference for the associated entity
    CdmEntityReference associatedEntityRef = cdmCorpus.makeRef(CdmObjectType.EntityRef, associatedEntityName, false);

    // Creating a "is.identifiedBy" trait for entity reference
    CdmTraitReference traitReference = cdmCorpus.makeObject(CdmObjectType.TraitRef, "is.identifiedBy", false);
    String s = associatedEntityName + "/(resolvedAttributes)/" + associatedEntityName + "Id";
    traitReference.getArguments().add(null, associatedEntityName + "/(resolvedAttributes)/" + associatedEntityName + "Id");

    // Add the trait to the attribute's entity reference
    associatedEntityRef.getAppliedTraits().add(traitReference);
    entityAttributeDef.setEntity(associatedEntityRef);
    entityAttributeDef.setPurpose(CreateRelationshipMeanings(cdmCorpus, "Non-simple resolution guidance sample"));

    // Add resolution guidance
    CdmAttributeResolutionGuidance attributeResolution = cdmCorpus.makeObject(CdmObjectType.AttributeResolutionGuidanceDef);
    attributeResolution.setEntityByReference(attributeResolution.makeEntityByReference());
    attributeResolution.getEntityByReference().setAllowReference(true);
    attributeResolution.setRenameFormat("{m}");
    CdmTypeAttributeDefinition entityAttribute = CreateTypeAttributeWithPurposeAndDataType(cdmCorpus, foreignKeyName + "Id", "identifiedBy", "entityId");
    attributeResolution.getEntityByReference().setForeignKeyAttribute(entityAttribute);
    entityAttributeDef.setResolutionGuidance(attributeResolution);
    return entityAttributeDef;
  }
}
