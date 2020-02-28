// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
