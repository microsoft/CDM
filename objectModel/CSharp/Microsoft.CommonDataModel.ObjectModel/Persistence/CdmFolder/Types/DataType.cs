// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class DataType
    {
        public string Explanation { get; set; }
        public string DataTypeName { get; set; }
        public JToken ExtendsDataType { get; set; }
        public List<JToken> ExhibitsTraits { get; set; }
    }
}
