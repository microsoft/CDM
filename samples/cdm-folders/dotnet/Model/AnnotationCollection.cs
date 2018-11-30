
namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.Linq;

    /// <summary>
    /// AnnotationCollection
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
        /// Validates that loaded model is correct and can function.
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