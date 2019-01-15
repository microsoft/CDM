// <copyright file="EntityCollection.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a collection of <see cref="Entity"/> objects
    /// </summary>
    /// <remarks>The usage of <see cref="TypeNameHandling.Auto"/> was approved in this by Azure security team since the TypeNameSerializationBinder limis the scope only to this assembly</remarks>
    [JsonArray(ItemTypeNameHandling = TypeNameHandling.Auto)]
    public class EntityCollection : MetadataObjectCollection<Entity>
    {
        /// <inheritdoc/>
        internal override void Validate()
        {
            base.Validate();
            this.ValidateUniqueNames();
        }
    }
}