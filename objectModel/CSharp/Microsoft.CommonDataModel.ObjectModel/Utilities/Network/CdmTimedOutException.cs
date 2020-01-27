//-----------------------------------------------------------------------
// <copyrightfile="CdmTimedOutException.cs"company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
using System;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    public class CdmTimedOutException : CdmNetworkException
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmTimedOutException"/> class.
        /// </summary>
        public CdmTimedOutException()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmTimedOutException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public CdmTimedOutException(string message) : base(message)
        {
        }
    }
}
