// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    internal abstract class CallData
    {
        internal int Calls { get; set; }
        internal int TimeTotal { get; set; }
        internal int TimeExl { get; set; }
    }
}
