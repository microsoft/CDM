// <copyright file="StringEnumCamelCaseConverter.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.SerializationHelpers
{
    using Newtonsoft.Json.Converters;

    /// <summary>
    /// StringEnumCamelCaseConverter
    /// </summary>
    internal class StringEnumCamelCaseConverter : StringEnumConverter
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
