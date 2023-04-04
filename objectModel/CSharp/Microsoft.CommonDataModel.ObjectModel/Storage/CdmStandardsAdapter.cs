// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using System;
    using System.IO;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;

    public class CdmStandardsAdapter : StorageAdapterBase
    {
        /// <summary>
        /// The resource path root (every path will have this as a start).
        /// </summary>
        private static string root = "Microsoft.CommonDataModel.ObjectModel.Adapter.CdmStandards.Resources";

        private Assembly assembly;

        public CdmStandardsAdapter()
        {
            try
            {
                this.assembly = Assembly.Load("Microsoft.CommonDataModel.ObjectModel.Adapter.CdmStandards");
            }
            catch (Exception e)
            {
                throw new Exception($"Couldn't find assembly 'Microsoft.CommonDataModel.ObjectModel.Adapter.CdmStandards', please install the assembly, and add it as dependency of the project. Exception: {e.Message}.");

            }
        }

        public override bool CanRead()
        {
            return true;
        }

        /// <inheritdoc />
        public override string CreateAdapterPath(string corpusPath)
        {
            if (string.IsNullOrEmpty(corpusPath))
            {
                return null;
            }

            return $"{root}{corpusPath}";
        }

        /// <inheritdoc />
        public override string CreateCorpusPath(string adapterPath)
        {
            if (string.IsNullOrEmpty(adapterPath) || !adapterPath.StartsWith(root))
            {
                return null;
            }

            return adapterPath.Substring(root.Length);
        }

        /// <inheritdoc />
        public override async Task<string> ReadAsync(string corpusPath)
        {
            // Convert the corpus path to the resource path.
            var resourcePath = this.CreateAdapterPath(corpusPath).Replace('/', '.').Replace('-', '_');

            // Get the resource stream.
            var resourceStream = this.assembly.GetManifestResourceStream(resourcePath);

            if (resourceStream == null)
            {
                throw new Exception($"There is no resource found for {corpusPath}.");
            }

            using (var reader = new StreamReader(resourceStream, Encoding.UTF8))
            {
                return await reader.ReadToEndAsync();
            }
        }
    }
}
