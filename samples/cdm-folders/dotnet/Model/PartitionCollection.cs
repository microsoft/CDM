// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Microsoft.CdmFolders.SampleLibraries
{
    /// <summary>
    /// PartitionCollection
    /// </summary>
    public class PartitionCollection : MetadataObjectCollection<Partition, Entity>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PartitionCollection"/> class.
        /// </summary>
        /// <param name="parent">The parent</param>
        public PartitionCollection(Entity parent)
            : base(parent)
        {
        }
    }
}