// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    /// <summary>
    /// OperationCombineAttributes class
    /// </summary>
    public class OperationCombineAttributes : OperationBase
    {
        public List<string> Take { get; set; }

        public JToken MergeInto { get; set; }
    }
}
