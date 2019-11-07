//-----------------------------------------------------------------------
// <copyrightfile="CdmFileStatus.cs"company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using System;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    public interface CdmFileStatus : CdmObject
    {
        /// <summary>
        /// Last time the modified times were updated
        /// </summary>
        DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// <summary>
        /// Last time this file was modified according to the OM
        /// </summary>
        DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the attribute context content list.
        /// </summary>
        DateTimeOffset? LastChildFileModifiedTime { get; set; }

        /// <summary>
        /// Updates the object and any children with changes made in the document file where it came from
        /// </summary>
        Task FileStatusCheckAsync();

        /// <summary>
        /// Report most recent modified time (of current or children objects) to the parent object
        /// </summary>
        Task ReportMostRecentTimeAsync(DateTimeOffset? childTime);
    }
}
