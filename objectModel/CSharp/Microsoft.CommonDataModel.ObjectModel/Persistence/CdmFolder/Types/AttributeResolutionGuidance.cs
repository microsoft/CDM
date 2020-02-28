// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    public class AttributeResolutionGuidance
    {
        public bool? removeAttribute  {get; set;}
        public List<string> imposedDirectives  {get; set;}
        public List<string> removedDirectives  {get; set;}

        public JToken addSupportingAttribute  {get; set;}
        public string cardinality  {get; set;}
        public string renameFormat  {get; set;}
        public class Expansion {
            public int? startingOrdinal  {get; set;}
            public int? maximumExpansion  {get; set;}
            public JToken countAttribute  {get; set;}
        }
        public Expansion expansion  {get; set;}
        public class CdmAttributeResolutionGuidance_EntityByReference {
            public bool? allowReference  {get; set;}
            public bool? alwaysIncludeForeignKey  {get; set;}
            public int? referenceOnlyAfterDepth  {get; set;}
            public JToken foreignKeyAttribute  {get; set;}
        }
        public CdmAttributeResolutionGuidance_EntityByReference entityByReference  {get; set;}
        public class CdmAttributeResolutionGuidance_SelectsSubAttribute {
            public string selects {get; set;}
            public JToken selectedTypeAttribute  {get; set;}
            public List<string> selectsSomeTakeNames { get; set; }
            public List<string> selectsSomeAvoidNames { get; set; }
        }
        public CdmAttributeResolutionGuidance_SelectsSubAttribute selectsSubAttribute  {get; set;}
    }
}
