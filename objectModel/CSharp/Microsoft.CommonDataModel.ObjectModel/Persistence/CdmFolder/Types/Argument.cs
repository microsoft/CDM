//-----------------------------------------------------------------------
// <copyright file="Argument.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;

    public class Argument
    {
        public string Explanation { get; set; }

        public string Name { get; set; }

        public JToken Value { get; set; }
    }
}
