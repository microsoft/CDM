namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class TestStorageAdapter : StorageAdapter
    {
        public Dictionary<string, string> Target { get; }
        public string LocationHint { get; set; }

        public TestStorageAdapter(Dictionary<string, string> target)
        {
            this.Target = target;
        }

        public bool CanWrite()
        {
            return true;
        }

        public Task WriteAsync(string corpusPath, string data)
        {
            // ensure that the path exists before trying to write the file
            string path = this.CreateAdapterPath(corpusPath);

            this.Target[path] = data;

            return Task.CompletedTask;
        }

        public string CreateAdapterPath(string corpusPath)
        {
            if (corpusPath.Contains(":"))
                corpusPath = StringUtils.Slice(corpusPath, corpusPath.IndexOf(":") + 1);
            return corpusPath;
        }

        public bool CanRead()
        {
            throw new NotImplementedException();
        }

        public void ClearCache()
        {
            throw new NotImplementedException();
        }

        public Task<List<string>> FetchAllFilesAsync(string folderCorpusPath)
        {
            throw new NotImplementedException();
        }

        public Task<DateTimeOffset?> GetLastModifiedTime(string adapterPath)
        {
            throw new NotImplementedException();
        }

        public string CreateCorpusPath(string adapterPath)
        {
            throw new NotImplementedException();
        }

        public Task<string> ReadAsync(string corpusPath)
        {
            throw new NotImplementedException();
        }

        public Task<DateTimeOffset?> ComputeLastModifiedTimeAsync(string corpusPath)
        {
            throw new NotImplementedException();
        }

        string StorageAdapter.FetchConfig()
        {
            return "";
        }

        public void UpdateConfig(string configs)
        {
        }
    }
}
