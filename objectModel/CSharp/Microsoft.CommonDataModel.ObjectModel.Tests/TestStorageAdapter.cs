// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class TestStorageAdapter : StorageAdapterBase
    {
        public ConcurrentDictionary<string, string> Target { get; }

        public TestStorageAdapter(ConcurrentDictionary<string, string> target)
        {
            this.Target = target;
        }

        /// <inheritdoc />
        public override bool CanWrite()
        {
            return true;
        }

        public override Task WriteAsync(string corpusPath, string data)
        {
            // ensure that the path exists before trying to write the file
            string path = this.CreateAdapterPath(corpusPath);

            this.Target.TryAdd(path, data);

            return Task.CompletedTask;
        }

        public override string CreateAdapterPath(string corpusPath)
        {
            if (corpusPath.Contains(":"))
                corpusPath = StringUtils.Slice(corpusPath, corpusPath.IndexOf(":") + 1);
            return corpusPath;
        }
    }
}
