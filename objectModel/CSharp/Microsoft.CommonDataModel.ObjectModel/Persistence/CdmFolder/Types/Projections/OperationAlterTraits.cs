// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    /// <summary>
    /// OperationAlterTraits class
    /// </summary>
    public class OperationAlterTraits : OperationBase
    {
        public List<JToken> TraitsToAdd { get; set; }
        public List<JToken> TraitsToRemove { get; set; }
        public bool? ArgumentsContainWildcards { get; set; }
        public dynamic ApplyTo { get; set; }
    }
}
