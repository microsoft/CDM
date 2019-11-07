//-----------------------------------------------------------------------
// <copyrightfile="CdmNetworkException.cs"company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
using System;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Network
{
    public abstract class CdmNetworkException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmNetworkException"/> class.
        /// </summary>
        public CdmNetworkException()
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmNetworkException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public CdmNetworkException(string message) : base(message)
        {

        }
    }
}
