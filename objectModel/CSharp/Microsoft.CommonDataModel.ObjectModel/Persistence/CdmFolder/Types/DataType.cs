//-----------------------------------------------------------------------
// <copyright file="DataType.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class DataType
    {
        public string Explanation { get; set; }
        public string DataTypeName { get; set; }
        public JToken ExtendsDataType { get; set; }
        public List<JToken> ExhibitsTraits { get; set; }
    }
}
