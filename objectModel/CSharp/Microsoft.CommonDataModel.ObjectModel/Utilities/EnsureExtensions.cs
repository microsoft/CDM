// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Provides extension methods to ensure that the variables contain correct values.
    /// </summary>
    internal static class EnsureExtensions
    {
        /// <summary>
        /// Returns object reference if it is not set to default value. Throws ArgumentNullException otherwise.
        /// </summary>
        /// <typeparam name="TReference">Type of object reference</typeparam>
        /// <param name="reference">Object reference</param>
        /// <param name="name">Name of object reference</param>
        /// <returns>Non default object reference</returns>
        internal static TReference EnsureNotDefault<TReference>(this TReference reference, string name) where TReference : struct
        {
            if (reference.Equals(default(TReference)))
            {
                throw new ArgumentNullException(name);
            }

            return reference;
        }

        /// <summary>
        /// Returns string if it is not null or empty. Throws ArgumentNullException otherwise.
        /// </summary>
        /// <param name="stringReference">String reference</param>
        /// <param name="name">Name of string reference</param>
        /// <returns>String reference that is not null or empty</returns>
        internal static string EnsureNotEmpty(this string stringReference, string name)
        {
            if (string.IsNullOrEmpty(stringReference))
            {
                throw new ArgumentNullException(name);
            }

            return stringReference;
        }

        /// <summary>
        /// Returns enumerable reference if it is not null or empty. Throws ArgumentNullException otherwise.
        /// </summary>
        /// <typeparam name="TElement">Type of element in enumerable</typeparam>
        /// <param name="enumerable">Enumerable object reference</param>
        /// <param name="name">Name of object reference</param>
        /// <returns>Non empty enumerable object reference</returns>
        internal static IEnumerable<TElement> EnsureNotEmpty<TElement>(this IEnumerable<TElement> enumerable, string name)
        {
            if (enumerable == null || !enumerable.Any())
            {
                throw new ArgumentNullException(name);
            }

            return enumerable;
        }

        /// <summary>
        /// Returns object reference if it is not set to null. Throws ArgumentNullException otherwise.
        /// </summary>
        /// <typeparam name="TReference">Type of object reference</typeparam>
        /// <param name="reference">Object reference</param>
        /// <param name="name">Name of object reference</param>
        /// <returns>Non null object reference</returns>
        internal static TReference EnsureNotNull<TReference>(this TReference reference, string name) where TReference : class
        {
            if (reference == null)
            {
                throw new ArgumentNullException(name);
            }

            return reference;
        }

        /// <summary>
        /// Returns string if it is not null or whitespace-only. Throws ArgumentNullException otherwise.
        /// </summary>
        /// <param name="stringReference">String reference</param>
        /// <param name="name">Name of string reference</param>
        /// <returns>String reference that is not null or whitespace-only</returns>
        internal static string EnsureNotWhiteSpace(this string stringReference, string name)
        {
            if (string.IsNullOrWhiteSpace(stringReference))
            {
                throw new ArgumentNullException(name);
            }

            return stringReference;
        }
    }
}
