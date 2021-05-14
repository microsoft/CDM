// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    /// <summary>
    /// OperationRenameAttributes class
    /// </summary>
    public class OperationRenameAttributes : OperationBase
    {
        public string RenameFormat { get; set; }

        public dynamic ApplyTo { get; set; }
    }
}
