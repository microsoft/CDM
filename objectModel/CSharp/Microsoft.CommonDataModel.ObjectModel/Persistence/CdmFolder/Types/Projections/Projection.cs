// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    /// <summary>
    /// Projection class
    /// </summary>
    public class Projection
    {
        public string Explanation { get; set; }

        public string Condition { get; set; }

        public List<OperationBase> Operations { get; set; }

        public dynamic Source { get; set; }
    }
}
