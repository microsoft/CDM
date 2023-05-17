// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    using System;
    using System.IO;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;

    public class CdmCustomPackageAdapter : StorageAdapterBase
    {
        /// <summary>
        /// The resource path root (every path will have this as a start).
        /// </summary>
        private string root;

        /// <summary>
        /// The assembly object.
        /// </summary>
        private Assembly assembly;

        public CdmCustomPackageAdapter(string packageName, string root = "Resources")
        {
            if (string.IsNullOrWhiteSpace(packageName))
            {
                throw new Exception("No assembly name passed in, please pass in an assembly name or assembly when constructing the CdmCustomPackageAdapter.");
            }

            this.root = $"{packageName}.{root}";

            try
            {
                this.assembly = Assembly.Load(packageName);
            }
            catch (Exception e)
            {
                throw new Exception($"Couldn't find assembly '{packageName}', please install the assembly, and add it as dependency of the project. Exception: {e.Message}.");

            }
        }

        public CdmCustomPackageAdapter(Assembly assembly, string root = "Resources")
        {
            if (assembly == null)
            {
                throw new Exception("No assembly passed in, please pass in an assembly name or assembly when constructing the CdmCustomPackageAdapter.");
            }
            this.assembly = assembly;
            this.root = $"{assembly.GetName().Name}.{root}";
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
