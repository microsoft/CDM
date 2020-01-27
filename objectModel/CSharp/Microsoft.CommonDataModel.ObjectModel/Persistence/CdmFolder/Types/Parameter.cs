//-----------------------------------------------------------------------
// <copyright file="Parameter.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    public class Parameter
    {
        public string Explanation { get; set; }
        public string Name { get; set; }
        public JToken DefaultValue { get; set; }

        public bool? Required { get; set; }
        public string Direction { get; set; }
        public JToken DataType { get; set; }
    }
}
