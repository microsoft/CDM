// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System.Collections.Generic;

    /// <summary>
    /// A collection of ProjectionAttributeState objects
    /// </summary>
    internal sealed class ProjectionAttributeStateSet
    {
        private static readonly string Tag = nameof(ProjectionAttributeStateSet);

        /// <summary>
        /// A list containing all the ProjectionAttributeStates
        /// </summary>
        internal List<ProjectionAttributeState> States { get; }

        internal CdmCorpusContext Ctx { get; private set; }

        /// <summary>
        /// Create a new empty state set
        /// </summary>
        public ProjectionAttributeStateSet(CdmCorpusContext Ctx)
        {
            this.Ctx = Ctx;
            this.States = new List<ProjectionAttributeState>();
        }

        /// <summary>
        /// Add to the collection
        /// </summary>
        internal void Add(ProjectionAttributeState pas)
        {
            if (pas == null ||
                pas.CurrentResolvedAttribute == null ||
                string.IsNullOrWhiteSpace(pas.CurrentResolvedAttribute.ResolvedName))
            {
                Logger.Error(this.Ctx, Tag, nameof(Add), null, CdmLogCode.ErrProjInvalidAttrState);
            }
            else
            {
                States.Add(pas);
            }
        }

        /// <summary>
        /// Creates a copy of this projection attribute state set
        /// </summary>
        /// <returns></returns>
        internal ProjectionAttributeStateSet Copy()
        {
            ProjectionAttributeStateSet copy = new ProjectionAttributeStateSet(Ctx);
            copy.States.AddRange(this.States);

            return copy;
        }

        /// <summary>
        /// Remove from collection
        /// </summary>
        internal bool Remove(ProjectionAttributeState pas)
        {
            if (pas != null && Contains(pas))
            {
                States.Remove(pas);
                return true;
            }
            else
            {
                Logger.Warning(this.Ctx, Tag, nameof(Remove), null, CdmLogCode.WarnProjRemoveOpsFailed);
                return false;
            }
        }

        /// <summary>
        /// Check if exists in collection
        /// </summary>
        internal bool Contains(ProjectionAttributeState pas)
        {
            return States.Contains(pas);
        }
    }
}
