// <copyright file="AttributeCollection.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    /// <summary>
    /// Defines a collection of <see cref="Attribute"/> objects
    /// </summary>
    public class AttributeCollection : MetadataObjectCollection<Attribute>
    {
        /// <inheritdoc/>
        internal override void Validate()
        {
            base.Validate();
            this.ValidateUniqueNames();
        }
    }
}