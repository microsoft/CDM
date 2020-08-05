// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ManifestResolveTest {
  /**
   * Test if a manifest resolves correctly a referenced entity declaration.
   */
  //@Test
  public void testReferencedEntityDeclarationResolution() {
       final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
       cdmCorpus.getStorage().mount("cdm", new LocalAdapter(TestHelper.SCHEMA_DOCS_ROOT));
       cdmCorpus.getStorage().setDefaultNamespace("cdm");

       final CdmManifestDefinition manifest = new CdmManifestDefinition(cdmCorpus.getCtx(), "manifest");

       manifest.getEntities().add(
               "Account",
               "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare" +
                       "/electronicMedicalRecords/Account.cdm.json/Account");

       final CdmReferencedEntityDeclarationDefinition referencedEntity =
               new CdmReferencedEntityDeclarationDefinition(cdmCorpus.getCtx(), "Address");
       referencedEntity.setEntityPath(
               "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare" +
                       "/electronicMedicalRecords/electronicMedicalRecords.manifest.cdm.json/Address"
       );
       manifest.getEntities().add(referencedEntity);

       cdmCorpus.getStorage().fetchRootFolder("cdm").getDocuments().add(manifest);

       final CdmManifestDefinition resolvedManifest =
               manifest.createResolvedManifestAsync(
                       "resolvedManifest",
                       null).join();

       Assert.assertEquals(2, resolvedManifest.getEntities().getCount());
       Assert.assertEquals(
               "core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare"
                       + "/electronicMedicalRecords/resolved/Account.cdm.json/Account",
               resolvedManifest.getEntities().get(0).getEntityPath());
       Assert.assertEquals(
               "cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare"
                       + "/electronicMedicalRecords/electronicMedicalRecords.manifest.cdm.json/Address",
               resolvedManifest.getEntities().get(1).getEntityPath());
   }

    /**
     * Test that resolving a manifest that hasn't been added to a folder doesn't throw any exceptions.
     */
    @Test
    public void testResolvingManifestNotInFolder() {
        try {
            final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.getStorage().mount("local", new LocalAdapter("C:\\path"));
            cdmCorpus.getStorage().setDefaultNamespace("local");
            cdmCorpus.setEventCallback((CdmStatusLevel level, String message) -> {
                // We should see the following error message be logged. If not, fail.
                if (!message.contains("Cannot resolve the manifest 'test' because it has not been added to a folder")) {
                    Assert.fail();
                }
            }, CdmStatusLevel.Warning);

            CdmManifestDefinition manifest = cdmCorpus.makeObject(CdmObjectType.ManifestDef, "test");
            CdmEntityDefinition entity = cdmCorpus.makeObject(CdmObjectType.EntityDef, "entity");
            CdmDocumentDefinition document = cdmCorpus.makeObject(CdmObjectType.DocumentDef, "entity" + CdmConstants.CDM_EXTENSION);
            document.getDefinitions().add(entity);

            // Don't add the document containing the entity to a folder either.
            manifest.getEntities().add(entity);
            manifest.createResolvedManifestAsync("resolved", null).join();
        } catch (Exception e) {
            Assert.fail("Exception should not be thrown when resolving a manifest that is not in a folder.");
        }
    }
}
