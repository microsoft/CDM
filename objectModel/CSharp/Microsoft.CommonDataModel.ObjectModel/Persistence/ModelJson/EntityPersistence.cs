// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
        private static readonly string Tag = nameof(EntityPersistence);

        public static async Task<CdmEntityDefinition> FromData(CdmCorpusContext ctx, LocalEntity obj, List<CdmTraitDefinition> extensionTraitDefList, List<CdmTraitDefinition> localExtensionTraitDefList)
        {
            var entity = ctx.Corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, obj.Name);

            if (!string.IsNullOrWhiteSpace(obj.Description))
                entity.Description = obj.Description;

            await Utils.ProcessAnnotationsFromData(ctx, obj, entity.ExhibitsTraits);

            if (obj.Attributes != null)
            {
                foreach (dynamic attribute in obj.Attributes)
                {
                    var typeAttribute = await TypeAttributePersistence.FromData(ctx, attribute, extensionTraitDefList, localExtensionTraitDefList);
                    if (typeAttribute != null)
                    {
                        entity.Attributes.Add(typeAttribute);
                    }
                    else
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistModelJsonToAttrConversionFailure);
                        return null;
                    }
                }
            }
            ExtensionHelper.ProcessExtensionFromJson(ctx, obj, entity.ExhibitsTraits, extensionTraitDefList, localExtensionTraitDefList);

            return entity;
        }

        public static async Task<LocalEntity> ToData(CdmEntityDefinition instance, ResolveOptions resOpt, CopyOptions options, CdmCorpusContext ctx)
        {
            var result = new LocalEntity
            {
                Name = instance.EntityName,
                Description = instance.GetProperty("description"),
                Type = "LocalEntity"
            };

            Utils.ProcessTraitsAndAnnotationsToData(instance.Ctx, result, instance.ExhibitsTraits);

            if (instance.Attributes != null)
            {
                result.Attributes = new List<Attribute>();
                foreach (CdmAttributeItem element in instance.Attributes)
                {
                    if (element.ObjectType != CdmObjectType.TypeAttributeDef)
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(ToData), element.AtCorpusPath, CdmLogCode.ErrPersistModelJsonEntityAttrError);
                        return null;
                    }

                    // TODO: handle when attribute is something else other than CdmTypeAttributeDefinition.
                    var attribute = await TypeAttributePersistence.ToData(element as CdmTypeAttributeDefinition, resOpt, options);
                    if (attribute != null)
                    {
                        result.Attributes.Add(attribute);
                    }
                    else
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(ToData), element.AtCorpusPath, CdmLogCode.ErrPersistModelJsonFromAttrConversionFailure);
                        return null;
                    }
                }
            }

            return result;
        }
    }
}
