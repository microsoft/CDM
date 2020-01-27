//-----------------------------------------------------------------------
// <copyright file="ConstantEntity.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class ConstantEntity
    {
        public string Explanation { get; set; }
        public string ConstantEntityName { get; set; }
        public JToken EntityShape { get; set; }
        public List<List<string>> ConstantValues { get; set; }
    }
}
