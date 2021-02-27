// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class Trait
    {
        public string Explanation { get; set; }
        public string TraitName { get; set; }
        public dynamic ExtendsTrait { get; set; }
        public List<JToken> HasParameters { get; set; }

        public bool? Elevated { get; set; }
        public bool? ModifiesAttributes { get; set; }
        public bool? Ugly { get; set; }
        public List<string> AssociatedProperties { get; set; }
    }
}
