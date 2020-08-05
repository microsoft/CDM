// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    /// <summary>
    /// OperationArrayExpansion class
    /// </summary>
    public class OperationArrayExpansion : OperationBase
    {
        public int? StartOrdinal { get; set; }

        public int? EndOrdinal { get; set; }
    }
}
