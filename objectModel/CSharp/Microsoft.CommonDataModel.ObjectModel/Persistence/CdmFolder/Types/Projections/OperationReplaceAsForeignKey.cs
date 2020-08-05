// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// OperationReplaceAsForeignKey class
    /// </summary>
    public class OperationReplaceAsForeignKey : OperationBase
    {
        public string Reference { get; set; }

        public JToken ReplaceWith { get; set; }
    }
}
