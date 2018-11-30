// <copyright file="SchemaCollection.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web;

    /// <summary>
    /// Schema collection class
    /// </summary>
    public class SchemaCollection : ObjectCollection<Uri>
    {
        /// <summary>
        /// Gets the schema uri and entity name for each schema uri
        /// </summary>
        public IEnumerable<SchemaEntityInfo> EntitiesSpec => this.Select(uri => uri.GetSchemaEntityInfo());

        /// <summary>
        /// Validate well formed unique schema set
        /// </summary>
        internal void Validate()
        {
            var set = new HashSet<string>(this.Where(u => u.IsSchemaUri()).Select(uri => uri.GetSchemaEntityInfo().ToString()), StringComparer.OrdinalIgnoreCase);
            if (set.Count != this.Count)
            {
                throw new InvalidDataException(
                    $"schema collection contains non unique or invalid format schema items. Schema count = {this.Count}, valid, unique schema count = {set.Count}");
            }
        }

        /// <summary>
        /// Check if the provided schema collection is logically equivalent to this one
        /// </summary>
        /// <param name="schemas">The schema collection to compare</param>
        /// <returns>bool</returns>
        internal bool LogicallyEquivalent(SchemaCollection schemas)
        {
            if (schemas == null)
            {
                return false;
            }

            var set = new HashSet<string>(this.Select(uri => HttpUtility.UrlDecode(uri.AbsoluteUri)), StringComparer.OrdinalIgnoreCase);
            return set.SetEquals(schemas.Select(uri => HttpUtility.UrlDecode(uri.AbsoluteUri)));
        }
    }
}
