// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    /// <summary>
    /// Contains information about an import in the imports pririty map.
    /// </summary>
    internal class ImportInfo
    {
        /// <summary>
        /// The priority that the import has with respect to the document where it is imported.
        /// </summary>
        public int Priority { get; set; }

        /// <summary>
        /// If the import has a moniker or not.
        /// </summary>
        public bool IsMoniker { get; set; }

        /// <summary>
        /// Constructor of the ImportInfo class.
        /// </summary>
        /// <param name="priority"></param>
        /// <param name="isMoniker"></param>
        public ImportInfo(int priority, bool isMoniker)
        {
            this.Priority = priority;
            this.IsMoniker = isMoniker;
        }
    }
}
