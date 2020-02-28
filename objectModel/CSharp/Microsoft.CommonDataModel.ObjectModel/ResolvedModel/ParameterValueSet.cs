// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Collections.Generic;

    internal class ParameterValueSet
    {
        internal ParameterCollection PC { get; set; }
        internal List<dynamic> Values { get; set; }
        internal CdmCorpusContext Ctx { get; set; }
        internal int Length
        {
            get
            {
                if (this.PC?.Sequence != null)
                {
                    return this.PC.Sequence.Count;
                }
                return 0;
            }
        }

        internal List<bool> WasSet { get; set; }

        internal ParameterValueSet(CdmCorpusContext ctx, ParameterCollection pc, List<dynamic> values, List<bool> wasSet)
        {
            this.PC = pc;
            this.Values = values;
            this.WasSet = wasSet;
            this.Ctx = ctx;
        }
        public int IndexOf(CdmParameterDefinition paramDef)
        {
            return this.PC.Ordinals[paramDef];
        }
        public CdmParameterDefinition FetchParameterAtIndex(int paramIndex)
        {
            return this.PC.Sequence[paramIndex];
        }
        public dynamic FetchValue(int paramIndex)
        {
            return this.Values[paramIndex];
        }
        public string FetchValueString(ResolveOptions resOpt, int paramIndex)
        {
            return new ParameterValue(this.Ctx, this.PC.Sequence[paramIndex], this.Values[paramIndex]).FetchValueString(resOpt);
        }
        internal ParameterValue FetchParameterValueByName(string paramName)
        {
            int paramIndex = this.PC.FetchParameterIndex(paramName);
            return new ParameterValue(this.Ctx, this.PC.Sequence[paramIndex], this.Values[paramIndex]);
        }

        public void SetParameterValue(ResolveOptions resOpt, string paramName, dynamic value)
        {
            int paramIndex = this.PC.FetchParameterIndex(paramName);
            this.Values[paramIndex] = ParameterValue.FetchReplacementValue(resOpt, this.Values[paramIndex], value, true);
            this.WasSet[paramIndex] = true;
        }

        public ParameterValueSet Copy()
        {
            List<dynamic> copyValues = new List<dynamic>(this.Values);
            List<bool> copyWasSet = new List<bool>(this.WasSet);
            ParameterValueSet copy = new ParameterValueSet(this.Ctx, this.PC, copyValues, copyWasSet);
            return copy;
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent)
        {
            for (int i = 0; i < this.Length; i++)
            {
                ParameterValue parameterValue = new ParameterValue(this.Ctx, this.PC.Sequence[i], this.Values[i]);
                parameterValue.Spew(resOpt, to, indent + '-');
            }
        }
    }
}
