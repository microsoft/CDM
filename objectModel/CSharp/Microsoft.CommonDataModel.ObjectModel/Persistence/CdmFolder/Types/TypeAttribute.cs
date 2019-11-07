//-----------------------------------------------------------------------
// <copyright file="TypeAttribute.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class TypeAttribute
    {
        public string Explanation { get; set; }
        public string Name { get; set; }
        public JToken Purpose { get; set; }
        public JToken DataType { get; set; }
        public List<JToken> AppliedTraits { get; set; }
        public string AttributeContext { get; set; }
        public bool? IsPrimaryKey { get; set; }
        public bool? IsReadOnly { get; set; }
        public bool? IsNullable { get; set; }
        public string DataFormat { get; set; }
        public string SourceName { get; set; }
        public int? SourceOrdering { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }

        public string MaximumValue { get; set; }
        public string MinimumValue { get; set; }
        public int? MaximumLength { get; set; }
        public bool? ValueConstrainedToList { get; set; }
        public JToken DefaultValue { get; set; }
        public JToken ResolutionGuidance { get; set; }
    }
}
