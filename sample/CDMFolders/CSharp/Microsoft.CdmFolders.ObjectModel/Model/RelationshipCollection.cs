// <copyright file="RelationshipCollection.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using Newtonsoft.Json;

    /// <summary>
    /// Defines a collection of <see cref="Relationship"/> objects
    /// </summary>
    /// <remarks>The usage of <see cref="TypeNameHandling.Auto"/> is ok since the TypeNameSerializationBinder limits the scope only to this assembly</remarks>
    [JsonArray(ItemTypeNameHandling = TypeNameHandling.Auto)]
    public class RelationshipCollection : MetadataObjectCollection<Relationship>
    {

    }
}
