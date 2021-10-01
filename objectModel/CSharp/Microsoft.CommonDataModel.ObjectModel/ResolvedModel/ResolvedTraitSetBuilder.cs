// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    internal class ResolvedTraitSetBuilder
    {
        internal ResolvedTraitSet ResolvedTraitSet { get; set; }

        public void Clear()
        {
            this.ResolvedTraitSet = null;
        }

        internal void MergeTraits(ResolvedTraitSet rtsNew)
        {
            if (rtsNew != null)
            {
                if (this.ResolvedTraitSet == null)
                {
                    this.ResolvedTraitSet = new ResolvedTraitSet(rtsNew.ResOpt);
                }
                this.ResolvedTraitSet = this.ResolvedTraitSet.MergeSet(rtsNew);
            }
        }

        internal void TakeReference(ResolvedTraitSet rtsNew)
        {
            this.ResolvedTraitSet = rtsNew;
        }

        public void OwnOne(ResolvedTrait rt, ResolveOptions resOpt)
        {
            this.ResolvedTraitSet = new ResolvedTraitSet(resOpt);
            this.ResolvedTraitSet.Merge(rt, false);
        }

        public void SetTraitParameterValue(ResolveOptions resOpt, CdmTraitDefinition toTrait, string paramName, dynamic value)
        {
            this.ResolvedTraitSet = this.ResolvedTraitSet.SetTraitParameterValue(resOpt, toTrait, paramName, value);
        }

        public void ReplaceTraitParameterValue(ResolveOptions resOpt, string toTrait, string paramName, dynamic valueWhen, dynamic valueNew)
        {
            if (this.ResolvedTraitSet != null)
            {
                this.ResolvedTraitSet = this.ResolvedTraitSet.ReplaceTraitParameterValue(resOpt, toTrait, paramName, valueWhen, valueNew);
            }
        }
    }
}
