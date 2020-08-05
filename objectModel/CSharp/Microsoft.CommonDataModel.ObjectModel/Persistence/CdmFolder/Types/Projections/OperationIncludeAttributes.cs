// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using System.Collections.Generic;

    /// <summary>
    /// OperationIncludeAttributes class
    /// </summary>
    public class OperationIncludeAttributes : OperationBase
    {
        public List<string> IncludeAttributes { get; set; }
    }
}
