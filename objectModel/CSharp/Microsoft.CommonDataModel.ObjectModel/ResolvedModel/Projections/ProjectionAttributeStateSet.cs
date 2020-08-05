// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System.Collections.Generic;

    /// <summary>
    /// A collection of ProjectionAttributeState with a hash for a easy search
    /// and links to collection of previous projection states
    /// </summary>
    internal sealed class ProjectionAttributeStateSet
    {
        /// <summary>
        /// A set with the resolved attribute name as a the key and the projection attribute state as value
        /// </summary>
        private Dictionary<string, ProjectionAttributeState> Set = new Dictionary<string, ProjectionAttributeState>();

        internal CdmCorpusContext Ctx { get; private set; }

        /// <summary>
        /// Create a new empty state set
        /// </summary>
        public ProjectionAttributeStateSet(CdmCorpusContext Ctx)
        {
            this.Ctx = Ctx;
        }

        /// <summary>
        /// Add to the collection
        /// </summary>
        /// <param name="pas"></param>
        internal void Add(ProjectionAttributeState pas)
        {
            if (pas == null ||
                pas.CurrentResolvedAttribute == null ||
                string.IsNullOrWhiteSpace(pas.CurrentResolvedAttribute.ResolvedName))
            {
                Logger.Error(nameof(ProjectionAttributeStateSet), this.Ctx, $"Invalid ProjectionAttributeState provided for addition to the Set. Add operation failed.", nameof(Add));
            }
            else
            {
                Set.Add(pas.CurrentResolvedAttribute.ResolvedName, pas);
            }
        }

        /// <summary>
        /// Remove from collection if key is found
        /// </summary>
        /// <param name="resolvedAttributeName"></param>
        /// <returns></returns>
        internal bool Remove(string resolvedAttributeName)
        {
            if (Set.Remove(resolvedAttributeName))
            {
                return true;
            }
            else
            {
                Logger.Warning(nameof(ProjectionAttributeStateSet), this.Ctx, $"Invalid ProjectionAttributeState provided for removal from the Set. Remove operation failed.", nameof(Remove));
                return false;
            }
        }

        /// <summary>
        /// Remove from collection if key is found
        /// </summary>
        /// <param name="resolvedAttributeName"></param>
        /// <returns></returns>
        internal bool Remove(ProjectionAttributeState pas)
        {
            bool result = false;
            if (Set.ContainsKey(pas.CurrentResolvedAttribute.ResolvedName) &&
                Set[pas.CurrentResolvedAttribute.ResolvedName] == pas)
            {
                result = Remove(pas.CurrentResolvedAttribute.ResolvedName);
            }
            else
            {
                Logger.Warning(nameof(ProjectionAttributeStateSet), this.Ctx, $"Invalid ProjectionAttributeState provided for removal from the Set. Remove operation failed.", nameof(Remove));
            }

            return result;
        }

        /// <summary>
        /// Check if exists in collection
        /// </summary>
        /// <param name="resolvedAttributeName"></param>
        /// <returns></returns>
        internal bool Contains(string resolvedAttributeName)
        {
            return Set.ContainsKey(resolvedAttributeName);
        }

        /// <summary>
        /// Find in collection
        /// </summary>
        /// <param name="resolvedAttributeName"></param>
        /// <returns></returns>
        internal ProjectionAttributeState GetValue(string resolvedAttributeName)
        {
            ProjectionAttributeState pas;
            return (Set.TryGetValue(resolvedAttributeName, out pas)) ? pas : null;
        }

        /// <summary>
        /// Get a list of values
        /// </summary>
        internal IEnumerable<ProjectionAttributeState> Values
        {
            get
            {
                return Set.Values;
            }
        }
    }
}
