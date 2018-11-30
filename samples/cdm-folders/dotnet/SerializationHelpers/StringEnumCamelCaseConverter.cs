// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Microsoft.CdmFolders.SampleLibraries.SerializationHelpers
{
    using Newtonsoft.Json.Converters;

    /// <summary>
    /// StringEnumCamelCaseConverter
    /// </summary>
    public class StringEnumCamelCaseConverter : StringEnumConverter
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StringEnumCamelCaseConverter"/> class.
        /// </summary>
        public StringEnumCamelCaseConverter()
        {
            this.CamelCaseText = true;
        }
    }
}
