// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types
{
    public interface FileStatus
    {
        /// <summary>
        /// The representation of data partition pattern in the CDM Folders format.
        /// </summary>
        string LastFileStatusCheckTime { get; set; }

        /// <summary>
        /// The representation of data partition pattern in the CDM Folders format.
        /// </summary>
        string LastFileModifiedTime { get; set; }

        /// <summary>
        /// The representation of data partition pattern in the CDM Folders format.
        /// </summary>
        string LastChildFileModifiedTime { get; set; }
    }
}
