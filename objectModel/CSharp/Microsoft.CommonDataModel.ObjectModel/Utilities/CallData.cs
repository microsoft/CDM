//-----------------------------------------------------------------------
// <copyright file="CallData.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    internal abstract class CallData
    {
        internal int Calls { get; set; }
        internal int TimeTotal { get; set; }
        internal int TimeExl { get; set; }
    }
}
