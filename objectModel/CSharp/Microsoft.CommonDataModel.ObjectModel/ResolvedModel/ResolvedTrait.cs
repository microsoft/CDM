// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Collections.Generic;

    internal class ResolvedTrait
    {
        public CdmTraitDefinition Trait { get; set; }
        internal ParameterValueSet ParameterValues { get; set; }

        internal ResolvedTrait(CdmTraitDefinition trait, ParameterCollection parameterCollection, List<dynamic> values, List<bool> wasSet)
        {
            if (parameterCollection?.Sequence?.Count > 0)
                this.ParameterValues = new ParameterValueSet(trait.Ctx, parameterCollection, values, wasSet);
            this.Trait = trait;
        }

        public string TraitName
        {
            get
            {
                return (this.Trait as CdmTraitDefinition)?.DeclaredPath;
            }
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent)
        {
            to.SpewLine($"{indent}[{this.TraitName}]");
            if (this.ParameterValues != null)
                this.ParameterValues.Spew(resOpt, to, indent + '-');
        }

        public ResolvedTrait Copy()
        {
            if (this.ParameterValues != null)
            {
                ParameterValueSet copyParamValues = this.ParameterValues.Copy();
                return new ResolvedTrait(this.Trait, copyParamValues.PC, copyParamValues.Values, copyParamValues.WasSet);
            }
            return new ResolvedTrait(this.Trait, null, null, null);
        }

        public void CollectTraitNames(ResolveOptions resOpt, ISet<string> into)
        {
            CdmTraitDefinition currentTrait = this.Trait;
            while (currentTrait != null)
            {
                string name = currentTrait.GetName();
                into.Add(name);
                CdmTraitReference baseRef = currentTrait.ExtendsTrait;
                currentTrait = baseRef != null ? baseRef.FetchObjectDefinition<CdmTraitDefinition>(resOpt) : null;
            }
        }
    }
}
