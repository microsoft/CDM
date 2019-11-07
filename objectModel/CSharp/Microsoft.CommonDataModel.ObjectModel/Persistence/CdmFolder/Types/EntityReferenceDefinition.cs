//-----------------------------------------------------------------------
// <copyright file="EntityReferenceDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class EntityReferenceDefinition
    {
        public dynamic EntityReference { get; set; }
        public List<JToken> AppliedTraits { get; set; }
    }
}
