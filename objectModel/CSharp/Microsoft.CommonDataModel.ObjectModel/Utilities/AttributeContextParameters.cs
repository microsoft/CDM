// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
        internal AttributeContextParameters Copy()
        {
            AttributeContextParameters c = new AttributeContextParameters();
            c.Name = this.Name;
            c.IncludeTraits = this.IncludeTraits;
            c.under = this.under;
            c.type = this.type;
            c.Regarding = this.Regarding;
            return c;
        }

    }
}
