// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
