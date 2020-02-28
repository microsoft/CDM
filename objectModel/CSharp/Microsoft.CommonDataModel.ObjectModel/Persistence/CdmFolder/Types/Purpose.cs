// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class Purpose
    {
        public string Explanation { get; set; }
        public string PurposeName { get; set; }
        public JToken ExtendsPurpose { get; set; }
        public List<JToken> ExhibitsTraits { get; set; }
    }
}
