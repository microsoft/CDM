// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// CSV file format settings.
    /// </summary>
    public class CsvFormatSettings : FileFormatSettings
    {
        public bool? ColumnHeaders { get; set; }
        public string CsvStyle { get; set; }
        public string Delimiter { get; set; }
        public string QuoteStyle { get; set; }
        public string Encoding { get; set; }
    }
}
