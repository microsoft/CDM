// <copyright file="SerializationOrderConstants.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.SerializationHelpers
{
    /// <summary>
    /// SerializationOrderConstants
    /// </summary>
    internal static class SerializationOrderConstants
    {
        /// <summary>
        /// DataObjectSerializationOrder
        /// </summary>
        public const int DataObjectSerializationOrder = -2;

        /// <summary>
        /// MetadataObjectSerializationOrder
        /// </summary>
        public const int MetadataObjectSerializationOrder = -3;

        /// <summary>
        /// PropertySerializationOrder
        /// </summary>
        public const int ObjectSerializationOrder = 10;

        /// <summary>
        /// PropertySerializationOrder
        /// </summary>
        public const int CollectionSerializationOrder = 20;
    }
}
