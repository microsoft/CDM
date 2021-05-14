// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;

    internal class ApplierResult
    {
        internal bool? ShouldDelete { get; set; }
        internal dynamic ApplierState { get; set; }
        internal CdmAttribute AddedAttribute { get; set; }
        internal CdmAttributeContext AttCtx { get; set; }
        internal bool? ContinueApplying { get; set; } // if true, request another call to the same method.

    }
}
