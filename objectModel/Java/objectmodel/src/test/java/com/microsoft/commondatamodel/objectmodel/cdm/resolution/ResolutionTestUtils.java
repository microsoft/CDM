// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolution;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.ImportsLoadStrategy;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntity;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

/**
 * Common utilities used by resolution tests.
 */
public class ResolutionTestUtils {
    /**
     * Function used to test resolving an environment.
     * Writes a helper function used for debugging.
     * Asserts the result matches the expected result stored in a file.
     * @param testsSubPath The tests sub-folder name
     * @param testName The name of the test. It is used to decide the path of input / output files.
     * @param manifestName The name of the manifest to be used.
     * @param doesWriteDebuggingFiles Whether debugging files should be written or not.
     * @throws IOException
     * @throws InterruptedException
     */
    static void resolveSaveDebuggingFileAndAssert(String testsSubPath, String testName, String manifestName, boolean doesWriteDebuggingFiles)
            throws IOException, InterruptedException {
        Assert.assertNotNull(testName);
        String result = ResolutionTestUtils.resolveEnvironment(testsSubPath, testName, manifestName);

        if (doesWriteDebuggingFiles) {
            TestHelper.writeActualOutputFileContent(testsSubPath, testName, manifestName + ".txt", result);
        }

        String original = TestHelper.getExpectedOutputFileContent(testsSubPath, testName, manifestName + ".txt");

        TestHelper.assertFileContentEquality(original, result);
    }

    /**
     * Resolve the entities in the given manifest.
     * @param testsSubPath The tests sub-folder name
     * @param testName The name of the test. It is used to decide the path of input / output files.
     * @param manifestName The name of the manifest to be used.
     * @return The resolved entities.
     * @throws InterruptedException
     */
    static String resolveEnvironment(String testsSubPath, String testName, String manifestName) throws InterruptedException, IOException {
        CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(testsSubPath, testName);

        CdmManifestDefinition manifest = (CdmManifestDefinition) cdmCorpus.fetchObjectAsync
                ("local:/" + manifestName + ".manifest.cdm.json").join();
        Set<String> directivesStringsSet = new HashSet<>();
        directivesStringsSet.add("normalized");
        directivesStringsSet.add("referenceOnly");
        AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(directivesStringsSet);
        return listAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher());
    }

    /// <summary>
    /// Get the text version of all the resolved entities.
    /// </summary>
    /// <param name="cdmCorpus"> The CDM corpus. </param>
    /// <param name="directives"> The directives to use while getting the resolved entities. </param>
    /// <param name="manifest"> The manifest to be resolved. </param>
    /// <param name="spew"> The object used to store the text to be returned. </param>
    /// <returns> The text version of the resolved entities. (it's in a form that facilitates debugging) </returns>
    static String listAllResolved(CdmCorpusDefinition cdmCorpus, AttributeResolutionDirectiveSet directives, CdmManifestDefinition manifest, StringSpewCatcher spew) throws IOException {
        // make sure the corpus has a set of default artifact attributes
        cdmCorpus.prepareArtifactAttributesAsync().join();

        seekEntities(cdmCorpus, directives, manifest, spew);

        if (spew != null) {
            return spew.getContent();
        }

        return "";
    }

    private static void seekEntities(CdmCorpusDefinition cdmCorpus, AttributeResolutionDirectiveSet directives, CdmManifestDefinition f,
                                     StringSpewCatcher spew) throws IOException {
        if (f.getEntities() != null) {
            if (spew != null) {
                spew.spewLine(f.getFolderPath());
            }

            for (CdmEntityDeclarationDefinition entity : f.getEntities()) {
                String corpusPath;
                CdmEntityDeclarationDefinition ent = entity;
                CdmObject currentFile = f;

                while (ent instanceof CdmReferencedEntityDeclarationDefinition) {
                    corpusPath = cdmCorpus.getStorage().createAbsoluteCorpusPath(ent.getEntityPath(), currentFile);
                    ent = (CdmEntityDeclarationDefinition) cdmCorpus.fetchObjectAsync(corpusPath).join();
                    currentFile = ent;
                }
                corpusPath = cdmCorpus.getStorage().createAbsoluteCorpusPath(ent.getEntityPath(), currentFile);
                ResolveOptions resOpt = new ResolveOptions();
                resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);
                CdmEntityDefinition newEnt = (CdmEntityDefinition) cdmCorpus.fetchObjectAsync(corpusPath, null, resOpt).join();
                resOpt.setWrtDoc(newEnt.getInDocument());
                resOpt.setDirectives(directives);
                ResolvedEntity resEnt = new ResolvedEntity(newEnt, resOpt);
                if (spew != null) {
                    resEnt.spew(resOpt, spew, " ", true);
                }
            }
        }

        if (f.getSubManifests() != null) {
            for (CdmManifestDeclarationDefinition subManifest : f.getSubManifests()) {
                String corpusPath = cdmCorpus.getStorage().createAbsoluteCorpusPath(subManifest.getDefinition(), f);
                seekEntities(cdmCorpus, directives, (CdmManifestDefinition) cdmCorpus.fetchObjectAsync(corpusPath).join(), spew);
            }
        }
    }
}
