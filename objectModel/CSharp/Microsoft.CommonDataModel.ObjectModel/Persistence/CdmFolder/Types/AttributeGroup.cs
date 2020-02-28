// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    public class AttributeGroup
    {
        public string Explanation { get; set; }

        public string AttributeGroupName { get; set; }
        public string AttributeContext { get; set; }

        public List<JToken> Members { get; set; }
        public List<JToken> ExhibitsTraits { get; set; }
    }
}
