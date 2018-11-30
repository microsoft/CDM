// <copyright file="Relationship.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.SampleLibraries
{
    /// <summary>
    /// Relationship
    /// </summary>
    public abstract class Relationship : MetadataObject
    {
        /// <inheritdoc/>
        protected override int NameLengthMax => 1024;
    }
}