// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types.Projections;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class TypeAttribute
    {
        public string Explanation { get; set; }
        public string Name { get; set; }
        public JToken Purpose { get; set; }
        public JToken DataType { get; set; }
        public List<JToken> AppliedTraits { get; set; }
        public dynamic AttributeContext { get; set; }
        public bool? IsPrimaryKey { get; set; }
        public bool? IsReadOnly { get; set; }
        public bool? IsNullable { get; set; }
        public string DataFormat { get; set; }
        public string SourceName { get; set; }
        public int? SourceOrdering { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public Projection Projection { get; set; }
        public string MaximumValue { get; set; }
        public string MinimumValue { get; set; }
        public int? MaximumLength { get; set; }
        public bool? ValueConstrainedToList { get; set; }
        public JToken DefaultValue { get; set; }
        public JToken ResolutionGuidance { get; set; }
        public CardinalitySettingsData Cardinality { get; set; }
    }
}
