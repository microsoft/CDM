// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System.Collections.Generic;

    /// <summary>
    /// This node maintains the attribute's state during projection and between stages of a operations 
    /// and links to collection of previous projection states
    /// </summary>
    internal sealed class ProjectionAttributeState
    {
        /// <summary>
        /// Keep context for error logging
        /// </summary>
        private CdmCorpusContext Ctx;

        /// <summary>
        /// Current resolved attribute
        /// </summary>
        internal ResolvedAttribute CurrentResolvedAttribute { get; set; }

        /// <summary>
        /// Keep a list of original polymorphic source states
        /// </summary>
        internal List<ProjectionAttributeState> PreviousStateList { get; set; }
        
        /// <summary>
        /// The attribute ordinal originated from the array expansion operation
        /// </summary>
        internal int? Ordinal { get; set; }

        /// <summary>
        /// Create a new empty state
        /// </summary>
        public ProjectionAttributeState(CdmCorpusContext Ctx)
        {
            this.Ctx = Ctx;
            CurrentResolvedAttribute = null;
            PreviousStateList = null;
        }

        /// <summary>
        /// Creates a copy of the state and sets its previous state to be itself
        /// </summary>
        internal ProjectionAttributeState Copy()
        {
            ProjectionAttributeState copy = new ProjectionAttributeState(this.Ctx)
            {
                CurrentResolvedAttribute = this.CurrentResolvedAttribute,
                PreviousStateList = new List<ProjectionAttributeState> { this },
                Ordinal = this.Ordinal
            };

            return copy;
        }
    }
}
