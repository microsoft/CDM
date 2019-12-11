package example;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import java.util.concurrent.ExecutionException;

/**
 * ----------------------------------------------------------------------------------------------------------------------------------------
 * This sample is going to simulate the steps a tool would follow in order to create a new manifest document
 * in some user storage folder with two types of entities - a net new entity and an entity extended from some public standards.
 * Note: If we want to create a relationship from a new custom entity to an existing entity which is loaded from some public standards,
 * we need to create an entity extended from the existing entity and add a relationship to the attribute of the new entity.
 * Since we can't modify attributes from an 'abstract' schema defintion in the public standards.
 * This sample also creates a relationship from a net new entity to an existing entity, and a relationship between two net new entities.
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
    CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    System.out.println("configure storage adapters");

    // Configure storage adapters to point at the target local manifest location and at the fake public standards
    String pathFromExeToExampleRoot = "../../";

    cdmCorpus.getStorage().mount("local", new LocalAdapter(pathFromExeToExampleRoot + "6-create-net-new-entities"));
    cdmCorpus.getStorage().setDefaultNamespace("local"); // local is our default. so any paths that start out navigating without a device tag will assume local

    // Fake cdm, normaly use the github adapter
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
    CdmManifestDefinition manifestAbstract = cdmCorpus.makeObject(CdmObjectType.ManifestDef, "tempAbstract");

    // Add the temp manifest to the root of the local documents in the corpus
    CdmFolderDefinition localRoot = cdmCorpus.getStorage().fetchRootFolder("local");
    localRoot.getDocuments().add(manifestAbstract);

    // Create two entities from scratch, and add some attributes, traits, properties, and relationships in between
    System.out.println("Create net new entities");

    // Create the simplest entity - CustomPerson
    // Create the entity definition instance
    CdmEntityDefinition personEntity = cdmCorpus.makeObject(CdmObjectType.EntityDef, CUSTOM_PERSON_ENTITY_NAME);
    // Add type attributes to the entity instance
    CdmTypeAttributeDefinition personAttributeId = createEntityAttributeWithPurposeAndDataType(cdmCorpus, CUSTOM_PERSON_ENTITY_NAME + "Id", "identifiedBy", "entityId");
    personEntity.getAttributes().add(personAttributeId);
    CdmTypeAttributeDefinition personAttributeName = createEntityAttributeWithPurposeAndDataType(cdmCorpus, CUSTOM_PERSON_ENTITY_NAME + "Name", "hasA", "string");
    personEntity.getAttributes().add(personAttributeName);
    // Add properties to the entity instance
    personEntity.setDisplayName(CUSTOM_PERSON_ENTITY_NAME);
    personEntity.setVersion("0.0.1");
    personEntity.setDescription("This is a custom entity created for the sample.");
    // Create the document which contains the entity
    CdmDocumentDefinition personEntityDoc = cdmCorpus.makeObject(CdmObjectType.DocumentDef, CUSTOM_PERSON_ENTITY_NAME + ".cdm.json", false);
    // Add an import to the foundations doc so the traits about partitons will resolve nicely
    personEntityDoc.getImports().add(FOUNDATION_JSON_PATH);
    personEntityDoc.getDefinitions().add(personEntity);
    // Add the document to the root of the local documents in the corpus
    localRoot.getDocuments().add(personEntityDoc);
    // Add the entity to the manifest
    manifestAbstract.getEntities().add(personEntity);

    // Create an entity - CustomAccount which has a relationship with the entity CustomPerson
    // Create the entity definition instance
    CdmEntityDefinition accountEntity = cdmCorpus.makeObject(CdmObjectType.EntityDef, CUSTOM_ACCOUNT_ENTITY_NAME, false);
    // Add type attributes to the entity instance
    CdmTypeAttributeDefinition accountAttributeId = createEntityAttributeWithPurposeAndDataType(cdmCorpus, CUSTOM_ACCOUNT_ENTITY_NAME + "Id", "identifiedBy", "entityId");
    accountEntity.getAttributes().add(accountAttributeId);
    CdmTypeAttributeDefinition accountAttributeName = createEntityAttributeWithPurposeAndDataType(cdmCorpus, CUSTOM_ACCOUNT_ENTITY_NAME + "Name", "hasA", "string");
    accountEntity.getAttributes().add(accountAttributeName);
    // Add properties to the entity instance
    accountEntity.setDisplayName(CUSTOM_ACCOUNT_ENTITY_NAME);
    accountEntity.setVersion("0.0.1");
    accountEntity.setDescription("This is a custom entity created for the sample.");
    // In this sample, every account has one person who owns the account
    // the relationship is actually an entity attribute
    String attributeExplanation = "The owner of the account, which is a person.";
    // You can all CreateSimpleAttributeForRelationshipBetweenTwoEntities() instead, but CreateAttributeForRelationshipBetweenTwoEntities() can show
    // more details of how to use resolution guidance to customize your data
    CdmEntityAttributeDefinition accountOwnerAttribute = createAttributeForRelationshipBetweenTwoEntities(cdmCorpus, CUSTOM_PERSON_ENTITY_NAME, "accountOwner", attributeExplanation);
    accountEntity.getAttributes().add(accountOwnerAttribute);
    // Create the document which contains the entity
    CdmDocumentDefinition accountEntityDoc = cdmCorpus.makeObject(CdmObjectType.DocumentDef, CUSTOM_ACCOUNT_ENTITY_NAME + ".cdm.json", false);
    // Add an import to the foundations doc so the traits about partitons will resolve nicely
    accountEntityDoc.getImports().add(FOUNDATION_JSON_PATH);
    // the CustomAccount entity has a relationship with the CustomPerson entity, this relationship is defined from its attribute with traits,
    // the import to the entity reference CustomPerson's doc is required
    accountEntityDoc.getImports().add(CUSTOM_PERSON_ENTITY_NAME + ".cdm.json");
    accountEntityDoc.getDefinitions().add(accountEntity);
    // Add the document to the root of the local documents in the corpus
    localRoot.getDocuments().add(accountEntityDoc);
    // Add the entity to the manifest
    manifestAbstract.getEntities().add(accountEntity);

    // Create an entity which extends "Account" from the standard, it contains everything that "Account" has
    CdmEntityDefinition extendedStandardAccountEntity = cdmCorpus.makeObject(CdmObjectType.EntityDef, EXTENDED_STANDARD_ACCOUNT, false);
    // This function with 'true' will make a simple reference to the base
    extendedStandardAccountEntity.setExtendsEntity(cdmCorpus.makeObject(CdmObjectType.EntityRef, "Account", true));
    String attrExplanation = "This is a simple custom account for this sample.";
    // Add a relationship from it to the CustomAccount entity, and name the foreign key to SimpleCustomAccount
    // You can all CreateSimpleAttributeForRelationshipBetweenTwoEntities() instead, but CreateAttributeForRelationshipBetweenTwoEntities() can show
    // more details of how to use resolution guidance to customize your data
    CdmEntityAttributeDefinition simpleCustomAccountAttribute = createAttributeForRelationshipBetweenTwoEntities(cdmCorpus, CUSTOM_ACCOUNT_ENTITY_NAME, "SimpleCustomAccount", attrExplanation);
    extendedStandardAccountEntity.getAttributes().add(simpleCustomAccountAttribute);
    CdmDocumentDefinition extendedStandardAccountntityDoc = cdmCorpus.makeObject(CdmObjectType.DocumentDef, EXTENDED_STANDARD_ACCOUNT + ".cdm.json", false);
    // Add an import to the foundations doc so the traits about partitons will resolve nicely
    extendedStandardAccountntityDoc.getImports().add(FOUNDATION_JSON_PATH);
    // The ExtendedAccount entity extends from the "Account" entity from standards, the import to the entity Account's doc is required
    // it also has a relationship with the CustomAccount entity, the relationship defined from its from its attribute with traits, the import to the entity reference CustomAccount's doc is required
    extendedStandardAccountntityDoc.getImports().add(SCHEMA_DOCS_ROOT + "/Account.cdm.json");
    extendedStandardAccountntityDoc.getImports().add(CUSTOM_ACCOUNT_ENTITY_NAME + ".cdm.json");
    // Add the document to the root of the local documents in the corpus
    localRoot.getDocuments().add(extendedStandardAccountntityDoc);
    extendedStandardAccountntityDoc.getDefinitions().add(extendedStandardAccountEntity);
    // Add the entity to the manifest
    manifestAbstract.getEntities().add(extendedStandardAccountEntity);

    // Create the resolved version of everything in the root folder too
    System.out.println("Resolve the placeholder");
    CdmManifestDefinition manifestResolved = manifestAbstract.createResolvedManifestAsync("default", null).get();

    System.out.println("Save the docs");
    for (CdmEntityDeclarationDefinition eDef : manifestResolved.getEntities()) {
      // Get the entity being pointed at
      CdmEntityDeclarationDefinition localEDef = eDef;
      CdmEntityDefinition entDef = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync(localEDef.getEntityPath(), manifestResolved).get();
      // Make a fake partition, just to demo that
      CdmDataPartitionDefinition part = cdmCorpus.makeObject(CdmObjectType.DataPartitionDef, entDef.getEntityName() + "-data-description");
      localEDef.getDataPartitions().add(part);
      part.setExplanation("not real data, just for demo");
      // We have existing partition files for the custom entities, so we need to make the partition point to the file location
      part.setLocation("local:/" + entDef.getEntityName() + "/partition-data.csv");
      // Add trait to partition for csv params
      CdmTraitReference csvTrait = part.getExhibitsTraits().add("is.partition.format.CSV", false);
      csvTrait.getArguments().add("columnHeaders", "true");
      csvTrait.getArguments().add("delimiter", ",");
    }
    // We can save the docs as manifest.cdm.json format or model.json
    // Save as manifest.cdm.json
    manifestResolved.saveAsAsync(manifestResolved.getManifestName() + ".manifest.cdm.json", true).get();
    // Save as a model.json
    // await manifestResolved.saveAsAsync($"{manifestResolved.ManifestName}.model.json", true);
  }

  /**
   * Create an type attribute definition instance.
   *
   * @param cdmCorpus     The CDM corpus.
   * @param attributeName The directives to use while getting the resolved entities.
   * @param purpose       The manifest to be resolved.
   * @param dataType      The data type.
   * @return The instance of type attribute definition.
   */
  private static CdmTypeAttributeDefinition createEntityAttributeWithPurposeAndDataType(CdmCorpusDefinition cdmCorpus, String attributeName, String purpose, String dataType) {
    CdmTypeAttributeDefinition entityAttribute = cdmCorpus.makeObject(CdmObjectType.TypeAttributeDef, attributeName, false);
    entityAttribute.setPurpose(cdmCorpus.makeRef(CdmObjectType.PurposeRef, purpose, true));
    entityAttribute.setDataType(cdmCorpus.makeRef(CdmObjectType.DataTypeRef, dataType, true));
    return entityAttribute;
  }

  /**
   * Create a relationship linking with an attribute an eneity attribute definition instance without a trait.
   *
   * @param cdmCorpus            The CDM corpus.
   * @param associatedEntityName The name of .
   * @param foreignKeyName       The name of the foreign key.
   * @param attributeExplanation The explanation of the attribute.
   * @return The instatnce of entity attribute definition.
   */
  private static CdmEntityAttributeDefinition createSimpleAttributeForRelationshipBetweenTwoEntities(
      CdmCorpusDefinition cdmCorpus,
      String associatedEntityName,
      String foreignKeyName,
      String attributeExplanation) {
    // Define a relationship by creating an entity attribute
    CdmEntityAttributeDefinition entityAttributeDef = cdmCorpus.makeObject(CdmObjectType.EntityAttributeDef, foreignKeyName);
    entityAttributeDef.setExplanation(attributeExplanation);

    // Creating an entity reference for the associated entity - simple name reference
    entityAttributeDef.setEntity(cdmCorpus.makeRef(CdmObjectType.EntityRef, associatedEntityName, true));

    // Add resolution guidance - enable reference
    CdmAttributeResolutionGuidance attributeResolution = cdmCorpus.makeObject(CdmObjectType.AttributeResolutionGuidanceDef);
    attributeResolution.setEntityByReference(attributeResolution.makeEntityByReference());
    attributeResolution.getEntityByReference().setAllowReference(true);
    entityAttributeDef.setResolutionGuidance(attributeResolution);
    return entityAttributeDef;
  }

  /**
   * Create a relationship linking by creating an eneity attribute definition instance with a trait.
   * This allows you to add a resolution guidance to customize your data.
   *
   * @param cdmCorpus            The CDM corpus.
   * @param associatedEntityName The name of the associated entity.
   * @param foreignKeyName       The name of the foreign key.
   * @param attributeExplanation The explanation of the attribute.
   * @return The instatnce of entity attribute definition.
   */
  private static CdmEntityAttributeDefinition createAttributeForRelationshipBetweenTwoEntities(
      CdmCorpusDefinition cdmCorpus,
      String associatedEntityName,
      String foreignKeyName,
      String attributeExplanation) {
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

    // Add resolution guidance
    CdmAttributeResolutionGuidance attributeResolution = cdmCorpus.makeObject(CdmObjectType.AttributeResolutionGuidanceDef);
    attributeResolution.setEntityByReference(attributeResolution.makeEntityByReference());
    attributeResolution.getEntityByReference().setAllowReference(true);
    attributeResolution.setRenameFormat("{m}");
    CdmTypeAttributeDefinition entityAttribute = createEntityAttributeWithPurposeAndDataType(cdmCorpus, foreignKeyName + "Id", "identifiedBy", "entityId");
    attributeResolution.getEntityByReference().setForeignKeyAttribute(entityAttribute);
    entityAttributeDef.setResolutionGuidance(attributeResolution);
    return entityAttributeDef;
  }
}
