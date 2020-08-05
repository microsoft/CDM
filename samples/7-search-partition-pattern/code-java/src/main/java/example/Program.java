// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package example;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import java.util.Arrays;

/*
 * -------------------------------------------------------------------------------------------------
 * This sample demonstrates how to perform a data partition pattern search on an existing entity.
 * Note: A data partition pattern describes a search space over a set of files that can be used to
 * infer or discover and list new data partition files.
 * The steps are:
 *   1. Load an entity named 'Account' from some public standards
 *   2. Create a data partition pattern and add it to 'Account' entity
 *   3. Find all the associated partition files, and add them to the data partition to the entity in
 *      the manifest
 *   4. Resolve the manifest and save the new documents
 * -------------------------------------------------------------------------------------------------
 */
public class Program {

  public static void main(String[] args) {
    // Make a corpus, the corpus is the collection of all documents
    // and folders created or discovered while navigating objects and paths.
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    System.out.println("Configure storage adapters.");

    // Configure storage adapters to point at the target local manifest location
    // and at the fake public standards.
    String pathFromExeToExampleRoot = "../../";
    String sampleEntityName = "Account";

    // Mount it as a local adapter.
    cdmCorpus.getStorage().mount(
        "local",
        new LocalAdapter(pathFromExeToExampleRoot + "7-search-partition-pattern/sample-data"));
    cdmCorpus.getStorage().setDefaultNamespace("local");
    // Local is our default.
    // So any paths that start out navigating without a device tag will assume local.

    // Fake cdm, normally use the CDM Standards adapter.
    // Mount it as the 'cdm' adapter, not the default so must use "cdm:/folder" to get there.
    cdmCorpus.getStorage().mount(
        "cdm",
        new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards"));

    // Example how to mount to the ADLS.
    // final AdlsAdapter adlsAdapter = new AdlsAdapter(
    //     "<ACCOUNT-NAME>.dfs.core.windows.net", // Hostname.
    //     "/<FILESYSTEM-NAME>", // Root.
    //     "72f988bf-86f1-41af-91ab-2d7cd011db47",  // Tenant ID.
    //     "<CLIENT-ID>",  // Client ID.
    //     "<CLIENT-SECRET>" // Client secret.
    // );
    // cdmCorpus.getStorage().mount("adls", adlsAdapter);

    // This sample will add an entity named Account from some public standards
    // and create a data partition pattern.
    // A data partition pattern describes a search space over a set of files
    // that can be used to infer or discover and list new data partition files.
    // We will also show how to find all the associated partition files,
    // and add them to the data partition to the entity in the manifest.
    // After resolving the manifest,
    // the manifest will contain data partition of each data partition file.

    System.out.println("Make placeholder manifest.");
    // Make the temp manifest and add it to the root of the local documents in the corpus.
    final CdmManifestDefinition manifestAbstract =
        cdmCorpus.makeObject(CdmObjectType.ManifestDef, "tempAbstract");

    // Add the temp manifest to the root of the local documents in the corpus.
    final CdmFolderDefinition localRoot = cdmCorpus.getStorage().fetchRootFolder("local");
    localRoot.getDocuments().add(manifestAbstract, "tempAbstract.manifest.cdm.json");

    // Add an entity named Account from some public standards.
    System.out.println("Add an entity named Account from some public standards.");
    final CdmEntityDeclarationDefinition personDeclarationDefinition =
        manifestAbstract.getEntities()
            .add(
                sampleEntityName,
                "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");

    // Create a data partition pattern.
    final CdmDataPartitionPatternDefinition dataPartitionPattern =
        cdmCorpus.makeObject(
            CdmObjectType.DataPartitionPatternDef,
            "sampleDataPartitionPattern",
            false);
    dataPartitionPattern.setRootLocation("local:dataFiles");
    dataPartitionPattern.setRegularExpression("/(\\d{4})/(\\w+)/cohort(\\d+)\\.csv$");
    // the line below demonstrates using "GlobPattern" which can be used instead of "RegularExpression"
    // dataPartitionPattern.setGlobPattern("/*/cohort*.csv");
    System.out.println("    Assign regular expression of the data partition pattern to: "
        + dataPartitionPattern.getRegularExpression());
    System.out.println("    Assign root location of the data partition pattern to: "
        + dataPartitionPattern.getRootLocation());
    dataPartitionPattern.setExplanation(
        "/ capture 4 digits / capture a word / capture one or more digits "
            + "after the word cohort but before .csv"
    );
    dataPartitionPattern.setParameters(Arrays.asList("year", "month", "cohortNumber"));

    // Add the data partition pattern we just created to the entity data partition pattern collection.
    personDeclarationDefinition.getDataPartitionPatterns().add(dataPartitionPattern);

    // Calling FileStatusCheckAsync to pick up the all data partition files
    // which names match the data partition pattern, and add them to the entity in the manifest.
    manifestAbstract.fileStatusCheckAsync().join();

    // List all data partition locations.
    System.out.println("\nList of all data partition locations for the entity Account matches the data partition pattern: ");

    for (CdmDataPartitionDefinition dataPartition :
        personDeclarationDefinition.getDataPartitions()) {
      System.out.println("    " + dataPartition.getLocation());
    }

    System.out.println("Resolve the manifest");
    final CdmManifestDefinition manifestResolved =
        manifestAbstract.createResolvedManifestAsync(
            "default",
            null).join();
    manifestResolved.saveAsAsync(
        manifestResolved.getManifestName() + ".manifest.cdm.json",
        true).join();

    // You can save the doc as a model.json format as an option.
    // manifestResolved.saveAsAsync("model.json", true).join();
  }
}
