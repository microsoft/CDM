// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// CSV file format settings.
    /// </summary>
    public class CsvFormatSettings : FileFormatSettings
    {
        [JsonProperty("columnHeaders", NullValueHandling = NullValueHandling.Ignore)]
        public bool? ColumnHeaders { get; set; }

        [JsonProperty("csvStyle", NullValueHandling = NullValueHandling.Ignore)]
        public string CsvStyle { get; set; }

        [JsonProperty("delimiter", NullValueHandling = NullValueHandling.Ignore)]
        public string Delimiter { get; set; }

        [JsonProperty("quoteStyle", NullValueHandling = NullValueHandling.Ignore)]
        public string QuoteStyle { get; set; }

        [JsonProperty("encoding", NullValueHandling = NullValueHandling.Ignore)]
        public string Encoding { get; set; }
    }
}
