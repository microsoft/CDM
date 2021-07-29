// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types
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
