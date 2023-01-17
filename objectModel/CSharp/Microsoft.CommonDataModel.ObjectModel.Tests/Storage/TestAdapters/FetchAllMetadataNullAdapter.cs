using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage.TestAdapters
{
    class FetchAllMetadataNullAdapter : NoOverrideAdapter
    {
        public FetchAllMetadataNullAdapter(LocalAdapter baseAdapter)
        : base(baseAdapter)
        {
        }

        public override async Task<IDictionary<string, CdmFileMetadata>> FetchAllFilesMetadataAsync(string folderCorpusPath)
        {
            return null;
        }
    }
}
