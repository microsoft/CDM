// <copyright file="AnnotationCollection.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Defines a collection of <see cref="Annotation"/> objects
    /// </summary>
    public class AnnotationCollection : ObjectCollection<Annotation>
    {
        /// <summary>
        /// Indexer
        /// </summary>
        /// <param name="name">Name</param>
        /// <returns>Value</returns>
        public string this[string name] => this.FirstOrDefault(a => StringComparer.OrdinalIgnoreCase.Equals(a.Name, name))?.Value;

        /// <summary>
        /// Validates that loaded <see cref="AnnotationCollection"/> is correct and can function.
        /// </summary>
        internal void Validate()
        {
            foreach (var annotation in this)
            {
                annotation.Validate();
            }
        }
    }
}