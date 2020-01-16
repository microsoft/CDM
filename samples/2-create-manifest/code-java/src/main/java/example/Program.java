package example;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeItem;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.ExecutionException;

public class Program {
  public static void main(String[] args)
      throws IOException, ExecutionException, InterruptedException {
    // Make a corpus, the corpus is the collection of all documents and folders created or
    // discovered while navigating objects and paths.
    CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    // This tells corpus to callback with info to our hook. To report progress messages and to fail
    // if an error happens when looking symbols up.
    System.out.println("Configure storage adapters.");
    // Configure storage adapters to point at the target local manifest location and at the fake
    // public standards.
    String pathFromExeToExampleRoot = "../../";

    // Register it as the 'local' device.
    StorageAdapter localAdapter = new LocalAdapter(pathFromExeToExampleRoot + "2-create-manifest");
    cdmCorpus.getStorage().mount("local", localAdapter);
    // Local is our default. So any paths that start out navigating without a device tag will assume local.
    cdmCorpus.getStorage().setDefaultNamespace("local");

    // Register it as the 'cdm' device, not the default so must use "cdm:/folder" to get there.
    StorageAdapter cdmAdapter = new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards");
    cdmCorpus.getStorage().mount("cdm", cdmAdapter);

    // Example how to mount to the ADLS.
    // final AdlsAdapter adlsAdapter = new AdlsAdapter(
    //     "<ACCOUNT_NAME>.dfs.core.windows.net", // Hostname.
    //     "/<FILESYSTEM-NAME>", // Root.
    //     "72f988bf-86f1-41af-91ab-2d7cd011db47", // Tenant ID.
    //     "<CLIENT_ID>", // Client ID.
    //     "<CLIENT_SECRET>" // Client secret.
    // );
    // cdmCorpus.getStorage().mount("adls", adlsAdapter);

    System.out.println("Make placeholder manifest.");
    // Make the temp manifest and add it to the root of the local documents in the corpus.
    CdmManifestDefinition manifestAbstract =
        cdmCorpus.makeObject(CdmObjectType.ManifestDef, "tempAbstract");

    // Add each declaration, this example is about medical appointments and care plans.
    manifestAbstract.getEntities().add("Account", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");
    manifestAbstract.getEntities().add("Address", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Address.cdm.json/Address");
    manifestAbstract.getEntities().add("CarePlan", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CarePlan.cdm.json/CarePlan");
    manifestAbstract.getEntities().add("CodeableConcept", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CodeableConcept.cdm.json/CodeableConcept");
    manifestAbstract.getEntities().add("Contact", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Contact.cdm.json/Contact");
    manifestAbstract.getEntities().add("Device", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Device.cdm.json/Device");
    manifestAbstract.getEntities().add("EmrAppointment", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EmrAppointment.cdm.json/EmrAppointment");
    manifestAbstract.getEntities().add("Encounter", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Encounter.cdm.json/Encounter");
    manifestAbstract.getEntities().add("EpisodeOfCare", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/EpisodeOfCare.cdm.json/EpisodeOfCare");
    manifestAbstract.getEntities().add("Location", "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Location.cdm.json/Location");

    // Add the temp manifest to the root of the local documents in the corpus.
    CdmFolderDefinition localRoot = cdmCorpus.getStorage().fetchRootFolder("local");
    localRoot.getDocuments().add(manifestAbstract);

    // Create the resolved version of everything in the root folder too.
    System.out.println("Resolve the placeholder.");
    CdmManifestDefinition manifestResolved =
        manifestAbstract.createResolvedManifestAsync("default", "").get();

    // Add an import to the foundations doc so the traits about partitions will resolve nicely.
    manifestResolved.getImports().add("cdm:/foundations.cdm.json", "");

    System.out.println("Save the documents.");
    for (CdmEntityDeclarationDefinition eDef : manifestResolved.getEntities()) {
      // Get the entity being pointed at.
      CdmEntityDeclarationDefinition localEDef = eDef;
      CdmEntityDefinition entDef = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync(localEDef.getEntityPath(),
          manifestResolved).get();
      // Make a fake partition, just to demo that.
      CdmDataPartitionDefinition part = cdmCorpus
          .makeObject(CdmObjectType.DataPartitionDef, entDef.getEntityName() + "-data-description");
      localEDef.getDataPartitions().add(part);
      part.setExplanation("not real data, just for demo");

      // Define the location of the partition, relative to the manifest
      String location = "local:/" + entDef.getEntityName() + "/partition-data.csv";
      part.setLocation(cdmCorpus.getStorage().createRelativeCorpusPath(location, manifestResolved));

      // Add trait to partition for csv params.
      CdmTraitReference csvTrait = part.getExhibitsTraits().add("is.partition.format.CSV");
      csvTrait.getArguments().add("columnHeaders", "true");
      csvTrait.getArguments().add("delimiter", ",");

      // Get the actual location of the partition file from the corpus.
      String partPath = cdmCorpus.getStorage().corpusPathToAdapterPath(location);

      // Make a fake file with nothing but header for columns.
      String header = "";
      for (CdmAttributeItem att : entDef.getAttributes()) {
        if (att instanceof CdmTypeAttributeDefinition) {
          CdmTypeAttributeDefinition attributeDef = (CdmTypeAttributeDefinition) att;
          if (!"".equals(header)) {
            header += ",";
          }
          header += attributeDef.getName();
        }
      }

      String folderPath = cdmCorpus.getStorage().corpusPathToAdapterPath("local:/" + entDef.getEntityName());
      File newFolder = new File(folderPath);
      if (!newFolder.exists() && !newFolder.mkdir()) {
        throw new RuntimeException("Cannot create new folder at: " + folderPath);
      }
      writeStringToFile(partPath, header);
    }
    manifestResolved.saveAsAsync(manifestResolved.getManifestName() + ".manifest.cdm.json", true).get();
  }

  /**
   * Write the result to the given path.
   *
   * @param pathName Path to the file.
   * @param str      The result.
   * @throws IOException
   */
  private static void writeStringToFile(String pathName, String str) throws IOException {
    Path path = new File(pathName).toPath();
    byte[] strToBytes = str.getBytes();
    Files.write(path, strToBytes);
  }
}
