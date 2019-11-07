//-----------------------------------------------------------------------
// <copyright file="AttributeContext.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    public class AttributeContext
    {
        public string Explanation { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Parent { get; set; }
        public string Definition { get; set; }
        public List<JToken> AppliedTraits { get; set; }
        public List<JToken> Contents { get; set; }
    }
}
