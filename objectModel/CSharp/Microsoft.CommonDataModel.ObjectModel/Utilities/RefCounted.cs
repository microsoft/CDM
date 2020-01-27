//-----------------------------------------------------------------------
// <copyright file="RefCounted.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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
