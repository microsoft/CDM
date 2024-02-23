// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;

public class ManifestResolutionTest {
    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH = new File(new File("Cdm", "Resolution"), "ManifestResolutionTest").toString();

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

    /**
    * Test that resolving a manifest that hasn't been added to a folder doesn't throw any exceptions.
    */
    @Test
    public void testResolvingManifestNotInFolder() {
       try {
            final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrResolveManifestFailed));
            final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolvingManifestNotInFolder", false, expectedLogCodes);

            CdmManifestDefinition manifest = cdmCorpus.makeObject(CdmObjectType.ManifestDef, "test");
            CdmEntityDefinition entity = cdmCorpus.makeObject(CdmObjectType.EntityDef, "entity");
            CdmDocumentDefinition document = cdmCorpus.makeObject(CdmObjectType.DocumentDef, "entity" + CdmConstants.CDM_EXTENSION);
            document.getDefinitions().add(entity);

            // Don't add the document containing the entity to a folder either.
            manifest.getEntities().add(entity);
            manifest.createResolvedManifestAsync("resolved", null).join();

            TestHelper.assertCdmLogCodeEquality(cdmCorpus, CdmLogCode.ErrResolveManifestFailed, true);
       } catch (Exception e) {
            Assert.fail("Exception should not be thrown when resolving a manifest that is not in a folder.");
       }
    }

    /**
     * Test that saving a resolved manifest will not cause original logical entity doc to be marked dirty.
     */
    @Test
    public void testLinkedResolvedDocSavingNotDirtyingLogicalEntities()
    {
        try {
            final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLinkedResolvedDocSavingNotDirtyingLogicalEntities");
            final CdmManifestDefinition manifestAbstract = corpus.makeObject(CdmObjectType.ManifestDef, "default");

            manifestAbstract.getImports().add("cdm:/foundations.cdm.json");
            manifestAbstract.getEntities().add("B", "local:/B.cdm.json/B");
            corpus.getStorage().fetchRootFolder("output").getDocuments().add(manifestAbstract);

            final CdmManifestDefinition manifestResolved = manifestAbstract.createResolvedManifestAsync("default-resolved", "{n}/{n}.cdm.json").join();

            Assert.assertTrue(!corpus.getStorage().getNamespaceFolders().get("local").getDocuments().get(0).isDirty()
                            && !corpus.getStorage().getNamespaceFolders().get("local").getDocuments().get(1).isDirty(),
                    "Referenced logical document should not become dirty when manifest is resolved");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     *  Test that correct error is shown when trying to create a resolved manifest with a name that already exists
     */
    @Test
    public void testResolvingManifestWithSameName()
    {
        try {
            final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrResolveManifestExists));
            final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolvingManifestWithSameName", null, false, expectedLogCodes);

            final CdmManifestDefinition manifest = corpus.makeObject(CdmObjectType.ManifestDef, "test");
            corpus.getStorage().getNamespaceFolders().get("local").getDocuments().add(manifest);
            final CdmManifestDefinition resManifest = manifest.createResolvedManifestAsync(manifest.getName(), "{n}/{n}").join();
            Assert.assertNull(resManifest);
            TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrResolveManifestExists, true);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * Test that manifest containing entities having dependency on each other for polymorphic sources resolves.
     */
    @Test
    public void testResolveManifestWithInterdependentPolymorphicSource()
    {
      try {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolveManifestWithInterdependentPolymorphicSource");
        final CdmManifestDefinition manifest = (CdmManifestDefinition) corpus.fetchObjectAsync("local:/Input.manifest.cdm.json").join();
        final ResolveOptions resOpt = new ResolveOptions();
        resOpt.setMaxDepth(3);
        final CdmManifestDefinition resolvedManifest = manifest.createResolvedManifestAsync("resolved", null, null, resOpt).join();

        Assert.assertEquals(2, resolvedManifest.getEntities().getCount());
        Assert.assertEquals("resolved/group.cdm.json/group", resolvedManifest.getEntities().get(0).getEntityPath().toLowerCase());
        Assert.assertEquals("resolved/groupmember.cdm.json/groupmember", resolvedManifest.getEntities().get(1).getEntityPath().toLowerCase());
      } catch (Exception e) {
        Assert.fail("Exception should not be thrown when resolving a manifest containing entities having dependency on each other for polymorphic sources.");
      }
    }
}
