//-----------------------------------------------------------------------
// <copyright file="EntityAttribute.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class EntityAttribute
    {
        public string Explanation { get; set; }
        public JToken Purpose { get; set; }

        public JToken Entity { get; set; }
        public string Name { get; set; }
        public List<JToken> AppliedTraits { get; set; }
        public JToken ResolutionGuidance { get; set; }
    }
}
