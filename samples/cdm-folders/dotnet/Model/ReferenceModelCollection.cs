
namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.Collections.Generic;
    using System.IO;

    /// <summary>
    /// Reference Models Collection
    /// </summary>
    public class ReferenceModelCollection : ObjectCollection<ReferenceModel>
    {
        /// <summary>
        /// Validates that loaded model is correct and can function.
        /// </summary>
        internal void Validate()
        {
            var uniqueMonikers = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var referenceModel in this)
            {
                referenceModel.Validate();

                if (!uniqueMonikers.Contains(referenceModel.Id))
                {
                    uniqueMonikers.Add(referenceModel.Id);
                }
                else
                {
                    throw new InvalidDataException($"'{this.GetType().Name}' contains non-unique monikers.");
                }
            }
        }
    }
}