// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using System.Collections.Generic;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// The folder for CDM folder format.
    /// </summary>
    public class Folder
    {
        /// <summary>
        /// Gets or sets the folder name.
        /// </summary>
        public string FolderName { get; set; }

        /// <summary>
        /// Gets or sets the folder explanation.
        /// </summary>
        public string Explanation { get; set; }

        /// <summary>
        /// Gets or sets the exhibited traits.
        /// </summary>
        public JToken ExhibitsTraits { get; set; }
    }
}
