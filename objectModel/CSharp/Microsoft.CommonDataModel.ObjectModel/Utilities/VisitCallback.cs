//-----------------------------------------------------------------------
// <copyright file="VisitCallback.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System;

    public class VisitCallback
    {
        public Func<CdmObject, string, bool> Invoke { get; set; }
    }
}
