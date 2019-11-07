//-----------------------------------------------------------------------
// <copyright file="AttributeResolutionApplierCapabilities.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    internal class AttributeResolutionApplierCapabilities
    {
        public bool CanAlterDirectives { get; set; }
        public bool CanCreateContext { get; set; }
        public bool CanRemove { get; set; }
        public bool CanAttributeModify { get; set; }
        public bool CanGroupAdd { get; set; }
        public bool CanRoundAdd { get; set; }
        public bool CanAttributeAdd { get; set; }

        public AttributeResolutionApplierCapabilities()
        { }

        public AttributeResolutionApplierCapabilities(AttributeResolutionApplierCapabilities caps)
        {
            this.CanAlterDirectives = caps.CanAlterDirectives;
            this.CanCreateContext = caps.CanCreateContext;
            this.CanRemove = caps.CanRemove;
            this.CanAttributeModify = caps.CanAttributeModify;
            this.CanGroupAdd = caps.CanGroupAdd;
            this.CanRoundAdd = caps.CanRoundAdd;
            this.CanAttributeAdd = caps.CanAttributeAdd;
        }
    }
}
