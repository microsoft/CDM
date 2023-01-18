using Microsoft.CommonDataModel.ObjectModel.Storage;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage.TestAdapters
{
    class OverrideFetchAllFilesAdapter : NoOverrideAdapter
    {
        public OverrideFetchAllFilesAdapter(LocalAdapter baseAdapter)
            : base(baseAdapter)
        {
        }

        public override Task<List<string>> FetchAllFilesAsync(string folderCorpusPath)
        {
            return this.localAdapter.FetchAllFilesAsync(folderCorpusPath);
        }
    }
}
