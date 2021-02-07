// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Runtime.CompilerServices;

#if INTERNAL_VSTS
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Persistence.Odi.Tests" + Microsoft.CommonDataModel.AssemblyRef.TestPublicKey)]
#else
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Persistence.Odi.Tests")]
#endif
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
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;

    class CommonDataModelLoader
    {
        private static AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(new HashSet<string>() { "normalized", "referenceOnly" });

        public static Action<CdmStatusLevel, string> ConsoleStatusReport = (level, msg) =>
        {
            if (level == CdmStatusLevel.Error)
                Console.Error.WriteLine($"Err: {msg}");
            else if (level == CdmStatusLevel.Warning)
                Console.WriteLine($"Wrn: {msg}");
            else if (level == CdmStatusLevel.Progress)
                Console.WriteLine(msg);
        };

        public static Action<CdmStatusLevel, string> FileStatusReport = (level, msg) =>
        {
            // This callback is written just as an example and the file name can be changed as desired.
            using (StreamWriter file = new StreamWriter("common-data-model-loader-test-report.txt", true))
            {
                if (level == CdmStatusLevel.Error)
                    file.WriteLine($"Err: {msg}");
                else if (level == CdmStatusLevel.Warning)
                    file.WriteLine($"Wrn: {msg}");
                else if (level == CdmStatusLevel.Progress)
                    file.WriteLine(msg);
            }
        };

        public static async Task LoadCorpusFolder(CdmCorpusDefinition corpus, CdmFolderDefinition folder, IList<string> ignoreFolders, string version)
        {
            string path = corpus.RootPath + folder.FolderPath;

            if (ignoreFolders != null && ignoreFolders.Contains(folder.Name))
            {
                return;
            }
            string endMatch = (!string.IsNullOrEmpty(version)) ? $".{version}{PersistenceLayer.CdmExtension}" : PersistenceLayer.CdmExtension;

            if (!Directory.Exists(path))
            {
                throw new InvalidOperationException($"No directory found at {path}.");
            }

            DirectoryInfo rootDirectory = new DirectoryInfo(path);
            FileInfo[] files = null;
            try
            {
                files = rootDirectory.GetFiles("*.*", SearchOption.TopDirectoryOnly);
            }
            catch (UnauthorizedAccessException e)
            {
                Console.WriteLine(e.Message);
            }
            catch (DirectoryNotFoundException e)
            {
                Console.WriteLine(e.Message);
            }

            // for every document or directory
            foreach (FileInfo fs in files)
            {
                await LoadDocument(corpus, folder, fs, endMatch);
            }

        }

        static async Task LoadDocument(CdmCorpusDefinition corpus, CdmFolderDefinition folder, FileInfo fi, string endMatch)
        {
            string postfix = fi.Name.Substring(fi.Name.IndexOf("."));
            if (postfix == endMatch)
            {
                using (var reader = File.OpenText(fi.FullName))
                {
                    string content = await reader.ReadToEndAsync().ConfigureAwait(false);
                    CdmDocumentDefinition doc = DocumentPersistence.FromObject(corpus.Ctx, fi.Name, folder.Namespace, folder.FolderPath, JsonConvert.DeserializeObject<DocumentContent>(content));
                    folder.Documents.Add(doc);
                    Console.WriteLine($"Loading {fi.FullName}");
                }
            }
        }

        public static async Task<bool> ResolveLocalCorpus(CdmCorpusDefinition cdmCorpus, CdmValidationStep finishStep)
        {
            Console.WriteLine("resolving imports");

            List<CdmDocumentDefinition> AllDocuments = ((CdmCorpusDefinition)cdmCorpus).documentLibrary.ListAllDocuments();
            for (int i = 0; i < AllDocuments.Count; i++)
            {
                ResolveOptions resOpt = new ResolveOptions() { WrtDoc = AllDocuments[i], Directives = directives };
                await AllDocuments[i].RefreshAsync(resOpt);
            }
            return true;
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

        public static void PersistCorpusFolder(string rootPath, CdmFolderDefinition cdmFolder, AttributeResolutionDirectiveSet directiveSet, CopyOptions options = null)
        {
            if (cdmFolder != null)
            {
                string folderPath = rootPath + cdmFolder.FolderPath;
                Directory.CreateDirectory(folderPath);

                if (cdmFolder.Documents != null)
                {
                    cdmFolder.Documents.AllItems.ForEach(doc =>
                    {
                        ResolveOptions resOpt = new ResolveOptions { WrtDoc = doc, Directives = directiveSet };
                        PersistDocument(rootPath, resOpt, options);

                    });
                }

                if (cdmFolder.ChildFolders != null)
                {
                    cdmFolder.ChildFolders.AllItems.ForEach(f =>
                    {
                        PersistCorpusFolder(rootPath, f, directiveSet, options);
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
