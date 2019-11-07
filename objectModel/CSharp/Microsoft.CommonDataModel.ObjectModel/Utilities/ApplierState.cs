//-----------------------------------------------------------------------
// <copyright file="ApplierState.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using System;

    internal class ApplierState
    {
        internal bool Flex_remove { get; set; }
        internal ResolvedAttribute Array_template { get; set; }
        internal int? Flex_currentOrdinal { get; set; }
        internal int? Array_finalOrdinal { get; set; }
        internal int? Array_initialOrdinal { get; set; }
        internal Action<ApplierContext> Array_specializedContext { get; set; }


        internal ApplierState Copy()
        {
            return new ApplierState
            {
                Flex_remove = Flex_remove,
                Array_template = Array_template,
                Flex_currentOrdinal = Flex_currentOrdinal,
                Array_finalOrdinal = Array_finalOrdinal,
                Array_initialOrdinal = Array_initialOrdinal,
                Array_specializedContext = Array_specializedContext
            };
        }
    }
}
