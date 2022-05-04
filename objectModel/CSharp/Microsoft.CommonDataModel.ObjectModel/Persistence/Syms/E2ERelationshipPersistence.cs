// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using System.Collections.Generic;
    using Newtonsoft.Json.Linq;

    class E2ERelationshipPersistence
    {
        public static List<CdmE2ERelationship> FromData(CdmCorpusContext ctx, RelationshipEntity relationshipEntity)
        {
            List<CdmE2ERelationship> relationships = new List<CdmE2ERelationship>();

            RelationshipProperties relationshipProperties = ((JToken)relationshipEntity.Properties).ToObject<RelationshipProperties>(); 
            foreach (var columnRelationshipInformation in relationshipProperties.ColumnRelationshipInformations)
            {
                var relationship = ctx.Corpus.MakeObject<CdmE2ERelationship>(CdmObjectType.E2ERelationshipDef);
                if (!string.IsNullOrWhiteSpace(relationshipEntity.Name))
                {
                    relationship.Name = relationshipEntity.Name;
                }

                if (relationshipProperties.RelationshipType == RelationshipType.MANYTOONE ||
                    relationshipProperties.RelationshipType == RelationshipType.ONETOONE)
                {
                    relationship.FromEntity = $"{relationshipProperties.FromTableName}.cdm.json/{relationshipProperties.FromTableName}";
                    relationship.ToEntity = $"{relationshipProperties.ToTableName}.cdm.json/{relationshipProperties.ToTableName}";
                    relationship.FromEntityAttribute = columnRelationshipInformation.FromColumnName;
                    relationship.ToEntityAttribute = columnRelationshipInformation.ToColumnName;
                }
                else if (relationshipProperties.RelationshipType == RelationshipType.ONETOMANY)
                {
                    relationship.FromEntity = $"{relationshipProperties.ToTableName}.cdm.json/{relationshipProperties.ToTableName}";
                    relationship.ToEntity = $"{relationshipProperties.FromTableName}.cdm.json/{relationshipProperties.FromTableName}";
                    relationship.FromEntityAttribute = columnRelationshipInformation.ToColumnName;
                    relationship.ToEntityAttribute = columnRelationshipInformation.FromColumnName;
                }
                else if (relationshipProperties.RelationshipType == RelationshipType.MANYTOMANY)
                {
                    // error
                    return null;
                }

                if (relationshipProperties.Properties != null)
                {
                    if (relationshipProperties.Properties.ContainsKey("cdm:exhibitsTraits"))
                    {
                        Utils.AddListToCdmCollection(relationship.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, relationshipProperties.Properties["cdm:exhibitsTraits"]));
                    }
                }
                relationships.Add(relationship);
            }

            return relationships;
        }

        public static RelationshipEntity ToData(CdmE2ERelationship instance, string dbName, ResolveOptions resOpt, CopyOptions options, IDictionary<string, RelationshipEntity> relationship = null)
        {
            var properties = new Dictionary<string, JToken>();
            if (instance.ExhibitsTraits != null && instance.ExhibitsTraits.Count > 0)
            {
                properties["cdm:exhibitsTraits"] = JToken.FromObject(CopyDataUtils.ListCopyData(resOpt, instance.ExhibitsTraits, options));
            }

            var relationshipProperties = new RelationshipProperties
            {
                NamespaceProperty = new NamespaceModel { DatabaseName = dbName },
                FromTableName = Utils.ExtractTableNameFromEntityPath(instance.FromEntity),
                ToTableName = Utils.ExtractTableNameFromEntityPath(instance.ToEntity),
                Properties = properties,
                PublishStatus = PublishStatus.PUBLISHED,
                RelationshipType = RelationshipType.MANYTOONE
            };

             var relationshipName = instance.Name;
            if (StringUtils.IsBlankByCdmStandard(instance.Name))
                relationshipName = $"{relationshipProperties.FromTableName}_{relationshipProperties.ToTableName}_relationship";

            relationshipProperties.ColumnRelationshipInformations = new List<ColumnRelationshipInformation>();
            relationshipProperties.ColumnRelationshipInformations.Add( new ColumnRelationshipInformation(instance.FromEntityAttribute, instance.ToEntityAttribute));

            return new RelationshipEntity
            {
                Name = relationshipName,
                Properties = relationshipProperties,
                Type = SASEntityType.RELATIONSHIP
            };
        }
    }
}
