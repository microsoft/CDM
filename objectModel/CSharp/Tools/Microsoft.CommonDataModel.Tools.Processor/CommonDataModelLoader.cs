//-----------------------------------------------------------------------
// <copyright file="CommonDataLoader.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.Tools.Processor
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    class CommonDataModelLoader
    {
        public static Action<CdmStatusLevel, string> ConsoleStatusReport = (level, msg) =>
        {
            if (level == CdmStatusLevel.Error)
                Console.Error.WriteLine($"Err: {msg}");
            else if (level == CdmStatusLevel.Warning)
                Console.WriteLine($"Wrn: {msg}");
            else if (level == CdmStatusLevel.Progress)
                Console.WriteLine(msg);
        };

        public static async Task LoadCorpusFolder(CdmCorpusDefinition corpus, CdmFolderDefinition folder, IList<string> ignoreFolders, string version)
        {
            string path = corpus.RootPath + folder.FolderPath;

            if (ignoreFolders != null && ignoreFolders.Contains(folder.Name))
            {
                return;
            }

            string endMatch = ".cdm.json";
            if (!version.EndsWith(".json"))
            {
                endMatch = (!string.IsNullOrEmpty(version)) ? $".{version}.cdm.json" : ".cdm.json";
            }

            if (!Directory.Exists(path))
            {
                throw new InvalidOperationException($"No directory found at {path}.");
            }
            DirectoryInfo rootDirectory = new DirectoryInfo(path);
            await WalkDirectoryTree(rootDirectory, corpus, folder, ignoreFolders, endMatch).ConfigureAwait(false);

        }

        static async Task WalkDirectoryTree(DirectoryInfo root, CdmCorpusDefinition corpus, CdmFolderDefinition folder, IList<string> ignoreFolders, string endMatch)
        {
            FileInfo[] files = null;
            DirectoryInfo[] subDirs = null;

            // First, process all the files directly under this folder
            try
            {
                files = root.GetFiles("*.*", SearchOption.TopDirectoryOnly);
            }
            catch (UnauthorizedAccessException e)
            {
                Console.WriteLine(e.Message);
            }
            catch (DirectoryNotFoundException e)
            {
                Console.WriteLine(e.Message);
            }

            if (files != null)
            {
                foreach (FileInfo fi in files)
                {
                    string postfix = fi.Name.Substring(fi.Name.IndexOf("."));
                    if (postfix == endMatch)
                    {
                        using (var reader = File.OpenText(fi.FullName))
                        {
                            string content = await reader.ReadToEndAsync().ConfigureAwait(false);
                            string name = folder.FolderPath + fi.Name;
                            CdmDocumentDefinition doc = DocumentPersistence.FromData(corpus.Ctx, name, folder.Namespace, folder.FolderPath, JsonConvert.DeserializeObject<DocumentContent>(content));
                            corpus.Documents.Add(doc);
                            Console.WriteLine($"Loading {fi.FullName}");
                        }
                    }
                }

                // Now find all the subdirectories under this directory.
                subDirs = root.GetDirectories();

                foreach (DirectoryInfo dirInfo in subDirs)
                {
                    // Resursive call for each subdirectory.
                    await LoadCorpusFolder(corpus, folder.ChildFolders.Add(dirInfo.Name), ignoreFolders, endMatch).ConfigureAwait(false);
                }
            }
        }

        public static async Task ValidateSchemaAsync(CdmCorpusDefinition cdmCorpus, CdmValidationStep finishStep)
        {
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();
            Console.WriteLine("Validate schema...");
            Func<CdmValidationStep, Task<CdmValidationStep>> validateStep = null;

            validateStep = async (currentStep) =>
            {
                var resolveReferencesAndValidateTask = await Task.Run(() => cdmCorpus.ResolveReferencesAndValidateAsync(currentStep, finishStep, null)).ConfigureAwait(false);
                Func<CdmValidationStep, Task<CdmValidationStep>> validationFunc = null;
                try
                {
                    validationFunc = async (r) =>
                    {
                        CdmValidationStep nextStep = r;
                        if (nextStep == CdmValidationStep.Error)
                        {
                            Console.WriteLine("validation step failed");
                            return CdmValidationStep.Error;
                        }
                        else if (nextStep == CdmValidationStep.Finished)
                        {
                            Console.WriteLine("validation finished");
                            stopwatch.Stop();
                            Console.WriteLine(stopwatch.Elapsed);
                            return CdmValidationStep.Finished;
                        }
                        else
                        {
                            // success resolving all imports
                            return await validateStep(nextStep).ConfigureAwait(false);
                        }
                    };

                }
                catch (Exception e)
                {
                    Console.WriteLine("Exception during validation");
                    Console.WriteLine(e.Message);
                }
                return await validationFunc(resolveReferencesAndValidateTask).ConfigureAwait(false);
            };

            await validateStep(CdmValidationStep.Start).ConfigureAwait(false);
        }

        public static void PersistCorpus(CdmCorpusDefinition cdmCorpus, AttributeResolutionDirectiveSet directives, CopyOptions options = null)
        {
            if (cdmCorpus != null && cdmCorpus.ChildFolders != null && cdmCorpus.ChildFolders.Count == 1)
            {
                PersistCorpusFolder(cdmCorpus.RootPath, cdmCorpus.ChildFolders[0], directives, options);
            }
        }

        public static void PersistCorpusFolder(string rootPath, CdmFolderDefinition cdmFolder, AttributeResolutionDirectiveSet directives, CopyOptions options = null)
        {
            if (cdmFolder != null)
            {
                string folderPath = rootPath + cdmFolder.FolderPath;
                Directory.CreateDirectory(folderPath);

                if (cdmFolder.Documents != null)
                {
                    cdmFolder.Documents.AllItems.ForEach(doc =>
                    {
                        ResolveOptions resOpt = new ResolveOptions { WrtDoc = doc, Directives = directives };
                        PersistDocument(rootPath, resOpt, options);

                    });
                }

                if (cdmFolder.ChildFolders != null)
                {
                    cdmFolder.ChildFolders.AllItems.ForEach(f =>
                    {
                        PersistCorpusFolder(rootPath, f, directives, options);
                    });
                }
            }
        }

        public static void PersistDocument(string rootPath, ResolveOptions resOpt, CopyOptions options = null)
        {
            string docPath = rootPath + (resOpt.WrtDoc.Owner as CdmFolderDefinition).FolderPath + resOpt.WrtDoc.Name;
            dynamic data = resOpt.WrtDoc.CopyData(resOpt, options);
            string content = JsonConvert.SerializeObject(data, Formatting.Indented, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
            File.WriteAllText(@"D:\temp\persist\result.json", content, Encoding.UTF8);
        }
    }
}
