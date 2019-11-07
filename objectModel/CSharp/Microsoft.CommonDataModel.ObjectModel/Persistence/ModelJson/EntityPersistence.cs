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
    /// The entity persistence.
    /// </summary>
    class EntityPersistence
    {
        public static async Task<CdmEntityDefinition> FromData(CdmCorpusContext ctx, LocalEntity obj, CdmCollection<CdmTraitDefinition> extensionTraitDefList)
        {
            var entity = ctx.Corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, obj.Name);
            entity.Description = obj.Description;

            await Utils.ProcessAnnotationsFromData(ctx, obj, entity.ExhibitsTraits);

            if (obj.Attributes != null)
            {
                foreach (dynamic attribute in obj.Attributes)
                {
                    var typeAttribute = await TypeAttributePersistence.FromData(ctx, attribute, extensionTraitDefList);
                    if (typeAttribute != null)
                    {
                        entity.Attributes.Add(typeAttribute);
                    }
                    else
                    {
                        Logger.Error(nameof(EntityPersistence), (ResolveContext)ctx, "There was an error while trying to convert model.json attribute to cdm attribute.");
                        return null;
                    }
                }
            }
            ExtensionHelper.ProcessExtensionFromJson(ctx, obj, entity.ExhibitsTraits, extensionTraitDefList);

            return entity;
        }

        public static async Task<LocalEntity> ToData(CdmEntityDefinition instance, ResolveOptions resOpt, CopyOptions options, CdmCorpusContext ctx)
        {
            var result = new LocalEntity
            {
                Name = instance.EntityName,
                Description = instance.Description,
                Type = "LocalEntity"
            };
            
            await Utils.ProcessAnnotationsToData(instance.Ctx, result, instance.ExhibitsTraits);
            
            if (instance.Attributes != null)
            {
                result.Attributes = new List<Attribute>();
                foreach (dynamic element in instance.Attributes)
                {
                    // TODO: handle when attribute is something else other than CdmTypeAttributeDefinition.
                    var attribute = await TypeAttributePersistence.ToData(element as CdmTypeAttributeDefinition, resOpt, options);
                    if (attribute != null)
                    {
                        result.Attributes.Add(attribute);
                    }
                    else
                    {
                        Logger.Error(nameof(EntityPersistence), (ResolveContext)ctx, "There was an error while trying to convert model.json attribute to cdm attribute.");

                        return null;
                    }
                }
            }

            return result;
        }
    }
}
