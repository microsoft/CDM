// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types
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
