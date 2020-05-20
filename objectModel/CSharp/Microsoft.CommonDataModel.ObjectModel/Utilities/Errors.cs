// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.Linq;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    internal static class Errors
    {
        /// <summary>
        /// Generates a standardized error message describing the missing required fields
        /// <param name="corpusPath">The corpus path for the invalid object.</param>
        /// <param name="missingFields">A list containing the names of the fields that are missing.</param>
        /// <param name="onlyOneRequired">When true, indicates that only one of the missing fields is required, false means all missing fields are required. False by default.</param>
        /// </summary>
        internal static string ValidateErrorString(string corpusPath, IEnumerable<string> missingFields, bool onlyOneRequired = false)
        {
            string missingFieldString = string.Join(", ", missingFields.Select((s) => "'" + s + "'"));
            if (onlyOneRequired)
                return $"Integrity check failed. Reason: The object '{corpusPath}' is missing the following fields. At least one of the following must be provided: {missingFieldString}";
            else
                return $"Integrity check failed. Reason: The object '{corpusPath}' is missing the following required fields: {missingFieldString}";
        }
    }
}
