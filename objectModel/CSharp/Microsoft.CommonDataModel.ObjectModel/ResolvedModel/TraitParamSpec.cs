// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using System.Collections.Generic;

    internal class TraitParamSpec
    {
        internal string TraitBaseName { get; set; }
        internal IDictionary<string, string> Parameters { get; set; }
    }
}
