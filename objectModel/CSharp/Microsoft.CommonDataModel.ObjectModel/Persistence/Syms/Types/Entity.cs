// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    public class Entity 
    {
        public string Explanation { get; set; }
        public string EntityName { get; set; }
        public JToken ExtendsEntity { get; set; }
        public JToken ExtendsEntityResolutionGuidance { get; set; }
        public List<JToken> ExhibitsTraits { get; set; }
        public JToken AttributeContext { get; set; }
        public List<JToken> HasAttributes { get; set; }
        public string SourceName { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string Version { get; set; }
        public List<string> CdmSchemas { get; set; }
    }
}
