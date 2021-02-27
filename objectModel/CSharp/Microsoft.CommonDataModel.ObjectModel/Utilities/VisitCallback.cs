// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System;

    public class VisitCallback
    {
        public Func<CdmObject, string, bool> Invoke { get; set; }
    }
}
