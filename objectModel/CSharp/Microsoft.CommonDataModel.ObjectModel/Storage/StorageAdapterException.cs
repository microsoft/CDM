// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Storage
{
    using System;

    public class StorageAdapterException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StorageAdapterException"/> class.
        /// </summary>
        public StorageAdapterException()
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="StorageAdapterException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public StorageAdapterException(string message) : base(message)
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="StorageAdapterException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="exception">The inner exception.</param>
        public StorageAdapterException(string message, Exception exception) : base(message, exception)
        {

        }
    }
}
