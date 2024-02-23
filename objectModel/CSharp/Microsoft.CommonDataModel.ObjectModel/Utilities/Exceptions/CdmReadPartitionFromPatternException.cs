// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Exceptions
{
    using System;

    public class CdmReadPartitionFromPatternException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmReadPartitionFromPatternException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public CdmReadPartitionFromPatternException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
