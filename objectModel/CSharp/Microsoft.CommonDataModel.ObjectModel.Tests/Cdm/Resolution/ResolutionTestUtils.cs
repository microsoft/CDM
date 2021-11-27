// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Enums;
using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using Microsoft.CommonDataModel.Tools.Processor;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Resolution
{
    /// <summary>
    /// Common utilities used by resolution tests.
    /// </summary>
    internal class ResolutionTestUtils
    {
        /// <summary>
        /// Function used to test resolving an environment.
        /// Writes a helper function used for debugging.
        /// Asserts the result matches the expected result stored in a file.
        /// </summary>
        /// <param name="testsSubPath">Tests sub-folder name</param>
        /// <param name="testName">The name of the test. It is used to decide the path of input / output files. </param>
        /// <parameter name="manifestName">The name of the manifest to be used. </parameter>
        /// <parameter name="doesWriteDebuggingFiles">Whether debugging files should be written or not. </parameter>
        /// <returns>Task associated with this function. </returns>
        internal static async Task ResolveSaveDebuggingFileAndAssert(string testsSubPath, string testName, string manifestName, bool doesWriteDebuggingFiles = false)
        {
            Assert.IsNotNull(testName);
            var result = await ResolveEnvironment(testsSubPath, testName, manifestName);

            if (doesWriteDebuggingFiles)
            {
                TestHelper.WriteActualOutputFileContent(testsSubPath, testName, $"{manifestName}.txt", result);
            }

            var original = TestHelper.GetExpectedOutputFileContent(testsSubPath, testName, $"{manifestName}.txt");

            TestHelper.AssertFileContentEquality(original, result);
        }

        /// <summary>
        /// Resolve the entities in the given manifest.
        /// </summary>
        /// <param name="testsSubPath">Tests sub-folder name</param>
        /// <param name="testName">The name of the test. It is used to decide the path of input / output files. </param>
        /// <parameter name="manifestName">The name of the manifest to be used. </parameter>
        /// <returns> The resolved entities. </returns>
        internal static async Task<string> ResolveEnvironment(string testsSubPath, string testName, string manifestName)
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubPath, testName);
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>($"local:/{manifestName}.manifest.cdm.json");
            var directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
            return await ListAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher());
        }

        /// <summary>
        /// Get the text version of all the resolved entities.
        /// </summary>
        /// <param name="cdmCorpus"> The CDM corpus. </param>
        /// <param name="directives"> The directives to use while getting the resolved entities. </param>
        /// <param name="manifest"> The manifest to be resolved. </param>
        /// <param name="spew"> The object used to store the text to be returned. </param>
        /// <returns> The text version of the resolved entities. (it's in a form that facilitates debugging) </returns>
        internal static async Task<string> ListAllResolved(CdmCorpusDefinition cdmCorpus, AttributeResolutionDirectiveSet directives, CdmManifestDefinition manifest, StringSpewCatcher spew = null)
        {
            // make sure the corpus has a set of default artifact attributes 
            await cdmCorpus.PrepareArtifactAttributesAsync();

            var seen = new HashSet<string>();
            Func<CdmManifestDefinition, Task> seekEntities = null;
            seekEntities = async (CdmManifestDefinition f) =>
            {
                if (f.Entities != null)
                {
                    if (spew != null)
                    {
                        spew.SpewLine(f.FolderPath);
                    }

                    foreach (CdmEntityDeclarationDefinition entity in f.Entities)
                    {
                        string corpusPath;
                        CdmEntityDeclarationDefinition ent = entity;
                        CdmObject currentFile = f;
                        while (ent is CdmReferencedEntityDeclarationDefinition)
                        {
                            corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(ent.EntityPath, currentFile);
                            ent = await cdmCorpus.FetchObjectAsync<CdmReferencedEntityDeclarationDefinition>(corpusPath);
                            currentFile = ent;
                        }
                        corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(((CdmLocalEntityDeclarationDefinition)ent).EntityPath, currentFile);
                        ResolveOptions resOpt = new ResolveOptions()
                        {
                            ImportsLoadStrategy = ImportsLoadStrategy.Load
                        };
                        CdmEntityDefinition newEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(corpusPath, null, resOpt);
                        resOpt.WrtDoc = newEnt.InDocument;
                        resOpt.Directives = directives;
                        ResolvedEntity resEnt = new ResolvedEntity(resOpt, newEnt);
                        if (spew != null)
                        {
                            resEnt.Spew(resOpt, spew, " ", true);
                        }
                    }
                }
                if (f.SubManifests != null)
                {
                    // folder.SubManifests.ForEach(async f =>
                    foreach (CdmManifestDeclarationDefinition subManifest in f.SubManifests)
                    {
                        string corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(subManifest.Definition, f);
                        await seekEntities(await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(corpusPath));
                    }
                }
            };
            await seekEntities(manifest);
            if (spew != null)
                return spew.GetContent();
            return "";
        }
    }
}
