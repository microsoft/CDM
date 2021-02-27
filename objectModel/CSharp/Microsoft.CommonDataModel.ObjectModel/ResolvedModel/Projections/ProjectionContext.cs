// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;

    /// <summary>
    /// Context for each projection or nested projection
    /// </summary>
    internal sealed class ProjectionContext
    {
        /// <summary>
        /// Directive passed to the root projection
        /// </summary>
        internal ProjectionDirective ProjectionDirective { get; set; }

        /// <summary>
        /// The attribute context of the current resolve attribute
        /// </summary>
        internal CdmAttributeContext CurrentAttributeContext { get; set; }

        /// <summary>
        /// A list of attribute state
        /// </summary>
        internal ProjectionAttributeStateSet CurrentAttributeStateSet { get; set; }

        public ProjectionContext(ProjectionDirective projDirective, CdmAttributeContext attrCtx)
        {
            this.ProjectionDirective = projDirective;

            this.CurrentAttributeContext = attrCtx;

            this.CurrentAttributeStateSet = new ProjectionAttributeStateSet(projDirective?.Owner?.Ctx);
        }
    }
}
