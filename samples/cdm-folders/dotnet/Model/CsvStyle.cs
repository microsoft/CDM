// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Microsoft.CdmFolders.SampleLibraries
{
    using System.Runtime.Serialization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    /// <summary>
    /// CSV style settings
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum CsvStyle
    {
        /// <summary>
        /// CSV quote style
        /// </summary>
        [EnumMember(Value = "CsvStyle.QuoteAlways")]
        QuoteAlways,

        /// <summary>
        /// No quotes
        /// </summary>
        [EnumMember(Value = "CsvStyle.QuoteAfterDelimiter")]
        QuoteAfterDelimiter,
    }
}
