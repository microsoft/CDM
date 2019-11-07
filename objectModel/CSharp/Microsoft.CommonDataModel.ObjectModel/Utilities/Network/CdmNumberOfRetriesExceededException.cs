//-----------------------------------------------------------------------
// <copyrightfile="CdmNumberOfRetriesExceededException.cs"company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
using System;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    public class CdmNumberOfRetriesExceededException : CdmNetworkException
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmNumberOfRetriesExceededException"/> class.
        /// </summary>
        public CdmNumberOfRetriesExceededException()
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmNumberOfRetriesExceededException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public CdmNumberOfRetriesExceededException(string message) : base(message)
        {

        }
    }
}
