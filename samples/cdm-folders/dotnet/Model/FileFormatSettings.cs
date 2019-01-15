// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Microsoft.CdmFolders.SampleLibraries
{
    using Newtonsoft.Json;

    /// <summary>
    /// File format settings abstract class
    /// </summary>
    public abstract class FileFormatSettings
    {
        /// <summary>
        /// Clone this file format settings
        /// </summary>
        /// <returns>The cloned settings</returns>
        public abstract FileFormatSettings Clone();
    }
}