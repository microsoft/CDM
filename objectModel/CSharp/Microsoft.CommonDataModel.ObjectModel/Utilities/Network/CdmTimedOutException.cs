// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
