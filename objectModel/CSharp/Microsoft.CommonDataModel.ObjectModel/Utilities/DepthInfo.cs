// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;

    internal class DepthInfo
    {
        /// <summary>
        /// The max depth set if the user specified to not use max depth
        /// </summary>
        internal static readonly int MaxDepthLimit = 32;

        /// <summary>
        /// The maximum depth that we can resolve entity attributes.
        /// This value is set in resolution guidance.
        /// </summary>
        internal int? MaxDepth { get; set; }

        /// <summary>
        /// The current depth that we are resolving at. Each entity attribute that we resolve
        /// into adds 1 to depth.
        /// </summary>
        internal int CurrentDepth { get; set; }

        /// <summary>
        /// Indicates if the maxDepth value has been hit when resolving
        /// </summary>
        internal bool MaxDepthExceeded { get; set; }


        internal DepthInfo()
        {
            this.Reset();
        }

        /// <summary>
        /// Resets the instance to its initial values.
        /// </summary>
        internal void Reset()
        {
            this.MaxDepth = null;
            this.CurrentDepth = 0;
            this.MaxDepthExceeded = false;
        }

        /// <summary>
        /// Creates a copy of this depth info instance.
        /// </summary>
        /// <returns></returns>
        internal DepthInfo Copy()
        {
            DepthInfo copy = new DepthInfo
            {
                CurrentDepth = this.CurrentDepth,
                MaxDepth = this.MaxDepth,
                MaxDepthExceeded = this.MaxDepthExceeded
            };

            return copy;
        }

        /// <summary>
        /// Updates this depth info to the next level.
        /// </summary>
        /// <param name="resOpt"></param>
        /// <param name="isPolymorphic"></param>
        /// <param name="arc"></param>
        internal void UpdateToNextLevel(ResolveOptions resOpt, bool? isPolymorphic, AttributeResolutionContext arc = null)
        {
            AttributeResolutionDirectiveSet directives = resOpt.Directives;
            bool isByRef = false;

            this.MaxDepth = resOpt.MaxDepth;

            // if using resolution guidance, read its properties first
            if (arc != null)
            {
                if (arc.ResOpt != null)
                {
                    directives = arc.ResOpt.Directives;

                    if (isPolymorphic == null)
                    {
                        isPolymorphic = directives?.Has("selectOne") == true;
                    }
                }

                if (arc.ResGuide?.entityByReference != null)
                {
                    if (arc.ResGuide.entityByReference.referenceOnlyAfterDepth != null)
                    {
                        this.MaxDepth = (int)arc.ResGuide.entityByReference.referenceOnlyAfterDepth;
                    }

                    if (arc.ResGuide.entityByReference.allowReference == true)
                    {
                        isByRef = directives?.Has("referenceOnly") == true;
                    }
                }
            }

            if (directives != null)
            {
                if (directives.Has("noMaxDepth"))
                {
                    // no max? really? what if we loop forever? if you need more than 32 nested entities, then you should buy a different metadata description system
                    this.MaxDepth = MaxDepthLimit;
                }
            }

            // if this is a polymorphic, then skip counting this entity in the depth, else count it
            // if it's already by reference, we won't go one more level down so don't increase current depth
            if (isPolymorphic != true && !isByRef)
            {
                this.CurrentDepth++;

                if (this.CurrentDepth > this.MaxDepth)
                {
                    this.MaxDepthExceeded = true;
                }
            }
        }
    }
}
