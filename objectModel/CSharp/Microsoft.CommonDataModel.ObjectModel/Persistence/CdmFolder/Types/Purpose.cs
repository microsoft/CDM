//-----------------------------------------------------------------------
// <copyright file="Relationship.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class Purpose
    {
        public string Explanation { get; set; }
        public string PurposeName { get; set; }
        public JToken ExtendsPurpose { get; set; }
        public List<JToken> ExhibitsTraits { get; set; }
    }
}
