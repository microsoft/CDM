// <copyright file="CsvFormatSettings.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using Newtonsoft.Json;

    /// <summary>
    /// CSV file format settings.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class CsvFormatSettings : FileFormatSettings
    {
        /// <summary>
        /// Gets or sets a value indicating whether the csv contains headers
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
        public bool ColumnHeaders { get; set; } = false;

        /// <summary>
        /// Gets or sets the csv delimiter
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Delimiter { get; set; } = ",";

        /// <summary>
        /// Gets or sets the quote style
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
        public CsvQuoteStyle QuoteStyle { get; set; } = CsvQuoteStyle.Csv;

        /// <summary>
        /// Gets or sets the csv style
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
        public CsvStyle CsvStyle { get; set; } = CsvStyle.QuoteAlways;
    }
}
