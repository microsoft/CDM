// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    public class TraitReferenceDefinition
    {
        public dynamic TraitReference { get; set; }
        public List<JToken> Arguments { get; set; }
        public List<JToken> AppliedTraits { get; set; }
        public bool? Optional { get; set; }
    }
}
