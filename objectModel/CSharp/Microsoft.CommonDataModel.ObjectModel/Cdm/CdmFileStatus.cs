// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;

    public interface CdmFileStatus : CdmObject
    {
        /// <summary>
        /// Gets or sets the last time the modified times were updated.
        /// </summary>
        DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// <summary>
        /// Gets or sets the last time this file was modified according to the OM.
        /// </summary>
        DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the greatest last time reported by any of the children objects about their file status check times.
        /// </summary>
        DateTimeOffset? LastChildFileModifiedTime { get; set; }

        /// <summary>
        /// Updates the object and any children with changes made in the document file where it came from.
        /// </summary>
        Task FileStatusCheckAsync();

        /// <summary>
        /// Reports the most recent modified time (of current or children objects) to the parent object.
        /// </summary>
        Task ReportMostRecentTimeAsync(DateTimeOffset? childTime);
    }
}
