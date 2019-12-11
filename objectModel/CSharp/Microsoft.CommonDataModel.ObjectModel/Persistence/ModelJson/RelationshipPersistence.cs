namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// The relationship persistence.
    /// </summary>
    class RelationshipPersistence
    {
        public static async Task<CdmE2ERelationship> FromData(CdmCorpusContext ctx, SingleKeyRelationship obj, Dictionary<string, string> entitySchemaByName)
        {
            // TODO: re-add this once Dan's serializer is merged. 
            // The type attribute is not being set by the default serializer because of the Order property.
            // Since we just have one type for now this should be okay.
            /*if (obj.Type != "SingleKeyRelationship")
            {
                // We don't have any other type of a relationship yet!
                return null;
            }*/

            if (!entitySchemaByName.ContainsKey(obj.FromAttribute.EntityName))
            {
                Logger.Warning(nameof(RelationshipPersistence), ctx, $"Relationship's source entity '{obj.FromAttribute.EntityName}' is not defined.");

                return null;
            }

            if (!entitySchemaByName.ContainsKey(obj.ToAttribute.EntityName))
            {
                Logger.Warning(nameof(RelationshipPersistence), ctx, $"Relationship's target entity '{obj.ToAttribute.EntityName}' is not defined.");

                return null;
            }
            
            var relationship = ctx.Corpus.MakeObject<CdmE2ERelationship>(CdmObjectType.E2ERelationshipDef, obj.Name);

            await Utils.ProcessAnnotationsFromData(ctx, obj, relationship.ExhibitsTraits);

            relationship.Explanation = obj.Description;
            relationship.FromEntity = entitySchemaByName[obj.FromAttribute.EntityName];
            relationship.ToEntity = entitySchemaByName[obj.ToAttribute.EntityName];
            relationship.FromEntityAttribute = obj.FromAttribute.AttributeName;
            relationship.ToEntityAttribute = obj.ToAttribute.AttributeName;

            return relationship;
        }

        public static async Task<SingleKeyRelationship> ToData(CdmE2ERelationship instance, ResolveOptions resOpt, CopyOptions options)
        {
            var fromAttribute = new AttributeReference
            {
                EntityName = GetEntityName(instance.FromEntity),
                AttributeName = instance.FromEntityAttribute
            };

            var toAttribute = new AttributeReference
            {
                EntityName = GetEntityName(instance.ToEntity),
                AttributeName = instance.ToEntityAttribute
            };
            
            var result = new SingleKeyRelationship
            {
                Type = "SingleKeyRelationship",
                Description = instance.Explanation,
                Name = instance.Name,
                FromAttribute = fromAttribute,
                ToAttribute = toAttribute
            };

            await Utils.ProcessAnnotationsToData(instance.Ctx, result, instance.ExhibitsTraits);

            return result;
        }

        private static string GetEntityName(string corpusPath)
        {
            var lastSlashIndex = corpusPath.LastIndexOf("/");

            if (lastSlashIndex != -1)
            {
                return corpusPath.Slice(lastSlashIndex + 1);
            }

            return corpusPath;
        }
    }
}
