//-----------------------------------------------------------------------
// <copyright file="DataTypeReferenceDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class DataTypeReferenceDefinition
    {
        public JToken DataTypeReference { get; set; }
        public List<JToken> AppliedTraits { get; set; }
    }
}
