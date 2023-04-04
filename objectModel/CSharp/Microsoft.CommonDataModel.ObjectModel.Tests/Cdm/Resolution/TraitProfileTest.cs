// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Resolution;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;

    /// <summary>
    /// trait profiles resolve and then consolidate to the expected shapes using caching or not
    /// uses entities from the published SCI schema
    /// </summary>
    [TestClass]
    public class TraitProfileTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Cdm", "Resolution", "TraitProfileTest");

        /// <summary>
        /// get profiles for entities and attributes of entities in manifest.
        /// leave profiles in 'deep' form
        /// no shared cache
        /// </summary>
        [TestMethod]
        public async Task OriginalProfileNoCache()
        {
            await this.DumpAndValidateProfiles(false, false);
        }

        /// <summary>
        /// get profiles for entities and attributes of entities in manifest.
        /// leave profiles in 'deep' form
        /// use a shared cache of profile objects for all
        /// </summary>
        [TestMethod]
        public async Task ConsolidatedProfileNoCache()
        {
            await this.DumpAndValidateProfiles(true, false);
        }
        /// <summary>
        /// get profiles for entities and attributes of entities in manifest.
        /// consolidate the profiles
        /// no shared cache
        /// </summary>
        [TestMethod]
        public async Task OriginalProfileSharedCache()
        {
            await this.DumpAndValidateProfiles(false, true);
        }
        /// <summary>
        /// get profiles for entities and attributes of entities in manifest.
        /// consolidate the profiles
        /// use a shared cache of profile objects for all
        /// </summary>
        [TestMethod]
        public async Task ConsolidatedProfileSharedCache()
        {
            await this.DumpAndValidateProfiles(true, true);
        }

        /// <summary>
        /// 
        /// </summary>
        public async Task DumpAndValidateProfiles(bool consolidate, bool shareCache)
        {
            JsonSerializer jsonSerializer = new JsonSerializer
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
            };

            CdmCorpusDefinition cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "ConsCache");
            var srcManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local:/miniContact.manifest.cdm.json");
            var resManifest = await srcManifest.CreateResolvedManifestAsync("_miniContact", "_{n}.cdm.json");

            TraitProfileCache profileCache = null;
            if (shareCache)
            {
                profileCache = new TraitProfileCache();
            }

            string allProfiles = "{";
            foreach (var entDec in resManifest.Entities)
            {
                if (entDec is CdmLocalEntityDeclarationDefinition locEntDec)
                {
                    CdmEntityDefinition entDef = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(locEntDec.EntityPath, resManifest);
                    ResolveOptions resOpt = new ResolveOptions(entDef);

                    var entTraitInfos = entDef.FetchTraitProfiles(resOpt, profileCache);
                    if (consolidate)
                    {
                        entTraitInfos = TraitProfile.ConsolidateList(entTraitInfos, profileCache);
                    }
                    var entProfileDump = JToken.FromObject(entTraitInfos, jsonSerializer).ToString();

                    string attProfiles = "";

                    foreach (var att in entDef.Attributes)
                    {
                        if (att is CdmTypeAttributeDefinition attDef)
                        {
                            var attTraitInfos = attDef.FetchTraitProfiles(resOpt, profileCache);
                            if (consolidate)
                            {
                                attTraitInfos = TraitProfile.ConsolidateList(attTraitInfos);
                            }
                            var attProfileDump = JToken.FromObject(attTraitInfos, jsonSerializer).ToString();

                            attProfiles += $"{(attProfiles == "" ? "" : ",")}\"{attDef.Name}\":{attProfileDump}";
                        }
                    }

                    allProfiles += $"{(allProfiles == "{" ? "" : ",")}\"{entDef.EntityName}\":{{\"entityProfile\":{entProfileDump}, \"attProfiles\":{{{attProfiles}}}}}";
                }
            }
            allProfiles += "}";

            string outName = $"ProfileDump{(consolidate? "Cons":"")}{(shareCache ? "Cache" : "")}.json";
            TestHelper.WriteActualOutputFileContent(testsSubpath, "ConsCache", outName, allProfiles);

            var refProfiles = TestHelper.GetExpectedOutputFileContent(testsSubpath, "ConsCache", outName);

            TestHelper.AssertSameObjectWasSerialized(allProfiles, refProfiles);
        }
    }
}
