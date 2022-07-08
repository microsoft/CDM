// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package example;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmIncrementalPartitionType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.enums.PartitionFileStatusCheckType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

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

    // set callback to receive error and warning logs.
    cdmCorpus.setEventCallback((level, message) -> {
        System.out.println(message);
      }, CdmStatusLevel.Warning);

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
    final CdmEntityDeclarationDefinition accountDeclarationDefinition =
            manifestAbstract.getEntities()
                    .add(sampleEntityName,
                            "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/Account.cdm.json/Account");

    // Create a data partition pattern.
    final CdmDataPartitionPatternDefinition dataPartitionPattern = createPartitionPatternDefinition(cdmCorpus,"sampleDataPartitionPattern");
    dataPartitionPattern.setExplanation(
            "/ capture 4 digits / capture a word / capture one or more digits "
                    + "after the word cohort but before .csv"
    );
    System.out.println("    Assign regular expression of the data partition pattern to: "
            + dataPartitionPattern.getRegularExpression());
    System.out.println("    Assign root location of the data partition pattern to: "
            + dataPartitionPattern.getRootLocation());

    // Add the data partition pattern we just created to the entity data partition pattern collection.
    accountDeclarationDefinition.getDataPartitionPatterns().add(dataPartitionPattern);

    // Create incremental partition patterns
    final CdmDataPartitionPatternDefinition upsertIncrementalPartitionPattern = createPartitionPatternDefinition(cdmCorpus,"UpsertPattern",true, true);
    addIncrementalPartitionTrait(upsertIncrementalPartitionPattern, CdmIncrementalPartitionType.Upsert);
    System.out.println("    Assign regular expression of first incremental partition pattern to: "
            + upsertIncrementalPartitionPattern.getRegularExpression());
    System.out.println("    Assign root location of the first incremental partition pattern to: "
            + upsertIncrementalPartitionPattern.getRootLocation());

    final CdmDataPartitionPatternDefinition deleteIncrementalPartitionPattern = createPartitionPatternDefinition(cdmCorpus,"DeletePattern", true);
    addIncrementalPartitionTrait(deleteIncrementalPartitionPattern, CdmIncrementalPartitionType.Delete, "FullDataPattern");
    System.out.println("    Assign regular expression of second incremental partition pattern to: "
            + deleteIncrementalPartitionPattern.getRegularExpression());
    System.out.println("    Assign root location of the second incremental partition pattern to: "
            + deleteIncrementalPartitionPattern.getRootLocation());

    // Add the incremental partition patterns we just created to the entity increment partition pattern collection
    accountDeclarationDefinition.getIncrementalPartitionPatterns().add(upsertIncrementalPartitionPattern);
    accountDeclarationDefinition.getIncrementalPartitionPatterns().add(deleteIncrementalPartitionPattern);

    // Add an import to the foundations doc so the traits about partitions will resolve nicely
    manifestAbstract.getImports().add("cdm:/foundations.cdm.json");

    // Calling FileStatusCheckAsync to pick up the all data partition files
    // which names match the data partition pattern, and add them to the entity in the manifest.
    manifestAbstract.fileStatusCheckAsync(PartitionFileStatusCheckType.FullAndIncremental).join();

    // List all data partition locations.
    System.out.println("\nList of all data partition locations for the entity Account matches the data partition pattern: ");

    for (CdmDataPartitionDefinition dataPartition :
            accountDeclarationDefinition.getDataPartitions()) {
      System.out.println("    " + dataPartition.getLocation());
    }

    // List all incremental partition locations.
    System.out.println("\nList of all incremental partition locations for the entity Account matches the incremental partition pattern: ");

    for (CdmDataPartitionDefinition incrementalPartition :
            accountDeclarationDefinition.getIncrementalPartitions()) {
      System.out.println("    " + incrementalPartition.getLocation());
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

  /**
   * Add incremental partition trait "is.partition.incremental" and supplied arguments to the given data partition pattern.
   *
   * @param patternDef    The data partition pattern.
   * @param type          The CdmIncrementalPartitionType, this is a required argument for the incremental trait.
   */
  private static void addIncrementalPartitionTrait(final CdmDataPartitionPatternDefinition patternDef, final CdmIncrementalPartitionType type) {
    addIncrementalPartitionTrait(patternDef, type, null);
  }

  /**
   * Add incremental partition trait "is.partition.incremental" and supplied arguments to the given data partition pattern.
   *
   * @param patternDef                            The data partition pattern.
   * @param type                                  The CdmIncrementalPartitionType, this is a required argument for the incremental trait.
   * @param fullDataPartitionPatternName          The name of the full data partition pattern name, this is optional.
   */
  private static void addIncrementalPartitionTrait(final CdmDataPartitionPatternDefinition patternDef, final CdmIncrementalPartitionType type, final String fullDataPartitionPatternName) {
    final ImmutablePair<String, Object> typeTuple = new ImmutablePair<>("type", type.toString());
    List<Pair<String, Object>> arguments = new ArrayList<>(Collections.singletonList(typeTuple));
    if (fullDataPartitionPatternName != null) {
      arguments.add(new ImmutablePair<>("fullDataPartitionPatternName", fullDataPartitionPatternName));
    }
    patternDef.getExhibitsTraits().add("is.partition.incremental", arguments);
  }

  /**
   * Create a CdmDataPartitionPatternDefinition object with the given name and set up the required properties of the object.
   *
   * @param corpus                                The corpus.
   * @param name                                  The name of the data partition pattern object.
   */
  private static CdmDataPartitionPatternDefinition createPartitionPatternDefinition(final CdmCorpusDefinition corpus, final String name) {
    return createPartitionPatternDefinition(corpus, name, false, false);
  }

  /**
   * Create a CdmDataPartitionPatternDefinition object with the given name and set up the required properties of the object.
   *
   * @param corpus                                The corpus.
   * @param name                                  The name of the data partition pattern object.
   * @param isIncrementalPartitionPattern         Whether this is an incrmental partition pattern object.
   */
  private static CdmDataPartitionPatternDefinition createPartitionPatternDefinition(final CdmCorpusDefinition corpus, final String name, final boolean isIncrementalPartitionPattern) {
    return createPartitionPatternDefinition(corpus, name, isIncrementalPartitionPattern, false);
  }

  /**
   * Create a CdmDataPartitionPatternDefinition object with the given name and set up the required properties of the object.
   *
   * @param corpus                                The corpus.
   * @param name                                  The name of the data partition pattern object.
   * @param isIncrementalPartitionPattern         Whether this is an incrmental partition pattern object.
   * @param isUpsert                              Whether this is an upsert incrmental partition pattern object.
   */
  private static CdmDataPartitionPatternDefinition createPartitionPatternDefinition(final CdmCorpusDefinition corpus, final String name, final boolean isIncrementalPartitionPattern, final boolean isUpsert) {
    final CdmDataPartitionPatternDefinition partitionPattern = corpus.makeObject(CdmObjectType.DataPartitionPatternDef, name, false);
    partitionPattern.setRootLocation(isIncrementalPartitionPattern ? "/IncrementalData" : "FullData");
    if (!isIncrementalPartitionPattern) {
      // the line below demonstrates using "GlobPattern" which can be used instead of "RegularExpression"
      // dataPartitionPattern.setGlobPattern("/*/cohort*.csv");
      partitionPattern.setRegularExpression("/(\\d{4})/(\\w+)/cohort(\\d+)\\.csv$");
      partitionPattern.setParameters(Arrays.asList("year", "month", "cohortNumber"));
    } else {
      final String folderName = isUpsert ? "Upserts" : "Deletes";
      final String partitionNumberString = isUpsert ? "upsertPartitionNumber" : "deletePartitionNumber";
      partitionPattern.setRegularExpression("/(.*)/(.*)/(.*)/" + folderName + "/(\\d+)\\.csv$");
      partitionPattern.setParameters(Arrays.asList("year", "month", "day", partitionNumberString));
    }

    return partitionPattern;
  }
}
