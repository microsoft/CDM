// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// OperationAddSupportingAttribute class
    /// </summary>
    public class OperationAddSupportingAttribute : OperationBase
    {
        public JToken SupportingAttribute { get; set; }
    }
}
