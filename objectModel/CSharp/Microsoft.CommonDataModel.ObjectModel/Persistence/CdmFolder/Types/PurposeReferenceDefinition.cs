//-----------------------------------------------------------------------
// <copyright file="PurposeReferenceDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    public class PurposeReferenceDefinition
    {
        public dynamic PurposeReference { get; set; }
        public List<JToken> AppliedTraits { get; set; }
    }
}
