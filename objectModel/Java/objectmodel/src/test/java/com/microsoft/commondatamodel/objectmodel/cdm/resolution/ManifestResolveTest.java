// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ManifestResolveTest {
  /**
   * Test if a manifest resolves correctly a referenced entity declaration.
   */
   @Test
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
}
