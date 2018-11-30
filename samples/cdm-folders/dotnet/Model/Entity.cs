// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Microsoft.CdmFolders.SampleLibraries
{
    using System.IO;
    using System.Text.RegularExpressions;

    /// <summary>
    /// Entity
    /// </summary>
    public abstract class Entity : DataObject
    {
        // Regex that detects dot or quotation mark
        private static readonly Regex InvalidNameRegex = new Regex(@"\.|""", RegexOptions.Compiled);

        /// <inheritdoc/>
        internal override void Validate(bool allowUnresolvedModelReferences = true)
        {
            base.Validate(allowUnresolvedModelReferences);

            if (InvalidNameRegex.IsMatch(this.Name))
            {
                throw new InvalidDataException($"Name of '{this.GetType().Name}' cannot contain dot or quotation mark.");
            }
        }
    }
}