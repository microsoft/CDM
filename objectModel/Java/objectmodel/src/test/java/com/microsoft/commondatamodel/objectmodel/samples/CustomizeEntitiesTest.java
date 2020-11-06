// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.samples;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmParameterDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CustomizeEntitiesTest extends SampleTestBase{
    private static final String TEST_NAME = "TestCustomizeEntities";

    @Test
    public void testCustomizeEntities() {
        this.checkSampleRunTestsFlag();

        try {
            TestHelper.deleteFilesFromActualOutput(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME));
            TestHelper.copyFilesFromInputToActualOutput(TESTS_SUBPATH, TEST_NAME);
            customizeEnities(setupCdmCorpus());
            TestHelper.assertFolderFilesEquality(
                    TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, TEST_NAME),
                    TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME));
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }

    private CdmCorpusDefinition setupCdmCorpus() throws InterruptedException {
        CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
        cdmCorpus.getStorage().mount("local", new LocalAdapter(TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, TEST_NAME)));
        cdmCorpus.getStorage().setDefaultNamespace("local");
        cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SAMPLE_SCHEMA_FOLDER_PATH));
        return cdmCorpus;
    }

    private void customizeEnities(CdmCorpusDefinition cdmCorpus) {
        // Open the default manifest at the root, used later when done.
        // This method turns relative corpus paths into absolute ones in case we are in some
        // sub-folders and don't know it.
        final CdmManifestDefinition manifest =
                cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("default.manifest.cdm.json").join();

        System.out.println("Define new extension.");

        // First we will make a new document right in the same folder as the manifest.
        final CdmDocumentDefinition docAbs =
                cdmCorpus.makeObject(CdmObjectType.DocumentDef, "MobileCareTeam.cdm.json");

        // Import the cdm description of the original so the symbols will resolve.
        docAbs.getImports().add("cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CareTeam.cdm.json");

        // We will make a new traitReference to identify things that are known to be temporary, used later.
        // In theory this would be defined somewhere central so it can be shared.
        CdmTraitDefinition traitTemp =
                (CdmTraitDefinition) docAbs.getDefinitions().add(
                        CdmObjectType.TraitDef,
                        "means.temporary");
        // Extends the standard 'means' base traitReference.
        traitTemp.setExtendsTrait(cdmCorpus.makeObject(CdmObjectType.TraitRef, "means", true));
        // Add a parameter for the expected duration in days.
        CdmParameterDefinition param =
                cdmCorpus.makeObject(CdmObjectType.ParameterDef, "estimatedDays");
        param.setDataTypeRef(cdmCorpus.makeObject(CdmObjectType.DataTypeRef, "integer"));
        // By not using "true" on the last arg, this becomes an real reference object in the json.
        // Go look at the difference from "means" when this is done.
        param.setDefaultValue("30");
        traitTemp.getParameters().add(param);

        // Make an entity definition and add it to the list of definitions in the document.
        CdmEntityDefinition entAbs =
                (CdmEntityDefinition) docAbs.getDefinitions()
                        .add(CdmObjectType.EntityDef, "MobileCareTeam");
        // This entity extends the standard.
        // This function with 'true' will make a simple reference to the base.
        entAbs.setExtendsEntity(cdmCorpus.makeObject(CdmObjectType.EntityRef, "CareTeam", true));

        // And we will add an attribute.
        CdmTypeAttributeDefinition attNew =
                cdmCorpus.makeObject(CdmObjectType.TypeAttributeDef, "currentCity");
        // The attribute is a type is 'City" this is one of the predefined semantic types in meanings.cdm.json.
        attNew.setDataType(cdmCorpus.makeObject(CdmObjectType.DataTypeRef, "city", true));
        attNew.updateDescription("The current city where the mobile care team is working.");

        // Also apply our fancy new 'temporary' traitReference. They stay in a city for 90 days on average.
        CdmTraitReference traitReference =
                cdmCorpus.makeObject(CdmObjectType.TraitRef, "means.temporary");
        traitReference.getArguments().add("estimatedDays", "90");
        attNew.getAppliedTraits().add(traitReference);

        // Add attribute to the entity.
        entAbs.getAttributes().add(attNew);

        // The entity abstract definition is done, add the document to the corpus in the root folder and then save that doc.
        cdmCorpus.getStorage().fetchRootFolder("local").getDocuments().add(docAbs);

        // Next step is to remove all of the guesswork out of decoding the entity shape by 'resolving' it to a relational by reference shape.
        System.out.println("Make a local 'resolved' copy.");

        // Now resolve it.
        // Made the entity and document have a different name to avoid conflicts in this folder.
        CdmEntityDefinition entFlat = entAbs.createResolvedEntityAsync("LocalMobileCareTeam").join();

        // Now just add the pointer into our manifest.
        System.out.println("Add to manifest.");
        manifest.getEntities().add(entFlat);

        // This function will update all of the fileStatus times in the manifest.
        // manifest.refreshAsync().join();

        // And save the manifest along with linked definition files.
        manifest.saveAsAsync("default-resolved.manifest.cdm.json", true).join();
    }
}
