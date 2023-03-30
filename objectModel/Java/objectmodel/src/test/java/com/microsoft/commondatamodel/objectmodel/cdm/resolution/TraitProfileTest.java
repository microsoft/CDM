// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeItem;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.TraitProfile;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.TraitProfileCache;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 *  trait profiles resolve and then consolidate to the expected shapes using caching or not
 * uses entities from the published SCI schema
 */
public class TraitProfileTest
{
    /**
     * The path between TestDataPath and TestName.
     */
    static final String TESTS_SUBPATH = new File(new File("Cdm", "Resolution"), "TraitProfileTest").toString();

    /**
      * get profiles for entities and attributes of entities in manifest.
      * leave profiles in 'deep' form
      * no shared cache
    */
    @Test
    public void originalProfileNoCache() throws IOException, InterruptedException, ExecutionException {
        this.dumpAndValidateProfiles(false, false);
    }

    /**
     * get profiles for entities and attributes of entities in manifest.
     * leave profiles in 'deep' form
     * use a shared cache of profile objects for all
    */

    @Test
    public void consolidatedProfileNoCache() throws IOException, InterruptedException, ExecutionException {
        this.dumpAndValidateProfiles(true, false);
    }
    /**
     * get profiles for entities and attributes of entities in manifest.
     * consolidate the profiles
     * no shared cache
    */
    @Test
    public void originalProfileSharedCache() throws IOException, InterruptedException, ExecutionException {
        this.dumpAndValidateProfiles(false, true);
    }
    /**
     * get profiles for entities and attributes of entities in manifest.
     * consolidate the profiles
     * use a shared cache of profile objects for all
    */
    @Test
    public void consolidatedProfileSharedCache() throws IOException, InterruptedException, ExecutionException {
        this.dumpAndValidateProfiles(true, true);
    }

    public void dumpAndValidateProfiles(Boolean consolidate, Boolean shareCache) throws IOException, InterruptedException, ExecutionException {

        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "ConsCache");
        CdmManifestDefinition srcManifest = (CdmManifestDefinition) cdmCorpus.fetchObjectAsync("local:/miniContact.manifest.cdm.json").join();
        CdmManifestDefinition resManifest = srcManifest.createResolvedManifestAsync("_miniContact", "_{n}.cdm.json").join();

        TraitProfileCache profileCache = null;
        if (shareCache) {
            profileCache = new TraitProfileCache();
        }

        String allProfiles = "{";
        for (CdmEntityDeclarationDefinition entDec : resManifest.getEntities()) {
            if (entDec instanceof CdmLocalEntityDeclarationDefinition ) {
                CdmLocalEntityDeclarationDefinition locEntDec = (CdmLocalEntityDeclarationDefinition) entDec;
                CdmEntityDefinition entDef = (CdmEntityDefinition) cdmCorpus.fetchObjectAsync(locEntDec.getEntityPath(), resManifest).join();
                ResolveOptions resOpt = new ResolveOptions(entDef);

                List<TraitProfile> entTraitInfos = entDef.fetchTraitProfiles(resOpt, profileCache);
                if (consolidate) {
                    entTraitInfos = TraitProfile.consolidateList(entTraitInfos, profileCache);
                }
                String entProfileDump;
                try {
                    entProfileDump = JMapper.WRITER.writeValueAsString(entTraitInfos);
                } catch (JsonProcessingException e) {
                    entProfileDump = "json stringify failed";
                }

                String attProfiles = "";

                for (CdmAttributeItem att : entDef.getAttributes())
                {
                    if (att instanceof CdmTypeAttributeDefinition) {
                        CdmTypeAttributeDefinition attDef = (CdmTypeAttributeDefinition) att;
                        List<TraitProfile> attTraitInfos = attDef.fetchTraitProfiles(resOpt, profileCache);
                        if (consolidate) {
                            attTraitInfos = TraitProfile.consolidateList(attTraitInfos);
                        }
                        String attProfileDump;
                        try {
                            attProfileDump = JMapper.WRITER.writeValueAsString(attTraitInfos);
                        } catch (JsonProcessingException e) {
                            attProfileDump = "json stringify failed";
                        }

                        attProfiles += String.format("%s\"%s\":%s", (attProfiles.equals("") ? "" : ","), attDef.getName(), attProfileDump);
                    }
                }

                allProfiles += String.format("%s\"%s\":{\"entityProfile\":%s, \"attProfiles\":{%s}}", (allProfiles.equals("{") ? "" : ","), entDef.getEntityName(), entProfileDump, attProfiles);
            }
        }
        allProfiles += "}";

        String outName = String.format("ProfileDump%s%s.json", (consolidate? "Cons":""), (shareCache ? "Cache" : ""));
        TestHelper.writeActualOutputFileContent(TESTS_SUBPATH, "ConsCache", outName, allProfiles);

        String refProfiles = TestHelper.getExpectedOutputFileContent(TESTS_SUBPATH, "ConsCache", outName);
        TestHelper.assertSameObjectWasSerialized(allProfiles, refProfiles);
    }
}
