// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class EntityAttribute
    {
        public string Explanation { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public JToken Purpose { get; set; }
        public bool? IsPolymorphicSource { get; set; }
        public JToken Entity { get; set; }
        public string Name { get; set; }
        public List<JToken> AppliedTraits { get; set; }
        public JToken ResolutionGuidance { get; set; }
    }
}
