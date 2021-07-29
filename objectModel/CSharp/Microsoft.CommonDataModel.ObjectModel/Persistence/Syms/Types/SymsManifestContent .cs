// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types
{
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class SymsManifestContent
    {
        public DatabaseEntity Database { get; set; }
        public List<TableEntity> Entities { get; set; }
        public List<RelationshipEntity> Relationships { get; set; }
    }
    public class SymsDatabasesResponse
    {
        [JsonProperty("items")]
        public List<DatabaseEntity> Databases { get; set; }
    }

    public class SymsRelationshipResponse
    {
        [JsonProperty("items")]
        public List<RelationshipEntity> Relationships { get; set; }
    }
}
