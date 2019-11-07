//-----------------------------------------------------------------------
// <copyright file="Import.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------


namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json;

    public class Import
    {
        [JsonProperty("URI", NullValueHandling = NullValueHandling.Ignore)]
        public string URI { get; set; } // deprecated

        [JsonProperty("corpusPath", NullValueHandling = NullValueHandling.Ignore)]
        public string CorpusPath { get; set; }

        [JsonProperty("moniker", NullValueHandling = NullValueHandling.Ignore)]
        public string Moniker { get; set; }
    }
}
