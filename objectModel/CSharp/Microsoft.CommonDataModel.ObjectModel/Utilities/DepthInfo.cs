// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    internal class DepthInfo
    {
        /// <summary>
        /// The default depth that we travel before forcing a foreign key attribute
        /// </summary>
        internal static int DefaultMaxDepth = 2;

        /// <summary>
        /// The max depth set if the user specified to not use max depth
        /// </summary>
        internal static int MaxDepthLimit = 32;

        /// <summary>
        /// The maximum depth that we can resolve entity attributes.
        /// This value is set in resolution guidance.
        /// </summary>
        internal int? MaxDepth { get; set; }

        /// <summary>
        /// The current depth that we are resolving at. Each entity attribute that we resolve
        /// into adds 1 to depth.
        /// </summary>
        internal int CurrentDepth { get; set; }

        /// <summary>
        /// Indicates if the maxDepth value has been hit when resolving
        /// </summary>
        internal bool MaxDepthExceeded { get; set; }
    }
}
