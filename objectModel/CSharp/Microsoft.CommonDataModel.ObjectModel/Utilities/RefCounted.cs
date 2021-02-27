// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    internal class RefCounted
    {
        internal int RefCnt { get; set; }
        internal RefCounted()
        {
            this.RefCnt = 0;
        }
        internal void AddRef()
        {
            this.RefCnt++;
        }
        internal void Release()
        {
            this.RefCnt--;
        }
    }
}
