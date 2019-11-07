//-----------------------------------------------------------------------
// <copyright file="EventCallback.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System;
    public class EventCallback
    {
        public Action<CdmStatusLevel, string> Invoke { get; set; }
    }
}
