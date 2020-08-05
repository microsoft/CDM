// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json;

    /// <summary>
    /// OperationBase class
    /// </summary>
    public class OperationBase
    {
        [JsonProperty("$type", Order = -2)]
        public string Type { get; internal set; }

        public string Explanation { get; set; }
    }
}
