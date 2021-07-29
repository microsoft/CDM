// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json.Linq;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    /// <summary>
    /// OperationAddArtifactAttribute class
    /// </summary>
    public class OperationAddArtifactAttribute : OperationBase
    {
        public JToken NewAttribute { get; set; }
        public bool? InsertAtTop { get; set; }
    }
}
