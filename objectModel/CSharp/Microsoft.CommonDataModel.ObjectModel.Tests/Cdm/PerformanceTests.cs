// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;
    using Assert = Microsoft.CommonDataModel.ObjectModel.Tests.AssertExtension;

    /// <summary>
    /// Test the performance of entity resolution
    /// </summary>
    [TestClass]
    public class PerformanceTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Performance");

        private const string SchemaDocsRoot = TestHelper.SchemaDocumentsPath;

        /// <summary>
        /// Test the time taken to resolve the corpus
        /// </summary>
        [TestMethod]
        public async Task ResolveCorpus()
        {
            Assert.IsTrue(Directory.Exists(Path.GetFullPath(SchemaDocsRoot)), "SchemaDocsRoot not found!!!");

            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

            Console.WriteLine("reading source files");

            var watch = Stopwatch.StartNew();
            cdmCorpus.Storage.Mount("local", new LocalAdapter(SchemaDocsRoot));
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(TestHelper.CdmStandardSchemaPath);
            var directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
            await EntityResolutionTests.ListAllResolved(cdmCorpus, directives, manifest);
            watch.Stop();
            Assert.Performance(70000, watch.ElapsedMilliseconds);
        }

        /// <summary>
        /// Test the time taken to resolve all the entities
        /// </summary>
        [TestMethod]
        public async Task ResolveEntities()
        {
            var cdmCorpus = new CdmCorpusDefinition();

            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestResolveEntities");

            cdmCorpus.RootPath = testInputPath;
            cdmCorpus.Storage.Mount("local", new LocalAdapter(testInputPath));
            cdmCorpus.Storage.DefaultNamespace = "local";
            var entities = this.GetAllEntities(cdmCorpus);
            var entityResolutionTimes = new List<Tuple<string, long>>();
            foreach (var data in entities)
            {
                var entity = data.Item1;
                var doc = data.Item2;
                var directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
                var resOpt = new ResolveOptions { WrtDoc = doc, Directives = directives };
                var watch = Stopwatch.StartNew();
                await entity.CreateResolvedEntityAsync($"{entity.GetName()}_", resOpt); watch.Stop();
                entityResolutionTimes.Add(Tuple.Create(entity.AtCorpusPath, watch.ElapsedMilliseconds));
            }

            entityResolutionTimes.Sort((lhs, rhs) =>
                {
                    var diff = rhs.Item2 - lhs.Item2;
                    return diff == 0 ? 0 : diff < 0 ? -1 : 1;
                });

            foreach (var data in entityResolutionTimes)
            {
                Trace.WriteLine($"{data.Item1}:{data.Item2}");
            }

            Assert.Performance(1000, entityResolutionTimes[0].Item2);
            var total = entityResolutionTimes.Sum(data => data.Item2);
            Assert.Performance(2000, total);
        }

        /// <summary>
        /// Test the time taken to resolve an entity w.r.t. the entities it references.
        /// </summary>
        [TestMethod]
        public async Task ResolveEntitiesWrt()
        {
            var cdmCorpus = new CdmCorpusDefinition();

            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestResolveEntitiesWrt");

            ((CdmCorpusDefinition)cdmCorpus).RootPath = testInputPath;
            cdmCorpus.Storage.Mount("local", new LocalAdapter(testInputPath));
            cdmCorpus.Storage.DefaultNamespace = "local";
            var entities = this.GetAllEntities(cdmCorpus);
            var incomingReferences = new Dictionary<CdmEntityDefinition, List<CdmEntityDefinition>>();
            foreach (var data in entities)
            {
                var entity = data.Item1;
                incomingReferences[entity] = new List<CdmEntityDefinition>();
            }

            // Start by populating all the incoming references to the entities
            foreach (var data in entities)
            {
                var entity = data.Item1;
                var doc = data.Item2;
                var directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
                var resOpt = new ResolveOptions { WrtDoc = doc, Directives = directives };
                var resolvedEntity = await entity.CreateResolvedEntityAsync($"{entity.GetName()}_", resOpt);
                var references = await this.GetEntityReferences(resolvedEntity, resOpt, cdmCorpus);
                if (references.Count > 0)
                {
                    foreach (var reference in references)
                    {
                        incomingReferences[reference].Add(entity);
                    }
                }
            }

            // Next resolve the entity with all of it's incoming references and save the times
            var entityResolutionTimes = new List<Tuple<string, long>>();
            foreach (var data in entities)
            {
                var entity = data.Item1;
                var doc = data.Item2;
                var directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
                var resOpt = new ResolveOptions { WrtDoc = doc, Directives = directives };
                var watch = Stopwatch.StartNew();
                var references = incomingReferences[entity];
                foreach (var entRef in references)
                {
                    await entRef.CreateResolvedEntityAsync($"{entRef.GetName()}_", resOpt);
                }

                watch.Stop();
                entityResolutionTimes.Add(Tuple.Create(entity.AtCorpusPath, watch.ElapsedMilliseconds));
            }

            entityResolutionTimes.Sort((lhs, rhs) =>
                {
                    var diff = rhs.Item2 - lhs.Item2;
                    return diff == 0 ? 0 : diff < 0 ? -1 : 1;
                });

            foreach (var data in entityResolutionTimes)
            {
                Trace.WriteLine($"{data.Item1}:{data.Item2}");
            }

            Assert.Performance(1000, entityResolutionTimes[0].Item2);
            var total = entityResolutionTimes.Sum(data => data.Item2);
            Assert.Performance(4200, total);
        }

        /// <summary>
        /// Get the list of entities that the given entity references
        /// </summary>
        /// <param name="resolvedEntity"> The resolved version of the entity. </param>
        /// <param name="resOpt"> The resolution options to use. </param>
        /// <param name="cdmCorpus"> The instance of the CDM corpus. </param>
        /// <returns> The list of referenced entities. </returns>
        private async Task<List<CdmEntityDefinition>> GetEntityReferences(CdmEntityDefinition resolvedEntity, ResolveOptions resOpt, CdmCorpusDefinition cdmCorpus)
        {
            var atts = resolvedEntity.Attributes.Cast<CdmTypeAttributeDefinition>();
            var reqdTraits = atts.Select(att => att.AppliedTraits.AllItems.FirstOrDefault(trait => trait.FetchObjectDefinitionName() == "is.linkedEntity.identifier")).Where(trait => trait != null);
            var references = new List<CdmEntityDefinition>();
            foreach (var trait in reqdTraits)
            {
                var constEnt = (trait.Arguments.FetchValue("entityReferences") as CdmEntityReference)?.FetchObjectDefinition<CdmConstantEntityDefinition>(resOpt);
                if (constEnt != null)
                {
                    List<CdmEntityDefinition> refs = new List<CdmEntityDefinition>();
                    foreach (List<string> val in constEnt.ConstantValues)
                    {
                        refs.Add(await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(cdmCorpus.Storage.CreateAbsoluteCorpusPath(val[0])));
                    }
                    references.AddRange(refs);
                }
            }

            return references;
        }

        /// <summary>
        /// Get all the entities that are present in the corpus.
        /// </summary>
        /// <param name="cdmCorpus"> The instance of the CDM corpus to use. </param>
        /// <returns> The list of entities present. </returns>
        private List<Tuple<CdmEntityDefinition, CdmDocumentDefinition>> GetAllEntities(CdmCorpusDefinition cdmCorpus)
        {
            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            Console.WriteLine("reading source files");

            var rootFolder = cdmCorpus.Storage.FetchRootFolder("local");
            var folders = Directory.GetDirectories(cdmCorpus.RootPath).ToList().ConvertAll(Path.GetFileName);
            foreach (var folder in folders)
            {
                CommonDataModelLoader.LoadCorpusFolder(cdmCorpus, rootFolder.ChildFolders.Add(folder), new List<string> { "analyticalCommon" }, string.Empty).GetAwaiter().GetResult();
            }

            CommonDataModelLoader.ResolveLocalCorpus(cdmCorpus, CdmValidationStep.MinimumForResolving).GetAwaiter().GetResult();

            var entities = new List<Tuple<CdmEntityDefinition, CdmDocumentDefinition>>();
            Action<CdmFolderDefinition> seekEntities = null;
            seekEntities = (folder) =>
            {
                if (/*!string.IsNullOrEmpty(folder.Name) && */folder.Documents != null && folder.Documents.Count > 0)
                {
                    foreach (var doc in folder.Documents)
                    {
                        if (doc.Definitions != null)
                        {
                            foreach (var def in doc.Definitions)
                            {
                                if (def.ObjectType == CdmObjectType.EntityDef)
                                {
                                    entities.Add(Tuple.Create(def as CdmEntityDefinition, doc));
                                }
                            }
                        }
                    }
                }

                folder.ChildFolders?.AllItems.ForEach(f => seekEntities?.Invoke(f));
            };

            seekEntities(rootFolder.ChildFolders[0]);
            return entities;
        }
    }
}
