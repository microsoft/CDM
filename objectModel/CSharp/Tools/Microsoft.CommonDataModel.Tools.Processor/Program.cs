//-----------------------------------------------------------------------
// <copyright file="Program.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.Tools.Processor
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class Program
    {
        static async Task Main(string[] args)
        {
            string pathToDocRoot;
            string docGroup;
            CdmManifestDefinition manifest;
            string testEnt;

            bool testCorpus = false;
            bool resolveEnt = false;
            bool spewAll = true;
            bool rePersist = false;

            CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";

            if (testCorpus)
            {
                pathToDocRoot = "../../../../../../../../CDM.Tools.Internal/TestCorpus";
                //pathToDocRoot = "../perfTestCorpus";
                //docGroup = "E2EResolution";
                //docGroup = "POVResolution";
                //docGroup = "MiniDyn";
                //docGroup = "composites";
                //docGroup = "KnowledgeGraph";
                //docGroup = "overrides";
                docGroup = "webClicks";

                //testEnt = "/E2EResolution/E2EArrayOne.cdm.json/E2EArrayOne";
                //testEnt = "/MiniDyn/sub/Lead.cdm.json/Lead";
                // testEnt = "/POVResolution/sub1/Main.cdm.json/Main";
                testEnt = "local:/MiniDyn/Account.cdm.json/Account";
            }
            else
            {
                pathToDocRoot = "../../../../../../../../schemaDocuments";
                testEnt = "local:/core/applicationCommon/foundationCommon/crmCommon/Account.cdm.json/Account";
                docGroup = "standards";
            }

            cdmCorpus.Storage.Mount("local", new LocalAdapter(pathToDocRoot));
            manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>($"local:/{docGroup}.manifest.cdm.json");

            string version = "";

            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Progress);
            Console.WriteLine("reading source files");

            if (resolveEnt)
            {
                // AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "xstructured", "referenceOnly" });
                AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
                var ent = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(testEnt);
                ResolveOptions resOpt = new ResolveOptions { WrtDoc = ent.InDocument, Directives = directives };
                var x = await ent.CreateResolvedEntityAsync("RESOLVED_KILL", resOpt);
                resOpt.WrtDoc = x.InDocument;
                CommonDataModelLoader.PersistDocument(cdmCorpus.RootPath, resOpt, new CopyOptions { StringRefs = false, RemoveSingleRowLocalizedTableTraits = true });
            }

            if (spewAll)
            {
                Console.WriteLine("list all resolved");
                AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "xstructured", "referenceOnly" });
                await ListAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher());
            }

            if (rePersist)
            {
                Console.WriteLine("persist corpus");
                AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "xstructured", "referenceOnly" });
            }

            //ListAllTraits(cdmCorpus);

            Console.WriteLine("done");
            Console.ReadLine();
        }

        public async static Task ListAllResolved(CdmCorpusDefinition cdmCorpus, AttributeResolutionDirectiveSet directives, CdmManifestDefinition manifest, StringSpewCatcher spew = null)
        {
            ISet<string> seen = new HashSet<string>();
            Func<CdmManifestDefinition, Task> seekEntities = null;
            seekEntities = async (CdmManifestDefinition f) =>
            {
                if (f.Entities != null)
                {
                    if (spew != null)
                        spew.SpewLine(f.FolderPath);
                    // manifest.Entities.ForEach(async entity =>
                    foreach (CdmEntityDeclarationDefinition entity in f.Entities)
                    {
                        string corpusPath;
                        CdmEntityDeclarationDefinition ent = entity;
                        CdmObject currentFile = f;
                        while (ent is CdmReferencedEntityDeclarationDefinition)
                        {
                            corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(ent.EntityPath, currentFile);
                            ent = await cdmCorpus.FetchObjectAsync<CdmReferencedEntityDeclarationDefinition>(corpusPath);
                            currentFile = (CdmObject)ent;
                        }
                        corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(((CdmLocalEntityDeclarationDefinition)ent).EntityPath, currentFile);
                        var newEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(corpusPath);
                        ResolveOptions resOpt = new ResolveOptions() { WrtDoc = newEnt.InDocument, Directives = directives };
                        ResolvedEntity resEnt = new ResolvedEntity(resOpt, newEnt);
                        if (spew != null)
                            resEnt.Spew(resOpt, spew, " ", true);
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
                File.WriteAllText(@"c:\temp\allResolved.txt", spew.GetContent(), Encoding.UTF8);
        }
    }
}
