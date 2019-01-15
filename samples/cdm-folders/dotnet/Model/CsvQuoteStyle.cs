// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Microsoft.CdmFolders.SampleLibraries
{
    using System.Runtime.Serialization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    /// <summary>
    /// CSV quote style
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum CsvQuoteStyle
    {
        /// <summary>
        /// CSV quote style
        /// </summary>
        [EnumMember(Value = "QuoteStyle.Csv")]
        Csv,

        /// <summary>
        /// No quotes
        /// </summary>
        [EnumMember(Value = "QuoteStyle.None")]
        None,
    }
}
