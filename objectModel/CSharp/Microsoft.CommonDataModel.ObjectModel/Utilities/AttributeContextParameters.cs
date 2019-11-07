//-----------------------------------------------------------------------
// <copyright file="AttributeContextParameters.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;

    // the description of a new attribute context into which a set of resolved attributes should be placed.
    internal class AttributeContextParameters
    {
        internal string Name;
        internal bool IncludeTraits;
        internal CdmAttributeContext under;
        internal CdmAttributeContextType type;
        internal CdmObject Regarding;
    }
}
