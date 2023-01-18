using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage.TestAdapters
{
    class NoOverrideAdapter : StorageAdapterBase
    {
        public LocalAdapter localAdapter;

        public NoOverrideAdapter(LocalAdapter baseAdapter)
        {
            this.localAdapter = baseAdapter;
        }

        public override bool CanRead()
        {
            return true;
        }

        public override Task<string> ReadAsync(string corpusPath)
        {
            return this.localAdapter.ReadAsync(corpusPath);
        }
    }
}
