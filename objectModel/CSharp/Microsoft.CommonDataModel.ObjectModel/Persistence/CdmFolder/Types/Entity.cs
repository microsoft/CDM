//-----------------------------------------------------------------------
// <copyright file="Entity.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
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
