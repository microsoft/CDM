//-----------------------------------------------------------------------
// <copyright file="TraitReferenceDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class TraitReferenceDefintion
    {
        public dynamic TraitReference { get; set; }
        public List<JToken> Arguments { get; set; }
        public List<JToken> AppliedTraits { get; set; }
    }
}
