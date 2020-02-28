// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
