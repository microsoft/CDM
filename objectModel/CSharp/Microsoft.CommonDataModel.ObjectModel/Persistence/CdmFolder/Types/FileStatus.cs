//-----------------------------------------------------------------------
// <copyright file="FileStatus.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
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
