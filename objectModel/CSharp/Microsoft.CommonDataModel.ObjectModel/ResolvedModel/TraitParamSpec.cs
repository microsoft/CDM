//-----------------------------------------------------------------------
// <copyright file="TraitParamSpec.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using System.Collections.Generic;

    internal class TraitParamSpec
    {
        internal string TraitBaseName { get; set; }
        internal IDictionary<string, string> Parameters { get; set; }
    }
}