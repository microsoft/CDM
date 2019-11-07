//-----------------------------------------------------------------------
// <copyright file="AttributeResolutionApplier.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System;
    public class AttributeResolutionApplier
    {
        internal string MatchName { get; set; }
        internal int Priority { get; set; }

        internal bool OverridesBase { get; set; }
        internal Func<ResolveOptions, CdmAttributeResolutionGuidance, bool> WillAlterDirectives { get; set; }
        internal Action<ResolveOptions, CdmAttributeResolutionGuidance> DoAlterDirectives { get; set; }
        internal Func<ApplierContext, bool> WillCreateContext { get; set; }
        internal Action<ApplierContext> DoCreateContext { get; set; }
        internal Func<ApplierContext, bool> WillRemove { get; set; }
        internal Func<ApplierContext, bool> WillAttributeModify { get; set; }
        internal Action<ApplierContext> DoAttributeModify { get; set; }
        internal Func<ApplierContext, bool> WillGroupAdd { get; set; }
        internal Action<ApplierContext> DoGroupAdd { get; set; }
        internal Func<ApplierContext, bool> WillRoundAdd { get; set; }
        internal Action<ApplierContext> DoRoundAdd { get; set; }
        internal Func<ApplierContext, bool> WillAttributeAdd { get; set; }
        internal Action<ApplierContext> DoAttributeAdd { get; set; }
    }
}
