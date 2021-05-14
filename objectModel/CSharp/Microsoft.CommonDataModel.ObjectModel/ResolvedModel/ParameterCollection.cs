// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System;
    using System.Collections.Generic;

    internal class ParameterCollection
    {
        internal List<CdmParameterDefinition> Sequence { get; set; }
        internal IDictionary<string, CdmParameterDefinition> Lookup { get; set; }
        internal IDictionary<CdmParameterDefinition, int> Ordinals { get; set; }
        public ParameterCollection(ParameterCollection prior)
        {
            if (prior?.Sequence != null)
            {
                this.Sequence = new List<CdmParameterDefinition>(prior.Sequence);
            }
            else
            {
                this.Sequence = new List<CdmParameterDefinition>();
            }

            this.Lookup = prior?.Lookup != null ? new Dictionary<string, CdmParameterDefinition>(prior.Lookup) : new Dictionary<string, CdmParameterDefinition>();
            this.Ordinals = prior?.Ordinals != null ? new Dictionary<CdmParameterDefinition, int>(prior.Ordinals) : new Dictionary<CdmParameterDefinition, int>();
        }

        public void Add(CdmParameterDefinition element)
        {
            string name = element.Name;
            if (!string.IsNullOrEmpty(name))
            {
                if (this.Lookup.ContainsKey(name))
                {
                    // why not just replace the old one?
                    this.Lookup[name] = element;
                    this.Sequence[this.Sequence.IndexOf(this.Sequence.Find((e) => e.GetName() == name))] = element;
                    this.Ordinals[element] = this.Sequence.Count;
                    return;
                }
                else
                {
                    this.Lookup.Add(name, element);
                }
            }
            this.Ordinals.Add(element, this.Sequence.Count);
            this.Sequence.Add(element);
        }

        public CdmParameterDefinition ResolveParameter(int ordinal, string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                if (this.Lookup.ContainsKey(name))
                {
                    return this.Lookup[name];
                }
                else
                {
                    throw new Exception($"There is no parameter named {name}");
                }
            }

            if (ordinal >= this.Sequence.Count)
            {
                throw new Exception("Too many arguments supplied");
            }

            return this.Sequence[ordinal];
        }

        public int FetchParameterIndex(string paramName)
        {
            return this.Ordinals[this.Lookup[paramName]];
        }
    }
}
