// <copyright file="Entity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System.IO;
    using System.Text.RegularExpressions;

    /// <summary>
    /// Defines a base class for an entity. 
    /// An entity is a set of attributes and metadata that defines a concept 
    /// like Account or Contact and can be defined by any data producer.
    /// </summary>
    public abstract class Entity : DataObject
    {
        // Regex that detects dot or quotation mark
        private static readonly Regex InvalidNameRegex = new Regex(@"\.|""", RegexOptions.Compiled);

        /// <inheritdoc/>
        internal override void Validate()
        {
            base.Validate();

            if (InvalidNameRegex.IsMatch(this.Name))
            {
                throw new InvalidDataException($"Name of '{this.GetType().Name}' cannot contain dot or quotation mark.");
            }
        }
    }
}