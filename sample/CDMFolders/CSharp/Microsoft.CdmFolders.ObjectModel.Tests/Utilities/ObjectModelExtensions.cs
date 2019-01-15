// <copyright file="ObjectModelExtensions.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests.Utilities
{
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Helper extension methods for the object model
    /// </summary>
    internal static class CdsaObjectModelHelper
    {
        /// <summary>
        /// Selects the local entities from the collection
        /// </summary>
        /// <param name="entities">Entity collection</param>
        /// <returns>Local entities</returns>
        public static IEnumerable<LocalEntity> WhereLocal(this EntityCollection entities)
        {
            return entities?.OfType<LocalEntity>();
        }

        /// <summary>
        /// Selects the reference entities from the collection
        /// </summary>
        /// <param name="entities">Entity collection</param>
        /// <returns>Reference entities</returns>
        public static IEnumerable<ReferenceEntity> WhereReference(this EntityCollection entities)
        {
            return entities?.OfType<ReferenceEntity>();
        }

        /// <summary>
        /// Returns as local entity cast
        /// </summary>
        /// <param name="entity">Entity</param>
        /// <returns>Local entity</returns>
        public static LocalEntity AsLocal(this Entity entity)
        {
            return (LocalEntity)entity;
        }

        /// <summary>
        /// Returns as reference entity cast
        /// </summary>
        /// <param name="entity">Entity</param>
        /// <returns>Local entity</returns>
        public static ReferenceEntity AsReference(this Entity entity)
        {
            return (ReferenceEntity)entity;
        }
    }
}